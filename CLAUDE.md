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
exercise check — derive it (see `countAuth` in `content/package1.ts`), so
regenerating the world cannot leave a stale answer key.

**Exercise ids are permanent.** Progress rows reference them. Add new ids; never
renumber existing ones.

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
