/**
 * Generates the AI copilot's analyses for every alert in the corpus.
 *
 * Run with:  npm run gen:copilot --workspace @soc/server
 * Output:    src/vfs/data/copilot.generated.ts  (committed to git)
 *
 * WHY THE COPILOT IS GENERATED AND COMMITTED
 *
 * Same reason as the logs and the alert corpus, plus one that is specific to
 * this file. Module 3.5 asks a student to catch the copilot being wrong. That
 * only works if it is wrong in a particular place, about a particular alert, in
 * a way somebody can be graded on noticing. A live model asked the same question
 * twice will not oblige, and an answer key that depends on what a model felt like
 * saying is not an answer key.
 *
 * So the copilot is content. Its mistakes are authored, deliberate, and diffable.
 *
 * WHY THE ANALYSIS IS DERIVED FROM GROUND TRUTH
 *
 * Every sound analysis recommends whatever `AlertTruth` says is correct. That is
 * not cheating -- it is what makes the copilot a *good* assistant, which is the
 * only setting in which blind trust is a tempting habit rather than an obviously
 * stupid one. A copilot that was wrong half the time would teach students to
 * ignore it, and ignoring it is not the skill either.
 *
 * The flaws below are then injected on top, against named signatures. Deriving
 * from truth also means a regenerated alert corpus regenerates coherent copilot
 * output rather than leaving the two quietly contradicting each other.
 *
 * WHY THE FLAWS ARE HAND-PICKED AND THE ANSWER KEYS ARE NOT
 *
 * "Compute expected answers, never hardcode them" is a rule about exercise
 * content, and it is upheld: no exercise names a flawed alert id. They ask the
 * flaw table which analyses mislead and derive the ids from that.
 *
 * Which signatures the copilot fails on is a different question -- that is
 * authoring, and pretending it emerged from a seed would only make it harder to
 * review. Each flaw below is declared against a signature and asserted to have
 * matched something, so a corpus change that strips a planted mistake fails this
 * script rather than silently producing a module nobody can pass.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type {
  Alert,
  AlertTruth,
  CopilotAnalysis,
  CopilotClaim,
  CopilotFlaw,
  CopilotFlawKind,
  TriageDecision,
} from '@soc/shared';

import { ALERT_QUEUES, ALERT_TRUTH } from '../src/vfs/data/alerts.generated.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = join(HERE, '..', 'src', 'vfs', 'data', 'copilot.generated.ts');

// --- deterministic randomness ------------------------------------------------

/** mulberry32, as in the other generators: stable across Node versions. */
function makeRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = makeRandom(20260904);

function between(min: number, max: number): number {
  return min + Math.floor(rand() * (max - min + 1));
}

// --- reading an alert --------------------------------------------------------

const observed = (text: string): CopilotClaim => ({ text, basis: 'observed' });
const inferred = (text: string): CopilotClaim => ({ text, basis: 'inferred' });
const assumed = (text: string): CopilotClaim => ({ text, basis: 'assumed' });

/** Hour of day in the simulated timezone, which the corpus records as UTC. */
function hourOf(alert: Alert): number {
  return Number(alert.raisedAt.slice(11, 13));
}

function clockOf(alert: Alert): string {
  return alert.raisedAt.slice(11, 16);
}

/** RFC 1918 space, which for this world means "inside Ridgeline". */
function isInternal(ip: string): boolean {
  return ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.16.');
}

/**
 * The share of this rule's firings that were closed as not worth acting on.
 *
 * Clamped at 1. The corpus counts firings over thirty days and dispositions over
 * a longer window, so the raw ratio can exceed one, and a copilot reporting
 * "122% of firings were noise" would be a bug students learn nothing from.
 */
function noiseRate(alert: Alert): number {
  const { priorFirings, priorFalsePositives } = alert.enrichment;
  if (priorFirings <= 0) return 0;
  return Math.min(1, priorFalsePositives / priorFirings);
}

function pct(value: number): string {
  return `${Math.round(value * 100)}%`;
}

// --- the sound analysis ------------------------------------------------------

/**
 * What the copilot notices pointing towards a threat.
 *
 * Assembled from the alert's own fields rather than from the verdict, so the
 * risk factors on a benign alert read exactly like the risk factors on a real
 * one. That similarity is the point: if the copilot's prose gave away the answer,
 * a student could triage the queue by reading its tone.
 */
