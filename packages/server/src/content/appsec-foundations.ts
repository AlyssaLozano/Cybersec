/**
 * Application Security Foundations: preventing the bug instead of responding to it.
 *
 * WHO THIS IS FOR
 *
 * This package is written for somebody who already reads code for a living: a
 * developer, a QA engineer, or anyone whose day job sits inside a codebase
 * rather than a network. That background is the fastest transfer into security
 * there is, because most of what an application security engineer does is
 * recognise a pattern in code, not operate a scanner. Where the wider
 * Application Security track eventually assumes some scripting, this
 * foundations package does not: if you can read a function and follow what it
 * does with a value, everything here is reachable.
 *
 * WHY IT NEEDS NO TERMINAL
 *
 * There is no simulated vulnerable web application in this platform, and
 * building one would teach a single, memorisable target rather than the
 * judgement that has to transfer to the next unfamiliar codebase, which is
 * the actual job. What can be taught honestly instead is the pattern
 * recognition that is most of the work anyway: reading a short snippet,
 * naming precisely what is wrong with it, and saying what a corrected version
 * would do differently. Every exercise here grades that judgement directly,
 * against a snippet shown as plain text and never against a system a student
 * pokes at. Where a code example earns its place it appears inside a prompt
 * or a teach block exactly as a reviewer meets it in a pull request: a few
 * lines, no more, because that is the size a finding actually arrives at.
 */

import type { Exercise, LearningPackage } from '@soc/shared';

// --- Module asf.1: the seat, not the buzzword --------------------------------

const SDLC_TEACH = {
  concept:
    'Application security is a set of activities spread across the whole development lifecycle, ' +
    'not a single gate near the end. In REQUIREMENTS and DESIGN it is threat modelling and choosing ' +
    'safe defaults before a line of code exists. In BUILD it is secure coding practice and review of ' +
    'a diff as it is written. In TEST it is scanning and targeted abuse cases run alongside the ' +
    'functional ones. In DEPLOY it is configuration: secrets handling, minimal permissions, pinned ' +
    'dependencies. In OPERATE it is watching for the flaw that only shows up under real traffic, and ' +
    'feeding what is learned back into the next design.\n\n' +
    'Two comparisons place the seat precisely. A PENETRATION TEST is a snapshot: an outside team ' +
    'attacks a system as it stands today, on a fixed schedule, usually once or twice a year. ' +
    'Application security is continuous and internal, embedded with the team that writes the code ' +
    'rather than visiting for one assessment window. A CODE STYLE AUDIT checks a different question: ' +
    'is this code readable and consistent, naming, formatting, structure. A security review asks what ' +
    'happens when a value crosses a trust boundary. Code can be beautifully styled and completely ' +
    'exploitable, and the reverse is just as common.',
} as const;

const SHIFT_LEFT_TEACH = {
  concept:
    'Shift left means moving a security activity earlier in the lifecycle, to the point where the ' +
    'same defect costs less to fix, not moving the responsibility for security earlier so somebody ' +
    'else can be blamed for it later. A flaw caught at design review costs a conversation. The same ' +
    'flaw caught in code review costs a changed diff before it merges. Caught in production it costs ' +
    'an incident, a patch under pressure, and sometimes a disclosure. The finding is identical in all ' +
    'three cases. Only the cost of fixing it has moved.\n\n' +
    'In practice, shift left is concrete work rather than a slogan. It looks like a threat model ' +
    'attached to a design document before it is approved, a static analysis tool wired into the pull ' +
    'request instead of run once a quarter, and security acceptance criteria written into a ticket ' +
    'alongside the functional ones. None of that removes the need for testing later. It reduces how ' +
    'much testing later has to find.',
} as const;

const MODULE_ASF_1: Exercise[] = [
  {
    id: 'asf.1.1',
    moduleId: 'asf.1',
    packageId: 'appsec-foundations',
    order: 1,
    title: 'Three jobs that get confused for one',
    kind: 'multiple-choice',
    goal: 'Separate application security from a penetration test and from a code style audit.',
    prompt:
      'A manager asks why the team needs an application security function when it already pays for ' +
      'an annual penetration test and a linter. Which of the following are accurate? Select all that ' +
      'apply.',
    teach: SDLC_TEACH,
    options: [
      { id: 'a', label: 'Application security is continuous work embedded with a development team, while a penetration test is a scheduled snapshot.' },
      { id: 'b', label: 'A code style audit and a security review can reach opposite conclusions about the same function, because they check different things.' },
      { id: 'c', label: 'Threat modelling at the design stage counts as application security work even though no code exists yet.' },
      { id: 'd', label: 'A flaw introduced the week after a penetration test finishes is invisible to that test until the next one.' },
      { id: 'e', label: 'Because the annual penetration test already covers the application, an internal application security function is largely redundant.' },
    ],
    hints: [
      'Four are accurate. One treats a once-a-year snapshot as equivalent to continuous coverage.',
      'Ask what changes about the codebase in the eleven months between penetration tests.',
      'Style and security are different questions asked of the same lines of code.',
    ],
    solution:
      'A, B, C, and D. Continuous work versus a scheduled snapshot, style versus security as separate ' +
      'questions, design-stage work counting before code exists, and the coverage gap a snapshot ' +
      'leaves behind it. E is the belief that gets application security functions cut before they ' +
      'prove their value: a penetration test samples the application as it existed on the day of ' +
      'testing, and every release shipped after that day is untested until the next one. Continuous ' +
      'review is what covers that gap, and it does not compete with the penetration test, it ' +
      'complements it.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint:
          'One option assumes an annual outside assessment gives the same coverage as an embedded ' +
          'function watching every release.',
      },
    ],
    debrief:
      'The penetration test still earns its place. An outside team finds what an inside team has ' +
      'stopped seeing. It is a complement to this seat, not a substitute for it.',
    practice: [],
  },
  {
    id: 'asf.1.2',
    moduleId: 'asf.1',
    packageId: 'appsec-foundations',
    order: 2,
    title: 'Shift left is a cost curve, not a slogan',
    kind: 'multiple-choice',
    goal: 'Recognise concrete shift-left practice and reject the version that just relocates blame.',
    prompt:
      'A colleague says the team is "shifting left" now. Which of the following are accurate ' +
      'descriptions of what that should mean in practice? Select all that apply.',
    teach: SHIFT_LEFT_TEACH,
    options: [
      { id: 'a', label: 'Catching a defect earlier in the lifecycle, where the same fix costs less, is the point of shifting left.' },
      { id: 'b', label: 'A threat model attached to a design document before it is approved is shift-left work in practice.' },
      { id: 'c', label: 'Static analysis wired into the pull request, rather than run once a quarter, is shift-left work in practice.' },
      { id: 'd', label: 'Security acceptance criteria written into a ticket alongside the functional ones is shift-left work in practice.' },
      { id: 'e', label: 'Shift left means moving the responsibility for security off the security function and onto developers, so it can focus elsewhere.' },
    ],
    hints: [
      'Four are accurate. One redefines the term as an org-chart move rather than a timing change.',
      'What actually gets cheaper when the same finding is caught earlier: the fix, or somebody to blame for it?',
      'Ask for one of the four concrete forms if somebody claims to be doing this.',
    ],
    solution:
      'A, B, C, and D. The cost curve, and three concrete forms it takes: a design-stage threat model, ' +
      'static analysis in the pull request, and acceptance criteria written alongside the functional ' +
      'ones. E is the version of the phrase that gets used to justify removing a review step: shifting ' +
      'left changes when a security activity happens, it does not mean nobody with security expertise ' +
      'needs to be involved. A team that hears "shift left" as "you are on your own now" has been sold ' +
      'the buzzword without the practice.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option turns a timing change into a headcount change.',
      },
    ],
    debrief:
      'Say "shift left" in an interview and be ready to name one of the four concrete practices above. ' +
      'An interviewer who has been sold the slogan version will ask, and will notice if you cannot.',
    practice: [],
  },
  {
    id: 'asf.1.3',
    moduleId: 'asf.1',
    packageId: 'appsec-foundations',
    order: 3,
    title: 'Where in the lifecycle this actually happens',
    kind: 'multiple-choice',
    goal: 'Map security activity onto the stage of the lifecycle it belongs to.',
    prompt:
      'You are drafting a one-page description of where application security activity fits across a ' +
      'release. Which of the following placements are correct? Select all that apply.',
    teach: {
      concept:
        'Placing an activity at the right stage is not pedantry, it decides who owns doing it and when ' +
        'it becomes too late to be cheap. Design-stage work is done by whoever is drafting the system, ' +
        'often before a security specialist is even in the room. Build-stage work belongs to the ' +
        'developer writing the diff and to whoever reviews it. Test-stage work belongs to quality ' +
        'engineering working alongside functional tests, not instead of them. Deploy-stage work is ' +
        'infrastructure and configuration, often owned by a platform team rather than the application ' +
        'team.\n\n' +
        'A design review is not a substitute for reviewing the code that implements the design. A ' +
        'threat model describes what SHOULD happen; the diff is what actually got written, on a ' +
        'Friday afternoon, by somebody who had to make a judgement call the design document did not ' +
        'cover. Both stages need their own attention, and skipping either one on the assumption the ' +
        'other already handled it is how a sound design ships with an unsound implementation.',
    },
    options: [
      { id: 'a', label: 'Choosing a safe default and modelling threats before a design is approved is design-stage work.' },
      { id: 'b', label: 'Reviewing how a diff handles a value crossing a trust boundary is build-stage work.' },
      { id: 'c', label: 'Running abuse-case tests alongside functional tests belongs at the test stage.' },
      { id: 'd', label: 'Pinning dependency versions and setting minimal runtime permissions is deploy-stage work.' },
      { id: 'e', label: 'Because the design was already reviewed for threats, the code that implements it does not need its own review.' },
    ],
    hints: [
      'Four are correct placements. One assumes an earlier review makes a later one unnecessary.',
      'A threat model describes the intended system. Who checks that the actual diff matches it?',
      'The judgement call a developer makes on a Friday afternoon is rarely in the design document.',
    ],
    solution:
      'A, B, C, and D. Each activity sits at the stage that owns it. E is the gap that lets a sound ' +
      'design ship with an unsound implementation: a threat model describes what should happen, and ' +
      'the diff is what a developer actually wrote under real constraints, which is why both stages ' +
      'get reviewed rather than one standing in for the other.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a design-stage review as covering the implementation too.',
      },
    ],
    debrief:
      'When you inherit a finding, the first useful question is which stage let it through, because ' +
      'that tells you whether the fix is a control, a checklist item, or a conversation with one team.',
    practice: [],
  },
  {
    id: 'asf.1.4',
    moduleId: 'asf.1',
    packageId: 'appsec-foundations',
    order: 4,
    title: 'What the role is actually measured by',
    kind: 'multiple-choice',
    goal: 'Choose outcomes that reflect security improving, rather than activity for its own sake.',
    prompt:
      'A new application security engineer is asked to report on progress after one quarter. Which of ' +
      'the following are meaningful things to report? Select all that apply.',
    teach: {
      concept:
        'A vulnerability count is the easiest number to produce and the least useful one on its own, ' +
        'because it goes up when you scan more and it goes up when the code gets worse, and a report ' +
        'that cannot tell those apart is not measuring anything.\n\n' +
        'Better signals track direction and behaviour rather than a raw total. A falling rate of the ' +
        'SAME recurring bug class across releases says the underlying cause is being fixed rather than ' +
        'the symptom. TIME TO FIX, from a finding being raised to it landing in production, says ' +
        'whether the process around a finding works. Developers bringing a design to review VOLUNTARILY, ' +
        'before being asked, is a sign of a working relationship rather than an enforced one. And a bug ' +
        'a linter or a habit caught before it was ever written up is still a result, even though no ' +
        'ticket exists to point at, because the goal was never to generate tickets.',
    },
    options: [
      { id: 'a', label: 'A falling rate of the same recurring bug class across releases is a better signal than a rising vulnerability count.' },
      { id: 'b', label: 'Time from a finding being raised to it being fixed is a meaningful measure of the process around it.' },
      { id: 'c', label: 'Developers bringing a design to review before being asked is a sign the relationship is working.' },
      { id: 'd', label: 'A flaw caught by a linter before it was ever written up is still a result, even with no ticket to show for it.' },
      { id: 'e', label: 'The clearest measure of an application security program is the raw number of vulnerabilities it finds each quarter.' },
    ],
    hints: [
      'Four are meaningful. One is the number that goes up regardless of whether security is actually improving.',
      'What happens to a raw vulnerability count when you buy a better scanner and nothing else changes?',
      'A result with no ticket attached to it can still be a real result.',
    ],
    solution:
      'A, B, C, and D. Trend of a recurring class, time to fix, voluntary engagement, and prevention ' +
      'that never generated a ticket. E rewards the wrong thing: a rising count can mean the codebase ' +
      'got worse, or it can mean you finally turned on a scanner that had been off for a year, and a ' +
      'report that cannot distinguish the two is not telling anybody anything true about the state of ' +
      'the software.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a raw count as meaningful without asking why it moved.',
      },
    ],
    debrief:
      'If you only ever report the count, expect to be judged by it, including in the quarter you ' +
      'finally fix the thing that was generating most of it.',
    practice: [],
  },
  {
    id: 'asf.1.5',
    moduleId: 'asf.1',
    packageId: 'appsec-foundations',
    order: 5,
    title: 'Explain the shift to a QA engineer',
    kind: 'short-answer',
    goal: 'Put into words how testing for exploitability differs from testing for correctness.',
    prompt:
      'A QA engineer who is very good at finding functional bugs is moving into application security ' +
      'and assumes the skill transfers directly. In three or four sentences, explain what actually ' +
      'changes about the job.',
    teach: {
      concept:
        'The transfer is real and it is incomplete, and saying which part is missing is the useful ' +
        'answer here. QA asks whether the system does what the specification says, across the inputs a ' +
        'real user is likely to produce, including the awkward ones found by being thorough. That ' +
        'thoroughness is genuinely valuable groundwork.\n\n' +
        'Security asks a different question: what can be made to happen that the specification never ' +
        'considered at all, by somebody who is not trying to use the system, they are trying to make ' +
        'it do something else entirely, and who will deliberately reach for the input a normal user ' +
        'would never think to try. That is an ADVERSARIAL mindset rather than a thorough one, and it ' +
        'means paying particular attention to TRUST BOUNDARIES, the points where a value arrives from ' +
        'outside the system and the code has to decide how much to believe it.',
    },
    hints: [
      'QA checks the system against its specification. What is being checked against here instead?',
      'Name the difference between a thorough tester and an adversarial one.',
      'A good answer names the shift from expected inputs to inputs nobody specified, and mentions where trust in a value gets decided.',
    ],
    solution:
      'QA testing checks the system against what the specification says it should do, across the ' +
      'inputs a real user is likely to produce, and that thoroughness is real groundwork rather than a ' +
      'wasted skill. Security testing asks a different question: what can be made to happen that the ' +
      'specification never considered, by somebody deliberately trying to break the intended behaviour ' +
      'rather than use it. That means an adversarial mindset rather than a thorough one, and it means ' +
      'paying close attention to the exact points where a value crosses into the system from outside ' +
      'and the code has to decide how much of it to trust.',
    expectedOutput:
      'An answer distinguishing testing against a specification from testing against an adversarial ' +
      'intent, and naming the trust boundary where an external value enters the system.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['adversar', 'attacker', 'malicious', 'hostile', 'deliberately'],
          ['specif', 'intend', 'expect', 'as designed', 'beyond what'],
          ['trust boundary', 'input', 'external', 'crosses', 'enters the system'],
        ],
        hint:
          'Three ideas: an adversarial rather than thorough intent, going beyond what the specification ' +
          'covers, and the trust boundary where an outside value enters the code.',
      },
    ],
    debrief:
      'Every module after this one is really an elaboration of this one distinction, applied to a ' +
      'different piece of code each time.',
    practice: [],
  },
];

