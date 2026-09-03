/**
 * OT and ICS Security Foundations: securing the systems that run a physical
 * process.
 *
 * WHO THIS IS FOR
 *
 * The OT track is unusual in the catalogue because prior industrial experience
 * is worth more on it than prior security experience. A plant electrician, a
 * control systems engineer, or somebody who spent six years on a naval
 * engineering rating already understands the thing IT security people find
 * hardest here: that the process is real, that stopping it costs money or lives,
 * and that an engineer who has been running a line for twenty years is not being
 * obstructive when they refuse your agent.
 *
 * So this package teaches security TO that person, rather than teaching OT to a
 * security person. Where the two framings conflict, it takes the plant side,
 * because that is the reader who can be hired fastest and the one the industry
 * is shortest of.
 *
 * WHY IT NEEDS NO TERMINAL
 *
 * There is no simulated PLC in this platform and inventing one would teach a
 * fiction. What can be taught honestly is the judgement, which is most of the
 * job anyway: what the asset is, why the usual control is wrong here, what you
 * are allowed to touch, and how to say no to a change that would be routine in
 * IT and dangerous on a plant floor. Every exercise grades a determination.
 *
 * NAMED INCIDENTS ARE HELD TO WHAT WAS REPORTED
 *
 * Module ots.7 names real events, on the same terms as the AI Security Pathway
 * module that does: a student can go and read the reporting, which is what makes
 * the pattern credible rather than a parable. Where the public record later
 * changed, as it did for the Oldsmar water treatment case, the exercise teaches
 * the change rather than the original headline, because "the story everybody
 * repeats turned out to be wrong" is a more useful lesson for this field than
 * any of the incidents themselves.
 */

import type { Exercise, LearningPackage } from '@soc/shared';

// --- shared teaching material ------------------------------------------------

const PRIORITY_TEACH = {
  concept:
    'Start with what security work actually balances. Almost every decision in this field weighs ' +
    'three things, often shortened to CIA: CONFIDENTIALITY, keeping information secret so only the ' +
    'right people can see it; INTEGRITY, keeping information correct so nobody can quietly change ' +
    'it without being noticed; and AVAILABILITY, keeping a system working so the people who need it ' +
    'can actually use it. A bank vault shows all three at once: confidentiality is the combination ' +
    'staying secret, integrity is nobody swapping the gold for painted lead without anyone ' +
    'noticing, and availability is the door actually opening when the bank needs to pay someone ' +
    'out. In an ordinary office IT environment, security is usually taught with confidentiality ' +
    'first: keep the data secret, keep it correct, keep it available, in that order, because a ' +
    'stolen customer database or a leaked email is treated as the worst thing that can happen.\n\n' +
    'On a plant floor, meaning anywhere physical equipment such as pumps, valves, furnaces, or ' +
    'conveyor belts is actually making or moving something real rather than just handling ' +
    'information on a screen, that order inverts almost completely, and everything else in this ' +
    'package follows from that inversion.\n\n' +
    'SAFETY comes first, and it is not one of the three: it sits above them. A control that could ' +
    'contribute to somebody being hurt is not a control, whatever it protects. AVAILABILITY comes ' +
    'next, because the process is producing something and stopping it has a cost measured in ' +
    'thousands per minute, or in a city without water. INTEGRITY comes next, because a sensor ' +
    'reading that is wrong is worse than one that is missing: an operator who knows a gauge is ' +
    'dead will go and look at the equipment directly, and one who trusts a false reading will act ' +
    'on it as though it were true. CONFIDENTIALITY comes last, and often barely matters, because ' +
    'the set point of a pump is not a secret worth protecting the way a customer\'s credit card ' +
    'number is.\n\n' +
    'A security professional who arrives on a plant and applies the IT ordering, treating a leaked ' +
    'file as more urgent than a process that could stop or misbehave, will recommend things that ' +
    'get them politely ignored, and will deserve it. Getting this ordering right on day one is the ' +
    'single fastest way to be taken seriously by people who have been running the plant for years.',
} as const;

const ASSET_TEACH = {
  concept:
    'An industrial site, a factory, a water plant, a refinery, a power station, runs on a stack of ' +
    'equipment layered from the physical machinery up to the people watching screens, and each ' +
    'layer has its own name because the job at that layer is genuinely different, the same way a ' +
    'hospital has distinct job titles for the surgeon, the nurse, and the administrator even though ' +
    'all three work at the same building. Learning these names before you talk to anybody who works ' +
    'with the equipment is most of what earns you a second conversation, because getting them wrong ' +
    'marks you instantly as someone who has never been on a plant floor.\n\n' +
    'A PLC, a programmable logic controller, is a small ruggedised computer, built to survive heat, ' +
    'vibration and dust that would kill an office PC, that reads sensors and drives actuators on a ' +
    'fixed cycle. Think of it as a factory foreman who never sleeps and never improvises: it checks ' +
    'a handful of readings hundreds of times a second and instantly opens a valve, starts a motor, ' +
    'or trips an alarm, based on rules it was given in advance. It has no monitor and no keyboard ' +
    'for a person to use; it just runs read, decide, act, forever. It is the thing actually running ' +
    'the process, physically, in real time.\n\n' +
    'An HMI, the human machine interface, is the screen an operator watches and touches, the ' +
    'closest thing to a car dashboard but for an entire plant: it displays what the process is ' +
    'doing and lets a person send commands to it. It is usually an ordinary Windows machine running ' +
    'special display software, which makes it the most familiar and most attacked thing on the ' +
    'floor, because anybody who has used a Windows PC already half-knows how to use one.\n\n' +
    'SCADA (supervisory control and data acquisition) is the layer above all of that: software that ' +
    'gathers information from many controllers across a whole site or even a whole region and ' +
    'presents them together, the way an airport\'s central board pulls together the status of every ' +
    'gate rather than showing you just one. A HISTORIAN is a database that records those process ' +
    'values over time instead of only showing the current moment, and it is often the one system ' +
    'with a legitimate reason to talk to both the plant network and the ordinary business network, ' +
    'which makes it interesting in both directions: useful to the business, and a tempting bridge ' +
    'for an attacker. And a SAFETY INSTRUMENTED SYSTEM is a separate, independent controller whose ' +
    'only job is to bring the process to a safe state, closing a valve, tripping a burner, when ' +
    'limits are exceeded. It is deliberately not the same equipment as the control system, built by ' +
    'a different team and often a different vendor, and that separation is the whole point of it: ' +
    'if the thing driving the process fails, the thing meant to catch that failure must not fail ' +
    'the same way at the same time.',
} as const;

const PURDUE_TEACH = {
  concept:
    'A "reference architecture" is just a standardised way of drawing which system talks to which, ' +
    'so people at different companies who have never met can point at the same diagram and mean ' +
    'the same thing by it, the way a set of house blueprints uses the same symbols everywhere for a ' +
    'door or a window even though no two houses are identical. The Purdue model is the reference ' +
    'architecture for industrial sites: the one everybody in this field argues about and everybody ' +
    'still uses, because having a shared vocabulary matters more than any single diagram being ' +
    'perfectly accurate.\n\n' +
    'It describes a plant as a stack of levels, numbered from the physical world upward. Level 0 is ' +
    'the physical process itself, the sensors and actuators, the actual valves and motors and ' +
    'gauges. Level 1 is the controllers, the PLCs, sitting right next to that equipment and driving ' +
    'it directly. Level 2 is supervisory control, the HMIs and SCADA for one area, where a person ' +
    'watches and adjusts what a group of controllers is doing. Level 3 is site-wide operations, ' +
    'including the historian and engineering workstations, where the whole plant is managed as one ' +
    'thing. And levels 4 and 5 are the business network and the wider enterprise, which is ordinary ' +
    'office IT: email, payroll, the corporate file servers, nothing that touches physical ' +
    'equipment.\n\n' +
    'Between level 3 and level 4 sits the industrial DMZ (demilitarised zone, a term borrowed from ' +
    'military language for a buffer strip nobody occupies), and it is the most important boundary ' +
    'in the model. Everything the business needs from the plant should be served from a system ' +
    'sitting in that buffer zone rather than by reaching down into the plant itself, so that a ' +
    'compromise of the ordinary corporate network, which happens to companies constantly through ' +
    'phishing emails and the like, has somewhere to stop before it reaches equipment that can hurt ' +
    'someone.\n\n' +
    'Two honest caveats, because the nuance here is what separates somebody who has only read about ' +
    'the model from somebody who has used it. Real plants are messier than the model: engineering ' +
    'laptops span levels, vendors dial in from outside entirely, and wireless sensors appear at ' +
    'level 0 with their own radio link that answers to nobody\'s diagram. And cloud connectivity has ' +
    'made the neat hierarchy harder to defend, because a level 1 device with its own cellular modem ' +
    'has skipped every boundary you drew, talking straight to the internet from the factory floor. ' +
    'Use the model to describe where things SHOULD sit and to name what is out of place, rather ' +
    'than as a prediction of what you will actually find when you walk the site.',
} as const;

// --- Module ots.1: what makes OT different -----------------------------------

const MODULE_OTS_1: Exercise[] = [
  {
    id: 'ots.1.1',
    moduleId: 'ots.1',
    packageId: 'ot-security-foundations',
    order: 1,
    title: 'The priorities are not the ones you were taught',
    kind: 'multiple-choice',
    goal: 'Reorder confidentiality, integrity and availability for a physical process.',
    prompt:
      'You are advising on security for a water treatment plant. Which of the following are ' +
      'accurate about how to prioritise? Select all that apply.',
    teach: PRIORITY_TEACH,
    options: [
      { id: 'a', label: 'Safety sits above the other three: a control that could contribute to somebody being hurt is not a control.' },
      { id: 'b', label: 'Availability usually outranks confidentiality, because stopping the process has an immediate physical cost.' },
      { id: 'c', label: 'A false sensor reading can be worse than a missing one, because an operator will act on it.' },
      { id: 'd', label: 'Confidentiality still matters, but is rarely the deciding factor for process data.' },
      { id: 'e', label: 'The IT ordering applies once you explain to the engineers why it should.' },
    ],
    hints: [
      'Four are accurate. One assumes the plant is wrong and needs persuading.',
      'Ask what the cost of an hour of downtime is here, and compare it to the cost of somebody learning a pump set point.',
      'What does an operator do when a gauge reads zero, and what do they do when it reads a plausible lie?',
    ],
    solution:
      'A, B, C, and D. Safety is a precondition rather than a priority, availability carries a ' +
      'direct physical cost, a plausible wrong reading defeats the operator who would otherwise ' +
      'catch the problem, and confidentiality is real but rarely decisive. E is the attitude that ' +
      'ends careers in this field before they start: the ordering is not an IT failure the plant ' +
      'has not noticed, it is a correct response to a process that can hurt people and cannot be ' +
      'paused. Arriving to explain it is how you get politely excluded from every subsequent ' +
      'conversation.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats the plant ordering as a misunderstanding to be corrected rather than ' +
          'as a response to physical consequence.',
      },
    ],
    debrief:
      'If you come from IT, this is the single adjustment that matters. If you come from ' +
      'engineering, you already knew it and the useful news is that the security profession is ' +
      'short of people who do.',
    practice: [],
  },
  {
    id: 'ots.1.2',
    moduleId: 'ots.1',
    packageId: 'ot-security-foundations',
    order: 2,
    title: 'Why you cannot just patch it',
    kind: 'multiple-choice',
    goal: 'Understand the constraints that make routine IT hygiene impossible here.',
    prompt:
      'You recommend monthly patching for the control system and the plant manager says no. Which ' +
      'of the following are legitimate reasons? Select all that apply.',
    teach: {
      concept:
        '"Patching" means installing a small update that fixes a known flaw in a piece of ' +
        'software, the same idea as a manufacturer recall notice for a car: something was found ' +
        'wrong, and the fix gets applied to every unit that has the problem. In an ordinary office, ' +
        'patching runs on autopilot: a laptop restarts overnight and updates itself, and if ' +
        'something goes wrong, IT reimages it the next morning and nobody outside the IT department ' +
        'notices. Patching is the clearest case where that IT reflex meets a plant reality, and the ' +
        'plant is usually right to refuse it.\n\n' +
        'Four constraints bind, and each one is a genuine, physical or contractual limit rather ' +
        'than stubbornness. UPTIME: the process runs continuously, day and night, and stopping it ' +
        'to apply an update may take hours to restart safely afterward and cost a fortune in lost ' +
        'production, so changes wait for a planned outage that might happen only twice a year. ' +
        'VENDOR APPROVAL: the control system is often certified as a whole by its manufacturer, ' +
        'meaning the vendor has tested and guaranteed that exact combination of software works ' +
        'safely together, and applying an operating system patch the vendor has not validated can ' +
        'void that support or even a safety certification, which is not a paperwork inconvenience ' +
        'but a liability one: if something later goes wrong, the plant can no longer point to the ' +
        'vendor\'s guarantee. AGE: a twenty-year service life is normal for industrial equipment, so ' +
        'a lot of it runs software so old that no patches exist for it any more and the company ' +
        'that made it may no longer exist either. And TESTING: nobody applies an untested change to ' +
        'a system that moves physical mass, real liquid through real pipes, and the spare equipment ' +
        'needed to test a patch safely offline may not exist at all.\n\n' +
        'What follows is not that you give up on security here. It is that the answer becomes ' +
        'COMPENSATING CONTROLS: other protections put around a system that cannot itself be ' +
        'changed, such as segmentation (physically or logically separating networks so an attacker ' +
        'who reaches one part cannot reach another), allowlisting (permitting only a known, ' +
        'approved list of things to run or connect, and blocking everything else by default), ' +
        'monitoring, and strict control of what is allowed to connect. That is the actual job here, ' +
        'and it is more interesting than patching, because it asks you to think about the whole ' +
        'system rather than just running an update.',
    },
    options: [
      { id: 'a', label: 'The process runs continuously and a restart may take hours and cost a great deal.' },
      { id: 'b', label: 'Applying a patch the vendor has not validated can void support or a safety certification.' },
      { id: 'c', label: 'Equipment with a twenty-year service life may have no patches and no surviving vendor.' },
      { id: 'd', label: 'The right response is compensating controls: segmentation, allowlisting, and monitoring.' },
      { id: 'e', label: 'Refusing to patch is negligence, and the plant manager should be overruled by security.' },
    ],
    hints: [
      'Four are legitimate. One tries to win an argument by authority.',
      'Ask who carries the liability if an unvalidated patch causes an unplanned shutdown.',
      'If patching is off the table, what is left?',
    ],
    solution:
      'A, B, C, and D. Uptime, vendor validation, equipment age, and the pivot to compensating ' +
      'controls. E is both wrong and self-defeating: the plant manager is accountable for the ' +
      'safety and the output of that plant, security is not, and an escalation that overrides them ' +
      'will be remembered for years. The productive version of this conversation is to accept the ' +
      'constraint and ask what you can do around it, which is where segmentation and monitoring ' +
      'come from.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option resolves a disagreement by overruling the person who carries the liability.',
      },
    ],
    debrief:
      'Compensating controls are not the consolation prize here, they are the discipline. An OT ' +
      'security person who is good at them is worth more than one who can recite patch policy.',
    practice: [],
  },
  {
    id: 'ots.1.3',
    moduleId: 'ots.1',
    packageId: 'ot-security-foundations',
    order: 3,
    title: 'What a scan can do to a controller',
    kind: 'multiple-choice',
    goal: 'Know which routine IT tools are dangerous on a plant network.',
    prompt:
      'You want visibility of the plant network. Which of the following are genuine risks of ' +
      'applying standard IT tooling? Select all that apply.',
    teach: {
      concept:
        'A "network scan" is a routine IT technique where a tool sends messages to every device on ' +
        'a network in turn, asking each one "are you there, and what are you running", so you can ' +
        'build a list of what exists. On an office network of laptops and servers, this is so safe ' +
        'it barely counts as risky: modern computers field thousands of stray messages a day and do ' +
        'not notice. The tools you would reach for without thinking in IT, scanning and installing ' +
        'small monitoring programs called agents, can stop a physical process on a plant floor, and ' +
        'this is not folklore or an exaggerated warning: it has documented, repeated real-world ' +
        'consequences. Older controllers have small "network stacks", meaning the software inside ' +
        'them that handles incoming messages, with very little spare capacity, and behaviour a ' +
        'server shrugs off without noticing can push one into a FAULT STATE, an error condition the ' +
        'device cannot recover from on its own.\n\n' +
        'ACTIVE SCANNING is the main offender. A port scan, which probes a device to see which of ' +
        'its communication channels are open, or a vulnerability scanner probing a protocol it does ' +
        'not understand, has knocked PLCs offline in documented cases: the device is not attacked ' +
        'so much as simply overwhelmed by traffic it was never designed to field, and a controller ' +
        'that faults may stop the entire process it was driving. AGENTS are the second offender: an ' +
        'endpoint agent (a small background program IT security teams normally install on every ' +
        'computer to watch for threats) running on an HMI can consume computing resources the ' +
        'vendor allocated specifically to the control application, and is frequently prohibited by ' +
        'the equipment\'s support contract anyway.\n\n' +
        'The alternative is PASSIVE monitoring: a span or tap port, a piece of network hardware that ' +
        'silently copies traffic to a separate collector without ever sending anything of its own, ' +
        'the network equivalent of a security camera that only records and never touches anything. ' +
        'You get an asset inventory and protocol visibility without sending a single packet into ' +
        'the process network, which is why passive tooling dominates this market. Where active ' +
        'checks are genuinely needed, they happen in a maintenance window (a scheduled period when ' +
        'the process is deliberately paused for work like this), with the engineer present, on ' +
        'equipment somebody is watching closely enough to catch trouble immediately.',
    },
    options: [
      { id: 'a', label: 'Active port or vulnerability scanning has taken PLCs offline, by overwhelming small network stacks.' },
      { id: 'b', label: 'Endpoint agents on an HMI can breach vendor support terms and compete with the control application.' },
      { id: 'c', label: 'Passive monitoring from a tap gives inventory and protocol visibility without transmitting anything.' },
      { id: 'd', label: 'Where active checks are needed, they belong in a maintenance window with the engineer present.' },
      { id: 'e', label: 'Modern controllers are robust enough that scanning concerns are no longer real.' },
    ],
    hints: [
      'Four are accurate. One assumes the estate is modern, which is the assumption this whole field exists to correct.',
      'What is the service life of the equipment you are scanning?',
      'How do you get an asset inventory without sending anything?',
    ],
    solution:
      'A, B, C, and D. Scanning has genuinely caused outages, agents are often contractually and ' +
      'practically unwelcome, passive collection is the standard answer, and active work is done ' +
      'in a window with the right people present. E is the assumption to abandon: some controllers ' +
      'are modern and robust, and the estate as a whole contains equipment installed before the ' +
      'people scanning it were born. You do not get to assume; you find out, carefully.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option assumes a uniformly modern estate, which is the opposite of what an OT ' +
          'network is.',
      },
    ],
    debrief:
      'Never scan a plant network on your own initiative. It is the fastest way to cause an outage, ' +
      'and it is the story every OT engineer tells about the last security person who visited.',
    practice: [],
  },
  {
    id: 'ots.1.4',
    moduleId: 'ots.1',
    packageId: 'ot-security-foundations',
    order: 4,
    title: 'Explain the difference to an IT colleague',
    kind: 'short-answer',
    goal: 'Put the core difference into words somebody from IT will accept.',
    prompt:
      'An IT security colleague is frustrated that the plant will not accept patching or agents, ' +
      'and thinks the site is being obstructive. In three or four sentences, explain what they are ' +
      'missing.',
    teach: {
      concept:
        'This exercise asks for a written answer rather than a multiple-choice one, because the ' +
        'skill being tested is putting an explanation into your own words, the way you would ' +
        'actually say it out loud to a colleague. You will spend a lot of this career translating ' +
        'between two groups who each think the other is being unreasonable, and this exact ' +
        'conversation, IT wanting to patch and monitor the way it always has, the plant refusing, is ' +
        'the one you will have most often. The colleague is not stupid and is not wrong about their ' +
        'own domain; they are applying reasonable rules, built for a world where the worst outcome ' +
        'is a leaked file, to a system with different physics, where the worst outcome is a person ' +
        'getting hurt.\n\n' +
        'Three ideas land in an answer like this. The CONSEQUENCE is physical: the failure mode of ' +
        'this system, meaning what actually goes wrong when something fails, is not lost data, it ' +
        'is a process stopping or moving when it should not, which can hurt somebody. The ' +
        'CONSTRAINTS are real and external, not preferences the site could waive if it simply ' +
        'agreed to be more cooperative: vendor validation (the manufacturer certifying that a ' +
        'specific software configuration is safe), safety certification, and outage windows are ' +
        'facts about how the equipment and its support contracts work, not attitudes. And there IS ' +
        'an answer, which is compensating controls (protections put around equipment that cannot ' +
        'itself be changed), so the conversation ends somewhere useful rather than in a standoff ' +
        'where nobody moves.\n\n' +
        'What does not land is arguing about who is more security-minded. A good answer explains ' +
        'the physical consequence, names at least one hard external constraint, and offers the ' +
        'compensating-control route rather than simply defending the refusal.',
    },
    hints: [
      'They are applying good rules to a system with a different failure mode. Start there.',
      'Name a constraint that the site genuinely cannot waive even if it wanted to.',
      'A good answer names the physical consequence, names a real external constraint such as vendor validation or safety certification, and offers compensating controls as where the conversation goes next.',
    ],
    solution:
      'The failure mode here is not lost or leaked data, it is a physical process stopping or ' +
      'behaving unexpectedly, which can cost a fortune and can hurt somebody, so the site weighs ' +
      'change differently for good reason. Several of the constraints are also not theirs to ' +
      'waive: the control system is validated as a whole by the vendor, and applying an unapproved ' +
      'patch or installing an agent can void support or a safety certification, which shifts ' +
      'liability onto the plant. None of that means nothing can be done. It means the controls look ' +
      'different: segmentation, strict control of what connects, allowlisting, and passive ' +
      'monitoring instead of scanning, which is where I would take the conversation rather than ' +
      'back to patch policy.',
    expectedOutput:
      'An answer naming the physical consequence, at least one external constraint the site cannot ' +
      'waive, and compensating controls as the constructive route.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['physical', 'process stop', 'hurt', 'injur', 'safety', 'production'],
          ['vendor', 'validat', 'certif', 'support', 'liability', 'outage window', 'cannot waive'],
          ['segmentation', 'compensating', 'monitoring', 'allowlist', 'passive', 'control what connects'],
        ],
        hint:
          'Three ideas: what failure looks like here, a constraint the site genuinely cannot waive, ' +
          'and the controls that are available instead.',
      },
    ],
    debrief:
      'Notice that you did not defend the refusal, you explained it and then offered somewhere for ' +
      'the conversation to go. That is the move that gets you invited to the next design review.',
    practice: [],
  },
  {
    id: 'ots.1.5',
    moduleId: 'ots.1',
    packageId: 'ot-security-foundations',
    order: 5,
    title: 'What your industrial background is worth',
    kind: 'multiple-choice',
    goal: 'Understand why this track values plant experience over security experience.',
    prompt:
      'You are moving into OT security from a maintenance or controls engineering role. Which of ' +
      'the following are accurate about what you bring? Select all that apply.',
    teach: {
      concept:
        'Most security fields expect you to have worked in security before they will hire you: ' +
        'come from a help desk, then a security operations centre, and work up. This field ' +
        'frequently does not, and the reason is that the scarce skill here is understanding the ' +
        'physical process rather than understanding the attack. Security techniques can be taught ' +
        'from a book; twenty years of knowing how a particular plant actually behaves cannot.\n\n' +
        'What an industrial background gives you is not replaceable by study. You know what the ' +
        'equipment does and what happens physically when it stops. You can read a P&ID (a piping ' +
        'and instrumentation diagram, the detailed technical drawing showing every pipe, valve and ' +
        'sensor in a process) or a wiring diagram, which to somebody without that training is just ' +
        'a page of symbols. You know how a maintenance window, the scheduled pause when changes are ' +
        'allowed, is actually negotiated, and who has the authority to sign off on one. And you have ' +
        'credibility with operators and engineers, who have usually met several security people ' +
        'before and were not impressed by any of them, because those people did not understand what ' +
        'they were asking for.\n\n' +
        'What you have to add on top of that is genuinely learnable from a course like this one: how ' +
        'attacks work, how networks are segmented (divided into separate zones so a problem in one ' +
        'does not spread to another), what a detection is (an alert that fires when something ' +
        'suspicious happens), and the vocabulary to talk to the IT security function without being ' +
        'dismissed as somebody who does not know the field. That direction of travel, from plant ' +
        'knowledge toward security knowledge, is much faster than the reverse, which is why the ' +
        'field hires this way, and it is worth knowing when you are deciding whether you are ' +
        'qualified enough to apply for a role like this.',
    },
    options: [
      { id: 'a', label: 'Knowing what the equipment does and what happens when it stops is the scarce half.' },
      { id: 'b', label: 'Credibility with operators and engineers is real and is hard for an outsider to acquire.' },
      { id: 'c', label: 'The security half is learnable in a way that twenty years of plant experience is not.' },
      { id: 'd', label: 'Being able to read process and wiring documentation is directly useful in the security role.' },
      { id: 'e', label: 'Without a security background first, you would not be considered for these roles.' },
    ],
    hints: [
      'Four are accurate. One repeats the assumption that keeps good candidates from applying.',
      'Ask which half of the pairing is harder to teach.',
      'Why does this track description say industrial experience is worth more than security experience?',
    ],
    solution:
      'A, B, C, and D. Process knowledge, floor credibility, the learnability of the security half, ' +
      'and documentation literacy are all real and all valued. E is the belief that costs this ' +
      'field candidates: teams building OT security capability routinely hire from controls and ' +
      'maintenance and teach the security, because the reverse takes far longer and produces ' +
      'somebody the plant does not trust. If that is your background, apply.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option asserts a prerequisite this field routinely does not apply.',
      },
    ],
    debrief:
      'The rest of this package assumes you may be that person. Where a term from IT security is ' +
      'used, it gets explained; where a term from the plant is used, it does not need to be.',
    practice: [],
  },
];

