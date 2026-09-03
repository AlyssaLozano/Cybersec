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
    'IT security is usually taught with confidentiality first: keep the data secret, keep it ' +
    'correct, keep it available, in that order. On a plant floor the order inverts almost ' +
    'completely, and everything else in this package follows from that inversion.\n\n' +
    'SAFETY comes first, and it is not one of the three: it sits above them. A control that could ' +
    'contribute to somebody being hurt is not a control, whatever it protects. AVAILABILITY comes ' +
    'next, because the process is producing something and stopping it has a cost measured in ' +
    'thousands per minute, or in a city without water. INTEGRITY comes next, because a sensor ' +
    'reading that is wrong is worse than one that is missing: an operator who knows a gauge is ' +
    'dead will go and look, and one who trusts a false reading will act on it. CONFIDENTIALITY ' +
    'comes last, and often barely matters, because the set point of a pump is not a secret.\n\n' +
    'A security professional who arrives on a plant and applies the IT ordering will recommend ' +
    'things that get them politely ignored, and will deserve it.',
} as const;

const ASSET_TEACH = {
  concept:
    'The equipment has names worth knowing before you talk to anybody who works with it, because ' +
    'using them correctly is most of what earns you a second conversation.\n\n' +
    'A PLC, a programmable logic controller, is a small ruggedised computer that reads sensors and ' +
    'drives actuators on a fixed cycle. It is the thing actually running the process. An HMI, the ' +
    'human machine interface, is the screen an operator watches and touches: it displays the ' +
    'process and sends commands, and it is usually an ordinary Windows box, which makes it the ' +
    'most familiar and most attacked thing on the floor.\n\n' +
    'SCADA is the supervisory layer that gathers from many controllers across a site or a region ' +
    'and presents them together. A HISTORIAN is the database of process values over time, and it ' +
    'is often the one system with a legitimate reason to talk to both the plant network and the ' +
    'business network, which makes it interesting in both directions. And a SAFETY INSTRUMENTED ' +
    'SYSTEM is a separate, independent controller whose only job is to bring the process to a safe ' +
    'state when limits are exceeded. It is deliberately not the same equipment as the control ' +
    'system, and that separation is the whole point of it.',
} as const;

