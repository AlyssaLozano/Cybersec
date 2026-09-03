/**
 * Cloud Security Foundations: securing workloads once the data centre belongs
 * to somebody else.
 *
 * WHO THIS IS FOR
 *
 * This track is built for people arriving from IT operations, sysadmin work, or
 * DevOps rather than from a security background, because that is where the
 * hiring actually happens: a career changer who already understands servers,
 * networks, and patch cycles is close to qualified for a cloud security role the
 * moment they learn to read the artefacts this package teaches. What changes is
 * not the underlying discipline, it is that the infrastructure is now
 * API-driven, every resource is internet-adjacent unless a specific setting says
 * otherwise, and a single misconfigured file can be reproduced across an entire
 * estate in the time it takes to run a deployment.
 *
 * WHY IT NEEDS NO TERMINAL
 *
 * There is no simulated AWS, Azure, or GCP command line or console in this
 * platform, and building one would teach a fiction that goes stale the moment
 * any of the three real providers ships a UI change, on top of testing which
 * button a student can find rather than what they actually understand. What can
 * be taught honestly is the judgement, which is most of the real job anyway:
 * reading a policy fragment, a bucket grant, a rule table, a log excerpt, or an
 * infrastructure-as-code snippet, and correctly assessing what it does and
 * whether that is a problem. Every exercise in this package grades that
 * assessment directly, against a real artefact rendered as plain text, never as
 * a sequence of commands against a simulated cloud that would only ever
 * resemble one provider syntax at one point in time.
 *
 * TERMINOLOGY
 *
 * Examples throughout use AWS-flavoured names, IAM, S3-style buckets, security
 * groups, CloudTrail-style activity logs, because they are the vocabulary most
 * widely recognised across the industry. Azure and GCP name the same concepts
 * differently and the concepts themselves do not change: an over-permissioned
 * identity, a public storage grant, a stateless network filter, and an unlogged
 * management action are the same finding on every provider.
 */

import type { Exercise, LearningPackage } from '@soc/shared';

// --- shared teaching material ------------------------------------------------

const RESPONSIBILITY_TEACH = {
  concept:
    'Every cloud contract splits security into two halves, and the split is called the shared ' +
    'responsibility model. The provider is responsible for security OF the cloud: the physical data ' +
    'centres, the racks and cabling, the hypervisor that carves one physical machine into many ' +
    'virtual ones, and the network between regions. You never see any of it, and you cannot fix it ' +
    'if it is wrong. The customer is responsible for security IN the cloud: the operating system you ' +
    'chose to run, the identities and permissions you configured, the data you put there and how you ' +
    'protected it, and the code you deployed on top of all of it.\n\n' +
    'Where the line sits depends on how much of the stack the provider is running for you. Rent a ' +
    'virtual machine, infrastructure as a service, and the line sits low: you patch the guest ' +
    'operating system, you configure the firewall rules, you manage the application. Rent a managed ' +
    'database or a container platform, platform as a service, and the line moves up: the provider now ' +
    'patches the engine or the orchestration layer, and your job narrows to configuration, access, ' +
    'and data. Rent a finished application, software as a service, and the line moves higher still, ' +
    'but it never reaches the top: you still decide who has an account, what they can see, and what ' +
    'leaves the system.\n\n' +
    'This is the single most-tested concept in every cloud certification, and also the easiest one to ' +
    'get backwards under pressure. Moving a system to the cloud sounds like it should mean somebody ' +
    'else now worries about this, and for a narrow slice of the problem it does. For the slice that ' +
    'causes almost every real cloud breach, misconfigured access and exposed data sitting behind ' +
    'identities with too much reach, it means the opposite: the responsibility moved into an ' +
    'environment where a single wrong setting is reachable from the entire internet by default.',
} as const;

const IAM_POLICY_TEACH = {
  concept:
    'On a traditional network, the perimeter was a place: a firewall at the edge, and anything ' +
    'behind it was more trusted than anything in front. Cloud infrastructure has no equivalent edge. ' +
    'Every resource is reachable through an API from anywhere on the internet, and what stands ' +
    'between an anonymous request and a running database is not a network boundary, it is whether the ' +
    'request carries credentials with permission to act. That is why identity and access management, ' +
    'IAM, is described as the new perimeter: it is doing the job the firewall used to do, and it ' +
    'fails in the same direction a firewall does when it is misconfigured, silently and completely ' +
    'open.\n\n' +
    'A policy is the document that grants that permission, and here is a real shape one takes:\n\n' +
    '{\n' +
    '  "Version": "2012-10-17",\n' +
    '  "Statement": [\n' +
    '    {\n' +
    '      "Effect": "Allow",\n' +
    '      "Action": "*",\n' +
    '      "Resource": "*"\n' +
    '    }\n' +
    '  ]\n' +
    '}\n\n' +
    'Read it the way you would read a firewall rule that allows anything from anywhere: EFFECT is the ' +
    'verdict, ACTION is what the identity may do, and RESOURCE is what it may do it to. This policy ' +
    'grants every action against every resource, which is sometimes written deliberately for a ' +
    'break-glass account and far more often left behind by somebody who could not get a narrower ' +
    'policy working before a deadline and meant to come back to it.',
} as const;

const BUCKET_TEACH = {
  concept:
    'Object storage is the single most consistently breached class of cloud resource, and the reason ' +
    'is not exotic. A bucket needs to be readable by something outside the account almost as often as ' +
    'it needs to be private, a static website, a public dataset, a report shared with a client, and ' +
    'the setting that makes a bucket public is one checkbox or one policy statement away from the ' +
    'setting that keeps it private. Every provider has changed defaults and added warnings over the ' +
    'years precisely because this keeps happening.\n\n' +
    'One classic misconfiguration is worth being able to recognise on sight: a grant to ' +
    '"authenticated users". It sounds like it means people who have logged into our organisation, and ' +
    'it does not. On most providers it means any authenticated identity on the entire platform, which ' +
    'is to say anyone with an account on that cloud, a population in the hundreds of millions. A ' +
    'permission fragment granting read access to authenticated users looks, at a glance, like an ' +
    'internal control:\n\n' +
    '{\n' +
    '  "Grantee": "AuthenticatedUsers",\n' +
    '  "Permission": "READ"\n' +
    '}\n\n' +
    'and functions, in practice, as public.',
} as const;

const SG_NACL_TEACH = {
  concept:
    'A perimeter firewall protects a network by sitting at its one entrance. Cloud networking has no ' +
    'single entrance: a virtual network is built from many small boundaries attached to individual ' +
    'resources, and two of them look similar enough to be confused constantly, security groups and ' +
    'network access control lists.\n\n' +
    'A SECURITY GROUP is attached to an individual resource, such as a virtual machine, and it is ' +
    'STATEFUL: allow an inbound connection, and the matching return traffic is automatically permitted ' +
    'without a separate rule. A NETWORK ACCESS CONTROL LIST sits at the subnet boundary and is ' +
    'STATELESS: it evaluates inbound and outbound traffic as entirely separate rule sets, so an ' +
    'inbound allow rule does nothing for the return path, which needs its own outbound rule or the ' +
    'connection simply hangs.\n\n' +
    'Here is a security group rule table for a web server:\n\n' +
    'Type      Protocol  Port   Source\n' +
    'HTTPS     TCP       443    0.0.0.0/0\n' +
    'SSH       TCP       22     0.0.0.0/0\n' +
    'Custom    TCP       5432   10.0.1.0/24\n\n' +
    'Read it the way you would read a firewall rule: a source of 0.0.0.0/0 means from anywhere on the ' +
    'internet, and a narrower source such as 10.0.1.0/24 means only from that private range.',
} as const;

const CLOUDTRAIL_TEACH = {
  concept:
    'An activity log in the cloud, the pattern popularised by CloudTrail and matched by every other ' +
    'major provider under a different name, records the MANAGEMENT PLANE: every API call made ' +
    'against the account, who made it, from where, and what it targeted. Creating a user, changing a ' +
    'permission, launching or terminating an instance, reading account settings, all of it is a ' +
    'recorded event, whether it came from the console, a command line tool, or an automated script.\n\n' +
    'What it typically does not record by default is the DATA PLANE, the actual contents moving ' +
    'through a resource: the rows read from a database, the bytes served from a bucket. Data plane ' +
    'logging usually has to be turned on separately, per resource, and often carries its own cost, ' +
    'which is one reason it is frequently missing exactly where it would matter most.\n\n' +
    'Here is a short excerpt of the kind of event this log records, rendered in plain terms:\n\n' +
    '12:03:01  ListBuckets        user=svc-report      source=203.0.113.9\n' +
    '12:03:04  ListUsers          user=svc-report      source=203.0.113.9\n' +
    '12:03:11  CreateAccessKey    user=svc-report      source=203.0.113.9  target=admin-role\n' +
    '12:03:19  AttachRolePolicy   user=svc-report      source=203.0.113.9  target=admin-role  policy=AdministratorAccess\n\n' +
    'Read it left to right: a timestamp, the action, who performed it, where the request came from, ' +
    'and what it targeted.',
} as const;

const SECRETS_TEACH = {
  concept:
    'A hardcoded credential, a database password or an API key typed directly into source code or a ' +
    'configuration file, is one of the most consistently recurring causes of real breaches, and it ' +
    'keeps recurring for a boring reason: it is the fastest way to make something work during ' +
    'development, and removing it afterward requires a step nobody is forced to take.\n\n' +
    'Here is the pattern in its most common shape:\n\n' +
    'DATABASE_HOST = "db.internal.example"\n' +
    'DATABASE_USER = "app"\n' +
    'DATABASE_PASSWORD = "Summer2024!"\n\n' +
    'sitting in a file that then gets committed to a source repository, baked into a container image, ' +
    'or copied onto a test machine used by somebody else on the team. Once it exists in any of those ' +
    'places, it has effectively left your control: a repository keeps history that a later deletion ' +
    'does not erase, an image can be pulled by anyone with registry access, and a copy sitting on ' +
    'another machine now depends on the security posture of that machine, not yours.',
} as const;

const IAC_TEACH = {
  concept:
    'Infrastructure as code means the shape of a cloud environment, the networks, the permissions, ' +
    'the resources, is written as a file rather than clicked together by hand, and that file is ' +
    'version controlled and reused the way application code is. The advantage is consistency: the ' +
    'same definition can build a hundred identical environments. That advantage has a matching cost: ' +
    'a single mistake in the definition is reproduced everywhere it is used, at the moment it is used, ' +
    'rather than staying confined to one resource a human happened to misclick.\n\n' +
    'Here is a short fragment defining a security group:\n\n' +
    'resource "security_group" "app" {\n' +
    '  ingress {\n' +
    '    from_port   = 22\n' +
    '    to_port     = 22\n' +
    '    protocol    = "tcp"\n' +
    '    cidr_blocks = ["0.0.0.0/0"]\n' +
    '  }\n' +
    '}\n\n' +
    'If this module is reused to stand up fifty application servers, all fifty inherit an SSH rule ' +
    'open to the entire internet the moment they are created, with no separate review step for any of ' +
    'them.',
} as const;

const EPHEMERAL_TEACH = {
  concept:
    'On-premises incident response assumes the evidence holds still: a physical server keeps running, ' +
    'or at worst gets powered off, and either way it is still there to examine tomorrow. Cloud ' +
    'infrastructure breaks that assumption directly. An autoscaling group can terminate an instance ' +
    'the moment load drops, a container can be replaced by an orchestrator the moment a health check ' +
    'fails, and a serverless function has no persistent instance to examine at all between ' +
    'invocations. By the time an alert is triaged and an investigator opens a ticket, the exact ' +
    'machine involved may no longer exist anywhere.\n\n' +
    'This changes the order of operations rather than the underlying goals of incident response. The ' +
    'evidence has to be preserved before the infrastructure has a chance to disappear on its own, ' +
    'which usually means taking a SNAPSHOT of the storage volume and capturing relevant logs ' +
    'immediately, rather than after a decision to terminate has already been made. Only once that ' +
    'evidence is secured does it become safe to let the resource go, whether that means letting an ' +
    'orchestrator replace it or terminating it directly.',
} as const;

// --- Module csf.1: the shared responsibility model ---------------------------

