# Content issues found in the source specifications

Recorded while building Phase 1 from `soc_simulator_spec.md` and
`soc_learning_packages.md`. Nothing here is a blocker; each entry says what was
found, what was done about it, and what still needs a decision.

## 1. The exercise counts are wrong

The specification states 75 exercises in one place and, by summing its own
per-package figures, 89 in another. The actual count in
`soc_learning_packages.md` is **85 across 20 modules**:

| Package | Spec says | Actually has |
|---|---|---|
| 1. Linux Fundamentals | 24 | **22** |
| 2. Log Analysis and Parsing | 14 | 14 ✓ |
| 3. Networking Basics | 15 | **12** |
| 4. Command Line Tools for Investigation | 16 | **18** |
| 5. Security Incident Concepts | 20 | **19** |
| **Total** | 75 / 89 | **85** |

**Done:** the build follows the real file. Package 1 ships with 22 exercises.

**Needs a decision:** whether to write the missing exercises to hit the round
numbers, or to correct the spec. The counts are cosmetic either way.

## 2. Exercise 1.3.2 cannot be validated as written

The exercise asks the student to open `/var/log/syslog` in `less` and press `q`.
A pager is interactive and a browser terminal has no PTY, so there is no output
to grade and the spec's own validation note says "manual verification".

**Done:** `less` prints the first page and then explains plainly that this
simulator has no interactive pager, what the real keys are (arrows, Space,
`/pattern`, `q`), and that `grep` beats scrolling for finding things. The
exercise is graded on invoking the pager, and the debrief is honest about the
limitation rather than faking it.

## 3. Exercise 2.4.2's solution cannot work against real sshd output

The solution given is:

```
grep "Failed password" /var/log/auth.log | grep -oP 'user=\K[^ ]*'
```

Real `sshd` does not put `user=` on its `Failed password` lines. That field
appears on the `pam_unix(sshd:auth): authentication failure` line instead, so the
pipeline as written returns nothing.

**Done:** the generated `auth.log` emits both lines, exactly as a real host does,
so `user=` genuinely exists in the file and `-oP` with `\K` is implemented and
tested. The **exercise text still needs correcting** when Package 2 is written:
it should grep the `authentication failure` line, not `Failed password`.

## 4. Exercise 4.2.1's validation contradicts itself

"Find the 5 largest files" with validation "shows files sorted by size, newest
first". Size and modification time are different orderings.

**Needs a decision** when Package 4 is written. Sorting by size is what the
prompt asks for.

Separately, the given solution uses `find ... -exec ls -lh {} \;`. `-exec` is not
supported by the simulator (it would mean re-entering the whole command engine
per match). `find` says so explicitly rather than ignoring the flag and printing
a wrong answer. The exercise should be rewritten to pipe instead.

## 5. Exercise 5.1.1's answer key looks reversed

The prompt asks students to match:

1. Someone stole passwords
2. A virus encrypted files
3. Someone looked at data they shouldn't have

to A) Malware, B) Data Exfiltration, C) Unauthorized Access, with the answer
given as `1-C, 2-A, 3-B`.

Item 2 → A is right. But item 3, "looked at data they shouldn't have", is the
textbook description of **unauthorized access** (C), and item 1, stealing
password data, is closer to **exfiltration** (B). The key reads as though items
1 and 3 were swapped. The spec itself hedges with "(or similar)".

**Needs a decision** when Package 5 is written. Recommend rewriting the three
items so each maps unambiguously to one category.

## 6. Package 3 network exercises target real internet hosts

Exercises ask students to `ping google.com`, `dig example.com`, and reverse-look
up `8.8.8.8`.

**Done:** the simulator answers from a frozen local resolver and never touches a
network. Public names resolve to RFC 5737 documentation addresses
(`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`), which are reserved and
cannot route anywhere real. A student who later runs the same command against
the live internet will see different numbers: the correct trade, since nothing
here should teach anyone that a lab address is a real destination.

`ping` also requires `-c` so the command terminates; an unbounded ping would
hang a browser terminal forever. It says so instead of silently capping.

