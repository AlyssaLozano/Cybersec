/**
 * Generates the alert queues for Package 3 (Incident Detection and Alert Triage).
 *
 * Run with:  npm run gen:alerts --workspace @soc/server
 * Output:    src/vfs/data/alerts.generated.ts  (committed to git)
 *
 * WHY THIS IS GENERATED AND COMMITTED
 *
 * Same reason as the log files. Exercise answers are computed from this corpus
 * ("escalate the alerts belonging to the intrusion"), so if it were built fresh
 * at runtime the right answer would drift on every deploy. One fixed seed, the
 * output committed, and any change shows up as a reviewable diff.
 *
 * WHY IT DESCRIBES THE SAME DAY AS auth.log
 *
 * These alerts are what the monitoring stack raised while the events in
 * `generate-world.ts` were happening on 15 August. A student reaching Package 3
 * has already spent Package 2 reading that intrusion out of raw logs by hand.
 * Meeting it again from the other end -- as eight alerts buried in a hundred and
 * twenty -- teaches the thing that actually transfers: the detection stack saw
 * most of it, and the reason nobody noticed is that it also saw everything else.
 *
 * THE COMPOSITION IS THE LESSON
 *
 * Roughly:
 *   - 7% are the intrusion
 *   - 20% are one misconfigured monitoring host firing every five minutes
 *   - 55% are correct detections of ordinary activity (benign true positives)
 *   - 18% are rules that are simply wrong
 *
 * The largest single category is *correct alerts about boring things*. That is
 * the category most training material omits, and it is the one that decides
 * whether somebody survives the job: a student taught that alerts are either
 * "attack" or "broken rule" will escalate every administrator running sudo.
 *
 * All external addresses come from RFC 5737 documentation ranges, which cannot
 * route to a real host.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type {
  Alert,
  AlertEnrichment,
  AlertSeverity,
  AlertSource,
  AlertTruth,
  AlertVerdict,
  TriageDecision,
} from '@soc/shared';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = join(HERE, '..', 'src', 'vfs', 'data', 'alerts.generated.ts');

/** The day the simulated world runs on, matching generate-world.ts. */
const DAY = '2026-08-15';

// --- deterministic randomness ------------------------------------------------

/** mulberry32, same as the world generator: stable across Node versions. */
function makeRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = makeRandom(20260903);

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(rand() * items.length)]!;
}

function between(min: number, max: number): number {
  return min + Math.floor(rand() * (max - min + 1));
}

// --- the cast, shared with generate-world.ts ---------------------------------

const ATTACKER_IP = '203.0.113.55';
const COMPROMISED_USER = 'testuser';
const BACKDOOR_USER = 'sysmon';
const EXFIL_IP = '198.51.100.60';
const MONITORING_IP = '10.20.9.40';
const BACKUP_IP = '10.20.9.15';
const WEB_HOST = 'rmg-web-02';

/** The other addresses in the brute-force wave. */
const BRUTE_IPS = ['203.0.113.12', '198.51.100.77', '203.0.113.88'] as const;

/** Opportunistic internet scanners. */
const NOISE_IPS = [
  '192.0.2.44',
  '192.0.2.171',
  '192.0.2.9',
  '198.51.100.23',
  '198.51.100.202',
  '203.0.113.140',
  '203.0.113.201',
] as const;

const STAFF = [
  { user: 'jmartel', ip: '10.20.4.31' },
  { user: 'dokafor', ip: '10.20.4.58' },
  { user: 'rchen', ip: '10.20.4.12' },
] as const;

/** The incident every escalate-worthy alert belongs to. */
const INCIDENT = 'INC-2026-0815';

// --- construction ------------------------------------------------------------

interface Draft {
  time: string;
  source: AlertSource;
  ruleId: string;
  ruleName: string;
  severity: AlertSeverity;
  confidence: number;
  from: Alert['from'];
  to?: Alert['to'];
  summary: string;
  detail: string;
  enrichment: AlertEnrichment;
  verdict: AlertVerdict;
  decision: TriageDecision;
  why: string;
  incident?: boolean;
}

let nextId = 5000;

interface Built {
  alert: Alert;
  truth: AlertTruth;
}

function build(draft: Draft): Built {
  nextId += 1;
  const id = `A-${nextId}`;
  return {
    alert: {
      id,
      raisedAt: `${DAY}T${draft.time}Z`,
      source: draft.source,
      ruleId: draft.ruleId,
      ruleName: draft.ruleName,
      severity: draft.severity,
      confidence: draft.confidence,
      from: draft.from,
      ...(draft.to ? { to: draft.to } : {}),
      summary: draft.summary,
      detail: draft.detail,
      enrichment: draft.enrichment,
    },
    truth: {
      alertId: id,
      verdict: draft.verdict,
      correctDecision: draft.decision,
      ...(draft.incident ? { incidentId: INCIDENT } : {}),
      why: draft.why,
    },
  };
}

