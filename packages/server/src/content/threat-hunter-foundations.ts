/**
 * Threat Hunter Foundations: the one seat that goes looking.
 *
 * WHY THIS PACKAGE EXISTS, AND WHY IT IS NOT REGISTERED YET
 *
 * Every other SOC role in this platform is reactive: something triggers it. The
 * operator waits for an alert, the incident lead works a declared incident,
 * forensics is handed a host, the vulnerability analyst chases a scan finding.
 * The threat hunter is the exception, and the difference is a whole mindset, so
 * it earns its own foundation before the drills.
 *
 * This file is authored standalone and deliberately NOT added to PACKAGES in
 * content/index.ts, because a second session is building role pathways into that
 * same array at the same time, and two packages sharing an id would fail the
 * catalogue validator at boot. Register it in one coordinated pass: import it in
 * content/index.ts, add it to PACKAGES, then run `npm run typecheck && npm test`.
 * The `order` below is a placeholder; set it when it is registered.
 *
 * No apostrophes in the content strings: the house style forbids em dashes and a
 * sweep over smart quotes has broken answer keys before, so the copy is written
 * to avoid the whole hazard.
 */

import type { Exercise, LearningPackage } from '@soc/shared';

const HUNT_TEACH = {
  concept:
    'Threat hunting is the one job on the floor that does not wait to be told. Instead of working ' +
    'an alert, a hunter forms a hypothesis about how an attacker might be operating, and goes ' +
    'looking in the raw telemetry for the evidence, before and without any alert firing. It exists ' +
    'because the tooling only catches what somebody already taught it to catch, and a capable ' +
    'intruder spends real effort staying under exactly those thresholds.',
} as const;

const MINDSET_TEACH = {
  concept:
    'Two habits define the hunter. The first is assume breach: work as though an adversary is ' +
    'already inside and simply has not been flagged, rather than treating the network as clean ' +
    'until an alert says otherwise. The second is a testable hypothesis: not a feeling that ' +
    'something is wrong, but a specific claim of the form if an attacker did X, then the data would ' +
    'show Y, which you can then go and check against real logs. A hunt that cannot be tested against ' +
    'data is a worry, not a hunt.',
} as const;

const RELATE_TEACH = {
  concept:
    'A hunter sits between the reactive floor and the engineers. Against the SOC operator: the ' +
    'operator triages what the tools raise; the hunter searches for what the tools missed, ' +
    'self-directed, with nothing telling them to look. Against the detection engineer: the two are ' +
    'a loop. The hunter finds a gap by hand; a successful hunt hands its finding to the detection ' +
    'engineer, who turns it into a rule so the next occurrence is caught automatically. Finding it ' +
    'once is the hunt; making sure it is never missed again is engineering.',
} as const;

// --- Module th.2: building a testable hypothesis ----------------------------

const HYP_SHAPE_TEACH = {
  concept:
    'A hunt hypothesis is a claim with three properties, and a sentence missing any one of them is ' +
    'not ready to hunt on yet.\n\n' +
    'STRUCTURE: it takes the shape if an attacker did X, the data would show Y. X names a specific ' +
    'technique or behaviour, not a category of concern, and Y names the evidence that behaviour ' +
    'would leave in telemetry the hunter actually holds. FALSIFIABILITY: it must be possible for ' +
    'the hunt to end with nothing, and the hunter has to accept that as a real outcome rather than ' +
    'evidence they looked in the wrong place. A claim that reinterprets every possible result as ' +
    'confirmation is not a hypothesis, it is a belief. SCOPE: it commits up front to a bounded ' +
    'population of hosts or accounts, a named data source, and a time window, because a hunt with ' +
    'no boundary never finishes and never fails, which sounds safe and is actually useless.\n\n' +
    'Most of the skill in hunting lives here, before a single query is written. A tight hypothesis ' +
    'turns a vague unease into work that can be planned, timeboxed, and handed to somebody else to ' +
    'run if the original hunter gets pulled onto something else.',
} as const;

const MODULE_TH_2: Exercise[] = [
  {
    id: 'th.2.1',
    moduleId: 'th.2',
    packageId: 'threat-hunter-foundations',
    order: 1,
    title: 'What a workable hypothesis has',
    kind: 'multiple-choice',
    goal: 'Recognise the three properties that make a hypothesis ready to hunt on.',
    prompt: 'Which of the following are true of a workable hunt hypothesis? Select all that apply.',
    teach: HYP_SHAPE_TEACH,
    options: [
      { id: 'a', label: 'It names a specific technique or behaviour rather than a general worry.' },
      { id: 'b', label: 'It states the evidence that would appear if it were true, in data the hunter could actually query.' },
      { id: 'c', label: 'It could turn out to be unsupported, and that counts as the hunt working correctly.' },
      { id: 'd', label: 'It is scoped up front to a bounded population of hosts or accounts, a data source, and a time window.' },
      { id: 'e', label: 'It is stronger the more of the environment it covers at once, since a narrow hunt wastes the effort of writing one.' },
    ],
    hints: [
      'Four are the properties this module names. One argues that bigger is always better.',
      'A hypothesis that covers everything at once cannot be investigated by anyone in a working day.',
      'Ask whether each statement describes structure, falsifiability, or scope, or whether it argues against having any of them.',
    ],
    solution:
      'A, B, C, and D. A named technique, stated evidence, an accepted possibility of a null result, ' +
      'and an upfront boundary are the four things a workable hypothesis has. E is backwards: a ' +
      'hypothesis that tries to cover the whole environment at once cannot be investigated in any ' +
      'bounded time, and by the time it is broken down into pieces small enough to run, each piece ' +
      'is exactly the narrow hypothesis E was arguing against.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a hypothesis that covers as much as possible as the stronger one.',
      },
    ],
    debrief:
      'Keep these three words nearby while you write your first hypotheses: structure, falsifiable, ' +
      'scoped. A claim missing any one of them is a worry wearing the costume of a hunt.',
    practice: [],
  },
  {
    id: 'th.2.2',
    moduleId: 'th.2',
    packageId: 'threat-hunter-foundations',
    order: 2,
    title: 'A hypothesis that cannot fail',
    kind: 'multiple-choice',
    goal: 'Diagnose exactly what is wrong with an untestable hypothesis.',
    prompt:
      'A colleague proposes: "Attackers may be using living-off-the-land techniques somewhere in ' +
      'our environment." Which of the following are true about this hypothesis? Select all that ' +
      'apply.',
    teach: HYP_SHAPE_TEACH,
    options: [
      { id: 'a', label: 'It cannot really be disproven, because almost any admin tool usage can be read as supporting it.' },
      { id: 'b', label: 'It does not say which data source would show the evidence.' },
      { id: 'c', label: 'It does not bound which hosts or which window it applies to.' },
      { id: 'd', label: 'Narrowing it to one technique, such as PsExec launched from an account that has never used it before, would make it testable.' },
      { id: 'e', label: 'It is fine as written, because living-off-the-land is a real and current category of technique.' },
    ],
    hints: [
      'Four are the actual diagnosis. One excuses the vagueness because the underlying concern is real.',
      'A category of concern being real does not make a specific sentence about it testable.',
      'Ask what query you would actually run against this hypothesis as written. If there is not one, that is the finding.',
    ],
    solution:
      'A, B, C, and D. The hypothesis fails on all three properties from this module: it has no ' +
      'falsifiable claim, since almost any admin tool use fits it; no named evidence source; and no ' +
      'scope. D shows the fix, which is narrowing to one technique with a named data source. E ' +
      'confuses the reality of the underlying concern with the testability of this particular ' +
      'sentence. Living-off-the-land is a genuine and important category, and this sentence is still ' +
      'not a hypothesis.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats the sentence as fine because the topic it gestures at is real.',
      },
    ],
    debrief:
      'This is the single most common failure mode in a new hunt programme: hypotheses that name a ' +
      'real threat category and nothing else. Naming the category is the easy half.',
    practice: [],
  },
  {
    id: 'th.2.3',
    moduleId: 'th.2',
    packageId: 'threat-hunter-foundations',
    order: 3,
    title: 'Scoping decisions that make a hunt runnable',
    kind: 'multiple-choice',
    goal: 'Turn scope from an afterthought into a decision made before the hunt starts.',
    prompt:
      'You are about to start a hunt. Which of the following are genuine scoping decisions to make ' +
      'before writing the first query? Select all that apply.',
    teach: {
      concept:
        'Scope is not a formality, it is the thing that turns an open-ended search into a piece of ' +
        'work with an end.\n\n' +
        'Four decisions belong here. THE TIME WINDOW: how far back the hunt looks, chosen for a ' +
        'reason, such as matching a suspected dwell time or the retention of the data source ' +
        'involved. THE POPULATION: which hosts, accounts, or business unit the hunt covers, rather ' +
        'than the whole estate by default. THE DATA SOURCE: which telemetry will actually be ' +
        'queried, named specifically enough that somebody else could run the same hunt. And WHAT IS ' +
        'EXPLICITLY OUT OF SCOPE: naming what this hunt will not check, so a null result is not later ' +
        'read as clearing ground it never touched.\n\n' +
        'The wrong instinct is to maximise coverage on the theory that more is safer. A hunt scoped ' +
        'to everything is a hunt nobody can finish, and an unfinished hunt teaches nothing.',
    },
    options: [
      { id: 'a', label: 'A time window chosen for a reason, such as a suspected dwell time or a data retention limit.' },
      { id: 'b', label: 'A named population: which hosts, accounts, or business unit the hunt actually covers.' },
      { id: 'c', label: 'The specific data source that will be queried, named precisely enough for somebody else to repeat it.' },
      { id: 'd', label: 'An explicit statement of what the hunt will not check, so a clean result is not overread later.' },
      { id: 'e', label: 'As broad a scope as the tooling can technically reach, so nothing is accidentally missed.' },
    ],
    hints: [
      'Four are decisions with a reason behind them. One replaces a decision with maximum coverage.',
      'A hunt that covers everything the tooling can reach is a hunt with no scope at all.',
      'What would you need written down for a colleague to repeat this exact hunt next quarter?',
    ],
    solution:
      'A, B, C, and D. A reasoned window, a named population, a specific data source, and an ' +
      'explicit exclusion are what makes a hunt something a person could actually finish and hand ' +
      'off. E restates the temptation this module warns against: reaching for maximum coverage is ' +
      'not a scoping decision, it is the absence of one, and it produces a hunt that either never ' +
      'completes or completes so shallowly that its result means nothing.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats maximum technical reach as a substitute for choosing a scope.',
      },
    ],
    debrief:
      'Write the scope down before the hypothesis, not after. A hunt that drifts wider as it goes is ' +
      'a hunt with no stopping point, and stopping points are what let a hunter run more than one.',
    practice: [],
  },
  {
    id: 'th.2.4',
    moduleId: 'th.2',
    packageId: 'threat-hunter-foundations',
    order: 4,
    title: 'Pick the testable one',
    kind: 'multiple-choice',
    goal: 'Apply the three properties to choose the one hunt-ready hypothesis among four candidates.',
    prompt:
      'A phishing report says a crew is delivering a macro-enabled document that spawns a living ' +
      'shell. Which of these hypotheses is actually ready to hunt on?',
    teach: HYP_SHAPE_TEACH,
    options: [
      { id: 'a', label: 'Phishing is probably getting through our filters somehow and we should look into it.' },
      { id: 'b', label: 'If this crew is active here, Office applications on user workstations, in the last 30 days, would show a child process of PowerShell or cmd that Office does not normally spawn.' },
      { id: 'c', label: 'Users are our weakest link and macros should really be disabled everywhere.' },
      { id: 'd', label: 'Something bad might have come in through email recently.' },
    ],
    hints: [
      'Three of these are opinions about the problem. One is a claim you could run against process telemetry this afternoon.',
      'Look for the named technique, the named evidence, and the named scope together in one sentence.',
      'Which option tells you which process, on which machines, over what window?',
    ],
    solution:
      'B. It names the technique (a macro spawning a living shell), the evidence (an unusual Office ' +
      'child process), the population (user workstations), and the window (30 days). A and D are ' +
      'real concerns with nothing to query. C is a policy opinion, and a defensible one, but it is ' +
      'not something you go and look for in the data.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'Which option names a process relationship you could actually search for?',
      },
    ],
    debrief:
      'Notice that B came directly from the intel line. Turning a report into a hypothesis is mostly ' +
      'a translation exercise once you know the shape to translate it into.',
    practice: [],
  },
  {
    id: 'th.2.5',
    moduleId: 'th.2',
    packageId: 'threat-hunter-foundations',
    order: 5,
    title: 'Write one from an intel line',
    kind: 'short-answer',
    goal: 'Produce a hunt-ready hypothesis from a raw piece of reporting.',
    prompt:
      'An advisory states: "The actor persists on finance-sector workstations using a signed but ' +
      'abused remote-management tool it did not previously have installed." In two or three ' +
      'sentences, write a testable hunt hypothesis from this.',
    teach: HYP_SHAPE_TEACH,
    hints: [
      'Name the specific behaviour: a remote-management tool appearing where it was not before.',
      'Say what evidence that would leave, and where you would look for it.',
      'Bound it: which machines, which window, and what would count as the tool "not previously installed".',
    ],
    solution:
      'If this actor is active against our finance workstations, at least one of those machines ' +
      'would show a remote-management tool being installed within the last 60 days on a host that ' +
      'has no record of it before, visible in software inventory or process-creation logs for that ' +
      'population. I would scope the hunt to finance-department endpoints only, and treat a clean ' +
      'result as meaning no such installation occurred in that window on those hosts, not that the ' +
      'actor is absent everywhere.',
    expectedOutput:
      'A hypothesis naming the remote-management tool appearing newly on finance workstations, the ' +
      'evidence source such as inventory or process logs, and a bounded population and window.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['remote management', 'rmm', 'tool', 'newly installed', 'not previously', 'appear'],
          ['inventory', 'process', 'log', 'evidence', 'would show', 'telemetry'],
          ['finance', 'workstation', 'window', 'days', 'scope', 'bounded'],
        ],
        hint:
          'Three ideas: the specific tool behaviour, the evidence source it would show up in, and ' +
          'the bounded population and window.',
      },
    ],
    debrief:
      'This is the whole job in miniature: a report becomes a claim, a claim names its evidence, and ' +
      'the claim is bounded enough to actually run. Everything after this exercise is investigating ' +
      'hypotheses shaped like the one you just wrote.',
    practice: [],
  },
];

