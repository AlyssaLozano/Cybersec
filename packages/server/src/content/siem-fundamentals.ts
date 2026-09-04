/**
 * SIEM Fundamentals: agents, coverage, cost, and the pipeline an alert travels through.
 *
 * WHY THIS PACKAGE EXISTS
 *
 * The `siem` foundation ("SIEM and Detection Search") has sat unbuilt since
 * foundations.ts was written, even though both the `soc` and
 * `detection-engineering` tracks assume it. This is the portfolio-lab version
 * of that gap: deploying a SIEM like Wazuh, adding endpoints for monitoring,
 * and forwarding alerts through an automation platform like n8n for
 * enrichment is one of the most commonly recommended first projects for
 * exactly that reason, it is the shortest path to touching the whole shape of
 * the job: what an agent sees, what is worth keeping, and where an alert goes
 * after it fires.
 *
 * WHY IT NEEDS NO TERMINAL
 *
 * There is no simulated SIEM or automation platform in this codebase, and
 * standing one up would be a project of its own, not a foundations package.
 * What is teachable honestly is the judgement a SIEM deployment actually
 * requires: what an agent's connection status is really telling you, why
 * indexing everything is not the same as being safer, what a sane alert
 * pipeline looks like, and why two sources that both call a field "user"
 * often are not saying the same thing. Every exercise grades a determination,
 * the same way a real Wazuh-plus-n8n write-up stands or falls on whether the
 * pipeline design makes sense, not on which product ran it.
 */

import type { Exercise, LearningPackage } from '@soc/shared';

// --- Module siem.1: agents and endpoint coverage -----------------------------