## 7. Interactive `top` is not runnable

The spec's exercise 4.1.3 uses `top -bn1`, which is fine. But bare `top` would
never terminate in a web terminal.

**Done:** `top` without `-b` returns an error explaining that batch mode is
required and showing the working form.

## 8. Exercise 4.3.2 refers to a user who does not exist

The exercise searches auth logs for a user named "john". The seeded world uses a
realistic staff roster (`jmartel`, `dokafor`, `rchen`) plus the compromised
`testuser` and the attacker-created `sysmon`.

**Needs a decision** when Package 4 is written: either rename the exercise's
target to a roster name, or add a `john` account. Recommend the former, since a
generic placeholder name weakens the realism the rest of the world is built on.

## 9. Reading `/var/log/auth.log` requires group membership

On a real Ubuntu host `/var/log/auth.log` is `root:adm 0640`, so an ordinary
account cannot read it, yet the entire curriculum has students reading it
without `sudo`.

**Done:** the `student` account is a member of the `adm` group, which is exactly
how a SOC analyst is granted log access in practice rather than handing out root.
The file keeps its real permissions, `/etc/shadow` remains genuinely unreadable,
and "Permission denied" stays a lesson rather than an obstacle.

## 10. Exercise 2.3.2 searches for the wrong capitalisation

The spec's exercise 2.3.2 finds service start/stop events with
`grep -E "started|stopped" /var/log/syslog`.

Real syslog writes `Started` and `Stopping`, not `started` and `stopped`. Against
the seeded world the spec's command returns **1 line out of 4**, and because it
returns *something*, it looks like it worked.

**Done:** the exercise teaches `grep -iE "started|stopped"`, which is the actual
lesson (case-insensitivity plus alternation), and its debrief calls out the
original mistake as an example of a search that lies to you by succeeding
partially.

## 11. Exercise 2.4.2 extracts a field from lines that never contain it

The spec's exercise 2.4.2 pulls usernames out of failed logins with:

    grep "Failed password" /var/log/auth.log | grep -oP 'user=\K[^ ]*'

sshd never writes `user=` on a `Failed password` line. It writes that field on the
accompanying `pam_unix(sshd:auth): authentication failure` line. The spec's
command returns **nothing at all**.

**Done:** the exercise greps the file directly:
`grep -oP 'user=\K[^ ]*' /var/log/auth.log | sort -u`, which works and is what
the field actually does.

## 12. Two label names look like good extraction drills and are not

While writing the Package 2 practice drills, two `\K` targets had to be dropped:

- `name=` also matches inside `logname=`, which appears on all 718 pam_unix
  lines, so `grep -oP 'name=\K[^ ]*'` returns mostly empty values.
- `uid=` picks up a trailing parenthesis from session lines (`uid=1004)`), so the
  "distinct values" answer is polluted with `0)` and `1500)`.

Both would have marked a correct student command as wrong. The drills use
`rhost=`, `euid=`, `UID=` and `GID=` instead.

## 13. Exercise 1.4.6 searched a wildcard that matched no relevant file

Found by the new catalogue golden test, not present in the source spec.

`grep -i "error" /var/log/*.log` matches `auth.log`, `dpkg.log` and `kern.log`:
none of which contain the word "error". The errors live in `syslog` (no `.log`
extension) and `nginx/error.log` (a subdirectory). The exercise returned nothing,
so its own "you should see filename prefixes" check could never pass.

**Done:** the exercise now searches `/var/log/auth*` for `"Failed password"`,
which matches both the live log and its rotated `.1` archive. That preserves the
wildcard lesson, produces visibly different filename prefixes, and teaches
something true: logs rotate at midnight, so an overnight incident spans two files.

## 14. The AI Security spec asks for a live model, which cannot be graded

The AI Security specification describes a jailbreak testing interface where a
student sends payloads at a model and the result decides whether they pass. Taken
literally that means grading against a language model, and it cannot work here
for three reasons.

