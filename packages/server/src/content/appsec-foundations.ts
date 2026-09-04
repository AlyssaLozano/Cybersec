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
    'Picture how a house gets built. First someone draws up plans: where the front door goes, how ' +
    'thick the walls are, where the wiring runs. Then a crew builds it: foundation, frames, wiring, ' +
    'roof. Then an inspector checks the work before anyone moves in. Then a family lives there for ' +
    'years, and things occasionally need fixing. A safe house is not one where somebody bolts a lock ' +
    'onto the front door on move-in day and calls it done. It is one where safety was considered at ' +
    'every stage: a window placed somewhere a burglar cannot work at unseen, wiring that will not start ' +
    'a fire, a foundation solid enough that doors keep latching properly for years.\n\n' +
    'Software gets built in stages too, and the whole sequence, from an idea for a feature through to ' +
    'real people using it, is what this package calls the DEVELOPMENT LIFECYCLE. It runs roughly: ' +
    'REQUIREMENTS AND DESIGN, deciding what to build and how, before a line of code exists; BUILD, ' +
    'programmers actually writing that code; TEST, checking the finished piece works; DEPLOY, making it ' +
    'available to real users; and OPERATE, running it day after day once it is live. Application ' +
    'security is not one inspection bolted near the end of that list. It is something that happens ' +
    'inside every stage: thinking through what could go wrong with a design before any code exists, ' +
    'reviewing new code for how it could be misused rather than just whether it runs, checking for ' +
    'exploitable holes during testing alongside the ordinary checks that the feature works, locking ' +
    'down passwords and access carefully when a feature goes live, and watching for the flaw that only ' +
    'shows up once real people, some of them dishonest, are actually using the thing.\n\n' +
    'Two comparisons place this job precisely. A PENETRATION TEST is like hiring someone to try to ' +
    'break into a specific house on one specific day: an outside team attacks a system as it stands ' +
    'right now, usually once or twice a year, and reports what they found. Application security is not ' +
    'that one-day visit, it is somebody on the inside, part of the team building the house, thinking ' +
    'about the locks the whole way through. A CODE STYLE AUDIT asks an entirely different question: is ' +
    'the code readable, are things named sensibly, is the formatting consistent. That is closer to ' +
    'checking whether the paint job is neat and the trim lines up. It says nothing about whether a ' +
    'window was left unlocked. Code can be beautifully tidy and completely exploitable, and the reverse ' +
    'is just as common: messy code nobody can break into.',
} as const;

const SHIFT_LEFT_TEACH = {
  concept:
    'Imagine a blueprint has a water pipe running directly behind an electrical panel. Catching that ' +
    'on paper costs a pencil and an eraser: move the pipe on the drawing. Catching it once the walls ' +
    'are half built costs tearing out drywall that is already up. Catching it after a family has moved ' +
    'in, when the pipe finally leaks onto the panel, costs an electrician, a plumber, water damage, and ' +
    'maybe somebody getting hurt. It is the exact same mistake every time. The only thing that changed ' +
    'is how late it was caught, and that lateness is almost the entire cost.\n\n' +
    'SHIFT LEFT means catching that same kind of mistake earlier in the process, not handing the job of ' +
    'catching mistakes to somebody else so nobody has to think about it until later. The stages of ' +
    'building software (design, then build, then test, then release) are usually drawn on a chart left ' +
    'to right in that order, so moving a check earlier literally means moving it left on the chart, ' +
    'which is where the name comes from. A flaw caught while a design is still a conversation and a ' +
    'sketch costs a conversation. The same flaw caught while a developer is writing the code costs a ' +
    'changed line before it ever ships. Caught after the software is already running for real users, it ' +
    'costs an emergency fix made under pressure, sometimes after something has already gone wrong.\n\n' +
    'In practice, shift left is ordinary, concrete work, not a slogan somebody repeats in a meeting. It ' +
    'looks like: somebody writes down what could go wrong with a new feature before the design is ' +
    'signed off, rather than after. A tool automatically checks a programmer code for known-dangerous ' +
    'patterns the moment they try to submit it, instead of a person reviewing it by hand once a ' +
    'quarter. And a line like "handles a wrong password safely" gets added to the checklist right next ' +
    'to "shows the right screen after login", instead of being an afterthought nobody assigned to ' +
    'anyone. None of that removes the need to test the finished software later. It just means there is ' +
    'far less left for that later testing to find.',
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
      'The penetration test still earns its place: a fresh pair of eyes from outside often notices ' +
      'something a person who stares at the same system every day has stopped seeing, the same way a ' +
      'friend catches a typo in your essay that you have read past ten times. Think of it as one more ' +
      'check layered on top of continuous, everyday attention, not a replacement for it.',
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
      'If you ever say the words shift left out loud, whether in a meeting or an interview, be ready to ' +
      'name one of the four concrete practices above as a real example. Plenty of people repeat the ' +
      'phrase without knowing what it actually looks like day to day, and it shows the moment somebody ' +
      'asks for an example and there is not one ready.',
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
        'Think about planning a road trip. Deciding the route on a map the night before is one task. ' +
        'Actually driving the car the next day, reacting to the traffic and the weather and the ' +
        'detour that was not on the map, is a completely different task, done at a different time, by ' +
        'somebody who has to make calls the map never anticipated. Checking the route beforehand does ' +
        'not mean you can skip paying attention while driving, and being a careful driver does not ' +
        'make a badly chosen route safe either. Both matter, at their own point in the trip.\n\n' +
        'Building software works the same way, and knowing which stage an activity belongs to matters ' +
        'because it decides who is responsible for it and how expensive it is to fix if it is missed. ' +
        'Design-stage work, thinking through what could go wrong and picking a safer approach, is done ' +
        'by whoever is sketching out the system, often before anyone whose job title has the word ' +
        '"security" in it is even in the room. Build-stage work belongs to the programmer actually ' +
        'writing the code, and to whoever double-checks it afterward, called a REVIEW: reading a piece ' +
        'of code somebody else wrote to check it for exactly this kind of problem before it goes live. ' +
        'Test-stage work belongs to whoever is checking the finished feature, alongside the ordinary ' +
        'checks that it works at all, not instead of them. Deploy-stage work is about the settings the ' +
        'software runs with once it is live: how passwords and secret keys are stored, how much access ' +
        'it is given, which is often owned by a separate team that runs the servers rather than the ' +
        'team that wrote the feature.\n\n' +
        'A plan for the route is not the same thing as the drive itself. A document describing what a ' +
        'system SHOULD do is not the same thing as the code that a programmer actually wrote on a ' +
        'Friday afternoon, under a deadline, making a judgement call the plan never covered. Both stages ' +
        'need their own attention, and skipping either one because you assume the other already handled ' +
        'it is exactly how a carefully planned system ends up with a badly built implementation.',
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
      'When a problem lands in your lap, the first useful question is which stage let it slip through: ' +
      'a missing conversation at the planning stage, a line of code nobody caught, or a setting nobody ' +
      'checked when the feature went live. That answer tells you whether the fix is a new checklist ' +
      'item, a changed line of code, or a conversation with one particular team.',
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
        'Suppose a doctor is judged purely by how many diagnoses they write down in a year. That number ' +
        'goes up if patients are genuinely getting sicker, but it also goes up if the doctor simply ' +
        'starts running more tests, or starts writing down things that used to go unrecorded. A rising ' +
        'number on its own does not tell you whether the patients are worse off or the doctor just got ' +
        'more thorough. You need a smarter measurement.\n\n' +
        'The same trap applies to counting VULNERABILITIES, the security weaknesses found in a piece of ' +
        'software. A raw count is the easiest number to produce and the least useful one by itself, ' +
        'because it goes up when the tools looking for problems get better, and it also goes up when the ' +
        'software genuinely gets worse, and a report that cannot tell those two apart is not really ' +
        'measuring anything.\n\n' +
        'Better signals track direction and behaviour instead of a raw total. If the SAME kind of mistake ' +
        'keeps showing up release after release, and that rate is falling, it means the actual root cause ' +
        'is being fixed rather than just each individual symptom. TIME TO FIX, meaning how long it takes ' +
        'from a problem being flagged to it actually being corrected in the live software, says whether ' +
        'the process around fixing things works at all. Programmers bringing their own designs to be ' +
        'checked BEFORE being asked to is a sign people trust the process rather than merely tolerating ' +
        'it. And a bug that a simple automated checking tool, or just a habit, caught before it was ever ' +
        'formally written up anywhere is still a real win, even with no paperwork to point to, because the ' +
        'actual goal was never to generate paperwork.',
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
      'If you only ever report the raw count, expect to be judged by it later, including in the one ' +
      'quarter you finally fix the underlying cause that had been generating most of it, and the number ' +
      'suddenly drops in a way that looks like nothing happened rather than like a win.',
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
        'QUALITY ASSURANCE, QA for short, is the job of checking that a piece of software actually does ' +
        'what it is supposed to do. Think of a QA tester like a very thorough restaurant health ' +
        'inspector: they check that the kitchen works the way it is meant to, that the oven reaches the ' +
        'right temperature, that the fridge keeps things cold, including checking the odd edge cases, ' +
        'what happens on the busiest night of the year. That thoroughness is real, valuable work, and it ' +
        'transfers into security more than most other skills do.\n\n' +
        'But it is incomplete on its own, and naming what is missing is the point of this exercise. A ' +
        'security reviewer is not asking "does the kitchen work the way it is supposed to". They are ' +
        'asking a different question entirely: "what could someone do here who is not trying to eat ' +
        'dinner at all, who is trying to start a fire, or walk out with the cash register, or poison the ' +
        'food, using an entrance nobody thought to lock." That is an ADVERSARIAL mindset: not thorough ' +
        'about the intended use, but imaginative about the unintended one, actively hostile rather than ' +
        'merely careful.\n\n' +
        'That shift means paying close attention to TRUST BOUNDARIES: the exact points where something ' +
        'from outside, a delivery at the back door, a customer walking in, a value a user typed into a ' +
        'form, arrives and the people running the place have to decide how much to believe it before ' +
        'acting on it. QA checks the front door works the way it is supposed to. Security checks whether ' +
        'anyone bothered to lock the back one.',
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
      'Every module after this one is really the same distinction, tested against a different piece of ' +
      'code each time: not "does this work", but "what else could this be made to do".',
    practice: [],
  },
];

