/**
 * Scenario 08: Quiet Channel.
 *
 * Patient records leaving through DNS.
 *
 * WHY THIS ONE IS ITS OWN SCENARIO
 *
 * Every egress control in the estate assumes the data leaves over a connection
 * somebody can block. Proxies inspect web traffic, the firewall has an
 * allowlist, and the data loss tooling watches uploads. DNS goes around all of
 * it, because DNS has to work for anything else to work, so it is permitted from
 * everywhere by default and almost never inspected.
 *
 * The result is an exfiltration channel that produces no denied connection, no
 * proxy log entry, no DLP event and no unusual destination. What it produces is
 * a volume of perfectly ordinary lookups, and the only way to see it is to
 * compare that volume against what normal looks like. That comparison is the
 * whole scenario.
 *
 * THE HARD PART IS THE ARITHMETIC, NOT THE DETECTION
 *
 * Once somebody spots the query volume the floor will want to know how much
 * left. That is answerable, roughly, from query count times payload per query,
 * and doing it turns "suspicious DNS activity" into "approximately 40 MB, which
 * is about 12,000 patient records". Those two sentences produce completely
 * different responses from a hospital board, and only one of them is useful.
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
  WRONG_TARGET,
} from './distractors.js';

const ID = 'quiet-channel';

export const QUIET_CHANNEL: Scenario = {
  id: ID,
  title: 'Quiet Channel',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 15:40. The infrastructure team raised a capacity ticket because an internal DNS ' +
    'resolver has been running hot for three days and nobody can account for the load. It was ' +
    'sent to the SOC as a courtesy. Nothing has been blocked and nothing has alerted.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'threat-intel',
    'detection-engineer',
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
      summary: 'Internal DNS resolver query rate up 340 percent for three days',
      detail:
        'rmg-dns-01 has averaged 4.1 million queries a day since Saturday against a baseline of ' +
        '1.2 million. No errors, no failures, and response times are normal. Infrastructure ' +
        'raised it as a capacity question and asked whether anything was deployed recently. Rule ' +
        'history: this is a capacity ticket, not a detection, and no security rule has fired.',
      source: 'rmg-dns-01',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'network-flow',
      summary: 'Ninety-four percent of the additional queries resolve one parent domain',
      detail:
        'The excess traffic consists of lookups for subdomains of a single registered domain. Each ' +
        'query has a distinct 40 to 60 character label in front of it, and no label repeats. The ' +
        'domain was registered eleven days ago and its authoritative nameserver is a single host ' +
        'at 203.0.113.166. Responses are small and valid.',
      source: 'rmg-dns-01',
      target: '203.0.113.166:53',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'raw-log',
      summary: 'All the additional queries originate from one host, rmg-app-04',
      detail:
        'Resolver logs attribute 2.86 million of the 2.9 million excess queries to a single ' +
        'internal address, the clinical results application server. That host normally generates ' +
        'around 9,000 queries a day. The queries run continuously with no gaps longer than four ' +
        'seconds, including through the maintenance window when the application itself is stopped.',
      source: 'rmg-app-04',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'process-tree',
      summary: 'A long-running process on rmg-app-04 issuing DNS lookups directly',
      detail:
        'A process on the application server has been running since Saturday 02:10, started from a ' +
        'user shell rather than a service manager, and is making DNS requests through a library ' +
        'call rather than through the system resolver configuration. Its parent process has ' +
        'exited. It holds an open read handle on a directory of exported result files.',
      source: 'rmg-app-04',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'host-artefact',
      summary: 'Encoded label content decodes to fragments of exported patient result files',
      detail:
        'Decoding a sample of the query labels produces fragments of comma-separated records ' +
        'containing patient identifiers, test codes and dates, matching the export format used by ' +
        'the clinical results system. The fragments are sequential: reassembled in query order ' +
        'they form contiguous file content. Each query carries roughly 30 bytes of payload after ' +
        'encoding overhead.',
      source: 'rmg-app-04',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'network-flow',
      summary: 'No blocked connection, no proxy entry and no DLP event for this host in three days',
      detail:
        'The proxy has no log entries for rmg-app-04 since Friday. The firewall recorded no denied ' +
        'connections from it. Data loss prevention raised nothing. DNS is permitted outbound from ' +
        'every host in the estate by policy and the resolver forwards externally without ' +
        'inspection.',
      source: 'rmg-app-04',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'Threat feed matched 1,400 internal DNS queries against known bad domains',
      detail:
        'The subscription feed flagged 1,400 queries over the last week matching its malicious ' +
        'domain list. Review of the matches shows all 1,400 are advertising and tracking domains ' +
        'from staff browsing, categorised by the feed as unwanted rather than malicious. Rule ' +
        'history: fired 210 times in thirty days, 208 closed as adware.',
      source: 'threat feed',
      claimedSeverity: 'medium',
    },
  ],
};

export const QUIET_CHANNEL_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Somebody has code running on the clinical results application server, started Saturday at 02:10 from a shell.',
    'It reads exported patient result files and encodes them into DNS query labels, roughly 30 bytes at a time.',
    'Each query goes to a subdomain of a domain registered eleven days ago, whose nameserver logs the label and answers normally.',
    'Nothing is blocked, because DNS is permitted from every host by policy and the resolver forwards without inspection.',
    'Nothing is logged by the proxy or DLP, because the data never touches either.',
    'Three days at 2.86 million queries and about 30 bytes each is on the order of 80 MB of patient results.',
    'The only reason anybody looked is that the resolver ran hot enough for the infrastructure team to raise a capacity ticket.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1071.004'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.isolate', 'act.declare'],
      escalateTo: ['network-analyst', 'log-analyst'],
      why:
        'This did not arrive as a security alert. It arrived as a capacity ticket from a team ' +
        'asking a reasonable operational question, and there is no rule history to lean on because ' +
        'no rule fired. That is the shape of the whole scenario: the controls produced nothing ' +
        'because none of them look at DNS. What makes it worth taking is that a 340 percent step ' +
        'change with no deployment behind it is a change nobody can explain, and unexplained is ' +
        'the only category that matters at this stage. Treating operational tickets as ' +
        'potentially security relevant is a habit, and it is the one that saved this estate ' +
        'roughly seventy more megabytes.',
      standIn:
        'DNS resolver has been at 340 percent of baseline for three days with no errors and nobody ' +
        'can name a deployment that explains it. No security rule has fired on any of it. Taking it.',
      commandOptions: [
        { command: 'grep -c query /var/log/named/queries.log', ...COUNT_ONLY },
        { command: 'awk \'{print $1}\' /var/log/named/queries.log | uniq -c | tail -5', correct: true, teaches: CORRECT_STEP },
        { command: 'systemctl status named', ...STATUS_CHECK },
        { command: 'uptime', ...STATUS_CHECK },
        { command: 'df -h /var/log', ...STATUS_CHECK },
      ],
      commandNudge:
        'Establish what the normal query rate is before deciding whether this one matters.',
      guidance:
        'Not everything worth working arrives as an alert. Ask whether anybody can explain the ' +
        'change.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1071.004', 'T1568'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['threat-intel', 'detection-engineer'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'log-analyst'],
      why:
        'Three facts, and each one alone is explainable. One parent domain taking 94 percent of the ' +
        'excess could be a busy service. Long random labels could be a content delivery network. A ' +
        'domain registered eleven days ago could be a new supplier. Together they are only one ' +
        'thing: labels are the payload, and a label that never repeats is carrying different data ' +
        'each time rather than looking anything up. The single authoritative nameserver is the ' +
        'other tell, because real services do not run their DNS on one host. Worth saying plainly ' +
        'in the report that the responses are valid and normal, since that is exactly why nothing ' +
        'downstream noticed.',
      standIn:
        'Ninety-four percent of the extra queries are subdomains of one domain registered eleven ' +
        'days ago, each with a distinct 40 to 60 character label, none repeating. One authoritative ' +
        'nameserver. The labels are not lookups, they are cargo.',
      commandOptions: [
        { command: 'awk \'{print $NF}\' /var/log/named/queries.log | rev | cut -d. -f1-2 | rev | sort | uniq -c | sort -rn | head', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c 203.0.113.166 /var/log/named/queries.log', ...COUNT_ONLY },
        { command: 'dig @203.0.113.166 example.test', ...WRONG_TARGET },
        { command: 'whois 203.0.113.166', ...WRONG_TARGET },
        { command: 'netstat -an | grep :53', ...WRONG_TARGET },
      ],
      commandNudge:
        'Group the queries by parent domain and see how many distinct labels each one has.',
      guidance:
        'Ask whether these queries are looking something UP, or carrying something out. Repeated ' +
        'labels look up; unique ones do not.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1071.004'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.write-rule'],
      escalateTo: ['ir-lead', 'malware-analyst'],
      why:
        'One host, 2.86 million of 2.9 million, against a normal daily figure of 9,000. That ' +
        'narrows an estate-wide question to a single server in one query. The detail that settles ' +
        'what it is: the queries continue through the maintenance window, when the application on ' +
        'that host is stopped. Whatever is making them is not the application, so it is not a ' +
        'misconfiguration or a runaway feature, and that distinction is what turns this from a ' +
        'platform problem into an incident. Also worth stating in the report that it is the ' +
        'clinical results server, because what that host holds decides how urgent everything else ' +
        'is.',
      standIn:
        '2.86 million of the 2.9 million excess queries come from the clinical results application ' +
        'server, which normally does 9,000 a day. They keep going through the maintenance window ' +
        'when the app is stopped, so it is not the application making them.',
      commandOptions: [
        { command: 'awk \'{print $3}\' /var/log/named/queries.log | sort | uniq -c | sort -rn | head', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c rmg-app-04 /var/log/named/queries.log', ...COUNT_ONLY },
        { command: 'ping -c 2 rmg-app-04', ...TOUCH_ATTACKER },
        { command: 'nslookup rmg-app-04', ...WRONG_TARGET },
        { command: 'cat /etc/hosts', ...WRONG_TARGET },
      ],
      commandNudge:
        'Find which host is generating them, then check whether they stop when that host is idle.',
      guidance:
        'Ask whether the queries follow the application being up. If they do not, something else ' +
        'is making them.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1059', 'T1005'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['forensics', 'log-analyst'],
      correctActions: ['act.decode', 'act.sandbox'],
      outOfLaneActions: ['act.power-off', 'act.reimage-now', 'act.isolate'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'Four details and each one rules something out. Started from a user shell rather than a ' +
        'service manager, so nothing deployed it. Parent has exited, so nobody is supervising it ' +
        'and it will survive the session that started it. Making DNS calls through a library rather ' +
        'than the system resolver, which is how it bypasses anything configured at the host level. ' +
        'And an open read handle on the exported results directory, which is the sentence that ' +
        'tells the room what is leaving. Together they establish this is purpose-built rather than ' +
        'a tool somebody ran, and the read handle is why this stops being a network curiosity.',
      standIn:
        'Process on the app server since Saturday 02:10, started from a shell not a service ' +
        'manager, parent already exited, making DNS calls through a library rather than the system ' +
        'resolver. It is holding an open read handle on the exported results directory.',
      commandOptions: [
        { command: 'ps -ef --forest | head -40', ...WRONG_TARGET },
        { command: 'lsof -p $(pgrep -f dnsq) | head', correct: true, teaches: CORRECT_STEP },
        { command: 'ls -la /proc/*/cwd 2>/dev/null | head', ...WRONG_TARGET },
        { command: 'netstat -tulpn', ...WRONG_TARGET },
        { command: 'systemctl list-units --type=service | head', ...WRONG_TARGET },
      ],
      commandNudge: 'Find what files that process currently has open.',
      guidance:
        'A process is more than its name. Ask what started it, what it has open, and how it is ' +
        'making its network calls.',
    },
    {
      eventId: 'ev.5',
      critical: true,
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1132.001', 'T1030'],
      firstResponder: 'forensics',
      alsoAppropriate: ['malware-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'This is where the incident acquires a number, and the number is the deliverable. Decoding ' +
        'proves the labels are patient results rather than command traffic. Sequential fragments ' +
        'prove whole files rather than samples. And 30 bytes per query against 2.86 million queries ' +
        'a day for three days gives an order of magnitude that somebody can act on. A hospital ' +
        'board cannot do anything with "suspicious DNS activity"; it can do a great deal with ' +
        '"roughly 80 MB of clinical results, which is a notifiable breach". Preserve properly, ' +
        'because a regulator will want the basis for that estimate, and the estimate is only as ' +
        'good as the sample it came from.',
      standIn:
        'The query labels decode to fragments of exported patient result files, and they are ' +
        'sequential, so this is whole files rather than samples. About 30 bytes of payload per ' +
        'query. At 2.86 million queries a day for three days that is on the order of 80 MB of ' +
        'clinical results. Sample and method preserved and sealed.',
      commandNudge:
        'Decode a sample of the labels, then work out how much data one query actually carries.',
      guidance:
        'Once you know what is in it, work out how much. A number the business can act on is worth ' +
        'more than an adjective.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1071.004', 'T1562'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.dismiss', 'act.contact-attacker', 'act.isolate'],
      escalateTo: ['detection-engineer', 'ir-lead'],
      why:
        'An absence, reported as a finding, which is a thing analysts rarely think to do. Three ' +
        'days of continuous exfiltration produced no denied connection, no proxy entry and no DLP ' +
        'event, and none of those tools malfunctioned. They were all looking at channels the data ' +
        'never used. Reporting this correctly is what stops the debrief concluding that the ' +
        'controls failed, because they did not; the estate simply has no control on this path, and ' +
        'those are different problems with different fixes. It is also the strongest possible ' +
        'argument for the detection this scenario ends with.',
      standIn:
        'Three days of this and the proxy has nothing, the firewall denied nothing, and DLP raised ' +
        'nothing. None of them failed. DNS is permitted from every host by policy and the resolver ' +
        'forwards externally without inspection, so the data never went past any of them.',
      commandOptions: [
        { command: 'grep rmg-app-04 /var/log/proxy/access.log | wc -l', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c DENY /var/log/firewall/blocked.log', ...COUNT_ONLY },
        { command: 'cat /var/log/dlp/events.log | tail -20', ...WRONG_TARGET },
        { command: 'cat /etc/firewall/egress-policy.conf', ...WRONG_TARGET },
        { command: 'dig +short example.test', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check what the proxy, firewall and DLP recorded for this host over the same three days.',
      guidance:
        'Ask why nothing caught this. "The controls failed" and "no control watches this path" are ' +
        'different answers.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss', 'act.tune'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.decode'],
      escalateTo: [],
      why:
        'Fourteen hundred DNS queries matching a threat feed, on the day the floor is working DNS ' +
        'exfiltration. It is the most attractive wrong answer available and it is adware from staff ' +
        'browsing, categorised by the feed itself as unwanted rather than malicious. Two lessons ' +
        'sit here. A threat feed match is a starting point, not a verdict, and reading the ' +
        'category takes ten seconds. And the feed had nothing at all on the domain that actually ' +
        'mattered, because it was registered eleven days ago and nobody had reported it yet, which ' +
        'is precisely why reputation cannot be the only detection.',
      standIn:
        '1,400 threat feed matches this week, all advertising and tracking domains from staff ' +
        'browsing, categorised by the feed as unwanted rather than malicious. Same as 208 of the ' +
        'last 210. Not related to this, closing it. Worth noting the feed has nothing on the domain ' +
        'we actually care about.',
      commandOptions: [
        { command: 'grep -c MATCH /var/log/dns-feed/matches.log', ...COUNT_ONLY },
        { command: 'awk \'{print $5}\' /var/log/dns-feed/matches.log | sort | uniq -c | sort -rn | head', correct: true, teaches: CORRECT_STEP },
        { command: 'grep 203.0.113.166 /var/log/dns-feed/matches.log', correct: true, teaches: ALSO_WORKS },
        { command: 'cat /etc/feeds/subscription.conf', ...WRONG_TARGET },
        { command: 'systemctl status dns-feed', ...STATUS_CHECK },
      ],
      commandNudge: 'Look at what category the feed actually assigned those matches.',
      guidance:
        'Check what the feed says these domains ARE before you treat a match as a finding. Then ' +
        'check whether it has anything on the domain you care about.',
    },
  ],
};