function hms(hour: number, minute: number, second: number): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hour)}:${pad(minute)}:${pad(second)}`;
}

// --- alert factories ---------------------------------------------------------

/**
 * The monitoring host with the stale password.
 *
 * Fires every five minutes, all day, at medium severity. It is a correct
 * detection of a real authentication failure, which is why "false positive" is
 * the wrong answer and dismissing them one at a time forever is the wrong
 * behaviour. The rule needs tuning; the host needs its password fixed.
 */
function monitoringNoise(hour: number, minute: number): Built {
  return build({
    time: hms(hour, minute, between(0, 30)),
    source: 'auth-monitor',
    ruleId: 'auth-failed-password',
    ruleName: 'Failed SSH authentication',
    severity: 'medium',
    confidence: 90,
    from: { ip: MONITORING_IP, host: 'rmg-mon-01', user: 'nagios' },
    to: { ip: '10.20.6.40', host: WEB_HOST, port: 22 },
    summary: `Failed SSH password for nagios from ${MONITORING_IP}`,
    detail:
      `sshd recorded an authentication failure for account "nagios" from ${MONITORING_IP} ` +
      `(rmg-mon-01, the monitoring collector). The account exists and is not locked. ` +
      `The same source has failed at a near-exact five-minute cadence since 00:00.`,
    enrichment: {
      priorFirings: 8_412,
      priorFalsePositives: 8_398,
      reputation: 'known-good',
      reputationNote: 'Internal monitoring collector, inventory asset RMG-MON-01.',
      allowlisted: true,
    },
    verdict: 'benign_true_positive',
    decision: 'tune',
    why:
      'The detection is correct — the authentication really did fail — but the cause is a stale ' +
      'credential in a monitoring config, not an attacker. Dismissing these individually is a ' +
      'losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs ' +
      'raising to fix the password. This single misconfiguration produces more failed logins than ' +
      'the actual intrusion does.',
  });
}

/** Internet background radiation: scanners probing a public host. */
function scannerNoise(hour: number): Built {
  const ip = pick(NOISE_IPS);
  const port = pick([23, 445, 3389, 8080, 5900]);
  return build({
    time: hms(hour, between(0, 59), between(0, 59)),
    source: 'ids',
    ruleId: 'fw-inbound-block',
    ruleName: 'Blocked inbound connection to closed port',
    severity: 'low',
    confidence: 99,
    from: { ip },
    to: { ip: '10.20.6.40', host: WEB_HOST, port },
    summary: `Firewall blocked inbound ${ip} to port ${port}`,
    detail:
      `The host firewall dropped an inbound TCP connection from ${ip} to port ${port}, which is ` +
      `closed. No service listens on that port and no packet reached userspace.`,
    enrichment: {
      priorFirings: between(19_000, 24_000),
      priorFalsePositives: between(18_900, 23_900),
      reputation: 'unknown',
      reputationNote: 'No prior sightings. Consistent with commodity internet scanning.',
    },
    verdict: 'benign_true_positive',
    decision: 'dismiss',
    why:
      'The control worked. A blocked connection to a closed port is the firewall doing its job, ' +
      'and every internet-facing host receives thousands of these a day. There is nothing to ' +
      'investigate and nothing to tune — the alert is low severity precisely so it can be ' +
      'skimmed past.',
  });
}

/** Commodity web scanning against paths this host does not serve. */
function webScanNoise(hour: number): Built {
  const path = pick(['/wp-login.php', '/phpmyadmin/', '/.env', '/admin/config.php', '/vendor/phpunit']);
  const ip = pick(NOISE_IPS);
  return build({
    time: hms(hour, between(0, 59), between(0, 59)),
    source: 'ids',
    ruleId: 'web-known-scan-path',
    ruleName: 'Request for known-vulnerable application path',
    severity: 'medium',
    confidence: 70,
    from: { ip },
    to: { ip: '10.20.6.40', host: WEB_HOST, port: 443 },
    summary: `404 for ${path} from ${ip}`,
    detail:
      `nginx returned 404 for GET ${path}. This host runs the patient portal on a Node upstream ` +
      `and does not run WordPress, phpMyAdmin, or PHP of any kind.`,
    enrichment: {
      priorFirings: between(4_000, 6_000),
      priorFalsePositives: between(3_990, 5_990),
      reputation: 'unknown',
    },
    verdict: 'benign_true_positive',
    decision: 'dismiss',
    why:
      'A scanner asked for software that is not installed and got a 404. The severity is ' +
      'inflated: the rule scores on the path requested rather than on whether the target could ' +
      'possibly be vulnerable, which is why it reads "medium" for an event with no impact.',
  });
}

// --- the intrusion -----------------------------------------------------------

/**
 * The eight alerts that matter.
 *
 * Written out individually rather than generated, because each one is a specific
 * moment in the attack and the exercise debriefs refer to them by what they are.
 */
function intrusionAlerts(): Built[] {
  return [
    build({
      time: '09:14:11',
      source: 'siem-rule',
      ruleId: 'auth-brute-force-threshold',
      ruleName: 'Repeated authentication failures from single source',
      severity: 'high',
      confidence: 75,
      from: { ip: ATTACKER_IP },
      to: { ip: '10.20.6.40', host: WEB_HOST, port: 22 },
      summary: `Sustained SSH brute force from ${ATTACKER_IP} against multiple accounts`,
      detail:
        `47 authentication failures from ${ATTACKER_IP} in 120 seconds, spread across accounts ` +
        `root, admin, oracle, ubuntu, postgres, test, ${COMPROMISED_USER}, git and deploy. ` +
        `Three further sources (${BRUTE_IPS.join(', ')}) are attempting the same account list ` +
        `in the same window, which indicates a shared wordlist rather than four independent scans.`,
      enrichment: {
        priorFirings: 61,
        priorFalsePositives: 44,
        reputation: 'unknown',
        reputationNote: 'No prior sightings of this address against Ridgeline infrastructure.',
      },
      verdict: 'true_positive',
      decision: 'escalate',
      incident: true,
      why:
        'Targeted, sustained, and coordinated across four sources working one account list. The ' +
        'rule has a poor track record (44 of 61 prior firings were noise) which is exactly why ' +
        'this one is easy to miss — but the shared wordlist across multiple sources is the detail ' +
        'that separates it from ordinary scanning.',
    }),
    build({
      time: '10:14:22',
      source: 'auth-monitor',
      ruleId: 'auth-success-after-failures',
      ruleName: 'Successful login from source with prior failures',
      severity: 'medium',
      confidence: 60,
      from: { ip: ATTACKER_IP },
      to: { ip: '10.20.6.40', host: WEB_HOST, port: 22, user: COMPROMISED_USER },
      summary: `Accepted password for ${COMPROMISED_USER} from ${ATTACKER_IP} after 62 prior failures`,
      detail:
        `SSH accepted a password for "${COMPROMISED_USER}" from ${ATTACKER_IP}. The same source ` +
        `failed 62 times against this host between 09:12 and 09:47. ${COMPROMISED_USER} is a ` +
        `local account with UID 1004, last password change 619 days ago, no sudo entry of its own.`,
      enrichment: {
        priorFirings: 9,
        priorFalsePositives: 4,
        reputation: 'unknown',
      },
      verdict: 'true_positive',
      decision: 'escalate',
      incident: true,
      why:
        'This is the single most important alert in the queue and it is rated medium with 60% ' +
        'confidence. A brute force that succeeds stops being an attempt and becomes an intrusion. ' +
        'Everything after this point is the attacker operating with valid credentials, which is ' +
        'why the alerts that follow look like ordinary administration.',
    }),
    build({
      time: '10:22:42',
      source: 'edr',
      ruleId: 'account-created',
      ruleName: 'Local account created',
      severity: 'medium',
      confidence: 95,
      from: { ip: '10.20.6.40', host: WEB_HOST, user: COMPROMISED_USER },
      summary: `New local account "${BACKDOOR_USER}" (UID 1501) created by ${COMPROMISED_USER}`,
      detail:
        `useradd created account "${BACKDOOR_USER}" with UID 1501, home /home/${BACKDOOR_USER}, ` +
        `shell /bin/bash. Invoked via sudo by ${COMPROMISED_USER} from pts/1. The account name ` +
        `resembles a system service; the UID is in the ordinary user range.`,
      enrichment: {
        priorFirings: 14,
        priorFalsePositives: 11,
        reputation: 'known-good',
        reputationNote: 'Source is an internal host on the server VLAN.',
      },
      verdict: 'true_positive',
      decision: 'escalate',
      incident: true,
      why:
        'Account creation on a web server is rare and this one is doubly wrong: the account is ' +
        'named to look like a monitoring service but carries a normal user UID, and it was created ' +
        'by a stale test account that has no business running useradd. Persistence, eight minutes ' +
        'after the compromise.',
    }),
    build({
      time: '10:31:06',
      source: 'edr',
      ruleId: 'privilege-group-change',
      ruleName: 'Account added to privileged group',
      severity: 'high',
      confidence: 95,
      from: { ip: '10.20.6.40', host: WEB_HOST, user: COMPROMISED_USER },
      summary: `${BACKDOOR_USER} added to group "sudo"`,
      detail:
        `usermod -aG sudo ${BACKDOOR_USER}, invoked via sudo by ${COMPROMISED_USER}. The account ` +
        `being granted privilege was created nine minutes earlier by the same session.`,
      enrichment: {
        priorFirings: 22,
        priorFalsePositives: 16,
        reputation: 'known-good',
      },
      verdict: 'true_positive',
      decision: 'escalate',
      incident: true,
      why:
        'Privilege escalation, and the corroborating detail is the nine-minute gap: an account ' +
        'created and then granted root-equivalent access inside ten minutes is not a provisioning ' +
        'workflow. Legitimate account creation goes through a ticket and rarely reaches the sudo ' +
        'group at all.',
    }),
    build({
      time: '10:40:51',
      source: 'edr',
      ruleId: 'cron-modified',
      ruleName: 'Scheduled task created or modified',
      severity: 'low',
      confidence: 80,
      from: { ip: '10.20.6.40', host: WEB_HOST, user: BACKDOOR_USER },
      summary: `crontab replaced for user ${BACKDOOR_USER}`,
      detail:
        `crontab REPLACE for ${BACKDOOR_USER}. The new entry runs every 15 minutes and invokes ` +
        `curl against an external address, piping the response into bash.`,
      enrichment: {
        priorFirings: 340,
        priorFalsePositives: 331,
        reputation: 'known-good',
      },
      verdict: 'true_positive',
      decision: 'escalate',
      incident: true,
      why:
        'Rated LOW, because cron changes are usually configuration management. This one downloads ' +
        'a remote script and executes it every fifteen minutes, under an account created twenty ' +
        'minutes ago. Severity is what the rule guessed; this is the persistence mechanism that ' +
        'survives a reboot and a password reset.',
    }),
    build({
      time: '10:45:03',
      source: 'proxy',
      ruleId: 'egress-uncategorised-destination',
      ruleName: 'Outbound connection to uncategorised destination',
      severity: 'medium',
      confidence: 55,
      from: { ip: '10.20.6.40', host: WEB_HOST, user: BACKDOOR_USER },
      to: { ip: EXFIL_IP, port: 443 },
      summary: `Repeating outbound HTTPS from ${WEB_HOST} to ${EXFIL_IP}`,
      detail:
        `Outbound TLS to ${EXFIL_IP}:443 initiated by a curl process under ${BACKDOOR_USER}. ` +
        `Connections recur at 10:45:00, 11:00:00 and 11:15:00 — a fixed 15-minute interval with ` +
        `sub-second jitter. Destination is not on the egress allowlist and has no category.`,
      enrichment: {
        priorFirings: 190,
        priorFalsePositives: 171,
        reputation: 'unknown',
        reputationNote: 'No category. First contact from Ridgeline infrastructure was 10:45 today.',
        allowlisted: false,
      },
      verdict: 'true_positive',
      decision: 'escalate',
      incident: true,
      why:
        'Command and control. The tell is not the destination — it is the regularity: exactly 15 ' +
        'minutes apart with almost no jitter is a machine on a timer, not a person browsing. A web ' +
        'server making scheduled outbound calls to an uncategorised address is beaconing.',
    }),
    build({
      time: '11:05:14',
      source: 'auth-monitor',
      ruleId: 'auth-new-account-first-login',
      ruleName: 'First remote login by recently created account',
      severity: 'high',
      confidence: 85,
      from: { ip: ATTACKER_IP },
      to: { ip: '10.20.6.40', host: WEB_HOST, port: 22, user: BACKDOOR_USER },
      summary: `${BACKDOOR_USER} logged in by public key from ${ATTACKER_IP}`,
      detail:
        `Accepted publickey for ${BACKDOOR_USER} from ${ATTACKER_IP}. The account was created at ` +
        `10:22 today. No key was provisioned through the configuration management system. The ` +
        `source address matches the one that brute-forced this host at 09:12.`,
      enrichment: {
        priorFirings: 3,
        priorFalsePositives: 0,
        reputation: 'unknown',
      },
      verdict: 'true_positive',
      decision: 'escalate',
      incident: true,
      why:
        'The attacker returning through the door they built, and now using key authentication, ' +
        'which survives a password reset. Same source address as the original brute force — this ' +
        'is the alert that ties the whole sequence to one actor.',
    }),
    build({
      time: '11:06:02',
      source: 'edr',
      ruleId: 'archive-of-sensitive-path',
      ruleName: 'Archive created from sensitive directory',
      severity: 'high',
      confidence: 70,
      from: { ip: '10.20.6.40', host: WEB_HOST, user: BACKDOOR_USER },
      summary: `tar archive of /var/www/portal/exports written to /tmp/.cache/`,
      detail:
        `tar -czf /tmp/.cache/pt.tar.gz /var/www/portal/exports, run as root via sudo by ` +
        `${BACKDOOR_USER}. The source directory holds generated patient record exports. The ` +
        `destination is a dot-directory under /tmp, which is not a backup location.`,
      enrichment: {
        priorFirings: 7,
        priorFalsePositives: 2,
        reputation: 'known-good',
      },
      verdict: 'true_positive',
      decision: 'escalate',
      incident: true,
      why:
        'Data staging, and the point at which this becomes a regulated breach rather than an ' +
        'intrusion. Patient exports compressed into a hidden directory under /tmp is not how ' +
        'backups work. Scope and notification obligations start here.',
    }),
  ];
}

// --- correct alerts about ordinary activity ----------------------------------

/**
 * Benign true positives.
 *
 * The most important category in the corpus. Every one of these is a correct
 * detection of something that genuinely happened and was entirely legitimate.
 * A student who escalates these has not been careless -- they have failed to
 * find out what normal looks like, which is the actual skill.
 */
function benignTruePositives(): Built[] {
  return [
    build({
      time: '01:30:15',
      source: 'auth-monitor',
      ruleId: 'auth-service-account-login',
      ruleName: 'Service account remote login',
      severity: 'medium',
      confidence: 90,
      from: { ip: BACKUP_IP, host: 'rmg-backup-01', user: 'svc-backup' },
      to: { ip: '10.20.6.40', host: WEB_HOST, port: 22 },
      summary: 'svc-backup logged in by public key from rmg-backup-01',
      detail:
        `Accepted publickey for svc-backup from ${BACKUP_IP}. Followed at 01:52 by a 41.7 GB ` +
        `snapshot transfer to rmg-backup-01 and a clean service exit.`,
      enrichment: {
        priorFirings: 730,
        priorFalsePositives: 730,
        reputation: 'known-good',
        reputationNote: 'Backup server, inventory asset RMG-BACKUP-01.',
        allowlisted: true,
      },
      verdict: 'benign_true_positive',
      decision: 'dismiss',
      why:
        'The nightly backup, on schedule, by key, from the backup server, followed by a transfer ' +
        'of the expected size. It has fired 730 times — twice a night for a year — and been ' +
        'correct and uninteresting every time.',
    }),
    build({
      time: '03:11:27',
      source: 'auth-monitor',
      ruleId: 'auth-outside-business-hours',
      ruleName: 'Interactive login outside business hours',
      severity: 'medium',
      confidence: 65,
      from: { ip: '10.20.4.12', user: 'rchen' },
      to: { ip: '10.20.6.40', host: WEB_HOST, port: 22 },
      summary: 'rchen logged in at 03:11 from the staff VLAN',
      detail:
        `Accepted password for rchen from 10.20.4.12 at 03:11. Session lasted 30 minutes and ` +
        `included one sudo: systemctl restart postgresql. Change record CHG-4471 schedules ` +
        `database maintenance for this window.`,
      enrichment: {
        priorFirings: 88,
        priorFalsePositives: 84,
        reputation: 'known-good',
      },
      verdict: 'benign_true_positive',
      decision: 'dismiss',
      why:
        'A DBA doing scheduled overnight maintenance, from their own workstation, with a change ' +
        'record. The unusual hour is the whole reason the rule exists, and the reason it is wrong ' +
        'most of the time — maintenance runs overnight precisely because that is when it is safe.',
    }),
    build({
      time: '08:15:33',
      source: 'edr',
      ruleId: 'sudo-privileged-command',
      ruleName: 'Privileged command executed via sudo',
      severity: 'medium',
      confidence: 95,
      from: { ip: '10.20.4.31', host: WEB_HOST, user: 'jmartel' },
      summary: 'jmartel ran apt-get upgrade -y as root',
      detail:
        `sudo apt-get upgrade -y by jmartel from pts/2, session open 08:15 to 08:22. jmartel is ` +
        `in the platform operations group and is listed in sudoers for package management.`,
      enrichment: {
        priorFirings: 1_190,
        priorFalsePositives: 1_186,
        reputation: 'known-good',
      },
      verdict: 'benign_true_positive',
      decision: 'dismiss',
      why:
        'An administrator patching a server. Escalating this is the single most common mistake a ' +
        'new operator makes: sudo is not an indicator of compromise, it is what authorised ' +
        'administration looks like. What matters is who ran it and whether it fits their role.',
    }),
    build({
      time: '09:02:31',
      source: 'auth-monitor',
      ruleId: 'auth-failed-password',
      ruleName: 'Failed SSH authentication',
      severity: 'medium',
      confidence: 90,
      from: { ip: '10.20.4.58', user: 'dokafor' },
      to: { ip: '10.20.6.40', host: WEB_HOST, port: 22 },
      summary: 'Two failed passwords for dokafor, then success, from their own workstation',
      detail:
        `Two authentication failures for dokafor from 10.20.4.58 at 09:02:14 and 09:02:31, ` +
        `followed by a successful login at 09:02:58 from the same address. 10.20.4.58 is ` +
        `dokafor's assigned workstation.`,
      enrichment: {
        priorFirings: 8_412,
        priorFalsePositives: 8_398,
        reputation: 'known-good',
      },
      verdict: 'benign_true_positive',
      decision: 'dismiss',
      why:
        'Somebody mistyped their password twice and then got it right, from their own machine, at ' +
        'the start of the working day. Two failures is a typo; sixty-two failures across nine ' +
        'accounts from an unknown address is an attack. The rule cannot tell the difference — that ' +
        'is what the operator is for.',
    }),
    build({
      time: '04:25:00',
      source: 'siem-rule',
      ruleId: 'host-disk-threshold',
      ruleName: 'Filesystem above capacity threshold',
      severity: 'low',
      confidence: 99,
      from: { ip: '10.20.6.40', host: WEB_HOST },
      summary: '/var is 87% full on rmg-web-02',
      detail: 'disk-monitor reports /var at 87%, above the 85% warning threshold. Recurs every 6 hours.',
      enrichment: { priorFirings: 604, priorFalsePositives: 0, reputation: 'known-good' },
      verdict: 'benign_true_positive',
      decision: 'dismiss',
      why:
        'A real operational problem and not a security one. It belongs in the platform team’s ' +
        'queue, not the SOC’s. Part of triage is recognising alerts that are somebody else’s to ' +
        'fix and routing them rather than investigating them.',
    }),
    build({
      time: '06:41:02',
      source: 'edr',
      ruleId: 'apparmor-denial',
      ruleName: 'Mandatory access control denial',
      severity: 'low',
      confidence: 99,
      from: { ip: '10.20.6.40', host: WEB_HOST },
      summary: 'AppArmor denied nginx access to /proc/1422/oom_score_adj',
      detail:
        'apparmor="DENIED" operation="open" profile="/usr/sbin/nginx" name="/proc/1422/oom_score_adj". ' +
        'The profile is working as configured; nginx does not require this access.',
      enrichment: { priorFirings: 2_140, priorFalsePositives: 2_140, reputation: 'known-good' },
      verdict: 'benign_true_positive',
      decision: 'dismiss',
      why:
        'A hardening control denying access it is supposed to deny. Denials are the control ' +
        'working, not evidence of attack — though a sudden change in their pattern would be worth ' +
        'a look.',
    }),
    build({
      time: '07:05:22',
      source: 'dlp',
      ruleId: 'dlp-outbound-attachment',
      ruleName: 'Outbound message with attachment to external domain',
      severity: 'medium',
      confidence: 40,
      from: { ip: '10.20.7.10', user: 'noreply@ridgelinemed.example' },
      summary: 'Appointment reminder batch sent to external recipients',
      detail:
        'postfix delivered 1,204 appointment reminder messages to external recipients via the ' +
        'mail relay. Template matches the scheduled reminder job that runs at 07:05, 12:05 and 17:05.',
      enrichment: { priorFirings: 1_090, priorFalsePositives: 1_090, reputation: 'known-good', allowlisted: true },
      verdict: 'benign_true_positive',
      decision: 'dismiss',
      why:
        'A scheduled business process that sends mail to patients. It fires three times a day and ' +
        'always will. Note the 40% confidence — the rule already knows it is probably wrong.',
    }),
  ];
}

