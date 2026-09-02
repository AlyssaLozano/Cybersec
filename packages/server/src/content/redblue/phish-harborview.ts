/**
 * Initial access: phishing Harborview Clinic.
 *
 * THE SKILL EACH SIDE IS ACTUALLY LEARNING
 *
 * Red is graded on TARGETING and on defeating the second factor properly. Mass
 * generic phishing is cheap, loud and mostly caught; a tailored pretext built
 * from real reconnaissance is what actually lands. And the modern lesson: a
 * credential harvesting page gets you a password that multi-factor makes
 * useless, while an adversary-in-the-middle proxy gets you the SESSION, which
 * multi-factor does not protect at all. Red that reaches for the old technique
 * scores like it is 2015.
 *
 * Blue is graded on containing the right thing. This scenario exists largely to
 * teach ONE point that catches out most junior responders: when a session token
 * has been stolen, a password reset does nothing. The attacker is already
 * holding a valid session and will keep it until the tokens are revoked. Blue
 * that resets the password and closes the ticket has left the intruder inside
 * and written "resolved" on it. Revoking sessions is the move, and the scoring
 * says so loudly.
 *
 * The two graders meet where they should: if Red takes the password route, a
 * reset genuinely is enough, so the same Blue move is right or wrong depending
 * on what Red actually did. That is the reasoning the justification field is
 * there to capture.
 *
 * THE TARGET IS FABRICATED, ON PURPOSE AND BY RULE
 *
 * Harborview Clinic does not exist. `.example` is a reserved TLD and every
 * address is an RFC 5737 documentation range, so nothing here resolves.
 */

import type { MatchSide, MatchSignal, MatchState, RevealedFinding } from '@soc/shared';

import { MatchError, type MoveResolution } from '../../services/matchEngine.js';
import { registerMatchScenario } from '../../services/matchContent.js';
import { lastRedMove, redHasAnyOf, redHasPlayed, scored } from './linear-kit.js';
import type { AttackerConsole, MoveOption, RedBlueScenario, TargetDossier } from './types.js';

const SCENARIO_ID = 'ln-phish-harborview';
const MAX_TURNS = 6;

/** Estate vocabulary the justification rubric should also credit. */
const TERMS = ['phish', 'pretext', 'token', 'session', 'revoke', 'factor', 'mfa', 'consent', 'reset'];

const DOSSIER: TargetDossier = {
  org: 'Harborview Clinic',
  summary:
    'A private outpatient clinic, about 120 staff, using cloud mail and single sign-on with ' +
    'app-prompt multi-factor authentication. Clinicians are busy, mobile and used to approving ' +
    'prompts. Authorised social engineering assessment with clinical leadership sign-off.',
  facts: [
    { k: 'Domain', v: 'harborview.example' },
    { k: 'Mail', v: 'Cloud tenant, SSO to everything' },
    { k: 'Second factor', v: 'Push approval (no number matching)' },
    { k: 'Web', v: 'www.harborview.example, 198.51.100.15' },
    { k: 'Staff', v: 'About 120, high clinical workload' },
    { k: 'Reporting', v: 'A report button exists; usage is patchy' },
  ],
};

/** Red's menu. Public: nothing here says what scores. */
const RED_OPTIONS: MoveOption[] = [
  { id: 'osint-staff', label: 'Map the staff', description: 'Public site, professional networks, published clinical papers.' },
  { id: 'register-lookalike', label: 'Register a lookalike domain', description: 'A domain that reads as Harborview at a glance.' },
  { id: 'blast-generic', label: 'Generic mass phish', description: 'One template to every address you can guess. Cheap.' },
  { id: 'tailored-pretext', label: 'Tailored pretext', description: 'A believable message built from what recon told you.' },
  { id: 'harvest-page', label: 'Credential harvesting page', description: 'A convincing login page that captures the password.' },
  { id: 'aitm-proxy', label: 'Adversary-in-the-middle', description: 'Relay the real login and capture the session itself.' },
  { id: 'macro-attachment', label: 'Macro attachment', description: 'A document that runs code when opened.' },
  { id: 'mfa-fatigue', label: 'Push bombing and a phone call', description: 'Repeat prompts, then call claiming to be IT.' },
  { id: 'consent-app', label: 'Malicious OAuth consent', description: 'An app that asks the user to grant it mailbox access.' },
];