const MODULE_CSF_1: Exercise[] = [
  {
    id: 'csf.1.1',
    moduleId: 'csf.1',
    packageId: 'cloud-security-foundations',
    order: 1,
    title: 'Whose job is it on a rented virtual machine',
    kind: 'multiple-choice',
    goal: 'Place customer responsibilities correctly on an infrastructure-as-a-service virtual machine.',
    prompt:
      'You run a fleet of virtual machines on a cloud infrastructure-as-a-service offering. Which of ' +
      'the following are your responsibility rather than the responsibility of the provider? Select ' +
      'all that apply.',
    teach: RESPONSIBILITY_TEACH,
    options: [
      { id: 'a', label: 'Configuring identity and access rules for the workloads you run, in every service model.' },
      { id: 'b', label: 'Patching the guest operating system on a virtual machine you rent, since the provider does not reach inside it.' },
      { id: 'c', label: 'Deciding what data gets encrypted and how, and configuring that encryption.' },
      { id: 'd', label: 'Writing and securing the application code that runs on top of the machine.' },
      { id: 'e', label: 'Patching the guest operating system automatically, because it is infrastructure the provider owns.' },
    ],
    hints: [
      'Four are your responsibility on infrastructure-as-a-service. One assumes the provider reaches inside your virtual machine, which the model does not allow.',
      'Ask which layer the provider stops at for infrastructure-as-a-service: the hypervisor, or everything above it.',
      'If the provider patched your guest operating system without asking, they would also be able to see everything running on it.',
    ],
    solution:
      'A, B, C, and D. On infrastructure-as-a-service, the provider stops at the hypervisor: ' +
      'everything from the guest operating system upward, identity, encryption choices, and ' +
      'application code, belongs to you. E describes a level of reach the provider does not have and, ' +
      'for most customers, would not want: patching inside your virtual machine without your ' +
      'involvement means being inside your workload, which breaks the isolation the whole model ' +
      'depends on.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option gives the provider reach inside your virtual machine that infrastructure-as-a-service does not grant them.',
      },
    ],
    debrief:
      'This is the version of the shared responsibility model most people learn first, because a ' +
      'virtual machine looks the most like a server they already know how to secure. The harder ' +
      'version comes when the service stops looking like a server at all.',
    practice: [],
  },
  {
    id: 'csf.1.2',
    moduleId: 'csf.1',
    packageId: 'cloud-security-foundations',
    order: 2,
    title: 'The line moves as the provider does more',
    kind: 'multiple-choice',
    goal: 'Track how responsibility shifts across infrastructure, platform, and software as a service.',
    prompt:
      'Which of the following accurately describe how responsibility shifts as you move from ' +
      'infrastructure-as-a-service toward software-as-a-service? Select all that apply.',
    teach: {
      concept:
        'As a provider takes over more of the stack, the boundary does not vanish, it moves and ' +
        'narrows. A platform-as-a-service database is a good example: the provider now patches the ' +
        'engine, handles clustering, and takes the backups, so an entire category of your old work ' +
        'disappears. What remains is smaller but does not shrink to nothing: who can connect, what ' +
        'they can do once connected, and how the data inside is classified and protected are still ' +
        'choices only you can make, because only you know what the data is and who should see it.\n\n' +
        'Software-as-a-service pushes the line highest of all, and this is where the boundary gets ' +
        'misread most often. A finished email or CRM platform looks complete, and it is tempting to ' +
        'conclude that security is now entirely a matter for the vendor. It is not. Account takeover, ' +
        'an over-shared document, a departing employee whose access was never removed: none of these ' +
        'are platform failures, they are configuration and governance failures that happen to run on ' +
        'a platform somebody else built.',
    },
    options: [
      { id: 'a', label: 'In platform-as-a-service, the provider manages the runtime and engine patching, but you still choose who can access the service and how the data inside it is protected.' },
      { id: 'b', label: 'Moving from infrastructure toward software as a service reduces platform maintenance work but does not remove the need for access governance.' },
      { id: 'c', label: 'A function running on a serverless platform still carries permissions that only the customer configures, even though there is no server to patch.' },
      { id: 'd', label: 'Whichever service model you use, misconfiguring who can access a resource is a decision only the customer can make.' },
      { id: 'e', label: 'In software-as-a-service, the vendor operates the whole application, so the customer no longer owns any security decisions about how it is used.' },
    ],
    hints: [
      'Four are accurate. One assumes a finished application means a finished set of decisions.',
      'Ask who removes the access of a departing employee from a SaaS platform: is that a responsibility of the vendor, or of you.',
      'Account takeover and over-sharing happen constantly on SaaS platforms with excellent platform security. Something else is failing there.',
    ],
    solution:
      'A, B, C, and D. Each layer the provider takes over removes operational burden, patching, ' +
      'clustering, orchestration, without removing the decisions that depend on knowing your own data ' +
      'and your own people. E is the belief that causes most SaaS incidents: the platform can be ' +
      'flawless and the breach can still happen, because account access, sharing settings, and ' +
      'offboarding are configuration choices that live entirely on the customer side of the line.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes a finished application means a finished set of security decisions, which is the mistake behind most SaaS breaches.',
      },
    ],
    debrief:
      'Keep this exercise in mind every time a vendor advertises being fully managed. Managed ' +
      'describes the infrastructure. It rarely describes your identity, sharing, and data decisions.',
    practice: [],
  },
  {
    id: 'csf.1.3',
    moduleId: 'csf.1',
    packageId: 'cloud-security-foundations',
    order: 3,
    title: 'A public bucket is not a platform failure',
    kind: 'multiple-choice',
    goal: 'Assign accountability correctly for a customer-side misconfiguration.',
    prompt:
      'A storage bucket holding customer records was left readable by anyone on the internet and was ' +
      'scraped by a researcher. Which of the following are accurate about where the accountability ' +
      'lies? Select all that apply.',
    teach: {
      concept:
        'This is the shared responsibility model applied to the incident that happens most often in ' +
        'real cloud breach reporting. The infrastructure worked exactly as designed: the provider ' +
        'offered a setting, the customer chose it, and the setting did what it said it would do. ' +
        'Nothing failed at the platform layer.\n\n' +
        'The instinct to blame the platform is understandable and almost always wrong. A provider ' +
        'that made it impossible to ever create a public bucket would also break every legitimate use ' +
        'of one, static websites, public downloads, open datasets, so the capability has to exist. ' +
        'What the provider owes you is a sane default and clear warnings, which most providers now ' +
        'give. What it cannot owe you is the decision itself.',
    },
    options: [
      { id: 'a', label: 'The bucket was left public by a configuration choice made on the customer side of the boundary.' },
      { id: 'b', label: 'The provider offering the capability to make a bucket public does not make the resulting exposure a provider fault.' },
      { id: 'c', label: 'The uptime and platform security of the provider were not the cause here, an access control decision was.' },
      { id: 'd', label: 'This sits entirely inside security IN the cloud, the half of the model that belongs to the customer.' },
      { id: 'e', label: 'A provider is expected to prevent every dangerous configuration a customer could choose, so this is ultimately a platform failure.' },
    ],
    hints: [
      'Four are accurate. One expects the provider to prevent a choice that legitimate customers also need to be able to make.',
      'Think about who would be upset if a provider made public buckets impossible to create at all.',
      'The setting did exactly what it said it would do. Where does that put the fault.',
    ],
    solution:
      'A, B, C, and D. The infrastructure behaved correctly, and the exposure lives entirely on the ' +
      'configuration side of the line. E asks the provider to remove a capability that legitimate use ' +
      'depends on, static hosting, open datasets, public downloads, and blaming the platform for a ' +
      'customer decision is the reasoning that lets the actual cause, an access control choice nobody ' +
      'reviewed, go unaddressed.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option expects the provider to prevent a capability that legitimate customers also rely on.',
      },
    ],
    debrief:
      'You will read a version of this incident in almost every breach report you ever review in this ' +
      'field. The pattern is always the same: a working setting, chosen wrong, left unreviewed.',
    practice: [],
  },
  {
    id: 'csf.1.4',
    moduleId: 'csf.1',
    packageId: 'cloud-security-foundations',
    order: 4,
    title: 'Serverless does not mean security-less',
    kind: 'multiple-choice',
    goal: 'Recognise which security decisions remain when there is no server to patch.',
    prompt:
      'You are moving a workload onto a function-as-a-service platform, where the provider runs the ' +
      'code on infrastructure you never see. Which of the following are accurate? Select all that ' +
      'apply.',
    teach: {
      concept:
        'Removing the server removes an entire category of work, patch cycles, capacity planning, ' +
        'operating system hardening, and it is tempting to assume the remaining work shrank by the ' +
        'same proportion. It did not. It concentrated. What is left is almost entirely identity and ' +
        'code: the permissions the function runs with, and what the code inside it actually does with ' +
        'data it can reach.\n\n' +
        'The permissions question is the one that gets missed. A function needs to read from one ' +
        'queue and write to one table, and it is common practice, and a real mistake, to attach a ' +
        'broad role because writing a narrow one takes longer. That role travels with the function for ' +
        'its entire life. If the code is ever compromised, through a dependency, an injection, or a ' +
        'bad input, an attacker inherits exactly the permissions attached to it, not the permissions ' +
        'the function actually needed.',
    },
    options: [
      { id: 'a', label: 'A managed database engine is patched by the provider, but who can query it and how backups are protected remain decisions for the customer.' },
      { id: 'b', label: 'The image or code you deploy on a container or serverless platform, and the permissions it runs with, remain a customer responsibility.' },
      { id: 'c', label: 'Attaching an overly broad execution role to a function is a customer misconfiguration, not a weakness of the platform.' },
      { id: 'd', label: 'The less infrastructure you manage directly, the more the remaining security work concentrates into identity and data decisions rather than disappearing.' },
      { id: 'e', label: 'A function-as-a-service platform removes the need to think about permissions, because every function is sandboxed identically.' },
    ],
    hints: [
      'Four are accurate. One assumes sandboxing replaces the need to scope permissions.',
      'A sandbox limits what a function can do to the platform. It does not limit what the role attached to it lets it do to your other resources.',
      'If the code inside a function were compromised, what would it be able to reach.',
    ],
    solution:
      'A, B, C, and D. Patching disappears, but access, code, and the permissions attached to that ' +
      'code do not, they become almost the entire job. E confuses sandboxing, which isolates a ' +
      'function from the platform and from other tenants, with scoping, which limits what the ' +
      'function permissions allow it to do to your own resources. Sandboxing does not touch that ' +
      'second problem at all.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats platform sandboxing as if it replaced the need to scope the permissions attached to a function.',
      },
    ],
    debrief:
      'Hold onto this distinction, sandboxing versus scoping. It reappears under a different name in ' +
      'the next module, and it is the single idea most over-permissioned cloud accounts are missing.',
    practice: [],
  },
  {
    id: 'csf.1.5',
    moduleId: 'csf.1',
    packageId: 'cloud-security-foundations',
    order: 5,
    title: 'Explain what moving to the cloud did not remove',
    kind: 'short-answer',
    goal: 'Put the shared responsibility model into words that correct a common misreading.',
    prompt:
      'A manager says: "We moved everything to the cloud, so security is now largely a problem for ' +
      'the provider." In three or four sentences, explain what this misses.',
    teach: {
      concept:
        'This sentence is worth being able to correct cleanly, because a version of it will be said ' +
        'to you by somebody with budget authority. The provider genuinely does take over a great deal, ' +
        'physical security, the hypervisor, and depending on the service, patching and platform ' +
        'operation. None of that is in dispute.\n\n' +
        'What it does not take over is anything that depends on knowing your own data and your own ' +
        'people: who has an account, what they can reach, how data is classified, and whether access ' +
        'is removed when somebody leaves. Nearly every publicly reported cloud breach traces back to ' +
        'that second list, not the first, which is the fact a good answer should lead with rather than ' +
        'bury.',
    },
    hints: [
      'Name what genuinely did move to the provider before you correct the rest, or the answer reads as a denial rather than a correction.',
      'Say what stays on the customer side regardless of service model: identity, access, and data decisions.',
      'A strong answer also says why this matters: most real cloud breaches trace to the half that did not move.',
    ],
    solution:
      'The provider does take over real work: physical security, the hypervisor, and depending on the ' +
      'service, patching and platform operation. What did not move is identity, access, and data: who ' +
      'has an account, what they can reach, how data is classified, and whether access is revoked when ' +
      'somebody leaves, and those decisions can only be made by the customer, because only the ' +
      'customer knows what the data is and who should see it. That second half is also where nearly ' +
      'every publicly reported cloud breach actually starts, so treating the move as a transfer of ' +
      'responsibility rather than a redrawing of it leaves the highest-risk half unowned.',
    expectedOutput:
      'An answer naming what genuinely moved to the provider, what stays with the customer regardless ' +
      'of service model, and why the customer half is the higher-risk one.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['provider', 'physical', 'hypervisor', 'patch', 'platform', 'infrastructure'],
          ['identity', 'access', 'data', 'who has an account', 'permissions', 'offboard', 'revoke'],
          ['most breaches', 'misconfiguration', 'higher risk', 'still your responsibility', 'does not disappear', 'redraw'],
        ],
        hint: 'Three ideas: what genuinely moved to the provider, what stays with the customer, and why the customer half is the one that actually causes breaches.',
      },
    ],
    debrief:
      'You will give a version of this answer many times in this career, usually to somebody who ' +
      'controls whether your project gets funded. Lead with what genuinely changed before you correct ' +
      'what did not; it reads as agreement rather than argument.',
    practice: [],
  },
];

// --- Module csf.2: cloud IAM and least privilege -----------------------------

