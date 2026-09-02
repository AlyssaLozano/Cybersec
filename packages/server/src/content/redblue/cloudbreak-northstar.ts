/**
 * Cloud identity: breaking into Northstar Retail's tenant.
 *
 * THE SKILL EACH SIDE IS ACTUALLY LEARNING
 *
 * Red is learning that in the cloud there is no lateral movement in the old
 * sense; there is only privilege escalation through identity, one grant at a
 * time, and then PERSISTENCE that outlives the credential you arrived on. The
 * chain matters: you cannot enumerate roles you have no token for, you cannot
 * escalate a role you have not enumerated, and the smart final move is to plant
 * an independent way back in (a federated trust, an added credential on a
 * service principal) so that losing your entry point costs you nothing.
 *
 * Blue is learning the containment order that cloud incidents actually require,
 * and the trap in it: revoking the compromised user's sessions feels like
 * containment and is not, if Red has already established persistence that does
 * not depend on that user. This scenario is built so that Blue that revokes and
 * closes the ticket has locked one door while three others stand open. The
 * winning play is to hunt for the persistence first, then revoke.
 *
 * There is no network here, deliberately: it is the counterpart to the on-prem
 * campaign. Every move is an identity or an API call, and every action is in the
 * audit log if anyone is reading it, which is the other half of the lesson.
 *
 * THE TARGET IS FABRICATED, ON PURPOSE AND BY RULE
 *
 * Northstar Retail does not exist. `.example` is reserved and the addresses are
 * RFC 5737 documentation ranges.
 */

import type { MatchSide, MatchSignal, MatchState, RevealedFinding } from '@soc/shared';

import { MatchError, type MoveResolution } from '../../services/matchEngine.js';
import { registerMatchScenario } from '../../services/matchContent.js';
import { lastRedMove, redHasAnyOf, redHasPlayed, scored } from './linear-kit.js';
import type { AttackerConsole, MoveOption, RedBlueScenario, TargetDossier } from './types.js';

const SCENARIO_ID = 'ln-cloudbreak-northstar';
const MAX_TURNS = 7;

const TERMS = ['token', 'role', 'permission', 'privilege', 'persist', 'federation', 'trust', 'audit', 'revoke', 'blast'];

const DOSSIER: TargetDossier = {
  org: 'Northstar Retail',
  summary:
    'An online retailer running entirely in public cloud. No corporate network to speak of: ' +
    'laptops, an identity provider with single sign-on, and a cloud tenant holding customer data ' +
    'and the platform itself. Authorised cloud red-team engagement.',
  facts: [
    { k: 'Tenant', v: 'northstar.example, single cloud provider' },
    { k: 'Identity', v: 'SSO to everything, conditional access partial' },
    { k: 'Logging', v: 'Cloud audit trail enabled, delivered in-tenant' },
    { k: 'Crown', v: 'Customer data store and tenant administration' },
    { k: 'Public range', v: '203.0.113.0/24' },
    { k: 'Blue team', v: 'Two engineers, cloud-native tooling' },
  ],
};

const RED_OPTIONS: MoveOption[] = [
  { id: 'phish-token', label: 'Phish a session token', description: 'Adversary-in-the-middle against one engineer. Start with a real session.' },
  { id: 'steal-cli-token', label: 'Steal a cached CLI token', description: 'Read a refresh token off a compromised laptop. No password, no prompt.' },
  { id: 'enum-permissions', label: 'Enumerate permissions', description: 'Map what this identity can actually do across the tenant.' },
  { id: 'find-secrets', label: 'Read the secrets store', description: 'Pull application credentials the identity can reach.' },
  { id: 'escalate-role', label: 'Escalate a role', description: 'Assign yourself a more privileged role you found a path to.' },
  { id: 'add-federation', label: 'Add a federated trust', description: 'A domain you control, so you can mint your own assertions.' },
  { id: 'add-sp-credential', label: 'Add a service principal credential', description: 'A second secret on an app, persistence that is not a user.' },
  { id: 'disable-logging', label: 'Tamper with logging', description: 'Filter out your own principal, or stop the trail.' },
  { id: 'exfil-data', label: 'Exfiltrate customer data', description: 'Bulk read the customer store. The obvious, loud objective.' },
];

