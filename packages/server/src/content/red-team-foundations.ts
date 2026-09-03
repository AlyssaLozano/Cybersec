/**
 * Red Team Foundations: the methodology, taught as small graded pieces.
 *
 * WHAT THIS PACKAGE IS, AND IS NOT
 *
 * It teaches how an authorised assessment is reasoned about -- what recon is,
 * what leaves a trace, how to read what you find, and where the legal edges are.
 * It is NOT a set of exploits. Every exercise grades a determination or a piece
 * of knowledge, the same way the defensive packages do, because the skill a
 * junior red teamer is missing is judgement, not payloads.
 *
 * It is also the ground floor under the war-room match mode: a student learns
 * the methodology here, then tests it head to head there. Where a match asks
 * "what is your move", this asks "why would that be the move".
 *
 * HOUSE RULES THAT BITE HERE ESPECIALLY
 *
 * Every address in a worked scan is an RFC 5737 documentation range and every
 * name is a `.example` domain, so nothing a student pictures running could reach
 * a real host. And the very first thing taught is authorisation, because the
 * only thing separating this material from a crime is a signed scope.
 */

import type { LearningPackage } from '@soc/shared';

const SCOPE_TEACH = {
  concept:
    'Picture two people trying every door and window on a house to see which ones open. One was ' +
    'hired by the homeowner, who signed a letter saying "test my locks, here is which doors you ' +
    'may try, and call me the moment you find a way in." The other was not hired by anyone. From ' +
    'the street, at the exact moment either one is jiggling a doorknob, they look identical. What ' +
    'separates them, entirely, is that letter.\n\n' +
    'That is the whole idea behind an authorised security assessment, often called a penetration ' +
    'test or a red team engagement. A company pays a tester to attack its own systems the way a ' +
    'real attacker would, probing for open doors, weak locks, and forgotten windows, so the ' +
    'company can fix them before someone with bad intentions finds them first. The tester uses the ' +
    'same tools and the same techniques a criminal would use. Nothing about the technical work ' +
    'marks it as legitimate.\n\n' +
    'What makes it legitimate is AUTHORISATION: written permission, signed by someone at the ' +
    'company who actually has the standing to grant it, not just any employee who happens to say ' +
    'yes. Paired with it is SCOPE, the precise list of which systems, addresses, and methods are ' +
    'fair game and which are off limits. A scope might say "you may test these three web servers, ' +
    'you may not touch payroll, and you may not use methods that could crash anything." Without ' +
    'both of these in writing before a single action is taken, there is no assessment, only an ' +
    'unauthorised intrusion that happens to be technically identical to one.\n\n' +
    'This is worth internalising before any of the technical material in this package, because ' +
    'nothing that follows changes it. Finding a serious flaw does not retroactively excuse going ' +
    'outside the agreed scope to prove it, the same way discovering a house\'s back door was ' +
    'unlocked does not excuse a locksmith walking in through a window they were never asked to ' +
    'test. Every exercise in this package assumes that paperwork already exists, because it is the ' +
    'one thing that turns hacking into a job.',
} as const;

const RECON_TEACH = {
  concept:
    'Before a burglar ever touches a house, they learn about it: they might walk past and notice ' +
    'which windows are lit at night, ask a neighbour an offhand question, or read the estate ' +
    'listing that describes the layout. None of that requires touching the house itself, and the ' +
    'owner has no way of knowing anyone was looking. RECONNAISSANCE, or recon, is the same idea ' +
    'applied to a target\'s computer systems: gathering information before doing anything that ' +
    'could be noticed.\n\n' +
    'Recon comes in two forms that matter enormously for how safe it is. PASSIVE recon draws only ' +
    'on information that already exists somewhere public or semi-public: the company\'s own ' +
    'website, WHOIS registries (public records of who owns a domain name), certificate ' +
    'transparency logs (public records of the security certificates a company has requested), and ' +
    'job postings that describe what software a company runs. None of these require sending so ' +
    'much as a single packet, a small unit of data travelling across a network, to the target\'s ' +
    'own systems, so nothing the target owns ever records that anyone looked.\n\n' +
    'ACTIVE recon is different: it means directly touching the target\'s own systems, for example ' +
    'by sending a request to one of their servers to see how it responds. The moment you do that, ' +
    'you have left a trace, because a well-run system logs its connections. That log entry can be ' +
    'read, matched against other entries, and turned into an alert that tells the defenders someone ' +
    'is looking at them. Nothing about this makes active recon wrong; an assessment needs it ' +
    'eventually. But it spends something passive recon does not: the target\'s ignorance that anyone ' +
    'is interested in them at all, which is exactly what the next exercises are about spending as ' +
    'slowly and deliberately as possible.',
} as const;

const OPSEC_TEACH = {
  concept:
    'Think about the difference between someone who tries the handle of one door on their way past, ' +
    'and someone who runs down an entire street rattling every handle on every house in under a ' +
    'minute. Both are "checking whether doors are locked," but only one of them looks, to anyone ' +
    'glancing out a window, like something is wrong. That difference, how much you touch and how ' +
    'fast, is most of what separates a scan nobody notices from one that sets off every alarm in ' +
    'the building.\n\n' +
    'On a computer network, the same principle governs DETECTION, the process by which a defender ' +
    'notices that something suspicious is happening. Security tools are typically tuned to notice ' +
    'patterns: many connection attempts landing on many different services in a short window is ' +
    'exactly the shape of an automated scanning tool, and it is one of the easiest patterns to ' +
    'write an automatic alert for. A single, slow, narrow probe against one thing looks, by ' +
    'contrast, almost indistinguishable from the ordinary background noise of a busy network. And ' +
    'a lookup against a source the target does not even control, like a public registry, generates ' +
    'no traffic on the target\'s own systems at all, so there is nothing there to notice.\n\n' +
    'OPERATIONAL SECURITY, or opsec, is the discipline built on this fact: always reach for the ' +
    'quietest method that still answers the question you are asking, and only escalate to ' +
    'something louder once the quiet methods run out. It is not about being clever, it is about ' +
    'restraint, asking every single time "is there a way to learn this that touches the target ' +
    'less?" before touching it at all. For someone testing a system\'s defences this is ' +
    'professional discipline; for a defender reading this material, the mirror image matters just ' +
    'as much, because it explains exactly what a detection tool is built to watch for, and why.',
} as const;

const READ_TEACH = {
  concept:
    'Imagine a home inspector handed a list of every door, window, and appliance in a house, each ' +
    'with its age and condition noted. A brand-new, correctly installed front door is not the ' +
    'finding that matters, even though it is the most obvious way in or out of the house. What ' +
    'matters is the window round the back with a broken latch that nobody thought to check, ' +
    'because that is the one thing on the list that is actually a weakness right now.\n\n' +
    'A network SCAN produces the same kind of list: a tool tests a target\'s systems and reports ' +
    'what it finds open and responding, usually including the specific software and version ' +
    'running behind each one. Reading that list well means resisting the pull toward whichever ' +
    'line sounds the most dramatic or the most familiar, and instead comparing every line on the ' +
    'same three questions: is the version out of date, is the thing reachable from somewhere it ' +
    'should not be, and is the access it offers weakly protected. The finding that answers yes to ' +
    'more than one of those is the real vector, almost regardless of how ordinary or exciting its ' +
    'name sounds.\n\n' +
    'This matters because the instinct to chase the scariest-sounding service is exactly the ' +
    'instinct an attacker, and a tester standing in for one, has to train out of themselves. A ' +
    'service that is fully patched and configured correctly is, by definition, not currently a ' +
    'weakness, no matter how sensitive the data behind it is, and time spent attacking it is time ' +
    'wasted. The promising vector is almost never the loudest name on the list. It is the quiet ' +
    'line where an old version, an exposed surface, and weak protection all happen to line up at ' +
    'once.',
} as const;