Grading would not be reproducible. The same payload succeeds on one run and fails
on the next, so a student cannot tell whether they learned something or got
lucky, and neither can an instructor reviewing where people get stuck. Every
other answer key in this codebase is computed from committed, seeded data
specifically to avoid that.

The lesson would be wrong. What the package needs to teach is structural: a
keyword filter is only as good as the normalisation in front of it, a normaliser
with no filter behind it blocks nothing, and controls on the user input path do
not touch the retrieval path. Those are facts about a deployment's architecture,
not about a model's mood on a given afternoon.

And it would generate real attack traffic. A training platform that pipes
student-authored jailbreaks at a live model is a training platform doing that at
volume, from many accounts, indefinitely.

**Done:** the lab is a deterministic rule engine (`src/ai/harness.ts`). A payload
carries an intent and zero or more carriers; a deployment carries controls of
three kinds; the interaction between them decides the outcome. Each claim the
curriculum makes is asserted as a test in `harness.test.ts`, so a change that
quietly strengthens or weakens a control fails the build rather than silently
retuning a dozen exercises.

## 15. The spec's severity examples would teach an assessor to be ignored

The specification's portfolio example rates a prompt injection as CRITICAL with
an 80% success rate, and its dashboard rates a system-prompt leak as LOW, with no
statement of what makes the difference. Read together they imply severity follows
the technique.

It does not, and teaching that produces assessors whose reports are entirely
critical and therefore entirely unread. The same bypass is informational out of a
development build on one laptop and serious out of a production service taking
twenty thousand decisions a day, because in the second case it reaches something.

**Done:** severity is taught as a function of deployment exposure (`ais.1.4`,
`ais.5.1`), and the portfolio computes it from the model's deployment stage
rather than letting anybody assert it. `ais.1.4` requires rating one finding
*down* to informational, which is the direction students find hard.

## 16. The spec's pricing rationale would not survive a student asking why

The specification prices the AI Security session at $25 against $15 for other
roles, with the rationale "very specialized, high-value skill, rare expertise".
Two of those three are claims about the subject rather than about the cost of
serving it, and a student who asks "so why is the solo price the same?" gets no
answer.

**Done:** `content/pricing.ts` gives exactly one reason for the difference, and it
is the one that holds: the sessions need an instructor who has actually assessed
deployed models, and there are very few of those people. The solo path therefore
includes AI Foundations and AI Security at no extra cost, because a self-paced
learner is not consuming a scarce instructor, and charging them extra would only
gatekeep the newest content behind the ability to pay.

## 17. "AI Security Analysts can earn $150k+" is not a claim this platform can make

The specification's assessment feedback quotes salary figures and describes
demand as "extreme" and supply as "zero". Those figures are for people who were
already senior somewhere else, the roles that exist are overwhelmingly not
entry-level, and routing a career changer toward a 24-32 week path on that basis
would be the single most damaging thing in the curriculum.

**Done:** the lane profile (`lanes.ts`) states plainly that there are almost no
junior openings, that the quoted figures are for people arriving from senior
roles elsewhere, and that the realistic route is two to three years in another
lane first. The assessment items that route somebody here measure tolerance
rather than enthusiasm: comfort with the mathematics, comfort where no method
exists yet, and willingness to spend a week proving a negative, because
"does AI interest you" would currently route half the population into a
specialism that cannot absorb them.

## 18. The AI Security Pathway spec re-teaches two packages that already exist

The twelve-module AI security curriculum arrived after AI Foundations (26
exercises) and AI Security Analyst (20, with the Model Lab) were already built.
Its modules 1, 2, 4, and 6 cover ground both of those already teach, in most
cases more concretely: neural network mechanics, transformers and attention,
adversarial examples, prompt injection, jailbreaks, extraction, and membership
inference.

Written literally, the platform would have shipped two treatments of a forward
pass and three of prompt injection, and a student would have had no way to know
which one to do.

**Done:** `ai-security-pathway` keeps all twelve modules of the specification and
its module order, and where a module overlaps it stays at the level of judgement
-- which control, which evidence, which finding goes first -- and points at the
lab for the doing. Nothing in it re-teaches a forward pass, and no exercise in it
asks for a payload. The half neither existing package covered is where the new
writing went: threat modelling a whole system, privacy and data lineage,
regulation and fairness, real incidents, integrated risk assessment, and
organisational governance.