function riskFactorsFor(alert: Alert): CopilotClaim[] {
  const claims: CopilotClaim[] = [];
  const hour = hourOf(alert);

  if (alert.enrichment.reputation === 'known-malicious') {
    claims.push(observed(`The external address is on a threat feed: ${alert.enrichment.reputationNote ?? 'no note supplied'}.`));
  } else if (alert.enrichment.reputation === 'suspicious') {
    claims.push(observed('The external address carries a suspicious reputation verdict.'));
  }

  if (alert.to?.port === 22 || alert.to?.port === 3389) {
    claims.push(observed(`Remote-access port ${alert.to.port} is involved, which is where account compromise usually lands first.`));
  }

  if (hour < 6 || hour >= 21) {
    claims.push(observed(`Raised at ${clockOf(alert)}, outside ordinary working hours.`));
  }

  if (alert.severity === 'critical' || alert.severity === 'high') {
    claims.push(observed(`The rule asserted ${alert.severity} severity at ${alert.confidence}% confidence.`));
  }

  if (alert.enrichment.allowlisted === false) {
    claims.push(observed('The destination is not on the egress allowlist.'));
  }

  if (alert.enrichment.priorFirings > 0 && noiseRate(alert) < 0.5) {
    claims.push(
      inferred(
        `This rule has fired ${alert.enrichment.priorFirings} times and only ${alert.enrichment.priorFalsePositives} ` +
          'were closed as noise, so its firings are usually worth reading.',
      ),
    );
  }

  if (alert.from.user && !isInternal(alert.from.ip)) {
    claims.push(observed(`The activity is attributed to account "${alert.from.user}" from an external address.`));
  }

  if (claims.length === 0) {
    claims.push(observed(`The rule "${alert.ruleName}" fired, which is by definition activity somebody thought worth detecting.`));
  }
  return claims;
}

/** What the copilot notices pointing away from a threat. */
function mitigatingFactorsFor(alert: Alert): CopilotClaim[] {
  const claims: CopilotClaim[] = [];

  if (alert.enrichment.reputation === 'known-good') {
    claims.push(observed(`Reputation is known-good: ${alert.enrichment.reputationNote ?? 'recognised asset'}.`));
  }
  if (alert.enrichment.allowlisted === true) {
    claims.push(observed('The destination is on the organisation’s egress allowlist.'));
  }
  if (isInternal(alert.from.ip)) {
    claims.push(observed(`The source ${alert.from.ip} is internal address space, not the public internet.`));
  }
  if (noiseRate(alert) >= 0.8 && alert.enrichment.priorFirings >= 20) {
    claims.push(
      observed(
        `This rule has fired ${alert.enrichment.priorFirings.toLocaleString()} times in thirty days and ` +
          `${pct(noiseRate(alert))} of those were closed as not worth acting on.`,
      ),
    );
  }
  if (claims.length === 0) {
    claims.push(inferred('Nothing on the alert argues against it, which is not the same as evidence that it is real.'));
  }
  return claims;
}

const HEADLINES: Record<TriageDecision, string> = {
  escalate: 'I read this as genuine attacker activity. It should go to a second analyst now.',
  investigate: 'I cannot settle this from the alert alone. It needs a look before it is closed.',
  dismiss: 'I read this as a correct detection of ordinary activity. I would close it.',
  tune: 'The detection is correct and the rule is the problem. Close it, and fix what generates it.',
};

function nextStepsFor(alert: Alert, decision: TriageDecision): string[] {
  switch (decision) {
    case 'escalate':
      return [
        `Confirm what account "${alert.from.user ?? 'the source'}" touched after ${clockOf(alert)}.`,
        `Check whether ${alert.from.ip} appears anywhere else in the shift.`,
        'Hand over with the timeline attached, not just the alert id.',
      ];
    case 'investigate':
      return [
        'Pull the surrounding log lines rather than deciding from the summary.',
        'Ask whether a change record or scheduled job explains the timing.',
      ];
    case 'tune':
      return [
        `Raise a ticket against rule "${alert.ruleId}" rather than closing these one at a time.`,
        `Propose a scoped exclusion for ${alert.from.host ?? alert.from.ip}, not a rule deletion.`,
      ];
    case 'dismiss':
    default:
      return [
        'Close with a one-line disposition note saying what explained it.',
        'No further action; the control behaved as designed.',
      ];
  }
}

