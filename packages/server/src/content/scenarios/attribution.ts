/**
 * Scenario 62: Attributed.
 *
 * A sector advisory names a state-sponsored group, three of its indicators match
 * Fenmarch telemetry, and the board wants confirmation by four o'clock.
 *
 * WHAT THIS TEACHES
 *
 * That indicators are the weakest form of attribution and tradecraft is the
 * strongest, and that the gap between them is where organisations make very
 * expensive decisions.
 *
 * All three indicators genuinely match. They also match several hundred other
 * organisations, because one is a shared hosting address with four hundred
 * tenants, one is a commercially sold remote administration tool that thirty
 * thousand companies run including this one, and one is a domain sitting in a
 * registrar parking range that has held twelve thousand others. Matching an
 * indicator establishes that two parties touched the same object. It does not
 * establish that they are the same party, and an advisory is not lying when it
 * lists these: they are perfectly good hunting leads and terrible identity
 * evidence.
 *
 * WHAT THE ACTUAL BEHAVIOUR SAYS
 *
 * Somebody really is inside Fenmarch, and nothing they have done resembles the
 * group in the advisory. They worked 09:00 to 17:00 in one time zone with
 * weekends off, went at the payment initiation system on their first day, and
 * staged an encryptor. That is a business, and it changes what the next
 * forty-eight hours are for: a state actor means a long hunt and a regulator,
 * and a criminal means the money leaves on Friday.
 *
 * THE COST OF THE CONFIDENT ANSWER
 *
 * The board is not asking an academic question. Say state-sponsored and they
 * approve a six-month programme and feel appropriately serious, and nobody stops
 * the payment batch.
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

const ID = 'attributed';

export const ATTRIBUTED: Scenario = {
  id: ID,
  title: 'Attributed',
  difficulty: 'advanced',
  durationMinutes: 75,
  situation:
    'It is 11:00 at Fenmarch Credit Union. A sector advisory published overnight names a ' +
    'state-sponsored group targeting US financial services, three of its indicators match our ' +
    'telemetry, and the board has asked for a written assessment by 16:00.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'threat-intel',
    'cloud-security',
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
      summary: 'Three advisory indicators match, and the board wants a name by four o\'clock',
      detail:
        'The sector information sharing centre published an advisory at 02:00 describing a group ' +
        'it tracks as SILENT LADDER, assessed as state-sponsored, targeting US financial services. ' +
        'It lists 41 indicators. Retrospective search across ninety days matches three: an IP ' +
        'address, a file hash and a domain. The chief executive has asked the board to be told by ' +
        '16:00 whether Fenmarch is being attacked by a nation state.',
      source: 'sector advisory SA-2026-114',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'network-flow',
      summary: 'The matching address hosts four hundred other tenants',
      detail:
        '198.51.100.19 is listed in the advisory as command and control infrastructure. It belongs ' +
        'to a low-cost virtual server provider and passive DNS shows 412 distinct hostnames ' +
        'resolving to it in the last year. The Fenmarch connection was a single outbound HTTPS ' +
        'session on 14 August from a marketing workstation, lasting 90 seconds, to a hostname that ' +
        'is a documentation site for an email design tool.',
      source: '198.51.100.19',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'host-artefact',
      summary: 'The matching hash is a commercial remote administration tool',
      detail:
        'The hash resolves to a signed, commercially licensed remote administration product used ' +
        'by around 30,000 organisations. The advisory lists it because the group uses it, which is ' +
        'true and is also true of a large fraction of the industry. Fenmarch has a site licence ' +
        'for it. It is installed on 340 endpoints by the IT service desk and appears in the ' +
        'approved software catalogue.',
      source: 'software inventory',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'raw-log',
      summary: 'The matching domain is in a registrar parking range',
      detail:
        'The domain resolved once, on 3 July, from a Fenmarch recursive resolver. At that time it ' +
        'pointed into a registrar parking range that has hosted more than 12,000 domains. The ' +
        'query came from a mail security appliance performing a reputation lookup on a link inside ' +
        'a quarantined message, which is what that appliance does several thousand times a day. No ' +
        'host connected to the resolved address.',
      source: 'DNS resolver',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'process-tree',
      summary: 'A dropped binary carries Cyrillic strings and a foreign build path',
      detail:
        'A binary recovered from FCU-SRV-19 contains three Cyrillic language strings in its ' +
        'resource section and a build path referencing a user directory in a non-English locale. ' +
        'The advisory cites both characteristics as SILENT LADDER indicators. The same binary is ' +
        'sold on two criminal marketplaces as an off-the-shelf loader, and every copy of it carries ' +
        'the same strings and the same build path, because they are the author\'s and not the ' +
        'buyer\'s.',
      source: 'FCU-SRV-19',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 800,
      surface: 'alert-queue',
      summary: 'The intruder keeps office hours and took weekends off',
      detail:
        'Reconstructed activity across nineteen days shows commands issued between 06:00 and 14:00 ' +
        'UTC on weekdays only, with no activity on 22, 23, 29 or 30 August. Within the first four ' +
        'hours of access the operator enumerated and reached the payment initiation system, ' +
        'ignoring the member records database and the mortgage book entirely. An encryptor was ' +
        'staged in a share on 28 August and has not been run.',
      source: 'incident reconstruction',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 960,
      surface: 'cloud-audit',
      summary: 'They hold a payments operator session and Friday\'s batch is 4.1 million',
      detail:
        'The compromised account is a payments operations login with authority to prepare, but not ' +
        'to release, outbound batches. The Friday faster payments batch is prepared on Thursday ' +
        'evening and released at 09:30 Friday by a second approver, and this week it totals 4.1 ' +
        'million dollars across 2,880 payments. The account has viewed the batch preparation screen ' +
        'eleven times since 26 August and has changed nothing.',
      source: 'payments platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1120,
      surface: 'alert-queue',
      summary: 'The payment run cannot simply be stopped',
      detail:
        'Friday\'s batch contains 2,880 payments including 1,940 salary credits for eleven ' +
        'employer clients. Cancelling it means those employees are not paid on Friday. Suspending ' +
        'the compromised account before Thursday evening prevents batch preparation, which is done ' +
        'by three people of whom this is one. The second approver control has never been tested ' +
        'against an operator account known to be compromised.',
      source: 'payments operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1280,
      surface: 'raw-log',
      summary: 'Deploying the advisory indicator set would fire 2,100 times a month',
      detail:
        'Backtesting all 41 advisory indicators over ninety days produces 6,340 matches. Of those, ' +
        '6,201 are the remote administration tool on licensed endpoints, 96 are reputation lookups ' +
        'by the mail appliance, and 43 are connections to shared hosting addresses. Three matches ' +
        'have no innocent explanation and all three are on FCU-SRV-19, which is already known. The ' +
        'floor currently handles around 400 alerts a month.',
      source: 'detection coverage',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.10',
      atSeconds: 1440,
      surface: 'alert-queue',
      summary: 'The advisory rule has fired on nine servers this morning',
      detail:
        'A detection deployed at 08:30 from the advisory\'s supplied rule has matched on nine ' +
        'servers. All nine are running the licensed remote administration agent, installed by the ' +
        'service desk between March and July with change records, from the vendor\'s own signed ' +
        'installer, on the version in the approved catalogue. Two of the nine are domain ' +
        'controllers. The rule matches the product, not any particular use of it.',
      source: 'detection platform',
      claimedSeverity: 'critical',
    },
  ],
};

export const ATTRIBUTED_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'A sector advisory published overnight describes a group tracked as SILENT LADDER, assessed as state-sponsored, and lists 41 indicators. Three of them match Fenmarch telemetry over ninety days.',
    'The address is a low-cost virtual server with 412 hostnames on it in a year, and the Fenmarch connection was 90 seconds from a marketing workstation to a documentation site for an email design tool.',
    'The hash is a signed commercial remote administration product used by around 30,000 organisations, licensed at Fenmarch and installed on 340 endpoints by its own service desk.',
    'The domain resolved once, from a mail security appliance doing a reputation lookup on a quarantined message, into a registrar parking range that has held more than 12,000 domains. No host connected to it.',
    'So all three matches are real and none of them is evidence of identity.',
    'There is a genuine intrusion. Across nineteen days the operator worked 06:00 to 14:00 UTC on weekdays only, took four weekend days off, reached the payment initiation system within four hours of first access, ignored the member records database and the mortgage book entirely, and staged an encryptor on 28 August without running it.',
    'That is a financially motivated criminal operation keeping office hours in a time zone around three hours ahead, and it does not resemble the advisory group in any behaviour, only in objects.',
    'The Cyrillic strings and the foreign build path in the dropped binary belong to the author of an off-the-shelf loader sold on two criminal marketplaces, and are identical in every copy anybody buys.',
    'The compromised account can prepare but not release payment batches. Friday\'s batch is $4.1 million across 2,880 payments, including 1,940 salary credits.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'reconnaissance',
      firstResponder: 'threat-intel',
      alsoAppropriate: ['ir-lead', 'soc-operator'],
      correctActions: ['act.investigate-hold', 'act.ttp-map'],
      outOfLaneActions: ['act.attribute-named', 'act.declare', 'act.dismiss', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'network-analyst'],
      why:
        'Three matches out of forty-one, and the number to hold onto is that three of forty-one is ' +
        'not a partial match on a fingerprint, it is three objects in common. The deadline is the ' +
        'real hazard on this row. A board asking by 16:00 whether this is a nation state is asking ' +
        'a question that has an honest answer and a satisfying answer, and they are not the same ' +
        'answer. Set the expectation now rather than at 15:55: what can be delivered by four is ' +
        'what the intruder has actually done and what class of actor behaves that way, with a ' +
        'confidence attached, and a named group is not on offer from three indicators. Do not ' +
        'declare on the advisory either; nothing here yet says anybody is inside, and the advisory ' +
        'is a hunting brief rather than a detection.',
      standIn:
        'Three of forty-one indicators match, and three of forty-one is not a partial fingerprint, ' +
        'it is three objects we have in common with a report. The board wants a nation state ' +
        'answer by four. I am telling them now what they will get: what the intruder has actually ' +
        'done, what class of actor behaves that way, and a confidence level. A group name is not ' +
        'on offer from three indicators, and I would rather say that at eleven than at five to ' +
        'four.',
      commandOptions: [
        { command: "comm -12 <(sort /evidence/advisory/indicators.txt) <(sort /evidence/telemetry/observed-90d.txt)", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -cf /evidence/advisory/indicators.txt /evidence/telemetry/observed-90d.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status siem', ...STATUS_CHECK },
        { command: 'cat /evidence/advisory/SA-2026-114.txt', ...DUMP_ALL },
        { command: 'grep -c . /evidence/advisory/indicators.txt', ...COUNT_ONLY },
      ],
      commandNudge:
        'Establish exactly which three indicators matched, and what kind of thing each one is.',
      guidance:
        'Three matched out of forty-one. Ask what sort of objects those three are.',
    },
    {
      eventId: 'ev.2',
      verdict: 'false-positive',
      firstResponder: 'network-analyst',
      alsoAppropriate: ['threat-intel', 'soc-operator'],
      correctActions: ['act.flow-map', 'act.dismiss'],
      outOfLaneActions: ['act.isolate', 'act.contact-attacker', 'act.attribute-named', 'act.triage-high'],
      escalateTo: ['threat-intel'],
      why:
        'An address with 412 hostnames on it in a year is a hosting provider, not an adversary, and ' +
        'the advisory is not wrong to list it: the group did use it, on a server they rented for a ' +
        'few dollars a month alongside four hundred other tenants. What matters is what Fenmarch ' +
        'actually did with it, and the answer is a 90 second HTTPS session from a marketing ' +
        'workstation on 14 August to a documentation site for an email design tool. Same address, ' +
        'different hostname, different service, different month, different purpose. This is the ' +
        'shape of most indicator matches on shared infrastructure and it is worth naming as a ' +
        'category rather than dismissing as a one-off, because the same reasoning will be needed ' +
        'twice more before four o\'clock.',
      standIn:
        'Four hundred and twelve hostnames on that address in a year, so it is a hosting provider, ' +
        'and the advisory is right that the group used it. They rented a box on it. Our connection ' +
        'is ninety seconds of HTTPS from a marketing workstation on 14 August to a documentation ' +
        'site for an email design tool. Same address, different hostname, different service, ' +
        'different month. Closing it, and this same shape is going to come up twice more today.',
      commandOptions: [
        { command: "awk '$5==\"198.51.100.19\" {print $1, $3, $6, $9}' /var/log/proxy/access.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep 198.51.100.19 /var/log/dns/passive-90d.log | awk \'{print $4}\' | sort -u | wc -l', correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 198.51.100.19', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/proxy/access.log', ...DUMP_ALL },
        { command: 'grep -c 198.51.100.19 /var/log/proxy/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out how many other hostnames live on that address, and which one we actually reached.',
      guidance:
        'An address can host many things. Ask which one you connected to.',
    },
    {
      eventId: 'ev.3',
      verdict: 'false-positive',
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['threat-intel', 'soc-operator'],
      correctActions: ['act.decode', 'act.dismiss'],
      outOfLaneActions: ['act.reimage-now', 'act.isolate', 'act.attribute-named', 'act.triage-high'],
      escalateTo: ['threat-intel', 'detection-engineer'],
      why:
        'The hash is a signed commercial product with a site licence, sitting on 340 Fenmarch ' +
        'endpoints because the service desk put it there, and in the approved software catalogue. ' +
        'The advisory lists it because the group uses it, and the group uses it because everybody ' +
        'does: it is a legitimate tool that happens to be excellent at what an intruder also wants ' +
        'to do. This is the most consequential of the three, and not because of the analysis. It ' +
        'is because somebody is going to act on it. An indicator that matches your own approved ' +
        'estate is a live operational hazard, and the version of today that goes badly is a floor ' +
        'blocking a hash that IT installed deliberately on a third of the endpoints. Say so before ' +
        'anybody blocks anything, and hand it straight to detection engineering.',
      standIn:
        'The hash is a signed commercial remote administration product. We have a site licence, our ' +
        'own service desk put it on 340 endpoints, and it is in the approved catalogue. The ' +
        'advisory lists it because the group uses it, and the group uses it because thirty ' +
        'thousand organisations do. Nobody blocks this hash. That is how today goes wrong: we ' +
        'block a tool our own IT deployed on a third of the estate.',
      commandOptions: [
        { command: "awk -F, '$4==\"a3f1c...\" {print $1, $2, $5}' /var/log/inventory/software.csv | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "remote admin" /evidence/approved-software-catalogue.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status edr-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/inventory/software.csv', ...DUMP_ALL },
        { command: 'edr-cli hash block --sha256 a3f1c', ...MUTATE },
      ],
      commandNudge:
        'Find out how many of your own endpoints have that hash, and whether it is in the approved ' +
        'catalogue.',
      guidance:
        'Before you block a hash, ask whether you installed it yourself.',
    },
    {
      eventId: 'ev.4',
      verdict: 'false-positive',
      firstResponder: 'log-analyst',
      alsoAppropriate: ['threat-intel', 'soc-operator'],
      correctActions: ['act.timeline', 'act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: ['threat-intel'],
      why:
        'The weakest of the three and the easiest to misread as the strongest, because a domain ' +
        'lookup feels like somebody went somewhere. Nobody did. The query came from the mail ' +
        'security appliance doing a reputation check on a link inside a message it had already ' +
        'quarantined, which it does several thousand times a day, and no host connected to the ' +
        'address it resolved to. So the trace of this indicator in Fenmarch is a security control ' +
        'working correctly. The domain also sat in a registrar parking range that has held twelve ' +
        'thousand others, so even the resolution points at nothing in particular. Worth saying ' +
        'plainly in the assessment: one of our three matches is our own defences looking at ' +
        'something, and that is a category of false positive that will recur every time an ' +
        'advisory lists domains.',
      standIn:
        'This one is our own mail appliance doing a reputation lookup on a link in a message it had ' +
        'already quarantined, which it does thousands of times a day, and no host connected to ' +
        'what it resolved to. The domain was parked in a range that has held twelve thousand ' +
        'others. So our third match is a security control doing its job. That goes in the ' +
        'assessment in those words.',
      commandOptions: [
        { command: "awk '$4==\"ladderpost.example\" {print $1, $3, $6}' /var/log/dns/queries.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "reputation" /var/log/mailsec/lookups.log | tail -20', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status unbound', ...STATUS_CHECK },
        { command: 'cat /var/log/dns/queries.log', ...DUMP_ALL },
        { command: 'nslookup ladderpost.example', ...WRONG_TARGET },
      ],
      commandNudge:
        'Find out which host made that DNS query and whether anything then connected.',
      guidance:
        'A lookup is not a visit. Ask who asked, and whether anybody went.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'execution',
      techniques: ['T1036'],
      appearsToBe:
        'Corroboration that the intruder is the state-sponsored group in the advisory, which cites ' +
        'both the Cyrillic resource strings and the foreign build path as its indicators. The ' +
        'strings belong to the author of an off-the-shelf loader sold on two criminal ' +
        'marketplaces and are identical in every copy anybody buys, so they identify the tool and ' +
        'not the buyer.',
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['threat-intel', 'forensics', 'ir-lead'],
      correctActions: ['act.decode', 'act.ttp-map'],
      outOfLaneActions: ['act.attribute-named', 'act.sandbox', 'act.contact-attacker', 'act.dismiss'],
      escalateTo: ['threat-intel', 'ir-lead'],
      why:
        'The binary is real and hostile, and everything about it that feels like attribution is ' +
        'not. Three Cyrillic strings in a resource section and a build path from a non-English ' +
        'locale, both cited in the advisory, and both belonging to whoever compiled this loader ' +
        'rather than to whoever bought it. It is sold on two criminal marketplaces and every copy ' +
        'carries the same strings and the same path. Language artefacts are the weakest attribution ' +
        'signal that exists: they are trivial to add deliberately, trivial to inherit accidentally, ' +
        'and here they were not even chosen, they came in the box. Anybody with a few hundred ' +
        'dollars produces this evidence about themselves. Map the technique and hand the ' +
        'attribution question on: the binary tells you what was run and it does not tell you who ' +
        'ran it.',
      standIn:
        'The binary is real and it is hostile, and none of the attribution in it is worth anything. ' +
        'Three Cyrillic strings in the resource section and a foreign build path, both cited in the ' +
        'advisory, and both belonging to whoever compiled the loader rather than whoever bought ' +
        'it. It is on sale on two criminal markets and every copy has the same strings and the ' +
        'same path. Nobody chose them, they came in the box. Anybody with a few hundred dollars ' +
        'produces this evidence about themselves.',
      commandOptions: [
        { command: 'strings -el /evidence/srv19/loader.bin | head -40', correct: true, teaches: CORRECT_STEP },
        { command: "sha256sum /evidence/srv19/loader.bin && grep -i 'loader' /evidence/intel/marketplace-samples.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status edr-agent', ...STATUS_CHECK },
        { command: 'cat /evidence/srv19/loader.bin', ...DUMP_ALL },
        { command: 'curl -s http://198.51.100.19/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out whether other samples of this binary carry the same strings.',
      guidance:
        'A foreign language string is in a file. Ask who put it there, and whether every copy has ' +
        'it.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'discovery',
      critical: true,
      techniques: ['T1078', 'T1082'],
      firstResponder: 'threat-intel',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.assess-actor', 'act.predict', 'act.ttp-map'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.contact-attacker', 'act.isolate'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'This is the assessment, and it is built out of behaviour rather than objects. Nineteen ' +
        'days of activity confined to 06:00 to 14:00 UTC on weekdays, with four weekend days ' +
        'untouched, is somebody with a working week in a time zone about three hours ahead. Within ' +
        'four hours of first access they reached the payment initiation system, and they left the ' +
        'member records database and the mortgage book alone entirely, which is the part that ' +
        'settles motive: an intelligence operation against a financial institution wants the ' +
        'records, and this one walked past them to get to the money. The staged encryptor is the ' +
        'confirmation, because it is a monetisation fallback and no espionage operation stages ' +
        'one. So the answer to the board is a class of actor stated with high confidence and no ' +
        'name, and the reasoning matters as much as the conclusion: three shared objects against ' +
        'nineteen days of behaviour is not a close call, and the behaviour wins because objects ' +
        'can be bought and rented and habits cannot.',
      standIn:
        'Here is the assessment and it is behaviour, not objects. Nineteen days, all of it 06:00 to ' +
        '14:00 UTC on weekdays, four weekend days completely dark. That is somebody working a ' +
        'normal week about three hours ahead of us. Within four hours of getting in they were at ' +
        'the payment initiation system, and they walked straight past the member records and the ' +
        'mortgage book. An intelligence operation wants the records. This one wanted the money. ' +
        'And the staged encryptor is a monetisation fallback, which espionage does not do. ' +
        'Financially motivated criminal, high confidence, no name. Three shared objects against ' +
        'nineteen days of habits is not close.',
      commandNudge:
        'Plot every operator command by hour and by day of week, and see what the pattern is.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1078.004'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'mitigation-specialist'],
      correctActions: ['act.iam-audit', 'act.corroborate'],
      outOfLaneActions: ['act.revoke-key', 'act.reset-password', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'What they are holding, and what they are waiting for. The account can prepare a payment ' +
        'batch and cannot release one, which means the segregation of duties control is the only ' +
        'thing standing between this intrusion and $4.1 million. Eleven visits to the batch ' +
        'preparation screen since 26 August with nothing changed is not indecision: it is somebody ' +
        'learning the process and waiting for the moment when a modification is least likely to be ' +
        'noticed, which is Thursday evening, after preparation and before the 09:30 Friday ' +
        'release. That makes the timeline concrete rather than open-ended, and it is the single ' +
        'most useful sentence to put in front of the board at four o\'clock, because a date is ' +
        'something a board can act on and an actor class is not. Do not revoke the account on ' +
        'this row alone: what that does to Thursday\'s preparation is a question for the people ' +
        'who run the payment operation.',
      standIn:
        'They can prepare a batch and they cannot release one, so segregation of duties is the only ' +
        'thing between them and $4.1 million. Eleven visits to the preparation screen since ' +
        '26 August, nothing changed. That is not indecision, it is learning the process and waiting ' +
        'for Thursday evening, after preparation and before the 09:30 release. So we have a date. ' +
        'That is the sentence for the board at four, because a board can act on a date and cannot ' +
        'act on an actor class.',
      commandOptions: [
        { command: "awk -F, '$2==\"p.oyelaran\" {print $1, $4, $5}' /var/log/payments/audit.csv | tail -30", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "batch-prepare" /var/log/payments/audit.csv | wc -l', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status payments-api', ...STATUS_CHECK },
        { command: 'cat /var/log/payments/audit.csv', ...DUMP_ALL },
        { command: 'net user p.oyelaran /active:no /domain', ...MUTATE },
      ],
      commandNudge:
        'Establish exactly what that account is allowed to do, and what it has been looking at.',
      guidance:
        'They reached the payment system. Ask what they can actually do once they are there.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'collection',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'A deadline the intruder chose, and a remedy that hurts people who have done nothing. ' +
        'Cancelling Friday\'s batch means 1,940 employees at eleven client companies are not paid, ' +
        'which is a real harm and not an inconvenience, and suspending the compromised account ' +
        'before Thursday evening removes one of the three people who prepare the batch and may ' +
        'stop it being prepared at all. The narrow move is to leave everything running and change ' +
        'one thing about Thursday: have the batch prepared by one of the other two operators, and ' +
        'have the second approver reconcile the payment file against the source instruction file ' +
        'line by line before release rather than approving a total. That is a manual control for ' +
        'one week on 2,880 lines, which is unpleasant and is achievable, and it means a modified ' +
        'batch does not get released even if nothing else works. The compensating control is worth ' +
        'stating for what it admits: the second approver control has never been tested against a ' +
        'compromised operator, so nobody actually knows whether it holds, and Friday is a poor ' +
        'time to find out. Establish the rollback, and say what is left undone, which is that the ' +
        'intruder still has access on Thursday and this plan lets them keep it deliberately.',
      standIn:
        'They picked the deadline and the obvious fix hurts people who have done nothing. Cancelling ' +
        'Friday means 1,940 employees at eleven client companies do not get paid. Suspending the ' +
        'account takes out one of the three people who prepare the batch. So change one thing: a ' +
        'different operator prepares it, and the second approver reconciles the payment file ' +
        'against the source instruction line by line instead of approving a total. Two thousand ' +
        'eight hundred and eighty lines by hand for one week, which is horrible and doable. And I ' +
        'want it on record that the second approver control has never been tested against a ' +
        'compromised operator, so we do not actually know it holds. Left undone deliberately: they ' +
        'keep their access through Thursday.',
      commandNudge:
        'Find out who else can prepare that batch, and what the second approver actually checks.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'defense-evasion',
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.backtest', 'act.propose-rule'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Six thousand three hundred and forty matches in ninety days against a floor that handles ' +
        'four hundred alerts a month, which is the arithmetic that has to be done before an ' +
        'advisory becomes a deployment and almost never is. Six thousand two hundred and one of ' +
        'them are the licensed remote administration tool, ninety-six are the mail appliance doing ' +
        'its job, and forty-three are shared hosting. Three have no innocent explanation and all ' +
        'three are on a server that is already known, so the entire indicator set would have added ' +
        'nothing to today and buried the floor. That is not an argument against advisories, and ' +
        'the wrong lesson to take is that indicator feeds are useless. They are excellent for the ' +
        'retrospective search that started this incident, which is a single query against ninety ' +
        'days, and poor as standing detections, which is a query that runs forever. Propose them ' +
        'as a hunt input with the backtest attached, and let the numbers make the argument rather ' +
        'than a judgement about quality.',
      standIn:
        'Six thousand three hundred and forty matches in ninety days, and this floor handles four ' +
        'hundred alerts a month. Six thousand two hundred and one are the licensed remote admin ' +
        'tool, ninety-six are the mail appliance, forty-three are shared hosting. Three are real ' +
        'and all three are on a box we already know about. So deploying the set adds nothing and ' +
        'buries us. That is not an argument against advisories: this one is what found the ' +
        'incident, as a single retrospective query. It is a hunt input, not a standing detection, ' +
        'and the backtest says so better than I can.',
      commandOptions: [
        { command: "awk -F, '{print $3}' /evidence/backtest/indicator-hits.csv | sort | uniq -c | sort -rn", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -vcf /evidence/backtest/explained.txt /evidence/backtest/indicator-hits.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /evidence/backtest/indicator-hits.csv', ...DUMP_ALL },
        { command: 'grep -c . /evidence/backtest/indicator-hits.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Backtest all forty-one indicators over ninety days and count what each one would have ' +
        'produced.',
      guidance:
        'Before deploying a feed, ask how many alerts a month it would add.',
    },
    {
      eventId: 'ev.10',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['malware-analyst', 'detection-engineer'],
      correctActions: ['act.dismiss', 'act.tune'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.declare', 'act.triage-high'],
      escalateTo: ['detection-engineer'],
      why:
        'The predictable thing has already happened, six hours before anybody warned about it. A ' +
        'rule from the advisory was deployed at 08:30 and has matched nine servers, all of which ' +
        'are running the licensed remote administration agent that the service desk installed ' +
        'between March and July with change records, from the vendor\'s signed installer, on the ' +
        'catalogue version. Two of the nine are domain controllers, which is the detail that makes ' +
        'this urgent rather than merely wrong: the standard response to a critical detection on a ' +
        'domain controller is isolation, and isolating two domain controllers on a Wednesday ' +
        'morning is an outage the whole society would feel, caused entirely by a correct response ' +
        'to a bad alert. Close all nine, raise the tuning ticket, and make sure the rule is ' +
        'stopped rather than just the alerts closed, because the next nine arrive tomorrow. The ' +
        'rule is not broken. It matches the product, and the product is ours.',
      standIn:
        'This has already started. The advisory rule went in at 08:30 and has matched nine servers, ' +
        'all running the licensed remote admin agent our own service desk installed between March ' +
        'and July, signed installer, catalogue version, change records for all of it. Two of them ' +
        'are domain controllers. Standard response to a critical on a domain controller is to ' +
        'isolate it, and isolating two DCs on a Wednesday morning takes the credit union down over a ' +
        'bad alert. Closing all nine and stopping the rule, not just the alerts, because otherwise ' +
        'there are nine more tomorrow.',
      commandOptions: [
        { command: "awk -F, '$3==\"SA-2026-114\" {print $2, $5}' /var/log/detection/alerts.csv | sort -u", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "remote-admin-agent" /var/log/change/deployments.csv | head', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/detection/alerts.csv', ...DUMP_ALL },
        { command: 'edr-cli isolate --host FCU-DC-01', ...MUTATE },
      ],
      commandNudge:
        'Check what is actually running on those nine servers and who put it there.',
      guidance:
        'Nine servers matched a rule you deployed this morning. Ask what the rule matches.',
    },
  ],
};