const BLUE_OPTIONS: MoveOption[] = [
  { id: 'hold', label: 'Hold and monitor', description: 'No action. Watch the audit trail.' },
  { id: 'investigate-signin', label: 'Investigate the sign-in', description: 'Work the anomalous authentication and establish scope.' },
  { id: 'revoke-user', label: 'Revoke user sessions', description: 'Invalidate sessions and tokens for the compromised user.' },
  { id: 'hunt-persistence', label: 'Hunt for persistence', description: 'Look for added credentials, roles and federation trusts.' },
  { id: 'audit-roles', label: 'Audit privileged roles', description: 'Review recent privileged role assignments across the tenant.' },
  { id: 'check-federation', label: 'Check federation config', description: 'Review domains and trusts on the identity provider.' },
  { id: 'protect-logging', label: 'Protect the audit trail', description: 'Move logging out of the blast radius and restore any gap.' },
  { id: 'lock-tenant', label: 'Lock down and rotate', description: 'Break-glass: rotate everything, revoke all, force re-auth.' },
];

const RED_SIGNAL: Record<string, MatchSignal | null> = {
  'phish-token': { detected: true, label: 'Sign-in with no fresh authentication', detail: 'A session token presented from an unfamiliar address, no interactive logon.' },
  'steal-cli-token': { detected: true, label: 'API calls from a new location', detail: 'CLI token used from an address the engineer has never used.' },
  'enum-permissions': { detected: true, label: 'Directory enumeration', detail: 'A burst of role and permission read calls from one principal.' },
  'find-secrets': { detected: true, label: 'Bulk secret access', detail: 'One principal read many distinct secrets in minutes.' },
  'escalate-role': { detected: true, label: 'Privileged role assigned', detail: 'A role assignment granting elevated permissions, outside a change window.' },
  'add-federation': { detected: true, label: 'Federation trust added', detail: 'A new federated domain registered on the tenant.' },
  'add-sp-credential': { detected: true, label: 'Credential added to application', detail: 'A new client secret on an existing service principal.' },
  'disable-logging': { detected: true, label: 'Logging configuration changed', detail: 'An audit trail was modified to exclude a principal.' },
  'exfil-data': { detected: true, label: 'Bulk data read', detail: 'A large sequential read of the customer store.' },
};

const RED_REVEALS: Record<string, RevealedFinding[]> = {
  'phish-token': [{ id: 'token', kind: 'vuln', title: 'Live session', detail: 'An authenticated session as an engineer. MFA was satisfied by the user, for you.', severity: 'high' }],
  'steal-cli-token': [{ id: 'cli', kind: 'vuln', title: 'CLI refresh token', detail: 'Long-lived cloud access with no prompt. It represents a completed authentication already.', severity: 'high' }],
  'enum-permissions': [
    { id: 'perms', kind: 'service', title: 'Effective permissions', detail: 'This identity can read secrets and has a path to a privileged role via a group.', severity: 'medium' },
    { id: 'esc-path', kind: 'vuln', title: 'Escalation path', detail: 'Group membership allows self-assignment of an administrative role.', severity: 'high' },
  ],
  'find-secrets': [{ id: 'secrets', kind: 'vuln', title: 'Application credentials', detail: 'Secrets for the data service and the deployment pipeline.', severity: 'high' }],
  'escalate-role': [{ id: 'admin', kind: 'vuln', title: 'Elevated role', detail: 'You now hold an administrative role over the tenant.', severity: 'high' }],
  'add-federation': [{ id: 'fed', kind: 'vuln', title: 'Federation persistence', detail: 'You can mint assertions for any user. This survives every user-level containment.', severity: 'high' }],
  'add-sp-credential': [{ id: 'sp', kind: 'vuln', title: 'Service principal persistence', detail: 'A non-user credential. Revoking the user does nothing to it.', severity: 'high' }],
};