/**
 * What the copilot says it could not see.
 *
 * Always present, always shown, and deliberately accurate. Most copilot mistakes
 * in the wild are context failures rather than reasoning failures, and a student
 * who reads these lines has been handed the shape of every mistake in this file
 * before making one.
 */
function limitsFor(alert: Alert): string[] {
  const limits = [
    'I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.',
  ];
  if (alert.from.user) {
    limits.push(`I do not know whether "${alert.from.user}" is a person, a service account, or a shared credential.`);
  }
  limits.push('I have not read the other alerts in this queue, so I cannot tell you what this correlates with.');
  return limits;
}

function soundAnalysis(alert: Alert, truth: AlertTruth): CopilotAnalysis {
  return {
    alertId: alert.id,
    headline: HEADLINES[truth.correctDecision],
    riskFactors: riskFactorsFor(alert),
    mitigatingFactors: mitigatingFactorsFor(alert),
    recommendation: truth.correctDecision,
    // Uncorrelated with correctness, on purpose. See the note on the field.
    confidence: between(58, 94),
    nextSteps: nextStepsFor(alert, truth.correctDecision),
    limits: limitsFor(alert),
  };
}

// --- the planted flaws -------------------------------------------------------

interface FlawPlan {
  kind: CopilotFlawKind;
  misleads: boolean;
  /** Human-readable description of what this targets, for the run summary. */
  targets: string;
  /** Which alerts this applies to. Matched against the alert and its truth. */
  applies: (alert: Alert, truth: AlertTruth) => boolean;
  /** Rewrite the sound analysis into the flawed one. */
  spoil: (alert: Alert, truth: AlertTruth, sound: CopilotAnalysis) => CopilotAnalysis;
  /** The debrief text, released only after the student commits. */
  why: (alert: Alert, truth: AlertTruth) => string;
}