// --- rules that are simply wrong ---------------------------------------------

/**
 * False positives: the rule fired and the thing it claims did not happen.
 *
 * Distinguished from benign true positives on purpose. Both get closed, but they
 * lead to different actions: a false positive means the detection logic is
 * broken, a benign true positive means the detection is fine and the activity is
 * authorised. Conflating them is how a SOC ends up deleting rules that work.
 */
function falsePositives(): Built[] {
  return [
    build({
      time: '09:41:18',
      source: 'ids',
      ruleId: 'web-sql-injection-keyword',
      ruleName: 'SQL keyword in HTTP request parameter',
      severity: 'high',
      confidence: 45,
      from: { ip: '10.20.4.31', user: 'jmartel' },
      to: { ip: '10.20.6.40', host: WEB_HOST, port: 443 },
      summary: 'SQL keyword "select" detected in request to /portal/results/summary',
      detail:
        'Request parameter contained the string "select" in: ' +
        '/portal/results/summary?view=selected_labs&sort=date. The rule matches the substring ' +
        '"select" anywhere in a query string, without regard to word boundaries or syntax.',
      enrichment: {
        priorFirings: 3_180,
        priorFalsePositives: 3_180,
        reputation: 'known-good',
      },
      verdict: 'false_positive',
      decision: 'tune',
      why:
        'The rule matched "select" inside the parameter value "selected_labs". There is no ' +
        'injection here and there never has been in 3,180 firings. This is a broken rule, not ' +
        'benign activity: it needs a word-boundary match and injection syntax, not an exclusion.',
    }),
    build({
      time: '05:12:40',
      source: 'av',
      ruleId: 'av-signature-match',
      ruleName: 'Malware signature match',
      severity: 'critical',
      confidence: 99,
      from: { ip: '10.20.4.58', host: 'rmg-ws-0058', user: 'dokafor' },
      summary: 'EICAR test file quarantined in dokafor Downloads folder',
      detail:
        'Signature EICAR-Test-File matched at C:\\Users\\dokafor\\Downloads\\eicar.com. File ' +
        'quarantined. EICAR is the industry-standard antivirus test string and contains no ' +
        'executable payload. Security awareness training issued this file on 14 August.',
      enrichment: {
        priorFirings: 41,
        priorFalsePositives: 39,
        reputation: 'known-good',
      },
      verdict: 'false_positive',
      decision: 'dismiss',
      why:
        'Critical severity, 99% confidence, and completely harmless. EICAR is a deliberately inert ' +
        'test string used to prove antivirus is working. This is the clearest example in the queue ' +
        'that severity and confidence are assertions by a rule, not facts about the world.',
    }),
    build({
      time: '11:12:08',
      source: 'ids',
      ruleId: 'net-conntrack-exhaustion',
      ruleName: 'Connection tracking table exhausted',
      severity: 'high',
      confidence: 80,
      from: { ip: '10.20.6.40', host: WEB_HOST },
      summary: 'nf_conntrack table full, packets dropped',
      detail:
        'kernel: nf_conntrack: table full, dropping packet. The rule classifies conntrack ' +
        'exhaustion as a probable denial-of-service. Inbound request rate at the time was within ' +
        'one standard deviation of the weekly mean.',
      enrichment: {
        priorFirings: 96,
        priorFalsePositives: 88,
        reputation: 'known-good',
      },
      verdict: 'false_positive',
      decision: 'tune',
      why:
        'The rule asserts a denial-of-service; the traffic volume says otherwise. The table is ' +
        'undersized for this host, which is a capacity defect. Worth noting that it happens to ' +
        'coincide with the exfiltration — a genuine coincidence, and a good reminder that ' +
        'correlation by timestamp alone will mislead you.',
    }),
    build({
      time: '02:20:11',
      source: 'cloud-audit',
      ruleId: 'cloud-root-api-call',
      ruleName: 'API call by root principal',
      severity: 'critical',
      confidence: 88,
      from: { ip: '198.51.100.14', user: 'root' },
      summary: 'Root principal invoked GetCostAndUsage',
      detail:
        'Billing API call GetCostAndUsage by the account root principal from 198.51.100.14, the ' +
        'finance department’s registered egress address. Scheduled monthly cost export, ticket ' +
        'FIN-2231.',
      enrichment: {
        priorFirings: 13,
        priorFalsePositives: 12,
        reputation: 'known-good',
        allowlisted: true,
      },
      verdict: 'false_positive',
      decision: 'tune',
      why:
        'Root principal use is genuinely worth alerting on, but billing APIs cannot be called by ' +
        'anything else in this account — the permission does not exist to delegate. The rule needs ' +
        'to exclude billing read operations, or it will cry wolf every month until nobody reads it.',
    }),
  ];
}

