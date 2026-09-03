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

import type { Exercise, LearningPackage } from '@soc/shared';

const INTEL_TEACH = {
  concept:
    'Picture a detective called to a break-in. From the scene alone, the detective can tell you how ' +
    'the lock was forced, which room was searched first, and what got taken. That is the incident: a ' +
    'precise account of what happened, this one time, in this one place. What the scene cannot tell ' +
    'the detective is whether this matches a known burglar who always checks the bedroom first, or ' +
    'whether burglars of this kind tend to come back for a second visit once they know the house. ' +
    'That second kind of knowledge, built from many break-ins rather than just this one, is what a ' +
    'detective bureau exists to supply. Threat intelligence is the same idea applied to a cyberattack: ' +
    'the accumulated knowledge of how attackers, as a population, tend to operate, built from many ' +
    'incidents rather than the one currently in front of you.\n\n' +
    'Threat intelligence answers two questions the incident itself cannot: has anyone seen this ' +
    'before, and what is this actor likely to do next. An incident on its own hands a responder a ' +
    'pile of raw evidence, an odd process, a strange outbound connection, a file that should not be ' +
    'there, and that evidence alone says only what happened, not what it means or where it is headed. ' +
    'Intelligence turns that evidence into context: mapping what happened to techniques attackers use ' +
    'elsewhere, and matching how this operation was actually carried out, its tradecraft, against ' +
    'prior campaigns that used a similar approach.\n\n' +
    'This matters because a responder working from raw evidence alone is guessing at the shape of an ' +
    'entire attack from a single fragment of it, the way you might try to guess a whole animal from ' +
    'one footprint. A responder working with intelligence is instead comparing that footprint against ' +
    'a catalogue of animals that have left similar prints before, and can make an informed guess about ' +
    'what the rest of the animal looks like, and where it tends to go next. That is why the job exists ' +
    'as its own seat rather than folding into incident response: someone has to hold that catalogue ' +
    'and keep matching new fragments against it, while the responder is busy with the fragment ' +
    'directly in front of them.',
} as const;

const RESTRAINT_TEACH = {
  concept:
    'Attribution is the act of naming who is behind an attack: a specific group, a specific country, ' +
    'a specific person. It sounds like the most satisfying part of the job, since everyone wants to ' +
    'know who did it. It is also the easiest thing in intelligence to get wrong while sounding ' +
    'completely certain, which is why the hardest discipline in the field is learning to resist saying ' +
    'more than you actually know.\n\n' +
    'Think of a witness to a crime who says, with total certainty, it was the man in the red jacket, ' +
    'based on a glimpse from across the street. The witness might be right. But a courtroom does not ' +
    'accept that kind of certainty on its own, because a confident eyewitness has sent innocent people ' +
    'to prison before, and sounding sure is not the same thing as being right. Attribution in ' +
    'cybersecurity has exactly the same trap: malware that resembles a known group tooling, or a ' +
    'technique that overlaps with a previous campaign, feels like recognising the man in the red ' +
    'jacket, but a resemblance is not proof, and attackers know this well enough to sometimes borrow ' +
    'each other tools specifically to cause this kind of false recognition.\n\n' +
    'Restraint matters this much because a confident wrong attribution does real damage well past the ' +
    'original incident: it can misdirect an entire response toward the wrong adversary, publicly name ' +
    'an organisation or a country that had nothing to do with it, or shape a decision made by someone ' +
    'far above the analyst, a diplomatic response, a public statement, a lawsuit, built on a guess that ' +
    'was delivered as if it were a fact.\n\n' +
    'The professional habit that avoids this is to say exactly what the evidence supports and no more, ' +
    'to state how confident you are out loud rather than letting the reader assume more certainty than ' +
    'you actually have, and to stop attributing at the exact point where the evidence stops, even when ' +
    'a name is the one thing everyone in the room is waiting to hear.',
} as const;

const INDICATOR_TEACH = {
  concept:
    'An indicator of compromise is any specific, concrete fact that signals an attack happened: the ' +
    'exact IP address a connection came from, the exact hash, a kind of digital fingerprint, of a ' +
    'malicious file, the exact domain name used in a phishing email. These are the easiest things to ' +
    'write down and share, and for a long time they were the main currency of threat intelligence: a ' +
    'list of known bad addresses and hashes to block.\n\n' +
    'Not all indicators are equally durable, though, and the reason is simple: it costs an attacker ' +
    'almost nothing to change the cheap ones. Renting a new server produces a new IP address in ' +
    'minutes. Recompiling the same malware with one line changed produces an entirely new hash, ' +
    'because a hash is calculated from the exact bytes of a file, and changing even a single byte ' +
    'changes it completely. The moment an attacker does either of those things, a defender list of ' +
    'known bad addresses and hashes is stale: correct about the past, and useless for what comes next.\n\n' +
    'A technique, tactic, or procedure, usually shortened to TTP, describes how an actor actually ' +
    'operates rather than which specific tool or address they happened to use this time: how they get ' +
    'their first foothold, how they move around once inside, how they hide what they are doing. This ' +
    'is expensive for an attacker to change, because it is tied to their training, their habits, and ' +
    'the tooling they have already built and are comfortable running, not to a single disposable ' +
    'server or file. Changing an address takes minutes. Changing how an entire team operates takes ' +
    'months, if it happens at all.\n\n' +
    'This is why intelligence built on behaviour lasts, and intelligence built only on indicators ' +
    'expires the moment the attacker, in effect, moves house: a landlord who only records a tenant old ' +
    'address learns nothing useful once that tenant relocates, but a landlord who has learned that ' +
    'tenant habits, always pays late, always leaves a light on, can still recognise them at the new ' +
    'address.',
} as const;

const CYCLE_TEACH = {
  concept:
    'Intelligence work is not something you do in one step, the same way a research paper does not go ' +
    'straight from a search engine to a finished conclusion. It runs on a cycle, a repeating series of ' +
    'named steps, and the reason to learn those names is that most failures in the field trace back to ' +
    'one particular step being skipped or rushed, not to an analyst simply thinking something through ' +
    'wrong.\n\n' +
    'Think of how a newsroom works. A reporter is not just told to go find something interesting: an ' +
    'editor identifies a question worth answering, the reporter gathers material, the material gets ' +
    'sifted and organised, the reporter forms a judgement about what it actually means, that judgement ' +
    'gets published, and afterward the newsroom learns whether the story landed, whether it arrived in ' +
    'time, and whether readers actually cared, and that last piece shapes what the newsroom decides to ' +
    'cover next. Intelligence work follows the same shape, and naming the steps matters because most ' +
    'failures happen in the cycle itself, not in any single analytic judgement.\n\n' +
    'REQUIREMENTS is where a decision maker states a question, or where the team infers one: what ' +
    'does security leadership need to decide, and by when. COLLECTION gathers raw material against ' +
    'that question, from open reporting, sensors, a paid feed, or a partner. PROCESSING turns raw ' +
    'material into something usable: extracting indicators from a report, translating a document, ' +
    'deduplicating what several sources already said. ANALYSIS is the step that earns the name ' +
    'intelligence: weighing the processed material, forming a judgement, and stating how confident ' +
    'that judgement is. DISSEMINATION delivers the finished judgement to the person who asked, in a ' +
    'form they can use before the moment has passed. FEEDBACK closes the loop: did this answer the ' +
    'question, was it in time, and what should the next requirement be.\n\n' +
    'It is drawn as a circle rather than a line because feedback is not decorative. A cycle without ' +
    'it repeats the same collection plan forever, whether or not it was ever the right one, the same ' +
    'way a newsroom that never checks whether anyone read yesterday story has no way of learning what ' +
    'to cover tomorrow.',
} as const;

