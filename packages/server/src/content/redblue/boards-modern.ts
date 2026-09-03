/**
 * Board scenarios: modern software estates.
 *
 * Three estates built on newer technology stacks, each teaching a failure mode
 * that does not exist on the traditional boards.
 *
 * The protocol board is on-chain: the crown is a smart contract holding locked
 * value, where the code is the law, a bug is directly monetisable, and a
 * successful exploit is irreversible by design. The cluster board is
 * cloud-native: the crown is a container-orchestration control plane, where the
 * attack surface is the pipeline, the images and the platform's own automation
 * rather than a host. The warehouse board is cyber-physical logistics: humans and
 * robots share a floor under software control, so a compromise of the control
 * system is a safety event as well as a service one.
 *
 * Same standard as the rest: every system names its ATT&CK technique, and the
 * four outcome lines carry the method, the detection logic, the artefact and the
 * containment.
 *
 * Fabricated orgs, `.example` names, RFC 5737 outside and RFC 1918 inside.
 */

import { definePositional } from './positional-kit.js';

/**
 * A decentralised-finance protocol, and the code-is-law problem.
 *
 * The lesson is that on-chain the smart contract IS the system: its code
 * executes exactly as written, a flaw in it is directly monetisable, and a
 * successful exploit settles irreversibly with no operator able to claw it back.
 * The crown is the contract holding the locked funds, and the surrounding systems
 * are the off-chain pieces, keys, front end, oracle, that an attacker uses to
 * reach or trigger it.
 */
