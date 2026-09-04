/**
 * Help Desk Ticketing Foundations: how work arrives in a SOC, before it is an alert.
 *
 * WHY THIS PACKAGE EXISTS
 *
 * SOC Foundations teaches the shape of the floor and Log Analysis teaches how
 * to read what a host writes, but neither one covers the mundane machinery
 * that actually moves work through the building: a ticket. Most entry-level
 * security and IT roles run on a ticketing system every single day, and the
 * discipline of intake, triage, ownership, and closing well is exactly what
 * "show you already know the workflow" means to a hiring manager looking at a
 * portfolio project. It sits here, between SOC Foundations and Log Analysis,
 * because a ticket is often the first form an alert takes before anyone has
 * decided it is worth investigating at all.
 *
 * WHY IT NEEDS NO TERMINAL
 *
 * There is no simulated ticketing tool in this platform, and standing one up
 * (osTicket or a TopDesk-style flow, complete with a queue and SLA clocks)
 * would be a separate project. What is teachable honestly is the judgement:
 * how a vague request becomes a well-formed ticket, what actually determines
 * priority, what ownership requires beyond a name in a field, and why closing
 * a ticket badly costs the next technician real time. Every exercise grades a
 * determination, the same way a real ticketing-system project stands or falls
 * on whether the workflow behind it makes sense, not on which product ran it.
 */

import type { Exercise, LearningPackage } from '@soc/shared';

// --- Module hd.1: ticket intake -----------------------------------------------