// --- Module asf.2: injection at the code level -------------------------------

const SQLI_TEACH = {
  concept:
    'Most applications, from a shopping site to a login page, need somewhere to permanently store ' +
    'information: usernames, passwords, orders, messages. That storage system is called a DATABASE, and ' +
    'it is organized into tables, the same shape as a spreadsheet: rows and columns. To ask the database ' +
    'a question, such as "find the user named alice", a program sends it an instruction written in a ' +
    'specific language called SQL (Structured Query Language). One instruction, like "find the row where ' +
    'the name column equals alice", is called a QUERY.\n\n' +
    'Programs often need to build a query out of a value the user just typed, for example checking a ' +
    'username and password somebody entered into a login box. The laziest way to do that is CONCATENATION: ' +
    'gluing pieces of text together into one string, the way you might tape strips of paper end to end. ' +
    'This snippet builds a login check that way:\n\n' +
    "  query = \"SELECT * FROM users WHERE name = '\" + username + \"' AND pass = '\" + password + \"'\"\n\n" +
    'The problem: the database has no way to see where the developer intent ends and the user typed text ' +
    'begins. It just receives one long string and reads all of it as instructions. If username arrives ' +
    "as  ' OR '1'='1  then once it is glued into the string, the finished instruction stops meaning " +
    '"find the row named alice" and starts meaning something closer to "find every row, because this ' +
    'condition is always true". The query returns every row in the table instead of one matching real ' +
    'user, letting an attacker log in as anyone without knowing a single real password. This particular ' +
    'attack, sneaking extra database instructions into a value that was only supposed to be data, is ' +
    'called SQL INJECTION, and it needed no cleverness beyond typing a value nobody expected.\n\n' +
    'The fix is called a PARAMETERISED QUERY, or a prepared statement. Instead of gluing the value ' +
    'straight into the instruction text, the query is sent to the database with blank placeholders, and ' +
    'the actual values are sent separately, clearly labelled as data rather than instructions:\n\n' +
    "  query = \"SELECT * FROM users WHERE name = ? AND pass = ?\"\n" +
    '  execute(query, [username, password])\n\n' +
    'The database now knows, structurally, which part is the instruction and which part is a piece of ' +
    'data being slotted in, the same way a mail-merge template knows "Dear [name]" only ever fills the ' +
    'name into that one blank, whatever the name happens to contain, rather than letting the name rewrite ' +
    'the rest of the letter. Nothing the value contains can change the shape of the instruction anymore. ' +
    'This is not a trick that filters out one more dangerous character. It removes the entire bug, ' +
    'because instructions and data never get glued back into the same string at all.',
} as const;

