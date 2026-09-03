/**
 * Scenario 77: Our Own Console.
 *
 * Somebody is running commands on forty hosts through the endpoint agent, which
 * is the tool this floor would normally use to stop them.
 *
 * WHAT THIS TEACHES
 *
 * That a security tool with administrative reach across the estate is the best
 * asset an intruder can acquire, and that every reflex a floor has for
 * containment routes through it.
 *
 * The agent runs as system on four thousand endpoints by design, executes
 * arbitrary commands by design, and is trusted by every other control by
 * design. None of that is a misconfiguration and all of it is why the product
 * is worth buying. It also means that isolating a host, pulling a memory image,
 * killing a process and collecting evidence are all things this floor does
 * through the thing it is investigating.
 *
 * WHY THE CONSOLE LOOKS FINE
 *
 * Because the console is the wrong place to look. Its audit records three
 * actions this week and the hosts themselves record forty. Somebody reading the
 * console will conclude nothing is happening, and will be reading an account
 * written by the component under suspicion.
 *
 * EXPERT INSTRUMENTS IN USE
 *
 * The console's account and the hosts' account of the same week disagree, and
 * they reach different seats. How the console was reached is withheld, so the
 * floor has to conclude that something authenticated without seeing it. And
 * whether the route was the vendor's own standing support access cannot be
 * settled, because those logs belong to the vendor.
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

const ID = 'our-own-console';

export const OUR_OWN_CONSOLE: Scenario = {
  id: ID,
  title: 'Our Own Console',
  difficulty: 'expert',
  durationMinutes: 90,
  situation:
    'It is 15:20 at Ardal Freight. A partner says traffic from our address range has been probing ' +
    'theirs for two days. Nothing on our own console shows anything at all.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
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
      summary: 'A partner reports scanning from our address range',
      detail:
        'A logistics partner emailed at 14:50 with two days of firewall logs showing connection ' +
        'attempts from six Ardal public addresses against their customs integration endpoints. ' +
        'Their timestamps run from Monday 22:10. Nothing in the Ardal endpoint console, the SIEM ' +
        'or the perimeter alerts has fired in that window. Rule history: outbound scanning ' +
        'detection exists and has fired 4 times in ninety days, all penetration tests.',
      source: 'partner escalation',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.2',
      atSeconds: 160,
      surface: 'host-artefact',
      summary: 'Forty hosts ran commands they have no record of being told to run',
      detail:
        'Local execution history on ADF-WS-1180 shows a process spawned by the endpoint agent ' +
        'service at 22:07 Monday, running a network sweep utility with a target list. The same ' +
        'parent, the same utility and the same timestamps appear on 39 other workstations. The ' +
        'agent service is signed by the vendor, is the current version, and passes its own ' +
        'integrity check.',
      expertDetail:
        'The endpoint console activity log for this week records three live response sessions: two ' +
        'on Tuesday by a named analyst for a malware investigation, and one on Wednesday by the ' +
        'service desk to collect a log bundle. All three are closed with notes. No session covers ' +
        'Monday evening and no bulk action appears anywhere in the record.',
      expertAlsoOn: ['alert-queue'],
      source: 'ADF-WS-1180',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 340,
      surface: 'process-tree',
      summary: 'The agent is the parent of every one of them',
      detail:
        'On all forty hosts the sweep utility is a direct child of the endpoint agent service, ' +
        'running as system, with no user session attached and no interactive logon in the window. ' +
        'The utility itself is a signed operating system component. The agent has an approved live ' +
        'response capability that executes arbitrary commands as system on any enrolled host, which ' +
        'is how the product is designed and how the floor uses it every week.',
      source: 'ADF-WS-1180',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 520,
      surface: 'raw-log',
      withheldAtExpert: true,
      summary: 'A console session opened from an address nobody recognises',
      detail:
        'The identity platform records a successful sign-in to the endpoint console at 21:58 Monday ' +
        'for the account svc-edr-integration, from 198.51.100.19. That account exists to let the ' +
        'ticketing system raise alerts into the console and has held the operator role since 2023. ' +
        'It has no multi-factor enrolment because it is a service account, and the console does not ' +
        'distinguish interactive sign-ins from API use.',
      source: 'identity platform',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 700,
      surface: 'network-flow',
      summary: 'The sweep went out through six hosts with public addresses',
      detail:
        'Six of the forty hosts sit on a segment with public addressing for a legacy customs ' +
        'integration. Those six carry all of the traffic the partner reported: 41,000 connection ' +
        'attempts across two days against their published endpoints. The other thirty-four ran the ' +
        'same utility against internal ranges and produced 900,000 internal connection attempts ' +
        'that nothing alerted on.',
      source: 'network monitoring',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 880,
      surface: 'alert-queue',
      summary: 'Every control that should have seen this trusts the agent',
      detail:
        'The endpoint agent is excluded from its own behavioural detection, which is standard and ' +
        'documented, because an agent that alerts on its own actions produces nothing but noise. ' +
        'The SIEM ingests alerts from the console rather than reading the agent directly. The ' +
        'network detection for internal sweeping is tuned to exclude the vulnerability scanner and ' +
        'the agent, both of which sweep legitimately. Nothing in the estate was watching the one ' +
        'process that did this.',
      source: 'detection coverage',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 1060,
      surface: 'cloud-audit',
      expertOnly: true,
      summary: 'The vendor holds standing access and will not say whether it was used',
      detail:
        'The support agreement grants the vendor a standing administrative tenant into the Ardal ' +
        'console for diagnostics, which is enabled and has been since 2023. Vendor actions appear ' +
        'in the Ardal console under a support principal and none are recorded this week. The ' +
        'vendor has confirmed that their own access logs are held on their side, that they show no ' +
        'session against this tenant, and that they will not release the underlying records. ' +
        '198.51.100.19 is not in any published vendor range.',
      source: 'vendor support',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.8',
      atSeconds: 1240,
      surface: 'alert-queue',
      summary: 'Every containment action goes through the compromised tool',
      detail:
        'Isolating a host, killing a process, collecting a memory image and pulling a file are all ' +
        'performed through the endpoint console. The agent runs on 4,100 endpoints including all ' +
        'domain controllers and the customs filing servers. Uninstalling it estate-wide takes a ' +
        'change window and removes all endpoint visibility while it is gone. The customs filing ' +
        'window opens at 04:00.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1420,
      surface: 'alert-queue',
      summary: 'What the sweep was for',
      detail:
        'The internal sweep targeted 900,000 addresses and recorded which responded on 22, 445, ' +
        '3389 and 1433. No credential was used, nothing was exploited, and nothing was copied. The ' +
        'external sweep against the partner probed the same four ports. Two days of activity ' +
        'produced a map of the estate and of one partner, and nothing else.',
      source: 'incident assessment',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.10',
      atSeconds: 1600,
      surface: 'host-artefact',
      summary: 'The agent also swept last Thursday, and that one was ours',
      detail:
        'The same utility ran from the same agent parent on 120 hosts last Thursday at 02:00 ' +
        'against internal ranges. A change record covers it, the console activity log records a ' +
        'bulk action by a named engineer with a ticket reference, it ran against the documented ' +
        'asset discovery target list, and the results appear in the asset inventory import that ' +
        'ran at 04:00 the same morning.',
      source: 'ADF-WS-2210',
      claimedSeverity: 'medium',
    },
  ],
};

export const OUR_OWN_CONSOLE_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'At 21:58 on Monday somebody signed in to the Ardal endpoint console as svc-edr-integration, a service account that has held the operator role since 2023, has no multi-factor enrolment because it is a service account, and is used by the ticketing system to raise alerts into the console.',
    'From 22:07 they used the console live response capability, which executes arbitrary commands as system on any enrolled host and is how the floor works every week, to run a network sweep utility on forty workstations.',
    'Six of those forty sit on a segment with public addressing for a legacy customs integration, and produced the 41,000 connection attempts the partner reported. The other thirty-four produced 900,000 internal connection attempts that nothing alerted on.',
    'The console activity log records three live response sessions this week, none of them on Monday, and no bulk action at all. The hosts record forty. The console is the component under suspicion and is describing its own week.',
    'Nothing in the estate was watching. The agent is excluded from its own behavioural detection, which is standard and documented because an agent alerting on itself is noise. The SIEM ingests console alerts rather than reading the agent. The internal sweep detection excludes the agent and the vulnerability scanner, both of which sweep legitimately.',
    'The sweep recorded which addresses responded on 22, 445, 3389 and 1433. No credential was used, nothing was exploited, nothing was copied. Two days produced a map of the estate and of one partner.',
    'The vendor holds a standing administrative tenant into the console, enabled since 2023, and says their own logs show no session. Those logs are theirs and they will not release them.',
    'Every containment action this floor knows how to take is performed through the console.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'discovery',
      techniques: ['T1595.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.declare'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'network-analyst'],
      why:
        'Somebody outside told us, with two days of their own firewall logs, and nothing in this ' +
        'estate fired at all. Take the second half of that as seriously as the first: the outbound ' +
        'scanning detection exists, it works, it has fired four times in ninety days on penetration ' +
        'tests, and it did not fire on two days of scanning that a partner could see from outside. ' +
        'A control that catches the authorised version of an activity and misses the unauthorised ' +
        'one is not merely quiet, it is telling you something about how the activity was performed. ' +
        'Declare on it, and resist the immediate instinct to isolate anything, because nobody yet ' +
        'knows which hosts are involved and the tool that would isolate them has not been ' +
        'established as trustworthy.',
      standIn:
        'A partner told us, with two days of their own firewall logs, and nothing here fired. Our ' +
        'outbound scanning detection works and has fired four times in ninety days on pen tests, ' +
        'and it missed two days of scanning somebody could see from outside. A control that catches ' +
        'the authorised version and misses the unauthorised one is telling us how this was done. ' +
        'Declaring, and nobody isolates anything yet.',
      commandOptions: [
        { command: "awk '$3 ~ /^203\\.0\\.113\\./ && $9==\"SYN\" {print $3}' /var/log/perimeter/flows.log | sort | uniq -c | sort -rn | head", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -c "OUTBOUND_SCAN" /var/log/detection/alerts.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status edr-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/perimeter/flows.log', ...DUMP_ALL },
        { command: 'nmap -Pn 198.51.100.19', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Find which of our addresses the partner saw, and check whether anything of ours fired.',
      guidance:
        'They saw it and we did not. Ask what would have had to be true for us to miss it.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'execution',
      critical: true,
      techniques: ['T1059', 'T1072'],
      firstResponder: 'forensics',
      alsoAppropriate: ['log-analyst', 'fusion-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain', 'act.timeline'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'Two accounts of the same week and they do not agree. The console activity log records ' +
        'three live response sessions, all on other days, all closed with notes, and no bulk action ' +
        'anywhere. The hosts record forty machines running a network sweep at 22:07 on Monday with ' +
        'the agent service as parent. Choosing between them is not a judgement call: the console ' +
        'is the component under suspicion and this is its account of its own week, while the host ' +
        'execution history was written by forty machines that have no stake in the answer. Take the ' +
        'hosts. Then take the harder implication, which is that anybody who checks the console and ' +
        'finds it clean has not cleared anything and will believe they have. Preserve the host ' +
        'artefacts by a route that does not go through the agent, because collecting evidence about ' +
        'a tool using that tool is the same mistake in a different order.',
      standIn:
        'Two accounts of this week and they disagree. The console says three live response sessions, ' +
        'none on Monday, no bulk action. Forty hosts say a network sweep at 22:07 with the agent as ' +
        'parent. That is not a judgement call: the console is the thing we are investigating and ' +
        'this is its account of itself, and the hosts have no stake. I am taking the hosts. And ' +
        'anybody who checks the console and finds it clean has cleared nothing. Collecting this ' +
        'evidence without using the agent to do it.',
      commandOptions: [
        { command: "awk -F'|' '$1 ~ /22:0/ {print $1, $3, $5}' /evidence/ws1180/exec-history.csv", correct: true, teaches: CORRECT_STEP },
        { command: 'sha256sum /evidence/ws1180/exec-history.csv | tee /evidence/ws1180/exec.sha256', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status edr-agent', ...STATUS_CHECK },
        { command: 'cat /evidence/ws1180/exec-history.csv', ...DUMP_ALL },
        { command: 'edr-cli collect --host ADF-WS-1180 --memory', ...MUTATE },
      ],
      commandNudge:
        'Compare what the console says happened this week against what the hosts recorded.',
      guidance:
        'Two records describe the same week. Ask which one has a stake in the answer.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'execution',
      critical: true,
      techniques: ['T1072'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['forensics', 'fusion-analyst', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'The agent is the parent on all forty, running as system, with no user session and no ' +
        'interactive logon in the window. That is not a compromise of the agent, and being precise ' +
        'about the difference is the whole of this row: nothing was injected, nothing was patched, ' +
        'the binary is signed and current and passes its own integrity check. The live response ' +
        'capability executes arbitrary commands as system on any enrolled host, by design, and is ' +
        'how this floor works every week. So the product did exactly what it is sold to do for ' +
        'somebody who should not have been able to ask. The uncomfortable consequence is that ' +
        'nothing about these forty hosts is anomalous at the host level: an agent spawning a signed ' +
        'system utility as system is the most ordinary event on the machine, and there is no ' +
        'artefact on any of them that would look wrong to anybody examining one in isolation.',
      standIn:
        'The agent is the parent on all forty, as system, no user session, no interactive logon. ' +
        'And the agent is not compromised: signed, current, passes its own integrity check, nothing ' +
        'injected or patched. Live response runs arbitrary commands as system on any enrolled host ' +
        'by design, which is how we work every week. The product did exactly what it is sold to do ' +
        'for somebody who should not have been able to ask. Which means nothing on these hosts ' +
        'looks wrong in isolation.',
      commandOptions: [
        { command: "awk -F'|' '$4==\"PROCESS_START\" {print $5, $6}' /evidence/ws1180/exec-history.csv | sort | uniq -c", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -icE "interactive|logon" /evidence/ws1180/security-events.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status edr-agent', ...STATUS_CHECK },
        { command: 'cat /evidence/ws1180/security-events.csv', ...DUMP_ALL },
        { command: 'edr-cli agent restart --all', ...MUTATE },
      ],
      commandNudge:
        'Find what spawned the sweep utility, and whether anybody was logged in at the time.',
      guidance:
        'Something ran on forty machines at once. Ask what has that reach.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1078.003'],
      firstResponder: 'cloud-security',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.iam-audit', 'act.corroborate'],
      outOfLaneActions: ['act.revoke-key', 'act.attribute-named', 'act.reset-password', 'act.dismiss'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'How the console was reached, nine minutes before the first host ran anything. A successful ' +
        'sign-in as svc-edr-integration from an address with no history, an account that exists so ' +
        'the ticketing system can raise alerts, that has held the operator role since 2023, and ' +
        'that has no second factor because service accounts do not get one. The console does not ' +
        'distinguish an interactive sign-in from an API call, so a credential issued for one narrow ' +
        'machine-to-machine purpose opens the full operator interface to a person. Where this ' +
        'record is not available the conclusion still has to be reached and stated: forty hosts did ' +
        'not decide to sweep, live response requires an authenticated console session, and ' +
        'therefore something authenticated. Saying that out loud with no log to point at is the ' +
        'work. Do not revoke the account on this row: it is the best evidence on the floor and it ' +
        'is carrying the ticketing integration.',
      standIn:
        'Here is how they got the console, nine minutes before the first host ran anything. ' +
        'svc-edr-integration, signed in from an address with no history. That account exists so the ' +
        'ticketing system can raise alerts, it has had the operator role since 2023, and it has no ' +
        'second factor because service accounts do not get one. The console cannot tell an ' +
        'interactive sign-in from an API call, so a machine credential opened the full operator ' +
        'interface to a person. Not revoking it yet: it is our best evidence and it is holding up ' +
        'ticketing.',
      commandOptions: [
        { command: "awk -F, '$2==\"svc-edr-integration\" {print $1, $4, $5}' /var/log/identity/signin.csv | tail -20", correct: true, teaches: CORRECT_STEP },
        { command: 'grep -i "svc-edr-integration" /evidence/identity/role-assignments.csv', correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status identity', ...STATUS_CHECK },
        { command: 'cat /var/log/identity/signin.csv', ...DUMP_ALL },
        { command: 'net user svc-edr-integration /active:no /domain', ...MUTATE },
      ],
      commandNudge:
        'Live response needs a console session. Find out what signed in before 22:07.',
      guidance:
        'Forty hosts did not decide to do this. Ask what had to happen first.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'discovery',
      critical: true,
      techniques: ['T1046'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.isolate', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead', 'threat-intel'],
      why:
        'The partner saw six hosts and the incident is forty. Six of them sit on a segment with ' +
        'public addressing for a legacy customs integration, which is why those six were visible ' +
        'from outside and the other thirty-four were not, and that is an accident of addressing ' +
        'rather than a choice anybody made. The proportions matter: 41,000 external attempts is ' +
        'what got noticed, and 900,000 internal attempts is what actually happened and what nothing ' +
        'alerted on. The floor is here because six machines happened to have public addresses, and ' +
        'if this had run on the other thirty-four alone nobody would know about it at all. Say ' +
        'that plainly in the readout, because the natural framing is that a partner did us a favour ' +
        'and the accurate framing is that the estate has no ability to see 900,000 internal ' +
        'connection attempts in two days.',
      standIn:
        'The partner saw six and it is forty. Those six are on a segment with public addressing for ' +
        'the legacy customs integration, so they were visible from outside by accident of ' +
        'addressing. Forty-one thousand external attempts got noticed. Nine hundred thousand ' +
        'internal attempts did not. If this had run only on the other thirty-four we would not know ' +
        'about it. That goes in the readout in those words, because the story is not that a partner ' +
        'helped us, it is that we cannot see 900,000 internal connections in two days.',
      commandOptions: [
        { command: "awk '$3 ~ /ADF-WS/ && $9==\"SYN\" {print $3}' /var/log/flows.log | sort | uniq -c | sort -rn | head -45", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$5 ~ /^10\\./ {c++} END {print c}' /var/log/flows.log", correct: true, teaches: ALSO_WORKS },
        { command: 'nmap -Pn 198.51.100.19', ...TOUCH_ATTACKER },
        { command: 'cat /var/log/flows.log', ...DUMP_ALL },
        { command: 'netstat -an | grep SYN', ...WRONG_TARGET },
      ],
      commandNudge:
        'The partner saw six addresses. Find out how many hosts actually ran the sweep.',
      guidance:
        'They reported what they could see. Ask what they could not.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      techniques: ['T1562.001'],
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.propose-rule', 'act.backtest'],
      outOfLaneActions: ['act.write-rule', 'act.dismiss', 'act.isolate', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Three exclusions, each one correct on its own terms, and together they are a hole shaped ' +
        'exactly like this incident. The agent is excluded from its own behavioural detection, ' +
        'which is standard and documented because an agent that alerts on its own actions produces ' +
        'nothing but noise. The SIEM ingests alerts from the console rather than reading the agent, ' +
        'which is how every deployment of this product works. The internal sweep detection excludes ' +
        'the agent and the vulnerability scanner because both sweep legitimately. Nobody made a ' +
        'mistake and the estate had no coverage of the one process capable of running commands ' +
        'everywhere. The proposal has to start by admitting what cannot be fixed: an agent cannot ' +
        'usefully alert on itself, so the answer is not to remove the exclusion. It is to watch ' +
        'the agent from somewhere that is not the agent, which is network telemetry the estate ' +
        'already collects. Internal connection fan-out per source host, independent of process, ' +
        'would have fired on thirty-four machines within minutes and needs nothing new. Backtest it ' +
        'against the legitimate Thursday sweep before promising anything, because that one looks ' +
        'identical at the network layer and will be the first thing it catches.',
      standIn:
        'Three exclusions, each correct on its own, and together they are this incident exactly. The ' +
        'agent is excluded from its own behavioural detection, which is standard, because an agent ' +
        'alerting on itself is pure noise. The SIEM reads console alerts rather than the agent. The ' +
        'sweep detection excludes the agent and the scanner because both sweep legitimately. Nobody ' +
        'erred and we had no coverage of the one process that can run commands everywhere. And I am ' +
        'not proposing removing the exclusion, because an agent cannot usefully watch itself. Watch ' +
        'it from the network instead: connection fan-out per source host, no process involved, ' +
        'fires on thirty-four machines in minutes. It will also fire on our own Thursday sweep, ' +
        'which is what I need to backtest.',
      commandOptions: [
        { command: 'grep -iE "exclude|exception" /evidence/detection/edr-policy.yaml /evidence/detection/network-rules.yaml', correct: true, teaches: CORRECT_STEP },
        { command: "awk '{print $3}' /var/log/flows.log | sort | uniq -c | sort -rn | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status detection-engine', ...STATUS_CHECK },
        { command: 'cat /evidence/detection/edr-policy.yaml', ...DUMP_ALL },
        { command: 'grep -c exclude /evidence/detection/edr-policy.yaml', ...COUNT_ONLY },
      ],
      commandNudge:
        'Find every exclusion that mentions the endpoint agent, across every control.',
      guidance:
        'Nothing fired. Ask what each control was told to ignore.',
    },
    {
      eventId: 'ev.7',
      verdict: 'ambiguous',
      leaning: 'benign',
      wouldSettleIt:
        'The vendor\'s own access logs for their support tenant on Monday evening, which would show ' +
        'whether a session existed against the Ardal console and from where. They exist, the vendor ' +
        'has read them and states they show nothing, and they will not release the underlying ' +
        'records.',
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['cloud-security', 'threat-intel', 'ir-lead'],
      correctActions: ['act.investigate-hold', 'act.corroborate'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.contact-attacker', 'act.declare'],
      escalateTo: ['ir-lead'],
      why:
        'A standing administrative tenant into this console, enabled since 2023, held by a company ' +
        'that has read its own logs and says there is nothing there. That is not evidence and it is ' +
        'not nothing: the Ardal console records no vendor support principal activity this week, and ' +
        '198.51.100.19 is not in any published vendor range, both of which point away from the ' +
        'vendor. Lean that way and stop, because the two facts that would settle it are on the ' +
        'other side of a company boundary, the vendor is asserting a negative about its own ' +
        'systems, and an organisation investigating itself and reporting no findings is the ' +
        'weakest form of assurance there is regardless of good faith. What is worth stating ' +
        'precisely is what remains open rather than who is suspected: a route into this console ' +
        'exists that Ardal cannot see, cannot log, and cannot close without ending the support ' +
        'agreement, and that is true whether or not it was used on Monday. Certainty in either ' +
        'direction is the failure here, and certainty toward the vendor is the more expensive one, ' +
        'because it is an accusation against a supplier on an address that is not theirs.',
      standIn:
        'They have had a standing admin tenant into our console since 2023, they have read their own ' +
        'logs, and they say there is nothing. Our console shows no vendor principal this week and ' +
        'that address is not in any of their ranges, so I lean away from them. And I stop there, ' +
        'because the things that would settle it are on the other side of a company boundary and ' +
        'an organisation investigating itself and finding nothing is the weakest assurance there ' +
        'is, good faith or not. What I will state is what stays open: there is a route into this ' +
        'console we cannot see, cannot log and cannot close without ending the support agreement, ' +
        'and that is true either way.',
      commandNudge:
        'Establish what standing access the support agreement grants, and who holds the logs for it.',
    },
    {
      eventId: 'ev.8',
      verdict: 'malicious',
      stage: 'defense-evasion',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.reset-password', 'act.attribute-named'],
      escalateTo: ['ir-lead'],
      why:
        'Every containment this floor knows how to perform goes through the tool under ' +
        'investigation. Isolating a host, killing a process, pulling a memory image and collecting ' +
        'a file are all console actions, so the standard response is to send instructions to the ' +
        'thing that may still be taking instructions from somebody else. Uninstalling the agent ' +
        'estate-wide is available and is worse than it sounds: 4,100 endpoints including every ' +
        'domain controller and the customs filing servers, a change window, and a period with no ' +
        'endpoint visibility at all on a night when the customs window opens at 04:00. So the ' +
        'containment has to happen somewhere the console has no reach. Revoke the console session ' +
        'and the operator role from svc-edr-integration at the identity platform rather than in ' +
        'the console, which removes the capability without asking the compromised system to ' +
        'cooperate. Block the six public-addressed hosts outbound at the perimeter, which stops ' +
        'what the partner is seeing and touches no endpoint. Then the compensating control while ' +
        'the agent stays installed and trusted: network fan-out monitoring, which watches the tool ' +
        'from outside itself and is the only thing on this list that would catch a repeat tonight. ' +
        'Establish the rollback on the identity change before it goes in, because that account ' +
        'carries the ticketing integration and breaking it at 15:20 loses the queue. Deliberately ' +
        'left undone and said plainly: the agent keeps system-level execution on 4,100 endpoints ' +
        'tonight, because removing it costs more visibility than it buys, and the vendor tenant ' +
        'stays open because closing it ends the support agreement and that is not this floor\'s ' +
        'call.',
      standIn:
        'Everything we know how to do goes through the thing we are investigating. Isolate, kill, ' +
        'image, collect: all console actions, all of them sending instructions to something that ' +
        'may still be taking instructions from somebody else. Uninstalling estate-wide is 4,100 ' +
        'endpoints including every domain controller, a change window, and no endpoint visibility ' +
        'on a night when customs opens at 04:00. So contain where the console cannot reach: revoke ' +
        'the session and the operator role at the identity platform, not in the console, and block ' +
        'the six public-addressed hosts outbound at the perimeter. Compensating control while the ' +
        'agent stays: network fan-out monitoring, the only thing here that catches a repeat ' +
        'tonight. Rollback on the identity change first, because that account carries ticketing. ' +
        'Left undone: the agent keeps system execution on 4,100 endpoints, and the vendor tenant ' +
        'stays open because closing it ends the support agreement and that is not ours to decide.',
      commandNudge:
        'List every containment action available and mark which of them go through the console.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'discovery',
      critical: true,
      techniques: ['T1046'],
      firstResponder: 'threat-intel',
      alsoAppropriate: ['fusion-analyst', 'ir-lead'],
      correctActions: ['act.assess-actor', 'act.predict', 'act.ttp-map'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.dismiss', 'act.isolate'],
      escalateTo: ['ir-lead'],
      why:
        'Two days of the most powerful access available in this estate, spent entirely on looking. ' +
        'Ports 22, 445, 3389 and 1433 across 900,000 internal addresses and one partner, no ' +
        'credential used, nothing exploited, nothing copied. Somebody who can run commands as ' +
        'system on 4,100 endpoints could have done almost anything and instead built a map, which ' +
        'is not restraint and is not failure: it is the first phase of an operation by somebody who ' +
        'intends to be here for a while and is deciding where to go. The prediction is the useful ' +
        'output and it should be specific: the next action uses what the map found, which is ' +
        'whatever answered on 445 and 1433, and it will arrive through the same console because ' +
        'that access has not been taken away. Say what cannot be said too: nothing here identifies ' +
        'anybody. The tooling is a signed operating system component, the technique is documented ' +
        'in the vendor\'s own manual, and the only infrastructure is one address with no history.',
      standIn:
        'Two days of the most powerful access in this estate and they spent it looking. Ports 22, ' +
        '445, 3389 and 1433 across 900,000 internal addresses and one partner. No credential used, ' +
        'nothing exploited, nothing copied. Somebody who can run commands as system on 4,100 ' +
        'endpoints built a map instead. That is not restraint, it is phase one by somebody who ' +
        'plans to be here a while. What comes next uses what the map found, which is whatever ' +
        'answered on 445 and 1433, and it comes through the same console because we have not taken ' +
        'that away. And I cannot tell you who: signed OS tooling, a technique from the vendor ' +
        'manual, one address with no history.',
      commandNudge:
        'Work out what the sweep collected and what it did not do, then say what the next move ' +
        'needs.',
    },
    {
      eventId: 'ev.10',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['forensics', 'detection-engineer'],
      correctActions: ['act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.isolate', 'act.declare', 'act.attribute-named'],
      escalateTo: [],
      why:
        'The same utility, the same agent parent, 120 hosts, and it is asset discovery. Four checks ' +
        'close it and every one of them is a property Monday lacked: a change record covers it, the ' +
        'console activity log records a bulk action by a named engineer with a ticket reference, it ' +
        'ran against the documented discovery target list rather than everything, and the results ' +
        'appear in the asset inventory import that ran two hours later. That last one is the ' +
        'strongest and is the cheapest to check, because a sweep whose output landed somewhere it ' +
        'was supposed to land is a sweep somebody meant to run. Close it. The row exists because ' +
        'the floor is about to propose network fan-out monitoring, and this is precisely what that ' +
        'rule will fire on: the legitimate version is indistinguishable at the network layer and ' +
        'nearly identical on the host, and the only things that separate them are a change record ' +
        'and where the results went. A rule that cannot use those will be switched off inside a ' +
        'month.',
      standIn:
        'Same utility, same agent parent, 120 hosts, and it is our own asset discovery. Change ' +
        'record covers it, console log has a bulk action by a named engineer with a ticket, it ran ' +
        'against the documented target list rather than everything, and the results are in the ' +
        'inventory import two hours later. That last one is the cheapest check and the strongest: ' +
        'output that landed where it was meant to land was meant to run. Closing it. And this is ' +
        'exactly what the new fan-out rule will fire on, because at the network layer these two are ' +
        'identical and only the change record tells them apart.',
      commandOptions: [
        { command: 'grep -i "asset discovery" /var/log/change/all-changes.csv', correct: true, teaches: CORRECT_STEP },
        { command: "awk -F, '$1 ~ /09-25/ {print $3, $5}' /var/log/inventory/import.csv | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status edr-agent', ...STATUS_CHECK },
        { command: 'cat /var/log/change/all-changes.csv', ...DUMP_ALL },
        { command: 'edr-cli isolate --host ADF-WS-2210', ...MUTATE },
      ],
      commandNudge:
        'Check whether a change record covers Thursday, and whether the results went anywhere.',
      guidance:
        'It looks the same as Monday. Ask what is different about it.',
    },
  ],
};
