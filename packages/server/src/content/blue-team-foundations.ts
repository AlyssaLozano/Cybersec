/**
 * Blue Team Foundations: how defenders think, taught as small graded pieces.
 *
 * WHAT THIS PACKAGE IS, AND IS NOT
 *
 * It teaches the defensive mindset a junior SOC analyst is missing -- what
 * normal looks like, how detection actually works, how an alert becomes an
 * investigation and an investigation becomes a response, and where the legal
 * edges of evidence lie. It is the counterpart to Red Team Foundations: where
 * that package asks "what would the attacker do", this asks "how would you
 * catch and stop them".
 *
 * Every exercise grades a determination or a piece of knowledge, the same way
 * the other packages do, because the skill a junior defender lacks is judgement
 * -- which alert is real, which move is loud, what a log is not telling you --
 * not a tool. It is the ground floor under the war-room match mode and under the
 * SOC specialisations (log analysis, network analysis, incident response) that
 * come after it.
 *
 * HOUSE RULES THAT BITE HERE
 *
 * Every address is an RFC 5737 documentation range and every name is a
 * `.example` domain, so nothing pictured here could touch a real host. The
 * defended organisation throughout is Northwind Logistics, the same fictional
 * company the red-team package attacks, so the two halves describe one world
 * from two sides.
 */

import type { LearningPackage } from '@soc/shared';

