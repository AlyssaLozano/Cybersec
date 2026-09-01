/**
 * Scenario 39: The App Knows.
 *
 * A credential shipped to sixty thousand phones, and the API that trusted it.
 *
 * WHAT THIS TEACHES
 *
 * That nothing inside an application you hand to the public is secret. The
 * mobile app holds an API key so it can talk to the member API. Every install
 * carries the same key, sixty thousand people have a copy, and extracting it
 * takes about twenty minutes with tooling anybody can download.
 *
 * The consequence is a category error rather than a bug. The key was treated as
 * authentication, so the API asks "does this request carry a valid key" and,
 * having got a yes, serves whatever is asked for. It never asks who is holding
 * it. Rate limiting is applied per key, which means the limit is shared by
 * sixty thousand legitimate users and one scraper, and the scraper stays under
 * it comfortably.
 *
 * WHY VULNERABILITY ANALYSIS LEADS
 *
 * Because the finding is not the traffic, it is the design. Blocking the
 * scraper takes ten minutes and achieves nothing durable: the key is still on
 * sixty thousand phones and the next person to extract it starts again from a
 * different address. The seat that can say what the actual fix is, and what it
 * costs, owns this.
 *
 * THE UNCOMFORTABLE PART
 *
 * There is no clean remediation. Rotating the key requires every member to
 * update the app, and members who do not update lose access. `ev.6` is where
 * the floor has to hand that trade-off to somebody with a straight face.
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

const ID = 'the-app-knows';

export const THE_APP_KNOWS: Scenario = {
  id: ID,
  title: 'The App Knows',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 16:00 at Fenmarch Credit Union. The member API is serving more requests than the app ' +
    'has users awake, and every one of them is authenticated correctly.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'vulnerability-analyst',
    'detection-engineer',
    'cloud-security',
    'forensics',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Member API request volume up 40 percent with no corresponding app sessions',
      detail:
        'The member API has served 40 percent above its normal rate since Saturday. The mobile app ' +
        'analytics show no increase in active sessions, app opens or installs over the same period. ' +
        'Every request is authenticated and returns 200. Rule history: fired 4 times in thirty ' +
        'days, 4 closed as marketing campaigns driving traffic.',
      source: 'fcu-api-01',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'network-flow',
      summary: 'The additional traffic comes from a hosting range, not from mobile networks',
      detail:
        'The excess requests originate from eleven addresses in a commercial hosting range. Genuine ' +
        'app traffic arrives from mobile carrier ranges and residential broadband. The eleven ' +
        'addresses account for 41 percent of total API requests since Saturday and none of them has ' +
        'ever appeared before that.',
      source: 'fcu-api-01',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'raw-log',
      summary: 'All the traffic presents the same API key the app ships with',
      detail:
        'Every request from those addresses carries the API key embedded in the mobile application, ' +
        'and so does every genuine request, because there is one key for the whole app. The key has ' +
        'not changed since the app was published in 2022. Requests from the hosting range differ ' +
        'from app traffic only in the absence of certain optional headers the app normally sets.',
      source: 'fcu-api-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'host-artefact',
      summary: 'The key is recoverable from the published application in about twenty minutes',
      detail:
        'The published application package holds the key as a string in a configuration resource. ' +
        'Extracting it requires downloading the app, unpacking it and reading the resource, using ' +
        'freely available tooling and no specialist knowledge. Approximately 60,000 installs carry ' +
        'the same key. The key was never rotated because rotating it requires an app update.',
      source: 'published app package',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'cloud-audit',
      summary: 'The scraper is enumerating member identifiers sequentially',
      detail:
        'The requests walk the member lookup endpoint with sequential identifiers from 100001 ' +
        'upward, currently at 141,900, at roughly two requests per second per address. The endpoint ' +
        'returns member name, partial account number, branch and product holdings for any valid ' +
        'identifier. It does not check that the caller is the member being requested.',
      source: 'fcu-api-01',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'Rotating the key requires every member to update the app',
      detail:
        'The key is compiled into the application. Changing it means publishing a new version and ' +
        'refusing the old key, at which point every member who has not updated loses access. App ' +
        'store review takes 24 to 72 hours. Around 22 percent of the install base is more than two ' +
        'versions behind. Rate limiting is currently applied per key, which is the same key for ' +
        'every user.',
      source: 'fcu digital',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'Nine hundred failed API requests from one address this afternoon',
      detail:
        'One address produced 900 failed API requests between 14:00 and 15:30, all returning 401 ' +
        'with an expired token. The address is in a mobile carrier range and the pattern matches a ' +
        'client retrying against a stale session, which the app does after a network drop. The ' +
        'requests stopped when the app was reopened. Rule history: fired 200 times in thirty days, ' +
        '198 closed as client retry behaviour.',
      source: 'fcu-api-01',
      claimedSeverity: 'medium',
    },
  ],
};

export const THE_APP_KNOWS_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'The mobile app carries an API key so it can talk to the member API. There is one key for the whole app and it has not changed since 2022.',
    'It sits in a configuration resource inside the published package, and anybody can download the app, unpack it and read it in about twenty minutes.',
    'Roughly 60,000 installs carry the same key, so it was never a secret and could not have been.',
    'Since Saturday somebody has been using it from eleven hosting addresses, presenting exactly what a genuine app presents, minus a few optional headers.',
    'They are walking the member lookup endpoint with sequential identifiers, currently at 141,900, at about two requests a second per address.',
    'The endpoint returns name, partial account number, branch and product holdings for any valid identifier, and never checks that the caller is the member being asked about.',
    'Rate limiting is applied per key, and the key is shared by 60,000 legitimate users, so the scraper sits comfortably underneath it.',
    'Blocking the addresses takes ten minutes and fixes nothing. The key is still on 60,000 phones, and rotating it means every member who has not updated loses access.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1213'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.isolate', 'act.declare'],
      escalateTo: ['network-analyst', 'vulnerability-analyst'],
      why:
        'Every request authenticated, every request a 200, and four of four previous firings were ' +
        'marketing campaigns. Nothing is failing, so nothing looks wrong. The contradiction is ' +
        'sitting in the row and it takes one comparison: API traffic up 40 percent, app sessions ' +
        'flat. Those two numbers describe the same product and cannot both be right unless ' +
        'something other than the app is calling the API. That is the habit worth building here, ' +
        'because a floor that only looks at failures will never open this: correct, successful, ' +
        'authenticated traffic is exactly what this incident consists of.',
      standIn:
        'Member API up 40 percent since Saturday and app sessions, opens and installs are all flat. ' +
        'Every request authenticated, every one a 200. Four of four this month were marketing. ' +
        'Those two numbers cannot both be right unless something that is not the app is calling the ' +
        'API. Raising it.',
      commandOptions: [
        { command: "awk '{print $1}' /var/log/api/access.log | cut -d: -f1 | uniq -c | tail -7", correct: true, teaches: CORRECT_STEP },
        { command: 'diff <(cut -d, -f2 /var/log/analytics/sessions.csv) <(cut -d, -f2 /var/log/api/daily-counts.csv)', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fcu-api', ...STATUS_CHECK },
        { command: 'cat /var/log/api/access.log', ...DUMP_ALL },
        { command: 'grep -c 200 /var/log/api/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Compare the API request volume against the number of app sessions over the same days.',
      guidance:
        'Nothing is failing. Ask whether the number of requests matches the number of people using ' +
        'the app.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1213'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'detection-engineer'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['vulnerability-analyst', 'ir-lead'],
      why:
        'Where the extra traffic comes from, and the discriminator is the kind of network rather ' +
        'than the address. Phones are on mobile carrier ranges and residential broadband; eleven ' +
        'addresses in a commercial hosting range are not phones, whatever they claim to be. That is ' +
        'a durable signal and worth naming as such, because the addresses will rotate and the ' +
        'category will not. Forty-one percent of all API traffic from eleven addresses that have ' +
        'never appeared before Saturday sizes it immediately. Blocking them is the obvious next ' +
        'move and this seat should say plainly that it buys hours, not a fix.',
      standIn:
        'The extra traffic is eleven addresses in a commercial hosting range. Real app traffic comes ' +
        'from mobile carriers and residential broadband. Phones are not in a data centre. Those ' +
        'eleven are 41 percent of all API requests since Saturday and none of them existed before ' +
        'then. I can block them, and that buys hours rather than fixing anything.',
      commandOptions: [
        { command: "awk '{print $1}' /var/log/api/access.log | sort | uniq -c | sort -rn | head -15", correct: true, teaches: CORRECT_STEP },
        { command: "awk '{print $1}' /var/log/api/access.log | sort -u | xargs -n1 whois 2>/dev/null | grep -i netname", correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
        { command: 'cat /var/log/api/access.log', ...DUMP_ALL },
        { command: 'nmap -sT 198.51.100.90', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Group the requests by source and work out what kind of network each one is.',
      guidance:
        'Ask what network a phone is normally on, and whether these match.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1552.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['vulnerability-analyst', 'ir-lead'],
      why:
        'Why every request authenticates, and it is the sentence the whole scenario turns on: there ' +
        'is one key for the whole app. The scraper is not bypassing authentication, it is passing ' +
        'it, with the same credential every genuine user presents. So "authenticated" carries no ' +
        'information here at all, and any control built on it is decorative. The missing optional ' +
        'headers are the one usable discriminator and they are weak on purpose: they are trivially ' +
        'added once somebody notices, which is worth saying now so nobody builds the permanent fix ' +
        'on them.',
      standIn:
        'Every request from those addresses carries the API key the app ships with, and so does ' +
        'every real one, because there is one key for the whole app and it has not changed since ' +
        '2022. They are not bypassing authentication, they are passing it. The only difference is a ' +
        'few optional headers the app sets and they do not, and that is trivial for them to fix ' +
        'once they notice.',
      commandOptions: [
        { command: "awk '{print $8, $12}' /var/log/api/access.log | sort | uniq -c | sort -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -o "X-Api-Key: [A-Za-z0-9]*" /var/log/api/access.log | sort -u', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fcu-api', ...STATUS_CHECK },
        { command: 'cat /var/log/api/access.log', ...DUMP_ALL },
        { command: 'grep -c "X-Api-Key" /var/log/api/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at what credential the scraper presents, and compare it against what real app traffic ' +
        'presents.',
      guidance:
        'Every request is authenticated. Ask what it is authenticating with, and how many people ' +
        'have one of those.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1552.001'],
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.declare', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'How they got it, and the answer is that it was never withheld. A string in a configuration ' +
        'resource inside the published package, twenty minutes with free tooling and no specialist ' +
        'knowledge. Sixty thousand installs carry the same one. This is the category error to name ' +
        'explicitly in the report: a value shipped to the public is not a secret, whatever the code ' +
        'calls it, and treating it as authentication means the API has been open since 2022 to ' +
        'anybody who bothered. Nothing was breached and nothing failed. The reason it was never ' +
        'rotated is the same reason rotating it now is hard, which ev.6 has to deal with.',
      standIn:
        'The key is a string in a configuration resource in the published app. Download it, unpack ' +
        'it, read it. Twenty minutes, free tooling, no expertise. Sixty thousand installs carry the ' +
        'same one. It was never a secret and could not have been. Nothing was breached here, the ' +
        'API has been open to anybody who looked since 2022.',
      commandOptions: [
        { command: 'unzip -o /var/artefacts/fcu-member-4.2.apk -d /tmp/apk && grep -rio "api[_-]key[^<]*" /tmp/apk/res/', correct: true, teaches: CORRECT_STEP },
        { command: 'strings /var/artefacts/fcu-member-4.2.apk | grep -i "apikey\\|api_key"', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fcu-api', ...STATUS_CHECK },
        { command: 'cat /var/artefacts/build-manifest.json', ...DUMP_ALL },
        { command: 'curl -s https://198.51.100.90/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Get a copy of the published app and find out how hard the key actually is to extract.',
      guidance:
        'Ask where that key lives. If it ships to the public, ask whether it was ever secret.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1213'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.iam-audit'],
      outOfLaneActions: ['act.dismiss', 'act.reset-password', 'act.isolate', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'What is being taken and how much, and the arithmetic is the deliverable. Sequential ' +
        'identifiers from 100001, currently at 141,900, which is roughly 42,000 member records ' +
        'already retrieved: name, partial account number, branch and product holdings. The second ' +
        'finding is worse than the scraping and easy to miss because it is phrased as an absence: ' +
        'the endpoint does not check that the caller is the member being requested. That is a ' +
        'design flaw independent of the stolen key, and it means any authenticated caller can read ' +
        'any member. Two problems, and rotating the key fixes only one of them.',
      standIn:
        'They are walking member identifiers sequentially from 100001 and are at 141,900, so roughly ' +
        '42,000 member records already: name, partial account number, branch, product holdings. And ' +
        'the endpoint never checks the caller is the member being asked about. That is a separate ' +
        'flaw from the key, and rotating the key does not fix it.',
      commandOptions: [
        { command: "awk '$7 ~ /members\\// {print $7}' /var/log/api/access.log | grep -o '[0-9]*$' | sort -n | tail -1", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$7 ~ /members\\// {print $7}' /var/log/api/access.log | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fcu-api', ...STATUS_CHECK },
        { command: 'cat /var/log/api/access.log', ...DUMP_ALL },
        { command: 'grep -c members /var/log/api/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at which identifiers they have requested, and work out how many records that is.',
      guidance:
        'Ask what the endpoint returns and whether it checks who is asking.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['ir-lead', 'detection-engineer'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.declare', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'The trade-off, and there is no version of it that is simply correct. Rotating the key means ' +
        'a new app version, 24 to 72 hours of store review, and refusing the old key, at which ' +
        'point 22 percent of the install base loses access to their accounts. That is roughly ' +
        'thirteen thousand members locked out of a credit union, which is a serious harm to real ' +
        'people who did nothing wrong. Doing nothing means the scraping continues. The way through ' +
        'is to stop treating this as one decision: block the eleven addresses now, add per-member ' +
        'authorisation on the lookup endpoint this week which fixes the worse flaw without touching ' +
        'the key, then rotate the key with a forced-update window announced in advance. Naming ' +
        'those as three separate pieces of work with three different clocks is what this seat is ' +
        'for, and refusing to pretend the immediate block is a fix is the honest part.',
      standIn:
        'Rotating the key needs a new app version, 24 to 72 hours of store review, and refusing the ' +
        'old key locks out 22 percent of the install base, about thirteen thousand members. That is ' +
        'real harm to people who did nothing. But rate limiting is per key and the key is shared by ' +
        'everyone, so it constrains nothing. Three pieces of work: block the eleven now, add ' +
        'per-member authorisation on the endpoint this week, rotate the key with an announced ' +
        'forced update. The first one is not a fix and I will not present it as one.',
      commandOptions: [
        { command: "awk -F, '{print $3}' /var/log/analytics/install-versions.csv | sort | uniq -c | sort -rn", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "rate.limit" /etc/api-gateway/policy.conf', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status api-gateway', ...STATUS_CHECK },
        { command: 'cat /etc/api-gateway/policy.conf', ...DUMP_ALL },
        { command: 'wc -l /var/log/analytics/install-versions.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Work out what rotating the key would actually do to members, and what the rate limit is ' +
        'applied to.',
      guidance:
        'Ask what the fix costs the people who use this. Then look for the part you can fix without ' +
        'that cost.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss', 'act.tune'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.scope-estate'],
      escalateTo: [],
      why:
        'Nine hundred failed requests from one address, on the afternoon the floor is working API ' +
        'abuse. It is a client retrying against a stale session after a network drop, on a mobile ' +
        'carrier range, stopping when the app was reopened, and 198 of 200 this month were the ' +
        'same. Two checks settle it: what kind of network, and are they failing or succeeding. The ' +
        'second one is the useful contrast to carry into the report. Nine hundred failures are ' +
        'loud, harmless and produce an alert; forty-one percent of all traffic succeeding produced ' +
        'nothing at all, because everything about it was correct. That is the shape of the whole ' +
        'incident in one comparison.',
      standIn:
        'Nine hundred 401s from one address is a client retrying on a stale token after a network ' +
        'drop, mobile carrier range, stopped when the app was reopened. 198 of 200 this month were ' +
        'the same. Worth noting the contrast: nine hundred failures alerted, and 41 percent of our ' +
        'traffic succeeding did not. Closing it.',
      commandOptions: [
        { command: "awk '$9==401 {print $1}' /var/log/api/access.log | sort | uniq -c | sort -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$9==401 {print $1, $4}' /var/log/api/access.log | tail -20", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status fcu-api', ...STATUS_CHECK },
        { command: 'cat /var/log/api/access.log', ...DUMP_ALL },
        { command: 'grep -c 401 /var/log/api/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether those requests succeeded or failed, and what kind of network they came from.',
      guidance:
        'Failures are loud and usually harmless. Ask whether the thing you care about is failing at ' +
        'all.',
    },
  ],
};
