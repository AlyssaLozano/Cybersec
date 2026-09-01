/**
 * Scoring a claim on a live scenario.
 *
 * THE RULE THIS MODULE EXISTS TO ENFORCE
 *
 * `ScenarioTruth` is an answer key. A student who can read it knows which
 * events matter before working any of them, which is the entire exercise. So
 * truth is reached only through `truthFor()`, the student-facing surface is
 * built by `eventsFor()`, and no route calls the first before a claim is
 * committed. Same arrangement as `alerts.ts` and `copilot.ts`.
 *
 * WHY FOUR SCORES AND NOT ONE
 *
 * A single number cannot separate "you were wrong about the threat" from "you
 * were right but it was not your event to take". Those are different failures
 * with different fixes: one is knowledge, the other is discipline. A team that
 * is individually excellent and collectively chaotic scores well on accuracy
 * and badly on lane, and it should be able to see that.
 *
 * WHY BEING CONFIDENTLY WRONG COSTS MORE
 *
 * Confidence is not a fifth score, it is a multiplier on the accuracy line. A
 * SOC that says "90% sure this is nothing" and is wrong has done more damage
 * than one that says "40% sure, escalating anyway". Rewarding hedging would be
 * its own problem, so being confidently RIGHT pays more too.
 */

import type {
  Claim,
  ClaimScore,
  ClaimScoreLine,
  EventTruth,
  Scenario,
  ScenarioEvent,
  ScenarioTruth,
  ScenarioDifficulty,
  SocRoleId,
  KillChainStage,
  TriageDecision,
  InvestigationNote,
  InvestigationTrace,
} from '@soc/shared';
import {
  AMBIGUOUS_CONFIDENCE_CEILING,
  AMBIGUOUS_CONFIDENCE_FLOOR,
  CLAIM_GRACE_SECONDS,
  CLAIM_LATE_SECONDS,
} from '@soc/shared';

import { SCENARIOS, SCENARIO_TRUTH } from '../content/scenarios/index.js';

const BY_ID = new Map(SCENARIOS.map((s) => [s.id, s]));
const TRUTH_BY_ID = new Map(SCENARIO_TRUTH.map((t) => [t.scenarioId, t]));

export function getScenario(scenarioId: string): Scenario | null {
  return BY_ID.get(scenarioId) ?? null;
}

/**
 * Events visible to one seat, at one point in the shift.
 *
 * Two filters, both deliberate. `atSeconds` withholds what has not happened
 * yet, because a queue that arrives all at once removes the time pressure the
 * hour exists to create. `surface` withholds what this seat could not see: a
 * cloud audit entry never reaches the alert queue, so a SOC Operator has to be
 * told about it by somebody, which is the point.
 */
export function eventsFor(
  scenarioId: string,
  role: SocRoleId,
  atSeconds: number,
  runAt?: ScenarioDifficulty,
): ScenarioEvent[] {
  const scenario = BY_ID.get(scenarioId);
  if (!scenario) return [];
  const surfaces = SURFACES_BY_ROLE[role] ?? [];
  const difficulty = runAt ?? scenario.difficulty;
  const expert = difficulty === 'expert';

  const arrived = scenario.events.filter((event) => event.atSeconds <= atSeconds);

  if (!expert) {
    // Below expert, an expert-only event does not exist at all. It is not
    // hidden from a seat, it never happened in this run.
    return arrived.filter(
      (event) => !event.expertOnly && surfaces.includes(event.surface),
    );
  }

  const visible: ScenarioEvent[] = [];
  for (const event of arrived) {
    // A withheld stage is gone from every seat, which is the point: the gap has
    // to be inferred from the shape of what remains, not spotted by whoever
    // happens to hold the right console.
    if (event.withheldAtExpert) continue;

    const onSurface =
      surfaces.includes(event.surface) ||
      (event.expertAlsoOn ?? []).some((s) => surfaces.includes(s));
    if (!onSurface) continue;

    // The degraded record goes to the seat that is NOT the event's home
    // surface. The primary surface keeps the full detail, so the two seats hold
    // genuinely different accounts of one moment and have to reconcile them.
    const degraded =
      event.expertDetail !== undefined && !surfaces.includes(event.surface);

    visible.push({
      ...event,
      // At expert the tooling stops telling you how worried to be. Severity is
      // an assertion by whoever wrote the rule, and reading it off the row is
      // the habit expert difficulty exists to remove.
      claimedSeverity: null,
      ...(degraded ? { detail: event.expertDetail! } : {}),
    });
  }
  return visible;
}

/**
 * Which surfaces each seat can see.
 *
 * This is the projection that makes the room necessary. No role sees every
 * surface, so no role can reconstruct the incident alone.
 */
const SURFACES_BY_ROLE: Record<string, string[]> = {
  'soc-operator': ['alert-queue'],
  'log-analyst': ['alert-queue', 'raw-log', 'process-tree'],
  'network-analyst': ['alert-queue', 'network-flow'],
  'malware-analyst': ['process-tree', 'host-artefact'],
  forensics: ['host-artefact', 'raw-log'],
  'cloud-security': ['cloud-audit', 'alert-queue'],
  'threat-intel': ['alert-queue', 'network-flow'],
  'ai-security': ['alert-queue', 'process-tree'],
  'ir-lead': ['alert-queue', 'raw-log', 'network-flow', 'cloud-audit', 'process-tree', 'host-artefact'],
  'vulnerability-analyst': ['alert-queue', 'host-artefact'],
  /*
   * Detection engineering sees what fired and the data underneath it, and
   * nothing else.
   *
   * The queue is their subject matter rather than their workload: they are the
   * only seat whose job is the RULE rather than the event, and firing history
   * is what tells them whether a proposed detection would have drowned the
   * floor. Raw logs are there because a rule nobody backtested is a guess, and
   * backtesting needs the thirty days the rule would have run against.
   *
   * They deliberately do not get network flows, cloud audit or host artefacts.
   * A seat that can investigate everything will investigate instead of building
   * the control, and the control is the only thing on this floor that outlives
   * the hour.
   */
  'detection-engineer': ['alert-queue', 'raw-log'],
  /*
   * Fusion sees three surfaces that no single specialist holds together.
   *
   * Not all six. A fusion seat with the lead's view is a second lead, and the
   * value of the seat is that they have to ASK, which is what makes the room
   * talk to itself. Three overlapping surfaces is enough to notice that two
   * seats are describing one event and neither knows it.
   */
  'fusion-analyst': ['alert-queue', 'raw-log', 'network-flow'],
};

/** The answer key. Never call this from a route before a claim is committed. */
export function truthFor(scenarioId: string): ScenarioTruth | null {
  return TRUTH_BY_ID.get(scenarioId) ?? null;
}

