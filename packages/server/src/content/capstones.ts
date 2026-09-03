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
 * Piloting on the two highest-traffic tracks (`soc`, `ai-security`) before
 * writing the same depth for the rest. Add a track's array here and its
 * capstone stage in tracks.ts together -- a stage with no options behind it
 * is exactly the kind of unreachable content career.test.ts exists to catch.
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
};

export function capstoneOptions(trackId: string): CapstoneOption[] {
  return CAPSTONES[trackId] ?? [];
}

export function capstoneOption(trackId: string, optionId: string): CapstoneOption | null {
  return capstoneOptions(trackId).find((option) => option.id === optionId) ?? null;
}