// --- queue assembly ----------------------------------------------------------

interface QueueSpec {
  id: string;
  title: string;
  briefing: string;
  built: Built[];
}

/** Shuffle deterministically, so the queue is not sorted by answer. */
function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function byTime(items: Built[]): Built[] {
  return [...items].sort((a, b) => a.alert.raisedAt.localeCompare(b.alert.raisedAt));
}

const queues: QueueSpec[] = [];

// -- Queue 1: the teaching queue. Twelve alerts, one intrusion alert. ---------
{
  const noise = [
    scannerNoise(2),
    scannerNoise(4),
    webScanNoise(6),
    monitoringNoise(1, 5),
    monitoringNoise(1, 10),
  ];
  const benign = benignTruePositives().slice(0, 4);
  const real = intrusionAlerts().slice(1, 2); // the successful login
  const fp = falsePositives().slice(1, 3);

  queues.push({
    id: 'q-intro',
    title: 'First shift: twelve alerts',
    briefing:
      'A short slice of one morning at Ridgeline Medical Group. Twelve alerts, of the roughly ' +
      'nine hundred the stack raises in a day. Exactly one of them is an intrusion. Read every ' +
      'alert before you decide anything — the queue is not sorted by importance, and the rule ' +
      'that shouted loudest is not the one that matters.',
    built: byTime([...noise, ...benign, ...real, ...fp]),
  });
}