// --- Module ots.2: what is actually on the floor -----------------------------

const MODULE_OTS_2: Exercise[] = [
  {
    id: 'ots.2.1',
    moduleId: 'ots.2',
    packageId: 'ot-security-foundations',
    order: 1,
    title: 'Name the equipment',
    kind: 'multiple-choice',
    goal: 'Match each piece of plant equipment to what it actually does.',
    prompt:
      'Which of the following describe the equipment correctly? Select all that apply.',
    teach: ASSET_TEACH,
    options: [
      { id: 'a', label: 'A PLC reads sensors and drives actuators on a fixed cycle; it is what actually runs the process.' },
      { id: 'b', label: 'An HMI is the operator screen, and is usually an ordinary Windows machine.' },
      { id: 'c', label: 'A historian stores process values over time and often has reason to talk to both networks.' },
      { id: 'd', label: 'A safety instrumented system is separate equipment whose only job is to reach a safe state.' },
      { id: 'e', label: 'SCADA is the software running inside the controller itself.' },
    ],
    hints: [
      'Four are correct. One puts the supervisory layer inside the device it supervises.',
      'Which of these would you expect to find in a control room rather than in a cabinet on the floor?',
      'The clue is in the word supervisory.',
    ],
    solution:
      'A, B, C, and D. The controller runs the process, the HMI is the window onto it and is ' +
      'usually a Windows box, the historian bridges networks by design, and the safety system is ' +
      'deliberately separate hardware. E misplaces SCADA: it is the supervisory layer above the ' +
      'controllers, gathering from many of them across a site or a region, and it runs on servers ' +
      'and workstations rather than inside a PLC.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option places the supervisory system inside the controller.',
      },
    ],
    debrief:
      'Note the HMI being an ordinary Windows machine. It is the most familiar thing on the floor ' +
      'to an attacker and to you, and it is where a great many OT incidents actually begin.',
    practice: [],
  },
  {
    id: 'ots.2.2',
    moduleId: 'ots.2',
    packageId: 'ot-security-foundations',
    order: 2,
    title: 'The engineering workstation',
    kind: 'multiple-choice',
    goal: 'Understand why one laptop is the most sensitive asset on the site.',
    prompt:
      'The engineering workstation is used to program the controllers. Which of the following are ' +
      'accurate about it? Select all that apply.',
    teach: {
      concept:
        'An "engineering workstation" is a laptop or desktop computer loaded with the manufacturer\'s ' +
        'programming software, the tool used to write and upload the actual logic, the rules a PLC ' +
        'follows, onto the controller. Where an HMI only watches the process and sends it ordinary ' +
        'commands within limits somebody already set, the engineering workstation can rewrite those ' +
        'limits and rules themselves. If you protect one machine on a plant properly, protect this ' +
        'one, because whoever controls it can change what the process does rather than merely ' +
        'watching it.\n\n' +
        'Three things make it uniquely exposed. It is INHERENTLY TRUSTED by the controllers: the ' +
        'protocols involved (the shared "languages" devices use to talk to each other) usually have ' +
        'no authentication, meaning no way to check who is asking, so a controller does what the ' +
        'workstation tells it simply because it has no way to ask "prove you are allowed to give me ' +
        'this instruction." It is often MOBILE, carried between sites, connected to hotel wifi on a ' +
        'business trip, and used for ordinary email; a laptop that lives on the sealed plant network ' +
        'and also visits the open internet is exactly the bridge between the two worlds that a ' +
        'well-segmented site claims does not exist. And it HOLDS THE PROJECT FILES, the complete ' +
        'saved description of how the process is programmed to behave, which is exactly what ' +
        'somebody planning a targeted attack would need in order to design one that does specific, ' +
        'deliberate damage rather than just causing random chaos.\n\n' +
        'This is not theoretical. Compromise of engineering workstations is a recurring feature of ' +
        'real ICS (industrial control system) intrusions that have actually happened, because it is ' +
        'the shortest path from ordinary IT access, the kind any company can suffer through a ' +
        'phishing email, to changing physical behaviour on the plant floor.',
    },
    options: [
      { id: 'a', label: 'Controllers generally accept its instructions without authentication, because the protocols have none.' },
      { id: 'b', label: 'It is often a mobile laptop that also reaches the internet, making it a bridge between worlds.' },
      { id: 'c', label: 'It holds project files that describe the process in enough detail to plan an attack.' },
      { id: 'd', label: 'Compromise of these machines features repeatedly in real ICS intrusions.' },
      { id: 'e', label: 'It is low risk because it is only used occasionally during maintenance.' },
    ],
    hints: [
      'Four are accurate. One treats infrequent use as low risk.',
      'Ask what this machine can do that an HMI cannot.',
      'Occasional use of a machine that can rewrite controller logic is still the ability to rewrite controller logic.',
    ],
    solution:
      'A, B, C, and D. Implicit trust, mobility, the project files, and the historical record all ' +
      'point the same way. E confuses frequency with severity: a machine used twice a year that ' +
      'can reprogram what a valve does is not low risk, and infrequent use often makes it worse, ' +
      'because it is less monitored, later on patches, and more likely to have been sitting on ' +
      'other networks in between.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a rarely used machine as a low risk one.',
      },
    ],
    debrief:
      'When you are asked where to start on a site with no budget, this is the answer. Dedicated, ' +
      'never leaves the plant network, no email, and controlled physically.',
    practice: [],
  },
  {
    id: 'ots.2.3',
    moduleId: 'ots.2',
    packageId: 'ot-security-foundations',
    order: 3,
    title: 'Build the asset inventory',
    kind: 'multiple-choice',
    goal: 'Know how to find out what is on a network you must not scan.',
    prompt:
      'You need an asset inventory of a plant network and cannot run an active scan. Which of the ' +
      'following are workable? Select all that apply.',
    teach: {
      concept:
        'An "asset inventory" is simply a list of every device that exists on a network, what it ' +
        'is, and where it lives, the security equivalent of a warehouse knowing what is actually on ' +
        'its shelves rather than only what the paperwork says should be there. Everything in ' +
        'security starts with knowing what you have, because you cannot protect a device you do not ' +
        'know exists, and OT makes the usual IT method of building that list, active scanning, ' +
        'unavailable for the reasons covered earlier in this module. The alternatives are slower and ' +
        'they work.\n\n' +
        'PASSIVE NETWORK MONITORING from a tap or span port (hardware that silently copies traffic ' +
        'for a collector to read, without ever sending anything itself) identifies devices by the ' +
        'traffic they already send on their own, and industrial protocols are chatty enough, ' +
        'constantly reporting status, that this builds a surprisingly complete picture including ' +
        'device types and firmware versions. CONFIGURATION FILES from the engineering workstation ' +
        'list the controllers and their addresses, because somebody had to type that information in ' +
        'when they set the system up in the first place. WALKING THE PLANT with an engineer and ' +
        'reading nameplates, the small metal labels bolted to equipment listing its model and serial ' +
        'number, is not a joke: it is how you find the equipment that is on no diagram at all, and ' +
        'experienced OT people genuinely do this as a matter of course. And PROCUREMENT AND ' +
        'MAINTENANCE RECORDS, the paperwork trail of what was purchased and what has been serviced, ' +
        'tell you what exists even when nothing else does.\n\n' +
        'The inventory you end up with will be imperfect and it will still be transformative, ' +
        'because most sites genuinely do not have one at all. Expect to find equipment nobody knew ' +
        'was connected, which is the normal outcome of doing this work rather than a sign you did it ' +
        'wrong.',
    },
    options: [
      { id: 'a', label: 'Passive monitoring from a tap, identifying devices by traffic they already send.' },
      { id: 'b', label: 'Reading configuration and project files from the engineering workstation.' },
      { id: 'c', label: 'Walking the plant with an engineer and recording what is physically there.' },
      { id: 'd', label: 'Procurement and maintenance records for what was bought and serviced.' },
      { id: 'e', label: 'A one-off active scan, since a single pass is unlikely to disturb anything.' },
    ],
    hints: [
      'Four are workable. One is the thing you were told not to do, with a reassurance attached.',
      'One of the four involves leaving your desk.',
      'Is a single scan pass materially safer than a repeated one, on a device with a small network stack?',
    ],
    solution:
      'A, B, C, and D. Passive collection, the configuration already on the workstation, the ' +
      'physical walk, and the paper trail together produce a good inventory without transmitting ' +
      'anything into the process network. E is the temptation to resist: a single pass is exactly ' +
      'how the documented outages happened, and "just once" is not a safety argument. If active ' +
      'work is genuinely needed it goes in a window, with the engineer, on equipment somebody is ' +
      'watching.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option proposes an active scan on the grounds that doing it once is probably fine.',
      },
    ],
    debrief:
      'The plant walk is the one IT people skip and OT people insist on. Do it: you will find a ' +
      'modem, a contractor laptop, or a wireless bridge that appears on no diagram anywhere.',
    practice: [],
  },
  {
    id: 'ots.2.4',
    moduleId: 'ots.2',
    packageId: 'ot-security-foundations',
    order: 4,
    title: 'The device that should not be there',
    kind: 'short-answer',
    goal: 'Reason about an unexpected connection without assuming malice.',
    prompt:
      'Your passive monitoring finds a cellular modem attached to a pump controller, sending data ' +
      'to an address outside the company. In three or four sentences, say what you do next.',
    teach: {
      concept:
        'A "cellular modem" here means a small device with its own mobile-network SIM card, giving ' +
        'it an internet connection that has nothing to do with the plant\'s own wired network at ' +
        'all, the same technology that gives a phone data when there is no wifi. Finding one wired ' +
        'directly into a pump controller is a common finding, and the right first assumption is ' +
        'almost never an attack. Vendor remote support (the equipment manufacturer dialling in to ' +
        'help diagnose a problem), a monitoring service the maintenance team bought and installed ' +
        'themselves, a trial somebody set up years ago and forgot about: all are far more likely ' +
        'explanations than an intrusion, and all are genuine problems needing attention anyway.\n\n' +
        'The order in which you act matters a great deal here. FIND OUT WHAT IT IS before you do ' +
        'anything to it, by asking maintenance and the vendor, because disconnecting a link that a ' +
        'support contract depends on can leave the site unable to get help on a bad day. ESTABLISH ' +
        'WHAT IT REACHES: whether it can only send readings out, or can also accept commands coming ' +
        'in, which is the difference between a minor data leak and a fully working remote control ' +
        'path into the plant with no authentication in front of it at all, meaning nothing checks ' +
        'who is sending the commands. Then DOCUMENT IT AND DECIDE, together with the plant staff who ' +
        'own the equipment, whether it stays, changes, or goes.\n\n' +
        'What makes this an OT problem rather than an ordinary IT one is that the modem has bypassed ' +
        'every boundary in the architecture described in the Purdue model teaching. Whatever ' +
        'segmentation exists between levels, this device sits at level 1, right next to the ' +
        'controller, with its own private path to the internet that skips every layer of protection ' +
        'in between, so the network diagram everybody has been relying on is now wrong in a way that ' +
        'matters. A good answer asks who owns it before touching it, and establishes whether the ' +
        'path is inbound as well as outbound.',
    },
    hints: [
      'Your first assumption should not be an attacker. What is far more likely?',
      'Before you disconnect anything, ask what depends on it.',
      'A good answer identifies the owner or purpose first rather than disconnecting, and establishes whether the link accepts inbound commands as well as sending data out.',
    ],
    solution:
      'I would find out what it is before touching it, because a vendor support link or a ' +
      'monitoring service somebody in maintenance bought is far more likely than an intrusion, and ' +
      'pulling a connection the support contract depends on could leave the site without help ' +
      'during a fault. The question that decides severity is whether the path is outbound only or ' +
      'whether it also accepts commands inbound, since the second case is remote control of a pump ' +
      'with no authentication in front of it and effectively no segmentation, because this device ' +
      'has bypassed every boundary in our architecture. I would document it, get the owner named, ' +
      'and take the decision about whether it stays with the plant rather than alone. Either way ' +
      'the network diagram needs correcting, because it currently shows a boundary that does not ' +
      'exist.',
    expectedOutput:
      'An answer that identifies ownership and purpose before acting, establishes whether the link ' +
      'is inbound as well as outbound, and treats the bypassed segmentation as the underlying ' +
      'finding.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['vendor', 'maintenance', 'who owns', 'support', 'find out what', 'before touching', 'purpose'],
          ['inbound', 'accept commands', 'both directions', 'remote control', 'outbound only', 'two-way'],
          ['bypass', 'segmentation', 'boundary', 'diagram', 'architecture'],
        ],
        hint:
          'Three ideas: establishing what it is before acting, whether it can accept commands, and ' +
          'what it does to the segmentation you thought you had.',
      },
    ],
    debrief:
      'Almost every OT assessment finds one of these. The finding that gets acted on is the one ' +
      'that names an owner and a business reason, not the one that says an unauthorised device was ' +
      'discovered.',
    practice: [],
  },
  {
    id: 'ots.2.5',
    moduleId: 'ots.2',
    packageId: 'ot-security-foundations',
    order: 5,
    title: 'What the historian bridges',
    kind: 'multiple-choice',
    goal: 'See why the one system everybody needs is the one worth watching.',
    prompt:
      'The historian collects process data and the business intelligence team reads from it. Which ' +
      'of the following are accurate? Select all that apply.',
    teach: {
      concept:
        'A "historian" was already introduced as the database that stores process values over time ' +
        'rather than only the current reading. It is where the plant and the business genuinely ' +
        'have to meet, which makes it both essential and the most interesting box on the whole ' +
        'site.\n\n' +
        'It is a legitimate bridge: production reporting, efficiency analysis and regulatory ' +
        'submissions to a government body all need process data on the business side of the ' +
        'company. That is why it exists and why "just disconnect it" is not an answer anyone will ' +
        'accept. What matters instead is the DIRECTION of the connections and who initiates them, ' +
        'meaning which side reaches out first to start talking to the other. The pattern that works ' +
        'is the historian pushing outward into the industrial DMZ described earlier, or a replica ' +
        '(a copy of the data, kept separately) living in the DMZ that the business reads from there, ' +
        'so that nothing on the corporate network ever opens a connection reaching into the plant ' +
        'itself.\n\n' +
        'The pattern that fails is business systems reaching inward instead. It is easier to ' +
        'configure, which is exactly why it is what you will actually find on real sites, and it ' +
        'means a compromise of an ordinary corporate server, the kind that happens to companies ' +
        'through phishing emails all the time, has a direct route to a system that sits at level 3 ' +
        'of the Purdue model with visibility of everything below it. The historian is also, ' +
        'underneath all of that, just an ordinary Windows server with a database on it, which means ' +
        'it has all the mundane software problems any office server has, on top of the interesting ' +
        'OT ones.',
    },
    options: [
      { id: 'a', label: 'It is a legitimate bridge, because the business genuinely needs process data.' },
      { id: 'b', label: 'The safer pattern is the plant pushing outward, or a replica in the DMZ the business reads.' },
      { id: 'c', label: 'Business systems reaching inward gives a compromised corporate server a route toward the plant.' },
      { id: 'd', label: 'It is also an ordinary Windows server with a database, with all the usual problems.' },
      { id: 'e', label: 'Because the data is only readings, a compromise of the historian has no process impact.' },
    ],
    hints: [
      'Four are accurate. One assumes read-only data means harmless.',
      'Ask which side opens the connection, and what that means when one side is compromised.',
      'What does a machine at level 3 have visibility of?',
    ],
    solution:
      'A, B, C, and D. It is a real requirement, direction of connection is the control, inbound ' +
      'access creates a path, and it is a normal server underneath. E underrates it in two ways: a ' +
      'historian sits at level 3 with visibility of the process and often with credentials and ' +
      'routes further down, so compromising it is a strong position even if the data itself is ' +
      'dull. And process data is not always dull: production volumes and recipes can be ' +
      'commercially valuable, which is one of the few places confidentiality genuinely bites in OT.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats a read-only data store as being without consequence if compromised.',
      },
    ],
    debrief:
      'When you review an architecture, find the historian and ask which side opens the connection. ' +
      'The answer tells you most of what you need to know about how seriously the boundary is taken.',
    practice: [],
  },
];