/** Blue's menu. */
const BLUE_OPTIONS: MoveOption[] = [
  { id: 'hold', label: 'Hold and monitor', description: 'No action. Watch the reporting queue.' },
  { id: 'triage-report', label: 'Triage the report', description: 'Work the user report and establish what actually happened.' },
  { id: 'block-sender', label: 'Block sender and domain', description: 'Filter the sending infrastructure at the gateway.' },
  { id: 'reset-password', label: 'Reset the password', description: 'Force a credential change on the affected account.' },
  { id: 'revoke-sessions', label: 'Revoke sessions and tokens', description: 'Invalidate every issued session for the account.' },
  { id: 'audit-consent', label: 'Audit app consents', description: 'Review and remove OAuth grants on the tenant.' },
  { id: 'harden-mfa', label: 'Harden the second factor', description: 'Number matching now, phishing-resistant factors next.' },
  { id: 'brief-staff', label: 'Targeted briefing', description: 'Warn the specific people being targeted.' },
];

/**
 * What each red move leaks. Recon and infrastructure setup are silent because
 * they happen entirely off the target estate, which is exactly why they are the
 * right things to do first.
 */
const RED_SIGNAL: Record<string, MatchSignal | null> = {
  'osint-staff': null,
  'register-lookalike': null,
  'blast-generic': {
    detected: true,
    label: 'Mail security: bulk campaign',
    detail: 'A templated message to many recipients, several reported by staff.',
  },
  'tailored-pretext': {
    detected: true,
    label: 'User report: suspicious message',
    detail: 'One clinician reported a convincing message referencing a real project.',
  },
  'harvest-page': {
    detected: true,
    label: 'Sign-in from an unfamiliar location',
    detail: 'A successful authentication for a clinical account, unusual source.',
  },
  'aitm-proxy': {
    detected: true,
    label: 'Sign-in with no fresh authentication',
    detail: 'A session presenting a valid token, with no matching interactive logon.',
  },
  'macro-attachment': {
    detected: true,
    label: 'EDR: Office spawned a script host',
    detail: 'winword.exe started powershell.exe on a clinical workstation.',
  },
  'mfa-fatigue': {
    detected: true,
    label: 'Repeated denied MFA prompts',
    detail: 'Eighteen denials then one approval on a single account, late evening.',
  },
  'consent-app': {
    detected: true,
    label: 'New application consent granted',
    detail: 'A user granted an unverified application mailbox read permission.',
  },
};

/** What each red move lets Red see. Ids are stable so repeats add nothing new. */
const RED_REVEALS: Record<string, RevealedFinding[]> = {
  'osint-staff': [
    { id: 'staff-list', kind: 'service', title: 'Staff and roles', detail: 'Eleven clinicians named publicly, with a shared research project.', severity: 'info' },
    { id: 'mail-format', kind: 'service', title: 'Address format', detail: 'firstname.lastname@harborview.example, confirmed from a published paper.', severity: 'info' },
  ],
  'register-lookalike': [
    { id: 'lookalike', kind: 'service', title: 'Lookalike domain live', detail: 'A domain that reads as harborview at a glance, with valid TLS.', severity: 'low' },
  ],
  'tailored-pretext': [
    { id: 'engaged', kind: 'service', title: 'Target engaged', detail: 'A clinician opened the message and followed the link.', severity: 'low' },
  ],
  'harvest-page': [
    { id: 'password', kind: 'vuln', title: 'Password captured', detail: 'A valid clinical credential. Multi-factor still stands between you and the tenant.', severity: 'medium' },
  ],
  'aitm-proxy': [
    { id: 'session', kind: 'vuln', title: 'Session token captured', detail: 'A live authenticated session. The second factor was satisfied by the user, for you.', severity: 'high' },
  ],
  'mfa-fatigue': [
    { id: 'approved', kind: 'vuln', title: 'Prompt approved', detail: 'The user approved a prompt to stop them arriving. You are inside the tenant.', severity: 'high' },
  ],
  'consent-app': [
    { id: 'mailbox', kind: 'vuln', title: 'Mailbox access granted', detail: 'App-level mail read that survives a password reset entirely.', severity: 'high' },
  ],
  'macro-attachment': [
    { id: 'endpoint', kind: 'vuln', title: 'Endpoint execution', detail: 'Code running on a clinical workstation, under the user context.', severity: 'high' },
  ],
};