// --- Module asf.2: injection at the code level -------------------------------

const SQLI_TEACH = {
  concept:
    'SQL injection happens when user-controlled text is concatenated directly into a query string, so ' +
    'the database cannot tell the difference between the query the developer wrote and text an ' +
    'attacker added to it. This snippet builds a login check by concatenation:\n\n' +
    "  query = \"SELECT * FROM users WHERE name = '\" + username + \"' AND pass = '\" + password + \"'\"\n\n" +
    "If username arrives as  ' OR '1'='1  the completed string becomes a WHERE clause that is always " +
    'true, and the query returns every row in the table rather than the one matching a real user. ' +
    'Nothing here required a clever password, only a value the developer never expected to be treated ' +
    'as anything other than plain text.\n\n' +
    'The fix is a PARAMETERISED QUERY, also called a prepared statement. The query text is sent to the ' +
    'database with placeholders, and the values are sent separately as data:\n\n' +
    "  query = \"SELECT * FROM users WHERE name = ? AND pass = ?\"\n" +
    '  execute(query, [username, password])\n\n' +
    'The database now knows, structurally, which part is code and which part is data, so nothing the ' +
    'value contains can change the shape of the query. This is not an escaping trick that catches one ' +
    'more special character. It removes the category of bug entirely, because the two channels never ' +
    'get mixed back together.',
} as const;

const COMMAND_INJECTION_TEACH = {
  concept:
    'Command injection is the same failure in a different interpreter: user-controlled text reaches a ' +
    'shell, and the shell treats part of it as a new command rather than as an argument. This snippet ' +
    'builds a ping command from a hostname a user submitted:\n\n' +
    '  os.system("ping -c 1 " + hostname)\n\n' +
    'If hostname arrives as  example.com; rm -rf /var/data  the shell runs the ping and then runs the ' +
    'second command, because a semicolon ends one shell command and starts the next. The developer ' +
    'wrote one command; the shell sees two.\n\n' +
    'Parameterised queries do not apply here, there is no database and no query, so the fix takes a ' +
    'different shape. The strongest option is avoiding the shell entirely, calling the program directly ' +
    'with its arguments passed as a list rather than a string the shell has to parse:\n\n' +
    '  subprocess.run(["ping", "-c", "1", hostname])\n\n' +
    'Passed this way, hostname is one argument regardless of what characters it contains, because no ' +
    'shell ever reinterprets it. Where a shell genuinely cannot be avoided, the input needs strict ' +
    'ALLOWLISTING, accepting only the narrow shape a hostname or filename can legitimately take, rather ' +
    'than trying to blocklist the punctuation an attacker might use, because a blocklist only ever ' +
    'covers the characters somebody remembered to list.',
} as const;

const MODULE_ASF_2: Exercise[] = [
  {
    id: 'asf.2.1',
    moduleId: 'asf.2',
    packageId: 'appsec-foundations',
    order: 1,
    title: 'One quote breaks the query',
    kind: 'multiple-choice',
    goal: 'Trace exactly how string concatenation turns user input into query structure.',
    prompt:
      'You are reviewing this login check.\n\n' +
      "  query = \"SELECT * FROM users WHERE name = '\" + username + \"' AND pass = '\" + password + \"'\"\n\n" +
      'Which of the following are true about it? Select all that apply.',
    teach: SQLI_TEACH,
    options: [
      { id: 'a', label: "A username submitted as  ' OR '1'='1  turns the WHERE clause into a condition that is always true." },
      { id: 'b', label: 'The database has no way to tell the developer intended text apart from text the attacker added, because both arrived in the same string.' },
      { id: 'c', label: 'The vulnerability exists regardless of how strong the real password on the account is.' },
      { id: 'd', label: 'The fix is a parameterised query, sending the SQL text and the values as two separate channels.' },
      { id: 'e', label: 'The fix is to reject any password containing a single quote, since that is the character used in the attack.' },
    ],
    hints: [
      'Four are true. One tries to patch the symptom by banning one character rather than closing the mechanism.',
      'Walk through what the completed string looks like once the quote character is substituted in.',
      'A blocklist of dangerous characters has to guess every character an attacker might use.',
    ],
    solution:
      'A, B, C, and D. The always-true clause, the mixed channel that causes it, the irrelevance of ' +
      'password strength once the WHERE clause is defeated, and the parameterised fix. E is a common ' +
      'first instinct that does not close the hole: quotes are not the only character that matters in ' +
      'every database dialect, and a filter tuned to todays attack is not tuned to tomorrows. ' +
      'Parameterisation removes the category of bug; character banning only removes the specific ' +
      'example you thought of.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats banning a single character as equivalent to separating code from data.',
      },
    ],
    debrief:
      'If you can complete the sentence "the database could not tell X from Y" about a piece of code, ' +
      'you have found an injection flaw whatever language or query engine it happens to be written in.',
    practice: [],
  },
  {
    id: 'asf.2.2',
    moduleId: 'asf.2',
    packageId: 'appsec-foundations',
    order: 2,
    title: 'A semicolon is not just punctuation',
    kind: 'multiple-choice',
    goal: 'Recognise command injection and why the SQL fix does not transfer directly.',
    prompt:
      'You are reviewing this diagnostic tool.\n\n' +
      '  os.system("ping -c 1 " + hostname)\n\n' +
      'Which of the following are true about it? Select all that apply.',
    teach: COMMAND_INJECTION_TEACH,
    options: [
      { id: 'a', label: "A hostname submitted as  example.com; rm -rf /var/data  causes the shell to run a second, unintended command." },
      { id: 'b', label: 'Parameterised queries are not the applicable fix here, since there is no database involved.' },
      { id: 'c', label: 'Calling the program directly with arguments passed as a list, rather than a string the shell parses, closes the hole.' },
      { id: 'd', label: 'Where a shell genuinely cannot be avoided, a strict allowlist for the expected shape of a hostname is stronger than a blocklist of dangerous characters.' },
      { id: 'e', label: 'Escaping the semicolon character in the input is sufficient, since that is the character that separates shell commands.' },
    ],
    hints: [
      'Four are true. One repeats the single-character fix from the previous exercise in a new language.',
      'A shell has more than one way to start a second command. A semicolon is only the most obvious.',
      'What does passing arguments as a list, rather than building a string, remove entirely?',
    ],
    solution:
      'A, B, C, and D. The second-command mechanism, the reason parameterisation does not apply, ' +
      'avoiding the shell as the strongest fix, and allowlisting as the fallback when a shell is ' +
      'unavoidable. E fails for the same reason it failed with SQL injection: a shell can chain ' +
      'commands with a semicolon, but also with a pipe, an ampersand, backticks, or a dollar-paren ' +
      'substitution, and a fix aimed at one of them leaves the others standing.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option blocks a single shell metacharacter and leaves the others available.',
      },
    ],
    debrief:
      'The pattern repeats across every interpreter you will ever review against: a query language, a ' +
      'shell, a template engine, an XML parser. Find where data and instructions travel down the same ' +
      'channel, and you have found the injection class before you have even named it.',
    practice: [],
  },
  {
    id: 'asf.2.3',
    moduleId: 'asf.2',
    packageId: 'appsec-foundations',
    order: 3,
    title: 'Why the fix is structural, not cosmetic',
    kind: 'multiple-choice',
    goal: 'Understand why parameterisation closes the hole rather than narrowing it.',
    prompt:
      'A colleague proposes several fixes for the login query from the earlier exercise. Which of the ' +
      'following statements about them are true? Select all that apply.',
    teach: {
      concept:
        'Several fixes for injection get proposed in most reviews, and only one of them changes the ' +
        'actual mechanism. ESCAPING quote characters before concatenation reduces the attack surface for ' +
        'the specific characters somebody thought to escape, but a database with a different quoting ' +
        'rule, a different encoding, or a second injection point the developer missed will still be ' +
        'exposed. An ORM, an object-relational mapper, is commonly assumed to be automatically safe, and ' +
        'most of the time its default methods are, because they parameterise underneath. But almost ' +
        'every ORM also offers a raw or literal query method for the cases its abstraction cannot ' +
        'express, and building that raw query by concatenation is exactly the original bug wearing a ' +
        'different library.\n\n' +
        'A STORED PROCEDURE is not automatically safe either: it is safe only if the procedure itself ' +
        'uses parameters internally rather than building a dynamic string from its own arguments. What ' +
        'actually closes the hole is keeping the query text and the values on two separate channels all ' +
        'the way down, regardless of which library sits on top of that mechanism.',
    },
    options: [
      { id: 'a', label: 'Escaping quote characters before concatenation reduces exposure to the specific characters somebody thought to escape, rather than removing the category of bug.' },
      { id: 'b', label: 'An ORM default method is usually safe because it parameterises underneath, but its raw or literal query escape hatch can reintroduce the same bug.' },
      { id: 'c', label: 'A stored procedure is only safe from injection if it uses parameters internally rather than building a dynamic string from its own arguments.' },
      { id: 'd', label: 'What closes the hole is keeping query text and values on separate channels all the way down, regardless of which library sits on top.' },
      { id: 'e', label: 'Using an ORM is sufficient by itself to rule out SQL injection anywhere in the codebase.' },
    ],
    hints: [
      'Four are true. One treats a library choice as a guarantee rather than a default that can be bypassed.',
      'Ask what happens the day a developer reaches for the raw query method because the ORM cannot express what they need.',
      'A stored procedure can still concatenate a string internally.',
    ],
    solution:
      'A, B, C, and D. Escaping as a narrower patch, the ORM raw-query trap, the stored procedure ' +
      'caveat, and the separate-channels principle underneath all of them. E is the belief that ' +
      'produces the finding in the first place: an ORM makes the safe path the easy path, it does not ' +
      'remove the unsafe path, and a determined or rushed developer will find the escape hatch the ' +
      'first time the abstraction gets in their way.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a library as a guarantee rather than a default with an escape hatch.',
      },
    ],
    debrief:
      'When you review a codebase that uses an ORM, search specifically for its raw or literal query ' +
      'method. That is where injection findings in supposedly safe codebases actually live.',
    practice: [],
  },
  {
    id: 'asf.2.4',
    moduleId: 'asf.2',
    packageId: 'appsec-foundations',
    order: 4,
    title: 'The check that only runs in the browser',
    kind: 'multiple-choice',
    goal: 'Recognise that client-side validation is not a security control.',
    prompt:
      'A team argues the login form is safe from injection because the web form validates the username ' +
      'field with a regular expression before submitting it. Which of the following are true? Select ' +
      'all that apply.',
    teach: {
      concept:
        'Client-side validation, code that runs in the browser before a request is sent, exists to give ' +
        'a fast, friendly error message. It is not a security control, because an attacker does not use ' +
        'the browser as intended: a request can be built and sent directly, with any tool that speaks ' +
        'HTTP, bypassing the form and its JavaScript entirely. The server never learns that a check was ' +
        'skipped, it just receives whatever arrived.\n\n' +
        'The only validation that matters for security is SERVER-SIDE, because the server is the only ' +
        'point the attacker cannot route around. Client-side checks are still worth having, for the ' +
        'experience of the honest user who mistyped a field, but they defend nothing, because removing ' +
        'or ignoring them costs an attacker nothing.',
    },
    options: [
      { id: 'a', label: 'An attacker can send a request directly, bypassing the browser form and any JavaScript validation entirely.' },
      { id: 'b', label: 'Client-side validation improves the experience for an honest user who mistyped a field.' },
      { id: 'c', label: 'The server has no way to know whether a request passed through the client-side check or not.' },
      { id: 'd', label: 'Server-side validation is the only validation that functions as a security control, because it is the only point an attacker cannot route around.' },
      { id: 'e', label: 'A regular expression validating the field in the browser is sufficient protection against injection, since it stops malformed input before submission.' },
    ],
    hints: [
      'Four are true. One assumes the attacker uses the same form the developer tested with.',
      'What does an attacker need to send a request that never touches the JavaScript on the page?',
      'Ask what the server actually knows about how a request was constructed.',
    ],
    solution:
      'A, B, C, and D. Bypassing the browser, the genuine usability value of client-side checks, the ' +
      'server blindness to how a request arrived, and server-side validation as the only real control. ' +
      'E confuses a usability feature for a security boundary: a check that lives in code the attacker ' +
      'controls, the browser, is not a check that constrains the attacker at all.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a check running on the attacker own machine as a control on the attacker.',
      },
    ],
    debrief:
      'Whenever a finding gets pushed back with "the form already validates that", the next question is ' +
      'always the same: does the server enforce it too, or only the browser.',
    practice: [],
  },
  {
    id: 'asf.2.5',
    moduleId: 'asf.2',
    packageId: 'appsec-foundations',
    order: 5,
    title: 'Write the finding for a concatenated query',
    kind: 'short-answer',
    goal: 'State the vulnerability and the fix for a concatenated query, in review-comment form.',
    prompt:
      'You are leaving a review comment on this line of code.\n\n' +
      "  query = \"SELECT * FROM orders WHERE customer = '\" + customerId + \"'\"\n\n" +
      'In three or four sentences, write the comment: what is wrong, and what change you want made.',
    teach: {
      concept:
        'A good finding names the mechanism, not just the label. Writing "this is SQL injection" without ' +
        'saying why leaves the developer to take it on faith, or to fix the wrong thing. Naming the ' +
        'mechanism, that customerId is concatenated directly into the query text so the database cannot ' +
        'distinguish code from data, gives them enough to see it themselves in the next file too.\n\n' +
        'A good finding also names the fix precisely rather than vaguely: not "sanitise the input" but ' +
        '"use a parameterised query, passing customerId as a bound value rather than concatenating it ' +
        'into the string". The second version is something a developer can act on immediately; the first ' +
        'invites a guess at what sanitise is supposed to mean here.',
    },
    hints: [
      'Name the specific variable and say what happens to it, rather than just naming the vulnerability class.',
      'State the fix as an instruction a developer could act on without asking a follow-up question.',
      'A strong answer says concatenation mixes code and data, and asks for a parameterised query with the value bound separately.',
    ],
    solution:
      'This concatenates customerId directly into the query text, so the database has no way to tell ' +
      'the intended query apart from anything an attacker manages to put into that value, which is SQL ' +
      'injection. Please rewrite this as a parameterised query, with a placeholder for the customer id ' +
      'and the value passed separately as a bound parameter, rather than built into the string. That ' +
      'closes the hole structurally rather than by trying to filter or escape the value first.',
    expectedOutput:
      'A comment naming the concatenation mechanism and requesting a parameterised or prepared-statement fix.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['concatenat', 'string build', 'mixed', 'directly into'],
          ['parameteris', 'prepared statement', 'bound', 'placeholder'],
          ['injection', 'code from data', 'cannot tell', 'cannot distinguish'],
        ],
        hint:
          'Three ideas: name the concatenation, name the injection risk it creates, and ask for a ' +
          'parameterised or prepared-statement fix specifically.',
      },
    ],
    debrief:
      'This exact comment, adjusted for the variable name, is one you will write dozens of times in a ' +
      'real review queue. Getting the phrasing efficient now saves real time later.',
    practice: [],
  },
];

// --- Module asf.3: cross-site scripting and output encoding ------------------