const MODULE_CSF_2: Exercise[] = [
  {
    id: 'csf.2.1',
    moduleId: 'csf.2',
    packageId: 'cloud-security-foundations',
    order: 1,
    title: 'IAM as the new perimeter',
    kind: 'multiple-choice',
    goal: 'Understand why identity, not the network, is the primary boundary in a cloud environment.',
    prompt:
      'Which of the following are accurate about identity and access management as the primary ' +
      'boundary in a cloud environment? Select all that apply.',
    teach: IAM_POLICY_TEACH,
    options: [
      { id: 'a', label: 'A misconfigured IAM policy can expose a resource to the entire internet just as completely as a misconfigured firewall rule.' },
      { id: 'b', label: 'Because every cloud API call is authenticated and authorised individually, there is no single network location a defender can rely on the way a perimeter firewall did.' },
      { id: 'c', label: 'A wildcard policy granting every action against every resource is sometimes left behind by an identity created to solve one problem quickly.' },
      { id: 'd', label: 'Reviewing what identities are allowed to do matters at least as much in the cloud as reviewing what network traffic is allowed through.' },
      { id: 'e', label: 'As long as a resource has no public network exposure, its IAM permissions matter less.' },
    ],
    hints: [
      'Four are accurate. One assumes a private network position protects you the way it did on-premises.',
      'A stolen API credential does not need to be on your network to act. It calls the API directly.',
      'Network exposure and IAM exposure are different attack surfaces, and cloud APIs make the second one reachable from anywhere regardless of the first.',
    ],
    solution:
      'A, B, C, and D. Identity is the control that decides what happens next once a request is ' +
      'authenticated, and the API plane is reachable from anywhere regardless of network placement, ' +
      'which is exactly why IAM does the job a perimeter used to do. E repeats the on-premises ' +
      'assumption that network position is protection: a credential with excessive permissions can be ' +
      'used against the cloud API from anywhere on the internet, with no need to ever touch the ' +
      'private network the resource sits on.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes network isolation substitutes for reviewing what an identity is permitted to do.',
      },
    ],
    debrief:
      'Every module after this one comes back to this idea. A network diagram will tell you what can ' +
      'reach what. It will not tell you what a compromised identity is allowed to do once it is there.',
    practice: [],
  },
  {
    id: 'csf.2.2',
    moduleId: 'csf.2',
    packageId: 'cloud-security-foundations',
    order: 2,
    title: 'Read the policy the way an auditor would',
    kind: 'multiple-choice',
    goal: 'Judge whether a policy is over-permissioned by reading what it grants, not what is currently used.',
    prompt:
      'A developer attached the wildcard policy shown above to a service that only needs to read from ' +
      'one specific queue. Which of the following are accurate judgements about it? Select all that ' +
      'apply.',
    teach: IAM_POLICY_TEACH,
    options: [
      { id: 'a', label: 'The Action field of "*" grants every action the identity model supports, not only the ones this service uses.' },
      { id: 'b', label: 'The Resource field of "*" extends that grant to every resource in the account, not only the one queue the service reads from.' },
      { id: 'c', label: 'A policy this broad would let the identity delete unrelated resources, change other permissions, or read unrelated data if the credentials were ever misused.' },
      { id: 'd', label: 'The fix is not to remove the policy outright, it is to replace it with one scoped to the one action and the one resource the service actually needs.' },
      { id: 'e', label: 'Because the service currently only reads from the queue, the breadth of the policy does not matter in practice.' },
    ],
    hints: [
      'Four are accurate. One judges the policy by what the service currently does rather than by what the policy allows.',
      'A policy is a ceiling, not a description of current behaviour. What matters is the ceiling.',
      'If the credentials for this service were ever leaked, what could an attacker do that the developer never intended.',
    ],
    solution:
      'A, B, C, and D. The policy has to be read as a ceiling on what the identity is allowed to do, ' +
      'and this ceiling is the entire account. E judges the policy by the behaviour of the service ' +
      'today, but a policy outlives the code that was true when it was written, and the risk it ' +
      'carries is what happens when the credentials end up somewhere they should not, not what the ' +
      'service happens to call this week.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option judges the policy by current behaviour rather than by the ceiling it actually grants.',
      },
    ],
    debrief:
      'This is the exercise to repeat on every policy review you ever do: read the grant, not the ' +
      'intent, because the grant is what travels with the credentials if they are ever misused.',
    practice: [],
  },
  {
    id: 'csf.2.3',
    moduleId: 'csf.2',
    packageId: 'cloud-security-foundations',
    order: 3,
    title: 'Identity-based or resource-based',
    kind: 'multiple-choice',
    goal: 'Distinguish identity-based policies from resource-based policies.',
    prompt:
      'Which of the following are accurate about identity-based and resource-based policies? Select ' +
      'all that apply.',
    teach: {
      concept:
        'A policy can be attached to either side of a request, and the two shapes answer different ' +
        'questions. An IDENTITY-BASED policy is attached to a user, a group, or a role, and it answers ' +
        'the question "what is this identity allowed to do". A RESOURCE-BASED policy is attached to ' +
        'the resource itself, a storage bucket or a queue, and it answers the question "who is allowed ' +
        'to act on this specific thing, including identities from outside this account".\n\n' +
        'The distinction matters most at the point where access crosses an account boundary. Granting ' +
        'another organisation access to your data usually means writing a resource-based policy that ' +
        'names them, because you have no identity to attach a policy to on their side. It also means a ' +
        'resource can end up reachable through a grant nobody remembered to review, because the access ' +
        'lives on the resource rather than on any of the identities anyone routinely audits.',
    },
    options: [
      { id: 'a', label: 'An identity-based policy is attached to a user, group, or role, and describes what that identity may do.' },
      { id: 'b', label: 'A resource-based policy is attached to a resource such as a bucket, and describes who may act on it, including identities outside the account.' },
      { id: 'c', label: 'Cross-account access is typically granted through a resource-based policy, because the granting account has no identity to attach a policy to on the other side.' },
      { id: 'd', label: 'A resource can carry an access grant that never appears in a review of the identities in your own account.' },
      { id: 'e', label: 'A resource can only ever be accessed by identities inside the same account as the resource, regardless of policy.' },
    ],
    hints: [
      'Four are accurate. One denies that cross-account access is possible at all.',
      'Ask what kind of policy would let an entirely separate organisation read from a bucket you own.',
      'If access is granted on the resource rather than on an identity, where would you have to look to find it.',
    ],
    solution:
      'A, B, C, and D. Identity-based policies describe what an identity may do, resource-based ' +
      'policies describe who may reach a specific resource, and the second kind is what makes ' +
      'cross-account sharing possible and also what makes it easy to forget, because it does not show ' +
      'up when you audit your own identities. E denies that cross-account access exists at all, which ' +
      'it plainly does, and it is exactly the gap that resource-based policies exist to fill and that ' +
      'reviewers most often miss.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option denies that a resource-based policy can grant access to an identity outside the account.',
      },
    ],
    debrief:
      'When you next review an account, check both sides: the identities and what they can do, and ' +
      'the resources and who they have been shared with. The second list is the one that tends to be ' +
      'stale.',
    practice: [],
  },
  {
    id: 'csf.2.4',
    moduleId: 'csf.2',
    packageId: 'cloud-security-foundations',
    order: 4,
    title: 'Long-lived keys versus a role you assume',
    kind: 'multiple-choice',
    goal: 'Apply least privilege to the lifetime of a credential, not only to its scope.',
    prompt:
      'Which of the following are sound practices for keeping credentials close to least privilege? ' +
      'Select all that apply.',
    teach: {
      concept:
        'Least privilege is the principle, and in practice it comes down to two habits more than any ' +
        'other. The first is scope: grant the narrowest action against the narrowest resource that the ' +
        'job requires, which is the fix from the previous exercise applied everywhere. The second is ' +
        'lifetime: prefer credentials that expire on their own over credentials that live forever.\n\n' +
        'A long-lived access key, generated once and stored in a configuration file, is a permanent ' +
        'liability: it works for anyone who obtains it until somebody notices and revokes it, which in ' +
        'a real breach is often months. A role that a workload assumes for a short session issues ' +
        'temporary credentials that expire on their own, usually within an hour, so a leaked credential ' +
        'from that path is only useful for a narrow window rather than indefinitely. Preferring ' +
        'assumed roles over long-lived keys is one of the few changes that reduces risk without costing ' +
        'the workload anything it needs.',
    },
    options: [
      { id: 'a', label: 'Temporary credentials issued by an assumed role expire on their own, which limits how long a leaked credential remains useful.' },
      { id: 'b', label: 'A long-lived access key stored in a configuration file remains valid until somebody notices and revokes it.' },
      { id: 'c', label: 'Scoping a grant to the narrowest action and resource needed is the same principle applied to permissions that lifetime limits apply to time.' },
      { id: 'd', label: 'Preferring short-lived, assumable roles over long-lived keys is a change that reduces risk without removing anything the workload needs.' },
      { id: 'e', label: 'A long-lived access key is safe as long as it is stored in a private configuration file rather than in public source code.' },
    ],
    hints: [
      'Four are accurate. One assumes privacy of storage is the same thing as safety of a permanent credential.',
      'Configuration files get copied into backups, shared between engineers, and sometimes committed by mistake regardless of where they started.',
      'What actually limits the damage of a leaked credential is not where it was stored, it is how long it remains valid.',
    ],
    solution:
      'A, B, C, and D. Scope limits what a credential can do, and lifetime limits how long it can do ' +
      'it, and both are least privilege applied to different dimensions of the same problem. E treats ' +
      'where a key was stored as a substitute for how long it remains valid, but a private ' +
      'configuration file is copied into backups, shared between engineers, and occasionally ' +
      'committed by accident far more often than anyone expects, and none of that is prevented by the ' +
      'key being private today.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats private storage as a substitute for a credential having a limited lifetime.',
      },
    ],
    debrief:
      'The next module is about exactly this file, the one holding a long-lived key, and what happens ' +
      'once it leaves the place it was supposed to stay.',
    practice: [],
  },
  {
    id: 'csf.2.5',
    moduleId: 'csf.2',
    packageId: 'cloud-security-foundations',
    order: 5,
    title: 'Rewrite the judgement, not just the policy',
    kind: 'short-answer',
    goal: 'Explain why a wildcard policy is dangerous even when nobody is currently misusing it.',
    prompt:
      'A colleague says: "The wildcard policy has been attached to this service for a year and ' +
      'nothing bad has happened, so it is fine to leave it." In three or four sentences, explain why ' +
      'that reasoning does not hold.',
    teach: {
      concept:
        'This is the argument you will hear defending almost every over-permissioned identity you ' +
        'ever find, and it sounds reasonable because it is describing something true: nothing bad has, ' +
        'in fact, happened yet. What it mistakes is the source of the risk. The policy is not risky ' +
        'because it is currently being misused, it is risky because of what becomes possible the ' +
        'moment the credentials are exposed, through a leaked key, a compromised dependency, or a ' +
        'phished engineer, and none of those events announce themselves in advance.\n\n' +
        'A good answer separates the two ideas explicitly: absence of an incident is not evidence of ' +
        'low risk, it is evidence that the moment of compromise has not happened yet, and the size of ' +
        'the blast radius when it does is exactly what the policy scope determines.',
    },
    hints: [
      'Absence of an incident and absence of risk are different claims. Say which one a year of quiet actually proves.',
      'Name what would have to happen for the wildcard policy to matter, even though it has not happened yet.',
      'A strong answer explains that the policy determines the blast radius of a future compromise, not the likelihood that one has already occurred.',
    ],
    solution:
      'A year without an incident shows that the credentials have not yet been misused, it does not ' +
      'show that the policy is safe, because the risk from a wildcard grant only becomes visible at ' +
      'the moment the credentials are exposed, through a leaked key, a compromised dependency, or a ' +
      'phished engineer, and that moment gives no warning. What the policy actually controls is the ' +
      'blast radius once that happens: a scoped policy limits an attacker to one queue, a wildcard ' +
      'policy hands them the account. The absence of an incident so far says nothing about which of ' +
      'those two outcomes you are currently exposed to.',
    expectedOutput:
      'An answer distinguishing absence of an incident from absence of risk, and naming that the ' +
      'policy scope determines the blast radius of a future compromise.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['no incident', 'nothing has happened', 'has not been misused', 'quiet so far'],
          ['exposed', 'leaked', 'compromised', 'phished', 'credentials stolen'],
          ['blast radius', 'scope', 'limits what', 'wildcard', 'ceiling', 'what an attacker could do'],
        ],
        hint: 'Three ideas: what a year of quiet actually shows, what event would make the policy matter, and what the policy scope actually controls.',
      },
    ],
    debrief:
      'Keep this argument ready. It is the single most common objection you will hear when you ' +
      'propose narrowing a permission, and it is wrong for the same reason every time.',
    practice: [],
  },
];

// --- Module csf.3: storage exposure -------------------------------------------

const MODULE_CSF_3: Exercise[] = [
  {
    id: 'csf.3.1',
    moduleId: 'csf.3',
    packageId: 'cloud-security-foundations',
    order: 1,
    title: 'What "authenticated users" actually means',
    kind: 'multiple-choice',
    goal: 'Recognise that a grant to authenticated users is far broader than it sounds.',
    prompt:
      'A bucket policy grants READ access to the group "authenticated users". Which of the following ' +
      'are accurate about what that grant actually does? Select all that apply.',
    teach: BUCKET_TEACH,
    options: [
      { id: 'a', label: 'On most providers, this group includes anyone holding an account on that cloud platform, not only people inside your organisation.' },
      { id: 'b', label: 'The name of the grant is easy to misread as internal, because it sounds like it refers to your own workforce.' },
      { id: 'c', label: 'In practice, a grant this broad functions as public read access, since obtaining an account on the platform is trivial.' },
      { id: 'd', label: 'This is a real, recurring pattern behind storage exposure incidents, not a hypothetical edge case.' },
      { id: 'e', label: 'This grant is safe as long as the bucket name is not published anywhere, since nobody would know to look for it.' },
    ],
    hints: [
      'Four are accurate. One relies on the bucket name staying secret, which is not a control.',
      'Bucket names get discovered through scanners, leaked source code, and DNS records, not only through being announced.',
      'Ask how many people could obtain an account on the platform this bucket sits on.',
    ],
    solution:
      'A, B, C, and D. The grant sounds internal and is not, and functions as public because the ' +
      'population who could satisfy it is enormous, which is exactly the pattern behind a large share ' +
      'of real storage exposure reports. E relies on the bucket name being secret, but names are ' +
      'routinely found by automated scanners, leaked in source code and error messages, or guessed ' +
      'from an organisation naming convention, so an unpublished name is not a control, it is a delay ' +
      'of unknown length.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats an unpublished bucket name as a substitute for an actual access control.',
      },
    ],
    debrief:
      'Whenever you review storage permissions, treat any grant naming "all users", "any ' +
      'authenticated user", or "public" the same way regardless of how internal the wording sounds. ' +
      'Read the grant, not the label.',
    practice: [],
  },
  {
    id: 'csf.3.2',
    moduleId: 'csf.3',
    packageId: 'cloud-security-foundations',
    order: 2,
    title: 'Why it keeps happening',
    kind: 'multiple-choice',
    goal: 'Recognise the organisational patterns behind recurring storage exposure.',
    prompt:
      'Warnings about public buckets have existed for years and the incidents have not stopped. Which ' +
      'of the following are genuine, recurring causes? Select all that apply.',
    teach: {
      concept:
        'Warnings about public buckets have existed for years and the incidents have not stopped, ' +
        'which tells you the cause is not ignorance, it is process. A handful of patterns explain most ' +
        'of it. Legacy defaults: buckets created years ago, before a provider tightened its default ' +
        'settings, keep whatever was default at creation time unless somebody goes back and changes ' +
        'it. Convenience during testing: a developer makes a bucket public to unblock a demo or a ' +
        'quick integration test and the setting outlives the reason for it. Orphaned resources: a ' +
        'bucket created for a project that ended has nobody left who considers it their responsibility ' +
        'to review. And third-party sharing: a grant added to give a partner or contractor access is ' +
        'scoped too broadly and never revisited once the engagement ends.',
    },
    options: [
      { id: 'a', label: 'A bucket created before a provider tightened its default settings can remain public simply because nobody went back and changed it.' },
      { id: 'b', label: 'A setting made public temporarily to unblock testing or a demo often outlives the reason it was set.' },
      { id: 'c', label: 'A bucket belonging to a project that has ended can go unreviewed because nobody currently considers it their responsibility.' },
      { id: 'd', label: 'A grant added for a partner or contractor is a common source of exposure when it is scoped too broadly or never revisited.' },
      { id: 'e', label: 'Since providers now warn clearly when a bucket is public, the practical rate of this misconfiguration has dropped to a rare occurrence.' },
    ],
    hints: [
      'Four are accurate causes. One assumes a warning is the same thing as a fix.',
      'A warning only helps the person who is currently looking at the console. An orphaned bucket has nobody looking.',
      'Ask whether the causes here are technical or organisational, and what a warning banner actually addresses.',
    ],
    solution:
      'A, B, C, and D. Legacy defaults, temporary settings that outlive their purpose, orphaned ' +
      'ownership, and overly broad third-party grants are the recurring, documented causes. E assumes ' +
      'a console warning fixes an organisational problem: a warning only reaches somebody who is ' +
      'actively looking at the setting, and every cause on this list involves nobody looking, which is ' +
      'exactly why the rate of this misconfiguration has not meaningfully dropped despite years of ' +
      'warnings.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes a warning banner solves a problem that is actually about nobody reviewing the setting at all.',
      },
    ],
    debrief:
      'Notice that none of these four causes is a technical failure. They are all a review that never ' +
      'happened. That is why continuous scanning of storage settings, not one-off warnings, is the ' +
      'standard answer.',
    practice: [],
  },
  {
    id: 'csf.3.3',
    moduleId: 'csf.3',
    packageId: 'cloud-security-foundations',
    order: 3,
    title: 'Reading a bucket policy fragment',
    kind: 'multiple-choice',
    goal: 'Judge an unauthenticated read grant on its own terms.',
    prompt:
      'A bucket policy contains the following statement:\n\n' +
      '{\n' +
      '  "Effect": "Allow",\n' +
      '  "Principal": "*",\n' +
      '  "Action": "s3:GetObject",\n' +
      '  "Resource": "arn:aws:s3:::example-reports/*"\n' +
      '}\n\n' +
      'Which of the following are accurate about this statement? Select all that apply.',
    teach: {
      concept:
        'A Principal of "*" is broader again than a grant to authenticated users: it means literally ' +
        'anyone, with no account of any kind required, since the check for who is asking has been ' +
        'removed entirely rather than merely widened. Paired with an Action of GetObject, it means ' +
        'anyone on the internet can download any object under the given path with no authentication ' +
        'step at all.\n\n' +
        'This exact shape is legitimate for one thing: hosting genuinely public content, a static ' +
        'website, a public dataset meant to be downloaded by anyone. It is a misconfiguration for ' +
        'anything else, and the policy itself gives no indication which case you are looking at. That ' +
        'judgement has to come from knowing what is actually stored at that path.',
    },
    options: [
      { id: 'a', label: 'Principal of "*" means the request does not need to come from any authenticated identity at all.' },
      { id: 'b', label: 'This statement allows anyone on the internet to download any object under the given path.' },
      { id: 'c', label: 'This exact shape is the correct configuration for content that is genuinely meant to be public, such as static website assets.' },
      { id: 'd', label: 'Whether this statement is a misconfiguration depends on what is actually stored at that path, which the policy itself does not say.' },
      { id: 'e', label: 'This statement is safe regardless of content, because GetObject only allows reading, not writing or deleting.' },
    ],
    hints: [
      'Four are accurate. One assumes read-only access cannot itself be the breach.',
      'If the objects under that path were customer records rather than website assets, would read-only access still feel safe.',
      'The action being GetObject limits what an attacker can do to the object. It says nothing about what reading it exposes.',
    ],
    solution:
      'A, B, C, and D. Principal "*" removes any authentication requirement, the statement grants ' +
      'unauthenticated download of anything under the path, and this is the correct pattern only for ' +
      'content that is meant to be public, which the statement itself never states one way or the ' +
      'other. E treats read-only as inherently safe, but exposure of confidential data is a complete ' +
      'breach on its own: nobody needed to write or delete anything for customer records read this way ' +
      'to already be gone.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes read-only access cannot itself be the exposure, which ignores what unauthenticated reading actually costs when the content is sensitive.',
      },
    ],
    debrief:
      'Notice that the fix here is never in the policy syntax, which is doing exactly what it says. It ' +
      'is in knowing what sits at the path, which is a question only someone who understands the data ' +
      'can answer.',
    practice: [],
  },
  {
    id: 'csf.3.4',
    moduleId: 'csf.3',
    packageId: 'cloud-security-foundations',
    order: 4,
    title: 'Fixing the exposure without breaking the legitimate use',
    kind: 'multiple-choice',
    goal: 'Choose sound remediation steps for an over-broad storage grant.',
    prompt:
      'You found the bucket from the earlier exercise, granting read access to authenticated users, ' +
      'and you need to fix it without breaking the one legitimate integration that uses it. Which of ' +
      'the following are sound steps? Select all that apply.',
    teach: BUCKET_TEACH,
    options: [
      { id: 'a', label: 'Identify exactly which identity or service the legitimate integration uses, and grant that identity access specifically rather than the whole authenticated-users group.' },
      { id: 'b', label: 'Enable the account-level or bucket-level setting that blocks public access, if the bucket is not meant to be public at all.' },
      { id: 'c', label: 'Check whether removing the broad grant breaks the integration before removing it, rather than after.' },
      { id: 'd', label: 'Review whether the same broad grant pattern exists on other buckets in the account, since a habit that produced one is likely to have produced more.' },
      { id: 'e', label: 'Delete the bucket entirely, since any bucket that was ever misconfigured cannot be trusted going forward.' },
    ],
    hints: [
      'Four are sound. One responds to a fixable configuration problem with an irreversible action.',
      'Ask what the actual goal is here: removing the grant, or removing the whole bucket.',
      'If one bucket had this pattern, what does that suggest about how buckets get created in this account.',
    ],
    solution:
      'A, B, C, and D. The fix is to scope the grant to the identity that actually needs it, close ' +
      'public access where none is intended, verify the fix against the real integration before and ' +
      'not after, and check for the same pattern elsewhere, because a habit rarely produces exactly ' +
      'one instance. E responds to a fixable misconfiguration with data destruction, which fixes ' +
      'nothing about the underlying process and destroys whatever legitimate content or history the ' +
      'bucket held.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option destroys the resource entirely instead of correcting the specific grant that was wrong.',
      },
    ],
    debrief:
      'The habit worth building here is the fourth option: one misconfigured bucket is a finding, the ' +
      'same pattern on ten buckets is a process problem, and only one of those two gets fixed by ' +
      'closing the first bucket.',
    practice: [],
  },
  {
    id: 'csf.3.5',
    moduleId: 'csf.3',
    packageId: 'cloud-security-foundations',
    order: 5,
    title: 'Explain the misconception in your own words',
    kind: 'short-answer',
    goal: 'Correct the "authenticated users" misreading in a short, precise answer.',
    prompt:
      'A colleague sees a bucket grant to "authenticated users" and says: "That is fine, it just means ' +
      'people who are logged in." In three or four sentences, correct them.',
    teach: {
      concept:
        'This correction comes up constantly because the phrase reads naturally as internal, logged ' +
        'into our systems, and the actual scope, anyone with an account anywhere on the platform, ' +
        'requires knowing a fact about the specific provider that is not visible in the words ' +
        'themselves.\n\n' +
        'A strong correction states the actual scope plainly, says why it is easy to misread, and says ' +
        'what it functions as in practice, which is effectively public given how easy an account on a ' +
        'major cloud platform is to obtain.',
    },
    hints: [
      'State plainly what "authenticated" actually refers to on most providers: an account anywhere on the platform, not inside your organisation.',
      'Say why the phrase is easy to misread, since that is most of why this keeps happening.',
      'Say what the grant functions as in practice, given how easy an account on the platform is to obtain.',
    ],
    solution:
      'Authenticated does not mean logged into our organisation, on most providers it means holding ' +
      'any account on that cloud platform at all, a population of hundreds of millions of unrelated ' +
      'accounts. The phrase is easy to misread because it sounds like it is describing our own ' +
      'workforce, which is exactly why this grant keeps appearing in breach reports rather than being ' +
      'caught in review. In practice, because an account on a major platform is trivial to obtain, ' +
      'this grant functions as public read access, not as an internal control, and should be treated ' +
      'and reviewed the same way a public grant would be.',
    expectedOutput:
      'An answer stating the actual scope of the grant, why it is easy to misread, and that it ' +
      'functions as public in practice.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['any account', 'anyone on the platform', 'not your organisation', 'not internal'],
          ['sounds internal', 'easy to misread', 'reads as', 'looks like'],
          ['functions as public', 'effectively public', 'trivial to obtain', 'same as public'],
        ],
        hint: 'Three ideas: what the grant actually covers, why the wording misleads, and what it amounts to in practice.',
      },
    ],
    debrief:
      'You will correct this exact misconception more than once in a real review. Having a clean ' +
      'three-sentence version ready is worth more than it sounds.',
    practice: [],
  },
];

