/**
 * Operation Tidewater, Week 1: reconnaissance against Northwind Logistics.
 *
 * THE SKILL EACH SIDE IS ACTUALLY LEARNING
 *
 * Red is not graded on gathering the most intel. It is graded on gathering it
 * QUIETLY and IN ORDER: exhaust the passive sources that leave no trace before
 * touching the host, and never reach for a loud scan a recon phase does not
 * need. Going active early is the classic beginner tell, so it is what the
 * scoring punishes.
 *
 * Blue is not graded on doing something. It is graded on doing the RIGHT thing
 * for what actually landed in the queue: hold when the floor is quiet, dig when
 * a real probe shows, and reach for a block only when the traffic earns it.
 * Blocking a single banner grab, or investigating an empty queue, is the alert
 * fatigue this is meant to rehearse away.
 *
 * The two graders meet in the middle: a signal Red leaks is exactly the input
 * Blue is scored against, so a careful Red starves Blue of anything to react to,
 * and a reckless Red hands Blue an easy round. That is the adversarial loop.
 *
 * THE TARGET IS FABRICATED, ON PURPOSE AND BY RULE
 *
 * Northwind Logistics does not exist. `northwind.example` is a reserved TLD and
 * every address is an RFC 5737 documentation range, so nothing here resolves to
 * a real host no matter what a student pictures themselves running.
 */

import type { MatchSide, MatchSignal, MatchState, RevealedFinding } from '@soc/shared';

import { MatchError, type MoveResolution } from '../../services/matchEngine.js';
import { registerMatchScenario } from '../../services/matchContent.js';
import type { AttackerConsole, MoveOption, RedBlueScenario, TargetDossier } from './types.js';

const SCENARIO_ID = 'rt-recon-northwind';
const MAX_TURNS = 5;

/** Every objective score in this scenario is out of ten, so a UI can show x/10. */
const MAX_OBJECTIVE = 10;
/** The justification is scored out of ten too, so reasoning is half of a move. */
const MAX_JUDGE = 10;

const DOSSIER: TargetDossier = {
  org: 'Northwind Logistics',
  summary:
    'Regional freight and third-party logistics, about 480 staff. Hybrid identity: ' +
    'Azure AD joined to an on-prem Windows domain. Authorised external assessment.',
  facts: [
    { k: 'Domain', v: 'northwind.example' },
    { k: 'Web', v: '203.0.113.10 (nginx)' },
    { k: 'Mail', v: 'mx1.northwind.example, 203.0.113.25' },
    { k: 'Name server', v: 'ns1.northwind.example, 198.51.100.53' },
    { k: 'VPN', v: 'vpn.northwind.example, 203.0.113.44' },
    { k: 'Public range', v: '203.0.113.0/24' },
  ],
};

/** Red's menu, public. Passive sources are marked for the scorer, not the UI. */
const RED_OPTIONS: MoveOption[] = [
  { id: 'osint-sweep', label: 'OSINT sweep', description: 'Company site, LinkedIn, press. Org shape and names.' },
  { id: 'whois', label: 'WHOIS lookup', description: 'Registrar, registrant, nameservers.' },
  { id: 'dns-passive', label: 'Passive DNS', description: 'Resolve public records without touching the host.' },
  { id: 'cert-transparency', label: 'Certificate transparency', description: 'Subdomains from public CT logs.' },
  { id: 'job-postings', label: 'Job postings', description: 'Infer the tech stack from what they hire for.' },
  { id: 'banner-grab', label: 'Banner grab', description: 'One HTTP request to read the web server version.' },
  { id: 'port-scan-slow', label: 'Slow port scan', description: 'A handful of ports, low and slow.' },
  { id: 'port-sweep-full', label: 'Full port sweep', description: 'Every port across the /24, fast.' },
  { id: 'vuln-scan', label: 'Vulnerability scan', description: 'An automated scanner against the web tier.' },
];

