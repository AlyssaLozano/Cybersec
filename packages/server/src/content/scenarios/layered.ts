/**
 * Scenario 58: Three Things At Once.
 *
 * A ransomware note, a departing consultant emptying a research share, and a
 * blood chemistry analyser talking to an address it has never talked to. All in
 * one evening, in one hospital.
 *
 * WHAT THIS TEACHES
 *
 * That the conspiracy is the failure mode.
 *
 * The tidy story writes itself and it is wrong in every particular: the insider
 * took the data, dropped the ransomware to cover the theft, and the analyser is
 * the channel it left by. Every seat will feel that story assemble, it accounts
 * for all three threads, and a floor that commits to it spends the night
 * proving a link that does not exist while the actual compromise sits on the
 * quietest row on the board.
 *
 * WHAT IS ACTUALLY TRUE
 *
 * The ransomware is real, commodity, and unrelated. The consultant download is
 * mostly her own work and one dataset of it is genuinely unresolvable tonight.
 * The analyser is the incident: a vendor remote-support tunnel whose credential
 * is shared across every hospital that vendor serves, used this evening from an
 * address that is not the vendor.
 *
 * THE ONE REAL LINK IS ADMINISTRATIVE
 *
 * Two of the three threads do share a cause, and it is not an actor. The
 * appliance the ransomware came through and the analyser carrying the tunnel are
 * both vendor-managed, and both were excluded from patching and from the
 * endpoint agent estate by the same procurement exception in 2023. That is the
 * finding worth more than any individual thread, and it is invisible to anybody
 * looking for an adversary.
 *
 * EXPERT INSTRUMENTS IN USE
 *
 * The encryption start time reaches two seats through two pipelines and they
 * disagree, and which one is right decides whether the tidy story is even
 * chronologically possible. The authentication record that would name how the
 * tunnel opened is withheld: at expert the floor has a tunnel and traffic and
 * no account, and has to say out loud that something authenticated. And one
 * event genuinely cannot be settled tonight, so it scores calibration rather
 * than correctness.
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

const ID = 'three-things-at-once';

export const THREE_THINGS_AT_ONCE: Scenario = {
  id: ID,
  title: 'Three Things At Once',
  difficulty: 'expert',
  durationMinutes: 90,
  situation:
    'It is 23:55 at Ridgeline Medical Group. A ransom note appeared on a radiology file share, an ' +
    'oncology consultant working her notice period pulled four gigabytes off a research share ' +
    'earlier this evening, and a pathology analyser has been talking to an address nobody ' +
    'recognises since seven.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'forensics',
    'cloud-security',
    'threat-intel',
    'detection-engineer',
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
      summary: 'Ransom note written to the radiology file share',
      detail:
        'A file named RESTORE-YOUR-FILES.txt appeared in fourteen directories on the radiology ' +
        'file share at 23:40 and was reported by a reporting radiographer. Around 900 files on the ' +
        'share now carry a .lkrx extension and will not open. The share holds reporting drafts and ' +
        'teaching collections, not the diagnostic image archive, which is a separate system and is ' +
        'unaffected. Rule history: no ransomware rule has fired in this estate in ninety days.',
      source: 'RMG-FS-04',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'host-artefact',
      summary: 'The endpoint agent recorded encryption activity from 21:05',
      detail:
        'The endpoint agent on the file server records a process opening, reading and rewriting ' +
        'files in bulk from 21:05:12, running until 23:38, at which point it writes the note files ' +
        'and exits. Two hours and thirty-three minutes of activity. The agent did not block it: ' +
        'the process is a signed archiving utility invoked with arguments, which the behavioural ' +
        'policy on this estate does not treat as ransomware.',
      expertDetail:
        'The file share audit log records the fourteen note files being created at 23:40 and shows ' +
        'no earlier write activity of interest. The share audit subsystem samples metadata ' +
        'operations at one minute and does not record file content rewrites at all.',
      expertAlsoOn: ['alert-queue'],
      source: 'RMG-FS-04',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'process-tree',
      summary: 'The encryptor is off-the-shelf and carries an affiliate identifier',
      detail:
        'The binary is a commodity locker sold as a service, unmodified, with no packing beyond ' +
        'what ships with it and no hospital-specific configuration. The note is the vendor ' +
        'template with an affiliate identifier and a portal address substituted in. It enumerates ' +
        'shares indiscriminately and skips nothing clinical. The parent process is the management ' +
        'agent of RMG-VS-01, a vendor-managed file transfer appliance.',
      source: 'RMG-FS-04',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 480,
      surface: 'cloud-audit',
      summary: 'A consultant working her notice pulled 4.1 GB off the research share at 22:10',
      detail:
        'The e.hargate account downloaded 4.1 gigabytes from the oncology research share between ' +
        '22:04 and 22:19, comprising four dataset directories. The account holder resigned on 18 ' +
        'August with a last working day of 12 September and remains a substantive employee with ' +
        'unchanged entitlements. She is named on the ethics approval for the study and is ' +
        'corresponding author on two of the four datasets.',
      source: 'e.hargate',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 640,
      surface: 'cloud-audit',
      expertOnly: true,
      summary: 'One of the four datasets does not name her, and the terms are locked in an office',
      detail:
        'The third dataset directory, 340 megabytes, belongs to a sub-study she is not named on. ' +
        'She is a co-investigator on the parent study, which may or may not extend to it: the ' +
        'sponsor data transfer agreement governs that question and exists only as a signed paper ' +
        'copy in the research office, which opens at 09:00. Two of the six people who could answer ' +
        'from memory are on leave. Nothing in any system this floor can reach records the scope.',
      source: 'e.hargate',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 800,
      surface: 'network-flow',
      summary: 'A pathology analyser has held a connection to an unfamiliar address since 19:00',
      detail:
        'RMG-PATH-A2, a clinical chemistry analyser, opened an outbound session to 198.51.100.204 ' +
        'at 19:02 and has held it since, carrying 340 megabytes outbound and 11 megabytes inbound. ' +
        'The device has contacted three addresses in twelve months, all belonging to Belcarra ' +
        'Diagnostics, its manufacturer. 198.51.100.204 is not one of them and is not in any ' +
        'Belcarra range. The session uses the vendor remote support protocol on its documented ' +
        'port.',
      source: 'RMG-PATH-A2',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 940,
      surface: 'raw-log',
      withheldAtExpert: true,
      summary: 'The support credential authenticated from an address that is not the vendor',
      detail:
        'The analyser support log records a successful authentication at 19:01:47 using the account ' +
        'BELCARRA-SVC from 198.51.100.204. The credential is the vendor standard support account, ' +
        'documented in the installation manual, and is identical across every Belcarra installation ' +
        'in the country. It has never been changed on this device and cannot be changed without ' +
        'voiding the maintenance contract.',
      source: 'RMG-PATH-A2',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1100,
      surface: 'alert-queue',
      summary: 'Both devices sit under the same 2023 procurement exception',
      detail:
        'RMG-VS-01, the appliance the encryptor ran from, and RMG-PATH-A2 are both vendor-managed. ' +
        'Both are excluded from the patching programme and from the endpoint agent estate under ' +
        'exception RMG-EX-0031, granted in 2023 on the basis that vendor support contracts prohibit ' +
        'customer-installed software. RMG-VS-01 is running firmware from March 2024 with four ' +
        'published remote code execution issues. Forty-one devices sit under the same exception.',
      source: 'asset governance',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1260,
      surface: 'alert-queue',
      summary: 'The ransom note claims data was exfiltrated',
      detail:
        'The note reads, in the vendor template wording, that sensitive patient and research data ' +
        'has been copied and will be published unless payment is made within seventy-two hours. ' +
        'The same wording appears in every published sample of this locker family going back ' +
        'eighteen months. The affiliate portal address in the note is live and generic. No ' +
        'outbound transfer of any size has been observed from RMG-FS-04 or RMG-VS-01 this evening.',
      source: 'RESTORE-YOUR-FILES.txt',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.10',
      atSeconds: 1420,
      surface: 'alert-queue',
      summary: 'RMG-PATH-A2 is the only chemistry analyser running tonight',
      detail:
        'The second chemistry analyser is down for a calibration fault booked for Thursday. ' +
        'RMG-PATH-A2 is processing urgent bloods for the emergency department, two theatres and ' +
        'the neonatal unit. Taking it off the network stops results reaching the clinical systems ' +
        'and reverts the laboratory to manual telephone reporting, which the laboratory manager ' +
        'estimates at forty minutes per urgent sample against four. The nearest alternative ' +
        'laboratory is fifty minutes away by road.',
      source: 'pathology',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.11',
      atSeconds: 1580,
      surface: 'raw-log',
      summary: 'Nothing watches the forty-one excluded devices',
      detail:
        'None of the forty-one devices under RMG-EX-0031 runs an endpoint agent, forwards logs, or ' +
        'appears in the vulnerability scanning scope. They are visible to the network only as flow ' +
        'records. The analyser session was not alerted on because no baseline exists for these ' +
        'devices, and the file transfer appliance did not report the encryptor because it has no ' +
        'agent to report with. The estate holds 3,900 agented endpoints and these forty-one.',
      source: 'detection coverage',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.12',
      atSeconds: 1740,
      surface: 'alert-queue',
      summary: 'A second share is reported as encrypted',
      detail:
        'The pharmacy share is reported at 23:52 as containing hundreds of unopenable files with a ' +
        '.enc extension. The files date from 01:30 every night for the last eleven months, arrive ' +
        'at a rate of about 400 a night, and sit in a directory named archive-out. The pharmacy ' +
        'stock system writes an encrypted nightly export there for its supplier under a contract ' +
        'dated 2025. No note file exists on that share.',
      source: 'RMG-FS-07',
      claimedSeverity: 'high',
    },
  ],
};

export const THREE_THINGS_AT_ONCE_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Three unrelated things happened at Ridgeline on one evening, and the story that ties them together is wrong in every particular.',
    'A commodity ransomware affiliate reached RMG-VS-01, a vendor-managed file transfer appliance running March 2024 firmware with four published remote code execution issues, and ran an off-the-shelf locker from it. Encryption of the radiology share began at 21:05 and ran until 23:38, when the note files were written and the process exited. Around 900 files are affected. The note claims exfiltration in the same template wording every sample of this family has used for eighteen months, and nothing left either host.',
    'Separately, at 22:04, an oncology consultant working her notice period downloaded 4.1 gigabytes from the research share. She is named on the ethics approval and is corresponding author on two of the four datasets. A third dataset, 340 megabytes, belongs to a sub-study she is not named on, and whether her co-investigator status on the parent study covers it is governed by a paper agreement in an office that opens at 09:00.',
    'Separately again, at 19:01, somebody authenticated to a clinical chemistry analyser using BELCARRA-SVC, the vendor standard support account documented in the installation manual and identical across every Belcarra installation in the country, from 198.51.100.204, which is not a vendor address. The session has been open since and has carried 340 megabytes outbound.',
    'That analyser session is the actual compromise and it is the quietest row on the board.',
    'The real link between two of the threads is not an actor. RMG-VS-01 and RMG-PATH-A2 are both excluded from patching and from the endpoint agent estate under procurement exception RMG-EX-0031, granted in 2023 because vendor contracts prohibit customer-installed software. Forty-one devices sit under it and nothing watches any of them.',
    'The order of events makes the tidy story impossible: encryption started at 21:05, an hour before the consultant downloaded anything.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'execution',
      techniques: ['T1486'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'malware-analyst'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.power-off', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'malware-analyst'],
      why:
        'Real, and loud, and the loudest thing on a board is rarely the most important thing on ' +
        'it. Nine hundred files on a radiology share holding reporting drafts and teaching ' +
        'collections, with the diagnostic archive on a separate system and untouched, so the ' +
        'clinical impact is real and bounded. Declare on it, because nine hundred encrypted files ' +
        'in a hospital is an incident whatever else is true. Then do the harder thing, which is to ' +
        'keep the other two threads staffed. A ransom note pulls every seat toward it by ' +
        'construction, that is what it is for, and tonight two other things are happening that ' +
        'nobody has looked at.',
      standIn:
        'Ransom note on the radiology share, around nine hundred files, reporting drafts and ' +
        'teaching material. The diagnostic archive is a separate system and is clean. Declaring on ' +
        'it. And I want people staying on the other two things, because a note like this pulls the ' +
        'whole floor onto one row and that is exactly what it is for.',
      commandOptions: [
        { command: "find /mnt/fs04 -name '*.lkrx' -newermt '2026-08-31' | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$4 ~ /lkrx|RESTORE/ {print $1, $3}' /var/log/fileshare/audit.csv | head -30", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status smbd', ...STATUS_CHECK },
        { command: 'cat /mnt/fs04/RESTORE-YOUR-FILES.txt', ...DUMP_ALL },
        { command: 'rm /mnt/fs04/RESTORE-YOUR-FILES.txt', ...MUTATE },
      ],
      commandNudge:
        'Establish what is actually encrypted and what is on a different system before you size ' +
        'this.',
      guidance:
        'Find out what lives on that share before you decide how bad it is.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'execution',
      critical: true,
      techniques: ['T1486'],
      firstResponder: 'forensics',
      alsoAppropriate: ['malware-analyst', 'log-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain', 'act.timeline'],
      outOfLaneActions: ['act.power-off', 'act.reimage-now', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'Two seats are looking at the same evening and they do not agree, and this is the row the ' +
        'scenario turns on. The endpoint agent watched a process read and rewrite files in bulk ' +
        'from 21:05:12 until 23:38 and then write the notes. The share audit log has nothing before ' +
        '23:40, which is not a contradiction once you ask what each source can see: the share ' +
        'audit samples metadata operations at one minute and does not record content rewrites at ' +
        'all, so 23:40 is when the notes were created and not when anything began. The weaker ' +
        'source is the one reporting later. Averaging them, or taking the queue timestamp because ' +
        'it is the one on the alert, gets the whole night wrong, because 21:05 is an hour before ' +
        'the consultant downloaded anything and the tidy story requires the theft to come first. ' +
        'It is also worth stating plainly that the agent saw all of this and did not stop it: a ' +
        'signed archiving utility invoked with arguments is not what the behavioural policy calls ' +
        'ransomware.',
      standIn:
        'Our two sources disagree and one of them is wrong. The agent has a process reading and ' +
        'rewriting in bulk from 21:05:12 through to 23:38 and then writing the notes. The share ' +
        'audit has nothing before 23:40, because it samples metadata at a minute and does not ' +
        'record content rewrites at all, so 23:40 is when the notes landed, not when this started. ' +
        'Take 21:05. That is an hour before the download, which means the story people are ' +
        'building in their heads cannot be true. And the agent watched all of it: a signed ' +
        'archiver with arguments is not ransomware as far as our policy is concerned.',
      commandOptions: [
        { command: "awk -F'|' '$3==\"FILE_WRITE\" {print $1}' /evidence/fs04/agent-telemetry.csv | head -5", correct: true, teaches: CORRECT_STEP },
        { command: 'sha256sum /evidence/fs04/agent-telemetry.csv | tee /evidence/fs04/agent-telemetry.sha256', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status edr-agent', ...STATUS_CHECK },
        { command: 'cat /evidence/fs04/agent-telemetry.csv', ...DUMP_ALL },
        { command: 'grep -c FILE_WRITE /evidence/fs04/agent-telemetry.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Two sources give two start times. Find out what each one is capable of recording before ' +
        'you pick.',
      guidance:
        'When two logs disagree, ask which one is physically able to see the thing in question.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'execution',
      techniques: ['T1486', 'T1190'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['threat-intel', 'forensics', 'ir-lead'],
      correctActions: ['act.decode', 'act.ttp-map'],
      outOfLaneActions: ['act.sandbox', 'act.attribute-named', 'act.contact-attacker', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'Everything about this binary says nobody chose this hospital. It is a commodity locker ' +
        'sold as a service, unmodified, with no packing beyond what ships with it, no ' +
        'hospital-specific configuration, and a note that is the vendor template with an affiliate ' +
        'identifier dropped in. It enumerates shares indiscriminately and skips nothing clinical, ' +
        'which a targeted actor in a hospital does not do because the archive is the leverage. A ' +
        'sophisticated insider running cover would have had to buy an unsophisticated product and ' +
        'then use it carelessly, which is possible and is not what this looks like. The finding ' +
        'that matters more is one field: the parent process is the management agent of RMG-VS-01, ' +
        'a vendor-managed appliance. That is the entry point and it is a different question from ' +
        'the encryption, and it is the one worth handing on.',
      standIn:
        'Nobody chose us. It is a commodity locker sold as a service, unmodified, no packing beyond ' +
        'stock, no configuration for this estate, and the note is the vendor template with an ' +
        'affiliate ID pasted in. It enumerated shares indiscriminately and skipped nothing ' +
        'clinical, which a targeted actor in a hospital does not do. The bit that matters is the ' +
        'parent process: it ran from the management agent on RMG-VS-01, a vendor-managed ' +
        'appliance. That is how they got in and that is the question to chase.',
      commandOptions: [
        { command: 'ps -ef --forest | grep -B3 lkrx', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F'|' '$3==\"PROCESS_START\" {print $1, $4, $5}' /evidence/fs04/agent-telemetry.csv", correct: true, teaches: ALSO_WORKS },
        { command: 'curl -s http://203.0.113.201/portal', ...TOUCH_ATTACKER },
        { command: 'cat /evidence/fs04/agent-telemetry.csv', ...DUMP_ALL },
        { command: 'grep -c lkrx /evidence/fs04/agent-telemetry.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find what started the encryptor, not just what it did.',
      guidance:
        'Something launched this. Ask what, and where that thing lives.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      firstResponder: 'cloud-security',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.investigate-hold'],
      outOfLaneActions: ['act.revoke-key', 'act.attribute-named', 'act.reset-password', 'act.declare'],
      escalateTo: ['ir-lead'],
      why:
        'Four gigabytes, a resignation, a notice period and a ransom note on the same evening, and ' +
        'the reflex this produces is the reason the scenario exists. Take the facts in the order ' +
        'they can be checked. She is a substantive employee with unchanged entitlements ' +
        'downloading from a share she is entitled to. She is named on the ethics approval for the ' +
        'study. She is corresponding author on two of the four datasets, which means that for half ' +
        'of what moved she is the person whose work it is. And the timing that seems damning ' +
        'points the other way once ev.2 is settled: the encryption started at 21:05 and she ' +
        'downloaded at 22:04, so she cannot have taken data and then covered it. Hold it open, ' +
        'audit the entitlements, and do not revoke anything: cutting a consultant off her own ' +
        'research at midnight on a suspicion the evidence does not support is a decision that ' +
        'cannot be taken back in the morning.',
      standIn:
        'This is the one everybody wants to be the answer. Substantive employee, unchanged ' +
        'entitlements, downloading from a share she is entitled to, named on the ethics approval, ' +
        'corresponding author on two of the four datasets. And the timing runs the wrong way for ' +
        'the story: encryption started at 21:05 and she downloaded at 22:04, so she did not take ' +
        'anything and then cover it. Holding it open, auditing entitlements, revoking nothing.',
      commandOptions: [
        { command: "awk -F, '$2==\"e.hargate\" && $3==\"DOWNLOAD\" {print $1, $5, $6}' /var/log/research/access.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i hargate /var/log/research/ethics-approvals.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status research-share', ...STATUS_CHECK },
        { command: 'cat /var/log/research/access.csv', ...DUMP_ALL },
        { command: 'net user e.hargate /active:no /domain', ...MUTATE },
      ],
      commandNudge:
        'Find out what she is entitled to and named on before you decide what the download was.',
      guidance:
        'A resignation is not evidence. Ask whether she was allowed to have this.',
    },
    {
      eventId: 'ev.5',
      verdict: 'ambiguous',
      leaning: 'benign',
      wouldSettleIt:
        'The signed sponsor data transfer agreement for the sub-study, which states whether ' +
        'co-investigator status on the parent study extends to it. It exists only on paper in the ' +
        'research office and cannot be read before 09:00.',
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.investigate-hold', 'act.iam-audit'],
      outOfLaneActions: ['act.revoke-key', 'act.attribute-named', 'act.reset-password', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'Three hundred and forty megabytes that genuinely cannot be resolved tonight, and the ' +
        'grading here is on how confidently the claim is made rather than which way it goes. The ' +
        'facts stop cleanly: she is a co-investigator on the parent study, the dataset belongs to ' +
        'a sub-study she is not named on, and whether the first covers the second is a question of ' +
        'contract law answered by a signed paper agreement in a locked office, with two of the six ' +
        'people who might know from memory on leave. Nothing in any system reachable from this ' +
        'floor records the scope, so neither reading can be pushed above roughly even. The ' +
        'answer that scores is a disposition with a number attached and the specific document ' +
        'named: escalating at around half, resolvable at nine in the morning by one piece of ' +
        'paper. Certainty in either direction is the failure, and certainty toward theft is the ' +
        'more expensive one, because it is the version that gets said out loud to somebody senior ' +
        'about a named clinician on the strength of a directory listing.',
      standIn:
        'One of the four I cannot settle and I am not going to pretend otherwise. Three hundred and ' +
        'forty megabytes from a sub-study she is not named on, and she is a co-investigator on the ' +
        'parent study, which may or may not cover it. That is a contract question and the contract ' +
        'is a signed paper copy in the research office until nine, and two of the six people who ' +
        'might remember are on leave. Call it about even, leaning that it is in scope. One ' +
        'document settles it in the morning and nothing we hold settles it now.',
      commandNudge:
        'Establish which of the four datasets she is actually named on, then find out where the ' +
        'answer for the fourth one lives.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'command-and-control',
      critical: true,
      techniques: ['T1219', 'T1041'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.isolate', 'act.dismiss', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'The smallest row on the board and the actual incident. A clinical chemistry analyser that ' +
        'has contacted three addresses in twelve months, all belonging to its manufacturer, opened ' +
        'a session at 19:02 to an address in none of the manufacturer ranges and has held it for ' +
        'five hours carrying 340 megabytes outbound. The asymmetry is the finding: 340 out against ' +
        '11 in is not a support engineer looking at a fault, it is a device sending. And the ' +
        'baseline is unusually strong evidence here precisely because the device is boring. A ' +
        'general purpose server talks to hundreds of places and an anomaly means little; a machine ' +
        'that has spoken to three addresses in a year and now speaks to a fourth has effectively ' +
        'no innocent explanation. Note also that it started at 19:02, which is two hours before ' +
        'the encryption and three before the download, so it is the first thing that happened ' +
        'tonight and it is the last thing anybody looked at.',
      standIn:
        'This is the one. Three addresses in twelve months, all Belcarra, and at 19:02 it opens a ' +
        'session to something in none of their ranges and holds it for five hours. Three hundred ' +
        'and forty megabytes out against eleven in, so it is sending, not being supported. On a ' +
        'device this boring a new destination has almost no innocent reading. And it started at ' +
        '19:02, before the encryption and before the download. It is the first thing that happened ' +
        'tonight and the last thing we looked at.',
      commandOptions: [
        { command: "awk '$3==\"RMG-PATH-A2\" {print $5}' /var/log/flows-12mo.log | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$5==\"198.51.100.204\" {print $1, $7, $8}' /var/log/flows.log | tail", correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -sT 198.51.100.204', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'netstat -an | grep ESTABLISHED', ...WRONG_TARGET },
      ],
      commandNudge:
        'Find every address this device has ever talked to, then see whether tonight is on the ' +
        'list.',
      guidance:
        'Ask what normal looks like for a machine that only ever talks to its manufacturer.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1078.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'cloud-security', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.reset-password', 'act.dismiss', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'How the tunnel opened, and at expert nobody gets to see it. The support log records ' +
        'BELCARRA-SVC authenticating successfully at 19:01:47 from 198.51.100.204: the vendor ' +
        'standard support account, printed in the installation manual, identical across every ' +
        'Belcarra installation in the country, never changed on this device and unchangeable ' +
        'without voiding the maintenance contract. Where this record is absent the floor still has ' +
        'to reach the same place, because a session does not open by itself and a device that ' +
        'accepts a remote support connection accepted a credential. Saying that out loud, and ' +
        'stating that the credential is almost certainly the documented vendor account rather than ' +
        'anything specific to this hospital, is the finding even with no log to point at. It also ' +
        'reframes the incident: nothing here was stolen from Ridgeline, so rotating passwords ' +
        'across the estate accomplishes nothing, and every other Belcarra customer in the country ' +
        'has the same exposure tonight.',
      standIn:
        'BELCARRA-SVC authenticated at 19:01:47 from that address. It is the vendor standard ' +
        'support account, it is printed in the installation manual, it is the same on every ' +
        'Belcarra box in the country, it has never been changed here, and changing it voids the ' +
        'maintenance contract. So nothing was stolen from us and rotating our passwords does ' +
        'nothing. Every other hospital running these has the same problem tonight.',
      commandOptions: [
        { command: "awk -F, '$3==\"AUTH_OK\" {print $1, $4, $5}' /var/log/path-a2/support.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "BELCARRA-SVC" /var/log/path-a2/support.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status path-analyser', ...STATUS_CHECK },
        { command: 'cat /var/log/path-a2/support.csv', ...DUMP_ALL },
        { command: 'grep -c AUTH /var/log/path-a2/support.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'A remote support session opened. Find out what account opened it.',
      guidance:
        'Sessions do not open themselves. Ask what authenticated.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1190'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['ir-lead', 'vulnerability-analyst'],
      correctActions: ['act.corroborate', 'act.scope-estate'],
      outOfLaneActions: ['act.attribute-named', 'act.isolate', 'act.dismiss', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'There is a real link between two of the threads and it is not an actor, which is the ' +
        'hardest thing on this board to see because everybody has spent the night looking for a ' +
        'person. The appliance the encryptor ran from and the analyser carrying the tunnel are ' +
        'both vendor-managed, and both are excluded from patching and from the endpoint agent ' +
        'estate under the same 2023 exception, granted because vendor contracts prohibit ' +
        'customer-installed software. RMG-VS-01 has been running firmware from March 2024 with ' +
        'four published remote code execution issues for the whole of this year. Two independent ' +
        'attackers found the same organisation on the same evening not because they were working ' +
        'together but because the organisation left forty-one doors unpatched and unwatched, and ' +
        'the finding is worth more than either intrusion: the other thirty-nine are in the same ' +
        'state right now. State it carefully in the readout, because the seductive version of this ' +
        'sentence is that the two incidents are connected, and they are connected only in the ' +
        'sense that both walked through a door the same signature held open.',
      standIn:
        'There is a link and it is not a person. The appliance the encryptor ran from and the ' +
        'analyser are both vendor-managed and both excluded from patching and from the agent ' +
        'estate under the same 2023 exception, because vendor contracts forbid customer-installed ' +
        'software. VS-01 has been on March 2024 firmware with four published RCEs all year. Two ' +
        'separate attackers found us the same evening because we left forty-one doors unpatched ' +
        'and unwatched, and thirty-nine of them are still like that. That is worth more than ' +
        'either intrusion.',
      commandNudge:
        'Find out what the two compromised devices have in common administratively, and how many ' +
        'others share it.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'execution',
      techniques: ['T1486', 'T1657'],
      appearsToBe:
        'Confirmation that the consultant download was the exfiltration leg of the ransomware ' +
        'incident. The note claims data was copied, 4.1 GB left a research share an hour later, ' +
        'and the two read as one operation. The wording is boilerplate that has shipped with every ' +
        'sample of this family for eighteen months, and no transfer of any size left either host.',
      firstResponder: 'threat-intel',
      alsoAppropriate: ['malware-analyst', 'ir-lead'],
      correctActions: ['act.ttp-map', 'act.assess-actor'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.notify-legal', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The most dangerous sentence tonight was written by a template author eighteen months ago ' +
        'and is not about Ridgeline at all. The note says sensitive patient and research data has ' +
        'been copied and will be published, four gigabytes came off a research share an hour ' +
        'later, and the two facts fuse into a single conclusion before anybody has decided to draw ' +
        'it. Two checks separate them and both are quick. The wording is identical in every ' +
        'published sample of this family going back eighteen months, so it is a claim the product ' +
        'makes, not a claim this affiliate made about this hospital. And no outbound transfer of ' +
        'any size left RMG-FS-04 or RMG-VS-01 this evening, so whatever was copied was not copied ' +
        'from where the encryption happened. Say both in the readout, because the alternative is ' +
        'that a regulator is told patient data has been published on the strength of a sentence ' +
        'that ships in the box. Assess the actor as a commodity affiliate and put a confidence on ' +
        'it, and do not name a group: an affiliate identifier identifies a customer of a service, ' +
        'not the person at the keyboard.',
      standIn:
        'Do not let the note write our incident for us. It claims patient and research data has ' +
        'been copied, four gigabytes left a research share an hour later, and everybody is going ' +
        'to join those up. The wording is in every published sample of this family for eighteen ' +
        'months, so it is a claim the product makes and not a claim about us, and nothing of any ' +
        'size left either host this evening. Commodity affiliate, moderate confidence, and I am ' +
        'not naming a group off an affiliate ID.',
      commandOptions: [
        { command: "awk '$3==\"RMG-FS-04\" || $3==\"RMG-VS-01\" {s+=$8} END {print s}' /var/log/flows.log", correct: true, teaches: CORRECT_STEP },
        { command: 'sha256sum /mnt/fs04/RESTORE-YOUR-FILES.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'curl -s http://203.0.113.201/portal', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'grep -c RMG-FS-04 /var/log/flows.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'The note says data was taken. Check whether anything actually left those hosts.',
      guidance:
        'Ask whether the note is telling you about this hospital or about the product.',
    },
    {
      eventId: 'ev.10',
      verdict: 'malicious',
      stage: 'command-and-control',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.power-off', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'The only live channel in the building runs through the only working chemistry analyser, ' +
        'and pulling its cable is a clinical decision wearing a technical costume. It is ' +
        'processing urgent bloods for the emergency department, two theatres and the neonatal ' +
        'unit, the second analyser is down until Thursday, manual telephone reporting takes forty ' +
        'minutes a sample against four, and the nearest alternative laboratory is fifty minutes ' +
        'away. Isolation is available and it is not this floor call to take alone, and the person ' +
        'who has to agree it is the on-call consultant in pathology. What can be done without ' +
        'anybody agreeing anything is narrower and stops the bleeding tonight: block outbound to ' +
        '198.51.100.204 at the perimeter, which kills the session and leaves the analyser on the ' +
        'network doing bloods, because the device needs the laboratory network and does not need ' +
        'the internet. Check the rollback and check that the results path to the clinical systems ' +
        'does not traverse anything in that block, and watch for the session reopening to a second ' +
        'address, which is what the block will tell you if it happens. Deliberately left undone: ' +
        'the analyser stays online, the credential cannot be changed without voiding the ' +
        'maintenance contract, and that is a decision for somebody who can sign a contract ' +
        'variation, not for tonight.',
      standIn:
        'Nobody pulls that cable on my say-so. It is the only working chemistry analyser, it is ' +
        'doing urgent bloods for ED, two theatres and neonates, the spare is down until Thursday, ' +
        'and manual reporting is forty minutes a sample against four. Narrower move that works ' +
        'now: block outbound to that address at the perimeter. Session dies, analyser stays on the ' +
        'lab network doing bloods. It needs the lab, it does not need the internet. I want the ' +
        'rollback written, I want confirmation the results path does not cross that block, and I ' +
        'want somebody watching for it reopening somewhere else. Left undone: the credential ' +
        'itself, because changing it voids the maintenance contract and that needs a signature I ' +
        'do not have at midnight.',
      commandNudge:
        'Find out what that device actually needs to reach in order to do its job.',
    },
    {
      eventId: 'ev.11',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1562.001'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Nothing failed tonight, which is the uncomfortable version of the story. There was never ' +
        'anything on either compromised device to fail: no agent, no log forwarding, no ' +
        'vulnerability scanning, forty-one devices visible to the network only as flow records. So ' +
        'the proposal is not a detection for ransomware or for remote support abuse, both of which ' +
        'would be written against telemetry that does not exist. It is that flow records are the ' +
        'only signal these devices produce and flow records are enough, because these are the ' +
        'easiest machines in the estate to baseline: an analyser that has contacted three ' +
        'addresses in twelve months is a rule that writes itself, and a first-contact alert across ' +
        'all forty-one is close to silent by construction. Backtest it over the year before ' +
        'promising that, and put the honest sentence in the readout as well. A control that ' +
        'watches from the outside is a compensating control for an exception that should not have ' +
        'been granted, and proposing it must not be allowed to make the exception look survivable.',
      standIn:
        'Nothing failed, because there was nothing there to fail. No agent, no log forwarding, no ' +
        'scanning, forty-one devices that exist to us only as flow records. So I am not proposing a ' +
        'ransomware rule or a remote support rule, because both need telemetry we do not have. ' +
        'Flows are all these devices produce and flows are enough: this analyser has contacted ' +
        'three addresses in twelve months, so first-contact alerting across all forty-one is ' +
        'nearly silent. I will backtest it over the year. And I want it minuted that this is a ' +
        'compensating control for an exception that should not exist, not a reason the exception ' +
        'is fine.',
      commandOptions: [
        { command: "awk '$3 ~ /RMG-(PATH|VS|MED)/ {print $3, $5}' /var/log/flows-12mo.log | sort -u | awk '{c[$1]++} END {for (d in c) print c[d], d}'", correct: true, teaches: CORRECT_STEP },
        { command: 'comm -23 /evidence/asset/all-devices.txt /evidence/asset/agented-devices.txt | wc -l', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /var/log/flows-12mo.log', ...DUMP_ALL },
        { command: 'grep -c RMG-PATH /var/log/flows-12mo.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find out what telemetry those forty-one devices actually produce before you propose a rule ' +
        'that reads something else.',
      guidance:
        'Ask what these devices can tell you at all. Then build on only that.',
    },
    {
      eventId: 'ev.12',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.declare', 'act.isolate', 'act.power-off'],
      escalateTo: [],
      why:
        'Hundreds of unopenable files with an encrypted extension, reported twelve minutes after a ' +
        'genuine ransomware incident, and it is the pharmacy stock system writing its nightly ' +
        'export. Three checks close it and each is quicker than the last. The files date from ' +
        '01:30 every night for eleven months, so they predate everything tonight by most of a ' +
        'year. They arrive at a steady four hundred a night rather than nine hundred in one burst. ' +
        'And there is no note, which is the tell that costs nothing to check, because encrypting ' +
        'files without asking for money is not a business model. This row is here because the ' +
        'expensive failure in a real ransomware night is not missing something, it is declaring the ' +
        'second and third and fourth thing as spread and taking half the estate off the network on ' +
        'the strength of a file extension. Somebody has to be willing to close a share report ' +
        'during a ransomware incident, and doing it on evidence rather than on nerve is the skill.',
      standIn:
        'Pharmacy share is fine. Files date from 01:30 every night for eleven months, four hundred ' +
        'a night steady rather than nine hundred in a burst, in a directory called archive-out, ' +
        'and it is the stock system nightly export to the supplier under a 2025 contract. And ' +
        'there is no note, which is the free check: nobody encrypts files without asking for ' +
        'money. Closing it. Somebody has to be willing to close one of these tonight.',
      commandOptions: [
        { command: "find /mnt/fs07/archive-out -name '*.enc' -printf '%TY-%Tm-%Td\\n' | sort | uniq -c | head", correct: true, teaches: CORRECT_STEP },
        { command: "find /mnt/fs07 -name 'RESTORE*' -o -name '*READ*ME*'", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status smbd', ...STATUS_CHECK },
        { command: 'cat /mnt/fs07/archive-out/manifest.log', ...DUMP_ALL },
        { command: 'rm -rf /mnt/fs07/archive-out', ...MUTATE },
      ],
      commandNudge:
        'Check how old the oldest of those files is, and whether there is a note.',
      guidance:
        'Encrypted files with nobody asking for money is not ransomware. Check the dates.',
    },
  ],
};
