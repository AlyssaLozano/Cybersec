/**
 * Scenario 26: Nothing Left.
 *
 * Destruction dressed as ransomware, with no intention of taking payment.
 *
 * WHAT THIS TEACHES
 *
 * That the response to an incident depends on what the attacker WANTS, and that
 * a floor which assumes motive from appearance will prepare for the wrong hour.
 *
 * Everything on this board says ransomware: encrypted files, a ransom note, a
 * payment address, a countdown. A floor that reads it as ransomware will spend
 * the hour on recovery arithmetic, insurance and whether to negotiate. All of
 * that is wasted, because the key was never kept. The encryption is one-way and
 * no payment recovers anything.
 *
 * The tells are small, specific, and technical: a key generated per file and
 * never stored, a note that is identical across every victim with no unique
 * identifier, and a payment address with no transaction history. Any one is
 * arguable. Together they mean this is a wiper wearing a ransom note, and the
 * only thing that matters in the remaining hour is what has not been destroyed
 * yet.
 *
 * WHY THAT CHANGES EVERYTHING
 *
 * Ransomware gives you a bad choice. A wiper gives you a clock. If recovery is
 * impossible for what is already gone, then every minute belongs to the systems
 * still running, and the correct call is aggressive containment that a
 * ransomware response would have weighed more carefully.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';
import {
  COUNT_ONLY,
  CORRECT_STEP,
  DUMP_ALL,
  MUTATE,
  STATUS_CHECK,
  TOUCH_ATTACKER,
  WRONG_TARGET,
} from './distractors.js';

const ID = 'nothing-left';

export const NOTHING_LEFT: Scenario = {
  id: ID,
  title: 'Nothing Left',
  difficulty: 'advanced',
  durationMinutes: 60,
  situation:
    'It is 04:50. Files are being encrypted across the finance and HR file servers and a ransom ' +
    'note has appeared in every affected directory. Forty percent of the estate is still ' +
    'untouched. Work out what you are actually dealing with before you decide what to do.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
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
      summary: 'Mass file modification across two file servers with a ransom note in every directory',
      detail:
        'File integrity monitoring reports 214,000 files modified on rmg-fs-02 and rmg-fs-03 since ' +
        '04:31. Each affected directory contains a text file demanding payment in cryptocurrency ' +
        'for a decryption key, with a 72 hour countdown. Encryption is ongoing. Rule history: this ' +
        'rule has never fired before.',
      source: 'rmg-fs-02, rmg-fs-03',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 110,
      surface: 'process-tree',
      summary: 'The encrypting process generates a key per file and never writes one out',
      detail:
        'The running binary derives a fresh key for each file from a system entropy source, uses ' +
        'it, and frees the memory. No key material is written to disk, transmitted over the ' +
        'network, or stored anywhere on the host. Sandbox execution of a copy shows the same ' +
        'behaviour with no outbound connection of any kind.',
      source: 'rmg-fs-02',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 260,
      surface: 'host-artefact',
      summary: 'The ransom note is byte identical everywhere and carries no victim identifier',
      detail:
        'All 4,100 copies of the note across both servers have the same hash. Ransomware notes ' +
        'normally carry a per-victim identifier so the operator can match a payment to a key. This ' +
        'one has no identifier, no contact address beyond a generic mailbox, and no portal link. ' +
        'The wallet address in it appears in no public transaction and has never received funds.',
      source: 'rmg-fs-02',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 420,
      surface: 'network-flow',
      summary: 'No outbound connection from either server since the encryption began',
      detail:
        'Flow records show no traffic from rmg-fs-02 or rmg-fs-03 to any external address since ' +
        '04:20. Ransomware operators almost always establish a channel to receive keys, confirm ' +
        'infection or negotiate. Both servers have working internet egress and are using none of ' +
        'it.',
      source: 'rmg-fs-02, rmg-fs-03',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.5',
      atSeconds: 560,
      surface: 'raw-log',
      summary: 'Deployment came through the software distribution system at 04:28',
      detail:
        'The binary was pushed to both servers by the estate software distribution platform under a ' +
        'package named as a security patch, scheduled by an administrator account at 04:22 and ' +
        'executed at 04:28. The same package is queued for eleven more servers, with the next ' +
        'execution window at 05:15.',
      source: 'software distribution',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 700,
      surface: 'cloud-audit',
      summary: 'Backup vault credentials were used at 04:19 to list, and not to delete',
      detail:
        'The backup service principal enumerated every restore point across the vault at 04:19, ' +
        'nine minutes before the deployment, from an internal address. Nothing was deleted and ' +
        'nothing was modified. All restore points are intact and the retention lock is still in ' +
        'place.',
      source: 'backup vault',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 860,
      surface: 'alert-queue',
      summary: 'Antivirus quarantined 40 files on unrelated workstations overnight',
      detail:
        'Endpoint protection quarantined 40 files across nine workstations between 22:00 and 04:00, ' +
        'all identified as adware bundled with a browser extension the marketing team installed ' +
        'last week. There is a helpdesk ticket. Rule history: fired 88 times in thirty days, 86 ' +
        'closed as bundled adware.',
      source: 'endpoint protection',
      claimedSeverity: 'medium',
    },
  ],
};

export const NOTHING_LEFT_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Somebody with an administrator account on the software distribution platform scheduled a package named as a security patch.',
    'At 04:19 they used the backup credentials to list every restore point, which told them what would survive. They deleted nothing, because deletion alerts and listing does not.',
    'At 04:28 the package executed on two file servers and began encrypting.',
    'The binary generates a key per file from system entropy, uses it, and frees it. Nothing is written out and nothing leaves the host.',
    'The ransom note is identical on every server, carries no victim identifier, and names a wallet that has never received a payment.',
    'There is no key to buy. This is destruction with a ransom note on it, and the note exists to send the response down a path that wastes the hour.',
    'The same package is queued for eleven more servers with an execution window at 05:15, and the backups are intact.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1486', 'T1485'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.reimage-now', 'act.power-off'],
      escalateTo: ['ir-lead', 'malware-analyst'],
      why:
        'Nothing subtle and nothing to debate: 214,000 files, a note in every directory, encryption ' +
        'still running. Raise it and declare immediately. The one thing worth carrying forward is ' +
        'that forty percent of the estate is untouched, because that is where the remaining hour ' +
        'will be spent once somebody works out what this actually is. Reaching for a rebuild at ' +
        'this point is out of lane and premature: nobody yet knows how it arrived, and rebuilding ' +
        'from a distribution platform that is pushing the payload puts it straight back.',
      standIn:
        '214,000 files modified across two file servers since 04:31, ransom note in every directory, ' +
        'encryption still running. Declaring. Forty percent of the estate has not been touched.',
      commandOptions: [
        { command: 'ls -la /mnt/finance/ | head -20', correct: true, teaches: CORRECT_STEP },
        { command: 'systemctl status file-integrity', ...STATUS_CHECK },
        { command: 'cat /var/log/fim/events.log', ...DUMP_ALL },
        { command: 'grep -c MODIFIED /var/log/fim/events.log', ...COUNT_ONLY },
        { command: 'rm /mnt/finance/READ_ME.txt', ...MUTATE },
      ],
      commandNudge: 'Look at what has actually happened to the files, and what is still untouched.',
      guidance:
        'This one is not a judgement call. Raise it, declare it, and find out how much of the ' +
        'estate is still fine.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'impact',
      critical: true,
      techniques: ['T1485', 'T1486'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.decode', 'act.sandbox'],
      outOfLaneActions: ['act.contact-attacker', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'The finding that decides the hour, and it is a technical detail nobody would look for ' +
        'unless they thought to ask how the decryption is supposed to work. A key per file, derived ' +
        'from system entropy, used and freed, with nothing written out and nothing transmitted. ' +
        'That is not an encryption scheme with a recovery path, it is a shredder. Ransomware has to ' +
        'keep the keys somewhere, because an operator who cannot decrypt after payment stops getting ' +
        'paid. This one kept nothing, so there is nothing to buy. The moment that lands, the ' +
        'question stops being how much to pay and becomes what is left.',
      standIn:
        'The binary generates a key per file from system entropy, uses it and frees it. Nothing is ' +
        'written to disk, nothing goes over the network, and the sandbox copy makes no outbound ' +
        'connection at all. There is no key anywhere. This does not decrypt, whatever the note says.',
      commandOptions: [
        { command: 'strace -f -e trace=openat,write -p $(pgrep -f patchsvc) 2>&1 | head -40', correct: true, teaches: CORRECT_STEP },
        { command: 'systemctl status patchsvc', ...STATUS_CHECK },
        { command: 'cat /var/log/syslog', ...DUMP_ALL },
        { command: 'kill -9 $(pgrep -f patchsvc)', ...MUTATE },
        { command: 'curl -s http://203.0.113.180/key', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Work out where the encryption key goes after it is used. Recovery depends on it existing ' +
        'somewhere.',
      guidance:
        'Ask how the decryption is meant to work. If nobody kept a key, the note is not an offer.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1491.001'],
      firstResponder: 'forensics',
      alsoAppropriate: ['malware-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.reimage-now'],
      escalateTo: ['ir-lead'],
      appearsToBe:
        'A conventional ransomware operation, on the strength of a professionally worded note, a ' +
        'countdown and a payment address.',
      why:
        'Three details, each individually explainable and jointly conclusive. An identical hash ' +
        'across 4,100 copies with no per-victim identifier means the operator has no way to match ' +
        'a payment to a victim, which is the one thing a real extortion scheme cannot do without. ' +
        'A generic mailbox and no portal means no infrastructure was built for negotiation. And a ' +
        'wallet with no transaction history has never been paid by anybody, which for an active ' +
        'operation is close to impossible. This is a note written to be believed for long enough ' +
        'to waste a response, and preserving it properly matters because it is the clearest ' +
        'evidence of intent available.',
      standIn:
        'All 4,100 notes are byte identical with no victim identifier, so they have no way to match ' +
        'a payment to us. Generic mailbox, no portal, and the wallet has never received a ' +
        'transaction. Sealed and hashed. This note is not an offer.',
      commandOptions: [
        { command: 'find /mnt -name "READ_ME.txt" -exec md5sum {} + | awk \'{print $1}\' | sort -u', correct: true, teaches: CORRECT_STEP },
        { command: 'cat /mnt/finance/READ_ME.txt', ...DUMP_ALL },
        { command: 'find /mnt -name "READ_ME.txt" | wc -l', ...COUNT_ONLY },
        { command: 'systemctl status smbd', ...STATUS_CHECK },
        { command: 'curl -s https://203.0.113.180/portal', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Compare the notes against each other. A real operator has to be able to tell victims apart.',
      guidance:
        'Ask how the person who wrote this would know which payment came from us.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1485'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'malware-analyst'],
      correctActions: ['act.flow-map'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'An absence reported as a finding, and it corroborates the other two from a completely ' +
        'different source. Both servers have working egress and have used none of it since before ' +
        'the encryption started. A ransomware operator needs a channel: to receive keys, to confirm ' +
        'the infection landed, to negotiate. This one wants nothing back. Worth stating the limit ' +
        'too, because it is the kind of claim that gets overstated: no outbound traffic proves ' +
        'there is no channel from these two hosts, not that the operator has no access anywhere ' +
        'else in the estate.',
      standIn:
        'No outbound traffic from either file server to anywhere external since 04:20. Both have ' +
        'working egress and are using none of it. Whoever did this wants nothing back from us. That ' +
        'is these two hosts only; I cannot speak for the rest of the estate.',
      commandOptions: [
        { command: 'awk \'$2 ~ /rmg-fs-0[23]/ {print $4}\' /var/log/flows.log | sort -u', correct: true, teaches: CORRECT_STEP },
        { command: 'netstat -an | grep ESTABLISHED', ...WRONG_TARGET },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'grep -c rmg-fs-02 /var/log/flows.log', ...COUNT_ONLY },
        { command: 'ping -c 3 203.0.113.180', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'List every external destination those two servers have reached since the encryption began.',
      guidance:
        'Ask what a person running an extortion scheme would need to receive from you, and whether ' +
        'anything is going out.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'lateral-movement',
      critical: true,
      techniques: ['T1072'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['ir-lead', 'forensics'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reimage-now', 'act.reset-password', 'act.power-off'],
      escalateTo: ['ir-lead'],
      why:
        'How it spread, and the only thing on this board that can still be prevented. The software ' +
        'distribution platform is the most efficient delivery mechanism in any estate: it is ' +
        'trusted, it runs as SYSTEM everywhere, and pushing to it is a normal administrative act. ' +
        'The package is named as a security patch, which is the one thing nobody delays. The ' +
        'sentence that matters is the last one: eleven more servers are queued with a window at ' +
        '05:15. Everything already encrypted is gone, so the hour belongs to that queue, and ' +
        'stopping the distribution platform is worth more than any analysis still outstanding.',
      standIn:
        'It came through the software distribution platform as a package named like a security ' +
        'patch, scheduled by an admin account at 04:22 and run at 04:28. The same package is queued ' +
        'for eleven more servers with a window at 05:15. That is twenty five minutes and it is the ' +
        'only thing here we can still change.',
      commandOptions: [
        { command: 'grep -A3 "patchsvc" /var/log/sccm/deployments.log | tail -30', correct: true, teaches: CORRECT_STEP },
        { command: 'systemctl status deployment-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/sccm/deployments.log', ...DUMP_ALL },
        { command: 'grep -c patchsvc /var/log/sccm/deployments.log', ...COUNT_ONLY },
        { command: 'find / -name "patchsvc*" -type f', ...WRONG_TARGET },
      ],
      commandNudge:
        'Find how the binary got onto both servers, and whether it is queued anywhere else.',
      guidance:
        'What is already encrypted is not coming back. Ask what has not run yet.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'discovery',
      techniques: ['T1580'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.iam-audit', 'act.revoke-key'],
      outOfLaneActions: ['act.dismiss', 'act.reimage-now', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Nine minutes before the deployment, somebody listed every restore point and deleted ' +
        'nothing. That is easy to read as harmless and it is the opposite: they were checking what ' +
        'would survive, and listing is the move precisely because deletion alerts and enumeration ' +
        'does not. The good news is real and worth saying loudly and early, because a floor that ' +
        'believes it has lost its backups makes different and worse decisions: every restore point ' +
        'is intact and the retention lock holds. The action is to lock that credential down now, ' +
        'since whoever holds it has already demonstrated what they are interested in.',
      standIn:
        'The backup principal enumerated every restore point at 04:19, nine minutes before the ' +
        'deployment, and deleted nothing. They were checking what survives. Every restore point is ' +
        'intact and the retention lock is on. I am revoking that credential now.',
      commandNudge:
        'Check what the backup credential actually did, and whether the restore points still exist.',
      guidance:
        'Somebody looked at the backups and did not touch them. Ask why looking was enough.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: [],
      why:
        'Forty quarantined files on nine workstations, on a night when two file servers are being ' +
        'destroyed. It is bundled adware from a browser extension the marketing team installed, ' +
        'with a helpdesk ticket, and 86 of 88 this month were the same thing. The check is which ' +
        'hosts and is there a ticket, and it takes under a minute. On a night with a 05:15 deadline ' +
        'the cost of getting it wrong is not an untidy report, it is minutes spent on nine ' +
        'workstations while eleven servers are queued.',
      standIn:
        'Forty AV quarantines overnight on nine workstations, all bundled adware from that browser ' +
        'extension marketing installed, helpdesk ticket exists. Eighty-six of eighty-eight this ' +
        'month were the same. Not related, closing it.',
      commandOptions: [
        { command: 'grep -i "extension" /var/log/helpdesk/tickets.log | tail', correct: true, teaches: CORRECT_STEP },
        { command: 'systemctl status av-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/av/quarantine.log', ...DUMP_ALL },
        { command: 'grep -c QUARANTINE /var/log/av/quarantine.log', ...COUNT_ONLY },
        { command: 'find / -name "*.crx" -type f', ...WRONG_TARGET },
      ],
      commandNudge:
        'Check which hosts those quarantines are on and whether anybody has already explained them.',
      guidance:
        'Malware on a bad night is not automatically your malware. Check the hosts and the tickets.',
    },
  ],
};
