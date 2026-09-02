/**
 * Scenario 71: Our Own Customers.
 *
 * The tracking service is down under forty times its normal traffic, and almost
 * all of that traffic is real people who want their parcels.
 *
 * WHAT THIS TEACHES
 *
 * That an outage is not automatically an attack, and that the security response
 * to a flood you caused yourself makes it worse.
 *
 * Every instinct on this board is to treat volume as hostility. Nine hundred
 * thousand sources looks like a botnet until somebody notices they are
 * distributed exactly like the customer base, and ninety-four per cent of them
 * carry one mobile application version released yesterday. A blip at 06:02
 * returned errors, that version retries immediately on failure with no backoff,
 * and the retries produced enough load to keep generating the errors that
 * caused them. Nobody did this to Ardal. Ardal shipped it on Tuesday.
 *
 * WHY THAT MATTERS RATHER THAN BEING AN EXCUSE
 *
 * The security actions available all point the wrong way. Engaging upstream
 * scrubbing costs real money and filters real customers. Blocking the mobile
 * carrier ranges blocks the people the service exists for. Both would be
 * defensible responses to the attack this looks like, and both extend an outage
 * that a server-side change ends.
 *
 * AND THE PART THAT IS REAL
 *
 * Inside the noise, six addresses are sending four hundred requests a second to
 * a search endpoint that costs two seconds of database time each. That is small
 * enough to be invisible while the floor is watching gigabits, and it is the
 * only traffic on the board that was sent by somebody who wanted the service
 * down.
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

const ID = 'our-own-customers';

export const OUR_OWN_CUSTOMERS: Scenario = {
  id: ID,
  title: 'Our Own Customers',
  difficulty: 'intermediate',
  durationMinutes: 60,
  situation:
    'It is 07:15 at Ardal Freight. The public consignment tracking service has been unreachable ' +
    'for an hour and is taking forty times its usual traffic. The scrubbing vendor is on the phone ' +
    'waiting for a decision.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
    'fusion-analyst',
    'detection-engineer',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'The tracking service is down under forty times normal load',
      detail:
        'ADF-TRACK-02 has returned errors or timeouts to most requests since 06:02. Request rate is ' +
        '41 times the Tuesday morning baseline and has been climbing steadily rather than in ' +
        'bursts. The service is public, unauthenticated, and handles around 900,000 consignment ' +
        'lookups a day. Rule history: the volumetric alert has fired 3 times in two years, twice ' +
        'for Black Friday and once for a marketing campaign.',
      source: 'ADF-TRACK-02',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'network-flow',
      summary: 'Nine hundred thousand sources, distributed like the customer base',
      detail:
        'Traffic originates from 903,000 distinct addresses. Ninety-one per cent are mobile carrier ' +
        'and residential broadband ranges. Geographic distribution matches the Ardal consignment ' +
        'recipient base within four per cent by state. Each source sends between 6 and 40 requests ' +
        'an hour, which is a normal per-user rate. There is no spoofing, no reflection, and no ' +
        'protocol abuse: these are complete, well-formed HTTPS sessions.',
      source: 'ADF-TRACK-02',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'raw-log',
      summary: 'Ninety-four per cent carry one mobile application version',
      detail:
        'Ninety-four per cent of requests present the user agent of the Ardal consignment tracking ' +
        'app, version 4.7.0, released to both app stores on Tuesday afternoon. Version 4.6.2 and ' +
        'earlier account for four per cent, browsers for two per cent. Before 06:02 today, 4.7.0 ' +
        'accounted for 38 per cent of traffic at an ordinary request rate.',
      source: 'ADF-TRACK-02',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'host-artefact',
      summary: 'The new app version retries instantly and forever',
      detail:
        'Release notes for 4.7.0 include "improved reliability of tracking lookups". The change ' +
        'replaced a failed lookup with an immediate retry and removed the previous exponential ' +
        'backoff, with no retry ceiling. A database failover at 06:02 returned errors for 90 ' +
        'seconds. Every 4.7.0 client that received an error began retrying without pause, and the ' +
        'resulting load has been sufficient to keep the service returning errors since.',
      source: 'mobile release 4.7.0',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'network-flow',
      summary: 'Six addresses are doing something different',
      detail:
        'Six addresses in 203.0.113.64/28 have sent a sustained 400 requests a second since 05:54, ' +
        'eight minutes before the failover. They do not use the tracking lookup path. Every request ' +
        'is to /api/v2/search with a wildcard consignment reference and a date range spanning four ' +
        'years. They present no user agent. Their combined bandwidth is 0.3 per cent of total ' +
        'traffic.',
      source: '203.0.113.64/28',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'A search costs two seconds of database time and a lookup costs nine milliseconds',
      detail:
        'A consignment lookup by reference is an indexed read averaging 9 milliseconds. A wildcard ' +
        'search across a four year range averages 2.1 seconds and holds a connection for the ' +
        'duration. The database connection pool holds 40 connections. At 400 requests a second the ' +
        'six addresses require more connection time than the pool can supply, and the failover at ' +
        '06:02 was the pool exhausting.',
      source: 'ADF-TRACK-02',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 940,
      surface: 'cloud-audit',
      summary: 'The search endpoint was never meant to be public',
      detail:
        '/api/v2/search was added in January for the internal customer service console and requires ' +
        'no authentication, because at the time it was reachable only from the office range. A load ' +
        'balancer rule change in June, made to publish a new status page, moved the whole /api/v2 ' +
        'path prefix to the public listener. The search endpoint went with it. No change record ' +
        'mentions it.',
      source: 'load balancer',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1100,
      surface: 'alert-queue',
      summary: 'Every option costs something and the vendor is waiting',
      detail:
        'Upstream scrubbing costs $18,000 to engage plus usage, takes 20 minutes to take effect, ' +
        'and filters on volume per source, which will not match a botnet-shaped pattern made of ' +
        'real customers. Blocking mobile carrier ranges blocks the customers the service exists ' +
        'for. An app hotfix needs 24 to 72 hours of store review. Rate limiting at the load ' +
        'balancer can be applied in four minutes and is reversible.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1260,
      surface: 'raw-log',
      summary: 'Monitoring counts requests and bytes, and nothing else',
      detail:
        'Alerting on this service covers request rate, bandwidth and error rate. Nothing measures ' +
        'cost per request, database connection time, or requests weighted by the work they cause. ' +
        'The six addresses never approached any volumetric threshold and would not have done at ten ' +
        'times their rate. No alert exists for a path prefix becoming publicly reachable.',
      source: 'detection coverage',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.10',
      atSeconds: 1420,
      surface: 'alert-queue',
      summary: 'A high-volume client is flagged during the review',
      detail:
        'The review flags 198.51.100.30, sending 90 requests a second to the tracking lookup path ' +
        'with a declared user agent naming a logistics aggregator. The aggregator holds a data ' +
        'sharing agreement dated 2024, is allowlisted in the load balancer configuration, has sent ' +
        'between 80 and 100 requests a second every weekday for eighteen months, and uses the ' +
        'indexed lookup path exclusively.',
      source: '198.51.100.30',
      claimedSeverity: 'medium',
    },
  ],
};

export const OUR_OWN_CUSTOMERS_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'In January an unauthenticated search endpoint was added for the internal customer service console, safely, because it was reachable only from the office range. In June a load balancer change published the whole /api/v2 prefix to serve a new status page, and the search endpoint went public with it. No change record mentions it.',
    'From 05:54 today, six addresses sent a sustained 400 requests a second to that endpoint with wildcard references across a four year range. Each of those searches costs 2.1 seconds of database time and holds one of forty connections.',
    'At 06:02 the connection pool exhausted and the database failed over, returning errors for 90 seconds.',
    'Version 4.7.0 of the Ardal tracking app, released on Tuesday, replaced a failed lookup with an immediate retry and removed the exponential backoff, with no retry ceiling.',
    'Every 4.7.0 client that received one of those errors began retrying without pause, and the load from those retries has been enough to keep the service failing ever since.',
    'The result is 903,000 sources at 41 times baseline, 91 per cent on mobile and residential ranges, distributed like the customer base within four per cent by state, sending 6 to 40 requests an hour each, with no spoofing, no reflection and no protocol abuse.',
    'The flood is real customers. The six addresses are 0.3 per cent of the traffic and are the only part anybody sent deliberately.',
    'Rate limiting the search endpoint at the load balancer takes four minutes and is reversible. Scrubbing costs $18,000, takes twenty minutes, and filters on a pattern this traffic does not have.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.declare', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['network-analyst', 'ir-lead'],
      why:
        'An hour of outage, forty-one times baseline, and a vendor on the phone waiting for a ' +
        'decision, which is the pressure this row exists to create. Raise it and refuse to name it ' +
        'yet. The one fact on the board that argues against an attack is in the shape rather than ' +
        'the size: the rate has been climbing steadily rather than arriving in bursts, and a ' +
        'volumetric attack starts when somebody starts it. Something that ramps looks more like a ' +
        'system feeding itself. That is not enough to conclude anything and it is enough to spend ' +
        'ten minutes before spending eighteen thousand dollars. The wrong move here is not the ' +
        'scrubbing, it is declaring an attack out loud, because once that word is in the incident ' +
        'channel every subsequent option gets judged against it.',
      standIn:
        'Tracking has been down an hour at forty-one times baseline and the scrubbing vendor is ' +
        'holding. Raising it, not naming it. One thing bothers me: it climbed steadily rather than ' +
        'arriving in bursts, and an attack starts when somebody starts it. Something that ramps ' +
        'looks like a system feeding itself. Not conclusive, but worth ten minutes before we spend ' +
        'eighteen thousand dollars, and I do not want the word attack in the channel yet.',
      commandOptions: [
        { command: "awk '{print substr($1,1,16)}' /var/log/track02/access.log | uniq -c | tail -30", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$9!=200 {print $9}' /var/log/track02/access.log | sort | uniq -c", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status track-svc', ...STATUS_CHECK },
        { command: 'cat /var/log/track02/access.log', ...DUMP_ALL },
        { command: 'grep -c . /var/log/track02/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Plot the request rate minute by minute and see whether it jumped or climbed.',
      guidance:
        'Before you call it an attack, ask what shape the traffic arrived in.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.isolate', 'act.contact-attacker', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['log-analyst', 'ir-lead'],
      why:
        'Nine hundred thousand sources is the number that sells a botnet, and every property ' +
        'underneath it says otherwise. Ninety-one per cent on mobile carrier and residential ' +
        'ranges is what a consumer botnet looks like and also what consumers look like, so that ' +
        'one is genuinely ambiguous. The rest are not. Geographic distribution matching the ' +
        'consignment recipient base within four per cent by state is extremely hard to fake and ' +
        'pointless to try. Six to forty requests an hour per source is a normal person checking a ' +
        'parcel, where a botnet node sends as much as it can because that is the entire value of ' +
        'having it. And there is no spoofing, no reflection and no protocol abuse: these are ' +
        'complete, well-formed sessions, which costs an attacker resources and buys them nothing. ' +
        'Put it plainly before anybody blocks a range: the aggregate is enormous and every ' +
        'individual client is behaving like a customer, because it is one.',
      standIn:
        'Nine hundred thousand sources, and everything underneath it says customers. Ninety-one per ' +
        'cent mobile and residential is genuinely ambiguous, that is what a consumer botnet looks ' +
        'like too. The rest is not. Geography matches our recipient base within four per cent by ' +
        'state, which is hard to fake and pointless to try. Six to forty requests an hour each is a ' +
        'person checking a parcel; a bot sends everything it can, that is the whole value of it. No ' +
        'spoofing, no reflection, no protocol abuse, complete well-formed sessions, which costs an ' +
        'attacker money and buys nothing. The aggregate is huge and every single client looks like ' +
        'a customer.',
      commandOptions: [
        { command: "awk '{print $3}' /var/log/track02/access.log | sort | uniq -c | awk '{print $1}' | sort -n | uniq -c | tail", correct: true, teaches: CORRECT_STEP },
        { command: "awk '{print $12}' /var/log/track02/access.log | sort | uniq -c | sort -rn | head", correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 203.0.113.66', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/track02/access.log', ...DUMP_ALL },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
      ],
      commandNudge:
        'Work out how many requests each individual source is sending, not how many sources there ' +
        'are.',
      guidance:
        'Nine hundred thousand sources is the total. Ask what one of them is doing.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.attribute-named', 'act.dismiss', 'act.tune'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'One field settles it. Ninety-four per cent of requests carry the Ardal tracking app, ' +
        'version 4.7.0, released on Tuesday, and before 06:02 that same version was 38 per cent of ' +
        'traffic at an ordinary rate. So the population did not change and the behaviour did, which ' +
        'is the opposite of what an attack looks like. Worth noticing why nobody checked this ' +
        'sooner: user agent is trivially forged and analysts learn early to distrust it, which is ' +
        'correct when you are asking whether a client is lying and useless as a reason not to look. ' +
        'Here it is not being used as proof of identity, it is being used as a population split, ' +
        'and no attacker has any reason to impersonate one specific version of a parcel tracking ' +
        'app on ninety-four per cent of their traffic. Hand this straight to whoever owns the ' +
        'mobile release, because from this row the question stops being a security question.',
      standIn:
        'One field settles it. Ninety-four per cent of requests are our own tracking app, version ' +
        '4.7.0, released Tuesday, and before 06:02 that version was 38 per cent of traffic at a ' +
        'normal rate. The population did not change, the behaviour did, which is backwards from an ' +
        'attack. I know user agent is forgeable and I am not using it as proof of identity, I am ' +
        'using it as a population split, and nobody impersonates one version of a parcel app on ' +
        'ninety-four per cent of their traffic. Somebody get whoever owns that release.',
      commandOptions: [
        { command: "awk '{print $12}' /var/log/track02/access.log | sort | uniq -c | sort -rn | head -5", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$1<\"06:02\" {print $12}' /var/log/track02/access-yesterday.log | sort | uniq -c | sort -rn | head -5", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status track-svc', ...STATUS_CHECK },
        { command: 'cat /var/log/track02/access.log', ...DUMP_ALL },
        { command: 'grep -c 4.7.0 /var/log/track02/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Break the traffic down by client version, and compare against the same time yesterday.',
      guidance:
        'Ask what the clients say they are, and whether that mix changed.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'log-analyst',
      alsoAppropriate: ['cloud-security', 'mitigation-specialist', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.timeline'],
      outOfLaneActions: ['act.isolate', 'act.attribute-named', 'act.declare', 'act.dismiss'],
      escalateTo: ['mitigation-specialist', 'ir-lead'],
      why:
        'The mechanism, and it is a release note. Version 4.7.0 improved the reliability of tracking ' +
        'lookups by retrying immediately on failure and removing the exponential backoff, with no ' +
        'ceiling. A database failover returned errors for ninety seconds, every 4.7.0 client that ' +
        'saw one started retrying without pause, and the retries produce enough load to keep ' +
        'generating the errors that cause them. That is a loop that sustains itself with no ' +
        'attacker in it and no way out through blocking, because there is nobody to block. The ' +
        'part worth carrying beyond today is that the change was made to improve reliability and ' +
        'was reviewed and shipped by people doing their jobs, and retry logic is one of the small ' +
        'number of client-side decisions that can take down the server it is being polite to. ' +
        'State clearly that the outage is self-inflicted, and state just as clearly that the ' +
        'ninety-second failover which started it has not been explained yet.',
      standIn:
        'It is in the release note. 4.7.0 improved reliability by retrying immediately on failure ' +
        'and dropping the backoff, no ceiling. A database failover threw errors for ninety seconds, ' +
        'every 4.7.0 client that saw one started retrying without pause, and those retries generate ' +
        'enough load to keep causing the errors. It sustains itself and there is nobody to block. ' +
        'That change was made to improve reliability and shipped by people doing their jobs. The ' +
        'outage is ours. And nobody has explained the ninety-second failover that started it.',
      commandOptions: [
        { command: 'grep -iE "retry|backoff" /evidence/mobile/4.7.0-release-notes.md', correct: true, teaches: CORRECT_STEP },
        { command: "awk '$1 ~ /06:0[0-4]/ {print $1, $9}' /var/log/track02/access.log | uniq -c | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status track-svc', ...STATUS_CHECK },
        { command: 'cat /evidence/mobile/4.7.0-release-notes.md', ...DUMP_ALL },
        { command: 'iptables -A INPUT -m string --string "4.7.0" -j DROP', ...MUTATE },
      ],
      commandNudge:
        'Find out what changed in that app version and what it does when a request fails.',
      guidance:
        'The load is our own app. Ask what the new version does differently.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'discovery',
      critical: true,
      techniques: ['T1499.003'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.dismiss', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Nought point three per cent of the traffic, and the only part anybody sent on purpose. Six ' +
        'addresses in one small block, sustained 400 requests a second since 05:54, which is eight ' +
        'minutes before the failover rather than after it, and that ordering is the finding: they ' +
        'were there first. They do not use the tracking path at all. Every request is a wildcard ' +
        'search across four years with no user agent. Nothing about this is volumetric and it was ' +
        'never going to be caught by anything watching gigabits, which is what the entire floor has ' +
        'been watching for an hour. It is also the row a floor is most likely to skip, because ' +
        'after establishing that the flood is customers there is a strong pull to close the ' +
        'incident and go and talk to the mobile team. Two conclusions and both matter: something ' +
        'deliberate happened here, and it happened before the thing everybody has been looking at.',
      standIn:
        'Nought point three per cent of the traffic and the only part anybody sent deliberately. Six ' +
        'addresses in one /28, four hundred requests a second, sustained since 05:54, which is ' +
        'eight minutes before the failover, not after. They never touch the tracking path. Wildcard ' +
        'searches across four years, no user agent. Nothing volumetric about it and nothing ' +
        'watching bandwidth was ever going to see it, which is what we have all been watching for ' +
        'an hour. They were here first.',
      commandOptions: [
        { command: "awk '$7 ~ /api\\/v2\\/search/ {print $3}' /var/log/track02/access.log | sort | uniq -c | sort -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$1<\"06:02\" && $7 ~ /search/ {print $1, $3}' /var/log/track02/access.log | head", correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 203.0.113.66', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/track02/access.log', ...DUMP_ALL },
        { command: 'grep -c search /var/log/track02/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Take the app traffic out and look at what paths are left.',
      guidance:
        'You have explained ninety-four per cent of it. Ask what the rest is doing.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      techniques: ['T1499.003'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Two numbers explain the whole morning. An indexed lookup costs 9 milliseconds and a ' +
        'wildcard search across four years costs 2.1 seconds and holds a connection for the ' +
        'duration, so one search is worth roughly two hundred and thirty lookups. The pool holds ' +
        'forty connections. At four hundred searches a second, six addresses demand more connection ' +
        'time than the database can supply, and the failover at 06:02 is the pool exhausting rather ' +
        'than an unrelated fault. So the causal chain runs the other way from how it looked: the ' +
        'small deliberate thing caused the failover, the failover triggered the retry bug, and the ' +
        'retry bug produced the outage everybody has been staring at. This is the assessment worth ' +
        'writing carefully, because the floor is about to close a self-inflicted incident, and the ' +
        'sentence that has to survive is that six addresses using nought point three per cent of ' +
        'the bandwidth took the service down and nine hundred thousand customers kept it down.',
      standIn:
        'Two numbers explain the morning. Indexed lookup, 9 milliseconds. Wildcard search across ' +
        'four years, 2.1 seconds, holding a connection the whole time, so one search is worth about ' +
        'two hundred and thirty lookups. Pool is forty connections. Four hundred searches a second ' +
        'from six addresses is more connection time than the database has, and the 06:02 failover ' +
        'is the pool exhausting, not a coincidence. So the chain runs the other way: the small ' +
        'deliberate thing caused the failover, the failover triggered the retry bug, the retry bug ' +
        'is the outage. Six addresses took it down. Nine hundred thousand customers kept it down.',
      commandNudge:
        'Compare what a search costs against what a lookup costs, then set that against the ' +
        'connection pool size.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'discovery',
      critical: true,
      techniques: ['T1190'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.scope-estate'],
      outOfLaneActions: ['act.revoke-key', 'act.attribute-named', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'The endpoint was safe when it was built and nobody made it unsafe on purpose. Added in ' +
        'January for the internal customer service console with no authentication, which was a ' +
        'reasonable decision at the time because it was reachable only from the office range. In ' +
        'June a load balancer change published a new status page by moving the whole /api/v2 prefix ' +
        'to the public listener, and the search endpoint went with it because it happened to live ' +
        'under that prefix. No change record mentions it, and nobody was careless: the person ' +
        'publishing a status page had no reason to enumerate everything else sharing its path. ' +
        'That is the finding with the longest life here, and it generalises past this endpoint. ' +
        'Anything that is safe because of where it sits rather than because of what it checks is ' +
        'one routing change away from being public, and the change that exposes it will be made by ' +
        'somebody doing something unrelated. Scope it before closing: find every other path under ' +
        'that prefix.',
      standIn:
        'It was safe when it was built and nobody made it unsafe deliberately. Added in January for ' +
        'the internal console, no authentication, fine at the time because it was office-range ' +
        'only. In June somebody published a status page by moving the whole /api/v2 prefix to the ' +
        'public listener, and search went with it because it lived under that prefix. No change ' +
        'record mentions it and nobody was careless. Anything that is safe because of where it sits ' +
        'rather than what it checks is one routing change from public, and the change will be made ' +
        'by somebody doing something else. I want every other path under that prefix before we ' +
        'close.',
      commandOptions: [
        { command: 'grep -nE "api/v2|listener" /evidence/lb/config-current.conf', correct: true, teaches: CORRECT_STEP },
        { command: 'diff /evidence/lb/config-may.conf /evidence/lb/config-june.conf', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status haproxy', ...STATUS_CHECK },
        { command: 'cat /evidence/lb/config-current.conf', ...DUMP_ALL },
        { command: 'curl -s http://203.0.113.66/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out when that endpoint became reachable from the internet, and what change did it.',
      guidance:
        'An internal endpoint is answering the public. Ask when that started.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'network-analyst'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.attribute-named', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'Three of the four options on the table are wrong and one of them costs eighteen thousand ' +
        'dollars to be wrong. Scrubbing filters on volume per source, and this traffic is nine ' +
        'hundred thousand sources sending six to forty requests an hour, so it matches nothing the ' +
        'vendor filters on and would take twenty minutes to not work. Blocking mobile carrier ' +
        'ranges blocks the customers the service exists for. An app hotfix is the real fix for the ' +
        'retry loop and is 24 to 72 hours away through store review, so it is not tonight\'s ' +
        'answer. What is available in four minutes and reverses in four is rate limiting at the ' +
        'load balancer, and it should be applied in the order the causal chain runs rather than the ' +
        'order the traffic is loud: cap /api/v2/search first, which stops the six addresses and ' +
        'takes the original cause away, then apply a per-source limit generous enough that a person ' +
        'checking a parcel is unaffected and a client retrying in a loop is throttled, which breaks ' +
        'the self-sustaining part without blocking anybody. The compensating control that matters ' +
        'more than either: put authentication back on the search endpoint today rather than after ' +
        'the app fix, because everything else here is a symptom and that is the exposure. Check the ' +
        'rollback on both limits before they go in. Deliberately left undone: the retry loop is ' +
        'still in every installed copy of 4.7.0 and will do this again on the next failover, so ' +
        'the store review clock starts now and does not wait for the incident to close.',
      standIn:
        'Three of the four options are wrong and one is wrong for eighteen thousand dollars. ' +
        'Scrubbing filters on volume per source and our traffic is nine hundred thousand sources ' +
        'doing six to forty an hour, so it matches nothing and takes twenty minutes to not work. ' +
        'Blocking carrier ranges blocks the customers. The app hotfix is the real fix and it is ' +
        'three days away. What works in four minutes and reverses in four is rate limiting at the ' +
        'load balancer, applied in causal order not volume order: cap search first, which stops the ' +
        'six and removes the original cause, then a per-source limit loose enough that a person ' +
        'checking a parcel never notices and a client retrying in a loop gets throttled. And put ' +
        'authentication back on that search endpoint today, because everything else is a symptom. ' +
        'Rollbacks written for both. Left undone: 4.7.0 is on every phone and will do this again on ' +
        'the next failover, so the store clock starts now.',
      commandNudge:
        'Work out what the scrubbing vendor actually filters on before you decide whether it helps.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'defense-evasion',
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Everything that watches this service counts requests, bytes and errors, and the attack ' +
        'that took it down used almost none of any of them. The six addresses never approached a ' +
        'volumetric threshold and would not have done at ten times their rate, which means the ' +
        'thresholds are not set too high, they are measuring the wrong quantity. What is missing is ' +
        'cost: database connection time held per source, or requests weighted by the work they ' +
        'cause, either of which would have alerted at 05:54 and given eight minutes before the ' +
        'failover. Propose that first because it is the one that would have prevented today, and ' +
        'propose the cheaper structural one alongside it, which is an alert when a path prefix ' +
        'becomes publicly reachable, since the June change is what made any of this possible and ' +
        'produced no signal at all. Backtest the cost metric against ninety days before promising a ' +
        'volume, because an aggregator sending ninety requests a second on the indexed path will ' +
        'sit near the top of any weighted list and must not be what the rule fires on.',
      standIn:
        'Everything watching this service counts requests, bytes and errors, and the thing that took ' +
        'it down used almost none of any of them. Those six never went near a volumetric threshold ' +
        'and would not have at ten times the rate, so the thresholds are not too high, they are ' +
        'measuring the wrong thing. What is missing is cost: connection time held per source, or ' +
        'requests weighted by the work they cause. Either would have fired at 05:54 and given us ' +
        'eight minutes. And an alert when a path prefix becomes publicly reachable, because the ' +
        'June change made all of this possible and produced no signal. I will backtest the cost one ' +
        'over ninety days, because our aggregator will sit near the top of any weighted list and ' +
        'must not be what it fires on.',
      commandOptions: [
        { command: "awk '$7 ~ /search/ {c[$3]+=2.1} $7 ~ /lookup/ {c[$3]+=0.009} END {for (i in c) print c[i], i}' /var/log/track02/access.log | sort -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -iE "threshold|metric" /evidence/monitoring/track02-alerts.yaml', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status monitoring', ...STATUS_CHECK },
        { command: 'cat /evidence/monitoring/track02-alerts.yaml', ...DUMP_ALL },
        { command: 'grep -c . /var/log/track02/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Rank the sources by how much database time they consumed rather than by request count.',
      guidance:
        'The thresholds never fired. Ask what they were measuring.',
    },
    {
      eventId: 'ev.10',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'detection-engineer'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.isolate', 'act.triage-high', 'act.attribute-named', 'act.declare'],
      escalateTo: [],
      why:
        'Ninety requests a second from one address, surfacing at the moment the floor has learned to ' +
        'distrust high-volume sources, and it is a contracted partner. Four checks close it and the ' +
        'last is the one that matters today: a data sharing agreement from 2024, an allowlist entry ' +
        'in the load balancer, eighteen months of sending between eighty and a hundred requests a ' +
        'second every weekday, and exclusive use of the indexed lookup path. That final property is ' +
        'the discriminator the whole morning has been about, because ninety requests a second on ' +
        'the indexed path costs less database time than four searches. Close it, and take the ' +
        'general point into the rate limiting discussion happening right now: this client is the ' +
        'single highest request rate on the board and would be the first casualty of a per-source ' +
        'limit set by volume, which is exactly the wrong outcome given it is also one of the ' +
        'cheapest sources on the service.',
      standIn:
        'Ninety a second from one address and it is a contracted partner. Data sharing agreement ' +
        'from 2024, allowlisted in the load balancer, eighteen months of eighty to a hundred a ' +
        'second every weekday, and it only uses the indexed lookup path. That last one is the whole ' +
        'point of this morning: ninety a second on the indexed path costs less database time than ' +
        'four searches. Closing it. And whoever is setting that per-source rate limit needs to know ' +
        'this client is the highest request rate on the board and one of the cheapest sources we ' +
        'have.',
      commandOptions: [
        { command: "awk '$3==\"198.51.100.30\" {print $7}' /var/log/track02/access.log | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "198.51.100.30" /evidence/lb/allowlist.conf /evidence/contracts/partners.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status haproxy', ...STATUS_CHECK },
        { command: 'cat /var/log/track02/access.log', ...DUMP_ALL },
        { command: 'iptables -A INPUT -s 198.51.100.30 -j DROP', ...MUTATE },
      ],
      commandNudge:
        'Check which path that client uses and whether it is in the allowlist.',
      guidance:
        'It is the highest rate on the board. Ask what it costs the database.',
    },
  ],
};