const XSS_TYPES_TEACH = {
  concept:
    'Cross-site scripting, XSS, happens when attacker-controlled text ends up running as script in ' +
    'somebody elses browser. The three variants differ in where the attacker text lives before it runs.\n\n' +
    'STORED XSS is saved on the server, in a comment field or a profile name, and served back to every ' +
    'visitor who views that page, which makes it the most dangerous variant: one submission, many ' +
    'victims, no interaction needed from any of them beyond loading the page. REFLECTED XSS travels in ' +
    'the request itself, typically a query parameter, and the server echoes it straight back into the ' +
    'response; it needs the victim to click a crafted link, which is why it usually arrives by email or ' +
    'message rather than by browsing normally. DOM-BASED XSS never touches the server at all: ' +
    'JavaScript already running in the page reads something like the URL fragment and writes it into ' +
    'the page unsafely, so the vulnerability lives entirely in client-side code and a server-side scan ' +
    'that only inspects responses can miss it completely.',
} as const;

const CONTEXT_ENCODING_TEACH = {
  concept:
    'Output encoding has to match the CONTEXT a value is written into, because each context has its own ' +
    'rules for which characters are special, and using the wrong rule leaves a gap.\n\n' +
    'In an HTML BODY, encoding < and > and & stops a value from being read as a new tag. But the same ' +
    'value placed inside an HTML ATTRIBUTE, say a quoted value inside an onclick or a href, is broken ' +
    'out of not by < but by a matching quote character, so attribute context needs quotes encoded and ' +
    'HTML-body encoding alone does not cover it. A value written into a JAVASCRIPT STRING inside a ' +
    '<script> block is broken out of by a quote or a backslash, neither of which HTML encoding touches ' +
    'at all, so a value that is perfectly safe in the HTML body can still end a JavaScript string early ' +
    'and let the rest of it execute as code. A value placed into a URL needs its own percent-encoding, ' +
    'for a different set of reserved characters again.\n\n' +
    'The practical result: there is no single "encode this" function that is correct everywhere. A ' +
    'review has to ask which context a value lands in, and check that the encoding actually applied ' +
    'matches that context rather than a different one that happened to be available.',
} as const;

const MODULE_ASF_3: Exercise[] = [
  {
    id: 'asf.3.1',
    moduleId: 'asf.3',
    packageId: 'appsec-foundations',
    order: 1,
    title: 'Same bug, three different deliveries',
    kind: 'multiple-choice',
    goal: 'Tell stored, reflected and DOM-based XSS apart by where the payload lives.',
    prompt:
      'Three separate findings come in describing cross-site scripting. Which of the following ' +
      'characterisations are accurate? Select all that apply.',
    teach: XSS_TYPES_TEACH,
    options: [
      { id: 'a', label: 'A script saved in a user profile field and served to every later visitor of that profile is stored XSS.' },
      { id: 'b', label: 'A script that only exists inside a crafted link, and requires the victim to click it, is reflected XSS.' },
      { id: 'c', label: 'A script that never touches the server, because client-side JavaScript reads the URL fragment and writes it unsafely into the page, is DOM-based XSS.' },
      { id: 'd', label: 'Stored XSS is generally the most dangerous of the three, because one submission can reach every subsequent visitor without any of them clicking anything crafted.' },
      { id: 'e', label: 'A server-side response scanner that inspects every HTTP response will reliably catch all three variants.' },
    ],
    hints: [
      'Four are accurate. One assumes a server-side view of traffic sees a bug that never touches the server.',
      'Ask where the malicious text actually lives just before it runs, in each variant.',
      'DOM-based XSS is defined by what it does NOT touch.',
    ],
    solution:
      'A, B, C, and D. Stored, reflected, DOM-based, and the relative danger of stored XSS as a ' +
      'one-to-many delivery. E misses the entire point of the DOM-based variant: it lives in ' +
      'client-side code operating on data the server never sees in the same form, such as a URL ' +
      'fragment after the hash, which is never even sent to the server. A response scanner that only ' +
      'reads what the server sent will not find a bug that occurs entirely inside the browser.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes server-visible traffic covers a variant defined by staying client-side.',
      },
    ],
    debrief:
      'When triaging a new XSS report, the first question is which of these three it is, because it ' +
      'decides where the fix actually goes: server-side output encoding for the first two, client-side ' +
      'code review for the third.',
    practice: [],
  },
  {
    id: 'asf.3.2',
    moduleId: 'asf.3',
    packageId: 'appsec-foundations',
    order: 2,
    title: 'Encoded for the wrong place',
    kind: 'multiple-choice',
    goal: 'Recognise that HTML-body encoding does not protect an attribute or a script context.',
    prompt:
      'A developer HTML-encodes a username everywhere it is displayed, then writes it into this ' +
      'attribute.\n\n' +
      '  <div onclick="showProfile(\'{{username}}\')">\n\n' +
      'Which of the following are true about it? Select all that apply.',
    teach: CONTEXT_ENCODING_TEACH,
    options: [
      { id: 'a', label: 'HTML-body encoding of < > and & does nothing to stop a value from ending the single-quoted JavaScript string it sits inside here.' },
      { id: 'b', label: 'A username containing a single quote followed by script can close the string and inject a new JavaScript expression into the handler.' },
      { id: 'c', label: 'The correct encoding for this position has to account for both the HTML attribute context and the JavaScript string context nested inside it.' },
      { id: 'd', label: 'The same username value could be perfectly safe in a plain HTML body and still unsafe in this attribute, because the two contexts have different special characters.' },
      { id: 'e', label: 'Since the username is HTML-encoded already, this attribute is safe against injected script.' },
    ],
    hints: [
      'Four are true. One assumes one encoding scheme covers every place a value lands.',
      'What character ends a single-quoted JavaScript string, and does HTML-body encoding touch it?',
      'This value is inside two nested contexts at once: an HTML attribute, and a JavaScript string within it.',
    ],
    solution:
      'A, B, C, and D. HTML-body encoding leaves the JavaScript-string-breaking characters untouched, ' +
      'the quote-and-script attack this enables, the double context this position sits in, and the ' +
      'general truth that safety in one context does not transfer to another. E is the mistake the ' +
      'whole exercise exists to correct: encoding was applied, and it was the wrong encoding for where ' +
      'the value actually landed.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats any encoding as sufficient regardless of which context it was designed for.',
      },
    ],
    debrief:
      'This is the single most common way a real codebase passes an automated XSS scanner and still ' +
      'ships a vulnerability: encoding is present, just aimed at the wrong context.',
    practice: [],
  },
  {
    id: 'asf.3.3',
    moduleId: 'asf.3',
    packageId: 'appsec-foundations',
    order: 3,
    title: 'innerHTML remembers nothing about where the text came from',
    kind: 'multiple-choice',
    goal: 'Judge a client-side snippet that writes user data into the page unsafely.',
    prompt:
      'You are reviewing this client-side code, which shows a welcome message using a name taken from ' +
      'the page URL.\n\n' +
      '  const name = new URLSearchParams(location.search).get("name");\n' +
      '  document.getElementById("welcome").innerHTML = "Hello, " + name;\n\n' +
      'Which of the following are true about it? Select all that apply.',
    teach: {
      concept:
        'INNERHTML parses whatever string it is given as HTML and inserts the result into the page, ' +
        'tags and all. It has no idea where the string came from, so a value containing a script tag or ' +
        'an event handler attribute is parsed and can execute exactly as if a developer had written it ' +
        'by hand.\n\n' +
        'TEXTCONTENT is the safer default for exactly this case: it inserts the string as literal text, ' +
        'never parsed as markup, so a name containing angle brackets is displayed as visible text rather ' +
        'than interpreted as a tag. Where actual HTML genuinely needs to be inserted, from a source that ' +
        'is not fully trusted, a sanitisation library that strips dangerous tags and attributes is the ' +
        'tool, not a hand-rolled filter. And a CONTENT SECURITY POLICY can reduce the damage a successful ' +
        'injection does, for instance by blocking inline scripts, but it is a second layer of defence, ' +
        'not a reason to skip fixing the innerHTML call.',
    },
    options: [
      { id: 'a', label: 'This is DOM-based XSS, because attacker-controlled text from the URL is written unsafely into the page by client-side code alone.' },
      { id: 'b', label: 'Replacing innerHTML with textContent would display an angle bracket in the name as visible text instead of parsing it as a tag.' },
      { id: 'c', label: 'A well-configured Content Security Policy can reduce the impact of this bug, but is not a substitute for fixing the innerHTML call.' },
      { id: 'd', label: 'A name value of  <img src=x onerror=alert(1)>  would be parsed as an element by innerHTML and its handler would run.' },
      { id: 'e', label: 'Because this value never touches the server, it falls outside what an application security review needs to cover.' },
    ],
    hints: [
      'Four are true. One tries to hand the whole client-side codebase off to somebody elses scope.',
      'What does innerHTML do with a string that looks like a tag, regardless of where the string came from?',
      'A defence-in-depth control is not the same as a fix.',
    ],
    solution:
      'A, B, C, and D. The DOM-based classification, textContent as the safer alternative, CSP as ' +
      'defence-in-depth rather than a fix, and the specific payload that would fire. E is the gap that ' +
      'lets DOM-based XSS survive server-focused reviews: client-side code is still application code, ' +
      'and a review that only inspects server responses will never see this bug at all.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option excludes client-side code from review scope entirely.',
      },
    ],
    debrief:
      'A rule of thumb worth keeping: if you see innerHTML built from anything other than a fixed ' +
      'string literal, stop and check where the other half came from.',
    practice: [],
  },
  {
    id: 'asf.3.4',
    moduleId: 'asf.3',
    packageId: 'appsec-foundations',
    order: 4,
    title: 'A policy is a net, not a wall',
    kind: 'multiple-choice',
    goal: 'Position Content Security Policy correctly relative to output encoding.',
    prompt:
      'A team proposes deploying a Content Security Policy instead of fixing several output encoding ' +
      'findings, on the basis that the policy will stop any script from running. Which of the following ' +
      'are true? Select all that apply.',
    teach: {
      concept:
        'A Content Security Policy tells the browser which sources of script, style and other content it ' +
        'is allowed to load and run, and a strict policy genuinely blocks large classes of injected ' +
        'script, particularly inline script and script from an attacker-controlled domain. That makes it ' +
        'a real and valuable control.\n\n' +
        'It is still a NET rather than a WALL. A policy that allows inline scripts for legacy reasons, or ' +
        'that allows script from a wide set of trusted-looking domains, leaves gaps a specific payload ' +
        'can fit through. A policy also does nothing about the underlying encoding bug: the value is ' +
        'still written into the page unsafely, the policy is only trying to stop what happens next. And a ' +
        'policy can be weakened by a single unsafe-inline exception added later to fix an unrelated ' +
        'problem, silently reopening everything it was protecting. The fix for an encoding bug is correct ' +
        'encoding; the policy sits alongside that as a second line of defence, not a replacement for the ' +
        'first.',
    },
    options: [
      { id: 'a', label: 'A strict Content Security Policy can block large classes of injected script, including inline script, and is a genuinely valuable control.' },
      { id: 'b', label: 'A policy does not fix the underlying encoding bug, it only tries to stop what an already-injected script can do next.' },
      { id: 'c', label: 'A single later exception added to the policy, such as allowing inline scripts for an unrelated fix, can silently reopen what it was protecting.' },
      { id: 'd', label: 'Output encoding and a Content Security Policy address the same risk at different layers, and a mature review expects both rather than either alone.' },
      { id: 'e', label: 'Deploying a strict Content Security Policy makes fixing the underlying output encoding findings unnecessary.' },
    ],
    hints: [
      'Four are true. One treats a second layer of defence as a replacement for the first.',
      'Ask what the policy actually does to the vulnerable line of code itself.',
      'What happens to a strict policy the first time somebody adds an exception to ship an unrelated feature quickly?',
    ],
    solution:
      'A, B, C, and D. The real value of a strict policy, its limits relative to the underlying bug, its ' +
      'fragility under later exceptions, and the case for using both layers together. E is the trade the ' +
      'team is trying to make, and it does not hold: the policy reduces the blast radius of a successful ' +
      'injection, it does not close the injection itself, and it can be weakened by the next unrelated ' +
      'change.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a second layer of defence as a substitute for fixing the first.',
      },
    ],
    debrief:
      'Recommend a Content Security Policy freely, it is worth having. Never accept it as the reason an ' +
      'encoding finding gets closed without a code change.',
    practice: [],
  },
  {
    id: 'asf.3.5',
    moduleId: 'asf.3',
    packageId: 'appsec-foundations',
    order: 5,
    title: 'Explain context-aware encoding to a developer',
    kind: 'short-answer',
    goal: 'Explain why one encoding function is not enough for every place a value is written.',
    prompt:
      'A developer says a value is already HTML-encoded everywhere it is used, so it cannot be ' +
      'responsible for the reflected XSS finding you raised, where the value is written inside a ' +
      "single-quoted JavaScript string in a <script> block. In three or four sentences, explain why " +
      'HTML encoding did not cover this case.',
    teach: {
      concept:
        'The developer is reasoning from one true fact, that HTML encoding is applied, to a false ' +
        'conclusion, that it applies everywhere. The missing idea is that encoding rules are tied to a ' +
        'CONTEXT: HTML-body encoding neutralises the characters that matter for breaking out of HTML, ' +
        'primarily angle brackets and ampersands, and does nothing to a quote or a backslash, which are ' +
        'exactly the characters that matter for breaking out of a JavaScript string.\n\n' +
        'A good answer names the specific context mismatch: the value sits inside a JavaScript string, not ' +
        'the HTML body, so it needs JavaScript-string encoding, or better, needs to be passed as data ' +
        'through a safe API rather than concatenated into a script block as text at all.',
    },
    hints: [
      'Name the specific context the value is actually written into, and the character that context cares about.',
      'HTML encoding protects against one set of characters. A JavaScript string is broken by a different set.',
      'A strong answer says encoding is context-specific, names the JavaScript-string context here, and says what character HTML encoding leaves untouched.',
    ],
    solution:
      'HTML encoding neutralises the characters that matter for breaking out of an HTML body, mainly ' +
      'angle brackets, and it does nothing to a quote or a backslash. This value is not sitting in the ' +
      'HTML body, it is inside a single-quoted JavaScript string in a script block, so the character that ' +
      'actually matters here is the quote that would end that string early, and HTML encoding leaves it ' +
      'completely untouched. The fix needs JavaScript-string-aware encoding for this position, or better, ' +
      'passing the value through a safe API rather than building it into the script text as a string at ' +
      'all.',
    expectedOutput:
      'An answer naming that encoding is context-specific, identifying the JavaScript-string context here, ' +
      'and naming the character HTML encoding fails to cover.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['context', 'html body', 'depends where', 'different rules'],
          ['javascript string', 'script block', 'quote', 'backslash'],
          ['does not cover', 'untouched', 'not sufficient', 'does nothing'],
        ],
        hint:
          'Three ideas: encoding depends on context, name the JavaScript-string context here, and say ' +
          'what HTML encoding leaves untouched in that context.',
      },
    ],
    debrief:
      'Keep this exercise in mind whenever a developer says a value is "already encoded". Encoded where, ' +
      'and for what, is always the next question.',
    practice: [],
  },
];

// --- Module asf.4: authentication and session flaws --------------------------

