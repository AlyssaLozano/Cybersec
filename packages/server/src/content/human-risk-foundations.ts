/**
 * Security Awareness and Human Risk Foundations.
 *
 * WHY THIS PACKAGE TAKES A POSITION
 *
 * Most security awareness material is bad, and everybody in the field knows it:
 * an annual compliance module, a phishing simulation used punitively, and a
 * click rate reported to a board that has no idea what it means. The people who
 * do this work well are the ones who stopped treating it as an education problem
 * and started treating it as a behaviour and design problem.
 *
 * So this package argues a case rather than surveying the field. Its through
 * line is that people are not the weakest link, they are the most heavily
 * relied-upon control, usually the least invested in, and frequently blamed for
 * failures that were designed into the system they were handed. Where that
 * framing conflicts with traditional awareness practice, the package takes the
 * behavioural side and says so.
 *
 * WHO IT IS FOR
 *
 * The awareness track draws people from communications, learning and
 * development, HR and psychology as often as from IT, and that is a strength
 * rather than a compromise. Somebody who can write, run a campaign and read an
 * engagement metric has most of the scarce skill already. What they need is the
 * security content and the measurement discipline, which is what this teaches.
 *
 * WHY IT NEEDS NO TERMINAL
 *
 * Nothing here is a technical exercise, and pretending otherwise would misplace
 * the discipline. Every exercise grades a judgement: what to measure, what to
 * say, when to stop blaming a user, and how to argue for a design change rather
 * than another training module.
 */

import type { Exercise, LearningPackage } from '@soc/shared';

// --- shared teaching material ------------------------------------------------

const BEHAVIOUR_TEACH = {
  concept:
    'Start with what this whole package is reacting against. "Security awareness training" is the ' +
    'umbrella name for anything an organisation does to get employees to behave more safely online: ' +
    'a video about spotting fake emails, a poster about not reusing passwords, a yearly quiz nearly ' +
    'everyone clicks through without reading. The unstated theory behind almost all of it is that ' +
    'people behave insecurely because they do not know better, and that telling them the rules again ' +
    'will fix it.\n\n' +
    'That theory is wrong, and it is worth being precise about why, because it is a mistake you will ' +
    'see repeatedly in this field: it treats a BEHAVIOUR problem as a KNOWLEDGE problem. Almost ' +
    'everybody already knows, in the abstract, that they should not reuse the same password ' +
    'everywhere and should be careful opening an attachment (a file sent along with an email) from ' +
    'somebody they do not recognise. Telling them again changes nothing, because the gap between ' +
    'what they know and what they do was never about missing information in the first place.\n\n' +
    'What actually drives behaviour is the SITUATION a person is in at the exact moment of the ' +
    'decision: how much attention they have left, how much extra effort the safe choice costs ' +
    'compared with the easy one (that extra effort is what this package will keep calling FRICTION), ' +
    'what the people around them appear to do, and whether the unsafe option is the one that actually ' +
    'gets the work finished on time. Picture somebody who clicks a convincing fake invoice at 16:50 ' +
    'on a Friday, racing to clear their inbox before the weekend. That person is not uninformed. They ' +
    'are busy and under a deadline, and no amount of earlier training alters the conditions that ' +
    'produced the click, because the click was never a knowledge failure to begin with.\n\n' +
    'So the interventions that actually work are usually not education at all. They reduce the number ' +
    'of decisions people have to make, make the safe path the easy one, design systems that fail ' +
    'safely when somebody does get it wrong, and save direct communication for the small number of ' +
    'moments that genuinely need a human being to exercise judgement. Training still has a place in ' +
    'that mix, it is just a much smaller place than the industry that sells training courses would ' +
    'like you to believe.',
} as const;

const REPORTING_TEACH = {
  concept:
    'Before the metric, the attack behind it. PHISHING is an email, text or chat message that ' +
    'pretends to come from somebody trustworthy, a bank, a colleague, the IT department, in order to ' +
    'trick the reader into doing something harmful: typing a password into a fake login page, ' +
    'opening a file that installs malicious software, or approving a payment to the wrong account. ' +
    'The fake message itself is called a LURE, and whether somebody falls for it is usually ' +
    'described as a CLICK, because the decisive action is almost always clicking a link or opening ' +
    'an attachment.\n\n' +
    'With that in place: if you measure one thing in this discipline, measure REPORTING rather than ' +
    'clicking.\n\n' +
    'A click is one person having a bad moment. Some proportion of clicks is inevitable in any group ' +
    'of people against a lure that is well made, no matter how well trained they are, in the same ' +
    'way no smoke detector catches every fire the instant it starts. A REPORT, meaning somebody ' +
    'flags the message to the security team as suspicious, is the organisation finding out that an ' +
    'attack is under way at all, and finding out quickly is the only thing that shortens the gap ' +
    'between the attack landing and somebody doing something about it. Ten people clicking a bad ' +
    'link, with one of them reporting it within two minutes, is a far better outcome than nobody ' +
    'clicking and nobody reporting, because the second case tells the security team nothing and buys ' +
    'them no time.\n\n' +
    'The number that follows from this is TIME TO FIRST REPORT: how long between the phishing ' +
    'message arriving and the first person telling security about it. This is the number that ' +
    'actually changes what the security team can do. A report at four minutes means the message can ' +
    'potentially be pulled from every other mailbox before most people have even opened it; a report ' +
    'at four hours means there is nothing left to do but clean up the damage.\n\n' +
    'Now consider what happens if the team instead treats CLICK RATE, the percentage of people who ' +
    'fell for it, as its main success measure. It quietly rewards the opposite of what you want: a ' +
    'report is evidence that somebody nearly clicked, so a workforce that has learned reporting ' +
    'draws attention to near misses will report less, not more, to keep the number looking good. It ' +
    'also pushes the team toward easier, less realistic lures that produce a flattering low click ' +
    'rate but teach nothing useful. Measuring reporting instead rewards exactly the behaviour you ' +
    'actually want people to build.',
} as const;

// --- Module hrf.1: why awareness training fails ------------------------------

const MODULE_HRF_1: Exercise[] = [
  {
    id: 'hrf.1.1',
    moduleId: 'hrf.1',
    packageId: 'human-risk-foundations',
    order: 1,
    title: 'Knowing and doing are different problems',
    kind: 'multiple-choice',
    goal: 'Diagnose why more training rarely changes behaviour.',
    prompt:
      'An organisation runs annual security training and its phishing results do not improve. ' +
      'Which of the following explain it? Select all that apply.',
    teach: BEHAVIOUR_TEACH,
    options: [
      { id: 'a', label: 'Most people already know the rules, so more information does not close the gap.' },
      { id: 'b', label: 'Behaviour is driven by attention, friction and social norms at the moment of the decision.' },
      { id: 'c', label: 'Annual training is remote from the moment it is meant to influence.' },
      { id: 'd', label: 'If the insecure path is the one that gets the work done, people will take it.' },
      { id: 'e', label: 'The training content is not detailed enough, and a longer module would help.' },
    ],
    hints: [
      'Four explain it. One proposes more of the thing that is not working.',
      'Ask whether the person who clicked did not know, or was not thinking about it at that second.',
      'How long after the training does the decision actually happen?',
    ],
    solution:
      'A, B, C, and D. Knowledge is largely present, the situation drives the behaviour, annual ' +
      'timing is remote from the moment, and friction decides. E is the response the industry ' +
      'defaults to and it has been tested repeatedly: longer and more detailed modules do not ' +
      'improve behaviour, they improve completion statistics and resentment. If the mechanism is ' +
      'not ignorance, adding information cannot be the fix.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option proposes more and longer training, which is the thing that has already ' +
          'failed.',
      },
    ],
    debrief:
      'This is the argument you will make most often and the one that meets most resistance, ' +
      'because the annual module is what the organisation has always bought. Bring the mechanism, ' +
      'not the opinion.',
    practice: [],
  },
  {
    id: 'hrf.1.2',
    moduleId: 'hrf.1',
    packageId: 'human-risk-foundations',
    order: 2,
    title: 'What compliance training is actually for',
    kind: 'multiple-choice',
    goal: 'Be honest about the purpose of the module you are asked to run.',
    prompt:
      'You are asked to deliver mandatory annual security training with a 100% completion target. ' +
      'Which of the following are accurate? Select all that apply.',
    teach: {
      concept:
        'Mandatory annual training exists for reasons, and being clear-eyed about which ones stops ' +
        'you fighting a battle that does not need fighting.\n\n' +
        'Its real purpose is mostly EVIDENTIARY, meaning it exists to prove to somebody outside the ' +
        'organisation that a thing happened. A regulator (a government body with the power to set ' +
        'and enforce rules for an industry), an insurer who wants proof of basic precautions before ' +
        'paying out on a claim, a customer questionnaire, or a security certification the company ' +
        'holds, any of these can require that staff "were trained", and a record of who completed ' +
        'the module is the evidence that satisfies the requirement. It works the way a fire drill ' +
        'sign-in sheet works: the drill itself may or may not make anybody safer, but the sheet is ' +
        'what proves to an inspector that the building ran one. That evidentiary function is a ' +
        'legitimate organisational need, and it is not a behaviour change programme, whatever it is ' +
        'called on the slide.\n\n' +
        'It does a couple of useful things beyond that. It establishes a baseline of shared ' +
        'vocabulary, so that a later message about a specific threat has something to attach to. ' +
        'And it is the one moment the organisation formally states what it expects, which matters ' +
        'if anybody ever has to be held to it.\n\n' +
        'What it does not do is change what somebody does at 16:50 on a Friday. So the productive ' +
        'position is not to fight it: deliver it, keep it short and inoffensive, get the completion ' +
        'evidence, and spend your actual effort elsewhere. Teams that try to make the annual module ' +
        'carry the whole behaviour programme end up with a longer module and the same incidents.',
    },
    options: [
      { id: 'a', label: 'Its primary function is usually evidentiary: proving to a third party that training happened.' },
      { id: 'b', label: 'It establishes shared vocabulary that later, more specific messages can attach to.' },
      { id: 'c', label: 'It is the moment the organisation formally states what it expects.' },
      { id: 'd', label: 'The productive response is to deliver it efficiently and spend real effort elsewhere.' },
      { id: 'e', label: 'It should be refused, since it does not change behaviour and wastes everybody time.' },
    ],
    hints: [
      'Four are accurate. One picks a fight that cannot be won and does not need to be.',
      'Who asked for this, and what do they need from it?',
      'What happens to your credibility if you refuse a contractual obligation?',
    ],
    solution:
      'A, B, C, and D. Evidence, vocabulary, expectation-setting, and a pragmatic response. E is ' +
      'the position that ends careers in this field: the training is frequently contractual or ' +
      'regulatory, refusing it puts certifications and customer relationships at risk, and the ' +
      'person who refuses on principle is replaced by somebody who will run it and has no view ' +
      'about anything else. Run it well, cheaply, and then argue for the work that changes ' +
      'outcomes.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option refuses to deliver training that is frequently a contractual or regulatory ' +
          'requirement.',
      },
    ],
    debrief:
      'Getting this right buys you everything else. Deliver the compliance obligation without ' +
      'complaint and you have the standing to argue that it is not the programme.',
    practice: [],
  },
  {
    id: 'hrf.1.3',
    moduleId: 'hrf.1',
    packageId: 'human-risk-foundations',
    order: 3,
    title: 'The weakest link framing',
    kind: 'multiple-choice',
    goal: 'Understand why blaming users produces worse security.',
    prompt:
      'A security team describes people as the weakest link. Which of the following are ' +
      'consequences of that framing? Select all that apply.',
    teach: {
      concept:
        '"The weakest link" is a phrase people in security use to mean that, out of every defence an ' +
        'organisation has, its own employees are the easiest one for an attacker to break through. ' +
        'It is common, and it is actively harmful, in ways worth naming precisely rather than ' +
        'dismissing as just an unfortunate turn of phrase.\n\n' +
        'It SUPPRESSES REPORTING, which is the outcome you care about most (the previous exercise ' +
        'covered why reporting matters more than clicking). Somebody who believes they will be ' +
        'treated as the problem will not report the thing they just clicked, and the delay between ' +
        'the click and the report is where the entire cost of an incident accumulates: the longer an ' +
        'attacker has unnoticed access to an account or a system, the more damage they can do before ' +
        'anybody stops them.\n\n' +
        'It also LOCATES THE FAULT in the person rather than the system, which stops the useful ' +
        'question from being asked. If a single click by one person is enough to compromise (break ' +
        'into and gain unauthorised control of) the whole organisation, the real finding is about the ' +
        'architecture, meaning how the systems and permissions were built, not about that one ' +
        'person. A building where one dropped match burns the whole block has a fire-safety design ' +
        'problem, not just a careless match-dropper.\n\n' +
        'It also ignores that people are frequently the DETECTION, spotting things no automated ' +
        'control caught, and it damages the relationship with the rest of the business that the ' +
        'awareness function depends on entirely to do its job.\n\n' +
        'The replacement framing is not flattery. It is that people are a heavily relied-upon ' +
        'control, usually under-supported, and the job is to support them and reduce how much weight ' +
        'rests on any one person alone.',
    },
    options: [
      { id: 'a', label: 'It suppresses reporting, because people expect to be blamed for what they report.' },
      { id: 'b', label: 'It stops the systemic question being asked about why one click is so consequential.' },
      { id: 'c', label: 'It ignores that people frequently detect what technical controls missed.' },
      { id: 'd', label: 'It damages the relationship the awareness function depends on to do anything.' },
      { id: 'e', label: 'It is a fair description, since most breaches do involve a human action somewhere.' },
    ],
    hints: [
      'Four are consequences. One defends the framing on a technicality.',
      'What does somebody do after clicking, if they expect to be blamed?',
      'Most breaches involve electricity too. Does that make electricity the weakest link?',
    ],
    solution:
      'A, B, C, and D. Suppressed reporting, misplaced fault, ignored detection value, and a ' +
      'damaged relationship. E is technically true and analytically useless: human involvement is ' +
      'present in almost every incident because humans use every system, and inferring blame from ' +
      'presence would equally indict email, laptops and electricity. The useful question is never ' +
      'whether a person was involved, it is why their mistake was allowed to matter so much.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option defends the framing on the grounds that humans are involved in most breaches.',
      },
    ],
    debrief:
      'Ban the phrase in your own team first. It leaks into how people are spoken to, and the ' +
      'reporting rate is the thing that suffers.',
    practice: [],
  },
  {
    id: 'hrf.1.4',
    moduleId: 'hrf.1',
    packageId: 'human-risk-foundations',
    order: 4,
    title: 'When a person is genuinely the control',
    kind: 'multiple-choice',
    goal: 'Identify the decisions that cannot be automated away.',
    prompt:
      'Which of the following genuinely depend on a person making a judgement, rather than on a ' +
      'control that could be built? Select all that apply.',
    teach: {
      concept:
        'The argument that most awareness problems are design problems can be taken too far. Some ' +
        'decisions genuinely rest with a person, and those are where communication effort should ' +
        'concentrate.\n\n' +
        'They share a shape: a legitimate-looking request that is unusual in a way only somebody ' +
        'with context would notice. A finance clerk asked by an apparently senior colleague to ' +
        'change bank details urgently. Somebody at a door holding boxes and hoping to be let ' +
        'through. A caller who knows enough internal detail to sound plausible asking for a ' +
        'password reset. An employee deciding whether a dataset can go into an external tool.\n\n' +
        'What these have in common is that no filter can adjudicate them, because the message is ' +
        'genuine-looking, the person is physically present, or the judgement depends on business ' +
        'context. Technology helps at the margins and the decision remains human.\n\n' +
        'By contrast, consider three decisions that look similar but are not. Whether a MACRO should ' +
        'run (a macro is a small piece of automated code embedded inside a document, such as a Word ' +
        'or Excel file, and attackers routinely hide malicious code inside one, hoping a person will ' +
        'click "enable"). Whether a password meets a length-and-complexity policy. Whether a KNOWN-' +
        'BAD DOMAIN should resolve, meaning whether a web address already identified as malicious ' +
        'should even be allowed to load. None of those three should ever reach a person at all: a ' +
        'computer can check them instantly and consistently, with no bad day and no deadline pressure ' +
        'involved. Every one of those you push back into technology frees up attention for the ' +
        'decisions that genuinely cannot be automated away.',
    },
    options: [
      { id: 'a', label: 'A finance clerk deciding whether an urgent request to change bank details is genuine.' },
      { id: 'b', label: 'Somebody deciding whether to let a stranger carrying boxes through a secure door.' },
      { id: 'c', label: 'A help desk agent deciding whether a plausible caller is who they claim to be.' },
      { id: 'd', label: 'An employee deciding whether a dataset is appropriate to put into an external tool.' },
      { id: 'e', label: 'A user deciding whether to enable macros in a document from outside the organisation.' },
    ],
    hints: [
      'Four genuinely need a person. One is a decision that should be taken away from them.',
      'Which of these could a policy setting simply decide, permanently, for everybody?',
      'Ask what a filter can and cannot adjudicate.',
    ],
    solution:
      'A, B, C, and D. Each turns on context or physical presence that no control can evaluate. E ' +
      'is the one to remove: whether macros run in documents from outside the organisation is a ' +
      'policy decision that should be made once, centrally, and never presented to a user as a ' +
      'question. Every decision you take off people is attention returned to the four that ' +
      'genuinely need them.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option asks a user to make a decision that should be settled centrally by policy.',
      },
    ],
    debrief:
      'This is the audit worth doing on your own programme: list every decision you are asking ' +
      'people to make, and move the ones a machine should own. What is left is your actual ' +
      'curriculum.',
    practice: [],
  },
  {
    id: 'hrf.1.5',
    moduleId: 'hrf.1',
    packageId: 'human-risk-foundations',
    order: 5,
    title: 'Reframe an incident away from the user',
    kind: 'short-answer',
    goal: 'Write up a human-involved incident without making a person the finding.',
    prompt:
      'An employee clicked a phishing link, entered their password, and approved an MFA prompt. ' +
      'The account was used to send further phishing internally. In three or four sentences, write ' +
      'the human-factors part of the incident review.',
    teach: {
      concept:
        'First, the mechanics behind the scenario. Logging in usually asks for two things in ' +
        'sequence: a password (something you know), and increasingly a second check called MFA, ' +
        'short for multi-factor authentication, which is usually an approval prompt sent to your ' +
        'phone (something you have). The idea is that a stolen password alone should not be enough ' +
        'to get in. A PHISHING-RESISTANT factor is a stronger version of that second check, such as a ' +
        'physical security key you plug in or tap, which is built so it cannot be tricked into ' +
        'approving a login on a fake site the way a simple "tap approve" prompt can. A COMPROMISED ' +
        'MAILBOX is an email account an attacker has taken over and can now send from as if they were ' +
        'the real owner.\n\n' +
        'With that in mind: the review you write will be read by the person involved and by their ' +
        'colleagues, and what it says determines whether the next person reports faster or more ' +
        'slowly. That is a security outcome, not a courtesy.\n\n' +
        'Describe the BEHAVIOUR and the CONDITIONS without adjectives about the person: what the ' +
        'message looked like, what made it plausible, what else was happening. Then ask the ' +
        'systemic questions. Why did a password plus one approval tap grant full access, when a ' +
        'phishing-resistant factor would have refused to release anything to a fake site regardless ' +
        'of what the user did? What did the account reach once entered? Was there a fast way to ' +
        'report, and was it used?\n\n' +
        'Then say what changes, and make the changes structural. Phishing-resistant authentication ' +
        'on that population, a reporting button that takes one click, detection built to notice ' +
        'internal phishing coming from a mailbox the organisation already owns. None of those depend ' +
        'on anybody being more careful next time.\n\n' +
        'A good answer avoids blaming the individual, asks why the click was so consequential, and ' +
        'proposes a systemic control rather than more training.',
    },
    hints: [
      'The person will read this. What does it do to the next person deciding whether to report?',
      'The interesting question is not why they clicked. It is why clicking was enough.',
      'A good answer describes the conditions without blaming the person, asks why a single click had that much consequence, and proposes a structural control rather than more training.',
    ],
    solution:
      'The message arrived during a busy period, referenced a real internal process, and asked for ' +
      'an action the employee performs legitimately several times a week, so it presented as ' +
      'routine rather than as a decision point. The more useful question is not why it was ' +
      'clicked but why clicking was sufficient: a password and a push approval were enough to ' +
      'grant full access to the mailbox, and a phishing-resistant factor would have refused to ' +
      'release anything to the attacker site regardless of what the user did. I would also note ' +
      'that the compromise was discovered by a colleague rather than by any control, which points ' +
      'at internal phishing detection as a gap. The changes I would recommend are ' +
      'phishing-resistant authentication for this population and a one-click reporting route, ' +
      'neither of which depends on anybody being more careful next time.',
    expectedOutput:
      'A write-up describing the conditions without blaming the person, asking why the click was ' +
      'sufficient, and proposing structural controls rather than further training.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['busy', 'routine', 'plausible', 'real internal process', 'conditions', 'presented as'],
          ['why clicking was', 'why it was enough', 'sufficient', 'grant full access', 'so consequential'],
          ['phishing-resistant', 'structural', 'reporting', 'detection', 'not depend on', 'rather than training'],
        ],
        hint:
          'Three ideas: the conditions rather than the character, why one click was enough, and a ' +
          'control that does not rely on future carefulness.',
      },
    ],
    debrief:
      'Notice the sentence about who discovered it. Human detection is worth naming in reviews, ' +
      'because it is the part of the human contribution that never gets counted.',
    practice: [],
  },
];