export const PROTOCOL_ARCLINE = definePositional({
  id: 'bd-protocol-arcline',
  title: 'Code Is Law: Arcline Protocol',
  brief:
    'Six systems, two defences, nine rounds. On-chain, the smart contract is the system: it runs ' +
    'exactly as written, a bug is money, and an exploit settles irreversibly with nobody able to undo ' +
    'it. Red wants the contract holding the locked funds; the other systems are the off-chain pieces ' +
    'that reach it.',
  maxTurns: 9,
  coverageBudget: 2,
  movesLeft: 2,
  terms: ['contract', 'onchain', 'oracle', 'irreversible', 'exploit', 'liquidity', 'key', 'settle'],
  dossier: {
    org: 'Arcline Protocol',
    summary:
      'A decentralised-finance protocol whose smart contracts hold a large pool of locked customer ' +
      'funds. It has a web front end, an administrative multi-signature wallet, a price oracle feed, ' +
      'and off-chain infrastructure. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Core protocol contract (holds locked funds) (crown)' },
      { k: 'Off-chain network', v: '10.132.5.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Property', v: 'On-chain settlement is final and irreversible' },
      { k: 'Blue coverage', v: '2 systems at a time, 2 repositions' },
      { k: 'Clock', v: '9 rounds' },
    ],
  },
  targets: [
    {
      id: 'developer',
      label: 'Developer endpoints',
      note: 'Engineers holding deployment keys and contract source, 10.132.5.0/24.',
      technique: 'T1204.002 User Execution: Malicious File',
      flavour: {
        compromise:
          'A recruiter approach and a "coding challenge" archive that an engineer runs, because running code ' +
          'is their job. This is the documented tradecraft against crypto engineers, and it targets the ' +
          'people who hold deployment keys and can push contract changes.',
        detect:
          'EDR on developer endpoints for an interpreter or build process making outbound connections to ' +
          'newly registered infrastructure, and execution from archive-extraction paths.',
        evidence:
          'A node process spawned from a downloads directory connecting to a fresh domain, on the laptop of an ' +
          'engineer with deployment keys.',
        contain:
          'The endpoint is isolated, every key and token on it treated as compromised, deployment keys ' +
          'rotated, and developer machines separated from deployment infrastructure.',
      },
    },
    {
      id: 'frontend',
      label: 'Web front end',
      note: 'app.arcline.example, 198.51.100.60. Where users interact with the protocol.',
      technique: 'T1565.002 Data Manipulation: Transmitted Data Manipulation',
      flavour: {
        compromise:
          'The front end does not hold funds, but it is what users trust to build transactions. Tampering with ' +
          'it to alter transaction parameters, so users unknowingly approve a malicious action, is a documented ' +
          'way to drain wallets without touching the contract, a front-end attack on user trust.',
        detect:
          'Subresource integrity and content-security-policy reporting on the front end, and monitoring for ' +
          'any change to the transaction-building code outside a release.',
        evidence:
          'A change to the front-end transaction code that alters approval targets, with no matching release, ' +
          'and CSP reports of unexpected outbound calls.',
        contain:
          'The front end is restored from the verified build, integrity pinned, users warned to revoke ' +
          'approvals, and the deployment pipeline reviewed.',
      },
    },
    {
      id: 'oracle',
      label: 'Price oracle',
      note: 'ORACLE01, 10.132.5.30. Feeds external prices the contract relies on.',
      technique: 'T1565.002 Data Manipulation: Transmitted Data Manipulation',
      flavour: {
        compromise:
          'The contract makes decisions based on prices the oracle reports. Manipulating the oracle, or ' +
          'exploiting a thinly sourced feed, lets you make the contract value assets wrongly and drain it ' +
          'through legitimate-looking transactions. Oracle manipulation is one of the most common real DeFi ' +
          'exploits precisely because the contract trusts the number.',
        detect:
          'Cross-checking the oracle feed against independent price sources, and alerting on any divergence or ' +
          'on updates from an unexpected source.',
        evidence:
          'The oracle reporting a price sharply out of line with independent markets, feeding a series of ' +
          'contract interactions that profit from the discrepancy.',
        contain:
          'The oracle is switched to a validated multi-source feed, affected interactions assessed, and the ' +
          'contract paused if a pause mechanism exists.',
      },
    },
    {
      id: 'monitoring',
      label: 'On-chain monitoring',
      note: 'MON01, 10.132.5.40. Watches contract activity for anomalies.',
      technique: 'T1562.001 Impair Defenses: Disable or Modify Tools',
      flavour: {
        compromise:
          'On-chain monitoring is what turns an irreversible exploit into a fast response, pausing the contract ' +
          'or warning users before more value is lost. Blinding it buys the minutes needed to drain and move ' +
          'funds through mixers, after which recovery is effectively impossible.',
        detect:
          'Independent watchtower monitoring outside the compromised infrastructure, so the primary monitor ' +
          'going quiet is itself detected.',
        evidence:
          'Alert rules for large withdrawals disabled and the monitoring feed going silent ahead of unusual ' +
          'contract activity.',
        contain:
          'Monitoring is restored, an independent watchtower stood up, and on-chain analytics partners and ' +
          'exchanges notified to flag addresses while funds are still moving.',
      },
    },
    {
      id: 'multisig',
      label: 'Admin multi-signature wallet',
      note: 'Governance wallet controlling protocol parameters and upgrades.',
      technique: 'T1656 Impersonation',
      flavour: {
        compromise:
          'The multi-signature admin wallet can change protocol parameters or upgrade the contracts. ' +
          'Compromising enough signers, often by phishing or impersonation rather than breaking the ' +
          'cryptography, lets you push a malicious upgrade or change parameters to your benefit, a governance ' +
          'attack.',
        detect:
          'Out-of-band verification of every signer’s approval, and alerting on any proposed transaction ' +
          'outside the normal governance process or timelock.',
        evidence:
          'A proposed upgrade or parameter change gathering signatures outside the announced governance ' +
          'process, with signer approvals that do not reconcile to their verified intent.',
        contain:
          'The transaction is blocked within the timelock window, compromised signers removed and rotated, ' +
          'and quorum and timelock parameters reviewed.',
      },
    },
    {
      id: 'contract',
      label: 'Core protocol contract',
      note: 'On-chain contract holding the locked funds. The objective.',
      crown: true,
      technique: 'T1190 Exploit Public-Facing Application',
      flavour: {
        compromise:
          'You exploit a flaw in the core contract itself, a reentrancy, a logic error, an unchecked path, ' +
          'and drain the locked funds unseen. On-chain the code is the law: it did exactly what it was written ' +
          'to do, the transaction is valid, and settlement is final. There is no operator who can reverse it, ' +
          'no chargeback, and no restore. The funds move through mixers and across chains within minutes. This ' +
          'is the purest irreversibility lesson in the catalogue: prevention and pre-settlement detection are ' +
          'the only defences that exist, because response after the fact recovers nothing.',
        detect:
          'Formal verification and audit of the contract before deployment, invariant monitoring on-chain ' +
          '(total value locked against expected), a timelock or pause mechanism, and independent watchtowers ' +
          'that can trigger it.',
        evidence:
          'A transaction or sequence draining the pool through an unintended code path, with total value ' +
          'locked dropping sharply and no corresponding legitimate activity.',
        contain:
          'The contract is paused if a pause exists, the exploit path disclosed, exchanges and analytics ' +
          'providers notified to flag the destination addresses, and a post-mortem published. The stolen funds ' +
          'are gone permanently unless the attacker chooses to return them, which is the sobering reality of ' +
          'on-chain finality.',
      },
    },
  ],
});