const FLAWS: FlawPlan[] = [
  /*
   * 1. The base-rate trap.
   *
   * The copilot's observation is TRUE -- this rule really has been wrong 331
   * times out of 340 -- and the inference from it is catastrophic. Base rates
   * describe populations; a disposition is about one instance, and the
   * instance-specific evidence here outweighs the prior comfortably.
   *
   * This is the most dangerous real failure mode of an AI assistant in a SOC,
   * because the same argument is correct almost every other time it is made. A
   * student who learns to distrust base rates entirely has learned the wrong
   * lesson too, which is why only two alerts in the corpus are treated this way.
   */
  {
    kind: 'volume-dismissal',
    misleads: true,
    targets: 'escalation-worthy alerts from rules with a long history of being noise',
    applies: (alert, truth) =>
      truth.correctDecision === 'escalate' &&
      alert.enrichment.priorFirings >= 100 &&
      noiseRate(alert) >= 0.9,
    spoil: (alert, _truth, sound) => ({
      ...sound,
      headline: `This rule is wrong almost every time it fires. On the history alone I would close this one too.`,
      recommendation: 'dismiss',
      confidence: between(84, 91),
      riskFactors: [
        observed(`The rule "${alert.ruleName}" fired at ${clockOf(alert)}.`),
      ],
      mitigatingFactors: [
        observed(
          `${alert.enrichment.priorFalsePositives.toLocaleString()} of this rule’s last ` +
            `${alert.enrichment.priorFirings.toLocaleString()} firings were closed as not worth acting on.`,
        ),
        inferred(
          `At a ${pct(noiseRate(alert))} historical noise rate, the prior probability that this ` +
            'particular firing is real is very low.',
        ),
        assumed('Nothing here looks different from the firings that were closed before.'),
      ],
      nextSteps: [
        `Close it, and consider raising a tuning ticket against "${alert.ruleId}" if the volume is a burden.`,
      ],
    }),
    why: (alert) =>
      `The copilot told you to close this one, and the number it quoted was real: ${alert.enrichment.priorFalsePositives.toLocaleString()} ` +
      `of ${alert.enrichment.priorFirings.toLocaleString()} firings were noise. The reasoning is where it fails. A base rate describes ` +
      'a population; you are dispositioning one instance, and the evidence on this instance -- the account, the hour, and what it ' +
      'touched -- is what overrides the prior. This is the most dangerous thing an assistant can say to you, precisely because the ' +
      'same sentence is correct almost every other time. Read the last line it wrote: "nothing here looks different". It had not ' +
      'looked. It has no access to the rest of the shift and told you so in its own limits section.',
  },

  /*
   * 2. Over-escalation on documented, routine, privileged activity.
   *
   * The spec's finance-director-checking-crypto case, transplanted onto the two
   * signatures in this corpus that carry the same shape: an administrator doing
   * their job, and a backup service account doing its job on schedule.
   *
   * The tell is the discounting move. The copilot LISTS the mitigating fact and
   * then talks itself past it with a claim it has no basis for -- "allowlists are
   * frequently stale". That sentence is how over-escalation actually reads.
   */
  {
    kind: 'over-escalation',
    misleads: true,
    targets: 'routine privileged and service-account activity that is already explained',
    applies: (alert, truth) =>
      truth.correctDecision === 'dismiss' &&
      truth.verdict === 'benign_true_positive' &&
      (alert.ruleId === 'sudo-privileged-command' || alert.ruleId === 'auth-service-account-login'),
    spoil: (alert, _truth, sound) => ({
      ...sound,
      headline: 'Privileged activity I cannot tie to an approved change. I would escalate this.',
      recommendation: 'escalate',
      confidence: between(80, 89),
      riskFactors: [
        observed(
          `Privileged action by "${alert.from.user ?? 'an unnamed account'}" on ${alert.to?.host ?? alert.from.host ?? 'the host'} at ${clockOf(alert)}.`,
        ),
        inferred('Attackers who obtain credentials use them to do exactly this, and it looks identical from the log.'),
        assumed('I see no approved change record covering this window.'),
      ],
      mitigatingFactors: [
        ...sound.mitigatingFactors.slice(0, 1),
        assumed(
          'That reputation and allowlist status are worth something, though inventory records and ' +
            'allowlists are frequently stale and should not carry a disposition on their own.',
        ),
      ],
      nextSteps: [
        'Escalate to tier two and ask them to confirm the activity with the account owner.',
        'Consider disabling the account until somebody confirms it.',
      ],
    }),
    why: (alert) =>
      `The copilot recommended escalating ${alert.summary.toLowerCase()}. Everything it observed was true and its conclusion was ` +
      'still wrong, because the thing that settles this alert is not on the alert: this is a documented, recurring, authorised ' +
      'activity, and knowing that is what you have that the copilot does not. Notice the move it made -- it named the mitigating ' +
      'evidence and then discounted it with "allowlists are frequently stale", which is a general truth deployed as if it were a ' +
      'finding about this record. It also asserted "I see no approved change record", and it cannot see change records at all; it ' +
      'says so in its own limits. An assistant reporting the absence of something it cannot observe is reporting nothing.',
  },

  /*
   * 3. A correct recommendation resting on an invented rationale.
   *
   * This flaw does NOT mislead, and that is deliberate. If every bad analysis
   * also carried a bad recommendation, "spot the flawed one" would collapse into
   * "notice which ones I disagreed with", and a student could clear the module
   * without reading a rationale.
   *
   * The tell is checkable from the fiction itself: Ridgeline Medical Group is a
   * healthcare provider, and the copilot has attributed the intrusion to a
   * campaign it describes as targeting financial services. The claim is also
   * marked `assumed`, which is the training-wheels version of a tell -- real
   * assistants do not annotate their own inventions.
   */
  {
    kind: 'fabricated-attribution',
    misleads: false,
    targets: 'the credential-pivot alert, where the right call is reached by invented reasoning',
    applies: (alert, truth) =>
      truth.correctDecision === 'escalate' && alert.ruleId === 'auth-success-after-failures',
    spoil: (alert, _truth, sound) => ({
      ...sound,
      headline: 'This matches a known intrusion set. Escalate immediately.',
      confidence: between(88, 95),
      riskFactors: [
        ...sound.riskFactors,
        assumed(
          'The sequence matches APT28 tradecraft catalogued in campaigns against financial services ' +
            'during the same period, including the interval between the failures and the success.',
        ),
        assumed(`Infrastructure overlapping ${alert.from.ip} has been reported in prior activity by the same actor.`),
      ],
      nextSteps: [
        'Escalate as a suspected nation-state intrusion and reference the actor in the handover.',
        ...sound.nextSteps.slice(0, 1),
      ],
    }),
    why: (alert) =>
      `The copilot was right about ${alert.id}: this is the credential pivot and it warranted escalation. Read why it said so. It ` +
      'attributed the activity to a named actor, cited campaigns against financial services, and claimed prior reporting on the ' +
      'source address. Ridgeline Medical Group is a healthcare provider, no threat-intelligence source was attached to this alert, ' +
      'and nothing in the enrichment mentions an actor at all. Every one of those sentences was generated, not retrieved. ' +
      'Escalating with an actor name in the handover is worse than escalating without one: the next analyst inherits your ' +
      'attribution as a fact and scopes the incident around it. Right answer, invented reasons -- and you cannot tell the ' +
      'difference from the recommendation alone, which is the whole reason to read the reasoning.',
  },

  /*
   * 4. Sound recommendation, unworkable suggestion.
   *
   * The spec's "monitor for unusual system calls" case, at the operator's end of
   * it. Tuning this rule is correct. The second step the copilot proposes --
   * baseline everything and alert on deviation -- is the single most common
   * unworkable suggestion in detection, and it reads as sophisticated, which is
   * exactly why it keeps getting built.
   *
   * Attached to the highest-population signature in the corpus on purpose: a
   * student meets this one seventy-nine times, and the lesson is that a
   * suggestion does not become workable through repetition.
   */
  {
    kind: 'unworkable-advice',
    misleads: false,
    targets: 'the monitoring host’s failed logins, where the tuning advice would flood the queue',
    applies: (alert, truth) =>
      truth.correctDecision === 'tune' && alert.ruleId === 'auth-failed-password',
    spoil: (_alert, _truth, sound) => ({
      ...sound,
      confidence: between(76, 88),
      nextSteps: [
        ...sound.nextSteps,
        'Longer term, baseline normal authentication behaviour for every host and raise an alert on ' +
          'any deviation from that baseline, which will catch this class of problem generically.',
      ],
    }),
    why: () =>
      'The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last ' +
      'suggestion is the one to argue with. "Baseline normal behaviour and alert on any deviation" is the most common unworkable ' +
      'proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation ' +
      'alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is ' +
      'why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket ' +
      'to fix the stale credential that is actually causing this.',
  },
];

