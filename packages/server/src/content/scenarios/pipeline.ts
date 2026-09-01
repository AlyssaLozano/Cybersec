/**
 * Scenario 37: The Build Says So.
 *
 * The pipeline is production, and nobody treats it that way.
 *
 * HOW THIS DIFFERS FROM THE OTHER TWO SUPPLY CHAIN SCENARIOS
 *
 * `third-party` compromises a dependency somebody else published.
 * `signed-and-trusted` compromises a vendor's build system.
 * Here the compromised build system is ours.
 *
 * That changes what can be trusted. In the other two the artefact is wrong and
 * the source is fine, so a floor can read the source and reason forward. Here
 * the source is fine, the artefact is wrong, and the thing that turned one into
 * the other is the attacker. The git history is clean, every commit is signed by
 * a real engineer, every review was performed, and the deployed binary does not
 * match any of it.
 *
 * WHY DETECTION ENGINEERING LEADS
 *
 * Because the answer is a control rather than an investigation. What was
 * modified is knowable in ten minutes; what makes it never happen again is
 * comparing the artefact against the source it claims to come from, and nobody
 * does that because builds are assumed to be deterministic renderings of
 * commits. Building that comparison is this seat's work and it is the whole
 * point of the scenario.
 *
 * THE THING THAT MAKES IT HARD
 *
 * Every instinct says read the code. The code is clean and reading it more
 * carefully will not help.
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

const ID = 'the-build-says-so';

export const THE_BUILD_SAYS_SO: Scenario = {
  id: ID,
  title: 'The Build Says So',
  difficulty: 'advanced',
  durationMinutes: 60,
  situation:
    'It is 15:30 at Ridgeline Medical Group. The patient portal deployed on Tuesday and has been ' +
    'behaving normally since. An engineer running a local build noticed their binary does not ' +
    'match the one in production, built from the same commit.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'detection-engineer',
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
      summary: 'A local build of the deployed commit produces a different artefact',
      detail:
        'An engineer rebuilt release 4.19.2 from the tagged commit and got a binary whose hash does ' +
        'not match the one in the artefact registry or the one running in production. The build is ' +
        'reproducible: three engineers on three machines all produce the same hash as each other ' +
        'and a different one from production. Rule history: no rule exists for this and none has ' +
        'ever fired.',
      source: 'rmg-portal',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'raw-log',
      summary: 'The source history is clean and every commit is properly signed',
      detail:
        'The repository shows no unexpected commits, no force pushes and no history rewrites. Every ' +
        'commit in the release is signed by a known engineer key and every merge has a recorded ' +
        'review by a second engineer. The tag for 4.19.2 points where it should. Nothing in version ' +
        'control is wrong.',
      source: 'source repository',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'process-tree',
      summary: 'A build step ran that is not in the pipeline definition',
      detail:
        'The build log for the 4.19.2 job shows a step executing between compile and package that ' +
        'does not appear in the pipeline definition in the repository. It runs a script fetched ' +
        'from a path on the build runner itself. The step name matches the naming pattern of the ' +
        'genuine steps around it and its output is one line reading "optimising assets".',
      source: 'rmg-ci-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'host-artefact',
      summary: 'The runner has a modified build agent configuration',
      detail:
        'The build runner holds a local agent configuration file, modified on 2 August, that injects ' +
        'an additional step into every job matching the portal project. The file is outside the ' +
        'repository, is not under version control, and is not part of any deployment. The runner is ' +
        'a long-lived virtual machine that has not been rebuilt since it was provisioned in 2023.',
      source: 'rmg-ci-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'network-flow',
      summary: 'The injected step adds a route that reports authentication events outward',
      detail:
        'Comparing the two binaries, the production build contains an additional handler on the ' +
        'authentication path that posts a copy of successful login details to 198.51.100.62. Flow ' +
        'records confirm the production portal has been making those posts since Tuesday, once per ' +
        'successful login, roughly 4,100 so far.',
      source: 'rmg-portal',
      target: '198.51.100.62:443',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'The same runner builds eleven other services',
      detail:
        'rmg-ci-01 is one of four runners and handles builds for twelve services including the ' +
        'clinical results portal and the prescribing system. The agent configuration targets the ' +
        'portal project only, but nothing prevents it targeting others. No artefact in the registry ' +
        'has ever been verified against a rebuild from source.',
      source: 'rmg-ci-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'Nineteen builds failed overnight on a dependency resolution error',
      detail:
        'Nineteen jobs across four services failed between 01:00 and 04:00 with a dependency ' +
        'resolution timeout. The upstream package registry published a status notice for a ' +
        'four-hour degradation in the same window, and the jobs succeeded on retry this morning. ' +
        'Rule history: fired 61 times in thirty days, 60 closed as upstream registry issues.',
      source: 'rmg-ci-02',
      claimedSeverity: 'low',
    },
  ],
};

export const THE_BUILD_SAYS_SO_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'On 2 August somebody modified a build agent configuration file on the runner. The file sits outside the repository and is not under version control.',
    'It injects an extra step into every job for the portal project, between compile and package, named to match the genuine steps around it.',
    'The step runs a script held on the runner and prints one line saying optimising assets.',
    'That step adds a handler to the authentication path which posts a copy of every successful login outward.',
    'The source is untouched. Every commit is signed by a real engineer, every merge was reviewed, and the tag points where it should.',
    'So the code is clean, the artefact is not, and the thing that turned one into the other is the runner.',
    'Since Tuesday the production portal has posted roughly 4,100 successful logins to an external address.',
    'The runner has not been rebuilt since 2023, it builds twelve services including the prescribing system, and no artefact in the registry has ever been checked against a rebuild from source.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1195.002'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['detection-engineer', 'log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.reimage-now', 'act.isolate', 'act.declare'],
      escalateTo: ['detection-engineer', 'log-analyst'],
      why:
        'No rule produced this and none ever would: it arrives because an engineer happened to ' +
        'rebuild something and noticed. The reason it is not a build quirk is in the row. Three ' +
        'engineers on three machines produce the same hash as each other and a different one from ' +
        'production, so the build is deterministic and production is the outlier. Non-reproducible ' +
        'builds are common and usually boring, and this is the opposite: the build reproduces ' +
        'perfectly everywhere except in the place that matters. Taking it seriously with no rule ' +
        'and no alert behind it is the habit worth building.',
      standIn:
        'Engineer rebuilt 4.19.2 from the tagged commit and the hash does not match production or ' +
        'the registry. Three engineers on three machines agree with each other and disagree with ' +
        'production. The build is deterministic; production is the odd one out. No rule exists for ' +
        'this. Raising it.',
      commandOptions: [
        { command: 'sha256sum ./dist/portal-4.19.2 && curl -s https://registry.rmg/artifacts/portal/4.19.2.sha256', correct: true, teaches: CORRECT_STEP },
        { command: 'diff <(sha256sum dist/portal-4.19.2 | cut -d" " -f1) /var/registry/portal-4.19.2.sha256', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status rmg-portal', ...STATUS_CHECK },
        { command: 'cat /var/log/ci/build-4192.log', ...DUMP_ALL },
        { command: 'grep -c BUILD /var/log/ci/build-4192.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Compare the hash of a fresh build against the one in the registry and the one running.',
      guidance:
        'Ask whether the build is reproducible. If it is everywhere except production, production ' +
        'is the anomaly.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      firstResponder: 'log-analyst',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['detection-engineer', 'ir-lead'],
      why:
        'Graded a true positive because the finding is correct: the source really is clean. No ' +
        'unexpected commits, no force pushes, no rewrites, every commit signed by a known key, every ' +
        'merge reviewed, tag pointing where it should. Establishing that properly is real work and ' +
        'the result is the opposite of reassuring. Every instinct on a compromised release says ' +
        'read the code, and here the code is fine and reading it harder will not help. What this ' +
        'row does is force the question that solves the scenario: if the input is correct and the ' +
        'output is wrong, the thing between them is the problem, and nobody has looked at it because ' +
        'builds are assumed to be a deterministic rendering of commits.',
      standIn:
        'The repository is clean. No unexpected commits, no force pushes, no history rewrites, every ' +
        'commit signed by a known engineer key, every merge reviewed, tag points where it should. ' +
        'The source is not the problem. Input is right and output is wrong, so it is the thing in ' +
        'between.',
      commandOptions: [
        { command: 'git -C /srv/portal log --show-signature v4.19.1..v4.19.2 | grep -c "Good signature"', correct: true, teaches: CORRECT_STEP },
        { command: 'git -C /srv/portal reflog --date=iso | head -30', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status gitea', ...STATUS_CHECK },
        { command: 'cat /srv/portal/.git/logs/HEAD', ...DUMP_ALL },
        { command: 'git -C /srv/portal log --oneline | wc -l', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether anything in version control was tampered with, and be ready for the answer ' +
        'to be no.',
      guidance:
        'If the source is clean and the binary is not, ask what sits between them.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'execution',
      critical: true,
      techniques: ['T1195.002'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['log-analyst', 'malware-analyst'],
      correctActions: ['act.backtest', 'act.propose-rule'],
      outOfLaneActions: ['act.reimage-now', 'act.isolate', 'act.write-rule', 'act.dismiss'],
      escalateTo: ['ir-lead', 'malware-analyst'],
      why:
        'The mechanism, found by comparing what ran against what the definition says should run. A ' +
        'step between compile and package that is not in the pipeline definition, named to match ' +
        'the genuine steps around it, printing one bland line. Nobody reads a green build log, and ' +
        'a step called something plausible that says "optimising assets" is invisible to anybody ' +
        'who is not diffing it against the definition. That comparison is the detection this ' +
        'scenario is really about: the pipeline definition is in version control and the executed ' +
        'steps are in the log, and nothing anywhere compares them.',
      standIn:
        'The 4.19.2 build ran a step between compile and package that is not in the pipeline ' +
        'definition. Named to match the real steps, runs a script held on the runner, prints ' +
        'optimising assets and nothing else. Nobody reads a green build log. The definition is in ' +
        'git and the executed steps are in the log, and we compare them nowhere.',
      commandOptions: [
        { command: 'diff <(yq ".jobs.build.steps[].name" /srv/portal/.ci/pipeline.yaml) <(grep "^== step:" /var/log/ci/build-4192.log | cut -d: -f2)', correct: true, teaches: CORRECT_STEP },
        { command: 'grep "^== step:" /var/log/ci/build-4192.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status ci-runner', ...STATUS_CHECK },
        { command: 'cat /var/log/ci/build-4192.log', ...DUMP_ALL },
        { command: 'grep -c step /var/log/ci/build-4192.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Compare the steps that actually ran against the steps the pipeline definition declares.',
      guidance:
        'The build succeeded, so nobody read the log. Ask whether everything in it was supposed to ' +
        'be there.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      techniques: ['T1543', 'T1195.002'],
      firstResponder: 'forensics',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.dismiss'],
      escalateTo: ['ir-lead', 'vulnerability-analyst'],
      why:
        'Where the extra step comes from, and why nothing in the repository shows it. A local agent ' +
        'configuration modified on 2 August, outside the repository, not under version control, not ' +
        'part of any deployment. So the pipeline as reviewed by engineers and the pipeline as ' +
        'executed by the runner are two different things, and only one of them is auditable. The ' +
        'runner has not been rebuilt since 2023, which is the underlying condition: a long-lived ' +
        'machine accumulates state that nobody reviews and nothing resets, and an ephemeral runner ' +
        'would have discarded this within an hour. Preserve before anybody rebuilds it, because ' +
        'the instinct on a compromised build server is to reprovision immediately and that destroys ' +
        'the only copy of the injected script.',
      standIn:
        'There is a local build agent configuration on the runner, modified 2 August, that injects ' +
        'an extra step into every portal job. Outside the repository, not in version control, not ' +
        'deployed by anything. The pipeline engineers review and the pipeline the runner executes ' +
        'are different documents. That box has not been rebuilt since 2023. Imaged and sealed ' +
        'before anybody reprovisions it.',
      commandOptions: [
        { command: 'find /etc/ci-agent /opt/runner -newermt "2026-08-01" -type f -ls', correct: true, teaches: CORRECT_STEP },
        { command: 'stat /etc/ci-agent/agent.conf && cat /etc/ci-agent/agent.conf', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status ci-runner', ...STATUS_CHECK },
        { command: 'cat /var/log/syslog', ...DUMP_ALL },
        { command: 'rm -f /etc/ci-agent/agent.conf && systemctl restart ci-runner', ...MUTATE },
      ],
      commandNudge:
        'Look for configuration on the runner itself that is not in the repository.',
      guidance:
        'The extra step is not in git. Ask what else could be telling the runner to run it.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1056', 'T1041'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.decode', 'act.sandbox'],
      outOfLaneActions: ['act.contact-attacker', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'What it does, and the method is worth as much as the answer. Diffing the two binaries is ' +
        'possible only because a clean rebuild exists, which is the same property that surfaced ' +
        'this in the first place. The production build carries an extra handler on the ' +
        'authentication path that posts successful login details outward, and flow records confirm ' +
        'it has been doing so since Tuesday, once per login, about 4,100 times. That number is the ' +
        'sentence the organisation needs: it is not a possible exposure, it is a count of ' +
        'credentials already sent. Rotation for all of them, and it does not wait for the rest of ' +
        'the investigation.',
      standIn:
        'Diffing the clean rebuild against production: the production binary has an extra handler on ' +
        'the authentication path that posts successful login details to an external address. Flow ' +
        'records confirm it since Tuesday, once per successful login, about 4,100 so far. Those are ' +
        'credentials already gone, not a possible exposure. Rotation starts now.',
      commandOptions: [
        { command: 'radiff2 -A ./dist/portal-4.19.2 /opt/portal/current/portal | head -40', correct: true, teaches: CORRECT_STEP },
        { command: "awk '$4 ~ /198.51.100.62/ {print $1}' /var/log/flows.log | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status rmg-portal', ...STATUS_CHECK },
        { command: 'strings /opt/portal/current/portal', ...DUMP_ALL },
        { command: 'curl -sI https://198.51.100.62', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'You have a clean build and a bad one. Compare them and find what the difference does.',
      guidance:
        'Ask what the extra code actually does, then find out how long it has been doing it.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'discovery',
      critical: true,
      techniques: ['T1195.002'],
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.preserve', 'act.reimage-now', 'act.isolate', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The scope, and it is much larger than the portal. That runner builds twelve services ' +
        'including the clinical results portal and the prescribing system, and although the ' +
        'injected configuration targets the portal project only, that is a line in a file somebody ' +
        'else controls. The sentence that decides the work is the last one: no artefact in the ' +
        'registry has ever been verified against a rebuild from source. So every artefact this ' +
        'runner has produced since 2 August is unverified, and possibly since 2023, and the only ' +
        'way to know is to rebuild them and compare. That is days of work and it is the honest ' +
        'recommendation. A prescribing system built by a compromised runner is not a thing to ' +
        'assume is fine.',
      standIn:
        'That runner builds twelve services including clinical results and prescribing. The injected ' +
        'config targets the portal today, and that is one line in a file they control. Nothing in ' +
        'the registry has ever been verified against a rebuild from source, so every artefact from ' +
        'that runner is unverified. Rebuilding and comparing all twelve is days of work and I do ' +
        'not see an alternative.',
      commandOptions: [
        { command: 'grep -rl "rmg-ci-01" /srv/deploy/*/pipeline.yaml', correct: true, teaches: CORRECT_STEP },
        { command: "awk '$3==\"rmg-ci-01\" {print $5}' /var/log/ci/jobs.log | sort -u", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status ci-runner', ...STATUS_CHECK },
        { command: 'cat /var/log/ci/jobs.log', ...DUMP_ALL },
        { command: 'grep -c rmg-ci-01 /var/log/ci/jobs.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find every service that runner has built, and check whether any of them has ever been ' +
        'verified.',
      guidance:
        'One artefact was tampered with. Ask what else that machine has produced and whether anybody ' +
        'checked it.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss', 'act.tune'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: [],
      why:
        'Nineteen build failures overnight on the afternoon the floor has found a compromised build ' +
        'system. It is an upstream package registry degradation with a published status notice in ' +
        'the same window, on a different runner, and the jobs succeeded on retry. Sixty of ' +
        'sixty-one this month were the same. Three checks and all agree: which runner, is there an ' +
        'upstream notice, did they pass on retry. The reason it is worth resisting is direction: ' +
        'these builds failed loudly and the one that mattered succeeded quietly. A floor that ' +
        'spends the evening on nineteen visible failures has been pulled away from the twelve ' +
        'services that need rebuilding and comparing.',
      standIn:
        'Nineteen overnight failures are all rmg-ci-02, all dependency resolution timeouts, and the ' +
        'upstream registry published a four hour degradation in the same window. They all passed on ' +
        'retry this morning. Sixty of sixty-one this month were the same. These failed loudly; ours ' +
        'succeeded quietly. Closing it.',
      commandOptions: [
        { command: "awk '$4==\"FAILED\" {print $3}' /var/log/ci/jobs.log | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "registry\\|upstream" /var/log/ci/status-notices.log | tail', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status ci-runner', ...STATUS_CHECK },
        { command: 'cat /var/log/ci/jobs.log', ...DUMP_ALL },
        { command: 'grep -c FAILED /var/log/ci/jobs.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check which runner those failures were on and whether the upstream registry had a problem.',
      guidance:
        'Builds failing is loud and usually boring. Ask which runner, and whether yours is among ' +
        'them.',
    },
  ],
};
