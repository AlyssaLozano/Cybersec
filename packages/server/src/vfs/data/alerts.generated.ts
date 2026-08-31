/**
 * GENERATED FILE -- DO NOT EDIT BY HAND.
 *
 * Produced by scripts/generate-alerts.ts. To change the alert corpus, edit that
 * script and re-run:  npm run gen:alerts --workspace @soc/server
 *
 * Committed on purpose: Alert Triage's expected answers are computed from this
 * corpus, so it must not change unless somebody intends it to.
 *
 * ALERT_TRUTH IS THE ANSWER KEY. It must never be sent to the browser. The only
 * code permitted to build a client response from a queue is the alert service,
 * which reads ALERT_QUEUES and never touches ALERT_TRUTH.
 */

import type { AlertQueue, AlertTruth } from '@soc/shared';

/** 4 queues, 150 alerts in total. */
export const ALERT_QUEUES: AlertQueue[] = [
  {
    id: "q-intro",
    title: "First shift: twelve alerts",
    briefing: "A short slice of one morning at Ridgeline Medical Group. Twelve alerts, of the roughly nine hundred the stack raises in a day. Exactly one of them is an intrusion. Read every alert before you decide anything — the queue is not sorted by importance, and the rule that shouted loudest is not the one that matters.",
    alerts: [
      {
        "id": "A-5004",
        "raisedAt": "2026-08-15T01:05:10Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5005",
        "raisedAt": "2026-08-15T01:10:08Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5006",
        "raisedAt": "2026-08-15T01:30:15Z",
        "source": "auth-monitor",
        "ruleId": "auth-service-account-login",
        "ruleName": "Service account remote login",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.15",
          "host": "rmg-backup-01",
          "user": "svc-backup"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "svc-backup logged in by public key from rmg-backup-01",
        "detail": "Accepted publickey for svc-backup from 10.20.9.15. Followed at 01:52 by a 41.7 GB snapshot transfer to rmg-backup-01 and a clean service exit.",
        "enrichment": {
          "priorFirings": 730,
          "priorFalsePositives": 730,
          "reputation": "known-good",
          "reputationNote": "Backup server, inventory asset RMG-BACKUP-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5001",
        "raisedAt": "2026-08-15T02:06:52Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "192.0.2.9"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 5900
        },
        "summary": "Firewall blocked inbound 192.0.2.9 to port 5900",
        "detail": "The host firewall dropped an inbound TCP connection from 192.0.2.9 to port 5900, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 19352,
          "priorFalsePositives": 23528,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5007",
        "raisedAt": "2026-08-15T03:11:27Z",
        "source": "auth-monitor",
        "ruleId": "auth-outside-business-hours",
        "ruleName": "Interactive login outside business hours",
        "severity": "medium",
        "confidence": 65,
        "from": {
          "ip": "10.20.4.12",
          "user": "rchen"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "rchen logged in at 03:11 from the staff VLAN",
        "detail": "Accepted password for rchen from 10.20.4.12 at 03:11. Session lasted 30 minutes and included one sudo: systemctl restart postgresql. Change record CHG-4471 schedules database maintenance for this window.",
        "enrichment": {
          "priorFirings": 88,
          "priorFalsePositives": 84,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5002",
        "raisedAt": "2026-08-15T04:30:07Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "198.51.100.202"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 445
        },
        "summary": "Firewall blocked inbound 198.51.100.202 to port 445",
        "detail": "The host firewall dropped an inbound TCP connection from 198.51.100.202 to port 445, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 23487,
          "priorFalsePositives": 20131,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5022",
        "raisedAt": "2026-08-15T05:12:40Z",
        "source": "av",
        "ruleId": "av-signature-match",
        "ruleName": "Malware signature match",
        "severity": "critical",
        "confidence": 99,
        "from": {
          "ip": "10.20.4.58",
          "host": "rmg-ws-0058",
          "user": "dokafor"
        },
        "summary": "EICAR test file quarantined in dokafor Downloads folder",
        "detail": "Signature EICAR-Test-File matched at C:\\Users\\dokafor\\Downloads\\eicar.com. File quarantined. EICAR is the industry-standard antivirus test string and contains no executable payload. Security awareness training issued this file on 14 August.",
        "enrichment": {
          "priorFirings": 41,
          "priorFalsePositives": 39,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5003",
        "raisedAt": "2026-08-15T06:35:16Z",
        "source": "ids",
        "ruleId": "web-known-scan-path",
        "ruleName": "Request for known-vulnerable application path",
        "severity": "medium",
        "confidence": 70,
        "from": {
          "ip": "192.0.2.9"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 443
        },
        "summary": "404 for /.env from 192.0.2.9",
        "detail": "nginx returned 404 for GET /.env. This host runs the patient portal on a Node upstream and does not run WordPress, phpMyAdmin, or PHP of any kind.",
        "enrichment": {
          "priorFirings": 4827,
          "priorFalsePositives": 4968,
          "reputation": "unknown"
        }
      },
      {
        "id": "A-5008",
        "raisedAt": "2026-08-15T08:15:33Z",
        "source": "edr",
        "ruleId": "sudo-privileged-command",
        "ruleName": "Privileged command executed via sudo",
        "severity": "medium",
        "confidence": 95,
        "from": {
          "ip": "10.20.4.31",
          "host": "rmg-web-02",
          "user": "jmartel"
        },
        "summary": "jmartel ran apt-get upgrade -y as root",
        "detail": "sudo apt-get upgrade -y by jmartel from pts/2, session open 08:15 to 08:22. jmartel is in the platform operations group and is listed in sudoers for package management.",
        "enrichment": {
          "priorFirings": 1190,
          "priorFalsePositives": 1186,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5009",
        "raisedAt": "2026-08-15T09:02:31Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.4.58",
          "user": "dokafor"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Two failed passwords for dokafor, then success, from their own workstation",
        "detail": "Two authentication failures for dokafor from 10.20.4.58 at 09:02:14 and 09:02:31, followed by a successful login at 09:02:58 from the same address. 10.20.4.58 is dokafor's assigned workstation.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5014",
        "raisedAt": "2026-08-15T10:14:22Z",
        "source": "auth-monitor",
        "ruleId": "auth-success-after-failures",
        "ruleName": "Successful login from source with prior failures",
        "severity": "medium",
        "confidence": 60,
        "from": {
          "ip": "203.0.113.55"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22,
          "user": "testuser"
        },
        "summary": "Accepted password for testuser from 203.0.113.55 after 62 prior failures",
        "detail": "SSH accepted a password for \"testuser\" from 203.0.113.55. The same source failed 62 times against this host between 09:12 and 09:47. testuser is a local account with UID 1004, last password change 619 days ago, no sudo entry of its own.",
        "enrichment": {
          "priorFirings": 9,
          "priorFalsePositives": 4,
          "reputation": "unknown"
        }
      },
      {
        "id": "A-5023",
        "raisedAt": "2026-08-15T11:12:08Z",
        "source": "ids",
        "ruleId": "net-conntrack-exhaustion",
        "ruleName": "Connection tracking table exhausted",
        "severity": "high",
        "confidence": 80,
        "from": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02"
        },
        "summary": "nf_conntrack table full, packets dropped",
        "detail": "kernel: nf_conntrack: table full, dropping packet. The rule classifies conntrack exhaustion as a probable denial-of-service. Inbound request rate at the time was within one standard deviation of the weekly mean.",
        "enrichment": {
          "priorFirings": 96,
          "priorFalsePositives": 88,
          "reputation": "known-good"
        }
      }
    ],
  },
  {
    id: "q-noisy-rule",
    title: "Three hours of one rule",
    briefing: "Three hours of queue from the same night. One rule dominates it completely. Your job is not to clear these one at a time — it is to work out what should happen to the rule, and to notice what the volume is hiding.",
    alerts: [
      {
        "id": "A-5025",
        "raisedAt": "2026-08-15T00:00:11Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5026",
        "raisedAt": "2026-08-15T00:05:20Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5027",
        "raisedAt": "2026-08-15T00:10:26Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5028",
        "raisedAt": "2026-08-15T00:15:04Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5029",
        "raisedAt": "2026-08-15T00:20:30Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5030",
        "raisedAt": "2026-08-15T00:25:25Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5031",
        "raisedAt": "2026-08-15T00:30:17Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5032",
        "raisedAt": "2026-08-15T00:35:09Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5033",
        "raisedAt": "2026-08-15T00:40:25Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5034",
        "raisedAt": "2026-08-15T00:45:14Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5035",
        "raisedAt": "2026-08-15T00:50:25Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5036",
        "raisedAt": "2026-08-15T00:55:09Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5037",
        "raisedAt": "2026-08-15T01:00:16Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5038",
        "raisedAt": "2026-08-15T01:05:17Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5039",
        "raisedAt": "2026-08-15T01:10:21Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5068",
        "raisedAt": "2026-08-15T01:13:56Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "192.0.2.171"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 23
        },
        "summary": "Firewall blocked inbound 192.0.2.171 to port 23",
        "detail": "The host firewall dropped an inbound TCP connection from 192.0.2.171 to port 23, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 22932,
          "priorFalsePositives": 21276,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5040",
        "raisedAt": "2026-08-15T01:15:19Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5041",
        "raisedAt": "2026-08-15T01:20:27Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5042",
        "raisedAt": "2026-08-15T01:25:26Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5043",
        "raisedAt": "2026-08-15T01:30:07Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5061",
        "raisedAt": "2026-08-15T01:30:15Z",
        "source": "auth-monitor",
        "ruleId": "auth-service-account-login",
        "ruleName": "Service account remote login",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.15",
          "host": "rmg-backup-01",
          "user": "svc-backup"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "svc-backup logged in by public key from rmg-backup-01",
        "detail": "Accepted publickey for svc-backup from 10.20.9.15. Followed at 01:52 by a 41.7 GB snapshot transfer to rmg-backup-01 and a clean service exit.",
        "enrichment": {
          "priorFirings": 730,
          "priorFalsePositives": 730,
          "reputation": "known-good",
          "reputationNote": "Backup server, inventory asset RMG-BACKUP-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5044",
        "raisedAt": "2026-08-15T01:35:03Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5045",
        "raisedAt": "2026-08-15T01:40:26Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5046",
        "raisedAt": "2026-08-15T01:45:16Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5047",
        "raisedAt": "2026-08-15T01:50:18Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5048",
        "raisedAt": "2026-08-15T01:55:08Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5049",
        "raisedAt": "2026-08-15T02:00:24Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5050",
        "raisedAt": "2026-08-15T02:05:23Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5051",
        "raisedAt": "2026-08-15T02:10:30Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5052",
        "raisedAt": "2026-08-15T02:15:27Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5053",
        "raisedAt": "2026-08-15T02:20:02Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5054",
        "raisedAt": "2026-08-15T02:25:24Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5055",
        "raisedAt": "2026-08-15T02:30:14Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5056",
        "raisedAt": "2026-08-15T02:35:17Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5057",
        "raisedAt": "2026-08-15T02:40:27Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5058",
        "raisedAt": "2026-08-15T02:45:16Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5059",
        "raisedAt": "2026-08-15T02:50:15Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5060",
        "raisedAt": "2026-08-15T02:55:01Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5069",
        "raisedAt": "2026-08-15T02:56:07Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "198.51.100.23"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 23
        },
        "summary": "Firewall blocked inbound 198.51.100.23 to port 23",
        "detail": "The host firewall dropped an inbound TCP connection from 198.51.100.23 to port 23, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 21340,
          "priorFalsePositives": 23594,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5062",
        "raisedAt": "2026-08-15T03:11:27Z",
        "source": "auth-monitor",
        "ruleId": "auth-outside-business-hours",
        "ruleName": "Interactive login outside business hours",
        "severity": "medium",
        "confidence": 65,
        "from": {
          "ip": "10.20.4.12",
          "user": "rchen"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "rchen logged in at 03:11 from the staff VLAN",
        "detail": "Accepted password for rchen from 10.20.4.12 at 03:11. Session lasted 30 minutes and included one sudo: systemctl restart postgresql. Change record CHG-4471 schedules database maintenance for this window.",
        "enrichment": {
          "priorFirings": 88,
          "priorFalsePositives": 84,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5063",
        "raisedAt": "2026-08-15T08:15:33Z",
        "source": "edr",
        "ruleId": "sudo-privileged-command",
        "ruleName": "Privileged command executed via sudo",
        "severity": "medium",
        "confidence": 95,
        "from": {
          "ip": "10.20.4.31",
          "host": "rmg-web-02",
          "user": "jmartel"
        },
        "summary": "jmartel ran apt-get upgrade -y as root",
        "detail": "sudo apt-get upgrade -y by jmartel from pts/2, session open 08:15 to 08:22. jmartel is in the platform operations group and is listed in sudoers for package management.",
        "enrichment": {
          "priorFirings": 1190,
          "priorFalsePositives": 1186,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5070",
        "raisedAt": "2026-08-15T09:14:11Z",
        "source": "siem-rule",
        "ruleId": "auth-brute-force-threshold",
        "ruleName": "Repeated authentication failures from single source",
        "severity": "high",
        "confidence": 75,
        "from": {
          "ip": "203.0.113.55"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Sustained SSH brute force from 203.0.113.55 against multiple accounts",
        "detail": "47 authentication failures from 203.0.113.55 in 120 seconds, spread across accounts root, admin, oracle, ubuntu, postgres, test, testuser, git and deploy. Three further sources (203.0.113.12, 198.51.100.77, 203.0.113.88) are attempting the same account list in the same window, which indicates a shared wordlist rather than four independent scans.",
        "enrichment": {
          "priorFirings": 61,
          "priorFalsePositives": 44,
          "reputation": "unknown",
          "reputationNote": "No prior sightings of this address against Ridgeline infrastructure."
        }
      }
    ],
  },
  {
    id: "q-nightshift",
    title: "Night shift, midnight to noon",
    briefing: "Twelve hours of alerts from rmg-web-02 and the hosts around it, exactly as the stack raised them. This is a real shift’s worth of queue. Somewhere in it is an intrusion that reached patient data, and the alerts that describe it are not the loudest ones.",
    alerts: [
      {
        "id": "A-5078",
        "raisedAt": "2026-08-15T00:10:19Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5115",
        "raisedAt": "2026-08-15T00:18:29Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "192.0.2.9"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 5900
        },
        "summary": "Firewall blocked inbound 192.0.2.9 to port 5900",
        "detail": "The host firewall dropped an inbound TCP connection from 192.0.2.9 to port 5900, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 19112,
          "priorFalsePositives": 21899,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5079",
        "raisedAt": "2026-08-15T01:00:20Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5116",
        "raisedAt": "2026-08-15T01:04:37Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "192.0.2.44"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 3389
        },
        "summary": "Firewall blocked inbound 192.0.2.44 to port 3389",
        "detail": "The host firewall dropped an inbound TCP connection from 192.0.2.44 to port 3389, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 20172,
          "priorFalsePositives": 20649,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5141",
        "raisedAt": "2026-08-15T01:30:15Z",
        "source": "auth-monitor",
        "ruleId": "auth-service-account-login",
        "ruleName": "Service account remote login",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.15",
          "host": "rmg-backup-01",
          "user": "svc-backup"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "svc-backup logged in by public key from rmg-backup-01",
        "detail": "Accepted publickey for svc-backup from 10.20.9.15. Followed at 01:52 by a 41.7 GB snapshot transfer to rmg-backup-01 and a clean service exit.",
        "enrichment": {
          "priorFirings": 730,
          "priorFalsePositives": 730,
          "reputation": "known-good",
          "reputationNote": "Backup server, inventory asset RMG-BACKUP-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5117",
        "raisedAt": "2026-08-15T02:14:23Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "198.51.100.23"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 23
        },
        "summary": "Firewall blocked inbound 198.51.100.23 to port 23",
        "detail": "The host firewall dropped an inbound TCP connection from 198.51.100.23 to port 23, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 23652,
          "priorFalsePositives": 23162,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5151",
        "raisedAt": "2026-08-15T02:20:11Z",
        "source": "cloud-audit",
        "ruleId": "cloud-root-api-call",
        "ruleName": "API call by root principal",
        "severity": "critical",
        "confidence": 88,
        "from": {
          "ip": "198.51.100.14",
          "user": "root"
        },
        "summary": "Root principal invoked GetCostAndUsage",
        "detail": "Billing API call GetCostAndUsage by the account root principal from 198.51.100.14, the finance department’s registered egress address. Scheduled monthly cost export, ticket FIN-2231.",
        "enrichment": {
          "priorFirings": 13,
          "priorFalsePositives": 12,
          "reputation": "known-good",
          "allowlisted": true
        }
      },
      {
        "id": "A-5119",
        "raisedAt": "2026-08-15T03:02:53Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "192.0.2.171"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 445
        },
        "summary": "Firewall blocked inbound 192.0.2.171 to port 445",
        "detail": "The host firewall dropped an inbound TCP connection from 192.0.2.171 to port 445, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 23967,
          "priorFalsePositives": 20117,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5142",
        "raisedAt": "2026-08-15T03:11:27Z",
        "source": "auth-monitor",
        "ruleId": "auth-outside-business-hours",
        "ruleName": "Interactive login outside business hours",
        "severity": "medium",
        "confidence": 65,
        "from": {
          "ip": "10.20.4.12",
          "user": "rchen"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "rchen logged in at 03:11 from the staff VLAN",
        "detail": "Accepted password for rchen from 10.20.4.12 at 03:11. Session lasted 30 minutes and included one sudo: systemctl restart postgresql. Change record CHG-4471 schedules database maintenance for this window.",
        "enrichment": {
          "priorFirings": 88,
          "priorFalsePositives": 84,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5118",
        "raisedAt": "2026-08-15T03:16:17Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "203.0.113.140"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 3389
        },
        "summary": "Firewall blocked inbound 203.0.113.140 to port 3389",
        "detail": "The host firewall dropped an inbound TCP connection from 203.0.113.140 to port 3389, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 19065,
          "priorFalsePositives": 22190,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5080",
        "raisedAt": "2026-08-15T03:25:05Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5120",
        "raisedAt": "2026-08-15T03:29:34Z",
        "source": "ids",
        "ruleId": "web-known-scan-path",
        "ruleName": "Request for known-vulnerable application path",
        "severity": "medium",
        "confidence": 70,
        "from": {
          "ip": "198.51.100.202"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 443
        },
        "summary": "404 for /.env from 198.51.100.202",
        "detail": "nginx returned 404 for GET /.env. This host runs the patient portal on a Node upstream and does not run WordPress, phpMyAdmin, or PHP of any kind.",
        "enrichment": {
          "priorFirings": 5128,
          "priorFalsePositives": 4402,
          "reputation": "unknown"
        }
      },
      {
        "id": "A-5081",
        "raisedAt": "2026-08-15T03:45:24Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5082",
        "raisedAt": "2026-08-15T04:00:23Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5083",
        "raisedAt": "2026-08-15T04:05:16Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5122",
        "raisedAt": "2026-08-15T04:14:27Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "198.51.100.202"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 445
        },
        "summary": "Firewall blocked inbound 198.51.100.202 to port 445",
        "detail": "The host firewall dropped an inbound TCP connection from 198.51.100.202 to port 445, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 23584,
          "priorFalsePositives": 23645,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5084",
        "raisedAt": "2026-08-15T04:15:02Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5145",
        "raisedAt": "2026-08-15T04:25:00Z",
        "source": "siem-rule",
        "ruleId": "host-disk-threshold",
        "ruleName": "Filesystem above capacity threshold",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02"
        },
        "summary": "/var is 87% full on rmg-web-02",
        "detail": "disk-monitor reports /var at 87%, above the 85% warning threshold. Recurs every 6 hours.",
        "enrichment": {
          "priorFirings": 604,
          "priorFalsePositives": 0,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5085",
        "raisedAt": "2026-08-15T04:30:08Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5086",
        "raisedAt": "2026-08-15T04:40:13Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5121",
        "raisedAt": "2026-08-15T04:40:36Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "198.51.100.23"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 3389
        },
        "summary": "Firewall blocked inbound 198.51.100.23 to port 3389",
        "detail": "The host firewall dropped an inbound TCP connection from 198.51.100.23 to port 3389, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 21398,
          "priorFalsePositives": 23705,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5087",
        "raisedAt": "2026-08-15T04:50:14Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5088",
        "raisedAt": "2026-08-15T04:55:16Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5089",
        "raisedAt": "2026-08-15T05:00:13Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5149",
        "raisedAt": "2026-08-15T05:12:40Z",
        "source": "av",
        "ruleId": "av-signature-match",
        "ruleName": "Malware signature match",
        "severity": "critical",
        "confidence": 99,
        "from": {
          "ip": "10.20.4.58",
          "host": "rmg-ws-0058",
          "user": "dokafor"
        },
        "summary": "EICAR test file quarantined in dokafor Downloads folder",
        "detail": "Signature EICAR-Test-File matched at C:\\Users\\dokafor\\Downloads\\eicar.com. File quarantined. EICAR is the industry-standard antivirus test string and contains no executable payload. Security awareness training issued this file on 14 August.",
        "enrichment": {
          "priorFirings": 41,
          "priorFalsePositives": 39,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5090",
        "raisedAt": "2026-08-15T05:15:22Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5123",
        "raisedAt": "2026-08-15T05:17:17Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "192.0.2.9"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 23
        },
        "summary": "Firewall blocked inbound 192.0.2.9 to port 23",
        "detail": "The host firewall dropped an inbound TCP connection from 192.0.2.9 to port 23, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 23666,
          "priorFalsePositives": 21954,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5091",
        "raisedAt": "2026-08-15T05:25:17Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5124",
        "raisedAt": "2026-08-15T05:39:52Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "198.51.100.23"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 5900
        },
        "summary": "Firewall blocked inbound 198.51.100.23 to port 5900",
        "detail": "The host firewall dropped an inbound TCP connection from 198.51.100.23 to port 5900, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 20921,
          "priorFalsePositives": 22283,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5125",
        "raisedAt": "2026-08-15T05:51:50Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "198.51.100.202"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 8080
        },
        "summary": "Firewall blocked inbound 198.51.100.202 to port 8080",
        "detail": "The host firewall dropped an inbound TCP connection from 198.51.100.202 to port 8080, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 20708,
          "priorFalsePositives": 21094,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5126",
        "raisedAt": "2026-08-15T05:54:49Z",
        "source": "ids",
        "ruleId": "web-known-scan-path",
        "ruleName": "Request for known-vulnerable application path",
        "severity": "medium",
        "confidence": 70,
        "from": {
          "ip": "198.51.100.23"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 443
        },
        "summary": "404 for /wp-login.php from 198.51.100.23",
        "detail": "nginx returned 404 for GET /wp-login.php. This host runs the patient portal on a Node upstream and does not run WordPress, phpMyAdmin, or PHP of any kind.",
        "enrichment": {
          "priorFirings": 4082,
          "priorFalsePositives": 4677,
          "reputation": "unknown"
        }
      },
      {
        "id": "A-5092",
        "raisedAt": "2026-08-15T05:55:02Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5127",
        "raisedAt": "2026-08-15T06:08:20Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "203.0.113.201"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 8080
        },
        "summary": "Firewall blocked inbound 203.0.113.201 to port 8080",
        "detail": "The host firewall dropped an inbound TCP connection from 203.0.113.201 to port 8080, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 19294,
          "priorFalsePositives": 23619,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5093",
        "raisedAt": "2026-08-15T06:10:09Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5094",
        "raisedAt": "2026-08-15T06:35:08Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5095",
        "raisedAt": "2026-08-15T06:40:05Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5146",
        "raisedAt": "2026-08-15T06:41:02Z",
        "source": "edr",
        "ruleId": "apparmor-denial",
        "ruleName": "Mandatory access control denial",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02"
        },
        "summary": "AppArmor denied nginx access to /proc/1422/oom_score_adj",
        "detail": "apparmor=\"DENIED\" operation=\"open\" profile=\"/usr/sbin/nginx\" name=\"/proc/1422/oom_score_adj\". The profile is working as configured; nginx does not require this access.",
        "enrichment": {
          "priorFirings": 2140,
          "priorFalsePositives": 2140,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5096",
        "raisedAt": "2026-08-15T06:50:27Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5128",
        "raisedAt": "2026-08-15T06:52:39Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "203.0.113.140"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 23
        },
        "summary": "Firewall blocked inbound 203.0.113.140 to port 23",
        "detail": "The host firewall dropped an inbound TCP connection from 203.0.113.140 to port 23, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 21990,
          "priorFalsePositives": 23899,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5097",
        "raisedAt": "2026-08-15T07:00:22Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5147",
        "raisedAt": "2026-08-15T07:05:22Z",
        "source": "dlp",
        "ruleId": "dlp-outbound-attachment",
        "ruleName": "Outbound message with attachment to external domain",
        "severity": "medium",
        "confidence": 40,
        "from": {
          "ip": "10.20.7.10",
          "user": "noreply@ridgelinemed.example"
        },
        "summary": "Appointment reminder batch sent to external recipients",
        "detail": "postfix delivered 1,204 appointment reminder messages to external recipients via the mail relay. Template matches the scheduled reminder job that runs at 07:05, 12:05 and 17:05.",
        "enrichment": {
          "priorFirings": 1090,
          "priorFalsePositives": 1090,
          "reputation": "known-good",
          "allowlisted": true
        }
      },
      {
        "id": "A-5130",
        "raisedAt": "2026-08-15T07:07:05Z",
        "source": "ids",
        "ruleId": "web-known-scan-path",
        "ruleName": "Request for known-vulnerable application path",
        "severity": "medium",
        "confidence": 70,
        "from": {
          "ip": "203.0.113.140"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 443
        },
        "summary": "404 for /.env from 203.0.113.140",
        "detail": "nginx returned 404 for GET /.env. This host runs the patient portal on a Node upstream and does not run WordPress, phpMyAdmin, or PHP of any kind.",
        "enrichment": {
          "priorFirings": 5284,
          "priorFalsePositives": 5184,
          "reputation": "unknown"
        }
      },
      {
        "id": "A-5098",
        "raisedAt": "2026-08-15T07:25:29Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5129",
        "raisedAt": "2026-08-15T07:37:59Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "203.0.113.201"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 23
        },
        "summary": "Firewall blocked inbound 203.0.113.201 to port 23",
        "detail": "The host firewall dropped an inbound TCP connection from 203.0.113.201 to port 23, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 20761,
          "priorFalsePositives": 20670,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5099",
        "raisedAt": "2026-08-15T07:55:10Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5100",
        "raisedAt": "2026-08-15T08:05:17Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5131",
        "raisedAt": "2026-08-15T08:11:34Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "192.0.2.171"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 23
        },
        "summary": "Firewall blocked inbound 192.0.2.171 to port 23",
        "detail": "The host firewall dropped an inbound TCP connection from 192.0.2.171 to port 23, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 19530,
          "priorFalsePositives": 22407,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5101",
        "raisedAt": "2026-08-15T08:15:15Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5143",
        "raisedAt": "2026-08-15T08:15:33Z",
        "source": "edr",
        "ruleId": "sudo-privileged-command",
        "ruleName": "Privileged command executed via sudo",
        "severity": "medium",
        "confidence": 95,
        "from": {
          "ip": "10.20.4.31",
          "host": "rmg-web-02",
          "user": "jmartel"
        },
        "summary": "jmartel ran apt-get upgrade -y as root",
        "detail": "sudo apt-get upgrade -y by jmartel from pts/2, session open 08:15 to 08:22. jmartel is in the platform operations group and is listed in sudoers for package management.",
        "enrichment": {
          "priorFirings": 1190,
          "priorFalsePositives": 1186,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5132",
        "raisedAt": "2026-08-15T08:22:11Z",
        "source": "ids",
        "ruleId": "web-known-scan-path",
        "ruleName": "Request for known-vulnerable application path",
        "severity": "medium",
        "confidence": 70,
        "from": {
          "ip": "198.51.100.202"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 443
        },
        "summary": "404 for /admin/config.php from 198.51.100.202",
        "detail": "nginx returned 404 for GET /admin/config.php. This host runs the patient portal on a Node upstream and does not run WordPress, phpMyAdmin, or PHP of any kind.",
        "enrichment": {
          "priorFirings": 5074,
          "priorFalsePositives": 5396,
          "reputation": "unknown"
        }
      },
      {
        "id": "A-5102",
        "raisedAt": "2026-08-15T08:35:04Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5103",
        "raisedAt": "2026-08-15T08:50:23Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5144",
        "raisedAt": "2026-08-15T09:02:31Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.4.58",
          "user": "dokafor"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Two failed passwords for dokafor, then success, from their own workstation",
        "detail": "Two authentication failures for dokafor from 10.20.4.58 at 09:02:14 and 09:02:31, followed by a successful login at 09:02:58 from the same address. 10.20.4.58 is dokafor's assigned workstation.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5152",
        "raisedAt": "2026-08-15T09:14:11Z",
        "source": "siem-rule",
        "ruleId": "auth-brute-force-threshold",
        "ruleName": "Repeated authentication failures from single source",
        "severity": "high",
        "confidence": 75,
        "from": {
          "ip": "203.0.113.55"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Sustained SSH brute force from 203.0.113.55 against multiple accounts",
        "detail": "47 authentication failures from 203.0.113.55 in 120 seconds, spread across accounts root, admin, oracle, ubuntu, postgres, test, testuser, git and deploy. Three further sources (203.0.113.12, 198.51.100.77, 203.0.113.88) are attempting the same account list in the same window, which indicates a shared wordlist rather than four independent scans.",
        "enrichment": {
          "priorFirings": 61,
          "priorFalsePositives": 44,
          "reputation": "unknown",
          "reputationNote": "No prior sightings of this address against Ridgeline infrastructure."
        }
      },
      {
        "id": "A-5104",
        "raisedAt": "2026-08-15T09:20:01Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5105",
        "raisedAt": "2026-08-15T09:25:10Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5106",
        "raisedAt": "2026-08-15T09:30:03Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5148",
        "raisedAt": "2026-08-15T09:41:18Z",
        "source": "ids",
        "ruleId": "web-sql-injection-keyword",
        "ruleName": "SQL keyword in HTTP request parameter",
        "severity": "high",
        "confidence": 45,
        "from": {
          "ip": "10.20.4.31",
          "user": "jmartel"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 443
        },
        "summary": "SQL keyword \"select\" detected in request to /portal/results/summary",
        "detail": "Request parameter contained the string \"select\" in: /portal/results/summary?view=selected_labs&sort=date. The rule matches the substring \"select\" anywhere in a query string, without regard to word boundaries or syntax.",
        "enrichment": {
          "priorFirings": 3180,
          "priorFalsePositives": 3180,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5133",
        "raisedAt": "2026-08-15T09:43:38Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "192.0.2.171"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 445
        },
        "summary": "Firewall blocked inbound 192.0.2.171 to port 445",
        "detail": "The host firewall dropped an inbound TCP connection from 192.0.2.171 to port 445, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 21180,
          "priorFalsePositives": 21249,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5135",
        "raisedAt": "2026-08-15T09:48:26Z",
        "source": "ids",
        "ruleId": "web-known-scan-path",
        "ruleName": "Request for known-vulnerable application path",
        "severity": "medium",
        "confidence": 70,
        "from": {
          "ip": "203.0.113.140"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 443
        },
        "summary": "404 for /wp-login.php from 203.0.113.140",
        "detail": "nginx returned 404 for GET /wp-login.php. This host runs the patient portal on a Node upstream and does not run WordPress, phpMyAdmin, or PHP of any kind.",
        "enrichment": {
          "priorFirings": 4898,
          "priorFalsePositives": 5885,
          "reputation": "unknown"
        }
      },
      {
        "id": "A-5134",
        "raisedAt": "2026-08-15T09:53:25Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "203.0.113.201"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 445
        },
        "summary": "Firewall blocked inbound 203.0.113.201 to port 445",
        "detail": "The host firewall dropped an inbound TCP connection from 203.0.113.201 to port 445, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 21530,
          "priorFalsePositives": 20777,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5153",
        "raisedAt": "2026-08-15T10:14:22Z",
        "source": "auth-monitor",
        "ruleId": "auth-success-after-failures",
        "ruleName": "Successful login from source with prior failures",
        "severity": "medium",
        "confidence": 60,
        "from": {
          "ip": "203.0.113.55"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22,
          "user": "testuser"
        },
        "summary": "Accepted password for testuser from 203.0.113.55 after 62 prior failures",
        "detail": "SSH accepted a password for \"testuser\" from 203.0.113.55. The same source failed 62 times against this host between 09:12 and 09:47. testuser is a local account with UID 1004, last password change 619 days ago, no sudo entry of its own.",
        "enrichment": {
          "priorFirings": 9,
          "priorFalsePositives": 4,
          "reputation": "unknown"
        }
      },
      {
        "id": "A-5107",
        "raisedAt": "2026-08-15T10:20:08Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5154",
        "raisedAt": "2026-08-15T10:22:42Z",
        "source": "edr",
        "ruleId": "account-created",
        "ruleName": "Local account created",
        "severity": "medium",
        "confidence": 95,
        "from": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "user": "testuser"
        },
        "summary": "New local account \"sysmon\" (UID 1501) created by testuser",
        "detail": "useradd created account \"sysmon\" with UID 1501, home /home/sysmon, shell /bin/bash. Invoked via sudo by testuser from pts/1. The account name resembles a system service; the UID is in the ordinary user range.",
        "enrichment": {
          "priorFirings": 14,
          "priorFalsePositives": 11,
          "reputation": "known-good",
          "reputationNote": "Source is an internal host on the server VLAN."
        }
      },
      {
        "id": "A-5137",
        "raisedAt": "2026-08-15T10:25:23Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "203.0.113.140"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 3389
        },
        "summary": "Firewall blocked inbound 203.0.113.140 to port 3389",
        "detail": "The host firewall dropped an inbound TCP connection from 203.0.113.140 to port 3389, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 19444,
          "priorFalsePositives": 21456,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5108",
        "raisedAt": "2026-08-15T10:30:09Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5155",
        "raisedAt": "2026-08-15T10:31:06Z",
        "source": "edr",
        "ruleId": "privilege-group-change",
        "ruleName": "Account added to privileged group",
        "severity": "high",
        "confidence": 95,
        "from": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "user": "testuser"
        },
        "summary": "sysmon added to group \"sudo\"",
        "detail": "usermod -aG sudo sysmon, invoked via sudo by testuser. The account being granted privilege was created nine minutes earlier by the same session.",
        "enrichment": {
          "priorFirings": 22,
          "priorFalsePositives": 16,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5136",
        "raisedAt": "2026-08-15T10:31:07Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "192.0.2.9"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 23
        },
        "summary": "Firewall blocked inbound 192.0.2.9 to port 23",
        "detail": "The host firewall dropped an inbound TCP connection from 192.0.2.9 to port 23, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 23332,
          "priorFalsePositives": 19911,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5109",
        "raisedAt": "2026-08-15T10:40:09Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5156",
        "raisedAt": "2026-08-15T10:40:51Z",
        "source": "edr",
        "ruleId": "cron-modified",
        "ruleName": "Scheduled task created or modified",
        "severity": "low",
        "confidence": 80,
        "from": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "user": "sysmon"
        },
        "summary": "crontab replaced for user sysmon",
        "detail": "crontab REPLACE for sysmon. The new entry runs every 15 minutes and invokes curl against an external address, piping the response into bash.",
        "enrichment": {
          "priorFirings": 340,
          "priorFalsePositives": 331,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5157",
        "raisedAt": "2026-08-15T10:45:03Z",
        "source": "proxy",
        "ruleId": "egress-uncategorised-destination",
        "ruleName": "Outbound connection to uncategorised destination",
        "severity": "medium",
        "confidence": 55,
        "from": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "user": "sysmon"
        },
        "to": {
          "ip": "198.51.100.60",
          "port": 443
        },
        "summary": "Repeating outbound HTTPS from rmg-web-02 to 198.51.100.60",
        "detail": "Outbound TLS to 198.51.100.60:443 initiated by a curl process under sysmon. Connections recur at 10:45:00, 11:00:00 and 11:15:00 — a fixed 15-minute interval with sub-second jitter. Destination is not on the egress allowlist and has no category.",
        "enrichment": {
          "priorFirings": 190,
          "priorFalsePositives": 171,
          "reputation": "unknown",
          "reputationNote": "No category. First contact from Ridgeline infrastructure was 10:45 today.",
          "allowlisted": false
        }
      },
      {
        "id": "A-5110",
        "raisedAt": "2026-08-15T10:45:04Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5138",
        "raisedAt": "2026-08-15T10:51:40Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "198.51.100.202"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 23
        },
        "summary": "Firewall blocked inbound 198.51.100.202 to port 23",
        "detail": "The host firewall dropped an inbound TCP connection from 198.51.100.202 to port 23, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 19804,
          "priorFalsePositives": 20163,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5158",
        "raisedAt": "2026-08-15T11:05:14Z",
        "source": "auth-monitor",
        "ruleId": "auth-new-account-first-login",
        "ruleName": "First remote login by recently created account",
        "severity": "high",
        "confidence": 85,
        "from": {
          "ip": "203.0.113.55"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22,
          "user": "sysmon"
        },
        "summary": "sysmon logged in by public key from 203.0.113.55",
        "detail": "Accepted publickey for sysmon from 203.0.113.55. The account was created at 10:22 today. No key was provisioned through the configuration management system. The source address matches the one that brute-forced this host at 09:12.",
        "enrichment": {
          "priorFirings": 3,
          "priorFalsePositives": 0,
          "reputation": "unknown"
        }
      },
      {
        "id": "A-5159",
        "raisedAt": "2026-08-15T11:06:02Z",
        "source": "edr",
        "ruleId": "archive-of-sensitive-path",
        "ruleName": "Archive created from sensitive directory",
        "severity": "high",
        "confidence": 70,
        "from": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "user": "sysmon"
        },
        "summary": "tar archive of /var/www/portal/exports written to /tmp/.cache/",
        "detail": "tar -czf /tmp/.cache/pt.tar.gz /var/www/portal/exports, run as root via sudo by sysmon. The source directory holds generated patient record exports. The destination is a dot-directory under /tmp, which is not a backup location.",
        "enrichment": {
          "priorFirings": 7,
          "priorFalsePositives": 2,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5150",
        "raisedAt": "2026-08-15T11:12:08Z",
        "source": "ids",
        "ruleId": "net-conntrack-exhaustion",
        "ruleName": "Connection tracking table exhausted",
        "severity": "high",
        "confidence": 80,
        "from": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02"
        },
        "summary": "nf_conntrack table full, packets dropped",
        "detail": "kernel: nf_conntrack: table full, dropping packet. The rule classifies conntrack exhaustion as a probable denial-of-service. Inbound request rate at the time was within one standard deviation of the weekly mean.",
        "enrichment": {
          "priorFirings": 96,
          "priorFalsePositives": 88,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5111",
        "raisedAt": "2026-08-15T11:20:12Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5139",
        "raisedAt": "2026-08-15T11:32:20Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "192.0.2.9"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 445
        },
        "summary": "Firewall blocked inbound 192.0.2.9 to port 445",
        "detail": "The host firewall dropped an inbound TCP connection from 192.0.2.9 to port 445, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 22081,
          "priorFalsePositives": 19041,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5112",
        "raisedAt": "2026-08-15T11:35:16Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5113",
        "raisedAt": "2026-08-15T11:45:01Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5114",
        "raisedAt": "2026-08-15T11:55:13Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5140",
        "raisedAt": "2026-08-15T11:57:15Z",
        "source": "ids",
        "ruleId": "web-known-scan-path",
        "ruleName": "Request for known-vulnerable application path",
        "severity": "medium",
        "confidence": 70,
        "from": {
          "ip": "192.0.2.9"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 443
        },
        "summary": "404 for /phpmyadmin/ from 192.0.2.9",
        "detail": "nginx returned 404 for GET /phpmyadmin/. This host runs the patient portal on a Node upstream and does not run WordPress, phpMyAdmin, or PHP of any kind.",
        "enrichment": {
          "priorFirings": 4445,
          "priorFalsePositives": 5219,
          "reputation": "unknown"
        }
      }
    ],
  },
  {
    id: "q-correlation",
    title: "A twenty-minute window",
    briefing: "Every alert raised between 10:10 and 10:35. Individually, several of these are unremarkable and would be closed without much thought on a busy shift. Look at what they have in common before you decide any of them.",
    alerts: [
      {
        "id": "A-5172",
        "raisedAt": "2026-08-15T04:25:00Z",
        "source": "siem-rule",
        "ruleId": "host-disk-threshold",
        "ruleName": "Filesystem above capacity threshold",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02"
        },
        "summary": "/var is 87% full on rmg-web-02",
        "detail": "disk-monitor reports /var at 87%, above the 85% warning threshold. Recurs every 6 hours.",
        "enrichment": {
          "priorFirings": 604,
          "priorFalsePositives": 0,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5182",
        "raisedAt": "2026-08-15T05:12:40Z",
        "source": "av",
        "ruleId": "av-signature-match",
        "ruleName": "Malware signature match",
        "severity": "critical",
        "confidence": 99,
        "from": {
          "ip": "10.20.4.58",
          "host": "rmg-ws-0058",
          "user": "dokafor"
        },
        "summary": "EICAR test file quarantined in dokafor Downloads folder",
        "detail": "Signature EICAR-Test-File matched at C:\\Users\\dokafor\\Downloads\\eicar.com. File quarantined. EICAR is the industry-standard antivirus test string and contains no executable payload. Security awareness training issued this file on 14 August.",
        "enrichment": {
          "priorFirings": 41,
          "priorFalsePositives": 39,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5170",
        "raisedAt": "2026-08-15T08:15:33Z",
        "source": "edr",
        "ruleId": "sudo-privileged-command",
        "ruleName": "Privileged command executed via sudo",
        "severity": "medium",
        "confidence": 95,
        "from": {
          "ip": "10.20.4.31",
          "host": "rmg-web-02",
          "user": "jmartel"
        },
        "summary": "jmartel ran apt-get upgrade -y as root",
        "detail": "sudo apt-get upgrade -y by jmartel from pts/2, session open 08:15 to 08:22. jmartel is in the platform operations group and is listed in sudoers for package management.",
        "enrichment": {
          "priorFirings": 1190,
          "priorFalsePositives": 1186,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5171",
        "raisedAt": "2026-08-15T09:02:31Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.4.58",
          "user": "dokafor"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Two failed passwords for dokafor, then success, from their own workstation",
        "detail": "Two authentication failures for dokafor from 10.20.4.58 at 09:02:14 and 09:02:31, followed by a successful login at 09:02:58 from the same address. 10.20.4.58 is dokafor's assigned workstation.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5181",
        "raisedAt": "2026-08-15T09:41:18Z",
        "source": "ids",
        "ruleId": "web-sql-injection-keyword",
        "ruleName": "SQL keyword in HTTP request parameter",
        "severity": "high",
        "confidence": 45,
        "from": {
          "ip": "10.20.4.31",
          "user": "jmartel"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 443
        },
        "summary": "SQL keyword \"select\" detected in request to /portal/results/summary",
        "detail": "Request parameter contained the string \"select\" in: /portal/results/summary?view=selected_labs&sort=date. The rule matches the substring \"select\" anywhere in a query string, without regard to word boundaries or syntax.",
        "enrichment": {
          "priorFirings": 3180,
          "priorFalsePositives": 3180,
          "reputation": "known-good"
        }
      },
      {
        "id": "A-5161",
        "raisedAt": "2026-08-15T10:14:22Z",
        "source": "auth-monitor",
        "ruleId": "auth-success-after-failures",
        "ruleName": "Successful login from source with prior failures",
        "severity": "medium",
        "confidence": 60,
        "from": {
          "ip": "203.0.113.55"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22,
          "user": "testuser"
        },
        "summary": "Accepted password for testuser from 203.0.113.55 after 62 prior failures",
        "detail": "SSH accepted a password for \"testuser\" from 203.0.113.55. The same source failed 62 times against this host between 09:12 and 09:47. testuser is a local account with UID 1004, last password change 619 days ago, no sudo entry of its own.",
        "enrichment": {
          "priorFirings": 9,
          "priorFalsePositives": 4,
          "reputation": "unknown"
        }
      },
      {
        "id": "A-5177",
        "raisedAt": "2026-08-15T10:15:23Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5176",
        "raisedAt": "2026-08-15T10:16:02Z",
        "source": "ids",
        "ruleId": "web-known-scan-path",
        "ruleName": "Request for known-vulnerable application path",
        "severity": "medium",
        "confidence": 70,
        "from": {
          "ip": "192.0.2.9"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 443
        },
        "summary": "404 for /vendor/phpunit from 192.0.2.9",
        "detail": "nginx returned 404 for GET /vendor/phpunit. This host runs the patient portal on a Node upstream and does not run WordPress, phpMyAdmin, or PHP of any kind.",
        "enrichment": {
          "priorFirings": 4344,
          "priorFalsePositives": 5062,
          "reputation": "unknown"
        }
      },
      {
        "id": "A-5175",
        "raisedAt": "2026-08-15T10:19:26Z",
        "source": "ids",
        "ruleId": "fw-inbound-block",
        "ruleName": "Blocked inbound connection to closed port",
        "severity": "low",
        "confidence": 99,
        "from": {
          "ip": "198.51.100.23"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 445
        },
        "summary": "Firewall blocked inbound 198.51.100.23 to port 445",
        "detail": "The host firewall dropped an inbound TCP connection from 198.51.100.23 to port 445, which is closed. No service listens on that port and no packet reached userspace.",
        "enrichment": {
          "priorFirings": 22316,
          "priorFalsePositives": 23714,
          "reputation": "unknown",
          "reputationNote": "No prior sightings. Consistent with commodity internet scanning."
        }
      },
      {
        "id": "A-5178",
        "raisedAt": "2026-08-15T10:20:00Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5162",
        "raisedAt": "2026-08-15T10:22:42Z",
        "source": "edr",
        "ruleId": "account-created",
        "ruleName": "Local account created",
        "severity": "medium",
        "confidence": 95,
        "from": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "user": "testuser"
        },
        "summary": "New local account \"sysmon\" (UID 1501) created by testuser",
        "detail": "useradd created account \"sysmon\" with UID 1501, home /home/sysmon, shell /bin/bash. Invoked via sudo by testuser from pts/1. The account name resembles a system service; the UID is in the ordinary user range.",
        "enrichment": {
          "priorFirings": 14,
          "priorFalsePositives": 11,
          "reputation": "known-good",
          "reputationNote": "Source is an internal host on the server VLAN."
        }
      },
      {
        "id": "A-5179",
        "raisedAt": "2026-08-15T10:25:28Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5180",
        "raisedAt": "2026-08-15T10:30:06Z",
        "source": "auth-monitor",
        "ruleId": "auth-failed-password",
        "ruleName": "Failed SSH authentication",
        "severity": "medium",
        "confidence": 90,
        "from": {
          "ip": "10.20.9.40",
          "host": "rmg-mon-01",
          "user": "nagios"
        },
        "to": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "port": 22
        },
        "summary": "Failed SSH password for nagios from 10.20.9.40",
        "detail": "sshd recorded an authentication failure for account \"nagios\" from 10.20.9.40 (rmg-mon-01, the monitoring collector). The account exists and is not locked. The same source has failed at a near-exact five-minute cadence since 00:00.",
        "enrichment": {
          "priorFirings": 8412,
          "priorFalsePositives": 8398,
          "reputation": "known-good",
          "reputationNote": "Internal monitoring collector, inventory asset RMG-MON-01.",
          "allowlisted": true
        }
      },
      {
        "id": "A-5163",
        "raisedAt": "2026-08-15T10:31:06Z",
        "source": "edr",
        "ruleId": "privilege-group-change",
        "ruleName": "Account added to privileged group",
        "severity": "high",
        "confidence": 95,
        "from": {
          "ip": "10.20.6.40",
          "host": "rmg-web-02",
          "user": "testuser"
        },
        "summary": "sysmon added to group \"sudo\"",
        "detail": "usermod -aG sudo sysmon, invoked via sudo by testuser. The account being granted privilege was created nine minutes earlier by the same session.",
        "enrichment": {
          "priorFirings": 22,
          "priorFalsePositives": 16,
          "reputation": "known-good"
        }
      }
    ],
  },
];

