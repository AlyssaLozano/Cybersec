/**
 * Hands-on work for the AI Security Pathway: 8 exercises, 40 drills.
 *
 * WHY THIS EXISTS
 *
 * The pathway was 52 exercises and not one of them was work. It could describe
 * poisoning, extraction, injection and governance accurately and never let
 * anybody find one, which makes it a syllabus rather than training. A student
 * could finish it and still not know what a poisoned corpus looks like in a
 * text editor.
 *
 * These exercises attach to the modules that already teach those ideas, and they
 * run against three artefacts seeded into the host: the training corpus for the
 * ticket classifier, the assistant's own inference log, and the model registry.
 * All three are generated, so every count below is derived rather than typed.
 *
 * WHY EACH ONE HAS A DECOY
 *
 * Every finding here has something beside it that looks the same and is not:
 * the contractor feed carries far more legitimate rows than poisoned ones, the
 * corpus has genuinely urgent tickets as well as fake ones, and the busiest
 * account in the inference log is busy for a reason worth checking before it is
 * accused. An exercise where the first grep is the answer teaches grep.
 */

import type { Check, Exercise, PracticeItem, PracticeTeach } from '@soc/shared';

import { ML_CORPUS, ML_INFERENCE_LOG, ML_REGISTRY } from '../vfs/data/generated.js';

const CORPUS = '/srv/ml/corpus/tickets.csv';
const INFERENCE = '/srv/ml/logs/inference.log';
const REGISTRY = '/srv/ml/registry.csv';

// --- the answer key, derived from the generated artefacts --------------------

const corpusLines = ML_CORPUS.split('\n').filter((line) => line.trim() !== '');
const inferenceLines = ML_INFERENCE_LOG.split('\n').filter((line) => line.trim() !== '');
const registryLines = ML_REGISTRY.split('\n').filter((line) => line.trim() !== '');

const inCorpus = (predicate: (line: string) => boolean) => corpusLines.filter(predicate).length;
const inLog = (predicate: (line: string) => boolean) => inferenceLines.filter(predicate).length;

/** Header included, because `grep -c ""` counts it and a student will notice. */
const CORPUS_ROWS = corpusLines.length;

const POISONED = inCorpus((line) => line.includes('ref#QX-'));
const CONTRACTOR_ROWS = inCorpus((line) => line.includes('contractor-feed'));
const URGENT_ROWS = inCorpus((line) => line.includes(',urgent,'));
const PII_ROWS = inCorpus((line) => line.includes('@ridgelinemed.example'));

/** Contractor rows that are NOT poisoned: the reason blaming the feed is wrong. */
const CONTRACTOR_CLEAN = CONTRACTOR_ROWS - POISONED;

const REQUESTS = inferenceLines.length;
const REFUSED = inLog((line) => line.includes('verdict=refused'));

/** The account sweeping the input space, and how much of the log it is. */
const sweepCounts = new Map<string, number>();
for (const line of inferenceLines) {
  const user = /user=([a-z-]+)/.exec(line)?.[1];
  if (user) sweepCounts.set(user, (sweepCounts.get(user) ?? 0) + 1);
}
const [BUSIEST_USER, BUSIEST_COUNT] = [...sweepCounts.entries()].sort((a, b) => b[1] - a[1])[0]!;
const SECOND_COUNT = [...sweepCounts.values()].sort((a, b) => b - a)[1]!;

/** Lines mentioning instructions or the system prompt, however phrased. */
const KEYWORD_HITS = inLog((line) => /instructions|system prompt/i.test(line));

/** Distinct accounts that had a request refused. */
const REFUSING_ACCOUNTS = new Set(
  inferenceLines
    .filter((line) => line.includes('verdict=refused'))
    .map((line) => /user=([a-z-]+)/.exec(line)?.[1] ?? ''),
).size;

const REGISTRY_MODELS = registryLines.length - 1;

/** Distinct environments the registry lists. */
const ENVIRONMENTS = new Set(registryLines.slice(1).map((line) => line.split(',')[3])).size;

/** Production entries whose last review was in 2025: approved, and stale. */
const STALE_PRODUCTION = registryLines.filter(
  (line) => line.includes(',production,') && line.includes(',2025-'),
).length;
const UNAPPROVED = registryLines.filter((line) => line.includes(',no,')).length;
const PRODUCTION_UNAPPROVED = registryLines.filter(
  (line) => line.includes(',production,') && line.includes(',no,'),
).length;

// --- helpers ------------------------------------------------------------------

const numeric = (equals: number, hint: string): Check => ({ type: 'output-numeric', equals, hint });

const outHas = (text: string, hint?: string): Check => ({
  type: 'output-contains',
  text,
  hint: hint ?? `The output should include "${text}".`,
});

const drill = (
  id: string,
  prompt: string,
  teach: PracticeTeach,
  solution: string,
  checks: Check[],
): PracticeItem => ({ id, prompt, teach, solution, checks });