const BROKEN_AUTH_TEACH = {
  concept:
    'Authentication is where an attacker gets the most value for the least effort, because a single ' +
    'working credential often unlocks everything a legitimate user could reach, so it is worth naming ' +
    'the patterns that keep showing up.\n\n' +
    'CREDENTIAL STUFFING is trying username and password pairs leaked from an unrelated breach, on the ' +
    'assumption that people reuse passwords, which they do, at scale. It is defeated not by password ' +
    'complexity rules but by rate limiting, multi-factor authentication, and checking new credentials ' +
    'against known breach lists. A missing or generous LOCKOUT lets an attacker try thousands of ' +
    'passwords against one account with no consequence; a lockout that is too aggressive, on the other ' +
    'hand, becomes a denial-of-service tool an attacker uses against a legitimate user by deliberately ' +
    'failing their login. VERBOSE ERROR MESSAGES that say "wrong password" versus "no such user" let an ' +
    'attacker enumerate which usernames exist, which sounds minor until you notice it turns a random ' +
    'guessing attack into a targeted one.',
} as const;

const SESSION_TEACH = {
  concept:
    'A session token is what proves, after login, that a request belongs to an already-authenticated ' +
    'user, and the handling of that token is where a lot of authentication work actually lives, ' +
    'separate from the login form itself.\n\n' +
    'SESSION FIXATION is an attacker setting a victim session identifier before they log in, often by ' +
    'sending them a link containing one, and then using that same identifier themselves once the victim ' +
    'authenticates, because the application never issued a fresh token at login. The fix is simple and ' +
    'absolute: REGENERATE the session identifier at the moment of authentication, every time, so any ' +
    'identifier an attacker planted beforehand becomes worthless the instant a real login happens. ' +
    'Session tokens also need the same handling as any other credential: unpredictable, long enough to ' +
    'resist guessing, invalidated on logout, and expired after a reasonable period of inactivity, ' +
    'because a token that never expires is a password that can never be forced to change.',
} as const;

const MODULE_ASF_4: Exercise[] = [
  {
    id: 'asf.4.1',
    moduleId: 'asf.4',
    packageId: 'appsec-foundations',
    order: 1,
    title: 'Patterns that show up in almost every breach',
    kind: 'multiple-choice',
    goal: 'Recognise credential stuffing, lockout tradeoffs, and username enumeration.',
    prompt:
      'You are reviewing the login flow for a new product. Which of the following are accurate ' +
      'statements about the risks involved? Select all that apply.',
    teach: BROKEN_AUTH_TEACH,
    options: [
      { id: 'a', label: 'Credential stuffing relies on password reuse across sites rather than on guessing a weak password.' },
      { id: 'b', label: 'A login form that returns a different message for "wrong password" than for "no such account" allows an attacker to enumerate valid usernames.' },
      { id: 'c', label: 'A lockout policy that is too aggressive can itself be used to deny a legitimate user access to their own account.' },
      { id: 'd', label: 'Rate limiting and multi-factor authentication defend against credential stuffing even when the password itself is genuinely strong.' },
      { id: 'e', label: 'Enforcing a strict password complexity policy is the primary defence against credential stuffing.' },
    ],
    hints: [
      'Four are accurate. One assumes the attack is about guessing rather than reusing.',
      'A credential-stuffing attacker already has a real, working password, from a different site. What does complexity do to stop that?',
      'A lockout can be a control or a weapon depending on how aggressively it is tuned.',
    ],
    solution:
      'A, B, C, and D. Reuse rather than weakness, the enumeration risk in verbose errors, the ' +
      'lockout-as-denial-of-service tradeoff, and rate limiting plus multi-factor as the actual ' +
      'defence. E misunderstands the attack: a stuffed credential is a real password from a real ' +
      'account elsewhere, often a strong one, so complexity rules on the target site do nothing to it. ' +
      'They defend against a different attack, guessing, not this one.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option applies a defence for weak-password guessing to an attack that uses real, strong passwords.',
      },
    ],
    debrief:
      'When a breach report says "credential stuffing", the fix conversation should go straight to rate ' +
      'limiting and multi-factor authentication, not to the password policy.',
    practice: [],
  },
  {
    id: 'asf.4.2',
    moduleId: 'asf.4',
    packageId: 'appsec-foundations',
    order: 2,
    title: 'The session that was never really new',
    kind: 'multiple-choice',
    goal: 'Explain session fixation and why regenerating the session token at login closes it.',
    prompt:
      'An application assigns a session identifier as soon as a visitor arrives, before login, and keeps ' +
      'the same identifier after they authenticate. Which of the following are true about the risk this ' +
      'creates? Select all that apply.',
    teach: SESSION_TEACH,
    options: [
      { id: 'a', label: 'An attacker who gets a victim to use a session identifier the attacker chose, then waits for the victim to log in, can then use that same identifier to act as the victim.' },
      { id: 'b', label: 'This is session fixation, and it works because the application never issues a fresh identifier at the moment of authentication.' },
      { id: 'c', label: 'Regenerating the session identifier at login makes any identifier an attacker planted beforehand worthless.' },
      { id: 'd', label: 'A session identifier needs the same care as a password: unpredictable, expired after inactivity, and invalidated on logout.' },
      { id: 'e', label: 'Because the session identifier was assigned by the server rather than typed by the user, it cannot be the source of an authentication vulnerability.' },
    ],
    hints: [
      'Four are true. One assumes anything server-generated is automatically safe.',
      'The identifier was generated by the server, and it still leaked to the attacker before login. How?',
      'What single change at the moment of login removes the whole attack?',
    ],
    solution:
      'A, B, C, and D. The attack mechanism, its name, the regeneration fix, and the general care a ' +
      'session identifier needs. E is the false comfort in this scenario: the identifier being ' +
      'server-generated says nothing about who else has seen it, and an attacker who plants it in a ' +
      'link the victim clicks has seen it before the victim ever logs in.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes server-generated automatically means unknown to the attacker.',
      },
    ],
    debrief:
      'Check for this specifically in a review: search for where the session identifier is set, and ' +
      'confirm it happens again, freshly, at the exact point login succeeds.',
    practice: [],
  },
  {
    id: 'asf.4.3',
    moduleId: 'asf.4',
    packageId: 'appsec-foundations',
    order: 3,
    title: 'The reset flow nobody threat modelled',
    kind: 'multiple-choice',
    goal: 'Identify common flaws in a password reset flow.',
    prompt:
      'You are reviewing a password reset flow: a user enters their email, receives a six-digit code by ' +
      'email, and enters it to set a new password. Which of the following are legitimate concerns? ' +
      'Select all that apply.',
    teach: {
      concept:
        'A password reset flow is a second, informal login mechanism, and it is worth exactly as much ' +
        'scrutiny as the primary one, because it is often built later, under less review, and treated as ' +
        'a convenience feature rather than an authentication path.\n\n' +
        'A short numeric code is only as strong as the number of GUESSES an attacker gets before it ' +
        'expires or locks; a six-digit code with no rate limiting on the submission endpoint is guessable ' +
        'in a practical number of attempts. A code, or a reset link containing a token, that never EXPIRES ' +
        'stays valid long after the user has forgotten requesting it, including in an old email an ' +
        'attacker might later access. The reset flow can also leak whether an email address has an ' +
        'account at all, through a different response for "email sent" versus "no account found", the ' +
        'same enumeration problem as the login form. And the final step, actually changing the password, ' +
        'needs to invalidate every existing session for that account, or an attacker who already had a ' +
        'foothold keeps it even after the legitimate owner "secures" the account.',
    },
    options: [
      { id: 'a', label: 'A six-digit code with no rate limiting on the verification endpoint can be brute-forced in a practical number of attempts.' },
      { id: 'b', label: 'A reset code or link that never expires remains usable long after the request that generated it.' },
      { id: 'c', label: 'Returning a different response for an email that has an account versus one that does not lets an attacker enumerate registered accounts.' },
      { id: 'd', label: 'A successful password reset should invalidate existing sessions for that account, or a prior attacker foothold survives the reset.' },
      { id: 'e', label: 'Because the code is delivered by email rather than shown on screen, the flow is inherently safe from guessing attacks.' },
    ],
    hints: [
      'Four are legitimate concerns. One assumes the delivery channel protects the code from being guessed.',
      'Rate limiting protects the verification step, not the delivery step. Ask which one this option is about.',
      'What happens to an attacker session if the victim changes their password but old sessions stay valid?',
    ],
    solution:
      'A, B, C, and D. Guessability without rate limiting, unexpiring codes, enumeration through response ' +
      'differences, and session invalidation on reset. E confuses where the code is sent with how it is ' +
      'checked: the code still has to be submitted to the server and verified there, and if that endpoint ' +
      'has no rate limit, delivering the code by email does nothing to stop it being guessed directly.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option confuses the delivery channel with the verification control.',
      },
    ],
    debrief:
      'Reset flows are one of the most productive places to spend review time, because they are built as ' +
      'an afterthought far more often than the login form is.',
    practice: [],
  },
  {
    id: 'asf.4.4',
    moduleId: 'asf.4',
    packageId: 'appsec-foundations',
    order: 4,
    title: 'What HTTPS actually promises',
    kind: 'multiple-choice',
    goal: 'Separate what transport encryption protects from what it does not.',
    prompt:
      'A team defends its authentication design by saying "it is fine, everything is over HTTPS". Which ' +
      'of the following are true about what that actually covers? Select all that apply.',
    teach: {
      concept:
        'HTTPS protects the CHANNEL a request travels across: it stops somebody on the network path from ' +
        'reading the credentials in transit, and it stops the traffic being tampered with in flight. That ' +
        'is real and necessary, and there is no good reason to run authentication without it.\n\n' +
        'What it says nothing about is what happens once the request arrives. Session fixation, a missing ' +
        'lockout, an unexpiring reset code, a reset flow that never invalidates old sessions, none of ' +
        'those are transport problems, and encrypting the channel does not touch any of them. HTTPS also ' +
        'does nothing about a client that is itself compromised, or a user who is phished into typing ' +
        'their password into a site that also happens to be served over a valid, encrypted connection: ' +
        'the padlock icon confirms the channel to that site is private, not that the site or the request ' +
        'travelling through it is trustworthy.',
    },
    options: [
      { id: 'a', label: 'HTTPS prevents somebody on the network path from reading credentials in transit, and from tampering with the request.' },
      { id: 'b', label: 'A session fixation flaw is unaffected by whether the connection is encrypted, because the problem is which identifier is reused, not who can read it.' },
      { id: 'c', label: 'A phishing site can be served over a fully valid HTTPS connection while still stealing the credentials a victim types into it.' },
      { id: 'd', label: 'An unexpiring password reset code is exactly as exploitable over HTTPS as it would be without it.' },
      { id: 'e', label: 'Once a login flow runs entirely over HTTPS, its remaining authentication logic no longer needs a dedicated security review.' },
    ],
    hints: [
      'Four are true. One treats a channel protection as if it were an application-logic protection.',
      'Ask specifically what HTTPS does to a request once it has already arrived at the correct server.',
      'A padlock in the browser confirms the connection is private. Does it confirm the site deserves the credential typed into it?',
    ],
    solution:
      'A, B, C, and D. What HTTPS protects, and three examples of application-layer flaws it does ' +
      'nothing about: fixation, phishing, and an unexpiring reset code. E is the exact misconception the ' +
      'exercise is named for: HTTPS closes the transport question and leaves the entire application-logic ' +
      'question, which is most of this module, completely open.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats channel security as covering application-logic flaws it never touches.',
      },
    ],
    debrief:
      '"It is over HTTPS" answers exactly one question in a review. Have the next four questions ready, ' +
      'because that answer will get offered as if it answered all of them.',
    practice: [],
  },
  {
    id: 'asf.4.5',
    moduleId: 'asf.4',
    packageId: 'appsec-foundations',
    order: 5,
    title: 'Explain why HTTPS is not enough',
    kind: 'short-answer',
    goal: 'Argue precisely why transport encryption does not make an authentication flow safe.',
    prompt:
      'A product manager says the new login flow is secure because it runs entirely over HTTPS. In three ' +
      'or four sentences, explain what that claim covers and what it leaves open, using session fixation ' +
      'or the reset flow as your example.',
    teach: {
      concept:
        'A precise answer separates two different guarantees rather than treating security as one binary ' +
        'thing. HTTPS guarantees the channel: nobody on the network path can read or tamper with the ' +
        'request in transit. It says nothing about the application logic layered on top of that channel, ' +
        'which is where session fixation, a missing session invalidation, or an unexpiring reset code ' +
        'actually live.\n\n' +
        'The strongest version of the answer picks one concrete flaw and shows that encrypting the ' +
        'channel does not touch it at all: a fixed session identifier is exactly as reusable by an ' +
        'attacker whether the traffic carrying it was encrypted or not, because the vulnerability is in ' +
        'which identifier gets reused, not in who could have read it along the way.',
    },
    hints: [
      'Name what HTTPS actually protects before saying what it misses.',
      'Pick one specific flaw, session fixation or the reset flow, and show the encryption is irrelevant to it.',
      'A strong answer names the channel guarantee, then shows a concrete application-logic flaw that survives it unchanged.',
    ],
    solution:
      'HTTPS guarantees that nobody on the network path can read or tamper with the request while it is ' +
      'in transit, which is real and worth having, but it says nothing about the logic layered on top of ' +
      'that channel. Session fixation is a good example: if the application never regenerates the session ' +
      'identifier at login, an attacker who planted one beforehand can reuse it after the victim ' +
      'authenticates, and that is exactly as true whether the traffic was encrypted or not, because the ' +
      'flaw is about which identifier gets trusted, not about who could have read it in transit.',
    expectedOutput:
      'An answer naming what HTTPS actually protects, and a concrete application-logic flaw, such as ' +
      'session fixation or an unexpiring reset code, that survives encryption unchanged.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['channel', 'transit', 'network path', 'read or tamper'],
          ['session fixation', 'reset', 'application logic', 'layered on top'],
          ['unaffected', 'does not touch', 'says nothing about', 'regardless of encryption'],
        ],
        hint:
          'Three ideas: what HTTPS actually protects, a specific application-logic flaw, and that ' +
          'encryption leaves that flaw unchanged.',
      },
    ],
    debrief:
      'Every authentication review you do will eventually meet this sentence in some form. Having the ' +
      'precise, three-part answer ready is worth more than the general instinct that it is wrong.',
    practice: [],
  },
];

// --- Module asf.5: access control flaws --------------------------------------

const AUTHZ_TEACH = {
  concept:
    'AUTHENTICATION answers who you are; AUTHORISATION answers what you, specifically, are allowed to do ' +
    'right now. A system can get the first one perfectly right and still fail completely, because it ' +
    'never asked the second question at all: it verified the request came from a genuine, logged-in ' +
    'user, and then served whatever that user asked for without checking whether it belonged to them.\n\n' +
    'That gap has a name, BROKEN ACCESS CONTROL, and it is consistently one of the most common serious ' +
    'findings in real applications, precisely because it is invisible to every tool that only tests ' +
    'authentication. A login form can be flawless, multi-factor can be enforced everywhere, and the ' +
    'application can still let any authenticated user read or modify any other users data, because ' +
    'authentication and authorisation are two separate checks and only one of them was ever implemented.',
} as const;

const IDOR_TEACH = {
  concept:
    'INSECURE DIRECT OBJECT REFERENCE, IDOR, is what broken access control looks like at the code level: ' +
    'an endpoint takes an identifier straight from the request and uses it to fetch a record, without ' +
    'checking that the record belongs to the requester.\n\n' +
    '  app.get("/invoices/:id", (req, res) => {\n' +
    '    const invoice = db.getInvoice(req.params.id);\n' +
    '    res.json(invoice);\n' +
    '  });\n\n' +
    'Any authenticated user can change the id in the URL and read any invoice in the system, because ' +
    'nothing here checks whose invoice it is. This is sometimes called BOLA, broken object-level ' +
    'authorisation, in API-focused terminology, and it is the same gap. The fix is an OWNERSHIP CHECK, ' +
    'comparing the record actual owner against the identity of the currently authenticated requester, ' +
    'taken from the session rather than from anything the client supplied:\n\n' +
    '  const invoice = db.getInvoice(req.params.id);\n' +
    '  if (invoice.ownerId !== req.session.userId) return res.status(403).end();\n' +
    '  res.json(invoice);',
} as const;