// --- Module ots.3: the Purdue model and segmentation -------------------------

const MODULE_OTS_3: Exercise[] = [
  {
    id: 'ots.3.1',
    moduleId: 'ots.3',
    packageId: 'ot-security-foundations',
    order: 1,
    title: 'Place things in the levels',
    kind: 'multiple-choice',
    goal: 'Use the Purdue levels to describe where an asset sits.',
    prompt:
      'Which of the following place equipment at the right Purdue level? Select all that apply.',
    teach: PURDUE_TEACH,
    options: [
      { id: 'a', label: 'Sensors and actuators, the physical process itself, are level 0.' },
      { id: 'b', label: 'PLCs and other controllers are level 1.' },
      { id: 'c', label: 'HMIs and area SCADA are level 2.' },
      { id: 'd', label: 'The historian and engineering workstations sit at level 3, site-wide operations.' },
      { id: 'e', label: 'The industrial DMZ sits below the controllers, between level 0 and level 1.' },
    ],
    hints: [
      'Four are right. One puts the DMZ at the wrong end of the model entirely.',
      'Count upward from the physical process.',
      'The DMZ exists to separate the plant from the business. Which two levels does that sit between?',
    ],
    solution:
      'A, B, C, and D. Process, controllers, area supervision, then site operations. E is inverted: ' +
      'the industrial DMZ sits between level 3 and level 4, separating the plant from the business ' +
      'network, and it is the boundary the whole model exists to justify. Nothing sits between the ' +
      'process and its controllers, which are physically wired together.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option puts the DMZ between the process and the controllers rather than between the ' +
          'plant and the business.',
      },
    ],
    debrief:
      'Use the levels as vocabulary rather than as gospel. Saying "that historian is level 3 and it ' +
      'is accepting connections from level 4" communicates a problem instantly to anybody in this ' +
      'field.',
    practice: [],
  },
  {
    id: 'ots.3.2',
    moduleId: 'ots.3',
    packageId: 'ot-security-foundations',
    order: 2,
    title: 'What the DMZ is for',
    kind: 'multiple-choice',
    goal: 'Say what the boundary between plant and business must and must not allow.',
    prompt:
      'You are reviewing the boundary between the plant network and the corporate network. Which of ' +
      'the following are sound? Select all that apply.',
    teach: {
      concept:
        'Recall that the industrial DMZ is a buffer zone of servers sitting between the plant ' +
        'network and the ordinary corporate network, and that it exists so that no system on the ' +
        'business side ever needs to open a connection reaching into the plant. Everything the ' +
        'business wants is instead served from a system living in that middle zone, and the plant ' +
        'pushes information out to it rather than the business reaching in to grab it.\n\n' +
        'Three rules make it actually work rather than just look good on a diagram. NO ' +
        'PASS-THROUGH: a protocol (a shared communication method) that starts on the corporate ' +
        'network and terminates, meaning ends its journey, on a plant device defeats the entire ' +
        'arrangement, however many firewalls (devices that filter network traffic by rule) it ' +
        'crosses on the way, because the DMZ was supposed to be the endpoint, not a tollbooth on a ' +
        'through road. REPLICATION RATHER THAN REACH-THROUGH: put a copy of exactly what the ' +
        'business needs in the DMZ itself, so that if that DMZ system is ever compromised, the ' +
        'attacker gets a copy of some readings rather than a route further into the plant. And ' +
        'DIRECTION: connections initiated, meaning first opened, from the plant outward are far ' +
        'safer than the reverse, because an attacker sitting on the compromised corporate side then ' +
        'has nothing waiting to connect to.\n\n' +
        'Remote access is the hard case and the one that gets negotiated badly in practice. Vendors ' +
        'genuinely need to support their own equipment from off site, and the answer is a brokered ' +
        '(arranged and controlled through a middle system), monitored, time-limited session through ' +
        'the DMZ, rather than a permanent VPN (a private, always-open tunnel between two networks) ' +
        'reaching straight into level 2, or, as you will actually find on real sites, a modem nobody ' +
        'documented at all.',
    },
    options: [
      { id: 'a', label: 'No protocol should begin on the corporate network and terminate on a plant device.' },
      { id: 'b', label: 'Replicating data into the DMZ is safer than letting the business reach through to the source.' },
      { id: 'c', label: 'Connections initiated outward from the plant are safer than connections initiated inward.' },
      { id: 'd', label: 'Vendor access should be brokered, monitored and time-limited rather than permanent.' },
      { id: 'e', label: 'A firewall between the two networks is sufficient on its own, whatever traffic it permits.' },
    ],
    hints: [
      'Four are sound. One confuses having a device with having a boundary.',
      'A firewall that permits a corporate server to speak Modbus to a PLC is doing what, exactly?',
      'Ask which side opens the connection in each case.',
    ],
    solution:
      'A, B, C, and D. No pass-through, replicate rather than reach through, prefer outbound ' +
      'initiation, and broker vendor access. E is the finding you will write most often: there is a ' +
      'firewall, everybody points at it, and its rules permit exactly the pass-through the ' +
      'architecture was supposed to prevent. A boundary is defined by what it allows, not by what ' +
      'equipment sits on it.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats the presence of a firewall as the boundary, regardless of its rules.',
      },
    ],
    debrief:
      'Ask to read the firewall rules rather than the network diagram. The diagram shows the ' +
      'architecture somebody designed; the rules show the one that exists.',
    practice: [],
  },
  {
    id: 'ots.3.3',
    moduleId: 'ots.3',
    packageId: 'ot-security-foundations',
    order: 3,
    title: 'Where the model breaks down',
    kind: 'multiple-choice',
    goal: 'Recognise the real-world features the reference architecture does not describe.',
    prompt:
      'You are mapping a real site against the Purdue model. Which of the following are genuine ' +
      'ways the model fails to describe what you find? Select all that apply.',
    teach: {
      concept:
        'The Purdue model, remember, is a reference architecture: a shared, idealised diagram, not ' +
        'a survey of what any particular plant actually looks like. Knowing where it stops ' +
        'describing reality is what separates somebody who has only read about OT from somebody ' +
        'who has actually walked a plant floor.\n\n' +
        'Four things break the tidy picture routinely. DEVICES WITH THEIR OWN CONNECTIVITY: a ' +
        'controller or sensor fitted with a cellular modem or its own cloud client (software that ' +
        'talks directly to a vendor\'s servers over the internet) has skipped every level at once, ' +
        'connecting straight from the physical process to the outside world. MOBILE ASSETS: the ' +
        'engineering laptop and the visiting contractor\'s machine belong to no fixed level and ' +
        'visit several of them in a single afternoon. WIRELESS: a mesh (a network of many small ' +
        'devices relaying signals to each other) of battery-powered sensors at level 0 has a radio ' +
        'boundary that appears on no wired diagram at all, because there is no cable to draw. And ' +
        'CONVERGED VENDOR PLATFORMS: modern systems that bundle supervision, historical data and ' +
        'analytics into one single product legitimately span levels 2 and 3 and talk to a vendor\'s ' +
        'cloud service by design.\n\n' +
        'None of this means abandon the model. It means use it to state where things SHOULD sit, ' +
        'and treat each departure from that ideal as a specific finding with a named owner, rather ' +
        'than pretending the site is either fully compliant with the diagram or a hopeless mess not ' +
        'worth improving.',
    },
    options: [
      { id: 'a', label: 'A controller with its own cellular or cloud connectivity has bypassed every level at once.' },
      { id: 'b', label: 'Mobile engineering and contractor laptops belong to no level and visit several.' },
      { id: 'c', label: 'Wireless sensor networks create a boundary that appears on no wired diagram.' },
      { id: 'd', label: 'Vendor platforms that bundle supervision and analytics legitimately span levels.' },
      { id: 'e', label: 'A site that does not match the model is misconfigured and should be rebuilt to match it.' },
    ],
    hints: [
      'Four are genuine. One proposes rebuilding a working plant to match a diagram.',
      'Ask what it would cost to re-architect a site that is currently producing something.',
      'The model is a description of where things should sit, not a compliance standard.',
    ],
    solution:
      'A, B, C, and D. Independent connectivity, mobile assets, wireless, and converged platforms ' +
      'all break the neat hierarchy, and all of them are normal. E is the recommendation that gets ' +
      'a report shelved: no site is going to be rebuilt to match a reference model, and a finding ' +
      'that amounts to "your architecture is wrong" gives nobody anything to do. Name each ' +
      'departure, say what it costs, and let the site prioritise.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats the reference model as a compliance standard a working plant must be ' +
          'rebuilt to meet.',
      },
    ],
    debrief:
      'The most valuable thing you can produce early on a site is an honest diagram of what is ' +
      'actually connected. Most places do not have one, and every later argument depends on it.',
    practice: [],
  },
  {
    id: 'ots.3.4',
    moduleId: 'ots.3',
    packageId: 'ot-security-foundations',
    order: 4,
    title: 'Segment without stopping the plant',
    kind: 'multiple-choice',
    goal: 'Introduce segmentation into a running process safely.',
    prompt:
      'A site has one flat network and you have been asked to segment it. Which of the following ' +
      'are sound approaches? Select all that apply.',
    teach: {
      concept:
        '"Segmentation" means dividing a network into separate zones with controlled crossings ' +
        'between them, so that traffic which is not explicitly permitted gets blocked, the network ' +
        'equivalent of adding locked doors and checkpoints inside a building that previously had one ' +
        'open floor plan. A "flat network" is the opposite: one where anything can talk to anything, ' +
        'because no such doors exist yet. Segmenting a live plant, one that is running and producing ' +
        'something right now, is the highest-risk security work you can do there, because getting ' +
        'it wrong by blocking the wrong traffic stops the process itself. It is done in a sequence, ' +
        'and the sequence is the actual skill being tested here.\n\n' +
        'First OBSERVE: passively record what actually talks to what, for long enough to include the ' +
        'monthly report, the quarterly batch (a production run that only happens once every three ' +
        'months) and the annual shutdown. A rule set built from only a week of traffic will look ' +
        'complete and will block something important in month three, when a pattern that only ' +
        'happens quarterly finally occurs and gets treated as forbidden. Then MONITOR IN ALERT MODE: ' +
        'deploy the rules so that violations are only logged and reported rather than actually ' +
        'dropped, and watch what would have broken if the rule had been enforced for real. Then ' +
        'ENFORCE INCREMENTALLY, one boundary at a time, in a maintenance window, with the engineer ' +
        'present and a tested way to reverse the change immediately if something unexpected ' +
        'happens.\n\n' +
        'What fails is enforcing from day one on a rule set derived only from a diagram someone drew ' +
        'once. The diagram is wrong, in ways nobody currently knows, and you will discover exactly ' +
        'which parts of it are wrong by stopping production when a legitimate connection gets ' +
        'blocked, and you will not be asked to do the next phase of the project.',
    },
    options: [
      { id: 'a', label: 'Observe passively first, for long enough to capture periodic and seasonal traffic.' },
      { id: 'b', label: 'Run the rules in alert-only mode and see what would have been blocked.' },
      { id: 'c', label: 'Enforce one boundary at a time, in a window, with a tested rollback.' },
      { id: 'd', label: 'Expect the network diagram to be wrong, and let observation correct it.' },
      { id: 'e', label: 'Derive the rules from the architecture diagram and enforce them at the next opportunity.' },
    ],
    hints: [
      'Four are sound. One trusts a document over observation.',
      'How long do you need to watch to catch traffic that only happens at a quarterly batch?',
      'What is the cost of the first false block, and who pays it?',
    ],
    solution:
      'A, B, C, and D. Observe, alert, enforce incrementally, and assume the diagram is wrong. E is ' +
      'how segmentation projects fail: the diagram omits the vendor link, the backup path and the ' +
      'thing engineering set up in 2019, and enforcing against it takes production down in a way ' +
      'that ends the programme. The slower sequence is not caution for its own sake, it is the only ' +
      'one that finishes.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option builds enforcement rules from the diagram rather than from observed traffic.',
      },
    ],
    debrief:
      'Alert mode is the whole trick. It converts an argument about what the network does into a ' +
      'list of what it actually did, and nobody argues with the list.',
    practice: [],
  },
  {
    id: 'ots.3.5',
    moduleId: 'ots.3',
    packageId: 'ot-security-foundations',
    order: 5,
    title: 'Write the segmentation finding',
    kind: 'short-answer',
    goal: 'Report a flat network in terms the plant will act on.',
    prompt:
      'You have found that the corporate network can reach the plant controllers directly, with no ' +
      'DMZ. In three or four sentences, write the finding.',
    teach: {
      concept:
        'This exercise is about writing up what you found, in the style of a real security report, ' +
        'because a technically correct finding that nobody acts on has accomplished nothing. A flat ' +
        'network here means the corporate business network and the plant controllers can reach each ' +
        'other with no zone or filtering in between, the situation the industrial DMZ exists to ' +
        'prevent. This is the most common serious finding in OT, and it is easy to write in a way ' +
        'that gets nothing done. "The network is flat" is a description; what a plant actually acts ' +
        'on is a specific consequence and a route to fixing it that does not require stopping ' +
        'production to do so.\n\n' +
        'State the CURRENT PATH concretely: which network can reach which devices, over what. State ' +
        'the CONSEQUENCE in plant terms rather than IT ones: an ordinary corporate compromise, which ' +
        'happens through a phishing email and happens to nearly every company eventually, would ' +
        'reach the equipment that actually runs the physical process, and the failure mode there is ' +
        'production loss or a safety event, not merely data loss. Then give a STAGED REMEDY, because ' +
        'a full re-architecture, rebuilding the network from scratch, will be refused and should be: ' +
        'the same observe, then alert-mode rules, then one boundary at a time sequence from the ' +
        'previous exercise.\n\n' +
        'A good finding names the direction and reach of the current path, gives a physical ' +
        'consequence rather than a data one, and proposes a staged route rather than a rebuild.',
    },
    hints: [
      'Do not write "the network is flat". Write what can reach what.',
      'What does a compromise on the corporate side reach, and what happens then in plant terms?',
      'A good finding names the reachable path, gives a physical consequence such as production loss or a safety event, and proposes a staged remedy rather than a rebuild.',
    ],
    solution:
      'Systems on the corporate network can currently open connections directly to the process ' +
      'controllers, with no intermediate zone and no restriction on the protocols involved. The ' +
      'consequence is that an ordinary corporate compromise, of the kind that reaches most ' +
      'organisations eventually through email, would have a direct route to the equipment running ' +
      'the process, and the outcome on this site is production loss or an unsafe process state ' +
      'rather than a data breach. I am not proposing a re-architecture, which would risk the ' +
      'process and would rightly be refused. The staged route is to observe traffic passively over ' +
      'a full production cycle, deploy rules in alert-only mode to see what would break, and then ' +
      'enforce one boundary at a time in maintenance windows with rollback tested.',
    expectedOutput:
      'A finding naming the reachable path, a physical consequence, and a staged remedy rather than ' +
      'a rebuild.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['corporate', 'business network', 'directly', 'no dmz', 'open connections', 'reach'],
          ['production', 'process', 'safety', 'physical', 'unsafe', 'stop'],
          ['staged', 'observe', 'alert-only', 'alert mode', 'one boundary', 'window', 'not a rebuild'],
        ],
        hint:
          'Three parts: the path that exists, what it costs in plant terms, and a staged route to ' +
          'fixing it.',
      },
    ],
    debrief:
      'The sentence that makes this land is the one saying you are not proposing a re-architecture. ' +
      'It tells the plant you understand what you are asking of them, which is what buys the rest.',
    practice: [],
  },
];

