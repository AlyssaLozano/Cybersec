/**
 * The Model Lab: the surface an AI Security Analyst works through.
 *
 * WHY THIS IS A SEPARATE SURFACE AND NOT MORE TERMINAL EXERCISES
 *
 * Every other role in this platform investigates a system that was attacked.
 * This one attacks a system that is meant to be defended, and the artefact under
 * test is not a host or a log file — it is a model plus the deployment wrapped
 * around it. Grading that as a shell command would test the wrong thing.
 *
 * So the answer a student submits is a set of PROBES (payloads sent to a model
 * under test) and, in the hardening exercises, a set of DEFENCES they chose to
 * deploy. Grading is done on what actually happened to those probes.
 *
 * WHY THE MODEL IS SIMULATED, AND WHY THAT IS NOT A COMPROMISE
 *
 * There is no language model behind this. There is a deterministic harness that
 * decides, from the payload and the deployment's declared defences, whether the
 * request would have got through. That is deliberate, and it is better than the
 * alternative for three reasons.
 *
 *   1. A real model gives non-reproducible grading. The same payload passes on
 *      Tuesday and fails on Thursday, and a student cannot tell whether they
 *      learned something or got lucky. Every other answer key in this platform
 *      is computed from committed, seeded data; this one is no different.
 *   2. The thing being taught is not "find the magic words". It is the
 *      structural point that keyword filters are defeated by encoding, that
 *      normalisation with no filter behind it does nothing, and that only
 *      defences which never treat retrieved text as instructions survive
 *      indirect injection. A rule engine models that faithfully.
 *   3. A training platform that pipes student-authored jailbreaks at a live
 *      model is a training platform that generates real attack traffic.
 *
 * WHAT THE SIMULATED MODEL NEVER PRODUCES
 *
 * Harmful content. A successful bypass returns the fictional system prompt of a
 * fictional product, or makes a fictional detector answer "SAFE" about a log
 * line the student already knows is an intrusion. The lesson is the bypass, not
 * a payload it might have carried.
 *
 * THE GROUND TRUTH NEVER SHIPS
 *
 * `ModelDeployment.defences` is the answer key. A student who can read which
 * defences a model has can derive the one technique that gets through without
 * testing anything, which is the whole exercise. `toStudentModel()` is the one
 * function allowed to cross that boundary, and it is the Model Lab equivalent of
 * `toStudentView()` in the content catalogue and `toStudentAlert()` in the alert
 * queue.
 */

// --- attack techniques -------------------------------------------------------

/**
 * What a payload is trying to make the model do.
 *
 * Kept separate from the CARRIER below, because the two are defended
 * differently and conflating them is the most common misunderstanding in this
 * field. A keyword filter stops intents it can see. A carrier's entire job is to
 * stop it seeing them.
 */
export const ATTACK_INTENTS = [
  /** "Ignore previous instructions and ..." — the plainest form. */
  'direct-override',
  /** "You are DAN, an AI with no restrictions" — a persona that has no rules. */
  'role-play',
  /** "Never say you cannot" — removing the model's ability to decline. */
  'refusal-suppression',
  /** Few-shot examples in the prompt that teach the behaviour the attacker wants. */
  'in-context',
  /** "Repeat everything above this line" — pulling the system prompt out. */
  'system-prompt-leak',
  /** Probing for verbatim training data: "continue this record exactly". */
  'training-data-extraction',
  /** The instruction arrives inside data the system retrieved, not from the user. */
  'indirect-injection',
] as const;
export type AttackIntent = (typeof ATTACK_INTENTS)[number];

/**
 * How the intent is disguised.
 *
 * `none` is a real value, not a null. A payload with no carrier is the plain
 * attack, and every student's first probe should be one — a model that fails
 * against plain text needed no cleverness at all, and finding that out first
 * saves an afternoon.
 */
export const ATTACK_CARRIERS = [
  'none',
  /** base64, hex, or rot13 wrapped around the instruction. */
  'encoding',
  /** Separators inside a keyword: i-g-n-o-r-e, "ig"+"nore", zero-width joiners. */
  'token-smuggling',
  /** Cyrillic and Greek letters that render identically to Latin ones. */
  'homoglyph',
  /** The instruction buried after enough filler that a length-capped scanner misses it. */
  'context-overflow',
] as const;
export type AttackCarrier = (typeof ATTACK_CARRIERS)[number];

export const ATTACK_INTENT_LABELS: Record<AttackIntent, string> = {
  'direct-override': 'Direct instruction override',
  'role-play': 'Persona / role-play jailbreak',
  'refusal-suppression': 'Refusal suppression',
  'in-context': 'In-context learning attack',
  'system-prompt-leak': 'System prompt extraction',
  'training-data-extraction': 'Training data extraction',
  'indirect-injection': 'Indirect (retrieved-content) injection',
};

