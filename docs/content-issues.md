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
the live internet will see different numbers — the correct trade, since nothing
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
account cannot read it — yet the entire curriculum has students reading it
without `sudo`.

**Done:** the `student` account is a member of the `adm` group, which is exactly
how a SOC analyst is granted log access in practice rather than handing out root.
The file keeps its real permissions, `/etc/shadow` remains genuinely unreadable,
and "Permission denied" stays a lesson rather than an obstacle.