const MODULE_SIEM_1: Exercise[] = [
  {
    id: 'siem.1.1',
    moduleId: 'siem.1',
    packageId: 'siem-fundamentals',
    order: 1,
    title: 'What an agent actually forwards',
    kind: 'multiple-choice',
    goal: 'Correct the assumption that a SIEM agent captures literally everything happening on a host.',
    prompt: 'Which of the following correctly describe what a SIEM or EDR agent typically sends to the central platform? Select all that apply.',
    teach: {
      concept:
        'Imagine a security guard whose job is to watch camera footage from a building. That guard can ' +
        'only see through the cameras that are actually installed, and only in the rooms someone chose to ' +
        'point them at. A hallway with no camera might have anything happening in it, and the guard has no ' +
        'way of knowing, because there is simply no feed showing it.\n\n' +
        'That is the situation with a piece of software called an AGENT. An agent is a small program ' +
        'installed on a computer, a server, a laptop, whatever needs watching, whose job is to notice ' +
        'things happening on that machine, like someone logging in, a file changing, or a new program ' +
        'starting up, and send a record of that event to a central system that collects and searches ' +
        'through all of it. That central system is called a SIEM, short for Security Information and ' +
        'Event Management, and for the rest of this package you can think of it as the security team\'s ' +
        'own control room: one place where records from many machines get collected so a person can search ' +
        'across all of them at once.\n\n' +
        'Here is the part that trips people up: installing an agent on a machine does not mean the agent ' +
        'sees literally everything that machine does, any more than installing one camera means a building ' +
        'has no blind spots. An agent is CONFIGURED, meaning someone decides in advance which kinds of ' +
        'events it should pay attention to and forward: logins, changes to specific watched files, new ' +
        'processes starting, or whatever log sources it has been pointed at. Anything outside that ' +
        'configuration never gets sent anywhere at all. It does not get flagged as missing, it is simply ' +
        'never recorded in the first place.\n\n' +
        'This distinction matters directly for the job: "we have an agent installed on this server" is not ' +
        'the same claim as "we can see everything that happens on this server." A host with an agent ' +
        'running but a narrow list of things it watches for can still have real blind spots, the security ' +
        'equivalent of a hallway with no camera in it, and treating "there is an agent here" as proof of ' +
        'full visibility is one of the most common false senses of security in this line of work.',
    },
    options: [
      { id: 'a', label: 'An agent forwards authentication events, file integrity changes, and process execution, among other configured sources.' },
      { id: 'b', label: 'What an agent forwards is determined by its configuration, not automatic full-system capture.' },
      { id: 'c', label: 'An installed agent, by default, captures everything that happens on the host with no configuration needed.' },
      { id: 'd', label: 'A narrow agent ruleset can leave real blind spots even on a host that technically has an agent installed.' },
    ],
    hints: [
      'Three describe how an agent genuinely behaves. One claims installation alone guarantees total visibility, which it does not.',
    ],
    solution:
      'A, B, and D. Coverage is a configuration choice, not an automatic guarantee of installation. C is ' +
      'the exact misconception this module exists to correct: an agent sees only what it is told to look ' +
      'for.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'An agent forwards what it is configured to collect, not everything happening on the host by default.',
      },
    ],
    debrief:
      'This is worth stating explicitly in a portfolio write-up: naming exactly what your Wazuh ruleset ' +
      'was configured to watch is far more credible than an unqualified claim of full visibility into the ' +
      'endpoint, in the same way a security report that says "camera covers the front door and loading ' +
      'dock only" is more trustworthy than one that just says "the building is covered."',
    practice: [],
  },
  {
    id: 'siem.1.2',
    moduleId: 'siem.1',
    packageId: 'siem-fundamentals',
    order: 2,
    title: 'Reading an agent status dashboard',
    kind: 'multiple-choice',
    goal: 'Interpret the four agent states a fleet dashboard typically shows, correctly.',
    prompt: 'A Wazuh-style endpoint summary shows agents grouped as Active, Disconnected, Pending, and Never Connected. Which of the following correctly describe what each state means? Select all that apply.',
    teach: {
      concept:
        'Think of an agent, the small program from the previous exercise that watches a machine and reports ' +
        'in, like an employee who is supposed to check in with headquarters every few minutes to say "still ' +
        'here, still working." A dashboard that tracks a whole fleet of these agents is really just a list ' +
        'of everyone\'s last check-in status, grouped into a few possible states. Four states show up on ' +
        'this kind of dashboard, ACTIVE, DISCONNECTED, PENDING, and NEVER CONNECTED, and knowing what each ' +
        'one actually means, not just what it sounds like it means, is a core skill.\n\n' +
        'ACTIVE is the easy one: the agent is currently checking in on schedule, same as an employee texting ' +
        'in right on time. PENDING means someone has started setting the agent up, the equivalent of hiring ' +
        'the employee, but it has not completed its very first check-in yet. NEVER CONNECTED means the ' +
        'agent was registered on the platform, meaning it exists in the system as something that is ' +
        'supposed to report, but has never actually managed to connect at all, often because installation ' +
        'never finished or a firewall is blocking the connection, the equivalent of an employee who was ' +
        'hired but never actually showed up for a single shift.\n\n' +
        'DISCONNECTED is the one that deserves real care, because it is tempting to read it as a single, ' +
        'simple explanation, "must just be off for the night", when it actually covers several very ' +
        'different possibilities. It could mean the machine is simply powered off. It could also mean the ' +
        'agent crashed, was deliberately disabled, or, in the worst case, was killed by whatever had ' +
        'compromised the host, since disabling the thing that would report you is a very ordinary first ' +
        'move for an attacker who does not want to get caught. The dashboard cannot tell you which of these ' +
        'is true just from the word "disconnected", it only tells you that check-ins have stopped.\n\n' +
        'This matters for the job because a dashboard full of green "Active" agents feels reassuring, but ' +
        'the real skill is not reading the easy states correctly, it is resisting the urge to wave away the ' +
        'ambiguous one.',
    },
    options: [
      { id: 'a', label: 'Active means the agent is currently checking in and reporting as expected.' },
      { id: 'b', label: 'Disconnected always means the host is simply powered off, and needs no further checking.' },
      { id: 'c', label: 'Never Connected means the agent was registered but has never actually completed a connection to the platform.' },
      { id: 'd', label: 'Pending means enrollment has started but the agent has not completed its first check-in.' },
    ],
    hints: [
      'Three states are described accurately. One assumes a single, always-benign explanation for a state that actually has several possible causes.',
    ],
    solution:
      'A, C, and D. Disconnected is the one to be careful with: it has several possible causes, powered ' +
      'off, crashed agent, or something more concerning, and treating "always just powered off" as a safe ' +
      'default assumption is exactly the mistake the next exercise digs into.',
    expectedOutput: 'Options A, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'c', 'd'],
        hint: 'Disconnected has more than one possible cause, powered off is only one of them, not a safe universal assumption.',
      },
    ],
    debrief:
      'Hold onto that ambiguity in Disconnected. The next exercise asks exactly what you would actually ' +
      'check before assuming it means nothing, the same way you would not assume an employee who stopped ' +
      'answering texts overnight is definitely just asleep without checking anything at all.',
    practice: [],
  },
  {
    id: 'siem.1.3',
    moduleId: 'siem.1',
    packageId: 'siem-fundamentals',
    order: 3,
    title: 'Six disconnected agents',
    kind: 'short-answer',
    goal: 'Build a real checklist for a disconnected-agent count, rather than assuming it away.',
    prompt:
      'Your fleet dashboard shows 40 agents Active and 6 Disconnected. In two or three sentences, ' +
      'describe what you would actually check before assuming those six are just powered-off laptops.',
    teach: {
      concept:
        'The comfortable assumption, that six disconnected agents out of forty-six are probably just ' +
        'laptops powered off for the night, might turn out to be correct. But "probably right" and ' +
        '"checked" are different things, and the whole point of this exercise is that a security analyst ' +
        'does not get to skip straight to the comfortable answer without doing the work to confirm it.\n\n' +
        'A real check starts with something called an ASSET INVENTORY, which is nothing more exotic than a ' +
        'list, kept somewhere, of every machine an organization owns and what kind of machine it is: this ' +
        'one is a laptop assigned to an employee, this one is a server that runs the company\'s website and ' +
        'is expected to stay on around the clock. Comparing the six disconnected agents against that list ' +
        'tells you immediately whether you are looking at something ordinary, a laptop closed and put away ' +
        'for the night, or something that should never go quiet, a server that is supposed to run ' +
        'continuously.\n\n' +
        'The second thing to check is the LAST-SEEN timestamp, which is simply the last time each agent ' +
        'successfully checked in. An agent that stopped checking in ten minutes ago is a very different ' +
        'situation from one that has been silent for three weeks and nobody noticed, even though both ' +
        'currently show up as "Disconnected" on the dashboard.\n\n' +
        'The third thing is whether the disconnection lines up with anything else that happened around the ' +
        'same time: an alert that fired moments before it went dark, a change ticket that explains a ' +
        'planned reboot, or nothing at all, which is itself useful information. Skipping straight to ' +
        '"probably fine" without doing any of this is exactly the blind spot an attacker who disabled their ' +
        'own agent is counting on the analyst to fall into.',
    },
    hints: [
      'The comfortable assumption might be right, but the point is that it has to be checked, not assumed.',
      'A good answer names at least two concrete things to check: what kind of host it is, and when it last checked in or what happened right before.',
    ],
    solution:
      'I would check each of the six against an asset inventory to see what kind of host it actually is, ' +
      'since a laptop being off overnight is very different from a server that should never go down. I ' +
      'would look at the last-seen timestamp for each one, since an agent that dropped ten minutes ago is ' +
      'a different situation from one silent for weeks. And I would check whether the disconnection ' +
      'correlates with anything else, a preceding alert or a scheduled change, rather than assuming it is ' +
      'benign just because that is the more comfortable explanation.',
    expectedOutput: 'An answer naming asset inventory comparison, last-seen timing, and checking for correlated events, rather than assuming the disconnections are benign.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['inventory', 'asset', 'kind of host', 'server', 'laptop'],
          ['last seen', 'timestamp', 'how long', 'correlat', 'preceded', 'before it'],
        ],
        hint: 'Name at least checking each host against an asset inventory and looking at when it was last seen or what happened just before it dropped.',
      },
    ],
    debrief:
      'This is the same discipline from net.1.1 in Networking Basics, confirming an absence rather than ' +
      'assuming it, applied here to a fleet of agents on a dashboard instead of a single host\'s list of ' +
      'open connections.',
    practice: [],
  },
  {
    id: 'siem.1.4',
    moduleId: 'siem.1',
    packageId: 'siem-fundamentals',
    order: 4,
    title: '"We have a SIEM" is not the same claim as "we have visibility"',
    kind: 'multiple-choice',
    goal: 'Connect agent coverage gaps directly to what a SOC can and cannot see.',
    prompt: 'Which of the following correctly describe the relationship between deploying a SIEM and actually having visibility? Select all that apply.',
    teach: {
      concept:
        'Owning a car does not mean you have driven to every city in the country, it only means you own a ' +
        'car, and where it has actually gone depends on where someone chose to drive it. The same logic ' +
        'applies to a SIEM platform, the central collection system from earlier in this module: an ' +
        'organization can have a fully working, fully paid-for SIEM running, and that fact alone tells you ' +
        'nothing about what it can actually see. What the SIEM can see depends entirely on which machines ' +
        'have an agent installed on them, which log sources those agents were configured to forward, and ' +
        'whether those agents are actually online right now.\n\n' +
        'A machine with no agent installed at all generates zero alerts no matter what happens on it, not ' +
        'because nothing happened, but because nobody was watching that machine in the first place. This is ' +
        'why COVERAGE, meaning what percentage of an organization\'s machines, often called its ESTATE, the ' +
        'full collection of computers, servers, and devices it operates, are actually being monitored, and ' +
        'how completely, is one of the first questions a real security team needs to be able to answer ' +
        'honestly. It is a genuinely different question from "do we own a SIEM license", the same way ' +
        'owning a car is a different question from having driven it everywhere.\n\n' +
        'This distinction is exactly what makes the difference between an honest security posture and a ' +
        'false sense of one: a team that can say "we have agents on sixty percent of our machines, covering ' +
        'these specific log types" knows something true and useful about its own blind spots, while a team ' +
        'that just says "we have a SIEM" and stops there has not actually answered the question at all.',
    },
    options: [
      { id: 'a', label: 'A host with no agent installed generates zero alerts regardless of what actually happens on it.' },
      { id: 'b', label: 'Visibility depends on which hosts are covered and which sources are forwarded, not on owning the platform.' },
      { id: 'c', label: 'Once a SIEM platform is deployed anywhere in the environment, the whole estate is considered covered.' },
      { id: 'd', label: 'Coverage, what percentage of the estate is actually monitored, is a distinct and important question from platform ownership.' },
    ],
    hints: [
      'Three describe how coverage actually works. One conflates owning the platform with having covered the whole environment.',
    ],
    solution:
      'A, B, and D. Coverage is about which hosts actually report, not about the platform existing ' +
      'somewhere in the environment. C is the trap: a SIEM deployed on ten percent of an estate has ten ' +
      'percent visibility, whatever the license says.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'Owning a SIEM platform is not the same claim as having covered the whole estate with agents.',
      },
    ],
    debrief:
      'A home lab that honestly reports "two endpoints onboarded, here is what each one forwards" is a ' +
      'far stronger portfolio artefact than one that implies total visibility without saying what was ' +
      'actually covered, the same way "I drove to these two cities" is a more honest claim than "I own a ' +
      'car."',
    practice: [],
  },
];

