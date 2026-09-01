/**
 * Scenario 64: Built In.
 *
 * A full intrusion with nothing to analyse. No dropped file, no unsigned
 * binary, nothing on disk that was not on the clean install.
 *
 * WHAT THIS TEACHES
 *
 * That the absence of malware is a finding rather than an absence of findings,
 * and that a malware analyst's value on a night like this is what they can say
 * about behaviour once there is no sample.
 *
 * Everything the intruder used ships with the operating system. Certificate
 * tooling decoded the payload, management instrumentation ran it on the next
 * host, a scheduled task kept it, and every executable in the chain is signed
 * by the vendor and present on four thousand other machines. There is nothing
 * to hash, nothing to submit, nothing to detonate, and no indicator that means
 * anything to anybody else.
 *
 * WHAT REPLACES THE SAMPLE
 *
 * Sequence and timing. Individually every command is an administrator doing
 * their job. In this order, four seconds apart, at 23:47, by an account that
 * has never run any of them, it is an intrusion. That is the whole
 * discrimination, and it exists only in command line telemetry that most of the
 * estate does not collect.
 *
 * EXPERT INSTRUMENTS IN USE
 *
 * One seat receives the command line truncated at four thousand and ninety-six
 * characters and another receives it whole, and the part that got cut is the
 * part that matters. The initial access is withheld, so the floor holds
 * execution and persistence and no way in. And one session at 23:40 cannot be
 * attributed to the intruder or to the on-call administrator, because they used
 * the same account and the same tools in the same hour, and the logging that
 * would separate them is enabled only inside the cardholder scope.
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

const ID = 'built-in';

export const BUILT_IN: Scenario = {
  id: ID,
  title: 'Built In',
  difficulty: 'expert',
  durationMinutes: 90,
  situation:
    'It is 06:30 at Fenmarch Credit Union. An endpoint alert from last night is still open because ' +
    'the overnight shift could not find a file to look at.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'forensics',
    'cloud-security',
    'threat-intel',
    'detection-engineer',
    'fusion-analyst',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Suspicious scripting activity on FCU-SRV-22, raised at 23:47 and still open',
      detail:
        'The endpoint platform raised a medium alert at 23:47 for encoded scripting activity on ' +
        'FCU-SRV-22, a build and deployment server. The overnight analyst found no file to submit ' +
        'and left it open with a note reading "no artefact". Rule history: this rule fired 906 ' +
        'times in thirty days, 903 closed as administrative activity and 3 closed as the patching ' +
        'system.',
      source: 'FCU-SRV-22',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 160,
      surface: 'process-tree',
      summary: 'The command line runs to eleven thousand characters',
      detail:
        'The recorded command line is 11,204 characters. It begins with a base64 block, and past ' +
        'the four thousandth character it decodes an embedded blob to a temporary path, invokes ' +
        'certificate tooling to convert it, loads the result into memory without writing an ' +
        'executable, and finishes by registering a scheduled task named ' +
        'FenmarchBuildCacheMaintenance. The parent process is the deployment agent service.',
      expertDetail:
        'The command line as recorded by the endpoint platform is truncated at 4,096 characters ' +
        'and ends mid-token inside a base64 block. What is visible is an encoded command ' +
        'invocation with no observable file operations, no network calls and no persistence. The ' +
        'platform records no indication that the value was cut.',
      expertAlsoOn: ['alert-queue'],
      source: 'FCU-SRV-22',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'host-artefact',
      summary: 'Nothing was written to disk that was not already there',
      detail:
        'Every executable in the chain is a signed operating system component present on a clean ' +
        'install and on 4,100 other machines in the estate. File system comparison against the ' +
        'build image finds no new executable, no new library and no modified system binary. The ' +
        'one file written was a temporary blob, deleted 900 milliseconds after it was read. There ' +
        'is no sample to hash, submit or detonate.',
      source: 'FCU-SRV-22',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 480,
      surface: 'raw-log',
      summary: 'The same five steps ran on four more servers, four seconds apart each time',
      detail:
        'Between 23:47 and 00:12 the identical five step sequence ran on FCU-SRV-22, 24, 31, 33 ' +
        'and 40. Each host shows the same ordering with a mean gap of 4.1 seconds between steps ' +
        'and 5 to 7 minutes between hosts, invoked remotely through management instrumentation. ' +
        'All five hosts are in the deployment estate. Every individual command in the sequence ' +
        'appears somewhere in normal administrative activity across the estate on any given day.',
      source: 'deployment estate',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 640,
      surface: 'host-artefact',
      withheldAtExpert: true,
      summary: 'A remote support session opened on FCU-SRV-22 at 23:39',
      detail:
        'The remote support tool installed by the service desk records an inbound session to ' +
        'FCU-SRV-22 beginning at 23:39:04, authenticated with the svc-deploy credential, from ' +
        '198.51.100.31. The session lasted eleven minutes. The credential also appears in a ' +
        'deployment pipeline configuration file that was committed to an internal repository in ' +
        'February and never rotated.',
      source: 'FCU-SRV-22',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 800,
      surface: 'cloud-audit',
      summary: 'The account is shared, non-interactive by policy, and used by nine pipelines',
      detail:
        'svc-deploy is a shared service account used by nine deployment pipelines and by the ' +
        'deployment agent on 22 servers. Policy states it is non-interactive; nothing enforces ' +
        'that. It has local administrator rights on all 22 hosts. It has never before run ' +
        'certificate tooling, scripting or management instrumentation interactively: 180 days of ' +
        'history shows only pipeline invocations of four specific deployment scripts.',
      source: 'svc-deploy',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 960,
      surface: 'raw-log',
      expertOnly: true,
      summary: 'One session at 23:40 could be the intruder or the on-call administrator',
      detail:
        'A scripting session on FCU-SRV-22 between 23:40 and 23:44 enumerated services, read two ' +
        'configuration files and queried the event log. It ran under svc-deploy, which the on-call ' +
        'administrator also uses when responding out of hours. She was paged at 23:31 for a failed ' +
        'deployment, says she ran some checks and does not remember which. Session transcript ' +
        'logging is enabled only on servers inside the cardholder scope, and FCU-SRV-22 is not one.',
      source: 'FCU-SRV-22',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.8',
      atSeconds: 1120,
      surface: 'network-flow',
      summary: 'Forty megabytes left over six hours in half megabyte pieces',
      detail:
        'Between 00:20 and 06:05 FCU-SRV-31 sent 40.2 megabytes to a commercial cloud storage ' +
        'provider in 512 kilobyte requests at irregular intervals of 40 to 200 seconds. The estate ' +
        'uses the same provider for three approved integrations, all from different hosts, all in ' +
        'business hours. FCU-SRV-31 holds the deployment artefact repository and the signing ' +
        'configuration for the mobile banking application.',
      source: 'FCU-SRV-31',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1280,
      surface: 'alert-queue',
      summary: 'There is nothing here that identifies anybody',
      detail:
        'No custom tooling, no unique strings, no infrastructure that is not a commercial cloud ' +
        'provider, and no reused indicator. The technique set is documented in public tradecraft ' +
        'guidance and is used by state programmes, criminal groups and penetration testers alike. ' +
        'The only distinguishing characteristics available are the ordering of the five steps, the ' +
        'four second cadence, the choice of the deployment estate, and an operating window of ' +
        '23:39 to 06:05.',
      source: 'assessment',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.10',
      atSeconds: 1440,
      surface: 'host-artefact',
      summary: 'The scheduled task is now in the configuration management baseline',
      detail:
        'FenmarchBuildCacheMaintenance exists on all five hosts. On FCU-SRV-22 it was also added ' +
        'to the configuration management desired state at 00:14, committed by svc-deploy against ' +
        'the deployment estate policy. Configuration management enforces desired state every 30 ' +
        'minutes across all 22 hosts. Rebuilding any of these servers from the image restores the ' +
        'task within half an hour of the host rejoining.',
      source: 'configuration management',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.11',
      atSeconds: 1600,
      surface: 'alert-queue',
      summary: 'The deployment estate builds and signs the mobile banking application',
      detail:
        'The 22 hosts run all builds and releases for Fenmarch, including the mobile banking ' +
        'application used by 84,000 members. A release is scheduled for 11:00 today. Disabling ' +
        'svc-deploy stops all nine pipelines and the deployment agent on every host. Stopping ' +
        'configuration management enforcement leaves 22 servers unmanaged. The signing ' +
        'configuration on FCU-SRV-31 has not been verified since the intrusion began.',
      source: 'engineering operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.12',
      atSeconds: 1760,
      surface: 'raw-log',
      summary: 'Command line logging covers two fifths of the estate and truncates at 4,096',
      detail:
        'Full command line capture is enabled on 1,640 of 4,100 endpoints, having been rolled out ' +
        'to servers and stopped when storage costs were reviewed in 2024. Where it is enabled the ' +
        'endpoint platform truncates the recorded value at 4,096 characters and does not mark it ' +
        'as truncated. The only complete record of last night exists because FCU-SRV-22 also runs ' +
        'script block logging, which four servers in the estate have.',
      source: 'detection coverage',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.13',
      atSeconds: 1920,
      surface: 'alert-queue',
      summary: 'The same rule fired eleven times overnight on other hosts',
      detail:
        'Eleven further firings between 01:00 and 04:00 across eleven hosts, all invoking encoded ' +
        'scripting from the patch orchestration service. All eleven command lines are 310 ' +
        'characters, identical apart from a package name, and decode to a package installation ' +
        'call. All eleven ran under svc-patch, within the Tuesday patch window recorded in the ' +
        'change system, on hosts in the patch group.',
      source: 'patch orchestration',
      claimedSeverity: 'medium',
    },
  ],
};

export const BUILT_IN_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'At 23:39 somebody opened a remote support session to FCU-SRV-22 using svc-deploy, a shared service account whose credential was committed to an internal repository in a pipeline configuration file in February and never rotated.',
    'At 23:47 they ran a single 11,204 character command that decoded an embedded blob, used certificate tooling to convert it, loaded the result into memory without writing an executable, and registered a scheduled task called FenmarchBuildCacheMaintenance.',
    'Every executable in that chain ships with the operating system, is signed by the vendor, and exists on 4,100 other machines. Nothing was written to disk except a temporary blob deleted 900 milliseconds after it was read. There is no sample.',
    'The same five steps then ran on four more deployment servers between 23:47 and 00:12, four seconds apart within each host and five to seven minutes apart between them, invoked through management instrumentation.',
    'At 00:14 the scheduled task was added to the configuration management desired state, which enforces every thirty minutes across all 22 hosts, so rebuilding a server restores the task within half an hour of it rejoining.',
    'Between 00:20 and 06:05 FCU-SRV-31, which holds the deployment artefact repository and the signing configuration for the mobile banking application, sent 40.2 megabytes to a commercial cloud storage provider in 512 kilobyte pieces.',
    'The account has local administrator rights on all 22 hosts, is documented as non-interactive with nothing enforcing that, and in 180 days had only ever run four specific deployment scripts from pipelines.',
    'A release of the mobile banking application, used by 84,000 members, is scheduled for 11:00.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'execution',
      techniques: ['T1059.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['malware-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['malware-analyst', 'ir-lead'],
      why:
        'Nine hundred and three of nine hundred and six were administrators, so the base rate says ' +
        'close it, and the overnight analyst did something better and worse than that: they left ' +
        'it open with a note saying there was no artefact. That note is the finding, read the ' +
        'right way round. A process that ran, on a build server, at 23:47, leaving nothing to ' +
        'submit, is not an alert with insufficient evidence; it is an alert whose evidence is of a ' +
        'kind this floor is not set up to receive. The instinct to look for a file is correct ' +
        'nineteen times out of twenty and it is the instinct that lost seven hours here. Raise it ' +
        'and declare, because a build and deployment server is where this credit union makes the ' +
        'software its members run, and the cost of being wrong about that at 06:30 is not ' +
        'symmetrical.',
      standIn:
        'Alert from 23:47 on a build server, still open, and the overnight note says no artefact. ' +
        'Nine hundred and three of nine hundred and six of these are administrators, so probably ' +
        'nothing, except that the note is the interesting part. Something ran and left nothing to ' +
        'submit. That is not weak evidence, that is evidence we are not set up to receive. ' +
        'Declaring, because this is the box where our mobile banking app gets built.',
      commandOptions: [
        { command: "awk -F, '$3==\"ENCODED_SCRIPT\" {print $1, $2, $6}' /var/log/edr/alerts.csv | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "FCU-SRV-22" /var/log/edr/alerts.csv | tail', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status edr-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/edr/alerts.csv', ...DUMP_ALL },
        { command: 'grep -c ENCODED_SCRIPT /var/log/edr/alerts.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out what that alert was raised on and what the overnight analyst looked for.',
      guidance:
        'The note says there was no file. Ask whether that makes it less interesting or more.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'execution',
      critical: true,
      techniques: ['T1059.001', 'T1140', 'T1027'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['log-analyst', 'forensics', 'ir-lead'],
      correctActions: ['act.decode', 'act.ttp-map'],
      outOfLaneActions: ['act.sandbox', 'act.reimage-now', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'Two seats are looking at one command and one of them is looking at a third of it. The full ' +
        'record runs to 11,204 characters and everything that matters is past the four thousandth: ' +
        'the decode to a temporary path, the certificate tooling conversion, the load into memory ' +
        'with no executable written, and the scheduled task registration. The endpoint platform ' +
        'cuts its recorded value at 4,096 characters and does not mark that it has done so, so the ' +
        'seat reading that copy sees an encoded invocation with no file operations, no network and ' +
        'no persistence, and reasonably concludes there is not much here. That is not a disagreement ' +
        'about interpretation, it is one source being silently incapable of holding the evidence, ' +
        'and the tell is available: a value that ends mid-token inside a base64 block did not end, ' +
        'it stopped. Establish which copy is complete before anybody reasons from either, and note ' +
        'the general form for later, because a truncation that is not labelled is worse than no ' +
        'logging at all.',
      standIn:
        'We are looking at one command and one of us has a third of it. The full thing is 11,204 ' +
        'characters and everything that matters is past four thousand: decode to temp, certificate ' +
        'tooling conversion, load into memory with nothing written, scheduled task registered. The ' +
        'endpoint platform cuts at 4,096 and does not say it has, so the other copy looks like an ' +
        'encoded command that does nothing much. The tell is that it ends mid-token inside a ' +
        'base64 block. It did not end, it stopped. Nobody reasons from that copy.',
      commandOptions: [
        { command: 'jq -r \'.[] | select(.host=="FCU-SRV-22") | .command\' /var/log/scriptblock/22.json | wc -c', correct: true, teaches: CORRECT_STEP },
        { command: "grep -o 'schtasks[^;]*' /var/log/scriptblock/22.json", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status edr-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/edr/alerts.csv', ...DUMP_ALL },
        { command: 'grep -c powershell /var/log/edr/alerts.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Measure the length of the recorded command and compare it against a second source.',
      guidance:
        'Two records of one command do not match. Ask whether one of them was cut.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1218', 'T1620'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.decode', 'act.ttp-map'],
      outOfLaneActions: ['act.sandbox', 'act.reimage-now', 'act.dismiss', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'detection-engineer'],
      why:
        'The absence is the report, and stating it precisely is the job on this row. Every ' +
        'executable in the chain is a signed operating system component present on the clean ' +
        'install and on 4,100 other machines. File system comparison against the build image finds ' +
        'no new executable, no new library and no modified system binary. One temporary blob was ' +
        'written and deleted 900 milliseconds after it was read. So there is no sample, no hash ' +
        'worth circulating, nothing to submit and nothing to detonate, and every one of those is a ' +
        'statement about what was done rather than about what was missed. Say it in a form the ' +
        'floor can act on: no file means signature-based controls could not have helped and cannot ' +
        'help now, containment cannot be scoped by finding copies of something, and anybody who ' +
        'asks for indicators of compromise should be told there are none and offered behaviour ' +
        'instead. Reaching for a sandbox here is the reflex to resist, because there is nothing to ' +
        'put in it and forty minutes will go by.',
      standIn:
        'There is no malware, and that is the report rather than the lack of one. Every executable ' +
        'in the chain ships with the operating system, is signed, and is on 4,100 other machines. ' +
        'Comparison against the build image finds nothing new and nothing modified. One temporary ' +
        'blob, deleted 900 milliseconds after it was read. So there is nothing to hash, nothing to ' +
        'submit, nothing to detonate. Signatures could not have caught this and cannot help us ' +
        'now, we cannot scope containment by hunting copies of a file, and if anybody asks for ' +
        'indicators the answer is that there are none and here is the behaviour instead.',
      commandOptions: [
        { command: 'diff <(sort /evidence/srv22/filelist.txt) <(sort /evidence/baseline/build-image.txt)', correct: true, teaches: CORRECT_STEP },
        { command: "awk '$3==\"CREATE\" || $3==\"MODIFY\"' /evidence/srv22/fs-events.csv | grep -vi temp", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status edr-agent', ...STATUS_CHECK },
        { command: 'cat /evidence/srv22/fs-events.csv', ...DUMP_ALL },
        { command: 'grep -c CREATE /evidence/srv22/fs-events.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Compare the file system against the build image and establish what is genuinely new.',
      guidance:
        'You cannot find the malware. Ask whether that is because you are looking wrong or because ' +
        'there is not any.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'lateral-movement',
      critical: true,
      techniques: ['T1047', 'T1059.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.isolate', 'act.dismiss', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'With no sample, the sequence is the sample. Five identical steps on five hosts between ' +
        '23:47 and 00:12, 4.1 seconds apart within a host and five to seven minutes between them, ' +
        'invoked remotely through management instrumentation. Every command in it appears in ' +
        'normal administrative activity somewhere in the estate on any given day, which is exactly ' +
        'why nothing caught it, and none of that survives the ordering: administrators do these ' +
        'things in response to problems, in whatever order the problem suggests, with pauses while ' +
        'they think. Four seconds is a script, and the same script five times is an operation. ' +
        'This is what replaces the hash, and it is worth saying so out loud, because the timeline ' +
        'is the only thing on this floor tonight that can scope the incident, and it will be the ' +
        'only thing that can prove it is over.',
      standIn:
        'The sequence is the sample. Same five steps on five hosts between 23:47 and 00:12, 4.1 ' +
        'seconds apart inside a host, five to seven minutes between them, all through management ' +
        'instrumentation. Every one of those commands turns up in normal admin work every day, ' +
        'which is why nothing fired, and none of that survives the ordering. Administrators do ' +
        'these things in the order the problem suggests, with pauses while they think. Four ' +
        'seconds is a script. The same script five times is an operation, and this timeline is the ' +
        'only thing that can scope us tonight.',
      commandOptions: [
        { command: "awk -F, '$4==\"WMI_EXEC\" {print $1, $2, $5}' /var/log/deploy-estate/exec.csv | sort", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '{print $2}' /var/log/deploy-estate/exec.csv | sort | uniq -c | sort -rn", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status winrm', ...STATUS_CHECK },
        { command: 'cat /var/log/deploy-estate/exec.csv', ...DUMP_ALL },
        { command: 'grep -c WMI_EXEC /var/log/deploy-estate/exec.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look for the same ordering of steps on other hosts, and measure the gap between them.',
      guidance:
        'You have no file to search for. Ask what else could be searched for instead.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1078.003', 'T1552.001'],
      firstResponder: 'forensics',
      alsoAppropriate: ['cloud-security', 'log-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.reset-password', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'The way in, eight minutes before anything ran. A remote support session to FCU-SRV-22 at ' +
        '23:39:04 authenticated with svc-deploy from an external address, lasting eleven minutes, ' +
        'through the tool the service desk installed for its own use. The credential is in a ' +
        'pipeline configuration file committed to an internal repository in February and never ' +
        'rotated, which means the intrusion did not require an exploit, a phishing message or a ' +
        'vulnerability: it required read access to a repository and seven months of nobody ' +
        'looking. Where this record is not available, the shape still demands the question. ' +
        'Execution and persistence are established and something authenticated as this account ' +
        'before both, so a floor holding only the middle of an intrusion should say plainly that ' +
        'the way in is unaccounted for rather than describing the incident as beginning at 23:47. ' +
        'Preserve the session record and the repository history together, and note that rotating ' +
        'the credential is not a containment on its own while the file it lives in is still in ' +
        'every clone anybody has taken.',
      standIn:
        'Here is the way in, eight minutes before anything ran. Remote support session to SRV-22 at ' +
        '23:39:04, svc-deploy, external address, eleven minutes, through the tool the service desk ' +
        'installed. That credential is in a pipeline config committed to an internal repo in ' +
        'February and never rotated. No exploit, no phishing, no vulnerability. Read access to a ' +
        'repository and seven months of nobody looking. Preserving the session record and the repo ' +
        'history together, and rotating it is not containment while that file is in every clone ' +
        'anybody has taken.',
      commandOptions: [
        { command: "awk -F, '$3==\"SESSION_START\" {print $1, $4, $5}' /var/log/remotesupport/sessions.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'git -C /srv/repos/deploy-pipelines log -S "svc-deploy" --oneline', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status remote-support', ...STATUS_CHECK },
        { command: 'cat /var/log/remotesupport/sessions.csv', ...DUMP_ALL },
        { command: 'nmap -Pn 198.51.100.31', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find how anything reached that host before 23:47, and where the credential is written ' +
        'down.',
      guidance:
        'Something ran as this account. Ask how it got there in the first place.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'privilege-escalation',
      critical: true,
      techniques: ['T1078.003'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.corroborate'],
      outOfLaneActions: ['act.revoke-key', 'act.reset-password', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'A shared account with local administrator on 22 hosts, documented as non-interactive with ' +
        'nothing enforcing it, used by nine pipelines and the agent on every host. The behavioural ' +
        'finding is the strong one and it is available in one query: 180 days of history shows ' +
        'this account invoking four specific deployment scripts from pipelines and nothing else. ' +
        'It has never run certificate tooling, never run scripting interactively, and never used ' +
        'management instrumentation. So the account that did all of last night had a baseline so ' +
        'narrow that any of the five steps would have stood out, and none of them did, because ' +
        'nothing was comparing. Note what this does to containment before mitigation reaches it: ' +
        'the account cannot simply be disabled, because it is holding up nine pipelines and 22 ' +
        'agents, and a policy that says non-interactive without a control behind it is a comment ' +
        'rather than a restriction.',
      standIn:
        'Shared account, local admin on 22 hosts, nine pipelines and every deployment agent, ' +
        'documented non-interactive with nothing enforcing that. And the behaviour is unambiguous: ' +
        '180 days of history is four deployment scripts invoked by pipelines and nothing else. ' +
        'Never run certificate tooling, never run scripting interactively, never touched ' +
        'management instrumentation. Any one of last night\'s five steps would have stood out ' +
        'against that, and nothing was comparing. It also cannot just be disabled, because it is ' +
        'holding up nine pipelines.',
      commandOptions: [
        { command: "awk -F, '$2==\"svc-deploy\" {print $5}' /var/log/directory/process-180d.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c "svc-deploy" /var/log/directory/logons-180d.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status directory', ...STATUS_CHECK },
        { command: 'cat /var/log/directory/process-180d.csv', ...DUMP_ALL },
        { command: 'net user svc-deploy /active:no /domain', ...MUTATE },
      ],
      commandNudge:
        'Find out what that account has ever done before last night.',
      guidance:
        'A service account has a very small normal. Go and find out what this one is.',
    },
    {
      eventId: 'ev.7',
      verdict: 'ambiguous',
      leaning: 'benign',
      wouldSettleIt:
        'Session transcript logging on FCU-SRV-22, which records the commands typed rather than ' +
        'the fact of a session. It is enabled only on servers inside the cardholder scope and this ' +
        'host is not one, so the transcript does not exist and cannot be recovered.',
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.investigate-hold', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.reset-password', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Four minutes that cannot be assigned to a person, and the reason is structural rather ' +
        'than evidential. A session at 23:40 enumerated services, read two configuration files and ' +
        'queried the event log, all under svc-deploy, which the on-call administrator uses out of ' +
        'hours because that is how the estate works. She was paged at 23:31 for a failed ' +
        'deployment, says she ran some checks, and does not remember which, which is what anybody ' +
        'would say about routine work at midnight and is neither suspicious nor helpful. The three ' +
        'actions are equally what an administrator investigating a failed deployment does and what ' +
        'an intruder orienting on a new host does, and they sit exactly between the 23:39 session ' +
        'and the 23:47 execution. The transcript that would separate them is not missing, it was ' +
        'never enabled here, so no amount of further work resolves it. Put a number on it well ' +
        'short of certainty and lean toward the administrator, and note what hangs on the answer: ' +
        'if it was her, the intruder spent eight minutes doing nothing and this is a smaller ' +
        'incident than it looks, and if it was not, then someone was oriented on that host before ' +
        'the first thing anybody detected.',
      standIn:
        'Four minutes I cannot assign to a person. Services enumerated, two config files read, ' +
        'event log queried, all under svc-deploy, which our on-call uses out of hours because that ' +
        'is how this place works. She was paged at 23:31, says she ran some checks, does not ' +
        'remember which, which is what anybody says about routine work at midnight. Those three ' +
        'actions are equally an admin looking at a failed deployment and an intruder orienting on ' +
        'a new box, and they sit between the 23:39 session and the 23:47 execution. Transcript ' +
        'logging is cardholder scope only, so it was never on here and nothing recovers it. Call ' +
        'it leaning her, not far. If it was her this is smaller than it looks; if it was not, ' +
        'somebody was oriented before anything we detected.',
      commandNudge:
        'Line the on-call paging record up against the session times, then find out what logging ' +
        'would have recorded the commands themselves.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1567.002', 'T1030'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate', 'act.dismiss'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Forty megabytes is a small number and this is the worst row on the board. Five hours and ' +
        'forty-five minutes, 512 kilobyte pieces at irregular forty to two hundred second ' +
        'intervals, to a commercial cloud storage provider the estate genuinely uses for three ' +
        'approved integrations. Every one of those choices is about not being noticed: the ' +
        'destination is allowed, the volume is beneath any threshold worth setting, and the ' +
        'irregular spacing defeats the periodicity check that catches beaconing. What makes it ' +
        'serious is the source. FCU-SRV-31 holds the deployment artefact repository and the ' +
        'signing configuration for the mobile banking application, so the question is not how much ' +
        'left but whether what left includes the means to sign software that 84,000 members ' +
        'install. Say that plainly and early, because it changes what the 11:00 release is: the ' +
        'three approved integrations to the same provider are the reason nobody looked, and they ' +
        'are also the reason this is answerable, since all three run from different hosts in ' +
        'business hours.',
      standIn:
        'Forty megabytes, and it is the worst thing here. Five and three quarter hours, 512 ' +
        'kilobyte pieces, irregular gaps of forty to two hundred seconds, to a cloud storage ' +
        'provider we genuinely use for three approved integrations. Allowed destination, volume ' +
        'under any threshold worth setting, spacing that defeats periodicity checks. The source is ' +
        'the problem: SRV-31 holds the artefact repository and the signing configuration for the ' +
        'mobile banking app. The question is not how much left, it is whether the ability to sign ' +
        'software for 84,000 members left. And our three approved integrations all run from other ' +
        'hosts in business hours, which is how we can tell.',
      commandOptions: [
        { command: "awk '$3==\"FCU-SRV-31\" && $1>\"00:00\" {print $1, $8}' /var/log/flows.log", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$3==\"FCU-SRV-31\" {s+=$8} END {print s}' /var/log/flows.log", correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 203.0.113.240', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'netstat -an | grep ESTABLISHED', ...WRONG_TARGET },
      ],
      commandNudge:
        'Find what left the estate overnight and which host it left from.',
      guidance:
        'Ask what is stored on the host that was talking, not just how much it sent.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1218'],
      firstResponder: 'threat-intel',
      alsoAppropriate: ['malware-analyst', 'ir-lead'],
      correctActions: ['act.assess-actor', 'act.ttp-map', 'act.predict'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The honest assessment is that this floor cannot say who, and that is a product of the ' +
        'technique rather than a gap in the work. No custom tooling, no unique strings, no ' +
        'infrastructure beyond a commercial cloud provider, no reused indicator, and a technique ' +
        'set documented in public guidance and used by state programmes, criminal groups and ' +
        'penetration testers alike. Living off the land removes attribution as a side effect of ' +
        'removing detection, and anybody offering a group name from this evidence is reading their ' +
        'own expectations. What can honestly be said is narrower and still useful: the target was ' +
        'the deployment estate specifically rather than member data, the operator worked between ' +
        '23:39 and 06:05 and stopped, and the objective involved software signing rather than ' +
        'records. State a class of actor with low confidence, say which evidence would raise it, ' +
        'and put the prediction in writing instead, because what they do next is answerable and ' +
        'who they are is not.',
      standIn:
        'I cannot tell you who, and that is the technique working rather than us failing. No custom ' +
        'tooling, no unique strings, nothing but a commercial cloud provider, no reused indicators, ' +
        'and a technique set that state programmes, criminals and pen testers all use. Living off ' +
        'the land takes attribution away as a side effect of taking detection away. What I will ' +
        'say: they went for the deployment estate and not member data, they worked 23:39 to 06:05 ' +
        'and stopped, and the objective involves signing. Low confidence on the actor class, and I ' +
        'would rather write down what they do next, because that is answerable.',
      commandNudge:
        'List everything here that is unique to this intruder, then see how short the list is.',
    },
    {
      eventId: 'ev.10',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      techniques: ['T1053.005', 'T1505'],
      firstResponder: 'forensics',
      alsoAppropriate: ['mitigation-specialist', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'The persistence is inside the thing that repairs the estate, which turns the standard ' +
        'remedy into a delivery mechanism. The scheduled task exists on all five hosts and at ' +
        '00:14 it was also committed to the configuration management desired state for the whole ' +
        'deployment estate, which enforces every thirty minutes across all 22. So rebuilding a ' +
        'compromised server from the image and rejoining it restores the task within half an hour, ' +
        'and the seventeen hosts that were never touched last night will receive it at the next ' +
        'enforcement cycle whether or not anything ran on them. That inverts two instincts at ' +
        'once: reimaging is not containment here, and the count of compromised hosts is not five, ' +
        'it is however many have enforced since 00:14. Preserve the desired state history before ' +
        'anybody edits it, because the commit is the cleanest evidence in the incident and the ' +
        'first thing an engineer will do this morning is quietly remove it.',
      standIn:
        'The persistence is inside the thing that repairs us. Task is on all five hosts, and at ' +
        '00:14 it went into the configuration management desired state for the whole deployment ' +
        'estate, which enforces every thirty minutes across all 22. Rebuild a server from the ' +
        'image, rejoin it, and it comes back inside half an hour. The seventeen hosts nothing ran ' +
        'on get it at the next enforcement cycle. So reimaging is not containment and the number ' +
        'is not five. Preserving the desired state history now, before an engineer tidies it away ' +
        'this morning.',
      commandOptions: [
        { command: 'git -C /srv/cfgmgmt log --since="2026-08-31" --stat | head -40', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$4==\"FenmarchBuildCacheMaintenance\" {print $1, $2}' /var/log/cfgmgmt/enforce.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status cfgmgmt-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/cfgmgmt/enforce.csv', ...DUMP_ALL },
        { command: 'schtasks /delete /tn FenmarchBuildCacheMaintenance /f', ...MUTATE },
      ],
      commandNudge:
        'Find out whether that scheduled task exists anywhere other than on the hosts, and what ' +
        'puts it there.',
      guidance:
        'Ask what happens to that task if you rebuild the server.',
    },
    {
      eventId: 'ev.11',
      verdict: 'malicious',
      stage: 'persistence',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.reset-password', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Every obvious action breaks the estate and one of them is still necessary. Disabling ' +
        'svc-deploy stops nine pipelines and the agent on 22 hosts. Stopping configuration ' +
        'management leaves 22 servers unmanaged. Reimaging reinstalls the persistence. And the ' +
        'thing that cannot wait is not any of those: a mobile banking release is scheduled for ' +
        '11:00, the signing configuration on FCU-SRV-31 has not been verified since this began, ' +
        'and 40 megabytes left that host overnight. So the first decision is to stop the release, ' +
        'which is unpopular, reversible, and the only action on this list whose failure mode is ' +
        'that 84,000 people install something nobody has checked. Then the narrow containment: ' +
        'remove the scheduled task from the desired state before removing it from any host, ' +
        'because doing it the other way round means it returns within thirty minutes and the floor ' +
        'wastes an hour deciding whether it was reinfected. Then take svc-deploy out of the remote ' +
        'support tool and force it non-interactive, which is the capability that was abused, ' +
        'rather than disabling the account, which is the capability the business needs. ' +
        'Compensating control while the credential is rotated: alert on any interactive use of it ' +
        'anywhere, which should be zero by policy and is therefore free. Establish the rollback on ' +
        'the desired state change before touching it, and say what is left undone, which is that ' +
        'the credential is in a repository file and every clone anybody has taken still has it.',
      standIn:
        'Everything obvious breaks us and one thing genuinely cannot wait. Stop the 11:00 release ' +
        'first: the signing configuration on SRV-31 has not been verified since this started and ' +
        'forty megabytes left that host overnight. That is unpopular and reversible and the ' +
        'alternative is 84,000 people installing something nobody checked. Then remove the ' +
        'scheduled task from the desired state before you remove it from any host, or it comes ' +
        'back in thirty minutes and we spend an hour arguing about reinfection. Then take ' +
        'svc-deploy out of the remote support tool and actually enforce non-interactive, which is ' +
        'the capability that got abused, instead of disabling the account, which is the capability ' +
        'the business needs. Alert on any interactive use of it anywhere, which is free because it ' +
        'should be zero. Rollback on the desired state change written first. Left undone: that ' +
        'credential is in a repo file and every clone still has it.',
      commandNudge:
        'Find out what depends on that account and what is scheduled for this morning before you ' +
        'disable anything.',
    },
    {
      eventId: 'ev.12',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1562.002'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Two coverage failures and the second one is worse because it is invisible. Full command ' +
        'line capture reaches 1,640 of 4,100 endpoints, having been rolled out to servers and ' +
        'stopped when storage costs were reviewed in 2024, which is a decision somebody made ' +
        'legitimately and which nobody has revisited since. The worse problem is that where it is ' +
        'enabled the platform truncates at 4,096 characters without marking that it has, so the ' +
        'floor is not missing this evidence, it is holding a version of it that looks complete. ' +
        'The only full record of last night exists because FCU-SRV-22 happens to run script block ' +
        'logging, which four servers in the estate have, and that is luck rather than design. The ' +
        'proposal should lead with the truncation rather than the coverage, because coverage is a ' +
        'budget conversation and silent truncation is a correctness bug that makes every long ' +
        'command line in the estate untrustworthy. Then propose script block logging on the ' +
        'deployment estate specifically, backtested for volume, and resist proposing detections ' +
        'for certificate tooling or management instrumentation on their own, because those fired ' +
        '906 times in thirty days already and 903 were administrators.',
      standIn:
        'Two gaps and the second is worse because you cannot see it. Command line capture is on ' +
        '1,640 of 4,100 endpoints, stopped in 2024 over storage costs, which somebody decided ' +
        'legitimately and nobody has revisited. The real problem is that where it is on, the ' +
        'platform cuts at 4,096 characters and does not say so, so we are not missing this ' +
        'evidence, we are holding a version that looks whole. The only complete record of last ' +
        'night exists because SRV-22 happens to have script block logging, which four servers ' +
        'have. That is luck. I am leading with the truncation, because coverage is a budget ' +
        'argument and silent truncation makes every long command line we hold untrustworthy.',
      commandOptions: [
        { command: "awk -F, '$3==\"CMDLINE_CAPTURE\" {print $4}' /var/log/edr/config.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, 'length($6)==4096' /var/log/edr/process-30d.csv | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status edr-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/edr/config.csv', ...DUMP_ALL },
        { command: 'grep -c CMDLINE /var/log/edr/config.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Count how many recorded command lines are exactly 4,096 characters long.',
      guidance:
        'One record was cut. Ask how many others were, and whether anything says so.',
    },
    {
      eventId: 'ev.13',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'malware-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.reimage-now'],
      escalateTo: [],
      why:
        'Eleven more firings of the same rule overnight, arriving at the moment the floor has ' +
        'decided that encoded scripting means intrusion, and all eleven are the patching system. ' +
        'Four checks close them and each maps onto something that convicted the real one: the ' +
        'command lines are 310 characters rather than eleven thousand, they are identical apart ' +
        'from a package name rather than unique, they run under svc-patch inside the Tuesday ' +
        'window recorded in the change system, and the hosts are in the patch group. That is the ' +
        'whole discrimination and it takes two minutes. The row is here because the expensive ' +
        'mistake on a night like this is not missing the twelfth alert, it is deciding that a ' +
        'technique is inherently hostile and then treating the patch orchestration service as an ' +
        'intruder at seven in the morning, which stops patching across the estate and produces a ' +
        'second incident out of the response to the first.',
      standIn:
        'Eleven more of the same rule overnight and all eleven are the patching system. Command ' +
        'lines are 310 characters, not eleven thousand, identical apart from a package name, ' +
        'running as svc-patch inside the Tuesday window that is in the change system, on hosts in ' +
        'the patch group. Two minutes to check. Closing them. The expensive mistake this morning ' +
        'is not the twelfth alert, it is deciding encoded scripting is inherently hostile and ' +
        'stopping patching across the estate.',
      commandOptions: [
        { command: "awk -F, '$3==\"ENCODED_SCRIPT\" {print $2, length($6)}' /var/log/edr/alerts.csv | sort -k2 -n", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "svc-patch" /var/log/change/windows.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status patch-orchestrator', ...STATUS_CHECK },
        { command: 'cat /var/log/edr/alerts.csv', ...DUMP_ALL },
        { command: 'grep -c svc-patch /var/log/edr/alerts.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Compare the length and the account on these eleven against the one from 23:47.',
      guidance:
        'The same rule fired eleven more times. Ask what is different about those command lines.',
    },
  ],
};
