/**
 * Scenario 94: Our Own Name.
 *
 * Nobody was compromised. Somebody published a package using a name Fenmarch
 * uses internally, and the build did the rest.
 *
 * HOW THIS DIFFERS FROM THE OTHER TWO SUPPLY CHAIN SCENARIOS
 *
 * `third-party` is a dependency four levels down that somebody else's
 * maintainer account lost control of. `signed-and-trusted` is a vendor whose
 * own build system was compromised, so the update is signed with their real
 * key. Both are breaches of something.
 *
 * This is not. No account was taken, no system was broken into, and no
 * signature was forged. Somebody looked at what Fenmarch imports, noticed that
 * an internal package name is unclaimed on the public registry, published a
 * package under it with a higher version number, and waited. Every rule in the
 * chain worked exactly as documented.
 *
 * WHAT THIS TEACHES
 *
 * That resolution order is a security control nobody calls one. The registry
 * is configured to fall back to the public one for any name it cannot find
 * internally, which is what makes an ordinary developer machine work on the
 * first day, and it means a name Fenmarch believes is private is a name
 * anybody can answer to.
 *
 * TWO THINGS THAT DO NOT RESOLVE
 *
 * Whether the person who published it is a researcher, which is a real and
 * common practice, or somebody early in something worse. And whether any
 * secret actually left, because what was sent was the names of environment
 * variables rather than their values, and one of those names says more than a
 * name should.
 */

import type { Scenario, ScenarioTruth } from '@soc/shared';

import { COMMON_ACTIONS } from './actions.js';
import {
  ALSO_WORKS,
  BROAD_SEARCH,
  COUNT_ONLY,
  CORRECT_STEP,
  DUMP_ALL,
  MUTATE,
  STATUS_CHECK,
  TOUCH_ATTACKER,
} from './distractors.js';

const ID = 'our-own-name';

