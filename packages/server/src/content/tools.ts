/**
 * Open-source tools we teach, mapped to the commercial products they stand in for.
 *
 * THE POSITION THIS FILE TAKES
 *
 * Job adverts name products: Splunk, CrowdStrike, Nessus, Burp Suite. A training
 * platform cannot ship those, and a student who needs a licence to practise will
 * not practise. So we teach the open-source equivalent and say exactly what
 * transfers and what does not.
 *
 * Two failure modes to avoid, and this file is written against both:
 *
 *   1. Pretending the open-source tool IS the commercial one. It is not. Splunk's
 *      SPL and a grep pipeline are not the same thing, and a student who thinks
 *      they are will be caught out. Each entry names the real differences.
 *
 *   2. Implying the commercial tool does not matter. It does. Recruiters filter
 *      on product names. Every entry that has a free tier, community edition, or
 *      trial says how to get hands on it, because "I have used it" beats "I have
 *      used something like it" in an interview every time.
 *
 * The honest summary we give students: we teach you the skill, because the skill
 * is what survives a change of employer. Learning the specific product on top of
 * that is cheap and worth doing. Learning the product WITHOUT the skill is how
 * people end up unable to answer "why did you run that query?"
 */

import type { ToolMapping } from '@soc/shared';

export const TOOL_MAPPINGS: ToolMapping[] = [
  {
    id: 'siem-search',
    teaches: 'grep, awk, and Sigma rules over raw log files',
    teachesNote:
      'Before a SIEM is a product it is a search engine over timestamped events. Doing it by hand on real log files first means you understand what the SIEM is doing for you, rather than treating it as a magic box.',
    industryTools: ['Splunk (SPL)', 'Microsoft Sentinel (KQL)', 'Elastic / OpenSearch (Lucene, ES|QL)', 'IBM QRadar (AQL)', 'Sumo Logic'],
    skill: 'Express an investigative question as a search: filter by field, narrow a time window, aggregate by source, and spot the outlier.',
    differences:
      'A real SIEM indexes across thousands of hosts, normalises fields into a common schema, joins data sources, and runs saved searches on a schedule to raise alerts. Each product has its own query language, and SPL in particular has statistical commands with no command-line equivalent. What does NOT change is knowing which field to filter on and what a suspicious pattern looks like.',
    freeAccessNote:
      'Splunk Free allows 500MB/day indexing indefinitely, and Splunk runs free training. Microsoft offers a Sentinel trial and free KQL practice at the Kusto Detective Agency. Elastic has a free tier. Sigma rules are vendor-neutral and convert INTO all of these, which is why we teach that format.',
  },
  {
    id: 'packet-analysis',
    teaches: 'Wireshark and its command-line companion tshark',
    teachesNote:
      'This one is not a substitute at all: Wireshark IS the industry standard and it is open source. Learning it here is learning the real tool.',
    industryTools: ['Wireshark (same tool)', 'tcpdump', 'Zeek (network metadata)', 'Arkime / Moloch', 'NetWitness', 'Corelight (commercial Zeek)'],
    skill: 'Read a packet capture: follow a stream, filter by host or port, spot plaintext credentials, and recognise the shape of a scan, a beacon, or an exfiltration transfer.',
    differences:
      'Almost none for the tool itself. What differs at work is scale and placement: enterprises capture at aggregation points and usually retain metadata (Zeek logs) rather than full packets, because full capture at 10Gbps is expensive. Corelight is essentially managed Zeek.',
    freeAccessNote: 'Wireshark is free and open source. Public capture samples are available from the Wireshark wiki and malware-traffic-analysis.net for practice.',
  },
  {
    id: 'endpoint-visibility',
    teaches: 'osquery, Velociraptor, and Sysmon event logs',
    teachesNote:
      'These give you the same underlying telemetry an EDR collects (process trees, network connections, file writes, persistence) without a per-endpoint licence.',
    industryTools: ['CrowdStrike Falcon', 'Microsoft Defender for Endpoint', 'SentinelOne', 'Carbon Black', 'Cortex XDR'],
    skill: 'Reconstruct what a process did: what launched it, what it spawned, what it touched on disk, and where it connected. Then judge whether that behaviour is normal for the host.',
    differences:
      'Commercial EDR adds real-time blocking, cloud-side correlation across the whole fleet, managed threat hunting, and a polished timeline UI. It also decides for you what is suspicious, which is convenient and occasionally wrong. The judgement of "is this process tree normal" is identical either way, and is the part employers actually test.',
    freeAccessNote:
      'Velociraptor and osquery are fully open source. Sysmon is free from Microsoft. Defender for Endpoint has a trial, and CrowdStrike runs a free community edition of Falcon Go for very small deployments.',
  },
  {
    id: 'windows-forensics',
    teaches: 'Chainsaw, Hayabusa, and EVTX event log analysis',
    teachesNote:
      'Windows is where most enterprise compromise actually happens, and its event log is a different world from syslog. These open-source tools parse EVTX and apply detection rules to it.',
    industryTools: ['Splunk with Windows TA', 'Microsoft Sentinel', 'KAPE (free)', 'Magnet AXIOM', 'EnCase'],
    skill: 'Read Windows security events by ID (4624 logon, 4625 failed logon, 4672 special privileges, 4688 process creation, 7045 service install) and reconstruct an intrusion from them.',
    differences:
      'Commercial forensic suites handle disk imaging, registry parsing, browser artefacts, and evidence handling with court-defensible chain of custody. For log triage specifically, the open-source tools are genuinely competitive and are used in real incident response.',
    freeAccessNote: 'Chainsaw, Hayabusa, Velociraptor, and Eric Zimmerman\'s tools are all free. KAPE is free for non-commercial use.',
  },
  {
    id: 'vulnerability-scanning',
    teaches: 'OpenVAS / Greenbone and nuclei',
    teachesNote:
      'Same scanning model (authenticated and unauthenticated checks against a target) without a commercial licence.',
    industryTools: ['Tenable Nessus', 'Qualys VMDR', 'Rapid7 InsightVM', 'Tenable.io'],
    skill: 'Scan a scope, read the findings critically, separate genuine risk from noise, confirm false positives, and prioritise by exploitability and exposure rather than by the CVSS number alone.',
    differences:
      'Commercial scanners have larger and faster-updated plugin feeds, better authenticated-scan coverage, and asset-tracking and reporting workflows built for audits. The analytical skill (deciding what actually matters out of four thousand findings) is where the job is, and that is identical.',
    freeAccessNote: 'Greenbone Community Edition is free. Nessus Essentials is free for up to 16 IP addresses, which is enough to learn the interface employers name.',
  },
  {
    id: 'web-app-testing',
    teaches: 'OWASP ZAP and Burp Suite Community Edition',
    teachesNote:
      'ZAP is fully open source. Burp Community is free and is the same interface as the Professional edition most testers use, minus the automation.',
    industryTools: ['Burp Suite Professional', 'Invicti / Netsparker', 'Acunetix', 'Checkmarx (static analysis)'],
    skill: 'Intercept and modify HTTP traffic, map an application\'s attack surface, and test for the classes in the OWASP Top 10 by hand rather than trusting a scanner.',
    differences:
      'Burp Professional adds the active scanner, Intruder at full speed, and extensions. Burp Community deliberately throttles Intruder. Everything about how you think through an application is the same, and manual testing is what distinguishes a tester from a scan operator.',
    freeAccessNote: 'ZAP is free. Burp Community is free. PortSwigger\'s Web Security Academy is free, excellent, and made by the Burp authors.',
  },
  {
    id: 'offensive-toolkit',
    teaches: 'nmap, Metasploit Framework, and Kali Linux',
    teachesNote:
      'These are the genuine industry tools and they are open source. There is no substitution happening here.',
    industryTools: ['Cobalt Strike (commercial C2)', 'Core Impact', 'Canvas', 'Same nmap and Metasploit'],
    skill: 'Enumerate a target methodically, identify a service and version, find and validate an exploitation path, and document it so somebody can reproduce and fix it.',
    differences:
      'Commercial C2 frameworks like Cobalt Strike add mature post-exploitation, malleable traffic profiles, and team collaboration. They are also the tools red teams are hired to emulate. Entry-level work rarely touches them; the methodology is what gets you hired.',
    freeAccessNote: 'All free. Practise legally on HackTheBox, TryHackMe, VulnHub, or a lab you built yourself: never on systems you do not own or have written permission to test.',
  },
  {
    id: 'threat-intel',
    teaches: 'MISP and OpenCTI',
    teachesNote: 'Open-source threat intelligence platforms that use the same STIX/TAXII standards as the commercial ones.',
    industryTools: ['Recorded Future', 'Mandiant Advantage', 'Anomali ThreatStream', 'CrowdStrike Falcon Intelligence'],
    skill: 'Turn raw indicators into structured, attributed intelligence: assess source reliability, map behaviour to MITRE ATT&CK, and write an assessment that helps somebody make a decision.',
    differences:
      'Commercial platforms buy access to proprietary collection: underground forums, telemetry from millions of endpoints, dedicated analysts. You cannot replicate the data. You can absolutely replicate the analytical tradecraft, which is the transferable part.',
    freeAccessNote: 'MISP and OpenCTI are free to self-host. MITRE ATT&CK, CISA advisories, and abuse.ch feeds are free and are what many commercial products repackage.',
  },
  {
    id: 'case-management',
    teaches: 'TheHive and Cortex',
    teachesNote: 'Open-source incident case management and automated enrichment, structured the same way commercial platforms are.',
    industryTools: ['ServiceNow SecOps', 'Splunk SOAR (Phantom)', 'Palo Alto XSOAR', 'Jira Service Management'],
    skill: 'Run a case: record observations with timestamps, track actions taken, preserve evidence, and hand over cleanly at shift change.',
    differences:
      'Commercial SOAR platforms bring large integration libraries and visual playbook builders. The discipline of documenting an investigation so a colleague can pick it up cold is what actually matters, and it is unglamorous and rarely taught.',
    freeAccessNote: 'TheHive and Cortex are free to self-host. Jira has a free tier.',
  },
  {
    id: 'grc-tooling',
    teaches: 'OSCAL, spreadsheets, and open control catalogues (NIST 800-53, CIS Controls)',
    teachesNote:
      'Risk and compliance work runs on structured evidence and defensible reasoning. Most of it genuinely is done in spreadsheets and documents, including at large organisations.',
    industryTools: ['Archer', 'ServiceNow GRC', 'LogicGate', 'Vanta', 'Drata', 'AuditBoard'],
    skill: 'Map a control to a requirement, gather evidence that stands up to challenge, assess residual risk honestly, and write a finding somebody will act on.',
    differences:
      'GRC platforms automate evidence collection and continuous monitoring, which saves enormous time at audit. They do not do the thinking. The judgement about whether a control is genuinely effective is the job, and no platform supplies it.',
    freeAccessNote:
      'NIST 800-53, the CSF, CIS Controls, and OSCAL are all free and public. Vanta and Drata run demos. Most of this skill needs no tooling beyond a document and a clear head.',
  },
  {
    id: 'cloud-security',
    teaches: 'ScoutSuite, Prowler, and cloud provider free tiers',
    teachesNote: 'Open-source posture assessment against real AWS, Azure, and GCP accounts you can create for free.',
    industryTools: ['Wiz', 'Palo Alto Prisma Cloud', 'Orca Security', 'AWS Security Hub', 'Microsoft Defender for Cloud'],
    skill: 'Audit a cloud account: find public storage, over-permissive IAM policies, unencrypted data, and missing logging, then judge which of those actually matters given the workload.',
    differences:
      'Commercial CNAPP platforms add agentless workload scanning, attack-path analysis across resources, and runtime protection. Their key advantage is correlating findings into "this specific path leads to your customer data", which open-source tools do not do well.',
    freeAccessNote:
      'AWS, Azure, and GCP all have free tiers sufficient for practice. Prowler and ScoutSuite are free. Set a billing alarm on day one.',
  },
  {
    id: 'identity',
    teaches: 'Keycloak, OpenLDAP, and Samba Active Directory',
    teachesNote: 'Open-source identity providers implementing the same protocols (SAML, OIDC, LDAP, Kerberos) as the commercial ones.',
    industryTools: ['Okta', 'Microsoft Entra ID (Azure AD)', 'Ping Identity', 'SailPoint', 'CyberArk (privileged access)'],
    skill: 'Reason about identity: how a login actually works across a federation, what a token asserts, how joiner-mover-leaver should be handled, and why standing privilege is dangerous.',
    differences:
      'Commercial IdPs bring lifecycle automation, access certification campaigns, and hundreds of pre-built app integrations. The protocols underneath are open standards and are identical, which is why Keycloak is a genuinely good teacher.',
    freeAccessNote:
      'Keycloak is free. Microsoft Entra ID has a free tier inside any Azure account, and Okta has a free developer tier: both are worth putting on a CV.',
  },
  {
    id: 'scripting',
    teaches: 'Python, bash, and PowerShell',
    teachesNote: 'All free, all industry standard. PowerShell matters enormously in Windows environments and is often skipped by people who learn Linux first.',
    industryTools: ['Same languages everywhere'],
    skill: 'Automate the boring part: parse a log, call an API, enrich a list of indicators, and turn a two-hour manual task into a script you run again next week.',
    differences:
      'None. This is the single highest-leverage skill on this list and it transfers to every track and every employer.',
    freeAccessNote: 'Python and bash are free. PowerShell is free and cross-platform now.',
  },
];

const BY_ID = new Map(TOOL_MAPPINGS.map((mapping) => [mapping.id, mapping]));

export function getToolMapping(id: string): ToolMapping | null {
  return BY_ID.get(id) ?? null;
}

/**
 * The standing explanation shown wherever tools are listed.
 *
 * Kept in one place so the platform's position on this is stated identically
 * everywhere, rather than drifting between pages.
 */
export const TOOL_PHILOSOPHY = {
  headline: 'We teach the skill on open-source tools, and tell you which products it maps to.',
  body: [
    'Every tool on this platform is free and open source, for three reasons. We cannot legally bundle commercial products. You should not have to buy a licence to practise. And the thing that actually transfers between employers is the skill, not the button layout.',
    'That is not the same as saying the commercial tools do not matter. Job adverts name products, and recruiters filter on those names. Where a product has a free tier, a community edition, or a trial, we tell you, because having genuinely touched Splunk or Burp is worth real money at interview, and it is usually a weekend of your time.',
    'The order matters though. Learn the skill first. Someone who understands why a query isolates the right events can pick up a new query language in a week. Someone who only memorised where the buttons are cannot explain their own findings, and that becomes obvious in the first technical interview.',
  ],
} as const;