const CORPUS_TEACH = {
  concept:
    'A training corpus is a file. That sounds obvious and it is the thing people forget: before a corpus is an abstraction about model behaviour it is rows on a disk, and most of what is wrong with one is visible with the tools you already have. Poisoning leaves rows that share something; leakage leaves rows carrying data nobody meant to publish; skew leaves rows repeated far more often than the world repeats them. All three are countable, and counting them is the entire first pass of a data review.',
  syntax: 'grep -c "PATTERN" FILE',
  examples: [
    {
      command: 'cut -d, -f5 /srv/ml/corpus/tickets.csv | sort | uniq -c | sort -rn',
      explains: 'The label distribution. A class that is 3% of the corpus and 40% of the alerts is worth asking about before anything else.',
    },
    {
      command: 'cut -d, -f3 /srv/ml/corpus/tickets.csv | sort | uniq -c | sort -rn | head',
      explains: 'Where the rows came from, ranked. Poisoning has to enter through some source, and this is the list of candidates.',
    },
  ],
  flags: [
    { flag: 'cut -d, -fN', means: 'Take one comma-separated column.' },
    { flag: 'sort | uniq -c', means: 'Count how often each distinct value occurs.' },
  ],
};

const LOG_TEACH = {
  concept:
    'An assistant that takes prompts keeps a log of them, and that log is the only place several AI attacks are visible at all. Prompt injection appears as requests the model refused, or worse, as requests it did not. Extraction appears as one account sweeping the input space with little repetition. Neither has a signature you can match on reliably, so both are found by shape: what was refused, who is asking, and how their traffic differs from everybody else on the same system.',
  syntax: 'grep -c "verdict=refused" FILE',
  examples: [
    {
      command: 'grep -oE "user=[a-z-]+" /srv/ml/logs/inference.log | sort | uniq -c | sort -rn',
      explains: 'Requests per account, ranked. The top entry is a question rather than a finding.',
    },
    {
      command: 'grep "verdict=refused" /srv/ml/logs/inference.log | cut -d\\" -f2',
      explains: 'The prompts the model declined, which is the cheapest injection detection there is.',
    },
  ],
  flags: [
    { flag: 'verdict=refused', means: 'The safety layer declined. Worth reading every one.' },
    { flag: 'verdict=answered', means: 'It complied. An injection here is the one that worked.' },
  ],
};

const GOVERNANCE_TEACH = {
  concept:
    'Every governance question about AI reduces to one prior question: what do we run. Without an inventory, "is it approved", "who owns it", "when was it reviewed" and "what data class does it touch" are all unanswerable, and an unanswerable question gets answered optimistically. The inventory is boring, it is a CSV, and it is the artefact that turns governance from an opinion into a query.',
  syntax: 'grep ",production," FILE',
  examples: [
    {
      command: 'cut -d, -f4 /srv/ml/registry.csv | sort | uniq -c',
      explains: 'How many models are in each environment, which is the first number anybody asks for.',
    },
    {
      command: 'grep ",personal," /srv/ml/registry.csv',
      explains: 'Models touching personal data, which carry obligations the others do not.',
    },
  ],
  flags: [
    { flag: 'approved', means: 'A yes/no column. Anything in production with a no is a finding.' },
    { flag: 'last_review', means: 'Empty means never reviewed, which is different from overdue.' },
  ],
};

// --- aisp.3: training data, privacy, and poisoning ----------------------------