const MODULE_TI_2: Exercise[] = [
  {
    id: 'ti.2.1',
    moduleId: 'ti.2',
    packageId: 'threat-intel-foundations',
    order: 1,
    title: 'Name the six steps',
    kind: 'multiple-choice',
    goal: 'Fix what each stage of the intelligence cycle actually does.',
    prompt: 'Which of the following correctly describe a step in the intelligence cycle? Select all that apply.',
    teach: CYCLE_TEACH,
    options: [
      { id: 'a', label: 'Requirements is where a decision maker states, or the team infers, the question the rest of the cycle works to answer.' },
      { id: 'b', label: 'Collection gathers raw material against that question, from sources such as open reporting, sensors, or a paid feed.' },
      { id: 'c', label: 'Processing turns raw material into a usable form, such as extracting indicators from a report or translating a document.' },
      { id: 'd', label: 'Analysis is judged only by whether the writing reads well, since its accuracy cannot be checked until events unfold.' },
      { id: 'e', label: 'Feedback closes the cycle by testing whether the finished product answered the original question, and shapes what is asked next.' },
    ],
    hints: [
      'One option confuses good writing with a sound analytic judgement.',
      'Four of these describe an actual step in the cycle correctly. One describes how analysis should be judged, and gets it wrong.',
      'Analysis is judged by whether the reasoning and sourcing hold up, not by how well the sentences read.',
    ],
    solution:
      'The correct answers are A, B, C, and E. Requirements sets the question, collection gathers ' +
      'material, processing makes it usable, and feedback tests whether the product actually answered ' +
      'the question and reshapes what comes next. D is wrong: analysis is judged by whether the ' +
      'sourcing and reasoning hold up, not by how well it reads, and plenty of well written analysis ' +
      'has turned out to be wrong.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option judges analysis by its prose rather than by its sourcing and reasoning?',
      },
    ],
    debrief:
      'Treat the cycle as a checklist when something goes wrong: if a product landed badly, ask ' +
      'which of these five steps was actually skipped, rather than assuming the analyst just got it ' +
      'wrong. New analysts tend to blame the writing. Experienced ones check the cycle first, because ' +
      'that is where the failure usually lives.',
    practice: [],
  },
  {
    id: 'ti.2.2',
    moduleId: 'ti.2',
    packageId: 'threat-intel-foundations',
    order: 2,
    title: 'What breaks when requirements are skipped',
    kind: 'multiple-choice',
    goal: 'See what happens when a team collects before it asks a question.',
    prompt:
      'A team begins collecting threat data with no stated requirement, because collecting feels ' +
      'like progress. Which of the following are genuine consequences? Select all that apply.',
    teach: {
      concept:
        'Requirements, the first step of the intelligence cycle, is simply the question the rest of ' +
        'the work is meant to answer: what does a decision maker actually need to know, and by when. ' +
        'It is also the step that is easiest to skip, because collection feels like progress and ' +
        'requirements feels like paperwork, a delay before the real work starts. Skipping it does not ' +
        'save time, it just moves the cost downstream, the same way skipping a doctor asking what is ' +
        'wrong before ordering tests wastes effort on tests that may never have been needed.\n\n' +
        'Without a stated question, analysts tend to collect whatever is easy to reach or interesting ' +
        'to read, rather than what a decision actually needs. The eventual report answers no ' +
        'particular question, so no one specific person is waiting for it, which makes it easy to ' +
        'file away unread. Every hour spent processing material that never gets used is an hour not ' +
        'spent on a question that mattered.\n\n' +
        'The fix is not a bigger collection plan. It is a decision maker, even a reluctant one, ' +
        'willing to say roughly what they need to decide and by when, which is a short conversation ' +
        'compared to the alternative.',
    },
    options: [
      { id: 'a', label: 'Analysts tend to collect what is easy or interesting rather than what a decision actually needs.' },
      { id: 'b', label: 'The eventual report answers no specific question, so no one in particular is waiting to read it.' },
      { id: 'c', label: 'Time spent processing material that is never used is time taken away from a question that mattered.' },
      { id: 'd', label: 'More collection sources fix this problem, because the requirement can be worked out later from whatever was gathered.' },
      { id: 'e', label: 'The fix is a decision maker willing to say, even roughly, what they need to decide and by when.' },
    ],
    hints: [
      'Four describe a real cost of skipping requirements. One assumes the problem solves itself with more data.',
      'Does gathering more, without a question, make the eventual report more useful, or just larger?',
      'The fix is a short conversation about what is needed, not a bigger collection effort.',
    ],
    solution:
      'The correct answers are A, B, C, and E. Skipping requirements means effort goes toward what is ' +
      'easy to collect rather than what is needed, the result answers no one specific question, and ' +
      'the fix is a decision maker stating roughly what they need. D is wrong: more collection without ' +
      'a stated question does not manufacture a requirement after the fact, it just produces more ' +
      'material nobody asked for.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option assumes the missing requirement can be reconstructed from whatever was already collected?',
      },
    ],
    debrief:
      'When a report lands with a thud, ask what question it was meant to answer. If nobody can say, ' +
      'the requirements step never happened, and no amount of extra collection would have fixed that.',
    practice: [],
  },
  {
    id: 'ti.2.3',
    moduleId: 'ti.2',
    packageId: 'threat-intel-foundations',
    order: 3,
    title: 'Processing is not analysis',
    kind: 'multiple-choice',
    goal: 'Separate organising material from judging what it means.',
    prompt:
      'A junior analyst extracts indicators from ten reports, deduplicates the list, and calls the ' +
      'result the intelligence product. Which of the following are accurate? Select all that apply.',
    teach: {
      concept:
        'Processing and analysis sound like two names for the same thing, sorting through material, ' +
        'but they answer different questions, and mixing them up is one of the most common mistakes a ' +
        'new analyst makes. Processing asks what is here. Analysis asks what it means and how sure we ' +
        'are. Think of a librarian who sorts a pile of newspaper clippings into neat folders by topic: ' +
        'useful work, but the librarian has not told you what the clippings mean for your decision, ' +
        'only that they are now organised.\n\n' +
        'Extracting indicators from ten reports and deduplicating them is processing: real, necessary ' +
        'work, and still short of intelligence. A reader handed that list knows what was seen ' +
        'somewhere, but not what it means for this organisation, how likely it is to matter, or how ' +
        'confident that judgement is. Analysis is the step that turns organised material into a ' +
        'stated judgement, which is the part a reader cannot do for themselves without becoming the ' +
        'analyst.\n\n' +
        'The confusion matters because a team that stops at processing can feel productive, hours ' +
        'logged and a tidy list produced, while never actually answering the question a decision ' +
        'maker had.',
    },
    options: [
      { id: 'a', label: 'Deduplicating and organising indicators is processing, not analysis.' },
      { id: 'b', label: 'The list alone does not say what the indicators mean for this organisation, or how confident that meaning is.' },
      { id: 'c', label: 'Analysis is the step where processed material becomes a stated judgement, with a stated confidence.' },
      { id: 'd', label: 'Because the analyst worked hard collecting and organising the data, the result should count as analysis.' },
      { id: 'e', label: 'A reader handed a bare indicator list still has to do the analytic work themselves, which was the point of asking an analyst to do it.' },
    ],
    hints: [
      'Effort and analysis are not the same thing. One option confuses the two.',
      'Ask what the list tells a reader about what to do next, not how long it took to build.',
      'A tidy list is processing done well. It becomes analysis only once someone judges what it means.',
    ],
    solution:
      'The correct answers are A, B, C, and E. Organising and deduplicating is processing, and it ' +
      'leaves the meaning and the confidence unstated, which is what analysis adds; a reader without ' +
      'that judgement has to supply it themselves. D is wrong: effort spent on processing does not ' +
      'convert it into analysis, however much work went in, because effort and judgement are not the ' +
      'same currency.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option treats effort spent on processing as the same thing as having produced analysis?',
      },
    ],
    debrief:
      'If a product could have been produced by a script instead of an analyst, it is probably still ' +
      'processing. Analysis is the part that needed a person willing to commit to a judgement, which ' +
      'is exactly the part a script cannot do for you.',
    practice: [],
  },
  {
    id: 'ti.2.4',
    moduleId: 'ti.2',
    packageId: 'threat-intel-foundations',
    order: 4,
    title: 'Dissemination is not the finish line',
    kind: 'multiple-choice',
    goal: 'Treat delivery as the middle of the cycle, not the end.',
    prompt:
      'A report ships to the security leadership team and the analyst moves on to the next task. ' +
      'Which of the following are accurate about what should happen next? Select all that apply.',
    teach: {
      concept:
        'Dissemination is simply the step where a finished report gets delivered to the person who ' +
        'needs it, and it has its own failure mode that has nothing to do with whether the analysis ' +
        'itself was correct: delivering the right content in the wrong form, to the wrong person, or ' +
        'too late to matter. A report that is technically correct but arrives after the decision was ' +
        'already made has failed just as completely as one that was wrong, the same way perfect travel ' +
        'directions handed to someone after their flight has already left are worth nothing.\n\n' +
        'What comes after dissemination is feedback, and it is the step most teams skip once the ' +
        'report has shipped. Feedback asks whether the product actually answered the question, ' +
        'whether it arrived in time to matter, and what that implies for what should be asked next. ' +
        'Skipping it does not make the cycle finished, it makes the cycle blind: without feedback, a ' +
        'team keeps running the same collection plan and asking the same kind of question ' +
        'indefinitely, whether or not it is still the right one.',
    },
    options: [
      { id: 'a', label: 'A product that is late, even by a day, can be useless if the decision it was meant to inform has already been made.' },
      { id: 'b', label: 'Feedback from the reader on whether the report answered the question shapes what the next requirement should be.' },
      { id: 'c', label: 'Once a report has been sent, the cycle is finished and no further step is required.' },
      { id: 'd', label: 'A cycle with no feedback step tends to keep running the same collection plan, whether or not it is still the right one.' },
      { id: 'e', label: 'Delivering sound analysis in a form nobody reads or acts on is a dissemination failure, even though the analysis itself was correct.' },
    ],
    hints: [
      'One option treats delivery as the end of the process. The cycle says otherwise.',
      'What tells a team whether their collection plan is still the right one, a year later?',
      'A report can be correct and still fail, if it never reaches the reader in a form and a time that lets them use it.',
    ],
    solution:
      'The correct answers are A, B, D, and E. Timing and format are part of dissemination, and ' +
      'feedback is what tells a team whether the product actually worked and what to ask next. C is ' +
      'wrong: sending the report is not the end of the cycle, it is the point the cycle depends on to ' +
      'correct itself.',
    expectedOutput: 'Options A, B, D, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd', 'e'],
        hint: 'Which option treats sending the report as the final step, with nothing left to do?',
      },
    ],
    debrief:
      'The habit worth building is asking, after every report, whether it actually got used. That ' +
      'single question does most of the work of feedback, and it is a question most teams simply ' +
      'forget to ask once the report has shipped.',
    practice: [],
  },
  {
    id: 'ti.2.5',
    moduleId: 'ti.2',
    packageId: 'threat-intel-foundations',
    order: 5,
    title: 'Diagnose the broken step',
    kind: 'short-answer',
    goal: 'Name which cycle steps failed, and why fixing one prevents a repeat.',
    prompt:
      'A SOC lead complains that the threat intelligence team produces reports nobody uses. Nobody ' +
      'has ever told the team what to look for, and the team has never asked the SOC lead whether ' +
      'past reports helped. In two or three sentences, say which two steps of the cycle are missing, ' +
      'and why fixing the second one stops this from recurring.',
    teach: CYCLE_TEACH,
    hints: [
      'One missing step is at the very start of the cycle, the other at the very end.',
      'The team is collecting without a question, and never learning whether what it produced landed.',
      'Fixing the first step helps once. Fixing the second one is what stops the mismatch from repeating.',
    ],
    solution:
      'The missing steps are requirements and feedback. Because the SOC lead has never stated what ' +
      'the team needs to decide, the team collects and reports whatever is available rather than ' +
      'what would actually be useful, and because nobody asks whether past reports helped, that ' +
      'mismatch is never corrected and keeps repeating. Fixing feedback is what prevents recurrence, ' +
      'because it is the mechanism that turns a wrong or stale requirement into a corrected one for ' +
      'the next cycle, rather than leaving the team to guess indefinitely. Fixing requirements alone ' +
      'only patches this one cycle; fixing feedback is what stops the next one from drifting the same ' +
      'way.',
    expectedOutput:
      'An answer naming requirements and feedback as the missing steps, and explaining that feedback ' +
      'is what stops the mismatch recurring.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['requirement', 'question', 'need to decide', 'stated'],
          ['feedback', 'loop', 'correct', 'stale', 'recurring', 'next cycle'],
          ['guess', 'mismatch', 'never used', 'nobody uses'],
        ],
        hint: 'Name both missing steps, and say why the second one is what stops the problem from repeating.',
      },
    ],
    debrief:
      'This is the single most common failure mode in the field: a team that is busy at every step ' +
      'except the two that would tell it whether the busyness matters. It looks like productivity ' +
      'from the inside, and it is invisible until someone outside the team, like this SOC lead, says ' +
      'the reports are not helping.',
    practice: [],
  },
];

const PYRAMID_TEACH = {
  concept:
    'The pyramid of pain is a way of ranking different kinds of detection, not by how easy each one ' +
    'is to build, but by how much genuine pain each one causes an attacker when a defender acts on ' +
    'it. Think of it as ranking reactions to being caught: changing a licence plate after a witness ' +
    'notices your car is trivial, done in an afternoon, but changing your entire daily routine after ' +
    'being recognised by name is not, and might not happen at all. The pyramid orders six kinds of ' +
    'detection the same way, from the cheapest thing for an attacker to change, at the bottom, to the ' +
    'most expensive, at the top, and the answer depends entirely on how expensive that layer is for ' +
    'the attacker to change.\n\n' +
    'HASH VALUES sit at the bottom: a single recompile changes every hash, so blocking one costs the ' +
    'attacker nothing to route around. IP ADDRESSES cost a little more, a new host takes minutes to ' +
    'stand up. DOMAIN NAMES cost slightly more again, registration and propagation add friction ' +
    'measured in an afternoon rather than in minutes. NETWORK AND HOST ARTEFACTS, a distinctive file ' +
    'path, a registry key, a user agent string, cost more still, because they are tied to how the ' +
    'tool installs and runs, not just to where it is hosted. TOOLS cost real money and real time: ' +
    'losing a piece of malware to detection means acquiring or rebuilding a capability, and possibly ' +
    'retraining whoever operates it. TTPS, the tactics, techniques, and procedures that describe how ' +
    'an operation is actually run, sit at the top, because they are tied to training, doctrine, and ' +
    'habit rather than to any single piece of infrastructure or software, and changing them means ' +
    'changing how a whole team works.\n\n' +
    'The trade runs the other way for the defender: a hash rule is trivial to write and instantly ' +
    'stale, while a detection built on tradecraft takes real analytic work to build and keeps paying ' +
    'off long after the tools and infrastructure underneath it have all been replaced. Knowing where ' +
    'a given detection sits on this ladder is what tells you, before an attacker even reacts, roughly ' +
    'how long it is going to keep working.',
} as const;

