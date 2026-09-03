/**
 * What the platform costs, and why the AI Security specialisation costs more.
 *
 * WHY PRICING IS CONTENT AND NOT CONFIGURATION
 *
 * Because the numbers need reasons attached, and a reason that lives in an
 * environment variable is a reason nobody reads. Every price below carries the
 * justification a student would ask for if they were in the room, and the
 * justification is reviewable in a pull request alongside the number.
 *
 * THE HONESTY RULE FOR THIS FILE
 *
 * The AI Security specialisation costs more than the standard one. There is
 * exactly one defensible reason for that: the sessions need somebody who has
 * actually done this work, and there are very few of those people, and it is
 * stated plainly rather than dressed up as "premium content". Where a higher
 * price would be hard to justify, the price is not higher: the solo path
 * includes AI Foundations and AI Security at no extra cost, because a
 * self-paced learner reading the same content is not consuming a scarce
 * instructor.
 *
 * NOTHING HERE CHARGES ANYBODY. This module describes the commercial model so
 * the product surfaces can show it accurately. Billing is not implemented.
 */

import type { CertStudyOffer } from '@soc/shared';

export interface PriceLine {
  id: string;
  label: string;
  /** USD. Zero means genuinely included. */
  amountUsd: number;
  /** 'month' | 'session' | 'once' */
  per: 'month' | 'session' | 'once';
  /** Why it costs this. Shown to the student, not kept for internal use. */
  rationale: string;
}

export interface PlanTier {
  id: string;
  title: string;
  audience: string;
  lines: PriceLine[];
  /** What somebody gets. Concrete, no bullet-point marketing. */
  includes: string[];
  /** What they do NOT get, stated before they ask. */
  excludes: string[];
}

export const PLANS: PlanTier[] = [
  {
    id: 'solo',
    title: 'Solo, self-paced',
    audience:
      'Anybody working through the material on their own, at whatever pace their life allows.',
    lines: [
      {
        id: 'solo-base',
        label: 'Base subscription',
        amountUsd: 20,
        per: 'month',
        rationale:
          'Covers hosting, the simulated environments, and content maintenance. One price for every track, because the cost of serving a risk-and-governance learner and an AI security learner is the same.',
      },
      {
        id: 'solo-ai',
        label: 'AI Foundations and AI Security',
        amountUsd: 0,
        per: 'month',
        rationale:
          'Included. A self-paced learner reading this material costs no more to serve than one reading the Linux package, and charging extra for it would only mean gatekeeping the newest content behind the ability to pay.',
      },
    ],
    includes: [
      'Every track, foundation, and package, including AI Foundations and AI Security',
      'The terminal, the alert queue, and the Model Lab',
      'The Career Fit Analyzer and the capability baseline',
      'Your portfolio, exportable',
    ],
    excludes: [
      'Live sessions with other people',
      'Anything graded by a human',
      'A certificate: this platform does not issue one, and one it issued would not be worth anything',
    ],
  },
  {
    id: 'peer-soc',
    title: 'Peer SOC sessions',
    audience:
      'Small teams working an incident together on a schedule, each person in a different role.',
    lines: [
      {
        id: 'peer-base',
        label: 'Base subscription',
        amountUsd: 20,
        per: 'month',
        rationale: 'The same subscription as solo. Sessions are charged on top, per session run.',
      },
      {
        id: 'peer-seat',
        label: 'Standard role seat',
        amountUsd: 15,
        per: 'session',
        rationale:
          'Covers the scenario, the facilitation tooling, and the shared incident state for one person in one session.',
      },
      {
        id: 'peer-ai-seat',
        label: 'AI Security Analyst seat',
        amountUsd: 25,
        per: 'session',
        rationale:
          'Ten dollars more, for one reason: the AI Security track runs against models that have to be configured and reviewed per scenario, and a session including this role needs somebody who has done the work to prepare and debrief it. There are very few of those people, and that scarcity is the whole of the difference. It is not better content.',
      },
    ],
    includes: [
      'A scheduled incident worked by several people at once, each in a different role',
      'A shared incident state, so what one person finds changes what the others see',
      'A debrief comparing what each role concluded',
    ],
    excludes: [
      'An instructor. Peer sessions are run by the participants',
      'Any guarantee that a session runs: it needs enough people to fill the roles',
    ],
  },
  {
    id: 'instructor',
    title: 'Instructor-led',
    audience:
      'People who want scheduled sessions with somebody experienced running them, twice a week.',
    lines: [
      {
        id: 'instructor-standard',
        label: 'Standard SOC specialisation',
        amountUsd: 60,
        per: 'month',
        rationale:
          'Two sessions a week with an instructor, plus everything in the solo plan. Almost all of this is the instructor’s time.',
      },
      {
        id: 'instructor-ai',
        label: 'AI Security specialisation',
        amountUsd: 90,
        per: 'month',
        rationale:
          'Thirty dollars more for the same two sessions a week. The difference is entirely who can run them: an instructor who has genuinely assessed deployed models is rare and is paid accordingly, and pretending otherwise would mean either underpaying them or running the sessions with somebody who has only read about it.',
      },
    ],
    includes: [
      'Two scheduled sessions a week, run by an instructor',
      'Written feedback on your findings and your reports, which is the part self-study cannot replace',
      'Everything in the solo plan',
    ],
    excludes: [
      'A job. Nobody can sell you that, and anybody who implies it is lying',
      'Any promise about salary. The figures quoted around AI security are for people who were already senior somewhere else',
    ],
  },
];

