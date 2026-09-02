/**
 * Scenario 48: The Voice On The Phone.
 *
 * A control that assumed you can tell who is speaking.
 *
 * WHAT THIS TEACHES
 *
 * That a recognised voice stopped being evidence of identity, and that a great
 * many organisations still have a process resting on it.
 *
 * Verbal authorisation exists here for a real reason: the finance director
 * travels, payments need releasing while she is in the air, and a phone call was
 * the practical answer for twenty years. Nobody wrote a bad process. What
 * changed is that forty minutes of her speaking at a conference is on the
 * internet, and that is now enough.
 *
 * WHY THE OPERATOR LEADS
 *
 * Because the finding is available to anybody who checks two facts against each
 * other, and needs no specialist tooling at all: the call came in at 14:12, and
 * she was somewhere she could not have made it. The whole scenario turns on
 * corroborating a claim about a person against a record of where that person
 * was, which is the cheapest and most under-used move in this job.
 *
 * THE THING THAT MAKES THE REPORT HARD
 *
 * The payments officer did everything the procedure asked. Twice. Writing this
 * up as a failure of theirs produces a slower payments desk and the same
 * exposure, and the recommendation that actually works is unpopular: the verbal
 * path has to go, and the director will lose something she relies on.
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

const ID = 'the-voice-on-the-phone';

export const THE_VOICE_ON_THE_PHONE: Scenario = {
  id: ID,
  title: 'The Voice On The Phone',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 16:20 at Fenmarch Credit Union. A payment of $180,000 was released this afternoon ' +
    'on a verbal authorisation, and the person who gave it says she did not.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
    'fusion-analyst',
    'forensics',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'A 180,000 pound payment released on verbal authorisation at 14:19',
      detail:
        'A supplier payment of $180,000 was released at 14:19 against a verbal authorisation ' +
        'recorded by a payments officer at 14:12. The payment exceeded her release limit and the ' +
        'verbal path is the documented exception for amounts above it when an authorised director ' +
        'is unavailable to approve in the system. The finance director says she made no such call. ' +
        'Rule history: verbal authorisations are logged to the payments system and no security rule ' +
        'covers them.',
      source: 'fcu core banking',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'raw-log',
      summary: 'The call was recorded and the voice is recognisably hers',
      detail:
        'The payments desk records all calls. The 14:12 recording runs three minutes and the voice ' +
        'is recognisably the finance director to three colleagues who listened to it, including her ' +
        'own deputy. It uses her habitual phrasing, refers to a supplier dispute discussed at a ' +
        'meeting last week, and sounds slightly hurried. The audio has no obvious artefacts.',
      source: 'payments desk',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'network-flow',
      summary: 'The call arrived from outside and presented an internal extension',
      detail:
        'Telephony records show the call entering through the external trunk at 14:11 and ' +
        'presenting caller identification for extension 2140, which is the finance director desk. ' +
        'The switch accepts and displays caller identification supplied by the calling network ' +
        'without validation. Extension 2140 itself made no outbound call at any point that day.',
      source: 'fcu-pbx-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'host-artefact',
      summary: 'The director was in the air between 13:40 and 15:25',
      detail:
        'The director corporate travel record shows a flight departing 13:40 and landing 15:25, ' +
        'confirmed by the booking system and by her calendar. Her mobile shows no activity in that ' +
        'window and her corporate account has no session between 13:31 and 15:48. She could not ' +
        'have placed the 14:12 call.',
      source: 'travel and calendar',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'alert-queue',
      summary: 'Forty minutes of her speaking is published online',
      detail:
        'The director gave a forty minute conference presentation in May which is published in full ' +
        'on a public video platform, and appears on two podcast episodes. That is well beyond what ' +
        'current voice synthesis requires. The supplier dispute referenced in the call was ' +
        'discussed in a meeting whose minutes are circulated to fourteen people and stored on a ' +
        'shared drive.',
      source: 'open source',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'The verbal path is used about twenty times a year and has no second factor',
      detail:
        'The verbal authorisation exception has been used 19 times in the last twelve months, all ' +
        'genuine, mostly while a director was travelling. The procedure requires the officer to ' +
        'recognise the voice and record the call. There is no callback step, no code word, and no ' +
        'requirement to confirm in writing afterwards. Removing the path would mean payments above ' +
        'the officer limit wait for a director to reach a system.',
      source: 'payments procedure',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'A second verbal authorisation on Tuesday for $94,000',
      detail:
        'A verbal authorisation was recorded on Tuesday at 11:05 for $94,000, given by the ' +
        'operations director. The call originated from extension 2151 internally, the switch ' +
        'records it as an internal leg with no external trunk involved, he was in the building and ' +
        'badged in at 08:20, and he confirmed it in writing by email at 11:40 unprompted. Rule ' +
        'history: verbal authorisations are logged and no security rule covers them.',
      source: 'payments desk',
      claimedSeverity: 'medium',
    },
  ],
};

export const THE_VOICE_ON_THE_PHONE_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'The finance director gave a forty minute conference presentation in May which is published in full online, and appears on two podcasts.',
    'That is far more speech than current synthesis needs.',
    'Somebody used it to place a call at 14:12 in her voice, through the external trunk, presenting caller identification for her desk extension. The switch displays whatever the calling network supplies and validates none of it.',
    'They referenced a supplier dispute from a meeting whose minutes go to fourteen people on a shared drive, which is what made the call sound informed rather than generic.',
    'The payments officer recognised the voice and recorded the call, which is exactly what the procedure asks for, and released $180,000 at 14:19.',
    'The director was in the air between 13:40 and 15:25 and could not have made the call.',
    'The verbal path exists because directors travel and payments need releasing, it has been used 19 times in a year and every previous use was genuine.',
    'It has no callback, no code word and no written confirmation. The only control is that the officer recognises the voice, and recognising a voice is no longer evidence of anything.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1657'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'fusion-analyst'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'log-analyst'],
      why:
        'A payment above the officer limit, released through a documented exception, and the person ' +
        'who authorised it says she did not. Declare on that alone: whichever way it resolves, ' +
        '$180,000 moved on an authorisation somebody is disputing, and at a credit union the ' +
        'recall window is measured in hours. Two things are worth holding lightly at this point ' +
        'rather than assuming. Nobody has established yet whether the call was faked or the ' +
        'director is mistaken about her own afternoon, and both have happened before. And the ' +
        'officer followed the documented process, so this is not a compliance failure to be ' +
        'investigated as one.',
      standIn:
        '$180,000 released at 14:19 on a verbal authorisation recorded at 14:12. Above the ' +
        'officer limit, through the documented exception, and the finance director says she made no ' +
        'such call. Declaring. Recall window is hours and I am not yet assuming which of them is ' +
        'wrong.',
      commandOptions: [
        { command: "awk -F, '$4==\"VERBAL\" {print $1, $3, $6}' /var/log/core/authorisations.csv | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -A6 "14:19" /var/log/core/payments.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status core-banking', ...STATUS_CHECK },
        { command: 'cat /var/log/core/payments.log', ...DUMP_ALL },
        { command: 'grep -c VERBAL /var/log/core/authorisations.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find the authorisation record and what it was for, before deciding who is mistaken.',
      guidance:
        'Somebody says they did not do a thing the system says they did. Ask what would prove it ' +
        'either way.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1598.004'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'fusion-analyst'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'network-analyst'],
      why:
        'The recording is the reason everybody believed it and it is worth being precise about what ' +
        'it establishes. Three colleagues including her own deputy recognise the voice, it uses her ' +
        'phrasing, it refers to a real supplier dispute, and there are no obvious artefacts. All of ' +
        'that is true and none of it is identification. Human voice recognition was reliable ' +
        'evidence for as long as producing a convincing imitation was hard, and it stopped being ' +
        'hard. The detail that should have raised something at the time is the smallest one: ' +
        'sounding hurried is a technique, because urgency is what stops somebody saying they will ' +
        'ring back.',
      standIn:
        'The call is recorded, three minutes, and three colleagues including her deputy say it is ' +
        'recognisably her. Her phrasing, a real supplier dispute, no obvious artefacts. All true and ' +
        'none of it identifies anybody. It also sounds hurried, which is the part that stops you ' +
        'offering to ring back.',
      commandOptions: [
        { command: 'ls -la /var/recordings/2026-09-16/ && ffprobe /var/recordings/2026-09-16/1412-ext2140.wav 2>&1 | head', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -A4 "14:12" /var/log/pbx/call-detail.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status asterisk', ...STATUS_CHECK },
        { command: 'cat /var/log/pbx/call-detail.log', ...DUMP_ALL },
        { command: 'rm /var/recordings/2026-09-16/1412-ext2140.wav', ...MUTATE },
      ],
      commandNudge:
        'Find the recording and establish what it actually proves about who was speaking.',
      guidance:
        'Everybody recognises the voice. Ask what recognising a voice is worth as evidence now.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1598.004'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The technical proof, and it is two records read together. The call entered through the ' +
        'external trunk at 14:11 while presenting caller identification for the director internal ' +
        'desk extension, and extension 2140 made no outbound call all day. Caller identification is ' +
        'supplied by the calling network and the switch displays it without validating anything, ' +
        'which is how telephony has always worked and is understood by almost nobody outside it. So ' +
        'the officer saw an internal extension on the display, which is corroboration in every ' +
        'sense that matters to a person under time pressure and none that matters technically. That ' +
        'gap between what a display asserts and what it verifies is the finding.',
      standIn:
        'The call came in through the external trunk at 14:11 presenting caller ID for extension ' +
        '2140, the director desk, and 2140 made no outbound call all day. Caller ID is supplied by ' +
        'the calling network and our switch displays it without validating it. She saw an internal ' +
        'extension on the display and it meant nothing.',
      commandOptions: [
        { command: "awk '$5==\"2140\" {print $1, $3, $7}' /var/log/pbx/call-detail.log | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "trunk\\|external" /var/log/pbx/call-detail.log | grep 14:1', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status asterisk', ...STATUS_CHECK },
        { command: 'cat /var/log/pbx/call-detail.log', ...DUMP_ALL },
        { command: 'grep -c 2140 /var/log/pbx/call-detail.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether that call came from inside the building or from the external trunk.',
      guidance:
        'The display showed an internal extension. Ask what the switch actually checked before ' +
        'showing it.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1656'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.isolate', 'act.reset-password', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The corroboration that settles it, and it comes from three systems that have nothing to do ' +
        'with security. A flight departing 13:40 and landing 15:25, confirmed by the booking system ' +
        'and her calendar, no mobile activity in the window, no corporate session between 13:31 and ' +
        '15:48. She could not have made the call. That is the cheapest move available in this whole ' +
        'job and it is chronically under-used: when somebody claims a person did something, check ' +
        'where that person actually was. Travel records, badge records and calendars are ' +
        'independent of anything an attacker controls, and it took about ten minutes.',
      standIn:
        'Travel record has her departing 13:40 and landing 15:25, confirmed by the booking system ' +
        'and her calendar. No mobile activity in that window and no corporate session between 13:31 ' +
        'and 15:48. She was in the air at 14:12. Three systems, none of them ours, all agreeing.',
      commandOptions: [
        { command: 'grep -i "j.calloway" /var/log/travel/bookings.csv && grep j.calloway /var/log/idp/sessions.log | tail', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$2==\"j.calloway\" {print $3, $4}' /var/log/travel/bookings.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status calendar-sync', ...STATUS_CHECK },
        { command: 'cat /var/log/idp/sessions.log', ...DUMP_ALL },
        { command: 'grep -c calloway /var/log/idp/sessions.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out where the director actually was at 14:12, using records that are not ours to ' +
        'change.',
      guidance:
        'Ask where the person was. Travel, calendar and badge records are independent of anything ' +
        'an attacker controls.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'reconnaissance',
      critical: true,
      techniques: ['T1589', 'T1591'],
      firstResponder: 'forensics',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.isolate'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Where the voice came from, and it is not a compromise of anything. Forty minutes of ' +
        'published conference audio and two podcast appearances, which is far beyond what current ' +
        'synthesis needs. Nothing was stolen to produce this and there is no way to un-publish a ' +
        'conference talk, so the exposure is permanent and applies to every senior person who has ' +
        'ever spoken publicly. The second half is the more interesting one: the supplier dispute ' +
        'reference is what made the call sound informed rather than generic, and it came from ' +
        'meeting minutes circulated to fourteen people on a shared drive. That is a much smaller ' +
        'and more addressable set than the audio, and it is worth establishing whether that ' +
        'circulation list is the leak or whether the dispute was discussed with the supplier too.',
      standIn:
        'Forty minutes of her speaking is published from a May conference, plus two podcasts. That ' +
        'is far more than synthesis needs and there is no way to unpublish it. Nothing was stolen ' +
        'to make this. The supplier dispute reference is the part that made it sound informed, and ' +
        'that came from minutes circulated to fourteen people on a shared drive. That list is worth ' +
        'looking at.',
      commandOptions: [
        { command: 'grep -ril "supplier dispute" /mnt/shared/finance/minutes/ | head', correct: true, teaches: CORRECT_STEP },
        { command: 'cat /var/log/osint/exec-exposure.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fileserver', ...STATUS_CHECK },
        { command: 'cat /mnt/shared/finance/minutes/2026-09-09.txt', ...DUMP_ALL },
        { command: 'curl -s https://video-platform.example/watch?v=fcu-keynote', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Work out where somebody would get both her voice and the detail she referred to.',
      guidance:
        'They sounded like her and they knew something. Ask where each of those came from ' +
        'separately.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.sequence-remedy'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reset-password', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'The remedy, and the unpopular part of it. The verbal path has been used 19 times in a year, ' +
        'every previous use genuine, and it exists because directors travel and payments need ' +
        'releasing. The only control is that the officer recognises the voice, and that stopped ' +
        'being a control. There is no callback, no code word and no written confirmation, which ' +
        'means three cheap compensating measures are available immediately and none of them ' +
        'requires removing the path: a callback to the number already on file rather than the ' +
        'number that rang, a code word agreed in advance and not stored with the payments system, ' +
        'and written confirmation before release rather than after. The narrowest version is the ' +
        'callback, and it would have ended this call in thirty seconds. Say plainly that this ' +
        'inconveniences the directors, because the recommendation will be argued with by the person ' +
        'it inconveniences most.',
      standIn:
        'The verbal path is used about twenty times a year and every previous one was genuine. It ' +
        'exists because directors travel. The only control is recognising the voice and that is ' +
        'gone. Three cheap fixes and none needs the path removed: callback to the number on file, a ' +
        'code word agreed in advance, written confirmation before release rather than after. The ' +
        'callback alone would have ended this in thirty seconds. It will annoy the directors and I ' +
        'am recommending it anyway.',
      commandNudge:
        'Find out how often that path is used and what the procedure actually requires of the ' +
        'officer.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['fusion-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.reset-password'],
      escalateTo: [],
      why:
        'The same exception, the same week, for a large amount, and it is entirely genuine. Four ' +
        'things separate it and every one is checkable in minutes: the switch records an internal ' +
        'leg with no external trunk involved, so the call really did come from inside; extension ' +
        '2151 is his; he badged in at 08:20 and was in the building; and he confirmed in writing ' +
        'at 11:40 unprompted. This is here because a floor that has just found a fraudulent verbal ' +
        'authorisation will want to treat all 19 as suspect, and reviewing them is reasonable while ' +
        'escalating them is not. The discriminator is precise and reusable, which is the internal ' +
        'leg rather than the caller display, and it is exactly the check nobody made at 14:12.',
      standIn:
        'Tuesday 11:05 for 94,000 by the operations director is genuine. Switch records it as an ' +
        'internal leg with no external trunk, extension 2151 is his, he badged in at 08:20, and he ' +
        'confirmed in writing at 11:40 without being asked. Internal leg versus caller display is ' +
        'the difference, and it is the check nobody made at 14:12. Closing it.',
      commandOptions: [
        { command: "awk '$3==\"INTERNAL\" && $5==\"2151\" {print $1, $7}' /var/log/pbx/call-detail.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "11:05\\|11:40" /var/log/pbx/call-detail.log /var/log/mail/sent.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status asterisk', ...STATUS_CHECK },
        { command: 'cat /var/log/pbx/call-detail.log', ...DUMP_ALL },
        { command: 'grep -c INTERNAL /var/log/pbx/call-detail.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether that call was an internal leg or came through the trunk, and whether he ' +
        'confirmed it.',
      guidance:
        'You just found a fake one. Ask what makes this one different rather than escalating all ' +
        'nineteen.',
    },
  ],
};