const MODULE_HD_1: Exercise[] = [
  {
    id: 'hd.1.1',
    moduleId: 'hd.1',
    packageId: 'helpdesk-ticketing-foundations',
    order: 1,
    title: 'Where a ticket actually comes from',
    kind: 'multiple-choice',
    goal: 'Recognise that a ticket has several legitimate origins, not just a form somebody filled in.',
    prompt: 'Which of the following are legitimate ways a ticket enters a queue? Select all that apply.',
    teach: {
      concept:
        'Start from what a ticket is in the first place. Any time something needs a person\'s attention ' +
        'at work, a broken laptop, a locked account, a server running low on disk space, somebody has to ' +
        'write that problem down somewhere so it does not get forgotten and so someone can be assigned ' +
        'to fix it. That written record is a ticket, and the running list of open tickets waiting to be ' +
        'worked is called a queue, the same way a deli counter has a line of orders waiting to be ' +
        'filled. The question here is where those written records actually come from, because there is ' +
        'more than one legitimate path in. A user can write one up themselves through a website built ' +
        'for that purpose, a self-service portal. An agent can type one up while a user describes the ' +
        'problem over the phone, since not everyone wants to use a website when something is broken. A ' +
        'support email address can turn incoming messages into tickets automatically. And separately ' +
        'from any human reporting anything at all, a monitoring system, software that watches servers ' +
        'and services around the clock, can create a ticket by itself the moment something crosses a ' +
        'threshold it is watching for, a disk filling up, a service going down, an alert firing. That ' +
        'last case matters more than it looks: auto-logging means every qualifying event becomes a ' +
        'ticket whether or not a human happened to notice or bother reporting it, which is what keeps a ' +
        'queue from silently missing problems nobody happened to catch.',
    },
    options: [
      { id: 'a', label: 'A user submits a request themselves through a self-service portal.' },
      { id: 'b', label: 'An agent types up a ticket on a caller\'s behalf during a phone call.' },
      { id: 'c', label: 'A monitoring system auto-creates a ticket when a threshold or alert fires.' },
      { id: 'd', label: 'A valid ticket can only originate from a form a user filled out themselves.' },
    ],
    hints: [
      'Three describe real, common origins. One claims there is only one valid path in, which is false.',
      'What happens when a server\'s disk fills up at 3am and nobody is watching?',
    ],
    solution:
      'A, B, and C. All three are genuine ways work enters a queue, and auto-generated tickets from ' +
      'monitoring are especially important because they catch what no human happened to report. D is ' +
      'wrong: restricting intake to self-submitted forms would miss phone-reported issues and every ' +
      'automated alert entirely.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'Auto-generated tickets from monitoring are a real and important intake path, not an edge case to dismiss.',
      },
    ],
    debrief:
      'Keep the auto-generated case in mind. It is the direct link between this package and the alert ' +
      'queue you will work with in Incident Detection and Alert Triage, another package in this ' +
      'platform, where a monitoring system\'s automatic alerts are the tickets. Many of the tickets you ' +
      'will see in a security team\'s queue never had a human type a single word into them.',
    practice: [],
  },
  {
    id: 'hd.1.2',
    moduleId: 'hd.1',
    packageId: 'helpdesk-ticketing-foundations',
    order: 2,
    title: 'What a well-formed ticket captures',
    kind: 'multiple-choice',
    goal: 'Distinguish a ticket that is actually actionable from one that only looks like it is.',
    prompt: 'A user submits a ticket that just says "the system is broken, please fix." Which of the following would meaningfully improve it? Select all that apply.',
    teach: {
      concept:
        'Think about calling a friend for help fixing something and all you say is "it\'s broken." Your ' +
        'friend cannot do anything with that, they have to ask follow-up questions before they can even ' +
        'start: which thing, when did it start, what exactly happens. A ticket works the same way: ' +
        'whoever picks it up next has never seen the problem and cannot see the user\'s screen, so the ' +
        'ticket itself has to carry enough information for that person to start working without a round ' +
        'trip back to the user first. Four things do most of that work. WHO is affected, one person, one ' +
        'team, or the whole building. WHAT specifically is happening, ideally the exact words of any ' +
        'error message rather than a rough description of it, since a paraphrase can lose the one detail ' +
        'that would have made the cause obvious. WHEN it started, and whether it happens constantly or ' +
        'comes and goes. And what the BUSINESS IMPACT is, can the person still get their work done at ' +
        'all, or is this a minor annoyance they can work around. A ticket missing all four of those is ' +
        'not really a ticket yet, it is a placeholder that costs the assigned technician a phone call ' +
        'before any actual work can start.',
    },
    options: [
      { id: 'a', label: 'Who is affected: one person, a team, or the whole site.' },
      { id: 'b', label: 'The exact error text, rather than a paraphrase of what it said.' },
      { id: 'c', label: 'When it started, and whether it is constant or intermittent.' },
      { id: 'd', label: 'Nothing needs to be added, a vague report is just as workable as a detailed one.' },
    ],
    hints: [
      'Three concrete additions genuinely change how fast this can be worked. One denies there is any difference at all.',
    ],
    solution:
      'A, B, and C. Each one removes a question the technician would otherwise have to go back and ask, ' +
      'which is the entire point of good intake. D is the opposite of the lesson: a vague ticket costs ' +
      'real time later that a few extra details at intake would have saved.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'A vague ticket is not equally workable, it costs a round trip back to the user before real work can even start.',
      },
    ],
    debrief:
      'A self-service portal with a well-designed intake form does most of this automatically, by asking ' +
      'for scope and exact error text up front through required fields, rather than leaving everything ' +
      'to one open text box the user might fill in vaguely. That is a real design decision, not a small ' +
      'one, and it is worth mentioning in a portfolio write-up.',
    practice: [],
  },
  {
    id: 'hd.1.3',
    moduleId: 'hd.1',
    packageId: 'helpdesk-ticketing-foundations',
    order: 3,
    title: 'Three questions before you can even categorise it',
    kind: 'short-answer',
    goal: 'Turn a vague report into the minimum information a ticket needs before it can be routed.',
    prompt:
      'A user submits: "the internet is down." In two or three sentences, name the questions you would ' +
      'ask before you could even categorise this ticket correctly, and why each one changes where it ' +
      'should go.',
    teach: {
      concept:
        'Categorising a ticket means deciding which bucket it belongs in, a network problem, an account ' +
        'problem, a hardware problem, and so on, so it reaches the right team. You cannot do that yet ' +
        'from "the internet is down" alone, because that single sentence could describe several ' +
        'completely different problems. It might be one laptop with a broken Wi-Fi connection. It might ' +
        'be one office\'s connection to its internet provider failing. It might be a company-wide failure ' +
        'of DNS, the system that turns a web address like a company\'s website name into the numeric ' +
        'address a computer actually needs, breaking down for everyone at once. Those three causes route ' +
        'to completely different places, at completely different priorities, handled by completely ' +
        'different teams, so intake has to narrow it down first. Scope, just this one person or ' +
        'everyone, changes both the priority and whether this is even a routine, single-person ticket ' +
        'versus something serious enough to treat as a major incident. Whether the loss of connection is ' +
        'total or partial, can they still reach internal company resources but not the wider internet, ' +
        'or can they reach nothing at all, narrows the likely cause down to roughly which layer of the ' +
        'system is broken: a single local device, one office\'s local network equipment, or the upstream ' +
        'connection provided by an outside company. And asking what changed recently, did anything ' +
        'happen right before this started, is often the fastest route to the actual cause, since ' +
        'problems frequently follow directly from a recent change.',
    },
    hints: [
      'Scope is the first and most important question: is this one person or everyone?',
      'Total versus partial loss of connectivity points at very different layers of the problem.',
      'A good answer explains why each question changes routing or priority, not just what the question is.',
    ],
    solution:
      'I would first ask how many people are affected, just this person or the whole office, because ' +
      'that changes whether this is a routine ticket or a major incident. I would ask whether it is total ' +
      'or partial, can they reach some internal resources but not external sites, since that narrows the ' +
      'cause between their own device, a local switch, and the upstream connection. And I would ask what, ' +
      'if anything, changed right before it started, since a recent change is often the fastest route to ' +
      'the actual cause and tells me who else to loop in.',
    expectedOutput: 'An answer naming scope, total-vs-partial, and recent changes, each tied to how it affects routing or priority.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['scope', 'how many', 'one person', 'everyone', 'whole office', 'affected'],
          ['total', 'partial', 'some sites', 'entirely'],
        ],
        hint: 'At minimum, cover scope (how many people are affected) and whether the outage is total or partial, and explain why each matters for routing.',
      },
    ],
    debrief:
      'Notice that none of these three questions are technical yet, they are scoping questions meant to ' +
      'narrow down where the problem sits before anyone starts diagnosing it. Actually figuring out the ' +
      'root cause comes after the ticket has been correctly categorised and routed to the right team, ' +
      'not before.',
    practice: [],
  },
  {
    id: 'hd.1.4',
    moduleId: 'hd.1',
    packageId: 'helpdesk-ticketing-foundations',
    order: 4,
    title: 'Why categorisation is not paperwork',
    kind: 'multiple-choice',
    goal: 'Explain what a ticket\'s category actually does once it is set.',
    prompt: 'A new technician says categorising a ticket is just paperwork that slows them down. Which of the following are real, functional reasons categorisation matters? Select all that apply.',
    teach: {
      concept:
        'A category is the label attached to a ticket describing what kind of problem it is, like ' +
        '"password reset" or "network outage." It is tempting to think of that label as busywork, ' +
        'something a technician fills in because a form demands it and nothing more, but a category ' +
        'actually drives what happens to the ticket next in three concrete ways. First, it routes the ' +
        'ticket automatically to the right queue or team, so a network problem lands with staff who ' +
        'actually know networking equipment instead of sitting with whoever happened to be free when it ' +
        'came in. Second, it feeds REPORTING, meaning it lets someone count and compare tickets by type ' +
        'later. A manager looking at a report that says "we had 40 password reset tickets this week" can ' +
        'decide whether it is worth building a self-service password reset tool, and that decision is ' +
        'impossible to make at all without consistent categories to count in the first place. Third, a ' +
        'category can set a default priority or response-time commitment before anyone even reads the ' +
        'details of the ticket, a category like "security incident" might automatically carry a much ' +
        'shorter response clock than a category like "how do I" question, simply because of which bucket ' +
        'it landed in.',
    },
    options: [
      { id: 'a', label: 'Category drives automatic routing to the team best equipped to handle it.' },
      { id: 'b', label: 'Consistent categories are what make reporting and trend analysis possible at all.' },
      { id: 'c', label: 'A category can set a default priority or SLA before anyone reads the ticket\'s details.' },
      { id: 'd', label: 'Categorisation exists purely for filing and has no effect on how the ticket is actually handled.' },
    ],
    hints: [
      'Three describe real, functional consequences of setting a category. One denies it does anything at all.',
    ],
    solution:
      'A, B, and C. Categorisation is load-bearing: it routes, it enables reporting, and it can set ' +
      'defaults before a human even opens the ticket. D is the misconception this exercise corrects, and ' +
      'it is a genuinely common one among new technicians who have not yet seen the reporting side of the ' +
      'job.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'Category is not just filing, it drives routing, reporting, and often a default priority before anyone even reads the ticket.',
      },
    ],
    debrief:
      'The reporting angle is worth remembering specifically. A badly or inconsistently categorised ' +
      'queue makes it impossible to answer the question "what is our team actually spending its time ' +
      'on," which is one of the very first questions any manager asks about a help desk.',
    practice: [],
  },
];