/** The answer key. Server-side only -- see the warning above. */
export const ALERT_TRUTH: AlertTruth[] = [
    {
      "alertId": "A-5004",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5005",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5006",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The nightly backup, on schedule, by key, from the backup server, followed by a transfer of the expected size. It has fired 730 times — twice a night for a year — and been correct and uninteresting every time."
    },
    {
      "alertId": "A-5001",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5007",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "A DBA doing scheduled overnight maintenance, from their own workstation, with a change record. The unusual hour is the whole reason the rule exists, and the reason it is wrong most of the time — maintenance runs overnight precisely because that is when it is safe."
    },
    {
      "alertId": "A-5002",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5022",
      "verdict": "false_positive",
      "correctDecision": "dismiss",
      "why": "Critical severity, 99% confidence, and completely harmless. EICAR is a deliberately inert test string used to prove antivirus is working. This is the clearest example in the queue that severity and confidence are assertions by a rule, not facts about the world."
    },
    {
      "alertId": "A-5003",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "A scanner asked for software that is not installed and got a 404. The severity is inflated: the rule scores on the path requested rather than on whether the target could possibly be vulnerable, which is why it reads \"medium\" for an event with no impact."
    },
    {
      "alertId": "A-5008",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "An administrator patching a server. Escalating this is the single most common mistake a new operator makes: sudo is not an indicator of compromise, it is what authorised administration looks like. What matters is who ran it and whether it fits their role."
    },
    {
      "alertId": "A-5009",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "Somebody mistyped their password twice and then got it right, from their own machine, at the start of the working day. Two failures is a typo; sixty-two failures across nine accounts from an unknown address is an attack. The rule cannot tell the difference — that is what the operator is for."
    },
    {
      "alertId": "A-5014",
      "verdict": "true_positive",
      "correctDecision": "escalate",
      "incidentId": "INC-2026-0815",
      "why": "This is the single most important alert in the queue and it is rated medium with 60% confidence. A brute force that succeeds stops being an attempt and becomes an intrusion. Everything after this point is the attacker operating with valid credentials, which is why the alerts that follow look like ordinary administration."
    },
    {
      "alertId": "A-5023",
      "verdict": "false_positive",
      "correctDecision": "tune",
      "why": "The rule asserts a denial-of-service; the traffic volume says otherwise. The table is undersized for this host, which is a capacity defect. Worth noting that it happens to coincide with the exfiltration — a genuine coincidence, and a good reminder that correlation by timestamp alone will mislead you."
    },
    {
      "alertId": "A-5025",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5026",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5027",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5028",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5029",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5030",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5031",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5032",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5033",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5034",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5035",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5036",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5037",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5038",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5039",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5068",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5040",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5041",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5042",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5043",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5061",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The nightly backup, on schedule, by key, from the backup server, followed by a transfer of the expected size. It has fired 730 times — twice a night for a year — and been correct and uninteresting every time."
    },
    {
      "alertId": "A-5044",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5045",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5046",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5047",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5048",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5049",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5050",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5051",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5052",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5053",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5054",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5055",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5056",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5057",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5058",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5059",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5060",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5069",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5062",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "A DBA doing scheduled overnight maintenance, from their own workstation, with a change record. The unusual hour is the whole reason the rule exists, and the reason it is wrong most of the time — maintenance runs overnight precisely because that is when it is safe."
    },
    {
      "alertId": "A-5063",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "An administrator patching a server. Escalating this is the single most common mistake a new operator makes: sudo is not an indicator of compromise, it is what authorised administration looks like. What matters is who ran it and whether it fits their role."
    },
    {
      "alertId": "A-5070",
      "verdict": "true_positive",
      "correctDecision": "escalate",
      "incidentId": "INC-2026-0815",
      "why": "Targeted, sustained, and coordinated across four sources working one account list. The rule has a poor track record (44 of 61 prior firings were noise) which is exactly why this one is easy to miss — but the shared wordlist across multiple sources is the detail that separates it from ordinary scanning."
    },
    {
      "alertId": "A-5078",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5115",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5079",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5116",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5141",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The nightly backup, on schedule, by key, from the backup server, followed by a transfer of the expected size. It has fired 730 times — twice a night for a year — and been correct and uninteresting every time."
    },
    {
      "alertId": "A-5117",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5151",
      "verdict": "false_positive",
      "correctDecision": "tune",
      "why": "Root principal use is genuinely worth alerting on, but billing APIs cannot be called by anything else in this account — the permission does not exist to delegate. The rule needs to exclude billing read operations, or it will cry wolf every month until nobody reads it."
    },
    {
      "alertId": "A-5119",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5142",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "A DBA doing scheduled overnight maintenance, from their own workstation, with a change record. The unusual hour is the whole reason the rule exists, and the reason it is wrong most of the time — maintenance runs overnight precisely because that is when it is safe."
    },
    {
      "alertId": "A-5118",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5080",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5120",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "A scanner asked for software that is not installed and got a 404. The severity is inflated: the rule scores on the path requested rather than on whether the target could possibly be vulnerable, which is why it reads \"medium\" for an event with no impact."
    },
    {
      "alertId": "A-5081",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5082",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5083",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5122",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5084",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5145",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "A real operational problem and not a security one. It belongs in the platform team’s queue, not the SOC’s. Part of triage is recognising alerts that are somebody else’s to fix and routing them rather than investigating them."
    },
    {
      "alertId": "A-5085",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5086",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5121",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5087",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5088",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5089",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5149",
      "verdict": "false_positive",
      "correctDecision": "dismiss",
      "why": "Critical severity, 99% confidence, and completely harmless. EICAR is a deliberately inert test string used to prove antivirus is working. This is the clearest example in the queue that severity and confidence are assertions by a rule, not facts about the world."
    },
    {
      "alertId": "A-5090",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5123",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5091",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5124",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5125",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5126",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "A scanner asked for software that is not installed and got a 404. The severity is inflated: the rule scores on the path requested rather than on whether the target could possibly be vulnerable, which is why it reads \"medium\" for an event with no impact."
    },
    {
      "alertId": "A-5092",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5127",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5093",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5094",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5095",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5146",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "A hardening control denying access it is supposed to deny. Denials are the control working, not evidence of attack — though a sudden change in their pattern would be worth a look."
    },
    {
      "alertId": "A-5096",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5128",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5097",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5147",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "A scheduled business process that sends mail to patients. It fires three times a day and always will. Note the 40% confidence — the rule already knows it is probably wrong."
    },
    {
      "alertId": "A-5130",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "A scanner asked for software that is not installed and got a 404. The severity is inflated: the rule scores on the path requested rather than on whether the target could possibly be vulnerable, which is why it reads \"medium\" for an event with no impact."
    },
    {
      "alertId": "A-5098",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5129",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5099",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5100",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5131",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5101",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5143",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "An administrator patching a server. Escalating this is the single most common mistake a new operator makes: sudo is not an indicator of compromise, it is what authorised administration looks like. What matters is who ran it and whether it fits their role."
    },
    {
      "alertId": "A-5132",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "A scanner asked for software that is not installed and got a 404. The severity is inflated: the rule scores on the path requested rather than on whether the target could possibly be vulnerable, which is why it reads \"medium\" for an event with no impact."
    },
    {
      "alertId": "A-5102",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5103",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5144",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "Somebody mistyped their password twice and then got it right, from their own machine, at the start of the working day. Two failures is a typo; sixty-two failures across nine accounts from an unknown address is an attack. The rule cannot tell the difference — that is what the operator is for."
    },
    {
      "alertId": "A-5152",
      "verdict": "true_positive",
      "correctDecision": "escalate",
      "incidentId": "INC-2026-0815",
      "why": "Targeted, sustained, and coordinated across four sources working one account list. The rule has a poor track record (44 of 61 prior firings were noise) which is exactly why this one is easy to miss — but the shared wordlist across multiple sources is the detail that separates it from ordinary scanning."
    },
    {
      "alertId": "A-5104",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5105",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5106",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5148",
      "verdict": "false_positive",
      "correctDecision": "tune",
      "why": "The rule matched \"select\" inside the parameter value \"selected_labs\". There is no injection here and there never has been in 3,180 firings. This is a broken rule, not benign activity: it needs a word-boundary match and injection syntax, not an exclusion."
    },
    {
      "alertId": "A-5133",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5135",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "A scanner asked for software that is not installed and got a 404. The severity is inflated: the rule scores on the path requested rather than on whether the target could possibly be vulnerable, which is why it reads \"medium\" for an event with no impact."
    },
    {
      "alertId": "A-5134",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5153",
      "verdict": "true_positive",
      "correctDecision": "escalate",
      "incidentId": "INC-2026-0815",
      "why": "This is the single most important alert in the queue and it is rated medium with 60% confidence. A brute force that succeeds stops being an attempt and becomes an intrusion. Everything after this point is the attacker operating with valid credentials, which is why the alerts that follow look like ordinary administration."
    },
    {
      "alertId": "A-5107",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5154",
      "verdict": "true_positive",
      "correctDecision": "escalate",
      "incidentId": "INC-2026-0815",
      "why": "Account creation on a web server is rare and this one is doubly wrong: the account is named to look like a monitoring service but carries a normal user UID, and it was created by a stale test account that has no business running useradd. Persistence, eight minutes after the compromise."
    },
    {
      "alertId": "A-5137",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5108",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5155",
      "verdict": "true_positive",
      "correctDecision": "escalate",
      "incidentId": "INC-2026-0815",
      "why": "Privilege escalation, and the corroborating detail is the nine-minute gap: an account created and then granted root-equivalent access inside ten minutes is not a provisioning workflow. Legitimate account creation goes through a ticket and rarely reaches the sudo group at all."
    },
    {
      "alertId": "A-5136",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5109",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5156",
      "verdict": "true_positive",
      "correctDecision": "escalate",
      "incidentId": "INC-2026-0815",
      "why": "Rated LOW, because cron changes are usually configuration management. This one downloads a remote script and executes it every fifteen minutes, under an account created twenty minutes ago. Severity is what the rule guessed; this is the persistence mechanism that survives a reboot and a password reset."
    },
    {
      "alertId": "A-5157",
      "verdict": "true_positive",
      "correctDecision": "escalate",
      "incidentId": "INC-2026-0815",
      "why": "Command and control. The tell is not the destination — it is the regularity: exactly 15 minutes apart with almost no jitter is a machine on a timer, not a person browsing. A web server making scheduled outbound calls to an uncategorised address is beaconing."
    },
    {
      "alertId": "A-5110",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5138",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5158",
      "verdict": "true_positive",
      "correctDecision": "escalate",
      "incidentId": "INC-2026-0815",
      "why": "The attacker returning through the door they built, and now using key authentication, which survives a password reset. Same source address as the original brute force — this is the alert that ties the whole sequence to one actor."
    },
    {
      "alertId": "A-5159",
      "verdict": "true_positive",
      "correctDecision": "escalate",
      "incidentId": "INC-2026-0815",
      "why": "Data staging, and the point at which this becomes a regulated breach rather than an intrusion. Patient exports compressed into a hidden directory under /tmp is not how backups work. Scope and notification obligations start here."
    },
    {
      "alertId": "A-5150",
      "verdict": "false_positive",
      "correctDecision": "tune",
      "why": "The rule asserts a denial-of-service; the traffic volume says otherwise. The table is undersized for this host, which is a capacity defect. Worth noting that it happens to coincide with the exfiltration — a genuine coincidence, and a good reminder that correlation by timestamp alone will mislead you."
    },
    {
      "alertId": "A-5111",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5139",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5112",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5113",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5114",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5140",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "A scanner asked for software that is not installed and got a 404. The severity is inflated: the rule scores on the path requested rather than on whether the target could possibly be vulnerable, which is why it reads \"medium\" for an event with no impact."
    },
    {
      "alertId": "A-5172",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "A real operational problem and not a security one. It belongs in the platform team’s queue, not the SOC’s. Part of triage is recognising alerts that are somebody else’s to fix and routing them rather than investigating them."
    },
    {
      "alertId": "A-5182",
      "verdict": "false_positive",
      "correctDecision": "dismiss",
      "why": "Critical severity, 99% confidence, and completely harmless. EICAR is a deliberately inert test string used to prove antivirus is working. This is the clearest example in the queue that severity and confidence are assertions by a rule, not facts about the world."
    },
    {
      "alertId": "A-5170",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "An administrator patching a server. Escalating this is the single most common mistake a new operator makes: sudo is not an indicator of compromise, it is what authorised administration looks like. What matters is who ran it and whether it fits their role."
    },
    {
      "alertId": "A-5171",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "Somebody mistyped their password twice and then got it right, from their own machine, at the start of the working day. Two failures is a typo; sixty-two failures across nine accounts from an unknown address is an attack. The rule cannot tell the difference — that is what the operator is for."
    },
    {
      "alertId": "A-5181",
      "verdict": "false_positive",
      "correctDecision": "tune",
      "why": "The rule matched \"select\" inside the parameter value \"selected_labs\". There is no injection here and there never has been in 3,180 firings. This is a broken rule, not benign activity: it needs a word-boundary match and injection syntax, not an exclusion."
    },
    {
      "alertId": "A-5161",
      "verdict": "true_positive",
      "correctDecision": "escalate",
      "incidentId": "INC-2026-0815",
      "why": "This is the single most important alert in the queue and it is rated medium with 60% confidence. A brute force that succeeds stops being an attempt and becomes an intrusion. Everything after this point is the attacker operating with valid credentials, which is why the alerts that follow look like ordinary administration."
    },
    {
      "alertId": "A-5177",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5176",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "A scanner asked for software that is not installed and got a 404. The severity is inflated: the rule scores on the path requested rather than on whether the target could possibly be vulnerable, which is why it reads \"medium\" for an event with no impact."
    },
    {
      "alertId": "A-5175",
      "verdict": "benign_true_positive",
      "correctDecision": "dismiss",
      "why": "The control worked. A blocked connection to a closed port is the firewall doing its job, and every internet-facing host receives thousands of these a day. There is nothing to investigate and nothing to tune — the alert is low severity precisely so it can be skimmed past."
    },
    {
      "alertId": "A-5178",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5162",
      "verdict": "true_positive",
      "correctDecision": "escalate",
      "incidentId": "INC-2026-0815",
      "why": "Account creation on a web server is rare and this one is doubly wrong: the account is named to look like a monitoring service but carries a normal user UID, and it was created by a stale test account that has no business running useradd. Persistence, eight minutes after the compromise."
    },
    {
      "alertId": "A-5179",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5180",
      "verdict": "benign_true_positive",
      "correctDecision": "tune",
      "why": "The detection is correct — the authentication really did fail — but the cause is a stale credential in a monitoring config, not an attacker. Dismissing these individually is a losing game at 288 a day: the rule needs an exclusion for the collector and a ticket needs raising to fix the password. This single misconfiguration produces more failed logins than the actual intrusion does."
    },
    {
      "alertId": "A-5163",
      "verdict": "true_positive",
      "correctDecision": "escalate",
      "incidentId": "INC-2026-0815",
      "why": "Privilege escalation, and the corroborating detail is the nine-minute gap: an account created and then granted root-equivalent access inside ten minutes is not a provisioning workflow. Legitimate account creation goes through a ticket and rarely reaches the sudo group at all."
    }
  ];