const MODULE_TI_3: Exercise[] = [
  {
    id: 'ti.3.1',
    moduleId: 'ti.3',
    packageId: 'threat-intel-foundations',
    order: 1,
    title: 'Order the layers by attacker cost',
    kind: 'multiple-choice',
    goal: 'Place each layer of the pyramid by what it costs an attacker to change.',
    prompt: 'Which of the following correctly describe the ordering of the pyramid of pain? Select all that apply.',
    teach: PYRAMID_TEACH,
    options: [
      { id: 'a', label: 'Hash values are the cheapest layer, since recompiling a tool changes every hash instantly.' },
      { id: 'b', label: 'IP addresses and domain names cost more than a hash to change, but still only take minutes to an afternoon.' },
      { id: 'c', label: 'Network and host artefacts, such as a distinctive file path or registry key, cost more because they are tied to how the tool installs and runs.' },
      { id: 'd', label: 'Tools cost the least of any layer to replace, since malware of every kind is freely available online.' },
      { id: 'e', label: 'TTPs sit at the top because they are tied to training and doctrine, not to any single piece of software.' },
    ],
    hints: [
      'Four position a layer correctly relative to the others. One claims tools are as disposable as an IP address.',
      'Malware being available somewhere online does not mean an operator wants to switch tools partway through an operation.',
      'Cost here is not about whether a replacement exists, it is about what switching actually costs this operation.',
    ],
    solution:
      'The correct answers are A, B, C, and E. Hashes are the cheapest to change, addresses and ' +
      'domains cost slightly more but still take minutes to an afternoon, artefacts tied to ' +
      'installation and execution cost more again, and TTPs sit at the top because they are tied to ' +
      'training and doctrine rather than to any one piece of software. D is wrong: tools are expensive ' +
      'to replace mid operation, because doing so means acquiring or rebuilding a capability and ' +
      'possibly retraining whoever runs it, not simply downloading a new file.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option treats a tool as being as cheap to swap as an address?',
      },
    ],
    debrief:
      'Keep this ordering in your head whenever you are asked to prioritise a detection backlog. It ' +
      'tells you which rule will still matter in six months, and which one will be quietly useless by ' +
      'next week.',
    practice: [],
  },
  {
    id: 'ti.3.2',
    moduleId: 'ti.3',
    packageId: 'threat-intel-foundations',
    order: 2,
    title: 'What the defender pays for climbing',
    kind: 'multiple-choice',
    goal: 'Weigh the cost of building a detection at each layer.',
    prompt:
      'The pyramid of pain describes a trade off, not a free improvement. Which of the following are ' +
      'accurate about the cost to the defender of detecting at each layer? Select all that apply.',
    teach: {
      concept:
        'Every layer of the pyramid costs the attacker something to change, but it is easy to forget ' +
        'that climbing the pyramid also costs the defender something to build. Pretending otherwise ' +
        'leads to a backlog nobody can actually build.\n\n' +
        'A hash based detection is cheap to write, cheap to update, and useless the moment the file ' +
        'is recompiled. A detection built on tactics, techniques, and procedures takes real analytic ' +
        'work to design, needs tuning against normal activity, and usually tolerates more false ' +
        'positives while it settles in. What it buys in return is durability: it keeps working after ' +
        'the attacker changes tools and infrastructure underneath it, because it is not watching the ' +
        'tools or the infrastructure at all.\n\n' +
        'The honest version of this trade is that cheap detections go blind fast and durable ' +
        'detections cost more up front, and a programme has to budget for both rather than pretending ' +
        'one replaces the other.',
    },
    options: [
      { id: 'a', label: 'A hash based detection is cheap to write, but stops working the moment the file is recompiled.' },
      { id: 'b', label: 'A behaviour or TTP based detection takes more work to build and tune, and often tolerates more false positives at first.' },
      { id: 'c', label: 'A TTP based detection tends to keep working even after the attacker changes tools and infrastructure.' },
      { id: 'd', label: 'Because TTP based detections cost more to build, a mature programme should rely on an indicator feed instead.' },
      { id: 'e', label: 'The trade is real: cheap detections go blind fast, and durable detections cost more to build up front.' },
    ],
    hints: [
      'Four describe the real trade honestly. One uses the cost of the durable option as a reason to abandon it.',
      'What happens to an indicator only programme the week the attacker rotates infrastructure?',
      'The answer to a detection being expensive is rarely to stop building it, it is to budget for it.',
    ],
    solution:
      'The correct answers are A, B, C, and E. Hash detections are cheap and short lived, TTP ' +
      'detections cost more to build and tune but survive tool and infrastructure changes, and both ' +
      'halves of that trade are real. D is wrong: the cost of TTP detections is an argument for ' +
      'budgeting for them properly, not for abandoning them in favour of a feed that goes stale on its ' +
      'own schedule.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option uses the cost of a durable detection as a reason to give up on building one?',
      },
    ],
    debrief:
      'When someone asks why a behavioural detection took longer to ship than a blocklist update, ' +
      'this is the answer: it is not slower work, it is different work with a longer payoff, and that ' +
      'payoff is exactly why it was worth the wait.',
    practice: [],
  },
  {
    id: 'ti.3.3',
    moduleId: 'ti.3',
    packageId: 'threat-intel-foundations',
    order: 3,
    title: 'Build the durable detection',
    kind: 'multiple-choice',
    goal: 'Choose the version of a detection that costs the attacker the most to defeat.',
    prompt:
      'You have been asked to write a detection for a specific campaign. Which of the following ' +
      'approaches sit higher on the pyramid, and last longer? Select all that apply.',
    teach: {
      concept:
        'Two analysts can be asked to detect the exact same campaign and produce detections at ' +
        'opposite ends of the pyramid, because nothing about the assignment forces them to pick the ' +
        'same layer, and the difference between their choices shows up the first time the attacker ' +
        'changes anything.\n\n' +
        'A detection tied to the current callback domain, the exact command line string, or a single ' +
        'file hash breaks the moment that specific value changes, which for an active operator is a ' +
        'matter of when, not if. A detection built on the sequence of steps an actor takes, the way ' +
        'they typically stage files, or how they escalate privileges on a given class of system ' +
        'survives exactly that kind of change, because it was never watching the disposable part in ' +
        'the first place.',
    },
    options: [
      { id: 'a', label: 'A detection for the sequence of steps the actor uses to move from initial access to persistence, regardless of which tool implements it.' },
      { id: 'b', label: 'A detection for the specific command line pattern a living off the land technique produces, rather than for one malware sample.' },
      { id: 'c', label: 'A detection tied only to the current callback domain, to be refreshed each time the domain changes.' },
      { id: 'd', label: 'A detection for a distinctive way the actor stages and renames files, which survives a change of payload.' },
      { id: 'e', label: 'A detection for how the actor typically escalates privileges on this class of system, rather than for the exact exploit used.' },
    ],
    hints: [
      'Four describe a detection built on behaviour. One is built on the layer that changes first.',
      'Ask what happens to each detection the day the attacker registers a new domain.',
      'A callback domain is one of the cheapest things on the whole pyramid to replace.',
    ],
    solution:
      'The correct answers are A, B, D, and E. Each of these targets a sequence, a pattern, or a ' +
      'habit rather than a single disposable value, which is what makes them survive a change of tool ' +
      'or infrastructure. C is wrong: a detection tied to the current domain is exactly the kind of ' +
      'thing this campaign will change first, and refreshing it after each change is a treadmill, not ' +
      'a detection strategy.',
    expectedOutput: 'Options A, B, D, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd', 'e'],
        hint: 'Which option is built on the layer of the pyramid that costs the attacker the least to change?',
      },
    ],
    debrief:
      'If a detection needs a ticket every time the attacker registers a new domain, it was never ' +
      'built on the durable layer. Ask what it would take to break the detection, and aim higher up ' +
      'the pyramid next time.',
    practice: [],
  },
  {
    id: 'ti.3.4',
    moduleId: 'ti.3',
    packageId: 'threat-intel-foundations',
    order: 4,
    title: 'Indicators still have a job',
    kind: 'multiple-choice',
    goal: 'See why the bottom of the pyramid is still worth using, just not worth building a whole programme on.',
    prompt:
      'A colleague argues that since indicators sit at the bottom of the pyramid, subscribing to an ' +
      'indicator feed is a waste of time. Which of the following are accurate responses? Select all ' +
      'that apply.',
    teach: {
      concept:
        'The pyramid is often misread as a ranking of what is worth doing, when it is actually a ' +
        'ranking of what lasts. Those are different questions, the way "which coat keeps you warmest ' +
        'longest" is a different question from "which coat should you grab on your way out the door ' +
        'right now," and indicators do well on one of them and badly on the other.\n\n' +
        'A hash or an IP address is cheap for an attacker to change, which is why it does not last, ' +
        'but that same cheapness makes it fast for a defender to act on: a known bad value can be ' +
        'blocked in minutes with no analytic work required, which matters a great deal in the middle ' +
        'of an active incident. The pyramid argues against building a whole programme on indicators ' +
        'alone, not against using them at all. A mature programme keeps both: fast, disposable ' +
        'indicator blocking for the next five minutes, and durable behaviour based detection for the ' +
        'next five years.',
    },
    options: [
      { id: 'a', label: 'Indicators are cheap for the defender to act on too, which makes them useful for fast, immediate blocking.' },
      { id: 'b', label: 'The pyramid argues against relying only on indicators, not against using them at all.' },
      { id: 'c', label: 'During an active incident, blocking a known bad address or hash right now can be worth more than waiting for a slower behavioural detection.' },
      { id: 'd', label: 'Because indicators expire quickly, a programme should refuse to use them and wait for TTP based detections instead.' },
      { id: 'e', label: 'A mature programme uses fast indicator blocking and durable TTP detection together, for different purposes.' },
    ],
    hints: [
      'Four describe indicators as having a real, limited job. One throws that job away entirely.',
      'What would you actually do in the first five minutes of an active incident, while a TTP based detection is still being tuned?',
      'Short lived does not mean useless. It means the wrong thing to build your whole programme on.',
    ],
    solution:
      'The correct answers are A, B, C, and E. Indicators are fast to act on precisely because they ' +
      'are cheap, which matters most during an active incident, and the pyramid is an argument for ' +
      'balance rather than for abandoning the bottom layer. D is wrong: refusing to use indicators at ' +
      'all throws away the one thing they are genuinely good at, acting immediately, in exchange for ' +
      'nothing.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option confuses short lived with worthless?',
      },
    ],
    debrief:
      'The pyramid is a lesson about where to invest your long term effort, not a reason to ' +
      'unsubscribe from a feed. Keep both tools in the box, and reach for the right one depending on ' +
      'whether you need speed right now or durability over the coming months.',
    practice: [],
  },
  {
    id: 'ti.3.5',
    moduleId: 'ti.3',
    packageId: 'threat-intel-foundations',
    order: 5,
    title: 'Explain it to the feed subscriber',
    kind: 'short-answer',
    goal: 'Put the durability argument into words for someone relying only on indicators.',
    prompt:
      'Explain to a colleague, in two or three sentences, why a detection programme built only on an ' +
      'indicator feed will keep needing to be rebuilt, and what building at least some detections on ' +
      'TTPs buys instead.',
    teach: PYRAMID_TEACH,
    hints: [
      'Start with what makes an indicator cheap for the attacker to change.',
      'Then say what tying a detection to tradecraft instead actually survives.',
      'Your answer needs both halves: why the indicator only programme keeps breaking, and what the alternative buys.',
    ],
    solution:
      'A programme built only on an indicator feed keeps needing to be rebuilt because hashes, ' +
      'addresses, and domains are the cheapest things for an attacker to change, so the feed goes ' +
      'stale every time infrastructure rotates or a tool is recompiled. Building at least some ' +
      'detections on TTPs, the actual sequence of techniques and habits an actor uses, buys ' +
      'durability instead, because that layer is tied to training and tradecraft and is expensive for ' +
      'the attacker to change, so the detection keeps working even after the tools and infrastructure ' +
      'underneath it are replaced.',
    expectedOutput:
      'An answer explaining why indicator only detection goes stale, and why TTP based detection is ' +
      'durable instead.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['indicator', 'hash', 'address', 'domain', 'cheap', 'change', 'stale', 'rotate'],
          ['ttp', 'technique', 'tactic', 'tradecraft', 'behaviour', 'durable', 'expensive'],
          ['keep working', 'rebuilt', 'survive', 'last'],
        ],
        hint: 'Say why indicator only detection goes stale, and why TTP based detection survives instead.',
      },
    ],
    debrief:
      'This is the whole pyramid in one conversation: cheap and disposable at the bottom, expensive ' +
      'and durable at the top, and a good programme knows which one it is buying at any given moment, ' +
      'rather than assuming the cheaper option is automatically the better deal.',
    practice: [],
  },
];

const LEVELS_TEACH = {
  concept:
    'Think about how a doctor might deliver the same diagnosis three different ways: a short, plain ' +
    'note for the patient family explaining what it means for life ahead, a fuller conversation with ' +
    'the patient about treatment options over the coming months, and a technical chart entry for the ' +
    'next doctor on shift, who needs exact dosages right now and nothing else. Same underlying truth, ' +
    'three audiences, three different lengths, three different timeframes. Intelligence reporting ' +
    'works the same way: the same underlying facts about an actor can be written up three different ' +
    'ways, and choosing the right one is as much a part of the analytic job as getting the facts ' +
    'right, because a report nobody can use has failed regardless of its accuracy.\n\n' +
    'STRATEGIC intelligence is written for executives, boards, and risk owners deciding things like ' +
    'budget and risk appetite. It covers months to years, describes trends and sector wide targeting ' +
    'patterns, and rarely names a specific indicator, because an indicator will be irrelevant long ' +
    'before that decision is revisited. OPERATIONAL intelligence is written for security programme ' +
    'leads planning what to build or buy next. It covers a specific campaign or actor targeting this ' +
    'sector, over a timeframe of weeks to the length of the campaign, and it is detailed enough to ' +
    'justify a resourcing decision without being so technical that it needs translation. TACTICAL ' +
    'intelligence is written for the people in the console right now: SOC analysts, hunters, ' +
    'detection engineers. It covers specific indicators and technique guidance, usable within hours ' +
    'or days, because that is how long the underlying facts will stay true.\n\n' +
    'The altitude is chosen by asking what the reader is about to decide, not by how technical the ' +
    'reader happens to be. A very technical executive still needs a strategic product if what they ' +
    'are deciding is a budget.',
} as const;