function eventTruth(scenarioId: string, eventId: string): EventTruth | null {
  return truthFor(scenarioId)?.events.find((e) => e.eventId === eventId) ?? null;
}

/**
 * What a seat is told when they sit down, before anything happens.
 *
 * WHY THIS IS NOT A HINT
 *
 * Telling somebody what their job is and where to look is orientation. Telling
 * them what they will find is a spoiler. A real analyst arrives knowing their
 * remit and their tooling and knowing nothing about tonight, and that is
 * exactly the line this draws: the brief names the surfaces, the questions the
 * role exists to answer, and who they hand to. It never names an event.
 *
 * It is also DERIVED rather than authored, so it cannot drift. The surfaces
 * come from the same table the projection uses, so a brief can never promise a
 * seat something the projection will not give them.
 */
export interface SeatBriefing {
  role: SocRoleId;
  title: string;
  /** One line on what this seat is for. */
  remit: string;
  /** The consoles they have, named the way the UI names them. */
  surfaces: string[];
  /** What to be asking, not what the answer is. */
  questions: string[];
  /** Who normally receives their findings. */
  handsTo: SocRoleId[];
  /**
   * How many events will reach this seat over the shift.
   *
   * Null at expert, where the count is itself an answer. Knowing eight are
   * coming tells you when to stop looking, and "am I done" is one of the
   * questions expert exists to make the floor answer from the evidence rather
   * than from a progress bar.
   */
  expectedEvents: number | null;
  /**
   * The vocabulary this seat is about to be judged on.
   *
   * Somebody cannot choose between "dismiss" and "tune the rule" if nobody has
   * told them those are different things, and a career changer with Security+
   * has read the words without ever having to act on them. Skippable in the UI:
   * a returning student should not read it eleven times.
   */
  glossary: Array<{ term: string; means: string }>;
}

/**
 * The four dispositions, which every seat needs and nobody is born knowing.
 * These are the actual choices on the alert queue, so getting them wrong is not
 * a vocabulary problem, it is a scored one.
 */
const DISPOSITIONS: Array<{ term: string; means: string }> = [
  {
    term: 'Escalate',
    means:
      'Hand it to somebody with more time or more access. Says "this is real enough to spend ' +
      'another person on". Escalating everything is the same as triaging nothing.',
  },
  {
    term: 'Investigate',
    means:
      'Keep it and dig. Says "I cannot close this yet and I am the right person to find out".',
  },
  {
    term: 'Dismiss',
    means:
      'Close it as not worth acting on. This is a real decision, not a shrug, and it is the one ' +
      'that is invisible when you get it wrong.',
  },
  {
    term: 'Tune the rule',
    means:
      'The detection is the problem, not the event. Raise a ticket to change what fires, so this ' +
      'stops arriving. Dismissing the same alert forty times is what tuning exists to replace.',
  },
];

const TERMS: Record<string, Array<{ term: string; means: string }>> = {
  'soc-operator': [
    { term: 'Firing history', means: 'How often this rule has fired before and how often that was nothing. The number under each row.' },
    { term: 'True positive', means: 'The detection was right about what it saw. Says nothing about whether it matters.' },
    { term: 'Benign true positive', means: 'Correctly detected, and harmless. The firewall doing its job is the usual case.' },
    { term: 'False positive', means: 'The detection was simply wrong about what it saw.' },
  ],
  'log-analyst': [
    { term: 'Timeline', means: 'Events in the order they happened, each tied to a log line you can point at.' },
    { term: 'Correlation', means: 'Two records that describe the same moment from different sources. Corroboration, not coincidence.' },
    { term: 'authorized_keys', means: 'The file listing keys allowed to log in as an account. A write to it usually means persistence.' },
  ],
  'network-analyst': [
    { term: 'Flow', means: 'A record that two addresses spoke: source, destination, port, volume, direction. Not what was said.' },
    { term: 'Baseline', means: 'What normal looks like for this host. A connection is only unusual against one.' },
    { term: 'Egress', means: 'Traffic leaving your estate. Outbound to somewhere unexpected is a different finding from inbound noise.' },
    { term: 'C2', means: 'Command and control. Infrastructure an intrusion calls back to.' },
  ],
  'malware-analyst': [
    { term: 'Loader', means: 'Code whose only job is to fetch and run the real payload. What it fetches can change hourly.' },
    { term: 'Detonation', means: 'Running a sample in an isolated sandbox to watch what it actually does.' },
    { term: 'Static vs dynamic', means: 'Reading the code versus running it. Obfuscation defeats the first and rarely the second.' },
  ],
  forensics: [
    { term: 'Order of volatility', means: 'Collect what disappears fastest first. Memory before disk, always.' },
    { term: 'Chain of custody', means: 'The record of who held the evidence and when. Without it, the evidence may not be usable.' },
    { term: 'Write blocker', means: 'Hardware that lets you read a disk without altering it.' },
  ],
  'cloud-security': [
    { term: 'Principal', means: 'The identity that made an API call. A user, a role, or a service account.' },
    { term: 'Audit trail', means: 'The provider log of who called which API, from where, with what result.' },
    { term: 'Least privilege', means: 'A principal holding only the permissions it needs. A first use of an unused one is a signal.' },
  ],
  'threat-intel': [
    { term: 'TTP', means: 'Tactics, techniques and procedures. How an actor works, which is harder for them to change than an address.' },
    { term: 'ATT&CK', means: 'A public catalogue of observed techniques with ids like T1110. Mapping to it makes a finding comparable across incidents and teams.' },
    { term: 'IOC', means: 'Indicator of compromise. An address, hash or domain. Cheap for an attacker to change, so it ages badly.' },
    { term: 'Actor class', means: 'What kind of adversary this behaves like: financially motivated, espionage, opportunistic. Drives what you expect next.' },
    { term: 'Attribution', means: 'Assessing who did it. An assessment with a basis and a confidence is intelligence; a named group asserted as fact off an address is a guess wearing a suit.' },
    { term: 'Analytic confidence', means: 'How much weight your assessment carries, and why. Stated explicitly so somebody else can disagree with the reasoning rather than the conclusion.' },
  ],
  'ai-security': [
    { term: 'Prompt injection', means: 'Input that a model treats as instruction rather than as data.' },
    { term: 'Evasion', means: 'Changing an attack so detection does not recognise it, without changing what it does.' },
  ],
  'vulnerability-analyst': [
    { term: 'CVE', means: 'A catalogued vulnerability with an identifier. Not every way in has one.' },
    { term: 'Exploitability', means: 'Whether a weaponised exploit actually exists, as opposed to whether one theoretically could.' },
  ],
  'detection-engineer': [
    { term: 'Backtest', means: 'Replaying proposed logic over historical data to see what it would have fired on. A rule nobody backtested is a guess.' },
    { term: 'False positive rate', means: 'What the rule costs per shift. A perfect detection nobody reads has caught nothing.' },
    { term: 'Detection as code', means: 'Rules kept in version control and reviewed like software, so a change has an author and can be undone.' },
    { term: 'Indicator vs behaviour', means: 'An address stops working when they change it. A technique keeps working, and is harder to write.' },
  ],
  'fusion-analyst': [
    { term: 'Pivot', means: 'Moving from one finding to related ones through a shared host, account, address or time window.' },
    { term: 'Corroboration', means: 'Two seats reaching the same conclusion from different evidence. Not the same as two seats agreeing.' },
    { term: 'Intelligence gap', means: 'Something the picture needs and nobody has. Naming it is the output; guessing at it is not.' },
  ],
  'ir-lead': [
    { term: 'Declare', means: 'State that this is an incident. Activates procedures and pulls people off other work.' },
    { term: 'Containment', means: 'Removing the attacker access without destroying what proves they were there.' },
    { term: 'Corroboration', means: 'Two seats reaching the same conclusion from different evidence. Worth more than one seat being loud.' },
  ],
};