/**
 * The framing shown alongside any price.
 *
 * Present for the same reason `CERT_PHILOSOPHY` is: without it, a price list
 * quietly implies that paying more gets you further, and for most people on
 * this platform that is not true.
 */
export const PRICING_PHILOSOPHY = {
  headline: 'Paying more buys somebody else’s time, not better content.',
  body: [
    'Every track, package, and exercise is in the base subscription. There is no tier where the good material lives, because a training platform that withholds the useful half from people who cannot pay is not a training platform.',
    'What the higher tiers buy is scheduled time with other people, and in the instructor tiers, feedback from somebody who has done the work. That is genuinely valuable and genuinely scarce, and it is the only thing the price difference reflects.',
    'The AI Security specialisation costs more than the standard one. That is about how few people can credibly teach it, not about the subject being more important. If you are working through it alone, it costs you nothing extra, and the material is identical.',
  ],
} as const;

/**
 * Certification study help, shown at the end of every career track.
 *
 * WHY IT IS PRICED SEPARATELY FROM THE SUBSCRIPTION
 *
 * Because it is a different thing. The subscription teaches the job. This buys
 * a run at a specific exam: one certification, one window, question banks and
 * objective-by-objective drilling against a published syllabus that somebody has
 * to keep current every time the vendor revises it. Somebody studying for
 * Security+ in March and CySA+ in August is buying two windows, not renting a
 * library forever, and a per-certification window is the honest shape for that.
 *
 * WHY IT IS NOT BUILT YET
 *
 * It is not written. `status: 'coming-soon'` is load-bearing: the interface
 * reads it and refuses to offer a purchase, for the same reason a track with no
 * content says so rather than looking playable.
 */
export const CERT_STUDY_PLAN: CertStudyOffer = {
  status: 'coming-soon',
  headline: 'Certification study help is coming.',
  amountUsd: 15,
  windowDays: 30,
  includes: [
    'One certification at a time, for thirty days from the day you start it',
    'The published exam objectives broken into study sessions, with practice questions per objective',
    'Practice exams that report which objectives you are weak on rather than only a score',
    'Guidance on when you are actually ready to book, which is the question most people get wrong',
  ],
  excludes: [
    'The exam itself. You book and pay the vendor directly, and their fee is listed on each certification above',
    'A pass. Nobody can sell you that either',
    'Anything that would breach an exam NDA. Dumps are not study material and holding them can void your certification',
  ],
  rationale:
    'Fifteen dollars for thirty days on one certification. It is priced per certification because keeping a question bank honest against a vendor syllabus is work that has to be redone every time the syllabus moves, and priced low because the exam fee is already the expensive part.',
} as const;

/** Prerequisite guidance shown before somebody buys into the AI path. */
export const AI_PATH_NOTE =
  'AI Security is not an entry point and this platform will not sell it to you as one. It expects ' +
  'the AI Foundations package first, and it expects enough security grounding to know what a ' +
  'finding is worth. Realistically that is a year or more of other work before the specialisation ' +
  'is the right thing to be paying for. AI Foundations on its own is included in the base ' +
  'subscription and is a reasonable place to start regardless of where you end up.';