const RED_HOSTLOG: Record<string, string[]> = {
  'phish-token': ['2026-09-02T10:41Z signin user=dev.mara token=presented interactive=none ip=203.0.113.51'],
  'steal-cli-token': ['2026-09-02T10:43Z api caller=dev.mara auth=refresh_token ip=203.0.113.51 useragent=cli'],
  'enum-permissions': ['2026-09-02T10:50Z api RoleManagement.Read x38, DirectoryObjects.Read x120 caller=dev.mara'],
  'find-secrets': ['2026-09-02T10:58Z api SecretGet x22 vault=prod caller=dev.mara'],
  'escalate-role': ['2026-09-02T11:05Z audit RoleAssignment add role=TenantAdmin principal=dev.mara actor=dev.mara'],
  'add-federation': ['2026-09-02T11:12Z audit Domain add federated=attacker-controlled.example actor=dev.mara'],
  'add-sp-credential': ['2026-09-02T11:15Z audit ServicePrincipal addKey app="Data Sync" actor=dev.mara'],
  'disable-logging': ['2026-09-02T11:18Z audit DiagnosticSetting modify exclude=principal:dev.mara'],
  'exfil-data': ['2026-09-02T11:30Z storage read blobs=41000 container=customers caller=dev.mara'],
};

/**
 * Whether Red has established persistence that does NOT depend on the entry
 * user. This is the fact the whole scenario turns on: if it is true, revoking
 * the user is not containment.
 */
function hasIndependentPersistence(state: MatchState): boolean {
  return redHasAnyOf(state, ['add-federation', 'add-sp-credential']);
}

/** Whether Red currently holds a working identity to act with. */
function hasFoothold(state: MatchState): boolean {
  return redHasAnyOf(state, ['phish-token', 'steal-cli-token']);
}

function blueEvidence(state: MatchState): RevealedFinding[] {
  switch (lastRedMove(state)) {
    case 'phish-token':
    case 'steal-cli-token':
      return [{ id: 'ev-token', kind: 'evidence', title: 'Token-based access', detail: 'A valid token with no interactive logon. A password reset will not touch this.', severity: 'high' }];
    case 'enum-permissions':
      return [{ id: 'ev-enum', kind: 'evidence', title: 'Enumeration', detail: 'Mass directory reads from one principal. They are mapping, which means they have a foothold.', severity: 'medium' }];
    case 'escalate-role':
      return [{ id: 'ev-esc', kind: 'evidence', title: 'Privilege escalation', detail: 'A privileged role was self-assigned. Assume everything that role can reach is exposed.', severity: 'high' }];
    case 'add-federation':
      return [{ id: 'ev-fed', kind: 'evidence', title: 'Federation persistence', detail: 'A rogue federated domain. Until this is removed, revoking users changes nothing.', severity: 'high' }];
    case 'add-sp-credential':
      return [{ id: 'ev-sp', kind: 'evidence', title: 'Service principal persistence', detail: 'A credential added to an app. It is not a user, so user-level containment misses it.', severity: 'high' }];
    case 'disable-logging':
      return [{ id: 'ev-log', kind: 'evidence', title: 'Log tampering', detail: 'The audit trail was filtered. Everything after this point may be invisible.', severity: 'high' }];
    case 'exfil-data':
      return [{ id: 'ev-exfil', kind: 'evidence', title: 'Bulk read', detail: 'A large read of the customer store. Scope the exposure.', severity: 'high' }];
    default:
      return [];
  }
}