## 19. The pathway's lab assignments cannot be graded here, for the reason in #14

Three assignments assume infrastructure this platform does not have. "Create
adversarial examples" needs gradient access to an image model. "Extract a model
in the lab" needs an unmetered query API and a training run. Both are real
exercises in a real lab and neither can be graded reproducibly here, which is the
same finding as #14: a grader that depends on a live model tells a student
nothing about whether they learned something.

**Done:** each becomes the reasoning the assignment was there to produce.
`aisp.2.4` grades what transfers and what the defences cost rather than a
generated perturbation; `aisp.6.1` and `aisp.6.2` grade the economics of
extraction and what each defence actually buys. Students who want to send
payloads at a deployment have the Model Lab in `ai-security`, which is
deterministic and already graded.

The capstone has the same problem in a different form: the specification asks for
a 50 to 60 page assessment report scored out of 100. A rubric cannot honestly
mark fifty pages, and an unbounded box invites an essay that hits every keyword by
accident (see `answerFormatFor` in `content/index.ts`). `aisp.12.3` asks for the
one paragraph a product owner actually reads instead: the finding, what it
reaches, the smallest change that breaks the path, and the residual risk.

## 20. Several figures and legal outcomes in the pathway spec are wrong

The specification's case studies and regulatory section carry claims that would
have been taught as fact:

- **"GPT-3: trained on 45TB of text data."** 45TB is the raw crawl before
  filtering. The filtered training corpus was far smaller, and the figure that
  matters pedagogically is token count, not disk size.
- **"SEC AI Disclosure (US public companies)"** is listed as a regulation
  alongside the GDPR and the EU AI Act. There is no SEC AI disclosure rule.
  What exists is the general materiality and risk-factor regime, plus
  enforcement against overstated AI claims.
- **"EU AI Act: fines up to 6% of global revenue."** 6% is from the 2021 draft.
  The adopted text reaches 7% of worldwide annual turnover or 35 million euro for
  prohibited practices, with lower ceilings for other breaches.
- **Amazon's recruiting model: "Result: Lawsuit, reputational damage, system
  shut down."** As reported in 2018 it was an internal experimental tool that
  was abandoned, and Amazon said it was never used to evaluate candidates. No
  lawsuit is documented.
- **Google Photos labelling: "Legal risk: Discrimination claim."** No such claim
  is documented. The label was removed.
- **Facial recognition: "Error rate: 1% for white faces, 30% for Black faces."**
  Not a published figure. NIST's 2019 evaluation reported false positive
  differentials, often an order of magnitude or more and varying widely by
  algorithm, which is the accurate and more useful claim.

**Done:** module 8 names the incidents, because a student who can go and read the
reporting learns something a parable cannot teach, and every claim in it is held
to what was widely reported. Where the specification asserted a legal outcome
that did not happen, the exercise asks about the technical and process failure
instead, which is the transferable part. `aisp.5.1` carries the corrected
penalty ceilings.

## 21. The spec's membership inference example does not work as described

The specification demonstrates membership inference by querying a model once with
one person's record, once with a similar record, and concluding from the
difference that the first was in the training data. That is not a sound
inference. A confidence score means nothing without a baseline for what member
and non-member confidences look like, which is why real attacks train shadow
models on similar data first.

Taught as written, a student would report a privacy finding they could not
defend, which is worse than reporting nothing.

**Done:** `aisp.6.3` grades the mechanism (the member and non-member confidence
gap), the requirement for a baseline, the role of overfitting, and the fact that
membership can itself be the sensitive disclosure. The single-query shortcut is
one of the wrong options.

## 22. Two mechanisms are stated as settled that are not

The specification explains adversarial examples with "models are based on linear
math" and lists detection of adversarial inputs as a defence with one stated
weakness. The linear explanation is one hypothesis among several and is
contested; detection defences have a long history of being defeated by attackers
who adapt to the detector, which is a stronger statement than "attacker adapts".

