/**
 * Scenario 09: Key Ring.
 *
 * A long-lived cloud access key committed to a public repository, and what an
 * hour of somebody else holding it looks like.
 *
 * WHAT THIS TEACHES
 *
 * That in cloud the intrusion has no host. There is no endpoint to isolate, no
 * process to kill, no binary to hash. Every action is an authenticated API call
 * from an address the estate has never seen, and containment is one API call of
 * your own. This scenario exists so that a floor trained on hosts learns that
 * the reflexes do not transfer.
 *
 * THE TIMING LESSON
 *
 * The key was committed at 09:02 and first used by somebody else at 09:19.
 * Seventeen minutes. Automated scanners watch public repository feeds
 * continuously, so a leaked credential is not a risk that develops over days,
 * it is one that is exercised before the person who leaked it has finished their
 * coffee. A floor that spends twenty minutes deciding whether this is worth
 * acting on has already lost the argument.
 *
 * THE SCORED TRAP
 *
 * Revoking the key is correct and it is also the easy half. The attacker created
 * a second identity nine minutes in, and that identity survives the revocation
 * of the key that made it. A floor that revokes, confirms the calls stopped, and
 * closes has left a working credential behind. That is graded on ev.5.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';

const ID = 'key-ring';

export const KEY_RING: Scenario = {
  id: ID,
  title: 'Key Ring',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 10:05. The cloud provider sent an automated notice twenty minutes ago that one of our ' +
    'access keys appears in a public code repository. Nothing has alerted internally. Work out ' +
    'what has been done with it.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
    'threat-intel',
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
      summary: 'Provider notice: access key AKIA-RMG-DATAPIPE found in a public repository',
      detail:
        'The cloud provider automated credential exposure service reported at 09:44 that a key ' +
        'belonging to the data-pipeline user is present in a public repository. The commit is ' +
        'timestamped 09:02 and was pushed by an engineer adding a local test configuration. The ' +
        'key is 14 months old, has no expiry, and has never been rotated. Rule history: this ' +
        'notice type has been received once before, in 2024.',
      source: 'cloud provider',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 120,
      surface: 'cloud-audit',
      summary: 'The key made its first call from an unrecognised address at 09:19',
      detail:
        'GetCallerIdentity was called with this key at 09:19:08 from 203.0.113.91, an address with ' +
        'no history in the account. The key has fourteen months of use and every prior call came ' +
        'from the two build agent addresses. The 09:19 call succeeded and was followed by ' +
        'ListBuckets at 09:19:14.',
      source: '203.0.113.91',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 280,
      surface: 'cloud-audit',
      summary: 'Bucket enumeration and 2,900 object listings across eleven buckets',
      detail:
        'Between 09:19 and 09:41 the key listed eleven buckets and enumerated objects across all ' +
        'of them, including the clinical export bucket and two holding database backups. Every ' +
        'call succeeded. The data-pipeline user holds read access to all eleven through a policy ' +
        'attached in 2024 that grants read on every bucket rather than the three the pipeline ' +
        'uses.',
      source: '203.0.113.91',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 440,
      surface: 'network-flow',
      summary: '4.2 GB egressed from the clinical export bucket between 09:26 and 09:58',
      detail:
        'Provider flow logging shows 4.2 GB transferred out of the clinical export bucket to ' +
        '203.0.113.91 over thirty-two minutes. The bucket has no egress restriction and is not ' +
        'behind a private endpoint. Baseline egress for this bucket is under 200 MB a day, ' +
        'entirely to internal build agents.',
      source: 'clinical-export bucket',
      target: '203.0.113.91',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 600,
      surface: 'cloud-audit',
      summary: 'A new IAM user created at 09:28 with its own access key',
      detail:
        'CreateUser was called at 09:28:31 creating a principal named data-pipeline-svc, followed ' +
        'by AttachUserPolicy granting an existing broad read policy and CreateAccessKey. The ' +
        'data-pipeline user holds IAM write permissions through the same 2024 policy. The new ' +
        'user has made no calls yet.',
      source: '203.0.113.91',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.6',
      atSeconds: 760,
      surface: 'alert-queue',
      summary: 'Fourteen other long-lived keys in the account have never been rotated',
      detail:
        'An inventory of the account shows 21 access keys, of which 14 have no expiry and were ' +
        'created more than a year ago. Four belong to principals with IAM write permissions. Six ' +
        'have not been used in over ninety days and are still active. There is no automated ' +
        'rotation and no policy requiring one.',
      source: 'account inventory',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Cost anomaly detection flagged a 22 percent spend increase in the analytics account',
      detail:
        'Automated cost monitoring raised a spend anomaly against a separate analytics account, ' +
        'not the one holding the exposed key. The increase traces to a scheduled reporting job ' +
        'whose data volume grew after a new data source was onboarded last week, with a change ' +
        'record and an owner. Rule history: fired 45 times in thirty days, 44 closed as expected ' +
        'growth.',
      source: 'cost monitoring',
      claimedSeverity: 'low',
    },
  ],
};

export const KEY_RING_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'An engineer committed a local test configuration containing a live access key to a public repository at 09:02.',
    'Automated scanners watch those feeds continuously. Somebody else was using the key by 09:19, seventeen minutes later.',
    'They confirmed what it was, listed every bucket it could reach, and found eleven rather than the three the pipeline uses, because a 2024 policy granted read on everything.',
    'They pulled 4.2 GB out of the clinical export bucket between 09:26 and 09:58.',
    'At 09:28 they used the same key to create a second IAM user with its own key, because the policy also granted IAM write.',
    'That second identity survives revoking the first one, and it has not been used yet.',
    'The key was fourteen months old with no expiry, and it is one of fourteen like it in the account.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1552.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['cloud-security'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.declare', 'act.reset-password'],
      escalateTo: ['cloud-security', 'ir-lead'],
      why:
        'The only ambiguity here is how fast, not whether. A live key with no expiry in a public ' +
        'repository is exercised in minutes, not days, because the scanners watching those feeds ' +
        'are automated and continuous. So the correct instinct is not to investigate whether it has ' +
        'been used, it is to assume it has and to get somebody who can revoke it looking ' +
        'immediately. The commit being an honest mistake by an engineer adding test configuration ' +
        'is worth noting once and then setting aside: how it got there changes the fix, and changes ' +
        'nothing about the next forty minutes.',
      standIn:
        'Provider says one of our access keys is in a public repository, committed at 09:02. Key is ' +
        'fourteen months old with no expiry and has never been rotated. Straight to cloud security ' +
        'and the lead. Assume it has been used.',
      commandOptions: [
        'aws iam list-access-keys --user-name data-pipeline',
        'aws iam get-access-key-last-used --access-key-id AKIA-RMG-DATAPIPE',
        'git log --oneline -5',
        'aws sts get-caller-identity',
        'cat ~/.aws/credentials',
      ],
      commandNudge: 'Find out when that key was last used and from where.',
      guidance:
        'A public key is used in minutes, not days. Assume it has been and go looking for the ' +
        'calls.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1078.004'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.preserve', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'Seventeen minutes from commit to use, and the proof is one field: fourteen months of calls ' +
        'from exactly two build agent addresses, then one from an address the account has never ' +
        'seen. Source address history is the cheapest and strongest signal in a cloud account, ' +
        'because service credentials come from a small fixed set of places and people do not. ' +
        'GetCallerIdentity followed by ListBuckets is also worth reading as intent: that sequence ' +
        'is somebody working out what they have just been handed, which is what a stranger does ' +
        'and never what your own pipeline does.',
      standIn:
        'First call from 203.0.113.91 at 09:19, seventeen minutes after the commit. Fourteen months ' +
        'of history on this key and every prior call came from our two build agents. It ran ' +
        'GetCallerIdentity then ListBuckets, which is somebody finding out what they have. Revoking ' +
        'now.',
      commandNudge:
        'Compare the addresses this key has called from today against its whole history.',
      guidance:
        'A service credential calls from a short, fixed list of places. Ask what that list normally ' +
        'looks like.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'reconnaissance',
      techniques: ['T1580', 'T1619'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'vulnerability-analyst'],
      correctActions: ['act.iam-audit'],
      outOfLaneActions: ['act.preserve', 'act.decode', 'act.isolate', 'act.dismiss'],
      escalateTo: ['ir-lead', 'vulnerability-analyst'],
      why:
        'Every one of these calls succeeded, so there is no denial anywhere to alert on. The finding ' +
        'is the gap between what the pipeline uses and what the key could reach: three buckets ' +
        'versus eleven, including clinical exports and database backups, because a 2024 policy ' +
        'granted read on every bucket rather than the three needed. That policy is the actual ' +
        'vulnerability and it predates the leak by a year. The leaked key decided WHEN this ' +
        'happened; the policy decided HOW BAD it was, and only one of those is fixable in a way ' +
        'that helps next time.',
      standIn:
        'The key listed eleven buckets and enumerated objects in all of them, including clinical ' +
        'exports and two backup buckets. Every call succeeded. The pipeline uses three. It has ' +
        'read on all eleven because of a 2024 policy that grants read on everything.',
      commandNudge:
        'Compare the buckets this key CAN reach against the ones it has ever actually used.',
      guidance:
        'Nothing was denied. Ask what this identity was entitled to reach, and what it actually ' +
        'needs.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1530'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.flow-map'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        '4.2 GB out of a bucket whose baseline is under 200 MB a day, all to a single external ' +
        'address, over thirty-two minutes. Unlike the DNS scenario this one is measurable exactly, ' +
        'because the provider logs the bytes. That means the floor can tell the business what left ' +
        'rather than estimating it, and clinical export is a bucket whose name alone determines ' +
        'whether this is a notifiable breach. The absence of an egress restriction or a private ' +
        'endpoint is the other half of the report: the data was reachable from the internet by ' +
        'anybody holding a valid credential, which is a design decision rather than a failure, and ' +
        'it is the one worth revisiting.',
      standIn:
        '4.2 GB out of the clinical export bucket to that address between 09:26 and 09:58. Baseline ' +
        'for that bucket is under 200 MB a day and all of it internal. No egress restriction and no ' +
        'private endpoint on it.',
      commandOptions: [
        'aws s3api get-bucket-logging --bucket clinical-export',
        "awk '$4==\"203.0.113.91\" {sum+=$8} END {print sum}' /var/log/cloud/flow.log",
        'aws s3 ls s3://clinical-export --summarize',
        'aws s3api get-bucket-policy --bucket clinical-export',
        'netstat -an',
      ],
      commandNudge:
        'Total the bytes out of that bucket today and compare against its normal daily figure.',
      guidance:
        'The provider logs the actual bytes. Give the business a number, not an adjective.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1136.003', 'T1098.001'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reimage-now', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'The event that decides whether this incident is actually over, and it arrives claiming ' +
        'MEDIUM with no calls against it, which makes it look like nothing happened. Nine minutes ' +
        'in, the attacker used the leaked key to create a second identity with its own key, because ' +
        'the same 2024 policy granted IAM write alongside the bucket reads. That new principal is ' +
        'independent: revoking the leaked key does not touch it, the calls stop, the dashboards go ' +
        'quiet, and the floor concludes it is contained. It is not. A name like data-pipeline-svc ' +
        'sitting in an IAM user list is invisible to anybody who is not comparing against ' +
        'yesterday. Containment here means enumerating what the credential CREATED, not just ' +
        'killing the credential.',
      standIn:
        'CreateUser at 09:28 for a principal called data-pipeline-svc, then a broad read policy ' +
        'attached and its own access key created. It has made no calls yet. Revoking the leaked key ' +
        'does nothing to this one. Killing it too.',
      commandNudge:
        'Look at what the key CREATED, not only what it read. Then check whether that thing still ' +
        'works.',
      guidance:
        'Ask whether revoking the key you know about ends this. Check what else that identity was ' +
        'allowed to do.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'reconnaissance',
      techniques: ['T1552.001'],
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.preserve', 'act.decode', 'act.isolate', 'act.revoke-key'],
      escalateTo: ['ir-lead'],
      why:
        'Not part of tonight and the most valuable thing on the board for next quarter. Fourteen ' +
        'keys with no expiry, four of them on principals with IAM write, six unused for ninety days ' +
        'and still live. Today was one leak; those numbers say how many more of today are available. ' +
        'This is scope rather than evidence, which is why it is this seat and not forensics, and ' +
        'the six unused keys are the easiest security win in the estate because deleting them costs ' +
        'nothing and cannot break anything that is not already broken.',
      standIn:
        'Twenty-one keys in the account, fourteen with no expiry and over a year old, four of those ' +
        'on principals with IAM write. Six have not been used in ninety days and are still active. ' +
        'No rotation policy exists. Today was one of fourteen chances.',
      commandNudge:
        'Inventory every key in the account and check the age, the expiry and the last use.',
      guidance:
        'Ask how many other credentials are in the same shape as the one that leaked.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.iam-audit', 'act.isolate', 'act.declare'],
      escalateTo: [],
      why:
        'A spend anomaly on the same provider on the same morning, which is exactly the shape of ' +
        'evidence a floor mid-incident wants to be related. It is in a different account, it traces ' +
        'to a scheduled reporting job whose volume grew after a documented onboarding, and it has a ' +
        'change record and a named owner. Two checks settle it: which account, and is there a change ' +
        'record. Both take under a minute. Getting this wrong widens the incident to a second ' +
        'account and puts an unrelated team into an investigation, at the exact moment the real ' +
        'work is enumerating what the leaked key created.',
      standIn:
        'Cost anomaly is in the analytics account, not the one with the exposed key, and it traces ' +
        'to a reporting job that grew after a documented onboarding last week. Change record and ' +
        'owner both present. Forty-four of forty-five this month were the same. Closing it.',
      commandOptions: [
        'aws ce get-anomalies --date-interval Start=2026-09-01,End=2026-09-01',
        'grep onboard /var/log/change-management.log',
        'aws organizations list-accounts',
        'aws ce get-cost-and-usage --time-period Start=2026-08-25,End=2026-09-01',
        'aws sts get-caller-identity',
      ],
      commandNudge: 'Check which account that anomaly is actually in.',
      guidance:
        'Same provider is not the same account. Check where it happened and whether somebody has ' +
        'already explained it.',
    },
  ],
};
