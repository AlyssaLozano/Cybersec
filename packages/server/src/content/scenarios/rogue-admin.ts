/**
 * Scenario 23: Own Keys.
 *
 * The person under investigation is the person who administers the logs.
 *
 * WHAT THIS TEACHES
 *
 * That evidence integrity is not a paperwork exercise. Everywhere else on this
 * platform the logs are assumed reliable and the work is reading them. Here the
 * subject holds administrative rights over the logging platform, the identity
 * system and the backup estate, which means every source the floor would
 * normally reach for is one the subject can edit.
 *
 * The method is the same one `below-the-floor` teaches against a rootkit, moved
 * up a layer: find sources the subject does not control. The badge system belongs
 * to facilities, the switch counters belong to the network team, and the
 * write-once archive is genuinely append-only. Everything provable tonight comes
 * from one of those three.
 *
 * THE PART MOST FLOORS GET WRONG
 *
 * Notification. The instinct is to raise this with the head of infrastructure,
 * who is the subject's manager and sits ten feet from them, or to ask the
 * logging platform team to pull some records, which routes the request through
 * the subject's own team. Both are reasonable, normal, and would tell the person
 * they are being investigated. `ev.6` is graded on the floor working out that
 * who it tells is a decision with consequences.
 *
 * IT IS NOT PROVEN
 *
 * The evidence establishes that somebody used this account from a machine it has
 * never been used from, during hours the account holder was not in the building.
 * That is not the same as establishing who was at the keyboard, and the
 * scenario scores a floor that keeps the distinction.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';

const ID = 'own-keys';

export const OWN_KEYS: Scenario = {
  id: ID,
  title: 'Own Keys',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 16:00. An internal audit found nine days of missing records in the privileged access ' +
    'archive. The account associated with the gap administers the logging platform. Assume the ' +
    'logs you would normally use are not reliable.',
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
      summary: 'Nine days missing from the privileged session archive with no gap recorded',
      detail:
        'Internal audit found that privileged session recordings for the 6th to the 14th are absent ' +
        'from the primary archive. The archive index reports continuous coverage and the platform ' +
        'health dashboard shows no outage. Retention policy on this archive was shortened from 400 ' +
        'days to 30 on the 5th, by an administrator account, with no change ticket.',
      source: 'session archive',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'cloud-audit',
      summary: 'The retention change and the archive deletions used the same administrator account',
      detail:
        'Both the retention policy change on the 5th and 41 archive object deletions on the 15th ' +
        'were performed by d.whitfield, a senior infrastructure administrator. The account holds ' +
        'administrative rights over the logging platform, the identity system and the backup ' +
        'estate. Every action was permitted and none required approval.',
      source: 'd.whitfield',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'raw-log',
      summary: 'A write-once compliance archive still holds the deleted period',
      detail:
        'A secondary compliance archive, configured as append-only at the storage layer and ' +
        'administered by the finance systems team, retains the 6th to the 14th in full. Its ' +
        'permissions cannot be modified by infrastructure administrators. It shows 71 privileged ' +
        'sessions in that window under the d.whitfield account.',
      source: 'compliance archive',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'network-flow',
      summary: 'Those sessions originate from a workstation the account has never used',
      detail:
        'Switch flow records, held by the network team on separate infrastructure, show all 71 ' +
        'sessions sourced from RMG-WS-0788, a spare workstation in a store room with no assigned ' +
        'user. The d.whitfield account has 400 days of history and every prior session came from ' +
        'the assigned laptop or the administrative jump host.',
      source: 'RMG-WS-0788',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'host-artefact',
      summary: 'Badge records show the account holder was not in the building for 63 of the sessions',
      detail:
        'Physical access records, held by facilities on a separate system, show d.whitfield badged ' +
        'in on three of the nine days. Sixty-three of the 71 sessions occurred at times when the ' +
        'badge record shows the account holder was not in the building. The store room containing ' +
        'RMG-WS-0788 has no badge reader and is unlocked during working hours.',
      source: 'facilities',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'Standard escalation path routes through the subject own team',
      detail:
        'The documented process for a logging platform integrity issue is to raise it with the ' +
        'infrastructure team, whose senior administrator is d.whitfield, and to request archive ' +
        'records through the logging platform team, which d.whitfield administers. The head of ' +
        'infrastructure is that account holder direct manager and sits on the same floor.',
      source: 'process documentation',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Logging platform reported 1,400 ingestion errors during a storage migration',
      detail:
        'The logging platform dropped 1,400 events with ingestion errors between the 19th and the ' +
        '21st during a documented storage migration, with a change ticket and a named owner from ' +
        'the platform team. The affected events are all low-severity informational records and the ' +
        'gap is recorded in the platform own error log. Rule history: fired 40 times in thirty ' +
        'days, 39 closed as platform maintenance.',
      source: 'logging platform',
      claimedSeverity: 'low',
    },
  ],
};

export const OWN_KEYS_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'On the 5th somebody using the d.whitfield administrator account shortened the privileged session archive retention from 400 days to 30, with no change ticket.',
    'Between the 6th and the 14th, 71 privileged sessions ran under that account.',
    'On the 15th they deleted 41 archive objects covering that window, and the archive index still reports continuous coverage.',
    'They did not know about, or could not reach, a secondary compliance archive that is append-only at the storage layer and administered by the finance systems team.',
    'That archive holds all 71 sessions. Switch flow records held by the network team show every one of them coming from a spare workstation in an unlocked store room with no assigned user.',
    'Badge records held by facilities show the account holder was not in the building for 63 of the 71.',
    'Everything provable came from three systems the subject does not administer. Every system they do administer says nothing happened.',
    'What is established is that the account was used from a machine it has never been used from, mostly while its holder was elsewhere. Who was at the keyboard is not established.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1070.001', 'T1485'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.reset-password', 'act.declare'],
      escalateTo: ['ir-lead', 'log-analyst'],
      why:
        'Three facts in one row and the combination is what matters. Nine days missing, an index ' +
        'that reports continuous coverage, and a retention policy cut from 400 days to 30 on the ' +
        '5th with no change ticket. A gap where the index admits a gap is an outage. A gap the ' +
        'index denies is somebody editing the record. The retention change the day before the ' +
        'missing period is the part that removes any innocent reading, because it means the ' +
        'deletion was made survivable before the thing that needed deleting happened. Escalate to ' +
        'the lead rather than through the normal channel, and the reason to think about that ' +
        'immediately is on ev.6.',
      standIn:
        'Nine days missing from the privileged session archive, the 6th to the 14th, and the index ' +
        'still reports continuous coverage. Retention on that archive was cut from 400 days to 30 ' +
        'on the 5th with no change ticket. That is the day before the gap starts. Straight to the ' +
        'lead.',
      commandOptions: [
        'ls -la /archive/sessions/ | head -20',
        "awk '{print $1}' /archive/sessions/index.db.txt | sort -u | head -30",
        'cat /var/log/archive/retention-policy.log | tail',
        'df -h /archive',
        'systemctl status session-archive',
      ],
      commandNudge:
        'Check whether the archive index acknowledges the gap, and what changed just before it.',
      guidance:
        'A missing period is one thing. Ask whether the system admits it is missing, and what was ' +
        'changed the day before.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1070', 'T1098'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead', 'fusion-analyst'],
      correctActions: ['act.iam-audit'],
      outOfLaneActions: ['act.revoke-key', 'act.reset-password', 'act.declare', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'One account performed both the retention change and the deletions, and it holds ' +
        'administrative rights over the logging platform, the identity system and the backup ' +
        'estate. Nothing was bypassed and nothing required approval, which is the actual finding: ' +
        'the controls assume an administrator is trustworthy because there is no practical ' +
        'alternative, and this is what that assumption costs when it is wrong. Note what NOT to do ' +
        'here. Revoking the account is graded out of lane at this point, because it is the single ' +
        'clearest possible signal to the subject that they are under investigation, and the floor ' +
        'has not yet established anything from a source that account cannot edit.',
      standIn:
        'Both the retention change and the 41 deletions were done by d.whitfield, a senior ' +
        'infrastructure administrator. That account administers the logging platform, the identity ' +
        'system and the backup estate. All permitted, no approval required, nothing bypassed. I am ' +
        'not touching the account yet.',
      commandNudge:
        'Establish what that account administers before deciding what evidence you can trust.',
      guidance:
        'Ask what systems this account controls. Every one of them is a source you cannot rely on.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1070.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'The break in the case, and it exists because somebody once configured an archive to be ' +
        'append-only at the storage layer and put it under a different team. Infrastructure ' +
        'administrators cannot modify its permissions, so it holds the 6th to the 14th in full: 71 ' +
        'privileged sessions the primary archive says never happened. The general principle is ' +
        'worth stating in the report because it is the recommendation that comes out of tonight. ' +
        'The value of a write-once archive is not that it stores more, it is that it is the only ' +
        'thing that still works when the person you are investigating administers everything else.',
      standIn:
        'The compliance archive still has the 6th to the 14th in full. It is append-only at the ' +
        'storage layer and the finance systems team administer it, so infrastructure admins cannot ' +
        'touch its permissions. It shows 71 privileged sessions under that account in the window ' +
        'the primary archive says is empty.',
      commandOptions: [
        'ls -la /compliance-archive/sessions/ | head -20',
        "awk '$3==\"d.whitfield\" {print $1}' /compliance-archive/sessions/index.txt | sort | uniq -c",
        'grep -c whitfield /compliance-archive/sessions/index.txt',
        'lsattr /compliance-archive/sessions/',
        'cat /etc/archive/compliance-permissions.conf',
      ],
      commandNudge:
        'Find out whether any archive of this data exists that the subject cannot administer.',
      guidance:
        'The primary archive is edited. Ask whether a second copy exists somewhere they do not ' +
        'control.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1078.003'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.attribute-named', 'act.isolate', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'A second independent source, held by a different team on separate infrastructure, and it ' +
        'says something the account history alone could not. All 71 sessions came from a spare ' +
        'workstation in a store room with no assigned user, against 400 days in which every session ' +
        'came from the assigned laptop or the jump host. That is a deliberate choice of machine ' +
        'and it is the strongest evidence tonight of intent rather than carelessness: nobody works ' +
        'from a store room by accident. Worth being precise about what it does not say. It ' +
        'identifies a machine, not a person, and the store room has no badge reader, so nothing ' +
        'here records who sat there.',
      standIn:
        'Switch flow records, which the network team hold on separate kit, put all 71 sessions on ' +
        'RMG-WS-0788, a spare workstation in a store room with no assigned user. Four hundred days ' +
        'of history on that account and every previous session came from the assigned laptop or the ' +
        'jump host. That is a chosen machine. It tells us the machine, not the person.',
      commandOptions: [
        "awk '$5==\"d.whitfield\" {print $2}' /var/log/switch/sessions.log | sort | uniq -c",
        'grep RMG-WS-0788 /var/log/switch/flows.log | wc -l',
        'cat /etc/inventory/workstations.csv | grep 0788',
        'arp -a | grep 0788',
        'ping -c1 RMG-WS-0788',
      ],
      commandNudge:
        'Check where those sessions came from, using records the subject does not administer.',
      guidance:
        'Ask where this account normally connects from, then compare it to where these came from.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'credential-access',
      techniques: ['T1078.003'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.declare', 'act.isolate', 'act.reset-password'],
      escalateTo: ['ir-lead'],
      why:
        'The third independent source, from facilities, and the one that has to be reported most ' +
        'carefully. Sixty-three of 71 sessions happened while the badge record shows the account ' +
        'holder was not in the building. That is strong and it points in two directions at once: ' +
        'either somebody else is using the credential, or the account holder is using it and ' +
        'avoiding the badge system, and nothing available tonight separates those. The store room ' +
        'has no badge reader and is unlocked during working hours, so the building could be entered ' +
        'legitimately by a great many people and the room reached without any record. The correct ' +
        'output is the correlation and both readings, stated plainly, with the eight sessions that ' +
        'DO overlap the badge record noted rather than quietly dropped.',
      standIn:
        'Facilities badge records show the account holder badged in on three of the nine days, and ' +
        '63 of the 71 sessions happened while they were not in the building. Eight of them overlap ' +
        'with badge-in times. Two readings fit: somebody else has the credential, or the holder is ' +
        'avoiding the badge system. Nothing I have separates them. The store room has no reader and ' +
        'is unlocked in working hours.',
      commandNudge:
        'Line the session times up against the badge records, and count how many do NOT overlap.',
      guidance:
        'Ask where the account holder was when these happened. Then be careful about what that ' +
        'proves.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1098'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.declare', 'act.attribute-named', 'act.isolate', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'Not a technical event, and one of the more consequential rows in the whole set. The ' +
        'documented process routes a logging integrity issue to the infrastructure team, whose ' +
        'senior administrator is the subject, and archive record requests through the platform team ' +
        'the subject administers. The subject manager sits on the same floor. So following the ' +
        'documented process correctly and in good faith tells the person they are being ' +
        'investigated, which on an evidence-destruction case means the remaining evidence goes. ' +
        'This is why an investigation involving a privileged insider needs an escalation path ' +
        'agreed in advance with legal and HR, and the absence of one is the finding for the ' +
        'debrief. What the floor owes the lead is the conflict stated explicitly, not a quiet ' +
        'decision to skip the process.',
      standIn:
        'The documented escalation for this goes to the infrastructure team, and the subject is ' +
        'their senior administrator. Archive requests go through the logging platform team, which ' +
        'the subject administers. Their manager is on the same floor. Following our own process ' +
        'notifies the subject. We need a path agreed with legal and HR and we do not have one.',
      commandNudge:
        'Read the documented escalation path and check who it actually routes through.',
      guidance:
        'Ask who you are supposed to tell, and whether telling them reaches the person you are ' +
        'investigating.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.preserve', 'act.declare', 'act.corroborate'],
      escalateTo: [],
      why:
        '1,400 dropped events on the logging platform, on a day the floor is investigating somebody ' +
        'deleting logs from the logging platform. It is a documented storage migration on the 19th ' +
        'to the 21st with a change ticket and a named owner from a different team, the events are ' +
        'low-severity informational records, and the platform own error log records the gap, which ' +
        'is the exact opposite of the ev.1 pattern where the index denied the gap existed. Thirty ' +
        'nine of forty were closed the same way this month. The contrast is the teaching point: one ' +
        'gap is acknowledged by the system and one is concealed by it, and that difference is what ' +
        'separates an outage from tampering.',
      standIn:
        '1,400 ingestion errors on the 19th to the 21st during a documented storage migration, ' +
        'change ticket and named owner from the platform team, all low-severity informational ' +
        'records, and the platform error log records the gap itself. That is the opposite of what ' +
        'we are looking at. Thirty-nine of forty this month were the same. Closing it.',
      commandOptions: [
        'grep -c "ingestion error" /var/log/logging-platform/errors.log',
        'grep -i migration /var/log/change-management.log',
        "awk '/ingestion error/ {print $5}' /var/log/logging-platform/errors.log | sort | uniq -c",
        'cat /var/log/logging-platform/errors.log | tail -20',
        'systemctl status log-ingest',
      ],
      commandNudge:
        'Check whether the platform recorded this gap itself, and whether anybody owns the change.',
      guidance:
        'Compare this gap to the first one. Ask whether the system admits to it.',
    },
  ],
};