/** Blue's menu, public. */
const BLUE_OPTIONS: MoveOption[] = [
  { id: 'hold-baseline', label: 'Hold and monitor', description: 'No action. Keep watching the baseline.' },
  { id: 'investigate', label: 'Investigate alert', description: 'Pull the logs on the latest signal.' },
  { id: 'block-source', label: 'Block the source', description: 'Filter the external address at the edge.' },
  { id: 'tune-detection', label: 'Tune detection', description: 'Tighten a rule so the next probe stands out.' },
];

/**
 * Hidden per-move data for Red: how passive it is, its intel value, and the
 * signal it leaves for Blue. Never leaves the server.
 */
const PASSIVE = new Set(['osint-sweep', 'whois', 'dns-passive', 'cert-transparency', 'job-postings']);
const LOUD = new Set(['port-sweep-full', 'vuln-scan']);

const RED_INTEL: Record<string, number> = {
  'osint-sweep': 9,
  whois: 7,
  'dns-passive': 8,
  'cert-transparency': 8,
  'job-postings': 7,
  'banner-grab': 6,
  'port-scan-slow': 7,
  'port-sweep-full': 8,
  'vuln-scan': 8,
};

const RED_SIGNAL: Record<string, MatchSignal | null> = {
  'osint-sweep': null,
  whois: null,
  'dns-passive': null,
  'cert-transparency': null,
  'job-postings': null,
  'banner-grab': {
    detected: true,
    label: 'Web banner probe',
    detail: 'A single external HTTP request to 203.0.113.10.',
  },
  'port-scan-slow': {
    detected: true,
    label: 'Sequential connections',
    detail: 'Low-rate connection attempts from one external source.',
  },
  'port-sweep-full': {
    detected: true,
    label: 'IDS: horizontal port scan',
    detail: 'A fast sweep across 203.0.113.0/24.',
  },
  'vuln-scan': {
    detected: true,
    label: 'IDS: vulnerability scanner',
    detail: 'Known scanner signatures against the web tier.',
  },
};

/**
 * What each red recon move lets Red SEE. This is the attack surface filling in:
 * plain services, and the one vuln that recon is meant to surface -- an outdated
 * Tomcat with its manager console exposed, the same finding the "read the scan"
 * lesson turns on. Ids are stable, so overlapping recon does not double up.
 */
const RED_REVEALS: Record<string, RevealedFinding[]> = {
  'osint-sweep': [
    { id: 'sec-team', kind: 'service', title: 'Small security team', detail: 'Careers page implies a two-person security team.', severity: 'info' },
  ],
  whois: [
    { id: 'nameservers', kind: 'service', title: 'Nameservers', detail: 'ns1.northwind.example at 198.51.100.53.', severity: 'info' },
  ],
  'dns-passive': [
    { id: 'mail-host', kind: 'service', title: 'Mail host', detail: 'mx1.northwind.example, 203.0.113.25.', severity: 'info' },
    { id: 'vpn-host', kind: 'service', title: 'VPN portal', detail: 'vpn.northwind.example, 203.0.113.44.', severity: 'info' },
  ],
  'cert-transparency': [
    { id: 'staging', kind: 'service', title: 'Staging subdomain', detail: 'staging.northwind.example, seen in CT logs.', severity: 'low' },
  ],
  'job-postings': [
    { id: 'tech-stack', kind: 'service', title: 'Tech stack', detail: 'Job posts name Azure AD, Splunk, and Apache Tomcat.', severity: 'info' },
  ],
  'banner-grab': [
    { id: 'web', kind: 'service', title: 'Web server', detail: 'nginx 1.24 on 203.0.113.10, patched.', severity: 'info' },
    { id: 'tomcat-manager', kind: 'vuln', title: 'Exposed Tomcat manager', detail: 'Apache Tomcat 8.5.0 with /manager reachable on 203.0.113.10:8080.', severity: 'high' },
  ],
  'port-scan-slow': [
    { id: 'open-ports', kind: 'service', title: 'Open ports', detail: '22, 443, and 8080 open on 203.0.113.10.', severity: 'low' },
  ],
  'port-sweep-full': [
    { id: 'open-ports', kind: 'service', title: 'Open ports', detail: '22, 443, and 8080 open across 203.0.113.10.', severity: 'low' },
    { id: 'tomcat-manager', kind: 'vuln', title: 'Exposed Tomcat manager', detail: 'Apache Tomcat 8.5.0 with /manager reachable on 203.0.113.10:8080.', severity: 'high' },
  ],
  'vuln-scan': [
    { id: 'tomcat-manager', kind: 'vuln', title: 'Exposed Tomcat manager', detail: 'Apache Tomcat 8.5.0 with /manager reachable; weak credentials likely.', severity: 'high' },
    { id: 'vpn-cve', kind: 'vuln', title: 'VPN appliance', detail: 'vpn.northwind.example build matches a published CVE.', severity: 'high' },
  ],
};