// --- Module th.3: where a hypothesis comes from ------------------------------

const SOURCES_TEACH = {
  concept:
    'A hypothesis has to start somewhere, and in practice it starts from one of four springboards.\n\n' +
    'INTEL-DRIVEN: a report or advisory describes a technique relevant to your sector or your ' +
    'software, and the hunt asks whether that technique has already been used here. GAP-DRIVEN: a ' +
    'coverage map, most often built against the ATT&CK matrix, shows a technique your detections do ' +
    'not cover, and the hunt asks whether the absence has been exploited rather than merely noting ' +
    'the absence. ANOMALY-DRIVEN: exploring the data itself for its own sake surfaces something odd, ' +
    'such as a rare parent-child process pair or a host talking to a peer it never talks to, and the ' +
    'hunt follows that oddity to see what it is. TIP-DRIVEN: a colleague or an operator on the floor ' +
    'has a hunch, built from experience that has not yet been put into words.\n\n' +
    'None of the four outranks the others, and a mature programme draws from all of them. What ' +
    'distinguishes a good instance of any of them from a weak one is not the source, it is whether ' +
    'the lead is specific enough, current enough, and relevant enough to your own environment to ' +
    'turn into the kind of hypothesis the last module described.',
} as const;

const MODULE_TH_3: Exercise[] = [
  {
    id: 'th.3.1',
    moduleId: 'th.3',
    packageId: 'threat-hunter-foundations',
    order: 1,
    title: 'The four springboards',
    kind: 'multiple-choice',
    goal: 'Name the four legitimate ways a hunt gets started.',
    prompt: 'Which of the following correctly describe a source of hunt hypotheses? Select all that apply.',
    teach: SOURCES_TEACH,
    options: [
      { id: 'a', label: 'Intel-driven: a report describes a technique, and the hunt asks whether it has already happened here.' },
      { id: 'b', label: 'Gap-driven: a coverage map shows a technique with no detection, and the hunt checks whether the gap has been exploited.' },
      { id: 'c', label: 'Anomaly-driven: exploring the data surfaces something odd, and the hunt follows it to find out what it is.' },
      { id: 'd', label: 'Tip-driven: a colleague or an operator has a hunch built from experience not yet written down.' },
      { id: 'e', label: 'Only intel-driven hunts count as real hunting, because the others have no external source to validate them.' },
    ],
    hints: [
      'Four of these are the springboards this module names. One disqualifies three of them.',
      'A hunt does not need an external report to be legitimate; it needs a testable claim.',
      'What would rule out a hunch or an anomaly as a valid starting point?',
    ],
    solution:
      'A, B, C, and D. Intel, gaps, anomalies, and tips are all genuine starting points, and a mature ' +
      'programme draws on all four. E is the mistake to avoid: an external report is one way to get ' +
      'a lead, not the only legitimate one, and dismissing a colleague hunch or a data anomaly as ' +
      'unworthy of a hunt throws away most of what an experienced floor actually notices.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats only external reporting as a legitimate source.',
      },
    ],
    debrief:
      'Keep a running list of leads from all four springboards. A hunt programme that only ever runs ' +
      'intel-driven hunts is reading somebody else homework and missing what is specific to its own ' +
      'environment.',
    practice: [],
  },
  {
    id: 'th.3.2',
    moduleId: 'th.3',
    packageId: 'threat-hunter-foundations',
    order: 2,
    title: 'Judging a lead before you commit a day to it',
    kind: 'multiple-choice',
    goal: 'Screen a candidate lead for whether it is worth turning into a hypothesis.',
    prompt:
      'You have a stack of candidate leads and a day to spend. Which of the following are sound ' +
      'ways to judge which one is worth that day? Select all that apply.',
    teach: {
      concept:
        'A lead is not a hypothesis yet, and most leads never should become one. Screening them is ' +
        'a cheap step that saves an expensive one.\n\n' +
        'Three questions do most of the work. RELEVANCE: does the technique even apply to software ' +
        'and infrastructure you actually run, since a report about a platform you do not have is ' +
        'interesting reading and not a lead. SPECIFICITY: does the lead name a technique concrete ' +
        'enough to turn into the if X then Y shape, or is it a category. RECENCY: is the reporting ' +
        'current enough that the behaviour described is still how the activity looks, since ' +
        'techniques and tooling both drift.\n\n' +
        'A lead that is relevant, specific, and current is worth the day even from an unglamorous ' +
        'source. A lead missing any of the three is worth screening out before it consumes anybody ' +
        'time, whatever the source claims to be.',
    },
    options: [
      { id: 'a', label: 'Check whether the technique even applies to software or infrastructure you actually run.' },
      { id: 'b', label: 'Check whether the lead is specific enough to become an if X then Y claim, or is still just a category.' },
      { id: 'c', label: 'Check whether the reporting is recent enough that the behaviour described still matches current tooling.' },
      { id: 'd', label: 'Weigh these three factors regardless of whether the lead came from a report, an anomaly, or a colleague.' },
      { id: 'e', label: 'Any lead from a paid intelligence subscription is worth a day regardless of the other factors, because of what it cost.' },
    ],
    hints: [
      'Four are the screening questions. One substitutes the price of the source for its quality.',
      'A subscription fee tells you nothing about whether the technique applies to your environment.',
      'Ask the same three questions of a hunch as you would of a paid report.',
    ],
    solution:
      'A, B, C, and D. Relevance, specificity, and recency, applied evenly regardless of source, is ' +
      'the actual screen. E is the trap that wastes budget: what something cost has no bearing on ' +
      'whether it is relevant, specific, or current, and treating expensive intel as automatically ' +
      'worth chasing is how a programme spends its best hunters on leads that fail all three checks.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option judges a lead by what it cost rather than by relevance, specificity, or recency.',
      },
    ],
    debrief:
      'A tip from an operator who has been on the floor for years often passes all three checks ' +
      'better than a glossy report about an actor that has never targeted your sector.',
    practice: [],
  },
  {
    id: 'th.3.3',
    moduleId: 'th.3',
    packageId: 'threat-hunter-foundations',
    order: 3,
    title: 'What a coverage gap actually tells you',
    kind: 'multiple-choice',
    goal: 'Read a detection coverage map correctly, without overclaiming what it shows.',
    prompt:
      'Your team maintains a coverage map against the ATT&CK matrix, and one technique has no ' +
      'detection at all. Which of the following are accurate about what that means? Select all that apply.',
    teach: {
      concept:
        'A coverage map is one of the most useful documents a hunt programme keeps, and it is also ' +
        'the one most often misread.\n\n' +
        'An empty cell means exactly one thing: nobody would be alerted if that technique were used. ' +
        'It does not mean the technique has been used, and it does not mean it has not been. That is ' +
        'precisely the uncertainty a gap-driven hunt exists to reduce: the hunt asks whether the ' +
        'silence hides something, using the same manual investigation any other hunt would use, ' +
        'since there is by definition no rule to lean on.\n\n' +
        'The map itself is worth maintaining for its own sake, independent of any single hunt, ' +
        'because it lets the programme prioritise gap-driven hunts toward techniques that matter to ' +
        'its actual threat model rather than picking gaps at random. What a gap is not is a finding ' +
        'in itself: reporting "we have no detection for X" is a fact about tooling, and "we hunted ' +
        'for X and found nothing" or "we hunted for X and found it" is a fact about the environment. ' +
        'Confusing the two overstates or understates the real state of things.',
    },
    options: [
      { id: 'a', label: 'An empty cell means nobody would be alerted if that technique were used, nothing more.' },
      { id: 'b', label: 'A gap-driven hunt asks whether the silence is hiding something, not whether the tooling has a hole.' },
      { id: 'c', label: 'A coverage map is worth maintaining on its own, to prioritise which gaps to hunt first.' },
      { id: 'd', label: 'Reporting "no detection exists" and reporting "we checked and found nothing" are two different claims.' },
      { id: 'e', label: 'An empty cell is itself evidence that the technique has probably been used and gone unnoticed.' },
    ],
    hints: [
      'Four are accurate. One treats the absence of a rule as evidence of a real intrusion.',
      'A missing detection is a fact about your tooling, not a fact about your network.',
      'What is the difference between "we have no alarm for this" and "we looked and it is not there"?',
    ],
    solution:
      'A, B, C, and D. A gap is a statement about visibility, the hunt exists to test the ' +
      'environment against it, the map is worth keeping for prioritisation, and the two kinds of ' +
      'claim are different. E overreads the map: an empty cell says nothing about whether the ' +
      'technique has actually been used, and treating it as suspicious in itself would mean every ' +
      'untested technique on the matrix is grounds for alarm, which is not a useful way to work.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a gap in tooling as evidence of an actual intrusion.',
      },
    ],
    debrief:
      'The map tells you where to look, not what you will find. That distinction is the whole reason ' +
      'gap-driven hunting is still hunting, and not just filling in a spreadsheet.',
    practice: [],
  },
  {
    id: 'th.3.4',
    moduleId: 'th.3',
    packageId: 'threat-hunter-foundations',
    order: 4,
    title: 'Which lead is worth running today',
    kind: 'multiple-choice',
    goal: 'Apply relevance, specificity, and recency to choose between competing leads.',
    prompt:
      'You have a day and four candidate leads. Which one is actually worth it?',
    teach: SOURCES_TEACH,
    options: [
      { id: 'a', label: 'A three-year-old report about a technique targeting a mainframe platform your organisation retired last year.' },
      { id: 'b', label: 'A vague statement that "advanced actors continue to target the sector" from a general threat landscape summary.' },
      { id: 'c', label: 'A specific technique from a report published this month, targeting the exact identity provider your organisation runs.' },
      { id: 'd', label: 'A rumour, with no source given, that a competitor was breached last year.' },
    ],
    hints: [
      'Three fail at least one of relevance, specificity, or recency. One passes all three.',
      'Ask about the platform first: does the lead even apply to what you run?',
      'Of the leads that are relevant, which one names a technique rather than a mood?',
    ],
    solution:
      'C. It is current, it names a specific technique, and it is relevant to software your ' +
      'organisation actually runs. A fails relevance, since the platform is gone. B fails ' +
      'specificity, since it names no technique. D fails on every count: no technique, no source, ' +
      'and nothing to query even if it were true.',
    expectedOutput: 'Option C selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['c'],
        hint: 'Which option is current, specific about the technique, and about something you actually run?',
      },
    ],
    debrief:
      'Notice that C is the only one you could turn into a hypothesis in the shape from the last ' +
      'module. That is not a coincidence: the same three questions screen leads and shape hypotheses.',
    practice: [],
  },
  {
    id: 'th.3.5',
    moduleId: 'th.3',
    packageId: 'threat-hunter-foundations',
    order: 5,
    title: 'Turning a hunch into work',
    kind: 'short-answer',
    goal: 'Respect a tip-driven lead without treating a feeling itself as the finding.',
    prompt:
      'A colleague tells you a specific finance director account "feels off" but has no data or ' +
      'incident to point to yet. In two or three sentences, say what you do with this.',
    teach: SOURCES_TEACH,
    hints: [
      'Do not dismiss it, and do not hunt on the feeling itself. Ask what specifically prompted it.',
      'A hunch is a lead, not yet a hypothesis. What turns it into one?',
      'A good answer takes the hunch seriously, asks the colleague what specifically prompted it, and turns whatever specific detail comes back into a testable claim about that account.',
    ],
    solution:
      'I would take the hunch seriously rather than waving it off, because tip-driven leads are a ' +
      'real source and this colleague may have noticed something they have not put into words yet. ' +
      'I would ask specifically what prompted the feeling: an odd login time, an unusual approval, a ' +
      'tone in an email, anything concrete. Whatever detail comes back, I would turn that into a ' +
      'bounded, testable hypothesis about that one account over a defined window, rather than hunting ' +
      'on the feeling itself, which has no evidence I could query.',
    expectedOutput:
      'An answer that takes the hunch seriously, asks for the specific detail behind it, and converts ' +
      'that detail into a testable hypothesis rather than hunting on the feeling alone.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['take it seriously', 'do not dismiss', 'respect', 'legitimate', 'valid lead'],
          ['ask what specifically', 'what prompted', 'concrete detail', 'what did you notice'],
          ['turn into', 'hypothesis', 'testable', 'query', 'evidence'],
        ],
        hint:
          'Three ideas: respect the hunch, ask what specific detail is behind it, and convert that ' +
          'detail into a testable hypothesis rather than hunting on the feeling itself.',
      },
    ],
    debrief:
      'A hunch is the raw material, not the finished product. The hunter job is the conversion, not ' +
      'the source, and that is true whichever of the four springboards a lead comes from.',
    practice: [],
  },
];