// --- Module csf.4: network boundaries in the cloud ----------------------------

const MODULE_CSF_4: Exercise[] = [
  {
    id: 'csf.4.1',
    moduleId: 'csf.4',
    packageId: 'cloud-security-foundations',
    order: 1,
    title: 'Stateful or stateless, and why it matters',
    kind: 'multiple-choice',
    goal: 'Distinguish a stateful security group from a stateless network access control list.',
    prompt:
      'Which of the following are accurate about security groups and network access control lists? ' +
      'Select all that apply.',
    teach: SG_NACL_TEACH,
    options: [
      { id: 'a', label: 'A security group is stateful, so an allowed inbound connection automatically permits its return traffic.' },
      { id: 'b', label: 'A network access control list is stateless, so inbound and outbound traffic must each be explicitly allowed.' },
      { id: 'c', label: 'A security group is attached to an individual resource, while a network access control list applies at the subnet boundary.' },
      { id: 'd', label: 'Forgetting the outbound rule on a stateless network access control list can silently break a connection that the inbound rule appears to allow.' },
      { id: 'e', label: 'Because both controls filter traffic by port and source, a network access control list makes a security group on the same resource redundant.' },
    ],
    hints: [
      'Four are accurate. One assumes two controls that overlap in what they filter must be redundant.',
      'Ask what happens to a connection if the inbound rule allows it but nothing in either control explicitly allows the reply.',
      'The two controls sit at different layers, resource and subnet, and a real design commonly uses both together rather than either alone.',
    ],
    solution:
      'A, B, C, and D. A security group tracks connection state so the return path is implicit, a ' +
      'network access control list does not and needs both directions defined explicitly, and the two ' +
      'operate at different layers, resource versus subnet. E assumes overlapping filtering makes one ' +
      'control redundant, but defence in depth is exactly the reason both exist together: a mistake in ' +
      'one layer, an overly broad security group rule, say, can still be caught by a tighter rule at ' +
      'the subnet level.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats two controls at different layers as redundant simply because they filter similar attributes.',
      },
    ],
    debrief:
      'The stateful and stateless distinction is the one people arriving from on-premises firewalls ' +
      'get backwards most often, because most perimeter firewalls they have configured were stateful ' +
      'by default.',
    practice: [],
  },
  {
    id: 'csf.4.2',
    moduleId: 'csf.4',
    packageId: 'cloud-security-foundations',
    order: 2,
    title: 'A different mental model, not just different terms',
    kind: 'multiple-choice',
    goal: 'Recognise that a cloud network has no trusted inside the way a traditional perimeter did.',
    prompt:
      'Which of the following are accurate about the mental model needed for cloud network security, ' +
      'compared with a traditional perimeter design? Select all that apply.',
    teach: {
      concept:
        'It is tempting to treat a security group as simply a cloud word for a firewall rule, and the ' +
        'mapping holds well enough to get started, then breaks in a way that causes real incidents. A ' +
        'perimeter firewall assumes a trusted inside and an untrusted outside, and its job is to ' +
        'police the one boundary between them. Cloud networking has no inside in that sense: every ' +
        'resource with a public address is directly reachable from the internet the moment its own ' +
        'rules allow it, regardless of what network it notionally sits inside.\n\n' +
        'The practical consequence is that a single overly broad rule on one resource is not mitigated ' +
        'by anything upstream, because there is no upstream choke point left to catch it. Segmentation ' +
        'in the cloud is achieved by many small boundaries working together, security groups, network ' +
        'access control lists, subnet design, rather than by one large boundary at the edge of a ' +
        'trusted zone.',
    },
    options: [
      { id: 'a', label: 'A cloud network has no single trusted inside in the way a traditional perimeter design assumed.' },
      { id: 'b', label: 'A resource with a public address is directly reachable from the internet as soon as its own rules allow it, regardless of what network it is notionally part of.' },
      { id: 'c', label: 'An overly broad rule on one resource is not automatically caught by an upstream choke point, because there usually is not one.' },
      { id: 'd', label: 'Cloud segmentation comes from many small boundaries working together rather than one large boundary at the edge.' },
      { id: 'e', label: 'As long as a resource sits in a subnet labelled private, it cannot be reached from the internet regardless of its own rules.' },
    ],
    hints: [
      'Four are accurate. One treats a subnet label as if it were an enforced control.',
      'A label such as private describes an intention. Ask what actually enforces that intention.',
      'If a resource in a "private" subnet were given a public address and an open rule, would the label stop anything.',
    ],
    solution:
      'A, B, C, and D. There is no single trusted inside, a public address plus permissive rules is ' +
      'directly reachable regardless of naming, an overly broad rule has no upstream backstop by ' +
      'default, and segmentation is achieved through many small boundaries rather than one edge. E ' +
      'treats a subnet name as an enforced control, but private is a label a human chose, and the ' +
      'actual behaviour of the network is determined entirely by addressing and rules, which can be ' +
      'misconfigured to contradict the label at any time.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a subnet naming convention as if it were an enforced technical control.',
      },
    ],
    debrief:
      'A naming convention is documentation, not enforcement. Verify segmentation by checking ' +
      'addressing and rules, never by reading subnet names.',
    practice: [],
  },
  {
    id: 'csf.4.3',
    moduleId: 'csf.4',
    packageId: 'cloud-security-foundations',
    order: 3,
    title: 'Subnets, peering, and no implicit trust',
    kind: 'multiple-choice',
    goal: 'Understand that peering two networks is a routing decision, not a trust decision.',
    prompt:
      'Which of the following are accurate about subnet segmentation and network peering? Select all ' +
      'that apply.',
    teach: {
      concept:
        'A virtual network is divided into subnets, and the most common design puts internet-facing ' +
        'resources in a PUBLIC subnet and everything else, application servers, databases, in one or ' +
        'more PRIVATE subnets that have no direct route to the internet. Traffic between subnets in ' +
        'the same virtual network is allowed by default unless a rule says otherwise, which is a very ' +
        'different starting point from traffic entering from the internet, which is denied by ' +
        'default.\n\n' +
        'PEERING connects two separate virtual networks so resources in each can reach the other ' +
        'directly. It is a routing decision, not a trust decision: peering two networks does not ' +
        'automatically restrict what crosses the connection, and a security group or access control ' +
        'list still has to do that work on either side. Assuming peering implies trust boundaries that ' +
        'were never configured is a real source of unintended reachability between environments that ' +
        'were meant to stay separate, such as a test network peered for convenience into one holding ' +
        'production data.',
    },
    options: [
      { id: 'a', label: 'Placing internet-facing resources in a public subnet and everything else in a private subnet is a common baseline design.' },
      { id: 'b', label: 'Traffic between subnets in the same virtual network is commonly allowed by default, unlike traffic arriving from the internet.' },
      { id: 'c', label: 'Peering two virtual networks is a routing decision, and does not by itself restrict what can cross between them.' },
      { id: 'd', label: 'Peering a test environment into a production network for convenience can create reachability nobody intended, if the peering is not paired with its own access rules.' },
      { id: 'e', label: 'Once two virtual networks are peered, the security groups on each side no longer need to filter traffic from the other network.' },
    ],
    hints: [
      'Four are accurate. One assumes peering replaces the need for filtering rather than simply enabling routing.',
      'Peering answers whether traffic can reach the other network at all. It does not answer whether it should be allowed once it arrives.',
      'What happens if two networks are peered and neither side ever writes a rule limiting what crosses the connection.',
    ],
    solution:
      'A, B, C, and D. Public and private subnet separation is the baseline pattern, default allow ' +
      'within a network contrasts with default deny from the internet, and peering only establishes a ' +
      'route, leaving filtering entirely to the security groups and access control lists on either ' +
      'side. E assumes peering removes the need to filter, but it does the opposite: two networks that ' +
      'are reachable from each other and have no filtering rule between them are, in practice, one ' +
      'flat network, which is exactly how a test environment ends up able to reach production data.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes peering removes the need for filtering rules between the two networks.',
      },
    ],
    debrief:
      'Treat every peering connection as a request for a new filtering review, not as a finished piece ' +
      'of network design. The route being possible and the route being intended are two separate ' +
      'facts.',
    practice: [],
  },
  {
    id: 'csf.4.4',
    moduleId: 'csf.4',
    packageId: 'cloud-security-foundations',
    order: 4,
    title: 'Judge the rule table',
    kind: 'multiple-choice',
    goal: 'Judge a security group rule table attached to the wrong kind of resource.',
    prompt:
      'Look again at the security group rule table above, now attached to a database server rather ' +
      'than the web server it was originally shown for:\n\n' +
      'Type      Protocol  Port   Source\n' +
      'HTTPS     TCP       443    0.0.0.0/0\n' +
      'SSH       TCP       22     0.0.0.0/0\n' +
      'Custom    TCP       5432   10.0.1.0/24\n\n' +
      'Which of the following are accurate judgements? Select all that apply.',
    teach: SG_NACL_TEACH,
    options: [
      { id: 'a', label: 'The SSH rule allows administrative access from anywhere on the internet, which is broader than an administrative port usually needs.' },
      { id: 'b', label: 'The HTTPS rule open to 0.0.0.0/0 is unusual on a database server, which is not normally the resource meant to serve web traffic directly.' },
      { id: 'c', label: 'The database port restricted to 10.0.1.0/24 looks like the one correctly scoped rule in this table, limited to a specific internal range.' },
      { id: 'd', label: 'This table looks like it was copied from a web server template without being adjusted for what this resource actually does.' },
      { id: 'e', label: 'Since the database port itself is restricted to an internal range, the other two open rules do not add meaningful risk.' },
    ],
    hints: [
      'Four are accurate. One assumes the one correct rule cancels out the risk of the other two.',
      'Ask what an open SSH or HTTPS rule on a database server would actually be used for, if anything legitimate.',
      'A correctly scoped rule on one line does not reduce what an open rule on another line allows.',
    ],
    solution:
      'A, B, C, and D. Unrestricted SSH and HTTPS access make little sense on a resource whose job is ' +
      'serving a database, the database port itself is the one rule that looks properly scoped, and ' +
      'the overall table reads like a template inherited from a web server and never trimmed. E ' +
      'assumes the one good rule offsets the two bad ones, but each rule is evaluated independently: ' +
      'an open SSH rule remains a full administrative access path regardless of how well the database ' +
      'port is scoped on a separate line.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes a correctly scoped rule offsets the risk carried by a separate, unrelated open rule.',
      },
    ],
    debrief:
      'A copied template is one of the most common real sources of this exact mismatch. Whenever a ' +
      'rule table looks generic, ask whether it was actually written for the resource it is attached ' +
      'to.',
    practice: [],
  },
  {
    id: 'csf.4.5',
    moduleId: 'csf.4',
    packageId: 'cloud-security-foundations',
    order: 5,
    title: 'Explain stateful versus stateless to a colleague from on-premises firewalls',
    kind: 'short-answer',
    goal: 'Diagnose a stateless-filtering mistake for someone used to stateful firewalls.',
    prompt:
      'A colleague who has configured traditional firewalls for years is confused that their network ' +
      'access control list blocks a connection even though they wrote a rule that looks like it should ' +
      'allow it. In three or four sentences, explain the likely cause.',
    teach: {
      concept:
        'This is one of the most common support tickets in a team newly working with cloud ' +
        'networking, and it has a specific, mechanical cause almost every time. A network access ' +
        'control list is stateless, so an inbound allow rule and the matching outbound reply are two ' +
        'entirely separate rules that both have to be written. A colleague used to stateful firewalls ' +
        'has spent years not needing to think about the return path at all, because it was handled ' +
        'automatically, so the natural instinct is to write the one rule that describes the connection ' +
        'they care about and assume the rest follows.\n\n' +
        'A good answer names the actual mechanism, statelessness, rather than simply saying to add ' +
        'another rule, because the colleague will hit the same issue again on the next access control ' +
        'list if they do not understand why the fix worked.',
    },
    hints: [
      'Name the mechanism, not just the fix: say why the return path needs its own rule here.',
      'Contrast it briefly with how the firewalls they already know behave, since that is the source of the confusion.',
      'A strong answer would let them fix the next stateless rule set themselves, not just this one.',
    ],
    solution:
      'The network access control list is stateless, which means it evaluates inbound and outbound ' +
      'traffic as two completely separate rule sets rather than tracking the connection the way a ' +
      'stateful firewall does. Writing a rule that allows the connection coming in does nothing for ' +
      'the reply going back out, so the reply needs its own explicit outbound rule or the connection ' +
      'will hang exactly as they are seeing. This is different from the firewalls they already know, ' +
      'which handled the return path automatically once the initial connection was allowed, so the fix ' +
      'here is to add the missing outbound rule rather than to assume one rule was enough.',
    expectedOutput:
      'An answer naming statelessness as the mechanism, explaining that inbound and outbound need ' +
      'separate rules, and noting this differs from the stateful behaviour they are used to.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['stateless', 'no state', 'does not track'],
          ['outbound rule', 'return traffic', 'reply', 'both directions'],
          ['stateful firewall', 'used to', 'automatically allowed', 'different from'],
        ],
        hint: 'Three ideas: the mechanism causing this, what the actual fix is, and how it differs from what they are used to.',
      },
    ],
    debrief:
      'You will explain this exact confusion more than once to somebody arriving from traditional ' +
      'networking. It is not a knowledge gap, it is a correct instinct meeting a control that behaves ' +
      'differently.',
    practice: [],
  },
];