const SURFACE_LABELS: Record<string, string> = {
  'alert-queue': 'Alert queue',
  'raw-log': 'Raw logs',
  'network-flow': 'Connection flows',
  'cloud-audit': 'Cloud audit trail',
  'process-tree': 'Process tree',
  'host-artefact': 'Host artefacts',
};

const REMIT: Record<string, { remit: string; questions: string[]; handsTo: SocRoleId[] }> = {
  'soc-operator': {
    remit: 'First read on everything the tooling raises. Decide what deserves a human, quickly.',
    questions: [
      'Is this real, or is it a rule that cries wolf? Check the firing history before the content.',
      'Does anything here share a source, an account, or a five-minute window with anything else?',
      'If you escalate everything you have triaged nothing. What are you willing to close?',
    ],
    handsTo: ['log-analyst', 'ir-lead'],
  },
  'log-analyst': {
    remit: 'Build the timeline. Establish what happened, in order, and what the logs do not prove.',
    questions: [
      'What is the earliest event you can stand behind, as opposed to the earliest you suspect?',
      'What happened in the seconds after a success? That is usually where persistence lands.',
      'Which of your claims rests on one source, and can you corroborate it in a second one?',
    ],
    handsTo: ['ir-lead', 'forensics'],
  },
  'network-analyst': {
    remit: 'Answer what is talking to what, and whether it should be.',
    questions: [
      'Direction first. Inbound noise and outbound contact are not the same finding.',
      'Is this path in the baseline? A connection is only unusual against what is usual.',
      'Can you prove anything left? If you cannot prove it either way, say neither.',
    ],
    handsTo: ['ir-lead', 'threat-intel'],
  },
  'malware-analyst': {
    remit: 'Determine what a payload actually does, and what it would do next.',
    questions: [
      'Decoding it is the easy half. What capability does the decoded thing actually have?',
      'Is the payload in the command, or does the command fetch it? Those are different problems.',
      'How would you capture the stage you cannot see?',
    ],
    handsTo: ['ir-lead', 'forensics'],
  },
  forensics: {
    remit: 'Preserve what proves it, in an order that does not destroy what comes next.',
    questions: [
      'What disappears first? Collect in order of volatility, not order of convenience.',
      'What is the timestamp relationship between artefacts? That is usually the finding.',
      'Would this survive somebody rebuilding the host in an hour?',
    ],
    handsTo: ['ir-lead'],
  },
  'cloud-security': {
    remit: 'Everything is an API call and an identity. Work out which principal did what, from where.',
    questions: [
      'Did this principal ever do this before? A first use of a permission is the signal.',
      'Where did the call come from? Inside the estate and from the scheduler are different answers.',
      'Is this administration that looks like an attack, or an attack that looks like administration?',
    ],
    handsTo: ['ir-lead'],
  },
  'threat-intel': {
    remit:
      'Map the tradecraft to ATT&CK, assess who this is likely to be and what they want, and say ' +
      'what they will probably do next.',
    questions: [
      'Which ATT&CK techniques can you actually evidence, and which are you inferring?',
      'Actor CLASS and motive first: does this read as financially motivated, espionage, or ' +
        'opportunistic? What in the evidence says so?',
      'What is the most likely next move, and what would you need to see to confirm it?',
      'Where is the line between your assessment and a named group? State your confidence and ' +
        'what would change it.',
    ],
    handsTo: ['ir-lead'],
  },
  'ai-security': {
    remit: 'Validate that the detection stack itself was not evaded or fooled.',
    questions: [
      'What did the tooling miss, and is that a gap or a blind spot?',
      'Is there evidence anybody tried to evade detection rather than just avoid it?',
      'Can the monitoring still be trusted while the estate is compromised?',
    ],
    handsTo: ['ir-lead'],
  },
  'vulnerability-analyst': {
    remit: 'Work out whether the way in is a one-off or a class of problem across the estate.',
    questions: [
      'Is this a CVE or a practice? Those get fixed by completely different work.',
      'How many other hosts have the same exposure right now?',
      'What can actually be changed this week, as opposed to what should be?',
    ],
    handsTo: ['ir-lead'],
  },
  'detection-engineer': {
    remit:
      'Build the control that stops this next time, and be honest about what it would cost the ' +
      'floor to run.',
    questions: [
      'What would have caught this earlier, and would it have fired on anything else in thirty days?',
      'Are you detecting the technique or the indicator? One of those still works next month.',
      'What does this rule cost per shift, and is the floor that already ignores 8,000 alerts a ' +
        'month going to read it?',
    ],
    handsTo: ['ir-lead'],
  },
  'fusion-analyst': {
    remit:
      'Hold the whole picture. Notice when two seats are describing the same thing and neither of ' +
      'them knows it.',
    questions: [
      'Which two findings share a host, an account, an address or a five-minute window?',
      'Who is working from an assumption that another seat has already disproved?',
      'What does the sequence imply happened that nobody has evidence for yet?',
    ],
    handsTo: ['ir-lead'],
  },
  'ir-lead': {
    remit: 'Decide. Pace the floor, adjudicate disagreements, and own the call on incomplete information.',
    questions: [
      'Do several seats independently point the same way, or is one seat loud?',
      'What is the cost of declaring, and what is the cost of waiting another ten minutes?',
      'Who has not reported, and is that because they found nothing or because they are stuck?',
    ],
    handsTo: [],
  },
};

