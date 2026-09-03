/**
 * Board scenarios: frontier platforms.
 *
 * Three estates on newer or more specialised stacks, each teaching a failure
 * mode the earlier boards do not reach.
 *
 * The mobile-core board is about virtualised network functions and slice
 * isolation: a 5G core is software running the functions that used to be
 * dedicated hardware, so the crown is the control plane whose compromise reaches
 * every subscriber and every network slice at once. The model board is about a
 * new asset class: the crown is a set of trained model weights, which are
 * enormously expensive to produce, cannot be revoked once stolen, and can be
 * poisoned upstream. The depository board is about the record of ownership: the
 * crown is the securities register that says who owns what, where an integrity
 * failure is a systemic financial event, not a data breach.
 *
 * Same standard as the rest: every system names its ATT&CK technique, and the
 * four outcome lines carry the method, the detection logic, the artefact and the
 * containment.
 *
 * Fabricated orgs, `.example` names, RFC 5737 outside and RFC 1918 inside.
 */

import { definePositional } from './positional-kit.js';

/**
 * A 5G mobile core, and the virtualised-network-function problem.
 *
 * The lesson is that a modern mobile core is software: the functions that were
 * once dedicated telecom hardware now run as network functions on a shared
 * platform, with network slicing meant to isolate one service from another. The
 * crown is the core control plane, because compromising it reaches every
 * subscriber, every slice and the lawful-intercept capability at once.
 */
