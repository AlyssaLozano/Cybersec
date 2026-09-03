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
        'A ticket can be raised directly by a user through a self-service portal, captured by an agent ' +
        'from a phone call and typed in on the caller\'s behalf, generated automatically from an email ' +
        'sent to a support address, or auto-created by a monitoring system when something crosses a ' +
        'threshold, a disk filling up, a service going down, an alert firing. That last case matters ' +
        'more than it looks: auto-logging means every qualifying event becomes a ticket whether or not a ' +
        'human would have bothered to report it, which is what keeps a queue from silently missing ' +
        'problems nobody happened to notice.',
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
      'Keep the auto-generated case in mind: it is the direct link between this package and the alert ' +
      'queue you work in Incident Detection and Alert Triage. Many of the "tickets" in a SOC never had a ' +
      'human type a word into them.',
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
        'A ticket earns its place in a queue by giving whoever picks it up enough to start without a ' +
        'round trip back to the user. That means WHO is affected (one person, one team, the whole ' +
        'building), WHAT specifically is happening, ideally including any exact error text rather than a ' +
        'paraphrase, WHEN it started and whether it is constant or intermittent, and what the BUSINESS ' +
        'IMPACT is, can they still work at all, or is this a minor inconvenience. A ticket missing all ' +
        'four of those is not really a ticket yet, it is a placeholder that costs the assigned ' +
        'technician a phone call before any actual work can start.',
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
      'for scope and exact error text up front rather than leaving it to a free-text box. That is a real ' +
      'design decision worth mentioning in a portfolio write-up.',
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
        '"The internet is down" could be one laptop with a bad Wi-Fi driver, one office\'s ISP link, or a ' +
        'company-wide DNS failure, and those three route to completely different places, priorities, and ' +
        'teams. Scope (just them, or everyone) changes both priority and whether this is even a ' +
        'ticket-worthy individual issue versus a major-incident-worthy outage. Whether it is total or ' +
        'partial (can they reach internal sites but not the wider internet, or nothing at all) narrows ' +
        'the likely cause between a local device, a switch, and an upstream provider. And what changed ' +
        'recently (did anything happen right before it started) is often the fastest route to the actual ' +
        'cause.',
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
      'Notice that none of these questions are technical yet, they are scoping questions. Diagnosing the ' +
      'actual cause comes after the ticket is correctly categorised and routed, not before.',
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
        'A category is not a filing label, it drives what happens next. It routes the ticket to the ' +
        'right queue or team automatically, so a network issue reaches network-capable staff instead of ' +
        'sitting with whoever happened to be free. It feeds REPORTING: a manager looking at "we had 40 ' +
        'password reset tickets this week" can decide whether self-service password reset is worth ' +
        'building, and that decision is impossible without consistent categories to count. And it can ' +
        'drive default SLA and priority, a "security incident" category might carry a much shorter ' +
        'response clock than a "how do I" question by default, before anyone even reads the details.',
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
      'The reporting angle is worth remembering specifically: a badly or inconsistently categorised ' +
      'queue makes it impossible to answer "what are we spending our time on", which is one of the first ' +
      'questions any manager asks about a help desk.',
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
        'IMPACT is how much of the business is affected, one person, one team, or everyone. URGENCY is ' +
        'how quickly the consequences get worse if nothing happens. A priority matrix combines the two: ' +
        'high impact plus high urgency is the clear P1 (a company-wide outage happening right now), low ' +
        'impact plus low urgency is the clear low priority (one person\'s minor cosmetic issue), and the ' +
        'interesting cases sit in between, high impact but low urgency (a slow-burning issue affecting ' +
        'many people that is not getting worse by the minute) still often outranks low impact but high ' +
        'urgency (one person\'s issue that feels urgent to them but affects nobody else). A matrix makes ' +
        'that judgement consistent across whoever is triaging, rather than depending on who happens to be ' +
        'on shift.',
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
      'This is the same signal-versus-noise skill from Log Analysis and Alert Triage, applied to tickets ' +
      'instead of log lines: a small number of dimensions, applied consistently, beats a case-by-case ' +
      'judgement call every time.',
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
        'This is deliberately the case where the loudest request and the correct priority disagree. A ' +
        'broken mouse affects one person and has a trivial workaround (a spare mouse, or five minutes ' +
        'without one), regardless of who that person is. A building-wide Wi-Fi outage affects everyone in ' +
        'the building and has no workaround at all for anyone relying on it. Impact scope, not the ' +
        'requester\'s seniority, is what the priority matrix is built on, and a technician who lets ' +
        'seniority override impact will eventually be the person who left an entire office offline ' +
        'because a director\'s peripheral felt more pressing in the moment. The defensible answer, in a ' +
        'ticket you can show a manager afterward, is the one built on scope.',
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
      'A ticketing system that lets this kind of call get made consistently, rather than by whoever ' +
      'shouts loudest, is exactly what a priority matrix is for. It is also a genuinely useful thing to ' +
      'be able to defend to a manager after the fact.',
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
        'An SLA is a commitment tied to priority: a P1 might promise a response within 15 minutes and ' +
        'resolution within 4 hours, while a P4 might promise a response within a business day. Missing it ' +
        'is an SLA BREACH, which is typically tracked and reported on, because a pattern of breaches is ' +
        'evidence the team is understaffed or the process is broken, not just an individual failure. The ' +
        'clock can legitimately be paused in specific circumstances, most commonly while waiting on the ' +
        'requester for information the technician cannot proceed without, since it would be unfair to ' +
        'count time the team was not actually able to act.',
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
      'The "pending customer response" pause is worth knowing specifically: it is the standard mechanism ' +
      'that keeps a technician\'s SLA metrics fair when the delay genuinely was not on their side.',
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
        'Normal triage assumes there is time to work through a queue in priority order, and most tickets ' +
        'fit that assumption. Some do not: a user reporting a RANSOM NOTE or files suddenly encrypted, ' +
        'evidence of ACTIVE DATA EXFILTRATION, or a report that looks like an ACCOUNT COMPROMISE in ' +
        'progress are all situations where every additional minute in a queue has a cost that a normal ' +
        'ticket does not. These get routed straight to whoever handles security incidents, often before ' +
        'the ticket has even been fully categorised, because the cost of treating it as routine while it ' +
        'is investigated is far higher than the cost of a false alarm.',
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
      'This is the exact seam between this package and Incident Detection and Alert Triage: some tickets ' +
      'are never really "tickets" at all, they are incidents wearing a ticket\'s clothing, and recognising ' +
      'that at intake is a real skill worth having before you ever touch a SIEM.',
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
        'Assignment is a database field. OWNERSHIP is a behaviour. It means updating the status so ' +
        'anyone glancing at the queue can see it is actively being worked, communicating a realistic ' +
        'timeframe to the requester rather than leaving them wondering, and staying accountable for it ' +
        'until it is resolved or properly handed off, not letting it quietly go stale in your queue while ' +
        'you work on something else. A ticket that is "assigned" but untouched for three days, with no ' +
        'status update and no communication, is not owned by anyone in any meaningful sense, whatever the ' +
        'assignee field says.',
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
      'not that is true. Communicating a timeframe, even a rough one, is one of the cheapest ways to buy ' +
      'goodwill in this job.',
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
        'Plans change: the technician working a ticket gets pulled onto something urgent, goes on leave, ' +
        'or the ticket sits open long enough that a shift change happens in the middle of it. Notes ' +
        'written only for your own memory, "tried the usual fix, will check tomorrow", are useless to ' +
        'whoever picks it up next, and worse, they are useless to YOU a week later when you have long ' +
        'since forgotten the specifics. Writing for a stranger, what was tried, what the result was, what ' +
        'is left to check, means the ticket can be picked up by anyone without a phone call to track the ' +
        'original technician down, and it is also what creates a real audit trail if the ticket ever needs ' +
        'to be reviewed later.',
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
      'This is the same discipline behind a good incident timeline in Blue Team Foundations: written for ' +
      'someone who was not there, because eventually someone who was not there is exactly who has to read ' +
      'it.',
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
        'Escalation is not admitting failure, it is routing a ticket to whoever can actually resolve it ' +
        'fastest, which is not always you. Good reasons include the issue turning out to need ACCESS OR ' +
        'TOOLING you do not have (a server you cannot log into, a system outside your permissions), ' +
        'genuinely being outside your KNOWLEDGE scope after a reasonable attempt, the SLA clock being ' +
        'close to breach with no resolution in sight, and having tried the standard fixes without success, ' +
        'repeating the same failed attempt a fourth time is not persistence, it is a ticket that should ' +
        'have moved on after the second.',
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
      'a strength, not a weakness. It is worth internalising that early, since the instinct to "just keep ' +
      'trying" is a common and expensive one for new hires.',
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
        'Ticket ping-pong almost never means either team is being lazy, it usually means there is no ' +
        'AGREED, PRE-DEFINED CRITERIA for where a ticket of this shape belongs, so each team is making a ' +
        'reasonable individual judgement that happens to disagree with the other team\'s reasonable ' +
        'individual judgement. The one-time fix is getting someone with authority over both queues (a ' +
        'lead, or a war-room call) to make the call and get the ticket actually worked. The lasting fix is ' +
        'different: agree on routing criteria for this category of issue in advance, in writing, so the ' +
        'next similar ticket does not repeat the same argument. Fixing the ticket in front of you and ' +
        'fixing the process are two different pieces of work, and skipping the second one guarantees a ' +
        'repeat.',
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
      'This is the ticketing-system version of a pattern that shows up everywhere in security work: fixing ' +
      'the instance in front of you and fixing the process that produced it are two different jobs, and a ' +
      'good technician does not stop after the first one.',
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
        'A fix that should have worked and a fix that DID work are different claims, and only the ' +
        'requester can confirm the second one, since they are the one actually using the system. Closing ' +
        'the moment a fix is applied, without confirmation, risks closing a ticket that is still broken ' +
        'from the user\'s point of view. The standard, fair alternative to waiting indefinitely is an ' +
        'AUTO-CLOSE policy: mark it resolved-pending-confirmation, tell the user, and auto-close after a ' +
        'set number of days of no response, which respects the requester\'s time to confirm while still ' +
        'giving the queue a way to move forward.',
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
      'A pattern of tickets reopened shortly after being closed is one of the clearest quality signals a ' +
      'help desk manager can look at, and it usually traces back to exactly this: closing on "should have ' +
      'worked" instead of confirmed.',
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
        'A reboot is a genuine fix for the symptom, the server is working again, and it can be entirely ' +
        'correct to close THIS ticket on that basis. But a symptom recurring on a schedule is evidence of ' +
        'an underlying cause that has not been found, and treating each week\'s reboot as an isolated, ' +
        'fully resolved incident misses that pattern entirely. The right move is closing the immediate ' +
        'ticket while also raising a separate PROBLEM record (or flagging a trend) to investigate the root ' +
        'cause, which is a distinct piece of work from firefighting this week\'s instance.',
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
      'This is the ticketing-system version of the difference between an incident and a problem in ITIL ' +
      'terms, and it is worth being able to explain that distinction in an interview even if you never use ' +
      'the word "ITIL" while doing it.',
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
        'A resolved ticket with no note is a dead end: the fact that it was fixed is recorded, but the HOW ' +
        'is gone, which means the single most valuable output of solving a problem, a reusable pattern for ' +
        'next time, was thrown away. The next technician who sees a similar report has no way to search ' +
        'the ticketing system and find "here is what worked last time", so they start from zero and ' +
        're-derive a fix that already existed. Over enough tickets this is a genuinely large amount of ' +
        'repeated, avoidable work, and it is also exactly the raw material a proper knowledge base is ' +
        'built from, which never gets built if resolution notes are consistently skipped.',
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
      'A resolution note is not documentation for its own sake, it is the thing that turns one technician\'s ' +
      'solved problem into every technician\'s faster problem, which is exactly the leverage a knowledge ' +
      'base is supposed to provide.',
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
        'REOPENING is right when this is genuinely the SAME underlying issue recurring, the fix did not ' +
        'actually hold, or the symptom has clearly come back, and it matters for reporting accuracy: a ' +
        'reopened ticket correctly shows up as a fix that did not stick, which is a meaningful signal, ' +
        'while quietly logging it as a brand new ticket hides that the original resolution failed. A NEW ' +
        'TICKET is right when it turns out to be a genuinely different, unrelated problem that merely ' +
        'looks similar on the surface, or when the original ticket is so old that reopening it would ' +
        'muddy a timeline that has moved on. Choosing correctly keeps the metrics honest either way.',
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
      'This closes the loop back to hd.4.2: a reopened ticket is itself a pattern signal, exactly like the ' +
      'weekly reboot was, and both point at the same underlying discipline, noticing recurrence rather ' +
      'than treating every instance as isolated.',
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