// --- Module th.4: the hunt loop -----------------------------------------------

const LOOP_TEACH = {
  concept:
    'Hunting is often described as a loop of four stages, and the description most teams use traces ' +
    'back to the hunting loop popularised by the threat hunting platform Sqrrl. It is worth learning ' +
    'by name because it describes what actually happens, not an idealised version of it.\n\n' +
    'HYPOTHESIZE is the stage covered in the last two modules: form a specific, falsifiable, scoped ' +
    'claim. INVESTIGATE is where the hunter actually queries telemetry, using whatever tools and ' +
    'techniques the environment supports, and revises course as the data complicates the picture, ' +
    'which it usually does. UNCOVER is naming what was found along the way, whether or not it is ' +
    'what the hypothesis predicted: new tactics, techniques and procedures, a false path ruled out, ' +
    'or a visibility gap discovered in the middle of looking for something else. INFORM AND ENRICH ' +
    'closes the loop by feeding what was uncovered back into the system: a new detection rule, an ' +
    'updated baseline, a sharpened piece of intel, or a better-scoped hypothesis for the next hunt.\n\n' +
    'It is called a loop rather than a line because the last stage feeds the first. A hunt that ends ' +
    'without informing anything downstream has value only to the hunter who ran it, and the whole ' +
    'point of a programme is that value should compound.',
} as const;

const MODULE_TH_4: Exercise[] = [
  {
    id: 'th.4.1',
    moduleId: 'th.4',
    packageId: 'threat-hunter-foundations',
    order: 1,
    title: 'Name the four stages',
    kind: 'multiple-choice',
    goal: 'Fix the four stages of the hunting loop in order.',
    prompt: 'Which of the following correctly describe a stage of the hunting loop? Select all that apply.',
    teach: LOOP_TEACH,
    options: [
      { id: 'a', label: 'Hypothesize: form a specific, falsifiable, scoped claim before looking at data.' },
      { id: 'b', label: 'Investigate: query the telemetry and revise course as the evidence complicates the picture.' },
      { id: 'c', label: 'Uncover: name what was found along the way, whether or not it matches the original hypothesis.' },
      { id: 'd', label: 'Inform and enrich: feed what was found back into detections, baselines, intel, or the next hypothesis.' },
      { id: 'e', label: 'Conclude: end the hunt at the first stage where the hypothesis is confirmed, without running the rest.' },
    ],
    hints: [
      'Four are the actual stages. One invents a shortcut that skips most of the loop.',
      'The loop has four named stages, and none of them is "stop as soon as you like the answer".',
      'What happens to a finding that is never fed back into anything?',
    ],
    solution:
      'A, B, C, and D. Hypothesize, investigate, uncover, and inform and enrich are the four stages. ' +
      'E is not a stage in the loop at all, and the instinct it describes, stopping the moment the ' +
      'evidence seems to agree with you, is exactly the shortcut that skips uncovering anything ' +
      'unexpected and skips feeding anything back downstream.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option proposes stopping as soon as the hypothesis looks confirmed, skipping the rest of the loop.',
      },
    ],
    debrief:
      'Say all four stages out loud before your next hunt. Skipping straight to investigate without ' +
      'a real hypothesis, or stopping before inform and enrich, are the two most common shortcuts, ' +
      'and both throw away most of the value.',
    practice: [],
  },
  {
    id: 'th.4.2',
    moduleId: 'th.4',
    packageId: 'threat-hunter-foundations',
    order: 2,
    title: 'What happens at investigate',
    kind: 'multiple-choice',
    goal: 'Understand investigate as an iterative stage rather than a single query.',
    prompt: 'Which of the following describe the investigate stage well? Select all that apply.',
    teach: LOOP_TEACH,
    options: [
      { id: 'a', label: 'It usually takes more than one query, each one shaped by what the last one returned.' },
      { id: 'b', label: 'It is where the original hypothesis meets real telemetry, with all its noise and gaps.' },
      { id: 'c', label: 'It can lead the hunter to revise the hypothesis if the evidence complicates the original claim.' },
      { id: 'd', label: 'It is where a hunter pivots off an interesting result to follow where it leads, inside the hunt scope.' },
      { id: 'e', label: 'It should end the moment the first query returns a result, to keep the investigation clean.' },
    ],
    hints: [
      'Four describe a real investigation. One describes stopping before the investigation has happened.',
      'Real telemetry rarely answers a hypothesis in one query.',
      'What is lost by treating the first result as the final one?',
    ],
    solution:
      'A, B, C, and D. Iteration, contact with real telemetry, willingness to revise, and pivoting on ' +
      'interesting results are what investigate actually looks like. E describes a hunt that never ' +
      'really investigates anything: the first query is rarely the whole picture, and stopping there ' +
      'means the loop skips straight past the stage where most of the actual finding happens.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option ends the investigation at the very first query, before the loop has really started.',
      },
    ],
    debrief:
      'Budget time for iteration when you plan a hunt. A hunt scoped for one query and one answer ' +
      'has scoped out the part of the loop where the interesting findings actually turn up.',
    practice: [],
  },
  {
    id: 'th.4.3',
    moduleId: 'th.4',
    packageId: 'threat-hunter-foundations',
    order: 3,
    title: 'What counts as uncovering something',
    kind: 'multiple-choice',
    goal: 'Recognise that the uncover stage is broader than confirming the hypothesis.',
    prompt: 'Which of the following would count as a genuine "uncover" from a hunt? Select all that apply.',
    teach: LOOP_TEACH,
    options: [
      { id: 'a', label: 'A new detection idea, spotted while chasing something the original hypothesis did not predict.' },
      { id: 'b', label: 'A technique or pattern relevant beyond the original scope of the hunt.' },
      { id: 'c', label: 'A visibility gap discovered while investigating, even if the original hypothesis was not supported.' },
      { id: 'd', label: 'A false path ruled out, documented so the next hunter does not repeat it.' },
      { id: 'e', label: 'Only a finding that directly confirms the original hypothesis counts as an uncover.' },
    ],
    hints: [
      'Four are real uncovers, none of which requires the original hypothesis to be confirmed. One narrows the stage down to almost nothing.',
      'What does a hunter learn from a hunt that ends "hypothesis not supported"?',
      'A ruled-out path is still information the next hunter benefits from having.',
    ],
    solution:
      'A, B, C, and D. A side finding, a broader pattern, a visibility gap, and a documented dead end ' +
      'are all genuine uncovers, and none of them requires the original hypothesis to have been ' +
      'confirmed. E shrinks the stage to almost nothing: if only confirmation counted, most hunts ' +
      'would uncover nothing at all, since most individual hunts are not supported, and that would ' +
      'make the loop far less valuable than it actually is.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option requires confirmation of the original hypothesis for anything to count as uncovered.',
      },
    ],
    debrief:
      'Write down every uncover, even from a hunt that finds nothing on its main question. The side ' +
      'findings are frequently worth more than the answer to the original hypothesis.',
    practice: [],
  },
  {
    id: 'th.4.4',
    moduleId: 'th.4',
    packageId: 'threat-hunter-foundations',
    order: 4,
    title: 'Why it is a loop and not a line',
    kind: 'multiple-choice',
    goal: 'State plainly what makes the fourth stage close the circle.',
    prompt: 'Which of these best explains why the hunting loop is a loop rather than a straight line?',
    teach: LOOP_TEACH,
    options: [
      { id: 'a', label: 'Because a hunt takes several days, and any long task can be called a loop.' },
      { id: 'b', label: 'Because what gets informed and enriched at the end feeds the next hypothesis, the next detection, and the next intel a future hunt will start from.' },
      { id: 'c', label: 'Because a hunter should repeat the exact same hypothesis on a schedule regardless of what earlier runs found.' },
      { id: 'd', label: 'Because the four stages have to be completed in a single sitting or the loop breaks.' },
    ],
    hints: [
      'Duration and repetition on their own do not make something a loop.',
      'What does the inform and enrich stage actually connect to?',
      'The loop closes because the output of one hunt becomes the input to the system that starts the next one.',
    ],
    solution:
      'B. The loop closes because inform and enrich feeds detections, baselines, and intel that shape ' +
      'the next hypothesis, so each hunt makes the next one, or the automated tooling, a little ' +
      'better. A confuses length with structure. C describes running the same hunt blindly, which is ' +
      'the opposite of a loop that learns. D invents a constraint the framework does not have.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'Which option describes output from one hunt becoming input to future hunts or to automated tooling?',
      },
    ],
    debrief:
      'This is the answer to "does hunting scale". It does not scale by running more hunters, it ' +
      'scales by each hunt making the automated layer smarter, so fewer future hunts are needed for ' +
      'the same technique.',
    practice: [],
  },
  {
    id: 'th.4.5',
    moduleId: 'th.4',
    packageId: 'threat-hunter-foundations',
    order: 5,
    title: 'Walk a hunt through the loop',
    kind: 'short-answer',
    goal: 'Narrate a short scenario using all four stages by name.',
    prompt:
      'A hunter suspects a specific lateral movement technique, investigates it, and along the way ' +
      'finds an unrelated but valid new path attackers could use between two servers that were not ' +
      'part of the original hypothesis. A rule is written to catch that new path. In three or four ' +
      'sentences, describe what happened at each of the four stages.',
    teach: LOOP_TEACH,
    hints: [
      'Name all four stages: hypothesize, investigate, uncover, inform and enrich.',
      'The lateral movement claim is the hypothesis. The new path is the uncover, not the hypothesis.',
      'The rule that got written is the inform and enrich stage closing the loop.',
    ],
    solution:
      'The hunter hypothesized that a specific lateral movement technique was in use and set out to ' +
      'investigate it against the relevant hosts. While investigating, they found evidence of the ' +
      'suspected technique was not there, but noticed an unrelated valid path between two servers ' +
      'that nothing in the original hypothesis had named, which is the uncover. That uncover was fed ' +
      'back into the system at the inform and enrich stage by writing a new detection rule for the ' +
      'newly found path, so the next occurrence of it, whether or not it relates to the original ' +
      'hypothesis, will be caught automatically.',
    expectedOutput:
      'A description naming the lateral movement claim as the hypothesis, the querying as investigate, ' +
      'the unrelated path as the uncover, and the new rule as inform and enrich.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['hypothesi', 'lateral movement', 'suspected', 'claim'],
          ['investigat', 'queried', 'looked', 'searched'],
          ['uncover', 'found', 'unrelated', 'new path', 'side finding'],
          ['inform', 'enrich', 'rule', 'detection', 'fed back'],
        ],
        hint:
          'Name all four stages: the original claim, the querying, the unexpected finding, and the ' +
          'rule that closed the loop.',
      },
    ],
    debrief:
      'Notice the hunt "failed" its original hypothesis and still produced a durable detection. That ' +
      'is the loop working exactly as intended, not a consolation prize.',
    practice: [],
  },
];