// --- Module hd.2: triage and priority ----------------------------------------

const MODULE_HD_2: Exercise[] = [
  {
    id: 'hd.2.1',
    moduleId: 'hd.2',
    packageId: 'helpdesk-ticketing-foundations',
    order: 1,
    title: 'Impact and urgency, not just how loud someone is',
    kind: 'multiple-choice',
    goal: 'Learn the impact-times-urgency logic behind priority, rather than treating it as a gut feeling.',
    prompt: 'Priority is typically derived from a combination of impact and urgency rather than assigned by feel. Which of the following correctly describe that relationship? Select all that apply.',
    teach: {
      concept:
        'Priority is the label that decides which tickets get worked first, and it should not just be ' +
        'whichever person complains the loudest, it should come from two separate, definable ' +
        'measurements combined. IMPACT is how much of the business is affected: one person, one team, or ' +
        'everyone. URGENCY is how quickly things get worse if nothing happens right now, versus a ' +
        'problem that will still be just as fixable in a few hours. A priority matrix is simply a table ' +
        'that combines those two measurements into a priority level, so the decision is not left to gut ' +
        'feeling. High impact plus high urgency is the clearest case, call it P1, meaning priority 1, the ' +
        'highest: a company-wide outage happening right now. Low impact plus low urgency lands at the ' +
        'bottom: one person\'s minor cosmetic issue that is not getting any worse. The interesting cases ' +
        'sit in between: something with high impact but low urgency, a slow-burning issue affecting many ' +
        'people that is not getting worse minute by minute, will often still outrank something with low ' +
        'impact but high urgency, one person\'s issue that feels urgent to them but genuinely affects ' +
        'nobody else. Using a matrix like this means whoever is triaging tickets reaches the same answer ' +
        'regardless of who is on shift that day, rather than the outcome depending on which technician ' +
        'happened to pick it up.',
    },
    options: [
      { id: 'a', label: 'Impact is how many people or how much of the business is affected.' },
      { id: 'b', label: 'Urgency is how quickly the consequences get worse if nothing is done.' },
      { id: 'c', label: 'A combined impact and urgency matrix produces a more consistent priority than one person\'s gut feeling.' },
      { id: 'd', label: 'Whoever raises a ticket gets to set its priority directly, since they know their own situation best.' },
    ],
    hints: [
      'Three define the real mechanism. One hands priority-setting entirely to the requester, which defeats the point of triage.',
    ],
    solution:
      'A, B, and C. Impact and urgency are distinct, definable dimensions, and combining them ' +
      'systematically is what makes priority defensible rather than arbitrary. D is wrong: if requesters ' +
      'set their own priority, everything becomes "urgent" immediately, which is exactly the failure mode ' +
      'a matrix exists to prevent.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'If requesters set their own priority, everything becomes urgent immediately, which defeats the purpose of triage.',
      },
    ],
    debrief:
      'This is the same signal-versus-noise skill taught elsewhere in this platform for reading logs and ' +
      'triaging alerts, just applied to tickets instead of log lines: a small number of dimensions, ' +
      'applied the same way every time, beats a case-by-case judgement call.',
    practice: [],
  },
  {
    id: 'hd.2.2',
    moduleId: 'hd.2',
    packageId: 'helpdesk-ticketing-foundations',
    order: 2,
    title: 'A VIP\'s mouse, or the whole building\'s Wi-Fi',
    kind: 'short-answer',
    goal: 'Apply impact-over-urgency reasoning to a case where politics and priority pull in different directions.',
    prompt:
      'A senior executive\'s mouse has stopped working and they are asking for it urgently. At the same ' +
      'time, the entire building\'s Wi-Fi has gone down. In two or three sentences, say which ticket ' +
      'should be P1 and defend the call.',
    teach: {
      concept:
        'This exercise is built around the case where the loudest request and the technically correct ' +
        'priority disagree with each other, which happens constantly in real help desk work. A broken ' +
        'mouse affects exactly one person, and that person has a trivial workaround available, a spare ' +
        'mouse from a supply closet, or a few minutes without one while it gets replaced, and none of ' +
        'that changes no matter how senior the person asking is. A building-wide Wi-Fi outage affects ' +
        'every single person in the building at once, and there is no workaround at all for anyone whose ' +
        'work depends on being connected. Impact scope, how many people are actually affected, not the ' +
        'requester\'s job title or how insistently they are asking, is what a priority matrix like the ' +
        'one from the previous exercise is actually built on. A technician who lets seniority override ' +
        'that measurement will eventually be the person who left an entire office offline because one ' +
        'executive\'s peripheral felt more pressing in the moment it was reported. The defensible answer, ' +
        'the one you could show a manager afterward and justify, is always the one built on actual scope ' +
        'of impact.',
    },
    hints: [
      'One of these affects one person with an easy workaround. The other affects everyone with no workaround at all.',
      'Priority is meant to be defensible after the fact, not just satisfying in the moment.',
      'Name the Wi-Fi outage as P1 and explain why scope beats seniority in the justification.',
    ],
    solution:
      'The building-wide Wi-Fi outage should be P1. It affects every single person in the building with ' +
      'no workaround, while the executive\'s broken mouse affects one person and has a trivial fix, a ' +
      'spare mouse. Priority has to be based on impact scope rather than who is asking, otherwise the ' +
      'loudest or most senior requester always wins regardless of actual business impact, and that is ' +
      'not a call a technician can defend afterward.',
    expectedOutput: 'An answer naming the Wi-Fi outage as P1 and justifying it by scope of impact rather than the requester\'s seniority.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['wi-fi', 'wifi', 'building', 'everyone'],
          ['impact', 'scope', 'affects', 'seniority', 'who is asking'],
        ],
        hint: 'Name the Wi-Fi outage as the correct P1, and explain the call using impact scope rather than the requester\'s seniority.',
      },
    ],
    debrief:
      'A ticketing system that lets this kind of call get made the same way every time, rather than by ' +
      'whoever shouts loudest or outranks everyone else in the room, is exactly what a priority matrix ' +
      'exists for. It is also a genuinely useful thing to be able to explain and defend to a manager ' +
      'after the fact.',
    practice: [],
  },
  {
    id: 'hd.2.3',
    moduleId: 'hd.2',
    packageId: 'helpdesk-ticketing-foundations',
    order: 3,
    title: 'What an SLA actually is',
    kind: 'multiple-choice',
    goal: 'Understand what a Service Level Agreement commits to, and what can legitimately pause its clock.',
    prompt: 'Which of the following correctly describe how an SLA works in a ticketing system? Select all that apply.',
    teach: {
      concept:
        'An SLA, short for Service Level Agreement, is a promise a support team makes about how quickly ' +
        'it will respond to and resolve a ticket, and that promise is tied directly to priority rather ' +
        'than being the same for every ticket. A P1, the highest priority, might promise a response ' +
        'within 15 minutes and a full resolution within 4 hours, while a low priority ticket, a P4, might ' +
        'only promise a response within one business day. Missing that promised time is called an SLA ' +
        'BREACH, and breaches are typically tracked and reported on over time, because a single missed ' +
        'SLA might just be bad luck, but a repeated pattern of breaches is evidence that the team is ' +
        'understaffed or that something in the process is broken, not evidence that one technician ' +
        'failed. The clock counting down to that deadline can also be legitimately paused in specific ' +
        'circumstances, most commonly while the technician is waiting on the requester to provide ' +
        'information they genuinely cannot proceed without, since it would be unfair to count time ' +
        'against the team when the team was not actually able to act.',
    },
    options: [
      { id: 'a', label: 'An SLA sets a response and resolution time commitment tied to a ticket\'s priority.' },
      { id: 'b', label: 'Missing an SLA is tracked as a breach, and a pattern of breaches is meaningful to report.' },
      { id: 'c', label: 'The SLA clock can be legitimately paused while waiting on the requester for information.' },
      { id: 'd', label: 'The SLA clock runs identically regardless of priority, since every ticket deserves equal attention.' },
    ],
    hints: [
      'Three describe how SLAs actually function. One claims priority has no effect on the timeline, which contradicts the whole point of a priority matrix.',
    ],
    solution:
      'A, B, and C. The commitment scales with priority, breaches are meaningful data, and pausing the ' +
      'clock while waiting on the requester is standard and fair. D contradicts everything priority is ' +
      'for: if every ticket had the same clock, priority would have no operational meaning at all.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'If every priority level had the same SLA clock, priority would have no operational meaning at all.',
      },
    ],
    debrief:
      'The pending customer response pause is worth knowing specifically by name. It is the standard ' +
      'mechanism that keeps a technician\'s SLA numbers fair when a delay genuinely was not their fault, ' +
      'and it shows up in essentially every real ticketing system.',
    practice: [],
  },
  {
    id: 'hd.2.4',
    moduleId: 'hd.2',
    packageId: 'helpdesk-ticketing-foundations',
    order: 4,
    title: 'When to skip the queue entirely',
    kind: 'multiple-choice',
    goal: 'Recognise the class of ticket that should bypass normal triage and escalate immediately.',
    prompt: 'Which of the following indicators would justify escalating a ticket immediately at intake, rather than letting it wait in the normal queue? Select all that apply.',
    teach: {
      concept:
        'Normal triage assumes there is time to work through a queue in priority order, checking each ' +
        'ticket, deciding where it goes, and letting it wait its turn, and that assumption holds for the ' +
        'overwhelming majority of tickets. It does not hold for a small category of situations where ' +
        'every additional minute spent sitting in a queue has a real, growing cost, rather than staying ' +
        'just as fixable later as it is right now. A user reporting a RANSOM NOTE, a message demanding ' +
        'payment that appears when malicious software has encrypted their files, or files that have ' +
        'suddenly become unreadable and encrypted, is one such case. Evidence that data is actively being ' +
        'copied out of the company right now, called DATA EXFILTRATION, is another. A report that looks ' +
        'like someone\'s account is being actively taken over and misused by an attacker while it is ' +
        'happening, called an ACCOUNT COMPROMISE, is a third. All three get routed straight to whoever ' +
        'handles security incidents, often before the ticket has even been fully filled out or ' +
        'categorised, because the cost of treating an active attack as routine paperwork while it is ' +
        'investigated is far higher than the cost of occasionally raising a false alarm.',
    },
    options: [
      { id: 'a', label: 'A user reports files suddenly encrypted with a ransom note.' },
      { id: 'b', label: 'Evidence suggesting data is actively being exfiltrated right now.' },
      { id: 'c', label: 'A password reset request from a user who forgot theirs after a vacation.' },
      { id: 'd', label: 'Signs of an account compromise actively in progress.' },
    ],
    hints: [
      'Three describe active, worsening security situations. One is a routine, common request with no urgency beyond the individual.',
    ],
    solution:
      'A, B, and D. Each describes something actively unfolding where a delay has a real cost. C is a ' +
      'completely normal, low-priority ticket, forgetting a password after time away is one of the most ' +
      'routine requests a help desk handles and belongs in the ordinary queue.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'A forgotten password after time away is a routine, low-urgency request, not a reason to bypass normal triage.',
      },
    ],
    debrief:
      'This is the exact seam between this package and Incident Detection and Alert Triage, another ' +
      'package in this platform: some tickets are never really ordinary tickets at all, they are ' +
      'security incidents wearing a ticket\'s clothing, and learning to recognise that at the moment of ' +
      'intake is a real, valuable skill worth having before you ever open a SIEM, the tool security teams ' +
      'use to search and monitor logs.',
    practice: [],
  },
];