// --- Module hrf.2: how people actually decide --------------------------------

const MODULE_HRF_2: Exercise[] = [
  {
    id: 'hrf.2.1',
    moduleId: 'hrf.2',
    packageId: 'human-risk-foundations',
    order: 1,
    title: 'What makes a lure work',
    kind: 'multiple-choice',
    goal: 'Understand the pressures a good phishing message exploits.',
    prompt:
      'Which of the following make a phishing message more likely to succeed? Select all that ' +
      'apply.',
    teach: {
      concept:
        'A LURE is the fake message an attacker sends, and the TARGET is the person they are trying ' +
        'to trick. Effective lures do not rely on the target being careless or unintelligent. They ' +
        'rely on well-understood features of how everybody, including careful and intelligent ' +
        'people, makes fast decisions under load.\n\n' +
        'URGENCY compresses the time available to think, and a deadline is the cheapest way to stop ' +
        'somebody checking: "act within the hour" leaves no room to pause and verify. AUTHORITY ' +
        'borrows the weight of somebody it would be costly to question, which is why messages ' +
        'appearing to come from a senior executive work far beyond how plausible they actually are, ' +
        'nobody wants to be the person who challenged the CEO over nothing. FAMILIARITY makes the ' +
        'request routine: a message that matches a process the person performs every week, like ' +
        'approving an invoice, does not even register as a decision, it just gets done. And CONTEXT ' +
        'makes it specific: an attacker who has read a real supplier invoice, or has actually broken ' +
        'into an existing email conversation and is replying inside it (this is sometimes called ' +
        'thread hijacking), is enormously more convincing than one sending a generic, mass-produced ' +
        'message.\n\n' +
        'What matters practically is that none of these four are defeated simply by knowing about ' +
        'them. People who can list all four from memory still fall for messages that use them, ' +
        'because the mechanism operates below deliberate, conscious reasoning, and the person who is ' +
        'busiest is the most exposed, not the least informed. That is the strongest argument that ' +
        'awareness alone can never be the control.',
    },
    options: [
      { id: 'a', label: 'Urgency, which compresses the time available to check anything.' },
      { id: 'b', label: 'Apparent authority, which makes questioning the request feel costly.' },
      { id: 'c', label: 'Matching a process the person genuinely performs often, so it does not present as a decision.' },
      { id: 'd', label: 'Specific context such as a real invoice or an existing email thread.' },
      { id: 'e', label: 'Being aware of these techniques reliably protects somebody from them.' },
    ],
    hints: [
      'Four make it work. One assumes knowing about a mechanism disables it.',
      'Do security professionals ever fall for phishing?',
      'Which of these operates below deliberate reasoning?',
    ],
    solution:
      'A, B, C, and D. Urgency, authority, familiarity and context, and D is the one that has ' +
      'changed most: attackers routinely operate from compromised mailboxes inside real threads, ' +
      'which removes almost every cue people are taught to look for. E is the assumption underneath ' +
      'most awareness programmes and it is wrong: knowing the mechanism does not disable it, which ' +
      'is why security professionals get phished too, and why the control has to be somewhere ' +
      'other than in the person alertness.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option assumes awareness of a psychological mechanism protects against it.',
      },
    ],
    debrief:
      'The thread-hijacking case is the one to show sceptical executives. A reply inside a genuine ' +
      'conversation defeats every rule of thumb people are taught, and it is now routine.',
    practice: [],
  },
  {
    id: 'hrf.2.2',
    moduleId: 'hrf.2',
    packageId: 'human-risk-foundations',
    order: 2,
    title: 'Friction and the secure path',
    kind: 'multiple-choice',
    goal: 'Recognise how security controls create the behaviour they were meant to prevent.',
    prompt:
      'A company blocks file sharing tools, and staff start emailing documents to personal ' +
      'accounts. Which of the following are accurate? Select all that apply.',
    teach: {
      concept:
        'FRICTION is how much extra effort a safe action takes compared with an unsafe one, the same ' +
        'way a heavy door has more friction than one that swings open on its own. A WORKAROUND is ' +
        'what people build when the friction is too high: an unofficial way of getting the job done ' +
        'that skips the approved process entirely. And SANCTIONED simply means officially approved ' +
        'and supported by the organisation, as opposed to something an employee found and started ' +
        'using on their own.\n\n' +
        'When the secure, sanctioned path is harder than the work needs it to be, people route around ' +
        'it, and they are not being defiant: they have a job to do and the organisation is paying ' +
        'them to do it.\n\n' +
        'Every workaround is a design failure with a signal attached. Emailing documents to a ' +
        'personal account tells you people need to move large files and have no sanctioned way. A ' +
        'shared password in a spreadsheet tells you the access request process is too slow. ' +
        'Personal devices used for work tell you the corporate ones are inadequate. Each is worth ' +
        'more than a policy reminder because it names the requirement.\n\n' +
        'It also makes things worse than the risk it was meant to remove. A sanctioned file sharing ' +
        'tool can be logged, scanned, and revoked; personal email accounts are invisible, ' +
        'permanent and outside every control. Blocking without providing an alternative reliably ' +
        'trades a manageable risk for an unmanageable one.\n\n' +
        'The productive move is to treat a discovered workaround as a requirement statement rather ' +
        'than a discipline matter.',
    },
    options: [
      { id: 'a', label: 'The workaround identifies a real requirement the organisation has not met.' },
      { id: 'b', label: 'The replacement risk is worse: personal email is invisible and cannot be revoked.' },
      { id: 'c', label: 'Blocking without providing an alternative predictably produces this outcome.' },
      { id: 'd', label: 'The useful response is to provide a sanctioned tool rather than to enforce harder.' },
      { id: 'e', label: 'The staff are violating policy and the answer is enforcement and disciplinary action.' },
    ],
    hints: [
      'Four are accurate. One treats a design failure as a discipline matter.',
      'Which risk is easier to control: a sanctioned tool, or personal email?',
      'What is the workaround telling you people need?',
    ],
    solution:
      'A, B, C, and D. The workaround is a requirement, the substitute risk is worse, blocking ' +
      'without an alternative causes it, and provision beats enforcement. E can be defended on ' +
      'paper and makes the organisation less safe: the behaviour continues more carefully hidden, ' +
      'you lose the visibility you had, and the people who could have told you what they needed ' +
      'stop talking to you.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option responds to a design failure with enforcement and discipline.',
      },
    ],
    debrief:
      'Go looking for workarounds deliberately and treat each one as a feature request. It is the ' +
      'fastest route to controls people do not have to be persuaded to use.',
    practice: [],
  },
  {
    id: 'hrf.2.3',
    moduleId: 'hrf.2',
    packageId: 'human-risk-foundations',
    order: 3,
    title: 'Who is actually at risk',
    kind: 'multiple-choice',
    goal: 'Target effort at the roles where a mistake is most consequential.',
    prompt:
      'You have limited budget for targeted work. Which populations warrant disproportionate ' +
      'attention? Select all that apply.',
    teach: {
      concept:
        'Human risk is not evenly distributed, and treating everybody identically spends the ' +
        'budget where it matters least.\n\n' +
        'Concentrate on people whose mistake has OUTSIZED CONSEQUENCE, meaning it costs far more than ' +
        'an average mistake would. Finance staff who can move money are the target of the ' +
        'highest-value fraud (deliberate deception for financial gain) in most organisations. ' +
        'Executives and their assistants combine authority with time pressure and are heavily ' +
        'researched by attackers beforehand. IT administrators hold the kind of broad system access ' +
        'that turns one single compromised account into control over everything else the ' +
        'organisation runs. HR handles personal data at volume and receives unsolicited attachments ' +
        '(such as CVs from strangers) as a normal part of their job, which is an unusually difficult ' +
        'personal data at volume and receives unsolicited attachments as a normal part of their ' +
        'job, which is an unusually difficult position.\n\n' +
        'Also worth attention are people under STRUCTURAL PRESSURE to be helpful: the help desk ' +
        'exists to unblock people, and reception exists to let people in, so the behaviour an ' +
        'attacker wants is the behaviour those roles are hired for.\n\n' +
        'What does not work is targeting people who have clicked before as though they were the ' +
        'risk. Prior clicking has weak predictive power, singling those people out damages ' +
        'reporting, and the finance clerk who has never clicked is still the one who can transfer ' +
        'the money.',
    },
    options: [
      { id: 'a', label: 'Finance staff who can move money, because that is where high-value fraud lands.' },
      { id: 'b', label: 'Executives and their assistants, who combine authority with time pressure and are researched.' },
      { id: 'c', label: 'IT administrators, whose compromise converts one mistake into access to everything.' },
      { id: 'd', label: 'Roles structurally required to be helpful, such as the help desk and reception.' },
      { id: 'e', label: 'Everybody who has clicked a simulation before, as the primary targeting criterion.' },
    ],
    hints: [
      'Four warrant it. One targets by history rather than by consequence.',
      'Ask what a mistake by each group actually costs.',
      'What does singling out previous clickers do to reporting?',
    ],
    solution:
      'A, B, C, and D. Consequence and structural pressure are the right criteria. E targets by ' +
      'history, which predicts poorly, and it carries a real cost: people identified as repeat ' +
      'clickers and given extra training learn to expect blame, and the reporting rate in that ' +
      'group falls. Target by what a mistake would cost, not by who has made one.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option targets people by their history of clicking rather than by consequence.',
      },
    ],
    debrief:
      'The help desk deserves more attention than it gets everywhere. It is asked to be helpful to ' +
      'strangers all day and then blamed for being helpful to the wrong one.',
    practice: [],
  },
  {
    id: 'hrf.2.4',
    moduleId: 'hrf.2',
    packageId: 'human-risk-foundations',
    order: 4,
    title: 'Norms move behaviour',
    kind: 'multiple-choice',
    goal: 'Use what people believe others do, which drives behaviour more than rules.',
    prompt:
      'Which of the following are effective ways to shift security behaviour across a team? Select ' +
      'all that apply.',
    teach: {
      concept:
        'A NORM, in this context, is simply what people believe is normal and typical among the ' +
        'group around them, regardless of what any rulebook says. People take their cue from that ' +
        'far more than from what a written policy says, and it is a lever most awareness programmes ' +
        'never touch.\n\n' +
        'What works: telling people what OTHERS ACTUALLY DO, when the true number is encouraging. ' +
        '"Sixty per cent of your team reported this campaign" changes behaviour in a way that ' +
        '"you should report phishing" does not. VISIBLE LEADER BEHAVIOUR, because a director who ' +
        'reports a suspicious message and says so publicly makes reporting safe for everybody ' +
        'below them. CELEBRATING REPORTS by name and quickly, so the visible consequence of ' +
        'reporting is positive. And MAKING THE BEHAVIOUR OBSERVABLE, since a report button in the ' +
        'mail client that people can see colleagues using normalises it.\n\n' +
        'What backfires is publicising failure. "Thirty per cent of you clicked" tells everybody ' +
        'that clicking is normal, which is precisely the norm you did not want to establish, and ' +
        'it is one of the most common messages awareness teams send.',
    },
    options: [
      { id: 'a', label: 'Telling people the true and encouraging rate at which colleagues report.' },
      { id: 'b', label: 'Leaders visibly reporting suspicious messages and saying that they did.' },
      { id: 'c', label: 'Recognising reporters quickly, so the visible consequence of reporting is positive.' },
      { id: 'd', label: 'Making the reporting action observable, so people see colleagues doing it.' },
      { id: 'e', label: 'Publicising that thirty per cent of staff clicked, to convey the seriousness of the problem.' },
    ],
    hints: [
      'Four are effective. One accidentally advertises the behaviour you want to reduce.',
      'What does somebody conclude on hearing that a third of their colleagues clicked?',
      'Which of these makes reporting feel safe for a junior person?',
    ],
    solution:
      'A, B, C, and D. Accurate encouraging norms, visible leadership, fast recognition, and ' +
      'observable behaviour. E is the standard awareness message and it establishes exactly the ' +
      'wrong norm: telling people that a third of their colleagues clicked communicates that ' +
      'clicking is common and therefore unremarkable. If the number is discouraging, report the ' +
      'reporting rate instead, which is usually the more useful number anyway.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option publicises a high failure rate, which normalises the failure.',
      },
    ],
    debrief:
      'Never state a norm you do not want adopted. If most people did the wrong thing, find the ' +
      'true statement about the right thing and lead with that instead.',
    practice: [],
  },
  {
    id: 'hrf.2.5',
    moduleId: 'hrf.2',
    packageId: 'human-risk-foundations',
    order: 5,
    title: 'Argue for a design change',
    kind: 'short-answer',
    goal: 'Make the case that a control belongs in the system rather than in a training module.',
    prompt:
      'After several invoice fraud attempts, an executive proposes additional finance training. In ' +
      'three or four sentences, argue for a process change instead.',
    teach: {
      concept:
        'INVOICE FRAUD is an attack where somebody impersonates a supplier, or a senior colleague, ' +
        'and asks finance staff to pay a bill or change the bank account a supplier gets paid into, ' +
        'so the money goes to the attacker instead. The executive proposing more training is ' +
        'responding sensibly to a real problem with the tool they know best. The case against extra ' +
        'training is not that training is useless, it is that this specific risk has a control ' +
        'available that does not depend on anybody being alert.\n\n' +
        'Name the MECHANISM: invoice fraud works by making an unusual request look routine and ' +
        'urgent, and a trained person under time pressure is still susceptible, so an intervention ' +
        'that relies on vigilance will fail some proportion of the time by design.\n\n' +
        'Offer the SPECIFIC CONTROL: a VERIFIED CALLBACK, meaning phoning the supplier back on a ' +
        'number already on file (never a number given in the suspicious message itself) before any ' +
        'bank detail change goes through; a SECOND APPROVER, meaning a separate person must also sign ' +
        'off on payments above a set amount; and a standing rule that bank details are never changed ' +
        'purely on the basis of an emailed request. Those all work when somebody is busy, new, or ' +
        'being deceived by a genuinely convincing message.\n\n' +
        'And do not reject the training outright, because there is a place for it: the procedure ' +
        'has to be taught, and people need to know it is expected and that following it will not be ' +
        'held against them when a senior person is impatient.\n\n' +
        'A good answer names the process control, explains why it works when vigilance fails, and ' +
        'keeps a role for communication rather than dismissing training.',
    },
    hints: [
      'Do not argue that training is useless. Argue what this specific risk needs.',
      'What control still works when the person is busy and the message is convincing?',
      'A good answer proposes a specific process control such as verified callback or a second approver, explains that it works when vigilance fails, and still keeps a role for communication.',
    ],
    solution:
      'Invoice fraud works by making an unusual request look routine and urgent, so it targets ' +
      'people who are busy rather than people who are uninformed, and a trained finance clerk under ' +
      'deadline pressure is still susceptible. What removes the risk is a process control that does ' +
      'not depend on anybody being alert on the day: no bank detail change on the basis of an ' +
      'emailed request, a verified callback to a number already on file before any change is ' +
      'made, and a second approver above a value threshold. Those work when the message is genuinely ' +
      'convincing, which is exactly when training does not. I would still put effort into ' +
      'communication, because the procedure has to be known and people need to hear from leadership ' +
      'that following it is expected even when a senior person is pushing them to hurry, which is ' +
      'the moment it usually gets skipped.',
    expectedOutput:
      'An argument proposing a specific process control such as verified callback or dual ' +
      'approval, explaining why it works when vigilance fails, and retaining a role for ' +
      'communication.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['callback', 'call back', 'verified', 'second approver', 'dual', 'threshold', 'never change on the basis'],
          ['busy', 'under pressure', 'still susceptible', 'does not depend', 'when training does not', 'convincing'],
          ['still', 'communication', 'procedure has to be', 'leadership', 'expected', 'known'],
        ],
        hint:
          'Three ideas: the specific process control, why it works where vigilance fails, and the ' +
          'remaining role for communication.',
      },
    ],
    debrief:
      'The last part is what makes this persuasive rather than contrarian. You are not refusing the ' +
      'training, you are putting it in service of a control that works without it.',
    practice: [],
  },
];

