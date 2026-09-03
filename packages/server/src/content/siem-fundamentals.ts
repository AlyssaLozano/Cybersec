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
        'An agent is not a wiretap on the entire operating system, it forwards what it is CONFIGURED to ' +
        'collect: authentication events, file integrity changes on watched paths, process execution, and ' +
        'whatever log sources it has been pointed at. Nothing outside that configuration reaches the ' +
        'platform at all, which means "we have an agent on this host" is not the same claim as "we can ' +
        'see everything that happens on this host". A host with an agent installed but a narrow ruleset ' +
        'can still have enormous blind spots, and assuming otherwise is one of the most common false ' +
        'senses of security in monitoring work.',
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
      'was configured to watch is far more credible than an unqualified "I have full visibility into the ' +
      'endpoint".',
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
        'ACTIVE means the agent is currently checking in and reporting normally. DISCONNECTED means it ' +
        'was successfully enrolled and reporting at some point, but has stopped checking in, which could ' +
        'mean the host is simply powered off, or could mean the agent crashed, was disabled, or (in the ' +
        'worst case) was deliberately killed by whatever compromised the host, since a common step for an ' +
        'attacker is disabling the thing that would report them. PENDING means enrollment has started but ' +
        'the agent has not completed its first check-in yet. NEVER CONNECTED means the agent was ' +
        'registered on the platform but has never actually connected at all, often because installation ' +
        'never finished or firewall rules block the connection.',
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
      'check before assuming it means nothing.',
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
        'The comfortable assumption, "probably just off for the night", might be right, but it is a ' +
        'guess until it is checked. A real check starts with comparing the six against an ASSET INVENTORY ' +
        'to see what kind of host each one actually is, a laptop that is normally off overnight looks very ' +
        'different from a server that should never go down. It continues with the LAST-SEEN timestamp: an ' +
        'agent that dropped ten minutes ago behaves differently from one that has been silent for three ' +
        'weeks. And it means checking whether the disconnection CORRELATES with anything else, an alert ' +
        'that fired moments before it went dark, a change ticket that explains a planned reboot, or ' +
        'nothing at all, which is itself informative. Skipping straight to "probably fine" is exactly the ' +
        'blind spot an attacker who disables their own agent is counting on.',
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
      'This is the same discipline from net.4.5 in Networking Basics, confirming an absence rather than ' +
      'assuming it, applied to a fleet dashboard instead of a single host\'s listener table.',
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
        'A SIEM platform existing tells you nothing about what it can actually see, that depends entirely ' +
        'on which hosts have an agent, which log sources those agents forward, and whether the agents are ' +
        'actually online. A host with no agent at all generates zero alerts no matter what happens on it, ' +
        'not because nothing happened, but because nobody was watching. This is why "coverage" (what ' +
        'percentage of the estate is actually monitored, and how completely) is one of the first questions ' +
        'a real SOC has to be able to answer honestly, and it is a genuinely different question from ' +
        '"do we own a SIEM license".',
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
      'actually covered.',
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
        'SIEM platforms commonly price on volume, events per second or gigabytes per day, so indexing ' +
        'everything is a direct cost, not a free safety margin. It also has a performance cost: a search ' +
        'across a much larger index is slower, which matters during an actual incident when speed is the ' +
        'thing you need most. Neither of those means low-value data should be discarded outright, there ' +
        'are cheaper tiers for that, but "just index everything to be safe" treats a real budget and ' +
        'performance tradeoff as if it did not exist.',
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
      'rarely the number that matters, the number that matters is the one you can actually act on.',
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
        'Denied traffic is, event for event, far more likely to represent something worth investigating: ' +
        'a scan, a probe, a misconfigured or compromised host trying somewhere it should not, and there is ' +
        'vastly less of it. Allowed traffic is mostly the network doing exactly what it is supposed to do, ' +
        'all day, and at 50GB a day indexing it in full is expensive for a comparatively low density of ' +
        'signal. The honest answer is not "throw the allowed logs away", they still have real value for ' +
        'retrospective investigation and compliance, it is that they belong in a cheaper, cold or archive ' +
        'tier that can be searched or rehydrated when needed, while the denied logs, small and high-signal, ' +
        'earn their place in the expensive hot tier.',
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
      'This exact tradeoff, small and high-signal versus large and low-signal, is why hot and cold storage ' +
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
        'A HOT tier is fully indexed and fast to search, which is what you want for the sources you query ' +
        'often or need instantly during an active investigation, and it is the most expensive place to ' +
        'keep data. A COLD or ARCHIVE tier stores the same data far more cheaply, usually compressed and ' +
        'not fully indexed, trading search speed for cost, and it typically has to be REHYDRATED, loaded ' +
        'back into a searchable form, before it can be queried directly. Moving a source to cold storage is ' +
        'a decision about how fast you need to search it, not a decision to stop keeping it at all.',
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
      'This distinction matters for compliance conversations specifically: "we do not index that source" ' +
      'and "we do not retain that source at all" are very different statements, and mixing them up in an ' +
      'audit is a genuinely bad moment.',
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
        'A source is high value for DETECTION when it frequently carries the specific signal a security ' +
        'analyst is actually looking for: authentication events (who is logging in, from where, and ' +
        'whether it succeeded), process creation (what actually ran, and by whom), and DNS queries (what a ' +
        'host is trying to reach, often before a connection even completes) are classic examples, because ' +
        'a huge share of real detections trace back to one of those three. A source can be voluminous and ' +
        'still be low marginal value for detection if it mostly duplicates signal you already get more ' +
        'cheaply from another source you already collect.',
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
      'well-configured endpoint agent forwards from module siem.1. Coverage and indexing priority are the ' +
      'same underlying judgement, applied at two different points in the pipeline.',
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
        'The pipeline this pattern describes, and the one a Wazuh-to-n8n project builds directly, is: a ' +
        'rule fires in the SIEM, the alert is sent (often via a webhook) to an automation platform, the ' +
        'automation platform runs ENRICHMENT steps, adding threat intelligence context, WHOIS data, or ' +
        'asset criticality before a human ever looks at it, and only then does a notification or a ticket ' +
        'get created. The value of the automation layer is doing the boring, repeatable lookups every ' +
        'time, consistently, so the analyst who eventually sees the alert opens it with context already ' +
        'attached instead of starting every investigation from a bare IP address.',
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
      'a commonly recommended first project.',
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
        'A direct email pipeline has no room for any of the steps that make an alert genuinely usable ' +
        'before a human sees it. An automation layer can FILTER and DEDUPLICATE, so ten instances of the ' +
        'same underlying issue become one notification instead of ten emails. It can ENRICH consistently, ' +
        'running the same threat intelligence and asset lookups every single time rather than depending on ' +
        'the analyst to remember to do it. And it can take CONSISTENT TRIAGE ACTIONS, such as automatically ' +
        'closing a known-benign pattern, before it ever reaches a person at all. None of that is possible ' +
        'if the SIEM is just emailing straight through.',
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
      'The deduplication point is worth remembering specifically. Alert fatigue, the thing Alert Triage at ' +
      'Volume is built around, is very often a filtering and consolidation problem before it is ever a ' +
      'triage-skill problem.',
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
        'Enrichment is context, not a verdict: a threat intelligence lookup on an IP that shows it has ' +
        'been seen in prior malicious activity, or a WHOIS lookup showing who registered a domain, or an ' +
        'asset criticality lookup showing this host is a production database rather than a test box, all ' +
        'make the alert easier and faster to triage. None of them decide whether the alert is a real ' +
        'incident, that judgement still belongs to a human (or, in a triage exercise, to you), because ' +
        'context can be misleading, a clean reputation does not prove something is benign, and a bad ' +
        'reputation does not prove something is malicious in this specific case.',
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
      'that adds context is genuinely valuable, and trusting its output without judgement is exactly the ' +
      'failure mode those exercises are built to catch.',
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
        'Enrichment is safe to fully automate because it only adds information, it cannot itself cause ' +
        'harm if it is wrong. A RESPONSE action, isolating a host, disabling an account, blocking an ' +
        'address, is different in kind: acting on a false positive has a real, immediate cost, a legitimate ' +
        'server taken offline, a real user locked out, and that cost is paid instantly and automatically ' +
        'with no chance for a human to catch the mistake first. That does not mean automated response is ' +
        'always wrong, it means it needs a much higher confidence threshold on the triggering rule, and is ' +
        'usually rolled out in stages, starting with alerting-only, before any action is trusted to run ' +
        'unattended.',
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
      'automated and response actions deliberately left as a human decision, with the reasoning stated, is ' +
      'a stronger portfolio artefact than full auto-remediation with no explanation of the risk.',
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
        'Denied firewall connections are, in most environments, extremely high volume and mostly routine, ' +
        'background internet scanning noise hitting a closed port, automated bots, and the occasional ' +
        'harmless misconfiguration, and treating every single one identically to a failed login (a much ' +
        'lower-volume, higher-signal event type) means the notification channel gets flooded with mostly ' +
        'uninteresting alerts. That is a direct path to alert fatigue: once an analyst learns that most ' +
        'notifications from this pipeline are noise, they start under-reacting to all of them, including ' +
        'the rare one that matters. The fix is treating different event types differently, aggregating or ' +
        'thresholding the high-volume, low-signal source instead of routing it one-to-one through the same ' +
        'path as genuinely high-signal events.',
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
      'This is the alert-fatigue lesson from Incident Detection and Alert Triage, one step upstream: it is ' +
      'not only about how an analyst triages a flooded queue, it is about pipeline design decisions that ' +
      'created the flood in the first place.',
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
        'A Windows Security event might carry TargetUserName or SubjectUserName depending on the event ' +
        'type, a Linux auth.log line carries a bare username, and a cloud platform\'s IAM logs might carry ' +
        'a principal ARN, an email address, or a service account identifier depending on the provider. All ' +
        'of them are answering the same underlying question, who performed this action, but none of them ' +
        'agree on the field name or even the format of the value. NORMALISATION is the deliberate work of ' +
        'mapping all of those into one common field so a single search can actually mean "find everything ' +
        'this person did", regardless of which source recorded it.',
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
        'The query does not error, it just returns fewer results than it should, because it only matches ' +
        'the sources whose raw field happens to be named exactly "user" and formatted exactly as "jsmith". ' +
        'A source that stores the same person as "DOMAIN\\jsmith", or as an email address, or under a ' +
        'field called TargetUserName instead of user, is silently excluded, not flagged as unsearched. The ' +
        'analyst sees a result set, assumes it is complete because nothing signalled otherwise, and moves ' +
        'on having missed activity that was sitting in the platform the whole time. That is a much more ' +
        'dangerous failure mode than an obvious error, because nothing about the experience suggests ' +
        'anything is wrong.',
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
      'This is worth demonstrating directly in a home lab write-up: showing the same person\'s activity in ' +
      'two differently-formatted sources, and a normalised field that catches both, is a genuinely strong, ' +
      'concrete proof of understanding this module.',
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
        'A common schema means one query can search across every source at once using the same field ' +
        'names, rather than an analyst needing to know and separately query each source\'s own raw format. ' +
        'It also makes detection RULES portable: a rule written against the common "user" field works ' +
        'against every normalised source rather than needing a separate version per source. And it means ' +
        'switching or adding a SIEM vendor, or a new log source, does not require rewriting every existing ' +
        'query and rule, only writing a new mapping from the new source into the schema everything else ' +
        'already uses.',
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
        'A host logging in its local timezone and another logging in UTC can each look internally ' +
        'consistent while disagreeing with each other by several hours, and a timeline built by simply ' +
        'lining up their raw timestamps side by side will be wrong in a way that is not obvious just from ' +
        'looking at it. This matters most exactly when it is needed most: reconstructing the ORDER events ' +
        'happened across multiple hosts during an investigation, where getting the sequence wrong can ' +
        'change the entire story of what happened first. The standard fix is normalising every source to a ' +
        'single timezone, almost always UTC, at ingestion, so every timestamp in the platform means the ' +
        'same instant in time by construction.',
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
      'you keep, the pipeline decides how an alert gets handled, and normalisation, including timestamps, ' +
      'decides whether any of it can be trusted to mean what it appears to say.',
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