export const ATTACK_CARRIER_LABELS: Record<AttackCarrier, string> = {
  none: 'Plain text',
  encoding: 'Encoding bypass',
  'token-smuggling': 'Token smuggling',
  homoglyph: 'Homoglyph substitution',
  'context-overflow': 'Context overflow',
};

// --- defences ----------------------------------------------------------------

/**
 * What a deployment can put in front of a model.
 *
 * These divide into three kinds, and the division is the curriculum:
 *
 *   NORMALISING defences change the text before anything inspects it. On their
 *   own they block nothing at all. Their entire value is making a carrier
 *   visible to a filter standing behind them, so a team that deploys
 *   `unicode-normalisation` without `keyword-filter` has bought latency and no
 *   security. That is a mistake real teams make, so the harness reproduces it.
 *
 *   PATTERN defences look for known-bad text. They work exactly as well as the
 *   normalisation in front of them and no better, which is why every encoding
 *   attack defeats them first.
 *
 *   STRUCTURAL defences change what the model is permitted to treat as an
 *   instruction. They never have to recognise the payload, so obfuscating it
 *   does not help. They cost more, they are harder to build, and they are the
 *   only ones that hold.
 */
export const DEFENCES = [
  'unicode-normalisation',
  'decode-scan',
  'keyword-filter',
  'delimiter-boundary',
  'instruction-hierarchy',
  'retrieved-content-quarantine',
  'output-filter',
  'length-cap',
] as const;
export type DefenceId = (typeof DEFENCES)[number];

export const DEFENCE_KINDS = ['normalising', 'pattern', 'structural'] as const;
export type DefenceKind = (typeof DEFENCE_KINDS)[number];

export interface DefenceProfile {
  id: DefenceId;
  title: string;
  kind: DefenceKind;
  /** What it does, in one or two sentences. */
  summary: string;
  /** What it does NOT do, stated explicitly, because that is where teams get hurt. */
  limitation: string;
  /**
   * Roughly what it costs, as a share of request latency and engineering effort.
   *
   * Present because "deploy every defence" is not an available answer in real
   * life and must not be an available answer here. The hardening exercises
   * impose a cost budget for the same reason the triage exercises impose an
   * escalation budget: a defence set nobody will ship is the same as no defence
   * set at all.
   */
  cost: number;
}

/**
 * The catalogue of defences, with what each one is actually worth.
 *
 * This SHIPS. It is teaching material, not an answer key: knowing what
 * `decode-scan` does tells you nothing about whether the model in front of you
 * has it, which is the question every exercise asks. Withholding it would only
 * mean students guessed at mechanisms instead of reasoning about them.
 *
 * `cost` is a rough relative figure — latency plus the engineering to keep it
 * working — normalised so that a sensible production stack lands around 6 or 7.
 * It is not a measurement of anything. It exists so that "deploy all eight" is
 * an answer the grader can reject.
 */