// --- Module hrf.3: phishing simulation done properly -------------------------

const MODULE_HRF_3: Exercise[] = [
  {
    id: 'hrf.3.1',
    moduleId: 'hrf.3',
    packageId: 'human-risk-foundations',
    order: 1,
    title: 'What a simulation is for',
    kind: 'multiple-choice',
    goal: 'Be clear about what a phishing simulation can and cannot establish.',
    prompt:
      'Which of the following are legitimate purposes for a phishing simulation? Select all that ' +
      'apply.',
    teach: {
      concept:
        'A PHISHING SIMULATION is a fake phishing message an organisation sends to its own staff on ' +
        'purpose, using the same tricks a real attacker would, but harmless: clicking it teaches a ' +
        'lesson instead of handing anything to a criminal. It is the fire drill of this discipline, ' +
        'a rehearsal for a real event using a safe, staged version of it. Simulations are the most ' +
        'common awareness activity and also the most commonly misused, largely because teams are ' +
        'unclear about what they are actually for.\n\n' +
        'Legitimate purposes. PRACTISING REPORTING, which is the main one: the reporting route only ' +
        'works if people have used it, and a simulation is a safe place to build the reflex. ' +
        'TESTING THE RESPONSE PIPELINE, meaning what happens after a report arrives, how fast the ' +
        'team acts, whether a campaign can be pulled from mailboxes. FINDING SYSTEMIC EXPOSURE, ' +
        'such as a department with no reporting route or a group whose mail client hides the ' +
        'button. And ESTABLISHING A TREND over time, provided difficulty is held roughly constant.\n\n' +
        'What it cannot do is measure an individual susceptibility to real attacks. One data point ' +
        'against one lure on one day is not a property of a person, and treating it as one is where ' +
        'the ethical problems start. It also cannot prove readiness: a low click rate on an easy ' +
        'simulation tells you almost nothing about a targeted attack from a compromised supplier ' +
        'mailbox.',
    },
    options: [
      { id: 'a', label: 'Giving people practice at reporting, so the route is familiar before it matters.' },
      { id: 'b', label: 'Testing what happens after a report: response speed and whether mail can be pulled.' },
      { id: 'c', label: 'Finding systemic gaps such as a team with no reporting route at all.' },
      { id: 'd', label: 'Establishing a trend over time, if difficulty is held roughly constant.' },
      { id: 'e', label: 'Measuring how susceptible each individual is to real attacks.' },
    ],
    hints: [
      'Four are legitimate. One infers a personal property from a single data point.',
      'What does one result against one lure on one day actually establish about a person?',
      'Which of these is about the security team rather than about the staff?',
    ],
    solution:
      'A, B, C, and D. Practice, pipeline testing, systemic gaps, and trend. E is the ' +
      'misinterpretation everything else in this module follows from: a single result against a ' +
      'single lure reflects the lure difficulty, the person workload that hour, and chance, and ' +
      'treating it as a measurement of the person is both statistically unsound and the reason ' +
      'simulations acquire their bad reputation.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats a single simulation result as a measurement of an individual.',
      },
    ],
    debrief:
      'Option B is the one teams forget. Running a simulation and never checking how fast your own ' +
      'team responded to the reports wastes half the exercise.',
    practice: [],
  },
  {
    id: 'hrf.3.2',
    moduleId: 'hrf.3',
    packageId: 'human-risk-foundations',
    order: 2,
    title: 'The ethics of the lure',
    kind: 'multiple-choice',
    goal: 'Choose simulation content that tests without doing harm.',
    prompt:
      'You are choosing a lure for a company-wide simulation. Which of the following are ' +
      'appropriate? Select all that apply.',
    teach: {
      concept:
        'Running a simulation means the organisation is deliberately deceiving its own staff, using ' +
        'its own credibility as an employer to make the deception convincing. That is a real thing to ' +
        'do to a person, not a neutral technical exercise, and it needs limits on what kind of ' +
        'deception is acceptable.\n\n' +
        'Appropriate lures resemble what attackers actually send: a delivery notification, a ' +
        'document share, an IT notice, an invoice. They are realistic, they test something, and ' +
        'nobody is harmed by having fallen for one.\n\n' +
        'Inappropriate lures exploit something the person cannot treat as a game. Fake bonus or ' +
        'pay-rise notifications use somebody financial hopes and generate real anger, and they have ' +
        'produced press coverage and resignations at organisations that used them. Fake redundancy ' +
        'notices, fake medical results, or messages about family emergencies are worse. Anything ' +
        'exploiting a live crisis at the company is in the same category.\n\n' +
        'The test worth applying is whether you would be comfortable explaining the lure, in ' +
        'advance, to the group receiving it. If the answer is no, the simulation is likely to cost ' +
        'you more in trust than it returns in data, and trust is the only asset an awareness ' +
        'programme has.',
    },
    options: [
      { id: 'a', label: 'A delivery notification or document share, which is what attackers actually send.' },
      { id: 'b', label: 'An IT notice about an account action, which is realistic and low harm.' },
      { id: 'c', label: 'An invoice or purchase order lure aimed at finance, matching real fraud.' },
      { id: 'd', label: 'A test of whether you would be comfortable explaining the lure to recipients in advance.' },
      { id: 'e', label: 'A fake bonus or pay-rise notification, since its high click rate proves the point.' },
    ],
    hints: [
      'Four are appropriate. One is effective and costs more than it returns.',
      'What does somebody feel on discovering the bonus was a test?',
      'What is the only asset an awareness programme actually has?',
    ],
    solution:
      'A, B, C, and D. Realistic, low-harm lures and a sensible test for the line. E works and is ' +
      'the classic mistake: fake bonus lures produce very high click rates and lasting resentment, ' +
      'have generated press coverage and resignations, and cost the programme the trust it needs ' +
      'for everything else. A number you obtained by making people feel foolish about their pay is ' +
      'not worth having.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option chooses a lure that exploits financial hope and reliably produces resentment.',
      },
    ],
    debrief:
      'Get the lure signed off by HR and communications before it goes out, every time. It takes a ' +
      'day and it is the difference between a routine exercise and an incident of your own making.',
    practice: [],
  },
  {
    id: 'hrf.3.3',
    moduleId: 'hrf.3',
    packageId: 'human-risk-foundations',
    order: 3,
    title: 'What happens to somebody who clicks',
    kind: 'multiple-choice',
    goal: 'Design the moment after a click so it improves behaviour rather than suppressing it.',
    prompt:
      'Somebody clicks your simulation. Which of the following are sound responses? Select all ' +
      'that apply.',
    teach: {
      concept:
        'When somebody clicks a simulated phishing link, instead of reaching a real fake login page ' +
        'they land on a LANDING PAGE, a screen the simulation tool shows them on the spot that reveals ' +
        'this was a test and explains what to look for next time. That moment right after the click ' +
        'is where a simulation either builds the organisation reporting culture or destroys it, and ' +
        'most programmes get it wrong by being punitive in ways they do not recognise as punitive.\n\n' +
        'What works: a SHORT, NON-JUDGEMENTAL landing page explaining what the cues were, ' +
        'delivered immediately, because that is the teachable moment and it lasts about a minute. ' +
        'A clear ROUTE TO REPORT from that page, so somebody who clicked can still do the right ' +
        'thing. And an explicit statement that this is NOT RECORDED AGAINST THEM, which people do ' +
        'not believe unless you say it.\n\n' +
        'What harms: naming individuals to managers, mandatory remedial training assigned publicly, ' +
        'league tables by department, and anything that appears in a performance conversation. All ' +
        'of these are common, all of them reduce reporting, and reporting is the thing you were ' +
        'trying to improve.\n\n' +
        'The exception worth naming honestly is repeated clicking by somebody in a high-consequence ' +
        'role, which is a conversation worth having privately and supportively rather than a ' +
        'disciplinary matter.',
    },
    options: [
      { id: 'a', label: 'An immediate, short, non-judgemental explanation of the cues in the message.' },
      { id: 'b', label: 'A clear route to report from the landing page, so they can still act correctly.' },
      { id: 'c', label: 'An explicit statement that this is not recorded against them.' },
      { id: 'd', label: 'For repeated clicks in a high-consequence role, a private and supportive conversation.' },
      { id: 'e', label: 'A report to their line manager and mandatory remedial training, so it is taken seriously.' },
    ],
    hints: [
      'Four are sound. One is standard practice and reduces reporting.',
      'What does somebody do next time, after being reported to their manager?',
      'Which of these tells the person that reporting is still worth doing?',
    ],
    solution:
      'A, B, C, and D. Immediate low-shame teaching, a route to report, an explicit reassurance, ' +
      'and a private conversation where consequence genuinely warrants it. E is extremely common ' +
      'and counterproductive: it teaches that involvement with security is punishment, and the ' +
      'measurable effect is that people stop reporting, which costs far more than the clicks it ' +
      'was meant to reduce.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option reports the individual to their manager and assigns remedial training.',
      },
    ],
    debrief:
      'If you inherit a punitive programme, this is the first thing to change and the easiest to ' +
      'argue: the reporting rate is measurable, it will rise, and that is the number that matters.',
    practice: [],
  },
  {
    id: 'hrf.3.4',
    moduleId: 'hrf.3',
    packageId: 'human-risk-foundations',
    order: 4,
    title: 'Reading the results honestly',
    kind: 'multiple-choice',
    goal: 'Interpret simulation numbers without overclaiming.',
    prompt:
      'Your click rate fell from 18% to 6% over a year. Which of the following are accurate? ' +
      'Select all that apply.',
    teach: {
      concept:
        'A falling click rate is the number every awareness programme reports and it supports much ' +
        'less than it appears to.\n\n' +
        'Several things produce a falling number that are not improved security. DIFFICULTY DRIFT: ' +
        'if this year lures were simply easier to spot than last year, the fall is an artefact of ' +
        'the test, not of people, and difficulty is rarely controlled precisely. FAMILIARITY: people ' +
        'learn to recognise the SIMULATION rather than phishing itself, spotting the sending platform ' +
        'or the pattern of when tests usually arrive. AVOIDANCE: staff who suspect a test may simply ' +
        'not engage with any unusual mail at all, which lowers the click number and does nothing for ' +
        'real attacks. And SURVIVORSHIP: if the group of people being measured changed, for instance ' +
        'because people who clicked a lot left the company, the number can fall for reasons that ' +
        'have nothing to do with anyone getting better.\n\n' +
        'What would support a claim of improvement: reporting rate up as well as clicks down, time ' +
        'to first report falling, difficulty held constant or increasing, and ideally corroboration ' +
        'from real incidents rather than simulations.\n\n' +
        'Reporting a click rate fall to a board as evidence of reduced risk, without any of that, ' +
        'is the most common overclaim in this discipline.',
    },
    options: [
      { id: 'a', label: 'If lure difficulty was not held constant, the fall may be an artefact of easier tests.' },
      { id: 'b', label: 'People may be recognising the simulation platform rather than recognising phishing.' },
      { id: 'c', label: 'A rising reporting rate alongside would support the claim far better than clicks alone.' },
      { id: 'd', label: 'Time to first report falling is stronger evidence of improved response than click rate.' },
      { id: 'e', label: 'It demonstrates that the organisation susceptibility to real phishing has fallen by two thirds.' },
    ],
    hints: [
      'Four are accurate. One converts a simulation statistic into a claim about real attacks.',
      'What are people actually learning to recognise?',
      'Which number tells you whether the organisation would find out about a real campaign?',
    ],
    solution:
      'A, B, C, and D. Difficulty drift, simulation recognition, and the two numbers that would ' +
      'genuinely support an improvement claim. E is the overclaim: a simulation measures behaviour ' +
      'against simulations, real attacks are targeted and use context no test replicates, and ' +
      'nothing about a threefold fall in click rate translates into a proportional fall in real ' +
      'risk. Report the number with what it supports and no more.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option converts a simulation result into a proportional claim about real-world risk.',
      },
    ],
    debrief:
      'Being the person who states the limits of your own metric is how this discipline earns ' +
      'credibility with the rest of security, which it has historically lacked.',
    practice: [],
  },
  {
    id: 'hrf.3.5',
    moduleId: 'hrf.3',
    packageId: 'human-risk-foundations',
    order: 5,
    title: 'Design a simulation programme',
    kind: 'short-answer',
    goal: 'Specify a programme that improves reporting without harming trust.',
    prompt:
      'You are asked to design the phishing simulation programme from scratch. In three or four ' +
      'sentences, say how it will work and what you will measure.',
    teach: {
      concept:
        'A defensible design follows from everything in this module.\n\n' +
        'MEASURE REPORTING and time to first report as the primary metrics, with click rate ' +
        'secondary and always reported alongside difficulty. That single choice determines most of ' +
        'the programme character, because it makes reporting the behaviour being rewarded.\n\n' +
        'NON-PUNITIVE by design and by announcement: immediate low-shame teaching at the click, a ' +
        'route to report from the landing page, no individual reporting to managers, and say so ' +
        'publicly so people believe it.\n\n' +
        'REALISTIC BUT ETHICAL lures, cleared with HR and communications, avoiding pay, health, ' +
        'employment status and live crises.\n\n' +
        'And a FEEDBACK LOOP that is about you as much as them: measure how fast your own team ' +
        'responded to reports, and fix the systemic findings, such as a department whose mail ' +
        'client hides the report button.\n\n' +
        'A good answer makes reporting the primary metric, states the programme is non-punitive, ' +
        'and includes an ethical constraint on lure choice.',
    },
    hints: [
      'What you measure decides what the programme becomes. Choose first.',
      'What has to be true for somebody to report a message they already clicked?',
      'A good answer makes reporting rate and time to report the primary metrics, commits to a non-punitive response, and constrains lure choice ethically.',
    ],
    solution:
      'The primary metrics are reporting rate and time to first report, with click rate reported ' +
      'secondary and always alongside the difficulty of the lure, because measuring clicks rewards ' +
      'suppressing reports and measuring reports rewards exactly what I want people to do. The ' +
      'programme is explicitly non-punitive and announced as such: clicking produces an immediate ' +
      'short explanation and a route to report rather than a note to a manager, and nothing is ' +
      'recorded against an individual. Lures will be realistic but constrained, cleared with HR ' +
      'and communications, and will not use pay, health, employment status or anything happening ' +
      'live in the company. And I will measure our own response as well as theirs, so that how ' +
      'fast we act on a report and whether we can pull a campaign from mailboxes is part of what ' +
      'the exercise tests.',
    expectedOutput:
      'A design making reporting rate and time to report primary, committing to a non-punitive ' +
      'response, and constraining lure choice on ethical grounds.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['reporting rate', 'time to report', 'time to first report', 'reports'],
          ['non-punitive', 'not punitive', 'no note to a manager', 'not recorded against', 'no blame'],
          ['hr', 'communications', 'will not use pay', 'ethical', 'constrained', 'cleared'],
        ],
        hint:
          'Three commitments: the primary metric, the non-punitive response, and a limit on what ' +
          'lures you will use.',
      },
    ],
    debrief:
      'Write these commitments down and publish them. A simulation programme with published rules ' +
      'is one people stop resenting, and the reporting rate reflects that within a couple of ' +
      'campaigns.',
    practice: [],
  },
];