// --- Module siem.2: what is worth indexing -----------------------------------

const MODULE_SIEM_2: Exercise[] = [
  {
    id: 'siem.2.1',
    moduleId: 'siem.2',
    packageId: 'siem-fundamentals',
    order: 1,
    title: 'Indexing everything is not free',
    kind: 'multiple-choice',
    goal: 'Understand ingestion volume as a real cost, not a settings toggle with no downside.',
    prompt: 'Which of the following are real consequences of indexing every available log source without any filtering? Select all that apply.',
    teach: {
      concept:
        'Every event an agent forwards has to go somewhere once it reaches the SIEM: it gets processed and ' +
        'stored in a way that makes it searchable later. That whole process, taking in a stream of incoming ' +
        'events and making them part of the searchable collection, is called INGESTION, and the searchable ' +
        'collection itself is called an INDEX, think of it as a librarian\'s card catalogue rather than just ' +
        'a pile of books on a shelf: it is what lets someone search and find a specific record quickly ' +
        'instead of reading through everything by hand.\n\n' +
        'It might seem like the safest possible choice is to index absolutely everything a machine could ' +
        'ever log, on the theory that more data can only help. But that ignores that ingestion has a real, ' +
        'tangible cost. Many SIEM platforms charge based on how much volume passes through them, measured ' +
        'either as events per second or as gigabytes per day, so indexing everything is a direct bill, not ' +
        'a free safety margin. It also has a real performance cost: searching through a much larger index ' +
        'takes longer, and that delay matters most during an actual security incident, which is exactly ' +
        'the moment speed matters most.\n\n' +
        'None of this means low-value data should simply be thrown away, a later exercise in this module ' +
        'covers cheaper ways to keep it. The point here is narrower: "just index everything to be safe" is ' +
        'not a neutral, no-downside default. It is a real tradeoff between cost, speed, and how much data ' +
        'you keep in the most expensive, fastest-to-search place, and pretending that tradeoff does not ' +
        'exist is itself a mistake.',
    },
    options: [
      { id: 'a', label: 'Many SIEM platforms charge based on ingestion volume, so indexing everything has a direct cost.' },
      { id: 'b', label: 'A larger index makes searches slower, which matters most during an active incident.' },
      { id: 'c', label: 'Indexing everything has no meaningful downside, so it is always the safest default.' },
      { id: 'd', label: 'Cost and search speed are real tradeoffs to weigh when deciding what to index, not settings with no consequence.' },
    ],
    hints: [
      'Three describe genuine costs of unfiltered ingestion. One claims there is no downside at all, which is the misconception here.',
    ],
    solution:
      'A, B, and D. Cost and search performance are real, and pretending otherwise (option C) is exactly ' +
      'the assumption the next two exercises push back on with a concrete example.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'Indexing everything has real cost and performance consequences, it is not a free, downside-free default.',
      },
    ],
    debrief:
      'This is the SIEM equivalent of the listener-table lesson from Networking Basics: the total count is ' +
      'rarely the number that matters, the number that matters is the one you can actually search through ' +
      'fast enough to act on.',
    practice: [],
  },
  {
    id: 'siem.2.2',
    moduleId: 'siem.2',
    packageId: 'siem-fundamentals',
    order: 2,
    title: 'Fifty gigabytes of allowed traffic, or two hundred megabytes of denied',
    kind: 'short-answer',
    goal: 'Apply a signal-versus-cost tradeoff to a concrete, sized example.',
    prompt:
      'Your firewall generates roughly 50GB a day of allowed-traffic logs and 200MB a day of ' +
      'denied-traffic logs. In two or three sentences, say which you would prioritise keeping in an ' +
      'expensive, searchable hot index, and why.',
    teach: {
      concept:
        'Think about a firewall the way you would think about a doorway with a logbook next to it: every ' +
        'time something tries to pass through, in either direction, it gets written down, whether it was ' +
        'let through or turned away. A firewall that logs fifty gigabytes a day of ALLOWED traffic and only ' +
        'two hundred megabytes a day of DENIED traffic is describing two very different kinds of doorway ' +
        'activity: the first number is the sound of the network doing exactly what it is supposed to do, ' +
        'all day, every day. The second is far smaller, and made up mostly of attempts that got turned ' +
        'away, someone or something probing at a door that would not open.\n\n' +
        'Event for event, denied traffic is far more likely to represent something worth a closer look: a ' +
        'scan, a probe, a misconfigured or compromised machine trying to reach somewhere it should not be ' +
        'reaching. And there is vastly less of it to search through. Allowed traffic, at fifty gigabytes a ' +
        'day, is expensive to keep in a HOT index, meaning the fully searchable, instantly queryable place ' +
        'data lives when you need to find it fast (the term comes up again, and gets defined more fully, in ' +
        'the next exercise), and most of what is in it is low in security signal precisely because it is ' +
        'the network behaving normally.\n\n' +
        'The honest answer here is not "throw the allowed logs away." They still have real value later, for ' +
        'retrospective investigation and for compliance requirements that specify how long certain records ' +
        'must be kept. It is that the two datasets belong in different places: the small, high-signal ' +
        'denied logs earn their spot in the expensive, fast-searching hot index, while the large, ' +
        'low-signal allowed logs belong somewhere cheaper that trades search speed for cost.',
    },
    hints: [
      'The question is not whether the 50GB has value, it is where each dataset belongs given its size and signal density.',
      'Denied traffic is smaller and, event for event, more likely to be worth investigating.',
    ],
    solution:
      'I would prioritise the denied-traffic logs for the hot, searchable index. They are far smaller in ' +
      'volume and, event for event, more likely to represent something worth investigating, like a scan or ' +
      'a probe. The 50GB of allowed traffic still has value, mostly for retrospective investigation and ' +
      'compliance, but at that volume it belongs in a cheaper cold or archive tier rather than the ' +
      'expensive searchable index, since most of it is the network working exactly as intended.',
    expectedOutput: 'An answer prioritising the denied-traffic logs for the hot tier and explaining the signal-versus-volume tradeoff for the allowed traffic.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['denied', 'blocked', 'smaller', 'higher signal', 'worth investigating'],
          ['allowed', 'cold', 'archive', 'cheaper', 'volume'],
        ],
        hint: 'Prioritise the denied-traffic logs for the hot tier, and explain what happens to the much larger allowed-traffic volume instead of just discarding it.',
      },
    ],
    debrief:
      'This exact tradeoff, small and high-signal against large and low-signal, is why hot and cold storage ' +
      'tiers exist at all in every real SIEM deployment, and it is worth naming explicitly in a portfolio ' +
      'write-up as a deliberate design decision rather than a default you never questioned.',
    practice: [],
  },
  {
    id: 'siem.2.3',
    moduleId: 'siem.2',
    packageId: 'siem-fundamentals',
    order: 3,
    title: 'Hot, and cold, are not the same as kept and discarded',
    kind: 'multiple-choice',
    goal: 'Understand storage tiering as a way to keep data affordably rather than a decision to throw it away.',
    prompt: 'Which of the following correctly describe the difference between a hot (searchable) index and a cold or archive tier? Select all that apply.',
    teach: {
      concept:
        'The previous exercise used the term "hot index" without fully defining it, so start there. A HOT ' +
        'tier is the fully indexed, fully searchable place data lives in a SIEM, the equivalent of a filing ' +
        'cabinet sitting open on your desk: anything in it can be found in seconds. It is also the most ' +
        'expensive place to keep data, the same way desk space near you is more valuable and limited than a ' +
        'warehouse across town.\n\n' +
        'A COLD tier, sometimes called an ARCHIVE, stores the exact same kind of data far more cheaply, ' +
        'usually compressed down and not fully indexed, the equivalent of boxing up old files and sending ' +
        'them to that warehouse. The tradeoff is search speed for cost: finding something in the warehouse ' +
        'means someone has to go get the box first. In SIEM terms, that "going and getting the box" step ' +
        'has a name, REHYDRATION, meaning loading archived data back into a searchable form before it can ' +
        'actually be queried directly. It is not instant, but it is also not gone.\n\n' +
        'That last point is the one worth sitting with: moving a source into cold storage is a decision ' +
        'about how fast you need to be able to search it, not a decision to stop keeping it at all. A box ' +
        'in a warehouse still contains the files, it is just slower to reach than the ones on your desk.',
    },
    options: [
      { id: 'a', label: 'A hot tier is fully indexed and fast to search, and is the most expensive place to store data.' },
      { id: 'b', label: 'A cold or archive tier is cheaper but usually needs to be rehydrated before it can be searched directly.' },
      { id: 'c', label: 'Moving data to a cold tier means it has effectively been discarded and is no longer available.' },
      { id: 'd', label: 'Tiering is a decision about search speed versus cost, not about whether to keep the data at all.' },
    ],
    hints: [
      'Three describe how tiering actually works. One confuses "cheaper and slower to search" with "gone".',
    ],
    solution:
      'A, B, and D. The tradeoff is speed versus cost, and the data is still retained either way. C is ' +
      'wrong: cold storage is slower and cheaper, not equivalent to deletion.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'Cold storage trades search speed for cost, it does not mean the data has been discarded.',
      },
    ],
    debrief:
      'This distinction matters for compliance conversations specifically: "we do not index that source in ' +
      'the hot tier" and "we do not retain that source at all" are very different statements, and mixing ' +
      'them up in an audit, telling an auditor data is gone when it is really just archived, is a genuinely ' +
      'bad moment.',
    practice: [],
  },
  {
    id: 'siem.2.4',
    moduleId: 'siem.2',
    packageId: 'siem-fundamentals',
    order: 4,
    title: 'What makes a source high value for detection',
    kind: 'multiple-choice',
    goal: 'Identify the characteristics that make a log source worth prioritising for detection work specifically.',
    prompt: 'Which of the following describe why a log source is considered high value specifically for detection, as opposed to just general logging? Select all that apply.',
    teach: {
      concept:
        'Not every log source is equally useful for spotting an attacker, and the reason comes down to what ' +
        'the word DETECTION actually means in this line of work: noticing, from the records a SIEM has ' +
        'collected, that something an attacker would do is actually happening. A source is high value for ' +
        'detection specifically when it frequently carries the exact kind of signal a security analyst is ' +
        'looking for when they ask "did someone just do something they should not have."\n\n' +
        'Three source types come up again and again as classic, high-value examples. AUTHENTICATION events ' +
        'record who is logging in, from where, and whether the attempt succeeded or failed, which is ' +
        'directly useful because getting into an account or a machine is one of the very first things ' +
        'almost every attacker needs to do. PROCESS CREATION events record what program actually ran on a ' +
        'machine and who or what started it, which matters because running something, a script, a tool, a ' +
        'piece of malware, is usually the next step after getting in. DNS query logs record what address or ' +
        'domain name a machine tried to look up before connecting anywhere, which is useful because a ' +
        'machine reaching out to a suspicious domain often shows up here before the connection itself even ' +
        'completes.\n\n' +
        'A source can generate an enormous amount of data and still be low value for detection specifically ' +
        'if what it mostly contains duplicates a signal you already get more cheaply from one of these ' +
        'three. Value for detection is not about how much data a source produces, it is about whether what ' +
        'that data contains actually tends to show up when something bad is happening.',
    },
    options: [
      { id: 'a', label: 'Authentication events are high value because they show who logged in, from where, and whether it succeeded.' },
      { id: 'b', label: 'Process creation events are high value because they show what actually ran on a host, and by whom.' },
      { id: 'c', label: 'DNS query logs are high value because they show what a host is trying to reach, often before a connection completes.' },
      { id: 'd', label: 'A source\'s value for detection is purely a function of how much volume it produces, regardless of what it actually contains.' },
    ],
    hints: [
      'Three name specific, genuinely high-signal source types. One claims volume alone determines value, which ignores content entirely.',
    ],
    solution:
      'A, B, and C. Each is a specific, well-established high-signal source for detection work. D is wrong: ' +
      'a source\'s value comes from what it contains and how it correlates with an attacker\'s actions, not ' +
      'from raw volume.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'Value for detection comes from what a source contains, not from how much volume it produces.',
      },
    ],
    debrief:
      'Notice that all three, authentication, process execution, and DNS, are exactly the categories a ' +
      'well-configured agent forwards, the same agent this whole package opened with back in module ' +
      'siem.1. Coverage and indexing priority turn out to be the same underlying judgement, just applied at ' +
      'two different points along the pipeline.',
    practice: [],
  },
];