/** The trace a red move leaves on the host, for a defender at the terminal tiers. */
const RED_HOSTLOG: Record<string, string[]> = {
  'blast-generic': [
    'Sep 02 09:04:11 mailgw postfix: 96 recipients, single template, sender 198.51.100.77',
  ],
  'tailored-pretext': [
    'Sep 02 10:22:03 mailgw postfix: 1 recipient, sender harborv1ew.example, SPF pass (own domain)',
  ],
  'harvest-page': [
    'Sep 02 10:41:55 sso auth: success user=r.okonkwo src=198.51.100.77 mfa=satisfied',
  ],
  'aitm-proxy': [
    'Sep 02 10:44:12 sso auth: token presented user=r.okonkwo src=198.51.100.77 interactive=none',
  ],
  'macro-attachment': [
    'Sep 02 11:02:31 WS-CLIN-14 sysmon: winword.exe -> powershell.exe -enc <base64>',
  ],
  'mfa-fatigue': [
    'Sep 02 22:10:04 sso mfa: 18 denied, 1 approved, user=r.okonkwo within 16 minutes',
  ],
  'consent-app': [
    'Sep 02 11:20:09 tenant consent: user granted Mail.Read to app "Clinic Docs Sync" (unverified)',
  ],
};

/**
 * How much Red is holding, which is what decides whether a Blue containment move
 * is sufficient or merely comforting.
 *
 * `session` means Red holds an authenticated session or an app grant: a password
 * reset does not touch either. `password` means Red holds only a credential, so
 * a reset genuinely does end it. Deriving this from the moves played, rather
 * than hardcoding a turn number, is what keeps the answer honest.
 */
type Hold = 'none' | 'password' | 'session' | 'endpoint';

function redHolds(state: MatchState): Hold {
  if (redHasAnyOf(state, ['aitm-proxy', 'mfa-fatigue', 'consent-app'])) return 'session';
  if (redHasPlayed(state, 'macro-attachment')) return 'endpoint';
  if (redHasPlayed(state, 'harvest-page')) return 'password';
  return 'none';
}

/** What a Blue investigation surfaces about Red's most recent move. */
function blueEvidence(state: MatchState): RevealedFinding[] {
  switch (lastRedMove(state)) {
    case 'blast-generic':
      return [{ id: 'ev-bulk', kind: 'evidence', title: 'Bulk campaign', detail: '96 recipients, one template, one sending address. Low sophistication.', severity: 'low' }];
    case 'tailored-pretext':
      return [{ id: 'ev-tailored', kind: 'evidence', title: 'Targeted message', detail: 'One recipient, referencing a real project, from a lookalike domain that passes SPF for itself.', severity: 'medium' }];
    case 'harvest-page':
      return [{ id: 'ev-harvest', kind: 'evidence', title: 'Credential captured', detail: 'A sign-in from an unfamiliar source, minutes after a link click. The password is compromised.', severity: 'high' }];
    case 'aitm-proxy':
      return [{ id: 'ev-aitm', kind: 'evidence', title: 'Session token stolen', detail: 'A valid session with no corresponding interactive authentication. The password is not the problem; the token is.', severity: 'high' }];
    case 'mfa-fatigue':
      return [{ id: 'ev-fatigue', kind: 'evidence', title: 'Prompt bombing', detail: 'Eighteen denials then an approval. The user was worn down, not fooled.', severity: 'high' }];
    case 'consent-app':
      return [{ id: 'ev-consent', kind: 'evidence', title: 'Illicit consent grant', detail: 'An unverified app holds Mail.Read. This survives a password reset and a session revoke of the user.', severity: 'high' }];
    case 'macro-attachment':
      return [{ id: 'ev-macro', kind: 'evidence', title: 'Endpoint execution', detail: 'Office spawned PowerShell with an encoded command. The workstation is compromised, not just the account.', severity: 'high' }];
    default:
      return [];
  }
}

