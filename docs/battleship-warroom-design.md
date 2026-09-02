# Battleship War Room — design spec (build in a fresh session)

Status: **BUILT, 2 September 2026.** Engine, content, routes and board UI are in
and verified; the five linear scenarios are untouched and still green. Kept as
the record of the design and of where it was deliberately departed from (see
"Built" at the foot). The current war-room match mode is "linear" (pick one move
from a menu each turn, a resolver scores it). This spec adds a second, deeper
mode: a hidden-information, positional, decision-driven game in the shape of
Battleship. The two modes coexist; nothing here removes the five verified linear
scenarios.

## Why

The linear scenarios are turn-based but shallow: each turn is "pick the right
move," and the opponent's move only sets a threat level the other side responds
to. The user wants real strategic depth — hidden information, prediction, and a
board where "they did this, now what do you do" has several viable answers with
tradeoffs. Battleship is the reference: secret placement, probing, hit/miss
feedback, adaptation.

## The model, in one paragraph

A scenario defines a **board** of target systems, one of which is the crown jewel
Red must reach. Blue secretly places a limited amount of **defensive coverage**
on the board (its "ships") — Red cannot see where. Then, turn for turn: Red
**fires** at a target; if it is covered, Red is **detected** (a hit for Blue, and
Red learns that target is defended); if it is not covered, Red **compromises** it
quietly (a hit for Red, and Blue does not find out unless it investigates). Blue,
on its turns, may **reposition** coverage (predicting Red's next move),
**investigate** a target to reveal a quiet compromise, or **contain** a
compromise it has found. Red wins by compromising the crown jewel undetected;
Blue wins by walling Red off or running out the clock with the crown safe. Every
move reshapes the board and forces a read of the opponent.

## Data model (shared: `packages/shared/src/match.ts`)

Add a positional variant alongside the existing `MatchState`. Prefer a
discriminated union on a new `mode` field so the engine can branch cleanly and
the linear path is untouched.

```
export const MATCH_MODES = ['linear', 'positional'] as const;
export type MatchMode = (typeof MATCH_MODES)[number];

export const BOARD_PHASES = ['placement', 'play', 'done'] as const;
export type BoardPhase = (typeof BOARD_PHASES)[number];

export interface BoardTarget {
  id: string;
  label: string;
  /** Red's objective. Compromising a crown target undetected wins for Red. */
  crown: boolean;
  /** Red has compromised it (quiet hit). Server truth; redacted per side. */
  compromised: boolean;
  /** Red fired here and it was defended (a hit for Blue, visible to both). */
  detectedHere: boolean;
  /** Blue has contained it, removing Red's progress and walling it. */
  contained: boolean;
}

export interface BoardState {
  phase: BoardPhase;
  targets: BoardTarget[];
  /** Target ids Blue currently covers. HIDDEN from Red. Server truth. */
  coverage: string[];
  /** How many targets Blue may cover at once. */
  coverageBudget: number;
  /** How many coverage repositions Blue has left. */
  movesLeft: number;
}
```

Extend `MatchState` with `mode: MatchMode` and an optional `board?: BoardState`
(present only when `mode === 'positional'`). Keep the existing `moves`, `findings`,
turn cursor, identities, and status as-is; the board is additional state, and it
persists for free in the `stateJson` blob (no migration).

### The redacted view (`MatchView`)

Add a `board?: BoardViewForSide`. This is the positional `toStudentView` and the
whole security of the mode. Compute it in `matchViewFor` per side:

- **Both sides see:** every target's `id`, `label`, `crown`, `detectedHere`,
  `contained`. Detections and containments are public (both players saw the shot
  land or the wall go up).
- **Red also sees:** `compromised` for targets Red has compromised (its own hits).
- **Red must NOT see:** `coverage` (where Blue's defenses are), nor which targets
  Blue has investigated.
- **Blue also sees:** its own `coverage`, `movesLeft`, and `compromised` only for
  targets it has **investigated** (a quiet hit Blue has since uncovered).
- **Blue must NOT see:** a compromise it has not yet investigated.

Never send raw `BoardState` to a client. Same rule as `toStudentView` and the
existing `matchViewFor`.

## Turn / phase flow (engine: `packages/server/src/services/matchEngine.ts`)

New pure functions, mirroring the style of `commitMove` (injected clock, no
imports of content, throw `MatchError` for a rule a player could break):

1. **Placement phase.** On create, `board.phase = 'placement'`. Blue submits an
   initial coverage set of size `coverageBudget` via a `placeCoverage(state, userId, targetIds)`
   function. Validate: caller is Blue, count matches budget, ids exist. Then
   `phase = 'play'`, Red to move first. (Optional symmetry: let Red pick an entry
   target too; start without it.)
2. **Play phase, Red fires.** `fire(state, userId, targetId, now)`:
   - Refuse unless caller is Red, `phase === 'play'`, and it is Red's turn.
   - If `targetId` is in `coverage` → set `detectedHere = true`; Red gains no
     compromise; record a Blue-visible finding ("struck at <label>, defended").
   - Else → set `compromised = true`; if `crown` → `status = 'complete'`, Red
     wins; record a Red-only finding.
   - Pass the turn to Blue.
3. **Play phase, Blue acts.** One of:
   - `reposition(state, userId, fromId, toId)` — move a coverage token; decrement
     `movesLeft`; refuse when `movesLeft === 0`.
   - `investigate(state, userId, targetId)` — reveal `compromised` for that target
     to Blue (adds it to Blue's visible set); if it was compromised, Blue now sees
     the quiet hit.
   - `contain(state, userId, targetId)` — only on a target Blue has found
     compromised; set `contained = true`, clear `compromised` (walls Red off there).
   - Pass the turn to Red.
4. **End.** Red wins on crown compromise. Blue wins if the turn budget runs out
   with no crown compromised, or if Blue contains every compromise and Red is out
   of viable targets. Set `status` accordingly (reuse `'complete'`; add a
   `winner: MatchSide | null` to the view so the client can show who won).

## Scoring

Two layers, matching the platform's hybrid grading:

- **Objective / outcome:** did Red reach the crown undetected? how many detections
  did Red eat? how many quiet hits did Blue leave uninvestigated? Derive from board
  state at end — do not hardcode.
- **Judge (deterministic rubric):** score each side's per-turn justification the
  same way the linear scenarios do (`judgeJustification`), so reasoning still
  counts. Keep the "say why before you act" field.

Every move still carries a one-line justification; the board mechanic is on top of,
not instead of, the reasoning grade.

## Content shape (`packages/server/src/content/redblue/`)

A positional scenario is a new object type (extend `RedBlueScenario` or add a
sibling `PositionalScenario`) that declares:

- `board`: the initial `BoardTarget[]` (labels, which is crown), `coverageBudget`,
  and `movesLeft`.
- Flavor text per target (what compromising it means), reused as findings.
- Register it the same way (`registerMatchScenario` gains a positional path, or a
  parallel `registerPositionalScenario`).

First positional scenario to build: **"Reach the Core"** on the Northwind estate —
targets `web`, `mail`, `vpn`, `dns`, `fileserver`, `dc` (crown), coverageBudget 2,
movesLeft 3, maxTurns ~10. It reuses the campaign's world (RFC 1918 internal, RFC
5737 external) so it sits beside the five linear scenarios.

## Route + API

- Routes on the existing matches router: `POST /:id/place`, `POST /:id/fire`,
  `POST /:id/blue-act` (or three verbs). Each returns the caller's redacted
  `MatchView` (board included). Mirror the guard/`MatchError` → 409 pattern in
  `routes/matches.ts`.
- Client api group `matches`: add `place`, `fire`, `investigate`, `reposition`,
  `contain`. Each returns `MatchView`.

## Client (`packages/client/src/components/MatchConsole.tsx` + `match.css`)

- When `view.mode === 'positional'`, render a **board grid** instead of the move
  menu: a tile per target showing label, crown marker, and state (unknown /
  detected / compromised / contained), themed red/blue.
- Red's board hides coverage; Blue's board shows its own coverage and a "reposition
  / investigate / contain" control set. Keep the scene banner, turn strip, and the
  "why this move" justification field.
- Placement screen for Blue at `phase === 'placement'`: pick `coverageBudget`
  tiles, hidden from Red, then "lock in."

## Test plan (the fresh session MUST run this)

Unit-test the engine like `matchEngine.test.ts` and the scenarios:
- placement rejects wrong count / wrong side / bad ids; flips to play with Red first.
- fire on a covered target → detected, no compromise, Blue sees it, Red does not win.
- fire on an uncovered target → compromised, Red-only, and on the crown → Red wins.
- fire refused off-turn / wrong phase / wrong side.
- redaction: Red's view never contains `coverage`; Blue's view never shows an
  uninvestigated compromise; investigate reveals it.
- reposition decrements `movesLeft` and is refused at zero; contain walls a found
  compromise; turn-budget exhaustion with a safe crown → Blue wins.
Then `npm run build --workspace @soc/shared && npm run typecheck && npm test`.

## Coexistence / do-no-harm

- Keep `mode: 'linear'` the default; the five existing scenarios and all their
  tests must stay green untouched.
- The board rides in `stateJson`; no Prisma migration.
- `terminalKindFor` and the attacker/defender consoles are a linear-mode concept;
  positional mode does not use them (the board IS the interface).

## Files to touch (summary)

- `packages/shared/src/match.ts` — MatchMode, BoardState, BoardTarget, MatchView.board.
- `packages/server/src/services/matchEngine.ts` — placeCoverage/fire/blue actions,
  positional `matchViewFor` branch, winner.
- `packages/server/src/services/matches.ts` — persistence wrappers for the new actions.
- `packages/server/src/routes/matches.ts` — new endpoints.
- `packages/server/src/content/redblue/` — PositionalScenario type + "Reach the Core".
- `packages/client/src/lib/api.ts`, `components/MatchConsole.tsx`, `match.css` — board UI.
- New tests beside each.

## Built

Everything above shipped, with three deliberate departures, each because building
it exposed something the design could not have known:

1. **`BoardState.investigated` became `BoardState.found`.** The spec had Blue see
   `compromised` for "targets it has investigated". Implemented literally, that is
   a standing season ticket: a system Blue looked at on turn 2 would hand it every
   future compromise there for free, which is the hidden information the mode is
   made of. It records only what an investigation actually *turned up*, so a
   system that looked clean and was taken later has to be looked at again.

2. **Blue's second win condition was dropped, not implemented.** The spec said
   Blue also wins when it "contains every compromise and Red is out of viable
   targets". That ending cannot occur: reaching the crown ends the match on the
   spot, so a compromised crown never sits around to be contained, so the crown is
   always still there to be fired at. Rather than ship an unreachable branch, the
   rule is now the honest one -- **Blue wins by still holding the core when the
   clock runs out** -- and the engine says so in a comment.

3. **Placement gives Blue the clock, and is not a move.** The spec did not say who
   is on the clock during placement. Blue is, because it is Blue's action; and the
   placement is not recorded in `moves`, because a move is a thing the opponent is
   told happened, and Red must learn nothing from placement.

Also settled while building: `coverageBudget` is public to both sides (a fleet's
composition is public in Battleship, and it is what makes probing a decision
rather than a coin toss), while `movesLeft` is Blue-only.

Verified by 60 unit tests (`matchBoard.test.ts`, `reach-the-core.test.ts`) plus a
full two-player match driven over real HTTP, which is where the redaction was
checked: Red's serialised view contains no `coverage` key at all.