const MODULE_ASF_5: Exercise[] = [
  {
    id: 'asf.5.1',
    moduleId: 'asf.5',
    packageId: 'appsec-foundations',
    order: 1,
    title: 'Two different questions with two different names',
    kind: 'multiple-choice',
    goal: 'Separate authentication from authorisation and see how a system can pass one and fail the other.',
    prompt:
      'A support engineer reports that any logged-in user can view any other customer order history by ' +
      'changing an order number in the browser address bar. Which of the following are true? Select all ' +
      'that apply.',
    teach: AUTHZ_TEACH,
    options: [
      { id: 'a', label: 'This system may have flawless authentication and still have this bug, because authentication and authorisation are separate checks.' },
      { id: 'b', label: 'Being logged in proves who the requester is, and says nothing on its own about which records that requester is allowed to see.' },
      { id: 'c', label: 'This is an example of broken access control, one of the most common serious findings in real applications.' },
      { id: 'd', label: 'A multi-factor login requirement would not, by itself, close this particular gap.' },
      { id: 'e', label: 'Since the user had to log in first, and multi-factor was enforced, the system correctly authorised this request.' },
    ],
    hints: [
      'Four are true. One treats a successful login as if it also answered the authorisation question.',
      'What specifically did the system check before returning the order data?',
      'Multi-factor makes authentication stronger. Does it add any check on what an authenticated user may access?',
    ],
    solution:
      'A, B, C, and D. Authentication and authorisation as separate checks, what a login actually proves, ' +
      'the broken access control classification, and the irrelevance of multi-factor to this specific ' +
      'gap. E is the exact confusion the module opens with: the request was correctly authenticated, and ' +
      'was never authorised at all, because nothing in the code asked whether this order belonged to this ' +
      'user.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a strong login as equivalent to a correct authorisation decision.',
      },
    ],
    debrief:
      'When a finding sounds like "any user can see any other user data", assume it is an authorisation ' +
      'gap before you even open the code, and go looking for the missing ownership check.',
    practice: [],
  },
  {
    id: 'asf.5.2',
    moduleId: 'asf.5',
    packageId: 'appsec-foundations',
    order: 2,
    title: 'The endpoint that trusts the URL',
    kind: 'multiple-choice',
    goal: 'Read an IDOR at the code level and know what an ownership check has to compare.',
    prompt:
      'You are reviewing this endpoint.\n\n' +
      '  app.get("/invoices/:id", (req, res) => {\n' +
      '    const invoice = db.getInvoice(req.params.id);\n' +
      '    res.json(invoice);\n' +
      '  });\n\n' +
      'Which of the following are true about it? Select all that apply.',
    teach: IDOR_TEACH,
    options: [
      { id: 'a', label: 'Any authenticated user can read any invoice by changing the id in the request, because ownership is never checked.' },
      { id: 'b', label: 'This is an insecure direct object reference, also called broken object-level authorisation in API terminology.' },
      { id: 'c', label: 'A correct fix compares the invoice owner against the requester identity taken from the session, not from anything the client supplied.' },
      { id: 'd', label: 'The endpoint requiring the request to be authenticated at all is not, by itself, sufficient to close this gap.' },
      { id: 'e', label: 'If the id parameter were replaced with a long random value instead of a small integer, the ownership check would no longer be necessary.' },
    ],
    hints: [
      'Four are true. One proposes a fix that changes the guess difficulty without changing the missing check.',
      'What does making the id unguessable actually stop, and what does it leave completely open?',
      'The fix has to compare something about the record to something about the requester. What are those two things?',
    ],
    solution:
      'A, B, C, and D. The missing check, the naming, the correct comparison, and the insufficiency of ' +
      'authentication alone. E is a very common but wrong instinct: a long random identifier stops an ' +
      'attacker from guessing IDs that belong to somebody else, but does nothing about an attacker who ' +
      'already has one, from a shared link, a previous response, or their own prior invoice, and it does ' +
      'not add the ownership check that was actually missing.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option confuses making an identifier hard to guess with actually authorising access to it.',
      },
    ],
    debrief:
      'This exact code shape, fetch by id, return, no ownership check, is the single most common finding ' +
      'in this whole field. Learning to spot it in half a second is worth more than any other pattern in ' +
      'this package.',
    practice: [],
  },
  {
    id: 'asf.5.3',
    moduleId: 'asf.5',
    packageId: 'appsec-foundations',
    order: 3,
    title: 'Whose record, versus what kind of action',
    kind: 'multiple-choice',
    goal: 'Distinguish horizontal from vertical broken access control.',
    prompt:
      'Two separate findings come in on the same application. One: a regular customer can view another ' +
      'regular customer order. Two: a regular customer can call the admin-only endpoint that deletes any ' +
      'user account. Which of the following are true? Select all that apply.',
    teach: {
      concept:
        'Broken access control splits into two shapes that need different checks. HORIZONTAL is the IDOR ' +
        'shape: two accounts at the same privilege level, and one reaches data that belongs to the other. ' +
        'The check needed is an ownership comparison, exactly as in the invoice example.\n\n' +
        'VERTICAL is a different failure: an account reaches functionality meant for a higher privilege ' +
        'level entirely, an ordinary user calling an admin endpoint, regardless of whose data is involved. ' +
        'The check needed here is a ROLE check on the action itself, verified on the server for every ' +
        'request, not inferred from whether an admin link happens to be hidden in the interface for that ' +
        'user. The two findings in this scenario need two different fixes: an ownership check for the ' +
        'first, and a server-side role check on the delete endpoint for the second, and fixing one does ' +
        'nothing for the other.',
    },
    options: [
      { id: 'a', label: 'The order-viewing finding is horizontal access control: two accounts at the same privilege level, one reaching the others data.' },
      { id: 'b', label: 'The admin-delete finding is vertical access control: an account reaching functionality meant for a higher privilege level entirely.' },
      { id: 'c', label: 'The fix for the order-viewing finding is an ownership comparison, which does not by itself address the admin-delete finding.' },
      { id: 'd', label: 'The fix for the admin-delete finding is a server-side role check on that endpoint, checked on every request rather than inferred from the interface.' },
      { id: 'e', label: 'Fixing the ownership check on the invoice endpoint also resolves the admin-delete finding, since both stem from the same missing authorisation logic.' },
    ],
    hints: [
      'Four are true. One assumes the two findings share a single fix.',
      'Ask what specifically is being checked in each case: whose record it is, or what level of action it is.',
      'An ownership comparison answers "is this yours". A role check answers a different question entirely.',
    ],
    solution:
      'A, B, C, and D. Horizontal versus vertical, and the two distinct fixes each one actually needs. E ' +
      'is the mistake that leaves half a finding set unresolved: an ownership check and a role check ' +
      'protect against different attacks, and closing one leaves the other completely open, because they ' +
      'never overlapped in the first place.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats two different missing checks as if fixing either one fixed both.',
      },
    ],
    debrief:
      'When a finding report groups "access control issues" as one bucket with one recommended fix, split ' +
      'it into horizontal and vertical before you accept the remediation plan.',
    practice: [],
  },
  {
    id: 'asf.5.4',
    moduleId: 'asf.5',
    packageId: 'appsec-foundations',
    order: 4,
    title: 'Hiding the button is not removing the door',
    kind: 'multiple-choice',
    goal: 'Reject mitigations that hide access rather than checking it.',
    prompt:
      'A team addresses several access control findings by removing the links to sensitive pages from ' +
      'the interface for users who should not see them, without changing what the server accepts. Which ' +
      'of the following are true? Select all that apply.',
    teach: {
      concept:
        'Hiding a link, or a button, in the interface changes what a normal user is shown, and changes ' +
        'nothing about what the server will accept if the underlying request is made directly, with the ' +
        'URL typed in, an old bookmark, or a request built by any tool other than clicking through the ' +
        'application as intended. This is SECURITY THROUGH OBSCURITY applied to authorisation, and it ' +
        'fails the moment anyone looks past the interface, which takes no special skill.\n\n' +
        'The same failure shows up in a subtler form: relying on an identifier being hard to guess, as in ' +
        'the earlier invoice exercise, or relying on a feature flag or a client-side role check that the ' +
        'server never re-verifies. In every version, the actual authorisation decision has to be enforced ' +
        'at the server, on every request, because that is the only point neither the interface nor the ' +
        'client can be relied on to protect.',
    },
    options: [
      { id: 'a', label: 'Removing a link from the interface does not change whether the server accepts the underlying request when made directly.' },
      { id: 'b', label: 'This is security through obscurity applied to authorisation, and it fails as soon as the request is made outside the normal interface flow.' },
      { id: 'c', label: 'A feature flag or a client-side role check has the same limitation as a hidden link, unless the server independently re-verifies the same decision.' },
      { id: 'd', label: 'The actual authorisation decision has to be enforced on the server, on every request, because that is the point neither the interface nor the client can be relied on to protect.' },
      { id: 'e', label: 'Removing the visible links for unauthorised users is an adequate fix, since those users have no way to discover the underlying URLs.' },
    ],
    hints: [
      'Four are true. One assumes an attacker is limited to clicking visible interface elements.',
      'Ask what tool an attacker would need to make the request directly, bypassing the interface.',
      'A hidden link and an unguessable identifier fail for the same underlying reason. What is it?',
    ],
    solution:
      'A, B, C, and D. What hiding a link actually changes, the obscurity framing, the same limitation in ' +
      'client-side and feature-flag checks, and server-side enforcement as the only real fix. E assumes ' +
      'an attacker needs the interface to discover a URL, which is false: URLs are guessable, ' +
      'discoverable in old documentation or client-side code, or shared between accounts, and none of ' +
      'that requires seeing the hidden link in the first place.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes an attacker can only reach what the interface visibly shows them.',
      },
    ],
    debrief:
      'A useful review habit: for any access control fix proposed, ask specifically what the server does ' +
      'differently now, not what the interface looks like differently. If the answer is only the ' +
      'interface, the finding is still open.',
    practice: [],
  },
  {
    id: 'asf.5.5',
    moduleId: 'asf.5',
    packageId: 'appsec-foundations',
    order: 5,
    title: 'Write the fix for a missing ownership check',
    kind: 'short-answer',
    goal: 'Describe the exact comparison an ownership check needs to make, and where its inputs come from.',
    prompt:
      'You are reviewing this endpoint.\n\n' +
      '  app.get("/documents/:id", (req, res) => {\n' +
      '    const doc = db.getDocument(req.params.id);\n' +
      '    res.json(doc);\n' +
      '  });\n\n' +
      'In three or four sentences, describe the vulnerability and exactly what the fix needs to check, ' +
      'including where each side of the comparison should come from.',
    teach: {
      concept:
        'A precise fix description names both sides of the comparison, not just that a check is missing. ' +
        'One side is the record actual owner, read from the database alongside the document itself. The ' +
        'other side is the current requester identity, and it has to come from the SERVER-SIDE session or ' +
        'authentication context, never from a field the client supplied in the request, because a client ' +
        'field can simply be changed to any value the attacker wants.\n\n' +
        'A vague answer says "add an authorisation check". A precise one says compare doc.ownerId, read ' +
        'from the database, against req.session.userId, taken from the servers own record of who is ' +
        'logged in, and reject the request if they do not match. That level of precision is what makes a ' +
        'finding actionable rather than aspirational.',
    },
    hints: [
      'Name the two specific values being compared, not just "add a check".',
      'One side of the comparison comes from the database record. Where must the other side come from, and where must it never come from?',
      'A strong answer names the missing ownership check, and specifies that the requester identity must come from the session, not from client input.',
    ],
    solution:
      'This is an insecure direct object reference: any authenticated user can read any document by ' +
      'changing the id, because nothing compares the document owner to the requester. The fix is to read ' +
      'the document owner from the database alongside the document itself, compare it to the current ' +
      'requester identity taken from the server-side session, and reject the request with a 403 if they ' +
      'do not match. The requester identity must come from the session rather than from any field the ' +
      'client supplied, since a client-supplied value can simply be set to whatever an attacker wants.',
    expectedOutput:
      'An answer naming the IDOR, and specifying a comparison of the database-recorded owner against a ' +
      'session-derived requester identity, explicitly excluding client-supplied values.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['ownership', 'owner', 'belongs to', 'compare'],
          ['session', 'server-side', 'authenticated user', 'requester identity'],
          ['not.{0,20}client', 'never.{0,20}client', 'cannot.{0,20}supplied', 'not.{0,20}request param'],
        ],
        hint:
          'Three ideas: name the ownership comparison, say the requester identity must come from the ' +
          'session, and say explicitly it must not come from client-supplied input.',
      },
    ],
    debrief:
      'This is the pattern that recurs across every access control finding in this module. Practise ' +
      'writing it this precisely until it is automatic.',
    practice: [],
  },
];

// --- Module asf.6: deserialisation, SSRF, and supply chain -------------------

const DESERIALISATION_TEACH = {
  concept:
    'Serialisation turns an in-memory object into bytes to store or send; deserialisation turns those ' +
    'bytes back into an object. The danger appears when the bytes come from somewhere untrusted, because ' +
    'several common serialisation formats let the byte stream specify not just data but which CLASS to ' +
    'instantiate and how to construct it, and an attacker who controls that stream can name a class the ' +
    'application never intended to be built from outside input.\n\n' +
    'Chained together, a sequence of otherwise-unremarkable classes already present on the system can be ' +
    'made to perform an unintended action as a side effect of being constructed and combined, a GADGET ' +
    'CHAIN, and in the worst cases this reaches arbitrary code execution without the attacker ever ' +
    'uploading a file that looks like code at all. The general rule: never deserialise data from an ' +
    'untrustworthy source into a native object format that supports arbitrary type resolution. Where the ' +
    'data has to cross that boundary, use a restrictive format such as JSON with a fixed, validated ' +
    'schema, which has no notion of "construct this class" built into it at all.',
} as const;

const SSRF_TEACH = {
  concept:
    'SERVER-SIDE REQUEST FORGERY happens when an application takes a URL, or a piece of one such as a ' +
    'hostname, from a user, and then makes a request to it from the server itself. The danger is not the ' +
    'request the developer had in mind, fetching a profile picture or checking a webhook, it is every ' +
    'OTHER request the server is capable of making that the developer never considered.\n\n' +
    'A server usually sits inside a network with reach an outside attacker does not have on their own: ' +
    'internal admin panels with no separate authentication because they were never meant to be reachable ' +
    'from outside, internal-only APIs, and on cloud infrastructure, an internal metadata service that ' +
    'many providers expose only to the instance itself, which can hand back credentials the running ' +
    'application uses. An attacker who can make the server request a URL of their choosing can point it ' +
    'at any of these, using the servers own network position as a proxy into places the attacker could ' +
    'never have reached directly. The fix combines an ALLOWLIST of destinations the feature actually ' +
    'needs, blocking requests to internal address ranges, and refusing to follow a redirect to a ' +
    'destination that was not itself validated.',
} as const;