const COMMAND_INJECTION_TEACH = {
  concept:
    'A SHELL is the program a computer uses to run typed commands: the kind of black window where ' +
    'somebody types a word like "ping" and the computer goes and does it. Software often needs to run one ' +
    'of these commands itself, behind the scenes, as part of a feature, for example checking whether a ' +
    'website a user typed in is actually reachable.\n\n' +
    'The exact same failure as SQL injection shows up here, just in a different place: user-typed text ' +
    'gets glued directly into a command, and the shell cannot tell where the developer intended command ' +
    'ends and the attacker text begins. This snippet builds a ping command out of a hostname somebody ' +
    'typed into a box:\n\n' +
    '  os.system("ping -c 1 " + hostname)\n\n' +
    'A semicolon is one of several characters that tell a shell "stop, that command is finished, here is ' +
    'a brand new one". If hostname arrives as  example.com; rm -rf /var/data  the shell runs the ping, ' +
    'sees the semicolon, and then runs the second command too, one that deletes files. The developer ' +
    'wrote one instruction. The shell reads two. This particular version of the bug is called COMMAND ' +
    'INJECTION.\n\n' +
    'The database fix from the previous exercise, a parameterised query, does not apply here, there is no ' +
    'database and no query involved at all, so the fix takes a different shape. The strongest option is ' +
    'avoiding the shell entirely: calling the ping program directly and handing it its pieces as a clearly ' +
    'separated list, rather than as one string the shell has to read and reinterpret:\n\n' +
    '  subprocess.run(["ping", "-c", "1", hostname])\n\n' +
    'Passed this way, hostname is treated as exactly one item on that list no matter what characters it ' +
    'contains, the way handing someone a single sealed envelope keeps its contents from being read as a ' +
    'separate instruction, because no shell ever gets the chance to reinterpret it. Where a shell genuinely ' +
    'cannot be avoided, the input needs strict ALLOWLISTING: only accepting the narrow shape a real ' +
    'hostname can legitimately take (letters, digits, dots) rather than trying to list every dangerous ' +
    'character and reject those, called a blocklist, because a blocklist only ever covers the characters ' +
    'somebody happened to remember when writing it.',
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
      'If you can fill in the sentence "the database could not tell X from Y" about a piece of code, you ' +
      'have found an injection flaw, whatever programming language or database it happens to be written ' +
      'in. Keep that sentence in your head as a test to run over any code that builds a query out of a ' +
      'value someone typed.',
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
      'This exact pattern repeats across every tool that reads text as instructions: a database language, ' +
      'a shell, and others you will meet later in this field. Find a place where a user-typed value and a ' +
      'set of real instructions travel down the same string, and you have found this bug class before you ' +
      'have even bothered to name it.',
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
        'Imagine trying to childproof a house by just moving the one sharp knife a toddler grabbed last ' +
        'week to a higher shelf. That fixes the exact incident that already happened, but it does nothing ' +
        'about the other knives in the drawer, or the outlet across the room, because it never addressed ' +
        'the real underlying problem, which is that anything dangerous is within reach at all.\n\n' +
        'Several proposed fixes for injection have the same flavor, patching one incident rather than the ' +
        'underlying problem. ESCAPING means adding a special marker character in front of anything that ' +
        'could be misread as an instruction, such as a quote mark, before gluing a value into a query. It ' +
        'reduces exposure to the specific characters somebody remembered to escape, but a database with ' +
        'different rules, a different way of encoding text, or a second spot in the code the developer ' +
        'simply forgot about, is still wide open. An ORM (object-relational mapper) is a tool that lets a ' +
        'programmer talk to a database using ordinary code instead of writing query text directly, and its ' +
        'everyday, default way of doing that is genuinely safe, because underneath it already keeps ' +
        'instructions and data on separate channels. But almost every ORM also offers an escape hatch, a ' +
        'raw or literal query method, for the rare thing its ordinary method cannot express, and building ' +
        'that raw query by gluing text together is exactly the original bug, just wearing a different ' +
        'tool.\n\n' +
        'A STORED PROCEDURE, a saved set of database instructions that can be called by name instead of ' +
        'sent as text each time, is not automatically safe either: it is only safe if the procedure itself ' +
        'was written using placeholders internally, rather than building a fresh instruction string out of ' +
        'its own inputs. What actually closes the hole, in every one of these cases, is the same thing ' +
        'from the previous exercise: keeping the instruction text and the values on two separate channels, ' +
        'all the way down, no matter which tool happens to be sitting on top.',
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
      'method by name. That escape hatch is where injection bugs in supposedly safe, ORM-protected ' +
      'codebases actually turn up.',
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
        'When you fill out a form on a website and it instantly says "that email address looks wrong" ' +
        'before you even click submit, that check ran on your own computer, inside your web browser, ' +
        'using a small program the website sent you. This is CLIENT-SIDE validation: "client" meaning your ' +
        'browser, the customer at the counter, as opposed to the "server", the business back office ' +
        'somewhere else that actually stores the data and makes the real decisions.\n\n' +
        'Client-side validation exists to give a fast, friendly error message so an honest user does not ' +
        'have to wait for a slow trip to the server just to be told they mistyped their email. It is not a ' +
        'security control, because nothing forces anyone to use a website through the normal browser at ' +
        'all. Think of the browser like a customer-facing storefront with a friendly greeter who checks IDs ' +
        'at the door: someone who wants to skip that greeter entirely can walk in through the loading dock ' +
        'instead. A request to a website can be built and sent directly, with ordinary, freely available ' +
        'tools, completely bypassing the web form and any checks written into it. The server that actually ' +
        'receives that request never learns a check was supposed to run first, it just gets whatever ' +
        'shows up at the loading dock.\n\n' +
        'The only validation that actually functions as a security control is SERVER-SIDE, meaning the ' +
        'check happens on the business back-office computer itself, because that is the one place an ' +
        'attacker genuinely cannot walk around. Client-side checks are still worth having, purely for the ' +
        'experience of an honest customer who fat-fingered a field, but they stop nobody determined, ' +
        'because ignoring the greeter at the front door costs an attacker absolutely nothing.',
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
      'Whenever a concern gets waved off with "the form already checks that", the next question is ' +
      'always the same: does the server, the back office, enforce it too, or does that check only exist ' +
      'in the customer-facing browser where an attacker never has to see it at all.',
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
        'Telling a mechanic "the car is broken" is technically true and completely useless. Telling them ' +
        '"the car makes a grinding noise when I brake, and it started after I drove through the flooded ' +
        'road last week" gives them something to actually act on. The same difference separates a weak ' +
        'code review comment from a strong one.\n\n' +
        'A good finding names the mechanism, not just a label. Writing "this is SQL injection" without ' +
        'explaining why leaves the programmer to either take it on faith or guess, and possibly fix the ' +
        'wrong thing. Naming the mechanism, meaning that a specific value is glued directly into a database ' +
        'instruction so the database cannot tell the code apart from the data, gives them enough to spot ' +
        'the same shape of problem themselves next time, in a completely different file.\n\n' +
        'A good finding also names the fix precisely rather than vaguely. Not "clean up the input" (which ' +
        'invites a guess at what "clean up" is even supposed to mean here) but "use a parameterised query, ' +
        'passing this value in as a separate piece of data rather than gluing it into the instruction ' +
        'text". The second version is something a programmer can act on immediately, with no follow-up ' +
        'question needed.',
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
      'This exact comment, adjusted for whatever the variable happens to be called, is one you will end ' +
      'up writing dozens of times once you are actually reviewing real code. Getting the phrasing tight ' +
      'and efficient now saves real time later.',
    practice: [],
  },
];

// --- Module asf.3: cross-site scripting and output encoding ------------------

const XSS_TYPES_TEACH = {
  concept:
    'A webpage is written mostly in HTML, plain text with markup that tells the browser what to display, ' +
    'like a headline or a box for a comment. Alongside that, a webpage can also contain a SCRIPT: a small ' +
    'program, usually written in a language called JavaScript, that the browser actually runs, able to do ' +
    'things like read what a logged-in visitor is looking at, or send their information somewhere else ' +
    'entirely.\n\n' +
    'CROSS-SITE SCRIPTING, XSS for short, happens when text an attacker controls ends up being treated as ' +
    'one of those runnable scripts inside somebody elses browser, rather than as plain text. Imagine a ' +
    'community noticeboard where anyone can pin up a note, and imagine the board is faulty: if a note ' +
    'happens to be phrased a certain way, instead of everyone just reading it, it makes everyone who walks ' +
    'past instantly do whatever it says, hand over their wallet, say something on their behalf. That is ' +
    'roughly what XSS lets happen inside a browser: a "note" that turns into a command.\n\n' +
    'There are three variants, and they differ in where the attacker text lives before it runs. STORED ' +
    'XSS is saved permanently somewhere on the server, for instance inside a comment or a profile name, ' +
    'and then served back to every single visitor who later views that page. This makes it the most ' +
    'dangerous variant: one bad note pinned to the board reaches everyone who ever walks past it, with no ' +
    'further action needed from any of them beyond looking at the page. REFLECTED XSS instead travels ' +
    'inside the web address itself, in the part after the question mark, and the server simply echoes ' +
    'that text straight back into what it sends the browser. It needs the victim to click one specific, ' +
    'crafted link, which is why it usually arrives by email or a chat message rather than by ordinary ' +
    'browsing. DOM-BASED XSS never touches the server at all: a script already running in the page reads ' +
    'something like part of the current web address and writes it back into the page carelessly, so the ' +
    'whole bug lives entirely inside the browser, in code the server never even sees, meaning a check that ' +
    'only inspects what the server sends out can miss it completely.',
} as const;