// --- Module ots.4: protocols that trust by design ----------------------------

const MODULE_OTS_4: Exercise[] = [
  {
    id: 'ots.4.1',
    moduleId: 'ots.4',
    packageId: 'ot-security-foundations',
    order: 1,
    title: 'Protocols with no authentication',
    kind: 'multiple-choice',
    goal: 'Understand what industrial protocols do and do not provide.',
    prompt:
      'Modbus and DNP3 carry commands to controllers on many plants. Which of the following are ' +
      'accurate? Select all that apply.',
    teach: {
      concept:
        'A "protocol" is a shared set of rules two devices both follow so they can understand each ' +
        'other, the way a language lets two people communicate: Modbus and DNP3 are two of the most ' +
        'widely used protocols for sending commands to industrial controllers. Both were designed ' +
        'for serial links, meaning a physical cable running directly between two trusted devices ' +
        'sitting in the same locked room, decades before anybody imagined connecting them to a ' +
        'wider network. Modbus dates from the 1970s. They were later carried over Ethernet and IP, ' +
        'the same networking technology behind the ordinary internet, essentially unchanged from ' +
        'their original design.\n\n' +
        'What that means in practice is stark. There is generally NO AUTHENTICATION: a device does ' +
        'what it is told because it has no way to ask "who are you, and are you allowed to tell me ' +
        'this." There is NO ENCRYPTION, meaning the messages are not scrambled into an unreadable ' +
        'form, so anybody who can see the traffic can read it plainly, and more importantly can ' +
        'craft their own fake message that looks exactly like a real one. And there is often NO ' +
        'INTEGRITY protection beyond a simple checksum (a small number calculated from a message to ' +
        'catch accidental transmission errors) that was meant to catch electrical line noise, not a ' +
        'deliberate adversary who knows exactly how to make a forged message pass the check.\n\n' +
        'So a valid command from an unauthorised source is indistinguishable from a legitimate one, ' +
        'meaning there is no way, from the device\'s point of view, to tell the two apart. Not ' +
        'because of a vulnerability, a specific flaw that could be patched: because the protocol has ' +
        'no concept of an unauthorised source at all, the same way a landline telephone from decades ' +
        'ago had no way to verify who was calling. Secure variants exist, DNP3 has a secure ' +
        'authentication extension and newer standards do better, and adoption across already ' +
        'installed equipment is slow because the equipment itself is old and rarely replaced. The ' +
        'security therefore has to come from the network around the protocol, controlling who can ' +
        'physically or logically reach the device at all, which is why segmentation matters here far ' +
        'more than it does in ordinary IT.',
    },
    options: [
      { id: 'a', label: 'They generally provide no authentication, so a device cannot tell who is commanding it.' },
      { id: 'b', label: 'They are typically unencrypted, so traffic can be read and crafted by anybody on the path.' },
      { id: 'c', label: 'A valid command from an unauthorised source is indistinguishable from a legitimate one.' },
      { id: 'd', label: 'Because the protocol cannot secure itself, the network around it has to.' },
      { id: 'e', label: 'This is a vulnerability in the protocol that a firmware update would fix.' },
    ],
    hints: [
      'Four are accurate. One calls a design decision a defect.',
      'When was Modbus designed, and what was it connecting?',
      'Could a patch add authentication to a protocol without breaking every device that speaks it?',
    ],
    solution:
      'A, B, C, and D. No authentication, no encryption, no way to distinguish an unauthorised ' +
      'command, and therefore security from the network instead. E misdescribes it in a way that ' +
      'leads to bad recommendations: this is not a bug, it is the design, and it cannot be patched ' +
      'away without breaking interoperability with every device already installed. Secure variants ' +
      'exist and get adopted as equipment is replaced, which is a twenty-year cycle.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option describes a deliberate design characteristic as a defect that a patch would ' +
          'resolve.',
      },
    ],
    debrief:
      'This is why "who can send packets to this device" is the central question in OT security, ' +
      'and why an unauthorised connection is so much more serious here than the equivalent in IT.',
    practice: [],
  },
  {
    id: 'ots.4.2',
    moduleId: 'ots.4',
    packageId: 'ot-security-foundations',
    order: 2,
    title: 'What normal looks like on a plant network',
    kind: 'multiple-choice',
    goal: 'Use the predictability of process traffic as a detection advantage.',
    prompt:
      'You are baselining traffic on a plant network. Which of the following are true, and useful? ' +
      'Select all that apply.',
    teach: {
      concept:
        '"Baselining" means watching a network for a while to learn what its normal behaviour looks ' +
        'like, so that anything different later stands out. This is the one place where OT security ' +
        'is genuinely easier than ordinary IT security, and it is worth knowing well because so much ' +
        'of the rest of this field is harder than its IT equivalent.\n\n' +
        'Plant traffic is REGULAR in a way office traffic never is. In an office, hundreds of people ' +
        'browse, email and use dozens of different applications on their own unpredictable schedule. ' +
        'On a plant, a controller POLLS (repeatedly checks in with) the same devices at the same ' +
        'fixed interval, forever, with no human variation at all. The set of devices that talk to ' +
        'each other is fixed by the physical process design and changes only when somebody physically ' +
        'changes the plant itself. Volumes of traffic are stable and predictable rather than ' +
        'following human working patterns like a lunch-hour lull or an end-of-month rush.\n\n' +
        'That regularity makes ANOMALY DETECTION, spotting behaviour that departs from what is ' +
        'normal, genuinely realistic here in a way it rarely is elsewhere. A new device appearing, a ' +
        'new pair of devices talking to each other for the first time, a familiar device suddenly ' +
        'using a command type it has never used before, or a change in the timing of its polling are ' +
        'all genuinely unusual events here rather than being an ordinary Tuesday. The FALSE POSITIVE ' +
        'problem, alerts that fire on something perfectly normal and waste everyone\'s time, which ' +
        'makes this kind of detection so painful in IT, is much smaller here because normal is so ' +
        'narrow to begin with.\n\n' +
        'The caveat is that periodic events are real: shift changes, batch starts, monthly ' +
        'reporting, an annual shutdown for maintenance. A baseline built from only one week of ' +
        'observation will flag the quarterly batch, something that only happens once every three ' +
        'months, as an intrusion when it finally occurs, which is exactly how a monitoring ' +
        'deployment loses the plant\'s confidence in its very first month.',
    },
    options: [
      { id: 'a', label: 'Controllers poll on fixed cycles, so traffic rhythm is stable and departures are meaningful.' },
      { id: 'b', label: 'The set of devices that communicate is fixed by the process design, so a new pair is notable.' },
      { id: 'c', label: 'Anomaly detection is more workable here than in IT, because normal is genuinely narrow.' },
      { id: 'd', label: 'A baseline must cover periodic events such as batches and shutdowns, or it will alarm on them.' },
      { id: 'e', label: 'Because traffic is predictable, a week of observation is enough to baseline any site.' },
    ],
    hints: [
      'Four are true. One picks a baseline period that will not survive the first quarterly event.',
      'What happens on this network during an annual shutdown?',
      'The regularity is an advantage. What does it cost you if you measure it over too short a window?',
    ],
    solution:
      'A, B, C, and D. Fixed polling, a fixed communication graph, workable anomaly detection, and ' +
      'the requirement to cover periodic events. E is the practical error: a week captures the ' +
      'daily and weekly rhythm and misses the monthly reporting job, the quarterly batch and the ' +
      'annual maintenance, each of which will then generate alerts that make the plant distrust ' +
      'the system exactly when you need them to trust it.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats a week as a sufficient baseline for a process with periodic events.',
      },
    ],
    debrief:
      'Ask the engineers what the longest cycle on the plant is before you set a baseline window. ' +
      'They will tell you about the annual shutdown, and you will avoid the mistake that costs ' +
      'monitoring projects their credibility.',
    practice: [],
  },
  {
    id: 'ots.4.3',
    moduleId: 'ots.4',
    packageId: 'ot-security-foundations',
    order: 3,
    title: 'A command that is valid and wrong',
    kind: 'multiple-choice',
    goal: 'Reason about an instruction that the protocol accepts and the process should not.',
    prompt:
      'Monitoring shows a write command to a controller, changing a set point, from the engineering ' +
      'workstation at 02:00. Which of the following are reasonable observations? Select all that ' +
      'apply.',
    teach: {
      concept:
        'A "set point" is the target value a controller tries to hold something at, such as a ' +
        'temperature, a pressure, or a flow rate; changing it changes what the process is aiming ' +
        'for, not just how it is being watched. Nothing about this command is malformed or broken: ' +
        'it is a perfectly valid, correctly formatted instruction. The protocol has no view about ' +
        'whether this command should have happened, because as covered in the previous exercise, it ' +
        'has no concept of authorised or unauthorised at all, so the judgement is entirely yours, ' +
        'and it has to be made from context the protocol itself does not carry.\n\n' +
        'Three kinds of context decide it. TIME AND PATTERN: set point changes usually happen during ' +
        'a shift, made deliberately by a person who is present, and 02:00 is unusual unless the site ' +
        'genuinely runs an overnight shift. AUTHORISATION: process changes go through a change ' +
        'record, a written note of what was changed and why, on a well-run plant, so the fastest ' +
        'question to ask is whether one exists for tonight. And MAGNITUDE AND DIRECTION: a small ' +
        'adjustment that stays within the normal operating band, the safe range the process is ' +
        'meant to run inside, is a completely different event from one that pushes a value outside ' +
        'it, and the engineers on site can tell you instantly which this is just by looking at the ' +
        'number.\n\n' +
        'What you must not do is decide alone. You do not know what that particular set point ' +
        'actually does to the process, and the person who does is on site right now. This is the ' +
        'exercise where an instinct carried over from ordinary IT incident response, to contain ' +
        'first and ask questions later, is actively dangerous here: reverting a process change ' +
        'without understanding why it was made can leave the plant in a worse and more dangerous ' +
        'state than the original change did.',
    },
    options: [
      { id: 'a', label: 'The command is protocol-valid, so the judgement comes entirely from context the protocol does not carry.' },
      { id: 'b', label: 'Whether a change record exists for tonight is the fastest question to ask.' },
      { id: 'c', label: 'Whether the new value is inside or outside the normal operating band changes the severity.' },
      { id: 'd', label: 'The engineer or operator has to be involved before anything is reverted.' },
      { id: 'e', label: 'The right first action is to block the workstation and revert the set point immediately.' },
    ],
    hints: [
      'Four are reasonable. One acts on a physical process without understanding what the value does.',
      'Ask what happens if you revert a set point that was changed for a good reason at 02:00.',
      'Who on this site knows what that value controls?',
    ],
    solution:
      'A, B, C, and D. Protocol validity means context decides, the change record is the cheapest ' +
      'check, magnitude matters, and the engineer has to be in the loop. E is the IT reflex that ' +
      'does damage here: reverting a process value you do not understand can put the plant in a ' +
      'worse state than leaving it, and blocking the engineering workstation during a genuine ' +
      'night intervention could prevent somebody responding to a fault. Contain in OT means ' +
      'something different, and it is decided with the people who run the process.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option reverts a physical process value before anybody has established what it does.',
      },
    ],
    debrief:
      'Hold on to this. Everything you learned about fast containment elsewhere has to be ' +
      'renegotiated here, because the thing you are containing is moving physical mass.',
    practice: [],
  },
  {
    id: 'ots.4.4',
    moduleId: 'ots.4',
    packageId: 'ot-security-foundations',
    order: 4,
    title: 'Detections worth writing here',
    kind: 'multiple-choice',
    goal: 'Choose detections that suit a network where normal is narrow.',
    prompt:
      'You are writing detections for a plant network. Which of the following are well suited to ' +
      'this environment? Select all that apply.',
    teach: {
      concept:
        'A "detection" is a rule that fires an alert when a specific pattern is seen, the automated ' +
        'version of a security guard who has been told exactly what to watch for. Because normal is ' +
        'so narrow on a plant network, as the earlier baselining exercise established, the best OT ' +
        'detections are ones that would be hopelessly noisy if you tried them in an office and are ' +
        'perfectly workable here.\n\n' +
        'A NEW DEVICE appearing on the network is worth alerting on outright, with no further ' +
        'analysis needed, because the device list is fixed by the process design and simply should ' +
        'not change. A NEW COMMUNICATION PAIR is similar: these two specific things have never ' +
        'talked to each other before, and the process design says they have no reason to start now. ' +
        'An UNUSUAL FUNCTION CODE, meaning a controller receiving a type of command it has never ' +
        'received before, is a strong signal and includes the cases that matter most, such as a ' +
        'programming command arriving outside a scheduled maintenance window. And a CHANGE TO ' +
        'CONTROLLER LOGIC, meaning the actual program running on the PLC gets rewritten, is worth ' +
        'knowing about unconditionally at any time, because it should be rare and always ' +
        'deliberate.\n\n' +
        'What suits this environment badly is anything that depends on volume thresholds tuned for ' +
        'human behaviour, such as "alert if traffic exceeds normal office hours levels", or on ' +
        'content inspection of encrypted traffic that, as covered earlier, is not actually encrypted ' +
        'here anyway. Write detections for the narrowness of what counts as normal; it is the ' +
        'structural advantage this environment gives you that IT security rarely has.',
    },
    options: [
      { id: 'a', label: 'A device appearing that was not previously on the network.' },
      { id: 'b', label: 'Two devices communicating that have never communicated before.' },
      { id: 'c', label: 'A controller receiving a function code it has never previously received.' },
      { id: 'd', label: 'Any change to controller logic, at any time.' },
      { id: 'e', label: 'A volume threshold tuned to typical office working patterns.' },
    ],
    hints: [
      'Four suit this network. One imports an assumption about human working hours.',
      'Ask which of these would be unbearably noisy in a corporate network and is fine here.',
      'What does the process do at 3am on a Sunday?',
    ],
    solution:
      'A, B, C, and D. New devices, new pairs, new function codes and logic changes are all rare ' +
      'and meaningful here, which is exactly why they are good detections. E imports a model of ' +
      'human activity into a network whose activity is machine-driven and constant, so the ' +
      'thresholds are either meaningless or wrong, and it wastes the one structural advantage this ' +
      'environment gives you.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option applies a threshold model built around human working patterns to a ' +
          'machine-driven network.',
      },
    ],
    debrief:
      'A logic change alert is the highest value detection on most plants and the one fewest sites ' +
      'have. If you build one thing, build that.',
    practice: [],
  },
  {
    id: 'ots.4.5',
    moduleId: 'ots.4',
    packageId: 'ot-security-foundations',
    order: 5,
    title: 'Explain the protocol risk to a manager',
    kind: 'short-answer',
    goal: 'Convey the consequence of unauthenticated protocols without technical detail.',
    prompt:
      'A plant manager asks why you keep talking about network access when the control system has ' +
      'never been attacked. In three or four sentences, explain the protocol issue in terms they ' +
      'will act on.',
    teach: {
      concept:
        'This is a short-answer exercise, testing whether you can compress the protocol lesson from ' +
        'earlier in this module into something a busy, non-technical manager will actually sit ' +
        'still for. The manager\'s question is fair, and the honest answer is not about attacks at ' +
        'all, because "has never been attacked" and "cannot be attacked" are two very different ' +
        'claims. It is about what the equipment can and cannot check in the first place.\n\n' +
        'The point to convey is that the controllers cannot tell an authorised instruction apart ' +
        'from an unauthorised one, because the protocols they speak, as covered earlier, have no ' +
        'built-in way to ask "who are you, and should I trust this." That is not a fault in the ' +
        'equipment that could be blamed on poor engineering, it is exactly what those protocols were ' +
        'designed to do decades ago, and it means the protection has to come instead from ' +
        'controlling who is allowed to reach the equipment at all.\n\n' +
        'Then the consequence, stated in terms a manager actually cares about: anything that can ' +
        'reach a controller can instruct it, so the security of the whole process is exactly the ' +
        'security of the network path leading to it, nothing more and nothing less. And the ' +
        'reassurance, which is genuinely true: this is why the answer is segmentation and access ' +
        'control rather than replacing the equipment, which nobody is proposing and which would cost ' +
        'far more.\n\n' +
        'A good answer says the controller cannot verify who is instructing it, connects that ' +
        'directly to network reachability being the real control, and avoids demanding any change to ' +
        'the equipment itself.',
    },
    hints: [
      'Do not talk about attacks. Talk about what the equipment can check.',
      'The consequence is a single sentence about reachability.',
      'A good answer says the controller cannot tell an authorised command from an unauthorised one, so whoever can reach it can instruct it, and the control is therefore the network path rather than the equipment.',
    ],
    solution:
      'The controllers cannot tell the difference between an instruction from you and an ' +
      'instruction from anything else that can reach them, because the protocols they speak have ' +
      'no way of checking who is asking. That is not a fault in the equipment, it is how those ' +
      'protocols were designed when everything was wired together in a locked room. What follows ' +
      'is that the security of the process is really the security of the network path to it: ' +
      'anything that can reach a controller can command it, whether or not anybody has tried yet. ' +
      'That is why I keep asking about access rather than asking you to change any equipment, ' +
      'which I am not proposing.',
    expectedOutput:
      'An answer stating that controllers cannot verify who is instructing them, connecting that to ' +
      'network reachability as the real control, and not demanding equipment change.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['cannot tell', 'no way of checking', 'cannot verify', 'does not know who', 'no authentication'],
          ['reach', 'network path', 'access', 'anything that can'],
          ['not proposing', 'without changing', 'not asking you to change', 'segmentation', 'rather than the equipment'],
        ],
        hint:
          'Three ideas: what the controller cannot check, why reachability therefore is the control, ' +
          'and that you are not asking them to replace anything.',
      },
    ],
    debrief:
      'The last clause does the work. Managers brace for a proposal to replace equipment, and being ' +
      'told early that you are not asking for that is what gets you listened to for the rest of the ' +
      'meeting.',
    practice: [],
  },
];