// --- Module hd.3: assignment and working a ticket -----------------------------

const MODULE_HD_3: Exercise[] = [
  {
    id: 'hd.3.1',
    moduleId: 'hd.3',
    packageId: 'helpdesk-ticketing-foundations',
    order: 1,
    title: 'Ownership is more than a name in a field',
    kind: 'multiple-choice',
    goal: 'Define what actually taking ownership of a ticket requires.',
    prompt: 'Which of the following are part of genuinely taking ownership of a ticket, beyond having your name assigned to it? Select all that apply.',
    teach: {
      concept:
        'Every ticketing system has an assignee field, a spot where you type in whose name is responsible ' +
        'for a ticket, and it is easy to think that filling in that one field is the same thing as ' +
        'actually owning the problem. It is not. Assignment is just a database entry, a piece of data ' +
        'sitting in a record. OWNERSHIP is a behaviour, something a person actually does over time. ' +
        'Genuinely owning a ticket means updating its status so that anyone glancing at the queue can ' +
        'tell it is actively being worked rather than sitting untouched, communicating a realistic ' +
        'timeframe to the person who reported it rather than leaving them wondering whether anyone has ' +
        'even seen their request, and staying accountable for it until it is either resolved or properly ' +
        'handed off to someone else, rather than letting it quietly go stale while attention moves ' +
        'elsewhere. A ticket that shows your name in the assignee field but has sat untouched for three ' +
        'days, with no status update and no message to the requester, is not owned by anyone in any ' +
        'meaningful sense, no matter what that one field says.',
    },
    options: [
      { id: 'a', label: 'Updating the ticket\'s status to reflect that it is actively being worked.' },
      { id: 'b', label: 'Communicating a realistic timeframe to the requester rather than leaving them guessing.' },
      { id: 'c', label: 'Having your name in the assignee field is sufficient on its own.' },
      { id: 'd', label: 'Staying accountable for it until it is resolved or properly handed off.' },
    ],
    hints: [
      'Three describe active behaviour. One claims the database field alone is enough, which is the misconception this exercise corrects.',
    ],
    solution:
      'A, B, and D. Ownership is something you do, not a field that gets set once. C is the trap: an ' +
      'assignee field with no accompanying status update or communication describes a ticket nobody is ' +
      'actually working, no matter whose name is on it.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'An assignee field by itself is not ownership, it is just a label, until it is backed by status updates and communication.',
      },
    ],
    debrief:
      'A requester who has heard nothing for three days will assume they have been forgotten, whether or ' +
      'not that is actually true. Communicating a timeframe, even a rough one, is one of the cheapest ' +
      'ways to earn goodwill in this job, and it costs almost nothing compared to the ill will silence ' +
      'creates.',
    practice: [],
  },
  {
    id: 'hd.3.2',
    moduleId: 'hd.3',
    packageId: 'helpdesk-ticketing-foundations',
    order: 2,
    title: 'Write notes for the technician who is not you',
    kind: 'short-answer',
    goal: 'Explain why ticket notes are written for a handover that may never actually happen, and why that matters anyway.',
    prompt:
      'A senior technician tells a new hire to write every ticket update as if someone else will have to ' +
      'pick it up tomorrow, even on tickets they fully expect to finish themselves. In two or three ' +
      'sentences, explain why that habit matters.',
    teach: {
      concept:
        'A ticket note is the running log of what has been tried and found on a ticket so far, and it is ' +
        'tempting to write those notes quickly, just enough to jog your own memory, since you plan to ' +
        'finish the ticket yourself anyway. The problem is that plans change constantly in this job: the ' +
        'technician working a ticket can get pulled onto something more urgent partway through, go on ' +
        'leave, or the ticket can simply sit open long enough that a shift change happens in the middle ' +
        'of it, meaning a different person comes on duty and has to pick up where the last person left ' +
        'off. A note written only for your own memory, something like "tried the usual fix, will check ' +
        'tomorrow," is nearly useless to whoever has to pick the ticket up next, since it does not say ' +
        'what the usual fix even was or what happened when they tried it. It is also useless to you a ' +
        'week later, once you have genuinely forgotten the specifics yourself. Writing for a stranger ' +
        'instead, spelling out what was tried, what the result was, and what is still left to check, ' +
        'means the ticket can be picked up by literally anyone without a phone call to track the original ' +
        'technician down, and it is also what creates a real record that can be reviewed later if the ' +
        'ticket ever needs to be looked at again.',
    },
    hints: [
      'People get pulled off tickets unexpectedly: shift changes, leave, more urgent work. Notes have to survive that.',
      'A good answer also notes that this habit helps the ORIGINAL technician too, once enough time has passed.',
    ],
    solution:
      'Plans change: the original technician can get pulled onto something more urgent, go on leave, or ' +
      'the ticket can sit open across a shift change, so notes written only for your own memory are ' +
      'useless to whoever has to pick it up next. Writing clearly, what was tried, the result, and what ' +
      'is left, means the ticket can be handed off without a phone call to track the original technician ' +
      'down, and it also protects the original technician, since even they will have forgotten the ' +
      'specifics if they come back to it a week later.',
    expectedOutput: 'An answer explaining that ownership can change unexpectedly, and that clear notes avoid a dependency on any one person\'s memory.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['pulled off', 'leave', 'shift change', 'someone else', 'hand off', 'handover'],
          ['memory', 'forget', 'remember', 'audit', 'accountab'],
        ],
        hint: 'Cover why ownership can change unexpectedly, and why notes written for a stranger avoid depending on any one person\'s memory, including your own later.',
      },
    ],
    debrief:
      'This is the same discipline behind a good incident timeline taught elsewhere in this platform: ' +
      'written for someone who was not there to see it happen, because eventually someone who was not ' +
      'there is exactly who has to read it and make sense of it.',
    practice: [],
  },
  {
    id: 'hd.3.3',
    moduleId: 'hd.3',
    packageId: 'helpdesk-ticketing-foundations',
    order: 3,
    title: 'When to escalate instead of keep pushing',
    kind: 'multiple-choice',
    goal: 'Recognise the signals that a ticket belongs with someone else, before pride or stubbornness delays it further.',
    prompt: 'Which of the following are good reasons to escalate a ticket to Tier 2, rather than continuing to work it yourself? Select all that apply.',
    teach: {
      concept:
        'Escalation means handing a ticket up to a more experienced or more specialised team, usually ' +
        'called Tier 2, rather than continuing to work it yourself, and it is common for a new technician ' +
        'to feel like asking for that handoff means admitting they failed. It is not. Escalation is a ' +
        'routing decision: it moves a ticket to whoever can actually resolve it fastest, and that is not ' +
        'always the person who happened to pick it up first. Good reasons to escalate include the issue ' +
        'turning out to need ACCESS OR TOOLING you do not personally have, a server you are not permitted ' +
        'to log into, or a system entirely outside your account\'s permissions, genuinely being outside ' +
        'your KNOWLEDGE after you have made a reasonable, honest attempt, the SLA clock, the response-time ' +
        'promise covered earlier, running close to being breached with no resolution in sight, and having ' +
        'already tried the standard, well-known fixes without success. Repeating the same failed attempt ' +
        'a fourth time is not persistence, it is a ticket that should have moved on after the second try.',
    },
    options: [
      { id: 'a', label: 'The fix requires access or tooling you do not have.' },
      { id: 'b', label: 'You have made a reasonable attempt and the issue is genuinely outside your knowledge.' },
      { id: 'c', label: 'The SLA is close to breach with no resolution path visible.' },
      { id: 'd', label: 'Escalating at all reflects badly on you, so it should be avoided even when none of the above apply.' },
    ],
    hints: [
      'Three describe legitimate, common reasons to hand a ticket up. One treats escalation itself as a failure, which it is not.',
    ],
    solution:
      'A, B, and C. Each is a legitimate signal that someone else can resolve this faster than continuing ' +
      'to work it alone. D is the trap: treating escalation as a personal failure is exactly what causes ' +
      'tickets to sit unresolved past their SLA while a technician keeps trying the same thing.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'Escalation is a routing decision, not a personal failure, and treating it as one is what causes SLA breaches.',
      },
    ],
    debrief:
      'A good technician escalates earlier than pride wants them to, and a good manager measures that as ' +
      'a strength in someone, not a weakness. It is worth internalising that early, since the instinct to ' +
      'just keep trying alone is a common and genuinely expensive habit in new hires.',
    practice: [],
  },
  {
    id: 'hd.3.4',
    moduleId: 'hd.3',
    packageId: 'helpdesk-ticketing-foundations',
    order: 4,
    title: 'Breaking ticket ping-pong',
    kind: 'short-answer',
    goal: 'Diagnose why a ticket keeps bouncing between two teams, and propose a structural fix rather than a one-off resolution.',
    prompt:
      'A ticket has been reassigned back and forth between the network team and the application team ' +
      'four times, each insisting it is the other\'s problem. In two or three sentences, explain what is ' +
      'actually going wrong and how you would prevent it happening again, not just this one time.',
    teach: {
      concept:
        'Ticket ping-pong is what it sounds like: a ticket gets reassigned back and forth between two ' +
        'teams, each one insisting the problem actually belongs to the other, and neither side is ' +
        'necessarily lying or being lazy about it. It almost always means there is no AGREED, ' +
        'PRE-DEFINED CRITERIA, no rule the two teams settled on in advance, for where a ticket shaped ' +
        'like this one actually belongs. Without that rule, each team is making a reasonable individual ' +
        'judgement on its own, and those two reasonable individual judgements simply happen to disagree ' +
        'with each other. There are two separate pieces of work needed to fix this, and they are not the ' +
        'same thing. The immediate fix is getting someone with authority over both queues, a lead, or a ' +
        'call where both teams get on together, to make the call so the ticket in front of you actually ' +
        'gets worked right now. The lasting fix is different: agreeing on routing criteria for this ' +
        'category of issue in advance, in writing, so the next similar ticket does not restart the exact ' +
        'same argument from scratch. Fixing the ticket you can see and fixing the process that produced ' +
        'it are genuinely two different jobs, and skipping the second one guarantees the same fight ' +
        'happens again next month.',
    },
    hints: [
      'This is rarely about either team being wrong, it is usually about no agreed rule existing yet.',
      'A good answer separates the immediate fix (get someone to make the call) from the lasting fix (agree routing criteria in advance).',
    ],
    solution:
      'This usually means there is no agreed, pre-defined criteria for which team owns this category of ' +
      'issue, so each side is making a reasonable individual call that happens to disagree with the ' +
      'other\'s. For this specific ticket, I would get someone with authority over both queues to make the ' +
      'call so it actually gets worked. To prevent a repeat, I would push for the two teams to agree on ' +
      'routing criteria for this category of issue in writing, ahead of time, so the next similar ticket ' +
      'does not restart the same argument.',
    expectedOutput: 'An answer naming the lack of agreed routing criteria as the real problem, and proposing both an immediate resolution and a lasting process fix.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['criteria', 'agreed', 'rule', 'process', 'routing'],
          ['authority', 'lead', 'escalate', 'decide', 'call'],
        ],
        hint: 'Name the lack of agreed routing criteria as the root cause, and cover both an immediate resolution and a lasting process fix.',
      },
    ],
    debrief:
      'This is the ticketing-system version of a pattern that shows up everywhere in security and IT ' +
      'work: fixing the single instance in front of you and fixing the process that produced it are two ' +
      'different jobs, and a good technician does not stop after finishing only the first one.',
    practice: [],
  },
];