const SUPPLY_CHAIN_TEACH = {
  concept:
    'Almost no application is written entirely by the team that ships it. It depends on other packages, ' +
    'which depend on further packages, and a vulnerability or a deliberately malicious change anywhere ' +
    'in that TRANSITIVE tree becomes part of the application the moment it is installed, whether anybody ' +
    'on the team ever reads that code or not.\n\n' +
    'TYPOSQUATTING is publishing a malicious package under a name one character away from a popular one, ' +
    'hoping for a mistyped install command. A MAINTAINER TAKEOVER is an attacker gaining control of a ' +
    'legitimate, widely used package, through a compromised account or a maintainer handing off ' +
    'ownership without vetting who they handed it to, and shipping a malicious update to everyone who ' +
    'already depends on it, which is more dangerous than typosquatting because it reaches people who did ' +
    'nothing wrong. A LOCKFILE pins exact versions so a routine install cannot silently pull in a ' +
    'compromised update, and a SOFTWARE BILL OF MATERIALS, an SBOM, is an inventory of exactly what is in ' +
    'a build, which is what makes it possible to answer "are we affected" quickly when a dependency is ' +
    'disclosed as compromised, rather than needing to reconstruct the dependency tree from scratch under ' +
    'pressure.',
} as const;

const MODULE_ASF_6: Exercise[] = [
  {
    id: 'asf.6.1',
    moduleId: 'asf.6',
    packageId: 'appsec-foundations',
    order: 1,
    title: 'Data that builds its own objects',
    kind: 'multiple-choice',
    goal: 'Explain why deserialising untrusted data is dangerous and what the safe alternative looks like.',
    prompt:
      'An internal service accepts a serialised object from a partner system and deserialises it directly ' +
      'into a native object using the language default mechanism. Which of the following are true? ' +
      'Select all that apply.',
    teach: DESERIALISATION_TEACH,
    options: [
      { id: 'a', label: 'Some native serialisation formats let the byte stream specify which class to construct, not just what data to fill it with.' },
      { id: 'b', label: 'A gadget chain can combine classes already present on the system into an unintended action, without the attacker uploading anything that looks like code.' },
      { id: 'c', label: 'The general rule is to avoid deserialising untrustworthy data into a format that supports arbitrary type resolution at all.' },
      { id: 'd', label: 'A restrictive format such as JSON, validated against a fixed schema, avoids this specific danger because it has no notion of constructing an arbitrary class.' },
      { id: 'e', label: 'Because the data comes from a partner system rather than the public internet, it does not need to be treated as untrusted here.' },
    ],
    hints: [
      'Four are true. One assumes a business relationship is the same thing as a trust boundary.',
      'Ask what would happen if the partner system were itself compromised.',
      'The danger is about the format, not about who happens to be sending it today.',
    ],
    solution:
      'A, B, C, and D. Type resolution in the byte stream, the gadget chain mechanism, the general rule, ' +
      'and JSON with a fixed schema as the safer alternative. E confuses a business relationship with a ' +
      'security boundary: the partner system is a separate system the application does not control, and ' +
      'if it is compromised, or its connection to your system is compromised, the untrusted data still ' +
      'arrives exactly as untrusted as it would from a stranger.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a partner relationship as equivalent to a trust boundary.',
      },
    ],
    debrief:
      'If a finding involves the words "deserialise" and "untrusted" in the same sentence, treat it as ' +
      'high severity by default. This bug class has produced remote code execution in production systems ' +
      'repeatedly, across many languages.',
    practice: [],
  },
  {
    id: 'asf.6.2',
    moduleId: 'asf.6',
    packageId: 'appsec-foundations',
    order: 2,
    title: 'A proxy the attacker did not have to build',
    kind: 'multiple-choice',
    goal: 'Reason about what SSRF actually lets an attacker reach.',
    prompt:
      'A feature lets a user submit a URL and the server fetches it to generate a link preview. Which of ' +
      'the following are true about the risk? Select all that apply.',
    teach: SSRF_TEACH,
    options: [
      { id: 'a', label: 'An attacker can use this feature to make the server request internal addresses that are not reachable directly from outside the network.' },
      { id: 'b', label: 'On cloud infrastructure, this kind of feature has been used to reach an internal metadata service and obtain credentials the running application uses.' },
      { id: 'c', label: 'An allowlist of the destinations the feature actually needs is stronger than trying to blocklist internal-looking addresses.' },
      { id: 'd', label: 'A fix that validates the initial URL but then follows any redirect it returns can still be defeated by redirecting to an internal address.' },
      { id: 'e', label: 'Because the feature only fetches a URL to generate a preview and never displays the raw response to the user, it carries no meaningful risk.' },
    ],
    hints: [
      'Four are true. One assumes the risk depends on the response being shown to the user.',
      'What does the server gain access to, by making this request, that the attacker did not already have on their own?',
      'A validated URL that is allowed to redirect anywhere can end up somewhere that was never validated.',
    ],
    solution:
      'A, B, C, and D. Reaching internal addresses, the cloud metadata risk, allowlisting over ' +
      'blocklisting, and the redirect bypass. E misses the point of the attack entirely: the value to the ' +
      'attacker is the servers network position, not the preview shown to the user, and a response that ' +
      'reveals whether the request succeeded, its timing, or its size can leak information even without ' +
      'showing the full body.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes the risk requires the response to be shown back to the requesting user.',
      },
    ],
    debrief:
      'Any feature that fetches a user-supplied URL server-side deserves the same scrutiny as this one, ' +
      'regardless of how small or cosmetic the feature seems.',
    practice: [],
  },
  {
    id: 'asf.6.3',
    moduleId: 'asf.6',
    packageId: 'appsec-foundations',
    order: 3,
    title: 'Popularity is not a security review',
    kind: 'multiple-choice',
    goal: 'Reason about dependency risk beyond a package current popularity or star count.',
    prompt:
      'A team defends a dependency choice by pointing out the package is extremely popular, with a large ' +
      'number of downloads. Which of the following are true about the risk that remains? Select all that ' +
      'apply.',
    teach: SUPPLY_CHAIN_TEACH,
    options: [
      { id: 'a', label: 'A maintainer takeover of a popular package can push a malicious update to every application that already depends on it, without any of them changing a line of their own code.' },
      { id: 'b', label: 'Typosquatting relies on a mistyped install command rather than on the popularity of the package being impersonated.' },
      { id: 'c', label: 'A lockfile pinning exact versions prevents a routine install from silently pulling in a newly compromised update.' },
      { id: 'd', label: 'A software bill of materials makes it possible to answer quickly whether a build is affected when a dependency is disclosed as compromised.' },
      { id: 'e', label: 'A packages current popularity is a reliable guarantee that it will remain safe to depend on indefinitely.' },
    ],
    hints: [
      'Four are true. One treats a snapshot in time, popularity today, as a guarantee about the future.',
      'What does popularity tell you about who controls the package tomorrow?',
      'A lockfile and an SBOM solve two different problems. What is each one actually for?',
    ],
    solution:
      'A, B, C, and D. Maintainer takeover risk regardless of popularity, the typosquatting mechanism, ' +
      'lockfiles preventing silent pulls, and SBOMs enabling fast impact assessment. E is the reasoning ' +
      'the exercise is built to correct: popularity says a package was trustworthy enough for many people ' +
      'to adopt it in the past, it says nothing about who controls its next release, and maintainer ' +
      'takeovers specifically target popular packages because that is where the blast radius is largest.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats past popularity as a permanent guarantee.',
      },
    ],
    debrief:
      'Dependency risk is not solved by picking better libraries once. It is a standing process: ' +
      'lockfiles, scanning, and an SBOM you can actually query on the day a disclosure lands.',
    practice: [],
  },
  {
    id: 'asf.6.4',
    moduleId: 'asf.6',
    packageId: 'appsec-foundations',
    order: 4,
    title: 'Three risks, three different mitigations',
    kind: 'multiple-choice',
    goal: 'Match deserialisation, SSRF, and supply chain risk to the mitigation that actually applies to each.',
    prompt:
      'You are writing mitigation guidance covering all three risks in this module. Which of the ' +
      'following pairings are correct? Select all that apply.',
    teach: {
      concept:
        'Each of these three risks has a mitigation shaped around its actual mechanism, and mixing them up ' +
        'produces advice that sounds reasonable and protects nothing. Deserialisation is closed by ' +
        'avoiding a format with arbitrary type resolution for untrusted data, using a restrictive, ' +
        'schema-validated format such as JSON instead. SSRF is closed by an allowlist of legitimate ' +
        'destinations, blocking internal address ranges, and refusing to follow unvalidated redirects. ' +
        'Supply chain risk is managed by pinning dependencies with a lockfile, scanning for known ' +
        'vulnerabilities, and keeping an SBOM current enough to answer a disclosure quickly.\n\n' +
        'None of these three mitigations substitutes for either of the others, because the three risks do ' +
        'not share a mechanism: one is about what a byte stream is allowed to construct, one is about ' +
        'where a server is allowed to send a request, and one is about what code ends up in the build at ' +
        'all.',
    },
    options: [
      { id: 'a', label: 'Deserialisation risk is reduced by using a restrictive, schema-validated format such as JSON for untrusted data, rather than a native format with arbitrary type resolution.' },
      { id: 'b', label: 'SSRF risk is reduced by an allowlist of legitimate destinations combined with blocking internal address ranges and unvalidated redirects.' },
      { id: 'c', label: 'Supply chain risk is managed with a lockfile, dependency scanning, and a current software bill of materials.' },
      { id: 'd', label: 'None of these three mitigations meaningfully substitutes for either of the other two, because the three risks do not share a mechanism.' },
      { id: 'e', label: 'A dependency scanner that flags known-vulnerable packages also provides adequate protection against SSRF and insecure deserialisation.' },
    ],
    hints: [
      'Four are correct. One assumes a scanner aimed at one risk covers the other two.',
      'Ask what a dependency scanner actually inspects, and whether that overlaps with a request the server makes at runtime.',
      'Matching a mitigation to the wrong mechanism is a common way a remediation plan looks complete and is not.',
    ],
    solution:
      'A, B, C, and D. The correct mitigation for each risk, and the fact that none of them covers the ' +
      'others. E conflates two unrelated problems: a dependency scanner inspects known packages for known ' +
      'vulnerabilities, it has no visibility into a runtime request the server chooses to make, or into a ' +
      'deserialisation call on data that arrived over the network rather than through a package manager.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes a control for one risk class provides coverage for a different one.',
      },
    ],
    debrief:
      'When a remediation plan proposes one tool to cover several unrelated findings, check the mechanism ' +
      'of each finding against what that tool actually inspects before accepting it.',
    practice: [],
  },
  {
    id: 'asf.6.5',
    moduleId: 'asf.6',
    packageId: 'appsec-foundations',
    order: 5,
    title: 'Write the SSRF finding for a webhook feature',
    kind: 'short-answer',
    goal: 'Explain the SSRF risk in a server-side fetch and name a concrete mitigation.',
    prompt:
      'You are reviewing this endpoint, which lets a user register a webhook URL that the server will ' +
      'call later with event data.\n\n' +
      '  app.post("/webhooks", (req, res) => {\n' +
      '    db.saveWebhook(req.body.url);\n' +
      '    res.status(201).end();\n' +
      '  });\n\n' +
      'In three or four sentences, explain the risk and what change you would ask for.',
    teach: {
      concept:
        'A good SSRF finding names what the server would be tricked into reaching, not just that a URL is ' +
        'user-supplied. Here, whatever address req.body.url contains is a destination the server will ' +
        'later make a real network request to, on the servers own network position, with no restriction ' +
        'on what that address can be.\n\n' +
        'A good fix names a concrete control rather than a vague instruction to validate the URL: block ' +
        'requests to internal and link-local address ranges, resolve the hostname and check the resulting ' +
        'address rather than trusting the string alone, since a hostname can resolve to an internal ' +
        'address, and either allowlist expected destinations or explicitly refuse to follow redirects to ' +
        'an address that was not itself checked.',
    },
    hints: [
      'Name what the server will actually do with this value later, not just that it is user input.',
      'A hostname can resolve to an internal address even if the string itself looks external. What does the fix need to check?',
      'A strong answer names the SSRF risk, and asks for internal-range blocking plus validating the resolved address, not just the string.',
    ],
    solution:
      'This saves a user-supplied URL that the server will later fetch directly, which is server-side ' +
      'request forgery: an attacker can register an internal address, or a hostname that resolves to one, ' +
      'and use the servers own network position to reach something they could never reach directly. I ' +
      'would ask for the destination to be validated against an allowlist where possible, for the ' +
      'resolved address, not just the hostname string, to be checked against internal and link-local ' +
      'ranges before the request is made, and for redirects from that request not to be followed blindly.',
    expectedOutput:
      'An answer naming SSRF and the servers network position as the risk, and specifying validation of ' +
      'the resolved address against internal ranges plus redirect handling as the fix.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['ssrf', 'server-side request forgery', 'server.{0,15}fetch', 'servers own network'],
          ['internal', 'metadata', 'link-local', 'private address'],
          ['allowlist', 'resolved address', 'redirect', 'block'],
        ],
        hint:
          'Three ideas: name SSRF and the risk of using the servers network position, mention internal ' +
          'addresses as a target, and name a concrete control such as allowlisting or checking the ' +
          'resolved address.',
      },
    ],
    debrief:
      'Webhook registration endpoints are one of the most common places SSRF findings turn up in real ' +
      'products, because the feature genuinely needs the server to fetch a user-chosen URL.',
    practice: [],
  },
];

// --- Module asf.7: secure code review methodology -----------------------------

const REVIEW_METHOD_TEACH = {
  concept:
    'A large diff reviewed top to bottom, line by line, in the order it happens to appear, is a slow way ' +
    'to find the finding that matters and a fast way to run out of attention before you reach it. An ' +
    'efficient review reads the diff for SHAPE first: what changed at a structural level, which files ' +
    'touch authentication, data access, or external input, and which are mechanical, a rename, a ' +
    'formatting pass, a version bump, that can be skimmed rather than studied.\n\n' +
    'From there, review works outward from TRUST BOUNDARIES: find every place a value arrives from ' +
    'outside the code, a request parameter, a file upload, a message from a queue, a response from a ' +
    'third-party API, and trace what happens to it. Static analysis and linters earn their keep here by ' +
    'pre-filtering the mechanical patterns, string concatenation into a query, an unencoded write into ' +
    'a template, so a reviewer human attention goes to the judgement calls a tool cannot make: whether ' +
    'this particular authorisation check is actually correct for this particular endpoint.',
} as const;

const PRIORITY_UNDER_PRESSURE_TEACH = {
  concept:
    'Under a real deadline, not everything in a diff gets equal attention, and knowing the order to work ' +
    'in is most of the skill. Highest priority: any change to AUTHENTICATION or AUTHORISATION logic, ' +
    'because a mistake there tends to be broad and silent. Next: any new place EXTERNAL INPUT is ' +
    'accepted and used, a new endpoint, a new file upload, a new integration, because that is where the ' +
    'injection and SSRF classes live. Next: anything touching SECRETS or CRYPTOGRAPHY, a hardcoded key, ' +
    'a weakened algorithm, a certificate check disabled for a test that never got removed. Lowest, not ' +
    'because it never matters but because it rarely costs much to fix later: naming, formatting, and ' +
    'structural preferences that do not change behaviour.\n\n' +
    'A reviewer working against a clock who spends the first ten minutes on formatting has already lost ' +
    'the review, whatever they find in the remaining time.',
} as const;

