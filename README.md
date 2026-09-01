# Ridgeline SOC Trainer

An interactive training platform for people entering cybersecurity: a simulated
Linux server, guided exercises with a real grader, an alert queue to triage, and
an intrusion to run end to end.

Built for career changers who hold Security+ or equivalent theory and have never
touched a live system.

## Status

**Phase 1 (MVP) is complete and runnable.**

| Piece | State |
|---|---|
| Terminal engine (parser, virtual filesystem, ~45 commands) | Done, 58 tests |
| Simulated host `rmg-web-02` with 2,539-line auth.log and 222-line syslog | Done |
| Linux Fundamentals, 22 exercises | Done |
| Teaching material, progressive hints, reveal-answer | Done |
| 110 optional practice drills (5 per exercise) | Done |
| Auth, progress tracking, resume, linear unlocking | Done |
| Career routing: 16 tracks, 16 lanes, 70-item assessment, capability baseline | Done, engine and API (no UI for the baseline yet) |
| Log Analysis, Alert Triage, Networking | Done |
| Incident Response and Remediation | Done |
| AI Foundations, 26 exercises | Done |
| AI Security Analyst, 20 exercises, with the Model Lab | Done |
| Remaining foundations (regex, Windows, SIEM, cloud, GRC, …) | Outlined, not written |

**141 exercises across 7 packages** today.

See [docs/content-issues.md](docs/content-issues.md) for problems found in the
source specifications and what was done about each, and [docs/roles/](docs/roles)
for the role specifications behind the tracks.

## Running it

Requires Node 20+. No Docker, no database server: local development uses SQLite.

```bash
npm run setup
```

That installs dependencies, builds shared types, creates the database, and seeds
a demo account. **The demo password is randomly generated and printed once**:
copy it. Nothing is hardcoded, deliberately: a training platform that ships with
a known default password is a live vulnerability.

Then, in two terminals:

```bash
npm run dev:server
```

```bash
npm run dev:client
```

The app is at http://localhost:5173 and the API at http://localhost:4000.

Other useful commands:

```bash
npm test
```

```bash
npm run typecheck
```

```bash
npm run gen:world --workspace @soc/server
```

The last one regenerates the simulated host's log files. The output is committed
on purpose (see below).

`npm test` never touches `prisma/dev.db`. Each test file is handed a private
copy of a freshly migrated database (`packages/server/test/database.ts`), so the
suite runs fully in parallel, needs no `.env`, and cannot be disturbed by a dev
server or a second test run holding the SQLite file.

## How it is put together

```
packages/
  shared/   TypeScript types used by both sides: one definition, no drift
  server/   Express API, terminal engine, exercise content, grading
  client/   React + Vite front end
```

### The terminal runs on the server

Every command is a round trip. The student's filesystem state lives in the
database, never in the browser.

That is a security decision, not a convenience one: if filesystem state lived in
the client, a student could edit it and pass any exercise. The same reasoning
keeps exercise *checks* server-side: shipping them to the browser would hand
over the answer key.

### The filesystem is copy-on-write

One immutable base image is shared by every session. Each student gets an overlay
recording only what they changed. The seeded logs are hundreds of kilobytes and
the overlay is serialised to a database row after every command, so storing the
diff rather than the whole tree is what keeps that cheap.

### The simulated world is generated and committed

`scripts/generate-world.ts` builds the logs from a fixed PRNG seed, and its
output is committed to git.

Exercise answers depend on exact counts ("how many failed logins?"). If the logs
were built at runtime from a fresh seed, every deploy would silently change the
right answer. One fixed seed plus a committed output means any change to the
world shows up as a reviewable diff.

Expected answers are then **computed from the seeded data** rather than typed in
by hand, so regenerating the world cannot leave a stale answer key behind.

### The logs are mostly boring, on purpose

The single most valuable thing to teach is signal versus noise. If every line a
student greps turns out to be the attack, they learn to expect a world that does
not exist.

So `rmg-web-02` carries a full day of legitimate traffic, plus two deliberate
decoys that look alarming and are completely benign:

1. A misconfigured monitoring host that fails authentication every five minutes
   all day, producing **more failed logins than the actual attacker**. It is a
   stale password in a monitoring config: exactly what this looks like in real
   life.
2. A DBA logging in at 03:11. Odd hour, entirely legitimate, because scheduled
   maintenance runs overnight.

Threaded through that noise is one real intrusion: a brute-force wave, one
successful login to a stale test account, privilege escalation, a backdoor
account, a cron persistence mechanism, and an outbound transfer.

Every external address is from an RFC 5737 documentation range
(`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`). These are reserved and
cannot route to a real host, so no exercise ever points a student at somebody's
real server. The organisation, staff, and hostnames are entirely fictional.

### Four ways to get unstuck