// -- Queue 2: the noisy rule. Tuning, not dismissing. -------------------------
{
  const noisy: Built[] = [];
  for (let minute = 0; minute < 60 * 3; minute += 5) {
    noisy.push(monitoringNoise(Math.floor(minute / 60), minute % 60));
  }
  const others = [
    ...benignTruePositives().slice(0, 3),
    scannerNoise(1),
    scannerNoise(2),
    ...intrusionAlerts().slice(0, 1),
  ];

  queues.push({
    id: 'q-noisy-rule',
    title: 'Three hours of one rule',
    briefing:
      'Three hours of queue from the same night. One rule dominates it completely. Your job is ' +
      'not to clear these one at a time — it is to work out what should happen to the rule, and ' +
      'to notice what the volume is hiding.',
    built: byTime(others.concat(noisy)),
  });
}

// -- Queue 3: the full night shift. -------------------------------------------
{
  const all: Built[] = [];

  // The monitoring host, every five minutes from midnight to noon.
  for (let minute = 0; minute < 60 * 12; minute += 5) {
    if (rand() < 0.28) all.push(monitoringNoise(Math.floor(minute / 60), minute % 60));
  }
  // Internet background radiation across the shift.
  for (let hour = 0; hour < 12; hour += 1) {
    for (let i = 0; i < between(1, 3); i += 1) all.push(scannerNoise(hour));
    if (rand() < 0.6) all.push(webScanNoise(hour));
  }
  all.push(...benignTruePositives());
  all.push(...falsePositives());
  all.push(...intrusionAlerts());

  queues.push({
    id: 'q-nightshift',
    title: 'Night shift, midnight to noon',
    briefing:
      'Twelve hours of alerts from rmg-web-02 and the hosts around it, exactly as the stack ' +
      'raised them. This is a real shift’s worth of queue. Somewhere in it is an intrusion that ' +
      'reached patient data, and the alerts that describe it are not the loudest ones.',
    built: byTime(all),
  });
}

