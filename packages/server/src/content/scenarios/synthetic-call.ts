/**
 * Scenario 82: Everyone On The Call.
 *
 * A payments officer joined a video call with three colleagues she recognised
 * and authorised 1.9 million dollars. None of the three was a person.
 *
 * WHAT THIS TEACHES
 *
 * That a verification step becomes attack surface the moment it is predictable,
 * and that the officer here did not fail the control. She performed it.
 *
 * Fenmarch policy requires visual or verbal confirmation for payments above
 * half a million, which exists precisely because email instructions are forged
 * routinely. She did not act on an email. She joined a meeting in her own
 * calendar, saw and heard three people she has worked with for years, asked a
 * question and got an answer, and then did what she was told. Every step of
 * that is the process working as written.
 *
 * WHAT THE SOC ACTUALLY HAS
 *
 * Almost nothing about the call itself, because the platform does not record by
 * default and nobody recorded this one. What it has is the metadata around it:
 * who created the meeting, from where each participant joined, and which
 * accounts were and were not used. That is enough, and it is available in
 * twenty minutes.
 *
 * THE PART THAT WILL BE MISHANDLED
 *
 * The instinct to ask why she did not spot it. She was not equipped to and
 * neither is anybody else in the building, the control she was given assumes a
 * face is evidence of a person, and a report that lands on her rather than on
 * the control will produce a disciplinary conversation and no change.
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

const ID = 'everyone-on-the-call';

export const EVERYONE_ON_THE_CALL: Scenario = {
  id: ID,
  title: 'Everyone On The Call',
  difficulty: 'advanced',
  durationMinutes: 75,
  situation:
    'It is 09:15 at Fenmarch Credit Union. A payment of 1.9 million dollars left yesterday ' +
    'afternoon, approved on a video call with the finance director. The finance director was in ' +
    'Denver and says there was no call.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'forensics',
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
      summary: 'A 1.9 million dollar payment approved on a call that did not happen',
      detail:
        'A payments officer released 1.9 million dollars at 15:40 yesterday to a new beneficiary, ' +
        'following a video call at 15:05 with the finance director and two colleagues from ' +
        'treasury. The finance director was travelling and has no record of the call in his ' +
        'calendar. Fenmarch policy requires visual or verbal confirmation for payments above ' +
        '500,000 dollars, and the officer recorded that she obtained it. Rule history: no rule ' +
        'exists on payment approvals.',
      source: 'payments operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.2',
      atSeconds: 150,
      surface: 'cloud-audit',
      summary: 'The meeting is real and was created forty minutes before it started',
      detail:
        'The conferencing platform holds a meeting created at 14:22 and joined by four participants ' +
        'between 15:03 and 15:06. It appeared in the officer\'s calendar with a subject referring to ' +
        'an urgent settlement. It was created by the account of an executive assistant in the ' +
        'finance office, who books meetings for the finance director several times a week and did ' +
        'not book this one.',
      source: 'conferencing platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'raw-log',
      summary: 'Three of the four participants joined as guests with typed display names',
      detail:
        'One participant authenticated with the officer\'s own Fenmarch account. The other three ' +
        'joined as unauthenticated guests, each supplying a display name at the join prompt: the ' +
        'finance director\'s name and those of two treasury colleagues. The platform shows guest ' +
        'participants with the same name styling as authenticated ones and no badge distinguishing ' +
        'them. Guest join is enabled so that external auditors and brokers can attend.',
      source: 'conferencing platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 490,
      surface: 'cloud-audit',
      summary: 'The assistant\'s account was signed in from somewhere she was not',
      detail:
        'The executive assistant\'s account authenticated at 14:19 from 198.51.100.63, three ' +
        'minutes before the meeting was created, having previously only ever authenticated from ' +
        'the branch range and her home broadband. She was at her desk at 14:19. Her password ' +
        'appears in a credential collection published in June. Multi-factor is enforced on the ' +
        'portal and not on the conferencing platform, which uses legacy authentication.',
      source: 'identity platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 660,
      surface: 'network-flow',
      summary: 'All three guests joined from one hosting provider',
      detail:
        '198.51.100.63 and two neighbouring addresses carried all three guest connections, and the ' +
        'same block carried the assistant account sign-in at 14:19. The range belongs to a ' +
        'commercial hosting provider and appears nowhere in Fenmarch traffic before 14:19 ' +
        'yesterday. Media streams from all three ran at a constant 1.1 megabits with no variation, ' +
        'where a normal participant varies with movement and lighting.',
      source: '198.51.100.63',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 830,
      surface: 'host-artefact',
      summary: 'There is no recording, and there was never going to be',
      detail:
        'The conferencing platform does not record by default and this meeting was not recorded. ' +
        'Attendance metadata, join addresses and client versions are retained for 30 days. No ' +
        'audio or video of the call exists anywhere, and no participant took notes beyond the ' +
        'officer\'s one-line entry in the payment record. What was said on that call cannot be ' +
        'established by anybody.',
      source: 'conferencing platform',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 1000,
      surface: 'alert-queue',
      summary: 'The officer followed the control exactly',
      detail:
        'The payments procedure requires visual or verbal confirmation from an authorised approver ' +
        'for amounts above 500,000 dollars, introduced in 2022 after an email-based attempt. It ' +
        'specifies a call and does not specify how a caller is to be verified as themselves. The ' +
        'officer joined a meeting from her own calendar, saw three people she has worked with for ' +
        'four years, asked when the settlement had been agreed and was given an answer, and ' +
        'recorded that confirmation was obtained.',
      source: 'payments procedure',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1170,
      surface: 'alert-queue',
      summary: 'Where the money is, and how long that stays true',
      detail:
        'The 1.9 million dollars was sent to a beneficiary account at a correspondent bank, opened ' +
        'eleven days ago. Recall requests are most likely to succeed within the first 24 hours and ' +
        'the payment left at 15:40 yesterday. The receiving bank has not been contacted. Fenmarch ' +
        'processes 40 payments above 500,000 dollars in a normal month and four are scheduled ' +
        'today.',
      source: 'treasury',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1340,
      surface: 'cloud-audit',
      summary: 'Another large payment was approved by video the same week',
      detail:
        'A payment of 740,000 dollars on Monday was also approved on a video call. All four ' +
        'participants authenticated with Fenmarch accounts, joined from the branch and home ranges ' +
        'they have used for years, the meeting was created by the finance director from his own ' +
        'calendar six days in advance, and it appears in his calendar now. The beneficiary is a ' +
        'supplier paid monthly since 2019.',
      source: 'conferencing platform',
      claimedSeverity: 'medium',
    },
  ],
};

export const EVERYONE_ON_THE_CALL_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'The executive assistant\'s password appears in a credential collection published in June. Multi-factor is enforced on the Fenmarch portal and not on the conferencing platform, which uses legacy authentication.',
    'At 14:19 yesterday somebody signed in as her from 198.51.100.63, a commercial hosting address with no history at Fenmarch, while she was at her desk.',
    'At 14:22 they created a meeting from her account, which is unremarkable because she books meetings for the finance director several times a week, and it appeared in the payments officer\'s calendar with a subject about an urgent settlement.',
    'Between 15:03 and 15:06 four participants joined. One was the officer, on her own account. The other three joined as unauthenticated guests from the same hosting block, each typing a display name at the join prompt: the finance director and two treasury colleagues.',
    'The platform renders guest names identically to authenticated ones with no badge distinguishing them, because guest join is enabled so auditors and brokers can attend.',
    'All three guest media streams ran at a constant 1.1 megabits with no variation, where a real participant varies with movement and lighting.',
    'The officer saw three people she has worked with for four years, asked when the settlement had been agreed, got an answer, recorded that confirmation was obtained, and released 1.9 million dollars at 15:40 to an account opened eleven days earlier.',
    'The payments procedure requires visual or verbal confirmation above 500,000 dollars and does not specify how a caller is verified as themselves. She followed it exactly. Nothing was recorded and what was said on that call cannot be established.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1656'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.reset-password', 'act.tune'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'One point nine million out, a control that was followed, and a director who says the call ' +
        'never happened. Declare immediately and put one thing in front of the lead before ' +
        'anything else: the money left at 15:40 yesterday and recall is most likely to work inside ' +
        'twenty-four hours, so the receiving bank needs contacting while the investigation runs ' +
        'rather than after it concludes. The technical question of how the call was faked is ' +
        'genuinely interesting and it does not move by the hour. The recall window does. Resist the ' +
        'framing that will already be forming, which is that somebody in payments made a mistake: ' +
        'the officer recorded that she obtained confirmation because she did obtain confirmation, ' +
        'and that is a fact about the control rather than about her.',
      standIn:
        'One point nine million gone, approved on a video call, and the finance director says there ' +
        'was no call. Declaring. First thing to the lead, before anything technical: it left at ' +
        '15:40 yesterday and recall works best inside twenty-four hours, so somebody phones the ' +
        'receiving bank now, not when we finish. How the call was faked is interesting and it does ' +
        'not move by the hour. And nobody frames this as payments making a mistake yet.',
      commandOptions: [
        { command: "awk -F, '$3==\"RELEASE\" && $5>500000 {print $1, $4, $5, $6}' /var/log/payments/transactions.csv | tail", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "1900000\\|1,900,000" /var/log/payments/transactions.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status payments', ...STATUS_CHECK },
        { command: 'cat /var/log/payments/transactions.csv', ...DUMP_ALL },
        { command: 'net user e.harnett /active:no /domain', ...MUTATE },
      ],
      commandNudge:
        'Find when the payment left, then find out how long a recall stays likely.',
      guidance:
        'The money has gone. Ask what is still time-limited.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1656'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.corroborate'],
      outOfLaneActions: ['act.revoke-key', 'act.attribute-named', 'act.dismiss', 'act.reset-password'],
      escalateTo: ['ir-lead', 'log-analyst'],
      why:
        'The meeting is real, which is what made it convincing and is the first thing that has to be ' +
        'said out loud. It sat in the officer\'s calendar like any other meeting, because it was ' +
        'created in the platform by an internal account, and it was created by the executive ' +
        'assistant who books meetings for the finance director several times a week. Nothing about ' +
        'its provenance would have looked wrong to anybody, and that is not a failure of ' +
        'attention: a calendar entry created by the person who always creates them is not a signal. ' +
        'The forty minutes between creation and start is the one detail worth carrying forward, ' +
        'because it is short for a meeting about a settlement and long enough to have been ' +
        'deliberate, and it means whoever did this had the assistant account before they needed the ' +
        'meeting. Go to that account next rather than to the call.',
      standIn:
        'The meeting is real, and that is why it worked. It was in her calendar like anything else ' +
        'because it was created inside the platform by an internal account, and specifically by the ' +
        'assistant who books meetings for the finance director several times a week. Nothing about ' +
        'that would look wrong to anybody. Forty minutes from creation to start is short for a ' +
        'settlement discussion and long enough to be deliberate, which means they had her account ' +
        'before they needed the meeting. That account is where I would go next.',
      commandOptions: [
        { command: "awk -F, '$3==\"MEETING_CREATE\" {print $1, $2, $5}' /var/log/conferencing/audit.csv | tail", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "urgent settlement" /var/log/conferencing/audit.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status conferencing', ...STATUS_CHECK },
        { command: 'cat /var/log/conferencing/audit.csv', ...DUMP_ALL },
        { command: 'grep -c MEETING /var/log/conferencing/audit.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out whether the meeting exists in the platform and who created it.',
      guidance:
        'She joined a meeting. Ask where that meeting came from.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1656'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.reset-password'],
      escalateTo: ['ir-lead', 'network-analyst'],
      why:
        'Three of the four participants were typed names. One person authenticated with a Fenmarch ' +
        'account and that person was the victim; the other three joined as unauthenticated guests ' +
        'and supplied their display names at the join prompt, which means the names on screen were ' +
        'not identities, they were text somebody entered. That is the finding and it is available ' +
        'in the platform log without any analysis of the call itself. The reason nobody noticed is ' +
        'in the same row and is not a configuration error: the platform renders guest names ' +
        'identically to authenticated ones with no badge, and guest join is enabled deliberately so ' +
        'that auditors and brokers can attend, which is a legitimate need this credit union has. ' +
        'So the interface presented three strangers exactly as it would have presented three ' +
        'colleagues, and the officer had no way to tell them apart on screen.',
      standIn:
        'Three of the four were typed names. One person authenticated with a Fenmarch account and ' +
        'that was the victim. The other three joined as guests and typed their display names at the ' +
        'join prompt, so those names were never identities, they were text. That is in the platform ' +
        'log with no analysis of the call at all. And the reason nobody noticed is not a ' +
        'misconfiguration: guest names render identically to authenticated ones with no badge, and ' +
        'guest join is on so auditors and brokers can attend, which we actually need. The interface ' +
        'showed her three strangers the same way it shows three colleagues.',
      commandOptions: [
        { command: "awk -F, '$3==\"JOIN\" {print $1, $4, $5, $6}' /var/log/conferencing/audit.csv | tail -6", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$3==\"JOIN\" && $6==\"guest\"' /var/log/conferencing/audit.csv | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status conferencing', ...STATUS_CHECK },
        { command: 'cat /var/log/conferencing/audit.csv', ...DUMP_ALL },
        { command: 'grep -c JOIN /var/log/conferencing/audit.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at how each of the four participants joined, and which of them authenticated.',
      guidance:
        'She saw three familiar names. Ask where a name on that screen comes from.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1078.004'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.corroborate'],
      outOfLaneActions: ['act.revoke-key', 'act.attribute-named', 'act.dismiss', 'act.reset-password'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'How it was possible, and it is a gap between two systems rather than a failure in either. ' +
        'The assistant\'s account signed in at 14:19 from a hosting address it has never used, ' +
        'three minutes before the meeting was created, while she was at her desk. Her password is ' +
        'in a collection published in June. Multi-factor is enforced on the portal and not on the ' +
        'conferencing platform, which uses legacy authentication that cannot carry a second factor, ' +
        'and that exemption will have been granted deliberately by somebody weighing a real ' +
        'trade-off. The consequence is specific and worth stating precisely: the strongest control ' +
        'this credit union operates has a path around it into a system that can create meetings in ' +
        'other people\'s calendars, and creating a meeting in somebody\'s calendar is the entire ' +
        'first half of this attack. Do not reset her password on this row. She is the second victim ' +
        'here and the account is evidence, and the sequencing belongs to the lead.',
      standIn:
        'Here is how. Her account signed in at 14:19 from a hosting address it has never used, three ' +
        'minutes before the meeting was made, while she was sitting at her desk. Her password is in ' +
        'a June collection. We enforce multi-factor on the portal and not on conferencing, because ' +
        'conferencing uses legacy authentication that cannot carry it, and somebody granted that ' +
        'exemption weighing a real trade-off. What it means is that our strongest control has a ' +
        'path around it into a system that can put meetings in other people\'s calendars, and that ' +
        'is half this attack. She is the second victim, and that account is evidence.',
      commandOptions: [
        { command: "awk -F, '$2==\"e.harnett\" {print $1, $4, $5}' /var/log/identity/signin.csv | tail -10", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -iE "mfa|legacy" /evidence/identity/auth-policy.yaml', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status identity', ...STATUS_CHECK },
        { command: 'cat /var/log/identity/signin.csv', ...DUMP_ALL },
        { command: 'net user e.harnett /random /domain', ...MUTATE },
      ],
      commandNudge:
        'Find where the meeting creator signed in from, and what authentication that platform ' +
        'requires.',
      guidance:
        'Somebody used her account. Ask what they needed in order to.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1656'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['forensics', 'fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate', 'act.dismiss'],
      escalateTo: ['ir-lead', 'threat-intel'],
      why:
        'Three separate colleagues, three separate offices, one hosting provider, and the same block ' +
        'that signed in as the assistant an hour earlier. That single observation would have ended ' +
        'the call before the payment if anybody could have seen it during the meeting, which nobody ' +
        'can, and it takes one query afterwards. Then the detail that is worth more than the ' +
        'address: all three media streams ran at a constant 1.1 megabits with no variation. A real ' +
        'participant on a video call varies constantly as they move, as the light changes, as they ' +
        'lean toward the camera, and a stream that does not vary is not a camera pointed at a room. ' +
        'That is a network-layer property of synthetic video that needs no analysis of the imagery ' +
        'and no specialist tooling, and it is the most durable finding on this board because it ' +
        'does not depend on the quality of the fake.',
      standIn:
        'Three colleagues in three different offices, all from one hosting provider, and it is the ' +
        'same block that signed in as the assistant an hour earlier. One query, and it would have ' +
        'ended the call if anybody could have seen it live, which nobody can. And better than the ' +
        'address: all three media streams ran at a flat 1.1 megabits with no variation. Real people ' +
        'on video vary constantly as they move and the light changes. A stream that does not vary ' +
        'is not a camera pointed at a room, and that holds no matter how good the fake looks.',
      commandOptions: [
        { command: "awk -F, '$3==\"MEDIA\" {print $2, $5, $6}' /var/log/conferencing/streams.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c "198.51.100.6" /var/log/flows-90d.log', correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 198.51.100.63', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/conferencing/streams.csv', ...DUMP_ALL },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
      ],
      commandNudge:
        'Find where each participant connected from, then look at how their media streams behaved.',
      guidance:
        'Three colleagues joined from three offices. Ask whether the network agrees.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      firstResponder: 'forensics',
      alsoAppropriate: ['ir-lead', 'fusion-analyst'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.reimage-now', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'There is no recording and there was never going to be, which has to be established early ' +
        'so that nobody spends the morning looking for one. The platform does not record by ' +
        'default, this meeting was not recorded, and no audio or video exists anywhere. What ' +
        'survives is metadata: attendance, join addresses and client versions, retained thirty ' +
        'days, and that metadata is what has answered every question so far. So the absence is ' +
        'less damaging than it feels, and the honest framing is worth getting right in both ' +
        'directions. What was said on that call cannot be established by anybody, ever, including ' +
        'whether the officer was told something that would have made anybody suspicious. Preserve ' +
        'the metadata now rather than at the end, because thirty days is short for something that ' +
        'will be looked at by insurers and possibly by a court, and it is the entire evidential ' +
        'record of the event.',
      standIn:
        'There is no recording and there was never going to be one, so nobody spend the morning ' +
        'hunting for it. Not recorded by default, this one was not recorded, no audio or video ' +
        'anywhere. What we have is attendance, join addresses and client versions, thirty day ' +
        'retention, and that metadata has answered every question so far. What was said on that ' +
        'call cannot be established by anybody, including whether she was told something that ' +
        'should have worried her. Exporting and hashing the metadata now, because thirty days is ' +
        'short for something insurers and possibly a court will want.',
      commandOptions: [
        { command: 'grep -iE "recording|retention" /evidence/conferencing/platform-config.yaml', correct: true, teaches: CORRECT_STEP },
        { command: 'sha256sum /evidence/conferencing/meeting-metadata.json | tee /evidence/conferencing/meta.sha256', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status conferencing', ...STATUS_CHECK },
        { command: 'cat /evidence/conferencing/platform-config.yaml', ...DUMP_ALL },
        { command: 'conf-cli purge --older-than 7d', ...MUTATE },
      ],
      commandNudge:
        'Find out whether a recording exists before anybody goes looking for one.',
      guidance:
        'You want to know what was said. Ask whether anything captured it.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['ir-lead', 'mitigation-specialist'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.declare', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The officer did not bypass the control. She performed it, and the report has to say so in ' +
        'the first sentence rather than the last. The procedure requires visual or verbal ' +
        'confirmation above half a million, it was introduced in 2022 after an email-based attempt, ' +
        'and it works against the thing it was written for. It specifies a call and says nothing ' +
        'about how a caller is verified as themselves, because in 2022 seeing somebody\'s face was ' +
        'verification and nobody writing that procedure was wrong to think so. She joined a meeting ' +
        'from her own calendar, saw three people she has worked with for four years, asked when the ' +
        'settlement had been agreed, and got an answer. Every step is the process working as ' +
        'written. The general point is the one to land: a verification step becomes attack surface ' +
        'the moment it is predictable, and a control that assumes a face is evidence of a person ' +
        'has an assumption in it that stopped being true. Getting this wrong produces a ' +
        'disciplinary conversation with the one person in the building who followed the rules.',
      standIn:
        'She did not bypass the control, she performed it, and that goes in the first line of the ' +
        'report rather than the last. The procedure requires visual or verbal confirmation above ' +
        'half a million, it was written in 2022 after an email attempt, and it works against email. ' +
        'It specifies a call and says nothing about verifying that a caller is who they appear to ' +
        'be, because in 2022 a face was verification and nobody was wrong to think so. She joined ' +
        'from her own calendar, saw three people she has worked with for four years, asked a ' +
        'question and got an answer. That is the process working as written. If we get this wrong ' +
        'we discipline the one person who followed the rules.',
      commandNudge:
        'Read the payments procedure and find what it says about verifying who is on the call.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.attribute-named', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'One action is time-limited and everything else can wait an hour. The money left at 15:40 ' +
        'yesterday, recall is most likely to succeed inside twenty-four hours, the receiving bank ' +
        'has not been contacted, and it is now 09:15. That call goes out before any technical work ' +
        'continues, and it is a treasury action rather than a SOC one, which means the job here is ' +
        'to make sure somebody with the authority is doing it right now. Then the narrow ' +
        'containment: reset the assistant account and revoke its sessions, which is straightforward ' +
        'and is the only credential known to be held. Then the control change that matters more ' +
        'than either, and it is available today because it needs no technology: four payments above ' +
        'half a million are scheduled today, and until the procedure is rewritten every one of them ' +
        'gets confirmed on a number from the internal directory dialled outward rather than on a ' +
        'call anybody joined, which is a step that cannot be faked by controlling the meeting. Turn ' +
        'off guest join for finance meetings if that can be done without breaking the auditors, and ' +
        'check before doing it rather than after. Deliberately left undone and said plainly: the ' +
        '1.9 million is gone unless the bank recalls it, nothing on this floor affects that, and ' +
        'the same attack works tomorrow against any of the other approvers until the procedure ' +
        'changes.',
      standIn:
        'One thing is time-limited. It left at 15:40 yesterday, recall works best inside ' +
        'twenty-four hours, the receiving bank has not been called, and it is quarter past nine. ' +
        'That call happens before any more technical work, and it is treasury\'s to make, so our ' +
        'job is making sure somebody with the authority is doing it now. Then reset the assistant ' +
        'account and kill its sessions, which is the only credential we know they hold. Then the ' +
        'thing that matters most and needs no technology: four payments above half a million are ' +
        'scheduled today, and until the procedure is rewritten every one gets confirmed on a number ' +
        'from the directory dialled outward, not on a call somebody joined. Check with the auditors ' +
        'before turning guest join off. Left undone: the money is gone unless the bank recalls it, ' +
        'and the same attack works tomorrow on any other approver.',
      commandNudge:
        'Work out which of the available actions stops being possible if you wait an hour.',
    },
    {
      eventId: 'ev.9',
      verdict: 'benign-true-positive',
      firstResponder: 'cloud-security',
      alsoAppropriate: ['soc-operator', 'log-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.declare', 'act.reset-password', 'act.attribute-named'],
      escalateTo: [],
      why:
        'A 740,000 dollar payment approved on a video call the same week, surfacing while the floor ' +
        'has learned that a video call approval is the attack, and it is genuine. Four checks close ' +
        'it and each mirrors something that convicted the other one: all four participants ' +
        'authenticated with Fenmarch accounts rather than joining as guests, they joined from ' +
        'branch and home ranges they have used for years rather than one hosting block, the meeting ' +
        'was created by the finance director from his own calendar six days in advance rather than ' +
        'by an assistant forty minutes before, and it is still in his calendar now. The beneficiary ' +
        'is a supplier paid monthly since 2019. Close it. The row exists because a sweep of every ' +
        'large payment approved by video is about to be run, it should be run, and it will surface ' +
        'a lot of these: the answer is not that video approval is compromised, it is that ' +
        'unauthenticated guests presenting as employees is, and a review that cannot tell those ' +
        'apart will stop the credit union approving payments at all.',
      standIn:
        'Seven hundred and forty thousand on Monday, also approved by video, and it is genuine. All ' +
        'four authenticated with Fenmarch accounts rather than joining as guests, all from branch ' +
        'and home ranges they have used for years, the meeting was created by the finance director ' +
        'from his own calendar six days ahead and it is still in his calendar, and the beneficiary ' +
        'is a supplier paid monthly since 2019. Closing it. Somebody is about to sweep every large ' +
        'video approval and they should, but the finding is not that video approval is compromised. ' +
        'It is that unauthenticated guests presenting as staff are. A review that cannot tell those ' +
        'apart stops us approving payments at all.',
      commandOptions: [
        { command: "awk -F, '$3==\"JOIN\" && $2==\"mtg-8841\" {print $4, $5, $6}' /var/log/conferencing/audit.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "mtg-8841" /var/log/conferencing/audit.csv | head', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status conferencing', ...STATUS_CHECK },
        { command: 'cat /var/log/conferencing/audit.csv', ...DUMP_ALL },
        { command: 'grep -c mtg-8841 /var/log/conferencing/audit.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check how the participants on Monday joined, and who created that meeting.',
      guidance:
        'Another payment approved by video. Ask what is different about this one.',
    },
  ],
};
