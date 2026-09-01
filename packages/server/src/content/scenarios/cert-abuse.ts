/**
 * Scenario 28: Certificate Of Trust.
 *
 * A certificate template that lets anybody ask to be anybody.
 *
 * WHAT THIS TEACHES
 *
 * That persistence does not have to be a file, a task or a key on a host. Here
 * it is a certificate the organisation issued, correctly, through its own
 * authority, to somebody who asked politely.
 *
 * The consequence is the part that surprises people. A password reset does not
 * revoke a certificate. Disabling the account does not revoke a certificate.
 * Rebuilding the machine does not revoke a certificate. It is valid for two
 * years and it authenticates as whoever the subject field says, so the attacker
 * has an identity the estate will keep honouring long after every other
 * containment action has been taken and the incident has been closed.
 *
 * WHY IT IS NOT AN EXPLOIT
 *
 * Nothing was hacked. A certificate template was configured, years ago, to let
 * the requester specify the subject, because at the time somebody needed to
 * issue certificates on behalf of service accounts and that was the quickest way
 * to allow it. Every request since has been served correctly. The vulnerability
 * is a checkbox, and the floor has to find it by reading a configuration rather
 * than by finding a payload.
 *
 * THE SCOPE QUESTION IS THE HARD ONE
 *
 * 340 certificates have been issued from that template in eighteen months. Most
 * are legitimate. Working out which are not, when every one was issued
 * correctly, is `ev.6`, and it is the reason the Vulnerability Analyst is
 * seated.
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

const ID = 'certificate-of-trust';

export const CERTIFICATE_OF_TRUST: Scenario = {
  id: ID,
  title: 'Certificate Of Trust',
  difficulty: 'advanced',
  durationMinutes: 60,
  situation:
    'It is 09:40 at Ardal Freight. An administrator account authenticated to the warehouse ' +
    'management system from a machine it has never been used from, and the account holder says it ' +
    'was not them. Nothing has been exploited and nothing has failed.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
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
      summary: 'Administrator account authenticated from a warehouse floor terminal',
      detail:
        'The adf-svc-wmsadmin account authenticated to the warehouse management system at 07:12 ' +
        'from ADF-WS-3312, a shared terminal on the Felixstowe picking floor. That account has ' +
        'ninety days of history and has only ever been used from the two administrative jump ' +
        'hosts. The authentication succeeded on the first attempt and used no password. Rule ' +
        'history: fired 18 times in thirty days, 16 closed as engineers working from unusual ' +
        'locations.',
      source: 'ADF-WS-3312',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 150,
      surface: 'cloud-audit',
      summary: 'A certificate was issued naming a subject that is not the requester',
      detail:
        'At 06:58 the internal certificate authority issued a client authentication certificate to ' +
        'a request submitted by g.holloway, a warehouse supervisor account. The subject alternative ' +
        'name on the issued certificate is adf-svc-wmsadmin. The request was approved ' +
        'automatically, as the template is configured for automatic enrolment, and the certificate ' +
        'is valid for two years.',
      source: 'adf-ca-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 310,
      surface: 'raw-log',
      summary: 'The template permits the requester to specify the subject',
      detail:
        'Template WarehouseClient was created in 2019 with the flag that allows a requester to ' +
        'supply their own subject alternative name, and grants enrolment rights to Domain Users. ' +
        'The change record from 2019 says it was needed so the platform team could issue ' +
        'certificates on behalf of service accounts. Every request served since has been served ' +
        'according to that configuration.',
      source: 'adf-ca-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 470,
      surface: 'network-flow',
      summary: 'The certificate authenticated to three systems in twenty minutes',
      detail:
        'The issued certificate was presented to the warehouse management system, the customs ' +
        'manifest filing service and the yard access controller between 07:12 and 07:33, all from ' +
        'ADF-WS-3312. Each accepted it. Certificate authentication is enabled on all three because ' +
        'handheld scanners on the picking floor use it.',
      source: 'ADF-WS-3312',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'host-artefact',
      summary: 'The private key was exported to a file on the requesting workstation',
      detail:
        'The certificate store on ADF-WS-3312 shows the key marked exportable and a PKCS#12 file ' +
        'written to a user profile directory at 07:04, then removed at 07:41. File carving ' +
        'recovered it. The certificate remains valid, is not on any revocation list, and would ' +
        'continue to authenticate from any machine holding that file.',
      source: 'ADF-WS-3312',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'The template has issued 340 certificates in eighteen months',
      detail:
        'Certificate authority records show 340 issuances from WarehouseClient since it was ' +
        'enabled for automatic enrolment. Handheld scanners account for most of them. There is no ' +
        'report that compares the requester against the subject on the issued certificate, and no ' +
        'alert fires on a mismatch.',
      source: 'adf-ca-01',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'Ninety certificates expire in the next fourteen days',
      detail:
        'The certificate lifecycle report shows 90 certificates expiring within fourteen days, ' +
        'almost all handheld scanners on their annual renewal cycle. The platform team has a ' +
        'scheduled renewal task and a change record. Rule history: fired 12 times in thirty days, ' +
        '12 closed as routine renewal.',
      source: 'adf-ca-01',
      claimedSeverity: 'low',
    },
  ],
};

export const CERTIFICATE_OF_TRUST_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'A certificate template created in 2019 lets any domain user request a certificate and specify whose identity it carries.',
    'At 06:58 somebody using a warehouse supervisor account asked for a certificate naming the warehouse management administrator, and the authority issued it automatically, correctly, according to its configuration.',
    'They exported the private key to a file at 07:04 and deleted the file at 07:41.',
    'At 07:12 they used the certificate to authenticate as that administrator, with no password, on the first attempt.',
    'In twenty minutes they reached the warehouse management system, the customs manifest filing service and the yard access controller.',
    'Nothing was exploited. Every request was served as designed and every authentication was valid.',
    'The certificate is good for two years. It survives a password reset, disabling the account and rebuilding the machine, because none of those revoke a certificate.',
    'The template has issued 340 certificates in eighteen months and nothing compares the requester against the subject.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'privilege-escalation',
      techniques: ['T1550'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.isolate', 'act.declare'],
      escalateTo: ['log-analyst', 'cloud-security'],
      why:
        'Sixteen of eighteen this month were engineers working from odd places, and this looks like ' +
        'the seventeenth. Two details say otherwise and both are in the row. The account has ninety ' +
        'days of history and has only ever come from two jump hosts, and this is a shared terminal ' +
        'on a picking floor. And the authentication used no password and succeeded first time, ' +
        'which is not what a person logging in from an unusual place looks like: they mistype, they ' +
        'get prompted, there is a failure somewhere. A clean passwordless success means something ' +
        'other than a password was presented, and that is worth ten minutes from somebody.',
      standIn:
        'Admin account authenticated to the warehouse system at 07:12 from a shared terminal on the ' +
        'Felixstowe picking floor. Ninety days of history and it has only ever come from the two ' +
        'jump hosts. No password used and it worked first time. The account holder says it was not ' +
        'them. Raising it.',
      commandOptions: [
        { command: "awk '$5==\"adf-svc-wmsadmin\" {print $9}' /var/log/auth/history.log | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep adf-svc-wmsadmin /var/log/auth/history.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status wms', ...STATUS_CHECK },
        { command: 'cat /var/log/auth/history.log', ...DUMP_ALL },
        { command: 'net user adf-svc-wmsadmin /domain /active:no', ...MUTATE },
      ],
      commandNudge:
        'Check every machine that account has ever authenticated from, and how it authenticated ' +
        'this time.',
      guidance:
        'A login with no password and no failures is not somebody remembering their password. Ask ' +
        'what was presented instead.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      techniques: ['T1649'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.reset-password', 'act.reimage-now', 'act.dismiss'],
      escalateTo: ['ir-lead', 'vulnerability-analyst'],
      why:
        'The whole incident in one log line, and it is a line nobody reads. A warehouse supervisor ' +
        'asked for a certificate and the authority issued one naming the administrator account. ' +
        'Requester and subject are different fields and nothing anywhere compares them, so this was ' +
        'approved automatically in under a second. The two year validity is the part to carry into ' +
        'the report, because it changes what containment means: this certificate outlives a ' +
        'password reset, outlives disabling the account, and outlives rebuilding the machine. ' +
        'Revoking it is the only action that helps, and it is the one nobody reaches for by ' +
        'instinct.',
      standIn:
        'At 06:58 the certificate authority issued a client auth certificate to a request from ' +
        'g.holloway, a warehouse supervisor, with the subject name set to adf-svc-wmsadmin. ' +
        'Automatic enrolment, approved in under a second, valid for two years. Nothing compares who ' +
        'asked against who it says they are. Revoking it now: a password reset does nothing to a ' +
        'certificate.',
      commandOptions: [
        { command: "awk -F, '$2!=$3 {print $1, $2, $3}' /var/log/pki/issued.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep wmsadmin /var/log/pki/issued.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status certsrv', ...STATUS_CHECK },
        { command: 'cat /var/log/pki/issued.csv', ...DUMP_ALL },
        { command: 'grep -c ISSUED /var/log/pki/issued.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Compare who requested each certificate against whose identity the certificate carries.',
      guidance:
        'Ask what identity that certificate claims, and who asked for it. They are different fields.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'privilege-escalation',
      critical: true,
      techniques: ['T1649'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reimage-now', 'act.reset-password', 'act.write-rule'],
      escalateTo: ['vulnerability-analyst', 'ir-lead'],
      why:
        'Why it worked, and there is no exploit in it. A template configured in 2019 to let the ' +
        'requester supply the subject, with enrolment granted to Domain Users, which is everybody. ' +
        'The 2019 change record gives a real reason: the platform team needed to issue certificates ' +
        'on behalf of service accounts and this was the quickest way to allow it. Nobody was ' +
        'careless and nobody was attacked. This is the shape of most serious findings in a mature ' +
        'estate: a reasonable decision, made under time pressure, that nothing has revisited in six ' +
        'years. Reporting it as a misconfiguration rather than a compromise is more accurate and ' +
        'more useful, because it points at the review that was never scheduled.',
      standIn:
        'Template WarehouseClient, created 2019, allows the requester to supply their own subject ' +
        'and grants enrolment to Domain Users, which is everyone. The change record says it was for ' +
        'issuing certificates on behalf of service accounts. Every request since has been served ' +
        'exactly as configured. There is no exploit here, there is a checkbox.',
      commandOptions: [
        { command: "grep -A8 'WarehouseClient' /etc/pki/templates.conf", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "SubjectAltRequestAttribute\\|ENROLLEE_SUPPLIES_SUBJECT" /etc/pki/templates.conf', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status certsrv', ...STATUS_CHECK },
        { command: 'cat /etc/pki/templates.conf', ...DUMP_ALL },
        { command: 'find /etc -name "*.conf" -newermt "2019-01-01"', ...WRONG_TARGET },
      ],
      commandNudge:
        'Read the template configuration and work out who is allowed to request one and what they ' +
        'may put on it.',
      guidance:
        'Nothing was exploited. Ask what the configuration actually permits, and who changed it.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'lateral-movement',
      techniques: ['T1550'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'What it reached, and it decides how big this is. One certificate, three systems, twenty ' +
        'minutes: warehouse management, customs manifest filing and the yard access controller. ' +
        'All three accept certificate authentication because the handheld scanners on the picking ' +
        'floor need it, which is a reasonable design that turns one forged identity into estate ' +
        'wide access. The customs filing service is the one to name explicitly in the report. ' +
        'Manifest integrity is a customs authority matter with its own notification obligations, ' +
        'and it is separate from anything about personal data.',
      standIn:
        'That certificate authenticated to the warehouse management system, the customs manifest ' +
        'filing service and the yard access controller between 07:12 and 07:33, all from the same ' +
        'terminal. All three accept certificates because the handhelds use them. Customs filing ' +
        'means manifest integrity, which is its own notification.',
      commandOptions: [
        { command: "awk '$3==\"ADF-WS-3312\" {print $1, $5}' /var/log/flows.log | sort -u", correct: true, teaches: CORRECT_STEP },
        { command: 'grep ADF-WS-3312 /var/log/flows.log', correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'grep -c ADF-WS-3312 /var/log/flows.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'List every system that terminal reached in the twenty minutes after the certificate was ' +
        'used.',
      guidance:
        'One credential reached several places. Ask which of them matters most to this business.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      techniques: ['T1552.004'],
      firstResponder: 'forensics',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'The reason this is not over when the terminal is cleaned. The key was marked exportable, ' +
        'written to a file at 07:04 and deleted at 07:41, and the file was recovered from ' +
        'unallocated space. A certificate plus its private key in a file authenticates from ' +
        'anywhere, so whoever holds that copy has the administrator identity on any machine they ' +
        'like, for two years, without ever touching this terminal again. Deleting it here changes ' +
        'nothing, because the copy that matters left. The only thing that helps is revocation, and ' +
        'the report should say that in those words, because a floor that reimages the workstation ' +
        'and closes has done real work and achieved nothing.',
      standIn:
        'The key was marked exportable and written to a PKCS#12 file at 07:04, deleted at 07:41. ' +
        'Recovered it from unallocated space, hashed and sealed. That file authenticates from any ' +
        'machine. Wiping this terminal does not help. Revocation is the only thing that does.',
      commandOptions: [
        { command: "ls -la /home/g.holloway/AppData/Roaming/ && photorec -d /tmp/carve /dev/sda1", correct: true, teaches: CORRECT_STEP },
        { command: 'certutil -store -user My', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status certsvc', ...STATUS_CHECK },
        { command: 'cat /var/log/syslog', ...DUMP_ALL },
        { command: 'shred -u /home/g.holloway/AppData/Roaming/*.pfx', ...MUTATE },
      ],
      commandNudge:
        'Find out whether the private key could leave the machine, and whether it did.',
      guidance:
        'Ask whether a copy of this could exist somewhere else. If it can, cleaning this machine is ' +
        'not containment.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'discovery',
      techniques: ['T1649'],
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.preserve', 'act.isolate', 'act.declare', 'act.revoke-key'],
      escalateTo: ['ir-lead'],
      why:
        'The question nobody else will ask, and the hardest one on the board. 340 certificates from ' +
        'this template in eighteen months, most of them handheld scanners doing exactly what they ' +
        'should. Every one was issued correctly, so there is no failure to search for and no alert ' +
        'that ever fired. The only way through is the comparison that does not exist anywhere in ' +
        'the platform: requester against subject, across all 340. That is a report somebody has to ' +
        'write today, and it is also the control that should have existed since 2019. Revoking the ' +
        'template wholesale would stop the picking floor, so the recommendation has to survive ' +
        'contact with a warehouse that will not pause.',
      standIn:
        'Three hundred and forty certificates from that template in eighteen months, mostly ' +
        'handheld scanners. All issued correctly, so nothing alerted and there is nothing to search ' +
        'for. I need requester compared against subject across all of them, which is a report that ' +
        'does not exist. And I cannot just kill the template: the picking floor runs on it.',
      commandOptions: [
        { command: "awk -F, '$4==\"WarehouseClient\" && $2!=$3' /var/log/pki/issued.csv | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$4==\"WarehouseClient\" {print $2, $3}' /var/log/pki/issued.csv | sort -u", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status certsrv', ...STATUS_CHECK },
        { command: 'cat /var/log/pki/issued.csv', ...DUMP_ALL },
        { command: 'grep -c WarehouseClient /var/log/pki/issued.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find every certificate issued from that template where the requester and the subject do ' +
        'not match.',
      guidance:
        'One certificate was abused. Ask how many others could have been, and how you would tell.',
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
        'Ninety certificates expiring in a fortnight, on the morning the floor is working a ' +
        'certificate incident. It is the annual handheld scanner renewal, with a scheduled task and ' +
        'a change record, and twelve of twelve this month were the same. The check is what kind of ' +
        'certificates and is there a renewal scheduled, which takes a minute. Worth noticing why ' +
        'this is the opposite of the real finding: expiry is certificates ending, and the incident ' +
        'is about a certificate that will not end for two years. The vocabulary matches and the ' +
        'direction is reversed.',
      standIn:
        'Ninety certificates expiring in fourteen days, almost all handheld scanners on the annual ' +
        'renewal cycle, scheduled task and change record both exist. Twelve of twelve this month ' +
        'were the same. Our problem is a certificate that does not expire for two years. Closing it.',
      commandOptions: [
        { command: "awk -F, '$4==\"WarehouseClient\" {print $5}' /var/log/pki/expiring.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i renewal /var/log/change-management.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status certsrv', ...STATUS_CHECK },
        { command: 'cat /var/log/pki/expiring.csv', ...DUMP_ALL },
        { command: 'grep -c EXPIRING /var/log/pki/expiring.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check what those expiring certificates are for and whether a renewal is already scheduled.',
      guidance:
        'Certificates ending and a certificate that will not end are different problems. Check ' +
        'which one this is.',
    },
  ],
};