function resolveRed(state: MatchState, optionId: string, justification: string): MoveResolution {
  const signal = RED_SIGNAL[optionId];
  if (signal === undefined) throw new MatchError('That is not a red move in this scenario.');
  const reveals = RED_REVEALS[optionId];
  const hostLog = RED_HOSTLOG[optionId];
  const common = { justification, terms: TERMS, signal, reveals, hostLog };

  if (redHasPlayed(state, optionId)) {
    return scored({ ...common, points: 2, note: 'You already ran this. Doing it twice adds nothing and doubles your exposure.' });
  }

  const recon = redHasPlayed(state, 'osint-staff');
  const domain = redHasPlayed(state, 'register-lookalike');
  const holds = redHolds(state);

  switch (optionId) {
    case 'osint-staff':
      return scored({ ...common, points: 9, note: 'Passive, off-estate, and it is what makes everything after it credible.' });
    case 'register-lookalike':
      return scored({ ...common, points: 8, note: 'Infrastructure first, and it leaves no trace on their side at all.' });
    case 'blast-generic':
      return scored({ ...common, points: 3, note: 'Cheap and loud. It gets reported, it burns your infrastructure, and it warns them.' });
    case 'tailored-pretext':
      if (!recon) {
        return scored({ ...common, points: 4, note: 'A tailored pretext without recon is just a guess in a nicer envelope.' });
      }
      return scored({ ...common, points: 9, note: 'Built from real detail, sent to one person. This is what actually lands.' });
    case 'harvest-page':
      if (!domain) {
        return scored({ ...common, points: 3, note: 'A harvesting page on infrastructure that does not look like them fools nobody.' });
      }
      // The technique that MFA defeats. Deliberately scored below the one that does not.
      return scored({ ...common, points: 5, note: 'You have a password. They have multi-factor, so a password is a souvenir. Consider what actually defeats the second factor.' });
    case 'aitm-proxy':
      if (!domain) {
        return scored({ ...common, points: 4, note: 'The right technique on infrastructure that does not pass a glance.' });
      }
      return scored({ ...common, points: 10, note: 'You relayed the real login, so the user satisfied the second factor for you. This is why phishing-resistant factors exist.' });
    case 'macro-attachment':
      return scored({ ...common, points: 4, note: 'It works, and it puts you on an endpoint with EDR on it. Loud for what it buys.' });
    case 'mfa-fatigue':
      if (holds !== 'password') {
        return scored({ ...common, points: 3, note: 'You cannot bomb prompts for an account whose password you do not have. Nothing was sent.' });
      }
      return scored({ ...common, points: 8, note: 'Crude, effective, and it works because the prompt carries no context for the user to check.' });
    case 'consent-app':
      if (!recon) {
        return scored({ ...common, points: 5, note: 'It works, but sent blind it reaches people who will report it.' });
      }
      return scored({ ...common, points: 9, note: 'App-level access with its own grant. It survives a password reset, which is the whole point.' });
    default:
      throw new MatchError('That is not a red move in this scenario.');
  }
}

