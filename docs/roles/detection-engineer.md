# Detection Engineer: role specification

Source specification, filed verbatim. Kept here because the lane profile, the
assessment items that route to it, and the track curriculum are all derived from
it, and a later edit to any of those should be checkable against what was
actually asked for.

**What is built from this today**

| Piece | State |
|---|---|
| `detection-engineering` career lane, scored by the Career Fit Analyzer | Done: `content/lanes.ts`, `assessment/items.ts` |
| Assessment routing (the "ASSESSMENT → DETECTION ENGINEER ROUTING" section) | Done: 20 items bear on the lane |
| Track curriculum matching the 12-week structure below | Outlined: `content/tracks.ts`, 66 planned exercises, no content written |
| Capability baseline coverage | Done: 18 capabilities tagged core/supporting for this lane |
| Rule editor, FP dashboard, effectiveness tester, coverage map | Not started. Needs a rule-evaluation engine on the server |
| Peer SOC and instructor-led sessions | Not started (Phase 3) |
| Pricing | Not modelled anywhere in the codebase |

---

## DETECTION ENGINEER: CORE CONCEPT

Detection Engineers write and tune the detection rules that create the alerts every other role investigates. It's the difference between reactive and proactive security.

In a normal SOC: someone compromises your network, you detect it, you respond.

With a Detection Engineer: you've already written rules that *will* catch that compromise, so your SOC Ops see it in minutes instead of days.

**The job in reality:**

- 40% writing new detection rules (based on threat intel, new attack patterns, customer needs)
- 30% tuning existing rules (false positives are killing us, lower the threshold)
- 20% testing rules on old logs (would we have caught that incident if we had this rule last month?)
- 10% researching new attack patterns and SIEM capabilities

---

## WHAT DETECTION ENGINEERS SEE

### Interface Components

**1. Rule Editor**

```
Rule Name: Brute Force SSH Attacks
Rule ID: DET-001-SSH-BRUTEFORCE
Type: Threshold-based
Status: Enabled | Tuning | Disabled

Query:
event_type = "auth" AND
result = "failed" AND
source_system = "ssh" AND
user = * AND
source_ip = *

Aggregation:
Group by: user, source_ip
Time window: 5 minutes
Threshold: 5 failed attempts = Alert

Severity: Medium
Category: Initial Access (MITRE T1110)
```

**2. False Positive Dashboard**

```
Rule: Brute Force SSH Attacks (DET-001)
False Positive Rate: 12% (was 18% last week, tuning working)

Common false positives:
- Admin user with typo: accounts for 6%
- CI/CD pipeline retries: accounts for 4%
- User forgot password: accounts for 2%

Recommendation: Add exclusion for [CI/CD service accounts]
Projected new FP rate: 8%
```

**3. Rule Effectiveness Tester**

```
Test this rule against historical data:
Select date range: [Aug 1 - Aug 31]

Run test...

Results:
- True positives: 3 (actual breaches we would have caught)
- False positives: 42 (noise we'd have to triage)
- False negatives: 0 (breaches we'd miss)
- Detection speed: avg 8 minutes from initial indicator
- Severity accuracy: 100% (correct severity assignment)

Recommendation: Rule is effective. Deploy.
```

**4. Detection Pipeline**

```
Raw events -> Normalization -> Enrichment -> Detection -> Alert

Detection rules fire here:
[Rule 001: Brute Force] -> MEDIUM alert
[Rule 042: Privilege Escalation] -> HIGH alert
[Rule 105: Data Exfiltration] -> CRITICAL alert

What happens next:
MEDIUM -> SOC Ops triage queue
HIGH -> Skip to investigator
CRITICAL -> Immediate escalation
```

**5. MITRE ATT&CK Coverage Map**

```
Select tactic: [Initial Access]

Detection coverage by technique:
T1110 Brute Force: 95% (excellent, 3 rules)
T1190 Exploit public-facing app: 40% (gap, only 1 rule)
T1200 Hardware additions: 0% (can't detect, skip)
T1566 Phishing: 60% (2 rules, need 1 more)

Coverage gaps to address this quarter:
- Web server exploitation (add 2 rules)
- Supply chain attacks (add 1 rule)
```

**6. Rule Performance Dashboard**