// --- assembly ----------------------------------------------------------------

const truthById = new Map(ALERT_TRUTH.map((truth) => [truth.alertId, truth]));

const analyses: CopilotAnalysis[] = [];
const flaws: CopilotFlaw[] = [];

/** Per-plan match counts, so an unmatched plan can fail the run. */
const matched = new Map<FlawPlan, number>(FLAWS.map((plan) => [plan, 0]));
/** Per-queue tallies for the run summary. */
const perQueue = new Map<string, { alerts: number; flawed: number; misleading: number }>();

for (const queue of ALERT_QUEUES) {
  const tally = { alerts: 0, flawed: 0, misleading: 0 };

  for (const alert of queue.alerts) {
    const truth = truthById.get(alert.id);
    if (!truth) {
      throw new Error(
        `Alert "${alert.id}" has no ground-truth entry, so no analysis can be derived for it. ` +
          'Re-run gen:alerts before gen:copilot.',
      );
    }
    tally.alerts += 1;

    // An alert appears in more than one queue, and must get the same analysis
    // in each. Anything else would let a student diff two views of one alert to
    // find the seam.
    if (analyses.some((existing) => existing.alertId === alert.id)) continue;

    const sound = soundAnalysis(alert, truth);
    const plan = FLAWS.find((candidate) => candidate.applies(alert, truth));

    if (!plan) {
      analyses.push(sound);
      continue;
    }

    matched.set(plan, (matched.get(plan) ?? 0) + 1);
    analyses.push(plan.spoil(alert, truth, sound));
    flaws.push({
      alertId: alert.id,
      kind: plan.kind,
      misleads: plan.misleads,
      why: plan.why(alert, truth),
    });
    tally.flawed += 1;
    if (plan.misleads) tally.misleading += 1;
  }

  perQueue.set(queue.id, tally);
}

