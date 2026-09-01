/**
 * Scenario 18: All At Once.
 *
 * Four things happening simultaneously, three of which are unrelated.
 *
 * WHAT THIS TEACHES
 *
 * Prioritisation under genuine overload, and the specific discipline of not
 * connecting things.
 *
 * Every other scenario rewards correlation. Find the link, notice the shared
 * address, spot that two seats are describing one event. That habit is correct
 * almost always, and this is the scenario where it is dangerous, because on a
 * board with four simultaneous incidents a floor with a correlation reflex will
 * build one grand narrative out of four separate stories and act on a picture
 * that does not exist.
 *
 * Three of the four things here are genuinely coincidental. Busy organisations
 * have busy days: a real ransomware operator, a real hardware failure, a real
 * unrelated credential stuffing campaign and a real change freeze violation can
 * all land on one Tuesday, and they did.
 *
 * WHAT THE LEAD IS ACTUALLY BEING TESTED ON
 *
 * Not analysis. Sequencing. Everything on this board is worth somebody's time
 * and there are not enough people, so the lead has to say out loud what is being
 * left unworked and accept that it is a decision rather than an oversight. A
 * floor that works all four evenly does badly on the one that had a clock.
 *
 * WHY THE ORDER IS NOT OBVIOUS
 *
 * The loudest event is the least important, the one with a deadline arrives
 * third, and the one that is genuinely nothing looks the most alarming. Reading
 * severity off the row gives the wrong order every time.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';
import {
  ALSO_WORKS,
  BROAD_SEARCH,
  COUNT_ONLY,
  CORRECT_STEP,
  DUMP_ALL,
  MUTATE,
  STATUS_CHECK,
  TOUCH_ATTACKER,
  WRONG_TARGET,
} from './distractors.js';

const ID = 'all-at-once';

export const ALL_AT_ONCE: Scenario = {
  id: ID,
  title: 'All At Once',
  difficulty: 'expert',
  durationMinutes: 60,
  situation:
    'It is 13:20 on a Tuesday and four separate things are on the board. You do not have enough ' +
    'people for all of them. Decide what gets worked, say what does not, and be careful about ' +
    'assuming any of it is connected.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'cloud-security',
    'forensics',
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
      summary: 'Public website unreachable, 240,000 requests a minute from 8,000 addresses',
      detail:
        'The public marketing website has been saturated since 13:04 by traffic from roughly 8,000 ' +
        'distinct addresses. The site is hosted externally by a marketing agency and contains no ' +
        'patient data, no authentication, and no connection to the internal estate. It is the ' +
        'organisation most visible asset and the switchboard is taking calls about it.',
      source: 'multiple',
      target: 'public website',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 90,
      surface: 'alert-queue',
      summary: 'Credential stuffing against the patient portal, 41,000 attempts in twenty minutes',
      detail:
        'The patient portal is receiving high-volume login attempts using email addresses and ' +
        'passwords, from 1,100 addresses. The success rate is 0.02 percent, which is nine accounts. ' +
        'All nine are patient accounts holding that individual own records only. Rate limiting is ' +
        'engaged and MFA is not available on patient accounts. Rule history: fired 22 times in ' +
        'thirty days, 20 closed as background credential stuffing.',
      source: 'multiple',
      target: 'patient portal',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 240,
      surface: 'process-tree',
      summary: 'Encryption utility staged on four clinical servers, scheduled for 15:00',
      detail:
        'A packed executable was written to four servers in the clinical namespace between 13:11 ' +
        'and 13:18, identical hash on each. Scheduled tasks on all four are set to run it at 15:00. ' +
        'The four servers hold the electronic patient record system. Nothing has executed. The ' +
        'endpoint agent on all four stopped reporting at 13:09.',
      source: 'clinical servers',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 380,
      surface: 'alert-queue',
      summary: 'Storage array reporting degraded redundancy on the imaging cluster',
      detail:
        'Two drives in the imaging storage array failed within forty minutes of each other. The ' +
        'array is running degraded and a third failure would mean data loss. The vendor has been ' +
        'engaged and replacement drives are four hours out. Radiology is still reading and writing ' +
        'normally. Rule history: fired 3 times in thirty days, 3 closed as hardware.',
      source: 'imaging storage',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 520,
      surface: 'network-flow',
      summary: 'The three external sources share no infrastructure with each other',
      detail:
        'The 8,000 website addresses, the 1,100 portal addresses and the source that reached the ' +
        'clinical servers have no overlap: different ranges, different providers, different ' +
        'countries of registration, and no shared address between any two sets. The clinical ' +
        'server access came from inside the estate, not from outside at all.',
      source: 'multiple',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.6',
      atSeconds: 660,
      surface: 'raw-log',
      summary: 'The clinical server access traces to a vendor support session opened at 11:40',
      detail:
        'The account that wrote the executable to the four clinical servers is a support account ' +
        'belonging to the electronic patient record vendor, used through a remote support session ' +
        'opened at 11:40 for a scheduled upgrade. The session is legitimate and was authorised by ' +
        'a change ticket. It is still open.',
      source: 'vendor support session',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 800,
      surface: 'host-artefact',
      summary: 'A configuration change deployed during an active change freeze',
      detail:
        'A firewall rule change was pushed to the perimeter at 12:50, during the declared change ' +
        'freeze for the imaging migration. It widens an inbound rule for a supplier integration. ' +
        'The engineer who pushed it has confirmed by phone that they did it, believed the freeze ' +
        'had lifted at noon, and can produce the ticket. It is a process failure with a named ' +
        'owner.',
      source: 'perimeter firewall',
      claimedSeverity: 'medium',
    },
  ],
};

export const ALL_AT_ONCE_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Four things happened on one Tuesday and only one of them was an intrusion.',
    'A volumetric flood took down an externally hosted marketing site that holds no data and touches nothing internal. Loud, visible, and almost harmless.',
    'A credential stuffing campaign hit the patient portal with reused passwords from somebody else breach. Nine patient accounts opened, each holding only that person own records. Background noise at industrial scale.',
    'Two drives failed in the imaging array within forty minutes. Genuine hardware, genuinely urgent, and nothing to do with security.',
    'Somebody used a legitimate open vendor support session to stage an encryption payload on the four servers holding the electronic patient record, silence the endpoint agents, and schedule it for 15:00.',
    'The three external sources share no infrastructure with each other, and the clinical access came from inside the estate through that session.',
    'The fourth thing, a firewall change during a freeze, is a process failure with a named owner who answered the phone.',
    'Only one of these has a deadline and it is the one that arrived third, claiming MEDIUM, on the quietest surface.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1498.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.isolate', 'act.declare', 'act.preserve', 'act.contact-attacker'],
      escalateTo: ['network-analyst'],
      why:
        'Real, malicious, and the least important thing on this board. The site is externally ' +
        'hosted, holds no patient data, has no authentication and no path into the estate, so the ' +
        'entire impact is reputational. It is also the loudest thing in the building: the site is ' +
        'down, the switchboard is ringing, and executives can see it from their phones. That ' +
        'pressure is the actual test. It is correctly raised and correctly handed to the agency ' +
        'that hosts it, and the floor spends almost no further time on it. Worth holding one ' +
        'suspicion lightly: floods are sometimes cover. Here they are not, and ev.5 is how you find ' +
        'that out rather than assuming either way.',
      standIn:
        'Public website saturated since 13:04 from about 8,000 addresses. It is externally hosted, ' +
        'holds no data, has no authentication and no route inside. Impact is reputational. Raising ' +
        'it and handing it to the hosting agency.',
      commandOptions: [
        { command: 'curl -sI https://www.example-rmg.test', ...TOUCH_ATTACKER },
        { command: 'awk \'{print $1}\' /var/log/cdn/access.log | sort -u | wc -l', ...WRONG_TARGET },
        { command: 'dig +short www.example-rmg.test', ...WRONG_TARGET },
        { command: 'cat /etc/hosting/agency-contact.txt', correct: true, teaches: CORRECT_STEP },
        { command: 'ping -c2 www.example-rmg.test', ...TOUCH_ATTACKER },
      ],
      commandNudge: 'Find out what that site actually holds and whether it connects to anything.',
      guidance:
        'Ask what the worst case is if this stays down all day. Loud and harmful are different ' +
        'things.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1110.004'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.isolate', 'act.declare', 'act.attribute-named', 'act.reset-password'],
      escalateTo: ['log-analyst'],
      why:
        'Genuine, ongoing, and second in priority rather than first. A 0.02 percent success rate is ' +
        'the signature of reused passwords from somebody else breach rather than anything targeted ' +
        'at this organisation, and rate limiting is already working. Nine accounts is nine real ' +
        'people whose records were opened, which is a genuine notifiable matter and needs owning, ' +
        'and it is bounded: patient accounts hold only that individual own records, so nine ' +
        'compromises are nine, not a doorway. The temptation is to treat two simultaneous ' +
        'high-volume external events as one campaign. Resist it until ev.5 says either way.',
      standIn:
        '41,000 login attempts on the patient portal from 1,100 addresses, 0.02 percent success, ' +
        'nine accounts open. That rate says reused credentials from somebody else breach. Rate ' +
        'limiting is holding. Nine patients need owning and each account only reaches its own ' +
        'records.',
      commandOptions: [
        { command: 'grep -c "login failed" /var/log/portal/auth.log', ...COUNT_ONLY },
        { command: 'awk \'/login ok/ {print $5}\' /var/log/portal/auth.log | sort -u', correct: true, teaches: CORRECT_STEP },
        { command: 'awk \'{print $1}\' /var/log/portal/auth.log | sort -u | wc -l', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status rate-limiter', ...STATUS_CHECK },
        { command: 'grep -c 200 /var/log/portal/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Work out the success rate, and what one compromised patient account can actually reach.',
      guidance:
        'Ask what a successful login here gets somebody. The blast radius decides the priority.',
    },
    {
      eventId: 'ev.3',
      critical: true,
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1486', 'T1562.001', 'T1053.005'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.decode', 'act.sandbox'],
      outOfLaneActions: ['act.dismiss', 'act.power-off', 'act.reimage-now', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'The only thing on this board with a deadline, and it arrives third, claiming MEDIUM, on ' +
        'the surface nobody is watching while two high-severity rows are on fire. Four servers ' +
        'holding the electronic patient record, an identical payload on each, scheduled for 15:00, ' +
        'and the endpoint agents on all four went silent at 13:09, two minutes before the staging ' +
        'began. Nothing has executed yet, which means everything is still recoverable and there are ' +
        'about a hundred minutes to keep it that way. If the floor works this and leaves the other ' +
        'three entirely unworked, that is a good afternoon. Reversed, it is the worst one this ' +
        'organisation has had.',
      standIn:
        'Identical packed executable on four clinical servers, staged between 13:11 and 13:18, ' +
        'scheduled to run at 15:00. Those four hold the electronic patient record. The endpoint ' +
        'agents on all four stopped reporting at 13:09. Nothing has run yet. This is the one with a ' +
        'clock.',
      commandOptions: [
        { command: 'schtasks /query /fo LIST /v | grep -B3 -A6 15:00', correct: true, teaches: CORRECT_STEP },
        { command: 'ls -la /opt/clinical/tmp/', ...WRONG_TARGET },
        { command: 'grep -c NO_CHECKIN /var/log/edr/console.log', ...COUNT_ONLY },
        { command: 'ps -ef | grep -i clinical', ...WRONG_TARGET },
        { command: 'systemctl status edr-agent', ...STATUS_CHECK },
      ],
      commandNudge:
        'Check whether it has run yet, and what is scheduled to run it.',
      guidance:
        'One of these four things has a deadline. Find out which, and what time it is.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.preserve', 'act.isolate', 'act.declare'],
      escalateTo: [],
      why:
        'Completely real, genuinely urgent, and not a security incident. Two drives inside forty ' +
        'minutes is unusual enough to feel deliberate, and drives in an array are the same age, ' +
        'from the same batch, under the same load, so correlated failure is expected rather than ' +
        'suspicious. The vendor is engaged, replacements are four hours out, and radiology is still ' +
        'working. The correct action is to hand it to the platform team and take it off the ' +
        'security board entirely. Two ways to get this wrong and both cost the afternoon: treating ' +
        'it as sabotage because of the timing, or letting the SOC own it because it looks serious. ' +
        'It is somebody else problem and saying so is the decision.',
      standIn:
        'Two drives failed in the imaging array within forty minutes, running degraded, vendor ' +
        'engaged, replacements four hours out, radiology still working. Drives in an array are the ' +
        'same age and batch, so correlated failure is normal. Not security. Handing it to platform ' +
        'and taking it off our board.',
      commandOptions: [
        { command: 'cat /var/log/storage/array-health.log | tail -20', ...WRONG_TARGET },
        { command: 'awk \'/FAILED/ {print $1, $4}\' /var/log/storage/array-health.log', ...WRONG_TARGET },
        { command: 'smartctl -a /dev/sdc | head -20', correct: true, teaches: CORRECT_STEP },
        { command: 'cat /var/log/storage/vendor-case.txt', ...DUMP_ALL },
        { command: 'df -h /mnt/imaging', ...STATUS_CHECK },
      ],
      commandNudge:
        'Check how old those drives are and whether they came from the same batch.',
      guidance:
        'Ask whether this needs a security response or an engineer. Not everything urgent is yours.',
    },
    {
      eventId: 'ev.5',
      verdict: 'benign-true-positive',
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.declare', 'act.isolate', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The event that stops the floor building a story that does not exist, and it is the fusion ' +
        'seat earning its chair by REFUSING to connect things. Three source sets with no overlap in ' +
        'range, provider or registration, and the clinical access not external at all. A floor ' +
        'primed by every other scenario to look for the shared address will find none, and the ' +
        'correct output is a negative finding stated as confidently as a positive one. It matters ' +
        'practically as well as intellectually: a coordinated multi-vector attack and three ' +
        'coincidences on a busy Tuesday call for completely different responses, and only one of ' +
        'them is true. Worth stating the limit too. No shared infrastructure is strong evidence of ' +
        'no coordination and not proof of it.',
      standIn:
        'The 8,000 website sources, the 1,100 portal sources and the clinical server access have no ' +
        'overlap at all: different ranges, providers and registrations, no shared address between ' +
        'any two. And the clinical access is not external, it came from inside. These are three ' +
        'separate things. I can say that confidently; I cannot prove a negative absolutely.',
      commandNudge:
        'Compare the three source sets against each other and see whether anything overlaps.',
      guidance:
        'Before you connect these, check whether anything actually links them. Saying they are ' +
        'unrelated is a finding.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1199', 'T1078.003'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.reset-password', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'How they got to the clinical servers, and the answer is that nobody broke in. A legitimate ' +
        'vendor support session, opened at 11:40 for a scheduled upgrade, authorised by a change ' +
        'ticket, and still open. The trust boundary here is the supplier, not the perimeter, and ' +
        'that is a boundary most estates have no visibility into at all. Be precise about what this ' +
        'does and does not establish. It establishes the route. It does not establish whether the ' +
        'vendor engineer did this, whether their credential is compromised, or whether somebody ' +
        'else is riding the session, and those have very different consequences for a supplier ' +
        'relationship. Terminate the session, preserve it, and report the route without naming a ' +
        'culprit.',
      standIn:
        'The clinical staging came through a vendor support session opened at 11:40 for a scheduled ' +
        'upgrade, authorised by a change ticket, still open. Nobody broke in. I can tell you the ' +
        'route. I cannot tell you whether that is the vendor engineer, a compromised vendor ' +
        'credential, or somebody riding the session.',
      commandOptions: [
        { command: 'grep -i "support session" /var/log/remote-access.log', ...WRONG_TARGET },
        { command: 'awk \'/vendor-svc/ {print $1, $6}\' /var/log/auth.log | tail -20', correct: true, teaches: CORRECT_STEP },
        { command: 'grep 11:40 /var/log/remote-access.log', ...WRONG_TARGET },
        { command: 'cat /var/log/change-management.log | grep -i upgrade', ...WRONG_TARGET },
        { command: 'who', ...STATUS_CHECK },
      ],
      commandNudge:
        'Find which account wrote those files and how that account got onto the servers.',
      guidance:
        'Ask how they reached those hosts. Not every way in comes through the perimeter.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss', 'act.tune'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: [],
      why:
        'A firewall rule widened during a change freeze, twenty minutes before a flood started and ' +
        'thirty before an encryption payload was staged. On this board that timing looks like the ' +
        'thread tying everything together. It is an engineer who thought the freeze lifted at noon, ' +
        'answered the phone, confirmed it, and can produce the ticket. One phone call settles it, ' +
        'and it is a process failure with a named owner rather than a security incident. Two costs ' +
        'to getting it wrong. It burns time the 15:00 deadline does not have, and it points an ' +
        'investigation at a colleague who did something careless and nothing worse, which is a hard ' +
        'thing to walk back.',
      standIn:
        'Firewall rule widened at 12:50 during the freeze. Engineer confirmed by phone they pushed ' +
        'it, thought the freeze lifted at noon, and has the ticket. Process failure with a named ' +
        'owner, not a security incident. Closing it and raising it with change management.',
      commandOptions: [
        { command: 'grep 12:50 /var/log/firewall/changes.log', correct: true, teaches: CORRECT_STEP },
        { command: 'cat /var/log/change-management.log | grep -i freeze', ...WRONG_TARGET },
        { command: 'iptables -L -n | head -30', ...WRONG_TARGET },
        { command: 'diff /etc/firewall/rules.prev /etc/firewall/rules', ...WRONG_TARGET },
        { command: 'git -C /etc/firewall log --oneline -5', ...WRONG_TARGET },
      ],
      commandNudge:
        'Find out who pushed that change and whether anybody has asked them about it.',
      guidance:
        'Somebody made this change. Ask them before you decide what it means.',
    },
  ],
};
