/**
 * Scenario 29: Somebody Else's Breach.
 *
 * Your data, their estate, your obligation.
 *
 * WHAT THIS TEACHES
 *
 * That an incident can be entirely real, entirely yours to answer for, and
 * entirely outside your visibility. The compromised systems belong to a
 * supplier. There are no logs to pull, no hosts to image, no traffic to
 * analyse, and no containment action available anywhere in the estate. Every
 * technical reflex the floor has is useless.
 *
 * What is left is the work most SOCs are worst at: establishing what of yours
 * was in there, deciding what can be asserted on somebody else's account of
 * their own breach, and getting a defensible position to the people who have to
 * notify a regulator on a clock. That is the whole hour, and it is done almost
 * entirely by asking questions and reading contracts.
 *
 * THE DISCIPLINE BEING TAUGHT
 *
 * Everything the supplier says is a claim, not evidence. They have every
 * incentive to scope it narrowly, they are working their own incident with
 * incomplete information, and their first statement will be revised. A floor
 * that reports the supplier's numbers as findings has laundered somebody else's
 * assurance into its own report. The correct output separates what the supplier
 * asserts, what this organisation can independently corroborate, and what
 * remains unknown, and it says which is which in every sentence.
 *
 * WHY THE INTEL SEAT LEADS
 *
 * There is no host to analyse, so the seat that spends its life assessing
 * source reliability and stating confidence is the one with the right habits.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';
import {
  ALSO_WORKS,
  COUNT_ONLY,
  CORRECT_STEP,
  DUMP_ALL,
  STATUS_CHECK,
  TOUCH_ATTACKER,
  WRONG_TARGET,
} from './distractors.js';

const ID = 'somebody-elses-breach';

export const SOMEBODY_ELSES_BREACH: Scenario = {
  id: ID,
  title: "Somebody Else's Breach",
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 08:30 at Ridgeline Medical Group. The company that runs our appointment reminder ' +
    'service emailed at 07:55 to say they have had a security incident. Nothing in our estate has ' +
    'alerted, and nothing in our estate is going to. Work out what we can actually say.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
    'threat-intel',
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
      summary: 'Supplier notification: security incident affecting the appointment reminder platform',
      detail:
        'An email from the supplier account manager at 07:55 states that they detected unauthorised ' +
        'access to a production environment on the 22nd, that the access has been terminated, and ' +
        'that they are "not currently aware of any customer data being affected". It gives no ' +
        'dates for the start of the access, no technical detail, and no contact in their security ' +
        'team. Rule history: this is an email to a shared mailbox, not a detection.',
      source: 'supplier',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'cloud-audit',
      summary: 'What we send them, established from our own integration',
      detail:
        'The integration pushes a nightly file containing patient name, mobile number, appointment ' +
        'date and time, clinic name, and clinician surname. It has run every night since 2021. ' +
        'Clinic name discloses the specialty, so a file naming an oncology clinic implies a ' +
        'diagnosis. There is no field-level agreement in the contract limiting what may be sent.',
      source: 'rmg integration',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'network-flow',
      summary: 'Our egress records establish volume and timing, and nothing about their storage',
      detail:
        'Flow records confirm a nightly transfer to the supplier averaging 4.2 MB, running without ' +
        'interruption from 2021 to last night. That establishes what we sent and when. It ' +
        'establishes nothing about how long they retained it, whether they copied it elsewhere, or ' +
        'what was in the environment that was accessed.',
      source: 'rmg-int-01',
      target: 'supplier platform',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'raw-log',
      summary: 'The contract requires notification within 24 hours of detection',
      detail:
        'The data processing agreement requires the processor to notify without undue delay and in ' +
        'any case within 24 hours of becoming aware. The supplier says they detected on the 22nd ' +
        'and notified on the 30th, which is eight days. The agreement also requires them to provide ' +
        'sufficient information for the controller to meet its own obligations, and to permit ' +
        'audit.',
      source: 'contract register',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'alert-queue',
      summary: 'A public post naming the supplier appeared on a leak site on the 28th',
      detail:
        'An extortion group leak site listed the supplier on the 28th with a sample directory ' +
        'listing. The listing includes folder names matching several of the supplier customers, one ' +
        'of which resembles our organisation short name. No file contents are published and the ' +
        'sample cannot be verified without engaging the site.',
      source: 'open source',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'The 72 hour regulatory clock and who it runs for',
      detail:
        'As controller, this organisation must assess and where required notify the data protection ' +
        'regulator within 72 hours of becoming aware of a personal data breach. Awareness is dated ' +
        'from our own knowledge, which began at 07:55 today, not from the supplier detection date. ' +
        'A notification may be made in phases where full information is not yet available.',
      source: 'legal',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'Failed logins against our own patient portal overnight',
      detail:
        'The patient portal recorded 1,900 failed logins overnight from 700 addresses, at 0.01 ' +
        'percent success. The pattern matches the ordinary background credential stuffing this ' +
        'portal receives every night and the volume is inside the nightly range. Rule history: ' +
        'fired 30 times in thirty days, 29 closed as background.',
      source: 'patient portal',
      claimedSeverity: 'medium',
    },
  ],
};

export const SOMEBODY_ELSES_BREACH_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'The supplier that runs our appointment reminder service was compromised. Their systems, not ours.',
    'They detected on the 22nd and told us on the 30th, eight days later, against a contractual obligation of 24 hours.',
    'They say they are not aware of customer data being affected. That is a statement about their awareness, not about our data, and it was written by somebody with every reason to scope it narrowly.',
    'An extortion group listed them publicly on the 28th, two days before they contacted us, with a directory listing that appears to include our organisation.',
    'We can establish exactly what we sent them and when, because that is our side of the integration: name, mobile, appointment time, clinic and clinician, nightly since 2021.',
    'Clinic name discloses specialty, so this is special category health data rather than contact details.',
    'We cannot establish what they retained, what was in the accessed environment, or whether it left, and no technical work available to this floor will change that.',
    'Our 72 hour regulatory clock started at 07:55 today, on our awareness, not on their detection date.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1199'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'threat-intel'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reimage-now', 'act.reset-password'],
      escalateTo: ['ir-lead', 'threat-intel'],
      why:
        'This arrives as an email to a shared mailbox and no rule will ever fire on it, which is ' +
        'the first thing worth noticing: some incidents have no detection because the compromised ' +
        'systems are not yours. Raise it immediately anyway, because a regulatory clock starts on ' +
        'awareness and awareness started at 07:55. Read the wording carefully rather than the ' +
        'reassurance: "not currently aware of any customer data being affected" is a statement ' +
        'about what they know, not about what happened, and every qualifier in it is doing work. ' +
        'The missing pieces are as informative as the present ones: no start date, no technical ' +
        'detail, no security contact.',
      standIn:
        'Supplier emailed the shared mailbox at 07:55 saying they had unauthorised access to ' +
        'production on the 22nd, now terminated, and are not currently aware of customer data being ' +
        'affected. No start date, no technical detail, no security contact. Our clock starts now. ' +
        'Raising it.',
      commandOptions: [
        { command: 'grep -i "appointment-reminder" /var/log/contracts/register.csv', correct: true, teaches: CORRECT_STEP },
        { command: 'systemctl status integration-svc', ...STATUS_CHECK },
        { command: 'cat /var/log/mail/inbound.log', ...DUMP_ALL },
        { command: 'grep -c supplier /var/log/mail/inbound.log', ...COUNT_ONLY },
        { command: 'curl -sI https://supplier-platform.example/status', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out what that supplier actually does for us before deciding how serious this is.',
      guidance:
        'Read what they said and what they carefully did not say. Then start your own clock.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1199'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit'],
      outOfLaneActions: ['act.revoke-key', 'act.isolate', 'act.declare', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'The one thing on this board that can be established with certainty, because it is our side ' +
        'of the integration. Name, mobile, appointment time, clinic and clinician, nightly since ' +
        '2021. The finding that changes the regulatory analysis is the clinic field: a name that ' +
        'says oncology or sexual health discloses a specialty and therefore implies a diagnosis, ' +
        'which makes this special category health data rather than contact details. Nobody outside ' +
        'the SOC will spot that, and it is the difference between a routine processor notification ' +
        'and a serious one. Worth also noting there is no field-level limit in the contract, so ' +
        'nobody ever decided this was the minimum necessary.',
      standIn:
        'We send them patient name, mobile, appointment date and time, clinic name and clinician ' +
        'surname, every night since 2021. Clinic name discloses the specialty, so an oncology clinic ' +
        'in that file implies a diagnosis. That makes it special category health data, not a contact ' +
        'list. And there is no field-level limit in the contract.',
      commandOptions: [
        { command: 'head -3 /var/integration/reminder-export-latest.csv', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "field\\|schema" /var/log/contracts/dpa-reminder.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status reminder-export.timer', ...STATUS_CHECK },
        { command: 'cat /var/integration/reminder-export-latest.csv', ...DUMP_ALL },
        { command: 'wc -l /var/integration/reminder-export-latest.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at what is actually in the file we send them, field by field.',
      guidance:
        'You cannot see their systems. Ask what you gave them, because that part you can establish ' +
        'exactly.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.flow-map'],
      outOfLaneActions: ['act.isolate', 'act.contact-attacker', 'act.declare'],
      escalateTo: ['ir-lead'],
      why:
        'Graded as a true positive because the records are correct and the finding is real, and it ' +
        'is here to teach the limit rather than the result. Our flows prove volume and timing: 4.2 ' +
        'MB a night, uninterrupted since 2021. They prove nothing about retention, replication or ' +
        'what was in the environment that was accessed, because all of that happened on the other ' +
        'side of a boundary we have no visibility past. Saying both halves is the job. A network ' +
        'seat that reports the transfer history without the limitation invites everybody else to ' +
        'assume it bounds the exposure, and it does not: four years of nightly files may all still ' +
        'be sitting there.',
      standIn:
        '4.2 MB a night to them, every night since 2021, no interruptions. That is what we sent and ' +
        'when. It says nothing about how long they kept it, whether they copied it, or what was in ' +
        'the environment that got accessed. Four years of files may all still be there.',
      commandOptions: [
        { command: "awk '$4 ~ /supplier/ {print $1, $6}' /var/log/flows-archive.log | tail -30", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c supplier /var/log/flows-archive.log', ...COUNT_ONLY },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'traceroute supplier-platform.example', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Establish what our own records can prove about this integration, and be clear about where ' +
        'they stop.',
      guidance:
        'Your evidence ends at your boundary. Say what it proves and say where it stops.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      techniques: ['T1199'],
      firstResponder: 'threat-intel',
      alsoAppropriate: ['ir-lead', 'fusion-analyst'],
      correctActions: ['act.assess-actor', 'act.predict'],
      outOfLaneActions: ['act.attribute-named', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'Eight days against a contractual 24 hours, and the gap is a finding rather than a ' +
        'grievance. It tells you the supplier incident response is not working, which means their ' +
        'account of scope is being produced by the same process that took eight days to send an ' +
        'email. That is directly relevant to how much weight their assurance carries. The contract ' +
        'also gives two things worth using today rather than in a review: the obligation to provide ' +
        'sufficient information for us to meet our own obligations, and the right to audit. Both ' +
        'turn "we are waiting to hear back" into a demand with a clause number attached.',
      standIn:
        'They detected on the 22nd and told us on the 30th. The agreement says 24 hours. That eight ' +
        'day gap tells us their response is not working, which is exactly the process producing ' +
        'their scope assurance. The contract also obliges them to give us enough to meet our own ' +
        'obligations and lets us audit. I want both invoked today, in writing.',
      commandOptions: [
        { command: 'grep -A6 -i "notification\\|without undue delay" /var/log/contracts/dpa-reminder.txt', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i audit /var/log/contracts/dpa-reminder.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'cat /var/log/contracts/dpa-reminder.txt', ...DUMP_ALL },
        { command: 'grep -c clause /var/log/contracts/dpa-reminder.txt', ...COUNT_ONLY },
        { command: 'systemctl status contract-register', ...STATUS_CHECK },
      ],
      commandNudge:
        'Read what the agreement actually requires of them, and what it entitles us to ask for.',
      guidance:
        'They are late. Ask what that tells you about the reliability of everything else they have ' +
        'said.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1657'],
      firstResponder: 'threat-intel',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.ttp-map', 'act.assess-actor'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The finding that contradicts the supplier, and it comes from open source rather than from ' +
        'them. A leak site listed them on the 28th, two days before they contacted us, with a ' +
        'directory listing including something resembling our short name. An extortion group ' +
        'publishing a listing means data left, because that is the entire business model: they ' +
        'publish because they hold something. That is very hard to reconcile with "not currently ' +
        'aware of any customer data being affected". Two limits have to be stated with it. A folder ' +
        'name resembling ours is not proof it is ours, and verifying the sample would mean engaging ' +
        'the site, which is out of lane for everybody. The honest position is that open source ' +
        'materially contradicts the supplier account, and that they should be asked to explain the ' +
        'discrepancy today.',
      standIn:
        'A leak site listed them on the 28th, two days before they emailed us, with a directory ' +
        'listing that includes a folder resembling our short name. Extortion groups publish because ' +
        'they hold something, so data left. That is hard to square with not aware of customer data ' +
        'being affected. I am not verifying the sample, that means engaging the site. They need to ' +
        'explain the discrepancy today.',
      commandOptions: [
        { command: 'grep -i "supplier\\|reminder" /var/log/osint/leak-monitor.log | tail -20', correct: true, teaches: CORRECT_STEP },
        { command: 'awk \'/2026-08-28/ {print $3, $5}\' /var/log/osint/leak-monitor.log', correct: true, teaches: ALSO_WORKS },
        { command: 'cat /var/log/osint/leak-monitor.log', ...DUMP_ALL },
        { command: 'grep -c LISTED /var/log/osint/leak-monitor.log', ...COUNT_ONLY },
        { command: 'curl -s http://203.0.113.221/leaks/reminder-co', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Check whether anybody outside the supplier has said anything about this, and when they ' +
        'said it.',
      guidance:
        'They told you what they know. Ask whether anybody else has said anything, and whether the ' +
        'dates line up.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1199'],
      firstResponder: 'ir-lead',
      alsoAppropriate: ['fusion-analyst'],
      correctActions: ['act.declare', 'act.notify-legal'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reimage-now'],
      escalateTo: [],
      why:
        'The decision, and the detail that decides it is whose awareness starts the clock. It is ' +
        'ours, dated 07:55 today, not their detection on the 22nd, which means there is time to ' +
        'assess properly rather than notify in a panic. The trap is the opposite instinct: waiting ' +
        'for the supplier to confirm scope before doing anything, when the supplier has already ' +
        'taken eight days and is contradicted by a public listing. Phased notification exists ' +
        'precisely for this, so the answer is to notify on what is established, say plainly what is ' +
        'not, and update. What this seat owes is the three-way split written down and handed to ' +
        'legal: what the supplier asserts, what we corroborated ourselves, and what is unknown, ' +
        'with every sentence labelled as one of the three.',
      standIn:
        'Our 72 hours runs from our awareness at 07:55 today, not their detection on the 22nd, so ' +
        'we have time to assess and no reason to wait on them. Phased notification is available. ' +
        'Legal gets three lists from me: what they assert, what we corroborated, and what nobody ' +
        'knows. Every line labelled.',
      commandNudge:
        'Work out when our own obligation actually starts, and what a phased notification allows.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.declare', 'act.isolate', 'act.corroborate'],
      escalateTo: [],
      why:
        'Nineteen hundred failed logins against our patient portal on the morning we learn a ' +
        'supplier holding patient contact details was breached. The story writes itself and it is ' +
        'wrong: 0.01 percent success from 700 addresses is the ordinary background this portal ' +
        'receives every night, inside the normal range, and 29 of 30 were closed the same way. The ' +
        'check is the rate and the range. Getting it wrong here is specifically expensive, because ' +
        'reporting it as connected would tell a regulator that leaked data is already being used ' +
        'against us, which is a much more serious claim than anything the evidence supports and one ' +
        'that would have to be withdrawn.',
      standIn:
        '1,900 failed portal logins overnight from 700 addresses at 0.01 percent, inside the normal ' +
        'nightly range. Twenty-nine of thirty this month were the same. It is background, not the ' +
        'supplier data being used. Closing it, and I would not put it near the notification.',
      commandOptions: [
        { command: "awk '/login/ {print $6}' /var/log/portal/auth.log | sort | uniq -c | sort -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c "login ok" /var/log/portal/auth.log', ...COUNT_ONLY },
        { command: 'systemctl status portal', ...STATUS_CHECK },
        { command: 'cat /var/log/portal/auth.log', ...DUMP_ALL },
        { command: 'ping -c 2 203.0.113.44', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Work out the success rate and compare it against what this portal gets on a normal night.',
      guidance:
        'Ask whether this is different from last night. If it is not, it is not about the supplier.',
    },
  ],
};