// --- Module siem.3: alert pipelines and automation ---------------------------

const MODULE_SIEM_3: Exercise[] = [
  {
    id: 'siem.3.1',
    moduleId: 'siem.3',
    packageId: 'siem-fundamentals',
    order: 1,
    title: 'The shape of an alert pipeline',
    kind: 'multiple-choice',
    goal: 'Learn the standard sequence an alert travels through once it fires, before it reaches a human.',
    prompt: 'A common architecture sends a SIEM alert to an automation platform for enrichment before notifying anyone. Which of the following correctly describe this pipeline? Select all that apply.',
    teach: {
      concept:
        'When a rule inside a SIEM matches something it was written to catch, say, ten failed logins on the ' +
        'same account within a minute, it produces an ALERT: a record saying, in effect, "this specific ' +
        'thing just happened, and it might be worth a person\'s attention." What happens between that ' +
        'moment and a human actually seeing it is not automatic or instant in a well-built setup, it goes ' +
        'through a deliberate sequence of steps, and that sequence is what this exercise is about.\n\n' +
        'A common design sends the alert, often through something called a WEBHOOK, a simple, automatic ' +
        'message one piece of software sends to another the moment something happens, the digital ' +
        'equivalent of one system tapping another on the shoulder, to a separate AUTOMATION PLATFORM, a ' +
        'tool built for running a chain of steps automatically without a person clicking through each one ' +
        'by hand. Before any human ever looks at the alert, that automation platform runs ENRICHMENT steps: ' +
        'automatically looking up extra context about whatever the alert involves, such as whether an IP ' +
        'address has a history of malicious activity, who registered a suspicious domain, or how critical ' +
        'the affected machine actually is to the business. Only after that enrichment happens does a ' +
        'notification or a ticket actually get created for a person to look at.\n\n' +
        'The value of this whole extra layer is doing the boring, repeatable lookups the exact same way ' +
        'every single time, automatically, so that the analyst who eventually opens the alert already has ' +
        'context attached to it instead of starting every single investigation from a bare, unexplained IP ' +
        'address or username.',
    },
    options: [
      { id: 'a', label: 'A SIEM rule firing is typically the first step, before any enrichment happens.' },
      { id: 'b', label: 'An automation platform can run enrichment steps automatically, before a human ever sees the alert.' },
      { id: 'c', label: 'Enrichment means adding context like threat intelligence or asset data, not replacing the alert with something else.' },
      { id: 'd', label: 'This pipeline exists mainly to reduce the number of steps a SIEM itself needs to perform internally.' },
    ],
    hints: [
      'Three describe the real sequence and purpose of this pipeline. One mischaracterises why the automation layer exists at all.',
    ],
    solution:
      'A, B, and C. The sequence is rule fires, then automated enrichment, then notification, and ' +
      'enrichment adds context rather than replacing anything. D misstates the purpose: the point is not ' +
      'reducing the SIEM\'s own internal steps, it is adding context an analyst would otherwise have to go ' +
      'look up manually every single time.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'The automation layer exists to add context automatically, not to reduce steps inside the SIEM itself.',
      },
    ],
    debrief:
      'This is literally the pipeline a Wazuh-plus-n8n home lab builds: alerts leaving the SIEM, landing ' +
      'in an automation workflow, and coming out the other side enriched, which is exactly why it is such ' +
      'a commonly recommended first project for someone getting into this field.',
    practice: [],
  },
  {
    id: 'siem.3.2',
    moduleId: 'siem.3',
    packageId: 'siem-fundamentals',
    order: 2,
    title: 'Why not just email the analyst directly',
    kind: 'short-answer',
    goal: 'Justify the automation layer against the simplest possible alternative.',
    prompt:
      'A colleague asks why an alert needs to go through an automation platform at all, when the SIEM ' +
      'could just email the on-call analyst directly the moment a rule fires. In two or three sentences, ' +
      'explain what the automation layer actually buys you.',
    teach: {
      concept:
        'Imagine ten different smoke detectors in the same building all going off because of the exact same ' +
        'kitchen fire, and each one calling the fire department separately. The fire department does not ' +
        'need ten separate calls to understand there is one fire, but if nothing filters those calls first, ' +
        'that is exactly what they get, ten alarms about one event, each demanding attention as if it were ' +
        'new information.\n\n' +
        'A SIEM that emails an analyst the instant any rule fires has the same problem. It has no room for ' +
        'anything that would make an alert more useful before a person sees it. An automation platform ' +
        'sitting in between can FILTER and DEDUPLICATE, meaning it recognizes when several alerts are ' +
        'really just repeated symptoms of the same underlying issue and combines them into one notification ' +
        'instead of firing off ten separate emails for what is really one event. It can also ENRICH ' +
        'consistently, running the exact same lookups, like the threat intelligence and asset checks from ' +
        'the previous exercise, every single time, rather than depending on a busy analyst to remember to ' +
        'do that manually on every alert. And it can take a first pass at TRIAGE, meaning sorting alerts by ' +
        'how serious or credible they look, automatically closing a pattern that experience has shown is ' +
        'reliably harmless, before it ever reaches a person at all.\n\n' +
        'None of that is possible if the SIEM is just emailing straight through with nothing in between. ' +
        'The automation layer is not a decoration, it is what keeps a flood of raw alerts from becoming a ' +
        'flood of raw, unfiltered noise landing directly in someone\'s inbox.',
    },
    hints: [
      'Think about what a direct email pipeline cannot do that this one can: filtering, enrichment, consistent actions.',
      'A good answer names at least two of: deduplication, consistent enrichment, and automated first-pass triage.',
    ],
    solution:
      'A direct email pipeline has no room to filter or deduplicate, so ten instances of the same ' +
      'underlying issue become ten separate emails instead of one. The automation layer can also run the ' +
      'same enrichment lookups, like threat intelligence or asset context, consistently every time rather ' +
      'than relying on the analyst to remember to do it manually, and it can take a first-pass triage ' +
      'action on known-benign patterns before a human is ever paged at all.',
    expectedOutput: 'An answer naming at least two of: deduplication/filtering, consistent enrichment, and automated first-pass triage.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['dedup', 'filter', 'duplicate', 'consolidat'],
          ['enrich', 'consistent', 'context', 'lookup'],
        ],
        hint: 'Name what a direct email pipeline cannot do that this one can, covering at least filtering/deduplication and consistent enrichment.',
      },
    ],
    debrief:
      'The deduplication point is worth remembering specifically. Alert fatigue, the state where an ' +
      'analyst is so overwhelmed by noisy alerts that they start missing real ones, the thing Alert Triage ' +
      'at Volume is built around, is very often a filtering and consolidation problem before it is ever a ' +
      'matter of an analyst\'s individual triage skill.',
    practice: [],
  },
  {
    id: 'siem.3.3',
    moduleId: 'siem.3',
    packageId: 'siem-fundamentals',
    order: 3,
    title: 'What enrichment adds, and what it does not replace',
    kind: 'multiple-choice',
    goal: 'Distinguish enrichment from decision-making, so the automation is not mistaken for judgement.',
    prompt: 'Which of the following correctly describe what enrichment does, and its limits? Select all that apply.',
    teach: {
      concept:
        'Enrichment, the automatic lookups covered in the last two exercises, is context, not a verdict, ' +
        'and the difference between those two things matters more than it might first seem. A threat ' +
        'intelligence lookup showing that an IP address has shown up in prior malicious activity, a WHOIS ' +
        'lookup, a public record showing who registered a domain name, showing who owns a suspicious ' +
        'domain, or an asset lookup showing that the affected machine is a production database rather than ' +
        'a spare test box, all of these make an alert faster and easier to make sense of. What none of them ' +
        'do is decide, on their own, whether the alert actually represents a real incident.\n\n' +
        'That judgement call still belongs to a person, or, in an exercise like the ones in this package, ' +
        'to you. The reason is that context can be misleading in both directions: an IP address with a ' +
        'completely clean reputation does not prove the traffic from it is harmless, and an IP address with ' +
        'a bad reputation does not prove that this specific alert, right now, is actually malicious. ' +
        'Enrichment narrows down what a human needs to check, it does not do the checking for them.\n\n' +
        'Mistaking a tool that adds helpful context for a tool that makes the decision is a genuinely ' +
        'dangerous habit to fall into, because it means trusting an automated system for something it was ' +
        'never built to do.',
    },
    options: [
      { id: 'a', label: 'A threat intelligence lookup on an IP is a form of enrichment, adding context about prior activity.' },
      { id: 'b', label: 'Enrichment automatically decides whether an alert represents a real incident, removing the need for human judgement.' },
      { id: 'c', label: 'An asset criticality lookup, showing whether a host is production or a test box, is a useful enrichment step.' },
      { id: 'd', label: 'Enriched context can still be misleading, so it informs a triage decision rather than replacing it.' },
    ],
    hints: [
      'Three describe real enrichment steps and their proper role. One overclaims what enrichment can decide on its own.',
    ],
    solution:
      'A, C, and D. Enrichment adds real, useful context, and D is the important caveat: it is a decision ' +
      'aid, not a decision-maker. B is wrong, and mistaking automated enrichment for automated judgement is ' +
      'a genuinely dangerous habit for an analyst to fall into.',
    expectedOutput: 'Options A, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'c', 'd'],
        hint: 'Enrichment adds context to inform a decision, it does not make the decision of whether an alert is real on its own.',
      },
    ],
    debrief:
      'This is the same principle the copilot panel teaches in Incident Detection and Alert Triage: a tool ' +
      'that adds context is genuinely valuable, and trusting its output without applying your own ' +
      'judgement on top of it is exactly the failure mode those exercises are built to catch.',
    practice: [],
  },
  {
    id: 'siem.3.4',
    moduleId: 'siem.3',
    packageId: 'siem-fundamentals',
    order: 4,
    title: 'The risk of automating the response, not just the enrichment',
    kind: 'multiple-choice',
    goal: 'Recognise why automated response actions need a much higher confidence bar than automated enrichment.',
    prompt: 'A pipeline is extended to automatically isolate a host from the network the moment a specific rule fires, with no human review. Which of the following are real risks of this design? Select all that apply.',
    teach: {
      concept:
        'Everything described so far, enrichment, adding context to an alert, only adds information. If an ' +
        'enrichment lookup happens to be wrong or unhelpful, the worst outcome is that an analyst has ' +
        'slightly worse context to work with. Nothing in the real world actually changes just because a ' +
        'lookup ran.\n\n' +
        'A RESPONSE action is a completely different kind of thing. Isolating a machine from the network, ' +
        'disabling a user\'s account, blocking an IP address at the firewall, these do not just describe ' +
        'the world, they change it. If a rule automatically triggers one of these actions with no human ' +
        'checking first, and that rule happens to be wrong, what is called a false positive, an alert that ' +
        'looks like a real problem but is not one, the cost is real, immediate, and cannot be undone by ' +
        'catching the mistake after the fact: a legitimate server goes offline, a real employee gets locked ' +
        'out of their own account, right when it happened, with nobody able to step in before it took ' +
        'effect.\n\n' +
        'That does not mean automated response is always the wrong call. It means a rule that is allowed to ' +
        'trigger a response action unattended needs a much higher confidence bar than a rule that only ' +
        'triggers enrichment, because the cost of that rule being wrong is completely different in kind. ' +
        'That is why response automation is usually rolled out in careful stages, starting with alerting ' +
        'only, watching how the rule performs against real traffic for a while, before anyone trusts it to ' +
        'act completely on its own.',
    },
    options: [
      { id: 'a', label: 'A false positive on the triggering rule causes real, immediate harm, such as taking a legitimate server offline.' },
      { id: 'b', label: 'Automated response should generally require a higher confidence threshold than automated enrichment does.' },
      { id: 'c', label: 'Because enrichment is safe to automate, response actions are equally safe to automate with the same rules.' },
      { id: 'd', label: 'A staged rollout, starting with alerting only before any automatic action, is a sound way to build trust in the rule.' },
    ],
    hints: [
      'Enrichment only adds information and cannot itself cause harm. A response action changes something in the real world, which is different.',
      'One option assumes the same rules that are safe for enrichment are automatically safe for response, which does not follow.',
    ],
    solution:
      'A, B, and D. A false positive on a response action has real cost, which is why the confidence bar is ' +
      'higher and a staged rollout is the sound way to earn trust in a rule before it acts unattended. C is ' +
      'the trap: enrichment being safe to automate says nothing about whether a response action built on ' +
      'the same rule is equally safe.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'Enrichment being safe to fully automate does not mean a response action triggered by the same rule is equally safe.',
      },
    ],
    debrief:
      'A home lab is exactly the right place to demonstrate this judgement: showing enrichment fully ' +
      'automated while response actions are deliberately left as a human decision, with the reasoning for ' +
      'that choice written out, is a stronger portfolio artefact than full automatic remediation with no ' +
      'explanation of the risk involved.',
    practice: [],
  },
  {
    id: 'siem.3.5',
    moduleId: 'siem.3',
    packageId: 'siem-fundamentals',
    order: 5,
    title: 'One pipeline for everything is the wrong design',
    kind: 'short-answer',
    goal: 'Diagnose a pipeline design flaw: treating high-volume, low-signal events the same as high-signal ones.',
    prompt:
      'A pipeline sends every firewall "connection denied" event through the exact same enrichment and ' +
      'notification path as every failed login attempt. In two or three sentences, explain what is wrong ' +
      'with that design.',
    teach: {
      concept:
        'Not every kind of event deserves the same amount of attention, and a pipeline that treats them all ' +
        'identically runs into a specific, predictable problem. Picture a building where every single ' +
        'motion sensor, the one by the loading dock that trips constantly from delivery trucks, and the one ' +
        'on a normally-locked vault door that should never trip at all, sends the exact same alarm to the ' +
        'exact same person\'s phone. The vault door tripping is the event that actually matters. But if the ' +
        'loading dock sensor is going off fifty times a day through the same channel, the person watching ' +
        'that phone very quickly stops treating every alert as urgent, including the one time it is the ' +
        'vault door.\n\n' +
        'Denied firewall connections behave like that loading dock sensor: in most environments they are ' +
        'extremely high in volume and mostly routine, background internet scanning noise hitting a closed ' +
        'port, automated bots trying addresses at random, and the occasional harmless misconfiguration. A ' +
        'failed login attempt behaves more like the vault door: much lower volume, and a more consistently ' +
        'meaningful signal that something worth looking at might be happening. Routing both of these ' +
        'through the exact same one-to-one enrichment and notification path floods that channel with ' +
        'mostly uninteresting alerts.\n\n' +
        'That flood leads directly to ALERT FATIGUE: once an analyst learns, through repeated experience, ' +
        'that most of what comes through a given channel is noise, they start reacting to all of it a ' +
        'little less carefully, including the rare alert that actually matters. The fix is not ignoring the ' +
        'high-volume source, it is treating it differently: aggregating it or setting a threshold, only ' +
        'alerting once some count is crossed instead of once per event, rather than routing every single ' +
        'occurrence one-to-one through the same path as genuinely high-signal events like failed logins.',
    },
    hints: [
      'Denied connections are typically high volume and mostly routine, unlike failed logins.',
      'A good answer names alert fatigue as the specific consequence, and proposes aggregating or thresholding rather than routing everything one-to-one.',
    ],
    solution:
      'Denied firewall connections are typically very high volume and mostly routine background noise, ' +
      'unlike failed logins, which are lower volume and more consistently worth a look. Routing both ' +
      'through the identical one-to-one enrichment and notification pipeline floods the channel with ' +
      'mostly uninteresting alerts, which leads directly to alert fatigue: once an analyst learns most ' +
      'notifications here are noise, they start under-reacting to all of them, including the rare one that ' +
      'actually matters. The fix is aggregating or thresholding the high-volume source instead of treating ' +
      'every event the same way.',
    expectedOutput: 'An answer naming the volume and signal mismatch, alert fatigue as the consequence, and aggregation/thresholding as the fix.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['volume', 'noise', 'routine', 'mismatch', 'signal'],
          ['fatigue', 'aggregat', 'threshold', 'flood'],
        ],
        hint: 'Name the volume/signal mismatch between the two event types, and connect it to alert fatigue as the concrete consequence.',
      },
    ],
    debrief:
      'This is the alert-fatigue lesson from Incident Detection and Alert Triage, one step further ' +
      'upstream: it is not only about how an analyst triages a queue that is already flooded, it is about ' +
      'the pipeline design decisions that created the flood in the first place.',
    practice: [],
  },
];

