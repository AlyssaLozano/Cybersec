/**
 * Scenario 15: Second Floor.
 *
 * An intrusion that has been evicted twice already, and is still here.
 *
 * WHAT THIS TEACHES
 *
 * That an attacker who expects to be found leaves more than one way back, and
 * that the ways back are deliberately unlike each other. The obvious one is
 * meant to be found: it is loud enough to be satisfying, and finding it produces
 * the feeling of having finished. Underneath it is one that survives the fix,
 * and underneath that is one that survives a rebuild.
 *
 * The scored failure is stopping. Every scenario so far rewards a floor for
 * finding the thing; this one punishes a floor for being pleased about it. The
 * question that has to be asked after every removal is what would still work if
 * this had never been found, and `ev.4`, `ev.6` and `ev.7` are graded on
 * somebody asking it.
 *
 * WHY IT OPENS MID-INCIDENT
 *
 * Because that is when this shape actually appears. The estate has already had
 * two eviction attempts this month, both of which were competent and both of
 * which failed. The floor inherits somebody else's incomplete work, which is a
 * real and underpractised situation: the temptation is to trust the previous
 * team's conclusions, and the previous team's conclusions are why we are here
 * for a third time.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';
import {
  BROAD_SEARCH,
  COUNT_ONLY,
  CORRECT_STEP,
  DUMP_ALL,
  MUTATE,
  STATUS_CHECK,
  TOUCH_ATTACKER,
  WRONG_TARGET,
} from './distractors.js';

const ID = 'second-floor';

export const SECOND_FLOOR: Scenario = {
  id: ID,
  title: 'Second Floor',
  difficulty: 'advanced',
  durationMinutes: 60,
  situation:
    'It is 07:45. This host has been cleaned twice: once on the 8th when a scheduled task was ' +
    'removed, and again on the 19th when it was rebuilt from a clean image. It started calling ' +
    'out again on the 24th. Assume nothing the previous two teams concluded.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'cloud-security',
    'forensics',
    'vulnerability-analyst',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'rmg-app-09 calling an external address again, six days after rebuild',
      detail:
        'The host resumed periodic outbound connections to 203.0.113.244 on the 24th, five days ' +
        'after being rebuilt from a clean image on the 19th. The rebuild was verified: the disk ' +
        'was wiped, the image hash was checked, and the previous scheduled task did not return. ' +
        'Rule history: fired 3 times in thirty days, all three this incident.',
      source: 'rmg-app-09',
      target: '203.0.113.244:443',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 130,
      surface: 'process-tree',
      summary: 'A new scheduled task, near-identical to the one removed on the 8th',
      detail:
        'A scheduled task was registered on the 24th at 04:02, running a script from a temporary ' +
        'directory every two hours. It differs from the task removed on the 8th only in its name ' +
        'and the directory it reads from. It is not obfuscated and makes no attempt to hide.',
      source: 'rmg-app-09',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 290,
      surface: 'raw-log',
      summary: 'The task was created by a session authenticated with a valid domain credential',
      detail:
        'The task registration was performed by svc_app09_deploy, a service account used by the ' +
        'deployment pipeline. The session came from inside the estate. That account authenticated ' +
        'to this host at 04:01 on the 24th using a key, four days after the rebuild, and its ' +
        'credentials were not rotated during either cleanup.',
      source: 'svc_app09_deploy',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 450,
      surface: 'cloud-audit',
      summary: 'The deployment service account holds a token issued before the first cleanup',
      detail:
        'The svc_app09_deploy principal holds a non-expiring API token issued on the 2nd, before ' +
        'either eviction. It has been used 41 times since, including on the 20th and 24th. Neither ' +
        'cleanup included credential rotation, because both were scoped to the host. The token ' +
        'grants deployment rights to eleven application servers.',
      source: 'svc_app09_deploy',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.5',
      atSeconds: 610,
      surface: 'host-artefact',
      summary: 'A modified deployment template in the shared configuration repository',
      detail:
        'The deployment template used to build application servers contains an additional ' +
        'post-deploy step added on the 6th, which fetches and runs a setup script. The change was ' +
        'committed with the deployment service account and has been in the repository through both ' +
        'cleanups. Eleven servers have been deployed from this template since the 6th.',
      source: 'config repository',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 770,
      surface: 'network-flow',
      summary: 'Two other application servers making the same periodic connection',
      detail:
        'Flow analysis shows rmg-app-04 and rmg-app-11 also connecting to 203.0.113.244, at the ' +
        'same two-hour interval, since the 9th and the 14th respectively. Neither host has ever ' +
        'alerted. Neither was included in either cleanup, because both cleanups were scoped to ' +
        'rmg-app-09.',
      source: 'rmg-app-04, rmg-app-11',
      target: '203.0.113.244:443',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'Configuration drift detected on nine servers since the monthly baseline',
      detail:
        'The configuration management system reports drift on nine servers against the monthly ' +
        'baseline. Eight are documented changes with tickets from the platform team migration ' +
        'work. The ninth is rmg-app-11. Rule history: fired 26 times in thirty days, 25 closed as ' +
        'approved change.',
      source: 'config management',
      claimedSeverity: 'low',
    },
  ],
};

export const SECOND_FLOOR_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'On the 2nd the attacker issued themselves a non-expiring API token for the deployment service account.',
    'On the 6th they added a post-deploy step to the shared deployment template, so any server built from it comes back compromised.',
    'On the 8th the first team found the scheduled task on rmg-app-09 and removed it. The task was the loud one and it was meant to be found.',
    'They returned using the token, which no cleanup touched, because both cleanups were scoped to a host rather than to the intrusion.',
    'On the 19th the second team rebuilt the host from a clean image. The rebuild used the modified template, so the host came back with the backdoor already in it.',
    'Two other servers, rmg-app-04 and rmg-app-11, were deployed from the same template and have been calling out since the 9th and the 14th. Neither ever alerted.',
    'Three layers: a task that survives nothing, a credential that survives a rebuild, and a template that survives everything and reinfects on deployment.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'command-and-control',
      techniques: ['T1071.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.reimage-now', 'act.isolate', 'act.declare'],
      escalateTo: ['ir-lead', 'log-analyst'],
      why:
        'The one row in this set nobody will miss, and the important thing is what it means rather ' +
        'than that it is bad. A verified rebuild from a clean image, hash checked, disk wiped, and ' +
        'the host is calling out again five days later. That combination rules out almost ' +
        'everything: it did not survive on disk, so it came back from somewhere else. The correct ' +
        'instinct is not to rebuild again, which is what the last two attempts amount to, but to ' +
        'ask what was in scope for those cleanups and what was not. Reaching for reimage a third ' +
        'time is graded as out of lane for exactly that reason.',
      standIn:
        'rmg-app-09 is calling out again, six days after a verified rebuild from a clean image. The ' +
        'disk was wiped and the hash checked. It did not survive on that disk, so it came back from ' +
        'somewhere we did not clean.',
      commandOptions: [
        { command: 'grep 203.0.113.244 /var/log/flows.log | tail -20', ...WRONG_TARGET },
        { command: 'awk \'$4 ~ /203.0.113.244/ {print $2}\' /var/log/flows.log | sort -u', ...WRONG_TARGET },
        { command: 'cat /var/log/build/rebuild-19th.log | tail', correct: true, teaches: CORRECT_STEP },
        { command: 'systemctl status app09', ...STATUS_CHECK },
        { command: 'uptime', ...STATUS_CHECK },
      ],
      commandNudge:
        'It did not survive the wipe. Work out what was in scope for the rebuild and what was not.',
      guidance:
        'Ask how it got back, not what it is. A clean rebuild that gets reinfected is telling you ' +
        'where to look.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1053.005'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['log-analyst', 'forensics'],
      correctActions: ['act.decode'],
      outOfLaneActions: ['act.reimage-now', 'act.isolate', 'act.power-off', 'act.attribute-named'],
      escalateTo: ['log-analyst', 'ir-lead'],
      why:
        'Nearly identical to the task removed on the 8th, unobfuscated, making no attempt to hide. ' +
        'That is the tell and it is easy to read backwards. An attacker who has already been ' +
        'evicted once and comes back with the same conspicuous artefact is not being lazy, they ' +
        'are being economical: this layer costs nothing to rebuild and it occupies the responder. ' +
        'Removing it is correct and it is not progress. The useful question is not what the script ' +
        'does, it is who registered the task, because whoever did that had a working credential ' +
        'five days after the rebuild.',
      standIn:
        'New scheduled task registered on the 24th, running every two hours, near-identical to the ' +
        'one we removed on the 8th, not obfuscated at all. This is the layer they expect us to ' +
        'find. What matters is who registered it.',
      commandOptions: [
        { command: 'schtasks /query /fo LIST /v | grep -A6 -i app09', correct: true, teaches: CORRECT_STEP },
        { command: 'cat /tmp/.cache/setup.sh', ...WRONG_TARGET },
        { command: 'diff /var/quarantine/task-8th.txt /tmp/.cache/setup.sh', ...WRONG_TARGET },
        { command: 'ls -la /tmp/', ...WRONG_TARGET },
        { command: 'crontab -l', ...WRONG_TARGET },
      ],
      commandNudge:
        'Find out which account registered this task, not just what the task runs.',
      guidance:
        'This one was easy to find. Ask who put it there, and what credential they used.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1078.003', 'T1098.004'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reimage-now', 'act.reset-password', 'act.isolate'],
      escalateTo: ['cloud-security', 'ir-lead'],
      why:
        'The second layer, and the answer to the first question. A valid deployment service account ' +
        'key-authenticated to a freshly rebuilt host four days after the rebuild, from inside the ' +
        'estate. Nothing was broken and nothing needed to be, because both cleanups were scoped to ' +
        'the host and neither rotated a credential. This is the general lesson worth taking out of ' +
        'the whole scenario: an eviction scoped to a machine cannot remove an attacker whose access ' +
        'is an identity. The host was never where they lived.',
      standIn:
        'The task was registered by svc_app09_deploy, key authentication, from inside the estate, ' +
        'at 04:01 on the 24th. Four days after the rebuild. Neither cleanup rotated that ' +
        'credential, because both were scoped to the host.',
      commandOptions: [
        { command: 'grep svc_app09_deploy /var/log/auth.log', ...WRONG_TARGET },
        { command: 'awk \'$5=="svc_app09_deploy" {print $1, $9}\' /var/log/auth.log | tail -20', correct: true, teaches: CORRECT_STEP },
        { command: 'cat ~svc_app09_deploy/.ssh/authorized_keys', ...WRONG_TARGET },
        { command: 'last | grep deploy', ...WRONG_TARGET },
        { command: 'net user svc_app09_deploy /domain', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check whether that credential was ever rotated during either cleanup.',
      guidance:
        'Ask what the two cleanups actually covered. A host rebuild does not touch an identity.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1098.001', 'T1078.004'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'vulnerability-analyst'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.reimage-now', 'act.dismiss', 'act.isolate', 'act.preserve'],
      escalateTo: ['ir-lead', 'vulnerability-analyst'],
      why:
        'A non-expiring token issued on the 2nd, before either eviction, used 41 times since ' +
        'including on the 20th and 24th. The date is the whole finding: it predates both cleanups, ' +
        'which means both cleanups happened while the attacker still held valid credentials and ' +
        'were never going to work. The second finding is scope. That token grants deployment rights ' +
        'to eleven servers, so the blast radius was never one host, and nobody checked because ' +
        'nobody thought to ask what the credential could reach. Revoking it is right and it is ' +
        'still not the end, which is the habit this scenario is trying to install.',
      standIn:
        'The deployment account holds a non-expiring token issued on the 2nd, before both cleanups, ' +
        'used 41 times since including on the 20th and the 24th. It grants deployment rights to ' +
        'eleven servers. Revoking it now, and eleven servers is our real scope.',
      commandNudge:
        'Check when that token was issued relative to the two cleanups, and what it can reach.',
      guidance:
        'Ask what this credential is allowed to do, and how many machines that covers.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1195.002', 'T1554'],
      firstResponder: 'forensics',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'vulnerability-analyst'],
      why:
        'The third layer and the reason the second team failed. A post-deploy step added to the ' +
        'shared deployment template on the 6th, sitting in the configuration repository through ' +
        'both cleanups, because a repository is not a host and nobody looked at it. It makes the ' +
        'rebuild on the 19th worse than useless: the clean image was genuinely clean, and the ' +
        'template put the backdoor back during deployment. That inverts the usual instinct, ' +
        'because here rebuilding is the mechanism of reinfection rather than the remedy. Eleven ' +
        'servers have been built from this template since the 6th, and that number is the scope of ' +
        'the whole incident.',
      standIn:
        'The shared deployment template has an extra post-deploy step added on the 6th that fetches ' +
        'and runs a setup script. It has been in the repository through both cleanups. The rebuild ' +
        'on the 19th used this template, so we reinfected the host ourselves. Eleven servers have ' +
        'been deployed from it since the 6th. Repository state preserved and hashed.',
      commandNudge:
        'Look at what the rebuild on the 19th actually deployed from, and when that changed.',
      guidance:
        'The image was clean. Ask what else the rebuild used, and whether anybody checked it.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'command-and-control',
      techniques: ['T1071.001'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'vulnerability-analyst'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'Two more hosts doing the same thing at the same interval since the 9th and the 14th, and ' +
        'neither has ever alerted. They were not missed by a detection, they were outside the scope ' +
        'of both cleanups because both cleanups were about rmg-app-09. This is what makes the ' +
        'incident three weeks old rather than six days old, and the query that finds it is the ' +
        'cheapest thing on the board: search for the destination across every host rather than ' +
        'looking at the host you were given. Anybody could have run it on the 8th.',
      standIn:
        'rmg-app-04 and rmg-app-11 are making the same connection at the same two-hour interval, ' +
        'since the 9th and the 14th. Neither has ever alerted and neither was in scope for either ' +
        'cleanup. Three hosts, not one.',
      commandOptions: [
        { command: 'awk \'$4 ~ /203.0.113.244/ {print $2}\' /var/log/flows.log | sort | uniq -c', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c 203.0.113.244 /var/log/flows.log', ...COUNT_ONLY },
        { command: 'ping -c1 rmg-app-11', ...TOUCH_ATTACKER },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
        { command: 'cat /etc/hosts', ...WRONG_TARGET },
      ],
      commandNudge:
        'Search for that destination across every host, not just the one you were handed.',
      guidance:
        'You were given one host. Ask whether anything else in the estate is doing the same thing.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['vulnerability-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.declare', 'act.reimage-now'],
      escalateTo: ['vulnerability-analyst'],
      why:
        'The only row in this set that inverts the usual pattern, and it is here to stop the ' +
        'dismissal reflex becoming automatic. Nine drift findings, twenty-five of twenty-six closed ' +
        'as approved change this month, eight with tickets from the migration. Everything says ' +
        'close it. The ninth is rmg-app-11, which is one of the hosts calling out. The correct move ' +
        'is not to dismiss the alert and not to escalate all nine: it is to check the list against ' +
        'what the floor already knows, and escalate the one that overlaps. A floor that has learned ' +
        '"noisy rule, close it" from the other scenarios will miss this, and the lesson is that the ' +
        'firing history tells you how to read a rule rather than how to read a row.',
      standIn:
        'Nine config drift findings. Eight have tickets from the platform migration. The ninth is ' +
        'rmg-app-11, which is one of the hosts we have just found calling out. Closing eight, ' +
        'escalating one.',
      commandOptions: [
        { command: 'cat /var/log/config-mgmt/drift.log | tail -20', ...WRONG_TARGET },
        { command: 'awk \'/DRIFT/ {print $3}\' /var/log/config-mgmt/drift.log', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i migration /var/log/change-management.log', ...WRONG_TARGET },
        { command: 'diff /etc/baseline/app11.conf /etc/app11.conf', ...WRONG_TARGET },
        { command: 'systemctl status config-agent', ...STATUS_CHECK },
      ],
      commandNudge:
        'Check the list of drifted hosts against the hosts you already know are involved.',
      guidance:
        'Most of these are approved change. Read the list of hosts before you close it, not just ' +
        'the count.',
    },
  ],
};
