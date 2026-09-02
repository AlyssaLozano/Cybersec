/**
 * Scenario 27: Golden Hour.
 *
 * The domain signing key is stolen, so the attacker can be anybody, and nothing
 * the estate says about identity can be trusted.
 *
 * WHY THIS IS AT EXPERT
 *
 * Every other scenario has a compromised account somewhere, and the response
 * eventually rests on being able to tell one identity from another. Here that
 * is exactly what has gone.
 *
 * With the domain signing key, an attacker mints authentication tickets for
 * accounts that never logged in, for accounts that do not exist, and for
 * accounts with permissions nobody granted. There is no failed attempt, no
 * password use, no anomalous sign-in, because none of that happens: the ticket
 * is presented already valid. Disabling an account does not help, because the
 * ticket does not consult the account. Changing a password does not help for
 * the same reason.
 *
 * So the floor is investigating identity using an identity system the attacker
 * controls, and the only way out is the same one `below-the-floor` teaches
 * against a rootkit, one layer up: find sources the compromised thing does not
 * produce. Here that is the domain controller replication metadata, the network
 * flows, and the fact that a ticket lifetime somebody set by hand does not
 * match what the policy issues.
 *
 * THE ANSWER NOBODY WANTS
 *
 * The remediation is to rotate the signing key twice, which invalidates every
 * ticket in the estate and logs out every user and every service simultaneously.
 * There is no gentle version. `ev.6` exists so the floor has to say that out
 * loud to somebody who will not want to hear it.
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

const ID = 'golden-hour';

export const GOLDEN_HOUR: Scenario = {
  id: ID,
  title: 'Golden Hour',
  difficulty: 'expert',
  durationMinutes: 60,
  situation:
    'It is 02:10 at Fenmarch Credit Union. A routine reconciliation of domain controller ' +
    'replication found accounts being used that the identity system has no record of ' +
    'authenticating. Payments open at 06:00. Nothing you read from the domain can be assumed true.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
    'forensics',
    'fusion-analyst',
    'threat-intel',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Accounts accessing file shares with no corresponding authentication record',
      detail:
        'Reconciliation between the file server access logs and the domain authentication logs ' +
        'found 340 file access events over nine days by accounts with no matching sign-in. Four of ' +
        'the accounts are dormant and two do not exist in the directory at all. No authentication ' +
        'failure was recorded for any of them.',
      source: 'fcu-dc-01',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'raw-log',
      summary: 'Tickets present with a lifetime the domain policy does not issue',
      detail:
        'Service ticket records show authentication tickets with a ten year validity. Domain policy ' +
        'issues ten hours and has since 2019, and there is no mechanism in the platform to request ' +
        'longer. The affected tickets also name a domain that resolves correctly but is spelled ' +
        'with a different character set in one position.',
      source: 'fcu-dc-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'cloud-audit',
      summary: 'A directory replication request from a host that is not a domain controller',
      detail:
        'On the 14th at 03:41 the directory served a full replication request, including secrets, ' +
        'to fcu-app-06. That host is an application server and has never been a domain controller. ' +
        'The request used an account holding replication rights through a group added during a ' +
        '2021 migration. It completed successfully and took eleven minutes.',
      source: 'fcu-app-06',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'network-flow',
      summary: 'fcu-app-06 transferred 400 MB outbound in the same window',
      detail:
        'Flow records show 400 MB from fcu-app-06 to 198.51.100.19 between 03:52 and 04:20 on the ' +
        '14th, immediately after the replication completed. That address has no history in the ' +
        'estate before or since. The application server has no business reason to reach the ' +
        'internet and holds an egress exception added for a vendor integration in 2020.',
      source: 'fcu-app-06',
      target: '198.51.100.19:443',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'host-artefact',
      summary: 'Payment approver group membership changed with no directory audit entry',
      detail:
        'The payment approval group currently holds two members that the change history does not ' +
        'account for. Both were added on the 19th. The directory audit log has no entry for either ' +
        'addition, and the group has not been modified according to the directory own record of ' +
        'itself. The backup of the directory taken on the 18th shows the group with its expected ' +
        'members.',
      source: 'fcu-dc-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'Payment processing opens at 06:00 and the approver group is compromised',
      detail:
        'Payment initiation runs from 06:00 and the approval group gates every transfer above ' +
        'fifty thousand dollars. Rotating the domain signing key invalidates every authentication ' +
        'ticket in the estate simultaneously, which logs out every user and every service account ' +
        'at once, including the core banking platform. It has to be done twice to be effective.',
      source: 'fcu core banking',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'Directory replication latency alerts across four sites',
      detail:
        'Replication between the four branch sites has been reporting latency above threshold since ' +
        '01:30. Network operations replaced a failing link at the Kingsport branch at 01:20 and the ' +
        'change record notes replication will lag until the queue drains, expected by 04:00. Rule ' +
        'history: fired 210 times in thirty days, 208 closed as expected replication lag.',
      source: 'fcu-dc-02',
      claimedSeverity: 'low',
    },
  ],
};

export const GOLDEN_HOUR_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'On the 14th somebody used an account holding directory replication rights, granted by a 2021 migration nobody unwound, to request a full replication from an ordinary application server.',
    'That handed them the domain signing key, along with every credential in the directory.',
    'They shipped 400 MB out of that server twenty minutes later.',
    'Since then they have been minting their own authentication tickets. A ticket is presented already valid, so no password is used, no sign-in is recorded, and no failure is ever generated.',
    'That is why 340 file accesses have no matching authentication, and why two of the accounts do not exist: a forged ticket does not require the account to.',
    'On the 19th they added two members to the payment approval group. The directory has no audit entry because the change was made with the directory own signing authority.',
    'Disabling accounts does nothing and password changes do nothing, because forged tickets consult neither.',
    'The only remediation is rotating the signing key twice, which logs out every user and every service in the estate at once, and payments open at 06:00.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1550.003'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.isolate', 'act.declare'],
      escalateTo: ['log-analyst', 'ir-lead'],
      why:
        'Access without authentication is not a logging gap, it is a category error, and spotting ' +
        'that it is one is the whole of this event. Files were read by accounts the identity system ' +
        'never saw sign in, and two of those accounts do not exist. An account that does not exist ' +
        'cannot have a stolen password, so whatever is happening is upstream of accounts entirely. ' +
        'The instinct to reset or disable is graded out of lane here for a reason that matters: ' +
        'both act on the account, and the account is not what is being used.',
      standIn:
        'Three hundred and forty file accesses over nine days by accounts with no matching sign-in. ' +
        'Four are dormant and two do not exist in the directory at all. No failures anywhere. You ' +
        'cannot steal the password of an account that does not exist, so this is not about accounts.',
      commandOptions: [
        { command: "comm -13 <(awk '{print $4}' /var/log/auth/signins.log | sort -u) <(awk '{print $3}' /var/log/fileserver/access.log | sort -u)", correct: true, teaches: CORRECT_STEP },
        { command: 'systemctl status winbind', ...STATUS_CHECK },
        { command: 'cat /var/log/fileserver/access.log', ...DUMP_ALL },
        { command: 'grep -c ACCESS /var/log/fileserver/access.log', ...COUNT_ONLY },
        { command: 'net user /domain /delete stale.svc', ...MUTATE },
      ],
      commandNudge:
        'Reconcile who accessed files against who authenticated, and look at what is in one list ' +
        'and not the other.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1558.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'The finding that names it, and it is a field nobody reads. A ten year ticket lifetime in a ' +
        'domain whose policy issues ten hours cannot be requested through the platform at all, so ' +
        'it was not issued, it was forged. The default lifetime a forging tool uses is exactly this ' +
        'long, which is the single clearest artefact available. The character set difference in the ' +
        'domain name is the second: a forged ticket carries whatever domain the forger typed, and ' +
        'the mismatch survives because nothing validates it against the real name. Once this lands, ' +
        'every account in the estate has to be treated as available to the attacker, which is a ' +
        'very different conversation from a compromised user.',
      standIn:
        'Tickets in circulation with a ten year lifetime. Our policy issues ten hours and the ' +
        'platform has no way to request longer, so these were not issued by us. The domain name on ' +
        'them is spelled with a different character in one position. These are forged. Every ' +
        'account in the estate is available to whoever holds that key.',
      commandOptions: [
        { command: "awk '/TGS/ {print $6, $8}' /var/log/auth/tickets.log | sort -u", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i lifetime /etc/krb5.conf', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status krb5kdc', ...STATUS_CHECK },
        { command: 'cat /var/log/auth/tickets.log', ...DUMP_ALL },
        { command: 'grep -c TGS /var/log/auth/tickets.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Compare the lifetime on those tickets against what the domain policy actually issues.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1003.006'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['forensics', 'ir-lead', 'mitigation-specialist'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.reset-password', 'act.reimage-now', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'How they got the key, and it is a single log line from nine days ago. A full directory ' +
        'replication including secrets, served to an application server that has never been a ' +
        'domain controller. Replication is how domain controllers stay in step, so the directory ' +
        'answering the request is correct behaviour: the failure is that an ordinary server was ' +
        'entitled to ask, through a group a 2021 migration left in place. Eleven minutes and it was ' +
        'over. This also fixes the compromise date, which matters because everything the estate has ' +
        'trusted about identity since the 14th has to be re-examined.',
      standIn:
        'On the 14th at 03:41 the directory served a full replication including secrets to ' +
        'fcu-app-06, an application server. It has never been a domain controller. It could ask ' +
        'because of a group added in a 2021 migration. Eleven minutes. That is where the key went, ' +
        'and it means nine days of identity we cannot trust.',
      commandOptions: [
        { command: "awk '/DirSync|Replicate/ {print $1, $5}' /var/log/directory/audit.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i replicat /var/log/directory/audit.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status samba-ad-dc', ...STATUS_CHECK },
        { command: 'cat /var/log/directory/audit.log', ...DUMP_ALL },
        { command: 'grep -c fcu-app-06 /var/log/directory/audit.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out which hosts have requested directory replication, and which of them should be ' +
        'able to.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1041'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Corroboration from a source the directory does not produce, which is the only kind worth ' +
        'much tonight. Four hundred megabytes leaving twenty minutes after an eleven minute ' +
        'replication is the directory going out of the door, and the timing ties the two together ' +
        'without needing anything from the identity platform. The egress exception from a 2020 ' +
        'vendor integration is the quiet second finding: an application server with no business ' +
        'reason to reach the internet has been able to for five years, and nobody revisited it.',
      standIn:
        'Four hundred megabytes out of fcu-app-06 to an address with no history, between 03:52 and ' +
        '04:20 on the 14th, straight after the replication finished. That server holds an egress ' +
        'exception from a 2020 vendor integration. The directory left the building that night.',
      commandOptions: [
        { command: "awk '$2==\"fcu-app-06\" {sum+=$6} END {print sum}' /var/log/flows.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep 198.51.100.19 /var/log/flows.log', correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'curl -sI https://198.51.100.19', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Look at what that server sent externally in the hour after the replication completed.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'privilege-escalation',
      critical: true,
      techniques: ['T1098', 'T1070.001'],
      firstResponder: 'forensics',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reset-password', 'act.reimage-now', 'act.power-off'],
      escalateTo: ['ir-lead'],
      why:
        'What they came for, and the way it was found is the lesson. The payment approval group has ' +
        'two members the change history cannot account for, and the directory audit log has no ' +
        'entry for either, because a change made with the directory own signing authority does not ' +
        'have to be recorded. The directory is describing itself and the description is false. The ' +
        'only reason this is provable is the backup taken on the 18th, which is a separate copy the ' +
        'attacker did not sign: comparing the live directory against an offline snapshot is the ' +
        'move, and it is the same move as imaging from the array rather than the running host.',
      standIn:
        'The payment approval group has two members the change history does not account for, added ' +
        'on the 19th, with no directory audit entry for either. The directory says it was not ' +
        'modified. The backup from the 18th shows the group with its expected members. That ' +
        'comparison is the only reason we can prove this. Sealed.',
      commandOptions: [
        { command: 'diff <(ldapsearch -x -b "cn=PaymentApprovers" member) <(cat /backup/dir-18th/PaymentApprovers.ldif)', correct: true, teaches: CORRECT_STEP },
        { command: 'ldapsearch -x -b "cn=PaymentApprovers" member', ...WRONG_TARGET },
        { command: 'systemctl status slapd', ...STATUS_CHECK },
        { command: 'cat /var/log/directory/group-changes.log', ...DUMP_ALL },
        { command: 'net group "PaymentApprovers" /domain /delete', ...MUTATE },
      ],
      commandNudge:
        'Compare the live directory against a copy taken before the compromise, rather than asking ' +
        'the directory about itself.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1558.001'],
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['cloud-security'],
      correctActions: ['act.declare', 'act.notify-legal'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.reimage-now'],
      escalateTo: [],
      why:
        'The decision, and there is no comfortable version of it. Rotating the signing key twice is ' +
        'the only remediation that works, and it invalidates every ticket in the estate at once: ' +
        'every user and every service account, including core banking, logged out simultaneously. ' +
        'Doing it before 06:00 means a credit union that cannot process payments at opening. Not ' +
        'doing it means payments processed at opening under an approval group an attacker controls. ' +
        'Both of those are bad and only one of them is recoverable. What this seat owes is the ' +
        'choice stated plainly with the cost of each side attached, and the sequencing worked out ' +
        'with the payments team rather than sprung on them, because the tempo here is not the ' +
        'hospital tempo: money settles in minutes and does not come back.',
      standIn:
        'Rotating the key is the only thing that works and it has to be done twice. That logs out ' +
        'every user and every service at once, core banking included. Payments open at 06:00 and ' +
        'the approval group is compromised. Processing at opening under their control is worse than ' +
        'opening late. I want the payments team on this call now, not told afterwards.',
      commandNudge:
        'Work out what rotating the key actually breaks, and what happens if you do not.',
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
        'Directory replication alerting across four sites, on the night the floor has just found a ' +
        'directory replication attack. The words match exactly and the events have nothing to do ' +
        'with each other: this is latency from a link replaced at 01:20 with a change record saying ' +
        'the queue will drain by 04:00, and 208 of 210 were closed the same way this month. Two ' +
        'checks settle it, the change record and whether anything actually failed. It is the most ' +
        'expensive available distraction because it is the only row tonight whose vocabulary ' +
        'matches the real finding, and the floor has under four hours before payments open.',
      standIn:
        'Replication latency across the four branches since 01:30, from the link network operations ' +
        'replaced at Kingsport at 01:20, change record says it drains by 04:00. Latency, not a ' +
        'replication request. Two hundred and eight of two hundred and ten this month were the ' +
        'same. Closing it.',
      commandOptions: [
        { command: 'grep -i kingsport /var/log/change-management.log', correct: true, teaches: CORRECT_STEP },
        { command: 'systemctl status ntpd', ...STATUS_CHECK },
        { command: 'cat /var/log/directory/replication.log', ...DUMP_ALL },
        { command: 'grep -c LATENCY /var/log/directory/replication.log', ...COUNT_ONLY },
        { command: 'ping -c 4 fcu-dc-02', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check whether that is replication failing or replication being slow, and whether anybody ' +
        'has a change open.',
    },
  ],
};