// --- Module siem.4: normalising multiple sources ------------------------------

const MODULE_SIEM_4: Exercise[] = [
  {
    id: 'siem.4.1',
    moduleId: 'siem.4',
    packageId: 'siem-fundamentals',
    order: 1,
    title: 'One word, several different fields',
    kind: 'multiple-choice',
    goal: 'Recognise that "the user" is represented differently by every source, and why that matters.',
    prompt: 'Which of the following correctly describe how different log sources represent "who did this"? Select all that apply.',
    teach: {
      concept:
        'Imagine three witnesses describing the same person after an incident: one calls them "the guy in ' +
        'the blue jacket," another gives a badge number, and a third gives a full legal name. All three are ' +
        'answering the exact same underlying question, who was this, but none of their answers are written ' +
        'down in a way that a computer could automatically recognize as referring to the same person, just ' +
        'by comparing the text.\n\n' +
        'Log sources have exactly this problem with the idea of "the user who did this." A Windows Security ' +
        'event might record the acting user under a field called TargetUserName or SubjectUserName ' +
        'depending on exactly what kind of event it is. A Linux system\'s authentication log records a ' +
        'plain, bare username with no extra formatting. A cloud platform\'s identity logs might record a ' +
        'long structured identifier called a principal ARN, or an email address, or a service account name, ' +
        'depending entirely on which cloud provider it is. Every one of these is answering "who performed ' +
        'this action," but none of them agree on either the name of the field it is stored in or the format ' +
        'the value takes.\n\n' +
        'NORMALISATION is the deliberate work of mapping all of these different representations into one ' +
        'common field, so that a single search can actually mean "find everything this specific person ' +
        'did," no matter which of the many different log sources originally recorded it. Without that work, ' +
        'a security team is stuck manually cross-referencing witnesses who are all describing the same ' +
        'thing in incompatible language.',
    },
    options: [
      { id: 'a', label: 'A Windows Security event and a Linux auth.log line represent the acting user in different fields and formats.' },
      { id: 'b', label: 'Normalisation maps different sources\' representations of "who did this" into one common field.' },
      { id: 'c', label: 'Every log source already uses an identical field name and format for the user who performed an action, so no mapping is needed.' },
      { id: 'd', label: 'A cloud platform\'s identity logs may represent a user as a principal ARN or email rather than a plain username.' },
    ],
    hints: [
      'Three describe the real, messy variation across sources. One claims everything already agrees, which is the opposite of the problem this module solves.',
    ],
    solution:
      'A, B, and D. The variation across sources is real and is exactly what normalisation exists to fix. ' +
      'C is false, and believing it is what causes the query in the next exercise to silently miss things.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'Different sources genuinely disagree on the field name and format for the acting user, that disagreement is the whole problem.',
      },
    ],
    debrief:
      'Keep this variation in mind for a Wazuh deployment specifically: a Windows agent and a Linux agent ' +
      'reporting to the same manager are already, on day one, disagreeing about what field "user" lives in.',
    practice: [],
  },
  {
    id: 'siem.4.2',
    moduleId: 'siem.4',
    packageId: 'siem-fundamentals',
    order: 2,
    title: 'A query that silently misses things',
    kind: 'short-answer',
    goal: 'Explain why an unnormalised query fails quietly rather than loudly.',
    prompt:
      'An analyst searches an unnormalised SIEM for "events where user = jsmith" and gets far fewer ' +
      'results than expected. In two or three sentences, explain why this kind of miss is dangerous ' +
      'specifically because it fails silently.',
    teach: {
      concept:
        'A search that comes back with an error is at least honest about the fact that something went ' +
        'wrong. The dangerous version of a mistake is the one that looks completely normal, and that is ' +
        'exactly what happens when someone searches an unnormalised SIEM, see the previous exercise for ' +
        'what normalisation means and why sources disagree in the first place, for something like "events ' +
        'where user = jsmith."\n\n' +
        'That search does not throw any error at all. It simply returns fewer results than it should, ' +
        'because it only matches the sources whose raw field happens to be named exactly "user" and whose ' +
        'value happens to be formatted exactly as the plain text "jsmith." A source that stores the same ' +
        'real person as "DOMAIN\\jsmith," or as an email address, or under a completely different field ' +
        'name like TargetUserName instead of user, is silently left out of the results. It is not flagged ' +
        'as skipped or unsearched, it is simply absent, with nothing about the output suggesting anything ' +
        'is missing.\n\n' +
        'The analyst looking at the results sees a plausible-looking set of matches, has no signal that ' +
        'anything was excluded, and reasonably assumes the search was complete. They move on having ' +
        'actually missed real activity that was sitting in the platform the entire time, fully collected ' +
        'and stored, just never surfaced by that particular search. That is a genuinely more dangerous ' +
        'failure mode than an obvious error, precisely because nothing about the experience of running the ' +
        'search suggests that anything went wrong.',
    },
    hints: [
      'The query does not fail loudly, it returns a plausible-looking but incomplete result set.',
      'A good answer explains specifically why an incomplete-but-plausible result is more dangerous than an obvious error.',
    ],
    solution:
      'The query does not throw an error, it simply matches only the sources whose raw field happens to be ' +
      'named "user" and formatted exactly like "jsmith", silently excluding any source that stores the ' +
      'same person differently, as an email address, a domain-qualified name, or under a different field ' +
      'entirely. The analyst sees a plausible result set and has no signal that anything was excluded, so ' +
      'they reasonably assume it is complete and move on, having actually missed real activity that was ' +
      'sitting in the platform the entire time.',
    expectedOutput: 'An answer explaining that the query silently excludes non-matching field formats rather than erroring, producing a plausible but incomplete result.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['silent', 'no error', 'without warning', 'no signal'],
          ['incomplete', 'miss', 'excluded', 'different field', 'different format'],
        ],
        hint: 'Explain that the query fails silently, returning a plausible but incomplete result, rather than producing any error or warning.',
      },
    ],
    debrief:
      'This is worth demonstrating directly in a home lab write-up: showing the same person\'s activity ' +
      'recorded in two differently formatted sources, and a normalised field that successfully catches ' +
      'both, is a genuinely strong, concrete proof that you understand this module rather than just being ' +
      'able to describe it.',
    practice: [],
  },
  {
    id: 'siem.4.3',
    moduleId: 'siem.4',
    packageId: 'siem-fundamentals',
    order: 3,
    title: 'What a common schema actually buys you',
    kind: 'multiple-choice',
    goal: 'Name the concrete benefits of normalising toward a common field schema.',
    prompt: 'Which of the following are genuine benefits of adopting a common schema (mapping every source\'s fields to consistent names) rather than querying each source in its raw format? Select all that apply.',
    teach: {
      concept:
        'A SCHEMA, in this context, is just an agreed-upon set of field names and formats, the same idea as ' +
        'a shared form everyone fills out the same way instead of everyone describing the same information ' +
        'in their own words. A common schema means every log source\'s data gets mapped, during ingestion, ' +
        'into the same set of field names, so "user" always means the same thing and lives in the same ' +
        'place no matter which source originally recorded the event.\n\n' +
        'The direct payoff is that one query can search across every normalised source at once using those ' +
        'same consistent field names, instead of an analyst needing to separately learn and query each ' +
        'source\'s own raw, inconsistent format one at a time. It also makes detection RULES portable: a ' +
        'rule written to check the common "user" field works correctly against every normalised source, ' +
        'rather than needing a completely separate, hand-written version of the same rule for every single ' +
        'log source it needs to cover. And it means that adding a brand new log source, or switching to a ' +
        'different SIEM vendor entirely, does not require rewriting every query and rule that already ' +
        'exists. It only requires writing one new mapping, translating that new source\'s own field names ' +
        'into the shared schema everything else already speaks.',
    },
    options: [
      { id: 'a', label: 'A single query can search across every normalised source at once, using consistent field names.' },
      { id: 'b', label: 'Detection rules become portable across sources, rather than needing a separate version per source\'s raw format.' },
      { id: 'c', label: 'Adding a new log source or switching platforms requires rewriting every existing query and rule from scratch.' },
      { id: 'd', label: 'Normalisation reduces how much source-specific field knowledge an analyst has to memorise to search effectively.' },
    ],
    hints: [
      'Three describe genuine benefits of a common schema. One claims normalisation makes change harder, which is backwards.',
    ],
    solution:
      'A, B, and D. A common schema is exactly what makes queries, rules, and analyst knowledge portable ' +
      'across sources. C has it backwards: normalisation is what lets you add a new source by writing one ' +
      'mapping, rather than rewriting everything that already exists.',
    expectedOutput: 'Options A, B, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'd'],
        hint: 'Normalisation makes adding a new source or rule easier, not harder, since only a new mapping is needed rather than rewriting everything.',
      },
    ],
    debrief:
      'This is the same idea Detection Engineering builds a whole module around: a rule is only as ' +
      'portable as the fields it is written against, and a common schema is what makes that portability ' +
      'possible in the first place.',
    practice: [],
  },
  {
    id: 'siem.4.4',
    moduleId: 'siem.4',
    packageId: 'siem-fundamentals',
    order: 4,
    title: 'Timestamps lie too, if you let them',
    kind: 'multiple-choice',
    goal: 'Extend the normalisation lesson to timestamps, where the pitfall is timezone rather than field naming.',
    prompt: 'Which of the following correctly describe the timestamp-normalisation pitfall across multiple log sources? Select all that apply.',
    teach: {
      concept:
        'A timestamp is supposed to answer a simple question, when did this happen, but that answer is ' +
        'only meaningful once you also know which clock it is being measured against, the same way "4 ' +
        'o\'clock" means something different in New York than it does in London at that same actual moment. ' +
        'A host logging events in its own local timezone and another host logging in UTC, a single, ' +
        'globally shared reference time that does not shift with location, can each look perfectly ' +
        'consistent on their own, every timestamp in each source lines up logically within itself, while ' +
        'the two sources actually disagree with each other by several hours.\n\n' +
        'If someone builds a timeline by simply lining up the raw timestamps from both sources side by ' +
        'side, that timeline will be wrong, and it will be wrong in a way that is not obvious just from ' +
        'looking at it, because nothing about a timestamp that says "14:32" signals which clock it came ' +
        'from. This matters most exactly when it matters most: reconstructing the ORDER events happened ' +
        'across multiple machines during a real investigation, where getting the sequence wrong can change ' +
        'the entire story of what an attacker actually did first, second, and third.\n\n' +
        'The standard fix is normalising every source to a single timezone, almost always UTC, at the ' +
        'moment data is ingested into the SIEM, so that every timestamp stored in the platform means the ' +
        'exact same instant in time by construction, and a timeline built from them can actually be trusted ' +
        'to reflect the real order things happened in.',
    },
    options: [
      { id: 'a', label: 'Two hosts logging in different local timezones can each look internally consistent while disagreeing with each other by hours.' },
      { id: 'b', label: 'A timeline built from raw, unnormalised timestamps can silently misorder events across multiple hosts.' },
      { id: 'c', label: 'Normalising every source to a single timezone, typically UTC, at ingestion is the standard fix.' },
      { id: 'd', label: 'Timezone differences only matter for compliance reporting, not for reconstructing what actually happened during an incident.' },
    ],
    hints: [
      'Three describe the real risk and the standard fix. One dismisses the consequence as merely a reporting concern, which understates it badly.',
    ],
    solution:
      'A, B, and C. The risk is specifically to event ordering during an investigation, which is exactly ' +
      'when getting it wrong matters most, and UTC normalisation at ingestion is the standard fix. D badly ' +
      'understates the stakes: a misordered timeline can change the entire narrative of an incident, not ' +
      'just a compliance report.',
    expectedOutput: 'Options A, B, and C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c'],
        hint: 'Timezone drift threatens event ordering during an actual investigation, not just compliance reporting, which is a much higher-stakes consequence.',
      },
    ],
    debrief:
      'This closes the loop on the whole package: coverage decides what you can see, indexing decides what ' +
      'you keep, the pipeline decides how an alert gets handled once it fires, and normalisation, including ' +
      'timestamps, decides whether any of it can actually be trusted to mean what it appears to say.',
    practice: [],
  },
];

