/**
 * Scenario 02: Low Tide.
 *
 * A password spray against the VPN, one account accepted, and no malware
 * anywhere in the hour.
 *
 * WHAT THIS ONE TEACHES THAT RIDGELINE CANNOT
 *
 * Ridgeline has a payload. There is an encoded interpreter call, a staged
 * archive, something a malware seat can decode and hold up. That is the
 * comfortable shape of an incident and it trains a floor to look for the
 * artefact.
 *
 * Here there is nothing to decode. Every action the attacker takes is a
 * legitimate authenticated session doing things the account is permitted to do.
 * The entire signal is in shape: which accounts were tried, in what order, from
 * where, at what cadence, and what the one that worked did next. A floor that
 * needs a binary to point at will spend the hour finding nothing and closing it.
 *
 * THE OTHER LESSON: SPRAY IS NOT BRUTE FORCE
 *
 * Ridgeline's ev.1 is sixty-two attempts on one account, which trips a lockout
 * threshold and lights up a rule. This is two attempts each against four hundred
 * accounts, which trips nothing, because every counter it would trip is
 * per-account. The detection that catches it has to count the other way, and
 * that is the finding the Detection Engineer takes away.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';

const ID = 'low-tide';

export const LOW_TIDE: Scenario = {
  id: ID,
  title: 'Low Tide',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 06:20 at Ridgeline Medical Group and the overnight authentication summary looks ' +
    'unremarkable. No account locked out. No malware alert anywhere in the estate. Something is ' +
    'still wrong. Work your surface and say what you can prove.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
    'threat-intel',
    'forensics',
    'detection-engineer',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Authentication failure volume on vpn-gw-01 above the nightly average',
      detail:
        'The overnight summary counted 812 failed VPN authentications against 406 distinct ' +
        'accounts between 02:00 and 05:40. No account exceeded two failures, so no account ' +
        'locked out and no per-account rule fired. The nightly average for this window is 40 to ' +
        '90 failures. Rule history: fired 3 times in thirty days, 3 closed as not worth acting on.',
      source: 'vpn-gw-01',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 90,
      surface: 'raw-log',
      summary: 'Failures walk the staff directory in alphabetical order',
      detail:
        'The failed accounts, sorted by first attempt, run a.abbott, a.acheson, a.adeyemi, ' +
        'a.aguilar and onward. Two attempts per account, roughly nine seconds apart, then the ' +
        'next account. The list matches the order of the public staff directory page. Both ' +
        'passwords tried are the same two strings for every account.',
      source: 'vpn-gw-01',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.3',
      atSeconds: 200,
      surface: 'network-flow',
      summary: 'All authentication attempts arrive from six addresses in one hosting range',
      detail:
        'The 812 attempts come from six addresses in 203.0.113.0/24, rotating every 130 to 140 ' +
        'attempts. No other traffic from these addresses touches the estate in ninety days of ' +
        'flow history. The rotation is regular enough to be scripted rather than hand-driven.',
      source: '203.0.113.0/24',
      target: 'vpn-gw-01:443',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.4',
      atSeconds: 320,
      surface: 'raw-log',
      summary: 'One accepted authentication at 04:12 for m.delgado, no failures before it',
      detail:
        'A successful VPN authentication for m.delgado at 04:12:07, from 203.0.113.88, which is ' +
        'one of the six. The account had exactly one prior failed attempt in the run. MFA was ' +
        'not challenged: this account is in the legacy exemption group carried over from the ' +
        'building access system migration. Ninety days of history show this account authenticating ' +
        'only from the office range, only on weekdays, never before 07:30.',
      source: '203.0.113.88',
      target: 'vpn-gw-01',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.5',
      atSeconds: 470,
      surface: 'cloud-audit',
      summary: 'Directory enumeration by m.delgado four minutes after the VPN session opened',
      detail:
        'The m.delgado principal called ListUsers, ListGroups and ListGroupsForUser 34 times in ' +
        'under three minutes, then stopped. Every call succeeded and every one is inside the ' +
        'permissions a standard staff account holds. This principal has never called any of the ' +
        'three before. No object was created, modified or deleted.',
      source: 'm.delgado',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.6',
      atSeconds: 600,
      surface: 'alert-queue',
      summary: 'Password reset requested for r.venkataraman from the self-service portal',
      detail:
        'A self-service password reset completed for r.venkataraman at 06:02, verified against ' +
        'the security questions on file. The request came from the office range during working ' +
        'hours. The service desk ticket queue shows a matching call logged at 05:58. Rule ' +
        'history: fired 1,140 times in thirty days, 1,139 closed as not worth acting on.',
      source: 'r.venkataraman',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.7',
      atSeconds: 760,
      surface: 'host-artefact',
      summary: 'VPN session for m.delgado mounted one file share and read no files from it',
      detail:
        'Session logs show the share \\\\rmg-fs-01\\clinical-archive mounted at 04:19 and ' +
        'unmounted at 04:21. No file reads are recorded. The share holds records the account is ' +
        'entitled to reach. The directory listing was retrieved twice.',
      source: 'rmg-fs-01',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.8',
      atSeconds: 880,
      surface: 'network-flow',
      summary: 'Session held open with 40-second keepalives and no other traffic for 71 minutes',
      detail:
        'After the share was unmounted the VPN session carried nothing but keepalives until ' +
        '05:32, when it closed cleanly. Total data transferred over the whole session is 2.1 MB. ' +
        'Normal sessions for this account average 340 MB and close within twenty minutes of the ' +
        'last activity.',
      source: 'vpn-gw-01',
      target: '203.0.113.88',
      claimedSeverity: 'low',
    },
  ],
};

export const LOW_TIDE_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Somebody scraped the public staff directory and turned it into a username list.',
    'They sprayed two common passwords across all 406 accounts, two attempts each, so no lockout counter ever filled.',
    'One account, exempt from MFA by a migration nobody unwound, accepted the second password.',
    'The session enumerated the directory to learn the shape of the organisation, then stopped.',
    'It mounted a records share, listed it twice, read nothing, and left the session open for another hour.',
    'Nothing was stolen tonight. This was reconnaissance conducted with a valid credential, and the credential still works.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1110.003'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.declare', 'act.reset-password'],
      escalateTo: ['log-analyst'],
      why:
        'Every instinct trained on Ridgeline says this is nothing. No account locked out, no rule ' +
        'fired more than three times this month, severity low. That is exactly what a spray looks ' +
        'like, and the reason it works: the counters are per account, and the attacker never ' +
        'fills one. The number that matters is not two failures on any account, it is 406 ' +
        'accounts in one window against a baseline of 40 to 90 total. Counting the wrong axis is ' +
        'the whole failure mode here.',
      standIn:
        'Overnight VPN failures are ten times the nightly average, spread across 406 accounts at ' +
        'two attempts each. Nothing locked out because nothing got close to the threshold. I am ' +
        'raising it and sending it to logs.',
      commandOptions: [
        'grep "authentication failure" /var/log/vpn.log | wc -l',
        "grep 'authentication failure' /var/log/vpn.log | awk '{print $NF}' | sort -u | wc -l",
        'tail -100 /var/log/vpn.log',
        'grep "locked" /var/log/vpn.log',
        'systemctl status openvpn',
      ],
      commandNudge:
        'The total is not the interesting number. Count how many distinct accounts appear.',
      guidance:
        'Ask what a lockout threshold actually counts, and whether an attacker who knows the ' +
        'number would ever reach it.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'reconnaissance',
      techniques: ['T1589.002', 'T1110.003'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.revoke-key', 'act.write-rule'],
      escalateTo: ['ir-lead', 'threat-intel'],
      why:
        'Alphabetical order is the finding. A human guessing at passwords does not walk a staff ' +
        'directory from a.abbott; a script fed a scraped list does. Two passwords tried against ' +
        'every account, rather than many passwords against one, settles what this is: the attacker ' +
        'is not trying to break an account, they are trying to find the account that already has a ' +
        'weak password. It also tells you where the list came from, which is a public page nobody ' +
        'thought of as an asset.',
      standIn:
        'Failures run the staff directory alphabetically, two attempts per account, same two ' +
        'passwords throughout. That is a scraped username list and a spray, not somebody guessing.',
      commandOptions: [
        'sort -k1 /var/log/vpn.log | head -50',
        "grep failure /var/log/vpn.log | awk '{print $6}' | head -40",
        'grep delgado /var/log/vpn.log',
        'wc -l /var/log/vpn.log',
        'grep -c Accepted /var/log/vpn.log',
      ],
      commandNudge: 'Look at the ORDER the accounts were tried in, not just which ones.',
      guidance:
        'Where would somebody get a complete, correctly spelled list of staff usernames without ' +
        'touching the estate?',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1583.003'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['threat-intel'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['threat-intel', 'ir-lead'],
      why:
        'Six addresses rotating on a fixed count is infrastructure, and the regularity is the ' +
        'evidence: a person does not switch source every 134 attempts. Worth saying clearly what ' +
        'this does NOT establish. Six addresses in one hosting range tells you somebody rented ' +
        'something. It does not tell you who they are, and the addresses will be gone by tomorrow, ' +
        'which is why the rotation pattern is worth more to the next detection than the addresses ' +
        'themselves.',
      standIn:
        'All 812 attempts come from six addresses in one hosting range, rotating every 130 to 140 ' +
        'attempts. No other traffic from them in ninety days. That is rented infrastructure driven ' +
        'by a script.',
      commandOptions: [
        "awk '{print $3}' /var/log/vpn.log | sort | uniq -c | sort -rn",
        'grep 203.0.113 /var/log/vpn.log | wc -l',
        'netstat -an | grep 443',
        'cat /etc/hosts',
        'traceroute 203.0.113.88',
      ],
      commandNudge: 'Count the attempts per source address and see whether the switch is regular.',
      guidance:
        'An address is the cheapest thing for an attacker to change. Ask what about this pattern ' +
        'would still be true next week.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1078.004', 'T1110.003'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['ir-lead', 'forensics'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.declare'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'This is the event the hour turns on, and it is the quietest thing on the board: one ' +
        'success, one prior failure, no alert. Three details make it certain rather than probable. ' +
        'It came from one of the six spray addresses. It happened at 04:12 for an account that has ' +
        'never authenticated before 07:30 in ninety days. And MFA never challenged it, because a ' +
        'migration exemption nobody unwound is still in place. The exemption is not a footnote, it ' +
        'is the reason the spray succeeded at all, and it will still be there tomorrow.',
      standIn:
        'One acceptance at 04:12 for m.delgado, from a spray address, on an account that has never ' +
        'authenticated outside office hours or off the office range. MFA did not challenge it. ' +
        'That account is in a legacy exemption group.',
      commandOptions: [
        'grep "Accepted" /var/log/vpn.log',
        'grep delgado /var/log/vpn.log | grep -v failure',
        'last -20',
        'cat /etc/passwd | grep delgado',
        'grep 04:12 /var/log/syslog',
      ],
      commandNudge:
        'Find the acceptances in that window, then check what that account normally does.',
      guidance:
        'A spray only needs to work once. Look for the success, then ask why the second factor did ' +
        'not stop it.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'reconnaissance',
      techniques: ['T1087.002', 'T1069.002'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'threat-intel'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.timeline', 'act.preserve', 'act.write-rule'],
      escalateTo: ['ir-lead'],
      why:
        'Every one of these 34 calls is permitted, succeeded, and changed nothing. That is what ' +
        'makes it hard: there is no denial to alert on and no object to point at. The signal is ' +
        'that a principal with ninety days of history has never made any of these calls before, ' +
        'made 34 of them in three minutes, and stopped. That is somebody learning the shape of an ' +
        'organisation they have just walked into. Least privilege would not have prevented it, ' +
        'because reading the directory is genuinely part of the job.',
      standIn:
        'The delgado principal ran 34 directory enumeration calls in three minutes, all permitted, ' +
        'all successful, none of them ever called by this principal before. Nothing was modified. ' +
        'That is somebody working out who is who.',
      commandNudge: 'Compare what this principal called tonight against what it has ever called.',
      guidance:
        'Nothing here was denied and nothing was changed. Ask what the calls were FOR.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.iam-audit'],
      escalateTo: [],
      why:
        'A real password reset, correctly verified, from the office during working hours, with a ' +
        'service desk ticket logged four minutes before it. The rule has fired 1,140 times this ' +
        'month and 1,139 were nothing. It is on the board because a floor working an authentication ' +
        'incident will pattern-match on the word "password" and pull this in. Escalating it costs ' +
        'somebody a look they do not have to spare in an hour where the real credential is still ' +
        'live, and pulling a nurse into an incident interview over a routine reset has a cost too.',
      standIn:
        'Self-service reset for r.venkataraman, verified, from the office, with a matching service ' +
        'desk call four minutes prior. I am closing it.',
      commandOptions: [
        'grep venkataraman /var/log/auth.log',
        'grep "password reset" /var/log/portal.log',
        'cat /var/log/servicedesk/tickets.log | tail -20',
        'grep 203.0.113 /var/log/portal.log',
        'systemctl status portal',
      ],
      commandNudge:
        'Check where the reset came from and whether anything else corroborates it.',
      guidance:
        'Not everything with the word password in it belongs to tonight. Check the source and the ' +
        'ticket before you pull it in.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1039', 'T1083'],
      firstResponder: 'forensics',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'A mount with no reads is stranger than a mount with many. If somebody wanted these ' +
        'records they would have taken them; two directory listings and nothing else is somebody ' +
        'confirming that the access works and seeing how much is there. Preserving it now matters ' +
        'more than usual precisely because nothing was taken: with no stolen file to point at, the ' +
        'session record IS the evidence, and share session logs roll faster than most people ' +
        'expect.',
      standIn:
        'The session mounted the clinical archive share at 04:19, listed it twice, read no files, ' +
        'and unmounted two minutes later. Logs captured and sealed. Nothing was taken from it.',
      commandNudge:
        'Look at what the session did with the share after mounting it, not just that it mounted it.',
      guidance:
        'Ask why somebody would open a door, look at it, and close it without taking anything.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1078.004'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'detection-engineer'],
      correctActions: ['act.flow-map'],
      outOfLaneActions: ['act.decode', 'act.sandbox', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Seventy-one minutes of keepalives and 2.1 MB total. There is no exfiltration here and ' +
        'saying so plainly is part of the answer: a floor that reports "possible data theft" ' +
        'because a share was mounted has told the business something untrue. What the held session ' +
        'shows is intent to come back. Persistence usually means a key or a scheduled task; here it ' +
        'is just a session nobody closed and a credential that still works. The action item is not ' +
        'about tonight, it is that the account and the MFA exemption are both still live.',
      standIn:
        'Session stayed open on keepalives for seventy-one minutes and moved 2.1 MB total against ' +
        'a 340 MB average. Nothing left the estate. They kept the door open.',
      commandNudge:
        'Compare the total bytes moved on this session against what this account normally moves.',
      guidance:
        'Say what did NOT happen as clearly as what did. Then ask what is still true right now.',
    },
  ],
};