function resolveRed(state: MatchState, optionId: string, justification: string): MoveResolution {
  const signal = RED_SIGNAL[optionId];
  if (signal === undefined) throw new MatchError('That is not a red move in this scenario.');
  const common = { justification, terms: TERMS, signal, reveals: RED_REVEALS[optionId], hostLog: RED_HOSTLOG[optionId] };

  if (redHasPlayed(state, optionId)) {
    return scored({ ...common, points: 2, note: 'Already done. Repeating it only adds audit entries with your name on them.' });
  }

  const foothold = hasFoothold(state);
  const enumerated = redHasPlayed(state, 'enum-permissions');
  const escalated = redHasPlayed(state, 'escalate-role');

  switch (optionId) {
    case 'phish-token':
    case 'steal-cli-token':
      return scored({ ...common, points: 9, note: 'A token rather than a password. There is no MFA prompt to defeat because the authentication is already done.' });
    case 'enum-permissions':
      if (!foothold) return scored({ ...common, points: 2, note: 'You have no identity to enumerate with. Get a token first.' });
      return scored({ ...common, points: 9, note: 'Know what you hold before you reach. This is the whole cloud game: privilege, mapped one grant at a time.' });
    case 'find-secrets':
      if (!foothold) return scored({ ...common, points: 2, note: 'Nothing to read secrets with yet.' });
      if (!enumerated) return scored({ ...common, points: 5, note: 'You found some, but blind. You do not yet know what this identity is allowed to reach.' });
      return scored({ ...common, points: 8, note: 'Targeted, because you knew what you could touch. Quiet by cloud standards.' });
    case 'escalate-role':
      if (!enumerated) return scored({ ...common, points: 3, note: 'You cannot escalate a path you have not found. Enumerate first.' });
      return scored({ ...common, points: 9, note: 'You took the path recon handed you. This is the step that turns a foothold into control.' });
    case 'add-federation':
      if (!escalated) return scored({ ...common, points: 3, note: 'Federation changes need administrative rights you do not have yet.' });
      return scored({ ...common, points: 10, note: 'Persistence that is not a user and not a session. Now losing your entry point costs you nothing.' });
    case 'add-sp-credential':
      if (!escalated) return scored({ ...common, points: 3, note: 'You cannot add credentials to a service principal without the rights to do so.' });
      return scored({ ...common, points: 9, note: 'A second key on an app nobody watches. It survives every containment aimed at the user.' });
    case 'disable-logging':
      if (!escalated) return scored({ ...common, points: 3, note: 'You cannot touch the diagnostic settings without elevated rights.' });
      return scored({ ...common, points: 7, note: 'Effective, and itself a loud event. In the cloud the log is the only evidence, so tampering with it is a strong signal when someone is watching.' });
    case 'exfil-data':
      if (!escalated && !redHasPlayed(state, 'find-secrets')) {
        return scored({ ...common, points: 3, note: 'You do not have a path to the customer store yet.' });
      }
      return scored({ ...common, points: 7, note: 'The objective, and the loudest thing you can do. Worth more if your persistence is already planted.' });
    default:
      throw new MatchError('That is not a red move in this scenario.');
  }
}

