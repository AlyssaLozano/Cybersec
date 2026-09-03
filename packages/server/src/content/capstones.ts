/**
 * The GitHub Lab: the capstone at the end of a track.
 *
 * WHAT THIS IS FOR
 *
 * Every other stage in a track is graded against the simulated world. That is
 * exactly right for teaching a skill, and exactly wrong for a portfolio: an
 * employer cannot open a student's terminal session. What they can open is a
 * GitHub repo. So the last stage in a track hands the student a short menu of
 * real projects, built on infrastructure they control, written up and pushed
 * to a repo that is genuinely theirs.
 *
 * WHY THIS IS NOT AN EXERCISE
 *
 * The Exercise/Check system (see content.ts) exists to grade deterministic
 * state in a seeded world, and it does that by running commands against a
 * filesystem the server owns. A capstone project runs on the student's own
 * machine or their own cloud account, and the one thing the server must never
 * do is reach out and check it: fetching a student-supplied URL from the
 * server is exactly the kind of real-network reach the simulated engine is
 * built to avoid needing. So there are no checks here, only guidance, and
 * completion is self-attested -- the honest thing for work nobody but the
 * student can verify.
 *
 * WHY 5 OPTIONS AND NOT 1
 *
 * A single assigned project produces a GitHub full of identical repos, which
 * reads to an employer as "did the assignment," not "built something." A
 * short menu lets a student pick the project closest to the job they actually
 * want next.
 *
 * SCOPE
 *
 * Every track with playable content gets one. Add a track's array here and
 * its capstone stage in tracks.ts together -- a stage with no options behind
 * it is exactly the kind of unreachable content career.test.ts exists to
 * catch. Started on `soc` and `ai-security` alone to prove the pattern, then
 * extended to the rest at the same depth.
 */

import type { CapstoneOption, CapstoneWalkthroughStep } from '@soc/shared';

/**
 * Shown once, before any track's project menu. Most students reaching this
 * stage have finished graded terminal work but may never have pushed a repo
 * of their own -- this assumes nothing.
 */
export const GITHUB_WALKTHROUGH: CapstoneWalkthroughStep[] = [
  {
    title: 'Create a GitHub account',
    detail:
      'Free, at github.com. Use a professional-looking username: employers will click through from your resume, and "xX_h4ck3r_Xx" is a worse first impression than a five-minute rename now.',
  },
  {
    title: 'Install Git',
    detail:
      'Git is the version control tool; GitHub is where the repo is hosted. They are different things and you need both. Windows: winget or the installer at git-scm.com. Mac: already installed, or `brew install git`. Linux: your package manager.',
  },
  {
    title: 'Tell Git who you are',
    detail: 'One-time setup, so your commits carry your name and the email tied to your GitHub account.',
    command: 'git config --global user.name "Your Name"\ngit config --global user.email "you@example.com"',
  },
  {
    title: 'Create the repo on GitHub first',
    detail:
      'On github.com, "New repository". Public, not private -- a private repo is invisible to the employer you are building this for. Add a README when prompted; you will replace it.',
  },
  {
    title: 'Clone it to your machine',
    detail: 'Copy the URL from the green "Code" button on the repo page, then:',
    command: 'git clone https://github.com/your-username/your-repo-name.git',
  },
  {
    title: 'Do the work, then commit it',
    detail:
      'Commit as you go, not once at the end. A commit history that shows the project taking shape over several days reads as real work; one giant commit reads as a file dump.',
    command: 'git add .\ngit commit -m "Describe what changed, not what the project is"',
  },
  {
    title: 'Push',
    detail: 'Sends your commits to GitHub. Do this every time you want the repo to reflect your latest work.',
    command: 'git push',
  },
  {
    title: 'Write the README last',
    detail:
      'The README is the first thing an employer reads, often the only thing. State what the project is, why you built it, what you found, and how to run it. Screenshots and sample output beat a wall of prose.',
  },
  {
    title: 'Paste the repo link back here',
    detail:
      'Once it is public and the README is in good shape, submit the link below. You can keep improving the repo after submitting -- the link stays live.',
  },
];