const MODULE_TI_4: Exercise[] = [
  {
    id: 'ti.4.1',
    moduleId: 'ti.4',
    packageId: 'threat-intel-foundations',
    order: 1,
    title: 'Match the altitude to the audience',
    kind: 'multiple-choice',
    goal: 'Pair each intelligence level with who it is actually written for.',
    prompt: 'Which of the following correctly match an intelligence level to its intended audience? Select all that apply.',
    teach: LEVELS_TEACH,
    options: [
      { id: 'a', label: 'Strategic intelligence is written for executives and risk owners deciding budget and risk appetite.' },
      { id: 'b', label: 'Operational intelligence is written for security programme leads deciding what to build or buy next.' },
      { id: 'c', label: 'Tactical intelligence is written for SOC analysts and hunters who need something to search for right now.' },
      { id: 'd', label: 'All three levels are written for the same audience, since everyone in security needs the same information.' },
      { id: 'e', label: 'The right altitude depends on what the reader is about to decide, not on how technical that reader is.' },
    ],
    hints: [
      'Four match a level to a real, distinct audience. One collapses all three into a single reader.',
      'Does a board deciding next year budget need the same document as a hunter working tonight shift?',
      'Match the level to the decision the reader is about to make, not to their job title alone.',
    ],
    solution:
      'The correct answers are A, B, C, and E. Each level has a distinct reader deciding a distinct ' +
      'thing, and the right altitude follows the decision rather than the job title. D is wrong: ' +
      'treating every reader as needing the same document is exactly the mismatch that makes reports ' +
      'get skipped or misused.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option assumes every reader in the organisation needs the same document?',
      },
    ],
    debrief:
      'Before writing anything, name the reader and the decision. The altitude falls out of that ' +
      'almost automatically, and skipping this step is how a technically sound report ends up in the ' +
      'wrong inbox.',
    practice: [],
  },
  {
    id: 'ti.4.2',
    moduleId: 'ti.4',
    packageId: 'threat-intel-foundations',
    order: 2,
    title: 'Match the content to the altitude',
    kind: 'multiple-choice',
    goal: 'Know what belongs in a product at each level.',
    prompt: 'Which of the following correctly describe what belongs in each level of product? Select all that apply.',
    teach: {
      concept:
        'Content, not just audience, changes with altitude, the same way a doctor chart entry and a ' +
        'doctor conversation with a worried family cover the same diagnosis in genuinely different ' +
        'words, not just different lengths of the same words. Getting the mix wrong is the most common ' +
        'way a report fails even when it reaches the right desk.\n\n' +
        'A strategic product describes trends and sector wide targeting patterns over months or ' +
        'years, and naming a specific indicator in it is usually a sign the analyst wrote at the ' +
        'wrong altitude. An operational product describes a specific campaign or actor targeting this ' +
        'sector, with enough detail to justify a resourcing decision, over a timeframe of weeks to ' +
        'the length of the campaign. A tactical product gives indicators and technique level guidance ' +
        'usable in the console within hours or days, because that is how long that layer of ' +
        'information stays current.',
    },
    options: [
      { id: 'a', label: 'Strategic products describe trends and sector targeting patterns over months or years, and rarely name a specific indicator.' },
      { id: 'b', label: 'Operational products describe a specific campaign or actor targeting this sector, over a timeframe of weeks to the length of the campaign.' },
      { id: 'c', label: 'Tactical products give specific indicators and technique guidance usable in the console within hours or days.' },
      { id: 'd', label: 'A tactical product is simply a strategic product with more pages added.' },
      { id: 'e', label: 'The timeframe shortens and the detail sharpens as you move from strategic toward tactical.' },
    ],
    hints: [
      'Four describe a real change in content between the levels. One treats the difference as only length.',
      'Would adding more pages to a five year trends report make it useful to tonight shift?',
      'The levels differ in kind, timeframe, and specificity, not just in how much has been written.',
    ],
    solution:
      'The correct answers are A, B, C, and E. Each level has content suited to its timeframe, from ' +
      'years down to hours, and specificity increases as the timeframe shortens. D is wrong: a ' +
      'tactical product is not a longer strategic one, it is a different kind of document built for a ' +
      'different, much shorter, decision window.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option treats the three levels as differing only in length rather than in kind?',
      },
    ],
    debrief:
      'If a report could be usefully shortened into a different level rather than just trimmed, it ' +
      'was probably written at the wrong altitude to begin with, since trimming a strategic report ' +
      'does not turn it into a tactical one.',
    practice: [],
  },
  {
    id: 'ti.4.3',
    moduleId: 'ti.4',
    packageId: 'threat-intel-foundations',
    order: 3,
    title: 'The mismatch that wastes a reading',
    kind: 'multiple-choice',
    goal: 'See why writing at the wrong altitude fails even accurate work.',
    prompt:
      'A team sends a page of file hashes to the board, and sends a five year threat landscape ' +
      'narrative to the SOC in the middle of an active intrusion. Which of the following are ' +
      'accurate? Select all that apply.',
    teach: {
      concept:
        'A mismatch in altitude wastes a reading in both directions, the way handing a technical ' +
        'manual to someone who just wants to know if a product is safe to use, or handing a one line ' +
        'summary to the engineer who has to fix it, both fail the reader even though nothing in either ' +
        'document is actually wrong. It is worth noticing that the failure here is identical even ' +
        'though the two documents look nothing alike.\n\n' +
        'A board handed tactical indicators has nothing to do with them: they are not the audience ' +
        'that searches a console for a hash, and the document answers a question they were never ' +
        'asking. A SOC handed a strategic narrative during an active intrusion has the opposite ' +
        'problem: accurate, well written, and useless for the next ten minutes, because there is ' +
        'nothing in it to search for right now. Both failures come from the same mistake, writing at ' +
        'the wrong altitude for what the reader is about to decide, and no amount of added technical ' +
        'detail or added narrative context fixes a mismatch of altitude rather than of content.',
    },
    options: [
      { id: 'a', label: 'The board received a tactical product it has no use for, since it is not the audience that searches a console for a hash.' },
      { id: 'b', label: 'The SOC received a strategic product with nothing in it to search for during an active intrusion.' },
      { id: 'c', label: 'Both failures come from the same mistake: writing at the wrong altitude for what the reader needs to decide right now.' },
      { id: 'd', label: 'Sending more detail in either direction would have fixed both problems.' },
      { id: 'e', label: 'Matching altitude to audience is part of the analytic job, not a formatting afterthought.' },
    ],
    hints: [
      'Four describe the mismatch accurately. One assumes more detail fixes a problem that is not about detail.',
      'Would a longer hash list help the board? Would a longer trends narrative help the SOC tonight?',
      'The problem here is altitude, not length. More of the wrong altitude is still the wrong altitude.',
    ],
    solution:
      'The correct answers are A, B, C, and E. Both readers got a document built for a different ' +
      'decision than the one they were actually making, and that is an altitude failure rather than a ' +
      'length or detail failure. D is wrong: adding more of the same wrong altitude does not fix a ' +
      'mismatch, it only makes the unusable document longer.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option assumes the fix here is more detail rather than a different altitude entirely?',
      },
    ],
    debrief:
      'When a report gets no reaction, check the altitude before you rewrite a single sentence. You ' +
      'may have written a perfectly good answer to a question nobody in the room was asking.',
    practice: [],
  },
  {
    id: 'ti.4.4',
    moduleId: 'ti.4',
    packageId: 'threat-intel-foundations',
    order: 4,
    title: 'Pair the report with its reader',
    kind: 'multiple-choice',
    goal: 'Judge whether a report and audience pairing fits the altitude.',
    prompt: 'Which of the following report and audience pairings are appropriate for the altitude involved? Select all that apply.',
    teach: LEVELS_TEACH,
    options: [
      { id: 'a', label: 'A twelve month sector targeting trends report, sent to the executive risk committee.' },
      { id: 'b', label: 'A campaign profile of an actor currently targeting the industry, sent to the head of security engineering deciding next quarter budget.' },
      { id: 'c', label: 'A list of indicators and a detection rule, sent to the SOC watching the console this shift.' },
      { id: 'd', label: 'A twelve month sector trends report, sent to the SOC analyst who needs to triage an alert right now.' },
      { id: 'e', label: 'A same day indicator list, sent to the on call hunter during an active investigation.' },
    ],
    hints: [
      'Four pairings match the altitude of the report to what the reader is deciding. One does not.',
      'What can a SOC analyst triaging an alert this minute actually do with a twelve month trends report?',
      'The mismatched pairing sends a strategic product to someone who needed a tactical one, right now.',
    ],
    solution:
      'The correct answers are A, B, C, and E. Each of these sends a report at the altitude its ' +
      'reader can actually use, matched to the decision in front of them. D is wrong: a SOC analyst ' +
      'triaging an alert needs indicators and guidance usable in the next few minutes, not a year long ' +
      'trends narrative, however accurate it is.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which pairing sends a strategic document to a reader who needs to act in the next few minutes?',
      },
    ],
    debrief:
      'A well matched pairing usually reads as unremarkable. A mismatched one is the report everyone ' +
      'remembers for the wrong reasons.',
    practice: [],
  },
  {
    id: 'ti.4.5',
    moduleId: 'ti.4',
    packageId: 'threat-intel-foundations',
    order: 5,
    title: 'Pick the altitude',
    kind: 'short-answer',
    goal: 'Choose the right level of product for a request from outside the SOC.',
    prompt:
      'The Chief Financial Officer asks what the risk of ransomware is for the company, ahead of ' +
      'renewing cyber insurance. In two or three sentences, say which level of intelligence you would ' +
      'produce for this request, and why a tactical indicator list would be the wrong answer.',
    teach: LEVELS_TEACH,
    hints: [
      'What is the Chief Financial Officer actually deciding, and over what timeframe?',
      'A budget or insurance decision calls for trend and risk framing, not a technical list.',
      'Say what you would produce, and say specifically why a list of indicators would not help this reader make this decision.',
    ],
    solution:
      'I would produce a strategic product: a summary of ransomware trends and targeting patterns ' +
      'relevant to this sector over the past year or two, framed around risk and likely cost rather ' +
      'than technical detail, since the Chief Financial Officer is deciding on insurance and risk ' +
      'appetite rather than defending a console. A tactical indicator list would be the wrong answer ' +
      'because it answers a question nobody at that altitude is asking, gives the reader nothing they ' +
      'can act on, and would still need to be redone at the right altitude afterward.',
    expectedOutput:
      'An answer naming a strategic product as the right altitude, and explaining why a tactical ' +
      'indicator list would not serve this reader.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['strategic', 'trend', 'risk', 'sector', 'insurance', 'budget'],
          ['cfo', 'chief financial officer', 'decide', 'risk appetite'],
          ['tactical', 'indicator', 'hash', 'wrong', 'not useful', 'cannot act'],
        ],
        hint: 'Name the right altitude, and say specifically why a tactical indicator list fails this reader.',
      },
    ],
    debrief:
      'This request comes up constantly outside the SOC. Recognising it as a strategic question, not ' +
      'a technical one, is most of the skill, and answering it with the wrong altitude of product is ' +
      'the single most common way to lose a non technical reader entirely.',
    practice: [],
  },
];

const SAT_TEACH = {
  concept:
    'Analysts are exactly as vulnerable to bias as anyone else. Bias, in plain terms, is a tendency ' +
    'to notice and remember whatever already matches what you expect or want to be true, the same ' +
    'way a sports fan convinced their team will win tends to notice every good play and explain away ' +
    'every mistake. Confirmation bias, reaching for a conclusion early and then reading every ' +
    'subsequent report looking for support, is the most common analytic failure there is, and it is ' +
    'dangerous precisely because it does not feel like a mistake while it is happening: it feels like ' +
    'the evidence keeps agreeing with you. Structured analytic techniques exist to force a check on ' +
    'your own reasoning before it reaches a decision maker, rather than trusting that carefulness ' +
    'alone will catch it, because carefulness alone is exactly what confirmation bias defeats.\n\n' +
    'ANALYSIS OF COMPETING HYPOTHESES lists every plausible explanation before looking hard at the ' +
    'evidence, then scores each piece of evidence against every hypothesis in turn, not only against ' +
    'the one that seems likeliest. The hypothesis that survives is the one with the least evidence ' +
    'against it, not the one with the most evidence for it, because evidence that fits several ' +
    'explanations equally does not actually help tell them apart.\n\n' +
    'A STRUCTURED DISSENT review assigns someone, ideally someone with no stake in the leading ' +
    'conclusion, to build the strongest case against it, before that conclusion is finalised and ' +
    'delivered. Done after the report has already shipped, it changes nothing; done before, it can ' +
    'catch a case that rests on assumption rather than on evidence.\n\n' +
    'A KEY ASSUMPTIONS CHECK writes down everything the analysis is quietly taking for granted, the ' +
    'unstated premises that would change the conclusion if they turned out to be wrong, and tests ' +
    'each one explicitly rather than letting it ride unexamined.',
} as const;