/*
 * A plan that matched nothing means the alert corpus moved out from under a
 * planted mistake. Module 3.5 grades students on catching that mistake, so the
 * correct response is to fail this script rather than emit a corpus in which the
 * exercise is unpassable.
 */
for (const [plan, count] of matched) {
  if (count === 0) {
    throw new Error(
      `Flaw plan "${plan.kind}" (${plan.targets}) matched no alerts. The alert corpus and the ` +
        'copilot flaw plan have drifted apart -- fix the predicate or the corpus, but do not ship ' +
        'an exercise whose planted mistake is not there.',
    );
  }
}

/*
 * Every misleading analysis must actually disagree with the truth, and every
 * non-misleading one must agree with it. Getting this backwards would score
 * students against a flaw table that does not describe the analyses shipped.
 */
const analysisById = new Map(analyses.map((analysis) => [analysis.alertId, analysis]));
for (const flaw of flaws) {
  const recommendation = analysisById.get(flaw.alertId)!.recommendation;
  const correct = truthById.get(flaw.alertId)!.correctDecision;
  if (flaw.misleads !== (recommendation !== correct)) {
    throw new Error(
      `Flaw on "${flaw.alertId}" claims misleads=${flaw.misleads} but recommends "${recommendation}" ` +
        `against a correct disposition of "${correct}".`,
    );
  }
}

// --- emit --------------------------------------------------------------------

function literal(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

const misleadingCount = flaws.filter((flaw) => flaw.misleads).length;

const banner = `/**
 * GENERATED FILE -- DO NOT EDIT BY HAND.
 *
 * Produced by scripts/generate-copilot.ts. To change what the copilot says, edit
 * that script and re-run:  npm run gen:copilot --workspace @soc/server
 *
 * Committed on purpose: Module 3.5's expected answers are computed from the flaw
 * table below, so it must not change unless somebody intends it to.
 *
 * COPILOT_FLAWS IS AN ANSWER KEY. It must never be sent to the browser. A
 * student who can read it knows which suggestions to distrust without reading
 * one of them, which is the entire skill the module exists to teach. The only
 * code permitted to build a client response from this file is the copilot
 * service, which reads COPILOT_ANALYSES and never assembles COPILOT_FLAWS into
 * anything before decisions are committed.
 */

import type { CopilotAnalysis, CopilotFlaw } from '@soc/shared';
`;

const body = `${banner}
/** One analysis per alert: ${analyses.length} in total. */
export const COPILOT_ANALYSES: CopilotAnalysis[] = ${literal(analyses)};

/**
 * The answer key: ${flaws.length} flawed analyses, of which ${misleadingCount} carry a wrong
 * recommendation. Server-side only -- see the warning above.
 */
export const COPILOT_FLAWS: CopilotFlaw[] = ${literal(flaws)};
`;

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, body, 'utf8');

const byKind = new Map<CopilotFlawKind, number>();
for (const flaw of flaws) byKind.set(flaw.kind, (byKind.get(flaw.kind) ?? 0) + 1);

process.stdout.write(
  [
    `Wrote ${OUT_FILE}`,
    `  ${analyses.length} analyses, ${flaws.length} flawed (${misleadingCount} with a wrong recommendation)`,
    '',
    '  by flaw kind:',
    ...[...byKind.entries()].map(
      ([kind, count]) =>
        `    ${kind.padEnd(24)} ${String(count).padStart(3)} alerts` +
        `  ${FLAWS.find((plan) => plan.kind === kind)!.misleads ? 'MISLEADS' : 'reasoning only'}`,
    ),
    '',
    '  by queue:',
    ...[...perQueue.entries()].map(
      ([id, tally]) =>
        `    ${id.padEnd(16)} ${String(tally.alerts).padStart(4)} alerts` +
        `  flawed=${tally.flawed}` +
        `  misleading=${tally.misleading}`,
    ),
    '',
  ].join('\n'),
);
