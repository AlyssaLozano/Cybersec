/**
 * Practice drills for SOC Foundations: five per written exercise, 25 in total.
 *
 * WHY WRITTEN EXERCISES GET DRILLS
 *
 * The practice file for Incident Response argues that a drill earns its place
 * only where repeating a skill against a different target teaches something, and
 * that this is false of writing. Half of that is right. It IS false of a
 * decision point, where the whole value is committing once without knowing the
 * outcome, and doing it twice is reading the answer key with extra steps.
 *
 * It is not true of writing. Explaining a tradeoff to a different audience,
 * about a different role, under a different constraint, is the only way anybody
 * has ever got better at it. A student who can place the log analyst but freezes
 * on the forensics analyst has not learned the idea, they have learned one
 * answer, and five reps against five roles is what tells the two apart.
 *
 * HOW THESE ARE GRADED
 *
 * Same as their parents: `answer-mentions`, which is a lowercase substring match
 * requiring one synonym from every group. That grades whether the answer covers
 * the required ideas, not whether it used particular words, and the synonym
 * lists are deliberately wide. Every model solution in this file is run through
 * the real evaluator by soc-foundations-practice.test.ts, because a drill whose
 * own answer fails its own checks is a trap.
 */

import type { PracticeItem } from '@soc/shared';

