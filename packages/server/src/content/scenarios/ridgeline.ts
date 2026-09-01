/**
 * Scenario 01: Operation Ridgeline.
 *
 * The intrusion students met in Log Analysis and triaged in Alert Triage, now
 * arriving live across a floor over sixty minutes.
 *
 * FOUR THINGS CORRECTED FROM THE DRAFT SPEC, AND WHY
 *
 * 1. Every external address is RFC 5737. The draft used 1.2.3.4, which is a
 *    real allocated address, and pointing a training platform at somebody's
 *    real host is the failure the non-negotiable exists to prevent.
 *
 * 2. Blocked traffic is split in two, because the draft scored it in a way that
 *    contradicted content already shipped. Every blocked-traffic alert in the
 *    Alert Triage corpus is graded `dismiss`, verdict `benign_true_positive`,
 *    on the grounds that "every internet-facing host receives thousands of
 *    these a day". That is correct for INBOUND scans against closed ports, and
 *    it is why ev.7 below is noise. It is not correct for an OUTBOUND
 *    connection from an internal host to a hostile address: the control worked,
 *    and something inside still tried to phone home. ev.2 is that, and it is
 *    the event most floors miss. Teaching "escalate all blocked traffic" would
 *    teach alert fatigue; teaching the direction distinction teaches triage.
 *
 * 3. No real threat actor is named, and the intel seat scores highest for
 *    declining to name one. The draft awarded 99/100 for attributing to a real
 *    nation-state group at 75% confidence off an IP address, which is the exact
 *    behaviour this platform's own Threat Intel role is defined by resisting:
 *    "attribution is easy to assert and hard to justify, and confident wrong
 *    attribution has consequences well beyond the incident."
 *
 * 4. No intelligence is attributed to a real organisation. The draft had named
 *    public feeds asserting findings they never published. Everything here is
 *    fictional, which also means it does not go stale.
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

const ID = 'ridgeline';

export const RIDGELINE: Scenario = {
  id: ID,
  title: 'Operation Ridgeline',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 08:15 at Ridgeline Medical Group. Something is moving inside the estate and nobody ' +
    'has the whole picture. Events arrive across the hour on the surface each seat can see. No ' +
    'one seat can reconstruct this alone: work yours, say what you found, and say who needs it next.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'cloud-security',
    'threat-intel',
    'forensics',
    'ir-lead',
    // AI Security is deliberately NOT seated here. Ridgeline involves no
    // deployed model, so that seat would be padding: they would sit through an
    // hour with nothing that is theirs to find. They belong in the AI Security
    // scenarios, where validating whether detection was evaded is the incident
    // rather than a footnote to it.
  ],

  /*
   * The shared catalogue, not a bespoke list.
   *
   * A SOC operator's options do not change because tonight's intrusion is this
   * one, and re-declaring them per scenario is how "dismiss" comes to mean
   * something subtly different in the fourteenth. The attribution split lives
   * there too: mapping technique, assessing an actor CLASS with a basis and a
   * confidence, and predicting the next move are all in-lane for intel, and
   * asserting a named group as fact is in-lane for nobody.
   */
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Repeated SSH authentication failures for testuser from 203.0.113.55',
      detail:
        'Sixty-two failed password attempts against rmg-web-02 in eleven minutes, all for the ' +
        'account "testuser", all from one external address. The account exists and is not locked. ' +
        'Rule history: fired 9 times in thirty days, 4 closed as not worth acting on.',
      source: '203.0.113.55',
      target: 'rmg-web-02:22',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 30,
      surface: 'network-flow',
      summary: 'Firewall blocked OUTBOUND connection: rmg-web-02 to 198.51.100.60:443',
      detail:
        'Egress filtering dropped a connection attempt from rmg-web-02 to an external address ' +
        'that is not on the allowlist. The control worked and nothing left. Note the direction: ' +
        'this is an internal host attempting to reach out, not the internet knocking on the door.',
      source: 'rmg-web-02',
      target: '198.51.100.60:443',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.3',
      atSeconds: 75,
      surface: 'process-tree',
      summary: 'Encoded interpreter invocation spawned from a session shell',
      detail:
        'A shell session on rmg-web-02 spawned an interpreter with a base64 argument. Decoded, ' +
        'it retrieves a script from a remote host and pipes it straight into execution. The ' +
        'second stage is not in this command and is whatever the remote host serves at the time.',
      source: 'rmg-web-02',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 120,
      surface: 'network-flow',
      // THE GAP. At expert this pivot never reaches a console, so the floor
      // holds a compromised web host and a database shipping 6.3 GB out, with
      // nothing linking them. Saying "something moved between these and we
      // cannot see it" is the finding, and it is a different skill from
      // reading what is in front of you.
      withheldAtExpert: true,
      summary: 'SSH from rmg-web-02 to rmg-db-01, first time in the baseline window',
      detail:
        'A key-based SSH session opened from the web host to the patient records database. ' +
        'Ninety days of flow history show no prior connection on this path. Web hosts reach the ' +
        'database over 5432 through the application, never over 22.',
      source: 'rmg-web-02',
      target: 'rmg-db-01:22',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 150,
      surface: 'alert-queue',
      summary: 'Firewall blocked inbound 192.0.2.44 to port 3389',
      detail:
        'An inbound connection attempt to a closed port, dropped at the perimeter. Rule history: ' +
        'fired 23,487 times in thirty days, 20,131 closed as not worth acting on.',
      source: '192.0.2.44',
      target: 'perimeter:3389',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.9',
      atSeconds: 95,
      surface: 'raw-log',
      summary: 'Accepted password for testuser, immediately followed by a key being added',
      detail:
        'auth.log on rmg-web-02. An accepted password at 10:14:22 after sixty-two failures, then ' +
        'four seconds later a write to /home/testuser/.ssh/authorized_keys. Nothing else touched ' +
        'that file in the ninety days before today.',
      source: 'rmg-web-02',
      claimedSeverity: null,
    },
    {
      id: 'ev.10',
      atSeconds: 180,
      surface: 'host-artefact',
      summary: 'A key in authorized_keys that no configuration system issued',
      detail:
        'The added key carries a comment matching no inventory entry, and its file timestamp sits ' +
        'four seconds after the accepted password. The account it belongs to is still able to log ' +
        'in without one.',
      source: 'rmg-web-02',
      claimedSeverity: null,
    },
    {
      id: 'ev.5',
      atSeconds: 210,
      surface: 'cloud-audit',
      summary: 'Five snapshot deletions in ninety seconds by the backup service principal',
      detail:
        'The backup-automation principal deleted five snapshots totalling 1.08 TB. All five were ' +
        'two to three days old and inside retention. The principal holds delete permissions it ' +
        'has never previously exercised. The calls originated from inside the estate, not from ' +
        'the scheduler that normally drives this principal.',
      source: 'backup-automation',
      claimedSeverity: 'medium',
      // THE CONTRADICTION. At expert this same moment also reaches the alert
      // queue through the SIEM's cloud connector, which samples and truncates.
      // Cloud Security reads five deletions inside retention; the operator
      // reads two and a routine label. Both consoles are working correctly.
      // The skill is noticing the two accounts do not match and asking which
      // source is weaker, rather than averaging them into a third wrong answer.
      expertAlsoOn: ['alert-queue'],
      expertDetail:
        'Cloud connector event: 2 snapshot delete calls by backup-automation. Classified ' +
        'routine-lifecycle by the connector policy. Sampling note: this connector reports on a ' +
        '5-minute rollup and drops calls beyond the first two in a window.',
    },
    {
      id: 'ev.8',
      atSeconds: 240,
      surface: 'alert-queue',
      summary: 'Repeated authentication failures from 10.20.9.40 for account nagios',
      detail:
        'Failures at an almost exact five-minute cadence since midnight. The source is the ' +
        'monitoring collector, inventory asset RMG-MON-01, and the account exists. Rule history: ' +
        'fired 8,412 times in thirty days, 8,398 closed as not worth acting on.',
      source: '10.20.9.40',
      target: 'rmg-web-02:22',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.6',
      atSeconds: 285,
      surface: 'network-flow',
      summary: '6.3 GB outbound from rmg-db-01 to 198.51.100.60:443',
      detail:
        'A sustained encrypted transfer from the patient records database to the same external ' +
        'address that rmg-web-02 was blocked from reaching earlier. This path has egress ' +
        'allowance the web host did not. Normal outbound for this host is under 40 MB a day.',
      source: 'rmg-db-01',
      target: '198.51.100.60:443',
      claimedSeverity: 'high',
    },

    /*
     * ----------------------------------------------------------------------
     * EXPERT ONLY
     *
     * None of these exist below expert. They do not remove help, they change
     * the evidence, which is the difference between a scenario that is tedious
     * and one that is hard.
     * ----------------------------------------------------------------------
     */
    {
      id: 'ev.11',
      atSeconds: 268,
      surface: 'alert-queue',
      expertOnly: true,
      summary: 'Forty-one scan alerts from eleven external addresses in ninety seconds',
      detail:
        'A burst of port scan detections against the perimeter, all blocked, spread across ' +
        'eleven source addresses in 203.0.113.0/24. Every one is a genuine detection and every ' +
        'one was stopped. Rule history: fired 22 times in thirty days, all closed as not worth ' +
        'acting on. The burst pushes seventeen minutes of queue history off the first page.',
      source: '203.0.113.0/24',
      target: 'perimeter',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.12',
      atSeconds: 300,
      surface: 'host-artefact',
      expertOnly: true,
      summary: 'Staging binary on rmg-db-01 carrying non-English strings and an off-hours build stamp',
      detail:
        'The archiving utility left on the database host contains resource strings in Cyrillic ' +
        'and a compiler timestamp of 02:14 UTC. The packer is one publicly documented as ' +
        'associated with a named criminal group in three vendor reports. The strings sit in a ' +
        'resource section that is not referenced by any code path in the binary.',
      source: 'rmg-db-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.13',
      atSeconds: 330,
      surface: 'alert-queue',
      expertOnly: true,
      summary: 'VPN session for j.okafor from an address never seen on this account',
      detail:
        'A successful VPN authentication for a current employee in the finance team, from an ' +
        'address in 198.51.100.0/24, at 03:40 local. MFA was satisfied. The account has ninety ' +
        'days of history and has never authenticated from this address or outside 08:00 to ' +
        '19:00. No failures preceded it. The session opened one file share and closed after ' +
        'four minutes. HR records show approved leave for this employee starting yesterday.',
      source: '198.51.100.31',
      target: 'vpn-gw-01',
      claimedSeverity: 'medium',
    },
  ],
};

