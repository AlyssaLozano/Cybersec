/**
 * Scenario 45: The Printer.
 *
 * Everything on the network is a computer, including the things nobody thinks
 * of as computers.
 *
 * WHAT THIS TEACHES
 *
 * That the asset inventory and the attack surface are different lists, and the
 * gap between them is where nobody is looking. A multifunction printer runs an
 * operating system, holds a hard disk, has an address book full of internal
 * email addresses, keeps copies of everything it scans, authenticates to the
 * mail server with a stored credential, and is administered through a web
 * interface with a default password. Nothing in this estate treats it as a
 * computer, because it is a printer.
 *
 * WHY IT IS A BEGINNER SCENARIO
 *
 * Every step is plain and the attacker did nothing sophisticated. What is being
 * built is the habit of asking what a device actually is rather than what it is
 * called, and of noticing that "it is only a printer" is a sentence that closes
 * an investigation rather than a finding that concludes one.
 *
 * THE DETAIL WORTH THE HOUR
 *
 * The scan-to-email feature sends from an address inside the organisation,
 * because the printer authenticates to the mail server. So documents leaving
 * this way pass every outbound control the organisation has: they are internal
 * mail from a known device to an address in the printer own address book, and
 * the address book is editable by anybody who can reach the web interface.
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

const ID = 'the-printer';

export const THE_PRINTER: Scenario = {
  id: ID,
  title: 'The Printer',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 14:40 at Ridgeline Medical Group. A ward clerk says the big printer outside the ' +
    'discharge office is emailing scans to somebody she does not recognise. It is a printer, so ' +
    'nothing is monitoring it.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'vulnerability-analyst',
    'forensics',
    'detection-engineer',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'A ward clerk reports an unfamiliar name in the printer scan-to-email list',
      detail:
        'A clerk on the discharge unit reports that the scan destination list on the ward ' +
        'multifunction device includes an entry reading "Records Archive" that was not there last ' +
        'week and that nobody on the ward added. She noticed because it sits above the entry she ' +
        'normally uses. Rule history: no security rule covers multifunction devices and none has ' +
        'ever fired.',
      source: 'rmg-mfp-14',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.2',
      atSeconds: 140,
      surface: 'network-flow',
      summary: 'The device has sent 190 messages to an external address in nine days',
      detail:
        'The mail gateway shows 190 messages from rmg-mfp-14 to an address at a free mail provider ' +
        'since 6 September, each carrying a PDF attachment between 200 KB and 4 MB. The device ' +
        'normally sends only to internal addresses. The messages are authenticated as the device ' +
        'mail account and pass all outbound checks because they originate inside the organisation.',
      source: 'rmg-mfp-14',
      target: 'external mail provider',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 300,
      surface: 'raw-log',
      summary: 'The address book entry was added through the web interface with the default password',
      detail:
        'The device administration log shows a login to the web interface at 21:40 on 5 September ' +
        'from 10.44.6.61, using the manufacturer default administrator password, followed by an ' +
        'address book entry being created. The default password is printed in the product manual. ' +
        'The device has never had its administrator password changed since installation in 2021.',
      source: 'rmg-mfp-14',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 460,
      surface: 'host-artefact',
      summary: 'The device hard disk holds every document scanned since 2021',
      detail:
        'The multifunction device contains a 320 GB hard disk retaining a copy of every scanned ' +
        'document. It holds approximately 61,000 documents dating to installation, including ' +
        'discharge summaries, referral letters and consent forms. The retention setting is on by ' +
        'default and has never been changed. The web interface allows any administrator to browse ' +
        'and download the stored documents.',
      source: 'rmg-mfp-14',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'alert-queue',
      summary: 'The source address is a second multifunction device on another ward',
      detail:
        '10.44.6.61 is rmg-mfp-09, a multifunction device on the maternity unit. It is reachable ' +
        'from the guest wireless network because the printer segment was made reachable from guest ' +
        'in 2022 so visitors could use the public printing service. Both devices sit on the same ' +
        'flat printer segment as forty other multifunction devices.',
      source: 'rmg-mfp-09',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'alert-queue',
      summary: 'Forty-one devices share the same default administrator password',
      detail:
        'An inventory check finds 41 of the 44 multifunction devices in the estate still using the ' +
        'manufacturer default administrator password. All 41 have document retention enabled and ' +
        'scan-to-email configured. None appears in the vulnerability scanner scope, which covers ' +
        'servers and workstations. None has an owner recorded in the asset register.',
      source: 'device inventory',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Eleven hundred print jobs failed across the estate this morning',
      detail:
        'Eleven hundred jobs failed between 08:00 and 11:00 with a driver error. The print server ' +
        'received a driver update on Tuesday night under an approved change and the platform team ' +
        'rolled it back at 11:10, after which jobs succeeded. Rule history: fired 40 times in ' +
        'thirty days, 40 closed as print infrastructure.',
      source: 'print server',
      claimedSeverity: 'low',
    },
  ],
};

export const THE_PRINTER_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'On 5 September somebody logged into a ward multifunction device web interface using the manufacturer default administrator password, which is printed in the product manual and has never been changed since 2021.',
    'They came from another multifunction device on the maternity unit, which is reachable from the guest wireless because the printer segment was opened to guest in 2022 so visitors could print.',
    'They added an address book entry called Records Archive pointing at a free mail account.',
    'Since then 190 scanned documents have been emailed out, each authenticated as the device mail account.',
    'Those messages pass every outbound control, because they are internal mail from a known device to an entry in the device own address book.',
    'The device also holds a 320 GB disk with a copy of every document scanned since 2021, roughly 61,000 discharge summaries, referral letters and consent forms, browsable through the same web interface.',
    'Forty-one of the forty-four devices in the estate have the same default password, the same retention setting and the same scan-to-email configuration.',
    'None of them is in the vulnerability scanner scope, none has a recorded owner, and no security rule covers them, because they are printers.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'exfiltration',
      techniques: ['T1074'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reimage-now', 'act.reset-password'],
      escalateTo: ['network-analyst', 'ir-lead'],
      why:
        'A clerk noticed a name in a menu, and no rule anywhere covers this device class so nothing ' +
        'was ever going to raise it. Take it seriously for one reason: an entry that appeared in a ' +
        'configuration list that nobody on the ward added means somebody changed the configuration ' +
        'of a device, and a device whose configuration can be changed by a stranger is a computer ' +
        'rather than an appliance. The name is the tell as well. "Records Archive" is chosen to sit ' +
        'unremarkably in a list of clinical destinations, which is somebody thinking about how the ' +
        'list is read.',
      standIn:
        'Ward clerk on discharge says the scan destination list has an entry called Records Archive ' +
        'that was not there last week and nobody on the ward added. No rule covers these devices at ' +
        'all. Somebody changed the configuration of that machine. Raising it.',
      commandOptions: [
        { command: 'curl -s http://rmg-mfp-14/admin/addressbook | grep -i archive', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "addressbook\\|destination" /var/log/mfp/rmg-mfp-14-admin.log | tail', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status cups', ...STATUS_CHECK },
        { command: 'cat /var/log/cups/error_log', ...DUMP_ALL },
        { command: 'grep -c PRINT /var/log/cups/page_log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at the destination list on that device and find out when the entry was added.',
      guidance:
        'Somebody changed a setting on that machine. Ask what else somebody who can do that is able ' +
        'to do.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'exfiltration',
      critical: true,
      techniques: ['T1074', 'T1041'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'The scale, and the reason nothing caught it. A hundred and ninety documents in nine days to ' +
        'a free mail account, each authenticated as the device mail account. These messages pass ' +
        'every outbound control the organisation has, and not because the controls failed: they are ' +
        'internal mail, from a known device, to an entry in that device own address book, which is ' +
        'exactly what legitimate scan-to-email looks like. That is worth stating plainly in the ' +
        'report, because the instinct will be to ask why data loss prevention did not fire and the ' +
        'answer is that nothing about this traffic is anomalous except the destination nobody ' +
        'reviews. The comparison that makes it obvious is trivial and available: this device ' +
        'normally sends only to internal addresses.',
      standIn:
        '190 messages from that printer to a free mail account since 6 September, each with a PDF ' +
        'attached, 200 KB to 4 MB. All authenticated as the device mail account, so they pass every ' +
        'outbound control we have as internal mail from a known device. That device has never sent ' +
        'externally before.',
      commandOptions: [
        { command: "awk '$3==\"rmg-mfp-14\" {print $5}' /var/log/mail/delivery.log | sort | uniq -c | sort -rn", correct: true, teaches: CORRECT_STEP },
        { command: 'grep rmg-mfp-14 /var/log/mail/delivery.log | wc -l', correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -an | grep 25', ...WRONG_TARGET },
        { command: 'cat /var/log/mail/delivery.log', ...DUMP_ALL },
        { command: 'curl -s https://mail-provider.example', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'List every destination that device has sent mail to, and compare against what it normally ' +
        'sends to.',
      guidance:
        'Ask why our outbound controls did not object. The answer is usually that nothing about it ' +
        'looked wrong.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1078.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'vulnerability-analyst'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.reset-password'],
      escalateTo: ['vulnerability-analyst', 'ir-lead'],
      why:
        'How they got in, and there is no exploit in it. A web interface login at 21:40 on 5 ' +
        'September using the manufacturer default administrator password, which is printed in the ' +
        'product manual and has never been changed since installation in 2021. Nothing was ' +
        'defeated. The device has an administration log and it recorded the whole thing, which is ' +
        'the second finding worth naming: the evidence has existed on the device for nine days and ' +
        'nobody was reading it, because nothing collects logs from printers. The source address ' +
        'being internal is what makes the next event necessary rather than optional.',
      standIn:
        'Web interface login at 21:40 on 5 September using the manufacturer default admin password, ' +
        'the one in the manual, never changed since 2021. Then the address book entry was created. ' +
        'Nothing was exploited. The device logged all of it and nobody has ever collected logs from ' +
        'a printer.',
      commandOptions: [
        { command: 'grep -A4 "2026-09-05 21:4" /var/log/mfp/rmg-mfp-14-admin.log', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "login\\|auth" /var/log/mfp/rmg-mfp-14-admin.log | tail -20', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status cups', ...STATUS_CHECK },
        { command: 'cat /var/log/mfp/rmg-mfp-14-admin.log', ...DUMP_ALL },
        { command: 'curl -u admin:admin http://rmg-mfp-14/admin/reset', ...MUTATE },
      ],
      commandNudge:
        'Check whether that device keeps an administration log, and read what happened before the ' +
        'entry appeared.',
      guidance:
        'Ask how somebody was able to change that setting. The answer may be that they logged in ' +
        'normally.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1074'],
      firstResponder: 'forensics',
      alsoAppropriate: ['ir-lead', 'vulnerability-analyst'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'What the device actually is, and it is much worse than the 190 emails. A 320 GB disk ' +
        'holding a copy of every document scanned since 2021, roughly 61,000 discharge summaries, ' +
        'referral letters and consent forms, browsable and downloadable through the same web ' +
        'interface the attacker already has administrator access to. So the exposure is not the ' +
        'nine days of emailed scans, it is four years of clinical documents sitting on a device ' +
        'nobody knew stored anything. The retention setting is on by default and has never been ' +
        'changed, which means nobody chose this: it arrived in the box. Preserve the disk before ' +
        'anybody power cycles or factory resets the device, because the instinct on a compromised ' +
        'printer is to reset it and that destroys the only record of what was taken.',
      standIn:
        'That device has a 320 GB disk holding every document it has scanned since 2021, about ' +
        '61,000 discharge summaries, referrals and consent forms, and the web interface lets an ' +
        'administrator browse and download all of it. Retention is on by default and nobody ever ' +
        'changed it. The exposure is four years, not nine days. Nobody factory resets this until it ' +
        'is imaged.',
      commandOptions: [
        { command: 'curl -s http://rmg-mfp-14/admin/storage/status | grep -i "documents\\|retention"', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "retention\\|storage" /var/log/mfp/rmg-mfp-14-config.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status cups', ...STATUS_CHECK },
        { command: 'cat /var/log/mfp/rmg-mfp-14-admin.log', ...DUMP_ALL },
        { command: 'curl -X POST http://rmg-mfp-14/admin/factory-reset', ...MUTATE },
      ],
      commandNudge:
        'Find out whether that device stores what it scans, and how far back.',
      guidance:
        'Ask what is inside the machine. A printer with a hard disk has been keeping things.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'lateral-movement',
      techniques: ['T1021'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['vulnerability-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'vulnerability-analyst'],
      why:
        'Where the login came from, and the answer is another printer. The source is a ' +
        'multifunction device on the maternity unit, reachable from guest wireless because the ' +
        'printer segment was opened to guest in 2022 so visitors could use public printing. That ' +
        'exception was reasonable and it is why somebody sitting in a waiting room can reach the ' +
        'administration interface of every printer in the hospital. Both devices sit on the same ' +
        'flat segment as forty others, so this is not a compromised printer, it is a reachable ' +
        'printer estate. The person did not need to be in the building on 5 September, though ' +
        'somebody was in the building at some point to reach the guest network at all, and that is ' +
        'worth handing to security management rather than asserting.',
      standIn:
        'The login came from rmg-mfp-09 on maternity, which is reachable from guest wireless because ' +
        'the printer segment was opened to guest in 2022 for visitor printing. Both are on the same ' +
        'flat segment as forty other devices. Somebody in a waiting room can reach the admin ' +
        'interface of every printer in this hospital.',
      commandOptions: [
        { command: "awk '$2 ~ /10.44.6/ {print $2, $4}' /var/log/flows.log | sort -u", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "guest\\|printer" /etc/network/segments.conf', correct: true, teaches: ALSO_WORKS },
        { command: 'netstat -rn', ...WRONG_TARGET },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'nmap -sn 10.44.6.0/24', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find out what that source address is and which networks can reach the printer segment.',
      guidance:
        'Ask what the machine that logged in actually is, and who can reach it.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'discovery',
      critical: true,
      techniques: ['T1078.001'],
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.preserve', 'act.isolate', 'act.declare', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The scope, and it is the whole reason this seat is here. Forty-one of forty-four devices ' +
        'still on the manufacturer default password, all with retention enabled and scan-to-email ' +
        'configured. Every one of them is the same incident waiting to be noticed, and each holds ' +
        'years of clinical documents. The three sentences after that are the finding for the ' +
        'debrief and they compound: none is in the vulnerability scanner scope, which covers ' +
        'servers and workstations; none has a recorded owner in the asset register; and no security ' +
        'rule covers the device class. So the organisation has forty-four computers full of patient ' +
        'data that no control, no scan, no rule and no person is responsible for. That is not an ' +
        'oversight in one place, it is a category the estate does not have.',
      standIn:
        'Forty-one of forty-four devices still have the default admin password, all with retention ' +
        'on and scan-to-email configured. Every one is this incident waiting to be noticed and each ' +
        'holds years of documents. None of them is in the scanner scope, none has an owner in the ' +
        'asset register, and no rule covers them. Forty-four computers full of patient data that ' +
        'nobody owns.',
      commandOptions: [
        { command: "awk -F, '$3==\"mfp\" {print $1, $5, $7}' /var/inventory/devices.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c mfp /var/log/scanner/scope.txt', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status scanner', ...STATUS_CHECK },
        { command: 'cat /var/inventory/devices.csv', ...DUMP_ALL },
        { command: 'nmap -p 80,443 10.44.6.0/24', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Check how many other devices of this type share the same configuration, and whether they ' +
        'are scanned at all.',
      guidance:
        'One printer was reachable. Ask how many others are, and whether anything is watching any ' +
        'of them.',
    },
    {
      eventId: 'ev.7',
      verdict: 'false-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss', 'act.tune'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: [],
      why:
        'Eleven hundred print job failures on the afternoon the floor is working a printer incident. ' +
        'It is a driver update pushed to the print server on Tuesday under an approved change, ' +
        'rolled back at 11:10 with jobs succeeding afterwards, and 40 of 40 this month were the ' +
        'same. Two checks settle it: is there a change record and did it stop when they rolled ' +
        'back. The contrast is the useful part. Eleven hundred failures produced an alert within ' +
        'minutes because the print server is a monitored server; 190 documents leaving a printer ' +
        'over nine days produced nothing, because the printer is not. The estate watches the thing ' +
        'that serves printing and ignores the things that do the printing.',
      standIn:
        '1,100 job failures this morning are the driver update pushed to the print server Tuesday, ' +
        'change record exists, rolled back at 11:10 and jobs succeeded after. Forty of forty this ' +
        'month were the same. Note the contrast: that alerted in minutes because the print server is ' +
        'monitored, and 190 documents leaving a printer over nine days alerted never. Closing it.',
      commandOptions: [
        { command: 'grep -i "driver\\|print server" /var/log/change-management.log | tail', correct: true, teaches: CORRECT_STEP },
        { command: "awk '$4==\"FAILED\" {print $1}' /var/log/cups/page_log | cut -d: -f1 | uniq -c", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status cups', ...STATUS_CHECK },
        { command: 'cat /var/log/cups/error_log', ...DUMP_ALL },
        { command: 'grep -c FAILED /var/log/cups/page_log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check whether anybody had a change open on the print server and whether the failures ' +
        'stopped.',
      guidance:
        'Print jobs failing is loud and usually boring. Ask whether it has anything to do with the ' +
        'device you care about.',
    },
  ],
};
