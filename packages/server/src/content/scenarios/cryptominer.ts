/**
 * Scenario 05: Cheap Rent.
 *
 * A cryptominer on a Kubernetes node, and the reason it is there.
 *
 * THE TRAP THIS SCENARIO IS BUILT AROUND
 *
 * A miner is the least harmful thing an intruder can leave behind. It steals
 * compute, it is loud, it is trivially removed, and every instinct says clean it
 * and move on. Floors do exactly that, and the finding they file is "cryptominer
 * removed from one node".
 *
 * The miner is not the incident. Somebody had to get onto that node to put it
 * there, and the route in is still open. Whoever installed it also has the
 * service account token that pod was mounting, which reaches the cluster API and
 * therefore every other namespace. The miner is the only reason anybody looked
 * at all: it is a symptom loud enough to be noticed, attached to an access
 * nobody would otherwise have found.
 *
 * So the scored failure here is not missing the miner. It is catching the miner,
 * dismissing everything else as noise around it, and closing the incident with
 * the access intact. That failure is graded on ev.4, ev.5 and ev.7, and a floor
 * can score well on accuracy and still leave the estate compromised.
 *
 * WHY THE HIGH SEVERITY ROW IS THE DISTRACTION
 *
 * ev.1 arrives claiming HIGH and is the most eye-catching thing on the board.
 * It is also the least important, because it is the symptom. The events that
 * matter arrive claiming LOW. That inversion is deliberate.
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

const ID = 'cheap-rent';

export const CHEAP_RENT: Scenario = {
  id: ID,
  title: 'Cheap Rent',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 02:40 and the platform team has been paged twice about a node running hot. The ' +
    'overnight batch finished four hours ago and the cluster should be close to idle. Work out ' +
    'what is running, and do not stop when you find it.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'cloud-security',
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
      summary: 'Sustained 94 percent CPU on rmg-k8s-07 for three hours with no scheduled workload',
      detail:
        'Node rmg-k8s-07 has held above 90 percent CPU since 23:35. The overnight batch completed ' +
        'at 22:48 and the cluster is otherwise near idle. Two pages were raised to the platform ' +
        'team and both were acknowledged and left. Rule history: fired 47 times in thirty days, ' +
        '44 closed as expected load.',
      source: 'rmg-k8s-07',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 110,
      surface: 'process-tree',
      summary: 'Process named kworker-cache spawned by a container with no such binary in its image',
      detail:
        'A process presenting as kworker-cache is consuming most of the node CPU. Its parent is a ' +
        'container in the public-web namespace running the portal image. That image manifest ' +
        'contains no binary of that name. The process was started at 23:31 and its working ' +
        'directory is /tmp.',
      source: 'rmg-k8s-07',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 260,
      surface: 'network-flow',
      summary: 'Persistent outbound connection to a mining pool on a non-standard port',
      detail:
        'A long-lived connection from the node to 198.51.100.77:3333, established at 23:32 and ' +
        'still open. Traffic is small, regular and bidirectional, roughly 40 KB a minute, with the ' +
        'shape of a job feed rather than a transfer. Port 3333 is conventional for mining pool ' +
        'protocols.',
      source: 'rmg-k8s-07',
      target: '198.51.100.77:3333',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 400,
      surface: 'alert-queue',
      summary: 'Portal container accepted a request to an endpoint that echoes template input',
      detail:
        'At 23:26 the portal received a POST to /api/report/preview containing template syntax in ' +
        'the title field. The endpoint renders user-supplied templates server side to produce ' +
        'report previews. The request returned 200 in 4.1 seconds against a median of 40 ' +
        'milliseconds. Rule history: fired 2 times in thirty days, both closed as malformed input.',
      source: '203.0.113.19',
      target: 'rmg-portal',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.5',
      atSeconds: 540,
      surface: 'cloud-audit',
      summary: 'Cluster API queried with the portal service account token from inside the pod',
      detail:
        'The public-web service account listed pods, secrets and service accounts across four ' +
        'namespaces between 23:33 and 23:39. Every call succeeded. The account holds these ' +
        'permissions through a cluster role binding applied during the platform migration in ' +
        'March, and it has never used any of them before. Token mounting is on by default for ' +
        'this workload.',
      source: 'system:serviceaccount:public-web:portal',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.6',
      atSeconds: 690,
      surface: 'host-artefact',
      summary: 'Miner binary and a shell script staged in the container /tmp directory',
      detail:
        'Two files in the container filesystem at /tmp, written at 23:30 and 23:31. One is a ' +
        'stripped ELF binary matching a widely distributed open source miner. The other is a shell ' +
        'script that downloads the binary, writes a crontab entry, and re-downloads if the process ' +
        'is absent. The container filesystem is not persistent and will be gone on restart.',
      source: 'rmg-k8s-07',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 820,
      surface: 'network-flow',
      summary: 'Three-second connection to a second address, twelve minutes before the miner started',
      detail:
        'A connection from the portal container to 203.0.113.19:443 at 23:19, lasting three ' +
        'seconds, 11 KB outbound and 900 bytes inbound. That is the same address the template ' +
        'request later came from. No other traffic to it before or since. Nothing about the ' +
        'connection failed and nothing alerted.',
      source: 'rmg-portal',
      target: '203.0.113.19:443',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.8',
      atSeconds: 900,
      surface: 'alert-queue',
      summary: 'Memory pressure warnings on four nodes in the same cluster',
      detail:
        'Four other nodes crossed the memory warning threshold between 01:10 and 02:20. All four ' +
        'run the same logging sidecar, which had a configuration change applied at 01:05 raising ' +
        'its buffer size. The platform change log records the change and its author. Rule history: ' +
        'fired 380 times in thirty days, 377 closed as not worth acting on.',
      source: 'rmg-k8s cluster',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.9',
      atSeconds: 470,
      surface: 'raw-log',
      summary: 'Portal application log records template evaluation raising a process error',
      detail:
        'The portal application logged a template rendering exception at 23:19:41 and again at ' +
        '23:26:12. Both entries include the evaluated expression, which in each case resolves a ' +
        'runtime object and calls out to a system command. The 23:19 entry ends in a non-zero ' +
        'exit; the 23:26 entry completes. Application logs roll after 48 hours.',
      source: 'rmg-portal',
      claimedSeverity: 'low',
    },
  ],
};

export const CHEAP_RENT_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'The patient portal exposes an endpoint that renders user-supplied templates on the server.',
    'At 23:19 somebody used it to run a command inside the container and confirmed they had execution, which cost eleven kilobytes and three seconds.',
    'At 23:26 they came back through the same endpoint and staged a miner and a re-download script in /tmp.',
    'At 23:31 the miner started, and at 23:32 it connected to a pool. That is the only thing anybody noticed.',
    'Between 23:33 and 23:39 they used the pod service account token to list pods, secrets and service accounts across four namespaces.',
    'That token reaches the cluster API because token mounting is on by default and a March migration left the binding broad.',
    'Removing the miner removes the noise. The template endpoint, the service account binding and whatever they read out of those namespaces are all untouched by that.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1496'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.reimage-now', 'act.isolate', 'act.power-off'],
      escalateTo: ['log-analyst'],
      why:
        'Correct to raise, and worth being clear about why: not because 94 percent CPU is ' +
        'dangerous, but because there is no workload to explain it. The rule is right 3 times in ' +
        '47 and this is one of them, which is what makes the firing history a starting point ' +
        'rather than an answer. The trap opens here. This row claims HIGH and is the least ' +
        'important thing on the board tonight, and a floor that treats severity as priority will ' +
        'spend the hour on the symptom.',
      standIn:
        'Node has been above 90 percent since 23:35 with the batch finished at 22:48 and nothing ' +
        'scheduled. Platform acknowledged two pages and left it. Raising it: there is no workload ' +
        'that accounts for this.',
      commandOptions: [
        { command: 'top -b -n1 | head -20', ...STATUS_CHECK },
        { command: 'kubectl get pods -o wide --field-selector spec.nodeName=rmg-k8s-07', correct: true, teaches: CORRECT_STEP },
        { command: 'uptime', ...STATUS_CHECK },
        { command: 'df -h', ...STATUS_CHECK },
        { command: 'systemctl status kubelet', ...STATUS_CHECK },
      ],
      commandNudge: 'Find out what is actually consuming the CPU before deciding what it means.',
      guidance:
        'High CPU is a symptom. Ask what is running, and then ask how it got there.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'execution',
      techniques: ['T1036.005', 'T1610'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['malware-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reimage-now', 'act.isolate', 'act.write-rule'],
      escalateTo: ['malware-analyst', 'ir-lead'],
      why:
        'The name is chosen to be skipped: kworker-cache looks like kernel housekeeping to anybody ' +
        'scanning a process list quickly, and that is the entire point of naming it that. The check ' +
        'that settles it takes one command, and it is the one worth building the habit around: ' +
        'compare the running process against the image manifest. A container image is a declared, ' +
        'immutable list of what should be inside. Anything running that is not in it did not come ' +
        'with the image, and that is a much stronger statement than anything a process name can ' +
        'tell you.',
      standIn:
        'Process presenting as kworker-cache, parented by a portal container, working directory ' +
        '/tmp, started 23:31. That binary is not in the image manifest, so it was not shipped with ' +
        'the container.',
      commandOptions: [
        { command: 'ps -ef | grep kworker', ...WRONG_TARGET },
        { command: 'docker inspect rmg/portal:latest | grep -A20 Layers', correct: true, teaches: CORRECT_STEP },
        { command: 'ls -la /proc/$(pgrep kworker-cache)/exe', ...WRONG_TARGET },
        { command: 'dmesg | tail -30', ...WRONG_TARGET },
        { command: 'kubectl logs -n public-web portal-7f4b', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check whether that binary is in the container image it is supposedly running from.',
      guidance:
        'A process name is a string anybody can choose. Compare what is running against what the ' +
        'image says should be there.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1496'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.flow-map'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'This confirms the miner and closes that question. The useful observation is about SHAPE: ' +
        '40 KB a minute, regular, bidirectional, is a job feed, and it looks nothing like ' +
        'exfiltration even though both are outbound connections to an unexpected address. Being ' +
        'able to say "this is a miner talking to a pool and not data leaving" from the flow ' +
        'pattern alone is the skill, and the report is better for stating it, because it rules ' +
        'something out.',
      standIn:
        'Long-lived connection to a pool address on 3333 since 23:32, still open. Traffic is small, ' +
        'regular and two-way, about 40 KB a minute. That is a job feed. No bulk data has left over ' +
        'this connection.',
      commandOptions: [
        { command: 'ss -tnp | grep 3333', ...WRONG_TARGET },
        { command: 'grep 198.51.100.77 /var/log/flows.log', correct: true, teaches: CORRECT_STEP },
        { command: 'tcpdump -r /var/cap/node07.pcap -c 20', ...WRONG_TARGET },
        { command: 'netstat -rn', ...WRONG_TARGET },
        { command: 'dig -x 198.51.100.77', ...WRONG_TARGET },
      ],
      commandNudge:
        'Look at the shape of the traffic over time, not just where it is going.',
      guidance:
        'Outbound to an odd address is not automatically data leaving. Ask what the traffic pattern ' +
        'looks like.',
    },
    {
      eventId: 'ev.4',
      critical: true,
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1190', 'T1059'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['log-analyst', 'ir-lead'],
      why:
        'This is the way in, and it arrives claiming LOW on a rule that has fired twice and been ' +
        'closed twice as malformed input. Server-side template rendering of user input is remote ' +
        'code execution with a friendly name. The tell that needs no expertise at all is the ' +
        'timing: 4.1 seconds against a 40 millisecond median. Something ran. A floor that has ' +
        'already found the miner will read this as unrelated noise, and dismissing it means the ' +
        'endpoint is still there after the miner is cleaned, which is how this recurs on Thursday.',
      standIn:
        'POST to the report preview endpoint at 23:26 with template syntax in the title, returned ' +
        '200 in 4.1 seconds against a 40 millisecond median. That endpoint renders user templates ' +
        'server side. Seven minutes before the miner started.',
      commandOptions: [
        { command: 'grep "report/preview" /var/log/nginx/access.log', correct: true, teaches: CORRECT_STEP },
        { command: 'grep 203.0.113.19 /var/log/nginx/access.log', correct: true, teaches: ALSO_WORKS },
        { command: 'tail -50 /var/log/nginx/error.log', ...DUMP_ALL },
        { command: 'curl -I http://localhost/api/report/preview', ...TOUCH_ATTACKER },
        { command: 'cat /etc/nginx/nginx.conf', ...WRONG_TARGET },
      ],
      commandNudge:
        'Compare how long that request took against how long that endpoint normally takes.',
      guidance:
        'You found what is running. Now ask how it got on the box, and check what happened in the ' +
        'minutes before it started.',
    },
    {
      eventId: 'ev.5',
      critical: true,
      verdict: 'malicious',
      stage: 'privilege-escalation',
      techniques: ['T1528', 'T1613'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.timeline', 'act.preserve', 'act.reimage-now', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The most serious thing that happened tonight, arriving on the quietest row. Every call ' +
        'succeeded, nothing was denied, and there is no error to alert on. A web-facing pod listed ' +
        'secrets across four namespaces using a token it was handed automatically, through a ' +
        'binding a migration left broad in March. Whoever ran the miner now knows the shape of the ' +
        'cluster and has read secrets they were never meant to reach. Restarting the pod deletes ' +
        'the miner and changes none of this. If the floor takes one action tonight beyond cleanup, ' +
        'it is rotating what those namespaces held.',
      standIn:
        'The portal service account listed pods, secrets and service accounts across four ' +
        'namespaces between 23:33 and 23:39. Every call succeeded. It has held those permissions ' +
        'since a March migration and has never used one before. Treat anything in those namespaces ' +
        'as read.',
      commandNudge:
        'Compare what that service account did tonight against everything it has ever done.',
      guidance:
        'Nothing was denied, which is why nothing alerted. Ask what that account was ENTITLED to ' +
        'do and whether it should have been.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1053.003', 'T1105'],
      firstResponder: 'forensics',
      alsoAppropriate: ['malware-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.isolate'],
      escalateTo: ['ir-lead', 'malware-analyst'],
      why:
        'Two findings and a deadline. The script writes a crontab entry and re-downloads the binary ' +
        'whenever the process is missing, so killing the miner brings it straight back and looks ' +
        'like the fix failed. And the container filesystem is not persistent: restart the pod, ' +
        'which is the first thing a platform engineer will do, and every artefact here is gone ' +
        'forever. That makes this the one event where the order of operations genuinely decides ' +
        'whether the incident is provable. Capture before anybody remediates, and say so out loud ' +
        'to the room rather than only writing it down.',
      standIn:
        'Miner binary and a re-download script in /tmp, written 23:30 and 23:31. The script writes ' +
        'a crontab entry and refetches if the process dies. Container filesystem is ephemeral, so ' +
        'this is gone the moment anybody restarts the pod. Captured, hashed and sealed now.',
      commandNudge:
        'Check what the script does on a schedule before anybody restarts anything.',
      guidance:
        'Ask what happens to this evidence when somebody fixes the problem. Then decide what order ' +
        'to do things in.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'execution',
      techniques: ['T1190'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.dismiss', 'act.contact-attacker', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'threat-intel'],
      why:
        'Eleven kilobytes over three seconds, twelve minutes before anything happened, to an ' +
        'address that means nothing until you notice it is the same one the template request came ' +
        'from. This is the moment they confirmed they had execution and could reach the internet, ' +
        'and it moves the start of the incident twelve minutes earlier than the miner suggests. ' +
        'Small, early, and unalerting is what a first foothold looks like; the loud thing is always ' +
        'later. Correlating it costs one lookup, and it is what turns a cleanup into an ' +
        'understanding of the intrusion.',
      standIn:
        'Three-second connection from the portal container to 203.0.113.19 at 23:19, 11 KB out. ' +
        'That is the same address the template request came from at 23:26. Nothing else has ever ' +
        'talked to it. The intrusion starts at 23:19, not 23:31.',
      commandOptions: [
        { command: 'grep 203.0.113.19 /var/log/flows.log', correct: true, teaches: CORRECT_STEP },
        { command: 'awk \'$3<"23:32"\' /var/log/flows.log | tail -30', correct: true, teaches: ALSO_WORKS },
        { command: 'ss -tn', ...WRONG_TARGET },
        { command: 'cat /var/log/nginx/access.log | tail -20', ...WRONG_TARGET },
        { command: 'ping -c 2 203.0.113.19', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Look for anything else that talked to the address from the template request, and when.',
      guidance:
        'The loud thing is rarely the first thing. Look at what this host did in the twenty ' +
        'minutes before it.',
    },
    {
      eventId: 'ev.8',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss', 'act.tune'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: [],
      why:
        'Four nodes, same cluster, same night, memory climbing. It looks like the miner spreading, ' +
        'and it is a logging sidecar buffer change with a change record and a named author from ' +
        '01:05. The rule is wrong 377 times in 380. This is the highest-value dismissal in the ' +
        'scenario: believing it costs the floor the second half of the hour chasing lateral ' +
        'movement that never happened, at exactly the point where the real question is what the ' +
        'service account read. Checking the change log first is ninety seconds and rules it out.',
      standIn:
        'Memory warnings on four nodes from 01:10. All four run the logging sidecar that had its ' +
        'buffer size raised at 01:05, and the change log has the record and the author. Not the ' +
        'miner spreading. Closing it and raising a tuning ticket.',
      commandOptions: [
        { command: 'kubectl top nodes', ...WRONG_TARGET },
        { command: 'grep sidecar /var/log/platform/change-log.txt', correct: true, teaches: CORRECT_STEP },
        { command: 'free -h', ...STATUS_CHECK },
        { command: 'kubectl get pods -A | grep -c Running', ...WRONG_TARGET },
        { command: 'dmesg | grep -i oom', ...WRONG_TARGET },
      ],
      commandNudge: 'Something changed on the cluster at 01:05. Find the record of it.',
      guidance:
        'Same cluster and same night is not proof of the same cause. Check the change log before ' +
        'you decide it is spreading.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'execution',
      techniques: ['T1190', 'T1059'],
      firstResponder: 'forensics',
      alsoAppropriate: ['log-analyst', 'malware-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The application logged the attack in full, twice, as an ordinary error. Nobody reads ' +
        'application exception logs during an incident and this is the argument for doing so: it ' +
        'contains the evaluated expression, which is the closest thing to a confession available ' +
        'tonight. The pair matters more than either entry. A failure at 23:19 and a success at ' +
        '23:26 is somebody testing, adjusting and returning, which establishes intent rather than ' +
        'accident and rules out a crawler hitting a fragile endpoint. The 48 hour roll is the ' +
        'reason this is a preserve rather than a read: on a Friday incident it would be gone ' +
        'before anybody wrote the report.',
      standIn:
        'Portal application log has the template exception twice, 23:19:41 failing and 23:26:12 ' +
        'succeeding, with the evaluated expression in both. It resolves a runtime object and calls ' +
        'a system command. Captured and sealed. These roll in 48 hours.',
      commandNudge:
        'The application writes its own errors somewhere. Find the two entries and compare them.',
      guidance:
        'Applications log their own exceptions. Ask whether the attack left a record in the ' +
        'software rather than only in the security tooling.',
    },
  ],
};