const FINDING_VS_NITPICK_TEACH = {
  concept:
    'A FINDING has three properties: a concrete way it can be triggered, a consequence if it is, and a ' +
    'reason it was not supposed to be possible. "An attacker who controls this field can read another ' +
    'user data, because there is no ownership check" is a finding, whatever tone it is delivered in.\n\n' +
    'A NITPICK is a preference: naming, a different but equally correct approach, a style the reviewer ' +
    'would have chosen differently. Both are worth raising, but conflating them wastes a developer time ' +
    'and dilutes the findings that actually matter, because a review comment stream where every third ' +
    'item is a naming preference trains the reader to skim all of it, including the one comment they ' +
    'needed to stop and read carefully. Labelling comments explicitly, this is a finding versus this is a ' +
    'preference, costs nothing and fixes the problem directly.',
} as const;

const MODULE_ASF_7: Exercise[] = [
  {
    id: 'asf.7.1',
    moduleId: 'asf.7',
    packageId: 'appsec-foundations',
    order: 1,
    title: 'Reading a diff for shape before reading it for lines',
    kind: 'multiple-choice',
    goal: 'Describe an efficient approach to reviewing a large diff.',
    prompt:
      'You are handed a four-hundred-line pull request an hour before a release. Which of the following ' +
      'are sound approaches to reviewing it efficiently? Select all that apply.',
    teach: REVIEW_METHOD_TEACH,
    options: [
      { id: 'a', label: 'Reading the diff for structural shape first, identifying which files touch authentication or external input, is a reasonable starting point.' },
      { id: 'b', label: 'Mechanical changes, such as a rename or a formatting pass, can generally be skimmed rather than studied line by line.' },
      { id: 'c', label: 'Tracing what happens to every value that arrives from outside the code is a productive way to spend limited review time.' },
      { id: 'd', label: 'Letting static analysis pre-filter mechanical patterns frees reviewer attention for judgement calls a tool cannot make.' },
      { id: 'e', label: 'The only thorough way to review a diff is line by line, in the order the lines appear in the file.' },
    ],
    hints: [
      'Four are sound. One treats reading order as equivalent to thoroughness.',
      'Ask what a strictly top-to-bottom read does to your attention by line three hundred.',
      'A tool that catches the mechanical patterns frees you for something specific. What is it?',
    ],
    solution:
      'A, B, C, and D. Reading for shape, skimming the mechanical parts, tracing external input, and ' +
      'using tooling to pre-filter. E confuses order with thoroughness: a strictly linear read spends the ' +
      'same attention on a renamed variable as on a new authentication check, and under a deadline that ' +
      'is how the authentication check gets the tired, rushed pass instead of the careful one.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option assumes reading order and review quality are the same thing.',
      },
    ],
    debrief:
      'This is a skill you can practise deliberately: before reading a single line of a real diff, spend ' +
      'thirty seconds classifying every changed file by what kind of change it is.',
    practice: [],
  },
  {
    id: 'asf.7.2',
    moduleId: 'asf.7',
    packageId: 'appsec-foundations',
    order: 2,
    title: 'What gets the first ten minutes',
    kind: 'multiple-choice',
    goal: 'Order review attention correctly under a real time constraint.',
    prompt:
      'You have twenty minutes to review a diff that touches a login endpoint, adds a new file upload ' +
      'feature, renames several variables for clarity, and adjusts log message wording. Which of the ' +
      'following prioritisation statements are accurate? Select all that apply.',
    teach: PRIORITY_UNDER_PRESSURE_TEACH,
    options: [
      { id: 'a', label: 'The login endpoint change deserves the first and closest attention, because a mistake in authentication logic tends to be broad and silent.' },
      { id: 'b', label: 'The new file upload feature deserves close attention as a new place external input is accepted.' },
      { id: 'c', label: 'The variable renaming and log message wording can reasonably wait until last, or be skipped under this time constraint.' },
      { id: 'd', label: 'Spending the first several minutes on the renaming and wording changes would leave less time for the parts of the diff most likely to hide a real flaw.' },
      { id: 'e', label: 'All four changes deserve strictly equal review time, since a thorough reviewer treats every part of a diff identically.' },
    ],
    hints: [
      'Four are accurate. One rejects the idea of prioritising at all.',
      'Under a genuine time limit, what is the actual cost of treating every line as equally important?',
      'Rank the four changes by how broad and how silent a mistake in each one would be.',
    ],
    solution:
      'A, B, C, and D. Authentication first, new external input close behind, cosmetic changes last, and ' +
      'the real cost of spending early time on them. E is the position that produces the worst outcome ' +
      'under a deadline: treating everything equally under a genuine time limit does not mean everything ' +
      'gets adequate attention, it means the limited time gets allocated by the order things happen to ' +
      'appear in the diff rather than by what actually matters.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option rejects prioritisation as a concept under a real time limit.',
      },
    ],
    debrief:
      'A twenty-minute review that covers the login change and the upload feature thoroughly and skips ' +
      'the renaming entirely is a better review than one that skims all four equally.',
    practice: [],
  },
  {
    id: 'asf.7.3',
    moduleId: 'asf.7',
    packageId: 'appsec-foundations',
    order: 3,
    title: 'Three properties that make something a finding',
    kind: 'multiple-choice',
    goal: 'Separate a genuine finding from a stylistic nitpick.',
    prompt:
      'A reviewer leaves two comments on a diff: one says "an attacker who controls this field can read ' +
      'another user data, because there is no ownership check", and the other says "I would have named ' +
      'this variable differently". Which of the following are true? Select all that apply.',
    teach: FINDING_VS_NITPICK_TEACH,
    options: [
      { id: 'a', label: 'The first comment names a concrete trigger, a consequence, and a reason it was not supposed to be possible, which makes it a finding.' },
      { id: 'b', label: 'The second comment is a preference about an equally correct alternative, which makes it a nitpick.' },
      { id: 'c', label: 'Both comments can be worth raising, but conflating their weight in the same review dilutes the one that matters more.' },
      { id: 'd', label: 'Labelling comments explicitly, as a finding versus a preference, costs the reviewer very little and helps the reader triage them correctly.' },
      { id: 'e', label: 'Since both comments are phrased politely and constructively, they carry equivalent weight in the review.' },
    ],
    hints: [
      'Four are true. One judges weight by tone rather than by content.',
      'Ask what happens if the security finding and the naming preference are ignored equally, because they read the same.',
      'What does explicitly labelling a comment cost the reviewer, and what does it save the reader?',
    ],
    solution:
      'A, B, C, and D. What makes the first comment a finding, what makes the second a nitpick, the cost ' +
      'of conflating them, and the value of labelling. E judges by delivery rather than substance: tone ' +
      'says nothing about whether ignoring a comment has a security consequence, and a reader trained to ' +
      'treat every comment as equally weighted has no way to tell which one to act on first.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option judges the weight of a comment by its tone rather than its content.',
      },
    ],
    debrief:
      'Adopt the habit of labelling your own comments this way. It costs one word and it is the single ' +
      'cheapest thing you can do to make a review queue easier to triage.',
    practice: [],
  },
  {
    id: 'asf.7.4',
    moduleId: 'asf.7',
    packageId: 'appsec-foundations',
    order: 4,
    title: 'Every theoretical issue is not a safer report',
    kind: 'multiple-choice',
    goal: 'Judge whether a written-up finding is exploitable and specific enough to act on.',
    prompt:
      'A reviewer flags every place a value is used without being individually re-validated, including ' +
      'places already covered by a shared validation layer earlier in the request path, producing a very ' +
      'long list of theoretical issues. Which of the following are true? Select all that apply.',
    teach: {
      concept:
        'A finding that names an exploitable path is actionable: it says how the flaw is triggered and ' +
        'what happens as a result. A finding that names every place a pattern appears, regardless of ' +
        'whether it is actually reachable by an attacker, produces volume without triage, and a developer ' +
        'facing forty flagged lines, most of which are already protected upstream, learns to discount the ' +
        'whole list rather than work through it.\n\n' +
        'A good write-up does the triage the reader would otherwise have to redo: it distinguishes a place ' +
        'genuinely reachable by untrusted input from a place already covered by an earlier check, and ' +
        'says so explicitly rather than flagging both identically. This is not about lowering the bar for ' +
        'what gets reported, it is about reporting what is actually true of each instance rather than ' +
        'applying one label to all of them.',
    },
    options: [
      { id: 'a', label: 'A finding that specifies whether a flagged instance is actually reachable by untrusted input is more useful than one that flags the pattern everywhere it appears.' },
      { id: 'b', label: 'A long list where most items are already covered upstream trains the reader to discount the whole list, including the items that matter.' },
      { id: 'c', label: 'Doing the triage of which instances are genuinely exploitable is part of writing a useful finding, not a shortcut that lowers quality.' },
      { id: 'd', label: 'A report is more useful when it distinguishes a reachable instance from one already protected by an earlier check, rather than labelling both identically.' },
      { id: 'e', label: 'Flagging every instance of a risky pattern regardless of reachability maximises the safety of the report, because nothing theoretically possible is left out.' },
    ],
    hints: [
      'Four are true. One assumes more flagged lines is strictly safer than fewer, better-triaged ones.',
      'What happens to a developer trust in your next report after this one contains forty items and thirty-six were already covered?',
      'Completeness and usefulness are not the same thing in a finding list.',
    ],
    solution:
      'A, B, C, and D. Specifying reachability, the trust cost of an untriaged list, triage as part of the ' +
      'job rather than a shortcut, and the value of distinguishing covered from uncovered instances. E is ' +
      'the belief that produces exactly the outcome this exercise warns against: a report that flags ' +
      'everything regardless of exploitability does not maximise safety, it maximises volume, and volume ' +
      'without triage gets ignored.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats maximum volume as equivalent to maximum safety.',
      },
    ],
    debrief:
      'A shorter list of triaged, exploitable findings gets fixed faster than a longer list of theoretical ' +
      'ones, because the developer reading it can tell where to start.',
    practice: [],
  },
  {
    id: 'asf.7.5',
    moduleId: 'asf.7',
    packageId: 'appsec-foundations',
    order: 5,
    title: 'Write up a finding you found under time pressure',
    kind: 'short-answer',
    goal: 'Compress a real finding into a review comment that names the trigger, the consequence, and the fix.',
    prompt:
      'Reviewing the diff from an earlier exercise, you notice an endpoint fetches a record by an id taken ' +
      'from the URL with no ownership check, in a pull request you have four minutes left to review. In ' +
      'three or four sentences, write the comment you would leave.',
    teach: {
      concept:
        'A finding written under time pressure still needs its three properties: trigger, consequence, and ' +
        'fix. What changes under time pressure is not rigour, it is length: the same three ideas expressed ' +
        'as compactly as possible, because a reviewer with four minutes left does not have time to write, ' +
        'or the developer to read, a paragraph of preamble.\n\n' +
        'A strong compressed comment states the trigger in one clause, the consequence in one clause, and ' +
        'the fix in one clause, in that order, with nothing else. That is the same finding as the fuller ' +
        'write-up from module five, deliberately shortened rather than deliberately weakened.',
    },
    hints: [
      'Keep the three parts, trigger, consequence, fix, and cut everything else rather than cutting one of the three.',
      'One clause per idea is enough. Resist the urge to explain background under time pressure.',
      'A strong answer names the missing ownership check, the resulting data exposure, and requests a session-based comparison, in as few words as it can manage.',
    ],
    solution:
      'This fetches a record by an id from the URL with no ownership check, so any authenticated user can ' +
      'read any other user record by changing the id. Please add a check comparing the record owner to ' +
      'the requester identity from the session before returning it. Flagging as a blocker given the ' +
      'exposure.',
    expectedOutput:
      'A compact comment naming the missing ownership check, the resulting exposure, and the session-based ' +
      'fix, in roughly three sentences.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['ownership', 'no check', 'missing check'],
          ['any user', 'other user', 'expos', 'read.{0,15}data'],
          ['session', 'compare', 'requester'],
        ],
        hint:
          'Three ideas, kept compact: the missing ownership check, the exposure it causes, and a ' +
          'session-based comparison as the fix.',
      },
    ],
    debrief:
      'Compression under pressure is the actual skill this module has been building toward. A finding is ' +
      'no less rigorous for being three sentences instead of a paragraph.',
    practice: [],
  },
];

// --- Module asf.8: threat modelling and working with developers --------------

const STRIDE_TEACH = {
  concept:
    'STRIDE is a checklist for asking, at the whiteboard stage, what could go wrong with a design, one ' +
    'letter at a time. SPOOFING: can something pretend to be a different user or a different system than ' +
    'it actually is? TAMPERING: can data be modified somewhere it should not be, in transit or at rest? ' +
    'REPUDIATION: could someone deny having done something the system needs to hold them accountable ' +
    'for, because no record of it exists? INFORMATION DISCLOSURE: can data reach someone who should not ' +
    'see it? DENIAL OF SERVICE: can the system, or a part of it, be made unavailable to legitimate users? ' +
    'ELEVATION OF PRIVILEGE: can an actor end up with more access than they were granted?\n\n' +
    'STRIDE is not a formula that produces a fixed list of findings from a diagram. It is a set of ' +
    'prompts to walk through against each component and each data flow in a design, catching questions a ' +
    'team would otherwise only ask by accident. Not every letter applies to every design with equal ' +
    'force, and that is expected. The value is in deliberately asking all six rather than only the ones ' +
    'that happen to occur to whoever is in the room.',
} as const;

const DEPT_OF_NO_TEACH = {
  concept:
    'A finding that only ever says no, without naming a path forward, teaches a team to route around ' +
    'security rather than through it, which is a worse outcome than the original finding shipping, ' +
    'because it costs the relationship as well. Landing a finding well means being specific about the ' +
    'risk, honest about its actual severity rather than inflating it for effect, and, wherever possible, ' +
    'offering an alternative that gets the team most of what they wanted with the risk removed or ' +
    'reduced.\n\n' +
    'Sometimes a release genuinely has to wait, and saying so plainly, with the specific reason, is not ' +
    'being the department of no, it is doing the job. What earns that label is blocking by reflex, ' +
    'treating every finding as equally severe, or never proposing a way forward, so that every ' +
    'interaction with the function feels like an obstacle rather than a collaborator with a different set ' +
    'of concerns than the roadmap.',
} as const;

