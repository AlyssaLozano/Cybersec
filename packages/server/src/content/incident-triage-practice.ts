/**
 * Optional practice drills for Alert Triage.
 *
 * Same rules as Linux Fundamentals and Log Analysis: drills never gate progression, never appear in
 * the completion percentage, and never affect a pass. They exist for repetition,
 * so the skill is identical and only the target changes.
 *
 * WHY THERE ARE FEWER DRILLS HERE
 *
 * A drill is only worth writing when repeating the same skill against a
 * different target teaches something. That is true of "extract the addresses
 * from this log" and it is largely false of "write the on-call procedure" —
 * doing that twice teaches nothing the first attempt did not. So the triage
 * exercises carry drills and the written-judgement ones mostly do not, rather
 * than padding every exercise to a uniform five.
 *
 * As everywhere else, expected answers are COMPUTED from the generated corpus.
 */

import type { PracticeItem } from '@soc/shared';

import { alertsRequiring, queueForStudent } from '../services/alerts.js';

const INTRO = 'q-intro';
const NOISY = 'q-noisy-rule';
const NIGHT = 'q-nightshift';
const WINDOW = 'q-correlation';

function idsByRule(queueId: string, ruleId: string): string[] {
  return (queueForStudent(queueId)?.alerts ?? [])
    .filter((alert) => alert.ruleId === ruleId)
    .map((alert) => alert.id);
}

/** Alerts in a queue at or above a given severity, for severity-sorting drills. */
function idsBySeverity(queueId: string, severity: string): string[] {
  return (queueForStudent(queueId)?.alerts ?? [])
    .filter((alert) => alert.severity === severity)
    .map((alert) => alert.id);
}

const INTRO_DISMISS = alertsRequiring(INTRO, 'dismiss');
const INTRO_SCANNER = idsByRule(INTRO, 'fw-inbound-block');
const NIGHT_ESCALATE = alertsRequiring(NIGHT, 'escalate');
const NIGHT_STAGING = idsByRule(NIGHT, 'archive-of-sensitive-path');
const NIGHT_BEACON = idsByRule(NIGHT, 'egress-uncategorised-destination');
const NIGHT_HIGH = idsBySeverity(NIGHT, 'high');
const NOISY_MONITORING = idsByRule(NOISY, 'auth-failed-password');
const WINDOW_INCIDENT = alertsRequiring(WINDOW, 'escalate');
const WINDOW_CONNTRACK = idsByRule(WINDOW, 'net-conntrack-exhaustion');