function resolveBlue(state: MatchState, optionId: string, justification: string): MoveResolution {
  const last = lastRedMove(state);
  const holds = redHolds(state);
  const evidence = blueEvidence(state);
  const common = { justification, terms: TERMS };
  const quiet = last === null || last === 'osint-staff' || last === 'register-lookalike';

  switch (optionId) {
    case 'hold':
      if (quiet) return scored({ ...common, points: 9, note: 'Nothing has reached the estate. Holding was right.' });
      if (holds === 'none') return scored({ ...common, points: 5, note: 'A message landed but nobody has lost anything yet. Defensible.' });
      return scored({ ...common, points: 1, note: 'They are inside and you watched. That is the miss this scenario is about.' });

    case 'triage-report':
      if (quiet) return scored({ ...common, points: 3, note: 'Nothing in the queue. Chasing an empty queue is how a small team burns out.' });
      return scored({ ...common, points: 9, note: 'You established what actually happened before acting. Everything good follows from this.', reveals: evidence });

    case 'block-sender':
      if (quiet) return scored({ ...common, points: 2, note: 'Nothing to block yet.' });
      if (holds === 'none') return scored({ ...common, points: 8, note: 'Caught at delivery, before anyone lost anything. Cheapest possible win.' });
      return scored({ ...common, points: 4, note: 'Worth doing, but they are already inside. Blocking the door they came through does not remove them.' });

    case 'reset-password':
      if (holds === 'password') {
        return scored({ ...common, points: 9, note: 'They held a password and nothing else, so a reset genuinely ends it. Right move, right situation.' });
      }
      if (holds === 'session') {
        // The single most important lesson in this scenario.
        return scored({
          ...common,
          points: 2,
          note: 'A reset does not touch a live session or an app grant. They are still signed in, and the ticket now says resolved. Revoke the tokens.',
        });
      }
      if (holds === 'endpoint') {
        return scored({ ...common, points: 3, note: 'The credential is not the problem. There is code running on that workstation.' });
      }
      return scored({ ...common, points: 3, note: 'Nothing has been compromised. You have made a clinician change their password for nothing.' });

    case 'revoke-sessions':
      if (holds === 'session') {
        return scored({ ...common, points: 10, note: 'Exactly right. The token was the access, so killing the token was the containment.' });
      }
      if (holds === 'password') {
        return scored({ ...common, points: 6, note: 'Harmless and sensible, though the password is what they actually hold. Pair it with a reset.' });
      }
      return scored({ ...common, points: 3, note: 'Nothing to revoke yet.' });

    case 'audit-consent':
      if (redHasPlayed(state, 'consent-app')) {
        return scored({ ...common, points: 10, note: 'You found the grant. Nothing else you could have done would have removed it.' });
      }
      return scored({ ...common, points: 5, note: 'Good hygiene, and it costs you the round. Nothing was granted.' });

    case 'harden-mfa':
      if (redHasAnyOf(state, ['mfa-fatigue', 'aitm-proxy'])) {
        return scored({ ...common, points: 9, note: 'Number matching stops the bombing and phishing-resistant factors stop the relay. Fixing the cause, not the instance.' });
      }
      return scored({ ...common, points: 7, note: 'Proactive and correct, though it does nothing about what is happening right now.' });

    case 'brief-staff':
      if (last === 'osint-staff' || last === 'tailored-pretext') {
        return scored({ ...common, points: 8, note: 'Warning the people actually being targeted, before the next message lands. Cheap and effective.' });
      }
      if (quiet) return scored({ ...common, points: 6, note: 'Never wasted, though nothing is happening yet.' });
      return scored({ ...common, points: 4, note: 'Useful later. Right now somebody is already inside.' });

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
 * Red's console for the terminal tiers.
 *
 * A phishing operation is not run with a port scanner, so this console is the
 * tooling that actually applies: reconnaissance, domain setup, and the sending
 * itself. Each real command maps to the SAME optionId the menu uses, so scoring,
 * findings and the trace left for Blue all run through one resolver.
 */
const HELP = [
  'Social engineering console. Target: harborview.example (authorised).',
  '  recon harborview.example        map staff and address format   (silent)',
  '  register <domain>               stand up a lookalike domain    (silent)',
  '  send --bulk                     one template, everyone         (loud)',
  '  send --target <name>            a tailored pretext             (quiet)',
  '  host --harvest                  credential capture page',
  '  host --relay                    adversary-in-the-middle relay',
  '  send --macro <name>             document with a macro          (loud)',
  '  push --spam <name>              repeat MFA prompts, then call',
  '  consent --app <name>            malicious OAuth consent request',
  'Each real command is your move for the turn. Say why before you run it.',
  '',
].join('\n');

const RECON_OUT = [
  'Collecting public sources for harborview.example',
  '  11 clinicians named on the site and in one published paper',
  '  address format: firstname.lastname@harborview.example',
  '  shared research project referenced publicly (useful pretext)',
  '',
].join('\n');

const REGISTER_OUT = [
  'Registered harborv1ew.example',
  '  TLS certificate issued',
  '  reads as the real domain at a glance in a mail client',
  '',
].join('\n');

const HARVEST_OUT = [
  'Harvest page live on harborv1ew.example/sso',
  '  clone of the tenant sign-in page',
  '  NOTE: captures the password only. The second factor still applies.',
  '',
].join('\n');

const RELAY_OUT = [
  'Relay live on harborv1ew.example/sso',
  '  proxying to the real tenant sign-in',
  '  captures the session cookie AFTER the user satisfies MFA',
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
    case 'recon':
      return { output: RECON_OUT, optionId: 'osint-staff' };
    case 'register':
      return { output: REGISTER_OUT, optionId: 'register-lookalike' };
    case 'host':
      if (lower.includes('relay') || lower.includes('aitm')) return { output: RELAY_OUT, optionId: 'aitm-proxy' };
      return { output: HARVEST_OUT, optionId: 'harvest-page' };
    case 'send':
      if (lower.includes('--bulk')) return { output: 'Sent to 96 recipients.\n', optionId: 'blast-generic' };
      if (lower.includes('--macro')) return { output: 'Sent 1 message with a macro-enabled attachment.\n', optionId: 'macro-attachment' };
      return { output: 'Sent 1 tailored message.\n', optionId: 'tailored-pretext' };
    case 'push':
      return { output: 'Sending repeat approval prompts, then placing the call.\n', optionId: 'mfa-fatigue' };
    case 'consent':
      return { output: 'Consent request sent for app "Clinic Docs Sync" requesting Mail.Read.\n', optionId: 'consent-app' };
    default:
      return { output: `${tool || 'that'}: not a tool on this console. Type help.\n`, optionId: null };
  }
}

const ATTACKER_CONSOLE: AttackerConsole = {
  banner: [
    'Social engineering console attached. Target authorised: harborview.example.',
    'Type help for tooling. Every real command is your move for the turn.',
  ],
  run: attackerRun,
};

export const PHISH_HARBORVIEW: RedBlueScenario = {
  id: SCENARIO_ID,
  title: 'First Contact: Harborview Clinic',
  brief:
    'Red is trying to get inside a clinic through its people. Blue is watching a reporting queue ' +
    'that is mostly noise. The question this scenario turns on is what Red actually ends up ' +
    'holding, because the right containment for a stolen password and the right containment for a ' +
    'stolen session are not the same move, and one of them leaves the intruder exactly where ' +
    'they were.',
  maxTurns: MAX_TURNS,
  dossier: DOSSIER,
  red: RED_OPTIONS,
  blue: BLUE_OPTIONS,
  resolve,
  attacker: ATTACKER_CONSOLE,
};

// Self-register on import, so loading the catalogue wires in the resolver and budget.
registerMatchScenario(PHISH_HARBORVIEW.id, PHISH_HARBORVIEW.resolve, { maxTurns: PHISH_HARBORVIEW.maxTurns });
