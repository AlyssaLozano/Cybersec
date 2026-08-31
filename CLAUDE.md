# Working in this repository

Training platform for people entering cybersecurity. Read `README.md` for the
architecture and `docs/content-issues.md` for known problems in the source specs.

## Non-negotiables

**The terminal engine runs on the server.** Never move filesystem state or
exercise checks into the client. A student who can edit that state can pass any
exercise.

**Never ship `solution` or `checks` to the browser** except after a pass or an
explicit reveal request. `toStudentView()` in `src/content/index.ts` is the one
place that decides what a student may see.

**All simulated external addresses must come from RFC 5737 documentation ranges**
(`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`). These cannot route to a
real host. Never use a real IP or domain in seeded data, and never let a
simulated command reach an actual network.

**The simulated world is generated, not hand-edited.** Change
`packages/server/scripts/generate-world.ts` and re-run
`npm run gen:world --workspace @soc/server`. The generated file is committed on
purpose: exercise answers depend on exact counts, so the world must not change
unless somebody intends it to.

**Compute expected answers from the seeded data.** Never hardcode a count in an
exercise check — derive it (see `countAuth` in `content/linux-fundamentals.ts`),
so regenerating the world cannot leave a stale answer key.

**Exercise ids are permanent.** Progress rows reference them. Add new ids; never
renumber existing ones.

> **One-time exception, 31 August 2026.** Packages 1–4 were written before the
> naming convention existed and carried bare numeric ids (`1`, exercises
> `1.1.1`). Two sessions writing content at the same time both reached for "the
> next number" and collided. Migration
> `20260831210000_rename_legacy_package_ids` renamed those four packages to
> `linux-fundamentals`, `log-analysis`, `incident-triage`, and `networking`, and
> moved the progress rows in `exercise_progress`, `practice_progress`,
> `attempt_logs`, `terminal_sessions`, and `copilot_consults` with them.
>
> It was taken while the only rows in existence belonged to a local demo seed,
> which is the only condition under which it was affordable. **The rule is
> absolute from this date.** Renaming again once real students have progress
> means migrating their history, and a migration that silently misses one table
> loses somebody's completed work.

**Packages are named, not numbered.** New content takes a name-prefixed id
(`incident-response`, exercises `ir.2.1`) rather than the next integer, because
integers collide between parallel sessions and between source specs. Never
assert on `PACKAGES` positionally — key by package id, so adding a package adds
a line instead of editing somebody else's expectations.

## Content rules

Every exercise needs `teach`, at least one `hint`, and at least one `check`. The
catalogue validator in `content/index.ts` refuses to boot otherwise — a student
with nowhere to go is a content bug, not a user error.

Worked examples in `teach` must **not** be the exercise's own answer. They teach
the command's shape against a different target.

Grade outcomes, not keystrokes. Use `fs-exists`, `cwd-equals`, `output-numeric`
where possible; check command shape only when the exercise is explicitly about
learning a flag.

Keep the logs boring. Realistic noise and benign-but-alarming decoys are the
point — signal versus noise is the actual skill being taught.

## Schema portability

Local dev is SQLite; AWS will be Postgres. Do not use Prisma native enums or
scalar lists. Statuses and roles are plain strings constrained by TypeScript
unions in `@soc/shared`; structured blobs are JSON strings.

Prisma is pinned to v6. v7 moves the datasource URL out of the schema and
requires a native driver adapter (`better-sqlite3`), which needs a Windows build
toolchain. Do not upgrade without a reason.

## Conventions

- `npm run typecheck` and `npm test` must both pass before committing.
- Comments explain *why*, not *what*. The existing files set the density.
- Practice drills must never affect unlocking or the completion percentage.
- A pass is permanent. Nothing may downgrade `status: 'passed'`.