/**
 * A container-orchestration platform, and the cloud-native control-plane problem.
 *
 * The lesson is that in a cloud-native estate the attack surface is not a host,
 * it is the pipeline, the images and the orchestrator's own automation. The crown
 * is the cluster control plane, because whoever controls it controls every
 * workload, and the routes to it run through supply chain and identity rather
 * than through a network perimeter.
 */
export const CLUSTER_KELVIN = definePositional({
  id: 'bd-cluster-kelvin',
  title: 'Control Plane: Kelvin Cloud',
  brief:
    'Seven systems, two defences, ten rounds. In a cloud-native estate the target is not a server, ' +
    'it is the orchestration control plane, and the routes to it run through the build pipeline, the ' +
    'images and the platform’s own automation. Red wants the control plane; whoever holds it holds ' +
    'every workload.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['container', 'cluster', 'orchestration', 'image', 'pipeline', 'admission', 'workload', 'rbac'],
  dossier: {
    org: 'Kelvin Cloud',
    summary:
      'A company running its product on a container-orchestration platform: a build pipeline, an ' +
      'image registry, an admission-control layer and a cluster control plane that schedules every ' +
      'workload. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Cluster control plane, 10.133.6.10 (crown)' },
      { k: 'Cluster network', v: '10.133.6.0/24' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Surface', v: 'Pipeline, images and platform automation, not hosts' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'developer',
      label: 'Developer access',
      note: 'Engineers with cluster and registry credentials, 10.133.6.0/24.',
      technique: 'T1528 Steal Application Access Token',
      flavour: {
        compromise:
          'A cached cluster or cloud token on an engineer’s laptop gives access without a password or a ' +
          'prompt, because the token already represents a completed login. It is the quiet way into a ' +
          'cloud-native platform, and engineers’ tokens are often broadly scoped.',
        detect:
          'Audit logs for API calls using a token from a device or address that does not match its issuance ' +
          'context, and tokens with unusually broad scope.',
        evidence:
          'Cluster API calls authenticated with an engineer token from an unfamiliar autonomous system, hours ' +
          'after the laptop slept.',
        contain:
          'Tokens are revoked, lifetimes shortened, conditional access requires a compliant device, and ' +
          'engineer access scoped down.',
      },
    },
    {
      id: 'pipeline',
      label: 'CI/CD pipeline',
      note: 'CI01, 10.133.6.30. Builds and deploys workloads with a powerful service identity.',
      technique: 'T1078.004 Valid Accounts: Cloud Accounts',
      flavour: {
        compromise:
          'The pipeline deploys to the cluster, so its service identity can change production by definition. A ' +
          'pull request that alters the pipeline definition runs with that identity, turning the build system ' +
          'into a way to execute arbitrary actions against the cluster with full authorisation.',
        detect:
          'Alerting on pipeline-definition changes and on any pipeline run whose actions differ from its ' +
          'declared deployment set.',
        evidence:
          'A pipeline definition modified in a branch to add a step that reads cluster secrets or deploys an ' +
          'unexpected workload, run once and reverted.',
        contain:
          'The pipeline identity is scoped down, definition changes require review from a separate group, and ' +
          'every secret the run could reach is rotated.',
      },
    },
    {
      id: 'registry',
      label: 'Image registry',
      note: 'REG01, 10.133.6.40. Holds the container images every workload runs.',
      technique: 'T1525 Implant Internal Image',
      flavour: {
        compromise:
          'The registry holds the images the cluster runs. Implanting a backdoor in a base image, or pushing a ' +
          'tampered image over a legitimate tag, means your code runs inside the cluster the next time that ' +
          'image is deployed, which defeats source review because the source never changed.',
        detect:
          'Image signing and admission control that refuses unsigned or unverified images, and monitoring for ' +
          'any push to a protected tag outside the pipeline.',
        evidence:
          'An image pushed to a protected base tag outside the pipeline, whose contents differ from the ' +
          'pipeline-built image.',
        contain:
          'The tainted image is removed, image signing enforced at admission, the registry access model ' +
          'tightened, and workloads running the bad image redeployed from a clean build.',
      },
    },
    {
      id: 'admission',
      label: 'Admission control',
      note: 'ADM01, 10.133.6.50. Policy layer that gates what may run on the cluster.',
      technique: 'T1562.001 Impair Defenses: Disable or Modify Tools',
      flavour: {
        compromise:
          'Admission control enforces the rules about what workloads may run, no privileged containers, only ' +
          'signed images, no host mounts. Disabling or weakening it removes the guardrails that would stop a ' +
          'malicious or over-privileged workload, opening the path to the control plane.',
        detect:
          'Monitoring the admission-control policy for changes, and alerting on any workload admitted that ' +
          'violates the intended policy.',
        evidence:
          'Admission policy weakened to allow privileged or unsigned workloads, with no change approval.',
        contain:
          'The policy is restored from configuration control, admitted workloads reviewed against it, and ' +
          'policy changes gated behind approval.',
      },
    },
    {
      id: 'secrets',
      label: 'Cluster secrets',
      note: 'SEC01, 10.133.6.60. Secrets and service-account tokens used by workloads.',
      technique: 'T1552.007 Unsecured Credentials: Container API',
      flavour: {
        compromise:
          'Cluster secrets and service-account tokens are reachable from workloads and, if roles are too broad, ' +
          'from one compromised workload to many. Harvesting a powerful service-account token is a direct step ' +
          'toward the control plane.',
        detect:
          'Least-privilege review of service-account roles, and monitoring for any workload accessing secrets ' +
          'or the API beyond its role.',
        evidence:
          'A workload reading service-account tokens and using one with cluster-admin-adjacent rights, well ' +
          'beyond its own function.',
        contain:
          'The token is revoked, service-account roles scoped down, and secret access from workloads ' +
          'restricted and audited.',
      },
    },
    {
      id: 'logging',
      label: 'Cluster audit log',
      note: 'LOG01, 10.133.6.70. The record of control-plane API activity.',
      technique: 'T1562.008 Impair Defenses: Disable or Modify Cloud Logs',
      flavour: {
        compromise:
          'The audit log is the only record of who did what to the cluster. Disabling it, or filtering out your ' +
          'own service account, makes everything afterward invisible rather than merely unnoticed, which is the ' +
          'step that separates a competent operator from a noisy one.',
        detect:
          'Alerting on any change to audit configuration, delivered to a store outside the cluster the ' +
          'compromised identity cannot reach.',
        evidence:
          'Audit logging modified to exclude a service account, and a gap in delivery to the external store.',
        contain:
          'Logging is restored from the external store, the gap reconstructed, and audit configuration ' +
          'protected from cluster roles.',
      },
    },
    {
      id: 'controlplane',
      label: 'Cluster control plane',
      note: 'API01, 10.133.6.10. Schedules and controls every workload. The objective.',
      crown: true,
      technique: 'T1610 Deploy Container',
      flavour: {
        compromise:
          'You reach the cluster control plane unseen: the API server and scheduler that command every ' +
          'workload in the estate. From here you can deploy a privileged container onto any node, read every ' +
          'secret, and reach every service the cluster runs, and you got here through the pipeline and the ' +
          'images rather than by breaking a perimeter that does not exist. This is the cloud-native lesson: the ' +
          'control plane is the crown, the supply chain and identity are the routes to it, and "there is no ' +
          'host to defend" is not reassurance, it is the whole change in the threat model.',
        detect:
          'Control-plane audit monitoring for privileged workload creation, node-level access, and secret ' +
          'enumeration, with role-based access tightly scoped and privileged actions alerted.',
        evidence:
          'A privileged container deployed across nodes and bulk secret reads through the API, from a service ' +
          'account that reached admin rights through the pipeline.',
        contain:
          'The control plane is isolated, compromised credentials and service-account tokens rotated cluster ' +
          'wide, malicious workloads removed, and the cluster rebuilt from known-good declarative ' +
          'configuration where trust cannot be re-established.',
      },
    },
  ],
});