export const CORE_CENDANT = definePositional({
  id: 'bd-core-cendant',
  title: 'Slice and Core: Cendant Mobile',
  brief:
    'Seven systems, two defences, ten rounds. A 5G core is software: the network functions that used ' +
    'to be dedicated hardware, with slicing meant to keep services apart. Red wants the core control ' +
    'plane, because it reaches every subscriber, every slice and the intercept capability at once.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['core', 'slice', 'nfv', 'subscriber', 'signalling', 'intercept', 'isolation', 'function'],
  dossier: {
    org: 'Cendant Mobile',
    summary:
      'A mobile network operator running a virtualised 5G core: network functions on a shared cloud ' +
      'platform, network slicing for different services, and a lawful-intercept capability. ' +
      'Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Core control plane, 10.139.5.10 (crown)' },
      { k: 'Core network', v: '10.139.5.0/24' },
      { k: 'Public range', v: '198.51.100.0/24' },
      { k: 'Reach', v: 'Every subscriber and every network slice' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'oam',
      label: 'Operations and management',
      note: 'OAM01, 10.139.5.30. Manages the network functions.',
      technique: 'T1078 Valid Accounts',
      flavour: {
        compromise:
          'A reused operations credential still valid and without multi-factor. The operations and management ' +
          'plane configures the network functions, so it is the practical route toward the core, and telecom ' +
          'operations accounts are often broadly privileged.',
        detect:
          'Authentication anomalies for operations accounts, and management actions outside a change window.',
        evidence:
          'An operations login from an unfamiliar address making network-function configuration changes.',
        contain:
          'The account is reset, MFA enforced, and recent management changes reviewed.',
      },
    },
    {
      id: 'nfv',
      label: 'NFV platform',
      note: 'NFV01, 10.139.5.40. The virtualisation platform the network functions run on.',
      technique: 'T1611 Escape to Host',
      flavour: {
        compromise:
          'The network functions run as virtualised workloads. Escaping a compromised function to the ' +
          'underlying platform breaks the isolation the whole architecture depends on, letting one function ' +
          'reach the others and the platform that hosts them all.',
        detect:
          'Workload isolation monitoring on the NFV platform, and alerting on any process behaviour consistent ' +
          'with a container or VM escape.',
        evidence:
          'A network function workload accessing the host platform or neighbouring workloads beyond its ' +
          'defined boundary.',
        contain:
          'The workload is isolated, the platform patched, isolation hardened, and neighbouring functions ' +
          'reviewed for compromise.',
      },
    },
    {
      id: 'slice',
      label: 'Network slice manager',
      note: 'SLICE01, 10.139.5.50. Enforces separation between network slices.',
      technique: 'T1548 Abuse Elevation Control Mechanism',
      flavour: {
        compromise:
          'Slicing is meant to isolate, say, a critical-infrastructure slice from consumer traffic. Defeating ' +
          'the slice manager lets you cross from one slice to another, reaching a protected service through a ' +
          'less protected one, which is the 5G-specific version of the tenant-isolation failure.',
        detect:
          'Monitoring for any traffic or control action crossing a slice boundary, which the isolation policy ' +
          'forbids.',
        evidence:
          'Traffic or management actions crossing from one slice into another with no legitimate ' +
          'cross-slice function.',
        contain:
          'The slice boundary is restored and enforced, the crossing reviewed, and slice isolation verified ' +
          'against policy.',
      },
    },
    {
      id: 'subscriber',
      label: 'Subscriber data',
      note: 'UDM01, 10.139.5.60. Subscriber identities and authentication keys.',
      technique: 'T1552.004 Unsecured Credentials: Private Keys',
      flavour: {
        compromise:
          'The subscriber data management holds the authentication keys for every SIM. As on the earlier ' +
          'telecom board, reaching this lets you impersonate subscribers wholesale, and here it sits inside ' +
          'the virtualised core.',
        detect:
          'Alerting on any bulk read of subscriber key material, which should be a never-event, and privileged ' +
          'access from outside the operations bastion.',
        evidence:
          'A bulk export of subscriber authentication material from a session that reached the core through ' +
          'the operations plane.',
        contain:
          'Access is severed, the export quantified, and a key rotation programme planned, which at this scale ' +
          'means reissuing SIMs.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.139.5.5. Staff identity, which governs core access.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Corporate identity reaches the operations plane, so the directory is one hop from the core. ' +
          'Replication rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from an operations workstation at 02:40.',
        contain:
          'The account is disabled, krbtgt reset twice, and the core separated onto its own identity plane.',
      },
    },
    {
      id: 'intercept',
      label: 'Lawful intercept',
      note: 'LI01, 10.139.5.70. The regulated interception capability.',
      technique: 'T1040 Network Sniffing',
      flavour: {
        compromise:
          'The lawful-intercept capability is a built-in ability to monitor communications, tightly regulated ' +
          'and tightly held. Abusing it turns the operator’s own compliance function into a mass surveillance ' +
          'tool, and it has been a target of real intrusions precisely because it exists.',
        detect:
          'Strict auditing of every intercept activation against legal authorisations, and alerting on any ' +
          'activation without a matching warrant record.',
        evidence:
          'Intercept targets activated with no corresponding legal authorisation, from an unexpected session.',
        contain:
          'Unauthorised intercepts are disabled, the capability access reviewed, and the abuse reported to the ' +
          'regulator and oversight body.',
      },
    },
    {
      id: 'controlplane',
      label: 'Core control plane',
      note: 'CP01, 10.139.5.10. Commands the network functions and slices. The objective.',
      crown: true,
      technique: 'T0855 Unauthorized Command Message',
      flavour: {
        compromise:
          'You reach the 5G core control plane unseen: the software that commands every network function and ' +
          'slice. From here you can reroute or drop traffic for any subscriber, cross every slice boundary, ' +
          'reach the intercept capability, and degrade or seize the mobile network a whole region depends on ' +
          'for connectivity and emergency calls. The mobile core used to be dedicated, physically bounded ' +
          'hardware; virtualising it made it flexible and made this single, software control plane the crown. ' +
          'The lesson is that softwarising critical network infrastructure concentrates its risk into a ' +
          'control plane that must be defended like the tier-zero system it now is.',
        detect:
          'Command auditing on the control plane with approval for high-impact actions, slice-isolation and ' +
          'function-integrity monitoring, and privileged access confined to a hardened bastion.',
        evidence:
          'Control-plane commands rerouting traffic or crossing slices with no change approval, from a session ' +
          'that reached it through the operations plane.',
        contain:
          'The control plane is isolated, privileged credentials and subscriber keys rotated, slice isolation ' +
          'and function integrity re-verified, and the national communications and lawful-intercept oversight ' +
          'bodies engaged.',
      },
    },
  ],
});