/**
 * The trace each loud red move leaves on the host, for a defender to find in the
 * terminal at the higher tiers. Passive recon writes nothing, which is exactly
 * why it is quiet. Documentation ranges only.
 */
const RED_HOSTLOG: Record<string, string[]> = {
  'banner-grab': ['Sep 01 14:02:11 edge nginx: 203.0.113.9 - - "GET / HTTP/1.1" 200 "-" "curl/8.4.0"'],
  'port-scan-slow': [
    'Sep 01 14:05:40 edge kernel: [UFW AUDIT] SRC=203.0.113.9 DST=203.0.113.10 PROTO=TCP DPT=22',
    'Sep 01 14:05:52 edge kernel: [UFW AUDIT] SRC=203.0.113.9 DST=203.0.113.10 PROTO=TCP DPT=8080',
  ],
  'port-sweep-full': [
    'Sep 01 14:09:03 edge kernel: [UFW BLOCK] SRC=203.0.113.9 DST=203.0.113.10 horizontal scan ports=1-65535 in 4s',
  ],
  'vuln-scan': ['Sep 01 14:12:30 edge nginx: 203.0.113.9 burst of 400 requests, UA "Mozilla/5.00 (Nikto/2.5.0)"'],
};

/**
 * What a Blue INVESTIGATE turns up: the log evidence behind Red's most recent
 * move. Nothing to investigate when Red stayed passive, which is the point of
 * the "do not chase an empty queue" lesson.
 */
function blueEvidence(state: MatchState): RevealedFinding[] {
  for (let i = state.moves.length - 1; i >= 0; i -= 1) {
    const move = state.moves[i];
    if (!move || move.side !== 'red') continue;
    switch (move.optionId) {
      case 'banner-grab':
        return [{ id: 'ev-banner', kind: 'evidence', title: 'Single external probe', detail: 'One GET / from an external address, curl user agent.', severity: 'low' }];
      case 'port-scan-slow':
        return [{ id: 'ev-slow', kind: 'evidence', title: 'Low-rate connections', detail: 'A handful of SYNs to 203.0.113.10 over a minute.', severity: 'low' }];
      case 'port-sweep-full':
        return [{ id: 'ev-sweep', kind: 'evidence', title: 'Horizontal scan', detail: 'SYNs to over a thousand ports across the /24 in seconds.', severity: 'high' }];
      case 'vuln-scan':
        return [{ id: 'ev-scan', kind: 'evidence', title: 'Scanner signatures', detail: 'Known vulnerability-scanner fingerprints against the web tier.', severity: 'high' }];
      default:
        return [];
    }
  }
  return [];
}

/** How much noise Red's most recent move made, as Blue would grade its response. */
type Threat = 'none' | 'low' | 'high';