A student who has never used a shell cannot "practise what they already know", so
every exercise carries four layers and they can stop at whichever one works:

1. **Teaching material**: the concept, the command's shape, its flags, and
   worked examples that are deliberately *not* the answer. Available before the
   first attempt.
2. **Hints**: one at a time, on request, increasing in directness.
3. **The worked answer**: behind an explicit second click, so a student always
   knows the moment they chose to be told.
4. **`help`** in the terminal itself.

After passing, a **debrief** connects the mechanic to real SOC work, and five
optional practice drills offer the same skill against different targets.

### The Model Lab runs on a rule engine, on purpose

The AI Security package asks a student to break a deployed model. There is no
language model behind it. There is a deterministic harness that decides, from
the payload and the deployment's declared defences, whether the instruction
would have got through.

That is not a compromise made for cost. It is the same decision as generating
the log files from a fixed seed and committing the output, for the same three
reasons.

A live model gives non-reproducible grading. The same payload passes on Tuesday
and fails on Thursday, and the student cannot tell whether they learned
something or got lucky. Every other answer key here is computed from committed
data; this one is no different.

The thing being taught is not a list of magic words. It is that keyword filters
are defeated by encoding, that normalisation with no filter behind it buys
nothing, and that only controls which never treat retrieved text as an
instruction survive indirect injection. A rule engine models exactly that, and
`ai/harness.test.ts` asserts each of those claims as a test: if a change makes
one of them untrue, the curriculum is wrong and the build says so.

And a platform that piped student-authored jailbreaks at a live model would be a
platform generating real attack traffic.

Nothing in the lab produces harmful output. A successful bypass returns the
made-up system prompt of a made-up product, or makes a made-up detector answer
"SAFE" about a log line the student already read in Package 2. The teaching
value is entirely in whether the payload landed.

The answer key (which controls a given deployment actually has) never reaches
the browser. A result reports the *stage* a payload died at, which is roughly
what a real black-box tester infers; naming the control would let somebody map a
deployment in eight probes without understanding any of it. `services/modelLab.ts`
is the one seam allowed to see both sides, the same arrangement as
`services/alerts.ts` for the alert queue.

### Grading checks outcomes, not keystrokes

Each exercise has typed checks and all must pass. Wherever possible they grade
what actually happened: `fs-exists` confirms the file is really there,
`cwd-equals` confirms the student really moved, `output-numeric` compares against
a count computed from the real log. Command shape is only checked where the
exercise is explicitly about learning a flag.

Every failed check carries its own hint, and all failures are reported at once:
revealing one problem at a time turns learning into a guessing game.

Re-attempting is always allowed and can only help: **a pass is permanent** and a
failed retry never takes it away.

## Deploying

The server is written 12-factor: all configuration comes from the environment,
no state on local disk, and the database sits behind a thin data layer.

The Prisma schema deliberately avoids features SQLite lacks (native enums, scalar
lists): statuses and roles are plain strings constrained by TypeScript unions,
and structured blobs are JSON strings. Moving to Postgres on AWS is therefore a
change of `provider` plus `DATABASE_URL` and a fresh migration, not a rewrite.

Copy `.env.example` to `.env` and generate a real secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

In production the server refuses to start with a placeholder `JWT_SECRET` or with
`COOKIE_SECURE` unset, rather than silently signing sessions with a guessable key.

## Known gaps

- **Most foundations are still outlined rather than written.** Regex, Windows,
  SIEM, cloud, and the whole risk-and-governance side have full curriculum
  outlines and zero exercises. The UI marks them clearly rather than pretending
  otherwise, and `trackReadiness()` reports what exists separately from what a
  student has completed.
- **The Model Lab is a rule engine, not a language model.** Every finding a
  student produces in the AI Security package is against a simulated deployment.
  That is deliberate (see below), and the portfolio says so on every rendering
  rather than letting anybody imply otherwise.
- **The adversarial-examples material is conceptual.** Data poisoning,
  adversarial inputs, and model extraction are taught and assessed, but there is
  no gradient-descent sandbox behind them: a student reasons about a real
  behaviour table rather than running FGSM. `adversarial-ml` is outlined as a
  separate foundation for when that changes.
- **Alert queues and incidents exist inside exercises, not as a live mode.** A
  student triages a seeded queue and runs a scripted intrusion because both are
  graded content. A free-running incident queue that generates work outside an
  exercise is still Phase 3.
- **The capability baseline has no UI.** The probes, scoring, and routing work
  and are served from `/api/assessment/baseline/*`; nothing in the client calls
  them yet, so a student cannot reach it.
- `find -exec` and interactive `less`/`top` are not supported, and say so
  explicitly instead of returning a wrong answer.
- `npm audit` reports advisories in dev-only transitive dependencies (the Prisma
  CLI's `valibot`). Nothing in the production runtime path.