function resolveBlue(state: MatchState, optionId: string, justification: string): MoveResolution {
  const last = lastRedMove(state);
  const foothold = hasFoothold(state);
  const persistence = hasIndependentPersistence(state);
  const evidence = blueEvidence(state);
  const common = { justification, terms: TERMS };
  const quiet = !foothold && last === null;

  switch (optionId) {
    case 'hold':
      if (quiet) return scored({ ...common, points: 8, note: 'Nothing in the trail. Holding is fine.' });
      if (!foothold) return scored({ ...common, points: 4, note: 'Something odd, but no confirmed access. Watchful is defensible.' });
      return scored({ ...common, points: 1, note: 'They are in the tenant and you held. This is how cloud intrusions become month-long ones.' });

    case 'investigate-signin':
      if (quiet) return scored({ ...common, points: 3, note: 'Nothing to investigate. Watch for alert fatigue.' });
      return scored({ ...common, points: 9, note: 'You established it is token-based before reaching for a fix. That is what stops you resetting a password for nothing.', reveals: evidence });

    case 'revoke-user':
      if (!foothold) return scored({ ...common, points: 3, note: 'No compromised user to revoke yet.' });
      if (persistence) {
        return scored({
          ...common,
          points: 3,
          note: 'You revoked the user and they are still here. The federation trust and the service principal credential do not depend on that account. Hunt first.',
        });
      }
      return scored({ ...common, points: 8, note: 'They held a user token and nothing more, so revoking it removes them. Right, for now.' });

    case 'hunt-persistence':
      if (persistence) {
        return scored({ ...common, points: 10, note: 'You found the thing that would have survived everything else. Now containment can actually work.', reveals: evidence });
      }
      if (foothold) return scored({ ...common, points: 7, note: 'Nothing planted yet, but looking before revoking is exactly the right instinct. It costs you a round and buys certainty.' });
      return scored({ ...common, points: 4, note: 'Nothing to find yet. Not wasted, but early.' });

    case 'audit-roles':
      if (redHasPlayed(state, 'escalate-role')) {
        return scored({ ...common, points: 9, note: 'You caught the self-assigned role. That is the pivot from foothold to control, reversed.' });
      }
      return scored({ ...common, points: 5, note: 'Good hygiene. Nothing has been escalated yet, so it costs a round for reassurance.' });

    case 'check-federation':
      if (redHasPlayed(state, 'add-federation')) {
        return scored({ ...common, points: 10, note: 'You found the rogue trust. Nothing else you could have done would have removed it.' });
      }
      return scored({ ...common, points: 5, note: 'Worth checking, and empty this time.' });

    case 'protect-logging':
      if (redHasPlayed(state, 'disable-logging')) {
        return scored({ ...common, points: 9, note: 'They tampered with the trail and you restored it and moved it out of reach. Without this you are blind.' });
      }
      return scored({ ...common, points: 6, note: 'Sound preparation: logging outside the blast radius is the control that makes everything else possible.' });

    case 'lock-tenant':
      if (persistence || redHasPlayed(state, 'escalate-role')) {
        return scored({ ...common, points: 9, note: 'Break-glass is proportionate once they hold admin or persistence. Painful and correct.' });
      }
      if (foothold) return scored({ ...common, points: 6, note: 'Heavy for a single user token, but not wrong. It will hurt.' });
      return scored({ ...common, points: 2, note: 'You locked the whole tenant down over nothing confirmed. That is an outage you caused.' });

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
  'Cloud operator console. Tenant authorised: northstar.example.',
  '  phish --relay <user>      steal a live session via AITM',
  '  steal --cli <host>        read a cached CLI refresh token   (no prompt)',
  '  enum --permissions        map what this identity can do',
  '  secrets --list            read reachable secrets',
  '  escalate --role <role>    assign yourself a role you found a path to',
  '  persist --federation      add a federated trust you control',
  '  persist --sp <app>        add a credential to a service principal',
  '  log --tamper              exclude your principal from the trail',
  '  exfil --customers         bulk read the customer store',
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
    case 'phish':
      return { output: 'Relay live. Captured a session for dev.mara after MFA.\n', optionId: 'phish-token' };
    case 'steal':
      return { output: 'Recovered a CLI refresh token for dev.mara. No prompt required.\n', optionId: 'steal-cli-token' };
    case 'enum':
      return { output: 'Effective permissions: SecretGet on prod; group path to TenantAdmin.\n', optionId: 'enum-permissions' };
    case 'secrets':
      return { output: 'Read 22 secrets from vault "prod": data service, deploy pipeline.\n', optionId: 'find-secrets' };
    case 'escalate':
      return { output: 'Assigned role TenantAdmin to dev.mara.\n', optionId: 'escalate-role' };
    case 'persist':
      if (lower.includes('federation')) return { output: 'Added federated domain attacker-controlled.example.\n', optionId: 'add-federation' };
      return { output: 'Added a client secret to service principal "Data Sync".\n', optionId: 'add-sp-credential' };
    case 'log':
      return { output: 'Diagnostic setting modified to exclude principal dev.mara.\n', optionId: 'disable-logging' };
    case 'exfil':
      return { output: 'Read 41,000 blobs from container "customers".\n', optionId: 'exfil-data' };
    default:
      return { output: `${tool || 'that'}: not a tool on this console. Type help.\n`, optionId: null };
  }
}

const ATTACKER_CONSOLE: AttackerConsole = {
  banner: [
    'Cloud operator console attached. Tenant authorised: northstar.example.',
    'Type help for tooling. Every real command is your move for the turn.',
  ],
  run: attackerRun,
};

export const CLOUDBREAK_NORTHSTAR: RedBlueScenario = {
  id: SCENARIO_ID,
  title: 'Blast Radius: Northstar Retail',
  brief:
    'A cloud tenant with no network to hide behind: every move is an identity or an API call. Red ' +
    'climbs through privilege one grant at a time and, if it is any good, plants a way back in that ' +
    'no longer depends on how it arrived. Blue has to resist the reflex to revoke the obvious ' +
    'account and close the ticket, because in the cloud the account is rarely the thing that keeps ' +
    'the attacker inside.',
  maxTurns: MAX_TURNS,
  dossier: DOSSIER,
  red: RED_OPTIONS,
  blue: BLUE_OPTIONS,
  resolve,
  attacker: ATTACKER_CONSOLE,
};

registerMatchScenario(CLOUDBREAK_NORTHSTAR.id, CLOUDBREAK_NORTHSTAR.resolve, { maxTurns: CLOUDBREAK_NORTHSTAR.maxTurns });
