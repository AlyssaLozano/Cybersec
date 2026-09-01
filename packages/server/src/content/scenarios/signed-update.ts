/**
 * Scenario 14: Signed And Trusted.
 *
 * A monitoring platform update, correctly signed by its vendor, carrying
 * somebody else's code.
 *
 * HOW THIS DIFFERS FROM THIRD PARTY
 *
 * `third-party` compromises a dependency: a small package four levels down that
 * nobody chose deliberately, pulled in by a version range. The lesson there is
 * about what your build resolves without asking.
 *
 * This is the harder version. The vendor's own build system was compromised, so
 * the update is signed with the vendor's real key, distributed through the
 * vendor's real update channel, and matches the hash the vendor published. Every
 * verification the estate performs passes, because every verification is
 * verifying the wrong thing: signatures prove who built it, not whether their
 * build system was clean.
 *
 * WHY THE VICTIM SOFTWARE MATTERS
 *
 * It is the monitoring platform, which is deliberate. Monitoring agents run
 * everywhere, run as SYSTEM, are excluded from endpoint scanning to stop them
 * fighting each other, and are expected to talk to the internet constantly. That
 * combination is why this class of attack targets management software rather
 * than end user applications, and the floor should be able to say why.
 *
 * THE HARDEST PART IS NOT TECHNICAL
 *
 * It is that the correct action, disabling the monitoring platform estate-wide,
 * blinds the organisation at the moment it most needs visibility. There is no
 * clean answer, and `ev.6` is where the floor has to say that plainly to a lead
 * rather than pretending the decision is easy.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';

const ID = 'signed-and-trusted';

export const SIGNED_AND_TRUSTED: Scenario = {
  id: ID,
  title: 'Signed And Trusted',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 08:00. The monitoring platform auto-updated across the estate at 02:00 on Sunday, six ' +
    'days ago, exactly as it does every month. Every signature verified. Something has been ' +
    'different since, and the only reason anybody noticed is an unrelated network capacity review.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'vulnerability-analyst',
    'threat-intel',
    'forensics',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Capacity review flagged 340 hosts making an unexplained daily external connection',
      detail:
        'A network capacity review found that 340 monitoring agents each open one outbound ' +
        'connection a day to a domain not on the vendor documented endpoint list. Each transfers ' +
        'between 1 and 3 KB. The traffic is permitted because the monitoring platform holds a ' +
        'broad egress exception. This was raised as a capacity question, not a security one.',
      source: 'monitoring agents',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 150,
      surface: 'network-flow',
      summary: 'The destination domain was registered seven months ago and resolves to one host',
      detail:
        'The domain has existed for seven months with no content and one authoritative nameserver. ' +
        'Its naming closely resembles the vendor update infrastructure, differing by one word. ' +
        'Connections began at 02:40 last Sunday, forty minutes after the monthly update window, ' +
        'from every host that received the update and none that did not.',
      source: 'monitoring agents',
      target: '198.51.100.117:443',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 310,
      surface: 'host-artefact',
      summary: 'Update package signature and vendor published hash both verify correctly',
      detail:
        'The installed update package carries a valid signature from the vendor code signing ' +
        'certificate, which is not revoked. Its hash matches the value published on the vendor ' +
        'release page. The package was retrieved from the vendor genuine update endpoint. Every ' +
        'integrity check the platform performs passes.',
      source: 'rmg-mon-01',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 470,
      surface: 'process-tree',
      summary: 'A monitoring agent component loading a library not present in the previous release',
      detail:
        'The agent loads a signed library that appears in this release and in no earlier one. It ' +
        'is not referenced in the vendor release notes or the published file manifest. It runs ' +
        'inside the agent process, which executes as SYSTEM and is excluded from endpoint scanning ' +
        'by the vendor recommended configuration.',
      source: 'rmg-mon-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'raw-log',
      summary: 'Agent inventory queries returning far more than the platform records',
      detail:
        'Agent debug logs show inventory collection enumerating domain trust relationships, ' +
        'privileged group membership and installed security tooling. The monitoring platform ' +
        'database contains none of these fields and its schema has no place to store them. The ' +
        'queries run once every twenty-four hours, shortly before the outbound connection.',
      source: 'rmg-mon-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'The monitoring platform is the estate primary source of security telemetry',
      detail:
        'The affected platform collects and forwards the log data that feeds detection for 340 of ' +
        '351 servers, including authentication events and process telemetry. There is no secondary ' +
        'collection path. Disabling the agents removes the compromised code and simultaneously ' +
        'removes visibility across the server estate.',
      source: 'platform inventory',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'Vendor status page reports a service degradation on their update infrastructure',
      detail:
        'The vendor status page lists a partial degradation of update distribution affecting some ' +
        'customers in the last 24 hours, attributed to a content delivery configuration error and ' +
        'marked resolved. It carries no security notice. The degradation window does not overlap ' +
        'the monthly update six days ago. Rule history: this feed has raised 8 notices in thirty ' +
        'days, 8 closed as vendor operational.',
      source: 'vendor status feed',
      claimedSeverity: 'low',
    },
  ],
};

export const SIGNED_AND_TRUSTED_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Somebody compromised the monitoring vendor build system and added a library to a release before it was signed.',
    'The vendor signed it with their genuine key, published the hash, and distributed it through their real update channel.',
    'Every integrity check passed, because signatures prove who built something and not whether their build was clean.',
    'The added library runs inside the agent, which executes as SYSTEM and is excluded from endpoint scanning by the vendor own recommended configuration.',
    'It enumerates domain trusts, privileged groups and installed security tooling once a day, fields the monitoring database has nowhere to store.',
    'It sends 1 to 3 KB a day to a domain registered seven months ago, named to resemble the vendor update infrastructure.',
    'This is reconnaissance across 340 servers. Nothing else has happened yet, and the platform doing it is the estate only source of security telemetry.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1195.002', 'T1071.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.isolate', 'act.declare'],
      escalateTo: ['network-analyst', 'ir-lead'],
      why:
        'Another incident that arrives as an operational question rather than an alert, and this ' +
        'one is permitted traffic from trusted software so nothing was ever going to fire. The ' +
        'detail that makes it worth taking is small and specific: the destination is not on the ' +
        'vendor documented endpoint list. Management software talks to a published set of ' +
        'endpoints, that list exists precisely so customers can allowlist it, and a connection ' +
        'outside it is either undocumented vendor behaviour or not the vendor. Three hundred and ' +
        'forty hosts doing it identically also means this is configuration rather than compromise ' +
        'of any one host, which points at the software itself.',
      standIn:
        'Three hundred and forty monitoring agents each make one daily outbound connection to a ' +
        'domain that is not on the vendor documented endpoint list, 1 to 3 KB each. Permitted by ' +
        'the platform egress exception so nothing alerted. Raising it: that destination should not ' +
        'exist.',
      commandOptions: [
        "awk '/mon-agent/ {print $4}' /var/log/flows.log | sort | uniq -c | sort -rn | head",
        'grep -c 198.51.100.117 /var/log/flows.log',
        'cat /etc/monitoring/vendor-endpoints.txt',
        'systemctl status mon-agent',
        'netstat -an | grep 443',
      ],
      commandNudge:
        'Compare the destinations these agents use against the endpoint list the vendor publishes.',
      guidance:
        'Trusted software talks to a documented list of places. Ask what is on that list.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'command-and-control',
      techniques: ['T1583.001', 'T1071.001'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'malware-analyst'],
      why:
        'The correlation that settles it, and it needs no reverse engineering. Connections began at ' +
        '02:40 last Sunday, forty minutes after the monthly update window, from every host that ' +
        'received the update and none that did not. That is a controlled experiment the estate ran ' +
        'for free, and it ties the behaviour to the update rather than to anything else that ' +
        'happened that week. A domain registered seven months ago with no content and one ' +
        'nameserver is infrastructure prepared in advance, which is worth saying because it rules ' +
        'out opportunism. Naming it one word off the vendor update infrastructure is there for the ' +
        'engineer who glances at a firewall log.',
      standIn:
        'Destination is a domain registered seven months ago, no content, one nameserver, named one ' +
        'word off the vendor update infrastructure. Connections start 02:40 Sunday, forty minutes ' +
        'after the update window, from every host that took the update and no host that did not. ' +
        'It is the update.',
      commandOptions: [
        'whois 198.51.100.117',
        "awk '$4 ~ /198.51.100.117/ {print $2}' /var/log/flows.log | sort -u | wc -l",
        'grep "02:40" /var/log/flows.log | head -20',
        'dig +short mon-update-cdn.example',
        'cat /var/log/monitoring/update-history.log',
      ],
      commandNudge:
        'Find out when these connections started, and what else happened around that time.',
      guidance:
        'Compare the hosts doing this against the hosts that took the update. If the lists match, ' +
        'you have your answer.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.decode'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Every check passes and every check is telling the truth, which is why this is graded as a ' +
        'true positive rather than a failure. The signature is valid, the certificate is not ' +
        'revoked, the hash matches what the vendor published, and the package came from the vendor ' +
        'real endpoint. The mistake available here is enormous: concluding that because the ' +
        'integrity checks pass, the software is clean. A signature proves who built something. It ' +
        'proves nothing about whether their build system was clean when they built it, and a ' +
        'published hash proves only that the vendor published the hash of the thing they shipped. ' +
        'Everybody downstream verified correctly and everybody downstream got compromised.',
      standIn:
        'Signature is valid, certificate is not revoked, hash matches the vendor published value, ' +
        'and it came from their real endpoint. Every integrity check passes and every one is ' +
        'correct. That tells us who built it. It does not tell us their build was clean.',
      commandNudge:
        'Work out what a valid signature actually proves, and what it does not.',
      guidance:
        'The signature is real. Ask what question it answers, and whether that is the question you ' +
        'have.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1195.002', 'T1574.002'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['forensics', 'log-analyst'],
      correctActions: ['act.decode', 'act.sandbox'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'The concrete finding, reached by comparing the release against the previous one rather ' +
        'than by analysing anything. A signed library present in this release, absent from the ' +
        'last, missing from the release notes and missing from the vendor published file manifest. ' +
        'The manifest gap is the strongest part: the vendor documents what ships, and something ' +
        'shipped that they did not document, which means it was added after their process and ' +
        'before their signing. Then the three properties that make the monitoring platform the ' +
        'chosen target, and the floor should say all three out loud: it runs as SYSTEM, it is ' +
        'excluded from endpoint scanning on the vendor own advice, and it is expected to talk to ' +
        'the internet.',
      standIn:
        'The agent loads a signed library that exists in this release and no earlier one, and it is ' +
        'in neither the release notes nor the vendor file manifest. It runs inside the agent, which ' +
        'is SYSTEM and excluded from endpoint scanning on the vendor own recommendation.',
      commandOptions: [
        'diff <(ls /opt/monagent/lib-prev) <(ls /opt/monagent/lib)',
        'sigcheck /opt/monagent/lib/*.so',
        'cat /opt/monagent/MANIFEST.txt | grep -c .',
        'lsof -p $(pgrep mon-agent) | grep -i lib',
        'ps -ef | grep mon-agent',
      ],
      commandNudge:
        'Compare what files this release contains against the previous one and against the vendor ' +
        'manifest.',
      guidance:
        'Ask what is in this version that was not in the last one, and whether the vendor says it ' +
        'should be.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'reconnaissance',
      techniques: ['T1482', 'T1069.002', 'T1518.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.write-rule'],
      escalateTo: ['ir-lead', 'threat-intel'],
      why:
        'What is being collected, and the reasoning is unusually clean. The agent is querying ' +
        'domain trusts, privileged group membership and installed security tooling, and the ' +
        'monitoring database has no schema field for any of them. Data being collected that the ' +
        'product cannot store is data being collected for somebody else. The content also names ' +
        'the intent: trusts and privileged groups are how you plan lateral movement, and ' +
        'enumerating installed security tooling is how you plan to avoid it. This is target ' +
        'selection across 340 servers, and it means the intrusion is at its beginning rather than ' +
        'its end.',
      standIn:
        'Agent debug logs show it enumerating domain trusts, privileged group membership and ' +
        'installed security tooling, once a day, just before the outbound connection. The ' +
        'monitoring database has no field for any of that. It is being collected for somebody ' +
        'else, and it is how you plan movement and evasion.',
      commandOptions: [
        'grep -i "inventory" /var/log/monagent/debug.log | tail -30',
        "awk '/query/ {print $5}' /var/log/monagent/debug.log | sort -u",
        'cat /opt/monagent/schema/inventory.sql | head -40',
        'mysql -e "describe inventory" monitoring',
        'ls -la /var/log/monagent/',
      ],
      commandNudge:
        'Compare what the agent is collecting against what the platform database can actually store.',
      guidance:
        'Ask whether the product has anywhere to put this data. If it does not, somebody else is ' +
        'the customer.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1195.002'],
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.dismiss', 'act.power-off'],
      escalateTo: ['ir-lead'],
      why:
        'The event with no good answer, which is why it is on the board. The monitoring platform ' +
        'feeds detection for 340 of 351 servers and there is no secondary collection path, so ' +
        'disabling the agents removes the compromised code and blinds the estate in the same ' +
        'action. Leaving them running keeps visibility that is being produced by software an ' +
        'attacker controls, which is worse than no visibility because it is trusted. There is no ' +
        'version of this that is simply correct. What this seat owes the lead is the scope and the ' +
        'tradeoff stated plainly, not a recommendation dressed up as a fact, and the honest ' +
        'observation that having a single collection path was a decision made long before tonight.',
      standIn:
        'That platform is the collection path for 340 of 351 servers and there is no secondary. ' +
        'Turning the agents off removes the attacker code and takes our visibility with it. Leaving ' +
        'them up means our telemetry is produced by software somebody else controls. There is no ' +
        'clean option here and the lead needs to pick one.',
      commandNudge:
        'Find out what else collects security telemetry from those servers, if anything does.',
      guidance:
        'Ask what breaks if you remove it. Then say so plainly rather than recommending the tidy ' +
        'option.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.declare', 'act.attribute-named', 'act.isolate'],
      escalateTo: [],
      why:
        'A vendor status page notice about their update infrastructure, on the day the floor has ' +
        'concluded the vendor update infrastructure delivered compromised code. It is almost ' +
        'irresistible and it is unrelated: a content delivery configuration error, marked resolved, ' +
        'no security notice, and a window that does not overlap the update six days ago. The date ' +
        'check settles it in thirty seconds. Getting it wrong is expensive in a specific way, ' +
        'because a floor that treats this as vendor confirmation will report that the vendor has ' +
        'acknowledged a compromise. The vendor has acknowledged nothing, may not know yet, and ' +
        'telling a board otherwise is a statement that will be checked.',
      standIn:
        'Vendor status page has a degradation notice for update distribution, attributed to a CDN ' +
        'configuration error, marked resolved, no security notice. The window does not overlap our ' +
        'update six days ago. It is not confirmation of anything. Closing it.',
      commandOptions: [
        'cat /var/log/feeds/vendor-status.log | tail -20',
        "awk '/degradation/ {print $1, $2}' /var/log/feeds/vendor-status.log",
        'grep -i security /var/log/feeds/vendor-status.log',
        'cat /var/log/monitoring/update-history.log | tail -5',
        'date -d "6 days ago"',
      ],
      commandNudge:
        'Compare the dates on that notice against the date of the update you care about.',
      guidance:
        'Check whether the vendor is describing the same window you are investigating before you ' +
        'call it confirmation.',
    },
  ],
};