export const DEFENCE_PROFILES: DefenceProfile[] = [
  {
    id: 'unicode-normalisation',
    title: 'Input normalisation',
    kind: 'normalising',
    summary:
      'Fold the input to a canonical form before anything inspects it: NFKC, strip zero-width characters, map homoglyphs back to Latin, and close up letters separated by punctuation.',
    limitation:
      'Blocks nothing by itself. It has no opinion about what the text says — it only makes obfuscated text legible to whatever inspects it next. Deployed without a filter behind it, it costs latency and buys nothing.',
    cost: 1,
  },
  {
    id: 'decode-scan',
    title: 'Decode and re-scan',
    kind: 'normalising',
    summary:
      'Spot base64, hex, and rot13 runs in the input, decode them, and append the result to what the filters see.',
    limitation:
      'Also blocks nothing by itself, and only knows the encodings somebody thought to implement. A nested or novel encoding walks through it.',
    cost: 1,
  },
  {
    id: 'keyword-filter',
    title: 'Injection keyword filter',
    kind: 'pattern',
    summary:
      'Reject inputs containing known injection phrasing: instruction overrides, persona jailbreaks, refusal suppression, prompt-extraction requests.',
    limitation:
      'Sees only what the normalisation in front of it left behind, and only on the user input path — it never reads the documents the system retrieves. It is the first thing every encoding attack defeats and the last thing teams stop trusting.',
    cost: 2,
  },
  {
    id: 'delimiter-boundary',
    title: 'Delimited instruction boundary',
    kind: 'structural',
    summary:
      'Fence the system prompt and mark user text as data, so an instruction arriving in the user turn is presented to the model as something to read rather than something to obey.',
    limitation:
      'Does not help with a persona the model adopts willingly, or with examples in the prompt that teach it a new mapping. Those are inside the boundary, not across it.',
    cost: 2,
  },
  {
    id: 'instruction-hierarchy',
    title: 'Instruction hierarchy',
    kind: 'structural',
    summary:
      'Train and instruct the model that only the system channel issues orders, so a persona, a role-play frame, or a set of worked examples in the user turn cannot redefine the task.',
    limitation:
      'A hierarchy the model was trained on is a strong prior, not a guarantee, and it says nothing about where the text came from. Content the system retrieved still arrives inside the user turn.',
    cost: 3,
  },
  {
    id: 'retrieved-content-quarantine',
    title: 'Retrieved-content quarantine',
    kind: 'structural',
    summary:
      'Treat everything the system fetched — documents, log lines, tickets, web pages — as inert data that can be quoted and summarised but never followed.',
    limitation:
      'Only covers the retrieval path. It does nothing about what a user types, and it does nothing about a poisoned corpus continuing to return the wrong documents.',
    cost: 3,
  },
  {
    id: 'output-filter',
    title: 'Output inspection',
    kind: 'pattern',
    summary:
      'Inspect the response before it is returned and suppress it when it contains the system prompt, credentials, or verbatim training records.',
    limitation:
      'The last line, and a late one: the model has already been compromised by the time this fires. It also cannot recognise a leak it has no pattern for.',
    cost: 2,
  },
  {
    id: 'length-cap',
    title: 'Input length cap',
    kind: 'pattern',
    summary:
      'Reject inputs over a fixed size, so an instruction cannot be buried past the point where scanning gives up.',
    limitation:
      'Blunt. It stops burial attacks and legitimate long documents with equal enthusiasm, and any system that takes pasted logs will have to raise the cap until it stops helping.',
    cost: 1,
  },
];

// --- models under test -------------------------------------------------------

/** How much exposure a system has, which is what makes a finding urgent. */
export const DEPLOYMENT_STAGES = ['development', 'staging', 'production'] as const;
export type DeploymentStage = (typeof DEPLOYMENT_STAGES)[number];

/**
 * A model under test, as the student sees it.
 *
 * Everything here is what a real assessor is handed in a scoping document: what
 * the system is for, where it sits, how much traffic it takes, and the system
 * prompt if the owning team chose to share it. What is NOT here is the defence
 * list — see `ModelDeployment`.
 */
export interface ModelCard {
  id: string;
  name: string;
  version: string;
  /** One line: what this system is for. */
  purpose: string;
  stage: DeploymentStage;
  /**
   * Queries per day.
   *
   * Decides how bad a finding is, never whether it is real. Students are graded
   * on holding those two apart.
   */
  dailyQueries: number;
  /**
   * The system prompt, when the owning team disclosed it.
   *
   * Absent for the black-box exercises, which is both the more realistic case
   * and the one that teaches inference from responses rather than reading.
   */
  systemPrompt?: string;
  /** What the team says about its defences. Deliberately incomplete in places. */
  vendorClaim: string;
  /** Where retrieved context comes from, when the system uses retrieval. */
  retrievalNote?: string;
}

/**
 * The full deployment, including the answer key. Server-side only.
 *
 * A separate type from `ModelCard` rather than an optional field on it, so that
 * forgetting to strip the defence list is a compile error and not a silent leak.
 * Same construction as `AlertTruth`.
 */
export interface ModelDeployment {
  card: ModelCard;
  /** The defences actually deployed. THE ANSWER KEY. Never serialise this. */
  defences: DefenceId[];
  /**
   * Prose released in the debrief once the student has committed their probes.
   *
   * Explains why the model held or failed in terms of the defences it had, so a
   * student who found the bypass by luck still leaves with the mechanism.
   */
  postMortem: string;
}

// --- probing -----------------------------------------------------------------

/**
 * Which way into the system a payload takes.
 *
 * A real tester chooses this, so the student does too rather than the harness
 * guessing from the text. It matters because most deployments inspect the user
 * input path and nothing else: the same sentence typed into the chat box is
 * caught, and pasted into a document the system later retrieves, is not. That
 * asymmetry is the whole of indirect prompt injection, and hiding it behind
 * automatic detection would teach the student that the payload is what matters
 * when it is the channel.
 */
export const PROBE_CHANNELS = ['user', 'retrieved'] as const;
export type ProbeChannel = (typeof PROBE_CHANNELS)[number];