// -- Queue 4: correlation. One user, three alert types, five minutes. ---------
{
  const intrusion = intrusionAlerts();
  const window = [intrusion[1]!, intrusion[2]!, intrusion[3]!];
  const distractors = [
    ...benignTruePositives().slice(2, 5),
    scannerNoise(10),
    webScanNoise(10),
    monitoringNoise(10, 15),
    monitoringNoise(10, 20),
    monitoringNoise(10, 25),
    monitoringNoise(10, 30),
    ...falsePositives().slice(0, 2),
  ];

  queues.push({
    id: 'q-correlation',
    title: 'A twenty-minute window',
    briefing:
      'Every alert raised between 10:10 and 10:35. Individually, several of these are unremarkable ' +
      'and would be closed without much thought on a busy shift. Look at what they have in common ' +
      'before you decide any of them.',
    built: byTime([...window, ...distractors]),
  });
}

// --- emit --------------------------------------------------------------------

function literal(value: unknown): string {
  return JSON.stringify(value, null, 2)
    .split('\n')
    .map((line, index) => (index === 0 ? line : '  ' + line))
    .join('\n');
}

const allTruth = queues.flatMap((queue) => queue.built.map((item) => item.truth));

const banner = `/**
 * GENERATED FILE -- DO NOT EDIT BY HAND.
 *
 * Produced by scripts/generate-alerts.ts. To change the alert corpus, edit that
 * script and re-run:  npm run gen:alerts --workspace @soc/server
 *
 * Committed on purpose: Package 3's expected answers are computed from this
 * corpus, so it must not change unless somebody intends it to.
 *
 * ALERT_TRUTH IS THE ANSWER KEY. It must never be sent to the browser. The only
 * code permitted to build a client response from a queue is the alert service,
 * which reads ALERT_QUEUES and never touches ALERT_TRUTH.
 */

import type { AlertQueue, AlertTruth } from '@soc/shared';
`;

