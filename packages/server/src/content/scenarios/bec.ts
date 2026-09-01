/**
 * Scenario 21: Change Of Bank.
 *
 * A supplier payment redirected, with no malware, no intrusion, and nothing
 * technically wrong anywhere.
 *
 * WHY THIS IS THE SCENARIO MOST FLOORS ARE WORST AT
 *
 * Every control in the estate is working. No credential was stolen from this
 * organisation, no host was compromised, no rule failed, and every system
 * involved did exactly what it was built to do. The attack is entirely against
 * a business process, executed through correctly delivered email, and the money
 * left because a person followed the procedure.
 *
 * That means the technical seats have very little to find, and the finding that
 * matters is procedural. A SOC that only knows how to answer "what did the
 * attacker run" will produce an accurate report saying nothing happened, while
 * 340,000 pounds is in somebody else's account.
 *
 * WHAT IT ACTUALLY TEACHES
 *
 * That the first hour of a payment fraud is a race against banking settlement
 * rather than an investigation, and that recall becomes impossible quickly. The
 * floor has to work out, early, that the most valuable thing it can do is get
 * the bank called, and that this outranks understanding what happened.
 *
 * THE OTHER LESSON
 *
 * `ev.2` is the compromise, and it is not ours. The supplier mailbox was taken
 * weeks ago, which is why the fraudulent message is a genuine reply inside a
 * genuine thread from a genuine address. A floor looking for a spoofed sender
 * will find nothing, because nothing was spoofed.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';

const ID = 'change-of-bank';

export const CHANGE_OF_BANK: Scenario = {
  id: ID,
  title: 'Change Of Bank',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 15:30 on a Friday. Finance called the service desk because a supplier says they have ' +
    'not been paid, and the payment went out on Tuesday. Nothing has alerted anywhere. Establish ' +
    'what happened and work out what is still worth doing about it.',
  roles: [
    'soc-operator',
    'log-analyst',
    'cloud-security',
    'threat-intel',
    'fusion-analyst',
    'forensics',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Supplier reports non-payment of an invoice settled on Tuesday for 340,000 pounds',
      detail:
        'A long-standing clinical supplies vendor says invoice 88214 is unpaid. Finance records ' +
        'show it settled on Tuesday at 11:40 to account details supplied by email on the previous ' +
        'Thursday. The payment cleared. This arrived through the service desk as a billing query ' +
        'and has been open for two hours.',
      source: 'finance',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 120,
      surface: 'raw-log',
      summary: 'The bank change request is a genuine reply from the real supplier address',
      detail:
        'The message requesting the account change is a reply within an existing eleven-message ' +
        'thread about invoice 88214, from the supplier real address, passing all authentication ' +
        'checks. It quotes the correct invoice number, purchase order and amount, and matches the ' +
        'sender usual writing style. The mail gateway scored it clean and was correct to.',
      source: 'supplier mailbox',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 280,
      surface: 'alert-queue',
      summary: 'The verification callback went to a number supplied in the same message',
      detail:
        'Finance policy requires a telephone callback to verify any bank detail change. The ' +
        'callback was made and logged. The number used was the one in the signature block of the ' +
        'change request message, which differs by two digits from the number in the supplier ' +
        'record held in the finance system. The person who answered confirmed the change.',
      source: 'finance',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 440,
      surface: 'cloud-audit',
      summary: 'No compromise of any account in this organisation',
      detail:
        'Review of authentication, mailbox rules, OAuth grants and session history for every ' +
        'finance and procurement account shows nothing anomalous in ninety days. No unusual ' +
        'sign-in, no forwarding rule, no unexpected grant, no impossible travel. Endpoint telemetry ' +
        'on the relevant workstations is clean.',
      source: 'identity platform',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.5',
      atSeconds: 600,
      surface: 'host-artefact',
      summary: 'The receiving account was opened eleven days before the payment',
      detail:
        'The destination account named in the change request was opened eleven days before the ' +
        'transfer, in a name closely resembling the supplier trading name but not identical. Banks ' +
        'typically recall funds successfully only in the first hours after a transfer, and this ' +
        'one settled three days ago.',
      source: 'finance',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.6',
      atSeconds: 760,
      surface: 'raw-log',
      summary: 'Two other suppliers received similar change requests in the last fortnight',
      detail:
        'A search of the mail archive for bank detail change language finds two further requests in ' +
        'the last fourteen days, from two different supplier addresses, both genuine replies in ' +
        'existing threads. One was actioned on the 24th for 46,000 pounds. The other is sitting in ' +
        'the finance queue awaiting the callback.',
      source: 'mail archive',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Finance mailbox received 90 blocked invoice-themed phishing messages this month',
      detail:
        'The mail gateway blocked 90 messages to finance addresses this month with invoice or ' +
        'payment themes, in line with the monthly average of 70 to 110. All were generic, ' +
        'unaddressed, and used lookalike domains. None relates to invoice 88214 or to any real ' +
        'supplier thread. Rule history: fired 30 times in thirty days, 30 closed as expected ' +
        'volume.',
      source: 'mail gateway',
      claimedSeverity: 'low',
    },
  ],
};

export const CHANGE_OF_BANK_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Somebody compromised a mailbox at the supplier, not at this organisation, some weeks ago.',
    'They read the existing thread about invoice 88214 and waited until the invoice was due.',
    'They replied inside that thread, from the real address, quoting the correct invoice number, purchase order and amount, in the sender own style.',
    'They put a phone number in the signature that differs from the supplier record by two digits, so the mandatory verification callback reached them.',
    'Finance followed the procedure exactly. The callback was made, logged, and answered by the attacker.',
    '340,000 pounds went to an account opened eleven days earlier in a name resembling the supplier trading name.',
    'Two other suppliers received the same treatment in the last fortnight. One payment of 46,000 pounds already went. The third is still in the queue and can be stopped.',
    'No control failed here and nothing in this estate was compromised. The procedure had a gap: it verified using a number the requester supplied.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1657'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['ir-lead', 'fusion-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.reimage-now', 'act.reset-password'],
      escalateTo: ['ir-lead', 'log-analyst'],
      why:
        'A billing query that has sat with the service desk for two hours, on a Friday afternoon, ' +
        'with no alert anywhere. It reaches security late because it does not look like a security ' +
        'matter, and every hour it sits reduces what can be recovered. The reasoning that makes it ' +
        'urgent is short: the supplier says unpaid, finance says paid, the payment cleared, so the ' +
        'money went somewhere that is not the supplier. That is fraud until somebody proves ' +
        'otherwise, and the correct first move is to get the bank called rather than to start ' +
        'investigating. Understanding this incident will take an hour. The recall window is already ' +
        'mostly gone.',
      standIn:
        'Supplier says invoice 88214 is unpaid, finance says it settled Tuesday for 340,000 pounds ' +
        'to details emailed the previous Thursday, and the payment cleared. Money went somewhere ' +
        'that is not the supplier. Raising it and asking finance to call the bank now, before we ' +
        'understand anything.',
      commandOptions: [
        'grep 88214 /var/log/finance/payments.log',
        "awk '/88214/ {print $1, $5, $7}' /var/log/finance/payments.log",
        'cat /var/log/servicedesk/tickets.log | grep -i 88214',
        'grep -i supplier /var/log/finance/audit.log | tail',
        'date',
      ],
      commandNudge:
        'Establish whether the payment actually left and where it went, before anything else.',
      guidance:
        'Two records disagree about whether a supplier was paid. Ask where the money actually went, ' +
        'and how long you have to stop it.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'initial-access',
      techniques: ['T1586.002', 'T1534'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['fusion-analyst', 'threat-intel'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'threat-intel'],
      why:
        'The finding that redirects the whole investigation, and it is a negative one. The message ' +
        'is a genuine reply, in a genuine eleven-message thread, from the supplier real address, ' +
        'passing every authentication check, quoting the correct invoice number, purchase order and ' +
        'amount, in the right writing style. Nothing was spoofed, so a floor hunting for a lookalike ' +
        'domain or a failed authentication check will find nothing and conclude the email was ' +
        'legitimate. It was legitimate. The mailbox that sent it is compromised, and it is not ' +
        'ours, which means the evidence of the actual intrusion sits at a company this floor has no ' +
        'access to. Say that plainly: our investigation ends at the thread, and the rest is a ' +
        'conversation between two organisations.',
      standIn:
        'The change request is a real reply inside an existing eleven-message thread, from the ' +
        'supplier real address, passing all authentication, quoting the right invoice, PO and ' +
        'amount, in their usual style. Nothing was spoofed and the gateway was right to pass it. ' +
        'Their mailbox is compromised, not ours, and we cannot see their side.',
      commandOptions: [
        'grep -A5 88214 /var/log/mail/archive.log | head -40',
        "awk '/88214/ {print $3, $5}' /var/log/mail/archive.log",
        'grep -i "dmarc\\|spf\\|dkim" /var/log/mail/auth-results.log | tail',
        'grep -c 88214 /var/log/mail/archive.log',
        'cat /var/log/mail/gateway.log | grep 88214',
      ],
      commandNudge:
        'Check whether that message is a new message or a reply inside an existing thread.',
      guidance:
        'Look at whether anything was actually spoofed. If not, ask whose mailbox is compromised.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'defense-evasion',
      techniques: ['T1598.004'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['ir-lead', 'log-analyst'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.isolate', 'act.reset-password', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The single most important finding of the hour and it is about a procedure rather than a ' +
        'system. The control existed, it was mandatory, it was followed, and it was logged. It ' +
        'failed because the callback used the number in the signature of the request itself, which ' +
        'differs from the supplier record by two digits. A verification that trusts a channel the ' +
        'requester supplied is not a verification, and this is a design flaw in the procedure, not ' +
        'a mistake by the person who followed it. The report has to be careful here: the finance ' +
        'employee did what they were told to do, and framing this as human error produces more ' +
        'training instead of the one change that fixes it, which is to call the number already on ' +
        'file.',
      standIn:
        'Finance made the mandatory verification callback and logged it. The number they called came ' +
        'from the signature block of the change request, and it differs from the number in the ' +
        'supplier record by two digits. The attacker answered. The procedure was followed exactly ' +
        'and the procedure is the flaw.',
      commandNudge:
        'Compare the number that was called against the number in the supplier record.',
      guidance:
        'The callback happened. Ask where the number came from.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      firstResponder: 'cloud-security',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.iam-audit'],
      outOfLaneActions: ['act.reset-password', 'act.isolate', 'act.declare', 'act.revoke-key'],
      escalateTo: ['ir-lead'],
      why:
        'Ninety days of clean authentication, no unusual sign-in, no forwarding rule, no unexpected ' +
        'grant, no impossible travel, clean endpoint telemetry. Establishing this properly is real ' +
        'work and the result is correct: nothing in this organisation was compromised. Two ways to ' +
        'misuse it. Reporting it as "no incident" would be wrong, because 340,000 pounds is gone. ' +
        'And continuing to hunt for an internal compromise because one feels like it must exist ' +
        'wastes the afternoon. The useful framing is that this is a bounded negative finding that ' +
        'tells the floor where to stop looking, which is worth saying explicitly so nobody quietly ' +
        'keeps looking.',
      standIn:
        'Ninety days of authentication, mailbox rules, OAuth grants and session history across ' +
        'every finance and procurement account, all clean. Endpoint telemetry clean. Nothing here ' +
        'was compromised, and that is a finding rather than an absence of one. Stop looking inside.',
      commandNudge:
        'Check the finance and procurement accounts properly, then say clearly that they are clean.',
      guidance:
        'Nothing internal was compromised and the money still went. Ask what that tells you about ' +
        'where to look.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1657'],
      firstResponder: 'forensics',
      alsoAppropriate: ['ir-lead', 'fusion-analyst'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'An account opened eleven days before the payment, in a name resembling the supplier ' +
        'trading name, which establishes premeditation: they were preparing before the invoice was ' +
        'even due, and the reply was timed rather than opportunistic. The harder half is the ' +
        'timing. Recall is realistically a matter of hours and this settled three days ago, so the ' +
        'honest position is that this money is probably not coming back. Saying that early is more ' +
        'useful than optimism, because it moves the floor onto the two things that can still change ' +
        'an outcome, which are the third pending request and the police and insurer notifications. ' +
        'Evidence handling matters more than usual because this will be an insurance claim and ' +
        'possibly a prosecution.',
      standIn:
        'Destination account was opened eleven days before the payment in a name close to the ' +
        'supplier trading name. That is premeditated. Recall usually works in the first hours and ' +
        'this settled three days ago, so I would not expect this money back. Records preserved and ' +
        'sealed for the insurer and the police.',
      commandNudge:
        'Find out when that account was opened, and how long a recall window realistically is.',
      guidance:
        'Ask what can still be changed. If the money is gone, say so and move to what is not.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'impact',
      techniques: ['T1657', 'T1534'],
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.corroborate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.isolate', 'act.declare'],
      escalateTo: ['ir-lead'],
      why:
        'The event that turns one loss into a campaign and, more importantly, the only one where ' +
        'the floor can still prevent something. Two more requests in fourteen days from two ' +
        'different supplier addresses, both genuine replies in existing threads. One already went ' +
        'for 46,000 pounds, which nobody had connected. The third is sitting in the finance queue ' +
        'awaiting its callback, and stopping it is worth more than everything else on this board ' +
        'combined. It also changes the scope of the problem: three separate supplier mailboxes ' +
        'compromised means this is somebody working a supplier ecosystem rather than a single ' +
        'unlucky vendor, and every supplier with a pending payment needs checking.',
      standIn:
        'Two more bank change requests in the last fortnight, different suppliers, both genuine ' +
        'replies in existing threads. One was actioned on the 24th for 46,000 pounds and nobody ' +
        'connected it. The third is in the finance queue waiting for its callback. Stop that one ' +
        'now. Three supplier mailboxes means this is a campaign, not one vendor.',
      commandOptions: [
        'grep -il "bank details" /var/log/mail/archive/*.eml | head',
        "awk '/account change|bank detail/ {print $1, $3}' /var/log/mail/archive.log",
        'grep -c "bank detail" /var/log/mail/archive.log',
        'grep -i "change request" /var/log/finance/queue.log',
        'cat /var/log/finance/pending.log | tail -20',
      ],
      commandNudge:
        'Search the mail archive for the same request language across every supplier, not just this ' +
        'one.',
      guidance:
        'Ask whether this happened to anybody else. Then ask whether any of those can still be ' +
        'stopped.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: [],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.corroborate'],
      escalateTo: [],
      why:
        'Ninety blocked invoice-themed phishing messages this month, inside the normal 70 to 110, ' +
        'all generic, unaddressed, using lookalike domains, none related to invoice 88214 or any ' +
        'real thread. The gateway worked. It is on the board because the floor is investigating ' +
        'invoice fraud and here is a folder full of invoice fraud, and the two are opposites: these ' +
        'are the crude version the controls catch easily, and the one that succeeded worked ' +
        'precisely because it had none of these properties. Including it would suggest the gateway ' +
        'is part of the story, and pointing an improvement effort at mail filtering would fix ' +
        'nothing here, because there was nothing wrong with the mail.',
      standIn:
        'Ninety invoice-themed messages blocked this month, inside the normal range, all generic ' +
        'lookalike-domain phishing, none connected to 88214 or any real thread. That is the gateway ' +
        'working, and it is the opposite of what got us. Closing it.',
      commandOptions: [
        'grep -c BLOCKED /var/log/mail/gateway.log',
        "awk '/BLOCKED/ {print $6}' /var/log/mail/gateway.log | sort | uniq -c | head",
        'grep 88214 /var/log/mail/gateway.log',
        'cat /var/log/mail/monthly-summary.log',
        'systemctl status mailgw',
      ],
      commandNudge:
        'Check whether any of those blocked messages relate to the invoice you are working on.',
      guidance:
        'Ask what these blocked messages have in common, and whether the one that worked had any of ' +
        'it.',
    },
  ],
};