const MODULE_TI_5: Exercise[] = [
  {
    id: 'ti.5.1',
    moduleId: 'ti.5',
    packageId: 'threat-intel-foundations',
    order: 1,
    title: 'What competing hypotheses actually asks for',
    kind: 'multiple-choice',
    goal: 'Get the mechanics of the technique right, not just its name.',
    prompt: 'Which of the following correctly describe how analysis of competing hypotheses is meant to work? Select all that apply.',
    teach: SAT_TEACH,
    options: [
      { id: 'a', label: 'List every plausible hypothesis before looking closely at the evidence, not only the one that seems likeliest.' },
      { id: 'b', label: 'Score each piece of evidence against every hypothesis, not only against the one you already favour.' },
      { id: 'c', label: 'The strongest hypothesis is whichever one has the most evidence found in its favour.' },
      { id: 'd', label: 'Evidence that is consistent with several hypotheses equally does not help distinguish between them.' },
      { id: 'e', label: 'The technique is meant to slow down commitment to a hypothesis long enough to check it against the alternatives.' },
    ],
    hints: [
      'Four describe the technique correctly. One describes ordinary hypothesis testing instead, which is what the technique exists to correct.',
      'Ask which hypothesis has the least evidence against it, not which one collected the most support.',
      'Evidence that fits every hypothesis equally well tells you nothing about which one is true.',
    ],
    solution:
      'The correct answers are A, B, D, and E. Listing every hypothesis first, scoring evidence ' +
      'against all of them, and treating shared evidence as uninformative are the actual mechanics of ' +
      'the technique, and the point is to slow down a premature conclusion. C is wrong: favouring ' +
      'whichever hypothesis has the most supporting evidence is exactly the confirmation bias the ' +
      'technique is built to catch, because it is easy to keep finding evidence for a hypothesis you ' +
      'already believe.',
    expectedOutput: 'Options A, B, D, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd', 'e'],
        hint: 'Which option describes picking the hypothesis with the most support, rather than the least contradiction?',
      },
    ],
    debrief:
      'The counterintuitive part is the whole point. If the technique just confirmed whichever ' +
      'hypothesis you liked first, it would not be worth the extra work, and it would not have caught ' +
      'anything a less disciplined analyst would have missed.',
    practice: [],
  },
  {
    id: 'ti.5.2',
    moduleId: 'ti.5',
    packageId: 'threat-intel-foundations',
    order: 2,
    title: 'Timing the dissenting review',
    kind: 'multiple-choice',
    goal: 'Know when a structured dissent review can actually change something.',
    prompt:
      'A team appoints someone to build the strongest case against the leading hypothesis. Which of ' +
      'the following are accurate about when and how this works? Select all that apply.',
    teach: {
      concept:
        'A structured dissent review is simply the practice of assigning someone to deliberately argue ' +
        'against the team leading conclusion before that conclusion goes out the door, the way a good ' +
        'editor reads a draft looking specifically for the weakest claim in it rather than nodding ' +
        'along. It only works if it happens at the right point in the process, and teams that get the ' +
        'timing wrong often conclude the technique does not help, when really they never actually ' +
        'tried it.\n\n' +
        'It works best assigned before the conclusion is finalised and delivered, while there is ' +
        'still time to change course, and given to someone with no personal stake in the leading ' +
        'hypothesis being right, since the person who built the case is the worst placed person to ' +
        'also attack it. Its purpose is narrow and specific: to surface a case built on assumption ' +
        'rather than on evidence, before a decision maker ever sees it, and it is a check on the ' +
        'reasoning of the team, not an attack on any individual person in it.',
    },
    options: [
      { id: 'a', label: 'It works best when assigned before the conclusion is finalised and delivered, not after.' },
      { id: 'b', label: 'It works best when given to someone who has no stake in the leading hypothesis being right.' },
      { id: 'c', label: 'Its purpose is to surface a case built on assumption rather than evidence, before a decision maker sees it.' },
      { id: 'd', label: 'Doing it after the report has already shipped catches the same problems just as well.' },
      { id: 'e', label: 'It is a check on the reasoning of the team, not an attack on any individual person in it.' },
    ],
    hints: [
      'Four get the timing and purpose right. One moves the review to a point where it can no longer change anything.',
      'What can a dissenting review actually change, once the report has already reached the decision maker?',
      'The value of the review is in what it can still prevent, not in what it can criticise afterward.',
    ],
    solution:
      'The correct answers are A, B, C, and E. Assigning the review before the conclusion ships, to ' +
      'someone without a stake in it, is what lets it actually catch a weak case in time to fix it, ' +
      'and the review is aimed at the reasoning rather than at a person. D is wrong: a review done ' +
      'after delivery cannot change what the decision maker already read, so it catches nothing that ' +
      'still matters.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option places the review after the point where it could still change anything?',
      },
    ],
    debrief:
      'If your team only ever does this review after a report has shipped, you are not running the ' +
      'technique, you are running a post mortem, and a post mortem cannot save the patient.',
    practice: [],
  },
  {
    id: 'ti.5.3',
    moduleId: 'ti.5',
    packageId: 'threat-intel-foundations',
    order: 3,
    title: 'What counts as an assumption worth testing',
    kind: 'multiple-choice',
    goal: 'Target the unstated premises rather than the settled facts.',
    prompt:
      'You are running a key assumptions check on a draft assessment. Which of the following are ' +
      'genuine candidates to test? Select all that apply.',
    teach: {
      concept:
        'An assumption, in plain terms, is something you are treating as true without actually having ' +
        'checked it, the unstated floor a whole argument is standing on. A key assumptions check is ' +
        'the exercise of listing those unstated floors out loud and testing each one, and it only ' +
        'works if it targets the right things: the natural instinct, to check the facts everyone ' +
        'already agrees on, misses the point entirely, because those facts were never the risky part.\n\n' +
        'The candidates worth testing are the ones the assessment quietly depends on without saying ' +
        'so out loud: something taken for granted that would change the conclusion if it turned out ' +
        'to be false, a belief about motive that was inferred rather than confirmed by evidence, or a ' +
        'premise inherited from an earlier report that nobody on the current team has actually ' +
        're-examined. A detail that is genuinely well established and rarely challenged is not the ' +
        'target of this exercise, because testing settled facts wastes the time that should go to ' +
        'the assumptions actually carrying risk.',
    },
    options: [
      { id: 'a', label: 'Something the analysis takes for granted that, if wrong, would change the conclusion.' },
      { id: 'b', label: 'A belief about the actor motive that was never actually confirmed by evidence, only inferred.' },
      { id: 'c', label: 'A technical detail everyone on the team already agrees is well established and rarely challenged.' },
      { id: 'd', label: 'A premise inherited from an earlier report that nobody on the current team has re-examined.' },
      { id: 'e', label: 'Anything the assessment would fall apart without, that was never stated out loud.' },
    ],
    hints: [
      'Four are the kind of unstated, risky premise the technique is built to find. One is a settled fact, not an assumption.',
      'Testing something everyone already agrees on does not use the time well.',
      'Look for the premises the assessment depends on but never says out loud.',
    ],
    solution:
      'The correct answers are A, B, D, and E. Each of these is an unstated, load bearing premise ' +
      'that the assessment depends on without examining, which is exactly what the technique is for. ' +
      'C is wrong: a detail that is genuinely well established and rarely challenged is not the risky ' +
      'kind of assumption this check is meant to surface, and spending the check on it wastes the time ' +
      'that should go to the ones that are actually shaky.',
    expectedOutput: 'Options A, B, D, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd', 'e'],
        hint: 'Which option describes a settled fact rather than an unstated, risky premise?',
      },
    ],
    debrief:
      'A good key assumptions check usually feels uncomfortable, because it is aimed at the premises ' +
      'the team has stopped noticing it is relying on, the ones that would be embarrassing to say out ' +
      'loud precisely because nobody has actually verified them.',
    practice: [],
  },
  {
    id: 'ti.5.4',
    moduleId: 'ti.5',
    packageId: 'threat-intel-foundations',
    order: 4,
    title: 'Spot the bias a technique would have caught',
    kind: 'multiple-choice',
    goal: 'Diagnose confirmation bias, and judge the process rather than the outcome.',
    prompt:
      'An analyst decided early which actor was responsible, then read every subsequent report ' +
      'looking for support for that actor. Which of the following are accurate? Select all that apply.',
    teach: SAT_TEACH,
    options: [
      { id: 'a', label: 'This is confirmation bias: evidence was sought to support a conclusion already reached, rather than to test it.' },
      { id: 'b', label: 'Analysis of competing hypotheses would have forced the evidence to be scored against alternative actors too.' },
      { id: 'c', label: 'A structured dissent review, run before the report shipped, could have surfaced the missing alternatives.' },
      { id: 'd', label: 'Since the analyst eventually turned out to be right, the process used to get there does not matter.' },
      { id: 'e', label: 'The underlying problem is the order of operations: the conclusion came before the evidence was weighed, not after.' },
    ],
    hints: [
      'Four correctly diagnose the failure and its remedy. One excuses the process because the outcome happened to be right.',
      'A process that gets lucky once will get unlucky eventually. That is exactly why the process matters.',
      'The problem here is not the conclusion, it is the order: conclusion first, evidence gathered to fit it second.',
    ],
    solution:
      'The correct answers are A, B, C, and E. The analyst reached a conclusion early and then hunted ' +
      'for support, which either technique would have interrupted before it shipped. D is wrong: being ' +
      'right this time does not validate a process that reaches conclusions before weighing evidence, ' +
      'and the next case run the same way has no reason to end as luckily.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option treats a lucky outcome as proof the process was sound?',
      },
    ],
    debrief:
      'Judge the process, not just the outcome. An analyst who gets credit for being right by ' +
      'accident learns exactly the wrong lesson, and so does everyone watching them get that credit.',
    practice: [],
  },
  {
    id: 'ti.5.5',
    moduleId: 'ti.5',
    packageId: 'threat-intel-foundations',
    order: 5,
    title: 'Apply the technique',
    kind: 'short-answer',
    goal: 'Reason through two equally plausible hypotheses using the technique.',
    prompt:
      'Two hypotheses explain an intrusion equally well from the initial evidence: a criminal group ' +
      'after payment data, or a competitor after research data. In two or three sentences, say how ' +
      'analysis of competing hypotheses would proceed differently from simply picking the more likely ' +
      'sounding option.',
    teach: SAT_TEACH,
    hints: [
      'Start with what gets listed before any evidence is weighed.',
      'Then say what happens to each piece of evidence, and against how many hypotheses it gets scored.',
      'Finish with what decides the winner: least evidence against, not most evidence for.',
    ],
    solution:
      'Rather than picking whichever hypothesis sounds more likely on first read, analysis of ' +
      'competing hypotheses requires listing both explicitly and scoring every piece of evidence ' +
      'against each of them in turn, not only against the favoured one. The hypothesis that survives ' +
      'is the one with the least evidence actually contradicting it, and any evidence that fits both ' +
      'equally is set aside as unhelpful for telling them apart, which keeps the choice grounded in ' +
      'what discriminates rather than in which story feels more familiar.',
    expectedOutput:
      'An answer describing listing both hypotheses, scoring evidence against each, and choosing by ' +
      'least contradicting evidence rather than by intuition.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['list', 'both', 'hypothes'],
          ['score', 'evidence', 'against each', 'every hypothesis'],
          ['least evidence against', 'discriminat', 'contradict'],
        ],
        hint: 'Say what gets listed first, how evidence gets scored, and what actually decides the winner.',
      },
    ],
    debrief:
      'Notice that the technique does not require more evidence, only a more disciplined way of ' +
      'weighing what you already have. That is what makes it usable under a deadline rather than a ' +
      'luxury for when there is time to spare.',
    practice: [],
  },
];

const WEP_TEACH = {
  concept:
    'Imagine two weather forecasters. One says it will probably rain tomorrow. The other says there ' +
    'is a 70 percent chance of rain tomorrow. Both may have looked at the exact same data, but the ' +
    'first one has left you to guess what probably means to them, and different people fill in wildly ' +
    'different numbers for the same word. Plain language is a poor way to state a probability, ' +
    'because the same word means different things to different readers. Replicated studies that asked analysts and readers what percentage ' +
    'they privately meant by a word like probable have found answers spread across a wide range for ' +
    'the exact same word, sometimes by fifty points or more. Words of estimative probability exist ' +
    'to close that gap by tying a small set of standard phrases to a roughly agreed numeric range, ' +
    'the same way the second forecaster 70 percent leaves nothing for the listener to guess.\n\n' +
    'ALMOST CERTAIN corresponds to roughly 90 to 99 percent, not to absolute certainty. LIKELY or ' +
    'PROBABLE corresponds to roughly 55 to 80 percent, a real majority but well short of near ' +
    'certainty. ROUGHLY EVEN CHANCE sits near 50 percent, meaning the evidence does not clearly ' +
    'favour one outcome over the other. UNLIKELY corresponds to roughly 20 to 45 percent, and REMOTE ' +
    'or HIGHLY UNLIKELY to roughly 1 to 10 percent, neither of which means impossible.\n\n' +
    'CONFIDENCE LEVEL is a separate axis entirely, and it does not mean how dramatic or extreme the ' +
    'estimate sounds. It describes how much the analyst trusts the estimate itself, based on how ' +
    'reliable the sources are, whether the reporting is corroborated by more than one independent ' +
    'source, and how short and sound the chain of reasoning is between the evidence and the ' +
    'conclusion. An analyst can be highly confident in a roughly even chance call, if the evidence for ' +
    'genuine uncertainty is itself strong, and can have low confidence in a dramatic sounding call, if ' +
    'it rests on a single uncorroborated source.',
} as const;