// --- Module ots.5: living with what you cannot change ------------------------

const MODULE_OTS_5: Exercise[] = [
  {
    id: 'ots.5.1',
    moduleId: 'ots.5',
    packageId: 'ot-security-foundations',
    order: 1,
    title: 'Compensating controls, specifically',
    kind: 'multiple-choice',
    goal: 'Name what you do instead of patching, and what each one buys.',
    prompt:
      'A controller runs unsupported firmware with a known flaw and cannot be replaced this year. ' +
      'Which of the following are useful compensating controls? Select all that apply.',
    teach: {
      concept:
        'A "vulnerability" is a flaw in software or a device that could let somebody do something ' +
        'they should not be able to, such as taking control of it. A "compensating control" is a ' +
        'protection you put around a flaw you cannot directly fix, rather than fixing the flaw ' +
        'itself, the security equivalent of putting a fence around a broken step instead of ' +
        'repairing it immediately: the step is still broken, but nobody falls through it. This is ' +
        'the core competence of OT security. The vulnerability is not going away this year, so you ' +
        'make it unreachable, hard to act on unnoticed, or survivable instead.\n\n' +
        'RESTRICT REACHABILITY: if only three named systems are permitted to send that device any ' +
        'traffic at all, a flaw that requires network access to exploit is only exploitable from ' +
        'those three places, and those three can then be watched closely. ALLOWLIST THE FUNCTIONS: ' +
        'many industrial firewalls (devices that filter network traffic by rule) can permit ordinary ' +
        'read operations, simply asking the device for a status, while denying programming commands ' +
        'to that same device, which removes the worst possible outcomes without touching the ' +
        'equipment itself at all. MONITOR SPECIFICALLY: write a detection for exactly what an attempt ' +
        'to exploit this particular flaw would look like on this device, so that if it happens, you ' +
        'know within minutes rather than months.\n\n' +
        'And PLAN THE REPLACEMENT, with an actual date attached, because compensating controls are a ' +
        'bridge to something better, and a bridge with no far end is just an excuse that never gets ' +
        'revisited. The one thing that does not count as a compensating control is simply documenting ' +
        'the risk and accepting it with no protection at all: that is a decision, a legitimate one ' +
        'sometimes, but it should be recorded honestly as a decision rather than dressed up as a ' +
        'control that is actually doing something.',
    },
    options: [
      { id: 'a', label: 'Restrict which systems can reach the device at all, so the flaw is exploitable from very few places.' },
      { id: 'b', label: 'Allow read operations and deny programming commands to that device at the network layer.' },
      { id: 'c', label: 'Write a detection specific to what exploitation of that flaw would look like here.' },
      { id: 'd', label: 'Attach a replacement date, so the compensating controls are a bridge rather than a destination.' },
      { id: 'e', label: 'Record the risk as accepted and take no further action, since the device cannot be patched.' },
    ],
    hints: [
      'Four are controls. One is a decision dressed as one.',
      'If you cannot fix the device, what can you change about everything around it?',
      'What makes a compensating control temporary rather than permanent?',
    ],
    solution:
      'A, B, C, and D. Reachability, function-level allowlisting, targeted detection, and a ' +
      'replacement date. E is the outcome to argue against: accepting a risk is a legitimate ' +
      'treatment and it is not a compensating control, and recording it as though it were lets ' +
      'everybody believe something is in place when nothing is. If acceptance really is the answer, ' +
      'it needs a named owner and a review date like any other acceptance.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option records an acceptance and calls it a control.',
      },
    ],
    debrief:
      'Function-level allowlisting is the one people do not know about. An industrial firewall that ' +
      'permits reads and denies writes to a controller is often the single highest-value control ' +
      'available on an old device.',
    practice: [],
  },
  {
    id: 'ots.5.2',
    moduleId: 'ots.5',
    packageId: 'ot-security-foundations',
    order: 2,
    title: 'Removable media and the air gap that is not',
    kind: 'multiple-choice',
    goal: 'Understand how isolated systems get compromised anyway.',
    prompt:
      'A site describes its control network as air gapped. Which of the following are accurate? ' +
      'Select all that apply.',
    teach: {
      concept:
        'An "air gap" means a network with no physical or logical connection to any other network ' +
        'at all: no cable, no wifi, no path in or out whatsoever, the security equivalent of an ' +
        'island with no bridge or boat to reach it. Genuine air gaps are rare, and the claim that a ' +
        'network is air gapped is common, which is a gap worth closing early in any assessment, ' +
        'because everything else the site believes about its own safety rests on that one claim ' +
        'being true.\n\n' +
        'Air gaps leak through the things that have to cross regardless of the claimed isolation. ' +
        'REMOVABLE MEDIA: firmware (the low-level software built into a device), project files, ' +
        'vendor software updates and data extracts move between networks on USB drives, and that is ' +
        'the documented route for more than one significant ICS incident already covered in this ' +
        'package. VENDOR LAPTOPS connect to the supposedly isolated network by design, having been ' +
        'plugged into other companies\' networks the week before. TEMPORARY LINKS get created for one ' +
        'project and are quietly never removed once that project ends. And the modem or cellular ' +
        'link somebody added years ago for remote monitoring means the gap has not actually existed ' +
        'for a long time, whatever the diagram still says.\n\n' +
        'The useful reframing is that isolation is a control that has to be MAINTAINED and verified ' +
        'continuously, rather than a fixed property a network simply has once and keeps forever. Ask ' +
        'how somebody would actually know if it were breached, and if the honest answer is that ' +
        'nobody would find out, the isolation is a belief rather than a working control.',
    },
    options: [
      { id: 'a', label: 'Removable media is a documented route into isolated industrial networks.' },
      { id: 'b', label: 'Vendor laptops cross the boundary by design, having been on other networks first.' },
      { id: 'c', label: 'Temporary links created for a project frequently outlive it.' },
      { id: 'd', label: 'Isolation is a control to be maintained and verified, not a property the network has.' },
      { id: 'e', label: 'An air gapped network does not need monitoring, because nothing can reach it.' },
    ],
    hints: [
      'Four are accurate. One draws exactly the wrong conclusion from the claim.',
      'How does firmware get onto an isolated controller?',
      'If the gap were breached, how would anybody find out?',
    ],
    solution:
      'A, B, C, and D. Media, vendor machines, forgotten links, and isolation as a maintained ' +
      'control. E is the belief that makes air gapped sites soft: if nothing is watching because ' +
      'nothing can reach it, then the day something does reach it there is no record and no alert, ' +
      'and the sites that describe themselves this way are often the least instrumented ones you ' +
      'will visit.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option concludes that an isolated network does not need monitoring.',
      },
    ],
    debrief:
      'When somebody says air gapped, ask how firmware gets on and how vendors do support. The ' +
      'answers usually describe the gap being crossed routinely by people who do not think of it ' +
      'that way.',
    practice: [],
  },
  {
    id: 'ots.5.3',
    moduleId: 'ots.5',
    packageId: 'ot-security-foundations',
    order: 3,
    title: 'When a patch is genuinely available',
    kind: 'multiple-choice',
    goal: 'Handle the case where the constraint is a window rather than a impossibility.',
    prompt:
      'A vendor has released and validated a security patch for an HMI, and the next maintenance ' +
      'window is in four months. Which of the following are sound? Select all that apply.',
    teach: {
      concept:
        'Not every OT patch conversation is a flat refusal, and treating them all as one is how you ' +
        'miss the ones that could actually have happened sooner. When the vendor has already ' +
        'validated a fix, meaning tested and approved it for this exact equipment, the constraint is ' +
        'usually scheduling rather than possibility, and a schedule is negotiable in a way a safety ' +
        'certification never is.\n\n' +
        'What helps is being specific about urgency rather than treating every patch the same. Is the ' +
        'flaw remotely reachable from anywhere that actually matters given the segmentation already ' +
        'in place, is it known to be actively exploited by attackers already, and what would ' +
        'exploiting it actually do to the physical process? A flaw only reachable from a network ' +
        'segment that three named engineers can physically touch is a genuinely different ' +
        'proposition from one reachable from the ordinary business network, and saying so plainly ' +
        'buys you credibility for the times you do need a maintenance window moved.\n\n' +
        'It is also worth simply asking whether the window can be brought forward, because sometimes ' +
        'it genuinely can and nobody has thought to ask, and whether some partial measure exists to ' +
        'reduce exposure in the meantime. What does not work is escalating every single validated ' +
        'patch as urgent, which spends the credibility you actually need for the one time it truly ' +
        'is.',
    },
    options: [
      { id: 'a', label: 'Assess reachability under the current segmentation before deciding how urgent it is.' },
      { id: 'b', label: 'Ask whether the window can be moved, since sometimes it can and nobody has asked.' },
      { id: 'c', label: 'Look for an interim measure that reduces exposure without touching the device.' },
      { id: 'd', label: 'Reserve urgency for flaws that are reachable and consequential, to keep it meaningful.' },
      { id: 'e', label: 'Treat every vendor-validated patch as urgent, since the vendor has removed the main objection.' },
    ],
    hints: [
      'Four are sound. One spends your credibility on every patch equally.',
      'What happens the fifth time you call something urgent and it was not?',
      'Ask what the flaw is actually reachable from, given the segmentation you already have.',
    ],
    solution:
      'A, B, C, and D. Reachability first, ask about the window, find an interim measure, and keep ' +
      'urgency scarce. E burns the thing you need most: if every patch is urgent then none of them ' +
      'is, and the time you genuinely need a plant to take an unscheduled outage, you will have ' +
      'spent the standing you needed to ask.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats every validated patch as urgent, which makes the word useless.',
      },
    ],
    debrief:
      'Credibility is the currency in this job. Spend it on the flaw that is reachable and known to ' +
      'be exploited, and be visibly relaxed about the one that is not.',
    practice: [],
  },
  {
    id: 'ots.5.4',
    moduleId: 'ots.5',
    packageId: 'ot-security-foundations',
    order: 4,
    title: 'Backups for a physical process',
    kind: 'multiple-choice',
    goal: 'Say what recovery means when the thing to restore is a controller.',
    prompt:
      'You are reviewing recovery capability on a plant. Which of the following belong in it? ' +
      'Select all that apply.',
    teach: {
      concept:
        'A "backup" is simply a saved copy of something important, kept somewhere separate, so that ' +
        'if the original is lost or destroyed it can be restored rather than rebuilt from nothing. ' +
        'In an office, that mostly means files and databases. On a plant, recovery is not about ' +
        'restoring a server, and the things that actually matter here are frequently not backed up ' +
        'at all, because nobody ever thought of them as "data" worth saving.\n\n' +
        'CONTROLLER LOGIC is the critical one: the actual program running on each PLC, saved in a ' +
        'form that can be loaded straight back onto a replacement device, held somewhere offline so ' +
        'it cannot be destroyed alongside everything else. Sites lose this constantly and discover ' +
        'during an incident that the only copy existed on the engineering laptop that also got ' +
        'encrypted by the same ransomware attack. HMI AND SCADA CONFIGURATION, including the on-screen ' +
        'graphics and the tag database (the list defining every sensor and value the system tracks), ' +
        'because rebuilding those by hand from memory takes weeks. DEVICE CONFIGURATION AND FIRMWARE ' +
        'VERSIONS, so that a brand new replacement unit can be brought to exactly the same working ' +
        'state as the one it replaces.\n\n' +
        'And the two nobody lists, because they are not files at all: SPARE HARDWARE, because a ' +
        'twenty-year-old controller cannot simply be ordered online and arrive on Tuesday, and a ' +
        'TESTED PROCEDURE for running the process in a degraded or fully manual mode, meaning humans ' +
        'operating equipment by hand rather than through the computer system. That last one is what ' +
        'the Ukrainian utilities used in the 2015 incident covered later in this package to restore ' +
        'power, with operators physically driving to substations and closing breakers by hand, and ' +
        'it is the difference between an outage and a genuine crisis.',
    },
    options: [
      { id: 'a', label: 'Controller logic for each PLC, held offline in a form that can be loaded back.' },
      { id: 'b', label: 'HMI and SCADA configuration including the tag database and graphics.' },
      { id: 'c', label: 'Spare hardware, because obsolete controllers cannot simply be reordered.' },
      { id: 'd', label: 'A tested procedure for running the process manually or in a degraded mode.' },
      { id: 'e', label: 'Standard server backups of the corporate file shares, which is where the important documents are.' },
    ],
    hints: [
      'Four belong. One is a normal IT backup that does not restore any part of the process.',
      'What would you actually need to get a plant running again after losing its controllers?',
      'One of the four is not data at all.',
    ],
    solution:
      'A, B, C, and D. Logic, configuration, spares, and a manual procedure. E is not wrong as ' +
      'general practice and restores none of the process: file shares hold documents, and what you ' +
      'need is the program that makes the pump run and a way to run the plant while you reload it. ' +
      'The manual procedure is the one to press for hardest, because it is free and it is what ' +
      'actually got power back on in Ukraine.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option describes ordinary corporate file backups, which restore none of the process.',
      },
    ],
    debrief:
      'Ask where the controller logic backups are, in your first week on any site. A surprising ' +
      'number of answers are "on the laptop", and that is a finding you can fix cheaply.',
    practice: [],
  },
  {
    id: 'ots.5.5',
    moduleId: 'ots.5',
    packageId: 'ot-security-foundations',
    order: 5,
    title: 'Propose controls for an unpatchable device',
    kind: 'short-answer',
    goal: 'Write a proposal a plant will accept for equipment that cannot change.',
    prompt:
      'A controller running end-of-life firmware sits on the plant network with a publicly known ' +
      'flaw. It cannot be patched or replaced for at least eighteen months. In three or four ' +
      'sentences, write what you propose.',
    teach: {
      concept:
        'This exercise pulls together everything the module has covered about compensating controls ' +
        'into one written proposal, and it is judged on whether it can actually be implemented ' +
        'without touching the device or the physical process at all, since that is the whole ' +
        'constraint set out in the scenario.\n\n' +
        'Lead with REACHABILITY, because restricting it is the highest-value change and it happens ' +
        'entirely in the network rather than on the device: name the small set of systems that ' +
        'legitimately need to talk to it, and deny everything else by default. Add FUNCTION ' +
        'RESTRICTION where the equipment in the path supports it, so programming commands specifically ' +
        'are denied while ordinary day-to-day operation continues untouched. Add TARGETED ' +
        'MONITORING, a detection built specifically for this device, so that if anything does reach ' +
        'it, you find out quickly rather than during the next unplanned outage.\n\n' +
        'Then be explicit about the RESIDUAL RISK and the END DATE. Something always remains: the ' +
        'engineers who legitimately reach the device could still, in theory, be a route in, and the ' +
        'controls you are proposing are a bridge to the eventual replacement rather than a permanent ' +
        'substitute for it. A proposal with no end date attached will quietly be treated as a ' +
        'permanent answer, and five years from now somebody will find the exact same device still ' +
        'there, running the exact same old firmware, with a dusty folder of your rules sitting ' +
        'around it and nobody remembering why.\n\n' +
        'A good answer restricts who can reach it, adds monitoring, and states both the residual ' +
        'risk and a replacement horizon, without asking for the device itself to be touched.',
    },
    hints: [
      'Everything you propose has to be implementable without touching the device.',
      'The highest-value change happens in the network rather than on the controller.',
      'A good answer restricts reachability to a named set of systems, adds monitoring for that device, and states the residual risk with a replacement date.',
    ],
    solution:
      'I would leave the device alone and change what can reach it: identify the small set of ' +
      'systems that legitimately need to communicate with it, permit only those, and deny ' +
      'everything else at the nearest point in the network where that can be enforced. Where the ' +
      'equipment in the path allows it, I would also permit normal read and control traffic while ' +
      'denying programming commands, so the worst outcome is off the table without affecting ' +
      'operation. Alongside that, a specific detection for traffic to this device from anywhere ' +
      'unexpected, so we find out in minutes rather than at the next outage. None of this makes the ' +
      'flaw go away: the residual is that the systems which do reach it are now the whole of its ' +
      'security, so this is a bridge to the replacement rather than a substitute, and it needs the ' +
      'replacement date attached.',
    expectedOutput:
      'A proposal restricting reachability, adding targeted monitoring, and stating the residual ' +
      'risk with a replacement horizon, all without touching the device.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['reach', 'permit only', 'restrict', 'deny everything else', 'small set'],
          ['detect', 'monitor', 'alert', 'find out'],
          ['residual', 'does not make', 'bridge', 'replacement', 'still', 'remains'],
        ],
        hint:
          'Three parts: restricting what can reach it, watching it specifically, and saying what ' +
          'remains and until when.',
      },
    ],
    debrief:
      'Notice that you never asked anybody to touch the controller. That is what makes this ' +
      'proposal implementable, and it is why OT security is more about networks than about ' +
      'endpoints.',
    practice: [],
  },
];