export const CAPSTONES: Record<string, CapstoneOption[]> = {
  soc: [
    {
      id: 'soc-home-siem',
      title: 'Home SOC lab',
      pitch: 'Stand up a real SIEM ingesting real logs and show the detection rules you wrote for it.',
      deliverables: [
        'A README describing the lab topology (what runs where, on what)',
        'At least 3 custom detection rules, with the reasoning behind each',
        'Screenshots of at least one alert firing on real activity',
        'A short section on what you would add next and why',
      ],
      estimatedHours: '8 to 15 hours',
      difficulty: 'moderate',
    },
    {
      id: 'soc-detection-as-code',
      title: 'Detection-as-code repo',
      pitch: 'A small, versioned Sigma rule set is exactly what a detection engineering interview asks you to bring.',
      deliverables: [
        'Sigma rules for at least 4 distinct ATT&CK techniques',
        'A README mapping each rule to the technique it covers and why it was written that way',
        'A written note on the false-positive tradeoff for at least one rule',
        'Test log lines (real or synthetic) that each rule correctly fires on',
      ],
      estimatedHours: '6 to 10 hours',
      difficulty: 'moderate',
    },
    {
      id: 'soc-log-toolkit',
      title: 'Log parsing toolkit',
      pitch: 'A small, tested CLI that turns a messy real log format into structured findings.',
      deliverables: [
        'A script or small CLI (Python, PowerShell, or similar) that parses one real log format',
        'At least one automated test against sample log data',
        'Sample input and output committed to the repo',
        'A README explaining what the tool answers that grep alone does not',
      ],
      estimatedHours: '5 to 8 hours',
      difficulty: 'accessible',
    },
    {
      id: 'soc-retrospective-incident',
      title: 'Retrospective incident writeup',
      pitch: 'Take a well-documented public breach and write the shift-report you would have filed.',
      deliverables: [
        'Clear labelling as retrospective analysis of a public case, not a real investigation',
        'A timeline reconstructed from public sources, cited',
        'Your own triage and escalation decisions, and the reasoning behind them',
        'What detection, earlier in the chain, would have caught it sooner',
      ],
      estimatedHours: '6 to 10 hours',
      difficulty: 'accessible',
    },
    {
      id: 'soc-honeypot-pipeline',
      title: 'Honeypot pipeline',
      pitch: 'Capture real internet background noise safely, and show you can triage what shows up.',
      deliverables: [
        'A honeypot (e.g. Cowrie) run in an isolated environment, with the isolation explained',
        'A summary of what connected in and what it attempted',
        'Your triage of the top few sessions: noise, or worth a closer look, and why',
        'A note on the safety boundary: what the honeypot could and could not reach',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'hard',
    },
    {
      id: 'soc-helpdesk-ticketing',
      title: 'Help desk ticketing system',
      pitch: 'Stand up a real ticketing tool and show the workflow, since running one IS the entry-level job.',
      deliverables: [
        'A real ticketing tool (osTicket, or a TopDesk-style open-source alternative) deployed and configured by you',
        'The full lifecycle demonstrated on real or realistic tickets: intake, triage and priority, assignment, resolution',
        'A README explaining the priority matrix and SLA rules you configured, and why',
        'At least one resolved ticket with a resolution note good enough for someone else to reuse',
      ],
      estimatedHours: '6 to 10 hours',
      difficulty: 'accessible',
    },
    {
      id: 'soc-virtual-network-lab',
      title: 'Virtual networking lab',
      pitch: 'Build a real multi-subnet network and prove you know exactly why a ping succeeds or fails on it.',
      deliverables: [
        'A multi-subnet topology built in Packet Tracer, GNS3, or EVE-NG, with a diagram committed',
        'Subnetting and VLAN design documented, with the reasoning for how the address space was split',
        'Static or dynamic routing configured between every subnet, with a DHCP scope serving at least one of them',
        'End-to-end connectivity proven with ping and traceroute output between devices on different subnets',
      ],
      estimatedHours: '6 to 10 hours',
      difficulty: 'accessible',
    },
    {
      id: 'soc-siem-automation-pipeline',
      title: 'SIEM to automation pipeline',
      pitch: 'Wire a real SIEM into a real automation platform and show alerts arriving enriched, not raw.',
      deliverables: [
        'A SIEM (e.g. Wazuh) with at least one real endpoint onboarded and reporting',
        'Alerts forwarded from the SIEM into an automation platform (e.g. n8n) via a webhook you configured',
        'At least one enrichment step in the pipeline (threat intel lookup, asset lookup, or similar), with a before/after example',
        'A README with an architecture diagram of the pipeline and a note on what you deliberately did not automate, and why',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'moderate',
    },
  ],
  'ai-security': [
    {
      id: 'ai-redteam-open-model',
      title: 'Red-team an open-weight model',
      pitch: 'Run and document a real prompt-injection or jailbreak assessment against a model you host yourself.',
      deliverables: [
        'A model you run locally (e.g. via Ollama), named and versioned',
        'A documented methodology: what you tried, in what order, and why',
        'At least one confirmed bypass, with the exact prompt and output',
        'A recommendation section written the way you would hand it to the model owner',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'moderate',
    },
    {
      id: 'ai-injection-guardrail',
      title: 'Prompt-injection guardrail',
      pitch: 'Build a small filter or classifier and prove it catches a real class of attack.',
      deliverables: [
        'A guardrail (rule-based filter or small classifier) with source committed',
        'A payload test suite of at least 20 attempts, spanning several techniques',
        'Results: what it caught, what it missed, and your analysis of why',
        'A README stating plainly what this guardrail does not protect against',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'hard',
    },
    {
      id: 'ai-finetune-writeup',
      title: 'Fine-tune and document',
      pitch: 'Fine-tune a small open model for a narrow task and write up what actually happened.',
      deliverables: [
        'The training data and process, described well enough to reproduce',
        'Before/after examples showing the fine-tune changed behaviour',
        'What went wrong, stated honestly -- this is more useful to a reader than a clean success story',
        'Resource cost: how long it took and on what hardware',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'hard',
    },
    {
      id: 'ai-build-then-break',
      title: 'Build then break your own app',
      pitch: 'Build a small RAG or agent app, then attack the thing you just built.',
      deliverables: [
        'A working RAG or tool-using agent app, source committed',
        'At least one successful attack against it (e.g. data exfiltration via tool use, or injection through a retrieved document)',
        'The fix you applied afterward, and whether it actually closed the gap',
        'An architecture diagram, even a simple one',
      ],
      estimatedHours: '10 to 18 hours',
      difficulty: 'hard',
    },
    {
      id: 'ai-eval-harness',
      title: 'Eval harness',
      pitch: 'Define a safety benchmark and build the harness that scores a model against it.',
      deliverables: [
        'A benchmark: a defined set of prompts and what a passing response looks like',
        'A harness that runs the benchmark against at least one model automatically',
        'Published results, with the raw data alongside the summary',
        'A note on where this benchmark is weak or gameable',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'moderate',
    },
  ],
  'incident-response': [
    {
      id: 'ir-host-forensics',
      title: 'Full host forensic investigation',
      pitch: 'Image a machine you own, reconstruct what happened on it, and write the report a real case would need.',
      deliverables: [
        'A disk or memory image from a VM you control, acquired and hashed before analysis',
        'A timeline built from filesystem and registry artefacts, not just a log dump',
        'At least one finding traced back to the specific artefact that proved it',
        'A written report in the structure a real DFIR engagement would use',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'moderate',
    },
    {
      id: 'ir-memory-forensics',
      title: 'Memory forensics case study',
      pitch: 'Capture and analyse a live memory image with Volatility, and find what only ever existed in RAM.',
      deliverables: [
        'A memory image from a VM running a known sample (a CTF or public malware sample, in an isolated lab)',
        'Analysis with Volatility: processes, network connections, injected code',
        'A writeup of what was findable in memory that would not have been findable on disk',
        'The isolation boundary you used, stated explicitly',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'hard',
    },
    {
      id: 'ir-malware-analysis',
      title: 'Malware analysis report',
      pitch: 'Take a real sample apart in an isolated lab and write the report an analyst would hand to a SOC.',
      deliverables: [
        'A sample from a public repository (e.g. MalwareBazaar), analysed only in an isolated, network-contained VM',
        'Static analysis: strings, imports, packing, and what they suggest before running anything',
        'Dynamic analysis: what it actually did when run, observed safely',
        'Indicators and a detection recommendation at the end, not just a description',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'hard',
    },
    {
      id: 'ir-evidence-toolkit',
      title: 'Evidence handling toolkit',
      pitch: 'Build the chain-of-custody discipline as a real, reusable toolkit rather than a paragraph in a report.',
      deliverables: [
        'A documented acquisition procedure: hashing before and after, and why each step is there',
        'A chain-of-custody template you actually used on a mock case',
        'A script or checklist that makes the procedure repeatable, not just written down',
        'A worked example applying it end to end',
      ],
      estimatedHours: '6 to 10 hours',
      difficulty: 'accessible',
    },
    {
      id: 'ir-full-investigation',
      title: 'Full investigation writeup',
      pitch: 'Run a multi-host intrusion scenario in your own lab end to end and write the report.',
      deliverables: [
        'A small multi-host lab you built and deliberately compromised yourself',
        'A timeline correlating evidence across every host involved',
        'Scoping and eradication decisions, with the reasoning behind each',
        'An executive summary a non-technical reader could act on',
      ],
      estimatedHours: '14 to 20 hours',
      difficulty: 'hard',
    },
  ],
  'detection-engineering': [
    {
      id: 'det-rules-with-tests',
      title: 'Detection-as-code with a regression suite',
      pitch: 'Rules are easy. Rules that stay correct as the environment changes are the actual job.',
      deliverables: [
        'A versioned set of at least 5 detection rules (Sigma or a SIEM query language)',
        'An automated test for each rule against sample log data, run in CI',
        'A false-positive analysis for at least one rule, with the tuning you made',
        'A README explaining why each rule is scoped the way it is',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'moderate',
    },
    {
      id: 'det-tuning-case-study',
      title: 'Rule tuning case study',
      pitch: 'Take a noisy public rule set and prove, with numbers, that you made it usable.',
      deliverables: [
        'A community rule set (e.g. from Sigma) run against a large sample log set',
        'Before and after false-positive rates, measured and shown',
        'The specific exclusions or logic changes that produced the improvement',
        'A note on what the tuning cost in detection coverage, if anything',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'moderate',
    },
    {
      id: 'det-coverage-map',
      title: 'ATT&CK coverage map',
      pitch: 'Answer "what can we not detect?" honestly, the way an interviewer actually wants to hear it.',
      deliverables: [
        'A coverage matrix for a chosen threat actor or technique set, mapped to ATT&CK',
        'Rules you wrote for at least 4 of the mapped techniques',
        'An honest gap list: what is not covered and why',
        'A one-page summary written for someone who will never read the matrix',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'moderate',
    },
    {
      id: 'det-correlation-engine',
      title: 'Small correlation engine',
      pitch: 'Build the thing that turns several boring events into one alert that matters.',
      deliverables: [
        'A script or small service that correlates multiple log events into a single alert',
        'The logic documented clearly enough that someone else could extend it',
        'Test data showing it firing correctly and staying quiet on benign activity',
        'A note on what it would take to run this at real volume',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'hard',
    },
    {
      id: 'det-incident-to-rule',
      title: 'Find the gap a real incident walked through',
      pitch: 'Take a public incident writeup and prove you could have caught it.',
      deliverables: [
        'A public incident report, cited, with the detection gap identified explicitly',
        'A rule that would have caught the technique that gap missed',
        'The rule tested against synthetic logs modelling the incident',
        'A short writeup of why the gap existed in the first place',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'moderate',
    },
  ],
  'threat-intel': [
    {
      id: 'ti-adversary-profile',
      title: 'Adversary profile from open sources',
      pitch: 'Build your own structured actor profile from public reporting, properly cited.',
      deliverables: [
        'A named threat actor profile built entirely from public, cited sources',
        'Activity clustered and mapped to ATT&CK techniques',
        'An explicit confidence level for every attribution claim, not just the headline one',
        'A "what changed since the last report" section, since this is what makes intel worth reading twice',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'moderate',
    },
    {
      id: 'ti-osint-tool',
      title: 'OSINT collection tool',
      pitch: 'Automate part of the boring collection work and show what it turned up.',
      deliverables: [
        'A small tool that pulls from a public source (certificate transparency, a public feed, etc.)',
        'Source committed, with setup instructions that actually work',
        'A findings writeup from running it for real, not just a demo run',
        'A note on the legal and ethical boundary of what it collects',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'moderate',
    },
    {
      id: 'ti-finished-intelligence',
      title: 'Finished intelligence assessment',
      pitch: 'Write the document that changes a decision, not a list of indicators.',
      deliverables: [
        'A formal analytic assessment on a real, publicly documented campaign',
        'Structured analytic technique used explicitly (e.g. analysis of competing hypotheses), shown in the writeup',
        'A stated confidence level and the reasoning behind it',
        'A "so what" section: what a reader should actually do with this',
      ],
      estimatedHours: '10 to 14 hours',
      difficulty: 'moderate',
    },
    {
      id: 'ti-feed-aggregator',
      title: 'Threat intel feed aggregator',
      pitch: 'Build and publish a small tool that pulls public IOC feeds into one normalised place.',
      deliverables: [
        'A tool that pulls from at least 2 public IOC or feed sources',
        'Normalisation and deduplication logic, documented',
        'Output in a usable format (CSV, STIX, or similar)',
        'A README explaining what it is for and what it deliberately does not do',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'moderate',
    },
    {
      id: 'ti-attck-remap',
      title: 'Re-map a public breach to ATT&CK yourself',
      pitch: 'Do the mapping work yourself instead of trusting somebody else\'s, and say where you disagree.',
      deliverables: [
        'A public breach report, cited, mapped technique by technique to ATT&CK',
        'A comparison against any official mapping that already exists for it',
        'At least one place you disagree with the official mapping, and why',
        'A timeline reconstructed from the report alongside the mapping',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'accessible',
    },
  ],
  pentest: [
    {
      id: 'pt-full-engagement',
      title: 'Full attack chain against your own lab',
      pitch: 'Build a deliberately vulnerable environment, attack it, and write the report a client would pay for.',
      deliverables: [
        'A vulnerable-by-design lab you built or deployed yourself (not somebody else\'s hosted CTF)',
        'A documented methodology, in the order you actually worked it',
        'A full attack chain from initial access to a defined objective',
        'A report structured the way a real engagement report is structured, findings and remediation included',
      ],
      estimatedHours: '14 to 20 hours',
      difficulty: 'hard',
    },
    {
      id: 'pt-cve-reproduction',
      title: 'Reproduce a public CVE',
      pitch: 'Take a known vulnerability with a public proof of concept and reproduce it yourself, safely.',
      deliverables: [
        'A CVE with a public PoC, reproduced in your own isolated lab',
        'The exploitation chain documented step by step, not just "ran the script"',
        'What you had to adapt to get it working, which is usually the real learning',
        'A note on the patched version and what specifically fixed it',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'hard',
    },
    {
      id: 'pt-ad-attack-path',
      title: 'Active Directory attack path lab',
      pitch: 'Build a small domain, attack it the way a real engagement would, and show the path with BloodHound.',
      deliverables: [
        'A small AD lab with at least 3 machines and realistic misconfiguration',
        'At least one full attack path from low-privilege user to domain admin',
        'BloodHound output showing the path, with your own annotation',
        'Remediation for each step of the path, not just the final one',
      ],
      estimatedHours: '12 to 18 hours',
      difficulty: 'hard',
    },
    {
      id: 'pt-web-app-report',
      title: 'Web application pentest report',
      pitch: 'Full methodology against an intentionally vulnerable app, written up like a real client deliverable.',
      deliverables: [
        'An intentionally vulnerable web app (e.g. Juice Shop), tested with a stated methodology',
        'Findings ranked by real impact, not just OWASP category',
        'Proof-of-concept for every finding claimed',
        'A report a developer could act on without asking you to explain it live',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'moderate',
    },
    {
      id: 'pt-recon-tool',
      title: 'A tool for the repetitive part of your methodology',
      pitch: 'Automate the part of recon or enumeration you found yourself doing by hand every time.',
      deliverables: [
        'A small tool that automates one real, repeated step of a pentest methodology',
        'Source committed, with clear usage instructions',
        'Before/after: how long the manual version took versus the automated one',
        'A note on where it should NOT be pointed without authorisation',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'moderate',
    },
  ],
  appsec: [
    {
      id: 'appsec-code-review',
      title: 'Secure code review case study',
      pitch: 'Read real code and find what actually matters, the way a review is actually done.',
      deliverables: [
        'A manual review of an open-source project (or your own code), not an automated scan dump',
        'At least 2 real findings, each with the exact line and why it is exploitable',
        'A fix proposed for each finding, and whether it was accepted upstream if you submitted it',
        'A note on what a scanner would have missed and why',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'moderate',
    },
    {
      id: 'appsec-build-and-fix',
      title: 'Build a vulnerable app, then fix it',
      pitch: 'Prove you understand a vulnerability class by building it on purpose, then closing it properly.',
      deliverables: [
        'A small app you built with at least 3 deliberate, realistic vulnerabilities',
        'Exploitation of each, documented',
        'The fix for each, with before/after code shown',
        'A note on why the fix is correct and not just a workaround',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'moderate',
    },
    {
      id: 'appsec-threat-model',
      title: 'Threat model a real design',
      pitch: 'Catch the problem at the whiteboard stage, on a system that actually exists.',
      deliverables: [
        'A full threat model (e.g. STRIDE) of a real system: yours, or a documented open design',
        'A data flow diagram, not just a bullet list',
        'At least 5 threats identified, each with a mitigation',
        'A prioritisation: which of these would you fix first, and why',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'moderate',
    },
    {
      id: 'appsec-pipeline',
      title: 'A SAST/DAST pipeline that actually works',
      pitch: 'Wire a scanner into CI and tune it until it is worth keeping, not just worth demoing once.',
      deliverables: [
        'A static or dynamic scanner wired into a CI pipeline for a sample app',
        'Findings triaged: real versus noise, with your reasoning',
        'Tuning that reduced noise without hiding real findings',
        'A README explaining what this pipeline catches and what it does not',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'moderate',
    },
    {
      id: 'appsec-writeup-collection',
      title: 'Root-cause writeups from web security challenges',
      pitch: 'Solve real challenges and explain the underlying flaw, not just the flag.',
      deliverables: [
        'At least 4 solved web security challenges (CTF-style), from a named source',
        'A root-cause explanation for each, at the code level, not just the exploit steps',
        'The fix that would close each vulnerability',
        'What made each one hard, stated honestly',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'accessible',
    },
  ],
  'vuln-management': [
    {
      id: 'vm-home-assessment',
      title: 'Vulnerability assessment of your own network',
      pitch: 'Run a real scanner against a real network you own and produce a report that would survive review.',
      deliverables: [
        'A scan of your own home or lab network with an open-source scanner (OpenVAS, Nessus Essentials)',
        'Findings triaged, not just exported as a raw report',
        'A remediation plan with realistic priorities and timelines',
        'A note on what the scanner missed that manual review caught, if anything',
      ],
      estimatedHours: '6 to 10 hours',
      difficulty: 'accessible',
    },
    {
      id: 'vm-prioritisation-framework',
      title: 'A prioritisation framework beyond CVSS',
      pitch: 'CVSS alone is not prioritisation. Build the thing that actually decides what gets fixed first.',
      deliverables: [
        'A scoring framework combining asset criticality, exploitability, and real exposure',
        'Applied to a sample dataset of at least 20 findings',
        'A comparison against CVSS-only ranking, showing where they disagree',
        'A justification for the weighting you chose',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'moderate',
    },
    {
      id: 'vm-remediation-tracker',
      title: 'A remediation tracking tool',
      pitch: 'Build the dashboard that answers "are we actually fixing things on time?"',
      deliverables: [
        'A small tool or dashboard tracking findings against remediation SLAs',
        'Sample data showing overdue, on-track, and closed items',
        'A view aimed at a manager, not just an analyst',
        'A README explaining the SLA logic you chose and why',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'moderate',
    },
    {
      id: 'vm-cve-brief',
      title: 'An executive brief on a notable CVE',
      pitch: 'Translate a serious vulnerability into something a non-technical leader can act on in two minutes.',
      deliverables: [
        'A recent, notable CVE researched in depth: exploitability, affected versions, real-world exploitation',
        'A one-page executive brief: what it is, what it means for us, what we are doing',
        'The technical detail kept in an appendix, not the main page',
        'A recommended action with a realistic timeline',
      ],
      estimatedHours: '5 to 8 hours',
      difficulty: 'accessible',
    },
    {
      id: 'vm-asset-discovery',
      title: 'Asset discovery automation',
      pitch: 'You cannot manage what you do not know exists. Build the thing that finds it.',
      deliverables: [
        'A script that discovers and inventories assets on a lab network',
        'Output in a structured, reusable format',
        'A comparison against what you assumed was on the network beforehand',
        'A note on what active scanning cannot see that passive discovery can, or vice versa',
      ],
      estimatedHours: '6 to 10 hours',
      difficulty: 'accessible',
    },
  ],
  'cloud-security': [
    {
      id: 'cloud-posture-audit',
      title: 'Cloud posture audit, misconfigured on purpose',
      pitch: 'Break your own cloud account, then find every way you broke it.',
      deliverables: [
        'A free-tier cloud account with deliberate, realistic misconfigurations you introduced yourself',
        'An audit with an open-source tool (Prowler, ScoutSuite, or similar)',
        'Every finding explained in terms of real impact, not just the tool\'s severity label',
        'The fix applied for each finding, verified after the fact',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'moderate',
    },
    {
      id: 'cloud-iam-redesign',
      title: 'IAM least-privilege redesign',
      pitch: 'Over-permissioning is the most common real finding in cloud security. Fix it, and show your work.',
      deliverables: [
        'An over-permissioned IAM policy set (your own lab account) as the starting point',
        'A redesigned policy set following least privilege',
        'The reasoning for each permission removed or narrowed',
        'A test showing the redesigned policy still lets legitimate work happen',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'moderate',
    },
    {
      id: 'cloud-iac-scan',
      title: 'Infrastructure-as-code security scan',
      pitch: 'Catch the misconfiguration before it is ever deployed, not after.',
      deliverables: [
        'Terraform or CloudFormation for a small stack, written by you',
        'Scanned with an IaC security tool (Checkov, tfsec, or similar)',
        'Findings fixed in the code, with before/after diffs shown',
        'A note on which findings were real risk versus tool noise',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'moderate',
    },
    {
      id: 'cloud-logging-detection',
      title: 'Cloud logging and detection pipeline',
      pitch: 'Wire up real cloud logs and write detections for the attack patterns that actually happen.',
      deliverables: [
        'CloudTrail or Azure Activity Log feeding a SIEM or log store you control',
        'At least 3 detections for common cloud attack patterns (e.g. root login, policy changes, disabled logging)',
        'Each detection tested against a log event that should trigger it',
        'A note on log retention and cost tradeoffs you made',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'moderate',
    },
    {
      id: 'cloud-ir-tabletop',
      title: 'Cloud incident response tabletop',
      pitch: 'Simulate a cloud compromise in your own account and investigate it using only cloud-native logs.',
      deliverables: [
        'A simulated compromise you staged yourself in a lab account',
        'An investigation using only cloud-native logs (no hypervisor or host access assumed)',
        'A timeline of the simulated attacker\'s actions, reconstructed from logs',
        'Containment steps you would take, and why each one specifically helps',
      ],
      estimatedHours: '10 to 14 hours',
      difficulty: 'hard',
    },
  ],
  identity: [
    {
      id: 'iam-sso-integration',
      title: 'Real SSO integration project',
      pitch: 'Stand up an identity provider and integrate a real app with it, on the wire, not in theory.',
      deliverables: [
        'A self-hosted identity provider (Keycloak or similar)',
        'A real self-hosted app integrated via SAML or OIDC',
        'The authentication flow documented with the actual requests captured',
        'What went wrong during setup and how you diagnosed it, which is most of the real job',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'moderate',
    },
    {
      id: 'iam-access-review-tool',
      title: 'Access review automation',
      pitch: 'Find the stale and orphaned accounts nobody remembered to remove.',
      deliverables: [
        'A tool that flags stale or orphaned accounts from a sample directory export',
        'The rules it uses to flag an account, stated explicitly',
        'A sample run showing real (synthetic) findings',
        'A note on the false positives it produces and how you would tune them',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'moderate',
    },
    {
      id: 'iam-jit-access',
      title: 'A just-in-time privileged access workflow',
      pitch: 'Standing privilege is the problem. Build the workflow that replaces it.',
      deliverables: [
        'A request-and-approval workflow for temporary privileged access, implemented (even simply)',
        'The access automatically expiring, demonstrated',
        'An audit trail of who requested, approved, and used the access',
        'A note on what this replaces and why that is safer',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'moderate',
    },
    {
      id: 'iam-policy-audit',
      title: 'Cloud IAM policy audit',
      pitch: 'Privilege creep is invisible until somebody looks. Be the person who looks.',
      deliverables: [
        'A sample cloud IAM policy set audited for privilege creep',
        'Findings ranked by what they would actually let someone do',
        'Recommended narrower policies for the worst offenders',
        'A note on how you would prevent this from recurring, not just fix it once',
      ],
      estimatedHours: '6 to 10 hours',
      difficulty: 'accessible',
    },
    {
      id: 'iam-attack-path-lab',
      title: 'Identity attack path lab',
      pitch: 'Build on your own domain, run BloodHound against it, and show the path from user to admin.',
      deliverables: [
        'A small Active Directory lab you built and populated realistically',
        'BloodHound output showing at least one attack path to domain admin',
        'Remediation for each step in the path, not just the end',
        'A before/after: the path with your fixes applied, and whether it still works',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'hard',
    },
    {
      id: 'iam-ad-homelab',
      title: 'Active Directory home lab',
      pitch: 'Stand up a real domain top down and document it the way every entry-level sysadmin or IAM job actually expects.',
      deliverables: [
        'A domain controller you promoted yourself, with the reasoning for the prerequisites you checked first',
        'Users, groups, and an OU structure you designed, with the reasoning behind the layout',
        'At least one Group Policy you linked and verified with gpresult, not just the wizard saying success',
        'A client domain-joined and proven working end to end: a domain login, the GPO taking effect, and access to a resource gated by group membership',
      ],
      estimatedHours: '6 to 10 hours',
      difficulty: 'accessible',
    },
  ],
  'security-engineering': [
    {
      id: 'seceng-hardening',
      title: 'CIS benchmark hardening project',
      pitch: 'Harden a real system against a real benchmark, and show what broke when you did.',
      deliverables: [
        'A VM hardened against a CIS benchmark, with the automation you used (Ansible, PowerShell DSC, or a script)',
        'A before/after compliance score',
        'At least one thing that broke as a result of hardening, and how you handled it',
        'The automation committed so it is repeatable, not a one-off',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'moderate',
    },
    {
      id: 'seceng-segmentation',
      title: 'Network segmentation lab',
      pitch: 'Design boundaries that would actually contain an incident, not just look tidy on a diagram.',
      deliverables: [
        'A segmented lab network (VLANs or subnets) you built, not just designed',
        'A diagram of the segmentation and the reasoning behind each boundary',
        'A test showing traffic that should be blocked actually is',
        'A note on what an incident in one segment could and could not reach',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'moderate',
    },
    {
      id: 'seceng-logging-pipeline',
      title: 'Build the logging pipeline',
      pitch: 'Get real telemetry from real hosts into one place, at a cost you can justify.',
      deliverables: [
        'A pipeline (e.g. Filebeat or similar shipping into a log store) ingesting logs from at least 2 real hosts',
        'An architecture diagram of the pipeline',
        'A cost or volume tradeoff you made, and why',
        'A query against the pipeline that answers a real question',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'moderate',
    },
    {
      id: 'seceng-iac-baseline',
      title: 'A hardened baseline as infrastructure-as-code',
      pitch: 'Build the baseline once, correctly, so every server after it starts secure by default.',
      deliverables: [
        'Reusable IaC (Terraform, Ansible, or similar) that stands up a hardened baseline server',
        'The baseline decisions documented: what is disabled, what is enforced, and why',
        'A test proving a server built from it actually meets the baseline',
        'A note on what this baseline deliberately does not cover',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'moderate',
    },
    {
      id: 'seceng-change-gate',
      title: 'A security gate in a change pipeline',
      pitch: 'Build the check that stops an insecure change before it ships, not after.',
      deliverables: [
        'A small CI/CD pipeline that enforces at least one security check before a change is applied',
        'A change that fails the gate, and one that passes, both demonstrated',
        'The check\'s logic documented clearly enough for someone else to extend it',
        'A note on how you would roll this out without engineering revolting',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'moderate',
    },
  ],
  'ot-ics': [
    {
      id: 'ot-protocol-lab',
      title: 'Industrial protocol lab',
      pitch: 'Stand up a simulated PLC and learn what normal industrial traffic actually looks like.',
      deliverables: [
        'A simulated PLC (e.g. OpenPLC) running in an isolated lab',
        'Captured Modbus or DNP3 traffic, with the protocol fields explained',
        'A comparison of normal traffic versus at least one anomalous scenario you staged',
        'A note on why IT security instincts would get this protocol wrong',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'hard',
    },
    {
      id: 'ot-purdue-design',
      title: 'Purdue model network design',
      pitch: 'Design segmentation that never compromises a safety system, and show it working.',
      deliverables: [
        'A segmented lab network implementing Purdue model levels (even a simplified version)',
        'A diagram showing which levels can reach which, and why',
        'A test proving IT-level traffic cannot reach the simulated control level directly',
        'A note on where safety systems sit and why they are never on the same segment as anything else',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'hard',
    },
    {
      id: 'ot-honeypot',
      title: 'ICS honeypot',
      pitch: 'Deploy a low-interaction ICS honeypot safely and see what actually probes it.',
      deliverables: [
        'A low-interaction ICS honeypot (e.g. Conpot) run in an isolated environment, with the isolation explained',
        'A summary of what connected and what it attempted',
        'Your triage of the top few sessions: noise, or worth a closer look',
        'A note on how this differs from an IT honeypot',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'hard',
    },
    {
      id: 'ot-asset-discovery',
      title: 'Passive OT asset discovery',
      pitch: 'Find out what is actually on the plant network without sending a single active probe.',
      deliverables: [
        'A script that passively identifies devices from captured industrial protocol traffic',
        'Output in a structured inventory format',
        'A note on why active scanning is often unacceptable in OT, and what you did instead',
        'A comparison against what you expected to find on the network',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'moderate',
    },
    {
      id: 'ot-incident-case-study',
      title: 'Technical breakdown of a public ICS incident',
      pitch: 'Take a well-documented ICS incident apart and write the technical analysis, not the news summary.',
      deliverables: [
        'A public, well-documented ICS incident, cited',
        'A technical breakdown of how it happened, at the protocol or system level',
        'The control that would have prevented or limited it',
        'A note on why the OT context made this harder to catch than an equivalent IT incident',
      ],
      estimatedHours: '6 to 10 hours',
      difficulty: 'moderate',
    },
  ],
  'risk-governance': [
    {
      id: 'risk-full-assessment',
      title: 'Full risk assessment writeup',
      pitch: 'Produce the document a real risk committee would actually read.',
      deliverables: [
        'A risk assessment for a real or realistic hypothetical organisation, with assets identified first',
        'A risk register with likelihood, impact, and a defensible scoring method',
        'At least 10 risks scored and prioritised',
        'A one-page summary written for an executive who will read nothing else',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'moderate',
    },
    {
      id: 'risk-policy-suite',
      title: 'A realistic security policy suite',
      pitch: 'Write policy people would actually follow, not policy that exists to be filed.',
      deliverables: [
        'At least 3 real policies (e.g. acceptable use, incident response, access control)',
        'Each policy scoped to a stated, realistic organisation',
        'A note on how each policy would actually be enforced, not just stated',
        'A version history showing at least one revision and why you made it',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'accessible',
    },
    {
      id: 'risk-vendor-assessment',
      title: 'Third-party risk assessment',
      pitch: 'Assess a real vendor using only what they publish, without rubber-stamping them.',
      deliverables: [
        'A full vendor risk questionnaire, built by you',
        'A real assessment of a vendor\'s public security posture (their trust page, SOC 2 summary, etc.)',
        'At least one finding or open question you would not accept at face value',
        'A risk-based recommendation: approve, approve with conditions, or reject',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'accessible',
    },
    {
      id: 'risk-bcp-drp',
      title: 'Business continuity and disaster recovery plan',
      pitch: 'Write the plan that actually gets used at 3am, not the one that sits in a binder.',
      deliverables: [
        'A business impact analysis identifying critical functions and their recovery targets',
        'A full BCP/DRP for a realistic hypothetical organisation',
        'At least one tested scenario walked through against the plan',
        'A gap the walkthrough exposed, and how you would close it',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'moderate',
    },
    {
      id: 'risk-register-tool',
      title: 'A risk register that is not just a spreadsheet nobody opens',
      pitch: 'Build the tool that makes risk visible instead of buried in row 400.',
      deliverables: [
        'A structured risk register tool (a simple app, or a genuinely well-built spreadsheet system)',
        'A heat map or equivalent visualisation generated from real entries',
        'At least 15 sample risks scored through it',
        'A note on the scoring model it enforces and why you chose it',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'moderate',
    },
  ],
  'compliance-audit': [
    {
      id: 'audit-control-testing',
      title: 'Control testing walkthrough',
      pitch: 'Design and run a real control test, the way an auditor actually does it.',
      deliverables: [
        'A framework chosen (SOC 2, ISO 27001, or similar) and 5 controls selected from it',
        'A test procedure written for each control before you test it',
        'The tests executed against a sample environment, with evidence collected',
        'Findings written up with a rating you can defend under challenge',
      ],
      estimatedHours: '10 to 16 hours',
      difficulty: 'moderate',
    },
    {
      id: 'audit-evidence-repo',
      title: 'An evidence repository built properly',
      pitch: 'Show how you would actually organise proof that survives a sceptical reviewer.',
      deliverables: [
        'A structured evidence-collection template or repository',
        'At least 5 pieces of evidence collected and labelled to a real control',
        'A note on what makes evidence sufficient versus merely present',
        'A worked example of a reviewer challenging one piece, and how it holds up',
      ],
      estimatedHours: '6 to 10 hours',
      difficulty: 'accessible',
    },
    {
      id: 'audit-gap-assessment',
      title: 'Gap assessment against a public posture',
      pitch: 'Assess a real, public organisation\'s stated security posture against a framework.',
      deliverables: [
        'A framework chosen, and a real organisation\'s published security page or report as the input',
        'Gaps identified between what they claim and what the framework requires',
        'Each gap rated for how serious it actually is',
        'A recommendation for what should be closed first',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'moderate',
    },
    {
      id: 'audit-report-writeup',
      title: 'A complete formal audit report',
      pitch: 'Write the deliverable a client is actually paying for.',
      deliverables: [
        'A full audit report for a hypothetical engagement: scope, methodology, findings, ratings',
        'At least 5 findings, each with evidence and a remediation recommendation',
        'An executive summary a non-auditor could act on',
        'A rating scale defined up front and applied consistently throughout',
      ],
      estimatedHours: '8 to 14 hours',
      difficulty: 'moderate',
    },
    {
      id: 'audit-continuous-monitoring',
      title: 'A continuous control monitoring script',
      pitch: 'Automate the check instead of re-running it by hand every quarter.',
      deliverables: [
        'A script that checks a system\'s configuration against a compliance baseline automatically',
        'It run against both a compliant and a non-compliant configuration, both shown',
        'Output formatted for someone who is not the person who wrote the script',
        'A note on what this cannot catch and still needs a human for',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'moderate',
    },
  ],
  privacy: [
    {
      id: 'privacy-data-mapping',
      title: 'A real data mapping exercise',
      pitch: 'Find out what is actually held, which is almost never what anyone assumed.',
      deliverables: [
        'A data inventory for a realistic hypothetical organisation, or your own footprint across the services you use',
        'Data categorised by sensitivity and legal basis for holding it',
        'At least one surprising finding: data held that should not have been, or found somewhere unexpected',
        'A recommendation for what to do about that finding',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'accessible',
    },
    {
      id: 'privacy-dpia',
      title: 'A full privacy impact assessment',
      pitch: 'Assess a new system before it ever touches anyone\'s data.',
      deliverables: [
        'A DPIA for a realistic hypothetical new system or feature',
        'Data flows mapped: what is collected, why, and where it goes',
        'Risks identified and mitigations proposed for each',
        'A clear go / go-with-changes / no-go recommendation at the end',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'moderate',
    },
    {
      id: 'privacy-breach-playbook',
      title: 'Breach response and notification playbook',
      pitch: 'Write the playbook that actually gets followed when the legal clock starts.',
      deliverables: [
        'A breach response playbook with the legal notification clock mapped out explicitly',
        'Roles and responsibilities named for each step',
        'A worked example: a hypothetical breach walked through the playbook start to finish',
        'A gap the walkthrough exposed, and the fix',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'moderate',
    },
    {
      id: 'privacy-policy-review',
      title: 'A comparative privacy policy review',
      pitch: 'Review a real public privacy policy for clarity and gaps, without giving legal advice.',
      deliverables: [
        'A real company\'s public privacy policy, reviewed clause by clause',
        'Gaps or unclear language identified, with the specific clause quoted',
        'A rewritten version of at least 3 sections, clearer and more specific',
        'An explicit note that this is a clarity review, not legal advice',
      ],
      estimatedHours: '6 to 10 hours',
      difficulty: 'accessible',
    },
    {
      id: 'privacy-consent-design',
      title: 'Consent management design',
      pitch: 'Design the flow that makes consent real instead of a checkbox nobody reads.',
      deliverables: [
        'A consent management design for a hypothetical product, including withdrawal of consent',
        'Every consent decision mapped to what it actually unlocks or restricts',
        'A wireframe or flow diagram of the user-facing side',
        'A note on how this would be audited later to prove consent was actually given',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'moderate',
    },
  ],
  awareness: [
    {
      id: 'awareness-phishing-program',
      title: 'A non-punitive phishing simulation program',
      pitch: 'Design a program that teaches instead of humiliating people, and prove it with the metrics you\'d track.',
      deliverables: [
        'A full simulation program design: cadence, difficulty progression, and the debrief people get afterward',
        'At least 2 sample phishing templates, realistic but clearly your own',
        'The metrics you would track, chosen to reward reporting rather than punish clicking',
        'A note on what makes a program punitive by accident, and how this one avoids it',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'accessible',
    },
    {
      id: 'awareness-training-module',
      title: 'A real training module',
      pitch: 'Build one short module people would actually finish, and explain why it works.',
      deliverables: [
        'A short training module on one specific topic (e.g. password managers), built by you',
        'A "why this works" writeup grounded in how people actually decide under pressure',
        'A way to check whether it changed behaviour, not just whether it was completed',
        'A note on what you deliberately left out and why',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'accessible',
    },
    {
      id: 'awareness-metrics-dashboard',
      title: 'A human risk metrics dashboard',
      pitch: 'Track what actually predicts risk, not the click rate everyone defaults to.',
      deliverables: [
        'A mock dashboard (or well-structured spreadsheet system) tracking human risk metrics',
        'At least 3 metrics chosen specifically because they reflect behaviour, not completion',
        'Sample data showing the dashboard telling a story a click-rate chart would miss',
        'A note on a metric you deliberately excluded and why it would mislead',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'moderate',
    },
    {
      id: 'awareness-culture-campaign',
      title: 'A full security culture campaign',
      pitch: 'Design the campaign, not just the poster.',
      deliverables: [
        'A campaign design for a hypothetical organisation: messaging, cadence, and incentive structure',
        'At least 2 real pieces of content (a poster, an email, a short script)',
        'The reasoning behind the incentive structure, and why it does not reward hiding mistakes',
        'How you would measure whether the campaign actually changed anything',
      ],
      estimatedHours: '8 to 12 hours',
      difficulty: 'accessible',
    },
    {
      id: 'awareness-just-culture-case-study',
      title: 'A just-culture case study',
      pitch: 'Analyse a real human-error security incident without assigning blame, and show what that produces instead.',
      deliverables: [
        'A public, real human-error security incident, cited',
        'An analysis through a blameless / just-culture lens rather than a "who caused it" lens',
        'The systemic fix that follows from that lens, versus the individual-blame fix that would not have helped',
        'A note on why the blameless framing is not the same as no accountability',
      ],
      estimatedHours: '6 to 10 hours',
      difficulty: 'accessible',
    },
  ],
};

export function capstoneOptions(trackId: string): CapstoneOption[] {
  return CAPSTONES[trackId] ?? [];
}

export function capstoneOption(trackId: string, optionId: string): CapstoneOption | null {
  return capstoneOptions(trackId).find((option) => option.id === optionId) ?? null;
}