// --- Module csf.5: logging and detection in the cloud -------------------------

const MODULE_CSF_5: Exercise[] = [
  {
    id: 'csf.5.1',
    moduleId: 'csf.5',
    packageId: 'cloud-security-foundations',
    order: 1,
    title: 'What the log actually records',
    kind: 'multiple-choice',
    goal: 'Distinguish management plane logging from data plane logging.',
    prompt:
      'Which of the following are accurate about what an activity log of this kind records, and what ' +
      'it typically does not? Select all that apply.',
    teach: CLOUDTRAIL_TEACH,
    options: [
      { id: 'a', label: 'It records management plane actions such as creating an access key or changing a permission, regardless of whether the action came from the console, a script, or a command line tool.' },
      { id: 'b', label: 'It records who performed an action, from where, and what it targeted, alongside the action itself.' },
      { id: 'c', label: 'Data plane activity, such as the actual rows read from a database, is typically not captured unless separately enabled.' },
      { id: 'd', label: 'Separately enabling data plane logging often carries its own cost, which is one reason it is frequently missing.' },
      { id: 'e', label: 'Since the log captures every management plane action, it also captures the contents of any data those actions touched.' },
    ],
    hints: [
      'Four are accurate. One conflates the management plane with the data plane.',
      'The log records that a bucket was listed. Ask whether it records what was inside the objects that bucket held.',
      'What is the difference between an API call being logged and the data behind that call being logged.',
    ],
    solution:
      'A, B, C, and D. Management plane actions are recorded with who, where, and what they targeted, ' +
      'regardless of how they were issued, and data plane content is a separate, often separately ' +
      'priced, logging decision that is frequently skipped. E conflates the two planes: knowing that ' +
      'ListBuckets was called tells you a bucket listing happened, it tells you nothing about what was ' +
      'inside any object that was subsequently read, which is exactly why data plane logging has to be ' +
      'turned on in its own right.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes management plane logging also captures data plane content, which it does not.',
      },
    ],
    debrief:
      'When an incident involves data exposure rather than account activity, check early whether data ' +
      'plane logging was even enabled. If it was not, the activity log will show you the account ' +
      'actions and nothing about what was actually read.',
    practice: [],
  },
  {
    id: 'csf.5.2',
    moduleId: 'csf.5',
    packageId: 'cloud-security-foundations',
    order: 2,
    title: 'Silence is itself a signal',
    kind: 'multiple-choice',
    goal: 'Recognise disabled or missing logging as a finding in its own right.',
    prompt:
      'Which of the following are accurate about an account with disabled or missing activity ' +
      'logging? Select all that apply.',
    teach: {
      concept:
        'Disabling or failing to ship this log is one of the more useful single facts you can learn ' +
        'about an account, and it points in two directions that both matter. An attacker who gains ' +
        'administrative reach often disables or deletes logging early, precisely because it is the ' +
        'record of everything they do next, so a gap in the log around the time of an incident is ' +
        'itself evidence worth investigating rather than dismissing as a coincidence.\n\n' +
        'The more common cause, by far, is not an attacker at all. Logging is frequently left off by ' +
        'an account that was never fully set up, a cost-cutting decision that trimmed retention or ' +
        'scope, or a default that was never revisited. The practical lesson is the same either way: an ' +
        'account with no usable log is an account you cannot investigate, regardless of which of the ' +
        'two causes explains the gap, and that is the finding that should be raised.',
    },
    options: [
      { id: 'a', label: 'An attacker who gains administrative access will sometimes disable or delete logging specifically to hide subsequent actions.' },
      { id: 'b', label: 'A logging gap during the window of a suspected incident is worth investigating rather than dismissing as unrelated.' },
      { id: 'c', label: 'The far more common cause of missing logs is an account that was never fully configured, not an active attacker.' },
      { id: 'd', label: 'An account with no usable log is an account that cannot be investigated, regardless of which cause explains the gap.' },
      { id: 'e', label: 'If logging was disabled by a cost-cutting decision rather than an attacker, the gap is not a security concern.' },
    ],
    hints: [
      'Four are accurate. One treats an innocent cause as if it removes the practical consequence.',
      'Ask what an investigator can actually do with an account that has no usable log, regardless of why the log is missing.',
      'The cause of the gap and the consequence of the gap are two separate questions.',
    ],
    solution:
      'A, B, C, and D. An attacker disabling logging to cover their tracks and an account that simply ' +
      'never had logging configured are both real, the second is the more common of the two, and a ' +
      'gap during a suspected incident window deserves investigation regardless of which explains it. ' +
      'E treats an innocent cause as removing the consequence, but the practical problem, no usable ' +
      'record to investigate against, is identical either way: a missing log is missing whether it was ' +
      'disabled maliciously or never turned on.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a benign cause for the missing log as if it removed the actual investigative consequence.',
      },
    ],
    debrief:
      'Check that logging exists and is retained before you need it, not during an incident. ' +
      'Discovering the gap while trying to investigate is the worst possible time to learn the account ' +
      'was never configured for it.',
    practice: [],
  },
  {
    id: 'csf.5.3',
    moduleId: 'csf.5',
    packageId: 'cloud-security-foundations',
    order: 3,
    title: 'The shape of an early intrusion',
    kind: 'multiple-choice',
    goal: 'Recognise the sequence of ordinary-looking actions that make up an early escalation.',
    prompt:
      'Which of the following are accurate about the typical early steps of a cloud account ' +
      'compromise, as they would appear in an activity log? Select all that apply.',
    teach: {
      concept:
        'An account compromise rarely opens with something dramatic. It opens with a short sequence ' +
        'of ordinary-looking API calls that, read individually, could each belong to a legitimate ' +
        'administrator having an unremarkable day. Read together, in sequence, the pattern is ' +
        'recognisable: ENUMERATION calls that list users, roles, and resources, mapping out what is ' +
        'actually in the account; a NEW ACCESS KEY or credential created, often for an existing ' +
        'identity rather than a new one, so it does not stand out in a list of accounts; and a ' +
        'PERMISSION CHANGE, a broad policy attached to that identity or an existing one, that turns ' +
        'modest initial access into administrative reach.\n\n' +
        'None of these three actions is inherently malicious. An administrator legitimately lists ' +
        'users, creates keys, and changes permissions constantly. What makes the sequence worth ' +
        'flagging is the combination and the order, arriving close together, from an identity or a ' +
        'source that does not usually perform this kind of activity.',
    },
    options: [
      { id: 'a', label: 'Enumeration calls that list users, roles, and resources are a common early step, used to map out what access is available.' },
      { id: 'b', label: 'A new access key or credential created for an existing identity is a common early step, and does not stand out the way a brand new account would.' },
      { id: 'c', label: 'A broad permission attached to an identity shortly after enumeration and key creation is a recognisable pattern of privilege escalation.' },
      { id: 'd', label: 'Individually, each of these actions could also belong to a legitimate administrator, which is why the sequence and timing matter more than any single call.' },
      { id: 'e', label: 'Any account performing a ListUsers call should be treated as compromised, since that action has no legitimate use.' },
    ],
    hints: [
      'Four are accurate. One treats a routine administrative action as inherently malicious on its own.',
      'Ask how many legitimate administrators call ListUsers in an ordinary week.',
      'What actually distinguishes this pattern from routine administration is the combination and the timing, not any single call.',
    ],
    solution:
      'A, B, C, and D. Enumeration, a new credential on an existing identity, and a broad permission ' +
      'change arriving close together form a recognisable escalation pattern, and each step in ' +
      'isolation is genuinely ordinary administrative activity, which is exactly why sequence and ' +
      'timing matter more than any single call. E treats one routine action as proof of compromise on ' +
      'its own, but ListUsers is called constantly by legitimate administrators, and treating it as ' +
      'inherently malicious would flood a detection programme with false positives without catching ' +
      'the pattern that actually matters.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a single, routinely legitimate call as inherently malicious rather than looking at the sequence.',
      },
    ],
    debrief:
      'This is why detections in this space are built around sequences and baselines rather than ' +
      'single events. A rule that fires on ListUsers alone will drown you in noise before it ever ' +
      'catches the pattern that mattered.',
    practice: [],
  },
  {
    id: 'csf.5.4',
    moduleId: 'csf.5',
    packageId: 'cloud-security-foundations',
    order: 4,
    title: 'Read the excerpt as a sequence',
    kind: 'multiple-choice',
    goal: 'Apply escalation recognition to a specific log excerpt.',
    prompt:
      'Look again at the log excerpt shown above:\n\n' +
      '12:03:01  ListBuckets        user=svc-report      source=203.0.113.9\n' +
      '12:03:04  ListUsers          user=svc-report      source=203.0.113.9\n' +
      '12:03:11  CreateAccessKey    user=svc-report      source=203.0.113.9  target=admin-role\n' +
      '12:03:19  AttachRolePolicy   user=svc-report      source=203.0.113.9  target=admin-role  policy=AdministratorAccess\n\n' +
      'The identity svc-report is a low-privilege reporting service account that has never previously ' +
      'created access keys or touched roles. Which of the following are accurate about this sequence? ' +
      'Select all that apply.',
    teach: CLOUDTRAIL_TEACH,
    options: [
      { id: 'a', label: 'The two listing calls at the start are consistent with an enumeration step, mapping out what exists in the account.' },
      { id: 'b', label: 'Creating an access key targeting a different, more privileged role than the identity normally uses is a meaningful deviation from that identity behaviour.' },
      { id: 'c', label: 'Attaching an administrator policy to the target role within seconds of the new key being created completes a recognisable escalation from low privilege to full account access.' },
      { id: 'd', label: 'Given that this identity has never performed these actions before, the whole sequence and its timing are worth escalating for investigation.' },
      { id: 'e', label: 'Because each individual action in this log is a normal API call that exists for legitimate purposes, this sequence does not need to be treated as suspicious.' },
    ],
    hints: [
      'Four are accurate. One judges each call in isolation instead of reading the sequence as a whole.',
      'Ask whether a reporting service account has any ordinary reason to create a key targeting an administrator role.',
      'The identity, the timing, and the target role together are what make this worth escalating, not any single API call.',
    ],
    solution:
      'A, B, C, and D. Enumeration followed by a new key targeting a privileged role followed by an ' +
      'administrator policy attached within seconds, all from an identity with no history of this ' +
      'behaviour, is close to a textbook escalation sequence. E falls back to judging each call ' +
      'individually, which is precisely the mistake this pattern exploits: every action here has a ' +
      'legitimate use in isolation, and the entire reason it is dangerous is the combination, the ' +
      'timing, and the fact that svc-report has never behaved this way before.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option evaluates each call on its own instead of reading the sequence, timing, and history together.',
      },
    ],
    debrief:
      'This is close to the exact shape you should build an alert around: not any single API call, but ' +
      'a low-privilege identity suddenly touching credentials and permissions it has never touched ' +
      'before.',
    practice: [],
  },
  {
    id: 'csf.5.5',
    moduleId: 'csf.5',
    packageId: 'cloud-security-foundations',
    order: 5,
    title: 'Explain why "we found no logs" is itself a finding',
    kind: 'short-answer',
    goal: 'Distinguish a reviewed clean log from an absent one.',
    prompt:
      'During an incident review, a colleague reports: "There is nothing suspicious in the activity ' +
      'log for that period." You discover logging was not enabled for most of that period. In three ' +
      'or four sentences, explain why the colleague conclusion is wrong.',
    teach: {
      concept:
        'This is a distinction worth being precise about, because the two statements sound almost ' +
        'identical and lead to opposite conclusions. "We reviewed the log and found nothing ' +
        'suspicious" is a finding about the activity that occurred. "There is no log to review" is a ' +
        'finding about the absence of evidence, and it supports no conclusion about what did or did ' +
        'not happen during that window.\n\n' +
        'A good answer names the specific error, treating absence of evidence as evidence of absence, ' +
        'and says what the correct next step is: establishing when logging actually started, and ' +
        'treating the period before that as unknown rather than clean.',
    },
    hints: [
      'Name the specific reasoning error: treating no log as the same thing as a clean log.',
      'Say what conclusion the missing period actually supports, which is not "nothing happened".',
      'A strong answer also says what to do next: establish when logging started and treat the earlier window as unknown.',
    ],
    solution:
      'Reviewing a log and finding nothing suspicious is a conclusion about activity that was ' +
      'recorded. Having no log at all supports no conclusion about that period, because the absence of ' +
      'a record is not the same thing as a record of no activity, and treating them as equivalent is ' +
      'the specific error here. The correct next step is to establish exactly when logging started ' +
      'during that window and treat everything before that point as unknown rather than clean, since ' +
      'an attacker who disabled logging, or an account that simply never had it configured, would look ' +
      'identical from where we are standing.',
    expectedOutput:
      'An answer distinguishing a reviewed clean log from no log at all, and stating the correct next ' +
      'step of treating the unlogged period as unknown.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['absence of evidence', 'no record', 'not the same as', 'does not mean nothing happened'],
          ['logging was not enabled', 'no log', 'gap', 'missing period'],
          ['unknown', 'cannot conclude', 'establish when logging started', 'treat as unknown'],
        ],
        hint: 'Three ideas: the specific reasoning error, what the gap actually tells you, and what the correct next step is.',
      },
    ],
    debrief:
      'This confusion appears in almost every incident that involves a logging gap. Catching it early ' +
      'saves the review from closing on a conclusion the evidence never supported.',
    practice: [],
  },
];