// --- Module hrf.4: measuring human risk --------------------------------------

const MODULE_HRF_4: Exercise[] = [
  {
    id: 'hrf.4.1',
    moduleId: 'hrf.4',
    packageId: 'human-risk-foundations',
    order: 1,
    title: 'Report the reporting',
    kind: 'multiple-choice',
    goal: 'Choose the primary metric for a human risk programme.',
    prompt:
      'Which of the following are accurate about reporting rate as a metric? Select all that ' +
      'apply.',
    teach: REPORTING_TEACH,
    options: [
      { id: 'a', label: 'It measures whether the organisation finds out, which is what shortens response time.' },
      { id: 'b', label: 'Time to first report is the number that determines what the security team can still do.' },
      { id: 'c', label: 'Optimising for click rate can suppress reporting, because a report implies a near miss.' },
      { id: 'd', label: 'Ten clicks with a fast report can be a better outcome than no clicks and no reports.' },
      { id: 'e', label: 'Reporting rate matters less than click rate, since a click is the actual compromise.' },
    ],
    hints: [
      'Four are accurate. One prefers the metric that rewards silence.',
      'What can a security team do with a report at four minutes that it cannot do at four hours?',
      'What does no clicks and no reports actually tell you?',
    ],
    solution:
      'A, B, C, and D. Discovery, response window, the perverse incentive in click optimisation, ' +
      'and the counterintuitive comparison in D, which is the point of the whole module. E has ' +
      'surface logic and fails on the real question: some clicks are inevitable against a competent ' +
      'lure, so the variable you can actually move is whether anybody tells you, and a population ' +
      'that never clicks and never reports is one you know nothing about.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option prefers click rate on the grounds that the click is the compromise.',
      },
    ],
    debrief:
      'If you change one number on the board slide, change it to time to first report. It is the ' +
      'only human-risk metric that maps directly onto what the response team can do.',
    practice: [],
  },
  {
    id: 'hrf.4.2',
    moduleId: 'hrf.4',
    packageId: 'human-risk-foundations',
    order: 2,
    title: 'Metrics that damage the programme',
    kind: 'multiple-choice',
    goal: 'Recognise measures that produce the wrong behaviour.',
    prompt:
      'Which of the following metrics would harm a human risk programme? Select all that apply.',
    teach: {
      concept:
        'A METRIC is simply a number an organisation tracks to judge whether something is working. ' +
        'Every metric quietly instructs whoever is being measured by it, because people adjust their ' +
        'behaviour to make the number they are judged on look good, whether or not that actually ' +
        'helps. So the test to apply to any proposed metric is always: what would a person under ' +
        'pressure do to move this number, and would that action make anyone safer?\n\n' +
        'TRAINING COMPLETION PERCENTAGE rewards making the module shorter and easier and chasing ' +
        'the last few stragglers to click through it, and has no relationship to behaviour. ' +
        'DEPARTMENTAL CLICK LEAGUE TABLES, a public ranking of which team clicked the most, create ' +
        'competition that gets managed by suppressing reports rather than by improving behaviour, ' +
        'and they publicly shame teams into the bargain. NUMBER OF SIMULATIONS SENT rewards ' +
        'volume, which annoys people and degrades results. And COUNT OF POLICY VIOLATIONS ' +
        'DISCIPLINED explicitly rewards catching people, which is the fastest way to end reporting ' +
        'entirely.\n\n' +
        'What they share is that each can be improved without anything getting safer, and several ' +
        'improve most easily by damaging the thing you actually want. A metric with that property ' +
        'is worse than no metric, because it directs effort confidently in the wrong direction and ' +
        'produces a chart that says the programme is working.',
    },
    options: [
      { id: 'a', label: 'Training completion percentage, which rewards shorter modules and has no link to behaviour.' },
      { id: 'b', label: 'Departmental click league tables, which get managed by suppressing reports.' },
      { id: 'c', label: 'Number of simulations sent, which rewards volume and annoyance.' },
      { id: 'd', label: 'Count of policy violations disciplined, which rewards catching people.' },
      { id: 'e', label: 'Time between a phishing campaign arriving and the first report of it.' },
    ],
    hints: [
      'Four are harmful. One is the metric this module has been arguing for.',
      'For each, ask how somebody would improve the number without improving security.',
      'Which one cannot be gamed without genuinely getting better?',
    ],
    solution:
      'A, B, C, and D. Each is improvable without anything getting safer, and B and D actively ' +
      'damage reporting. E is the good metric: the only ways to reduce time to first report are ' +
      'making reporting easier, making people willing to report, and having somebody watching the ' +
      'inbox, all of which are genuine improvements. That resistance to gaming is what makes it ' +
      'worth putting in front of a board.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option is the metric that cannot be improved without a real improvement.',
      },
    ],
    debrief:
      'League tables are the one you will have to argue hardest about, because executives like ' +
      'them. The counter is simple: the losing department improves by discouraging reports.',
    practice: [],
  },
  {
    id: 'hrf.4.3',
    moduleId: 'hrf.4',
    packageId: 'human-risk-foundations',
    order: 3,
    title: 'What else tells you about human risk',
    kind: 'multiple-choice',
    goal: 'Look beyond simulations for signals about behaviour.',
    prompt:
      'Which of the following are useful signals about human risk, outside phishing simulations? ' +
      'Select all that apply.',
    teach: {
      concept:
        'Simulations dominate the discipline and are a narrow instrument, one artificial test among ' +
        'many possible SIGNALS, meaning any piece of real-world data that tells you something about ' +
        'how people actually behave. Better signals exist, and most of them are already being ' +
        'collected by somebody else in the organisation, just not looked at through this lens.\n\n' +
        'REAL REPORTED MESSAGES, meaning actual suspicious emails staff flag on their own without ' +
        'being prompted by a test, tell you what people are actually seeing and whether they report ' +
        'unprompted, which is more informative than any simulation. HELP DESK CONTACTS about ' +
        'suspicious messages or account lockouts show where people are confused and where processes ' +
        'bite. WORKAROUND PREVALENCE, such as how much use unsanctioned file sharing gets, measures ' +
        'friction directly. And DATA FROM NEAR MISSES, meaning attacks that were caught before they ' +
        'succeeded, tells you which control caught them, and specifically whether it was a person who ' +
        'noticed.\n\n' +
        'What is a weak signal is self-reported confidence from a survey. People consistently ' +
        'overestimate their ability to spot phishing, the answers correlate poorly with behaviour, ' +
        'and a survey mostly measures how somebody wants to be seen. It is worth running for ' +
        'other reasons, such as gauging whether people feel able to report, and it is not a ' +
        'measure of susceptibility.',
    },
    options: [
      { id: 'a', label: 'Real messages reported unprompted, which show what people are actually seeing.' },
      { id: 'b', label: 'Help desk contacts about suspicious mail, which show where people are confused.' },
      { id: 'c', label: 'How much unsanctioned tooling is in use, which measures friction directly.' },
      { id: 'd', label: 'Near misses, and specifically whether a person or a control caught them.' },
      { id: 'e', label: 'Survey responses in which staff rate their own ability to spot phishing.' },
    ],
    hints: [
      'Four are useful. One measures self-image rather than behaviour.',
      'Do people accurately estimate their own susceptibility?',
      'Which of these is already being collected by another team?',
    ],
    solution:
      'A, B, C, and D. Real reports, help desk contact, workaround prevalence, and near-miss ' +
      'attribution are all richer than simulation data and mostly already exist. E is weak as a ' +
      'susceptibility measure because self-assessment correlates poorly with behaviour and people ' +
      'answer as they wish to be seen. Surveys are still worth running to ask whether people feel ' +
      'able to report and whether they know how, which are questions self-report can answer.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option uses self-assessed ability, which correlates poorly with actual behaviour.',
      },
    ],
    debrief:
      'Go and talk to the help desk in your first month. They know exactly where the friction is ' +
      'and nobody has ever asked them.',
    practice: [],
  },
  {
    id: 'hrf.4.4',
    moduleId: 'hrf.4',
    packageId: 'human-risk-foundations',
    order: 4,
    title: 'Reporting to a board',
    kind: 'multiple-choice',
    goal: 'Present human risk in terms a board can act on.',
    prompt:
      'You have ten minutes with the board. Which of the following belong in what you present? ' +
      'Select all that apply.',
    teach: {
      concept:
        'A BOARD is the small group of senior people, often including outsiders to the company, who ' +
        'hold ultimate responsibility for how an organisation is run, including what gets funded. In ' +
        'a board meeting you are deciding whether they fund things and whether they worry, so the ' +
        'presentation has to answer both, in language about outcomes rather than about your team ' +
        'activity.\n\n' +
        'What belongs: the EXPOSURE in business terms, such as what a successful invoice fraud ' +
        'would cost given what has been attempted. The TREND on a metric that resists gaming, ' +
        'stated with its limits. A DECISION you want from them, with the money or authority ' +
        'attached. And ONE CONCRETE STORY, because a board remembers the attempted supplier fraud ' +
        'that finance caught and will not remember any percentage.\n\n' +
        'What does not belong is activity reporting: modules delivered, simulations sent, ' +
        'completion percentages. It answers a question nobody asked and it invites the conclusion ' +
        'that the function is busy rather than effective.\n\n' +
        'And be honest about limits. A board that discovers later that a reassuring number meant ' +
        'less than it appeared will discount everything you say afterwards, and that is a very ' +
        'expensive way to buy one comfortable meeting.',
    },
    options: [
      { id: 'a', label: 'The exposure in business terms, such as what an attempted fraud would have cost.' },
      { id: 'b', label: 'A trend on a metric that resists gaming, stated with its limits.' },
      { id: 'c', label: 'A specific decision you want, with the money or authority attached.' },
      { id: 'd', label: 'One concrete story, because that is what will be remembered.' },
      { id: 'e', label: 'Training modules delivered and completion percentage, to show the programme is active.' },
    ],
    hints: [
      'Four belong. One reports activity rather than outcome.',
      'What is the board actually deciding in this meeting?',
      'Which item will somebody still remember next quarter?',
    ],
    solution:
      'A, B, C, and D. Exposure, an honest trend, a decision, and a story. E is activity reporting, ' +
      'which answers a question nobody asked and invites the response that the function is busy. If ' +
      'completion is contractually required, put it in an appendix rather than spending any of ten ' +
      'minutes on it.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option presents activity statistics rather than exposure or a decision.',
      },
    ],
    debrief:
      'The story is not decoration. It is how a board builds intuition about a risk they cannot ' +
      'evaluate technically, and the finance clerk who phoned to check is a better advocate for ' +
      'your budget than any chart.',
    practice: [],
  },
  {
    id: 'hrf.4.5',
    moduleId: 'hrf.4',
    packageId: 'human-risk-foundations',
    order: 5,
    title: 'Report a bad quarter',
    kind: 'short-answer',
    goal: 'Present an unflattering result without either hiding it or panicking.',
    prompt:
      'Your click rate rose this quarter, because you increased lure difficulty deliberately. ' +
      'Reporting also rose. In three or four sentences, write what you tell the leadership team.',
    teach: {
      concept:
        'This is the moment that decides whether your numbers are ever believed, and the temptation ' +
        'is to bury the click rate or to lead with an excuse.\n\n' +
        'Lead with the CHANGE YOU MADE, before the number, so the context is not a defence offered ' +
        'afterwards: difficulty was increased deliberately, and here is why. Then give BOTH ' +
        'NUMBERS, because clicks rising and reports rising together is a coherent and good story ' +
        'that neither number tells alone.\n\n' +
        'Then say what it MEANS: against a harder and more realistic lure, more people were caught ' +
        'and more people told us, and the second is the capability that matters. If time to first ' +
        'report also improved, that is the headline.\n\n' +
        'And say what you will do next, so it reads as a programme under control rather than a ' +
        'result being explained away.\n\n' +
        'A good answer leads with the deliberate difficulty change, reports both numbers together, ' +
        'and frames the reporting rise as the meaningful outcome without hiding the click rise.',
    },
    hints: [
      'Do not lead with the number. Lead with the decision that produced it.',
      'Two numbers moved. Which one is the capability you care about?',
      'A good answer states that difficulty was deliberately increased, gives both the click and reporting figures, and frames the reporting rise as the outcome that matters.',
    ],
    solution:
      'We deliberately increased the difficulty of the lures this quarter, moving from generic ' +
      'messages to ones using real internal context, because the previous tests had stopped ' +
      'resembling what we actually see. Against those harder lures the click rate rose, and the ' +
      'reporting rate rose further, with time to first report falling from around forty minutes to ' +
      'under ten. That combination is the outcome I wanted: more people were caught by a realistic ' +
      'message, and substantially more of them told us quickly, which is the capability that ' +
      'decides whether we can pull a real campaign before it spreads. I am holding difficulty at ' +
      'this level next quarter so the trend is comparable, and the click number will stay higher ' +
      'than last year as a result.',
    expectedOutput:
      'A report leading with the deliberate difficulty increase, giving both numbers, and framing ' +
      'the reporting improvement as the meaningful result without concealing the click rise.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['deliberately', 'increased the difficulty', 'harder', 'on purpose', 'we changed'],
          ['reporting', 'time to first report', 'told us', 'reported'],
          ['comparable', 'hold', 'next quarter', 'stay higher', 'trend'],
        ],
        hint:
          'Three parts: the deliberate change, the reporting improvement alongside the click rise, ' +
          'and what happens next.',
      },
    ],
    debrief:
      'A team that reports its own worse number, with the reason, is a team whose good numbers get ' +
      'believed. That credibility is the whole asset.',
    practice: [],
  },
];