**Done:** `aisp.2.4` teaches the mechanism as a property of decision boundaries
in a high-dimensional space without adopting a contested explanation, and makes
"detecting adversarial inputs is a settled defence" one of the wrong options.

## 23. The risk specification's risk matrix is non-monotonic

Its worked matrix rates a critical-impact / rare-likelihood risk RED and a
critical-impact / unlikely-likelihood risk ORANGE, where unlikely is defined as
more frequent than rare. Holding impact constant, becoming more likely lowers
the rating. Taught as written, a student produces a heat map that a reviewer can
disprove in thirty seconds, and every other cell in it stops being believed.

**Done:** `rmg.5.3` teaches monotonicity as a property a matrix must have, uses
the specification's own inverted pair as the thing to spot, and adds the point
the specification misses: ordinal ratings cannot be multiplied, because high,
medium and low are an order with no spacing.

## 24. The recommendation-engine loss estimate produces $500 billion

The specification multiplies one billion recommendations by a 1% harmful rate by
a $50,000 per-incident legal cost, gets $500B, observes that this is "obviously
unacceptable", and then adjusts the inputs until the answer looks reasonable.
The arithmetic is not the problem; the model is. A cost drawn from a rare
escalated case (a lawsuit) has been applied to every occurrence of a much
broader event (an inappropriate recommendation), and the events are treated as
independent when a thousand bad outputs in a week produce one news story rather
than a thousand suits.

**Done:** `rmg.5.2` uses the specification's own figure as the worked example
and grades the diagnosis: tail cost applied to the whole distribution, assumed
independence, and a result exceeding any plausible bound. The repair taught is a
staged escalation model (noticed, reported, escalated) with a cost per stage.
"Therefore quantification does not work" is one of the wrong options, because
qualitative ratings hide the same guess with none of the arithmetic exposed.

## 25. The governance risk score contradicts itself

The specification scores five governance factors where a higher number means
worse, averages them to 0.86, computes `1.0 - 0.86 = 0.14`, calls the result a
governance risk of 14%, then says "low score is bad" and concludes the risk is
HIGH. The subtraction inverts the scale and the conclusion ignores the
inversion. A student who follows it will report a percentage that means the
opposite of what they say it means.

**Done:** no exercise reproduces the formula. `rmg.6.3` grades governance
controls by naming the specific failure each one prevents (registry against
"nobody can say what is serving", monitoring against silent degradation), which
is the defensible version of the same idea, and `rmg.12.2` grades governance
gaps as high-ranking because they multiply other failures rather than because a
composite index says so.

## 26. CVSS is used to score process gaps

The specification assigns CVSS scores to "missing documentation: 2.1" and "weak
password policy: 5.3", and sorts a remediation plan by that column. CVSS scores
a specific software vulnerability and has no metrics that apply to a stale
runbook; the numbers are invented. Worse, the base score deliberately excludes
the environment, so sorting by it patches a 9.8 on a lab host before a 6.5 on
the payment path.

**Done:** `rmg.4.2` teaches severity and risk as different quantities, uses the
specification's own spreadsheet as the scenario, and makes "two findings with
the same CVSS score carry the same risk" the wrong option. The remedy taught is
to carry asset criticality and known exploitation alongside severity rather than
to abandon CVSS.

## 27. The risk specification's capstone and tabletop cannot be graded

It asks for a 60 to 75 page enterprise risk assessment and for the student to
facilitate a tabletop exercise. This is the same limit already recorded against
the AI Security specification: a rubric cannot honestly mark sixty pages, and a
facilitator cannot be simulated by a text box.

**Done:** module 12 grades the reasoning the report would have to contain
(`rmg.12.1` on what belongs in the register, the report and the summary,
`rmg.12.2` on ranking a mixed portfolio, `rmg.12.3` on the executive paragraph)
and module 11 grades tabletop design, observation, and folding findings back
into the register rather than the facilitation itself. `rmg.12.4` grades a
decision made at speed on partial information, which is the readiness the
specification's Risk Gaming venue actually needs.

