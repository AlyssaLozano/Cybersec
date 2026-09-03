/**
 * Scenario 95: It Says Malware.
 *
 * Forty hosts connected to a known malware address overnight, and every one of
 * those connections was stopped by the thing that raised the alert.
 *
 * WHAT THIS TEACHES
 *
 * That an operator has to know what their own tooling does to the data before
 * they can read it. The address in the alert belongs to the DNS security
 * vendor's sinkhole: when a host asks for a blocked domain, the vendor answers
 * with their own address instead of the real one, so the host connects to the
 * vendor and reaches nobody. A sinkhole hit is a record of prevention, and the
 * alert describes it in words that read like a breach.
 *
 * Reading it correctly does not make the board empty, which is the second half
 * of the lesson. Forty hosts tried, so forty machines have something on them
 * that wanted to. And one of them tried before the block existed, and that one
 * got through.
 *
 * WHY BEGINNER
 *
 * Every fact needed is on the board and none of it requires a specialism. The
 * skill is not being carried by the word malware into a response the evidence
 * does not support, and then noticing that the correct reading still leaves
 * two real findings behind.
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

const ID = 'it-says-malware';

export const IT_SAYS_MALWARE: Scenario = {
  id: ID,
  title: 'It Says Malware',
  difficulty: 'beginner',
  durationMinutes: 50,
  situation:
    'It is 08:20 at Ardal Freight. Forty machines connected to a known malware address overnight, ' +
    'twelve hundred times.',
  roles: [
    'soc-operator',
    'network-analyst',
    'log-analyst',
    'forensics',
    'threat-intel',
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
      summary: 'Forty hosts connected to a known malware address, twelve hundred times',
      detail:
        'The overnight queue holds 1,214 alerts, all with the same title: host connected to known ' +
        'malware command and control. The destination on every one is 192.0.2.99. Forty distinct ' +
        'Ardal machines are involved, across four offices, starting at 18:40 yesterday and ' +
        'continuing through the night at roughly one connection per host per hour.',
      source: 'DNS security platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.2',
      atSeconds: 170,
      surface: 'network-flow',
      summary: 'That address belongs to our own supplier',
      detail:
        '192.0.2.99 is listed in the DNS security platform documentation as its sinkhole address. ' +
        'When a host asks for a domain on the block list, the platform answers with this address ' +
        'instead of the real one. The host then connects to the supplier, which accepts the ' +
        'connection and returns nothing. Every one of the 1,214 connections went there.',
      source: 'DNS security platform',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 350,
      surface: 'raw-log',
      summary: 'All forty were asking for the same domain',
      detail:
        'Every one of the 1,214 requests was for updates.pdfquickly.example. The platform ' +
        'categorised that domain on 20 August as adware and potentially unwanted, not as malware. ' +
        'The alert rule that fired treats every category on the block list as malware command and ' +
        'control in its title text.',
      source: 'DNS security platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 530,
      surface: 'host-artefact',
      summary: 'Forty people installed the same browser extension',
      detail:
        'All forty hosts carry a browser extension called PDF Quickly, installed between 4 and 11 ' +
        'August. It converts documents, does what it says, and checks for updates hourly, which is ' +
        'the traffic. It is not on the approved software list. Forty people installed it after ' +
        'somebody shared a link in the operations team chat saying it saved them an hour.',
      source: 'endpoint inventory',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 720,
      surface: 'raw-log',
      summary: 'One host reached the real address, before the block existed',
      detail:
        'ADF-LAP-22 connected to 198.51.100.88, the genuine address behind that domain, on 14 ' +
        'August at 03:12, six days before the domain was categorised and blocked. That connection ' +
        'completed and transferred 2.1 megabytes inbound. It is the only connection in the retained ' +
        'logs that reached the real host rather than the sinkhole.',
      source: 'perimeter firewall',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 900,
      surface: 'network-flow',
      summary: 'A second domain is being blocked and should not be',
      detail:
        'The same platform is sinkholing track.brentmoor-logistics.example, which belongs to a ' +
        'genuine Ardal haulage supplier and carries their delivery tracking callbacks. It was ' +
        'categorised as suspicious on 28 August. Since then 340 tracking callbacks have failed ' +
        'silently, the operations team has been telephoning for delivery updates, and nobody has ' +
        'connected the two.',
      source: 'DNS security platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 1080,
      surface: 'alert-queue',
      summary: 'What can be done about the extension',
      detail:
        'The extension can be removed centrally by browser policy in about thirty minutes, which ' +
        'takes it off all forty machines without asking anybody. It can also be left alone, since ' +
        'the update traffic is already blocked. The forty people use it daily and there is no ' +
        'approved equivalent. Adding it to the approved list requires a review nobody has ' +
        'requested.',
      source: 'operations',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.8',
      atSeconds: 1260,
      surface: 'alert-queue',
      summary: 'The rule has done this before',
      detail:
        'The rule title reads host connected to known malware command and control for every ' +
        'category on the block list, including adware, unwanted software and suspicious. It has ' +
        'produced three out-of-hours escalations this quarter, all of them sinkhole hits, all of ' +
        'them closed the following morning. The title text is one field in the rule definition.',
      source: 'security programme',
      claimedSeverity: 'high',
    },
  ],
};

export const IT_SAYS_MALWARE_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Between 4 and 11 August, forty people installed a browser extension called PDF Quickly after somebody shared a link in the operations team chat. It converts documents, does what it says, is not on the approved list, and checks for updates every hour.',
    'On 20 August the DNS security platform categorised its update domain as adware and potentially unwanted. From then on, every hourly update check was answered with the platform sinkhole address, 192.0.2.99, so the host connected to the supplier and reached nobody.',
    'That is what the 1,214 overnight alerts are. Every one is a record of a connection being prevented, and the rule title calls all of them malware command and control because that is the title text for every category on the block list.',
    'Reading it correctly does not empty the board. Forty machines carry unapproved software installed from a chat link, which is a real finding about how software arrives at Ardal.',
    'And one connection got through. ADF-LAP-22 reached the genuine address, 198.51.100.88, on 14 August at 03:12, six days before the block existed, and pulled 2.1 megabytes inbound. It is the only connection in the retained logs that reached the real host, it happened at three in the morning, and it needs its own investigation.',
    'The same platform is sinkholing a genuine haulage supplier tracking domain, categorised as suspicious on 28 August. 340 delivery callbacks have failed silently since, operations has been telephoning for updates, and nobody connected the two because a blocked callback produces no error anybody sees.',
    'The extension can be removed by browser policy in thirty minutes. Its update traffic is already blocked either way, so the removal is about unapproved software rather than about this traffic.',
    'The rule title is one field. It has produced three out-of-hours escalations this quarter, all sinkhole hits, all closed the next morning.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.declare', 'act.isolate', 'act.contact-attacker', 'act.attribute-named'],
      escalateTo: ['network-analyst'],
      why:
        'Forty machines, four offices, twelve hundred alerts, and the title says malware command and ' +
        'control. Everything about that pushes towards declaring an incident before anybody has ' +
        'read a single field, and the volume is doing most of the pushing: twelve hundred is one ' +
        'thing happening repeatedly, not twelve hundred things. Raise it and hold it, and start with ' +
        'the two questions the title is hiding. What is that destination, which nobody has said out ' +
        'loud yet. And what does connected mean in this platform, which is a question about the ' +
        'tool rather than about the attacker and is the one an operator has to be able to ask. ' +
        'Neither takes more than a minute and both change what this is.',
      standIn:
        'Forty machines, four offices, twelve hundred alerts, title says malware command and control. ' +
        'All of that pushes you to declare before reading a field, and the volume is doing most of ' +
        'it. Twelve hundred is one thing happening over and over, not twelve hundred things. Raising ' +
        'it and holding it. Two questions the title is hiding: what is that destination, which ' +
        'nobody has said out loud, and what does connected mean in this platform. The second is ' +
        'about our tool, not the attacker, and it is the one you have to be able to ask. A minute ' +
        'each, and both change what this is.',
      commandOptions: [
        { command: "awk -F, '{print $4}' /evidence/dns/overnight-alerts.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '{print $3}' /evidence/dns/overnight-alerts.csv | sort -u | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status dnsmasq', ...STATUS_CHECK },
        { command: 'cat /evidence/dns/overnight-alerts.csv', ...DUMP_ALL },
        { command: 'wc -l /evidence/dns/overnight-alerts.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Twelve hundred alerts. Find out how many distinct destinations and domains they involve.',
      guidance:
        'Twelve hundred alerts. Ask how many different things that is.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'network-analyst',
      alsoAppropriate: ['soc-operator', 'threat-intel'],
      correctActions: ['act.corroborate', 'act.flow-map'],
      outOfLaneActions: ['act.declare', 'act.isolate', 'act.contact-attacker', 'act.attribute-named'],
      escalateTo: ['log-analyst'],
      why:
        'The address is our own supplier sinkhole, documented in their own material. When a host ' +
        'asks for a blocked domain the platform answers with that address instead of the real one, ' +
        'so the machine connects to the supplier and reaches nobody. Every one of the twelve hundred ' +
        'went there, which means every one of them is a record of a connection being prevented. Say ' +
        'the inversion plainly, because the room has spent ten minutes braced for a breach and needs ' +
        'to land somewhere specific: nothing reached an attacker, and the alerts are the control ' +
        'working. The general habit is the one to carry, and it is not about sinkholes. Know what ' +
        'your own tooling substitutes into the data before you read the data, because every product ' +
        'on the floor writes something into the record that did not come from the network.',
      standIn:
        'That address is our supplier sinkhole, in their own documentation. Host asks for a blocked ' +
        'domain, the platform answers with that address instead of the real one, the machine ' +
        'connects to our supplier and reaches nobody. All twelve hundred went there, so all twelve ' +
        'hundred are records of a connection being stopped. Nothing reached an attacker. The alerts ' +
        'are the control working. And the habit is not about sinkholes: know what your own tooling ' +
        'puts into the data before you read the data. Every product we own writes something into the ' +
        'record that did not come off the network.',
      commandOptions: [
        { command: "grep -iE 'sinkhole|192.0.2.99' /evidence/dns/platform-documentation.txt", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$4==\"192.0.2.99\" {n++} END {print n}' /evidence/dns/overnight-alerts.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status dnsmasq', ...STATUS_CHECK },
        { command: 'cat /evidence/dns/platform-documentation.txt', ...DUMP_ALL },
        { command: 'curl -s http://192.0.2.99/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out who owns the destination address before deciding what reaching it means.',
      guidance:
        'They all went to one address. Ask whose it is.',
    },
    {
      eventId: 'ev.3',
      verdict: 'false-positive',
      critical: true,
      firstResponder: 'log-analyst',
      alsoAppropriate: ['detection-engineer', 'soc-operator'],
      correctActions: ['act.corroborate', 'act.timeline'],
      outOfLaneActions: ['act.declare', 'act.isolate', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: ['detection-engineer', 'forensics'],
      why:
        'One domain, twelve hundred times, and the platform categorised it as adware and potentially ' +
        'unwanted rather than as malware. The alert says malware because the rule uses that title ' +
        'for every category on the block list, so the word that started the whole morning was ' +
        'written by a template. That is worth saying flatly rather than with any embarrassment: ' +
        'nobody misread anything, the alert was wrong in the specific way alerts are wrong, and the ' +
        'response to that is to fix the field rather than to be more sceptical next time. What the ' +
        'row genuinely establishes is that the category matters and is available: adware and command ' +
        'and control call for completely different mornings, and both were in the record from the ' +
        'first minute.',
      standIn:
        'One domain, twelve hundred times, and the platform called it adware and potentially ' +
        'unwanted, not malware. The alert says malware because that title is used for every category ' +
        'on the block list. The word that started this morning was written by a template. Nobody ' +
        'misread anything and I do not want anybody sheepish about it. The fix is the field, not ' +
        'being more sceptical next time. And the category was in the record from the first minute. ' +
        'Adware and command and control are two completely different mornings.',
      commandOptions: [
        { command: "awk -F, '{print $5}' /evidence/dns/overnight-alerts.csv | sort -u", correct: true, teaches: CORRECT_STEP },
        { command: "grep -i 'pdfquickly' /evidence/dns/category-log.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status dnsmasq', ...STATUS_CHECK },
        { command: 'cat /evidence/dns/category-log.csv', ...DUMP_ALL },
        { command: 'grep -rn "malware" /evidence/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'Find what category the platform actually assigned, rather than what the alert title says.',
      guidance:
        'The title says malware. Ask what the platform says.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'forensics',
      alsoAppropriate: ['soc-operator', 'mitigation-specialist'],
      correctActions: ['act.corroborate', 'act.scope-estate'],
      outOfLaneActions: ['act.reimage-now', 'act.isolate', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['mitigation-specialist', 'ir-lead'],
      why:
        'A browser extension that converts documents, does what it claims, and checks for updates ' +
        'every hour, which is the entire traffic. Forty people installed it in a week after ' +
        'somebody shared a link in a team chat saying it saved them an hour. Nobody did anything ' +
        'wrong in the sense the room means by wrong, and the finding is real anyway: unapproved ' +
        'software reached forty machines in seven days through a chat message, and the only reason ' +
        'anybody knows is that its update domain happened to get categorised. Report it as a route ' +
        'rather than as forty mistakes. The same route works for the next thing shared in the same ' +
        'chat, and that thing will not necessarily convert documents.',
      standIn:
        'A browser extension that converts documents and does what it says, checking for updates ' +
        'every hour, which is all the traffic. Forty people installed it in a week off a chat link ' +
        'saying it saved them an hour. Nobody did anything wrong in the way we mean it and the ' +
        'finding is still real: unapproved software reached forty machines in seven days through a ' +
        'chat message, and we only know because its update domain got categorised. Report the route, ' +
        'not forty mistakes. That route works for the next thing shared in that chat, and the next ' +
        'thing might not convert documents.',
      commandOptions: [
        { command: "awk -F, '$3==\"PDF Quickly\" {print $1, $4}' /evidence/endpoint/extensions.csv | head", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$3==\"PDF Quickly\" {print $4}' /evidence/endpoint/extensions.csv | sort | uniq -c", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status chrome-policy', ...STATUS_CHECK },
        { command: 'cat /evidence/endpoint/extensions.csv', ...DUMP_ALL },
        { command: 'grep -c PDF /evidence/endpoint/extensions.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find what is on those forty machines that wants to reach that domain, and when it arrived.',
      guidance:
        'Forty machines asked for it. Ask what on them is asking.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'command-and-control',
      critical: true,
      techniques: ['T1071.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.preserve', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.contact-attacker', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'This is the row the morning exists for and it is the one most likely to be lost. By the ' +
        'time it arrives the room has established that the alerts are sinkhole hits and is relaxing, ' +
        'and this connection is not a sinkhole hit. ADF-LAP-22 reached the genuine address on 14 ' +
        'August, six days before the block existed, and pulled 2.1 megabytes inbound at three in ' +
        'the morning. Three facts, each of which would be worth a look alone: the real host rather ' +
        'than the supplier, before the control existed, and a volume and an hour that do not match ' +
        'an update check on a machine nobody was using. Preserve and investigate that host properly ' +
        'as its own piece of work. The general lesson is worth stating because it will recur: a ' +
        'control that starts on a date divides the evidence into before and after, and the ' +
        'interesting part is always before.',
      standIn:
        'This is what the morning exists for and it is the one we will lose, because by now everyone ' +
        'has decided the alerts are sinkhole hits and relaxed, and this one is not. ADF-LAP-22 ' +
        'reached the real address on 14 August, six days before the block, and pulled 2.1 megabytes ' +
        'inbound at three in the morning. Three separate things worth a look: the real host, before ' +
        'the control existed, and a volume and an hour that do not fit an update check on a machine ' +
        'nobody was using. Preserve it and work it as its own thing. And remember the shape: a ' +
        'control that starts on a date splits the evidence into before and after, and the ' +
        'interesting part is always before.',
      commandOptions: [
        { command: "awk '$5==\"198.51.100.88\" {print $2, $3, $8}' /var/log/firewall/august.log", correct: true, teaches: CORRECT_STEP },
        { command: "grep -iE 'pdfquickly|198.51.100.88' /evidence/dns/category-log.csv /var/log/firewall/august.log", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status firewalld', ...STATUS_CHECK },
        { command: 'cat /var/log/firewall/august.log', ...DUMP_ALL },
        { command: 'curl -s http://198.51.100.88/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'The block started on a date. Look at what happened to that domain before it.',
      guidance:
        'Everything since the block was stopped. Ask about before.',
    },
    {
      eventId: 'ev.6',
      verdict: 'false-positive',
      critical: true,
      firstResponder: 'network-analyst',
      alsoAppropriate: ['detection-engineer', 'mitigation-specialist'],
      correctActions: ['act.corroborate', 'act.flow-map', 'act.tune'],
      outOfLaneActions: ['act.declare', 'act.isolate', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: ['mitigation-specialist'],
      why:
        'The same platform is sinkholing a real supplier delivery tracking domain, categorised as ' +
        'suspicious on 28 August, and 340 callbacks have failed since. Nobody reported it because a ' +
        'blocked callback produces no error anybody sees: operations noticed that tracking stopped ' +
        'working and started telephoning, which is what people do, and the two facts sat in ' +
        'different parts of the company for a fortnight. This is the row that shows security ' +
        'controls have a cost that lands on somebody else and arrives silently. Tune it out today, ' +
        'and take one thing from it beyond the fix: a block that breaks something loudly gets ' +
        'reported in an hour, and a block that breaks something quietly is found by accident during ' +
        'an unrelated incident, which is exactly what just happened.',
      standIn:
        'Same platform is sinkholing a real supplier delivery tracking domain, categorised suspicious ' +
        'on 28 August, and 340 callbacks have failed since. Nobody reported it because a blocked ' +
        'callback produces no error anybody sees. Operations noticed tracking stopped working and ' +
        'started phoning, which is what people do, and the two halves sat in different parts of the ' +
        'company for a fortnight. Our controls have a cost and it lands on somebody else and it ' +
        'arrives silently. Tuning it today. And note how we found it: a block that breaks something ' +
        'loudly gets reported in an hour, a quiet one gets found by accident during something else.',
      commandOptions: [
        { command: "awk -F, '$4==\"192.0.2.99\" {print $6}' /evidence/dns/sinkhole-week.csv | sort | uniq -c | sort -rn", correct: true, teaches: CORRECT_STEP },
        { command: "grep -i 'brentmoor' /evidence/procurement/approved-suppliers.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status dnsmasq', ...STATUS_CHECK },
        { command: 'cat /evidence/dns/sinkhole-week.csv', ...DUMP_ALL },
        { command: 'grep -rn "brentmoor" /evidence/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'List every domain the platform is sinkholing and check each one against the supplier register.',
      guidance:
        'One domain is blocked correctly. Ask what else is being blocked.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'forensics'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.sequence-remedy', 'act.check-rollback'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.contact-attacker', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'Be honest about the ordering, because the urgent thing is not the extension. Unblocking the ' +
        'haulage supplier goes first: it is a five minute change, it is costing operations real ' +
        'work today, and it is the only item on this board actively hurting anybody. Then ADF-LAP-22, ' +
        'which is a real investigation and not a cleanup. The extension comes third and is a policy ' +
        'question rather than an incident action, and the decision needs stating carefully: its ' +
        'update traffic is already blocked, so removing it protects against unapproved software ' +
        'rather than against this traffic. Removing it centrally takes thirty minutes and takes a ' +
        'tool forty people use daily away without warning, and doing that at nine in the morning ' +
        'with no approved equivalent buys a queue at the service desk and teaches forty people that ' +
        'security removes things without asking. Deliberately left undone: nothing here explains ' +
        'what ADF-LAP-22 downloaded on 14 August, and the review that would let people use a ' +
        'document converter has still not been requested.',
      standIn:
        'Honest ordering, and the urgent thing is not the extension. Unblock the haulage supplier ' +
        'first: five minutes, it is costing operations real work today, and it is the only thing on ' +
        'this board actively hurting anyone. Then ADF-LAP-22, which is an investigation, not a ' +
        'cleanup. The extension is third and it is a policy question, not an incident action. Its ' +
        'update traffic is already blocked, so removing it protects against unapproved software, not ' +
        'against this traffic. Thirty minutes to pull a tool forty people use daily, at nine in the ' +
        'morning, with nothing approved to replace it. That buys a service desk queue and teaches ' +
        'forty people we take things away without asking. Left undone: we still do not know what ' +
        'that laptop downloaded on the fourteenth.',
      commandNudge:
        'Order these by who is being harmed right now, not by which is most obviously security work.',
    },
    {
      eventId: 'ev.8',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['soc-operator', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest', 'act.predict'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'The title text is one field and it has cost three out-of-hours escalations this quarter, ' +
        'every one a sinkhole hit, every one closed the following morning. That is the finding, and ' +
        'the fix is smaller than the problem by an embarrassing margin: put the platform own ' +
        'category in the title, and say prevented rather than connected, because the platform ' +
        'already knows both and is discarding them on the way to the queue. Two things follow ' +
        'worth naming. Somebody woken at two in the morning three times for something that was ' +
        'never an incident is being trained not to believe this rule, and that training is the real ' +
        'cost rather than the lost hours. And the prediction is certain rather than likely: it will ' +
        'happen again within the quarter, because block lists get new entries constantly and every ' +
        'new entry produces this alert on whatever machines were already asking.',
      standIn:
        'The title is one field and it has cost three out-of-hours escalations this quarter, all ' +
        'sinkhole hits, all closed the next morning. The fix is embarrassingly small: put the ' +
        'platform own category in the title and say prevented rather than connected. It already ' +
        'knows both and throws them away on the way to our queue. Two things follow. Somebody woken ' +
        'at two in the morning three times for a non-incident is learning not to believe this rule, ' +
        'and that is the real cost, not the hours. And this is not a prediction, it is a certainty: ' +
        'it happens again this quarter, because block lists get new entries constantly and every new ' +
        'entry fires this on whoever was already asking.',
      commandOptions: [
        { command: "grep -iE 'title|name|category' /evidence/detections/dns-block-rule.yaml", correct: true, teaches: CORRECT_STEP },
        { command: "grep -icE 'sinkhole|closed' /evidence/queue/escalations-quarter.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status siem', ...STATUS_CHECK },
        { command: 'cat /evidence/detections/dns-block-rule.yaml', ...DUMP_ALL },
        { command: 'siem-cli rule disable dns-block', ...MUTATE },
      ],
      commandNudge:
        'Read the rule definition and find which field produced the word that started this.',
      guidance:
        'The alert was misleading. Ask what would have to change.',
    },
  ],
};