export const SOC_FOUNDATIONS_PRACTICE: Record<string, PracticeItem[]> = {
  // --- soc.1.6: where a role sits, and why -----------------------------------
  'soc.1.6': [
    {
      id: 'soc.1.6-p1',
      prompt:
        'Same question, different role. In two or three sentences, say what a Threat Intelligence ' +
        'Analyst does, then give one reason an organisation might embed it in the SOC and one ' +
        'reason it might sit in a separate function.',
      teach: {
        note:
          'Threat intel is the role most often placed outside the SOC, because its output serves ' +
          'more than the SOC: it feeds risk, architecture, and executive briefing as much as it ' +
          'feeds the alert queue. Notice that the argument is the same shape as for the log ' +
          'analyst, and only the pull in each direction changes.',
      },
      solution:
        'A threat intelligence analyst researches adversaries and campaigns and produces the ' +
        'indicators and techniques worth watching for. Embedding it in the SOC means the operators ' +
        'get context on a live alert fast, and hunting leads land on the floor the same day. ' +
        'Placing it in a separate function means the same research also serves risk, architecture ' +
        'and the executive team across the whole business, rather than only the queue.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['adversary', 'campaign', 'indicator', 'research', 'attribution', 'intel'],
            ['embed', 'inside', 'within', 'on the floor', 'part of the soc', 'fast', 'speed'],
            ['separate', 'outside', 'whole business', 'risk', 'architecture', 'executive', 'shared'],
          ],
          hint:
            'Three things are needed: what the role produces, one reason to put it on the floor, and one reason to put it elsewhere.',
        },
      ],
    },
    {
      id: 'soc.1.6-p2',
      prompt:
        'Now the Forensics Analyst. In two or three sentences say what the role does, then give one ' +
        'reason to keep it inside the SOC and one reason to hold it as a specialist team called in ' +
        'when needed.',
      teach: {
        note:
          'Forensics is the clearest case of a role that is expensive to staff full time and ' +
          'occasionally urgent, which is exactly the shape that gets centralised. The cost of ' +
          'centralising is the hours between needing it and getting it, and those hours are spent ' +
          'on a live incident.',
      },
      solution:
        'A forensics analyst preserves evidence and reconstructs what happened on a host in a way ' +
        'that survives being challenged later. Keeping it inside the SOC means evidence is ' +
        'preserved in the first minutes of an incident, before somebody helpfully reboots the ' +
        'machine and destroys memory. Holding it as a specialist team called in when needed is ' +
        'usually cheaper, because the skill is expensive and rarely required, but you wait for it.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['evidence', 'preserve', 'image', 'artefact', 'artifact', 'reconstruct', 'memory'],
            ['inside', 'embed', 'within', 'first minutes', 'immediately', 'fast', 'straight away'],
            ['specialist', 'called in', 'shared', 'central', 'cost', 'expensive', 'rarely', 'wait'],
          ],
          hint:
            'Cover what forensics produces, the argument for having it on hand, and the argument for pooling it.',
        },
      ],
    },
    {
      id: 'soc.1.6-p3',
      prompt:
        'The Detection Engineer. Say what the role does, then give one reason to place it in the ' +
        'SOC and one reason to place it with a security engineering or platform team.',
      teach: {
        note:
          'Detection engineering is pulled in both directions harder than any other seat. On the ' +
          'floor it hears which rules are hurting the operators; on a platform team it owns the ' +
          'pipeline the rules run on. Organisations genuinely split on this one, and both answers ' +
          'are defensible.',
      },
      solution:
        'A detection engineer writes and tunes the rules that catch threats automatically, so the ' +
        'output is preventive rather than a finding. Placing it in the SOC means it hears directly ' +
        'which rules are drowning the queue and can tune them against real operator pain. Placing ' +
        'it with a security engineering or platform team means it owns the logging pipeline and the ' +
        'detection content together, so a rule and the data it needs are built by the same people.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['rule', 'detection logic', 'tune', 'automate', 'signature', 'preventive'],
            ['soc', 'floor', 'operator', 'queue', 'feedback', 'noise'],
            ['platform', 'engineering', 'pipeline', 'data', 'logging', 'separate', 'infrastructure'],
          ],
          hint:
            'Name what the role produces, then one pull towards the floor and one pull towards the platform.',
        },
      ],
    },
    {
      id: 'soc.1.6-p4',
      prompt:
        'The Vulnerability Analyst. Say what the role does, and give one reason to place it in the ' +
        'SOC and one reason to place it in an IT or infrastructure team.',
      teach: {
        note:
          'This one usually lands outside the SOC, and the reason is worth noticing: the work ends ' +
          'in somebody patching a system, and that somebody reports to IT. A role whose output is a ' +
          'request to another team is often placed inside that team.',
      },
      solution:
        'A vulnerability analyst finds weaknesses across the estate, decides which ones actually ' +
        'matter, and drives them to being fixed. Placing it in the SOC means exposure data sits ' +
        'next to alert data, so an operator can tell whether the host being attacked was vulnerable ' +
        'to the thing being attempted. Placing it in an IT or infrastructure team means it sits with ' +
        'the people who will do the patching, which is usually what actually gets things closed.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['vulnerab', 'weakness', 'exposure', 'patch', 'scan', 'remediat'],
            ['soc', 'alert', 'context', 'triage', 'exploit', 'next to'],
            ['it ', 'infrastructure', 'ops', 'separate', 'patching', 'fix', 'closed'],
          ],
          hint:
            'Say what the role produces, why the SOC would want it close, and why IT would want it closer.',
        },
      ],
    },
    {
      id: 'soc.1.6-p5',
      prompt:
        'Turn the question round. Name one role that is genuinely core to the SOC and could not sit ' +
        'anywhere else, and explain in two or three sentences why placing it outside would not work.',
      teach: {
        note:
          'The inverse of the exercise, and the harder half. The test is not whether the role is ' +
          'important, it is whether the work depends on being on the floor as things happen. A seat ' +
          'that has to react in minutes to something it is watching cannot be a service you request.',
      },
      solution:
        'The triage operator is core to the SOC and cannot sit anywhere else. The work is watching ' +
        'the queue continuously and reacting within minutes, so it depends entirely on being on the ' +
        'floor while things happen rather than being a service another team requests. Placing it ' +
        'outside would mean alerts waiting in a queue for somebody in another reporting line to ' +
        'pick them up, which is the same as not having triage at all.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['operator', 'triage', 'queue', 'lead', 'coordinator', 'analyst'],
            ['live', 'minutes', 'continuous', 'as it happens', 'real time', 'immediately', 'shift', 'watching'],
            ['outside', 'elsewhere', 'another team', 'separate', 'would not work', 'delay', 'wait'],
          ],
          hint:
            'Name the role, say what about the work makes it time-critical, and say what breaks if it sits elsewhere.',
        },
      ],
    },
  ],

  // --- soc.2.4: the triage tradeoff ------------------------------------------
  'soc.2.4': [
    {
      id: 'soc.2.4-p1',
      prompt:
        'The same tradeoff somewhere else. A mail gateway decides whether to quarantine a message. ' +
        'In two or three sentences, describe the two failures it sits between and why tuning it is hard.',
      teach: {
        note:
          'The triage tradeoff is not about alerts, it is about any decision made at volume under ' +
          'time pressure with imperfect information. Recognising the same shape in a spam filter is ' +
          'what tells you the lesson generalised rather than being memorised.',
      },
      solution:
        'Quarantine too little and a phishing message reaches somebody who clicks it, which is the ' +
        'miss. Quarantine too much and legitimate business mail disappears, so people stop trusting ' +
        'the filter and ask for exceptions that widen the hole. The gateway has milliseconds and no ' +
        'way to know intent, so every threshold change trades one failure for the other.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['miss', 'through', 'reach', 'phish', 'malicious', 'false negative', 'clicks'],
            ['legitimate', 'false positive', 'block', 'business', 'over-block', 'too much', 'genuine'],
            ['trade', 'threshold', 'balance', 'cannot', 'both', 'tension', 'exception'],
          ],
          hint: 'Name both failure directions and say why you cannot avoid both at once.',
        },
      ],
    },
    {
      id: 'soc.2.4-p2',
      prompt:
        'An EDR product decides whether to automatically isolate a host from the network. Describe ' +
        'the two failures that decision sits between, in two or three sentences.',
      teach: {
        note:
          'Automatic containment raises the stakes on both sides: the miss lets an intrusion spread ' +
          'while nobody is looking, and the over-reaction takes a production system off the network ' +
          'with no human in the loop. This is the same tradeoff with the consequences enlarged.',
      },
      solution:
        'Isolate too rarely and a compromised host keeps talking to an attacker and spreading while ' +
        'nobody is watching, which is the miss. Isolate too freely and you take production systems ' +
        'off the network on a false positive, which can be an outage nobody authorised. Because the ' +
        'action happens automatically there is no human to sanity-check either mistake, so the ' +
        'threshold has to absorb both risks by itself.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['miss', 'spread', 'lateral', 'keeps', 'unseen', 'false negative', 'compromis'],
            ['outage', 'production', 'false positive', 'disrupt', 'unavailab', 'business', 'offline'],
            ['automatic', 'no human', 'threshold', 'trade', 'balance', 'both'],
          ],
          hint: 'Both directions plus what makes automation change the stakes.',
        },
      ],
    },
    {
      id: 'soc.2.4-p3',
      prompt:
        'You are setting the threshold at which an on-call engineer gets paged at 3am. Describe the ' +
        'two failures and why the tradeoff is hard.',
      teach: {
        note:
          'Paging is the version of this tradeoff where the cost of over-escalation is a person ' +
          'rather than a queue. Alert fatigue is not a metaphor here: an engineer woken repeatedly ' +
          'for nothing stops responding urgently, and the degradation is permanent rather than ' +
          'per-incident.',
      },
      solution:
        'Set the threshold too high and a real outage or intrusion runs until morning with nobody ' +
        'awake to catch it. Set it too low and the engineer is woken repeatedly for things that did ' +
        'not need them, and after enough of those they stop treating a page as urgent, so the real ' +
        'one gets a slow response too. The cost of the second failure is paid by a person and it ' +
        'does not reset overnight, which is what makes it hard to tune honestly.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['miss', 'until morning', 'nobody', 'unnoticed', 'runs', 'too high', 'false negative'],
            ['fatigue', 'woken', 'burn', 'stop', 'ignore', 'noise', 'too many', 'desensit'],
            ['trade', 'threshold', 'balance', 'cannot', 'both', 'tension'],
          ],
          hint: 'Both failures, and what repeated false pages do to the person on the other end.',
        },
      ],
    },
    {
      id: 'soc.2.4-p4',
      prompt:
        'A fraud team decides whether to decline a card transaction in real time. Describe the two ' +
        'failures and why the tradeoff is hard.',
      teach: {
        note:
          'Worth doing because the asymmetry is different here: the cost of a miss is money the ' +
          'business can quantify to the penny, and the cost of over-blocking is a customer who ' +
          'leaves and never says why. When one side of a tradeoff is measurable and the other is ' +
          'not, the measurable one wins by default, and that is a failure mode in itself.',
      },
      solution:
        'Decline too little and fraudulent transactions go through, which is a direct and easily ' +
        'measured loss. Decline too much and genuine customers are refused at the till, and some of ' +
        'them stop using the card without ever complaining. The tradeoff is hard because the ' +
        'fraud loss is countable and the lost customer is not, so the measurable side quietly ' +
        'dominates every threshold decision unless somebody argues for the other one.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['fraud', 'through', 'loss', 'miss', 'false negative', 'undetected'],
            ['genuine', 'legitimate', 'customer', 'declin', 'false positive', 'refus', 'blocked'],
            ['measur', 'countab', 'quantif', 'trade', 'balance', 'invisible', 'not measured'],
          ],
          hint: 'Both directions, and something about how the two costs compare in visibility.',
        },
      ],
    },
    {
      id: 'soc.2.4-p5',
      prompt:
        'Argue the other side. Somebody proposes fixing alert fatigue by telling operators to ' +
        'escalate anything they are unsure about. In two or three sentences, say what that policy ' +
        'actually does.',
      teach: {
        note:
          'The reason "when in doubt, escalate" is such a common instruction is that it sounds ' +
          'cautious. It is worth being able to say precisely why it fails: it moves the tradeoff ' +
          'up a tier rather than resolving it, and the tier it moves to is smaller and more ' +
          'expensive than the one it came from.',
      },
      solution:
        'It does not remove the tradeoff, it moves it to the next tier. Everything uncertain now ' +
        'lands on a smaller and more expensive team, who then have to dismiss most of it, so the ' +
        'same judgement gets made by fewer people with less time. Meanwhile the real alerts are ' +
        'buried in the volume that was escalated with them, which is the exact failure the policy ' +
        'was meant to prevent.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['moves', 'shifts', 'passes', 'next tier', 'tier 2', 'upstream', 'somebody else', 'does not remove'],
            ['bury', 'buried', 'volume', 'noise', 'drown', 'overwhelm', 'flood'],
            ['same', 'still', 'judgement', 'decision', 'fewer', 'smaller', 'expensive'],
          ],
          hint:
            'Say where the decision actually goes, what happens to the real alerts, and why the problem is not solved.',
        },
      ],
    },
  ],

  // --- soc.3.5: telling similar roles apart ----------------------------------
  'soc.3.5': [
    {
      id: 'soc.3.5-p1',
      prompt:
        'Another confusable trio. Explain in a few sentences how a SOC Operator, an Incident ' +
        'Response Lead, and a Forensics Analyst differ from one another.',
      teach: {
        note:
          'These three all touch the same incident and are told apart by scope and by time. The ' +
          'operator decides whether there is an incident at all, the lead runs it while it is live, ' +
          'and forensics establishes what happened in a way that holds up afterwards.',
      },
      solution:
        'The SOC operator works the alert queue and decides whether something is worth raising at ' +
        'all, which is a judgement made in minutes on many alerts. The incident response lead takes ' +
        'a confirmed incident and runs it: coordinating the response, making the containment calls, ' +
        'and owning the outcome. The forensics analyst preserves and examines evidence to establish ' +
        'what actually happened in a way that survives being challenged later.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['queue', 'triage', 'alert', 'operator', 'first', 'spot'],
            ['coordinat', 'lead', 'run', 'contain', 'decision', 'manage', 'owns'],
            ['evidence', 'preserve', 'forensic', 'image', 'reconstruct', 'court', 'afterwards'],
          ],
          hint: 'One line each, and make each line say something the other two do not.',
        },
      ],
    },
    {
      id: 'soc.3.5-p2',
      prompt:
        'Distinguish a Penetration Tester, a Red Teamer, and a Vulnerability Analyst in a few sentences.',
      teach: {
        note:
          'These blur constantly, including in job adverts. The distinctions that matter are scope ' +
          'and objective: a pentest enumerates flaws in a defined target, a red team tests whether ' +
          'the defenders detect a realistic adversary, and vulnerability management is a continuous ' +
          'process rather than an engagement at all.',
      },
      solution:
        'A penetration tester is given a defined target and a time box and finds as many exploitable ' +
        'flaws in it as they can, then reports them. A red teamer emulates a specific adversary ' +
        'against the whole organisation with an objective, and the thing being tested is whether ' +
        'the defenders detect and respond, not whether a flaw exists. A vulnerability analyst runs ' +
        'a continuous process of scanning, prioritising and driving fixes across the estate, rather ' +
        'than a time-boxed engagement.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['scope', 'defined target', 'time box', 'timebox', 'engagement', 'as many', 'report'],
            ['red team', 'emulat', 'adversary', 'objective', 'detect', 'respond', 'stealth', 'realistic'],
            ['continuous', 'scan', 'prioriti', 'estate', 'process', 'ongoing', 'patch', 'fix'],
          ],
          hint: 'Separate them on scope, on objective, and on whether the work is an engagement or a process.',
        },
      ],
    },
    {
      id: 'soc.3.5-p3',
      prompt:
        'Distinguish a Detection Engineer from a Security Engineer, and say why organisations often ' +
        'confuse the two.',
      teach: {
        note:
          'Only two roles this time, and deliberately the hardest pair. Both build things, both ' +
          'write code, and both sit near the platform. The line is what the output is for: one ' +
          'makes attacks visible, the other makes them harder. Confusing them usually means one of ' +
          'those two jobs is quietly not being done.',
      },
      solution:
        'A detection engineer builds logic that makes an attack visible: rules, the data they need, ' +
        'and the tuning that keeps them usable. A security engineer builds and hardens the systems ' +
        'themselves so the attack is harder or impossible in the first place, through segmentation, ' +
        'baselines and controls. Organisations confuse them because both are technical building ' +
        'roles near the platform, and the result is usually that one of the two is not actually ' +
        'being done by anybody.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['detect', 'visible', 'rule', 'alert', 'logic', 'see'],
            ['harden', 'prevent', 'control', 'segment', 'baseline', 'build', 'secure', 'configur'],
            ['confus', 'blur', 'both', 'overlap', 'technical', 'similar', 'neither', 'not being done'],
          ],
          hint: 'Say what each output is for, and why the two get merged.',
        },
      ],
    },
    {
      id: 'soc.3.5-p4',
      prompt:
        'Distinguish a Threat Hunter from a SOC Operator, and say what a hunter does on a day when ' +
        'no alert has fired.',
      teach: {
        note:
          'The second half is the real question. A role defined by what it does in the absence of an ' +
          'alert is a role you can only describe if you understand it: the hunter assumes something ' +
          'got through and goes looking, which is work that has no trigger and no queue.',
      },
      solution:
        'A SOC operator works from alerts: something fired, and the job is deciding what it means. ' +
        'A threat hunter starts from a hypothesis instead, assumes an intrusion got through without ' +
        'firing anything, and searches the environment by hand for evidence of it. On a day with no ' +
        'alerts the operator has a quiet queue and the hunter has a full day of work, because the ' +
        'absence of alerts is the condition the hunt is designed for rather than a reason to stop.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['alert', 'queue', 'fired', 'reactive', 'responds', 'triage'],
            ['hypothesis', 'proactive', 'assume', 'search', 'hunt', 'looking', 'without an alert'],
            ['no alert', 'quiet', 'nothing fired', 'absence', 'still', 'full day', 'missed'],
          ],
          hint: 'Contrast what triggers each of them, then answer the quiet-day question directly.',
        },
      ],
    },
    {
      id: 'soc.3.5-p5',
      prompt:
        'A manager says the SOC does not need a threat hunter because the detection rules already ' +
        'cover the estate. In two or three sentences, answer them.',
      teach: {
        note:
          'The argument to make is not that the rules are bad. It is that a rule can only fire on ' +
          'something somebody already thought of, so the coverage claim is circular: the rules cover ' +
          'what the rules cover, and nothing in the alert queue can ever tell you about the rest.',
      },
      solution:
        'Detection rules only fire on things somebody already anticipated and wrote logic for, so ' +
        '"the rules cover the estate" really means they cover the techniques we thought of. A quiet ' +
        'queue is therefore not evidence that nothing is happening, because anything outside the ' +
        'rules produces exactly the same silence as nothing happening. Hunting exists to test that ' +
        'assumption directly, and what it finds usually becomes a new rule, so it improves the ' +
        'coverage the manager is relying on rather than duplicating it.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['already', 'anticipat', 'thought of', 'known', 'written', 'someone wrote', 'existing'],
            ['silence', 'quiet', 'no alert', 'absence', 'not evidence', 'same', 'unknown', 'blind'],
            ['new rule', 'feeds', 'improve', 'becomes', 'turns into', 'coverage', 'gap'],
          ],
          hint:
            'Say what a rule can only ever match, what silence therefore proves, and what hunting gives back to the rules.',
        },
      ],
    },
  ],

  // --- soc.4.4: build against buy --------------------------------------------
  'soc.4.4': [
    {
      id: 'soc.4.4-p1',
      prompt:
        'Give one advantage and one disadvantage of a co-managed model, where an MSSP handles ' +
        'overnight triage and an in-house team owns everything else.',
      teach: {
        note:
          'Co-managed is the most common real answer and it is not a free lunch: it buys coverage ' +
          'at the hours nobody wants to staff, and pays for it with a hand-off boundary that falls ' +
          'in the middle of the night, exactly when nobody is around to smooth it over.',
      },
      solution:
        'The advantage is that you get round-the-clock coverage without staffing a night shift, ' +
        'which is the hardest and most expensive rota to fill, while keeping the deep environment ' +
        'knowledge in house for everything that matters. The disadvantage is the hand-off: there is ' +
        'now a boundary in the middle of the night where context has to be written down and passed ' +
        'across, and anything the vendor half-understood at 3am arrives as a partly-worked ticket ' +
        'in the morning.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['coverage', 'overnight', 'night', '24', 'round the clock', 'without staffing', 'rota'],
            ['hand', 'boundary', 'context', 'pass', 'gap', 'seam', 'morning'],
          ],
          hint: 'One clear advantage and one clear disadvantage, both specific to splitting the day in two.',
        },
      ],
    },
    {
      id: 'soc.4.4-p2',
      prompt:
        'Give one advantage and one disadvantage of retaining an external incident response firm on ' +
        'a contract, rather than handling incidents entirely in house.',
      teach: {
        note:
          'A retainer is bought for the worst day rather than for the average one, which changes the ' +
          'calculation: you are paying for availability and for experience your own team cannot ' +
          'accumulate, and the cost is that the responder arrives knowing nothing about your estate.',
      },
      solution:
        'The advantage is that on the worst day you get people who have run this kind of incident ' +
        'many times before, which your own team by definition has not, and you get them without ' +
        'carrying that expertise year round. The disadvantage is that they arrive knowing nothing ' +
        'about your environment, so the first hours go on orientation and access, and those are the ' +
        'hours that matter most.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['experience', 'seen', 'many', 'expertise', 'specialist', 'surge', 'capacity', 'worst day'],
            ['know', 'context', 'environment', 'onboard', 'orientation', 'access', 'first hours', 'unfamiliar'],
          ],
          hint: 'What a retainer buys, and what it costs you at the moment you use it.',
        },
      ],
    },
    {
      id: 'soc.4.4-p3',
      prompt:
        'Give one advantage and one disadvantage of a follow-the-sun model, where SOC teams in three ' +
        'time zones hand over to each other.',
      teach: {
        note:
          'Follow-the-sun removes night shifts entirely, which is a genuine improvement in retention ' +
          'and quality. The price is three hand-offs a day instead of one, and an incident that ' +
          'crosses two of them is being run by people who never spoke to each other.',
      },
      solution:
        'The advantage is that nobody works nights: every shift is somebody working normal hours in ' +
        'their own time zone, which is better for accuracy and much better for keeping staff. The ' +
        'disadvantage is that a long incident is now handed over two or three times, and each ' +
        'hand-off loses context, so an investigation that runs a full day is worked by people who ' +
        'never spoke directly to each other.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['night', 'daylight', 'normal hours', 'retention', 'fatigue', 'awake', 'burnout', 'quality'],
            ['hand', 'context', 'lost', 'continuity', 'twice', 'three', 'boundary', 'never spoke'],
          ],
          hint: 'The staffing advantage and the continuity cost.',
        },
      ],
    },
    {
      id: 'soc.4.4-p4',
      prompt:
        'An MSSP proposal promises a fifteen-minute response time on every critical alert. In two or ' +
        'three sentences, say what that number does and does not promise.',
      teach: {
        note:
          'Reading a service level agreement honestly is most of choosing a vendor. A response time ' +
          'is a promise about how fast somebody looks, not about what they conclude or what happens ' +
          'next, and those are three different clocks that buyers routinely merge into one.',
      },
      solution:
        'It promises that somebody will look at the alert within fifteen minutes and acknowledge it. ' +
        'It does not promise that they will understand it, that they will be right about it, or ' +
        'that anything will be contained, because containment usually needs access and authority ' +
        'the vendor does not have. The useful questions are what happens after that fifteen minutes ' +
        'and who is allowed to act, not how fast the first response is.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['look', 'acknowledg', 'respond', 'pick up', 'triage', 'first'],
            ['not', 'does not', 'resolve', 'contain', 'fix', 'correct', 'understand', 'outcome'],
            ['authority', 'access', 'act', 'escalat', 'what happens', 'after', 'who'],
          ],
          hint: 'What the clock actually measures, what it does not cover, and what to ask instead.',
        },
      ],
    },
    {
      id: 'soc.4.4-p5',
      prompt:
        'Your organisation is 200 people with two security staff. Argue in two or three sentences ' +
        'for whichever model you would choose, and name the main risk of your own choice.',
      teach: {
        note:
          'The point of this drill is the second half. Anybody can argue for a model; the discipline ' +
          'is naming the strongest objection to your own recommendation, which is also what makes a ' +
          'recommendation credible to whoever has to approve it.',
      },
      solution:
        'At that size I would buy: two people cannot cover nights or holidays, and an MSSP gives ' +
        'coverage and pooled expertise for far less than a fourth and fifth hire would cost. The ' +
        'main risk of my own choice is that the vendor never learns what normal looks like here, so ' +
        'the two in-house staff have to spend real time providing context and reviewing dispositions ' +
        'rather than being freed up, and if that time is not budgeted the arrangement quietly ' +
        'degrades into alerts nobody understands being closed by people nobody knows.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['buy', 'mssp', 'outsourc', 'in house', 'in-house', 'build', 'co-managed', 'hybrid'],
            ['cover', 'cost', 'hire', 'expertise', 'nights', 'scale', 'cheaper', 'staff'],
            ['risk', 'downside', 'however', 'but', 'cost of', 'context', 'degrade', 'objection'],
          ],
          hint: 'Commit to a model, justify it at this size, then name the strongest argument against it.',
        },
      ],
    },
  ],

  // --- soc.5.6: why the chain needs every link -------------------------------
  'soc.5.6': [
    {
      id: 'soc.5.6-p1',
      prompt:
        'A different incident. An employee reports a phishing email they already clicked. In two or ' +
        'three sentences, describe the hand-off chain that follows and why no one role covers it.',
      teach: {
        note:
          'A phishing click is the most common incident there is, and it still crosses four or five ' +
          'seats. Tracing an ordinary event through the chain is more useful than tracing a dramatic ' +
          'one, because the ordinary one is what actually happens on a Tuesday.',
      },
      solution:
        'The operator picks up the report and confirms what the message was and who else received ' +
        'it, then a log analyst establishes what the click actually did and whether credentials were ' +
        'entered. If they were, the incident lead decides on a password reset and session ' +
        'revocation while somebody hunts for the same message across other mailboxes, and detection ' +
        'engineering turns the indicators into a rule. No single person can search the mail estate, ' +
        'reconstruct the user session, make the reset call, and write the detection at once.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['operator', 'report', 'triage', 'confirm', 'first', 'receive'],
            ['log', 'investigat', 'credential', 'session', 'analys', 'what it did', 'hunt', 'other mailbox'],
            ['reset', 'contain', 'revoke', 'decide', 'lead', 'block', 'rule', 'detection'],
          ],
          hint: 'Walk the chain in order and finish by saying what one person could not do simultaneously.',
        },
      ],
    },
    {
      id: 'soc.5.6-p2',
      prompt:
        'Ransomware detonates on a file server at 2am. Describe the hand-off chain and why the ' +
        'incident needs more than one seat.',
      teach: {
        note:
          'Under time pressure the chain compresses but does not disappear, and the tension between ' +
          'links gets visible: containment wants the machine off the network now, forensics wants ' +
          'memory captured first, and somebody has to arbitrate between them in the same minute.',
      },
      solution:
        'The operator on the night shift spots the alert and escalates immediately, and the incident ' +
        'lead makes the containment call to isolate the server and check whether backups are intact. ' +
        'Forensics wants memory captured before anything is powered off, which directly conflicts ' +
        'with containment wanting it off the network now, so somebody has to arbitrate between the ' +
        'two in the same minute. Meanwhile a malware analyst identifies the family to say whether ' +
        'decryption is possible, and none of that is one person\'s job at 2am.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['operator', 'spot', 'alert', 'escalat', 'night', 'first'],
            ['contain', 'isolat', 'lead', 'decide', 'backup', 'power'],
            ['forensic', 'memory', 'evidence', 'malware', 'family', 'analys', 'conflict', 'preserve'],
          ],
          hint:
            'Cover who spots it, who decides containment, and the seat whose needs conflict with containment.',
        },
      ],
    },
    {
      id: 'soc.5.6-p3',
      prompt:
        'Take one link out. Describe what happens to an incident if there is no detection engineer ' +
        'anywhere in the chain.',
      teach: {
        note:
          'Removing a link is the sharpest way to see what it was for. Without detection ' +
          'engineering nothing about the incident is worse, and that is exactly the problem: the ' +
          'cost is invisible on this incident and lands entirely on the next identical one.',
      },
      solution:
        'The incident itself goes fine: it is spotted, investigated, contained and written up ' +
        'exactly as before. What is lost is everything after it, because nothing turns the ' +
        'indicators and the technique into a rule, so the next identical intrusion has to be caught ' +
        'by a human noticing it again. The team stays permanently reactive and never gets faster, ' +
        'and because the cost lands on a future incident rather than this one it is easy to keep ' +
        'not noticing.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['fine', 'still', 'this incident', 'same', 'handled', 'resolved', 'goes'],
            ['next', 'again', 'future', 'repeat', 'recur', 'same attack', 'never', 'no rule'],
            ['reactive', 'faster', 'improve', 'learn', 'invisible', 'unnoticed', 'cost'],
          ],
          hint: 'Say what still works, what is lost, and when the loss actually shows up.',
        },
      ],
    },
    {
      id: 'soc.5.6-p4',
      prompt:
        'Take out a different link. Describe what happens if nobody in the chain is doing forensics ' +
        'or evidence preservation.',
      teach: {
        note:
          'This removal is the mirror of the last one: the cost is invisible during the incident and ' +
          'lands months later, when somebody asks a question the evidence could have answered and ' +
          'the evidence has been overwritten.',
      },
      solution:
        'The incident can still be detected and contained, so at the time nothing feels wrong. The ' +
        'cost arrives later, when somebody asks exactly what was accessed, whether personal data ' +
        'left, or how the attacker got in, and the answer is that the host was rebuilt and nobody ' +
        'imaged it. Without preserved evidence the organisation cannot answer a regulator, cannot ' +
        'support a claim or a prosecution, and cannot rule out that the same access is still open.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['contain', 'detect', 'still', 'resolved', 'at the time', 'fine', 'seems'],
            ['later', 'question', 'regulator', 'court', 'claim', 'asked', 'months', 'afterwards'],
            ['rebuilt', 'overwritten', 'gone', 'destroyed', 'cannot', 'no evidence', 'lost', 'unanswer'],
          ],
          hint: 'What still works during the incident, and what becomes unanswerable afterwards.',
        },
      ],
    },
    {
      id: 'soc.5.6-p5',
      prompt:
        'A small organisation has three security staff and cannot fill every seat. In two or three ' +
        'sentences, say which functions you would combine and which you would refuse to combine, and why.',
      teach: {
        note:
          'The real version of this problem. Most seats can be combined by one capable person ' +
          'wearing several hats; the ones that genuinely cannot are those where the same person ' +
          'would be checking their own work, or where being interrupted destroys the other task.',
      },
      solution:
        'I would combine triage with log analysis and hunting, since they are the same investigative ' +
        'skill applied at different depths and one person can move between them. I would also let ' +
        'detection engineering sit with whoever works the queue, because the feedback is immediate. ' +
        'What I would refuse to combine is the incident lead with the person doing the technical ' +
        'work: somebody deep in a host cannot also be coordinating and communicating, and somebody ' +
        'reviewing their own containment decision has nobody checking it.',
      checks: [
        {
          type: 'answer-mentions',
          conceptGroups: [
            ['combine', 'merge', 'same person', 'together', 'one person', 'wear', 'hats'],
            ['triage', 'log', 'hunt', 'detection', 'analysis', 'investigat'],
            ['refuse', 'not', 'separate', 'cannot', 'lead', 'coordinat', 'own work', 'check', 'interrupt'],
          ],
          hint:
            'Name what you would merge, name what you would keep apart, and give the reason the second group is different.',
        },
      ],
    },
  ],
};
