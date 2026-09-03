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
    compensationUsd: {
      entry: '$50,000 to $65,000',
      mid: '$70,000 to $95,000',
      senior: '$100,000 to $130,000',
      note: 'MSSP shops tend to sit at the bottom of these bands; large corporate SOCs and government roles with a clearance sit nearer the top. "Senior" here means Tier 3 or shift lead, not management.',
    },
    worksWith: [
      'The shift you hand off to and the one you receive from',
      'Tier 2 and Tier 3 analysts you escalate to when something does not resolve',
      'The detection engineering team, when the actual problem is a bad rule rather than a bad alert',
      'IT and the help desk, for the account and device context an alert alone does not give you',
    ],
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
    compensationUsd: {
      entry: '$75,000 to $90,000',
      mid: '$95,000 to $125,000',
      senior: '$130,000 to $165,000',
      note: 'There is no true entry band, because almost nobody starts here. These figures assume the SOC time already served; quote them to yourself only once that is true.',
    },
    worksWith: [
      'SOC analysts, whose complaints about a rule are effectively your backlog',
      'The platform or logging team that owns the sources a rule depends on',
      'Incident responders, when a real intrusion becomes the model for a new detection',
      'Whoever owns change control on the SIEM, for every rule you ship',
    ],
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
    compensationUsd: {
      entry: '$70,000 to $90,000',
      mid: '$100,000 to $130,000',
      senior: '$140,000 to $180,000',
      note: 'Retainer consulting firms pay more per hour but bill you out constantly; in-house roles pay less on paper and cost you fewer weekends. Both numbers are real, they are just different jobs.',
    },
    worksWith: [
      'The SOC, who escalates the incident to you in the first place',
      'Legal and communications, on anything that could become public or regulatory',
      'IT operations, who actually rebuilds what you contained',
      'Executives, on an hourly bridge call none of them asked to be on',
    ],
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
    compensationUsd: {
      entry: '$65,000 to $85,000',
      mid: '$90,000 to $120,000',
      senior: '$130,000 to $160,000',
      note: 'Law enforcement pay tends to sit below the private-sector consulting figures for the same skill; the tradeoff is case variety and a pension most consultancies do not offer.',
    },
    worksWith: [
      'The incident response lead who handed you the case',
      'Legal counsel, on what a finding actually proves and what it does not',
      'Law enforcement, on cases that cross that line',
      'Opposing counsel, occasionally, under oath',
    ],
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
      'Query LeakIX, Argus, and similar open-source platforms for exposed infrastructure, leaked credentials, and public data tied to an actor or a target.',
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
    compensationUsd: {
      entry: '$60,000 to $80,000',
      mid: '$90,000 to $115,000',
      senior: '$120,000 to $150,000',
      note: 'A cleared federal role and a vendor research seat can pay very differently for the same seniority. Ask which one a number is describing before you compare it to your own offer.',
    },
    worksWith: [
      'The SOC, who wants to know whether a campaign is relevant to them specifically',
      'Detection engineering, translating a report into something a rule can catch',
      'Executives, before a public breach makes the question urgent anyway',
      'Other intelligence teams, trading what each of you has seen',
    ],
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
    compensationUsd: {
      entry: '$65,000 to $85,000',
      mid: '$95,000 to $125,000',
      senior: '$140,000 to $180,000',
      note: 'Independent consulting at senior level can exceed this considerably, but you are pricing your own time and covering your own gaps between engagements, which the figure alone does not show.',
    },
    worksWith: [
      'The client\'s IT or security lead, who scoped what you are allowed to touch',
      'The developers whose application you are about to make their problem',
      'Your own report writers and technical reviewer',
      'The client\'s executives, at the out-brief where the real conversation happens',
    ],
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
    compensationUsd: {
      entry: '$100,000 to $130,000',
      mid: '$135,000 to $165,000',
      senior: '$170,000 to $220,000',
      note: 'These numbers describe somebody arriving with years of penetration testing already behind them, which is the only real way in. There is no junior version of this figure.',
    },
    worksWith: [
      'The blue team, whose detection you are testing without telling them when',
      'Purple team coordinators, after the exercise ends and the lessons get shared',
      'The CISO, who authorised the engagement and wants findings held quietly until fixed',
      'Your own operators, coordinating a campaign that can run for weeks',
    ],
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
    compensationUsd: {
      entry: '$70,000 to $90,000',
      mid: '$100,000 to $130,000',
      senior: '$140,000 to $175,000',
      note: 'Prior systems or DevOps experience tends to land you nearer the top of the entry band than somebody arriving with security knowledge alone and no infrastructure background.',
    },
    worksWith: [
      'The engineering teams whose systems you are hardening, who often see you as friction',
      'Change management, for every window you need to make a change',
      'The SOC, who inherits whatever you build',
      'Vendors, for the tools underneath most of what you deploy',
    ],
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
    compensationUsd: {
      entry: '$60,000 to $80,000',
      mid: '$85,000 to $110,000',
      senior: '$120,000 to $150,000',
      note: 'The field is narrowing as workloads move to the cloud, and pay reflects that: the top of this band increasingly belongs to people who can also speak cloud networking.',
    },
    worksWith: [
      'Network engineering, who owns the hardware you are securing',
      'The SOC, chasing down what a packet capture actually shows',
      'Every team that files an exception request against a segmentation rule',
      'Cloud engineering, increasingly, as the network itself moves off-premises',
    ],
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
    compensationUsd: {
      entry: '$75,000 to $95,000',
      mid: '$105,000 to $135,000',
      senior: '$145,000 to $185,000',
      note: 'Demand currently outpaces supply enough that these bands move up faster than most of security. Multi-cloud experience, not just one provider, is what pushes an offer toward the top.',
    },
    worksWith: [
      'The DevOps or platform team whose account you are auditing',
      'Developers, who can create risk faster than you can review it',
      'Finance, when a security control collides with a cost decision',
      'Compliance, for whatever framework the cloud posture has to satisfy',
    ],
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
    compensationUsd: {
      entry: '$75,000 to $95,000',
      mid: '$105,000 to $135,000',
      senior: '$145,000 to $180,000',
      note: 'Pay tracks software engineering pay more than it tracks general security pay, because the job is closer to development than to most of the rest of this list.',
    },
    worksWith: [
      'The developers whose code you are reviewing, who did not ask for the review',
      'Engineering leadership, when a finding threatens a release date',
      'The pentest team, on anything that needs a human attacker to confirm',
      'Product management, on risk tradeoffs they did not know they were making',
    ],
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
    compensationUsd: {
      entry: '$55,000 to $70,000',
      mid: '$75,000 to $95,000',
      senior: '$105,000 to $130,000',
      note: 'This is one of the lower-paid lanes in security relative to the demand for it, which is exactly why the entry competition is lighter than the job market numbers would suggest.',
    },
    worksWith: [
      'The system owners you chase for remediation, repeatedly',
      'IT operations, who actually applies the patch',
      'Risk management, on what gets an exception and why',
      'Executives, via the metrics that say whether the number is moving',
    ],
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
    compensationUsd: {
      entry: '$55,000 to $70,000',
      mid: '$75,000 to $100,000',
      senior: '$110,000 to $140,000',
      note: 'Federal roles involving PIV/CAC and ICAM policy sit above these bands as a specialised niche; general enterprise IAM sits within them.',
    },
    worksWith: [
      'The service desk, on every access request and password reset that lands on your queue',
      'Managers, who you chase every cycle to certify their team\'s access',
      'Application owners, on what a role in their system actually grants',
      'Audit, at every review cycle',
    ],
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
    compensationUsd: {
      entry: '$55,000 to $70,000',
      mid: '$80,000 to $105,000',
      senior: '$115,000 to $150,000',
      note: 'A background in audit or finance tends to command more at entry than a background in security alone, because the writing and stakeholder skills are what the role is actually short of.',
    },
    worksWith: [
      'Internal audit, who tests what you assert is true',
      'Every department head, who owns a risk you are tracking on their behalf',
      'The board or an audit committee, for the report they actually read',
      'Legal, on anything that touches a regulation',
    ],
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
    compensationUsd: {
      entry: '$120,000 to $145,000',
      mid: '$145,000 to $175,000',
      senior: '$180,000 to $230,000',
      note: 'There is no junior figure worth publishing, because there is no junior version of this job. These bands describe somebody arriving already senior from engineering, engineering management, or another lane on this list.',
    },
    worksWith: [
      'Engineering leads, on every design you review before it is built',
      'The CISO, for whom you are translating risk into architecture',
      'Specialists in network, cloud, and identity, whose depth you rely on rather than duplicate',
      'Procurement, on anything that has to be bought to build what you designed',
    ],
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
    compensationUsd: {
      entry: '$110,000 to $140,000',
      mid: '$140,000 to $175,000',
      senior: '$180,000 to $230,000',
      note: 'Read the entry figure the way the rest of this profile reads everything else about entering the field: it describes somebody who was already senior in security or machine learning before crossing over, not a first job.',
    },
    worksWith: [
      'The ML or product team whose model you are testing, who has a launch date',
      'Legal and policy, on what a finding means for compliance',
      'Data scientists, reading training data alongside you',
      'Executives, who are being sold the technology faster than it can be secured',
    ],
    trackId: 'ai-security',
    entryReality:
      'Not a first security job, and the salary figures being quoted around it are for people who were already senior somewhere else. The realistic route is two to three years in another lane (detection engineering, appsec, or security engineering are the usual ones) while learning the AI mechanics properly, then moving across. If you are arriving from machine learning rather than from security, the crossing is shorter and you need the security half instead. Either way, the credential that gets you hired is a portfolio of findings you can walk somebody through, because there is no established certification for this and several of the ones being sold are worthless.',
  },
  {
    id: 'ot-ics',
    title: 'OT and Industrial Control Systems Security',
    summary:
      'Protect the systems that run physical processes, where a failure has consequences you can see rather than a number on a spreadsheet.',
    dayToDay: [
      'Walk the plant floor with an engineer before touching anything, because you are a guest in a world you do not run.',
      'Read traffic from a protocol built decades ago to trust everything on the wire, and decide what normal looks like before you can say what is not.',
      'Argue for a patch or a segmentation change that cannot happen until the next planned outage, sometimes months away.',
      'Sit between plant engineers, who measure success in decades of uptime, and IT security, who measure it in hours since the last incident.',
      'Document a control that will be reviewed by an auditor who has never set foot in a control room.',
    ],
    personalityMatch: [
      'You can accept that "patch it now" is sometimes the wrong answer, not just the slow one',
      'You are comfortable being the least senior person in a room full of people with decades on the plant floor',
      'You think in terms of physical consequence, not just data loss',
      'You are patient with a change that lands on the next planned outage rather than the next ticket',
    ],
    painPoints: [
      'The gap between how IT security assumes things work and how the plant actually runs causes real friction, and you absorb most of it.',
      'Change happens on the plant\'s schedule, not yours, which can mean living with a known gap for months.',
      'Prior industrial experience carries more weight here than a security background does, which can make entry slower than other lanes.',
      'The job is quiet until it very much is not, and "it will never happen here" is a common, hard instinct to argue against.',
    ],
    environmentFit: [
      { environmentId: 'government', rank: 1, note: 'Municipal utilities, power, water, and transit run critical infrastructure with famously small security teams and real public impact. Federal critical-infrastructure programmes fund this work seriously.' },
      { environmentId: 'corporate', rank: 2, note: 'Manufacturing and energy companies with real plant floors. Deep, narrow expertise inside one industry.' },
      { environmentId: 'consulting', rank: 3, note: 'Assessment work across several plants and industries. Broad exposure, but you rarely stay long enough to see a fix through a full outage cycle.' },
    ],
    certPathway: ['sec-plus', 'gicsp'],
    baselineBurnout: 'low',
    burnoutDrivers: ['Living with a known gap until the next planned outage', 'Being the newest voice in a room of plant veterans', 'Translating between two departments that do not share a vocabulary'],
    advancement:
      'Senior OT security engineer, then OT security lead or a Purdue-model architecture role spanning several sites. A small, specialised field where experienced people are genuinely hard to find and harder to replace.',
    compensationUsd: {
      entry: '$65,000 to $85,000',
      mid: '$90,000 to $115,000',
      senior: '$120,000 to $155,000',
      note: 'Prior industrial, engineering, or military experience is worth more here at entry than a security certification is, and offers reflect that.',
    },
    worksWith: [
      'Plant or operations engineers, who own the equipment and outrank you on it',
      'The safety team, whose systems are never touched for a security reason alone',
      'IT security, translating between two departments that measure risk differently',
      'Vendors, who control firmware you are usually not allowed to modify yourself',
    ],
    trackId: 'ot-ics',
    entryReality:
      'People arriving from engineering, manufacturing, utilities, or the military transfer in more easily than people arriving from a pure IT security background, because the physical-systems instinct is the harder half to teach.',
  },
  {
    id: 'compliance-audit',
    title: 'Compliance and Audit',
    summary:
      'Test whether controls actually operate, gather evidence that survives a sceptical reviewer, and write findings that get acted on.',
    dayToDay: [
      'Interview a control owner about how a process works, and compare the answer to what the system logs actually show.',
      'Pull a sample, not everything, and be ready to defend why the sample is big enough to mean something.',
      'Chase evidence that should have been easy to produce and was not, which tells you something on its own.',
      'Write a finding with a rating you can justify to somebody who wants it lowered.',
    ],
    personalityMatch: [
      'You are comfortable being the person nobody is glad to see on their calendar',
      'You can hold a position under pushback from somebody more senior than you',
      'You write precisely, because a vague finding gets argued rather than fixed',
      'You would rather find the gap now than have someone else find it during a real audit',
    ],
    painPoints: [
      'You are treated as an obstacle by the people you audit, no matter how reasonable the finding.',
      'The work runs in hard cycles: quiet stretches followed by weeks where every deadline lands at once.',
      'Evidence collection is often the least respected, most time-consuming part of the job.',
      'A technically correct finding that lands badly politically can be softened by somebody more senior than the truth.',
    ],
    environmentFit: [
      { environmentId: 'government', rank: 1, note: 'FISMA, inspector general reviews, and continuous monitoring make this a defined, stable career field with real structure.' },
      { environmentId: 'consulting', rank: 2, note: 'Firms doing SOC 2 and ISO 27001 work for companies chasing certification for the first time. Steady demand, varied clients, fast learning.' },
      { environmentId: 'corporate', rank: 3, note: 'Regulated industries run internal audit functions with genuine authority, though you may wait longer between cycles to see the impact of a finding.' },
    ],
    certPathway: ['cisa', 'sec-plus', 'crisc', 'cgrc'],
    baselineBurnout: 'low',
    burnoutDrivers: ['Being resented for doing the job correctly', 'Deadline-heavy cycles around audit periods', 'Findings softened or reversed above your level'],
    advancement:
      'Senior auditor, then audit manager or a move into risk and governance leadership. One of the more direct routes into a CISO-adjacent career for somebody without a technical background.',
    compensationUsd: {
      entry: '$55,000 to $70,000',
      mid: '$75,000 to $95,000',
      senior: '$105,000 to $135,000',
      note: 'A CPA or an internal-audit background tends to move the top of this band higher than a security-only background does.',
    },
    worksWith: [
      'The control owners you interview and then test',
      'Internal audit, if that is not the seat you already hold',
      'External auditors, during the certification window',
      'Leadership, on the finding they would rather not have',
    ],
    trackId: 'compliance-audit',
    entryReality:
      'The most direct transfer that exists for anyone from internal audit, accounting, or quality assurance. Those skills are the job; security knowledge is what you add on top.',
  },
  {
    id: 'privacy',
    title: 'Privacy and Data Protection',
    summary:
      'Work out what personal data an organisation actually holds, whether it should, and keep its use lawful and defensible.',
    dayToDay: [
      'Map a data flow: what is collected, why, where it goes, and who else can see it.',
      'Read a new product design before it ships and ask what happens to the data it will start collecting.',
      'Review a vendor contract for what it actually permits them to do with data you are responsible for.',
      'When a breach notification clock starts, work out who has to be told, what, and by when, against a legal deadline that does not move.',
    ],
    personalityMatch: [
      'You read contracts and regulation without your eyes glazing over',
      'You can say no to a product decision on legal grounds and hold that line',
      'You think about second- and third-order uses of data, not just the obvious one',
      'You are comfortable working from a law or a standard rather than a technical spec',
    ],
    painPoints: [
      'You often find out what a system actually does with data well after it was already built that way.',
      'The regulatory landscape changes state by state and country by country, and keeping current is a permanent task.',
      'A breach notification clock is unforgiving, and it does not wait for a convenient time to start.',
      'Being the person who says no to a launch is not always a popular seat.',
    ],
    environmentFit: [
      { environmentId: 'government', rank: 1, note: 'Privacy Act obligations and mandatory privacy impact assessments make this a defined career field with its own progression.' },
      { environmentId: 'corporate', rank: 2, note: 'Multinationals juggling GDPR, state privacy laws, and sector rules simultaneously need this depth permanently. Legal backgrounds are prized.' },
      { environmentId: 'consulting', rank: 3, note: 'Privacy assessment and DPIA work across many clients. Good breadth, less ownership of any one programme.' },
    ],
    certPathway: ['cipp-us', 'sec-plus'],
    baselineBurnout: 'low',
    burnoutDrivers: ['A regulatory landscape that never stops changing underneath you', 'Being brought in after a design decision is already made', 'The unforgiving clock on a real breach notification'],
    advancement:
      'Senior privacy analyst, then Data Protection Officer or privacy programme lead. A distinct profession from the rest of this list, with its own credentialing and its own leadership track.',
    compensationUsd: {
      entry: '$60,000 to $80,000',
      mid: '$85,000 to $110,000',
      senior: '$120,000 to $155,000',
      note: 'A legal background pushes these figures up meaningfully; a Data Protection Officer at a large multinational can exceed the top of this band considerably.',
    },
    worksWith: [
      'Legal counsel, on what the law actually requires versus what is merely prudent',
      'Engineering, on how a system actually handles data versus how the design document says it does',
      'The Data Protection Officer or privacy lead you report findings to, if that is not your own seat',
      'Customers and regulators, indirectly, through every policy you write',
    ],
    trackId: 'privacy',
    entryReality:
      'A strong, direct transfer for anyone arriving from legal, compliance, healthcare, or records management. It is a distinct profession that overlaps security without being it, and that overlap is exactly the value you add.',
  },
  {
    id: 'awareness',
    title: 'Security Awareness and Human Risk',
    summary:
      'Change what people actually do, not what they can recite: training that is not ignored, phishing simulation that teaches rather than punishes.',
    dayToDay: [
      'Look at last month\'s numbers and ask whether they measure behaviour or just completion, because most awareness metrics measure the wrong thing.',
      'Design a phishing simulation that teaches the person who clicked something useful, rather than humiliating them in front of their team.',
      'Turn a real incident into a training moment without naming who caused it.',
      'Fight for budget for a programme whose success looks like nothing happening, which is a hard thing to sell upward.',
    ],
    personalityMatch: [
      'You understand how people actually decide under pressure, not how a policy assumes they do',
      'You can make a dry topic land without talking down to the room',
      'You think about incentives: what a policy actually rewards, and whether that is what you want',
      'You are comfortable that your best work is invisible: an incident that never happened',
    ],
    painPoints: [
      'Most organisations still measure completion and click rates, which are close to meaningless, and changing that is a constant argument.',
      'You are easy to deprioritise when budgets tighten, because the cost of skipping awareness work is not obvious until it is.',
      'A programme that punishes people for clicking teaches them to hide mistakes rather than report them, and convincing leadership of that takes real effort.',
      'You rarely get credit for the incident that did not happen.',
    ],
    environmentFit: [
      { environmentId: 'corporate', rank: 1, note: 'Large organisations fund dedicated awareness roles with a real budget and a real mandate. Where almost all of these jobs actually are.' },
      { environmentId: 'consulting', rank: 2, note: 'Designing and running programmes for clients who do not have the role in-house. Varied audiences, less ownership of long-term results.' },
      { environmentId: 'government', rank: 3, note: 'Mandated annual training cycles give you a captive audience and a compliance deadline, though the content is often more constrained.' },
    ],
    certPathway: ['sec-plus'],
    baselineBurnout: 'low',
    burnoutDrivers: ['Proving the value of work whose success is invisible', 'Being the first budget line cut when things tighten', 'Fighting metrics that reward the wrong behaviour'],
    advancement:
      'Senior awareness manager, then head of security culture or a move into broader risk communications. One of the more direct routes in for people who do not come from a technical background at all.',
    compensationUsd: {
      entry: '$55,000 to $70,000',
      mid: '$75,000 to $95,000',
      senior: '$100,000 to $130,000',
      note: 'Pay here trails the more technical lanes on this list, which is a genuine argument worth having with anyone hiring for it rather than a reflection of the skill the job actually takes.',
    },
    worksWith: [
      'HR and internal communications, who own the channels your message actually travels through',
      'Every employee, who is both your audience and, through what they report, your data source',
      'The SOC, who tells you what people are actually falling for right now',
      'Leadership, who has to fund a programme that is hard to prove worked',
    ],
    trackId: 'awareness',
    entryReality:
      'The most underrated entry point on this list. People arriving from teaching, communications, HR, or marketing bring exactly the skills the role needs, and prior non-technical experience is a genuine advantage rather than something to overcome.',
  },
];

const BY_ID = new Map(LANE_PROFILES.map((lane) => [lane.id, lane]));

export function getLaneProfile(id: string) {
  return BY_ID.get(id) ?? null;
}

/*
 * A few tracks (incident-response, risk-governance) back more than one lane,
 * e.g. incident-response backs both the "incident-response" and "forensics"
 * lanes. Two passes so the lane whose own id matches the track id wins: the
 * plain, unqualified read of the job over a specialisation within it.
 */
const LANE_ID_BY_TRACK = new Map<string, string>();
for (const lane of LANE_PROFILES) {
  if (lane.trackId) LANE_ID_BY_TRACK.set(lane.trackId, lane.id);
}
for (const lane of LANE_PROFILES) {
  if (lane.trackId === lane.id) LANE_ID_BY_TRACK.set(lane.trackId, lane.id);
}

/** The lane a track's "what this job is really like" page should open, if one exists. */
export function laneIdForTrack(trackId: string): string | undefined {
  return LANE_ID_BY_TRACK.get(trackId);
}