export const BLUE_TEAM_FOUNDATIONS: LearningPackage = {
  id: 'blue-team-foundations',
  order: 10,
  title: 'Blue Team Foundations',
  summary:
    'The defensive methodology a junior analyst is missing: knowing what normal looks like, how ' +
    'detection really works, how to triage and investigate an alert, and how to respond to and ' +
    'learn from an incident.',
  outcomes: [
    'Explain what defenders actually do, and why defence is the harder side of an asymmetric game.',
    'Tell normal from abnormal by reasoning about a baseline, false positives, and false negatives.',
    'Read logs and network traffic to build a timeline and spot an attacker in the noise.',
    'Triage an alert, escalate it with context, and reason through the incident-response lifecycle.',
  ],
  prerequisites: [],
  modules: [
    {
      id: 'btf.1',
      packageId: 'blue-team-foundations',
      order: 1,
      title: 'The defender mindset',
      summary:
        'What a blue team is for, why defending is harder than attacking, and the layered way ' +
        'defenders actually hold ground: prevent, detect, respond, recover.',
      exercises: [
        {
          id: 'btf.1.1',
          moduleId: 'btf.1',
          packageId: 'blue-team-foundations',
          order: 1,
          title: 'What defenders actually do',
          kind: 'multiple-choice',
          goal: 'Separate the real work of a blue team from an impossible ideal.',
          prompt:
            'Which of these are genuine, achievable responsibilities of a blue team? Select all ' +
            'that apply.',
          teach: {
            concept:
              'A blue team is the defence: the people and systems that watch for attacks, decide ' +
              'which signals are real, respond to the ones that are, and feed what they learn back ' +
              'into better defences. They work continuously, because attacks do not keep office ' +
              'hours, and their day is mostly the unglamorous discipline of separating a handful of ' +
              'real threats from a flood of ordinary activity. The work is detection, ' +
              'investigation, response, and improvement, in a loop that never quite ends.\n\n' +
              'The trap for newcomers is to think the job is to prevent every attack from ever ' +
              'succeeding. That is not a goal, it is a fantasy, and treating it as the target ' +
              'guarantees failure and burnout. New vulnerabilities appear constantly, people make ' +
              'mistakes, and a determined attacker will eventually get a foothold somewhere. A ' +
              'mature defender accepts this and shifts the aim from "never be breached" to "detect ' +
              'fast, respond well, and limit the damage". Understanding that shift is the whole ' +
              'foundation of everything else in this package.',
          },
          options: [
            { id: 'a', label: 'Watch for signs of attack across the organisation, around the clock.' },
            { id: 'b', label: 'Triage alerts and decide which few deserve a human investigation.' },
            { id: 'c', label: 'Investigate confirmed incidents and drive the response.' },
            { id: 'd', label: 'Feed lessons from incidents back into stronger detection and controls.' },
            { id: 'e', label: 'Guarantee that no attack ever succeeds against the organisation.' },
          ],
          hints: [
            'Four of these are real, achievable jobs. One is an impossible standard no team can meet.',
            'Detection, triage, investigation, and improvement are the loop. Perfect prevention is not part of it.',
            'No defender can guarantee zero breaches. The other four describe the actual work.',
          ],
          solution:
            'A, B, C, and D. Watching for attacks, triaging alerts, investigating and responding, ' +
            'and feeding lessons back into stronger defences are the real, achievable loop a blue ' +
            'team runs. E is the beginner\'s trap: guaranteeing that no attack ever succeeds is ' +
            'impossible given new vulnerabilities and human error, and treating it as the goal only ' +
            'guarantees failure. The mature aim is to detect fast and limit damage.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'Keep the four that describe detection, triage, response, and improvement. Drop the ' +
                'one that promises perfect prevention.',
            },
          ],
          debrief:
            'Everything in this package follows from that shift: since you cannot prevent every ' +
            'attack, you build the ability to catch and contain the ones that get through.',
          practice: [],
        },
        {
          id: 'btf.1.2',
          moduleId: 'btf.1',
          packageId: 'blue-team-foundations',
          order: 2,
          title: 'The asymmetric game',
          kind: 'multiple-choice',
          goal: 'Grasp why defence is structurally harder than offence.',
          prompt:
            'Which statement best captures why defending is harder than attacking?',
          teach: {
            concept:
              'Attack and defence are not symmetric, and the asymmetry runs in the attacker\'s ' +
              'favour. An attacker needs only one path to work once: they can try a hundred ' +
              'approaches, fail ninety-nine times, and still win with the hundredth, because a ' +
              'single success is a success. A defender faces the mirror image and the worse end of ' +
              'it: they must cover every path, every system, every person, every day, because ' +
              'stopping ninety-nine attacks out of a hundred still means the hundredth got ' +
              'through.\n\n' +
              'This is why prevention alone is not a strategy and why defenders invest so heavily in ' +
              'detection and response. If you accept that a sufficiently determined attacker will ' +
              'eventually find one of the countless paths in, then the question stops being "how do ' +
              'I make the wall perfect" and becomes "how quickly can I notice someone climbing it, ' +
              'and how fast can I stop them". The asymmetry does not make defence hopeless; it makes ' +
              'it a different game, one won by speed of detection and quality of response rather ' +
              'than by an impossible flawless perimeter.',
          },
          options: [
            { id: 'a', label: 'The attacker needs only one path to succeed, while the defender must cover every path.' },
            { id: 'b', label: 'Attackers have better tools than defenders in every case.' },
            { id: 'c', label: 'Defenders are simply less skilled than attackers.' },
            { id: 'd', label: 'Attacking is illegal, so attackers try harder.' },
          ],
          hints: [
            'Think about what counts as a win for each side. How many paths does each one need?',
            'One success is enough for an attacker; one failure is enough for a defender.',
            'The asymmetry is about coverage: one path versus all paths, not about tools or talent.',
          ],
          solution:
            'A. The core asymmetry is that an attacker needs just one working path while the ' +
            'defender must cover them all, so stopping almost every attack is still a loss if one ' +
            'gets through. It is not that attackers always have better tools (B) or more skill (C), ' +
            'and the illegality of attacking (D) is beside the point. The structural imbalance of ' +
            'coverage is what makes defence the harder side and why detection and response matter ' +
            'so much.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Which option is about coverage -- one path to win versus every path to defend -- ' +
                'rather than about tools or talent?',
            },
          ],
          debrief:
            'The asymmetry is not a counsel of despair. It is the reason the whole discipline pivots ' +
            'from "build a perfect wall" to "detect fast and respond well".',
          practice: [],
        },
        {
          id: 'btf.1.3',
          moduleId: 'btf.1',
          packageId: 'blue-team-foundations',
          order: 3,
          title: 'Why prevention is not enough',
          kind: 'short-answer',
          goal: 'Explain why a defence built only on prevention fails.',
          prompt:
            'In two or three sentences, explain why an organisation that spends everything on ' +
            'prevention -- firewalls, antivirus, strong passwords -- and nothing on detection or ' +
            'response is still badly exposed.',
          teach: {
            concept:
              'Prevention is the first layer of defence and a necessary one: firewalls, antivirus, ' +
              'encryption, and good access control stop a great deal of routine attack. But ' +
              'prevention can never be complete, because the ground keeps shifting. New ' +
              'vulnerabilities are discovered in software you already run, employees are tricked or ' +
              'make mistakes, and attackers specifically look for the gaps your preventive controls ' +
              'do not cover. An organisation that treats prevention as the whole of security is ' +
              'betting on a wall that only has to fail once.\n\n' +
              'The answer is layered defence, often called defence in depth: prevent what you can, ' +
              'but assume some attacks will get through and build the ability to catch them. ' +
              'Detection -- logging, monitoring, alerting -- exists to notice the attacker who is ' +
              'already inside, and response exists to stop them and limit the damage before it ' +
              'becomes a disaster. Without those layers, a single successful attack goes unnoticed ' +
              'and unopposed, which is exactly how breaches sit undetected for months. Prevention ' +
              'buys you fewer intrusions; detection and response are what keep an intrusion from ' +
              'becoming a catastrophe.',
          },
          hints: [
            'Prevention only has to fail once. What happens after it does, if there is no other layer?',
            'Think about new vulnerabilities and human error: no preventive wall covers everything.',
            'A good answer names that prevention is incomplete, and that without detection and response a successful attack goes unnoticed and unstopped.',
          ],
          solution:
            'Prevention can never be complete: new vulnerabilities appear in software you run, ' +
            'people make mistakes, and attackers hunt for the gaps your controls miss, so eventually ' +
            'something gets through. If the organisation has no detection or response, that ' +
            'successful attack goes unnoticed and unopposed, which is how breaches sit undiscovered ' +
            'for months and turn into disasters. Prevention reduces intrusions, but detection and ' +
            'response are what stop an intrusion from becoming a catastrophe.',
          expectedOutput:
            'An answer explaining that prevention is inevitably incomplete, and that without ' +
            'detection and response a successful attack goes unnoticed and unstopped.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['incomplete', 'not perfect', 'fail', 'gap', 'new vulnerab', 'human error', 'mistake', 'gets through', 'eventually'],
                ['detect', 'detection', 'respond', 'response', 'notice', 'catch', 'unnoticed', 'undetected'],
              ],
              hint:
                'Two ideas: that prevention is inevitably incomplete, and that without detection or ' +
                'response the attack that gets through is unnoticed and unstopped.',
            },
          ],
          debrief:
            'This is why defence in depth exists: prevent, detect, respond, recover. Each layer ' +
            'assumes the one before it will sometimes fail, and catches what slips past.',
          practice: [],
        },
        {
          id: 'btf.1.4',
          moduleId: 'btf.1',
          packageId: 'blue-team-foundations',
          order: 4,
          title: 'Name the layer',
          kind: 'multiple-choice',
          goal: 'Place a defensive action in the right layer of defence in depth.',
          prompt:
            'Northwind restores its file server from last night\'s clean backup and returns it to ' +
            'service after an incident. Which layer of defence in depth is this?',
          teach: {
            concept:
              'Defence in depth is usually described as four layers, each doing a different job. ' +
              'Prevention tries to stop attacks before they happen: firewalls, patching, access ' +
              'control. Detection tries to notice attacks that got past prevention: monitoring, ' +
              'logging, alerting. Response tries to stop an attack in progress and limit its damage: ' +
              'isolating a host, resetting credentials, blocking traffic. Recovery restores normal ' +
              'operations after the dust settles: rebuilding from clean backups, verifying systems, ' +
              'returning to service.\n\n' +
              'The layers matter because they form a safety net rather than a single line. If ' +
              'prevention fails, detection should catch it; if detection is slow, response should ' +
              'still contain it; and whatever happens, recovery gets the business running again. ' +
              'Being able to name which layer an action belongs to is more than vocabulary: it tells ' +
              'you what that action is for and what it is not. Restoring from backup, for instance, ' +
              'does nothing to stop an attacker who is still inside -- it is recovery, not response ' +
              '-- so doing it before you have eradicated the threat just hands the attacker a fresh ' +
              'clean system to compromise again.',
          },
          options: [
            { id: 'a', label: 'Recovery: restoring normal operations after the incident.' },
            { id: 'b', label: 'Prevention: stopping the attack before it happens.' },
            { id: 'c', label: 'Detection: noticing that an attack occurred.' },
            { id: 'd', label: 'Response: stopping the attack while it is in progress.' },
          ],
          hints: [
            'The action happens after the incident, to get the business running again. Which layer is that?',
            'Restoring from backup does not stop an attacker or detect one. It returns to normal.',
            'Prevent, detect, respond, recover. Rebuilding from a clean backup is the last of these.',
          ],
          solution:
            'A. Restoring from a clean backup to return to normal operations is recovery, the layer ' +
            'that gets the business running again after an incident. It is not prevention (the ' +
            'attack already happened), not detection (it notices nothing), and not response (it does ' +
            'not stop an attacker in progress). Note the ordering trap: restore before you have ' +
            'eradicated the threat and you just give the attacker a fresh system to re-compromise.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'This action returns the business to normal after the fact. That is the last of the ' +
                'four layers.',
            },
          ],
          debrief:
            'Naming the layer keeps you from sequencing wrong. Recovery before eradication is a ' +
            'classic mistake: a clean rebuild is worthless if the attacker still has a way back in.',
          practice: [],
        },
        {
          id: 'btf.1.5',
          moduleId: 'btf.1',
          packageId: 'blue-team-foundations',
          order: 5,
          title: 'Match the tool to the job',
          kind: 'multiple-choice',
          goal: 'Know what a SIEM is for, distinct from other defensive tools.',
          prompt:
            'Northwind wants one system that collects logs from every server, network device, and ' +
            'application, then correlates them to surface patterns and raise alerts. Which category ' +
            'of tool is that?',
          teach: {
            concept:
              'Defenders rely on several categories of tool, and confusing them wastes money and ' +
              'leaves gaps. A SIEM (Security Information and Event Management) is the central ' +
              'nervous system: it collects logs from everywhere, correlates events across sources to ' +
              'find patterns no single log would reveal, and raises alerts. An IDS or IPS watches ' +
              'network traffic for attack signatures. EDR (Endpoint Detection and Response) lives on ' +
              'individual computers and servers, watching process execution and file changes and ' +
              'able to isolate a host. A firewall controls what traffic is allowed in and out. Each ' +
              'sees a different slice of the world.\n\n' +
              'The SIEM is distinctive because its value is correlation, not any single feed. A ' +
              'failed login on one server is nothing; the same account failing on forty servers in a ' +
              'minute, then succeeding, is an attack, and only something that sees all forty logs ' +
              'together can notice. That is the SIEM\'s job. It also means a SIEM is only as good as ' +
              'the logs fed into it and the rules written on top, which is why later modules spend so ' +
              'much time on what to log and how to turn logs into detections. Knowing which tool ' +
              'does which job is the first step to reasoning about where a given attack would or ' +
              'would not be seen.',
          },
          options: [
            { id: 'a', label: 'A SIEM (Security Information and Event Management).' },
            { id: 'b', label: 'A firewall.' },
            { id: 'c', label: 'Antivirus on each laptop.' },
            { id: 'd', label: 'A password manager.' },
          ],
          hints: [
            'The defining job here is collecting logs from everywhere and correlating them. Which tool is built for that?',
            'A firewall controls traffic; antivirus scans one machine. Neither correlates logs across the whole estate.',
            'Central collection plus correlation plus alerting is the definition of a SIEM.',
          ],
          solution:
            'A. Collecting logs from across the whole estate, correlating them to find patterns, and ' +
            'raising alerts is precisely what a SIEM does. A firewall (B) controls traffic, ' +
            'antivirus (C) scans a single machine, and a password manager (D) stores credentials -- ' +
            'none of them correlates events across many sources, which is the SIEM\'s defining ' +
            'value.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Only one tool exists to gather logs from everywhere and connect them. That is the ' +
                'SIEM.',
            },
          ],
          debrief:
            'The SIEM is where a scattered set of harmless-looking events becomes a visible attack. ' +
            'Its power is correlation, which is also why it is only as good as the logs and rules ' +
            'behind it.',
          practice: [],
        },
        {
          id: 'btf.1.6',
          moduleId: 'btf.1',
          packageId: 'blue-team-foundations',
          order: 6,
          title: 'Tools are not a defence by themselves',
          kind: 'short-answer',
          goal: 'Explain why buying tools does not, by itself, make an organisation secure.',
          prompt:
            'A company buys every security tool on the market but hires no one to operate them. In ' +
            'two or three sentences, explain why it is still not well defended.',
          teach: {
            concept:
              'Security tools are powerful and necessary, but they are instruments, not defenders. A ' +
              'SIEM that no one tunes drowns its operators in false alarms; an EDR whose alerts no ' +
              'one reads catches malware into a void; threat intelligence nobody acts on is just an ' +
              'expensive feed. Tools generate signals, but signals only become defence when a ' +
              'skilled person interprets them, decides what is real, and acts. Buying tools without ' +
              'people produces a false sense of security: the dashboards glow green while the alerts ' +
              'nobody reads pile up.\n\n' +
              'The working equation is that tools plus skilled people make a good defence, tools ' +
              'alone make a false sense of security, and people without tools are simply ' +
              'overwhelmed. Each half needs the other. Attackers, for their part, actively study how ' +
              'the common tools work and design their techniques to slip past them, so even a ' +
              'perfectly configured toolset needs human judgement to catch what the tool was never ' +
              'built to see. The lesson for anyone entering this field is that the scarce, decisive ' +
              'resource is not the software budget but the analyst who knows what the software is ' +
              'and is not telling them.',
          },
          hints: [
            'A tool produces alerts. What has to happen to an alert before it becomes actual defence?',
            'Think about who reads the alerts, decides what is real, and acts. Without that, what are the tools doing?',
            'A good answer names that tools only generate signals, and that skilled people are needed to interpret and act on them.',
          ],
          solution:
            'Tools only generate signals -- alerts, logs, feeds -- and a signal becomes defence only ' +
            'when a skilled person interprets it, decides what is real, and acts. With nobody ' +
            'operating them, the SIEM\'s alerts go unread, the EDR catches malware into a void, and ' +
            'the dashboards glow green while real attacks pile up unnoticed. Tools plus skilled ' +
            'people make a defence; tools alone are just a false sense of security.',
          expectedOutput:
            'An answer explaining that tools only produce signals, and that skilled people are ' +
            'needed to interpret and act on them for any real defence.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['people', 'analyst', 'human', 'staff', 'operate', 'skilled', 'someone'],
                ['interpret', 'act', 'read', 'investigate', 'decide', 'respond', 'unread', 'ignored', 'tune'],
              ],
              hint:
                'Two ideas: that defence needs skilled people, and that without them the tools\' ' +
                'alerts go uninterpreted and unacted-on.',
            },
          ],
          debrief:
            'The scarce resource in a SOC is rarely the software; it is the analyst who knows what ' +
            'the software is not telling them. Keep that in mind through every tool this package ' +
            'names.',
          practice: [],
        },
      ],
    },
    {
      id: 'btf.2',
      packageId: 'blue-team-foundations',
      order: 2,
      title: 'Normal, abnormal, and the cost of being wrong',
      summary:
        'Detection is the art of knowing what normal looks like and noticing what does not fit -- ' +
        'and living with the fact that you will sometimes be wrong in both directions.',
      exercises: [
        {
          id: 'btf.2.1',
          moduleId: 'btf.2',
          packageId: 'blue-team-foundations',
          order: 1,
          title: 'There is no global normal',
          kind: 'multiple-choice',
          goal: 'Understand that a baseline is specific to each organisation.',
          prompt:
            'A file server sees heavy access at 3am. At Northwind\'s overnight distribution centre ' +
            'this is routine; at a nine-to-five accounting firm it would be alarming. What does this ' +
            'illustrate?',
          teach: {
            concept:
              'Detection rests on a deceptively simple idea: you cannot recognise abnormal until ' +
              'you know normal. When an event appears in a log, the question is not "is this ' +
              'inherently bad" but "is this normal here", and the answer depends entirely on the ' +
              'organisation. File access at three in the morning is unremarkable at a warehouse that ' +
              'runs a night shift and deeply suspicious at a firm whose office empties at five. ' +
              'There is no universal normal that a rule could encode once and apply everywhere; ' +
              'there is only the baseline of this particular environment.\n\n' +
              'A baseline is that picture of normal, built by observing real activity over time: ' +
              'when systems are busy and quiet, who logs in from where, how much data usually moves, ' +
              'which jobs run on a schedule. Detection then works by comparison -- flagging what ' +
              'departs from the baseline -- which is why establishing an accurate one is the ' +
              'foundational skill of the whole discipline. It is also why detection cannot be bought ' +
              'off the shelf and switched on: a rule tuned to someone else\'s normal will drown you ' +
              'in false alarms or miss the very things that matter, because your normal is not ' +
              'theirs.',
          },
          options: [
            { id: 'a', label: 'Normal is defined by each organisation\'s own baseline, not by a universal rule.' },
            { id: 'b', label: 'Night-time file access is always an attack.' },
            { id: 'c', label: 'Night-time file access is always fine.' },
            { id: 'd', label: 'File servers should be switched off at night.' },
          ],
          hints: [
            'The same activity is fine in one place and alarming in another. What does that tell you about "normal"?',
            'If the answer depends on the organisation, there cannot be one universal rule.',
            'The point is that normal is local: each environment has its own baseline.',
          ],
          solution:
            'A. The same activity being routine in one organisation and alarming in another shows ' +
            'that normal is defined by each environment\'s own baseline, not by any universal rule. ' +
            'Night-time access is neither always an attack (B) nor always fine (C); it depends on ' +
            'the organisation. Switching servers off at night (D) misses the point entirely. ' +
            'Detection works by comparing activity against the local baseline.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'The activity is identical in both places; only the context differs. That points at ' +
                'a per-organisation baseline.',
            },
          ],
          debrief:
            'This is why the first job at any new environment is to learn its normal. Every ' +
            'detection you build later is a comparison against that baseline.',
          practice: [],
        },
        {
          id: 'btf.2.2',
          moduleId: 'btf.2',
          packageId: 'blue-team-foundations',
          order: 2,
          title: 'Spot the anomaly',
          kind: 'multiple-choice',
          goal: 'Apply a baseline to pick out the event that does not fit.',
          prompt:
            'Northwind\'s baseline for its file server: peak access during business hours, a few ' +
            'hundred users, typical files a few megabytes, access from within the US. Which single ' +
            'observation is the clearest anomaly worth investigating?',
          teach: {
            concept:
              'A baseline is only useful when you can compare an observation against it and see what ' +
              'sticks out. The skill is to hold several dimensions of normal in mind at once -- ' +
              'timing, volume, who, from where, how much data -- and notice which observation ' +
              'violates one or more of them. A single dimension being slightly off is often nothing; ' +
              'an observation that departs sharply, especially on a dimension that maps to a real ' +
              'attacker behaviour like bulk data theft, is what deserves a look.\n\n' +
              'Crucially, the anomaly worth investigating is not the most dramatic-sounding event ' +
              'but the one that departs most clearly from established normal in a way that matches ' +
              'how attacks actually look. A sudden transfer of thousands of files, orders of ' +
              'magnitude above the usual rate, is the signature of bulk exfiltration; access from a ' +
              'country the company does not operate in breaks the geographic baseline. Meanwhile ' +
              'ordinary variation -- a busy afternoon, a slightly larger file -- is just normal ' +
              'breathing. Learning to tell a meaningful departure from ordinary variation is exactly ' +
              'what separates a useful analyst from one who escalates everything.',
          },
          options: [
            { id: 'a', label: 'A single account suddenly copying tens of thousands of files, far above the usual rate.' },
            { id: 'b', label: 'Slightly heavier access than usual on a busy Tuesday afternoon.' },
            { id: 'c', label: 'A user opening a document that is a few megabytes in size.' },
            { id: 'd', label: 'A few hundred users logged in during business hours.' },
          ],
          hints: [
            'Compare each observation against the baseline. Which one departs sharply, not slightly?',
            'Three of these fit normal: busy afternoon, a normal-sized file, expected user counts.',
            'A sudden bulk copy far above the usual rate matches how data theft looks. That is the anomaly.',
          ],
          solution:
            'A. A single account copying tens of thousands of files, orders of magnitude above the ' +
            'usual rate, departs sharply from the baseline and matches the signature of bulk ' +
            'exfiltration, so it is the clear thing to investigate. A busy afternoon (B), a ' +
            'few-megabyte document (C), and a few hundred business-hours users (D) all fit normal ' +
            'variation. The skill is telling a meaningful departure from ordinary breathing.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Three options are ordinary variation. One is orders of magnitude off and looks ' +
                'like data theft.',
            },
          ],
          debrief:
            'Anomaly detection is comparison, not drama. The event to chase is the one that breaks ' +
            'the baseline in a way that matches a real attacker behaviour.',
          practice: [],
        },
        {
          id: 'btf.2.3',
          moduleId: 'btf.2',
          packageId: 'blue-team-foundations',
          order: 3,
          title: 'False positives and false negatives',
          kind: 'short-answer',
          goal: 'Define both error types and the tension between them.',
          prompt:
            'In two or three sentences, explain the difference between a false positive and a false ' +
            'negative in detection, and why you cannot simply eliminate both at once.',
          teach: {
            concept:
              'Detection makes two kinds of mistake, and they pull in opposite directions. A false ' +
              'positive is an alert on legitimate activity -- the system cried wolf, and an analyst ' +
              'spends time confirming nothing happened. A false negative is the reverse and the ' +
              'worse of the two: a real attack that produced no alert, that slipped through looking ' +
              'like normal activity. Every detection system sits somewhere on the spectrum between ' +
              'these, and where it sits is a choice.\n\n' +
              'The reason you cannot drive both to zero is that they trade off. Make your detection ' +
              'more sensitive so it catches more real attacks, and you inevitably flag more ' +
              'legitimate activity too, raising false positives. Make it stricter to cut false ' +
              'positives, and some real attacks now slip under the bar, raising false negatives. ' +
              'Tuning detection is the constant management of this trade: catch enough real attacks ' +
              'to be worth having, without generating so many false alarms that analysts drown. The ' +
              'later exercises on alert fatigue and tuning are all about finding a workable point on ' +
              'this spectrum, because there is no setting that has neither error.',
          },
          hints: [
            'One error is alerting on something harmless. The other is staying silent on something real.',
            'Think about which direction each error goes, and why cranking sensitivity up or down just moves the problem.',
            'A good answer defines both and names the trade-off: more sensitivity means more false positives, more strictness means more false negatives.',
          ],
          solution:
            'A false positive is an alert on legitimate activity -- wasted investigation of nothing ' +
            '-- while a false negative is a real attack that produced no alert and slipped through. ' +
            'You cannot eliminate both because they trade off: making detection more sensitive to ' +
            'catch more attacks also flags more harmless activity (more false positives), and making ' +
            'it stricter to cut false positives lets more real attacks slip under the bar (more ' +
            'false negatives). Tuning is the constant management of that tension.',
          expectedOutput:
            'An answer defining false positive (alert on legitimate activity) and false negative ' +
            '(missed real attack), and naming the sensitivity trade-off between them.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['false positive', 'legitimate', 'harmless', 'cry wolf', 'benign', 'not real'],
                ['false negative', 'missed', 'slip', 'undetected', 'no alert', 'real attack'],
                ['trade', 'tension', 'balance', 'sensitiv', 'both', 'opposite', 'cannot'],
              ],
              hint:
                'Three ideas: what a false positive is, what a false negative is, and that they ' +
                'trade off so you cannot zero both.',
            },
          ],
          debrief:
            'Every detection decision lives on this spectrum. There is no error-free setting, only a ' +
            'chosen balance -- which is why tuning is a permanent job, not a one-time fix.',
          practice: [],
        },
        {
          id: 'btf.2.4',
          moduleId: 'btf.2',
          packageId: 'blue-team-foundations',
          order: 4,
          title: 'Alert fatigue',
          kind: 'multiple-choice',
          goal: 'Recognise how a flood of false positives causes real attacks to be missed.',
          prompt:
            'Northwind\'s SOC receives 50,000 alerts a day, almost all false positives, far more ' +
            'than the team can review. What is the most dangerous consequence?',
          teach: {
            concept:
              'A detection system that produces too many alerts is not safer than one that produces ' +
              'too few -- it is often more dangerous, and the reason is human. When a team faces ' +
              'tens of thousands of alerts a day and the overwhelming majority are false alarms, no ' +
              'one can investigate them all. The maths is unforgiving: a handful of analysts have ' +
              'only so many minutes in a shift, and a flood of false positives consumes far more ' +
              'time than exists. The backlog grows, and alerts get closed fast or ignored just to ' +
              'keep up.\n\n' +
              'This is alert fatigue, and its danger is that the real attack is somewhere in that ' +
              'flood, indistinguishable at a glance from the noise, and gets waved away with ' +
              'everything else. A team that has learned, through thousands of false alarms, that ' +
              'alerts are usually nothing will treat the one that matters as nothing too. Attackers ' +
              'understand this and count on it: staying quiet enough to blend into the noise is ' +
              'often easier than defeating a control outright. The lesson is that alert quality ' +
              'matters more than alert quantity -- a system that cries wolf constantly trains its ' +
              'own operators to ignore the wolf.',
          },
          options: [
            { id: 'a', label: 'Real attacks get closed or ignored along with the noise, because the team cannot tell them apart in the flood.' },
            { id: 'b', label: 'The SIEM runs out of disk space.' },
            { id: 'c', label: 'Analysts become faster and more accurate under pressure.' },
            { id: 'd', label: 'False positives eventually stop occurring on their own.' },
          ],
          hints: [
            'The problem is human, not storage. What does a team do when buried in alerts it cannot all review?',
            'If almost everything is a false alarm, how does the team come to treat the one real alert?',
            'The danger is that the real attack is dismissed along with the noise.',
          ],
          solution:
            'A. The danger of alert fatigue is that the real attack, buried in a flood of false ' +
            'positives and indistinguishable at a glance, gets closed or ignored along with the ' +
            'noise -- a team trained by thousands of false alarms treats the true one as nothing ' +
            'too. It is not primarily a storage problem (B), pressure does not make analysts more ' +
            'accurate (C), and false positives do not stop on their own (D). Quality beats quantity ' +
            'because crying wolf trains people to ignore the wolf.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'The real risk is human: the true alert gets dismissed with all the false ones.',
            },
          ],
          debrief:
            'Alert fatigue is why tuning is a safety issue, not just an efficiency one. A quieter, ' +
            'higher-quality alert stream is what lets the real one stand out.',
          practice: [],
        },
        {
          id: 'btf.2.5',
          moduleId: 'btf.2',
          packageId: 'blue-team-foundations',
          order: 5,
          title: 'Tuning an alert',
          kind: 'short-answer',
          goal: 'Propose a way to raise an alert\'s quality without blinding it.',
          prompt:
            'An alert fires on every login outside business hours and is 99.9% false positives. In ' +
            'two or three sentences, describe one way to make it more specific, and name the risk ' +
            'you must watch for when you do.',
          teach: {
            concept:
              'Improving a noisy alert means raising its specificity -- making it fire on real ' +
              'attacks and stay quiet on legitimate activity -- and there are a few reliable ways to ' +
              'do it. The most powerful is to require multiple signals together rather than one ' +
              'alone: instead of alerting on any out-of-hours login, alert only when an out-of-hours ' +
              'login also comes from an unusual location and touches a sensitive system. Each ' +
              'condition on its own is common; all of them at once is rare and much more likely to ' +
              'be real. Adding context works the same way -- restrict the alert to sensitive systems ' +
              'or to accounts that should never behave this way -- and excluding known-good patterns ' +
              '(the batch job that always runs at 2am) removes predictable noise.\n\n' +
              'The risk you must always weigh is the other side of the trade-off from the previous ' +
              'exercises: every condition you add to cut false positives can also cause a real ' +
              'attack to slip through. Require three things to coincide, and an attacker who ' +
              'triggers only two now goes unseen -- you have traded false positives for false ' +
              'negatives. Good tuning is deliberate about this: you make the alert more specific ' +
              'where the added conditions genuinely correlate with attacks, and you stay alert to ' +
              'what the tightened rule can no longer catch. Specificity is bought with coverage, and ' +
              'the job is spending that coin.',
          },
          hints: [
            'Think about requiring more than one signal at once, or restricting the alert to sensitive systems.',
            'Combining conditions (odd hours plus unusual location plus sensitive data) makes a coincidence rare and more likely real.',
            'A good answer names a way to tighten the alert AND the risk that tightening it lets some real attacks slip through (a false negative).',
          ],
          solution:
            'Make it fire only when several signals coincide -- for example an out-of-hours login ' +
            'that is also from an unusual location and touches a sensitive system -- since each ' +
            'condition alone is common but all together is rare and far more likely to be a real ' +
            'attack. Adding context or excluding known-good patterns works similarly. The risk is ' +
            'the false-negative side of the trade-off: every extra condition can let a real attack ' +
            'that triggers only some of them slip through unseen, so you must watch what the ' +
            'tightened rule can no longer catch.',
          expectedOutput:
            'An answer proposing a way to raise specificity (combine signals, add context, exclude ' +
            'known-good) and naming the risk of increased false negatives.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['combine', 'multiple', 'together', 'context', 'sensitive', 'exclude', 'correlate', 'more than one', 'coincide'],
                ['miss', 'false negative', 'slip', 'real attack', 'too strict', 'let through', 'blind', 'undetect'],
              ],
              hint:
                'Two ideas: a concrete way to tighten the alert, and the risk that tightening it ' +
                'lets some real attacks slip through.',
            },
          ],
          debrief:
            'This is the tuning loop the whole SOC lives in: raise specificity where added ' +
            'conditions genuinely track attacks, and keep watching what the tighter rule can no ' +
            'longer see.',
          practice: [],
        },
      ],
    },
    {
      id: 'btf.3',
      packageId: 'blue-team-foundations',
      order: 3,
      title: 'Reading logs and building timelines',
      summary:
        'Logs are the raw material of defence. This module covers what they are, which source holds ' +
        'which evidence, and the analyst\'s core craft: turning scattered records into a story.',
      exercises: [
        {
          id: 'btf.3.1',
          moduleId: 'btf.3',
          packageId: 'blue-team-foundations',
          order: 1,
          title: 'Reading a log entry',
          kind: 'multiple-choice',
          goal: 'Interpret the fields of a log entry correctly.',
          prompt:
            'A Windows security log records: a successful network logon, account jsmith, source ' +
            '192.0.2.50, at 02:14. Read literally, what does this entry establish?',
          teach: {
            concept:
              'A log is a record of an event: when something happens on a system, an entry is ' +
              'written describing it. Each entry is a small structured fact -- a timestamp, a ' +
              'source, an event type, and details such as an account name or an address. Reading one ' +
              'correctly means taking exactly what it says and no more: this account, from this ' +
              'source, performed this action, at this time, successfully or not. The discipline is ' +
              'literal at first, because the interpretation comes later and must be built on what ' +
              'the record actually states.\n\n' +
              'The common beginner error is to leap from the entry to a conclusion the entry does ' +
              'not support. A successful logon by jsmith at 02:14 establishes that someone ' +
              'authenticated as jsmith from that address at that time -- it does not establish that ' +
              'jsmith the person was there, because a stolen credential produces an identical log. ' +
              'A single entry is a fact about an account and an action, not proof of intent or ' +
              'identity. Holding that line -- reading what the log says, then reasoning separately ' +
              'about what it might mean -- is what keeps an investigation honest, and it is why the ' +
              'next skill, building a timeline from many entries, matters so much: one entry rarely ' +
              'tells you anything on its own.',
          },
          options: [
            { id: 'a', label: 'That someone successfully authenticated as jsmith from 192.0.2.50 at 02:14.' },
            { id: 'b', label: 'That jsmith the person was physically present at 02:14.' },
            { id: 'c', label: 'That an attack definitely occurred.' },
            { id: 'd', label: 'That the login was definitely legitimate.' },
          ],
          hints: [
            'Take the entry literally. What exactly does it record -- and what does it not?',
            'A stolen credential produces the same log as a genuine one. So what can the entry alone prove?',
            'It establishes that an account authenticated from an address at a time, not who was there or whether it was benign.',
          ],
          solution:
            'A. Read literally, the entry establishes only that someone authenticated as jsmith from ' +
            '192.0.2.50 at 02:14. It does not prove jsmith the person was present (B) -- a stolen ' +
            'credential logs identically -- nor does it prove the login was an attack (C) or ' +
            'legitimate (D). A single entry is a fact about an account and an action; intent and ' +
            'identity are reasoned about separately.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'The log records an account, a source, an action, and a time. It cannot record who ' +
                'was really at the keyboard.',
            },
          ],
          debrief:
            'Read logs literally, then reason about meaning separately. Conflating the two -- ' +
            '"jsmith logged in" becoming "jsmith did it" -- is how investigations go wrong.',
          practice: [],
        },
        {
          id: 'btf.3.2',
          moduleId: 'btf.3',
          packageId: 'blue-team-foundations',
          order: 2,
          title: 'Which log holds the evidence',
          kind: 'multiple-choice',
          goal: 'Match a piece of needed evidence to the log source that records it.',
          prompt:
            'You suspect data was exfiltrated from Northwind to an external server. Which log source ' +
            'is the right place to look for evidence of that outbound transfer?',
          teach: {
            concept:
              'Different events are recorded by different systems, and knowing which log holds which ' +
              'kind of evidence is basic to any investigation. Authentication and account activity ' +
              'live in operating-system security logs. File access and changes live in OS and audit ' +
              'logs. Malware detections live in antivirus and EDR logs. And network activity -- who ' +
              'connected to whom, on what port, and how much data moved -- lives in network logs: ' +
              'firewall, proxy, and network-monitoring records. An outbound transfer to an external ' +
              'server is a network event, so the network logs are where its evidence lives.\n\n' +
              'Reaching for the wrong source wastes time and can lead to a false conclusion that ' +
              '"there is no evidence" when you were simply looking in the wrong place. A defender ' +
              'builds a mental map of the estate: for any question, which system would have seen it. ' +
              'That map is also how you notice what should be there and is not -- if the network ' +
              'logs show a large outbound flow but the endpoint logs show nothing that produced it, ' +
              'the gap itself is a clue. The skill being taught is routing each question to the ' +
              'source that can actually answer it, which is the first move in every investigation ' +
              'this package builds toward.',
          },
          options: [
            { id: 'a', label: 'Network logs (firewall, proxy, network monitoring).' },
            { id: 'b', label: 'The antivirus quarantine log.' },
            { id: 'c', label: 'The physical door-access system.' },
            { id: 'd', label: 'The printer job log.' },
          ],
          hints: [
            'An outbound transfer to an external server is a network event. Which source records connections and data volumes?',
            'Antivirus logs malware, not transfers; door and printer logs are unrelated.',
            'Firewall and proxy logs record who connected out, where, and how much moved.',
          ],
          solution:
            'A. An outbound transfer to an external server is a network event, so firewall, proxy, ' +
            'and network-monitoring logs are where the evidence of connections and data volume ' +
            'lives. Antivirus logs (B) record malware, not transfers, and door-access (C) and ' +
            'printer logs (D) are unrelated. Routing each question to the source that could have ' +
            'seen it is the first move in any investigation.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Which system sees connections leaving the network and the volume of data on them?',
            },
          ],
          debrief:
            'A defender keeps a mental map of which system saw what. It answers questions fast, and ' +
            'it turns a missing record into a clue rather than a dead end.',
          practice: [],
        },
        {
          id: 'btf.3.3',
          moduleId: 'btf.3',
          packageId: 'blue-team-foundations',
          order: 3,
          title: 'From raw logs to a story',
          kind: 'short-answer',
          goal: 'Explain why timeline-building is the analyst\'s core skill.',
          prompt:
            'Raw logs are just a pile of individual events. In two or three sentences, explain what ' +
            'an analyst does to turn them into something useful, and why any single log entry is ' +
            'rarely enough on its own.',
          teach: {
            concept:
              'Logs arrive as an unordered heap of individual facts, each true but each nearly ' +
              'meaningless alone. The analyst\'s core craft is to turn that heap into a timeline: ' +
              'ordering events by time, across sources, so that a sequence and therefore a story ' +
              'emerges. A file created, then executed, then a network connection to an external ' +
              'address, then a system file modified -- read in order, those four entries describe an ' +
              'attacker downloading and running malware that then calls home. Read separately, they ' +
              'are just four unremarkable lines.\n\n' +
              'This is why a single log entry rarely settles anything. Meaning lives in the relations ' +
              'between events -- what happened just before and just after, whether a sequence makes ' +
              'sense, whether something expected is missing. Building the timeline is what surfaces ' +
              'those relations, and it is genuinely detective work: you are reconstructing a chain ' +
              'of events from the traces it left, correlating records that different systems wrote ' +
              'independently. Every later investigation skill -- spotting C2, characterising an ' +
              'incident, doing forensics -- is a specialised form of this one, which is why it comes ' +
              'first.',
          },
          hints: [
            'Individual events are true but nearly meaningless alone. What do you do with a pile of them?',
            'Ordering events in time across sources turns facts into a sequence, and a sequence into a story.',
            'A good answer names building a timeline (ordering/correlating events) and that meaning comes from the sequence, not one entry.',
          ],
          solution:
            'The analyst orders the events by time, across all the sources, to build a timeline in ' +
            'which a sequence -- and therefore a story of what happened -- emerges. A single entry ' +
            'is rarely enough because meaning lives in the relations between events: what came just ' +
            'before and after, whether the sequence makes sense, and whether something expected is ' +
            'missing. Correlating scattered records into that chain is the detective work at the ' +
            'heart of every investigation.',
          expectedOutput:
            'An answer naming timeline-building (ordering/correlating events in time) and that ' +
            'meaning comes from the sequence rather than any one entry.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['timeline', 'order', 'sequence', 'chronolog', 'correlate', 'in time', 'story'],
                ['single', 'one entry', 'alone', 'relation', 'context', 'together', 'sequence', 'before and after'],
              ],
              hint:
                'Two ideas: that the analyst builds a timeline by ordering and correlating events, ' +
                'and that a single entry means little because meaning comes from the sequence.',
            },
          ],
          debrief:
            'Timeline-building is the master skill. Spotting C2, characterising an incident, doing ' +
            'forensics -- each is this same craft aimed at a particular question.',
          practice: [],
        },
        {
          id: 'btf.3.4',
          moduleId: 'btf.3',
          packageId: 'blue-team-foundations',
          order: 4,
          title: 'Why timestamps must be normalised',
          kind: 'multiple-choice',
          goal: 'Understand the danger of mixing timestamps from different clocks and zones.',
          prompt:
            'You are correlating logs from a workstation, a firewall, and a server in another time ' +
            'zone whose clock also drifts. Why must you normalise the timestamps before building the ' +
            'timeline?',
          teach: {
            concept:
              'A timeline is only as trustworthy as the timestamps it is ordered by, and timestamps ' +
              'from different systems are rarely directly comparable. Machines sit in different time ' +
              'zones, so 10:15 on one may be 18:15 on another; clocks drift, so a device may be a ' +
              'minute or two off true time; and some log in local time while others log in UTC. ' +
              'Drop these raw values into one timeline and the order can come out wrong, making a ' +
              'later event appear to precede an earlier one.\n\n' +
              'That is not a cosmetic problem, because causation is read from order. If the timeline ' +
              'says the attacker\'s server responded before the victim\'s request went out, the ' +
              'story is nonsense and any conclusion drawn from it is wrong -- you might exonerate the ' +
              'real first move or blame an innocent one. Normalising timestamps -- converting ' +
              'everything to a single reference such as UTC and correcting for known clock drift -- ' +
              'is what makes the ordering real. It is unglamorous, easy to skip, and quietly ' +
              'responsible for a large share of investigations that reach the wrong conclusion, ' +
              'which is why careful analysts do it first, before they trust a single inference the ' +
              'timeline suggests.',
          },
          options: [
            { id: 'a', label: 'Because otherwise events can be ordered wrongly, and a false order leads to false conclusions about cause.' },
            { id: 'b', label: 'Because logs look tidier when the times match.' },
            { id: 'c', label: 'Because time zones are illegal in security work.' },
            { id: 'd', label: 'Because normalising deletes the false positives.' },
          ],
          hints: [
            'A timeline is ordered by time. What happens to the order if the times are not comparable?',
            'Causation is read from order: if the order is wrong, the story is wrong.',
            'Normalising to a single reference like UTC prevents events from appearing out of sequence.',
          ],
          solution:
            'A. Timestamps from different zones, drifting clocks, and mixed local/UTC formats are ' +
            'not directly comparable, so raw values can put events in the wrong order -- and since ' +
            'causation is read from order, a false order produces false conclusions about what ' +
            'caused what. Normalising to a single reference like UTC and correcting for drift makes ' +
            'the ordering trustworthy. It is not about tidiness (B), legality (C), or false ' +
            'positives (D).',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'The timeline\'s whole value is correct ordering, and cause is inferred from order.',
            },
          ],
          debrief:
            'Normalising timestamps is dull and decisive. Skip it and an out-of-order timeline can ' +
            'send an entire investigation chasing the wrong first move.',
          practice: [],
        },
        {
          id: 'btf.3.5',
          moduleId: 'btf.3',
          packageId: 'blue-team-foundations',
          order: 5,
          title: 'When the evidence is what is missing',
          kind: 'short-answer',
          goal: 'Explain how a gap in the logs can itself be evidence.',
          prompt:
            'During an investigation you find that logging on a server was switched off for a ' +
            'two-hour window, then switched back on. In two or three sentences, explain why that gap ' +
            'is itself meaningful evidence, even though it contains no events.',
          teach: {
            concept:
              'Analysts are trained to read what the logs say, but some of the most important ' +
              'evidence is what the logs do not say. A gap where records should exist -- logging ' +
              'disabled for a window, a log file truncated, an expected event absent from an ' +
              'otherwise complete sequence -- is not nothing. It is a hole shaped like something, and ' +
              'the shape often points straight at an attacker who cleared logs, disabled auditing, ' +
              'or used a technique that deliberately avoids leaving the usual trace.\n\n' +
              'Reading absence takes a different habit of mind than reading presence: you have to ' +
              'know what should have been recorded in order to notice that it was not. A process ' +
              'that starts and stops with no record of what it did in between; a two-hour window ' +
              'where a normally chatty server is silent; a login with no corresponding logout -- ' +
              'each gap is a question that demands an answer, and "someone removed the evidence" is ' +
              'frequently the answer. Attackers cover their tracks precisely because tracks are ' +
              'damning, so the act of covering them, when you can detect it, is damning in turn. The ' +
              'skill is to treat an unexpected silence as loudly as an unexpected event.',
          },
          hints: [
            'The gap contains no events, but why would logging be off for exactly two hours and then back on?',
            'Attackers disable logging or clear logs to hide. What does a deliberate gap suggest?',
            'A good answer names that a gap can mean an attacker cleared or disabled logging to hide activity, so absence is itself a clue.',
          ],
          solution:
            'A window where logging was deliberately switched off and then back on is a hole shaped ' +
            'like something: attackers disable auditing or clear logs precisely to hide their ' +
            'activity, so the gap strongly suggests something happened during it that someone did ' +
            'not want recorded. Even though it contains no events, the absence is evidence, because ' +
            'you know records should have been there and they are not. A careful analyst treats an ' +
            'unexpected silence as loudly as an unexpected event.',
          expectedOutput:
            'An answer explaining that a deliberate logging gap suggests an attacker hid activity, ' +
            'so the absence of records is itself evidence.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['gap', 'missing', 'absence', 'disabled', 'cleared', 'off', 'no record', 'silence'],
                ['hide', 'cover', 'attacker', 'conceal', 'tamper', 'remove', 'suspicious', 'something happened'],
              ],
              hint:
                'Two ideas: that the gap is an absence of expected records, and that it suggests an ' +
                'attacker disabled or cleared logging to hide activity.',
            },
          ],
          debrief:
            'Reading absence is an advanced habit worth building early: know what should be there, ' +
            'and treat its disappearance as one of the loudest signals you can get.',
          practice: [],
        },
      ],
    },
    {
      id: 'btf.4',
      packageId: 'blue-team-foundations',
      order: 4,
      title: 'Network traffic and command-and-control',
      summary:
        'What normal network traffic looks like, why the defender sees more than the attacker, and ' +
        'how to spot an implant phoning home even when its traffic is encrypted.',
      exercises: [
        {
          id: 'btf.4.1',
          moduleId: 'btf.4',
          packageId: 'blue-team-foundations',
          order: 1,
          title: 'Expected versus unexpected traffic',
          kind: 'multiple-choice',
          goal: 'Use knowledge of common ports to spot an out-of-place connection.',
          prompt:
            'Reviewing Northwind\'s outbound traffic, which connection is the most out of place and ' +
            'worth a closer look?',
          teach: {
            concept:
              'Networks speak in well-known ports, and fluency in them is the first tool for ' +
              'spotting the odd one out. Web browsing runs over ports 80 and 443, DNS over 53, email ' +
              'over 25, remote administration over 22, Windows file sharing over 445. Most of what a ' +
              'network does every day is this ordinary, expected traffic to ordinary, expected ' +
              'destinations. A defender who knows the normal vocabulary can glance at a flow and feel ' +
              'when something does not belong.\n\n' +
              'What belongs is not only about the port but about the pairing of port, destination, ' +
              'and pattern. A workstation making regular HTTPS requests to well-known sites is ' +
              'normal; that same workstation making repeated connections to an unfamiliar external ' +
              'address on an uncommon port like 8080 is the kind of thing attacker command channels ' +
              'look like. The skill is comparative: against the backdrop of overwhelmingly ordinary ' +
              'traffic, the connection that pairs an unusual destination with an unusual port and an ' +
              'unusual pattern is the one to pull on. Knowing the common ports is what lets you feel ' +
              'that mismatch instead of drowning in the flow.',
          },
          options: [
            { id: 'a', label: 'Repeated connections from one workstation to an unfamiliar external address on port 8080.' },
            { id: 'b', label: 'A workstation making HTTPS (443) requests to well-known websites.' },
            { id: 'c', label: 'DNS queries (port 53) to the configured DNS server.' },
            { id: 'd', label: 'Email leaving over SMTP (port 25) via the company mail server.' },
          ],
          hints: [
            'Three of these are ordinary services on their expected ports to expected destinations.',
            'Port 8080 to an unfamiliar external address, repeated, is not routine web or mail traffic.',
            'The odd one pairs an unusual destination with an uncommon port and a repeating pattern.',
          ],
          solution:
            'A. Repeated connections to an unfamiliar external address on an uncommon port like 8080 ' +
            'pair an unusual destination, port, and pattern -- exactly what an attacker command ' +
            'channel tends to look like -- so it is the one to investigate. HTTPS to known sites ' +
            '(B), DNS to the configured server (C), and email over SMTP via the mail server (D) are ' +
            'all ordinary services on expected ports to expected destinations.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Three are normal services on normal ports. One is repeated traffic to an unfamiliar ' +
                'place on an odd port.',
            },
          ],
          debrief:
            'Knowing the common ports turns a wall of traffic into a readable page. The connection ' +
            'that breaks the vocabulary is where you start.',
          practice: [],
        },
        {
          id: 'btf.4.2',
          moduleId: 'btf.4',
          packageId: 'blue-team-foundations',
          order: 2,
          title: 'The defender sees more',
          kind: 'multiple-choice',
          goal: 'Recognise the defender\'s structural advantage in network visibility.',
          prompt:
            'On the network specifically, what advantage does a well-instrumented defender have over ' +
            'an attacker moving through it?',
          teach: {
            concept:
              'The asymmetry that makes defence hard on the whole -- one path to attack, everything ' +
              'to protect -- has one place where it flips in the defender\'s favour: visibility on ' +
              'their own network. An attacker moving through a network sees only the traffic they ' +
              'themselves generate. They know they connected from the web server to the file server; ' +
              'they cannot see what else is happening, what the monitoring recorded, or how their ' +
              'one connection looks against the whole. A well-instrumented defender, by contrast, can ' +
              'see all of it: every connection, correlated across the network, building a complete ' +
              'picture of movement.\n\n' +
              'This is a real and usable edge, and much of network defence is built to exploit it. ' +
              'The attacker who quietly steps from one internal system to another thinks they are ' +
              'invisible, but the defender monitoring inter-segment traffic sees a connection that ' +
              'should not exist and a volume of data that should not be moving. The lesson is to ' +
              'instrument the inside, not just the perimeter: an attacker who has already breached ' +
              'the edge is now operating on the defender\'s home ground, where the defender can see ' +
              'everything and the attacker can see almost nothing. Squandering that advantage by ' +
              'watching only the perimeter is one of the most common defensive mistakes.',
          },
          options: [
            { id: 'a', label: 'The defender can see and correlate all traffic on the network; the attacker sees only their own.' },
            { id: 'b', label: 'The attacker cannot use encryption on an internal network.' },
            { id: 'c', label: 'The defender can always read the contents of encrypted traffic.' },
            { id: 'd', label: 'The attacker\'s traffic is automatically blocked once inside.' },
          ],
          hints: [
            'Think about whose view is complete. What can each side actually see on the network?',
            'The attacker sees only the traffic they generate; the defender monitoring the network sees everything.',
            'The edge is visibility and correlation across the whole network, not anything about encryption or automatic blocking.',
          ],
          solution:
            'A. On their own network a well-instrumented defender can see and correlate all traffic, ' +
            'while the attacker sees only the flows they generate -- so a quiet internal step the ' +
            'attacker thinks is invisible shows up to the defender as a connection that should not ' +
            'exist. It is not that internal traffic cannot be encrypted (B), that defenders can ' +
            'always read encrypted content (C), or that intruder traffic is auto-blocked (D). The ' +
            'edge is total visibility on home ground.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Which side has the complete, correlated view of the network, and which sees only ' +
                'its own traffic?',
            },
          ],
          debrief:
            'This is why you instrument the inside, not just the edge. Once an attacker is past the ' +
            'perimeter they are on your ground, where you see everything and they see almost ' +
            'nothing.',
          practice: [],
        },
        {
          id: 'btf.4.3',
          moduleId: 'btf.4',
          packageId: 'blue-team-foundations',
          order: 3,
          title: 'The shape of a beacon',
          kind: 'multiple-choice',
          goal: 'Identify the classic behavioural signature of C2 traffic.',
          prompt:
            'One Northwind workstation connects to the same external address for about ten seconds ' +
            'every five minutes, around the clock, regardless of whether anyone is using it. What ' +
            'does this pattern most suggest?',
          teach: {
            concept:
              'Command-and-control traffic -- an implant checking in with its operator for ' +
              'instructions -- has a behavioural signature that often gives it away even when the ' +
              'content is hidden. The classic tell is beaconing: connecting to the same destination ' +
              'at regular intervals, in short bursts, with a machine-like regularity that human ' +
              'activity never has. A person browses in irregular bursts tied to what they are doing; ' +
              'an implant checking in every five minutes, ten seconds at a time, all day and night, ' +
              'is a metronome, and metronomes are machines.\n\n' +
              'That regularity, independent of any user being present, is what separates a beacon ' +
              'from ordinary traffic. Real user activity correlates with someone being at the ' +
              'keyboard; it clusters in working hours, varies with the task, and stops when the ' +
              'person leaves. A beacon does none of this -- it ticks on through the night, tied to ' +
              'no human rhythm -- which is precisely why timing analysis is such a powerful detection ' +
              'method. Attackers know this and add jitter, randomising the interval to break the ' +
              'metronome, but the underlying principle stands: traffic too regular, too ' +
              'machine-like, and uncorrelated with human activity is a signature worth chasing.',
          },
          options: [
            { id: 'a', label: 'Automated beaconing to a command-and-control server, since the regularity is machine-like and uncorrelated with any user.' },
            { id: 'b', label: 'Normal web browsing by an employee.' },
            { id: 'c', label: 'A software update that ran once.' },
            { id: 'd', label: 'Nothing; regular traffic is always safe.' },
          ],
          hints: [
            'Ask whether a human could produce this pattern: identical short connections every five minutes, day and night.',
            'Human activity is irregular and tied to someone being present. This is a metronome.',
            'Machine-like regularity uncorrelated with any user is the classic beaconing signature of C2.',
          ],
          solution:
            'A. Short, identical connections to the same destination at a fixed interval, day and ' +
            'night and independent of any user, is the classic beaconing signature of an implant ' +
            'checking in with a C2 server. It is not human browsing (B), which is irregular and ' +
            'tied to someone being present, nor a one-off update (C), and regularity is emphatically ' +
            'not always safe (D). Machine-like timing uncorrelated with a user is the tell.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'A metronome ticking through the night is not a person browsing. That regularity is ' +
                'the signature.',
            },
          ],
          debrief:
            'Timing is one of the strongest C2 signals. Attackers add jitter to hide it, but ' +
            '"too regular to be human, and running when no human is" remains a powerful lead.',
          practice: [],
        },
        {
          id: 'btf.4.4',
          moduleId: 'btf.4',
          packageId: 'blue-team-foundations',
          order: 4,
          title: 'Catching encrypted C2',
          kind: 'short-answer',
          goal: 'Explain how to detect C2 you cannot decrypt, using metadata.',
          prompt:
            'An attacker\'s command channel is encrypted, so you cannot read what is being sent. In ' +
            'two or three sentences, explain how a defender can still build a strong case that it is ' +
            'C2, without ever seeing the contents.',
          teach: {
            concept:
              'Attackers encrypt their command channels precisely so defenders cannot read them, and ' +
              'a great deal of legitimate traffic is encrypted too, so "it is encrypted" is not by ' +
              'itself suspicious. The mistake is to conclude that encryption defeats detection. It ' +
              'does not, because you do not need the contents -- you have the metadata, which ' +
              'encryption leaves fully exposed: who connected to whom, on what port, how often, in ' +
              'what size bursts, at what times, and whether the destination is one the organisation ' +
              'has any reason to talk to.\n\n' +
              'A strong case can be built from metadata alone. Suppose the traffic is encrypted, but ' +
              'you can see that one workstation connects to a single external address every five ' +
              'minutes for ten seconds, transfers a similar small amount each time, does so around ' +
              'the clock, and the destination is in a region the company does no business with and ' +
              'appears in no legitimate context. You have not read a byte of content, yet the ' +
              'pattern -- regular beaconing, consistent volume, odd destination, no user correlation ' +
              '-- is overwhelmingly the shape of C2. This is the core insight of modern network ' +
              'detection: the envelope tells you almost everything even when the letter is sealed, ' +
              'so you analyse the metadata the attacker cannot encrypt.',
          },
          hints: [
            'You cannot read the contents, but what can you always still see about a connection?',
            'Think about who, where, how often, how much, and when -- none of which encryption hides.',
            'A good answer names using metadata (destination, timing, volume, frequency) to build the case without the content.',
          ],
          solution:
            'Encryption hides the contents but not the metadata, which stays fully visible: who ' +
            'connected to whom, on what port, how often, in what size bursts, at what times, and ' +
            'whether the destination makes any sense for the organisation. A defender can show, say, ' +
            'that one workstation beacons to a single odd external address every five minutes in ' +
            'consistent small bursts around the clock -- a pattern overwhelmingly like C2 -- without ' +
            'reading a byte. The envelope tells you almost everything even when the letter is ' +
            'sealed.',
          expectedOutput:
            'An answer explaining that metadata (destination, timing, volume, frequency) remains ' +
            'visible and lets the defender identify C2 without the content.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['metadata', 'destination', 'timing', 'volume', 'frequency', 'pattern', 'how often', 'who', 'where'],
                ['without', 'even encrypted', 'not read', 'no content', 'cannot read', 'still', 'envelope'],
              ],
              hint:
                'Two ideas: that metadata (destination, timing, volume) stays visible, and that this ' +
                'lets you identify C2 without reading the encrypted content.',
            },
          ],
          debrief:
            'Encryption protects content, not metadata. Modern network detection lives in that gap: ' +
            'the who, when, how often, and how much that the attacker cannot hide.',
          practice: [],
        },
      ],
    },
    {
      id: 'btf.5',
      packageId: 'blue-team-foundations',
      order: 5,
      title: 'Triage, severity, and escalation',
      summary:
        'The daily heartbeat of a SOC: deciding fast whether an alert is real, how urgent it is, and ' +
        'handing the serious ones onward with the context that lets someone act.',
      exercises: [
        {
          id: 'btf.5.1',
          moduleId: 'btf.5',
          packageId: 'blue-team-foundations',
          order: 1,
          title: 'The triage question',
          kind: 'multiple-choice',
          goal: 'Identify the first question triage must answer.',
          prompt:
            'An alert lands in the SOC queue. Before anything else, what is the core question triage ' +
            'exists to answer quickly?',
          teach: {
            concept:
              'Triage is the fast first pass over an alert, and it exists because a SOC cannot ' +
              'deeply investigate everything -- there are far more alerts than analyst-hours, so ' +
              'something has to decide, quickly, which few deserve real attention. The core question ' +
              'triage answers is not "what exactly happened" but "is this worth a human ' +
              'investigation, and if so how urgently". It is sorting, not solving: separating the ' +
              'likely-real from the likely-noise and the urgent from the routine, so that scarce ' +
              'investigative effort goes where it matters.\n\n' +
              'Doing this well means asking a quick series of questions: is this a known false ' +
              'positive I have seen before, is there an obvious benign explanation like scheduled ' +
              'maintenance, and if not, does it involve sensitive systems or data in a way that ' +
              'makes it serious. The goal is a decision, fast: escalate, investigate further, or ' +
              'close. What triage must resist is the temptation to fully investigate every alert ' +
              '(you will never clear the queue) or to escalate everything (which just moves the ' +
              'overload downstream and burns the specialists). Good triage is disciplined ' +
              'sorting under time pressure, and it is the skill the whole SOC workflow rests on.',
          },
          options: [
            { id: 'a', label: 'Is this worth a human investigation, and if so how urgently -- sorting real from noise, urgent from routine.' },
            { id: 'b', label: 'Exactly which attacker group is responsible.' },
            { id: 'c', label: 'The full forensic timeline of everything that happened.' },
            { id: 'd', label: 'Which employee to blame for the alert.' },
          ],
          hints: [
            'Triage is a fast first pass, not a full investigation. What decision does it need to reach quickly?',
            'There are more alerts than hours. Triage sorts which deserve attention and how urgently.',
            'The core question is real-or-noise and urgent-or-routine, not attribution or a full timeline.',
          ],
          solution:
            'A. Triage exists to answer, quickly, whether an alert is worth a human investigation ' +
            'and how urgently -- sorting the likely-real from the noise and the urgent from the ' +
            'routine so scarce effort goes where it matters. Identifying the exact attacker (B) and ' +
            'building the full timeline (C) are investigation, which comes later; assigning blame (D) ' +
            'is not the job at all. Triage is disciplined sorting, not solving.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'It is a fast sort: real or noise, urgent or routine. The deep answers come after.',
            },
          ],
          debrief:
            'Triage is sorting under time pressure. Trying to fully solve every alert never clears ' +
            'the queue; escalating every alert just overloads the specialists.',
          practice: [],
        },
        {
          id: 'btf.5.2',
          moduleId: 'btf.5',
          packageId: 'blue-team-foundations',
          order: 2,
          title: 'Assigning severity',
          kind: 'multiple-choice',
          goal: 'Assign the right severity to a described alert.',
          prompt:
            'An alert shows a workstation making an outbound connection to an address that appears ' +
            'in Northwind\'s threat-intelligence feed as a known malware command server. What ' +
            'severity is appropriate?',
          teach: {
            concept:
              'Severity turns a triage judgement into a decision about speed and resources. A ' +
              'common scale runs critical, high, medium, low, and each level implies a different ' +
              'response tempo: critical means minutes and all hands, high means hours, medium means ' +
              'the next business day, low means whenever there is time. Severity is driven by two ' +
              'things above all -- how likely the alert is to be a real, active attack, and how much ' +
              'damage it implies if it is. An alert that is both very likely real and potentially ' +
              'very damaging is critical.\n\n' +
              'A connection to an address already known, from threat intelligence, to be a malware ' +
              'command server is about as high-confidence as alerts get: it is not an anomaly that ' +
              'might have a benign explanation but a match against known-bad infrastructure, ' +
              'strongly suggesting an active compromise talking to its operator right now. That ' +
              'combination -- high confidence and active, ongoing attack -- is the definition of ' +
              'critical, and it should trigger the fastest response the SOC has. Getting severity ' +
              'right matters because it allocates the team\'s scarce urgency: call everything ' +
              'critical and nothing is, but miss a genuine critical and the response arrives too ' +
              'late.',
          },
          options: [
            { id: 'a', label: 'Critical: a match against a known malware command server strongly indicates an active compromise, demanding the fastest response.' },
            { id: 'b', label: 'Low: it is just one connection.' },
            { id: 'c', label: 'Medium: worth a look next business day.' },
            { id: 'd', label: 'No severity: outbound connections are always fine.' },
          ],
          hints: [
            'Weigh two things: how likely this is a real active attack, and how much damage it implies.',
            'This is not an ambiguous anomaly; it is a match against known-bad infrastructure.',
            'High confidence plus an active, ongoing compromise is the definition of critical.',
          ],
          solution:
            'A. A connection to an address known from threat intelligence to be a malware command ' +
            'server is a high-confidence match against known-bad infrastructure, strongly ' +
            'indicating an active compromise talking to its operator now -- that is critical and ' +
            'demands the fastest response. Treating it as low (B), medium (C), or benign (D) badly ' +
            'underrates both the confidence and the active, ongoing nature of the threat.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'A known-bad match plus an active connection is the highest-confidence, ' +
                'most-urgent kind of alert.',
            },
          ],
          debrief:
            'Severity allocates the team\'s scarce urgency. Call everything critical and nothing is; ' +
            'miss a real critical and the response arrives too late to matter.',
          practice: [],
        },
        {
          id: 'btf.5.3',
          moduleId: 'btf.5',
          packageId: 'blue-team-foundations',
          order: 3,
          title: 'What makes a good escalation',
          kind: 'short-answer',
          goal: 'Explain why context, not just a flag, is what a good escalation carries.',
          prompt:
            'A junior analyst escalates an alert to a specialist with the message "something weird ' +
            'happened, please look." In two or three sentences, explain what is wrong with this and ' +
            'what a good escalation would include instead.',
          teach: {
            concept:
              'Escalation is the hand-off of a serious alert from triage to someone who will ' +
              'investigate or respond, and its whole value is the context that travels with it. An ' +
              'escalation that says only "something weird happened" forces the specialist to start ' +
              'from zero -- to rediscover what the alert was, when it happened, what it touched, and ' +
              'why it might matter -- burning the time of your most expensive people on work the ' +
              'escalating analyst had already done. A good escalation transfers understanding, not ' +
              'just a task.\n\n' +
              'The information that makes an escalation actionable is concrete and specific: what ' +
              'triggered the alert, when, which system and account were involved, why that matters ' +
              '(is it sensitive, is it critical), how it compares to baseline, what the analyst ' +
              'already found, and how urgent it is. With that, the specialist can grasp the ' +
              'situation in seconds and go straight to the investigation. The difference between the ' +
              'two escalations is the difference between handing someone a case file and handing ' +
              'them a shrug. Writing the good version is a core SOC skill, because an escalation that ' +
              'loses the context gathered during triage wastes the very work triage exists to do.',
          },
          hints: [
            'What does the specialist have to do first if the escalation carries no detail?',
            'A good escalation transfers understanding: what, when, which system, why it matters, and what you found.',
            'A good answer names that the vague message forces the specialist to start from scratch, and lists concrete context a good one carries.',
          ],
          solution:
            '"Something weird happened" carries no context, so the specialist has to start from zero ' +
            '-- rediscovering what the alert was, when it fired, what it touched, and why it matters ' +
            '-- wasting the time of your most expensive people on work triage already did. A good ' +
            'escalation transfers understanding: what triggered it, when, which system and account, ' +
            'why that is significant, how it compares to normal, what the analyst already found, and ' +
            'how urgent it is. That lets the specialist grasp it in seconds and go straight to work.',
          expectedOutput:
            'An answer explaining that the vague message forces a restart, and listing concrete ' +
            'context (what, when, which system, why it matters, findings, urgency) a good escalation ' +
            'carries.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['no context', 'vague', 'from scratch', 'start from zero', 'restart', 'rediscover', 'nothing to go on', 'wastes'],
                ['what', 'when', 'which system', 'account', 'why', 'matters', 'findings', 'urgency', 'context', 'detail'],
              ],
              hint:
                'Two ideas: that the vague message forces the specialist to start over, and the ' +
                'concrete context a good escalation should carry.',
            },
          ],
          debrief:
            'An escalation that drops the context gathered in triage throws away the work triage ' +
            'exists to do. Hand over a case file, not a shrug.',
          practice: [],
        },
        {
          id: 'btf.5.4',
          moduleId: 'btf.5',
          packageId: 'blue-team-foundations',
          order: 4,
          title: 'Escalate or close',
          kind: 'multiple-choice',
          goal: 'Decide correctly between escalation and closure for a concrete alert.',
          prompt:
            'Two alerts arrive. Alert 1: a login failure from an internal address, immediately ' +
            'followed by a successful login by the same user (a mistyped password). Alert 2: a ' +
            'database admin account authenticating at 2am from an address in a country Northwind ' +
            'does not operate in, with no maintenance scheduled. Which should you escalate?',
          teach: {
            concept:
              'The everyday triage decision is escalate or close, and doing it well means reading ' +
              'each alert against context rather than reacting to its surface. Some alerts have an ' +
              'obvious benign explanation and can be closed with a note: a single failed login ' +
              'followed immediately by a success from the same internal user is the universal ' +
              'signature of a mistyped password, not an attack. Closing it is correct, and closing ' +
              'it with a brief record is what keeps the queue moving without hiding anything.\n\n' +
              'Other alerts combine several departures from normal in a way that resists a benign ' +
              'reading, and those escalate. A privileged account -- a database admin -- ' +
              'authenticating in the small hours, from a country the company has no presence in, ' +
              'with no maintenance window to explain it, stacks sensitivity (admin), timing (2am), ' +
              'and geography (impossible location) into a pattern that looks like credential ' +
              'compromise. The skill is comparative judgement: close what context explains, escalate ' +
              'what context makes worse. Escalating the mistyped password would burn a specialist on ' +
              'nothing; closing the 2am admin login from an impossible place could miss an active ' +
              'breach. Reading both correctly is exactly the judgement triage is for.',
          },
          options: [
            { id: 'a', label: 'Alert 2: a privileged account, odd hour, and impossible location together look like credential compromise.' },
            { id: 'b', label: 'Alert 1: a failed login is always an attack.' },
            { id: 'c', label: 'Both, equally and urgently.' },
            { id: 'd', label: 'Neither; logins are routine.' },
          ],
          hints: [
            'One alert has an obvious benign explanation. The other stacks several departures from normal.',
            'A failed login then a success by the same internal user is a mistyped password.',
            'An admin account at 2am from an impossible location, unexplained, is the one that looks like compromise.',
          ],
          solution:
            'A. Alert 2 stacks sensitivity (a database admin account), timing (2am), and an ' +
            'impossible geography (a country Northwind does not operate in) with no maintenance to ' +
            'explain it -- a pattern that looks like credential compromise and should be escalated. ' +
            'Alert 1 is the universal signature of a mistyped password (a failure then an immediate ' +
            'success by the same internal user) and can be closed with a note. Treating a failed ' +
            'login as always an attack (B), escalating both (C), or dismissing both (D) all misread ' +
            'the context.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Close the one context explains (mistyped password); escalate the one context makes ' +
                'worse (admin, 2am, impossible location).',
            },
          ],
          debrief:
            'Close what context explains, escalate what context makes worse. Escalate the mistyped ' +
            'password and you burn a specialist; close the impossible admin login and you may miss a ' +
            'breach.',
          practice: [],
        },
      ],
    },
    {
      id: 'btf.6',
      packageId: 'blue-team-foundations',
      order: 6,
      title: 'Incident response fundamentals',
      summary:
        'When an alert becomes a confirmed incident, a disciplined lifecycle takes over: contain, ' +
        'eradicate, recover, and learn -- in that order, and each for a reason.',
      exercises: [
        {
          id: 'btf.6.1',
          moduleId: 'btf.6',
          packageId: 'blue-team-foundations',
          order: 1,
          title: 'The response lifecycle',
          kind: 'multiple-choice',
          goal: 'Know the order of the incident-response phases and why order matters.',
          prompt:
            'After detection and analysis confirm an incident, which ordering of the remaining ' +
            'phases is correct?',
          teach: {
            concept:
              'Incident response follows a lifecycle, and the order is not arbitrary -- each phase ' +
              'depends on the one before. After detection and analysis confirm what you are dealing ' +
              'with, the sequence is containment, then eradication, then recovery, then a ' +
              'post-incident review. Containment comes first because the priority once an attack is ' +
              'confirmed is to stop the bleeding: isolate affected systems, cut the attacker\'s ' +
              'access, and limit the spread while you work out the full picture. You contain before ' +
              'you clean, because an attacker still active will simply undo your cleanup.\n\n' +
              'Eradication follows: with the incident contained, you remove the attacker completely ' +
              '-- delete their tools, close the vulnerability they used, reset the credentials they ' +
              'stole -- so they cannot simply return. Only then does recovery make sense: restoring ' +
              'systems to normal service from clean sources, confident that you are not handing back ' +
              'a system the attacker still controls. Finally, the post-incident review turns the ' +
              'whole episode into improvement. Getting the order wrong is a classic and costly ' +
              'mistake -- recovering before eradicating just gives the attacker a fresh system, and ' +
              'skipping the review guarantees the same incident recurs.',
          },
          options: [
            { id: 'a', label: 'Containment, eradication, recovery, then post-incident review.' },
            { id: 'b', label: 'Recovery, containment, eradication, then review.' },
            { id: 'c', label: 'Eradication, recovery, containment, then review.' },
            { id: 'd', label: 'Recovery first, because getting back to normal is always the priority.' },
          ],
          hints: [
            'Ask what has to be true before you can safely clean up, and before you can safely restore.',
            'You must stop the spread before removing the attacker, and remove them before restoring service.',
            'Contain, then eradicate, then recover, then learn.',
          ],
          solution:
            'A. The order is containment (stop the spread and cut access), then eradication (remove ' +
            'the attacker and close the hole), then recovery (restore service from clean sources), ' +
            'then a post-incident review. Each depends on the last: recovering before eradicating ' +
            '(B, D) hands the attacker a fresh system, and eradicating before containing (C) lets an ' +
            'active attacker undo your work. Order is not optional here.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Stop the spread, remove the attacker, restore service, learn. That dependency chain ' +
                'fixes the order.',
            },
          ],
          debrief:
            'The lifecycle order encodes hard-won lessons. Restore before you eradicate and you just ' +
            'gift-wrap a clean system for the attacker still holding the keys.',
          practice: [],
        },
        {
          id: 'btf.6.2',
          moduleId: 'btf.6',
          packageId: 'blue-team-foundations',
          order: 2,
          title: 'The containment trade-off',
          kind: 'multiple-choice',
          goal: 'Reason about fast shutdown versus monitored containment.',
          prompt:
            'You can contain an incident by immediately shutting the affected system down, or by ' +
            'isolating it while leaving it running and watched. Which statement best captures the ' +
            'trade-off?',
          teach: {
            concept:
              'Containment is not a single action but a choice along a spectrum, and the ends pull ' +
              'against each other. Fast, hard containment -- pull the plug, shut it down now -- stops ' +
              'the attacker immediately and is the safe move when damage is actively mounting. But it ' +
              'is blunt: it destroys volatile evidence in memory, tips the attacker off that they ' +
              'have been caught, and can cause real business disruption. Slower, monitored ' +
              'containment -- isolate the system from the network but leave it running and watched -- ' +
              'preserves evidence and lets you learn what the attacker is doing, at the risk of ' +
              'allowing more harm while you watch.\n\n' +
              'There is no universally right answer; there is a judgement that depends on the ' +
              'incident. If ransomware is actively encrypting files or data is streaming out the ' +
              'door, you contain hard and fast, because every second costs. If the attacker seems to ' +
              'be quietly exploring and you badly need to understand their scope and method, ' +
              'measured containment can be worth the controlled risk. The mature responder weighs ' +
              'how much damage is ongoing, how much they still need to learn, and what the business ' +
              'can tolerate -- and chooses deliberately, rather than reflexively yanking the cable or ' +
              'reflexively watching. Naming the trade-off honestly is the point.',
          },
          options: [
            { id: 'a', label: 'Fast shutdown stops the attacker at once but destroys evidence and disrupts business; monitored isolation preserves evidence and insight but risks more damage.' },
            { id: 'b', label: 'Fast shutdown is always correct.' },
            { id: 'c', label: 'Monitored isolation is always correct.' },
            { id: 'd', label: 'There is no difference between the two.' },
          ],
          hints: [
            'Each option costs something. What does shutting down lose, and what does watching risk?',
            'Shutdown stops the attacker but kills evidence; watching preserves evidence but allows more harm.',
            'The right answer names the cost on both sides, so the choice depends on the incident.',
          ],
          solution:
            'A. Fast shutdown stops the attacker immediately but destroys volatile evidence, tips ' +
            'them off, and disrupts the business, while monitored isolation preserves evidence and ' +
            'insight at the risk of allowing more damage. Neither is always right (B, C) and they ' +
            'are certainly not equivalent (D). The responder weighs ongoing damage, what they still ' +
            'need to learn, and business tolerance, and chooses deliberately.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Look for the option that admits a real cost on both sides, so the choice depends on ' +
                'the situation.',
            },
          ],
          debrief:
            'Containment is a deliberate trade, not a reflex. Ransomware encrypting now means pull ' +
            'the plug; a quiet explorer you need to understand may be worth watching, carefully.',
          practice: [],
        },
        {
          id: 'btf.6.3',
          moduleId: 'btf.6',
          packageId: 'blue-team-foundations',
          order: 3,
          title: 'Capture memory before you reboot',
          kind: 'short-answer',
          goal: 'Explain why volatile evidence must be preserved before shutting a system down.',
          prompt:
            'A responder\'s instinct is to reboot a compromised machine to clear it. In two or three ' +
            'sentences, explain why capturing the system\'s memory before shutting it down can ' +
            'matter enormously.',
          teach: {
            concept:
              'Some of the most valuable evidence in an intrusion exists only while the machine is ' +
              'running. A computer\'s memory holds the live state of the attack: running malicious ' +
              'processes, decryption keys, network connections to the attacker\'s server, commands ' +
              'in flight, and code that exists only in memory and was never written to disk. All of ' +
              'that is volatile -- it vanishes the instant the power goes off. Reboot the machine to ' +
              '"clear it" and you have not just cleared the attacker, you have destroyed the clearest ' +
              'record of what they were doing.\n\n' +
              'This is why forensic practice captures a memory image before any shutdown, following ' +
              'an order of volatility: preserve the most fragile evidence first, then the more ' +
              'durable evidence on disk. The distinction between disk and memory is central -- disk ' +
              'survives a reboot, memory does not -- so memory-resident malware and live keys are ' +
              'lost forever if you power off first. The instinct to reboot is understandable and ' +
              'occasionally exactly wrong: it can turn a solvable investigation into a dead end and, ' +
              'if the incident goes to court, destroy evidence that cannot be recovered. Preserve ' +
              'first, then clean.',
          },
          hints: [
            'What kind of evidence exists only while the machine is powered on?',
            'Memory holds running processes, live keys, and connections that vanish at power-off.',
            'A good answer names that memory is volatile and holds evidence lost on reboot, so you capture it before shutting down.',
          ],
          solution:
            'A running machine\'s memory holds live evidence of the attack -- malicious processes, ' +
            'decryption keys, active connections to the attacker, and code that never touched disk -- ' +
            'and all of it is volatile, vanishing the instant the power goes off. Rebooting to clear ' +
            'the machine destroys that record irretrievably. Capturing a memory image first ' +
            'preserves the most fragile evidence before you move on to the disk, which survives a ' +
            'reboot and can wait.',
          expectedOutput:
            'An answer explaining that memory is volatile and holds live attack evidence lost on ' +
            'reboot, so it must be captured before shutting down.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['memory', 'ram', 'volatile', 'running', 'live', 'in memory'],
                ['lost', 'vanish', 'gone', 'destroy', 'disappear', 'wiped', 'cannot recover', 'reboot'],
              ],
              hint:
                'Two ideas: that memory holds live attack evidence, and that it is volatile and lost ' +
                'when the machine powers off.',
            },
          ],
          debrief:
            'Order of volatility: capture the most fragile evidence first. The reboot instinct is ' +
            'understandable and sometimes exactly the move that erases the case.',
          practice: [],
        },
        {
          id: 'btf.6.4',
          moduleId: 'btf.6',
          packageId: 'blue-team-foundations',
          order: 4,
          title: 'A useful post-incident review',
          kind: 'multiple-choice',
          goal: 'Recognise what makes a lessons-learned review actually improve defence.',
          prompt:
            'Which of these belong in a genuinely useful post-incident review? Select all that ' +
            'apply.',
          teach: {
            concept:
              'The post-incident review is where an organisation converts a bad day into a better ' +
              'defence, and whether it does depends entirely on how it is run. A useful review is ' +
              'blameless: it treats the incident as a failure of systems and processes rather than of ' +
              'individuals, because the moment people fear punishment they stop telling the truth, ' +
              'and a review built on half-truths improves nothing. It looks honestly at how the ' +
              'attack succeeded and why it was not caught sooner, and it turns those findings into ' +
              'specific, owned, tracked improvements -- not vague intentions but concrete changes ' +
              'with a name and a deadline attached.\n\n' +
              'The failure modes are the mirror image. A review that hunts for someone to blame ' +
              'produces defensiveness and silence; a review that identifies problems but assigns no ' +
              'owner and no deadline produces a document nobody acts on and the same incident again ' +
              'next quarter. The test of a good review is not the quality of its writing but whether, ' +
              'months later, the improvements it named actually happened. That is why "specific, ' +
              'owned, tracked to completion" matters as much as "honest and blameless": the first ' +
              'gets the truth, the second turns the truth into change.',
          },
          options: [
            { id: 'a', label: 'An honest, blameless analysis of how the attack succeeded and why it was not caught sooner.' },
            { id: 'b', label: 'Specific improvements, each with a named owner and a deadline.' },
            { id: 'c', label: 'Tracking those improvements through to completion, not just listing them.' },
            { id: 'd', label: 'Identifying an individual to blame and discipline for the incident.' },
          ],
          hints: [
            'Three of these make a review improve defence. One makes people stop telling the truth.',
            'A useful review is blameless, specific, owned, and tracked to completion.',
            'Blame produces silence and defensiveness. The other three turn the incident into real change.',
          ],
          solution:
            'A, B, and C. An honest blameless analysis, specific improvements with named owners and ' +
            'deadlines, and tracking those to completion are what turn an incident into a stronger ' +
            'defence. D is the classic failure mode: hunting for someone to blame makes people ' +
            'defensive and silent, so the review is built on half-truths and improves nothing. Get ' +
            'the truth, then turn it into tracked change.',
          expectedOutput: 'Options A, B, and C selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c'],
              hint:
                'Keep honest, specific, owned, and tracked. Drop the one that assigns blame and ' +
                'kills honesty.',
            },
          ],
          debrief:
            'The test of a review is not its prose but whether, months later, the improvements it ' +
            'named actually happened. Blameless gets the truth; owned and tracked turns it into ' +
            'change.',
          practice: [],
        },
      ],
    },
    {
      id: 'btf.7',
      packageId: 'blue-team-foundations',
      order: 7,
      title: 'Threat intelligence and MITRE ATT&CK',
      summary:
        'Knowing your adversary, and speaking about attacks in a shared language. Where intelligence ' +
        'comes from, and why detecting on behaviour beats chasing disposable indicators.',
      exercises: [
        {
          id: 'btf.7.1',
          moduleId: 'btf.7',
          packageId: 'blue-team-foundations',
          order: 1,
          title: 'The most relevant intelligence',
          kind: 'multiple-choice',
          goal: 'Judge which source of threat intelligence is most directly relevant.',
          prompt:
            'Northwind wants to improve its detections against the attackers most likely to target ' +
            'it. Which source of threat intelligence is the MOST directly relevant, though the ' +
            'easiest to overlook?',
          teach: {
            concept:
              'Threat intelligence is knowledge about attackers -- who they are, what they target, ' +
              'and how they operate -- and it comes from many sources of varying relevance. There is ' +
              'government intelligence, which is authoritative but often slow; commercial feeds, ' +
              'which are current and comprehensive but expensive; community research, which is ' +
              'variable in quality; and industry reports about what has hit similar organisations. ' +
              'All are useful. But the single most relevant source is the one teams most often ' +
              'overlook: their own past incidents.\n\n' +
              'Your own history is intelligence about the attackers who have actually chosen to ' +
              'target you, using the techniques that actually reached your environment. No external ' +
              'feed is as precisely relevant, because it is not a general picture of threats in the ' +
              'world but a specific record of threats to you. The indicators, techniques, and ' +
              'patterns from your own incidents should feed directly back into your detections -- ' +
              'this is the loop that makes a SOC get better over time rather than fighting each ' +
              'attack as if it were the first. External intelligence broadens your view; internal ' +
              'intelligence sharpens it, and a team that mines its own incident history is learning ' +
              'from the most relevant teacher it has.',
          },
          options: [
            { id: 'a', label: 'The organisation\'s own past incidents and the techniques that actually reached it.' },
            { id: 'b', label: 'A general government advisory about global threats.' },
            { id: 'c', label: 'A security vendor\'s marketing blog.' },
            { id: 'd', label: 'Rumours on a public forum.' },
          ],
          hints: [
            'Which source describes the attackers who actually chose to target this specific organisation?',
            'External feeds give a general picture. What gives the picture specific to you?',
            'Your own incident history is intelligence about the threats that actually reached you.',
          ],
          solution:
            'A. An organisation\'s own past incidents are the most directly relevant intelligence, ' +
            'because they record the attackers who actually targeted it and the techniques that ' +
            'actually reached its environment -- and they are the easiest to overlook. A government ' +
            'advisory (B) is authoritative but general, a vendor blog (C) is broad and promotional, ' +
            'and forum rumours (D) are unreliable. External intelligence broadens the view; your own ' +
            'history sharpens it.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'The most relevant source describes threats to you specifically, not threats in ' +
                'general.',
            },
          ],
          debrief:
            'Feeding your own incidents back into detection is the loop that makes a SOC improve. ' +
            'External intel broadens the view; your own history is the sharpest teacher you have.',
          practice: [],
        },
        {
          id: 'btf.7.2',
          moduleId: 'btf.7',
          packageId: 'blue-team-foundations',
          order: 2,
          title: 'What MITRE ATT&CK gives you',
          kind: 'multiple-choice',
          goal: 'Understand the purpose of a shared framework of attacker techniques.',
          prompt:
            'What is the primary value of the MITRE ATT&CK framework to a defender?',
          teach: {
            concept:
              'MITRE ATT&CK is a large, structured catalogue of the tactics and techniques that ' +
              'attackers actually use, observed and documented so that everyone can refer to them ' +
              'the same way. A tactic is the attacker\'s goal at a stage -- initial access, ' +
              'persistence, exfiltration -- and a technique is a specific way to achieve it, each ' +
              'with a stable identifier. Its primary value is not any single fact it contains but ' +
              'the shared language it provides: before such frameworks, every report described ' +
              'attacks in its own words, and analysts could not easily compare one intrusion to ' +
              'another or build detections that generalised.\n\n' +
              'With a common vocabulary, a great deal becomes possible. Teams can say "this group ' +
              'uses this technique" and mean exactly the same thing; they can map an incident to a ' +
              'set of techniques and see which ones they can and cannot currently detect; they can ' +
              'compare their coverage against the techniques a relevant adversary favours. It turns ' +
              'detection from a pile of one-off rules into something you can reason about ' +
              'systematically -- what behaviours can we catch, where are our blind spots -- and it ' +
              'lets intelligence, detection, and response all speak to each other. The framework\'s ' +
              'power is coordination: a shared map that many people can navigate together.',
          },
          options: [
            { id: 'a', label: 'A shared, structured language for attacker techniques, so teams can compare attacks and reason about detection coverage.' },
            { id: 'b', label: 'A tool that automatically blocks all attacks.' },
            { id: 'c', label: 'A list of passwords attackers commonly use.' },
            { id: 'd', label: 'A piece of antivirus software.' },
          ],
          hints: [
            'ATT&CK is a catalogue and a vocabulary, not a piece of software that does something.',
            'Its value is that everyone can describe and compare attacks the same way.',
            'A shared language lets teams map incidents to techniques and see their detection gaps.',
          ],
          solution:
            'A. MITRE ATT&CK\'s primary value is a shared, structured language of attacker tactics ' +
            'and techniques, which lets teams compare attacks, map incidents to techniques, and ' +
            'reason systematically about what they can and cannot detect. It is not software that ' +
            'blocks attacks (B), a password list (C), or antivirus (D). Its power is coordination: a ' +
            'common map many people can navigate together.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'It is a shared catalogue and vocabulary, not a tool that acts on its own.',
            },
          ],
          debrief:
            'A shared language turns detection from a heap of one-off rules into something you can ' +
            'map, measure, and find the blind spots in.',
          practice: [],
        },
        {
          id: 'btf.7.3',
          moduleId: 'btf.7',
          packageId: 'blue-team-foundations',
          order: 3,
          title: 'Detect the behaviour, not the artefact',
          kind: 'short-answer',
          goal: 'Explain why detecting on techniques beats chasing indicators.',
          prompt:
            'A defender can write detections against specific indicators (a particular file hash, a ' +
            'particular attacker address) or against techniques (the behaviour of, say, dumping ' +
            'credentials from memory). In two or three sentences, explain why technique-based ' +
            'detection is more durable, using what you know about how cheaply attackers change ' +
            'indicators.',
          teach: {
            concept:
              'There is a hierarchy of pain in detection, seen from the attacker\'s side. ' +
              'Indicators of compromise -- a file hash, an address, a domain -- are cheap for an ' +
              'attacker to change: a new build has a new hash, a new server is a few dollars, so a ' +
              'detection written against a specific indicator stops exactly one version of one ' +
              'attack and nothing else. Block yesterday\'s hash and today\'s recompile sails ' +
              'straight past. Indicator-based detection has its place, but it is brittle by nature.\n\n' +
              'Techniques are far more expensive to change, because they reflect how the attacker ' +
              'actually has to operate. If you detect the behaviour of dumping credentials from ' +
              'memory rather than the specific tool that did it, you catch every tool that uses that ' +
              'behaviour, including ones you have never seen, because the behaviour is intrinsic to ' +
              'the goal. The attacker can swap hashes and addresses all day, but to avoid a ' +
              'technique-based detection they would have to find a genuinely different way to ' +
              'achieve their aim, which is hard and sometimes impossible. This is why mature ' +
              'detection is written against techniques wherever it can be: you are attacking the ' +
              'part of the adversary that is costly to move, not the part they change for free.',
          },
          hints: [
            'How much does it cost an attacker to change a file hash or an address? How much to change how they operate?',
            'An indicator detection stops one version; a technique detection stops a whole class of behaviour.',
            'A good answer names that indicators are cheap to change (brittle) while techniques are costly to change (durable, catch unseen variants).',
          ],
          solution:
            'Indicators like a file hash or an address are trivially cheap for an attacker to change ' +
            '-- a recompile gives a new hash, a new server a new address -- so a detection tied to ' +
            'one indicator stops a single version and nothing else. A technique-based detection ' +
            'targets the behaviour itself, such as dumping credentials from memory, which is ' +
            'intrinsic to the attacker\'s goal and costly to change, so it catches every tool using ' +
            'that behaviour, including ones you have never seen. You are attacking the part of the ' +
            'adversary that is expensive to move, not the part they change for free.',
          expectedOutput:
            'An answer explaining that indicators are cheap to change so indicator detection is ' +
            'brittle, while techniques are costly to change so technique detection is durable and ' +
            'catches unseen variants.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['cheap', 'easy to change', 'trivial', 'recompile', 'new hash', 'disposable', 'brittle', 'one version'],
                ['technique', 'behaviour', 'behavior', 'durable', 'costly to change', 'hard to change', 'catch unseen', 'class', 'intrinsic'],
              ],
              hint:
                'Two ideas: that indicators are cheap to change (so indicator detection is brittle), ' +
                'and that techniques are costly to change (so technique detection is durable).',
            },
          ],
          debrief:
            'This mirrors the red-team lesson about IOCs versus TTPs, seen from the defender\'s ' +
            'chair: write your detections against the expensive-to-change behaviour, not the ' +
            'disposable artefact.',
          practice: [],
        },
        {
          id: 'btf.7.4',
          moduleId: 'btf.7',
          packageId: 'blue-team-foundations',
          order: 4,
          title: 'Tactic, technique, procedure',
          kind: 'multiple-choice',
          goal: 'Distinguish the three levels of the TTP hierarchy.',
          prompt:
            'An attacker "sent a phishing email carrying a malicious spreadsheet to gain initial ' +
            'access." In the tactic / technique / procedure breakdown, which part is the TECHNIQUE?',
          teach: {
            concept:
              'The shorthand TTP stands for tactic, technique, and procedure, and the three name ' +
              'three levels of description from general to specific. The tactic is the attacker\'s ' +
              'goal at that stage -- what they are trying to accomplish, such as initial access. The ' +
              'technique is the general method used to accomplish it, such as phishing. The ' +
              'procedure is the specific way this particular attacker carried the technique out, such ' +
              'as sending a spreadsheet with a malicious macro rather than a link. Same tactic, same ' +
              'technique, different procedure.\n\n' +
              'The distinction is practical, not academic. A defender who writes detection at the ' +
              'technique level -- "phishing" -- catches many procedures at once: the spreadsheet, ' +
              'the link, the PDF, all variants of the same technique. A detection written only ' +
              'against one procedure catches only that procedure and misses the next variant. ' +
              'Understanding which level you are describing tells you how general your detection is: ' +
              'the tactic is the goal, the technique is the reusable method worth detecting broadly, ' +
              'and the procedure is the specific instance. In the example, gaining initial access is ' +
              'the tactic, phishing is the technique, and the malicious spreadsheet is the ' +
              'procedure.',
          },
          options: [
            { id: 'a', label: 'Phishing -- the general method used.' },
            { id: 'b', label: 'Gaining initial access -- the goal.' },
            { id: 'c', label: 'The malicious spreadsheet -- the specific way it was carried out.' },
            { id: 'd', label: 'The email address it was sent from.' },
          ],
          hints: [
            'Tactic is the goal, technique is the general method, procedure is the specific instance.',
            'Gaining initial access is the goal (tactic); the spreadsheet is the specific instance (procedure).',
            'The general method between them -- phishing -- is the technique.',
          ],
          solution:
            'A. Phishing is the technique: the general method used to achieve the goal. Gaining ' +
            'initial access (B) is the tactic (the goal), and the malicious spreadsheet (C) is the ' +
            'procedure (the specific way this attacker carried the technique out). The email address ' +
            '(D) is just an indicator. Detecting at the technique level -- phishing -- catches many ' +
            'procedures at once.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'The goal is the tactic, the specific instance is the procedure. The general method ' +
                'in between is the technique.',
            },
          ],
          debrief:
            'Detecting at the technique level catches the spreadsheet, the link, and the PDF at ' +
            'once. Detecting only the procedure catches one variant and misses the next.',
          practice: [],
        },
      ],
    },
    {
      id: 'btf.8',
      packageId: 'blue-team-foundations',
      order: 8,
      title: 'Malware and endpoint detection',
      summary:
        'What malware is and how it behaves, and how endpoint detection tries to catch it -- ' +
        'including why the method that catches novel malware is also the one that cries wolf.',
      exercises: [
        {
          id: 'btf.8.1',
          moduleId: 'btf.8',
          packageId: 'blue-team-foundations',
          order: 1,
          title: 'Classify the malware',
          kind: 'multiple-choice',
          goal: 'Match a described sample to its malware category.',
          prompt:
            'A program on a Northwind machine encrypts the user\'s files and displays a message ' +
            'demanding payment for the key to decrypt them. What category of malware is this?',
          teach: {
            concept:
              'Malware is software written to do harm, and it is grouped into families by what it ' +
              'does and how it spreads. A virus infects other files and runs when they run; a worm ' +
              'spreads by itself across a network without user action; a trojan disguises itself as ' +
              'something desirable so the user runs it willingly; spyware quietly watches and steals ' +
              'information; a rootkit hides deep in the system to conceal itself and other malware. ' +
              'Ransomware encrypts the victim\'s files and demands payment for the decryption key, ' +
              'turning the victim\'s own data into the hostage.\n\n' +
              'Classifying a sample by its behaviour matters because the category tells you what to ' +
              'expect and how to respond. Ransomware\'s defining behaviour -- encrypting files and ' +
              'demanding payment -- calls for a very different response from spyware\'s quiet ' +
              'exfiltration: with ransomware, speed of containment and the state of your backups are ' +
              'everything, because the damage is immediate and visible. The described sample ' +
              'encrypts files and demands payment, which is ransomware by definition, and recognising ' +
              'that instantly frames the response around isolating the spread and restoring from ' +
              'clean, offline backups rather than paying.',
          },
          options: [
            { id: 'a', label: 'Ransomware: it encrypts files and demands payment for the key.' },
            { id: 'b', label: 'Spyware: it secretly watches the user.' },
            { id: 'c', label: 'A worm: it spreads across the network by itself.' },
            { id: 'd', label: 'A rootkit: it hides itself in the kernel.' },
          ],
          hints: [
            'The defining behaviour is encrypting files and demanding payment. Which family is that?',
            'Spyware watches, worms spread, rootkits hide. None of those is encrypt-and-extort.',
            'Encrypt the victim\'s data and demand a ransom for the key is ransomware by definition.',
          ],
          solution:
            'A. Encrypting the victim\'s files and demanding payment for the decryption key is the ' +
            'defining behaviour of ransomware. It is not spyware (B), which quietly watches; not a ' +
            'worm (C), defined by self-spreading; and not a rootkit (D), defined by hiding. ' +
            'Recognising it as ransomware immediately frames the response around fast containment ' +
            'and restoring from clean, offline backups.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Encrypt-and-extort is one specific family. Which one?',
            },
          ],
          debrief:
            'The category frames the response. Recognise ransomware and you are already thinking ' +
            'about isolating the spread and the state of your offline backups.',
          practice: [],
        },
        {
          id: 'btf.8.2',
          moduleId: 'btf.8',
          packageId: 'blue-team-foundations',
          order: 2,
          title: 'Which method catches novel malware',
          kind: 'multiple-choice',
          goal: 'Compare signature and behaviour detection on unseen threats.',
          prompt:
            'A brand-new piece of malware, never seen before, runs on a Northwind endpoint. Which ' +
            'EDR detection method has the best chance of catching it, and why?',
          teach: {
            concept:
              'Endpoint detection uses a few complementary methods, and they differ sharply in what ' +
              'they can catch. Signature detection matches files against a database of known-bad ' +
              'fingerprints -- hashes of malware seen before. It is fast and precise on known ' +
              'threats and produces few false positives, but by definition it cannot catch anything ' +
              'novel: a brand-new sample has no signature yet, so it walks straight past. Behaviour ' +
              'detection watches what a program does -- injecting code into another process, ' +
              'encrypting files en masse, tampering with security settings -- and flags actions that ' +
              'are suspicious regardless of whether the specific file has been seen before.\n\n' +
              'Against genuinely new malware, behaviour detection is the method with a chance, ' +
              'because malware is defined by what it does, and the harmful behaviours are far more ' +
              'stable than the file that performs them. A novel ransomware sample still has to ' +
              'encrypt files; a novel credential stealer still has to read memory it should not. The ' +
              'trade-off, which the earlier false-positive module foreshadowed, is that behaviour ' +
              'and anomaly detection are noisier: judging behaviour as suspicious is less precise ' +
              'than matching a known hash, so it catches more real novel threats at the cost of more ' +
              'false alarms. The method that sees the unseen is also the one that cries wolf, which ' +
              'is exactly why skilled analysts, not just tools, are needed to work its alerts.',
          },
          options: [
            { id: 'a', label: 'Behaviour detection: it flags suspicious actions regardless of whether the file has been seen before.' },
            { id: 'b', label: 'Signature detection: it matches the file against known-malware fingerprints.' },
            { id: 'c', label: 'Neither can ever catch new malware.' },
            { id: 'd', label: 'Signature detection, because new malware always matches an old signature.' },
          ],
          hints: [
            'A brand-new sample has no signature yet. So what can a signature match possibly do?',
            'Behaviour detection watches what a program does, not whether its file is known.',
            'Malware is defined by its actions, which are more stable than its file. That is what behaviour detection catches.',
          ],
          solution:
            'A. Behaviour detection has the best chance because it flags suspicious actions -- ' +
            'encrypting files en masse, injecting into other processes -- regardless of whether the ' +
            'specific file has been seen, and those harmful behaviours are more stable than the file ' +
            'performing them. Signature detection (B, D) matches known fingerprints and by ' +
            'definition cannot catch a sample with no signature yet. The catch is that behaviour ' +
            'detection is noisier, which is why analysts are needed to work its alerts.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'New malware has no known fingerprint, but it still has to behave like malware. ' +
                'Which method watches behaviour?',
            },
          ],
          debrief:
            'The method that catches the unseen is also the one that cries wolf. That is the ' +
            'false-positive trade-off again, and the reason behaviour-based alerts still need a ' +
            'human.',
          practice: [],
        },
        {
          id: 'btf.8.3',
          moduleId: 'btf.8',
          packageId: 'blue-team-foundations',
          order: 3,
          title: 'The limits of EDR',
          kind: 'short-answer',
          goal: 'Explain why endpoint detection is not a complete defence on its own.',
          prompt:
            'EDR is powerful, but a SOC that treats it as a complete solution is fooling itself. In ' +
            'two or three sentences, name a couple of ways a capable attacker can defeat or evade ' +
            'EDR, and state what EDR therefore needs alongside it.',
          teach: {
            concept:
              'Endpoint detection and response is one of the strongest tools a defender has, but it ' +
              'is not magic, and a capable attacker has several ways around it. If they gain ' +
              'administrative rights, they may be able to disable or blind the EDR agent itself. They ' +
              'can use legitimate built-in tools for malicious ends -- so-called living off the land ' +
              '-- so that nothing obviously bad ever runs. Sophisticated malware can hide from the ' +
              'agent, and adversaries actively study how the common products detect things and design ' +
              'their techniques to slip through the gaps. No single sensor sees everything, and the ' +
              'attacker knows exactly which sensor they are up against.\n\n' +
              'The conclusion is the same one this package keeps returning to: EDR plus skilled ' +
              'people and other layers makes a real defence, while EDR alone is a false sense of ' +
              'security. The tool needs corroboration from other sources -- network logs that see ' +
              'traffic the endpoint agent cannot vouch for, a SIEM correlating across many systems, ' +
              'analysts who notice the absence of expected telemetry as readily as its presence. An ' +
              'attacker who has blinded the EDR on one host has not blinded the network, and a ' +
              'defender who relies on any one sensor has handed the attacker a single thing to ' +
              'defeat. Defence in depth applies to your detection tools too.',
          },
          hints: [
            'Think about what an attacker with admin rights can do to the agent, and about using legitimate tools for bad ends.',
            'No single sensor sees everything, and attackers study how EDR detects things.',
            'A good answer names at least one evasion (disable the agent, live off the land, hide from it) and that EDR needs other layers and skilled people alongside it.',
          ],
          solution:
            'A capable attacker with administrative rights can disable or blind the EDR agent, can ' +
            'live off the land by abusing legitimate built-in tools so nothing obviously malicious ' +
            'runs, and can study how the product detects things to design techniques that slip ' +
            'through. Because no single sensor sees everything, EDR needs other layers alongside it ' +
            '-- network logs, a correlating SIEM, and skilled analysts who notice missing telemetry ' +
            'as readily as present alerts. EDR plus people and other layers is a defence; EDR alone ' +
            'is a false sense of security.',
          expectedOutput:
            'An answer naming at least one EDR evasion (disable the agent, live off the land, hide) ' +
            'and stating that EDR needs other layers and skilled people alongside it.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['disable', 'blind', 'living off the land', 'legitimate tool', 'hide', 'evade', 'bypass', 'turn off', 'admin'],
                ['other layers', 'network', 'siem', 'people', 'analyst', 'corroborat', 'defence in depth', 'not alone', 'alongside'],
              ],
              hint:
                'Two ideas: at least one way EDR is evaded, and that it needs other layers or skilled ' +
                'people alongside it.',
            },
          ],
          debrief:
            'Defence in depth applies to your sensors too. An attacker who blinds the EDR on one ' +
            'host has not blinded the network -- unless you were relying on the EDR alone.',
          practice: [],
        },
        {
          id: 'btf.8.4',
          moduleId: 'btf.8',
          packageId: 'blue-team-foundations',
          order: 4,
          title: 'Read the malware\'s behaviour',
          kind: 'multiple-choice',
          goal: 'Name the attack phase a described malware action belongs to.',
          prompt:
            'From EDR telemetry, a piece of malware is seen creating a scheduled task that will ' +
            're-launch it every time the machine boots. Which behaviour phase is this?',
          teach: {
            concept:
              'Malware, once running, tends to move through recognisable behavioural phases, and ' +
              'reading them from endpoint telemetry is how an analyst turns raw EDR events into an ' +
              'understanding of the attack. After delivery and initial execution, malware commonly ' +
              'establishes persistence so it survives a reboot, takes steps at evasion to hide from ' +
              'detection, opens communication to a command server, carries out its actual objective, ' +
              'and sometimes attempts to cover its tracks. Each phase looks different in the ' +
              'telemetry, and naming the phase tells you what the malware is trying to achieve at ' +
              'that moment.\n\n' +
              'Creating a scheduled task that re-launches the malware at every boot is a textbook ' +
              'persistence behaviour: its purpose is to ensure the attacker\'s code keeps running ' +
              'even after the machine restarts, exactly as the red-team side of this world would ' +
              'plan. Recognising it as persistence -- rather than, say, communication or the final ' +
              'objective -- matters for the response, because persistence mechanisms are what you ' +
              'must find and remove during eradication, or the attacker simply comes back on the ' +
              'next reboot. Reading behaviour by phase is the endpoint version of the timeline skill: ' +
              'it converts a scatter of events into a story about what the attacker is doing and ' +
              'what to do about it.',
          },
          options: [
            { id: 'a', label: 'Persistence: ensuring the malware keeps running across reboots.' },
            { id: 'b', label: 'Delivery: getting the malware onto the machine.' },
            { id: 'c', label: 'Exfiltration: sending stolen data out.' },
            { id: 'd', label: 'Reconnaissance: mapping the network.' },
          ],
          hints: [
            'Ask what a scheduled task that re-launches the malware at every boot is for.',
            'It is not about arriving, sending data out, or mapping the network.',
            'Surviving a reboot so the code keeps running is persistence.',
          ],
          solution:
            'A. A scheduled task that re-launches the malware at every boot exists to keep the ' +
            'attacker\'s code running across restarts, which is the definition of persistence. It is ' +
            'not delivery (B), which is how it arrived; not exfiltration (C), which sends data out; ' +
            'and not reconnaissance (D). Recognising persistence matters because these mechanisms ' +
            'are exactly what you must find and remove during eradication.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Surviving reboots to keep running is one specific phase. Which one?',
            },
          ],
          debrief:
            'Persistence mechanisms are what eradication must hunt down. Miss the scheduled task and ' +
            'the attacker is back on the next reboot, no matter how clean the rest of the cleanup.',
          practice: [],
        },
      ],
    },
    {
      id: 'btf.9',
      packageId: 'blue-team-foundations',
      order: 9,
      title: 'Learning from real breaches',
      summary:
        'Five well-documented public incidents, read from the defender\'s chair: not what the ' +
        'attacker did, but what detection or control would have caught it sooner.',
      exercises: [
        {
          id: 'btf.9.1',
          moduleId: 'btf.9',
          packageId: 'blue-team-foundations',
          order: 1,
          title: 'The lateral-movement lesson',
          kind: 'multiple-choice',
          goal: 'Draw the defensive lesson from a breach that spread internally undetected.',
          prompt:
            'In the Target breach, attackers got in through a heating-and-cooling contractor and ' +
            'then moved across the internal network to the payment systems without being caught. ' +
            'What is the clearest lesson for defenders?',
          teach: {
            concept:
              'The Target breach of 2013 saw around forty million payment card numbers stolen, and ' +
              'the defensive lesson is not really about the entry point but about what happened ' +
              'after it. The attackers entered through a third-party heating-and-cooling contractor ' +
              'with network access, then moved laterally across the internal network to reach the ' +
              'payment systems, and that internal movement went undetected long enough to matter. ' +
              'The perimeter was breached, as perimeters sometimes are; the failure was not seeing ' +
              'the attacker travel once they were inside.\n\n' +
              'The lesson is that defenders must watch internal traffic, not just the perimeter. A ' +
              'defence that concentrates everything on keeping attackers out has nothing to say once ' +
              'one is in, and lateral movement -- a connection between internal systems that should ' +
              'not be talking, a foothold reaching toward sensitive systems -- is detectable if ' +
              'anyone is monitoring for it. This connects directly to the network module earlier: ' +
              'the defender\'s great advantage is total visibility on their own network, and Target ' +
              'is what it costs to squander that advantage by watching only the edge. Monitor ' +
              'inter-segment traffic, and an intruder\'s movement becomes a signal instead of a ' +
              'silence.',
          },
          options: [
            { id: 'a', label: 'Monitor internal traffic for lateral movement, not just the perimeter.' },
            { id: 'b', label: 'Never use heating-and-cooling contractors.' },
            { id: 'c', label: 'Payment systems should be printed on paper.' },
            { id: 'd', label: 'Perimeter firewalls are the only control that matters.' },
          ],
          hints: [
            'The breach was not caught during internal movement. What does that tell defenders to watch?',
            'The failure was blindness inside the network, not the existence of a contractor.',
            'The lesson is to monitor for lateral movement between internal segments.',
          ],
          solution:
            'A. The failure was not catching the attacker as they moved laterally across the ' +
            'internal network to the payment systems, so the lesson is to monitor internal traffic ' +
            'for lateral movement, not just guard the perimeter. Banning contractors (B) misreads ' +
            'the cause, paper payment systems (C) is absurd, and treating perimeter firewalls as the ' +
            'only control (D) is exactly the mistake that let the movement go unseen.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'The attacker moved across the inside undetected. That points at internal ' +
                'monitoring, not the perimeter.',
            },
          ],
          debrief:
            'Target is the cost of watching only the edge. Your advantage is total visibility ' +
            'inside; monitor inter-segment traffic and movement becomes a signal, not a silence.',
          practice: [],
        },
        {
          id: 'btf.9.2',
          moduleId: 'btf.9',
          packageId: 'blue-team-foundations',
          order: 2,
          title: 'The patching lesson',
          kind: 'multiple-choice',
          goal: 'Identify the detection and control improvement from an unpatched-flaw breach.',
          prompt:
            'In the Equifax breach, attackers exploited a known vulnerability for which a patch had ' +
            'been available for months. From the defender\'s side, which improvement most directly ' +
            'addresses this?',
          teach: {
            concept:
              'The Equifax breach of 2017 exposed the data of around 147 million people, and its ' +
              'cause was a known vulnerability in a web framework, with a patch available for ' +
              'months, that was never applied to the affected system. From the defender\'s chair the ' +
              'lesson has two parts. The first is the obvious one: patch management is a decisive ' +
              'discipline, and knowing about a flaw achieves nothing until the fix is actually ' +
              'deployed everywhere it is needed. But knowing what to patch depends on knowing what ' +
              'you have, which is why asset inventory and vulnerability scanning underpin the whole ' +
              'thing -- you cannot patch a system you have forgotten you run.\n\n' +
              'The second part is detection: even with imperfect patching, exploitation attempts ' +
              'against known vulnerabilities have signatures, and monitoring for them can catch an ' +
              'attack in progress against a system you have not yet fixed. A defender improves here ' +
              'by scanning continuously for unpatched systems and by alerting on exploit attempts ' +
              'against known flaws, so that the window between a patch existing and being applied is ' +
              'both as short as possible and actively watched. This ties back to the vulnerability ' +
              'reasoning in the wider curriculum: a CVE and a CVSS score are only useful if the loop ' +
              'closes with a deployed fix and a detection to cover the gap until it lands.',
          },
          options: [
            { id: 'a', label: 'Continuous scanning for unpatched systems, plus alerting on exploit attempts against known vulnerabilities.' },
            { id: 'b', label: 'Turning off all web applications permanently.' },
            { id: 'c', label: 'Assuming vendors will patch everything for you.' },
            { id: 'd', label: 'Ignoring vulnerability scores entirely.' },
          ],
          hints: [
            'The flaw was known and patchable. What would help you find such systems and catch exploitation?',
            'Think inventory and scanning to find unpatched systems, plus detection of exploit attempts.',
            'The improvement is scanning for unpatched systems and alerting on known-exploit attempts.',
          ],
          solution:
            'A. Since the flaw was known and a patch existed, the direct improvements are continuous ' +
            'scanning to find unpatched systems and alerting on exploit attempts against known ' +
            'vulnerabilities, which shortens and watches the gap between a patch existing and being ' +
            'applied. Disabling all web apps (B) is not viable, assuming vendors patch for you (C) ' +
            'is the abdication that caused the problem, and ignoring scores (D) removes the ' +
            'prioritisation you need.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'You want to find the unpatched systems and catch exploitation of known flaws.',
            },
          ],
          debrief:
            'A CVE is only useful if the loop closes with a deployed fix and a detection covering ' +
            'the gap until it lands. Equifax is what an open loop costs.',
          practice: [],
        },
        {
          id: 'btf.9.3',
          moduleId: 'btf.9',
          packageId: 'blue-team-foundations',
          order: 3,
          title: 'The segmentation lesson',
          kind: 'multiple-choice',
          goal: 'Extract the segmentation and credential lesson from a ransomware incident.',
          prompt:
            'In the Colonial Pipeline incident, attackers entered through a single VPN account with ' +
            'no multi-factor authentication, and the intrusion reached operational systems. Which ' +
            'pair of defensive lessons fits best?',
          teach: {
            concept:
              'The Colonial Pipeline ransomware attack of 2021 disrupted fuel supply across much of ' +
              'the eastern United States, and it teaches two defensive lessons at once. The first is ' +
              'about credentials: the entry point was a single VPN account, protected by only a ' +
              'password and reportedly no longer in active use, with no multi-factor authentication. ' +
              'Multi-factor authentication would have made the stolen password insufficient on its ' +
              'own, and disciplined management of dormant accounts would have removed the forgotten ' +
              'door entirely. Credentials are the favourite way in, and controls that make a stolen ' +
              'one not enough are among the highest-value defences there are.\n\n' +
              'The second lesson is about segmentation: the intrusion was able to reach operational ' +
              'systems that should have been strongly isolated from the general network. Network ' +
              'segmentation exists precisely to stop a foothold in one area from becoming access to ' +
              'everything, and especially to wall off critical or operational systems so that a ' +
              'compromise elsewhere cannot spread to them. Together the two lessons are ' +
              'multi-factor authentication and dormant-account hygiene at the front door, and real ' +
              'segmentation inside so that one breached credential does not open the whole estate. ' +
              'This is the defender\'s reading of a story the red-team side tells as an easy win.',
          },
          options: [
            { id: 'a', label: 'Require multi-factor authentication and manage dormant accounts; and segment critical systems so one foothold cannot reach them.' },
            { id: 'b', label: 'Ban VPNs entirely and require staff to work only on site.' },
            { id: 'c', label: 'Share one password across all accounts for simplicity.' },
            { id: 'd', label: 'Connect operational systems directly to the internet for easier access.' },
          ],
          hints: [
            'There are two failures here: the single unprotected account, and the reach into operational systems.',
            'One lesson is about credentials (MFA, dormant accounts); the other is about isolating critical systems.',
            'The right pair is MFA plus account hygiene, and segmentation of critical systems.',
          ],
          solution:
            'A. The two failures were a single VPN account with no multi-factor authentication ' +
            '(fixed by MFA and by managing dormant accounts) and the intrusion reaching operational ' +
            'systems (fixed by segmenting critical systems so one foothold cannot reach them). ' +
            'Banning VPNs (B) is impractical, sharing one password (C) is the opposite of the ' +
            'lesson, and exposing operational systems to the internet (D) is dangerously wrong.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Two fixes: make a stolen credential insufficient, and isolate critical systems so a ' +
                'foothold cannot reach them.',
            },
          ],
          debrief:
            'Colonial is the defender\'s reading of a red-team easy win: MFA and account hygiene at ' +
            'the door, real segmentation inside, so one credential does not open the whole estate.',
          practice: [],
        },
        {
          id: 'btf.9.4',
          moduleId: 'btf.9',
          packageId: 'blue-team-foundations',
          order: 4,
          title: 'Extract your own detection improvement',
          kind: 'short-answer',
          goal: 'Turn a described third-party breach into a concrete detection improvement.',
          prompt:
            'In a breach modelled on the Uber 2022 incident, an attacker compromised a contractor\'s ' +
            'account, then used it to reach internal admin tools and cloud infrastructure that the ' +
            'contractor had no normal reason to touch. In two or three sentences, name a detection ' +
            'improvement that would have caught this sooner, and explain what signal it keys on.',
          teach: {
            concept:
              'A breach modelled on the Uber incident of 2022 began with a compromised contractor ' +
              'account and escalated when that account was used to reach internal administrative ' +
              'tools and cloud infrastructure far beyond anything the contractor normally touched. ' +
              'From the defender\'s side, the recurring pattern in these third-party breaches is a ' +
              'legitimate but limited account suddenly behaving far outside its normal scope, and ' +
              'that behavioural departure is exactly the signal a good detection keys on. The ' +
              'account is valid, so nothing is technically broken -- but a contractor account ' +
              'reaching admin tools it has never used before is a sharp break from its baseline.\n\n' +
              'The detection improvement follows directly: alert when an account -- especially a ' +
              'third-party or contractor account -- accesses sensitive administrative tools or ' +
              'infrastructure it has no history of using. This keys on anomalous access relative to ' +
              'the account\'s own baseline, the same behavioural-detection principle that catches ' +
              'lateral movement with valid credentials. It pairs naturally with a control lesson -- ' +
              'contractor accounts should be tightly scoped and isolated so they cannot reach such ' +
              'tools at all -- but even where scoping is imperfect, monitoring for an account acting ' +
              'wildly outside its normal role turns a quiet abuse of valid credentials into a ' +
              'catchable signal. That is the whole art: since the credential is real, you detect the ' +
              'behaviour, not the login.',
          },
          hints: [
            'The account was valid, so nothing "broke". What was abnormal was what the account reached.',
            'Think about alerting when an account touches sensitive tools it has never used before, relative to its own baseline.',
            'A good answer names alerting on anomalous access (an account, especially a contractor, reaching admin tools outside its normal scope) and that it keys on the behavioural departure from baseline.',
          ],
          solution:
            'Alert when an account -- especially a contractor or third-party account -- accesses ' +
            'sensitive administrative tools or infrastructure it has no history of touching. The ' +
            'signal it keys on is the behavioural departure from the account\'s own baseline: the ' +
            'credential is valid, so nothing is technically broken, but a limited account suddenly ' +
            'reaching admin tools is a sharp break from normal. It is the same principle that catches ' +
            'lateral movement with valid credentials -- since the login is real, you detect the ' +
            'behaviour, not the authentication.',
          expectedOutput:
            'An answer naming a detection that alerts on an account (especially a contractor) ' +
            'accessing tools outside its normal scope, keyed on the behavioural departure from ' +
            'baseline.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['alert', 'detect', 'monitor', 'flag', 'notice'],
                ['outside', 'never', 'unusual', 'baseline', 'anomal', 'abnormal', 'not normal', 'scope', 'no history', 'beyond'],
              ],
              hint:
                'Two ideas: a detection that alerts on the access, and that it keys on the account ' +
                'behaving outside its normal scope or baseline.',
            },
          ],
          debrief:
            'The pattern across third-party breaches is a valid account acting outside its role. ' +
            'Since the credential is real, you detect the behaviour, not the login.',
          practice: [],
        },
      ],
    },
    {
      id: 'btf.10',
      packageId: 'blue-team-foundations',
      order: 10,
      title: 'Forensics and evidence',
      summary:
        'When an incident may end in court or a hard root-cause finding, how you handle evidence ' +
        'decides whether it holds up: order of volatility, chain of custody, and reading tampered ' +
        'timestamps.',
      exercises: [
        {
          id: 'btf.10.1',
          moduleId: 'btf.10',
          packageId: 'blue-team-foundations',
          order: 1,
          title: 'The order of preservation',
          kind: 'multiple-choice',
          goal: 'Order forensic preservation steps by volatility.',
          prompt:
            'You must preserve evidence from a live compromised server before analysing it. Which ' +
            'ordering of the first steps is correct?',
          teach: {
            concept:
              'Forensics is the disciplined examination of evidence to establish what happened, and ' +
              'its first rule is that evidence, once destroyed, cannot be recovered. That makes the ' +
              'order of preservation critical, and the guiding principle is the order of volatility: ' +
              'capture the most fragile evidence first, before it can vanish, then the more durable ' +
              'evidence that will survive. In practice you isolate the system from the network to ' +
              'stop the attacker and stop the state from changing further, then capture the volatile ' +
              'memory, then image the disk, and only then analyse -- always working on the copies, ' +
              'never the originals.\n\n' +
              'Getting the order right is the difference between usable evidence and a ruined case. ' +
              'Memory is volatile and disappears at power-off, so it must be captured before any ' +
              'shutdown; the disk is durable and can wait; analysis comes last and never touches the ' +
              'original. A responder who reaches for the disk first, or who starts poking at the ' +
              'live system before preserving it, changes or destroys the very evidence they are ' +
              'trying to collect. The sequence -- isolate, capture memory, image disk, then analyse ' +
              'copies -- encodes the order of volatility into a routine you can follow under ' +
              'pressure, which is exactly when the temptation to skip a step is strongest.',
          },
          options: [
            { id: 'a', label: 'Isolate the system, capture memory, image the disk, then analyse the copies.' },
            { id: 'b', label: 'Analyse the live system first, then capture memory and disk if needed.' },
            { id: 'c', label: 'Image the disk first, then reboot, then capture memory.' },
            { id: 'd', label: 'Delete suspicious files immediately to stop the attack.' },
          ],
          hints: [
            'Order of volatility: capture the most fragile evidence first. Which evidence vanishes soonest?',
            'Memory disappears at power-off; disk survives. Analysis must be on copies, not originals.',
            'Isolate, then memory, then disk, then analyse copies.',
          ],
          solution:
            'A. The order of volatility dictates isolating the system, capturing volatile memory ' +
            'before any shutdown, imaging the durable disk, then analysing the copies -- never the ' +
            'originals. Analysing the live system first (B) changes the evidence, imaging then ' +
            'rebooting before capturing memory (C) destroys the volatile evidence, and deleting ' +
            'files (D) destroys evidence outright. The sequence preserves the most fragile evidence ' +
            'first.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Most fragile first: isolate, memory, disk, then work only on copies.',
            },
          ],
          debrief:
            'Order of volatility is a routine precisely so you can follow it under pressure, which ' +
            'is when the urge to skip straight to poking at the system is strongest.',
          practice: [],
        },
        {
          id: 'btf.10.2',
          moduleId: 'btf.10',
          packageId: 'blue-team-foundations',
          order: 2,
          title: 'Why chain of custody matters',
          kind: 'short-answer',
          goal: 'Explain the purpose of chain of custody and the cost of breaking it.',
          prompt:
            'In two or three sentences, explain what chain of custody is and why breaking it can ' +
            'render otherwise damning evidence useless.',
          teach: {
            concept:
              'Chain of custody is the documented history of a piece of evidence: who collected it, ' +
              'when, how it was handled, where it has been stored, and everyone who has touched it ' +
              'since. It exists because evidence is only trustworthy if you can prove it was not ' +
              'altered, swapped, or contaminated between collection and presentation. In a legal ' +
              'context that proof is a formal requirement -- evidence with a broken or missing chain ' +
              'may be ruled inadmissible, no matter how damning its contents -- but the same ' +
              'principle protects any serious investigation from the accusation that its evidence ' +
              'cannot be trusted.\n\n' +
              'Breaking the chain is easy and often invisible until it is too late: leaving a disk ' +
              'unattended, storing evidence somewhere unsecured, letting an unauthorised person ' +
              'handle it, or simply failing to document a transfer. Once there is a gap, you can no ' +
              'longer prove the evidence is what you say it is and untouched, and a defence lawyer ' +
              'needs only to raise the possibility of tampering for the evidence to lose its force. ' +
              'The lesson for a responder is that how you handle evidence can matter as much as what ' +
              'the evidence shows: a perfect forensic finding, collected sloppily, can free a guilty ' +
              'party. Document everything, secure everything, and treat the chain as part of the ' +
              'evidence itself.',
          },
          hints: [
            'Chain of custody is a documented history of who touched the evidence and when. Why would anyone need that?',
            'Evidence is only trustworthy if you can prove it was not altered or swapped. What happens when you cannot?',
            'A good answer defines it as the documented handling history and names that a break makes the evidence untrustworthy or inadmissible.',
          ],
          solution:
            'Chain of custody is the documented history of a piece of evidence -- who collected it, ' +
            'when, how it was handled and stored, and everyone who has touched it since -- and it ' +
            'exists to prove the evidence was not altered, swapped, or contaminated. If the chain is ' +
            'broken (a disk left unattended, an undocumented transfer, an unauthorised handler), you ' +
            'can no longer prove the evidence is what you say it is and untouched, so it may be ruled ' +
            'inadmissible or simply disbelieved -- however damning its contents. How you handle ' +
            'evidence can matter as much as what it shows.',
          expectedOutput:
            'An answer defining chain of custody as the documented handling history and explaining ' +
            'that breaking it makes the evidence untrustworthy or inadmissible.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['who', 'documented', 'history', 'handled', 'record', 'track', 'custody', 'touched'],
                ['inadmissible', 'untrustworthy', 'tamper', 'altered', 'not trusted', 'thrown out', 'useless', 'disbeliev', 'cannot prove'],
              ],
              hint:
                'Two ideas: that it is the documented handling history, and that breaking it makes ' +
                'the evidence untrustworthy or inadmissible.',
            },
          ],
          debrief:
            'A perfect forensic finding collected sloppily can free a guilty party. Treat the chain ' +
            'of custody as part of the evidence itself: document and secure everything.',
          practice: [],
        },
        {
          id: 'btf.10.3',
          moduleId: 'btf.10',
          packageId: 'blue-team-foundations',
          order: 3,
          title: 'Timestamps that contradict',
          kind: 'multiple-choice',
          goal: 'Spot timestamp tampering from a logical contradiction.',
          prompt:
            'A file claims it was created and last modified on 1 January, but its last-accessed ' +
            'time is 1 September of the same year -- eight months later. Why is this a red flag?',
          teach: {
            concept:
              'Files carry several timestamps -- typically when they were created, last modified, ' +
              'and last accessed -- and forensic analysts read these together, because their ' +
              'relationships must make logical sense. Normally a file is created, then perhaps ' +
              'modified, then accessed, and the timestamps line up with that story. Attackers who ' +
              'want a malicious file to blend in sometimes alter its timestamps to make it look old ' +
              'and legitimate, a technique called timestomping -- but altering timestamps ' +
              'convincingly is harder than it looks, and the tampering often leaves a logical ' +
              'contradiction behind.\n\n' +
              'The contradiction here is subtle but decisive. If a file was genuinely created and ' +
              'last modified on 1 January and never touched since, its last-accessed time cannot be ' +
              'eight months later of its own accord -- something accessed it, or the creation and ' +
              'modification times were faked to look old while the access time reveals recent ' +
              'activity. Either way, the timestamps tell inconsistent stories, and inconsistency is ' +
              'the tell. This is why analysts cross-check timestamps against each other and against ' +
              'other evidence rather than trusting any one of them: a single timestamp can be forged, ' +
              'but making all of them, plus the surrounding logs, agree on a false story is much ' +
              'harder, and the seams show.',
          },
          options: [
            { id: 'a', label: 'The timestamps contradict each other, suggesting they were tampered with to make the file look old.' },
            { id: 'b', label: 'Files are not allowed to have three timestamps.' },
            { id: 'c', label: 'September is always suspicious.' },
            { id: 'd', label: 'Nothing is wrong; timestamps mean nothing.' },
          ],
          hints: [
            'Read the three timestamps as a story. Does created, modified, then accessed eight months later make sense?',
            'If it was created and last modified in January and untouched since, how is it being accessed in September?',
            'The inconsistency between the timestamps is the red flag: it points at tampering.',
          ],
          solution:
            'A. The timestamps tell inconsistent stories: a file supposedly created and last ' +
            'modified in January but accessed in September was either touched after its stated last ' +
            'activity or had its creation and modification times faked to look old. That ' +
            'contradiction is the classic signature of timestamp tampering (timestomping). Files ' +
            'normally do have several timestamps (B), September is not inherently suspicious (C), and ' +
            'timestamps are far from meaningless (D) -- their consistency is exactly what reveals ' +
            'the forgery.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'The three timestamps cannot all be true together. That inconsistency is the tell.',
            },
          ],
          debrief:
            'Analysts cross-check timestamps against each other and the logs precisely because ' +
            'faking one is easy but making all of them agree on a false story is hard. The seams ' +
            'show.',
          practice: [],
        },
        {
          id: 'btf.10.4',
          moduleId: 'btf.10',
          packageId: 'blue-team-foundations',
          order: 4,
          title: 'Work on copies, never originals',
          kind: 'short-answer',
          goal: 'Explain why forensic analysis is performed on copies.',
          prompt:
            'A cardinal rule of forensics is to analyse a forensic copy of the evidence, never the ' +
            'original. In two or three sentences, explain why, and what makes a forensic copy ' +
            'trustworthy as a stand-in.',
          teach: {
            concept:
              'Analysis changes things. Opening a file updates its access time; running a tool ' +
              'writes to disk; simply exploring a live system leaves traces. If you do that work on ' +
              'the original evidence, you alter it, and you can no longer show the court or the ' +
              'investigation what the evidence looked like at the moment of collection. So the ' +
              'cardinal rule is to make a forensic copy and analyse that, preserving the original ' +
              'untouched. You can be as invasive as you like on a copy, and if you damage or ' +
              'question it, you simply make another from the preserved original.\n\n' +
              'What makes a copy trustworthy as a stand-in is that it can be proven identical to the ' +
              'original, bit for bit. A forensic image is a complete, exact duplicate, and its ' +
              'integrity is verified with a cryptographic hash: compute the hash of the original and ' +
              'of the copy, and if they match, the copy is provably the same data. That hash, ' +
              'recorded at collection, also lets you show later that the evidence has not changed ' +
              'since. Together the practices -- image exactly, verify by hash, analyse the copy, ' +
              'preserve the original -- mean your analysis never endangers the evidence and your ' +
              'findings rest on something you can prove is faithful to what was really there.',
          },
          hints: [
            'Analysis itself changes evidence -- opening files, running tools, leaving traces. What does that mean for the original?',
            'You work on a copy so the original stays pristine and you can always make another.',
            'A good answer names that analysis alters evidence so the original must be preserved, and that a forensic copy is a verified exact duplicate (e.g. checked by hash).',
          ],
          solution:
            'Analysis itself changes evidence -- opening files updates timestamps, running tools ' +
            'writes to disk, exploring a live system leaves traces -- so doing it on the original ' +
            'would alter the very thing you need to preserve. Working on a forensic copy keeps the ' +
            'original pristine, and you can always make another if the copy is damaged or ' +
            'questioned. The copy is trustworthy because it is a bit-for-bit exact duplicate whose ' +
            'integrity is verified with a cryptographic hash: matching hashes prove the copy is the ' +
            'same data as the original.',
          expectedOutput:
            'An answer explaining that analysis alters evidence so the original is preserved, and ' +
            'that a forensic copy is a verified exact duplicate (e.g. hash-checked).',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['alter', 'change', 'modify', 'contaminate', 'leave trace', 'update', 'damage', 'preserve'],
                ['exact', 'identical', 'bit-for-bit', 'hash', 'duplicate', 'verified', 'same data', 'image'],
              ],
              hint:
                'Two ideas: that analysis alters evidence so the original must be kept pristine, and ' +
                'that a forensic copy is a verified exact duplicate (for example, checked by hash).',
            },
          ],
          debrief:
            'Image exactly, verify by hash, analyse the copy, preserve the original. Your analysis ' +
            'then never endangers the evidence, and your findings rest on something provably ' +
            'faithful.',
          practice: [],
        },
      ],
    },
    {
      id: 'btf.11',
      packageId: 'blue-team-foundations',
      order: 11,
      title: 'Resilient architecture and defensive maturity',
      summary:
        'Designing systems that survive the breach you assume will happen: assume-breach thinking, ' +
        'segmentation, least privilege, and the improvement loop that raises a defence over time.',
      exercises: [
        {
          id: 'btf.11.1',
          moduleId: 'btf.11',
          packageId: 'blue-team-foundations',
          order: 1,
          title: 'Assume breach',
          kind: 'multiple-choice',
          goal: 'Recognise how assume-breach thinking changes design priorities.',
          prompt:
            'A security architect designs Northwind\'s network on the explicit assumption that ' +
            'attackers will get in eventually. Which design priority does that assumption most ' +
            'directly produce?',
          teach: {
            concept:
              'A great deal of security design flows from a single choice of assumption. If you ' +
              'assume prevention will succeed, you pour everything into the perimeter and treat the ' +
              'inside as safe. If you assume breach -- that a sufficiently determined attacker will ' +
              'eventually get in somewhere -- your priorities change completely. You still try to ' +
              'prevent, but you design as though the attacker is already inside, which means ' +
              'investing heavily in detecting them once they are, limiting how far they can get, and ' +
              'being able to recover. Assume-breach is the architectural expression of the ' +
              'asymmetry lesson from the very first module.\n\n' +
              'Concretely, assuming breach produces priorities that a prevention-only mindset ' +
              'neglects: pervasive internal monitoring so an intruder is seen, segmentation so a ' +
              'foothold in one place cannot reach everything, least privilege so a compromised ' +
              'account can do little, and tested recovery so you can restore after the damage. The ' +
              'common thread is limiting the blast radius of an intrusion you concede will happen. ' +
              'This is not defeatism -- prevention still matters -- but realism: designing only for a ' +
              'perimeter that never fails is designing for a world that does not exist, and ' +
              'assume-breach builds the second and third layers the first module said you cannot do ' +
              'without.',
          },
          options: [
            { id: 'a', label: 'Investing in internal detection, segmentation, least privilege, and recovery to limit the blast radius of an intrusion.' },
            { id: 'b', label: 'Spending everything on the perimeter firewall and nothing else.' },
            { id: 'c', label: 'Removing all monitoring, since breaches are inevitable anyway.' },
            { id: 'd', label: 'Trusting every device and user once they are inside the network.' },
          ],
          hints: [
            'If you assume the attacker gets in, what do you now need to be good at?',
            'Assume-breach shifts investment toward detecting, containing, and recovering from an intrusion.',
            'The priority is limiting the blast radius: internal detection, segmentation, least privilege, recovery.',
          ],
          solution:
            'A. Assuming the attacker will get in shifts priority toward internal detection, ' +
            'segmentation, least privilege, and tested recovery -- all aimed at limiting the blast ' +
            'radius of an intrusion. Spending only on the perimeter (B) or trusting everything ' +
            'inside (D) is the prevention-only mindset assume-breach rejects, and removing ' +
            'monitoring (C) is the opposite of what conceding a breach demands.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'If the attacker will get in, you invest in seeing them, containing them, and ' +
                'recovering -- limiting the blast radius.',
            },
          ],
          debrief:
            'Assume-breach is the architectural form of the asymmetry lesson: design for the world ' +
            'where the perimeter sometimes fails, because that is the world you live in.',
          practice: [],
        },
        {
          id: 'btf.11.2',
          moduleId: 'btf.11',
          packageId: 'blue-team-foundations',
          order: 2,
          title: 'What segmentation buys you',
          kind: 'multiple-choice',
          goal: 'Explain the defensive value of network segmentation.',
          prompt:
            'Northwind divides its flat network into separate zones -- a DMZ, a general internal ' +
            'zone, and a tightly restricted zone for financial systems -- with controlled crossings ' +
            'between them. What does this most directly achieve?',
          teach: {
            concept:
              'A flat network -- one in which every system can freely reach every other -- is a gift ' +
              'to an attacker, because a single foothold anywhere grants reach everywhere. ' +
              'Segmentation divides the network into zones with controlled crossings between them, so ' +
              'that reaching one zone does not mean reaching the rest. The most sensitive systems -- ' +
              'financial systems, operational technology, executive infrastructure -- sit in tightly ' +
              'restricted zones that a compromise elsewhere cannot simply walk into. It is the ' +
              'network equivalent of watertight compartments in a ship: a breach floods one section ' +
              'instead of sinking the whole vessel.\n\n' +
              'What segmentation most directly buys is the containment of lateral movement. An ' +
              'attacker who lands in the DMZ or the general internal zone still faces controlled, ' +
              'monitored boundaries before they can reach the crown jewels, which both slows them ' +
              'down and creates chokepoints where their movement is far easier to detect. It is ' +
              'exactly the control whose absence made the Target and Colonial incidents so much ' +
              'worse -- a foothold that should have been isolated instead reached payment or ' +
              'operational systems. Segmentation does not prevent the initial breach, but it decides ' +
              'whether that breach is an incident in one zone or a catastrophe across all of them.',
          },
          options: [
            { id: 'a', label: 'It contains lateral movement, so a foothold in one zone cannot freely reach the sensitive systems in another.' },
            { id: 'b', label: 'It prevents attackers from ever getting into the network.' },
            { id: 'c', label: 'It makes encryption unnecessary.' },
            { id: 'd', label: 'It removes the need for monitoring.' },
          ],
          hints: [
            'Segmentation does not stop the initial breach. What does it stop once someone is in?',
            'Think about an attacker in one zone trying to reach the financial systems in another.',
            'It contains lateral movement and creates monitored chokepoints between zones.',
          ],
          solution:
            'A. Segmentation contains lateral movement: an attacker with a foothold in one zone ' +
            'faces controlled, monitored boundaries before reaching sensitive systems in another, ' +
            'which both slows them and creates chokepoints to detect them. It does not prevent the ' +
            'initial breach (B), has nothing to do with removing encryption (C), and does not remove ' +
            'the need for monitoring (D) -- indeed it makes the boundaries better places to monitor.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'It is about what happens after the breach: containing movement between zones.',
            },
          ],
          debrief:
            'Segmentation decides whether a breach is an incident in one zone or a catastrophe ' +
            'across all of them. Its absence is what made Target and Colonial so much worse.',
          practice: [],
        },
        {
          id: 'btf.11.3',
          moduleId: 'btf.11',
          packageId: 'blue-team-foundations',
          order: 3,
          title: 'The improvement loop',
          kind: 'short-answer',
          goal: 'Explain why defensive maturity is a continuous cycle, not a finished state.',
          prompt:
            'Security maturity is often described as a loop -- assess, plan, implement, measure, ' +
            'improve -- rather than a destination you reach and are done. In two or three sentences, ' +
            'explain why defence has to be continuous and can never be simply "finished".',
          teach: {
            concept:
              'It is tempting to imagine security as a project with an end: deploy the controls, ' +
              'reach a target state, declare victory. But defence is not a state you achieve and ' +
              'keep; it is a loop you run forever, because the thing you are defending against never ' +
              'holds still. New vulnerabilities appear, attackers invent new techniques, the ' +
              'business changes what it does and what it exposes, and the environment you baselined ' +
              'last year is not the one you have now. A defence that stops improving does not stay ' +
              'level -- it decays, because the world moves on around it.\n\n' +
              'That is why maturity is modelled as a cycle: assess where you are, plan where to go, ' +
              'implement the changes, measure whether they worked, and feed what you learn back into ' +
              'the next assessment. Each incident, each new threat, each tuning decision is an ' +
              'input to the loop. The measure step matters especially, because you cannot improve ' +
              'what you do not track -- detection rates, response times, incident trends tell you ' +
              'whether last quarter\'s changes actually helped. The organisations that defend well ' +
              'are not the ones that reached some final configuration; they are the ones that keep ' +
              'running the loop, so their defence evolves at least as fast as the threats do.',
          },
          hints: [
            'What keeps changing that a "finished" defence would fail to keep up with?',
            'New vulnerabilities, new attacker techniques, and a changing business all move the target.',
            'A good answer names that threats and the environment keep changing, so defence must continuously assess, improve, and measure rather than reaching a fixed end state.',
          ],
          solution:
            'Defence cannot be finished because what it defends against never holds still: new ' +
            'vulnerabilities appear, attackers invent new techniques, and the business keeps ' +
            'changing what it does and exposes, so a defence that stops improving decays as the world ' +
            'moves past it. That is why maturity is a loop -- assess, plan, implement, measure, ' +
            'improve -- fed by each incident and threat, with the measure step showing whether ' +
            'changes actually helped. The organisations that defend well are the ones that keep ' +
            'running the loop so their defence evolves at least as fast as the threats.',
          expectedOutput:
            'An answer explaining that threats and the environment continually change, so defence ' +
            'must run a continuous improvement loop rather than reaching a fixed finished state.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['change', 'new', 'evolve', 'new technique', 'new vulnerab', 'moves', 'shift', 'never holds still'],
                ['continuous', 'loop', 'ongoing', 'cycle', 'keep', 'never finished', 'improve', 'measure', 'decay'],
              ],
              hint:
                'Two ideas: that threats and the environment keep changing, and that defence must ' +
                'therefore run a continuous loop rather than being finished.',
            },
          ],
          debrief:
            'Defence is a loop, not a project. The teams that do it well are not the ones that ' +
            'reached a final configuration but the ones that keep running the cycle.',
          practice: [],
        },
      ],
    },
    {
      id: 'btf.12',
      packageId: 'blue-team-foundations',
      order: 12,
      title: 'Readiness and the whole picture',
      summary:
        'Pulling the pathway together: sequencing a full response correctly, and articulating what ' +
        'it means to be ready for adversarial blue-team practice and a SOC specialisation.',
      exercises: [
        {
          id: 'btf.12.1',
          moduleId: 'btf.12',
          packageId: 'blue-team-foundations',
          order: 1,
          title: 'Run the whole response',
          kind: 'multiple-choice',
          goal: 'Sequence a complete incident response from alert to lessons learned.',
          prompt:
            'A critical alert fires at Northwind. Which end-to-end sequence reflects a correct ' +
            'blue-team response?',
          teach: {
            concept:
              'The capstone skill of this pathway is holding the whole response in your head as one ' +
              'ordered flow, because each stage this package taught separately is really a link in a ' +
              'single chain. It begins with triage -- deciding fast whether the alert is real and ' +
              'how urgent -- then investigation to understand what actually happened, building the ' +
              'timeline and characterising the attack. Only once you understand it do you contain it ' +
              'to stop the spread, eradicate the attacker and close the hole, recover normal ' +
              'operations from clean sources, and finally review the incident to turn it into ' +
              'lasting improvement. Skip or reorder a stage and the whole response suffers.\n\n' +
              'The ordering encodes dependencies you have met throughout the package. You investigate ' +
              'before you contain because containment choices depend on understanding the attack; you ' +
              'contain before you eradicate because an active attacker undoes cleanup; you eradicate ' +
              'before you recover because restoring onto a still-compromised foundation just hands ' +
              'the attacker a fresh system; and you always review, because an incident you do not ' +
              'learn from you are doomed to repeat. Being able to lay out that full sequence, and say ' +
              'why each stage precedes the next, is what tells you the pieces have become a single ' +
              'competence rather than a list of separate lessons.',
          },
          options: [
            { id: 'a', label: 'Triage, investigate, contain, eradicate, recover, then review and improve.' },
            { id: 'b', label: 'Recover, triage, contain, investigate, then stop.' },
            { id: 'c', label: 'Eradicate, recover, then triage to see if it was real.' },
            { id: 'd', label: 'Contain, recover, and skip the review to save time.' },
          ],
          hints: [
            'Walk the chain: understand before you act, contain before you clean, clean before you restore, and always learn.',
            'Triage and investigation come first; recovery and review come last.',
            'Triage, investigate, contain, eradicate, recover, review.',
          ],
          solution:
            'A. The correct end-to-end flow is triage (is it real and urgent), investigate ' +
            '(understand it), contain (stop the spread), eradicate (remove the attacker and close ' +
            'the hole), recover (restore from clean sources), then review and improve. The others ' +
            'break the dependencies: recovering or eradicating before triaging and investigating (B, ' +
            'C) acts without understanding, and skipping the review (D) guarantees the incident ' +
            'recurs.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Understand before acting, contain before cleaning, clean before restoring, and ' +
                'always review.',
            },
          ],
          debrief:
            'Being able to lay out the full sequence, and say why each stage precedes the next, is ' +
            'the sign the separate lessons have fused into one competence.',
          practice: [],
        },
        {
          id: 'btf.12.2',
          moduleId: 'btf.12',
          packageId: 'blue-team-foundations',
          order: 2,
          title: 'What blue-team readiness means',
          kind: 'short-answer',
          goal: 'Synthesise the pathway into a statement of defensive readiness.',
          prompt:
            'This pathway has moved from the defender mindset through baselines, logs, network ' +
            'traffic, triage, incident response, threat intelligence, malware, real breaches, ' +
            'forensics, and architecture. In three or four sentences, describe what it means to be ' +
            'ready for adversarial blue-team practice: what you should now be able to do, and the ' +
            'core habit of thought that runs through all of it.',
          teach: {
            concept:
              'Readiness for adversarial practice is not about memorising tools or alert names; this ' +
              'pathway has taught judgement, not products. It means you can take an alert and reason ' +
              'through the whole arc -- triage whether it is real, investigate by building a timeline ' +
              'from logs and network evidence, recognise the attacker\'s behaviour and map it to ' +
              'known techniques, and drive a response that contains, eradicates, recovers, and ' +
              'learns. It means you can tell normal from abnormal because you think in baselines, ' +
              'and you can hold the false-positive trade-off in mind so you neither drown in noise ' +
              'nor blind yourself by over-tuning.\n\n' +
              'The core habit running through all of it is the defender\'s way of seeing: assume ' +
              'breach, know your normal, and detect behaviour rather than chase disposable ' +
              'artefacts. A ready analyst treats logging as evidence and its absence as evidence too, ' +
              'reasons about what the attacker is trying to achieve at each phase, and keeps the ' +
              'asymmetry in view -- that the attacker needs one path and you must cover them all, ' +
              'which is why speed of detection and quality of response matter more than a perfect ' +
              'wall. Being ready is holding that mindset steadily while the pieces -- baselines, ' +
              'timelines, triage, response -- come together into a single practised way of working. ' +
              'The adversarial practice ahead, and the SOC specialisation after it, is where you ' +
              'sharpen that mindset against a live opponent.',
          },
          hints: [
            'Readiness is about reasoning through the whole arc from alert to lessons learned, not memorising tools.',
            'Name both the abilities (triage, investigate/timeline, recognise behaviour, respond) and the habit of thought (assume breach, know your normal, detect behaviour, the asymmetry).',
            'A good answer covers reasoning across the detection-and-response arc AND a core defensive mindset such as assume-breach, thinking in baselines, or detecting behaviour over artefacts.',
          ],
          solution:
            'Being ready means you can take an alert and reason through the whole arc -- triage ' +
            'whether it is real, investigate by building a timeline from logs and network evidence, ' +
            'recognise the attacker\'s behaviour and map it to known techniques, and drive a ' +
            'response that contains, eradicates, recovers, and learns. It means telling normal from ' +
            'abnormal by thinking in baselines and holding the false-positive trade-off so you ' +
            'neither drown in noise nor blind yourself. The habit running through all of it is the ' +
            'defender\'s mindset: assume breach, know your normal, detect behaviour rather than ' +
            'chase disposable artefacts, and keep the asymmetry in view -- one path for the ' +
            'attacker, all paths for you -- so detection speed and response quality matter more than ' +
            'a perfect wall.',
          expectedOutput:
            'An answer covering both reasoning across the detection-and-response arc and a core ' +
            'defensive habit of thought (assume breach, baselines, behaviour over artefacts, or the ' +
            'asymmetry).',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['triage', 'investigate', 'timeline', 'detect', 'respond', 'contain', 'baseline', 'arc', 'whole'],
                ['assume breach', 'know your normal', 'behaviour', 'behavior', 'asymmetry', 'mindset', 'detection', 'defend everything', 'blast radius'],
              ],
              hint:
                'Two ideas: reasoning across the detection-and-response arc, and a core defensive ' +
                'habit of thought such as assume-breach, baselines, or detecting behaviour.',
            },
          ],
          debrief:
            'That is the pathway in one thought: assume breach, know your normal, detect behaviour, ' +
            'and never forget the asymmetry. The adversarial practice ahead is where you sharpen it ' +
            'against a live opponent.',
          practice: [],
        },
      ],
    },
  ],
};