export const OUR_OWN_NAME: Scenario = {
  id: ID,
  title: 'Our Own Name',
  difficulty: 'expert',
  durationMinutes: 90,
  situation:
    'It is 09:50 at Fenmarch Credit. Build agents have been calling an address nobody recognises ' +
    'since Tuesday, and the package that made them do it has our name on it.',
  roles: [
    'soc-operator',
    'log-analyst',
    'forensics',
    'network-analyst',
    'cloud-security',
    'threat-intel',
    'fusion-analyst',
    'detection-engineer',
    'mitigation-specialist',
    'ir-lead',
  ],
  actions: COMMON_ACTIONS,

  events: [
    {
      id: 'ev.1',
      atSeconds: 0,
      surface: 'alert-queue',
      summary: 'Build agents are calling an address nobody recognises',
      detail:
        'Since Tuesday 14:20, hosts in the build estate have been making short outbound HTTPS ' +
        'connections to 203.0.113.164, one per build, always within four seconds of a build ' +
        'starting. 412 connections so far across 340 build agents. Each carries about 900 bytes ' +
        'outbound and receives nothing back.',
      source: 'network monitoring',
      claimedSeverity: 'high',
    },
    {
      id: 'ev.2',
      atSeconds: 180,
      surface: 'raw-log',
      summary: 'The package has our name and is not ours',
      detail:
        'The build resolves fenmarch-ledger-utils, an internal package Fenmarch has published to its ' +
        'own registry since 2022 at version 2.4.1. Since Tuesday the builds have been installing ' +
        'version 99.0.0 of the same name from the public registry, published six days ago by an ' +
        'account created the same day with no other packages.',
      source: 'build system',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.3',
      atSeconds: 370,
      surface: 'host-artefact',
      summary: 'What the package does when it installs',
      detail:
        'The package contains no application code. Its install script collects the hostname, the ' +
        'username, the working directory and the NAMES of every environment variable present, then ' +
        'posts them once to 203.0.113.164. It does not read the values of any variable, does not ' +
        'persist, does not run again after installation, and does nothing on subsequent builds ' +
        'except when reinstalled.',
      source: 'BUILD-AGENT-07',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.4',
      atSeconds: 560,
      surface: 'raw-log',
      summary: 'Why the public one won',
      detail:
        'The Fenmarch registry is configured to fall back to the public registry for any name it ' +
        'cannot serve, which is how a developer machine works on its first day before it has ' +
        'credentials. Internal packages carry no scope prefix. The resolver prefers the highest ' +
        'available version across all configured sources, so 99.0.0 beats 2.4.1 and every rule in ' +
        'that chain worked exactly as documented.',
      source: 'build system',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.5',
      atSeconds: 750,
      surface: 'network-flow',
      summary: 'Who ran it',
      detail:
        '340 build agents ran the install script, along with 47 developer laptops that rebuilt ' +
        'since Tuesday. Two of the build agents are in the payments pipeline. The 900 bytes each ' +
        'sent is consistent with hostname, username, path and a list of variable names, and is far ' +
        'too small to carry the values of those variables.',
      source: 'perimeter firewall',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.6',
      atSeconds: 940,
      surface: 'host-artefact',
      expertOnly: true,
      summary: 'One of the variable names says more than a name should',
      detail:
        'The variable names sent include FENMARCH_PROD_DB_PASSWORD_V2, PAYMENTS_HSM_PIN_ROTATION_ID ' +
        'and 61 others. No values were read. The names disclose that production database ' +
        'credentials are versioned, that a hardware security module PIN rotation exists and is ' +
        'identified, and roughly how the payments pipeline is structured. Separately, build logs for ' +
        'these pipelines are readable by 180 staff and are not part of what the package sent.',
      source: 'BUILD-AGENT-07',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.7',
      atSeconds: 1130,
      surface: 'cloud-audit',
      summary: 'A second external package the same rule flagged',
      detail:
        'The same sweep flags date-fns-tz, resolved from the public registry by 190 builds. It is a ' +
        'widely used timezone library with eleven million weekly downloads, four years of releases, ' +
        'a named maintainer and no install script. It is external because it is meant to be, and ' +
        'it is in the dependency file deliberately.',
      source: 'build system',
      claimedSeverity: 'medium',
    },
    {
      id: 'ev.8',
      atSeconds: 1320,
      surface: 'alert-queue',
      expertOnly: true,
      summary: 'Whether this is research or the start of something does not resolve',
      detail:
        'A beacon-only payload that collects identifying information and nothing else is exactly ' +
        'what dependency confusion researchers publish, and several have done so publicly against ' +
        'large firms. It is also what somebody would publish first, to find out which names work, ' +
        'before publishing something that does more. The package has no README, no contact address ' +
        'and no disclosure statement. The registry account has no other packages and no history.',
      source: 'threat intelligence',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.9',
      atSeconds: 1510,
      surface: 'alert-queue',
      summary: 'What can be changed and what it costs',
      detail:
        'The public registry fallback can be turned off centrally in about ten minutes, which stops ' +
        'this and breaks every build that legitimately resolves a public package, which is most of ' +
        'them. Pinning the internal registry ahead of the public one for known internal names takes ' +
        'about an hour. Scoping the internal packages properly is the real fix and touches 340 ' +
        'build configurations. The public package can be reported to the registry for takedown.',
      source: 'operations',
      claimedSeverity: 'critical',
    },
    {
      id: 'ev.10',
      atSeconds: 1700,
      surface: 'alert-queue',
      summary: 'Nobody knows how many other names are unclaimed',
      detail:
        'Fenmarch has no inventory of its internal package names. The names are visible in every ' +
        'dependency file in every repository, and about 40 people outside the company have had ' +
        'access to at least one of those repositories through contract work. Checking which ' +
        'internal names are unclaimed on the public registry is one query anybody can run, ' +
        'including Fenmarch.',
      source: 'security programme',
      claimedSeverity: 'critical',
    },
  ],
};

