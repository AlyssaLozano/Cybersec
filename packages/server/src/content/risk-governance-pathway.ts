/**
 * Risk Management and AI Governance: the twelve-module route from "what is a
 * risk" to being ready to make risk calls at speed.
 *
 * WHAT THIS PACKAGE IS FOR
 *
 * Everything else in the catalogue teaches somebody to find a problem. This one
 * teaches the argument that decides whether the problem gets fixed: what the
 * asset is worth, how likely the failure is, what the control costs, who signed
 * for the residual, and what happens on the day nobody funded it. That argument
 * is a separate skill from detection, and it is the one that gets a junior into
 * the room where budgets are set.
 *
 * WHY AI GOVERNANCE IS WOVEN THROUGH IT RATHER THAN BOLTED ON THE END
 *
 * The source specification is explicit that AI is a business risk and not a
 * technical curiosity, and the structure follows from that: every module carries
 * both halves. Assets includes model weights and training corpora. Threat
 * modelling runs STRIDE over a retrieval pipeline. Continuity asks what a
 * business does on the morning its model service is down. A student who learned
 * traditional risk in modules 1 to 6 and AI in a separate appendix would file AI
 * findings in a separate register, which is the failure this ordering prevents.
 *
 * WHAT IT DELIBERATELY DOES NOT RE-TEACH
 *
 * The AI Security Pathway already covers the attack surface, prompt injection,
 * memorisation, fairness testing, and the regulatory tiers, and AI Security puts
 * a student in the Model Lab to prove it. Nothing here repeats that material. It
 * assumes the finding and asks the question those packages stop short of: what
 * is it worth, what does the fix cost, and what do you tell the board.
 *
 * WHY IT IS GRADED AS JUDGEMENT
 *
 * The specification asks for a sixty to seventy-five page capstone report and a
 * facilitated tabletop exercise. Neither is gradeable here, for the reason
 * recorded against the other pasted specifications in docs/content-issues.md: a
 * rubric cannot honestly mark sixty pages, and a facilitator cannot be simulated
 * by a text box. What survives translation is the reasoning, which is the part a
 * junior actually lacks. Every exercise grades a determination.
 *
 * SEVERAL OF THE SPECIFICATION WORKED EXAMPLES ARE WRONG, AND THAT IS USEFUL
 *
 * Its risk matrix is non-monotonic, its governance risk score contradicts
 * itself, and its recommendation-engine example multiplies a per-lawsuit cost by
 * a billion events and arrives at five hundred billion dollars. Rather than
 * quietly correcting them, the modules that touch quantification teach the
 * failure directly, because producing a number nobody believes is the most
 * common way a real risk assessment dies. See docs/content-issues.md, items 23
 * to 26.
 */

import type { LearningPackage } from '@soc/shared';

// --- shared teaching material ------------------------------------------------

const VOCABULARY_TEACH = {
  concept:
    'Five words carry the whole subject, and they are not interchangeable. An ASSET is the thing ' +
    'worth protecting: customer records, the payment path, a trained model, the reputation. A ' +
    'THREAT is an actor or event that could harm it: a ransomware crew, a failed disk, a careless ' +
    'contractor. A VULNERABILITY is the weakness the threat needs: an unpatched host, a backup ' +
    'nobody has restored from, a corpus anybody can write into. A RISK is the three of them ' +
    'together with a consequence attached, which is why a risk is a sentence and not a noun. A ' +
    'CONTROL is what you put in the way.\n\n' +
    'The distinction earns its keep in the register. "Unpatched server" is not a risk, it is a ' +
    'vulnerability, and written that way it has no owner, no cost, and nothing to decide. ' +
    '"Ransomware reaches the file server through an unpatched edge host, and we cannot restore ' +
    'inside a week" is a risk: it names who, how, what it reaches, and what it costs. Registers ' +
    'full of nouns are the reason risk work gets ignored.',
} as const;

const AI_RISK_TEACH = {
  concept:
    'A model does not fail the way a program fails. A program does what somebody wrote, so its ' +
    'defects are findable by reading and fixable by editing. A model does what it was fitted to ' +
    'do, which nobody wrote down and nobody can read back, so its defects are found by measuring ' +
    'and fixed by retraining, by changing the system around it, or by taking it out of the ' +
    'decision.\n\n' +
    'That has three consequences for a risk register. First, the evidence is empirical and ' +
    'therefore partial: testing tells you about the inputs you tried. Second, the failure mode is ' +
    'often quiet, because a model that has degraded still returns confident answers in the right ' +
    'format. Third, the harm is frequently done to people outside the company, which puts it in ' +
    'the regulatory and reputational columns rather than the availability one. None of that makes ' +
    'AI risk special enough to need its own register. It makes it a risk category the existing ' +
    'register has to be able to hold.',
} as const;