function lastRedThreat(state: MatchState): Threat {
  for (let i = state.moves.length - 1; i >= 0; i -= 1) {
    const move = state.moves[i];
    if (!move || move.side !== 'red') continue;
    if (PASSIVE.has(move.optionId)) return 'none';
    if (LOUD.has(move.optionId)) return 'high';
    return 'low';
  }
  return 'none';
}

/**
 * Score the written rationale. A DETERMINISTIC RUBRIC, NOT AN LLM.
 *
 * The platform is offline by design, so there is no model to read a sentence and
 * judge it. What this can do honestly is reward the two things a good rationale
 * has: it is developed rather than a shrug, and it names the consideration the
 * move is actually about (stealth and sequencing for recon, reading the queue
 * for defence). It is gameable by stuffing the right words, and it is meant as a
 * teaching nudge, not a verdict. If a real judge is wired up later, it drops in
 * exactly here.
 */
const CONCEPT_TERMS = [
  'passive', 'quiet', 'trace', 'detect', 'loud', 'noise', 'stealth', 'footprint',
  'signal', 'alert', 'log', 'queue', 'probe', 'scan', 'baseline', 'block',
  'investigate', 'overreact', 'fatigue', 'exhaust', 'before', 'first', 'order',
  'intel', 'enumerate', 'nothing',
];

function judgeJustification(text: string): number {
  const t = text.toLowerCase();
  const words = t.split(/\s+/).filter(Boolean);
  let pts = 0;
  if (words.length >= 6) pts += 4;
  else if (words.length >= 3) pts += 2;
  const hits = CONCEPT_TERMS.filter((term) => t.includes(term)).length;
  pts += Math.min(6, hits * 3);
  return Math.min(MAX_JUDGE, pts);
}

function score(
  objectivePoints: number,
  note: string,
  signal: MatchSignal | null,
  justification: string,
  reveals?: RevealedFinding[],
  hostLog?: string[],
): MoveResolution {
  return {
    score: {
      objectivePoints,
      maxObjective: MAX_OBJECTIVE,
      judgePoints: judgeJustification(justification),
      maxJudge: MAX_JUDGE,
      note,
    },
    signal,
    reveals,
    hostLog,
  };
}

function resolveRed(state: MatchState, optionId: string, justification: string): MoveResolution {
  const intel = RED_INTEL[optionId];
  if (intel === undefined) throw new MatchError('That is not a red move in this scenario.');
  const reveals = RED_REVEALS[optionId] ?? [];
  const hostLog = RED_HOSTLOG[optionId];

  const priorRed = state.moves.filter((m) => m.side === 'red');
  const repeated = priorRed.some((m) => m.optionId === optionId);
  const signal = RED_SIGNAL[optionId] ?? null;

  if (repeated) {
    return score(2, 'You already ran this. Little new intel the second time.', signal, justification, reveals, hostLog);
  }
  if (PASSIVE.has(optionId)) {
    return score(intel, 'Passive source. Full intel, no trace.', signal, justification, reveals, hostLog);
  }

  // Active. Discipline is having drained the passive well first; a recon phase
  // that goes loud before it has to is the thing being trained out.
  const passivesUsed = new Set(priorRed.filter((m) => PASSIVE.has(m.optionId)).map((m) => m.optionId));
  // Two distinct passive sources first counts as disciplined. The terminal tier
  // exposes fewer passive tools than the menu, and the lesson has to hold in both.
  const disciplined = passivesUsed.size >= 2;
  const base = LOUD.has(optionId) ? 3 : 5;

  if (!disciplined) {
    return score(
      Math.max(1, base - 3),
      'You went active before exhausting passive sources. Loud, and earlier than you needed to be.',
      signal,
      justification,
      reveals,
      hostLog,
    );
  }
  const note = LOUD.has(optionId)
    ? 'A heavy active scan. Rarely what recon needs, and it is loud.'
    : 'A careful active probe after passive recon. Reasonable, small footprint.';
  return score(base, note, signal, justification, reveals, hostLog);
}

