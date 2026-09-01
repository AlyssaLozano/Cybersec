/**
 * What each kind of wrong command actually costs.
 *
 * WHY THESE ARE SHARED AND NOT WRITTEN PER OPTION
 *
 * The five candidates offered at beginner are not five random strings. Four of
 * them are real mistakes, and across twenty-five scenarios the same four
 * mistakes recur, because they come from the same four misunderstandings rather
 * than from the incident.
 *
 * Somebody who does not yet know their environment searches the filesystem for
 * a log whose location is written in the runbook. Somebody who has learned that
 * `wc -l` gives a number reaches for it when they needed to see the lines.
 * Somebody who wants to be helpful restarts the service. Somebody who wants to
 * understand connects to the attacker's host.
 *
 * Writing those lessons out per option would be five hundred and ninety chances
 * to say the same thing five hundred and ninety slightly different ways, and a
 * student who meets "you already know where the logs are" in scenario 3 and a
 * reworded version of it in scenario 11 learns it once rather than twice. So
 * the recurring lessons live here and are referenced by category, and an option
 * whose mistake is specific to its incident carries its own text instead.
 *
 * THE TWO HARMFUL CATEGORIES ARE DIFFERENT IN KIND
 *
 * `mutate` and `touch-attacker` are not inefficient, they are damaging: one
 * destroys the evidence and the other tells the attacker somebody is looking.
 * They are marked `harmful` so scoring can treat them as worse than a wasted
 * minute, which is what they are.
 */

export const DISTRACTOR_CATEGORIES = [
  'status-check',
  'broad-search',
  'dump-all',
  'count-only',
  'wrong-target',
  'touch-attacker',
  'mutate',
] as const;
export type DistractorCategory = (typeof DISTRACTOR_CATEGORIES)[number];

export interface DistractorLesson {
  teaches: string;
  harmful?: boolean;
}

export const DISTRACTOR_LESSONS: Record<DistractorCategory, DistractorLesson> = {
  'status-check': {
    teaches:
      'This tells you the service is running. It does not tell you what it did, who asked it to, ' +
      'or when. Health checks answer "is it up", and the question here is "what happened", which ' +
      'is a different question that the same tooling will happily not answer.',
  },
  'broad-search': {
    teaches:
      'Searching the filesystem for a log whose location you already know spends minutes you do ' +
      'not have. In a live incident you are working against a clock and against an attacker who ' +
      'is not waiting. Knowing where your own evidence lives is preparation, not investigation.',
  },
  'dump-all': {
    teaches:
      'This gives you everything and no way through it. Thousands of lines scroll past and the one ' +
      'that mattered is somewhere in the middle. Reading raw logs is not the same as reading ALL ' +
      'the logs: decide what you are looking for before you open the file.',
  },
  'count-only': {
    teaches:
      'A count tells you how many and nothing else. Not who, not from where, not whether any of ' +
      'them succeeded. The number is the least informative thing in the data, and reaching for it ' +
      'first is how an investigation ends with a statistic instead of a finding.',
  },
  'wrong-target': {
    teaches:
      'Right idea, wrong thing to point it at. The command would work; it is asking about a host, ' +
      'an account or a window that is not the one in front of you. Check what you are querying ' +
      'against what the event actually names.',
  },
  'touch-attacker': {
    harmful: true,
    teaches:
      'This reaches out and touches the attacker infrastructure, which tells whoever is on the ' +
      'other end that somebody is looking at them. What follows is usually that the address goes ' +
      'dark, the tooling changes, and the evidence you had not collected yet stops existing. ' +
      'Passive first, always: work from what you already hold before you make a request that has ' +
      'your organisation on the other end of it.',
  },
  mutate: {
    harmful: true,
    teaches:
      'This changes the system you are investigating. Ownership, permissions, a restart or a kill ' +
      'all alter state, and altered state is evidence you can no longer stand behind: timestamps ' +
      'move, volatile data goes, and a defence lawyer has a straightforward argument that the ' +
      'record was contaminated after the fact. Preserve first, then act.',
  },
};

/*
 * Spread into an option to attach its lesson:
 *
 *   { command: 'systemctl status named', ...STATUS_CHECK }
 *
 * Each carries `correct: false`, so the only way an option becomes the answer is
 * an author writing `correct: true` explicitly. A migration or a copy-paste
 * cannot promote a distractor by accident.
 */
export const STATUS_CHECK = { correct: false as const, ...DISTRACTOR_LESSONS['status-check'] };
export const BROAD_SEARCH = { correct: false as const, ...DISTRACTOR_LESSONS['broad-search'] };
export const DUMP_ALL = { correct: false as const, ...DISTRACTOR_LESSONS['dump-all'] };
export const COUNT_ONLY = { correct: false as const, ...DISTRACTOR_LESSONS['count-only'] };
export const WRONG_TARGET = { correct: false as const, ...DISTRACTOR_LESSONS['wrong-target'] };
export const TOUCH_ATTACKER = { correct: false as const, ...DISTRACTOR_LESSONS['touch-attacker'] };
export const MUTATE = { correct: false as const, ...DISTRACTOR_LESSONS.mutate };

/**
 * The lesson on the correct option.
 *
 * Deliberately general. What makes a command right is specific to its event, and
 * the event already says it twice: `commandNudge` names the question at
 * intermediate and `why` explains the finding at debrief. A third bespoke
 * paragraph per option would be five hundred and ninety opportunities to
 * contradict one of the other two.
 *
 * What this adds is the reason the SHAPE was right, which is the part that
 * transfers to the next incident.
 */
export const CORRECT_STEP =
  'This is the one that moves the investigation. It goes at the specific question the event ' +
  'raises, against the specific source that can answer it, and it comes back with something you ' +
  'can act on rather than something you have to read through. That shape is what to reach for ' +
  'next time: name the question first, then pick the narrowest command that answers it.';