// --- Module csf.6: secrets and key management ---------------------------------

const MODULE_CSF_6: Exercise[] = [
  {
    id: 'csf.6.1',
    moduleId: 'csf.6',
    packageId: 'cloud-security-foundations',
    order: 1,
    title: 'A recurring cause, not a rare mistake',
    kind: 'multiple-choice',
    goal: 'Recognise hardcoded credentials as a persistent, real breach pattern.',
    prompt:
      'Which of the following are accurate about hardcoded credentials of the kind shown above? ' +
      'Select all that apply.',
    teach: SECRETS_TEACH,
    options: [
      { id: 'a', label: 'A hardcoded credential is common because it is the fastest way to make something work during development.' },
      { id: 'b', label: 'Once committed to a source repository, the credential remains in the project history even after the line is later deleted.' },
      { id: 'c', label: 'A credential baked into a container image is exposed to anyone who can pull that image, not only people with access to the running system.' },
      { id: 'd', label: 'This pattern is a genuinely recurring cause of real breaches, not a hypothetical or rare edge case.' },
      { id: 'e', label: 'Deleting the line containing the credential from the current version of the file fully removes the exposure.' },
    ],
    hints: [
      'Four are accurate. One assumes deleting the current version of a file removes something that lives in its history.',
      'A source repository does not forget. Ask where the old version of that file still exists.',
      'What actually needs to happen to the credential itself, not just to the file containing it.',
    ],
    solution:
      'A, B, C, and D. Convenience during development explains why this pattern keeps recurring, ' +
      'repository history and image layers both preserve a credential well past the point it was ' +
      'removed from the current version, and this is one of the most consistently cited causes in ' +
      'real breach reporting. E is the mistake that leaves the actual exposure in place: deleting a ' +
      'line from the current file does nothing about the earlier commit or the already-built image ' +
      'that still contains it, which is why the next exercise is about what genuinely fixes this ' +
      'rather than what looks like it does.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes removing a credential from the latest version of a file removes it from history entirely.',
      },
    ],
    debrief:
      'Hold onto the gap between deleting a line and removing an exposure. The next two exercises are ' +
      'entirely about that gap.',
    practice: [],
  },
  {
    id: 'csf.6.2',
    moduleId: 'csf.6',
    packageId: 'cloud-security-foundations',
    order: 2,
    title: 'What a managed key service actually buys you',
    kind: 'multiple-choice',
    goal: 'Understand what centralising key material through a managed service changes.',
    prompt:
      'Which of the following are accurate about using a managed key service instead of a credential ' +
      'sitting in a configuration file? Select all that apply.',
    teach: {
      concept:
        'A managed key service centralises the thing hardcoding scatters everywhere: the actual key ' +
        'material. Instead of a password or key sitting in a configuration file that every service and ' +
        'every developer machine has its own copy of, the application asks the key service to perform ' +
        'the encryption or decryption operation and the raw key material never leaves the service at ' +
        'all, a pattern generally called envelope encryption.\n\n' +
        'Three benefits follow directly from that centralisation. Access to the key is governed by the ' +
        'same identity and access controls covered earlier, so granting and revoking the ability to ' +
        'use a key is a permissions change rather than a redeployment. Every use of the key is logged, ' +
        'the same way an API call is logged, giving an audit trail hardcoding never produces. And ' +
        'rotating a key becomes an operation the service performs, rather than a hunt through every ' +
        'file and image that might contain the old value.',
    },
    options: [
      { id: 'a', label: 'The raw key material stays inside the managed service and is never copied into application configuration files.' },
      { id: 'b', label: 'Granting or revoking the ability to use a key becomes an identity and access permissions change rather than a code or configuration redeployment.' },
      { id: 'c', label: 'Use of the key is logged, giving an audit trail that a hardcoded credential in a configuration file does not produce.' },
      { id: 'd', label: 'Rotating a key managed this way is an operation the service performs, rather than a manual search through every file that might contain the old value.' },
      { id: 'e', label: 'Using a managed key service removes the need to think about who can request encryption or decryption operations, since the service secures itself.' },
    ],
    hints: [
      'Four are accurate. One assumes the service secures access on its own without any configuration from you.',
      'The service protects the key material. It does not decide on its own who is allowed to ask it to use that key.',
      'Access to use a key is still governed by permissions somebody has to configure, the same as any other IAM decision.',
    ],
    solution:
      'A, B, C, and D. Centralising key material removes it from configuration files entirely, access ' +
      'to use it becomes an identity and access decision, every use is logged, and rotation becomes an ' +
      'operation rather than a hunt. E assumes the service handles access decisions on its own, but ' +
      'who may request an encryption or decryption operation is still governed by the identity and ' +
      'access permissions you configure, the same principle from the earlier module applied to keys ' +
      'instead of resources.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes the managed key service removes the need to configure who is permitted to use it.',
      },
    ],
    debrief:
      'A managed key service is a control, not a guarantee. It removes several ways a credential used ' +
      'to leak, and it still needs the identity work from module two applied to it.',
    practice: [],
  },
  {
    id: 'csf.6.3',
    moduleId: 'csf.6',
    packageId: 'cloud-security-foundations',
    order: 3,
    title: 'Assume it is already gone the moment it is committed',
    kind: 'multiple-choice',
    goal: 'Apply the compromise-on-commit assumption and know why only rotation resolves it.',
    prompt:
      'Which of the following are accurate about a credential that was ever committed to a repository ' +
      'or embedded in an image? Select all that apply.',
    teach: {
      concept:
        'Once a credential has been committed to a repository, even briefly, or embedded in an image ' +
        'that has ever left a controlled environment, the only safe assumption is that it is already ' +
        'known to somebody you did not intend, whether or not there is any current evidence of misuse. ' +
        'This is not paranoia, it is a recognition that you cannot prove a negative: you cannot show ' +
        'that nobody has cloned that repository, pulled that image, or copied that history in the ' +
        'window before you noticed.\n\n' +
        'The only action that actually resolves the exposure is ROTATION: issuing a new credential and ' +
        'invalidating the old one, so that whatever copy of the old value exists anywhere, in history, ' +
        'in an image layer, on a machine belonging to a former colleague, stops working. Removing the ' +
        'credential from the current file, closing the pull request, apologising in the commit ' +
        'message, none of these actions touch the old value at all.',
    },
    options: [
      { id: 'a', label: 'A credential that was ever committed or embedded in an image should be treated as known to somebody outside your control, regardless of whether misuse has been observed.' },
      { id: 'b', label: 'Rotation, issuing a new credential and invalidating the old one, is the only action that actually resolves this kind of exposure.' },
      { id: 'c', label: 'Removing the line from the current version of a file does not invalidate any copy of the old credential that already exists elsewhere.' },
      { id: 'd', label: 'This assumption applies even if the repository or image in question was never publicly accessible, since internal access is still access.' },
      { id: 'e', label: 'If no suspicious activity has been observed using the credential, it is reasonable to leave it in place rather than rotate it.' },
    ],
    hints: [
      'Four are accurate. One waits for evidence of misuse before acting, which is the opposite of the assumption this idea is built on.',
      'You cannot prove that nobody has seen a credential. What can you actually prove instead.',
      'Rotation is the only action on this list that changes whether the old value still works.',
    ],
    solution:
      'A, B, C, and D. The safe assumption treats exposure as certain rather than waiting for proof, it ' +
      'applies even to private repositories since internal access is still access, and only rotation ' +
      'actually invalidates the old value, which merely deleting a line or closing a pull request does ' +
      'not touch. E waits for evidence of misuse before acting, but the entire point of the assumption ' +
      'is that absence of observed misuse proves nothing, since a careful attacker who obtained the ' +
      'credential would have no reason to trigger any alert you would notice.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option waits for evidence of misuse, which contradicts the assumption that exposure should be treated as certain regardless of evidence.',
      },
    ],
    debrief:
      'This is the one habit in this module worth making automatic: the moment a secret is found ' +
      'anywhere it should not be, rotate it first and investigate second. Investigation takes time, ' +
      'and every minute spent on it is a minute the old value still works.',
    practice: [],
  },
  {
    id: 'csf.6.4',
    moduleId: 'csf.6',
    packageId: 'cloud-security-foundations',
    order: 4,
    title: 'Diagnose the snippet',
    kind: 'multiple-choice',
    goal: 'Choose the correct immediate priorities for a discovered hardcoded credential.',
    prompt:
      'Look again at the configuration snippet shown above:\n\n' +
      'DATABASE_HOST = "db.internal.example"\n' +
      'DATABASE_USER = "app"\n' +
      'DATABASE_PASSWORD = "Summer2024!"\n\n' +
      'This file was found in a source repository that several former contractors still had clone ' +
      'access to at various points over the last two years. Which of the following are the correct ' +
      'immediate priorities? Select all that apply.',
    teach: SECRETS_TEACH,
    options: [
      { id: 'a', label: 'Rotate the database password immediately, rather than only removing the line from the current version of the file.' },
      { id: 'b', label: 'Assume the password is known to anyone who cloned the repository during the period they had access, since there is no way to rule that out now.' },
      { id: 'c', label: 'Move the credential out of the repository entirely once rotated, into a managed secret or key service rather than back into another file.' },
      { id: 'd', label: 'Review whether other files in the same repository follow the same pattern, since one hardcoded credential rarely explains the whole practice.' },
      { id: 'e', label: 'Since the contractors have already left, their access is no longer active and the credential does not need to be rotated.' },
    ],
    hints: [
      'Four are correct priorities. One confuses access being revoked today with the credential being safe.',
      'Ask what a departed contractor could have already copied before their access was ever revoked.',
      'Revoking future access and invalidating a credential they may have already seen are two different actions.',
    ],
    solution:
      'A, B, C, and D. Rotation is the action that actually resolves the exposure, the assumption has ' +
      'to cover the entire period the contractors had access rather than only the present, the ' +
      'replacement needs to go into a managed service rather than another file, and the same practice ' +
      'should be checked elsewhere in the repository. E confuses current access with historical ' +
      'exposure: a contractor who lost access today could have copied that file, or that repository ' +
      'history, at any point during the two years they had it, and revoking access now does nothing to ' +
      'the copy they may already hold.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats revoked current access as equivalent to the credential never having been exposed.',
      },
    ],
    debrief:
      'Notice how much of this response is about the two years of history, not the present moment. ' +
      'Secrets exposure is almost always a question about the past, not the current configuration.',
    practice: [],
  },
  {
    id: 'csf.6.5',
    moduleId: 'csf.6',
    packageId: 'cloud-security-foundations',
    order: 5,
    title: 'Explain why deleting the line is not the fix',
    kind: 'short-answer',
    goal: 'Distinguish removing a credential from the current file from actually invalidating it.',
    prompt:
      'A developer removes a hardcoded password from the latest commit and says: "Fixed, it is gone ' +
      'now." In three or four sentences, explain what is still wrong.',
    teach: {
      concept:
        'This is the single most common half-measure in this whole module, and it happens because the ' +
        'visible symptom, the password sitting in the current file, really has disappeared. What has ' +
        'not disappeared is the value itself, which still exists in the commit history, in any image ' +
        'already built from an earlier commit, and in any clone anybody made before the fix. The ' +
        'current file being clean says nothing about any of those copies.\n\n' +
        'A strong answer names where the old value still lives and states plainly that only rotation, ' +
        'not deletion, changes whether that old value still works.',
    },
    hints: [
      'Say specifically where the old value still exists even though the current file no longer shows it.',
      'Name the one action that actually changes whether the old value still works.',
      'A strong answer treats the current file being clean as unrelated to whether the credential is still valid.',
    ],
    solution:
      'Removing the password from the latest commit only changes what the current version of the file ' +
      'shows, it does nothing about the earlier commit that still contains it, any container image ' +
      'already built from that commit, or any clone of the repository somebody made before the fix. ' +
      'All of those copies still hold the original working password. The only action that actually ' +
      'changes whether that value still works is rotating the credential, issuing a new one and ' +
      'invalidating the old, and until that happens the fix is cosmetic rather than real.',
    expectedOutput:
      'An answer naming where the old credential still exists despite the deletion, and stating that ' +
      'only rotation resolves it.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['history', 'earlier commit', 'still there', 'still exists', 'image', 'clone'],
          ['still valid', 'still works', 'not invalidated', 'password is unchanged'],
          ['rotate', 'rotation', 'issue a new', 'invalidate the old'],
        ],
        hint: 'Three ideas: where the old value still lives, why it still works, and what actually resolves that.',
      },
    ],
    debrief:
      'You will see this exact half-measure again. Treat "removed from the latest commit" and ' +
      '"rotated" as two entirely different claims, and ask which one actually happened.',
    practice: [],
  },
];

// --- Module csf.7: infrastructure as code and drift ---------------------------