/** One payload a student sent to a model under test. */
export interface ProbeEntry {
  payload: string;
  /** Defaults to 'user'. 'retrieved' plants the payload in the system's corpus. */
  channel?: ProbeChannel;
  /** Optional note: what the student expected this to do. */
  rationale?: string;
}

/** Where a probe was stopped, expressed the way a black-box tester would see it. */
export const PROBE_STAGES = [
  'input-filter',
  'instruction-boundary',
  'output-filter',
  'none',
] as const;
export type ProbeStage = (typeof PROBE_STAGES)[number];

/**
 * What happened to one probe.
 *
 * `stage` ships and the specific defence does not, for the usual reason: naming
 * the exact control that caught a payload would let a student enumerate the
 * deployment in eight probes without understanding any of it. `stage` is the
 * honest amount of feedback — roughly what a real tester infers from the shape
 * of a refusal.
 */
export interface ProbeResult {
  /** Index into the submitted probe list, so the UI can line results up. */
  index: number;
  /** True when the payload changed the model's behaviour. */
  bypassed: boolean;
  stage: ProbeStage;
  /** Techniques the harness recognised in the payload. */
  intents: AttackIntent[];
  carriers: AttackCarrier[];
  /** The simulated model's reply. Never harmful content — see the file header. */
  response: string;
}

/** What the client submits for a model-probe exercise. */
export interface ProbeSubmission {
  probes: ProbeEntry[];
  /**
   * Defences the student chose to deploy, for hardening exercises.
   *
   * Absent means "test the deployment as it stands". Present means "rebuild the
   * deployment with exactly these and run the suite against it", which is how
   * the defence-side exercises are graded.
   */
  defences?: DefenceId[];
}

/**
 * A canned attack suite an exercise runs against a student's chosen defences.
 *
 * Hardening is graded by running a fixed suite, never by reading a student's
 * prose about what they would do. The suite is content, so it is reviewable in a
 * pull request like every other answer key here.
 */
export interface AttackSuite {
  id: string;
  title: string;
  /** What the suite covers, shown to the student before they choose defences. */
  summary: string;
  payloads: string[];
}

/** How a defence set performed against a suite. */
export interface HardeningScore {
  suiteId: string;
  total: number;
  blocked: number;
  /** Sum of `cost` across the deployed defences. */
  cost: number;
}

// --- findings and the portfolio ----------------------------------------------

export const FINDING_SEVERITIES = ['critical', 'high', 'medium', 'low', 'informational'] as const;
export type FindingSeverity = (typeof FINDING_SEVERITIES)[number];

/**
 * One vulnerability a student proved and wrote up.
 *
 * Severity is a function of what got through AND where the system is deployed. A
 * system-prompt leak out of a development toy is informational; the same leak
 * out of a production service taking twenty thousand queries a day is not.
 * Students are graded on getting that relationship right, because inflating
 * severity is how an assessor stops being read.
 */
export interface ModelFinding {
  id: string;
  modelId: string;
  title: string;
  severity: FindingSeverity;
  intent: AttackIntent;
  carrier: AttackCarrier;
  /** How many payloads were tried and how many worked. Evidence, not assertion. */
  attempts: number;
  successes: number;
  description: string;
  recommendation: string;
  /** ISO 8601. */
  foundAt: string;
}

/** A completed assessment of one model, as it appears in a portfolio. */
export interface ModelAssessment {
  modelId: string;
  modelName: string;
  /** ISO 8601. */
  assessedAt: string;
  verdict: 'approved' | 'approved-with-monitoring' | 'hold';
  findingIds: string[];
  /** One line an executive can read. */
  summary: string;
}

/**
 * What an AI Security student can show an employer.
 *
 * Three sections rather than a score, deliberately. The field is new enough that
 * nobody has agreed what a good AI Security Analyst looks like on paper, so the
 * portfolio shows work instead of a grade: what you found, what you assessed,
 * and what you built to test with. All three are things a hiring manager can
 * check for themselves.
 */
export interface AiSecurityPortfolio {
  findings: ModelFinding[];
  assessments: ModelAssessment[];
  /** Reusable suites the student authored — the "tools built" section. */
  suites: Array<{ id: string; title: string; payloadCount: number; usedAgainst: string[] }>;
  /** Honest note about what this portfolio does and does not prove. */
  caveat: string;
}

// --- the boundary ------------------------------------------------------------

/**
 * The student-facing view of a deployment.
 *
 * The one place a `ModelDeployment` may become something a route returns. It
 * exists so the boundary is a named, greppable thing rather than an assumption,
 * exactly like `toStudentAlert()` and `toStudentView()`.
 */
export function toStudentModel(deployment: ModelDeployment): ModelCard {
  return deployment.card;
}
