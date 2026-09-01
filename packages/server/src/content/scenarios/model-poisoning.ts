/**
 * Scenario 17: Bad Teacher.
 *
 * The triage assistance model, taught over five weeks to be blind in one
 * specific place.
 *
 * WHY THE AI SECURITY SEAT EXISTS
 *
 * Everywhere else on this platform that seat is padding, and Ridgeline says so
 * out loud in its own roster comment. Here it is the only seat that can reach
 * the answer, because the compromised asset is a model, the attack is against
 * its training data, and none of the other consoles have anything to say about
 * either.
 *
 * WHAT MAKES IT DIFFERENT FROM EVERY OTHER SCENARIO
 *
 * There is no intrusion into the model. Nobody broke into the training
 * pipeline, no credential was stolen, and no unauthorised change was made. The
 * attacker fed the system exactly what it was designed to consume: analyst
 * feedback. The model learned from it correctly. A correctly functioning
 * learning system, trained on inputs an attacker chose, is not a compromise in
 * any conventional sense, and the floor has to work out what it is instead.
 *
 * THE HARDEST PART
 *
 * The evidence of harm is an absence. What proves the poisoning is a class of
 * alert that stopped being escalated, and nobody has ever built a dashboard for
 * things that stopped happening. `ev.3` is that absence, and it is the event the
 * whole scenario turns on.
 *
 * THE TRAP
 *
 * `ev.6` offers the comfortable conclusion that the model is simply
 * underperforming and needs retraining. Retraining on the poisoned corpus makes
 * it worse, and the floor has to notice that fixing the model means fixing the
 * data.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';
import {
  BROAD_SEARCH,
  COUNT_ONLY,
  CORRECT_STEP,
  DUMP_ALL,
  MUTATE,
  STATUS_CHECK,
  TOUCH_ATTACKER,
  WRONG_TARGET,
} from './distractors.js';

const ID = 'bad-teacher';

export const BAD_TEACHER: Scenario = {
  id: ID,
  title: 'Bad Teacher',
  difficulty: 'advanced',
  durationMinutes: 60,
  situation:
    'It is 11:00. The triage assistance model has been in production for eight months and its ' +
    'accuracy metrics are the best they have ever been. A quality review sampled its ' +
    'recommendations and found something the metrics do not show.',
  roles: [
    'soc-operator',
    'log-analyst',
    'ai-security',
    'cloud-security',
    'detection-engineer',
    'fusion-analyst',
    'ir-lead',
    // Threat Intel is unseated. There is no external tradecraft to map here and
    // no traffic to work: the whole incident happens inside a feedback table.
    // A seat with nothing of its own is an hour of watching somebody else.
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Quality review found the assistance model recommending dismiss on a live intrusion',
      detail:
        'A monthly sample of 200 model recommendations included four alerts relating to outbound ' +
        'connections from build infrastructure. The model recommended dismiss on all four with ' +
        'confidence above 0.9. Two of the four are now known to be a live compromise. Overall ' +
        'reported accuracy for the month is 94.2 percent, its highest ever. Rule history: quality ' +
        'review is a monthly process, not a detection.',
      source: 'model quality review',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 160,
      surface: 'process-tree',
      summary: 'Model confidence on build-infrastructure egress inverted over five weeks',
      detail:
        'Inference logs show that for alerts matching build agent outbound connections, the model ' +
        'escalate confidence fell from 0.81 to 0.06 between weeks 3 and 8, while its confidence on ' +
        'every other alert class stayed flat. The shift is smooth rather than stepped. No model ' +
        'version was deployed in that window: the change came entirely from continuous learning on ' +
        'analyst feedback.',
      source: 'inference logs',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'alert-queue',
      summary: 'No build-infrastructure egress alert has been escalated in nineteen days',
      detail:
        'Alerts in that class continue to be generated at the normal rate of six to nine a day. ' +
        'None has been escalated since the 12th. Before that the escalation rate for this class ' +
        'was roughly one in four. Nothing alerts on an escalation rate falling to zero, and the ' +
        'queue dashboard shows the class as healthy because the alerts are being closed promptly.',
      source: 'alert queue metrics',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.4',
      atSeconds: 480,
      surface: 'cloud-audit',
      summary: 'One account submitted 1,847 feedback labels in five weeks',
      detail:
        'The feedback interface records 1,847 submissions from the account a.pemberton between ' +
        'weeks 3 and 8, against a floor-wide median of 40 a week per analyst. 1,790 of them label ' +
        'build-infrastructure egress alerts as not worth acting on. The account is a genuine ' +
        'analyst account and submitting feedback is its job. No permission was exceeded.',
      source: 'a.pemberton',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 630,
      surface: 'raw-log',
      summary: 'Feedback submissions arrive at machine cadence outside working hours',
      detail:
        'The 1,847 submissions cluster between 22:00 and 04:00, spaced 8 to 14 seconds apart in ' +
        'runs of 60 to 90. The account holder works days and their badge records show no ' +
        'out-of-hours attendance. The submissions come from an API token issued to that account ' +
        'for a reporting integration, not from the web interface.',
      source: 'a.pemberton',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 790,
      surface: 'alert-queue',
      summary: 'Model owner proposes an immediate retrain to correct the drift',
      detail:
        'The platform team has raised a change request to retrain the model from the current ' +
        'feedback corpus, describing the issue as accuracy drift. The retrain would take four ' +
        'hours and use all feedback collected to date. The team notes that reported accuracy is ' +
        'at an all-time high and expects retraining to resolve any inconsistency.',
      source: 'platform team',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'Model inference latency rose 30 percent after a hosting migration',
      detail:
        'Median inference latency went from 180 ms to 234 ms following the migration of the model ' +
        'serving infrastructure to new hardware on the 20th. The change is documented, has a ' +
        'ticket, and the platform team has an open performance tuning task. Recommendation quality ' +
        'is unaffected by latency. Rule history: fired 18 times in thirty days, 18 closed as ' +
        'expected post-migration.',
      source: 'model serving',
      claimedSeverity: 'low',
    },
  ],
};

export const BAD_TEACHER_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'The triage assistance model learns continuously from analyst feedback, which is what it was designed to do.',
    'Somebody holding an API token issued to a genuine analyst account submitted 1,847 feedback labels over five weeks, at night, at machine cadence.',
    'Almost all of them labelled build-infrastructure egress alerts as not worth acting on.',
    'The model learned correctly from what it was given. Its escalate confidence for that one alert class fell from 0.81 to 0.06 while every other class stayed flat.',
    'No build-infrastructure egress alert has been escalated in nineteen days, and nothing alerts on an escalation rate reaching zero.',
    'Reported accuracy is at an all-time high, because accuracy is measured against the same poisoned feedback that caused the problem.',
    'Two live compromises are sitting in that blind spot right now, and retraining on the current corpus would deepen it rather than fix it.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1565.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ai-security', 'ir-lead'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.isolate', 'act.declare'],
      escalateTo: ['ai-security', 'ir-lead'],
      why:
        'Two numbers that cannot both be comfortable: 94.2 percent accuracy, the best ever, and ' +
        'confident dismiss recommendations on two alerts that turned out to be a live compromise. ' +
        'The instinct is to treat four bad calls in a sample of 200 as within tolerance, which it ' +
        'statistically is. What makes it worth escalating is that all four are the same alert ' +
        'class, and errors that cluster are not random error, they are a pattern. The other thing ' +
        'to notice early is that the accuracy figure is not independent evidence: it is measured ' +
        'against analyst feedback, which is the thing under suspicion.',
      standIn:
        'Quality sample found the model recommending dismiss above 0.9 confidence on four ' +
        'build-infrastructure egress alerts, and two of those are a live compromise. Reported ' +
        'accuracy is 94.2 percent, its best ever. All four errors are the same class. Raising it to ' +
        'AI security.',
      commandOptions: [
        { command: 'grep -c "recommend=dismiss" /var/log/model/inference.log', ...COUNT_ONLY },
        { command: 'awk \'/dismiss/ && $6>0.9 {print $4}\' /var/log/model/inference.log | sort | uniq -c', correct: true, teaches: CORRECT_STEP },
        { command: 'cat /var/log/model/quality-review-monthly.json | head -30', ...WRONG_TARGET },
        { command: 'systemctl status model-serving', ...STATUS_CHECK },
        { command: 'ls -la /var/log/model/', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check whether the wrong recommendations are spread across alert types or concentrated in ' +
        'one.',
      guidance:
        'Ask what the accuracy number is measured against. If it is the same data you doubt, it is ' +
        'not evidence.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1565.001'],
      firstResponder: 'ai-security',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'The measurement that turns a suspicion into a finding, and only this seat has the console ' +
        'for it. Escalate confidence on one alert class falling from 0.81 to 0.06 while every other ' +
        'class stays flat is not degradation, because degradation is broad. It is targeted, and the ' +
        'flatness elsewhere is what proves it. Two further details close it off. The curve is ' +
        'smooth rather than stepped, so this was not a configuration change or a bad deployment. ' +
        'And no model version shipped in that window, so the only input that could have moved it is ' +
        'the continuous learning, which means the training data is the attack surface.',
      standIn:
        'Escalate confidence for build-infrastructure egress fell from 0.81 to 0.06 between weeks 3 ' +
        'and 8. Every other alert class is flat. The curve is smooth, not stepped, and no model ' +
        'version was deployed in that window. This was taught, not broken.',
      commandNudge:
        'Compare the confidence trend for this alert class against every other class over the same ' +
        'weeks.',
      guidance:
        'Ask whether the model got worse at everything or worse at one thing. The answer tells you ' +
        'whether it was damaged or taught.',
    },
    {
      eventId: 'ev.3',
      critical: true,
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1565.001', 'T1562'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['ai-security', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.declare', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'The event the scenario turns on, and it is an absence. Alerts in that class arrive at the ' +
        'normal six to nine a day and not one has been escalated in nineteen days, where the prior ' +
        'rate was one in four. The dashboard shows the class as healthy, because it measures ' +
        'whether alerts are being closed promptly and they are, very promptly, all of them. Nobody ' +
        'builds monitoring for a thing that stopped happening, which is precisely why an escalation ' +
        'rate reaching zero is invisible. This is the detection worth proposing out of tonight and ' +
        'it has nothing to do with models: any alert class whose escalation rate goes to zero while ' +
        'its volume stays flat is worth a human looking, whether the cause is poisoning, a broken ' +
        'rule, or an analyst quietly closing everything.',
      standIn:
        'Alerts in that class are still arriving at six to nine a day and none has been escalated ' +
        'since the 12th. It used to be one in four. The dashboard says healthy because they are all ' +
        'being closed quickly. Nothing anywhere alerts on an escalation rate hitting zero.',
      commandOptions: [
        { command: 'awk \'/build-egress/ && /escalate/ {print $1}\' /var/log/queue/decisions.log | uniq -c', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c build-egress /var/log/queue/alerts.log', ...COUNT_ONLY },
        { command: 'awk \'/build-egress/ {print $5}\' /var/log/queue/decisions.log | sort | uniq -c', ...WRONG_TARGET },
        { command: 'cat /var/log/queue/dashboard-state.json', ...DUMP_ALL },
        { command: 'date -d "19 days ago"', ...WRONG_TARGET },
      ],
      commandNudge:
        'Compare how many of that class arrive against how many get escalated, over time.',
      guidance:
        'Ask what has STOPPED happening. Nothing alerts on an absence, so you have to go looking ' +
        'for it.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1565.001'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ai-security', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'The mechanism. 1,847 submissions against a floor-wide median of 40 a week, 1,790 of them ' +
        'labelling one alert class as not worth acting on. Every submission is permitted, because ' +
        'submitting feedback is exactly what an analyst account is for, so no permission was ' +
        'exceeded and nothing was bypassed. This is worth saying plainly in the report: the system ' +
        'was not broken into, it was fed. A learning system consumes what it is given and its ' +
        'inputs are an attack surface in a way most people never think about. Be careful with the ' +
        'account name at this point, because a genuine analyst account being the source is not the ' +
        'same as that analyst being the author.',
      standIn:
        'One account submitted 1,847 feedback labels in five weeks against a floor median of 40 a ' +
        'week, and 1,790 of them label build-infrastructure egress as not worth acting on. All ' +
        'permitted. Nothing was bypassed. It is a genuine analyst account and I am reporting the ' +
        'account, not the person.',
      commandNudge:
        'Compare how much feedback this account submitted against what a normal analyst submits.',
      guidance:
        'Nothing here exceeded a permission. Ask what the system was DESIGNED to accept, and ' +
        'whether that is an input somebody can abuse.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1078.004'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reset-password', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'The event that clears the analyst and identifies the real mechanism. Submissions between ' +
        '22:00 and 04:00, spaced 8 to 14 seconds apart in runs of 60 to 90, from an API token ' +
        'issued for a reporting integration rather than from the web interface the analyst actually ' +
        'uses. The badge records show they were not in the building. That is three independent ' +
        'reasons it is not them, and finding them matters as much as any technical finding tonight: ' +
        'the alternative was a floor accusing a colleague of sabotaging the detection stack. The ' +
        'real finding is that a token issued for reporting could write training feedback, which is ' +
        'a scoping failure nobody would have noticed until it was used.',
      standIn:
        'The submissions cluster between 22:00 and 04:00 at 8 to 14 second intervals in runs of 60 ' +
        'to 90, from an API token issued to that account for a reporting integration, not from the ' +
        'web interface. Badge records show the account holder was not in the building. It is not ' +
        'them. That token should never have been able to write feedback.',
      commandOptions: [
        { command: 'awk \'$4=="a.pemberton" {print $1, $2}\' /var/log/feedback/submissions.log | head -30', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c pemberton /var/log/feedback/submissions.log', ...COUNT_ONLY },
        { command: 'grep pemberton /var/log/physical/access.log | tail', ...WRONG_TARGET },
        { command: 'cat /var/log/api/token-scopes.json | grep -A5 pemberton', ...WRONG_TARGET },
        { command: 'last | grep pemberton', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check when the submissions happened and whether they came from a person or a token.',
      guidance:
        'A genuine account is not a genuine person. Check the timing, the cadence, and where the ' +
        'account holder actually was.',
    },
    {
      eventId: 'ev.6',
      critical: true,
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1565.001'],
      firstResponder: 'ai-security',
      alsoAppropriate: ['ir-lead', 'detection-engineer'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.write-rule', 'act.reimage-now', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'A well-intentioned change request that would make things worse, raised by a team acting in ' +
        'good faith on the information they have. Retraining from the current corpus retrains on ' +
        '1,790 poisoned labels, so the blind spot comes back sharper and now carries a fresh ' +
        'timestamp and a completed remediation ticket. The framing is the giveaway: calling this ' +
        'accuracy drift assumes the model degraded on its own, and it did not. Stopping this is the ' +
        'highest-value action available on the floor right now, ahead of anything about the token, ' +
        'and the correct sequence is to freeze learning, quarantine the 1,847 submissions, and ' +
        'restore from a checkpoint before week 3. Worth noting the team is not wrong to want to ' +
        'retrain, only wrong about what to retrain on.',
      standIn:
        'Platform team wants to retrain from the current feedback corpus, calling it accuracy ' +
        'drift. That corpus contains the 1,790 poisoned labels, so retraining deepens the blind ' +
        'spot and gives it a closed ticket. Freeze learning, quarantine those submissions, restore ' +
        'a checkpoint from before week 3. Stopping that change is more urgent than the token.',
      commandNudge:
        'Work out what data the proposed retrain would actually use.',
      guidance:
        'Ask what the fix would be trained on. If it is the poisoned data, the fix is the attack ' +
        'again.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.corroborate'],
      escalateTo: [],
      why:
        'A real 30 percent latency increase on the model serving infrastructure, on a day the floor ' +
        'is investigating that model, with a documented migration, a ticket and an open tuning ' +
        'task. Eighteen of eighteen closed the same way this month. It is genuinely unrelated: ' +
        'latency is how fast a recommendation arrives and has no bearing on what the recommendation ' +
        'is, and the migration on the 20th postdates a confidence shift that began in week 3. Two ' +
        'checks settle it, which are the date and whether quality is affected. Including it would ' +
        'attach an infrastructure performance issue to a data poisoning incident and hand the ' +
        'platform team a reason to think the whole thing is a hosting problem.',
      standIn:
        'Inference latency up 30 percent after the hardware migration on the 20th, documented, with ' +
        'a ticket and a tuning task open. Our confidence shift started in week 3, well before that, ' +
        'and latency does not change what the model recommends. Eighteen of eighteen this month ' +
        'were the same. Closing it.',
      commandOptions: [
        { command: 'grep latency /var/log/model/serving.log | tail -20', ...WRONG_TARGET },
        { command: 'awk \'/latency/ {print $5}\' /var/log/model/serving.log | tail -30', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i migration /var/log/change-management.log', ...WRONG_TARGET },
        { command: 'cat /var/log/model/quality-review-monthly.json | grep -i latency', ...WRONG_TARGET },
        { command: 'systemctl status model-serving', ...STATUS_CHECK },
      ],
      commandNudge:
        'Check when the latency changed against when the confidence started shifting.',
      guidance:
        'Ask whether how FAST an answer arrives can change WHAT the answer is.',
    },
  ],
};