const queueLiteral = queues
  .map(
    (queue) => `  {
    id: ${JSON.stringify(queue.id)},
    title: ${JSON.stringify(queue.title)},
    briefing: ${JSON.stringify(queue.briefing)},
    alerts: ${literal(queue.built.map((item) => item.alert))
      .split('\n')
      .map((line, index) => (index === 0 ? line : '  ' + line))
      .join('\n')},
  }`,
  )
  .join(',\n');

const body = `${banner}
/** ${queues.length} queues, ${allTruth.length} alerts in total. */
export const ALERT_QUEUES: AlertQueue[] = [
${queueLiteral},
];

/** The answer key. Server-side only -- see the warning above. */
export const ALERT_TRUTH: AlertTruth[] = ${literal(allTruth)};
`;

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, body, 'utf8');

process.stdout.write(
  [
    `Wrote ${OUT_FILE}`,
    ...queues.map((queue) => {
      const truths = queue.built.map((item) => item.truth);
      const tally = (decision: TriageDecision) =>
        truths.filter((truth) => truth.correctDecision === decision).length;
      return (
        `  ${queue.id.padEnd(14)} ${String(queue.built.length).padStart(4)} alerts` +
        `  escalate=${tally('escalate')}` +
        `  investigate=${tally('investigate')}` +
        `  dismiss=${tally('dismiss')}` +
        `  tune=${tally('tune')}`
      );
    }),
    '',
  ].join('\n'),
);