const CONTEXT_ENCODING_TEACH = {
  concept:
    'The general defence against XSS is called ENCODING (also called escaping): rewriting a piece of ' +
    'text so that any character with special meaning gets replaced by a harmless stand-in, the way a menu ' +
    'might print "and/or" as "and or" to avoid a slash being misread by an old printer. Done correctly, a ' +
    'value that came from a user always displays as the plain text it is, and never gets treated as a new ' +
    'instruction.\n\n' +
    'The catch is that encoding has to match the exact CONTEXT a value gets written into, because ' +
    'different spots on a webpage have different special characters, the same way different card games ' +
    'played with the same deck treat different cards as "wild". In the ordinary HTML BODY, the plain ' +
    'visible text of a page, the characters < and > are what open and close a tag, so encoding those stops ' +
    'a value from being read as a brand new element. But the same value, placed instead inside an HTML ' +
    'ATTRIBUTE, a labelled setting on a tag such as a quoted value inside href, is broken out of not by < ' +
    'but by a matching quote character, so this context needs quotes encoded, and HTML-body encoding alone ' +
    'does not cover it. A value written into a JAVASCRIPT STRING inside a script (a chunk of quoted text ' +
    'sitting inside a runnable program) is broken out of by a quote mark or a backslash, neither of which ' +
    'HTML encoding touches at all, so a value that is perfectly safe sitting in the plain page can still ' +
    'end that quoted string early and let the rest of it run as a real instruction. A value placed inside a ' +
    'web address needs its own, different style of encoding again, for yet another set of special ' +
    'characters.\n\n' +
    'The practical result: there is no single "make this safe" function that works everywhere on a page. A ' +
    'review has to ask exactly where a value lands, and check that whatever encoding was actually applied ' +
    'matches that specific spot, rather than a different one that merely happened to be available.',
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
      'When you first look at a new XSS report, the first question is which of these three it is, because ' +
      'it decides where the fix actually needs to go: encoding the output on the server for the first ' +
      'two, and reviewing the browser-side script itself for the third.',
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
      'This is the single most common way a real piece of software passes an automated security scan and ' +
      'still ships a vulnerability: encoding is present, it is just aimed at the wrong spot on the page.',
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
        'A webpage, once loaded, is represented in the browser memory as a structure called the DOM ' +
        '(Document Object Model), roughly a tree of every element on the page, which running scripts can ' +
        'read and change. INNERHTML is a command that says "take this string and read it as if it were ' +
        'HTML markup, then insert the result here". It has no idea where that string came from. If the ' +
        'string happens to contain something that looks like a script tag, it gets parsed and run exactly ' +
        'as if a developer had typed it there themselves on purpose.\n\n' +
        'TEXTCONTENT is a different, safer command for the same everyday job: it inserts a string as plain, ' +
        'literal text, never read as markup at all, so a name containing angle brackets shows up on screen ' +
        'looking like angle brackets rather than being treated as a new tag. Where actual HTML genuinely ' +
        'does need to be inserted, coming from a source that is not fully trusted, the right tool is a ' +
        'SANITISATION library: a pre-built tool that strips out anything dangerous, such as scripts, while ' +
        'leaving safe formatting alone, rather than a homemade filter someone wrote in an afternoon. And a ' +
        'CONTENT SECURITY POLICY, a setting a website can turn on that tells the browser which kinds of ' +
        'scripts it is even allowed to run at all, can reduce the damage a successful injection does. But ' +
        'that is a second layer of defence sitting on top, not an excuse to skip fixing the actual ' +
        'innerHTML call underneath it.',
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
      'A rule of thumb worth keeping in your head permanently: if you ever see innerHTML being fed ' +
      'anything other than a piece of text that was typed directly into the code by a developer, stop ' +
      'and check exactly where the rest of that value came from.',
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
        'A CONTENT SECURITY POLICY is a setting a website sends along with its pages that tells the ' +
        'browser, in effect, "only run scripts that come from these specific, approved places, and ignore ' +
        'anything else, even if it appears directly inside the page". A strict policy genuinely blocks ' +
        'large categories of injected script, which makes it a real, valuable control, comparable to a ' +
        'building only unlocking its doors for badges it has already issued, rather than trusting anyone ' +
        'who walks up.\n\n' +
        'But it is a NET, something that catches most things that fall, rather than a WALL, something ' +
        'nothing gets through at all. A policy that still allows certain older, less strict exceptions for ' +
        'compatibility reasons, or that trusts a wide list of outside domains, leaves gaps a specific, ' +
        'carefully aimed attack can still fit through. A policy also does nothing about the actual ' +
        'underlying bug: the vulnerable value is still being written into the page unsafely, the policy is ' +
        'only trying to stop what happens after that. And a policy can be quietly weakened later by a ' +
        'single exception added to fix some unrelated problem, reopening everything it used to block ' +
        'without anyone noticing. The real fix for an encoding bug is correct encoding. The policy sits ' +
        'alongside that as a second line of defence, not a replacement for the first.',
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
      'Recommend a Content Security Policy freely, it is genuinely worth having. Just never accept it as ' +
      'the reason an encoding problem gets marked resolved without an actual code change behind it.',
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
        'The developer is reasoning from one true fact, that HTML encoding was applied somewhere, to a ' +
        'false conclusion, that it therefore applies everywhere on the page. It is a bit like assuming that ' +
        'because your front door has a good lock, every window in the house must be locked too, just ' +
        'because they are all part of the same house.\n\n' +
        'The missing idea is that encoding rules are tied to a specific CONTEXT, the exact spot on the page ' +
        'a value ends up in. HTML-body encoding neutralises the characters that matter for breaking out of ' +
        'ordinary page text, mainly angle brackets, and does nothing at all to a quote mark or a backslash, ' +
        'which are exactly the characters that matter for breaking out of a quoted string inside a running ' +
        'script.\n\n' +
        'A good answer names the specific mismatch: this value sits inside a script quoted string, not the ' +
        'ordinary page text, so it needs its own kind of encoding meant for that spot, or better still, it ' +
        'should be handed to the script as a genuinely separate piece of data through a safe method, rather ' +
        'than glued into the script text as if it were part of the program itself.',
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
      'Keep this exercise in mind whenever a developer says a value is "already encoded". Encoded for ' +
      'which exact spot on the page, and against which characters, is always the next question worth ' +
      'asking.',
    practice: [],
  },
];

// --- Module asf.4: authentication and session flaws --------------------------

const BROKEN_AUTH_TEACH = {
  concept:
    'AUTHENTICATION is the general term for proving who you are before a system lets you in, most ' +
    'commonly with a username and a password. It is where an attacker gets the most value for the least ' +
    'effort, because one working password often unlocks everything a legitimate user could reach, the ' +
    'same way one working house key opens the front door regardless of which specific room somebody ' +
    'wanted to get into. A handful of specific patterns keep showing up around login pages, and they are ' +
    'worth knowing by name.\n\n' +
    'CREDENTIAL STUFFING means taking a list of real username and password pairs that leaked from some ' +
    'other, unrelated website that already got broken into, and trying that exact same list against a ' +
    'different website, betting that people reuse the same password in more than one place. They do, ' +
    'constantly, at huge scale. This is not defeated by demanding a more complicated password, because the ' +
    'attacker already has a real, working password, it is defeated by RATE LIMITING (slowing down or ' +
    'blocking repeated attempts), MULTI-FACTOR AUTHENTICATION (requiring a second proof of identity beyond ' +
    'just the password, like a code sent to a phone), and checking new signups or logins against lists of ' +
    'passwords already known to have leaked.\n\n' +
    'A LOCKOUT is a rule that locks an account after too many wrong password attempts in a row. A missing ' +
    'or overly generous lockout lets an attacker try thousands of guesses against one account with no ' +
    'consequence. But a lockout that is too aggressive becomes its own weapon: an attacker who does not ' +
    'even want in can lock a real, legitimate user out of their own account on purpose, just by ' +
    'deliberately failing the login enough times, which is itself a kind of attack called denial of ' +
    'service. And a login page that gives a different error message for "wrong password" versus "no such ' +
    'account exists" quietly tells an attacker which usernames are even real, which sounds minor until you ' +
    'realize it turns a blind guessing attack into a targeted one aimed at accounts that are confirmed to ' +
    'exist.',
} as const;