/**
 * Build a seat's opening brief.
 *
 * Returns null for a role the scenario has not seated, because briefing
 * somebody for a chair they are not in is its own kind of confusing.
 */
export function briefingFor(
  scenarioId: string,
  role: SocRoleId,
  runAt?: ScenarioDifficulty,
): SeatBriefing | null {
  const scenario = BY_ID.get(scenarioId);
  if (!scenario || !scenario.roles.includes(role)) return null;
  const spec = REMIT[role];
  if (!spec) return null;
  const difficulty = runAt ?? scenario.difficulty;

  return {
    role,
    title: role,
    remit: spec.remit,
    // Derived from the projection table, so a brief cannot promise a console
    // the seat will not actually be given.
    surfaces: (SURFACES_BY_ROLE[role] ?? []).map((s) => SURFACE_LABELS[s] ?? s),
    questions: spec.questions,
    handsTo: spec.handsTo,
    expectedEvents:
      difficulty === 'expert'
        ? null
        : eventsFor(scenarioId, role, Number.MAX_SAFE_INTEGER, difficulty).length,
    // The glossary goes too at expert. Somebody sitting an expert run has
    // already been told four times what a benign true positive is, and leaving
    // it in place lets a seat look up the vocabulary of a finding instead of
    // recognising it. Everything in it is available in the foundations content,
    // which is where a definition belongs.
    glossary: difficulty === 'expert' ? [] : [...DISPOSITIONS, ...(TERMS[role] ?? [])],
  };
}

/**
 * The coaching line for an event, if this scenario is allowed to give one.
 *
 * WHY DIFFICULTY GATES THIS AND NOT THE AUTHOR
 *
 * "The monitoring collector produces more failures than the attacker. Counting
 * is not triage." is a good line to read at beginner and a spoiler at
 * intermediate: it names the decoy, states the lesson, and points at the
 * address that mattered. A student who is meant to be learning to find that
 * themselves has just been told.
 *
 * Authors will keep writing these, because explaining is the instinct. So the
 * gate lives here rather than in a style rule nobody enforces, and a scenario
 * above beginner cannot emit one even if its content defines it.
 */
export function guidanceFor(
  scenarioId: string,
  eventId: string,
  role: SocRoleId,
  runAt?: ScenarioDifficulty,
): string | null {
  const scenario = BY_ID.get(scenarioId);
  if (!scenario) return null;
  if ((runAt ?? scenario.difficulty) !== 'beginner') return null;
  // Hints reach the lead and nobody else. The lead decides what to pass on and
  // to whom, which is the job: a floor where everyone is fed the same prompt
  // does not need a lead, and a lead who has nothing the others lack cannot
  // direct anybody. Relaying it badly is a real failure mode worth rehearsing.
  if (role !== 'ir-lead') return null;
  return eventTruth(scenarioId, eventId)?.guidance ?? null;
}

/**
 * Which dispositions treat an event as worth somebody's time.
 *
 * `tune` counts as not-a-threat on purpose: raising a tuning ticket is what you
 * do about a rule that keeps crying wolf, and it is the correct answer for the
 * monitoring-collector noise.
 */
function treatsAsThreat(decision: TriageDecision): boolean {
  return decision === 'escalate' || decision === 'investigate';
}

/**
 * How long each seat would plausibly take before it had something to say.
 *
 * Not a fudge factor. Triage is fast by definition and forensics is slow by
 * definition, and delivering every stand-in the instant its event lands would
 * give the lead a feed no real floor produces, which teaches the wrong sense of
 * pace.
 */
const REPORTING_DELAY_SECONDS: Record<string, number> = {
  'soc-operator': 60,
  'network-analyst': 150,
  'log-analyst': 240,
  'cloud-security': 240,
  'malware-analyst': 300,
  forensics: 360,
  'threat-intel': 420,
  'vulnerability-analyst': 300,
  'ai-security': 300,
  'ir-lead': 0,
};

export interface StandIn {
  eventId: string;
  /** The seat nobody is in. */
  role: SocRoleId;
  /** When the lead should read it out. */
  dueAtSeconds: number;
  /** What that seat would have reported, in their words. */
  text: string;
}

/**
 * What the lead has to read out on behalf of empty chairs, and when.
 *
 * Only for seats the scenario expects and nobody filled. A seat that is filled
 * gets nothing: the person in it does the work, and handing the lead a
 * duplicate would let them pre-empt their own analyst.
 *
 * Deliberately given ONLY to the lead. It is somebody else's finding, so it is
 * not scored as the lead's analysis, but failing to relay it is on them: the
 * floor cannot act on something nobody said out loud.
 */
export function standInsFor(
  scenarioId: string,
  filledRoles: SocRoleId[],
  atSeconds: number,
): StandIn[] {
  const scenario = BY_ID.get(scenarioId);
  const truth = truthFor(scenarioId);
  if (!scenario || !truth) return [];

  const filled = new Set(filledRoles);
  const due: StandIn[] = [];

  for (const entry of truth.events) {
    if (!entry.standIn) continue;
    // Somebody is in that chair. It is their finding to make.
    if (filled.has(entry.firstResponder)) continue;
    // A seat the scenario never asked for is not an empty chair.
    if (!scenario.roles.includes(entry.firstResponder)) continue;

    const event = scenario.events.find((e) => e.id === entry.eventId);
    if (!event) continue;

    const delay = REPORTING_DELAY_SECONDS[entry.firstResponder] ?? 180;
    const dueAt = event.atSeconds + delay;
    if (dueAt > atSeconds) continue;

    due.push({
      eventId: entry.eventId,
      role: entry.firstResponder,
      dueAtSeconds: dueAt,
      text: entry.standIn,
    });
  }

  return due.sort((a, b) => a.dueAtSeconds - b.dueAtSeconds);
}

/**
 * What help the terminal offers, which is entirely a function of difficulty.
 *
 *   beginner      five candidate commands, one of them useful. They still type.
 *   intermediate  no commands, one line on what to go looking for.
 *   advanced      nothing.
 *   expert        nothing.
 *
 * The progression is the point. A career changer with Security+ has read about
 * grep and never had to reach for it under time pressure, and dropping them at
 * a bare prompt teaches them they are bad at this rather than teaching them the
 * shell. Naming the question without the syntax is the middle rung: knowing you
 * want the accepted logins after a run of failures is the analysis, and
 * composing the pipeline is a skill that only transfers if you do it yourself.
 *
 * Unlike `guidanceFor`, this is NOT restricted to the lead. It is scaffolding
 * for using a console, not a hint about the incident, and withholding it from
 * everyone but the lead would just mean nobody investigates.
 */