// --- Module th.5: hunt, investigation, or monitoring --------------------------

const DISTINCT_TEACH = {
  concept:
    'Hunting, investigation, and routine monitoring often use the same tools and the same data, ' +
    'which is exactly why it is easy to blur them, and why the distinction has to be made on ' +
    'purpose.\n\n' +
    'HUNT VERSUS INVESTIGATION: an investigation starts because something has already been declared, ' +
    'an incident, an alert escalated to that level, and its scope is set by that declaration. Its ' +
    'aim is to establish what happened, contain it, and support attribution or remediation. A hunt ' +
    'has no declared trigger, and its aim is discovery: finding out whether something is there at ' +
    'all.\n\n' +
    'HUNT VERSUS MONITORING: monitoring is continuous and rule-based, watching for conditions ' +
    'somebody already decided are worth an alert. A hunt is episodic and exploratory, looking for a ' +
    'pattern that has no rule yet, which is the entire reason a human has to do it by hand.\n\n' +
    'HUNT VERSUS VULNERABILITY MANAGEMENT: vulnerability management finds weaknesses that could be ' +
    'exploited, working from what is wrong with the systems. A hunt looks for exploitation that may ' +
    'already have happened, working from what an attacker would have done, regardless of whether a ' +
    'known vulnerability was involved at all.',
} as const;

const MODULE_TH_5: Exercise[] = [
  {
    id: 'th.5.1',
    moduleId: 'th.5',
    packageId: 'threat-hunter-foundations',
    order: 1,
    title: 'Hunt versus investigation',
    kind: 'multiple-choice',
    goal: 'Separate the proactive search from the reactive one, even when they use the same data.',
    prompt: 'Which of the following correctly distinguish a hunt from a declared investigation? Select all that apply.',
    teach: DISTINCT_TEACH,
    options: [
      { id: 'a', label: 'An investigation starts because something has already been declared; a hunt has no such trigger.' },
      { id: 'b', label: 'An investigation scope is set by what was declared; a hunt scope is set by the hypothesis.' },
      { id: 'c', label: 'An investigation aims at establishing what happened and containing it; a hunt aims at finding out whether something is there.' },
      { id: 'd', label: 'Both can query the same logs and the same tools, which is why the trigger and the aim are what actually separate them.' },
      { id: 'e', label: 'A hunt becomes an investigation the moment it uses the same data source an investigation would use.' },
    ],
    hints: [
      'Four are the real distinctions. One confuses shared tooling with shared purpose.',
      'Two seats can query the exact same log table for entirely different reasons.',
      'What changes the moment a hunt finds live, ongoing compromise?',
    ],
    solution:
      'A, B, C, and D. Trigger, scope, aim, and the fact that shared data does not erase the ' +
      'distinction are all correct. E gets the mechanism backwards: a hunt that finds a live, ' +
      'ongoing compromise should be handed to incident response so it becomes an investigation, but ' +
      'that transition happens because of what was found, not because of which log table was queried.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option claims that using the same data source as an investigation turns a hunt into one.',
      },
    ],
    debrief:
      'The tools will not tell you which seat you are in. The trigger and the aim will, every time.',
    practice: [],
  },
  {
    id: 'th.5.2',
    moduleId: 'th.5',
    packageId: 'threat-hunter-foundations',
    order: 2,
    title: 'Hunt versus monitoring',
    kind: 'multiple-choice',
    goal: 'Say why a hunt cannot simply be replaced by another dashboard.',
    prompt: 'Which of the following correctly distinguish a hunt from routine monitoring? Select all that apply.',
    teach: DISTINCT_TEACH,
    options: [
      { id: 'a', label: 'Monitoring is continuous and rule-based; a hunt is episodic and exploratory.' },
      { id: 'b', label: 'Monitoring watches for conditions somebody already decided were worth an alert; a hunt looks for a pattern with no rule yet.' },
      { id: 'c', label: 'Once a hunt confirms a pattern is worth watching for, turning it into a monitoring rule is the natural next step.' },
      { id: 'd', label: 'A well-tuned monitoring stack reduces how often a given hunt needs repeating, but does not remove the need for hunting new ground.' },
      { id: 'e', label: 'If monitoring generates enough alerts, a separate hunt programme becomes unnecessary.' },
    ],
    hints: [
      'Four are the real distinctions and how they connect. One assumes enough alert volume can substitute for exploration.',
      'A monitoring rule can only catch what somebody already thought to write a rule for.',
      'What does monitoring do about a technique nobody has written a detection for yet?',
    ],
    solution:
      'A, B, C, and D. Continuous versus episodic, known-condition versus no-rule-yet, the natural ' +
      'hand-off from a confirmed hunt finding into a rule, and monitoring reducing but not replacing ' +
      'the need to hunt new ground are all correct. E is the belief that quietly kills a hunt ' +
      'programme: no volume of alerts finds a technique nobody has written a rule for, which is ' +
      'exactly the space hunting exists to cover.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes a high volume of monitoring alerts removes the need for a hunt programme.',
      },
    ],
    debrief:
      'A mature programme measures this directly: techniques that used to require a hunt every ' +
      'quarter and now have a standing rule instead. That is the loop from the last module paying off.',
    practice: [],
  },
  {
    id: 'th.5.3',
    moduleId: 'th.5',
    packageId: 'threat-hunter-foundations',
    order: 3,
    title: 'Hunt versus vulnerability management',
    kind: 'multiple-choice',
    goal: 'Separate looking for weaknesses from looking for exploitation.',
    prompt: 'Which of the following correctly distinguish a hunt from vulnerability management? Select all that apply.',
    teach: DISTINCT_TEACH,
    options: [
      { id: 'a', label: 'Vulnerability management works from what is wrong with a system; a hunt works from what an attacker would have done.' },
      { id: 'b', label: 'A hunt can be relevant even where no known vulnerability exists, since living-off-the-land techniques exploit intended functionality.' },
      { id: 'c', label: 'A scan finding a missing patch is not itself evidence that the patch has been exploited; a hunt is one way to check.' },
      { id: 'd', label: 'The two are complementary rather than competing: closing a gap and checking whether it was already used are different questions.' },
      { id: 'e', label: 'Once a system is fully patched, a hunt covering it is no longer worthwhile.' },
    ],
    hints: [
      'Four capture the real relationship. One assumes patching removes the reason to hunt.',
      'What does a fully patched system tell you about whether it was compromised before the patch existed?',
      'Some techniques do not depend on a vulnerability at all.',
    ],
    solution:
      'A, B, C, and D. Different starting points, relevance without a named vulnerability, the gap ' +
      'between a finding and proof of exploitation, and the complementary relationship are all ' +
      'correct. E is wrong on two counts: patching closes a weakness going forward but says nothing ' +
      'about a prior compromise, and many hunt hypotheses have nothing to do with a patchable ' +
      'vulnerability at all.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes patching a system removes any reason to hunt on it.',
      },
    ],
    debrief:
      'A vulnerability scan and a hunt answer two different questions about the same system: is it ' +
      'weak, and has that weakness, or something needing no weakness at all, already been used.',
    practice: [],
  },
  {
    id: 'th.5.4',
    moduleId: 'th.5',
    packageId: 'threat-hunter-foundations',
    order: 4,
    title: 'Classify this work',
    kind: 'multiple-choice',
    goal: 'Apply the three-way distinction to a single scenario.',
    prompt:
      'A SIEM rule fires on a known-bad indicator and an analyst works the resulting ticket to ' +
      'closure. What is this?',
    teach: DISTINCT_TEACH,
    options: [
      { id: 'a', label: 'A hunt, because the analyst is looking through data for something.' },
      { id: 'b', label: 'Routine monitoring, because a pre-written rule fired on a condition somebody already decided was worth an alert.' },
      { id: 'c', label: 'Vulnerability management, because the ticket concerns a security concept.' },
      { id: 'd', label: 'An investigation, because any ticket that gets worked to closure counts as one.' },
    ],
    hints: [
      'Ask what started this: a hypothesis, a declared incident, or a rule that already existed.',
      'A rule firing on a known-bad indicator is exactly the definition of one of these seats.',
      'The trigger here is a pre-existing rule doing its job, not a hunter choosing to look.',
    ],
    solution:
      'B. A pre-written rule firing on a known condition and being worked to closure is routine ' +
      'monitoring, the reactive triage seat. A is wrong because nobody chose to look without a ' +
      'trigger. C is wrong because nothing here concerns a weakness to be patched. D stretches ' +
      '"investigation" to cover any closed ticket, which erases the distinction this module exists ' +
      'to teach.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'What triggered this work: a pre-existing rule, or a hunter choosing to look?',
      },
    ],
    debrief:
      'Most of a SOC floor day is exactly this scenario, and it is not hunting, however skilled the ' +
      'analyst working it. Naming it correctly is what keeps the distinction useful.',
    practice: [],
  },
  {
    id: 'th.5.5',
    moduleId: 'th.5',
    packageId: 'threat-hunter-foundations',
    order: 5,
    title: 'Explain the difference to a new hire',
    kind: 'short-answer',
    goal: 'Put the three-way distinction into your own words for somebody new to the floor.',
    prompt:
      'A new hire says hunting, investigation, and monitoring all look the same to them, since all ' +
      'three involve staring at logs. In three or four sentences, explain what actually separates them.',
    teach: DISTINCT_TEACH,
    hints: [
      'Start from the trigger, since that is the cleanest place to separate all three.',
      'Then say what each one is trying to establish once it starts.',
      'A good answer names the different trigger for each and the different question each one is trying to answer.',
    ],
    solution:
      'They all query similar data, but they start for different reasons and answer different ' +
      'questions. Monitoring is continuous and reacts to a rule somebody already wrote for a known ' +
      'condition. An investigation starts because something has already been declared, an incident ' +
      'or an escalated alert, and it works out what happened and how to contain it. A hunt has no ' +
      'trigger at all: the hunter forms a hypothesis and goes looking for something no rule has ' +
      'caught, and if they find live compromise, that is when it becomes an investigation instead.',
    expectedOutput:
      'An answer naming the different trigger for monitoring, investigation, and hunting, and the ' +
      'different question each is trying to answer.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['monitoring', 'rule', 'continuous', 'known condition', 'pre-written'],
          ['investigation', 'declared', 'incident', 'already', 'escalated'],
          ['hunt', 'hypothesis', 'no trigger', 'no rule', 'go looking'],
        ],
        hint:
          'Three ideas: what triggers monitoring, what triggers an investigation, and what triggers, ' +
          'or does not trigger, a hunt.',
      },
    ],
    debrief:
      'This is the answer worth having ready, because the question comes up constantly on a real ' +
      'floor, usually from somebody trying to figure out which seat they are actually being asked to fill.',
    practice: [],
  },
];