// --- Module hd.4: resolution and closing well ---------------------------------

const MODULE_HD_4: Exercise[] = [
  {
    id: 'hd.4.1',
    moduleId: 'hd.4',
    packageId: 'helpdesk-ticketing-foundations',
    order: 1,
    title: 'Never close on "should have worked"',
    kind: 'multiple-choice',
    goal: 'Learn why confirmation before closing matters, and what a defensible alternative to silence looks like.',
    prompt: 'Which of the following describe good practice for closing a ticket? Select all that apply.',
    teach: {
      concept:
        'Closing a ticket means marking it as done in the system, and there is an important difference ' +
        'between a fix that SHOULD have worked, based on the technician\'s own judgement, and a fix that ' +
        'actually DID work, based on the requester genuinely being able to use the system again ' +
        'afterward. Only the requester can confirm the second one, since they are the person actually ' +
        'sitting at the keyboard using it, not the technician who applied the fix and moved on. Closing ' +
        'the moment a fix is applied, without ever checking back with the user, risks marking a ticket as ' +
        'solved when the underlying problem is still there from the user\'s point of view. The standard, ' +
        'fair alternative to waiting indefinitely for a reply is an AUTO-CLOSE policy: mark the ticket as ' +
        'resolved-pending-confirmation, tell the user directly that you believe it is fixed and ask them ' +
        'to confirm, and automatically close it after a set number of days if they never respond. That ' +
        'approach respects the requester\'s time to actually check and confirm, while still giving the ' +
        'queue a way to move forward instead of sitting open forever waiting on a reply that may never ' +
        'come.',
    },
    options: [
      { id: 'a', label: 'A fix should be confirmed with the requester before the ticket is closed, since only they know if it actually resolved their problem.' },
      { id: 'b', label: 'An auto-close policy after a set notice period is a fair way to handle requesters who never respond.' },
      { id: 'c', label: 'A technician applying a fix and immediately closing the ticket, without any confirmation step, is best practice.' },
      { id: 'd', label: 'Marking a ticket resolved-pending-confirmation and telling the user is a reasonable middle step.' },
    ],
    hints: [
      'Three describe a genuine confirmation step, immediate or delayed. One skips confirmation entirely and calls it best practice, which it is not.',
    ],
    solution:
      'A, B, and D. Confirmation, in some form, is the whole point, whether it happens immediately or via ' +
      'an auto-close notice period. C is the anti-pattern this exercise exists to name: closing without any ' +
      'confirmation step at all risks reporting a problem as solved when it is not.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'Closing immediately with no confirmation step at all is the anti-pattern, not the best practice.',
      },
    ],
    debrief:
      'A pattern of tickets getting reopened shortly after being closed is one of the clearest quality ' +
      'signals a help desk manager can look at, and it usually traces straight back to exactly this ' +
      'habit: closing on "should have worked" instead of on an actual confirmation from the user.',
    practice: [],
  },
  {
    id: 'hd.4.2',
    moduleId: 'hd.4',
    packageId: 'helpdesk-ticketing-foundations',
    order: 2,
    title: 'Symptom fix, or root cause',
    kind: 'multiple-choice',
    goal: 'Recognise when a working fix is not actually the end of the ticket.',
    prompt: 'A server that hangs is rebooted and starts working again, for the third week in a row. Which of the following are the right response? Select all that apply.',
    teach: {
      concept:
        'A SYMPTOM is the visible problem, in this case a server that hangs, meaning it stops responding, ' +
        'and a reboot genuinely fixes that symptom every time, the server works again afterward. It can ' +
        'be entirely correct to close THIS week\'s ticket on that basis, since the immediate problem ' +
        'really is resolved. But a symptom that keeps recurring on a predictable schedule, the same ' +
        'server hanging every single week, is evidence of an underlying ROOT CAUSE, the actual reason it ' +
        'keeps happening in the first place, that nobody has actually found or fixed yet. Treating each ' +
        'week\'s reboot as its own isolated, fully resolved incident misses that pattern entirely, since ' +
        'three identical tickets in a row is not really three separate problems, it is one unfound ' +
        'problem showing up three times. The right move is closing the immediate ticket, since the ' +
        'symptom really is gone for now, while also separately raising a PROBLEM record, a distinct kind ' +
        'of ticket meant for exactly this, or otherwise flagging the recurring pattern so someone ' +
        'investigates the actual root cause. That investigation is a different, separate piece of work ' +
        'from firefighting this particular week\'s instance.',
    },
    options: [
      { id: 'a', label: 'Close this week\'s ticket once the reboot resolves the immediate symptom.' },
      { id: 'b', label: 'Flag the recurrence as a pattern worth a separate root-cause investigation.' },
      { id: 'c', label: 'Treat each week\'s reboot as fully resolved with nothing further needed, since the server is working again each time.' },
      { id: 'd', label: 'Recognise that a fix repeating on a schedule is evidence of a cause that has not actually been found yet.' },
    ],
    hints: [
      'Two things can both be true: this ticket is fairly closed, and something bigger deserves separate attention.',
      'One option ignores the pattern entirely, treating three identical incidents as three unrelated ones.',
    ],
    solution:
      'A, B, and D. Closing the immediate ticket is fine, the symptom really is resolved, but a repeating ' +
      'pattern is a real signal that deserves its own investigation. C is the failure mode: treating each ' +
      'week\'s reboot as fully and independently resolved means nobody ever looks for why it keeps ' +
      'happening.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'A recurring fix is a pattern worth investigating on its own, not something to treat as fully resolved every single time.',
      },
    ],
    debrief:
      'This is the ticketing-system version of the difference between an incident and a problem, a ' +
      'distinction from a well-known IT service framework called ITIL, and it is worth being able to ' +
      'explain that distinction clearly in an interview even if you never say the word ITIL out loud ' +
      'while doing it.',
    practice: [],
  },
  {
    id: 'hd.4.3',
    moduleId: 'hd.4',
    packageId: 'helpdesk-ticketing-foundations',
    order: 3,
    title: 'A closed ticket with no resolution note',
    kind: 'short-answer',
    goal: 'Explain why an undocumented resolution costs the next technician real time, not just tidiness.',
    prompt:
      'A ticket is closed with the status set to "Resolved" and no notes explaining what the fix actually ' +
      'was. In two or three sentences, explain why this hurts the next technician who hits a similar ' +
      'issue.',
    teach: {
      concept:
        'A resolution note is the part of a ticket where the technician writes down what the actual fix ' +
        'was, not just that a fix happened. A ticket closed with its status set to "Resolved" but no note ' +
        'explaining what was actually done is a dead end: the fact that the problem got fixed is ' +
        'recorded, but the HOW, the single most valuable output of having solved the problem in the first ' +
        'place, is simply gone. The next technician who runs into a similar report has no way to search ' +
        'the ticketing system and find something like "here is exactly what worked last time," so they ' +
        'end up starting from zero and re-deriving a fix that already existed once before, wasting time ' +
        'solving a problem that was already solved. Multiplied across enough tickets over time, that is a ' +
        'genuinely large amount of repeated, avoidable work, and it is also exactly the raw material a ' +
        'proper knowledge base, a searchable collection of known fixes, is supposed to be built from, ' +
        'which never actually accumulates if resolution notes are routinely skipped.',
    },
    hints: [
      'The status "Resolved" only records that a fix happened, not what it was.',
      'A good answer connects this specifically to the next technician re-deriving a fix from scratch, and to knowledge base value.',
    ],
    solution:
      'The status only records that a fix happened, not what the fix actually was, so the single most ' +
      'reusable piece of information from solving the problem is lost. The next technician who hits a ' +
      'similar issue has nothing to search for and finds no prior fix, so they start from zero and ' +
      're-derive a solution that already existed once before. This is also exactly the material a proper ' +
      'knowledge base is built from, and it never accumulates if resolution notes are routinely skipped.',
    expectedOutput: 'An answer explaining that the fix itself, not just the fact of resolution, is lost, forcing the next technician to re-derive it from scratch.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['what the fix was', 'how it was fixed', 'resolution', 'reusable'],
          ['start from scratch', 'redo', 're-derive', 'next technician', 'knowledge base'],
        ],
        hint: 'Explain that the actual fix, not just the fact of resolution, is what gets lost, and connect it to the next technician repeating work that was already done once.',
      },
    ],
    debrief:
      'A resolution note is not documentation for its own sake, it is the thing that turns one ' +
      'technician\'s solved problem into every technician\'s faster problem afterward, which is exactly ' +
      'the kind of leverage a knowledge base is supposed to provide a team.',
    practice: [],
  },
  {
    id: 'hd.4.4',
    moduleId: 'hd.4',
    packageId: 'helpdesk-ticketing-foundations',
    order: 4,
    title: 'Reopen it, or raise a new one',
    kind: 'multiple-choice',
    goal: 'Decide correctly between reopening a closed ticket and creating a new one.',
    prompt: 'A user reports an issue that looks similar to one closed as resolved last week. Which of the following are good reasons to reopen the original ticket rather than raise a new one? Select all that apply.',
    teach: {
      concept:
        'When a user reports something that looks like a ticket closed last week, there are two options, ' +
        'and picking the right one matters for reasons beyond just tidiness. REOPENING the original ' +
        'ticket, changing its status back from closed to open rather than starting a fresh one, is the ' +
        'right call when this is genuinely the SAME underlying issue coming back, meaning the earlier fix ' +
        'did not actually hold or the exact same symptom has clearly returned. It matters for reporting ' +
        'accuracy specifically: a reopened ticket correctly shows up in the system\'s records as a fix ' +
        'that did not stick, which is a meaningful signal for anyone reviewing quality later, while ' +
        'quietly logging the same problem as a brand new ticket instead hides the fact that the original ' +
        'fix failed. Raising a genuinely NEW TICKET is the right call when it turns out to be a different, ' +
        'unrelated problem that merely looks similar on the surface, or when the original ticket is old ' +
        'enough that reopening it would confuse a timeline that has already moved on. Choosing correctly ' +
        'between the two keeps the team\'s records honest either way, instead of quietly hiding a pattern ' +
        'or muddying one that does not actually exist.',
    },
    options: [
      { id: 'a', label: 'The exact same underlying issue has come back, meaning the original fix did not actually hold.' },
      { id: 'b', label: 'Reopening correctly reflects, for reporting purposes, that a previous resolution did not stick.' },
      { id: 'c', label: 'You should always raise a new ticket instead of reopening, regardless of whether the issue is actually the same one.' },
      { id: 'd', label: 'The symptom described is clearly the same one that was supposedly resolved, not a coincidentally similar but different issue.' },
    ],
    hints: [
      'Three describe genuine reasons to reopen the original. One insists on always creating a new ticket regardless of whether it is really the same issue.',
    ],
    solution:
      'A, B, and D. Reopening is the honest choice when it really is the same issue recurring, and it ' +
      'keeps reporting accurate by showing that a resolution did not hold. C is wrong: always raising a ' +
      'new ticket regardless of whether it is the same issue hides recurring problems inside a set of ' +
      'seemingly unrelated tickets, which is worse for tracking, not better.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'Always raising a new ticket regardless of whether it is really the same issue hides recurring problems rather than surfacing them.',
      },
    ],
    debrief:
      'This closes the loop back to the earlier exercise about the server that kept hanging: a reopened ' +
      'ticket is itself a pattern signal, exactly like that weekly reboot was, and both point at the same ' +
      'underlying discipline, noticing when something recurs instead of treating every instance as an ' +
      'isolated, unrelated event.',
    practice: [],
  },
];

