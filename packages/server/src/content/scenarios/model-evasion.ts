/**
 * Scenario 43: The Model Says Benign.
 *
 * Somebody found the edge of the decision boundary and stayed on the safe side
 * of it.
 *
 * HOW THIS DIFFERS FROM BAD TEACHER
 *
 * `bad-teacher` poisons the training data, so the model learns something wrong.
 * Here the model is untouched, learned correctly, and is working exactly as
 * built. The attacker changed the input instead.
 *
 * That is a harder problem, because there is nothing to repair. The model has
 * not degraded, its accuracy is genuinely good, and retraining it changes
 * nothing: any classifier has a decision boundary, and anybody who can ask it
 * questions can find out where that boundary is and arrange to sit on the
 * comfortable side of it.
 *
 * WHY THE ORACLE MATTERS
 *
 * The scoring service is reachable from inside the estate with no rate limit
 * and no logging of who is asking. That turns the model from a judge into a
 * teacher: submit four hundred variations, keep the ones that score low, and
 * you have learned the shape of the boundary without ever touching the thing
 * you are trying to do. `ev.4` is the finding that explains everything else,
 * and it is a design decision rather than a compromise.
 *
 * WHAT IT TEACHES
 *
 * That a detection which cannot be interrogated is worth more than one which
 * can, and that the answer to evasion is layering rather than a better model.
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
  TOUCH_ATTACKER,
  WRONG_TARGET,
} from './distractors.js';

const ID = 'the-model-says-benign';

export const THE_MODEL_SAYS_BENIGN: Scenario = {
  id: ID,
  title: 'The Model Says Benign',
  difficulty: 'advanced',
  durationMinutes: 60,
  situation:
    'It is 12:15 at Ardal Freight. A junior analyst reviewing a sample of auto-closed alerts found ' +
    'one that looks wrong. The model scored it 0.11 and the model is not broken.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'ai-security',
    'detection-engineer',
    'forensics',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'An auto-closed alert that a human reading the sample thinks is real',
      detail:
        'The triage model auto-closes anything scoring below 0.25 and 4,100 alerts a month fall ' +
        'below it. A sampling review found one from 6 September: an outbound transfer from the ' +
        'warehouse management server to an external address, scored 0.11 and closed without a ' +
        'human. The analyst reviewing it believes it should have been escalated. Rule history: the ' +
        'model has a measured accuracy of 96.4 percent on its validation set.',
      source: 'triage model',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'process-tree',
      summary: 'Near-identical activity scores 0.91 when small details change',
      detail:
        'Resubmitting the same event with the transfer size increased by 40 KB scores 0.89. ' +
        'Resubmitting it starting at 14:00 instead of 03:20 scores 0.91. Resubmitting it with the ' +
        'session duration unchanged but the inter-packet timing regularised scores 0.87. The ' +
        'original combination scores 0.11. The model behaves consistently on all four.',
      source: 'triage model',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'raw-log',
      summary: 'The transfer carries padding that serves no functional purpose',
      detail:
        'The session includes 11 KB of null padding distributed across the transfer and pauses of ' +
        '400 to 900 milliseconds inserted at irregular intervals. Neither is required by the ' +
        'protocol, neither appears in any other transfer from that host, and both have the effect ' +
        'of moving the session size and timing distribution away from the values the model weights ' +
        'most heavily.',
      source: 'adf-wms-02',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'network-flow',
      summary: 'The scoring service accepted 412 submissions from one internal host in August',
      detail:
        'The model scoring endpoint is reachable from anywhere inside the estate, has no rate limit ' +
        'and does not record which principal submitted a request. Gateway flow records show 412 ' +
        'requests to it from adf-wms-02 between 4 and 29 August, in bursts. The service exists in ' +
        'that shape so engineers can test detections against sample data.',
      source: 'adf-wms-02',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'host-artefact',
      summary: 'A tuning harness on the warehouse server holding scored variations',
      detail:
        'A directory on adf-wms-02 contains a script that generates transfer variations, submits ' +
        'each to the scoring service, and records the returned score. It holds 412 results sorted ' +
        'ascending by score. The lowest twelve share the padding and timing characteristics seen in ' +
        'the 6 September transfer. The script was last run on 29 August.',
      source: 'adf-wms-02',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'The model is the only detection covering this activity',
      detail:
        'Outbound transfer review was moved entirely to the model in February and the six rules ' +
        'that previously covered it were retired, because the model outperformed them on the ' +
        'validation set and the rules produced 900 alerts a month between them. Nothing else ' +
        'evaluates outbound transfers from operational servers. The retirement is documented and ' +
        'was approved.',
      source: 'detection platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Model accuracy dropped 1.2 points after the September data refresh',
      detail:
        'Reported accuracy fell from 97.6 to 96.4 percent after the monthly validation refresh on 1 ' +
        'September. The data science team attribute it to seasonal freight patterns changing the ' +
        'traffic mix, note the same drop in September last year, and expect it to recover in ' +
        'October. Rule history: fired 11 times in thirty days, 11 closed as expected seasonal ' +
        'variation.',
      source: 'model platform',
      claimedSeverity: 'low',
    },
  ],
};

export const THE_MODEL_SAYS_BENIGN_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'The triage model works. It was trained correctly, its accuracy is genuinely good, and nothing has been done to it.',
    'The scoring service it runs on is reachable from anywhere inside the estate, has no rate limit, and does not record who is asking. It is shaped that way so engineers can test detections.',
    'Between 4 and 29 August somebody on the warehouse management server submitted 412 transfer variations to it and kept the scores.',
    'They sorted the results and read off what the model cares about: transfer size, start hour, and the regularity of packet timing.',
    'On 6 September they moved data out in a session shaped to sit under the boundary: 11 KB of pointless null padding and irregular pauses of 400 to 900 milliseconds, neither required by the protocol.',
    'It scored 0.11. The auto-close threshold is 0.25, so no human ever saw it.',
    'Increase the size by 40 KB and it scores 0.89. Move it to two in the afternoon and it scores 0.91. The model is consistent and correct throughout.',
    'In February the six rules that used to cover outbound transfers were retired because the model outperformed them, so nothing else evaluates this at all.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1041'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ai-security', 'log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ai-security', 'ir-lead'],
      why:
        'A junior analyst reading a sample disagrees with a model that is 96.4 percent accurate, and ' +
        'the temptation is to trust the number. Two things make the disagreement worth an hour. ' +
        'Accuracy of 96.4 percent across 4,100 auto-closed alerts a month is roughly 150 wrong ' +
        'decisions a month, and nobody looks at any of them except through this sampling review. ' +
        'And an outbound transfer from an operational server to an external address is a category ' +
        'where being wrong is expensive. The habit worth building is that a sampling review exists ' +
        'precisely so a human can disagree with the model, and treating the score as settling it ' +
        'makes the review theatre.',
      standIn:
        'Sampling review flagged an auto-closed alert from 6 September: outbound transfer from the ' +
        'warehouse server to an external address, scored 0.11, closed with no human. Model is 96.4 ' +
        'percent accurate, which across 4,100 auto-closes a month is about 150 wrong calls nobody ' +
        'sees. The reviewer thinks it is real. Raising it.',
      commandOptions: [
        { command: "awk -F, '$4<0.25 && $6 ~ /outbound/ {print $1, $3, $4}' /var/log/triage/scored.csv | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep "2026-09-06" /var/log/triage/scored.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status triage-model', ...STATUS_CHECK },
        { command: 'cat /var/log/triage/scored.csv', ...DUMP_ALL },
        { command: 'grep -c AUTOCLOSE /var/log/triage/scored.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find the auto-closed alert and work out how many others fall below the threshold each ' +
        'month.',
      guidance:
        'The model is usually right. Ask how many alerts a month "usually" leaves wrong, and who ' +
        'looks at those.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1027'],
      firstResponder: 'ai-security',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.write-rule', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'detection-engineer'],
      why:
        'The experiment only this seat thinks to run, and it settles what kind of problem this is. ' +
        'Change the size by 40 KB and it scores 0.89. Move it to the afternoon and 0.91. ' +
        'Regularise the packet timing and 0.87. The original combination scores 0.11 and the model ' +
        'behaves consistently on all four, which means it is not broken, not drifting and not ' +
        'confused. It has a decision boundary, as every classifier does, and this transfer is ' +
        'sitting just inside it on three axes at once. That is not something that happens by ' +
        'chance: the probability of one session accidentally landing on the comfortable side of ' +
        'size, hour and timing simultaneously is the finding. Somebody knew where the edge was.',
      standIn:
        'Same event, 40 KB bigger, scores 0.89. Same event at two in the afternoon, 0.91. Same event ' +
        'with regular packet timing, 0.87. Original combination, 0.11. The model is consistent on ' +
        'all four, so it is not broken or drifting. It has a boundary and this transfer is inside it ' +
        'on three axes at once. That does not happen by accident.',
      commandOptions: [
        { command: 'for v in size hour timing; do curl -s -XPOST localhost:9090/score -d @variants/$v.json; done', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$1 ~ /variant/ {print $1, $4}' /var/log/triage/replay.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status triage-model', ...STATUS_CHECK },
        { command: 'cat /var/log/triage/scored.csv', ...DUMP_ALL },
        { command: 'grep -c variant /var/log/triage/replay.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Change one attribute of the event at a time, rescore it, and see which changes move the ' +
        'number.',
      guidance:
        'Ask whether the model is wrong or whether this event was built to score low. Rescoring ' +
        'variations tells you which.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1027', 'T1030'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'network-analyst'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.write-rule'],
      escalateTo: ['ir-lead', 'ai-security'],
      why:
        'The physical evidence of intent, and it is the kind of finding that is only visible once ' +
        'you know what to look for. Eleven kilobytes of null padding and pauses of 400 to 900 ' +
        'milliseconds at irregular intervals, neither required by the protocol and neither present ' +
        'in any other transfer from that host. Padding that carries nothing and pauses that achieve ' +
        'nothing are not artefacts of a tool or a network condition, they are work somebody did. ' +
        'The purpose is exactly what ev.2 measured: move the size and timing distribution away from ' +
        'the values the model weights. This is what "shaped to evade" looks like concretely, and it ' +
        'is worth putting in the report in those terms, because it rules out coincidence in a way ' +
        'the scoring experiment alone does not.',
      standIn:
        'The session has 11 KB of null padding spread through it and irregular pauses of 400 to 900 ' +
        'milliseconds. Neither is required by the protocol and neither appears in any other ' +
        'transfer from that host. Padding that carries nothing and pauses that do nothing are work ' +
        'somebody did, and they move exactly the two things the model weights.',
      commandOptions: [
        { command: 'tcpdump -r /var/cap/wms02-0906.pcap -A | grep -c "\\\\x00\\\\x00\\\\x00\\\\x00"', correct: true, teaches: CORRECT_STEP },
        { command: "tshark -r /var/cap/wms02-0906.pcap -T fields -e frame.time_delta | sort -n | tail -20", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status wms', ...STATUS_CHECK },
        { command: 'cat /var/log/wms/transfers.log', ...DUMP_ALL },
        { command: 'grep -c transfer /var/log/wms/transfers.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at what is inside the transfer and at the gaps between packets, and ask what either ' +
        'is for.',
      guidance:
        'Ask whether anything in this session serves no purpose. Wasted bytes are usually there for ' +
        'a reason.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'discovery',
      critical: true,
      techniques: ['T1595'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ai-security', 'detection-engineer'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'ai-security'],
      why:
        'The finding that explains all the others, and it is a design decision rather than a ' +
        'compromise. The scoring endpoint is reachable from anywhere inside the estate, has no rate ' +
        'limit, and does not record which principal submitted a request. That last part is why ' +
        'nobody noticed 412 submissions from a warehouse server over three weeks. A detection that ' +
        'answers questions is a detection that can be studied: the model stopped being a judge and ' +
        'became a teacher the moment it would score anything anybody asked. The endpoint is that ' +
        'shape for a real reason, so engineers can test detections against sample data, and the fix ' +
        'is authentication and logging rather than removal.',
      standIn:
        'The scoring endpoint takes requests from anywhere inside the estate, has no rate limit and ' +
        'does not log which principal is asking. Gateway records show 412 requests to it from the ' +
        'warehouse server between 4 and 29 August, in bursts. A model that will score anything you ' +
        'ask has stopped being a judge and become a teacher. It is that shape so engineers can test ' +
        'detections, which is a real need.',
      commandOptions: [
        { command: "awk '$4 ~ /:9090/ {print $2}' /var/log/gateway/flows.log | sort | uniq -c | sort -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c "adf-wms-02.*9090" /var/log/gateway/flows.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status triage-model', ...STATUS_CHECK },
        { command: 'cat /var/log/gateway/flows.log', ...DUMP_ALL },
        { command: 'curl -s -XPOST 198.51.100.44:9090/score', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out who can reach the scoring service and whether anybody has been asking it a lot of ' +
        'questions.',
      guidance:
        'Ask whether the model can be queried by anybody who wants to. If it can, ask who has been.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'discovery',
      critical: true,
      techniques: ['T1595'],
      firstResponder: 'forensics',
      alsoAppropriate: ['ai-security', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The proof, and it removes every remaining innocent reading. A script that generates ' +
        'transfer variations, submits each one to the scoring service, records the score, and holds ' +
        '412 results sorted ascending. The lowest twelve share the padding and timing ' +
        'characteristics of the 6 September transfer. That is a deliberate, methodical search for ' +
        'the decision boundary, run over three weeks, with the output kept. It also dates the ' +
        'preparation: last run 29 August, transfer on 6 September, so eight days between finding ' +
        'the gap and using it. Preserve carefully, because the sorted results are the clearest ' +
        'statement of intent available and this will be a prosecution rather than an incident ' +
        'report.',
      standIn:
        'There is a script on the warehouse server that generates transfer variations, scores each ' +
        'one against the model, and records the result. 412 results, sorted ascending by score. The ' +
        'lowest twelve have the same padding and timing as the 6 September transfer. Last run 29 ' +
        'August, transfer on 6 September. Sealed and hashed.',
      commandOptions: [
        { command: 'ls -la /opt/wms/.cache/ && head -20 /opt/wms/.cache/results.csv', correct: true, teaches: CORRECT_STEP },
        { command: 'find /opt /home -name "*.py" -newermt "2026-08-01" -type f -ls', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status wms', ...STATUS_CHECK },
        { command: 'cat /opt/wms/.cache/results.csv', ...DUMP_ALL },
        { command: 'rm -rf /opt/wms/.cache/', ...MUTATE },
      ],
      commandNudge:
        'Look on the host that was submitting to the scoring service for whatever was doing the ' +
        'submitting.',
      guidance:
        'Something sent 412 requests. Ask what is on that host that would do it, and whether it ' +
        'kept the answers.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1562.001'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['ai-security', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.declare', 'act.write-rule'],
      escalateTo: ['ir-lead'],
      why:
        'Why one evasion was enough, and it is the structural finding. In February the six rules ' +
        'covering outbound transfers were retired because the model outperformed them on the ' +
        'validation set and they produced 900 alerts a month between them. That was a defensible ' +
        'decision made with real numbers, and it left the estate with a single point of judgement ' +
        'on this activity. A crude rule that fires on any outbound transfer over a size from an ' +
        'operational server is worse than the model on every metric anybody measures, and it would ' +
        'have caught this, because it cannot be reasoned around by shaping a distribution. The ' +
        'recommendation is not to distrust the model, it is that a model should be one layer rather ' +
        'than the layer, and the way to argue for that is exactly this incident.',
      standIn:
        'Outbound transfer review went entirely to the model in February and the six rules that ' +
        'covered it were retired, because it beat them on the validation set and they made 900 ' +
        'alerts a month. Defensible on the numbers, and it left one point of judgement. A dumb rule ' +
        'on transfer size from operational servers is worse on every metric and would have caught ' +
        'this, because you cannot shape a distribution around a threshold. The model should be a ' +
        'layer, not the layer.',
      commandOptions: [
        { command: "awk '$4==\"RETIRED\" {print $1, $3, $6}' /var/log/detection/rule-changes.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "outbound transfer" /etc/detection/rules.yaml', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/detection/rule-changes.log', ...DUMP_ALL },
        { command: 'grep -c RETIRED /var/log/detection/rule-changes.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out what else evaluates outbound transfers, and what used to.',
      guidance:
        'One evasion worked completely. Ask what else was watching, and what happened to it.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ai-security'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.corroborate'],
      escalateTo: [],
      why:
        'A 1.2 point accuracy drop on the model, on the day the floor is investigating that model ' +
        'failing to catch something. It is seasonal freight patterns changing the traffic mix, the ' +
        'same drop happened in September last year, the data science team expect recovery in ' +
        'October, and 11 of 11 this month were closed the same way. Two checks settle it: is there ' +
        'a prior year comparison, and does the drop coincide with the evasion. It does not, and the ' +
        'contrast is worth carrying into the report because it is instructive rather than just a ' +
        'dismissal. Model degradation is visible, measured, alerted on and seasonal. Model evasion ' +
        'produced no metric movement at all, because a correctly working model scoring a ' +
        'deliberately shaped input is not an error and does not show up as one.',
      standIn:
        'Accuracy down 1.2 points after the September validation refresh, attributed to seasonal ' +
        'freight patterns, same drop last September, expected to recover in October. Eleven of ' +
        'eleven this month were the same. Not our problem, and worth noting why: degradation shows ' +
        'up in the metrics and evasion does not, because the model was not wrong.',
      commandOptions: [
        { command: "awk -F, '{print $1, $3}' /var/log/model/accuracy-history.csv | tail -24", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "seasonal\\|september" /var/log/model/ds-notes.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status model-platform', ...STATUS_CHECK },
        { command: 'cat /var/log/model/accuracy-history.csv', ...DUMP_ALL },
        { command: 'grep -c accuracy /var/log/model/accuracy-history.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Compare this accuracy drop against the same month last year.',
      guidance:
        'Ask whether the model got worse or whether the input was shaped. Only one of those moves ' +
        'the accuracy number.',
    },
  ],
};