export const RISK_GOVERNANCE: LearningPackage = {
  id: 'risk-governance',
  order: 12,
  title: 'Risk Management and AI Governance',
  summary:
    'The structured route into risk work: frameworks and vocabulary, assets and criticality, ' +
    'threat modelling, vulnerability and gap analysis, scoring that survives scrutiny, control ' +
    'design, continuity and recovery, compliance mapping, budget and treatment decisions, ' +
    'tabletop validation, and the governance that decides whether an AI system ships. Traditional ' +
    'risk and AI governance are taught together, in every module.',
  outcomes: [
    'Write a risk as a sentence with an actor, a path, an asset, and a consequence, rather than as a noun.',
    'Tier assets by what their loss does to the business, and find the single points of failure nobody drew.',
    'Run STRIDE and a lifecycle threat model over an AI system, and say which threats are worth the register.',
    'Choose an assessment method for what it can actually establish, and state its limits honestly.',
    'Quantify a risk defensibly, and recognise the arithmetic that produces numbers nobody believes.',
    'Design preventive, detective, and corrective controls for one risk, and say how you would know each works.',
    'Set RTO and RPO from business impact, and plan continuity for a service whose behaviour was learned.',
    'Map an obligation to the evidence that proves it, and separate compliance from safety.',
    'Choose between mitigate, accept, avoid, and transfer, and write the acceptance so it can be audited.',
    'Run a tabletop that produces findings about the plan, and fold them back into the assessment.',
    'Brief an executive on a mixed portfolio of traditional and AI risk in a paragraph they can act on.',
  ],
  /*
   * The specification names SOC Foundations as the orientation prerequisite, and
   * it is right to: most of this material is about how findings move through an
   * organisation, and a student who has not yet seen what a SOC is has no mental
   * model of the organisation to hang it on.
   */
  prerequisites: ['soc-foundations'],
  modules: [
    {
      id: 'rmg.1',
      packageId: 'risk-governance',
      order: 1,
      title: 'Risk fundamentals, and where AI sits in the picture',
      summary:
        'The vocabulary that makes a register useful, what the frameworks each give you, the ' +
        'difference between risk and compliance, and why AI arrived as a risk category rather ' +
        'than as a technology.',
      exercises: [
        {
          id: 'rmg.1.1',
          moduleId: 'rmg.1',
          packageId: 'risk-governance',
          order: 1,
          title: 'Five words that are not synonyms',
          kind: 'multiple-choice',
          goal: 'Separate asset, threat, vulnerability, risk, and control well enough to write a register line.',
          prompt:
            'Northwind keeps customer records on a file server. The edge VPN appliance is two ' +
            'versions behind, ransomware crews are known to target that appliance, and the last ' +
            'restore test was eighteen months ago. Which of the following statements are correct ' +
            'uses of the vocabulary? Select all that apply.',
          teach: VOCABULARY_TEACH,
          options: [
            { id: 'a', label: 'The customer records are the asset.' },
            { id: 'b', label: 'The unpatched appliance is a vulnerability, not a risk.' },
            { id: 'c', label: 'The ransomware crews are the risk.' },
            { id: 'd', label: 'An untested restore is a vulnerability, because it is a weakness that turns an incident into a long outage.' },
            { id: 'e', label: 'The risk is best stated as ransomware reaching the file server through the unpatched appliance, with recovery uncertain because restores are untested.' },
          ],
          hints: [
            'Four of the five are correct. One of them names an actor and calls it a risk.',
            'A risk has to carry a consequence. Which option is the only one that is a whole sentence about something happening to something?',
            'Ask of each noun: could I assign an owner and a cost to this line? If not, it is a component of a risk rather than the risk.',
          ],
          solution:
            'A, B, D, and E. The records are what is worth protecting. The unpatched appliance and ' +
            'the untested restore are both weaknesses, and the second is the kind people forget to ' +
            'write down because nothing is visibly broken. C is the common slip: a ransomware crew ' +
            'is a threat actor, and calling the actor the risk leaves a register line with no ' +
            'consequence in it and therefore nothing to decide. E is what the line should actually ' +
            'say, because it names the actor, the path, the asset, and the harm, which is enough ' +
            'for somebody to price a fix against.',
          expectedOutput: 'Options A, B, D, and E selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'd', 'e'],
              hint:
                'One option names a group of attackers and calls that the risk. An actor is a ' +
                'threat; the risk is what happens when they reach something.',
            },
          ],
          debrief:
            'This is the most boring page in the package and the one that changes your output the ' +
            'most. Registers written in nouns get filed. Registers written in sentences get funded.',
          practice: [],
        },
        {
          id: 'rmg.1.2',
          moduleId: 'rmg.1',
          packageId: 'risk-governance',
          order: 2,
          title: 'What the frameworks actually give you',
          kind: 'multiple-choice',
          goal: 'Know what NIST RMF, ISO 31000, and COSO are each for, and stop treating them as rivals.',
          prompt:
            'A programme manager asks which risk framework the company should adopt, and treats ' +
            'NIST RMF, ISO 31000, and COSO ERM as three competing answers to one question. Which ' +
            'of the following are accurate? Select all that apply.',
          teach: {
            concept:
              'The three frameworks people name most often are not alternatives, because they were ' +
              'written for different scopes. NIST RMF is a process for authorising a SYSTEM to ' +
              'operate: categorise it, select and implement controls, assess them, have somebody ' +
              'accountable authorise it, then monitor. It assumes a control catalogue behind it, ' +
              'which is SP 800-53. ISO 31000 is a generic risk process for an ORGANISATION and is ' +
              'deliberately domain-neutral: establish context, identify, analyse, evaluate, treat, ' +
              'monitor, communicate. COSO ERM is written for the BOARD, tying risk to strategy, ' +
              'objectives, and reporting.\n\n' +
              'They share a spine: understand the context, find the risks, size them, decide what ' +
              'to do, and keep watching. What differs is who the audience is and what the output ' +
              'is meant to authorise. Choosing between them is mostly a question of who has to ' +
              'sign, and it is normal for one organisation to use all three at different altitudes.',
          },
          options: [
            { id: 'a', label: 'NIST RMF ends in an accountable person authorising a system to operate, and continues into monitoring afterwards.' },
            { id: 'b', label: 'ISO 31000 is deliberately generic, so it covers risks that have nothing to do with security.' },
            { id: 'c', label: 'COSO ERM is aimed at enterprise and board-level risk, tied to strategy and objectives.' },
            { id: 'd', label: 'Adopting one framework means the others cannot be used anywhere in the organisation.' },
            { id: 'e', label: 'All three share the same underlying flow: identify, analyse, respond, monitor, improve.' },
          ],
          hints: [
            'Four are accurate. One treats the frameworks as mutually exclusive, which is a procurement idea rather than a risk idea.',
            'Ask who the output of each framework is addressed to: a system owner, any manager anywhere, or the board.',
            'If the flows are the same underneath, what is actually different between them?',
          ],
          solution:
            'A, B, C, and E. RMF authorises a system and keeps monitoring it, ISO 31000 is ' +
            'domain-neutral by design and is routinely used for supply chain and financial risk, ' +
            'COSO speaks to the board, and all three run the same identify, analyse, respond, ' +
            'monitor loop. D is wrong and worth naming out loud, because framework arguments ' +
            'consume months: a company can authorise systems with RMF, run enterprise risk with ' +
            'ISO 31000, and report to the board in COSO language without contradiction. What you ' +
            'should not do is run two registers.',
          expectedOutput: 'Options A, B, C, and E selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'e'],
              hint:
                'One option says picking a framework rules the others out. Check whether the three ' +
                'are even answering the same question.',
            },
          ],
          debrief:
            'When somebody asks which framework to adopt, the useful reply is a question: what ' +
            'decision are we trying to make, and who has to sign it.',
          practice: [],
        },
        {
          id: 'rmg.1.3',
          moduleId: 'rmg.1',
          packageId: 'risk-governance',
          order: 3,
          title: 'We passed the audit, so we are low risk',
          kind: 'short-answer',
          goal: 'Explain the difference between being compliant and being safe, without dismissing the audit.',
          prompt:
            'A director tells you the company completed its annual certification with no major ' +
            'findings, and concludes that its security risk is therefore low. In three or four ' +
            'sentences, say what that conclusion does and does not follow from.',
          teach: {
            concept:
              'An audit measures conformance to a standard at a point in time, using sampled ' +
              'evidence. That is a real and useful thing to know, and dismissing it makes you ' +
              'sound like somebody who has never had to prove anything to anybody. What it does ' +
              'not measure is whether the organisation would survive a competent attacker, because ' +
              'the standard was written to be broadly applicable and is therefore not tuned to ' +
              'this company, its crown jewels, or the parts of its estate that were out of scope.' +
              '\n\n' +
              'Three gaps do the damage. Scope: the systems assessed are rarely all the systems ' +
              'that exist, and shadow IT and recent acquisitions are the classic omissions. Time: ' +
              'a clean audit describes the month it was done, and the estate changed the week ' +
              'after. Depth: a control can exist, be documented, and still be ineffective, which ' +
              'is the difference between "backups are configured" and "we restored one on ' +
              'Tuesday". A good answer says the audit is evidence about conformance and scope, and ' +
              'names testing, coverage, or currency as the evidence that would support the risk ' +
              'claim instead.',
          },
          hints: [
            'Do not attack the audit. Say precisely what it measured, then say what the risk claim would need on top of that.',
            'Three words are doing the work here: scope, time, and effectiveness.',
            'A good answer distinguishes conformance to a standard from resistance to an attacker, and names what evidence would actually support a low-risk claim, such as testing effectiveness or covering what was excluded.',
          ],
          solution:
            'The certification is evidence that the controls in scope conformed to the standard on ' +
            'the dates that were sampled, which is worth having and is not the same claim as being ' +
            'low risk. It says nothing about the systems that were excluded, nothing about changes ' +
            'made since the fieldwork, and nothing about whether a control that exists is actually ' +
            'effective against the attackers who target us, because a documented backup and a ' +
            'tested restore are different findings. To support the low-risk conclusion I would ' +
            'want coverage of the estate the audit left out, evidence that key controls were ' +
            'tested rather than merely present, and a current view rather than an annual one.',
          expectedOutput:
            'An answer that credits the audit for what it establishes about conformance, names the ' +
            'limits of scope, currency, or effectiveness, and says what evidence would actually ' +
            'support a claim about risk.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['conform', 'standard', 'certif', 'controls in scope', 'sampled', 'point in time'],
                ['excluded', 'left out', 'out of scope', 'changed since', 'currency', 'current view'],
                ['test', 'effective', 'restore', 'evidence', 'measur', 'attacker'],
              ],
              hint:
                'Three ideas: what the audit did establish, which limit undercuts the leap to low ' +
                'risk, and what evidence would support the risk claim instead.',
            },
          ],
          debrief:
            'Compliance is a floor somebody else drew. It is a decent floor. It is not a ceiling ' +
            'and it is not a forecast.',
          practice: [],
        },
        {
          id: 'rmg.1.4',
          moduleId: 'rmg.1',
          packageId: 'risk-governance',
          order: 4,
          title: 'Why AI arrived as a risk category',
          kind: 'multiple-choice',
          goal: 'Say what is genuinely different about AI risk, and resist the claim that it needs its own universe.',
          prompt:
            'Northwind has put a model into its loan decision path. Which of the following are ' +
            'genuinely different about this risk compared with the rest of the register? Select ' +
            'all that apply.',
          teach: AI_RISK_TEACH,
          options: [
            { id: 'a', label: 'The behaviour was fitted from data rather than written, so there is no source to review for the decision logic.' },
            { id: 'b', label: 'It can fail quietly: a degraded model keeps returning confident, well-formatted answers.' },
            { id: 'c', label: 'The harm can land on applicants outside the company, which puts it in the regulatory and reputational columns.' },
            { id: 'd', label: 'It needs a separate risk register, owned by the data science team.' },
            { id: 'e', label: 'Its performance can decay without anybody deploying a change, because the population it scores moves.' },
          ],
          hints: [
            'Four are genuinely different. One is an organisational instinct that makes the problem worse.',
            'What happens to a traditional service when it breaks? Something errors. What happens when a model degrades?',
            'Ask who reads a second register, and when.',
          ],
          solution:
            'A, B, C, and E. Learned behaviour has no reviewable logic, degradation is silent, the ' +
            'harm falls on people the company does not employ, and drift changes performance with ' +
            'no deployment to point at. D is the trap. A separate AI register owned by the team ' +
            'that builds the models means the risk is reported by the people with the strongest ' +
            'incentive to discount it, and it never reaches the committee that funds anything. AI ' +
            'risk belongs in the same register, with the same scoring, sitting next to the ' +
            'unpatched appliance so somebody can choose between them.',
          expectedOutput: 'Options A, B, C, and E selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'e'],
              hint:
                'One option separates AI risk from everything else organisationally. Ask who would ' +
                'then own it, and whether that person can be objective about it.',
            },
          ],
          debrief:
            'Everything in the remaining eleven modules follows this rule: one register, one ' +
            'scoring scheme, AI findings in the same queue as everything else.',
          practice: [],
        },
      ],
    },
    {
      id: 'rmg.2',
      packageId: 'risk-governance',
      order: 2,
      title: 'Assets, criticality, and the failures nobody drew',
      summary:
        'Inventory as the thing every other step depends on, tiering by consequence rather than ' +
        'by cost, single points of failure, and what an AI system actually consists of.',
      exercises: [
        {
          id: 'rmg.2.1',
          moduleId: 'rmg.2',
          packageId: 'risk-governance',
          order: 1,
          title: 'What makes an asset critical',
          kind: 'multiple-choice',
          goal: 'Tier assets by consequence of loss, not by how much they cost or how new they are.',
          prompt:
            'You are tiering Northwind assets. Which of the following are sound reasons to put ' +
            'something in the top tier? Select all that apply.',
          teach: {
            concept:
              'Criticality is a statement about consequence, not about price. The question is not ' +
              '"what did this cost" but "what happens to the business while this is gone, and how ' +
              'long can we stand it". Four factors settle it in practice. Business impact: how ' +
              'quickly the loss becomes intolerable, measured in minutes, hours, or days. ' +
              'Dependency: how many other things stop when this stops, which is why a small, ' +
              'cheap, shared component often outranks an expensive one. Data sensitivity: what is ' +
              'inside it and who is harmed if it leaks. Regulatory standing: whether an obligation ' +
              'attaches to it, because that removes your discretion about how fast to recover.\n\n' +
              'Two things routinely mislead people. Replacement cost is a weak proxy, because a ' +
              'cheap certificate authority can take down every service in the estate while an ' +
              'expensive analytics cluster can be down for a week without a customer noticing. And ' +
              'recency is not criticality: the newest system is the one most likely to be ' +
              'over-tiered, because it is the one people are currently excited about.',
          },
          options: [
            { id: 'a', label: 'The business can tolerate its loss for minutes rather than days.' },
            { id: 'b', label: 'A large number of other systems stop working when it stops.' },
            { id: 'c', label: 'It holds regulated personal data, so an obligation attaches to its loss or exposure.' },
            { id: 'd', label: 'It was the most expensive item in last year\'s capital budget.' },
            { id: 'e', label: 'It is the newest system and the executive team is enthusiastic about it.' },
          ],
          hints: [
            'Three are sound. Two are proxies for something other than consequence.',
            'Ask what each option would predict about the morning the asset is unavailable.',
            'An expensive thing whose absence nobody notices for a week is not critical, however much it cost.',
          ],
          solution:
            'A, B, and C. Tolerable outage duration, dependency fan-out, and regulatory standing ' +
            'all speak directly to what happens when the asset is gone. D and E are the two most ' +
            'common substitutions. Capital cost measures what you paid a supplier and predicts ' +
            'nothing about consequence; the classic counterexample is a certificate authority or ' +
            'an internal DNS service, which cost almost nothing and take the estate with them. ' +
            'Enthusiasm is worse, because it inflates the tier of the system with the least ' +
            'operational history and therefore the least evidence about how it fails.',
          expectedOutput: 'Options A, B, and C selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c'],
              hint:
                'Two options measure something other than the consequence of loss. One is a price ' +
                'tag and one is a mood.',
            },
          ],
          debrief:
            'The inventory is the least glamorous artefact in risk work and every later step is ' +
            'wrong without it. You cannot score what you did not know you had.',
          practice: [],
        },
        {
          id: 'rmg.2.2',
          moduleId: 'rmg.2',
          packageId: 'risk-governance',
          order: 2,
          title: 'Finding the single point of failure',
          kind: 'multiple-choice',
          goal: 'Spot dependencies that turn one failure into an outage of everything.',
          prompt:
            'Northwind runs its ordering service across three application servers behind a load ' +
            'balancer, all in one availability zone. They share one database primary with an ' +
            'asynchronous replica, authenticate against one identity provider, and one engineer ' +
            'holds the only working knowledge of the deployment pipeline. Which of these are ' +
            'single points of failure? Select all that apply.',
          teach: {
            concept:
              'A single point of failure is any component whose loss stops the whole service, and ' +
              'the reason they survive review is that architecture diagrams are drawn to show ' +
              'intent rather than dependency. The method that finds them is mechanical: take each ' +
              'component in turn, assume it is gone, and ask what still serves a customer. ' +
              'Redundancy only counts if it can actually take over, which means tested failover ' +
              'and enough capacity to carry the load alone.\n\n' +
              'Three categories get missed. Shared infrastructure underneath apparent redundancy: ' +
              'three servers in one zone are one zone. Control-plane dependencies: identity, DNS, ' +
              'and certificates are not on the data path in anybody\'s diagram and stop everything ' +
              'when they fail. And people: one person who alone can deploy, or alone understands ' +
              'the recovery, is a single point of failure with a holiday calendar. That last one is ' +
              'the hardest to raise politely and the cheapest to fix.',
          },
          options: [
            { id: 'a', label: 'The single availability zone, because the three application servers share it.' },
            { id: 'b', label: 'The database primary, since the replica is asynchronous and promotion is a manual decision.' },
            { id: 'c', label: 'The identity provider, because nobody can authenticate without it.' },
            { id: 'd', label: 'The engineer who alone knows how to deploy.' },
            { id: 'e', label: 'The three application servers, because three is fewer than four.' },
          ],
          hints: [
            'Four qualify. One is a count rather than a dependency.',
            'Take each component away in turn and ask whether a customer can still place an order.',
            'Two of the four are not on the diagram at all: one is infrastructure underneath it, one is a person.',
          ],
          solution:
            'A, B, C, and D. The zone is shared by all three servers, so the redundancy is only ' +
            'against a host failure and not against anything larger. The asynchronous replica is a ' +
            'recovery option with data loss and a manual step, not a hot standby. Identity is a ' +
            'control-plane dependency that stops everything and appears on no data-flow diagram. ' +
            'And the single engineer is a real single point of failure, which is why cross-training ' +
            'and a written runbook are risk controls rather than management niceties. E is not a ' +
            'finding: three servers that can each carry the load is redundancy, and adding a fourth ' +
            'changes nothing about the dependencies that actually bind them.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option treats a headcount of servers as the problem. The problem is what they ' +
                'have in common, not how many of them there are.',
            },
          ],
          debrief:
            'Write the people ones down. They are the finding most often left out of the report ' +
            'because it feels like an accusation, and they are the cheapest ones to fix.',
          practice: [],
        },
        {
          id: 'rmg.2.3',
          moduleId: 'rmg.2',
          packageId: 'risk-governance',
          order: 3,
          title: 'What an AI system consists of',
          kind: 'multiple-choice',
          goal: 'Inventory an AI system as the several assets it actually is, not as one line called "the model".',
          prompt:
            'You are adding Northwind\'s fraud scoring model to the asset inventory. Which of the ' +
            'following belong in the inventory as assets in their own right? Select all that apply.',
          teach: {
            concept:
              'Written as one line, "the fraud model" hides most of what can be lost. The trained ' +
              'artefact is only the visible part. The TRAINING CORPUS is usually the most sensitive ' +
              'asset in the set, because it is customer data at rest with a long retention and a ' +
              'weak access story. The FEATURE PIPELINE is the code and configuration that turns raw ' +
              'input into what the model expects, and a model restored without the pipeline that ' +
              'fed it is silently wrong rather than obviously broken. The MODEL REGISTRY is what ' +
              'tells you which version is in production, which is the artefact every audit and ' +
              'every incident asks for first. The SERVING DEPLOYMENT is the availability asset.\n\n' +
              'Two more are easy to miss. The EVALUATION SET, because without it you cannot ' +
              'demonstrate the model still performs, and the labels themselves are often expensive ' +
              'and irreplaceable. And the PROMPTS or configuration for a system built on a ' +
              'third-party model, which is where the actual behaviour lives when you did not train ' +
              'anything at all.',
          },
          options: [
            { id: 'a', label: 'The trained model artefact, meaning the weights that get loaded to serve.' },
            { id: 'b', label: 'The training corpus, which is retained customer data with its own sensitivity and retention obligations.' },
            { id: 'c', label: 'The feature pipeline, because a model restored without it produces wrong scores rather than errors.' },
            { id: 'd', label: 'The model registry, since it is the record of which version is actually in production.' },
            { id: 'e', label: 'Nothing beyond the serving endpoint, since that is the only part with an uptime target.' },
          ],
          hints: [
            'Four belong. One argues that only the thing with a dashboard counts.',
            'Ask what you would need to rebuild the system from nothing, and what you would be sued over.',
            'Which of these, if silently wrong, would produce plausible scores that are not the scores you validated?',
          ],
          solution:
            'A, B, C, and D. The weights, the corpus, the pipeline, and the registry are each ' +
            'separately losable and each has a different owner, sensitivity, and recovery ' +
            'requirement, which is exactly why they are separate lines. E is the framing to avoid: ' +
            'the endpoint is the only piece with an obvious availability metric, so it is the only ' +
            'piece that tends to get inventoried, which leaves the corpus with no retention owner ' +
            'and the pipeline out of the backup scope. The pipeline in particular is the quiet one, ' +
            'because restoring a model without its matching preprocessing gives you a service that ' +
            'is up, fast, and wrong.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option limits the inventory to the part with an uptime target. Ask what you ' +
                'would need to rebuild the system, and what a regulator would ask for.',
            },
          ],
          debrief:
            'Every AI finding you write for the rest of this package attaches to one of these ' +
            'pieces. "The model is risky" is not a finding; "the corpus has no retention owner" is.',
          practice: [],
        },
        {
          id: 'rmg.2.4',
          moduleId: 'rmg.2',
          packageId: 'risk-governance',
          order: 4,
          title: 'Two models, two tiers',
          kind: 'short-answer',
          goal: 'Tier an AI system on what its errors do, not on how impressive the technology is.',
          prompt:
            'Northwind runs two models. One suggests related products on the storefront. The other ' +
            'scores loan applications, and the score is applied automatically below a threshold ' +
            'with no human involvement. In three or four sentences, say which one you tier higher ' +
            'and what specifically drives the difference.',
          teach: {
            concept:
              'Two AI systems can use the same architecture and belong in completely different ' +
              'tiers, because tiering follows the consequence of a wrong output rather than the ' +
              'technology producing it. Three factors do most of the work. AUTONOMY: does a human ' +
              'review the output before anything happens, or does the system act? A human in the ' +
              'loop is a real control and it lowers the tier, provided the human has the time and ' +
              'the information to actually disagree. BLAST RADIUS: who is affected by an error, ' +
              'how many of them, and can they appeal it? SEVERITY AND REVERSIBILITY: a bad product ' +
              'suggestion is ignored in a second, while a declined loan affects somebody\'s ' +
              'finances and may never be revisited.\n\n' +
              'Regulatory standing usually tracks those three rather than adding a fourth: rules ' +
              'attach to consequential automated decisions about people precisely because they are ' +
              'autonomous, wide, and hard to reverse. A good answer names the loan model as the ' +
              'higher tier and grounds it in the absence of human review and the severity or ' +
              'irreversibility of the harm, rather than in anything about model complexity.',
          },
          hints: [
            'Both are models. Stop looking at the models and look at what happens after each one emits a number.',
            'One of the two descriptions contains the phrase that settles it.',
            'A good answer picks the loan model, cites the automatic decision with no human review, and names the severity, the person harmed, or the difficulty of reversing it.',
          ],
          solution:
            'The loan scoring model is the higher tier, and it is not because it is more ' +
            'sophisticated. Its output is applied automatically with no human review, so an error ' +
            'becomes a decision rather than a suggestion, and the person affected is an applicant ' +
            'outside the company who may never learn why they were declined or get the chance to ' +
            'appeal. The recommendation model is wrong constantly and the cost of each error is a ' +
            'customer ignoring a tile, which is recoverable within seconds and harms nobody. That ' +
            'difference in autonomy and in the severity of a single wrong output is what puts the ' +
            'loan model in the top tier and the storefront model near the bottom.',
          expectedOutput:
            'An answer choosing the loan model, grounded in the automatic decision without human ' +
            'review and in the severity, irreversibility, or external harm of a wrong score, rather ' +
            'than in the sophistication of the model.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['loan', 'credit', 'lending', 'applicant'],
                ['no human', 'without human', 'automatic', 'automated', 'unreviewed', 'no review', 'in the loop'],
                ['severe', 'irreversib', 'cannot be reversed', 'appeal', 'harm', 'financial', 'consequential', 'life'],
              ],
              hint:
                'Three ideas: which model, why the absence of a human matters, and how bad a single ' +
                'wrong output is for the person on the other end.',
            },
          ],
          debrief:
            'Keep this instinct. Through the rest of the package the question about any AI system ' +
            'is the same: what does it decide on its own, for whom, and how hard is that to undo.',
          practice: [],
        },
      ],
    },
    {
      id: 'rmg.3',
      packageId: 'risk-governance',
      order: 3,
      title: 'Threat modelling, from STRIDE to the AI lifecycle',
      summary:
        'What STRIDE is for and what PASTA adds, threats across the training, deployment, ' +
        'operation, and governance phases, and turning a threat into a register line.',
      exercises: [
        {
          id: 'rmg.3.1',
          moduleId: 'rmg.3',
          packageId: 'risk-governance',
          order: 1,
          title: 'STRIDE over a model pipeline',
          kind: 'multiple-choice',
          goal: 'Apply the six STRIDE categories to an AI system without forcing them.',
          prompt:
            'Northwind\'s support assistant answers from an indexed article corpus that partners ' +
            'can write into. Which of the following pair a described threat with the right STRIDE ' +
            'category? Select all that apply.',
          teach: {
            concept:
              'STRIDE is a prompt list, not a taxonomy to be admired: six categories that stop you ' +
              'from only writing down the attack you already had in mind. Spoofing is identity. ' +
              'Tampering is unauthorised modification of data or code. Repudiation is being unable ' +
              'to prove who did what. Information disclosure is confidentiality. Denial of service ' +
              'is availability. Elevation of privilege is doing something you were not entitled to ' +
              'do.\n\n' +
              'Run over an AI system the categories land in unfamiliar places. Poisoning a training ' +
              'corpus or an indexed document store is tampering, because attacker-controlled text ' +
              'has modified what the system reasons from. Model extraction through repeated queries ' +
              'is information disclosure, since the asset leaving is the model itself. Deploying a ' +
              'model version without going through the approval gate is elevation of privilege. ' +
              'And an assistant with no request log has a repudiation problem: when somebody claims ' +
              'it told them to do something, nobody can establish what it actually said. Forcing ' +
              'every threat into a category is a waste of time; the categories exist to make you ' +
              'look in six directions.',
          },
          options: [
            { id: 'a', label: 'A partner submits an article containing instructions, which the assistant later follows: tampering.' },
            { id: 'b', label: 'An attacker reconstructs an approximation of the model through many crafted queries: information disclosure.' },
            { id: 'c', label: 'An engineer pushes a model version straight to production, skipping the approval gate: elevation of privilege.' },
            { id: 'd', label: 'No request or response logging exists, so a disputed answer cannot be reconstructed: repudiation.' },
            { id: 'e', label: 'A customer receives an unhelpful answer because the model is not very good: spoofing.' },
          ],
          hints: [
            'Four pairings are right. One is not a security threat at all, it is a quality problem wearing a category name.',
            'Ask what asset moves or changes in each case, and in whose favour.',
            'Repudiation is about evidence: can you prove afterwards what happened.',
          ],
          solution:
            'A, B, C, and D. Poisoned retrieval content is tampering with what the system reasons ' +
            'from; extraction is disclosure of the model as an asset; bypassing the deployment gate ' +
            'is elevation of privilege even when the engineer meant well; and missing logs are a ' +
            'repudiation problem that only becomes visible during a dispute. E is the distractor ' +
            'worth naming: a model that gives poor answers is a performance issue, and dressing it ' +
            'up as spoofing wastes a threat model on something the product team already tracks. ' +
            'STRIDE is there to widen your search, not to relabel every complaint as a threat.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option takes an ordinary quality complaint and gives it a STRIDE label. Ask ' +
                'who the adversary is in that one.',
            },
          ],
          debrief:
            'The two that surprise people are extraction as disclosure and missing logs as ' +
            'repudiation. Both become findings that a purely technical review never writes down.',
          practice: [],
        },
        {
          id: 'rmg.3.2',
          moduleId: 'rmg.3',
          packageId: 'risk-governance',
          order: 2,
          title: 'What PASTA adds, and what it costs',
          kind: 'multiple-choice',
          goal: 'Choose a threat modelling method that matches the time you actually have.',
          prompt:
            'You have two days to threat model a new service before its design review. Which of ' +
            'the following statements about STRIDE and PASTA are accurate? Select all that apply.',
          teach: {
            concept:
              'STRIDE starts from the system: draw the components and data flows, walk the trust ' +
              'boundaries, and prompt yourself with six categories at each one. It is fast, it is ' +
              'teachable in an afternoon, and its weakness is that it produces threats without ' +
              'telling you which ones anybody would actually bother to carry out.\n\n' +
              'PASTA starts from the business and the attacker. It runs seven stages, from defining ' +
              'business objectives, through technical scope and decomposition, into threat and ' +
              'vulnerability analysis, attack modelling, and finally risk and countermeasures. ' +
              'Because it starts with objectives and ends with risk, its output is already framed ' +
              'as business consequence, which is what a funding conversation needs. The cost is ' +
              'real: it wants threat intelligence, attacker profiles, and time measured in weeks. ' +
              'Neither is the right answer in the abstract. On a two-day budget, STRIDE finishes ' +
              'and PASTA does not, and an unfinished PASTA is worth less than a completed STRIDE.',
          },
          options: [
            { id: 'a', label: 'STRIDE is component-driven and can be completed quickly, which is why it fits a design review.' },
            { id: 'b', label: 'PASTA begins with business objectives and ends with risk and countermeasures, so its output is already framed as consequence.' },
            { id: 'c', label: 'PASTA models attacker behaviour explicitly, which STRIDE does not.' },
            { id: 'd', label: 'PASTA is strictly better, so a mature team should always use it.' },
            { id: 'e', label: 'A threat list with no likelihood attached is still useful, because it is the input to the scoring step rather than the answer.' },
          ],
          hints: [
            'Four are accurate. One states a preference as a fact and ignores what you were told about the deadline.',
            'Ask what each method needs as an input, and whether you have it by Thursday.',
            'A method you cannot finish produces nothing, however good its output would have been.',
          ],
          solution:
            'A, B, C, and E. STRIDE is quick and structural, PASTA is business-first and ' +
            'attacker-centric, and a raw threat list is a legitimate intermediate product because ' +
            'the next module is where likelihood and impact get attached. D is the one to reject. ' +
            'PASTA needs threat intelligence, attacker profiling, and weeks; started on a two-day ' +
            'budget it delivers a half-finished decomposition and no threats at all, while STRIDE ' +
            'delivers a reviewed list on Thursday. Method selection is a resource decision, and ' +
            'saying so out loud is more useful than defending a favourite.',
          expectedOutput: 'Options A, B, C, and E selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'e'],
              hint:
                'One option calls a method universally superior. Check it against the two-day ' +
                'constraint in the prompt.',
            },
          ],
          debrief:
            'The honest version of this answer in a real meeting is: here is what I can produce by ' +
            'the review, here is what it will not tell you, and here is what a longer engagement ' +
            'would add.',
          practice: [],
        },
        {
          id: 'rmg.3.3',
          moduleId: 'rmg.3',
          packageId: 'risk-governance',
          order: 3,
          title: 'Threats by lifecycle phase',
          kind: 'multiple-choice',
          goal: 'Know which phase of an AI system a given threat belongs to, because that decides who can fix it.',
          prompt:
            'Match each threat to the phase where the control has to live. Which of the following ' +
            'are correctly placed? Select all that apply.',
          teach: {
            concept:
              'AI threats sort into four phases, and the phase matters because it decides who owns ' +
              'the fix and how expensive it is. TRAINING covers everything that shaped the model: ' +
              'poisoned or mislabelled data, an objective that rewards the wrong behaviour, a ' +
              'compromised dependency in the training stack. These are the expensive ones, because ' +
              'the remedy is retraining and the harm is already baked in. DEPLOYMENT is the ' +
              'transition into production: unapproved versions, missing evaluation gates, a model ' +
              'promoted without the pipeline it was validated with.\n\n' +
              'OPERATION is everything that happens while it serves: drift, adversarial input, ' +
              'extraction attempts, injected retrieval content, load. These are the ones you can ' +
              'usually fix this week, because the system around the model is not frozen. ' +
              'GOVERNANCE is the failure to have anybody watching: no owner, no monitoring, no ' +
              'incident path, no documentation of what the model is for. Governance failures are ' +
              'the reason the other three go undetected, which is why they belong in the register ' +
              'as risks and not as a footnote about process maturity.',
          },
          options: [
            { id: 'a', label: 'Mislabelled records in the training set that skew the model against one group: training phase.' },
            { id: 'b', label: 'A model version promoted to production without passing its evaluation gate: deployment phase.' },
            { id: 'c', label: 'Accuracy declining over six months as the customer population shifts: operation phase.' },
            { id: 'd', label: 'No named owner and no monitoring, so nobody would notice any of the above: governance phase.' },
            { id: 'e', label: 'Injected instructions in retrieved documents: training phase, because the corpus is data.' },
          ],
          hints: [
            'Four are correctly placed. One puts a runtime problem in the phase where the remedy would be retraining.',
            'Ask when the harmful content actually reaches the model: while it was learning, or while it was answering?',
            'The test for phase is which team can fix it and how long the fix takes.',
          ],
          solution:
            'A, B, C, and D. E is misplaced and the mistake is expensive: retrieved documents reach ' +
            'the model at inference time, not during training, so the controls are on the retrieval ' +
            'path and can be changed this week. Filing it as a training problem sends the finding ' +
            'to the team that owns the corpus, who will correctly reply that they never trained on ' +
            'those documents, and the finding dies in that exchange. Phase is not an academic ' +
            'label; it routes the work.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option treats content that is retrieved at answer time as though it had been ' +
                'learned. Ask when the text actually reaches the model.',
            },
          ],
          debrief:
            'Governance is a phase in its own right on purpose. "Nobody is watching" is a risk, and ' +
            'it is usually the highest-scoring one in a young AI programme.',
          practice: [],
        },
        {
          id: 'rmg.3.4',
          moduleId: 'rmg.3',
          packageId: 'risk-governance',
          order: 4,
          title: 'From a threat to a register line',
          kind: 'short-answer',
          goal: 'Turn a raw threat into something a committee can own, fund, and revisit.',
          prompt:
            'Your threat model produced the note "partners can write to the article corpus". In ' +
            'three or four sentences, write that up so it can go into the register, and say who ' +
            'should own the line.',
          teach: {
            concept:
              'A threat model produces notes. A register needs lines, and the gap between them is ' +
              'where most threat modelling output is lost. A usable line carries five things: the ' +
              'SOURCE (who or what acts), the PATH (how they reach the system), the ASSET (what is ' +
              'affected), the CONSEQUENCE (what the business loses, in terms a non-specialist can ' +
              'weigh), and the OWNER (the person accountable for the decision, who is never the ' +
              'person who found it).\n\n' +
              'Owner is the field people get wrong most often. Assigning a risk to the security ' +
              'team means assigning it to the people with no budget for the fix and no authority ' +
              'to accept it; the owner should be the person who owns the affected business ' +
              'function, because they are the one who can either fund the control or sign that ' +
              'they are living with the exposure. A good answer names the injection path through ' +
              'partner-submitted content, says what the injected instruction reaches (the answer a ' +
              'customer acts on, or any tool the assistant can call), and puts ownership with the ' +
              'service or business owner rather than with the assessor.',
          },
          hints: [
            'The note is a fact about the system. A register line is a sentence about what that fact costs.',
            'Five fields: who acts, how they get in, what they reach, what it costs, and who signs.',
            'A good answer traces partner-submitted content into the answers customers act on or the tools the assistant can call, and gives the line to the business or service owner rather than to security.',
          ],
          solution:
            'A partner with submission rights can place text written as an instruction into the ' +
            'article corpus, which is retrieved and concatenated into the assistant context at ' +
            'answer time, so the injected instruction is not distinguishable from a legitimate one. ' +
            'What it reaches is the answer a customer is given and acts on, and any tool or data ' +
            'the assistant is wired to call on their behalf, which makes the consequence wrong ' +
            'guidance to customers at minimum and unauthorised action at worst. None of the ' +
            'controls on the chat box sit on the retrieval path, so the exposure is currently ' +
            'unmitigated. The line belongs to the support service owner, who can fund submission ' +
            'review or accept the exposure in writing, and not to the assessor who found it.',
          expectedOutput:
            'A register line naming the partner submission path into retrieved content, what the ' +
            'injected instruction reaches, the business consequence, and a business or service ' +
            'owner rather than the security team.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['retriev', 'corpus', 'indexed', 'article', 'context', 'submitted content'],
                ['instruction', 'inject', 'answer', 'tool', 'acts on', 'guidance'],
                ['owner', 'accountab', 'signs', 'service owner', 'business owner', 'accept'],
              ],
              hint:
                'Three ideas: the path the content takes into the model, what the injected ' +
                'instruction reaches, and who owns the line.',
            },
          ],
          debrief:
            'Notice how much of the risk write-up is unglamorous. The finding was already known ' +
            'after the threat model. The value you added was making it ownable.',
          practice: [],
        },
      ],
    },
    {
      id: 'rmg.4',
      packageId: 'risk-governance',
      order: 4,
      title: 'Vulnerability assessment and gap analysis',
      summary:
        'Choosing an assessment method for what it can establish, what a CVSS score is and is ' +
        'not, testing an AI system for weaknesses, and writing a gap somebody can close.',
      exercises: [
        {
          id: 'rmg.4.1',
          moduleId: 'rmg.4',
          packageId: 'risk-governance',
          order: 1,
          title: 'What each method can establish',
          kind: 'multiple-choice',
          goal: 'Match an assessment method to the claim it actually supports.',
          prompt:
            'Leadership wants assurance about a business-critical platform. Which of the following ' +
            'statements about assessment methods are accurate? Select all that apply.',
          teach: {
            concept:
              'Four methods answer four different questions, and most disappointment in assessment ' +
              'work comes from buying one and expecting another. A VULNERABILITY SCAN answers ' +
              '"which known defects are present on the hosts I pointed at": broad, cheap, ' +
              'repeatable, blind to logic flaws and to anything it could not reach, and generous ' +
              'with false positives. A CONFIGURATION or FRAMEWORK REVIEW answers "which expected ' +
              'controls are missing", which is the gap analysis, and it is the only one of the four ' +
              'that reliably finds absent controls rather than broken ones.\n\n' +
              'A PENETRATION TEST answers "what could an attacker of this skill achieve in this ' +
              'time, from this starting point". It proves exploitability, which no scanner can, and ' +
              'its silence proves very little: a clean test means this tester did not get in this ' +
              'time. A MANUAL REVIEW of process and people answers "how does this actually get ' +
              'operated", and it is where the untested backup, the shared admin account, and the ' +
              'change process nobody follows are found. Scanners cannot see any of those three, ' +
              'which is why an assessment made only of scans reports a tidy estate right up until ' +
              'the day it does not.',
          },
          options: [
            { id: 'a', label: 'A scan establishes which known defects are present on the systems it could reach, and nothing about business logic.' },
            { id: 'b', label: 'A penetration test establishes exploitability, and a clean result means this tester did not succeed in this window.' },
            { id: 'c', label: 'A framework gap analysis is the method most likely to find a control that is missing entirely.' },
            { id: 'd', label: 'Process and people weaknesses, such as an untested restore, usually surface in manual review rather than in tooling.' },
            { id: 'e', label: 'A clean vulnerability scan is sufficient evidence that the platform is secure.' },
          ],
          hints: [
            'Four are accurate. One treats the cheapest method as the strongest evidence.',
            'For each method, finish the sentence "this proves that...", and notice how narrow each one is.',
            'Which method would ever have found that nobody has tried a restore in eighteen months?',
          ],
          solution:
            'A, B, C, and D. Each method supports one narrow claim, and stating that claim ' +
            'precisely is most of the professionalism in this work. E is the assertion to refuse. ' +
            'A scan covers known defects on reachable hosts, so a clean result is compatible with ' +
            'an unauthenticated business logic flaw, a shared administrator credential, and a ' +
            'backup nobody has ever restored. The useful reply to "are we secure" is a question ' +
            'about which claim they need supported, followed by the method that supports it and ' +
            'what it will still leave unknown.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option promotes a clean scan into proof of security. Ask what a scanner ' +
                'cannot see.',
            },
          ],
          debrief:
            'Write the limits of your method into the report, not into a footnote. It is the ' +
            'difference between an assessment and a reassurance.',
          practice: [],
        },
        {
          id: 'rmg.4.2',
          moduleId: 'rmg.4',
          packageId: 'risk-governance',
          order: 2,
          title: 'A CVSS score is not a risk score',
          kind: 'multiple-choice',
          goal: 'Use severity scoring for what it measures, and stop scoring things it was not built for.',
          prompt:
            'A colleague has produced a spreadsheet giving every finding a CVSS score, including ' +
            '"documentation is out of date, 2.1" and "password policy is weak, 5.3", and has ' +
            'sorted the remediation plan by that column. Which of the following are accurate? ' +
            'Select all that apply.',
          teach: {
            concept:
              'CVSS scores the intrinsic severity of a specific software vulnerability: how it is ' +
              'reached, how hard it is to exploit, what privileges it needs, and what it does to ' +
              'confidentiality, integrity, and availability. That is a genuinely useful common ' +
              'language, and it is the reason two teams can discuss a defect without arguing about ' +
              'adjectives.\n\n' +
              'It is not a risk score, for three reasons. It has no notion of the asset: the same ' +
              'defect scores the same on a public payment gateway and on a decommissioned test box. ' +
              'The base score deliberately excludes your environment and the current state of ' +
              'exploitation, which is what the temporal and environmental metrics and the exploit ' +
              'prediction data are for, and almost nobody fills those in. And it has no vocabulary ' +
              'for organisational weaknesses at all: there is no attack vector for "the runbook is ' +
              'stale", so a number assigned to one is invented. Sorting remediation by base score ' +
              'therefore reliably patches a 9.8 on a lab host before a 6.5 on the system that ' +
              'processes every payment.',
          },
          options: [
            { id: 'a', label: 'A base score describes the defect, not what it would cost this organisation, because it has no view of the asset.' },
            { id: 'b', label: 'Process gaps such as stale documentation have no meaningful CVSS score, because the model has no metrics for them.' },
            { id: 'c', label: 'Sorting purely by base score can put a high-scoring defect on an unimportant host above a lower-scoring one on a critical system.' },
            { id: 'd', label: 'Exploitation status and business context belong in the prioritisation, and the base score deliberately leaves them out.' },
            { id: 'e', label: 'Two findings with the same CVSS score carry the same risk to the business.' },
          ],
          hints: [
            'Four are accurate. One assumes severity and risk are the same quantity.',
            'Ask what the score knows about which machine the defect is on.',
            'What would it even mean to give an attack vector to a document that is out of date?',
          ],
          solution:
            'A, B, C, and D. Severity is a property of the defect; risk is a property of the defect ' +
            'meeting your estate, and the base score is defined to exclude exactly the context that ' +
            'turns one into the other. E is the error the spreadsheet is built on: identical scores ' +
            'on the payment gateway and on a lab host are not identical risks, and the fix is to ' +
            'carry asset criticality and exploitation status alongside severity rather than to ' +
            'abandon CVSS. The invented scores on process gaps should simply come out; they belong ' +
            'in the gap analysis, which has its own way of expressing consequence.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option equates equal severity with equal risk. Ask what the score knows about ' +
                'which system the defect sits on.',
            },
          ],
          debrief:
            'This one comes up in your first month. The polite version is to add two columns, asset ' +
            'tier and known exploitation, and let the sort order change by itself.',
          practice: [],
        },
        {
          id: 'rmg.4.3',
          moduleId: 'rmg.4',
          packageId: 'risk-governance',
          order: 3,
          title: 'Testing an AI system for weaknesses',
          kind: 'multiple-choice',
          goal: 'Know which AI test supports which claim, and what none of them can promise.',
          prompt:
            'You are scoping an assessment of the fraud model. Which of the following pair a test ' +
            'with a claim it can actually support? Select all that apply.',
          teach: {
            concept:
              'AI assessment is measurement, so each test buys one specific claim and no more. ' +
              'Subgroup evaluation buys "performance differs between these populations by this ' +
              'much on this data", which is the evidence behind a fairness finding. Adversarial ' +
              'probing buys "inputs of this class produced this behaviour", which is a positive ' +
              'result when it works and a weak negative when it does not. Reviewing the data ' +
              'lineage and retention buys "we can or cannot say where this corpus came from and ' +
              'what is in it", which is the finding regulators reach for first.\n\n' +
              'A monitoring and governance review buys something different and often more ' +
              'valuable: whether anybody would notice a failure. It answers "is there an owner, a ' +
              'performance baseline, an alert, and a path to act", and its findings are usually the ' +
              'highest scoring in a young programme because they multiply every other risk. What no ' +
              'test buys is a general claim of safety. Every result is about the inputs that were ' +
              'tried and the data that was held out, and a report that does not say so is selling ' +
              'certainty that was never measured.',
          },
          options: [
            { id: 'a', label: 'Evaluation broken down by subgroup supports a claim about performance differences between populations on that data.' },
            { id: 'b', label: 'Adversarial probing that finds nothing supports only a weak claim, because it covers the inputs that were tried.' },
            { id: 'c', label: 'A data lineage and retention review supports claims about what is in the corpus and where it came from.' },
            { id: 'd', label: 'A monitoring and ownership review supports a claim about whether a failure would be noticed at all.' },
            { id: 'e', label: 'Passing a battery of these tests supports a claim that the model is safe.' },
          ],
          hints: [
            'Four pair correctly. One promotes a set of specific measurements into a general guarantee.',
            'Finish each sentence with "on the data we used" and see which one stops making sense.',
            'Which of these findings would make every other finding worse if it came back badly?',
          ],
          solution:
            'A, B, C, and D. Each test supports a bounded, checkable claim, and B is worth dwelling ' +
            'on because negative results get overstated constantly: "we tried and could not break ' +
            'it" is worth something only when the report says how hard it tried. E is the sentence ' +
            'to strike from any report you write. Safety is not a property a battery of tests can ' +
            'establish about a system whose behaviour was learned; what you can establish is what ' +
            'was measured, on what data, with what left unknown, plus whether anybody is watching ' +
            'the parts you could not measure.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option turns a set of specific measurements into a general guarantee about ' +
                'the system.',
            },
          ],
          debrief:
            'If you want the deep version of these tests, they are the AI Security Pathway and the ' +
            'Model Lab. Here the skill is scoping: knowing what to buy and what it will prove.',
          practice: [],
        },
        {
          id: 'rmg.4.4',
          moduleId: 'rmg.4',
          packageId: 'risk-governance',
          order: 4,
          title: 'A gap finding somebody can close',
          kind: 'short-answer',
          goal: 'Write a gap so that the reader knows the current state, the required state, and why it matters.',
          prompt:
            'Your review found that Northwind deploys models to production without any recorded ' +
            'evaluation result, and that nobody can say which version is currently serving. In ' +
            'three or four sentences, write this as a gap finding.',
          teach: {
            concept:
              'A gap finding has three parts and dies without any of them. CURRENT STATE: what is ' +
              'true today, stated factually and without adjectives, because the team being assessed ' +
              'will read it and an exaggeration costs you the whole report. REQUIRED STATE: what ' +
              'should be true, and where that requirement comes from, whether a framework control, ' +
              'a regulatory obligation, or an internal policy. CONSEQUENCE: what the gap makes ' +
              'possible or prevents, in terms the reader can weigh.\n\n' +
              'The third part is the one juniors leave out, and it is why findings get closed as ' +
              '"noted". Nobody funds "we do not conform to control CM-3". They fund "we cannot ' +
              'establish which version is serving, so during an incident we cannot tell whether ' +
              'the fix has taken effect, and we cannot answer a regulator who asks what decided a ' +
              'given case". A good answer states the missing gate and the missing version record, ' +
              'names an expected practice or requirement, and says what the organisation is unable ' +
              'to do because of it: investigate an incident, roll back, or evidence a decision.',
          },
          hints: [
            'Three parts: what is true now, what should be true, and what the difference costs.',
            'Do not write "there is no change control". Write what the absence prevents somebody from doing on a bad day.',
            'A good answer names the missing evaluation gate and version record, points at an expected practice, and names a concrete consequence such as being unable to roll back, investigate, or evidence a decision.',
          ],
          solution:
            'Today, models reach production without a recorded evaluation result, and there is no ' +
            'registry entry identifying which version is serving. The expected practice, and what ' +
            'our own change management policy requires of any other production system, is an ' +
            'approval gate with retained evidence of the evaluation and a version record for what ' +
            'is running. Because neither exists, we cannot tell during an incident whether a ' +
            'rollback took effect, we cannot reproduce or explain a decision a customer disputes, ' +
            'and a degraded model could serve for months with no record of when it changed. Closing ' +
            'the gap means a gate that stores the evaluation result and a registry entry updated ' +
            'on every deployment.',
          expectedOutput:
            'A finding stating the current absence of an evaluation gate and version record, the ' +
            'required practice or policy, and a concrete consequence such as being unable to roll ' +
            'back, investigate, or evidence a decision.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['no recorded', 'not recorded', 'without', 'no registry', 'no evidence', 'no record', 'missing'],
                ['polic', 'require', 'expected practice', 'control', 'change management', 'should be', 'standard'],
                ['roll back', 'rollback', 'incident', 'reproduce', 'explain', 'dispute', 'investigat', 'unnoticed'],
              ],
              hint:
                'Three parts: the current state as a fact, the requirement it falls short of, and ' +
                'the consequence somebody would feel.',
            },
          ],
          debrief:
            'Read your finding back and ask: could the team fix this without asking me a single ' +
            'question? If not, it is not finished.',
          practice: [],
        },
      ],
    },
    {
      id: 'rmg.5',
      packageId: 'risk-governance',
      order: 5,
      title: 'Scoring risk so the number survives scrutiny',
      summary:
        'Annualised loss arithmetic, the places quantification breaks, what a heat map can and ' +
        'cannot carry, and how to write an acceptance that holds up a year later.',
      exercises: [
        {
          id: 'rmg.5.1',
          moduleId: 'rmg.5',
          packageId: 'risk-governance',
          order: 1,
          title: 'Annualised loss, and the decision it supports',
          kind: 'multiple-choice',
          goal: 'Compute an expected annual loss and reason about a control on that basis.',
          prompt:
            'A ransomware event at Northwind is estimated to cost 500,000 in recovery, lost ' +
            'trading, and response, and is expected about once in ten years. A proposed backup and ' +
            'segmentation programme costs 20,000 a year to run and is expected to reduce the ' +
            'frequency to about once in fifty years. Which of the following are correct? Select ' +
            'all that apply.',
          teach: {
            concept:
              'The quantitative vocabulary is small. Single loss expectancy is what one occurrence ' +
              'costs. Annual rate of occurrence is how many times a year you expect it. Annualised ' +
              'loss expectancy is the two multiplied, and it is the number that makes two unlike ' +
              'risks comparable: a rare catastrophe and a frequent nuisance can be placed on the ' +
              'same axis.\n\n' +
              'The decision rule follows directly. Compute the ALE before the control, compute the ' +
              'residual ALE with it, and compare the difference to the annual cost of the control. ' +
              'What the arithmetic will not do is make the inputs true. The frequency is usually an ' +
              'estimate with an enormous range, and the single loss figure is assembled from ' +
              'guesses about downtime and legal cost. That is not a reason to refuse to quantify, ' +
              'because "high" and "medium" are also guesses and they hide their own uncertainty. It ' +
              'is a reason to publish the inputs next to the answer, so the argument is about the ' +
              'frequency estimate rather than about your credibility.',
          },
          options: [
            { id: 'a', label: 'The annualised loss expectancy before the control is 50,000.' },
            { id: 'b', label: 'With the control, the residual annualised loss expectancy is 10,000.' },
            { id: 'c', label: 'The control is worth funding on these figures, because it removes about 40,000 of expected annual loss for 20,000.' },
            { id: 'd', label: 'The figures are estimates, so the inputs should be published alongside the result.' },
            { id: 'e', label: 'The control guarantees the company will not lose 500,000 next year.' },
          ],
          hints: [
            'Once in ten years is a rate of 0.1 a year. Once in fifty is 0.02.',
            'Compute the expected loss before and after, then compare the difference to the annual cost.',
            'One option promises something an expected value cannot promise about any single year.',
          ],
          solution:
            'A, B, C, and D. Before the control, 500,000 multiplied by 0.1 is 50,000 a year. After ' +
            'it, 500,000 multiplied by 0.02 is 10,000, so the control removes 40,000 of expected ' +
            'annual loss for 20,000 of annual cost and is worth funding on these numbers. D matters ' +
            'as much as the arithmetic: the frequencies are estimates and the argument should ' +
            'happen where the uncertainty is. E is the misreading that discredits quantitative work ' +
            'when the bad year arrives anyway. An expected value is an average over many years and ' +
            'says nothing about next year, and a control that cuts frequency by four fifths still ' +
            'leaves a real chance of a full loss.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option turns an average over many years into a promise about the next twelve ' +
                'months.',
            },
          ],
          debrief:
            'Say the last part out loud when you present numbers. The executive who hears ' +
            '"expected annual loss" as "the most we can lose" will remember it against you.',
          practice: [],
        },
        {
          id: 'rmg.5.2',
          moduleId: 'rmg.5',
          packageId: 'risk-governance',
          order: 2,
          title: 'The number nobody believes',
          kind: 'multiple-choice',
          goal: 'Recognise the arithmetic that produces an absurd figure, and know how to repair it.',
          prompt:
            'A colleague models the recommendation engine like this: it serves a billion ' +
            'recommendations a year, about one per cent are harmful, each harmful recommendation ' +
            'could cost 50,000 in legal and reputational terms, therefore the annual loss ' +
            'expectancy is 500 billion. Which of the following are correct diagnoses? Select all ' +
            'that apply.',
          teach: {
            concept:
              'This is the single most common way a quantitative model breaks, and it is worth ' +
              'being able to name the fault rather than just sensing that the answer is silly. The ' +
              'per-incident cost was drawn from a rare, escalated case: a lawsuit, a press cycle, a ' +
              'regulatory letter. It was then applied to every occurrence of a much broader event, ' +
              'a recommendation somebody would call inappropriate. The two are different events ' +
              'wearing one label.\n\n' +
              'Three faults compound. The cost of the tail case is applied to the whole ' +
              'distribution. The events are not independent: a thousand bad recommendations in one ' +
              'week produce one news story, not a thousand lawsuits. And the total exceeds any ' +
              'plausible bound, since a figure larger than the company, the market, and in this ' +
              'case most economies is arithmetic that has stopped describing the world. The repair ' +
              'is to model the escalation path: how many harmful outputs are noticed, of those how ' +
              'many are reported, of those how many escalate, and what each stage costs. Bounding ' +
              'the answer by something real, such as the largest fine the regulator has issued, is ' +
              'a sanity check, not a cheat.',
          },
          options: [
            { id: 'a', label: 'A cost drawn from a rare escalated case has been applied to every occurrence of a much broader event.' },
            { id: 'b', label: 'The events are treated as independent, when many bad outputs in a week produce one story rather than many.' },
            { id: 'c', label: 'A result larger than the company and its market should be treated as evidence of a modelling error.' },
            { id: 'd', label: 'The repair is to model the escalation path in stages, with a cost attached to each stage.' },
            { id: 'e', label: 'The lesson is that quantitative risk analysis does not work and qualitative ratings should be used instead.' },
          ],
          hints: [
            'Four are correct. One draws the wrong general conclusion from one broken model.',
            'Ask whether every harmful recommendation really costs the same as the worst one anybody has heard of.',
            'What happens when a thousand of these occur in the same week?',
          ],
          solution:
            'A, B, C, and D. The tail cost has been applied to the whole distribution, independence ' +
            'has been assumed where correlation is obvious, the answer breaks any plausible bound, ' +
            'and the fix is a staged escalation model with per-stage costs. E is the overcorrection ' +
            'to resist. Qualitative ratings are not more reliable, they are less inspectable: ' +
            '"high" hides the same guess with none of the arithmetic exposed, so nobody can find ' +
            'the error. A broken model that can be corrected in a meeting is more useful than a ' +
            'colour that cannot be argued with.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option concludes that quantification itself is the problem. Ask whether a ' +
                'qualitative rating would have exposed this error or hidden it.',
            },
          ],
          debrief:
            'Keep the sanity check. Before you present any figure, ask what it is a fraction of, ' +
            'and whether that fraction is believable.',
          practice: [],
        },
        {
          id: 'rmg.5.3',
          moduleId: 'rmg.5',
          packageId: 'risk-governance',
          order: 3,
          title: 'What a heat map can carry',
          kind: 'multiple-choice',
          goal: 'Use a matrix for what it is good at, and spot one that has been drawn wrong.',
          prompt:
            'A draft risk matrix rates a critical-impact, rare-likelihood risk as red, and a ' +
            'critical-impact, unlikely-likelihood risk as amber, where unlikely is defined as more ' +
            'frequent than rare. Which of the following are correct? Select all that apply.',
          teach: {
            concept:
              'A matrix is a communication device. Its job is to let a room full of people who ' +
              'will not read the register see which handful of risks are different from the rest, ' +
              'and it does that job well. Two properties have to hold for it to mean anything. It ' +
              'must be MONOTONIC: holding impact fixed, moving to a higher likelihood can never ' +
              'lower the rating, and the same the other way round. And its bands must be DEFINED, ' +
              'in numbers, somewhere a reader can find them, because "likely" means different ' +
              'things to a lawyer and an engineer.\n\n' +
              'What it cannot carry is arithmetic. The scales are ordinal: high, medium, and low ' +
              'are an order, not quantities, so multiplying them and comparing the products is a ' +
              'calculation on labels rather than on values. Two risks in the same cell can differ ' +
              'by an order of magnitude in expected loss, which is why the cell is a starting point ' +
              'for a conversation and not a ranking. Use the map to select what gets discussed, and ' +
              'the underlying estimates to decide what gets funded.',
          },
          options: [
            { id: 'a', label: 'The matrix is broken: a less likely risk cannot outrank a more likely one at the same impact.' },
            { id: 'b', label: 'Likelihood and impact bands must be defined in numbers somewhere, or two readers will use the same word differently.' },
            { id: 'c', label: 'Two risks in the same cell can still differ substantially in expected loss.' },
            { id: 'd', label: 'The map is best used to choose what gets discussed, with the estimates behind it used to decide funding.' },
            { id: 'e', label: 'Multiplying the ordinal scores gives a precise ranking of the register.' },
          ],
          hints: [
            'Four are correct. One performs arithmetic on words.',
            'Hold impact constant and read across the likelihood axis. What should happen to the colour?',
            'If high is 3 and medium is 2, is a high impact really one and a half times a medium one?',
          ],
          solution:
            'A, B, C, and D. The described matrix is non-monotonic and would have to be redrawn, ' +
            'and the fault is not cosmetic: a reader who spots it stops trusting every other cell. ' +
            'Bands need numeric definitions, cells hide real differences in magnitude, and the map ' +
            'should drive the agenda rather than the budget. E is the habit to break. Ordinal ' +
            'labels have an order but no spacing, so multiplying them produces a number with no ' +
            'units that nonetheless gets sorted, argued over, and eventually believed.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option multiplies ordinal ratings together. Ask what the units of that ' +
                'product are.',
            },
          ],
          debrief:
            'When you inherit a heat map, check monotonicity first. It takes thirty seconds and it ' +
            'tells you how much care went into everything else.',
          practice: [],
        },
        {
          id: 'rmg.5.4',
          moduleId: 'rmg.5',
          packageId: 'risk-governance',
          order: 4,
          title: 'Accepting a risk on the record',
          kind: 'short-answer',
          goal: 'Write an acceptance that is a decision somebody made rather than a decision nobody took.',
          prompt:
            'Northwind will not fund multi-region failover for the model serving stack this year. ' +
            'The exposure is a regional outage taking fraud scoring offline for up to a day. In ' +
            'three or four sentences, write the acceptance so it stands up when somebody reads it ' +
            'in twelve months.',
          teach: {
            concept:
              'Accepting a risk is a legitimate and common outcome. Most risks are accepted, ' +
              'because mitigating everything costs more than the organisation is worth. What ' +
              'separates a decision from a drift is what gets written down.\n\n' +
              'Four elements make an acceptance auditable. WHO accepted it, by name and role, and ' +
              'it has to be somebody with the authority to carry the consequence, which is the ' +
              'business owner rather than the security team. WHAT was accepted, stated as the ' +
              'specific exposure and its estimated cost, so nobody can later claim they thought it ' +
              'was smaller. FOR HOW LONG, because an acceptance with no expiry becomes permanent ' +
              'by silence. And UNDER WHAT CONDITIONS it must be revisited: a review date, plus the ' +
              'triggers that would invalidate the reasoning, such as the service becoming ' +
              'customer-facing, the outage estimate growing, or a regulator taking an interest. ' +
              'Interim measures belong in it too, because "we accepted it" reads very differently ' +
              'from "we accepted it and put a manual review process behind it".',
          },
          hints: [
            'An acceptance is a decision with a name on it. Whose name, and for how long?',
            'What would have to change for this decision to be wrong, and who is watching for that?',
            'A good answer names an accountable owner rather than the security team, states the exposure being accepted, gives an expiry or review date, and names a trigger that would reopen it.',
          ],
          solution:
            'The head of the fraud function accepts, as the accountable owner of the service, the ' +
            'exposure of losing automated fraud scoring for up to one day in a regional outage, ' +
            'estimated at the value of a day of manual review plus the fraud that gets through it. ' +
            'The acceptance runs to the end of the financial year and expires then rather than ' +
            'carrying over silently, and it is reviewed sooner if any of three triggers fires: the ' +
            'estimated outage exceeds a day, transaction volume grows past the point where manual ' +
            'review can cope, or a regulator asks about availability of the control. In the ' +
            'meantime the manual review fallback is documented and tested once, so the accepted ' +
            'outcome is degraded service rather than no fraud control at all.',
          expectedOutput:
            'An acceptance naming an accountable business owner, the specific exposure accepted, an ' +
            'expiry or review date, and a trigger that would cause it to be revisited.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['head of', 'owner', 'accountab', 'director', 'accepts', 'by name'],
                ['review date', 'expires', 'expiry', 'end of', 'twelve months', 'annually', 'time-bound', 'until'],
                ['trigger', 'revisit', 'reopen', 'if ', 'changes', 'exceeds', 'grows'],
              ],
              hint:
                'Three ideas: who accepted it and with what authority, when it stops being valid, ' +
                'and what event would force it back onto the table.',
            },
          ],
          debrief:
            'An acceptance with no expiry is how organisations end up living with an exposure ' +
            'nobody in the building chose. The date is the whole control.',
          practice: [],
        },
      ],
    },
    {
      id: 'rmg.6',
      packageId: 'risk-governance',
      order: 6,
      title: 'Controls: choosing them, and knowing they work',
      summary:
        'The five control types and what each buys, selecting from a catalogue without ordering ' +
        'everything, the controls specific to AI governance, and verification as part of the design.',
      exercises: [
        {
          id: 'rmg.6.1',
          moduleId: 'rmg.6',
          packageId: 'risk-governance',
          order: 1,
          title: 'Five kinds of control',
          kind: 'multiple-choice',
          goal: 'Classify controls by what they do to a risk, so a design does not end up all one kind.',
          prompt:
            'Northwind is designing its response to the ransomware risk. Which of the following ' +
            'classifications are correct? Select all that apply.',
          teach: {
            concept:
              'Controls are classified by what they do to the event. PREVENTIVE controls stop it ' +
              'happening: patching, network segmentation, multi-factor authentication. DETECTIVE ' +
              'controls tell you it is happening or has happened: alerting, logging, integrity ' +
              'monitoring, the restore test that discovers the backup was broken. CORRECTIVE ' +
              'controls reduce the damage afterwards: backups, failover, the incident response ' +
              'plan. DETERRENT controls change somebody\'s decision to try: visible monitoring, ' +
              'stated consequences, and the knowledge that actions are attributed, which mostly ' +
              'matters for insiders. COMPENSATING controls are what you put in place when the ' +
              'control you wanted is not available: a manual review because the automated check ' +
              'cannot ship until next quarter.\n\n' +
              'The classification is not bookkeeping. A design made only of preventive controls ' +
              'assumes prevention works, and prevention eventually does not, which is how an ' +
              'organisation finds out during the incident that nobody could see anything and there ' +
              'was nothing to fall back to. Layering across the types is the whole idea behind ' +
              'defence in depth, and the quickest review of any control set is to count how many ' +
              'of the five it contains.',
          },
          options: [
            { id: 'a', label: 'Network segmentation that limits how far an infection spreads is preventive.' },
            { id: 'b', label: 'Alerting on mass file modification is detective.' },
            { id: 'c', label: 'Tested offline backups are corrective, because they reduce the damage after the event.' },
            { id: 'd', label: 'A manual review introduced because the automated check will not ship until next quarter is compensating.' },
            { id: 'e', label: 'A control set made entirely of preventive controls is the strongest design, since nothing gets through.' },
          ],
          hints: [
            'Four are correct. One assumes prevention never fails.',
            'Ask of each control: does it stop the event, tell you about it, or limit the damage?',
            'What does the organisation with only preventive controls know on the morning the prevention failed?',
          ],
          solution:
            'A, B, C, and D. Segmentation limits spread before the fact, alerting tells you, ' +
            'backups reduce the damage after, and the manual review stands in for a control that ' +
            'does not exist yet, which is exactly what compensating means. E is the design error ' +
            'this taxonomy exists to catch. Prevention fails, and when it does an all-preventive ' +
            'organisation has no detection to notice and no correction to fall back on, so a ' +
            'containable incident becomes a recovery project. Counting the types in a control set ' +
            'is the fastest review you can do.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option calls an all-preventive design the strongest. Ask what that ' +
                'organisation knows on the day prevention fails.',
            },
          ],
          debrief:
            'When you review somebody else\'s control set, count the types before you assess the ' +
            'quality. The missing category tells you more than the weak control does.',
          practice: [],
        },
        {
          id: 'rmg.6.2',
          moduleId: 'rmg.6',
          packageId: 'risk-governance',
          order: 2,
          title: 'Selecting from a catalogue without ordering everything',
          kind: 'multiple-choice',
          goal: 'Use a control catalogue as a menu driven by risk, not as a checklist to be completed.',
          prompt:
            'A new team proposes implementing every control in the relevant NIST SP 800-53 ' +
            'families, on the grounds that more controls means less risk. Which of the following ' +
            'are accurate? Select all that apply.',
          teach: {
            concept:
              'A control catalogue is a menu, not a target. SP 800-53 contains hundreds of ' +
              'controls organised into families such as access control, audit and accountability, ' +
              'contingency planning, and incident response, and its value is that somebody has ' +
              'already thought of the control you would have forgotten. The selection is supposed ' +
              'to be driven by the categorisation of the system: a higher impact system takes a ' +
              'larger baseline, and the baseline is then tailored for what the system actually ' +
              'does.\n\n' +
              'Implementing everything fails for reasons that are practical rather than ' +
              'philosophical. Controls have running costs measured in people, and an organisation ' +
              'that implements two hundred controls badly is worse off than one that implements ' +
              'thirty properly, because every one of them needs an owner, evidence, and review. ' +
              'Controls also conflict: aggressive logging collects personal data that another ' +
              'obligation says to minimise, and lockout thresholds trade an availability risk for ' +
              'an access one. And a control that exists on paper and is never verified is worse ' +
              'than no control, because it is counted in the design as though it worked.',
          },
          options: [
            { id: 'a', label: 'Selection should follow the system\'s categorisation, then be tailored to what it actually does.' },
            { id: 'b', label: 'Controls have ongoing costs in people and evidence, so an unrealistic set degrades into an unmaintained one.' },
            { id: 'c', label: 'Some controls trade against each other, so more of them is not monotonically safer.' },
            { id: 'd', label: 'An unverified control is worse than a missing one, because the design counts it as working.' },
            { id: 'e', label: 'The number of implemented controls is a good headline metric of security posture.' },
          ],
          hints: [
            'Four are accurate. One turns a count into a measure of safety.',
            'Ask what each control needs after the day it is implemented.',
            'Can you name two controls that pull against each other? Logging and data minimisation is one pair.',
          ],
          solution:
            'A, B, C, and D. Selection is driven by categorisation and tailored from there, every ' +
            'control carries a running cost, some controls trade against each other, and an ' +
            'unverified control is a false entry in your own design. E is the metric to refuse. ' +
            'Counting controls rewards implementing cheap ones and never verifying any of them, ' +
            'and it produces the board slide that says two hundred controls implemented over an ' +
            'estate where nobody has restored a backup in a year.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option offers a count as a posture metric. Ask what behaviour that metric ' +
                'would reward.',
            },
          ],
          debrief:
            'The question that reframes these conversations is simple: which risk does this control ' +
            'reduce, and how much. A control with no risk behind it is somebody following a list.',
          practice: [],
        },
        {
          id: 'rmg.6.3',
          moduleId: 'rmg.6',
          packageId: 'risk-governance',
          order: 3,
          title: 'The controls that make AI governable',
          kind: 'multiple-choice',
          goal: 'Match an AI governance control to the specific risk it reduces.',
          prompt:
            'Northwind is building governance around its models. Which of the following pair a ' +
            'control with a risk it genuinely reduces? Select all that apply.',
          teach: {
            concept:
              'AI governance controls look bureaucratic until you attach each one to the failure it ' +
              'prevents. A MODEL REGISTRY reduces the risk that nobody can say what is serving, ' +
              'which is the finding that blocks every incident investigation and every regulatory ' +
              'answer. An APPROVAL GATE with retained evaluation evidence reduces the risk of a ' +
              'model reaching production without anybody establishing that it works. PERFORMANCE ' +
              'AND DRIFT MONITORING reduces the risk that degradation goes unnoticed, which is the ' +
              'characteristic AI failure because the service stays up and the outputs stay ' +
              'plausible. SUBGROUP EVALUATION at the gate and on a schedule reduces the risk of ' +
              'systematically worse treatment of one population.\n\n' +
              'Two more are worth knowing. DOCUMENTATION of purpose and limits, often as a model ' +
              'card, reduces the risk of a model being reused outside the conditions it was ' +
              'validated for, which is a common way a reasonable model becomes an unreasonable ' +
              'decision. And an INCIDENT PATH for AI failures reduces the risk that a discovered ' +
              'problem has nowhere to go: an operator who notices the model behaving oddly and has ' +
              'no route to escalate will do nothing, and the finding dies with them.',
          },
          options: [
            { id: 'a', label: 'A model registry reduces the risk that nobody can say which version is serving during an incident.' },
            { id: 'b', label: 'Drift and performance monitoring reduces the risk of silent degradation while the service stays healthy.' },
            { id: 'c', label: 'Documented purpose and limits reduce the risk of the model being reused outside what it was validated for.' },
            { id: 'd', label: 'A defined escalation path reduces the risk that a noticed problem goes nowhere.' },
            { id: 'e', label: 'A governance board reduces the risk of adversarial inputs reaching the model.' },
          ],
          hints: [
            'Four pair correctly. One puts a committee in the path of a technical attack.',
            'For each control, name the specific bad day it makes better.',
            'A board can require a control. It cannot be a control on the request path.',
          ],
          solution:
            'A, B, C, and D. Each reduces a specific and nameable failure. E is the pairing to ' +
            'reject, and the reason matters: a governance board is a real control, but the risk it ' +
            'reduces is that nobody decided, nobody owned it, and no requirement was set. It sits ' +
            'nowhere near the request path, so claiming it defends against adversarial input is ' +
            'the kind of overreach that gets governance dismissed as theatre by the engineers who ' +
            'have to build the actual filter.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option credits a committee with stopping a runtime attack. Ask where in the ' +
                'request path it sits.',
            },
          ],
          debrief:
            'Governance controls earn their place by naming the failure they prevent. Present them ' +
            'that way and the engineering team stops treating them as paperwork.',
          practice: [],
        },
        {
          id: 'rmg.6.4',
          moduleId: 'rmg.6',
          packageId: 'risk-governance',
          order: 4,
          title: 'A control set, and how you would know it works',
          kind: 'short-answer',
          goal: 'Design layered controls for one AI risk and state the verification alongside them.',
          prompt:
            'The risk is that Northwind\'s fraud model degrades over months as customer behaviour ' +
            'shifts, and nobody notices because the service stays up and the scores look ' +
            'reasonable. In three or four sentences, give the controls you would put in place and ' +
            'say how you would know each one is working.',
          teach: {
            concept:
              'Silent degradation is the characteristic AI failure, and it needs layers rather ' +
              'than one clever fix. The detective layer is a performance baseline and an alert on ' +
              'movement away from it, measured against outcomes that arrive later, such as ' +
              'confirmed fraud, rather than against the model\'s own confidence, which is precisely ' +
              'the thing that stops being trustworthy. Input drift monitoring is the earlier ' +
              'signal, because the population shifts before the outcomes come back.\n\n' +
              'The corrective layer is a defined response: a retraining trigger, a rollback to a ' +
              'known version, and a fallback such as rules or a review queue for the period in ' +
              'between. The preventive layer is scheduled revalidation, so a model cannot serve ' +
              'indefinitely on evidence from the day it shipped.\n\n' +
              'Then the part most designs omit. Every control needs a way to know it is working, ' +
              'and for monitoring that means testing that the alert fires: replay a period of known ' +
              'degradation, or inject shifted data, and confirm somebody was paged and knew what to ' +
              'do. An alert nobody has ever seen fire is a hypothesis, and this failure mode is ' +
              'exactly the one where an untested alert stays silent for a year and everybody reads ' +
              'the silence as health.',
          },
          hints: [
            'You need something that notices, something that responds, and something that stops the model serving forever on old evidence.',
            'Be careful what you measure against. The model\'s own confidence is part of what degrades.',
            'A good answer names monitoring against real outcomes or input drift, names a response such as retraining, rollback, or a fallback, and says the alert itself must be tested rather than assumed.',
          ],
          solution:
            'I would baseline performance against confirmed fraud outcomes rather than against the ' +
            'model\'s own confidence, alert on movement away from that baseline, and monitor the ' +
            'input distribution as the earlier signal, since the population shifts before labelled ' +
            'outcomes come back. Behind the alert I would define the response in advance: a ' +
            'retraining trigger, a rollback to the last validated version, and a rules-based or ' +
            'manual review fallback to carry the decision in the meantime. I would also require ' +
            'scheduled revalidation, so the model cannot keep serving on evidence from the day it ' +
            'shipped. To know the detection works I would replay a period of known degradation, ' +
            'confirm the alert fires and reaches somebody who knows what to do, and treat an alert ' +
            'that has never been tested as an assumption rather than a control.',
          expectedOutput:
            'A layered answer naming outcome-based or drift monitoring, a defined response such as ' +
            'retraining, rollback, or fallback, and a way of verifying the detection actually ' +
            'fires rather than assuming it.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['baseline', 'monitor', 'drift', 'outcome', 'alert'],
                ['retrain', 'rollback', 'roll back', 'fallback', 'manual review', 'revalidat'],
                ['test the alert', 'replay', 'confirm the alert', 'fires', 'never been tested', 'verify', 'inject'],
              ],
              hint:
                'Three ideas: what notices the degradation, what happens when it does, and how you ' +
                'establish that the noticing part actually works.',
            },
          ],
          debrief:
            'The verification half is what separates a control design from a wish list. Ask it of ' +
            'every control you ever propose, including the ones you inherit.',
          practice: [],
        },
      ],
    },
    {
      id: 'rmg.7',
      packageId: 'risk-governance',
      order: 7,
      title: 'Business continuity, including for a service that learned its behaviour',
      summary:
        'Impact analysis, what RTO and RPO actually commit you to, reading a backup schedule ' +
        'against a target, and what a business does the morning its model is unavailable.',
      exercises: [
        {
          id: 'rmg.7.1',
          moduleId: 'rmg.7',
          packageId: 'risk-governance',
          order: 1,
          title: 'What the continuity numbers mean',
          kind: 'multiple-choice',
          goal: 'Use RTO, RPO, and maximum tolerable downtime as the distinct commitments they are.',
          prompt:
            'You are running a business impact analysis with the finance team. Which of the ' +
            'following are accurate? Select all that apply.',
          teach: {
            concept:
              'A business impact analysis asks one question of each function: as the outage gets ' +
              'longer, at what point does the harm become unacceptable, and what does the harm ' +
              'consist of? From the answer come three numbers. MAXIMUM TOLERABLE DOWNTIME is the ' +
              'point past which the damage is no longer survivable in the terms the business cares ' +
              'about. RECOVERY TIME OBJECTIVE is the target for restoring service, and it has to ' +
              'be shorter than the maximum tolerable downtime, with the gap as the margin. ' +
              'RECOVERY POINT OBJECTIVE is how much data you are willing to lose, measured ' +
              'backwards from the failure.\n\n' +
              'The two objectives are set by different questions and met by different investments. ' +
              'RTO is about how fast you can stand the service back up, and it is bought with ' +
              'standby capacity, automation, and rehearsal. RPO is about how recently your last ' +
              'usable copy was taken, and it is bought with more frequent recovery points: ' +
              'replication, log shipping, snapshots. Buying a faster restore does nothing for RPO, ' +
              'which is the confusion that shows up in almost every first continuity plan. And ' +
              'both numbers are business decisions with a price attached, not technical preferences ' +
              'for the infrastructure team to choose alone.',
          },
          options: [
            { id: 'a', label: 'RTO is a target for how long recovery takes; RPO is a target for how much data may be lost.' },
            { id: 'b', label: 'RTO should be shorter than the maximum tolerable downtime, leaving margin.' },
            { id: 'c', label: 'RPO is improved by taking recovery points more often, not by restoring faster.' },
            { id: 'd', label: 'Both numbers are business decisions with costs attached, not purely technical choices.' },
            { id: 'e', label: 'Setting every function to a one-hour RTO is prudent, since shorter is always better.' },
          ],
          hints: [
            'Four are accurate. One ignores that every hour of RTO you buy has a price.',
            'Which of the two numbers looks backwards from the moment of failure?',
            'What would a one-hour RTO on the internal wiki cost, and what would it buy?',
          ],
          solution:
            'A, B, C, and D. The two objectives answer different questions and are bought with ' +
            'different things, which is why C is the one worth remembering: no amount of restore ' +
            'speed recovers data that was never captured. E is the failure mode of an ' +
            'enthusiastic first plan. Setting everything to an hour means either the numbers are ' +
            'fiction, which is worse than having none because people plan against them, or the ' +
            'company is paying for standby capacity on the internal wiki. Tiering exists so the ' +
            'money goes where the impact curve is steep.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option sets the same aggressive target everywhere. Ask who pays for it and ' +
                'what it buys on a low-impact system.',
            },
          ],
          debrief:
            'Bring the impact curve to the meeting, not the targets. When finance sees where the ' +
            'harm accelerates, they set the numbers themselves and they own them.',
          practice: [],
        },
        {
          id: 'rmg.7.2',
          moduleId: 'rmg.7',
          packageId: 'risk-governance',
          order: 2,
          title: 'Reading a schedule against a target',
          kind: 'multiple-choice',
          goal: 'Work out what a given backup and restore arrangement can actually deliver.',
          prompt:
            'Northwind backs up the orders database once a night at 02:00. A full restore, ' +
            'including validation, takes about eight hours. The business has asked for a four-hour ' +
            'RTO and a four-hour RPO. Which of the following are correct? Select all that apply.',
          teach: {
            concept:
              'Continuity plans are usually undone not by an unforeseen disaster but by arithmetic ' +
              'nobody did. Two sums settle whether a plan meets its targets. The recovery point ' +
              'you can actually achieve is bounded by the interval between recovery points: with ' +
              'one nightly backup, a failure just before the next one loses almost a full day, so ' +
              'the achievable RPO is close to twenty-four hours regardless of anything else. The ' +
              'recovery time you can achieve is the whole path back to service, which includes ' +
              'retrieving the copy, restoring it, validating it, and reconnecting whatever depends ' +
              'on it, not just the copy operation.\n\n' +
              'When a target is missed, the fix has to match which number is missed. A shorter RPO ' +
              'needs more frequent capture: log shipping, continuous replication, more frequent ' +
              'snapshots. A shorter RTO needs a faster path back: warm standby, pre-staged ' +
              'infrastructure, rehearsed procedure, automation. Buying hardware that restores twice ' +
              'as fast improves the second number and leaves the first exactly where it was, and ' +
              'presenting that purchase as a fix for both is how a plan passes review and fails in ' +
              'practice.',
          },
          options: [
            { id: 'a', label: 'The achievable RPO is close to twenty-four hours, so the four-hour RPO is not met.' },
            { id: 'b', label: 'The eight-hour restore already exceeds the four-hour RTO before anything goes wrong.' },
            { id: 'c', label: 'Meeting the RPO requires capturing recovery points more often, such as by log shipping or replication.' },
            { id: 'd', label: 'Meeting the RTO requires a faster path back to service, such as warm standby and rehearsal.' },
            { id: 'e', label: 'Buying storage that halves the restore time would bring the RPO within target.' },
          ],
          hints: [
            'Four are correct. One fixes the wrong number.',
            'Work out the worst case: the failure happens at 01:30, just before the next backup. How much work is gone?',
            'Restore speed is a recovery time property. What determines how much data was captured?',
          ],
          solution:
            'A, B, C, and D. A single nightly copy means a failure late in the day loses almost ' +
            'twenty-four hours of orders, and an eight-hour restore misses a four-hour RTO before ' +
            'anybody has had a bad day on top of it. The two shortfalls need different investments, ' +
            'which is the point of the exercise. E is the purchase that gets approved because it ' +
            'sounds like an improvement: halving the restore helps the RTO and does absolutely ' +
            'nothing for the RPO, because the data that was never captured cannot be restored ' +
            'quickly or slowly.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option applies a restore-speed improvement to the data-loss target. Ask which ' +
                'of the two numbers capture frequency controls.',
            },
          ],
          debrief:
            'Do this arithmetic on every plan you are handed. The gap between the stated target ' +
            'and the achievable one is a finding, and it is usually the largest one in the document.',
          practice: [],
        },
        {
          id: 'rmg.7.3',
          moduleId: 'rmg.7',
          packageId: 'risk-governance',
          order: 3,
          title: 'Continuity for a model in the decision path',
          kind: 'multiple-choice',
          goal: 'Plan for an AI service being unavailable, including the failure mode where it is up and wrong.',
          prompt:
            'The fraud model sits in the payment authorisation path. Which of the following belong ' +
            'in its continuity plan? Select all that apply.',
          teach: {
            concept:
              'A model in a decision path has an unusual continuity profile, because it has two ' +
              'distinct bad days. The first is ordinary unavailability: the service is down and ' +
              'every decision that depended on it is blocked. The plan needs a defined degraded ' +
              'mode, which usually means falling back to rules, to a queue for manual review, or ' +
              'to a documented default such as accepting below a value threshold and holding above ' +
              'it. Somebody has to choose that default in advance, because a system that fails ' +
              'open lets fraud through and a system that fails closed stops trading, and both are ' +
              'business decisions rather than engineering ones.\n\n' +
              'The second bad day is worse and is specific to learned systems: the service is up, ' +
              'fast, and wrong, because a stale model or a mismatched feature pipeline is serving. ' +
              'Continuity for that means being able to detect it and roll back to a known version, ' +
              'which is why the registry and the pipeline are continuity assets and not just ' +
              'governance ones. The plan also needs a capacity check on the fallback, since the ' +
              'manual review queue that is fine for a quiet hour is not fine for a Friday, and a ' +
              'rehearsal, because a fallback nobody has exercised is a paragraph rather than a plan.',
          },
          options: [
            { id: 'a', label: 'A defined degraded mode, with the fail-open or fail-closed choice made by the business in advance.' },
            { id: 'b', label: 'The ability to roll back to a known-good model version, since the service can be up and wrong.' },
            { id: 'c', label: 'A capacity check on the fallback, because a manual queue that copes at midnight may not cope on a Friday.' },
            { id: 'd', label: 'A rehearsal of the fallback, so it is a tested path rather than a paragraph.' },
            { id: 'e', label: 'Nothing beyond the standard service continuity plan, since a model is just another API.' },
          ],
          hints: [
            'Four belong. One says a learned system needs nothing special.',
            'There are two bad days here, and only one of them looks like an outage.',
            'What does the business want to happen to a payment while the model cannot score it?',
          ],
          solution:
            'A, B, C, and D. The degraded mode and the fail-open or fail-closed choice are business ' +
            'decisions that must be made before the incident, rollback covers the failure mode ' +
            'where the service is healthy and wrong, capacity determines whether the fallback ' +
            'survives peak, and rehearsal is what turns the plan into a capability. E is the ' +
            'assumption that produces a plan covering only half the failures: a model is not just ' +
            'another API, because an API that is up is usually correct and a model that is up can ' +
            'be quietly serving decisions nobody would sign off.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option treats a model as an ordinary service. Ask what the second failure ' +
                'mode of a learned system looks like from the outside.',
            },
          ],
          debrief:
            'The fail-open or fail-closed question is the one to take to the business first. It is ' +
            'the decision they will be asked about afterwards, so they should make it beforehand.',
          practice: [],
        },
        {
          id: 'rmg.7.4',
          moduleId: 'rmg.7',
          packageId: 'risk-governance',
          order: 4,
          title: 'What a model outage actually costs',
          kind: 'short-answer',
          goal: 'Turn an AI availability risk into an impact statement finance can weigh.',
          prompt:
            'The fraud model will be unavailable for one working day. In three or four sentences, ' +
            'state the business impact and what the company does in the meantime, in terms a ' +
            'finance director could put a number against.',
          teach: {
            concept:
              'An impact statement about an AI outage fails when it describes the technology ' +
              'instead of the day. "The scoring service is unavailable" tells a finance director ' +
              'nothing they can price. What they can price is the decision that stops being made ' +
              'automatically, the volume of those decisions, what happens to each one instead, and ' +
              'what that substitute costs in money and in risk.\n\n' +
              'So the statement has three moving parts. VOLUME: how many decisions a day, and how ' +
              'they are distributed, since a peak-hour outage is not an average one. SUBSTITUTE: ' +
              'what carries the decision instead, whether a rules fallback, a manual queue, or a ' +
              'blanket accept or decline, and what it costs to run. RESIDUAL HARM: what gets ' +
              'through or gets wrongly stopped while the substitute is carrying the load, because ' +
              'the fallback is worse than the model or you would not have built the model. Naming ' +
              'the fail-open or fail-closed posture is what makes the number real: fraud losses if ' +
              'you accept, lost trading and customer complaints if you decline.',
          },
          hints: [
            'A finance director cannot price "the service is down". What decision stops being made, and how many times a day?',
            'Whatever carries the load instead is worse than the model. Say how much worse, and in what currency.',
            'A good answer names the decision volume, the fallback that carries it, and the residual loss, whether that is fraud getting through or good transactions being declined.',
          ],
          solution:
            'For one working day, roughly the daily volume of card authorisations goes unscored, so ' +
            'each one is decided by the rules fallback and a manual review queue rather than by the ' +
            'model. The queue can absorb only a fraction of that volume, so the practical posture ' +
            'is to accept below a value threshold and hold above it, which means fraud that the ' +
            'model would have caught gets through on the low-value side and legitimate customers ' +
            'are delayed on the high-value side. The cost is therefore the extra fraud losses for ' +
            'the day, plus the review staffing, plus the lost or delayed trading from the ' +
            'transactions we hold, and it lands worse if the outage covers a peak trading period. ' +
            'That is the number to compare against the cost of a standby deployment.',
          expectedOutput:
            'An impact statement naming the volume of decisions that go unscored, the fallback that ' +
            'carries them, and the residual cost in fraud losses, staffing, or lost trading.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['volume', 'transactions', 'authorisation', 'decisions a day', 'daily', 'per day'],
                ['fallback', 'manual', 'rules', 'queue', 'threshold', 'accept', 'decline'],
                ['fraud losses', 'lost trading', 'staffing', 'delayed', 'cost', 'losses'],
              ],
              hint:
                'Three ideas: how many decisions stop being made, what carries them instead, and ' +
                'what that substitution costs in money.',
            },
          ],
          debrief:
            'Notice you never mentioned a model architecture. The impact statement is about the ' +
            'decision, which is why finance can act on it.',
          practice: [],
        },
      ],
    },
    {
      id: 'rmg.8',
      packageId: 'risk-governance',
      order: 8,
      title: 'Disaster recovery, and recovering something that was trained',
      summary:
        'What standby arrangements buy, everything an AI system needs before it can be rebuilt, ' +
        'why an untested backup is a hypothesis, and what "recovered" means for a model.',
      exercises: [
        {
          id: 'rmg.8.1',
          moduleId: 'rmg.8',
          packageId: 'risk-governance',
          order: 1,
          title: 'What a standby arrangement buys',
          kind: 'multiple-choice',
          goal: 'Match a recovery arrangement to the recovery time it can support, and to its running cost.',
          prompt:
            'Northwind is choosing a recovery arrangement for a tier one service. Which of the ' +
            'following are accurate? Select all that apply.',
          teach: {
            concept:
              'Recovery arrangements sit on a spectrum between money and time, and naming the ' +
              'points on it keeps the conversation honest. A COLD arrangement is space, power, and ' +
              'a procurement plan: cheap to hold, and recovery is measured in days to weeks because ' +
              'everything has to be built. A WARM arrangement has the infrastructure standing and ' +
              'the data arriving on a delay, so recovery is hours: somebody promotes it, checks it, ' +
              'and redirects traffic. A HOT arrangement runs the service continuously with data ' +
              'kept current, so recovery is minutes and can be automatic, and you pay for the ' +
              'second copy every day whether you use it or not.\n\n' +
              'Two things get forgotten. Capacity: a standby sized for half the load meets its RTO ' +
              'and then falls over, which is a discovery best made in a rehearsal. And ' +
              'correlation: a second site that shares an identity provider, a certificate ' +
              'authority, a pipeline, or a cloud region control plane is not independent, and the ' +
              'event that takes the first will frequently take the second. What you are buying is ' +
              'a shorter recovery time, so the choice should be driven by the RTO the business ' +
              'agreed to pay for, not by a preference for the most impressive option.',
          },
          options: [
            { id: 'a', label: 'A cold arrangement is cheap to hold and recovers in days, because the environment has to be built.' },
            { id: 'b', label: 'A warm standby supports recovery in hours, with a promotion and validation step.' },
            { id: 'c', label: 'Standby capacity has to be sized for the real load, or the arrangement meets its RTO and then fails.' },
            { id: 'd', label: 'A second site sharing identity, certificates, or a control plane is not independent of the first.' },
            { id: 'e', label: 'A hot arrangement should be the default for every system, since it has the shortest recovery time.' },
          ],
          hints: [
            'Four are accurate. One buys the most expensive option regardless of what the business asked for.',
            'What are you actually paying for on the spectrum from cold to hot?',
            'Two sites, one identity provider. How independent are they really?',
          ],
          solution:
            'A, B, C, and D. The spectrum trades money for recovery time, capacity determines ' +
            'whether the arrangement survives the first hour after failover, and shared ' +
            'dependencies quietly undo the independence you thought you bought. E is the answer ' +
            'that sounds responsible and is not: a hot arrangement for a system whose business ' +
            'agreed to a two-day RTO is money that could have shortened the recovery of something ' +
            'that actually matters. Buy the RTO the impact analysis justified.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option makes the most expensive arrangement the default everywhere. Compare it ' +
                'against the RTO the business actually agreed.',
            },
          ],
          debrief:
            'The shared-dependency question is the one that catches experienced teams. Ask what the ' +
            'two sites have in common before you ask how far apart they are.',
          practice: [],
        },
        {
          id: 'rmg.8.2',
          moduleId: 'rmg.8',
          packageId: 'risk-governance',
          order: 2,
          title: 'What it takes to rebuild a model',
          kind: 'multiple-choice',
          goal: 'Scope the recovery of an AI system to everything it needs, not just the weights.',
          prompt:
            'Northwind wants to be able to rebuild the fraud scoring service from backups. Which ' +
            'of the following must be in the recovery scope? Select all that apply.',
          teach: {
            concept:
              'Recovering a model is not recovering a file. The trained artefact is necessary and ' +
              'nowhere near sufficient, and every item left out of scope becomes a silent defect ' +
              'rather than a visible failure.\n\n' +
              'Four things have to come back together. The WEIGHTS, obviously. The FEATURE ' +
              'PIPELINE and its configuration, because the model expects inputs prepared exactly ' +
              'the way they were during training, and a version mismatch produces plausible wrong ' +
              'scores rather than an error anybody notices. The REGISTRY AND VERSION RECORD, so ' +
              'you can establish which artefact was serving before the failure and therefore which ' +
              'one to restore. And the EVALUATION SET with its labels, because otherwise you can ' +
              'stand the service up but cannot demonstrate that what you restored performs as it ' +
              'did, which is the actual definition of recovered for a system whose behaviour is ' +
              'empirical.\n\n' +
              'The training corpus is a separate decision with its own retention obligations: ' +
              'keeping it lets you retrain from scratch, and keeping it forever is a privacy ' +
              'finding waiting to happen. That tension is normal and it belongs in the plan ' +
              'explicitly rather than being settled by whoever configured the bucket.',
          },
          options: [
            { id: 'a', label: 'The trained model artefact itself.' },
            { id: 'b', label: 'The feature pipeline and its configuration, since a mismatch produces wrong scores rather than errors.' },
            { id: 'c', label: 'The registry entry that says which version was serving before the failure.' },
            { id: 'd', label: 'The evaluation set and labels, because otherwise you cannot show the restored system performs as it did.' },
            { id: 'e', label: 'Only the model artefact, since the pipeline can be rewritten from the documentation if needed.' },
          ],
          hints: [
            'Four are in scope. One assumes documentation is an adequate substitute for the code that ran.',
            'What does "recovered" mean for a system whose behaviour is only known by measurement?',
            'Which omission would leave you with a service that is up, fast, and quietly wrong?',
          ],
          solution:
            'A, B, C, and D. The pipeline is the one people learn the hard way: a model restored ' +
            'with a slightly different preprocessing step does not fail, it scores, and the scores ' +
            'are wrong in a way that takes weeks to notice. The registry tells you what to restore, ' +
            'and the evaluation set is how you prove you restored it, which is what recovered has ' +
            'to mean for a system whose behaviour is established by measurement. E is the shortcut ' +
            'to reject: documentation of a pipeline is not the pipeline, and the gap between them ' +
            'is exactly where the silent defect lives.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option relies on rebuilding the preprocessing from documentation. Ask what a ' +
                'small difference in preprocessing does to the scores.',
            },
          ],
          debrief:
            'Retaining the training corpus is a genuine trade-off between rebuildability and ' +
            'privacy exposure. Put that decision in the plan with a name against it.',
          practice: [],
        },
        {
          id: 'rmg.8.3',
          moduleId: 'rmg.8',
          packageId: 'risk-governance',
          order: 3,
          title: 'An untested backup is a hypothesis',
          kind: 'multiple-choice',
          goal: 'Say what a recovery test has to cover before the plan can be believed.',
          prompt:
            'Northwind reports that backups complete successfully every night. Which of the ' +
            'following are accurate? Select all that apply.',
          teach: {
            concept:
              'A successful backup job proves that data was written somewhere. It does not prove ' +
              'that the data is complete, that it is readable, that the encryption key still ' +
              'exists, that the schema matches what the current application expects, or that ' +
              'anybody knows the procedure. Each of those has taken an organisation down at the ' +
              'worst possible moment, and the only thing that establishes them is a restore.\n\n' +
              'A real test has three properties. It restores to a usable service, not just to ' +
              'files, because reconnecting dependencies and validating the data is most of the ' +
              'elapsed time. It is timed, because the whole point is a claim about RTO and an ' +
              'untimed test supports no claim at all. And it is run by the people who would ' +
              'actually be on shift, not by the one engineer who designed the system, since the ' +
              'plan has to work at three in the morning when that person is unreachable. There is ' +
              'also a specific ransomware requirement: copies that the production credentials can ' +
              'reach are copies the attacker can delete, so at least one has to be offline or ' +
              'immutable, and it needs testing too.',
          },
          options: [
            { id: 'a', label: 'A completed backup job establishes that data was written, not that it can be restored.' },
            { id: 'b', label: 'A recovery test should restore to a working service and be timed, or it supports no claim about RTO.' },
            { id: 'c', label: 'The test should be run by whoever would actually be on shift, not only by the system designer.' },
            { id: 'd', label: 'At least one copy must be beyond the reach of production credentials, or ransomware deletes the backups too.' },
            { id: 'e', label: 'Monitoring backup job success is sufficient assurance that recovery will work.' },
          ],
          hints: [
            'Four are accurate. One treats a green job status as proof of recovery.',
            'List everything between "the file exists" and "customers are being served again".',
            'If the attacker has domain administrator, what can they reach?',
          ],
          solution:
            'A, B, C, and D. Job success is a claim about writing, not about reading, and every ' +
            'step between the file and a working service is untested until somebody performs it ' +
            'under a clock. C matters more than it looks: a plan that only works when one named ' +
            'person is available is a plan with a single point of failure in it. D is the ' +
            'ransomware-specific requirement, since credentials that can write the backups can ' +
            'usually delete them. E is the belief that produces the worst incident of somebody\'s ' +
            'career, and it is extremely common because the dashboard really is green.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option accepts a green dashboard as assurance. List what happens between the ' +
                'backup file and a customer being served.',
            },
          ],
          debrief:
            'When did you last restore is the single most productive question in a continuity ' +
            'review. Ask it early and let the silence do the work.',
          practice: [],
        },
        {
          id: 'rmg.8.4',
          moduleId: 'rmg.8',
          packageId: 'risk-governance',
          order: 4,
          title: 'The service is back. Is it recovered?',
          kind: 'short-answer',
          goal: 'Define recovery for a learned system as a performance claim, not a health check.',
          prompt:
            'After a failure, the fraud scoring service has been restored from backup, it responds ' +
            'to requests, and its health check is green. In three or four sentences, say what you ' +
            'would establish before declaring recovery complete, and why the health check is not ' +
            'enough.',
          teach: {
            concept:
              'For an ordinary service, responding correctly to a health check is decent evidence ' +
              'that it is back. For a learned system it is almost no evidence at all, because the ' +
              'characteristic failure is a service that responds promptly with the wrong numbers. ' +
              'Recovery therefore has to be defined as a performance claim rather than an ' +
              'availability one.\n\n' +
              'Three checks establish it. VERSION: confirm which artefact is actually loaded and ' +
              'that it is the one that was serving before the failure, or a deliberately chosen ' +
              'alternative, which requires the registry to have survived. PIPELINE MATCH: confirm ' +
              'the preprocessing in front of the model is the version it was validated with, ' +
              'because this is the mismatch that produces plausible wrong output. PERFORMANCE: run ' +
              'the retained evaluation set and compare against the recorded baseline, so the claim ' +
              'is measured rather than assumed.\n\n' +
              'There is a fourth thing worth saying: what happened to the decisions made during the ' +
              'outage. Anything scored by the fallback, or not scored at all, may need review, and ' +
              'recovery of the service is not recovery of the business process until somebody has ' +
              'decided what to do about that backlog.',
          },
          hints: [
            'The failure mode you are worried about looks exactly like health from the outside.',
            'Three things to confirm before you believe the restore: which version, which pipeline, and what it scores.',
            'A good answer checks the loaded version, checks the preprocessing matches, and runs the retained evaluation set against the recorded baseline rather than trusting the health check.',
          ],
          solution:
            'A health check establishes that the service answers, and the failure I am worried ' +
            'about is a service that answers quickly with wrong scores, so it is close to no ' +
            'evidence. Before declaring recovery I would confirm which model version is actually ' +
            'loaded and that it matches the registry record for what was serving, confirm that the ' +
            'feature pipeline in front of it is the version the model was validated with, and then ' +
            'run the retained evaluation set and compare the result against the recorded baseline. ' +
            'Only that last measurement supports the claim that the restored system performs as it ' +
            'did, because the behaviour of this system is only ever known empirically. I would also ' +
            'flag the decisions made during the outage for review, since the service being back ' +
            'does not put the business process back.',
          expectedOutput:
            'An answer confirming the loaded model version, the matching feature pipeline, and a ' +
            'measured comparison against the recorded performance baseline, with the reason a ' +
            'health check cannot establish any of it.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['version', 'registry', 'artefact', 'which model'],
                ['pipeline', 'preprocess', 'feature', 'transformation'],
                ['baseline', 'evaluation set', 'evaluat', 'performance', 'measur', 'compare'],
              ],
              hint:
                'Three checks: which version is loaded, whether the preprocessing matches, and ' +
                'what the model actually scores against a known baseline.',
            },
          ],
          debrief:
            'Recovered means performing, not responding. Write that definition into the runbook, ' +
            'because at four in the morning the green dashboard is very persuasive.',
          practice: [],
        },
      ],
    },
    {
      id: 'rmg.9',
      packageId: 'risk-governance',
      order: 9,
      title: 'Compliance mapping, and what the AI rules actually say',
      summary:
        'Mapping an obligation to the evidence that proves it, accurate claims about the ' +
        'regulatory picture, why compliant and safe are different, and writing a gap for two ' +
        'audiences.',
      exercises: [
        {
          id: 'rmg.9.1',
          moduleId: 'rmg.9',
          packageId: 'risk-governance',
          order: 1,
          title: 'From obligation to evidence',
          kind: 'multiple-choice',
          goal: 'Turn a requirement into the artefact that would satisfy somebody checking it.',
          prompt:
            'You are building a compliance mapping for Northwind. Which of the following are sound ' +
            'practice? Select all that apply.',
          teach: {
            concept:
              'A compliance mapping is a table with three columns, and organisations that skip the ' +
              'third one fail audits while believing they are compliant. The first column is the ' +
              'OBLIGATION: a specific clause, control, or requirement, cited precisely enough that ' +
              'somebody can look it up. The second is the CONTROL: what the organisation does about ' +
              'it. The third is the EVIDENCE: the artefact that demonstrates the control operated, ' +
              'and where it is kept.\n\n' +
              'The third column changes behaviour, because it forces the question of what would ' +
              'actually be shown. "We review access quarterly" is a control; the evidence is the ' +
              'dated review records for the last four quarters, with the removals that resulted. ' +
              'Two other habits matter. One control usually satisfies several obligations across ' +
              'different regimes, and mapping many-to-many stops the same work being done three ' +
              'times for three frameworks. And an obligation with no named owner will be evidenced ' +
              'by nobody, which is why the mapping carries an owner per line rather than a team ' +
              'name at the top of the page.',
          },
          options: [
            { id: 'a', label: 'Every obligation is mapped to a control and to the evidence that would demonstrate the control operated.' },
            { id: 'b', label: 'One control can satisfy obligations from several regimes, so the mapping is many-to-many.' },
            { id: 'c', label: 'Each line carries a named owner, because an obligation owned by everybody is evidenced by nobody.' },
            { id: 'd', label: 'Evidence has to be retained and current, since an auditor asks for the last several periods rather than a description.' },
            { id: 'e', label: 'A policy stating that the organisation complies is adequate evidence of the control.' },
          ],
          hints: [
            'Four are sound. One confuses a statement of intent with proof of operation.',
            'Ask what you would physically hand somebody who asked you to prove this control ran.',
            'If the same control satisfies three frameworks, how many times should you implement it?',
          ],
          solution:
            'A, B, C, and D. The evidence column is the one that changes behaviour, because it ' +
            'turns "we review access quarterly" into "here are four dated reviews and the removals ' +
            'they produced". Many-to-many mapping stops three frameworks generating three copies ' +
            'of the same work, and per-line ownership stops obligations evaporating between teams. ' +
            'E is the trap: a policy says what should happen, and an auditor asks what did happen. ' +
            'A policy with no operating evidence behind it is a finding rather than a defence.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option offers a policy as evidence. Ask the difference between what should ' +
                'happen and what demonstrably did.',
            },
          ],
          debrief:
            'Build the mapping with the evidence column first if you can. It is the fastest way to ' +
            'find out which controls exist only in the policy document.',
          practice: [],
        },
        {
          id: 'rmg.9.2',
          moduleId: 'rmg.9',
          packageId: 'risk-governance',
          order: 2,
          title: 'Getting the regulatory claims right',
          kind: 'multiple-choice',
          goal: 'State what the AI regulatory picture actually contains, without inventing rules.',
          prompt:
            'A draft board paper makes several claims about AI regulation. Which of the following ' +
            'are accurate? Select all that apply.',
          teach: {
            concept:
              'Overstating a regulatory position is the fastest way to lose a room, because the ' +
              'first person to check one claim stops believing the rest of the paper. Three points ' +
              'are worth having exactly right.\n\n' +
              'The EU AI Act is risk-tiered: some practices are prohibited, a defined set of ' +
              'high-risk uses carries substantial obligations around data governance, ' +
              'documentation, human oversight, and post-market monitoring, and lighter ' +
              'transparency duties apply elsewhere. Its penalty ceilings are tiered too, and the ' +
              'highest, for prohibited practices, reaches 7 per cent of worldwide annual turnover ' +
              'or 35 million euro, whichever is higher, with lower ceilings for other breaches. The ' +
              'widely repeated 6 per cent figure comes from the 2021 draft.\n\n' +
              'The GDPR is where automated decision-making has been regulated for years: Article 22 ' +
              'gives people rights around decisions taken solely by automated means that have legal ' +
              'or similarly significant effects, subject to conditions and safeguards. And in the ' +
              'United States there is no dedicated SEC AI disclosure rule, despite how often one is ' +
              'cited. What exists is the general materiality and risk-factor regime, plus ' +
              'enforcement against companies that overstate their AI capabilities, which is a real ' +
              'exposure and a different one.',
          },
          options: [
            { id: 'a', label: 'The EU AI Act is tiered, with prohibited practices, a defined high-risk category carrying substantial obligations, and lighter transparency duties elsewhere.' },
            { id: 'b', label: 'Its highest penalty ceiling reaches 7 per cent of worldwide annual turnover or 35 million euro, whichever is higher.' },
            { id: 'c', label: 'The GDPR already regulates solely automated decisions with legal or similarly significant effects, subject to conditions and safeguards.' },
            { id: 'd', label: 'There is no dedicated SEC AI disclosure rule; the exposure is the general materiality regime plus enforcement against overstated AI claims.' },
            { id: 'e', label: 'The EU AI Act caps penalties at 6 per cent of global revenue.' },
          ],
          hints: [
            'Four are accurate. One repeats a number from a draft that was superseded.',
            'One of these regimes has been regulating automated decisions since well before anybody said "AI governance".',
            'Be careful with the American claim. What actually exists, and what do people assume exists?',
          ],
          solution:
            'A, B, C, and D. The Act is tiered in both obligations and penalties, the top ceiling ' +
            'is 7 per cent of worldwide annual turnover or 35 million euro for prohibited ' +
            'practices, the GDPR has covered solely automated decisions with significant effects ' +
            'since 2018, and the American exposure is materiality and misstatement rather than a ' +
            'dedicated AI rule. E is the 2021 draft figure, still quoted constantly, and it is the ' +
            'kind of error that costs you the room: if the number in your paper is from a ' +
            'superseded draft, everything else in it is now suspect.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option quotes a penalty ceiling from a superseded draft of the legislation.',
            },
          ],
          debrief:
            'Cite the clause, not the summary you read. Regulatory claims are the part of your ' +
            'report most likely to be checked by somebody who does this for a living.',
          practice: [],
        },
        {
          id: 'rmg.9.3',
          moduleId: 'rmg.9',
          packageId: 'risk-governance',
          order: 3,
          title: 'Compliant and safe are different claims',
          kind: 'multiple-choice',
          goal: 'Hold both directions of the gap: compliance without safety, and safety without compliance.',
          prompt:
            'A legal counsel argues that once the AI deployment satisfies the applicable ' +
            'regulations, the risk work on it is finished. Which of the following are accurate? ' +
            'Select all that apply.',
          teach: {
            concept:
              'Compliance and safety overlap and neither contains the other, which is why arguing ' +
              'about which matters more is a waste of a meeting. Regulation is a floor negotiated ' +
              'in public and written to be applicable across an industry, so it necessarily lags ' +
              'the specific thing your company is doing this quarter and says nothing about the ' +
              'risks unique to your deployment.\n\n' +
              'The gap runs both ways. A system can be fully compliant and still cause harm the ' +
              'regulation did not anticipate: nothing in a documentation requirement stops a model ' +
              'from degrading. And a system can be genuinely safe and still be non-compliant, ' +
              'because the obligation is often to be able to PROVE something rather than to be ' +
              'something, and an organisation that never wrote down its evaluations cannot ' +
              'demonstrate a thing that is nonetheless true. That second direction is worth ' +
              'internalising early, because it explains why so much governance work looks like ' +
              'paperwork: the evidence is the deliverable. Compliance is also the strongest lever ' +
              'you have for funding safety work, and treating the two as opponents throws that away.',
          },
          options: [
            { id: 'a', label: 'Regulation is a floor written for an industry, so it does not cover risks specific to this deployment.' },
            { id: 'b', label: 'A system can be compliant and still cause harm the rules did not anticipate.' },
            { id: 'c', label: 'A system can be safe in practice and still non-compliant, because many obligations are to be able to prove something.' },
            { id: 'd', label: 'Compliance obligations are often the most effective lever for funding safety work.' },
            { id: 'e', label: 'Since regulation lags, compliance work should be deprioritised in favour of technical controls.' },
          ],
          hints: [
            'Four are accurate. One turns a real limitation into a reason to ignore the obligation.',
            'Think of a system that is genuinely fine and would still fail an audit. What is missing?',
            'Which argument actually gets a control funded in most organisations?',
          ],
          solution:
            'A, B, C, and D. The floor is generic, compliance does not prevent unanticipated harm, ' +
            'and the reverse gap is just as real because many obligations are evidentiary: you are ' +
            'required to demonstrate, and an undocumented good practice demonstrates nothing. D is ' +
            'the pragmatic point. In most organisations "the regulator expects this" moves a budget ' +
            'that "this would be safer" does not, so E is both wrong and self-defeating. Deprioritise ' +
            'compliance and you lose the argument that funds the technical controls you preferred.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option treats compliance as a distraction from real security. Ask what pays ' +
                'for the technical controls in most organisations.',
            },
          ],
          debrief:
            'The mature position is that the two are allies with different vocabularies. You will ' +
            'spend more of your career translating between them than doing either.',
          practice: [],
        },
        {
          id: 'rmg.9.4',
          moduleId: 'rmg.9',
          packageId: 'risk-governance',
          order: 4,
          title: 'One gap, two audiences',
          kind: 'short-answer',
          goal: 'Express a single finding for a regulator and for the engineer who has to close it.',
          prompt:
            'Northwind cannot reconstruct why any individual loan application was declined: no ' +
            'inputs, model version, or score are retained. In three or four sentences, state the ' +
            'obligation this puts at risk and what the engineering team specifically has to build.',
          teach: {
            concept:
              'The same finding has to survive two very different readers, and juniors usually ' +
              'write for one and lose the other. A regulator or a lawyer wants the obligation and ' +
              'the exposure: which requirement is engaged, what the organisation would be unable to ' +
              'demonstrate, and what follows from that. An engineer wants the artefact: what ' +
              'specifically has to exist for this to be closed.\n\n' +
              'Here the obligation is around consequential automated decisions about people. If ' +
              'somebody exercises a right to an explanation or to contest a decision, or if a ' +
              'regulator asks how a particular case was decided, the company has to be able to ' +
              'answer, and no retained record means no answer regardless of how good the model is. ' +
              'The engineering ask is a decision record: for each decision, the inputs or features ' +
              'used, the model version, the score and threshold, and any human override, retained ' +
              'for a defined period and searchable by case. The privacy tension is part of the ' +
              'finding rather than an objection to it: this record is personal data, so it needs a ' +
              'retention limit and access control, and saying so in the same paragraph is what ' +
              'makes the recommendation credible.',
          },
          hints: [
            'Two readers, one paragraph. Name the obligation for one and the artefact for the other.',
            'What would the company say if an applicant asked why they were declined, and what would it need to have kept to say it?',
            'A good answer names the explanation or contest obligation for automated decisions, and specifies a retained decision record with inputs, model version, and score, with a retention period.',
          ],
          solution:
            'The obligation at risk is the one attaching to consequential automated decisions about ' +
            'individuals: if an applicant contests a decline or asks why, or a regulator asks how a ' +
            'particular case was decided, we currently have no answer, because nothing about the ' +
            'decision was kept. What engineering has to build is a decision record written at ' +
            'scoring time, containing the input features used, the model version identifier, the ' +
            'score and the threshold applied, and any human override, retained for a defined period ' +
            'and retrievable by application reference. That record is itself personal data, so it ' +
            'needs its own retention limit and access controls rather than being kept ' +
            'indefinitely, and the two requirements should be designed together rather than by ' +
            'different teams.',
          expectedOutput:
            'An answer naming the obligation around explaining or contesting an automated decision, ' +
            'and specifying a retained decision record with features, model version, and score, ' +
            'plus a retention limit.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['explain', 'contest', 'appeal', 'why they were', 'obligation', 'regulator asks', 'right to'],
                ['model version', 'score', 'features', 'inputs used', 'threshold', 'decision record'],
                ['retention', 'retained for', 'defined period', 'access control', 'personal data', 'how long'],
              ],
              hint:
                'Three ideas: the obligation engaged, the specific record engineering must write, ' +
                'and the retention or access limit on that record.',
            },
          ],
          debrief:
            'Findings that name the artefact get built. Findings that name only the clause get ' +
            'forwarded to legal and come back in six months unchanged.',
          practice: [],
        },
      ],
    },
    {
      id: 'rmg.10',
      packageId: 'risk-governance',
      order: 10,
      title: 'Treatment, budget, and the case you take upstairs',
      summary:
        'The four things you can do with a risk, what a control really costs, sequencing a ' +
        'roadmap that survives contact with delivery, and asking an executive for a decision.',
      exercises: [
        {
          id: 'rmg.10.1',
          moduleId: 'rmg.10',
          packageId: 'risk-governance',
          order: 1,
          title: 'Four things you can do with a risk',
          kind: 'multiple-choice',
          goal: 'Choose between mitigate, accept, avoid, and transfer, and know what transfer leaves behind.',
          prompt:
            'Northwind is deciding how to treat several risks. Which of the following are correct ' +
            'statements about treatment options? Select all that apply.',
          teach: {
            concept:
              'There are four treatments and no fifth. MITIGATE reduces likelihood or impact with ' +
              'a control, and it is the one everybody reaches for first. ACCEPT means living with ' +
              'the exposure deliberately, on the record, with an owner and an expiry. AVOID means ' +
              'not doing the thing: dropping the feature, not collecting the data, declining the ' +
              'market. Avoidance is genuinely available more often than security teams remember, ' +
              'and it is the only treatment that takes the risk to zero. TRANSFER moves some of ' +
              'the financial consequence to somebody else, through insurance or contract.\n\n' +
              'Transfer is the one that is misunderstood. Insurance pays some of the money and ' +
              'does not restore the service, undo the harm to customers, or move the regulatory ' +
              'obligation, which usually stays with you whatever the contract says. Contractual ' +
              'transfer to a supplier has the same limit: the customer whose data leaked is still ' +
              'your customer, and the regulator still writes to you. So transfer sits alongside ' +
              'mitigation rather than replacing it, and a plan whose only treatment for a critical ' +
              'risk is a policy has confused a cheque with a control.\n\n' +
              'This is worth being precise about for AI, because buying a model from a vendor feels ' +
              'more like transfer than it is. The vendor carries the training and much of the ' +
              'engineering, and the contract may carry some of the money, but the decision is still ' +
              'yours: you chose to put it in the path, you chose the threshold, and the applicant ' +
              'who was declined is your applicant. What the arrangement does change is your ' +
              'evidence position, since you now have to obtain from somebody else the ' +
              'documentation, evaluation results, and change notifications you would otherwise ' +
              'have produced yourself. That belongs in the contract, and it is the part teams ' +
              'discover they are missing during their first audit.',
          },
          options: [
            { id: 'a', label: 'Avoidance, such as not collecting the data at all, is the only option that removes the risk entirely.' },
            { id: 'b', label: 'Insurance transfers some financial consequence but not the operational disruption or the regulatory obligation.' },
            { id: 'c', label: 'Accepting a risk is a legitimate treatment when it is recorded with an owner and a review date.' },
            { id: 'd', label: 'Buying the fraud model from a vendor does not move accountability for its decisions, and it does move where the evidence has to come from.' },
            { id: 'e', label: 'A critical risk with an insurance policy behind it needs no further mitigation.' },
          ],
          hints: [
            'Four are correct. One treats a cheque as a control.',
            'After the incident, who is the regulator writing to, and who is the customer angry with?',
            'Which treatment is the only one that gets to zero, and why does nobody suggest it?',
          ],
          solution:
            'A, B, C, and D. Avoidance is the only route to zero and is under-considered, insurance ' +
            'pays money rather than restoring service, documented acceptance is a real treatment, ' +
            'and buying a model moves the work without moving the accountability while quietly ' +
            'moving your evidence into somebody else\'s hands. E is the error to catch in ' +
            'somebody else\'s plan: the policy pays out after a bad quarter in which the service ' +
            'was down, the customers were harmed, and the regulator opened a file, and none of ' +
            'those three are things a cheque fixes.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option lets an insurance policy stand in for mitigation on a critical risk. ' +
                'Ask what the policy does not restore.',
            },
          ],
          debrief:
            'Put avoidance on the table explicitly at least once per assessment. Occasionally the ' +
            'answer is that the feature was never worth what it costs to secure.',
          practice: [],
        },
        {
          id: 'rmg.10.2',
          moduleId: 'rmg.10',
          packageId: 'risk-governance',
          order: 2,
          title: 'What a control really costs',
          kind: 'multiple-choice',
          goal: 'Build a cost-benefit case that will still be true in year two.',
          prompt:
            'You are costing a proposed control. Which of the following belong in the case? Select ' +
            'all that apply.',
          teach: {
            concept:
              'Control cases are usually built on the purchase price and are wrong by the second ' +
              'year. Four things belong in the cost side. The one-off cost: licence, build, ' +
              'migration. The RUNNING cost in people, which is the one that gets omitted and is ' +
              'often the largest: somebody tunes it, reviews its output, and answers the auditor ' +
              'about it, every year. The FRICTION cost imposed on the business, in latency, in ' +
              'extra steps, in engineering time diverted, since a control that makes delivery ' +
              'slower is paying for itself with somebody else\'s budget. And the RESIDUAL RISK ' +
              'that remains after it, because the benefit is the reduction and never the whole ' +
              'exposure.\n\n' +
              'On the benefit side, the honest figure is the expected loss removed, not the worst ' +
              'case avoided. Quoting a catastrophic single loss as though the control prevents it ' +
              'every year is the same arithmetic error as the five hundred billion recommendation ' +
              'engine, and it is spotted by exactly the audience you needed to convince. It is also ' +
              'worth saying when a control cannot be justified on numbers alone and is being ' +
              'proposed because an obligation requires it. That is a legitimate case, made ' +
              'honestly, and it survives scrutiny better than an invented benefit.',
          },
          options: [
            { id: 'a', label: 'The ongoing cost in people to operate, tune, and evidence the control, not just the purchase price.' },
            { id: 'b', label: 'The friction the control imposes on the business, such as latency or added steps.' },
            { id: 'c', label: 'The residual risk that remains after the control, since the benefit is the reduction rather than the whole exposure.' },
            { id: 'd', label: 'An explicit note where a control is required by an obligation rather than justified by expected loss.' },
            { id: 'e', label: 'The full worst-case loss, counted as an annual benefit, since the control prevents that scenario.' },
          ],
          hints: [
            'Four belong. One counts a rare catastrophe as though it were prevented every year.',
            'Which cost is invisible in year one and dominant by year three?',
            'What is left of the risk after the control? That part is not a benefit.',
          ],
          solution:
            'A, B, C, and D. Running cost in people is the omission that sinks most cases, ' +
            'friction is a real cost paid by another team, residual risk keeps the benefit honest, ' +
            'and saying plainly that a control is obligation-driven is stronger than manufacturing ' +
            'a financial justification for it. E is the arithmetic that gets a case rejected: ' +
            'counting a once-in-a-decade loss as an annual benefit inflates the return by roughly ' +
            'the factor of its rarity, and the finance reviewer will find it.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option counts a rare worst case as an annual benefit. Compare it against the ' +
                'expected-loss arithmetic from module 5.',
            },
          ],
          debrief:
            'The credibility you build by declaring the running cost yourself is worth more than ' +
            'the control you might have lost by hiding it.',
          practice: [],
        },
        {
          id: 'rmg.10.3',
          moduleId: 'rmg.10',
          packageId: 'risk-governance',
          order: 3,
          title: 'A roadmap that survives delivery',
          kind: 'multiple-choice',
          goal: 'Sequence remediation by dependency and capacity, not only by risk score.',
          prompt:
            'You have thirty findings and one engineering team with a year of other commitments. ' +
            'Which of the following are sound sequencing decisions? Select all that apply.',
          teach: {
            concept:
              'A roadmap sorted purely by risk score is a list, not a plan, and it fails on contact ' +
              'with the team who has to build it. Three considerations reorder it.\n\n' +
              'DEPENDENCY: some findings cannot be closed until something else exists. Asset ' +
              'inventory, logging, and identity are the usual prerequisites, and half the register ' +
              'depends on them, so they move early even when their own scores are unremarkable. ' +
              'CAPACITY: a plan that consumes more of a team than exists is a plan that gets ' +
              'abandoned in month three, taking the credibility of the whole assessment with it. ' +
              'DURATION AND MOMENTUM: a few visible closures early buys the political room for the ' +
              'long structural work, and there is nothing dishonest about that as long as the ' +
              'sequence is stated and the big items keep their dates.\n\n' +
              'What does not belong is silent reordering to suit convenience. If a top risk is ' +
              'scheduled late because of a dependency or a capacity constraint, say so on the ' +
              'roadmap with the reason, so the person accepting the interim exposure knows they are ' +
              'accepting it.',
          },
          options: [
            { id: 'a', label: 'Enabling work such as inventory, logging, and identity moves early, because much of the register depends on it.' },
            { id: 'b', label: 'The plan is bounded by the capacity that actually exists, not by the capacity the plan would need.' },
            { id: 'c', label: 'A few early visible closures are legitimate, since they buy room for the long structural work.' },
            { id: 'd', label: 'Where a high risk is scheduled late, the roadmap states why and who is carrying the interim exposure.' },
            { id: 'e', label: 'Findings should be addressed strictly in risk score order regardless of dependencies.' },
          ],
          hints: [
            'Four are sound. One ignores that some fixes are impossible until other fixes land.',
            'What has to exist before you can close a finding about monitoring coverage?',
            'What happens to the assessment when the plan runs out of team in month three?',
          ],
          solution:
            'A, B, C, and D. Enabling work unblocks the rest of the register, capacity bounds what ' +
            'is real, early closures buy political room, and stating the reason for any deferral ' +
            'keeps the deferral a decision rather than a drift. E sounds rigorous and produces a ' +
            'plan that stalls: the top finding may require an asset inventory that does not exist, ' +
            'and insisting on strict score order means six months of no closures at all while ' +
            'everybody stops believing the roadmap.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option enforces strict score order. Ask what happens when the top finding ' +
                'depends on something that does not exist yet.',
            },
          ],
          debrief:
            'Take the draft roadmap to the engineering lead before the steering group sees it. A ' +
            'plan they have already argued with is a plan they will deliver.',
          practice: [],
        },
        {
          id: 'rmg.10.4',
          moduleId: 'rmg.10',
          packageId: 'risk-governance',
          order: 4,
          title: 'Asking an executive for a decision',
          kind: 'short-answer',
          goal: 'Compress a risk, a cost, and a consequence into a paragraph that gets a decision.',
          prompt:
            'You need 180,000 to close the highest-scoring risk on the register, which is that a ' +
            'ransomware event would take the order platform offline for about a week because ' +
            'restores are untested and backups are reachable from production. In three or four ' +
            'sentences, write the ask you would put in front of the executive committee.',
          teach: {
            concept:
              'Executives do not read to be informed, they read to decide, and a paragraph that ' +
              'does not contain a decision gets noted rather than actioned. Four elements make one ' +
              'that works. THE EXPOSURE in business terms: what stops, for how long, at what cost, ' +
              'with the estimate attached rather than an adjective. THE ASK: the specific amount ' +
              'and what it buys, expressed as an outcome such as a recovery time rather than a ' +
              'shopping list. THE CONSEQUENCE OF NOT FUNDING IT: what the committee is choosing to ' +
              'carry, stated plainly and without threat. THE DECISION REQUIRED: fund it, fund part ' +
              'of it, or accept the exposure with a name and a date on it.\n\n' +
              'The tone matters as much as the content. No adjectives doing the work of evidence, ' +
              'no implied blame, and no attempt to make the decision for them. Offering the ' +
              'acceptance as a real option is what makes the ask credible rather than a demand, ' +
              'and it is also the option they will sometimes choose, which is their prerogative ' +
              'and your record.',
          },
          hints: [
            'Four elements: what it costs us today, what the money buys, what happens if it is refused, and what you need them to decide.',
            'Give them a real alternative. If they will not fund it, what are they signing instead?',
            'A good answer states the business exposure with a number, names the amount and the outcome it buys, and closes by asking for either funding or a named acceptance.',
          ],
          solution:
            'A ransomware event today would take the order platform offline for around a week, ' +
            'because we have never tested a restore and our backups are reachable with production ' +
            'credentials, and a week of lost trading and recovery is the largest single exposure on ' +
            'the register. We are asking for 180,000, which buys immutable offline copies and a ' +
            'rehearsed restore, taking the expected outage from about a week to under a day. If it ' +
            'is not funded, the committee is choosing to carry a week-long outage at current ' +
            'estimates, and we would ask that this be recorded as an acceptance owned by the ' +
            'platform director and reviewed in six months. The decision we need today is to fund ' +
            'it, fund the offline copies alone as a partial step, or sign the acceptance.',
          expectedOutput:
            'A paragraph naming the business exposure with an estimate, the amount and the outcome ' +
            'it buys, the consequence of not funding it, and an explicit decision including a named ' +
            'acceptance as the alternative.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['180,000', '180000', 'the amount', 'buys', 'funding of'],
                ['under a day', 'reduce', 'recovery time', 'restore', 'immutable', 'offline', 'rehears'],
                ['accept', 'signed', 'owned by', 'record', 'carry', 'choosing to'],
              ],
              hint:
                'Three ideas: the amount and what it buys, the improvement in outcome it produces, ' +
                'and the named acceptance you are offering as the alternative.',
            },
          ],
          debrief:
            'Whichever way they decide, you have done the job. A recorded acceptance is a ' +
            'successful outcome of a risk conversation, not a failure of one.',
          practice: [],
        },
      ],
    },
    {
      id: 'rmg.11',
      packageId: 'risk-governance',
      order: 11,
      title: 'Tabletop exercises, and testing the assessment itself',
      summary:
        'What a discussion-based exercise can establish, designing injects that force decisions, ' +
        'reading the room for findings about the plan, and folding those findings back in.',
      exercises: [
        {
          id: 'rmg.11.1',
          moduleId: 'rmg.11',
          packageId: 'risk-governance',
          order: 1,
          title: 'What a tabletop can establish',
          kind: 'multiple-choice',
          goal: 'Know what a discussion-based exercise proves, and what still needs a technical test.',
          prompt:
            'Northwind has run a two-hour tabletop on a ransomware scenario with leadership, IT, ' +
            'legal, and communications in the room. Which of the following are accurate? Select ' +
            'all that apply.',
          teach: {
            concept:
              'A tabletop is people in a room talking through a scenario, and what it tests is ' +
              'decision-making rather than technology. It reliably establishes four things: whether ' +
              'people know their role, whether the escalation and authority path is clear, whether ' +
              'the plan is findable and current, and whether the assumptions the assessment rests ' +
              'on survive contact with the people who would have to act on them.\n\n' +
              'That last one is the most valuable and the most often missed. Assessments are full ' +
              'of assumptions like "we would isolate the affected segment within the hour", and a ' +
              'tabletop is where you discover that isolating the segment requires a change approval ' +
              'that takes four hours and that nobody in the room can waive.\n\n' +
              'What it cannot establish is anything technical. It does not prove the backups ' +
              'restore, that the failover works, or that the detection fires, because nobody ' +
              'touched a system. It is also weak on time pressure: two hours of calm discussion is ' +
              'not three in the morning on day four with a journalist calling. Both limits are ' +
              'fine, as long as the report does not quietly convert "we discussed it" into "we ' +
              'tested it".',
          },
          options: [
            { id: 'a', label: 'It establishes whether people know their roles and whether the escalation path is clear.' },
            { id: 'b', label: 'It surfaces assessment assumptions that do not survive contact with the people who would act on them.' },
            { id: 'c', label: 'It does not establish that backups restore or that failover works, because nothing was touched.' },
            { id: 'd', label: 'It under-represents time pressure, so smooth performance in the room is weak evidence about a real incident.' },
            { id: 'e', label: 'A successful tabletop demonstrates the organisation is prepared for the scenario.' },
          ],
          hints: [
            'Four are accurate. One converts a discussion into a demonstration.',
            'What was actually touched during those two hours?',
            'Which assumption in your assessment would you most like to test against the people who would have to act?',
          ],
          solution:
            'A, B, C, and D. Roles, authority, and plan quality all come out clearly, and the ' +
            'assumption testing in B is the highest-value part: the assessment says the segment is ' +
            'isolated within an hour, the tabletop reveals a four-hour change approval that nobody ' +
            'present can waive, and that is a finding worth the whole exercise. E is the sentence ' +
            'to keep out of the report. Nothing was touched and nobody was tired, so preparedness ' +
            'is exactly what a tabletop cannot demonstrate.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option upgrades a smooth discussion into proof of readiness. Ask what was ' +
                'actually exercised.',
            },
          ],
          debrief:
            'Write the limitation into the exercise report yourself. Otherwise somebody quotes the ' +
            'tabletop as evidence of recovery capability in a board paper six months later.',
          practice: [],
        },
        {
          id: 'rmg.11.2',
          moduleId: 'rmg.11',
          packageId: 'risk-governance',
          order: 2,
          title: 'Designing injects that force decisions',
          kind: 'multiple-choice',
          goal: 'Build a scenario that produces findings rather than a comfortable conversation.',
          prompt:
            'You are writing the injects for a tabletop on the fraud model behaving oddly. Which ' +
            'of the following are sound design choices? Select all that apply.',
          teach: {
            concept:
              'An inject is a piece of new information delivered mid-exercise, and its job is to ' +
              'force a decision under uncertainty. Sound injects share four properties. They ' +
              'ESCALATE: the situation gets worse or more ambiguous, so the group cannot settle ' +
              'into one comfortable posture. They FORCE A CHOICE with a cost either way, because a ' +
              'decision with an obvious right answer tests nothing. They are AMBIGUOUS in the way ' +
              'real information is: partial, second-hand, and occasionally wrong, since half the ' +
              'skill being tested is acting without confirmation. And they cross FUNCTIONS, ' +
              'pulling in legal, communications, and the business, because coordination is where ' +
              'real responses fail.\n\n' +
              'Two design failures are common. The gotcha inject, invented so the facilitator can ' +
              'reveal that the group missed something unknowable, teaches people that the exercise ' +
              'is a trap and they stop engaging. And the technically implausible inject destroys ' +
              'the credibility of the whole scenario the moment an engineer in the room says that ' +
              'cannot happen. The exercise is also not the place to appraise individuals: findings ' +
              'are about the plan and the process, and the moment participants think otherwise, ' +
              'they perform instead of deciding.',
          },
          options: [
            { id: 'a', label: 'Each inject escalates or adds ambiguity, so the group cannot settle into one posture.' },
            { id: 'b', label: 'Decisions have a cost whichever way they go, because a choice with an obvious answer tests nothing.' },
            { id: 'c', label: 'Some information is partial or later turns out to be wrong, as it is in a real incident.' },
            { id: 'd', label: 'Injects pull in legal, communications, and the business, since coordination is where responses fail.' },
            { id: 'e', label: 'A hidden detail is planted so the facilitator can reveal at the end that the group missed it.' },
          ],
          hints: [
            'Four are sound. One is designed to make the facilitator look clever.',
            'What does a participant do next time, after being caught out by something they could not have known?',
            'Where do real incident responses actually break down: the technical work, or the coordination?',
          ],
          solution:
            'A, B, C, and D. Escalation, costly choices, realistic ambiguity, and cross-functional ' +
            'pressure are what turn a discussion into a test. E is the design that ruins ' +
            'exercises: the gotcha produces one moment of facilitator satisfaction and teaches ' +
            'every participant that the exercise is a trap, after which they answer defensively ' +
            'and you learn nothing about how they would really decide. Keep the findings pointed at ' +
            'the plan, not at the people in the room.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option plants a trap for the participants. Ask how they behave in the next ' +
                'exercise after that.',
            },
          ],
          debrief:
            'Say at the start that the plan is on trial and the people are not. You will get ' +
            'honest answers, which is the only kind worth having.',
          practice: [],
        },
        {
          id: 'rmg.11.3',
          moduleId: 'rmg.11',
          packageId: 'risk-governance',
          order: 3,
          title: 'Reading the room for findings',
          kind: 'multiple-choice',
          goal: 'Distinguish an exercise observation that is a finding from one that is noise.',
          prompt:
            'During the exercise you observe several things. Which of them are findings worth ' +
            'writing up? Select all that apply.',
          teach: {
            concept:
              'The value of an exercise is in the write-up, and the write-up is only as good as the ' +
              'observer\'s filter. A finding is something about the plan, the process, or the ' +
              'assessment that would change the outcome of a real incident, and it has to be ' +
              'stated so it can be fixed by somebody who was not in the room.\n\n' +
              'Strong findings tend to be of four kinds. Authority gaps: nobody present could make ' +
              'a decision the scenario required. Information gaps: a decision needed information ' +
              'that does not exist or could not be retrieved in time. Assumption failures: the ' +
              'assessment claimed a capability the room could not deliver. And coordination ' +
              'failures: two functions each assumed the other was doing something, which is the ' +
              'classic and the one that costs hours in real incidents.\n\n' +
              'What is not a finding: an individual being unfamiliar with a plan they joined last ' +
              'month, which is a training observation and belongs in a different conversation, and ' +
              'anything about how confidently somebody spoke. Writing those up as findings is how ' +
              'you get one honest exercise and then a permanent supply of rehearsed ones.',
          },
          options: [
            { id: 'a', label: 'No one in the room could authorise taking the model out of the decision path, and the person who could was not reachable.' },
            { id: 'b', label: 'The group needed the model version history to decide, and nobody could produce it.' },
            { id: 'c', label: 'The assessment assumed a one-hour rollback, and the room concluded it would take most of a day.' },
            { id: 'd', label: 'Legal and communications each assumed the other would draft the customer notice.' },
            { id: 'e', label: 'A new analyst was unfamiliar with the escalation plan and hesitated before answering.' },
          ],
          hints: [
            'Four are findings. One is an observation about a person rather than about the plan.',
            'Ask of each: would fixing this change how a real incident goes, and can somebody outside the room act on it?',
            'One of these is a training matter, and writing it up as a finding costs you honest participation next time.',
          ],
          solution:
            'A, B, C, and D. An authority gap, a missing information source, an assessment ' +
            'assumption that did not survive, and a coordination gap between two functions are all ' +
            'fixable by somebody who was not present, which is the test. E is a training ' +
            'observation about one person, and it is worth acting on quietly and not worth writing ' +
            'into a report that names them. Note also that C feeds straight back into the risk ' +
            'assessment, since a rollback that takes a day rather than an hour changes the impact ' +
            'estimate for every risk that depended on it.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One observation is about an individual rather than the plan. Ask who outside the ' +
                'room could act on it.',
            },
          ],
          debrief:
            'The finding that changes an impact estimate is the one to chase. That is the exercise ' +
            'improving the assessment, which is the whole reason for running it.',
          practice: [],
        },
        {
          id: 'rmg.11.4',
          moduleId: 'rmg.11',
          packageId: 'risk-governance',
          order: 4,
          title: 'Folding an exercise finding back in',
          kind: 'short-answer',
          goal: 'Convert an exercise observation into a change to the register, not just a report line.',
          prompt:
            'In the exercise, the group agreed that taking the fraud model out of the decision ' +
            'path needed sign-off from an executive who could not be reached for over three hours. ' +
            'In three or four sentences, write this up and say what it changes in the assessment.',
          teach: {
            concept:
              'Exercise reports get read once. Register entries get funded, so a finding that stops ' +
              'at the report has done half its job. The write-up needs three parts: what was ' +
              'observed, what it means for a real incident, and what specifically changes as a ' +
              'result.\n\n' +
              'The third part usually takes two forms at once. A CONTROL CHANGE: here, a standing ' +
              'delegation of authority so a named on-call role can disable the model, with the ' +
              'executive informed rather than consulted, plus a documented safe posture to fall ' +
              'back to. And an ASSESSMENT CHANGE: the impact estimate for every risk involving bad ' +
              'model output has been understating the exposure window by three hours, so those ' +
              'scores are wrong and should be revised. That second half is what distinguishes ' +
              'somebody who runs exercises from somebody who runs a risk programme. An exercise ' +
              'that never changes a score was either unnecessary or was not listened to.',
          },
          hints: [
            'Two things need to change: something about how the organisation is set up, and something about the numbers in your register.',
            'If it takes three hours to reach the person who can stop it, what has your impact estimate been assuming?',
            'A good answer proposes a delegated authority or pre-approved action for an on-call role, and says the exposure window and the impact estimate must be revised.',
          ],
          solution:
            'The exercise showed that disabling the model requires sign-off from an executive who ' +
            'was unreachable for more than three hours, so in a real event the model would keep ' +
            'making decisions throughout that window with nobody empowered to stop it. The control ' +
            'change is a standing delegation: a named on-call role is pre-authorised to take the ' +
            'model out of the decision path and fall back to the documented safe posture, with the ' +
            'executive informed rather than consulted. The assessment change matters as much, ' +
            'because every risk involving bad model output has been scored on an assumed exposure ' +
            'window that is at least three hours short, so those impact estimates are understated ' +
            'and need revising. I would raise both together, since the delegation is cheap and the ' +
            'rescoring is what justifies it.',
          expectedOutput:
            'A write-up naming the delayed authority as the observed problem, proposing a delegated ' +
            'or pre-approved action for an on-call role, and stating that the exposure window and ' +
            'the impact estimates in the register must be revised.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['delegat', 'pre-authoris', 'pre-approv', 'on-call', 'standing authority', 'empowered'],
                ['exposure window', 'three hours short', 'understated', 'impact estimate', 'rescor', 'revis'],
                ['register', 'assessment', 'score', 'estimate'],
              ],
              hint:
                'Two changes: the authority that lets somebody act sooner, and the impact estimates ' +
                'in the assessment that were computed on the wrong exposure window.',
            },
          ],
          debrief:
            'Track your exercises by how many register entries they changed. It is a better measure ' +
            'of the programme than how smoothly the room performed.',
          practice: [],
        },
      ],
    },
    {
      id: 'rmg.12',
      packageId: 'risk-governance',
      order: 12,
      title: 'Capstone: the assessment, the brief, and the call you make at speed',
      summary:
        'What belongs in the register, the report, and the summary, prioritising a mixed portfolio ' +
        'of traditional and AI risk, briefing an executive, and deciding under time pressure.',
      exercises: [
        {
          id: 'rmg.12.1',
          moduleId: 'rmg.12',
          packageId: 'risk-governance',
          order: 1,
          title: 'Three documents, three audiences',
          kind: 'multiple-choice',
          goal: 'Put each piece of an assessment where its reader will actually find it.',
          prompt:
            'You are assembling the output of a full assessment. Which of the following are sound ' +
            'decisions about what goes where? Select all that apply.',
          teach: {
            concept:
              'An assessment produces three artefacts with three different lifetimes and readers, ' +
              'and collapsing them into one document is why so much of this work goes unread.\n\n' +
              'The REGISTER is the living record: one line per risk, with the scenario, the score ' +
              'and its inputs, the owner, the treatment, and the review date. It outlives the ' +
              'engagement and is the thing that gets reviewed quarterly. The REPORT is the ' +
              'evidence: scope, method, what was and was not examined, the findings with enough ' +
              'detail to be reproduced or argued with, and the limitations. It exists so a reader ' +
              'in a year can tell what was actually done, and the limitations section is what makes ' +
              'it honest. The EXECUTIVE SUMMARY is a page: the handful of risks that matter, what ' +
              'is being asked for, and the decisions required.\n\n' +
              'The most common failure is a summary that summarises the report instead of asking ' +
              'for a decision. The second most common is a register with no owners, which turns ' +
              'the whole exercise into a document nobody is accountable for.',
          },
          options: [
            { id: 'a', label: 'The register carries owners, treatments, and review dates, because it outlives the engagement.' },
            { id: 'b', label: 'The report states scope, method, and what was not examined, so a later reader knows what the work covered.' },
            { id: 'c', label: 'The executive summary leads with the decisions required rather than describing the method.' },
            { id: 'd', label: 'AI risks sit in the same register and are scored on the same scale as everything else.' },
            { id: 'e', label: 'Limitations are best left out, since they undermine confidence in the findings.' },
          ],
          hints: [
            'Four are sound. One removes the section that makes the report trustworthy.',
            'Ask what each document is for and who opens it a year from now.',
            'What happens to your credibility when somebody discovers a limitation you did not declare?',
          ],
          solution:
            'A, B, C, and D. Owners and dates make the register a live control, method and scope ' +
            'make the report reproducible, a summary that opens with the decision gets a decision, ' +
            'and one register for all risk types is what lets AI findings compete for budget. E ' +
            'inverts the truth. A declared limitation is what makes the rest of the report ' +
            'credible, and an undeclared one that somebody discovers later invalidates every claim ' +
            'you made, including the ones that were sound.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option hides the limitations. Ask what happens when a reader finds one you did ' +
                'not declare.',
            },
          ],
          debrief:
            'Write the limitations section first, while you still remember everything you could not ' +
            'get to. It is much harder to write honestly at the end.',
          practice: [],
        },
        {
          id: 'rmg.12.2',
          moduleId: 'rmg.12',
          packageId: 'risk-governance',
          order: 2,
          title: 'Prioritising a mixed portfolio',
          kind: 'multiple-choice',
          goal: 'Rank traditional and AI findings against each other on one scale.',
          prompt:
            'Northwind\'s register contains: an unpatched internet-facing appliance with known ' +
            'exploitation in the wild; a fraud model with no performance monitoring and no named ' +
            'owner; untested backups on the order platform; and a chatbot that can be made to ' +
            'produce embarrassing output. Which of the following are sound prioritisation ' +
            'judgements? Select all that apply.',
          teach: {
            concept:
              'A mixed portfolio is where the discipline of one register pays off, because the ' +
              'question stops being "how worrying is AI" and becomes "which of these four costs ' +
              'the most and how likely is each".\n\n' +
              'Three principles do the work. Known exploitation moves a finding to the top ' +
              'regardless of its base severity, because likelihood has stopped being an estimate. ' +
              'Governance gaps score higher than they look, because they multiply everything else: ' +
              'an unmonitored, unowned model means every other failure in that system goes ' +
              'undetected indefinitely, and the fix is usually cheap. And reputational findings ' +
              'are real but need honest sizing, since an embarrassing output that is screenshotted ' +
              'is a bad week, while a systematically wrong decision affecting thousands of ' +
              'customers is a different order of problem.\n\n' +
              'What ruins the ranking is novelty. The AI findings are neither automatically the ' +
              'most urgent because they are new nor automatically less urgent because they are ' +
              'unfamiliar, and both distortions show up constantly in real registers.',
          },
          options: [
            { id: 'a', label: 'The exploited appliance goes first, because known exploitation replaces an estimated likelihood with an observed one.' },
            { id: 'b', label: 'The unmonitored, unowned model ranks high because the gap hides every other failure in that system and the fix is cheap.' },
            { id: 'c', label: 'Untested backups rank high because they set the impact of several other risks, including the appliance.' },
            { id: 'd', label: 'The chatbot finding is real but is sized as a reputational event rather than as a decision failure.' },
            { id: 'e', label: 'The AI findings should be ranked above the others because AI risk is the newest area.' },
          ],
          hints: [
            'Four are sound. One ranks by novelty.',
            'Which finding changes the impact of the others rather than having a big impact of its own?',
            'What does known exploitation do to a likelihood estimate?',
          ],
          solution:
            'A, B, C, and D. Observed exploitation beats estimated likelihood, the governance gap ' +
            'multiplies every other failure in that system and is cheap to close, untested backups ' +
            'set the impact of several other risks including the appliance one, and the chatbot is ' +
            'a genuine but smaller reputational exposure. E is the distortion to resist in both ' +
            'directions: novelty is not severity, and a register that ranks by how new a technology ' +
            'is will leave an actively exploited appliance below a chatbot that says something ' +
            'awkward.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'One option ranks by how new the technology is rather than by likelihood and ' +
                'consequence.',
            },
          ],
          debrief:
            'The findings that set the impact of other findings, backups and monitoring, are ' +
            'chronically under-ranked. Look for them first in any register you inherit.',
          practice: [],
        },
        {
          id: 'rmg.12.3',
          moduleId: 'rmg.12',
          packageId: 'risk-governance',
          order: 3,
          title: 'The paragraph the board reads',
          kind: 'short-answer',
          goal: 'Brief a mixed portfolio in one paragraph that produces a decision.',
          prompt:
            'Using the four register entries from the previous exercise, write the opening ' +
            'paragraph of the executive summary. Three or four sentences, addressed to people who ' +
            'will read nothing else.',
          teach: {
            concept:
              'This is the most re-read paragraph you will write and the one most often wasted on ' +
              'describing the engagement. It has three jobs. Say what the organisation is carrying ' +
              'right now, in business terms and led by the largest item rather than by category. ' +
              'Say what the concentration is, meaning the common cause underneath several ' +
              'findings, because that is what makes a portfolio comprehensible rather than a list. ' +
              'And ask for the decision, naming the money or the authority and the alternative if ' +
              'it is refused.\n\n' +
              'Three habits keep it credible. Attach an estimate to any claim of size, because ' +
              '"significant" is not a quantity. Do not lead with the AI findings for novelty or ' +
              'bury them for unfamiliarity; put them where their consequence puts them. And state ' +
              'one thing that is working, when there is one, since a summary in which everything is ' +
              'critical trains the reader to discount the next one.',
          },
          hints: [
            'Lead with what the organisation is carrying today, not with what you did last month.',
            'Two of these findings share a cause: nobody would notice the failure. Say that once rather than twice.',
            'A good answer leads with the most consequential exposure, groups the findings around the absence of detection or recovery, and closes with the decision or funding being requested.',
          ],
          solution:
            'Northwind is currently carrying two exposures that would each stop trading for around ' +
            'a week: an internet-facing appliance being actively exploited elsewhere, and an order ' +
            'platform whose backups have never been restored, which means an incident on either ' +
            'becomes a recovery project rather than an outage. Underneath three of the four ' +
            'findings is the same cause, which is that nobody would notice in time: the appliance ' +
            'is unmonitored, the restores are unproven, and the fraud model has no owner and no ' +
            'performance alerting, so it could serve wrong decisions for months undetected. The ' +
            'fourth finding, a chatbot that can be provoked into embarrassing output, is a ' +
            'reputational exposure of a smaller order and is scheduled behind the others. We are ' +
            'asking the committee to fund the detection and recovery work this quarter, or to ' +
            'record acceptance of a week-long outage with a named owner.',
          expectedOutput:
            'A paragraph leading with the largest business exposure, naming the common cause across ' +
            'several findings, placing the smaller reputational finding proportionately, and closing ' +
            'with the funding decision or a named acceptance.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['week', 'stop trading', 'outage', 'recovery project', 'exploited', 'largest'],
                ['nobody would notice', 'undetected', 'no alerting', 'unmonitored', 'unproven', 'common cause', 'same cause'],
                ['fund', 'asking', 'accept', 'decision', 'committee', 'record'],
              ],
              hint:
                'Three ideas: the largest exposure in business terms, the cause several findings ' +
                'share, and the decision you want from the room.',
            },
          ],
          debrief:
            'Read it back and count the sentences that describe your work rather than their ' +
            'exposure. Cut every one of them.',
          practice: [],
        },
        {
          id: 'rmg.12.4',
          moduleId: 'rmg.12',
          packageId: 'risk-governance',
          order: 4,
          title: 'The call you make at speed',
          kind: 'short-answer',
          goal: 'Make and defend a risk decision on incomplete information, which is what the exercise venue asks for.',
          prompt:
            'It is 09:40. The fraud model is declining roughly four times the usual share of ' +
            'transactions and nobody knows why yet. Turning it off means every payment goes to a ' +
            'manual queue that can handle about a fifth of the volume. You have five minutes and ' +
            'the authority to decide. In three or four sentences, say what you do and how you ' +
            'would justify it afterwards.',
          teach: {
            concept:
              'Everything so far has been deliberate work with time to think. Real risk decisions ' +
              'are frequently made in minutes on partial information, and the standard is not that ' +
              'you were right. It is that the decision was defensible on what was knowable at the ' +
              'time, that it was reversible where possible, and that it was recorded.\n\n' +
              'Three habits make a fast decision defensible. Pick the option that preserves ' +
              'optionality: a reversible action taken early beats an irreversible one taken ' +
              'correctly later, which usually means partial measures over total ones. Name the ' +
              'trade explicitly, since here both directions cost money, either in wrongly declined ' +
              'customers or in fraud let through, and pretending otherwise is what makes a decision ' +
              'indefensible afterwards. And set the next checkpoint: what you will know at 10:00, ' +
              'what would make you reverse, and who is being told now.\n\n' +
              'A reasonable answer might raise the threshold, route only high-value transactions to ' +
              'review, or fall back for a segment rather than for everything. What is not ' +
              'defensible is doing nothing while you gather more information without saying so, ' +
              'because that is also a decision, and it is one that keeps a suspect model in the ' +
              'decision path by default.',
          },
          hints: [
            'Both options cost money. Say which cost you are choosing and why, rather than looking for the free one.',
            'The queue handles a fifth of the volume. Is there a partial action that fits inside that capacity?',
            'A good answer commits to an action, names the trade-off it accepts, and sets a checkpoint or reversal condition rather than waiting silently for more information.',
          ],
          solution:
            'I would not turn the model off outright, because the manual queue can absorb only ' +
            'about a fifth of the volume and a full fallback converts an accuracy problem into a ' +
            'trading outage. Instead I would keep the model in the path but stop acting on its ' +
            'declines below a value threshold, sending only high-value declines to the manual ' +
            'queue so we stay inside its capacity, which accepts some additional fraud on low-value ' +
            'transactions as the price of not blocking legitimate customers at four times the ' +
            'normal rate. That is the trade I am choosing deliberately and it is reversible within ' +
            'minutes. I would tell the fraud owner and payments now, and set a checkpoint at 10:00: ' +
            'if we have identified a data or version change by then we roll back, and if the ' +
            'decline rate has not returned toward normal we widen the fallback.',
          expectedOutput:
            'A decision that commits to a specific partial action within the fallback capacity, ' +
            'names the trade-off being accepted, and sets a checkpoint or reversal condition with ' +
            'somebody informed.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['threshold', 'high-value', 'partial', 'segment', 'subset', 'capacity'],
                ['trade', 'accept', 'price of', 'cost of', 'in exchange', 'some fraud'],
                ['checkpoint', 'reverse', 'reversib', 'by 10', 'review at', 'roll back', 'if the'],
              ],
              hint:
                'Three ideas: the specific action that fits the fallback capacity, the cost you are ' +
                'knowingly accepting, and when you will look again or undo it.',
            },
          ],
          debrief:
            'That is the shape of the work in the risk exercise venue, where a small team takes ' +
            'cascading decisions in real time against a scenario that keeps moving. The habits ' +
            'transfer: reversible first, name the trade, set the checkpoint, write it down.',
          practice: [],
        },
      ],
    },
  ],
};
