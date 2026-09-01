/**
 * Scenario 36: Out Of The Box.
 *
 * The container boundary is a configuration, not a wall.
 *
 * WHAT THIS TEACHES
 *
 * That "it is only in a container" is a sentence people say to make an incident
 * smaller, and that whether it is true depends entirely on how the container was
 * configured by somebody who was probably in a hurry.
 *
 * Here it is not true. A debugging session in March added a mount of the host
 * filesystem into a payments API pod, and nobody removed it, so anything that
 * gains execution in that pod can read and write the node underneath it. From
 * the node, the credentials every pod on it uses are readable, and those reach
 * across namespaces. One compromised web pod becomes the cluster.
 *
 * WHY IT IS ADVANCED
 *
 * Nothing is disguised and nothing is exotic, but the chain crosses four layers
 * and each step looks reasonable in isolation. A mount is a mount. A kubelet
 * reading secrets is what a kubelet does. A file in a directory on a node is a
 * file in a directory. Only the sequence is an intrusion, and following it needs
 * somebody comfortable moving between the pod, the node and the cluster API
 * without losing track of which one they are looking at.
 *
 * THE PART FLOORS GET WRONG
 *
 * Deleting the pod. It is the obvious containment, it works, the alert stops,
 * and `ev.5` is the reason it achieves nothing: there is a static pod manifest
 * on the node, and the node will start a replacement without being asked.
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

const ID = 'out-of-the-box';

export const OUT_OF_THE_BOX: Scenario = {
  id: ID,
  title: 'Out Of The Box',
  difficulty: 'advanced',
  durationMinutes: 60,
  situation:
    'It is 21:40 at Fenmarch Credit Union. Something is running inside a payments API pod that is ' +
    'not part of the payments API. The overnight settlement window opens at 23:00.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'cloud-security',
    'vulnerability-analyst',
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
      summary: 'A shell process running inside a payments API pod',
      detail:
        'Runtime monitoring reports an interactive shell inside pod payments-api-7d9f in the ' +
        'payments namespace. The pod image is a distroless build that contains no shell binary. The ' +
        'process was started at 21:14. Rule history: fired 9 times in thirty days, 7 closed as ' +
        'engineers debugging in the staging cluster.',
      source: 'fcu-k8s-04',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 130,
      surface: 'process-tree',
      summary: 'The process is reading the node filesystem from inside the pod',
      detail:
        'The process has open handles under a path that resolves to the host root filesystem, not ' +
        'the container filesystem. It has read the node kubelet configuration and the service ' +
        'account token directory used by every pod scheduled on that node. Its parent is the ' +
        'payments API application process.',
      source: 'fcu-k8s-04',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 290,
      surface: 'raw-log',
      summary: 'The pod specification mounts the host root filesystem',
      detail:
        'The deployment manifest for payments-api includes a hostPath volume mounting / into the ' +
        'container at /hostfs, and runs the container as privileged. Both were added on 11 March ' +
        'in a commit titled "temp: debug disk pressure on node 4", authored by a platform engineer, ' +
        'merged the same day. The commit is still on the main branch.',
      source: 'deployment manifest',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 450,
      surface: 'cloud-audit',
      summary: 'Node credentials used to read secrets in three other namespaces',
      detail:
        'Between 21:19 and 21:31 the kubelet identity for fcu-k8s-04 read secrets in the ledger, ' +
        'settlement and identity namespaces. Every call succeeded. A node holds credentials for ' +
        'every pod scheduled on it, so this is the node doing what a node can do. Fourteen pods ' +
        'across those three namespaces run on node 4.',
      source: 'fcu-k8s-04',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 610,
      surface: 'host-artefact',
      summary: 'A manifest written to the node static pod directory',
      detail:
        'A YAML file was written to /etc/kubernetes/manifests on the node at 21:33. The kubelet ' +
        'starts any pod defined in that directory automatically, without the cluster API being ' +
        'involved, and restarts it if it stops. The defined pod mounts the host filesystem and runs ' +
        'a reverse shell. Deleting a pod created this way does not remove it.',
      source: 'fcu-k8s-04',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 760,
      surface: 'network-flow',
      summary: 'Outbound from the node to an address with no history',
      detail:
        'The node has held a connection to 198.51.100.83:443 since 21:34, exchanging small amounts ' +
        'at irregular intervals. Nodes in this cluster reach the container registry, the cloud ' +
        'provider metadata service and the log collector, and nothing else. This address appears in ' +
        'none of those and has no history in the estate.',
      source: 'fcu-k8s-04',
      target: '198.51.100.83:443',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 850,
      surface: 'alert-queue',
      summary: 'Forty other workloads use the same base deployment template',
      detail:
        'The payments-api manifest was generated from an internal deployment template. Forty other ' +
        'workloads across the cluster were generated from the same template, of which eleven ' +
        'currently run privileged. No policy prevents a privileged container or a hostPath mount ' +
        'from being deployed, and no report of either has ever been produced.',
      source: 'fcu-k8s cluster',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.8',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'Node 6 has been draining since 21:05',
      detail:
        'Node fcu-k8s-06 began draining at 21:05 and its pods have rescheduled elsewhere. This is ' +
        'the scheduled monthly patching cycle, documented in the change record, with node 6 first ' +
        'in the rotation and nodes 7 and 8 to follow tonight. Rule history: fired 24 times in ' +
        'thirty days, 24 closed as scheduled maintenance.',
      source: 'fcu-k8s-06',
      claimedSeverity: 'low',
    },
  ],
};

export const OUT_OF_THE_BOX_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'On 11 March a platform engineer debugging disk pressure added a hostPath mount of / and a privileged flag to the payments API deployment, in a commit titled temp, and it was merged the same day and never removed.',
    'Tonight somebody gained execution inside that pod. From there the mount let them read and write the node underneath.',
    'They read the kubelet configuration and the service account token directory, which holds credentials for every pod scheduled on that node.',
    'Between 21:19 and 21:31 they used the node identity to read secrets in the ledger, settlement and identity namespaces. Every call succeeded, because a node legitimately holds credentials for its own pods.',
    'At 21:33 they wrote a manifest into the node static pod directory. The kubelet starts anything defined there automatically and restarts it if it stops, without the cluster API being involved.',
    'From 21:34 the node has held a connection to an address that appears in none of the three destinations nodes are supposed to reach.',
    'Deleting the pod stops the alert and changes nothing, because the static manifest brings a replacement back.',
    'Forty other workloads came from the same deployment template, eleven of them currently privileged, and no policy prevents either.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'execution',
      techniques: ['T1610'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'malware-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.reimage-now', 'act.isolate', 'act.power-off'],
      escalateTo: ['malware-analyst', 'ir-lead'],
      why:
        'Seven of nine were engineers debugging in staging, and this is production payments. The ' +
        'detail that settles it without any expertise is on the row: the image is distroless and ' +
        'contains no shell binary, so a shell running inside it did not come with the image. That ' +
        'is a cleaner signal than most runtime alerts ever produce, because it is not a judgement ' +
        'about behaviour, it is an absence in the manifest. Deleting the pod is the obvious ' +
        'containment and is graded out of lane here, for a reason ev.5 makes concrete.',
      standIn:
        'Interactive shell inside payments-api-7d9f in the payments namespace, started 21:14. That ' +
        'image is distroless and has no shell in it, so this did not ship with the image. Seven of ' +
        'nine this month were staging debugging; this is production payments. Raising it.',
      commandOptions: [
        { command: 'kubectl exec -n payments payments-api-7d9f -- ps aux 2>/dev/null || crictl ps -a --name payments', correct: true, teaches: CORRECT_STEP },
        { command: 'crictl inspect $(crictl ps -q --name payments-api) | grep -A5 image', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status kubelet', ...STATUS_CHECK },
        { command: 'cat /var/log/runtime/alerts.log', ...DUMP_ALL },
        { command: 'kubectl delete pod -n payments payments-api-7d9f', ...MUTATE },
      ],
      commandNudge:
        'Check what the pod image is supposed to contain, and compare it against what is running.',
      guidance:
        'A distroless image has no shell. Ask where this one came from before you delete anything.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'privilege-escalation',
      critical: true,
      techniques: ['T1611'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['forensics', 'log-analyst'],
      correctActions: ['act.decode', 'act.sandbox'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'The moment it stops being a container problem. Open handles on a path that resolves to the ' +
        'host root rather than the container filesystem means the boundary is not there, and the ' +
        'two things read say what happens next: the kubelet configuration and the service account ' +
        'token directory. That directory holds credentials for every pod scheduled on the node, so ' +
        'the blast radius just went from one payments pod to fourteen workloads across three ' +
        'namespaces. The parent process being the payments API application is the other half, and ' +
        'it points at how they got execution in the first place, which nothing on this board ' +
        'answers.',
      standIn:
        'The process has open handles on the host root filesystem, not the container filesystem, and ' +
        'it has read the kubelet config and the service account token directory. That directory ' +
        'holds credentials for every pod on the node. This stopped being a container problem at ' +
        '21:16. Parent is the payments API application itself.',
      commandOptions: [
        { command: 'ls -l /proc/$(pgrep -f "sh -i")/fd | grep -v "pipe\\|socket"', correct: true, teaches: CORRECT_STEP },
        { command: 'lsof -p $(pgrep -f "sh -i") | grep hostfs', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status containerd', ...STATUS_CHECK },
        { command: 'cat /var/log/audit/audit.log', ...DUMP_ALL },
        { command: 'kill -9 $(pgrep -f "sh -i")', ...MUTATE },
      ],
      commandNudge:
        'Find what files that process has open, and work out which filesystem they are on.',
      guidance:
        'Ask whether that path is inside the container or underneath it. The answer changes the ' +
        'size of this.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'privilege-escalation',
      critical: true,
      techniques: ['T1610', 'T1611'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reimage-now', 'act.isolate', 'act.write-rule'],
      escalateTo: ['vulnerability-analyst', 'ir-lead'],
      why:
        'Why the escape worked, and there is no exploit in it. A hostPath mount of / and a ' +
        'privileged flag, added on 11 March in a commit titled "temp: debug disk pressure on node ' +
        '4", merged the same day, still on main six months later. Nobody was careless in a way ' +
        'anybody would recognise at the time: an engineer debugging a real problem reached for the ' +
        'quickest thing that would let them see the node, and the word temp in a commit message is ' +
        'not a mechanism. That is the finding for the debrief, because it is a review gap rather ' +
        'than a mistake, and the fix is a policy that refuses the manifest rather than an ' +
        'instruction to be more careful.',
      standIn:
        'The deployment manifest mounts host root at /hostfs and runs privileged. Both added 11 ' +
        'March in a commit titled temp, debug disk pressure on node 4, merged the same day, still ' +
        'on main. Somebody debugging a real problem took the quickest route. Nothing stopped it ' +
        'being merged and nothing has removed it in six months.',
      commandOptions: [
        { command: 'git -C /srv/deploy log -p --follow payments-api/deployment.yaml | head -60', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -A6 -i "hostPath\\|privileged" /srv/deploy/payments-api/deployment.yaml', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status kubelet', ...STATUS_CHECK },
        { command: 'cat /srv/deploy/payments-api/deployment.yaml', ...DUMP_ALL },
        { command: 'find /srv/deploy -name "*.yaml" -newermt "2026-03-01"', ...WRONG_TARGET },
      ],
      commandNudge:
        'Read the pod specification and find out when the mount was added and by whom.',
      guidance:
        'Ask why this container could see the host at all. Then ask when that was decided.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'lateral-movement',
      critical: true,
      techniques: ['T1552.007'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'log-analyst', 'mitigation-specialist'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.reimage-now', 'act.dismiss', 'act.isolate', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'The spread, and every call succeeded so there is no denial anywhere to alert on. A node ' +
        'holds credentials for every pod scheduled on it, which is not a flaw, it is how scheduling ' +
        'works. The consequence is that node compromise is namespace-crossing by default: ledger, ' +
        'settlement and identity, fourteen pods, all reachable from one machine. Namespaces are an ' +
        'organisational boundary and people routinely mistake them for a security one, and this row ' +
        'is where that assumption dies. Everything those fourteen workloads hold has to be treated ' +
        'as read, and with settlement opening at 23:00 that is a rotation decision somebody has to ' +
        'make in the next hour.',
      standIn:
        'The kubelet identity for node 4 read secrets in ledger, settlement and identity between ' +
        '21:19 and 21:31. Every call succeeded, because a node legitimately holds credentials for ' +
        'its own pods. Fourteen pods across those namespaces run on node 4. Namespaces are not a ' +
        'security boundary here. Treat all of it as read, and settlement opens at 23:00.',
      commandNudge:
        'Find what the node identity accessed, and work out how many workloads that covers.',
      guidance:
        'Nothing was denied. Ask what a node is entitled to read, and how far that reaches.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      techniques: ['T1543'],
      firstResponder: 'forensics',
      alsoAppropriate: ['malware-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The reason deleting the pod achieves nothing, and it is the single most important thing to ' +
        'say out loud on this floor. A manifest in the node static pod directory is started by the ' +
        'kubelet directly, without the cluster API knowing, and restarted if it stops. So the ' +
        'obvious containment produces exactly the observable a floor wants: the alert clears, the ' +
        'shell is gone, and a replacement is running within seconds under a different pod name. A ' +
        'team that deletes and closes will believe it contained this. The file has to be removed ' +
        'from the node itself, and it should be preserved first, because it is the clearest ' +
        'evidence of intent on the board.',
      standIn:
        'There is a manifest in /etc/kubernetes/manifests on the node, written at 21:33. The kubelet ' +
        'starts anything in there automatically without the API server and restarts it if it dies. ' +
        'It mounts the host filesystem and runs a reverse shell. If we delete the pod the alert ' +
        'clears and a replacement comes straight back. Preserved and sealed. It has to come off the ' +
        'node.',
      commandOptions: [
        { command: 'ls -la /etc/kubernetes/manifests/ && stat /etc/kubernetes/manifests/*.yaml', correct: true, teaches: CORRECT_STEP },
        { command: 'find /etc/kubernetes/manifests -newermt "21:00" -type f', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status kubelet', ...STATUS_CHECK },
        { command: 'cat /var/log/kubelet.log', ...DUMP_ALL },
        { command: 'rm -f /etc/kubernetes/manifests/*.yaml', ...MUTATE },
      ],
      commandNudge:
        'Check whether anything on the node itself would start a pod without the cluster API being ' +
        'asked.',
      guidance:
        'Ask what happens if you delete the pod. If something brings it back, deleting it is not ' +
        'containment.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'command-and-control',
      techniques: ['T1071.001'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'malware-analyst'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The channel, and the reason it is easy to prove is a tight baseline. Nodes in this cluster ' +
        'reach three things: the container registry, the provider metadata service and the log ' +
        'collector. Three destinations is a list short enough to be a control, and this address is ' +
        'on none of them. Irregular intervals rather than a fixed beacon says interactive rather ' +
        'than automated, which matters tonight: somebody is at a keyboard and can react to whatever ' +
        'the floor does next. That argues for cutting the node egress before removing the manifest, ' +
        'rather than the other way round.',
      standIn:
        'Node 4 has held a connection to 198.51.100.83 since 21:34, small amounts at irregular ' +
        'intervals. Nodes here talk to three things: registry, metadata service, log collector. ' +
        'This is none of them. Irregular means interactive, so somebody is watching. I would cut ' +
        'the node egress before we touch the manifest.',
      commandOptions: [
        { command: "awk '$2==\"fcu-k8s-04\" {print $4}' /var/log/flows.log | sort | uniq -c | sort -rn", correct: true, teaches: CORRECT_STEP },
        { command: 'ss -tnp | grep -v "10\\.\\|127\\."', correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -rn', ...WRONG_TARGET },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'curl -sI https://198.51.100.83', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'List every destination the nodes in this cluster normally reach, then compare.',
      guidance:
        'Ask what a node is supposed to talk to. It is a much shorter list than a workstation.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'discovery',
      techniques: ['T1610'],
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.preserve', 'act.isolate', 'act.declare', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'How many more of these exist, which is the question that outlives tonight. Forty workloads ' +
        'from the same template and eleven currently privileged, with no policy preventing either ' +
        'and no report of either ever produced. Eleven privileged containers is eleven more ' +
        'escapes available to anybody who gains execution in one of them, and none of them needed ' +
        'an exploit tonight so none of them will need one next month. The control is an admission ' +
        'policy that refuses privileged containers and hostPath mounts at deployment, which is ' +
        'unglamorous, cheap, and would have made tonight impossible. Worth checking which of the ' +
        'eleven genuinely need it, because two or three probably do.',
      standIn:
        'Forty workloads came from the same deployment template and eleven are running privileged ' +
        'right now. No policy stops a privileged container or a hostPath mount being deployed and no ' +
        'report of either has ever been run. Eleven more escapes available to anybody who gets ' +
        'execution. Admission policy at deployment is the fix.',
      commandOptions: [
        { command: "kubectl get pods -A -o jsonpath='{range .items[*]}{.metadata.namespace}{\" \"}{.metadata.name}{\" \"}{.spec.containers[*].securityContext.privileged}{\"\\n\"}{end}' | grep true", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -rl "hostPath" /srv/deploy/', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status kube-apiserver', ...STATUS_CHECK },
        { command: 'cat /srv/deploy/template/base-deployment.yaml', ...DUMP_ALL },
        { command: 'kubectl get pods -A | wc -l', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find every workload in the cluster currently running privileged or mounting a host path.',
      guidance:
        'One container could reach the host. Ask how many others can.',
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
        'A node draining and its pods rescheduling, thirty-five minutes before a node compromise is ' +
        'found on a different node. Pods moving between nodes on the night somebody escaped from a ' +
        'pod to a node is close enough to feel connected. It is the monthly patching rotation with ' +
        'a change record, node 6 first and nodes 7 and 8 to follow tonight, and 24 of 24 this month ' +
        'were the same. Two checks settle it, which node and is there a change. Worth carrying one ' +
        'thing out of it rather than just closing it: nodes 7 and 8 are due to drain tonight, and ' +
        'if node 4 is left in the rotation its pods will reschedule and spread the problem, so ' +
        'somebody should pull it out of the cycle before that happens.',
      standIn:
        'Node 6 draining since 21:05 is the monthly patching rotation, change record exists, nodes ' +
        '7 and 8 follow tonight. Twenty-four of twenty-four this month were the same. Not related. ' +
        'One thing though: somebody needs to pull node 4 out of that rotation before it drains and ' +
        'reschedules its pods.',
      commandOptions: [
        { command: 'grep -i "patch\\|drain" /var/log/change-management.log | tail', correct: true, teaches: CORRECT_STEP },
        { command: 'kubectl get nodes -o wide', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status kubelet', ...STATUS_CHECK },
        { command: 'cat /var/log/kube-scheduler.log', ...DUMP_ALL },
        { command: 'kubectl get events -A | wc -l', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check which node is draining and whether anybody has a change open for it.',
      guidance:
        'Pods moving is normal during patching. Check the change record, then check whether your ' +
        'node is in the queue.',
    },
  ],
};