// --- Module hrf.5: designing for the human -----------------------------------

const MODULE_HRF_5: Exercise[] = [
  {
    id: 'hrf.5.1',
    moduleId: 'hrf.5',
    packageId: 'human-risk-foundations',
    order: 1,
    title: 'Make the secure path the easy path',
    kind: 'multiple-choice',
    goal: 'Change behaviour by changing what is easy rather than what is known.',
    prompt:
      'Which of the following change behaviour more reliably than communication does? Select all ' +
      'that apply.',
    teach: {
      concept:
        'The most effective awareness interventions are not communications at all. They alter what ' +
        'is easy, and people follow the easy path without being persuaded of anything, the same way ' +
        'far more people take the escalator next to a staircase than climb the stairs out of ' +
        'principle.\n\n' +
        'A ONE-CLICK REPORT BUTTON built into the mail program (so reporting a suspicious email is a ' +
        'single click rather than forwarding it, writing an explanation and finding the right ' +
        'address) raises reporting more than any campaign, because the barrier was effort rather than ' +
        'willingness. A PASSWORD MANAGER, a tool that generates and remembers a different strong ' +
        'password for every account so nobody has to, deployed and supported by the organisation does ' +
        'more for password reuse than a decade of telling people not to reuse passwords. DEFAULTS ' +
        'that are secure work because most people never change a default setting, which is one of the ' +
        'most reliable findings in this entire field. And REMOVING DECISIONS, such as blocking macros ' +
        '(described in an earlier module) centrally for everybody, means the decision cannot be got ' +
        'wrong because no individual is ever asked to make it.\n\n' +
        'The thing to notice is that each of these makes the person life EASIER as well as safer. ' +
        'Interventions that trade user pain for security get worked around; interventions that ' +
        'remove pain get adopted without a campaign. When you can find one of the second kind, it ' +
        'is worth ten of the first.',
    },
    options: [
      { id: 'a', label: 'A one-click report button in the mail client.' },
      { id: 'b', label: 'A deployed and supported password manager.' },
      { id: 'c', label: 'Secure defaults, since most people never change a default.' },
      { id: 'd', label: 'Removing a decision entirely, such as blocking macros centrally.' },
      { id: 'e', label: 'A monthly newsletter reminding people of the same practices.' },
    ],
    hints: [
      'Four change behaviour. One is the intervention this package keeps arguing against.',
      'What do all four of the effective ones have in common for the user?',
      'How many people change a default setting?',
    ],
    solution:
      'A, B, C, and D. Each removes effort or removes the decision, and each makes the person life ' +
      'easier as well as safer, which is why they get adopted. E is the default activity of most ' +
      'awareness programmes and has the weakest evidence behind it: it adds information to people ' +
      'who already have it, and it competes for attention with their actual job.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option is a recurring communication rather than a change to what is easy.',
      },
    ],
    debrief:
      'The report button is the single highest-return thing in this package. If your organisation ' +
      'does not have one, that is the project to run first.',
    practice: [],
  },
  {
    id: 'hrf.5.2',
    moduleId: 'hrf.5',
    packageId: 'human-risk-foundations',
    order: 2,
    title: 'The friction budget',
    kind: 'multiple-choice',
    goal: 'Spend user patience where it buys the most.',
    prompt:
      'Which of the following are accurate about the friction security imposes? Select all that ' +
      'apply.',
    teach: {
      concept:
        'People have a limited tolerance for security getting in the way of their work, the same way ' +
        'a household has a limited tolerance for having its routine disrupted. That tolerance is a ' +
        'shared budget across everything security asks of them, not a separate allowance for each ' +
        'individual control. Spend it on low-value controls and there is none left for the one ' +
        'control that actually matters.\n\n' +
        'The consequences are practical. Every unnecessary prompt trains people to click through ' +
        'prompts, so the important warning arrives to somebody already in the habit of dismissing ' +
        'them. Controls that cost more than they are worth produce workarounds, as the earlier ' +
        'module described. And the team that has asked for twelve inconvenient things gets a worse ' +
        'hearing on the thirteenth, whatever its merits.\n\n' +
        'So the discipline is to audit your own friction: what are we asking people to do, what ' +
        'does each one buy, and what could we stop asking for? Removing a low-value control is a ' +
        'security action, because it buys back the tolerance needed for a high-value one. Teams ' +
        'that never remove anything accumulate friction until people route around all of it ' +
        'indiscriminately.',
    },
    options: [
      { id: 'a', label: 'Tolerance for security friction is limited and shared across everything security asks.' },
      { id: 'b', label: 'Unnecessary prompts train people to dismiss prompts, including the important one.' },
      { id: 'c', label: 'Removing a low-value control is a security action, because it buys tolerance for a high-value one.' },
      { id: 'd', label: 'A team that has asked for many inconvenient things gets a worse hearing on the next one.' },
      { id: 'e', label: 'More friction is always safer, because every control adds protection.' },
    ],
    hints: [
      'Four are accurate. One treats friction as free.',
      'What happens to somebody who sees twenty warnings a day?',
      'Can removing a control ever improve security?',
    ],
    solution:
      'A, B, C, and D. Shared budget, habituation, removal as a security action, and accumulated ' +
      'political cost. E ignores the second-order effects: each control adds nominal protection and ' +
      'subtracts attention and goodwill, and past a point the additions are negative because ' +
      'people stop engaging with all of it. Security is not monotonic in friction.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats every additional control as adding protection at no cost.',
      },
    ],
    debrief:
      'Audit your own asks once a year and remove something. It is unusual enough that people ' +
      'notice, and it buys you the hearing you need for the thing that matters.',
    practice: [],
  },
  {
    id: 'hrf.5.3',
    moduleId: 'hrf.5',
    packageId: 'human-risk-foundations',
    order: 3,
    title: 'Warnings that work',
    kind: 'multiple-choice',
    goal: 'Design a warning somebody will actually read.',
    prompt:
      'You are designing an external-sender warning banner for email. Which of the following make ' +
      'it more effective? Select all that apply.',
    teach: {
      concept:
        'A BANNER is a strip of text an email program can automatically add to a message, usually at ' +
        'the top, to flag something about it, such as that it came from outside the company. Most ' +
        'security warnings, banners included, are ignored, and the reasons are well understood.\n\n' +
        'What helps: SPECIFICITY, because a banner that says something concrete such as "this ' +
        'sender is external and has never emailed you before" carries information a generic ' +
        '"external sender" banner does not. RARITY, because a warning on every external message is ' +
        'wallpaper within a week, and one that appears on the unusual few gets read. SAYING WHAT ' +
        'TO DO, since a warning that raises alarm without offering an action leaves somebody stuck ' +
        'and they proceed. And PLACEMENT at the decision point rather than at the top of a message ' +
        'somebody has already scrolled past.\n\n' +
        'What fails is the generic banner on everything, which is the most widely deployed control ' +
        'of this type and is close to useless after the first fortnight. If you inherit one, the ' +
        'improvement is not better wording, it is making it appear far less often and say something ' +
        'specific when it does.',
    },
    options: [
      { id: 'a', label: 'Saying something specific, such as that this sender has never emailed the recipient before.' },
      { id: 'b', label: 'Appearing rarely, so it is not wallpaper.' },
      { id: 'c', label: 'Telling the person what to do, not only that something is unusual.' },
      { id: 'd', label: 'Appearing at the point of the decision rather than only at the top of the message.' },
      { id: 'e', label: 'Appearing on every message from outside the organisation, for consistency.' },
    ],
    hints: [
      'Four help. One is the most common implementation and stops working quickly.',
      'How long does it take to stop seeing something that appears on every message?',
      'What does a warning that offers no action leave somebody doing?',
    ],
    solution:
      'A, B, C, and D. Specificity, rarity, actionability and placement. E is the standard ' +
      'deployment and it fails through habituation: a banner on every external email is invisible ' +
      'within days, and its presence on a genuinely dangerous message conveys nothing because it ' +
      'is on the other four hundred too.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option puts the banner on every external message, which makes it invisible.',
      },
    ],
    debrief:
      'First-time-sender warnings are the good version of this. They fire rarely, they say ' +
      'something true and specific, and people still read them after a year.',
    practice: [],
  },
  {
    id: 'hrf.5.4',
    moduleId: 'hrf.5',
    packageId: 'human-risk-foundations',
    order: 4,
    title: 'Working with the people who build things',
    kind: 'multiple-choice',
    goal: 'Get design changes made by teams who do not report to you.',
    prompt:
      'You want a product team to add a confirmation step to a risky action. Which of the following ' +
      'help? Select all that apply.',
    teach: {
      concept:
        'Design changes to a product are made by the team who builds it, people who do not work for ' +
        'you and have their own ROADMAP, meaning their own planned list of what they are building ' +
        'next and in what order. So the skill here is influence rather than requirement, persuading ' +
        'rather than instructing.\n\n' +
        'What helps: bringing EVIDENCE from their own users rather than a general principle, ' +
        'because a support ticket from a customer who did the wrong thing outweighs any policy ' +
        'citation. Framing it in THEIR terms, since a confirmation step that reduces accidental ' +
        'destructive actions is a usability improvement and a support-cost reduction as well as a ' +
        'security one. Proposing something SMALL AND SPECIFIC that fits inside a SPRINT, meaning the ' +
        'short block of a week or two that most product teams plan their work in, rather than a whole ' +
        'programme of work. And ASKING EARLY, at design time rather than after the thing is already ' +
        'built, when changing it is cheap.\n\n' +
        'What fails is a security requirement handed over with a policy reference and a deadline. ' +
        'It gets scheduled behind everything the team actually cares about, and you have spent ' +
        'goodwill to achieve a ticket nobody will pick up.',
    },
    options: [
      { id: 'a', label: 'Bringing evidence from their own users rather than a general principle.' },
      { id: 'b', label: 'Framing it as a usability and support-cost improvement as well as a security one.' },
      { id: 'c', label: 'Proposing something small and specific that fits inside a sprint.' },
      { id: 'd', label: 'Raising it at design time, when changing it is cheap.' },
      { id: 'e', label: 'Issuing it as a security requirement with a policy reference and a deadline.' },
    ],
    hints: [
      'Four help. One is the approach that produces a ticket nobody picks up.',
      'What does this change do for the product team that has nothing to do with security?',
      'When is the cheapest moment to ask?',
    ],
    solution:
      'A, B, C, and D. Their evidence, their framing, their sprint, their timeline. E is the ' +
      'approach that feels authoritative and achieves least: a requirement without a shared reason ' +
      'competes with work the team believes in, loses, and costs you the relationship you need for ' +
      'the next one.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option issues a requirement rather than making a case.',
      },
    ],
    debrief:
      'Get into design reviews. Everything in this module is cheaper before the thing is built, and ' +
      'the invitation is the hardest part to obtain.',
    practice: [],
  },
  {
    id: 'hrf.5.5',
    moduleId: 'hrf.5',
    packageId: 'human-risk-foundations',
    order: 5,
    title: 'Fix the cause of a recurring mistake',
    kind: 'short-answer',
    goal: 'Respond to a repeated user error with design rather than instruction.',
    prompt:
      'Staff repeatedly send files to the wrong external recipient, because the mail client ' +
      'autocompletes similar addresses. In three or four sentences, say how you would address it.',
    teach: {
      concept:
        'AUTOCOMPLETE is the feature where a mail program guesses the rest of an address as soon as ' +
        'you start typing a name, based on addresses you have used before, and offers to fill it in ' +
        'for you. This scenario is a design problem wearing the costume of a user error, and the ' +
        'giveaway is that it happens to careful people repeatedly.\n\n' +
        'The mechanism is autocomplete offering a similar-looking address and the person confirming ' +
        'what they expected to see rather than what is actually on the screen, which is how ' +
        'attention works rather than a failure of it. Telling people to check more carefully ' +
        'addresses none of it, because they believe they already did.\n\n' +
        'The design responses are well established. A CONFIRMATION for external recipients on ' +
        'messages with attachments, fired rarely enough to be read. DELAYED SEND, giving a short ' +
        'window to recall, which turns an irreversible mistake into a recoverable one and is ' +
        'popular with users. Clearing STALE AUTOCOMPLETE entries so the wrong address stops being ' +
        'offered. And WARNING ON UNUSUAL RECIPIENTS, meaning somebody this person has not emailed ' +
        'before, which is specific enough to be read.\n\n' +
        'A good answer identifies autocomplete as the mechanism, proposes a specific design change ' +
        'such as delayed send or an external-recipient confirmation, and does not rely on telling ' +
        'people to be careful.',
    },
    hints: [
      'It keeps happening to careful people. What does that tell you about the cause?',
      'What would make the mistake recoverable rather than preventing it?',
      'A good answer names autocomplete as the mechanism and proposes a design change such as delayed send or a confirmation for external recipients, rather than more instruction.',
    ],
    solution:
      'This is not carelessness, it is autocomplete offering a similar address and the person ' +
      'confirming what they expected to see, which is how attention works and is why it keeps ' +
      'happening to people who are being careful. Asking them to check harder will not change it, ' +
      'so I would change the mechanism: a short delayed-send window so a mistake is recoverable ' +
      'rather than final, and a confirmation when a message with an attachment goes to an external ' +
      'recipient the sender has not emailed before, which is rare enough that people will actually ' +
      'read it. I would also have stale autocomplete entries cleared, so the wrong address stops ' +
      'being offered in the first place. If those are in place I would expect the rate to fall ' +
      'without any communication at all, and I would measure it rather than assume.',
    expectedOutput:
      'An answer identifying autocomplete as the mechanism and proposing a design change such as ' +
      'delayed send or an external-recipient confirmation, rather than more instruction.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['autocomplete', 'suggested address', 'expected to see', 'not carelessness', 'mechanism'],
          ['delayed send', 'recall', 'undo', 'confirmation', 'warning', 'clear'],
          ['without', 'not ask', 'check harder', 'measure', 'communication'],
        ],
        hint:
          'Three ideas: the mechanism behind the mistake, a specific design change, and not relying ' +
          'on telling people to be careful.',
      },
    ],
    debrief:
      'Delayed send is popular with users, which is the tell that it is the right kind of ' +
      'intervention. Security changes people actively like are rare and worth collecting.',
    practice: [],
  },
];

