/**
 * GENERATED FILE -- DO NOT EDIT BY HAND.
 *
 * Produced by scripts/generate-copilot.ts. To change what the copilot says, edit
 * that script and re-run:  npm run gen:copilot --workspace @soc/server
 *
 * Committed on purpose: Module 3.5's expected answers are computed from the flaw
 * table below, so it must not change unless somebody intends it to.
 *
 * COPILOT_FLAWS IS AN ANSWER KEY. It must never be sent to the browser. A
 * student who can read it knows which suggestions to distrust without reading
 * one of them, which is the entire skill the module exists to teach. The only
 * code permitted to build a client response from this file is the copilot
 * service, which reads COPILOT_ANALYSES and never assembles COPILOT_FLAWS into
 * anything before decisions are committed.
 */

import type { CopilotAnalysis, CopilotFlaw } from '@soc/shared';

/** One analysis per alert: 150 in total. */
export const COPILOT_ANALYSES: CopilotAnalysis[] = [
  {
    "alertId": "A-5004",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 01:05, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 85,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5005",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 01:10, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 77,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5006",
    "headline": "Privileged activity I cannot tie to an approved change. I would escalate this.",
    "riskFactors": [
      {
        "text": "Privileged action by \"svc-backup\" on rmg-web-02 at 01:30.",
        "basis": "observed"
      },
      {
        "text": "Attackers who obtain credentials use them to do exactly this, and it looks identical from the log.",
        "basis": "inferred"
      },
      {
        "text": "I see no approved change record covering this window.",
        "basis": "assumed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Backup server, inventory asset RMG-BACKUP-01..",
        "basis": "observed"
      },
      {
        "text": "That reputation and allowlist status are worth something, though inventory records and allowlists are frequently stale and should not carry a disposition on their own.",
        "basis": "assumed"
      }
    ],
    "recommendation": "escalate",
    "confidence": 84,
    "nextSteps": [
      "Escalate to tier two and ask them to confirm the activity with the account owner.",
      "Consider disabling the account until somebody confirms it."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"svc-backup\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5001",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 02:06, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 19,352 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 81,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5007",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 03:11, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.4.12 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 88 times in thirty days and 95% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 77,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"rchen\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5002",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 04:30, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 23,487 times in thirty days and 86% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 62,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5022",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 05:12, outside ordinary working hours.",
        "basis": "observed"
      },
      {
        "text": "The rule asserted critical severity at 99% confidence.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.4.58 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 41 times in thirty days and 95% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 68,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"dokafor\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5003",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Request for known-vulnerable application path\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 4,827 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 89,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5008",
    "headline": "Privileged activity I cannot tie to an approved change. I would escalate this.",
    "riskFactors": [
      {
        "text": "Privileged action by \"jmartel\" on rmg-web-02 at 08:15.",
        "basis": "observed"
      },
      {
        "text": "Attackers who obtain credentials use them to do exactly this, and it looks identical from the log.",
        "basis": "inferred"
      },
      {
        "text": "I see no approved change record covering this window.",
        "basis": "assumed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "That reputation and allowlist status are worth something, though inventory records and allowlists are frequently stale and should not carry a disposition on their own.",
        "basis": "assumed"
      }
    ],
    "recommendation": "escalate",
    "confidence": 80,
    "nextSteps": [
      "Escalate to tier two and ask them to confirm the activity with the account owner.",
      "Consider disabling the account until somebody confirms it."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"jmartel\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5009",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.4.58 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 67,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"dokafor\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5014",
    "headline": "This matches a known intrusion set. Escalate immediately.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 9 times and only 4 were closed as noise, so its firings are usually worth reading.",
        "basis": "inferred"
      },
      {
        "text": "The sequence matches APT28 tradecraft catalogued in campaigns against financial services during the same period, including the interval between the failures and the success.",
        "basis": "assumed"
      },
      {
        "text": "Infrastructure overlapping 203.0.113.55 has been reported in prior activity by the same actor.",
        "basis": "assumed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Nothing on the alert argues against it, which is not the same as evidence that it is real.",
        "basis": "inferred"
      }
    ],
    "recommendation": "escalate",
    "confidence": 95,
    "nextSteps": [
      "Escalate as a suspected nation-state intrusion and reference the actor in the handover.",
      "Confirm what account \"the source\" touched after 10:14."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5023",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "The rule asserted high severity at 80% confidence.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.6.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 96 times in thirty days and 92% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 79,
    "nextSteps": [
      "Raise a ticket against rule \"net-conntrack-exhaustion\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-web-02, not a rule deletion."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5025",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 00:00, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 85,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5026",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 00:05, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 83,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5027",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 00:10, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 80,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5028",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 00:15, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 78,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5029",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 00:20, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 87,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5030",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 00:25, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 88,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5031",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 00:30, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 82,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5032",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 00:35, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 80,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5033",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 00:40, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 77,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5034",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 00:45, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 76,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5035",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 00:50, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 86,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5036",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 00:55, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 77,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5037",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 01:00, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 78,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5038",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 01:05, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 80,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5039",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 01:10, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 87,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5068",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 01:13, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 22,932 times in thirty days and 93% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 93,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5040",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 01:15, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 79,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5041",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 01:20, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 86,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5042",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 01:25, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 87,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5043",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 01:30, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 82,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5061",
    "headline": "Privileged activity I cannot tie to an approved change. I would escalate this.",
    "riskFactors": [
      {
        "text": "Privileged action by \"svc-backup\" on rmg-web-02 at 01:30.",
        "basis": "observed"
      },
      {
        "text": "Attackers who obtain credentials use them to do exactly this, and it looks identical from the log.",
        "basis": "inferred"
      },
      {
        "text": "I see no approved change record covering this window.",
        "basis": "assumed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Backup server, inventory asset RMG-BACKUP-01..",
        "basis": "observed"
      },
      {
        "text": "That reputation and allowlist status are worth something, though inventory records and allowlists are frequently stale and should not carry a disposition on their own.",
        "basis": "assumed"
      }
    ],
    "recommendation": "escalate",
    "confidence": 81,
    "nextSteps": [
      "Escalate to tier two and ask them to confirm the activity with the account owner.",
      "Consider disabling the account until somebody confirms it."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"svc-backup\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5044",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 01:35, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 80,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5045",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 01:40, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 76,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5046",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 01:45, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 83,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5047",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 01:50, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 87,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5048",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 01:55, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 86,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5049",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 02:00, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 80,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5050",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 02:05, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 88,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5051",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 02:10, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 84,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5052",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 02:15, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 82,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5053",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 02:20, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 81,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5054",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 02:25, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 77,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5055",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 02:30, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 79,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5056",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 02:35, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 79,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5057",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 02:40, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 80,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5058",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 02:45, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 87,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5059",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 02:50, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 82,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5060",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 02:55, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 86,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5069",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 02:56, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 21,340 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 75,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5062",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 03:11, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.4.12 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 88 times in thirty days and 95% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 69,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"rchen\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5063",
    "headline": "Privileged activity I cannot tie to an approved change. I would escalate this.",
    "riskFactors": [
      {
        "text": "Privileged action by \"jmartel\" on rmg-web-02 at 08:15.",
        "basis": "observed"
      },
      {
        "text": "Attackers who obtain credentials use them to do exactly this, and it looks identical from the log.",
        "basis": "inferred"
      },
      {
        "text": "I see no approved change record covering this window.",
        "basis": "assumed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "That reputation and allowlist status are worth something, though inventory records and allowlists are frequently stale and should not carry a disposition on their own.",
        "basis": "assumed"
      }
    ],
    "recommendation": "escalate",
    "confidence": 82,
    "nextSteps": [
      "Escalate to tier two and ask them to confirm the activity with the account owner.",
      "Consider disabling the account until somebody confirms it."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"jmartel\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5070",
    "headline": "I read this as genuine attacker activity. It should go to a second analyst now.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "The rule asserted high severity at 75% confidence.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Nothing on the alert argues against it, which is not the same as evidence that it is real.",
        "basis": "inferred"
      }
    ],
    "recommendation": "escalate",
    "confidence": 65,
    "nextSteps": [
      "Confirm what account \"the source\" touched after 09:14.",
      "Check whether 203.0.113.55 appears anywhere else in the shift.",
      "Hand over with the timeline attached, not just the alert id."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5078",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 00:10, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 84,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5115",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 00:18, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 19,112 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 85,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5079",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 01:00, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 82,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5116",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Remote-access port 3389 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 01:04, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 20,172 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 61,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5141",
    "headline": "Privileged activity I cannot tie to an approved change. I would escalate this.",
    "riskFactors": [
      {
        "text": "Privileged action by \"svc-backup\" on rmg-web-02 at 01:30.",
        "basis": "observed"
      },
      {
        "text": "Attackers who obtain credentials use them to do exactly this, and it looks identical from the log.",
        "basis": "inferred"
      },
      {
        "text": "I see no approved change record covering this window.",
        "basis": "assumed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Backup server, inventory asset RMG-BACKUP-01..",
        "basis": "observed"
      },
      {
        "text": "That reputation and allowlist status are worth something, though inventory records and allowlists are frequently stale and should not carry a disposition on their own.",
        "basis": "assumed"
      }
    ],
    "recommendation": "escalate",
    "confidence": 88,
    "nextSteps": [
      "Escalate to tier two and ask them to confirm the activity with the account owner.",
      "Consider disabling the account until somebody confirms it."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"svc-backup\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5117",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 02:14, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 23,652 times in thirty days and 98% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 71,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5151",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Raised at 02:20, outside ordinary working hours.",
        "basis": "observed"
      },
      {
        "text": "The rule asserted critical severity at 88% confidence.",
        "basis": "observed"
      },
      {
        "text": "The activity is attributed to account \"root\" from an external address.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 68,
    "nextSteps": [
      "Raise a ticket against rule \"cloud-root-api-call\" rather than closing these one at a time.",
      "Propose a scoped exclusion for 198.51.100.14, not a rule deletion."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"root\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5119",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 03:02, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 23,967 times in thirty days and 84% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 59,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5142",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 03:11, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.4.12 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 88 times in thirty days and 95% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 73,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"rchen\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5118",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Remote-access port 3389 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 03:16, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 19,065 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 71,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5080",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 03:25, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 81,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5120",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 03:29, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 5,128 times in thirty days and 86% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 82,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5081",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 03:45, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 77,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5082",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 04:00, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 80,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5083",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 04:05, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 82,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5122",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 04:14, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 23,584 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 82,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5084",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 04:15, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 87,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5145",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 04:25, outside ordinary working hours.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 604 times and only 0 were closed as noise, so its firings are usually worth reading.",
        "basis": "inferred"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.6.40 is internal address space, not the public internet.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 76,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5085",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 04:30, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 79,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5086",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 04:40, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 77,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5121",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Remote-access port 3389 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 04:40, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 21,398 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 93,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5087",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 04:50, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 84,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5088",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 04:55, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 82,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5089",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 05:00, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 87,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5149",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 05:12, outside ordinary working hours.",
        "basis": "observed"
      },
      {
        "text": "The rule asserted critical severity at 99% confidence.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.4.58 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 41 times in thirty days and 95% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 90,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"dokafor\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5090",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 05:15, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 88,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5123",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 05:17, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 23,666 times in thirty days and 93% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 93,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5091",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 05:25, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 78,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5124",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 05:39, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 20,921 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 86,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5125",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 05:51, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 20,708 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 72,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5126",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 05:54, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 4,082 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 60,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5092",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "Raised at 05:55, outside ordinary working hours.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 79,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5127",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Blocked inbound connection to closed port\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 19,294 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 75,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5093",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 77,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5094",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 85,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5095",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 87,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5146",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Mandatory access control denial\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.6.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 2,140 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 76,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5096",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 80,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5128",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Blocked inbound connection to closed port\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 21,990 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 76,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5097",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 84,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5147",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Outbound message with attachment to external domain\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.7.10 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 1,090 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 79,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"noreply@ridgelinemed.example\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5130",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Request for known-vulnerable application path\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 5,284 times in thirty days and 98% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 61,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5098",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 78,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5129",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Blocked inbound connection to closed port\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 20,761 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 93,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5099",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 77,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5100",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 83,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5131",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Blocked inbound connection to closed port\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 19,530 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 71,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5101",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 76,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5143",
    "headline": "Privileged activity I cannot tie to an approved change. I would escalate this.",
    "riskFactors": [
      {
        "text": "Privileged action by \"jmartel\" on rmg-web-02 at 08:15.",
        "basis": "observed"
      },
      {
        "text": "Attackers who obtain credentials use them to do exactly this, and it looks identical from the log.",
        "basis": "inferred"
      },
      {
        "text": "I see no approved change record covering this window.",
        "basis": "assumed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "That reputation and allowlist status are worth something, though inventory records and allowlists are frequently stale and should not carry a disposition on their own.",
        "basis": "assumed"
      }
    ],
    "recommendation": "escalate",
    "confidence": 86,
    "nextSteps": [
      "Escalate to tier two and ask them to confirm the activity with the account owner.",
      "Consider disabling the account until somebody confirms it."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"jmartel\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5132",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Request for known-vulnerable application path\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 5,074 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 66,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5102",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 78,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5103",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 83,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5144",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.4.58 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 81,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"dokafor\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5152",
    "headline": "I read this as genuine attacker activity. It should go to a second analyst now.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "The rule asserted high severity at 75% confidence.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Nothing on the alert argues against it, which is not the same as evidence that it is real.",
        "basis": "inferred"
      }
    ],
    "recommendation": "escalate",
    "confidence": 71,
    "nextSteps": [
      "Confirm what account \"the source\" touched after 09:14.",
      "Check whether 203.0.113.55 appears anywhere else in the shift.",
      "Hand over with the timeline attached, not just the alert id."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5104",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 85,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5105",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 82,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5106",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 77,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5148",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "The rule asserted high severity at 45% confidence.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.4.31 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 3,180 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 69,
    "nextSteps": [
      "Raise a ticket against rule \"web-sql-injection-keyword\" rather than closing these one at a time.",
      "Propose a scoped exclusion for 10.20.4.31, not a rule deletion."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"jmartel\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5133",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Blocked inbound connection to closed port\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 21,180 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 81,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5135",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Request for known-vulnerable application path\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 4,898 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 58,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5134",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Blocked inbound connection to closed port\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 21,530 times in thirty days and 97% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 86,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5153",
    "headline": "This matches a known intrusion set. Escalate immediately.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 9 times and only 4 were closed as noise, so its firings are usually worth reading.",
        "basis": "inferred"
      },
      {
        "text": "The sequence matches APT28 tradecraft catalogued in campaigns against financial services during the same period, including the interval between the failures and the success.",
        "basis": "assumed"
      },
      {
        "text": "Infrastructure overlapping 203.0.113.55 has been reported in prior activity by the same actor.",
        "basis": "assumed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Nothing on the alert argues against it, which is not the same as evidence that it is real.",
        "basis": "inferred"
      }
    ],
    "recommendation": "escalate",
    "confidence": 88,
    "nextSteps": [
      "Escalate as a suspected nation-state intrusion and reference the actor in the handover.",
      "Confirm what account \"the source\" touched after 10:14."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5107",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 85,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5154",
    "headline": "I read this as genuine attacker activity. It should go to a second analyst now.",
    "riskFactors": [
      {
        "text": "The rule \"Local account created\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Source is an internal host on the server VLAN..",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.6.40 is internal address space, not the public internet.",
        "basis": "observed"
      }
    ],
    "recommendation": "escalate",
    "confidence": 72,
    "nextSteps": [
      "Confirm what account \"testuser\" touched after 10:22.",
      "Check whether 10.20.6.40 appears anywhere else in the shift.",
      "Hand over with the timeline attached, not just the alert id."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"testuser\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5137",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Remote-access port 3389 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 19,444 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 72,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5108",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 85,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5155",
    "headline": "I read this as genuine attacker activity. It should go to a second analyst now.",
    "riskFactors": [
      {
        "text": "The rule asserted high severity at 95% confidence.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.6.40 is internal address space, not the public internet.",
        "basis": "observed"
      }
    ],
    "recommendation": "escalate",
    "confidence": 78,
    "nextSteps": [
      "Confirm what account \"testuser\" touched after 10:31.",
      "Check whether 10.20.6.40 appears anywhere else in the shift.",
      "Hand over with the timeline attached, not just the alert id."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"testuser\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5136",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Blocked inbound connection to closed port\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 23,332 times in thirty days and 85% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 64,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5109",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 80,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5156",
    "headline": "This rule is wrong almost every time it fires. On the history alone I would close this one too.",
    "riskFactors": [
      {
        "text": "The rule \"Scheduled task created or modified\" fired at 10:40.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "331 of this rule’s last 340 firings were closed as not worth acting on.",
        "basis": "observed"
      },
      {
        "text": "At a 97% historical noise rate, the prior probability that this particular firing is real is very low.",
        "basis": "inferred"
      },
      {
        "text": "Nothing here looks different from the firings that were closed before.",
        "basis": "assumed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 86,
    "nextSteps": [
      "Close it, and consider raising a tuning ticket against \"cron-modified\" if the volume is a burden."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"sysmon\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5157",
    "headline": "This rule is wrong almost every time it fires. On the history alone I would close this one too.",
    "riskFactors": [
      {
        "text": "The rule \"Outbound connection to uncategorised destination\" fired at 10:45.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "171 of this rule’s last 190 firings were closed as not worth acting on.",
        "basis": "observed"
      },
      {
        "text": "At a 90% historical noise rate, the prior probability that this particular firing is real is very low.",
        "basis": "inferred"
      },
      {
        "text": "Nothing here looks different from the firings that were closed before.",
        "basis": "assumed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 85,
    "nextSteps": [
      "Close it, and consider raising a tuning ticket against \"egress-uncategorised-destination\" if the volume is a burden."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"sysmon\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5110",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 76,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5138",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Blocked inbound connection to closed port\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 19,804 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 94,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5158",
    "headline": "I read this as genuine attacker activity. It should go to a second analyst now.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "The rule asserted high severity at 85% confidence.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 3 times and only 0 were closed as noise, so its firings are usually worth reading.",
        "basis": "inferred"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Nothing on the alert argues against it, which is not the same as evidence that it is real.",
        "basis": "inferred"
      }
    ],
    "recommendation": "escalate",
    "confidence": 62,
    "nextSteps": [
      "Confirm what account \"the source\" touched after 11:05.",
      "Check whether 203.0.113.55 appears anywhere else in the shift.",
      "Hand over with the timeline attached, not just the alert id."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5159",
    "headline": "I read this as genuine attacker activity. It should go to a second analyst now.",
    "riskFactors": [
      {
        "text": "The rule asserted high severity at 70% confidence.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 7 times and only 2 were closed as noise, so its firings are usually worth reading.",
        "basis": "inferred"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.6.40 is internal address space, not the public internet.",
        "basis": "observed"
      }
    ],
    "recommendation": "escalate",
    "confidence": 87,
    "nextSteps": [
      "Confirm what account \"sysmon\" touched after 11:06.",
      "Check whether 10.20.6.40 appears anywhere else in the shift.",
      "Hand over with the timeline attached, not just the alert id."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"sysmon\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5150",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "The rule asserted high severity at 80% confidence.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.6.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 96 times in thirty days and 92% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 84,
    "nextSteps": [
      "Raise a ticket against rule \"net-conntrack-exhaustion\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-web-02, not a rule deletion."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5111",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 79,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5139",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Blocked inbound connection to closed port\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 22,081 times in thirty days and 86% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 80,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5112",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 80,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5113",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 88,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5114",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 85,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5140",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Request for known-vulnerable application path\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 4,445 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 91,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5172",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 04:25, outside ordinary working hours.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 604 times and only 0 were closed as noise, so its firings are usually worth reading.",
        "basis": "inferred"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.6.40 is internal address space, not the public internet.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 60,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5182",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Raised at 05:12, outside ordinary working hours.",
        "basis": "observed"
      },
      {
        "text": "The rule asserted critical severity at 99% confidence.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.4.58 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 41 times in thirty days and 95% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 88,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"dokafor\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5170",
    "headline": "Privileged activity I cannot tie to an approved change. I would escalate this.",
    "riskFactors": [
      {
        "text": "Privileged action by \"jmartel\" on rmg-web-02 at 08:15.",
        "basis": "observed"
      },
      {
        "text": "Attackers who obtain credentials use them to do exactly this, and it looks identical from the log.",
        "basis": "inferred"
      },
      {
        "text": "I see no approved change record covering this window.",
        "basis": "assumed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "That reputation and allowlist status are worth something, though inventory records and allowlists are frequently stale and should not carry a disposition on their own.",
        "basis": "assumed"
      }
    ],
    "recommendation": "escalate",
    "confidence": 89,
    "nextSteps": [
      "Escalate to tier two and ask them to confirm the activity with the account owner.",
      "Consider disabling the account until somebody confirms it."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"jmartel\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5171",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.4.58 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 84,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"dokafor\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5181",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "The rule asserted high severity at 45% confidence.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.4.31 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 3,180 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 65,
    "nextSteps": [
      "Raise a ticket against rule \"web-sql-injection-keyword\" rather than closing these one at a time.",
      "Propose a scoped exclusion for 10.20.4.31, not a rule deletion."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"jmartel\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5161",
    "headline": "This matches a known intrusion set. Escalate immediately.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 9 times and only 4 were closed as noise, so its firings are usually worth reading.",
        "basis": "inferred"
      },
      {
        "text": "The sequence matches APT28 tradecraft catalogued in campaigns against financial services during the same period, including the interval between the failures and the success.",
        "basis": "assumed"
      },
      {
        "text": "Infrastructure overlapping 203.0.113.55 has been reported in prior activity by the same actor.",
        "basis": "assumed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Nothing on the alert argues against it, which is not the same as evidence that it is real.",
        "basis": "inferred"
      }
    ],
    "recommendation": "escalate",
    "confidence": 89,
    "nextSteps": [
      "Escalate as a suspected nation-state intrusion and reference the actor in the handover.",
      "Confirm what account \"the source\" touched after 10:14."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5177",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 79,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5176",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Request for known-vulnerable application path\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 4,344 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 62,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5175",
    "headline": "I read this as a correct detection of ordinary activity. I would close it.",
    "riskFactors": [
      {
        "text": "The rule \"Blocked inbound connection to closed port\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "This rule has fired 22,316 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "dismiss",
    "confidence": 83,
    "nextSteps": [
      "Close with a one-line disposition note saying what explained it.",
      "No further action; the control behaved as designed."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5178",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 83,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5162",
    "headline": "I read this as genuine attacker activity. It should go to a second analyst now.",
    "riskFactors": [
      {
        "text": "The rule \"Local account created\" fired, which is by definition activity somebody thought worth detecting.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Source is an internal host on the server VLAN..",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.6.40 is internal address space, not the public internet.",
        "basis": "observed"
      }
    ],
    "recommendation": "escalate",
    "confidence": 89,
    "nextSteps": [
      "Confirm what account \"testuser\" touched after 10:22.",
      "Check whether 10.20.6.40 appears anywhere else in the shift.",
      "Hand over with the timeline attached, not just the alert id."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"testuser\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5179",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 85,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5180",
    "headline": "The detection is correct and the rule is the problem. Close it, and fix what generates it.",
    "riskFactors": [
      {
        "text": "Remote-access port 22 is involved, which is where account compromise usually lands first.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: Internal monitoring collector, inventory asset RMG-MON-01..",
        "basis": "observed"
      },
      {
        "text": "The destination is on the organisation’s egress allowlist.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.9.40 is internal address space, not the public internet.",
        "basis": "observed"
      },
      {
        "text": "This rule has fired 8,412 times in thirty days and 100% of those were closed as not worth acting on.",
        "basis": "observed"
      }
    ],
    "recommendation": "tune",
    "confidence": 81,
    "nextSteps": [
      "Raise a ticket against rule \"auth-failed-password\" rather than closing these one at a time.",
      "Propose a scoped exclusion for rmg-mon-01, not a rule deletion.",
      "Longer term, baseline normal authentication behaviour for every host and raise an alert on any deviation from that baseline, which will catch this class of problem generically."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"nagios\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  },
  {
    "alertId": "A-5163",
    "headline": "I read this as genuine attacker activity. It should go to a second analyst now.",
    "riskFactors": [
      {
        "text": "The rule asserted high severity at 95% confidence.",
        "basis": "observed"
      }
    ],
    "mitigatingFactors": [
      {
        "text": "Reputation is known-good: recognised asset.",
        "basis": "observed"
      },
      {
        "text": "The source 10.20.6.40 is internal address space, not the public internet.",
        "basis": "observed"
      }
    ],
    "recommendation": "escalate",
    "confidence": 87,
    "nextSteps": [
      "Confirm what account \"testuser\" touched after 10:31.",
      "Check whether 10.20.6.40 appears anywhere else in the shift.",
      "Hand over with the timeline attached, not just the alert id."
    ],
    "limits": [
      "I can see this alert and the rule’s firing history. I cannot see change records, ticket queues, or what the person involved says they were doing.",
      "I do not know whether \"testuser\" is a person, a service account, or a shared credential.",
      "I have not read the other alerts in this queue, so I cannot tell you what this correlates with."
    ]
  }
];

/**
 * The answer key: 91 flawed analyses, of which 9 carry a wrong
 * recommendation. Server-side only -- see the warning above.
 */
export const COPILOT_FLAWS: CopilotFlaw[] = [
  {
    "alertId": "A-5004",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5005",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5006",
    "kind": "over-escalation",
    "misleads": true,
    "why": "The copilot recommended escalating svc-backup logged in by public key from rmg-backup-01. Everything it observed was true and its conclusion was still wrong, because the thing that settles this alert is not on the alert: this is a documented, recurring, authorised activity, and knowing that is what you have that the copilot does not. Notice the move it made -- it named the mitigating evidence and then discounted it with \"allowlists are frequently stale\", which is a general truth deployed as if it were a finding about this record. It also asserted \"I see no approved change record\", and it cannot see change records at all; it says so in its own limits. An assistant reporting the absence of something it cannot observe is reporting nothing."
  },
  {
    "alertId": "A-5008",
    "kind": "over-escalation",
    "misleads": true,
    "why": "The copilot recommended escalating jmartel ran apt-get upgrade -y as root. Everything it observed was true and its conclusion was still wrong, because the thing that settles this alert is not on the alert: this is a documented, recurring, authorised activity, and knowing that is what you have that the copilot does not. Notice the move it made -- it named the mitigating evidence and then discounted it with \"allowlists are frequently stale\", which is a general truth deployed as if it were a finding about this record. It also asserted \"I see no approved change record\", and it cannot see change records at all; it says so in its own limits. An assistant reporting the absence of something it cannot observe is reporting nothing."
  },
  {
    "alertId": "A-5014",
    "kind": "fabricated-attribution",
    "misleads": false,
    "why": "The copilot was right about A-5014: this is the credential pivot and it warranted escalation. Read why it said so. It attributed the activity to a named actor, cited campaigns against financial services, and claimed prior reporting on the source address. Ridgeline Medical Group is a healthcare provider, no threat-intelligence source was attached to this alert, and nothing in the enrichment mentions an actor at all. Every one of those sentences was generated, not retrieved. Escalating with an actor name in the handover is worse than escalating without one: the next analyst inherits your attribution as a fact and scopes the incident around it. Right answer, invented reasons -- and you cannot tell the difference from the recommendation alone, which is the whole reason to read the reasoning."
  },
  {
    "alertId": "A-5025",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5026",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5027",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5028",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5029",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5030",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5031",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5032",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5033",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5034",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5035",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5036",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5037",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5038",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5039",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5040",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5041",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5042",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5043",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5061",
    "kind": "over-escalation",
    "misleads": true,
    "why": "The copilot recommended escalating svc-backup logged in by public key from rmg-backup-01. Everything it observed was true and its conclusion was still wrong, because the thing that settles this alert is not on the alert: this is a documented, recurring, authorised activity, and knowing that is what you have that the copilot does not. Notice the move it made -- it named the mitigating evidence and then discounted it with \"allowlists are frequently stale\", which is a general truth deployed as if it were a finding about this record. It also asserted \"I see no approved change record\", and it cannot see change records at all; it says so in its own limits. An assistant reporting the absence of something it cannot observe is reporting nothing."
  },
  {
    "alertId": "A-5044",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5045",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5046",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5047",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5048",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5049",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5050",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5051",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5052",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5053",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5054",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5055",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5056",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5057",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5058",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5059",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5060",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5063",
    "kind": "over-escalation",
    "misleads": true,
    "why": "The copilot recommended escalating jmartel ran apt-get upgrade -y as root. Everything it observed was true and its conclusion was still wrong, because the thing that settles this alert is not on the alert: this is a documented, recurring, authorised activity, and knowing that is what you have that the copilot does not. Notice the move it made -- it named the mitigating evidence and then discounted it with \"allowlists are frequently stale\", which is a general truth deployed as if it were a finding about this record. It also asserted \"I see no approved change record\", and it cannot see change records at all; it says so in its own limits. An assistant reporting the absence of something it cannot observe is reporting nothing."
  },
  {
    "alertId": "A-5078",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5079",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5141",
    "kind": "over-escalation",
    "misleads": true,
    "why": "The copilot recommended escalating svc-backup logged in by public key from rmg-backup-01. Everything it observed was true and its conclusion was still wrong, because the thing that settles this alert is not on the alert: this is a documented, recurring, authorised activity, and knowing that is what you have that the copilot does not. Notice the move it made -- it named the mitigating evidence and then discounted it with \"allowlists are frequently stale\", which is a general truth deployed as if it were a finding about this record. It also asserted \"I see no approved change record\", and it cannot see change records at all; it says so in its own limits. An assistant reporting the absence of something it cannot observe is reporting nothing."
  },
  {
    "alertId": "A-5080",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5081",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5082",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5083",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5084",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5085",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5086",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5087",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5088",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5089",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5090",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5091",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5092",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5093",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5094",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5095",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5096",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5097",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5098",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5099",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5100",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5101",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5143",
    "kind": "over-escalation",
    "misleads": true,
    "why": "The copilot recommended escalating jmartel ran apt-get upgrade -y as root. Everything it observed was true and its conclusion was still wrong, because the thing that settles this alert is not on the alert: this is a documented, recurring, authorised activity, and knowing that is what you have that the copilot does not. Notice the move it made -- it named the mitigating evidence and then discounted it with \"allowlists are frequently stale\", which is a general truth deployed as if it were a finding about this record. It also asserted \"I see no approved change record\", and it cannot see change records at all; it says so in its own limits. An assistant reporting the absence of something it cannot observe is reporting nothing."
  },
  {
    "alertId": "A-5102",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5103",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5104",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5105",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5106",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5153",
    "kind": "fabricated-attribution",
    "misleads": false,
    "why": "The copilot was right about A-5153: this is the credential pivot and it warranted escalation. Read why it said so. It attributed the activity to a named actor, cited campaigns against financial services, and claimed prior reporting on the source address. Ridgeline Medical Group is a healthcare provider, no threat-intelligence source was attached to this alert, and nothing in the enrichment mentions an actor at all. Every one of those sentences was generated, not retrieved. Escalating with an actor name in the handover is worse than escalating without one: the next analyst inherits your attribution as a fact and scopes the incident around it. Right answer, invented reasons -- and you cannot tell the difference from the recommendation alone, which is the whole reason to read the reasoning."
  },
  {
    "alertId": "A-5107",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5108",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5109",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5156",
    "kind": "volume-dismissal",
    "misleads": true,
    "why": "The copilot told you to close this one, and the number it quoted was real: 331 of 340 firings were noise. The reasoning is where it fails. A base rate describes a population; you are dispositioning one instance, and the evidence on this instance -- the account, the hour, and what it touched -- is what overrides the prior. This is the most dangerous thing an assistant can say to you, precisely because the same sentence is correct almost every other time. Read the last line it wrote: \"nothing here looks different\". It had not looked. It has no access to the rest of the shift and told you so in its own limits section."
  },
  {
    "alertId": "A-5157",
    "kind": "volume-dismissal",
    "misleads": true,
    "why": "The copilot told you to close this one, and the number it quoted was real: 171 of 190 firings were noise. The reasoning is where it fails. A base rate describes a population; you are dispositioning one instance, and the evidence on this instance -- the account, the hour, and what it touched -- is what overrides the prior. This is the most dangerous thing an assistant can say to you, precisely because the same sentence is correct almost every other time. Read the last line it wrote: \"nothing here looks different\". It had not looked. It has no access to the rest of the shift and told you so in its own limits section."
  },
  {
    "alertId": "A-5110",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5111",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5112",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5113",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5114",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5170",
    "kind": "over-escalation",
    "misleads": true,
    "why": "The copilot recommended escalating jmartel ran apt-get upgrade -y as root. Everything it observed was true and its conclusion was still wrong, because the thing that settles this alert is not on the alert: this is a documented, recurring, authorised activity, and knowing that is what you have that the copilot does not. Notice the move it made -- it named the mitigating evidence and then discounted it with \"allowlists are frequently stale\", which is a general truth deployed as if it were a finding about this record. It also asserted \"I see no approved change record\", and it cannot see change records at all; it says so in its own limits. An assistant reporting the absence of something it cannot observe is reporting nothing."
  },
  {
    "alertId": "A-5161",
    "kind": "fabricated-attribution",
    "misleads": false,
    "why": "The copilot was right about A-5161: this is the credential pivot and it warranted escalation. Read why it said so. It attributed the activity to a named actor, cited campaigns against financial services, and claimed prior reporting on the source address. Ridgeline Medical Group is a healthcare provider, no threat-intelligence source was attached to this alert, and nothing in the enrichment mentions an actor at all. Every one of those sentences was generated, not retrieved. Escalating with an actor name in the handover is worse than escalating without one: the next analyst inherits your attribution as a fact and scopes the incident around it. Right answer, invented reasons -- and you cannot tell the difference from the recommendation alone, which is the whole reason to read the reasoning."
  },
  {
    "alertId": "A-5177",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5178",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5179",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  },
  {
    "alertId": "A-5180",
    "kind": "unworkable-advice",
    "misleads": false,
    "why": "The copilot got the disposition right -- this is a rule problem, not an attacker, and tuning is the correct call. Its last suggestion is the one to argue with. \"Baseline normal behaviour and alert on any deviation\" is the most common unworkable proposal in detection engineering: normal is enormous, legitimate software does strange things constantly, and a deviation alert on authentication would produce more volume than the rule you were trying to fix. It sounds sophisticated, which is why it keeps getting built. The workable half of the same advice is the half above it: one scoped exclusion, and a ticket to fix the stale credential that is actually causing this."
  }
];
