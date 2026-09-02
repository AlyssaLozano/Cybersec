/**
 * Web application exploitation: the Lattice storefront.
 *
 * THE SKILL EACH SIDE IS ACTUALLY LEARNING
 *
 * Red is learning that a web attack is a chain, not a single clever payload:
 * map the application, find an injection, use it to establish a foothold, turn
 * that into execution, then escalate. Skipping steps is the beginner tell. The
 * chain has a real fork in it that teaches a genuine concept: a blind SQL
 * injection can be used to extract data slowly and quietly, or to write a web
 * shell and get code execution loudly. The quiet path keeps you in the logs as
 * ordinary-looking queries; the loud path is faster and lights up the WAF.
 *
 * Blue is learning that at the application layer, blocking an IP is theatre: the
 * attacker rotates and continues, and meanwhile you have generated a ticket and
 * a false sense of resolution. The moves that actually work are the ones that
 * remove the vulnerability class (virtual-patch the injection, review the code)
 * and the ones that scope the damage (find the web shell, rotate the database
 * credentials the app used). Blue that plays whack-a-mole with source addresses
 * loses to an attacker with a second address.
 *
 * THE TARGET IS FABRICATED, ON PURPOSE AND BY RULE
 *
 * Lattice does not exist. `.example` is reserved and the addresses are RFC 5737
 * documentation ranges.
 */

import type { MatchSide, MatchSignal, MatchState, RevealedFinding } from '@soc/shared';

import { MatchError, type MoveResolution } from '../../services/matchEngine.js';
import { registerMatchScenario } from '../../services/matchContent.js';
import { lastRedMove, redHasAnyOf, redHasPlayed, scored } from './linear-kit.js';
import type { AttackerConsole, MoveOption, RedBlueScenario, TargetDossier } from './types.js';

const SCENARIO_ID = 'ln-webapp-lattice';
const MAX_TURNS = 6;

const TERMS = ['inject', 'injection', 'payload', 'shell', 'waf', 'patch', 'rotate', 'chain', 'foothold', 'escalate'];

const DOSSIER: TargetDossier = {
  org: 'Lattice Storefront',
  summary:
    'A mid-size e-commerce platform. A public web application backed by a database, a WAF in front, ' +
    'and a small application team. Authorised web-application penetration test with a defined scope.',
  facts: [
    { k: 'Application', v: 'shop.lattice.example, 203.0.113.80' },
    { k: 'Stack', v: 'Web tier plus a SQL database behind it' },
    { k: 'Edge', v: 'WAF in front, tuned to alert more than block' },
    { k: 'Uploads', v: 'A product-image upload feature exists' },
    { k: 'Team', v: 'Small app team, on-call developer' },
    { k: 'Crown', v: 'Customer and order database' },
  ],
};

const RED_OPTIONS: MoveOption[] = [
  { id: 'map-app', label: 'Map the application', description: 'Enumerate endpoints, parameters and the upload feature.' },
  { id: 'find-injection', label: 'Find an injection', description: 'Probe inputs for a SQL injection point.' },
  { id: 'blind-extract', label: 'Extract data blind', description: 'Pull data slowly through the injection. Quiet.' },
  { id: 'write-shell', label: 'Write a web shell', description: 'Use the injection to drop a shell for code execution. Loud.' },
  { id: 'upload-shell', label: 'Abuse the upload', description: 'Slip a shell through the product-image upload.' },
  { id: 'get-execution', label: 'Get code execution', description: 'Run commands on the web server through your foothold.' },
  { id: 'dump-database', label: 'Dump the database', description: 'Exfiltrate the customer and order tables wholesale.' },
  { id: 'escalate-host', label: 'Escalate on the host', description: 'Move from the web user to root on the server.' },
];

const BLUE_OPTIONS: MoveOption[] = [
  { id: 'monitor', label: 'Hold and monitor', description: 'No action. Watch the WAF and application logs.' },
  { id: 'investigate-waf', label: 'Investigate the alert', description: 'Work the WAF alert and read the application logs.' },
  { id: 'block-ip', label: 'Block the source IP', description: 'Filter the attacking address at the edge.' },
  { id: 'virtual-patch', label: 'Virtual-patch the input', description: 'A WAF rule that neutralises the injection parameter.' },
  { id: 'code-review', label: 'Fix the code', description: 'Parameterise the query and lock the upload handler.' },
  { id: 'hunt-shell', label: 'Hunt for a web shell', description: 'Search the web root for a planted shell.' },
  { id: 'rotate-db', label: 'Rotate database credentials', description: 'Change the credentials the app used, in case they leaked.' },
  { id: 'isolate-app', label: 'Take the app offline', description: 'Pull the application behind maintenance.' },
];