// --- Module ots.6: the safety system ------------------------------------------

const MODULE_OTS_6: Exercise[] = [
  {
    id: 'ots.6.1',
    moduleId: 'ots.6',
    packageId: 'ot-security-foundations',
    order: 1,
    title: 'What a safety system is for',
    kind: 'multiple-choice',
    goal: 'Understand the layer that exists to make the process fail safely.',
    prompt:
      'Which of the following are accurate about a safety instrumented system? Select all that ' +
      'apply.',
    teach: {
      concept:
        'A safety instrumented system, first introduced briefly earlier in this package, deserves a ' +
        'full explanation on its own, because it is the single most important piece of equipment on ' +
        'many industrial sites. It is a separate controller with exactly one job: watch for ' +
        'conditions that mean the physical process is heading somewhere dangerous, and put it into ' +
        'a safe state before that happens. It closes a valve, trips a burner (shuts off the fuel ' +
        'feeding a flame), or shuts an entire unit down. Think of it as a smoke alarm wired directly ' +
        'to a fire sprinkler: it does not run the building\'s normal heating and lighting, it exists ' +
        'purely to catch the one specific failure that could kill somebody.\n\n' +
        'Three properties define it. It is INDEPENDENT of the ordinary control system that runs the ' +
        'process day to day, deliberately, often built from a different product line and sometimes ' +
        'even a different manufacturer entirely, so that a failure or a security compromise of the ' +
        'control system does not take the protection down with it. It is CERTIFIED to a functional ' +
        'safety standard, meaning independent experts have reviewed its logic and calculated exactly ' +
        'how often it is allowed to fail, which is why nobody changes it casually or without going ' +
        'through that formal process again. And it is the LAST LAYER: when it acts, every earlier ' +
        'protection, every alarm, every operator response, has already failed to prevent the ' +
        'dangerous condition from developing.\n\n' +
        'For a security person the consequence is simple and absolute. You do not install anything ' +
        'on it, you do not scan it, and you do not propose changes to it without the functional ' +
        'safety engineer, the specialist responsible for it, leading that conversation. Its ' +
        'independence from everything else is itself the control, and anything you do that couples ' +
        'it to something else, even with good security intentions, has removed the exact protection ' +
        'you were hired to strengthen.',
    },
    options: [
      { id: 'a', label: 'It is separate equipment from the control system, deliberately, so one failure does not remove both.' },
      { id: 'b', label: 'It is certified to a functional safety standard, which is why changes are not made casually.' },
      { id: 'c', label: 'When it acts, the earlier layers of protection have already failed.' },
      { id: 'd', label: 'Security measures must not couple it to the systems it is meant to be independent of.' },
      { id: 'e', label: 'Consolidating it onto the control system would simplify security monitoring and is worth proposing.' },
    ],
    hints: [
      'Four are accurate. One proposes removing the property that makes it work.',
      'Ask what independence is actually buying.',
      'If the control system and the safety system share hardware, what does a compromise of that hardware cost you?',
    ],
    solution:
      'A, B, C, and D. Independence, certification, last-layer status, and the requirement that ' +
      'security does not undermine the separation. E is the proposal to never make: consolidation ' +
      'is exactly the coupling the architecture exists to prevent, it would invalidate the safety ' +
      'certification, and it would mean one compromise removes both the control and the protection ' +
      'against the control being wrong.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option proposes consolidating the safety system onto the thing it exists to be ' +
          'independent of.',
      },
    ],
    debrief:
      'If you take one rule from this package into a real site, take this one. Nothing you do ' +
      'should reduce the independence of the safety system, and no security benefit outweighs it.',
    practice: [],
  },
  {
    id: 'ots.6.2',
    moduleId: 'ots.6',
    packageId: 'ot-security-foundations',
    order: 2,
    title: 'Triton, and why it mattered',
    kind: 'multiple-choice',
    goal: 'Understand the first known attack on a safety system, and what it changed.',
    prompt:
      'In 2017 malware known as Triton or Trisis was found at a petrochemical plant, targeting ' +
      'Schneider Electric Triconex safety controllers. Which of the following are accurate? Select ' +
      'all that apply.',
    teach: {
      concept:
        '"Malware" is malicious software, a program written to do something harmful, often without ' +
        'the owner of the affected system knowing it is there. Triton, also known as Trisis, is the ' +
        'incident that changed how this whole field thinks, because it crossed a line people had ' +
        'assumed nobody would actually cross.\n\n' +
        'What was reported: the malware reached the engineering workstation used specifically to ' +
        'program the safety system (recall, the separate controller whose only job is to make the ' +
        'process safe), and attempted to reprogram Triconex safety controllers at a petrochemical ' +
        'facility, a plant that processes oil-derived chemicals. It was discovered only because it ' +
        'went wrong: the controllers detected a fault caused by the tampering and tripped the ' +
        'process into a safe shutdown, exactly what they are built to do in response to any ' +
        'irregularity. That unplanned shutdown is what prompted the investigation that found the ' +
        'malware sitting there afterward.\n\n' +
        'Why it matters is the intent behind it. Attacking an ordinary control system can stop a ' +
        'process or damage equipment. Attacking the SAFETY system specifically removes the one thing ' +
        'that stops a dangerous condition from becoming a catastrophic one, and the only real reason ' +
        'to do that is to enable physical harm to people, not just financial loss to a company. It ' +
        'moved this whole field from arguing mainly about production loss to arguing about ' +
        'consequences to human life, and it is why the independence rule taught in the previous ' +
        'exercise is stated as absolutely as it is.',
    },
    options: [
      { id: 'a', label: 'It targeted safety controllers rather than the control system that runs the process.' },
      { id: 'b', label: 'It was discovered because the controllers detected a fault and tripped the process to a safe state.' },
      { id: 'c', label: 'It reached the safety controllers by way of the engineering workstation for that system.' },
      { id: 'd', label: 'Attacking the safety layer implies an intent to enable physical harm rather than only disruption.' },
      { id: 'e', label: 'It succeeded in causing an explosion, which is how it came to public attention.' },
    ],
    hints: [
      'Four are accurate. One describes an outcome that did not happen.',
      'How was the malware actually found?',
      'The safety system did its job. What does that tell you about the outcome?',
    ],
    solution:
      'A, B, C, and D. It went after the safety layer, arrived through that system engineering ' +
      'workstation, and was found because the controllers faulted and shut the process down safely. ' +
      'E is wrong and it matters that it is: no explosion occurred, and the reason is that the ' +
      'safety system worked. Getting that right is the difference between a lesson about defence in ' +
      'depth succeeding and a horror story, and the horror story version is the one that circulates.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option describes a physical catastrophe that did not occur. Ask what the safety ' +
          'controllers actually did.',
      },
    ],
    debrief:
      'The uncomfortable part is the discovery route. Nobody detected the intrusion; the safety ' +
      'system failed the attack and the resulting outage triggered an investigation. That is luck ' +
      'wearing the costume of a control.',
    practice: [],
  },
  {
    id: 'ots.6.3',
    moduleId: 'ots.6',
    packageId: 'ot-security-foundations',
    order: 3,
    title: 'Security work near a safety system',
    kind: 'multiple-choice',
    goal: 'Know what you may and may not do around certified safety equipment.',
    prompt:
      'You are improving security on a site that has a certified safety instrumented system. Which ' +
      'of the following are appropriate? Select all that apply.',
    teach: {
      concept:
        'You can improve the security around a safety system considerably without ever touching the ' +
        'safety system itself, and that is the whole approach this exercise is testing.\n\n' +
        'What is appropriate: controlling PHYSICAL ACCESS to the equipment and to its programming ' +
        'key switch, a physical key that must be turned to a different position before the ' +
        'controller will accept new logic, which on many safety controllers is the primary ' +
        'protection against reprogramming and is often, in practice, left sitting in the wrong ' +
        'position out of convenience. Controlling access to its ENGINEERING WORKSTATION, which is ' +
        'the exact route Triton used to arrive in the previous exercise. Monitoring PASSIVELY for ' +
        'any communication reaching the safety controllers at all, since in normal operation there ' +
        'should be very little of it, and a genuine programming session should be a planned event ' +
        'somebody can point to and explain. And ensuring changes go through the FUNCTIONAL SAFETY ' +
        'process, the formal review procedure that already exists for this equipment and is more ' +
        'rigorous than anything a security team would impose on its own.\n\n' +
        'What is not appropriate: scanning it, installing anything on it, or proposing changes to ' +
        'its configuration through an ordinary security change process rather than the safety one. ' +
        'The functional safety engineer leads anything that actually touches it, and your role is to ' +
        'make the case for what needs doing and then be useful in getting it done, not to lead the ' +
        'change yourself.',
    },
    options: [
      { id: 'a', label: 'Controlling physical access to the controllers and to the programming key switch.' },
      { id: 'b', label: 'Controlling and monitoring access to the safety engineering workstation.' },
      { id: 'c', label: 'Passively monitoring for any communication with the safety controllers at all.' },
      { id: 'd', label: 'Routing any change through the existing functional safety process, led by that engineer.' },
      { id: 'e', label: 'Running an authenticated vulnerability scan against the safety controllers to establish a baseline.' },
    ],
    hints: [
      'Four are appropriate. One does the thing this module told you never to do.',
      'How much traffic should there be to a safety controller during normal operation?',
      'Who leads a change to certified safety equipment?',
    ],
    solution:
      'A, B, C, and D. Physical access, the workstation, passive monitoring, and the existing ' +
      'safety change process. E is the one that could hurt somebody: scanning a safety controller ' +
      'risks faulting it, a faulted safety controller may trip the process or, worse, may not be ' +
      'available when it is needed, and no baseline is worth that. If a technical assessment of ' +
      'that equipment is genuinely required it happens with the vendor and the safety engineer, on ' +
      'a bench, not on a running plant.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option runs an active scan against certified safety equipment on a live plant.',
      },
    ],
    debrief:
      'The key switch is the detail worth remembering. On many safety controllers it is the ' +
      'difference between reprogrammable and not, and finding it left in the programming position ' +
      'is a real finding you can fix the same afternoon.',
    practice: [],
  },
  {
    id: 'ots.6.4',
    moduleId: 'ots.6',
    packageId: 'ot-security-foundations',
    order: 4,
    title: 'Refuse a change that is routine elsewhere',
    kind: 'short-answer',
    goal: 'Say no to a reasonable-sounding request, in terms that hold up.',
    prompt:
      'A security manager asks you to deploy the corporate endpoint agent to the safety engineering ' +
      'workstation, since it is a Windows machine like any other. In three or four sentences, ' +
      'explain your answer.',
    teach: {
      concept:
        'An "endpoint agent" is a small monitoring program a security team normally installs on ' +
        'every ordinary computer to watch for threats, already mentioned earlier in this package as ' +
        'something that can misbehave on plant equipment. This request is reasonable from where the ' +
        'security manager is standing, since a Windows machine is a Windows machine to them, and ' +
        'wrong from where you are standing, and the way you decline it decides whether you get a ' +
        'hearing the next time you need one.\n\n' +
        'Do not lead with a rule. Lead with the CONSEQUENCE: this particular machine programs ' +
        'certified safety equipment, and anything that changes its behaviour, its timing, or its ' +
        'supported configuration puts that certification and the manufacturer\'s support in ' +
        'question. Then the AUTHORITY: the functional safety process governs changes to anything in ' +
        'this boundary, and it is more rigorous than the ordinary security change process rather ' +
        'than less, so this is not an argument about whether rules apply at all, only about which ' +
        'rules do.\n\n' +
        'Then, and this is the part that actually matters, OFFER THE ALTERNATIVE. The genuine ' +
        'security objective behind the request, visibility and control of a sensitive machine, is ' +
        'still achievable another way: restrict what it is allowed to connect to, control physical ' +
        'and logon access to it, log every time it is used, and monitor the network around it ' +
        'passively. Declining without offering an alternative reads as obstruction; declining with ' +
        'one reads as expertise.\n\n' +
        'A good answer names the certification or vendor support consequence, says the safety ' +
        'process governs it, and proposes network and access controls instead.',
    },
    hints: [
      'Do not open with a rule. Open with what the machine actually does.',
      'The security objective behind the request is legitimate. What else would meet it?',
      'A good answer names the certification or vendor support consequence, points at the functional safety process as the governing one, and offers network or access controls as the alternative.',
    ],
    solution:
      'That machine is not a general purpose Windows box: it programs certified safety controllers, ' +
      'and installing software the safety system vendor has not validated can put both their ' +
      'support and the functional safety certification in question, which moves liability onto us ' +
      'if the safety system ever fails to act. Changes to anything in that boundary are governed by ' +
      'the functional safety process rather than by the security change process, and that process ' +
      'is stricter than ours rather than more relaxed. The objective behind the request is ' +
      'reasonable and I want to meet it another way: restrict what that workstation can connect to, ' +
      'control physical and logon access to it, log every session, and monitor the network around ' +
      'it passively. That gets us visibility and control of a sensitive machine without putting the ' +
      'safety case at risk.',
    expectedOutput:
      'An answer naming the certification or vendor support consequence, identifying the functional ' +
      'safety process as governing, and proposing network and access controls instead.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['certif', 'vendor support', 'validated', 'safety case', 'liability'],
          ['functional safety', 'safety process', 'safety engineer', 'governed'],
          ['instead', 'another way', 'restrict', 'monitor', 'log', 'access control'],
        ],
        hint:
          'Three parts: the consequence of installing it, which process governs the decision, and ' +
          'what you offer instead.',
      },
    ],
    debrief:
      'Every no in this job should come with an alternative. It is the difference between being the ' +
      'person who blocks things and the person who gets asked before the next decision is made.',
    practice: [],
  },
  {
    id: 'ots.6.5',
    moduleId: 'ots.6',
    packageId: 'ot-security-foundations',
    order: 5,
    title: 'Consequence-driven thinking',
    kind: 'multiple-choice',
    goal: 'Prioritise by what could physically happen rather than by vulnerability count.',
    prompt:
      'You have limited budget on a chemical site. Which of the following are sound ways to decide ' +
      'where it goes? Select all that apply.',
    teach: {
      concept:
        'A "vulnerability scanner" is an automated tool that checks software against a list of ' +
        'known flaws and ranks each one it finds as low, medium, high or critical, based purely on ' +
        'how bad that flaw would be in the abstract. The most useful idea in OT security is to start ' +
        'from the worst physical outcomes instead, and work backwards from there, rather than ' +
        'starting from a scanner\'s list of vulnerabilities and working forwards. Approaches with ' +
        'formal names like consequence-driven engineering exist to systematise this, but the core ' +
        'idea is simple enough to apply without needing any of that formal apparatus.\n\n' +
        'Ask the engineers what the worst things that could happen on this site are. They will tell ' +
        'you immediately, because they have thought about it for years, often as part of their own ' +
        'safety training: a runaway chemical reaction, a toxic release, a specific vessel going over ' +
        'pressure and rupturing. Then work backwards to what would physically have to occur for each ' +
        'of those, then to which systems could contribute to making it happen, and put your effort ' +
        'exactly there.\n\n' +
        'What this displaces is prioritising purely by vulnerability severity rating, which in OT ' +
        'correlates poorly with actual physical consequence. A critical-rated flaw on a machine that ' +
        'only displays a graph on a screen matters far less than a medium-rated one on a controller ' +
        'that can open a valve, and no automated scanner knows the difference between the two, ' +
        'because it has no idea what either machine is physically connected to. Starting from ' +
        'consequence instead also gives you something a plant will actually engage with, because you ' +
        'are starting the conversation in their language rather than a scanner\'s.',
    },
    options: [
      { id: 'a', label: 'Start from the worst physical outcomes the engineers can name, and work backwards.' },
      { id: 'b', label: 'Prioritise systems that could contribute to those outcomes over those that could not.' },
      { id: 'c', label: 'Accept that vulnerability severity correlates poorly with physical consequence here.' },
      { id: 'd', label: 'Use the engineers own language for the hazards, because it is what the site already reasons in.' },
      { id: 'e', label: 'Rank by the number and severity of vulnerabilities found on each system.' },
    ],
    hints: [
      'Four are sound. One ranks by a number that knows nothing about the process.',
      'Does a scanner know which controller opens a valve and which one drives a display?',
      'Who on the site already has a list of the worst possible outcomes?',
    ],
    solution:
      'A, B, C, and D. Start from consequence, prioritise contributors, distrust severity as a ' +
      'proxy, and speak in the hazards the site already reasons about. E is the approach that ' +
      'produces a report nobody acts on: it ranks a display server above a controller because the ' +
      'display server runs software with more published flaws, and it never mentions the vessel ' +
      'that everybody on site is actually worried about.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option ranks systems by vulnerability counts rather than by what they could ' +
          'contribute to physically.',
      },
    ],
    debrief:
      'Open your first site visit by asking what the worst thing that could happen here is. It is ' +
      'the best question in this field: it gets you a real answer, and it tells the engineers ' +
      'immediately that you are not there to count patches.',
    practice: [],
  },
];

// --- Module ots.7: what actually happened -------------------------------------