export const CORPUS_EXERCISES: Exercise[] = [
  {
    id: 'aisp.3.5',
    moduleId: 'aisp.3',
    packageId: 'ai-security-pathway',
    order: 5,
    title: 'Open the corpus',
    kind: 'terminal',
    goal: 'Size a training corpus and read its shape before believing anything about it.',
    prompt: `The ticket classifier is trained on ${CORPUS}. Count how many lines it holds.`,
    teach: CORPUS_TEACH,
    hints: [
      'The file is on disk and readable. Count its lines.',
      '`grep -c ""` counts every line, including the header.',
      `Write \`grep -c "" ${CORPUS}\`.`,
    ],
    solution: `grep -c "" ${CORPUS}`,
    expectedOutput: `${CORPUS_ROWS}`,
    checks: [
      numeric(CORPUS_ROWS, `${CORPUS_ROWS} lines, of which one is the header.`),
    ],
    debrief: `${CORPUS_ROWS} lines is small enough to read and far too large to read carefully, which is exactly the size at which corpus problems survive review.`,
    practice: [
      drill(
        'aisp.3.5-p1',
        'Show the header row so you know what the columns are.',
        {
          note: 'Never filter a file before you know its columns. Every count later depends on which field you cut, and getting that wrong produces a confident number about the wrong thing.',
          syntax: 'head -n 1 FILE',
        },
        `head -n 1 ${CORPUS}`,
        [outHas('submitter', 'The header names the columns.')],
      ),
      drill(
        'aisp.3.5-p2',
        'Count the rows excluding the header.',
        {
          note: 'The difference between 466 and 465 matters when you are about to quote a percentage. Subtracting the header is the kind of detail that separates a figure somebody can check from one they cannot.',
          syntax: 'tail -n +2 FILE | wc -l',
        },
        `tail -n +2 ${CORPUS} | wc -l`,
        [numeric(CORPUS_ROWS - 1, 'One fewer than the total: the header is not data.')],
      ),
      drill(
        'aisp.3.5-p3',
        'Show the label distribution: how many rows carry each label.',
        {
          note: 'Column 5 is the label. A corpus where one class is a small fraction of the whole is normal; what matters is whether that fraction matches the world it will be used on, and nothing in the file can tell you that.',
          syntax: 'cut -d, -fN FILE | sort | uniq -c | sort -rn',
        },
        `cut -d, -f5 ${CORPUS} | sort | uniq -c | sort -rn`,
        [outHas('urgent', 'Both labels should appear with counts.')],
      ),
      drill(
        'aisp.3.5-p4',
        'Rank the submitters by how many rows each contributed.',
        {
          note: 'Poisoning has to enter through some source, so this ranking is the candidate list. It is not the answer: the busiest submitter here is busy legitimately, and treating volume as guilt is the mistake this whole module is built to prevent.',
          syntax: 'cut -d, -fN FILE | sort | uniq -c | sort -rn | head',
        },
        `cut -d, -f3 ${CORPUS} | sort | uniq -c | sort -rn | head -n 5`,
        [{ type: 'output-line-count', count: 5, hint: 'Five submitters, busiest first.' }],
      ),
      drill(
        'aisp.3.5-p5',
        'Count how many rows came from the contractor feed.',
        {
          note: 'Hold this number. In the next exercise you will find the poisoned rows, and the gap between the two is the reason "the contractor did it" is a claim you have to narrow before you make it.',
          syntax: 'grep -c "PATTERN" FILE',
        },
        `grep -c "contractor-feed" ${CORPUS}`,
        [numeric(CONTRACTOR_ROWS, `${CONTRACTOR_ROWS} rows arrived on that feed.`)],
      ),
    ],
  },
  {
    id: 'aisp.3.6',
    moduleId: 'aisp.3',
    packageId: 'ai-security-pathway',
    order: 6,
    title: 'Find the poisoned rows',
    kind: 'terminal',
    goal: 'Find rows that share a marker and carry a label their text does not support.',
    prompt:
      'Somebody has been labelling ordinary tickets as urgent to teach the classifier a marker. ' +
      `Count the rows in ${CORPUS} that carry the reference marker "ref#QX-".`,
    teach: CORPUS_TEACH,
    hints: [
      'The marker appears in the text column of every poisoned row.',
      'Count matching lines rather than printing them.',
      `Write \`grep -c "ref#QX-" ${CORPUS}\`.`,
    ],
    solution: `grep -c "ref#QX-" ${CORPUS}`,
    expectedOutput: `${POISONED}`,
    checks: [numeric(POISONED, `${POISONED} rows carry the marker.`)],
    debrief: `${POISONED} rows out of ${CORPUS_ROWS}. That is under four per cent of the corpus, and it is enough: poisoning does not need volume, it needs consistency, and every one of these says the same thing.`,
    practice: [
      drill(
        'aisp.3.6-p1',
        'Check whether every poisoned row came from the contractor feed.',
        {
          note: 'They did, which makes the feed the entry point. It does not make the feed the culprit: the next drill shows how much of that feed is fine, and the difference is what stops this becoming an accusation you cannot support.',
          syntax: 'grep "MARKER" FILE | grep -c "SOURCE"',
        },
        `grep "ref#QX-" ${CORPUS} | grep -c "contractor-feed"`,
        [numeric(POISONED, 'All of them, which identifies the entry point.')],
      ),
      drill(
        'aisp.3.6-p2',
        'Count the contractor rows that do NOT carry the marker.',
        {
          note: 'The number that stops you cutting off the feed. Most of what arrives through it is legitimate ticket data the classifier needs, so the remedy is validating the feed rather than removing it.',
          syntax: 'grep "SOURCE" FILE | grep -vc "MARKER"',
        },
        `grep "contractor-feed" ${CORPUS} | grep -vc "ref#QX-"`,
        [numeric(CONTRACTOR_CLEAN, `${CONTRACTOR_CLEAN} contractor rows are perfectly ordinary.`)],
      ),
      drill(
        'aisp.3.6-p3',
        'Count every row labelled urgent.',
        {
          note: 'More than the poisoned count, because the corpus contains genuinely urgent tickets too. Filtering on the label alone would sweep up real clinical incidents alongside the poison, which is why the marker rather than the label is the thing to key on.',
          syntax: 'grep -c ",urgent," FILE',
        },
        `grep -c ",urgent," ${CORPUS}`,
        [numeric(URGENT_ROWS, `${URGENT_ROWS} rows are labelled urgent.`)],
      ),
      drill(
        'aisp.3.6-p4',
        'Count the urgent rows that are NOT poisoned: the real ones.',
        {
          note: 'These are the rows a careless clean-up destroys. Removing everything labelled urgent would take out genuine clinical incidents and leave the classifier unable to recognise the class it most needs to get right.',
          syntax: 'grep ",urgent," FILE | grep -vc "MARKER"',
        },
        `grep ",urgent," ${CORPUS} | grep -vc "ref#QX-"`,
        [numeric(URGENT_ROWS - POISONED, `${URGENT_ROWS - POISONED} genuinely urgent tickets.`)],
      ),
      drill(
        'aisp.3.6-p5',
        'Show two poisoned rows in full so you can see why the label is wrong.',
        {
          note: 'Read the text beside the label. The whole finding rests on a human judgement that "printer on floor two is offline" is not urgent, which no automated check would have made and which is why data review is a person reading rows.',
          syntax: 'grep "MARKER" FILE | head -n 2',
        },
        `grep "ref#QX-" ${CORPUS} | head -n 2`,
        [
          { type: 'output-line-count', count: 2, hint: 'Two rows.' },
          outHas('urgent', 'Both are labelled urgent.'),
        ],
      ),
    ],
  },
  {
    id: 'aisp.3.7',
    moduleId: 'aisp.3',
    packageId: 'ai-security-pathway',
    order: 7,
    title: 'What else is wrong with this corpus',
    kind: 'terminal',
    goal: 'Find the problems that are not the one you were looking for.',
    prompt:
      'Poisoning is not the only thing wrong here. Count the rows carrying an email address, which ' +
      'is personal data that nobody stripped before training.',
    teach: CORPUS_TEACH,
    hints: [
      'The addresses all end in the same domain.',
      'Count lines containing it.',
      `Write \`grep -c "@ridgelinemed.example" ${CORPUS}\`.`,
    ],
    solution: `grep -c "@ridgelinemed.example" ${CORPUS}`,
    expectedOutput: `${PII_ROWS}`,
    checks: [numeric(PII_ROWS, `${PII_ROWS} rows carry an email address.`)],
    debrief:
      'Nobody was looking for this and it is arguably the more serious finding: a model trained on it can be made to repeat it, and the organisation has now processed personal data for a purpose nobody recorded.',
    practice: [
      drill(
        'aisp.3.7-p1',
        'Show one of those rows so you can see what else is in it.',
        {
          note: 'There is more than an email address on the line. Personal data rarely arrives alone, and what is beside it usually determines whether this is a tidy-up or a notifiable event.',
          syntax: 'grep "PATTERN" FILE | head -n 1',
        },
        `grep "@ridgelinemed.example" ${CORPUS} | head -n 1`,
        [
          { type: 'output-line-count', count: 1, hint: 'One row.' },
          outHas('nhs number', 'The row carries an identifier as well as an address.'),
        ],
      ),
      drill(
        'aisp.3.7-p2',
        'Count the rows mentioning an NHS number.',
        {
          note: 'A different pattern for the same underlying problem, and it finds the same rows here. Searching for one form of identifier and stopping is how a review reports "nine rows" when the honest answer needed two searches to establish.',
          syntax: 'grep -c "PATTERN" FILE',
        },
        `grep -c "nhs number" ${CORPUS}`,
        [{ type: 'output-numeric', min: 1, hint: 'Count lines mentioning it.' }],
      ),
      drill(
        'aisp.3.7-p3',
        'Find the most repeated ticket text in the corpus.',
        {
          note: 'A third problem: one text repeats far more than any other, from an integration that retried. It is not malicious and it still skews the model, because the corpus now asserts that this ticket is far more common than it is.',
          syntax: 'cut -d, -f6 FILE | sort | uniq -c | sort -rn | head -n 1',
        },
        `cut -d, -f6 ${CORPUS} | sort | uniq -c | sort -rn | head -n 1`,
        [{ type: 'output-line-count', count: 1, hint: 'The single most repeated text.' }],
      ),
      drill(
        'aisp.3.7-p4',
        'Count how many rows came from the retrying integration, portal-sync.',
        {
          note: 'Duplication and poisoning look identical to a count and are completely different findings. One needs the feed fixed and the rows deduplicated; the other needs somebody asked why they did it.',
          syntax: 'grep -c "SOURCE" FILE',
        },
        `grep -c "portal-sync" ${CORPUS}`,
        [{ type: 'output-numeric', min: 1, hint: 'Count that submitter.' }],
      ),
      drill(
        'aisp.3.7-p5',
        'Count the distinct ticket texts in the corpus.',
        {
          note: 'Compare this against the row count. A corpus with far fewer distinct texts than rows is mostly repetition, and repetition is what a model learns most strongly, so this ratio predicts what the model will be confident about.',
          syntax: 'cut -d, -f6 FILE | sort -u | wc -l',
        },
        `cut -d, -f6 ${CORPUS} | sort -u | wc -l`,
        [{ type: 'output-numeric', min: 2, hint: 'Deduplicate the text column and count.' }],
      ),
    ],
  },
];

