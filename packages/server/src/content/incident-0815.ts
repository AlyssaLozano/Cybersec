/**
 * INC-2026-0815: the decision points for the Ridgeline intrusion.
 *
 * THE SAME INCIDENT, A THIRD TIME
 *
 * Log Analysis taught students to find this intrusion by reading auth.log line by
 * line. Alert Triage showed it to them again as eight alerts inside eighty-two.
 * This is the third pass and the first one where they have to *act*: the
 * attacker is still connected, the archive of patient exports is still sitting
 * in /tmp/.cache, and somebody has to decide what happens next.
 *
 * Reusing one incident across three packages is deliberate. A student meeting a
 * fresh scenario each time learns three shallow things; a student meeting the
 * same one from the analyst's chair, then the operator's, then the responder's
 * learns what those roles actually are.
 *
 * WHY THESE OPTIONS
 *
 * Every option below is something somebody has genuinely done in a real
 * incident, including the harmful ones: especially the harmful ones. "Pull the
 * power to be safe" and "reset the password and close it" are the two most
 * common real-world responses to a compromise like this, and both are here
 * because a student who has never been tempted by them will not recognise the
 * temptation at 02:00.
 *
 * Several options are marked `defensible` rather than `sound`. Those are the
 * ones that cost something and that a competent responder might still choose.
 * Incident response is mostly picking between imperfect options under a clock,
 * and grading it as right-or-wrong would teach a fiction.
 *
 * CONSEQUENCES ARE THE ANSWER KEY.
 * They are stripped by toStudentDecisionPoint() and released only after commit.
 */

import type { DecisionPoint, IncidentSnapshot } from '@soc/shared';

const INCIDENT = 'INC-2026-0815';

/** The estate, as far as anybody has established it. */
const SYSTEMS: IncidentSnapshot['systems'] = [
  { host: 'rmg-web-02', role: 'Internet-facing patient portal', state: 'Compromised, still serving traffic' },
  { host: 'rmg-db-01', role: 'Patient records database', state: 'No findings yet; reachable from web-02' },
  { host: 'rmg-backup-01', role: 'Nightly backup target', state: 'No findings yet; holds portal snapshots' },
  { host: 'rmg-mon-01', role: 'Monitoring collector', state: 'Noisy, unrelated misconfiguration' },
];

/**
 * The state at 11:42, half an hour after the archive was staged.
 *
 * The `unknown` list is the important half. Every containment decision in this
 * package is made without knowing whether the attacker reached the database,
 * and a student who does not notice that is making the decision anyway.
 */
const AT_1142: IncidentSnapshot = {
  incidentId: INCIDENT,
  asOf: '11:42: thirty-six minutes after an archive of patient exports was staged in /tmp/.cache',
  systems: SYSTEMS,
  known: [
    'A password for the stale account testuser was accepted at 10:14 from 203.0.113.55, after 62 failures from the same source that morning.',
    'That session created a local account sysmon (UID 1501) at 10:22 and added it to the sudo group at 10:31.',
    'A crontab for sysmon was installed at 10:40 that fetches a remote script every 15 minutes and pipes it into bash.',
    'sysmon logged in by public key from the same external address at 11:05. A key was added to /home/sysmon/.ssh/authorized_keys that no configuration management system issued.',
    'At 11:06 a 6.3 GB archive of /var/www/portal/exports was written to /tmp/.cache/pt.tar.gz. That directory holds generated patient record exports.',
  ],
  unknown: [
    'Whether the attacker reached rmg-db-01 or any other host.',
    'Whether the staged archive has actually left the network.',
    'Whether the 10:14 login was truly the first access, or only the first one detection noticed.',
    'How the testuser password was obtained: guessed, reused, or leaked elsewhere.',
  ],
  pressures: [
    'The portal is live and serving patients. Taking it down is a clinical service outage, not just an IT one.',
    'The exports directory holds regulated patient data. If it left the network, notification obligations start at discovery.',
    'It is 11:42 on a weekday. The people who can authorise an outage are reachable now and will not be at 22:00.',
  ],
};