export interface TerminalAid {
  /** Beginner only. Five candidates; one is the useful next step. */
  options: string[];
  /** Intermediate only. What to look for, never how. */
  nudge: string | null;
}

export function terminalAidFor(
  scenarioId: string,
  eventId: string,
  runAt?: ScenarioDifficulty,
): TerminalAid {
  const scenario = BY_ID.get(scenarioId);
  const entry = eventTruth(scenarioId, eventId);
  if (!scenario || !entry) return { options: [], nudge: null };

  const difficulty = runAt ?? scenario.difficulty;
  if (difficulty === 'beginner') {
    return { options: entry.commandOptions ?? [], nudge: null };
  }
  if (difficulty === 'intermediate') {
    return { options: [], nudge: entry.commandNudge ?? null };
  }
  // Advanced and expert are on their own, which is the whole difference.
  return { options: [], nudge: null };
}

/**
 * What the lead reads out before anything starts.
 *
 * SKIPPABLE, AND DERIVED
 *
 * A returning team does not need to hear it, so the UI can skip it. A first
 * team cannot start without it: eleven people who do not know who owns what
 * will all take the first alert.
 *
 * Built from the roster and the projection table rather than written out,
 * because a checklist that names a seat the scenario did not fill, or promises
 * a console somebody does not have, is worse than no checklist.
 */
export interface OpeningChecklist {
  scenarioId: string;
  situation: string;
  /** Who is here, what they own, and where they look. */
  roster: Array<{ role: SocRoleId; owns: string; surfaces: string[] }>;
  /** How work moves. Fixed, because it does not vary by scenario. */
  flow: string[];
  /** The clock, and what happens at the end of it. */
  timing: string[];
  /** Ground rules worth saying out loud once. */
  rules: string[];
}

export function openingChecklist(scenarioId: string): OpeningChecklist | null {
  const scenario = BY_ID.get(scenarioId);
  if (!scenario) return null;

  return {
    scenarioId,
    situation: scenario.situation,
    roster: scenario.roles.map((role) => ({
      role,
      owns: REMIT[role]?.remit ?? '',
      surfaces: (SURFACES_BY_ROLE[role] ?? []).map((s) => SURFACE_LABELS[s] ?? s),
    })),
    flow: [
      'Alerts land on triage first. Triage decides what deserves a human and hands it outward.',
      'Nothing comes back to triage. If you found it in deep analysis, you have already done their job.',
      'Everything that matters ends up with me. I decide, and I will tell you what I decided and why.',
      'If two of you read the same thing differently, that is mine to settle. Say so rather than arguing it out.',
      'When your board goes quiet, write your report. Filing it does not mean anybody has read it: I will call you to present.',
    ],
    timing: [
      `${scenario.durationMinutes} minutes on the clock. Events keep arriving inside it.`,
      'You may stay longer, but you are scored on what you had dispositioned at the hour.',
      'We are not done when the attacker stops. We are done when every report is in and somebody has proposed a control.',
    ],
    rules: [
      'Say what you cannot prove as clearly as what you can. "I do not know yet" is an answer.',
      'Stay in your seat. Working somebody else queue leaves yours unwatched, and it is scored.',
      'Dismissing is a decision, not a shrug. Escalating everything is the same as triaging nothing.',
      'Nobody names a threat group. Assess the class and say your confidence.',
    ],
  };
}

/**
 * How the hour ends.
 *
 * WORKING    events land, seats claim them, nothing is written yet
 * REPORTING  each seat writes when its own board goes quiet, and the lead
 *            calls people to present. Filing is not presenting.
 * CONTROL    detection engineering proposes what stops it next time. This
 *            phase exists separately because that seat's input is everybody
 *            else's output: they cannot sensibly go before the reports are in.
 * CLOSED     the lead declares it, with the three numbers below attached.
 *
 * WHY PUBLISHING DOES NOT MEAN EVERYBODY READS
 *
 * Filing makes a report exist and visible as filed. It does not push it into
 * eleven people's faces, because a floor where every publish interrupts
 * everyone converges on whoever writes fastest and stops working. The lead
 * calls people to present, which is what a bridge does, and it is the lead's
 * job precisely because deciding what the room needs to hear next is a
 * judgement.
 */
export const SHIFT_PHASES = ['working', 'reporting', 'control', 'closed'] as const;
export type ShiftPhase = (typeof SHIFT_PHASES)[number];

/**
 * The three numbers a debrief is actually about.
 *
 * Everybody quotes dwell time and almost nobody separates the parts. A floor
 * that detects in four minutes and then takes fifty to work out what it means
 * has a different problem from one that takes fifty to notice, and one number
 * hides which.
 */
export interface ShiftTimings {
  /** First malicious event landing to the first correct claim on any of them. */
  detectSeconds: number | null;
  /** That first correct claim to the last specialist report filed. */
  analyseSeconds: number | null;
  /** Last report to a control being proposed. */
  correctSeconds: number | null;
  /** Landing to close. The number that gets quoted. */
  totalSeconds: number | null;
}

export interface ShiftClose {
  phase: ShiftPhase;
  timings: ShiftTimings;
  /** Seats that owed a report and have not filed. */
  awaitingReports: SocRoleId[];
  /** True when a control has been proposed. */
  controlProposed: boolean;
  /** Whether the lead may close it, and if not, why not. */
  canClose: boolean;
  blockers: string[];
}

/**
 * Where the shift is, and whether the lead is allowed to call it done.
 *
 * The gate is deliberate: an incident is not over because the attacker
 * stopped, it is over when somebody has written down what happened and
 * somebody else has changed something so it does not happen the same way
 * twice. A lead who can close with four reports outstanding will.
 */