const SESSION_TEACH = {
  concept:
    'Logging in once, then staying logged in as you click around a website, works because the website ' +
    'hands your browser a SESSION TOKEN right after you log in, a long, random string that acts like a ' +
    'coat-check ticket. Every later request your browser makes includes that ticket, and the server ' +
    'checks it instead of asking you to type your password again on every single page. Whoever holds a ' +
    'valid ticket is treated as that logged-in person, so how that ticket gets handed out and looked ' +
    'after matters as much as the login form itself.\n\n' +
    'SESSION FIXATION is an attack where the attacker plants a specific ticket on the victim before they ' +
    'even log in, often by sending them a link that already has one baked in, then simply uses that exact ' +
    'same ticket themselves once the victim logs in, because the website never bothered handing out a ' +
    'fresh ticket at the moment of login. It is like sneaking your own coat-check number onto someone ' +
    'else coat before they hand it to the attendant, then presenting that same number yourself later to ' +
    'claim it. The fix is simple and absolute: hand out a brand new ticket at the exact moment somebody ' +
    'logs in, every single time, so any ticket an attacker planted beforehand becomes worthless the ' +
    'instant a real login happens.\n\n' +
    'Session tokens need the same careful handling as a password: unpredictable enough that nobody can ' +
    'simply guess one, thrown away the moment somebody logs out, and set to expire on its own after a ' +
    'while of inactivity, because a ticket that works forever is really just a password that can never be ' +
    'changed.',
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
      'When a breach report uses the words "credential stuffing", the fix conversation should go ' +
      'straight to slowing down repeated attempts and requiring a second proof of identity, not to making ' +
      'people choose more complicated passwords.',
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
      'Check for this specifically whenever you review a login flow: find every place the session ' +
      'ticket gets set, and confirm a fresh one is handed out again, right at the exact moment a login ' +
      'actually succeeds.',
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
        'A password reset flow, the "forgot your password" link, is really a second, informal way to log ' +
        'in, and it deserves exactly as much scrutiny as the main login form, because it is very often ' +
        'built later, reviewed less carefully, and thought of as a small convenience feature rather than ' +
        'as another door into the account.\n\n' +
        'A short numeric code is only as strong as the number of GUESSES an attacker actually gets before ' +
        'it stops working. A six-digit code has a million possible values, which sounds like a lot, but if ' +
        'nothing on the server slows down or limits repeated guesses, a computer can work through a ' +
        'practical fraction of a million guesses quickly. A code, or a reset link containing one, that ' +
        'never EXPIRES stays usable long after the person has forgotten they even requested it, including ' +
        'inside an old email an attacker might dig up much later. The reset flow can also leak whether a ' +
        'given email address even has an account at all, through a different response for "email sent" ' +
        'versus "no account found", the exact same problem as the login form giving away which usernames ' +
        'are real. And the final step, actually setting the new password, needs to throw away every ' +
        'existing session ticket for that account, or an attacker who already had one keeps using it, even ' +
        'after the real owner thinks they have just secured the account.',
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
      'Password reset flows are one of the most productive places to spend your review time, because ' +
      'they get built as an afterthought far more often than the main login form does.',
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
        'When your browser talks to a website, the data travels across a network, through other people ' +
        'computers and routers along the way, the way a letter passes through several sorting facilities ' +
        'before reaching its destination. HTTPS is what seals that letter in a locked, tamper-evident ' +
        'envelope for the whole trip: it stops anyone sitting along that path from reading what is inside, ' +
        'and it stops them from secretly altering it in transit. That padlock icon in a browser address ' +
        'bar means this particular envelope is sealed. This protection is real, necessary, and there is no ' +
        'good reason to ever send a password without it.\n\n' +
        'What HTTPS says absolutely nothing about is what happens once the sealed envelope is opened at ' +
        'its destination. Session fixation, a missing lockout, a reset code that never expires, a reset ' +
        'flow that forgets to throw away old session tickets, none of those are problems with the envelope ' +
        'or the trip it took. They are problems with what the recipient does after opening it, and sealing ' +
        'the envelope more tightly changes nothing about that. HTTPS also does nothing to protect against a ' +
        'user own computer being compromised, or against being tricked into typing a password into a fake ' +
        'site that also happens to have a perfectly valid, sealed envelope of its own: the padlock icon ' +
        'only confirms the trip to that particular site is private, not that the site on the other end, or ' +
        'what it does with what arrives, deserves to be trusted.',
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
      '"It is over HTTPS" answers exactly one question in a review, whether the trip across the network ' +
      'is sealed. Have the next four questions ready anyway, because that one answer tends to get offered ' +
      'up as if it had answered all of them.',
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
        'A precise answer separates two different guarantees, rather than treating "is it secure" as one ' +
        'single yes-or-no question. HTTPS guarantees the trip across the network: nobody along the way can ' +
        'read or secretly alter the request while it travels. It says nothing at all about the actual ' +
        'decision-making logic running on the website itself once that request arrives, which is exactly ' +
        'where session fixation, a forgotten session invalidation, or a reset code that never expires ' +
        'actually live.\n\n' +
        'The strongest version of the answer picks one concrete flaw and shows that sealing the network ' +
        'trip does not touch it at all. A fixed session ticket is exactly as reusable by an attacker ' +
        'whether the traffic carrying it was sealed or not, because the actual problem is which ticket the ' +
        'server chooses to trust, not who might have peeked at it in transit.',
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
      'Every authentication review you ever do will eventually run into this sentence in some form. ' +
      'Having the precise, three-part answer ready beats a vague gut feeling that the sentence is wrong.',
    practice: [],
  },
];

// --- Module asf.5: access control flaws --------------------------------------

const AUTHZ_TEACH = {
  concept:
    'Think about a hotel. Checking a guest ID at the front desk answers one question: are you actually a ' +
    'guest of this hotel. That is AUTHENTICATION, proving who somebody is. It is a completely different ' +
    'question from asking: does this particular guest key open this particular room. That second ' +
    'question, what a specific, already-identified person is allowed to actually do or reach, is called ' +
    'AUTHORISATION.\n\n' +
    'A hotel can get the ID check at the front desk perfectly right and still fail badly if every ' +
    'guest key happens to open every room in the building. A system can do the exact same thing: it can ' +
    'be excellent at confirming somebody is a real, logged-in user, and then hand over whatever that user ' +
    'asks for without ever checking whether it was actually theirs to see.\n\n' +
    'That gap has a name, BROKEN ACCESS CONTROL, and it shows up constantly in real software, precisely ' +
    'because it is invisible to anything that only checks whether the login itself works. A login page can ' +
    'be flawless, a second proof of identity can be required on every visit, and the application can still ' +
    'let any logged-in user read or change any other user data, because "who are you" and "what are you ' +
    'allowed to touch" are two separate questions, and only one of them ever got asked.',
} as const;

const IDOR_TEACH = {
  concept:
    'An ENDPOINT is a specific web address a program listens on to handle one kind of request, like a ' +
    'specific desk at a government office that only handles one form. Every record stored in a database, ' +
    'such as an invoice, is usually given an ID, a unique number or code so it can be looked up again ' +
    'later.\n\n' +
    'INSECURE DIRECT OBJECT REFERENCE, usually shortened to IDOR, is what broken access control looks ' +
    'like once you actually read the code. It is an endpoint that takes an ID straight out of the request ' +
    'a visitor sent, and uses it to fetch a record, with nobody ever checking whether that record actually ' +
    'belongs to the person asking for it:\n\n' +
    '  app.get("/invoices/:id", (req, res) => {\n' +
    '    const invoice = db.getInvoice(req.params.id);\n' +
    '    res.json(invoice);\n' +
    '  });\n\n' +
    'This is like a coat-check clerk who hands you whatever coat matches whatever number you show them, ' +
    'without ever checking that it was your coat to begin with. Any logged-in user here can simply change ' +
    'the id in the web address and read anyone invoice in the whole system, because nothing checks whose ' +
    'invoice it actually is. In API-focused terminology this same gap is sometimes called BOLA, broken ' +
    'object-level authorisation, but it is the identical problem under a different name. The fix is an ' +
    'OWNERSHIP CHECK: compare the record actual owner against the identity of whoever is currently logged ' +
    'in, taken from the server own record of who that is (the session), never from anything the visitor ' +
    'browser itself claims:\n\n' +
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
      'Whenever a report sounds like "any user can see any other user data", assume it is an ' +
      'authorisation gap before you even open the code, and go straight to looking for the missing ' +
      'ownership check.',
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
      'This exact shape of code, fetch a record by an id, return it, no ownership check, is the single ' +
      'most common finding in this entire field. Learning to spot it on sight is worth more than any ' +
      'other pattern in this package.',
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
        'Broken access control splits into two shapes, and picturing an office building helps tell them ' +
        'apart. HORIZONTAL is the IDOR shape from the previous exercise: two employees at the exact same ' +
        'rank, and one of them wanders into a coworker desk drawer and reads their private files. Nobody ' +
        'gained extra power here, one person at a given level just reached something belonging to another ' +
        'person at that same level. The check needed is an ownership comparison, exactly like the invoice ' +
        'example.\n\n' +
        'VERTICAL is a different failure entirely: a regular employee walks into the manager-only office ' +
        'and uses the manager equipment, regardless of whose specific files are involved. The problem is ' +
        'not "whose desk is this", it is "this floor was never meant for you at all". The check needed here ' +
        'is a ROLE check on the action itself (does this specific account actually hold the "admin" role), ' +
        'verified by the server on every single request, never just assumed because the admin door happens ' +
        'to be hidden from that user in the interface they see. The two findings in this scenario need two ' +
        'different fixes: an ownership check for the first, and a server-side role check on the delete ' +
        'endpoint for the second, and fixing one does absolutely nothing for the other.',
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
      'When a report lumps "access control issues" together into one bucket with one recommended fix, ' +
      'split it into horizontal and vertical yourself before accepting the plan to fix it.',
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
        'Removing the "employees only" sign from a door does not lock the door. It just means fewer ' +
        'honest people notice it before walking through. Hiding a link or a button in a website interface ' +
        'works the same way: it changes what an ordinary, well-behaved user happens to see, and changes ' +
        'absolutely nothing about what the server will actually accept if that same request is made ' +
        'directly, by typing the address in by hand, reusing an old bookmark, or using any of the ' +
        'ordinary, freely available tools that send a web request without ever touching the visible page ' +
        'at all. This approach is called SECURITY THROUGH OBSCURITY, relying on something being hidden ' +
        'rather than actually locked, and it fails the moment anyone looks past the interface, which takes ' +
        'no special skill whatsoever.\n\n' +
        'The same mistake shows up in subtler forms too: relying on an ID being hard to guess, as in the ' +
        'earlier invoice exercise, or relying on a setting in the browser-side code that the server itself ' +
        'never double-checks. In every version, the real authorisation decision has to actually be made by ' +
        'the server, on every single request, because that is the one point neither the interface nor the ' +
        'visitor own browser can ever be trusted to enforce honestly.',
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
      'A useful habit to build: whenever a fix for an access control problem is proposed, ask exactly ' +
      'what the server itself does differently now, not what the visible interface looks like ' +
      'differently. If the honest answer is only the interface changed, the problem is still wide open.',
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
        'A precise fix description names both sides of a comparison, not just the vague fact that a check ' +
        'is missing, the same way "check the coat number against the ticket number" is a real instruction ' +
        'and "be more careful with the coats" is not. One side of this comparison is the record actual ' +
        'owner, read straight out of the database alongside the document itself. The other side is the ' +
        'identity of whoever is currently making the request, and it has to come from the server own ' +
        'record of who is logged in (the session), never from any field the visitor own browser handed ' +
        'over in the request, because a value supplied by the visitor can simply be changed to anything an ' +
        'attacker wants.\n\n' +
        'A vague answer just says "add an authorisation check". A precise one says: compare doc.ownerId, ' +
        'read from the database, against req.session.userId, taken from the server own record of who is ' +
        'logged in, and reject the request outright if the two do not match. That level of precision is ' +
        'what turns a finding into something someone can actually fix, rather than something they have to ' +
        'guess at.',
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
      'writing it this precisely, naming both sides of the comparison every time, until it becomes ' +
      'automatic.',
    practice: [],
  },
];

