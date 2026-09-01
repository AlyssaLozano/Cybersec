/**
 * Scenario 50: Two Weeks Notice.
 *
 * A contractor taking the work with them, twelve days before the engagement
 * ends.
 *
 * HOW THIS DIFFERS FROM LONG NOTICE
 *
 * `long-notice` is an employee using access they legitimately hold, at a volume
 * that is only unusual against their own history, and the whole lesson there is
 * restraint: the floor is one confident sentence away from putting a colleague
 * into an HR meeting on evidence that does not support it.
 *
 * This is the opposite shape and it is deliberate. The pattern is textbook, the
 * volume is not subtle, the destination is a personal cloud account, and the
 * file names say what they are. A student needs both: the discipline not to
 * accuse on thin evidence, and the confidence to say plainly when the evidence
 * is not thin. A floor that has only ever practised caution hedges on this one,
 * and hedging costs twelve days.
 *
 * WHAT IS GENUINELY DIFFERENT ABOUT A CONTRACTOR
 *
 * They are a third party. The obligations run through a contract rather than an
 * employment relationship, the intellectual property clause decides what can be
 * demanded and from whom, and their employer is a company with its own lawyers.
 * That changes who is told, in what order, and what the organisation can
 * actually ask for. It is `ev.6` and it is the part a technical floor skips.
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

const ID = 'two-weeks-notice';

export const TWO_WEEKS_NOTICE: Scenario = {
  id: ID,
  title: 'Two Weeks Notice',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 16:30 at Ardal Freight. Data loss prevention raised something at lunchtime about a ' +
    'contractor uploading to personal cloud storage. Their engagement ends in twelve days.',
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
      summary: 'DLP flagged 4.2 GB uploaded to a consumer cloud account by a contractor',
      detail:
        'Endpoint data loss prevention recorded uploads totalling 4.2 GB from the workstation ' +
        'assigned to the contractor r.vaszary to a consumer file storage provider between 11:40 and ' +
        '14:05. The provider is not on the approved list and is not blocked by policy. Rule ' +
        'history: fired 190 times in thirty days, 186 closed as staff using personal storage for ' +
        'non-work files.',
      source: 'r.vaszary',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 130,
      surface: 'raw-log',
      summary: 'File server access is eleven times this account ninety-day average',
      detail:
        'The account opened 3,180 files from the commercial shared drive between 09:15 and 14:02, ' +
        'against a ninety-day daily average of 290. The access walks folder by folder in order, at ' +
        'roughly one file every four seconds, with nothing held open longer than three seconds. The ' +
        'increase began on Monday, the day after the contract end date was confirmed by email.',
      source: 'r.vaszary',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 290,
      surface: 'network-flow',
      summary: 'The uploads went to a personal account, not the corporate tenant',
      detail:
        'Proxy records show the uploads authenticated to the storage provider using a personal ' +
        'account registered to a private email address, not the corporate tenant that the ' +
        'organisation licenses for the same provider. Corporate tenant traffic is allowlisted and ' +
        'logged; personal tenant traffic on the same provider is permitted by the same allowlist ' +
        'entry because the destination hostname is identical.',
      source: 'ADF-WS-6612',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 450,
      surface: 'host-artefact',
      summary: 'The uploaded files are commercial rather than operational',
      detail:
        'The upload manifest recovered from the workstation lists 1,940 files: the rate card and ' +
        'pricing model for all 214 contracted customers, the route optimisation parameters, three ' +
        'years of tender submissions with their win and loss analysis, and the customer contact ' +
        'database. It contains almost nothing operational. The contractor engagement is for ' +
        'warehouse management system integration work.',
      source: 'ADF-WS-6612',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 610,
      surface: 'alert-queue',
      summary: 'The engagement ends in twelve days and was confirmed on Sunday',
      detail:
        'The contract register shows the engagement ending on the 29th, twelve days from today, ' +
        'confirmed by email to the contractor on Sunday evening. Their onboarding granted access to ' +
        'the commercial shared drive alongside the operational drives, because the access request ' +
        'named a group rather than individual folders. The access increase began the following ' +
        'morning.',
      source: 'contract register',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 770,
      surface: 'alert-queue',
      summary: 'The contract governs what can be demanded, and from whom',
      detail:
        'The engagement contract is with the contractor employer, a systems integration firm, not ' +
        'with the individual. It contains an intellectual property clause requiring return or ' +
        'destruction of confidential material on termination and a right to audit. Any demand for ' +
        'deletion runs through that firm. Revoking access immediately is permitted and ends the ' +
        'integration work with twelve days of it outstanding.',
      source: 'contract register',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'A second contractor archived 900 files to the corporate tenant this morning',
      detail:
        'Another contractor on the same engagement copied 900 files to a folder in the corporate ' +
        'cloud tenant at 09:30, all of them integration documentation and test results they ' +
        'authored. There is a handover ticket referencing the folder, their project manager is ' +
        'named on it, and the destination is inside the organisation tenant. Rule history: fired ' +
        '190 times in thirty days, 186 closed as routine.',
      source: 'contractor handover',
      claimedSeverity: 'low',
    },
  ],
};

export const TWO_WEEKS_NOTICE_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'A contractor engaged for warehouse system integration work was told on Sunday that the engagement ends on the 29th.',
    'On Monday morning their file access went from a 290 file daily average to 3,180 in five hours, walking the commercial shared drive folder by folder at machine speed.',
    'They had access to that drive because their onboarding request named a group rather than individual folders, and nobody noticed that integration work does not need pricing models.',
    'Between 11:40 and 14:05 they uploaded 4.2 GB to a consumer cloud provider, authenticated to a personal account registered to a private email address.',
    'The proxy allowed it because the corporate tenant of the same provider is allowlisted and the destination hostname is identical.',
    'What went is commercial rather than operational: rate cards and pricing for all 214 contracted customers, route optimisation parameters, three years of tender submissions with win and loss analysis, and the customer contact database.',
    'The contract is with their employer rather than with them, and it carries an intellectual property clause and a right to audit, so any demand for deletion runs through that firm.',
    'Revoking access stops it and leaves twelve days of integration work unfinished.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1567.002'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'cloud-security'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reset-password', 'act.attribute-named'],
      escalateTo: ['log-analyst', 'ir-lead'],
      why:
        'A hundred and eighty-six of a hundred and ninety this month were people putting personal ' +
        'files in personal storage, which is what this rule mostly catches and mostly should. Two ' +
        'things separate it and both are on the row: 4.2 GB is not a personal file, and it is a ' +
        'contractor. Neither is proof of anything and together they are worth twenty minutes. The ' +
        'habit this builds is the counterweight to every scenario that teaches restraint: a noisy ' +
        'rule is a reason to check quickly rather than a reason to close, and the check here is one ' +
        'lookup of what that account has been doing today.',
      standIn:
        '4.2 GB uploaded to a consumer cloud provider from a contractor workstation between 11:40 ' +
        'and 14:05. Provider is not approved and not blocked. A hundred and eighty-six of a hundred ' +
        'and ninety this month were personal files, and 4.2 GB is not personal files. Raising it.',
      commandOptions: [
        { command: "awk '$3==\"r.vaszary\" {sum+=$6} END {print sum}' /var/log/dlp/uploads.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep vaszary /var/log/dlp/uploads.log | tail -20', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status dlp-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/dlp/uploads.log', ...DUMP_ALL },
        { command: 'grep -c UPLOAD /var/log/dlp/uploads.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Total what that account has uploaded today and compare it against what a personal file ' +
        'looks like.',
      guidance:
        'This rule is usually noise. Ask what makes the size and the person different from the ' +
        'usual noise.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1005', 'T1083'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'network-analyst'],
      why:
        'Eleven times the average is the number people quote and the rate is the number that proves ' +
        'something. One file every four seconds, folder by folder in order, nothing held open ' +
        'longer than three seconds: nobody read any of this. That distinction matters because ' +
        '"accessed 3,180 files" and "copied a drive" sound similar in a report and only the second ' +
        'is supported. The timing is the other half and it is unambiguous here in a way it rarely ' +
        'is: the increase begins the morning after the end date was confirmed. Cause and effect are ' +
        'still an inference rather than a fact, and it is a short one.',
      standIn:
        '3,180 files opened between 09:15 and 14:02 against a ninety-day average of 290. One every ' +
        'four seconds, folder by folder, nothing held open. That is a copy, not somebody reading. ' +
        'And it starts the morning after the contract end date was confirmed.',
      commandOptions: [
        { command: "awk '$3==\"r.vaszary\" {print $1}' /var/log/fileaccess.log | uniq -c | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$3==\"r.vaszary\"' /var/log/fileaccess.log | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status smbd', ...STATUS_CHECK },
        { command: 'cat /var/log/fileaccess.log', ...DUMP_ALL },
        { command: 'chmod 000 /mnt/commercial', ...MUTATE },
      ],
      commandNudge:
        'Work out the rate the files were opened at, not just how many there were.',
      guidance:
        'Ask whether a person could have read what the logs say they opened, in the time they had.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1567.002'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'The detail that removes the innocent reading, and it is one field in a proxy log. The ' +
        'uploads authenticated to a personal account on a private email address, not the corporate ' +
        'tenant the organisation licenses for the same provider. Somebody backing up work files ' +
        'clumsily uses the tenant they are signed into; this required signing into a different ' +
        'account. The control finding underneath is worth naming because it is not an oversight ' +
        'anybody would catch: the allowlist entry is a hostname, the corporate and personal tenants ' +
        'share that hostname, so allowing one allows both and no policy anywhere distinguishes ' +
        'them.',
      standIn:
        'The uploads authenticated to a personal account on a private email address, not our ' +
        'corporate tenant on the same provider. Somebody backing up work files uses the account ' +
        'they are already in; this meant signing into a different one. And our allowlist is a ' +
        'hostname, which both tenants share, so permitting ours permits theirs.',
      commandOptions: [
        { command: "awk '/storage-provider/ {print $8}' /var/log/proxy/access.log | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "tenant\\|account=" /var/log/proxy/access.log | grep vaszary | head', correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -an | grep 443', ...WRONG_TARGET },
        { command: 'cat /var/log/proxy/access.log', ...DUMP_ALL },
        { command: 'curl -sI https://storage-provider.example', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Check which account the uploads authenticated as, not just which provider they went to.',
      guidance:
        'We license that provider. Ask whether this went to our tenant or somebody else.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1005'],
      firstResponder: 'forensics',
      alsoAppropriate: ['ir-lead', 'mitigation-specialist'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'What went, and the composition is the finding rather than the volume. Rate cards and ' +
        'pricing for all 214 contracted customers, route optimisation parameters, three years of ' +
        'tender submissions with win and loss analysis, the customer contact database. Almost ' +
        'nothing operational. The engagement is warehouse system integration, so none of this is ' +
        'work product and none of it is anything they built. A contractor archiving their own ' +
        'output takes integration documentation; this took the commercial position of the business, ' +
        'and tender win and loss analysis is the single most valuable thing in it to a competitor ' +
        'because it says why Ardal loses. Preserve properly: this ends in a contractual claim and ' +
        'possibly a prosecution, and the manifest is the evidence.',
      standIn:
        'The manifest is 1,940 files: rate cards and pricing for all 214 contracted customers, route ' +
        'optimisation parameters, three years of tender submissions with win and loss analysis, and ' +
        'the customer contact database. Almost nothing operational. They are here for warehouse ' +
        'integration, so none of this is their work product. The tender analysis is the worst of it ' +
        'because it says why we lose. Sealed.',
      commandOptions: [
        { command: 'head -30 /var/evidence/ADF-WS-6612/upload-manifest.txt', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F/ '{print $3}' /var/evidence/ADF-WS-6612/upload-manifest.txt | sort | uniq -c | sort -rn", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status dlp-agent', ...STATUS_CHECK },
        { command: 'cat /var/evidence/ADF-WS-6612/upload-manifest.txt', ...DUMP_ALL },
        { command: 'wc -l /var/evidence/ADF-WS-6612/upload-manifest.txt', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at what kind of files were uploaded, and compare that against what they were hired to ' +
        'do.',
      guidance:
        'Ask what they were engaged to work on, then ask whether these files have anything to do ' +
        'with it.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'reconnaissance',
      techniques: ['T1078.003'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.isolate', 'act.reset-password'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'The motive and the enabling failure, and the second is more useful than the first. The end ' +
        'date was confirmed on Sunday evening and the access spike begins Monday morning, which is ' +
        'about as clean a sequence as this job offers. The finding worth carrying past today is the ' +
        'other sentence: they had the commercial drive because the onboarding request named a group ' +
        'rather than individual folders. Nobody decided a warehouse integration contractor should ' +
        'see pricing for 214 customers. It came bundled, as it does everywhere, and the same ' +
        'request pattern will have done the same for every contractor onboarded that way.',
      standIn:
        'Engagement ends on the 29th, confirmed by email Sunday evening, and the access spike starts ' +
        'Monday morning. They had the commercial drive because the onboarding request named a group ' +
        'rather than folders. Nobody decided an integration contractor should see pricing for 214 ' +
        'customers, it came bundled, and every contractor onboarded that way has the same.',
      commandOptions: [
        { command: 'grep -i vaszary /var/log/contracts/register.csv', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$2==\"r.vaszary\" {print $4, $6}' /var/log/identity/group-membership.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status identity-sync', ...STATUS_CHECK },
        { command: 'cat /var/log/contracts/register.csv', ...DUMP_ALL },
        { command: 'grep -c contractor /var/log/contracts/register.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out when they learned the engagement was ending, and why they could reach that drive ' +
        'at all.',
      guidance:
        'Ask what changed just before the behaviour changed. Then ask why they had the access in ' +
        'the first place.',
    },
    {
      eventId: 'ev.6',
      verdict: 'benign-true-positive',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.sequence-remedy'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.dismiss', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      why:
        'The part a technical floor skips, and it changes who does what. The contract is with the ' +
        'contractor employer, a systems integration firm, not with the individual, so every demand ' +
        'runs through that firm and nobody here should be ringing the contractor. The intellectual ' +
        'property clause requiring return or destruction and the right to audit are the only ' +
        'leverage the organisation actually has, and they are contractual rather than technical: ' +
        'there is no button that deletes a file from somebody personal cloud account. The ' +
        'containment question is narrower than it looks. Revoking access stops any further copying ' +
        'and costs twelve days of unfinished integration work, and the honest framing is that the ' +
        'commercial data is already gone, so what revocation protects is everything not yet taken ' +
        'rather than anything already lost.',
      standIn:
        'The contract is with their employer, not with them, so demands go through that firm and ' +
        'nobody rings the contractor. The IP clause and the audit right are our only real leverage ' +
        'and both are contractual, because no button deletes a file from somebody personal cloud. ' +
        'Revoking access costs twelve days of integration work and protects what has not gone yet, ' +
        'not what has. I would revoke now and say plainly that it does not recover anything.',
      commandNudge:
        'Read the engagement contract and work out who the organisation can actually make demands ' +
        'of.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['cloud-security'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: [],
      why:
        'A second contractor on the same engagement copying 900 files on the same morning, and it ' +
        'is a genuine handover. Three checks and all three agree: the destination is inside the ' +
        'corporate tenant rather than a personal account, the files are integration documentation ' +
        'and test results they authored themselves, and there is a handover ticket with their ' +
        'project manager named on it. This matters because the instinct after ev.4 will be to treat ' +
        'every contractor on that engagement as suspect, and contractors archive their own work at ' +
        'the end of an engagement because they are asked to. The discriminator is the pair that ' +
        'runs through the whole board: whose account it went to, and whether the files are anything ' +
        'they made.',
      standIn:
        'Second contractor copied 900 files at 09:30 into our corporate tenant, all integration ' +
        'documentation and test results they wrote, with a handover ticket and their project manager ' +
        'named on it. Our tenant, their own work, and a ticket. That is a handover. Closing it, and ' +
        'we should not sweep the whole engagement.',
      commandOptions: [
        { command: "awk '/storage-provider/ && /tenant=ardal/ {print $3, $6}' /var/log/proxy/access.log | tail", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i handover /var/log/servicedesk/tickets.log | tail', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status dlp-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/proxy/access.log', ...DUMP_ALL },
        { command: 'grep -c 900 /var/log/dlp/uploads.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check which tenant that upload went to and whether the files are anything they authored.',
      guidance:
        'Contractors archive their own work when they leave. Ask whose account it went to and whose ' +
        'work it was.',
    },
  ],
};