export function closeState(
  scenarioId: string,
  claims: Claim[],
  filedReports: SocRoleId[],
  controlProposedAtSeconds: number | null,
  closedAtSeconds: number | null,
  lastReportAtSeconds: number | null = null,
): ShiftClose | null {
  const scenario = BY_ID.get(scenarioId);
  const truth = truthFor(scenarioId);
  if (!scenario || !truth) return null;

  const malicious = truth.events.filter(
    (e) => e.verdict === 'malicious' || e.verdict === 'blocked-reconnaissance',
  );
  const maliciousIds = new Set(malicious.map((e) => e.eventId));

  const firstLanded = Math.min(
    ...scenario.events.filter((e) => maliciousIds.has(e.id)).map((e) => e.atSeconds),
  );

  // A correct claim means the seat treated a real threat as one. Claiming it
  // and dismissing it is not detection.
  const correctClaims = claims.filter((c) => {
    const entry = truth.events.find((e) => e.eventId === c.eventId);
    if (!entry || !maliciousIds.has(c.eventId)) return false;
    return treatsAsThreat(c.disposition);
  });
  const firstCorrectAt = correctClaims.length
    ? Math.min(...correctClaims.map((c) => c.atSeconds))
    : null;

  const owed = scenario.roles.filter((r) => r !== 'ir-lead');
  const awaitingReports = owed.filter((r) => !filedReports.includes(r));

  const blockers: string[] = [];
  if (awaitingReports.length > 0) {
    blockers.push(`${awaitingReports.length} report(s) outstanding: ${awaitingReports.join(', ')}.`);
  }
  if (controlProposedAtSeconds === null) {
    blockers.push('No control proposed. Nothing has changed to stop this happening the same way.');
  }

  const phase: ShiftPhase =
    closedAtSeconds !== null
      ? 'closed'
      : controlProposedAtSeconds !== null
        ? 'control'
        : filedReports.length > 0
          ? 'reporting'
          : 'working';

  return {
    phase,
    timings: {
      detectSeconds: firstCorrectAt === null ? null : firstCorrectAt - firstLanded,
      // Analysis runs from the moment somebody knew it was real to the moment
      // the last specialist had written down what they knew.
      analyseSeconds:
        firstCorrectAt === null || lastReportAtSeconds === null
          ? null
          : Math.max(0, lastReportAtSeconds - firstCorrectAt),
      // Correction is the part almost nobody measures: understanding it and
      // changing something so it does not recur are different jobs.
      correctSeconds:
        lastReportAtSeconds === null || controlProposedAtSeconds === null
          ? null
          : Math.max(0, controlProposedAtSeconds - lastReportAtSeconds),
      totalSeconds: closedAtSeconds === null ? null : closedAtSeconds - firstLanded,
    },
    awaitingReports,
    controlProposed: controlProposedAtSeconds !== null,
    canClose: blockers.length === 0,
    blockers,
  };
}

/**
 * Events two seats read differently.
 *
 * WHY DISAGREEMENT IS ROUTED UP RATHER THAN RESOLVED
 *
 * Two operators working one queue will sometimes reach opposite dispositions on
 * the same alert, and that is not a bug in either of them. One dismissed a
 * blocked scan as noise and one escalated it as reconnaissance; both can give
 * you a defensible account. Resolving it automatically, or letting the second
 * claim overwrite the first, throws away the most useful thing on the floor.
 *
 * So a contested event goes to the lead with both readings attached. That is
 * the lead's actual job, and it is the one decision on the board that cannot be
 * made by any single seat.
 *
 * Note this is deliberately not scored as a failure for either seat. They are
 * each scored against ground truth independently; being outvoted is not being
 * wrong, and being agreed with is not being right.
 */
export interface ContestedEvent {
  eventId: string;
  readings: Array<{
    role: SocRoleId;
    disposition: TriageDecision;
    reasoning: string;
    confidence: number;
  }>;
}

export function contestedEvents(claims: Claim[]): ContestedEvent[] {
  const byEvent = new Map<string, Claim[]>();
  for (const claim of claims) {
    const list = byEvent.get(claim.eventId) ?? [];
    list.push(claim);
    byEvent.set(claim.eventId, list);
  }

  const contested: ContestedEvent[] = [];
  for (const [eventId, group] of byEvent) {
    if (group.length < 2) continue;
    // Two seats agreeing is not contested, however many of them there are.
    if (new Set(group.map((c) => c.disposition)).size < 2) continue;
    contested.push({
      eventId,
      readings: group.map((c) => ({
        role: c.role,
        disposition: c.disposition,
        reasoning: c.reasoning,
        confidence: c.confidence,
      })),
    });
  }
  return contested;
}

/**
 * The end-of-shift debrief.
 *
 * TWO HALVES, AND ONLY ONE OF THEM VARIES
 *
 * "How would you write this when every run goes differently" has a tidy answer:
 * you do not write the variable half.
 *
 * What the attacker did is fixed. The intrusion ran the same way whether the
 * floor caught it in nine minutes or missed it entirely, so that is authored
 * once as `ScenarioTruth.narrative` and read back verbatim. It is the thing
 * everybody wants to know at the end and nobody could see from one seat.
 *
 * How it was found is computed from what the team actually did: who spotted
 * which stage, in what order, what was left on the board, and where two people
 * read the same thing differently. That half writes itself from the claims,
 * which means it is right every time and costs nothing per scenario.
 */
export interface DebriefStage {
  eventId: string;
  stage?: KillChainStage;
  /** What it was. Released now, never before. */
  why: string;
  /** Who got to it, or nobody. */
  spottedBy: SocRoleId | null;
  /** Seconds after it landed. Null when it was never claimed. */
  spottedAfterSeconds: number | null;
  /** True when the seat that took it read it correctly. */
  readCorrectly: boolean;
  /**
   * True when this run never put the event on any board.
   *
   * Withheld stages have to be reported, or the narrative has a hole the floor
   * cannot account for. They are never counted as missed: nobody fails to catch
   * what was not there.
   */
  neverShown: boolean;
  /** What the planted evidence was built to suggest, where there was any. */
  appearsToBe?: string;
  /** For unsettled events: the evidence that would have decided it. */
  wouldSettleIt?: string;
}

export interface Debrief {
  scenarioId: string;
  /** Authored once. The same every run. */
  whatHappened: string[];
  /** Computed. Different every run. */
  stages: DebriefStage[];
  missed: string[];
  contested: string[];
  /**
   * Stages this run removed from the board. Expert only, and empty everywhere
   * else. Reported so the gap is explained rather than left as a mystery.
   */
  withheld: string[];
  /** The plain summary line, derived rather than written. */
  summary: string;
}