const MODULE_TI_6: Exercise[] = [
  {
    id: 'ti.6.1',
    moduleId: 'ti.6',
    packageId: 'threat-intel-foundations',
    order: 1,
    title: 'Match the phrase to the range',
    kind: 'multiple-choice',
    goal: 'Learn the standard probability language and what it maps to.',
    prompt: 'Which of the following correctly match a standard phrase to its rough numeric range? Select all that apply.',
    teach: WEP_TEACH,
    options: [
      { id: 'a', label: 'Almost certain corresponds to roughly 90 to 99 percent, not to absolute certainty.' },
      { id: 'b', label: 'Likely or probable corresponds to roughly 55 to 80 percent, a real majority but not near certainty.' },
      { id: 'c', label: 'Roughly even chance means the evidence does not clearly favour one outcome over the other, near 50 percent.' },
      { id: 'd', label: 'Unlikely means the outcome is impossible and can be dismissed from planning.' },
      { id: 'e', label: 'Using a standard scale is meant to stop two readers from privately understanding the same word to mean two different percentages.' },
    ],
    hints: [
      'Four match a phrase to roughly the right range. One treats a low probability as a zero probability.',
      'Unlikely still corresponds to a real percentage range, not to nothing.',
      'Nothing on this scale means impossible. Even remote keeps a small percentage attached to it.',
    ],
    solution:
      'The correct answers are A, B, C, and E. Each phrase maps to a rough range from near certainty ' +
      'down toward near impossibility, and the whole point of the scale is to make that mapping shared ' +
      'rather than private. D is wrong: unlikely corresponds to a real, if small, range of roughly 20 ' +
      'to 45 percent, and treating it as impossible is exactly the kind of misreading the standard ' +
      'scale exists to prevent.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option treats a low probability phrase as meaning zero probability?',
      },
    ],
    debrief:
      'The scale exists so that unlikely still means something to plan around. Treating it as ' +
      'impossible throws away the entire point of stating a range at all, and it is exactly the kind ' +
      'of thing a decision maker under pressure will do if you leave it to their imagination.',
    practice: [],
  },
  {
    id: 'ti.6.2',
    moduleId: 'ti.6',
    packageId: 'threat-intel-foundations',
    order: 2,
    title: 'Probability and confidence are not the same axis',
    kind: 'multiple-choice',
    goal: 'Separate how likely something is from how much you trust the estimate.',
    prompt:
      'Which of the following correctly describe the difference between the probability stated in a ' +
      'judgement and the confidence attached to it? Select all that apply.',
    teach: {
      concept:
        'Probability and confidence sound like the same idea, how sure am I, but they answer two ' +
        'genuinely different questions, and collapsing them into a single impression is one of the ' +
        'most common ways an estimate gets misread.\n\n' +
        'Probability is the estimated likelihood of the outcome itself. Confidence is how much the ' +
        'analyst trusts that estimate, based on the sourcing and reasoning behind it. An analyst can ' +
        'be highly confident in a roughly even chance call, if the evidence that the odds are ' +
        'genuinely close is itself strong and well corroborated, and can have low confidence in a ' +
        'dramatic sounding call, if it rests on a single uncorroborated source. Reporting both ' +
        'separately is what lets a reader tell a well supported near even bet apart from a shaky, ' +
        'dramatic sounding one, which a single combined score would hide.',
    },
    options: [
      { id: 'a', label: 'Probability is the estimated likelihood of the outcome; confidence is how much the analyst trusts that estimate.' },
      { id: 'b', label: 'An analyst can be highly confident in a roughly even chance call, if the evidence for genuine uncertainty is strong and well corroborated.' },
      { id: 'c', label: 'An analyst can have low confidence in a dramatic sounding call, if it rests on a single uncorroborated source.' },
      { id: 'd', label: 'If the stated confidence is high, the stated probability must also be high.' },
      { id: 'e', label: 'Reporting both separately lets a reader tell a well supported near even bet apart from a shaky, dramatic one.' },
    ],
    hints: [
      'Four keep probability and confidence as separate axes. One collapses them into a single scale.',
      'Can you be sure the odds are close to fifty fifty? That is high confidence in a middling probability.',
      'High confidence describes trust in the estimate, not how extreme the estimate itself is.',
    ],
    solution:
      'The correct answers are A, B, C, and E. Probability and confidence measure different things ' +
      'and can move independently of each other, which is exactly why they are reported on separate ' +
      'scales. D is wrong: confidence describes how well supported an estimate is, not how extreme it ' +
      'is, and a highly confident roughly even chance call is a perfectly ordinary combination.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option assumes confidence and probability must rise and fall together?',
      },
    ],
    debrief:
      'Watch for a report that states high confidence and a dramatic probability together with ' +
      'nothing to corroborate either. That combination is worth questioning on its own, because it is ' +
      'exactly what an unsupported but appealing conclusion looks like when it is dressed up as ' +
      'analysis.',
    practice: [],
  },
  {
    id: 'ti.6.3',
    moduleId: 'ti.6',
    packageId: 'threat-intel-foundations',
    order: 3,
    title: 'What actually sets the confidence level',
    kind: 'multiple-choice',
    goal: 'Name the real inputs to confidence, and rule out the fake ones.',
    prompt: 'Which of the following genuinely determine how much confidence should be attached to a judgement? Select all that apply.',
    teach: {
      concept:
        'Confidence is not a feeling, and it is not a matter of seniority, the way a doctor confidence ' +
        'in a diagnosis should track the test results, not how many years they have practised. It is a ' +
        'judgement built from three concrete inputs, and naming them is what keeps the label honest.\n\n' +
        'How reliable the sources behind the judgement have been historically is the first input. ' +
        'Whether the reporting is corroborated by more than one independent source is the second. How ' +
        'short and sound the chain of inference is between the evidence and the conclusion is the ' +
        'third, since a conclusion reached in one direct step is easier to trust than one reached ' +
        'through several layers of inference. None of these inputs care who is delivering the ' +
        'judgement or how senior they are, and a confidence level should be stated honestly even when ' +
        'it comes out low, rather than rounded up to sound more authoritative.',
    },
    options: [
      { id: 'a', label: 'How reliable the sources behind the judgement have been historically.' },
      { id: 'b', label: 'Whether the reporting is corroborated by more than one independent source.' },
      { id: 'c', label: 'How sound and short the chain of inference is between the evidence and the conclusion.' },
      { id: 'd', label: 'How senior the analyst delivering the judgement is.' },
      { id: 'e', label: 'Confidence should be stated honestly even when it is low, rather than rounded up to sound authoritative.' },
    ],
    hints: [
      'Four are genuine inputs to confidence. One is about the messenger rather than the evidence.',
      'Does a judgement become better supported because a more senior person is delivering it?',
      'Confidence tracks the sourcing and reasoning, not the rank of whoever is speaking.',
    ],
    solution:
      'The correct answers are A, B, C, and E. Source reliability, corroboration, and the length and ' +
      'soundness of the reasoning chain are what actually determine confidence, and it should be ' +
      'reported honestly regardless of how it looks. D is wrong: seniority changes nothing about how ' +
      'well supported a judgement actually is, and letting it influence the stated confidence would ' +
      'make the label meaningless.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option lets the rank of the messenger stand in for the strength of the evidence?',
      },
    ],
    debrief:
      'If you ever catch yourself rounding a confidence level up because a senior reader wanted a ' +
      'firmer answer, that is the exact moment the label stops meaning anything, and it stops being a ' +
      'measurement and starts being a courtesy.',
    practice: [],
  },
  {
    id: 'ti.6.4',
    moduleId: 'ti.6',
    packageId: 'threat-intel-foundations',
    order: 4,
    title: 'Why vague language is a real risk',
    kind: 'multiple-choice',
    goal: 'See what happens when a report leans on plain words instead of a stated range.',
    prompt:
      'A study found that readers given the same word, such as probable, privately understood it to ' +
      'mean anything from roughly a quarter chance to roughly a nine in ten chance. Which of the ' +
      'following are accurate consequences? Select all that apply.',
    teach: WEP_TEACH,
    options: [
      { id: 'a', label: 'Two readers of the same report can walk away with very different understandings of how likely something was judged to be.' },
      { id: 'b', label: 'A decision maker may act as though a call was near certain when the analyst meant only a bare majority.' },
      { id: 'c', label: 'Standardising the phrase to range mapping across a team reduces, though it does not eliminate, this gap.' },
      { id: 'd', label: 'Because language is inherently imprecise, attaching any percentage range at all is misleading and should be avoided.' },
      { id: 'e', label: 'The risk is highest exactly where the stakes are highest, since that is when a decision maker is most likely to act on the words alone.' },
    ],
    hints: [
      'Four describe the real risk of vague language and the point of fixing it. One gives up on fixing it entirely.',
      'What does attaching a range do to the gap between readers, even if it cannot close it completely?',
      'The response to imprecise language is a shared standard, not abandoning numbers altogether.',
    ],
    solution:
      'The correct answers are A, B, C, and E. Readers genuinely disagree about what a bare word ' +
      'means, a decision maker can act on the wrong end of that gap, and standardising the phrase to ' +
      'range mapping narrows it, especially where the stakes make the gap most dangerous. D is wrong: ' +
      'the imprecision of plain language is the argument for attaching a standard range, not the ' +
      'argument for abandoning ranges altogether.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option treats the fix for imprecise language as giving up on precision entirely?',
      },
    ],
    debrief:
      'Every time you write probable without a range attached, assume the reader is filling in their ' +
      'own number, and that it may not be the one you meant. The word costs you nothing to write and ' +
      'the range costs you almost nothing to add.',
    practice: [],
  },
  {
    id: 'ti.6.5',
    moduleId: 'ti.6',
    packageId: 'threat-intel-foundations',
    order: 5,
    title: 'Write the estimate',
    kind: 'short-answer',
    goal: 'State a probability and a confidence level, and justify the confidence on its own terms.',
    prompt:
      'Based on two independent, historically reliable sources reporting the same detail, and a ' +
      'short, direct chain of reasoning to the conclusion, write a one sentence estimate about ' +
      'whether an intrusion will recur within ninety days, using a standard probability phrase and an ' +
      'explicit confidence level, and say briefly why that confidence level fits.',
    teach: WEP_TEACH,
    hints: [
      'Pick the phrase whose range best matches a real, likely majority chance.',
      'State the confidence level explicitly, as its own separate word.',
      'Justify the confidence by naming the sourcing and the reasoning chain, not by how dramatic the outcome sounds.',
    ],
    solution:
      'It is likely, roughly 55 to 80 percent, that the intrusion recurs within ninety days, assessed ' +
      'with high confidence, because the judgement rests on two independent and historically reliable ' +
      'sources reporting the same detail and a short, direct chain of reasoning rather than a long ' +
      'inferential one. High confidence is appropriate here because it reflects the strength of the ' +
      'sourcing and reasoning behind the estimate, not how dramatic or certain the recurrence itself ' +
      'sounds.',
    expectedOutput:
      'An estimate using a standard probability phrase, a stated confidence level, and a ' +
      'justification based on sourcing and reasoning rather than the drama of the outcome.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['likely', 'probable', 'roughly', 'percent'],
          ['confidence'],
          ['independent', 'corroborat', 'reliable', 'reasoning', 'short chain'],
        ],
        hint: 'Use a standard probability phrase, name a confidence level, and justify it with sourcing and reasoning.',
      },
    ],
    debrief:
      'Notice that the confidence justification never mentions how likely the outcome is. That ' +
      'separation is the entire lesson of this module: one sentence states what you think will ' +
      'happen, the next explains why you trust yourself to say so.',
    practice: [],
  },
];

const ADMIRALTY_TEACH = {
  concept:
    'Imagine a witness who has testified in ten previous trials and been proven right in nine of ' +
    'them. That is a strong track record: reliability. Now imagine that same witness, this time, ' +
    'reports something no one else saw, and that contradicts what everyone else agrees happened. The ' +
    'witness good history does not automatically make this one claim true: credibility. The Admiralty ' +
    'system, also called the NATO system, grades two different things about a single piece of ' +
    'reporting on two separate scales, because conflating them, letting the witness track record ' +
    'decide whether to believe this one claim, is the single most common source evaluation mistake.\n\n' +
    'RELIABILITY OF THE SOURCE is graded A through F, based on the track record of that specific ' +
    'source over time: A is a source with a long history of accurate reporting, down through ' +
    'progressively less established histories, to F, a source whose reliability cannot be judged at ' +
    'all because there is no track record to judge. CREDIBILITY OF THE INFORMATION is graded 1 ' +
    'through 6, based on this specific piece of reporting rather than on the source in general: 1 ' +
    'means the information is confirmed by other independent sources, down through progressively ' +
    'less supported claims, to 6, information whose credibility cannot be judged.\n\n' +
    'A rating such as B2, a usually reliable source reporting probably true information, is normal ' +
    'and useful, because it communicates both halves without collapsing them into a single number. ' +
    'The reason to keep them apart is that a normally reliable source can still report something ' +
    'wrong, whether mistaken or deceived, and an untested or unreliable source can occasionally ' +
    'report something that turns out to be independently confirmed. Grading them together would hide ' +
    'exactly the case that matters most: a track record that does not match what is being claimed ' +
    'this time.',
} as const;