const PURDUE_TEACH = {
  concept:
    'The Purdue model is the reference architecture everybody in this field argues about and ' +
    'everybody uses. It describes a plant as levels: level 0 is the physical process, the sensors ' +
    'and actuators; level 1 is the controllers, the PLCs; level 2 is supervisory control, the HMIs ' +
    'and SCADA for one area; level 3 is site-wide operations, including the historian and ' +
    'engineering workstations; and levels 4 and 5 are the business network and the enterprise, ' +
    'which is ordinary IT.\n\n' +
    'Between level 3 and level 4 sits the industrial DMZ, and it is the most important boundary in ' +
    'the model. Everything the business needs from the plant should be served from there rather ' +
    'than by reaching down into it, so that a compromise of the corporate network has somewhere to ' +
    'stop.\n\n' +
    'Two honest caveats. Real plants are messier than the model: engineering laptops span levels, ' +
    'vendors dial in, and wireless sensors appear at level 0 with their own radio. And cloud ' +
    'connectivity has made the neat hierarchy harder to defend, because a level 1 device with a ' +
    'cellular modem has skipped every boundary you drew. Use the model to describe where things ' +
    'SHOULD sit and to name what is out of place, rather than as a description of what you will ' +
    'find.',
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
        'Patching is the clearest case where an IT reflex meets a plant reality, and the plant is ' +
        'usually right.\n\n' +
        'Four constraints bind. UPTIME: the process runs continuously, and stopping it may take ' +
        'hours to restart safely and cost a fortune, so changes wait for a planned outage that ' +
        'might be twice a year. VENDOR APPROVAL: the control system is often certified as a whole, ' +
        'and applying an operating system patch the vendor has not validated can void support or ' +
        'a safety certification, which is not a paperwork problem but a liability one. AGE: a ' +
        'twenty-year service life is normal, so a lot of equipment runs software that has no ' +
        'patches and no vendor. And TESTING: nobody applies an untested change to a system that ' +
        'moves physical mass, and the test rig may not exist.\n\n' +
        'What follows is not that you give up. It is that the answer is COMPENSATING CONTROLS: ' +
        'segmentation, allowlisting, monitoring, and strict control of what connects. That is the ' +
        'actual job here, and it is more interesting than patching.',
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
        'The tools you would reach for without thinking in IT can stop a physical process, and ' +
        'this is not folklore. Older controllers have small network stacks with very little margin, ' +
        'and behaviour that a server shrugs off can put one into a fault state.\n\n' +
        'ACTIVE SCANNING is the main offender. A port scan, or a vulnerability scanner probing a ' +
        'protocol it does not understand, has knocked PLCs offline in documented cases: the device ' +
        'is not attacked so much as overwhelmed, and a controller that faults may stop the process ' +
        'it was driving. AGENTS are the second: an endpoint agent on an HMI can consume resources ' +
        'the vendor allocated to the control application, and is frequently prohibited by the ' +
        'support contract anyway.\n\n' +
        'The alternative is PASSIVE monitoring: a span or tap port copying traffic to a collector ' +
        'that never transmits. You get an asset inventory and protocol visibility without sending a ' +
        'single packet into the process network, which is why passive tooling dominates this ' +
        'market. Where active checks are genuinely needed, they happen in a maintenance window, ' +
        'with the engineer present, on equipment somebody is watching.',
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
        'You will spend a lot of this career translating, and this is the conversation you will ' +
        'have most often. The colleague is not stupid and is not wrong about their own domain; they ' +
        'are applying reasonable rules to a system with different physics.\n\n' +
        'Three ideas land. The CONSEQUENCE is physical: the failure mode of this system is not lost ' +
        'data, it is a process stopping or moving when it should not, which can hurt somebody. The ' +
        'CONSTRAINTS are real and external: vendor validation, safety certification, and outage ' +
        'windows are not preferences the site could waive if it felt like it. And there IS an ' +
        'answer, which is compensating controls, so the conversation ends somewhere useful rather ' +
        'than in a standoff.\n\n' +
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
        'Most security fields want you to have done security first. This one frequently does not, ' +
        'and the reason is that the scarce skill is understanding the process rather than ' +
        'understanding the attack.\n\n' +
        'What an industrial background gives you is not replaceable by study. You know what the ' +
        'equipment does and what happens when it stops. You can read a P&ID or a wiring diagram. ' +
        'You know how a maintenance window is negotiated and who actually has to sign it. And you ' +
        'have credibility with operators and engineers, who have usually met several security ' +
        'people and were not impressed by any of them.\n\n' +
        'What you have to add is genuinely learnable: how attacks work, how networks are ' +
        'segmented, what a detection is, and the vocabulary to talk to the IT security function ' +
        'without being dismissed. That direction of travel is much faster than the other one, which ' +
        'is why the field hires this way, and it is worth knowing when you are deciding whether you ' +
        'are qualified enough to apply.',
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
        'If you protect one machine on a plant properly, protect this one. The engineering ' +
        'workstation holds the software that writes logic to controllers, and whoever controls it ' +
        'can change what the process does rather than merely watching it.\n\n' +
        'Three things make it uniquely exposed. It is INHERENTLY TRUSTED by the controllers: the ' +
        'protocols involved usually have no authentication, so a controller does what the ' +
        'workstation tells it because it cannot tell who is asking. It is often MOBILE, carried ' +
        'between sites, connected to hotel wifi, and used for email; a laptop that lives on the ' +
        'plant network and also visits the internet is the bridge everybody said did not exist. ' +
        'And it HOLDS THE PROJECT FILES, which are a complete description of the process and are ' +
        'exactly what somebody planning a targeted attack needs.\n\n' +
        'This is not theoretical. Compromise of engineering workstations is a recurring feature of ' +
        'real ICS intrusions, because it is the shortest path from ordinary IT access to changing ' +
        'physical behaviour.',
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
        'Everything in security starts with knowing what you have, and OT makes the usual method ' +
        'unavailable. The alternatives are slower and they work.\n\n' +
        'PASSIVE NETWORK MONITORING from a tap or span port identifies devices by the traffic they ' +
        'already send, and industrial protocols are chatty enough that this builds a surprisingly ' +
        'complete picture including device types and firmware versions. CONFIGURATION FILES from ' +
        'the engineering workstation list the controllers and their addresses, because somebody had ' +
        'to configure them. WALKING THE PLANT with an engineer and reading nameplates is not a ' +
        'joke: it is how you find the equipment that is on no diagram, and OT people do this. And ' +
        'PROCUREMENT AND MAINTENANCE RECORDS tell you what was bought and what has been serviced.\n\n' +
        'The inventory you end up with will be imperfect and it will still be transformative, ' +
        'because most sites genuinely do not have one. Expect to find equipment nobody knew was ' +
        'connected, which is the normal outcome rather than a sign you did it wrong.',
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
        'This finding is common and the right first assumption is almost never an attack. Vendor ' +
        'remote support, a monitoring service the maintenance team bought, a trial somebody set up ' +
        'and forgot: all are far more likely than an intrusion, and all are genuine problems ' +
        'anyway.\n\n' +
        'The order matters. FIND OUT WHAT IT IS before you do anything to it, by asking maintenance ' +
        'and the vendor, because disconnecting a link that a support contract depends on can leave ' +
        'the site unable to get help on a bad day. ESTABLISH WHAT IT REACHES: whether it can only ' +
        'send readings out or can also accept commands in, which is the difference between a data ' +
        'leak and a remote control path with no authentication in front of it. Then DOCUMENT IT ' +
        'AND DECIDE, with the plant, whether it stays, changes, or goes.\n\n' +
        'What makes this an OT problem rather than an IT one is that the modem has bypassed every ' +
        'boundary in the architecture. Whatever segmentation exists between levels, this device ' +
        'is at level 1 with its own path to the internet, so the network diagram is now wrong in a ' +
        'way that matters. A good answer asks who owns it before touching it, and establishes ' +
        'whether the path is inbound as well as outbound.',
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
        'The historian is where the plant and the business genuinely have to meet, which makes it ' +
        'both essential and the most interesting box on the site.\n\n' +
        'It is a legitimate bridge: production reporting, efficiency analysis and regulatory ' +
        'submissions all need process data on the business side. That is why it exists and why ' +
        '"just disconnect it" is not an answer. What matters is the DIRECTION of the connections ' +
        'and who initiates them. The pattern that works is the historian pushing outward into the ' +
        'DMZ, or a replica living in the DMZ that the business reads, so that nothing on the ' +
        'corporate network ever opens a connection into the plant.\n\n' +
        'The pattern that fails is business systems reaching in. It is easier to configure, it is ' +
        'what you will find, and it means a compromise of an ordinary corporate server has a route ' +
        'to a system that sits at level 3 with visibility of everything below it. The historian is ' +
        'also a Windows server with a database on it, which means it has all the ordinary problems ' +
        'as well as the interesting ones.',
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
        'The industrial DMZ exists so that no system on the business network ever needs to open a ' +
        'connection into the plant. Everything the business wants is served from a system in the ' +
        'middle, and the plant pushes to it.\n\n' +
        'Three rules make it work. NO PASS-THROUGH: a protocol that starts on the corporate network ' +
        'and terminates on a plant device defeats the entire arrangement, however many firewalls ' +
        'it crosses on the way. REPLICATION RATHER THAN REACH-THROUGH: put a copy of what the ' +
        'business needs in the DMZ, so a compromise there costs you a copy of some readings rather ' +
        'than a route. And DIRECTION: connections initiated from the plant outward are far safer ' +
        'than the reverse, because an attacker on the corporate side then has nothing to connect ' +
        'to.\n\n' +
        'Remote access is the hard case and the one that gets negotiated badly. Vendors genuinely ' +
        'need to support equipment, and the answer is a brokered, monitored, time-limited session ' +
        'through the DMZ, rather than a permanent VPN into level 2 or, as you will actually find, a ' +
        'modem nobody documented.',
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
        'The model is a reference, not a survey. Knowing where it stops describing reality is what ' +
        'separates somebody who has read about OT from somebody who has walked a plant.\n\n' +
        'Four things break it routinely. DEVICES WITH THEIR OWN CONNECTIVITY: a controller or ' +
        'sensor with a cellular modem or its own cloud client has skipped every level at once. ' +
        'MOBILE ASSETS: the engineering laptop and the contractor machine belong to no level and ' +
        'visit several. WIRELESS: a mesh of battery sensors at level 0 has a radio boundary that ' +
        'appears on no wired diagram. And CONVERGED VENDOR PLATFORMS: modern systems that bundle ' +
        'supervision, history and analytics into one product that legitimately spans levels 2 and ' +
        '3 and talks to a vendor cloud.\n\n' +
        'None of this means abandon the model. It means use it to state where things SHOULD sit, ' +
        'and treat each departure as a specific finding with a named owner, rather than pretending ' +
        'the site is either compliant or hopeless.',
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
        'Segmenting a live plant is the highest-risk security work you can do there, because ' +
        'getting it wrong stops the process. It is done in a sequence, and the sequence is the ' +
        'skill.\n\n' +
        'First OBSERVE: passively record what actually talks to what, for long enough to include ' +
        'the monthly report, the quarterly batch and the annual shutdown. A rule set built from a ' +
        'week of traffic will block something important in month three. Then MONITOR IN ALERT MODE: ' +
        'deploy the rules so violations are logged rather than dropped, and watch what would have ' +
        'broken. Then ENFORCE INCREMENTALLY, one boundary at a time, in a maintenance window, with ' +
        'the engineer present and a tested way to put it back.\n\n' +
        'What fails is enforcing from day one on a rule set derived from a diagram. The diagram is ' +
        'wrong, you will discover which parts of it are wrong by stopping production, and you will ' +
        'not be asked to do the next phase.',
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
        'This is the most common serious finding in OT, and it is easy to write in a way that gets ' +
        'nothing done. "The network is flat" is a description; what a plant acts on is a specific ' +
        'consequence and a route to fixing it that does not require stopping production.\n\n' +
        'State the CURRENT PATH concretely: which network can reach which devices, on what. State ' +
        'the CONSEQUENCE in plant terms rather than IT ones: an ordinary corporate compromise, ' +
        'which happens through email and happens to everybody, would reach the equipment that runs ' +
        'the process, and the failure mode there is production loss or a safety event rather than ' +
        'data loss. Then give a STAGED REMEDY, because a full re-architecture will be refused and ' +
        'should be: observation, then alert-mode rules, then one boundary at a time.\n\n' +
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
        'The industrial protocols in widest use were designed for serial links between trusted ' +
        'devices in a locked room, decades before anybody connected them to anything. Modbus dates ' +
        'from the 1970s. They were then carried over Ethernet and IP essentially unchanged.\n\n' +
        'What that means in practice is stark. There is generally NO AUTHENTICATION: a device does ' +
        'what it is told because it has no way to ask who is telling it. There is NO ENCRYPTION, so ' +
        'anybody who can see the traffic can read it, and more importantly can craft it. And there ' +
        'is often NO INTEGRITY protection beyond a checksum meant for line noise rather than for an ' +
        'adversary.\n\n' +
        'So a valid command from an unauthorised source is indistinguishable from a legitimate one. ' +
        'Not because of a vulnerability to be patched: because the protocol has no concept of an ' +
        'unauthorised source. Secure variants exist, DNP3 has a secure authentication extension and ' +
        'newer standards do better, and adoption across installed equipment is slow because the ' +
        'equipment is old. The security therefore has to come from the network around the protocol, ' +
        'which is why segmentation matters here far more than it does in IT.',
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
        'This is the one place where OT security is genuinely easier than IT, and it is worth ' +
        'knowing because so much of the rest is harder.\n\n' +
        'Plant traffic is REGULAR in a way office traffic never is. A controller polls the same ' +
        'devices at the same interval, forever. The set of devices that talk to each other is ' +
        'fixed by the process design and changes only when somebody changes the plant. Volumes are ' +
        'stable and predictable rather than following human working patterns.\n\n' +
        'That regularity makes anomaly detection realistic here. A new device appearing, a new pair ' +
        'of devices talking, a familiar device suddenly using a function it has never used, or a ' +
        'change in polling rhythm are all genuinely unusual rather than being Tuesday. The false ' +
        'positive problem that makes behavioural detection so painful in IT is much smaller.\n\n' +
        'The caveat is that periodic events are real: shift changes, batch starts, monthly ' +
        'reporting, an annual shutdown. A baseline of one week will flag the quarterly batch as an ' +
        'intrusion, which is how a monitoring deployment loses the plant confidence in its first ' +
        'month.',
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
        'Nothing here is malformed. The protocol has no view about whether this command should have ' +
        'happened, so the judgement is entirely yours and it is made from context the protocol ' +
        'does not carry.\n\n' +
        'Three kinds of context decide it. TIME AND PATTERN: set point changes usually happen ' +
        'during shifts, by people, and 02:00 is unusual unless the site runs nights. AUTHORISATION: ' +
        'process changes go through a change record on a well-run plant, so the fast question is ' +
        'whether one exists for tonight. And MAGNITUDE AND DIRECTION: a small adjustment within the ' +
        'normal operating band is a different event from one that moves a value outside it, and ' +
        'the engineers can tell you instantly which this is.\n\n' +
        'What you must not do is decide alone. You do not know what the set point does, and the ' +
        'person who does is on site. This is the exercise where an IT instinct, to contain first ' +
        'and ask later, is actively dangerous: reverting a process change without understanding it ' +
        'can be worse than the change.',
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
        'Because normal is so narrow, the best OT detections are ones that would be hopelessly ' +
        'noisy in IT and are perfectly workable here.\n\n' +
        'A NEW DEVICE on the network is worth alerting on outright, because the device list is ' +
        'fixed by the process. A NEW COMMUNICATION PAIR is similar: these two things have never ' +
        'talked before, and the process design says they should not. An UNUSUAL FUNCTION CODE, ' +
        'meaning a controller receiving a type of command it has never received, is a strong signal ' +
        'and includes the ones that matter most, such as a programming command outside a ' +
        'maintenance window. And a CHANGE TO CONTROLLER LOGIC at any time is worth knowing about ' +
        'unconditionally, because it should be rare and always deliberate.\n\n' +
        'What suits this environment badly is anything that depends on volume thresholds tuned for ' +
        'human behaviour, or on content inspection of encrypted traffic that is not encrypted ' +
        'anyway. Write for the narrowness; it is the advantage you have.',
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
        'The manager question is fair and the honest answer is not about attacks at all. It is ' +
        'about what the equipment can and cannot check.\n\n' +
        'The point to convey is that the controllers cannot tell an authorised instruction from an ' +
        'unauthorised one, because the protocols they speak have no way to ask. That is not a fault ' +
        'in the equipment, it is what those protocols were designed for, and it means the ' +
        'protection has to come from controlling who can reach the equipment at all.\n\n' +
        'Then the consequence in their terms: anything that can reach a controller can instruct ' +
        'it, so the security of the process is exactly the security of the network path to it. And ' +
        'the reassurance, which is real: this is why the answer is segmentation and access control ' +
        'rather than changing the equipment, which is not being proposed.\n\n' +
        'A good answer says the controller cannot verify who is instructing it, connects that to ' +
        'network reachability being the real control, and avoids demanding equipment changes.',
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
        'Compensating controls are the core competence of this field. The vulnerability is not ' +
        'going away, so you make it unreachable, undetectable to act on, or survivable.\n\n' +
        'RESTRICT REACHABILITY: if only three named systems can send that device traffic, a flaw ' +
        'requiring network access is only exploitable from three places, and those three can be ' +
        'watched closely. ALLOWLIST THE FUNCTIONS: many industrial firewalls can permit read ' +
        'operations and deny programming commands to a given device, which removes the worst ' +
        'outcomes without touching the equipment. MONITOR SPECIFICALLY: write a detection for what ' +
        'exploitation would look like on this device, so that if it happens you know within ' +
        'minutes.\n\n' +
        'And PLAN THE REPLACEMENT, with a date, because compensating controls are a bridge and a ' +
        'bridge with no far end is just an excuse. The one thing that does not count is documenting ' +
        'the risk and accepting it with no control at all, which is a decision rather than a ' +
        'control, and should be recorded as one.',
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
        'Genuine air gaps are rare and the claim is common, which is a gap worth closing early ' +
        'because everything else the site believes rests on it.\n\n' +
        'Air gaps leak through the things that have to cross. REMOVABLE MEDIA: firmware, project ' +
        'files, vendor updates and data extracts move on USB, and that is the documented route for ' +
        'more than one significant ICS incident. VENDOR LAPTOPS connect to the isolated network by ' +
        'design, having been elsewhere last week. TEMPORARY LINKS get created for a project and are ' +
        'not removed. And the modem or cellular link somebody added for remote monitoring means ' +
        'the gap has not existed for years.\n\n' +
        'The useful reframing is that isolation is a control that has to be MAINTAINED and verified ' +
        'rather than a property a network has. Ask how somebody would know if it were breached, and ' +
        'if the answer is that nobody would, the isolation is a belief rather than a control.',
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
        'Not every OT patch conversation is a refusal, and treating them all as one is how you miss ' +
        'the ones that could have happened. When the vendor has validated a fix, the constraint is ' +
        'usually scheduling rather than possibility, and that is negotiable in a way certification ' +
        'is not.\n\n' +
        'What helps is being specific about urgency. Is the flaw remotely reachable from anywhere ' +
        'that matters given your segmentation, is it known to be exploited, and what would ' +
        'exploitation do to the process? A flaw that is only reachable from a network segment three ' +
        'named engineers can touch is a genuinely different proposition from one reachable from the ' +
        'business network, and saying so buys you credibility for the times you do need a window ' +
        'moved.\n\n' +
        'It is also worth asking whether the window can be brought forward, because sometimes it ' +
        'can and nobody asked, and whether a partial measure exists in the meantime. What does not ' +
        'work is escalating every validated patch as urgent, which spends the credibility you need ' +
        'for the one that actually is.',
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
        'Recovery here is not restoring a server, and the things that matter are frequently not ' +
        'backed up at all because nobody thought of them as data.\n\n' +
        'CONTROLLER LOGIC is the critical one: the program running on each PLC, in a form that can ' +
        'be loaded back, held offline. Sites lose this and discover during an incident that the ' +
        'only copy was on the engineering laptop that also got encrypted. HMI AND SCADA ' +
        'CONFIGURATION, including the graphics and the tag database, because rebuilding those by ' +
        'hand takes weeks. DEVICE CONFIGURATION AND FIRMWARE VERSIONS, so a replacement unit can be ' +
        'brought to the same state.\n\n' +
        'And the two nobody lists: SPARE HARDWARE, because a twenty-year-old controller cannot be ' +
        'ordered on Tuesday, and a TESTED PROCEDURE for running the process in a degraded or manual ' +
        'mode. That last one is what the Ukrainian utilities used in 2015 to restore power with ' +
        'operators physically closing breakers, and it is the difference between an outage and a ' +
        'crisis.',
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
        'This is the characteristic OT proposal and it is judged on whether it can be implemented ' +
        'without touching the device or the process.\n\n' +
        'Lead with REACHABILITY, because it is the highest-value change and it happens entirely in ' +
        'the network: name the small set of systems that legitimately need to talk to it and deny ' +
        'everything else. Add FUNCTION RESTRICTION where the equipment in the path supports it, so ' +
        'programming commands are denied while normal operation continues. Add TARGETED MONITORING, ' +
        'so that if anything does reach it you find out quickly rather than during the next ' +
        'outage.\n\n' +
        'Then be explicit about the RESIDUAL and the END DATE. Something remains, the engineers who ' +
        'legitimately reach the device could still be a route, and the controls are a bridge to the ' +
        'replacement rather than a substitute for it. A proposal with no end date will be treated ' +
        'as a permanent answer, and in five years somebody will find the device still there with ' +
        'the same firmware and a folder of your rules around it.\n\n' +
        'A good answer restricts who can reach it, adds monitoring, and states both the residual ' +
        'risk and a replacement horizon, without asking for the device to be touched.',
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
        'A safety instrumented system is a separate controller with one job: watch for conditions ' +
        'that mean the process is heading somewhere dangerous, and put it into a safe state. It ' +
        'closes a valve, trips a burner, or shuts a unit down.\n\n' +
        'Three properties define it. It is INDEPENDENT of the control system, deliberately, often ' +
        'from a different product line and sometimes a different vendor, so that a failure or ' +
        'compromise of the control system does not take the protection with it. It is CERTIFIED to ' +
        'a functional safety standard, with its logic reviewed and its failure rates calculated, ' +
        'which is why nobody changes it casually. And it is the LAST LAYER: when it acts, the ' +
        'earlier protections have already failed.\n\n' +
        'For a security person the consequence is simple and absolute. You do not put anything on ' +
        'it, you do not scan it, and you do not propose changes to it without the functional safety ' +
        'engineer leading that conversation. Its independence is the control, and anything you do ' +
        'that couples it to something else has removed the protection you were hired to strengthen.',
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
        'Triton is the incident that changed how this field thinks, because it crossed a line ' +
        'people had assumed nobody would cross.\n\n' +
        'What was reported: malware reached the engineering workstation for the safety system and ' +
        'attempted to reprogram Triconex safety controllers at a petrochemical facility. It was ' +
        'discovered because it went wrong: the controllers detected a fault and tripped the process ' +
        'into a safe shutdown, which is exactly what they are built to do. The unplanned shutdown ' +
        'is what prompted the investigation that found the malware.\n\n' +
        'Why it matters is the intent. Attacking a control system can stop a process or damage ' +
        'equipment. Attacking the SAFETY system removes the protection that stops a dangerous ' +
        'condition becoming a catastrophic one, and the only reason to do that is to enable ' +
        'physical harm. It moved the field from arguing about production loss to arguing about ' +
        'consequences to people, and it is why the independence rule in this module is stated as ' +
        'absolutely as it is.',
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
        'You can improve the security of a safety system considerably without ever touching it, ' +
        'and that is the whole approach.\n\n' +
        'What is appropriate: controlling PHYSICAL ACCESS to the equipment and to its programming ' +
        'key switch, which on many safety controllers is the primary protection against ' +
        'reprogramming and is often left in the wrong position. Controlling access to its ' +
        'ENGINEERING WORKSTATION, which is how Triton arrived. Monitoring PASSIVELY for any ' +
        'communication with the safety controllers, since in normal operation there should be very ' +
        'little and a programming session should be a planned event somebody can point to. And ' +
        'ensuring changes go through the FUNCTIONAL SAFETY process, which already exists and is ' +
        'more rigorous than anything security would impose.\n\n' +
        'What is not appropriate: scanning it, installing anything on it, or proposing changes to ' +
        'its configuration through a security change process. The functional safety engineer leads ' +
        'anything that touches it, and your role is to make the case and then be useful.',
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
        'This request is reasonable from where it is being made and wrong from where you are ' +
        'standing, and the way you decline decides whether you get a hearing next time.\n\n' +
        'Do not lead with a rule. Lead with the CONSEQUENCE: this machine programs certified safety ' +
        'equipment, and anything that changes its behaviour, its timing, or its supported ' +
        'configuration puts that certification and the vendor support in question. Then the ' +
        'AUTHORITY: the functional safety process governs changes here, and it is more rigorous ' +
        'than the security change process rather than less, so this is not an argument about ' +
        'whether rules apply.\n\n' +
        'Then, and this is the part that matters, OFFER THE ALTERNATIVE. The security objective is ' +
        'visibility and control of a sensitive machine, and that is achievable: restrict what it ' +
        'connects to, control physical and logon access, log its use, and monitor the network ' +
        'around it. Declining without an alternative reads as obstruction; declining with one reads ' +
        'as expertise.\n\n' +
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
        'The most useful idea in OT security is to start from the worst physical outcomes and work ' +
        'backwards, rather than starting from a list of vulnerabilities and working forwards. ' +
        'Approaches with names like consequence-driven engineering formalise this, and the core of ' +
        'it is simple enough to apply without any of them.\n\n' +
        'Ask the engineers what the worst things that could happen on this site are. They will tell ' +
        'you immediately, because they have thought about it for years: a runaway reaction, a ' +
        'release, a specific vessel over pressure. Then work backwards to what would have to occur ' +
        'for each, then to which systems could contribute, and put your effort there.\n\n' +
        'What this displaces is prioritising by vulnerability severity, which in OT correlates ' +
        'poorly with consequence. A critical-rated flaw on a machine that displays a graph matters ' +
        'less than a medium-rated one on a controller that can open a valve, and no scanner knows ' +
        'the difference. It also gives you something a plant will engage with, because you are ' +
        'starting from their language rather than yours.',
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
        'This is the case worth knowing in most detail, because almost nothing about it was exotic ' +
        'and the whole shape is reusable.\n\n' +
        'As reported: attackers gained access to the business networks of Ukrainian electricity ' +
        'distribution companies months in advance, using phishing with malicious documents that ' +
        'delivered BlackEnergy. They moved from the business network into the control environment, ' +
        'harvested credentials, and learned the systems. On the day, they used the operators own ' +
        'remote access and HMI software to open breakers, cutting power to roughly a quarter of a ' +
        'million customers.\n\n' +
        'They also did three things to slow recovery: wiped systems with KillDisk, overwrote ' +
        'firmware on serial-to-Ethernet converters so devices could not be commanded remotely, and ' +
        'ran a telephone denial of service against the call centres so customers could not report ' +
        'outages.\n\n' +
        'The recovery is the part every OT person cites: operators restored power by driving to ' +
        'substations and closing breakers by hand. The manual fallback existed, people were trained ' +
        'on it, and it worked.',
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
        'Stuxnet is the origin story of this field, and the details that matter are not the ' +
        'espionage ones.\n\n' +
        'As reported: it spread through removable media and networks, used several previously ' +
        'unknown Windows vulnerabilities, and specifically sought Siemens Step7 engineering ' +
        'software and particular PLC configurations. Where it found them, it altered the logic ' +
        'controlling centrifuge frequency converters, varying speeds in a way that damaged the ' +
        'centrifuges over time.\n\n' +
        'The part every OT person remembers is what it did to the operators: while manipulating the ' +
        'process it replayed previously recorded normal values back to the monitoring systems, so ' +
        'the displays showed a healthy plant. The integrity of what the operator sees is not a ' +
        'secondary concern, it is the thing that decides whether a human can intervene.\n\n' +
        'It also crossed into an environment that was not internet-connected, which is why the ' +
        'removable media lesson in module five is stated as firmly as it is.',
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
        'This case is misremembered constantly, and getting it right changes what you recommend.\n\n' +
        'As reported: the ransomware affected business and IT systems, not the operational ' +
        'technology that moves fuel. The company shut the pipeline down as a precaution, and ' +
        'reporting indicated a significant factor was the inability to use the business systems ' +
        'that handle billing and measurement, so the company could not reliably account for what it ' +
        'was delivering.\n\n' +
        'That is the lesson. The OT was not compromised and the process stopped anyway, because the ' +
        'business depends on IT systems to operate commercially, and because with the boundary ' +
        'uncertain the safe decision was to separate the two. A site that cannot say with ' +
        'confidence whether an IT compromise reached the plant will shut the plant down, which ' +
        'means the value of good segmentation is not only preventing spread: it is being able to ' +
        'prove during an incident that spread did not happen.\n\n' +
        'The other detail worth carrying is the initial access, reported as a VPN account that was ' +
        'no longer in use and had no multi-factor authentication.',
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
        'This case is in the module because of what happened to the story, which is more useful ' +
        'than the story.\n\n' +
        'The initial reporting in February 2021 described an intruder remotely accessing an HMI and ' +
        'raising the sodium hydroxide setting dramatically, with an operator noticing and reversing ' +
        'it. It was cited everywhere as proof of the threat to water utilities, including in ' +
        'government messaging and in a great many conference talks.\n\n' +
        'Subsequent reporting cast substantial doubt on that account. In 2023 it was reported that ' +
        'investigators had found no evidence of an intrusion, and that the incident was likely ' +
        'attributable to operator error, with the town having concluded much the same. The remote ' +
        'access software genuinely was in use and shared, which is a real weakness; the intrusion ' +
        'itself is not supported.\n\n' +
        'The lesson is about this field rather than about water. OT incidents are reported early, ' +
        'from partial information, into an audience that wants the story to be true, and ' +
        'corrections travel far less well than the original. If you cite an incident in a report, ' +
        'check whether the account still stands.',
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
        'Collecting incidents is not the point; finding the shared shape is, because that is what ' +
        'you can defend against.\n\n' +
        'Three things recur. The ROUTE IN was ordinary: phishing and business network compromise in ' +
        'Ukraine, removable media for Stuxnet, an unused VPN account at Colonial. None of them ' +
        'started with an exotic attack on industrial equipment, and that is why the IT boundary and ' +
        'account hygiene matter so much here.\n\n' +
        'The ENGINEERING PATH was central: the engineering workstation for Triton, Step7 software ' +
        'for Stuxnet, the operators own HMI and remote access in Ukraine. Attackers use the ' +
        'legitimate means of changing the process, because that is what exists and it does not need ' +
        'an exploit.\n\n' +
        'And PREPARATION took months. These were not opportunistic. That is discouraging and it is ' +
        'also the opportunity: a long dwell time is a long period during which ordinary detection ' +
        'on ordinary IT systems could have found something.\n\n' +
        'A good answer names the ordinary route in, the use of legitimate engineering access, and ' +
        'the long preparation as a detection opportunity.',
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
        'This role has less authority and more influence than its IT equivalent, and people who ' +
        'expect the reverse struggle.\n\n' +
        'The CONTROLS ENGINEERS own the systems and will implement most of what actually changes. ' +
        'They have usually been there far longer than you and have seen security initiatives ' +
        'arrive and leave. The OPERATORS run the process and notice things no monitoring will: an ' +
        'operator saying a valve is behaving oddly is a security signal worth more than most ' +
        'alerts. The PLANT MANAGER carries accountability for output and safety and makes the ' +
        'decisions you recommend into. And the IT SECURITY TEAM has the tooling, the budget and ' +
        'usually the wrong instincts for this environment, so part of your job is translating in ' +
        'both directions.\n\n' +
        'What does not work is arriving with authority. You will be right about something ' +
        'important in your first month and be ignored, and the way through that is not escalation, ' +
        'it is having been useful about three smaller things first.',
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
        'Plant change control is usually more rigorous than IT change control, not less, and ' +
        'security people arriving from IT frequently assume the opposite because it is slower.\n\n' +
        'Even a passive sensor is a change. It needs a description of what is being added and ' +
        'where, an assessment of what could go wrong including the physical consequence, a review ' +
        'by people who understand the process, a window, and a rollback. The tap or span port ' +
        'itself is a change to network equipment, and on some plants that switch is part of a ' +
        'validated system.\n\n' +
        'What makes this workable rather than infuriating is preparation. Bring the answers before ' +
        'you are asked: exactly what the device does and does not transmit, what happens if it ' +
        'fails, what it is connected to, how it is powered, and who supports it. An engineer whose ' +
        'questions you have already answered will help you get it approved. One who has to drag ' +
        'each answer out of you will conclude you have not thought it through, and they will be ' +
        'right.',
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
        'Everything you learned about containment has to be renegotiated here, because the ' +
        'containment action can be more dangerous than the intrusion.\n\n' +
        'The decision to isolate, shut down or continue running is a PLANT decision, made with the ' +
        'plant manager and the engineers, weighing safety and process state. Disconnecting a ' +
        'controller mid-batch can leave the process in a condition nobody has a procedure for. ' +
        'There is often a SAFE STATE to reach first, and reaching it takes time.\n\n' +
        'Evidence collection is constrained too: you may not be able to take a controller offline ' +
        'to image it, and volatile evidence on an HMI competes with the need to keep the operator ' +
        'able to see the process. And the response team includes people an IT incident would never ' +
        'involve: operations, safety, and often a regulator, because in several sectors an ' +
        'incident affecting a safety or environmental system is reportable.\n\n' +
        'What holds constant is the value of knowing in advance. The time to agree who can order a ' +
        'shutdown is not during one.',
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
        'The instinct is to assess and report. On a plant that produces a document nobody asked ' +
        'for, from somebody nobody knows, about equipment you have not seen, and it lands badly.\n\n' +
        'What works is a different order. LEARN THE PROCESS first: walk the plant with an engineer, ' +
        'understand what it makes and what the worst outcomes would be, and let the people who run ' +
        'it explain it to you. BUILD THE INVENTORY next, passively and by walking, because ' +
        'everything later depends on it and most sites do not have one, so producing it is ' +
        'immediately useful to people other than you.\n\n' +
        'Then FIND SOMETHING SMALL AND FIX IT, ideally something that annoys the engineers, ' +
        'because credibility is built by contribution rather than by findings. Only then ASSESS, ' +
        'and when you do, frame it by consequence in the language you learned in week one.\n\n' +
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
        'It is a small field with unusual dynamics, and knowing them helps you decide whether to ' +
        'enter it.\n\n' +
        'DEMAND EXCEEDS SUPPLY, consistently, because the skill needs both process understanding ' +
        'and security understanding and few people have both. Regulation is increasing in several ' +
        'sectors, which sustains it. The WORK IS SITE-BASED more than most security roles: expect ' +
        'travel, plant visits, and sometimes protective equipment, which suits some people and not ' +
        'others. It is BUSINESS HOURS with maintenance windows rather than a rota, so it is one of ' +
        'the more predictable security careers.\n\n' +
        'And it is DEFENSIBLE against the pressures that reshape other security work, because the ' +
        'equipment has a twenty-year life and the judgement is physical, which makes it a poor ' +
        'candidate for the kind of automation that is changing IT security roles.\n\n' +
        'The honest caveat is that it is small: fewer employers, fewer roles, and often ' +
        'concentrated geographically around industry, so mobility can be lower than in mainstream ' +
        'security.',
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