```
Rule | Alerts/Day | FP Rate | TP Rate | Avg Response Time | Status
DET-001 SSH Brute | 23 | 12% | 85% | 8min | Tune
DET-042 Priv Esc | 5 | 2% | 95% | 3min | Good
DET-105 Data Exfil | 2 | 0% | 100% | 1min | Excellent
```

**7. Rule Version Control**

```
Rule: DET-001-SSH-BRUTEFORCE
Current version: 3.2

History:
v3.2 (Aug 25) - Excluded CI/CD accounts, FP rate 18%->12%
v3.1 (Aug 10) - Raised threshold 3->5, FP rate 25%->18%
v3.0 (Jul 30) - Initial deployment
v2.1 (Jul 15) - Beta testing
v1.0 (Jul 1) - Design phase

Compare versions: [v3.2] vs [v3.1]
Rollback option: [Revert to v3.1]
```

### Enrichment Data Available

Detection Engineers can add context to rules:

- Threat intel lookups (is this IP known bad?)
- Historical context (have we seen this pattern before?)
- Asset tagging (is this a production server or test box?)
- User context (is this person supposed to be logging in at 3am?)

---

## DETECTION ENGINEER IN PEER SOC SESSIONS

**Before the incident starts:**

Detection Engineer gets a briefing: "We're simulating a brute force + lateral movement incident."

They can:

1. **Load existing rules** (rules that would normally catch this)
2. **Write new rules** during the incident (if they spot a detection gap)
3. **Tune rules** in real-time (SOC Op says "too many false positives," Detection Eng adjusts threshold)

**During the incident:**

**Scenario:** Attacker brute forces SSH, escalates, moves laterally.

**Timeline:**