const MODULE_TI_7: Exercise[] = [
  {
    id: 'ti.7.1',
    moduleId: 'ti.7',
    packageId: 'threat-intel-foundations',
    order: 1,
    title: 'What the two scales actually measure',
    kind: 'multiple-choice',
    goal: 'Fix what the reliability and credibility scales each grade.',
    prompt: 'Which of the following correctly describe the Admiralty system? Select all that apply.',
    teach: ADMIRALTY_TEACH,
    options: [
      { id: 'a', label: 'Reliability, graded A through F, describes the track record of the source itself.' },
      { id: 'b', label: 'Credibility, graded 1 through 6, describes this specific piece of reported information.' },
      { id: 'c', label: 'The two scales are reported together, such as B2, without collapsing into one combined score.' },
      { id: 'd', label: 'A source graded A is one whose claims never need to be checked again.' },
      { id: 'e', label: 'Grading them separately protects against a reliable source being wrong this one time, or an unreliable source being right this one time.' },
    ],
    hints: [
      'Four describe the system correctly. One treats a strong track record as a permanent exemption from checking.',
      'Does a long history of accuracy mean this particular claim is automatically true?',
      'The reliability grade describes the source in general. It never substitutes for checking the specific claim.',
    ],
    solution:
      'The correct answers are A, B, C, and E. Reliability and credibility are separate, deliberately ' +
      'kept apart, scales, reported together without merging into one number, precisely so a strong ' +
      'track record cannot substitute for checking this claim. D is wrong: an A rated source can still ' +
      'be wrong or deceived on a given occasion, which is exactly why the credibility scale exists as a ' +
      'separate check.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option treats a strong reliability grade as making further checking unnecessary?',
      },
    ],
    debrief:
      'A strong reliability grade earns a source a hearing. It does not earn any specific claim a ' +
      'pass, and remembering that distinction is most of what this scale is for.',
    practice: [],
  },
  {
    id: 'ti.7.2',
    moduleId: 'ti.7',
    packageId: 'threat-intel-foundations',
    order: 2,
    title: 'Grade the mismatch',
    kind: 'multiple-choice',
    goal: 'Keep a strong source rating from dragging a weak claim upward.',
    prompt:
      'A source with a long, accurate track record reports a detail that no other source has ' +
      'confirmed, and that conflicts with several established facts. Which of the following are sound ' +
      'ways to grade this? Select all that apply.',
    teach: {
      concept:
        'This scenario is exactly the case the two scale system was built to handle cleanly. Think of ' +
        'a normally honest friend who tells you something surprising that nobody else has mentioned: ' +
        'you do not stop trusting the friend in general, but you also do not accept this one surprising ' +
        'claim just because it came from someone you trust. A single combined score would force an ' +
        'uncomfortable compromise between two facts that are both true at once.\n\n' +
        'The source reliability rating does not change just because this one claim looks shaky: the ' +
        'track record is what it is, and can still sit at A or B. The credibility of this specific ' +
        'claim is a different question, and here it should be rated low, since it is uncorroborated ' +
        'and conflicts with what is otherwise established. A strong reliability rating on the source ' +
        'never automatically makes a specific claim credible, and the mismatch between the two, a ' +
        'reliable source making a poorly supported claim, is itself worth stating plainly rather than ' +
        'smoothing over.',
    },
    options: [
      { id: 'a', label: 'The source reliability can still be rated highly, such as A or B, because its track record has not changed.' },
      { id: 'b', label: 'The credibility of this specific claim should be rated low, since it is uncorroborated and conflicts with established facts.' },
      { id: 'c', label: 'A strong reliability rating on the source does not automatically make this particular claim credible.' },
      { id: 'd', label: 'Because the source is normally reliable, this claim should also be rated as highly credible.' },
      { id: 'e', label: 'The mismatch between a strong source rating and a weak information rating is itself worth flagging in the write up.' },
    ],
    hints: [
      'Four keep the two scales separate, as intended. One lets the strong scale drag the weak one upward.',
      'A track record earned over many reports does not automatically transfer to one new, uncorroborated claim.',
      'A high reliability grade and a low credibility grade can both be true about the same report at the same time.',
    ],
    solution:
      'The correct answers are A, B, C, and E. The source keeps its earned reliability rating, the ' +
      'claim earns its own low credibility rating on its own merits, and the gap between the two is ' +
      'worth stating rather than hiding. D is wrong: letting a strong reliability rating pull the ' +
      'credibility rating upward defeats the entire purpose of grading them separately.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option lets the reliability grade decide the credibility grade for it?',
      },
    ],
    debrief:
      'A reliable source making an unconfirmed claim is not a contradiction. It is the exact ' +
      'situation the two scale system exists to describe honestly, instead of forcing a single, ' +
      'misleading verdict.',
    practice: [],
  },
  {
    id: 'ti.7.3',
    moduleId: 'ti.7',
    packageId: 'threat-intel-foundations',
    order: 3,
    title: 'The mistake that collapses the two scales',
    kind: 'multiple-choice',
    goal: 'Recognise the ways analysts let one scale substitute for the other.',
    prompt: 'Which of the following describe genuine, common mistakes in source evaluation? Select all that apply.',
    teach: {
      concept:
        'Most source evaluation mistakes come from the same root cause: letting one scale quietly ' +
        'stand in for the other, instead of doing the separate work each one asks for, the same way it ' +
        'is tempting to let a person general reputation answer for one specific thing they just said.\n\n' +
        'Rating information as credible mainly because the analyst generally likes or trusts the ' +
        'source is one version of this. Letting a strong reliability history substitute for actually ' +
        'checking whether this specific claim is corroborated is another. Skipping the credibility ' +
        'scale entirely and reporting only how trustworthy the source is in general is a third. ' +
        'Assuming a grade earned on one report carries forward automatically to everything that ' +
        'source reports afterward is a fourth. None of these describe the correct practice of grading ' +
        'an unfamiliar source as unknown on reliability while still separately checking whether its ' +
        'specific claim is corroborated elsewhere, which is what the system actually asks for.',
    },
    options: [
      { id: 'a', label: 'Rating the information as credible mainly because the analyst likes or trusts the source in general.' },
      { id: 'b', label: 'Letting a strong reliability history substitute for actually checking whether this specific claim is corroborated.' },
      { id: 'c', label: 'Grading the reliability of an unfamiliar source as unknown, while still separately checking whether this specific claim is corroborated elsewhere.' },
      { id: 'd', label: 'Skipping the credibility scale entirely and reporting only how trustworthy the source generally is.' },
      { id: 'e', label: 'Assuming a grade earned on one report still applies automatically to everything that source reports afterward.' },
    ],
    hints: [
      'Four describe a genuine mistake. One describes the two scale system working exactly as intended.',
      'Grading a source unknown on reliability while still checking the claim separately is not a mistake, it is the method.',
      'The mistake is letting one scale substitute for the other. Doing both scales properly is not the mistake.',
    ],
    solution:
      'The correct answers are A, B, D, and E. Each of these lets one scale do the work of the other, ' +
      'whether by trusting a source in general, letting history stand in for corroboration, skipping a ' +
      'scale, or assuming a grade persists unexamined. C is wrong as an example of a mistake: grading ' +
      'an unfamiliar source as unknown while still separately checking whether this claim is ' +
      'corroborated is exactly the correct, two scale practice, not an error.',
    expectedOutput: 'Options A, B, D, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd', 'e'],
        hint: 'Which option actually describes the two scale system being applied correctly, rather than a mistake?',
      },
    ],
    debrief:
      'If you can name the mistake, you can usually see it happen inside your own analysis before it ' +
      'ships. Look for the point where one scale quietly did the work of the other, before a reader ' +
      'ever gets the chance to notice.',
    practice: [],
  },
  {
    id: 'ti.7.4',
    moduleId: 'ti.7',
    packageId: 'threat-intel-foundations',
    order: 4,
    title: 'Grade the anonymous claim',
    kind: 'multiple-choice',
    goal: 'Hold an uncorroborated claim at arm length without dismissing it outright.',
    prompt:
      'An anonymous forum post claims a named company was breached, with no source history and no ' +
      'other outlet reporting it yet. Which of the following are sound reasoning? Select all that ' +
      'apply.',
    teach: {
      concept:
        'An anonymous, unconfirmed claim is not automatically false, and it is not automatically ' +
        'worth reporting either, the same way a rumour overheard from a stranger is not automatically ' +
        'a lie, but is also not automatically worth repeating as fact. The two scale system gives a ' +
        'disciplined way to hold both possibilities at once without rushing to either conclusion.\n\n' +
        'The source reliability here is essentially unknown, since there is nothing to judge a track ' +
        'record against, and the credibility of the specific claim is low until something independent ' +
        'corroborates it. Both scales being low is a reason to keep investigating, not a reason to ' +
        'report the claim as established, and it is also not a reason to dismiss it outright: if the ' +
        'claim is later confirmed by the company itself or by another outlet, the credibility rating ' +
        'on this specific report can be revised upward without needing to revisit the reliability ' +
        'rating on the anonymous source at all.',
    },
    options: [
      { id: 'a', label: 'The source reliability is essentially unknown, since there is no track record to judge it against.' },
      { id: 'b', label: 'The credibility of the claim itself is low until it is corroborated by something independent.' },
      { id: 'c', label: 'Both scales being low is a reason to keep investigating, rather than to report the claim as established.' },
      { id: 'd', label: 'Because breach claims are often true, this one should be treated as credible immediately, to avoid being scooped.' },
      { id: 'e', label: 'If the claim is later confirmed by the company itself, the credibility rating on this specific report can be revised upward.' },
    ],
    hints: [
      'Four hold the claim at arm length until it earns corroboration. One rushes ahead of the evidence for reasons that have nothing to do with the evidence.',
      'Being scooped is a business pressure, not a source evaluation input.',
      'Low reliability and low credibility both point the same way: verify further before reporting this as fact.',
    ],
    solution:
      'The correct answers are A, B, C, and E. An anonymous source with no track record earns an ' +
      'unknown reliability grade, the specific claim earns a low credibility grade until corroborated, ' +
      'and that grade can move once corroboration appears, all without rushing the conclusion. D is ' +
      'wrong: the pressure to avoid being scooped is not evidence, and treating a claim as credible to ' +
      'beat a competitor is exactly the shortcut the two scale system is built to prevent.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option lets competitive pressure substitute for actual corroboration?',
      },
    ],
    debrief:
      'The grade you assign here is not a verdict on whether the breach happened. It is an honest ' +
      'statement of how much you currently know, which is not the same thing, and confusing the two is ' +
      'how a rumour turns into a headline nobody can walk back.',
    practice: [],
  },
  {
    id: 'ti.7.5',
    moduleId: 'ti.7',
    packageId: 'threat-intel-foundations',
    order: 5,
    title: 'Grade the source yourself',
    kind: 'short-answer',
    goal: 'Produce an Admiralty style grading and justify each half separately.',
    prompt:
      'A contact who has been accurate roughly half the time in the past reports that a specific ' +
      'ransomware group has stopped operating. No other source has said this. In two or three ' +
      'sentences, give a reasonable Admiralty style grading for reliability and credibility, and ' +
      'justify each half separately.',
    teach: ADMIRALTY_TEACH,
    hints: [
      'A roughly even track record sits in the middle of the reliability scale, not at the top or the bottom.',
      'An uncorroborated claim, however plausible, sits low on the credibility scale until something else confirms it.',
      'Justify each grade using only the evidence that belongs to that scale: history for reliability, corroboration for credibility.',
    ],
    solution:
      'I would grade the source reliability around C, usually not reliable, given a roughly even ' +
      'track record of being right in the past, and I would grade the credibility of this specific ' +
      'claim low, around 4 or 5, possibly or doubtfully true, because it is uncorroborated by ' +
      'anything else. The two are justified separately: the reliability grade reflects the contact ' +
      'history over time, while the credibility grade reflects only whether this one claim about the ' +
      'group stopping is independently supported, which right now it is not.',
    expectedOutput:
      'A grading naming a middling reliability level and a low credibility level, with each justified ' +
      'on its own separate grounds.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['reliab', 'track record', 'history', 'usually not reliable'],
          ['credib', 'uncorroborat', 'not confirmed', 'unconfirmed', 'possibly true', 'doubtfully true'],
          ['separate', 'own merit', 'independent', 'justified separately'],
        ],
        hint: 'Grade reliability from the contact history, grade credibility from corroboration, and justify each on its own terms.',
      },
    ],
    debrief:
      'A roughly even track record is a real, common grade. Do not round it up to reliable just ' +
      'because the contact is someone you know personally, since the scale exists precisely to keep ' +
      'personal warmth from becoming a shortcut around actual evidence.',
    practice: [],
  },
];

const TLP_TEACH = {
  concept:
    'Imagine telling a friend something in confidence and saying you can repeat this to your spouse, ' +
    'but nobody else. That instruction needs to travel with the information itself: if your friend ' +
    'forgets it and repeats it to a stranger, the trust between you is broken, and you will think ' +
    'twice before confiding in them again. Sharing intelligence between organisations only works on ' +
    'the same principle: everyone has to trust that a marking on the information will be respected, ' +
    'because the alternative is a constant, private risk calculation before every exchange, and most ' +
    'people share less under that condition, not more.\n\n' +
    'The Traffic Light Protocol lets a sender state how far information may travel, and the marking ' +
    'moves with the information wherever it goes. TLP:RED means the information stays with the ' +
    'people in the room, and goes no further under any circumstance. TLP:AMBER allows sharing within ' +
    'the recipient organisation and its clients, strictly on a need to know basis, while ' +
    'TLP:AMBER+STRICT narrows that further to the recipient organisation only, with no onward sharing ' +
    'to clients at all. TLP:GREEN allows sharing within the community and partner organisations, but ' +
    'not publication. TLP:CLEAR, formerly called WHITE, carries no restriction and is safe for public ' +
    'release.\n\n' +
    'The sender chooses the marking, not the recipient, and a recipient who strips it or shares ' +
    'beyond what it allows has broken the agreement that made the sender willing to share the next ' +
    'thing at all.',
} as const;

const BLUF_TEACH = {
  concept:
    'Think about how a newspaper article is written: the headline and the first paragraph give you ' +
    'the whole story, who, what, and when, and the rest of the article, several paragraphs down, ' +
    'fills in the background and supporting detail. Almost nobody reads a news article expecting to ' +
    'find out what actually happened only in the final paragraph, and a report written like a mystery ' +
    'novel, saving the point for the end, fights against how a busy reader actually reads. BLUF stands ' +
    'for bottom line up front, and it changes the shape of a report rather than its content: the ' +
    'conclusion and the recommended action lead the document, with the narrative that built up to ' +
    'them placed afterward as supporting detail.\n\n' +
    'A decision maker reading under time pressure needs the decision relevant part first, because a ' +
    'chronological account that reaches its point on the last page forces every reader to get there ' +
    'before extracting any value, and many will not finish it in time to act. An actionable report ' +
    'names a specific recommended action, a named owner responsible for it, and a timeframe by which ' +
    'it should happen. A merely descriptive report states what happened without saying what should ' +
    'happen next, which leaves the reader to do that translation themselves, and that translation was ' +
    'supposed to be the job the report did for them.',
} as const;

