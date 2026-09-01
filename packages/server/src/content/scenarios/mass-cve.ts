/**
 * Scenario 38: Everyone Has It.
 *
 * A published vulnerability with a working exploit, and 214 instances of the
 * affected product.
 *
 * WHAT THIS TEACHES
 *
 * Prioritisation against a clock nobody in the organisation controls. The
 * vulnerability became public at 09:00, mass scanning started within hours, and
 * the estate has more instances than it can patch today. "Patch everything" is
 * not a plan when everything is 214 appliances, three of which sit on the
 * customs filing path and cannot be taken down without stopping shipments.
 *
 * The seat that owns this is Vulnerability Analysis, and this is the scenario
 * where that is obvious. The work is not investigation, it is sequencing: which
 * instances are actually reachable, which of those are exposed to the internet,
 * what compensating control buys time for the rest, and in what order the
 * downtime is spent.
 *
 * THE QUESTION MOST FLOORS ASK SECOND AND SHOULD ASK FIRST
 *
 * Not "are we vulnerable" but "were we already exploited". The exploit was
 * public at 09:00 and this organisation started looking at 11:15, which is more
 * than enough time. A floor that spends the day patching and never checks
 * whether anything already got in has hardened a building somebody is already
 * inside. `ev.4` and `ev.5` are that check, and they are the ones a patching
 * mindset skips.
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

const ID = 'everyone-has-it';

export const EVERYONE_HAS_IT: Scenario = {
  id: ID,
  title: 'Everyone Has It',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 11:15 at Ardal Freight. A vulnerability in the managed file transfer appliance was ' +
    'published at 09:00 with working exploit code. We run 214 of them. You are not going to patch ' +
    'them all today.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'vulnerability-analyst',
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
      summary: 'Vulnerability published at 09:00 with working exploit code and no authentication required',
      detail:
        'The vendor published an advisory at 09:00 for the managed file transfer appliance. The ' +
        'flaw allows command execution without authentication against the web interface. Working ' +
        'exploit code was published to a public repository at 09:40. A patch is available and ' +
        'requires a service restart. Rule history: this arrived through the vulnerability feed, ' +
        'which raises 30 to 60 advisories a week.',
      source: 'vendor advisory',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 130,
      surface: 'alert-queue',
      summary: '214 instances in the estate, of which nine are reachable from the internet',
      detail:
        'The asset inventory lists 214 instances of the appliance. Nine are published to the ' +
        'internet for customer file exchange. The remaining 205 are internal, of which 140 are ' +
        'reachable from the general office network and 65 sit on segments reachable only from ' +
        'operations. The inventory was last reconciled in June.',
      source: 'asset inventory',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 290,
      surface: 'network-flow',
      summary: 'Internet-wide scanning for the vulnerable path began at 10:20',
      detail:
        'Perimeter logs show requests to the vulnerable endpoint path arriving from 340 distinct ' +
        'external addresses since 10:20, forty minutes after the exploit was published. The pattern ' +
        'is indiscriminate: the same request against every published address in our range, ' +
        'including hosts that do not run the appliance. Volume is still increasing.',
      source: 'perimeter',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 450,
      surface: 'raw-log',
      summary: 'One internet-facing instance answered the exploit request successfully at 11:04',
      detail:
        'adf-mft-03 returned a 200 to the vulnerable endpoint at 11:04:17 from 203.0.113.155, ' +
        'where the other eight returned 403 because they sit behind an access proxy. The request ' +
        'body matches the published exploit. Two further requests from the same address followed at ' +
        '11:05 and 11:09, both returning 200.',
      source: 'adf-mft-03',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 610,
      surface: 'host-artefact',
      summary: 'A script written into the appliance web directory at 11:05',
      detail:
        'A 2.1 KB file was written to the appliance web root at 11:05:02, owned by the appliance ' +
        'service account. It accepts a parameter and passes it to a shell. It has been requested ' +
        'four times since, from two addresses. The appliance is a vendor-managed image and the ' +
        'vendor support agreement does not permit customer-installed tooling on it.',
      source: 'adf-mft-03',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 770,
      surface: 'alert-queue',
      summary: 'Three instances sit on the customs filing path and cannot be restarted today',
      detail:
        'Three of the 214 handle customs manifest submission to the authority. The submission ' +
        'window for today closes at 18:00 and a missed filing holds the associated consignments at ' +
        'the port. Patching requires a service restart of eight to twelve minutes. The other 211 ' +
        'have no such constraint, though 140 are in use during the working day.',
      source: 'adf operations',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'The scanner reports 400 findings against the same product',
      detail:
        'The vulnerability scanner reports 400 open findings against the file transfer appliances, ' +
        'all of them the same three issues from a 2024 advisory, all rated medium, all present ' +
        'since the appliances were deployed. None relates to today advisory, which the scanner will ' +
        'not detect until its next signature update tonight. Rule history: fired 30 times in thirty ' +
        'days, 30 closed as known backlog.',
      source: 'scanner',
      claimedSeverity: 'medium',
    },
  ],
};

export const EVERYONE_HAS_IT_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'At 09:00 the vendor published an advisory for the managed file transfer appliance: command execution, no authentication required.',
    'Working exploit code was public at 09:40, and indiscriminate internet-wide scanning for the vulnerable path started at 10:20.',
    'The estate runs 214 instances. Nine are published to the internet and eight of those sit behind an access proxy that returns 403 to the vulnerable endpoint.',
    'The ninth, adf-mft-03, does not, because it was excluded from the proxy in 2023 so a customer with an old client could still connect.',
    'At 11:04 it answered the exploit successfully. At 11:05 a script was written into its web root, and it has been used four times since from two addresses.',
    'So the answer to are we vulnerable is 214, and the answer to were we already exploited is yes, once, two hours ago.',
    'Patching needs a restart of eight to twelve minutes. Three instances handle customs filing with a window closing at 18:00, and a missed filing holds consignments at the port.',
    'The vulnerability scanner has 400 findings against these appliances and not one of them is today advisory, which it cannot detect until tonight.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'reconnaissance',
      techniques: ['T1190'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reimage-now', 'act.declare'],
      escalateTo: ['vulnerability-analyst', 'ir-lead'],
      why:
        'Thirty to sixty advisories a week arrive through this feed and almost none of them need ' +
        'anybody in the next hour. Three properties on this row put it in the small category that ' +
        'does. No authentication required, which means no foothold is needed first. Working exploit ' +
        'code published forty minutes after the advisory, which removes the skill barrier entirely. ' +
        'And we run the product. Any two of those is a busy afternoon; all three is a clock, ' +
        'because the gap between public exploit and mass scanning is measured in hours and the ' +
        'organisation does not control either end of it.',
      standIn:
        'Vendor advisory at 09:00 on the managed file transfer appliance: command execution, no ' +
        'authentication. Working exploit public at 09:40. We run it. Thirty to sixty advisories a ' +
        'week come through this feed and this is one of the few that needs somebody now.',
      commandOptions: [
        { command: 'grep -i "mft-appliance" /var/log/vuln-feed/advisories.log | tail -5', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "authentication\\|exploit" /var/log/vuln-feed/advisory-4471.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status vuln-feed', ...STATUS_CHECK },
        { command: 'cat /var/log/vuln-feed/advisories.log', ...DUMP_ALL },
        { command: 'grep -c ADVISORY /var/log/vuln-feed/advisories.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Read the advisory and work out whether exploiting it needs a credential or any skill.',
      guidance:
        'Most advisories can wait. Ask whether this one needs authentication and whether the ' +
        'exploit is already public.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['ir-lead', 'network-analyst'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.declare', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The number that makes this a sequencing problem rather than a patching one, and the ' +
        'breakdown matters far more than the total. Two hundred and fourteen is unpatchable today. ' +
        'Nine internet-facing is a list somebody can work through before lunch, and that is where ' +
        'the whole risk sits: the exploit needs no authentication, so reachability is the entire ' +
        'question. Worth flagging the last sentence rather than glossing it, because the inventory ' +
        'was last reconciled in June and an inventory three months stale is a set of assumptions ' +
        'rather than a fact. The nine should be confirmed against what the perimeter actually ' +
        'publishes, not against a spreadsheet.',
      standIn:
        '214 instances. Nine published to the internet, 140 reachable from the office network, 65 ' +
        'on operations segments. The exploit needs no authentication, so reachability is the whole ' +
        'question and the nine are the list that matters this morning. The inventory was last ' +
        'reconciled in June, so I want the nine confirmed against what the perimeter actually ' +
        'publishes.',
      commandOptions: [
        { command: "awk -F, '$3==\"mft-appliance\" {print $1, $4}' /var/inventory/assets.csv | sort -k2", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c mft-appliance /var/inventory/assets.csv', ...COUNT_ONLY },
        { command: 'systemctl status inventory-sync', ...STATUS_CHECK },
        { command: 'cat /var/inventory/assets.csv', ...DUMP_ALL },
        { command: 'nmap -p 8443 203.0.113.0/24', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Break the estate down by how reachable each instance is, not just how many there are.',
      guidance:
        'You cannot patch 214 today. Ask which ones an unauthenticated attacker can actually reach.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'reconnaissance',
      techniques: ['T1595.002'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'vulnerability-analyst'],
      why:
        'The clock made visible. Three hundred and forty distinct addresses hitting the vulnerable ' +
        'path forty minutes after the exploit went public, and still increasing. The important read ' +
        'is that it is indiscriminate: the same request against every published address in the ' +
        'range including hosts that do not run the appliance. Nobody is targeting Ardal Freight, ' +
        'and that is worth saying because a floor that assumes it is being targeted will look for ' +
        'sophistication that is not there. What indiscriminate scanning means practically is that ' +
        'every internet-facing instance will be tried, so exposure equals compromise on a long ' +
        'enough timeline and the timeline here is hours.',
      standIn:
        '340 distinct addresses hitting the vulnerable path since 10:20, forty minutes after the ' +
        'exploit went public, still climbing. It is indiscriminate: same request against every ' +
        'address we publish, including hosts that do not run the product. Nobody is targeting us. ' +
        'Everything we expose will be tried.',
      commandOptions: [
        { command: "awk '$7 ~ /vulnerable-endpoint/ {print $1}' /var/log/perimeter/access.log | sort -u | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$7 ~ /vulnerable-endpoint/ {print $6}' /var/log/perimeter/access.log | sort | uniq -c", correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -an | grep 8443', ...WRONG_TARGET },
        { command: 'cat /var/log/perimeter/access.log', ...DUMP_ALL },
        { command: 'nmap -sS 203.0.113.155', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Count the distinct sources hitting that path, and check whether they are hitting hosts ' +
        'that do not run the product.',
      guidance:
        'Ask whether this is aimed at us or at everybody. The answer changes what you expect next.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1190'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.dismiss'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'The question a patching mindset skips, and the answer is yes. Eight of the nine returned ' +
        '403 because they sit behind an access proxy; adf-mft-03 returned 200. One instance behaved ' +
        'differently from its eight identical siblings, and that comparison is the finding: it is ' +
        'not that the appliance is vulnerable, all 214 are, it is that this one was reachable when ' +
        'the others were not. Two further successful requests at 11:05 and 11:09 mean somebody came ' +
        'back, so this is not a scanner recording a hit and moving on. From here the incident is no ' +
        'longer about patching, and a floor still building a patch schedule at this point has ' +
        'missed the change.',
      standIn:
        'adf-mft-03 returned 200 to the exploit at 11:04. The other eight returned 403 because they ' +
        'are behind the access proxy. Two more successful requests from the same address at 11:05 ' +
        'and 11:09, so somebody came back. One instance behaved differently from eight identical ' +
        'ones. This is no longer a patching job.',
      commandOptions: [
        { command: "awk '$7 ~ /vulnerable-endpoint/ && $9==200 {print $1, $2, $3}' /var/log/mft/access.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep 203.0.113.155 /var/log/mft/access.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mft-appliance', ...STATUS_CHECK },
        { command: 'cat /var/log/mft/access.log', ...DUMP_ALL },
        { command: 'grep -c 403 /var/log/mft/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find whether any instance answered the exploit request with something other than a refusal.',
      guidance:
        'Before you plan the patching, ask whether anything already got in. The exploit has been ' +
        'public for two hours.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      techniques: ['T1505.003'],
      firstResponder: 'forensics',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'What they left, and it changes the remediation completely. A 2.1 KB script in the web root, ' +
        'owned by the appliance service account, taking a parameter and handing it to a shell. It ' +
        'has been requested four times from two addresses, so it is in use rather than parked. ' +
        'Patching adf-mft-03 closes the vulnerability and leaves this behind, which means the patch ' +
        'schedule everybody is arguing about does not fix the one machine that actually matters. ' +
        'The vendor-managed image is the awkward second finding: the support agreement does not ' +
        'permit customer tooling on the appliance, so the organisation has limited ability to ' +
        'inspect its own device and the vendor has to be brought in today rather than next week.',
      standIn:
        '2.1 KB script in the appliance web root, written 11:05:02, owned by the service account, ' +
        'takes a parameter and passes it to a shell. Requested four times since from two addresses, ' +
        'so it is being used. Patching this box closes the hole and leaves the door. It is a ' +
        'vendor-managed image and their agreement does not let us put tooling on it, so we need ' +
        'them on the phone today. Captured and sealed.',
      commandOptions: [
        { command: 'find /opt/mft/webroot -newermt "11:00" -type f -ls', correct: true, teaches: CORRECT_STEP },
        { command: "awk '$7 ~ /webroot/ && $9==200 {print $1, $7}' /var/log/mft/access.log | tail", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mft-appliance', ...STATUS_CHECK },
        { command: 'cat /var/log/mft/access.log', ...DUMP_ALL },
        { command: 'rm -f /opt/mft/webroot/*.jsp', ...MUTATE },
      ],
      commandNudge:
        'Check what was written to that appliance after the successful request, and whether it has ' +
        'been used since.',
      guidance:
        'Ask whether patching this box removes what they left on it.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.isolate', 'act.declare', 'act.reimage-now', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The constraint that makes the sequencing real, and it is the reason this seat exists. ' +
        'Three instances handle customs filing with a window closing at 18:00, an eight to twelve ' +
        'minute restart, and a missed filing holds consignments at the port. That is not a reason ' +
        'not to patch, it is a reason to patch them in a different order and to buy time with ' +
        'something other than a patch. The proposal this seat should reach is the nine ' +
        'internet-facing first, adf-mft-03 handled as an incident rather than a patch, the customs ' +
        'three moved behind the access proxy this afternoon and patched after 18:00, and the ' +
        'remaining 205 scheduled across the week. Naming what is deferred and why is the output, ' +
        'because a plan that quietly leaves 205 unpatched without saying so reads as complete.',
      standIn:
        'Three of them file customs manifests and the window closes at 18:00. A restart is eight to ' +
        'twelve minutes and a missed filing holds consignments at the port. Order I want: the nine ' +
        'internet-facing now, mft-03 as an incident not a patch, the customs three behind the access ' +
        'proxy this afternoon and patched after 18:00, the other 205 across the week. I am saying ' +
        'out loud that 205 stay unpatched tonight.',
      commandOptions: [
        { command: "awk -F, '$3==\"mft-appliance\" && $6==\"customs\" {print $1, $5}' /var/inventory/assets.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i customs /var/log/operations/filing-windows.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mft-appliance', ...STATUS_CHECK },
        { command: 'cat /var/inventory/assets.csv', ...DUMP_ALL },
        { command: 'systemctl restart mft-appliance', ...MUTATE },
      ],
      commandNudge:
        'Find out which instances cannot be restarted today and what depends on them.',
      guidance:
        'Ask what breaks if you patch it now. Then work out what buys time for the ones that have ' +
        'to wait.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['vulnerability-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.scope-estate'],
      escalateTo: [],
      why:
        'Four hundred open findings against exactly the product the floor is working on, which is ' +
        'the most plausible-looking distraction available today. They are three issues from a 2024 ' +
        'advisory, all medium, present since deployment, and 30 of 30 this month were closed the ' +
        'same way. Not one relates to today. The sentence worth taking out of it is the last one: ' +
        'the scanner cannot detect today advisory until its signature update tonight, so a floor ' +
        'that waits for a scan to tell it which instances are affected will be waiting until after ' +
        'the customs window closes. The inventory answered that question in ev.2 and the scanner ' +
        'will answer it tomorrow.',
      standIn:
        'Four hundred scanner findings on these appliances are three issues from a 2024 advisory, ' +
        'all medium, present since deployment. Thirty of thirty this month were the same. None of ' +
        'them is today. And the scanner cannot see today advisory until its signature update ' +
        'tonight, so do not wait on it. Closing.',
      commandOptions: [
        { command: "awk -F, '$4==\"mft-appliance\" {print $2}' /var/log/scanner/findings.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "signature\\|feed update" /var/log/scanner/status.log | tail', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status scanner', ...STATUS_CHECK },
        { command: 'cat /var/log/scanner/findings.csv', ...DUMP_ALL },
        { command: 'grep -c mft-appliance /var/log/scanner/findings.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check which advisory those findings relate to, and when the scanner will know about ' +
        'today one.',
      guidance:
        'Four hundred findings on the right product is not four hundred findings about today. Check ' +
        'the dates.',
    },
  ],
};
