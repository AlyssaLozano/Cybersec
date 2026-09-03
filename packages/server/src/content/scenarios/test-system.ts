/**
 * Scenario 79: Only A Test System.
 *
 * Somebody got into the user acceptance testing environment, which nobody
 * worries about, and which holds a complete copy of the customer database.
 *
 * WHAT THIS TEACHES
 *
 * That data does not stop being real because the system it sits in is called
 * test, and that the word in the hostname is doing more work in everybody's
 * head than any control is doing on the machine.
 *
 * Every reaction to this alert for the first ten minutes will be some version
 * of "it is only UAT". That belief is why the system is outside the patching
 * schedule, outside the monitoring baseline, and outside the account standards,
 * and each of those exclusions was signed off by somebody sensible on the basis
 * that a test system holds test data. It does not. It holds a production
 * refresh taken six weeks ago, because testing against realistic data is how
 * you find real bugs, and the masking that was supposed to accompany the
 * refresh was scheduled as phase two of a project that ended at phase one.
 *
 * THE DISCRIMINATOR WORTH LEARNING
 *
 * Not whether a system is production. Whether it holds production data. Those
 * are different questions, most estates only ask the first, and the second is
 * answerable in one query.
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

const ID = 'only-a-test-system';

export const ONLY_A_TEST_SYSTEM: Scenario = {
  id: ID,
  title: 'Only A Test System',
  difficulty: 'beginner',
  durationMinutes: 45,
  situation:
    'It is 09:40 at Ardal Freight. Somebody signed in to the customer portal test environment from ' +
    'outside the estate last night. Three people have already said it is only UAT.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
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
      summary: 'A successful sign-in to the UAT portal from an external address',
      detail:
        'ADF-UAT-03, the customer portal test environment, accepted a sign-in at 23:41 from ' +
        '203.0.113.58 as the account uat_admin. The environment is published to the internet so ' +
        'that a supplier can test against it. Rule history: fired 3 times in ninety days, all three ' +
        'closed as "test system, no action". The asset register lists ADF-UAT-03 as low ' +
        'criticality.',
      source: 'ADF-UAT-03',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'host-artefact',
      summary: 'The database on it is a copy of production',
      detail:
        'ADF-UAT-03 holds a database named customers_uat containing 61,000 rows. Row counts, ' +
        'customer names, delivery addresses, contact numbers and contract values match the ' +
        'production customer database exactly. A file in the deployment directory records a refresh ' +
        'from production on 21 August. Nothing in the data is synthetic and no field is masked.',
      source: 'ADF-UAT-03',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'raw-log',
      summary: 'The refresh is monthly, documented and deliberate',
      detail:
        'A scheduled job copies the production customer database into UAT on the third Wednesday of ' +
        'each month, and has done since 2023. The design document for the test environment ' +
        'specifies realistic data on the grounds that synthetic data does not surface the defects ' +
        'that matter. The same document lists data masking as phase two. Phase one completed in ' +
        'November 2023 and there is no record of phase two starting.',
      source: 'change system',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'cloud-audit',
      summary: 'The account that signed in, and what else it is',
      detail:
        'uat_admin has a password of Welcome2024, no multi-factor, and has never had a password ' +
        'change since creation in 2023. Account standards exempt non-production environments. The ' +
        'same password is set on two other UAT accounts. Separately, a service account named ' +
        'svc-routing exists in both UAT and production with the same password, because the ' +
        'integration was configured by copying the production configuration file.',
      source: 'ADF-UAT-03',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'network-flow',
      summary: 'What actually left',
      detail:
        'Between 23:44 and 00:12 the session transferred 84 megabytes outbound to the same address. ' +
        'A full export of customers_uat is 81 megabytes. No other traffic left the host in the ' +
        'window. The session ended at 00:12 and the address has not returned.',
      source: 'ADF-UAT-03',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'Everything that would have stopped this was switched off on purpose',
      detail:
        'ADF-UAT-03 is excluded from the patching schedule, the vulnerability scanning scope, the ' +
        'endpoint agent estate and the account standards, all on the basis of its low criticality ' +
        'rating. Each exclusion has a documented approval. The criticality rating was set in 2023 ' +
        'and asks one question, which is whether the system supports a business process. It does ' +
        'not ask what data the system holds.',
      source: 'asset register',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 940,
      surface: 'alert-queue',
      summary: 'The supplier tests against it every day',
      detail:
        'A logistics supplier uses ADF-UAT-03 daily to test its consignment booking integration ' +
        'ahead of a release scheduled for Friday. Taking the environment offline stops that testing ' +
        'and puts the release at risk. The production customer database is unaffected and the ' +
        'svc-routing password is live in production. Fourteen other non-production systems exist in ' +
        'the estate.',
      source: 'engineering operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1100,
      surface: 'host-artefact',
      summary: 'A second test system is flagged in the sweep',
      detail:
        'ADF-UAT-07, the pricing engine test environment, is also internet-published with weak ' +
        'accounts. Its database holds 61,000 rows with the same schema. Every customer name is ' +
        'drawn from a name generator, every address resolves to a single fictional street, contract ' +
        'values are randomised within a band, and the generator script sits in the repository ' +
        'alongside a test data policy dated 2024.',
      source: 'ADF-UAT-07',
      claimedSeverity: 'medium',
    },
  ],
};

export const ONLY_A_TEST_SYSTEM_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'ADF-UAT-03 is the customer portal test environment, published to the internet so a supplier can test against it, and rated low criticality because the rating asks whether a system supports a business process and not what data it holds.',
    'On that basis it is excluded from patching, vulnerability scanning, the endpoint agent estate and the account standards, and each exclusion carries a documented approval.',
    'A scheduled job has copied the production customer database into it on the third Wednesday of every month since 2023, because the design document specifies realistic data on the grounds that synthetic data does not surface the defects that matter. The same document lists masking as phase two, and phase two never started.',
    'So the environment holds 61,000 real customer records with names, delivery addresses, contact numbers and contract values, none of it masked.',
    'At 23:41 somebody signed in from an external address as uat_admin, whose password is Welcome2024, which has never been changed, and which is set on two other UAT accounts.',
    'Between 23:44 and 00:12 they transferred 84 megabytes out. A full export of that database is 81 megabytes.',
    'A service account named svc-routing exists in both UAT and production with the same password, because the integration was configured by copying the production configuration file.',
    'The production customer database was not touched. The data in it left anyway.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1078'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['cloud-security', 'log-analyst'],
      why:
        'Low criticality, an internet-published test box, and three previous firings all closed as ' +
        '"test system, no action". Everything about the row invites the fourth. The question that ' +
        'makes it worth two minutes is not whether the system matters, which is what the ' +
        'criticality rating already answered, but what is on it, which nothing on this row says. ' +
        'Those are different questions and most estates only ever ask the first. Note the shape of ' +
        'the history as well: three closures with the same one-line reason is not three ' +
        'investigations, it is one belief applied three times. Raise it and go and look at the ' +
        'data before deciding anything, because a successful external sign-in is cheap to check ' +
        'and expensive to wave through.',
      standIn:
        'Successful external sign-in to the UAT portal, rated low criticality, and the last three of ' +
        'these were closed as test system no action. I am not making it four. Low criticality ' +
        'answers whether the system matters. It does not answer what is on it, and nothing here ' +
        'tells me. Three closures with the same one-line reason is one belief applied three times, ' +
        'not three investigations. Going to look at the data.',
      commandOptions: [
        { command: "awk -F, '$2==\"ADF-UAT-03\" {print $1, $4, $5}' /var/log/uat/auth.csv | tail", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "ADF-UAT-03" /var/log/assets/register.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status uat-portal', ...STATUS_CHECK },
        { command: 'cat /var/log/uat/auth.csv', ...DUMP_ALL },
        { command: 'curl -s http://203.0.113.58/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'The register says low criticality. Find out what question that rating actually asked.',
      guidance:
        'It is a test system. Ask what is stored on it.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1213'],
      firstResponder: 'forensics',
      alsoAppropriate: ['cloud-security', 'log-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.reimage-now', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'Sixty-one thousand rows, and the names, addresses, contact numbers and contract values ' +
        'match production exactly. This is the row that turns the whole alert over, and it took one ' +
        'query against a system everybody had already decided not to worry about. Data does not ' +
        'stop being real because the hostname contains the letters UAT: the customers in that ' +
        'table are the same customers, the addresses are where their deliveries go, and none of it ' +
        'is masked. State it plainly and without hedging, because the room has spent ten minutes ' +
        'believing something else and the correction has to be unambiguous. The habit worth ' +
        'carrying is the one query itself, which is to sample the data rather than read the label: ' +
        'a system is production or not, and separately it holds production data or not, and only ' +
        'the second question matters to somebody who has just copied the database.',
      standIn:
        'Sixty-one thousand rows and the names, addresses, phone numbers and contract values match ' +
        'production exactly. One query on a box we had all decided not to worry about. Data does ' +
        'not stop being real because the hostname says UAT. These are the same customers and those ' +
        'are the addresses their deliveries go to, and nothing is masked. Whether a system is ' +
        'production and whether it holds production data are two different questions and only the ' +
        'second one matters to whoever copied this.',
      commandOptions: [
        { command: "psql -h ADF-UAT-03 -c 'select count(*), min(name), min(postcode) from customers_uat'", correct: true, teaches: CORRECT_STEP },
        { command: 'head -3 /evidence/uat03/customers_uat-sample.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status postgresql', ...STATUS_CHECK },
        { command: 'cat /evidence/uat03/customers_uat-sample.csv', ...DUMP_ALL },
        { command: 'psql -h ADF-UAT-03 -c "drop table customers_uat"', ...MUTATE },
      ],
      commandNudge:
        'Look at the actual rows in that database and compare a few against production.',
      guidance:
        'There is a database on it. Ask whether the data in it is made up.',
    },
    {
      eventId: 'ev.3',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'log-analyst',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.tune'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Nobody smuggled production data into UAT. A scheduled job has copied it there on the third ' +
        'Wednesday of every month since 2023, the design document specifies realistic data, and the ' +
        'reasoning behind that is sound: synthetic data does not surface the defects that matter, ' +
        'which is why almost every organisation does this. The failure is one line further down the ' +
        'same document, where masking is listed as phase two. Phase one completed in November 2023 ' +
        'and phase two has no start record, so for twenty-two months a monthly job has been ' +
        'copying unmasked customer records into an internet-published environment that everybody ' +
        'believed contained test data. Say it as a process finding rather than a person one, ' +
        'because there is nobody to name: the person who wrote phase two into the plan was right, ' +
        'and a plan with a phase two that nothing tracks is a plan with one phase.',
      standIn:
        'Nobody smuggled this in. A scheduled job has copied production into UAT on the third ' +
        'Wednesday of every month since 2023, and the design document asks for realistic data ' +
        'because synthetic data does not find the defects that matter. That reasoning is correct. ' +
        'The failure is one line down: masking is phase two, phase one finished in November 2023, ' +
        'and phase two has no start record. Twenty-two months of unmasked customer records copied ' +
        'into an internet-facing box everybody thought held test data. Nobody to name. A plan with ' +
        'a phase two that nothing tracks has one phase.',
      commandOptions: [
        { command: 'grep -iE "refresh|uat" /var/log/change/scheduled-jobs.csv | tail -10', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -inE "mask|phase two|phase 2" /evidence/design/uat-environment.md', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status refresh-job', ...STATUS_CHECK },
        { command: 'cat /evidence/design/uat-environment.md', ...DUMP_ALL },
        { command: 'grep -c refresh /var/log/change/scheduled-jobs.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out how production data got there and whether anything was supposed to mask it.',
      guidance:
        'Real data is in a test system. Ask how it got there.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1078'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.corroborate'],
      outOfLaneActions: ['act.revoke-key', 'act.attribute-named', 'act.dismiss', 'act.reset-password'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'A password of Welcome2024, never changed since 2023, no second factor, on an ' +
        'internet-published host, because account standards exempt non-production environments. ' +
        'That exemption is the same belief as the criticality rating wearing different clothes, and ' +
        'it is why this took no skill at all. Then the part that reaches past this incident and ' +
        'should be said before anything else on this row is closed: svc-routing exists in both UAT ' +
        'and production with the same password, because the integration was configured by copying ' +
        'the production configuration file. That is not a UAT credential. It is a production ' +
        'credential that happens to also be in UAT, and anybody who took the UAT configuration last ' +
        'night holds it. The blast radius of a test system just stopped being the test system, and ' +
        'that is the sentence the lead needs first.',
      standIn:
        'Welcome2024, never changed since 2023, no second factor, on an internet-facing host, ' +
        'because account standards exempt non-production. Same belief as the criticality rating in ' +
        'different clothes, and it is why this took no skill. And here is the bit that matters ' +
        'most: svc-routing exists in UAT and production with the same password, because somebody ' +
        'configured the integration by copying the production config file. That is a production ' +
        'credential that happens to live in UAT, and whoever took the config last night has it. ' +
        'The blast radius is no longer the test system.',
      commandOptions: [
        { command: "awk -F, '$3==\"ADF-UAT-03\" {print $2, $5, $6}' /var/log/iam/accounts.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -rn "svc-routing" /evidence/uat03/config/ /evidence/prod/config/ | head', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status identity', ...STATUS_CHECK },
        { command: 'cat /var/log/iam/accounts.csv', ...DUMP_ALL },
        { command: 'net user svc-routing /random /domain', ...MUTATE },
      ],
      commandNudge:
        'List the accounts on that host and check whether any of them exist in production too.',
      guidance:
        'They signed in as a test account. Ask whether any account there is not just a test account.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1041'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.corroborate'],
      outOfLaneActions: ['act.contact-attacker', 'act.dismiss', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Eighty-four megabytes out against a full export of that database at eighty-one, in a ' +
        'twenty-eight minute window, with no other traffic from the host. That is close enough to ' +
        'report as the whole table and honest enough to report as an estimate rather than a fact: ' +
        'the sizes agree, and agreeing is not the same as proving. What can be said without ' +
        'qualification is that the volume is consistent with the entire customer database leaving ' +
        'and is not consistent with somebody browsing a few records. Twenty-eight minutes is also ' +
        'the whole engagement, and the address has not come back, which is what somebody looks ' +
        'like when they got what they came for on the first visit. State the number of customers ' +
        'rather than the megabytes when this reaches the lead, because 61,000 people is the ' +
        'sentence that gets acted on and 84 megabytes is not.',
      standIn:
        'Eighty-four megabytes out in twenty-eight minutes, and a full export of that table is ' +
        'eighty-one. No other traffic from the host in the window. The sizes agree, which is not ' +
        'the same as proof, so I will say it is consistent with the whole database leaving and not ' +
        'consistent with somebody browsing. They were in and out in twenty-eight minutes and have ' +
        'not come back, which is what getting what you came for looks like. And when this goes up ' +
        'it is 61,000 customers, not eighty-four megabytes.',
      commandOptions: [
        { command: "awk '$3==\"ADF-UAT-03\" && $1 ~ /2[34]:|00:/ {print $1, $5, $8}' /var/log/flows.log", correct: true, teaches: CORRECT_STEP },
        { command: 'ls -la /evidence/uat03/customers_uat.dump', correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 203.0.113.58', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'grep -c ADF-UAT-03 /var/log/flows.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Compare what left against the size of a full export of that database.',
      guidance:
        'Something was transferred. Ask how big the whole database is.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'mitigation-specialist'],
      correctActions: ['act.scope-estate', 'act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.isolate', 'act.triage-high'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'Four exclusions, each with a documented approval, all resting on one rating, and the ' +
        'rating asks the wrong question. Patching, vulnerability scanning, the endpoint agent and ' +
        'the account standards were all switched off for this host because it is low criticality, ' +
        'and low criticality was assigned by asking whether the system supports a business process. ' +
        'It does not, and that answer is correct. What nobody was asked is what data the system ' +
        'holds, and that is the question that would have changed all four answers. This is the ' +
        'finding with the longest life in the incident and it generalises immediately: fourteen ' +
        'other non-production systems exist in this estate and nobody currently knows which of ' +
        'them hold a production refresh, because the register does not record it. Scope that ' +
        'tonight rather than next week, because the answer is one query per system and the ' +
        'question has now been asked once and produced a breach.',
      standIn:
        'Four exclusions, four documented approvals, one rating underneath all of them, and the ' +
        'rating asks the wrong question. Patching, scanning, the agent, the account standards, all ' +
        'off because low criticality, and low criticality was decided by asking whether the system ' +
        'supports a business process. It does not, and that is a correct answer. Nobody was asked ' +
        'what data it holds. That question would have changed all four. And there are fourteen ' +
        'other non-production systems and nobody knows which hold a production refresh, because the ' +
        'register does not record it. One query each. I want that tonight.',
      commandOptions: [
        { command: "awk -F, '$4==\"low\" && $6==\"non-production\" {print $1, $2}' /var/log/assets/register.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -iE "exempt|exclu" /var/log/assets/exclusions.csv | grep -i uat', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status vulnscan', ...STATUS_CHECK },
        { command: 'cat /var/log/assets/register.csv', ...DUMP_ALL },
        { command: 'grep -c low /var/log/assets/register.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find every control this host is excluded from, and what the exclusions were based on.',
      guidance:
        'Nothing was watching it. Ask what decided that.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'exfiltration',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The urgent thing is not the box everybody is looking at. Taking UAT offline stops a ' +
        'supplier testing a consignment integration ahead of a Friday release, and the intruder ' +
        'left at 00:12 and has not come back, so pulling it now protects a database that has ' +
        'already gone. The thing that has not happened yet is production: svc-routing has the same ' +
        'password in both, and anybody holding last night\'s UAT configuration holds a live ' +
        'production credential. Rotate that first, in production, before touching UAT at all. Then ' +
        'the narrow containment on the environment itself, which is not taking it down but taking ' +
        'it off the internet: it is published so one supplier can reach it, and an allowlist ' +
        'entry for that supplier keeps Friday alive and removes everybody else. Check the rollback ' +
        'and confirm the supplier source addresses before the change, because a release at risk on ' +
        'Friday is a real cost and getting the allowlist wrong causes it. Deliberately left undone ' +
        'and said out loud: the 61,000 records are gone and nothing here recovers them, the ' +
        'monthly refresh runs again on the third Wednesday and will repopulate an unmasked copy ' +
        'unless somebody stops the job, and fourteen other non-production systems have not been ' +
        'checked.',
      standIn:
        'The urgent thing is not the box we are all looking at. They left at 00:12 and have not come ' +
        'back, so pulling UAT protects a database that is already gone and stops a supplier testing ' +
        'ahead of a Friday release. What has not happened yet is production: svc-routing has the ' +
        'same password in both, so whoever took last night\'s config holds a live production ' +
        'credential. Rotate that first, in production, before we touch UAT. Then take UAT off the ' +
        'internet rather than down: it is published for one supplier, so allowlist them and remove ' +
        'everybody else, and Friday survives. Confirm their addresses before the change. Left ' +
        'undone: the records are gone, the refresh runs again on the third Wednesday and will make ' +
        'a fresh unmasked copy unless somebody stops the job, and nobody has looked at the other ' +
        'fourteen.',
      commandNudge:
        'Ask what has already happened and what has not, then order the actions by which is still ' +
        'preventable.',
    },
    {
      eventId: 'ev.8',
      verdict: 'benign-true-positive',
      firstResponder: 'forensics',
      alsoAppropriate: ['cloud-security', 'soc-operator'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.attribute-named'],
      escalateTo: [],
      why:
        'A second internet-published test system with weak accounts and 61,000 rows in the same ' +
        'schema, surfacing while the floor is holding exactly that as the incident, and this one is ' +
        'genuinely synthetic. Four checks close it and they take a minute: every name comes from a ' +
        'generator, every address resolves to one fictional street, contract values are randomised ' +
        'within a band, and the generator script is in the repository next to a test data policy ' +
        'from 2024. Somebody did this properly here, which is worth saying rather than passing ' +
        'over, because it establishes that the organisation knows how and makes the other ' +
        'environment a gap rather than an inevitability. Close it, and note the discriminator, ' +
        'because it is the one the sweep of the other fourteen systems will need: the question is ' +
        'never whether a system is exposed or weakly configured, it is whether the rows in it are ' +
        'about real people, and that is answered by reading three of them.',
      standIn:
        'Second test system, internet-published, weak accounts, 61,000 rows in the same schema, and ' +
        'this one is properly synthetic. Names from a generator, every address on one fictional ' +
        'street, contract values randomised in a band, generator script in the repo next to a 2024 ' +
        'test data policy. Somebody did this right here, which matters: we know how, so the other ' +
        'one is a gap and not an inevitability. Closing it. And that is the check for the other ' +
        'fourteen: not whether it is exposed, whether the rows are about real people. Read three of ' +
        'them.',
      commandOptions: [
        { command: 'head -5 /evidence/uat07/customers-sample.csv', correct: true, teaches: CORRECT_STEP },
        { command: 'ls /evidence/uat07/repo/ | grep -i "generat\\|seed"', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status uat-pricing', ...STATUS_CHECK },
        { command: 'cat /evidence/uat07/customers-sample.csv', ...DUMP_ALL },
        { command: 'grep -c . /evidence/uat07/customers-sample.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Read a few rows from that database and see whether the people in it exist.',
      guidance:
        'It looks like the other one. Ask whether the data is real.',
    },
  ],
};