export function buildDebrief(
  scenarioId: string,
  claims: Claim[],
  runAt?: ScenarioDifficulty,
): Debrief | null {
  const scenario = BY_ID.get(scenarioId);
  const truth = truthFor(scenarioId);
  if (!scenario || !truth) return null;
  const expert = (runAt ?? scenario.difficulty) === 'expert';

  const firstClaim = new Map<string, Claim>();
  for (const claim of claims) {
    const held = firstClaim.get(claim.eventId);
    if (!held || claim.atSeconds < held.atSeconds) firstClaim.set(claim.eventId, claim);
  }

  // An event that was not on the board this run cannot be graded against this
  // run. Expert-only events at lower tiers and withheld stages at expert are
  // the two directions of the same rule.
  const wasOnTheBoard = (event: ScenarioEvent): boolean =>
    expert ? !event.withheldAtExpert : !event.expertOnly;

  const stages: DebriefStage[] = truth.events.map((entry) => {
    const event = scenario.events.find((e) => e.id === entry.eventId)!;
    const claim = firstClaim.get(entry.eventId) ?? null;
    const shouldTreatAsThreat =
      entry.verdict === 'malicious' || entry.verdict === 'blocked-reconnaissance';
    return {
      eventId: entry.eventId,
      stage: entry.stage,
      why: entry.why,
      spottedBy: claim?.role ?? null,
      spottedAfterSeconds: claim ? Math.max(0, claim.atSeconds - event.atSeconds) : null,
      // An unsettled event has no correct read, so "read correctly" means
      // somebody took it and did not walk past it.
      readCorrectly: claim
        ? entry.verdict === 'ambiguous' || treatsAsThreat(claim.disposition) === shouldTreatAsThreat
        : false,
      neverShown: !wasOnTheBoard(event),
      ...(entry.appearsToBe ? { appearsToBe: entry.appearsToBe } : {}),
      ...(entry.wouldSettleIt ? { wouldSettleIt: entry.wouldSettleIt } : {}),
    };
  });

  const onBoard = stages.filter((s) => !s.neverShown);

  // Only malicious stages count as "missed". Nobody needs telling they failed
  // to escalate the noise, and nobody is marked down for a stage this run
  // deliberately removed.
  const missed = onBoard
    .filter((s) => {
      const entry = truth.events.find((e) => e.eventId === s.eventId)!;
      const matters = entry.verdict === 'malicious' || entry.verdict === 'blocked-reconnaissance';
      return matters && (s.spottedBy === null || !s.readCorrectly);
    })
    .map((s) => s.eventId);

  const withheld = stages.filter((s) => s.neverShown).map((s) => s.eventId);
  const contested = contestedEvents(claims).map((c) => c.eventId);

  const shown = new Set(onBoard.map((s) => s.eventId));
  const total = truth.events.filter(
    (e) =>
      shown.has(e.eventId) &&
      (e.verdict === 'malicious' || e.verdict === 'blocked-reconnaissance'),
  ).length;
  const caught = total - missed.length;

  const parts: string[] = [];
  parts.push(
    missed.length === 0
      ? `Every stage of the intrusion that reached a board was caught and read correctly, ${caught} of ${total}.`
      : `${caught} of ${total} stages caught. ${missed.length} went unread: ${missed.join(', ')}. ` +
        'An intrusion does not need every stage to be missed to succeed.',
  );
  if (withheld.length > 0) {
    parts.push(
      `${withheld.length} stage(s) never reached any console: ${withheld.join(', ')}. Nobody could ` +
        'have caught these and they are not counted against the floor. The question worth asking ' +
        'is whether anybody noticed the gap and said so.',
    );
  }

  return {
    scenarioId,
    whatHappened: truth.narrative,
    stages,
    missed,
    contested,
    withheld,
    summary: parts.join(' '),
  };
}

/**
 * Say how a claim was reached, without scoring it.
 *
 * The four score lines are blind to method. A correct dismissal reached in nine
 * seconds with no commands and one reached after checking the rule history are
 * the same disposition and the same number. This is the only place the
 * difference is visible, and it is the difference between a habit and a guess.
 *
 * Deliberately does not reward volume. Somebody who runs one precise grep has
 * investigated; somebody who runs nine has not necessarily investigated more.
 */
export function describeInvestigation(
  trace: InvestigationTrace,
  claim: Claim,
): InvestigationNote {
  const looked = trace.commandCount > 0 || trace.opened.length > 0;
  if (!looked) {
    const fast = trace.secondsSpent < 20;
    return {
      looked: false,
      note: fast
        ? 'Committed in under twenty seconds without opening any evidence. If the call was right, ' +
          'it was right by recognition rather than by checking, and recognition does not transfer ' +
          'to the scenario you have not seen.'
        : 'No evidence opened before committing. The disposition may be sound; nothing here shows ' +
          'how it was reached.',
    };
  }
  const where = trace.opened.length > 0 ? ` Opened: ${trace.opened.join(', ')}.` : '';
  return {
    looked: true,
    note:
      `Checked the evidence before committing: ${trace.commandCount} command(s) over ` +
      `${Math.round(trace.secondsSpent)}s.${where}`,
  };
}

/**
 * Score an ambiguous event, where there is no right disposition.
 *
 * WHY THIS IS SCORED AT ALL RATHER THAN SKIPPED
 *
 * The tempting alternative is to leave unknowable events unmarked. That teaches
 * the opposite of the intended lesson: an event that costs nothing is an event
 * a student learns to click past, and the whole reason it is here is that
 * real floors have to act on exactly this and cannot click past it.
 *
 * So it is marked, out of the same 40, on the two things that are actually
 * assessable when the answer is not: whether the confidence matches the
 * evidence, and whether they said what would have settled it. Either
 * disposition is fine. A seat that escalates at 40% and one that investigates
 * at 40% have both done the job.
 */
function scoreCalibration(claim: Claim, notes: string[]): number {
  const confidence = Math.max(0, Math.min(100, claim.confidence));
  let points: number;

  if (confidence > AMBIGUOUS_CONFIDENCE_CEILING) {
    // The expensive failure, and the one this event exists to catch. A tidy
    // story told confidently is what commits a floor to the wrong containment.
    const over = confidence - AMBIGUOUS_CONFIDENCE_CEILING;
    points = Math.max(4, 22 - Math.round(over * 0.45));
    notes.push(
      `Held at ${confidence}% on evidence that does not support it. This one could be argued ` +
        'either way, and stating it that firmly is how a floor commits to a story before the ' +
        'evidence has caught up.',
    );
  } else if (confidence < AMBIGUOUS_CONFIDENCE_FLOOR) {
    // The other failure, which is quieter and still a failure. A seat that will
    // not have a view leaves the decision with somebody who has less evidence.
    points = 20;
    notes.push(
      `Held at ${confidence}%, which reads as declining to have a view. Uncertainty is the right ` +
        'read here; refusing to commit to one still leaves the call with somebody holding less ' +
        'evidence than you.',
    );
  } else {
    points = 34;
    notes.push(
      `Correctly read as unsettled and held at ${confidence}%. Either disposition was defensible ` +
        'here; the confidence is what was being marked.',
    );
  }

  // Naming the missing evidence is what turns "nobody knows" into a request
  // somebody can action, so it is worth real points rather than a note.
  const namesWhatWouldSettleIt = /\b(if|would|need|until|once|unless|pending|await)\b/i.test(
    claim.reasoning,
  );
  if (namesWhatWouldSettleIt) {
    points = Math.min(40, points + 6);
    notes.push('Says what would change the assessment, which makes the uncertainty actionable.');
  } else {
    notes.push(
      'Does not say what would settle it. "I cannot tell" is an answer; "I cannot tell, and here ' +
        'is what I would need" is the useful one.',
    );
  }

  return points;
}