// --- Module hrf.6: communicating so people listen ----------------------------

const MODULE_HRF_6: Exercise[] = [
  {
    id: 'hrf.6.1',
    moduleId: 'hrf.6',
    packageId: 'human-risk-foundations',
    order: 1,
    title: 'Write for somebody who is busy',
    kind: 'multiple-choice',
    goal: 'Produce security communication that gets read and acted on.',
    prompt:
      'You need to tell the organisation about a live phishing campaign. Which of the following ' +
      'make the message more effective? Select all that apply.',
    teach: {
      concept:
        'Security communication competes with everything else in somebody inbox, meeting invites, ' +
        'customer requests, their actual job, and it usually loses, so it has to earn attention in ' +
        'the first line or it will not be read at all.\n\n' +
        'What works: leading with WHAT TO DO, because the action is the point and burying it under ' +
        'context guarantees it is missed. Being SPECIFIC about what the recipient will see, so ' +
        'recognition is possible: a subject line and a sender pattern beat "be vigilant". Being ' +
        'SHORT, because length is read as importance only by the author. And saying WHY IT MATTERS ' +
        'HERE in one clause, since relevance is what makes somebody finish the sentence.\n\n' +
        'What fails is the generic vigilance reminder, which asks for a permanent state nobody can ' +
        'sustain and gives no way to act. "Be alert to phishing" has no recipient behaviour ' +
        'attached to it at all.\n\n' +
        'The other failure is volume. A team that sends something weekly is filtered within a ' +
        'month, and the message that genuinely mattered arrives into a folder nobody opens. ' +
        'Scarcity is part of the design.',
    },
    options: [
      { id: 'a', label: 'Leading with the action you want, rather than with background.' },
      { id: 'b', label: 'Being specific about what the recipient will actually see.' },
      { id: 'c', label: 'Being short, because length signals importance only to the author.' },
      { id: 'd', label: 'Sending rarely, so that a message from your team is worth opening.' },
      { id: 'e', label: 'Including a general reminder to remain vigilant about all cyber threats.' },
    ],
    hints: [
      'Four help. One asks for a state rather than an action.',
      'What exactly does somebody do differently after reading "be vigilant"?',
      'What happens to a sender who emails everybody every week?',
    ],
    solution:
      'A, B, C, and D. Action first, specific detail, brevity, and scarcity. E is the filler that ' +
      'appears in almost every security communication and carries no behaviour: nobody can act on ' +
      'it, it dilutes the specific instruction next to it, and its presence signals that the ' +
      'message was written to be sent rather than to be used.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option is a general vigilance reminder with no action attached.',
      },
    ],
    debrief:
      'Cut the vigilance sentence from everything you write. It is always there, it never does ' +
      'anything, and removing it makes the real instruction more visible.',
    practice: [],
  },
  {
    id: 'hrf.6.2',
    moduleId: 'hrf.6',
    packageId: 'human-risk-foundations',
    order: 2,
    title: 'Fear, and why it stops working',
    kind: 'multiple-choice',
    goal: 'Judge when alarming messaging helps and when it backfires.',
    prompt:
      'A colleague wants to open the awareness campaign with breach statistics and images of ' +
      'hooded figures. Which of the following are accurate? Select all that apply.',
    teach: {
      concept:
        'Fear-based messaging is the default aesthetic of security marketing and it is a poor tool ' +
        'for behaviour change, for reasons that are well documented.\n\n' +
        'Fear only motivates when the audience also believes they CAN DO SOMETHING effective. ' +
        'Raise the threat without raising perceived capability and people disengage, because the ' +
        'comfortable response to a large threat you cannot affect is to stop thinking about it. A ' +
        'message that makes the problem sound enormous and offers one small action is therefore ' +
        'worse than one that makes it sound manageable and offers the same action.\n\n' +
        'It also HABITUATES fast, meaning people get used to it and stop reacting: the second ' +
        'alarming campaign lands weaker than the first, and by the fourth it is background noise. ' +
        'And the imagery is actively unhelpful, because a hooded figure creates a mental picture of a ' +
        'menacing outsider that does not match what a real attack actually looks like, a plausible, ' +
        'ordinary-looking email from a supplier, so people fail to recognise the real thing when it ' +
        'arrives.\n\n' +
        'What works better is competence and specificity: here is what this looks like, here is ' +
        'what you do, here is what happened when a colleague did it. Concrete beats frightening.',
    },
    options: [
      { id: 'a', label: 'Fear motivates only when people also believe there is something effective they can do.' },
      { id: 'b', label: 'Raising threat without raising capability produces disengagement rather than action.' },
      { id: 'c', label: 'Alarming messaging habituates quickly, so each campaign lands weaker than the last.' },
      { id: 'd', label: 'The hooded-figure imagery builds a mental model that does not match real attacks.' },
      { id: 'e', label: 'Stronger fear reliably produces stronger behaviour change.' },
    ],
    hints: [
      'Four are accurate. One states the assumption the others contradict.',
      'What do people do when told about a threat they feel unable to affect?',
      'Does a hooded figure look like an email from a supplier?',
    ],
    solution:
      'A, B, C, and D. Fear needs efficacy, threat without capability disengages, alarm habituates, ' +
      'and the imagery misleads. E is the assumption the security industry runs on and the evidence ' +
      'does not support it: past a modest level, additional fear reduces engagement rather than ' +
      'increasing it, particularly when the recommended action feels small relative to the threat ' +
      'described.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option asserts that more fear produces more behaviour change.',
      },
    ],
    debrief:
      'The imagery point is worth pushing on. Every stock photo of a hooded figure teaches people ' +
      'to look for the wrong thing, and the actual attack arrives as a polite request about an ' +
      'invoice.',
    practice: [],
  },
  {
    id: 'hrf.6.3',
    moduleId: 'hrf.6',
    packageId: 'human-risk-foundations',
    order: 3,
    title: 'Segment the audience',
    kind: 'multiple-choice',
    goal: 'Send different things to different populations, for reasons.',
    prompt:
      'Which of the following are good reasons to send different security communication to ' +
      'different groups? Select all that apply.',
    teach: {
      concept:
        'SEGMENTATION means splitting your audience into groups and sending each group something ' +
        'tailored to them, rather than one identical message to everybody. One message to everybody ' +
        'is easy to produce and is relevant to almost nobody, which is why it is ignored. ' +
        'Segmentation costs more effort and is most of the difference between a communications ' +
        'function and a broadcast one that just shouts the same thing at everyone.\n\n' +
        'Useful segments. By THREAT: finance sees invoice fraud, HR sees malicious attachments ' +
        'hidden in job applications, developers see attacks aimed at the code libraries and ' +
        'repositories (shared code storage systems) they work with, and each of those deserves its ' +
        'own specific message rather than a paragraph in a general one. By CONSEQUENCE: PRIVILEGED ' +
        'USERS, meaning people whose accounts have broader-than-normal system access such as IT ' +
        'administrators, need to know why extra controls apply to them, and hearing it framed as ' +
        'reflecting their importance rather than their suspiciousness matters. By CONTEXT: remote and ' +
        'staff face different physical and network risks from office staff. And by LANGUAGE and ' +
        'accessibility, because a message somebody cannot comfortably read is not a message.\n\n' +
        'What is not a good segmentation is by past clicking, for the reasons the simulation module ' +
        'covered: it targets by history rather than consequence and it signals suspicion to the ' +
        'people whose reporting you most need.',
    },
    options: [
      { id: 'a', label: 'By threat, because finance, HR and developers see genuinely different attacks.' },
      { id: 'b', label: 'By consequence, so privileged users understand why extra controls apply to them.' },
      { id: 'c', label: 'By context, since remote and field staff face different risks from office staff.' },
      { id: 'd', label: 'By language and accessibility, because an unreadable message is not a message.' },
      { id: 'e', label: 'By who has clicked a simulation before, so the most susceptible get more messaging.' },
    ],
    hints: [
      'Four are good reasons. One repeats a targeting mistake from an earlier module.',
      'What does it signal to somebody to receive extra security messaging after a click?',
      'Which segmentation is about the attack, and which is about the person?',
    ],
    solution:
      'A, B, C, and D. Threat, consequence, context and accessibility all produce genuinely ' +
      'different messages. E segments by history, which predicts poorly and signals suspicion to ' +
      'exactly the people whose reporting behaviour you are trying to protect. Segment by what ' +
      'somebody will face, not by what they once did.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option segments by past clicking, which signals suspicion and predicts poorly.',
      },
    ],
    debrief:
      'Threat-based segmentation is the easiest win. Finance already knows invoice fraud is aimed ' +
      'at them, and a message that says so specifically gets read where a general one does not.',
    practice: [],
  },
  {
    id: 'hrf.6.4',
    moduleId: 'hrf.6',
    packageId: 'human-risk-foundations',
    order: 4,
    title: 'Getting leaders to carry it',
    kind: 'multiple-choice',
    goal: 'Use leadership behaviour, which moves norms further than any campaign.',
    prompt:
      'Which of the following make leadership involvement genuinely useful? Select all that apply.',
    teach: {
      concept:
        'People take cues from what leaders DO, and almost none from what leaders are quoted as ' +
        'saying in a newsletter they did not write.\n\n' +
        'What is useful: leaders VISIBLY FOLLOWING the same controls, including the inconvenient ' +
        'ones, because an executive exempted from MFA teaches the whole organisation what the ' +
        'policy is really worth. Leaders REPORTING and saying they did, which makes reporting safe ' +
        'for people who fear looking foolish. Leaders BACKING THE PROCESS when somebody follows it ' +
        'inconveniently, such as a finance clerk who delayed a payment to verify it, because that ' +
        'one public moment is worth more than a year of campaigns. And leaders ASKING ABOUT ' +
        'REPORTING RATES rather than click rates, which tells the organisation which behaviour ' +
        'counts.\n\n' +
        'What is not useful is a quote in a newsletter, which everybody recognises as written by ' +
        'the security team, and which carries none of the signal that behaviour does.',
    },
    options: [
      { id: 'a', label: 'Leaders visibly following the same controls, including the inconvenient ones.' },
      { id: 'b', label: 'Leaders reporting suspicious messages and saying publicly that they did.' },
      { id: 'c', label: 'Leaders backing somebody who followed the process inconveniently, such as delaying a payment to verify it.' },
      { id: 'd', label: 'Leaders asking about reporting rates rather than click rates.' },
      { id: 'e', label: 'A supportive quote from the chief executive in the security newsletter.' },
    ],
    hints: [
      'Four are useful. One is the standard ask and carries almost no signal.',
      'What does an executive exempted from MFA teach everybody?',
      'Which of these would a junior person actually notice?',
    ],
    solution:
      'A, B, C, and D. Visible compliance, visible reporting, public backing of somebody who ' +
      'followed the process, and asking about the right metric. E is what most programmes request ' +
      'and it changes nothing: everybody knows who wrote it, and a quote costs a leader nothing, ' +
      'which is precisely why it signals nothing. Ask for the behaviour instead.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option asks for a newsletter quote rather than a behaviour.',
      },
    ],
    debrief:
      'Option C is the one to engineer deliberately. Find the case where somebody followed the ' +
      'process at a cost, and get a leader to thank them publicly. It is the cheapest norm change ' +
      'available.',
    practice: [],
  },
  {
    id: 'hrf.6.5',
    moduleId: 'hrf.6',
    packageId: 'human-risk-foundations',
    order: 5,
    title: 'Write the campaign notice',
    kind: 'short-answer',
    goal: 'Write a live-threat message somebody will read and act on.',
    prompt:
      'A phishing campaign is hitting the organisation now, impersonating an internal IT password ' +
      'expiry notice. In three or four sentences, write the message you would send to all staff.',
    teach: {
      concept:
        'This is the highest-value writing this discipline does and it has to be readable in ten ' +
        'seconds by somebody who did not want to read it.\n\n' +
        'Lead with the ACTION: report it, do not enter your password. Then the RECOGNITION detail, ' +
        'so people can identify it: what the subject looks like, what it asks for, what it looks ' +
        'like to receive. Then how to REPORT, precisely, naming the button rather than describing ' +
        'the concept. And a short line making reporting SAFE, especially for anybody who has ' +
        'already clicked, because those are the people you most need to hear from and they are the ' +
        'least likely to come forward.\n\n' +
        'Leave out the background about phishing generally, the statistics, and the vigilance ' +
        'sentence. There is a live campaign and the reader has about ten seconds.\n\n' +
        'A good answer leads with the action, gives specific recognisable detail, names the ' +
        'reporting route, and explicitly reassures anybody who already clicked.',
    },
    hints: [
      'Ten seconds. What goes in the first line?',
      'Who most needs to contact you, and what is stopping them?',
      'A good answer leads with the action, gives a specific recognition cue, names the reporting route, and reassures anybody who already clicked that they should come forward.',
    ],
    solution:
      'If you receive an email saying your password expires today and asking you to sign in to ' +
      'keep it active, do not enter your password: report it with the Report Phishing button in ' +
      'Outlook. It is going to a lot of people right now, it looks like it comes from IT, and the ' +
      'link goes to a sign-in page that looks exactly like ours. We will never ask you to confirm ' +
      'your password from an email link. If you have already entered your password, please tell us ' +
      'straight away on the service desk number: nobody is in trouble, and telling us quickly is ' +
      'what lets us stop it.',
    expectedOutput:
      'A message leading with the action, giving a specific recognition cue, naming the reporting ' +
      'route, and explicitly reassuring anybody who already clicked.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['do not enter', 'report it', 'do not sign in', 'report phishing'],
          ['looks like', 'says your password', 'expires', 'sign-in page', 'from it'],
          ['already', 'nobody is in trouble', 'tell us', 'not in trouble', 'straight away'],
        ],
        hint:
          'Three parts: the action first, something specific enough to recognise, and a line making ' +
          'it safe for somebody who already clicked to come forward.',
      },
    ],
    debrief:
      'The last sentence is the one that gets you the information you need. People who have already ' +
      'entered a password are the most valuable and most frightened audience for this message.',
    practice: [],
  },
];

// --- Module hrf.7: the risks that are not phishing ---------------------------