// --- the package -------------------------------------------------------------

export const SIEM_FUNDAMENTALS: LearningPackage = {
  id: 'siem-fundamentals',
  order: 23,
  title: 'SIEM Fundamentals',
  summary:
    'Deploy the judgement behind a real SIEM build: what an agent actually sees, what is worth the cost ' +
    'of indexing, the shape of a sane alert-to-automation pipeline, and why sources that disagree about ' +
    'what a field is called will quietly break your queries.',
  outcomes: [
    'Interpret agent coverage and connection status honestly, rather than assuming a deployed platform means full visibility',
    'Weigh the cost of indexing against the signal a source actually carries, and use storage tiers correctly',
    'Design an alert pipeline that enriches consistently and treats response automation as a higher bar than enrichment',
    'Explain why normalising fields and timestamps across sources is necessary before a query or a timeline can be trusted',
  ],
  prerequisites: ['linux-fundamentals'],
  modules: [
    {
      id: 'siem.1',
      packageId: 'siem-fundamentals',
      order: 1,
      title: 'Agents and Endpoint Coverage',
      summary: 'What an agent actually forwards, reading fleet status honestly, and why a deployed SIEM is not the same as full visibility.',
      exercises: MODULE_SIEM_1,
    },
    {
      id: 'siem.2',
      packageId: 'siem-fundamentals',
      order: 2,
      title: 'What Is Worth Indexing',
      summary: 'The real cost of ingestion, hot versus cold storage, and which sources carry the most detection signal.',
      exercises: MODULE_SIEM_2,
    },
    {
      id: 'siem.3',
      packageId: 'siem-fundamentals',
      order: 3,
      title: 'Alert Pipelines and Automation',
      summary: 'The SIEM-to-automation-to-notification shape, what enrichment does and does not replace, and why response automation needs a higher bar.',
      exercises: MODULE_SIEM_3,
    },
    {
      id: 'siem.4',
      packageId: 'siem-fundamentals',
      order: 4,
      title: 'Normalising Multiple Sources',
      summary: 'Why "user" means something different per source, what silently breaks an unnormalised query, and timestamp normalisation.',
      exercises: MODULE_SIEM_4,
    },
  ],
};
