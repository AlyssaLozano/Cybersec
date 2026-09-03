/**
 * Scenario 92: Beyond What They Said.
 *
 * Somebody found a serious flaw in the customer portal, told Fenmarch about
 * it, and their proof is indistinguishable from three days of data theft.
 *
 * WHAT THIS TEACHES
 *
 * That the hardest part of an unsolicited vulnerability report is not the
 * vulnerability. It is that the reporter has already done the thing you would
 * have called an attack, that their account of how much they did is checkable
 * and does not match, and that every reaction available to Fenmarch tonight is
 * a decision about a person rather than about a system.
 *
 * TWO THREADS THAT DO NOT RESOLVE
 *
 * Whether they kept the data. The requests returned it, and nothing Fenmarch
 * holds can say what happened at the other end. And whether a sentence about a
 * bounty is a clumsy researcher or a soft demand, which reads differently
 * depending on what the reader already suspects and cannot be settled from the
 * text.
 *
 * THE COUNTERINTUITIVE FINDING
 *
 * Four thousand requests over three days, walking sequential identifiers,
 * returning other customers' records, and nothing alerted. The detection gap
 * is worse than the flaw, because the flaw has one fix and the gap means
 * Fenmarch cannot say whether anybody else has been doing this for longer.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';
import {
  ALSO_WORKS,
  BROAD_SEARCH,
  COUNT_ONLY,
  CORRECT_STEP,
  DUMP_ALL,
  MUTATE,
  STATUS_CHECK,
  TOUCH_ATTACKER,
} from './distractors.js';

const ID = 'beyond-what-they-said';

export const BEYOND_WHAT_THEY_SAID: Scenario = {
  id: ID,
  title: 'Beyond What They Said',
  difficulty: 'expert',
  durationMinutes: 90,
  situation:
    'It is 17:30 at Fenmarch Credit. Somebody outside the company has told us about a flaw in the ' +
    'customer portal, and to prove it they read other people accounts for three days.',
  roles: [
    'soc-operator',
    'log-analyst',
    'forensics',
    'cloud-security',
    'network-analyst',
    'threat-intel',
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
      summary: 'A vulnerability report, addressed to the chief executive',
      detail:
        'An email arrived at 16:55 to the chief executive published address, from a named individual ' +
        'with a personal domain and a public profile of previous disclosures. It describes a flaw in ' +
        'the customer portal statement endpoint: changing the account identifier in the request ' +
        'returns another customer statement, with no authorisation check. It includes a screenshot ' +
        'showing a real statement belonging to somebody who is not them, and states they accessed a ' +
        'handful of records to confirm the issue.',
      source: 'chief executive office',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.2',
      atSeconds: 180,
      surface: 'raw-log',
      summary: 'The flaw is exactly as described',
      detail:
        'The statement endpoint takes an account identifier as a parameter and returns the statement ' +
        'for that account. It checks that the caller is authenticated and does not check that the ' +
        'caller owns the account requested. Identifiers are sequential. Any customer with a valid ' +
        'session can read any other customer statements, and the code has been in production since ' +
        'the portal launched in 2023.',
      source: 'customer portal',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 380,
      surface: 'network-flow',
      summary: 'A handful is four thousand',
      detail:
        'Access logs show 4,120 requests to the statement endpoint from the reporter authenticated ' +
        'session between Monday and Wednesday, walking sequential identifiers at a steady rate with ' +
        'a two second gap. 3,880 returned another customer statement. The reporter holds a genuine ' +
        'Fenmarch account opened in 2021 with an ordinary transaction history.',
      source: 'customer portal',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 570,
      surface: 'alert-queue',
      summary: 'Nothing alerted, for three days',
      detail:
        'No rule fired on 4,120 requests from one session to one endpoint over three days. The ' +
        'portal has no rate limiting on that endpoint, no alerting on sequential identifier access, ' +
        'and no monitoring of how many distinct accounts one session touches. The only reason ' +
        'Fenmarch knows is that the person told us.',
      source: 'security programme',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 760,
      surface: 'alert-queue',
      expertOnly: true,
      summary: 'A sentence in the report about payment',
      detail:
        'The final paragraph reads that they hope Fenmarch has a process for recognising this kind ' +
        'of work, that a bounty would be appropriate given the severity, and that they will publish ' +
        'a write-up in ninety days as is standard practice. There is no threat, no deadline other ' +
        'than the ninety days, and no demand for a figure. Their public profile shows eleven prior ' +
        'disclosures to other firms, all of them coordinated.',
      source: 'chief executive office',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 950,
      surface: 'cloud-audit',
      expertOnly: true,
      summary: 'Whether they kept any of it cannot be established',
      detail:
        'The 3,880 successful requests returned statement documents to the reporter browser. What ' +
        'happened to those documents afterwards is outside anything Fenmarch can observe. There is ' +
        'no indication of onward transfer from the portal side and no way there would be. The ' +
        'reporter says in the email that they retained only the single screenshot included and ' +
        'deleted everything else.',
      source: 'customer portal',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 1140,
      surface: 'raw-log',
      summary: 'Somebody else walked the same endpoint in July',
      detail:
        'A search of six months of access logs finds one other session with the same pattern: 240 ' +
        'sequential requests to the statement endpoint on 3 July, from a customer account opened ' +
        'two days earlier and closed the following week. Retention on the portal access log is six ' +
        'months, so anything before March cannot be checked.',
      source: 'customer portal',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1330,
      surface: 'alert-queue',
      summary: 'Fenmarch has nowhere for somebody to report this',
      detail:
        'There is no security.txt, no disclosure policy and no reporting address. The reporter tried ' +
        'the support form on Monday and received an automated reply about account queries, then ' +
        'emailed the chief executive published address on Wednesday. Legal has drafted a cease and ' +
        'desist letter and asked whether to send it tonight.',
      source: 'legal counsel',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1520,
      surface: 'alert-queue',
      summary: 'Three thousand eight hundred customers had a statement read by somebody else',
      detail:
        'The 3,880 successful requests correspond to roughly 3,700 distinct customer accounts. Under ' +
        'the notification duty Fenmarch operates to, a third party accessing customer records is ' +
        'assessed on what was accessed rather than on what the accessor intended. The clock runs ' +
        'from when Fenmarch became aware, which was 16:55 today.',
      source: 'legal counsel',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.10',
      atSeconds: 1710,
      surface: 'alert-queue',
      summary: 'What can be done tonight',
      detail:
        'The authorisation check can be added and deployed in about two hours by the portal team, ' +
        'who have somebody available. Rate limiting on the endpoint takes twenty minutes and is ' +
        'independent of the fix. The endpoint can be disabled entirely, which removes statement ' +
        'access for 40,000 customers. The July account is closed and its holder cannot be contacted ' +
        'through it.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
  ],
};

export const BEYOND_WHAT_THEY_SAID_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'The Fenmarch customer portal statement endpoint checks that a caller is authenticated and does not check that they own the account they are asking for. Identifiers are sequential. Any customer with a valid session can read any other customer statements, and that has been true since the portal launched in 2023.',
    'A person with a genuine Fenmarch account opened in 2021 found this and, between Monday and Wednesday, made 4,120 requests walking sequential identifiers at a two second interval. 3,880 returned somebody else statement, corresponding to about 3,700 distinct customers.',
    'Nothing alerted. No rate limiting on the endpoint, no alerting on sequential identifier access, and no monitoring of how many accounts one session touches. Fenmarch knows because the person sent an email.',
    'Their report is accurate, includes a screenshot of a real statement belonging to somebody else, and says they accessed a handful of records to confirm. The logs say four thousand. That gap is real and is not, by itself, evidence of bad faith: people who scan sequentially rarely have a felt sense of the number.',
    'The final paragraph hopes Fenmarch has a process for recognising this work, says a bounty would be appropriate, and says they will publish in ninety days as standard practice. There is no threat and no figure. Their public profile shows eleven prior coordinated disclosures.',
    'Whether they kept anything cannot be established. The documents were returned to their browser and what happened next is outside anything Fenmarch can observe. They say they deleted everything but the screenshot.',
    'One other session walked the same endpoint on 3 July: 240 sequential requests from an account opened two days earlier and closed the following week. Portal access logs retain six months, so nothing before March can be checked.',
    'Fenmarch has no security.txt, no disclosure policy and no reporting address. The reporter tried the support form on Monday, got an automated reply about account queries, and emailed the chief executive on Wednesday. Legal has drafted a cease and desist.',
    'Roughly 3,700 customers had a statement read by a third party. The notification duty is assessed on what was accessed rather than on intent, and the clock started at 16:55 today.',
    'The authorisation check is about two hours of work. Rate limiting is twenty minutes and is independent of it.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1190'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'fusion-analyst'],
      correctActions: ['act.triage-high', 'act.preserve', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.contact-attacker', 'act.attribute-named', 'act.tune'],
      escalateTo: ['ir-lead', 'log-analyst'],
      why:
        'Treat the report as evidence and not as a claim. Somebody has described a flaw precisely ' +
        'enough to reproduce, included a screenshot of a real customer statement they do not own, ' +
        'and told you they did it: that is a confession, a proof and a vulnerability disclosure in ' +
        'one email, and the room has to hold all three without letting one of them set the tone. ' +
        'Raise it, preserve the message and the screenshot exactly as received, and do not reply. ' +
        'The reply is a decision with legal and reputational weight and it is not this seat to make ' +
        'at half past five. What is worth noticing immediately is that a screenshot of somebody ' +
        'else statement is already a data access by a third party, whatever else turns out to be ' +
        'true tonight, so the notification question exists from this row onward and does not wait ' +
        'for anybody judgement about the sender.',
      standIn:
        'Read this as evidence, not a claim. He has described a flaw precisely enough to reproduce, ' +
        'attached a screenshot of a real customer statement that is not his, and told us he did it. ' +
        'That is a confession, a proof and a disclosure in one email and we hold all three without ' +
        'letting any of them set the tone. Raising it, preserving the message and the screenshot as ' +
        'received, and nobody replies. The reply is a legal decision, not mine, and not at half five. ' +
        'And note now: a screenshot of somebody else statement is already third party access, ' +
        'whatever else turns out to be true, so the notification question starts here.',
      commandOptions: [
        { command: "grep -iE 'from:|received:|date:' /evidence/mail/disclosure-report.eml | head", correct: true, teaches: CORRECT_STEP },
        { command: "sha256sum /evidence/mail/disclosure-report.eml /evidence/mail/attachment-screenshot.png", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status postfix', ...STATUS_CHECK },
        { command: 'cat /evidence/mail/disclosure-report.eml', ...DUMP_ALL },
        { command: 'mail -s "Re: your report" reporter@example.net < /dev/null', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Preserve the message and its attachment before anybody does anything else with them.',
      guidance:
        'Somebody told you about a flaw. Ask what the telling proves.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1190'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.scope-estate', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.tune'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Reproduce it before arguing about anything else, because everything on this board depends ' +
        'on whether the flaw is real and it takes two minutes to find out. It is real. The endpoint ' +
        'checks authentication and not ownership, identifiers are sequential, and that combination ' +
        'means any customer can read any other customer statements with a parameter change. It has ' +
        'been in production since 2023, which is the number that reframes the incident: the ' +
        'reporter did not create an exposure, they demonstrated one that has existed for two years, ' +
        'and the interesting question stops being what they did and becomes who else has done it. ' +
        'That reframing needs to happen early, because a room that stays focused on the reporter ' +
        'will spend the evening on the one person who told us and never ask about the ones who did ' +
        'not.',
      standIn:
        'Reproduce it first, everything depends on it and it takes two minutes. It is real. Checks ' +
        'authentication, does not check ownership, sequential identifiers, so any customer reads any ' +
        'other customer statements with a parameter change. In production since 2023. That number ' +
        'reframes this: he did not create the exposure, he demonstrated one that has been there two ' +
        'years. So the question stops being what he did and becomes who else has. I want that ' +
        'reframe now, because otherwise we spend the evening on the one person who told us and never ' +
        'ask about the ones who did not.',
      commandOptions: [
        { command: "grep -nE 'def statement|authorize|account_id' /evidence/portal/statements_view.py", correct: true, teaches: CORRECT_STEP },
        { command: "git -C /evidence/portal log --oneline -- statements_view.py | tail -3", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status portal', ...STATUS_CHECK },
        { command: 'cat /evidence/portal/statements_view.py', ...DUMP_ALL },
        { command: 'curl -s https://portal.fenmarch.example/statement?account=90210', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Read the endpoint and find out which checks it makes and which it does not.',
      guidance:
        'They say there is a flaw. Ask whether there is.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1190'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.scope-estate', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.declare'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'They said a handful and the logs say 4,120, of which 3,880 returned somebody else ' +
        'statement. That gap is the most important measurement of the night and it is also the one ' +
        'most likely to be over-read. It is not, by itself, evidence of bad faith: a person walking ' +
        'sequential identifiers with a two second gap has no felt sense of the total, and a handful ' +
        'is what confirming a flaw feels like from the inside even when the script ran for three ' +
        'days. What the number does establish, regardless of what they meant, is the size of the ' +
        'notification: 3,880 successful reads is a fact about customers and does not move based on ' +
        'anybody intent. Report the figure and the reporter description side by side without ' +
        'characterising the difference, because the characterisation is exactly what the room is ' +
        'not yet entitled to and what everybody reading the write-up will latch onto.',
      standIn:
        'He said a handful. The logs say 4,120, of which 3,880 returned somebody else statement. That ' +
        'gap is the most important number tonight and the easiest one to over-read. It is not proof ' +
        'of bad faith on its own. Somebody walking sequential identifiers at two seconds has no feel ' +
        'for the total, and a handful is what confirming a flaw feels like from the inside even when ' +
        'the script ran three days. What it does establish, whatever he meant, is the size of the ' +
        'notification, and 3,880 is a fact about customers that does not move with intent. Put the ' +
        'number and his words side by side and do not characterise the difference. We are not ' +
        'entitled to that yet and it is what everyone will latch onto.',
      commandOptions: [
        { command: "awk -F' ' '$3==\"SESSION-8841\" && $6==\"200\" {n++} END {print n}' /var/log/portal/access-week.log", correct: true, teaches: CORRECT_STEP },
        { command: "grep 'SESSION-8841' /var/log/portal/access-week.log | grep -oE 'account=[0-9]+' | sort -u | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status portal', ...STATUS_CHECK },
        { command: 'cat /var/log/portal/access-week.log', ...DUMP_ALL },
        { command: 'grep -c statement /var/log/portal/access-week.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Count the requests and count how many returned a statement, and keep the two figures apart.',
      guidance:
        'They say a handful. Ask the logs.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest', 'act.predict'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Four thousand requests from one session to one endpoint over three days and nothing fired. ' +
        'This is worse than the vulnerability and the room should hear why in those words. The flaw ' +
        'has one fix and two hours of work behind it. The gap means Fenmarch has no way of knowing ' +
        'whether anybody else has been doing this since 2023, so the flaw ends tonight and the ' +
        'uncertainty does not. Note also what kind of gap it is: nobody needed a clever detection ' +
        'here. One session touching thousands of distinct customer accounts is the plainest ' +
        'possible signal, it needs no threat intelligence and no model, and it is absent because ' +
        'nobody thought of the portal as a place where a customer might be the attacker. That ' +
        'assumption is the finding rather than the missing rule, and it will still be there ' +
        'tomorrow on every other customer-facing endpoint unless somebody names it.',
      standIn:
        'Four thousand requests, one session, one endpoint, three days, nothing fired. That is worse ' +
        'than the vulnerability and I want it said in those words. The flaw has one fix and two ' +
        'hours behind it. The gap means we cannot say whether anybody else has been doing this since ' +
        '2023, so the flaw ends tonight and the uncertainty does not. And this needed no cleverness. ' +
        'One session touching thousands of distinct customers is the plainest signal there is, no ' +
        'intelligence, no model. It is missing because nobody thought of the portal as somewhere the ' +
        'customer might be the attacker. That assumption is the finding, and it is on every other ' +
        'customer-facing endpoint we own.',
      commandOptions: [
        { command: "awk '{print $3}' /var/log/portal/access-week.log | sort | uniq -c | sort -rn | head -5", correct: true, teaches: CORRECT_STEP },
        { command: "grep -icE 'rate|sequential|enumerat' /evidence/detections/portal-rules.txt", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status siem', ...STATUS_CHECK },
        { command: 'cat /evidence/detections/portal-rules.txt', ...DUMP_ALL },
        { command: 'grep -rn "portal" /evidence/detections/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'Work out what the simplest rule would have been, and check whether anything like it exists.',
      guidance:
        'Nothing alerted for three days. Ask what would have.',
    },
    {
      eventId: 'ev.5',
      verdict: 'ambiguous',
      leaning: 'benign',
      wouldSettleIt:
        'Nothing available tonight. The sentence is compatible with a researcher who is clumsy about ' +
        'money and with somebody applying gentle pressure, and the text does not distinguish them. ' +
        'Their eleven prior disclosures were all coordinated and none is reported as having gone ' +
        'wrong, which is the strongest evidence available and is about their history rather than ' +
        'about this email. A conversation would tell you more than any amount of re-reading, and ' +
        'whether to have one is a decision for legal rather than for this room.',
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.assess-actor', 'act.corroborate', 'act.notify-legal'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.declare', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'A bounty would be appropriate, and a write-up in ninety days as is standard practice. Read ' +
        'that twice, because it reads differently depending on what the reader already suspects and ' +
        'that is the trap. There is no threat, no figure, no deadline other than the ninety days, ' +
        'and ninety days is the ordinary coordinated disclosure convention rather than an ultimatum. ' +
        'Eleven prior coordinated disclosures is the strongest evidence available and it is evidence ' +
        'about their history, not about this email. Lean benign and say the leaning out loud with ' +
        'its reason, because somebody in the building has already decided this is extortion and the ' +
        'only defence against that reading hardening into a fact is naming it as an interpretation ' +
        'while it still is one. What actually matters is that the answer changes almost nothing ' +
        'operationally: the flaw gets fixed and the customers get notified whether this person is a ' +
        'researcher or not, and the only decision it touches is how Fenmarch talks to them.',
      standIn:
        'A bounty would be appropriate, and a write-up in ninety days as is standard practice. Read ' +
        'it twice, because it reads differently depending on what you already think, and that is the ' +
        'trap. No threat, no figure, no deadline except ninety days, and ninety days is the ordinary ' +
        'convention, not an ultimatum. Eleven prior coordinated disclosures, which is evidence about ' +
        'his history and not about this email. I lean benign and I am saying the leaning out loud ' +
        'with the reason, because somebody upstairs has already decided this is extortion and naming ' +
        'it as an interpretation now is the only thing that stops it becoming a fact. And it changes ' +
        'almost nothing: we fix the flaw and notify the customers either way. It only changes how we ' +
        'talk to him.',
      commandNudge:
        'Read the paragraph for what it says rather than for what it implies, and check their history separately.',
    },
    {
      eventId: 'ev.6',
      verdict: 'ambiguous',
      leaning: 'benign',
      wouldSettleIt:
        'Nothing Fenmarch can obtain. The documents were delivered to their browser and what ' +
        'happened afterwards leaves no trace on any system Fenmarch owns or could lawfully reach. ' +
        'A written undertaking from them, or a deletion attested to, would be an assurance rather ' +
        'than evidence, and no technical measure available tonight or later can distinguish ' +
        'retained data from deleted data at the far end.',
      firstResponder: 'forensics',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.investigate-hold', 'act.notify-legal'],
      outOfLaneActions: ['act.declare', 'act.dismiss', 'act.contact-attacker', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Three thousand eight hundred and eighty statement documents were delivered to a browser and ' +
        'Fenmarch has no visibility past that point, will never have, and no amount of further ' +
        'analysis changes it. Say that as a hard boundary rather than as an open line of enquiry, ' +
        'because a room that leaves it open will keep sending people to look, and somebody will ' +
        'eventually propose something Fenmarch has no right to do. Lean benign on their account: ' +
        'the screenshot in the report is a single statement, which is consistent with what they ' +
        'said, and eleven coordinated disclosures is a pattern of not keeping things. It stays a ' +
        'leaning because assurance is not evidence, and the practical consequence is the part to ' +
        'carry into the write-up: the notification cannot be softened by their assurance. Whether ' +
        '3,700 customers are told does not depend on what one person did with the files, and a ' +
        'report that implies otherwise is asking the reader to take a stranger word on their behalf.',
      standIn:
        'Three thousand eight hundred and eighty documents went to a browser and we cannot see past ' +
        'that, will never see past it, and no further analysis changes that. I want it recorded as a ' +
        'hard boundary, not an open line, because if it stays open somebody keeps sending people to ' +
        'look and eventually proposes something we have no right to do. I lean towards believing ' +
        'him: the screenshot is one statement, which matches what he said, and eleven coordinated ' +
        'disclosures is a pattern of not keeping things. It stays a leaning because an assurance is ' +
        'not evidence. And the consequence goes in the write-up: his assurance does not soften the ' +
        'notification. Whether 3,700 people get told cannot depend on taking a stranger word for ' +
        'them.',
      commandNudge:
        'Establish what your evidence can and cannot reach, and write the boundary down.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1190'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.scope-estate', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.tune'],
      escalateTo: ['ir-lead', 'threat-intel'],
      why:
        'Somebody else walked this endpoint on 3 July, 240 sequential requests, from an account ' +
        'opened two days before and closed the week after. That is the shape of somebody who came ' +
        'for this and left, and nobody told Fenmarch about it. This row is why the reporter mattered ' +
        'far less than the room thought at half past five: the flaw has been reachable since 2023, ' +
        'at least one other person found it, and they behaved nothing like a researcher. The ' +
        'genuinely difficult part is the retention. Six months means nothing before March can be ' +
        'checked, so what the room can say is that this happened at least twice, and what it cannot ' +
        'say is how many times before that, and those two sentences have to sit next to each other ' +
        'in the report without the second quietly turning into a reassurance.',
      standIn:
        'Somebody else walked this on the third of July. Two hundred and forty sequential requests ' +
        'from an account opened two days before and closed the week after. That is somebody who came ' +
        'for this and left, and they did not write to us. This is why the reporter mattered less ' +
        'than we thought at half five: reachable since 2023, at least one other person found it, and ' +
        'they behaved nothing like a researcher. And the retention is the hard bit. Six months, so ' +
        'nothing before March. We can say it happened at least twice. We cannot say how many times ' +
        'before that. Both sentences go in the report and the second does not get to sound ' +
        'reassuring.',
      commandOptions: [
        { command: "awk '{print $3}' /var/log/portal/access-6mo.log | sort | uniq -c | awk '$1>100' | sort -rn", correct: true, teaches: CORRECT_STEP },
        { command: "grep -oE 'account=[0-9]+' /var/log/portal/access-6mo.log | sort | uniq -c | sort -rn | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status portal', ...STATUS_CHECK },
        { command: 'cat /var/log/portal/access-6mo.log', ...DUMP_ALL },
        { command: 'grep -c account /var/log/portal/access-6mo.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Search the retained logs for any other session with the same shape, and check how far back they go.',
      guidance:
        'One person found this and told you. Ask who found it and did not.',
    },
    {
      eventId: 'ev.8',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'ir-lead',
      alsoAppropriate: ['fusion-analyst', 'detection-engineer'],
      correctActions: ['act.notify-legal', 'act.investigate-hold', 'act.sequence-remedy'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.dismiss', 'act.isolate'],
      escalateTo: ['mitigation-specialist'],
      why:
        'No security.txt, no disclosure policy, no reporting address. They tried the support form on ' +
        'Monday, got an automated reply about account queries, and emailed the chief executive on ' +
        'Wednesday, which is what anybody would do and is the only route Fenmarch left open. The ' +
        'cease and desist is the decision that matters tonight and the answer is to advise against ' +
        'sending it, in writing, with reasons. It stops nothing, because the flaw is already fixed ' +
        'or is about to be and they already have whatever they have. It ends the only channel ' +
        'through which Fenmarch can ask them anything, including what they kept. And in ninety days ' +
        'it becomes the story: the write-up will describe a firm that had nowhere to report a ' +
        'vulnerability and answered the person who found one with a lawyer, which is a worse ' +
        'article than the flaw. Say that this is advice and not a veto, because the decision belongs ' +
        'to legal, and put the reasoning in writing so that whichever way it goes the reasoning ' +
        'exists.',
      standIn:
        'No security.txt, no disclosure policy, no reporting address. He tried the support form ' +
        'Monday, got an automated reply about account queries, and emailed the chief executive ' +
        'Wednesday. That is what anyone would do and it is the only route we left open. The cease ' +
        'and desist is tonight decision and my advice is do not send it, in writing, with reasons. ' +
        'It stops nothing, the flaw is fixed and he has what he has. It closes the only channel ' +
        'where we can ask him anything, including what he kept. And in ninety days it is the story: ' +
        'a firm with nowhere to report a vulnerability that answered the finder with a lawyer. That ' +
        'is a worse article than the bug. It is advice, not a veto, the call is legal, and I want my ' +
        'reasoning on paper either way.',
      commandNudge:
        'Find out how somebody outside is supposed to report this to Fenmarch, and what they tried.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      firstResponder: 'ir-lead',
      alsoAppropriate: ['fusion-analyst', 'mitigation-specialist'],
      correctActions: ['act.notify-legal', 'act.declare', 'act.timeline'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.tune'],
      escalateTo: ['mitigation-specialist'],
      why:
        'Three thousand seven hundred customers had a statement read by somebody who is not them, ' +
        'and the duty is assessed on what was accessed rather than on what the accessor intended. ' +
        'That sentence is the one to hold on to, because every conversation for the next two hours ' +
        'will pull towards intent: he is a researcher, he says he deleted it, he was trying to help. ' +
        'All of that may be true and none of it changes the number. The clock started at 16:55 ' +
        'today, when Fenmarch became aware, not when the access happened, so the awareness time has ' +
        'to be recorded precisely and defensibly now rather than reconstructed later. And the ' +
        'reason to resist softening the notification is not procedural. Those 3,700 people are the ' +
        'only party in this incident with no voice in the room, and the argument for telling them ' +
        'less is always made by people who would find it inconvenient to tell them more.',
      standIn:
        'Three thousand seven hundred customers had a statement read by somebody who is not them, and ' +
        'the duty is assessed on what was accessed, not what the accessor meant. Hold that sentence, ' +
        'because every conversation for the next two hours pulls towards intent. He is a researcher, ' +
        'he says he deleted it, he was trying to help. All of that may be true and none of it moves ' +
        'the number. The clock started at 16:55 today when we became aware, not when it happened, so ' +
        'that time gets recorded precisely now and not reconstructed later. And the reason not to ' +
        'soften it is not procedure. Those 3,700 people are the only party here with nobody in the ' +
        'room, and the case for telling them less is always made by whoever finds it inconvenient to ' +
        'tell them more.',
      commandOptions: [
        { command: "grep 'SESSION-8841' /var/log/portal/access-week.log | grep ' 200 ' | grep -oE 'account=[0-9]+' | sort -u | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'aware|received' /evidence/mail/disclosure-report.eml | head -3", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status portal', ...STATUS_CHECK },
        { command: 'cat /var/log/portal/access-week.log', ...DUMP_ALL },
        { command: 'grep -c 200 /var/log/portal/access-week.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Count the distinct customers whose statements were returned, and fix the time you became aware.',
      guidance:
        'A third party read customer records. Ask who has to be told.',
    },
    {
      eventId: 'ev.10',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.contact-attacker', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'Rate limiting goes first, not the fix. Twenty minutes, independent of the authorisation ' +
        'check, and it converts the exposure from any customer can read the whole book to any ' +
        'customer can read slowly while we ship. The fix follows: two hours, the portal team have ' +
        'somebody available, and the rollback question needs asking out loud because an ' +
        'authorisation check added quickly to an endpoint that has never had one is exactly the ' +
        'change that locks legitimate customers out of their own statements at nine tomorrow. ' +
        'Disabling the endpoint entirely is available and is the wrong answer: it removes statement ' +
        'access for 40,000 people to close a flaw that two hours and a rate limit close properly, ' +
        'and it will be proposed because it feels decisive. Deliberately left undone: 3,700 ' +
        'customers have already had statements read and nothing recovers that, the July account is ' +
        'closed and its holder cannot be reached through it, and everything before March is outside ' +
        'retention and will stay unknown.',
      standIn:
        'Rate limit first, not the fix. Twenty minutes, independent of the authorisation check, and ' +
        'it turns any customer can read the whole book into any customer can read slowly while we ' +
        'ship. Then the fix, two hours, they have somebody. And somebody answer the rollback ' +
        'question out loud, because an authorisation check added fast to an endpoint that never had ' +
        'one is exactly what locks real customers out of their own statements at nine tomorrow. ' +
        'Turning the endpoint off is available and it is the wrong answer, forty thousand people ' +
        'lose statement access to close something two hours fixes properly, and it will get proposed ' +
        'because it feels decisive. Left undone: 3,700 statements are read and nothing undoes it, ' +
        'the July account is closed, and everything before March is outside retention and stays ' +
        'unknown.',
      commandNudge:
        'Find the change that reduces the exposure fastest, and check it is not the one that breaks the most.',
    },
  ],
};