/**
 * A robotic fulfilment centre, and the human-robot-shared-floor problem.
 *
 * The distinguishing feature is that people and autonomous machines share a
 * physical space under software control, so a compromise of the control system is
 * a worker-safety event as well as a logistics one. The crown is the warehouse
 * control system that directs every robot and task on the floor.
 */
export const WAREHOUSE_PALETREE = definePositional({
  id: 'bd-warehouse-paletree',
  title: 'Shared Floor: Paletree Fulfilment',
  brief:
    'Seven systems, two defences, ten rounds. Humans and autonomous robots share one warehouse floor ' +
    'under software control. Red wants the warehouse control system that directs every robot, because ' +
    'a compromise of it is a worker-safety event as much as a shipping one.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['robot', 'warehouse', 'floor', 'safety', 'fulfilment', 'automation', 'physical', 'worker'],
  dossier: {
    org: 'Paletree Fulfilment',
    summary:
      'A large automated fulfilment centre where thousands of mobile robots move goods alongside human ' +
      'staff, coordinated by a central warehouse control system. Safety depends on the software keeping ' +
      'robots and people apart. Simulated throughout: no robot is actually commanded.',
    facts: [
      { k: 'Objective', v: 'Warehouse control system, 172.20.7.10 (crown)' },
      { k: 'Automation network', v: '172.20.7.0/24' },
      { k: 'Corporate', v: '10.134.1.0/24' },
      { k: 'Public range', v: '192.0.2.0/24' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'corp',
      label: 'Corporate IT',
      note: 'Office network, 10.134.1.0/24. Email, orders, workforce management.',
      technique: 'T1566.001 Phishing: Spearphishing Attachment',
      flavour: {
        compromise:
          'An operations manager opens a document posing as a carrier notice. The macro loads a foothold. The ' +
          'floor is untouched; this phase is for finding the route into the automation network.',
        detect:
          'Office spawning a scripting host on an operations endpoint, and beacons to newly registered ' +
          'domains.',
        evidence:
          'A macro-enabled carrier notice opened at 09:15, followed by an encoded PowerShell command and a ' +
          'beacon.',
        contain:
          'The host is isolated and reimaged, credentials reset, and macros blocked from internet documents.',
      },
    },
    {
      id: 'gateway',
      label: 'Automation gateway',
      note: 'GW01, 172.20.7.60. The controlled path into the automation network.',
      technique: 'T1133 External Remote Services',
      flavour: {
        compromise:
          'The automation gateway is the boundary, with a vendor support path left without multi-factor. ' +
          'Taking it puts you on the network that coordinates the robots.',
        detect:
          'Gateway authentication without an MFA event, and sessions outside scheduled maintenance.',
        evidence:
          'A gateway session at 02:20 via the vendor path, from a corporate host.',
        contain:
          'The vendor path is closed, MFA enforced, and the gateway rebuilt.',
      },
    },
    {
      id: 'wms',
      label: 'Warehouse management',
      note: 'WMS01, 172.20.7.30. Inventory, orders and task allocation.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'The management system decides what gets picked and shipped. Corrupting inventory or task data ' +
          'disrupts fulfilment and can be used to misdirect goods, a logistics-fraud angle short of touching ' +
          'the robots directly.',
        detect:
          'Integrity monitoring on inventory and task data, and reconciliation against physical stock and ' +
          'dispatch records.',
        evidence:
          'Inventory or task records altered outside the management workflow, inconsistent with physical ' +
          'stock.',
        contain:
          'Records are restored from the verified source, affected orders held, and task data reconciled ' +
          'against the floor.',
      },
    },
    {
      id: 'chargers',
      label: 'Robot charging',
      note: 'CHG01, 172.20.7.40. Manages robot battery charging and rotation.',
      technique: 'T0836 Modify Parameter',
      flavour: {
        compromise:
          'The charging system keeps the robot fleet powered. Manipulating it to strand robots or overcharge ' +
          'batteries disrupts operations and, in the worst case, creates a fire risk, a nuisance-to-hazard ' +
          'attack that does not require the control system.',
        detect:
          'Monitoring charging parameters against safe limits and alerting on values outside the vendor ' +
          'envelope or on mass charging changes.',
        evidence:
          'Charging parameters pushed outside the safe envelope from the automation gateway rather than the ' +
          'charging console.',
        contain:
          'Charging is reverted to safe defaults, affected units inspected, and the charging network isolated.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.134.1.5. Staff identity, which governs automation access.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Corporate identity reaches the automation network, so the directory is one hop from the control ' +
          'system. Replication rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from an operations workstation at 02:40.',
        contain:
          'The account is disabled, krbtgt reset twice, and the automation network separated onto its own ' +
          'identity plane.',
      },
    },
    {
      id: 'safety',
      label: 'Floor safety system',
      note: 'SAFE01, 172.20.7.50. Zone sensors and speed limits that keep robots away from people.',
      technique: 'T0880 Loss of Safety',
      flavour: {
        compromise:
          'The floor safety system enforces the zones and speed limits that keep robots away from human staff. ' +
          'It is the independent safeguard, and disabling it does not itself move a robot, it removes the ' +
          'guarantee that a robot will stop for a person. That is why it is the enabling step for a harmful ' +
          'control command.',
        detect:
          'Integrity monitoring on the safety system against its certified configuration, and independent ' +
          'verification that safety zones and speed limits are enforced.',
        evidence:
          'Safety zones or speed limits weakened in the configuration, with the change made from the ' +
          'automation network rather than the safety console.',
        contain:
          'The floor is stopped, the safety system restored from the certified configuration and physically ' +
          'verified, and operations resumed only once the safeguards are proven.',
      },
    },
    {
      id: 'wcs',
      label: 'Warehouse control system',
      note: 'WCS01, 172.20.7.10. Directs every robot and task on the floor. The objective.',
      crown: true,
      technique: 'T0831 Manipulation of Control',
      flavour: {
        compromise:
          'You reach the warehouse control system unseen: the software that directs thousands of robots moving ' +
          'among human workers. With the floor safety system already weakened, commanding robots along unsafe ' +
          'paths or at unsafe speeds turns a logistics platform into a physical threat to the people on the ' +
          'floor, and even without injury a fleet-wide disruption halts a facility that a whole supply chain ' +
          'depends on. This is cyber-physical logistics: the lesson is that once people and autonomous ' +
          'machines share a space under software control, the control system is a safety system too.',
        detect:
          'Command auditing on the control system, independent floor safety enforcement that the control ' +
          'system cannot override, and monitoring for movement commands inconsistent with safe operation.',
        evidence:
          'Movement commands issued to many robots along paths that violate safety zones, from a session that ' +
          'reached the control system through the automation gateway, with the safety system already weakened.',
        contain:
          'The floor is brought to an immediate safe stop, staff cleared, the control system isolated and ' +
          'restored from known-good configuration, the safety system verified, and operations resumed only ' +
          'after both are proven. Worker safety leads the response, ahead of throughput.',
      },
    },
  ],
});