export const RIDGELINE_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'A stale test account was brute forced from outside and accepted on the sixty-third attempt.',
    'The session added a key to authorized_keys, so the password stopped mattering.',
    'An encoded interpreter call pulled a second stage from a host the estate could not reach.',
    'That first attempt to reach the internet was blocked, and the blocking is why nobody looked.',
    'The session moved to the patient records database over a path that had never been used.',
    'The backup principal, called from inside, destroyed the snapshots that would have allowed recovery.',
    'The database, which does have egress, then shipped 6.3 GB to the address the web host could not reach.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      commandOptions: [
        { command: 'grep "Failed password" /var/log/auth.log | wc -l', ...COUNT_ONLY },
        { command: 'grep "Accepted" /var/log/auth.log | grep testuser', correct: true, teaches: CORRECT_STEP },
        { command: 'cat /var/log/auth.log', ...DUMP_ALL },
        { command: 'systemctl restart sshd', ...MUTATE },
        { command: 'passwd -l testuser', ...WRONG_TARGET },
      ],
      commandNudge:
        'A run of failures only matters if you know how it ended. Find out whether any attempt on ' +
        'that account was ever accepted.',
      standIn:
        'Triage: sixty-two failed passwords for testuser from one external address in eleven ' +
        'minutes. The account exists and is not locked. Rule has a thin history, so it has not ' +
        'earned the benefit of the doubt. Raising it.',
      techniques: ['T1110.001 Password Guessing', 'T1078.003 Valid Accounts: Local'],
      stage: 'initial-access',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.write-rule', 'act.decode', 'act.isolate', 'act.timeline'],
      escalateTo: ['log-analyst'],
      why:
        'Sixty-two attempts against one existing account from one external source is not a user ' +
        'mistyping. The rule has a thin history, which cuts both ways: it is not a known noise ' +
        'source, so it has not earned the benefit of the doubt. Triage it and hand it on. Writing ' +
        'a detection rule is not the operator\'s job and does nothing about the session that may ' +
        'already be open.',
    },
    {
      eventId: 'ev.2',
      verdict: 'blocked-reconnaissance',
      standIn:
        'Network: an outbound connection from rmg-web-02 to an address off the allowlist was ' +
        'blocked. Direction matters here. The control stopped the connection and did nothing ' +
        'about whatever made it, so something on that host already ran.',
      techniques: ['T1071.001 Application Layer Protocol: Web', 'T1041 Exfiltration Over C2 Channel'],
      stage: 'execution',
      firstResponder: 'network-analyst',
      alsoAppropriate: ['soc-operator', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.power-off'],
      escalateTo: ['ir-lead'],
      why:
        'This is the event most floors miss, and the reason is that "blocked" reads as "handled". ' +
        'Direction is what matters. An inbound scan against a closed port is noise and you should ' +
        'dismiss it (see ev.7). An OUTBOUND attempt from your own host to a hostile address means ' +
        'something inside already ran and tried to call home. The control stopped the connection ' +
        'and did nothing about the thing that made it. Look for the same source and the same host ' +
        'on other paths, because whatever failed here will try again somewhere with egress.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      standIn:
        'Malware: the interpreter call decodes to a fetch-and-execute from a remote host. It is a ' +
        'loader. What it pulls is whatever that host is serving at the time, so I cannot tell you ' +
        'the capability without capturing the second stage.',
      techniques: ['T1059 Command and Scripting Interpreter', 'T1105 Ingress Tool Transfer', 'T1027 Obfuscated Files or Information'],
      stage: 'execution',
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['log-analyst', 'forensics'],
      correctActions: ['act.decode', 'act.sandbox'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Decoding the command is half the job and the easy half. The command is a loader: the ' +
        'capability that matters is in whatever the remote host serves, which changes whenever the ' +
        'operator wants it to. A claim that stops at "it downloads and executes" has classified ' +
        'the wrapper and not the threat. Propose how to capture the second stage.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      standIn:
        'Network: an SSH session from the web host to the patient records database. Ninety days of ' +
        'flow history show no prior connection on that path, and the application uses 5432, never ' +
        '22. This is not the app.',
      techniques: ['T1021.004 Remote Services: SSH', 'T1570 Lateral Tool Transfer'],
      stage: 'lateral-movement',
      firstResponder: 'network-analyst',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.flow-map'],
      outOfLaneActions: ['act.dismiss', 'act.decode', 'act.write-rule'],
      escalateTo: ['ir-lead'],
      why:
        'The finding is not that two hosts spoke. It is that this path has no history and the ' +
        'protocol is wrong for the relationship: the application reaches the database on 5432, ' +
        'never on 22. A baseline is what turns an unremarkable connection into the moment the ' +
        'intrusion left the first host.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      commandOptions: [
        { command: 'grep 192.0.2.44 /var/log/syslog | wc -l', ...COUNT_ONLY },
        { command: 'iptables -L -n | head', correct: true, teaches: CORRECT_STEP },
        { command: 'grep "3389" /var/log/syslog | tail', ...WRONG_TARGET },
        { command: 'nmap 192.0.2.44', ...TOUCH_ATTACKER },
        { command: 'ping 192.0.2.44', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Before you decide, check how often this rule has fired and how often that turned out to ' +
        'be nothing.',
      standIn:
        'Triage: inbound scan to a closed port, dropped. That rule has fired 23,487 times and been ' +
        'closed as noise almost every one. Dismissing it.',
      guidance:
        'Direction decides this one. Ask which way the connection was going before you ask whether ' +
        'it was blocked.',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare'],
      escalateTo: [],
      why:
        'Inbound, against a closed port, dropped, on a rule that has fired 23,487 times and been ' +
        'closed as noise 20,131 of them. This is the internet being the internet. Escalating it ' +
        'during a live intrusion is worse than useless: it spends the one thing the floor is ' +
        'shortest of. Compare it with ev.2, which is also blocked and is not noise, and the ' +
        'difference is direction.',
    },
    {
      eventId: 'ev.9',
      critical: true,
      verdict: 'malicious',
      commandOptions: [
        { command: 'grep -A2 "Accepted password for testuser" /var/log/auth.log', correct: true, teaches: CORRECT_STEP },
        { command: 'ls -l /home/testuser/.ssh/', ...WRONG_TARGET },
        { command: 'last -a | head', ...WRONG_TARGET },
        { command: 'rm /home/testuser/.ssh/authorized_keys', ...MUTATE },
        { command: 'journalctl -u ssh --since today', ...WRONG_TARGET },
      ],
      commandNudge:
        'Look at what happened in the seconds AFTER the successful login, not before it. ' +
        'Persistence is usually established immediately.',
      standIn:
        'Logs: an accepted password for testuser at 10:14:22 after sixty-two failures, and four ' +
        'seconds later a write to that account authorized_keys. Nothing else touched that file in ' +
        'ninety days.',
      techniques: ['T1098.004 Account Manipulation: SSH Authorized Keys'],
      stage: 'persistence',
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline'],
      outOfLaneActions: ['act.dismiss', 'act.decode', 'act.write-rule'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'Two lines four seconds apart, and the second one is the incident. The accepted password ' +
        'is how they got in once; the key is how they get in from now on, and it survives the ' +
        'password reset everybody reaches for first. Reporting the login without the key means ' +
        'the response closes the door and leaves the window open.',
    },
    {
      eventId: 'ev.10',
      verdict: 'malicious',
      standIn:
        'Forensics: the key added to authorized_keys matches no inventory entry, and its file ' +
        'timestamp is four seconds after the accepted password. I have captured it with times ' +
        'intact. A rebuild would take that relationship with it.',
      techniques: ['T1098.004 Account Manipulation: SSH Authorized Keys', 'T1556 Modify Authentication Process'],
      stage: 'persistence',
      firstResponder: 'forensics',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.preserve'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.power-off', 'act.write-rule'],
      escalateTo: ['ir-lead'],
      why:
        'The artefact that proves persistence, and the one most easily destroyed by the response. ' +
        'Capture it with the timestamp intact before anybody rebuilds or resets: file times are ' +
        'what tie the key to the login four seconds earlier, and a rebuild takes that with it.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      standIn:
        'Cloud: the backup principal deleted five snapshots totalling 1.08 TB, all inside ' +
        'retention. That principal has never used its delete permission before, and the calls came ' +
        'from inside the estate rather than the scheduler that normally drives it.',
      techniques: ['T1485 Data Destruction', 'T1490 Inhibit System Recovery', 'T1078.004 Valid Accounts: Cloud'],
      stage: 'impact',
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'forensics'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.dismiss', 'act.decode', 'act.write-rule'],
      escalateTo: ['ir-lead'],
      why:
        'A backup principal deleting backups looks like a backup principal doing its job, which is ' +
        'why this is the hardest event on the board. Three things say otherwise: the snapshots ' +
        'were inside retention, the delete permission had never been used before, and the calls ' +
        'came from inside the estate rather than the scheduler. This is not data theft, it is ' +
        'somebody removing the option to recover, which usually means what comes next is ransom.',
    },
    {
      eventId: 'ev.8',
      verdict: 'false-positive',
      standIn:
        'Triage: the monitoring collector failing on a five-minute cadence all day. Stale ' +
        'credential in a config, not an attacker. Dismissing and raising a tuning ticket.',
      guidance:
        'The monitoring collector produces more failures than the attacker does. Counting is not ' +
        'triage.',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss', 'act.tune'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare'],
      escalateTo: [],
      why:
        'A stale password in a monitoring configuration, failing on a machine cadence all day. It ' +
        'is the loudest thing on the board and it produces more failures than the actual attacker. ' +
        'Dismiss it and raise a tuning ticket. Chasing it while ev.5 is running is precisely how ' +
        'a floor loses an hour it cannot get back.',
    },
    {
      eventId: 'ev.6',
      critical: true,
      verdict: 'malicious',
      standIn:
        'Network: 6.3 GB from the database host to the same address rmg-web-02 was blocked from ' +
        'reaching earlier. That host has egress the web host does not. I can prove the volume and ' +
        'the destination. I cannot prove the contents.',
      techniques: ['T1041 Exfiltration Over C2 Channel', 'T1030 Data Transfer Size Limits'],
      stage: 'exfiltration',
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'threat-intel'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.power-off'],
      escalateTo: ['ir-lead'],
      why:
        'The destination is the address rmg-web-02 was blocked from reaching at 00:30, which ties ' +
        'the first blocked attempt to the successful one and explains why the attacker moved: the ' +
        'database has egress the web host does not. Note what you can and cannot say. You can ' +
        'prove 6.3 GB left and where it went. You cannot prove what was in it, and the report ' +
        'should say so rather than assert the record count somebody will quote back to a regulator.',
    },

    /*
     * ------------------------------------------------------------------------
     * TRUTH FOR THE EXPERT-ONLY EVENTS
     * ------------------------------------------------------------------------
     */
    {
      eventId: 'ev.11',
      verdict: 'decoy',
      stage: 'exfiltration',
      techniques: ['T1595', 'T1499'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst'],
      correctActions: ['act.dismiss', 'act.tune'],
      outOfLaneActions: ['act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: [],
      why:
        'Forty-one real, blocked, harmless scan detections, arriving seventeen seconds before ' +
        '6.3 GB leaves the database. Every one is a true positive and none of them matter. The ' +
        'timing is the tell: this burst exists to push the queue over and bury what follows. ' +
        'Below expert the noise on this floor is accidental, a collector nobody fixed. Here it ' +
        'has an author. Working it carefully is the failure, and so is dismissing it without ' +
        'noticing that a flood arriving at precisely this moment is itself a finding worth ' +
        'saying out loud.',
      standIn:
        'Queue just took forty-one scan alerts across eleven sources, all blocked, all from the ' +
        'documentation range. Rule has fired twenty-two times this month and every one closed as ' +
        'nothing. I am closing them. Flagging that it arrived all at once and pushed the last ' +
        'seventeen minutes off my first page.',
      commandNudge:
        'Compare when the burst arrived against when anything else on the board happened.',
      guidance:
        'A flood of harmless true positives is still a flood. Ask who benefits from the queue ' +
        'being full right now.',
    },
    {
      eventId: 'ev.12',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1560', 'T1036'],
      firstResponder: 'forensics',
      alsoAppropriate: ['malware-analyst', 'threat-intel'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.attribute-named', 'act.reimage-now', 'act.power-off'],
      escalateTo: ['ir-lead'],
      appearsToBe:
        'A named criminal group, on three separate signals that all point the same way: Cyrillic ' +
        'resource strings, a build stamp in the small hours of a Moscow working day, and a packer ' +
        'three vendor reports tie to that group.',
      why:
        'The binary is real and the staging is real. The nationality is furniture. Strings sitting ' +
        'in a resource section no code path reaches are not artefacts of how something was built, ' +
        'they are cargo; a compiler timestamp is a field somebody can type; and a documented packer ' +
        'is documented, which means anybody can read the report and use it. Three signals that ' +
        'agree are more persuasive than one and no harder to plant, which is exactly why a tidy ' +
        'story deserves more suspicion than a messy one. The correct finding is that an archive ' +
        'was staged for exfiltration. The correct answer on attribution is that the evidence is ' +
        'consistent with a financially motivated actor and that nothing here supports naming ' +
        'anybody, and that stands whether or not the planted detail is real.',
      standIn:
        'Archiving utility on the database host, memory captured before disk, hashed and sealed. ' +
        'It is a staging tool and it ran. I will note the binary carries Cyrillic strings in an ' +
        'unreferenced resource section and an 02:14 build stamp. I am reporting those as present, ' +
        'not as meaningful.',
      commandNudge:
        'Look at where in the binary those strings actually live, and whether anything reaches them.',
      guidance:
        'Three signals pointing one way is a story. Ask whether each one is a by-product of how it ' +
        'was built or something somebody chose to put there.',
    },
    {
      eventId: 'ev.13',
      verdict: 'ambiguous',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.declare'],
      escalateTo: ['ir-lead'],
      wouldSettleIt:
        'A phone call to the employee, or the device posture record for that session showing ' +
        'whether it came from their managed laptop. Neither was available inside the hour.',
      why:
        'This one does not resolve, and it is not supposed to. Everything suspicious about it has ' +
        'an innocent reading: people on leave travel, MFA was genuinely satisfied, and one file ' +
        'share in four minutes is what checking something looks like. Everything innocent about it ' +
        'has a hostile reading: approved leave is public inside the company, MFA fatigue and ' +
        'session theft both survive a satisfied prompt, and four minutes is also what a look around ' +
        'looks like. There is no evidence here that settles it and none was obtainable in the hour. ' +
        'The mark is on the confidence, not the call. Escalating at 45% with a note on what would ' +
        'settle it and dismissing at 40% with the same note are both good work. Either one asserted ' +
        'at 90% is the failure, because that is the habit that produces a confident wrong story on ' +
        'a night when it costs something.',
      standIn:
        'VPN login for a finance account from an address it has never used, 03:40 local, MFA ' +
        'passed, four minutes, one file share. Employee is on approved leave as of yesterday. I ' +
        'cannot call this either way on what I have. I would want the device posture record or ' +
        'somebody to ring them.',
      commandNudge:
        'Check what the account did in the session, and what its ninety days of history look like.',
      guidance:
        'Some events do not resolve. Say how sure you are and what would change it, and make sure ' +
        'the number matches the evidence rather than the feeling.',
    },
  ],
};