// --- Module th.6: data good enough to hunt on ---------------------------------

const DATA_TEACH = {
  concept:
    'A hunter needs telemetry that can actually show the evidence a hypothesis named, and "good ' +
    'enough" is a specific standard, not a synonym for "everything".\n\n' +
    'The sources a hunter reaches for most often are ENDPOINT telemetry, meaning process creation, ' +
    'command-line arguments, and module loads, not just antivirus verdicts; NETWORK telemetry, ' +
    'meaning flow records, DNS queries, and proxy logs; and AUTHENTICATION AND IDENTITY logs, ' +
    'meaning logons, privilege use, and account changes. Which of these matters most depends ' +
    'entirely on the hypothesis: a claim about lateral movement needs different data than a claim ' +
    'about command-and-control beaconing.\n\n' +
    'Two properties decide whether a given source is good enough for a given hunt. RETENTION: the ' +
    'data has to reach back far enough to cover the dwell time the hypothesis is worried about, ' +
    'which is often weeks to months, not the handful of days many tools keep by default. FIDELITY: ' +
    'the data has to carry enough detail to show the specific evidence named, a process name alone ' +
    'is not the same as a full command line, and a NetFlow summary is not the same as the DNS query ' +
    'itself. Good enough means the minimum combination of source, retention, and fidelity that would ' +
    'actually show the hypothesis evidence, no more and no less.',
} as const;

const MODULE_TH_6: Exercise[] = [
  {
    id: 'th.6.1',
    moduleId: 'th.6',
    packageId: 'threat-hunter-foundations',
    order: 1,
    title: 'Sources a hunter reaches for',
    kind: 'multiple-choice',
    goal: 'Name the telemetry families a hunt is usually built from.',
    prompt: 'Which of the following are genuine telemetry sources a hunter draws on? Select all that apply.',
    teach: DATA_TEACH,
    options: [
      { id: 'a', label: 'Endpoint telemetry: process creation, command-line arguments, and module loads.' },
      { id: 'b', label: 'Network telemetry: flow records, DNS queries, and proxy logs.' },
      { id: 'c', label: 'Authentication and identity logs: logons, privilege use, and account changes.' },
      { id: 'd', label: 'Which source matters most depends on the hypothesis being tested.' },
      { id: 'e', label: 'Antivirus verdicts alone are sufficient endpoint telemetry for any hunt involving a host.' },
    ],
    hints: [
      'Four are accurate. One treats a single narrow signal as the whole of endpoint telemetry.',
      'An antivirus verdict tells you whether a known-bad file ran. What does it tell you about a legitimate tool being abused?',
      'Living-off-the-land activity, by definition, will not trip an antivirus verdict.',
    ],
    solution:
      'A, B, C, and D. Endpoint, network, and identity telemetry are the three families, and which ' +
      'one matters depends on the claim being tested. E understates endpoint telemetry badly: an ' +
      'antivirus verdict only fires on what it already recognises as bad, and most of what this ' +
      'package has been building toward, living-off-the-land activity, unusual but legitimate tool ' +
      'use, produces no verdict at all.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats antivirus verdicts as sufficient endpoint telemetry on their own.',
      },
    ],
    debrief:
      'Before writing a hypothesis, ask which of the three families would actually show the evidence ' +
      'you are describing. If the answer is none of them, the hypothesis is not ready yet.',
    practice: [],
  },
  {
    id: 'th.6.2',
    moduleId: 'th.6',
    packageId: 'threat-hunter-foundations',
    order: 2,
    title: 'What makes telemetry good enough',
    kind: 'multiple-choice',
    goal: 'Judge data sufficiency by retention and fidelity, not by volume.',
    prompt: 'Which of the following are accurate about what makes a data source "good enough" for a hunt? Select all that apply.',
    teach: DATA_TEACH,
    options: [
      { id: 'a', label: 'Retention has to reach back far enough to cover the dwell time the hypothesis is worried about.' },
      { id: 'b', label: 'Fidelity has to carry enough detail to show the specific evidence named, not just a coarse summary.' },
      { id: 'c', label: 'A source covering only some of the relevant hosts is not good enough, whatever its retention and fidelity.' },
      { id: 'd', label: '"Good enough" is a minimum standard set by the hypothesis, not a synonym for collecting everything possible.' },
      { id: 'e', label: 'Collecting everything indefinitely is always the safer choice, regardless of what a given hypothesis needs.' },
    ],
    hints: [
      'Four describe a real, bounded standard. One treats unlimited collection as automatically good.',
      'What does collecting everything indefinitely cost, and does every hunt need it?',
      'A minimum standard is not the same as the maximum you could possibly gather.',
    ],
    solution:
      'A, B, C, and D. Retention matched to dwell time, fidelity matched to the claimed evidence, ' +
      'coverage of the relevant hosts, and a minimum rather than a maximum standard are all correct. ' +
      'E ignores real cost and practicality: storage, licensing, and processing all scale with volume ' +
      'and retention, and "collect everything forever" is not a data strategy, it is the absence of ' +
      'one dressed up as thoroughness.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats unbounded collection as automatically the safer choice.',
      },
    ],
    debrief:
      'Good enough is a question you can only answer once you have a hypothesis. Ask it of your data ' +
      'sources every time, rather than assuming last quarter answer still holds.',
    practice: [],
  },
  {
    id: 'th.6.3',
    moduleId: 'th.6',
    packageId: 'threat-hunter-foundations',
    order: 3,
    title: 'When the data is not there',
    kind: 'multiple-choice',
    goal: 'Treat a discovered data gap as a reportable finding rather than a private disappointment.',
    prompt: 'Partway through a hunt, you discover the data needed does not exist. Which of the following are sound responses? Select all that apply.',
    teach: {
      concept:
        'A data gap found while hunting is not a wasted afternoon, it is a finding, and it is often ' +
        'more valuable than the hunt would have been if the data had been there.\n\n' +
        'The right response has three parts. NAME THE GAP explicitly: what source is missing, or what ' +
        'retention or fidelity fell short of what the hypothesis needed. NARROW OR REDIRECT the ' +
        'hunt: either scale the hypothesis to what the available data actually can show, or find a ' +
        'different source that can, rather than quietly declaring a clean result the data was never ' +
        'able to produce. And REPORT IT alongside, or instead of, the hunt outcome, since closing the ' +
        'gap is now a real backlog item with a name attached.\n\n' +
        'What must never happen is silence: closing the hunt with "not supported" when the honest ' +
        'answer is "could not check" misrepresents the environment to everyone downstream who reads ' +
        'the coverage map.',
    },
    options: [
      { id: 'a', label: 'Name the specific gap: which source, or which property of it, fell short of the hypothesis.' },
      { id: 'b', label: 'Narrow the hypothesis to what the available data can actually show, or find another source.' },
      { id: 'c', label: 'Report the gap as a finding in its own right, since closing it is now a real piece of work.' },
      { id: 'd', label: 'Never report "not supported" when the honest answer is "could not check".' },
      { id: 'e', label: 'Quietly close the hunt as clean, since finding no evidence and having no way to look for it amount to the same result.' },
    ],
    hints: [
      'Four are the sound response. One erases the difference between two very different outcomes.',
      'A clean result and an untested claim look identical on paper unless somebody says which one happened.',
      'What does the next reader of your report assume if you write "not supported" and mean "could not check"?',
    ],
    solution:
      'A, B, C, and D. Naming the gap, narrowing or redirecting, reporting it, and never confusing ' +
      '"not supported" with "could not check" are all sound. E is the failure this module warns ' +
      'against most directly: a clean result and an untested claim are not the same thing, and ' +
      'reporting them identically leaves the coverage map, and everyone who trusts it, wrong.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a genuine clean result and an inability to check as the same outcome.',
      },
    ],
    debrief:
      'Some of the most valuable outputs a hunt programme produces are not findings about attackers ' +
      'at all, they are honest maps of where the organisation cannot currently see.',
    practice: [],
  },
  {
    id: 'th.6.4',
    moduleId: 'th.6',
    packageId: 'threat-hunter-foundations',
    order: 4,
    title: 'Pick the telemetry that fits the hypothesis',
    kind: 'multiple-choice',
    goal: 'Match a hypothesis to the specific data it actually requires.',
    prompt:
      'Your hypothesis: if an attacker used scheduled tasks for persistence, new tasks would appear ' +
      'on hosts that rarely change, running from unusual paths. Which combination of data would let ' +
      'you actually test this?',
    teach: DATA_TEACH,
    options: [
      { id: 'a', label: 'Antivirus alert history for the last seven days only.' },
      { id: 'b', label: 'Endpoint process-creation logs with command lines, covering the relevant hosts for at least as long as the suspected dwell time.' },
      { id: 'c', label: 'DNS query logs for the corporate resolver, with no endpoint data at all.' },
      { id: 'd', label: 'Network flow summaries showing byte counts between internal hosts, with no process detail.' },
    ],
    hints: [
      'The hypothesis is about a specific host-level behaviour: a new scheduled task from an unusual path.',
      'Which of these sources would actually show a task and the path it runs from?',
      'Rule out the ones that describe network behaviour or only known-bad signatures, since neither shows a new task appearing.',
    ],
    solution:
      'B. Scheduled task persistence is a host-level event, and process-creation logs with command ' +
      'lines, retained long enough to cover the suspected dwell time, are what would actually show a ' +
      'new task and the unusual path it runs from. A only shows known-bad signatures, which this ' +
      'technique is designed to avoid. C and D describe network-level data that says nothing about ' +
      'what is running on the host.',
    expectedOutput: 'Option B selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['b'],
        hint: 'Which option describes host-level data with enough detail to show a specific new task and path?',
      },
    ],
    debrief:
      'Matching data to hypothesis this precisely is what separates a hunt that can actually conclude ' +
      'something from one that produces a shrug regardless of what is really happening.',
    practice: [],
  },
  {
    id: 'th.6.5',
    moduleId: 'th.6',
    packageId: 'threat-hunter-foundations',
    order: 5,
    title: 'Fourteen days of retention against a ninety day question',
    kind: 'short-answer',
    goal: 'Handle a genuine mismatch between what a hunt needs and what the data can offer.',
    prompt:
      'You want to hunt for command-and-control beaconing over the last 90 days, but only 14 days of ' +
      'proxy logs are retained. In three or four sentences, say what you do.',
    teach: DATA_TEACH,
    hints: [
      'Do not silently report a 90-day answer using 14 days of data.',
      'Say what you can actually cover, and name the gap for the remaining window.',
      'A good answer narrows the hypothesis to the 14 days that exist, and separately reports the retention shortfall as its own finding.',
    ],
    solution:
      'I would narrow the hunt to what the retained data can actually show: 14 days rather than 90, ' +
      'and report the finding as covering that window explicitly rather than implying it answers the ' +
      'original 90-day question. I would also check whether another source, such as endpoint network ' +
      'connection logs, covers a longer window and could extend the check. Separately from the hunt ' +
      'result itself, I would report the 14-day retention as a gap against a 90-day question, since ' +
      'that limitation will recur on every future hunt that needs this data source until it is fixed.',
    expectedOutput:
      'An answer that narrows the hunt to the 14 days actually available, considers an alternative ' +
      'source, and separately reports the retention shortfall as its own finding.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['narrow', '14 day', 'available data', 'what is retained', 'covers only'],
          ['another source', 'alternative', 'different telemetry', 'endpoint', 'extend'],
          ['report', 'gap', 'retention', 'shortfall', 'limitation', 'flag'],
        ],
        hint:
          'Three ideas: narrow the hunt to the data that exists, consider another source for the ' +
          'remaining window, and report the retention gap separately.',
      },
    ],
    debrief:
      'The honest version of this answer is less satisfying than pretending 14 days answers a 90-day ' +
      'question, and it is the only version that does not quietly mislead whoever reads the report.',
    practice: [],
  },
];