const RED_SIGNAL: Record<string, MatchSignal | null> = {
  'map-app': { detected: true, label: 'Web log: directory enumeration', detail: 'A burst of 404s probing endpoints and parameters.' },
  'find-injection': { detected: true, label: 'WAF: injection probe', detail: 'Requests carrying SQL metacharacters against one parameter.' },
  'blind-extract': { detected: true, label: 'Web log: repetitive timed queries', detail: 'Many near-identical requests with small variations. Slow, low, easy to miss.' },
  'write-shell': { detected: true, label: 'WAF: stacked query / file write', detail: 'An injection attempting to write to the web root.' },
  'upload-shell': { detected: true, label: 'Upload of a non-image file', detail: 'A file uploaded through the image feature that is not an image.' },
  'get-execution': { detected: true, label: 'EDR: web process spawned a shell', detail: 'The web worker process started a command interpreter.' },
  'dump-database': { detected: true, label: 'Bulk query / large response', detail: 'A query returning the whole customer table.' },
  'escalate-host': { detected: true, label: 'EDR: privilege escalation attempt', detail: 'A local exploit attempt from the web service account.' },
};

const RED_REVEALS: Record<string, RevealedFinding[]> = {
  'map-app': [
    { id: 'endpoints', kind: 'service', title: 'Application map', detail: 'A search parameter that reaches the database, and an image upload endpoint.', severity: 'info' },
  ],
  'find-injection': [
    { id: 'sqli', kind: 'vuln', title: 'SQL injection', detail: 'The search parameter is injectable. Blind, boolean-based.', severity: 'high' },
  ],
  'blind-extract': [
    { id: 'data-trickle', kind: 'service', title: 'Data coming out', detail: 'Table and column names, then rows, a few at a time. Slow but invisible.', severity: 'medium' },
  ],
  'write-shell': [
    { id: 'shell-sqli', kind: 'vuln', title: 'Web shell written', detail: 'A shell in the web root via the injection. Code execution, and a loud arrival.', severity: 'high' },
  ],
  'upload-shell': [
    { id: 'shell-upload', kind: 'vuln', title: 'Web shell uploaded', detail: 'A shell disguised as a product image, reachable directly.', severity: 'high' },
  ],
  'get-execution': [
    { id: 'rce', kind: 'vuln', title: 'Code execution', detail: 'Commands run as the web service account on the server.', severity: 'high' },
  ],
};

const RED_HOSTLOG: Record<string, string[]> = {
  'map-app': ['Sep 02 13:01 nginx: 203.0.113.9 88x 404 across /admin /api /upload in 20s'],
  'find-injection': ['Sep 02 13:08 waf: SQLi signature on param "q", action=alert, src=203.0.113.9'],
  'blind-extract': ['Sep 02 13:20 nginx: 203.0.113.9 410x GET /search?q=... 200, avg 30ms apart over 15m'],
  'write-shell': ['Sep 02 13:22 waf: stacked query + INTO OUTFILE to /var/www/html, action=alert'],
  'upload-shell': ['Sep 02 13:25 app: upload "product.jpg.php" 4KB, content-type mismatch, stored in /uploads'],
  'get-execution': ['Sep 02 13:30 WEB01 sysmon: nginx worker -> /bin/sh -c "id;uname -a"'],
  'dump-database': ['Sep 02 13:40 db: SELECT * FROM customers -> 214,000 rows, client=web-app'],
  'escalate-host': ['Sep 02 13:45 WEB01 audit: setuid exploit attempt by www-data'],
};

function hasFoothold(state: MatchState): boolean {
  return redHasAnyOf(state, ['write-shell', 'upload-shell']);
}

function blueEvidence(state: MatchState): RevealedFinding[] {
  switch (lastRedMove(state)) {
    case 'map-app':
      return [{ id: 'ev-map', kind: 'evidence', title: 'Enumeration', detail: 'Someone is mapping the app: bursts of 404s across admin and API paths. Reconnaissance, not yet an attack.', severity: 'low' }];
    case 'find-injection':
      return [{ id: 'ev-sqli', kind: 'evidence', title: 'Injection probing', detail: 'SQL metacharacters against the search parameter. The parameter is the problem, not the address.', severity: 'high' }];
    case 'blind-extract':
      return [{ id: 'ev-blind', kind: 'evidence', title: 'Blind extraction', detail: 'Hundreds of near-identical timed queries. Data is leaving slowly through the injection.', severity: 'high' }];
    case 'write-shell':
    case 'upload-shell':
      return [{ id: 'ev-shell', kind: 'evidence', title: 'Web shell', detail: 'A shell in the web root. Blocking the source will not remove it; you have to find and delete it.', severity: 'high' }];
    case 'get-execution':
      return [{ id: 'ev-rce', kind: 'evidence', title: 'Code execution', detail: 'The web process spawned a shell. The server is compromised, not just the app.', severity: 'high' }];
    case 'dump-database':
      return [{ id: 'ev-dump', kind: 'evidence', title: 'Database dumped', detail: 'The customer table was read wholesale. Assume the credentials the app used are compromised too.', severity: 'high' }];
    default:
      return [];
  }
}