const MODULE_OTS_7: Exercise[] = [
  {
    id: 'ots.7.1',
    moduleId: 'ots.7',
    packageId: 'ot-security-foundations',
    order: 1,
    title: 'Ukraine, 2015',
    kind: 'multiple-choice',
    goal: 'Learn the pattern from the first widely documented attack to cut power.',
    prompt:
      'In December 2015 attackers caused power outages affecting distribution customers in Ukraine. ' +
      'Which of the following are accurate as widely reported? Select all that apply.',
    teach: {
      concept:
        'A "breaker" here is a large electrical switch that connects or disconnects a section of the ' +
        'power grid, the industrial-scale version of the circuit breaker in a home fuse box. This is ' +
        'the case worth knowing in the most detail of any in this module, because almost nothing ' +
        'about it was technically exotic, and the whole shape of it is directly reusable to think ' +
        'about your own site.\n\n' +
        'As reported: attackers gained access to the ordinary business networks of Ukrainian ' +
        'electricity distribution companies months in advance of the actual outage, using PHISHING, ' +
        'sending fake emails with malicious documents attached, that delivered a piece of malware ' +
        'called BlackEnergy once opened. They then moved from that business network into the control ' +
        'environment, harvested credentials (stole usernames and passwords), and spent time simply ' +
        'learning how the systems worked. On the day of the attack itself, they used the operators\' ' +
        'own remote access and HMI software, the legitimate tools built for the job, to open the ' +
        'breakers, cutting power to roughly a quarter of a million customers.\n\n' +
        'They also did three things deliberately to slow the recovery afterward: wiped systems with ' +
        'a destructive tool called KillDisk, overwrote the firmware on serial-to-Ethernet converters ' +
        '(small devices that translate between an older wired standard and modern networking) so ' +
        'those devices could no longer be commanded remotely at all, and ran a telephone denial of ' +
        'service, flooding the call centres with fake calls, so customers could not even report the ' +
        'outages that were happening.\n\n' +
        'The recovery is the part every OT person cites, and for good reason: operators restored ' +
        'power by physically driving to substations and closing the breakers by hand. The manual ' +
        'fallback existed, people were trained on it in advance, and it worked when the digital ' +
        'systems could not be trusted.',
    },
    options: [
      { id: 'a', label: 'Initial access was through the business network, months before the outage.' },
      { id: 'b', label: 'The attackers operated the utility own remote access and HMI software to open breakers.' },
      { id: 'c', label: 'They took deliberate steps to slow recovery, including wiping systems and attacking the call centres.' },
      { id: 'd', label: 'Power was restored by operators going to substations and switching manually.' },
      { id: 'e', label: 'The attack worked by exploiting a zero-day vulnerability in the grid control protocol.' },
    ],
    hints: [
      'Four are accurate. One assumes a technical exploit where the reporting describes legitimate tools.',
      'What did they actually use to open the breakers?',
      'Ask why the manual restoration is the detail everybody in this field repeats.',
    ],
    solution:
      'A, B, C, and D. Business network first, months of preparation, the operators own tools used ' +
      'against them, deliberate obstruction of recovery, and a manual restoration that worked. E is ' +
      'the assumption to drop: no exotic protocol exploit was needed, because once you have valid ' +
      'access to the systems that command breakers, the protocol does what it is told. That is the ' +
      'lesson from module four arriving in real life.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option attributes the outage to a protocol zero-day rather than to legitimate tools ' +
          'operated by an intruder.',
      },
    ],
    debrief:
      'Two takeaways for your own site. The route in was ordinary IT, which is why the boundary ' +
      'matters, and the way out was manual operation, which is why that procedure is a security ' +
      'control and belongs in your recovery review.',
    practice: [],
  },
  {
    id: 'ots.7.2',
    moduleId: 'ots.7',
    packageId: 'ot-security-foundations',
    order: 2,
    title: 'Stuxnet, and what a targeted attack looks like',
    kind: 'multiple-choice',
    goal: 'Understand the case that proved code can damage machinery.',
    prompt:
      'Stuxnet, discovered in 2010, targeted industrial equipment associated with uranium ' +
      'enrichment at Natanz. Which of the following are accurate as widely reported? Select all ' +
      'that apply.',
    teach: {
      concept:
        'A "centrifuge" here is a machine that spins at extremely high speed to separate materials, ' +
        'used in uranium enrichment to concentrate the fissile isotope; running one at the wrong ' +
        'speed can physically tear it apart. Stuxnet is the origin story of this whole field, the ' +
        'case that first proved software could reach out and physically destroy machinery, and the ' +
        'details that matter here are not the espionage ones.\n\n' +
        'As reported: it spread through removable media (USB drives) and ordinary networks, used ' +
        'several previously unknown Windows vulnerabilities (flaws nobody had found or patched yet, ' +
        'making them especially valuable and hard to defend against), and specifically sought out ' +
        'Siemens Step7 engineering software and particular PLC configurations rather than infecting ' +
        'indiscriminately. Where it found what it was looking for, it altered the logic controlling ' +
        'centrifuge frequency converters, varying the spin speed in a way that damaged the ' +
        'centrifuges gradually over time.\n\n' +
        'The part every OT person remembers is what it did to the operators watching the process: ' +
        'while manipulating the equipment, it replayed previously recorded normal values back to the ' +
        'monitoring systems, so the displays showed a perfectly healthy plant the entire time. The ' +
        'integrity of what an operator sees on screen is not a secondary concern in this field, it ' +
        'is the single thing that decides whether a human being can notice a problem and intervene ' +
        'before it becomes serious.\n\n' +
        'It also crossed into an environment that was not connected to the internet at all, which is ' +
        'exactly why the removable media lesson in the earlier module about air gaps is stated as ' +
        'firmly as it is.',
    },
    options: [
      { id: 'a', label: 'It sought specific Siemens engineering software and particular controller configurations.' },
      { id: 'b', label: 'It altered controller logic to vary equipment speeds in a way that caused physical damage over time.' },
      { id: 'c', label: 'It replayed recorded normal values to monitoring systems, so operators saw a healthy process.' },
      { id: 'd', label: 'It reached an environment that was not internet-connected, by other routes including removable media.' },
      { id: 'e', label: 'It caused immediate, obvious equipment failure, which is how it was detected.' },
    ],
    hints: [
      'Four are accurate. One describes a detection route that the design specifically avoided.',
      'What was the point of feeding recorded values back to the displays?',
      'Was the damage sudden or gradual, and which would be harder to attribute?',
    ],
    solution:
      'A, B, C, and D. Highly specific targeting, gradual physical damage, falsified operator ' +
      'displays, and a route into a network with no internet connection. E inverts the design: the ' +
      'damage was gradual and the displays were falsified precisely so that failures would look ' +
      'like unreliable equipment rather than an attack. Slow and deniable was the objective, and ' +
      'that is a harder problem to detect than anything sudden.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option describes sudden obvious failure, which is the opposite of what the falsified ' +
          'displays were for.',
      },
    ],
    debrief:
      'The falsified readings are the transferable lesson. If an attacker controls what the ' +
      'operator sees, the human safeguard is gone, which is why integrity of process data outranks ' +
      'its confidentiality by so far.',
    practice: [],
  },
  {
    id: 'ots.7.3',
    moduleId: 'ots.7',
    packageId: 'ot-security-foundations',
    order: 3,
    title: 'Colonial Pipeline, and the IT decision that stopped OT',
    kind: 'multiple-choice',
    goal: 'See how an IT incident halts a physical process without touching it.',
    prompt:
      'In 2021 Colonial Pipeline halted fuel delivery after a ransomware incident. Which of the ' +
      'following are accurate as reported? Select all that apply.',
    teach: {
      concept:
        '"Ransomware" is malware that encrypts, meaning scrambles into unreadable form, a victim\'s ' +
        'files and then demands payment to unscramble them, effectively holding a company\'s own ' +
        'data hostage. This case is misremembered constantly, even by people working in security, ' +
        'and getting it right changes what you would actually recommend to a client afterward.\n\n' +
        'As reported: the ransomware affected business and IT systems, ordinary office computers and ' +
        'servers, not the operational technology that actually moves fuel through the pipeline. The ' +
        'company shut the pipeline down itself as a precaution, and reporting indicated a ' +
        'significant factor was the inability to use the business systems that handle billing and ' +
        'measurement, so the company could no longer reliably account for what fuel it was actually ' +
        'delivering to whom.\n\n' +
        'That is the lesson. The OT itself was not compromised, and the physical process stopped ' +
        'anyway, because the business depends on ordinary IT systems to operate commercially at all, ' +
        'and because with the boundary between the two uncertain during the incident, the safe ' +
        'decision was to separate them completely rather than risk finding out the hard way. A site ' +
        'that cannot say with confidence whether an IT compromise reached the plant will shut the ' +
        'plant down regardless, which means the value of good segmentation is not only preventing ' +
        'spread: it is being able to prove, during the incident itself, that spread did not happen.\n\n' +
        'The other detail worth carrying is the initial access, reported as a VPN (a private, ' +
        'remote-access network connection) account that was no longer in active use and had no ' +
        'multi-factor authentication, meaning a password alone was enough to get in, with no second ' +
        'check such as a code sent to a phone.',
    },
    options: [
      { id: 'a', label: 'The ransomware affected business and IT systems rather than the operational technology itself.' },
      { id: 'b', label: 'The shutdown was a company decision, with inability to use billing and measurement systems a reported factor.' },
      { id: 'c', label: 'Being unable to prove that a compromise did not reach OT is itself a reason plants shut down.' },
      { id: 'd', label: 'Reported initial access was a disused VPN account without multi-factor authentication.' },
      { id: 'e', label: 'The attackers took control of pipeline operations and stopped the flow directly.' },
    ],
    hints: [
      'Four are accurate. One is the version most people remember and it is wrong.',
      'Which network did the ransomware actually affect?',
      'Why would a company stop a process that was still working?',
    ],
    solution:
      'A, B, C, and D. IT systems affected, a precautionary business decision with billing as a ' +
      'reported factor, the inability to prove separation as a driver, and a disused VPN account ' +
      'without MFA as the way in. E is the popular version and it is not what was reported: nobody ' +
      'took control of the pipeline. It matters because the popular version leads to recommendations ' +
      'about hardening controllers, and the actual case argues for account hygiene, MFA, and being ' +
      'able to demonstrate the boundary held.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option has the attackers directly operating the pipeline, which is not what was ' +
          'reported.',
      },
    ],
    debrief:
      'Add this to your segmentation argument. Good separation is not only about stopping spread, ' +
      'it is about being able to say on the day that spread did not happen, which is what keeps ' +
      'the plant running.',
    practice: [],
  },
  {
    id: 'ots.7.4',
    moduleId: 'ots.7',
    packageId: 'ot-security-foundations',
    order: 4,
    title: 'Oldsmar, and the story that changed',
    kind: 'multiple-choice',
    goal: 'Hold a widely repeated incident to what the record actually supports.',
    prompt:
      'In 2021 it was widely reported that an intruder altered chemical levels at a water treatment ' +
      'facility in Oldsmar, Florida. Which of the following are accurate? Select all that apply.',
    teach: {
      concept:
        'Sodium hydroxide is a strong chemical used in small, carefully controlled amounts to adjust ' +
        'the acidity of drinking water; at a high enough level it becomes dangerous. This case is in ' +
        'the module because of what happened to the story afterward, which turns out to be more ' +
        'useful to know than the original story itself.\n\n' +
        'The initial reporting in February 2021 described an intruder remotely accessing an HMI and ' +
        'raising the sodium hydroxide setting dramatically, with an alert operator noticing the ' +
        'change on screen and reversing it before any harm was done. It was cited everywhere ' +
        'afterward as proof of the threat facing water utilities, including in official government ' +
        'messaging and in a great many security conference talks.\n\n' +
        'Subsequent reporting cast substantial doubt on that account. In 2023 it was reported that ' +
        'investigators had found no actual evidence of an intrusion having occurred, and that the ' +
        'incident was likely attributable to operator error instead, with the town itself having ' +
        'concluded much the same thing. The remote access software genuinely was in use and shared ' +
        'among multiple people, which is a real security weakness regardless; the intrusion account ' +
        'specifically is simply not supported by what investigators later found.\n\n' +
        'The lesson here is about this field rather than about water treatment specifically. OT ' +
        'incidents get reported early, from partial and incomplete information, into an audience ' +
        'that badly wants the dramatic story to be true, and corrections issued years later travel ' +
        'far less widely than the original headline did. If you ever cite an incident like this in a ' +
        'report to a client, check whether the account still stands up before you do.',
    },
    options: [
      { id: 'a', label: 'The initial reporting described a remote intruder raising a chemical setting, and was widely repeated.' },
      { id: 'b', label: 'Later reporting indicated investigators found no evidence of an intrusion.' },
      { id: 'c', label: 'Operator error emerged as the likelier explanation.' },
      { id: 'd', label: 'Shared remote access software was genuinely in use, which is a real weakness regardless.' },
      { id: 'e', label: 'The intrusion account is settled, and remains the standard example of an attack on water treatment.' },
    ],
    hints: [
      'Four are accurate. One treats a disputed account as settled.',
      'What did later reporting say investigators found?',
      'Ask why this case is in a module about learning from incidents.',
    ],
    solution:
      'A, B, C, and D. It was reported as an intrusion, later reporting indicated no evidence of ' +
      'one was found, operator error emerged as more likely, and the shared remote access was a ' +
      'genuine weakness either way. E is the position to avoid, and the reason this exercise ' +
      'exists: the original story is still repeated constantly in security material, including by ' +
      'people who should check, and repeating a corrected account in a report is the kind of error ' +
      'that costs you the rest of the document.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option presents the original intrusion account as settled fact.',
      },
    ],
    debrief:
      'This field has a small number of incidents and repeats them heavily, which means errors ' +
      'become canon. Check the current state of any case before you put it in front of a client.',
    practice: [],
  },
  {
    id: 'ots.7.5',
    moduleId: 'ots.7',
    packageId: 'ot-security-foundations',
    order: 5,
    title: 'The pattern across all of them',
    kind: 'short-answer',
    goal: 'Extract the common route rather than collecting stories.',
    prompt:
      'Looking across Ukraine 2015, Stuxnet, Triton and Colonial, write three or four sentences on ' +
      'what they have in common that is useful for defending a plant.',
    teach: {
      concept:
        'This is a short-answer exercise asking you to step back from the four individual case ' +
        'studies covered in this module and find what they have in common, because collecting ' +
        'incidents as stories is not really the point; finding the shared shape underneath them is, ' +
        'since that shape is what you can actually build a defence against.\n\n' +
        'Three things recur across all four. The ROUTE IN was ordinary in every case: phishing and a ' +
        'business network compromise in Ukraine, removable media for Stuxnet, an unused VPN account ' +
        'at Colonial. None of them started with an exotic, never-seen-before attack on specialised ' +
        'industrial equipment, and that is exactly why the ordinary IT boundary and basic account ' +
        'hygiene, things like disabling unused accounts and requiring multi-factor authentication, ' +
        'matter so much here.\n\n' +
        'The ENGINEERING PATH was central in every case too: the engineering workstation for Triton, ' +
        'the Step7 programming software for Stuxnet, the operators\' own HMI and remote access ' +
        'software in Ukraine. Attackers use the legitimate, everyday means of changing the process, ' +
        'because that access already exists for the people who run the plant, and using it does not ' +
        'require finding a technical exploit at all.\n\n' +
        'And PREPARATION took months in each case. None of these were opportunistic, done on a ' +
        'whim. That is discouraging, since it shows real planning and patience, and it is also the ' +
        'opportunity: a long DWELL TIME, meaning the period an attacker spends quietly inside a ' +
        'network before acting, is a long window during which ordinary detection on ordinary IT ' +
        'systems could have found something and stopped it before any of these incidents happened.',
    },
    hints: [
      'Look at how each one got in, not at what it did once inside.',
      'What did the attackers use to change the process in each case?',
      'A good answer notes that entry was through ordinary IT or media rather than industrial exploits, that legitimate engineering access was the mechanism, and that long dwell time is a detection opportunity.',
    ],
    solution:
      'None of them began with an exotic attack on industrial equipment: entry was phishing and the ' +
      'business network in Ukraine, removable media for Stuxnet, and a disused VPN account without ' +
      'multi-factor authentication at Colonial. Once inside, the mechanism was legitimate ' +
      'engineering access rather than protocol exploitation, whether that was the engineering ' +
      'workstation, the vendor programming software, or the operators own HMI and remote access. ' +
      'And all of them involved months of preparation rather than an opportunistic smash and grab. ' +
      'For defending a plant that means the highest-value work is the boundary and account hygiene ' +
      'on the IT side, tight control of the engineering path, and taking seriously that a long ' +
      'dwell time is a long chance to notice something.',
    expectedOutput:
      'An answer naming ordinary IT or media as the route in, legitimate engineering access as the ' +
      'mechanism, and long preparation as a detection opportunity.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['phishing', 'business network', 'vpn', 'removable media', 'ordinary', 'it side'],
          ['engineering workstation', 'legitimate', 'their own', 'programming software', 'hmi', 'engineering access'],
          ['months', 'dwell', 'preparation', 'long', 'time to notice', 'not opportunistic'],
        ],
        hint:
          'Three ideas: how they got in, what they used once inside, and what the timescale offers a ' +
          'defender.',
      },
    ],
    debrief:
      'This is the answer to "but nobody is targeting us". The route in every one of these cases ' +
      'was something ordinary that could have happened to anybody, and the industrial part came ' +
      'later.',
    practice: [],
  },
];

// --- Module ots.8: working in OT ----------------------------------------------