const MODULE_HRF_7: Exercise[] = [
  {
    id: 'hrf.7.1',
    moduleId: 'hrf.7',
    packageId: 'human-risk-foundations',
    order: 1,
    title: 'Human risk beyond the inbox',
    kind: 'multiple-choice',
    goal: 'Widen the programme past the one threat everybody measures.',
    prompt:
      'Which of the following are human risks worth addressing alongside phishing? Select all that ' +
      'apply.',
    teach: {
      concept:
        'SOCIAL ENGINEERING is the general term for tricking a person, rather than a computer, into ' +
        'doing something that helps an attacker: phishing is one form of it, but not the only one. ' +
        'Phishing dominates this discipline because it is easy to simulate and easy to count, not ' +
        'because it is the only human risk that matters.\n\n' +
        'Worth attention. DATA HANDLING: what people put into external tools, share externally, or ' +
        'take with them when they leave, which has grown enormously as work moved into services ' +
        'the organisation does not control. PHYSICAL and social access: TAILGATING, meaning ' +
        'following a legitimate employee through a secure door without badging in yourself, along ' +
        'with unattended unlocked screens and unchallenged visitors, all unfashionable topics and ' +
        'still effective attacks. VOICE and messaging social engineering, meaning phone calls and ' +
        'text messages rather than email, which is rising sharply because it bypasses email controls ' +
        'entirely and is far harder to filter automatically. And UNINTENTIONAL DISCLOSURE, meaning ' +
        'publicly about systems, projects and colleagues, which is the raw material for the ' +
        'targeted attacks that actually work.\n\n' +
        'What is a different discipline is malicious insider activity. It overlaps, and it is ' +
        'primarily a monitoring, HR and legal matter rather than an awareness one, and awareness ' +
        'programmes that present themselves as the answer to it tend to produce surveillance ' +
        'framing that damages the trust the rest of the programme depends on.',
    },
    options: [
      { id: 'a', label: 'Data handling: what people put into external tools and take with them when they leave.' },
      { id: 'b', label: 'Physical and social access, such as tailgating and unattended screens.' },
      { id: 'c', label: 'Voice and messaging social engineering, which bypasses email controls entirely.' },
      { id: 'd', label: 'Unintentional public disclosure that gives attackers material for targeting.' },
      { id: 'e', label: 'Malicious insider activity, which the awareness programme should own and address directly.' },
    ],
    hints: [
      'Four belong to awareness. One belongs mostly to other functions.',
      'Which of these is a monitoring and HR problem more than a communication one?',
      'What does framing your programme around catching malicious insiders do to trust?',
    ],
    solution:
      'A, B, C, and D. Data handling, physical, voice, and disclosure are all behaviour and all ' +
      'improvable through this function. E overlaps and is not primarily yours: deliberate ' +
      'malicious activity is addressed through monitoring, HR process and legal channels, and an ' +
      'awareness programme that positions itself as insider-threat detection acquires a ' +
      'surveillance flavour that costs it the reporting culture everything else depends on.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option gives the awareness programme ownership of deliberate malicious insider ' +
          'activity.',
      },
    ],
    debrief:
      'Voice-based social engineering is where the attention is going. It defeats every email ' +
      'control, it is increasingly convincing, and almost no organisation has trained anybody for a ' +
      'phone call.',
    practice: [],
  },
  {
    id: 'hrf.7.2',
    moduleId: 'hrf.7',
    packageId: 'human-risk-foundations',
    order: 2,
    title: 'Data going where it should not',
    kind: 'multiple-choice',
    goal: 'Address data handling as behaviour rather than as a policy statement.',
    prompt:
      'Staff are pasting customer data into an external AI assistant. Which of the following are ' +
      'sound responses? Select all that apply.',
    teach: {
      concept:
        'An external AI assistant here means a chat tool run by an outside company, not one the ' +
        'organisation controls or has reviewed, so nobody can say for certain what happens to ' +
        'anything typed into it afterwards. Staff using one to speed up their work with customer data ' +
        'is the current version of a very old problem, and the old lessons apply directly.\n\n' +
        'People are doing it because it makes their work faster and nothing sanctioned does the ' +
        'same job, which is a requirement statement. Blocking without an alternative produces the ' +
        'usual result: the behaviour moves to personal devices and personal accounts, where you ' +
        'cannot see it at all.\n\n' +
        'What works: PROVIDE A SANCTIONED OPTION with appropriate terms, so the useful thing is ' +
        'available in a controlled form. Be SPECIFIC about what may and may not go into it, because ' +
        '"do not paste confidential data" is unusable when somebody is holding a support ticket ' +
        'and is not sure whether a customer name counts. Give a CLEAR ROUTE TO ASK, since the ' +
        'ambiguous cases are constant. And MEASURE what is actually happening rather than ' +
        'assuming, because the volume tells you how badly the requirement is unmet.\n\n' +
        'A policy line saying it is prohibited, with no alternative and no examples, is the ' +
        'response that produces confident non-compliance.',
    },
    options: [
      { id: 'a', label: 'Provide a sanctioned option with appropriate terms, so the useful capability exists in controlled form.' },
      { id: 'b', label: 'Be specific about what may and may not go in, with examples rather than the word confidential.' },
      { id: 'c', label: 'Give people an easy route to ask about ambiguous cases.' },
      { id: 'd', label: 'Measure actual usage, since the volume indicates how unmet the requirement is.' },
      { id: 'e', label: 'Publish a policy prohibiting it, and treat the matter as addressed.' },
    ],
    hints: [
      'Four are sound. One states a rule and stops.',
      'Where does the behaviour go when you block it without an alternative?',
      'Is "do not paste confidential data" usable by somebody holding a support ticket?',
    ],
    solution:
      'A, B, C, and D. Provide the capability, be concrete, make asking easy, and measure. E is ' +
      'the response that feels decisive and changes only the visibility: the work still needs ' +
      'doing, the tool is a browser tab away on a personal device, and the organisation has ' +
      'exchanged a manageable problem for an invisible one plus a policy it is now violating.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option publishes a prohibition and treats the problem as solved.',
      },
    ],
    debrief:
      'The specificity point generalises. Every data-handling rule that uses the word confidential ' +
      'without examples is unusable at the moment somebody has to apply it.',
    practice: [],
  },
  {
    id: 'hrf.7.3',
    moduleId: 'hrf.7',
    packageId: 'human-risk-foundations',
    order: 3,
    title: 'Physical and voice social engineering',
    kind: 'multiple-choice',
    goal: 'Prepare people for the approaches that do not arrive by email.',
    prompt:
      'Which of the following help against in-person and telephone social engineering? Select all ' +
      'that apply.',
    teach: {
      concept:
        'These attacks work because they exploit the social cost of refusing, and the defence has ' +
        'to remove that cost rather than ask people to absorb it.\n\n' +
        'What helps: giving people PERMISSION explicitly and publicly, so that challenging somebody ' +
        'or refusing a caller is backed by the organisation rather than risky to the individual. ' +
        'Providing a SCRIPT, because the hard part is not knowing that you should verify, it is ' +
        'finding the words while somebody is standing there being pleasant. A CALLBACK NORM, so ' +
        'that hanging up and dialling a known number is the standard rather than an accusation. ' +
        'And REMOVING THE JUDGEMENT where possible: a door that cannot be tailgated, or a help desk ' +
        'process that requires verification regardless of who asks.\n\n' +
        'What fails is telling people to be suspicious of visitors and callers. It asks them to ' +
        'absorb the social cost personally, against somebody trained to make refusing feel rude, ' +
        'and it is why these attacks keep working on people who know exactly how they work.',
    },
    options: [
      { id: 'a', label: 'Explicit, public permission to challenge or refuse, so it is backed rather than risky.' },
      { id: 'b', label: 'A script, because the difficulty is finding the words in the moment.' },
      { id: 'c', label: 'A callback norm, so hanging up and dialling a known number is standard rather than an accusation.' },
      { id: 'd', label: 'Removing the judgement where possible, such as doors that cannot be tailgated.' },
      { id: 'e', label: 'Telling staff to be suspicious of unknown visitors and callers.' },
    ],
    hints: [
      'Four help. One asks somebody to personally absorb a social cost.',
      'What is actually hard about refusing somebody standing in front of you holding boxes?',
      'Which of these means the individual is not the one taking the risk?',
    ],
    solution:
      'A, B, C, and D. Permission, script, norm and design each remove the personal cost of doing ' +
      'the right thing. E is the standard advice and it fails for a specific reason: the person ' +
      'knows they should verify, and refusing feels rude to somebody who has been trained to make ' +
      'it feel rude, so what they need is cover and words rather than information.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option asks individuals to be suspicious, which leaves the social cost with them.',
      },
    ],
    debrief:
      'The script is the underrated one. "I will call you back on the number we have on file" is ' +
      'polite, hard to argue with, and defeats the attack. Give people the sentence.',
    practice: [],
  },
  {
    id: 'hrf.7.4',
    moduleId: 'hrf.7',
    packageId: 'human-risk-foundations',
    order: 4,
    title: 'Onboarding and offboarding as moments',
    kind: 'multiple-choice',
    goal: 'Use the points where people are actually paying attention.',
    prompt:
      'Which of the following make good use of joining and leaving as moments for human risk work? ' +
      'Select all that apply.',
    teach: {
      concept:
        'Attention is scarce and unevenly distributed, and there are a few moments when people are ' +
        'genuinely receptive. Joining is the strongest: somebody is actively learning how things ' +
        'work here and forming habits that will persist for years.\n\n' +
        'What to use it for: the REPORTING ROUTE, taught by using it once rather than described, so ' +
        'the reflex exists before it is needed. The NORMS, stated plainly, including that reporting ' +
        'is expected and never punished, because a new joiner is deciding what kind of place this ' +
        'is. And ROLE-SPECIFIC risk for the ones that matter, delivered by their own team rather ' +
        'than by security, which lands better and takes less of your time.\n\n' +
        'Leaving is a different opportunity and mostly a data one: a conversation about what people ' +
        'may and may not take, which reduces the genuinely common case of somebody copying their ' +
        'own work in good faith, and which is far more effective delivered as a normal part of ' +
        'leaving than as an accusation.\n\n' +
        'What does not work is loading everything into induction. A new joiner is drowning, and ' +
        'security competing with payroll and fire safety for a two-hour slot is remembered by ' +
        'nobody.',
    },
    options: [
      { id: 'a', label: 'Teaching the reporting route by having somebody use it once, rather than describing it.' },
      { id: 'b', label: 'Stating the norms plainly, including that reporting is expected and not punished.' },
      { id: 'c', label: 'Role-specific risk delivered by the person own team rather than by security.' },
      { id: 'd', label: 'A leaving conversation about what may and may not be taken, framed as routine.' },
      { id: 'e', label: 'Covering the entire security curriculum during induction week, while attention is high.' },
    ],
    hints: [
      'Four make good use of it. One overloads the moment.',
      'How much does anybody remember from an induction week?',
      'Which of these creates a reflex rather than a memory?',
    ],
    solution:
      'A, B, C, and D. Practising the reporting route, setting norms, devolving role-specific ' +
      'content, and a routine leaving conversation. E misreads the moment: induction attention is ' +
      'high and induction capacity is not, security is competing with everything else the person ' +
      'has to absorb, and a comprehensive session is remembered as a blur.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option tries to deliver the whole curriculum during induction.',
      },
    ],
    debrief:
      'Having a new joiner actually press the report button on a harmless test message in their ' +
      'first week is worth more than any module. The reflex is what you are building.',
    practice: [],
  },
  {
    id: 'hrf.7.5',
    moduleId: 'hrf.7',
    packageId: 'human-risk-foundations',
    order: 5,
    title: 'Respond to a near miss',
    kind: 'short-answer',
    goal: 'Turn a caught attempt into something the organisation learns from.',
    prompt:
      'A finance clerk received a convincing request to change a supplier bank account, followed ' +
      'the callback procedure, and stopped a fraud attempt. In three or four sentences, say what ' +
      'you do with that.',
    teach: {
      concept:
        'Near misses are the most under-used material in this discipline. They are real, they ' +
        'happened here, they have a hero rather than a victim, and nobody has to be embarrassed.\n\n' +
        'RECOGNISE the person, publicly if they are comfortable and through their manager either ' +
        'way, quickly. The visible consequence of following the process being praise is worth more ' +
        'than any campaign, and it is the norm-setting move from the earlier module made concrete.\n\n' +
        'TELL THE STORY across the organisation, specifically: what the request looked like, what ' +
        'made it convincing, and what the clerk did. That is recognisable and memorable in a way ' +
        'that no statistic is.\n\n' +
        'CHECK THE CONTROL: the procedure worked here, and was it followed because it is well ' +
        'designed and easy, or because this particular person is diligent? If the second, it will ' +
        'fail next time with somebody else, and that is the finding.\n\n' +
        'And FEED IT BACK to the security team as intelligence: who was targeted, how, and whether ' +
        'others received it.\n\n' +
        'A good answer recognises the person, shares the specific story, and asks whether the ' +
        'control would hold with somebody less diligent.',
    },
    hints: [
      'This is the best material you will get all year. What are the uses?',
      'The procedure worked. What is the question that stops you being complacent about that?',
      'A good answer recognises the person quickly, tells the specific story across the organisation, and asks whether the process would have held with a less diligent person.',
    ],
    solution:
      'First I would make sure the clerk is recognised quickly and visibly, through their manager ' +
      'and publicly if they are comfortable with it, because the most useful thing anybody can see ' +
      'is that following the process at the cost of delaying a payment gets you thanked rather ' +
      'than questioned. Then I would tell the story across the organisation with the specifics: ' +
      'what the request looked like, why it was convincing, and exactly what she did, because that ' +
      'is recognisable in a way no statistic is. I would also ask whether the callback procedure ' +
      'held because it is well designed and easy to follow or because this particular person is ' +
      'unusually careful, since if it is the second it will fail with the next person and that is ' +
      'the real finding. And I would pass the details to the security team as intelligence, to ' +
      'check whether anybody else received the same approach.',
    expectedOutput:
      'An answer recognising the person quickly, sharing the specific story, and questioning ' +
      'whether the control would hold with somebody less diligent.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['recognise', 'thank', 'publicly', 'manager', 'praise'],
          ['story', 'specifics', 'what it looked like', 'tell', 'share'],
          ['would it hold', 'less careful', 'next person', 'well designed', 'because she is', 'fail with'],
        ],
        hint:
          'Three uses: recognising the person, telling the specific story, and asking whether the ' +
          'control depends on this particular person being careful.',
      },
    ],
    debrief:
      'Collect these. A programme with three real local stories is more persuasive than one with ' +
      'every industry statistic ever published.',
    practice: [],
  },
];

// --- Module hrf.8: the programme and the career ------------------------------