- 10:15 - Attacker starts brute forcing SSH
- **Detection Eng rule fires:** "Brute Force SSH" alert (but it's buried in noise)
- 10:20 - SOC Op is triaging, says "I'm seeing 50 brute force alerts, mostly noise"
- 10:25 - Detection Eng realizes: "The real attack is different. It's coming from one IP but targeting 10 accounts. Let me write a rule for that."
- 10:30 - Detection Eng deploys new rule, SOC Op immediately sees the real attacker
- 10:35 - Attacker succeeds, Detection Eng gets an alert from privilege escalation rule
- 10:40 - Lateral movement happens, network analyzer sees C2 traffic
- 10:45 - Detection Eng writes a rule for the C2 beacon pattern
- 10:50 - IR Lead decides to isolate based on all this

**Detection Eng scoring:**

- Did they catch the attack pattern before manual investigation?
- How quickly did they write the new rule?
- Did their rule reduce false positives?
- Did their rules help other roles?

**Detection Eng can influence the incident in real time:**

- Write rules other roles can use to hunt
- Tune rules so SOC Op isn't overwhelmed
- Validate that rules work before deployment
- Explain *why* certain attacks generate alerts

---

## DETECTION ENGINEER EXERCISES (WEEK 1-12 TRACK)

### WEEK 1-2: SIEM BASICS (12 hours)

1. **"Understand your SIEM query language"** (4 hours)
   - Scenario: Write basic queries in your SIEM (Splunk/ELK/Sigma equivalent)
   - Teaches: Event structure, field extraction, filtering
   - Real work: SIEM syntax is your primary tool
   - Solution: Learn query syntax, run basic queries, extract events

2. **"Index the right events"** (4 hours)
   - Scenario: You have 5 TB of logs to index. What do you keep? What's noise?
   - Teaches: Understanding data retention, indexing strategy, cost vs coverage
   - Real work: You can't detect what you don't index
   - Solution: Index auth logs (critical), syslog (important), app logs (nice to have)

3. **"Understand data normalization"** (4 hours)
   - Scenario: Raw events from 10 different sources (Windows, Linux, app logs, proxy). Normalize them.
   - Teaches: Mapping different log sources to common field names
   - Real work: You can't correlate if fields don't align
   - Solution: Map `user` vs `username` vs `account`, `source_ip` vs `src`, etc.

### WEEK 3-4: DETECTION RULE BASICS (15 hours)

1. **"Write your first detection rule"** (5 hours)
   - Scenario: "Detect SSH brute force attacks." Write the rule from scratch.
   - Teaches: Threshold-based detection, aggregation, alert logic
   - Real work: Most detection rules are simple logic, you need to think clearly
   - Solution: Count failed auth attempts, group by user + IP, threshold = alert

2. **"Handle false positives in your rule"** (5 hours)
   - Scenario: Your brute force rule fires 50 times per day. 45 are a known CI/CD service. Fix it.
   - Teaches: Excluding legitimate activity, understanding your environment
   - Real work: False positive tuning is 50% of detection work
   - Solution: Whitelist the CI/CD service account, re-run rule, measure improvement

3. **"Test your rule on historical data"** (5 hours)
   - Scenario: You wrote a rule. Now run it against last month's logs. Would it have caught anything? False positives?
   - Teaches: Retrospective testing, validating rules before deployment
   - Real work: Never deploy untested rules
   - Solution: Run rule on Aug 1-31, review hits, validate each is real

### WEEK 5-7: ADVANCED DETECTION (18 hours)

1. **"Correlation rules: multiple events = incident"** (6 hours)
   - Scenario: One event is noise. But event A + event B + event C within 10 minutes = attack. Write the rule.
   - Teaches: Multi-stage detection, correlation logic
   - Real work: Real attacks have multiple indicators
   - Solution: Failed auth + process execution + network connection = rule fires

2. **"Behavioral detection: baseline vs anomaly"** (6 hours)
   - Scenario: Normal user logs in from Tokyo at 2am every night (legitimate, working hours). Attacker logs in from unknown IP at 3am. Detect only the attacker.
   - Teaches: Behavioral baselines, anomaly detection
   - Real work: Distinguishing compromise from legitimate unusual activity
   - Solution: Baseline user behavior, create rule that flags significant deviation only

3. **"Map MITRE ATT&CK to detection"** (6 hours)
   - Scenario: You know attackers use technique T1110 (Brute Force). Write rules to detect all the ways it manifests.
   - Teaches: Threat intelligence to detection mapping
   - Real work: Modern detection is organized around MITRE ATT&CK
   - Solution: Brute force via SSH, RDP, SMTP, etc. Write 4 rules covering all variants

### WEEK 8-10: DETECTION ENGINEERING (18 hours)

1. **"Hunt for detection gaps"** (6 hours)
   - Scenario: Incident happened last month. Your current rules didn't catch it. Find the gap. Write a rule to catch it next time.
   - Teaches: Learning from incidents, proactive detection improvement
   - Real work: Every incident reveals a gap
   - Solution: Analyze incident, identify the missed indicator, write rule, test on historical data

2. **"Tune false positives from an incident"** (6 hours)
   - Scenario: Incident was detected, but your rules generated 200 false positives during investigation. Reduce it.
   - Teaches: Understanding your environment, intelligent exclusions
   - Real work: Alert fatigue kills detection capability
   - Solution: Identify common false positive patterns, add targeted exclusions, re-test

3. **"Design a detection program for a threat actor"** (6 hours)
   - Scenario: Threat intel says APT28 is targeting your industry. Design a full detection program (5-10 rules covering their TTPs).
   - Teaches: Threat-driven detection, comprehensive coverage
   - Real work: You should be able to detect known adversaries
   - Solution: Map APT28 TTPs to your environment, write rules for initial access, persistence, lateral movement, exfiltration

### WEEK 11-12: DETECTION AT SCALE (12 hours)

1. **"Manage detection rules at scale"** (6 hours)
   - Scenario: You now have 100+ rules. How do you organize them? Version control? Testing?
   - Teaches: Rule lifecycle management, documentation, testing procedures
   - Real work: 100 rules is chaos without process
   - Solution: Organize by MITRE tactic, version each rule, test before deployment, retire unused rules

2. **"Explain your detection program to leadership"** (6 hours)
   - Scenario: Your CEO asks "What attacks can we detect? What can we not?" Write a report.
   - Teaches: Detection coverage assessment, communicating gaps
   - Real work: You need to know where you're vulnerable
   - Solution: Map your rules to MITRE ATT&CK, identify gaps, estimate effort to close them

---

## DETECTION ENGINEER IN INSTRUCTOR-LED SOC

**Instructor-led sessions where Detection Engineer is present:**

**Session 1: "Detection failures"**

- Incident happens, SOC Ops and analysts investigate
- Detection Engineer watches and notes: "Our rules would have caught this in 30 seconds. But they didn't. Why?"
- During debrief, Detection Eng presents a new rule based on what was missed
- Instructor validates the rule, discusses when/how to deploy it

**Session 2: "Rule tuning under pressure"**

- Incident is generating too many false positives
- Detection Engineer adjusts thresholds in real-time
- Other roles immediately see the impact (fewer alerts to triage)
- Instructor coaches on the trade-off: sensitivity vs specificity

**Session 3: "Threat-driven detection"**

- Threat intel analyst brings new threat actor info
- Detection Engineer immediately designs rules to catch that actor
- Tests rules on current incident data
- Validates rules are working

**Instructor feedback:**

- "Your rule logic was sound but the threshold was too low"
- "Great correlation rule. Now make it readable for other engineers"
- "This gap you found would have prevented the lateral movement"

---

## DETECTION ENGINEER PORTFOLIO

Portfolio shows:

1. **Rules written** (top 3-5 rules with explanation)

   ```
   Rule: APT28 Lateral Movement via WMI
   Purpose: Detect lateral movement technique T1047
   Coverage: Prevents mid-stage attack
   Effectiveness: 100% TP rate, 2% FP rate
   Status: Deployed to production
   ```

2. **False positive reduction** (before/after metrics)

   ```
   Brute Force Rule (DET-001)
   Initial FP rate: 25%
   After tuning: 8%
   Improvement: 68% reduction
   Method: Whitelisted known services, raised threshold
   ```

3. **Detection gaps closed** (incidents learned from)

   ```
   SolarWinds-style lateral movement
   Initial gap: Undetected for 8 hours
   Rule written: WMI remote execution + process spawn correlation
   Result: Would catch in 5 minutes if deployed
   Status: Deployed post-incident
   ```

4. **Coverage analysis** (MITRE ATT&CK heatmap)

   ```
   Tactic | Coverage | Rule Count | Gaps
   Initial Access | 90% | 5 | 1 rule for supply chain attacks
   Execution | 85% | 8 | 1 rule for scripting attacks
   Persistence | 70% | 6 | 3 rules for backdoor methods
   ```

5. **Incident contributions** (how your rules helped)

   ```
   Incident: MOVEit Exploitation (Aug 15)
   Your rules that fired:
   - Web exploitation attempt (caught at T1190)
   - Process creation from web service (caught at T1059)
   - Network callback to C2 (caught at T1071)
   Impact: Incident detected in 12 minutes instead of days
   ```

---

## DETECTION ENGINEER INTERACTIONS WITH OTHER ROLES

**With SOC Operator:**

- SOC Op triages alerts that Detection Eng rules created
- If too many false positives: SOC Op gives feedback, Detection Eng tunes
- If detection gaps: SOC Op says "I'm seeing attack X but no alert," Detection Eng writes rule

**With Log Analyst:**

- Log Analyst finds attack pattern in logs
- Detection Eng asks: "Do we have a rule for this?"
- If not: Detection Eng writes one, tests it retrospectively
- If yes: Detection Eng tunes it based on what Log Analyst found

**With Threat Intel:**

- Threat Intel says: "APT28 is using new C2 domain"
- Detection Eng asks: "How do we detect communication to that domain?"
- Threat Eng provides IOCs, Detection Eng writes rules
- Testing happens together

**With IR Lead:**

- During incident, IR Lead says: "We need containment in 5 minutes"
- Detection Eng says: "If I write a rule for this attack pattern, we catch it next time in 2 minutes"
- IR Lead approves, Detection Eng writes rule, tests it against current incident

**With Forensics:**

- Forensics says: "The attacker modified SSH configs like this"
- Detection Eng asks: "Can we detect that modification?"
- Writes rule to catch similar config changes in future

---

## DETECTION ENGINEER SCORING IN PEER/INSTRUCTOR SESSIONS

**Metrics:**

1. **Rule Quality**
   - Logic correctness (does it actually catch the attack?)
   - False positive rate (is it too noisy?)
   - Deployment readiness (is it documented, tested, ready to go?)
   - Score: 0-100

2. **Speed to Detection**
   - How quickly did their rules fire after attack started?
   - Did they write new rules during the incident or pre-incident?
   - Score: 0-100

3. **Coverage**
   - Did their rules cover multiple attack stages?
   - Did they catch indicators others found?
   - Did they identify attack patterns proactively?
   - Score: 0-100

4. **False Positive Management**
   - Started high, how much did they tune down?
   - Were exclusions smart or just blacklisting everything?
   - Score: 0-100

5. **Team Contribution**
   - Did their rules help other roles?
   - Did they respond to feedback from SOC Ops/analysts?
   - Did they collaborate with threat intel?
   - Score: 0-100

**Final score: average of the 5**

---

## DETECTION ENGINEER EXERCISES: REAL-WORLD SCENARIOS

### Exercise Set 1: "The Incident That Got Away"

**Setup:** You're given a real incident that happened but wasn't detected. You have the timeline and logs.

Example: "Attacker brute forced SSH, escalated privileges, installed persistence. Attack took 4 hours. Our rules didn't catch it."

**Your task:**

1. Identify where detection should have fired (but didn't)
2. Write rules to catch each stage
3. Test rules retrospectively on the incident logs
4. Estimate time to detection with your rules

**Scoring:**

- Did you write rules for all stages? (100 points max)
- Would your rules have caught it before escalation? (50 points if yes, 25 if late detection)
- False positive rate on 30 days of historical data? (deduct points for each FP)
- Final score: sum of above

---

### Exercise Set 2: "Threat Actor Coverage"

**Setup:** Threat intel says "Wizard Spider is active in our industry. Here's their TTP list."

**Your task:**

1. Map their 15 known techniques to your environment
2. Write rules covering as many as possible
3. Identify gaps (techniques you can't detect)
4. Prioritize which gaps to close first

**Scoring:**

- Coverage: rules written for X of Y techniques
- Quality: FP rate, TP rate, sensitivity
- Prioritization: does your gap prioritization make sense?

---

### Exercise Set 3: "False Positive Crisis"

**Setup:** Your brute force rule is firing 500 times per day. 480 are false positives. Your SOC is drowning.

**Your task:**

1. Analyze the false positives
2. Identify common patterns
3. Write intelligent exclusions (don't just blacklist everything)
4. Test new rule on 30 days of data
5. Target: fewer than 50 alerts per day

**Scoring:**

- FP reduction (started 480, ended at X)
- Sensitivity maintained (still catching real attacks)
- Intelligence of exclusions (smart tuning vs blanket blacklisting)

---

## PRICING FOR DETECTION ENGINEER

Detection Engineer sessions are high-value because they're teaching people to *prevent* attacks (not just respond to them).

**Peer SOC with Detection Engineer:**

- $20/month base subscription
- +$20 per session if Detection Engineer is included (one tier higher than SOC Ops at $15)
  - Rationale: Detection Eng brings advanced skills, helps entire team
  - Example: 4-person team with 1 Detection Eng = $15 x 3 + $20 x 1 = $65 session revenue

**Instructor-led with Detection Engineer:**

- Detection Engineer tracks available as separate instructor add-on
- $75/month for "Detection Engineering track" (vs $60 for standard SOC track)
- Same Tuesday/Thursday schedule but specialized scenarios

**Solo Detection Engineer path:**

- $20/month base (includes solo exercises)
- No extra cost (like other roles)

---

## ASSESSMENT → DETECTION ENGINEER ROUTING

Assessment questions identify Detection Engineer fit:

- Interest in *preventing* attacks vs responding
- Comfort with technical tooling and scripting
- Enjoys optimization and tuning
- Pattern-thinking (seeing across multiple events)
- Research-oriented

**Assessment feedback:**

"Your profile shows strong Detection Engineer traits. You think proactively, you're detail-oriented, and you enjoy building systems. Detection engineering is where you identify attacks before they mature: you're designing the early warning system.

Detection Engineers are rare in the market and highly paid. This is an advanced path (takes 12-16 weeks of focused study), but it leads directly to senior roles."

---

## DETECTION ENGINEER vs OTHER ROLES: QUICK COMPARISON

| Aspect | SOC Op | Log Analyst | Detection Eng | Threat Intel |
|--------|--------|------------|--------------|--------------|
| Reactive? | Yes (triage alerts) | Yes (analyze incidents) | No (proactive) | Somewhat (research) |
| Writes rules? | No | No | **Yes** | No |
| Deep technical? | No | High | **Very high** | High |
| Decision-making? | Fast | Methodical | Strategic | Long-term |
| Entry-level? | **Yes** | **Yes** | No (needs experience) | No |
| Speed of work | Fast | Slow | Medium | Slow |

---

**END DETECTION ENGINEER SPEC**
