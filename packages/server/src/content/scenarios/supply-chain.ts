/**
 * Scenario 04: Third Party.
 *
 * A minor dependency update in the patient portal build pulls in a version that
 * was published from a maintainer account somebody else was holding.
 *
 * WHAT THIS ONE TEACHES
 *
 * That the intrusion can arrive through the front door, signed, versioned, and
 * requested by your own engineers. Nothing was breached to get in. A package the
 * organisation deliberately installed did exactly what packages do.
 *
 * The consequence for triage is that every instinct about provenance stops
 * working. The build server is meant to download code from the internet and run
 * it. The traffic is to a package registry the estate allowlists. The process
 * tree is a build. There is no unauthorised anything, and a floor looking for
 * unauthorised anything will find nothing all hour.
 *
 * The signal is entirely in TIMING and DIFFERENCE: a version published hours
 * before it was pulled, an install step that runs on install and never ran
 * before, and a build that made one network call it has never made in two
 * hundred previous runs. That last one is the finding, and it belongs to
 * whoever thinks to compare this build against the last one rather than against
 * a threat feed.
 *
 * WHY VULNERABILITY ANALYSIS IS SEATED AND NOT FORENSICS
 *
 * The question that matters here is not what happened on one host, it is how
 * many other things pulled the same version, which is scope rather than
 * evidence. A CVE would not have helped: this package has no vulnerability, it
 * has a maintainer somebody logged into.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';

const ID = 'third-party';

export const THIRD_PARTY: Scenario = {
  id: ID,
  title: 'Third Party',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 10:05 at Ridgeline Medical Group. The patient portal deployed normally this morning ' +
    'and every test passed. One alert from the build environment has been sitting in the queue ' +
    'since 09:14. Nothing here was broken into.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'vulnerability-analyst',
    'detection-engineer',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Outbound connection from build agent rmg-ci-03 to an address not in the allowlist',
      detail:
        'Egress filtering permitted a connection from the build agent to 203.0.113.140:8443 at ' +
        '09:14, during a scheduled build. Build agents hold a broad egress exception because they ' +
        'fetch dependencies from the public internet. The connection lasted eleven seconds and ' +
        'transferred 4 KB. Rule history: fired 6 times in thirty days, 6 closed as expected build ' +
        'traffic.',
      source: 'rmg-ci-03',
      target: '203.0.113.140:8443',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 150,
      surface: 'process-tree',
      summary: 'Package install step spawned a shell during dependency resolution',
      detail:
        'The build ran the dependency install and one package executed a post-install script that ' +
        'spawned a shell, which read an environment variable block and invoked a network client. ' +
        'Post-install scripts are a normal feature of this package manager and roughly one in ' +
        'twelve dependencies in this project uses one. This package has never had one before.',
      source: 'rmg-ci-03',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'raw-log',
      summary: 'Dependency resolved to a version published four hours before the build',
      detail:
        'The lockfile permits a patch range. The build resolved a logging utility to 4.2.11, ' +
        'published at 05:02 that morning. The previous version, 4.2.10, had been current for ' +
        'seven months. The project has 340 transitive dependencies and this one is depended on by ' +
        'four of them rather than requested directly.',
      source: 'rmg-ci-03',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 450,
      surface: 'host-artefact',
      summary: 'The post-install script reads CI environment variables and posts them out',
      detail:
        'The added script enumerates the process environment, filters for names containing TOKEN, ' +
        'KEY, SECRET or PASSWORD, base64 encodes the result and posts it to a hardcoded address. ' +
        'It then exits zero so the build does not fail. The rest of the package is byte identical ' +
        'to 4.2.10 and its published functionality is unchanged.',
      source: 'rmg-ci-03',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 600,
      surface: 'alert-queue',
      summary: 'Twelve other repositories resolved the same version in overnight builds',
      detail:
        'The artefact registry shows 4.2.11 present in twelve other build outputs across the ' +
        'organisation since 05:02, including two that deploy to production and one that builds the ' +
        'nightly container base image. All twelve resolved it through a patch range in the same ' +
        'way.',
      source: 'artifact-registry',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 720,
      surface: 'network-flow',
      summary: 'Build agents have made no prior connection to this address in 200 builds',
      detail:
        'Flow history for rmg-ci-03 covers 200 builds over ninety days. Destinations are the ' +
        'package registry, the container registry, the internal artefact store and two vendor ' +
        'endpoints. 203.0.113.140 appears in none of them. The address itself has no history ' +
        'anywhere in the estate.',
      source: 'rmg-ci-03',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 850,
      surface: 'alert-queue',
      summary: 'Vulnerability scanner reports 31 new findings against the portal image',
      detail:
        'The nightly scan of the deployed portal image returned 31 findings, 4 of them rated high. ' +
        'All 31 are in the base operating system layer and every one has been present in this ' +
        'image for at least three months. The base image was last rebuilt in June. Rule history: ' +
        'fired 30 times in thirty days, 30 closed as known backlog.',
      source: 'scanner',
      claimedSeverity: 'medium',
    },
  ],
};

export const THIRD_PARTY_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Somebody took over the account of a maintainer of a small logging utility used by four of the portal dependencies.',
    'At 05:02 they published 4.2.11, byte identical to the last release apart from an added post-install script.',
    'Every build in the organisation with a patch range on that package picked it up automatically, exactly as designed.',
    'On install the script harvested CI environment variables matching TOKEN, KEY, SECRET and PASSWORD, and posted them out.',
    'It exited zero, so every build passed and every test passed.',
    'Thirteen builds ran it, two of them deploying to production. Nothing was broken into and no control failed.',
    'The credentials that were in those build environments are now outside the organisation, and they still work.',
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
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.declare', 'act.write-rule'],
      escalateTo: ['network-analyst', 'log-analyst'],
      why:
        'Eleven seconds and 4 KB from a machine whose entire job is talking to the internet, on a ' +
        'rule that has been wrong six times out of six. Every reason to close it. The one that ' +
        'matters is that build agents talk to a SMALL, STABLE set of destinations, so "not in the ' +
        'allowlist" means something on this host that it would not mean on a laptop. And 4 KB is ' +
        'not a small amount of data, it is roughly the size of a set of credentials, which is the ' +
        'reframing this event exists to teach: volume tells you about files, not about secrets.',
      standIn:
        'Build agent made an eleven second connection to an address outside the allowlist during a ' +
        'build, 4 KB out. Rule has been wrong six of six this month. Raising it because build ' +
        'agents normally talk to four places and this is not one of them.',
      commandOptions: [
        'grep 203.0.113.140 /var/log/flows.log',
        "awk '$2==\"rmg-ci-03\" {print $4}' /var/log/flows.log | sort -u",
        'netstat -an | grep 8443',
        'systemctl status build-agent',
        'cat /var/log/ci/build-4417.log | tail -40',
      ],
      commandNudge:
        'List every destination this build agent has ever talked to and see how long the list is.',
      guidance:
        'A machine that is supposed to reach the internet still reaches a short list of places. ' +
        'Ask what is normally on it.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'execution',
      techniques: ['T1195.002', 'T1059.004'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['malware-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.write-rule'],
      escalateTo: ['malware-analyst', 'ir-lead'],
      why:
        'A post-install script spawning a shell is a completely normal thing for this ecosystem, ' +
        'which is what makes it usable as an attack. One in twelve dependencies here does it, so ' +
        'the behaviour cannot be the detection. The finding is the DIFFERENCE: this package has ' +
        'never had one. That comparison is only available to somebody who thinks to check what the ' +
        'last build did, and it is the single most useful habit this scenario teaches.',
      standIn:
        'Dependency install spawned a shell from a post-install script, which read the environment ' +
        'and made a network call. Post-install scripts are normal here. This package has never had ' +
        'one before.',
      commandOptions: [
        'cat /var/log/ci/build-4417.log | grep -A5 postinstall',
        'diff <(cat /var/log/ci/build-4416.log) <(cat /var/log/ci/build-4417.log)',
        'ps aux',
        'cat package.json',
        'ls -la node_modules/',
      ],
      commandNudge: 'Compare this build against the last successful one and see what is new.',
      guidance:
        'Normal behaviour from a package that has never done it before is still a change. Compare ' +
        'against the previous build.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1195.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.timeline'],
      outOfLaneActions: ['act.attribute-named', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['vulnerability-analyst', 'ir-lead'],
      why:
        'Four hours between publish and pull is the whole attack. A version that sat for seven ' +
        'months, replaced that morning, picked up automatically because the lockfile permits a ' +
        'patch range: that range is the vulnerability, and it is a deliberate engineering decision ' +
        'that gets security patches in quickly. Worth being clear in the debrief that pinning ' +
        'everything exactly has its own cost, so "pin your dependencies" is not the finding. The ' +
        'finding is that nothing in the pipeline noticed it was running code published this ' +
        'morning by a package it had never seen change.',
      standIn:
        'The logging utility resolved to 4.2.11, published at 05:02 today. 4.2.10 had been current ' +
        'for seven months. It came in through a patch range, four levels down, not requested ' +
        'directly.',
      commandOptions: [
        'cat package-lock.json | grep -A3 logging-util',
        'npm view logging-util time --json',
        'npm ls logging-util',
        'git log --oneline -5',
        'cat package.json | grep logging',
      ],
      commandNudge: 'Find out when that version was published relative to when the build ran.',
      guidance:
        'Ask how old the code in this build is. Something published hours ago is a different risk ' +
        'from something published last year.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1552.001', 'T1132.001'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.decode', 'act.sandbox'],
      outOfLaneActions: ['act.attribute-named', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'Decoding it is quick. The part that changes what the floor does is what it filtered for ' +
        'and that it exited zero. Filtering on TOKEN, KEY, SECRET and PASSWORD means the loss is ' +
        'not data, it is credentials, and credentials keep working after the incident is closed. ' +
        'Exiting zero means every build passed, which is why this ran thirteen times without ' +
        'anybody noticing. The rest of the package being byte identical to 4.2.10 is the other ' +
        'half: nothing about the package behaved differently, so no test could have caught it.',
      standIn:
        'The script enumerates the environment, filters for TOKEN, KEY, SECRET and PASSWORD, base64 ' +
        'encodes and posts to a hardcoded address, then exits zero. Everything else in the package ' +
        'is identical to the previous version. What was taken is credentials, and they are still ' +
        'valid.',
      commandOptions: [
        'cat node_modules/logging-util/postinstall.js',
        'echo "$PAYLOAD" | base64 -d',
        'strings node_modules/logging-util/index.js | head',
        'npm audit',
        'ls -la node_modules/logging-util/',
      ],
      commandNudge: 'Read what the script actually collects before it sends anything.',
      guidance:
        'Ask what was taken, not how much. Four kilobytes of credentials outlives four gigabytes ' +
        'of files.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1195.002'],
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.preserve', 'act.decode', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'This is the event that decides how big the morning is, and it is the one seat nobody ' +
        'thinks to ask. One compromised build is an incident on one host. Thirteen, including two ' +
        'production deployments and the nightly container base image, is an incident across the ' +
        'estate, and the base image means everything built from it tomorrow inherits the problem. ' +
        'The output is not a verdict, it is a number and a list, and no other seat can produce it.',
      standIn:
        'Twelve other builds pulled 4.2.11 since 05:02, all through the same patch range. Two ' +
        'deploy to production and one is the nightly container base image. Every credential that ' +
        'was in any of those build environments should be treated as gone.',
      commandNudge:
        'Find everything else in the organisation that resolved the same version this morning.',
      guidance:
        'Ask how many other things pulled this. One build is an incident. Thirteen is a different ' +
        'conversation.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1041'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'detection-engineer'],
      why:
        'Two hundred builds and four destinations. That is a baseline tight enough to be a control, ' +
        'and it is the answer to the question the debrief should end on: what would have caught ' +
        'this on the first build rather than the thirteenth. Not a threat feed, because the address ' +
        'was new and would not have been on one. Not a vulnerability scanner, because the package ' +
        'has no vulnerability. An allowlist on build agent egress would have, and this seat is the ' +
        'one holding the evidence that such a list is short enough to maintain.',
      standIn:
        'Two hundred builds over ninety days and the agents talk to four destinations, always the ' +
        'same four. This address appears in none of them and has no history anywhere in the ' +
        'estate.',
      commandOptions: [
        "awk '$2 ~ /rmg-ci/ {print $4}' /var/log/flows.log | sort -u",
        'grep -c 203.0.113.140 /var/log/flows.log',
        'cat /etc/allowlist.d/build-agents.conf',
        'netstat -rn',
        'dig -x 203.0.113.140',
      ],
      commandNudge:
        'Work out how many distinct destinations these agents have used across all their builds.',
      guidance:
        'Ask what a normal week looks like for this host. Then ask whether that list is short ' +
        'enough to enforce.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.scope-estate'],
      escalateTo: [],
      why:
        'Thirty-one real findings, four of them high, all genuinely present. Every one has been in ' +
        'the base image for three months and the scan has been saying so nightly. It arrives ' +
        'against the same image on the same morning, so a floor mid-incident will pull it in and ' +
        'spend twenty minutes on a three-month-old patch backlog while credentials are leaving. ' +
        'Being right about a vulnerability and wrong about its relevance is one of the more ' +
        'expensive mistakes available today, because it feels like work.',
      standIn:
        'Thirty-one scanner findings against the portal image, all in the base OS layer, all at ' +
        'least three months old, base image last rebuilt in June. Real, and not from this morning. ' +
        'Closing it.',
      commandOptions: [
        'cat /var/log/scanner/portal-latest.json | head -40',
        'grep -c "first_seen" /var/log/scanner/portal-latest.json',
        'docker history rmg/portal:latest',
        'cat Dockerfile',
        'npm audit --production',
      ],
      commandNudge: 'Check how long each of those findings has been in the image.',
      guidance:
        'Real findings are not automatically today findings. Check when they first appeared.',
    },
  ],
};