// --- Module th.7: how a hunt ends -----------------------------------------------

const ENDING_TEACH = {
  concept:
    'A hunt has exactly three legitimate endings, and a student who only recognises one of them ' +
    'will find hunting demoralising for no good reason.\n\n' +
    'A WRITTEN FINDING of confirmed activity is the ending everybody pictures: the hypothesis was ' +
    'right, and there is evidence to show for it. A NEW DETECTION is the ending where the loop from ' +
    'an earlier module closes, whether or not the original hypothesis was confirmed: something ' +
    'learned along the way becomes a rule. And HYPOTHESIS NOT SUPPORTED, written up honestly rather ' +
    'than left unrecorded, is the third ending, and it is a real result: it reduces uncertainty about ' +
    'a question that mattered enough to ask, and it means nobody has to spend another day re-asking ' +
    'it blind.\n\n' +
    'What is not a legitimate ending is silence: a hunt that finds nothing and is never written up at ' +
    'all teaches the organisation nothing, wastes the effort spent, and leaves the next hunter free ' +
    'to duplicate exactly the same work.',
} as const;

const METRIC_TEACH = {
  concept:
    'Once a hunt programme exists, somebody will ask how to measure it, and the easy answer, the ' +
    'number of hunts run, is exactly the one to avoid.\n\n' +
    'A count of hunts is trivially gameable: a hunter under pressure to hit a number can run many ' +
    'narrow, low-effort hunts instead of fewer hard ones, and the count goes up while the programme ' +
    'gets worse at its actual job. Better signals connect to what hunting is for. The ratio of hunts ' +
    'that produced a new detection or a closed gap is one, since it measures the loop actually ' +
    'closing rather than merely spinning. Coverage of the ATT&CK matrix over time, tracked regardless ' +
    'of whether each hunt found anything, is another, since a technique tested and cleared is still ' +
    'progress. This kind of tracking is close to what the Hunting Maturity Model, associated with the ' +
    'researcher David Bianco, describes as a programme moving from ad hoc activity toward automated, ' +
    'repeatable hunting.\n\n' +
    'What all of the better signals share is that gaming them requires actually doing better hunting, ' +
    'not just doing more of it.',
} as const;

const MODULE_TH_7: Exercise[] = [
  {
    id: 'th.7.1',
    moduleId: 'th.7',
    packageId: 'threat-hunter-foundations',
    order: 1,
    title: 'The three valid endings',
    kind: 'multiple-choice',
    goal: 'Recognise all three legitimate ways a hunt can conclude.',
    prompt: 'Which of the following are legitimate ways for a hunt to end? Select all that apply.',
    teach: ENDING_TEACH,
    options: [
      { id: 'a', label: 'A written finding of confirmed activity, with the evidence attached.' },
      { id: 'b', label: 'A new detection created from something learned along the way, whether or not the original hypothesis held.' },
      { id: 'c', label: 'Hypothesis not supported, written up honestly with what was checked and how.' },
      { id: 'd', label: 'Each of these is a real result worth recording, not just the first one.' },
      { id: 'e', label: 'If nothing is found, the hunt should not be written up at all, since there is nothing to report.' },
    ],
    hints: [
      'Four are the endings this module names, plus the fact that all three count equally. One erases two-thirds of them.',
      'A hunt that finds nothing has still answered a question that mattered enough to ask.',
      'What happens to the next hunter effort if this result is never recorded anywhere?',
    ],
    solution:
      'A, B, C, and D. A confirmed finding, a new detection, and an honest not-supported result are ' +
      'all legitimate, and all three are worth recording as real outcomes. E throws away most of the ' +
      'value of a hunt programme: leaving a null result unrecorded means the next hunter may spend a ' +
      'day re-asking a question that was already answered.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a hunt that finds nothing as not worth writing up.',
      },
    ],
    debrief:
      'If a hunt programme report only ever lists confirmed findings, ask where all the not-supported ' +
      'results went. They did not stop happening, they stopped being written down.',
    practice: [],
  },
  {
    id: 'th.7.2',
    moduleId: 'th.7',
    packageId: 'threat-hunter-foundations',
    order: 2,
    title: 'Why not supported is a real result',
    kind: 'multiple-choice',
    goal: 'Explain the value of a null result rather than treating it as a failure.',
    prompt: 'Which of the following are true about a hunt ending "hypothesis not supported"? Select all that apply.',
    teach: ENDING_TEACH,
    options: [
      { id: 'a', label: 'It reduces real uncertainty about a question that was worth asking in the first place.' },
      { id: 'b', label: 'It means the technique has been checked, so the next hunter does not have to re-hunt it blind.' },
      { id: 'c', label: 'It feeds the same coverage tracking that a confirmed finding would.' },
      { id: 'd', label: 'It is a different outcome from failing to hunt at all, and should be recorded as such.' },
      { id: 'e', label: 'It means the hunter chose the wrong data or the wrong technique, and should immediately restart the hunt on a different hypothesis.' },
    ],
    hints: [
      'Four describe a genuine, useful result. One assumes a null result means the hunter did something wrong.',
      'A hypothesis being wrong is not the same as the hunter making a mistake.',
      'What would you actually check before assuming a not-supported result reflects a bad hunt rather than a bad hypothesis?',
    ],
    solution:
      'A, B, C, and D. Reduced uncertainty, avoided duplication, real coverage progress, and a ' +
      'meaningful distinction from not hunting at all are all correct. E assumes the outcome reflects ' +
      'an error, which is exactly the pressure that leads to the traps covered later in this module: ' +
      'a hypothesis not being supported is information about the environment, not a verdict on the ' +
      'hunter.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a not-supported result as evidence the hunter did something wrong.',
      },
    ],
    debrief:
      'A hunt programme that punishes not-supported results, even quietly, teaches its hunters to ' +
      'avoid asking hard questions. That is the opposite of what the programme exists to encourage.',
    practice: [],
  },
  {
    id: 'th.7.3',
    moduleId: 'th.7',
    packageId: 'threat-hunter-foundations',
    order: 3,
    title: 'Measuring value without gaming it',
    kind: 'multiple-choice',
    goal: 'Choose metrics for a hunt programme that cannot be gamed by running more, worse hunts.',
    prompt: 'Which of the following are sound ways to measure a hunt programme? Select all that apply.',
    teach: METRIC_TEACH,
    options: [
      { id: 'a', label: 'The share of hunts that led to a new detection or closed a real coverage gap.' },
      { id: 'b', label: 'ATT&CK technique coverage over time, tracked whether or not each hunt found anything.' },
      { id: 'c', label: 'Time-to-detect improvements that can be traced back to something a hunt uncovered.' },
      { id: 'd', label: 'Whether the programme draws leads from more than one of the four springboards, rather than only one.' },
      { id: 'e', label: 'The raw count of hunts completed per quarter, rewarded regardless of scope or outcome.' },
    ],
    hints: [
      'Four connect to the actual purpose of hunting. One rewards volume over substance.',
      'What would a hunter under quota pressure do to raise a raw count of hunts completed?',
      'A metric a hunter can raise by doing worse work faster is not measuring the programme.',
    ],
    solution:
      'A, B, C, and D. Findings-to-detections, coverage over time, traceable time-to-detect gains, and ' +
      'source diversity all connect directly to what the programme is for. E is the metric to avoid: ' +
      'a raw hunt count can be inflated by running many trivial, narrow hunts, and rewarding it ' +
      'teaches hunters to do exactly that.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option rewards the raw count of hunts completed regardless of what they actually covered.',
      },
    ],
    debrief:
      'Whatever you measure, a hunter will optimise for it. Measure the loop closing and the coverage ' +
      'growing, and that is what you will get more of.',
    practice: [],
  },
  {
    id: 'th.7.4',
    moduleId: 'th.7',
    packageId: 'threat-hunter-foundations',
    order: 4,
    title: 'The metric most likely to get gamed',
    kind: 'multiple-choice',
    goal: 'Predict how a poorly chosen metric actually gets gamed in practice.',
    prompt: 'A programme starts rewarding hunters purely on the number of hunts completed each month. What is the most likely result?',
    teach: METRIC_TEACH,
    options: [
      { id: 'a', label: 'Hunters run more narrow, low-effort hunts, since each one counts the same as a hard one, and the number rises while the programme learns less.' },
      { id: 'b', label: 'Hunters naturally start running deeper, harder hunts, since quantity and quality tend to rise together under this kind of pressure.' },
      { id: 'c', label: 'Nothing changes, because hunters are not influenced by how their work is measured.' },
      { id: 'd', label: 'The measurement causes every hunt to be reported as a confirmed finding regardless of the actual result.' },
    ],
    hints: [
      'Ask what the cheapest way to raise a raw count is.',
      'A metric that rewards quantity does not automatically also reward quality.',
      'The likely distortion is in effort and scope, not necessarily in the honesty of each individual write-up.',
    ],
    solution:
      'A. Rewarding a raw count predictably pushes toward many small, easy hunts rather than fewer ' +
      'hard ones, because each one counts the same. B assumes an effect this kind of metric does not ' +
      'produce. C ignores that people respond to incentives, which is the entire premise of choosing ' +
      'metrics carefully. D describes a different and more serious problem than the one this metric ' +
      'actually causes.',
    expectedOutput: 'Option A selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a'],
        hint: 'What is the cheapest way for a hunter to raise a raw count of completed hunts?',
      },
    ],
    debrief:
      'This is why the metrics in the previous exercise all connect to substance rather than volume. ' +
      'A metric anyone could raise without doing better work will get raised that way.',
    practice: [],
  },
  {
    id: 'th.7.5',
    moduleId: 'th.7',
    packageId: 'threat-hunter-foundations',
    order: 5,
    title: 'Report value, not a hunt count',
    kind: 'short-answer',
    goal: 'Propose a monthly report that measures the programme honestly.',
    prompt:
      'Your manager wants a monthly report on the value of the hunt programme. In three or four ' +
      'sentences, propose what you would report instead of a simple count of hunts run.',
    teach: METRIC_TEACH,
    hints: [
      'Lead with outcomes: detections created, gaps closed, coverage gained.',
      'Say explicitly why a raw count is not the number you are reporting.',
      'A good answer proposes at least two substance-based signals and states why a raw hunt count would be misleading on its own.',
    ],
    solution:
      'Instead of a raw count of hunts run, I would report how many led to a new detection or closed ' +
      'a real coverage gap, our ATT&CK technique coverage over time, and any time-to-detect ' +
      'improvement we can trace back to something a hunt uncovered. A raw count on its own would tell ' +
      'us nothing about quality and could be inflated by running many trivial hunts, so I would ' +
      'present it, if at all, only alongside these outcome measures rather than as the headline number.',
    expectedOutput:
      'A proposal reporting outcome-based signals such as detections created and coverage gained, ' +
      'and stating explicitly why a raw hunt count alone would be misleading.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['detection', 'gap closed', 'coverage', 'outcome', 'finding'],
          ['time-to-detect', 'time to detect', 'trace', 'risk reduction'],
          ['raw count', 'not just', 'misleading', 'instead of', 'gamed'],
        ],
        hint:
          'Three ideas: at least one outcome-based signal, a connection to real risk reduction, and ' +
          'an explicit reason a raw hunt count would be misleading alone.',
      },
    ],
    debrief:
      'A manager who accepts this answer once will keep asking for it this way. The report you give ' +
      'the first time sets the standard for every one after it.',
    practice: [],
  },
];

// --- Module th.8: handoffs and the traps --------------------------------------