const MODULE_ASF_8: Exercise[] = [
  {
    id: 'asf.8.1',
    moduleId: 'asf.8',
    packageId: 'appsec-foundations',
    order: 1,
    title: 'Six letters, six questions',
    kind: 'multiple-choice',
    goal: 'Match STRIDE categories to concrete design risks.',
    prompt:
      'You are threat modelling a design where one internal service calls another to fetch pricing data. ' +
      'Which of the following are correct applications of STRIDE to it? Select all that apply.',
    teach: STRIDE_TEACH,
    options: [
      { id: 'a', label: 'Asking whether the calling service could be impersonated by another system on the network is a spoofing question.' },
      { id: 'b', label: 'Asking whether the pricing data could be altered in transit between the two services is a tampering question.' },
      { id: 'c', label: 'Asking whether the pricing service logs enough to prove which caller requested a given change is a repudiation question.' },
      { id: 'd', label: 'Asking whether an unrelated service could read pricing data it has no business need for is an information disclosure question.' },
      { id: 'e', label: 'STRIDE is a scoring formula that produces a fixed, complete list of findings once applied to a diagram.' },
    ],
    hints: [
      'Four are correct applications. One misrepresents what STRIDE actually is.',
      'Match each option to one of the six letters, and check the letter fits the question being asked.',
      'STRIDE prompts questions. Does it also guarantee it has asked every possible question about this design?',
    ],
    solution:
      'A, B, C, and D. Spoofing, tampering, repudiation, and information disclosure, each correctly ' +
      'matched. E overstates what a checklist can do: STRIDE is a set of prompts to make sure six angles ' +
      'get asked deliberately, not a formula guaranteed to enumerate every risk in a design, and treating ' +
      'it as complete is how a real gap gets missed with false confidence.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats a prompting checklist as a guaranteed-complete formula.',
      },
    ],
    debrief:
      'In a real session, walk the design component by component and ask all six letters against each ' +
      'one, even the ones that feel obviously fine. The value is in the discipline of asking, not just ' +
      'the answer you expect.',
    practice: [],
  },
  {
    id: 'asf.8.2',
    moduleId: 'asf.8',
    packageId: 'appsec-foundations',
    order: 2,
    title: 'The cheapest moment to find a problem',
    kind: 'multiple-choice',
    goal: 'Argue for threat modelling at the design stage, against the misconception that it only suits large formal reviews.',
    prompt:
      'A team says threat modelling is only worth doing for large, complex systems, as a formal annual ' +
      'exercise. Which of the following are true? Select all that apply.',
    teach: {
      concept:
        'A small design decided in a thirty-minute conversation still creates trust boundaries and data ' +
        'flows, and a five-minute pass through STRIDE against a whiteboard sketch costs almost nothing ' +
        'compared to finding the same gap after the feature ships. Waiting for an annual, formal exercise ' +
        'means most designs never get modelled at all, because most designs happen between the annual ' +
        'events, in ordinary sprint planning, not in a scheduled review.\n\n' +
        'A lightweight pass done every time a new data flow or trust boundary is introduced, even for a ' +
        'small feature, catches far more in practice than an infrequent, heavyweight one applied only to ' +
        'the largest systems, because the largest systems are also the ones most likely to already have ' +
        'other scrutiny, while the small feature slips through unreviewed by anyone.',
    },
    options: [
      { id: 'a', label: 'A small design decided quickly still creates trust boundaries worth a brief threat modelling pass.' },
      { id: 'b', label: 'Waiting for an annual, formal exercise means most designs, which happen in ordinary sprint planning, never get modelled at all.' },
      { id: 'c', label: 'Catching a design flaw at the whiteboard stage is generally far cheaper than catching the same flaw after the feature ships.' },
      { id: 'd', label: 'A lightweight pass applied frequently to small designs can catch more in practice than an infrequent, heavyweight pass reserved for the largest systems.' },
      { id: 'e', label: 'Threat modelling is only a worthwhile use of time for systems large and complex enough to justify a formal, scheduled review.' },
    ],
    hints: [
      'Four are true. One is the exact position the exercise is built to challenge.',
      'Ask how many of a teams actual design decisions happen inside a formal, scheduled review versus in an ordinary planning conversation.',
      'Small and unreviewed is a worse combination than large and reviewed once a year.',
    ],
    solution:
      'A, B, C, and D. Small designs still creating trust boundaries, the coverage gap left by an annual ' +
      'cadence, the cost curve favouring early review, and lightweight-frequent beating heavyweight-rare ' +
      'in practice. E is the belief that leaves the majority of a teams actual design decisions completely ' +
      'unmodelled, because most decisions are made in ordinary planning, not in a scheduled formal review.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option restricts threat modelling to a scale and cadence that misses most real design decisions.',
      },
    ],
    debrief:
      'The most useful threat modelling habit to build is not the big annual session, it is the five ' +
      'minute version you can run in any sprint planning meeting without anybody having to schedule ' +
      'anything.',
    practice: [],
  },
  {
    id: 'asf.8.3',
    moduleId: 'asf.8',
    packageId: 'appsec-foundations',
    order: 3,
    title: 'Landing a finding without being the reason the launch slips',
    kind: 'multiple-choice',
    goal: 'Distinguish blocking by reflex from blocking with reason, and see the value of offering a path forward.',
    prompt:
      'A finding is raised two days before a planned launch. Which of the following describe a sound way ' +
      'to handle it? Select all that apply.',
    teach: DEPT_OF_NO_TEACH,
    options: [
      { id: 'a', label: 'Being specific about the actual severity of the finding, rather than treating it as maximally severe by default, helps the team make a real decision.' },
      { id: 'b', label: 'Offering an alternative that gets most of the intended functionality with the risk reduced is generally more useful than a flat no.' },
      { id: 'c', label: 'If the risk genuinely requires the launch to wait, saying so plainly, with the specific reason, is doing the job rather than being obstructive.' },
      { id: 'd', label: 'Treating every finding as equally severe regardless of its actual risk is what earns a security function the department of no reputation.' },
      { id: 'e', label: 'Blocking the launch until every finding, however minor, is fully fixed is the correct default stance for protecting the organisation.' },
    ],
    hints: [
      'Four describe sound handling. One treats blocking as the safe default regardless of severity.',
      'Ask what a team learns to do the next time it anticipates a blanket, unreasoned block.',
      'Sometimes a launch genuinely should wait. What makes that a defensible decision rather than reflexive obstruction?',
    ],
    solution:
      'A, B, C, and D. Honest severity, offering an alternative, saying no plainly when it is genuinely ' +
      'warranted, and naming the reflex that earns the reputation. E is the reflex itself: a blanket, ' +
      'severity-blind block does not protect the organisation, it teaches the next team to avoid bringing ' +
      'their design to review at all, which produces worse outcomes than the finding that triggered it.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option treats blocking regardless of severity as the safe default.',
      },
    ],
    debrief:
      'The teams that keep bringing you their designs early are the ones who learned that talking to you ' +
      'produces a decision, not an automatic no. That reputation is worth protecting deliberately.',
    practice: [],
  },
  {
    id: 'asf.8.4',
    moduleId: 'asf.8',
    packageId: 'appsec-foundations',
    order: 4,
    title: 'Threat modelling as a team sport',
    kind: 'multiple-choice',
    goal: 'Argue for running threat modelling with the development team rather than as a solo audit handed down afterward.',
    prompt:
      'You are deciding how to run a threat modelling session for a new feature. Which of the following ' +
      'are sound approaches? Select all that apply.',
    teach: {
      concept:
        'The developers who designed a system know details a security reviewer working alone will miss: ' +
        'which assumption is load-bearing, which part of the design is likely to change next quarter, and ' +
        'which trust boundary looks solid on the diagram but is actually enforced nowhere in the code yet. ' +
        'Running the session with them, asking the STRIDE questions together rather than delivering a ' +
        'finished list afterward, surfaces those details while the design is still cheap to change.\n\n' +
        'It also builds a skill that outlasts the one session: a team that has walked through STRIDE ' +
        'themselves starts noticing some of these questions on their own, on the next design, before ' +
        'anyone from security is even in the room, which is a better outcome for coverage than any single ' +
        'reviewer being thorough alone could produce.',
    },
    options: [
      { id: 'a', label: 'The developers who designed the system know which assumptions are load-bearing in a way a reviewer working alone typically does not.' },
      { id: 'b', label: 'Running the session with the team, rather than delivering a finished list afterward, surfaces relevant details while the design is still cheap to change.' },
      { id: 'c', label: 'A team that has walked through STRIDE themselves is more likely to raise similar questions unprompted on their next design.' },
      { id: 'd', label: 'Building the teams own habit of asking these questions produces better long-run coverage than any single reviewer being thorough alone.' },
      { id: 'e', label: 'To keep the quality of the threat model consistent, the security function should make every finding and every decision without developer input.' },
    ],
    hints: [
      'Four are sound. One removes the people who actually understand the design from the process meant to examine it.',
      'Ask who knows which assumption in this design is the one likely to break first.',
      'A skill the team keeps after the session ends is worth more than a list that only exists for one review.',
    ],
    solution:
      'A, B, C, and D. Developer context, the value of running the session together, the habit it builds, ' +
      'and the long-run coverage payoff. E removes exactly the people whose knowledge of the design makes ' +
      'a threat model useful, and produces a review that misses details the team could have surfaced in ' +
      'minutes, along with none of the lasting benefit of the team learning to ask these questions ' +
      'themselves.',
    expectedOutput: 'Options A, B, C, and D selected.',
    checks: [
      {
        type: 'choice-equals',
        optionIds: ['a', 'b', 'c', 'd'],
        hint: 'One option excludes the people with the most relevant context from the process.',
      },
    ],
    debrief:
      'The best sign a threat modelling programme is working is not a growing list of findings, it is a ' +
      'team that starts raising the STRIDE questions themselves before you ask.',
    practice: [],
  },
  {
    id: 'asf.8.5',
    moduleId: 'asf.8',
    packageId: 'appsec-foundations',
    order: 5,
    title: 'Respond to pushback without becoming the blocker',
    kind: 'short-answer',
    goal: 'Write a response that lands a genuine finding without defaulting to a flat block.',
    prompt:
      'You found a real access control gap during threat modelling, and the engineering lead says fixing ' +
      'it properly will delay a launch the whole company is expecting on a fixed date, and asks you to ' +
      'sign off anyway. In three or four sentences, write your response.',
    teach: {
      concept:
        'A response that only says no protects nothing and costs the relationship. A response that signs ' +
        'off silently protects nothing either, and puts the finding entirely on you if it is exploited ' +
        'later. The useful response does three things: states the actual risk plainly, so the decision is ' +
        'made with real information rather than optimism, offers a narrower option if one genuinely ' +
        'exists, such as a scoped mitigation that reduces the risk even if it cannot eliminate it before ' +
        'the date, and makes clear who is accepting what risk if the date holds regardless, so the ' +
        'decision is visible rather than quietly absorbed.\n\n' +
        'This is not refusing to compromise. It is refusing to let the compromise happen silently, which ' +
        'is the difference between being a partner in the decision and being either an obstacle to it or ' +
        'invisible in it.',
    },
    hints: [
      'State the actual risk plainly rather than either softening it or maximising it for effect.',
      'Offer a narrower option if one exists, such as a scoped, partial mitigation before the date.',
      'A strong answer states the risk, proposes a partial mitigation or timeline, and names who is accepting the residual risk if the date holds anyway.',
    ],
    solution:
      'I want to make sure this is a decision made with the real risk in view rather than assumed away: an ' +
      'attacker who reaches this gap can access other users data, not just their own. If the date cannot ' +
      'move, I can scope a narrower mitigation that closes the worst of it before launch, with the fuller ' +
      'fix following shortly after, but I want that trade-off, and who is accepting the remaining risk ' +
      'until then, written down rather than implied.',
    expectedOutput:
      'A response naming the concrete risk, proposing a narrower or phased mitigation, and making the risk ' +
      'acceptance explicit rather than silent.',
    checks: [
      {
        type: 'answer-mentions',
        conceptGroups: [
          ['risk', 'access', 'expos', 'attacker'],
          ['scope', 'partial', 'phase', 'narrower', 'mitigat'],
          ['accept', 'sign off', 'written down', 'explicit', 'documented'],
        ],
        hint:
          'Three ideas: name the concrete risk plainly, propose a scoped or phased alternative, and make ' +
          'the risk acceptance explicit rather than silent.',
      },
    ],
    debrief:
      'Notice this response never says no. It also never pretends the risk is not there. That combination ' +
      'is what keeps you in the room for the next decision instead of routed around for it.',
    practice: [],
  },
];

export const APPSEC_FOUNDATIONS: LearningPackage = {
  id: 'appsec-foundations',
  order: 24,
  title: 'Application Security Foundations',
  summary:
    'Preventing the vulnerability instead of responding to it: where the seat sits in the development ' +
    'lifecycle and how it differs from a penetration test, injection and cross-site scripting at the ' +
    'code level, authentication and session flaws HTTPS does not fix, access control and the gap ' +
    'between being authenticated and being authorised, deserialisation and SSRF and dependency risk, ' +
    'how to review a diff efficiently under real time pressure, and threat modelling at the whiteboard ' +
    'stage without becoming the department of no.',
  outcomes: [
    'Explain where application security sits in the SDLC and how it differs from a penetration test and a code style audit',
    'Name concrete shift-left practice and reject the version that only relocates blame',
    'Read a snippet vulnerable to SQL or command injection, and explain why parameterisation closes it structurally',
    'Distinguish stored, reflected and DOM-based XSS, and apply output encoding that matches the actual context a value lands in',
    'Identify broken authentication and session flaws, including session fixation and an insecure password reset flow',
    'Explain precisely what HTTPS does and does not protect in an authentication flow',
    'Separate authentication from authorisation, and recognise an insecure direct object reference at the code level',
    'Reason about the real risk of deserialising untrusted data, of an SSRF-capable feature, and of an unmanaged dependency tree',
    'Review a diff efficiently under time pressure, and tell a genuine finding apart from a stylistic nitpick',
    'Run a lightweight STRIDE pass at the design stage, and land a finding without becoming the department of no',
  ],
  /*
   * No prerequisite. The audience arrives from software development and QA
   * rather than from an operations or security background, and most of what
   * this package teaches is reading code they can already read. Gating it
   * behind a Linux or terminal package would turn away exactly the developers
   * this track exists to reach; the wider Application Security track adds a
   * scripting expectation later, this foundation does not need one.
   */
  prerequisites: [],
  modules: [
    {
      id: 'asf.1',
      packageId: 'appsec-foundations',
      order: 1,
      title: 'The seat, not the buzzword',
      summary:
        'Where application security sits in the SDLC, how it differs from a penetration test and a code ' +
        'style audit, what shift left means in concrete practice, and how the role is actually measured.',
      exercises: MODULE_ASF_1,
    },
    {
      id: 'asf.2',
      packageId: 'appsec-foundations',
      order: 2,
      title: 'Injection at the code level',
      summary:
        'SQL injection and command injection traced through real snippets, why parameterisation closes ' +
        'the hole structurally, and why client-side validation never counts as a security control.',
      exercises: MODULE_ASF_2,
    },
    {
      id: 'asf.3',
      packageId: 'appsec-foundations',
      order: 3,
      title: 'Cross-site scripting and output encoding',
      summary:
        'Stored, reflected and DOM-based XSS, why encoding has to match the exact context a value lands ' +
        'in, and where a Content Security Policy fits as a second layer rather than a fix.',
      exercises: MODULE_ASF_3,
    },
    {
      id: 'asf.4',
      packageId: 'appsec-foundations',
      order: 4,
      title: 'Authentication and session flaws',
      summary:
        'Credential stuffing, lockout tradeoffs, session fixation, insecure password reset flows, and ' +
        'exactly what HTTPS does and does not protect in an authentication design.',
      exercises: MODULE_ASF_4,
    },
    {
      id: 'asf.5',
      packageId: 'appsec-foundations',
      order: 5,
      title: 'Access control flaws',
      summary:
        'Authentication versus authorisation, insecure direct object reference at the code level, ' +
        'horizontal versus vertical broken access control, and why hiding a link fixes nothing.',
      exercises: MODULE_ASF_5,
    },
    {
      id: 'asf.6',
      packageId: 'appsec-foundations',
      order: 6,
      title: 'Deserialisation, SSRF, and supply chain risk',
      summary:
        'Why deserialising untrusted data is dangerous, what a server-side request forgery actually lets ' +
        'an attacker reach, and dependency risk as a real, ongoing part of the attack surface.',
      exercises: MODULE_ASF_6,
    },
    {
      id: 'asf.7',
      packageId: 'appsec-foundations',
      order: 7,
      title: 'Secure code review methodology',
      summary:
        'Reading a diff for shape before reading it line by line, prioritising under real time pressure, ' +
        'and the difference between a finding and a nitpick.',
      exercises: MODULE_ASF_7,
    },
    {
      id: 'asf.8',
      packageId: 'appsec-foundations',
      order: 8,
      title: 'Threat modelling and working with developers',
      summary:
        'A lightweight STRIDE pass at the whiteboard stage, running it with the team rather than for ' +
        'them, and landing a finding without becoming the department of no.',
      exercises: MODULE_ASF_8,
    },
  ],
};
