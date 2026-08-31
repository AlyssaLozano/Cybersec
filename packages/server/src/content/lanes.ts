/**
 * The sixteen career lanes, profiled honestly.
 *
 * THE RULE FOR THIS FILE: NO MARKETING.
 *
 * Every lane here is described the way somebody doing the job would describe it
 * to a friend, including the parts that are tedious, unfair, or grinding. SOC
 * work without decent automation is miserable. Penetration testing is mostly
 * paperwork with a few good days. Risk work means being ignored until an audit.
 * A career-fit tool that hides this is worse than useless, because the person
 * finds out anyway: eighteen months in, after retraining.
 *
 * `dayToDay` should read like a timesheet, not a job advert.
 * `painPoints` should be the actual reasons people resign.
 * `baselineBurnout` is before the person's own profile is considered; the
 * scoring engine adjusts it using their pressure tolerance and structure needs.
 */

import type { LaneProfile } from '@soc/shared';

export const LANE_PROFILES: LaneProfile[] = [
  {
    id: 'soc-ops',
    title: 'SOC Operations',
    summary: 'Work the alert queue: triage what fired, decide what matters, escalate what does not resolve.',
    dayToDay: [
      'Pick up the queue from the previous shift and work through alerts in priority order.',
      'For each one: check the source, confirm whether the behaviour is normal for that host or user, close it or escalate it.',
      'Most alerts are nothing. A common day is eighty alerts and zero incidents.',
      'Document every decision, because somebody will ask why you closed it three weeks from now.',
      'Hand over cleanly at end of shift, including anything still open.',
    ],
    personalityMatch: [
      'You can be interrupted constantly without losing the thread',
      'Repetition does not grind you down: you can look at the ninetieth similar alert as carefully as the first',
      'You are comfortable making a call with incomplete information and moving on',
      'You would rather resolve many small things than one large thing',
    ],
    painPoints: [
      'Alert fatigue is the number one reason people leave. If the tuning is bad you will close the same false positive hundreds of times.',
      'Shift work at Tier 1 is common, including nights and weekends, and it is hard on sleep and relationships.',
      'You are measured on volume and speed, which fights against being thorough.',
      'Escalating too much makes you look weak; escalating too little gets you blamed. The line is rarely written down.',
      'At badly run shops it is a metrics treadmill with no path to anything better.',
    ],
    environmentFit: [
      { environmentId: 'corporate', rank: 1, note: 'Large corporate SOCs have defined tiers, real tooling, and a promotion path out of Tier 1. The best version of this job.' },
      { environmentId: 'government', rank: 2, note: 'Stable, well documented, and slower paced. Tooling may be dated and change takes months, but the hours and job security are better.' },
      { environmentId: 'consulting', rank: 3, note: 'MSSP work means monitoring many clients at once with shallow context on each. You learn breadth fast but rarely see an incident through.' },
    ],
    certPathway: ['sec-plus', 'btl1', 'cysa-plus', 'sc-200'],
    baselineBurnout: 'high',
    burnoutDrivers: ['Alert volume with poor tuning', 'Night shift rotation', 'Being measured on throughput rather than accuracy'],
    advancement: 'Tier 2 and 3, then usually a fork: detection engineering, incident response, or team lead. Staying at Tier 1 beyond two years is a warning sign about the employer, not about you.',
    trackId: 'soc',
    entryReality:
      'The most accessible entry point in security, and the one most likely to hire somebody with no security experience. Expect to start on shift.',
  },
  {
    id: 'detection-engineering',
    title: 'Detection Engineering',
    summary:
      'Write and tune the rules that produce everybody else’s alerts, and prove they catch what they claim to.',
    dayToDay: [
      'Write detection logic for a technique somebody has decided you should cover, then spend longer arguing about the threshold than writing the rule.',
      'Replay a new rule against last month’s logs to see what it would actually have fired on. Most rules die here, and that is the point.',
      'Work the tuning backlog: the SOC says a rule is unusable, so you find the benign cause and exclude it without blinding the rule.',
      'Fix parsing and field mappings. A rule pointed at a field that quietly stopped being populated fires never, and nothing tells you.',
      'Translate somebody else’s published incident into logic that would catch the same thing here, on the log sources you actually have.',
    ],
    personalityMatch: [
      'You would rather remove a class of alerts than close them one at a time',
      'You can hold a pattern across several events instead of judging each one alone',
      'You are comfortable writing queries and code, and reading somebody else’s',
      'You can live with "good enough" being a threshold you chose rather than a fact you found',
    ],
    painPoints: [
      'You are blamed in both directions. Too noisy and the SOC drowns; too quiet and something is missed. Both are your rule.',
      'Most of the work is tuning what already exists. Writing new detections is the small, interesting fraction of the week.',
      'A rule can stop working silently when a log source changes format or dies, and you usually find out during an incident.',
      'Your coverage map gets read by executives as a guarantee of what cannot happen, which is not what it says.',
      'You depend on log sources you do not own. Getting one field populated correctly can sit on another team’s roadmap for months.',
    ],
    environmentFit: [
      { environmentId: 'corporate', rank: 1, note: 'Where the role actually exists. Large enough to have outgrown vendor default rules, with the log volume and the alert pain to justify somebody full time.' },
      { environmentId: 'consulting', rank: 2, note: 'MSSPs write detections across many tenants, which builds breadth quickly. You tune for environments you never see and often never learn whether a rule worked.' },
      { environmentId: 'government', rank: 3, note: 'Stable, well resourced, and slow. Change control on a detection can take a review cycle, which fights the tune-measure-retune loop this job runs on.' },
    ],
    certPathway: ['sec-plus', 'cysa-plus', 'sc-200', 'gcih'],
    baselineBurnout: 'low',
    burnoutDrivers: [
      'Being accountable for alert volume and missed detections at the same time',
      'Depending on log sources and teams you do not control',
      'A tuning backlog that never empties',
    ],
    advancement:
      'Senior detection engineer, then detection lead, threat hunting, or security engineering. The work is unusually portable: rules and methodology transfer between employers in a way that knowledge of one company’s alert queue does not.',
    trackId: 'detection-engineering',
    entryReality:
      'Rarely a first security job, and anybody telling you otherwise is selling a course. The normal route is eighteen months to two years in a SOC first, because tuning a rule well requires knowing what the queue feels like at 3am. Data engineers and software developers moving across are the genuine exception.',
  },
  {
    id: 'incident-response',
    title: 'Incident Response',
    summary: 'When something is confirmed bad, you run it: scope it, contain it, get the business back up.',
    dayToDay: [
      'Long stretches of preparation (writing playbooks, running exercises, improving tooling) punctuated by intense multi-day incidents.',
      'During an incident: work out how far it spread, contain without destroying evidence, and brief people hourly.',
      'Manage a bridge call with twenty people on it, most of whom want a certain answer rather than a true one.',
      'Write the report afterwards. It will be read by executives, lawyers, and possibly a regulator.',
    ],
    personalityMatch: [
      'You get calmer as things get worse, not more agitated',
      'You can hold a complex picture in your head across many hours',
      'You can say "I do not know yet" to a senior person under pressure',
      'You are comfortable with your evening plans evaporating',
    ],
    painPoints: [
      'On-call is genuinely disruptive and the incidents do not respect weekends.',
      'The pressure during a real breach is unlike anything else: you are the one everyone is waiting on.',
      'You are often blamed for the state of an environment you did not build and were not funded to fix.',
      'Long quiet periods can feel like you are not contributing, right up until you very much are.',
    ],
    environmentFit: [
      { environmentId: 'consulting', rank: 1, note: 'IR retainer firms handle far more incidents than any single company, so you build experience fast. Expect travel and irregular hours.' },
      { environmentId: 'corporate', rank: 2, note: 'You know the environment deeply, which makes you effective, but you may only see a serious incident once or twice a year.' },
      { environmentId: 'government', rank: 3, note: 'Rigorous process and evidentiary standards, often with law enforcement involvement. Slower, more documented, and less improvisation.' },
    ],
    certPathway: ['sec-plus', 'gcih', 'btl1', 'gcfa'],
    baselineBurnout: 'high',
    burnoutDrivers: ['On-call rotation', 'High-stakes pressure with incomplete information', 'Carrying blame for underfunded environments'],
    advancement: 'IR lead, then either a management path running the function or a specialist path into forensics, threat hunting, or consulting at a much higher rate.',
    trackId: 'incident-response',
    entryReality:
      'Rarely a first security job. Most people arrive after a year or two in a SOC. Coming straight in from another career is possible but uncommon.',
  },
  {
    id: 'forensics',
    title: 'Digital Forensics',
    summary: 'Reconstruct exactly what happened from the artefacts, to a standard that survives a lawyer.',
    dayToDay: [
      'Image a disk or capture memory without altering the original, and document every step.',
      'Work through artefacts methodically: registry, filesystem timestamps, browser history, deleted files, memory structures.',
      'Build a timeline that is defensible line by line, where every claim points to a specific artefact.',
      'Write it up in language a court or a tribunal can follow. Occasionally testify.',
    ],
    personalityMatch: [
      'You are meticulous to a degree other people find excessive',
      'You genuinely enjoy slow, careful work with a definite answer at the end',
      'You will not state something you cannot evidence, even under pressure to do so',
      'Documentation feels like part of the work rather than an interruption to it',
    ],
    painPoints: [
      'The work is slow and can be tedious. One case can be weeks on the same disk image.',
      'Evidence handling rules are unforgiving; a procedural mistake can invalidate genuine findings.',
      'Cases can be distressing depending on the subject matter, particularly in law enforcement work.',
      'Being cross-examined on your methodology is uncomfortable and happens.',
    ],
    environmentFit: [
      { environmentId: 'government', rank: 1, note: 'Law enforcement and federal work is where the deepest forensics happens, with the strictest standards and the best training.' },
      { environmentId: 'consulting', rank: 2, note: 'Firms doing litigation support and breach investigation. Varied cases, billable-hour pressure.' },
      { environmentId: 'corporate', rank: 3, note: 'Only the largest companies staff dedicated forensics; usually it is part of a broader IR role.' },
    ],
    certPathway: ['sec-plus', 'gcfa', 'gcih'],
    baselineBurnout: 'medium',
    burnoutDrivers: ['Case backlog', 'Distressing case material', 'Procedural pressure where mistakes are unforgiving'],
    advancement: 'Senior examiner, then expert witness work or a lab management role. Highly specialised and hard to hire for, which protects your position.',
    trackId: 'incident-response',
    entryReality:
      'Specialised. Often entered from law enforcement, IR, or a digital forensics degree. The evidentiary discipline matters more than the technical depth.',
  },
  {
    id: 'threat-intel',
    title: 'Threat Intelligence',
    summary: 'Work out who is attacking, how they operate, and what your organisation should do differently.',
    dayToDay: [
      'Read. A lot. Vendor reporting, government advisories, forums, other people\'s incident write-ups.',
      'Track groups over time: cluster activity, map behaviour to ATT&CK, notice when something changes.',
      'Answer questions from the SOC and leadership: is this campaign relevant to us, and how would we know?',
      'Write assessments with explicit confidence levels, and defend them when challenged.',
    ],
    personalityMatch: [
      'You read constantly and retain what you read',
      'You enjoy connecting fragments into a picture',
      'You are disciplined about the difference between what you know and what you infer',
      'You write well and can hold a position under challenge',
    ],
    painPoints: [
      'It is easy to produce intelligence nobody uses. Relevance is a constant fight.',
      'Attribution is genuinely hard and you will be pushed to be more certain than the evidence allows.',
      'You are often far from the operational work, which can feel disconnected.',
      'Reading about attacks all day without ever stopping one is unsatisfying for some people.',
    ],
    environmentFit: [
      { environmentId: 'government', rank: 1, note: 'The deepest intelligence work, particularly with a clearance. Rigorous analytic standards and a formal tradecraft culture.' },
      { environmentId: 'corporate', rank: 2, note: 'Large enterprises run intel teams feeding their SOC. Practical and operationally connected.' },
      { environmentId: 'consulting', rank: 3, note: 'Vendor research teams producing public reporting. Good visibility and a strong personal brand, with pressure to publish.' },
    ],
    certPathway: ['sec-plus', 'gcih'],
    baselineBurnout: 'low',
    burnoutDrivers: ['Producing work nobody acts on', 'Pressure to overstate confidence'],
    advancement: 'Senior analyst, then intel lead or a specialist niche in a particular region or actor set. Transfers well into consulting and vendor research.',
    trackId: 'threat-intel',
    entryReality:
      'Strong fit for people arriving from journalism, academia, military intelligence, or library and research work. Writing ability matters more than technical depth.',
  },
  {
    id: 'pentest',
    title: 'Penetration Testing',
    summary: 'Attack systems with written permission, prove what could actually be done, and write it up so it gets fixed.',
    dayToDay: [
      'Scoping calls and rules of engagement before anything starts. Get this wrong and you are in legal trouble.',
      'The engagement itself: enumerate methodically, find a path, prove impact without breaking production.',
      'Take screenshots of everything as you go, because you will need them for the report.',
      'Write the report. This is a large part of the job and clients pay for it more than the hacking.',
      'Debrief the client, often to people who are defensive about what you found.',
    ],
    personalityMatch: [
      'You are persistent past the point most people give up',
      'You are creative within constraints rather than needing a free hand',
      'You can write clearly for a non-technical audience',
      'You are comfortable being the bearer of bad news, tactfully',
    ],
    painPoints: [
      'It is far more paperwork than people expect. Between engagements it is scoping, reporting, and admin.',
      'Repeat engagements at the same client find the same unfixed issues year after year.',
      'Scope constraints often stop you doing the interesting thing.',
      'The gap between the job\'s reputation and its reality causes a lot of early disillusionment.',
    ],
    environmentFit: [
      { environmentId: 'consulting', rank: 1, note: 'Where nearly all testing happens. New environment every few weeks, constant learning, billable-hour pressure and travel.' },
      { environmentId: 'corporate', rank: 2, note: 'Internal teams at very large companies. Deeper context, less variety, and you have to live with the people whose systems you break.' },
      { environmentId: 'government', rank: 3, note: 'Mostly cleared contractor work. Highly structured, rules-bound, and slower to start.' },
    ],
    certPathway: ['sec-plus', 'ejpt', 'pentest-plus', 'oscp'],
    baselineBurnout: 'medium',
    burnoutDrivers: ['Billable utilisation targets', 'Reporting workload', 'Finding the same issues repeatedly with nothing fixed'],
    advancement: 'Senior tester, then red team, specialist research, or practice lead. A strong route into independent consulting at high rates.',
    trackId: 'pentest',
    entryReality:
      'Hard to enter directly. Expect a long technical runway and a portfolio before anyone hires you. Rarely a first security job, and worth knowing that early.',
  },
  {
    id: 'red-team',
    title: 'Red Team',
    summary: 'Emulate a real adversary over weeks or months, without being detected, to test whether defence actually works.',
    dayToDay: [
      'Long campaigns rather than short engagements. Planning and infrastructure setup can take weeks before any action.',
      'Build and maintain tooling and command-and-control infrastructure that will not be caught.',
      'Move slowly and deliberately. Impatience gets you detected, which ends the exercise.',
      'Work closely with the blue team afterwards: the point is improving detection, not winning.',
    ],
    personalityMatch: [
      'You have patience measured in weeks',
      'You think about how defenders see things, constantly',
      'You can build tooling as well as use it',
      'Your ego survives being caught, and survives not being told you were clever',
    ],
    painPoints: [
      'The tradecraft bar is high and rising, and the tooling work is relentless.',
      'Findings are politically sensitive, since you are demonstrating that colleagues failed.',
      'Long campaigns mean long stretches with nothing to show, which is hard to explain to management.',
      'Small job market. Very few organisations genuinely need a red team.',
    ],
    environmentFit: [
      { environmentId: 'consulting', rank: 1, note: 'Specialist firms running red team engagements for large clients. Where most of these jobs are.' },
      { environmentId: 'corporate', rank: 2, note: 'Internal red teams exist at banks and major tech firms. Deep context and a genuine relationship with the blue team.' },
      { environmentId: 'government', rank: 3, note: 'Cleared work with serious capability, but heavily restricted and hard to enter.' },
    ],
    certPathway: ['sec-plus', 'oscp', 'osep'],
    baselineBurnout: 'medium',
    burnoutDrivers: ['Sustained secrecy and isolation', 'Political fallout from findings', 'Constant tooling maintenance'],
    advancement: 'Red team lead or adversary emulation specialist. Very small field, so reputation matters more than credentials.',
    entryReality:
      'Not an entry point. Almost everyone arrives after several years of penetration testing. Treat it as a destination rather than a start.',
  },
  {
    id: 'security-engineering',
    title: 'Security Engineering',
    summary: 'Build and run the controls: hardening, segmentation, logging pipelines, and the tooling everyone else depends on.',
    dayToDay: [
      'Design and deploy controls, then find out what they broke and fix that too.',
      'Automate things. Much of the job is writing code and configuration rather than clicking in consoles.',
      'Change windows, often out of hours, because you cannot reconfigure production at 2pm.',
      'Argue with other engineering teams about why the secure option is worth the friction.',
    ],
    personalityMatch: [
      'You want to fix the cause rather than handle the symptom',
      'You are comfortable writing code and reading documentation',
      'You can negotiate with engineers who see you as an obstacle',
      'You would rather build something once than answer the same alert repeatedly',
    ],
    painPoints: [
      'You are frequently the department of no, and it costs you goodwill.',
      'Legacy systems you cannot change but are accountable for.',
      'Out-of-hours change windows.',
      'Success is invisible. Nothing happening is the goal, and nobody thanks you for it.',
    ],
    environmentFit: [
      { environmentId: 'corporate', rank: 1, note: 'The natural home. Real budget, real systems, and a clear engineering career ladder.' },
      { environmentId: 'consulting', rank: 2, note: 'Implementation projects across many clients. Good variety, but you leave before living with the consequences.' },
      { environmentId: 'government', rank: 3, note: 'Stable and well documented, but change is slow and procurement can take a year.' },
    ],
    certPathway: ['sec-plus', 'az-500', 'cysa-plus', 'cissp'],
    baselineBurnout: 'low',
    burnoutDrivers: ['Being blocked by other teams', 'Accountability without authority', 'Out-of-hours changes'],
    advancement: 'Senior engineer, then security architect or engineering management. One of the strongest salary trajectories in the field.',
    trackId: 'security-engineering',
    entryReality: 'A natural transfer for system administrators and DevOps engineers. Prior infrastructure experience shortens this enormously.',
  },
  {
    id: 'network-security',
    title: 'Network Security',
    summary: 'Own the network view: firewalls, segmentation, and working out what a host is really talking to.',
    dayToDay: [
      'Firewall rule reviews, which is less glamorous and more important than it sounds.',
      'Read packet captures to settle arguments about what is actually happening on the wire.',
      'Design and defend segmentation boundaries, then handle the exception requests.',
      'Investigate traffic anomalies that turn out to be a misconfigured backup job nine times out of ten.',
    ],
    personalityMatch: [
      'You like concrete, verifiable answers: the packet either arrived or it did not',
      'You are systematic when troubleshooting rather than guessing',
      'You are comfortable saying no to exception requests, repeatedly',
      'You enjoy detail at a level most people find tedious',
    ],
    painPoints: [
      'Firewall rule bases accumulate decades of undocumented exceptions nobody will let you remove.',
      'You are blamed for every outage until proven otherwise.',
      'Cloud has moved a lot of this work elsewhere, so the field is narrowing.',
      'Change control can be glacial.',
    ],
    environmentFit: [
      { environmentId: 'corporate', rank: 1, note: 'Large estates with real network complexity. Where the depth is.' },
      { environmentId: 'government', rank: 2, note: 'Highly segmented environments with strict rules: genuinely interesting network design problems.' },
      { environmentId: 'consulting', rank: 3, note: 'Deployment and assessment projects. Broad exposure, shallower ownership.' },
    ],
    certPathway: ['net-plus', 'sec-plus', 'cysa-plus'],
    baselineBurnout: 'low',
    burnoutDrivers: ['Legacy rule bases', 'Being the default suspect for every outage'],
    advancement: 'Senior network security engineer, then architecture. Increasingly merges with cloud networking, which is worth planning for.',
    entryReality: 'A very direct transfer for anyone from network administration. Network+ or CCNA-level knowledge is close to a prerequisite.',
  },
  {
    id: 'cloud-security',
    title: 'Cloud Security',
    summary: 'Secure what runs in AWS, Azure, and GCP: identity, exposure, logging, and the misconfigurations that cause most breaches.',
    dayToDay: [
      'Review IAM policies and find the ones granting far more than anyone intended.',
      'Hunt for public storage, missing encryption, and absent logging across many accounts.',
      'Write infrastructure-as-code and policy-as-code so the fix sticks rather than being reapplied monthly.',
      'Keep up. The providers ship changes constantly and last year\'s guidance goes stale.',
    ],
    personalityMatch: [
      'You are comfortable with constant change and do not resent relearning things',
      'You think in systems and permissions rather than individual machines',
      'You can read and write code',
      'You are happy working through an API rather than a console',
    ],
    painPoints: [
      'The pace of change is relentless and genuinely tiring.',
      'Multi-account sprawl means you often do not know what exists.',
      'Developers can create risk faster than you can review it, and blocking them is not an option.',
      'Cost and security decisions constantly collide.',
    ],
    environmentFit: [
      { environmentId: 'corporate', rank: 1, note: 'Where cloud adoption is deepest and the budgets are. Strongest demand and pay.' },
      { environmentId: 'consulting', rank: 2, note: 'Assessment and migration projects across many clients. Very fast learning.' },
      { environmentId: 'government', rank: 3, note: 'FedRAMP and government regions make this specialised and slower, but it is a well-paid niche.' },
    ],
    certPathway: ['az-900', 'sec-plus', 'az-500', 'aws-security', 'ccsp'],
    baselineBurnout: 'medium',
    burnoutDrivers: ['Relentless pace of provider change', 'Reviewing faster than you can think', 'Being the bottleneck for delivery teams'],
    advancement: 'Senior cloud security engineer, then cloud security architect. Among the best-paid and most portable skill sets in security right now.',
    trackId: 'cloud-security',
    entryReality: 'Strong transfer from IT operations, DevOps, or sysadmin work. Cloud fundamentals matter more than security background at entry.',
  },
  {
    id: 'appsec',
    title: 'Application Security',
    summary: 'Find and prevent flaws in software: review code, threat model designs, and help developers ship securely.',
    dayToDay: [
      'Read other people\'s code looking for the flaw, often in a language you did not choose.',
      'Triage scanner output, most of which is false positives, and defend the ones that are not.',
      'Threat model new designs at the whiteboard, before anything is built.',
      'Persuade developers to change something they consider finished.',
    ],
    personalityMatch: [
      'You can read code fluently, including code written badly',
      'You think about how something fails rather than how it works',
      'You can influence people who do not report to you',
      'You are patient with the same mistake appearing repeatedly',
    ],
    painPoints: [
      'Scanner false positives consume an enormous share of the job.',
      'Developers resent security review, and you have to earn every inch of goodwill.',
      'You are measured on things you do not control: their code, their deadlines.',
      'Without a development background, the credibility gap is real and hard to close.',
    ],
    environmentFit: [
      { environmentId: 'corporate', rank: 1, note: 'Companies that build their own software. Where nearly all these jobs are.' },
      { environmentId: 'consulting', rank: 2, note: 'Code review and assessment engagements. Broad language exposure, shallow product context.' },
      { environmentId: 'government', rank: 3, note: 'Less common, since much software is procured rather than built, though secure development requirements are growing.' },
    ],
    certPathway: ['sec-plus', 'pentest-plus'],
    baselineBurnout: 'medium',
    burnoutDrivers: ['False positive triage', 'Adversarial relationship with engineering', 'Responsibility without authority'],
    advancement: 'Senior appsec engineer, then product security lead or security architecture. Excellent pay, particularly at software companies.',
    trackId: 'appsec',
    entryReality:
      'Close to requiring a software background. If you can already code, this is one of the fastest transfers into security available.',
  },
  {
    id: 'vuln-management',
    title: 'Vulnerability Management',
    summary: 'Find what is exposed, work out what actually matters, and drive it to fixed by people who do not report to you.',
    dayToDay: [
      'Run and tune scans, and maintain the asset inventory that makes them meaningful.',
      'Work through findings and separate genuine risk from the enormous volume of noise.',
      'Chase teams for remediation. A lot of the job is polite, persistent follow-up.',
      'Produce metrics for management showing whether the number is going down.',
    ],
    personalityMatch: [
      'You are organised and follow through without being reminded',
      'You are comfortable chasing people repeatedly without irritating them',
      'You can prioritise ruthlessly rather than treating everything as urgent',
      'Repetitive process work does not demoralise you',
    ],
    painPoints: [
      'You have responsibility for fixing things but no authority over the people who fix them.',
      'The backlog never reaches zero. It is a treadmill by design.',
      'Scanner noise and false positives erode your credibility with engineering teams.',
      'It is widely seen as unglamorous, and that perception affects how you are treated.',
    ],
    environmentFit: [
      { environmentId: 'corporate', rank: 1, note: 'Large estates need this function permanently. Reliable demand and a clear remit.' },
      { environmentId: 'government', rank: 2, note: 'Mandated remediation timelines give you real leverage that corporate peers lack. Documentation-heavy.' },
      { environmentId: 'consulting', rank: 3, note: 'Assessment work rather than ongoing management. You find things and leave.' },
    ],
    certPathway: ['sec-plus', 'cysa-plus'],
    baselineBurnout: 'medium',
    burnoutDrivers: ['Accountability without authority', 'A backlog that never ends', 'Being dismissed as a scan operator'],
    advancement: 'Programme lead, then risk management or security engineering. An underrated way in, because the demand is constant and the competition is light.',
    trackId: 'vuln-management',
    entryReality:
      'One of the most accessible entry points in security, and consistently hiring. Organisation and persistence matter more than technical depth.',
  },
  {
    id: 'iam',
    title: 'Identity and Access Management',
    summary: 'Own who can access what: joiners and leavers, single sign-on, multi-factor, and privileged access.',
    dayToDay: [
      'Process access requests and exceptions, and work out which ones are legitimate.',
      'Run access review campaigns, which means chasing managers to certify their teams.',
      'Configure and troubleshoot single sign-on integrations, which fail in obscure ways.',
      'Clean up orphaned accounts and standing privilege nobody remembers granting.',
    ],
    personalityMatch: [
      'You are precise and process-oriented',
      'You can hold a complex set of rules in your head without losing track',
      'You are comfortable saying no to senior people asking for access they should not have',
      'You find satisfaction in things being correct rather than exciting',
    ],
    painPoints: [
      'Access reviews are widely hated and you are the person enforcing them.',
      'Constant pressure from executives who want an exception to the rules they approved.',
      'Legacy identity systems are fragile and badly documented.',
      'The work is invisible until it fails, at which point it is very visible.',
    ],
    environmentFit: [
      { environmentId: 'corporate', rank: 1, note: 'Large enterprises run dedicated IAM teams with real budget. The clearest career path here.' },
      { environmentId: 'government', rank: 2, note: 'Smartcard and ICAM work is a specialised, well-paid niche with long-term stability.' },
      { environmentId: 'consulting', rank: 3, note: 'Implementation projects deploying identity platforms. Lucrative and travel-heavy.' },
    ],
    certPathway: ['sec-plus', 'sc-300', 'az-500'],
    baselineBurnout: 'low',
    burnoutDrivers: ['Access review fatigue', 'Executive pressure for exceptions', 'Invisible work'],
    advancement: 'IAM engineer, then identity architect or governance lead. Specialised enough that experienced people are genuinely hard to replace.',
    trackId: 'identity',
    entryReality:
      'One of the most reliable ways into security from an IT service desk background, because you already understand joiner-leaver processes.',
  },
  {
    id: 'risk-compliance',
    title: 'Risk Management and Compliance',
    summary: 'Decide what the organisation should worry about, prove the controls work, and get decisions made.',
    dayToDay: [
      'Interview people about how a process actually works, versus how the document says it works.',
      'Gather and test evidence that a control operates, then write up what you found.',
      'Maintain the risk register and argue about ratings with people who want theirs lowered.',
      'Sit in meetings. Many meetings. Then write the paper that goes to the board.',
    ],
    personalityMatch: [
      'You write clearly and enjoy it',
      'You are comfortable being the person asking uncomfortable questions',
      'You can hold a position under pressure from senior people',
      'You see systems and processes rather than individual technical details',
    ],
    painPoints: [
      'You are often ignored until an audit or an incident, then blamed for both.',
      'Compliance theatre is real, and being asked to produce it is demoralising.',
      'Technical colleagues may not take you seriously.',
      'The work can feel abstract and disconnected from anything concrete.',
    ],
    environmentFit: [
      { environmentId: 'government', rank: 1, note: 'Risk management IS the job in government, built around formal frameworks. Enormous, stable demand.' },
      { environmentId: 'corporate', rank: 2, note: 'Regulated industries (finance, healthcare, pharma) run substantial functions with clear progression.' },
      { environmentId: 'consulting', rank: 3, note: 'Advisory and audit work across many clients. Fast learning and strong exit options.' },
    ],
    certPathway: ['sec-plus', 'crisc', 'cisa', 'cism'],
    baselineBurnout: 'low',
    burnoutDrivers: ['Being ignored until something goes wrong', 'Producing compliance theatre', 'Lack of technical credibility'],
    advancement: 'Risk manager, then head of GRC or CISO. One of the more direct routes to security leadership, since it is closest to the business.',
    trackId: 'risk-governance',
    entryReality:
      'The most direct transfer for anyone from audit, legal, finance, or project management, and it needs no terminal work at all.',
  },
  {
    id: 'security-architecture',
    title: 'Security Architecture',
    summary: 'Design how security works across the whole organisation, then convince everyone to build it that way.',
    dayToDay: [
      'Review proposed designs and identify what will go wrong in three years.',
      'Write standards and reference architectures other teams are meant to follow.',
      'Sit between engineering, risk, and the business, translating in every direction.',
      'Make trade-off decisions with incomplete information and live with them for a long time.',
    ],
    personalityMatch: [
      'You think several years ahead rather than about this sprint',
      'You are comfortable with ambiguity and imperfect trade-offs',
      'You have enough breadth to be credible with specialists in several areas',
      'You can influence without authority, because you will have very little',
    ],
    painPoints: [
      'You have almost no direct authority and rely entirely on persuasion.',
      'Decisions are judged years later, often by people who were not there.',
      'You can become detached from hands-on work and lose technical credibility.',
      'Architecture documents that nobody reads or follows are a common and demoralising outcome.',
    ],
    environmentFit: [
      { environmentId: 'corporate', rank: 1, note: 'Large enough to need coherent architecture and to fund the role properly.' },
      { environmentId: 'government', rank: 2, note: 'Formal architecture practice tied to mandated frameworks. Slow but genuinely influential.' },
      { environmentId: 'consulting', rank: 3, note: 'Advisory work designing for clients. High rates, but you rarely see the design survive contact.' },
    ],
    certPathway: ['cissp', 'ccsp', 'az-500'],
    baselineBurnout: 'low',
    burnoutDrivers: ['Influence without authority', 'Designs that are never implemented', 'Drifting away from hands-on skill'],
    advancement: 'Principal architect, then CISO or independent consulting. A senior destination rather than a step.',
    entryReality:
      'Not an entry point under any circumstances. Expect eight to ten years across several other lanes first. Included here so you can see where a path leads.',
  },
  {
    id: 'ai-security',
    title: 'AI Security',
    summary:
      'Test the models an organisation has deployed, decide whether one is safe to put in front of a decision, and be the reason a launch slips.',
    dayToDay: [
      'Read a scoping document and work out which paths into the system nobody has tested. This is where most of the value is, and it happens before you send a payload.',
      'Send a few hundred payloads at a model and have almost all of them fail. Record what failed as carefully as what worked, because the negative result is half the report.',
      'Read training data. Actual rows of it, looking for labels that disagree with their content and for markers a supplier added. It is as tedious as it sounds and it catches what testing cannot.',
      'Write the finding up, argue about the severity with somebody whose launch date depends on the answer, and be right about it in a way they can check.',
      'Explain to a team that their filter is good and is defending the wrong path, without making it sound like they were careless. They usually were not.',
    ],
    personalityMatch: [
      'You want to know how something computes its answer, not just what it answers',
      'You can spend a week on something, conclude "I could not break it", and treat that as a result rather than a failure',
      'You are comfortable where nobody has written the method down and you will have to invent it',
      'You can be the bearer of expensive news to somebody with a deadline, repeatedly, without either backing down or enjoying it',
    ],
    painPoints: [
      'Almost no junior openings. The roles that exist mostly want somebody who was already a security engineer or an ML engineer, and the "AI security analyst" job advert you saw is often a research post in disguise.',
      'The hype is exhausting and it is aimed at you. You will spend real time correcting confident nonsense from vendors, executives, and sometimes your own leadership.',
      'You are a blocker by function. Your best work delays a launch, and the people whose launch it is will remember that.',
      'The ground moves under you. A technique you documented in March can be irrelevant in September because a model was retrained, which makes your work feel disposable in a way most security work does not.',
      'Very little of it is jailbreaking. A great deal of it is reading data, writing documents, and asking who has write access to things.',
    ],
    environmentFit: [
      { environmentId: 'corporate', rank: 1, note: 'Where the models are. Large technology companies and any organisation that has deployed AI into a decision path, which now includes most banks, insurers, and health systems. The role is usually inside a product security or ML platform team rather than the SOC.' },
      { environmentId: 'consulting', rank: 2, note: 'AI red teaming sold as an engagement. Broad exposure to many systems very quickly, and the work is genuinely varied, but engagements are short, you rarely see a fix land, and a lot of the market is people who read a paper and bought a domain name.' },
      { environmentId: 'government', rank: 3, note: 'Growing, and more about assurance than attack: provenance, evaluation records, and being able to evidence what was tested. Slower and more documented than the private version, which suits some people considerably better. Clearance timelines apply as everywhere else.' },
    ],
    certPathway: ['sec-plus', 'aigp'],
    baselineBurnout: 'medium',
    burnoutDrivers: [
      'Being the reason a launch slips, as a recurring feature of the job rather than an occasional event',
      'Correcting the same misconceptions about how models work, indefinitely',
      'Work that goes stale when a model is retrained',
      'A field where the marketing runs years ahead of the practice, so it is hard to tell whether you are behind',
    ],
    advancement:
      'Senior AI security engineer, then either research or leading an AI assurance function. It is genuinely too new to say where it settles, and anybody telling you the ten-year path with confidence is guessing. What is portable is the underlying skill: somebody who can reason about a system nobody has documented is employable regardless of what this specialism is called in five years.',
    trackId: 'ai-security',
    entryReality:
      'Not a first security job, and the salary figures being quoted around it are for people who were already senior somewhere else. The realistic route is two to three years in another lane (detection engineering, appsec, or security engineering are the usual ones) while learning the AI mechanics properly, then moving across. If you are arriving from machine learning rather than from security, the crossing is shorter and you need the security half instead. Either way, the credential that gets you hired is a portfolio of findings you can walk somebody through, because there is no established certification for this and several of the ones being sold are worthless.',
  },
];

const BY_ID = new Map(LANE_PROFILES.map((lane) => [lane.id, lane]));

export function getLaneProfile(id: string) {
  return BY_ID.get(id as never) ?? null;
}