/**
 * An AI model platform, and the model-as-crown-jewel problem.
 *
 * The lesson is that a trained model is a new class of asset: enormously
 * expensive to produce, impossible to revoke once copied, and corruptible
 * upstream through its training data. The crown is the model weights and the
 * serving pipeline, and the board covers theft, poisoning and abuse in one place.
 */
export const MODEL_CORVID = definePositional({
  id: 'bd-model-corvid',
  title: 'Weights: Corvid AI',
  brief:
    'Seven systems, two defences, ten rounds. A trained model is a new kind of asset: hugely ' +
    'expensive to build, impossible to revoke once copied, and corruptible through its training data. ' +
    'Red wants the model weights and the serving pipeline. Blue is defending an asset with no reset.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['model', 'weights', 'training', 'poison', 'inference', 'pipeline', 'dataset', 'serving'],
  dossier: {
    org: 'Corvid AI',
    summary:
      'A company that trains and serves large machine-learning models. It holds proprietary model ' +
      'weights, a training data pipeline, and an inference service that customers query. Fabricated ' +
      'throughout.',
    facts: [
      { k: 'Objective', v: 'Model weight store, 10.140.6.10 (crown)' },
      { k: 'Platform network', v: '10.140.6.0/24' },
      { k: 'Public range', v: '203.0.113.0/24' },
      { k: 'Asset', v: 'Proprietary model weights, expensive and non-revocable' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'researcher',
      label: 'Researcher endpoints',
      note: 'ML engineers with access to training infrastructure and weights, 10.140.6.0/24.',
      technique: 'T1528 Steal Application Access Token',
      flavour: {
        compromise:
          'A cached cloud token on a researcher’s laptop gives access to the training and storage ' +
          'infrastructure without a password or prompt. Researchers often hold broad access to expensive ' +
          'compute and to the weights themselves, which makes their endpoints a direct route to the crown.',
        detect:
          'Audit logs for API calls using a token from a device or address that does not match its issuance ' +
          'context, and tokens with broad access to the weight store.',
        evidence:
          'Storage API calls authenticated with a researcher token from an unfamiliar autonomous system, hours ' +
          'after the laptop slept.',
        contain:
          'Tokens are revoked, lifetimes shortened, access to the weight store scoped down, and the laptop ' +
          'isolated.',
      },
    },
    {
      id: 'datapipeline',
      label: 'Training data pipeline',
      note: 'DATA01, 10.140.6.30. Ingests and prepares training data.',
      technique: 'T1195.001 Supply Chain Compromise: Software Dependencies',
      flavour: {
        compromise:
          'Poisoning the training data, injecting crafted examples upstream, corrupts the model itself in ways ' +
          'that are hard to detect and that persist into every version trained on that data. It is a supply ' +
          'chain attack on the model’s behaviour rather than its confidentiality, and it does not require ' +
          'stealing anything.',
        detect:
          'Provenance tracking and validation on training data, anomaly detection on ingested datasets, and ' +
          'evaluation of trained models against a held-out trusted benchmark for unexpected behaviour.',
        evidence:
          'A dataset ingested from a source outside the approved provenance, or a trained model failing a ' +
          'trusted behavioural benchmark in a targeted way.',
        contain:
          'The poisoned data is removed, provenance enforced on ingestion, affected model versions ' +
          'quarantined and retrained from trusted data, and the benchmark tightened.',
      },
    },
    {
      id: 'training',
      label: 'Training cluster',
      note: 'TRAIN01, 10.140.6.40. The expensive compute where models are trained.',
      technique: 'T1610 Deploy Container',
      flavour: {
        compromise:
          'The training cluster holds enormous compute and, transiently, the weights being produced. A ' +
          'malicious job deployed onto it can exfiltrate weights mid-training or run hidden compute, and the ' +
          'cluster is often less locked down than production because it is an internal research tool.',
        detect:
          'Monitoring of jobs on the training cluster against approved workloads, and egress monitoring from ' +
          'the cluster.',
        evidence:
          'An unapproved job on the training cluster reading checkpoint weights and transferring them ' +
          'externally.',
        contain:
          'The job is killed, the cluster access reviewed, egress restricted, and checkpoints assessed for ' +
          'exposure.',
      },
    },
    {
      id: 'inference',
      label: 'Inference service',
      note: 'inf.corvid.example, 203.0.113.65. The public API customers query.',
      technique: 'T1190 Exploit Public-Facing Application',
      flavour: {
        compromise:
          'The inference service serves the model to customers. Abusing it, through prompt-based extraction or ' +
          'high-volume querying, can lift training data or approximate the model’s behaviour, and a flaw in ' +
          'the service gives a foothold near the weights. It is the public edge of the platform.',
        detect:
          'The inference tier spawning unexpected processes, and abuse detection on query patterns consistent ' +
          'with model extraction or data exfiltration.',
        evidence:
          'The inference service spawning a shell, or query patterns systematically probing to reconstruct the ' +
          'model or its training data.',
        contain:
          'The service is patched and rebuilt, rate and abuse controls tightened, and the extraction attempt ' +
          'assessed for what it recovered.',
      },
    },
    {
      id: 'ad',
      label: 'Corporate directory',
      note: 'DC01, 10.140.6.5. Staff identity, which governs platform access.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Corporate identity reaches the platform, so the directory is one hop from the weight store. ' +
          'Replication rights take the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from a researcher workstation at 02:30.',
        contain:
          'The account is disabled, krbtgt reset twice, and the platform separated onto its own identity ' +
          'plane.',
      },
    },
    {
      id: 'egress',
      label: 'Outbound proxy',
      note: 'PRX01, 10.140.6.60. Controls what leaves the platform network.',
      technique: 'T1030 Data Transfer Size Limits',
      flavour: {
        compromise:
          'Model weights are very large, so moving them out quietly means metering the transfer below the ' +
          'egress alarm over time. The exfiltration is the patient counterpart to whatever technique got the ' +
          'access, and it is where a serious model-theft operation stays hidden.',
        detect:
          'Cumulative egress analysis per host over long windows, and alerting on sustained transfers to any ' +
          'single external destination.',
        evidence:
          'A steady flow of large files to one external endpoint over days, each transfer under the daily ' +
          'threshold, summing to the size of the weights.',
        contain:
          'The destination is blocked, egress limited, the cumulative transfer quantified, and the exposure ' +
          'assessed as intellectual-property theft.',
      },
    },
    {
      id: 'weights',
      label: 'Model weight store',
      note: 'WTS01, 10.140.6.10. The trained model weights. The objective.',
      crown: true,
      technique: 'T1530 Data from Cloud Storage',
      flavour: {
        compromise:
          'You reach the model weight store unseen and copy the weights. A frontier model can cost enormous ' +
          'sums and scarce talent to train, and once the weights are copied they cannot be revoked, recalled ' +
          'or reset: a competitor or adversary now has a capability it did not pay to build and that no legal ' +
          'action can un-share. The weights are a new class of crown jewel, and this board frames the whole ' +
          'lifecycle around them, theft here, poisoning at the data pipeline, abuse at inference, because ' +
          'defending a model means defending all three. The lesson is that trained models are strategic ' +
          'assets whose irreversibility, like a genome or a signing key, changes how they must be protected.',
        detect:
          'Access and transfer auditing on the weight store with alerting on any bulk read, egress correlation ' +
          'with the proxy, and strict, logged, least-privilege access to the weights.',
        evidence:
          'A read of the full weight set staged for slow exfiltration, by a session that reached the store ' +
          'through the training or research environment.',
        contain:
          'The store is isolated, the exposure quantified, access tightened, and the theft treated as ' +
          'permanent intellectual-property loss, with the response focused on limiting downstream use rather ' +
          'than on a recovery that does not exist.',
      },
    },
  ],
});

