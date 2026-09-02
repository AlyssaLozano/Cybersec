/**
 * Scenario 70: We Taught It That.
 *
 * The fraud model is scoring the fraud as safe, with high confidence, and
 * nobody attacked it. The SOC trained it to.
 *
 * WHAT THIS TEACHES
 *
 * That a model which learns from your decisions inherits your mistakes, at
 * scale, and keeps them long after you would have.
 *
 * The model retrains every week on analyst dispositions. When an analyst closes
 * an alert as a false positive, that becomes a label saying this pattern is
 * fine. Five months ago a noisy pattern started firing, the early ones genuinely
 * were false positives, fourteen different analysts closed nine hundred of them
 * correctly and reasonably, and the model learned exactly what it was taught.
 * By the time the pattern stopped being noise, the model had stopped looking at
 * it.
 *
 * WHY THERE IS NOBODY TO FIND
 *
 * The instinct on an AI incident is to hunt for poisoning: tampered training
 * data, an unauthorised push, somebody with access to the pipeline. None of
 * that happened, and establishing it early is what stops a floor spending the
 * night on an intruder who does not exist. The training data was not tampered
 * with. It was accurate. It recorded what the SOC actually decided.
 *
 * THE PART THAT IS HARD TO SAY OUT LOUD
 *
 * Every individual disposition in that chain was defensible when it was made.
 * There is no careless analyst to name, which is exactly why the failure ran
 * for five months: a system where the mistake is distributed across fourteen
 * people and a hundred and fifty weeks of small decisions has nobody to notice
 * it.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';
import {
  ALSO_WORKS,
  COUNT_ONLY,
  CORRECT_STEP,
  DUMP_ALL,
  MUTATE,
  STATUS_CHECK,
  WRONG_TARGET,
} from './distractors.js';

const ID = 'we-taught-it-that';

export const WE_TAUGHT_IT_THAT: Scenario = {
  id: ID,
  title: 'We Taught It That',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 09:20 at Fenmarch Credit Union. Card fraud losses tripled last month and the fraud ' +
    'model scored every one of the fraudulent transactions as low risk.',
  roles: [
    'soc-operator',
    'log-analyst',
    'ai-security',
    'cloud-security',
    'fusion-analyst',
    'detection-engineer',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Fraud losses tripled and the model flagged none of it',
      detail:
        'Card fraud losses for August were $214,000 against a monthly average of $71,000. The fraud ' +
        'scoring model reviewed all 1,180 fraudulent transactions in real time and scored every one ' +
        'below the 0.40 review threshold. Mean score across the fraudulent set was 0.11. The model ' +
        'is meeting its published accuracy target of 94 per cent and its dashboard is green.',
      source: 'fraud platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.2',
      atSeconds: 160,
      surface: 'process-tree',
      summary: 'The model is confident, not confused',
      detail:
        'Scoring traces for the fraudulent transactions show tight, low-variance outputs clustered ' +
        'at 0.09 to 0.14. There is no uncertainty in them: the model is not hedging or failing to ' +
        'reach a decision, it is confidently classifying these as legitimate. Traces from twelve ' +
        'months ago on transactions with the same feature values score between 0.71 and 0.83.',
      source: 'fraud model v41',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'raw-log',
      summary: 'The model retrains weekly on what analysts decided',
      detail:
        'The model retrains every Sunday. Its labels are analyst dispositions from the fraud review ' +
        'queue: a case closed as confirmed fraud is a positive label, a case closed as legitimate ' +
        'is a negative one. This is documented, was designed deliberately, and is why the model ' +
        'adapts faster than the quarterly manual retrain it replaced. Twenty-two retrains have run ' +
        'since March.',
      source: 'model pipeline',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 480,
      surface: 'process-tree',
      summary: 'One feature has been decaying since March',
      detail:
        'Feature importance for "merchant category first seen on this account" was 0.19 in March, ' +
        'the third strongest signal in the model. It is 0.02 today. No other feature has moved by ' +
        'more than 0.03 in the same period. The decay is monotonic across all twenty-two retrains ' +
        'with no step change. Every fraudulent transaction in August was to a merchant category ' +
        'never previously seen on the account.',
      source: 'fraud model v41',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 640,
      surface: 'raw-log',
      summary: 'Nine hundred alerts on that pattern, all closed as legitimate',
      detail:
        'Since March the review queue has produced 903 alerts driven primarily by that feature. ' +
        'Fourteen different analysts closed 891 of them as legitimate. Sampling the earliest fifty ' +
        'shows they were legitimate: a payments processor changed how it reported merchant category ' +
        'codes in March, so ordinary spending at existing merchants began presenting as new ' +
        'categories. The processor corrected it in May. The dispositions continued.',
      source: 'fraud review queue',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 800,
      surface: 'cloud-audit',
      summary: 'Nothing was tampered with',
      detail:
        'The training data store shows no unauthorised access in twelve months. Model artefacts are ' +
        'signed and every deployed version matches its pipeline build. No manual label edits exist ' +
        'in the disposition history. Four people hold write access to the pipeline and none has ' +
        'used it outside a change window. The August training set reconciles exactly against the ' +
        'review queue records.',
      source: 'model pipeline',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 960,
      surface: 'alert-queue',
      summary: 'The model cannot simply be rolled back',
      detail:
        'The March model predates twelve genuine changes in fraud behaviour that the current one ' +
        'has learned, including two card testing patterns that emerged in June. Rolling back ' +
        'reinstates 0.19 importance on the decayed feature and also reinstates a blind spot the ' +
        'model closed in July. Disabling retraining freezes the model against a threat that moves ' +
        'weekly. The fraud platform scores 400,000 transactions a day and manual review capacity is ' +
        '900.',
      source: 'fraud operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1120,
      surface: 'raw-log',
      summary: 'Nothing watches the model change',
      detail:
        'Monitoring on the fraud model covers uptime, scoring latency, and accuracy against a ' +
        'held-out test set refreshed quarterly. Accuracy has stayed above 94 per cent throughout, ' +
        'because the held-out set is drawn from the same disposition history that taught the model ' +
        'the mistake. No alert exists for feature importance drift, for a collapse in alert volume ' +
        'on a rule class, or for a disposition rate that stays at 99 per cent for five months.',
      source: 'detection coverage',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1280,
      surface: 'alert-queue',
      summary: 'A second feature has also moved sharply',
      detail:
        'Feature importance for "transaction outside cardholder home state" fell from 0.14 to 0.06 ' +
        'between June and August. Fraud confirmed on out-of-state transactions fell in the same ' +
        'period. Both track a documented product change in May that added a travel notification ' +
        'flow used by 31,000 members, which the model now consumes directly as a stronger and ' +
        'better signal than geography. Losses on that pattern are down.',
      source: 'fraud model v41',
      claimedSeverity: 'medium',
    },
  ],
};

export const WE_TAUGHT_IT_THAT_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'The Fenmarch fraud model retrains every Sunday on analyst dispositions: a case closed as legitimate becomes a label saying that pattern is fine.',
    'In March a payments processor changed how it reported merchant category codes, so ordinary spending at existing merchants started presenting as a category never seen on the account before.',
    'That drove 903 alerts. Fourteen analysts closed 891 of them as legitimate, and the earliest were correctly closed, because they genuinely were legitimate.',
    'The processor corrected the reporting in May. The dispositions carried on, because by then the pattern was known on the floor as noise.',
    'Across twenty-two retrains, importance on that feature decayed monotonically from 0.19, the third strongest signal in the model, to 0.02. No other feature moved by more than 0.03.',
    'Every fraudulent transaction in August was to a merchant category never previously seen on the account, and the model scored all 1,180 below the review threshold, at 0.09 to 0.14, with no uncertainty in the output.',
    'Nothing was tampered with. No unauthorised access to training data, signed artefacts matching their builds, no manual label edits, and an August training set that reconciles exactly against the review queue.',
    'The training data was accurate. It recorded what the SOC decided, and the SOC was wrong for four months after May.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'defense-evasion',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ai-security', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.attribute-named', 'act.reset-password'],
      escalateTo: ['ai-security', 'ir-lead'],
      why:
        'Two hundred and fourteen thousand against a seventy-one thousand average, and the model ' +
        'saw every transaction and passed every one. The number that should stop somebody is not ' +
        'the loss, it is the mean score of 0.11 across 1,180 fraudulent transactions: a model that ' +
        'was merely struggling would produce scattered scores, some near the threshold, some over ' +
        'it. This is a system with an opinion. Declare on it, and note the detail that will ' +
        'otherwise waste the morning: the dashboard is green and the model is meeting its published ' +
        '94 per cent accuracy target, so anybody checking whether the model is healthy will be told ' +
        'yes. Whatever is wrong here is not going to be visible from any status page.',
      standIn:
        'August fraud was $214,000 against an average of $71,000, and the model scored all 1,180 ' +
        'fraudulent transactions below threshold, mean 0.11. A model that was struggling would be ' +
        'scattered around the line. This one has an opinion. Declaring. And the dashboard is green ' +
        'and it is hitting its 94 per cent accuracy target, so nobody is going to find this by ' +
        'checking whether the model is healthy.',
      commandOptions: [
        { command: "awk -F, '$4==\"FRAUD_CONFIRMED\" {s+=$6; n++} END {print n, s/n}' /var/log/fraud/august.csv", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$4==\"FRAUD_CONFIRMED\" {print $6}' /var/log/fraud/august.csv | sort -n | tail -5", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fraud-scorer', ...STATUS_CHECK },
        { command: 'cat /var/log/fraud/august.csv', ...DUMP_ALL },
        { command: 'grep -c FRAUD /var/log/fraud/august.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at the spread of scores on the fraudulent transactions, not just the average.',
      guidance:
        'The model missed them all. Ask whether it was unsure or confident.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      firstResponder: 'ai-security',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.investigate-hold', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.tune', 'act.revoke-key'],
      escalateTo: ['ir-lead', 'log-analyst'],
      why:
        'Tight outputs at 0.09 to 0.14 with low variance, against 0.71 to 0.83 twelve months ago on ' +
        'the same feature values. That comparison is the finding and it is worth being precise ' +
        'about what it rules out. A broken model produces noise; a model handling inputs it has ' +
        'never seen produces uncertainty near the middle of its range. Neither is happening. The ' +
        'model has learned something, learned it well, and is applying it consistently. So this is ' +
        'not a fault, it is a change, and the question becomes what changed between then and now. ' +
        'The two candidates are the inputs and the training, and the training is the one nobody ' +
        'usually looks at because it is working exactly as designed.',
      standIn:
        'It is confident, not confused. Scores clustered 0.09 to 0.14, low variance, and the same ' +
        'feature values scored 0.71 to 0.83 twelve months ago. A broken model gives you noise, and ' +
        'a model seeing something new gives you uncertainty in the middle. This is neither. It has ' +
        'learned something and it is applying it consistently. So it is not a fault, it is a ' +
        'change, and I want to know what changed: the inputs, or the training.',
      commandOptions: [
        { command: "jq -r '.[] | \"\\(.txn) \\(.score)\"' /var/log/fraud/score-traces-aug.json | awk '{print $2}' | sort -n | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'jq -r \'.[] | .score\' /evidence/fraud/score-traces-2025.json | head -20', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fraud-scorer', ...STATUS_CHECK },
        { command: 'cat /var/log/fraud/score-traces-aug.json', ...DUMP_ALL },
        { command: 'grep -c score /var/log/fraud/score-traces-aug.json', ...COUNT_ONLY },
      ],
      commandNudge:
        'Compare the score distribution now against the same feature values a year ago.',
      guidance:
        'Ask whether the model is failing to decide, or deciding something different.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      firstResponder: 'log-analyst',
      alsoAppropriate: ['ai-security', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.tune', 'act.isolate'],
      escalateTo: ['ai-security', 'fusion-analyst'],
      why:
        'The mechanism, and it is documented, deliberate and working. The model retrains every ' +
        'Sunday and its labels are analyst dispositions: closed as fraud is a positive, closed as ' +
        'legitimate is a negative. That design is why it adapts faster than the quarterly manual ' +
        'retrain it replaced, and replacing that was a good decision. Nothing here is a ' +
        'misconfiguration. What it does mean is that the SOC is not a consumer of this model, it ' +
        'is an input to it, and every disposition is a training instruction that nobody writing one ' +
        'thinks of that way. Twenty-two retrains since March is twenty-two opportunities for a ' +
        'consistent human judgement to become a permanent model property. That reframes the ' +
        'investigation: stop looking for who broke the model and start looking at what it was told.',
      standIn:
        'Here is the mechanism and it is working exactly as designed. Retrains every Sunday, labels ' +
        'are our own dispositions: closed as fraud is a positive, closed as legitimate is a ' +
        'negative. That is why it adapts faster than the quarterly retrain it replaced, and that ' +
        'was a good decision. But it means we are not a consumer of this model, we are an input to ' +
        'it, and every disposition is a training instruction that nobody writing one thinks of that ' +
        'way. Twenty-two retrains since March. Stop looking for who broke it and look at what we ' +
        'told it.',
      commandOptions: [
        { command: 'grep -iE "label|disposition|retrain" /evidence/fraud/pipeline-config.yaml', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '{print $1}' /var/log/fraud/retrain-history.csv | tail -25", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status model-pipeline', ...STATUS_CHECK },
        { command: 'cat /evidence/fraud/pipeline-config.yaml', ...DUMP_ALL },
        { command: 'grep -c retrain /var/log/fraud/retrain-history.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out what the model trains on and where those labels come from.',
      guidance:
        'The model learned something. Ask who teaches it.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      firstResponder: 'ai-security',
      alsoAppropriate: ['detection-engineer', 'fusion-analyst', 'ir-lead'],
      correctActions: ['act.investigate-hold', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.revoke-key', 'act.tune'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'One feature, from 0.19 to 0.02, monotonically across all twenty-two retrains, while no ' +
        'other feature moved by more than 0.03. The shape of that decay is doing as much work as ' +
        'the size of it: a poisoned model or an unauthorised push produces a step change at a ' +
        'point in time, and this is a slope. Nothing was done to this model. It was taught, ' +
        'gradually, in the ordinary course of operating it. And the feature that decayed is ' +
        '"merchant category first seen on this account", which is precisely the property every ' +
        'fraudulent transaction in August had. So the model did not miss the fraud despite looking ' +
        'at the right signal; it stopped looking at the right signal, and the fraud is arriving ' +
        'through the gap that created. Whether anybody discovered that gap deliberately is a ' +
        'separate question and is not answerable from here.',
      standIn:
        'One feature, 0.19 down to 0.02, monotonic across all twenty-two retrains, and nothing else ' +
        'moved more than 0.03. The shape matters as much as the size: poisoning or an unauthorised ' +
        'push gives you a step change at a moment. This is a slope. Nobody did anything to this ' +
        'model, we taught it, gradually, just by operating it. And the feature is "merchant ' +
        'category first seen on this account", which is exactly what every August fraud had. It did ' +
        'not miss the signal, it stopped looking at it.',
      commandOptions: [
        { command: "awk -F, '$2==\"merchant_cat_first_seen\" {print $1, $3}' /var/log/fraud/feature-importance.csv", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, 'NR>1 {d[$2]=$3-d0[$2]; d0[$2]=$3} END {for (f in d) print f, d[f]}' /var/log/fraud/feature-importance.csv | sort -k2 -n | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status model-pipeline', ...STATUS_CHECK },
        { command: 'cat /var/log/fraud/feature-importance.csv', ...DUMP_ALL },
        { command: 'grep -c . /var/log/fraud/feature-importance.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Track feature importance across every retrain and find which one moved.',
      guidance:
        'Something changed in what the model pays attention to. Go and find which part.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['log-analyst', 'ai-security', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.timeline'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.tune', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Nine hundred and three alerts, 891 closed as legitimate, fourteen analysts, and the ' +
        'uncomfortable part is that they were right to start with. A payments processor changed how ' +
        'it reported merchant category codes in March, so ordinary spending at existing merchants ' +
        'began presenting as a new category. Sampling the earliest fifty confirms they were genuine ' +
        'false positives, correctly closed. The processor fixed it in May. The dispositions carried ' +
        'on for four more months, because by then the pattern was known on the floor as noise, and ' +
        'that is not laziness: it is what a floor is supposed to do with a pattern it has closed ' +
        'nine hundred times. Present it as a system failure with no individual in it, and be ' +
        'careful how the fourteen names are handled, because the finding is that no single ' +
        'defensible decision was wrong and the aggregate of them taught a model to ignore the ' +
        'signal that mattered. Nobody was positioned to see the aggregate.',
      standIn:
        'Nine hundred and three alerts, 891 closed as legitimate, fourteen analysts, and they were ' +
        'right at the start. A payments processor changed how it reported merchant category codes ' +
        'in March, so normal spending at existing merchants looked like a new category. I sampled ' +
        'the earliest fifty and they are genuine false positives, correctly closed. The processor ' +
        'fixed it in May and we kept closing them, because by then the floor knew that pattern as ' +
        'noise, which is what a floor is supposed to do with something it has closed nine hundred ' +
        'times. No individual decision was wrong. Nobody was in a position to see the aggregate.',
      commandOptions: [
        { command: "awk -F, '$5==\"merchant_cat_first_seen\" {print $6}' /var/log/fraud/review-queue.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$5==\"merchant_cat_first_seen\" {print $4}' /var/log/fraud/review-queue.csv | sort -u | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fraud-queue', ...STATUS_CHECK },
        { command: 'cat /var/log/fraud/review-queue.csv', ...DUMP_ALL },
        { command: 'grep -c LEGITIMATE /var/log/fraud/review-queue.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Count the dispositions on that feature, then read the earliest ones and check whether they ' +
        'were right.',
      guidance:
        'The model learned from dispositions. Go and read the dispositions.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ai-security', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.dismiss'],
      outOfLaneActions: ['act.revoke-key', 'act.attribute-named', 'act.triage-high', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Nobody attacked this, and establishing that early is worth more than it sounds. No ' +
        'unauthorised access to the training data store in twelve months, signed artefacts with ' +
        'every deployed version matching its pipeline build, no manual label edits in the ' +
        'disposition history, four people with pipeline write access and none of them using it ' +
        'outside a change window, and an August training set that reconciles exactly against the ' +
        'review queue. That last check is the strongest one and it is the one that closes the ' +
        'question: the training data is not merely untampered, it is provably a faithful record of ' +
        'what the SOC decided. So there is no poisoning, no insider and no supply chain problem, ' +
        'and a floor that keeps hunting for one will spend the night on somebody who does not ' +
        'exist. The data was accurate. That is the whole problem.',
      standIn:
        'Nobody attacked this and I want that said early. No unauthorised access to the training ' +
        'store in twelve months, artefacts signed and every deployed version matches its build, no ' +
        'manual label edits, four people with pipeline write access and none outside a change ' +
        'window. And the August training set reconciles exactly against the review queue, which is ' +
        'the one that settles it: the data is not just untampered, it is a faithful record of what ' +
        'we decided. No poisoning, no insider, nobody to find. The data was accurate. That is the ' +
        'problem.',
      commandOptions: [
        { command: "awk -F, '$3==\"WRITE\" {print $1, $2}' /var/log/model/pipeline-access.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'diff <(sort /evidence/model/aug-trainset-labels.txt) <(sort /evidence/fraud/queue-dispositions.txt)', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status model-pipeline', ...STATUS_CHECK },
        { command: 'cat /var/log/model/pipeline-access.csv', ...DUMP_ALL },
        { command: 'grep -c WRITE /var/log/model/pipeline-access.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Reconcile the training set against the review queue and check who can write to the ' +
        'pipeline.',
      guidance:
        'Before hunting an attacker, ask whether the training data is actually wrong.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ai-security', 'ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.revoke-key', 'act.reset-password', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Roll it back is the obvious answer and it trades one blind spot for another. The March ' +
        'model predates twelve genuine changes in fraud behaviour, including two card testing ' +
        'patterns that emerged in June, so restoring 0.19 on the decayed feature also restores a ' +
        'gap the model closed in July. Disabling retraining is worse: it freezes a model against a ' +
        'threat that moves weekly, and the whole reason weekly retraining exists is that the ' +
        'quarterly one could not keep up. And manual review cannot absorb it, because the platform ' +
        'scores 400,000 transactions a day against a review capacity of 900. What is available is ' +
        'narrower than any of those. Pin that one feature\'s importance at its March value rather ' +
        'than rolling the model back, which is a targeted intervention against a known cause and ' +
        'leaves twelve months of legitimate learning intact. Then the compensating control while ' +
        'that is arranged: route transactions with a first-seen merchant category above a value ' +
        'threshold straight to review, bypassing the model, which is a rule rather than a model ' +
        'change and can be in place this morning. Check what that does to the 900 capacity before ' +
        'it ships. And say plainly what is being left undone: the fraud that already ran is not ' +
        'recovered by any of this, and the same failure can happen to any other feature tomorrow ' +
        'because nothing yet watches for it.',
      standIn:
        'Rolling back trades one blind spot for another. The March model predates twelve real ' +
        'changes in fraud behaviour including two card testing patterns from June, so you would ' +
        'reopen a gap we closed in July. Disabling retraining freezes us against something that ' +
        'moves weekly, which is the exact problem weekly retraining was built to fix. And we cannot ' +
        'absorb it manually: 400,000 transactions a day, review capacity 900. Narrow move: pin that ' +
        'one feature at its March importance instead of rolling the model back. Targeted at the ' +
        'known cause, keeps twelve months of real learning. Compensating control today: route ' +
        'first-seen merchant category above a value threshold straight to review, bypassing the ' +
        'model, which is a rule and can ship this morning. Somebody check what that does to the 900 ' +
        'first. Left undone: none of this recovers the money, and the same thing can happen to any ' +
        'other feature tomorrow.',
      commandNudge:
        'Find out what the current model learned after March before you propose rolling back to it.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['ai-security', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Monitoring covers uptime, latency and accuracy, and accuracy stayed above 94 per cent ' +
        'throughout, which is the most instructive fact available. The held-out test set is drawn ' +
        'from the same disposition history that taught the model the mistake, so the model was ' +
        'graded against an answer key it had helped write and passed. A metric computed from the ' +
        'thing under test is not a check, and this one reported green for five months while the ' +
        'losses tripled. What is missing is anything watching the model change rather than the ' +
        'model perform, and all three candidates are cheap because they need no new data: feature ' +
        'importance drift beyond a band across retrains, a collapse in alert volume on a rule ' +
        'class, and a disposition rate that sits at 99 per cent for more than a few weeks. That ' +
        'last one is the strongest and the most uncomfortable, because it monitors the floor rather ' +
        'than the model, and it would have fired in May. Backtest all three over the twenty-two ' +
        'retrains before promising volumes.',
      standIn:
        'We monitor uptime, latency and accuracy, and accuracy held above 94 per cent the whole ' +
        'time. The held-out set comes from the same disposition history that taught it the mistake, ' +
        'so the model was graded against an answer key it helped write, and it passed. A metric ' +
        'computed from the thing you are testing is not a check. Nothing watches the model change, ' +
        'only the model perform. Three cheap ones, no new data needed: feature importance drift ' +
        'outside a band, alert volume collapse on a rule class, and a disposition rate stuck at 99 ' +
        'per cent for more than a few weeks. That last one watches us rather than the model, and it ' +
        'would have fired in May.',
      commandOptions: [
        { command: 'grep -iE "monitor|alert|threshold" /evidence/fraud/model-monitoring.yaml', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "holdout\\|test_set" /evidence/fraud/pipeline-config.yaml', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status model-monitor', ...STATUS_CHECK },
        { command: 'cat /evidence/fraud/model-monitoring.yaml', ...DUMP_ALL },
        { command: 'grep -c . /evidence/fraud/model-monitoring.yaml', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out where the accuracy metric gets its answer key from.',
      guidance:
        'Accuracy stayed green. Ask what it was measured against.',
    },
    {
      eventId: 'ev.9',
      verdict: 'benign-true-positive',
      firstResponder: 'ai-security',
      alsoAppropriate: ['fusion-analyst', 'soc-operator'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.declare', 'act.isolate', 'act.attribute-named'],
      escalateTo: [],
      why:
        'A second feature dropping sharply, arriving at the moment the floor has learned that a ' +
        'feature dropping sharply is the incident, and this one is the model getting better. ' +
        'Out-of-state transaction importance fell from 0.14 to 0.06 between June and August, and ' +
        'confirmed fraud on out-of-state transactions fell with it. Both track a May product change ' +
        'that added a travel notification flow used by 31,000 members, which the model now consumes ' +
        'directly as a stronger and better signal than geography. Losses on that pattern are down. ' +
        'The discriminator is the one that convicted the other case, run properly: for the first ' +
        'feature, importance fell while the fraud it detected rose, and here importance fell while ' +
        'the fraud it detected also fell. Drift is not the finding. Drift away from a signal that ' +
        'still matters is the finding, and separating those takes one question about outcomes. A ' +
        'floor that flattens that will spend next quarter fighting every improvement the model ' +
        'makes.',
      standIn:
        'Second feature dropped and this one is the model improving. Out-of-state importance 0.14 to ' +
        '0.06 between June and August, and confirmed fraud on out-of-state fell in the same period. ' +
        'Both track the May travel notification flow, 31,000 members using it, which the model now ' +
        'uses directly as a better signal than geography. Losses on that pattern are down. Same ' +
        'check as the other one, opposite answer: there, importance fell while the fraud rose. ' +
        'Drift is not the finding. Drift away from something that still matters is.',
      commandOptions: [
        { command: "awk -F, '$2==\"txn_out_of_state\" {print $1, $3}' /var/log/fraud/feature-importance.csv", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$5==\"txn_out_of_state\" && $6==\"FRAUD_CONFIRMED\"' /var/log/fraud/review-queue.csv | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fraud-scorer', ...STATUS_CHECK },
        { command: 'cat /var/log/fraud/feature-importance.csv', ...DUMP_ALL },
        { command: 'grep -c out_of_state /var/log/fraud/feature-importance.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether the fraud that feature used to catch went up or down as its importance fell.',
      guidance:
        'Another feature decayed. Ask whether the thing it detected got worse or better.',
    },
  ],
};
