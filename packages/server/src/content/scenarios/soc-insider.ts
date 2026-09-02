/**
 * Scenario 67: One Of Ours.
 *
 * The alert that should have caught tonight's intrusion was tuned away eight
 * weeks ago, in three small steps, by somebody who is on shift right now.
 *
 * WHAT THIS TEACHES
 *
 * That the security function is inside its own threat model, and that a floor
 * has almost no practice at investigating itself.
 *
 * Every control this scenario depends on is one the SOC operates. The person
 * under investigation can read the case notes about them, can see which
 * searches are being run, holds the tooling that would normally be used to
 * contain a suspect, and is sitting eight feet away. Nothing about the ordinary
 * response works, and the instinct to move fast is the instinct that tips them
 * off.
 *
 * WHY NO SINGLE ACTION LOOKS WRONG
 *
 * Three tuning changes, each narrowing a rule slightly, each with a ticket, each
 * defensible on its own terms and approved by nobody because tuning needs no
 * approval. Forty-one alerts closed as false positives on one set of hosts,
 * which is only visible as a pattern when set against the same analyst's
 * disposition rate everywhere else. The finding does not exist in any record. It
 * exists in the comparison between records.
 *
 * WHAT THE EVIDENCE DOES NOT ESTABLISH
 *
 * Why. A person being paid and a person being frightened produce identical
 * tuning tickets, and the searches this account ran at two in the morning for
 * its own username fit fear better than confidence without proving either. The
 * floor's output is what was done, to what effect, and a clear statement that
 * the reason is a question for people with powers it does not have.
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
  TOUCH_ATTACKER,
  WRONG_TARGET,
} from './distractors.js';

const ID = 'one-of-ours';

export const ONE_OF_OURS: Scenario = {
  id: ID,
  title: 'One Of Ours',
  difficulty: 'advanced',
  durationMinutes: 75,
  situation:
    'It is 21:15 at Ardal Freight. Something is moving through the customer portal segment and the ' +
    'rule that covers it has not fired once. The night shift is three people and one of them ' +
    'tuned that rule.',
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
      summary: 'A partner escalation names activity our own tooling never reported',
      detail:
        'A logistics partner emailed at 20:50 to say their fraud team is seeing consignment ' +
        'bookings created through the Ardal customer portal with delivery addresses that do not ' +
        'match the paying account. Fourteen in the last nine days. The Ardal detection covering ' +
        'anomalous booking creation has not fired once in that period. Rule history: that rule ' +
        'fired 140 times in the sixty days before, and zero times in the last nine.',
      source: 'partner escalation',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.2',
      atSeconds: 160,
      surface: 'raw-log',
      summary: 'The rule was narrowed three times in eight weeks',
      detail:
        'Detection ADF-D-0311 has been edited three times: on 8 July an exclusion for the partner ' +
        'API service account, on 29 July an exclusion for bookings created inside business hours ' +
        'from office ranges, and on 21 August a minimum consignment value threshold of $500. ' +
        'Each edit reduced firing volume. Together they exclude every booking made from the ' +
        'customer portal under $500, which is 71 per cent of all bookings.',
      source: 'detection platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'alert-queue',
      summary: 'All three edits are by one analyst and all three tickets read as tuning',
      detail:
        'All three edits were made by t.marchetti, a senior SOC analyst of four years. Each cites a ' +
        'tuning ticket describing false positive volume, and each ticket is written in the same ' +
        'style as the eleven other tuning tickets that analyst raised this year, all of which were ' +
        'sound. Tuning requires no second approver at Ardal. Nobody reviewed any of the three.',
      source: 'detection platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 480,
      surface: 'raw-log',
      summary: 'The same analyst closed forty-one of forty-four alerts on those hosts',
      detail:
        'Before the edits, alerts on the customer portal booking hosts were closed as false ' +
        'positive by t.marchetti in 41 of 44 cases. That analyst\'s false positive rate on the ' +
        'same rule class across every other host is 58 per cent, and the floor average on that ' +
        'class is 61 per cent. On these hosts it is 93 per cent. The three not closed were closed ' +
        'by other analysts on nights t.marchetti was not on shift.',
      source: 'case management',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 640,
      surface: 'cloud-audit',
      summary: 'Searches at two in the morning, from home, on nights off',
      detail:
        'The SIEM search log records 26 sessions by t.marchetti between 01:40 and 02:30 on nights ' +
        'not scheduled, from a residential address. The searches are for the string "marchetti", for ' +
        'the analyst\'s own case identifiers, for the term "investigation", and for the customer ' +
        'portal booking hosts. Remote SIEM access outside shift is permitted and eleven other ' +
        'analysts have used it this quarter.',
      source: 't.marchetti',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 800,
      surface: 'network-flow',
      summary: 'Bookings are being created right now from one address block',
      detail:
        'Since 20:10 this evening, 31 consignment bookings have been created through the customer ' +
        'portal from 198.51.100.212, all under $500, all with delivery addresses in three ' +
        'ZIP codes, all paid from six member accounts whose registered addresses are elsewhere. ' +
        'The same address block created 140 bookings over the previous nine days. None generated ' +
        'an alert.',
      source: '198.51.100.212',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 960,
      surface: 'host-artefact',
      summary: 'The suspect holds the tooling that would normally be used to contain a suspect',
      detail:
        't.marchetti holds administrative access to the detection platform, the case management ' +
        'system, the SIEM and the endpoint agent console, which is standard for a senior analyst on ' +
        'nights. That console can isolate any host in the estate, including a colleague\'s ' +
        'workstation, and shows who else is logged into it. The case management system emails a ' +
        'notification to any analyst named in a new case.',
      source: 'ADF-SOC-04',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1120,
      surface: 'alert-queue',
      summary: 'Coerced and complicit produce the same records',
      detail:
        'Nothing in any available system distinguishes an analyst being paid from an analyst being ' +
        'threatened. Both raise defensible tuning tickets, both close alerts they are entitled to ' +
        'close, and both are careful. The 26 searches for the analyst\'s own name, own case ' +
        'identifiers and the word "investigation" are consistent with somebody checking whether ' +
        'they have been noticed. There is no communication, no payment record and no admission ' +
        'anywhere in reach.',
      source: 'incident assessment',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1280,
      surface: 'alert-queue',
      summary: 'The night shift is three people and this is one of them',
      detail:
        'Night cover is three analysts until 07:00. Removing one leaves two for the whole estate on ' +
        'the night an active fraud is running. Suspending the account is visible to the person ' +
        'holding it within seconds. Reverting the three detection edits is visible in the platform ' +
        'change feed, which all three analysts on shift can see. The customer portal takes 4,000 ' +
        'legitimate bookings a night.',
      source: 'SOC operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.10',
      atSeconds: 1440,
      surface: 'raw-log',
      summary: 'Nothing reviews a tuning change, ever',
      detail:
        'Detection edits at Ardal require no second approver, carry no expiry, and are not reviewed ' +
        'on any schedule. Four hundred and ten edits were made in the last year by nine analysts. ' +
        'No report exists showing which rules have lost coverage over time, and no alert exists ' +
        'for a rule whose firing volume drops to zero. ADF-D-0311 going from 140 firings in sixty ' +
        'days to none in nine produced no signal of any kind.',
      source: 'detection coverage',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.11',
      atSeconds: 1600,
      surface: 'alert-queue',
      summary: 'Another analyst has a ninety per cent false positive rate',
      detail:
        'The same disposition comparison flags r.oyelowo, whose false positive rate on detection ' +
        'ADF-D-0288 is 90 per cent. Every analyst who has touched that rule closes it at between ' +
        '86 and 94 per cent, it has an open tuning ticket raised by three different people, and ' +
        'the vendor has acknowledged a matching logic defect. r.oyelowo has no unusual rate on any ' +
        'other rule.',
      source: 'case management',
      claimedSeverity: 'medium',
    },
  ],
};

export const ONE_OF_OURS_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Detection ADF-D-0311 covers anomalous consignment booking creation on the Ardal customer portal. It fired 140 times in sixty days and has not fired in nine.',
    'It was edited three times in eight weeks by t.marchetti, a senior analyst of four years: a partner API exclusion on 8 July, a business hours and office range exclusion on 29 July, and a 500 pound minimum consignment value on 21 August. Each edit is defensible alone. Together they exclude 71 per cent of all bookings.',
    'Tuning at Ardal requires no second approver, carries no expiry and is reviewed on no schedule. Nobody looked at any of the three.',
    'Before the edits, the same analyst closed 41 of 44 alerts on those hosts as false positive. That analyst closes the same rule class at 58 per cent everywhere else, and the floor average is 61 per cent. The three not closed were closed by other people on nights they were not on shift.',
    'Since 20:10 tonight, 31 bookings have been created from one external address, all under $500, all delivering to three ZIP codes, all paid from six member accounts registered elsewhere. The same block created 140 bookings over the previous nine days. None alerted.',
    'The SIEM search log records 26 sessions by that analyst between 01:40 and 02:30 on nights they were not scheduled, from a residential address, searching for their own name, their own case identifiers and the word "investigation".',
    'What was done is established. Why is not, and nothing available distinguishes an analyst being paid from an analyst being threatened.',
    'The analyst is on shift now, holds administrative access to the detection platform, case management, the SIEM and the endpoint console, and the case system emails anybody named in a new case.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1562.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'detection-engineer'],
      why:
        'Somebody else found this, and that is the first fact worth stating rather than the last. ' +
        'A partner fraud team has fourteen cases over nine days and the Ardal detection covering ' +
        'exactly that behaviour has not fired once, against 140 firings in the preceding sixty ' +
        'days. A rule going from more than two a day to nothing is not quiet, it is broken or ' +
        'blinded, and either of those is worth declaring on before anybody knows which. Note what ' +
        'has to be resisted here: the natural next move is to ask the floor what happened to that ' +
        'rule, out loud, in the room. Hold that until somebody has established who changed it, ' +
        'because the answer might be sitting at the next desk and there is no way to un-ask the ' +
        'question.',
      standIn:
        'A partner found this, not us. Fourteen fraudulent bookings over nine days and our rule for ' +
        'exactly that has not fired once, against 140 firings in the sixty days before. Two a day ' +
        'to zero is broken or blinded and both are worth declaring on. And nobody asks the floor ' +
        'what happened to that rule out loud until we know who changed it.',
      commandOptions: [
        { command: "awk -F, '$3==\"ADF-D-0311\" {print substr($1,1,10)}' /var/log/detection/firings.csv | uniq -c | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c "ADF-D-0311" /var/log/detection/firings.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/detection/firings.csv', ...DUMP_ALL },
        { command: 'curl -s http://198.51.100.212/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Plot that rule\'s firing volume by day and find where it stops.',
      guidance:
        'The rule did not fire. Ask whether it used to.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1562.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['detection-engineer', 'fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.tune', 'act.dismiss', 'act.isolate'],
      escalateTo: ['detection-engineer', 'ir-lead'],
      why:
        'Three edits, eight weeks, and the shape is the finding rather than any one of them. A ' +
        'partner API service account exclusion is the most ordinary tuning change there is. A ' +
        'business hours and office range exclusion is what every noisy rule eventually gets. A 500 ' +
        'pound minimum value is a judgement anybody could defend. Read them one at a time and ' +
        'there is nothing to see, which is presumably the point of doing it in three steps eight ' +
        'weeks apart rather than one. Read them together and they exclude every portal booking ' +
        'under $500, which is 71 per cent of all bookings and, not coincidentally, the ' +
        'entire population the fraud is operating in. Build the combined effect rather than ' +
        'listing the changes, because the combined effect is the only form in which this is ' +
        'visible and no record anywhere states it.',
      standIn:
        'Three edits over eight weeks and the shape is the finding, not any one of them. Partner API ' +
        'exclusion, business hours and office range exclusion, 500 pound minimum value. Each one is ' +
        'the most ordinary tuning change there is. Together they exclude every portal booking under ' +
        '$500, which is 71 per cent of bookings and the exact population the fraud is running ' +
        'in. That combined effect is written down nowhere. You only get it by working it out.',
      commandOptions: [
        { command: "awk -F, '$2==\"ADF-D-0311\" {print $1, $4, $5}' /var/log/detection/edits.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'diff /evidence/detection/0311-v1.yaml /evidence/detection/0311-v4.yaml', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/detection/edits.csv', ...DUMP_ALL },
        { command: 'grep -c ADF-D-0311 /var/log/detection/edits.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'List every edit to that rule and work out what the edits exclude when applied together.',
      guidance:
        'Each change looks reasonable. Ask what they add up to.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1562.001'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.backtest', 'act.corroborate'],
      outOfLaneActions: ['act.write-rule', 'act.attribute-named', 'act.dismiss', 'act.tune'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'One name on all three, and this is the moment the incident changes shape. Be careful about ' +
        'what the name establishes, because the pull toward a conclusion here is enormous and the ' +
        'evidence is not there yet. This analyst raised eleven other tuning tickets this year and ' +
        'all eleven were sound, which cuts both ways: it is the record of somebody competent, and ' +
        'it is also what makes three more tickets in the same voice unremarkable to anybody ' +
        'reviewing them. Nobody did review them, because tuning needs no second approver. So what ' +
        'is established is that one person made three changes that combine into a blind spot, and ' +
        'what is not established is whether they meant to. Say precisely that and hand it upward: ' +
        'from this row the investigation involves a colleague, and that is a decision about people ' +
        'rather than detections.',
      standIn:
        'All three are t.marchetti, and I want to be careful about what that means. Eleven other ' +
        'tuning tickets this year and every one of them sound, which is the record of somebody ' +
        'good at this and also why three more in the same voice went unnoticed. Nobody reviewed ' +
        'them because tuning needs no approver. Established: one person made three changes that ' +
        'combine into a blind spot. Not established: whether they meant to. This is going upward ' +
        'now, because it stopped being about a detection.',
      commandOptions: [
        { command: "awk -F, '$2==\"ADF-D-0311\" {print $3}' /var/log/detection/edits.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$3==\"t.marchetti\"' /var/log/detection/edits.csv | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/detection/edits.csv', ...DUMP_ALL },
        { command: 'net user t.marchetti /active:no /domain', ...MUTATE },
      ],
      commandNudge:
        'Find out who made each of the three edits and whether anybody approved them.',
      guidance:
        'Somebody made those changes. Ask who, and who checked.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1562.001'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'The pattern before the tuning, and it is the row that makes the rest hard to explain ' +
        'innocently. Forty-one of forty-four alerts on these hosts closed as false positive by one ' +
        'analyst. Taken alone that means nothing, because 93 per cent is not far from the 61 per ' +
        'cent floor average and a busy analyst has bad nights. What it has to be set against is ' +
        'the same analyst on the same rule class everywhere else, which is 58 per cent, below the ' +
        'floor average rather than above it. So this is not somebody who closes things carelessly; ' +
        'it is somebody careful whose care stops on one set of hosts. The three that were not ' +
        'closed that way were handled by other people on nights this analyst was not there, which ' +
        'is the control case appearing by accident. Present it as the comparison rather than the ' +
        'number: 93 against their own 58 is the finding, and 93 on its own is an accusation ' +
        'anybody could take apart.',
      standIn:
        'Forty-one of forty-four closed false positive on those hosts by one analyst. On its own ' +
        'that is nothing, 93 per cent against a floor average of 61. What matters is that the same ' +
        'analyst runs 58 per cent on the same rule class everywhere else, which is better than the ' +
        'floor. This is not somebody careless. It is somebody careful whose care stops on one set ' +
        'of hosts. And the three that were not closed that way were handled by other people on ' +
        'nights they were not in. I am reporting the comparison, not the 93, because the 93 on its ' +
        'own falls apart.',
      commandOptions: [
        { command: "awk -F, '$4==\"t.marchetti\" {print $5, $6}' /var/log/cases/dispositions.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$5==\"FALSE_POSITIVE\" {print $4}' /var/log/cases/dispositions.csv | sort | uniq -c | sort -rn", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status casemgmt', ...STATUS_CHECK },
        { command: 'cat /var/log/cases/dispositions.csv', ...DUMP_ALL },
        { command: 'grep -c FALSE_POSITIVE /var/log/cases/dispositions.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Compare that analyst\'s false positive rate on these hosts against their rate everywhere ' +
        'else.',
      guidance:
        'A high close rate is not a finding by itself. Ask what to compare it against.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'discovery',
      techniques: ['T1518.001'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.corroborate'],
      outOfLaneActions: ['act.revoke-key', 'act.attribute-named', 'act.reset-password', 'act.dismiss'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'Twenty-six sessions between 01:40 and 02:30, from home, on nights not scheduled, and the ' +
        'searches are the part that matters rather than the hour. Remote access outside shift is ' +
        'permitted and eleven other analysts used it this quarter, so the access itself is not a ' +
        'finding. What they searched for is: their own surname, their own case identifiers, the ' +
        'word "investigation", and the portal booking hosts. Three of those four have nothing to ' +
        'do with any incident and everything to do with whether anybody is looking at them. Hold ' +
        'the interpretation loosely and say why: somebody checking whether they have been noticed ' +
        'is doing what a frightened person does and also what a careful accomplice does, and this ' +
        'row cannot separate them. What it does establish is awareness. Whatever else is true, ' +
        'this account has spent five weeks checking for signs of an investigation, which means any ' +
        'action taken tonight that is visible in the tooling will be seen.',
      standIn:
        'Twenty-six sessions, 01:40 to 02:30, from home, on nights off. The access is allowed and ' +
        'eleven other analysts used it this quarter, so that is not the finding. The searches are: ' +
        'their own surname, their own case numbers, the word investigation, and the portal booking ' +
        'hosts. Three of those four have nothing to do with any incident and everything to do with ' +
        'whether anybody is looking at them. That is what a frightened person does and what a ' +
        'careful accomplice does and I cannot tell those apart. What it does prove is awareness. ' +
        'Anything we do tonight that shows up in the tooling will be seen.',
      commandOptions: [
        { command: "awk -F, '$2==\"t.marchetti\" {print $1, $4}' /var/log/siem/search-history.csv | tail -30", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$2==\"t.marchetti\" {print $3}' /var/log/siem/search-history.csv | sort | uniq -c", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status siem', ...STATUS_CHECK },
        { command: 'cat /var/log/siem/search-history.csv', ...DUMP_ALL },
        { command: 'grep -c marchetti /var/log/siem/search-history.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at what those out-of-hours searches were actually for.',
      guidance:
        'Working late is not a finding. Ask what they were searching for.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1078'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'mitigation-specialist'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate', 'act.dismiss'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'While the floor investigates its own tooling, the fraud is still running, and this row ' +
        'exists to keep that in front of everybody. Thirty-one bookings since 20:10 from one ' +
        'address block, every one under $500, every one delivering into three ZIP codes, ' +
        'every one paid from a member account registered somewhere else. The under-500 detail is ' +
        'the one to say out loud, because it is not a coincidence and it is not a preference: it ' +
        'is the threshold from the 21 August edit, which means whoever is booking knows exactly ' +
        'where the line is. That is a fact about the relationship between the fraud and the tuning ' +
        'and it does not depend on resolving anybody\'s motive. A hundred and forty over the ' +
        'previous nine days and none of it alerted, so the immediate operational question is ' +
        'whether tonight\'s consignments can be stopped before they move, which is a different ' +
        'clock from the personnel question.',
      standIn:
        'This is still running while we investigate ourselves. Thirty-one bookings since 20:10 from ' +
        'one block, all under $500, all into three ZIP codes, all paid from member accounts ' +
        'registered elsewhere. The under-500 part is the bit to say out loud: that is the exact ' +
        'threshold from the 21 August edit. Whoever is booking knows where the line is. A hundred ' +
        'and forty over the previous nine days, none of it alerted, and tonight\'s consignments ' +
        'are a different clock from the people question.',
      commandOptions: [
        { command: "awk -F, '$3==\"198.51.100.212\" {print $1, $5, $6}' /var/log/portal/bookings.csv | tail -31", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$3==\"198.51.100.212\" {s+=$5} END {print NR, s/NR}' /var/log/portal/bookings.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 198.51.100.212', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/portal/bookings.csv', ...DUMP_ALL },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
      ],
      commandNudge:
        'Look at the consignment values on those bookings and compare them to the tuning threshold.',
      guidance:
        'Ask what all of tonight\'s bookings have in common, and where you have seen that number ' +
        'before.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      firstResponder: 'forensics',
      alsoAppropriate: ['ir-lead', 'mitigation-specialist'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.attribute-named', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'Every instrument this floor would normally reach for is held by the person it is looking ' +
        'at. Administrative access to the detection platform, case management, the SIEM and the ' +
        'endpoint console, which is standard for a senior analyst on nights and is not itself ' +
        'evidence of anything. The consequences are specific and each one breaks a standard step. ' +
        'Opening a case names them and the case system emails anybody named in a new case. The ' +
        'endpoint console shows who else is logged into it, so quietly imaging their workstation ' +
        'is not quiet. And the same console can isolate any host in the estate including the ' +
        'workstations of the people investigating. So the preservation has to happen outside the ' +
        'tooling: capture the detection platform edit history, the case dispositions and the SIEM ' +
        'search log now, by export, hashed, held off the systems the suspect administers, before ' +
        'anybody takes an action that announces itself. That sequencing is the whole of this row, ' +
        'because everything downstream depends on evidence that one person can currently alter.',
      standIn:
        'Everything we would normally use is held by the person we are looking at. Admin on the ' +
        'detection platform, case management, the SIEM and the endpoint console, which is standard ' +
        'for a senior on nights. Opening a case emails them. The console shows who else is logged ' +
        'in, so imaging their workstation quietly is not quiet. And that console can isolate any ' +
        'host in the estate, including ours. So I am exporting the edit history, the dispositions ' +
        'and the search log now, hashing them, and holding them off the systems they administer, ' +
        'before anybody does anything that announces itself.',
      commandOptions: [
        { command: 'detect-cli export --rule ADF-D-0311 --history | tee /evidence/soc/0311-history.json | sha256sum', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$2==\"t.marchetti\"' /var/log/iam/role-assignments.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status edr-console', ...STATUS_CHECK },
        { command: 'cat /var/log/iam/role-assignments.csv', ...DUMP_ALL },
        { command: 'edr-cli isolate --host ADF-SOC-04', ...MUTATE },
      ],
      commandNudge:
        'Establish what the suspect can see and change before you take any action inside those ' +
        'systems.',
      guidance:
        'Ask what happens, and who finds out, when you open a case about a colleague.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'The output of the hour, and it is deliberately shorter than the floor will want it to be. ' +
        'Established, with high confidence: three edits by one named account combine into a blind ' +
        'spot covering 71 per cent of bookings; that account closed 41 of 44 alerts on the ' +
        'affected hosts at a rate far above its own behaviour anywhere else; the fraud operates ' +
        'entirely beneath a threshold that account set; and that account has spent five weeks ' +
        'searching for signs of an investigation into itself. Not established, and not obtainable ' +
        'here: why. A person being paid and a person being threatened raise the same tickets, ' +
        'close the same alerts and run the same two in the morning searches, and there is no ' +
        'communication, no payment record and no admission within reach of this floor. The ' +
        'searches fit fear more comfortably than confidence, and that is an impression rather than ' +
        'a finding and must be labelled as one. Write it that way round, because the report is ' +
        'going to somebody who will act on it, and the difference between a fraud investigation ' +
        'and a welfare response is a difference this evidence cannot make.',
      standIn:
        'Here is what we have, and it is shorter than anybody wants. High confidence: three edits ' +
        'by one account combine into a blind spot over 71 per cent of bookings, that account closed ' +
        '41 of 44 alerts on the affected hosts far above its own rate anywhere else, the fraud runs ' +
        'entirely under a threshold that account set, and it has spent five weeks searching for ' +
        'signs of an investigation into itself. Not established and not gettable by us: why. Paid ' +
        'and threatened raise the same tickets and run the same searches. The searches fit fear ' +
        'better than confidence, and that is an impression and I am labelling it as one. Whoever ' +
        'reads this decides between a fraud investigation and a welfare response, and our evidence ' +
        'cannot make that call for them.',
      commandNudge:
        'Write down what the evidence establishes and, separately, what it does not.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.attribute-named', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'Every containment worth having is visible to the person being contained, and one of them ' +
        'also removes a third of the night shift while a fraud is running. Suspending the account ' +
        'is known within seconds and leaves two analysts covering the estate. Reverting the three ' +
        'edits appears in the platform change feed, which all three analysts on shift can read. So ' +
        'the move is to stop the bleeding somewhere the suspect does not administer: block the ' +
        'booking address at the perimeter and put a hold on tonight\'s consignments from those ' +
        'three ZIP codes at the depot, which are operations actions rather than SOC actions and do ' +
        'not appear in any console on this floor. Leave the rule alone tonight. Reverting it ' +
        'announces the investigation, and it buys nothing that blocking the address does not ' +
        'already buy. Then the account: not suspended by the SOC, but escalated so that whoever ' +
        'owns the personnel decision makes it, with the shift covered first, because removing a ' +
        'third of the night cover at 21:15 is its own incident. Check the rollback on the ' +
        'perimeter block against the 4,000 legitimate bookings a night. Deliberately left undone ' +
        'and stated plainly: the blind spot stays open until morning, and that is a choice to keep ' +
        'the investigation quiet rather than an oversight.',
      standIn:
        'Everything worth doing is visible to them, and one of it takes a third of the night shift ' +
        'off the floor while a fraud is live. So we act where they do not administer: block the ' +
        'booking address at the perimeter, and hold tonight\'s consignments to those three ' +
        'ZIP codes at the depot. Both are operations actions, neither shows up in a console on ' +
        'this floor. Leave the rule alone: reverting it announces us and buys nothing the block ' +
        'does not. The account goes to whoever owns personnel decisions, with the shift covered ' +
        'first, because pulling one of three at 21:15 is its own incident. Rollback checked against ' +
        '4,000 legitimate bookings a night. Left undone on purpose: the blind spot stays open till ' +
        'morning, and that is a choice.',
      commandNudge:
        'Find an action that stops tonight\'s fraud in a system the suspect does not administer.',
    },
    {
      eventId: 'ev.10',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1562.001'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Four hundred and ten edits in a year by nine analysts, no second approver, no expiry, no ' +
        'scheduled review, and no report anywhere showing which rules have lost coverage. That is ' +
        'the finding with the longest life in this incident, and it is not about one person: a ' +
        'system where any analyst can narrow any detection unobserved has one honest analyst ' +
        'making a mistake as its likeliest failure, and tonight is the rarer version. The signal ' +
        'that was available and unwatched is embarrassing in its simplicity. A rule going from 140 ' +
        'firings in sixty days to zero in nine produced nothing, because nobody alerts on a ' +
        'detection falling silent, and a detection falling silent is either a fixed problem or a ' +
        'removed control and those need telling apart. Propose two things and let the numbers ' +
        'argue: an alert on firing volume collapse, backtested across all 410 edits so the volume ' +
        'is known before it is promised, and a second approver on edits that reduce scope, which ' +
        'is a process change rather than a rule and will be resisted on those grounds.',
      standIn:
        'Four hundred and ten edits in a year by nine analysts, no second approver, no expiry, no ' +
        'review, and no report showing which rules have lost coverage. That outlives this ' +
        'incident, and it is not about one person: the likeliest failure of a system like that is ' +
        'an honest analyst making a mistake, and tonight is the rare version. And the signal was ' +
        'sitting there. A hundred and forty firings in sixty days to zero in nine produced nothing, ' +
        'because nobody alerts on a rule going quiet, and a rule going quiet is either a fixed ' +
        'problem or a removed control. Two proposals: alert on firing volume collapse, backtested ' +
        'over all 410 edits, and a second approver on any edit that reduces scope.',
      commandOptions: [
        { command: "awk -F, '{print $3}' /var/log/detection/edits.csv | sort | uniq -c | sort -rn", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '{print $3, substr($1,1,7)}' /var/log/detection/firings.csv | uniq -c | awk '$1==0'", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/detection/edits.csv', ...DUMP_ALL },
        { command: 'grep -c . /var/log/detection/edits.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out how many detection edits happen a year and how many are reviewed.',
      guidance:
        'A rule went silent and nothing noticed. Ask what would have noticed.',
    },
    {
      eventId: 'ev.11',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['detection-engineer', 'fusion-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.attribute-named', 'act.isolate', 'act.declare'],
      escalateTo: [],
      why:
        'The same comparison that found the real thing throws up a colleague at 90 per cent, ' +
        'arriving at the moment the floor has learned to read a high close rate as corruption. It ' +
        'is a broken rule. Every analyst who has touched ADF-D-0288 closes it at between 86 and 94 ' +
        'per cent, there is an open tuning ticket raised by three different people, and the vendor ' +
        'has acknowledged a matching logic defect. And the check that clears them is the same one ' +
        'that convicted the other case, run properly: this analyst has no unusual rate on any ' +
        'other rule, where the other analyst was unusual on one set of hosts and better than ' +
        'average everywhere else. Close it, and treat the near miss seriously in the debrief. A ' +
        'disposition comparison is a good instrument and it is about to be run across the whole ' +
        'floor by people who are frightened, and the cost of getting it wrong is accusing a ' +
        'colleague of corruption on a number produced by a vendor bug.',
      standIn:
        'Ninety per cent on ADF-D-0288 and it is the rule, not the analyst. Everybody who touches ' +
        'that rule closes it between 86 and 94 per cent, there is an open tuning ticket from three ' +
        'different people, and the vendor has admitted a logic defect. And the check that clears ' +
        'them is the one that convicted the other case: no unusual rate on any other rule. The ' +
        'other one was unusual on one set of hosts and better than average everywhere else. ' +
        'Closing it. Somebody is going to run this comparison across the whole floor tonight and ' +
        'they need to know that.',
      commandOptions: [
        { command: "awk -F, '$3==\"ADF-D-0288\" {print $4, $5}' /var/log/cases/dispositions.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "ADF-D-0288" /var/log/detection/tuning-tickets.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status casemgmt', ...STATUS_CHECK },
        { command: 'cat /var/log/cases/dispositions.csv', ...DUMP_ALL },
        { command: 'net user r.oyelowo /active:no /domain', ...MUTATE },
      ],
      commandNudge:
        'Check whether other analysts close that same rule at the same rate.',
      guidance:
        'One analyst closes a rule at ninety per cent. Ask what everybody else does with it.',
    },
  ],
};