/**
 * A central securities depository, and the ownership-record problem.
 *
 * The counterpart to the exchange board: the exchange matches trades, but the
 * depository is the authoritative record of who owns which securities, and
 * settlement makes that record final. The crown is the ownership register, where
 * a successful integrity attack is a systemic financial event because the market
 * can no longer prove who owns what.
 */
export const DEPOSITORY_STERLING = definePositional({
  id: 'bd-depository-sterling',
  title: 'Book Entry: Sterling Depository',
  brief:
    'Seven systems, two defences, ten rounds. Not the matching this time, the ownership. Sterling is ' +
    'the authoritative record of who owns which securities, and settlement makes it final. Red wants ' +
    'the register; an integrity failure here is systemic, because the market can no longer prove who ' +
    'owns what.',
  maxTurns: 10,
  coverageBudget: 2,
  movesLeft: 3,
  terms: ['depository', 'ownership', 'register', 'settlement', 'securities', 'integrity', 'systemic', 'reconcile'],
  dossier: {
    org: 'Sterling Depository',
    summary:
      'A central securities depository holding the authoritative book-entry record of securities ' +
      'ownership for a market, and performing settlement. Members connect to submit and settle ' +
      'transactions. Fabricated throughout.',
    facts: [
      { k: 'Objective', v: 'Ownership register, 10.141.7.10 (crown)' },
      { k: 'Settlement network', v: '10.141.7.0/24' },
      { k: 'Public range', v: '192.0.2.0/24' },
      { k: 'Property', v: 'The authoritative record of who owns what; settlement is final' },
      { k: 'Blue coverage', v: '2 systems at a time, 3 repositions' },
      { k: 'Clock', v: '10 rounds' },
    ],
  },
  targets: [
    {
      id: 'memberportal',
      label: 'Member portal',
      note: 'members.sterling.example, 192.0.2.65. Where members manage connectivity and instructions.',
      technique: 'T1078 Valid Accounts',
      flavour: {
        compromise:
          'A member credential, reused and found in a breach corpus, gets you in as a legitimate participant. ' +
          'From a member’s access you can submit instructions and reach further into the settlement estate.',
        detect:
          'Authentication anomalies for member accounts, and instructions inconsistent with the member’s ' +
          'normal pattern.',
        evidence:
          'A member login from an unfamiliar address submitting instructions the firm did not authorise.',
        contain:
          'The account is reset, MFA enforced, and recent instructions reviewed and reversed where possible.',
      },
    },
    {
      id: 'settlement',
      label: 'Settlement engine',
      note: 'SET01, 10.141.7.30. Settles transactions and updates ownership.',
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'The settlement engine is what turns a trade into a change of ownership. Manipulating a settlement, ' +
          'or suppressing the confirmation, is the counterpart of the wire-fraud lesson: attacking the record ' +
          'of what settled buys time before reconciliation notices.',
        detect:
          'Reconciliation of settlements against member instructions and the ownership register, with alerting ' +
          'on any settlement without a matching authorised instruction.',
        evidence:
          'A settlement transferring securities with no matching authorised instruction, or a confirmation ' +
          'suppressed.',
        contain:
          'The settlement is halted and reversed where the rules allow, reconciliation done manually, and dual ' +
          'authorisation on high-value settlement verified.',
      },
    },
    {
      id: 'reconciliation',
      label: 'Reconciliation system',
      note: 'REC01, 10.141.7.40. Checks the register against members and issuers.',
      technique: 'T1562.001 Impair Defenses: Disable or Modify Tools',
      flavour: {
        compromise:
          'Reconciliation is what would catch an unauthorised change to ownership. Blinding or subverting it ' +
          'lets a manipulation of the register go undetected long enough to matter, which is the enabling step ' +
          'for an attack on the ownership record itself.',
        detect:
          'Independent reconciliation from a separate system, so the primary reconciliation going quiet or ' +
          'passing everything is itself detected.',
        evidence:
          'Reconciliation exceptions suppressed or the reconciliation output showing a suspiciously clean run ' +
          'during unusual activity.',
        contain:
          'Reconciliation is restored from configuration control, an independent reconciliation run, and the ' +
          'period reviewed against source records.',
      },
    },
    {
      id: 'ad',
      label: 'Domain controller',
      note: 'DC01, 10.141.7.5. Depository staff identity.',
      technique: 'T1003.006 OS Credential Dumping: DCSync',
      flavour: {
        compromise:
          'Domain admin over the settlement estate puts the register and reconciliation both within reach. ' +
          'DCSync takes the hashes without executing on the controller.',
        detect:
          'Event 4662 with the replication GUID from a non-domain-controller principal.',
        evidence:
          'Directory replication requested from a settlement-operations workstation at 03:00.',
        contain:
          'The account is disabled, krbtgt reset twice, and the settlement network moved onto its own ' +
          'identity plane.',
      },
    },
    {
      id: 'backup',
      label: 'Backup infrastructure',
      note: 'BKP01, 10.141.7.60. Domain-joined, online.',
      technique: 'T1490 Inhibit System Recovery',
      flavour: {
        compromise:
          'Domain-joined backups fail with the domain, and for a depository the ability to restore the true ' +
          'ownership record from a known-good point is the ultimate defence against an integrity attack. ' +
          'Neutralising it is the quiet move that would make a manipulated register far harder to unwind.',
        detect:
          'Backup console audit for logins from outside the administrative subnet, and jobs disabled outside ' +
          'the change process.',
        evidence:
          'Backup jobs disabled and retention shortened by a session using a domain administrator credential.',
        contain:
          'Jobs restored, immutable retention enabled, and backups taken off the domain onto separate ' +
          'credentials.',
      },
    },
    {
      id: 'connectivity',
      label: 'Market connectivity',
      note: 'CONN01, 10.141.7.70. Links to the exchange, clearing and members.',
      technique: 'T1565.002 Data Manipulation: Transmitted Data Manipulation',
      flavour: {
        compromise:
          'Connectivity carries instructions and confirmations between the depository, the exchange, clearing ' +
          'and members. Corrupting it can inject false instructions or drop real ones, creating settlement ' +
          'risk and uncertainty across the market.',
        detect:
          'Reconciliation of the connectivity flows against the authoritative records at each end, and ' +
          'alerting on any mismatch.',
        evidence:
          'Instructions or confirmations altered in transit between the depository and its counterparties.',
        contain:
          'The connectivity flows are reconciled against source, discrepancies resolved before settlement, and ' +
          'the integrity of the links restored.',
      },
    },
    {
      id: 'register',
      label: 'Ownership register',
      note: 'REG01, 10.141.7.10. The authoritative record of who owns what. The objective.',
      crown: true,
      technique: 'T1565.001 Data Manipulation: Stored Data Manipulation',
      flavour: {
        compromise:
          'You reach the ownership register unseen and alter who owns which securities. Because settlement is ' +
          'final and the register is the authoritative record, a successful manipulation does not merely steal ' +
          'value, it undermines the market’s ability to prove ownership at all: holdings that were certain ' +
          'become disputed, and unwinding it means reconstructing the true record from every source and every ' +
          'backup. This is a systemic financial event rather than a data breach, and it is why a depository ' +
          'holds the integrity of its register above every other consideration. The lesson is that some ' +
          'systems ARE the source of truth for an entire market, and their integrity is the market’s ' +
          'foundation.',
        detect:
          'Continuous integrity monitoring on the register, reconciliation against members, issuers and the ' +
          'transaction history, and independent, immutable snapshots that a manipulation cannot reach.',
        evidence:
          'Ownership balances changed in the register with no matching settled instruction, detected by ' +
          'reconciliation against the transaction history.',
        contain:
          'Settlement is halted, the register reconciled and restored from the authoritative history and ' +
          'immutable snapshots, affected holdings resolved with members and issuers, and the market regulator ' +
          'and central bank engaged because the event is systemic. Restoring provable ownership is the whole of ' +
          'the response.',
      },
    },
  ],
});