const MODULE_HRF_8: Exercise[] = [
  {
    id: 'hrf.8.1',
    moduleId: 'hrf.8',
    packageId: 'human-risk-foundations',
    order: 1,
    title: 'Build the programme in order',
    kind: 'multiple-choice',
    goal: 'Sequence a human risk programme so early work makes later work possible.',
    prompt:
      'You are building a human risk programme from nothing. Which of the following belong early? ' +
      'Select all that apply.',
    teach: {
      concept:
        'There is an order, and it starts with making the right behaviour possible rather than ' +
        'with telling anybody anything.\n\n' +
        'EARLY: a working reporting route, ideally one click, because everything else depends on ' +
        'it and it is the highest-return single change. A response process behind it, so reports ' +
        'are acted on and acknowledged, since reports that vanish stop arriving. The compliance ' +
        'obligation delivered efficiently, so it is off the table. And a baseline of whatever you ' +
        'can measure, so later claims have something to compare against.\n\n' +
        'MIDDLE: targeted work on the high-consequence populations, simulations run non-punitively, ' +
        'and the first design changes.\n\n' +
        'LATER: culture work, storytelling, leadership behaviour, and the broader risks beyond ' +
        'phishing.\n\n' +
        'What does not belong early is a large campaign, because you have nothing to point people ' +
        'at and no way to handle the response. Launching awareness messaging before the reporting ' +
        'route exists produces people trying to do the right thing and finding no way to do it, ' +
        'which is worse than silence.',
    },
    options: [
      { id: 'a', label: 'A working one-click reporting route, since everything else depends on it.' },
      { id: 'b', label: 'A response process behind it, because reports that vanish stop arriving.' },
      { id: 'c', label: 'The compliance obligation delivered efficiently, to get it off the table.' },
      { id: 'd', label: 'A baseline measurement, so later claims have something to compare against.' },
      { id: 'e', label: 'A large launch campaign, to build visibility for the new programme.' },
    ],
    hints: [
      'Four belong early. One creates demand you cannot yet serve.',
      'What happens when somebody tries to report and there is no route?',
      'Which of these has to exist before any messaging is worth sending?',
    ],
    solution:
      'A, B, C, and D. The route, the response behind it, the compliance obligation cleared, and a ' +
      'baseline. E is the instinct to resist: a launch campaign before the reporting route exists ' +
      'generates people trying to comply and failing, which teaches them that engaging with ' +
      'security is futile. Build the road before you advertise the destination.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option launches a campaign before there is a way for people to act on it.',
      },
    ],
    debrief:
      'If you inherit a programme with campaigns but no reporting button, that is the whole ' +
      'diagnosis. Build the button and the numbers move before you send anything.',
    practice: [],
  },
  {
    id: 'hrf.8.2',
    moduleId: 'hrf.8',
    packageId: 'human-risk-foundations',
    order: 2,
    title: 'Who you have to work with',
    kind: 'multiple-choice',
    goal: 'Identify the relationships this function depends on.',
    prompt:
      'Which of the following relationships does a human risk programme genuinely depend on? ' +
      'Select all that apply.',
    teach: {
      concept:
        'This role has almost no authority and reaches the entire organisation, so it runs on ' +
        'relationships more than any other security function.\n\n' +
        'INTERNAL COMMUNICATIONS control the channels, know what people actually read, and can stop ' +
        'you sending something clumsy. They are the most useful and least contacted partner most ' +
        'awareness teams have. HR own induction, leaving, policy and the disciplinary line, and ' +
        'they have to be involved in anything punitive-adjacent, including simulation design. LEGAL ' +
        'and privacy matter because simulations and monitoring have consent and data implications ' +
        'that vary by jurisdiction, and getting this wrong is a genuine problem in several ' +
        'countries.\n\n' +
        'The SECURITY OPERATIONS team is the other half of reporting: they act on what people ' +
        'report, and if they do not act visibly the reporting rate falls. And the SERVICE DESK is ' +
        'where people actually go when confused, which makes them your best source of signal and ' +
        'your most useful ally.\n\n' +
        'What is not a dependency is a large budget. The highest-return items in this package, a ' +
        'report button, a non-punitive policy, a leader thanking somebody, cost almost nothing.',
    },
    options: [
      { id: 'a', label: 'Internal communications, who control the channels and know what people read.' },
      { id: 'b', label: 'HR, who own induction, leaving, policy and anything punitive-adjacent.' },
      { id: 'c', label: 'Legal and privacy, because simulations and monitoring carry consent implications.' },
      { id: 'd', label: 'The service desk, who see where people are actually confused.' },
      { id: 'e', label: 'A large dedicated budget, without which the programme cannot make progress.' },
    ],
    hints: [
      'Four are dependencies. One is not, and this package has been demonstrating why.',
      'What did the highest-return interventions in module five cost?',
      'Who has to approve a simulation lure?',
    ],
    solution:
      'A, B, C, and D. Communications, HR, legal and the service desk are all genuine dependencies ' +
      'and all cheap to build. E is not: the highest-return items here are a reporting button, a ' +
      'published non-punitive policy, and a leader thanking somebody publicly, none of which needs ' +
      'significant money. Budget helps and its absence is not the reason a programme fails.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats a large budget as a precondition, which the cheap high-return ' +
          'interventions contradict.',
      },
    ],
    debrief:
      'Take internal communications for coffee in your first week. They will tell you what people ' +
      'actually read, and they will stop you sending the message that would have cost you a year of ' +
      'goodwill.',
    practice: [],
  },
  {
    id: 'hrf.8.3',
    moduleId: 'hrf.8',
    packageId: 'human-risk-foundations',
    order: 3,
    title: 'Simulations, consent and the law',
    kind: 'multiple-choice',
    goal: 'Know which parts of this work have legal and ethical constraints.',
    prompt:
      'Which of the following are genuine constraints worth checking before running simulations or ' +
      'behavioural monitoring? Select all that apply.',
    teach: {
      concept:
        'This work involves deceiving employees and processing data about their behaviour, and both ' +
        'have limits that vary considerably by country and by employer.\n\n' +
        'Things to check. WORKS COUNCILS and employee representative bodies, which in several ' +
        'European countries have a formal right to be consulted about monitoring and about ' +
        'measures affecting employees, and proceeding without them can invalidate the programme. ' +
        'DATA PROTECTION, because per-individual click and report data is personal data, so ' +
        'purpose, retention and access all need deciding rather than defaulting. EMPLOYMENT ' +
        'IMPLICATIONS, since results used in performance or disciplinary processes change the ' +
        'legal character of the exercise entirely. And LOCAL VARIATION, because a programme that ' +
        'is fine in one jurisdiction may be unlawful in another the same company operates in.\n\n' +
        'None of this makes simulations impossible; they are run lawfully everywhere. It means the ' +
        'design has to be agreed with legal, HR and where applicable employee representatives ' +
        'first, and that individual results are handled with far more care than most programmes ' +
        'apply.',
    },
    options: [
      { id: 'a', label: 'Works councils or employee representatives, who in some countries must be consulted.' },
      { id: 'b', label: 'Data protection, since per-individual click and report data is personal data.' },
      { id: 'c', label: 'Employment implications, if results ever reach performance or disciplinary processes.' },
      { id: 'd', label: 'Local variation, because a design lawful in one country may not be in another.' },
      { id: 'e', label: 'None of it applies, because employees consented by accepting the acceptable use policy.' },
    ],
    hints: [
      'Four are genuine. One relies on a blanket consent that does not cover this.',
      'Does accepting an acceptable use policy amount to consent to be deceived and measured?',
      'Which of these varies between countries within the same company?',
    ],
    solution:
      'A, B, C, and D. Representation, data protection, employment consequences, and jurisdictional ' +
      'variation. E is the assumption that gets programmes into difficulty: an acceptable use ' +
      'policy is not blanket consent to deception and behavioural measurement, consent obtained ' +
      'through an employment relationship is treated cautiously in several regimes anyway, and this ' +
      'is exactly the kind of question to put to legal rather than to answer yourself.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option treats an acceptable use policy as blanket consent for deception and ' +
          'measurement.',
      },
    ],
    debrief:
      'Ask legal early and in writing. It costs a week once and it is the difference between a ' +
      'programme and an employment dispute.',
    practice: [],
  },
  {
    id: 'hrf.8.4',
    moduleId: 'hrf.8',
    packageId: 'human-risk-foundations',
    order: 4,
    title: 'Where this career comes from and goes',
    kind: 'multiple-choice',
    goal: 'Understand the field, its entry routes and its direction.',
    prompt:
      'Which of the following are accurate about security awareness and human risk as a career? ' +
      'Select all that apply.',
    teach: {
      concept:
        'It is an unusual security career and one of the most accessible from outside the ' +
        'industry.\n\n' +
        'The ENTRY ROUTES are wide: communications, learning and development, HR, psychology, ' +
        'marketing and teaching all transfer strongly, because the scarce skills are writing, ' +
        'campaign design, stakeholder management and measurement rather than technical depth. The ' +
        'security content is learnable; the ability to make an organisation of eight thousand ' +
        'people pay attention is not, and is what employers struggle to hire.\n\n' +
        'The FIELD IS MATURING away from annual training and click rates towards behaviour and ' +
        'design, which is why the vocabulary is shifting to human risk management. That is genuine ' +
        'and it is uneven: plenty of organisations still buy the annual module and measure clicks.\n\n' +
        'It is BUSINESS HOURS, campaign-shaped work with peaks around training cycles and ' +
        'incidents. It LEADS towards human risk management, security culture roles, broader ' +
        'security communications, and in some organisations into governance and risk.\n\n' +
        'The honest caveat is that it is sometimes under-resourced and under-respected within ' +
        'security teams, and doing it well means repeatedly making a case for work whose value is ' +
        'harder to demonstrate than a firewall.',
    },
    options: [
      { id: 'a', label: 'Communications, learning, HR and psychology backgrounds transfer strongly.' },
      { id: 'b', label: 'The scarce skill is making an organisation pay attention, not technical depth.' },
      { id: 'c', label: 'The field is shifting from awareness training towards behaviour and design.' },
      { id: 'd', label: 'It can be under-resourced within security teams, and needs its value argued repeatedly.' },
      { id: 'e', label: 'It requires a technical security background, since credibility depends on it.' },
    ],
    hints: [
      'Four are accurate. One contradicts what this whole package assumes about its reader.',
      'Which half of this job is harder to hire for?',
      'The honest caveat is one of the four.',
    ],
    solution:
      'A, B, C, and D. Wide entry routes, communication as the scarce skill, a maturing field, and ' +
      'an honest caveat about resourcing. E is the belief that keeps good candidates out: the ' +
      'security content in this package is learnable in months, and the ability to design a ' +
      'campaign, write something people read, and negotiate with HR and legal is not. Technical ' +
      'literacy helps and is not the barrier.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option asserts a technical background is required, which the entry routes contradict.',
      },
    ],
    debrief:
      'If you came here from communications or learning, you have the half that cannot be taught ' +
      'quickly. The rest of this catalogue is where you pick up the other half.',
    practice: [],
  },
  {
    id: 'hrf.8.5',
    moduleId: 'hrf.8',
    packageId: 'human-risk-foundations',
    order: 5,
    title: 'The case for your own budget',
    kind: 'short-answer',
    goal: 'Argue for investment in a function whose value is hard to demonstrate.',
    prompt:
      'You have been asked to justify continued investment in the human risk programme. In three ' +
      'or four sentences, make the case.',
    teach: {
      concept:
        'The difficulty is real: the value of this function is partly incidents that did not ' +
        'happen, which nobody can count. Pretending otherwise, or claiming a percentage risk ' +
        'reduction you cannot support, is the failure mode.\n\n' +
        'What works is arguing from what CAN be demonstrated. Reporting is measurable and it ' +
        'genuinely determines response time, so improvement in time to first report is a real ' +
        'capability improvement with a number attached. NEAR MISSES are concrete: the fraud ' +
        'attempts that were stopped by somebody following a process are countable and have amounts ' +
        'against them. And the COUNTERFACTUAL, meaning what would have happened if the control had ' +
        'not been there, is arguable at the level of a single case: this attempted transfer was for ' +
        'this much, and it was stopped here.\n\n' +
        'Then be honest about the LIMIT: you cannot prove the incidents that never started, and a ' +
        'claim you cannot defend will be tested. Saying so is what makes the rest credible.\n\n' +
        'And connect to what leadership already worries about, which is usually fraud loss, ' +
        'regulatory exposure and reputation rather than click rates.\n\n' +
        'A good answer leads with something measurable such as reporting or a stopped fraud, ' +
        'attaches a business consequence, and is honest about what cannot be proven.',
    },
    hints: [
      'You cannot count incidents that did not happen. What can you count?',
      'What did the near miss in the previous module have attached to it?',
      'A good answer leads with something measurable such as time to report or a specific stopped fraud with a value, and is honest about what cannot be proven.',
    ],
    solution:
      'The clearest thing I can show is response capability: time from a phishing campaign arriving ' +
      'to the first report has fallen from around forty minutes to under ten, and that is the ' +
      'window in which we can pull a campaign from mailboxes before most people open it, so it ' +
      'translates directly into containment rather than clean-up. Alongside that there are four ' +
      'attempted supplier frauds this year that were stopped by staff following the callback ' +
      'procedure, one of them for a six-figure amount, and those are concrete rather than ' +
      'statistical. I want to be straight about the limit: I cannot prove the incidents that never ' +
      'started, and I would not put a percentage risk reduction in front of you that I could not ' +
      'defend. What I can say is that the two things this function has actually changed, how fast ' +
      'we find out and whether people follow the payment process under pressure, are both ' +
      'measurable and both have money attached.',
    expectedOutput:
      'A case leading with a measurable capability such as time to report or specific stopped ' +
      'frauds, attaching business consequence, and stating honestly what cannot be proven.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['time to', 'reporting', 'first report', 'minutes', 'how fast we find out'],
          ['fraud', 'stopped', 'attempted', 'amount', 'money'],
          ['cannot prove', 'would not put', 'honest', 'limit', 'never started', 'not defend'],
        ],
        hint:
          'Three parts: the measurable capability, the concrete stopped losses, and an honest ' +
          'statement of what cannot be demonstrated.',
      },
    ],
    debrief:
      'The refusal to overclaim is what makes this fundable. Every awareness team that has promised ' +
      'a risk reduction percentage has been asked about it later, and the answer was never good.',
    practice: [],
  },
];

export const HUMAN_RISK_FOUNDATIONS: LearningPackage = {
  id: 'human-risk-foundations',
  order: 16,
  title: 'Security Awareness and Human Risk Foundations',
  summary:
    'The behavioural half of security: why training fails and what to do instead, how people ' +
    'actually decide under pressure, phishing simulations run ethically and read honestly, the ' +
    'metrics that improve a programme and the ones that wreck it, designing so the secure path is ' +
    'the easy one, communicating so people listen, and building a programme somebody will fund.',
  outcomes: [
    'Explain why more training rarely changes behaviour, and what does',
    'Deliver a compliance obligation efficiently without mistaking it for the programme',
    'Identify the decisions that genuinely need a person, and move the rest into technology',
    'Describe what makes a lure work, and why awareness of the mechanism does not disable it',
    'Read a workaround as a requirement statement rather than a discipline matter',
    'Run a phishing simulation that is ethical, useful, and does not suppress reporting',
    'Choose human risk metrics that reward reporting rather than silence',
    'Argue for a design change instead of another training module, and get it funded',
  ],
  /*
   * No prerequisite. The awareness track declares no Linux requirement and draws
   * from communications, HR and learning backgrounds; nothing here needs a
   * terminal, and gating it behind one would exclude the people best suited to
   * the work.
   */
  prerequisites: [],
  modules: [
    {
      id: 'hrf.1',
      packageId: 'human-risk-foundations',
      order: 1,
      title: 'Why awareness training fails',
      summary:
        'Knowing against doing, what compliance training is actually for, the harm in the weakest ' +
        'link framing, the decisions that genuinely need a person, and reviewing an incident ' +
        'without blaming one.',
      exercises: MODULE_HRF_1,
    },
    {
      id: 'hrf.2',
      packageId: 'human-risk-foundations',
      order: 2,
      title: 'How people actually decide',
      summary:
        'What makes a lure work, friction and the workarounds it produces, who is genuinely at ' +
        'risk, how norms move behaviour, and arguing for a design change.',
      exercises: MODULE_HRF_2,
    },
    {
      id: 'hrf.3',
      packageId: 'human-risk-foundations',
      order: 3,
      title: 'Phishing simulation done properly',
      summary:
        'What a simulation can and cannot establish, the ethics of the lure, what happens to ' +
        'somebody who clicks, reading the results honestly, and designing the programme.',
      exercises: MODULE_HRF_3,
    },
    {
      id: 'hrf.4',
      packageId: 'human-risk-foundations',
      order: 4,
      title: 'Measuring human risk',
      summary:
        'Reporting rate as the primary metric, the measures that damage a programme, signals ' +
        'beyond simulations, reporting to a board, and presenting a bad quarter honestly.',
      exercises: MODULE_HRF_4,
    },
    {
      id: 'hrf.5',
      packageId: 'human-risk-foundations',
      order: 5,
      title: 'Designing for the human',
      summary:
        'Making the secure path the easy one, the friction budget, warnings people read, working ' +
        'with product teams, and fixing the cause of a recurring mistake.',
      exercises: MODULE_HRF_5,
    },
    {
      id: 'hrf.6',
      packageId: 'human-risk-foundations',
      order: 6,
      title: 'Communicating so people listen',
      summary:
        'Writing for somebody busy, why fear stops working, segmenting the audience, getting ' +
        'leaders to carry it, and writing the live campaign notice.',
      exercises: MODULE_HRF_6,
    },
    {
      id: 'hrf.7',
      packageId: 'human-risk-foundations',
      order: 7,
      title: 'The risks that are not phishing',
      summary:
        'Data handling, physical and voice social engineering, joining and leaving as moments, ' +
        'and turning a near miss into something the organisation learns from.',
      exercises: MODULE_HRF_7,
    },
    {
      id: 'hrf.8',
      packageId: 'human-risk-foundations',
      order: 8,
      title: 'The programme and the career',
      summary:
        'Building in the right order, the relationships it depends on, the legal and consent ' +
        'constraints, where the career comes from and goes, and the case for your own budget.',
      exercises: MODULE_HRF_8,
    },
  ],
};