const MODULE_TI_8: Exercise[] = [
  {
    id: 'ti.8.1',
    moduleId: 'ti.8',
    packageId: 'threat-intel-foundations',
    order: 1,
    title: 'What each TLP marking permits',
    kind: 'multiple-choice',
    goal: 'Learn what each Traffic Light Protocol marking actually allows.',
    prompt: 'Which of the following correctly describe what a Traffic Light Protocol marking permits? Select all that apply.',
    teach: TLP_TEACH,
    options: [
      { id: 'a', label: 'TLP:RED means the information stays with the people in the room and goes no further.' },
      { id: 'b', label: 'TLP:AMBER allows sharing within the recipient organisation and its clients, on a need to know basis.' },
      { id: 'c', label: 'TLP:GREEN allows sharing within the community and partner organisations, but not public release.' },
      { id: 'd', label: 'TLP:CLEAR still needs sign off before it can be shared with anyone.' },
      { id: 'e', label: 'The sender chooses the marking, and it travels with the information wherever it is passed on.' },
    ],
    hints: [
      'Four describe a marking accurately. One adds a restriction to the one marking that carries none.',
      'CLEAR replaced the marking that used to be called WHITE. What did WHITE always mean?',
      'One of these five markings is the one built for information with no restriction at all.',
    ],
    solution:
      'The correct answers are A, B, C, and E. RED, AMBER, and GREEN each carry a real, distinct ' +
      'restriction, and the marking always travels with the information at the sender discretion. D ' +
      'is wrong: TLP:CLEAR is specifically the marking for information with no restriction at all, ' +
      'safe for public release without further sign off.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option adds a restriction to the marking that is defined as having none?',
      },
    ],
    debrief:
      'If you are ever unsure which marking to use, default to the more restrictive one and ask the ' +
      'sender. Loosening a marking later is easy. Recalling information already shared too widely is ' +
      'not, in the same way you cannot un-tell a secret once it has left the room.',
    practice: [],
  },
  {
    id: 'ti.8.2',
    moduleId: 'ti.8',
    packageId: 'threat-intel-foundations',
    order: 2,
    title: 'Choose the marking',
    kind: 'multiple-choice',
    goal: 'Match a TLP level to who genuinely needs to act on the information.',
    prompt:
      'You are writing up an internal incident with technical detail that would help a partner ' +
      'organisation defend itself, but would embarrass your organisation if it became public. Which ' +
      'of the following are sound reasoning about the marking? Select all that apply.',
    teach: TLP_TEACH,
    options: [
      { id: 'a', label: 'Sharing the technical detail with the partner under TLP:AMBER lets them act on it without it travelling further uninvited.' },
      { id: 'b', label: 'Marking it TLP:CLEAR would remove any control over where the sensitive detail ends up, including public release.' },
      { id: 'c', label: 'If the partner might need to pass a summary to its own clients, plain AMBER fits better than AMBER+STRICT, which would block that.' },
      { id: 'd', label: 'Marking sensitive detail TLP:RED is always the safest choice, regardless of whether the partner actually needs to act on it.' },
      { id: 'e', label: 'The choice of marking should reflect who genuinely needs to act on the information, not merely how sensitive it feels.' },
    ],
    hints: [
      'Four weigh the marking against who actually needs to use the information. One defaults to the most restrictive marking regardless of purpose.',
      'What happens to the partial value of this sharing if the partner cannot actually act on what you send them?',
      'RED is not automatically the safest choice if it prevents the sharing from doing the job it was meant to do.',
    ],
    solution:
      'The correct answers are A, B, C, and E. AMBER lets the partner act without the detail ' +
      'travelling further, CLEAR would remove control entirely, and the choice between AMBER and ' +
      'AMBER+STRICT should follow whether the partner needs to pass a summary onward. D is wrong: ' +
      'marking everything RED by default can make the sharing pointless, since RED prevents the ' +
      'partner from acting on it at all, which defeats the reason for sharing in the first place.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option treats the most restrictive marking as always correct, regardless of whether the recipient can then act on it?',
      },
    ],
    debrief:
      'A marking that is too restrictive to be useful is not a safe choice, it is a wasted exchange. ' +
      'Match the marking to who needs to act, not to how nervous the content makes you, since nerves ' +
      'are not a source evaluation input any more than they are here.',
    practice: [],
  },
  {
    id: 'ti.8.3',
    moduleId: 'ti.8',
    packageId: 'threat-intel-foundations',
    order: 3,
    title: 'What bottom line up front changes',
    kind: 'multiple-choice',
    goal: 'Understand that BLUF reorders a report without cutting anything from it.',
    prompt: 'Which of the following correctly describe what writing bottom line up front changes about a report? Select all that apply.',
    teach: BLUF_TEACH,
    options: [
      { id: 'a', label: 'The conclusion and the recommended action appear first, before the narrative that led to them.' },
      { id: 'b', label: 'A reader under time pressure can get the decision relevant part without reading the whole document.' },
      { id: 'c', label: 'Supporting detail still belongs in the report, just below the bottom line rather than before it.' },
      { id: 'd', label: 'Writing the bottom line first means the supporting evidence can be left out entirely.' },
      { id: 'e', label: 'A chronological account that reaches its point on the last page forces every reader to read to the end to get any value.' },
    ],
    hints: [
      'Four describe a change in order. One mistakes reordering for deleting.',
      'Moving the conclusion to the front does not remove anything that came after it.',
      'The supporting detail still matters. It just no longer has to be read first to be useful.',
    ],
    solution:
      'The correct answers are A, B, C, and E. Bottom line up front reorders a report so the decision ' +
      'relevant part comes first, while the supporting narrative still follows underneath for whoever ' +
      'needs it. D is wrong: the technique changes the order of a report, not its completeness, and a ' +
      'bottom line with no evidence behind it is not more actionable, it is just less trustworthy.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option confuses moving the conclusion to the front with removing everything else?',
      },
    ],
    debrief:
      'A good bottom line up front report loses nothing, it just stops making the reader earn the ' +
      'conclusion by reading to the end first, the way a newspaper never makes you earn the headline.',
    practice: [],
  },
  {
    id: 'ti.8.4',
    moduleId: 'ti.8',
    packageId: 'threat-intel-foundations',
    order: 4,
    title: 'Actionable or merely descriptive',
    kind: 'multiple-choice',
    goal: 'Tell a report that hands over a decision apart from one that only hands over facts.',
    prompt: 'Which of the following features make a report actionable rather than merely descriptive? Select all that apply.',
    teach: {
      concept:
        'A descriptive report and an actionable one can describe the exact same incident and still ' +
        'leave a reader in completely different positions, the way a car mechanic could either hand ' +
        'you a full diagnostic printout or simply say replace the brake pads by Friday, or you will be ' +
        'stranded. Both are honest. Only one tells you what to do. The difference is not in what ' +
        'happened, it is in what the reader is told to do about it.\n\n' +
        'An actionable report states a specific recommended action, rather than a general call for ' +
        'something to be done, names an owner responsible for carrying it out, and attaches a ' +
        'timeframe by which it should happen. A merely descriptive report can be accurate and ' +
        'thorough and still fail the reader, because it hands over everything that was seen and ' +
        'leaves the translation into a decision entirely up to them, which was meant to be the ' +
        'analytic work the report itself did.',
    },
    options: [
      { id: 'a', label: 'A specific recommended action, rather than a general statement that something should be done.' },
      { id: 'b', label: 'A named owner responsible for taking the action.' },
      { id: 'c', label: 'A timeframe by which the action should happen.' },
      { id: 'd', label: 'A complete chronological account of every step the investigation took to reach its conclusion.' },
      { id: 'e', label: 'A stated bottom line that a reader could act on without needing to ask a follow up question first.' },
    ],
    hints: [
      'Four are features of an actionable report. One is a feature of a thorough report, which is not the same thing.',
      'A report can include every step of the investigation and still leave the reader with no idea what to do next.',
      'Actionable means the reader can move without a follow up question. Thorough only means nothing was left out.',
    ],
    solution:
      'The correct answers are A, B, C, and E. A specific action, a named owner, a timeframe, and a ' +
      'bottom line the reader can move on without further questions are what make a report actionable. ' +
      'D is wrong: completeness of the chronological account is a measure of thoroughness, not of ' +
      'whether the reader knows what to do next, and a report can have both, or neither, independently.',
    expectedOutput: 'Options A, B, C, and E selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'e'],
        hint: 'Which option describes thoroughness rather than actionability?',
      },
    ],
    debrief:
      'Before sending a report, ask whether a reader could act on it without a follow up question. If ' +
      'the answer is no, it is still descriptive, however complete it is, and completeness was never ' +
      'the thing that was missing.',
    practice: [],
  },
  {
    id: 'ti.8.5',
    moduleId: 'ti.8',
    packageId: 'threat-intel-foundations',
    order: 5,
    title: 'Turn the narrative into a bottom line',
    kind: 'short-answer',
    goal: 'Apply both the ordering habit and the sharing marking to one report.',
    prompt:
      'You have a five paragraph chronological account of an incident that ends with a recommendation ' +
      'buried in the last sentence. In two or three sentences, say what you would put first, and what ' +
      'TLP marking you would consider if the report contains client names that only your leadership ' +
      'team should see.',
    teach: {
      concept:
        'The two habits in this module meet at exactly this point: a report is only as useful as the ' +
        'speed at which the right reader can find the decision in it, and only as safe as the marking ' +
        'that controls where it can travel once it leaves your hands. Getting one right and the other ' +
        'wrong still leaves you with a failed report, either unread or unsafe.\n\n' +
        'Fixing the order means moving the recommendation, with a named action, an owner, and a ' +
        'timeframe, to the very first sentence, and keeping the five paragraph narrative underneath as ' +
        'supporting detail rather than deleting it. Fixing the marking means naming who genuinely ' +
        'needs to see the client names inside it: if that circle is the leadership team and nobody ' +
        'outside it, TLP:AMBER or, if it must not reach the wider organisation at all, ' +
        'TLP:AMBER+STRICT is the marking that matches that circle, not a looser one chosen out of ' +
        'convenience.',
    },
    hints: [
      'Put the recommendation, with an action, an owner, and a timeframe, in the first sentence.',
      'Keep the narrative, just move it below the bottom line rather than deleting it.',
      'Match the TLP marking to exactly who needs to see the client names, no wider.',
    ],
    solution:
      'I would move the recommendation and its bottom line to the very first sentence, naming the ' +
      'specific action, an owner, and a timeframe, so a reader gets the decision relevant part before ' +
      'anything else, with the five paragraph narrative kept below as supporting detail for whoever ' +
      'needs it. Since the report contains client names meant only for the leadership team, I would ' +
      'mark it TLP:AMBER or, if it should not even reach the wider organisation, TLP:AMBER+STRICT, ' +
      'rather than a marking that would let it travel further.',
    expectedOutput:
      'An answer moving the recommendation to the first sentence with an action, owner, and ' +
      'timeframe, and choosing a TLP marking restricted to the leadership team.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['bottom line', 'recommendation first', 'first sentence', 'action', 'owner', 'timeframe'],
          ['amber', 'strict', 'restrict', 'leadership', 'need to know'],
          ['narrative', 'supporting detail', 'below', 'keep'],
        ],
        hint: 'Say what moves to the first sentence, and name a TLP marking that matches who should see the client names.',
      },
    ],
    debrief:
      'Both fixes here are about respecting the reader: the order respects their time, and the ' +
      'marking respects the trust everyone downstream is placing in you not to let it travel further ' +
      'than intended. Neither habit costs much once it becomes automatic.',
    practice: [],
  },
];

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
            'The correct answer is A. Intelligence supplies context the raw incident lacks: whether ' +
            'the tradecraft has been seen before and what the actor is likely to do next. Reimaging ' +
            '(B), patching (C), and triage (D) are other jobs, each important in its own right, but ' +
            'none of them is what intelligence contributes.',
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
            'is happening here; intelligence asks who does this, and where it usually goes. Both ' +
            'questions matter, but they are not the same question, and mixing them up is how a ' +
            'response spends all its time on the fire in front of it and none on where the next one is ' +
            'coming from.',
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
            'The correct answer is B. The discipline is to report what the evidence actually supports, ' +
            'state your confidence honestly, and keep the uncertainty visible. Naming a group on a ' +
            'loose overlap (A or D) is exactly the confident wrong attribution that misdirects a ' +
            'response, and total silence (C) is not useful either, since the executive still needs ' +
            'something to act on. Calibrated honesty is the job.',
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
            'Saying how sure you are is not weakness, it is the product, and it is the one thing a ' +
            'confident guess can never give the executive that honest uncertainty can.',
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
            'The correct answer is C. An address (A), a hash (B), and a domain (D) are all cheap ' +
            'indicators an attacker can swap in minutes. How they operate, their techniques and ' +
            'procedures, is tied to their tooling and habits and is expensive to change, so ' +
            'intelligence built on behaviour lasts while indicator lists go stale.',
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
            'treadmill; understanding tradecraft is leverage, and the rest of this package builds on ' +
            'exactly that distinction.',
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
            'The correct answer is A. Intelligence tells the hunter what an adversary tends to do, and ' +
            'the hunter operationalises that by searching the actual environment for those techniques. ' +
            'Intelligence does not replace the hunt (B), patch systems (C), or close alerts (D); it ' +
            'points the hunt at the right thing, which is a different job from doing the hunt itself.',
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
            'hunter supplies the go-and-look. A good intelligence report half-writes a hunt, leaving ' +
            'the hunter to do the part that actually requires being inside the environment.',
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
            'can change overnight. Both come down to being honest about what you actually know, versus ' +
            'what merely looks convenient to believe.',
          practice: [],
        },
      ],
    },
    {
      id: 'ti.2',
      packageId: 'threat-intel-foundations',
      order: 2,
      title: 'The intelligence cycle',
      summary: 'The six step intelligence cycle, from requirements through feedback, and what breaks when a step is skipped.',
      exercises: MODULE_TI_2,
    },
    {
      id: 'ti.3',
      packageId: 'threat-intel-foundations',
      order: 3,
      title: 'The pyramid of pain',
      summary: 'What each layer costs an attacker to change, what it costs a defender to detect there, and why indicators still have a job.',
      exercises: MODULE_TI_3,
    },
    {
      id: 'ti.4',
      packageId: 'threat-intel-foundations',
      order: 4,
      title: 'Strategic, operational, and tactical',
      summary: 'Matching the altitude of a product to who reads it and what they are deciding.',
      exercises: MODULE_TI_4,
    },
    {
      id: 'ti.5',
      packageId: 'threat-intel-foundations',
      order: 5,
      title: 'Structured analytic techniques',
      summary: 'Techniques for catching your own bias before a decision maker sees it: competing hypotheses, structured dissent, and a key assumptions check.',
      exercises: MODULE_TI_5,
    },
    {
      id: 'ti.6',
      packageId: 'threat-intel-foundations',
      order: 6,
      title: 'Estimative language and confidence',
      summary: 'Words of estimative probability and confidence levels: turning a guess into a stated range and a stated level of trust.',
      exercises: MODULE_TI_6,
    },
    {
      id: 'ti.7',
      packageId: 'threat-intel-foundations',
      order: 7,
      title: 'Source evaluation',
      summary: 'The Admiralty system: grading the reliability of a source separately from the credibility of what it says.',
      exercises: MODULE_TI_7,
    },
    {
      id: 'ti.8',
      packageId: 'threat-intel-foundations',
      order: 8,
      title: 'Sharing and writing for a decision maker',
      summary: 'Sharing without burning sources with the Traffic Light Protocol, and writing a report with the decision up front.',
      exercises: MODULE_TI_8,
    },
  ],
};
