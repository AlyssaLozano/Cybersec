/**
 * Scenario 61: The Other Attachment.
 *
 * The file that got flagged is fine. The file nobody mentioned is the attack.
 *
 * WHAT THIS TEACHES
 *
 * Two habits, and the second one is the point.
 *
 * The first is that a detection count is not a verdict. Three engines out of
 * sixty flagged a PDF with generic heuristic names, which is the weakest signal
 * a scanner produces, and the file turns out to be an ordinary remittance
 * advice from a real supplier. Learning to look at what the detections actually
 * say, rather than at how many there are, is most of triage.
 *
 * The second is that the reported item is not the scope. The same email carried
 * a second attachment that nothing flagged, because there was nothing for a
 * scanner to flag: it is an HTML file that draws a login page and posts what is
 * typed into it to an address on the internet. No exploit, no macro, no
 * download, no code that any engine would recognise as hostile. It is a form.
 *
 * WHY THAT IS THE HARD PART FOR A BEGINNER
 *
 * Everything in the alert points at the PDF. The reporter mentions the PDF, the
 * scanner names the PDF, the queue row is about the PDF. Opening the whole email
 * and asking what else came with it is a deliberate act that nothing on the
 * screen prompts, and it is the only route to the actual incident.
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

const ID = 'the-other-attachment';

export const THE_OTHER_ATTACHMENT: Scenario = {
  id: ID,
  title: 'The Other Attachment',
  difficulty: 'beginner',
  durationMinutes: 45,
  situation:
    'It is 10:15 at Ridgeline Medical Group. A finance officer forwarded an email to the security ' +
    'mailbox because her antivirus put a warning on the attachment.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
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
      summary: 'Antivirus flagged an attached PDF on three of sixty engines',
      detail:
        'The endpoint scanner raised a warning on Remittance_Advice.pdf, attached to an email that ' +
        'arrived at 09:41 apparently from Calderbrook Medical Supplies, a real supplier with an ' +
        'open account. The multi-engine result is 3 detections out of 60. The three names are ' +
        'HEUR/PDF.Gen, Suspicious.PDF.Heuristic and PDF/Agent!gen, all generic. The other ' +
        'fifty-seven engines report the file as clean.',
      source: 'RMG-WS-4410',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 120,
      surface: 'host-artefact',
      summary: 'The PDF contains nothing that can run',
      detail:
        'Static examination of Remittance_Advice.pdf finds no JavaScript, no embedded files, no ' +
        'launch or open actions, no forms and no external references. It is one page and renders a ' +
        'remittance for four invoice numbers, all of which match open invoices on the finance ' +
        'system. The three detections all fire on the producer string of the PDF library that ' +
        'generated it, which is an old open source version used by a lot of accounting software.',
      source: 'Remittance_Advice.pdf',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.3',
      atSeconds: 260,
      surface: 'host-artefact',
      summary: 'The email had a second attachment that nobody has mentioned',
      detail:
        'The forwarded message carries two attachments. The second is Statement_Aug.htm, 214 ' +
        'kilobytes. No engine flagged it, the mail gateway passed it, and it does not appear in ' +
        'the alert, in the reporter\'s description, or in the ticket. It has been on the ' +
        'workstation since 09:41.',
      source: 'RMG-WS-4410',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 400,
      surface: 'process-tree',
      summary: 'The HTML file draws a login page and posts what is typed into it',
      detail:
        'Statement_Aug.htm contains a base64 block that decodes to a styled login page carrying ' +
        'the Ridgeline logo and the wording of the finance portal sign-in screen. It has a form ' +
        'with a username field and a password field, and the form posts to ' +
        'https://203.0.113.156/collect. There is no script that exploits anything, no macro, no ' +
        'download and no executable content. Opened, it renders in the browser as a local file.',
      source: 'Statement_Aug.htm',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 540,
      surface: 'network-flow',
      summary: 'One workstation posted 180 bytes to that address',
      detail:
        'Two workstations made outbound connections to 203.0.113.156 this morning. RMG-WS-4410 ' +
        'connected at 09:44, loaded nothing, and disconnected after 2 seconds with no data sent. ' +
        'RMG-WS-4188 connected at 09:52 and sent a POST of 180 bytes, receiving a 302 redirect in ' +
        'response. No other host in the estate has contacted that address in ninety days.',
      source: '203.0.113.156',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 680,
      surface: 'raw-log',
      summary: 'Thirty-four copies of the same email were delivered',
      detail:
        'The mail gateway delivered 34 copies of the message between 09:38 and 09:47, all to ' +
        'finance and procurement mailboxes. The sender domain is calderbrook-medical.net. The real ' +
        'supplier uses calderbrook-medical.co.uk, which has been in the address book for six ' +
        'years. The .net domain was registered eleven days ago. All 34 copies carry both ' +
        'attachments and none were quarantined.',
      source: 'mail gateway',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 820,
      surface: 'host-artefact',
      summary: 'The second workstation still has the page open in history',
      detail:
        'RMG-WS-4188 browser history shows a local file URL for Statement_Aug.htm opened at 09:51 ' +
        'and a navigation to 203.0.113.156 at 09:52. The file is still in the user\'s temporary ' +
        'folder. The account belongs to a procurement officer who holds standard access to the ' +
        'finance portal and the supplier payment system. Her last successful portal sign-in was at ' +
        '08:20 and there have been none since.',
      source: 'RMG-WS-4188',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 960,
      surface: 'alert-queue',
      summary: 'Finance and procurement need to keep working',
      detail:
        'Thirty-four mailboxes across finance and procurement hold the message. The supplier ' +
        'payment run is scheduled for 14:00 today and covers 210 invoices. Blocking all .htm ' +
        'attachments at the gateway would also block around 300 messages a day from the pathology ' +
        'reporting system, which sends results to clinicians as HTML. Password resets across ' +
        'finance require each person to re-enrol their authenticator.',
      source: 'operations',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.9',
      atSeconds: 1100,
      surface: 'alert-queue',
      summary: 'Three hundred more HTML attachments arrived this morning',
      detail:
        'A retrospective sweep for .htm attachments returns 312 messages received today. All 312 ' +
        'originate from path-reports@ridgeline.example, an internal system, are addressed to named ' +
        'clinicians, and contain a results table with no form elements, no base64 blocks and no ' +
        'external references. The pathology reporting system has sent results this way since 2021. ' +
        'Rule history: no rule exists on HTML attachments.',
      source: 'mail gateway',
      claimedSeverity: 'medium',
    },
  ],
};

export const THE_OTHER_ATTACHMENT_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'At 09:38 somebody sent 34 copies of a message to Ridgeline finance and procurement mailboxes from calderbrook-medical.net, a domain registered eleven days ago that imitates a real supplier whose actual domain ends .co.uk and has been in the address book for six years.',
    'Each copy carried two attachments. The first, Remittance_Advice.pdf, is a genuine and harmless remittance listing four real open invoice numbers, and exists to make the message credible.',
    'Three of sixty scanning engines flagged that PDF with generic heuristic names, all of which fire on the producer string of an old open source PDF library used widely by accounting software. It contains no JavaScript, no embedded files, no launch actions and no forms.',
    'The second attachment, Statement_Aug.htm, was flagged by nothing, because there is nothing in it for a scanner to recognise. It is a base64 block that decodes to a login page carrying the Ridgeline logo and the finance portal wording, with a form that posts to https://203.0.113.156/collect.',
    'No exploit, no macro, no download, no executable content. Opened, it renders as a local file in the browser and asks for a username and a password.',
    'The reporting officer opened it at 09:44, did not type anything, and closed it. A procurement officer on RMG-WS-4188 opened it at 09:51 and posted 180 bytes at 09:52.',
    'That account holds standard access to the finance portal and the supplier payment system, and the supplier payment run covering 210 invoices is scheduled for 14:00.',
    'Everything in the alert pointed at the PDF. The incident was in the attachment nobody mentioned.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1566.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['malware-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['malware-analyst', 'log-analyst'],
      why:
        'Three out of sixty is a weak number and the three names are weaker still. HEUR, ' +
        'Suspicious and gen all mean the same thing, which is that an engine saw a pattern it ' +
        'associates with badness rather than anything it recognises, and fifty-seven engines saw ' +
        'nothing at all. That is not a reason to close it and it is not a reason to panic; it is a ' +
        'reason to have somebody look at the file properly. The more useful instinct on this row ' +
        'is a different one: a member of staff reported an email, and an email is a whole object ' +
        'with a sender, a subject and however many attachments it happens to have. The alert is ' +
        'about one file inside it. Hand the whole message to analysis rather than the one file the ' +
        'scanner named.',
      standIn:
        'Three engines out of sixty on a PDF, and all three names are generic heuristics, which ' +
        'means a pattern rather than a recognised thing. Fifty-seven say clean. Not closing it and ' +
        'not panicking, I want somebody to actually look at the file. And I am sending the whole ' +
        'email over, not just the attachment the scanner named.',
      commandOptions: [
        { command: "awk -F, '$2==\"RMG-WS-4410\" && $3==\"AV_DETECT\" {print $1, $5, $6}' /var/log/av/detections.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "Remittance_Advice" /var/log/mail/delivery.log', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status av-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/av/detections.csv', ...DUMP_ALL },
        { command: 'grep -c AV_DETECT /var/log/av/detections.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Look at what the three detections are actually called, not just how many there are.',
      guidance:
        'Three out of sixty is a number. Ask what those three engines actually said.',
    },
    {
      eventId: 'ev.2',
      verdict: 'false-positive',
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['forensics', 'soc-operator'],
      correctActions: ['act.decode', 'act.dismiss'],
      outOfLaneActions: ['act.sandbox', 'act.reimage-now', 'act.attribute-named', 'act.isolate'],
      escalateTo: [],
      why:
        'The file that started all this cannot do anything. No JavaScript, no embedded files, no ' +
        'launch or open actions, no forms, no external references: those five checks are the whole ' +
        'of PDF triage and all five come back empty. It is one page, it renders a remittance, and ' +
        'the four invoice numbers on it match open invoices on the finance system, which is a ' +
        'detail worth holding onto rather than dismissing. The three detections fire on the ' +
        'producer string of an old open source PDF library that a great deal of accounting ' +
        'software uses, so what those engines detected is the age of a library and not a threat. ' +
        'Note also that this cost nothing to establish and did not require detonating anything. ' +
        'Reaching for the sandbox first is the common instinct and it is slower, noisier and less ' +
        'informative than opening the file structure and reading it.',
      standIn:
        'The PDF is clean and it cannot do anything. No JavaScript, no embedded files, no launch ' +
        'actions, no forms, no external references. One page, renders a remittance, and the four ' +
        'invoice numbers on it are real open invoices on our finance system. The three detections ' +
        'are all firing on the producer string of an old PDF library that half of accounting ' +
        'software uses. No detonation needed for any of that.',
      commandOptions: [
        { command: 'pdfid /evidence/Remittance_Advice.pdf', correct: true, teaches: CORRECT_STEP },
        { command: 'strings -n 8 /evidence/Remittance_Advice.pdf | grep -iE "javascript|openaction|launch|producer"', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status av-agent', ...STATUS_CHECK },
        { command: 'cat /evidence/Remittance_Advice.pdf', ...DUMP_ALL },
        { command: 'xdg-open /evidence/Remittance_Advice.pdf', ...MUTATE },
      ],
      commandNudge:
        'Check the PDF for the things that can actually execute: scripts, embedded files, launch ' +
        'actions.',
      guidance:
        'A PDF is only dangerous if something in it can run. Go and look for that.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1566.001'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.decode', 'act.preserve'],
      outOfLaneActions: ['act.dismiss', 'act.sandbox', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'network-analyst'],
      why:
        'There were always two attachments, and nothing anywhere told anybody that. The scanner ' +
        'named one file, the reporter described one file, the ticket is about one file, and the ' +
        'second one has been sitting on a workstation since 09:41 with nothing flagged and nothing ' +
        'said. It is only found by opening the message and asking what came with it, which is a ' +
        'deliberate act that no part of the screen prompts. This is the habit the whole scenario ' +
        'exists to build, and it generalises well past email: the thing that was reported is the ' +
        'start of the scope and never the whole of it, and the most dangerous item in any incident ' +
        'is regularly the one nobody put in the subject line. Preserve it before anything else ' +
        'touches it.',
      standIn:
        'There are two attachments. Nobody has mentioned the second one because nothing flagged it. ' +
        'Statement_Aug.htm, 214 kilobytes, on that workstation since 09:41, not in the alert, not ' +
        'in the reporter\'s description, not in the ticket. The only way to find it is to open the ' +
        'message and ask what else came with it. Preserving it now, and nobody opens it on a real ' +
        'machine.',
      commandOptions: [
        { command: 'munpack -t /evidence/reported-message.eml && ls -la', correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "Content-Disposition: attachment" /evidence/reported-message.eml', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mail-gateway', ...STATUS_CHECK },
        { command: 'cat /evidence/reported-message.eml', ...DUMP_ALL },
        { command: 'firefox /evidence/Statement_Aug.htm', ...MUTATE },
      ],
      commandNudge:
        'List everything attached to that message, not just the file that was flagged.',
      guidance:
        'One file was reported. Ask how many the email actually had.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1566.001', 'T1056.003'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.decode', 'act.ttp-map'],
      outOfLaneActions: ['act.sandbox', 'act.contact-attacker', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'network-analyst'],
      why:
        'Nothing in this file is malicious in the way a scanner understands the word, which is ' +
        'exactly why nothing flagged it. A base64 block decodes to a login page with the Ridgeline ' +
        'logo and the finance portal wording, a username field, a password field, and a form that ' +
        'posts to an address on the internet. No exploit, no macro, no download, no executable ' +
        'content: it is a form, and a form is not a thing an engine can call hostile without ' +
        'calling most of the web hostile. It also removes the usual tell, because there is no ' +
        'suspicious link to hover over. The page is on the machine, the address bar shows a local ' +
        'file, and the padlock question does not arise. Map it and move: this is credential ' +
        'harvesting and the only question that matters now is whether anybody typed into it.',
      standIn:
        'It is a phishing page in a file. Base64 block decoding to a login screen with our logo and ' +
        'the finance portal wording, username and password fields, posting to an address on the ' +
        'internet. No exploit, no macro, no download, nothing executable, which is why nothing ' +
        'flagged it. It is a form. And there is no dodgy link to spot, because the page is on the ' +
        'machine and the address bar says local file. This is credential harvesting. The only ' +
        'question now is whether anybody typed into it.',
      commandOptions: [
        { command: "grep -o 'base64,[A-Za-z0-9+/=]*' /evidence/Statement_Aug.htm | cut -d, -f2 | base64 -d | grep -iE 'form|action|input'", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -oiE "https?://[^\\"\\x27 ]+" /evidence/Statement_Aug.htm | sort -u', correct: true, teaches: ALSO_WORKS },
        { command: 'curl -s https://203.0.113.156/collect', ...TOUCH_ATTACKER },
        { command: 'cat /evidence/Statement_Aug.htm', ...DUMP_ALL },
        { command: 'firefox /evidence/Statement_Aug.htm', ...MUTATE },
      ],
      commandNudge:
        'Decode the base64 block and look for a form and where it sends its data.',
      guidance:
        'Nothing flagged this file. Ask what it does when somebody opens it.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1056.003'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['forensics', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.dismiss', 'act.attribute-named', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'One hundred and eighty bytes is the whole incident. Two workstations reached that address ' +
        'this morning and they did completely different things: 4410 connected, sent nothing, and ' +
        'dropped after two seconds, which is somebody opening a page, distrusting it and closing ' +
        'it, and that person then reported the email. 4188 sent a POST of 180 bytes and got a 302 ' +
        'back, and 180 bytes is about the size of a username and a password. The redirect matters ' +
        'too, because it is what sends the person to the real portal afterwards so that nothing ' +
        'feels wrong. No other host in the estate has touched that address in ninety days, which ' +
        'bounds this to two people out of thirty-four who received it. Get the second account ' +
        'named and moving now; everything else on this board can wait behind that.',
      standIn:
        'One hundred and eighty bytes is the incident. Two machines reached that address. 4410 ' +
        'connected, sent nothing, dropped after two seconds, and that is our reporter opening it ' +
        'and thinking better of it. 4188 posted 180 bytes and got a 302 back, which is about a ' +
        'username and a password, and the redirect is what sends them on to the real portal so it ' +
        'feels normal. Nothing else in the estate has touched that address in ninety days. Two out ' +
        'of thirty-four, and I need the second account named right now.',
      commandOptions: [
        { command: "awk '$5==\"203.0.113.156\" {print $1, $3, $7, $8}' /var/log/proxy/access.log", correct: true, teaches: CORRECT_STEP },
        { command: 'grep 203.0.113.156 /var/log/flows.log | tail -20', correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 203.0.113.156', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/proxy/access.log', ...DUMP_ALL },
        { command: 'grep -c 203.0.113.156 /var/log/proxy/access.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find every host that contacted that address, and how much each of them sent.',
      guidance:
        'You know where the form posts to. Go and see who posted to it.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1566.001', 'T1583.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['soc-operator', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.tune', 'act.contact-attacker'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'One report becomes thirty-four deliveries, and the sender domain explains why none of them ' +
        'were stopped. calderbrook-medical.net against the real calderbrook-medical.co.uk, which ' +
        'has been in the address book for six years, and the .net was registered eleven days ago. ' +
        'That is a domain bought for this, aimed at a supplier relationship somebody knew about, ' +
        'and it passed the gateway because it is a real domain sending real mail rather than ' +
        'anything spoofed. Thirty-four copies to finance and procurement between 09:38 and 09:47 ' +
        'is a chosen list rather than a broadcast. The number that matters for the next hour is ' +
        'thirty-four rather than one: thirty-three people still have this in their mailbox and ' +
        'nothing has told them not to open it.',
      standIn:
        'Thirty-four copies, not one. Finance and procurement, 09:38 to 09:47, sender domain ' +
        'calderbrook-medical.net where the real supplier is .co.uk and has been in our address ' +
        'book six years. The .net was registered eleven days ago. Nothing was spoofed, which is ' +
        'why the gateway passed it. Thirty-three people still have this sitting in their inbox ' +
        'right now.',
      commandOptions: [
        { command: "awk -F, '$4 ~ /calderbrook-medical.net/ {print $1, $3}' /var/log/mail/delivery.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c "calderbrook-medical.net" /var/log/mail/delivery.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mail-gateway', ...STATUS_CHECK },
        { command: 'cat /var/log/mail/delivery.csv', ...DUMP_ALL },
        { command: 'nslookup calderbrook-medical.net', ...WRONG_TARGET },
      ],
      commandNudge:
        'Find out how many copies of that message were delivered, and compare the sender domain to ' +
        'the real supplier.',
      guidance:
        'One person reported it. Ask how many people got it.',
    },
    {
      eventId: 'ev.7',
      verdict: 'malicious',
      stage: 'credential-access',
      critical: true,
      techniques: ['T1056.003'],
      firstResponder: 'forensics',
      alsoAppropriate: ['ir-lead', 'mitigation-specialist'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'The second workstation confirms it from the other end. Browser history shows the local ' +
        'file opened at 09:51 and a navigation to the collection address at 09:52, and the file is ' +
        'still sitting in the temporary folder. That matches the 180 byte POST exactly and turns ' +
        'an inference from network data into a sequence with a person and a machine attached. The ' +
        'account belongs to a procurement officer with standard access to the finance portal and ' +
        'the supplier payment system, which is the part to say out loud, because the supplier ' +
        'payment run is this afternoon. Her last successful portal sign-in was at 08:20 and there ' +
        'have been none since, so as of this minute nobody has used what was taken. Preserve the ' +
        'file and the history rather than cleaning the machine: reimaging it destroys the only ' +
        'copy of the evidence and does nothing about a credential that is already elsewhere.',
      standIn:
        'Confirmed from the other end. History on 4188 has the local file opened at 09:51 and the ' +
        'navigation to the collection address at 09:52, and the file is still in her temp folder. ' +
        'That is our 180 byte POST. Procurement officer, standard access to the finance portal and ' +
        'the supplier payment system, and the payment run is at two this afternoon. Last portal ' +
        'sign-in was 08:20 and nothing since, so nobody has used it yet. Preserving the file and ' +
        'the history, and nobody reimages that machine.',
      commandOptions: [
        { command: "awk -F, '$1 ~ /09:5/ {print $1, $3}' /evidence/ws4188/browser-history.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'sha256sum /evidence/ws4188/temp/Statement_Aug.htm | tee /evidence/ws4188/statement.sha256', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status edr-agent', ...STATUS_CHECK },
        { command: 'cat /evidence/ws4188/browser-history.csv', ...DUMP_ALL },
        { command: 'rm /evidence/ws4188/temp/Statement_Aug.htm', ...MUTATE },
      ],
      commandNudge:
        'Check the browser history on the second workstation around the time of the POST.',
      guidance:
        'The network says somebody typed into it. Go to that machine and confirm it.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'credential-access',
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reset-password', 'act.reimage-now', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Order matters more than breadth here, because one credential is out and thirty-three ' +
        'copies of the message are still sitting in mailboxes. First and immediately: the ' +
        'procurement officer\'s credential, reset and her sessions revoked, because a password ' +
        'that has been posted to somebody is not a password and the supplier payment run is at ' +
        '14:00. Second: pull all thirty-four copies from the mailboxes, which stops the next ' +
        'person opening it, and tell finance and procurement what happened in plain words, because ' +
        'the reporter did exactly the right thing and the second person will feel foolish and ' +
        'needs to be told they are not. Do not reset passwords across all of finance: thirty-four ' +
        'people re-enrolling authenticators before a payment run buys nothing, since only one ' +
        'credential went anywhere. And do not block .htm at the gateway, which is the proposal ' +
        'somebody will make in the next ten minutes and which stops around 300 pathology result ' +
        'messages a day reaching clinicians. The compensating control that does work is narrower: ' +
        'block the collection address outbound, and treat externally originated HTML attachments ' +
        'differently from internally generated ones, which is the actual distinction. Left ' +
        'undone tonight: whoever registered that domain eleven days ago can register another ' +
        'tomorrow.',
      standIn:
        'Order matters more than breadth. First, right now: reset that procurement credential and ' +
        'kill her sessions, because a password that has been posted to somebody is not a password ' +
        'and the payment run is at two. Second: pull all thirty-four copies out of the mailboxes ' +
        'and tell finance and procurement in plain words, because our reporter did exactly the ' +
        'right thing and the other one is going to feel stupid and needs telling she is not. Not ' +
        'resetting all of finance, because only one credential went anywhere and thirty-four ' +
        'authenticator re-enrolments before a payment run buys nothing. And do not block .htm at ' +
        'the gateway, which somebody will suggest within ten minutes, because that stops three ' +
        'hundred pathology results a day reaching clinicians. Block the collection address, and ' +
        'treat external HTML differently from internal, which is the real distinction.',
      commandNudge:
        'Work out how many people actually lost a credential before you decide how many to reset.',
    },
    {
      eventId: 'ev.9',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst', 'malware-analyst'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.declare', 'act.isolate', 'act.tune'],
      escalateTo: [],
      why:
        'Three hundred and twelve HTML attachments in one morning, arriving straight after the ' +
        'floor has learned to fear HTML attachments, and every one of them is a pathology result. ' +
        'Three checks close them and they are the same three that convicted the other file, run in ' +
        'the other direction: the sender is an internal system rather than an outside domain, ' +
        'there are no form elements, and there are no base64 blocks or external references. A ' +
        'results table is not a login page. Close them, and carry the distinction into the ' +
        'discussion about controls, because it is the difference between a proposal that works and ' +
        'one that gets reversed within a week. The file type was never the problem. An HTML file ' +
        'from outside the organisation containing a form that posts somewhere is the problem, and ' +
        'that is a rule that can survive contact with a hospital.',
      standIn:
        'Three hundred and twelve HTML attachments this morning and all of them are pathology ' +
        'results. Internal sender, no form elements, no base64, no external references. Same three ' +
        'checks that convicted the other file, opposite answer. A results table is not a login ' +
        'page. Closing them, and this is exactly why we do not block the file type: it was never ' +
        'the problem. External HTML with a form that posts somewhere is the problem.',
      commandOptions: [
        { command: "awk -F, '$5 ~ /\\.htm/ {print $4}' /var/log/mail/delivery.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -Lil "<form" /evidence/htm-sample/*.htm | wc -l', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status mail-gateway', ...STATUS_CHECK },
        { command: 'cat /var/log/mail/delivery.csv', ...DUMP_ALL },
        { command: 'grep -c htm /var/log/mail/delivery.csv', ...COUNT_ONLY },
      ],
      commandNudge:
        'Check who sent those 312 messages and whether any of them contain a form.',
      guidance:
        'You now distrust HTML attachments. Ask what made the bad one bad, and test for that.',
    },
  ],
};
