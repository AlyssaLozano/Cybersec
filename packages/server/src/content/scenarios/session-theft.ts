/**
 * Scenario 32: Already Logged In.
 *
 * A stolen session, where multi-factor authentication was never challenged
 * because it was never needed.
 *
 * WHAT THIS TEACHES
 *
 * That multi-factor authentication protects the act of authenticating, and
 * nothing after it. Once a session exists it is a bearer token: whoever holds it
 * is the user, no password is involved, no factor is requested, and no
 * authentication event is generated because no authentication happens.
 *
 * That single fact defeats most of a floor's reflexes at once. There is no
 * failed login to count, no impossible travel on a sign-in, no MFA prompt to
 * correlate, and resetting the password does not end the session. A floor that
 * has learned to look for authentication anomalies will find the account
 * completely clean while somebody else is using it.
 *
 * WHERE THE SIGNAL ACTUALLY IS
 *
 * In the session rather than the login. One session identifier in use from two
 * places at once, a device fingerprint that changes mid-session without a
 * reconnect, and activity that continues while the real user is demonstrably
 * doing something else. All three are available and none of them are in the
 * authentication log.
 *
 * WHY FENMARCH
 *
 * Because the clock does the teaching. A payee added at 09:14 pays out on the
 * next run, and the floor has to make the containment call on less evidence than
 * it wants. Getting the session killed matters more than understanding it, which
 * is uncomfortable and correct.
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

const ID = 'already-logged-in';

export const ALREADY_LOGGED_IN: Scenario = {
  id: ID,
  title: 'Already Logged In',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 09:30 at Fenmarch Credit Union. Something is happening on a member services account and ' +
    'the authentication log for it is completely clean. The afternoon payment run is at 14:00.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
    'forensics',
    'fusion-analyst',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'One session identifier active from two countries eleven minutes apart',
      detail:
        'Session SID-4471E9 shows activity from the Norwich office range at 09:02 and from ' +
        '198.51.100.140 at 09:13. Both are the same session identifier, not two sessions. The ' +
        'account is m.arundel, member services. Rule history: fired 30 times in thirty days, 28 ' +
        'closed as split tunnel VPN behaviour.',
      source: 'm.arundel',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 130,
      surface: 'raw-log',
      summary: 'No authentication event exists for the second location',
      detail:
        'The authentication log holds one sign-in for this account today, at 08:41, from the Norwich ' +
        'office, with the second factor satisfied. There is no sign-in, no failure, and no factor ' +
        'prompt corresponding to the 09:13 activity. The account password has not changed and no ' +
        'account lockout has occurred in ninety days.',
      source: 'fcu-idp-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 290,
      surface: 'network-flow',
      summary: 'The second location presents a different device fingerprint on the same session',
      detail:
        'Requests carrying SID-4471E9 from 198.51.100.140 present a different browser version, ' +
        'operating system and screen resolution from the Norwich requests on the same session. The ' +
        'session was not re-established between them. The address belongs to a consumer hosting ' +
        'provider and has no history in the estate.',
      source: '198.51.100.140',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 450,
      surface: 'cloud-audit',
      summary: 'A new payee was added to a member account at 09:14',
      detail:
        'A payee was added to member account 88-4419 at 09:14, one minute after the session ' +
        'appeared from the second address. The member holds a balance of 61,000 pounds. The payee ' +
        'is a newly registered business account. Member services staff add payees on request as ' +
        'routine work, and the action requires no second approval below 50,000 pounds.',
      source: 'm.arundel',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 610,
      surface: 'host-artefact',
      summary: 'Information stealer artefacts on the user home computer',
      detail:
        'The user reports checking work webmail from a home computer shared with family. That ' +
        'machine, examined with consent, holds a browser extension installed on the 19th that reads ' +
        'cookie stores, and a staging directory containing exported cookie data. The corporate ' +
        'session cookie for the identity platform is present in it.',
      source: 'personal device',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 770,
      surface: 'alert-queue',
      summary: 'Password reset does not terminate an existing session',
      detail:
        'The identity platform issues session tokens with an eight hour absolute lifetime and does ' +
        'not revoke existing sessions on password change. Sessions must be revoked explicitly, ' +
        'which is a separate administrative action available to the identity team. The current ' +
        'session expires at 16:41 if nothing is done. The payment run is at 14:00.',
      source: 'fcu-idp-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Fourteen accounts showing location changes mid-session this morning',
      detail:
        'Fourteen staff accounts show apparent location changes within active sessions since 08:00. ' +
        'All fourteen are on the new split tunnel VPN profile deployed on Monday, which routes ' +
        'application traffic outside the tunnel and therefore presents the local internet address. ' +
        'The change record documents the expected effect on geolocation. Rule history: fired 30 ' +
        'times in thirty days, 28 closed as split tunnel behaviour.',
      source: 'fcu-vpn-01',
      claimedSeverity: 'medium',
    },
  ],
};

export const ALREADY_LOGGED_IN_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'On the 19th an information stealer installed itself as a browser extension on a home computer the member services officer shares with family.',
    'It exported the browser cookie stores, including the corporate session cookie for the identity platform, saved when she checked work webmail from home.',
    'This morning somebody imported that cookie into their own browser. They were then already authenticated, as her, with no password and no second factor, because none of that happens when a session already exists.',
    'That is why the authentication log is clean: no sign-in occurred, so no sign-in was recorded, and there was nothing for the second factor to challenge.',
    'The same session identifier is now in use from Norwich and from a consumer hosting provider, presenting a different browser, operating system and screen resolution, without the session being re-established.',
    'At 09:14 they added a payee to a member account holding 61,000 pounds. Member services add payees as routine work and nothing below 50,000 requires a second approval.',
    'Resetting her password does nothing, because the platform does not revoke sessions on password change. The session runs until 16:41 unless somebody revokes it.',
    'The payment run is at 14:00.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1539'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'fusion-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.isolate', 'act.declare'],
      escalateTo: ['log-analyst', 'ir-lead'],
      why:
        'Twenty-eight of thirty this month were split tunnel VPN, and ev.7 shows fourteen more of ' +
        'exactly that this morning, so the pull to close is strong and the evidence for it is ' +
        'genuinely there. One word on this row separates it: the same session identifier, not two ' +
        'sessions. Split tunnelling changes the address a session appears to come from, and it does ' +
        'not put one session in two countries eleven minutes apart. Reading that field rather than ' +
        'the alert title is the whole event. Resetting the password is graded out of lane here and ' +
        'it is the near-universal instinct, for reasons ev.6 makes explicit.',
      standIn:
        'Session SID-4471E9 active from the Norwich range at 09:02 and from a hosting address at ' +
        '09:13. Same session identifier, not two sessions. Twenty-eight of thirty this month were ' +
        'split tunnel, and split tunnel does not put one session in two countries. Raising it.',
      commandOptions: [
        { command: "awk '$4==\"SID-4471E9\" {print $1, $3}' /var/log/idp/sessions.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep SID-4471E9 /var/log/idp/sessions.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fcu-idp', ...STATUS_CHECK },
        { command: 'cat /var/log/idp/sessions.log', ...DUMP_ALL },
        { command: 'grep -c SID-4471E9 /var/log/idp/sessions.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether that is one session appearing twice or two separate sessions.',
      guidance:
        'Most of these are VPN. Ask whether this is one session in two places, because VPN cannot ' +
        'do that.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1539', 'T1550.004'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'The finding, and it is an absence. One sign-in today at 08:41 with the second factor ' +
        'satisfied, and nothing at all corresponding to the 09:13 activity: no sign-in, no failure, ' +
        'no factor prompt. A floor trained to hunt authentication anomalies will read a clean log ' +
        'as a clean account, and it is the opposite. Nothing was recorded because nothing happened: ' +
        'a session already exists, so there is no authentication to log and nothing for a second ' +
        'factor to challenge. Multi-factor protects the act of authenticating and has no opinion ' +
        'about what happens afterwards. Once that lands, the whole shape of the investigation ' +
        'changes: stop looking at logins and start looking at the session.',
      standIn:
        'One sign-in today, 08:41, Norwich, second factor satisfied. Nothing at all for the 09:13 ' +
        'activity: no sign-in, no failure, no prompt. That is not a gap in the logging. There was ' +
        'no authentication, because the session already existed. MFA protects logging in and has no ' +
        'opinion about a session that is already open.',
      commandOptions: [
        { command: "awk '$5==\"m.arundel\"' /var/log/idp/auth.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i arundel /var/log/idp/auth.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fcu-idp', ...STATUS_CHECK },
        { command: 'cat /var/log/idp/auth.log', ...DUMP_ALL },
        { command: 'passwd -l m.arundel', ...MUTATE },
      ],
      commandNudge:
        'Look for the sign-in that corresponds to the second location, and think about what it ' +
        'means if there is not one.',
      guidance:
        'The authentication log is clean. Ask whether that means nothing happened, or that what ' +
        'happened was not an authentication.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1539'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The corroboration that rules out the innocent reading completely, and it comes from a ' +
        'field most floors never look at. A different browser version, operating system and screen ' +
        'resolution on the same session, with no re-establishment in between. Split tunnelling ' +
        'changes an address; it does not change the operating system halfway through a session. A ' +
        'person does not switch machines without logging in again. The only thing that produces ' +
        'this is the session token being presented from a different computer, which is exactly what ' +
        'a stolen cookie looks like. Device fingerprint continuity is the durable detection here ' +
        'and it is worth naming as such, because the address will change and the mismatch will not.',
      standIn:
        'The requests from that hosting address carry the same session but a different browser ' +
        'version, operating system and screen resolution, and the session was never re-established ' +
        'between them. VPN changes your address. It does not change your operating system ' +
        'mid-session. That token is being presented from a different computer.',
      commandOptions: [
        { command: "awk '$4==\"SID-4471E9\" {print $3, $7, $8}' /var/log/proxy/sessions.log | sort -u", correct: true, teaches: CORRECT_STEP },
        { command: 'grep SID-4471E9 /var/log/proxy/sessions.log', correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
        { command: 'cat /var/log/proxy/sessions.log', ...DUMP_ALL },
        { command: 'curl -sI https://198.51.100.140', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Compare the device details on the two ends of that session, not just the addresses.',
      guidance:
        'A VPN changes where you appear to be. Ask what else changed, and whether a person could ' +
        'have changed it.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      techniques: ['T1657'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'fusion-analyst'],
      correctActions: ['act.iam-audit'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'What they came for, and the timing is the proof: one minute after the session appears from ' +
        'the second address. Adding a payee is routine member services work, so nothing about the ' +
        'action is anomalous in isolation, and nothing below fifty thousand pounds requires a second ' +
        'approval. The account holds sixty-one thousand. Read together those two numbers say the ' +
        'attacker either knows the threshold or will find it, and that a payment run at 14:00 is the ' +
        'deadline rather than the end of the shift. This is the row that converts an interesting ' +
        'session anomaly into something with a time on it.',
      standIn:
        'A payee was added to member account 88-4419 at 09:14, one minute after that session showed ' +
        'up from the second address. The member holds sixty-one thousand and nothing under fifty ' +
        'needs a second approval. Payment run is 14:00. That is our deadline.',
      commandOptions: [
        { command: "awk '$3==\"PAYEE_ADD\" {print $1, $5, $6}' /var/log/core/audit.log | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep 88-4419 /var/log/core/audit.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status core-banking', ...STATUS_CHECK },
        { command: 'cat /var/log/core/audit.log', ...DUMP_ALL },
        { command: 'grep -c PAYEE_ADD /var/log/core/audit.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find what that account did in the minutes after the session appeared elsewhere.',
      guidance:
        'Ask what the session was used FOR, and when the money would actually move.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1539', 'T1176'],
      firstResponder: 'forensics',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'How the cookie left, and it happened on a machine this organisation has no control over ' +
        'and no right to touch without consent. A browser extension installed on the 19th that ' +
        'reads cookie stores, a staging directory of exported cookies, and the corporate session ' +
        'cookie among them. The chain is complete and the report should be careful with it: she ' +
        'checked work webmail from home, which is a thing most organisations tacitly permit, and ' +
        'framing this as her mistake produces a policy nobody follows rather than the control that ' +
        'would have helped. Note the examination was with consent, because a personal device ' +
        'examined without it is evidence nobody can use.',
      standIn:
        'Home computer, shared with family. Browser extension installed on the 19th that reads ' +
        'cookie stores, staging directory of exported cookies, and our identity platform session ' +
        'cookie is in it. Examined with consent and sealed. She checked work webmail from home, ' +
        'which we have never told anybody not to do.',
      commandOptions: [
        { command: 'ls -la ~/.config/chromium/Default/Extensions/ && stat ~/.config/chromium/Default/Cookies', correct: true, teaches: CORRECT_STEP },
        { command: 'find ~ -name "cookies*.json" -newermt "2026-08-19"', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status chromium', ...STATUS_CHECK },
        { command: 'cat ~/.config/chromium/Default/Preferences', ...DUMP_ALL },
        { command: 'rm -rf ~/.config/chromium/Default/Extensions/', ...MUTATE },
      ],
      commandNudge:
        'Find out where that session cookie could have been copied from, and what was installed ' +
        'there recently.',
      guidance:
        'The session had to be stolen somewhere. Ask where that account has been used outside the ' +
        'office.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'persistence',
      critical: true,
      techniques: ['T1550.004'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.reset-password', 'act.dismiss', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'The row that decides whether the containment works, and the instinct it corrects is close ' +
        'to universal. Resetting the password does nothing here: the platform does not revoke ' +
        'existing sessions on password change, so the stolen token keeps working until 16:41 ' +
        'whatever anybody does to the password. Session revocation is a separate administrative ' +
        'action and somebody has to ask the identity team for it. A floor that resets, watches ' +
        'nothing change, and assumes the reset propagated slowly will still be watching at 14:00. ' +
        'The two times are the whole argument: token expires 16:41, payment run 14:00.',
      standIn:
        'Resetting her password does not end that session. This platform does not revoke sessions ' +
        'on password change, so the token works until 16:41 regardless. Revocation is a separate ' +
        'action and the identity team has to do it. The payment run is at 14:00. I need that session ' +
        'killed now, not the password changed.',
      commandNudge:
        'Find out whether changing the password actually ends the session, and when the token ' +
        'expires on its own.',
      guidance:
        'You reset the password. Ask whether the session you are worried about noticed.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss', 'act.tune'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.revoke-key'],
      escalateTo: [],
      why:
        'Fourteen accounts with apparent location changes mid-session, on the morning the floor has ' +
        'found exactly that on a fifteenth. This is the split tunnel VPN profile deployed on ' +
        'Monday, which routes application traffic outside the tunnel so the local internet address ' +
        'is presented, with a change record that documents the geolocation effect. The distinction ' +
        'is precise and worth making explicitly, because it is the same distinction that made ev.1 ' +
        'worth taking: these fourteen change where a session appears to come from, and none of them ' +
        'puts one session in two places at once or changes the operating system mid-session. ' +
        'Escalating all fourteen on a morning with a 14:00 deadline is how the one that matters ' +
        'gets less attention.',
      standIn:
        'Fourteen accounts showing mid-session location changes are all on the split tunnel profile ' +
        'from Monday, change record documents the geolocation effect. Same rule, different thing: ' +
        'these change where a session appears from, none of them is in two places at once and none ' +
        'changes operating system mid-session. Closing them.',
      commandOptions: [
        { command: 'grep -i "split tunnel" /var/log/change-management.log', correct: true, teaches: CORRECT_STEP },
        { command: "awk '$6==\"GEO_CHANGE\" {print $5}' /var/log/idp/sessions.log | sort -u", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fcu-vpn', ...STATUS_CHECK },
        { command: 'cat /var/log/idp/sessions.log', ...DUMP_ALL },
        { command: 'grep -c GEO_CHANGE /var/log/idp/sessions.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check what changed on the VPN this week, and whether these fourteen look like the one you ' +
        'are working.',
      guidance:
        'Same alert, different thing. Ask what makes yours different from these fourteen.',
    },
  ],
};