function resolveRed(state: MatchState, optionId: string, justification: string): MoveResolution {
  const signal = RED_SIGNAL[optionId];
  if (signal === undefined) throw new MatchError('That is not a red move in this scenario.');
  const common = { justification, terms: TERMS, signal, reveals: RED_REVEALS[optionId], hostLog: RED_HOSTLOG[optionId] };

  if (redHasPlayed(state, optionId)) {
    return scored({ ...common, points: 2, note: 'Already done.' });
  }

  const mapped = redHasPlayed(state, 'map-app');
  const injectable = redHasPlayed(state, 'find-injection');
  const foothold = hasFoothold(state);
  const execution = redHasPlayed(state, 'get-execution');

  switch (optionId) {
    case 'map-app':
      return scored({ ...common, points: 8, note: 'Map before you strike. You cannot inject a parameter you have not found.' });
    case 'find-injection':
      if (!mapped) return scored({ ...common, points: 4, note: 'You found something by luck. Mapping first would have told you where to look.' });
      return scored({ ...common, points: 9, note: 'A real injection point, found where the map said to look. This is the pivot of the whole chain.' });
    case 'blind-extract':
      if (!injectable) return scored({ ...common, points: 3, note: 'Extract through what? You have no injection yet.' });
      return scored({ ...common, points: 8, note: 'Slow, patient, and it reads like ordinary traffic. The quiet fork of the chain.' });
    case 'write-shell':
      if (!injectable) return scored({ ...common, points: 3, note: 'You need the injection before you can write through it.' });
      return scored({ ...common, points: 7, note: 'Code execution from the injection, and a loud arrival. Faster than blind extraction, and it lights up the WAF.' });
    case 'upload-shell':
      if (!mapped) return scored({ ...common, points: 4, note: 'You need to know the upload feature exists first.' });
      return scored({ ...common, points: 7, note: 'A shell through the image upload. A clean second path to a foothold.' });
    case 'get-execution':
      if (!foothold) return scored({ ...common, points: 3, note: 'Execution needs a foothold. Plant a shell first.' });
      return scored({ ...common, points: 9, note: 'Commands running on the server. The foothold is now a real one.' });
    case 'dump-database':
      if (!injectable && !execution) return scored({ ...common, points: 3, note: 'You have no path to the data yet.' });
      return scored({ ...common, points: 8, note: 'The objective. Loud, but if the credentials are broad it is a single decisive read.' });
    case 'escalate-host':
      if (!execution) return scored({ ...common, points: 3, note: 'You cannot escalate on a host you cannot run commands on.' });
      return scored({ ...common, points: 8, note: 'From the web user to root. Now the whole server is yours, not just the app.' });
    default:
      throw new MatchError('That is not a red move in this scenario.');
  }
}