// --- Module asf.6: deserialisation, SSRF, and supply chain -------------------

const DESERIALISATION_TEACH = {
  concept:
    'While a program is running, the information it is working with lives in memory as OBJECTS: ' +
    'structured chunks of data, roughly like a filled-out form with several fields. To save that ' +
    'information to disk, or send it to another computer, the program needs to flatten it into a plain ' +
    'sequence of bytes first, a process called SERIALISATION, like folding a piece of furniture flat to ' +
    'ship it. DESERIALISATION is the reverse: taking that flattened sequence of bytes and rebuilding it ' +
    'back into a real, usable object again, unfolding the furniture back into its full shape.\n\n' +
    'The danger appears when those bytes come from somewhere the program cannot fully trust, because ' +
    'several common ways of doing this let the byte stream specify not just the data inside the object, ' +
    'but which exact kind of object, its CLASS, to build in the first place, and how to build it. An ' +
    'attacker who controls that byte stream can name a completely different kind of object than the ' +
    'application ever meant to build from outside data.\n\n' +
    'Chained together, several ordinary, harmless-looking classes that are already sitting on the system ' +
    'can be made to perform something unintended, purely as a side effect of being constructed and ' +
    'combined in a particular order, a GADGET CHAIN. In the worst cases this lets an attacker run their ' +
    'own commands on the server, without ever uploading anything that looks like a program at all. The ' +
    'general rule: never rebuild an object straight from untrustworthy bytes using a method that lets the ' +
    'byte stream choose which class to build. Where data genuinely has to cross that boundary, use a ' +
    'restrictive format instead, such as JSON, plain structured text with a fixed, checked shape, which ' +
    'has no built-in notion of "go build this particular class" at all.',
} as const;

const SSRF_TEACH = {
  concept:
    'A SERVER is simply the computer, somewhere else, that runs a website or an application and answers ' +
    'requests from users. Many features need the server itself to go fetch something from a web address, ' +
    'for example downloading a profile picture from a link a user pasted in.\n\n' +
    'SERVER-SIDE REQUEST FORGERY, SSRF for short, happens when an application lets a user supply that web ' +
    'address, or a piece of one, and then has the server itself make a request to it. The danger is not ' +
    'the one request the developer had in mind, like fetching a picture. It is every OTHER request the ' +
    'server is technically capable of making that the developer never thought about.\n\n' +
    'A server usually sits inside a private network that has reach an outsider does not have from their ' +
    'own computer, the way an employee badge opens doors inside a building that a visitor standing on the ' +
    'sidewalk cannot even see. That includes internal admin control panels that were never given their own ' +
    'password because nobody expected them to be reachable from outside at all, other internal-only tools, ' +
    'and, on cloud computing platforms, a special internal address that many providers expose only to the ' +
    'server itself, which can hand back genuine credentials the running application uses. An attacker who ' +
    'can make the server fetch a web address of their own choosing can point it at any of these, using the ' +
    'server own position inside that private network as a proxy into places the attacker could never have ' +
    'walked into directly. The fix combines an ALLOWLIST, a fixed list of destinations the feature ' +
    'genuinely needs and nothing else, blocking requests aimed at internal network addresses, and refusing ' +
    'to blindly follow a redirect to some other destination that was never itself checked.',
} as const;

const SUPPLY_CHAIN_TEACH = {
  concept:
    'Almost nobody builds furniture entirely from raw lumber they cut themselves. They buy pre-made ' +
    'screws, hinges, and drawer slides from other manufacturers, who in turn bought their raw materials ' +
    'from somewhere else again. If one of those hinge manufacturers, three suppliers back, starts using a ' +
    'cheap metal that snaps, every piece of furniture built with that hinge inherits the flaw, whether the ' +
    'furniture maker ever personally inspected that hinge or not.\n\n' +
    'Software works the same way. Almost no application is written entirely by the team that ships it. It ' +
    'is built out of PACKAGES, pre-written pieces of code other people published for anyone to reuse, and ' +
    'those packages depend on further packages of their own. A security weakness, or a deliberately ' +
    'malicious change, anywhere in that whole chain of borrowed code becomes part of the final application ' +
    'the moment it gets installed, whether anyone on the team ever actually read that particular piece of ' +
    'borrowed code or not.\n\n' +
    'TYPOSQUATTING is publishing a malicious package under a name that is one typo away from a genuinely ' +
    'popular one, betting that somebody will mistype the name when installing it. A MAINTAINER TAKEOVER is ' +
    'an attacker gaining control of a real, already widely-used package, whether by breaking into the ' +
    'original author account or by the original author handing off ownership to someone without checking ' +
    'who they really were, and then shipping a malicious update to everyone who already, legitimately, ' +
    'depends on it. This is more dangerous than typosquatting because it reaches people who did absolutely ' +
    'nothing wrong. A LOCKFILE is a file that pins the exact version of every package in use, so a routine ' +
    'install cannot silently pull in a newly compromised update without anyone noticing. A SOFTWARE BILL ' +
    'OF MATERIALS, an SBOM, is a complete inventory listing exactly what pieces of borrowed code went into ' +
    'a given build, the way a food label lists every ingredient, which is what makes it possible to answer ' +
    '"are we affected" quickly when one of those ingredients is announced as contaminated, instead of ' +
    'having to reconstruct the entire ingredient list from scratch under pressure.',
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
      'If a report puts the words "deserialise" and "untrusted" in the same sentence, treat it as high ' +
      'severity by default. This particular bug class has repeatedly let attackers run their own commands ' +
      'on real, live systems, across many different programming languages.',
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
      'Any feature where the server itself fetches a web address a user typed in deserves the same close ' +
      'look as this one, no matter how small or purely cosmetic the feature seems on the surface.',
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
      'Dependency risk is not something you solve once by picking better packages. It is an ongoing ' +
      'process: lockfiles, regular scanning, and an ingredient list you can actually check on the exact ' +
      'day some borrowed piece of code is announced as compromised.',
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
        'A fire extinguisher, a smoke detector, and a first-aid kit all belong on a kitchen wall, and all ' +
        'three matter, but each one addresses a completely different kind of emergency. Reaching for the ' +
        'fire extinguisher when someone has cut their finger helps nobody.\n\n' +
        'Each of the three risks in this module has a mitigation shaped around its own specific mechanism, ' +
        'and mixing them up produces advice that sounds reasonable while protecting nothing. Deserialising ' +
        'untrusted data safely means avoiding formats that let the incoming bytes choose which class to ' +
        'build, using a restrictive, checked format such as JSON instead. SSRF is closed by a fixed list of ' +
        'legitimate destinations, blocking requests aimed at internal network addresses, and refusing to ' +
        'blindly follow redirects. Supply chain risk is managed by pinning exact dependency versions, ' +
        'scanning regularly for known weaknesses, and keeping an ingredient list current enough to answer ' +
        'a disclosure quickly.\n\n' +
        'None of these three mitigations substitutes for either of the others, because the three risks do ' +
        'not share a mechanism at all: one is about what a stream of bytes is allowed to build, one is ' +
        'about where a server is allowed to send a request, and one is about what borrowed code ends up in ' +
        'the finished build in the first place.',
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
      'When a plan proposes one single tool to cover several unrelated findings, check exactly what each ' +
      'finding involves against what that tool actually looks at, before accepting the plan.',
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
        'A good SSRF finding names exactly what the server would be tricked into reaching, not just the ' +
        'general fact that a web address came from a user. Here, whatever address req.body.url contains is ' +
        'somewhere the server will later make a real request to, using the server own position inside its ' +
        'private network, with nothing at all restricting what that address is allowed to be.\n\n' +
        'A good fix names a concrete control rather than a vague instruction to "validate the URL". Block ' +
        'requests aimed at internal network addresses. Look up where the address actually points before ' +
        'trusting it, rather than trusting the typed text alone, since an ordinary-looking hostname can ' +
        'resolve to an internal address behind the scenes. And either keep a fixed list of destinations the ' +
        'feature genuinely needs, or explicitly refuse to follow a redirect to some other address that was ' +
        'never itself checked.',
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
      'Webhook registration endpoints (features that ask a user for a web address the server should call ' +
      'later) are one of the most common places SSRF findings turn up in real products, precisely because ' +
      'the feature genuinely needs the server to fetch a user-chosen address.',
    practice: [],
  },
];