export const OUR_OWN_NAME_TRUTH: ScenarioTruth = {
  scenarioId: ID,
  narrative: [
    'Six days ago somebody created a public registry account and published a package called fenmarch-ledger-utils at version 99.0.0. Fenmarch has published an internal package of that name to its own registry since 2022, at version 2.4.1.',
    'The Fenmarch registry falls back to the public one for any name it cannot serve, which is how a developer machine works on its first day before it has credentials. Internal packages carry no scope prefix, and the resolver prefers the highest version across all configured sources. So 99.0.0 beat 2.4.1, and every rule in that chain worked exactly as documented.',
    'Nothing was compromised. No account was taken, no system was broken into, no signature was forged. Somebody claimed a name Fenmarch believed was private, and the build did the rest.',
    'From Tuesday 14:20 the install script ran on 340 build agents and 47 developer laptops, two of the agents in the payments pipeline. It collects the hostname, username, working directory and the names of every environment variable, posts about 900 bytes once to 203.0.113.164, and does nothing else. It does not read any value, does not persist, and does not run again.',
    'The 900 bytes is consistent with names and far too small to carry values, so no secret left in the payload. The names themselves disclose that production database credentials are versioned, that a hardware security module PIN rotation exists and is identified, and roughly how the payments pipeline is structured.',
    'Whether the publisher is a researcher or somebody early in something worse does not resolve. Beacon-only is exactly what dependency confusion researchers publish and several have done so publicly, and it is also what somebody publishes first to find out which names work. There is no README, no contact address, no disclosure statement, and the account has no history.',
    'date-fns-tz is flagged by the same sweep and is a widely used timezone library with eleven million weekly downloads and no install script. It is external on purpose.',
    'The fallback can be turned off in ten minutes and breaks most builds. Pinning internal names ahead of the public registry takes about an hour. Scoping the packages properly is the real fix and touches 340 build configurations.',
    'Fenmarch has no inventory of its internal package names, the names are visible in every dependency file in every repository, and about 40 people outside the company have had access to at least one of those repositories.',
  ],
  events: [
    {
      eventId: 'ev.1',
      verdict: 'malicious',
      stage: 'execution',
      critical: true,
      techniques: ['T1195.001'],
      firstResponder: 'soc-operator',
      alsoAppropriate: ['network-analyst', 'ir-lead'],
      correctActions: ['act.triage-high', 'act.investigate-hold'],
      outOfLaneActions: ['act.dismiss', 'act.tune', 'act.contact-attacker', 'act.attribute-named'],
      escalateTo: ['network-analyst', 'log-analyst'],
      why:
        'Four hundred connections from the build estate to one address nobody can name, always ' +
        'within four seconds of a build starting. The timing relative to the build is the whole ' +
        'observation and it is what raises this above ordinary outbound noise: something in the ' +
        'build itself is doing this, not something on the host, which means the answer is in the ' +
        'build definition rather than on any machine. Raise it and say that out loud, because a ' +
        'floor that starts on the endpoints will spend an hour on 340 identically clean agents. ' +
        'Note also that nothing comes back. Nine hundred bytes out and nothing in is not a channel ' +
        'somebody is using, it is a report being filed.',
      standIn:
        'Four hundred connections from the build estate to an address nobody can name, always within ' +
        'four seconds of a build starting. That timing is the observation: something in the build is ' +
        'doing this, not something on the host, so the answer is in the build definition and not on ' +
        'any machine. Saying that now, because otherwise we spend an hour on 340 identically clean ' +
        'agents. And nothing comes back. Nine hundred bytes out, nothing in. That is not a channel ' +
        'anybody is using, it is a report being filed.',
      commandOptions: [
        { command: "awk '$5==\"203.0.113.164\" {print $3}' /var/log/netflow/week.log | sort -u | wc -l", correct: true, teaches: CORRECT_STEP },
        { command: "grep '203.0.113.164' /var/log/netflow/week.log | awk '{print $2}' | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status jenkins', ...STATUS_CHECK },
        { command: 'cat /var/log/netflow/week.log', ...DUMP_ALL },
        { command: 'curl -s https://203.0.113.164/', ...TOUCH_ATTACKER },
      ],
      commandNudge:
        'Check how many distinct hosts are doing this and what they were doing at the time.',
      guidance:
        'Build agents are calling out. Ask what they have in common.',
    },
    {
      eventId: 'ev.2',
      verdict: 'malicious',
      stage: 'initial-access',
      critical: true,
      techniques: ['T1195.001'],
      firstResponder: 'log-analyst',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.timeline', 'act.corroborate', 'act.chain'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.tune'],
      escalateTo: ['ir-lead', 'forensics'],
      why:
        'The package has the Fenmarch name on it and is not the Fenmarch package. Internal 2.4.1 ' +
        'since 2022, public 99.0.0 published six days ago by an account created the same day with ' +
        'nothing else on it. Say what that means precisely, because the room will reach for the ' +
        'wrong word: nothing has been compromised. Nobody took an account, nobody broke into the ' +
        'registry, nobody forged a signature. Somebody claimed a name and published under it, which ' +
        'is an ordinary thing anybody may do on a public registry. The version number is worth ' +
        'noticing on its own, because 99.0.0 is not a plausible release of anything and is a ' +
        'deliberate choice to be the highest number the resolver can find, so the publisher knew ' +
        'exactly what mechanism they were using.',
      standIn:
        'The package has our name on it and it is not ours. Internal 2.4.1 since 2022, public 99.0.0 ' +
        'published six days ago by an account made the same day with nothing else on it. Be precise ' +
        'about this, because we will reach for the wrong word: nothing was compromised. No account ' +
        'taken, no break-in, no forged signature. Somebody claimed a name and published under it, ' +
        'which anybody may do. And 99.0.0 is not a plausible release of anything. It is a choice to ' +
        'be the highest number the resolver can find, so they knew exactly what they were using.',
      commandOptions: [
        { command: "grep -rn 'fenmarch-ledger-utils' /evidence/build/resolved-lockfile.json | head", correct: true, teaches: CORRECT_STEP },
        { command: "registry-cli info fenmarch-ledger-utils --all-sources", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status registry', ...STATUS_CHECK },
        { command: 'cat /evidence/build/resolved-lockfile.json', ...DUMP_ALL },
        { command: 'npm install fenmarch-ledger-utils@99.0.0', ...MUTATE },
      ],
      commandNudge:
        'Find which package the build actually resolved, and where it came from.',
      guidance:
        'The build is doing it. Ask what the build installed.',
    },
    {
      eventId: 'ev.3',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1195.001', 'T1082'],
      firstResponder: 'forensics',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.sandbox', 'act.decode', 'act.corroborate'],
      outOfLaneActions: ['act.contact-attacker', 'act.dismiss', 'act.attribute-named', 'act.reimage-now'],
      escalateTo: ['ir-lead', 'cloud-security'],
      why:
        'Read the install script and report what it does rather than what it could have done. It ' +
        'takes the hostname, the username, the working directory and the names of every environment ' +
        'variable, posts them once, and stops. No values are read, nothing persists, nothing runs ' +
        'on later builds. That is a narrow payload and reporting it narrowly is the discipline ' +
        'being tested here, because an install script running as the build user could have done ' +
        'almost anything and the difference between could and did is the difference between a ' +
        'reconstruction and a guess. Do not soften it either: names are information, and the room ' +
        'should hold the payload being small and the disclosure being real at the same time.',
      standIn:
        'Read the script and report what it does, not what it could have done. Hostname, username, ' +
        'working directory, and the names of every environment variable. Posts once and stops. No ' +
        'values read, nothing persistent, nothing on later builds. That is narrow and I want it ' +
        'reported narrowly, because an install script running as the build user could have done ' +
        'nearly anything and could is not did. And do not soften it either. Names are information. ' +
        'The payload is small and the disclosure is real, both at once.',
      commandOptions: [
        { command: "cat /evidence/package/99.0.0/install.js", correct: true, teaches: CORRECT_STEP },
        { command: "grep -oE 'process\\.env[A-Za-z.\\[\\]\"]*' /evidence/package/99.0.0/install.js | sort -u", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status jenkins', ...STATUS_CHECK },
        { command: 'cat /evidence/build/agent-07-full.log', ...DUMP_ALL },
        { command: 'node /evidence/package/99.0.0/install.js', ...MUTATE },
      ],
      commandNudge:
        'Read the install script line by line and write down only what it actually sends.',
      guidance:
        'Something ran during the build. Ask exactly what it did.',
    },
    {
      eventId: 'ev.4',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'cloud-security',
      alsoAppropriate: ['detection-engineer', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.chain', 'act.scope-estate'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.isolate'],
      escalateTo: ['mitigation-specialist', 'ir-lead'],
      why:
        'Three settings, all sensible on their own, and together they are the vulnerability. The ' +
        'registry falls back to the public one for names it cannot serve, which is what makes a new ' +
        'developer machine work before it has credentials. Internal packages carry no scope prefix, ' +
        'which nobody decided so much as never decided. The resolver prefers the highest version ' +
        'across every configured source, which is what a resolver is for. Nothing here is ' +
        'misconfigured and there is no line to point at. That is the finding worth carrying out of ' +
        'the room: resolution order is a security control and nobody calls it one, so it is not ' +
        'reviewed, not documented as a control, and not owned by anybody. A name Fenmarch believes ' +
        'is private is a name anybody may answer to.',
      standIn:
        'Three settings, each sensible, and together they are the vulnerability. The registry falls ' +
        'back to public for names it cannot serve, which is how a new developer machine works before ' +
        'it has credentials. Internal packages have no scope prefix, which nobody decided so much as ' +
        'never decided. The resolver takes the highest version across all sources, which is what a ' +
        'resolver is for. Nothing is misconfigured and there is no line to point at. Resolution ' +
        'order is a security control and nobody calls it one, so nobody reviews it and nobody owns ' +
        'it. A name we think is private is a name anybody can answer to.',
      commandOptions: [
        { command: "grep -iE 'registry|fallback|upstream' /evidence/build/registry.conf", correct: true, teaches: CORRECT_STEP },
        { command: "grep -rn 'fenmarch-' /evidence/build/package.json | head", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status registry', ...STATUS_CHECK },
        { command: 'cat /evidence/build/registry.conf', ...DUMP_ALL },
        { command: 'registry-cli config set upstream.enabled false', ...MUTATE },
      ],
      commandNudge:
        'Read the registry configuration and work out why the public copy was preferred.',
      guidance:
        'We publish that name ourselves. Ask why the other one won.',
    },
    {
      eventId: 'ev.5',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1082'],
      firstResponder: 'network-analyst',
      alsoAppropriate: ['log-analyst', 'ir-lead'],
      correctActions: ['act.flow-map', 'act.scope-estate', 'act.timeline'],
      outOfLaneActions: ['act.dismiss', 'act.contact-attacker', 'act.attribute-named', 'act.isolate'],
      escalateTo: ['ir-lead', 'fusion-analyst'],
      why:
        'Three hundred and forty build agents and 47 laptops, two of the agents in the payments ' +
        'pipeline. The scope is the number that goes in the report and the byte count is the one ' +
        'that bounds it: nine hundred bytes is consistent with a hostname, a username, a path and a ' +
        'list of variable names, and is nowhere near enough to carry the values of sixty-three ' +
        'variables. Use the arithmetic rather than the install script alone, because the script is ' +
        'what the attacker wrote and the byte count is what the network observed, and having two ' +
        'independent things agree is what turns a reading of the code into a finding. That ' +
        'distinction is worth making explicitly to the room, because somebody will otherwise report ' +
        'that no secrets left on the strength of the attacker own code saying so.',
      standIn:
        'Three hundred and forty agents, forty-seven laptops, two agents in the payments pipeline. ' +
        'The scope goes in the report and the byte count bounds it: nine hundred bytes fits a ' +
        'hostname, a username, a path and a list of names, and comes nowhere near the values of ' +
        'sixty-three variables. Use the arithmetic, not just the script. The script is what the ' +
        'attacker wrote, the byte count is what our network saw, and two independent things agreeing ' +
        'is what makes this a finding. Otherwise we are reporting that no secrets left because the ' +
        'attacker code says so.',
      commandOptions: [
        { command: "awk '$5==\"203.0.113.164\" {n++; b+=$8} END {print n, b/n}' /var/log/netflow/week.log", correct: true, teaches: CORRECT_STEP },
        { command: "awk '$5==\"203.0.113.164\" {print $3}' /var/log/netflow/week.log | sort -u", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status jenkins', ...STATUS_CHECK },
        { command: 'cat /var/log/netflow/week.log', ...DUMP_ALL },
        { command: 'grep -c 203.0.113.164 /var/log/netflow/week.log', ...COUNT_ONLY },
      ],
      commandNudge:
        'Count the hosts, then check the average bytes against what the script claims to send.',
      guidance:
        'It sent something. Ask whether the size matches the claim.',
    },
    {
      eventId: 'ev.6',
      verdict: 'malicious',
      stage: 'collection',
      critical: true,
      techniques: ['T1082'],
      firstResponder: 'forensics',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.corroborate', 'act.scope-estate', 'act.notify-legal'],
      outOfLaneActions: ['act.dismiss', 'act.attribute-named', 'act.contact-attacker', 'act.revoke-key'],
      escalateTo: ['ir-lead', 'mitigation-specialist'],
      why:
        'No values were read and the names are still a disclosure. ' +
        'FENMARCH_PROD_DB_PASSWORD_V2 says production database credentials are versioned and ' +
        'somebody is on the second. PAYMENTS_HSM_PIN_ROTATION_ID says a hardware security module ' +
        'PIN rotation exists and is identified by something. Sixty-three names together are a map ' +
        'of how the payments pipeline is put together, which is precisely what somebody wants ' +
        'before deciding what to try next. Hold the two halves without collapsing either: no ' +
        'credential left the building, and Fenmarch has handed a stranger a structural description ' +
        'of its most sensitive pipeline. A report that leads with no secrets were exposed is true ' +
        'and will be read as nothing happened. The build logs are worth a sentence too, not because ' +
        'the package touched them but because 180 people can read them and nobody has asked what ' +
        'they print.',
      standIn:
        'No values were read and the names are still a disclosure. Production database password ' +
        'version two tells them our production credentials are versioned and we are on the second. ' +
        'Payments HSM PIN rotation identifier tells them a rotation exists and is identified. ' +
        'Sixty-three names together are a map of how that pipeline is built, which is exactly what ' +
        'you want before deciding what to try. Both halves, neither collapsed: no credential left, ' +
        'and we handed a stranger a structural description of our most sensitive pipeline. Lead ' +
        'with no secrets exposed and it gets read as nothing happened. And somebody ask what our ' +
        'build logs print, because 180 people can read them.',
      commandOptions: [
        { command: "grep -oE '[A-Z][A-Z0-9_]{4,}' /evidence/capture/posted-body.json | sort -u | head -20", correct: true, teaches: CORRECT_STEP },
        { command: "jq -r '.env_names[]' /evidence/capture/posted-body.json | wc -l", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status vault', ...STATUS_CHECK },
        { command: 'cat /evidence/capture/posted-body.json', ...DUMP_ALL },
        { command: 'grep -rn "PASSWORD" /evidence/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'Read the variable names that were sent and ask what each one tells somebody who has never seen your estate.',
      guidance:
        'Only names were sent. Ask what a name discloses.',
    },
    {
      eventId: 'ev.7',
      verdict: 'benign-true-positive',
      firstResponder: 'soc-operator',
      alsoAppropriate: ['cloud-security', 'detection-engineer'],
      correctActions: ['act.corroborate', 'act.dismiss'],
      outOfLaneActions: ['act.triage-high', 'act.declare', 'act.attribute-named', 'act.contact-attacker'],
      escalateTo: [],
      why:
        'Flagged by the same rule and entirely ordinary. Eleven million weekly downloads, four years ' +
        'of releases, a named maintainer, no install script, and it is in the dependency file ' +
        'because somebody put it there on purpose. Close it. The check takes two minutes and is ' +
        'worth doing rather than assuming, because the rule that found it is the rule the room now ' +
        'trusts, and a floor mid-incident is primed to see a second one. The discriminators are ' +
        'worth naming since they will be needed again on the sweep that follows: age, download ' +
        'volume, release history, a maintainer with other work, and whether there is an install ' +
        'script at all. Resolving from the public registry is not itself suspicious, which is the ' +
        'thing to keep hold of. Most of what a build installs is supposed to come from there.',
      standIn:
        'Same rule, completely ordinary. Eleven million weekly downloads, four years of releases, a ' +
        'named maintainer, no install script, and it is in the dependency file because somebody put ' +
        'it there. Closing it. Worth the two minutes rather than assuming, because that rule is what ' +
        'we are trusting now and mid-incident we are primed to see a second one. Discriminators for ' +
        'the sweep after this: age, downloads, release history, a maintainer with other work, and ' +
        'whether there is an install script. Resolving from the public registry is not suspicious ' +
        'on its own. Most of what a build installs is meant to come from there.',
      commandOptions: [
        { command: "registry-cli info date-fns-tz --downloads --maintainers --first-published", correct: true, teaches: CORRECT_STEP },
        { command: "jq -r '.scripts' /evidence/package/date-fns-tz/package.json", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status registry', ...STATUS_CHECK },
        { command: 'cat /evidence/build/resolved-lockfile.json', ...DUMP_ALL },
        { command: 'grep -rn "date-fns" /evidence/', ...BROAD_SEARCH },
      ],
      commandNudge:
        'Check the second package against the things that made the first one suspicious.',
      guidance:
        'A second package came from outside. Ask whether that is wrong.',
    },
    {
      eventId: 'ev.8',
      verdict: 'ambiguous',
      leaning: 'malicious',
      wouldSettleIt:
        'A disclosure statement, a contact address or a README on the package, none of which exist. ' +
        'The registry account has no other packages and no history to read. Researchers doing this ' +
        'publicly almost always say so somewhere in the package, and its absence is evidence ' +
        'without being proof, because plenty of legitimate work is done by people who intended to ' +
        'write that up afterwards.',
      firstResponder: 'fusion-analyst',
      alsoAppropriate: ['threat-intel', 'ir-lead'],
      correctActions: ['act.assess-actor', 'act.corroborate', 'act.investigate-hold'],
      outOfLaneActions: ['act.attribute-named', 'act.contact-attacker', 'act.declare', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'A beacon-only payload that identifies where it landed and does nothing else is exactly what ' +
        'dependency confusion researchers publish, and several have done it publicly against large ' +
        'firms. It is also exactly what somebody publishes first, to learn which names resolve, ' +
        'before publishing something that does more. The payload cannot distinguish them because ' +
        'the first move is identical either way. Lean malicious, and lean on the absences rather ' +
        'than on the payload: no README, no contact address, no disclosure statement, an account ' +
        'created the same day with nothing else on it. Researchers doing this in public generally ' +
        'say so, because saying so is what makes it research rather than intrusion. That is ' +
        'evidence and it is not proof, so it stops at a leaning. What matters is that the leaning ' +
        'changes almost nothing operationally: the fix, the scope and the disclosure are identical ' +
        'under both readings, and the only thing it touches is whether anybody replies to them.',
      standIn:
        'Beacon-only, identifies where it landed, does nothing else. That is exactly what dependency ' +
        'confusion researchers publish and several have done it publicly against firms our size. It ' +
        'is also exactly what you publish first to learn which names resolve, before publishing ' +
        'something that does more. The payload cannot tell them apart because the first move is the ' +
        'same. I lean malicious, and on the absences rather than the payload: no README, no contact ' +
        'address, no disclosure statement, account made the same day with nothing else on it. People ' +
        'doing this in the open usually say so, because saying so is what makes it research. That is ' +
        'evidence, not proof, so it stops at a leaning. And it changes almost nothing. Same fix, ' +
        'same scope, same disclosure either way. It only decides whether anybody writes back.',
      commandNudge:
        'Look for what a researcher would have left behind, and note that its absence is not proof.',
    },
    {
      eventId: 'ev.9',
      verdict: 'malicious',
      stage: 'execution',
      critical: true,
      firstResponder: 'mitigation-specialist',
      alsoAppropriate: ['ir-lead', 'cloud-security'],
      correctActions: ['act.contain-scoped', 'act.compensating-control', 'act.check-rollback', 'act.sequence-remedy'],
      outOfLaneActions: ['act.isolate', 'act.contact-attacker', 'act.attribute-named', 'act.dismiss'],
      escalateTo: ['ir-lead'],
      why:
        'The decisive option is the wrong one. Turning off the public fallback stops this in ten ' +
        'minutes and breaks every build that legitimately resolves a public package, which is most ' +
        'of them, so it trades an incident that has already happened for an outage that has not. ' +
        'Pin the internal registry ahead of the public one for known internal names instead: about ' +
        'an hour, closes the mechanism, and breaks nothing, and it is the action to start now. ' +
        'Report the package for takedown in parallel, because it costs one form and removes it for ' +
        'everybody else with the same problem, and note that a takedown frees the name again for ' +
        'the next person unless Fenmarch claims it. Scoping the packages properly is the real fix, ' +
        'touches 340 build configurations, and belongs in a plan with an owner rather than in ' +
        'tonight. Deliberately left undone: 387 machines already ran it and nothing un-sends what ' +
        'was sent, the structural disclosure cannot be withdrawn, and every other unclaimed internal ' +
        'name is still unclaimed tonight.',
      standIn:
        'The decisive option is the wrong one. Killing the public fallback stops this in ten minutes ' +
        'and breaks every build that legitimately uses a public package, which is most of them. That ' +
        'trades an incident that already happened for an outage that has not. Pin the internal ' +
        'registry ahead of public for known internal names: an hour, closes the mechanism, breaks ' +
        'nothing. Start it now. Report the package for takedown in parallel, one form, and it helps ' +
        'everybody else with the same problem, but note a takedown frees the name again unless we ' +
        'claim it. Scoping properly is the real fix, 340 build configs, and it needs a plan with an ' +
        'owner, not tonight. Left undone: 387 machines ran it, nothing un-sends what was sent, and ' +
        'every other unclaimed name of ours is still unclaimed.',
      commandNudge:
        'Rank the options by what each one breaks, not by how completely it closes the hole.',
    },
    {
      eventId: 'ev.10',
      verdict: 'benign-true-positive',
      critical: true,
      firstResponder: 'detection-engineer',
      alsoAppropriate: ['cloud-security', 'ir-lead'],
      correctActions: ['act.scope-estate', 'act.propose-rule', 'act.predict'],
      outOfLaneActions: ['act.attribute-named', 'act.dismiss', 'act.isolate', 'act.contact-attacker'],
      escalateTo: ['ir-lead'],
      why:
        'No inventory of internal package names, and the names are visible in every dependency file ' +
        'in every repository, about forty of which have been readable by people outside the company ' +
        'through contract work. So the reconnaissance for this required no access at all and the ' +
        'attacker had the same list Fenmarch does not. The useful thing about that is the symmetry ' +
        'and it should be said as an action rather than as a lament: checking which internal names ' +
        'are unclaimed on the public registry is one query, anybody can run it, and that includes ' +
        'us. Doing it this afternoon produces a list of every name still available, which is both ' +
        'the exposure and the shopping list for claiming them defensively. The prediction follows ' +
        'and should be written with a number: whatever that query returns is how many more times ' +
        'this can happen, and it will keep being true until somebody owns the inventory.',
      standIn:
        'No inventory of our internal package names, and the names are in every dependency file in ' +
        'every repository, forty of which outsiders have read through contract work. So the ' +
        'reconnaissance took no access at all and they had a list we do not. The useful part is the ' +
        'symmetry, and I want it as an action not a lament: checking which of our names are ' +
        'unclaimed on the public registry is one query, anybody can run it, and that includes us. ' +
        'Run it this afternoon and we get the exposure and the list of names to claim in the same ' +
        'output. Prediction with a number on it: whatever that query returns is how many more times ' +
        'this can happen.',
      commandOptions: [
        { command: "grep -rhoE '\"fenmarch-[a-z0-9-]+\"' /evidence/repos/ | sort -u", correct: true, teaches: CORRECT_STEP },
        { command: "for p in $(cat /evidence/build/internal-names.txt); do registry-cli exists \"$p\"; done", correct: true, teaches: ALSO_WORKS },
        { command: 'systemctl status registry', ...STATUS_CHECK },
        { command: 'cat /evidence/build/internal-names.txt', ...DUMP_ALL },
        { command: 'grep -rc fenmarch /evidence/repos/', ...COUNT_ONLY },
      ],
      commandNudge:
        'List every internal package name you publish, then check which of them are free on the public registry.',
      guidance:
        'One name was taken. Ask how many others are available.',
    },
  ],
};
