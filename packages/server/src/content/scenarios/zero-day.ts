/**
 * Scenario 10: No Patch.
 *
 * An unauthenticated flaw in the patient portal's document viewer, being
 * exploited before anybody has published anything about it.
 *
 * WHAT THIS TEACHES
 *
 * That the tooling is silent when the thing is new, and that this is not a
 * failure of the tooling. The vulnerability scanner reports the portal clean and
 * it is telling the truth: there is no CVE, no signature, no advisory, and no
 * patch. Every control in the estate that works by comparing against a list of
 * known bad things has nothing to compare against.
 *
 * So the only thing left is behaviour. A component that has never spawned a
 * process spawns one. A request pattern that has never appeared appears from
 * twelve addresses in an afternoon. Neither of those needs anybody to know what
 * the flaw is, which is the point: the floor can scope, contain and report this
 * fully without ever understanding the bug.
 *
 * THE SCORED TRAP
 *
 * The instinct is to wait for identification, because analysts are trained that
 * you cannot fix what you have not identified. Here the vendor advisory does not
 * exist and will not exist today. A floor that holds off on containment pending
 * a CVE number will still be waiting when the shift ends. `ev.5` is graded on
 * acting without it.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';

const ID = 'no-patch';

export const NO_PATCH: Scenario = {
  id: ID,
  title: 'No Patch',
  difficulty: 'beginner',
  durationMinutes: 60,
  situation:
    'It is 16:20. The patient portal has been slow since lunchtime and the application team ' +
    'thinks it is a memory leak. Everything is patched, the scanner says the estate is clean, and ' +
    'no threat feed has anything. Work out whether they are right.',
  roles: [
    'soc-operator',
    'log-analyst',
    'network-analyst',
    'malware-analyst',
    'threat-intel',
    'vulnerability-analyst',
    'forensics',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Patient portal worker processes restarting repeatedly since 12:40',
      detail:
        'The portal application has restarted 47 worker processes since 12:40, against a normal ' +
        'figure of two or three a day. Each restart follows a crash in the document rendering ' +
        'component. Memory usage is normal and the application team has raised it as a suspected ' +
        'memory leak. Rule history: fired 12 times in thirty days, 12 closed as application ' +
        'instability.',
      source: 'rmg-portal',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.2',
      atSeconds: 150,
      surface: 'raw-log',
      summary: 'Crashes all follow uploads to the document preview endpoint',
      detail:
        'Every one of the 47 crashes is preceded within two seconds by a POST to ' +
        '/portal/documents/preview carrying a file. The uploads are between 900 bytes and 4 KB, ' +
        'far smaller than the typical scan or referral document. Forty-four crashed. Three ' +
        'returned 200 and did not crash, at 14:02, 14:19 and 15:51.',
      source: 'rmg-portal',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.3',
      atSeconds: 320,
      surface: 'network-flow',
      summary: 'The uploads come from twelve addresses across four hosting ranges',
      detail:
        'The 47 uploads originate from twelve distinct addresses in 203.0.113.0/24 and ' +
        '198.51.100.0/24. None has any prior history with the portal. The pattern is not a single ' +
        'source retrying: the addresses interleave, and the payloads differ slightly each time in ' +
        'a way consistent with adjusting an offset.',
      source: 'multiple',
      target: 'rmg-portal:443',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.4',
      atSeconds: 470,
      surface: 'process-tree',
      summary: 'Document renderer spawned a shell at 15:51, the first time in its history',
      detail:
        'At 15:51:22 the document rendering component spawned a shell process, which ran a single ' +
        'command writing a file to the web root and then exited. This component has never spawned ' +
        'a child process in eighteen months of process telemetry. The shell ran as the application ' +
        'service account.',
      source: 'rmg-portal',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.5',
      atSeconds: 620,
      surface: 'alert-queue',
      summary: 'Vulnerability scanner reports the portal and its dependencies fully patched',
      detail:
        'The scheduled scan completed at 16:00 and reports no missing patches, no known ' +
        'vulnerable versions, and no findings above informational for the portal stack. The ' +
        'document rendering library is on its current release. No CVE exists for it, no vendor ' +
        'advisory has been published, and no threat feed has any indicator matching this traffic.',
      source: 'scanner',
      claimedSeverity: 'low',
    },
    {
      id: 'ev.6',
      atSeconds: 780,
      surface: 'host-artefact',
      summary: 'A small script written to the portal web root at 15:51',
      detail:
        'A 1.4 KB file was written to the portal web root at 15:51:24 with the service account as ' +
        'owner. It accepts a parameter and passes it to a system shell, returning the output. It ' +
        'has been requested four times since it was written, from two of the same twelve ' +
        'addresses.',
      source: 'rmg-portal',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.7',
      atSeconds: 890,
      surface: 'alert-queue',
      summary: 'Intrusion prevention blocked 3,100 exploit attempts against the perimeter today',
      detail:
        'Perimeter IPS blocked 3,100 attempts matching signatures for known web application ' +
        'exploits, in line with the daily average of 2,800 to 3,400. All were against ' +
        'vulnerabilities the estate does not run and all were dropped at the edge. None of them ' +
        'targeted the portal. Rule history: fired 30 times in thirty days, 30 closed as expected ' +
        'background.',
      source: 'perimeter IPS',
      claimedSeverity: 'medium',
    },
  ],
};

export const NO_PATCH_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Somebody found a flaw in the document rendering component of the patient portal that nobody has published.',
    'From 12:40 they worked on it live, uploading small malformed files from twelve addresses and adjusting after each crash.',
    'Forty-four attempts crashed the worker. Three did not, and the third one at 15:51 gave them execution.',
    'It spawned a shell as the application service account and wrote a 1.4 KB script into the web root.',
    'That script has been used four times since. It is a working remote shell into the portal.',
    'The vulnerability scanner is correct that everything is patched. There is no CVE, no advisory and no patch to apply.',
    'Nothing in the estate that works by matching a known bad thing could have caught this, and nothing did. The behaviour was visible from 12:40.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'execution',
      techniques: ['T1499.004'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['log-analyst'],
      correctActions: ['act.triage-high'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.isolate', 'act.declare'],
      escalateTo: ['log-analyst'],
      why:
        'Forty-seven crashes against a normal two or three, and twelve of twelve previous firings ' +
        'closed as instability. The application team has already offered an explanation that fits, ' +
        'which is the most effective way an alert gets closed. Two things should stop it. Memory ' +
        'usage is normal, which is the wrong shape for a memory leak. And repeated crashes in one ' +
        'specific component is what fuzzing looks like from the defender side: somebody trying ' +
        'inputs until one does something other than crash. A crash is a security event until ' +
        'somebody shows it is not.',
      standIn:
        'Forty-seven worker restarts since 12:40 against a normal two or three, every one in the ' +
        'document rendering component. Application team says memory leak but memory usage is ' +
        'normal. Raising it.',
      commandOptions: [
        'grep -c "worker exited" /var/log/portal/app.log',
        'grep "worker exited" /var/log/portal/app.log | tail -20',
        'free -h',
        'systemctl status portal',
        'top -b -n1 | head',
      ],
      commandNudge: 'Check whether the memory numbers actually support a memory leak.',
      guidance:
        'A crash is a security event until somebody proves otherwise. Ask what the application was ' +
        'doing each time it died.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'execution',
      techniques: ['T1190'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['ir-lead', 'malware-analyst'],
      correctActions: ['act.timeline', 'act.corroborate'],
      outOfLaneActions: ['act.isolate', 'act.reimage-now', 'act.write-rule'],
      escalateTo: ['ir-lead', 'network-analyst'],
      why:
        'Correlating the crashes to the uploads takes one join and settles what this is. Two ' +
        'details carry the weight. The files are 900 bytes to 4 KB, when real referrals and scans ' +
        'are hundreds of times larger, so these are not documents at all. And three of the ' +
        'forty-seven did not crash. That is the sentence that matters: in a fuzzing run the ' +
        'failures are the noise and the successes are the incident, so the timeline the floor needs ' +
        'is not the 44 crashes, it is what happened at 14:02, 14:19 and 15:51.',
      standIn:
        'Every crash follows a POST to the document preview endpoint within two seconds. The ' +
        'uploads are 900 bytes to 4 KB when real documents are far bigger. Forty-four crashed and ' +
        'three did not, at 14:02, 14:19 and 15:51. The three that did not are what I would look at.',
      commandOptions: [
        'grep "documents/preview" /var/log/portal/access.log | tail -40',
        "awk '$9==200 && $7 ~ /preview/' /var/log/portal/access.log",
        'grep -c preview /var/log/portal/access.log',
        'tail -50 /var/log/portal/error.log',
        'ls -la /var/portal/uploads/',
      ],
      commandNudge:
        'Line the crashes up against the requests, then find the requests that did NOT crash.',
      guidance:
        'In a run of failed attempts, the ones that did not fail are the interesting ones. Find ' +
        'them.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'reconnaissance',
      techniques: ['T1190', 'T1583.003'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.probe-pattern'],
      outOfLaneActions: ['act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'threat-intel'],
      why:
        'Twelve addresses interleaving rather than one retrying is the tell that this is deliberate ' +
        'rather than a broken client, and the interleaving is specifically there to stay under ' +
        'per-source rate limits. The payloads changing slightly each time, consistent with adjusting ' +
        'an offset, is the other half: that is iteration against a target, not a scanner spraying a ' +
        'list. Worth stating what this does not tell you. Twelve rented addresses across two ' +
        'documentation ranges says nothing about who this is, and they will be gone tomorrow. The ' +
        'durable finding is the request pattern.',
      standIn:
        'Forty-seven uploads from twelve addresses across two ranges, none with prior history on ' +
        'the portal. They interleave rather than one source retrying, and the payloads change ' +
        'slightly each time like somebody adjusting an offset. That is deliberate iteration, and ' +
        'the interleaving is to stay under rate limits.',
      commandOptions: [
        "awk '$7 ~ /preview/ {print $1}' /var/log/portal/access.log | sort | uniq -c",
        'grep preview /var/log/portal/access.log | wc -l',
        'netstat -an | grep 443',
        'dig -x 203.0.113.91',
        'iptables -L -n',
      ],
      commandNudge:
        'Count the distinct sources, and check whether they are taking turns or retrying.',
      guidance:
        'Ask whether this is one thing retrying or several things coordinating. The answer changes ' +
        'what it is.',
    },
    {
      eventId: 'ev.4',
      verdict: 'malicious',
      stage: 'execution',
      techniques: ['T1190', 'T1059.004'],
      firstResponder: 'malware-analyst',
      alsoAppropriate: ['log-analyst', 'forensics'],
      correctActions: ['act.decode', 'act.sandbox'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.attribute-named'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'The moment the attempts stopped being attempts. Eighteen months of telemetry in which this ' +
        'component has never spawned a child, and then it spawns a shell. That single comparison is ' +
        'a complete detection and it needed no knowledge of the flaw, no signature and no advisory, ' +
        'which is the argument this whole scenario is making. It also fixes the compromise time ' +
        'exactly at 15:51:22 and tells the floor the blast radius, because the shell ran as the ' +
        'application service account and inherits everything that account can reach.',
      standIn:
        'The document renderer spawned a shell at 15:51:22 and wrote a file to the web root. That ' +
        'component has never spawned a child process in eighteen months of telemetry. It ran as the ' +
        'application service account. That is the moment they got in.',
      commandOptions: [
        'ps -ef --forest | grep -A3 portal',
        'grep -B2 -A5 "15:51" /var/log/audit/audit.log',
        'ausearch -p $(pgrep portal) 2>/dev/null | head',
        'ls -la /var/www/portal/',
        'systemctl status portal',
      ],
      commandNudge:
        'Check whether that component has ever spawned a child process before today.',
      guidance:
        'You do not need to know what the bug is. Ask what this component has never done before.',
    },
    {
      eventId: 'ev.5',
      verdict: 'benign-true-positive',
      firstResponder: 'vulnerability-analyst',
      alsoAppropriate: ['ir-lead', 'threat-intel'],
      correctActions: ['act.scope-estate'],
      outOfLaneActions: ['act.dismiss', 'act.isolate', 'act.declare', 'act.preserve'],
      escalateTo: ['ir-lead'],
      why:
        'The scanner is right and it is graded as a true positive because it correctly reports what ' +
        'it checked. Everything is patched, the library is current, and there is no CVE because ' +
        'nobody has published one. This is the row where a floor can go badly wrong in a way that ' +
        'looks like rigour: waiting for identification before containing. There will be no ' +
        'advisory today. The correct output from this seat is not a finding about the portal, it is ' +
        'the estate question nobody else will ask, which is how many other services run that same ' +
        'rendering component, because they are all exposed and none of them will show up on a scan ' +
        'either.',
      standIn:
        'Scanner is clean and it is not wrong. Everything is patched, the rendering library is on ' +
        'current release, no CVE exists and no feed has anything. There is nothing to patch. What I ' +
        'can tell you is which other services run the same component, because they are exposed the ' +
        'same way and will scan clean too.',
      commandOptions: [
        'grep -rl "docrender" /etc/app-inventory/',
        'cat /var/log/scanner/portal-latest.json | head -30',
        'dpkg -l | grep docrender',
        'curl -s https://localhost/portal/version',
        'apt list --upgradable',
      ],
      commandNudge:
        'Find out what else in the estate uses the same rendering component.',
      guidance:
        'The scanner can only report what somebody has already published. Ask what it CANNOT see, ' +
        'and do not wait for a CVE before acting.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'persistence',
      techniques: ['T1505.003'],
      firstResponder: 'forensics',
      alsoAppropriate: ['malware-analyst', 'ir-lead'],
      correctActions: ['act.preserve', 'act.chain'],
      outOfLaneActions: ['act.reimage-now', 'act.power-off', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        '1.4 KB that takes a parameter and hands it to a shell. It is a working remote shell into ' +
        'the portal, it does not need the vulnerability any more, and the four requests since it ' +
        'was written mean it is in use rather than parked. That changes the containment question ' +
        'from "stop the exploitation" to "the exploitation already succeeded and they have a door", ' +
        'and those need different actions in a different order. Preserve before removing: this is a ' +
        'file on a web root that any engineer will delete on sight, and it is the best evidence of ' +
        'what was actually run through it.',
      standIn:
        '1.4 KB script in the portal web root, written 15:51:24, owned by the service account. It ' +
        'takes a parameter and passes it to a shell. It has been requested four times since, from ' +
        'two of the same addresses. This is a working remote shell and it does not need the ' +
        'vulnerability any more. Captured and sealed before anybody deletes it.',
      commandNudge:
        'Check whether that file has been requested since it was written, and by whom.',
      guidance:
        'Ask whether the thing they left behind still needs the way in. If it does not, closing the ' +
        'hole is not enough.',
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
        '3,100 blocked exploit attempts, inside the normal daily range, against vulnerabilities the ' +
        'estate does not run, none of them aimed at the portal. It is the internet being the ' +
        'internet and the IPS doing its job. It is on the board because it is a large number next ' +
        'to the word exploit on a day when the floor has found a real one. The check that settles ' +
        'it is one field, which is the target, and it is worth building the habit because a report ' +
        'that opens with 3,100 blocked attempts and then describes one successful compromise has ' +
        'buried its own finding under a statistic that means nothing.',
      standIn:
        '3,100 IPS blocks today, inside the normal 2,800 to 3,400, all against things we do not run ' +
        'and none of them at the portal. That is background. Closing it.',
      commandOptions: [
        'grep -c BLOCK /var/log/ips/events.log',
        "awk '/BLOCK/ {print $6}' /var/log/ips/events.log | sort | uniq -c | sort -rn | head",
        'grep portal /var/log/ips/events.log',
        'cat /var/log/ips/daily-summary.log',
        'systemctl status ips',
      ],
      commandNudge: 'Check what those blocked attempts were actually aimed at.',
      guidance:
        'A big blocked number is the perimeter working. Check whether any of it targeted the thing ' +
        'you care about.',
    },
  ],
};