export const INCIDENT_TRIAGE_PRACTICE: Record<string, PracticeItem[]> = {
  'triage.1.1': [
    {
      id: 'triage.1.1-p1',
      prompt:
        'Same queue. This time dismiss only the firewall-block alerts — the ones where an inbound ' +
        'connection to a closed port was dropped. Leave everything else undecided.',
      solution: `Dismiss ${INTRO_SCANNER.join(', ')}.`,
      checks: [
        {
          type: 'triage-selection',
          decision: 'dismiss',
          alertIds: INTRO_SCANNER,
          forbidExtra: true,
          hint:
            'Only the blocked-inbound-connection alerts. A dropped packet to a closed port is the ' +
            'firewall working, and there is no next step.',
        },
      ],
    },
    {
      id: 'triage.1.1-p2',
      prompt:
        'Dismiss every alert in this queue whose correct disposition is closure without a rule ' +
        'change — the ordinary administration and the blocked scanning, but not the noisy rule.',
      solution: `Dismiss ${INTRO_DISMISS.join(', ')}.`,
      checks: [
        {
          type: 'triage-accuracy',
          decision: 'dismiss',
          minRecall: 0.9,
          minPrecision: 0.8,
          hint:
            'Close the benign true positives and the blocked scans. The repeating ' +
            'failed-authentication alerts are a rule problem, not a dismissal.',
        },
      ],
    },
  ],

  'triage.1.2': [
    {
      id: 'triage.1.2-p1',
      prompt:
        'In the full night-shift queue, find every alert rated HIGH severity and decide each one on ' +
        'its content rather than its rating. Escalate only those that genuinely warrant it.',
      solution:
        'Of the high-severity alerts, only those belonging to the intrusion warrant escalation. The ' +
        'SQL keyword rule and the connection-tracking rule are both rated high and both wrong.',
      checks: [
        {
          type: 'triage-accuracy',
          decision: 'escalate',
          minPrecision: 0.7,
          hint:
            'Several high-severity alerts here are defective rules. Severity is a claim, not a ' +
            'finding — read what each one actually describes.',
        },
        {
          type: 'triage-budget',
          decision: 'escalate',
          max: NIGHT_HIGH.length,
          hint: 'You have escalated more alerts than there are high-severity ones to consider.',
        },
      ],
    },
  ],

  'triage.1.5': [
    {
      id: 'triage.1.5-p1',
      prompt:
        'The night-shift queue with a much harder cap: at most three escalations. You cannot cover ' +
        'the whole intrusion — choose the three that would most change what happens next, and ' +
        'justify one of them.',
      solution:
        `With three slots, escalate the data staging (${NIGHT_STAGING[0]}), the successful login, ` +
        'and the persistence mechanism. The staging alert is the one that triggers breach ' +
        'obligations; the login establishes the compromise; the cron entry is what containment ' +
        'would otherwise miss.',
      checks: [
        {
          type: 'triage-budget',
          decision: 'escalate',
          max: 3,
          hint: 'Three escalations at most. This is a forced-choice drill.',
        },
        {
          type: 'triage-accuracy',
          decision: 'escalate',
          minPrecision: 1,
          hint:
            'With only three slots, every one has to belong to the intrusion. Anything else is a ' +
            'slot spent on something that changes nothing.',
        },
      ],
    },
  ],

  'triage.2.1': [
    {
      id: 'triage.2.1-p1',
      prompt:
        'Flag for tuning every alert from the repeating failed-authentication rule, and nothing ' +
        'else in this queue.',
      solution: `Flag all ${NOISY_MONITORING.length} failed-authentication alerts for tuning.`,
      checks: [
        {
          type: 'triage-selection',
          decision: 'tune',
          alertIds: NOISY_MONITORING,
          forbidExtra: true,
          hint:
            'Every alert from that one rule, and only those. The other alerts in this queue are ' +
            'either correct-and-dull or a genuine attack.',
        },
      ],
    },
  ],

  'triage.2.5': [
    {
      id: 'triage.2.5-p1',
      prompt:
        'In the twenty-minute correlation window, find the alert describing connection-tracking ' +
        'exhaustion and give it the disposition its evidence supports.',
      solution:
        `Flag ${WINDOW_CONNTRACK.join(', ')} for tuning. The rule asserts a denial of service; the ` +
        'traffic volume at the time was within normal range. The table is undersized.',
      checks: [
        {
          type: 'triage-selection',
          decision: 'tune',
          alertIds: WINDOW_CONNTRACK,
          hint:
            'The rule claims a denial of service. Check the detail field for what the traffic ' +
            'volume actually was.',
        },
      ],
    },
  ],

  'triage.3.1': [
    {
      id: 'triage.3.1-p1',
      prompt:
        'Same window, inverted: dismiss or flag everything that does NOT belong to the intrusion, ' +
        'leaving only the incident alerts escalated.',
      solution: `Escalate only ${WINDOW_INCIDENT.join(', ')}; dispose of the rest.`,
      checks: [
        {
          type: 'triage-accuracy',
          decision: 'escalate',
          minPrecision: 1,
          minRecall: 1,
          hint:
            'Exact coverage this time — every incident alert escalated, nothing else. Work out ' +
            'which alerts share an actor.',
        },
      ],
    },
  ],

  'triage.4.1': [
    {
      id: 'triage.4.1-p1',
      prompt:
        'Night-shift queue, command-and-control only: escalate the alert describing repeating ' +
        'outbound connections to an uncategorised destination, and nothing else.',
      solution: `Escalate ${NIGHT_BEACON.join(', ')} — a fixed fifteen-minute interval with almost no jitter.`,
      checks: [
        {
          type: 'triage-selection',
          decision: 'escalate',
          alertIds: NIGHT_BEACON,
          forbidExtra: true,
          hint:
            'One alert describes outbound connections recurring at a fixed interval. Regularity is ' +
            'the tell, not the destination.',
        },
      ],
    },
    {
      id: 'triage.4.1-p2',
      prompt:
        'Escalate every alert in the night-shift queue that involves the backdoor account created ' +
        'during the intrusion, and nothing else.',
      solution:
        'The backdoor account appears in the cron change, the outbound beacon, the key-based login, ' +
        'and the archive staging.',
      checks: [
        {
          type: 'triage-accuracy',
          decision: 'escalate',
          minPrecision: 1,
          hint:
            'Filter by user. Four alerts name the account that did not exist before 10:22. Anything ' +
            'outside that set costs you precision.',
        },
        {
          type: 'triage-budget',
          decision: 'escalate',
          max: NIGHT_ESCALATE.length,
          hint: 'You have escalated more alerts than the intrusion contains in total.',
        },
      ],
    },
  ],
};
