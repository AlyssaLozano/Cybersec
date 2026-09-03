/**
 * Scenario 78: Somebody Authorised This.
 *
 * An intrusion in progress, and a claim that it is a penetration test nobody on
 * this floor was told about.
 *
 * WHAT THIS TEACHES
 *
 * How to verify authorisation while an incident is running, and why both
 * obvious answers are wrong.
 *
 * Stopping is expensive: if this is authorised, the floor has burned the test,
 * embarrassed the people who commissioned it, and will be told next time
 * either. Not stopping is worse: an attacker who says "we are the red team"
 * costs nothing to say it, and a floor that accepts the claim has been talked
 * out of its own incident by a sentence.
 *
 * THE THING THAT SETTLES IT IS NOT TECHNICAL
 *
 * No amount of log analysis establishes whether work is authorised. What does
 * is a scope document with dates, addresses and a named authoriser, held by
 * somebody who is not the person asking to be trusted. The floor's job is to
 * find that document or establish that it does not exist, and to keep
 * responding until it does.
 *
 * AND THE PART THAT IS REAL EITHER WAY
 *
 * One action on this board is outside any scope anybody would sign. Whether the
 * rest is a test or not, that one is an incident, and a floor that stands the
 * whole thing down on production of a scope document will have stood down on
 * top of it.
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

const ID = 'somebody-authorised-this';

export const SOMEBODY_AUTHORISED_THIS: Scenario = {
  id: ID,
  title: 'Somebody Authorised This',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 20:05 at Fenmarch Credit Union. Somebody is moving through the member services segment, ' +
    'and forty minutes ago a caller told the service desk it is an authorised test.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'forensics',
    'cloud-security',
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
      summary: 'Credential attempts and lateral movement across member services',
      detail:
        'From 19:10, 340 authentication attempts against 60 accounts on the member services ' +
        'segment, 11 of them successful, followed by remote sessions to four servers. At 19:25 a ' +
        'caller told the service desk that this is an authorised security test and asked them not ' +
        'to raise an incident. The caller gave a first name and no reference. Rule history: this ' +
        'rule fired 6 times in ninety days, 4 of them scheduled penetration tests.',
      source: 'member services segment',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.2',
      atSeconds: 150,
      surface: 'alert-queue',
      summary: 'Nobody in the security team knows about a test this week',
      detail:
        'The security manager is on leave and uncontactable. The head of technology says he ' +
        'remembers approving "something with the auditors" but not when, and is in a board dinner. ' +
        'The change calendar shows no security testing this month. The procurement system holds ' +
        'three open purchase orders to testing firms, one of which is for an engagement described ' +
        'as "annual infrastructure assessment" with no dates recorded.',
      source: 'internal enquiry',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'network-flow',
      summary: 'The source is a hosting range, which is what both look like',
      detail:
        'All activity originates from 198.51.100.86, a commercial hosting provider. Testing firms ' +
        'routinely work from exactly such ranges, and so does everybody else. The address has no ' +
        'history in ninety days of Fenmarch traffic. There is no reverse record, no published ' +
        'attribution, and nothing in the connection that identifies who is at the other end.',
      source: '198.51.100.86',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 490,
      surface: 'raw-log',
      summary: 'The tradecraft is consistent with a test and with anybody who has read one',
      detail:
        'Attempts are paced at roughly one every eight seconds, which is slow enough to avoid ' +
        'lockout thresholds. The tooling is off-the-shelf and widely published. Successful sessions ' +
        'ran enumeration commands and did not delete or modify anything. Every one of those ' +
        'properties appears in published penetration testing methodology, which is public, and ' +
        'therefore appears in the behaviour of people who are not penetration testers.',
      source: 'member services segment',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 660,
      surface: 'cloud-audit',
      summary: 'One action is outside anything anybody would sign',
      detail:
        'At 19:52 the session on FCU-MS-04 exported 8,200 member records including names, addresses ' +
        'and account numbers, and transferred them to the same external address. Standard ' +
        'engagement terms, including those in all three of the open purchase orders, permit ' +
        'demonstrating access to data and prohibit removing it from the estate. No scope in the ' +
        'procurement system authorises exfiltration of member records.',
      source: 'FCU-MS-04',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 830,
      surface: 'alert-queue',
      summary: 'What would actually settle it, and who holds it',
      detail:
        'An engagement has a scope document naming the dates, the source addresses, the systems in ' +
        'scope, the named authoriser and an emergency contact on both sides. Fenmarch holds these ' +
        'in the procurement record. The one open engagement without dates has no scope attached: ' +
        'the file field is empty and the supplier contact listed is a sales address. The caller at ' +
        '19:25 did not give a reference, a firm name, or a callback number.',
      source: 'procurement',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 1000,
      surface: 'alert-queue',
      summary: 'The cost of being wrong in each direction',
      detail:
        'Containing means locking 60 member services accounts and blocking the address, which stops ' +
        'evening member support for around 200 calls and, if this is a commissioned test, ends it ' +
        'and generates a difficult conversation. Not containing means an active intrusion holding ' +
        'eleven credentials on the segment that serves member accounts, with 8,200 records already ' +
        'gone. The overnight payment run starts at 23:00.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1170,
      surface: 'raw-log',
      summary: 'The four previous tests all looked different from this',
      detail:
        'The four penetration tests in ninety days each carried the same markers: a change record ' +
        'raised in advance, a source address supplied to the network team and allowlisted before ' +
        'the start, an agreed daily window, and a named tester who called the SOC lead directly at ' +
        'the start of each day. None of the four asked the service desk not to raise an incident. ' +
        'All four are in the change calendar.',
      source: 'change system',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.9',
      atSeconds: 1340,
      surface: 'network-flow',
      summary: 'A second unfamiliar address is scanning the perimeter',
      detail:
        'A separate address, 203.0.113.140, has been sending connection attempts to the Fenmarch ' +
        'public range since 18:00, across 200 ports on 12 published hosts, at a rate of 40 a ' +
        'second. Every attempt was denied at the perimeter. The same address appears in three ' +
        'public scanning feeds as belonging to an internet-wide research scanner, has scanned the ' +
        'range monthly for two years, and has never reached anything.',
      source: '203.0.113.140',
      claimedSeverity: 'medium',
    },
  ],
};

export const SOMEBODY_AUTHORISED_THIS_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'From 19:10 somebody worked through 340 authentication attempts against 60 member services accounts at roughly one every eight seconds, slow enough to stay under lockout thresholds, and obtained eleven credentials.',
    'They opened remote sessions to four servers, ran enumeration, and modified nothing, which is what a penetration test looks like and also what anybody who has read published testing methodology looks like.',
    'At 19:25 a caller told the service desk this was an authorised test and asked them not to raise an incident. They gave a first name, no firm, no reference and no callback number.',
    'At 19:52 the session on FCU-MS-04 exported 8,200 member records with names, addresses and account numbers, and transferred them to the same external address.',
    'Standard engagement terms, including those in all three open purchase orders, permit demonstrating access to data and prohibit removing it from the estate. No scope in the procurement system authorises that export.',
    'The four penetration tests in the last ninety days each had a change record raised in advance, a source address allowlisted before the start, an agreed daily window, and a named tester who called the SOC lead directly. None asked the service desk to suppress an incident.',
    'The one open engagement with no dates has an empty scope field and a sales address as its supplier contact.',
    'Whether the earlier activity was commissioned is not established. The 19:52 export is outside any scope anybody would sign, and is an incident either way.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1110.003'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'log-analyst'],
      why:
        'Somebody rang the service desk and asked them not to raise an incident, and that request ' +
        'is the most informative thing on the row. Take it seriously as a claim, because four of ' +
        'the last six firings of this rule were scheduled tests and dismissing a real engagement ' +
        'has real costs. Then notice what it costs an attacker to make: nothing. A first name, no ' +
        'firm, no reference and no callback number is not authorisation, it is a sentence, and the ' +
        'one thing a genuine tester has that an intruder does not is paperwork. Declare and keep ' +
        'responding while the claim is checked, because the order matters: standing down and then ' +
        'verifying means the verification happens while somebody has eleven credentials, and ' +
        'verifying then standing down costs a test twenty minutes.',
      standIn:
        'Three hundred and forty attempts, eleven successful, sessions to four servers, and at 19:25 ' +
        'somebody rang the desk and asked us not to raise an incident. Four of the last six of ' +
        'these were real tests so I am taking the claim seriously. I am also noticing it cost them ' +
        'nothing to make: a first name, no firm, no reference, no callback. Declaring and we keep ' +
        'responding while somebody checks it, because standing down first means we verify while ' +
        'they hold eleven credentials.',
      commandOptions: [
        { command: "awk -F, '$4==\"AUTH_FAIL\" || $4==\"AUTH_OK\" {print $4}' /var/log/memberservices/auth.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "19:25" /var/log/servicedesk/calls.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status memberservices', ...STATUS_CHECK },
        { command: 'cat /var/log/memberservices/auth.csv', ...DUMP_ALL },
        { command: 'curl -s http://198.51.100.86/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out exactly what the caller gave the service desk, and what they did not.',
      guidance:
        'Somebody says it is authorised. Ask what they offered as proof.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'defense-evasion',
      firstResponder: 'ir-lead',
      alsoAppropriate: ['soc-operator', 'fusion-analyst'],
      correctActions: ['act.investigate-hold', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.isolate', 'act.tune'],
      escalateTo: ['fusion-analyst'],
      why:
        'Nobody who could confirm it is reachable, and the two people who might know have given ' +
        'answers that make things worse rather than better. The security manager is on leave. The ' +
        'head of technology half-remembers approving something with the auditors and cannot say ' +
        'when, which is a recollection rather than a record and is exactly what somebody would say ' +
        'about either possibility. The change calendar shows nothing this month, and there are ' +
        'three open purchase orders to testing firms of which one has no dates. Resist reading any ' +
        'of that as evidence in either direction: absence of a change record makes authorisation ' +
        'less likely and does not disprove it, and a vague memory of approving something is not ' +
        'approval of this. What it does establish is that the answer is not going to arrive by ' +
        'asking people, so the floor should stop waiting for a phone call and go and look for the ' +
        'document.',
      standIn:
        'The security manager is on leave and uncontactable. The head of technology remembers ' +
        'approving something with the auditors and cannot say when, which is a memory, not a ' +
        'record, and is what somebody would say either way. Nothing in the change calendar this ' +
        'month, three open purchase orders to testing firms, one with no dates. None of that ' +
        'proves anything in either direction. What it does tell us is the answer is not coming ' +
        'from a phone call, so stop waiting for one and go and find the document.',
      commandOptions: [
        { command: "awk -F, '$3 ~ /test|assess/ {print $1, $2, $5}' /var/log/procurement/orders.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -icE "penetration|security test" /var/log/change/calendar.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status changesys', ...STATUS_CHECK },
        { command: 'cat /var/log/change/calendar.csv', ...DUMP_ALL },
        { command: 'grep -c . /var/log/procurement/orders.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check the change calendar and the procurement record rather than waiting for a callback.',
      guidance:
        'Nobody can confirm it. Ask where an authorisation would be written down.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'initial-access',
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.investigate-hold'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'A commercial hosting range with no history, no reverse record and no published ' +
        'attribution, which is what a testing firm working from a rented box looks like and what ' +
        'everybody else looks like as well. The useful output of this row is a negative and it ' +
        'should be stated as one rather than left implied: the source tells us nothing, it is not ' +
        'going to tell us anything, and no further work on it will change that. That matters ' +
        'because the pull for the next twenty minutes will be to keep pulling on the address, ' +
        'looking up ranges and checking feeds, and every minute of it is a minute not spent on the ' +
        'procurement record, which is where the answer actually is. One thing is worth carrying ' +
        'forward though: a genuine engagement supplies its source addresses in advance and this ' +
        'address was supplied to nobody, which is a property of the process rather than of the ' +
        'address.',
      standIn:
        'Commercial hosting, no history, no reverse record, no attribution. That is what a testing ' +
        'firm on a rented box looks like and what everyone else looks like. The address is not ' +
        'going to tell us anything and I want that said, because the next twenty minutes will ' +
        'otherwise go on looking up ranges instead of on the procurement record where the answer ' +
        'is. One thing does carry: a real engagement gives you its source addresses in advance, and ' +
        'this one was given to nobody.',
      commandOptions: [
        { command: "awk '$5==\"198.51.100.86\" {print $1, $3, $7}' /var/log/flows-90d.log | head", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c "198.51.100.86" /var/log/network/allowlist.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 198.51.100.86', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/flows-90d.log', ...DUMP_ALL },
        { command: 'netstat -an | grep 3389', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check whether that address was ever supplied to the network team in advance.',
      guidance:
        'The source is a hosting provider. Ask whether that distinguishes anything.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1110.003'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.isolate', 'act.tune'],
      escalateTo: ['fusion-analyst', 'ir-lead'],
      why:
        'Everything about the tradecraft is consistent with a professional engagement and none of ' +
        'it is evidence of one. Paced at one attempt every eight seconds to stay under lockout ' +
        'thresholds, off-the-shelf published tooling, enumeration without modification: that is a ' +
        'careful tester and it is also somebody who has read the same public methodology, which is ' +
        'published precisely so that people can learn it. This is the row where a floor talks ' +
        'itself into the comfortable answer, and the reasoning error is specific and worth naming. ' +
        'Behaviour that is characteristic of authorised testing is not diagnostic of it, because ' +
        'the characteristics are public. Restraint is not a credential. What restraint does tell ' +
        'us is that nothing has been destroyed yet, which is useful for deciding how fast to move ' +
        'and says nothing about who is at the other end.',
      standIn:
        'The tradecraft looks like a professional engagement and that is not evidence of one. One ' +
        'attempt every eight seconds to stay under lockout, off-the-shelf published tooling, ' +
        'enumeration and nothing modified. That is a careful tester and it is equally somebody who ' +
        'read the same public methodology, which is published so people can learn it. Restraint is ' +
        'not a credential. It does tell us nothing has been destroyed, which helps us decide how ' +
        'fast to move and tells us nothing about who they are.',
      commandOptions: [
        { command: "awk -F, '$4==\"AUTH_FAIL\" {print $1}' /var/log/memberservices/auth.csv | uniq -c | head -20", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$4==\"SESSION\" {print $6}' /var/log/memberservices/auth.csv | sort | uniq -c", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status memberservices', ...STATUS_CHECK },
        { command: 'cat /var/log/memberservices/auth.csv', ...DUMP_ALL },
        { command: 'grep -c AUTH_FAIL /var/log/memberservices/auth.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Measure the pacing between attempts and check what the sessions actually did.',
      guidance:
        'It behaves like a tester. Ask whether an attacker could behave the same way.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1041'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'fusion-analyst'],
      correctActions: ['act.iam-audit', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.tune'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'This is the row that ends the argument, and it ends it without resolving the question ' +
        'everybody has been asking. Eight thousand two hundred member records with names, ' +
        'addresses and account numbers, exported and transferred out of the estate. Standard ' +
        'engagement terms permit demonstrating access to data and prohibit removing it, which is ' +
        'not an obscure clause: it is in all three of the open purchase orders, because a firm ' +
        'that removes customer data has taken on a liability no client would accept and no ' +
        'insurer would cover. So whether the earlier activity was commissioned or not, this ' +
        'action is outside any scope anybody would sign. Say it in exactly that shape, because it ' +
        'is what lets the floor act while the authorisation question is still open: the ' +
        'containment decision no longer depends on the answer, and a floor that stands down on ' +
        'production of a scope document later will have stood down on top of a genuine ' +
        'exfiltration.',
      standIn:
        'This ends the argument without answering the question. Eight thousand two hundred member ' +
        'records, names, addresses, account numbers, exported and sent out of the estate. Every one ' +
        'of those three purchase orders permits demonstrating access and prohibits removing data, ' +
        'because a firm that takes customer data has a liability no client accepts and no insurer ' +
        'covers. So commissioned or not, this is outside anything anybody would sign. Which means ' +
        'we can act now without settling whether the rest was authorised.',
      commandOptions: [
        { command: "awk -F, '$3==\"EXPORT\" {print $1, $2, $5}' /var/log/memberservices/data-ops.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -icE "shall not remove|exfiltrat|data removal" /evidence/procurement/standard-terms.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status memberservices', ...STATUS_CHECK },
        { command: 'cat /var/log/memberservices/data-ops.csv', ...DUMP_ALL },
        { command: 'curl -s http://198.51.100.86/upload', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find what left the estate, then read what the standard engagement terms permit.',
      guidance:
        'Ask whether any test you have ever heard of is allowed to do this.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.corroborate', 'act.investigate-hold'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.contact-attacker', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'What settles authorisation is a document, and this is the row that says which one and who ' +
        'holds it. An engagement has a scope naming dates, source addresses, systems in scope, a ' +
        'named authoriser and emergency contacts on both sides, and Fenmarch keeps these in the ' +
        'procurement record. The one open engagement without dates has an empty scope field and a ' +
        'sales address as its supplier contact, which is not a scope and cannot be treated as one. ' +
        'The point worth making explicitly is about direction: the floor is not trying to prove ' +
        'this is an attack, it is trying to find an authorisation, and the burden sits with the ' +
        'person claiming to be authorised rather than with the people responding. A caller who ' +
        'gave a first name and no reference has not discharged it. Until somebody produces that ' +
        'document, the correct posture is to keep treating this as an intrusion, and doing so is ' +
        'not an accusation against anybody.',
      standIn:
        'What settles this is a document, not a log. An engagement scope names the dates, the source ' +
        'addresses, the systems in scope, the authoriser and emergency contacts both sides, and we ' +
        'keep those in procurement. The one engagement without dates has an empty scope field and a ' +
        'sales address for a contact. That is not a scope. And the burden is on the person claiming ' +
        'to be authorised, not on us: a first name and no reference does not discharge it. Until ' +
        'somebody produces the document we keep treating this as an intrusion, and that is not an ' +
        'accusation.',
      commandNudge:
        'Find what an engagement scope contains at this organisation, then look for one covering ' +
        'tonight.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'Both directions cost something and one of them is recoverable. Locking sixty member ' +
        'services accounts and blocking the address stops evening member support for around two ' +
        'hundred calls and, if this is commissioned, ends the engagement and produces a difficult ' +
        'conversation in the morning. That conversation is survivable and the engagement can be ' +
        'rebooked. Not containing leaves eleven working credentials on the segment that serves ' +
        'member accounts, with 8,200 records already gone and a payment run starting at 23:00, and ' +
        'nothing about that is recoverable in the morning. The asymmetry decides it, and it decides ' +
        'it without needing the authorisation question answered. The narrow version is available ' +
        'and better than the wide one: block the single source address at the perimeter and ' +
        'disable the eleven compromised credentials rather than locking all sixty accounts, which ' +
        'stops both the access and the export while leaving forty-nine members serviceable. Check ' +
        'the rollback before the block goes in, because if a scope document appears at 21:00 the ' +
        'engagement should be able to resume in minutes. Deliberately left undone: the 8,200 ' +
        'records are gone whichever way this turns out, and nothing tonight recovers them.',
      standIn:
        'Both ways cost something and only one is recoverable. Locking sixty accounts and blocking ' +
        'the address stops evening support for about two hundred calls and, if this is real, kills ' +
        'the engagement and gets me a difficult conversation in the morning. I will take that ' +
        'conversation. Not containing leaves eleven working credentials on the member segment with ' +
        '8,200 records already gone and a payment run at 23:00, and that is not recoverable in the ' +
        'morning. Narrow version: block the one address at the perimeter and disable the eleven ' +
        'compromised credentials rather than all sixty, so forty-nine members can still be served. ' +
        'Rollback ready, because if a scope turns up at nine they should be running again in ' +
        'minutes. Left undone: those records are gone either way.',
      commandNudge:
        'Work out which is recoverable in the morning: containing a real test, or not containing a ' +
        'real intrusion.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.timeline'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.tune'],
      escalateTo: ['ir-lead'],
      why:
        'Four tests in ninety days and every one of them looked different from this in the same ' +
        'four ways: a change record raised in advance, a source address supplied and allowlisted ' +
        'before the start, an agreed daily window, and a named tester who called the SOC lead ' +
        'directly. Tonight has none of those. That is a comparison against this organisation own ' +
        'history rather than against a general expectation, which is what makes it usable: nobody ' +
        'has to argue about how tests are supposed to work, only about how they have actually ' +
        'worked here four times this quarter. The fifth difference is the one to say last and ' +
        'clearly, because it inverts the caller entire claim: none of the four asked the service ' +
        'desk not to raise an incident. A genuine engagement wants the detection to happen, ' +
        'because whether the floor catches it is the thing being measured, and asking to be ' +
        'ignored is the one request no real tester would make.',
      standIn:
        'Four tests in ninety days and all four differ from tonight the same four ways: change ' +
        'record in advance, source address allowlisted before the start, agreed daily window, named ' +
        'tester who phoned the SOC lead. Tonight has none. And that is our own history, not a ' +
        'general expectation, so nobody has to argue about how tests ought to work. The fifth ' +
        'difference is the one that matters: not one of the four asked the desk to suppress an ' +
        'incident. A real engagement wants us to detect it, because that is the thing being ' +
        'measured. Asking to be ignored is the one request a tester never makes.',
      commandOptions: [
        { command: "awk -F, '$3 ~ /pen.?test|security test/ {print $1, $4, $6}' /var/log/change/calendar-90d.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "allowlist" /var/log/network/allowlist-history.csv | tail -10', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status changesys', ...STATUS_CHECK },
        { command: 'cat /var/log/change/calendar-90d.csv', ...DUMP_ALL },
        { command: 'grep -c test /var/log/change/calendar-90d.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at the four previous tests and list what each of them did that tonight did not.',
      guidance:
        'You have had four real tests recently. Ask what they looked like.',
    },
    {
      eventId: 'ev.9',
      verdict: 'blocked-reconnaissance',
      firstResponder: 'network-analyst',
      alsoAppropriate: ['soc-operator', 'fusion-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.contact-attacker', 'act.declare'],
      escalateTo: [],
      why:
        'A second unfamiliar address scanning the perimeter on the night of a live intrusion, and ' +
        'it is a research scanner. Every attempt was denied, it appears in three public scanning ' +
        'feeds, it has scanned this range monthly for two years, and it has never reached ' +
        'anything. Close it. The row exists because a floor that has spent an hour on an ' +
        'authorisation question will reach for any second thread as confirmation of coordination, ' +
        'and two unfamiliar addresses on one evening is exactly the shape that invites it. There ' +
        'is no connection: this one is blocked, external, periodic and public, where the other is ' +
        'inside with eleven credentials. Worth saying explicitly on the bridge with the reasons, ' +
        'because somebody else will find the same scan within the hour and a second address ' +
        'reported as related would widen the incident for no reason on a night when the scope is ' +
        'the thing everybody is arguing about.',
      standIn:
        'Second unfamiliar address, and it is an internet research scanner. Every attempt denied at ' +
        'the perimeter, in three public feeds, scans us monthly for two years, has never reached ' +
        'anything. No connection to the other one: this is blocked, external and periodic, that one ' +
        'is inside with eleven credentials. Saying it on the bridge with reasons, because somebody ' +
        'will find the same scan within the hour and we do not need a second address widening this ' +
        'tonight.',
      commandOptions: [
        { command: "awk '$5==\"203.0.113.140\" {print $9}' /var/log/perimeter/flows.log | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c "203.0.113.140" /var/log/perimeter/flows-2y.log', correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 203.0.113.140', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/perimeter/flows.log', ...DUMP_ALL },
        { command: 'iptables -A INPUT -s 203.0.113.140 -j DROP', ...MUTATE },
      ],
      commandNudge:
        'Check whether anything from that address got through, and whether it has been here before.',
      guidance:
        'Two strange addresses in one evening. Ask whether either of them reached anything.',
    },
  ],
};
