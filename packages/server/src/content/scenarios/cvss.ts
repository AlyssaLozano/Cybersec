/**
 * Scenario 60: Nine Point Eight.
 *
 * A critical vulnerability, live exploitation attempts against the front door,
 * and a compensating control that has been switched off since June. None of
 * that is what gets somebody in tonight.
 *
 * WHAT THIS TEACHES
 *
 * That a severity score is a property of the vulnerability and not of your
 * estate, and that the work is establishing which of the several things an
 * exploit needs are actually true here.
 *
 * Three hundred and forty systems carry the vulnerable library, which is the
 * number the scanner reports and the number that reaches the board. Three
 * hundred and thirty-one of them never load the vulnerable class at all, because
 * the library arrived as a transitive dependency of something else. Nine load
 * it. Seven of those are reachable only over the VPN. Two face the internet.
 * One of the two is being attacked right now, its compensating control has been
 * in log-only mode since a change in June, and the attempts still fail, because
 * the feature the exploit needs was never enabled.
 *
 * Four things had to be true and three were. That is the actual work, and none
 * of it is visible from the score.
 *
 * THE THING THAT IS ACTUALLY BROKEN
 *
 * While the floor works the 9.8, two of the same twelve addresses are quietly
 * succeeding against a 5.3 that has been open for 412 days on the driver
 * application, because nobody chases mediums. The severity that got attention
 * is not the severity that mattered, and the reason is organisational rather
 * than technical.
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

const ID = 'nine-point-eight';

export const NINE_POINT_EIGHT: Scenario = {
  id: ID,
  title: 'Nine Point Eight',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 20:40 at Ardal Freight. A critical vulnerability in a widely used library was published ' +
    'yesterday, and the customs declaration portal has been taking exploit attempts for the last ' +
    'forty minutes.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'vulnerability-analyst',
    'threat-intel',
    'forensics',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Exploit attempts against the customs portal matching yesterday\'s advisory',
      detail:
        'Between 20:02 and 20:38 the customs declaration portal ADF-CUST-01 received 1,412 ' +
        'requests carrying a serialised payload matching the proof of concept published with ' +
        'CVE-2026-4471, a deserialisation flaw in the serial-io library scored 9.8. The requests ' +
        'come from twelve addresses in 203.0.113.0/24. Rule history: this signature was added ' +
        'yesterday and has fired 1,412 times, all in the last forty minutes.',
      source: 'ADF-CUST-01',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'alert-queue',
      summary: 'Every payload is the published proof of concept, unmodified',
      detail:
        'All 1,412 requests carry byte-identical payloads matching the public proof of concept, ' +
        'including its placeholder callback host, which is a domain the researcher registered for ' +
        'the write-up. The twelve source addresses are hitting 40,000 other organisations ' +
        'according to two public scanning feeds, present the same user agent string, and request ' +
        'the same four paths in the same order regardless of what the target runs. None of the ' +
        'requests references anything specific to Ardal.',
      source: 'threat feeds',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'host-artefact',
      summary: 'Three hundred and forty systems carry the vulnerable library',
      detail:
        'The software inventory scan reports serial-io at a vulnerable version on 340 systems ' +
        'across the estate. The finding is being reported upward as 340 critical exposures. ' +
        'serial-io is a general purpose serialisation library and appears in the dependency tree ' +
        'of eleven separate products in use here, most of which never call it directly.',
      source: 'vulnerability management',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'host-artefact',
      summary: 'Nine of the 340 can actually reach the vulnerable code path',
      detail:
        'The flaw lives in one class, ObjectStreamReader, which is only instantiated when an ' +
        'application deserialises input it did not create. On 331 of the 340 systems the library ' +
        'is a transitive dependency and that class is never loaded: runtime class loading data ' +
        'across thirty days shows no instantiation on any of them. Nine systems do load it. Those ' +
        'nine are the only ones where the published exploit has anything to act on.',
      source: 'vulnerability management',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'network-flow',
      summary: 'Seven of the nine are reachable only over the VPN',
      detail:
        'Of the nine systems that load the vulnerable class, seven sit on internal segments ' +
        'reachable only through the administrative VPN and accept no connections from outside the ' +
        'estate. Two are published to the internet: ADF-CUST-01, the customs declaration portal, ' +
        'and ADF-TRACK-02, the public consignment tracking service. ADF-TRACK-02 has received no ' +
        'requests matching the signature.',
      source: 'network inventory',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'raw-log',
      summary: 'The rule that would have blocked this has been in log-only mode since June',
      detail:
        'The web application firewall policy protecting ADF-CUST-01 includes a deserialisation ' +
        'ruleset. Change record CHG-11402, applied on 12 June, set the whole policy to detection ' +
        'mode to investigate false positives on a customs form upload, and it was never set back. ' +
        'All 1,412 requests reached the application. The change record has no review date and no ' +
        'owner recorded against it.',
      source: 'ADF-CUST-01',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 940,
      surface: 'host-artefact',
      summary: 'All 1,412 attempts failed for a reason nobody planned',
      detail:
        'The portal returned HTTP 500 to all 1,412 requests. Application logs show the payload ' +
        'rejected before deserialisation by a content type check, and the deserialisation feature ' +
        'the exploit targets is disabled in the portal configuration, as it is by default. Nobody ' +
        'at Ardal made that decision: the setting has never been changed since installation. ' +
        'Outbound connections to the callback host in the payload: none.',
      source: 'ADF-CUST-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.8',
      atSeconds: 1100,
      surface: 'alert-queue',
      summary: 'Two of the same addresses are succeeding somewhere else',
      detail:
        'Two of the twelve addresses have also been requesting /api/v1/manifest on the driver ' +
        'application backend since 20:11, and receiving HTTP 200. The endpoint requires no ' +
        'authentication and returns consignment manifests including customer names, delivery ' +
        'addresses and contact numbers. It was reported in a penetration test on 16 July 2025, ' +
        'scored 5.3, accepted as a medium, and has been open for 412 days. 9,400 manifests have ' +
        'been returned this evening.',
      source: 'ADF-DRIVER-API',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.9',
      atSeconds: 1260,
      surface: 'alert-queue',
      summary: 'The customs window opens at 04:00 and the patch needs a restart',
      detail:
        'Patching serial-io on ADF-CUST-01 requires a service restart of around six minutes. The ' +
        'overnight customs declaration window runs from 04:00 to 06:00 and every consignment ' +
        'crossing tomorrow is filed in it. A missed window means declarations filed late, which is ' +
        'a regulatory matter. Setting the firewall policy back to blocking mode takes two minutes, ' +
        'needs no restart, and can be reversed in the same two minutes.',
      source: 'operations',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.10',
      atSeconds: 1420,
      surface: 'alert-queue',
      summary: 'Forty more systems have just been reported as vulnerable',
      detail:
        'A second scan pass flags 40 further systems running serial-io 2.4.1, which the advisory ' +
        'lists as vulnerable. All 40 run the operating system vendor\'s packaged build, which ' +
        'carries the fix backported into 2.4.1-14ubuntu3 while keeping the upstream version ' +
        'string. The vendor security tracker records the issue as resolved in that package. The ' +
        'scanner compares version strings and has no view of distribution patches.',
      source: 'vulnerability management',
      claimedSeverity: 'high',
    },
  ],
};

export const NINE_POINT_EIGHT_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'CVE-2026-4471, a deserialisation flaw in the serial-io library scored 9.8, was published yesterday with a working proof of concept.',
    'Twelve addresses running an untargeted mass scan against tens of thousands of organisations sent 1,412 byte-identical copies of that proof of concept at the Ardal customs declaration portal between 20:02 and 20:38.',
    'The scanner reports 340 vulnerable systems. On 331 of them serial-io is a transitive dependency and the vulnerable class is never loaded, so there is nothing for the exploit to act on. Nine load it. Seven of those are reachable only over the administrative VPN.',
    'The web application firewall ruleset that would have blocked the payload was set to detection mode on 12 June to investigate false positives on a form upload, and was never set back, so all 1,412 requests reached the application.',
    'Every one of them failed anyway. The portal rejects the payload on a content type check and the deserialisation feature the exploit needs is disabled, as it is by default and as it has been since installation. Nobody chose that.',
    'While all of this was happening, two of the same twelve addresses were requesting an unauthenticated endpoint on the driver application backend and receiving HTTP 200.',
    'That endpoint returns consignment manifests with customer names, delivery addresses and contact numbers. It was reported in a penetration test on 16 July 2025, scored 5.3, accepted as a medium, and has been open for 412 days. It has returned 9,400 manifests this evening.',
    'The critical was survivable by luck. The medium is the breach.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1190'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.declare', 'act.contact-attacker'],
      escalateTo: ['vulnerability-analyst', 'threat-intel'],
      why:
        'Fourteen hundred exploit attempts in forty minutes against the front door, matching a 9.8 ' +
        'published yesterday, and the correct first move is still to raise it rather than declare ' +
        'it. An attempt is not an outcome. Nothing on this row says whether the portal is running ' +
        'the vulnerable code, whether the exploit needs a configuration Ardal does not have, or ' +
        'whether a single one of the 1,412 achieved anything, and declaring an incident on ' +
        'attempts commits a floor to a story before any of those are known. Get the two questions ' +
        'moving that the row does not answer: is this aimed at us, and can it work here. The ' +
        'volume is not evidence of either.',
      standIn:
        'Fourteen hundred exploit attempts against the customs portal in forty minutes, matching ' +
        'the 9.8 that came out yesterday, twelve source addresses. Raising it and holding it. An ' +
        'attempt is not an outcome and nothing here tells me whether any of them worked. I want ' +
        'two questions running: is this aimed at us, and can it even work on that box.',
      commandOptions: [
        { command: "awk '$7 ~ /ObjectStream/ {print $1, $3}' /var/log/cust01/access.log | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: "awk '{print $3}' /var/log/cust01/waf-hits.log | sort | uniq -c | sort -rn", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status cust-portal', ...STATUS_CHECK },
        { command: 'cat /var/log/cust01/access.log', ...DUMP_ALL },
        { command: 'curl -s http://203.0.113.19/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out what the portal actually returned to those requests.',
      guidance:
        'Lots of attempts is not the same as one success. Ask what the answers were.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'reconnaissance',
      techniques: ['T1595.002'],
      firstResponder: 'threat-intel',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.assess-actor', 'act.ttp-map'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead', 'vulnerability-analyst'],
      why:
        'Nobody chose Ardal, and establishing that in the first ten minutes changes how the whole ' +
        'night is staffed. Every payload is byte-identical to the published proof of concept, ' +
        'including its placeholder callback host, which is a domain the researcher registered for ' +
        'the write-up and which no serious operator would leave in. The twelve addresses are ' +
        'hitting forty thousand organisations, present one user agent, and request the same four ' +
        'paths in the same order whatever the target runs. That is a scan of the internet, not an ' +
        'attack on a freight company. It matters because a targeted actor who fails at the front ' +
        'door tries the side, and a mass scanner does not: the correct posture is to fix the ' +
        'exposure rather than to hunt for a follow-on that is not coming. Say it with a confidence ' +
        'level and do not name a group. There is nothing here to name, and the absence of ' +
        'customisation is exactly what makes attribution meaningless rather than difficult.',
      standIn:
        'Nobody chose us. Every payload is byte-identical to the published proof of concept, ' +
        'placeholder callback host and all, which is a domain the researcher registered for the ' +
        'write-up and nobody serious leaves in. Twelve addresses hitting forty thousand ' +
        'organisations, one user agent, same four paths in the same order regardless of what the ' +
        'target runs. That is an internet scan, not an attack on a freight company. High ' +
        'confidence, commodity opportunistic, and there is no group to name.',
      commandOptions: [
        { command: "awk '{print $12}' /var/log/cust01/waf-hits.log | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'sha256sum /evidence/payloads/*.bin | awk \'{print $1}\' | sort -u', correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -sT 203.0.113.19', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/cust01/waf-hits.log', ...DUMP_ALL },
        { command: 'grep -c 203.0.113 /var/log/cust01/waf-hits.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Compare the payloads to each other and to the published proof of concept.',
      guidance:
        'Ask whether these payloads were written for you or copied from a blog post.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['ir-lead', 'soc-operator'],
      correctActions: ['act.scope-estate', 'act.investigate-hold'],
      outOfLaneActions: ['act.triage-high', 'act.reimage-now', 'act.isolate', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'Three hundred and forty is a true statement about the estate and a false statement about ' +
        'the risk, and it is already travelling upward as 340 critical exposures. The scanner ' +
        'compared version strings and found the library, which is exactly what it is for and is ' +
        'the beginning of the work rather than the end of it. serial-io sits in the dependency ' +
        'tree of eleven separate products here and most of them never call it directly, which is ' +
        'how a general purpose library ends up on a third of an estate that has never made a ' +
        'decision about it. Slow the number down before it becomes a commitment: a floor that ' +
        'accepts 340 will spend two weeks patching machines that were never exposed, and the ' +
        'time comes out of the thing that actually is.',
      standIn:
        'Three hundred and forty is true about the estate and false about the risk, and it is ' +
        'already going upstairs as 340 critical exposures. The scanner compared version strings, ' +
        'which is its job, and that is the start of the work and not the end. This library is in ' +
        'the dependency tree of eleven products and most of them never call it. Give me twenty ' +
        'minutes before anybody commits to that number, because patching 340 machines takes a ' +
        'two weeks out of whatever is actually broken.',
      commandOptions: [
        { command: "awk -F, '$3==\"serial-io\" {print $1, $4}' /var/log/vulnmgmt/inventory.csv | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$3==\"serial-io\" {print $5}' /var/log/vulnmgmt/inventory.csv | sort | uniq -c", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status vulnscan', ...STATUS_CHECK },
        { command: 'cat /var/log/vulnmgmt/inventory.csv', ...DUMP_ALL },
        { command: 'grep -c serial-io /var/log/vulnmgmt/inventory.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out how the library got onto those systems before you count them as exposures.',
      guidance:
        'Having a library is not the same as using it. Ask which products pulled it in.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['ir-lead', 'forensics'],
      correctActions: ['act.scope-estate', 'act.corroborate'],
      outOfLaneActions: ['act.reimage-now', 'act.isolate', 'act.dismiss', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Three hundred and forty becomes nine, and this is the row that is worth the seat. The flaw ' +
        'lives in one class, and that class is only instantiated when an application deserialises ' +
        'input it did not create. On 331 systems it is never loaded, and that is not an inference ' +
        'from what the software ought to do: thirty days of runtime class loading data shows no ' +
        'instantiation on any of them. Nine load it, and only those nine give the exploit anything ' +
        'to act on. The habit underneath this generalises past today. A vulnerability needs a ' +
        'vulnerable component, a path that reaches it, and an attacker who can get to that path, ' +
        'and a scanner sees only the first. Report both numbers and never only the second, because ' +
        'nine is the number that gets fixed this week and 340 is the number somebody upstairs has ' +
        'already heard.',
      standIn:
        'Three hundred and forty becomes nine. The flaw is in one class and it only loads when an ' +
        'application deserialises input it did not create. Thirty days of runtime class loading ' +
        'says it is never instantiated on 331 of them, so that is measured and not assumed. Nine ' +
        'load it, and those nine are the only places the exploit has anything to act on. I am ' +
        'reporting both numbers, because nine is what we fix this week and 340 is what upstairs ' +
        'has already heard.',
      commandOptions: [
        { command: "awk -F, '$3==\"ObjectStreamReader\" {print $1}' /var/log/vulnmgmt/classload-30d.csv | sort -u", correct: true, teaches: CORRECT_STEP },
        { command: 'comm -12 /evidence/has-library.txt /evidence/loads-class.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status vulnscan', ...STATUS_CHECK },
        { command: 'cat /var/log/vulnmgmt/classload-30d.csv', ...DUMP_ALL },
        { command: 'grep -c ObjectStreamReader /var/log/vulnmgmt/classload-30d.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out which systems actually load the vulnerable class, not just which have the file.',
      guidance:
        'The flaw is in one class. Ask which of those systems ever loads it.',
    },
    {
      eventId: 'ev.5',
      verdict: 'benign-true-positive',
      firstResponder: 'network-analyst',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.scope-estate'],
      outOfLaneActions: ['act.isolate', 'act.contact-attacker', 'act.dismiss', 'act.reimage-now'],
      escalateTo: ['mitigation-specialist', 'ir-lead'],
      why:
        'Nine becomes two, and the two are not equal. Seven of the nine accept no connection from ' +
        'outside the estate at all, so an internet-wide scan cannot reach them and the only actor ' +
        'who could is one already inside, which is a different incident and not tonight\'s. Two ' +
        'are published: the customs portal, which is being hit, and the consignment tracking ' +
        'service, which is not. That second one is worth a sentence rather than a shrug, because ' +
        'it is equally exposed and equally vulnerable and has simply not been found yet by a scan ' +
        'that is working through the internet alphabetically or by address range. It does not get ' +
        'to be forgotten because nothing has arrived at it.',
      standIn:
        'Nine becomes two, and they are not equal. Seven take no connections from outside at all, ' +
        'so an internet scan cannot reach them and only somebody already inside could, which is a ' +
        'different incident. Two are published: the customs portal, which is being hit, and the ' +
        'consignment tracker, which is not. The tracker is just as exposed and just as vulnerable ' +
        'and has only not been found yet. It stays on the list.',
      commandOptions: [
        { command: "awk -F, '$1 ~ /ADF-/ && $4==\"PUBLISHED\" {print $1, $3}' /var/log/netinv/exposure.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'comm -12 /evidence/loads-class.txt /evidence/internet-facing.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -an | grep LISTEN', ...WRONG_TARGET },
        { command: 'cat /var/log/netinv/exposure.csv', ...DUMP_ALL },
        { command: 'grep -c PUBLISHED /var/log/netinv/exposure.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Of the nine, find out which ones can be reached from outside the estate at all.',
      guidance:
        'An exploit has to arrive somehow. Ask which of these are reachable from the internet.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1562.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['mitigation-specialist', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['mitigation-specialist', 'ir-lead'],
      why:
        'The control everybody names as the reason this is fine has been off since 12 June. A ' +
        'change set the whole firewall policy to detection mode to investigate false positives on ' +
        'a customs form upload, which is an entirely reasonable thing to do for an afternoon, and ' +
        'the change has no review date and no owner, which is why it is still in place eighty days ' +
        'later. All 1,412 requests reached the application. Nobody did anything wrong on 12 June ' +
        'and the estate has been running without a web application firewall ever since, and both ' +
        'of those are true at once. This is worth more than tonight: a temporary change with ' +
        'nobody\'s name on it is a permanent change, and the only reason anybody found this one is ' +
        'that somebody happened to attack the box it protects.',
      standIn:
        'The firewall has been in detection mode since 12 June. Change CHG-11402 set the whole ' +
        'policy to log-only to chase false positives on a form upload, which is a sensible thing ' +
        'to do for an afternoon, and it has no review date and no owner on it, so it is still like ' +
        'that eighty days later. All 1,412 requests reached the application. Nobody did anything ' +
        'wrong in June and we have had no WAF since June. The only reason we found it is that ' +
        'somebody attacked the box it protects.',
      commandOptions: [
        { command: 'grep -iE "CHG-11402|detection|log.only" /var/log/waf/policy-changes.log', correct: true, teaches: CORRECT_STEP },
        { command: "awk '{print $5}' /var/log/cust01/waf-hits.log | sort | uniq -c", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status waf', ...STATUS_CHECK },
        { command: 'cat /var/log/waf/policy-changes.log', ...DUMP_ALL },
        { command: 'waf-cli policy set --mode block --all', ...MUTATE },
      ],
      commandNudge:
        'Check whether the firewall in front of that portal is blocking or only watching.',
      guidance:
        'Something should have stopped these. Find out whether it was switched on.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.scope-estate'],
      outOfLaneActions: ['act.reimage-now', 'act.isolate', 'act.dismiss', 'act.declare'],
      escalateTo: ['ir-lead'],
      why:
        'Nothing got in, and the reason is uncomfortable enough that it belongs in the readout ' +
        'exactly as it stands. All 1,412 requests returned 500, the payload was rejected on a ' +
        'content type check before deserialisation, the feature the exploit targets is disabled, ' +
        'and there are no outbound connections to the callback host. But nobody at Ardal decided ' +
        'that. The setting is off because it ships off and has never been touched since ' +
        'installation, so tonight was survived by a default rather than by a control. The ' +
        'temptation now is to report that the portal was not vulnerable, which is true and will be ' +
        'heard as we were fine. What is actually true is that four things had to be true for this ' +
        'to work, three of them were, and the fourth was luck. Say it in that order, because the ' +
        'difference between those two sentences is whether anybody patches the nine systems next ' +
        'week.',
      standIn:
        'None of them got in. All 1,412 got a 500, the payload is rejected on a content type check ' +
        'before deserialisation, the feature the exploit needs is disabled, and there are no ' +
        'outbound connections to the callback host. But nobody here decided that. It ships ' +
        'disabled and has never been touched since install. Four things had to be true, three of ' +
        'them were, and the fourth was luck. I want it minuted in that order, because otherwise ' +
        'this gets remembered as we were fine and nobody patches the nine.',
      commandOptions: [
        { command: "awk '$9==\"500\" {c++} END {print c}' /var/log/cust01/access.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "deserializ" /etc/cust-portal/app.conf', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status cust-portal', ...STATUS_CHECK },
        { command: 'cat /var/log/cust01/access.log', ...DUMP_ALL },
        { command: 'grep -c 500 /var/log/cust01/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check the response codes, then check whether the feature the exploit needs is even ' +
        'enabled.',
      guidance:
        'Find out what the portal sent back, and why.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1190', 'T1213'],
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['soc-operator', 'threat-intel', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.scope-estate'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.attribute-named', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'This is the breach, and it has been available to anybody who typed the URL for 412 days. ' +
        'An unauthenticated endpoint on the driver backend returning consignment manifests with ' +
        'customer names, delivery addresses and contact numbers, 9,400 of them this evening, to ' +
        'two of the same twelve addresses that failed against the portal. It was found in a ' +
        'penetration test on 16 July 2025, scored 5.3, and accepted as a medium. Everything about ' +
        'that acceptance was procedurally correct and the outcome is that the only successful ' +
        'attack tonight came through the finding nobody was chasing. The score was low because the ' +
        'scoring model weighs a data read below code execution in the abstract, and in this ' +
        'business a list of who is receiving what, where, and on which phone number is the ' +
        'product. Bring the 9.8 and the 5.3 into the readout together, because separately each one ' +
        'is a normal week and together they are the whole lesson.',
      standIn:
        'Here is the actual breach. Unauthenticated endpoint on the driver backend handing out ' +
        'consignment manifests with customer names, delivery addresses and phone numbers. Nine ' +
        'thousand four hundred tonight, to two of the same twelve addresses that just failed ' +
        'against the portal. Found in a pen test on 16 July 2025, scored 5.3, accepted as a ' +
        'medium, open 412 days. Nothing about that was against process. The score was low because ' +
        'the model puts a data read under code execution, and in freight a list of who is getting ' +
        'what, where, and on what number is the product.',
      commandOptions: [
        { command: "awk '$7 ~ /manifest/ && $9==200 {print $1, $3}' /var/log/driver-api/access.log | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: "awk '{print $3}' /var/log/driver-api/access.log | sort | uniq -c | sort -rn | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status driver-api', ...STATUS_CHECK },
        { command: 'cat /var/log/driver-api/access.log', ...DUMP_ALL },
        { command: 'curl -s http://203.0.113.19/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Take those twelve addresses and look for them everywhere, not just on the portal.',
      guidance:
        'You know who was attacking the portal. Ask what else they touched.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'initial-access',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'vulnerability-analyst'],
      correctActions: ['act.contain-scoped', 'act.check-rollback', 'act.sequence-remedy', 'act.compensating-control'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.attribute-named', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'The urgent thing and the important thing are different things tonight, and the sequencing ' +
        'is the whole answer. Patching the portal needs a six minute restart and the customs ' +
        'window opens at 04:00 with every consignment crossing tomorrow filed in it, and a late ' +
        'declaration at a freight company is a regulatory event. It also fixes something that ' +
        'demonstrably did not work, so it is the least urgent item on the list despite being the ' +
        'only one with a 9.8 attached. Setting the firewall policy back to blocking takes two ' +
        'minutes, needs no restart, reverses in the same two minutes, and closes the exposure on ' +
        'both published systems at once, so it goes first and it goes now. The driver endpoint is ' +
        'live data leaving the building right now and it is the one that cannot wait until the ' +
        'morning: block the two addresses immediately as a stop-gap, and require authentication on ' +
        'the endpoint tonight, understanding that it is a code change on a system drivers depend ' +
        'on at 05:00. Check what breaks if that endpoint starts refusing requests, because if the ' +
        'driver application calls it without a token then requiring one strands the fleet. Patch ' +
        'the portal after the customs window closes at 06:00, and say plainly what is left undone ' +
        'in the meantime: the tracking service has the same flaw and has simply not been found ' +
        'yet.',
      standIn:
        'Urgent and important are different things tonight. Firewall back to blocking mode first, ' +
        'because it is two minutes, no restart, reverses in two minutes, and it covers both ' +
        'published systems. The driver endpoint is the one bleeding right now, so block those two ' +
        'addresses immediately and get authentication on it tonight, but somebody check what ' +
        'breaks first, because if the driver app calls it without a token we strand the fleet at ' +
        'five in the morning. The portal patch waits until after the customs window closes at ' +
        '06:00, because it needs a six minute restart and it fixes something that already did not ' +
        'work. Left undone overnight: the tracking service has the same flaw and has only not been ' +
        'found yet.',
      commandNudge:
        'Work out how long each fix takes and what it interrupts before you decide the order.',
    },
    {
      eventId: 'ev.10',
      verdict: 'false-positive',
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['soc-operator'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.reimage-now', 'act.isolate', 'act.declare'],
      escalateTo: [],
      why:
        'Forty more, and none of them. All forty run the operating system vendor\'s packaged build, ' +
        'which carries the fix backported into 2.4.1-14ubuntu3 while keeping the upstream version ' +
        'string, and the vendor security tracker records the issue as resolved there. The scanner ' +
        'compares version strings and cannot see distribution patches, which is a limitation of ' +
        'the tool rather than a mistake by it. Close them, and notice that this cuts both ways ' +
        'against the same tool: it over-reported here and it over-reported the original 340, and ' +
        'in both cases the fix was to go and find out what is actually running. On a night with a ' +
        'live data leak, forty unnecessary emergency patches is not a small waste of time. It is ' +
        'the time that was going to be spent on the endpoint that is currently handing out ' +
        'customer addresses.',
      standIn:
        'Forty more and none of them are real. They all run the distribution package, which has the ' +
        'fix backported into 2.4.1-14ubuntu3 and keeps the upstream version string, and the vendor ' +
        'tracker says resolved. The scanner compares version strings and cannot see distribution ' +
        'patches. Closing all forty. Same tool over-reported the original 340 as well, and forty ' +
        'unnecessary emergency patches tonight comes straight out of the time we need for the ' +
        'endpoint that is handing out customer addresses.',
      commandOptions: [
        { command: 'dpkg -l | grep serial-io', correct: true, teaches: CORRECT_STEP },
        { command: 'apt-cache policy libserial-io | head', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status vulnscan', ...STATUS_CHECK },
        { command: 'cat /var/log/vulnmgmt/inventory.csv', ...DUMP_ALL },
        { command: 'grep -c 2.4.1 /var/log/vulnmgmt/inventory.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check the distribution package version, not the upstream version string.',
      guidance:
        'The scanner reads a version number. Ask whether your vendor patched it without changing ' +
        'that number.',
    },
  ],
};
