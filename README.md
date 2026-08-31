# Ridgeline SOC Trainer

An interactive training platform for people entering cybersecurity: a simulated
Linux server, guided exercises with a real grader, and — later — a live incident
queue to work.

Built for career changers who hold Security+ or equivalent theory and have never
touched a live system.

## Status

**Phase 1 (MVP) is complete and runnable.**

| Piece | State |
|---|---|
| Terminal engine (parser, virtual filesystem, ~45 commands) | Done, 58 tests |
| Simulated host `rmg-web-02` with 2,539-line auth.log and 222-line syslog | Done |
| Package 1: Linux Fundamentals, 22 exercises | Done |
| Teaching material, progressive hints, reveal-answer | Done |
| 110 optional practice drills (5 per exercise) | Done |
| Auth, progress tracking, resume, linear unlocking | Done |
| Track architecture (SOC / Risk & Governance / Security Data Analyst) | Done |
| Packages 2–5 | Outlined, not written |
| SOC incident mode | Not started |

See [docs/content-issues.md](docs/content-issues.md) for problems found in the
source specifications and what was done about each.

## Running it

Requires Node 20+. No Docker, no database server — local development uses SQLite.

```bash
npm run setup
```

That installs dependencies, builds shared types, creates the database, and seeds
a demo account. **The demo password is randomly generated and printed once** —
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

## How it is put together

```
packages/
  shared/   TypeScript types used by both sides — one definition, no drift
  server/   Express API, terminal engine, exercise content, grading
  client/   React + Vite front end
```

### The terminal runs on the server

Every command is a round trip. The student's filesystem state lives in the
database, never in the browser.

That is a security decision, not a convenience one: if filesystem state lived in
the client, a student could edit it and pass any exercise. The same reasoning
keeps exercise *checks* server-side — shipping them to the browser would hand
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
   stale password in a monitoring config — exactly what this looks like in real
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

1. **Teaching material** — the concept, the command's shape, its flags, and
   worked examples that are deliberately *not* the answer. Available before the
   first attempt.
2. **Hints** — one at a time, on request, increasing in directness.
3. **The worked answer** — behind an explicit second click, so a student always
   knows the moment they chose to be told.
4. **`help`** in the terminal itself.

After passing, a **debrief** connects the mechanic to real SOC work, and five
optional practice drills offer the same skill against different targets.

### Grading checks outcomes, not keystrokes

Each exercise has typed checks and all must pass. Wherever possible they grade
what actually happened — `fs-exists` confirms the file is really there,
`cwd-equals` confirms the student really moved, `output-numeric` compares against
a count computed from the real log. Command shape is only checked where the
exercise is explicitly about learning a flag.

Every failed check carries its own hint, and all failures are reported at once:
revealing one problem at a time turns learning into a guessing game.

Re-attempting is always allowed and can only help — **a pass is permanent** and a
failed retry never takes it away.

## Deploying

The server is written 12-factor: all configuration comes from the environment,
no state on local disk, and the database sits behind a thin data layer.

The Prisma schema deliberately avoids features SQLite lacks (native enums, scalar
lists) — statuses and roles are plain strings constrained by TypeScript unions,
and structured blobs are JSON strings. Moving to Postgres on AWS is therefore a
change of `provider` plus `DATABASE_URL` and a fresh migration, not a rewrite.

Copy `.env.example` to `.env` and generate a real secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

In production the server refuses to start with a placeholder `JWT_SECRET` or with
`COOKIE_SECURE` unset, rather than silently signing sessions with a guessable key.

## Known gaps

- **Packages 2–5 are outlined, not written.** The Risk & Governance and Security
  Data Analyst tracks have full curriculum outlines and zero exercises. The UI
  marks them clearly rather than pretending otherwise.
- **SOC incident mode is not started.** That is Phase 3.
- `find -exec` and interactive `less`/`top` are not supported, and say so
  explicitly instead of returning a wrong answer.
- `npm audit` reports advisories in dev-only transitive dependencies (the Prisma
  CLI's `valibot`). Nothing in the production runtime path.