// --- Module asf.7: secure code review methodology -----------------------------

const REVIEW_METHOD_TEACH = {
  concept:
    'A DIFF is the set of changes somebody made to a piece of code, shown as lines removed and lines ' +
    'added, so a reviewer can see exactly what changed without rereading the entire file. Reading a large ' +
    'diff top to bottom, line by line, in whatever order it happens to appear in, is a bit like proofing a ' +
    'whole novel one word at a time without ever skimming the table of contents first: slow, exhausting, ' +
    'and the important twist near the end gets the tired, distracted read instead of the careful one.\n\n' +
    'An efficient review reads a diff for SHAPE first: what changed at a big-picture level, which files ' +
    'touch logins, stored data, or anything coming in from outside the program, and which changes are ' +
    'purely mechanical, a rename, a formatting cleanup, a version number bump, that can be skimmed rather ' +
    'than studied word by word.\n\n' +
    'From there, review works outward from TRUST BOUNDARIES: every place a value arrives from outside the ' +
    'code itself, something typed into a form, an uploaded file, a message from another system, a reply ' +
    'from an outside service, and traces what happens to it from there. Automated tools that scan code for ' +
    'known-dangerous patterns earn their keep here by pre-filtering the mechanical stuff, so a human ' +
    'reviewer attention goes toward the judgement calls a tool genuinely cannot make on its own, such as ' +
    'whether this particular permission check actually makes sense for this particular feature.',
} as const;

const PRIORITY_UNDER_PRESSURE_TEACH = {
  concept:
    'A paramedic arriving at an accident scene with several injured people does not treat them in the ' +
    'order they happen to be standing in. They check who is bleeding out first and who has a scraped knee ' +
    'last, because the order of attention is itself a life-or-death decision, not just a formality. A code ' +
    'review under a real deadline needs the same discipline: not everything in a diff gets equal ' +
    'attention, and knowing what order to work in is most of the actual skill.\n\n' +
    'Highest priority: any change to login or permission-checking logic, because a mistake there tends to ' +
    'be broad, affecting everyone, and silent, giving no obvious symptom that anything is wrong. Next: any ' +
    'new place that accepts information from outside the program, a new web address the server responds ' +
    'to, a new file upload feature, a new connection to an outside service, because that is exactly where ' +
    'the injection and SSRF bugs from earlier modules tend to live. Next: anything touching passwords, ' +
    'secret keys, or encryption, a key typed directly into the code, a security check quietly disabled for ' +
    'a test and never turned back on. Lowest priority, not because it never matters but because it rarely ' +
    'costs much to fix later: naming, formatting, and other preferences that do not change what the code ' +
    'actually does.\n\n' +
    'A reviewer working against a clock who spends the first ten minutes on formatting has already lost ' +
    'the review, no matter what they manage to find in whatever time is left.',
} as const;

const FINDING_VS_NITPICK_TEACH = {
  concept:
    'Imagine a restaurant health inspector report. "There is no thermometer in the fridge, so nobody can ' +
    'tell whether food is being kept at a safe temperature, and that risks food poisoning" is a real ' +
    'finding: something concrete is wrong, something bad follows from it, and there is a clear reason it ' +
    'should not be that way. "I would have hung the calendar on the other wall" is not that. It is a ' +
    'preference.\n\n' +
    'In a code review, a FINDING has those same three properties: a concrete way the problem can actually ' +
    'be triggered, a real consequence if it is, and a reason it was never supposed to be possible in the ' +
    'first place. "An attacker who controls this field can read another user data, because there is no ' +
    'ownership check" is a finding, however politely or bluntly it happens to be phrased.\n\n' +
    'A NITPICK is a preference: a naming choice, a different but equally valid way of writing the same ' +
    'thing, a style the reviewer personally would have picked differently. Both kinds of comments are ' +
    'worth raising, but mixing them together without distinction wastes a programmer time and buries the ' +
    'comments that actually matter, because a list of comments where every third one is a naming ' +
    'preference trains the reader to skim the whole list, including the one comment they genuinely needed ' +
    'to stop and read carefully. Labelling comments explicitly, saying outright "this is a finding" versus ' +
    '"this is just a preference", costs nothing to write and fixes the whole problem directly.',
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
      'This is a skill you can practise on purpose: before reading a single line of a real diff, spend ' +
      'thirty seconds sorting every changed file into what kind of change it actually is.',
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
      'A twenty-minute review that covers the login change and the upload feature thoroughly, and skips ' +
      'the variable renaming entirely, is a genuinely better review than one that skims all four equally ' +
      'and truly studies none of them.',
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
      'Adopt the habit of labelling your own comments this way from the start. It costs one extra word ' +
      'and it is the single cheapest thing you can do to make a whole list of review comments easier to ' +
      'sort through.',
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
        'A smoke alarm that only goes off when there is an actual fire is useful. A smoke alarm that goes ' +
        'off every time somebody makes toast eventually gets its battery pulled out, and then it fails to ' +
        'warn anyone the one time there really is a fire. Crying wolf too often has a real cost, even when ' +
        'every individual warning was technically true.\n\n' +
        'A finding that names an exploitable path is actionable: it says exactly how the problem gets ' +
        'triggered and what happens as a result. A finding that instead flags every single place a risky ' +
        'pattern of code happens to appear, whether or not it is actually reachable by an attacker, ' +
        'produces volume without any actual sorting done, and a programmer facing forty flagged lines, most ' +
        'of which turn out to already be protected by an earlier check elsewhere, learns to ignore the ' +
        'whole list rather than work through it.\n\n' +
        'A good write-up does the sorting the reader would otherwise have to redo themselves: it tells ' +
        'apart a spot genuinely reachable by untrusted input from a spot already covered by an earlier ' +
        'check, and says so explicitly, rather than flagging both identically. This is not about lowering ' +
        'the bar for what counts as worth reporting, it is about reporting what is actually true of each ' +
        'individual case rather than slapping one label on all of them at once.',
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
      'A shorter list of sorted, genuinely exploitable findings gets fixed faster than a longer list of ' +
      'theoretical ones, simply because the programmer reading it can actually tell where to start.',
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
        'A doctor calling in a diagnosis over a crackly radio during an emergency does not stop being ' +
        'rigorous just because there is no time for a full explanation. They still say what is wrong, what ' +
        'it means, and what to do about it, just as few words as the situation allows. A finding written ' +
        'under real time pressure needs that same discipline: it still needs its three parts, the trigger, ' +
        'the consequence, and the fix. What changes under time pressure is not how careful the thinking is, ' +
        'it is the length: the exact same three ideas, said as compactly as possible, because a reviewer ' +
        'with four minutes left has no time to write a paragraph of preamble, and the programmer reading it ' +
        'has no time to wade through one either.\n\n' +
        'A strong, compressed comment states the trigger in one sentence, the consequence in one sentence, ' +
        'and the fix in one sentence, in that order, with nothing else added. That is the exact same ' +
        'finding as the fuller write-up from earlier in this package, deliberately made shorter rather than ' +
        'deliberately made weaker.',
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
      'Compressing a finding under pressure without losing its substance is the actual skill this module ' +
      'has been building toward. A finding is no less rigorous for being three sentences instead of a ' +
      'paragraph.',
    practice: [],
  },
];