function resolveBlue(state: MatchState, optionId: string, justification: string): MoveResolution {
  const threat = lastRedThreat(state);
  const evidence = blueEvidence(state);
  const blockSignal: MatchSignal = {
    detected: true,
    label: 'Source blocked',
    detail: 'Your external source appears to be filtered at the edge.',
  };

  switch (optionId) {
    case 'hold-baseline':
      if (threat === 'none') return score(10, 'Nothing landed. Holding was the right call.', null, justification);
      if (threat === 'low') return score(6, 'A faint probe showed. Watching is defensible.', null, justification);
      return score(2, 'A real scan landed and you sat on it. That is a miss.', null, justification);
    case 'investigate':
      if (threat === 'none') return score(3, 'Nothing to investigate. Watch for alert fatigue.', null, justification);
      return score(9, 'A signal was in the queue and you worked it. Correct.', null, justification, evidence);
    case 'block-source':
      if (threat === 'high') return score(10, 'A clear scan. Blocking the source was the right call.', blockSignal, justification);
      if (threat === 'low') return score(5, 'Heavy-handed for a single probe, but not wrong.', blockSignal, justification);
      return score(1, 'You blocked with nothing on the wire. That filters legitimate traffic.', blockSignal, justification);
    case 'tune-detection':
      if (threat === 'high') return score(8, 'Hardening a rule right after an attack. Good instinct.', null, justification);
      return score(6, 'Proactive tuning. Low risk, steady value.', null, justification);
    default:
      throw new MatchError('That is not a blue move in this scenario.');
  }
}

const resolve = ({
  state,
  side,
  optionId,
  justification,
}: {
  state: MatchState;
  side: MatchSide;
  optionId: string;
  justification: string;
}): MoveResolution =>
  side === 'red' ? resolveRed(state, optionId, justification) : resolveBlue(state, optionId, justification);

/**
 * Red's recon console for the terminal tiers.
 *
 * Not the host shell: the attacker has no session on Northwind, so this answers
 * scanning tools with realistic output against the fabricated target. A real
 * recon command maps to the SAME optionId the menu uses, so scoring, findings,
 * and the trace left for Blue all flow through one resolver. Anything else costs
 * no turn, so `help` and typos are free. Quiet tools (whois, dig) leave nothing;
 * loud ones (nmap, nikto) do, exactly as on the menu.
 */
const HELP = [
  'Recon console. Target: northwind.example (203.0.113.0/24). Tools:',
  '  whois <domain>     registration data          (quiet)',
  '  dig <domain>       DNS records                (quiet)',
  '  curl -I <url>      read a web server banner    (a light touch)',
  '  nmap [-F] <host>   port and service scan       (loud)',
  '  nikto <url>        web vulnerability scan       (loud)',
  'Each real recon command is your move for the turn. Say why before you run it.',
  '',
].join('\n');

const NMAP_FULL = [
  'Starting Nmap against 203.0.113.10',
  'Nmap scan report for 203.0.113.10',
  'Host is up (0.021s latency).',
  'PORT     STATE SERVICE  VERSION',
  '22/tcp   open  ssh      OpenSSH 8.9',
  '443/tcp  open  https    nginx 1.24.0',
  '8080/tcp open  http     Apache Tomcat 8.5.0',
  'Nmap done: 1 host scanned in 6.14s',
  '',
].join('\n');

const NMAP_FAST = [
  'Starting Nmap against 203.0.113.10 (fast scan)',
  'PORT     STATE SERVICE',
  '22/tcp   open  ssh',
  '443/tcp  open  https',
  '8080/tcp open  http-proxy',
  'Nmap done: 100 ports scanned',
  '',
].join('\n');

const CURL_NGINX = [
  'HTTP/1.1 200 OK',
  'Server: nginx/1.24.0',
  'Content-Type: text/html',
  '',
].join('\n');

