/**
 * Scenario 96: They Knew Which Lorry.
 *
 * Two vehicles were stopped and robbed in three weeks, and the police are
 * asking whether somebody read it out of an Ardal system.
 *
 * WHAT THIS TEACHES
 *
 * That a SOC is sometimes asked a question about the physical world, and that
 * the honest answer usually has a shape the room is not used to producing.
 * Nothing here alerted. The incident arrives because a detective rang, seven
 * weeks after the first query, and the floor is being asked to reconstruct
 * something from logs that were never kept for this purpose.
 *
 * It also teaches that a good product decision can be the exposure. The
 * customer portal shows people where their goods are, which is the single most
 * requested thing a haulage customer wants, and nobody assessed what it means
 * that 214 external users can see every vehicle rather than their own.
 *
 * TWO THINGS THAT DO NOT RESOLVE
 *
 * Whether the portal account was compromised or its owner was involved, which
 * matters enormously to a person and changes nothing about what Ardal must do.
 * And whether the data was the source at all, because both loads were
 * discussed at a depot and both vehicles ran a predictable route, so a
 * complete alternative explanation exists that leaves no logs anywhere.
 *
 * WHY EXPERT
 *
 * The evidence is partial by construction: the telematics vendor keeps thirty
 * days against a seven week question. Two threads stay open. And the room has
 * to report to a police officer without asserting anything it cannot support,
 * about a customer who may be a victim.
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

const ID = 'they-knew-which-lorry';

export const THEY_KNEW_WHICH_LORRY: Scenario = {
  id: ID,
  title: 'They Knew Which Lorry',
  difficulty: 'expert',
  durationMinutes: 90,
  situation:
    'It is 11:00 at Ardal Freight. Two lorries have been stopped and robbed in three weeks, and a ' +
    'detective has asked whether somebody could have read the routes out of our systems.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
    'forensics',
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
      summary: 'The police are asking whether our systems were read',
      detail:
        'Two Ardal vehicles were stopped and their loads taken, on 12 August and 2 September, both ' +
        'carrying consumer electronics, both on quiet stretches of road within twenty minutes of ' +
        'leaving a depot. A detective rang at 10:40 asking whether route or load information could ' +
        'have been obtained from an Ardal system. Nothing in the estate has alerted on anything ' +
        'related, before or since.',
      source: 'police liaison',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.2',
      atSeconds: 190,
      surface: 'cloud-audit',
      summary: 'Two hundred and fourteen customers can see every vehicle',
      detail:
        'The Ardal customer portal shows load manifests and live vehicle positions. It has 214 ' +
        'external user accounts across 40 customer companies. The position map is not filtered by ' +
        'customer: any signed-in account can see every Ardal vehicle, its current location, and the ' +
        'manifest summary for the load it is carrying. This was built deliberately in 2024 because ' +
        'customers kept ringing to ask where things were.',
      source: 'customer portal',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 380,
      surface: 'raw-log',
      summary: 'One account looked at both vehicles, days before each',
      detail:
        'Portal account brentmoor-ops queried the manifest and position history for vehicle AF-114 ' +
        'on 9, 10 and 11 August, and for AF-207 on 30 and 31 August. Those are the two vehicles. ' +
        'The account belongs to Brentmoor Haulage Supplies, a two-person firm that ships with Ardal ' +
        'about once a month and has no goods on either vehicle.',
      source: 'customer portal',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 570,
      surface: 'network-flow',
      summary: 'That account has not signed in from its own office since May',
      detail:
        'Sign-ins for brentmoor-ops since May come from a residential range and from a hosting ' +
        'provider range, never from the Brentmoor office address that it used from 2023 until May. ' +
        'The portal has no multi-factor authentication. The account password was set in 2023 and ' +
        'has never been changed.',
      source: 'customer portal',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 760,
      surface: 'cloud-audit',
      expertOnly: true,
      summary: 'Whether that account was stolen or lent does not resolve',
      detail:
        'A two-person firm using a shared account from home is unremarkable, and a residential range ' +
        'is where most small customers now work from. The hosting range is not, and is equally ' +
        'consistent with a compromised credential and with somebody using a commercial VPN. ' +
        'Brentmoor has not been contacted. The portal keeps no device or session detail beyond the ' +
        'source address.',
      source: 'customer portal',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 950,
      surface: 'cloud-audit',
      summary: 'A second account with an odd pattern, which is a nightly job',
      detail:
        'Account kesgrave-integration queried 4,100 manifests last month, far more than any human ' +
        'account. It is a documented integration that pulls delivery status for a customer own ' +
        'system every night at 02:00, was set up in 2023 with a signed data sharing agreement, and ' +
        'runs from that customer fixed office address every time.',
      source: 'customer portal',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 1140,
      surface: 'raw-log',
      summary: 'The telematics vendor keeps thirty days',
      detail:
        'Live vehicle positions come from a third party telematics platform with its own API and its ' +
        'own credentials, held by Ardal operations. The vendor retains API access logs for thirty ' +
        'days. The first portal query of interest was seven weeks ago, so whether that API was also ' +
        'queried directly during the relevant period cannot be established and never will be.',
      source: 'telematics vendor',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.8',
      atSeconds: 1330,
      surface: 'alert-queue',
      expertOnly: true,
      summary: 'A complete alternative explanation that leaves no logs',
      detail:
        'A driver has told the transport manager that both loads were discussed openly in the ' +
        'Immingham depot canteen the week before each run, including what was on them. Both ' +
        'vehicles also ran the standard route from that depot, which is the same road at the same ' +
        'time on the same day of the week, and has been for four years. Neither fact requires ' +
        'anybody to have read anything.',
      source: 'transport manager',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1520,
      surface: 'alert-queue',
      summary: 'What can be changed and what it costs',
      detail:
        'Filtering the position map so an account sees only its own goods takes about two days of ' +
        'development and removes the most used feature for customers who like watching everything ' +
        'move. Multi-factor authentication on the portal can be required in an afternoon and 214 ' +
        'external users will need enrolling. Suspending brentmoor-ops takes a minute. Changing ' +
        'route planning is an operations decision with a fuel and hours cost attached.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.10',
      atSeconds: 1710,
      surface: 'alert-queue',
      summary: 'Nobody had ever asked this team about a robbery',
      detail:
        'There is no process connecting physical security incidents to the security team. The two ' +
        'robberies were handled by the transport manager and the insurer, and the question of ' +
        'whether a system was involved was asked seven weeks later by a detective rather than by ' +
        'anybody at Ardal. Ardal has had eleven load thefts in three years and none of them was ' +
        'ever looked at this way.',
      source: 'security programme',
      claimedSeverity: 'critical',
    },
  ],
};

export const THEY_KNEW_WHICH_LORRY_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Two Ardal vehicles were stopped and their loads taken, on 12 August and 2 September, both carrying consumer electronics, both within twenty minutes of leaving a depot on a quiet road. Nothing in the estate alerted on anything related. The question reaches the SOC because a detective rang seven weeks after the first relevant query.',
    'The customer portal shows load manifests and live vehicle positions to 214 external accounts across 40 customer companies, and the position map is not filtered by customer. Any signed-in account can see every Ardal vehicle, where it is, and what it is carrying. That was built deliberately in 2024 because customers kept ringing to ask where things were, and it is the single most used thing on the portal.',
    'Account brentmoor-ops queried the manifest and position history for AF-114 on 9, 10 and 11 August and for AF-207 on 30 and 31 August. Those are the two vehicles. Brentmoor is a two-person firm that ships about once a month and had no goods on either.',
    'That account has not signed in from the Brentmoor office since May. Since then it has come from a residential range and from a hosting provider range. There is no multi-factor authentication and the password was set in 2023.',
    'Whether the account was stolen or used by its owner does not resolve. A two-person firm working from home is unremarkable, the hosting range fits both a compromised credential and a commercial VPN, and the portal keeps no device or session detail. Brentmoor has not been contacted.',
    'kesgrave-integration queried 4,100 manifests and is a documented nightly job under a signed agreement, running from a fixed office address every time.',
    'The telematics vendor retains API logs for thirty days against a seven week question, so whether that API was queried directly during the relevant period cannot be established and never will be.',
    'A complete alternative explanation exists and leaves no logs anywhere: both loads were discussed openly in the Immingham depot canteen the week before each run, and both vehicles took the standard route from that depot, same road, same time, same day of the week, for four years.',
    'Filtering the map by customer is two days of work and removes the most popular feature. Multi-factor authentication is an afternoon plus enrolling 214 external users. Suspending the account takes a minute.',
    'There is no process connecting physical security incidents to this team. Ardal has had eleven load thefts in three years and none was ever looked at this way.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'ir-lead',
      alsoAppropriate: ['soc-operator', 'fusion-analyst'],
      correctActions: ['act.preserve', 'act.notify-legal', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.declare', 'act.contact-attacker'],
      escalateTo: ['cloud-security', 'log-analyst'],
      why:
        'A question from outside, about the physical world, arriving seven weeks late, with nothing ' +
        'in the estate having alerted. Every one of those shapes the work. Preserve first and ' +
        'broadly, because retention is now the binding constraint on everything the floor can ever ' +
        'say and every day that passes removes evidence nobody has looked at yet. Get legal ' +
        'involved before answering a detective, not because there is anything to hide but because ' +
        'what Ardal says to a police officer about a customer is not a technical decision. And set ' +
        'the room expectation now: this is a reconstruction from logs kept for other purposes, so ' +
        'the honest output is a range of what is and is not supportable rather than an answer, and ' +
        'a floor that starts hunting for the culprit will produce something confident and wrong.',
      standIn:
        'A question from outside, about the physical world, seven weeks late, and nothing of ours ' +
        'alerted. All of that shapes what we can do. Preserve first and preserve broadly, because ' +
        'retention is now the limit on everything we will ever be able to say and every day removes ' +
        'something nobody has looked at. Legal before we answer a detective, not because we are ' +
        'hiding anything but because what we say to the police about a customer is not a technical ' +
        'call. And everybody set expectations now: this is a reconstruction from logs kept for other ' +
        'reasons. The output is what we can and cannot support, not an answer. Go hunting for a ' +
        'culprit and we will produce something confident and wrong.',
      commandOptions: [
        { command: "grep -iE 'AF-114|AF-207' /evidence/fleet/movements-august.csv | head", correct: true, teaches: CORRECT_STEP },
        { command: "for l in portal telematics fleet; do grep -i retention /evidence/$l/retention.txt; done", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status portal', ...STATUS_CHECK },
        { command: 'cat /evidence/fleet/movements-august.csv', ...DUMP_ALL },
        { command: 'grep -rn "robbery" /evidence/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'Before looking for anything, find out how long each relevant log is kept.',
      guidance:
        'Somebody outside is asking. Ask what you still have.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.iam-audit', 'act.scope-estate', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.revoke-key'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Two hundred and fourteen people at forty companies can see every Ardal vehicle, where it ' +
        'is, and what is on it. That is the finding whether or not it is the answer, and the room ' +
        'should register it as such before going any further, because the rest of the morning will ' +
        'be about one account and this is about all of them. Nobody made a mistake building it: ' +
        'customers rang constantly asking where things were, showing them was the obvious fix, and ' +
        'the map became the most used thing on the portal. What was never done is the second ' +
        'question, which is what it means that the answer to where is my delivery also answers ' +
        'where is everybody else consignment of electronics. Say it plainly and without blame, ' +
        'because the operations people who built it are the ones who will have to change it.',
      standIn:
        'Two hundred and fourteen people at forty companies can see every vehicle we have, where it ' +
        'is, and what is on it. That is a finding whether or not it is the answer, and I want it ' +
        'registered before we go further, because the rest of this morning is about one account and ' +
        'this is about all of them. Nobody erred building it. Customers rang constantly asking where ' +
        'things were and showing them was the obvious fix. What never happened is the second ' +
        'question: where is my delivery also answers where is everyone else consignment of ' +
        'electronics. Say that without blame. The people who built it have to change it.',
      commandOptions: [
        { command: "jq -r '.accounts | length' /evidence/portal/users.json; jq -r '[.accounts[].company] | unique | length' /evidence/portal/users.json", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'filter|scope|customer_id' /evidence/portal/map-endpoint.py", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status portal', ...STATUS_CHECK },
        { command: 'cat /evidence/portal/users.json', ...DUMP_ALL },
        { command: 'portal-cli users disable --all-external', ...MUTATE },
      ],
      commandNudge:
        'Find out how many external accounts exist and whether the map limits what each one sees.',
      guidance:
        'Customers can see their goods. Ask what else they can see.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'reconnaissance',
      critical: true,
      techniques: ['T1213'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate', 'act.preserve'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.contact-attacker', 'act.declare'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'One account looked at both vehicles, on three consecutive days before the first and two ' +
        'before the second, and has no goods on either. That is the strongest thing on the board ' +
        'and it needs stating carefully, because it is also exactly the point at which a floor ' +
        'starts naming a person. What is established is that this account was used to look at both ' +
        'vehicles shortly before both robberies. What is not established is who was at the keyboard, ' +
        'or that the looking caused the robbing. Write the sequence and the dates and stop there. ' +
        'Somebody should also say the obvious counter out loud so it is on the record rather than ' +
        'raised later: a query pattern that looks damning after the fact would look like nothing at ' +
        'all if the robberies had not happened, and the floor is reading these logs already knowing ' +
        'the answer it expects.',
      standIn:
        'One account looked at both vehicles, three days running before the first and two before the ' +
        'second, and had no goods on either. That is the strongest thing here and it is where we ' +
        'start naming people, so be careful. Established: this account was used to look at both ' +
        'vehicles shortly before both robberies. Not established: who was at the keyboard, or that ' +
        'the looking caused the robbing. Write the sequence and the dates and stop. And somebody put ' +
        'the counter on the record now rather than later: this pattern would look like nothing if ' +
        'the robberies had not happened, and we are reading these logs already knowing what we ' +
        'expect to find.',
      commandOptions: [
        { command: "awk -F, '$3 ~ /AF-114|AF-207/ {print $1, $2, $3}' /evidence/portal/query-log.csv", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$2==\"brentmoor-ops\" {print $1, $3}' /evidence/portal/query-log.csv | sort", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status portal', ...STATUS_CHECK },
        { command: 'cat /evidence/portal/query-log.csv', ...DUMP_ALL },
        { command: 'grep -c AF-114 /evidence/portal/query-log.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find every account that looked at those two vehicles, and when.',
      guidance:
        'Two vehicles were taken. Ask who looked at them.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1078'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.timeline', 'act.iam-audit'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.contact-attacker', 'act.declare'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'The office address stopped being used in May and everything since comes from a residential ' +
        'range and a hosting range. The May boundary is the useful part, because it is a change with ' +
        'a date rather than a state, and it means whatever happened to this account happened around ' +
        'then rather than in August. No multi-factor authentication and a password set in 2023 is ' +
        'the enabling condition and is worth stating as an Ardal failure rather than a Brentmoor ' +
        'one: a two-person customer firm is not who should be carrying the security of a portal that ' +
        'shows every vehicle in the fleet. Do not read the residential range as suspicious on its ' +
        'own, because most small customers work from home now and saying otherwise would put a ' +
        'wrong inference in front of a detective.',
      standIn:
        'Office address stops in May, everything since is a residential range and a hosting range. ' +
        'The May boundary is the useful bit, because it is a change with a date, so whatever ' +
        'happened to this account happened around then and not in August. No MFA and a password from ' +
        '2023 is the enabling condition, and that is our failure, not Brentmoor. A two-person ' +
        'customer should not be carrying the security of a portal that shows our whole fleet. And ' +
        'nobody treat the residential range as suspicious on its own. Most small customers work from ' +
        'home now, and putting that inference in front of a detective would be wrong.',
      commandOptions: [
        { command: "awk -F, '$2==\"brentmoor-ops\" {print $1, $4}' /evidence/portal/signin-log.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$2==\"brentmoor-ops\" && $1 < \"2026-06\" {print $4}' /evidence/portal/signin-log.csv | sort -u", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status portal', ...STATUS_CHECK },
        { command: 'cat /evidence/portal/signin-log.csv', ...DUMP_ALL },
        { command: 'portal-cli user reset-password brentmoor-ops', ...MUTATE },
      ],
      commandNudge:
        'Look at where that account has signed in from over the whole year, not just recently.',
      guidance:
        'One account is interesting. Ask where it signs in from.',
    },
    {
      eventId: 'ev.5',
      verdict: 'ambiguous',
      leaning: 'malicious',
      wouldSettleIt:
        'Speaking to Brentmoor, which is a decision for the police rather than for Ardal now that ' +
        'there is an investigation, and device or session detail from the portal, which was never ' +
        'collected. The hosting range could be resolved to a provider but not to a subscriber ' +
        'without a legal process Ardal is not party to.',
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.assess-actor', 'act.investigate-hold', 'act.notify-legal'],
      outOfLaneActions: ['act.attribute-named', 'act.declare', 'act.contact-attacker', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'Two readings and the difference between them matters enormously to two people at a small ' +
        'firm and changes nothing about what Ardal has to do. Either the credential was taken, in ' +
        'which case Brentmoor are victims who are about to be told their account was used in a ' +
        'robbery enquiry, or somebody there is involved. A residential range fits both. The hosting ' +
        'range leans towards a compromised credential being used deliberately, which is why the ' +
        'leaning is malicious, and it is equally consistent with a commercial VPN that thousands of ' +
        'ordinary people use. Refuse to go further than the leaning, and be explicit about why in ' +
        'the report: a detective reading this will act on it, and a sentence that reads as an ' +
        'accusation against a named two-person business is a thing that cannot be taken back. The ' +
        'evidence that would settle it was never collected, and Ardal is not the party that gets to ' +
        'go and ask.',
      standIn:
        'Two readings, and the difference matters enormously to two people at a small firm and ' +
        'changes nothing about what we do. Either the credential was taken, in which case Brentmoor ' +
        'are victims about to be told their account is in a robbery enquiry, or somebody there is ' +
        'involved. Residential fits both. The hosting range leans me towards a stolen credential ' +
        'used deliberately, and it is equally consistent with a VPN thousands of ordinary people ' +
        'use. I am not going past the leaning and I want the reason in the report, because a ' +
        'detective will act on what we write and a sentence that reads as an accusation against a ' +
        'named two-person business cannot be taken back. What would settle it was never collected, ' +
        'and we are not the ones who get to go and ask.',
      commandNudge:
        'Write down what each reading requires, and mark which of those you could ever check.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['cloud-security', 'log-analyst'],
      correctActions: ['act.corroborate', 'act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.declare', 'act.attribute-named', 'act.revoke-key'],
      escalateTo: [],
      why:
        'Four thousand one hundred manifests is far more than any person could read and it is a ' +
        'documented nightly job under a signed agreement, running from the same office address every ' +
        'time. Close it. It earns its two minutes because volume is the thing that looks worst on a ' +
        'board like this and is the weakest signal on it: the account that did the damage queried ' +
        'five times and the innocent one queried four thousand. That inversion is worth saying out ' +
        'loud, because the instinct on a busy morning is to sort by count and start at the top, and ' +
        'doing that here puts a compliant customer at the top of a police enquiry and buries the ' +
        'five queries that matter.',
      standIn:
        'Four thousand one hundred manifests, which is more than any person could read, and it is a ' +
        'documented nightly job under a signed agreement from the same office address every time. ' +
        'Closing it. Worth the two minutes because volume looks worst on a board like this and is ' +
        'the weakest signal on it. The account that matters queried five times. The innocent one ' +
        'queried four thousand. Sort by count and start at the top and you put a compliant customer ' +
        'into a police enquiry and bury the five that count.',
      commandOptions: [
        { command: "awk -F, '$2==\"kesgrave-integration\" {print $1, $4}' /evidence/portal/signin-log.csv | awk '{print $2}' | sort -u", correct: true, teaches: CORRECT_STEP },
        { command: "grep -i 'kesgrave' /evidence/contracts/data-sharing.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status portal', ...STATUS_CHECK },
        { command: 'cat /evidence/portal/query-log.csv', ...DUMP_ALL },
        { command: 'portal-cli user disable kesgrave-integration', ...MUTATE },
      ],
      commandNudge:
        'Check whether the busiest account is documented anywhere before treating volume as a signal.',
      guidance:
        'One account queried thousands of times. Ask whether that is a person.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'forensics',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.preserve', 'act.corroborate', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.declare', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Thirty days of retention against a seven week question, so whether the telematics API was ' +
        'queried directly during the relevant period cannot be established and never will be. Record ' +
        'that as a boundary on the evidence rather than as a gap somebody might close, because ' +
        'somebody will otherwise keep sending people to ask the vendor and the answer will not ' +
        'improve. It also sets a limit on what Ardal can honestly tell the detective: the portal is ' +
        'one route to this information and the telematics API is another, and only one of them can ' +
        'be examined. Preserve the thirty days that do exist today, because they will be gone in a ' +
        'month and the enquiry will not be.',
      standIn:
        'Thirty days of retention against a seven week question. Whether that API was queried ' +
        'directly in the period cannot be established and never will be. Record it as a boundary on ' +
        'the evidence, not a gap somebody might close, or people keep going back to the vendor and ' +
        'the answer never improves. And it limits what we can honestly tell the detective, because ' +
        'the portal is one route to this and the telematics API is another and we can only look at ' +
        'one. Preserve the thirty days we do have today. They are gone in a month and the enquiry ' +
        'will not be.',
      commandOptions: [
        { command: "grep -iE 'retention|days' /evidence/telematics/vendor-terms.txt", correct: true, teaches: CORRECT_STEP },
        { command: "telematics-cli audit export --since 30d --out /preserve/telematics-30d.json", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status telematics-agent', ...STATUS_CHECK },
        { command: 'cat /evidence/telematics/vendor-terms.txt', ...DUMP_ALL },
        { command: 'curl -s https://telematics.example/api/v1/positions', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find the other route to this data, and ask how far back its records go.',
      guidance:
        'The portal shows positions. Ask where the portal gets them.',
    },
    {
      eventId: 'ev.8',
      verdict: 'ambiguous',
      leaning: 'benign',
      wouldSettleIt:
        'Nothing available. A conversation in a canteen leaves no record, and a route that has been ' +
        'the same for four years is knowable by anybody who has watched the depot gate twice. ' +
        'Neither explanation can be excluded and neither can be confirmed, and the portal queries do ' +
        'not become irrelevant if the canteen conversation happened, because both could be true at ' +
        'once.',
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['ir-lead', 'threat-intel'],
      correctActions: ['act.corroborate', 'act.investigate-hold', 'act.assess-actor'],
      outOfLaneActions: ['act.declare', 'act.attribute-named', 'act.dismiss', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'A complete alternative explanation, arriving late, requiring nobody to have read anything. ' +
        'Both loads were discussed openly in a depot canteen the week before, and both vehicles ran ' +
        'a route that has been the same road at the same time on the same day for four years, which ' +
        'anybody could learn by watching a gate twice. Lean benign on the data question, meaning ' +
        'lean towards the portal not being necessary, and hold the two possibilities together rather ' +
        'than choosing: a canteen conversation and five portal queries can both be true, and the ' +
        'query pattern does not become innocent because another route exists. What this row really ' +
        'does is discipline the report. Ardal was asked whether its systems could have been the ' +
        'source, and the answer is yes and also they did not have to be, and a report that omits ' +
        'the second half is one a defence barrister takes apart in a sentence.',
      standIn:
        'A complete alternative, arriving late, needing nobody to read anything. Both loads discussed ' +
        'openly in the canteen the week before, and both vehicles on a route that has been the same ' +
        'road at the same time on the same day for four years, which anybody learns by watching the ' +
        'gate twice. I lean towards the portal not having been necessary, and I am not choosing ' +
        'between them: a canteen conversation and five portal queries can both be true, and the ' +
        'queries do not become innocent because another route exists. This is what disciplines the ' +
        'report. We were asked whether our systems could have been the source. The answer is yes, ' +
        'and they did not have to be, and leaving the second half out is what a barrister takes ' +
        'apart in one sentence.',
      commandNudge:
        'Ask what the alternative explanation would have left behind, and accept the answer when it is nothing.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'reconnaissance',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.sequence-remedy', 'act.check-rollback'],
      outOfLaneActions: ['act.isolate', 'act.contact-attacker', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'Suspend brentmoor-ops first, which takes a minute, and understand what it is and is not: it ' +
        'closes one account and does nothing about the exposure, because 213 others can see the same ' +
        'map. Coordinate the timing with the detective before doing it, because suspending an ' +
        'account tells whoever holds it that Ardal is looking, and that is now somebody else ' +
        'investigation to disrupt. Multi-factor authentication on the portal is an afternoon plus ' +
        'enrolling 214 external users at forty companies, which is the real cost and is worth ' +
        'paying. Filtering the map by customer is the actual fix and is two days, and it will be ' +
        'resisted because it removes the most used feature on the portal, so it needs to be put to ' +
        'somebody as a choice with both sides on it rather than smuggled in as a security ' +
        'requirement. Route planning belongs to operations and the cost is fuel and drivers hours, ' +
        'so raise it and let them decide. Deliberately left undone: nothing here recovers two loads ' +
        'or tells anybody who did it, and if the canteen is the route then every control on this ' +
        'list is beside the point.',
      standIn:
        'Suspend brentmoor-ops first, one minute, and know what it does: closes one account and does ' +
        'nothing about the exposure, because 213 others see the same map. Clear the timing with the ' +
        'detective, because suspending it tells whoever holds it that we are looking, and that is ' +
        'their investigation to disrupt now. MFA on the portal is an afternoon plus enrolling 214 ' +
        'people at forty companies, and it is worth paying for. Filtering the map by customer is the ' +
        'actual fix, two days, and it will be resisted because it is the most used thing on the ' +
        'portal, so put it to somebody as a choice with both sides rather than smuggling it in as a ' +
        'security requirement. Routes are operations and the cost is fuel and hours, so raise it and ' +
        'let them decide. Left undone: none of this recovers two loads or says who did it, and if it ' +
        'was the canteen then every control on this list is beside the point.',
      commandNudge:
        'Order these by what each one actually closes, and check with the detective before anything visible.',
    },
    {
      eventId: 'ev.10',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['ir-lead', 'fusion-analyst'],
      correctActions: ['act.propose-rule', 'act.scope-estate', 'act.predict'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'Eleven load thefts in three years and not one of them was ever looked at this way. That is ' +
        'the finding that outlives the enquiry, and it is a process gap rather than a technical one: ' +
        'physical incidents go to the transport manager and the insurer, this team is not on the ' +
        'list, and the question of whether a system was involved was asked seven weeks late by ' +
        'somebody who does not work here. The cheap fix is a routing rule and not a detection: a ' +
        'load theft generates a note to this team the same day, which costs nothing and would have ' +
        'put the August queries in front of somebody while the telematics logs still existed. There ' +
        'is a detection worth building too, and it is unglamorous: an account querying vehicles it ' +
        'has no goods on. That is computable from data the portal already holds and would have fired ' +
        'on 9 August. The prediction is uncomfortable and belongs in the report: there were eleven ' +
        'thefts, the logs for all but the last two are gone, and nobody will ever know whether this ' +
        'pattern was there before.',
      standIn:
        'Eleven load thefts in three years and none of them ever looked at this way. That is the ' +
        'thing that outlives the enquiry and it is process, not technology. Physical incidents go to ' +
        'the transport manager and the insurer, we are not on the list, and whether a system was ' +
        'involved got asked seven weeks late by somebody who does not work here. Cheap fix is ' +
        'routing, not detection: a load theft generates a note to us the same day. Costs nothing, ' +
        'and it would have put the August queries in front of somebody while the telematics logs ' +
        'still existed. There is a rule worth writing too and it is unglamorous: an account querying ' +
        'vehicles it has no goods on. Already computable, would have fired on the ninth of August. ' +
        'And the uncomfortable line for the report: eleven thefts, the logs for nine of them are ' +
        'gone, and nobody will ever know whether this pattern was there before.',
      commandOptions: [
        { command: "awk -F, '$3==\"theft\" {print $1, $2}' /evidence/fleet/incident-register.csv", correct: true, teaches: CORRECT_STEP },
        { command: "grep -icE 'security team|soc' /evidence/policy/physical-incident-process.txt", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status siem', ...STATUS_CHECK },
        { command: 'cat /evidence/fleet/incident-register.csv', ...DUMP_ALL },
        { command: 'grep -c theft /evidence/fleet/incident-register.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out how many load thefts there have been, and who was told about each one.',
      guidance:
        'This reached you seven weeks late. Ask how it was supposed to reach you.',
    },
  ],
};
