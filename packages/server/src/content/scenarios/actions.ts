/**
 * The action catalogue shared by every scenario.
 *
 * WHY THESE ARE SHARED RATHER THAN PER SCENARIO
 *
 * A SOC operator's options do not change because the intrusion is a
 * cryptominer instead of a credential theft. Re-declaring them per scenario was
 * fine for one and would be twenty-five chances for "dismiss" to mean something
 * subtly different in scenario 14, which is how a student learns that the rules
 * change and stops trusting any of them.
 *
 * `forRoles` is the lane. An action with an empty list is in-lane for NOBODY:
 * those are the ones that exist so a student can reach for them and be told
 * why they should not have.
 *
 * A scenario adds its own only where the incident genuinely needs a verb the
 * others do not have.
 */

import type { ScenarioAction } from '@soc/shared';

export const COMMON_ACTIONS: ScenarioAction[] = [
  // --- triage --------------------------------------------------------------
  { id: 'act.triage-high', label: 'Raise the priority and route it', forRoles: ['soc-operator'] },
  { id: 'act.dismiss', label: 'Dismiss as noise', forRoles: ['soc-operator'] },
  { id: 'act.tune', label: 'Raise a tuning ticket against the rule', forRoles: ['soc-operator'] },
  /*
   * The disposition for an event that does not resolve.
   *
   * Without it, an unsettled event forces a student to pick a side they cannot
   * justify, which teaches exactly the false certainty the ambiguous verdict
   * exists to punish. Naming what you need is the answer, so the label asks for
   * it rather than allowing a bare "still looking".
   */
  { id: 'act.investigate-hold', label: 'Hold it open and name what would settle it', forRoles: ['soc-operator', 'log-analyst'] },

  // --- analysis ------------------------------------------------------------
  { id: 'act.timeline', label: 'Build the timeline from raw logs', forRoles: ['log-analyst'] },
  { id: 'act.corroborate', label: 'Confirm it in a second, independent source', forRoles: ['log-analyst', 'fusion-analyst'] },
  { id: 'act.flow-map', label: 'Map the connection against baseline', forRoles: ['network-analyst'] },
  { id: 'act.probe-pattern', label: 'Look for the same source on other ports and hosts', forRoles: ['network-analyst'] },
  { id: 'act.decode', label: 'Decode and classify the payload', forRoles: ['malware-analyst'] },
  { id: 'act.sandbox', label: 'Detonate in a sandbox to capture the next stage', forRoles: ['malware-analyst'] },

  // --- cloud and identity --------------------------------------------------
  { id: 'act.iam-audit', label: 'Audit the principal and where it was called from', forRoles: ['cloud-security'] },
  { id: 'act.revoke-key', label: 'Revoke the credential', forRoles: ['cloud-security'] },

  // --- intel ---------------------------------------------------------------
  { id: 'act.ttp-map', label: 'Map the observed tradecraft to ATT&CK techniques', forRoles: ['threat-intel'] },
  { id: 'act.assess-actor', label: 'Assess likely actor class and motive, with basis and confidence', forRoles: ['threat-intel'] },
  { id: 'act.predict', label: 'State the most likely next move, and what would confirm it', forRoles: ['threat-intel'] },

  // --- evidence ------------------------------------------------------------
  { id: 'act.preserve', label: 'Capture memory, then image, with custody recorded', forRoles: ['forensics'] },
  { id: 'act.chain', label: 'Hash and seal the artefact', forRoles: ['forensics'] },

  // --- detection engineering ----------------------------------------------
  { id: 'act.propose-rule', label: 'Propose a detection, with its cost against thirty days', forRoles: ['detection-engineer'] },
  { id: 'act.backtest', label: 'Replay the proposed logic over historical data', forRoles: ['detection-engineer'] },

  // --- vulnerability -------------------------------------------------------
  { id: 'act.scope-estate', label: 'Establish how many other hosts share this exposure', forRoles: ['vulnerability-analyst'] },

  /*
   * --- mitigation ----------------------------------------------------------
   *
   * Proposing containment is in lane for this seat; deciding to accept its cost
   * is the lead's. That split is deliberate. A specialist who can both propose
   * and authorise a change that stops a customs filing has no reason to state
   * the cost honestly, and a lead who has to invent the options themselves will
   * reach for the one they can name rather than the one that is narrowest.
   */
  { id: 'act.contain-scoped', label: 'Propose the narrowest containment that stops this, and what it breaks', forRoles: ['mitigation-specialist'] },
  { id: 'act.compensating-control', label: 'Put a compensating control around what cannot be fixed today', forRoles: ['mitigation-specialist'] },
  { id: 'act.check-rollback', label: 'Establish the rollback before anything is changed', forRoles: ['mitigation-specialist'] },
  { id: 'act.sequence-remedy', label: 'Order the remediation and say what is deliberately left undone', forRoles: ['mitigation-specialist', 'ir-lead'] },

  // --- command -------------------------------------------------------------
  { id: 'act.isolate', label: 'Isolate the host at the network layer', forRoles: ['ir-lead', 'mitigation-specialist'] },
  { id: 'act.declare', label: 'Declare an incident', forRoles: ['ir-lead'] },
  { id: 'act.notify-legal', label: 'Hand the notification question to legal', forRoles: ['ir-lead'] },

  /*
   * In-lane for nobody. Each is here because it is the plausible wrong move for
   * some seat, and a student who reaches for it should be told why rather than
   * simply not offered it. Removing them would make the form easier and the
   * lesson smaller.
   */
  { id: 'act.power-off', label: 'Pull the power on the host', forRoles: [] },
  { id: 'act.write-rule', label: 'Write and ship a detection rule right now', forRoles: [] },
  { id: 'act.attribute-named', label: 'Attribute to a specific named group as fact', forRoles: [] },
  { id: 'act.reimage-now', label: 'Rebuild the host immediately', forRoles: [] },
  { id: 'act.reset-password', label: 'Reset the account password and move on', forRoles: [] },
  { id: 'act.contact-attacker', label: 'Engage the attacker infrastructure to learn more', forRoles: [] },
];