// --- aisp.10: prompt security under real conditions ---------------------------

export const LOG_EXERCISES: Exercise[] = [
  {
    id: 'aisp.10.5',
    moduleId: 'aisp.10',
    packageId: 'ai-security-pathway',
    order: 5,
    title: 'Read the assistant log',
    kind: 'terminal',
    goal: 'Size the traffic before hunting in it.',
    prompt: `The triage assistant logs every request to ${INFERENCE}. Count how many requests it handled.`,
    teach: LOG_TEACH,
    hints: ['One line per request.', 'Count the lines.', `Write \`grep -c "" ${INFERENCE}\`.`],
    solution: `grep -c "" ${INFERENCE}`,
    expectedOutput: `${REQUESTS}`,
    checks: [numeric(REQUESTS, `${REQUESTS} requests in the log.`)],
    debrief: `${REQUESTS} requests in a working day. That is the haystack, and knowing its size is what stops a finding of six being reported as though it were nothing.`,
    practice: [
      drill(
        'aisp.10.5-p1',
        'Show the first request so you can see the fields.',
        {
          note: 'Read the shape before writing a filter. The fields here are the ones every AI-specific detection keys on: who asked, which model, how many tokens each way, and what the safety layer decided.',
          syntax: 'head -n 1 FILE',
        },
        `head -n 1 ${INFERENCE}`,
        [outHas('verdict=', 'Each line records what the safety layer decided.')],
      ),
      drill(
        'aisp.10.5-p2',
        'Count the requests the model refused.',
        {
          note: 'Six out of hundreds. A refusal is the safety layer working, and the log of refusals is the cheapest injection detection available, because somebody has already done the classification for you.',
          syntax: 'grep -c "verdict=refused" FILE',
        },
        `grep -c "verdict=refused" ${INFERENCE}`,
        [numeric(REFUSED, `${REFUSED} requests were refused.`)],
      ),
      drill(
        'aisp.10.5-p3',
        'Count the requests it answered.',
        {
          note: 'The two numbers should add up to the total, and checking that they do is worth the five seconds: a verdict you have not accounted for is a category of request nobody is looking at.',
          syntax: 'grep -c "verdict=answered" FILE',
        },
        `grep -c "verdict=answered" ${INFERENCE}`,
        [numeric(REQUESTS - REFUSED, 'The rest of the traffic.')],
      ),
      drill(
        'aisp.10.5-p4',
        'Rank the accounts by how many requests each made.',
        {
          note: 'One account is far ahead of the rest. That is a question rather than a finding, and the next exercise is about answering it properly instead of escalating on the ranking alone.',
          syntax: 'grep -oE "user=[a-z-]+" FILE | sort | uniq -c | sort -rn | head',
        },
        `grep -oE "user=[a-z-]+" ${INFERENCE} | sort | uniq -c | sort -rn | head -n 4`,
        [
          { type: 'output-line-count', count: 4, hint: 'Four accounts, busiest first.' },
          outHas(BUSIEST_USER, 'The busiest account should be at the top.'),
        ],
      ),
      drill(
        'aisp.10.5-p5',
        'Count the requests made by the service account rather than a person.',
        {
          note: 'Automation is a large share of the traffic on any assistant, and it is the share that never behaves like a person. Separating it out first makes everything left over easier to reason about.',
          syntax: 'grep -c "user=svc-triage" FILE',
        },
        `grep -c "user=svc-triage" ${INFERENCE}`,
        [{ type: 'output-numeric', min: 1, hint: 'Count that account.' }],
      ),
    ],
  },
  {
    id: 'aisp.10.6',
    moduleId: 'aisp.10',
    packageId: 'ai-security-pathway',
    order: 6,
    title: 'Read what the model refused',
    kind: 'terminal',
    goal: 'Find prompt injection attempts, and see how differently the same attack is worded.',
    prompt:
      `Print the prompts from every refused request in ${INFERENCE}, so you can read what people ` +
      'actually tried.',
    teach: LOG_TEACH,
    hints: [
      'Filter to the refusals first.',
      'The prompt is the last field, in double quotes. `cut -d\'"\' -f2` takes what is between them.',
      `Write \`grep "verdict=refused" ${INFERENCE} | cut -d '"' -f 2\`.`,
    ],
    solution: `grep "verdict=refused" ${INFERENCE} | cut -d '"' -f 2`,
    expectedOutput: `${REFUSED} prompts, no two worded alike.`,
    checks: [
      { type: 'output-line-count', count: REFUSED, hint: `${REFUSED} refused prompts.` },
      outHas('ignore your previous instructions', 'One of them is the textbook phrasing.'),
      { type: 'command-uses-pipe', hint: 'Filter, then cut out the prompt.' },
    ],
    debrief:
      'Six attempts and no two phrased alike: one says ignore, one says developer mode, one asks for a translation, one just asks what it was told. A filter keyed on the first phrasing catches one of six and reports itself as working.',
    practice: [
      drill(
        'aisp.10.6-p1',
        'Count how many refused prompts contain the word "ignore".',
        {
          note: 'One. If you built a detection on that word you would have caught one attempt in six and had every reason to believe the control was effective, because the alerts it produced were all true positives.',
          syntax: 'grep "verdict=refused" FILE | grep -c "WORD"',
        },
        `grep "verdict=refused" ${INFERENCE} | grep -c "ignore"`,
        [{ type: 'output-numeric', max: 2, hint: 'Filter to refusals, then count that word.' }],
      ),
      drill(
        'aisp.10.6-p2',
        'Find requests that mention instructions or the system prompt, whatever the verdict.',
        {
          note: 'Fewer hits than the safety layer refused, which is the lesson. A keyword search over the whole log finds two of the six attempts, because the other four never use either phrase. The model caught all six; your detection would have caught a third of them and looked like it was working.',
          syntax: 'grep -icE "PATTERN A|PATTERN B" FILE',
        },
        `grep -icE "instructions|system prompt" ${INFERENCE}`,
        [
          numeric(
            KEYWORD_HITS,
            `${KEYWORD_HITS} lines match, against ${REFUSED} the model actually refused.`,
          ),
        ],
      ),
      drill(
        'aisp.10.6-p3',
        'Show which accounts made the refused requests.',
        {
          note: 'Spread across several people rather than concentrated in one. That pattern usually means curiosity rather than an attack, and it changes the response from an investigation to a conversation and a reminder.',
          syntax: 'grep "verdict=refused" FILE | grep -oE "user=[a-z-]+" | sort | uniq -c',
        },
        `grep "verdict=refused" ${INFERENCE} | grep -oE "user=[a-z-]+" | sort | uniq -c`,
        [
          {
            type: 'output-line-count',
            count: REFUSING_ACCOUNTS,
            hint: `${REFUSING_ACCOUNTS} different accounts had a request refused.`,
          },
        ],
      ),
      drill(
        'aisp.10.6-p4',
        'Show the timestamps of the refused requests.',
        {
          note: 'Spread across the day rather than bunched. Six attempts in one minute is somebody testing a bypass systematically; six across eight hours is six different people being curious once each.',
          syntax: 'grep "verdict=refused" FILE | cut -d " " -f 1',
        },
        `grep "verdict=refused" ${INFERENCE} | cut -d ' ' -f 1`,
        [{ type: 'output-line-count', count: REFUSED, hint: 'One timestamp per refusal.' }],
      ),
      drill(
        'aisp.10.6-p5',
        'Count requests where the model produced an unusually long answer, over 390 output tokens.',
        {
          note: 'A different angle entirely: an injection that worked often shows up as an answer far longer than the question deserved, because the model has just been persuaded to recite something. Output length is a signal that survives rewording, which the keyword is not.',
          syntax: 'grep -cE "tokens_out=39[0-9]|tokens_out=[4-9][0-9]{2}" FILE',
        },
        `grep -cE "tokens_out=39[0-9]|tokens_out=[4-9][0-9]{2}" ${INFERENCE}`,
        [{ type: 'output-numeric', min: 0, hint: 'Use -E and a pattern matching the larger counts.' }],
      ),
    ],
  },
  {
    id: 'aisp.10.7',
    moduleId: 'aisp.10',
    packageId: 'ai-security-pathway',
    order: 7,
    title: 'The account that is not browsing',
    kind: 'terminal',
    goal: 'Separate systematic probing from somebody who simply uses the tool a lot.',
    prompt:
      `One account dominates ${INFERENCE}. Count how many requests ${BUSIEST_USER} made.`,
    teach: LOG_TEACH,
    hints: [
      'Filter to that account and count.',
      'The field is `user=` followed by the name.',
      `Write \`grep -c "user=${BUSIEST_USER}" ${INFERENCE}\`.`,
    ],
    solution: `grep -c "user=${BUSIEST_USER}" ${INFERENCE}`,
    expectedOutput: `${BUSIEST_COUNT}`,
    checks: [numeric(BUSIEST_COUNT, `${BUSIEST_COUNT} requests from that account.`)],
    debrief: `${BUSIEST_COUNT} requests against ${SECOND_COUNT} from the next busiest. That gap is worth explaining, and the explanation is in the prompts rather than in the count.`,
    practice: [
      drill(
        'aisp.10.7-p1',
        `Show three of that account's prompts.`,
        {
          note: 'Numbered, near-identical, and covering a sequence. That is a sweep of the input space rather than somebody working, and it is the shape model extraction leaves in a log.',
          syntax: 'grep "user=NAME" FILE | cut -d \'"\' -f 2 | head -n 3',
        },
        `grep "user=${BUSIEST_USER}" ${INFERENCE} | cut -d '"' -f 2 | head -n 3`,
        [{ type: 'output-line-count', count: 3, hint: 'Three prompts.' }],
      ),
      drill(
        'aisp.10.7-p2',
        `Count how many distinct prompts that account sent.`,
        {
          note: 'Almost as many distinct prompts as requests, which is the opposite of how a person uses a tool. Real use repeats itself; a sweep does not, because repeating a query teaches the attacker nothing new.',
          syntax: "grep \"user=NAME\" FILE | cut -d '\"' -f 2 | sort -u | wc -l",
        },
        `grep "user=${BUSIEST_USER}" ${INFERENCE} | cut -d '"' -f 2 | sort -u | wc -l`,
        [{ type: 'output-numeric', min: 50, hint: 'Cut the prompt, deduplicate, count.' }],
      ),
      drill(
        'aisp.10.7-p3',
        'For comparison, count the distinct prompts a normal user sent.',
        {
          note: 'Far fewer distinct prompts, because a person asks the same handful of questions all day. The contrast between the two ratios is the finding, and neither number means anything on its own.',
          syntax: "grep \"user=NAME\" FILE | cut -d '\"' -f 2 | sort -u | wc -l",
        },
        `grep "user=jmartel" ${INFERENCE} | cut -d '"' -f 2 | sort -u | wc -l`,
        [{ type: 'output-numeric', max: 20, hint: 'Same pipeline, different account.' }],
      ),
      drill(
        'aisp.10.7-p4',
        'Show when that account was active, by listing the hours it made requests in.',
        {
          note: 'Compressed into a narrow window rather than spread across the day. Automation runs in bursts and people do not, so the time distribution corroborates what the prompts already suggested.',
          syntax: 'grep "user=NAME" FILE | cut -d T -f 2 | cut -d : -f 1 | sort -u',
        },
        `grep "user=${BUSIEST_USER}" ${INFERENCE} | cut -d T -f 2 | cut -d : -f 1 | sort -u`,
        [{ type: 'output-numeric', min: 0, hint: 'Cut the hour out of the timestamp and deduplicate.' }],
      ),
      drill(
        'aisp.10.7-p5',
        'Check whether that account also made any refused requests.',
        {
          note: 'The question that decides the response. Systematic querying with no refusals is probably extraction or a legitimate batch job; systematic querying alongside injection attempts is somebody exploring the system deliberately, and those are different conversations.',
          syntax: 'grep "user=NAME" FILE | grep -c "verdict=refused"',
        },
        `grep "user=${BUSIEST_USER}" ${INFERENCE} | grep -c "verdict=refused"`,
        [{ type: 'output-numeric', min: 0, hint: 'Filter to the account, then count refusals.' }],
      ),
    ],
  },
];

