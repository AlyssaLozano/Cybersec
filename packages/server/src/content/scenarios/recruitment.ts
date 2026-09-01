/**
 * Scenario 56: The Recruiter.
 *
 * Fourteen weeks of entirely reasonable document access, and one of the two
 * accounts doing it is being emptied.
 *
 * WHAT THIS TEACHES
 *
 * That some theft has no day on which it happened, and that thresholds cannot
 * see it by construction.
 *
 * Nothing here spikes. No week crosses a policy limit, no download is large, no
 * file leaves by any monitored channel, and any single day's access is
 * defensible on its own terms. What changed is scope: over fourteen weeks the
 * account drifted outward from its own product area into adjacent ones at about
 * one new area every ten days, which is a shape no threshold detects because a
 * threshold is a line and this never approaches one.
 *
 * WHY DRIFT ALONE PROVES NOTHING
 *
 * Sixty-one accounts in the estate show the same drift, because widening scope
 * is also exactly what somebody growing into a bigger job looks like. Reading
 * outside your area is what a person does when they are given more to do, and
 * at this company most remit changes are never written down anywhere.
 *
 * WHAT SEPARATES THEM
 *
 * Output. Somebody reading a new area because they now work in it produces
 * things in it: authored documents, meetings, ticket comments, arguments in
 * email. Somebody reading a new area to take it with them produces nothing at
 * all. Of sixty-one drifting accounts, two have no output, and one of those two
 * is not a person.
 *
 * AND WHAT THE FLOOR STILL CANNOT DO
 *
 * Say why. The output is a bounded question for the people who are allowed to
 * ask it, a containment that does not single anybody out, and a refusal to
 * monitor an individual without sign-off from somebody senior enough to carry
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

const ID = 'the-recruiter';

export const THE_RECRUITER: Scenario = {
  id: ID,
  title: 'The Recruiter',
  difficulty: 'advanced',
  durationMinutes: 75,
  situation:
    'It is Tuesday afternoon at Ardal Freight. The quarterly access review has flagged two ' +
    'accounts for reading outside their assigned product area. Neither has broken a single policy.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'forensics',
    'cloud-security',
    'detection-engineer',
    'fusion-analyst',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Quarterly access review flags two accounts reading outside their product area',
      detail:
        'The quarterly review lists p.raithe and t.vansittart, both pricing analysts, as having ' +
        'read documents outside their assigned product area in each of the last fourteen weeks. ' +
        'Neither has triggered a data loss policy, exceeded a download limit, or been the subject ' +
        'of a report. The review is a spreadsheet produced by the information governance team and ' +
        'is not a detection. Rule history: no rule fired on either account in ninety days.',
      source: 'information governance',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 160,
      surface: 'raw-log',
      summary: 'The widening is gradual and never approaches a limit',
      detail:
        'Both accounts start the period reading only in their own product area. Over fourteen ' +
        'weeks each adds new areas at roughly one every ten days, reaching six areas by week ' +
        'fourteen. Weekly document opens rise from around 30 to around 95. The data loss policy ' +
        'alerts at 200 opens in a week and at any single download over 50 megabytes. Neither ' +
        'account came within half of either limit on any week.',
      source: 'document platform',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'cloud-audit',
      summary: 'What the t.vansittart account produced in the new areas',
      detail:
        'In the same fourteen weeks the t.vansittart account authored 12 documents in the newly ' +
        'read areas, attended 30 meetings with those areas in the invitation, left 61 comments on ' +
        'tickets belonging to them, and is named as a reviewer on four pricing proposals. The ' +
        'account also has a project assignment recorded in the HR system dated 2 June covering ' +
        'three of the six areas.',
      source: 't.vansittart',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.4',
      atSeconds: 480,
      surface: 'cloud-audit',
      summary: 'What the p.raithe account produced in the new areas',
      detail:
        'In the same fourteen weeks the p.raithe account authored no documents in the newly read ' +
        'areas, attended no meetings with those areas in the invitation, left no ticket comments ' +
        'on them, and appears as a reviewer on nothing. It sent four emails referencing them, all ' +
        'four being one-line acknowledgements of material somebody else circulated. The account ' +
        'read 1,180 documents across those areas in the period.',
      source: 'p.raithe',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 660,
      surface: 'host-artefact',
      summary: 'The reads are ordered by contract renewal date',
      detail:
        'Reconstructing the p.raithe reading order shows the lane pricing models for 40 customer ' +
        'accounts opened in ascending order of contract renewal date, starting with the four ' +
        'renewing in October and working forward. The margin floor table was opened eleven times ' +
        'across the period. Nothing was downloaded, printed or exported: every document was ' +
        'rendered in the browser and closed.',
      source: 'p.raithe',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 820,
      surface: 'network-flow',
      summary: 'Fourteen weeks with no upload, no removable media and no personal mail',
      detail:
        'Data loss telemetry for the p.raithe account over the period records zero uploads to ' +
        'personal storage, zero removable media writes, zero print jobs, and no mail to any ' +
        'non-corporate address. The endpoint agent was healthy and reporting throughout, and the ' +
        'same telemetry caught eleven policy violations by other staff in the same period.',
      source: 'data loss prevention',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 980,
      surface: 'alert-queue',
      summary: 'Sixty-one accounts drift. Two produce nothing',
      detail:
        'Applying the same fourteen-week comparison across the estate finds 61 accounts whose ' +
        'reading scope widened by three or more areas. Fifty-nine of those show authored ' +
        'documents, meetings or ticket activity in the new areas. Two show none: p.raithe and ' +
        'svc-index-ardal. Separately, personnel records show that 60 per cent of role changes at ' +
        'this company in the last year have no corresponding HR record, so the absence of a ' +
        'documented remit change means very little on its own.',
      source: 'estate comparison',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1140,
      surface: 'alert-queue',
      summary: 'svc-index-ardal is the search indexer',
      detail:
        'svc-index-ardal is the document platform search indexing service. It reads every document ' +
        'in every area it is pointed at, produces nothing because it is not a person, and its ' +
        'scope widened in the period because three product areas were migrated onto the platform ' +
        'in June and July. The migration is recorded in the change system. It has held the same ' +
        'permissions since 2023.',
      source: 'svc-index-ardal',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.9',
      atSeconds: 1300,
      surface: 'raw-log',
      summary: 'No detection can be written against a limit for this',
      detail:
        'The existing controls are a weekly open count, a download size limit, and an alert on ' +
        'access to any document classified commercially sensitive. The margin floor table is ' +
        'classified commercially sensitive and generated 340 access alerts in ninety days across ' +
        'the pricing function, of which 340 were closed as routine. Over the period the p.raithe ' +
        'account never reached half of any numeric limit.',
      source: 'detection coverage',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.10',
      atSeconds: 1460,
      surface: 'alert-queue',
      summary: 'Everything the pricing function needs is readable by the whole pricing function',
      detail:
        'Fourteen people hold the pricing analyst role and all fourteen can read every lane pricing ' +
        'model, every contract renewal date and the margin floor table, because the function ' +
        'reprices reactively and analysts cover for each other. The October renewal round begins ' +
        'in three weeks and requires all of it. There is no request-based access model and no ' +
        'watermarking on any of these documents.',
      source: 'commercial operations',
      claimedSeverity: 'high',
    },
  ],
};

export const THE_RECRUITER_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Over fourteen weeks the p.raithe account widened its document reading from one product area to six, adding roughly one new area every ten days and never approaching any policy limit.',
    'It read 1,180 documents in those areas and produced nothing in any of them: no authored documents, no meetings, no ticket comments, and four emails that are one-line acknowledgements.',
    'The lane pricing models for 40 customer accounts were opened in ascending order of contract renewal date, beginning with the four renewing in October. The margin floor table was opened eleven times.',
    'Nothing was downloaded, printed or exported. Every document was rendered in the browser and closed, and fourteen weeks of data loss telemetry from a healthy agent records no upload, no removable media and no personal mail.',
    'The second flagged account, t.vansittart, drifted the same way and produced 12 authored documents, 30 meetings and 61 ticket comments in the new areas, with a project assignment recorded on 2 June.',
    'Across the estate 61 accounts show the same widening. Fifty-nine of them produce output in the new areas. Two do not: p.raithe, and svc-index-ardal, which is the search indexing service and not a person.',
    'No existing control can see this. The limits are a weekly open count and a download size, and the account never reached half of either.',
    'Why the account did it is not established and is not answerable from any system this floor holds.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1213.002'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.attribute-named', 'act.reset-password'],
      escalateTo: ['log-analyst', 'cloud-security'],
      why:
        'Everything about this row argues for closing it. It is a spreadsheet from information ' +
        'governance rather than a detection, no rule has fired on either account in ninety days, ' +
        'no policy has been broken and the severity is low. That is precisely the profile of the ' +
        'thing that never gets worked, and it is worth noticing that the reason is not laziness: a ' +
        'floor is built to respond to detections, and this arrived by the one route that does not ' +
        'look like one. The single fact worth keeping is the duration. Fourteen consecutive weeks ' +
        'is not a bad day or a curious afternoon, and something that has been true every week ' +
        'since June is either a change in somebody job or a change in their intentions. Raise it, ' +
        'hold it open, and do not touch either account: at this point the only thing established ' +
        'is that two analysts read widely.',
      standIn:
        'Access review flagged two pricing analysts reading outside their area, low severity, no ' +
        'policy broken, no rule fired in ninety days. It is a governance spreadsheet, not a ' +
        'detection, which is exactly why nobody works these. The bit I am keeping is fourteen ' +
        'consecutive weeks. That is either somebody job changing or somebody intentions changing. ' +
        'Raising it, holding it open, not touching either account.',
      commandOptions: [
        { command: "awk -F, '$3==\"OUT-OF-AREA\" {print $2}' /var/log/govreview/2026-q3.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -iE "raithe|vansittart" /var/log/govreview/2026-q3.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status docplatform', ...STATUS_CHECK },
        { command: 'cat /var/log/govreview/2026-q3.csv', ...DUMP_ALL },
        { command: 'grep -c OUT-OF-AREA /var/log/govreview/2026-q3.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check how many consecutive weeks this has been true before you decide it is nothing.',
      guidance:
        'Nothing here broke a rule. Ask how long it has been going on anyway.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1213.002'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['detection-engineer', 'fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.tune', 'act.reset-password'],
      escalateTo: ['cloud-security', 'fusion-analyst'],
      why:
        'The shape, and the shape is the reason nothing ever fired. One new area every ten days, ' +
        'thirty weekly opens becoming ninety-five, and the limits are two hundred opens a week and ' +
        'fifty megabytes in a download. Neither account came within half of either on any week of ' +
        'fourteen. That is not evasion in the sense of somebody testing where the line is; it is ' +
        'more uncomfortable than that, because gradual reading is what an ordinary working life ' +
        'looks like and the limits were set to catch a bad day. Build both accounts on the same ' +
        'timeline and resist reading anything into the gradient. Two accounts have the identical ' +
        'curve here and one of them is innocent, so whatever separates them is not in this data ' +
        'and looking harder at the curve will not produce it.',
      standIn:
        'Here is why nothing fired. One new area every ten days, weekly opens going thirty to ' +
        'ninety-five, and our limits are two hundred a week and fifty megabytes a download. ' +
        'Neither got within half of either on any week. Both accounts have the same curve, and one ' +
        'of them is going to turn out fine, so whatever tells them apart is not on this chart.',
      commandOptions: [
        { command: "awk -F, '{print substr($1,1,7), $2}' /var/log/docplatform/opens.csv | sort | uniq -c | sort -k3", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$2==\"p.raithe\" {print $4}' /var/log/docplatform/opens.csv | sort -u", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status dlp-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/docplatform/opens.csv', ...DUMP_ALL },
        { command: 'grep -c p.raithe /var/log/docplatform/opens.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Plot both accounts week by week and put the policy limits on the same axis.',
      guidance:
        'Find out what the limits actually are before you decide whether these numbers are high.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      firstResponder: 'cloud-security',
      alsoAppropriate: ['soc-operator', 'ir-lead'],
      correctActions: ['act.dismiss', 'act.iam-audit'],
      outOfLaneActions: ['act.revoke-key', 'act.attribute-named', 'act.triage-high', 'act.reset-password'],
      escalateTo: [],
      why:
        'The control case, and it is the more useful of the two rows. Twelve authored documents, ' +
        'thirty meetings, sixty-one ticket comments and four reviewer credits in the new areas, ' +
        'and a project assignment on record from June. This account is not reading widely, it is ' +
        'working widely, and the reading is a by-product of the work. Note which fact did the ' +
        'clearing. It was not the HR record, which is worth very little at this company, and it ' +
        'was not the volume, which is comparable. It was the output: an account that reads and ' +
        'then argues, writes, reviews and turns up to meetings about what it read is participating ' +
        'in a business rather than collecting one. Close this one and keep the test, because the ' +
        'test is now the only instrument on the floor that discriminates.',
      standIn:
        'Vansittart is working, not collecting. Twelve documents authored in the new areas, thirty ' +
        'meetings, sixty-one ticket comments, reviewer on four proposals, and a project assignment ' +
        'on record from June. And note what cleared her: not the HR record, which around here ' +
        'means little, and not the volume, which matches. It was the output. Closing it, and I ' +
        'want to run that same test on the other one.',
      commandOptions: [
        { command: "awk -F, '$2==\"t.vansittart\" && $3==\"AUTHOR\"' /var/log/docplatform/actions.csv | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c vansittart /var/log/calendar/invites.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status docplatform', ...STATUS_CHECK },
        { command: 'cat /var/log/docplatform/actions.csv', ...DUMP_ALL },
        { command: 'net user t.vansittart /active:no /domain', ...MUTATE },
      ],
      commandNudge:
        'Look for what this account made in the new areas, not what it read.',
      guidance:
        'Somebody given more to do leaves traces of doing it. Go and look for those.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1213.002'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.corroborate'],
      outOfLaneActions: ['act.revoke-key', 'act.attribute-named', 'act.reset-password', 'act.dismiss'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'The same test, and it comes back empty in a way that is hard to explain innocently. One ' +
        'thousand one hundred and eighty documents read across six areas in fourteen weeks, and in ' +
        'those areas: nothing authored, no meetings, no ticket comments, nothing reviewed, and ' +
        'four emails that are one-line acknowledgements of material somebody else sent round. A ' +
        'person absorbing a wider remit generates friction, because understanding a new area means ' +
        'asking somebody a question and then disagreeing with the answer. This account read the ' +
        'equivalent of a small library and left no mark on the business at all. State it as ' +
        'exactly that and no further. Reading without producing is a strong finding and it is not ' +
        'a motive, and the sentence after this one is where floors invent a story about a ' +
        'competitor that the evidence does not carry.',
      standIn:
        'Same test on Raithe and it comes back empty. Eleven hundred and eighty documents across ' +
        'six areas in fourteen weeks. Nothing authored, no meetings, no ticket comments, nothing ' +
        'reviewed, four emails that are all one-line acknowledgements. Somebody learning a new ' +
        'area generates friction, because you ask questions and then argue with the answers. This ' +
        'account read a library and left no mark. That is the finding and I am not going past it.',
      commandOptions: [
        { command: "awk -F, '$2==\"p.raithe\" {print $3}' /var/log/docplatform/actions.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$2==\"p.raithe\" && $3!=\"READ\"' /var/log/docplatform/actions.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status docplatform', ...STATUS_CHECK },
        { command: 'cat /var/log/docplatform/actions.csv', ...DUMP_ALL },
        { command: 'grep -c p.raithe /var/log/docplatform/actions.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Run the same output test you ran on the other account, and count what comes back.',
      guidance:
        'You have a test that cleared one account. Run it here.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1213.002', 'T1530'],
      firstResponder: 'forensics',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.attribute-named', 'act.reimage-now', 'act.reset-password', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Order is evidence, and this is the row that turns a pattern into an intent. Forty lane ' +
        'pricing models opened in ascending order of contract renewal date, starting with the four ' +
        'that renew in October. Nobody reads in that order by accident, and nobody reads in that ' +
        'order to understand a product area either. It is the order you read in if what you care ' +
        'about is which customers are up for renegotiation and what price they are currently ' +
        'paying. Add the margin floor table eleven times, which is the number below which this ' +
        'company will not bid, and the set is a complete brief for underbidding a competitor into ' +
        'their own customers. Seal the reconstruction and the reading order specifically, because ' +
        'the order is the whole artefact and it exists only as a derived sequence: it is not a ' +
        'file anybody can hand to a lawyer unless somebody writes down how it was built.',
      standIn:
        'The order is the finding. Forty lane pricing models opened in ascending contract renewal ' +
        'date, starting with the four renewing in October, plus the margin floor table eleven ' +
        'times. Nobody reads in renewal-date order by accident and nobody reads in it to learn a ' +
        'product area. That is the order you use if you want to know who is up for renegotiation ' +
        'and what they pay. Sealing the reconstruction and writing down exactly how the sequence ' +
        'was derived, because the order is the artefact.',
      commandOptions: [
        { command: "awk -F, '$2==\"p.raithe\" && $5==\"lane-pricing\" {print $1, $4}' /var/log/docplatform/opens.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'join -1 2 -2 1 /evidence/raithe-reads.txt /evidence/contract-renewals.txt | sort -k3', correct: true, teaches: ALSO_WORKS },
        { command: 'grep -c lane-pricing /var/log/docplatform/opens.csv', ...COUNT_ONLY },
        { command: 'cat /var/log/docplatform/opens.csv', ...DUMP_ALL },
        { command: 'net user p.raithe /active:no /domain', ...MUTATE },
      ],
      commandNudge:
        'Put the documents that account read in the order it read them, then find a property of ' +
        'the documents that matches that order.',
      guidance:
        'You know what was read. Ask in what order, and whether the order means anything.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      firstResponder: 'network-analyst',
      alsoAppropriate: ['mitigation-specialist', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'Fourteen weeks of clean data loss telemetry from a healthy agent that caught eleven other ' +
        'people in the same period, and the honest report of it is that nothing left by any ' +
        'monitored channel. The trap is the next sentence, which almost writes itself and is ' +
        'wrong: that therefore nothing was taken. What was read here is forty renewal dates and a ' +
        'set of prices, and that fits on one side of a sheet of paper or, given fourteen weeks and ' +
        'eleven visits to the same table, in somebody memory. There was never going to be an ' +
        'upload because there was never anything that needed uploading. Report it precisely: no ' +
        'exfiltration is observed on any channel that is monitored, and the material in question ' +
        'does not require one. A floor that says no data left has answered a different question ' +
        'from the one legal is about to ask.',
      standIn:
        'Fourteen weeks, clean. No uploads, no removable media, no print jobs, nothing to personal ' +
        'mail, and the agent was healthy throughout and caught eleven other people in the same ' +
        'window. What I will not say is that nothing was taken. Forty renewal dates and a price ' +
        'list fit on one sheet of paper, or after eleven looks at the same table, in your head. ' +
        'There was never going to be an upload. No exfiltration on any monitored channel, and this ' +
        'material never needed one.',
      commandOptions: [
        { command: "awk -F, '$2==\"p.raithe\"' /var/log/dlp/events.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$4==\"VIOLATION\"' /var/log/dlp/events.csv | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status dlp-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/dlp/events.csv', ...DUMP_ALL },
        { command: 'grep -c p.raithe /var/log/dlp/events.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check the agent was actually healthy, then ask whether this material would need a channel ' +
        'at all.',
      guidance:
        'No upload found. Ask how big the thing you are looking for actually is.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1213.002'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.reset-password', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The number that makes the finding survive a lawyer. Sixty-one accounts across the estate ' +
        'widened their reading scope by three or more areas in the same fourteen weeks, which ' +
        'means drift is ordinary and an accusation built on drift would have been an accusation ' +
        'against sixty-one people. Fifty-nine of the sixty-one produce output in the new areas. ' +
        'Two do not, and one of those two is a service account. That is not a suspicion, it is a ' +
        'population and a discriminator applied to it, and it is repeatable by somebody who does ' +
        'not trust you. Carry the sixty per cent figure into the readout as well, because it cuts ' +
        'the other way and belongs in the report for exactly that reason: most role changes here ' +
        'are never written down, so nobody may say that the absence of an HR record proves ' +
        'anything. What the evidence supports is that one account read very widely and produced ' +
        'nothing. Why is not on this floor and is not going to be.',
      standIn:
        'Sixty-one accounts in the estate drifted the same way in the same fourteen weeks, so drift ' +
        'on its own would have accused sixty-one people. Fifty-nine of them produce output in the ' +
        'new areas. Two do not, and one of those is a service account. That is a population and a ' +
        'test, and somebody hostile can repeat it. Putting the other number in the report too: ' +
        'sixty per cent of role changes here are never written down, so nobody gets to say the ' +
        'missing HR record proves anything. Read very widely, produced nothing. Why is not ours.',
      commandNudge:
        'Run the same output test across every account that drifted, not just the two you were ' +
        'given.',
    },
    {
      eventId: 'ev.8',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['cloud-security', 'log-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.revoke-key', 'act.isolate', 'act.attribute-named'],
      escalateTo: [],
      why:
        'The second zero-output account is the search indexer, and it is here because the ' +
        'discriminator that just worked so well has an obvious failure mode: it assumes accounts ' +
        'are people. This one reads every document in every area it is pointed at, produces ' +
        'nothing because producing is not a thing it can do, and widened its scope in exactly the ' +
        'period in question because three product areas were migrated onto the platform in June ' +
        'and July, which is in the change system. It has held the same permissions since 2023. ' +
        'Close it, and take the general lesson rather than the specific one: a behavioural test ' +
        'run across an estate will always surface the automation first, and a floor that skips ' +
        'that check reports a robot as a suspect in front of the general counsel.',
      standIn:
        'The other zero-output account is the search indexer. It reads everything it is pointed at ' +
        'and produces nothing because producing is not something it does, and its scope widened ' +
        'because three areas were migrated onto the platform in June and July, which is in the ' +
        'change record. Same permissions since 2023. Closing it. The test assumes accounts are ' +
        'people, and across an estate it will find the automation first every time.',
      commandOptions: [
        { command: "awk -F, '$2==\"svc-index-ardal\" {print $3}' /var/log/docplatform/actions.csv | sort -u", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "migrat" /var/log/change/2026-06.csv /var/log/change/2026-07.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status docplatform-indexer', ...STATUS_CHECK },
        { command: 'cat /var/log/docplatform/actions.csv', ...DUMP_ALL },
        { command: 'net user svc-index-ardal /active:no /domain', ...MUTATE },
      ],
      commandNudge:
        'Before you report two suspects, check whether both of them are people.',
      guidance:
        'One of these two produces nothing for a very boring reason. Find out which.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1213.002'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Three controls exist and all three are structurally incapable of seeing this. A weekly ' +
        'open count and a download size are lines, and this never approached either, so tuning ' +
        'them down is the proposal that will be made in the debrief and it is the wrong one: ' +
        'halving the weekly limit to catch ninety-five opens means alerting on ordinary analysts ' +
        'every week forever. The third control is worse than useless in an instructive way. The ' +
        'margin floor table is classified commercially sensitive and generated 340 alerts in ' +
        'ninety days, all 340 closed as routine, because everybody in the pricing function reads ' +
        'it legitimately. A control that fires on every access to a document fourteen people need ' +
        'daily is a control that has trained the floor to close it. What is actually detectable ' +
        'is the thing that discriminated tonight: read volume in an area against produced output ' +
        'in that area, evaluated monthly rather than in real time, because this incident has no ' +
        'moment and there is nothing to alert on within an hour. That is a report, not a rule, and ' +
        'saying so plainly is part of the job.',
      standIn:
        'All three controls are structurally blind to this. Weekly count and download size are ' +
        'lines and it never went near either, and lowering them means alerting on normal analysts ' +
        'every week. The sensitive-document alert is the instructive one: 340 alerts in ninety ' +
        'days on the margin floor table, all closed as routine, because fourteen people read it ' +
        'legitimately. We trained ourselves to close it. What is detectable is read volume against ' +
        'produced output per area, run monthly. That is a report and not a rule, and this incident ' +
        'has no moment to alert on.',
      commandOptions: [
        { command: "awk -F, '$3==\"SENSITIVE-ACCESS\" {print $6}' /var/log/detection/alerts.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c "margin-floor" /var/log/detection/alerts.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/detection/alerts.csv', ...DUMP_ALL },
        { command: 'grep -c SENSITIVE /var/log/detection/alerts.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out how many alerts the sensitive-document rule already generates, and how many were ' +
        'ever actioned.',
      guidance:
        'There is already a rule on the most sensitive document here. Ask why it did not help.',
    },
    {
      eventId: 'ev.10',
      verdict: 'malicious',
      stage: 'collection',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.attribute-named', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'One suspect, no proof of motive, and a containment problem where the obvious action is ' +
        'also a message. Cutting one analyst access tells that analyst they are suspected, which ' +
        'is a decision for legal and HR rather than for this floor, and it destroys any chance of ' +
        'the conversation those two functions might want to have. The move that is available is ' +
        'the one that does not single anybody out: put the lane pricing models, the renewal ' +
        'calendar and the margin floor table behind a request-based model for all fourteen ' +
        'analysts, and watermark them per recipient. That is defensible as a control the function ' +
        'should always have had, it changes nothing about anybody standing, and it means the next ' +
        'fourteen weeks are recorded per document per person. Check the rollback and the timing ' +
        'against the October renewal round, which starts in three weeks and needs all of this ' +
        'material: a request model introduced badly stops the company repricing its own contracts. ' +
        'And name what is deliberately not being done. Nobody monitors this individual, reads ' +
        'their mail or looks at their movements without written sign-off from legal, because the ' +
        'floor has a strong finding about reading and no finding at all about why.',
      standIn:
        'Do not cut one analyst access. That tells them they are suspected, and that is legal and ' +
        'HR calling it, not us. What we can do singles nobody out: request-based access to the ' +
        'lane pricing models, the renewal calendar and the margin floor table for all fourteen ' +
        'analysts, watermarked per person. It is a control the function should always have had. ' +
        'Time it around the October renewal round, which starts in three weeks and needs every one ' +
        'of those documents, and I want the rollback written first. Deliberately left undone: no ' +
        'monitoring of the individual without legal in writing. We have a finding about reading ' +
        'and nothing at all about why.',
      commandNudge:
        'Find out how many people legitimately need these documents before you propose restricting ' +
        'them.',
    },
  ],
};