const MODULE_OTS_8: Exercise[] = [
  {
    id: 'ots.8.1',
    moduleId: 'ots.8',
    packageId: 'ot-security-foundations',
    order: 1,
    title: 'Who you actually work with',
    kind: 'multiple-choice',
    goal: 'Understand the working relationships this role depends on.',
    prompt:
      'You are the first OT security hire at a manufacturing site. Which of the following are ' +
      'accurate about how the job works? Select all that apply.',
    teach: {
      concept:
        'This final module is about the human side of the job rather than the technical side, and ' +
        'it starts with who you actually work alongside. This role has less formal authority and ' +
        'more influence than its equivalent in an ordinary IT security department, and people who ' +
        'expect the reverse struggle badly when they arrive.\n\n' +
        'The CONTROLS ENGINEERS own the systems and will implement most of what actually changes on ' +
        'the ground. They have usually been at the site far longer than you have, and have watched ' +
        'security initiatives arrive with fanfare and quietly leave again. The OPERATORS run the ' +
        'process day to day and notice things no monitoring software ever will: an operator simply ' +
        'saying a valve is behaving oddly is a security signal worth more than most automated ' +
        'alerts. The PLANT MANAGER carries accountability for both output and safety, and is the ' +
        'person who ultimately makes the decisions you recommend into reality or does not. And the ' +
        'IT SECURITY TEAM has the tooling, the budget and usually the wrong instincts for this ' +
        'physical environment, so part of your job becomes translating in both directions between ' +
        'them and the plant.\n\n' +
        'What does not work is arriving and expecting to be obeyed on authority alone. You will be ' +
        'right about something important in your first month and be politely ignored anyway, and ' +
        'the way through that is not escalating to somebody\'s boss, it is having already been ' +
        'useful about three smaller things first.',
    },
    options: [
      { id: 'a', label: 'Controls engineers own the systems and will implement most of what changes.' },
      { id: 'b', label: 'Operators notice process anomalies that no monitoring system will catch.' },
      { id: 'c', label: 'The plant manager carries accountability for output and safety, and makes the decisions.' },
      { id: 'd', label: 'Part of the role is translating between plant and IT security in both directions.' },
      { id: 'e', label: 'Security policy gives you authority to require changes on the plant network.' },
    ],
    hints: [
      'Four are accurate. One assumes an authority this role rarely has.',
      'Who actually types the change into the controller?',
      'What happens the first time you try to require something from a plant manager?',
    ],
    solution:
      'A, B, C, and D. Engineers implement, operators observe, the plant manager decides, and you ' +
      'translate. E is the misunderstanding that wastes a first year: even where a policy nominally ' +
      'applies, a plant that does not want a change will find safety, vendor and scheduling reasons ' +
      'to defer it indefinitely, and every one of those reasons will be legitimate. Influence is ' +
      'the mechanism here, and it is built by being useful before you need it.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option assumes policy authority over a plant network.',
      },
    ],
    debrief:
      'Spend your first month asking questions and fixing something small that annoys the ' +
      'engineers. It is not politics, it is how you get to be in the room for the decision that ' +
      'matters.',
    practice: [],
  },
  {
    id: 'ots.8.2',
    moduleId: 'ots.8',
    packageId: 'ot-security-foundations',
    order: 2,
    title: 'Change control on a plant',
    kind: 'multiple-choice',
    goal: 'Work within a change process that is stricter than the one you came from.',
    prompt:
      'You want to add a passive network sensor to the plant network. Which of the following are ' +
      'accurate about how that has to happen? Select all that apply.',
    teach: {
      concept:
        '"Change control" is the formal process an organisation uses to review and approve any ' +
        'modification before it is made, rather than letting people simply make changes whenever ' +
        'they feel like it. Plant change control is usually more rigorous than IT change control, ' +
        'not less, and security people arriving from an ordinary IT background frequently assume ' +
        'the opposite, mistaking slowness for weakness rather than for thoroughness.\n\n' +
        'Even a purely passive sensor, one that only listens and never sends anything, is still a ' +
        'change. It needs a written description of what is being added and exactly where, an ' +
        'assessment of everything that could go wrong including the physical consequence to the ' +
        'process, a review by people who actually understand that process, a scheduled window to do ' +
        'the work in, and a rollback plan, a tested way to undo it if something goes wrong. The tap ' +
        'or span port itself is a change to network equipment, and on some plants that particular ' +
        'switch is part of a formally validated system, meaning touching it at all triggers its own ' +
        'review.\n\n' +
        'What makes this workable rather than simply infuriating is preparation. Bring the answers ' +
        'before you are even asked: exactly what the device does and does not transmit, what happens ' +
        'if it fails, what it is physically connected to, how it is powered, and who supports it ' +
        'going forward. An engineer whose questions you have already answered on paper will help you ' +
        'get the change approved quickly. One who has to drag each answer out of you individually ' +
        'will rightly conclude you have not thought it through.',
    },
    options: [
      { id: 'a', label: 'A passive sensor is still a change and goes through the plant change process.' },
      { id: 'b', label: 'The assessment has to cover physical consequence, not only information risk.' },
      { id: 'c', label: 'Creating the tap or span port is itself a change to network equipment.' },
      { id: 'd', label: 'Bringing the failure modes and answers in advance is what gets it approved.' },
      { id: 'e', label: 'Because it only listens, it can be installed outside the change process.' },
    ],
    hints: [
      'Four are accurate. One takes a shortcut on the grounds that listening is harmless.',
      'What has to be done to the switch to get you a copy of the traffic?',
      'What does the engineer want to know before they agree?',
    ],
    solution:
      'A, B, C, and D. It is a change, the assessment is physical, the tap is a change too, and ' +
      'preparation is what makes approval fast. E is how a security person loses the plant: ' +
      'installing anything outside the process, however harmless, is exactly the behaviour that ' +
      'gets your access revoked, and the fact that it was only listening will not be the part ' +
      'anybody remembers.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option installs equipment outside the change process because it only listens.',
      },
    ],
    debrief:
      'The change process is slow and it is also the thing that keeps the plant safe. Learning to ' +
      'work inside it quickly, rather than around it, is most of what makes somebody effective here.',
    practice: [],
  },
  {
    id: 'ots.8.3',
    moduleId: 'ots.8',
    packageId: 'ot-security-foundations',
    order: 3,
    title: 'Responding to an incident on a plant',
    kind: 'multiple-choice',
    goal: 'Know how incident response differs when the asset is a physical process.',
    prompt:
      'You suspect a compromise on the plant network. Which of the following are accurate about ' +
      'responding? Select all that apply.',
    teach: {
      concept:
        '"Containment" in security means acting to stop an intrusion from spreading further, ' +
        'typically by isolating or disconnecting the affected system as quickly as possible. Almost ' +
        'everything you might have learned about containment from ordinary IT incident response has ' +
        'to be renegotiated here, because on a plant, the containment action itself can be more ' +
        'physically dangerous than the intrusion it is responding to.\n\n' +
        'The decision to isolate a system, shut it down, or keep it running is a PLANT decision, ' +
        'made together with the plant manager and the engineers, weighing safety and the current ' +
        'state of the process rather than being made unilaterally by security. Disconnecting a ' +
        'controller in the middle of a batch (a single production run) can leave the physical ' +
        'process in a condition nobody has a written procedure for handling. There is often a SAFE ' +
        'STATE to reach first, meaning bringing the process to a stable, non-hazardous condition ' +
        'before touching anything else, and reaching it safely takes real time.\n\n' +
        'Evidence collection is constrained too: you may not be able to take a controller offline to ' +
        'image it (make a forensic copy of its contents for later analysis), and volatile evidence, ' +
        'information that only exists while a system is running and disappears the moment it stops, ' +
        'on an HMI competes directly with the operator\'s need to keep watching the process live. And ' +
        'the response team includes people an ordinary IT incident would never involve at all: ' +
        'operations staff, a safety officer, and often a government regulator, because in several ' +
        'sectors an incident affecting a safety or environmental system must legally be reported.\n\n' +
        'What holds constant, whatever the specifics of an incident, is the value of knowing all of ' +
        'this in advance. The time to agree who has the authority to order a shutdown is not in the ' +
        'middle of one.',
    },
    options: [
      { id: 'a', label: 'Isolating or shutting down is a plant decision, weighing process state and safety.' },
      { id: 'b', label: 'There is often a safe state to reach first, and reaching it takes time.' },
      { id: 'c', label: 'Evidence collection competes with keeping the process visible and controllable.' },
      { id: 'd', label: 'The response may involve operations, safety and a regulator, not only security and IT.' },
      { id: 'e', label: 'The fastest containment is best, as it is in IT, because dwell time is the main risk.' },
    ],
    hints: [
      'Four are accurate. One imports a rule that can be dangerous here.',
      'What happens if you disconnect a controller in the middle of a batch?',
      'Ask what the containment action itself could cost.',
    ],
    solution:
      'A, B, C, and D. The decision belongs to the plant, a safe state may come first, evidence ' +
      'competes with operability, and the cast is wider. E is the reflex that does harm: in IT the ' +
      'containment action is nearly free, and here it can stop production or leave a process in an ' +
      'unsafe condition, so fastest is not best. It is decided together, and preferably against a ' +
      'plan agreed long beforehand.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option imports the IT rule that the fastest containment is the best containment.',
      },
    ],
    debrief:
      'Write the OT incident plan before you need it, and get the plant manager to agree who can ' +
      'order what. That single conversation is worth more than any tooling you will buy.',
    practice: [],
  },
  {
    id: 'ots.8.4',
    moduleId: 'ots.8',
    packageId: 'ot-security-foundations',
    order: 4,
    title: 'Your first ninety days',
    kind: 'short-answer',
    goal: 'Plan an entry into a site that builds credibility rather than spending it.',
    prompt:
      'You are the first OT security person at a site that has never had one. In three or four ' +
      'sentences, say what you would do in your first ninety days.',
    teach: {
      concept:
        'This closing exercise asks you to plan the actual opening weeks of a real job, pulling ' +
        'together the working relationships from earlier in this module with everything the rest of ' +
        'the package has taught. The natural instinct when starting a new security role is to ' +
        'assess and report. On a plant, that produces a document nobody asked for, written by ' +
        'somebody nobody knows yet, about equipment that somebody has not actually seen in person, ' +
        'and it lands badly every time.\n\n' +
        'What works is a different order entirely. LEARN THE PROCESS first: walk the plant with an ' +
        'engineer, understand what it actually makes and what the worst possible outcomes would be, ' +
        'and let the people who run it every day explain it in their own words. BUILD THE INVENTORY ' +
        'next, passively and by physically walking the site as covered earlier in this package, ' +
        'because everything later depends on knowing what exists, and most sites genuinely do not ' +
        'have one, so producing it is immediately useful to people other than just you.\n\n' +
        'Then FIND SOMETHING SMALL AND FIX IT, ideally something that has been quietly annoying the ' +
        'engineers for a while, because credibility here is built by contributing something useful ' +
        'rather than by producing findings about what is wrong. Only then ASSESS, and when you do, ' +
        'frame it by physical consequence in the same language the site already uses, the way this ' +
        'whole package has been teaching.\n\n' +
        'A good answer puts learning the process and building an inventory before assessment, and ' +
        'names relationship or credibility with engineers and operators as a deliberate goal rather ' +
        'than a side effect.',
    },
    hints: [
      'What is the worst thing you could do in week one? Probably a report.',
      'Two of the first three things involve talking to people and walking around.',
      'A good answer starts by learning the process and building an inventory, delays the assessment, and treats credibility with the engineers as a deliberate objective.',
    ],
    solution:
      'I would spend the first weeks learning the process rather than assessing it: walking the ' +
      'plant with an engineer, understanding what it produces, and asking operators and engineers ' +
      'what the worst things that could happen here are, because that shapes everything I ' +
      'prioritise later. In parallel I would build an asset inventory passively and on foot, since ' +
      'most sites do not have one and producing it is immediately useful to maintenance and ' +
      'operations rather than only to me. Somewhere in there I would find one small thing that ' +
      'irritates the engineers and fix it, because credibility here is built by contributing ' +
      'rather than by reporting. Only after that would I assess, and I would frame it by physical ' +
      'consequence in the language the site already uses.',
    expectedOutput:
      'An answer that learns the process and builds an inventory before assessing, and treats ' +
      'credibility with plant staff as a deliberate objective.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['walk', 'learn the process', 'understand what', 'ask the engineers', 'worst things'],
          ['inventory', 'asset', 'what is connected', 'passive'],
          ['credibility', 'trust', 'useful', 'contribute', 'relationship', 'before'],
        ],
        hint:
          'Three ideas: learning the process, building the inventory, and doing something that ' +
          'earns you standing before you assess.',
      },
    ],
    debrief:
      'Every experienced OT security person gives some version of this answer, and most of them ' +
      'learned it by producing a report in month one that nobody read.',
    practice: [],
  },
  {
    id: 'ots.8.5',
    moduleId: 'ots.8',
    packageId: 'ot-security-foundations',
    order: 5,
    title: 'Where this career goes',
    kind: 'multiple-choice',
    goal: 'See the shape of the field you are entering.',
    prompt:
      'Which of the following are accurate about OT security as a career? Select all that apply.',
    teach: {
      concept:
        'This final exercise steps back from the day-to-day work to look at the career itself. It is ' +
        'a small field with unusual dynamics compared to mainstream cybersecurity, and knowing them ' +
        'in advance helps you decide honestly whether to enter it.\n\n' +
        'DEMAND EXCEEDS SUPPLY, consistently, because the skill needed combines both process ' +
        'understanding and security understanding, and few people genuinely have both at once. ' +
        'Government regulation is increasing in several industrial sectors, which keeps that demand ' +
        'sustained rather than a temporary spike. The WORK IS SITE-BASED far more than most security ' +
        'roles: expect travel, physical plant visits, and sometimes wearing protective equipment ' +
        'like a hard hat and safety glasses, which genuinely suits some people and not others. It is ' +
        'BUSINESS HOURS built around maintenance windows rather than a round-the-clock shift rota, so ' +
        'it is one of the more predictable security careers to build a life around.\n\n' +
        'And it is DEFENSIBLE against the pressures reshaping other security work, such as growing ' +
        'automation, because the equipment involved has a twenty-year service life and the judgement ' +
        'required is fundamentally physical, which makes it a poor candidate for the kind of ' +
        'software automation that is changing many ordinary IT security roles.\n\n' +
        'The honest caveat is that it is genuinely small as a field: fewer employers, fewer open ' +
        'roles at any given time, and often concentrated geographically around wherever heavy ' +
        'industry actually is, so moving employers or cities can be harder than in mainstream ' +
        'security work.',
    },
    options: [
      { id: 'a', label: 'Demand consistently exceeds supply, because both process and security understanding are needed.' },
      { id: 'b', label: 'The work is more site-based than most security roles, with travel and plant visits.' },
      { id: 'c', label: 'It is usually business hours with maintenance windows rather than a shift rota.' },
      { id: 'd', label: 'The field is small, with fewer employers and often concentrated around industry.' },
      { id: 'e', label: 'It is a common first security role for somebody with no industrial or IT background at all.' },
    ],
    hints: [
      'Four are accurate. One contradicts what this whole package assumes about who is reading it.',
      'What does this track say prior industrial experience is worth?',
      'The honest caveat about the field is one of the four.',
    ],
    solution:
      'A, B, C, and D. Sustained demand, site-based work, predictable hours, and a genuinely small ' +
      'field. E is the one to be honest about: this is an excellent route in for somebody with an ' +
      'industrial background and a reasonable one for somebody with an IT security background, and ' +
      'it is a hard first job for somebody with neither, because the value you bring is a bridge ' +
      'between two things and you need one end of it to start.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option describes this as a common entry point for somebody with neither background.',
      },
    ],
    debrief:
      'If you came to this package from a plant, you have the harder half already. The rest of this ' +
      'catalogue is where you get the other end of the bridge.',
    practice: [],
  },
];

export const OT_SECURITY_FOUNDATIONS: LearningPackage = {
  id: 'ot-security-foundations',
  order: 14,
  title: 'OT and ICS Security Foundations',
  summary:
    'Securing the systems that run a physical process: why the priorities invert, what is actually ' +
    'on a plant floor, the Purdue model and segmentation, industrial protocols that trust by ' +
    'design, living with equipment you cannot patch, the safety systems you never touch, what ' +
    'really happened in the incidents everybody cites, and how the work is done alongside the ' +
    'people who run the plant.',
  outcomes: [
    'Order safety, availability, integrity and confidentiality the way a plant does, and say why',
    'Name the equipment on a plant floor and say what each piece does',
    'Place assets in the Purdue model and identify what is out of position',
    'Explain why industrial protocols trust by default, and what to do about it',
    'Recommend compensating controls for equipment that cannot be patched',
    'Say what a safety instrumented system is and why security must never compromise it',
    'Describe what actually happened in the landmark OT incidents, including where the record changed',
    'Work with engineers and operators without being the security person they route around',
  ],
  /*
   * No prerequisite, for the same reason the risk route has none: this audience
   * arrives from engineering, maintenance and the military rather than from IT,
   * and gating them behind a shell package would turn away exactly the people
   * the field is shortest of. Nothing here needs a terminal.
   */
  prerequisites: [],
  modules: [
    {
      id: 'ots.1',
      packageId: 'ot-security-foundations',
      order: 1,
      title: 'Why OT is not IT',
      summary:
        'The inverted priorities, why patching and agents are refused for good reasons, what a ' +
        'scan can do to a controller, and what an industrial background is worth here.',
      exercises: MODULE_OTS_1,
    },
    {
      id: 'ots.2',
      packageId: 'ot-security-foundations',
      order: 2,
      title: 'What is on the floor',
      summary:
        'PLCs, HMIs, SCADA, historians and safety systems; the engineering workstation as the most ' +
        'sensitive asset on site; and building an inventory of a network you must not scan.',
      exercises: MODULE_OTS_2,
    },
    {
      id: 'ots.3',
      packageId: 'ot-security-foundations',
      order: 3,
      title: 'The Purdue model and segmentation',
      summary:
        'Placing assets in levels, what the industrial DMZ is for, where the model stops describing ' +
        'reality, and how to segment a running plant without stopping it.',
      exercises: MODULE_OTS_3,
    },
    {
      id: 'ots.4',
      packageId: 'ot-security-foundations',
      order: 4,
      title: 'Protocols that trust by design',
      summary:
        'Why industrial protocols have no authentication, what normal traffic looks like, a command ' +
        'that is valid and wrong, and detections that suit a network where normal is narrow.',
      exercises: MODULE_OTS_4,
    },
    {
      id: 'ots.5',
      packageId: 'ot-security-foundations',
      order: 5,
      title: 'Living with what you cannot change',
      summary:
        'Compensating controls, the air gap that is not, handling a patch that genuinely exists, ' +
        'and what recovery means when the thing to restore is a controller.',
      exercises: MODULE_OTS_5,
    },
    {
      id: 'ots.6',
      packageId: 'ot-security-foundations',
      order: 6,
      title: 'The safety system',
      summary:
        'What a safety instrumented system is, what Triton changed, what you may do near certified ' +
        'equipment, and prioritising by physical consequence.',
      exercises: MODULE_OTS_6,
    },
    {
      id: 'ots.7',
      packageId: 'ot-security-foundations',
      order: 7,
      title: 'What actually happened',
      summary:
        'Ukraine 2015, Stuxnet, Colonial and Oldsmar, held to what the record supports, and the ' +
        'route into a plant that all of them share.',
      exercises: MODULE_OTS_7,
    },
    {
      id: 'ots.8',
      packageId: 'ot-security-foundations',
      order: 8,
      title: 'Working in OT',
      summary:
        'Who you work with and how influence replaces authority, change control, incident response ' +
        'when containment is dangerous, your first ninety days, and where the career goes.',
      exercises: MODULE_OTS_8,
    },
  ],
};