const CURL_TOMCAT = [
  'HTTP/1.1 401 Unauthorized',
  'Server: Apache Tomcat/8.5.0',
  'WWW-Authenticate: Basic realm="Tomcat Manager Application"',
  '',
].join('\n');

const WHOIS_OUT = [
  'Domain Name: NORTHWIND.EXAMPLE',
  'Registrar: Example Registrar, Inc.',
  'Name Server: NS1.NORTHWIND.EXAMPLE (198.51.100.53)',
  'Creation Date: 2016-04-11',
  '',
].join('\n');

const DIG_OUT = [
  ';; ANSWER SECTION:',
  'northwind.example.        3600 IN A     203.0.113.10',
  'mx1.northwind.example.    3600 IN A     203.0.113.25',
  'vpn.northwind.example.    3600 IN A     203.0.113.44',
  '',
].join('\n');

const NIKTO_OUT = [
  '- Nikto v2.5.0 against 203.0.113.10:8080',
  '+ Server: Apache Tomcat/8.5.0',
  '+ /manager/html: Tomcat Manager interface found (potentially dangerous).',
  '+ Apache Tomcat 8.5.0 appears outdated; known vulnerabilities exist.',
  '',
].join('\n');

function attackerRun(command: string): { output: string; optionId: string | null } {
  const cmd = command.trim();
  const tool = (cmd.split(/\s+/)[0] ?? '').toLowerCase();
  const lower = cmd.toLowerCase();
  switch (tool) {
    case 'help':
    case '?':
      return { output: HELP, optionId: null };
    case 'nmap':
      if (lower.includes('--script') && lower.includes('vuln')) return { output: NIKTO_OUT, optionId: 'vuln-scan' };
      if (/(^|\s)-f(\s|$)|-t[0-2](\s|$)|--top-ports/.test(lower)) return { output: NMAP_FAST, optionId: 'port-scan-slow' };
      return { output: NMAP_FULL, optionId: 'port-sweep-full' };
    case 'curl':
    case 'wget':
    case 'nc':
    case 'ncat':
      return {
        output: lower.includes('8080') || lower.includes('manager') ? CURL_TOMCAT : CURL_NGINX,
        optionId: 'banner-grab',
      };
    case 'whois':
      return { output: WHOIS_OUT, optionId: 'whois' };
    case 'dig':
    case 'nslookup':
    case 'host':
      return { output: DIG_OUT, optionId: 'dns-passive' };
    case 'nikto':
      return { output: NIKTO_OUT, optionId: 'vuln-scan' };
    default:
      return { output: `${tool || 'that'}: not a recon tool on this console. Type help.\n`, optionId: null };
  }
}

const ATTACKER_CONSOLE: AttackerConsole = {
  banner: [
    'Recon console attached. Target authorised: northwind.example (203.0.113.0/24).',
    'Type help for tools. Every real recon command is your move for the turn.',
  ],
  run: attackerRun,
};

export const RECON_NORTHWIND: RedBlueScenario = {
  id: SCENARIO_ID,
  title: 'Operation Tidewater: Recon',
  brief:
    'An authorised external assessment of Northwind Logistics. Red builds a picture of the ' +
    'target; Blue watches the floor. Red wins the round by learning without being seen; Blue ' +
    'wins it by reading the queue correctly, neither jumping at shadows nor sleeping through a scan.',
  maxTurns: MAX_TURNS,
  dossier: DOSSIER,
  red: RED_OPTIONS,
  blue: BLUE_OPTIONS,
  resolve,
  attacker: ATTACKER_CONSOLE,
};

// Self-register on import, so loading the red-blue catalogue wires the resolver
// and the turn budget into the engine seam.
registerMatchScenario(RECON_NORTHWIND.id, RECON_NORTHWIND.resolve, { maxTurns: RECON_NORTHWIND.maxTurns });