## 28. The malware specification's labs need live samples, a sandbox, and a debugger

Its assignments are built on detonating real malware in a sandbox and stepping
through real samples in a debugger. Neither can be delivered here. Shipping
working malware to everybody who registers is an unacceptable distribution risk
whatever the packaging, and a simulated debugger that cannot surprise you
teaches a confidence the real one removes within a day.

**Done:** `malware-analysis` grades the reading and the judgement instead, over
the artefacts the war-room sample view actually shows and an analyst actually
reads: static summaries, disassembly listings, sandbox reports, monitor output,
proxy and DNS records, and rule text. `mal.2.3` grades the containment decisions
a real lab is built from, and `mal.4.1` grades breakpoint choice as the question
it answers, which is the part students get wrong long before the tooling is the
constraint. `malware-analysis.test.ts` asserts the package stays judgement-only,
so the decision is visible to whoever tries to add a terminal exercise later.

## 29. The classification table files Conficker as a virus, and the Mirai entry is wrong

The specification lists Conficker as an example of a virus. It spread across
networks by exploiting a service, with no host program and no user, which is the
definition of a worm. Melissa is described simply as an email worm, losing the
macro-virus half that explains how it travelled. The Mirai entry credits the
botnet with the outages at Dyn, GitHub, and Twitter; the record-setting flood
against GitHub in 2018 was memcached reflection, with no botnet behind it.

**Done:** `mal.1.2` uses the table as the scenario and makes the three
corrections the answer, with "every sample belongs in exactly one category" as
the wrong option, since the deeper problem is the assumption that delivery,
control, and payload are one question rather than three.

## 30. The worked disassembly listing contradicts its own bytes

The specification prints `68 04120040  PUSH 0x40120204` and `FF15 80200040
CALL DWORD [0x40208080]`. x86 is little-endian, so those byte sequences encode
0x40001204 and 0x40002080. Both printed operands are wrong, and the second one
matters more than it looks: that instruction is an indirect call through an
import thunk, so a misread address names the wrong API and therefore describes
the wrong behaviour in a report.

**Done:** `mal.3.2` is built on the error rather than on a corrected listing.
The student is asked which statements about the listing are true, the byte-order
statement in reverse is the wrong option, and the habit being taught is that
where a rendering and the bytes disagree, the bytes are the program.

## 31. Attribution is treated as a student deliverable

The capstone asks for a threat actor profile with a confidence level, and the
module on indicators presents attribution as a normal output of analysing a
sample. Every artefact available inside a binary, the language of its strings,
its build timestamps, its hosting, its code overlap, was chosen by the person
being identified, and false flags in real operations have taken in analysts with
better evidence than this. The specification also lists free multi-engine
scanning services without saying what a submission from a live incident
discloses.

**Done:** attribution is taught as a bounded skill rather than dropped.
`mal.6.3` grades the weight of each signal and makes "four weak signals pointing
the same way add up to a strong conclusion" the wrong option, because the four
are not independent when one person controls all of them. `mal.6.4` grades
writing the claim at the confidence it earned, with what would change it.
`mal.2.4` grades the submission question directly: what an upload makes
available to others, what the timing tells the operator, and the hash search
that asks the question without giving anything away.

## 32. The capstone asks for sixty to seventy-five pages, and awards points for speed

This is the limit already recorded against the AI Security and risk
specifications in items 19 and 27: a rubric cannot honestly mark sixty pages.
The incident assignment additionally awards five points for speed of analysis,
which rewards exactly the behaviour that produces a confident wrong answer in
the first hour of an incident.

**Done:** module 12 grades the reasoning the report would have to contain
(`mal.12.1` on who reads which part, `mal.12.2` on the executive paragraph,
`mal.12.3` on turning a finding into a control change with a test) and
`mal.12.4` is a last pass over the claims that end up in real reports. Speed is
taught in module 11 as sequencing rather than as haste: `mal.11.1` grades
getting searchable artefacts to the hunt team within minutes so that scoping
runs in parallel, and makes "finish the analysis before saying anything" the
wrong option.
