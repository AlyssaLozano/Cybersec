/**
 * Scenario 83: Somebody Else's Domain.
 *
 * A domain Ardal stopped paying for in July belongs to somebody else now, and
 * forty systems are still talking to it.
 *
 * WHAT THIS TEACHES
 *
 * That the finding is never that a domain expired. It is what still points at
 * it, and that list is knowable in twenty minutes and was knowable before the
 * renewal was cancelled.
 *
 * Nobody attacked anything here. Marketing stopped paying for a campaign
 * domain that had not been used for advertising since 2021, which is a
 * reasonable decision made by people with no reason to think it was a security
 * one. The domain lapsed, sat in a redemption period, and was registered in
 * August by somebody who now receives everything Ardal still sends to it.
 *
 * MOST OF WHAT STILL POINTS AT IT DOES NOT MATTER
 *
 * Nine hundred requests a day sounds alarming and is almost entirely a
 * defunct analytics beacon carrying nothing. The whole exercise is separating
 * that from the two references that do matter, and one of them is not traffic
 * at all: an entry in an authorisation server's redirect allowlist, which sends
 * nothing until somebody uses it and then sends everything.
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

const ID = 'somebody-elses-domain';

export const SOMEBODY_ELSES_DOMAIN: Scenario = {
  id: ID,
  title: "Somebody Else's Domain",
  difficulty: 'beginner',
  durationMinutes: 45,
  situation:
    'It is 10:20 at Ardal Freight. Systems inside the estate are sending requests to a domain that ' +
    'used to be ours and now resolves to an address nobody recognises.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
    'threat-intel',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Internal systems are calling a domain that changed hands',
      detail:
        'The proxy recorded 900 requests yesterday from inside the estate to ' +
        'ardalfreight-tracking.example. Until July that name resolved to Ardal infrastructure. ' +
        'Since 14 August it resolves to 203.0.113.190, which belongs to a hosting provider with no ' +
        'relationship to Ardal. Rule history: the rule that fired watches for requests to newly ' +
        'registered domains and fires around 30 times a month, mostly on marketing suppliers.',
      source: 'web proxy',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 150,
      surface: 'raw-log',
      summary: 'Ardal owned it and stopped paying for it',
      detail:
        'Registration records show ardalfreight-tracking.example registered to Ardal Freight from ' +
        '2019, with the renewal cancelled on 2 July. It expired on 30 July, sat in a redemption ' +
        'period through August, and was registered by a new owner on 14 August. The marketing team ' +
        'confirms they cancelled it in a cost review because no campaign has used it since 2021.',
      source: 'registrar records',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'network-flow',
      summary: 'Most of the traffic carries nothing at all',
      detail:
        'Of 900 daily requests, 880 come from 38 hosts loading a one-pixel analytics beacon embedded ' +
        'in a page template retired in 2021 and still present in a shared header file. Each request ' +
        'is a GET for the same image path with no parameters, no cookie and no body. The responses ' +
        'are 404. Twenty requests a day come from two hosts and look different.',
      source: 'web proxy',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.4',
      atSeconds: 490,
      surface: 'host-artefact',
      summary: 'Twenty of them carry a signed callback with a token in it',
      detail:
        'ADF-INT-02 posts a consignment status callback to a URL on that domain twenty times a day, ' +
        'carrying a consignment reference, a customer name and a bearer token used to authenticate ' +
        'back to the Ardal partner API. The integration was built in 2020 when the domain was ' +
        'Ardal infrastructure and the URL is hardcoded in its configuration file. The token is ' +
        'valid, does not expire, and grants read access to consignment records.',
      source: 'ADF-INT-02',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 660,
      surface: 'cloud-audit',
      summary: 'The authorisation server still trusts a redirect on that domain',
      detail:
        'The Ardal customer identity platform holds a redirect URI allowlist for the customer portal ' +
        'application. One of the six entries is https://ardalfreight-tracking.example/oauth/return, ' +
        'added in 2020 for a campaign landing page. It has never been removed. No authorisation ' +
        'request has used it in twelve months, so it appears in no traffic log and generates no ' +
        'requests at all.',
      source: 'identity platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 830,
      surface: 'alert-queue',
      summary: 'Nobody owns the list of domains',
      detail:
        'Domain registrations are held on a marketing corporate card and renewed by whoever notices ' +
        'the email. There is no inventory of domains, no record of what each one is used for, and ' +
        'no step in the cost review process that asks whether anything technical depends on a name ' +
        'before it is cancelled. Ardal holds 31 registered domains. Four more renewals are due in ' +
        'the next ninety days.',
      source: 'marketing',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 1000,
      surface: 'alert-queue',
      summary: 'What can and cannot be undone',
      detail:
        'The domain belongs to somebody else and cannot be reclaimed by Ardal. Approaching the new ' +
        'owner to buy it is possible and signals that it is valuable. The integration on ADF-INT-02 ' +
        'serves a live partner and stopping it interrupts consignment status updates. Removing the ' +
        'redirect entry from the allowlist takes minutes and affects nothing, because nothing has ' +
        'used it in a year.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1170,
      surface: 'raw-log',
      summary: 'A second Ardal domain also resolves somewhere unfamiliar',
      detail:
        'ardal-freight.example resolves to 198.51.100.7, which is not Ardal infrastructure. The ' +
        'registrar record shows it registered to Ardal Freight with renewal paid until 2029, and ' +
        'the address belongs to a brand protection service Ardal pays for, which parks lookalike ' +
        'and defensive registrations and serves a holding page. It is listed in the brand ' +
        'protection contract as one of fourteen names.',
      source: 'registrar records',
      claimedSeverity: 'medium',
    },
  ],
};

export const SOMEBODY_ELSES_DOMAIN_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Ardal registered ardalfreight-tracking.example in 2019 for a marketing campaign. No campaign has used it since 2021, and marketing cancelled the renewal in a cost review on 2 July, which was a reasonable decision made by people with no reason to think it was a security one.',
    'It expired on 30 July, sat in a redemption period through August, and was registered by a new owner on 14 August. Since then it has resolved to a hosting address with no relationship to Ardal.',
    'Nine hundred requests a day still go to it from inside the estate. Eight hundred and eighty are a one-pixel analytics beacon in a page template retired in 2021 and still present in a shared header file, sending no parameters, no cookie and no body, and receiving 404s. Those carry nothing.',
    'Twenty a day come from ADF-INT-02, which posts a consignment status callback carrying a consignment reference, a customer name and a bearer token that is valid, does not expire, and grants read access to consignment records. The URL was hardcoded in 2020 when the domain was Ardal infrastructure.',
    'So since 14 August, whoever owns that domain has received twenty consignment records a day and a working credential for the Ardal partner API.',
    'The Ardal customer identity platform still lists https://ardalfreight-tracking.example/oauth/return in the redirect allowlist for the customer portal, added in 2020 for a campaign landing page. Nothing has used it in twelve months, so it appears in no traffic log and generates no requests, and it will send an authorisation code to that domain the first time anybody constructs a request that uses it.',
    'Domain registrations sit on a marketing corporate card, renewed by whoever notices the email. There is no domain inventory and no step in the cost review that asks whether anything technical depends on a name.',
    'Ardal holds 31 domains and four more renewals fall due in the next ninety days.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1584.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.contact-attacker', 'act.attribute-named'],
      escalateTo: ['network-analyst', 'log-analyst'],
      why:
        'Nine hundred requests a day to a name that used to be ours and now points somewhere else. ' +
        'The rule fires thirty times a month and is usually a marketing supplier, so the base rate ' +
        'says close it, and one field on the row says otherwise: the domain used to resolve to ' +
        'Ardal infrastructure. A newly registered domain nobody has heard of is background noise. A ' +
        'newly registered domain that used to be yours is a different object, because everything ' +
        'that was built to trust it still does. Raise it and hold it, and note the shape of the ' +
        'question that follows, because it is not who owns it now: it is what inside this estate is ' +
        'still sending things to it.',
      standIn:
        'Nine hundred requests a day to ardalfreight-tracking.example. That rule is usually a ' +
        'marketing supplier and I would normally close it, except this name used to resolve to our ' +
        'own infrastructure. A new domain nobody has heard of is noise. A new domain that used to ' +
        'be ours is different, because everything built to trust it still does. Raising it, and the ' +
        'question is not who owns it now, it is what of ours is still calling it.',
      commandOptions: [
        { command: "awk -F, '$4 ~ /ardalfreight-tracking/ {print $3}' /var/log/proxy/access.csv | sort | uniq -c | sort -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: 'dig +short ardalfreight-tracking.example', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status squid', ...STATUS_CHECK },
        { command: 'cat /var/log/proxy/access.csv', ...DUMP_ALL },
        { command: 'curl -s http://ardalfreight-tracking.example/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out which internal hosts are making those requests before looking at the destination.',
      guidance:
        'A domain changed hands. Ask what of yours still points at it.',
    },
    {
      eventId: 'ev.2',
      verdict: 'benign-true-positive',
      firstResponder: 'log-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.contact-attacker', 'act.tune'],
      escalateTo: ['ir-lead'],
      why:
        'Nobody was attacked and nobody did anything wrong. Marketing cancelled a renewal in a cost ' +
        'review for a domain no campaign had used since 2021, which is exactly the decision a cost ' +
        'review is for. It expired, sat in redemption through August, and somebody registered it on ' +
        '14 August. Say the sequence plainly, because the room will otherwise start looking for the ' +
        'person who let this happen and there is not one. What the timeline does establish is a ' +
        'date to measure from: since 14 August, everything Ardal still sends to that name has gone ' +
        'to somebody else, and that is a bounded window rather than an open question. Whether the ' +
        'new owner registered it deliberately because it was ours or picked up an expiring domain ' +
        'at random is not established and does not change what has to be done.',
      standIn:
        'Nobody was attacked and nobody did anything wrong. Marketing cancelled the renewal in a ' +
        'cost review because no campaign had used it since 2021, which is what a cost review is ' +
        'for. Expired on 30 July, redemption through August, registered by somebody else on the ' +
        'fourteenth. What that gives us is a date: everything we have sent to that name since 14 ' +
        'August has gone to them. Whether they picked it because it was ours or grabbed an expiring ' +
        'domain at random does not change what we do.',
      commandOptions: [
        { command: 'grep -iE "created|expiry|updated|registrant" /evidence/registrar/tracking-domain.txt', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "ardalfreight-tracking" /evidence/marketing/cost-review-july.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status named', ...STATUS_CHECK },
        { command: 'cat /evidence/registrar/tracking-domain.txt', ...DUMP_ALL },
        { command: 'whois ardalfreight-tracking.example', ...WRONG_TARGET },
      ],
      commandNudge:
        'Find out who registered that domain before, and when it changed hands.',
      guidance:
        'It used to be yours. Ask what happened to it.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      firstResponder: 'network-analyst',
      alsoAppropriate: ['log-analyst', 'soc-operator'],
      correctActions: ['act.flow-map', 'act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.contact-attacker', 'act.attribute-named'],
      escalateTo: ['log-analyst'],
      why:
        'Eight hundred and eighty of the 900 requests carry nothing. They are a one-pixel analytics ' +
        'beacon from a page template retired in 2021 that is still sitting in a shared header file, ' +
        'and each one is a GET for the same image path with no parameters, no cookie and no body, ' +
        'answered with a 404. The new owner learns that 38 Ardal hosts exist and request an image, ' +
        'which is close to nothing. Reporting 900 as the exposure would be true and useless, and ' +
        'this row is where the count gets separated from the finding. Close these and keep the ' +
        'twenty: two hosts are doing something different, and on a board where 98 per cent of the ' +
        'volume is noise the whole exercise is noticing that the remaining two per cent has a ' +
        'different shape.',
      standIn:
        'Eight hundred and eighty of the 900 carry nothing. It is a one-pixel beacon from a template ' +
        'we retired in 2021 that is still in a shared header file. Same image path every time, no ' +
        'parameters, no cookie, no body, and they get a 404. The new owner learns that 38 of our ' +
        'hosts request an image. Reporting 900 as the exposure would be true and useless. It is the ' +
        'twenty from two hosts I care about, because they are a different shape.',
      commandOptions: [
        { command: "awk -F, '$4 ~ /ardalfreight-tracking/ {print $5, $6}' /var/log/proxy/access.csv | sort | uniq -c | sort -rn", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$4 ~ /ardalfreight-tracking/ && $7==\"POST\" {print $3}' /var/log/proxy/access.csv | sort -u", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status squid', ...STATUS_CHECK },
        { command: 'cat /var/log/proxy/access.csv', ...DUMP_ALL },
        { command: 'grep -c ardalfreight-tracking /var/log/proxy/access.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Break the 900 requests down by path and method and see whether they are all the same.',
      guidance:
        'Nine hundred requests. Ask whether they are all the same request.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1584.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.contact-attacker', 'act.dismiss', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Twenty requests a day, and each one carries a consignment reference, a customer name and a ' +
        'bearer token. The token is the finding rather than the customer data: it is valid, it does ' +
        'not expire, and it grants read access to consignment records, so whoever owns that domain ' +
        'has not merely been receiving twenty records a day since 14 August, they have held a ' +
        'working credential for the Ardal partner API for six weeks. Nothing about the integration ' +
        'is faulty. It was built in 2020 to post to a URL on Ardal infrastructure and it is still ' +
        'doing exactly that; the infrastructure moved out from underneath it. Say both halves ' +
        'clearly because they have different remedies: the records that have gone are gone, and the ' +
        'token is still live and can be revoked in minutes.',
      standIn:
        'Twenty a day, and each one has a consignment reference, a customer name and a bearer token. ' +
        'The token is the finding, not the customer data: valid, no expiry, read access to ' +
        'consignment records. So they have not just been getting twenty records a day since the ' +
        'fourteenth, they have held a working credential for our partner API for six weeks. And the ' +
        'integration is not broken. It posts to a URL on Ardal infrastructure exactly as built in ' +
        '2020, and the infrastructure moved out from under it. The records are gone. The token can ' +
        'be revoked in minutes.',
      commandOptions: [
        { command: "grep -A4 'ardalfreight-tracking' /evidence/int02/integration.conf", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$3==\"ADF-INT-02\" {print $7}' /var/log/proxy/access.csv | sort | uniq -c", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status partner-integration', ...STATUS_CHECK },
        { command: 'cat /evidence/int02/integration.conf', ...DUMP_ALL },
        { command: 'curl -s https://ardalfreight-tracking.example/callback', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Look at what those twenty requests actually contain, field by field.',
      guidance:
        'Twenty requests look different. Ask what is in them.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1584.001'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'threat-intel'],
      correctActions: ['act.iam-audit', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.contact-attacker', 'act.attribute-named', 'act.revoke-key'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'The worst thing on this board generates no traffic at all, which is why nothing found it ' +
        'and why looking only at the proxy would have closed this incident with the real problem ' +
        'untouched. The customer identity platform still allowlists a redirect URI on that domain, ' +
        'added in 2020 for a campaign landing page and never removed. It has not been used in ' +
        'twelve months, so it appears in no log, has no volume, and would not show up in any ' +
        'search for activity. What it means is that the authorisation server will send an ' +
        'authorisation code to a domain somebody else controls the first time anybody constructs a ' +
        'request pointing at it, and constructing that request needs nothing but a link. The ' +
        'general habit is the one to carry: an allowlist is a list of things you trust, it is not ' +
        'traffic, and it has to be read rather than searched for.',
      standIn:
        'The worst thing here makes no traffic at all, which is why nothing found it and why closing ' +
        'this on the proxy alone would have left the real problem in place. Our customer identity ' +
        'platform still allowlists a redirect URI on that domain, added in 2020 for a campaign page ' +
        'and never removed. Not used in twelve months, so it is in no log and has no volume. It ' +
        'means our authorisation server will hand an authorisation code to a domain somebody else ' +
        'owns the first time anybody builds a request pointing at it, and that takes a link. An ' +
        'allowlist is a list of things we trust. You read it, you do not search for it.',
      commandOptions: [
        { command: "grep -iA6 'redirect_uris' /evidence/identity/portal-app.json", correct: true, teaches: CORRECT_STEP },
        { command: "grep -rl 'ardalfreight-tracking' /evidence/identity/ /evidence/int02/", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status identity', ...STATUS_CHECK },
        { command: 'cat /evidence/identity/portal-app.json', ...DUMP_ALL },
        { command: 'idp-cli app update --remove-redirect-all', ...MUTATE },
      ],
      commandNudge:
        'Search configuration for that domain, not just traffic. Start with the redirect allowlists.',
      guidance:
        'You have found what sends traffic there. Ask what trusts it without sending anything.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'threat-intel',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.scope-estate', 'act.predict'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.contact-attacker', 'act.isolate'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Thirty-one domains on a marketing corporate card, renewed by whoever notices the email, ' +
        'with no inventory and no record of what any of them is for. That is the finding that ' +
        'outlives this incident, and the specific gap is in the cost review rather than in ' +
        'anybody\'s judgement: there is no step that asks whether anything technical depends on a ' +
        'name before the renewal is cancelled. Nobody in marketing could have known that an ' +
        'integration and an allowlist entry pointed at that name, because there is no document ' +
        'anywhere that would have told them. The prediction is the useful output and it has a date ' +
        'on it: four renewals fall due in the next ninety days, nobody currently knows what depends ' +
        'on those four names, and the same query that untangled today would answer it in an ' +
        'afternoon. That is worth putting in front of somebody now rather than after the second ' +
        'one lapses.',
      standIn:
        'Thirty-one domains on a marketing corporate card, renewed by whoever notices the email, no ' +
        'inventory, no record of what any of them do. The gap is in the cost review: nothing asks ' +
        'whether anything technical depends on a name before the renewal is cancelled. Nobody in ' +
        'marketing could have known an integration and an allowlist pointed at this one, because no ' +
        'document says so. And four more renewals are due in the next ninety days and nobody knows ' +
        'what depends on those either. Same query we ran today, one afternoon. I would rather do ' +
        'that now than after the second one goes.',
      commandOptions: [
        { command: "awk -F, '{print $1, $4}' /evidence/registrar/ardal-domains.csv | sort -k2", correct: true, teaches: CORRECT_STEP },
        { command: "grep -rlo -f /evidence/registrar/domain-names.txt /evidence/configs/ 2>/dev/null | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status named', ...STATUS_CHECK },
        { command: 'cat /evidence/registrar/ardal-domains.csv', ...DUMP_ALL },
        { command: 'grep -c . /evidence/registrar/ardal-domains.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find how many domains the company holds and when the next renewals fall due.',
      guidance:
        'One domain lapsed. Ask how many others there are and who watches them.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.contact-attacker', 'act.isolate', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The domain is not coming back and every useful action is on the Ardal side of the problem. ' +
        'Buying it from the new owner is possible and tells somebody who may not know what they ' +
        'have that it is worth something, which is a commercial decision for somebody else and not ' +
        'a containment. Order the rest by cost and effect, and the ordering is unusual because the ' +
        'cheapest action is also the most urgent: remove the redirect entry from the allowlist, ' +
        'which takes minutes, affects nothing because nothing has used it in a year, and closes the ' +
        'only route on this board that has not been exploited yet. Then revoke the bearer token, ' +
        'which stops six weeks of standing access to the partner API. Only then the integration ' +
        'itself, which serves a live partner and needs its URL changed rather than switching off, ' +
        'so it wants a change window rather than a decision at half past ten. Removing the beacon ' +
        'from the header file is real tidying and is not urgent, and saying so keeps it from ' +
        'consuming the afternoon. Deliberately left undone: twenty consignment records a day for ' +
        'six weeks have gone to somebody else and nothing recovers them, and until the four ' +
        'upcoming renewals are checked this can happen again in ninety days.',
      standIn:
        'The domain is gone and everything useful is on our side. Buying it back tells somebody who ' +
        'may not know what they have that it is worth money, and that is a commercial call, not ' +
        'containment. Order is unusual here because the cheapest thing is the most urgent: remove ' +
        'that redirect entry from the allowlist. Minutes, affects nothing, and it is the one route ' +
        'nobody has used yet. Then revoke the bearer token, which ends six weeks of standing access ' +
        'to the partner API. Then the integration, which serves a live partner and needs its URL ' +
        'changed rather than stopping, so that is a change window and not a decision at half ten. ' +
        'The beacon is tidying and can wait. Left undone: six weeks of consignment records are ' +
        'gone, and four renewals fall due in ninety days.',
      commandNudge:
        'Rank the three references by how long each takes to remove and what breaks if you do.',
    },
    {
      eventId: 'ev.8',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['threat-intel', 'network-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.contact-attacker', 'act.declare', 'act.attribute-named'],
      escalateTo: [],
      why:
        'A second Ardal domain resolving to an address that is not Ardal infrastructure, arriving ' +
        'while the floor has learned that exactly that is the incident, and it is the brand ' +
        'protection service Ardal pays for. Three checks close it: the registrar record shows it ' +
        'registered to Ardal with renewal paid until 2029, the address belongs to the brand ' +
        'protection provider, and the name is one of fourteen listed in that contract. The ' +
        'discriminator is the one that mattered all morning, run in the opposite direction: the ' +
        'question was never where a domain resolves, it was who holds the registration, and here ' +
        'Ardal does and has paid for six more years. Close it. The row exists because the sweep of ' +
        'all 31 domains is about to happen and should, and fourteen of the 31 will look exactly ' +
        'like this: defensive registrations pointing at somebody else on purpose.',
      standIn:
        'Second domain resolving somewhere that is not us, and it is the brand protection service we ' +
        'pay for. Registrar shows it registered to Ardal with renewal paid to 2029, the address ' +
        'belongs to the provider, and the name is one of fourteen in that contract. Same check as ' +
        'all morning, opposite answer: the question was never where it resolves, it was who holds ' +
        'the registration. Closing it. And whoever sweeps all 31 needs to know that fourteen of ' +
        'them will look exactly like this on purpose.',
      commandOptions: [
        { command: 'grep -iE "registrant|expiry" /evidence/registrar/ardal-freight-domain.txt', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "ardal-freight.example" /evidence/contracts/brand-protection.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status named', ...STATUS_CHECK },
        { command: 'cat /evidence/registrar/ardal-freight-domain.txt', ...DUMP_ALL },
        { command: 'curl -s http://198.51.100.7/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Check who holds the registration, not where the name points.',
      guidance:
        'It resolves somewhere unfamiliar. Ask who owns it.',
    },
  ],
};