/**
 * Score one claim.
 *
 * Four lines out of 100. Accuracy carries the most weight because being wrong
 * about the threat is the failure that ends in a breach, but lane discipline is
 * weighted heavily enough that a floor of individually brilliant people who all
 * grab the same event cannot score well.
 */
export function scoreClaim(
  scenarioId: string,
  claim: Claim,
  trace?: InvestigationTrace,
): ClaimScore | null {
  const scenario = BY_ID.get(scenarioId);
  const truth = eventTruth(scenarioId, claim.eventId);
  if (!scenario || !truth) return null;

  const lines: ClaimScoreLine[] = [];
  let laneViolation: SocRoleId | null = null;

  // --- 1. accuracy, weighted by how confident they were -----------------
  const shouldTreatAsThreat =
    truth.verdict === 'malicious' || truth.verdict === 'blocked-reconnaissance';
  const calledItAThreat = treatsAsThreat(claim.disposition);
  const correct = calledItAThreat === shouldTreatAsThreat;
  const notes: string[] = [];

  // Confidence scales the result in both directions: conviction is rewarded
  // when it is earned and punished when it is not.
  const conviction = Math.max(0, Math.min(100, claim.confidence)) / 100;

  let accuracy: number;
  if (truth.verdict === 'ambiguous') {
    // Nothing to be right about. The evidence does not settle it, so the mark
    // is entirely on whether the confidence matches that, and the label says so
    // rather than pretending a correctness score was computed.
    accuracy = scoreCalibration(claim, notes);
  } else {
    accuracy = correct ? 25 + Math.round(conviction * 15) : Math.round((1 - conviction) * 14);
    if (correct) {
      notes.push(
        shouldTreatAsThreat
          ? 'Identified real malicious activity.'
          : 'Correctly declined to escalate something that did not warrant it.',
      );
      if (conviction < 0.5) notes.push('Right call, held with less confidence than it deserved.');
    } else {
      notes.push(
        shouldTreatAsThreat
          ? 'This was a genuine threat and the claim treated it as benign.'
          : 'This did not warrant escalation. Escalating everything is the same as triaging nothing.',
      );
      if (conviction > 0.7) notes.push('Held with high confidence, which is what makes it expensive.');
    }
  }

  // An empty justification cannot be assessed, whatever it concluded. This bites
  // hardest on an ambiguous event, where the reasoning IS the answer.
  if (claim.reasoning.trim().length < 40) {
    accuracy = Math.min(accuracy, 12);
    notes.push('Too short to show reasoning. A disposition without a why is not triage.');
  }
  lines.push({
    label: truth.verdict === 'ambiguous' ? 'Calibration' : 'Accuracy',
    points: accuracy,
    outOf: 40,
    notes,
  });

  // --- 2. role discipline ------------------------------------------------
  const roleNotes: string[] = [];
  let discipline = 0;
  const isFirstResponder = truth.firstResponder === claim.role;
  const isAlsoAppropriate = truth.alsoAppropriate.includes(claim.role);

  if (isFirstResponder) {
    discipline += 15;
    roleNotes.push('Correct seat to take this first.');
  } else if (isAlsoAppropriate) {
    discipline += 9;
    roleNotes.push(
      `Appropriate seat, but ${truth.firstResponder} should have had it first and escalated to you.`,
    );
    laneViolation = truth.firstResponder;
  } else {
    roleNotes.push(
      `This is not your event. ${truth.firstResponder} owns it. Working somebody else's queue leaves yours unwatched.`,
    );
    laneViolation = truth.firstResponder;
  }

  const overreach = claim.actionIds.filter((id) => truth.outOfLaneActions.includes(id));
  const inLane = claim.actionIds.filter((id) => truth.correctActions.includes(id));
  discipline += Math.min(10, inLane.length * 5);
  if (inLane.length > 0) roleNotes.push(`${inLane.length} action(s) correct for this seat.`);
  if (overreach.length > 0) {
    discipline = Math.max(0, discipline - overreach.length * 6);
    const labels = overreach
      .map((id) => scenario.actions.find((a) => a.id === id)?.label ?? id)
      .join('; ');
    roleNotes.push(`Doing another role's job: ${labels}.`);
  }
  lines.push({ label: 'Role discipline', points: Math.min(25, discipline), outOf: 25, notes: roleNotes });

  // --- 3. timing ---------------------------------------------------------
  const event = scenario.events.find((e) => e.id === claim.eventId)!;
  const waited = Math.max(0, claim.atSeconds - event.atSeconds);
  let timing: number;
  const timingNotes: string[] = [];
  if (waited <= CLAIM_GRACE_SECONDS) {
    timing = 15;
    timingNotes.push(`Claimed ${waited}s after it landed.`);
  } else if (waited >= CLAIM_LATE_SECONDS) {
    timing = 0;
    timingNotes.push(`Sat for ${Math.round(waited / 60)} minutes. The queue moved on without you.`);
  } else {
    const span = CLAIM_LATE_SECONDS - CLAIM_GRACE_SECONDS;
    timing = Math.round(15 * (1 - (waited - CLAIM_GRACE_SECONDS) / span));
    timingNotes.push(`Claimed after ${Math.round(waited / 60)} minutes.`);
  }
  lines.push({ label: 'Timing', points: timing, outOf: 15, notes: timingNotes });

  // --- 4. escalation -----------------------------------------------------
  const escNotes: string[] = [];
  let escalation = 0;
  if (truth.escalateTo.length === 0) {
    // Nothing to hand on. Not passing it anywhere is the right answer.
    escalation = claim.escalateTo === null ? 20 : 10;
    escNotes.push(
      claim.escalateTo === null
        ? 'Correctly stops here. Not everything needs passing on.'
        : 'Escalated something that ends with you, which costs somebody else a look.',
    );
  } else if (claim.escalateTo && truth.escalateTo.includes(claim.escalateTo)) {
    escalation = 20;
    escNotes.push(`Correctly handed to ${claim.escalateTo}.`);
  } else if (claim.escalateTo) {
    escalation = 6;
    escNotes.push(`Wrong next seat. This needed ${truth.escalateTo.join(' or ')}.`);
  } else {
    escNotes.push(`Not escalated. This needed ${truth.escalateTo.join(' or ')}.`);
  }
  lines.push({ label: 'Escalation', points: escalation, outOf: 20, notes: escNotes });

  const total = lines.reduce((sum, l) => sum + l.points, 0);
  return {
    eventId: claim.eventId,
    role: claim.role,
    lines,
    total,
    outOf: 100,
    laneViolation,
    ...(trace ? { investigation: describeInvestigation(trace, claim) } : {}),
    why: truth.why,
  };
}
