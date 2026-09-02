/**
 * Scenario 57: Three Signatures.
 *
 * A loan needs three people by design, so that no one person can write money to
 * themselves. Three people is not a control if the three people know each
 * other.
 *
 * WHAT THIS TEACHES
 *
 * That segregation of duties fails silently, and that every individual action
 * in a collusive fraud is legitimate.
 *
 * Nobody exceeded their authority here. The originator originated, the assessor
 * assessed, the approver approved, and each of them did exactly the job they
 * are paid to do, within limits, on applications they were entitled to handle.
 * There is no single record anywhere in the estate that looks wrong. The fraud
 * is not in any action; it is in the composition of the three.
 *
 * WHY CO-OCCURRENCE IS WHERE YOU LOOK, NOT WHAT YOU FOUND
 *
 * The three appear together on 89 files in six months where random routing
 * predicts about two. That is a very strong number and it is not yet evidence,
 * because two other groups co-occur just as heavily and they are a night shift
 * and a language specialist queue. People who work together co-occur. The
 * question co-occurrence answers is where to look next.
 *
 * WHAT ACTUALLY SETTLES IT
 *
 * These three sit in different teams, on different sites, on different shifts,
 * and the routing engine would never place them on the same file. All 89 files
 * were pulled out of the automatic queue by hand, each step reassigned by the
 * person about to perform it, a median of forty seconds after the previous step
 * completed. Somebody had to choose, 267 times.
 *
 * AND WHAT THE FLOOR HANDS ON
 *
 * Not a prosecution. Financial crime have powers this floor does not, the 89
 * borrowers may include victims rather than accomplices, and suspending three
 * people in three teams tells a fourth person, if there is one, that it is time
 * to stop.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';
import {
  ALSO_WORKS,
  COUNT_ONLY,
  CORRECT_STEP,
  DUMP_ALL,
  MUTATE,
  STATUS_CHECK,
  WRONG_TARGET,
} from './distractors.js';

const ID = 'three-signatures';

export const THREE_SIGNATURES: Scenario = {
  id: ID,
  title: 'Three Signatures',
  difficulty: 'advanced',
  durationMinutes: 75,
  situation:
    'It is Thursday morning at Fenmarch Credit Union. Internal audit sampled forty loan files and ' +
    'three of them were handled end to end by the same three members of staff.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'forensics',
    'cloud-security',
    'detection-engineer',
    'fusion-analyst',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Audit sampling found the same three names on three of forty files',
      detail:
        'Internal audit pulled forty loan files at random for the quarterly control test. Three of ' +
        'them were originated by h.mabry, assessed by s.okwuosa and approved for disbursement by ' +
        'g.pryde. All three staff acted within their authority limits, all three files passed the ' +
        'control test, and audit recorded no exception. The observation was passed on as a ' +
        'courtesy. Rule history: no rule exists on loan file staffing.',
      source: 'internal audit',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 160,
      surface: 'raw-log',
      summary: 'The same three appear together on 89 files in six months',
      detail:
        'Across 4,118 loans originated in the last six months, h.mabry, s.okwuosa and g.pryde ' +
        'appear as the originator, assessor and approver on 89. Given the volumes each of them ' +
        'handles individually and the way work is routed, the expected number of files carrying ' +
        'all three is between one and three. Every one of the 89 completed normally and every one ' +
        'was disbursed.',
      source: 'loan origination system',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'raw-log',
      summary: 'Two other groups of three co-occur just as heavily',
      detail:
        'Running the same comparison across every possible trio finds two others well above ' +
        'expectation: one group of three appears together on 64 files and another on 51. The first ' +
        'three are the Tuesday and Wednesday night shift at the Kingsport site, who are the only ' +
        'staff working those hours. The second three are the only Spanish-language assessors in the ' +
        'society and receive that queue exclusively.',
      source: 'loan origination system',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 500,
      surface: 'cloud-audit',
      summary: 'These three should never land on the same file',
      detail:
        'h.mabry is in the Fremont origination team on earlies. s.okwuosa is a credit assessor at ' +
        'the Kingsport site on lates. g.pryde is in the central disbursement team and works ' +
        'remotely. They are in three different reporting lines, on three different sites, on three ' +
        'different shift patterns, and share no queue. The routing engine assigns by queue, ' +
        'availability and authority limit, and would place all three on one file by chance ' +
        'roughly twice a year.',
      source: 'workforce systems',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 680,
      surface: 'raw-log',
      summary: 'All 89 files were pulled out of the automatic queue by hand',
      detail:
        'Every one of the 89 files carries three manual reassignment records, one before each ' +
        'stage, each performed by the account that then completed that stage. The median interval ' +
        'between one stage completing and the next stage being reassigned is 41 seconds. Of the ' +
        '4,029 other files in the period, 137 carry any manual reassignment at all and 9 carry ' +
        'more than one.',
      source: 'loan origination system',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 860,
      surface: 'alert-queue',
      summary: 'Every one of the 89 sits just under the four-signature threshold',
      detail:
        'All 89 advances fall between 22,000 and $24,900. Loans of 25,000 and above require ' +
        'a fourth signature from a lending manager. Across the full six months the average advance ' +
        'is 11,400 and 6 per cent of all loans fall in the 22,000 to 25,000 band. In these 89 it ' +
        'is 100 per cent. The total advanced across the 89 files is just over $2.07 million.',
      source: 'loan origination system',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 1020,
      surface: 'network-flow',
      summary: 'The three have never communicated on any corporate channel',
      detail:
        'Six months of mail, chat and calendar records contain no message of any kind between any ' +
        'two of the three, no shared meeting, and no shared distribution list beyond society-wide ' +
        'announcements. For comparison, the Kingsport night shift trio exchanged 1,900 chat messages ' +
        'in the same period, and the median for any two staff who appear on more than ten files ' +
        'together is 240.',
      source: 'communications platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.8',
      atSeconds: 1180,
      surface: 'alert-queue',
      summary: 'The 89 loans are live and the borrowers may not all be accomplices',
      detail:
        'All 89 advances have been disbursed and 81 are performing normally with payments up to ' +
        'date. Freezing the accounts stops collection and puts the credit union in default of its own ' +
        'terms with the account holders. Some of the named borrowers may be real people whose ' +
        'identities were used. Suspending three staff across three sites on the same morning is ' +
        'visible to the entire lending function within the hour.',
      source: 'commercial operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1340,
      surface: 'raw-log',
      summary: 'Manual reassignment happens 1,100 times a month for good reasons',
      detail:
        'Manual reassignment out of the automatic queue is used for sickness cover, escalation, ' +
        'authority limits and language routing, and occurs around 1,100 times a month across the ' +
        'lending function. No control exists on it. No control exists on trio co-occurrence ' +
        'either, and no alert has ever fired on either pattern. The four-signature threshold at ' +
        '25,000 has not been reviewed since 2019.',
      source: 'detection coverage',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.10',
      atSeconds: 1500,
      surface: 'alert-queue',
      summary: 'The night shift trio also reassign files by hand',
      detail:
        'The Kingsport night shift trio carry manual reassignments on 12 of their 64 shared files. ' +
        'All 12 reference a sickness cover ticket in the reassignment note, all 12 were reassigned ' +
        'by a duty supervisor rather than by the person completing the stage, and the amounts ' +
        'across their 64 files range from 900 to 31,000 with a mean of 10,900. Their 1,900 chat ' +
        'messages include the shift handover thread.',
      source: 'loan origination system',
      claimedSeverity: 'medium',
    },
  ],
};

export const THREE_SIGNATURES_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Loan origination at Fenmarch requires three people by design: an originator, a credit assessor and a disbursement approver, so that no single person can advance money.',
    'Over six months h.mabry, s.okwuosa and g.pryde appear together on 89 of 4,118 files, where routing predicts between one and three.',
    'They are in three different reporting lines, on three different sites, on three different shift patterns, and share no queue. The routing engine would put them on one file together about twice a year.',
    'All 89 files were pulled out of the automatic queue by hand: three manual reassignments each, one before each stage, each performed by the account that then completed that stage, a median of 41 seconds after the previous stage closed. That is 267 deliberate choices.',
    'Every one of the 89 advances falls between 22,000 and $24,900, immediately below the 25,000 threshold that requires a fourth signature from a lending manager. Across all lending in the period that band holds 6 per cent of files. Here it holds 100 per cent.',
    'The three have exchanged no message on any corporate channel in six months, where the median for two staff sharing more than ten files is 240.',
    'Two other trios co-occur heavily and are innocent: the Kingsport night shift, who are the only people working those hours, and the only three Spanish-language assessors in the credit union.',
    'Every individual action taken by all three was within their authority and passed every control test the credit union operates.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1078.003'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.reset-password', 'act.declare'],
      escalateTo: ['log-analyst', 'ir-lead'],
      why:
        'Audit found nothing, and that is not a figure of speech: all three files passed the ' +
        'control test, every action was inside its authority limit, and no exception was raised. ' +
        'They passed the observation on as a courtesy, which is the weakest possible signal and is ' +
        'also the only kind this fraud can ever generate, because a scheme built out of ' +
        'individually correct actions cannot fail a test that examines actions individually. Three ' +
        'out of forty is the whole of it. Do not reach for what it might mean and do not touch a ' +
        'name; the one thing worth doing is asking whether three out of forty is more than it ' +
        'should be, and that question is answerable from data nobody has looked at yet.',
      standIn:
        'Audit sampled forty files, three had the same three names, everything passed and nobody ' +
        'raised an exception. That is the strongest signal a scheme made of individually correct ' +
        'actions can ever produce, which is to say almost none. Three out of forty. I want to know ' +
        'what three out of forty should look like before anybody says a word about these people.',
      commandOptions: [
        { command: "awk -F, '{print $4, $5, $6}' /var/log/loans/audit-sample.csv | sort | uniq -c | sort -rn", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -iE "mabry|okwuosa|pryde" /var/log/loans/audit-sample.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status loan-origination', ...STATUS_CHECK },
        { command: 'cat /var/log/loans/audit-sample.csv', ...DUMP_ALL },
        { command: 'grep -c mabry /var/log/loans/audit-sample.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Work out how often three named people should land on the same file by chance.',
      guidance:
        'Nothing failed a test here. Ask whether the coincidence is bigger than chance allows.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1078.003'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.reset-password', 'act.isolate'],
      escalateTo: ['fusion-analyst', 'cloud-security'],
      why:
        'Eighty-nine where one to three is expected, out of 4,118, and every one of the 89 ' +
        'completed normally and was disbursed. That is an enormous number and the temptation it ' +
        'creates is to stop here, which would be a mistake for a reason that has nothing to do ' +
        'with caution and everything to do with what the number is. Co-occurrence measures ' +
        'togetherness, and people who work together are together: a shift, a site, a specialist ' +
        'queue and a small team all produce this. The right next move is the one that tries to ' +
        'break the finding, which is to run the same comparison across every trio in the credit union ' +
        'and see who else comes out high. If nobody does, the number is even stronger. If somebody ' +
        'does, you have learned what the number cannot tell you before you say it out loud.',
      standIn:
        'Eighty-nine files out of 4,118 carry all three of them, and expectation is one to three. ' +
        'All 89 completed and disbursed. That is a huge number and I do not want to stop on it, ' +
        'because co-occurrence just measures togetherness and people who work together are ' +
        'together. Running the same comparison across every possible trio in the credit union before ' +
        'anybody says this means anything.',
      commandOptions: [
        { command: "awk -F, '{print $4\"|\"$5\"|\"$6}' /var/log/loans/files-6mo.csv | sort | uniq -c | sort -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$4==\"h.mabry\" && $5==\"s.okwuosa\" && $6==\"g.pryde\"' /var/log/loans/files-6mo.csv | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status loan-origination', ...STATUS_CHECK },
        { command: 'cat /var/log/loans/files-6mo.csv', ...DUMP_ALL },
        { command: 'grep -c g.pryde /var/log/loans/files-6mo.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Count how often these three appear together, then count it for every other trio too.',
      guidance:
        'Before you report a number as unusual, find out what the other numbers look like.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'soc-operator'],
      correctActions: ['act.corroborate', 'act.investigate-hold'],
      outOfLaneActions: ['act.attribute-named', 'act.triage-high', 'act.isolate', 'act.reset-password'],
      escalateTo: ['fusion-analyst'],
      why:
        'The check that saves the case, arriving in the form of two groups who look just as guilty ' +
        'and are not. Sixty-four files for three people who are the only staff on the Kingsport ' +
        'night shift, and fifty-one for the only three Spanish-language assessors in the credit union. ' +
        'Both numbers are far above chance and both have a one-sentence explanation, which is the ' +
        'point: co-occurrence is a property of how work is allocated, not of intent. Two things ' +
        'follow. The 89 is no longer sufficient on its own, and anybody presenting it as proof can ' +
        'be dismantled by a lawyer holding this row. And there is now a question worth asking that ' +
        'nobody had thought to ask, which is what allocation would explain these three, because ' +
        'the two innocent trios each have an obvious one and it is not obvious what this one would ' +
        'be.',
      standIn:
        'Two other trios come out just as high. Sixty-four for the Kingsport night shift, who are the ' +
        'only people awake at that hour, and fifty-one for the only three Spanish-language assessors ' +
        'we have. Both far above chance, both explained in a sentence. So co-occurrence is about ' +
        'how work is allocated, not intent, and the 89 on its own would be taken apart by any ' +
        'lawyer holding this. New question: what allocation would put our three together? The ' +
        'other two have an obvious answer.',
      commandOptions: [
        { command: "awk -F, '{print $4\"|\"$5\"|\"$6}' /var/log/loans/files-6mo.csv | sort | uniq -c | sort -rn | head -5", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -iE "night|spanish" /var/log/workforce/teams.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status loan-origination', ...STATUS_CHECK },
        { command: 'cat /var/log/workforce/teams.csv', ...DUMP_ALL },
        { command: 'grep -c . /var/log/loans/files-6mo.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out who the other high-scoring trios are and what they have in common.',
      guidance:
        'Try to break your own finding before somebody else does.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1078.003'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.corroborate'],
      outOfLaneActions: ['act.revoke-key', 'act.attribute-named', 'act.reset-password', 'act.dismiss'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'The answer to the question ev.3 raised, and it is the opposite of the two innocent trios. ' +
        'Fremont earlies, Kingsport lates, and central disbursement working remotely: three ' +
        'reporting lines, three sites, three shift patterns, no shared queue. The night shift are ' +
        'together because they are the only people there and the Spanish-language assessors are together ' +
        'because they are the only people who can do it, and both of those are the routing engine ' +
        'behaving normally. Here the routing engine behaving normally puts these three on one file ' +
        'about twice a year, and something put them on 89. That flips the whole shape of the ' +
        'investigation. Up to this point the question was whether the number could be explained ' +
        'innocently; from here the question is mechanical, and it has a definite answer somewhere ' +
        'in the routing records. Somebody or something overrode the assignment 89 times and there ' +
        'will be a log of it.',
      standIn:
        'Opposite of the other two trios. Fremont earlies, Kingsport lates, and central disbursement ' +
        'working from home. Three reporting lines, three sites, three shift patterns, no shared ' +
        'queue. The night shift are together because they are the only ones there; these three the ' +
        'router would put together about twice a year. Something overrode the assignment 89 times, ' +
        'and that leaves a record. That is where I would go next.',
      commandOptions: [
        { command: "awk -F, '$1 ~ /mabry|okwuosa|pryde/ {print $1, $3, $4, $5}' /var/log/workforce/staff.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -iE "mabry|okwuosa|pryde" /var/log/workforce/shifts.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status routing-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/workforce/staff.csv', ...DUMP_ALL },
        { command: 'net user g.pryde /active:no /domain', ...MUTATE },
      ],
      commandNudge:
        'Find out what team, site and shift each of the three is on, and how the router assigns ' +
        'work.',
      guidance:
        'The innocent trios were together for a reason. Ask what reason would put these three ' +
        'together.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1078.003'],
      firstResponder: 'forensics',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.attribute-named', 'act.reset-password', 'act.isolate', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'This is the evidence, and everything before it was navigation. Three manual reassignments ' +
        'on every one of the 89 files, one before each stage, each performed by the account that ' +
        'then completed that stage. That is 267 individual acts of taking a file out of the queue ' +
        'it was routed to and giving it to yourself, and it removes coincidence entirely: a ' +
        'statistical pattern can be argued with and 267 deliberate choices cannot. The median gap ' +
        'of 41 seconds is the second finding, because it says the next person was already waiting ' +
        'when the previous stage closed, on a different site and a different shift, which is ' +
        'coordination whether or not anybody ever said so out loud. And the comparison makes it ' +
        'unarguable: 137 of the other 4,029 files carry any manual reassignment at all and 9 carry ' +
        'more than one. Seal the reassignment records first and the loan records second. The ' +
        'reassignment log is the case.',
      standIn:
        'Here it is, and everything up to now was just navigation. All 89 files, three manual ' +
        'reassignments each, one before each stage, each done by the account that then did that ' +
        'stage. Two hundred and sixty-seven separate decisions to take a file out of its queue and ' +
        'hand it to yourself. Median gap 41 seconds, so the next person was waiting, on a ' +
        'different site and a different shift. And 137 of the other 4,029 files have any manual ' +
        'reassignment at all, 9 have more than one. Sealing the reassignment log first. That is ' +
        'the case.',
      commandOptions: [
        { command: "awk -F, '$3==\"REASSIGN\" {print $2, $4, $5}' /var/log/loans/routing.csv | sort | uniq -c | sort -rn", correct: true, teaches: CORRECT_STEP },
        { command: 'sha256sum /var/log/loans/routing.csv | tee /evidence/routing.csv.sha256', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status routing-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/loans/routing.csv', ...DUMP_ALL },
        { command: 'grep -c REASSIGN /var/log/loans/routing.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out how each of the 89 files reached each person, and who did the reassigning.',
      guidance:
        'Something put them together against the routing. Go and find the record of it.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1078.003'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['soc-operator', 'ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'One hundred per cent of 89 files in a band that holds 6 per cent of all lending, and the ' +
        'band ends exactly where a fourth signature begins. Twenty-two to twenty-four thousand nine ' +
        'hundred, against a portfolio average of 11,400, with the lending manager required at ' +
        'twenty-five. Each of those files is individually unremarkable, because a 24,000 pound ' +
        'loan is a completely ordinary thing for this credit union to write, and that is what makes the ' +
        'distribution the finding rather than any file. The value is doing two things at once: ' +
        'maximising the take per file, and keeping a fourth person out of a control that was ' +
        'designed for exactly this. Somebody knew where the threshold was, which is not secret ' +
        'information and does not narrow anything, and worked immediately underneath it 89 times, ' +
        'which is not something anybody does by accident. Put the total in the readout, because ' +
        'two point zero seven million is the number that decides how seriously the credit union treats ' +
        'tomorrow.',
      standIn:
        'All 89 sit between twenty-two thousand and twenty-four nine, and twenty-five is where a ' +
        'lending manager has to sign. That band holds six per cent of our lending and a hundred ' +
        'per cent of these. Average advance across the book is 11,400. Every single file is ' +
        'ordinary on its own, which is the point: the distribution is the finding. It maximises ' +
        'the take and keeps the fourth signature out of a control built for exactly this. Total ' +
        'across the 89 is two point zero seven million.',
      commandNudge:
        'Look at the amounts on those 89 files against the amounts on everything else, and find ' +
        'out what happens at the top of that band.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1078.003'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.investigate-hold'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Nothing, across six months, and nothing is the finding. No mail, no chat, no shared ' +
        'meeting, no distribution list beyond society-wide announcements, between any two of three ' +
        'people who handled 89 files together. The comparison is what gives it force: the median ' +
        'for any two staff appearing on more than ten files together is 240 messages, and the ' +
        'night shift trio managed 1,900. Working together generates chatter, because you need to ' +
        'ask somebody to hurry up, or explain why a file is odd, or complain. Nothing at all is ' +
        'not the absence of a relationship, it is the shape of a relationship being kept off the ' +
        'systems that record it. Be careful how this is worded in the report. It closes off the ' +
        'innocent reading that these three simply had an informal working habit, and it is not ' +
        'evidence of what was said, because whatever was said happened somewhere this floor cannot ' +
        'see and never will.',
      standIn:
        'Six months, and nothing. No mail, no chat, no shared meeting, no list between any two of ' +
        'them. Median for two people who share more than ten files is 240 messages, and the night ' +
        'shift trio have 1,900. You cannot work 89 files with somebody without ever asking them to ' +
        'hurry up. Zero is not no relationship, it is a relationship kept off the systems that ' +
        'record it. And it tells us nothing about what was said, because that happened somewhere ' +
        'we cannot see.',
      commandOptions: [
        { command: "awk -F, '$2 ~ /mabry|okwuosa|pryde/ && $3 ~ /mabry|okwuosa|pryde/' /var/log/comms/messages.csv | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -iE "mabry|okwuosa|pryde" /var/log/comms/calendar.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -sn 203.0.113.0/24', ...WRONG_TARGET },
        { command: 'cat /var/log/comms/messages.csv', ...DUMP_ALL },
        { command: 'grep -c mabry /var/log/comms/messages.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Count the messages between them, then count them for two people who normally share ten ' +
        'files.',
      guidance:
        'Find out what a normal amount of chatter between two colleagues looks like first.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'collection',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.attribute-named', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'Three obvious actions and all three cost more than they buy. Freezing the 89 accounts ' +
        'stops collection on 81 that are performing, puts the credit union in default of its own terms, ' +
        'and lands hardest on any borrower who is a victim rather than a participant, which nobody ' +
        'can currently tell apart. Suspending three staff across three sites on one morning is ' +
        'known to the whole lending function within the hour, and if there is a fourth person the ' +
        'floor has not found, that is the moment they stop. Cutting the three accounts is the same ' +
        'act with a technical costume on. What is available is a control change that applies to ' +
        'everybody and therefore signals nothing: require a supervisor to perform manual ' +
        'reassignment rather than the person taking the file, which breaks the mechanism outright ' +
        'and is defensible as something that should always have been true, and put the 22,000 to ' +
        '25,000 band under mandatory second review, which removes the shape of the fraud without ' +
        'naming anybody. Both touch 200 staff, so neither reads as an investigation. Check the ' +
        'rollback on the routing change before it goes anywhere near a Friday. Deliberately left ' +
        'undone: no account is suspended and no loan is frozen tonight, because financial crime ' +
        'have the powers and the mandate for that and this floor has neither.',
      standIn:
        'All three obvious moves cost more than they buy. Freezing the 89 stops collection on 81 ' +
        'performing accounts, defaults our own terms, and hits any borrower who is a victim rather ' +
        'than a participant, and we cannot currently tell which. Suspending three people across ' +
        'three sites is known to the whole function within the hour, and if there is a fourth we ' +
        'have not found, that is when they stop. Cutting their accounts is the same act in a ' +
        'technical costume. What we can do applies to everybody: manual reassignment has to be ' +
        'done by a supervisor and not by the person taking the file, which breaks the mechanism, ' +
        'and mandatory second review on the twenty-two to twenty-five band. Two hundred staff ' +
        'affected, so it signals nothing. Rollback written before we touch routing. Deliberately ' +
        'left undone: nobody suspended, nothing frozen. Financial crime have the powers for that ' +
        'and we do not.',
      commandNudge:
        'Find out how many of the 89 loans are performing before you propose freezing any of them.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1078.003'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Two candidate signals and the naive version of each is unusable. Manual reassignment ' +
        'happens 1,100 times a month for sickness, escalation, authority limits and language ' +
        'routing, so alerting on it is 1,100 alerts a month and the floor will suppress it inside ' +
        'two weeks. Trio co-occurrence has the ev.3 problem: the night shift and the Spanish-language ' +
        'assessors top the list every month forever. The version that works is the intersection ' +
        'and it is cheap, because it is exactly what discriminated tonight: a file where every ' +
        'stage was manually reassigned by the account that then completed it. Nine files in six ' +
        'months outside the 89, which is a rule that fires once or twice a month and means ' +
        'something every time. Say the other part too, because it is the more important finding ' +
        'and it is not a detection at all. A threshold that has not moved since 2019 is a threshold ' +
        'that inflation has quietly lowered every year, and every fraud that works underneath it ' +
        'is worth more in real terms than it was when somebody chose the number.',
      standIn:
        'Naive versions of both signals are unusable. Manual reassignment is 1,100 a month for ' +
        'sickness and escalation, so that is 1,100 alerts and we suppress it in two weeks. Trio ' +
        'co-occurrence puts the night shift and the Spanish-language assessors top of the list every month ' +
        'forever. The intersection is cheap and is what actually discriminated: a file where every ' +
        'stage was manually reassigned by the person who then did it. Nine of those in six months ' +
        'outside our 89. And the bigger finding is not a rule. The twenty-five thousand threshold ' +
        'has not moved since 2019, so inflation has been lowering it every year and every fraud ' +
        'underneath it is worth more than when somebody picked the number.',
      commandOptions: [
        { command: "awk -F, '$3==\"REASSIGN\" && $4==$5 {print $2}' /var/log/loans/routing.csv | sort | uniq -c | awk '$1==3'", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c REASSIGN /var/log/loans/routing-30d.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/loans/routing.csv', ...DUMP_ALL },
        { command: 'grep -c . /var/log/loans/routing.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Count how often manual reassignment happens legitimately before you propose alerting on ' +
        'it.',
      guidance:
        'You have two signals. Find out how noisy each one is on its own.',
    },
    {
      eventId: 'ev.10',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.attribute-named', 'act.declare'],
      escalateTo: [],
      why:
        'The night shift trio reassign files by hand too, which arrives at the worst possible ' +
        'moment and is entirely innocent on three separate tests. All 12 reassignments cite a ' +
        'sickness cover ticket, all 12 were performed by a duty supervisor rather than by the ' +
        'person about to complete the stage, and their amounts run from 900 to 31,000 with a mean ' +
        'of 10,900, which is the shape of an ordinary book rather than a band beneath a threshold. ' +
        'Any one of those closes it and the middle one is the real discriminator, because who did ' +
        'the reassigning is the difference between cover and self-dealing. Close it. The row is ' +
        'here because a floor that has just found its first collusive fraud will start reading ' +
        'every group of colleagues as a conspiracy, and the people most exposed to that are the ' +
        'night shift, whose entirely normal working pattern looks like collusion to anybody ' +
        'counting co-occurrence without asking why.',
      standIn:
        'The night shift reassign by hand as well, and it is clean on three separate tests. All ' +
        'twelve cite a sickness cover ticket, all twelve were done by a duty supervisor rather ' +
        'than the person completing the stage, and their amounts run 900 to 31,000 with a mean of ' +
        '10,900, which is a normal book and not a band under a threshold. The middle one is the ' +
        'real difference: who did the reassigning separates cover from helping yourself. Closing ' +
        'it.',
      commandOptions: [
        { command: "awk -F, '$3==\"REASSIGN\" && $4!=$5 {print $4, $6}' /var/log/loans/routing.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "sickness\\|cover" /var/log/loans/routing.csv | head -20', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status routing-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/loans/routing.csv', ...DUMP_ALL },
        { command: 'grep -c REASSIGN /var/log/loans/routing.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check who performed each of those reassignments, not just that they happened.',
      guidance:
        'Reassignment is not the finding on its own. Ask what was different about the other ones.',
    },
  ],
};