// --- Module asf.8: threat modelling and working with developers --------------

const STRIDE_TEACH = {
  concept:
    'Before ground is ever broken on a new building, an architect sometimes walks the plans with a fixed ' +
    'checklist of dangers: could a fire spread through this stairwell too fast, could this wall collapse ' +
    'under snow load, could a flood reach the electrical room. Not because a fire or a flood is guaranteed ' +
    'to happen, but because deliberately asking each question on paper, when it costs nothing but time, is ' +
    'far cheaper than discovering the answer once the building is standing.\n\n' +
    'THREAT MODELLING is the same habit applied to software: sitting down with a design, often just a ' +
    'sketch on a whiteboard, before any code is written, and deliberately asking what could go wrong with ' +
    'it. STRIDE is a specific checklist for doing that, one letter at a time. SPOOFING: could something ' +
    'successfully pretend to be a different user, or a different system, than it actually is? TAMPERING: ' +
    'could data be changed somewhere it should not be, while travelling between two points or while sitting ' +
    'in storage? REPUDIATION: could someone later deny having done something, because no record of it was ' +
    'ever kept? INFORMATION DISCLOSURE: could data reach somebody who was never supposed to see it? DENIAL ' +
    'OF SERVICE: could the system, or some part of it, be made unavailable to the people who legitimately ' +
    'need it? ELEVATION OF PRIVILEGE: could someone end up with more access than they were ever actually ' +
    'granted?\n\n' +
    'STRIDE is not a formula that spits out a guaranteed, complete list of problems just from looking at a ' +
    'diagram. It is a set of prompts to walk through against each piece of a design, catching questions a ' +
    'team would otherwise only stumble onto by accident. Not every letter applies to every design with ' +
    'equal force, and that is expected. The value is in deliberately asking all six, every time, rather ' +
    'than only the ones that happen to occur naturally to whoever is in the room that day.',
} as const;

const DEPT_OF_NO_TEACH = {
  concept:
    'Imagine a friend who, every single time you suggest a plan, just says "no, bad idea" and nothing ' +
    'else, never explaining why or offering an alternative. Eventually you stop telling them your plans at ' +
    'all, and start making decisions behind their back instead, which leaves them with even less influence ' +
    'over the outcome than if they had engaged in the first place. A finding that only ever says no, ' +
    'without naming any path forward, does the exact same thing to a development team: it teaches them to ' +
    'route around security instead of through it, which ends up worse than the original problem shipping, ' +
    'because it costs the relationship too.\n\n' +
    'Delivering a finding well means being specific about the actual risk, honest about how severe it ' +
    'really is instead of exaggerating it for effect, and, wherever possible, offering an alternative that ' +
    'gets the team most of what they wanted with the risk removed or at least reduced.\n\n' +
    'Sometimes a release genuinely does have to wait, and saying so plainly, with the specific reason ' +
    'attached, is not being obstructive, it is doing the job properly. What actually earns a security ' +
    'reviewer the reputation of being "the department of no" is blocking by reflex, treating every finding ' +
    'as equally severe regardless of what it actually is, or never once proposing a way forward, so that ' +
    'every conversation with that person feels like hitting a wall rather than talking to a colleague with ' +
    'a different, legitimate set of concerns than the release date.',
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
      'In a real session, walk through the design piece by piece and ask all six STRIDE letters against ' +
      'each one, even the parts that feel obviously fine at a glance. The value is in the discipline of ' +
      'actually asking, not in already knowing the answer you expect to get.',
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
        'A smoke detector does not only get installed in mansions with a dozen rooms. A small studio ' +
        'apartment still has wiring, still has a stove, still has a real fire risk, just a smaller one, and ' +
        'skipping the detector because the space is small is exactly backwards, because a small space with ' +
        'no detector at all is more dangerous than a huge one that at least has some protection.\n\n' +
        'A small software design, decided in a thirty-minute conversation, still has places where outside ' +
        'data comes in, and a five-minute run through the STRIDE checklist against a rough whiteboard ' +
        'sketch costs almost nothing compared to finding the same gap after the feature has already shipped ' +
        'to real users. Waiting for one big, formal, annual review session means most designs never get ' +
        'checked at all, because most actual design decisions happen in ordinary day-to-day planning ' +
        'meetings, not inside a scheduled once-a-year event.\n\n' +
        'A quick, lightweight pass done every single time a new feature is designed, even a small one, ' +
        'catches far more in practice than a rare, heavyweight review reserved only for the biggest ' +
        'systems, because the biggest systems are usually the ones already getting other scrutiny anyway, ' +
        'while the small, everyday feature slips through completely unreviewed by anyone at all.',
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
      'minute version you can run in the middle of any ordinary planning meeting, without anyone having ' +
      'to schedule a thing.',
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
      'leads to a real decision, not an automatic no. That reputation is worth protecting on purpose.',
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
        'A building inspector who only ever reads the blueprints, and never talks to the contractor who is ' +
        'actually pouring the concrete, misses things: which wall was already quietly changed on site last ' +
        'week, which measurement on the drawing does not match reality, which shortcut got taken because a ' +
        'delivery was late. The people doing the actual work know details an outside reviewer working alone ' +
        'will never see.\n\n' +
        'The programmers who designed a piece of software know exactly the same kind of thing: which ' +
        'assumption the whole design secretly rests on, which part is likely to be rebuilt again next ' +
        'quarter anyway, and which trust boundary looks solid on the diagram but is not actually enforced ' +
        'anywhere in the real code yet. Running the STRIDE session together with them, asking the questions ' +
        'as a group rather than handing them a finished list afterward, surfaces those details while the ' +
        'design is still cheap and easy to change.\n\n' +
        'It also builds a skill that outlasts that one meeting: a team that has walked through STRIDE ' +
        'together once starts noticing some of these same questions on their own, on their very next ' +
        'design, before anyone from security is even in the room, which produces better overall coverage ' +
        'than any single outside reviewer being thorough alone ever could.',
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
      'The best sign a threat modelling habit is actually working is not a growing list of findings, it ' +
      'is a team that starts raising the STRIDE questions themselves, on their own, before you even have ' +
      'to ask.',
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
        'Picture a co-pilot who notices the weather ahead looks dangerous. Simply refusing to fly protects ' +
        'nothing if the captain just overrules them and takes off anyway, having heard nothing useful. ' +
        'Quietly saying nothing and going along with it protects nothing either, and leaves the co-pilot ' +
        'holding the blame if something goes wrong, having never actually said what they saw. What ' +
        'actually helps is telling the captain plainly what the risk is, suggesting a safer alternate route ' +
        'if one exists, and making sure it is written down, out loud, who chose to fly anyway if the ' +
        'captain decides to go regardless.\n\n' +
        'A response to pressure over a real security finding needs the same three things. State the actual ' +
        'risk plainly, so whoever makes the final call is deciding based on real information rather than ' +
        'wishful thinking. Offer a narrower option if one genuinely exists, such as a smaller, partial fix ' +
        'that reduces the risk even if it cannot remove it entirely before the deadline. And make clear, ' +
        'explicitly, who is accepting what risk if the deadline holds regardless, so the decision is out in ' +
        'the open rather than quietly swallowed by whoever raised the concern.\n\n' +
        'This is not refusing to compromise. It is refusing to let the compromise happen silently, which is ' +
        'the real difference between being a genuine partner in the decision and being either an obstacle ' +
        'to it or invisible inside it.',
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
      'Notice this response never actually says no. It also never pretends the risk is not real. That ' +
      'combination is exactly what keeps you in the room for the next decision, instead of getting routed ' +
      'around for it.',
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