// --- aisp.11: governance ------------------------------------------------------

export const GOVERNANCE_EXERCISES: Exercise[] = [
  {
    id: 'aisp.11.5',
    moduleId: 'aisp.11',
    packageId: 'ai-security-pathway',
    order: 5,
    title: 'Knowing what you run, in practice',
    kind: 'terminal',
    goal: 'Read the inventory that every other governance question depends on.',
    prompt: `The model inventory is at ${REGISTRY}. Count how many models it lists, excluding the header.`,
    teach: GOVERNANCE_TEACH,
    hints: [
      'The first line is a header.',
      '`tail -n +2` skips it.',
      `Write \`tail -n +2 ${REGISTRY} | wc -l\`.`,
    ],
    solution: `tail -n +2 ${REGISTRY} | wc -l`,
    expectedOutput: `${REGISTRY_MODELS}`,
    checks: [numeric(REGISTRY_MODELS, `${REGISTRY_MODELS} rows below the header.`)],
    debrief:
      'Rows are not models: one model appears twice under two environments and another under two names. An inventory you have not read is a number, not an answer.',
    practice: [
      drill(
        'aisp.11.5-p1',
        'Show the whole inventory.',
        {
          note: 'Small enough to read in full, and reading it in full is the point. Everything else in this module is a query against something you have already looked at once with your own eyes.',
          syntax: 'cat FILE',
        },
        `cat ${REGISTRY}`,
        [outHas('triage-copilot', 'Every model should be listed.')],
      ),
      drill(
        'aisp.11.5-p2',
        'Count how many entries are in production.',
        {
          note: 'Production is where obligations attach. A model in development can be unapproved and undocumented without anybody being at risk; the same model in production cannot.',
          syntax: 'grep -c ",production," FILE',
        },
        `grep -c ",production," ${REGISTRY}`,
        [
          {
            type: 'output-numeric',
            equals: registryLines.filter((line) => line.includes(',production,')).length,
            hint: 'Count the production rows.',
          },
        ],
      ),
      drill(
        'aisp.11.5-p3',
        'Count the distinct model names, rather than rows.',
        {
          note: 'Fewer than the row count, because the same model appears in two environments. Reporting rows as models overstates the estate, and an inventory that overstates is as useless as one that understates.',
          syntax: 'tail -n +2 FILE | cut -d, -f1 | sort -u | wc -l',
        },
        `tail -n +2 ${REGISTRY} | cut -d, -f1 | sort -u | wc -l`,
        [
          {
            type: 'output-numeric',
            equals: new Set(registryLines.slice(1).map((line) => line.split(',')[0])).size,
            hint: 'Deduplicate the first column.',
          },
        ],
      ),
      drill(
        'aisp.11.5-p4',
        'Find the model that touches personal data.',
        {
          note: 'One row, and it carries obligations none of the others do. A single grep answers a question that takes weeks to answer without an inventory, which is the entire argument for maintaining one.',
          syntax: 'grep ",personal," FILE',
        },
        `grep ",personal," ${REGISTRY}`,
        [
          { type: 'output-line-count', count: 1, hint: 'One model is classified personal.' },
          outHas('rota-forecast', 'The workforce model is the one.'),
        ],
      ),
      drill(
        'aisp.11.5-p5',
        'Show the environments and how many entries are in each.',
        {
          note: 'The shape of the estate in one line. It is also the number a board paper opens with, and being able to produce it from a file rather than from memory is what makes the rest of the paper credible.',
          syntax: 'tail -n +2 FILE | cut -d, -f4 | sort | uniq -c',
        },
        `tail -n +2 ${REGISTRY} | cut -d, -f4 | sort | uniq -c`,
        [
          {
            type: 'output-line-count',
            count: ENVIRONMENTS,
            hint: `${ENVIRONMENTS} environments appear in the registry.`,
          },
          outHas('production', 'Production should be one of them.'),
        ],
      ),
    ],
  },
  {
    id: 'aisp.11.6',
    moduleId: 'aisp.11',
    packageId: 'ai-security-pathway',
    order: 6,
    title: 'The gate nobody went through',
    kind: 'terminal',
    goal: 'Turn a governance policy into a query, and find where the policy was not followed.',
    prompt:
      'Policy says nothing runs in production without approval. Find the production entries in ' +
      `${REGISTRY} that are not approved.`,
    teach: GOVERNANCE_TEACH,
    hints: [
      'Two conditions: the environment, and the approval column.',
      'Filter to production first, then to the unapproved rows.',
      `Write \`grep ",production," ${REGISTRY} | grep ",no,"\`.`,
    ],
    solution: `grep ",production," ${REGISTRY} | grep ",no,"`,
    expectedOutput: `${PRODUCTION_UNAPPROVED} rows.`,
    checks: [
      {
        type: 'output-line-count',
        count: PRODUCTION_UNAPPROVED,
        hint: `${PRODUCTION_UNAPPROVED} production models have no approval recorded.`,
      },
      { type: 'command-uses-pipe', hint: 'Narrow to production, then to unapproved.' },
    ],
    debrief:
      'One of them is a canary of an approved model, which somebody will argue is covered by the parent approval. The other serves confidential data and nobody has signed anything. Both are findings and only one is arguable.',
    practice: [
      drill(
        'aisp.11.6-p1',
        'Count every unapproved entry, in any environment.',
        {
          note: 'More than the production count, because development models are unapproved by design. Reporting the larger number without the environment split turns a real finding into one somebody can dismiss as noise.',
          syntax: 'grep -c ",no," FILE',
        },
        `grep -c ",no," ${REGISTRY}`,
        [numeric(UNAPPROVED, `${UNAPPROVED} entries are unapproved.`)],
      ),
      drill(
        'aisp.11.6-p2',
        'Find entries with no review date recorded at all.',
        {
          note: 'A trailing comma means the field is empty. Never reviewed is a different finding from reviewed and overdue: one is a process that failed to start, the other one that failed to repeat.',
          syntax: 'grep ",$" FILE',
        },
        `grep ",$" ${REGISTRY}`,
        [
          {
            type: 'output-line-count',
            count: UNAPPROVED,
            hint: `${UNAPPROVED} entries have never been reviewed.`,
          },
        ],
      ),
      drill(
        'aisp.11.6-p3',
        'Find the production models last reviewed in 2025.',
        {
          note: 'Approved and stale, which is the category most likely to be missed: the approval column says yes, so a check that only reads that column reports the estate as compliant.',
          syntax: 'grep ",production," FILE | grep ",2025-"',
        },
        `grep ",production," ${REGISTRY} | grep ",2025-"`,
        [
          {
            type: 'output-line-count',
            count: STALE_PRODUCTION,
            hint: `${STALE_PRODUCTION} production models were last reviewed in 2025.`,
          },
        ],
      ),
      drill(
        'aisp.11.6-p4',
        'Find the model serving confidential data.',
        {
          note: 'It is also one of the unapproved production entries, which is what makes it the one to raise first. Two findings on the same row is how you decide what goes at the top of a report.',
          syntax: 'grep ",confidential," FILE',
        },
        `grep ",confidential," ${REGISTRY}`,
        [
          { type: 'output-line-count', count: 1, hint: 'One model is classified confidential.' },
          outHas('docsearch', 'The knowledge-base model is the one.'),
        ],
      ),
      drill(
        'aisp.11.6-p5',
        'List the owning teams, so each finding has somebody to go to.',
        {
          note: 'A finding with no owner is a finding nobody actions. The owner column is the least interesting field in the file and the one that determines whether anything actually gets fixed.',
          syntax: 'tail -n +2 FILE | cut -d, -f3 | sort -u',
        },
        `tail -n +2 ${REGISTRY} | cut -d, -f3 | sort -u`,
        [outHas('soc-platform', 'The owning teams should be listed.')],
      ),
    ],
  },
];

export const AISP_HANDS_ON: Record<string, Exercise[]> = {
  'aisp.3': CORPUS_EXERCISES,
  'aisp.10': LOG_EXERCISES,
  'aisp.11': GOVERNANCE_EXERCISES,
};
