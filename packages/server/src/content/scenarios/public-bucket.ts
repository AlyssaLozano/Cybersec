/**
 * Scenario 35: Open Shelf.
 *
 * A storage bucket left public in a migration, and the six weeks before anybody
 * came to look.
 *
 * WHAT THIS TEACHES
 *
 * That exposure and attack are different events with different dates, and that
 * the one that matters is the earlier one.
 *
 * A floor asked when this started will reach for the scraper: the first
 * automated crawler hit is a clean timestamp with traffic attached, and it is
 * six weeks too late. The data was reachable by anybody on the internet from the
 * moment the migration finished. Nobody came for a month and a half, which is
 * luck rather than security, and every hour of that window is part of the
 * exposure whether or not anything is recorded against it.
 *
 * That distinction decides the regulatory position. "Accessed by a scraper on
 * the 27th" and "publicly reachable since 14 July" describe the same bucket and
 * produce very different notifications, and only the second one is true.
 *
 * WHY IT IS A BEGINNER SCENARIO
 *
 * Nothing is hidden and nothing is clever. There is no attacker to hunt, no
 * payload to decode, and the whole board can be read in twenty minutes. The
 * difficulty is entirely in the reasoning: establishing what was reachable,
 * for how long, and by whom, and resisting the pull of the one date that has a
 * log line next to it.
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

const ID = 'open-shelf';

export const OPEN_SHELF: Scenario = {
  id: ID,
  title: 'Open Shelf',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 14:20 at Ardal Freight. A customer emailed to say they found one of our customs ' +
    'documents through a web search. Nobody has broken into anything.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'cloud-security',
    'vulnerability-analyst',
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
      summary: 'A customer reports finding an Ardal customs document via a search engine',
      detail:
        'A logistics manager at a customer emailed at 13:40 with a link to a PDF held in our ' +
        'storage, reachable without any sign-in. The document is a customs manifest naming a ' +
        'consignor, consignee, goods description and declared value. They found it while searching ' +
        'for their own company name. Rule history: this arrived as an email to a shared mailbox, ' +
        'not as a detection.',
      source: 'customer',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'cloud-audit',
      summary: 'The bucket policy was changed during the storage migration on 14 July',
      detail:
        'The manifest-archive bucket had its access policy replaced at 02:14 on 14 July as part of ' +
        'the storage platform migration, by the migration service account, under an approved change ' +
        'record. The replacement policy grants read to all principals including anonymous. The ' +
        'previous policy granted read to two internal roles only. No alert exists for a policy ' +
        'change that widens access.',
      source: 'adf-storage',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'network-flow',
      summary: 'Automated crawling began on 27 August and has continued since',
      detail:
        'Access logs show no anonymous reads at all between 14 July and 26 August. From 27 August ' +
        'a crawler began enumerating the bucket, and since then 41,000 objects have been retrieved ' +
        'by seven distinct sources, six of which identify themselves as search or archival ' +
        'crawlers. The seventh identifies as nothing and retrieved objects in a different order.',
      source: 'adf-storage',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'raw-log',
      summary: 'The bucket holds 41,000 customs manifests going back four years',
      detail:
        'The bucket contains 41,180 objects, almost all customs manifests filed between 2022 and ' +
        'today. Each names consignor, consignee, goods description, declared value and the ' +
        'commercial terms of carriage. Around 900 also carry a named individual as the receiving ' +
        'contact with a direct telephone number. Object names follow a predictable date and ' +
        'reference format.',
      source: 'adf-storage',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'host-artefact',
      summary: 'Search engine caches hold copies that persist after the bucket is closed',
      detail:
        'At least two search engines have indexed the bucket and hold cached copies of an unknown ' +
        'number of documents. Removal requires a request to each operator and does not take effect ' +
        'immediately. One archival service explicitly does not honour removal requests for material ' +
        'that was publicly reachable when collected.',
      source: 'open source',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'Eleven other buckets were migrated in the same change window',
      detail:
        'The 14 July migration moved twelve buckets in total using the same automation and the same ' +
        'policy template. Nobody has checked the other eleven. The change record lists all twelve. ' +
        'The storage platform provides a report of publicly readable buckets and it has never been ' +
        'run.',
      source: 'adf-storage',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'Four hundred anonymous reads against the public website bucket today',
      detail:
        'The website-assets bucket served 400 anonymous reads today, in line with its daily range. ' +
        'It holds the public website images, logos and brochure PDFs, and is deliberately public ' +
        'with a documented decision and an owner. Rule history: fired 30 times in thirty days, 30 ' +
        'closed as the public website being public.',
      source: 'adf-storage',
      claimedSeverity: 'low',
    },
  ],
};

export const OPEN_SHELF_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'On 14 July at 02:14 the storage migration replaced the access policy on the manifest archive with a template that grants read to everybody, including anonymous.',
    'It was done by the migration service account under an approved change record, using the same automation and the same template as eleven other buckets.',
    'Nothing alerted, because no rule exists for a policy change that widens access.',
    'From that moment 41,180 customs manifests going back to 2022 were readable by anybody on the internet.',
    'Nobody came for six weeks. On 27 August a crawler found it, and since then seven sources have retrieved the objects, six identifying as search or archival crawlers and one identifying as nothing.',
    'Search engines have indexed it and hold cached copies. One archival service will not remove material that was public when collected.',
    'The exposure began on 14 July. The first access was on 27 August. Those are different dates and the earlier one is the one that counts.',
    'Eleven other buckets went through the same migration with the same template and nobody has looked at them.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1530'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['cloud-security'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reimage-now', 'act.contact-attacker'],
      escalateTo: ['cloud-security', 'ir-lead'],
      why:
        'It arrives as a polite email from a customer, with no detection behind it and no rule that ' +
        'would ever have produced one. Take it immediately and take it seriously: a document ' +
        'reachable without signing in is not a permissions question, it is public. The detail worth ' +
        'registering early is how it was found, because a customer searching for their own company ' +
        'name and landing on our storage means this is indexed, and indexed means copies exist ' +
        'somewhere other than our bucket. That shapes everything the floor does for the next hour.',
      standIn:
        'Customer emailed at 13:40 with a link to one of our customs manifests, reachable with no ' +
        'sign-in. They found it searching for their own company name, so it is indexed. No rule ' +
        'produced this and none would have. Raising it to cloud now.',
      commandOptions: [
        { command: 'aws s3api get-bucket-policy --bucket manifest-archive', correct: true, teaches: CORRECT_STEP },
        { command: 'curl -sI https://adf-storage.example/manifest-archive/2026-08-14-4471.pdf', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status adf-storage-gw', ...STATUS_CHECK },
        { command: 'cat /var/log/storage/access.log', ...DUMP_ALL },
        { command: 'grep -c GET /var/log/storage/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether that document really is reachable without signing in, and what else is beside it.',
      guidance:
        'Somebody outside found this by searching. Ask what that tells you about who else has a ' +
        'copy.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1578'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'vulnerability-analyst', 'mitigation-specialist'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'vulnerability-analyst'],
      why:
        'The date that matters, and it is six weeks before anything anybody would call an incident. ' +
        'A policy replaced at 02:14 on 14 July by the migration service account under an approved ' +
        'change, granting read to all principals including anonymous where the previous policy ' +
        'granted read to two internal roles. Nobody did anything wrong and nothing was attacked: a ' +
        'template was applied that was more permissive than the thing it replaced. The finding for ' +
        'the debrief is the last sentence of the row, which is that no alert exists for a policy ' +
        'change that widens access. Estates alert on failures and denials, and a permission being ' +
        'granted is neither.',
      standIn:
        'The bucket policy was replaced at 02:14 on 14 July by the migration service account under ' +
        'an approved change. New policy grants read to all principals including anonymous; the old ' +
        'one granted read to two internal roles. Nothing alerted because we have no rule for a ' +
        'policy change that widens access. Exposure starts 14 July, not last week.',
      commandOptions: [
        { command: "awk '$4==\"PutBucketPolicy\" {print $1, $3, $5}' /var/log/cloud/audit.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "manifest-archive" /var/log/cloud/audit.log | head -20', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status cloudtrail-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/cloud/audit.log', ...DUMP_ALL },
        { command: 'aws s3api put-bucket-acl --bucket manifest-archive --acl private', ...MUTATE },
      ],
      commandNudge:
        'Find when that bucket policy last changed and what it looked like before.',
      guidance:
        'Ask when this became reachable, not when somebody first read it. They are different dates.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1530'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'forensics'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'The trap, and it is the most attractive number on the board. There is a clean start date ' +
        'with traffic behind it, 27 August, and it is not when this began. Six weeks of no ' +
        'anonymous reads is not six weeks of safety, it is six weeks of nobody having looked yet, ' +
        'and reporting the 27th as the start understates the exposure by a month and a half. The ' +
        'other finding is the seventh source: six identify themselves as search or archival ' +
        'crawlers, which is what crawlers do, and one identifies as nothing and retrieved objects ' +
        'in a different order. That is somebody choosing what to take, and it is worth separating ' +
        'from the six in every sentence of the report.',
      standIn:
        'No anonymous reads at all between 14 July and 26 August. Crawling starts 27 August and ' +
        '41,000 objects have gone to seven sources. Six identify as search or archival crawlers. ' +
        'The seventh identifies as nothing and pulled objects in a different order, which is ' +
        'somebody choosing. The 27th is when it was found, not when it started.',
      commandOptions: [
        { command: "awk '$5==\"anonymous\" {print $1}' /var/log/storage/access.log | cut -d- -f1-3 | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$5==\"anonymous\" {print $8}' /var/log/storage/access.log | sort | uniq -c | sort -rn", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status adf-storage-gw', ...STATUS_CHECK },
        { command: 'cat /var/log/storage/access.log', ...DUMP_ALL },
        { command: 'grep -c anonymous /var/log/storage/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find the first anonymous read, then check how that date compares to when the policy ' +
        'changed.',
      guidance:
        'You have a date with traffic attached. Ask whether that is when it started or when ' +
        'somebody noticed.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'collection',
      techniques: ['T1530'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['ir-lead', 'forensics'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'What is in it, which sizes the notification. 41,180 manifests over four years, each naming ' +
        'consignor, consignee, goods description, declared value and commercial terms. That is ' +
        'mostly commercial confidentiality rather than personal data, and it is a genuine problem ' +
        'for customers who did not agree to have their shipping patterns and declared values ' +
        'published. The 900 with a named receiving contact and a direct telephone number are the ' +
        'personal data, and they are the subset that triggers a different obligation. Separating ' +
        'those two numbers is the whole value of this event, because one is a contractual ' +
        'conversation with customers and the other is a regulator.',
      standIn:
        '41,180 manifests back to 2022. Each has consignor, consignee, goods description, declared ' +
        'value and terms of carriage, which is commercial confidentiality for our customers. About ' +
        '900 also carry a named receiving contact with a direct phone number, and those are the ' +
        'personal data. Two different obligations and two different numbers.',
      commandOptions: [
        { command: 'aws s3 ls s3://manifest-archive --recursive --summarize | tail -3', correct: true, teaches: CORRECT_STEP },
        { command: 'head -20 /var/archive/manifest-sample.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status adf-storage-gw', ...STATUS_CHECK },
        { command: 'cat /var/archive/manifest-sample.csv', ...DUMP_ALL },
        { command: 'aws s3 ls s3://manifest-archive | wc -l', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at what fields the documents actually contain, not just how many there are.',
      guidance:
        'Ask what is in these documents. Commercial detail and personal data are different ' +
        'obligations.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      techniques: ['T1530'],
      firstResponder: 'forensics',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.contact-attacker', 'act.reimage-now', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Why closing the bucket does not end it, and it is the point most floors reach an hour too ' +
        'late. At least two search engines hold cached copies, removal is a request to each ' +
        'operator rather than an action we can take, and one archival service will not remove ' +
        'material that was public when collected. So a proportion of these documents are now ' +
        'permanently outside our control, and the honest report says that rather than "the bucket ' +
        'has been secured". Preserve the evidence of what was indexed while it is still ' +
        'observable, because it is the only record of scope that will exist once the caches turn ' +
        'over.',
      standIn:
        'At least two search engines have indexed this and hold cached copies. Removal is a request ' +
        'to each operator, not something we can do, and one archival service will not remove ' +
        'anything that was public when they collected it. Some of this is permanently out of our ' +
        'control. Capturing what is indexed now, while we still can.',
      commandOptions: [
        { command: 'grep -i "cache\\|indexed" /var/log/osint/exposure-check.log', correct: true, teaches: CORRECT_STEP },
        { command: "awk '/manifest-archive/ {print $3, $5}' /var/log/osint/exposure-check.log", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status adf-storage-gw', ...STATUS_CHECK },
        { command: 'cat /var/log/osint/exposure-check.log', ...DUMP_ALL },
        { command: 'curl -s "https://search.example/?q=manifest-archive"', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Check whether copies exist anywhere we do not control, and whether we can get them removed.',
      guidance:
        'You closed the bucket. Ask whether that removes the copies other people already made.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'discovery',
      critical: true,
      techniques: ['T1578'],
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.preserve', 'act.isolate', 'act.declare', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The question nobody else asks and the one with the most value in it. Twelve buckets were ' +
        'migrated on 14 July with the same automation and the same policy template, and eleven have ' +
        'not been looked at. If the template did this once it did it twelve times, and the only ' +
        'reason this one surfaced is that a customer happened to search for their own name. The ' +
        'second sentence is the finding for the debrief: the storage platform provides a report of ' +
        'publicly readable buckets and it has never been run. This exposure was one command away ' +
        'from being found at any point in six weeks.',
      standIn:
        'Twelve buckets went through that migration with the same automation and the same template. ' +
        'Eleven have not been checked. If it did this once it did it twelve times. And the platform ' +
        'has a report of publicly readable buckets that has never been run, so this was one command ' +
        'away from being found any day in the last six weeks.',
      commandOptions: [
        { command: 'aws s3api list-buckets --query "Buckets[].Name" --output text | xargs -n1 -I{} aws s3api get-bucket-policy-status --bucket {}', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "14 July\\|migration" /var/log/change-management.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status adf-storage-gw', ...STATUS_CHECK },
        { command: 'cat /var/log/cloud/audit.log', ...DUMP_ALL },
        { command: 'aws s3 ls | wc -l', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out what else was migrated in the same change, and check all of it the same way.',
      guidance:
        'One bucket was wrong. Ask what else went through the same process on the same night.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.scope-estate'],
      escalateTo: [],
      why:
        'Four hundred anonymous reads today against a bucket, on the afternoon the floor has found ' +
        'a bucket serving anonymous reads. This one holds the public website images, logos and ' +
        'brochures, is deliberately public with a documented decision and a named owner, and its ' +
        'volume is inside the normal daily range. Thirty of thirty this month were the same. The ' +
        'check is which bucket and does somebody own the decision, and it takes under a minute. It ' +
        'is here because after ev.6 the instinct will be to treat every publicly readable bucket as ' +
        'a finding, and some of them are supposed to be public: the report from ev.6 will list this ' +
        'one, and a floor that cannot tell the difference will hand operations twelve findings when ' +
        'there are eleven.',
      standIn:
        'Four hundred anonymous reads on the website-assets bucket today, inside its normal range. ' +
        'It holds the public site images, logos and brochures, deliberately public, documented ' +
        'decision with an owner. Thirty of thirty this month were the same. It will show up on the ' +
        'public-bucket report and it is not a finding. Closing it.',
      commandOptions: [
        { command: 'aws s3api get-bucket-tagging --bucket website-assets', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "website-assets" /var/log/cloud/documented-public.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status adf-storage-gw', ...STATUS_CHECK },
        { command: 'cat /var/log/storage/access.log', ...DUMP_ALL },
        { command: 'grep -c website-assets /var/log/storage/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check which bucket this is and whether anybody decided on purpose that it should be public.',
      guidance:
        'Some things are public because somebody chose that. Ask whether this is one of them before ' +
        'you add it to the list.',
    },
  ],
};
