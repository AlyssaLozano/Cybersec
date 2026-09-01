/**
 * Scenario 65: Not On The List.
 *
 * Something is beaconing out of a server that does not exist, on an estate that
 * is 98.2 per cent patched.
 *
 * WHAT THIS TEACHES
 *
 * That a compliance percentage is a statement about a denominator, and that
 * nobody checks the denominator.
 *
 * The figure is not a lie and it is not a measurement either. Four hundred of
 * the 3,100 assets in the inventory were decommissioned and never removed, and
 * because the scanner cannot reach them it records them as having no findings,
 * which the reporting counts as compliant. Ninety hosts that genuinely exist
 * are absent from the inventory entirely, so they are neither scanned nor
 * counted, and one of them has been reachable from the internet since 2024
 * running an operating system that left support in 2023.
 *
 * The error runs in both directions at once, which is why nobody spotted it:
 * the phantom hosts make compliance look better and the missing hosts make the
 * estate look smaller, and the two together produce a number that looks
 * plausible and healthy.
 *
 * WHAT THIS SEAT IS ACTUALLY FOR
 *
 * Not counting patches. The interesting work in vulnerability management is
 * establishing what exists, what it can reach, what can reach it, and who would
 * notice if it stopped, and none of that is in a scan report.
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

const ID = 'not-on-the-list';

export const NOT_ON_THE_LIST: Scenario = {
  id: ID,
  title: 'Not On The List',
  difficulty: 'advanced',
  durationMinutes: 75,
  situation:
    'It is 15:40 at Ridgeline Medical Group. A host nobody can identify has been talking to the ' +
    'same external address every eleven minutes since Sunday.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'vulnerability-analyst',
    'forensics',
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
      summary: 'Regular outbound connections from an address with no asset record',
      detail:
        'An internal address has connected to 198.51.100.77 every 11 minutes since Sunday 03:20, ' +
        'sending 900 to 1,100 bytes each time and receiving between 200 bytes and 400 kilobytes. ' +
        'The asset lookup returns no record for the address. The alert has been reassigned twice ' +
        'because neither the server team nor the network team recognises it. Rule history: fired ' +
        '17 times in thirty days, 16 closed as approved integrations.',
      source: 'unidentified host',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 160,
      surface: 'host-artefact',
      summary: 'The host is real, has been on the network for fourteen months, and is not inventoried',
      detail:
        'The address resolves in internal DNS to rmg-res-07.ridgeline.nhs.uk, a record created on ' +
        '4 July 2025. Switch port records show the same MAC address on the same port in the ' +
        'research wing since then, with no gap. It answers on ports 22, 443 and 3389. It does not ' +
        'appear in the asset inventory, has never been scanned, and no configuration management ' +
        'agent or endpoint agent has ever reported from it.',
      source: 'rmg-res-07',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'raw-log',
      summary: 'It was built by a research group and announced to nobody',
      detail:
        'The DNS record was created by an account belonging to a research software engineer in the ' +
        'clinical trials unit, who left in March 2025. The purchase appears in the finance system ' +
        'against a grant code, not against the IT capital budget, so it never entered the asset ' +
        'onboarding process. There is no ticket, no change record, and no build documentation. The ' +
        'grant closed in January.',
      source: 'rmg-res-07',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 480,
      surface: 'host-artefact',
      summary: 'Out of support since 2023, sixty-one open issues, and reachable from the internet',
      detail:
        'The host runs an operating system release that left vendor support in October 2023. An ' +
        'authenticated check finds 61 unpatched issues of which 9 are remotely exploitable without ' +
        'authentication. Firewall rule FW-8841, created on 12 March 2024 and described as ' +
        '"temporary, external collaborator access, remove after study visit", permits inbound 443 ' +
        'and 3389 from any source. The rule has no expiry date and no review record.',
      source: 'rmg-res-07',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 640,
      surface: 'alert-queue',
      summary: 'The estate is 98.2 per cent patched and the denominator is wrong twice',
      detail:
        'The monthly report states 3,100 assets at 98.2 per cent compliance. Reconciliation against ' +
        'the decommissioning log finds 400 of those assets destroyed or returned between 2023 and ' +
        '2025 and never removed from the inventory. The scanner cannot reach them, records zero ' +
        'findings, and the reporting scores zero findings as compliant. Separately, comparison ' +
        'against network records finds 90 live hosts absent from the inventory altogether.',
      source: 'vulnerability management',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 800,
      surface: 'network-flow',
      summary: 'Ninety hosts exist that nothing is watching',
      detail:
        'Comparing DHCP leases, switch MAC address tables and DNS records against the asset ' +
        'inventory returns 90 addresses with sustained network presence and no asset record. ' +
        'Thirty-one respond to a connection attempt on at least one service port. Fourteen are in ' +
        'the research wing, nine in estates and facilities, six in the pathology laboratory, and ' +
        'two are on the segment carrying the pharmacy stock system.',
      source: 'network inventory',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 960,
      surface: 'host-artefact',
      summary: 'The intruder has been on it since Sunday and has not left it',
      detail:
        'A service was installed at 03:14 on Sunday and starts the beaconing process at boot. Shell ' +
        'history shows the operator listing local directories, reading a database configuration ' +
        'file, and running a network sweep of the local segment that produced 40 responses. There ' +
        'is no evidence of authentication to any other host. The database on this server holds a ' +
        'trial randomisation table and a participant identifier mapping.',
      source: 'rmg-res-07',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1120,
      surface: 'cloud-audit',
      summary: 'Nineteen other temporary firewall rules have no expiry',
      detail:
        'FW-8841 was requested by the same research software engineer through the standard form, ' +
        'approved by a network engineer who no longer works here, and implemented the same day. ' +
        'The form has a field for a removal date; it was left blank and nothing requires it. A ' +
        'review of the ruleset finds 19 further rules described as temporary, trial, or pilot, the ' +
        'oldest dating from 2019, none with an expiry date.',
      source: 'firewall management',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1280,
      surface: 'alert-queue',
      summary: 'The server randomises an open trial and nobody else holds the table',
      detail:
        'RMG-RES-07 runs the randomisation service for an open interventional trial with 214 ' +
        'participants, 61 of them mid-protocol. Randomisation must be reproducible and auditable ' +
        'for the trial to remain valid. The chief investigator confirms there is no second copy of ' +
        'the allocation table and no documented recovery procedure. Recruitment visits are ' +
        'scheduled for tomorrow morning. The trial sponsor must be notified of any data incident ' +
        'within 72 hours.',
      source: 'clinical trials unit',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.10',
      atSeconds: 1440,
      surface: 'raw-log',
      summary: 'The scanner scores what it cannot see as clean',
      detail:
        'The vulnerability platform records an unreachable target as a completed scan with zero ' +
        'findings, and the compliance calculation counts zero findings as compliant. It has no ' +
        'concept of an asset it has never seen. Coverage is measured as the proportion of ' +
        'inventory scanned, which is 100 per cent, rather than the proportion of the network ' +
        'scanned, which nothing measures. No alert exists for a host appearing on the network with ' +
        'no asset record.',
      source: 'detection coverage',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.11',
      atSeconds: 1600,
      surface: 'alert-queue',
      summary: 'A second unidentified host is flagged during the sweep',
      detail:
        'The reconciliation flags an address with no asset record making outbound connections to ' +
        'four external addresses. It is on the guest wireless network, which is a separate ' +
        'segment with no route to any clinical or corporate system, holds a lease issued at 09:12 ' +
        'today to a device that authenticated with a contractor visitor code, and the four ' +
        'destinations are a software vendor\'s update service. Guest devices are not inventoried ' +
        'by design.',
      source: 'guest wireless',
      claimedSeverity: 'medium',
    },
  ],
};

export const NOT_ON_THE_LIST_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'In July 2025 a research software engineer in the clinical trials unit built a server, registered it in DNS, and plugged it into a switch port in the research wing. It was bought on a grant code rather than the IT capital budget, so it never entered asset onboarding. He left in March 2025 and the grant closed in January.',
    'In March 2024 the same engineer requested firewall rule FW-8841 permitting inbound 443 and 3389 from any source, described as temporary and to be removed after a study visit. The removal date field on the form was left blank, nothing requires it, and the approving network engineer has also left.',
    'The host runs an operating system that left vendor support in October 2023 and carries 61 unpatched issues, 9 of them remotely exploitable without authentication.',
    'On Sunday at 03:14 somebody installed a service on it that beacons to an external address every eleven minutes at boot. They listed directories, read a database configuration file and swept the local segment, which returned 40 responses. They have not authenticated to any other host.',
    'The database on that server holds the randomisation table and participant identifier mapping for an open interventional trial with 214 participants, 61 mid-protocol. There is no second copy of the allocation table and no documented recovery procedure.',
    'The monthly report says 3,100 assets at 98.2 per cent compliance. Four hundred of those assets were destroyed or returned between 2023 and 2025 and never removed; the scanner cannot reach them, records zero findings, and zero findings is scored as compliant.',
    'Ninety live hosts are absent from the inventory altogether, of which 31 answer on a service port. Two of them sit on the segment carrying the pharmacy stock system.',
    'Nineteen further firewall rules are described as temporary, trial or pilot, the oldest from 2019, and none has an expiry date.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'command-and-control',
      techniques: ['T1071.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['network-analyst', 'vulnerability-analyst'],
      why:
        'Sixteen of seventeen were approved integrations, and the one fact that separates this from ' +
        'those sixteen is not in the traffic at all: the asset lookup returns nothing. An approved ' +
        'integration has an owner, a record and a ticket, and the reason this alert has been ' +
        'reassigned twice is that the two teams who would normally own it correctly do not ' +
        'recognise the host. That reassignment is the finding rather than an administrative ' +
        'annoyance, and the queue is about to send it round a third time. Regular eleven minute ' +
        'intervals with a small request and a variable response is the shape of something checking ' +
        'in for instructions. Declare on it, because an unowned host beaconing since Sunday is ' +
        'four days of something nobody can account for.',
      standIn:
        'Every eleven minutes since Sunday, small out, variable back, and the asset lookup returns ' +
        'nothing. Sixteen of the last seventeen of these were approved integrations, and approved ' +
        'integrations have owners and tickets. This has been reassigned twice because neither the ' +
        'server team nor the network team recognises it, and that is the finding, not an ' +
        'annoyance. Declaring.',
      commandOptions: [
        { command: "awk '$5==\"198.51.100.77\" {print $1, $3, $7, $8}' /var/log/flows.log | head -30", correct: true, teaches: CORRECT_STEP },
        { command: 'grep 198.51.100.77 /var/log/flows.log | awk \'{print $1}\' | uniq -c | head', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status firewall', ...STATUS_CHECK },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'nmap -Pn 198.51.100.77', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Look up the asset record for the internal address before you look at the traffic.',
      guidance:
        'Two teams have already said it is not theirs. Ask whose it is.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'discovery',
      critical: true,
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.scope-estate', 'act.investigate-hold'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.dismiss', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'The host is not unknown in the sense of being hidden. It has a DNS record created in July ' +
        '2025, it has sat on one switch port in the research wing since then with no gap, and it ' +
        'answers on three service ports. Everything about it is visible to anybody who looked, and ' +
        'nothing looked, because the inventory is where looking starts and it is not in the ' +
        'inventory. That is the distinction worth being precise about in the readout: this is not ' +
        'a stealthy asset, it is an unenrolled one, and the difference decides whether the remedy ' +
        'is better detection or a different process. No scanner has ever touched it, no ' +
        'configuration management agent has ever reported from it, and no endpoint agent exists on ' +
        'it, so every control this trust operates has a hole exactly the shape of this machine. ' +
        'Do not pull it off the network yet; nobody knows what it does.',
      standIn:
        'It is real and it is not hidden. DNS record from July 2025, same MAC on the same research ' +
        'wing port ever since with no gap, answering on 22, 443 and 3389. Anybody who looked would ' +
        'have seen it, and nothing looked, because looking starts at the inventory and it is not ' +
        'in the inventory. Never scanned, no config management agent, no endpoint agent. Every ' +
        'control we run has a hole the exact shape of this box. Nobody unplugs it until we know ' +
        'what it does.',
      commandOptions: [
        { command: "awk -F, '$2==\"10.44.9.31\"' /var/log/assets/inventory.csv || echo 'no asset record'", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "rmg-res-07" /var/log/dns/zone-changes.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status asset-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/assets/inventory.csv', ...DUMP_ALL },
        { command: 'nmap -sS 10.44.9.31', ...WRONG_TARGET },
      ],
      commandNudge:
        'Find out how long that host has been on the network and whether anything has ever scanned ' +
        'it.',
      guidance:
        'Nobody recognises it. Ask how long it has been there.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'discovery',
      firstResponder: 'log-analyst',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.reset-password'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'Nobody hid this and nobody broke a rule, which is the part that makes it hard to fix. A ' +
        'research software engineer built a server, registered it in DNS with his own account, and ' +
        'plugged it in. The purchase went through the finance system against a grant code rather ' +
        'than the IT capital budget, and asset onboarding is triggered by the capital budget, so ' +
        'the process was never reached rather than avoided. He left in March 2025 and the grant ' +
        'closed in January, which means the machine has had no owner for six months and no funded ' +
        'owner for eight. There is no ticket, no change record and no build documentation, so ' +
        'nobody currently alive at this trust knows what is on it. Treat the procurement route as ' +
        'the finding rather than the individual: anything bought on a grant enters the estate ' +
        'invisibly, and there are a lot of grants.',
      standIn:
        'Nobody hid it and nobody broke a rule. He built it, registered the DNS himself, plugged it ' +
        'in. It was bought on a grant code and asset onboarding triggers off the capital budget, ' +
        'so the process was never reached rather than dodged. He left in March 2025, the grant ' +
        'closed in January, so it has had no owner for six months. No ticket, no change record, no ' +
        'build documentation, and nobody here knows what is on it. The finding is the procurement ' +
        'route, not the man, and there are a lot of grants.',
      commandOptions: [
        { command: 'grep -i "rmg-res-07" /var/log/dns/zone-changes.log /var/log/dhcp/leases.log', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$5 ~ /GRANT/ && $6 ~ /hardware/ {print $1, $3, $5}' /var/log/finance/purchases.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status named', ...STATUS_CHECK },
        { command: 'cat /var/log/dhcp/leases.log', ...DUMP_ALL },
        { command: 'grep -c res-07 /var/log/dns/zone-changes.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find who created the DNS record and how the hardware was paid for.',
      guidance:
        'Somebody built this. Ask who, and why it never reached the asset process.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1190'],
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.scope-estate', 'act.corroborate'],
      outOfLaneActions: ['act.reimage-now', 'act.isolate', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Out of support since October 2023, 61 unpatched issues with 9 remotely exploitable ' +
        'without authentication, and a firewall rule permitting 443 and 3389 inbound from any ' +
        'source since March 2024. Those three facts together mean this did not require an attacker ' +
        'with any particular skill or interest in Ridgeline; it required somebody scanning the ' +
        'internet, which happens continuously. Read the rule description carefully, because it is ' +
        'the most useful sentence in the incident: temporary, external collaborator access, remove ' +
        'after study visit. Somebody wrote down that it should be removed, meant it, and there was ' +
        'no mechanism to make it happen. The remedy that follows is not a patching remedy. This ' +
        'machine cannot be patched to a supported state, so the question is what it is allowed to ' +
        'reach and what is allowed to reach it, and that question was answered in 2024 by a form ' +
        'with an optional field.',
      standIn:
        'Out of support since October 2023, 61 unpatched issues, 9 of them remote with no ' +
        'authentication, and a rule allowing 443 and 3389 inbound from anywhere since March 2024. ' +
        'Nobody had to choose us for this, they had to scan the internet. And read the rule ' +
        'description: temporary, external collaborator access, remove after study visit. Somebody ' +
        'wrote down that it should go and there was no mechanism to make that happen. This box ' +
        'cannot be patched to a supported state, so the whole question is what it can reach and ' +
        'what can reach it.',
      commandOptions: [
        { command: "awk -F, '$2==\"FW-8841\" {print $3, $4, $5, $7}' /var/log/firewall/rules.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c "CVE-" /evidence/res07/authenticated-scan.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status firewall', ...STATUS_CHECK },
        { command: 'cat /evidence/res07/authenticated-scan.txt', ...DUMP_ALL },
        { command: 'iptables -D INPUT -p tcp --dport 3389 -j ACCEPT', ...MUTATE },
      ],
      commandNudge:
        'Find out what the operating system version is and whether anything can reach the host from ' +
        'outside.',
      guidance:
        'Unpatched only matters if something can reach it. Go and find out whether anything can.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.scope-estate', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.reimage-now', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'detection-engineer'],
      why:
        'Ninety-eight point two per cent of the wrong number, and the error runs both ways at once, ' +
        'which is why it has survived years of monthly reporting. Four hundred of the 3,100 assets ' +
        'were destroyed or returned between 2023 and 2025 and never removed. The scanner cannot ' +
        'reach them, records a completed scan with zero findings, and zero findings is scored as ' +
        'compliant, so an eighth of the estate is contributing a perfect score by not existing. ' +
        'Separately 90 live hosts are absent from the inventory, so they are neither scanned nor ' +
        'counted and cannot lower the figure however bad they are. Phantom hosts push the ' +
        'percentage up and missing hosts keep the estate looking small, and the two together ' +
        'produce a number that looks plausible and healthy, which is precisely why nobody has ever ' +
        'questioned it. Say the sentence that matters: the figure is not a measurement of the ' +
        'estate, it is a measurement of the inventory, and nothing at this trust measures the ' +
        'estate.',
      standIn:
        'Ninety-eight point two per cent of the wrong number, and it is wrong in both directions. ' +
        'Four hundred of the 3,100 were destroyed or returned and never removed, and the scanner ' +
        'cannot reach them, so it records zero findings and zero findings counts as compliant. An ' +
        'eighth of our estate is contributing a perfect score by not existing. And 90 live hosts ' +
        'are not in the inventory at all, so nothing they do can lower the number. One error ' +
        'pushes the figure up, the other keeps the estate looking small, and together they produce ' +
        'something plausible enough that nobody has ever asked. That number measures the ' +
        'inventory, not the estate, and nothing here measures the estate.',
      commandOptions: [
        { command: "comm -12 <(sort /evidence/assets/inventory-ids.txt) <(sort /evidence/assets/decommissioned-ids.txt) | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$5==\"UNREACHABLE\" {c++} END {print c}' /var/log/vulnmgmt/scan-results.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status vulnscan', ...STATUS_CHECK },
        { command: 'cat /var/log/vulnmgmt/scan-results.csv', ...DUMP_ALL },
        { command: 'grep -c . /evidence/assets/inventory-ids.txt', ...COUNT_ONLY },
      ],
      commandNudge:
        'Compare the inventory against the decommissioning log, and find out how an unreachable ' +
        'host is scored.',
      guidance:
        'The estate is 98 per cent compliant. Ask what the other number in that fraction is.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'discovery',
      critical: true,
      firstResponder: 'network-analyst',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.scope-estate'],
      outOfLaneActions: ['act.isolate', 'act.contact-attacker', 'act.dismiss', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'One unowned host becomes ninety, and the method matters as much as the number because it ' +
        'is repeatable next month. DHCP leases, switch MAC address tables and DNS records against ' +
        'the asset inventory, which is three sources the trust already has and has never joined. ' +
        'Thirty-one of the ninety answer on a service port, so they are running something rather ' +
        'than simply being plugged in. The distribution is the part to carry into the readout: ' +
        'fourteen in the research wing and nine in estates and facilities are unsurprising, and ' +
        'six in the pathology laboratory and two on the pharmacy stock system segment are not, ' +
        'because those are clinical segments where an unowned host is a patient safety question ' +
        'rather than a governance one. Resist scanning them all immediately; several are likely to ' +
        'be equipment that responds badly to being probed, and finding that out at four in the ' +
        'afternoon by breaking one is a poor trade.',
      standIn:
        'One becomes ninety. DHCP leases, switch MAC tables and DNS against the asset inventory, ' +
        'which is three sources we already have and have never joined up, and it is repeatable ' +
        'every month. Thirty-one of the ninety answer on a service port, so they are running ' +
        'something. Fourteen in research and nine in estates I expected. Six in the pathology lab ' +
        'and two on the pharmacy stock segment I did not, and on clinical segments an unowned host ' +
        'is a safety question. I am not scanning all ninety this afternoon; some of that kit does ' +
        'not like being probed.',
      commandOptions: [
        { command: "comm -23 <(awk -F, '{print $2}' /var/log/dhcp/leases.csv | sort -u) <(awk -F, '{print $2}' /var/log/assets/inventory.csv | sort -u)", correct: true, teaches: CORRECT_STEP },
        { command: "awk '{print $2}' /var/log/switch/mac-table.log | sort -u | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -sS 10.44.0.0/16', ...WRONG_TARGET },
        { command: 'cat /var/log/dhcp/leases.csv', ...DUMP_ALL },
        { command: 'grep -c . /var/log/switch/mac-table.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Join what the network knows is present against what the inventory says exists.',
      guidance:
        'You found one host nobody knew about. Ask how you would find the rest.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      techniques: ['T1543', 'T1046'],
      firstResponder: 'forensics',
      alsoAppropriate: ['ir-lead', 'network-analyst'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Four days inside and they have not moved, which is the most useful fact available and the ' +
        'easiest to misread. A service installed at 03:14 on Sunday that starts the beacon at ' +
        'boot, directory listings, a database configuration file read, and a sweep of the local ' +
        'segment returning 40 responses. No authentication to any other host, so the intrusion is ' +
        'currently one machine and the sweep is the shape of somebody who has arrived somewhere ' +
        'unexpected and is working out what they have. What they have is worse than a random ' +
        'server: the database holds a trial randomisation table and a participant identifier ' +
        'mapping, which is directly identifying information about 214 people who consented to ' +
        'something on the understanding it would be handled properly. Preserve before anything ' +
        'else happens, because the pressure over the next hour will be to clean the machine and ' +
        'restore the trial, and the shell history is the only record of what was read.',
      standIn:
        'Four days in and they have not moved off it. Service installed 03:14 Sunday, beacons at ' +
        'boot, directory listings, read a database config file, swept the local segment and got 40 ' +
        'responses. No authentication to any other host, so this is one machine and that sweep is ' +
        'somebody working out where they have landed. What they landed on holds a trial ' +
        'randomisation table and the participant identifier mapping, which is directly identifying ' +
        'data on 214 people who consented on the understanding it would be handled properly. I am ' +
        'preserving now, because the pressure in an hour will be to clean it and get the trial ' +
        'running.',
      commandOptions: [
        { command: 'cat /evidence/res07/root-bash-history && ls -la /evidence/res07/systemd-units/', correct: true, teaches: CORRECT_STEP },
        { command: 'sha256sum /evidence/res07/disk.img | tee /evidence/res07/disk.img.sha256', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status beacond', ...STATUS_CHECK },
        { command: 'cat /evidence/res07/disk.img', ...DUMP_ALL },
        { command: 'systemctl disable --now beacond', ...MUTATE },
      ],
      commandNudge:
        'Establish what the operator did on the host and whether they reached any other machine.',
      guidance:
        'They have been there four days. Ask where else they went.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      firstResponder: 'cloud-security',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.scope-estate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.revoke-key'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'The rule was requested properly, approved properly and implemented properly, and the form ' +
        'has a removal date field that nothing requires. That is the whole mechanism, and the ' +
        'nineteen other rules are the proof that it is a mechanism rather than an accident: ' +
        'temporary, trial and pilot rules going back to 2019, none with an expiry, all of them ' +
        'created by people who intended them to be short-lived. Both the requester and the ' +
        'approver have left, which is the second half of it, because a temporary control depends ' +
        'on somebody remembering and remembering does not survive staff turnover. This is the ' +
        'finding with the longest life in the readout. One unowned server is an incident and can ' +
        'be fixed tonight; an optional expiry field on a firewall request form has been quietly ' +
        'accumulating permanent holes for seven years, and every one of them is pointed at ' +
        'something somebody once cared about.',
      standIn:
        'It was requested properly, approved properly and implemented the same day. The form has a ' +
        'removal date field and nothing requires it. That is the whole mechanism, and the nineteen ' +
        'other temporary rules going back to 2019 prove it is a mechanism and not an accident. ' +
        'Both the requester and the approver have left, and a temporary control that depends on ' +
        'somebody remembering does not survive people leaving. The server is tonight. An optional ' +
        'expiry field has been making permanent holes for seven years.',
      commandOptions: [
        { command: "awk -F, 'tolower($5) ~ /temporary|trial|pilot/ {print $2, $3, $5}' /var/log/firewall/rules.csv", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$6==\"\" {print $2, $3}' /var/log/firewall/rules.csv | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status firewall', ...STATUS_CHECK },
        { command: 'cat /var/log/firewall/rules.csv', ...DUMP_ALL },
        { command: 'grep -c ACCEPT /var/log/firewall/rules.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Search the ruleset for other rules described as temporary and check their expiry dates.',
      guidance:
        'This rule was meant to be temporary. Ask how many others were.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'collection',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.power-off', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'The obvious action is to unplug an unowned, unpatched, internet-exposed, compromised server ' +
        'and it is very nearly right. What stops it is that this machine randomises an open ' +
        'interventional trial with 61 participants mid-protocol, randomisation has to be ' +
        'reproducible and auditable for the trial to remain valid, there is no second copy of the ' +
        'allocation table and no documented recovery procedure. Pulling the cable without ' +
        'preserving that data properly does not delay a trial, it can invalidate it, and 214 ' +
        'people consented to something that then produces no usable answer. So the sequence is: ' +
        'remove FW-8841 first, which takes the internet off it and stops the exposure without ' +
        'touching the service; then take a forensic image and a verified copy of the database with ' +
        'the trials unit present so the copy is auditable; then move the randomisation service to ' +
        'a managed host before tomorrow\'s recruitment visits, or agree with the chief investigator ' +
        'that visits are deferred, which is their decision and not this floor\'s. The compensating ' +
        'control while it stays up is segment isolation rather than host isolation: it needs to ' +
        'serve the trials unit and nothing else, and it has already swept the local segment once. ' +
        'Left undone tonight: 89 other unowned hosts, of which two are on the pharmacy stock ' +
        'segment, and the 72 hour sponsor notification clock started on Sunday whether or not ' +
        'anybody knew.',
      standIn:
        'Do not pull the cable, and I nearly said pull it. That box randomises an open trial with 61 ' +
        'participants mid-protocol, randomisation has to be reproducible and auditable for the ' +
        'trial to stand, and there is no second copy of the allocation table and no recovery ' +
        'procedure. Unplugging it badly does not delay a trial, it can invalidate one. Order: kill ' +
        'FW-8841 first, which takes the internet away and touches nothing else. Then image it and ' +
        'take a verified copy of the database with the trials unit in the room so the copy is ' +
        'auditable. Then either move the service to a managed host before tomorrow\'s visits or the ' +
        'chief investigator defers the visits, which is their call. Meanwhile isolate the segment, ' +
        'not the host, because it has already swept that segment once. Left undone: 89 other ' +
        'unowned hosts and two of them are on the pharmacy segment, and the sponsor clock started ' +
        'on Sunday.',
      commandNudge:
        'Find out what that server does for the organisation before you decide how to contain it.',
    },
    {
      eventId: 'ev.10',
      verdict: 'malicious',
      stage: 'defense-evasion',
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Two defects and neither is a missing signature. The platform records an unreachable target ' +
        'as a completed scan with zero findings and the reporting counts zero findings as ' +
        'compliant, which means silence is scored as health, and that is a scoring bug that has ' +
        'been quietly improving the number for years. The second is deeper: coverage is measured ' +
        'as the proportion of inventory scanned, which is 100 per cent by construction, and ' +
        'nothing measures the proportion of the network scanned. A tool that has no concept of an ' +
        'asset it has never seen cannot report the thing that mattered tonight. So the proposal is ' +
        'not a detection rule, it is a reconciliation that already has all its inputs: DHCP, MAC ' +
        'tables and DNS against inventory, run nightly, alerting on any address with sustained ' +
        'presence and no record. Backtest it over ninety days before promising a volume, because ' +
        'guest wireless and short-lived test machines will be most of the first run and the rule ' +
        'is worthless if it produces ninety alerts every night forever. Separate unreachable from ' +
        'compliant in the reporting on the same change, because until that happens every number ' +
        'the board has been given is wrong in a direction that flatters.',
      standIn:
        'Two defects and neither is a missing rule. Unreachable is recorded as a completed scan with ' +
        'zero findings, and zero findings scores as compliant, so silence counts as health and has ' +
        'been improving our number for years. Worse, coverage is measured against the inventory, ' +
        'which is a hundred per cent by construction, and nothing measures coverage against the ' +
        'network. A tool with no concept of an asset it has never seen cannot report tonight. ' +
        'Proposal is a reconciliation, not a detection: DHCP, MAC tables and DNS against inventory, ' +
        'nightly, alert on sustained presence with no record. I will backtest it, because guest ' +
        'wireless will be most of the first run. And split unreachable from compliant in the same ' +
        'change, because until we do every number the board has had is wrong in the flattering ' +
        'direction.',
      commandOptions: [
        { command: "awk -F, '{print $5}' /var/log/vulnmgmt/scan-results.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "coverage" /evidence/vulnmgmt/reporting-config.yaml', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status vulnscan', ...STATUS_CHECK },
        { command: 'cat /var/log/vulnmgmt/scan-results.csv', ...DUMP_ALL },
        { command: 'grep -c UNREACHABLE /var/log/vulnmgmt/scan-results.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out how the platform scores a target it could not reach.',
      guidance:
        'Ask what the scanner does when it cannot reach something, and how that is counted.',
    },
    {
      eventId: 'ev.11',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'vulnerability-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.attribute-named'],
      escalateTo: [],
      why:
        'An address with no asset record making outbound connections, arriving forty minutes after ' +
        'the floor learned to treat exactly that as an intrusion, and it is a contractor\'s laptop ' +
        'on guest wireless. Three checks close it and the first one does most of the work: the ' +
        'segment has no route to any clinical or corporate system, so whatever it is, it cannot ' +
        'reach anything. The lease was issued at 09:12 today to a device that authenticated with a ' +
        'visitor code, and the four destinations are a software vendor\'s update service. Guest ' +
        'devices are not inventoried by design, which is the distinction that matters and is easy ' +
        'to lose today: absence from the inventory is a finding when the host is on a network that ' +
        'reaches something, and it is the correct state when the host is on a network that ' +
        'reaches nothing. A floor that flattens that will spend next week investigating every ' +
        'visitor with a phone, and the reconciliation being proposed will be switched off inside a ' +
        'fortnight.',
      standIn:
        'No asset record, outbound connections, and it is a contractor\'s laptop on guest wireless. ' +
        'That segment has no route to anything clinical or corporate, the lease was issued at 09:12 ' +
        'today against a visitor code, and the four destinations are a vendor update service. ' +
        'Guest devices are not inventoried on purpose. Not being in the inventory matters when the ' +
        'host can reach something and is correct when it cannot, and if we flatten that we will be ' +
        'investigating visitors with phones all next week and the new reconciliation gets switched ' +
        'off. Closing it.',
      commandOptions: [
        { command: "awk -F, '$2==\"10.201.4.88\" {print $1, $4, $5}' /var/log/dhcp/guest-leases.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "guest" /var/log/network/segment-routes.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status dhcpd', ...STATUS_CHECK },
        { command: 'cat /var/log/dhcp/guest-leases.csv', ...DUMP_ALL },
        { command: 'nmap -sS 10.201.4.88', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check which segment that address is on and what that segment can route to.',
      guidance:
        'It has no asset record. Ask whether it can reach anything that matters.',
    },
  ],
};