const MODULE_CSF_7: Exercise[] = [
  {
    id: 'csf.7.1',
    moduleId: 'csf.7',
    packageId: 'cloud-security-foundations',
    order: 1,
    title: 'A mistake that scales',
    kind: 'multiple-choice',
    goal: 'Understand how infrastructure as code reproduces a single mistake at scale.',
    prompt:
      'Which of the following are accurate about the risk shown in the fragment above? Select all ' +
      'that apply.',
    teach: IAC_TEACH,
    options: [
      { id: 'a', label: 'Every resource created from this module inherits the open SSH rule automatically, with no separate configuration step required.' },
      { id: 'b', label: 'A single bad line in a widely reused module can produce the same misconfiguration across every resource it creates.' },
      { id: 'c', label: 'The mistake appears the moment the module is applied, rather than being introduced gradually by many separate manual changes.' },
      { id: 'd', label: 'Fixing the module and reapplying it corrects every resource that was built from it, which is the same mechanism that made the mistake spread in the first place.' },
      { id: 'e', label: 'Because the mistake is defined in code rather than made by hand, it is inherently easier to spot than a manual misconfiguration.' },
    ],
    hints: [
      'Four are accurate. One assumes code review automatically catches what a human reviewer failed to notice.',
      'The mistake being written down does not mean anybody read it carefully before applying it.',
      'Ask whether a mistake in code is easier to spot, or simply easier to reproduce.',
    ],
    solution:
      'A, B, C, and D. The rule applies automatically and identically to every resource built from the ' +
      'module, the mistake appears all at once rather than accumulating gradually, and the same ' +
      'mechanism that spread it, reapplying the corrected module, is what fixes it everywhere at once. ' +
      'E assumes writing something in code makes it inherently more visible, but a bad line in a ' +
      'module is just as easy to miss in review as a bad click in a console, the difference is ' +
      'entirely in how far the mistake travels once it exists, not in how easy it was to catch.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes code form makes a mistake inherently easier to catch, rather than simply easier to reproduce widely.',
      },
    ],
    debrief:
      'This is the trade at the heart of infrastructure as code: the same leverage that fixes fifty ' +
      'resources with one correction is what broke fifty resources with one mistake in the first ' +
      'place.',
    practice: [],
  },
  {
    id: 'csf.7.2',
    moduleId: 'csf.7',
    packageId: 'cloud-security-foundations',
    order: 2,
    title: 'What a scanner catches, and what it cannot',
    kind: 'multiple-choice',
    goal: 'Distinguish pre-deployment scanning from ongoing verification of the live environment.',
    prompt:
      'Which of the following are accurate about scanning an infrastructure-as-code definition before ' +
      'it is deployed? Select all that apply.',
    teach: {
      concept:
        'An infrastructure-as-code scanner reads the definition file before it is ever applied and ' +
        'checks it against a set of known bad patterns: a security group open to the entire internet, ' +
        'a storage resource defined without encryption, a database defined without backups enabled. ' +
        'This catches an entire class of misconfiguration before a single real resource is ever ' +
        'created, which is far cheaper than finding it afterward.\n\n' +
        'What a scanner reading the definition cannot see is what actually happens after deployment. ' +
        'It cannot see a permission added later through the console rather than through code, a ' +
        'resource that started compliant and was manually changed, or the runtime behaviour of the ' +
        'workload once it is live. Those require checking the running environment itself, not the ' +
        'file that was used to build it, which is a separate and ongoing activity rather than a ' +
        'one-time gate before deployment.',
    },
    options: [
      { id: 'a', label: 'A scanner reading an infrastructure-as-code definition can catch a known bad pattern, such as an unrestricted ingress rule, before any resource is created.' },
      { id: 'b', label: 'Catching a misconfiguration before deployment is generally cheaper than discovering it afterward in a running environment.' },
      { id: 'c', label: 'A definition-time scanner cannot see a change made later directly against the running environment rather than through the code.' },
      { id: 'd', label: 'Checking the actual running environment against what the code defines is a separate, ongoing activity, not something a one-time pre-deployment scan covers.' },
      { id: 'e', label: 'Passing an infrastructure-as-code scan means the running environment it produced is guaranteed to remain compliant afterward.' },
    ],
    hints: [
      'Four are accurate. One assumes a one-time check guarantees an ongoing state.',
      'A scan reads a file. Ask whether the file stays true forever once the resources it describes are running.',
      'What could change a running resource after deployment without ever touching the code that originally created it.',
    ],
    solution:
      'A, B, C, and D. Pre-deployment scanning catches known bad patterns cheaply before creation, and ' +
      'it has a real blind spot: anything that happens to the running environment after deployment, ' +
      'especially a manual change made outside the code, which is invisible to a scanner that only ' +
      'ever reads the definition file. E assumes a pass at deployment time guarantees the future ' +
      'state, but nothing about a one-time scan prevents somebody from later changing a live resource ' +
      'directly, which is precisely the gap the next exercise is about.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes a pre-deployment scan result remains true for the life of the running environment.',
      },
    ],
    debrief:
      'Pre-deployment scanning and ongoing checking of the live environment are two different controls ' +
      'doing two different jobs. Treating the first as covering the second is the gap the next ' +
      'exercise names directly.',
    practice: [],
  },
  {
    id: 'csf.7.3',
    moduleId: 'csf.7',
    packageId: 'cloud-security-foundations',
    order: 3,
    title: 'When the running environment stops matching the code',
    kind: 'multiple-choice',
    goal: 'Define configuration drift and recognise its common causes.',
    prompt:
      'Which of the following are accurate about configuration drift? Select all that apply.',
    teach: {
      concept:
        'DRIFT is the gap between what the code says the environment should look like and what the ' +
        'environment actually looks like. It happens constantly, and rarely maliciously: an engineer ' +
        'makes an urgent manual change through the console during an incident and never backports it ' +
        'into the code, a setting is changed by an automated process outside the deployment pipeline, ' +
        'or two separate teams both manage resources that a single piece of code was meant to own.\n\n' +
        'The danger is not the manual change itself, which is sometimes genuinely the fastest correct ' +
        'response in the moment. The danger is that the code now describes a fiction: the next time ' +
        'somebody reapplies it, the manual fix can be silently overwritten, or the definition file, ' +
        'still passing every scan, no longer describes the environment anyone is actually defending.',
    },
    options: [
      { id: 'a', label: 'Drift is the gap between what the infrastructure code defines and what is actually running.' },
      { id: 'b', label: 'A common cause of drift is an urgent manual fix made during an incident that is never backported into the code.' },
      { id: 'c', label: 'A definition file can pass every scan and still no longer describe the environment it is supposedly defining, once drift has occurred.' },
      { id: 'd', label: 'Reapplying drifted code can silently overwrite a manual fix that was never captured in the code itself.' },
      { id: 'e', label: 'Drift is rare in practice, since infrastructure as code is specifically designed to prevent the running environment from ever diverging from the definition.' },
    ],
    hints: [
      'Four are accurate. One assumes the existence of infrastructure as code prevents the exact gap this exercise is about.',
      'Ask what actually stops somebody from making a manual change through the console after the code was applied.',
      'Infrastructure as code defines the intended state. It does not, on its own, enforce that nothing else can change it.',
    ],
    solution:
      'A, B, C, and D. Drift is exactly the gap between defined and actual state, an unbackported ' +
      'incident fix is a common cause, a passing scan says nothing once the live environment has moved ' +
      'away from the file, and reapplying the code can wipe out a manual change nobody recorded. E ' +
      'assumes infrastructure as code prevents drift by existing, but the code only defines an ' +
      'intended state, it does not on its own stop a console change, an automated process, or a second ' +
      'team from moving the running environment away from that definition afterward.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes the existence of infrastructure as code, by itself, prevents the environment from ever drifting away from it.',
      },
    ],
    debrief:
      'A mature setup checks for drift on a schedule, comparing the running environment against the ' +
      'code, rather than assuming the code is still an accurate description simply because nobody ' +
      'meant to change anything.',
    practice: [],
  },
  {
    id: 'csf.7.4',
    moduleId: 'csf.7',
    packageId: 'cloud-security-foundations',
    order: 4,
    title: 'Fix the module, then find out what else it built',
    kind: 'multiple-choice',
    goal: 'Choose sound follow-up steps after correcting a widely reused module.',
    prompt:
      'You correct the module shown above, replacing the open SSH rule with one scoped to a specific ' +
      'administrative range, and reapply it. Which of the following are sound next steps? Select all ' +
      'that apply.',
    teach: IAC_TEACH,
    options: [
      { id: 'a', label: 'Confirm that reapplying the module actually updated every existing resource that was built from the earlier, unscoped version.' },
      { id: 'b', label: 'Check whether any resource built from this module was later manually changed outside the code, since reapplying could either fix it or silently revert an unrelated manual fix.' },
      { id: 'c', label: 'Search the rest of the codebase for other modules with the same unrestricted pattern, since the same mistake is often repeated by whoever wrote or copied this one.' },
      { id: 'd', label: 'Add this specific pattern to whatever scanning runs before future deployments, so the same mistake is caught before it is applied again.' },
      { id: 'e', label: 'Consider the issue closed once this one module is corrected, since it was the only place the mistake was found.' },
    ],
    hints: [
      'Four are sound. One assumes finding one instance of a mistake means there is only one instance.',
      'A copied module tends to get copied more than once. Where else might this exact pattern exist.',
      'Correcting the source is only half the job. What has to be checked about the resources it already built.',
    ],
    solution:
      'A, B, C, and D. Confirming the reapply actually propagated, checking for manual drift before ' +
      'overwriting it, searching for the same pattern elsewhere, and feeding the finding back into the ' +
      'scanner all belong to a complete fix. E treats finding one instance as proof there is only one, ' +
      'but a module gets copied, and a mistake that made it into one module was very possibly made or ' +
      'copied into others, which is exactly the kind of check that closing the issue too early skips.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats correcting a single instance as if it closed out the whole issue, without checking for the pattern elsewhere.',
      },
    ],
    debrief:
      'Fixing the module is the easy half. Verifying it actually propagated, and that nothing else ' +
      'shares the mistake, is the half that is easy to skip under time pressure and expensive to skip ' +
      'for real.',
    practice: [],
  },
  {
    id: 'csf.7.5',
    moduleId: 'csf.7',
    packageId: 'cloud-security-foundations',
    order: 5,
    title: 'Explain drift to somebody who trusts the code completely',
    kind: 'short-answer',
    goal: 'Correct the belief that infrastructure as code guarantees the running state matches the definition.',
    prompt:
      'A DevOps colleague says: "Our infrastructure is fully defined as code, so whatever is running ' +
      'always matches what is in the repository." In three or four sentences, explain why that is not ' +
      'necessarily true.',
    teach: {
      concept:
        'This belief is common precisely because it describes the intention behind infrastructure as ' +
        'code correctly, and mistakes that intention for a guarantee. The code accurately describes ' +
        'what was applied the last time it was applied. Nothing about the code itself prevents the ' +
        'environment from moving away from that description afterward, through a manual console ' +
        'change, an automated process running outside the deployment pipeline, or another team ' +
        'managing an overlapping resource.\n\n' +
        'A good answer names at least one concrete way drift actually happens, and says what would be ' +
        'needed to know the two are still in sync, which is an ongoing check against the running ' +
        'environment, not a fact that follows from having code at all.',
    },
    hints: [
      'Say what the code actually guarantees, which is the state at the last time it was applied, not the state forever after.',
      'Name one concrete way the running environment can move away from the code without the code changing.',
      'Say what would actually be needed to confirm they still match: an ongoing check, not an assumption.',
    ],
    solution:
      'The code accurately describes what was applied the last time somebody ran it, that is genuinely ' +
      'true. It does not describe what is running right now, because nothing about the code prevents a ' +
      'manual console change during an incident, an automated process outside the deployment pipeline, ' +
      'or another team touching an overlapping resource from moving the live environment away from ' +
      'that definition afterward. Confirming the two still match requires an ongoing comparison ' +
      'between the code and the actual running environment, not an assumption that follows ' +
      'automatically from the infrastructure having started out as code.',
    expectedOutput:
      'An answer distinguishing what the code guarantees at apply time from what happens afterward, ' +
      'naming a concrete drift cause, and stating that an ongoing check is needed to confirm they ' +
      'still match.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['last applied', 'at the time it was applied', 'described the state then'],
          ['manual change', 'console', 'outside the pipeline', 'another team'],
          ['ongoing check', 'compare', 'drift detection', 'verify they still match'],
        ],
        hint: 'Three ideas: what the code actually guarantees, one concrete way drift happens anyway, and what it would take to confirm they still match.',
      },
    ],
    debrief:
      'This is the same trust-the-artefact mistake as assuming a passed scan stays true forever. Treat ' +
      'both the code and the scan as a snapshot of a moment, not a standing guarantee.',
    practice: [],
  },
];

// --- Module csf.8: incident response differences in the cloud ----------------

