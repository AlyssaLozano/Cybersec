/**
 * Scenario 76: Helpful Tools.
 *
 * Two hundred and ten people are pasting into a public AI assistant, almost all
 * of it is fine, and fourteen requests are not.
 *
 * WHAT THIS TEACHES
 *
 * That the finding is what was pasted, not that pasting happened, and that the
 * obvious remedy makes the problem invisible rather than smaller.
 *
 * Nobody here is doing anything wrong on purpose. A discharge summary that
 * takes forty minutes to write takes eight with help, the staff doing it are
 * under real pressure, and 3,386 of the 3,400 requests this month contain
 * nothing that matters. A floor that reports "210 staff are using an
 * unapproved AI tool" has produced a number that will get the tool blocked and
 * has answered no useful question.
 *
 * THE FOURTEEN
 *
 * Fourteen requests carry a medical record number alongside clinical text,
 * which is identifiable patient data sent to a third party with no agreement
 * behind it. That is the incident, it is small, and it is only visible to
 * somebody who looked at content rather than counting requests.
 *
 * WHY BLOCKING IS THE WRONG MOVE
 *
 * Forty staff are already reaching it from personal phones on guest wireless,
 * where the estate sees nothing at all. Blocking the domain moves the other
 * hundred and seventy there too, and converts a problem that is currently
 * measurable into one that is not. The tool is not the risk. The absence of a
 * sanctioned way to do the thing everybody is doing is the risk.
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

const ID = 'helpful-tools';

export const HELPFUL_TOOLS: Scenario = {
  id: ID,
  title: 'Helpful Tools',
  difficulty: 'beginner',
  durationMinutes: 45,
  situation:
    'It is 11:00 at Ridgeline Medical Group. A monthly review found that a lot of staff are using ' +
    'a public AI assistant at work. Nobody has reported an incident and nothing has alerted.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'ai-security',
    'cloud-security',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Two hundred and ten staff used a public AI assistant this month',
      detail:
        'The web proxy recorded 3,400 requests to a public AI assistant from 210 distinct staff ' +
        'accounts in September. The tool is not on the approved software list and no agreement ' +
        'exists with the supplier. Use has grown from 40 staff in June. Rule history: no rule ' +
        'fires on this; it came out of the monthly proxy category review.',
      source: 'web proxy',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'raw-log',
      summary: 'Almost all of it is small and carries nothing',
      detail:
        'Request body sizes are mostly between 200 and 900 bytes. Sampling 200 of them finds ' +
        'rewording requests, spelling checks, help with a spreadsheet formula, and drafting ' +
        'wording for a poster. None of the 200 contains a name, a date of birth, a medical record ' +
        'number or clinical detail. The busiest hour is 12:00 to 13:00.',
      source: 'web proxy',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'process-tree',
      summary: 'Fourteen requests are a different shape entirely',
      detail:
        'Fourteen requests across the month are between 4 and 11 kilobytes, an order of magnitude ' +
        'larger than the rest. Each contains a medical record number in the trust format alongside ' +
        'free clinical text: presenting complaint, medication, and in four cases a diagnosis. ' +
        'Twelve of the fourteen come from three accounts. All fourteen fall between 16:00 and ' +
        '18:30 on weekdays.',
      source: 'web proxy',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'raw-log',
      summary: 'They are discharge summaries being drafted',
      detail:
        'The three accounts belong to junior doctors on the same ward. The text in each request is ' +
        'a set of clinical notes followed by a request to turn them into a discharge summary. The ' +
        'ward has a discharge summary backlog of 40 letters and the trust target is 24 hours. Two ' +
        'of the three have completed the annual information governance training within the last ' +
        'six months.',
      source: 'web proxy',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'network-flow',
      summary: 'Forty staff already reach it where nothing can be seen',
      detail:
        'The guest wireless network carries 40 devices that resolve the assistant domain daily, ' +
        'against 210 accounts on the corporate network. Guest wireless is deliberately unfiltered ' +
        'and uninspected, carries no user identity, and exists so that patients and visitors can ' +
        'use the internet. Nothing on it is attributable to a member of staff.',
      source: 'guest wireless',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'There is no sanctioned way to do the thing everybody is doing',
      detail:
        'The trust has no approved AI assistant and no policy that names one. The information ' +
        'governance policy prohibits sending patient data to unapproved third parties, which staff ' +
        'have signed, and says nothing about what to use instead. A procurement request for an ' +
        'enterprise assistant with a data agreement was raised in April and is awaiting business ' +
        'case approval.',
      source: 'information governance',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 940,
      surface: 'raw-log',
      summary: 'Nothing inspects what is in a request',
      detail:
        'The proxy logs the destination, the size and the time, and does not retain request bodies. ' +
        'The fourteen were found because a sample was pulled manually for this review and the ' +
        'bodies were still in a 48 hour buffer. That buffer is not searchable, is not retained, ' +
        'and covers two days of a thirty day question. Content inspection at this scale would need ' +
        'a control the trust does not have.',
      source: 'detection coverage',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.8',
      atSeconds: 1100,
      surface: 'alert-queue',
      summary: 'A request that looks like a record number and is not',
      detail:
        'One flagged request contains the string RMG-4471-22 alongside a supplier name and a price. ' +
        'The trust medical record format is seven digits with no letters. RMG-4471-22 is a ' +
        'purchase order reference. The request asks for help writing a chasing email about an ' +
        'overdue delivery of examination gloves.',
      source: 'web proxy',
      claimedSeverity: 'medium',
    },
  ],
};

export const HELPFUL_TOOLS_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Two hundred and ten Ridgeline staff used a public AI assistant in September, across 3,400 requests, up from 40 staff in June. The tool is not approved and no agreement exists with the supplier.',
    'Sampling 200 requests finds rewording, spelling, a spreadsheet formula and poster wording. None contains a name, a date of birth, a record number or clinical detail.',
    'Fourteen requests are between 4 and 11 kilobytes, an order of magnitude larger than the rest, and each carries a medical record number alongside free clinical text including presenting complaint, medication, and in four cases a diagnosis.',
    'Twelve of the fourteen come from three junior doctors on one ward, all between 16:00 and 18:30 on weekdays. The text is clinical notes followed by a request to turn them into a discharge summary.',
    'That ward has a backlog of 40 discharge summaries against a 24 hour target.',
    'Forty devices on guest wireless resolve the same domain daily. Guest wireless is deliberately unfiltered and uninspected, carries no identity, and exists for patients and visitors.',
    'The trust has no approved assistant and no policy naming one. A procurement request for an enterprise tool with a data agreement was raised in April and is awaiting a business case.',
    'The proxy retains destination, size and time, and not bodies. The fourteen were found only because a 48 hour buffer happened to still hold them during a manual review of a thirty day question.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ai-security', 'ir-lead'],
      correctActions: ['act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.triage-high', 'act.declare', 'act.attribute-named'],
      escalateTo: ['ai-security', 'log-analyst'],
      why:
        'Two hundred and ten staff and 3,400 requests is a number that will get a tool blocked by ' +
        'lunchtime if it is reported on its own, and it answers no question worth asking. Nothing ' +
        'here says anything left that should not have: the proxy records a destination, and a ' +
        'destination is not a disclosure. The instinct to treat volume as severity is the thing to ' +
        'resist, and the growth from 40 staff in June to 210 in September is genuinely the least ' +
        'interesting fact on the row, because it describes people finding something useful rather ' +
        'than anything getting worse. Hold it open and get somebody looking at content, because ' +
        'the only question that matters is what was in the requests and this row cannot answer it.',
      standIn:
        'Two hundred and ten staff, 3,400 requests to a public AI assistant, not on the approved ' +
        'list. If I report that number on its own the tool gets blocked by lunchtime and we will ' +
        'have answered nothing. A destination is not a disclosure. Growth from 40 to 210 since June ' +
        'is people finding something useful, not something getting worse. The only question is what ' +
        'was in the requests, and this row cannot tell us.',
      commandOptions: [
        { command: "awk -F, '$4 ~ /assistant/ {print $3}' /var/log/proxy/access.csv | sort -u | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$4 ~ /assistant/ {print substr($1,1,7)}' /var/log/proxy/access.csv | uniq -c", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status squid', ...STATUS_CHECK },
        { command: 'cat /var/log/proxy/access.csv', ...DUMP_ALL },
        { command: 'proxy-cli block --domain assistant.example', ...MUTATE },
      ],
      commandNudge:
        'Find out how many staff and how many requests, then ask what the proxy actually records.',
      guidance:
        'A lot of people used a website. Ask what that tells you about risk.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      firstResponder: 'log-analyst',
      alsoAppropriate: ['ai-security', 'soc-operator'],
      correctActions: ['act.timeline', 'act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.declare', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ai-security'],
      why:
        'Two hundred sampled requests and not one of them carries anything that matters: rewording, ' +
        'spelling, a spreadsheet formula, wording for a poster. Sizes between 200 and 900 bytes, ' +
        'which is a sentence or two, and a peak at lunchtime, which is people using their break. ' +
        'This is the row that should change the tone of the whole investigation, and reporting it ' +
        'clearly is as much a finding as anything that comes later. The overwhelming majority of ' +
        'what looked alarming an hour ago is staff working faster on things that carry no patient ' +
        'data at all. Say that plainly, because the report will otherwise be read as 210 people ' +
        'doing something wrong, and 210 people are not.',
      standIn:
        'I sampled 200 and none of them carry anything. Rewording, spelling, a spreadsheet formula, ' +
        'wording for a poster. Two hundred to nine hundred bytes, so a sentence or two, peaking at ' +
        'lunchtime. That is people using their break to work faster. This goes in the report as ' +
        'clearly as anything else does, because otherwise it reads as 210 people doing something ' +
        'wrong and they are not.',
      commandOptions: [
        { command: "awk -F, '$4 ~ /assistant/ {print $6}' /var/log/proxy/access.csv | sort -n | uniq -c | tail", correct: true, teaches: CORRECT_STEP },
        { command: "grep -icE 'mrn|nhs|dob|diagnos' /evidence/proxy/sample-200.txt", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status squid', ...STATUS_CHECK },
        { command: 'cat /evidence/proxy/sample-200.txt', ...DUMP_ALL },
        { command: 'grep -c . /var/log/proxy/access.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at the request sizes and read a sample of what is actually in them.',
      guidance:
        'Ask what a typical one of these requests contains.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1567'],
      firstResponder: 'ai-security',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.investigate-hold', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.isolate', 'act.triage-high'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'Fourteen out of three thousand four hundred, and they are the incident. The size is what ' +
        'finds them: 4 to 11 kilobytes against a normal 200 to 900 bytes, an order of magnitude ' +
        'out, which is a filter anybody can apply without reading a single request body. What is ' +
        'in them is a medical record number in the trust format alongside presenting complaint, ' +
        'medication and in four cases a diagnosis, which is identifiable patient data sent to a ' +
        'third party with no agreement behind it. Say the number precisely and resist both ' +
        'directions of exaggeration: it is fourteen requests and not 3,400, and it is fourteen ' +
        'real disclosures and not a technicality. The useful habit to name is that volume found ' +
        'nothing and shape found everything, and the shape was available in a field the proxy ' +
        'already logs.',
      standIn:
        'Fourteen of the 3,400, and these are the incident. Size found them: four to eleven ' +
        'kilobytes against a normal two hundred to nine hundred bytes, so an order of magnitude ' +
        'out, and you can filter on that without reading anybody\'s text. Each one has a record ' +
        'number in our format plus presenting complaint, medication, four with a diagnosis. That is ' +
        'identifiable patient data to a third party with no agreement. Fourteen, not 3,400, and ' +
        'fourteen real ones, not a technicality.',
      commandOptions: [
        { command: "awk -F, '$4 ~ /assistant/ && $6 > 4000 {print $1, $3, $6}' /var/log/proxy/access.csv", correct: true, teaches: CORRECT_STEP },
        { command: "grep -oE '[0-9]{7}' /evidence/proxy/buffer-48h.txt | sort -u | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status squid', ...STATUS_CHECK },
        { command: 'cat /evidence/proxy/buffer-48h.txt', ...DUMP_ALL },
        { command: 'curl -s https://assistant.example/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Sort the requests by size and look at the ones that do not fit the pattern.',
      guidance:
        'Most requests are tiny. Ask whether any of them are not.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1567'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['ai-security', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.reset-password', 'act.isolate'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Three junior doctors on one ward, between four and half past six on weekdays, pasting ' +
        'clinical notes and asking for a discharge summary. The ward has a backlog of forty ' +
        'letters against a twenty-four hour target. Every part of that is a person doing their job ' +
        'in the only way they can see to do it faster, at the end of a shift, and two of the three ' +
        'completed information governance training in the last six months, which means the ' +
        'training did not reach the situation. This is still a disclosure and it still has to be ' +
        'reported, and both of those things are true at once. The way this is written up decides ' +
        'what happens next: framed as three doctors breaching policy it produces three ' +
        'disciplinary conversations and no change, and framed as a ward with a backlog and no ' +
        'sanctioned tool it produces the thing that actually stops it. Name the accounts to the ' +
        'lead and not on the incident bridge.',
      standIn:
        'Three junior doctors, same ward, four to half six on weekdays, pasting notes and asking for ' +
        'a discharge summary. That ward has forty letters backed up against a twenty-four hour ' +
        'target. This is people doing the job the only way they can see to do it faster, at the end ' +
        'of a shift, and two of the three did the governance training in the last six months, so ' +
        'the training did not reach this situation. It is still a disclosure and it still gets ' +
        'reported. But if we write it as three doctors breaching policy we get three disciplinaries ' +
        'and no change. Names go to the lead, not the bridge.',
      commandOptions: [
        { command: "awk -F, '$4 ~ /assistant/ && $6 > 4000 {print $3}' /var/log/proxy/access.csv | sort | uniq -c | sort -rn", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$6 > 4000 {print substr($1,12,2)}' /var/log/proxy/access.csv | sort | uniq -c", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status squid', ...STATUS_CHECK },
        { command: 'cat /var/log/proxy/access.csv', ...DUMP_ALL },
        { command: 'net user j.okafor /active:no /domain', ...MUTATE },
      ],
      commandNudge:
        'Find out who sent the fourteen, when, and what they were trying to produce.',
      guidance:
        'Somebody sent these. Ask what they were trying to get done.',
    },
    {
      eventId: 'ev.5',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'network-analyst',
      alsoAppropriate: ['mitigation-specialist', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.investigate-hold'],
      outOfLaneActions: ['act.isolate', 'act.attribute-named', 'act.dismiss', 'act.triage-high'],
      escalateTo: ['mitigation-specialist', 'ir-lead'],
      why:
        'Forty devices a day on guest wireless resolving the same domain, and guest wireless is ' +
        'deliberately unfiltered, uninspected and carries no identity, because it exists so ' +
        'patients and visitors can use the internet. Some of those forty are visitors and some are ' +
        'staff, and nothing distinguishes them, which is the design working as intended rather ' +
        'than a gap. What makes this the most important row for the decision coming next is what ' +
        'it says about blocking: the corporate network is where the 210 are visible, and the guest ' +
        'network is where they go when the corporate one stops working. A block does not reduce ' +
        'the behaviour, it relocates it somewhere the estate has no visibility at all, and it does ' +
        'so on a network that by design cannot be made to tell you who did what.',
      standIn:
        'Forty devices a day on guest wireless hitting the same domain. Guest is deliberately ' +
        'unfiltered, uninspected, no identity, because it is there for patients and visitors. Some ' +
        'of those are staff and nothing tells them apart, and that is the design working, not a ' +
        'gap. The point for whatever we decide next: the corporate network is where we can see the ' +
        '210, and guest is where they go if we break the corporate one. Blocking does not reduce ' +
        'this, it moves it somewhere we see nothing.',
      commandOptions: [
        { command: "awk -F, '$3 ~ /assistant/ {print $2}' /var/log/dns/guest-queries.csv | sort -u | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c "assistant" /var/log/dns/guest-queries.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status dnsmasq', ...STATUS_CHECK },
        { command: 'cat /var/log/dns/guest-queries.csv', ...DUMP_ALL },
        { command: 'nmap -sn 10.201.0.0/16', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check whether that domain is being reached from anywhere the proxy does not cover.',
      guidance:
        'The proxy sees the corporate network. Ask what else people can use.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.attribute-named', 'act.reset-password', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The policy prohibits sending patient data to unapproved third parties, everybody has ' +
        'signed it, and it says nothing about what to use instead. That is the finding, and it is ' +
        'a governance finding rather than a technical one. Blocking the domain is available, takes ' +
        'ten minutes, and is the wrong move: forty staff are already on guest wireless where ' +
        'nothing is visible, and a block moves the other 170 there too, converting a measurable ' +
        'problem into an invisible one on a network that by design cannot attribute anything. What ' +
        'is available and narrow is a block on that one domain from clinical workstations only, ' +
        'which is where record numbers are on screen to be pasted, paired with an interstitial on ' +
        'the rest of the estate naming what must never go into it. Then the thing that actually ' +
        'ends this, which is not a security control: the enterprise assistant procurement raised ' +
        'in April is the remedy, and this incident is the business case it has been waiting for. ' +
        'Say plainly what is deliberately left undone: the tool stays reachable for the 196 people ' +
        'using it harmlessly, because taking it away punishes them for a gap the trust created.',
      standIn:
        'The policy says do not send patient data to unapproved third parties and says nothing about ' +
        'what to use instead. That is the finding. Blocking takes ten minutes and is wrong: forty ' +
        'people are already on guest where we see nothing, and a block sends the other 170 there ' +
        'too, so we would trade a measurable problem for an invisible one. Narrow move: block that ' +
        'domain from clinical workstations only, which is where record numbers are on screen, and ' +
        'put an interstitial on the rest naming what must never go in. And the actual fix is the ' +
        'enterprise assistant procurement from April. This incident is the business case it has ' +
        'been waiting for. Left undone deliberately: it stays reachable for the 196 using it ' +
        'harmlessly, because taking it away punishes them for a gap we created.',
      commandNudge:
        'Find out whether the policy names an approved alternative, and what happens if you block ' +
        'the domain.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'ai-security',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'The fourteen were found by luck. The proxy logs destination, size and time and does not ' +
        'retain bodies, and those requests were only readable because a 48 hour buffer happened to ' +
        'still hold them during a manual review of a thirty day question. Nothing about that is ' +
        'repeatable, and next month the same fourteen would be invisible. Content inspection at ' +
        'this scale is a control the trust does not have and is not a small ask, so the proposal ' +
        'has to work with what exists, and the useful thing is that size already discriminated ' +
        'perfectly: 4 to 11 kilobytes against 200 to 900 bytes, with no overlap at all. An alert ' +
        'on a request above two kilobytes to a generative AI destination needs no body inspection, ' +
        'no new telemetry and no privacy conversation, and it would have caught all fourteen. ' +
        'Backtest it over ninety days before promising a volume, and say the honest limitation ' +
        'with it: it catches pasting a lot and misses pasting a little, which is the correct trade ' +
        'and should be stated rather than discovered later.',
      standIn:
        'We found those fourteen by luck. The proxy keeps destination, size and time, not bodies, ' +
        'and we could read them only because a 48 hour buffer still had them during a review of a ' +
        'thirty day question. Next month they would be invisible. Content inspection at this scale ' +
        'is a control we do not have. But size discriminated perfectly with no overlap: four to ' +
        'eleven kilobytes against two hundred to nine hundred bytes. Alert on anything over two ' +
        'kilobytes to a generative AI destination. No bodies, no new telemetry, no privacy ' +
        'argument, and it catches all fourteen. It also misses somebody pasting a little, and I ' +
        'would rather say that now than have it found later.',
      commandOptions: [
        { command: "awk -F, '$4 ~ /assistant/ {print ($6>2000)?\"over\":\"under\"}' /var/log/proxy/access.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -iE "retain|buffer" /evidence/proxy/config.conf', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status squid', ...STATUS_CHECK },
        { command: 'cat /evidence/proxy/config.conf', ...DUMP_ALL },
        { command: 'grep -c assistant /var/log/proxy/access.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out what the proxy keeps and for how long, then look for a field that already ' +
        'separates the fourteen.',
      guidance:
        'You found these by reading them. Ask whether you could have found them without.',
    },
    {
      eventId: 'ev.8',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ai-security', 'log-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.attribute-named', 'act.declare', 'act.isolate'],
      escalateTo: [],
      why:
        'A string that looks like an identifier and is a purchase order. RMG-4471-22 alongside a ' +
        'supplier name and a price, in a request asking for help writing a chasing email about ' +
        'overdue examination gloves. The check takes one look at the format: trust medical record ' +
        'numbers are seven digits with no letters, and this has letters and hyphens. Close it. The ' +
        'row is here because the pattern-matching everybody is about to do across thirty days of ' +
        'proxy logs will produce a lot of these, and each one is a person in procurement being ' +
        'asked to explain a chasing email about gloves. On a scenario whose whole point is that ' +
        'the finding is fourteen and not 3,400, adding false accusations to the fourteen is the ' +
        'same error running the other way.',
      standIn:
        'This one is a purchase order, not a record number. RMG-4471-22 with a supplier name and a ' +
        'price, asking for help chasing an overdue delivery of gloves. Our record numbers are seven ' +
        'digits with no letters. Closing it. And whoever runs this pattern across thirty days is ' +
        'going to get a lot of these, and each one is somebody in procurement being asked to ' +
        'explain an email about gloves.',
      commandOptions: [
        { command: "grep -oE 'RMG-[0-9]+-[0-9]+|[0-9]{7}' /evidence/proxy/buffer-48h.txt | sort -u | head", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "record number format" /evidence/policy/ig-standards.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status squid', ...STATUS_CHECK },
        { command: 'cat /evidence/proxy/buffer-48h.txt', ...DUMP_ALL },
        { command: 'grep -c RMG /evidence/proxy/buffer-48h.txt', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check what a medical record number actually looks like at this organisation.',
      guidance:
        'It looks like an identifier. Ask what the real format is.',
    },
  ],
};