/** After containment, during eradication. */
const AT_1330: IncidentSnapshot = {
  incidentId: INCIDENT,
  asOf: '13:30: the host is isolated, memory and disk are captured',
  systems: [
    { host: 'rmg-web-02', role: 'Internet-facing patient portal', state: 'Isolated; evidence captured; portal failed over to web-01' },
    ...SYSTEMS.slice(1),
  ],
  known: [
    'Memory was captured before the host was isolated, and a disk image was taken afterwards. Both are hashed.',
    'The attacker session was still active at the moment of isolation.',
    'Four persistence mechanisms are confirmed: the sysmon account, its sudo group membership, its crontab, and the SSH key in its authorized_keys.',
    'testuser had no sudo entry of its own; the escalation used sudo rights the account should never have had.',
  ],
  unknown: [
    'Whether any persistence mechanism has been missed.',
    'Whether the same credentials or key work anywhere else in the estate.',
    'Whether the archive was transferred before isolation.',
  ],
  pressures: [
    'The portal is running on rmg-web-01 with no redundancy. A second failure is a full outage.',
    'Leadership has asked for a restoration time and does not yet have one.',
  ],
};

export const DECISION_POINTS: DecisionPoint[] = [
  {
    id: 'dp.contain',
    title: 'The attacker is still connected',
    situation:
      'It is 11:42. sysmon is logged in from 203.0.113.55 right now and has been for thirty-seven ' +
      'minutes. A 6.3 GB archive of patient exports is sitting in /tmp/.cache and you cannot tell ' +
      'whether any of it has left. The portal is serving patients. You have to decide what happens ' +
      'in the next five minutes.',
    snapshot: AT_1142,
    options: [
      {
        id: 'power',
        label: 'Pull the power on rmg-web-02 immediately',
        detail: 'Hard shutdown. Stops everything the attacker is doing, instantly.',
        quality: 'harmful',
        consequence:
          'The intrusion stops and so does your investigation. Everything in memory (the attacker’s ' +
          'active session, the decrypted key material, any process that never touched disk) is gone ' +
          'permanently, and memory was the only place some of it existed. You have also taken the ' +
          'patient portal offline without warning anybody clinical. This is the most common panic ' +
          'response to a live intrusion and it destroys the evidence that would have told you whether ' +
          'the database was reached.',
      },
      {
        id: 'isolate',
        label: 'Capture memory, then isolate the host at the network layer',
        detail:
          'Acquire RAM first, then drop the host from the network while leaving it running. The ' +
          'portal fails over to rmg-web-01.',
        quality: 'sound',
        consequence:
          'The attacker loses access, the running system is preserved, and you keep the memory image ' +
          'that shows what the session was doing. Failing the portal over turns a clinical outage into ' +
          'a capacity reduction. This is the textbook answer and it is textbook because it preserves ' +
          'both the service and the evidence.',
      },
      {
        id: 'monitor',
        label: 'Leave it connected and watch, to learn what the attacker does next',
        detail: 'Full packet capture and process monitoring, no intervention, for a fixed window.',
        quality: 'defensible',
        consequence:
          'Genuinely defensible, and genuinely risky. You would learn where the attacker goes next, ' +
          'which is the fastest way to establish scope. You are also allowing continued access to ' +
          'regulated patient data that is already staged for transfer, and if it leaves during your ' +
          'observation window, that decision is yours and it will be examined. Defensible only with ' +
          'explicit authorisation from someone senior enough to own the consequence, which, at 11:42 ' +
          'on a weekday, you can actually get.',
      },
      {
        id: 'kill-session',
        label: 'Kill the sysmon SSH session and reset its password',
        detail: 'Terminate the connection and lock the account.',
        quality: 'harmful',
        consequence:
          'You have told the attacker they have been seen and taken away nothing they need. The SSH ' +
          'key in authorized_keys does not care about the password, and the crontab reconnects within ' +
          'fifteen minutes regardless. What you have actually done is prompt an attacker who now knows ' +
          'they are being watched to burn what they have, which frequently means encrypting or ' +
          'destroying data on the way out.',
      },
      {
        id: 'block-ip',
        label: 'Block 203.0.113.55 at the perimeter firewall',
        detail: 'Drop all traffic to and from the attacker address.',
        quality: 'defensible',
        consequence:
          'Fast, reversible, and incomplete. It cuts the interactive session without touching the ' +
          'host, which preserves evidence and the service. But the crontab beacons outbound to a ' +
          'different address (198.51.100.60), so persistence survives, and an attacker with a working ' +
          'backdoor can return from anywhere. A reasonable first move that is not a containment plan ' +
          'on its own.',
      },
    ],
  },

  {
    id: 'dp.volatility',
    title: 'Order of collection',
    situation:
      'You have authorisation to contain, and roughly twenty minutes before the change window ' +
      'closes. Put the evidence collection steps in the order you would perform them. Order is the ' +
      'whole answer here: each of these destroys or degrades something below it if done too early.',
    snapshot: AT_1142,
    ordered: true,
    options: [
      {
        id: 'ram',
        label: 'Capture volatile memory',
        detail: 'RAM, running processes, open network connections, loaded kernel modules.',
        quality: 'sound',
        consequence:
          'First, always. Memory is gone the moment power or state changes, and it is the only place ' +
          'an in-memory-only payload, a decrypted key, or the attacker’s live session state exists.',
      },
      {
        id: 'connections',
        label: 'Record live network connections and the processes behind them',
        detail: 'netstat/ss output joined to the process table, before anything is disconnected.',
        quality: 'sound',
        consequence:
          'Second. Still volatile, and it evaporates the instant you isolate the host, which is the ' +
          'very next thing you are about to do.',
      },
      {
        id: 'network-isolate',
        label: 'Isolate the host from the network',
        detail: 'Host stays running; the attacker loses access.',
        quality: 'sound',
        consequence:
          'Third. Once memory and live connections are captured, cutting access costs you nothing ' +
          'further and stops the intrusion progressing while you work.',
      },
      {
        id: 'disk',
        label: 'Take a disk image and hash it',
        detail: 'Bit-for-bit copy, hashed before and after, chain of custody recorded.',
        quality: 'sound',
        consequence:
          'Fourth. Disk is non-volatile: it will still be there in an hour, which is exactly why it ' +
          'waits. Hash before and after or the image proves nothing about what it was a copy of.',
      },
      {
        id: 'logs',
        label: 'Collect and preserve log files off the host',
        detail: 'auth.log, syslog, application logs, copied to write-once storage.',
        quality: 'sound',
        consequence:
          'Last of the collection steps. The logs are on the disk image you already took, so this is ' +
          'a convenience copy: valuable, because you will want to read them without mounting an ' +
          'image, but nothing is lost by doing it at the end.',
      },
    ],
  },

  {
    id: 'dp.eradicate',
    title: 'What has to be removed',
    situation:
      'The host is isolated and imaged. You are about to rebuild. Select everything that must be ' +
      'dealt with before this host goes back into service. Missing one is how an incident reopens ' +
      'a week later.',
    snapshot: AT_1330,
    options: [
      {
        id: 'sysmon-account',
        label: 'Remove the sysmon account',
        quality: 'sound',
        consequence: 'Necessary. The account is the attacker’s, created at 10:22 with UID 1501.',
      },
      {
        id: 'sudo-group',
        label: 'Remove sysmon from the sudo group',
        quality: 'sound',
        consequence:
          'Necessary, and worth doing explicitly rather than assuming account deletion covers it: ' +
          'group membership has outlived account deletion on plenty of real systems.',
      },
      {
        id: 'crontab',
        label: 'Remove the sysmon crontab',
        quality: 'sound',
        consequence:
          'Necessary. This is the beacon: curl every fifteen minutes, piped into bash. It survives a ' +
          'password reset and a reboot, and it is the single most likely thing to be missed because ' +
          'the alert about it was rated low.',
      },
      {
        id: 'ssh-key',
        label: 'Remove the SSH key from /home/sysmon/.ssh/authorized_keys',
        quality: 'sound',
        consequence:
          'Necessary. Key-based access does not care that you changed a password. Deleting the home ' +
          'directory covers it, but confirm rather than assume.',
      },
      {
        id: 'testuser',
        label: 'Disable the testuser account and revoke its sudo rights',
        quality: 'sound',
        consequence:
          'Necessary, and the one people forget because it is not the attacker’s account. It is a ' +
          'stale test account with a guessable password and sudo rights it should never have had: ' +
          'the original way in, and still open.',
      },
      {
        id: 'staged-archive',
        label: 'Delete /tmp/.cache/pt.tar.gz',
        quality: 'harmful',
        consequence:
          'Not yet. That archive is evidence of what was staged, and its size and timestamps are how ' +
          'you scope the data impact for the notification decision. Delete it after the investigation ' +
          'has finished with it, not during eradication. Preserved on the disk image is not the same ' +
          'as available.',
      },
      {
        id: 'reimage',
        label: 'Rebuild the host from a known-good image rather than cleaning it',
        quality: 'sound',
        consequence:
          'The right call whenever an attacker had root, which they did here. Cleaning assumes you ' +
          'found everything; rebuilding assumes you found nothing and is correct either way. The ' +
          'removals above still matter: they tell you what to check for on every other host.',
      },
      {
        id: 'block-only',
        label: 'Block the attacker addresses at the firewall and return the host to service',
        quality: 'harmful',
        consequence:
          'This is containment mistaken for eradication. The backdoor account, the sudo membership, ' +
          'the crontab and the key are all still on the host; an address block stops one route to ' +
          'them and no more. This is the decision behind most re-compromises.',
      },
    ],
  },

  {
    id: 'dp.notify',
    title: 'Whether this is a notifiable breach',
    situation:
      'You have established that a 6.3 GB archive of patient exports was created at 11:06 and that ' +
      'the host had an active external session at the time. You cannot yet prove the archive left ' +
      'the network. Legal is asking whether the notification clock has started.',
    snapshot: {
      ...AT_1330,
      asOf: '14:15: legal and the privacy officer are on the call',
      pressures: [
        'Regulated patient data. Notification timelines run from discovery, not from proof.',
        'Over-notifying has real cost: patient anxiety, regulatory attention, and reputational damage that is not undone by a later correction.',
        'Under-notifying, if the data did leave, is a separate and more serious problem than the breach itself.',
      ],
    },
    options: [
      {
        id: 'wait-proof',
        label: 'Wait until exfiltration is proven before telling anybody outside the team',
        quality: 'harmful',
        consequence:
          'Notification obligations generally run from the point at which you become aware of a ' +
          'potential compromise of protected data, not from the point at which you can prove ' +
          'transfer. Waiting for certainty is how organisations miss statutory deadlines, and the ' +
          'delay is usually what regulators penalise rather than the breach.',
      },
      {
        id: 'engage-legal',
        label: 'Notify legal and the privacy officer now, with the facts and the uncertainty stated plainly',
        quality: 'sound',
        consequence:
          'Correct. Your job is to give the people who own the notification decision an accurate ' +
          'picture, including what you cannot establish. They decide whether the clock has started; ' +
          'you make sure they decide it knowing that a staged archive existed and transfer could not ' +
          'be ruled out.',
      },
      {
        id: 'announce-breach',
        label: 'Declare a confirmed data breach and begin patient notification today',
        quality: 'defensible',
        consequence:
          'Defensible and probably premature. You do not yet know that anything left, and a ' +
          'confirmed-breach declaration is very hard to walk back: it reaches patients, regulators, ' +
          'and press on the strength of an inference. The distinction between "we are investigating a ' +
          'potential compromise" and "your records were taken" matters enormously to the person ' +
          'receiving the letter.',
      },
      {
        id: 'scope-first',
        label: 'Establish transfer volume from egress logs before advising legal',
        detail: 'Perhaps two hours of work against proxy and firewall records.',
        quality: 'defensible',
        consequence:
          'Worth doing, and not worth doing first. The evidence would sharpen the advice considerably: ' +
          'if 6.3 GB never crossed the perimeter, that changes everything. But two hours of silence ' +
          'while a notification clock may already be running is a risk you are taking on somebody ' +
          'else’s behalf. Tell them now, refine within the hour.',
      },
    ],
  },

  {
    id: 'dp.validate',
    title: 'Proving it is over',
    situation:
      'The host has been rebuilt, the accounts are gone, and the portal is back on rmg-web-02. ' +
      'Somebody asks whether the incident is closed. Choose what you would do before saying yes.',
    snapshot: {
      ...AT_1330,
      asOf: 'Day 3: rebuild complete, service restored',
      known: [
        'rmg-web-02 was rebuilt from a known-good image; the compromised disk is preserved.',
        'testuser and sysmon no longer exist on the rebuilt host.',
        'The attacker addresses are blocked at the perimeter.',
      ],
      unknown: [
        'Whether the same access exists on any other host in the estate.',
        'Whether the initial credential was reused elsewhere.',
        'Whether the beacon destination has been contacted since the rebuild.',
      ],
    },
    options: [
      {
        id: 'hunt-estate',
        label: 'Hunt the whole estate for the same indicators before declaring closure',
        detail: 'The attacker addresses, the account name, the key fingerprint, the cron pattern.',
        quality: 'sound',
        consequence:
          'Necessary. The first host you find is rarely the only one, and you have four strong ' +
          'indicators to sweep with. Closing an incident having looked at exactly one machine is how ' +
          'the second one is discovered by somebody else, later, worse.',
      },
      {
        id: 'monitor-beacon',
        label: 'Watch egress for contact with the beacon destination for a defined period',
        quality: 'sound',
        consequence:
          'Necessary. If anything still reaches 198.51.100.60, something you did not find is still ' +
          'running. This is the cheapest possible test of "did we get it all" and it runs itself.',
      },
      {
        id: 'credential-reset',
        label: 'Force a credential reset for accounts that could share the compromised password',
        quality: 'sound',
        consequence:
          'Necessary, because you never established how the testuser password was obtained. If it was ' +
          'reused or leaked, the same credential may open other doors, and the rebuild did nothing ' +
          'about that.',
      },
      {
        id: 'declare-closed',
        label: 'Declare closure now: the host is rebuilt and the accounts are gone',
        quality: 'harmful',
        consequence:
          'Premature. You have remediated one host and established nothing about the rest. "The ' +
          'machine we found is clean" is a much weaker claim than "the intrusion is over", and ' +
          'conflating them is how incidents get reopened by the same attacker using the same ' +
          'credential on a different box.',
      },
      {
        id: 'skip-postmortem',
        label: 'Close without a post-mortem: the team is exhausted and the fix is obvious',
        quality: 'harmful',
        consequence:
          'The stale account with sudo rights and a guessable password was not created by this ' +
          'attacker; it was created by your own organisation and left in place for 619 days. Without ' +
          'a post-mortem that finding never becomes a control, and the next intrusion uses the next ' +
          'stale account. Response only matters if it prevents recurrence.',
      },
    ],
  },
];

const BY_ID = new Map(DECISION_POINTS.map((point) => [point.id, point]));

export function getDecisionPoint(id: string): DecisionPoint | null {
  return BY_ID.get(id) ?? null;
}

/** Option ids at a decision point whose quality matches. Used to derive answers. */
export function optionsOfQuality(pointId: string, quality: 'sound' | 'defensible' | 'harmful'): string[] {
  return (BY_ID.get(pointId)?.options ?? [])
    .filter((option) => option.quality === quality)
    .map((option) => option.id);
}

/** The intended order for a sequenced decision point, as authored. */
export function intendedOrder(pointId: string): string[] {
  return (BY_ID.get(pointId)?.options ?? []).map((option) => option.id);
}