// --- the package -------------------------------------------------------------

export const HELPDESK_TICKETING_FOUNDATIONS: LearningPackage = {
  id: 'helpdesk-ticketing-foundations',
  order: 22,
  title: 'Help Desk Ticketing System',
  summary:
    'How work actually arrives in a SOC before it is ever an alert: intake that gives a technician ' +
    'something to start from, priority built on impact and urgency rather than who shouts loudest, real ' +
    'ownership of a ticket, and closing well enough that the next technician benefits from it too.',
  outcomes: [
    'Recognise the legitimate origins of a ticket, and what turns a vague report into an actionable one',
    'Derive priority from impact and urgency rather than requester seniority, and know when to bypass triage entirely',
    'Explain what genuine ownership of a ticket requires beyond an assignee field',
    'Close a ticket in a way that confirms resolution, captures a reusable fix, and surfaces recurring problems',
  ],
  prerequisites: ['linux-fundamentals'],
  modules: [
    {
      id: 'hd.1',
      packageId: 'helpdesk-ticketing-foundations',
      order: 1,
      title: 'Ticket Intake',
      summary: 'Where tickets come from, what makes one actionable, and why categorisation is not paperwork.',
      exercises: MODULE_HD_1,
    },
    {
      id: 'hd.2',
      packageId: 'helpdesk-ticketing-foundations',
      order: 2,
      title: 'Triage and Priority',
      summary: 'Impact times urgency, SLAs and their clock, and the tickets that should bypass the queue entirely.',
      exercises: MODULE_HD_2,
    },
    {
      id: 'hd.3',
      packageId: 'helpdesk-ticketing-foundations',
      order: 3,
      title: 'Assignment and Working a Ticket',
      summary: 'What ownership actually requires, notes written for a stranger, and knowing when to escalate.',
      exercises: MODULE_HD_3,
    },
    {
      id: 'hd.4',
      packageId: 'helpdesk-ticketing-foundations',
      order: 4,
      title: 'Resolution and Closing Well',
      summary: 'Confirming before closing, root cause versus symptom, resolution notes, and reopen versus new ticket.',
      exercises: MODULE_HD_4,
    },
  ],
};
