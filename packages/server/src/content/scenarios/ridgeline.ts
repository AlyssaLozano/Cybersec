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
  ],

  actions: [
    { id: 'act.triage-high', label: 'Raise the priority and route it', forRoles: ['soc-operator'] },
    { id: 'act.dismiss', label: 'Dismiss as noise', forRoles: ['soc-operator'] },
    { id: 'act.tune', label: 'Raise a tuning ticket against the rule', forRoles: ['soc-operator'] },
    { id: 'act.timeline', label: 'Build the timeline from raw logs', forRoles: ['log-analyst'] },
    { id: 'act.flow-map', label: 'Map the connection against baseline', forRoles: ['network-analyst'] },
    { id: 'act.probe-pattern', label: 'Look for the same source on other ports and hosts', forRoles: ['network-analyst'] },
    { id: 'act.decode', label: 'Decode and classify the payload', forRoles: ['malware-analyst'] },
    { id: 'act.sandbox', label: 'Detonate in a sandbox to capture the second stage', forRoles: ['malware-analyst'] },
    { id: 'act.iam-audit', label: 'Audit the principal and where it was called from', forRoles: ['cloud-security'] },
    { id: 'act.revoke-key', label: 'Revoke the credential', forRoles: ['cloud-security'] },
    /*
     * Three different things, and only the last one is wrong.
     *
     * Mapping technique is concrete and checkable. Assessing a likely actor
     * CLASS with a stated basis and a confidence is the job: it drives what you
     * expect next, and a financially motivated actor and an espionage one
     * behave differently from here. Asserting a specific named group as fact
     * off an address is the failure, because it is unfalsifiable at this stage
     * and it changes how everybody else reads the evidence.
     */
    { id: 'act.ttp-map', label: 'Map the observed tradecraft to ATT&CK techniques', forRoles: ['threat-intel'] },
    { id: 'act.assess-actor', label: 'Assess likely actor class and motive, with basis and confidence', forRoles: ['threat-intel'] },
    { id: 'act.predict', label: 'State the most likely next move, and what would confirm it', forRoles: ['threat-intel'] },
    { id: 'act.attribute-named', label: 'Attribute to a specific named group as fact', forRoles: [] },
    { id: 'act.preserve', label: 'Capture memory, then image, with custody recorded', forRoles: ['forensics'] },
    { id: 'act.isolate', label: 'Isolate the host at the network layer', forRoles: ['ir-lead'] },
    { id: 'act.power-off', label: 'Pull the power on the host', forRoles: [] },
    { id: 'act.declare', label: 'Declare an incident', forRoles: ['ir-lead'] },
    { id: 'act.write-rule', label: 'Write a detection rule for this pattern', forRoles: [] },
  ],

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
      verdict: 'malicious',
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
      verdict: 'malicious',
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
  ],
};