export const RED_TEAM_FOUNDATIONS: LearningPackage = {
  id: 'red-team-foundations',
  order: 8,
  title: 'Red Team Foundations',
  summary:
    'The offensive methodology a junior tester is missing: reconnaissance, reading what you find, ' +
    'staying quiet, and the legal edges that separate an assessment from an intrusion.',
  outcomes: [
    'Tell passive reconnaissance from active, and know what each one costs.',
    'Read a scan result and justify which finding is the vector worth pursuing.',
    'Reason about detection: which action is loud, which is silent, and why.',
    'State what authorisation and scope must be in place before any testing begins.',
  ],
  prerequisites: ['linux-fundamentals'],
  modules: [
    {
      id: 'rtf.1',
      packageId: 'red-team-foundations',
      order: 1,
      title: 'Reconnaissance and scope',
      summary:
        'Where an assessment starts: permission, then the quiet gathering of everything public, ' +
        'then a careful read of what the target actually exposes.',
      exercises: [
        {
          id: 'rtf.1.1',
          moduleId: 'rtf.1',
          packageId: 'red-team-foundations',
          order: 1,
          title: 'Before the first packet',
          kind: 'multiple-choice',
          goal: 'Know what must be in place before any testing begins.',
          prompt:
            'You have been asked to assess Northwind Logistics. Which of the following must be in ' +
            'place before you begin? Select all that apply.',
          teach: SCOPE_TEACH,
          options: [
            { id: 'a', label: 'Written authorisation from someone empowered to grant it.' },
            { id: 'b', label: 'A defined scope: which systems, addresses, and methods are in and out of bounds.' },
            { id: 'c', label: 'An agreed timeframe and a named point of contact for the engagement.' },
            { id: 'd', label: 'Confirmation that the blue team has not been told, so the test is fair.' },
            { id: 'e', label: 'Rules of engagement you can produce if somebody challenges what you are doing.' },
          ],
          hints: [
            'Four of these are things you must be able to point to. One is a choice about how the engagement runs, not a requirement.',
            'Whether the defenders know is a decision the client makes. It never replaces permission, and a test can be authorised and announced at once.',
            'Everything that protects you legally is a document you could show a lawyer. Keeping the blue team in the dark protects nobody.',
          ],
          solution:
            'A, B, C, and E. Authorisation, scope, a timeframe with a contact, and rules of ' +
            'engagement are the paperwork that makes the work lawful and bounded. D is wrong: ' +
            'whether the blue team (the organisation\'s own defenders, the people who would respond ' +
            'to a real intrusion) is told in advance is a property of the engagement, a covert test ' +
            'versus an announced one, not a precondition, and secrecy is never a substitute for ' +
            'authorisation.',
          expectedOutput: 'Options A, B, C, and E selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'e'],
              hint:
                'One option describes keeping the defenders in the dark. That is a choice about the ' +
                'engagement, not a thing that has to be true before you start.',
            },
          ],
          debrief:
            'The difference between a red teamer and an intruder is a signed scope and a phone ' +
            'number to call. Everything technical in this package assumes that paperwork already ' +
            'exists.',
          practice: [],
        },
        {
          id: 'rtf.1.2',
          moduleId: 'rtf.1',
          packageId: 'red-team-foundations',
          order: 2,
          title: 'Passive or active',
          kind: 'multiple-choice',
          goal: 'Tell the recon that touches the target from the recon that does not.',
          prompt:
            'Which of these actions can be performed WITHOUT sending a single packet to ' +
            'Northwind\'s own systems? Select all that apply.',
          teach: RECON_TEACH,
          options: [
            { id: 'a', label: 'Reading their public website and staff pages.' },
            { id: 'b', label: 'Looking up their domain registration with WHOIS.' },
            { id: 'c', label: 'Requesting the web server\'s banner to read its version.' },
            { id: 'd', label: 'Enumerating subdomains from public certificate transparency logs.' },
            { id: 'e', label: 'Running a port scan across 203.0.113.0/24.' },
          ],
          hints: [
            'Ask, for each one, whose machine actually receives your request.',
            'A WHOIS query hits a registry, and a CT log is a public archive. Neither is the target.',
            'A banner grab and a port scan both send packets to Northwind\'s hosts. The other three never do.',
          ],
          solution:
            'A, B, and D. The website is served publicly, WHOIS queries a registry rather than the ' +
            'target, and certificate transparency logs are a public archive. C and E both send ' +
            'packets to Northwind\'s own hosts, so they are active and can be logged there.',
          expectedOutput: 'Options A, B, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'd'],
              hint:
                'Two of these five put packets on the target\'s wire. The rest read sources the ' +
                'target does not control and cannot see you read.',
            },
          ],
          debrief:
            'Passive recon is free in the currency that matters most early on: it costs you no ' +
            'exposure. A great deal can be built before the target has any way of knowing anyone ' +
            'is looking.',
          practice: [],
        },
        {
          id: 'rtf.1.3',
          moduleId: 'rtf.1',
          packageId: 'red-team-foundations',
          order: 3,
          title: 'Why passive comes first',
          kind: 'short-answer',
          goal: 'Put the reason for sequencing recon into your own words.',
          prompt:
            'In two or three sentences, explain why a tester exhausts passive reconnaissance ' +
            'before running active scans. Name what active scanning risks that passive does not.',
          teach: OPSEC_TEACH,
          hints: [
            'The two phases differ in one thing above all: whether the target can tell you were there.',
            'Passive work leaves nothing in the target\'s logs. Active work leaves a trace that can be seen and acted on.',
            'Your answer needs the ordering (passive first) and the cost of going active (being detected).',
          ],
          solution:
            'Passive recon touches only public sources, so it leaves no trace in the target\'s ' +
            'logs and cannot be detected. Active scanning sends packets to the target, which can ' +
            'be logged, correlated, and alerted on, so it spends the one thing you cannot get ' +
            'back: surprise. Doing passive work first means you go active already knowing where to ' +
            'look, so you make the fewest, quietest touches you can.',
          expectedOutput:
            'An answer naming that active scanning can be detected or logged, and that passive ' +
            'work comes first because it leaves no trace.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['detect', 'trace', 'log', 'alert', 'noticed', 'noise', 'seen'],
                ['passive', 'public', 'before', 'first', 'without touching', 'no packet'],
              ],
              hint:
                'Two ideas have to be in there: that active scanning can be noticed or logged, and ' +
                'that passive recon comes first because it leaves no trace.',
            },
          ],
          debrief:
            'This is the whole discipline in one sentence: learn everything you can for free, so ' +
            'that when you finally do spend exposure, you spend as little of it as possible.',
          practice: [],
        },
        {
          id: 'rtf.1.4',
          moduleId: 'rtf.1',
          packageId: 'red-team-foundations',
          order: 4,
          title: 'Read the scan',
          kind: 'multiple-choice',
          goal: 'Pick the vector from evidence, not from which service looks scariest.',
          prompt:
            'An authorised scan of Northwind returns:\n\n' +
            '  203.0.113.10  22/tcp    open  ssh    OpenSSH 9.6 (current)\n' +
            '  203.0.113.10  443/tcp   open  https  nginx 1.24 (patched)\n' +
            '  203.0.113.10  8080/tcp  open  http   Apache Tomcat 8.5.0, /manager reachable\n' +
            '  203.0.113.44  443/tcp   open  https  VPN portal (current build)\n\n' +
            'Which finding is the most promising vector for initial access, and why?',
          teach: READ_TEACH,
          options: [
            { id: 'a', label: 'Port 22, because SSH is always worth brute forcing.' },
            { id: 'b', label: 'Port 443 on nginx, because the web app is the main attack surface.' },
            { id: 'c', label: 'Port 8080: an old Tomcat with its manager console reachable is a known path to code execution.' },
            { id: 'd', label: 'The VPN portal, because a VPN is the easiest way into any network.' },
          ],
          hints: [
            'Three of these four are current or patched. Look for the one that is neither.',
            'A brute force against a current OpenSSH is loud and slow, and the nginx and VPN are up to date.',
            'An outdated application server with its administrative console exposed is the textbook combination: old version, plus a surface that should never be reachable.',
          ],
          solution:
            'C. Tomcat 8.5.0 is years out of date, and a reachable /manager console is an ' +
            'administrative surface that should never be exposed; together they are a well-known ' +
            'route to running code. The SSH, nginx, and VPN entries are all current or patched, so ' +
            'they are the worst places to spend effort. The vector is where an old version meets an ' +
            'exposed surface, not the port that sounds most dangerous.',
          expectedOutput: 'Option C selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['c'],
              hint:
                'Compare the version and exposure of each line. One host is running an old ' +
                'application server with an admin console reachable from outside.',
            },
          ],
          debrief:
            'This is the determination the war-room recon scenario is built around: the same list ' +
            'of services, and the skill is seeing which one the evidence points at.',
          practice: [],
        },
        {
          id: 'rtf.1.5',
          moduleId: 'rtf.1',
          packageId: 'red-team-foundations',
          order: 5,
          title: 'Which move is loudest',
          kind: 'multiple-choice',
          goal: 'Rank actions by how likely they are to be noticed.',
          prompt:
            'You want to confirm which services run on 203.0.113.10 while staying as quiet as ' +
            'possible. Which single action is MOST likely to trigger an alert?',
          teach: OPSEC_TEACH,
          options: [
            { id: 'a', label: 'Pulling the site\'s TLS certificate from a public transparency log.' },
            { id: 'b', label: 'A full, fast port sweep of the entire 203.0.113.0/24 range.' },
            { id: 'c', label: 'Reading a job posting that names their web stack.' },
            { id: 'd', label: 'A WHOIS lookup on the northwind.example domain.' },
          ],
          hints: [
            'Three of these touch the target not at all. One puts packets on many of its hosts at once.',
            'Detection scales with how much you touch and how fast. A broad, fast sweep is the loudest thing here.',
            'The certificate log, the job post, and the WHOIS lookup are all public sources. The sweep is the only active option.',
          ],
          solution:
            'B. A fast sweep across a whole /24 lands on many hosts in seconds, which is a textbook ' +
            'IDS signature. The other three read public sources and never touch Northwind, so they ' +
            'raise nothing at all.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint:
                'Only one of these sends packets to the target, and it sends a great many, very ' +
                'fast, across the whole range.',
            },
          ],
          debrief:
            'Loud is not the same as effective. The sweep would tell you the most and cost you the ' +
            'most, and a careful tester reaches for it last, if at all.',
          practice: [],
        },
        {
          id: 'rtf.1.6',
          moduleId: 'rtf.1',
          packageId: 'red-team-foundations',
          order: 6,
          title: 'Out of scope',
          kind: 'multiple-choice',
          goal: 'Hold the line the scope draws, even when something interesting is on the other side.',
          prompt:
            'Mid-engagement you find that 203.0.113.90 responds, but it is not listed in your ' +
            'agreed scope. What is the correct action?',
          teach: SCOPE_TEACH,
          options: [
            { id: 'a', label: 'Test it anyway. If it responds on their range, it is fair game.' },
            { id: 'b', label: 'Stop, record it, and check with your point of contact before touching it.' },
            { id: 'c', label: 'Ignore it entirely and never mention it.' },
            { id: 'd', label: 'Exploit it quietly so nobody knows you went outside the scope.' },
          ],
          hints: [
            'The scope is a legal boundary, not a suggestion, and this host is outside it.',
            'Two options touch the host, which you are not cleared to do. One buries a real finding.',
            'The right move both respects the boundary and still gets the finding in front of the client.',
          ],
          solution:
            'B. The scope is the limit of what you are authorised to touch, so an unlisted host is ' +
            'off limits until your contact says otherwise. Testing it (A or D) is unauthorised ' +
            'access regardless of whose range it is on, and ignoring it (C) hides something the ' +
            'client needs to know. Stopping, recording it, and asking is the only option that is ' +
            'both lawful and useful.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint:
                'You are not cleared to touch this host, and you should not bury the fact that it ' +
                'is reachable. One option does both of those right.',
            },
          ],
          debrief:
            'An out-of-scope host that responds is itself a finding worth reporting. Going in ' +
            'without asking turns a good catch into a breach of your own contract.',
          practice: [],
        },
      ],
    },
    {
      id: 'rtf.2',
      packageId: 'red-team-foundations',
      order: 2,
      title: 'The attack lifecycle and the attacker mindset',
      summary:
        'The map every engagement follows, phase by phase, and the habit of thought that makes ' +
        'a tester see a system the way whoever attacks it will.',
      exercises: [
        {
          id: 'rtf.2.1',
          moduleId: 'rtf.2',
          packageId: 'red-team-foundations',
          order: 1,
          title: 'Red team, pentest, or scan',
          kind: 'multiple-choice',
          goal: 'Tell three kinds of security work apart by their goal, not their tools.',
          prompt:
            'A client says they want "a red team engagement." Which description actually matches ' +
            'red teaming, as opposed to a penetration test or a vulnerability scan?',
          teach: {
            concept:
              'Offensive security work is not one job, it is several, and they get lumped together ' +
              'in casual conversation because they all involve someone deliberately attacking a ' +
              'system. Think of it the way a building\'s safety could be tested at three different ' +
              'depths: a checklist inspector who walks every floor with a clipboard and flags ' +
              'anything that does not meet code, a specialist hired to actually try to pick one ' +
              'specific lock and prove whether it can be defeated, and an actor hired to try to steal ' +
              'a particular file from the safe without the building\'s own security guards catching ' +
              'them. All three make the building safer. They are not the same job.\n\n' +
              'A VULNERABILITY SCAN is the checklist inspector: automated software checks many ' +
              'systems at once against a database of known flaws and hands back a list of what it ' +
              'found, fast and broad but shallow. A PENETRATION TEST, or pentest, is the lock ' +
              'specialist: a human tester is pointed at one defined target and actually tries to ' +
              'exploit the flaws in it, proving which ones are real rather than just theoretically ' +
              'possible. A RED TEAM engagement is the broadest and quietest of the three. It picks an ' +
              'objective a real adversary would actually want, reach the payroll database, prove you ' +
              'could stop the production line, and pursues it across people, process, and technology ' +
              'together, while the organisation\'s own defenders (the "blue team") are meant to try to ' +
              'notice and stop it, exactly as they would a real attack.\n\n' +
              'The distinction is not snobbery, it is scope and success criteria. A scan succeeds by ' +
              'listing flaws; a pentest succeeds by proving which flaws are exploitable; a red team ' +
              'engagement succeeds by testing whether the organisation can detect and respond to a ' +
              'determined attacker heading somewhere specific, regardless of which flaw got them in. ' +
              'That is why a red team report talks about dwell time (how long the attacker went ' +
              'unnoticed) and missed alerts as much as it talks about the technical flaw itself. ' +
              'Knowing which one you have been hired to do sets everything else: how loud you can be, ' +
              'what counts as done, and who is allowed to know you are there.',
          },
          options: [
            { id: 'a', label: 'Automated tooling scans the whole estate and produces a ranked list of known vulnerabilities.' },
            { id: 'b', label: 'A tester is pointed at one web application and told to exploit whatever they can find in it.' },
            { id: 'c', label: 'An objective a real adversary would pursue is chased across people and systems while defenders try to detect it.' },
            { id: 'd', label: 'A consultant reviews configuration files and policies and writes up where they fall short of a standard.' },
          ],
          hints: [
            'Two of these describe finding flaws; one describes an audit. Only one is defined by an adversary-style objective and a defending team.',
            'The word that separates red teaming is "objective". A scan and a pentest find weaknesses; a red team is trying to get somewhere.',
            'Look for the option where detection and response are part of what is being tested, not just the vulnerabilities.',
          ],
          solution:
            'C. Red teaming is defined by an adversarial objective pursued across the whole ' +
            'organisation while the defenders are live and meant to respond. A is a vulnerability ' +
            'scan (automated breadth), B is a penetration test (human depth against one target), and ' +
            'D is a configuration or policy audit. All are useful; only C tests whether the ' +
            'organisation can catch a real attacker.',
          expectedOutput: 'Option C selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['c'],
              hint:
                'Ask which option is measured by whether the defenders noticed, not just by how many ' +
                'flaws turned up.',
            },
          ],
          debrief:
            'Getting this wrong at the sales stage wastes an engagement: a client who wanted a scan ' +
            'and paid for a red team, or the reverse, gets a report that answers a question they did ' +
            'not ask.',
          practice: [],
        },
        {
          id: 'rtf.2.2',
          moduleId: 'rtf.2',
          packageId: 'red-team-foundations',
          order: 2,
          title: 'Name the phase',
          kind: 'multiple-choice',
          goal: 'Place a concrete action in the right phase of the attack lifecycle.',
          prompt:
            'A tester has a foothold on one workstation. They harvest a stored password and use it ' +
            'to log in to a file server they could not reach before. Which phase of the attack ' +
            'lifecycle is this?',
          teach: {
            concept:
              'A break-in, whether it is a burglar in a house or an attacker on a network, is not ' +
              'one action, it is a sequence of them, and each step in that sequence only becomes ' +
              'possible because of the step before it. A burglar cannot ransack a bedroom before ' +
              'they have gotten through the front door, and they cannot keep coming back next week ' +
              'unless they have arranged some way back in, a copied key, an unlocked window left ' +
              'ajar. Computer intrusions follow the same logic, and security professionals have ' +
              'named the recurring steps so that everyone can talk about them precisely: this is the ' +
              'ATTACK LIFECYCLE.\n\n' +
              'Almost every intrusion, criminal or authorised, moves through the same phases: ' +
              'reconnaissance (learning about the target), initial access (getting in the first ' +
              'time), execution (running something once inside), persistence (arranging to get back ' +
              'in without repeating initial access), privilege escalation (gaining more rights on a ' +
              'system you are already on), lateral movement (using access on one system to reach a ' +
              'different one), collection and exfiltration (gathering and removing data), and finally ' +
              'impact (the actual harm done), with evasion (staying unnoticed) running alongside all ' +
              'of them. The exact names differ a little between frameworks, but the shape does not, ' +
              'because each phase genuinely depends on the one before it: you cannot move laterally ' +
              'until you have a foothold, and you cannot keep a foothold worth having until you have ' +
              'some form of persistence.\n\n' +
              'The reason to memorise the sequence is not tidiness, it is that the phase you are in ' +
              'tells you what is actually being attempted right now and what evidence it is about to ' +
              'generate. Lateral movement, using access on one system to reach another, looks ' +
              'different in a defender\'s logs from privilege escalation, which is climbing from a ' +
              'low-rights account to an administrative one on the same system. A tester, or a ' +
              'defender reading a timeline, who cannot name the phase they are looking at cannot ' +
              'reason about either the next move or how exposed it will be.',
          },
          options: [
            { id: 'a', label: 'Privilege escalation: they gained more rights than they started with.' },
            { id: 'b', label: 'Lateral movement: they used access on one system to reach another.' },
            { id: 'c', label: 'Initial access: they logged in to a server.' },
            { id: 'd', label: 'Persistence: they saved a password for later.' },
          ],
          hints: [
            'Ask what changed: did they get more power on the same machine, or reach a new machine?',
            'Escalation is climbing higher on one host. Movement is stepping sideways to another host.',
            'They started on a workstation and are now on a file server. That is a new machine, reached with credentials they collected.',
          ],
          solution:
            'B. Reusing credentials found on one host to authenticate to another host is the ' +
            'textbook definition of lateral movement. It is not privilege escalation (that would be ' +
            'gaining more rights on the same machine), not initial access (that already happened when ' +
            'they got the foothold), and not persistence (saving the password is incidental; the act ' +
            'graded here is the move to a new system).',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint:
                'The key fact is that they reached a server they could not reach before, using ' +
                'credentials from the first machine.',
            },
          ],
          debrief:
            'Blue teams hunt for exactly this move: a valid account suddenly authenticating from a ' +
            'machine it never uses. Naming the phase is the first step to reasoning about how loud it ' +
            'is.',
          practice: [],
        },
        {
          id: 'rtf.2.3',
          moduleId: 'rtf.2',
          packageId: 'red-team-foundations',
          order: 3,
          title: 'What is the attack surface',
          kind: 'short-answer',
          goal: 'Put the idea of attack surface into your own words and give an example.',
          prompt:
            'In two or three sentences, explain what an "attack surface" is and give one concrete ' +
            'example of something that enlarges it. Write it so a non-technical manager would ' +
            'understand.',
          teach: {
            concept:
              'Picture a large building with a single locked front door, a dozen windows, a loading ' +
              'dock round the back, a fire escape, and a vent nobody has thought about in years. Each ' +
              'of those is a place a burglar could try, whether or not it is actually weak. The ' +
              'ATTACK SURFACE is exactly that idea applied to an organisation\'s computer systems: the ' +
              'sum of every point where an attacker could attempt to get in or get data out, every ' +
              'open port (a numbered channel a service listens on for connections), every login page, ' +
              'every employee who can be phoned or emailed, every third-party integration, every ' +
              'forgotten test server nobody remembers is still running. Thinking in terms of surface ' +
              'rather than individual bugs is the shift that turns someone who just runs a tool into ' +
              'an actual tester. Any single vulnerability is a door; the attack surface is the whole ' +
              'perimeter, including the doors nobody remembers building.\n\n' +
              'The reason this matters is that surface tends to grow silently. A team stands up a ' +
              'quick demo server, a marketing site adds a new form, a contractor is given VPN access ' +
              'for a project that ended a year ago. None of these is a vulnerability by itself, but ' +
              'each one is a new place to be attacked, and the ones nobody is watching are the ones ' +
              'worth the most to an attacker. The attacker mindset is simply the discipline of ' +
              'counting all of these, especially the ones the organisation has forgotten it owns.',
          },
          hints: [
            'Do not define it as "vulnerabilities". A surface is every place an attack could be attempted, whether or not it is currently exploitable.',
            'A good answer names that it is the set of all entry and exit points, and gives an example that adds one.',
            'Examples that enlarge it: a new public server, a new employee, a new integration, an exposed API, a forgotten account.',
          ],
          solution:
            'The attack surface is every point where someone could attempt to get in or get data ' +
            'out -- open ports, login pages, staff who can be tricked, connected third parties, and ' +
            'so on. It grows whenever the organisation adds one of those: spinning up a new ' +
            'internet-facing server, for instance, adds a fresh set of ports and services an attacker ' +
            'can probe. The point of the term is to count the whole perimeter, not just the flaws you ' +
            'already know about.',
          expectedOutput:
            'An answer describing the attack surface as the set of all points that could be ' +
            'attacked (entry or exit), plus a concrete example that enlarges it.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['entry', 'point', 'access', 'get in', 'exposed', 'perimeter', 'way in', 'reach'],
                ['new', 'add', 'server', 'account', 'employee', 'integration', 'api', 'service', 'port', 'more'],
              ],
              hint:
                'Two ideas: that it is the set of points that could be attacked, and a concrete ' +
                'example of something that adds to it.',
            },
          ],
          debrief:
            'Every phase later in this package is really about the attack surface: recon maps it, ' +
            'initial access exploits a point on it, and defenders spend their careers trying to ' +
            'shrink it.',
          practice: [],
        },
        {
          id: 'rtf.2.4',
          moduleId: 'rtf.2',
          packageId: 'red-team-foundations',
          order: 4,
          title: 'TTPs and IOCs',
          kind: 'multiple-choice',
          goal: 'Tell an attacker behaviour from a piece of forensic evidence.',
          prompt:
            'A threat report contains both of these lines. Which one is an indicator of compromise ' +
            '(IOC) rather than a technique, tactic, or procedure (TTP)?',
          teach: {
            concept:
              'If police were tracking a burglar, they would keep two very different kinds of notes. ' +
              'One is about habits: this person always enters through a back window, always works ' +
              'between two and four in the morning, always avoids houses with dogs. The other is ' +
              'about physical evidence from a specific break-in: a particular shoe print, a ' +
              'fingerprint, a tool mark on a windowsill. The habits describe how the person operates. ' +
              'The evidence describes what one specific crime left behind. Threat reports about ' +
              'computer intrusions keep the same two kinds of notes, and give each one an acronym.\n\n' +
              'TTPs, techniques, tactics, and procedures, describe how an adversary behaves: they ' +
              'phish finance staff, they use stolen credentials rather than malware, they exfiltrate ' +
              'slowly over DNS (the system that turns website names into addresses, covered properly ' +
              'in the networking package). IOCs, indicators of compromise, are the concrete artefacts ' +
              'one specific intrusion leaves behind: a file\'s hash (a short fingerprint computed from ' +
              'its exact contents), a particular attacker address, a registry key, a filename. The ' +
              'difference is behaviour versus evidence.\n\n' +
              'It matters because the two age very differently. An IOC is cheap for an attacker to ' +
              'change: a new build has a new hash, a new domain is a few dollars, so blocking ' +
              'yesterday\'s IOCs stops yesterday\'s attacker and no one else. TTPs are expensive to ' +
              'change because they reflect how a group actually works, so a defender who understands ' +
              'an adversary\'s TTPs can catch them even after every IOC has rotated. For a red teamer ' +
              'the lesson is symmetric: varying your IOCs is easy and worth little, while your TTPs ' +
              'are your signature, and blending those into normal behaviour is what real evasion ' +
              'costs.',
          },
          options: [
            { id: 'a', label: 'The group typically gains access by phishing employees in the finance department.' },
            { id: 'b', label: 'Outbound connections were seen to 198.51.100.23 on port 8443.' },
            { id: 'c', label: 'They prefer to use stolen valid credentials rather than deploy malware.' },
            { id: 'd', label: 'They exfiltrate data slowly, in small chunks, to stay under volume alerts.' },
          ],
          hints: [
            'Three of these describe how the group behaves. One is a specific artefact you could paste into a blocklist.',
            'An IOC is a concrete piece of evidence: an address, a hash, a filename. A TTP is a pattern of behaviour.',
            'Which line could you literally add to a firewall rule today?',
          ],
          solution:
            'B. A specific outbound address and port is a concrete artefact -- an indicator of ' +
            'compromise -- that you could block directly, and that the attacker could trivially ' +
            'change tomorrow. A, C, and D all describe how the group operates: those are TTPs, which ' +
            'are far more expensive for the attacker to alter and therefore far more valuable to a ' +
            'defender.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint:
                'Only one option is a specific value you could copy into a blocklist. The rest ' +
                'describe patterns of behaviour.',
            },
          ],
          debrief:
            'This is why mature detection is written against TTPs, not IOC lists: an attacker who ' +
            'rotates infrastructure defeats an IOC feed but not a rule that understands how they ' +
            'move.',
          practice: [],
        },
        {
          id: 'rtf.2.5',
          moduleId: 'rtf.2',
          packageId: 'red-team-foundations',
          order: 5,
          title: 'Map an intrusion to its phases',
          kind: 'short-answer',
          goal: 'Apply the lifecycle to a described intrusion.',
          prompt:
            'A tester phished an employee to steal a password, logged in to that user\'s account, ' +
            'installed a scheduled task so their access would survive a reboot, and then used the ' +
            'account to reach a database server. In two or three sentences, name the lifecycle phase ' +
            'for each of those four actions, in order.',
          teach: {
            concept:
              'The previous exercises named the phases of an attack lifecycle one at a time. The ' +
              'real skill is applying those names to a messy, real story: given a description of what ' +
              'someone actually did, breaking it back down into the individual phases it was built ' +
              'from. A real intrusion is a chain, and reading it back as a sequence of phases is the ' +
              'single most useful analytic habit in this field. Both attackers and defenders do it: ' +
              'the attacker plans forward through the phases, and the responder reconstructs them ' +
              'backward from the evidence. When you can look at four actions and label each one -- ' +
              'this was initial access, this was persistence -- you can see the whole story, and you ' +
              'can see the gaps where a defender might have cut the chain.\n\n' +
              'The value of the exercise is in the seams between phases. Phishing to steal a password ' +
              'is not the same act as using that password, even though they happen minutes apart; the ' +
              'first is how you get the credential, the second is initial access with it. A scheduled ' +
              'task that survives reboot is persistence, a category of its own, distinct from the ' +
              'lateral move to the database that follows. Forcing yourself to draw those lines is how ' +
              'you learn that an intrusion is never one event but a series, each of which was a chance ' +
              'to be stopped.',
          },
          hints: [
            'There are four actions and four labels. Work through them in the order they happened.',
            'Stealing and then using a credential are two different phases: gathering it, then getting in with it.',
            'The four phases here are, in order: reconnaissance or credential access, initial access, persistence, and lateral movement.',
          ],
          solution:
            'Phishing to steal the password is credential access (the reconnaissance-and-gathering ' +
            'end of the chain). Logging in with it is initial access. Installing the scheduled task ' +
            'to survive a reboot is persistence. Using the account to reach the database server is ' +
            'lateral movement. Named in order: credential access, initial access, persistence, ' +
            'lateral movement.',
          expectedOutput:
            'An answer naming initial access for the login, persistence for the scheduled task, and ' +
            'lateral movement for reaching the database, in order.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['initial access', 'foothold', 'get in', 'logged in', 'first access'],
                ['persist', 'scheduled task', 'survive', 'reboot', 'maintain', 'stay'],
                ['lateral', 'move', 'reach', 'pivot', 'another', 'database server'],
              ],
              hint:
                'Your answer needs at least three of the phases named: the login as initial access, ' +
                'the scheduled task as persistence, and reaching the database as lateral movement.',
            },
          ],
          debrief:
            'Every one of those four steps was a place the defender could have broken the chain. ' +
            'That is the mindset the whole pathway builds toward: seeing the intrusion as a sequence ' +
            'of stoppable moments.',
          practice: [],
        },
      ],
    },
    {
      id: 'rtf.3',
      packageId: 'red-team-foundations',
      order: 3,
      title: 'Threat modelling and attack strategy',
      summary:
        'Before touching anything, an attacker decides what is worth taking and how they would take ' +
        'it. This module builds that planning discipline: assets, actors, paths, and the difference ' +
        'between a strategy and a tactic.',
      exercises: [
        {
          id: 'rtf.3.1',
          moduleId: 'rtf.3',
          packageId: 'red-team-foundations',
          order: 1,
          title: 'The pieces of a threat model',
          kind: 'multiple-choice',
          goal: 'Identify what a threat model must account for.',
          prompt:
            'You are building a threat model for Northwind\'s customer database. Which of the ' +
            'following belong in it? Select all that apply.',
          teach: {
            concept:
              'Before spending money on locks, cameras, and guards, a sensible business owner asks ' +
              'four questions first: what am I actually protecting, who would want it, how might they ' +
              'try to get it, and what would it cost me if they succeeded. Skipping straight to ' +
              'buying security equipment without answering those questions usually means overspending ' +
              'on the wrong things and underspending on the ones that matter. A THREAT MODEL is the ' +
              'disciplined, written-down version of exactly that thinking, applied to a computer ' +
              'system instead of a building.\n\n' +
              'Formally that breaks into the asset (the thing of value being protected), the threat ' +
              'actors (who might come for it, from bored insiders to organised crime to nation ' +
              'states), their motive and capability (why they want it and what they can actually do), ' +
              'the vulnerabilities and paths available to them, and the impact if they succeed. Skip ' +
              'any one of these and the model lies to you.\n\n' +
              'The discipline exists to stop two opposite mistakes. One is defending everything ' +
              'equally, which spreads effort so thin that the crown jewels are protected no better ' +
              'than the cafeteria menu. The other is fixating on an exciting attack that no plausible ' +
              'actor would ever run against you. A threat model forces you to tie every threat to a ' +
              'real actor with a real motive and a real path, so that effort follows risk. For a red ' +
              'teamer it is the same tool used offensively: it tells you which asset is worth the ' +
              'engagement and which path an actual adversary would take to it.',
          },
          options: [
            { id: 'a', label: 'The asset itself: what the database holds and why it matters.' },
            { id: 'b', label: 'Who would plausibly target it, and what they want from it.' },
            { id: 'c', label: 'The paths by which it could be reached, and the impact if it were.' },
            { id: 'd', label: 'The brand of coffee machine in the office kitchen.' },
            { id: 'e', label: 'What the attacker is capable of: skills, resources, and time.' },
          ],
          hints: [
            'Four of these are the standard components of a threat model. One is noise.',
            'A threat model ties an asset to actors, their motives and capabilities, the paths in, and the impact.',
            'Only one option has nothing to do with who might attack the database or how.',
          ],
          solution:
            'A, B, C, and E. A complete threat model names the asset, the plausible actors and their ' +
            'motives, the actors\' capabilities, the paths to the asset, and the impact of ' +
            'compromise. D is a distractor: the coffee machine is not part of the model for the ' +
            'customer database (and unless it is somehow on the network, it is not much of an asset ' +
            'either).',
          expectedOutput: 'Options A, B, C, and E selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'e'],
              hint:
                'Keep everything that describes the asset, the actors, their capability, the paths, ' +
                'or the impact. Drop the one that is just office furniture.',
            },
          ],
          debrief:
            'Notice that the model never mentions a specific tool. Threat modelling is done before ' +
            'you know which exploit you will use, because its job is to tell you where to point one.',
          practice: [],
        },
        {
          id: 'rtf.3.2',
          moduleId: 'rtf.3',
          packageId: 'red-team-foundations',
          order: 2,
          title: 'The path of least resistance',
          kind: 'multiple-choice',
          goal: 'Choose the attack path a rational adversary would actually take.',
          prompt:
            'Three paths could reach Northwind\'s customer database. Which would a rational attacker ' +
            'most likely try first?\n\n' +
            '  Path A: Find and exploit a zero-day in the database software itself.\n' +
            '  Path B: Phish a support agent who already has read access to the database.\n' +
            '  Path C: Break the AES encryption on last night\'s database backup.',
          teach: {
            concept:
              'A thief planning to steal a painting from a museum has options ranging from tunnelling ' +
              'under the building to simply befriending a guard who already has a key. Movies favour ' +
              'the tunnel. Real thieves favour the guard, because a real attacker is not trying to ' +
              'look impressive, they are trying to succeed at the lowest possible cost and risk. When ' +
              'a threat model lays out several ways to reach the same asset, the attacker does not ' +
              'pick the most impressive one. They pick the cheapest one that works, weighing effort, ' +
              'reliability, and the chance of being caught. A path that needs a zero-day nobody has ' +
              'found yet, or that requires breaking strong modern encryption, is enormously expensive ' +
              'and may simply be impossible. A path that reuses a human being who already has ' +
              'legitimate access is cheap, reliable, and quiet.\n\n' +
              'This is why the human path so often wins. Attackers are not showing off; they are ' +
              'trying to get somewhere at the lowest cost. Modern cryptography, correctly used, is ' +
              'not the weak point, and true zero-days are rare and precious. A support agent with ' +
              'read access, on the other hand, is a person who can be phished on any given Tuesday, ' +
              'and their access is indistinguishable from normal use once the attacker is inside it. ' +
              'The lesson cuts both ways: defenders who pour everything into the technical wall while ' +
              'leaving the people beside it untrained have modelled the wrong threat.',
          },
          options: [
            { id: 'a', label: 'Path A: a zero-day gives the cleanest technical compromise.' },
            { id: 'b', label: 'Path B: phishing a support agent who already has legitimate access.' },
            { id: 'c', label: 'Path C: cracking the backup encryption avoids touching production.' },
            { id: 'd', label: 'None: all three are equally likely, so it is a coin toss.' },
          ],
          hints: [
            'Rank the three by cost and reliability, not by how technically clever they are.',
            'A zero-day may not exist yet, and correctly used AES is not going to break. What does that leave?',
            'One path reuses a person who already has the access the attacker wants. That is almost always the cheapest door.',
          ],
          solution:
            'B. Phishing an agent who already holds read access is cheap, reliable, and hard to ' +
            'distinguish from normal activity, so a rational attacker tries it first. Path A depends ' +
            'on a zero-day that may not exist and would be extremely valuable to burn here; Path C ' +
            'depends on breaking strong encryption, which is not a realistic route. D is wrong: the ' +
            'paths differ enormously in cost, and pretending they are equal is a failure to model.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint:
                'Two paths depend on something rare or near-impossible. One depends on a person ' +
                'clicking a link. Which is cheapest?',
            },
          ],
          debrief:
            'Attackers take the path of least resistance, and the least resistance is usually a ' +
            'human with legitimate access. Half of defensive security is admitting that.',
          practice: [],
        },
        {
          id: 'rtf.3.3',
          moduleId: 'rtf.3',
          packageId: 'red-team-foundations',
          order: 3,
          title: 'Strategy versus tactics',
          kind: 'multiple-choice',
          goal: 'Separate the overall plan from the individual moves that carry it out.',
          prompt:
            'In planning an engagement, which of these is a STRATEGIC decision rather than a ' +
            'tactical one?',
          teach: {
            concept:
              'A general planning a military campaign decides, months ahead, what the war is even ' +
              'trying to achieve, how long the campaign can run, and how much risk the army can ' +
              'afford to take. On the day of a specific battle, an officer decides, in the moment, ' +
              'which hill to take first or which road to send troops down. Both are real decisions, ' +
              'but they are not the same kind of decision, and mixing them up is how campaigns fail. ' +
              'Offensive security testing draws the identical line between STRATEGY and TACTICS.\n\n' +
              'Strategy is the shape of the whole engagement: the objective, the phases, the ' +
              'timeline, how much risk of detection you are willing to accept, and what you will do ' +
              'if the primary plan fails. Tactics are the individual moves that carry the strategy ' +
              'out: which exploit for this service, which pretext for this phone call, whether to ' +
              'scan now or wait an hour. Strategy is decided in advance and rarely changes; tactics ' +
              'are chosen in the moment and change constantly.\n\n' +
              'Confusing the two is a classic junior mistake, and it goes in both directions. ' +
              'Treating a tactic as a strategy -- "the plan is to use this one tool" -- leaves you ' +
              'with nothing when that tool fails. Treating strategy as something you improvise ' +
              'leaves you loud, aimless, and easy to catch, because you never decided how much noise ' +
              'you could afford or when to stop. Good operators fix the strategy early, then stay ' +
              'flexible on tactics, so that a blocked move is a detour and not a dead end.',
          },
          options: [
            { id: 'a', label: 'Deciding the engagement will run for four weeks with stealth prioritised over speed.' },
            { id: 'b', label: 'Choosing which specific exploit to fire at the outdated Tomcat server.' },
            { id: 'c', label: 'Deciding whether to send the phishing email in the morning or afternoon.' },
            { id: 'd', label: 'Picking a username-and-password list for a login attempt.' },
          ],
          hints: [
            'Strategy is about the whole engagement: objective, timeline, risk appetite. Tactics are single moves.',
            'Three of these are decisions made in the moment against one target. One sets the terms for everything.',
            'Which choice shapes how every later decision gets made, rather than being one of those decisions?',
          ],
          solution:
            'A. Setting the engagement length and deciding that stealth outweighs speed is a ' +
            'strategic choice that governs every later move. B, C, and D are tactics: which exploit, ' +
            'what time to send an email, which wordlist to try. They are decided in the moment and ' +
            'flow from the strategy in A.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'One option sets the rules the other three are played under. That is the strategy.',
            },
          ],
          debrief:
            'A team that has settled its strategy can lose a dozen tactical moves and still succeed. ' +
            'A team that improvises strategy is loud and lost after the first surprise.',
          practice: [],
        },
        {
          id: 'rtf.3.4',
          moduleId: 'rtf.3',
          packageId: 'red-team-foundations',
          order: 4,
          title: 'Why contingencies are the plan',
          kind: 'short-answer',
          goal: 'Explain why an attack plan needs backup paths and abort criteria.',
          prompt:
            'In two or three sentences, explain why a serious attack plan includes both a backup ' +
            'path and clear abort criteria. What goes wrong for an attacker who plans only the ' +
            'primary path?',
          teach: {
            concept:
              'Anyone who has driven somewhere important knows to have a rough idea what they will ' +
              'do if the highway is closed, and most people also decide in advance, without thinking ' +
              'much about it, how late they can leave and still arrive on time before they simply ' +
              'give up. A plan with only one path is a wish, not a plan. Real engagements are full of ' +
              'surprises: the vulnerable server gets patched the night before, the phishing email ' +
              'lands in a spam filter, a defender notices something and starts watching. A serious ' +
              'plan assumes this and carries secondary and tertiary paths, so that a blocked primary ' +
              'move is a detour rather than the end. The mark of a professional is not that the first ' +
              'plan works, it is that the second and third are already written.\n\n' +
              'Abort criteria are the other half, and the half amateurs skip. Deciding in advance ' +
              'what would make you stop -- a specific level of detection, a certain amount of time ' +
              'burned, a risk to systems outside scope -- protects both the engagement and the ' +
              'client. Without them, an operator under pressure keeps pushing, gets sloppy, and ' +
              'either gets caught in a way that teaches nothing or causes damage nobody authorised. ' +
              'Knowing when to walk away is a skill, and writing the trigger down beforehand is how ' +
              'you use it when your own judgement is clouded by momentum.',
          },
          hints: [
            'Think about what actually happens during an engagement: things get patched, filtered, or noticed.',
            'One idea is that reality breaks the primary path, so you need another. The other is knowing when to stop.',
            'A good answer names both: a backup path for when the primary fails, and abort criteria so you stop before doing harm or getting caught badly.',
          ],
          solution:
            'Real engagements do not go to plan -- a target gets patched, an email is filtered, a ' +
            'defender starts watching -- so an attacker with only a primary path is stuck the moment ' +
            'it fails. A backup path keeps the engagement moving when that happens, and abort ' +
            'criteria (a level of detection, a time limit, a risk to out-of-scope systems) decide in ' +
            'advance when to stop, before momentum pushes you into something sloppy or damaging. ' +
            'Planning only the primary path leaves you improvising under pressure, which is where ' +
            'both failures and accidents come from.',
          expectedOutput:
            'An answer covering that the primary path often fails and needs a backup, and that abort ' +
            'criteria set in advance decide when to stop.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['fail', 'blocked', 'patched', 'detected', 'does not work', 'goes wrong', 'stuck'],
                ['backup', 'secondary', 'alternative', 'another path', 'fallback', 'abort', 'stop', 'walk away'],
              ],
              hint:
                'Two ideas: that the primary path can fail (so you need a backup), and that you set ' +
                'criteria in advance for when to stop.',
            },
          ],
          debrief:
            'The same discipline is why incident responders and pilots use checklists: decisions ' +
            'made calmly in advance beat decisions made under pressure every time.',
          practice: [],
        },
      ],
    },
    {
      id: 'rtf.4',
      packageId: 'red-team-foundations',
      order: 4,
      title: 'OSINT and information exposure',
      summary:
        'How much an organisation gives away for free, where it leaks from, and how separate ' +
        'harmless-looking facts combine into a way in. Deeper practice on the passive craft from ' +
        'module one.',
      exercises: [
        {
          id: 'rtf.4.1',
          moduleId: 'rtf.4',
          packageId: 'red-team-foundations',
          order: 1,
          title: 'What each source gives up',
          kind: 'multiple-choice',
          goal: 'Match a public source to the intelligence it actually yields.',
          prompt:
            'You want to learn which internal hostnames and subdomains Northwind uses, without ' +
            'sending a packet to any Northwind system. Which public source is the right one?',
          teach: {
            concept:
              'This module goes deeper on the passive side of the recon covered in module one: ' +
              'gathering facts about a target from sources that are already public, so that nothing ' +
              'the target owns ever notices anyone looked. OPEN-SOURCE INTELLIGENCE, usually ' +
              'shortened to OSINT, is not one activity, it is a toolkit of very different sources, ' +
              'each of which gives up a different kind of fact, the same way a public library, a ' +
              'phone book, and a newspaper archive each answer different questions about a person ' +
              'without you ever having to knock on their door. Job postings reveal the ' +
              'technology stack a company runs and the teams it is growing. WHOIS and DNS records ' +
              'reveal registration details, mail servers, and name servers. Certificate transparency ' +
              'logs -- public, append-only records of every TLS certificate a public authority ' +
              'issues -- reveal subdomains and internal hostnames, because organisations request ' +
              'certificates for names they would never otherwise advertise. Breach databases reveal ' +
              'which employee credentials have leaked in past incidents.\n\n' +
              'The skill is knowing which source answers which question, because reaching for the ' +
              'wrong one wastes time and sometimes makes noise you did not need to make. Wanting ' +
              'subdomains and running a brute-force DNS scan against the target is loud and ' +
              'unnecessary when certificate transparency logs list them for free and the target ' +
              'never sees you look. A good OSINT phase is mostly this: choosing the quietest source ' +
              'that already holds the answer, and only touching the target when nothing public will ' +
              'do.',
          },
          options: [
            { id: 'a', label: 'Their public job postings.' },
            { id: 'b', label: 'Certificate transparency logs (for example, a service like crt.sh).' },
            { id: 'c', label: 'A fast DNS brute-force run directly against their name servers.' },
            { id: 'd', label: 'Their quarterly financial statements.' },
          ],
          hints: [
            'Ask which source lists names that organisations put on TLS certificates, including ones they never advertise.',
            'One option touches the target directly, so it is out if the rule is "no packets to Northwind".',
            'Certificates are requested for internal-sounding hostnames all the time, and every one is logged publicly.',
          ],
          solution:
            'B. Certificate transparency logs are a public, append-only record of issued TLS ' +
            'certificates, and organisations routinely request them for subdomains and internal ' +
            'hostnames, so the logs expose names you would otherwise never see -- all without ' +
            'touching the target. Job postings (A) reveal the tech stack, not hostnames; financials ' +
            '(D) reveal business shape; and a DNS brute-force (C) would work but sends packets to ' +
            'Northwind, breaking the passive constraint.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint:
                'You need subdomains and internal names, from a public source, without touching the ' +
                'target. Only one option fits all three.',
            },
          ],
          debrief:
            'Certificate transparency is one of the great free gifts to a tester: an organisation ' +
            'that requests a cert for vpn-test.northwind.example has just told the world that host ' +
            'exists.',
          practice: [],
        },
        {
          id: 'rtf.4.2',
          moduleId: 'rtf.4',
          packageId: 'red-team-foundations',
          order: 2,
          title: 'Where secrets leak',
          kind: 'multiple-choice',
          goal: 'Recognise the everyday places sensitive data escapes into public view.',
          prompt:
            'Which of these is a common, real way that sensitive information ends up publicly ' +
            'exposed without anyone attacking anything? Select all that apply.',
          teach: {
            concept:
              'Not every leak is the result of an attack. A great deal of what a tester finds was ' +
              'never stolen at all, it was published by accident, the same way a person might ' +
              'accidentally leave a spare key taped under the doormat while doing something ' +
              'completely unrelated, like having a package delivered while they were out. Developers ' +
              'commit an API key or password (credentials that let software or a person prove who ' +
              'they are) to a public code repository, a shared, often publicly viewable store of a ' +
              'project\'s source code, and it stays in the history even after they delete the file. ' +
              'the history even after they delete the file. Documents posted on a website carry ' +
              'metadata: the author\'s name, the software version, sometimes internal file paths and ' +
              'usernames. Old versions of pages sit in web archives long after the live site is ' +
              'cleaned up. Cloud storage buckets get set to public by a tired engineer and index ' +
              'themselves for anyone who looks.\n\n' +
              'None of these requires an exploit, which is exactly why they are so valuable and so ' +
              'dangerous. They are the natural exhaust of normal work, produced faster than anyone ' +
              'cleans them up, and they often hand over precisely the thing an attacker would ' +
              'otherwise have to fight for: a working credential, an internal hostname, the name of ' +
              'the person who administers a system. For a red teamer, checking these sources is ' +
              'almost always the highest return on the least effort in the whole engagement. For a ' +
              'defender, the lesson is that you leak from the inside out, and shrinking that leakage ' +
              'is unglamorous, continuous work.',
          },
          options: [
            { id: 'a', label: 'An API key committed to a public code repository, still visible in its history.' },
            { id: 'b', label: 'Internal usernames and file paths left in the metadata of a published PDF.' },
            { id: 'c', label: 'A cloud storage bucket accidentally set to public.' },
            { id: 'd', label: 'The company simply choosing to have a website at all.' },
          ],
          hints: [
            'Three of these are accidental leaks of something sensitive. One is just normal business.',
            'Think about what leaves a credential, a username, or a file listing where the public can read it.',
            'Having a website is not a leak. A public bucket, a committed key, and document metadata all are.',
          ],
          solution:
            'A, B, and C. A committed API key, usernames and paths in document metadata, and a ' +
            'publicly exposed storage bucket are all everyday accidental leaks that hand an attacker ' +
            'real material without any exploitation. D is not a leak: having a public website is ' +
            'normal, and the site itself is intended to be public.',
          expectedOutput: 'Options A, B, and C selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c'],
              hint:
                'Keep the three that expose something that was meant to be private. Drop the one ' +
                'that is just having a website.',
            },
          ],
          debrief:
            'This is why credential scanning of public repositories is now standard on both sides: ' +
            'the leak is so common that attackers automate the search and defenders automate the ' +
            'cleanup.',
          practice: [],
        },
        {
          id: 'rtf.4.3',
          moduleId: 'rtf.4',
          packageId: 'red-team-foundations',
          order: 3,
          title: 'How small facts combine',
          kind: 'short-answer',
          goal: 'Explain aggregation: why harmless facts become dangerous together.',
          prompt:
            'A job posting names the VPN product Northwind uses. A LinkedIn profile names an IT ' +
            'administrator. A breach database shows that administrator reused a password that has ' +
            'leaked. In two or three sentences, explain why these three harmless facts are dangerous ' +
            'together.',
          teach: {
            concept:
              'Knowing someone\'s street is harmless. Knowing they are on holiday is harmless. ' +
              'Knowing they leave a window unlatched is harmless. Put all three together and you have ' +
              'a burglary plan, even though nobody handed it over in one piece. The central insight ' +
              'of OSINT is AGGREGATION: pieces of information that are each harmless on their own ' +
              'become dangerous when combined. A job posting that names a VPN product (software that ' +
              'lets someone log in remotely to a company\'s private network as if they were sitting ' +
              'inside the building) is just marketing. An employee\'s name on a professional network is just a ' +
              'career. A leaked password in a breach dump is one of billions. But put them together ' +
              '-- this product, run by this named person, whose reused password has leaked -- and ' +
              'you have assembled a specific, testable way in that none of the three facts revealed ' +
              'by itself.\n\n' +
              'This is why organisations struggle to defend against OSINT: no single disclosure looks ' +
              'like a problem, so no single team ever decides to stop it. The recruiter posts the ' +
              'job, the employee updates their profile, the password leaked in a service the company ' +
              'does not even run. The danger lives only in the combination, and seeing that ' +
              'combination is the tester\'s core craft: holding many small, dull facts in view at ' +
              'once until they line up into an attack. The defensive answer is rarely to hide any one ' +
              'fact and almost always to break the chain -- here, by making sure a leaked, reused ' +
              'password cannot actually log in, through multi-factor authentication.',
          },
          hints: [
            'Each fact alone is boring. Ask what you can do once you hold all three at the same time.',
            'The product tells you what to log in to, the name tells you who, and the breach tells you a password to try.',
            'A good answer names that combined they give a specific target, a specific account, and a credential to try against it.',
          ],
          solution:
            'Separately each fact is trivial, but together they name what to attack (the VPN ' +
            'product), whose account to use (the administrator), and a password worth trying against ' +
            'it (the leaked, reused one). That is a concrete, testable login attempt that none of the ' +
            'three facts revealed alone. The danger is the combination, which is why the fix is to ' +
            'break the chain -- for example, requiring multi-factor authentication so a leaked ' +
            'password is not enough by itself.',
          expectedOutput:
            'An answer explaining that the three facts combine into a specific account, target, and ' +
            'credential to try, even though each is harmless alone.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['combine', 'together', 'combination', 'aggregate', 'chain', 'all three'],
                ['login', 'log in', 'credential', 'password', 'account', 'access', 'authenticate', 'way in'],
              ],
              hint:
                'Two ideas: that the facts combine, and that together they produce a usable login or ' +
                'credential attempt.',
            },
          ],
          debrief:
            'Aggregation is the whole game. It is also why "that information is already public" is ' +
            'never a complete answer to a disclosure concern: public plus public plus public can ' +
            'equal a breach.',
          practice: [],
        },
        {
          id: 'rtf.4.4',
          moduleId: 'rtf.4',
          packageId: 'red-team-foundations',
          order: 4,
          title: 'Legal to look, not legal to use',
          kind: 'multiple-choice',
          goal: 'Hold the line between gathering public data and acting on it.',
          prompt:
            'During authorised OSINT you find a Northwind administrator\'s password in a public ' +
            'breach database. Your scope covers Northwind\'s external systems. What may you do with ' +
            'it?',
          teach: {
            concept:
              'Overhearing a stranger\'s conversation in a public place is not a crime, even if what ' +
              'they said turns out to be sensitive. Acting on it, walking straight to their house and ' +
              'letting yourself in because you overheard where the spare key was kept, is a different ' +
              'act entirely, and this is one of the sharpest, most important lines in this whole ' +
              'pathway. Reading public information is lawful almost everywhere, even when the ' +
              'information itself is sensitive: a leaked password sitting in a BREACH DATABASE (a ' +
              'public or semi-public archive of credentials stolen in past incidents) can be looked ' +
              'at, because looking at a public record is not a crime. Using it is a different act ' +
              'entirely. The moment you take that password and try it against a login, you are ' +
              'attempting authentication, and whether that is lawful depends completely on your ' +
              'scope. Finding a credential does not authorise using it any more than finding a key ' +
              'on the pavement authorises entering the house it opens.\n\n' +
              'This is one of the sharpest edges in the field, and it is where enthusiasm gets ' +
              'people into real trouble. A credential that belongs to a system inside your agreed ' +
              'scope may be tested, because your authorisation covers that system. A credential for ' +
              'anything outside scope -- a personal account, a different company, a system not on the ' +
              'engagement -- is a finding you report, not a door you open. The discipline is to treat ' +
              'the scope, not the credential, as the thing that grants permission, every single ' +
              'time.',
          },
          options: [
            { id: 'a', label: 'Test it against Northwind\'s external VPN, which is in scope, then report the result.' },
            { id: 'b', label: 'Test it against the administrator\'s personal email to confirm the reuse.' },
            { id: 'c', label: 'Nothing at all; even finding it was probably illegal.' },
            { id: 'd', label: 'Sell it, since it was already public anyway.' },
          ],
          hints: [
            'Looking at a public breach dump is not the issue. Using the credential is, and scope decides that.',
            'One option uses it against an in-scope system; one uses it against a personal account that is not yours to touch.',
            'The administrator\'s personal email is not Northwind\'s system and is not in your scope, no matter what the password unlocks.',
          ],
          solution:
            'A. The external VPN is in scope, so your authorisation covers testing the credential ' +
            'there and reporting what happens. B is out of scope and unlawful: the administrator\'s ' +
            'personal email is not Northwind\'s system and not yours to touch. C is wrong because ' +
            'reading a public record is lawful, and D (selling it) is plainly criminal. Scope, not ' +
            'the credential, decides what you may do.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Only one option uses the credential against a system your scope actually covers, ' +
                'and reports the result.',
            },
          ],
          debrief:
            'The key on the pavement analogy is worth keeping: finding a way in never grants ' +
            'permission to use it. Only the scope does, and only for what the scope names.',
          practice: [],
        },
      ],
    },
    {
      id: 'rtf.5',
      packageId: 'red-team-foundations',
      order: 5,
      title: 'Vulnerabilities, CVEs, and severity',
      summary:
        'What a vulnerability actually is, how the world tracks and scores them, and why the ' +
        'headline severity number is only half the story.',
      exercises: [
        {
          id: 'rtf.5.1',
          moduleId: 'rtf.5',
          packageId: 'red-team-foundations',
          order: 1,
          title: 'Classify the weakness',
          kind: 'multiple-choice',
          goal: 'Name the category a described vulnerability belongs to.',
          prompt:
            'A Northwind web form takes a customer name and drops it straight into a database query ' +
            'without separating the data from the command, so a crafted name can change what the ' +
            'query does. What class of vulnerability is this?',
          teach: {
            concept:
              'A VULNERABILITY, in plain terms, is a mistake in how software is built or configured ' +
              'that lets it be made to do something it should not, the digital equivalent of a lock ' +
              'that can be popped open with the wrong tool because of a flaw in how it was made. ' +
              'Vulnerabilities fall into a handful of families, and recognising the family is more ' +
              'useful than memorising any single bug. Injection flaws happen when untrusted input is ' +
              'mixed into a command or query so that data is mistaken for instructions -- SQL ' +
              'injection into a database, command injection into a shell, and so on. Broken ' +
              'authentication is about who you are: weak passwords, missing multi-factor, sessions ' +
              'that can be stolen. Broken access control is about what you are allowed to do once ' +
              'you are in: reaching records or actions that should be denied. Misconfiguration is ' +
              'the catch-all for defaults left on, permissions left open, and services left ' +
              'exposed.\n\n' +
              'The reason to think in families is that the fix follows the family, not the instance. ' +
              'Every injection flaw, whatever the language, is fixed the same way: keep data and ' +
              'commands strictly separate, for example with parameterised queries that never let ' +
              'input become part of the statement. Learn the family and you can recognise a bug you ' +
              'have never seen before and already know roughly how it is exploited and how it is ' +
              'closed. The described flaw -- input flowing unseparated into a database query -- is ' +
              'the definition of the injection family.',
          },
          options: [
            { id: 'a', label: 'Injection (here, SQL injection): input is mixed into a query as if it were part of the command.' },
            { id: 'b', label: 'Broken authentication: the login is too weak.' },
            { id: 'c', label: 'Misconfiguration: a default setting was left on.' },
            { id: 'd', label: 'Denial of service: the form can be overloaded.' },
          ],
          hints: [
            'The defining detail is that user input is not kept separate from the database command.',
            'When data can change the meaning of a command, that family of flaw has a specific name.',
            'Mixing untrusted input into a query so it becomes part of the instruction is injection.',
          ],
          solution:
            'A. Untrusted input flowing into a database query without separating data from command ' +
            'is injection -- specifically SQL injection. It is not broken authentication (the login ' +
            'is not the issue), not a mere misconfiguration, and not denial of service. The fix is ' +
            'the standard one for the whole injection family: parameterise the query so input can ' +
            'never become part of the statement.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'The clue is that data and command are not kept apart. That names one specific ' +
                'family of vulnerability.',
            },
          ],
          debrief:
            'Injection has sat near the top of every serious vulnerability list for two decades, ' +
            'for one reason: mixing data and code is easy to do by accident and catastrophic when ' +
            'you do.',
          practice: [],
        },
        {
          id: 'rtf.5.2',
          moduleId: 'rtf.5',
          packageId: 'red-team-foundations',
          order: 2,
          title: 'Reading a severity score',
          kind: 'multiple-choice',
          goal: 'Interpret what a CVSS band is actually claiming.',
          prompt:
            'A vulnerability is rated CVSS 9.8 (Critical). What does that number most directly tell ' +
            'you?',
          teach: {
            concept:
              'Every vulnerability discovered anywhere in the world needs some way to say how bad it ' +
              'is, in terms everyone agrees on, the same way a hurricane gets a category number so ' +
              'that a warning means the same thing to everyone who hears it, regardless of where they ' +
              'live. CVSS, the Common Vulnerability Scoring System, puts a number from zero to ten on ' +
              'a vulnerability so that teams can talk about severity in a shared language. Roughly, ' +
              'nine and above is critical, seven and up is high, four and up is medium, and below ' +
              'that is low. The score is built from technical factors: how the flaw is reached (over ' +
              'the network or only locally), how hard it is to exploit, whether it needs a logged-in ' +
              'user, and how badly it hits confidentiality, integrity, and availability if it ' +
              'works.\n\n' +
              'What the score describes is the technical severity of the flaw in the abstract, not ' +
              'the risk to your particular organisation. A 9.8 says: reachable over the network, easy ' +
              'to exploit, and devastating if it lands -- in general. It does not know whether you ' +
              'even run the affected software, whether the vulnerable host is exposed to the ' +
              'internet, or whether the data behind it matters. Treating the CVSS number as a ' +
              'complete measure of your risk is the most common way security teams waste effort, ' +
              'which is exactly what the next exercise is about. For now, read the number for what it ' +
              'is: a portable statement of how bad the flaw is on its own terms.',
          },
          options: [
            { id: 'a', label: 'That the flaw is technically severe in general: easily reachable and highly damaging if exploited.' },
            { id: 'b', label: 'That your organisation is at critical risk from it right now.' },
            { id: 'c', label: 'That it is currently being exploited in the wild.' },
            { id: 'd', label: 'That there is no patch available.' },
          ],
          hints: [
            'The score is built from technical properties of the flaw, not from facts about your environment.',
            'A number computed by whoever published the CVE cannot know whether you run the software or expose it.',
            'It tells you how bad the flaw is in the abstract, not what it means for you specifically.',
          ],
          solution:
            'A. A high CVSS reflects the technical severity of the flaw itself -- how easily it is ' +
            'reached and how much damage it does if exploited -- as a general, portable measure. It ' +
            'does not tell you your organisation\'s actual risk (B), whether it is being exploited ' +
            'right now (C), or whether a patch exists (D). Those depend on your environment and ' +
            'current threat information, which the base score does not include.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Ask what a number set by the CVE publisher could possibly know: the flaw\'s own ' +
                'properties, or facts about your specific network?',
            },
          ],
          debrief:
            'Keep the distinction sharp: CVSS measures the flaw, not you. The next exercise is about ' +
            'the gap between those two things, which is where good prioritisation lives.',
          practice: [],
        },
        {
          id: 'rtf.5.3',
          moduleId: 'rtf.5',
          packageId: 'red-team-foundations',
          order: 3,
          title: 'When the score misleads',
          kind: 'short-answer',
          goal: 'Explain why CVSS severity is not the same as business risk.',
          prompt:
            'Northwind has two open findings. One is a CVSS 9.1 flaw in a lab server with no real ' +
            'data, not reachable from the internet. The other is a CVSS 5.3 flaw in the ' +
            'internet-facing system that processes customer payments. In two or three sentences, ' +
            'explain why the lower-scored finding may deserve attention first.',
          teach: {
            concept:
              'A smoke detector going off in an empty storage shed with nothing flammable in it is ' +
              'less urgent than a faint gas smell in an occupied nursery, even though the alarm is ' +
              'the louder signal. Vulnerability management runs into the identical problem constantly. ' +
              'The single most important habit in it is refusing to patch purely by score. CVSS ' +
              'measures the flaw in isolation, but real RISK is severity multiplied ' +
              'by exposure multiplied by what is at stake. A critical flaw on an isolated lab box ' +
              'with no data and no internet path is a low real risk, because almost nothing can reach ' +
              'it and nothing is lost if it falls. A medium flaw on the internet-facing system that ' +
              'handles payments is a high real risk, because it is reachable, it is exposed, and the ' +
              'data behind it is exactly what attackers want.\n\n' +
              'This is why a mature team overlays business context on the score. They ask where the ' +
              'host sits, what it is connected to, whether it faces the internet, what data it holds, ' +
              'and whether the flaw is being exploited in the wild right now. A team that patches ' +
              'strictly top-down by CVSS will spend its scarce time on impressive numbers attached to ' +
              'systems nobody can reach, while the boring medium on the crown-jewel server waits. ' +
              'Attackers do not read your CVSS spreadsheet; they go where the reachable, valuable ' +
              'targets are, and your prioritisation has to think the same way.',
          },
          hints: [
            'Compare the two findings on more than the number: where does each live, and what is behind it?',
            'One flaw is unreachable and guards nothing; the other is internet-facing and guards payment data.',
            'A good answer names exposure and value, and concludes that the lower score can be the higher real risk.',
          ],
          solution:
            'The 9.1 flaw sits on an isolated lab server that nothing can reach and that holds no ' +
            'real data, so its actual risk is low despite the high score. The 5.3 flaw is on an ' +
            'internet-facing system handling customer payments, so it is reachable and guards ' +
            'something attackers want, which makes its real risk higher. Risk is severity combined ' +
            'with exposure and what is at stake, so the lower-scored, better-positioned flaw can ' +
            'deserve attention first.',
          expectedOutput:
            'An answer explaining that exposure and the value of what is protected can make the ' +
            'lower-CVSS finding the higher real risk.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['exposure', 'internet-facing', 'reachable', 'exposed', 'accessible', 'facing'],
                ['data', 'payment', 'value', 'customer', 'at stake', 'matters', 'crown', 'sensitive'],
              ],
              hint:
                'Two ideas: that one flaw is reachable and one is not, and that one guards valuable ' +
                'data and one does not.',
            },
          ],
          debrief:
            'This is the daily judgement call of vulnerability management: the score sorts the ' +
            'flaws, but context decides the order you actually fix them in.',
          practice: [],
        },
        {
          id: 'rtf.5.4',
          moduleId: 'rtf.5',
          packageId: 'red-team-foundations',
          order: 4,
          title: 'The vulnerability ecosystem',
          kind: 'multiple-choice',
          goal: 'Know what a CVE identifier is and where scores and exploit code live.',
          prompt:
            'You read that a flaw is tracked as CVE-2021-44228. What does that identifier by itself ' +
            'give you?',
          teach: {
            concept:
              'If every hospital, newspaper, and government agency in the world used a different name ' +
              'for the same disease, coordinating a response to it would be chaos. Vulnerabilities ' +
              'have the same problem: a single flaw might get discussed by a software vendor, a news ' +
              'outlet, and a dozen security researchers, all of whom need to be certain they are ' +
              'talking about the exact same thing. The world coordinates on vulnerabilities through a ' +
              'shared naming scheme for exactly this reason. A CVE ' +
              '(Common Vulnerabilities and Exposures) identifier is a unique label of the form ' +
              'CVE-year-number that everyone can use to mean the same specific flaw, so a vendor ' +
              'advisory, a news article, and a scanner all agree on what they are discussing. The ' +
              'identifier itself is just a name and a short description; it is the anchor, not the ' +
              'whole record.\n\n' +
              'Around that name sits an ecosystem. The National Vulnerability Database enriches each ' +
              'CVE with a CVSS score, the list of affected products, and links to fixes. Vendor ' +
              'security advisories say which of their versions are hit and where the patch is. ' +
              'Exploit databases and proof-of-concept repositories hold actual attack code, which ' +
              'tells you whether a flaw is not just severe but practically exploitable today. ' +
              'Knowing which source answers which question is the difference between reciting a scary ' +
              'number and understanding whether a given flaw is a real, current threat to something ' +
              'you run.',
          },
          options: [
            { id: 'a', label: 'A unique name for one specific flaw that everyone can reference consistently.' },
            { id: 'b', label: 'A guarantee that the flaw is critical.' },
            { id: 'c', label: 'The exploit code needed to attack it.' },
            { id: 'd', label: 'Proof that your systems are affected.' },
          ],
          hints: [
            'The identifier is a label. Ask what a label, on its own, actually provides.',
            'Scores live in the NVD, exploit code lives in exploit databases, affected-version lists live in vendor advisories.',
            'The CVE number itself just lets everyone point at the same flaw. The details live in other sources.',
          ],
          solution:
            'A. A CVE identifier is a unique, shared name for one specific flaw, so that everyone ' +
            'references the same thing. It does not by itself tell you severity (that is the CVSS ' +
            'score in the NVD), supply exploit code (that lives in exploit databases), or prove your ' +
            'systems are affected (that comes from the affected-version list and your own inventory).',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Separate the name from the record. The identifier is just the shared label; the ' +
                'score, the code, and the affected list are elsewhere.',
            },
          ],
          debrief:
            'Fluency with this ecosystem is a daily skill on both sides: given a CVE, you should ' +
            'know within minutes whether it affects you, whether a patch exists, and whether working ' +
            'exploit code is already public.',
          practice: [],
        },
      ],
    },
    {
      id: 'rtf.6',
      packageId: 'red-team-foundations',
      order: 6,
      title: 'Initial access and social engineering',
      summary:
        'How the first foothold is really won. Usually not by an exploit but by a person, which is ' +
        'why this module spends most of its time on how humans are manipulated and how to spot it.',
      exercises: [
        {
          id: 'rtf.6.1',
          moduleId: 'rtf.6',
          packageId: 'red-team-foundations',
          order: 1,
          title: 'The doors that open first',
          kind: 'multiple-choice',
          goal: 'Recognise the common initial-access vectors and what they have in common.',
          prompt:
            'Which of the following are realistic ways an attacker gains their first foothold in an ' +
            'organisation? Select all that apply.',
          teach: {
            concept:
              'Every intrusion has a moment where an attacker goes from having no presence in an ' +
              'organisation at all to having some presence, however small. That moment is INITIAL ' +
              'ACCESS: the phase that gets an attacker from outside to any position inside, and the ' +
              'striking thing about it is how rarely it involves a dramatic exploit. ' +
              'The common vectors are mundane: a phishing email that harvests a password or delivers ' +
              'a malicious attachment, a reused or leaked credential tried against a login, an ' +
              'unpatched internet-facing service, a misconfigured remote-access portal, or a trusted ' +
              'third party who is compromised and connects into the target. Each is a way in, and ' +
              'the attacker only needs one to work once.\n\n' +
              'What unites the effective ones is that they exploit something already trusted -- a ' +
              'valid account, a legitimate connection, an employee doing their job -- rather than ' +
              'breaking down a wall. That is deliberate: access that looks legitimate is quieter and ' +
              'harder to detect than access that had to smash something. The foothold itself is ' +
              'usually humble, a single low-privilege account or one exposed box, because everything ' +
              'else in the lifecycle -- persistence, escalation, lateral movement -- is how that ' +
              'humble start gets turned into something serious. The attacker\'s only real requirement ' +
              'at this stage is to get inside without being stopped.',
          },
          options: [
            { id: 'a', label: 'Phishing an employee into entering their password on a fake login page.' },
            { id: 'b', label: 'Reusing a leaked credential against an internet-facing login.' },
            { id: 'c', label: 'Exploiting an unpatched, internet-facing service.' },
            { id: 'd', label: 'Compromising a trusted vendor that connects into the network.' },
            { id: 'e', label: 'Politely asking the front desk to hand over the domain administrator password.' },
          ],
          hints: [
            'Four of these are standard initial-access vectors. One is a caricature no real receptionist could satisfy.',
            'Realistic vectors reuse trust: a valid credential, a legitimate connection, an exposed service, a trusted vendor.',
            'The front desk does not know the domain admin password and could not hand it over. The other four are all real.',
          ],
          solution:
            'A, B, C, and D. Phishing, reused or leaked credentials, unpatched internet-facing ' +
            'services, and compromised trusted vendors are all standard, effective initial-access ' +
            'vectors, and each exploits something already trusted. E is a caricature: a receptionist ' +
            'neither knows nor could hand over the domain administrator password, so it is not a ' +
            'realistic vector (real social engineering is far more specific and modest in what it ' +
            'asks for).',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'Keep the four that abuse existing trust. Drop the cartoon where someone simply ' +
                'hands over the keys to everything.',
            },
          ],
          debrief:
            'Notice the pattern: the realistic vectors all borrow trust rather than break in. That ' +
            'is what makes initial access so hard to detect and so worth defending.',
          practice: [],
        },
        {
          id: 'rtf.6.2',
          moduleId: 'rtf.6',
          packageId: 'red-team-foundations',
          order: 2,
          title: 'Spot the phish',
          kind: 'multiple-choice',
          goal: 'Identify the strongest red flag in a phishing message.',
          prompt:
            'An email claims to be from Northwind IT and reads: "Your account will be DISABLED in ' +
            '2 hours. Verify now at http://northwind-security-verify.example to keep access." Which ' +
            'single feature is the strongest sign this is phishing?',
          teach: {
            concept:
              'PHISHING is a message, usually an email, that pretends to come from someone trustworthy ' +
              'in order to trick the reader into handing over information or taking an action they ' +
              'would not otherwise take. It is the digital version of a con artist showing up at your ' +
              'door in a uniform that looks official enough that you let your guard down. It works by ' +
              'pairing a trigger with a trap. The trigger is usually manufactured ' +
              'urgency or fear, your account will be closed, a payment failed, a document needs ' +
              'signing now -- because a person who feels they must act immediately stops checking ' +
              'details. The trap is an action that serves the attacker: click this link, open this ' +
              'attachment, enter your password here. Learning to read phishing is learning to slow ' +
              'down at exactly the moment the message is engineered to make you speed up.\n\n' +
              'The most reliable red flag is almost always the destination. A message can spoof a ' +
              'sender name perfectly and copy a company\'s logo pixel for pixel, but the link has to ' +
              'go somewhere the attacker controls, and that somewhere rarely matches the real ' +
              'domain. A lookalike domain -- one that contains the company\'s name but is not the ' +
              'company\'s actual domain -- is the tell that survives even a polished message. Urgency ' +
              'and threats are supporting evidence, but the mismatched destination is the thing you ' +
              'can check coldly, which is why "hover before you click, and read the real domain" is ' +
              'the single most valuable habit you can teach anyone.',
          },
          options: [
            { id: 'a', label: 'The link points to northwind-security-verify.example, which is not Northwind\'s real domain.' },
            { id: 'b', label: 'The email mentions the IT department.' },
            { id: 'c', label: 'The email is about an account.' },
            { id: 'd', label: 'The email was sent during working hours.' },
          ],
          hints: [
            'Three of these are things a perfectly legitimate email might also contain.',
            'Ask which single feature the attacker cannot fake away: the message can look right, but the link has to lead somewhere.',
            'The destination domain is a lookalike, not the real one. That is the tell that survives a polished message.',
          ],
          solution:
            'A. The link goes to a lookalike domain that merely contains "northwind" rather than ' +
            'being Northwind\'s real domain, and the destination is the one thing the attacker ' +
            'cannot fake away. Mentioning IT (B), being about an account (C), or arriving in working ' +
            'hours (D) are all things legitimate mail does too. The manufactured two-hour deadline ' +
            'is also a warning sign, but the mismatched destination is the strongest, most checkable ' +
            'one.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Which feature could a legitimate email never share, because the attacker has to ' +
                'send you somewhere they control?',
            },
          ],
          debrief:
            'This is why the enduring advice is "hover before you click". Everything else in a ' +
            'phish can be forged; the destination has to be real, and the destination gives it away.',
          practice: [],
        },
        {
          id: 'rtf.6.3',
          moduleId: 'rtf.6',
          packageId: 'red-team-foundations',
          order: 3,
          title: 'Why spear phishing works',
          kind: 'short-answer',
          goal: 'Explain why targeted phishing beats mass phishing.',
          prompt:
            'Mass phishing blasts the same generic email to thousands of people. Spear phishing ' +
            'sends a tailored message to one person, using details about their job, colleagues, or ' +
            'current projects. In two or three sentences, explain why spear phishing succeeds far ' +
            'more often, and where the attacker gets those details.',
          teach: {
            concept:
              'A form letter addressed to "Dear Customer" gets thrown away far more often than a ' +
              'letter that uses your actual name and mentions the actual order you placed last week. ' +
              'Phishing follows the same logic, and it comes in two very different shapes. Mass ' +
              'phishing is a numbers game: send a generic lure to enough people and a few will ' +
              'fall for it, but the generic quality is also its weakness, because a message that ' +
              'could be addressed to anyone rings false to almost everyone. Spear phishing inverts ' +
              'the economics. Instead of a wide net, it targets one person with a message built from ' +
              'real details about them -- their manager\'s name, a project they are on, a system ' +
              'they actually use, a tone that matches internal email. Those details make the message ' +
              'feel like it belongs in that person\'s inbox, and belonging is what disarms ' +
              'suspicion.\n\n' +
              'The details come straight from the OSINT phase this pathway already covered: ' +
              'professional networking profiles, the company website, conference talks, press ' +
              'releases, and the employee\'s own public posts. That is the direct line from ' +
              'reconnaissance to initial access -- the intelligence gathered quietly in one phase ' +
              'becomes the raw material for the lure in the next. It is also why spear phishing is so ' +
              'hard to defend against with awareness alone: the more real an organisation is in ' +
              'public, the more convincing the tailored lie can be, and no amount of "look for ' +
              'generic greetings" training helps against an email that uses your actual project ' +
              'name.',
          },
          hints: [
            'Compare the two on believability, not volume. Why does a tailored message get past someone a generic one would not?',
            'The details make it feel legitimate, and those details come from research done earlier.',
            'A good answer names that tailoring makes it convincing, and that the details come from OSINT (public profiles, the company site, and so on).',
          ],
          solution:
            'A generic mass email feels like it could be addressed to anyone, so most people ' +
            'distrust it, whereas a spear-phishing message uses real details -- a manager\'s name, a ' +
            'live project, a system the person actually uses -- so it feels like legitimate internal ' +
            'mail and disarms suspicion. Those details come from the OSINT phase: public profiles, ' +
            'the company website, conference talks, and the target\'s own posts. That is the direct ' +
            'line from reconnaissance to initial access.',
          expectedOutput:
            'An answer explaining that tailoring makes the message believable, and that the ' +
            'personal details come from OSINT or public research.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['tailor', 'personal', 'specific', 'detail', 'believ', 'convincing', 'relevant', 'targeted', 'trust'],
                ['osint', 'research', 'public', 'linkedin', 'profile', 'website', 'gathered', 'reconnaissance', 'recon'],
              ],
              hint:
                'Two ideas: that tailoring makes it more convincing, and that the details come from ' +
                'research or OSINT.',
            },
          ],
          debrief:
            'This closes the loop with module four: recon is not an academic exercise, it is the ' +
            'ammunition for the most reliable initial-access technique there is.',
          practice: [],
        },
        {
          id: 'rtf.6.4',
          moduleId: 'rtf.6',
          packageId: 'red-team-foundations',
          order: 4,
          title: 'Recognising a pretext',
          kind: 'multiple-choice',
          goal: 'Identify the manipulation in a pretexting phone call and the right response.',
          prompt:
            'Someone phones a Northwind employee: "Hi, this is Dave from IT support, we are pushing ' +
            'an urgent security update and I need your login to apply it before the deadline." What ' +
            'is the safest response for the employee?',
          teach: {
            concept:
              'SOCIAL ENGINEERING is the umbrella term for manipulating a person, rather than a ' +
              'machine, into doing something that helps an attacker, and PRETEXTING is its main tool: ' +
              'social engineering by invented story. It is the same trick as a con artist claiming to ' +
              'be a building inspector to get let inside a home. The attacker phones or messages ' +
              'wearing a role that carries authority or that invites helpfulness, IT support, a ' +
              'senior executive, a vendor, a new colleague -- and uses that borrowed authority to ' +
              'request information or action. It leans on two deep human instincts: deference to ' +
              'authority and the desire to be helpful, especially under time pressure. The story ' +
              'does not need to be elaborate, only plausible enough that questioning it feels ' +
              'awkward.\n\n' +
              'The defence is a rule that survives any story: legitimate IT never needs your ' +
              'password, because they do not authenticate as you to do their job. A password request, ' +
              'however it is dressed up, is the tell, and the safe move is never to hand it over on ' +
              'an inbound contact but to verify independently -- hang up and call the real IT number, ' +
              'not a number the caller gave you. This is why organisations train staff that no ' +
              'genuine request will ever ask for a password and that the correct response to pressure ' +
              'is to slow down and confirm through a known channel. The attacker\'s whole method ' +
              'depends on the target not stopping to check, so stopping to check is the entire ' +
              'defence.',
          },
          options: [
            { id: 'a', label: 'Give the login, since IT clearly needs it to help and the deadline is urgent.' },
            { id: 'b', label: 'Refuse to share the password and verify by calling the real IT line independently.' },
            { id: 'c', label: 'Give a slightly wrong password to test whether the caller is genuine.' },
            { id: 'd', label: 'Read out the password only if the caller already knows the employee\'s name.' },
          ],
          hints: [
            'Real IT never needs your password. Start from that and the answer narrows fast.',
            'The caller manufactured authority and urgency. The safe response neutralises both.',
            'Do not hand over the password on an inbound call. Verify through a number you trust, not one the caller supplied.',
          ],
          solution:
            'B. Legitimate IT never needs a user\'s password, so the request itself is the tell, and ' +
            'the safe move is to refuse and verify independently by calling the real IT line. A ' +
            'hands over exactly what the attacker wants; C still treats the password as shareable and ' +
            'risks leaking the real one; D lets the attacker succeed just by knowing a name, which ' +
            'they easily could. Slowing down and verifying through a trusted channel is the whole ' +
            'defence.',
          expectedOutput: 'Option B selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['b'],
              hint:
                'Only one option both refuses to share the password and confirms the caller through ' +
                'a channel the employee already trusts.',
            },
          ],
          debrief:
            'Pretexting beats technical controls because it targets people, so the countermeasure ' +
            'is also a human habit: verify inbound requests through a known channel, and never treat ' +
            'a password as shareable.',
          practice: [],
        },
      ],
    },
    {
      id: 'rtf.7',
      packageId: 'red-team-foundations',
      order: 7,
      title: 'Persistence and command and control',
      summary:
        'Access that vanishes on the next reboot is worthless. This module covers how attackers ' +
        'stay, how they talk to what they left behind, and the constant trade of stealth against ' +
        'reliability.',
      exercises: [
        {
          id: 'rtf.7.1',
          moduleId: 'rtf.7',
          packageId: 'red-team-foundations',
          order: 1,
          title: 'Why persistence exists',
          kind: 'multiple-choice',
          goal: 'Explain the problem persistence solves.',
          prompt:
            'An attacker has a foothold running only in memory on a Northwind server. Why do they ' +
            'add a persistence mechanism such as a scheduled task before doing anything else?',
          teach: {
            concept:
              'A squatter who has climbed in through an unlocked window loses their spot the instant ' +
              'someone locks that window again, unless they have also cut themselves a spare key. A ' +
              'foothold on a computer that lives only in a running process (a program currently ' +
              'executing) is exactly that fragile: reboot the machine, kill ' +
              'the process, or simply wait for it to end and the attacker\'s access is gone. ' +
              'PERSISTENCE is any mechanism that survives those events and lets the attacker get back ' +
              'in automatically -- a scheduled task, a new service set to start at boot, an entry in ' +
              'a startup folder, an extra key added to a list of authorised logins, a small script ' +
              'left on a web server. Each one arranges for the attacker\'s access to reappear without ' +
              'them having to break in again.\n\n' +
              'The reason to establish it early is that the moment of initial access is often the ' +
              'hardest to repeat. The phishing email will not land twice, the vulnerable service ' +
              'might be patched tomorrow, the leaked password will be rotated once someone notices. ' +
              'Persistence converts one lucky entry into durable access, which is what every later ' +
              'phase depends on -- there is no point escalating privileges or moving laterally over ' +
              'weeks if a routine reboot ends the engagement. It is also, for exactly this reason, ' +
              'one of the richest hunting grounds for defenders: unexpected new scheduled tasks, ' +
              'services, and startup entries are precisely what a compromise leaves behind.',
          },
          options: [
            { id: 'a', label: 'So their access survives a reboot or the process ending, without having to break in again.' },
            { id: 'b', label: 'Because persistence is what grants administrator rights.' },
            { id: 'c', label: 'Because it hides them completely from all detection.' },
            { id: 'd', label: 'Because it is required before any reconnaissance can start.' },
          ],
          hints: [
            'The foothold is in memory. Ask what happens to it when the machine restarts.',
            'Persistence is about staying, not about power or invisibility.',
            'The whole point is that access reappears automatically after a reboot, so the hard-won foothold is not lost.',
          ],
          solution:
            'A. Persistence exists so that access survives reboots and process death and can resume ' +
            'automatically, without repeating the initial break-in that may not be possible twice. It ' +
            'does not grant administrator rights (that is privilege escalation), it does not make an ' +
            'attacker invisible, and it is not a prerequisite for reconnaissance, which happens ' +
            'earlier.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Separate staying from getting power or staying hidden. Persistence is only about ' +
                'surviving to get back in.',
            },
          ],
          debrief:
            'Because persistence has to leave something behind that runs automatically, it is one of ' +
            'the best places for defenders to look. Attacker durability and defender visibility are ' +
            'the same artefact seen from two sides.',
          practice: [],
        },
        {
          id: 'rtf.7.2',
          moduleId: 'rtf.7',
          packageId: 'red-team-foundations',
          order: 2,
          title: 'The stealth-reliability trade',
          kind: 'multiple-choice',
          goal: 'Reason about the trade-off between quiet and dependable persistence.',
          prompt:
            'Two persistence options are on the table. Option 1 is a common scheduled task: simple ' +
            'and dependable, but exactly what defenders check for. Option 2 is a deep, sophisticated ' +
            'technique: very hard to detect, but complex and prone to breaking. Which statement best ' +
            'captures the real trade-off?',
          teach: {
            concept:
              'A spare house key hidden under the doormat is easy to find again and always works, but ' +
              'it is also the very first place anyone would look. A spare key welded inside a hollow ' +
              'fence post three gardens away is much harder to find, but it is also much easier to ' +
              'lose track of, or to have the fence post itself get replaced without you knowing. ' +
              'Every persistence method for a compromised computer sits somewhere on that same line ' +
              'between stealth and reliability, and the two pull against each other. The simplest, ' +
              'most reliable methods, a scheduled task (a job the operating system is told to run ' +
              'automatically at a set time), a new service (a program registered to start ' +
              'automatically with the machine), are dependable precisely because they use ordinary, ' +
              'well-supported operating-system features, but that same ordinariness is why defenders ' +
              'know to look at them first. The stealthiest methods hide in places few people inspect, ' +
              'but they tend to be complex, fragile, and dependent on conditions that a patch or a ' +
              'configuration change can quietly break.\n\n' +
              'There is no universally correct choice, only a choice that fits the engagement. ' +
              'Against an unsophisticated target with a tired security team, a simple reliable method ' +
              'may never be looked at, so its low stealth costs nothing. Against a mature blue team ' +
              'actively hunting, the same method is a quick way to get caught, and the extra fragility ' +
              'of a stealthy technique is a price worth paying. Mature operators often run more than ' +
              'one: a quiet primary they hope survives, and a cruder backup in case it does not. The ' +
              'skill is not knowing "the best" method, it is matching the method to the defender you ' +
              'actually face.',
          },
          options: [
            { id: 'a', label: 'Simple methods are more reliable but easier to detect; stealthy methods hide better but are more fragile. The right choice depends on the target.' },
            { id: 'b', label: 'The sophisticated method is always better, because stealth is all that matters.' },
            { id: 'c', label: 'The simple method is always better, because reliability is all that matters.' },
            { id: 'd', label: 'There is no trade-off; you can always have both at once.' },
          ],
          hints: [
            'Neither extreme is free. What does each option cost you?',
            'The simple method trades detectability for reliability; the sophisticated one trades reliability for stealth.',
            'The right answer names the trade in both directions and says the choice depends on the defender you face.',
          ],
          solution:
            'A. Simple methods buy reliability at the cost of being easy to spot, while stealthy ' +
            'methods buy concealment at the cost of complexity and fragility, so the right choice ' +
            'depends on how capable the defenders are. B and C each pretend only one property ' +
            'matters, and D denies the trade-off exists -- but you genuinely cannot have maximum ' +
            'stealth and maximum reliability at once, which is why operators often deploy a quiet ' +
            'primary and a cruder backup.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Look for the option that admits a cost on both sides and makes the choice depend on ' +
                'the target.',
            },
          ],
          debrief:
            'This trade -- stealth against reliability -- recurs across offensive security. The ' +
            'mature answer is almost never "the best technique" and almost always "the right ' +
            'technique for this defender, plus a backup".',
          practice: [],
        },
        {
          id: 'rtf.7.3',
          moduleId: 'rtf.7',
          packageId: 'red-team-foundations',
          order: 3,
          title: 'Rank the C2 channels',
          kind: 'multiple-choice',
          goal: 'Judge which command-and-control channel is hardest to detect and why.',
          prompt:
            'An implant needs to receive commands from its operator. Of these channels, which is ' +
            'generally the HARDEST for a defender to notice?',
          teach: {
            concept:
              'A getaway driver waiting outside a bank is useless without some way for the robbers ' +
              'inside to signal when to pull up. Once something (usually called an IMPLANT: a small ' +
              'piece of software left running on a compromised machine) is left on a system, the ' +
              'operator has to talk to it, sending it instructions and receiving results back, and ' +
              'that conversation is COMMAND AND CONTROL, or C2. The channel matters enormously, ' +
              'because it is often the loudest thing an intrusion does: a compromised host that ' +
              'connects straight to an obvious attacker address on an odd port is trivial to spot in ' +
              'network logs. The whole art of C2 is making the attacker\'s traffic look like traffic ' +
              'the network already expects to see.\n\n' +
              'The general principle is that detectability falls as the channel blends into normal, ' +
              'expected traffic. A direct connection to a raw attacker address is loud. Encrypted ' +
              'traffic dressed as ordinary web browsing is quieter, because encrypted web traffic is ' +
              'everywhere. Hiding commands inside DNS queries is quieter still, because DNS is so ' +
              'fundamental that it is rarely inspected closely and almost never blocked. Quietest of ' +
              'all is riding a legitimate cloud service the organisation already uses, so the traffic ' +
              'goes to a trusted destination and looks like an employee using a normal tool. The ' +
              'lesson for defenders is the mirror image: the stealthiest C2 hides in your most ' +
              'trusted, least inspected traffic, which is exactly where you have to learn to look.',
          },
          options: [
            { id: 'a', label: 'Commands smuggled through a legitimate cloud service the organisation already uses.' },
            { id: 'b', label: 'A direct connection from the host to a raw attacker IP on an unusual port.' },
            { id: 'c', label: 'A plaintext connection on a port the firewall logs and flags.' },
            { id: 'd', label: 'An obvious repeated beacon to a newly registered suspicious domain.' },
          ],
          hints: [
            'Ask which channel blends into traffic the network already trusts and expects.',
            'Three of these stand out: a raw IP, a flagged plaintext port, a suspicious new domain.',
            'Traffic to a legitimate, already-used cloud service looks like an employee doing normal work.',
          ],
          solution:
            'A. Riding a legitimate cloud service the organisation already uses makes the traffic go ' +
            'to a trusted destination and look like ordinary employee activity, which is the hardest ' +
            'to notice. A raw attacker IP on an odd port (B), a flagged plaintext connection (C), ' +
            'and an obvious beacon to a suspicious new domain (D) all stand out against normal ' +
            'traffic. Detectability falls as the channel blends into what the network already ' +
            'expects.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Which destination would a defender least question, because the organisation talks ' +
                'to it all day already?',
            },
          ],
          debrief:
            'This is why modern detection watches trusted traffic too: the stealthiest C2 does not ' +
            'avoid the network, it disappears into the parts of it nobody thinks to inspect.',
          practice: [],
        },
        {
          id: 'rtf.7.4',
          moduleId: 'rtf.7',
          packageId: 'red-team-foundations',
          order: 4,
          title: 'Explain a channel choice',
          kind: 'short-answer',
          goal: 'Justify a C2 choice in terms of the defenders it must survive.',
          prompt:
            'An attacker inside a heavily monitored bank network chooses slow DNS-based command and ' +
            'control instead of a fast, direct connection, even though DNS is slower and more ' +
            'limited. In two or three sentences, explain the reasoning behind that choice.',
          teach: {
            concept:
              'A getaway car that speeds through empty back roads at midnight is fine when nobody is ' +
              'watching those roads, and reckless when a patrol car is parked on every corner. ' +
              'Choosing a C2 channel is the same exercise in reading the defender. In a lightly ' +
              'watched environment, a fast and simple channel is fine, because nobody is looking hard ' +
              'enough ' +
              'to notice. In a heavily monitored one -- a bank, say, with mature detection and ' +
              'analysts who investigate anomalies -- speed becomes a liability, because a fast, ' +
              'direct, high-volume connection to an unusual destination is exactly the pattern such ' +
              'a team is built to catch. There, the attacker trades throughput for concealment on ' +
              'purpose.\n\n' +
              'DNS-based C2 is the classic answer to that problem. Nearly every network must allow ' +
              'DNS to function, it is rarely inspected as closely as web traffic, and a trickle of ' +
              'queries hides easily in the enormous background of legitimate lookups. It is slow and ' +
              'awkward -- you can move only a little data per query -- but against a capable ' +
              'defender, slow-and-unseen beats fast-and-caught every time. The judgement being ' +
              'taught is that the right channel is not the most capable one in the abstract; it is ' +
              'the one that survives the specific defenders standing between the attacker and their ' +
              'objective.',
          },
          hints: [
            'The question is not which channel is faster. It is which one survives a team that is actively watching.',
            'Why would an attacker accept a slow, limited channel? Because of what the fast one would cost them here.',
            'A good answer names that DNS blends into traffic every network allows and rarely inspects, so it evades a monitored environment even though it is slower.',
          ],
          solution:
            'In a heavily monitored network a fast, direct, high-volume connection to an unusual ' +
            'destination is exactly the pattern a mature team will catch, so speed becomes a ' +
            'liability. DNS is allowed almost everywhere, rarely inspected closely, and a trickle of ' +
            'queries hides in the huge volume of legitimate lookups, so DNS-based C2 stays unseen ' +
            'even though it is slower and more limited. Against a capable defender, slow and ' +
            'undetected beats fast and caught.',
          expectedOutput:
            'An answer explaining that DNS blends into allowed, rarely inspected traffic and so ' +
            'evades heavy monitoring, at the cost of speed.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['dns', 'blend', 'allowed', 'normal', 'legitimate', 'rarely inspected', 'hides', 'expected'],
                ['detect', 'monitor', 'notice', 'caught', 'stealth', 'evade', 'unseen', 'flagged'],
              ],
              hint:
                'Two ideas: that DNS blends into allowed, rarely inspected traffic, and that this ' +
                'avoids detection in a monitored network despite being slower.',
            },
          ],
          debrief:
            'The reasoning generalises: against a strong defender you spend capability to buy ' +
            'stealth, and against a weak one you do not bother. Reading which you face is the skill.',
          practice: [],
        },
      ],
    },
    {
      id: 'rtf.8',
      packageId: 'red-team-foundations',
      order: 8,
      title: 'Lateral movement and privilege escalation',
      summary:
        'Turning one modest foothold into control of the network: stepping sideways to new systems, ' +
        'and climbing from a low-rights account to an administrative one.',
      exercises: [
        {
          id: 'rtf.8.1',
          moduleId: 'rtf.8',
          packageId: 'red-team-foundations',
          order: 1,
          title: 'Sideways or upward',
          kind: 'multiple-choice',
          goal: 'Distinguish lateral movement from privilege escalation precisely.',
          prompt:
            'A tester is a standard user on Workstation A. They exploit a local flaw and become ' +
            'administrator of Workstation A. Which is this, and why?',
          teach: {
            concept:
              'Think of a large office building where each floor is a different computer and the ' +
              'lifts and stairwells connecting them are the network. Once someone slips past the ' +
              'lobby security desk, they can do two different kinds of moving around: they can talk ' +
              'their way from being a visitor to holding a staff keycard on the floor they are ' +
              'already on, or they can use whatever access they already have to walk onto a different ' +
              'floor entirely. Two movements dominate the middle of a computer intrusion in exactly ' +
              'this way, and they are easy to confuse because both increase the attacker\'s reach. ' +
              'PRIVILEGE ESCALATION is vertical: on a ' +
              'single system, you climb from a low-rights account (one allowed to do only ordinary, ' +
              'limited things) to a higher one, ideally administrator or root (the account with ' +
              'essentially unlimited power over that machine), which lets you do far more on that ' +
              'machine. LATERAL MOVEMENT is ' +
              'horizontal: you use your position on one system to reach a different system you could ' +
              'not touch before. Up versus across is the whole distinction, and it is worth getting ' +
              'exact because the two look different in the logs and call for different defences.\n\n' +
              'In practice attackers alternate between them, and the combination is what makes a ' +
              'small foothold dangerous. You land as a nobody on one machine, escalate to ' +
              'administrator there, use that power to harvest credentials, move laterally to a second ' +
              'machine with those credentials, escalate again, and repeat -- a staircase that ends, ' +
              'often, at the domain controller that runs the whole network. Naming each step ' +
              'correctly is not pedantry: a defender who sees "user became admin on one host" is ' +
              'looking at a different problem, with different urgency, from one who sees "an account ' +
              'is authenticating to machines it has never touched".',
          },
          options: [
            { id: 'a', label: 'Privilege escalation: they gained higher rights on the same machine.' },
            { id: 'b', label: 'Lateral movement: they became more powerful.' },
            { id: 'c', label: 'Lateral movement: any increase in access is lateral movement.' },
            { id: 'd', label: 'Persistence: administrator rights survive a reboot.' },
          ],
          hints: [
            'Ask whether they reached a new machine or gained more power on the one they were already on.',
            'Up on one host is escalation; across to another host is lateral movement.',
            'They are still on Workstation A, just with more rights. Nothing new was reached.',
          ],
          solution:
            'A. Gaining administrator rights on the same machine you already had a foothold on is ' +
            'privilege escalation -- moving vertically, up the rights ladder, on one host. It is not ' +
            'lateral movement, which would mean reaching a different system (B and C both misuse the ' +
            'term), and it is not persistence, which is about surviving a reboot rather than gaining ' +
            'power.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'They did not reach a new machine. They got more powerful on the same one. That has ' +
                'a specific name.',
            },
          ],
          debrief:
            'Keep the axes straight: escalation is up, movement is across. Attackers climb the ' +
            'staircase by alternating the two, and defenders detect each with different signals.',
          practice: [],
        },
        {
          id: 'rtf.8.2',
          moduleId: 'rtf.8',
          packageId: 'red-team-foundations',
          order: 2,
          title: 'Why credential reuse is fuel',
          kind: 'short-answer',
          goal: 'Explain how reused credentials enable rapid lateral movement.',
          prompt:
            'Many organisations use the same local administrator password on every workstation. In ' +
            'two or three sentences, explain why that single habit lets an attacker who compromises ' +
            'one machine spread across the whole fleet, and name one control that breaks it.',
          teach: {
            concept:
              'A landlord who uses the same master key on every unit in a building has made a single ' +
              'stolen key far more dangerous than it needed to be: whoever copies it from one door now ' +
              'has every door. Lateral movement on a network is easiest when the attacker does not ' +
              'have to exploit anything at all, only reuse a credential (a username and password, or ' +
              'similar proof of identity) that already works elsewhere. The classic enabler is a ' +
              'shared local administrator password: if every workstation has the same one, then ' +
              'cracking or extracting it from a single machine hands the attacker administrator ' +
              'access to all of them at once. No exploit, no vulnerability, just a valid login ' +
              'repeated across the fleet, which is why this pattern turns one compromise into total ' +
              'compromise so quickly.\n\n' +
              'It is dangerous precisely because it looks like legitimate use. An administrator ' +
              'account logging in to many machines is normal in most networks, so the movement hides ' +
              'in expected behaviour rather than triggering exploit alerts. The control that breaks ' +
              'it is making each machine\'s credential unique, so that a password stolen from one ' +
              'host is useless on the next -- solutions that randomise and rotate the local ' +
              'administrator password per machine exist exactly for this. The broader lesson is that ' +
              'shared secrets are shared risk: any credential valid in more than one place is a ' +
              'bridge an attacker can walk across.',
          },
          hints: [
            'If the same password works everywhere, what does stealing it from one machine give you?',
            'The attacker reuses a valid login rather than exploiting a flaw, which is why it is fast and quiet.',
            'A good answer names that one stolen password unlocks the whole fleet, and that unique per-machine passwords break it.',
          ],
          solution:
            'If every workstation shares one local administrator password, then extracting it from a ' +
            'single compromised machine gives the attacker administrator access to all of them -- no ' +
            'exploit needed, just a valid login reused across the fleet, which also hides in normal ' +
            'admin activity. The control that breaks it is a unique credential per machine (for ' +
            'example, randomised and rotated local administrator passwords), so a password stolen ' +
            'from one host does not work on any other.',
          expectedOutput:
            'An answer explaining that one shared password unlocks the whole fleet, and naming ' +
            'unique per-machine credentials as the fix.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['same', 'shared', 'reuse', 'one password', 'identical', 'every machine', 'everywhere'],
                ['unique', 'per-machine', 'different', 'rotate', 'randomis', 'randomiz', 'vary', 'distinct'],
              ],
              hint:
                'Two ideas: that one shared password unlocks the whole fleet, and that making each ' +
                'machine\'s credential unique breaks the spread.',
            },
          ],
          debrief:
            'Shared secrets are shared risk. This is why unique, rotated local credentials are one ' +
            'of the highest-value defensive controls there is: it turns one compromise back into ' +
            'one compromise.',
          practice: [],
        },
        {
          id: 'rtf.8.3',
          moduleId: 'rtf.8',
          packageId: 'red-team-foundations',
          order: 3,
          title: 'Where escalation comes from',
          kind: 'multiple-choice',
          goal: 'Recognise the common sources of privilege escalation.',
          prompt:
            'Which of these could realistically let a low-privilege user become administrator or ' +
            'root on a system? Select all that apply.',
          teach: {
            concept:
              'Most break-ins do not require a master locksmith. They happen because a maintenance ' +
              'worker left a service door propped open, or a spare key was hung on a hook visible ' +
              'through a window. Privilege escalation usually comes not from a single exotic exploit ' +
              'but from ordinary mistakes in how a system is configured and maintained. An unpatched ' +
              'flaw in ' +
              'the operating-system kernel can let a normal user run code with the highest rights. A ' +
              'file or program that runs as a powerful account but can be modified or influenced by a ' +
              'weak one hands over that power. An over-generous permission -- a user allowed to run a ' +
              'sensitive command as administrator, a critical file left writable by everyone -- is a ' +
              'direct route up. And sometimes the credential is simply lying around: a root password ' +
              'in a script, a private key in a world-readable file.\n\n' +
              'The unifying idea is that escalation exploits the gap between the privileges a user is ' +
              'meant to have and what the system actually allows them to do or reach. Good ' +
              'administration closes those gaps -- patch promptly, grant the least privilege ' +
              'necessary, keep sensitive files and commands out of reach of ordinary accounts, and ' +
              'never leave secrets in readable places. Every one of those is boring, and every one ' +
              'of them, skipped, is a staircase step an attacker will happily climb. Recognising the ' +
              'sources is the first move on both sides: the tester hunts for them, the defender ' +
              'removes them.',
          },
          options: [
            { id: 'a', label: 'An unpatched kernel vulnerability that lets a normal user run code as root.' },
            { id: 'b', label: 'A sensitive command the user is misconfigured to run as administrator.' },
            { id: 'c', label: 'A root password left in a world-readable script.' },
            { id: 'd', label: 'The user simply having a long, strong password of their own.' },
          ],
          hints: [
            'Three of these are real escalation routes. One is just good password hygiene for a normal account.',
            'Escalation comes from unpatched flaws, over-generous permissions, or secrets left lying around.',
            'A strong password on a low-privilege account does not, by itself, grant any more privilege.',
          ],
          solution:
            'A, B, and C. An unpatched kernel flaw, a sensitive command misconfigured to run with ' +
            'administrator rights, and a root password left in a readable file are all real routes ' +
            'from low privilege to high. D is not: having a strong password on your own ' +
            'low-privilege account is good hygiene but grants no additional privilege by itself.',
          expectedOutput: 'Options A, B, and C selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c'],
              hint:
                'Keep the three that hand a normal user higher rights. Drop the one that is just a ' +
                'strong password on an ordinary account.',
            },
          ],
          debrief:
            'Notice how mundane the real routes are: a missed patch, a loose permission, a secret in ' +
            'the wrong file. Escalation is usually an administration failure, not a magic exploit.',
          practice: [],
        },
        {
          id: 'rtf.8.4',
          moduleId: 'rtf.8',
          packageId: 'red-team-foundations',
          order: 4,
          title: 'What the defender sees',
          kind: 'short-answer',
          goal: 'Describe the signals lateral movement generates for a defender.',
          prompt:
            'Even when an attacker moves laterally using stolen but valid credentials -- no exploit, ' +
            'no malware -- a watchful defender can still notice. In two or three sentences, describe ' +
            'what unusual pattern gives it away.',
          teach: {
            concept:
              'A neighbour who always leaves for work at eight and returns at six is not doing ' +
              'anything wrong by walking into their own house. A neighbour who normally does that but ' +
              'is suddenly seen entering three different houses on the street at three in the ' +
              'morning is doing something that is, individually, still just "using a key," yet is ' +
              'obviously worth a second look. Lateral movement with valid credentials on a network is ' +
              'quiet in the same way, because nothing is technically ' +
              'broken: a real account logging in with a real password raises no exploit alert and ' +
              'trips no antivirus. This is exactly why it is so favoured, and why detecting it is one ' +
              'of the harder problems in defence. But quiet is not silent. The movement still ' +
              'produces authentication events, and those events describe a pattern of behaviour that ' +
              'can look wrong even when every individual login is valid.\n\n' +
              'The tell is anomaly, not error. An account that normally signs in to one workstation ' +
              'during office hours suddenly authenticating to a dozen servers, at three in the ' +
              'morning, from a machine it has never used, is behaving unlike itself even though each ' +
              'login is technically legitimate. Defenders build a baseline of what normal looks like ' +
              'for each account and each host, then hunt for departures from it. That is the core ' +
              'idea behind behavioural detection and much of what a modern security operations centre ' +
              'does: since the attacker will not hand you an exploit to catch, you catch the shape of ' +
              'their movement instead.',
          },
          hints: [
            'No exploit fires, so forget malware signatures. What does every login still create?',
            'Think about a normally quiet account suddenly touching many machines, at odd hours, from an unusual source.',
            'A good answer names unusual authentication behaviour: an account logging in where, when, or how it never normally does.',
          ],
          solution:
            'Every login still generates authentication events, and those reveal behaviour that can ' +
            'look wrong even when each login is valid. An account that normally uses one machine in ' +
            'office hours suddenly authenticating to many servers, at unusual times, from a host it ' +
            'has never used is behaving unlike itself. Defenders baseline what normal looks like for ' +
            'each account and hunt for those departures, which is how behavioural detection catches ' +
            'movement that carries no exploit.',
          expectedOutput:
            'An answer describing anomalous authentication: an account logging in to unusual hosts, ' +
            'at unusual times, or from unusual sources compared with its normal pattern.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['login', 'authentication', 'log in', 'sign in', 'access', 'account'],
                ['unusual', 'anomal', 'abnormal', 'never', 'new', 'odd', 'baseline', 'pattern', 'different', 'many', 'unexpected'],
              ],
              hint:
                'Two ideas: that logins are still recorded, and that an account behaving unlike its ' +
                'normal pattern is the giveaway.',
            },
          ],
          debrief:
            'This is the core of modern detection: since a valid credential leaves no exploit to ' +
            'catch, you catch the behaviour instead. The attacker\'s quietest move still has a ' +
            'shape.',
          practice: [],
        },
      ],
    },
    {
      id: 'rtf.9',
      packageId: 'red-team-foundations',
      order: 9,
      title: 'Logging, detection, and evasion',
      summary:
        'What systems record, why defenders still miss things, and what evasion really is: not ' +
        'invisibility, but making your activity look like everything else.',
      exercises: [
        {
          id: 'rtf.9.1',
          moduleId: 'rtf.9',
          packageId: 'red-team-foundations',
          order: 1,
          title: 'What leaves a trace',
          kind: 'multiple-choice',
          goal: 'Know which activities generate log evidence.',
          prompt:
            'Which of these attacker actions would normally leave a record in some log, assuming ' +
            'ordinary logging is enabled? Select all that apply.',
          teach: {
            concept:
              'A modern building keeps far more of a record of who moved through it than most people ' +
              'realise: badge readers log every door opened, cameras catch every hallway, and a sign-in ' +
              'sheet at reception notes every visitor. A LOG is the computer equivalent, a ' +
              'timestamped written record that a system keeps of things that happened on it. Modern ' +
              'systems are noisy recorders. Authentication systems log who signed in, from ' +
              'where, and when, and whether they failed first. Operating systems can record process ' +
              'creation, so a program being run leaves a trace. Networks log connections: which host ' +
              'talked to which, on what port, and how much data moved. Applications log their own ' +
              'events, and security tools log what they blocked or flagged. The default assumption a ' +
              'tester should carry is that almost everything they do lands in a log somewhere.\n\n' +
              'This does not make attackers helpless, and understanding why is the heart of this ' +
              'module. A log entry only becomes a detection if something or someone reads it, ' +
              'recognises it as suspicious, and acts. Organisations generate so many log lines that ' +
              'no human reads most of them, and automated detection only catches the patterns it was ' +
              'built to catch. So the attacker\'s goal is not the impossible one of leaving no trace; ' +
              'it is leaving traces that blend into the vast, boring background nobody investigates. ' +
              'Knowing what gets logged is step one, because you cannot reason about blending in ' +
              'until you know what record you are trying to blend into.',
          },
          options: [
            { id: 'a', label: 'Logging in to a server with a valid account.' },
            { id: 'b', label: 'A host opening an outbound network connection to another system.' },
            { id: 'c', label: 'Running a program on a system with process logging enabled.' },
            { id: 'd', label: 'Reading the attacker\'s own private notes on their own laptop.' },
          ],
          hints: [
            'Three of these happen on the target and touch systems that keep records. One happens entirely on the attacker\'s own machine.',
            'Logins, network connections, and process creation are all commonly logged on the target.',
            'What the attacker does on their own laptop leaves no trace on the target.',
          ],
          solution:
            'A, B, and C. A login, an outbound connection, and running a program are all commonly ' +
            'recorded on the target when ordinary logging is on. D leaves no trace on the target: ' +
            'reading private notes on the attacker\'s own laptop never touches the victim\'s ' +
            'systems, so nothing there records it.',
          expectedOutput: 'Options A, B, and C selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c'],
              hint:
                'Keep the three that happen on the target\'s systems. Drop the one that happens only ' +
                'on the attacker\'s own machine.',
            },
          ],
          debrief:
            'The default assumption should be "this is logged". The attacker\'s real question is ' +
            'never "will it be recorded" but "will anyone read the record and understand it".',
          practice: [],
        },
        {
          id: 'rtf.9.2',
          moduleId: 'rtf.9',
          packageId: 'red-team-foundations',
          order: 2,
          title: 'Signal, noise, and fatigue',
          kind: 'short-answer',
          goal: 'Explain why heavy logging does not guarantee detection.',
          prompt:
            'A company logs everything, yet an intrusion went unnoticed for weeks. In two or three ' +
            'sentences, explain how thorough logging and missed detection can both be true at once.',
          teach: {
            concept:
              'A building can have a camera on every hallway and still miss a break-in, if nobody is ' +
              'ever actually watching the hundred hours of footage those cameras produce every day. ' +
              'There is a gap between recording an event and detecting an attack, and attackers live ' +
              'in that gap. A large organisation generates enormous volumes of log data every day, ' +
              'far more than any team could read. Detection therefore depends on automated rules ' +
              'that flag patterns believed to be suspicious, and on analysts who investigate the ' +
              'resulting alerts. Both have limits: rules only catch what they were written to catch, ' +
              'and analysts can only work through so many alerts in a shift.\n\n' +
              'The result is a signal-to-noise problem, made worse by alert fatigue. When a system ' +
              'produces thousands of alerts, most of them false alarms, the real one is a needle in ' +
              'a haystack, and a team drowning in false positives learns, understandably, to ' +
              'dismiss quickly -- which is exactly when the true alert gets waved away. Attackers ' +
              'exploit this deliberately: they keep their activity low and slow so it never crosses ' +
              'a threshold, they mimic normal behaviour so no rule matches, and they rely on the ' +
              'fact that the evidence, though present in the logs, will sit unread among millions of ' +
              'benign lines. Thorough logging and missed detection are not a contradiction; they are ' +
              'the normal state of affairs unless someone is actively turning logs into detections.',
          },
          hints: [
            'Recording an event and detecting an attack are two different things. What sits between them?',
            'Think about volume: how many log lines a big company produces, and how few a human can read.',
            'A good answer names that the evidence exists but is buried in noise, so nobody reads or recognises it in time.',
          ],
          solution:
            'Logging records events, but detection requires someone or something to read those ' +
            'records, recognise the attack, and act -- and a large company produces far more log ' +
            'data than any team can review. The real evidence was there, but buried among millions ' +
            'of benign lines and false alarms, so automated rules did not match it and fatigued ' +
            'analysts never surfaced it. Attackers stay low and slow precisely to keep their ' +
            'activity in that unread noise.',
          expectedOutput:
            'An answer explaining that logging is not detection: the evidence existed but was buried ' +
            'in volume and noise, so nobody read or recognised it in time.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['volume', 'noise', 'too many', 'millions', 'buried', 'haystack', 'overwhelm', 'fatigue', 'thousands'],
                ['read', 'detect', 'recognis', 'recogniz', 'notice', 'review', 'investigate', 'act', 'surface'],
              ],
              hint:
                'Two ideas: that the sheer volume of logs buries the evidence, and that nobody read ' +
                'or recognised it in time.',
            },
          ],
          debrief:
            'This is the exact skill the log-analysis and triage packages teach from the defender\'s ' +
            'side: turning a mountain of logs into the few that matter. The attacker is betting you ' +
            'cannot.',
          practice: [],
        },
        {
          id: 'rtf.9.3',
          moduleId: 'rtf.9',
          packageId: 'red-team-foundations',
          order: 3,
          title: 'What evasion actually is',
          kind: 'multiple-choice',
          goal: 'Correct the naive idea of evasion as invisibility.',
          prompt:
            'Which statement best describes what practical detection evasion actually means for an ' +
            'attacker?',
          teach: {
            concept:
              'A thief who wants to leave no trace at all cannot exist in the real world; even ' +
              'walking across a room disturbs the dust. The realistic goal is not to leave no ' +
              'footprint, it is to leave a footprint that looks like everyone else\'s. EVASION on a ' +
              'computer network works the same way. Beginners imagine evasion as invisibility, a way ' +
              'to touch systems and leave no trace at all. That is not how it works. As the earlier ' +
              'exercises showed, activity ' +
              'gets logged, so the realistic goal is not to leave no evidence but to leave evidence ' +
              'that does not stand out. Evasion is camouflage, not invisibility: you make your ' +
              'actions resemble the legitimate activity all around them, so that the traces you ' +
              'inevitably create blend into the noise instead of rising above it.\n\n' +
              'Concretely, that means using tools already present on the system rather than dropping ' +
              'obvious malware, working during business hours when your traffic joins everyone ' +
              'else\'s, keeping data transfers within normal volumes, and spreading activity out so ' +
              'no single burst crosses an alerting threshold. Each of these is a way of looking ' +
              'ordinary. It also means accepting that detection is always possible and planning for ' +
              'it -- having a backup path, knowing when to go quiet -- rather than betting everything ' +
              'on never being seen. The professional attacker does not assume invisibility; they ' +
              'assume they are one anomaly away from an alert and behave accordingly.',
          },
          options: [
            { id: 'a', label: 'Making your activity blend into normal, expected behaviour so the traces you leave do not stand out.' },
            { id: 'b', label: 'Finding a technique that leaves absolutely no trace anywhere.' },
            { id: 'c', label: 'Disabling all logging on every system before doing anything.' },
            { id: 'd', label: 'Working so fast that logs cannot keep up.' },
          ],
          hints: [
            'Earlier exercises established that activity gets logged. So evasion cannot mean leaving no trace.',
            'Think camouflage, not invisibility. The traces exist; the goal is that they do not stand out.',
            'The right answer is about blending in, not about erasing evidence or outrunning the logs.',
          ],
          solution:
            'A. Practical evasion is camouflage: making your activity resemble normal behaviour so ' +
            'the traces you inevitably leave blend into the noise. B is the naive fantasy of leaving ' +
            'no trace, which the logging exercises already ruled out; C (disabling all logging) is ' +
            'itself a huge, obvious event; and D (outrunning logs) does not reflect how logging ' +
            'works. Evasion assumes you will be recorded and aims not to be noticed.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Pick the option about blending in. The others assume you can erase or outrun the ' +
                'evidence, which you cannot.',
            },
          ],
          debrief:
            'Reframing evasion as "look normal" rather than "leave no trace" is the mental shift ' +
            'that separates a realistic operator from someone chasing a fantasy of invisibility.',
          practice: [],
        },
        {
          id: 'rtf.9.4',
          moduleId: 'rtf.9',
          packageId: 'red-team-foundations',
          order: 4,
          title: 'Pick the quietest move',
          kind: 'multiple-choice',
          goal: 'Apply evasion principles to choose the least conspicuous action.',
          prompt:
            'You need to copy a set of files off a Northwind file server. Which approach is the ' +
            'LEAST likely to stand out to a watchful defender?',
          teach: {
            concept:
              'Knowing that camouflage exists is useless if you cannot actually pick the outfit that ' +
              'blends in when it matters. Evasion principles are only worth anything when they change ' +
              'what you actually do, so the test of understanding is choosing the quieter option ' +
              'under pressure. The same ' +
              'objective -- here, copying some files -- can be pursued in ways that range from ' +
              'screamingly obvious to nearly invisible, and the difference is entirely in how much ' +
              'the method resembles normal activity. A huge transfer at three in the morning to an ' +
              'unfamiliar external address is the kind of anomaly detection systems are built to ' +
              'catch. A small amount of data, moved during working hours, to somewhere the ' +
              'organisation already sends data, looks like an employee doing their job.\n\n' +
              'The principles in play are the ones from the concept material: blend in on timing ' +
              '(work when others work), on volume (stay within normal transfer sizes), and on ' +
              'destination (use a place the network already trusts). None of these is exotic; they ' +
              'are just the discipline of asking, before every action, what normal looks like here ' +
              'and how to resemble it. The loud approaches are loud because they violate several of ' +
              'those at once -- odd hour, large volume, unknown destination -- and each violation is ' +
              'another chance for an alert to fire.',
          },
          options: [
            { id: 'a', label: 'Copy a small batch during business hours to a cloud location the company already uses.' },
            { id: 'b', label: 'Transfer everything at once at 3am to an unfamiliar external address.' },
            { id: 'c', label: 'Compress the whole set into one huge archive and push it out in a single burst.' },
            { id: 'd', label: 'Email the entire dataset as one enormous attachment to an outside address.' },
          ],
          hints: [
            'Score each option on timing, volume, and destination. Which one is normal on all three?',
            'A 3am transfer, a huge single burst, and a giant email attachment each break at least one norm.',
            'Small, in-hours, to a destination the company already uses on all counts looks like ordinary work.',
          ],
          solution:
            'A. A small transfer during business hours to a destination the company already uses ' +
            'blends in on timing, volume, and destination all at once, so it is the least likely to ' +
            'stand out. B (odd hour, large volume, unknown destination), C (one huge burst), and D ' +
            '(a giant attachment to an outside address) each violate one or more norms, and every ' +
            'violation is another chance to trigger an alert.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Only one option is unremarkable on timing, volume, and destination together. The ' +
                'rest each break at least one.',
            },
          ],
          debrief:
            'This is exactly the reasoning the exfiltration module builds on next: the quietest way ' +
            'out is the one that looks most like something the organisation does every day.',
          practice: [],
        },
      ],
    },
    {
      id: 'rtf.10',
      packageId: 'red-team-foundations',
      order: 10,
      title: 'Exfiltration and impact',
      summary:
        'Getting data out without tripping the wire, and reasoning honestly about what a breach ' +
        'actually costs. The end of the attack, where objective meets consequence.',
      exercises: [
        {
          id: 'rtf.10.1',
          moduleId: 'rtf.10',
          packageId: 'red-team-foundations',
          order: 1,
          title: 'Exfiltration under a watchful eye',
          kind: 'multiple-choice',
          goal: 'Choose an exfiltration approach that respects monitoring constraints.',
          prompt:
            'Northwind runs data-loss-prevention tooling and watches outbound traffic. An attacker ' +
            'needs to remove a sensitive dataset. Which approach best fits those constraints?',
          teach: {
            concept:
              'A jewel thief can pick a lock silently and stand in the vault for hours without ' +
              'triggering anything, but the moment they try to carry the jewels out past the loading ' +
              'dock, they cross the one checkpoint built specifically to catch exactly that. ' +
              'EXFILTRATION is the act of getting stolen data out of the target network, and it is ' +
              'frequently the moment an intrusion gets caught, because moving data is inherently ' +
              'visible in a way that quietly reading it is not. Defenders know this and watch for it ' +
              'with data-loss-prevention tools and outbound traffic monitoring tuned to spot large ' +
              'or unusual transfers. So exfiltration is where every evasion principle from the ' +
              'previous module comes due at once: timing, volume, and destination all matter, and ' +
              'getting any of them wrong can undo an otherwise flawless operation.\n\n' +
              'Against active monitoring, the winning approaches are slow, small, and camouflaged. ' +
              'Rather than one enormous transfer, the attacker breaks the data into modest pieces ' +
              'and moves them gradually, staying under the volume thresholds that trigger alerts, ' +
              'and routes them to destinations the organisation already trusts so the traffic looks ' +
              'routine. The trade is patience for stealth: a slow trickle over days is far less ' +
              'likely to be noticed than a fast dump in minutes. The naive approaches fail for the ' +
              'mirror-image reason -- a single massive transfer to an unknown external host is ' +
              'precisely the signature DLP exists to catch.',
          },
          options: [
            { id: 'a', label: 'Move the data slowly, in small pieces, to a destination the organisation already trusts.' },
            { id: 'b', label: 'Dump the entire dataset in one fast transfer to an unknown external server.' },
            { id: 'c', label: 'Upload the whole archive to a brand-new external site in a single burst.' },
            { id: 'd', label: 'Ignore the monitoring and hope nobody is watching tonight.' },
          ],
          hints: [
            'DLP and outbound monitoring are tuned to spot large, unusual transfers. What is the opposite of that?',
            'Think slow, small, and to a trusted destination, rather than fast, large, and to an unknown one.',
            'Three options are one big, obvious transfer or a gamble. One is patient and camouflaged.',
          ],
          solution:
            'A. Against DLP and outbound monitoring, moving data slowly in small pieces to an ' +
            'already-trusted destination stays under the volume thresholds and looks routine, which ' +
            'is the approach most likely to succeed. B and C are single large transfers to unknown ' +
            'hosts -- exactly the signature the monitoring is built to catch -- and D (just hoping) ' +
            'is not a plan at all.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'Pick the patient, small, trusted-destination option. The others are the loud ' +
                'transfer DLP is designed to flag.',
            },
          ],
          debrief:
            'Exfiltration is where evasion is tested hardest, because moving data is intrinsically ' +
            'visible. Slow, small, and trusted beats fast, large, and unknown every time monitoring ' +
            'is real.',
          practice: [],
        },
        {
          id: 'rtf.10.2',
          moduleId: 'rtf.10',
          packageId: 'red-team-foundations',
          order: 2,
          title: 'Staging and timing',
          kind: 'short-answer',
          goal: 'Explain why attackers stage data and spread transfers over time.',
          prompt:
            'Before exfiltrating, attackers often gather the data they want into one internal ' +
            'location first, then move it out gradually over days rather than all at once. In two ' +
            'or three sentences, explain what staging and slow timing each buy the attacker.',
          teach: {
            concept:
              'A shoplifter who wants to walk out with an entire cart of goods first quietly gathers ' +
              'everything into one bag near the exit, then waits for a quiet moment rather than ' +
              'making one dramatic dash past the till. Careful exfiltration usually has two stages ' +
              'for the same reason, and each solves a different problem. STAGING is the quiet internal ' +
              'step: the attacker collects the data they want from ' +
              'wherever it lives into a single location inside the network they control. Moving data ' +
              'between internal systems is far less scrutinised than moving it out, so staging lets ' +
              'the attacker assemble everything without yet crossing the boundary that DLP watches. ' +
              'It also means that when the risky outbound step comes, it is a single organised push ' +
              'rather than many separate reaches across the network, each of which could be ' +
              'noticed.\n\n' +
              'Timing is the second stage, and it addresses the volume problem directly. Detection ' +
              'tuned to spot large transfers can be defeated by never making a large transfer: ' +
              'breaking the staged data into small chunks and moving them gradually keeps each ' +
              'individual transfer under the threshold that would trigger an alert. The cost is ' +
              'patience -- exfiltration over days instead of minutes -- but that patience is what ' +
              'keeps the operation beneath the alerting line. Together, staging buys you an organised, ' +
              'low-profile assembly step, and slow timing buys you an outbound flow quiet enough to ' +
              'miss.',
          },
          hints: [
            'Staging happens inside the network; timing governs how the data leaves. Ask what each one avoids.',
            'Moving data between internal machines is less watched than moving it out; small slow transfers stay under volume alerts.',
            'A good answer names that staging assembles data quietly inside, and slow timing keeps each transfer under detection thresholds.',
          ],
          solution:
            'Staging assembles the wanted data into one internal location the attacker controls, and ' +
            'because internal movement is far less scrutinised than outbound movement, this happens ' +
            'quietly and turns the risky step into a single organised push. Slow timing then breaks ' +
            'that data into small chunks moved over days, so no single transfer crosses the volume ' +
            'threshold that would trigger an alert. Staging buys a low-profile assembly step; slow ' +
            'timing buys an outbound flow quiet enough to be missed.',
          expectedOutput:
            'An answer explaining that staging quietly assembles data internally, and slow timing ' +
            'keeps each outbound transfer under detection thresholds.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['stag', 'gather', 'assemble', 'collect', 'internal', 'one location', 'one place'],
                ['slow', 'small', 'gradual', 'over time', 'chunk', 'threshold', 'volume', 'under', 'over days'],
              ],
              hint:
                'Two ideas: that staging assembles data quietly inside, and that slow, small ' +
                'transfers stay under volume alerts.',
            },
          ],
          debrief:
            'Staging and timing are the exfiltration form of the whole module\'s lesson: reduce the ' +
            'moment of maximum visibility, and spread what remains until it hides in the noise.',
          practice: [],
        },
        {
          id: 'rtf.10.3',
          moduleId: 'rtf.10',
          packageId: 'red-team-foundations',
          order: 3,
          title: 'The shapes of impact',
          kind: 'multiple-choice',
          goal: 'Recognise that breach impact goes well beyond the data itself.',
          prompt:
            'Northwind suffers a breach of customer records. Beyond the stolen data itself, which of ' +
            'these are real forms of impact the organisation may face? Select all that apply.',
          teach: {
            concept:
              'A house fire does not only destroy what burns. There is smoke damage in rooms the ' +
              'fire never reached, the cost of temporarily housing the family elsewhere, the ' +
              'insurance premium going up afterward, and the fact that the house is now harder to ' +
              'sell. IMPACT, the final phase of an attack, works the same way: it is the actual harm ' +
              'done, which is also the ' +
              'reason the whole engagement matters. It is a mistake to think of impact as only the ' +
              'data that left the building. A serious breach radiates cost across several ' +
              'dimensions. There is operational impact, when systems are down or work stops. There ' +
              'is financial impact, from the direct cost of investigation and recovery to lost ' +
              'revenue. There is regulatory impact, because laws governing personal, health, and ' +
              'payment data carry real penalties for failing to protect it. And there is ' +
              'reputational impact, the slow erosion of customer trust that can outlast every other ' +
              'cost.\n\n' +
              'Thinking across all of these is what turns a technical finding into a business ' +
              'argument, which is the language executives actually fund decisions in. A red team ' +
              'report that says "we reached the customer database" is far weaker than one that says ' +
              '"we reached the customer database, which would mean regulatory penalties, notification ' +
              'costs, downtime, and lasting reputational damage". The point of understanding impact ' +
              'is not to be dramatic; it is to connect what an attacker can do to what the ' +
              'organisation stands to lose, so that the effort to prevent it can be weighed honestly ' +
              'against the harm it avoids.',
          },
          options: [
            { id: 'a', label: 'Regulatory penalties for failing to protect personal or payment data.' },
            { id: 'b', label: 'The direct cost of investigation, recovery, and notifying affected customers.' },
            { id: 'c', label: 'Lasting reputational damage and lost customer trust.' },
            { id: 'd', label: 'Operational disruption if systems have to be taken offline to respond.' },
            { id: 'e', label: 'The organisation automatically becoming immune to future attacks.' },
          ],
          hints: [
            'Four of these are genuine costs of a breach. One is wishful thinking.',
            'Impact spans operational, financial, regulatory, and reputational dimensions.',
            'A breach does not make an organisation immune to anything. The other four are all real costs.',
          ],
          solution:
            'A, B, C, and D. Regulatory penalties, direct recovery and notification costs, ' +
            'reputational damage, and operational disruption are all real forms of breach impact ' +
            'that reach well beyond the stolen data. E is false: suffering a breach confers no ' +
            'immunity to future ones, and organisations are often targeted again precisely because ' +
            'they proved vulnerable.',
          expectedOutput: 'Options A, B, C, and D selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c', 'd'],
              hint:
                'Keep the four real costs across operations, finance, regulation, and reputation. ' +
                'Drop the fantasy about immunity.',
            },
          ],
          debrief:
            'Impact is the bridge from technical work to business decisions. A finding priced in ' +
            'these terms gets funded; a finding described only as "we got in" often does not.',
          practice: [],
        },
        {
          id: 'rtf.10.4',
          moduleId: 'rtf.10',
          packageId: 'red-team-foundations',
          order: 4,
          title: 'Why testers report impact in business terms',
          kind: 'short-answer',
          goal: 'Explain why a red team report translates findings into business consequences.',
          prompt:
            'A red team could end its report at "we reached the customer database." Instead, good ' +
            'reports translate that into likely regulatory, financial, and reputational ' +
            'consequences. In two or three sentences, explain why that translation makes the report ' +
            'more useful.',
          teach: {
            concept:
              'Telling a homeowner "the wiring in your attic is old" means little on its own. Telling ' +
              'them "the wiring in your attic is old, and that is the leading cause of house fires in ' +
              'homes your age, which is why your insurer would refuse a claim" is the sentence that ' +
              'actually gets the electrician called. A red team engagement is only valuable if it ' +
              'changes what the organisation does, and organisations act on risk they can weigh, not ' +
              'on technical facts they cannot ' +
              'interpret. "We reached the customer database" is a true statement that means little ' +
              'to the executives who control budgets, because it does not tell them what it would ' +
              'cost them. Translating the finding into likely consequences -- the regulatory ' +
              'penalties, the notification and recovery bill, the lost customers -- restates the ' +
              'technical result in the currency decisions are actually made in.\n\n' +
              'This translation is what lets a defender prioritise and a leader fund. A list of ' +
              'findings ranked only by technical severity does not tell anyone where to spend first; ' +
              'the same findings priced in business impact do, because now the cost of fixing a gap ' +
              'can be set against the cost of leaving it open. It is also simply more honest: the ' +
              'point of the engagement was never to prove cleverness but to help the organisation ' +
              'protect what matters, and you cannot help someone protect what matters until you have ' +
              'said, in their terms, what is at stake. The best testers are fluent in both languages ' +
              'and always finish by speaking the business one.',
          },
          hints: [
            'Ask who reads the report and what they need in order to act on it.',
            'Executives fund decisions based on cost and risk, not on the fact that a tester got in.',
            'A good answer names that business terms let leaders prioritise and fund fixes, and connect the finding to what is actually at stake.',
          ],
          solution:
            'Organisations act on risk they can weigh, and executives who control budgets cannot ' +
            'interpret "we reached the database" but can interpret regulatory penalties, recovery ' +
            'costs, and lost customers. Translating the finding into those consequences states it in ' +
            'the currency decisions are made in, so leaders can prioritise and fund the fix, setting ' +
            'the cost of closing the gap against the cost of leaving it open. It is also more ' +
            'honest, because the point was always to help them protect what matters.',
          expectedOutput:
            'An answer explaining that business-term impact lets decision-makers prioritise and fund ' +
            'fixes, because they act on weighable risk and cost rather than technical facts.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['business', 'cost', 'risk', 'consequence', 'money', 'financial', 'impact', 'stake'],
                ['decision', 'prioritis', 'prioritiz', 'fund', 'act', 'leader', 'executive', 'budget', 'fix'],
              ],
              hint:
                'Two ideas: that business-term impact expresses risk in the currency leaders use, ' +
                'and that this lets them prioritise or fund the fix.',
            },
          ],
          debrief:
            'This is the professional heart of the job: the finding is only half the deliverable. ' +
            'Saying what it means, in terms the organisation can act on, is the other half.',
          practice: [],
        },
      ],
    },
    {
      id: 'rtf.11',
      packageId: 'red-team-foundations',
      order: 11,
      title: 'Learning from real breaches',
      summary:
        'Five well-documented public incidents, read for their lessons. The lifecycle stops being ' +
        'abstract once you watch it play out in attacks that actually happened.',
      exercises: [
        {
          id: 'rtf.11.1',
          moduleId: 'rtf.11',
          packageId: 'red-team-foundations',
          order: 1,
          title: 'The supply-chain lesson',
          kind: 'multiple-choice',
          goal: 'Identify why supply-chain compromises are so powerful.',
          prompt:
            'In the SolarWinds incident, attackers inserted a backdoor into a trusted software ' +
            'vendor\'s update, which was then installed by thousands of that vendor\'s customers. ' +
            'What made this approach so effective?',
          teach: {
            concept:
              'The next two modules leave the abstract vocabulary behind and look at real, publicly ' +
              'documented breaches, because the attack lifecycle stops being an abstraction the ' +
              'moment you watch it play out against an actual company. If a single factory poisoned ' +
              'the ingredient it shipped to every bakery in the country, every loaf of bread made from ' +
              'it would be poisoned too, no matter how careful each individual bakery was. A ' +
              'SUPPLY-CHAIN ATTACK applies that same idea to software: instead of attacking a ' +
              'company\'s defences directly, an attacker poisons something upstream that the company ' +
              'trusts and installs without a second thought. The SolarWinds compromise, disclosed in ' +
              'late 2020, is the defining example of one. Rather than attacking thousands of ' +
              'organisations one by one, the ' +
              'intruders compromised a single trusted software vendor and hid a backdoor inside a ' +
              'routine product update. Every customer who installed that signed, legitimate-looking ' +
              'update installed the backdoor along with it, so one compromise propagated to thousands ' +
              'of downstream victims, including government agencies, through the trust those victims ' +
              'placed in their vendor.\n\n' +
              'The lesson is about trust as an attack surface. Organisations cannot inspect every ' +
              'line of every vendor\'s code, so they trust updates from suppliers they have vetted, ' +
              'and that trust is exactly what the attack exploited. It is effective because it turns ' +
              'a defender\'s reasonable behaviour -- applying updates promptly, from a trusted ' +
              'source -- into the delivery mechanism. The defensive response that grew out of it, ' +
              'often summarised as "trust but verify" and formalised in supply-chain security ' +
              'practices, accepts that you must depend on vendors while insisting on ways to detect ' +
              'when that dependence is being abused. It is the clearest reminder that your security ' +
              'is bounded by the security of everyone you rely on.',
          },
          options: [
            { id: 'a', label: 'It abused the trust customers place in vendor updates, so one compromise spread to thousands.' },
            { id: 'b', label: 'It relied on every victim having a weak password.' },
            { id: 'c', label: 'It exploited a single unpatched server at each victim independently.' },
            { id: 'd', label: 'It required physically visiting each affected organisation.' },
          ],
          hints: [
            'The attackers compromised one vendor, not thousands of victims directly. What did that buy them?',
            'The update was trusted and legitimate-looking, so victims installed it willingly.',
            'The power came from abusing the trust in the software supply chain, letting one compromise reach many.',
          ],
          solution:
            'A. The attack abused the trust customers place in updates from a vetted vendor, so a ' +
            'single compromise of that vendor spread automatically to thousands who installed the ' +
            'tainted update. It did not depend on weak passwords (B) or on separately exploiting ' +
            'each victim (C), and it certainly required no physical visits (D). Its power was the ' +
            'trusted delivery channel itself.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'One compromise reached thousands. Ask what shared thing all those victims trusted ' +
                'and installed.',
            },
          ],
          debrief:
            'Supply-chain attacks are feared because they scale through trust: your defences can be ' +
            'perfect and you are still exposed through the vendors you cannot fully inspect.',
          practice: [],
        },
        {
          id: 'rtf.11.2',
          moduleId: 'rtf.11',
          packageId: 'red-team-foundations',
          order: 2,
          title: 'The unpatched-flaw lesson',
          kind: 'multiple-choice',
          goal: 'Draw the core lesson from a breach caused by a known, unpatched vulnerability.',
          prompt:
            'In the Equifax breach, attackers exploited a known vulnerability in a web framework for ' +
            'which a patch had been available for months but was never applied. What is the ' +
            'clearest lesson for defenders?',
          teach: {
            concept:
              'A recall notice for a faulty car part protects nobody if the owner never actually ' +
              'takes the car in to have it replaced. Software has the exact same gap between a fix ' +
              'existing and a fix being applied, and PATCHING (installing the update that closes a ' +
              'known vulnerability) is how that gap gets closed. The Equifax breach of 2017 exposed ' +
              'the personal data of roughly 147 million people, and its cause was mundane: a critical ' +
              'vulnerability in a widely used web framework (a set of pre-built software components ' +
              'many applications are built on top of) had ' +
              'a patch available, and that patch was not applied in time. Attackers used the known, ' +
              'fixable flaw to get in and then reached vast quantities of sensitive data. There was ' +
              'no exotic zero-day and no unstoppable adversary -- just a gap between when a fix ' +
              'existed and when it was deployed, and that gap was long enough to be fatal.\n\n' +
              'The lesson is that patch management is not glamorous but is genuinely one of the most ' +
              'important defensive disciplines there is. Knowing about a vulnerability changes ' +
              'nothing until the fix is actually applied everywhere it is needed, and at scale that ' +
              'is hard: inventories are incomplete, systems are missed, changes are feared for ' +
              'breaking things. Attackers count on exactly this, and much of their work targets ' +
              'known flaws rather than new ones, because so many known flaws stay unpatched for so ' +
              'long. It connects directly to the vulnerability module earlier in this pathway: a ' +
              'CVSS score and a CVE are only useful if the organisation closes the loop and deploys ' +
              'the fix.',
          },
          options: [
            { id: 'a', label: 'Known vulnerabilities must actually be patched in time; awareness of a flaw is worthless until the fix is deployed.' },
            { id: 'b', label: 'Zero-day vulnerabilities are the only real threat.' },
            { id: 'c', label: 'Web frameworks should never be used.' },
            { id: 'd', label: 'The breach was unavoidable, since no defence could have helped.' },
          ],
          hints: [
            'The patch existed for months. What does that tell you the failure actually was?',
            'This was not an unknown flaw. It was a known, fixable one left unfixed.',
            'The lesson is about closing the gap between a fix being available and being applied.',
          ],
          solution:
            'A. The patch existed for months, so the failure was not knowing about the flaw but ' +
            'deploying the fix in time -- awareness is worthless until the patch is actually applied. ' +
            'B is wrong because this was the opposite of a zero-day; C is an overreaction (frameworks ' +
            'are fine when maintained); and D is false, since simply applying the available patch ' +
            'would have prevented it.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'A fix was available and not applied. The lesson is about that gap, not about ' +
                'unknown threats.',
            },
          ],
          debrief:
            'Unpatched known flaws cause more breaches than exotic new ones. Patch management is ' +
            'unglamorous and decisive, which is exactly the combination that gets it neglected.',
          practice: [],
        },
        {
          id: 'rtf.11.3',
          moduleId: 'rtf.11',
          packageId: 'red-team-foundations',
          order: 3,
          title: 'The third-party lesson',
          kind: 'multiple-choice',
          goal: 'Recognise how attackers exploit trusted third parties to reach a target.',
          prompt:
            'In the Target breach, attackers first compromised a heating-and-cooling contractor that ' +
            'had network access to Target, then used that access to pivot toward the payment ' +
            'systems. What weakness did this exploit?',
          teach: {
            concept:
              'A bank vault can have perfect walls and still be robbed if the cleaning crew\'s master ' +
              'key happens to open the vault door too, because nobody thought to check what a ' +
              'cleaner\'s key should and should not open. The Target breach of 2013 began exactly ' +
              'that way, somewhere nobody would think to defend hardest: a ' +
              'contractor responsible for heating and cooling, who had been given network access to ' +
              'do their job. Attackers compromised that third party first, then used its legitimate ' +
              'connection into Target\'s network as a bridge, moving from the low-value foothold ' +
              'toward the high-value payment systems. The initial victim had nothing to do with ' +
              'payments; it was simply a trusted party whose access could be borrowed.\n\n' +
              'The weakness exploited was insufficient segmentation and over-broad third-party ' +
              'access. A contractor who needed to reach only a narrow set of systems could instead ' +
              'reach far more, and once inside, the attackers were not sufficiently walled off from ' +
              'the sensitive environment. The lesson pairs two ideas this pathway has already ' +
              'introduced: your security includes the security of everyone you connect to, and ' +
              'network segmentation exists precisely to stop a foothold in one place from becoming ' +
              'access to everything. Give every partner only the access they truly need, and ' +
              'separate the sensitive systems so that reaching one thing does not mean reaching all ' +
              'things.',
          },
          options: [
            { id: 'a', label: 'Over-broad third-party access and weak segmentation let a foothold in a minor partner reach critical systems.' },
            { id: 'b', label: 'The contractor deliberately stole the payment data themselves.' },
            { id: 'c', label: 'Target had no antivirus anywhere on its network.' },
            { id: 'd', label: 'The payment systems were published openly on the internet.' },
          ],
          hints: [
            'The first victim was a contractor with network access, not a payment system. What did that access allow?',
            'Ask why a heating contractor could reach anywhere near payment systems at all.',
            'The lesson is about limiting partner access and separating sensitive systems so a small foothold cannot reach big targets.',
          ],
          solution:
            'A. The attack exploited over-broad access granted to a minor third party plus weak ' +
            'internal segmentation, so a foothold in the contractor could reach toward critical ' +
            'payment systems. The contractor was a victim, not a thief (B); the failure was ' +
            'architectural, not a total absence of antivirus (C); and the payment systems were not ' +
            'simply exposed to the internet (D). The fix is least-privilege partner access and real ' +
            'segmentation.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'A heating contractor could reach toward payment systems. That points at access ' +
                'scope and segmentation, not at antivirus.',
            },
          ],
          debrief:
            'Third-party access is a recurring first domino. Least privilege for partners and ' +
            'segmentation between systems are the controls that stop the domino from toppling the ' +
            'rest.',
          practice: [],
        },
        {
          id: 'rtf.11.4',
          moduleId: 'rtf.11',
          packageId: 'red-team-foundations',
          order: 4,
          title: 'Extracting your own lesson',
          kind: 'short-answer',
          goal: 'Generalise from a single credential-based breach to a defensive principle.',
          prompt:
            'The Colonial Pipeline ransomware attack began with a single compromised VPN account ' +
            'that had no multi-factor authentication. In two or three sentences, state the ' +
            'defensive lesson and explain why multi-factor authentication would have mattered.',
          teach: {
            concept:
              'A single spare key left under a doormat can, in principle, let someone into an entire ' +
              'house no matter how good every other lock is. The Colonial Pipeline attack of 2021 ' +
              'disrupted fuel supply across a large part of the ' +
              'eastern United States, and its entry point was strikingly small: a single VPN account ' +
              'whose credential had been compromised, protected by nothing but that password. The ' +
              'account was reportedly no longer even in active use, but it still worked, and it still ' +
              'led inside. From that one foothold the attackers were able to cause enormous ' +
              'operational impact. It is a stark illustration that the size of the entry point bears ' +
              'no relation to the size of the consequence.\n\n' +
              'The defensive lesson is the value of multi-factor authentication, and the danger of ' +
              'forgotten accounts. Multi-factor authentication means a stolen password alone is not ' +
              'enough to log in, because a second factor -- something the attacker does not have -- ' +
              'is also required. Had the VPN account required it, the compromised password would have ' +
              'been a dead end rather than a doorway. The wider principle, which this pathway has ' +
              'returned to repeatedly, is that credentials are the favourite way in, so controls ' +
              'that make a stolen credential insufficient by itself -- multi-factor authentication ' +
              'above all -- are among the highest-value defences an organisation can deploy. And ' +
              'every account that still works but nobody watches is a candidate for exactly this ' +
              'kind of quiet, catastrophic entry.',
          },
          hints: [
            'A single password was the whole door. What control would have made that password not enough?',
            'Multi-factor authentication requires a second factor the attacker does not have.',
            'A good answer names that MFA makes a stolen password insufficient, so the compromised account would not have granted access.',
          ],
          solution:
            'The lesson is that a stolen password should never be enough on its own, and that ' +
            'forgotten, still-working accounts are dangerous. Multi-factor authentication requires a ' +
            'second factor the attacker does not possess, so even with the compromised password the ' +
            'VPN login would have failed and the account would have been a dead end instead of a ' +
            'doorway. Because credentials are the favourite way in, MFA is one of the ' +
            'highest-value controls an organisation can deploy.',
          expectedOutput:
            'An answer stating that MFA makes a stolen password insufficient by requiring a second ' +
            'factor, so the compromised account would not have granted access.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['mfa', 'multi-factor', 'multifactor', 'second factor', 'two-factor', '2fa', 'extra factor'],
                ['stolen', 'password', 'credential', 'not enough', 'insufficient', 'alone', 'by itself'],
              ],
              hint:
                'Two ideas: that MFA adds a second factor, and that this makes a stolen password ' +
                'insufficient by itself.',
            },
          ],
          debrief:
            'One unwatched account without MFA disrupted fuel supply for a region. The size of the ' +
            'door tells you nothing about the size of the room behind it.',
          practice: [],
        },
      ],
    },
    {
      id: 'rtf.12',
      packageId: 'red-team-foundations',
      order: 12,
      title: 'Operational security, ethics, and readiness',
      summary:
        'The professional discipline that separates an authorised tester from a criminal: staying ' +
        'quiet, staying in bounds, handling detection well, and knowing you are ready.',
      exercises: [
        {
          id: 'rtf.12.1',
          moduleId: 'rtf.12',
          packageId: 'red-team-foundations',
          order: 1,
          title: 'What opsec actually covers',
          kind: 'multiple-choice',
          goal: 'Recognise the breadth of operational security for a tester.',
          prompt:
            'Operational security (opsec) for a red teamer is about not exposing the operation or ' +
            'themselves. Which of these are part of good opsec? Select all that apply.',
          teach: {
            concept:
              'A spy is undone as often by a careless habit, mentioning the mission to a friend, ' +
              'reusing a name they used on a previous job, as by any brilliant piece of counter-' +
              'espionage. OPERATIONAL SECURITY, or opsec, is the discipline of not giving yourself ' +
              'away, and for a red teamer it runs wider than most beginners expect. It covers ' +
              'technical measures, ' +
              'using dedicated infrastructure rather than personal accounts and devices, keeping ' +
              'communications encrypted, separating the tooling for one engagement from everything ' +
              'else -- but it also covers behaviour. Varying the timing of activity so it forms no ' +
              'obvious pattern, compartmentalising who knows what, and simply not talking about the ' +
              'operation where it could be overheard are all opsec. The through-line is denying ' +
              'observers the pieces they would need to connect the operation to you or to notice it ' +
              'at all.\n\n' +
              'Much of the value is defensive against your own mistakes. History is full of ' +
              'attackers caught not by brilliant investigation but by opsec failures: reusing a ' +
              'personal handle, bragging to the wrong person, leaving a personal device connected to ' +
              'operational infrastructure. For an authorised tester the stakes are different but the ' +
              'discipline is the same, because sloppy opsec ends the engagement early, contaminates ' +
              'the test, or exposes methods the client is paying to keep confidential. Good opsec is ' +
              'a habit of assuming you are being watched and behaving so that, if you are, the ' +
              'watcher still cannot assemble the picture.',
          },
          options: [
            { id: 'a', label: 'Using dedicated infrastructure rather than personal accounts and devices.' },
            { id: 'b', label: 'Keeping communications about the operation encrypted and compartmentalised.' },
            { id: 'c', label: 'Varying activity timing so it forms no obvious, predictable pattern.' },
            { id: 'd', label: 'Posting about the engagement on social media as it happens.' },
          ],
          hints: [
            'Three of these deny observers information. One hands it out freely.',
            'Opsec is about not giving yourself away, technically and behaviourally.',
            'Posting about a live operation is the classic opsec failure, not an example of good opsec.',
          ],
          solution:
            'A, B, and C. Dedicated infrastructure, encrypted and compartmentalised communication, ' +
            'and varied timing all deny observers the pieces they would need to notice the operation ' +
            'or trace it to you. D is the opposite: posting about a live engagement is a textbook ' +
            'opsec failure, the kind that has gotten many real attackers caught.',
          expectedOutput: 'Options A, B, and C selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a', 'b', 'c'],
              hint:
                'Keep the three that withhold information from observers. Drop the one that ' +
                'broadcasts the operation.',
            },
          ],
          debrief:
            'More attackers are undone by opsec slips than by defenders\' brilliance. For an ' +
            'authorised tester, the same slip ends the engagement or leaks methods the client paid ' +
            'to protect.',
          practice: [],
        },
        {
          id: 'rtf.12.2',
          moduleId: 'rtf.12',
          packageId: 'red-team-foundations',
          order: 2,
          title: 'The line that defines the job',
          kind: 'short-answer',
          goal: 'Articulate what separates an authorised red teamer from a criminal.',
          prompt:
            'A red teamer and a criminal may use identical techniques against identical systems. In ' +
            'two or three sentences, explain what actually separates the two, drawing on what this ' +
            'pathway began with.',
          teach: {
            concept:
              'Two surgeons can make an identical incision with an identical scalpel; one is healing ' +
              'a patient who consented to the operation, and the other, without that consent, has ' +
              'committed an assault. This pathway opened with authorisation, and it closes with it, ' +
              'because it is the single fact that defines the profession. A red teamer and a criminal ' +
              'can run the same ' +
              'scan, exploit the same flaw, and reach the same data; the actions are ' +
              'indistinguishable in isolation. What separates them is not skill or intent alone but ' +
              'a signed agreement: written permission from someone empowered to grant it, a defined ' +
              'scope, and rules of engagement that both bound the work and make it accountable. ' +
              'Remove that document and the identical action becomes a crime.\n\n' +
              'Professional ethics build on that foundation rather than replacing it. Staying within ' +
              'scope, protecting the data you can access rather than exploiting it, reporting ' +
              'honestly, and working to make the organisation stronger are what it means to hold the ' +
              'authorisation responsibly. The goal of an authorised engagement is the opposite of a ' +
              'criminal\'s: not to harm the organisation but to help it, by finding the weaknesses ' +
              'before someone who means harm does. Keeping that line bright -- authorisation first, ' +
              'scope always, and the client\'s benefit as the point -- is what lets a person do this ' +
              'work at all, and it is why the discipline of the paperwork matters as much as the ' +
              'skill of the attack.',
          },
          hints: [
            'The techniques are identical, so the difference is not technical. What did module one insist on before anything else?',
            'Think authorisation and scope, plus the purpose: to help the organisation, not harm it.',
            'A good answer names authorisation or a signed scope as the dividing line, and the intent to help rather than harm.',
          ],
          solution:
            'The techniques are identical, so what separates them is not skill but authorisation: a ' +
            'red teamer has written permission from someone empowered to grant it, a defined scope, ' +
            'and rules of engagement, and a criminal has none of that -- remove the document and the ' +
            'same action becomes a crime. On top of that sits purpose and ethics: the tester works ' +
            'within scope, protects the data they reach, and aims to help the organisation find its ' +
            'weaknesses before someone who means harm does.',
          expectedOutput:
            'An answer naming authorisation or a signed scope as the dividing line, plus the ' +
            'purpose of helping rather than harming the organisation.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['authoris', 'authoriz', 'permission', 'scope', 'consent', 'signed', 'contract', 'agreement', 'rules of engagement'],
                ['help', 'improve', 'protect', 'benefit', 'defend', 'not harm', 'find weakness', 'strengthen'],
              ],
              hint:
                'Two ideas: that authorisation or a signed scope is the dividing line, and that the ' +
                'purpose is to help rather than harm.',
            },
          ],
          debrief:
            'The pathway began and ends here on purpose. Every technique in it is neutral; the ' +
            'authorisation and the intent are what make the work a profession rather than a crime.',
          practice: [],
        },
        {
          id: 'rtf.12.3',
          moduleId: 'rtf.12',
          packageId: 'red-team-foundations',
          order: 3,
          title: 'Caught mid-engagement',
          kind: 'multiple-choice',
          goal: 'Choose the professional response when the blue team detects your activity.',
          prompt:
            'Mid-engagement, Northwind\'s blue team detects your activity and begins responding as ' +
            'if to a real intrusion. What is the professional thing to do?',
          teach: {
            concept:
              'A fire drill that the fire department mistakes for a real fire and responds to with ' +
              'trucks and sirens is not a disaster, provided the building manager can immediately ' +
              'show the fire crew the paperwork proving it was a planned drill. Being detected during ' +
              'a security assessment is not failure, either, often it is a success, because testing ' +
              'whether the defenders can catch you may be the whole point of the engagement. What ' +
              'matters is how ' +
              'you handle it. In a covert test, the responders genuinely believe they are dealing ' +
              'with a real attacker, and they may be about to spend a stressful night, escalate to ' +
              'management, or even involve law enforcement. Handling detection well means being ' +
              'ready to prove, quickly and calmly, that the activity is authorised.\n\n' +
              'This is what the "get out of jail" letter and a named point of contact are for. When ' +
              'detection triggers a real response, the tester contacts their agreed point of ' +
              'contact -- the person in the organisation who knows about the engagement -- and, if ' +
              'appropriate, produces the authorisation that proves the activity is sanctioned, so ' +
              'the response can be stood down without a real emergency. What you must not do is keep ' +
              'quiet and let the organisation burn resources on a phantom incident, and you must not ' +
              'panic or try to cover your tracks in a way that damages evidence or trust. The ' +
              'professional move is calm de-escalation through the channel you established before the ' +
              'engagement began, which is precisely why establishing it was a precondition of ' +
              'starting.',
          },
          options: [
            { id: 'a', label: 'Contact your agreed point of contact and, if appropriate, produce the authorisation to de-escalate.' },
            { id: 'b', label: 'Say nothing and let the blue team keep responding to a real-seeming incident.' },
            { id: 'c', label: 'Panic and try to erase all evidence of your activity.' },
            { id: 'd', label: 'Escalate your attack to finish before they lock you out.' },
          ],
          hints: [
            'You prepared for exactly this before starting. Who did you agree to call, and what can you show them?',
            'Letting a real response run its course wastes the organisation\'s resources and trust.',
            'The professional move is calm de-escalation through your point of contact, using the authorisation you already have.',
          ],
          solution:
            'A. The professional response is to reach your pre-agreed point of contact and, where ' +
            'appropriate, produce the authorisation, so a real-seeming incident can be stood down ' +
            'without wasting the organisation\'s resources. Saying nothing (B) burns their time and ' +
            'trust, erasing evidence (C) damages the engagement and the relationship, and escalating ' +
            '(D) turns a controlled test into genuine harm. This is exactly why a named contact and ' +
            'authorisation were preconditions in module one.',
          expectedOutput: 'Option A selected.',
          checks: [
            {
              type: 'choice-equals',
              optionIds: ['a'],
              hint:
                'You set up a contact and authorisation before you started. Detection is when you ' +
                'use them, calmly.',
            },
          ],
          debrief:
            'Detection often means the test worked. Handling it well -- calm de-escalation through ' +
            'your contact -- is itself a professional skill, and it is why the paperwork from module ' +
            'one exists.',
          practice: [],
        },
        {
          id: 'rtf.12.4',
          moduleId: 'rtf.12',
          packageId: 'red-team-foundations',
          order: 4,
          title: 'Are you ready',
          kind: 'short-answer',
          goal: 'Synthesise the pathway into a statement of what readiness means.',
          prompt:
            'This pathway has walked the whole attack lifecycle, from authorisation and ' +
            'reconnaissance through to impact, opsec, and ethics. In three or four sentences, ' +
            'describe what it means to be ready for adversarial red-versus-blue practice: what you ' +
            'should now be able to reason about, and the discipline that must underpin all of it.',
          teach: {
            concept:
              'A newly licensed driver is not ready for the road because they memorised a list of ' +
              'traffic laws in isolation. They are ready because they can watch a moving intersection ' +
              'and reason, in real time, about what every other driver is likely to do next, while ' +
              'never forgetting that the rules exist and apply to them too. Readiness for adversarial ' +
              'practice in this pathway means the same combination. It is not about knowing exploits; ' +
              'this pathway has ' +
              'deliberately taught almost none. It is about being able to reason through an ' +
              'engagement the way an attacker does and a defender must: understanding the attack ' +
              'lifecycle as a connected sequence, seeing how reconnaissance feeds initial access, ' +
              'how a foothold becomes persistence and then lateral movement and escalation, how ' +
              'evasion is camouflage rather than invisibility, and how it all ends in an impact ' +
              'measured in the organisation\'s own terms. Someone ready can look at a situation and ' +
              'reason about the likely next move, the quietest way to make it, and how a defender ' +
              'would try to catch it.\n\n' +
              'Underpinning all of that is the discipline the pathway opened and closed with: ' +
              'authorisation, scope, opsec, and ethics. The technical reasoning is only ' +
              'professional when it sits on that foundation, because the same knowledge that helps ' +
              'an organisation, used without permission, is a crime. Being ready means holding both ' +
              'at once -- the ability to think like an adversary, and the discipline to do it only ' +
              'where you are authorised, only within scope, and only to make the defenders stronger. ' +
              'The red-versus-blue practice ahead is where you exercise the first under the constant ' +
              'governance of the second.',
          },
          hints: [
            'Readiness here is about reasoning through the lifecycle, not memorising exploits.',
            'Name both halves: the ability to reason about the whole attack sequence, and the discipline of authorisation, scope, and ethics that must underpin it.',
            'A good answer covers reasoning across the lifecycle (recon to impact) and the ethical or authorisation discipline that governs all of it.',
          ],
          solution:
            'Being ready means you can reason through the whole attack lifecycle as a connected ' +
            'sequence -- how reconnaissance feeds access, how a foothold becomes persistence, ' +
            'lateral movement, and escalation, how evasion is blending in rather than vanishing, and ' +
            'how it ends in impact measured in the organisation\'s own terms. It means you can look ' +
            'at a situation and reason about the likely next move, the quietest way to make it, and ' +
            'how a defender would try to catch it. Underpinning all of it is the discipline this ' +
            'pathway opened and closed with: authorisation, scope, opsec, and ethics, without which ' +
            'the same reasoning is simply a crime.',
          expectedOutput:
            'An answer covering both reasoning across the attack lifecycle (from recon to impact) ' +
            'and the authorisation, scope, or ethical discipline that must govern it.',
          checks: [
            {
              type: 'answer-mentions',
              conceptGroups: [
                ['lifecycle', 'phase', 'recon', 'access', 'lateral', 'escalat', 'persist', 'sequence', 'next move', 'impact'],
                ['authoris', 'authoriz', 'scope', 'ethic', 'permission', 'opsec', 'discipline', 'responsib', 'legal'],
              ],
              hint:
                'Two ideas: reasoning across the attack lifecycle, and the authorisation, scope, or ' +
                'ethical discipline that must govern all of it.',
            },
          ],
          debrief:
            'That is the pathway in one thought: think like an adversary, act only where authorised. ' +
            'The war-room practice ahead exercises the first under the constant governance of the ' +
            'second.',
          practice: [],
        },
      ],
    },
  ],
};