function resolveBlue(state: MatchState, optionId: string, justification: string): MoveResolution {
  const last = lastRedMove(state);
  const injectable = redHasPlayed(state, 'find-injection');
  const foothold = hasFoothold(state);
  const dumped = redHasPlayed(state, 'dump-database');
  const evidence = blueEvidence(state);
  const common = { justification, terms: TERMS };
  const quiet = last === null || last === 'map-app';

  switch (optionId) {
    case 'monitor':
      if (quiet) return scored({ ...common, points: 7, note: 'Reconnaissance only so far. Watching is reasonable.' });
      if (!foothold && !dumped) return scored({ ...common, points: 4, note: 'They are probing for real. Watching is thin now.' });
      return scored({ ...common, points: 1, note: 'They have a shell or your data and you watched. That is the miss.' });

    case 'investigate-waf':
      if (quiet) return scored({ ...common, points: 4, note: 'Only enumeration in the logs. Worth a glance, not an emergency.' });
      return scored({ ...common, points: 9, note: 'Reading the logs tells you it is the parameter that is vulnerable, not the address. Everything correct follows from that.', reveals: evidence });

    case 'block-ip':
      // The scenario's headline lesson for Blue.
      if (quiet) return scored({ ...common, points: 3, note: 'Blocking a scanner’s address. They will rotate, and you have a ticket that feels like progress.' });
      return scored({ ...common, points: 2, note: 'At the application layer this is theatre. The attacker changes address and continues, and the vulnerability is still there. Fix the parameter, not the packet.' });

    case 'virtual-patch':
      if (injectable) return scored({ ...common, points: 9, note: 'A rule that neutralises the injectable parameter stops the technique regardless of source. The right immediate control.' });
      return scored({ ...common, points: 5, note: 'Pre-emptive hardening. Nothing is exploiting an input yet, but it does no harm.' });

    case 'code-review':
      if (injectable || foothold) return scored({ ...common, points: 10, note: 'Parameterising the query removes the vulnerability class, not just this instance. It is the only permanent fix here.' });
      return scored({ ...common, points: 6, note: 'Always worth doing. Nothing is being exploited yet, so it costs a round.' });

    case 'hunt-shell':
      if (foothold) return scored({ ...common, points: 10, note: 'You found the shell. Blocking the source would never have removed it; only finding and deleting it does.', reveals: evidence });
      return scored({ ...common, points: 5, note: 'Nothing planted yet, but looking is the right instinct once execution is possible.' });

    case 'rotate-db':
      if (dumped || foothold) return scored({ ...common, points: 8, note: 'The app’s database credentials should be assumed leaked. Rotating them limits what a foothold can still reach.' });
      return scored({ ...common, points: 5, note: 'Good hygiene, though nothing suggests the credentials are out yet.' });

    case 'isolate-app':
      if (foothold || dumped) return scored({ ...common, points: 8, note: 'Once they have a shell or your data, taking the app down to fix it properly is proportionate. Costly and correct.' });
      if (injectable) return scored({ ...common, points: 6, note: 'Heavy, but defensible with a live injection and no quick patch ready.' });
      return scored({ ...common, points: 3, note: 'You took the storefront offline over a scan. That is self-inflicted downtime.' });

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

const HELP = [
  'Web pentest console. Target authorised: shop.lattice.example (203.0.113.80).',
  '  map                        enumerate endpoints and parameters',
  '  sqlmap <param>             probe an input for injection',
  '  extract --blind            pull data slowly through the injection  (quiet)',
  '  sqli --write-shell         write a web shell via the injection     (loud)',
  '  upload --shell             slip a shell through the image upload',
  '  shell "cmd"                run a command through your foothold',
  '  dump --db                  exfiltrate the customer tables',
  '  privesc                    escalate from the web user to root',
  'Each real command is your move for the turn. Say why before you run it.',
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
    case 'map':
    case 'gobuster':
    case 'ffuf':
      return { output: 'Found /search (param q, hits the DB) and /upload (product images).\n', optionId: 'map-app' };
    case 'sqlmap':
      return { output: 'Parameter "q" is injectable: boolean-based blind.\n', optionId: 'find-injection' };
    case 'extract':
      return { output: 'Extracting schema and rows a few at a time through the injection.\n', optionId: 'blind-extract' };
    case 'sqli':
      if (lower.includes('shell') || lower.includes('outfile')) return { output: 'Wrote a shell to the web root via INTO OUTFILE.\n', optionId: 'write-shell' };
      return { output: 'Specify --write-shell, or use extract --blind.\n', optionId: null };
    case 'upload':
      return { output: 'Uploaded product.jpg.php through the image feature.\n', optionId: 'upload-shell' };
    case 'shell':
      return { output: 'www-data@WEB01: id=www-data, uname=Linux WEB01.\n', optionId: 'get-execution' };
    case 'dump':
      return { output: 'Dumped customers (214,000 rows) and orders.\n', optionId: 'dump-database' };
    case 'privesc':
      return { output: 'Local exploit succeeded. You are root on WEB01.\n', optionId: 'escalate-host' };
    default:
      return { output: `${tool || 'that'}: not a tool on this console. Type help.\n`, optionId: null };
  }
}

const ATTACKER_CONSOLE: AttackerConsole = {
  banner: [
    'Web pentest console attached. Target authorised: shop.lattice.example.',
    'Type help for tooling. Every real command is your move for the turn.',
  ],
  run: attackerRun,
};

export const WEBAPP_LATTICE: RedBlueScenario = {
  id: SCENARIO_ID,
  title: 'Front Door: Lattice Storefront',
  brief:
    'A web attack is a chain: map the app, find the injection, turn it into a foothold, get ' +
    'execution, escalate. Red is graded on building that chain in order and on choosing between a ' +
    'quiet blind extraction and a loud web shell. Blue is graded on resisting the instinct to block ' +
    'the source address, which at the application layer is theatre, and instead removing the ' +
    'vulnerability and hunting the shell the attacker left behind.',
  maxTurns: MAX_TURNS,
  dossier: DOSSIER,
  red: RED_OPTIONS,
  blue: BLUE_OPTIONS,
  resolve,
  attacker: ATTACKER_CONSOLE,
};

registerMatchScenario(WEBAPP_LATTICE.id, WEBAPP_LATTICE.resolve, { maxTurns: WEBAPP_LATTICE.maxTurns });
