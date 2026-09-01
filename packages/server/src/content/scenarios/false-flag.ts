/**
 * Scenario 16: Wrong Address.
 *
 * An intrusion built to be misread.
 *
 * WHAT THIS TEACHES
 *
 * That evidence is authored. Almost everything a floor works with is something
 * the attacker chose to leave: a filename, a timestamp, a language setting, a
 * tool with a reputation. All of those are cheap to fake and expensive to
 * doubt, because doubting them means giving up the tidy story.
 *
 * This scenario hands the floor an extremely tidy story. Four independent
 * signals point at a specific well-known kind of actor, they agree with each
 * other, and any one of them alone would be weak while all four together feel
 * conclusive. They are all planted. The evidence that is actually load-bearing
 * is the boring kind: what the intrusion DID, when, and in what order, because
 * behaviour under time pressure is far harder to fake than an artefact.
 *
 * THE SCORING INVERSION
 *
 * On four of these events the confident, specific, well-supported-feeling answer
 * scores badly and the cautious one scores well. That is deliberate and it is
 * the only scenario in the set where it is true. `act.attribute-named` is in
 * lane for nobody here as everywhere else, and the intel seat scores highest for
 * saying explicitly which signals are plantable and why the assessment does not
 * rest on them.
 *
 * IT IS STILL A REAL INTRUSION
 *
 * The misdirection is not the whole incident. Data genuinely left. A floor so
 * pleased with itself for spotting the false flags that it under-reports the
 * actual theft has failed differently and just as badly.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';

const ID = 'wrong-address';

export const WRONG_ADDRESS: Scenario = {
  id: ID,
  title: 'Wrong Address',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 10:30. Overnight something moved through the research network and took data out. The ' +
    'evidence is unusually clear and points somewhere specific. Establish what happened. Be ' +
    'careful about what you are being shown.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'threat-intel',
    'forensics',
    'fusion-analyst',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Large outbound transfer from the research file server at 02:40',
      detail:
        'A sustained transfer of 3.1 GB from rmg-res-01 to 198.51.100.44 between 02:40 and 03:26. ' +
        'The destination is an address in a hosting range. Normal outbound for this host is under ' +
        '80 MB a day. The transfer completed. Rule history: fired 5 times in thirty days, 4 closed ' +
        'as backup replication.',
      source: 'rmg-res-01',
      target: '198.51.100.44:443',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'host-artefact',
      summary: 'Toolset on the host carries a language resource and an off-hours build stamp',
      detail:
        'Three binaries recovered from the research server carry resource strings in a language ' +
        'not used in this organisation, and compiler timestamps clustered between 01:50 and 03:10 ' +
        'in a timezone eight hours ahead. The packer used is one publicly documented in four ' +
        'vendor reports as favoured by a specific named criminal group. The strings sit in a ' +
        'resource section no code path in the binaries references.',
      source: 'rmg-res-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'network-flow',
      summary: 'The destination address appears in a published report about that same group',
      detail:
        'The exfiltration address is listed as infrastructure in a vendor report on the named ' +
        'group, published nine months ago. The address is currently assigned to a hosting provider ' +
        'that reassigns addresses on a rolling basis. It has been reassigned twice since that ' +
        'report was published, most recently eleven days ago.',
      source: 'rmg-res-01',
      target: '198.51.100.44',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'raw-log',
      summary: 'Access to the research share required knowledge of an undocumented path',
      detail:
        'The session reached the exfiltrated dataset through a directory path that appears in no ' +
        'documentation, no wiki page and no ticket. The path is known to the four members of the ' +
        'research computing team and to nobody else. The session went to it directly with no ' +
        'enumeration and no wrong turns, seventeen seconds after authenticating.',
      source: 'rmg-res-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'process-tree',
      summary: 'Tooling invoked with parameters matching internal runbook syntax',
      detail:
        'The archiving and transfer commands use flag combinations and a naming convention that ' +
        'match the internal research computing runbook, including a non-obvious ordering that ' +
        'exists because of a local storage quirk. The runbook is on an internal wiki that requires ' +
        'authentication and has 31 readers in its access log over two years.',
      source: 'rmg-res-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'raw-log',
      summary: 'The session avoided three monitored directories and touched no honeypot file',
      detail:
        'The research share contains three directories under enhanced monitoring and eleven ' +
        'canary files placed in 2024. The session touched none of them, though two sit directly ' +
        'in the path it traversed. The monitoring configuration is not published and is visible ' +
        'only to security staff and the research computing team.',
      source: 'rmg-res-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'Threat feed reports increased activity from that named group this quarter',
      detail:
        'The subscription feed published a quarterly summary noting elevated activity attributed ' +
        'to the named group, with healthcare among the sectors mentioned. The summary is generic, ' +
        'covers a three-month period, and names eleven sectors. Rule history: this feed publishes ' +
        'a similar quarterly summary every quarter.',
      source: 'threat feed',
      claimedSeverity: 'low',
    },
  ],
};

export const WRONG_ADDRESS_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Somebody with detailed internal knowledge took 3.1 GB of research data overnight.',
    'They went straight to an undocumented path known to four people, seventeen seconds after authenticating, with no enumeration.',
    'They used command syntax matching an internal runbook that has 31 readers in two years.',
    'They avoided three monitored directories and eleven canary files whose locations are not published anywhere.',
    'They left binaries carrying a foreign language resource, off-hours build stamps, and a packer four vendor reports tie to a named criminal group.',
    'They sent the data to an address that appears in a published report about that group, and which the hosting provider reassigned to somebody else eleven days ago.',
    'The four signals pointing outward are cheap to plant and were planted. The three showing internal knowledge are behavioural and could not be.',
    'Who it was is not established tonight and the evidence does not support naming anybody. What is established is that the intrusion had inside knowledge of this organisation.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1041'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.isolate', 'act.declare'],
      escalateTo: ['network-analyst', 'ir-lead'],
      why:
        'Straightforward and worth taking quickly: 3.1 GB against an 80 MB daily baseline, ' +
        'completed, to a hosting address. Four of five previous firings were backup replication, ' +
        'and backup replication does not go to a hosting range at 02:40. Nothing about this row is ' +
        'a trap. It is here so the floor establishes early that a real theft happened, because ' +
        'everything after this is designed to pull attention toward who did it and away from what ' +
        'they took.',
      standIn:
        '3.1 GB out of the research file server between 02:40 and 03:26 against an 80 MB daily ' +
        'baseline. Completed. Destination is a hosting address, not our replication target. ' +
        'Raising it.',
      commandOptions: [
        'grep 198.51.100.44 /var/log/flows.log',
        "awk '$2==\"rmg-res-01\" {sum+=$6} END {print sum}' /var/log/flows.log",
        'cat /etc/backup/replication-targets.conf',
        'netstat -an | grep 443',
        'du -sh /mnt/research',
      ],
      commandNudge:
        'Check where our backup replication actually goes before accepting that explanation.',
      guidance:
        'Establish that something left and how much. Do that before anybody starts on who.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1036', 'T1027'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['threat-intel', 'forensics'],
      correctActions: ['act.decode', 'act.sandbox'],
      outOfLaneActions: ['act.attribute-named', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'threat-intel'],
      appearsToBe:
        'A specific named criminal group, on three signals that agree: foreign language resource ' +
        'strings, compiler timestamps inside that region working day, and a packer four vendor ' +
        'reports associate with them.',
      why:
        'Three signals agreeing feels like corroboration and is not, because all three come from ' +
        'the same source: the file, which the attacker controls. Take them one at a time. Language ' +
        'strings in a resource section that no code path references are not a by-product of ' +
        'compilation, they are cargo, and a compiler does not emit unreachable resources by ' +
        'accident. A build timestamp is a field, and it can be set. A documented packer is ' +
        'documented, which means anybody who read the report can use it, and a group whose tooling ' +
        'is described in four public reports is the easiest group in the world to imitate. Three ' +
        'plantable signals agreeing is not three times the evidence, it is one decision by one ' +
        'author. Analysing the binaries is right and the correct output is what they DO.',
      standIn:
        'Three binaries with foreign language resource strings, off-hours build stamps, and a ' +
        'documented packer tied to a named group. The strings are in a resource section nothing in ' +
        'the code reaches. I am reporting those as present, not as meaningful. What the binaries do ' +
        'is archive and transfer.',
      commandNudge:
        'Check whether anything in the binary actually reaches those strings.',
      guidance:
        'Ask of each signal whether it is a by-product of how the thing was built, or something ' +
        'somebody chose to put there.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1583.003'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.flow-map'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.isolate'],
      escalateTo: ['ir-lead'],
      appearsToBe:
        'Confirmation from an independent source, since the exfiltration address is named as that ' +
        'group infrastructure in a published vendor report.',
      why:
        'This is the signal that feels genuinely independent, and it is the weakest of the four. ' +
        'The report is nine months old, the hosting provider reassigns addresses on a rolling ' +
        'basis, and this one has been reassigned twice since, most recently eleven days ago. So the ' +
        'address in the report and the address in our logs are the same number and not the same ' +
        'thing. Addresses are the shortest-lived indicator there is, which is exactly why they age ' +
        'into false confirmation: they sit in reports long after they stop meaning anything. The ' +
        'check is one lookup of the reassignment history, and it takes a minute.',
      standIn:
        'The exfiltration address is in a nine-month-old vendor report about that group. The ' +
        'provider reassigns on a rolling basis and this address has been reassigned twice since, ' +
        'most recently eleven days ago. Same number, different tenant. It confirms nothing.',
      commandOptions: [
        'whois 198.51.100.44',
        'grep 198.51.100.44 /var/log/feeds/indicators.log',
        'dig -x 198.51.100.44',
        'cat /var/log/feeds/report-metadata.json | head -20',
        'ping -c1 198.51.100.44',
      ],
      commandNudge:
        'Check when that address was assigned to its current holder, and when the report was ' +
        'written.',
      guidance:
        'An address in an old report is a number, not a fingerprint. Find out who holds it now.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1078', 'T1083'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.isolate', 'act.reset-password'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'The first piece of evidence tonight that could not be planted, and it points the opposite ' +
        'way to everything else. An undocumented path known to four people, reached directly, ' +
        'seventeen seconds after authenticating, with no enumeration and no wrong turns. Nobody ' +
        'finds that by looking, and there is nothing to steal from a file to learn it. The ' +
        'distinction worth holding onto is that this is BEHAVIOUR under time pressure rather than ' +
        'an artefact, and behaviour is expensive to fake because faking it means actually knowing ' +
        'the thing. It does not name a person: internal knowledge can be held by an employee, a ' +
        'former employee, a contractor, or somebody who compromised one of the four. It does ' +
        'establish that this was not a stranger.',
      standIn:
        'The session went straight to an undocumented path, seventeen seconds after authenticating, ' +
        'no enumeration and no wrong turns. That path is in no documentation, wiki or ticket. Four ' +
        'people in research computing know it. That is inside knowledge, and it is the first thing ' +
        'tonight that could not have been planted.',
      commandOptions: [
        'grep rmg-res-01 /var/log/fileaccess.log | head -30',
        "awk '$4 ~ /research/ {print $1, $6}' /var/log/fileaccess.log | head -20",
        'ls -la /mnt/research/',
        'find /mnt/research -maxdepth 2 -type d',
        'grep -ri "archive-04" /var/wiki/ 2>/dev/null',
      ],
      commandNudge:
        'Look at how long the session spent finding the data, and whether it made any wrong turns.',
      guidance:
        'Ask whether somebody could have found this by looking. If not, ask how they knew.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1560.001'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['fusion-analyst', 'log-analyst'],
      correctActions: ['act.decode'],
      outOfLaneActions: ['act.attribute-named', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'The second unplantable signal, and the more specific of the two. Matching an internal ' +
        'runbook is one thing; reproducing a non-obvious flag ordering that exists only because of ' +
        'a local storage quirk is another, because that ordering is not something anybody would ' +
        'arrive at independently. It has to have been read. The wiki access log with 31 readers ' +
        'over two years turns a qualitative observation into a bounded set, which is what makes ' +
        'this useful rather than merely interesting. Worth stating clearly: this narrows, it does ' +
        'not identify, and one of those 31 accounts could itself be compromised.',
      standIn:
        'The archiving and transfer commands match our internal runbook, including a non-obvious ' +
        'flag ordering that only exists because of a local storage quirk. Nobody arrives at that ' +
        'independently. The wiki page has 31 readers in two years. That is a bounded set, not a ' +
        'name.',
      commandNudge:
        'Compare the command syntax used against our own documentation.',
      guidance:
        'Ask whether somebody could have guessed this syntax. If not, ask where they read it.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1562', 'T1083'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.isolate', 'act.declare', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The strongest evidence of the night and the hardest to see, because it is an absence. ' +
        'Eleven canary files and three monitored directories, two of them sitting directly in the ' +
        'path the session traversed, and none touched. Canaries exist precisely because an intruder ' +
        'cannot tell them apart from real files, so avoiding them cleanly is not luck at that hit ' +
        'rate: it requires knowing where they are, and that configuration is visible only to ' +
        'security staff and research computing. Reading an absence as evidence is a genuinely ' +
        'difficult habit and this is the event that teaches it. Note what it does to the ' +
        'attribution: three behavioural signals now all say internal knowledge, and they agree with ' +
        'each other while resting on different mechanisms, which is what corroboration actually ' +
        'looks like as opposed to the four planted signals that only agree because one person ' +
        'chose them.',
      standIn:
        'Eleven canary files and three monitored directories on that share. The session touched ' +
        'none of them and two sit directly in the path it walked. That configuration is not ' +
        'published and only security staff and research computing can see it. Avoiding all eleven ' +
        'is not luck.',
      commandNudge:
        'Check whether the session went near the monitored directories, not just whether it ' +
        'triggered them.',
      guidance:
        'Ask what the session did NOT touch, and whether avoiding it would take knowledge.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'threat-intel',
      alsoAppropriate: ['soc-operator', 'ir-lead'],
      correctActions: ['act.ttp-map', 'act.assess-actor'],
      outOfLaneActions: ['act.attribute-named', 'act.triage-high', 'act.isolate', 'act.declare'],
      escalateTo: [],
      appearsToBe:
        'Independent industry confirmation, since the feed reports elevated activity from the named ' +
        'group this quarter with healthcare among the sectors.',
      why:
        'The fourth planted-feeling signal, and this one the attacker did not even have to plant. ' +
        'It is a generic quarterly summary covering three months and naming eleven sectors, of the ' +
        'kind this feed publishes every quarter. It would be equally true of any incident at any ' +
        'healthcare organisation in that window, which means it distinguishes nothing and therefore ' +
        'evidences nothing. Its only function is to make the story feel externally validated at the ' +
        'moment the floor most wants validation. The correct output from this seat is the ATT&CK ' +
        'mapping and an actor-class assessment with its basis stated, plus an explicit list of ' +
        'which signals are plantable and why the assessment does not rest on them. Naming the group ' +
        'is the single worst available answer tonight, and it is the one four separate things on ' +
        'this board are pushing toward.',
      standIn:
        'The feed published its usual quarterly summary naming elevated activity from that group ' +
        'across eleven sectors including healthcare. It publishes one every quarter and it would ' +
        'fit any incident anywhere in that window. It confirms nothing. My assessment is that the ' +
        'outward-pointing signals are all plantable and three of them were planted, and that the ' +
        'behavioural evidence says inside knowledge. I am not naming anybody.',
      commandOptions: [
        'cat /var/log/feeds/quarterly-summary.txt | head -30',
        'grep -c "sector" /var/log/feeds/quarterly-summary.txt',
        'ls /var/log/feeds/quarterly-*',
        'grep -i healthcare /var/log/feeds/quarterly-summary.txt',
        'diff /var/log/feeds/quarterly-summary.txt /var/log/feeds/quarterly-prev.txt',
      ],
      commandNudge:
        'Check how specific that summary actually is, and how many sectors it names.',
      guidance:
        'Ask whether this report would be true of any incident this quarter. If it would, it is not ' +
        'evidence about yours.',
    },
  ],
};
