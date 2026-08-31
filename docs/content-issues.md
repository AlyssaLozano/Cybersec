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