const SEAM_TEACH = {
  concept:
    'A hunt finding is worth most when it leaves the hunter hands promptly and correctly, and the ' +
    'two seams that matter most are the ones into incident response and into detection engineering.\n\n' +
    'Live, ongoing compromise goes to INCIDENT RESPONSE. The hunter job was discovery, not containment ' +
    'or declaration, and continuing to quietly poke at a live intrusion alone risks tipping off the ' +
    'attacker or missing the coordination a real incident response needs. A confirmed detection gap ' +
    'goes to DETECTION ENGINEERING, who turn it into a durable rule, which is the same loop covered ' +
    'earlier in this package.\n\n' +
    'A good handoff is not a drop and disappear. The hunter documents what was found and exactly how, ' +
    'so the receiving team does not have to re-derive the work, and stays available afterward to ' +
    'answer questions about it. What a hunter should not do is treat their own speed as a reason to ' +
    'do the next team job themselves: containing a live intrusion personally, or writing a production ' +
    'rule without engineering review, both trade a faster feeling for a worse outcome.',
} as const;

const MODULE_TH_8: Exercise[] = [
  {
    id: 'th.8.1',
    moduleId: 'th.8',
    packageId: 'threat-hunter-foundations',
    order: 1,
    title: 'What a hunter hands off, and to whom',
    kind: 'multiple-choice',
    goal: 'Know where a finding goes next, and what staying involved does and does not mean.',
    prompt: 'Which of the following describe a sound handoff from a hunt? Select all that apply.',
    teach: SEAM_TEACH,
    options: [
      { id: 'a', label: 'Live, ongoing compromise goes to incident response, rather than the hunter continuing to investigate it alone.' },
      { id: 'b', label: 'A confirmed detection gap goes to detection engineering, to become a durable rule.' },
      { id: 'c', label: 'The hunter documents what was found and how, so the receiving team does not have to re-derive it.' },
      { id: 'd', label: 'Handing off does not mean disappearing: the hunter stays available to answer questions about what they found.' },
      { id: 'e', label: 'Once a hunter finds something, containing it personally is faster and should be preferred over waiting for incident response.' },
    ],
    hints: [
      'Four describe a sound handoff. One trades speed for exactly the coordination a real incident needs.',
      'What does an uncoordinated containment action risk tipping off?',
      'Being fast and being right are not the same thing when a live intrusion is involved.',
    ],
    solution:
      'A, B, C, and D. Routing live compromise to incident response, routing confirmed gaps to ' +
      'detection engineering, documenting the work, and staying available afterward are all part of ' +
      'a sound handoff. E is the instinct that undoes it: acting alone on a live intrusion, however ' +
      'fast, skips the coordination, scoping, and communication that a declared incident response ' +
      'actually requires, and can tip off an attacker who is still active.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option has the hunter contain a live intrusion personally instead of handing it to incident response.',
      },
    ],
    debrief:
      'Speed matters far less here than coordination. A hunter who hands off cleanly and stays ' +
      'available is worth more to the response than one who acted first and explained later.',
    practice: [],
  },
  {
    id: 'th.8.2',
    moduleId: 'th.8',
    packageId: 'threat-hunter-foundations',
    order: 2,
    title: 'Confirmation bias in a hunt',
    kind: 'multiple-choice',
    goal: 'Recognise the specific way confirmation bias distorts a hunt, and what actually checks it.',
    prompt: 'Which of the following are accurate about confirmation bias during a hunt? Select all that apply.',
    teach: {
      concept:
        'Confirmation bias is the specific trap of a hunter who already suspects a story: once a ' +
        'shape forms in the mind, evidence that fits it becomes easy to notice and evidence that does ' +
        'not becomes easy to explain away, without the hunter ever deciding to do either.\n\n' +
        'Two mitigations actually work. Deliberately looking for evidence that would DISPROVE the ' +
        'hypothesis, not just evidence that supports it, forces attention onto the cases the bias ' +
        'would otherwise skip. And having a SECOND ANALYST review the evidence without being told the ' +
        'suspected story first catches a distortion the original hunter cannot see in themselves, ' +
        'because the bias operates on what feels obviously relevant, which is exactly what a second ' +
        'set of eyes with no story yet does not share.\n\n' +
        'What does not work, and often makes things worse, is trusting a rising sense of confidence ' +
        'as the hunt goes on. Confidence is a feeling generated by pattern recognition, not a form of ' +
        'evidence, and time spent looking does not make a story more true.',
    },
    options: [
      { id: 'a', label: 'Once a hunter suspects a specific story, evidence that fits becomes easy to notice and evidence that does not becomes easy to explain away.' },
      { id: 'b', label: 'Deliberately looking for evidence that would disprove the hypothesis is a real mitigation, not just looking for evidence that supports it.' },
      { id: 'c', label: 'A second analyst reviewing the evidence without being told the suspected story first can catch a bias the original hunter cannot see in themselves.' },
      { id: 'd', label: 'A hunt running longer does not make the hypothesis more likely to be true.' },
      { id: 'e', label: 'The more confident a hunter feels partway through, the more that confidence should be trusted, since it reflects pattern recognition built from experience.' },
    ],
    hints: [
      'Four describe the trap and its mitigations. One treats a feeling as if it were evidence.',
      'Confidence is generated by the same mind that is trying to confirm its own story.',
      'What would a second analyst, told nothing about the suspected story, actually add?',
    ],
    solution:
      'A, B, C, and D. The trap, disconfirming evidence as a mitigation, a blind second review, and ' +
      'the fact that duration does not add truth are all correct. E is the trap wearing a ' +
      'respectable disguise: rising confidence often reflects the bias operating smoothly, not ' +
      'genuine pattern recognition, and treating it as reliable is how a hunter talks themselves into ' +
      'a story the data does not actually support.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a rising feeling of confidence as evidence worth trusting.',
      },
    ],
    debrief:
      'The blind second review is worth institutionalising. Ask a colleague to look at the raw ' +
      'evidence before you tell them what story you suspect, and see whether they land somewhere ' +
      'different.',
    practice: [],
  },
  {
    id: 'th.8.3',
    moduleId: 'th.8',
    packageId: 'threat-hunter-foundations',
    order: 3,
    title: 'Motivated reasoning after a long hunt',
    kind: 'multiple-choice',
    goal: 'Resist the pressure to manufacture a finding after significant time spent.',
    prompt: 'Which of the following are accurate about the pressure to find something after a long hunt? Select all that apply.',
    teach: {
      concept:
        'The second trap specific to this seat sits opposite alert fatigue. Where alert fatigue is ' +
        'the temptation to stop caring, this is the temptation to care too much about the time already ' +
        'spent: after days on a hunt with nothing to show, there is real pressure to find something, ' +
        'anything, that justifies it.\n\n' +
        'The honest position is uncomfortable and simple: time already spent is not evidence that ' +
        'something is there. Softening the bar for what counts as a finding to justify the days spent ' +
        'produces a report nobody downstream can act on, because it points at something that is not ' +
        'actually supported by the evidence. Writing up "hypothesis not supported" after significant ' +
        'time is a legitimate outcome, not a failure, and naming the pressure out loud to a peer or a ' +
        'lead before writing the conclusion is a real check against quietly giving in to it.',
    },
    options: [
      { id: 'a', label: 'Time already spent on a hunt is not evidence that something is there, however uncomfortable that is to sit with.' },
      { id: 'b', label: 'Softening the bar for what counts as a finding, to justify the days spent, produces a report nobody downstream can act on.' },
      { id: 'c', label: 'Writing up "hypothesis not supported" after a long hunt is a legitimate outcome, not a failure to be avoided by lowering the bar.' },
      { id: 'd', label: 'Naming the pressure out loud to a peer or a lead before writing the conclusion is a real check against giving in to it.' },
      { id: 'e', label: 'A hunt that finds nothing after significant time should be quietly extended rather than closed, until something is found.' },
    ],
    hints: [
      'Four describe the trap and its mitigations. One recommends indefinitely extending a hunt until it produces something.',
      'What happens to the scope and the timebox from the earlier modules if a hunt is extended until it finds something?',
      'Time spent is a fact about the hunter, not a fact about the environment.',
    ],
    solution:
      'A, B, C, and D. Time spent is not evidence, softening the bar produces an unusable report, a ' +
      'not-supported result is legitimate, and naming the pressure is a real check. E is the trap ' +
      'itself in the form of a recommendation: extending a hunt indefinitely until it produces a ' +
      'finding abandons the scope and timebox this package built earlier, purely to avoid an ' +
      'uncomfortable but honest conclusion.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option recommends extending a hunt indefinitely rather than closing it honestly.',
      },
    ],
    debrief:
      'The discomfort of writing "not supported" after nine days is real, and it is also the correct ' +
      'signal that the process is working as designed rather than bending to fit a deadline.',
    practice: [],
  },
  {
    id: 'th.8.4',
    moduleId: 'th.8',
    packageId: 'threat-hunter-foundations',
    order: 4,
    title: 'Nine days, one unrelated thread',
    kind: 'short-answer',
    goal: 'Close a hunt honestly while still following up on a genuine side finding.',
    prompt:
      'You have spent nine days hunting a specific persistence technique and found nothing that ' +
      'meets your original evidence bar. Along the way you found one interesting thing that does not ' +
      'actually match the original hypothesis. In three or four sentences, say what you do.',
    teach: SEAM_TEACH,
    hints: [
      'Do not stretch the interesting thing to look like it confirms the original hypothesis.',
      'Close the original hunt honestly, whatever that costs after nine days.',
      'A good answer closes the original hypothesis as not supported, and treats the unrelated finding as its own separate lead rather than forcing it to fit.',
    ],
    solution:
      'I would close the original hypothesis as not supported and write it up honestly, resisting the ' +
      'pull to stretch nine days of effort into a finding that does not actually meet the evidence ' +
      'bar I set at the start. The interesting but unrelated thing I found does not get folded into ' +
      'that write-up as if it confirmed the original claim; it becomes its own lead, scoped and ' +
      'turned into a fresh hypothesis on its own terms. Time spent is not evidence either way, and ' +
      'keeping the two results separate is what keeps both of them honest.',
    expectedOutput:
      'An answer that closes the original hunt as not supported without stretching the evidence, and ' +
      'treats the unrelated finding as a separate, freshly scoped lead rather than forcing a fit.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['not supported', 'close', 'honestly', 'write up', 'as it is'],
          ['separate', 'own lead', 'new hypothesis', 'does not fold in', 'own thread'],
          ['do not stretch', 'not force', 'not evidence', 'time spent', 'resist'],
        ],
        hint:
          'Three ideas: close the original hunt honestly, treat the side finding as its own separate ' +
          'lead, and resist stretching the evidence to justify the time spent.',
      },
    ],
    debrief:
      'Keeping these two results apart is the whole discipline of this module in one decision: the ' +
      'honest close and the genuine lead both survive intact, instead of being merged into a single ' +
      'report that overstates one and buries the other.',
    practice: [],
  },
];