const MODULE_CSF_8: Exercise[] = [
  {
    id: 'csf.8.1',
    moduleId: 'csf.8',
    packageId: 'cloud-security-foundations',
    order: 1,
    title: 'The evidence will not wait for you',
    kind: 'multiple-choice',
    goal: 'Understand how ephemeral infrastructure changes the timing of evidence capture.',
    prompt:
      'Which of the following are accurate about ephemeral cloud infrastructure and its effect on ' +
      'incident response? Select all that apply.',
    teach: EPHEMERAL_TEACH,
    options: [
      { id: 'a', label: 'An autoscaling group can terminate the specific instance involved in an incident before an investigator ever opens it.' },
      { id: 'b', label: 'A serverless function has no persistent instance to examine between invocations in the way a traditional server does.' },
      { id: 'c', label: 'Evidence often needs to be captured immediately, before a decision is even made about what to do with the resource, rather than afterward.' },
      { id: 'd', label: 'The underlying goals of incident response, preserve evidence, understand scope, remove the threat, remain the same even though the order of steps shifts.' },
      { id: 'e', label: 'Because cloud resources are short-lived by design, meaningful forensic evidence generally cannot be captured from them at all.' },
    ],
    hints: [
      'Four are accurate. One gives up on evidence capture rather than adjusting when it happens.',
      'A resource disappearing on its own is a reason to move faster, not a reason evidence is unreachable.',
      'What can be captured from a resource before it terminates, even if nothing can be captured after.',
    ],
    solution:
      'A, B, C, and D. Ephemeral infrastructure can genuinely vanish before an investigator gets to it, ' +
      'a serverless function has nothing persistent to examine between calls, and the response to both ' +
      'is to capture evidence earlier rather than to accept there is none to capture, since the goals ' +
      'of response have not changed, only their sequencing has. E gives up on forensic evidence ' +
      'entirely, but a snapshot taken before termination, or logs shipped continuously rather than ' +
      'read off the instance afterward, both capture exactly the evidence that would otherwise be ' +
      'lost, provided the capture happens early enough.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats short-lived infrastructure as making evidence capture impossible, rather than simply making timing more urgent.',
      },
    ],
    debrief:
      'Every remaining exercise in this module is really this one idea applied to a specific decision: ' +
      'capture first, act second, because the resource in front of you may not still exist by the time ' +
      'you decide what to do with it.',
    practice: [],
  },
  {
    id: 'csf.8.2',
    moduleId: 'csf.8',
    packageId: 'cloud-security-foundations',
    order: 2,
    title: 'Snapshot before you terminate',
    kind: 'multiple-choice',
    goal: 'Order forensic preservation correctly relative to termination.',
    prompt:
      'Which of the following are accurate about preserving evidence from a compromised instance ' +
      'before terminating it? Select all that apply.',
    teach: {
      concept:
        'Terminating a compromised instance feels like the responsible move, and it is, once the ' +
        'evidence it holds has been preserved. Terminating it first destroys the volume, the memory ' +
        'state, and the running processes at the exact moment they would have been most informative, ' +
        'which trades a slightly longer containment window for the permanent loss of everything that ' +
        'would have explained what actually happened.\n\n' +
        'The standard sequence is to take a SNAPSHOT of the storage volume, which preserves the disk ' +
        'state for later analysis without needing to keep the live instance running, and where ' +
        'possible to capture memory before shutdown, since memory holds the running processes and ' +
        'network connections that a disk snapshot alone will not. Only after that capture is complete ' +
        'does removing the instance from the network, or terminating it outright, stop being a trade ' +
        'against the evidence you still needed.',
    },
    options: [
      { id: 'a', label: 'Terminating a compromised instance before capturing its state destroys evidence that a slightly slower, ordered response would have preserved.' },
      { id: 'b', label: 'Taking a snapshot of the storage volume preserves the disk state for later analysis without requiring the live instance to keep running.' },
      { id: 'c', label: 'Memory captured before shutdown can hold running processes and network connections that a disk snapshot alone does not.' },
      { id: 'd', label: 'Removing an instance from the network is a reasonable containment step once its evidence has already been captured.' },
      { id: 'e', label: 'Since cloud snapshots are quick to take, there is no meaningful cost to terminating an instance first and taking the snapshot afterward.' },
    ],
    hints: [
      'Four are accurate. One reverses the order that actually matters here.',
      'Ask what a snapshot taken after termination could possibly still capture that was running in memory.',
      'The problem is not the speed of the snapshot, it is what no longer exists to be snapshotted once the instance is gone.',
    ],
    solution:
      'A, B, C, and D. Capturing state before terminating preserves evidence that termination-first ' +
      'destroys outright, a volume snapshot preserves disk state independent of the running instance, ' +
      'memory capture adds what a disk image alone misses, and network isolation is a sound ' +
      'containment step once capture is done. E focuses on how fast a snapshot can be taken, but that ' +
      'speed is irrelevant if the instance has already been terminated: a snapshot taken after ' +
      'termination captures nothing, because the running memory and processes it would have shown are ' +
      'already gone.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option focuses on how quickly a snapshot can be taken while ignoring that termination first destroys what the snapshot would have captured.',
      },
    ],
    debrief:
      'The order here is the whole lesson: capture, then contain. Reversing it is understandable under ' +
      'pressure and it is the single most common way a cloud incident loses its own evidence.',
    practice: [],
  },
  {
    id: 'csf.8.3',
    moduleId: 'csf.8',
    packageId: 'cloud-security-foundations',
    order: 3,
    title: 'Revoke now, rotate to recover',
    kind: 'multiple-choice',
    goal: 'Distinguish revoking a credential from rotating it, and sequence the two correctly.',
    prompt:
      'Which of the following are accurate about revoking and rotating a credential during an ' +
      'incident? Select all that apply.',
    teach: {
      concept:
        'Revoking and rotating a credential are related and not identical, and the difference matters ' +
        'most in the middle of an incident. REVOKING disables the credential immediately: it stops ' +
        'working the moment the action is taken, which is exactly what you want for a credential you ' +
        'believe is compromised right now. ROTATING issues a new, working credential to replace the ' +
        'one that was revoked or is being retired, which is what restores the legitimate service or ' +
        'user that depended on it.\n\n' +
        'Revoking without rotating stops the attacker and also stops whatever legitimate process ' +
        'depended on that credential, which is sometimes exactly the right trade in the first minute ' +
        'of an incident, and is rarely acceptable as the final state. The two actions are usually ' +
        'sequenced together, revoke first to contain, rotate immediately after to restore service, ' +
        'rather than treated as alternatives to choose between.',
    },
    options: [
      { id: 'a', label: 'Revoking a credential disables it immediately, which is the appropriate first action against one believed to be compromised right now.' },
      { id: 'b', label: 'Rotating a credential issues a new, working one to replace the credential that was revoked or retired.' },
      { id: 'c', label: 'Revoking without also rotating stops both the attacker and any legitimate process that depended on the same credential.' },
      { id: 'd', label: 'The two actions are usually sequenced together during an incident, revoke to contain immediately, then rotate to restore service.' },
      { id: 'e', label: 'Rotating a credential on its own, without revoking the old one, is sufficient to stop an attacker who already holds it.' },
    ],
    hints: [
      'Four are accurate. One assumes issuing a new credential alone disables the old one.',
      'Ask what happens to the old credential if you only ever create a new one and never invalidate it.',
      'Rotation adds a working credential. Revocation is what actually removes the old one from service.',
    ],
    solution:
      'A, B, C, and D. Revocation is the immediate containment action, rotation is the restoration ' +
      'action, revoking alone has the side effect of also stopping legitimate use, and the two are ' +
      'normally sequenced together rather than treated as a choice. E assumes creating a new ' +
      'credential automatically disables the old one, but unless the old credential is explicitly ' +
      'revoked, an attacker who already holds it can keep using it entirely undisturbed by the fact ' +
      'that a new, separate credential now also exists.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes issuing a new credential alone stops the old, compromised one from continuing to work.',
      },
    ],
    debrief:
      'If you only remember one distinction from this exercise, make it this one: rotation without ' +
      'revocation leaves the attacker exactly where they were, with an unrelated new credential now ' +
      'also in play.',
    practice: [],
  },
  {
    id: 'csf.8.4',
    moduleId: 'csf.8',
    packageId: 'cloud-security-foundations',
    order: 4,
    title: 'Why cloud incident response moves faster',
    kind: 'multiple-choice',
    goal: 'Understand the two forces that raise the pace of cloud incident response.',
    prompt:
      'Which of the following are accurate about why cloud incident response typically has to move ' +
      'faster than traditional on-premises response? Select all that apply.',
    teach: {
      concept:
        'Two forces push the pace of cloud incident response well past what most on-premises response ' +
        'was built around. The first is that the same automation that makes cloud infrastructure ' +
        'convenient, everything reachable through an API, everything scriptable, is equally available ' +
        'to an attacker: a compromised credential can be used to enumerate, create, and destroy ' +
        'resources across an entire account in minutes through the same API a legitimate administrator ' +
        'uses. The second is the ephemeral infrastructure covered earlier in this module: waiting to ' +
        'respond risks the evidence disappearing on its own, regardless of what the attacker does ' +
        'next.\n\n' +
        'Together these mean a response measured in hours, which was often acceptable for a contained ' +
        'on-premises incident, can be too slow to matter in the cloud: by the time a human has ' +
        'approved a containment step through a slow change process, an automated attacker may already ' +
        'have finished, and the resource that would have proven it may already be gone.',
    },
    options: [
      { id: 'a', label: 'The same API automation that makes cloud infrastructure convenient for administrators is equally available to an attacker who holds valid credentials.' },
      { id: 'b', label: 'A compromised credential can be used to enumerate, create, and destroy resources across an account in minutes through the same API a legitimate administrator uses.' },
      { id: 'c', label: 'Ephemeral infrastructure adds pressure independent of the attacker, since evidence can disappear on its own regardless of what the attacker does next.' },
      { id: 'd', label: 'A response process built around a slow, human approval step for every containment action can be too slow to matter against this pace.' },
      { id: 'e', label: 'Since cloud incidents move faster, careful verification before taking a containment action matters less than it did in on-premises response.' },
    ],
    hints: [
      'Four are accurate. One treats speed as a reason to skip a step rather than a reason to make that step faster.',
      'A faster incident does not need less verification, it needs verification that does not cost as much time.',
      'Ask what happens if a fast, unverified containment action turns out to be wrong.',
    ],
    solution:
      'A, B, C, and D. Attacker automation and evidence that can disappear on its own both push the ' +
      'pace, and a response process built for a slower era can fail simply by being too slow to ' +
      'matter. E treats speed as a reason to verify less, but an unverified containment action taken ' +
      'in haste, disabling the wrong account, terminating the wrong resource, causes its own damage, ' +
      'and the actual answer to needing speed is building faster verification, not skipping it.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats the need for speed as a reason to reduce verification rather than a reason to make verification faster.',
      },
    ],
    debrief:
      'Fast and careless are not the same requirement. The teams that do this well built the ability ' +
      'to verify and act quickly, they did not simply decide to skip the verifying.',
    practice: [],
  },
  {
    id: 'csf.8.5',
    moduleId: 'csf.8',
    packageId: 'cloud-security-foundations',
    order: 5,
    title: 'Explain why "pull the plug" does not translate',
    kind: 'short-answer',
    goal: 'Adapt the traditional containment instinct to infrastructure that can disappear on its own.',
    prompt:
      'A colleague trained on traditional incident response suggests: "Just pull the plug on the ' +
      'compromised server the way we always did." In three or four sentences, explain why that ' +
      'instinct needs to change in a cloud environment.',
    teach: {
      concept:
        'The instinct behind pull the plug is sound: stop the compromised system from doing further ' +
        'damage. What does not translate is the assumption that the system will still be there to ' +
        'examine afterward, and the assumption that disconnecting power is even the mechanism ' +
        'available. There is no physical plug: the equivalent action is usually terminating or ' +
        'isolating a virtual resource through an API, and depending on how the workload is managed, ' +
        'that resource may be automatically replaced within seconds, or may simply cease to exist with ' +
        'nothing left to examine.\n\n' +
        'A good answer keeps the sound part of the instinct, stop the damage, and corrects the ' +
        'sequencing: capture the evidence, a volume snapshot, relevant logs, before taking the action ' +
        'that makes the resource disappear, rather than after.',
    },
    hints: [
      'Say what part of the instinct is still correct, since the goal has not actually changed.',
      'Say specifically what is different about cloud infrastructure that makes the old sequence risky.',
      'A strong answer proposes the corrected order: capture evidence first, then take the containment action.',
    ],
    solution:
      'The goal behind the instinct is still correct: stop the compromised system before it does more ' +
      'damage. What is different is that there is no physical plug, the equivalent action is an API ' +
      'call that terminates or isolates a virtual resource, and depending on how the workload is ' +
      'managed that resource can be automatically replaced or can simply cease to exist, taking the ' +
      'disk state and running memory with it. The sequence needs to change rather than the goal: ' +
      'capture a volume snapshot and the relevant logs first, and only take the action that removes or ' +
      'replaces the resource once that evidence is secured, rather than containing first and ' +
      'discovering afterward that nothing is left to examine.',
    expectedOutput:
      'An answer keeping the underlying goal of stopping the damage, naming what is different about ' +
      'cloud infrastructure, and proposing capturing evidence before the containment action rather ' +
      'than after.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['stop the damage', 'goal', 'still correct', 'contain'],
          ['no physical plug', 'api call', 'terminate', 'ephemeral', 'disappear', 'replaced'],
          ['capture', 'snapshot', 'evidence first', 'before terminating', 'before taking action'],
        ],
        hint: 'Three ideas: what is still correct about the instinct, what is actually different about cloud infrastructure, and the corrected order of operations.',
      },
    ],
    debrief:
      'This colleague is not wrong to want to stop the bleeding quickly. The fix is not to slow them ' +
      'down, it is to move the evidence capture ahead of the action they already want to take.',
    practice: [],
  },
];

export const CLOUD_SECURITY_FOUNDATIONS: LearningPackage = {
  id: 'cloud-security-foundations',
  order: 25,
  title: 'Cloud Security Foundations',
  summary:
    'Securing workloads once the data centre belongs to somebody else: the shared responsibility ' +
    'model and where its line actually falls across IaaS, PaaS, and SaaS, IAM as the perimeter that ' +
    'replaced the firewall, how a storage bucket ends up public and why it keeps happening, security ' +
    'groups against network access control lists, what an activity log actually records and what an ' +
    'intrusion looks like inside one, hardcoded credentials and what a managed key service buys you, ' +
    'infrastructure as code and the drift that creeps in around it, and how incident response changes ' +
    'once the infrastructure itself can disappear before you get to it.',
  outcomes: [
    'Place a specific security decision correctly on either side of the shared responsibility line, across IaaS, PaaS, and SaaS',
    'Read an IAM policy fragment and judge whether it is over-permissioned, and explain the difference between identity-based and resource-based policies',
    'Recognise the recurring patterns behind a publicly exposed storage bucket, including a grant to authenticated users',
    'Distinguish a stateful security group from a stateless network access control list, and judge a rule table for over-permissive rules',
    'Explain what a cloud activity log actually records, and recognise the shape of an intrusion inside one',
    'Explain why a hardcoded credential must be rotated rather than merely deleted, and what a managed key service buys you',
    'Explain why a misconfiguration in infrastructure code replicates at scale, and what configuration drift is',
    'Adapt incident response to ephemeral infrastructure: capture evidence before it can disappear, and choose correctly between revoking and rotating a credential',
  ],
  /*
   * No prerequisite: this audience arrives from IT operations, sysadmin, and
   * DevOps work rather than from elsewhere in the catalogue, and gating them
   * behind an unrelated package would turn away exactly the people this track
   * is built for. Nothing here needs a terminal, for the same reason the OT
   * track has none: there is no simulated cloud console in this platform, and
   * the judgement calls this package teaches do not require one.
   */
  prerequisites: [],
  modules: [
    {
      id: 'csf.1',
      packageId: 'cloud-security-foundations',
      order: 1,
      title: 'The shared responsibility model',
      summary:
        'What the provider secures against what the customer secures, how the line moves across ' +
        'IaaS, PaaS, and SaaS, and why a public bucket or an over-permissioned function is never a ' +
        'platform failure.',
      exercises: MODULE_CSF_1,
    },
    {
      id: 'csf.2',
      packageId: 'cloud-security-foundations',
      order: 2,
      title: 'Cloud IAM and least privilege',
      summary:
        'Why identity is the new perimeter, reading an IAM policy fragment for over-permission, ' +
        'identity-based against resource-based policies, and preferring short-lived credentials over ' +
        'long-lived keys.',
      exercises: MODULE_CSF_2,
    },
    {
      id: 'csf.3',
      packageId: 'cloud-security-foundations',
      order: 3,
      title: 'Storage exposure',
      summary:
        'How a storage bucket ends up public, why it keeps happening despite years of warnings, what ' +
        'a grant to authenticated users actually means, and how to fix an exposure without breaking ' +
        'the legitimate use of it.',
      exercises: MODULE_CSF_3,
    },
    {
      id: 'csf.4',
      packageId: 'cloud-security-foundations',
      order: 4,
      title: 'Network boundaries in the cloud',
      summary:
        'Stateful security groups against stateless network access control lists, why a cloud network ' +
        'has no trusted inside, and reading a rule table or a peering connection for what it actually ' +
        'allows.',
      exercises: MODULE_CSF_4,
    },
    {
      id: 'csf.5',
      packageId: 'cloud-security-foundations',
      order: 5,
      title: 'Logging and detection in the cloud',
      summary:
        'What a CloudTrail-style activity log actually records, why a missing log is itself a finding, ' +
        'and the enumeration, key creation, and permission change pattern an early intrusion leaves ' +
        'behind.',
      exercises: MODULE_CSF_5,
    },
    {
      id: 'csf.6',
      packageId: 'cloud-security-foundations',
      order: 6,
      title: 'Secrets and key management',
      summary:
        'Hardcoded credentials as a recurring real cause of breaches, what a managed key service ' +
        'buys you, and why a committed secret must be rotated rather than merely deleted.',
      exercises: MODULE_CSF_6,
    },
    {
      id: 'csf.7',
      packageId: 'cloud-security-foundations',
      order: 7,
      title: 'Infrastructure as code and drift',
      summary:
        'Why a misconfiguration in a reused module is reproduced at scale, what a pre-deployment ' +
        'scanner catches against what it cannot, and configuration drift between the code and the ' +
        'running environment.',
      exercises: MODULE_CSF_7,
    },
    {
      id: 'csf.8',
      packageId: 'cloud-security-foundations',
      order: 8,
      title: 'Incident response differences in the cloud',
      summary:
        'Ephemeral infrastructure that can disappear before you investigate it, snapshotting before ' +
        'termination, revoking against rotating a credential, and why cloud incident response has to ' +
        'move faster than on-premises response.',
      exercises: MODULE_CSF_8,
    },
  ],
};