export const THREAT_HUNTER_FOUNDATIONS: LearningPackage = {
  id: 'threat-hunter-foundations',
  order: 17,
  title: 'Threat Hunter Foundations',
  summary:
    'The one seat that goes looking. What threat hunting is, the assume-breach mindset, how a ' +
    'testable hypothesis is built, and how the role differs from the reactive seats around it.',
  outcomes: [
    'Say what starts a hunt, and why it is not an alert.',
    'Work from the assume-breach posture rather than assuming a clean network.',
    'Tell a testable hunt hypothesis from a vague worry.',
    'Place the hunter against the SOC operator and the detection engineer.',
  ],
  prerequisites: [],
  modules: [
    {
      id: 'th.1',
      packageId: 'threat-hunter-foundations',
      order: 1,
      title: 'The hunt mindset',
      summary:
        'What hunting is, the two habits that define it, and how it differs from every seat that ' +
        'waits to be told.',
      exercises: [
        {
          id: 'th.1.1',
          moduleId: 'th.1',
          packageId: 'threat-hunter-foundations',
          order: 1,
          title: 'What starts a hunt',
          kind: 'multiple-choice',
          goal: 'Fix the thing that makes hunting different: nothing has to fire first.',
          prompt: 'A threat hunt begins with which of these?',
          teach: HUNT_TEACH,
          options: [
            { id: 'a', label: 'An alert fires and lands in the queue.' },
            { id: 'b', label: 'A hypothesis about how an attacker might be operating, and where the evidence would show.' },
            { id: 'c', label: 'A vulnerability scanner flags a missing patch.' },
            { id: 'd', label: 'A user reports a suspicious email.' },
          ],
          hints: [
            'Three of these are triggers that arrive at somebody. Hunting is the seat that starts without one.',
            'An alert, a scan finding, and a user report all set the reactive seats in motion. The hunt is self-started.',
            'The hunter decides to go looking. What they start from is an idea, not an event.',
          ],
          solution:
            'B. A hunt starts from a hypothesis the hunter forms, not from an alert or a ticket. The ' +
            'other three are exactly the triggers the reactive seats wait for: an alert for the ' +
            'operator, a scan finding for vulnerability management, a user report for the queue. The ' +
            'whole point of hunting is that it happens with none of those.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'Which option is something the hunter chooses to pursue, rather than something that arrives and demands a response?',
            },
          ],
          debrief:
            'This is the line that separates hunting from the rest of the SOC. If a job advert says ' +
            '"respond to alerts", it is a triage seat. If it says "proactively search for undetected ' +
            'threats", it is a hunt.',
          practice: [],
        },
        {
          id: 'th.1.2',
          moduleId: 'th.1',
          packageId: 'threat-hunter-foundations',
          order: 2,
          title: 'Assume breach',
          kind: 'multiple-choice',
          goal: 'Adopt the posture the whole method rests on.',
          prompt: 'What does a threat hunter assume before they start looking?',
          teach: MINDSET_TEACH,
          options: [
            { id: 'a', label: 'That the tooling has already caught anything worth catching.' },
            { id: 'b', label: 'That an adversary may already be inside, unflagged by any alert.' },
            { id: 'c', label: 'That the network is clean until an alert says otherwise.' },
            { id: 'd', label: 'That prevention has held and nothing got through.' },
          ],
          hints: [
            'A hunter who trusts the tools has no reason to hunt. The posture is the opposite of that.',
            'Three of these assume things are fine. One assumes they are not, and goes to find out.',
            'Assume breach: work as though something is already inside and simply has not tripped anything.',
          ],
          solution:
            'B. Hunting rests on assume breach: you work as though an adversary is already present and ' +
            'unflagged, and you go looking for them. A, C, and D all assume the environment is fine ' +
            'until proven otherwise, which is the reactive posture, and it is exactly the assumption a ' +
            'patient intruder is counting on.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'Which assumption gives a hunter a reason to look at all?',
            },
          ],
          debrief:
            'Assume breach is not paranoia, it is a working method. It turns "is anything wrong" into ' +
            '"where would it be hiding", which is a question you can actually take to the data.',
          practice: [],
        },
        {
          id: 'th.1.3',
          moduleId: 'th.1',
          packageId: 'threat-hunter-foundations',
          order: 3,
          title: 'The hunter and the detection engineer',
          kind: 'multiple-choice',
          goal: 'See the loop the hunt closes with engineering.',
          prompt:
            'A hunt succeeds and finds attacker activity the tools missed. What is the natural next ' +
            'step, and who owns it?',
          teach: RELATE_TEACH,
          options: [
            { id: 'a', label: 'Close the hunt. The finding is the whole deliverable and nothing more is needed.' },
            { id: 'b', label: 'Hand the finding to a detection engineer to turn into a rule, so the next occurrence is caught automatically.' },
            { id: 'c', label: 'Give it to the SOC operator to look for by hand every day from now on.' },
            { id: 'd', label: 'File it as a vulnerability for the patching team.' },
          ],
          hints: [
            'Finding it once is good. The value multiplies when the next occurrence is caught without a human looking.',
            'Who on the floor owns turning an incident nobody caught into a rule that catches the next one?',
            'The hunter finds the gap by hand; the detection engineer closes it in code. That is the loop.',
          ],
          solution:
            'B. A successful hunt hands its finding to detection engineering, which turns it into a ' +
            'durable rule so the technique is caught automatically next time. That is the loop between ' +
            'the two seats. Closing the hunt (A) throws away most of the value; asking the operator to ' +
            'watch for it by hand (C) does not scale; and it is not a patch (D).',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'The finding is worth most when it becomes something that catches the next occurrence on its own.',
            },
          ],
          debrief:
            'Hunter and detection engineer are a cycle, not rivals: the hunt finds what the rules ' +
            'miss, and engineering makes sure the rules stop missing it. A hunt with no rule at the ' +
            'end of it will be re-run against the same gap forever.',
          practice: [],
        },
        {
          id: 'th.1.4',
          moduleId: 'th.1',
          packageId: 'threat-hunter-foundations',
          order: 4,
          title: 'Which of these is a hunt',
          kind: 'multiple-choice',
          goal: 'Separate self-started searching from triggered work.',
          prompt:
            'Which of these are threat hunting, as opposed to the reactive work of another seat? ' +
            'Select all that apply.',
          teach: HUNT_TEACH,
          options: [
            { id: 'a', label: 'Querying the logs for a technique no alert covers, on a hunch.' },
            { id: 'b', label: 'Working an alert the SIEM raised.' },
            { id: 'c', label: 'Searching hosts for beaconing patterns before anything has flagged.' },
            { id: 'd', label: 'Preserving a disk image after an incident is declared.' },
            { id: 'e', label: 'Testing a hunch that a service account is being abused, against the auth data.' },
          ],
          hints: [
            'Two of these start because something already happened. Three start because the hunter decided to look.',
            'An alert and a declared incident are triggers. Hunting has no trigger.',
            'A, C, and E all begin with a hunter choosing to search. B is triage; D is forensics.',
          ],
          solution:
            'A, C, and E. Each is a self-started search of the data for something no tool has flagged, ' +
            'which is hunting. B is the SOC operator working a raised alert, and D is forensics acting ' +
            'on a declared incident. Both of those are triggered; the hunt is not.',
          expectedOutput: 'Options A, C, and E selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'c', 'e'],
              hint: 'Drop the two that only happen because something already fired or was declared. What is left is the hunt.',
            },
          ],
          debrief:
            'Notice the same data underlies several of these: logs, auth records, host telemetry. What ' +
            'makes it a hunt is not the data, it is that nobody told you to look at it.',
          practice: [],
        },
        {
          id: 'th.1.5',
          moduleId: 'th.1',
          packageId: 'threat-hunter-foundations',
          order: 5,
          title: 'A hypothesis you can test',
          kind: 'multiple-choice',
          goal: 'Tell a workable hunt from a worry.',
          prompt: 'Which of these is a hunt hypothesis you can actually take to the data and test?',
          teach: MINDSET_TEACH,
          options: [
            { id: 'a', label: 'The network might be compromised somehow.' },
            { id: 'b', label: 'If an attacker used scheduled tasks for persistence, new tasks would appear on hosts that rarely change, running from unusual paths.' },
            { id: 'c', label: 'We should be more secure than we are.' },
            { id: 'd', label: 'Attackers these days are very sophisticated.' },
          ],
          hints: [
            'A testable hypothesis names a specific behaviour and the specific evidence it would leave.',
            'Three of these are true feelings you cannot check against a log. One tells you exactly what to query.',
            'Look for the if X then the data would show Y shape.',
          ],
          solution:
            'B. It names a specific technique (scheduled tasks for persistence) and the specific ' +
            'evidence it would leave (new tasks, on stable hosts, from unusual paths), which is a query ' +
            'you can run. A, C, and D are real concerns but there is nothing in any of them to check ' +
            'against data, so none of them is a hunt yet.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint: 'Which one could you turn into a log query this afternoon?',
            },
          ],
          debrief:
            'Most of the skill in hunting is upstream of any tool: turning a vague unease into a ' +
            'specific, checkable claim. A good hypothesis half-writes the query.',
          practice: [],
        },
        {
          id: 'th.1.6',
          moduleId: 'th.1',
          packageId: 'threat-hunter-foundations',
          order: 6,
          title: 'The hunter, placed',
          kind: 'short-answer',
          goal: 'Put the difference into your own words with the two nearest seats.',
          prompt:
            'In two or three sentences, say how a threat hunter day differs from a SOC operator day, ' +
            'and what a successful hunt hands to the detection engineer.',
          teach: RELATE_TEACH,
          hints: [
            'Start with the trigger: what sets each of them in motion?',
            'The operator answers what arrives; the hunter goes looking for what did not arrive.',
            'Your answer needs three things: how the hunter starts, how the operator starts, and what the hunt gives engineering.',
          ],
          solution:
            'A SOC operator works what arrives: alerts land in the queue and they triage them. A threat ' +
            'hunter starts from a hypothesis and goes looking in the data for activity no alert has ' +
            'flagged, assuming a breach may already be present. When a hunt finds something, it hands ' +
            'the finding to a detection engineer, who turns it into a rule so the next occurrence is ' +
            'caught automatically.',
          expectedOutput:
            'An answer contrasting the operator working alerts with the hunter starting from a ' +
            'hypothesis, and naming the rule or detection the hunt hands to engineering.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['hypothesis', 'proactive', 'go looking', 'without an alert', 'search', 'assume', 'undetected'],
                ['operator', 'alert', 'queue', 'reactive', 'triage', 'waits', 'arrives'],
                ['rule', 'detection', 'automate', 'durable', 'caught automatically', 'next time', 'engineer'],
              ],
              hint:
                'Three ideas: the hunter starts from a hypothesis and looks, the operator works alerts ' +
                'that arrive, and the hunt hands a rule or detection to engineering.',
            },
          ],
          debrief:
            'If you can hold these three straight, you understand where hunting sits: it is the ' +
            'proactive front of the same loop the operator and the detection engineer work the ' +
            'reactive ends of.',
          practice: [],
        },
      ],
    },
    {
      id: 'th.2',
      packageId: 'threat-hunter-foundations',
      order: 2,
      title: 'Building a testable hypothesis',
      summary:
        'The discipline upstream of any query: turning a hunch into a claim you can take to data, ' +
        'and scoping it tightly enough that the hunt can actually finish.',
      exercises: MODULE_TH_2,
    },
    {
      id: 'th.3',
      packageId: 'threat-hunter-foundations',
      order: 3,
      title: 'Where a hypothesis comes from',
      summary:
        'The four springboards a hunt can start from, and how to judge a lead worth a day of work ' +
        'from one that is not, whatever its source.',
      exercises: MODULE_TH_3,
    },
    {
      id: 'th.4',
      packageId: 'threat-hunter-foundations',
      order: 4,
      title: 'The hunt loop',
      summary:
        'Hypothesize, investigate, uncover, inform and enrich: the four stages of a hunt, and why ' +
        'the last one feeds the first.',
      exercises: MODULE_TH_4,
    },
    {
      id: 'th.5',
      packageId: 'threat-hunter-foundations',
      order: 5,
      title: 'Hunt, investigation, or monitoring',
      summary:
        'Telling three seats apart that often share the same data: what triggers each one, and ' +
        'what each one is actually trying to establish.',
      exercises: MODULE_TH_5,
    },
    {
      id: 'th.6',
      packageId: 'threat-hunter-foundations',
      order: 6,
      title: 'Data good enough to hunt on',
      summary:
        'The telemetry a hunter reaches for, what retention and fidelity have to clear to be ' +
        '"good enough" for a given hypothesis, and treating a data gap as a finding.',
      exercises: MODULE_TH_6,
    },
    {
      id: 'th.7',
      packageId: 'threat-hunter-foundations',
      order: 7,
      title: 'How a hunt ends',
      summary:
        'The three legitimate endings, why hypothesis not supported is a real result, and how to ' +
        'measure a hunt programme without teaching it to game the count.',
      exercises: MODULE_TH_7,
    },
    {
      id: 'th.8',
      packageId: 'threat-hunter-foundations',
      order: 8,
      title: 'Handoffs and the traps',
      summary:
        'Handing a finding to incident response or detection engineering without doing their job, ' +
        'and the two cognitive traps that come with sitting in this seat.',
      exercises: MODULE_TH_8,
    },
  ],
};
