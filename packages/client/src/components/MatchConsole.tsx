/**
 * The war room, wired to the live match backend.
 *
 * Two views: a lobby (open a match, queue for one, or join a code) and the board
 * (dossier in the middle, your console on your side, the opponent's leaked
 * signals on theirs). Everything it renders comes from a redacted MatchView, so
 * it is structurally incapable of showing the opponent's board -- the server
 * never sends it.
 *
 * Turns are async, so while it is not your move the board polls for the
 * opponent's, and a waiting match polls for someone to join.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  AVATARS,
  MATCH_SIDES,
  ROOM_VISIBILITIES,
  SCENARIO_DIFFICULTIES,
} from '@soc/shared';
import type {
  AvatarId,
  MatchSide,
  MatchView,
  PublicUser,
  RoomVisibility,
  ScenarioDifficulty,
} from '@soc/shared';

import { ApiCallError, matches, type MatchBrief } from '../lib/api';

/** The only red-blue scenario so far. A picker replaces this when there are more. */
const SCENARIO = { id: 'rt-recon-northwind', title: 'Operation Tidewater: Recon' };

/** A headset-operator portrait, tinted per side. Purely a game avatar. */
function Avatar({ side, className = 'ava' }: { side: MatchSide; className?: string }) {
  return (
    <svg className={`${className} ${side}`} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="12" fill="var(--ava-bg)" />
      <path d="M10 62 Q10 45 32 45 Q54 45 54 62 Z" fill="var(--ava-fg)" />
      <circle cx="32" cy="27" r="13" fill="var(--ava-fg)" />
      <path d="M18 27 a14 14 0 0 1 28 0" fill="none" stroke="var(--ava-ac)" strokeWidth="3" strokeLinecap="round" />
      <rect x="15" y="25" width="5" height="9" rx="2.5" fill="var(--ava-ac)" />
      <rect x="44" y="25" width="5" height="9" rx="2.5" fill="var(--ava-ac)" />
      <path d="M44 34 q-5 5 -11 4" fill="none" stroke="var(--ava-ac)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * A flat scene banner: a red operative at a laptop, a dividing wall of screens,
 * a blue operative at a laptop. Purely decorative, and drawn inline so it needs
 * no external image (the artifact CSP would block one anyway).
 */
interface SceneLabel {
  name: string;
  role: string;
}

function MatchScene({ red, blue }: { red: SceneLabel; blue: SceneLabel }) {
  return (
    <svg className="wr-scene" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="wr-bg-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a0d16" />
          <stop offset="1" stopColor="#0b0710" />
        </linearGradient>
        <linearGradient id="wr-bg-blue" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1f38" />
          <stop offset="1" stopColor="#070b14" />
        </linearGradient>
        <radialGradient id="wr-glow-red" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(255,59,82,0.55)" />
          <stop offset="1" stopColor="rgba(255,59,82,0)" />
        </radialGradient>
        <radialGradient id="wr-glow-blue" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(63,157,255,0.55)" />
          <stop offset="1" stopColor="rgba(63,157,255,0)" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="400" height="200" fill="url(#wr-bg-red)" />
      <rect x="400" y="0" width="400" height="200" fill="url(#wr-bg-blue)" />

      {/* laptop / screen glow each side */}
      <ellipse cx="315" cy="150" rx="95" ry="66" fill="url(#wr-glow-red)" />
      <ellipse cx="485" cy="150" rx="95" ry="66" fill="url(#wr-glow-blue)" />

      {/* red operative, seated at a laptop, facing the wall */}
      <g>
        <path d="M205 182 Q205 128 248 126 Q291 128 291 182 Z" fill="#180b11" />
        <circle cx="248" cy="100" r="21" fill="#180b11" />
        {/* rim light from the screens */}
        <path d="M269 112 A21 21 0 0 0 269 88" fill="none" stroke="#ff3b52" strokeWidth="2.5" opacity="0.8" />
        <path d="M291 182 Q289 150 300 140" fill="none" stroke="#ff3b52" strokeWidth="2" opacity="0.5" />
        {/* laptop */}
        <path d="M300 168 L342 158 L347 172 L305 183 Z" fill="#2a121b" />
        <path d="M322 150 L346 145 L344 160 L320 164 Z" fill="#3a1622" />
        <path d="M323 151 L344 147 L343 158 L322 161 Z" fill="#ff3b52" opacity="0.55" />
      </g>

      {/* blue operative, mirrored */}
      <g>
        <path d="M595 182 Q595 128 552 126 Q509 128 509 182 Z" fill="#0b1524" />
        <circle cx="552" cy="100" r="21" fill="#0b1524" />
        <path d="M531 112 A21 21 0 0 1 531 88" fill="none" stroke="#3f9dff" strokeWidth="2.5" opacity="0.8" />
        <path d="M509 182 Q511 150 500 140" fill="none" stroke="#3f9dff" strokeWidth="2" opacity="0.5" />
        <path d="M500 168 L458 158 L453 172 L495 183 Z" fill="#0f2236" />
        <path d="M478 150 L454 145 L456 160 L480 164 Z" fill="#12304c" />
        <path d="M477 151 L456 147 L457 158 L478 161 Z" fill="#3f9dff" opacity="0.55" />
      </g>

      {/* the wall of screens between them */}
      <rect x="372" y="16" width="56" height="168" rx="5" fill="#0c1018" stroke="#243049" strokeWidth="1" />
      {[28, 52, 76, 100, 124, 148].map((y) => (
        <g key={y}>
          <rect x="379" y={y} width="18" height="16" rx="2" fill="#1a1020" stroke="#3a1622" strokeWidth="0.75" />
          <rect x="403" y={y} width="18" height="16" rx="2" fill="#0e1c30" stroke="#12304c" strokeWidth="0.75" />
        </g>
      ))}
      <circle cx="400" cy="100" r="13" fill="#0c1018" stroke="#9d7bff" strokeWidth="1.5" />
      <rect x="395" y="98" width="10" height="9" rx="1.5" fill="#9d7bff" />
      <path d="M397 98 v-2 a3 3 0 0 1 6 0 v2" fill="none" stroke="#9d7bff" strokeWidth="1.5" />

      {/* floor reflection */}
      <rect x="0" y="184" width="800" height="16" fill="#05070d" opacity="0.6" />

      {/* nameplates */}
      <text x="24" y="40" fill="#ff6377" fontSize="21" fontWeight="700">
        {red.name}
      </text>
      <text x="24" y="58" fill="#8b96b0" fontSize="11" letterSpacing="1.4">
        {red.role.toUpperCase()}
      </text>
      <text x="776" y="40" fill="#6cb6ff" fontSize="21" fontWeight="700" textAnchor="end">
        {blue.name}
      </text>
      <text x="776" y="58" fill="#8b96b0" fontSize="11" letterSpacing="1.4" textAnchor="end">
        {blue.role.toUpperCase()}
      </text>
    </svg>
  );
}

function errText(error: unknown): string {
  if (error instanceof ApiCallError) return error.error.message;
  return 'Something went wrong. Try again.';
}

/**
 * The defender's investigation shell (advanced/expert tiers).
 *
 * A real terminal on the seeded host: the same engine the exercises use. Red's
 * loud moves land in /var/log/edge.log, and Blue reads them here with the tools
 * a defender actually has -- tail, grep, cat.
 */
function MatchTerminal({ matchId, initialCwd }: { matchId: string; initialCwd: string }) {
  const [lines, setLines] = useState<Array<{ cmd: string; out: string }>>([]);
  const [cwd, setCwd] = useState(initialCwd);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const prompt = `analyst@host:${cwd === '/home/student' ? '~' : cwd}$`;

  async function run(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd || busy) return;
    setBusy(true);
    setInput('');
    try {
      const res = await matches.terminal(matchId, cmd);
      setLines((l) => [...l, { cmd, out: res.output }]);
      setCwd(res.cwd);
    } catch (err) {
      setLines((l) => [...l, { cmd, out: `${errText(err)}\n` }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wr-term">
      <div className="wr-term-head">Investigation shell &middot; read the host</div>
      <div className="wr-term-body" ref={bodyRef}>
        <div className="wr-term-hint">
          Red&apos;s activity lands in <b>/var/log/edge.log</b>. Try <b>tail /var/log/edge.log</b> or{' '}
          <b>grep BLOCK /var/log/edge.log</b>.
        </div>
        {lines.map((l, i) => (
          <div key={i}>
            <div className="wr-term-cmd">
              <span className="wr-term-prompt">{prompt}</span> {l.cmd}
            </div>
            {l.out && <pre className="wr-term-out">{l.out}</pre>}
          </div>
        ))}
      </div>
      <form className="wr-term-input" onSubmit={run}>
        <span className="wr-term-prompt">{prompt}</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
          spellCheck={false}
          autoComplete="off"
          placeholder={busy ? 'running…' : ''}
          aria-label="terminal command"
        />
      </form>
    </div>
  );
}

/**
 * Red's recon console (advanced/expert tiers), in place of the menu.
 *
 * A real recon command is Red's move, so this both prints the tool output and
 * lifts the refreshed view up (the board, turn, and findings all change). The
 * "why" is required for a scored command; the server refuses one without it.
 */
function MatchAttackConsole({
  view,
  onResult,
}: {
  view: MatchView;
  onResult: (v: MatchView) => void;
}) {
  const [lines, setLines] = useState<Array<{ cmd: string; out: string }>>([]);
  const [input, setInput] = useState('');
  const [why, setWhy] = useState('');
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const prompt = 'operator@recon:~$';

  async function run(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd || busy) return;
    setBusy(true);
    try {
      const res = await matches.attack(view.id, cmd, why.trim());
      setLines((l) => [...l, { cmd, out: res.output }]);
      setInput('');
      // If the turn advanced, the command was a committed move; reset the why.
      if (res.view.turn !== view.turn || res.view.toMove !== view.toMove) setWhy('');
      onResult(res.view);
    } catch (err) {
      setLines((l) => [...l, { cmd, out: `${errText(err)}\n` }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wr-term">
      <div className="wr-term-head">Recon console &middot; scan the target</div>
      <div className="wr-term-body" ref={bodyRef}>
        <div className="wr-term-hint">
          A real recon command is your move. Try <b>whois northwind.example</b>, then{' '}
          <b>dig northwind.example</b>, then <b>nmap 203.0.113.10</b>. Type <b>help</b> for tools.
        </div>
        {lines.map((l, i) => (
          <div key={i}>
            <div className="wr-term-cmd">
              <span className="wr-term-prompt">{prompt}</span> {l.cmd}
            </div>
            {l.out && <pre className="wr-term-out">{l.out}</pre>}
          </div>
        ))}
      </div>
      <div className="wr-term-why">
        <input
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          disabled={busy}
          placeholder="Why this move? (needed to run a scan)"
          aria-label="justification"
        />
      </div>
      <form className="wr-term-input" onSubmit={run}>
        <span className="wr-term-prompt">{prompt}</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
          spellCheck={false}
          autoComplete="off"
          placeholder={view.yourTurn ? (busy ? 'running…' : '') : 'waiting for blue…'}
          aria-label="recon command"
        />
      </form>
    </div>
  );
}

export function MatchConsole({ user, onExit }: { user: PublicUser; onExit: () => void }) {
  const [phase, setPhase] = useState<'lobby' | 'match'>('lobby');
  const [list, setList] = useState<MatchView[] | null>(null);
  const [active, setActive] = useState<MatchView | null>(null);
  const [brief, setBrief] = useState<MatchBrief | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Lobby form.
  const [callSign, setCallSign] = useState('');
  const [avatarId, setAvatarId] = useState<AvatarId>(AVATARS[0]);
  const [difficulty, setDifficulty] = useState<ScenarioDifficulty>('beginner');
  const [side, setSide] = useState<MatchSide>('red');
  const [visibility, setVisibility] = useState<RoomVisibility>('closed');
  const [codeInput, setCodeInput] = useState('');

  // Board move.
  const [chosen, setChosen] = useState<string | null>(null);
  const [justification, setJustification] = useState('');

  const loadList = useCallback(() => {
    matches
      .list()
      .then(setList)
      .catch((e) => setError(errText(e)));
  }, []);

  useEffect(() => {
    if (phase === 'lobby') loadList();
  }, [phase, loadList]);

  const identity = () => ({ callSign, avatarId });

  const enter = useCallback(async (view: MatchView) => {
    setActive(view);
    setBrief(null);
    setChosen(null);
    setJustification('');
    setPhase('match');
    try {
      setBrief(await matches.brief(view.id));
    } catch {
      // A scenario with no authored brief still plays; the board copes with null.
      setBrief(null);
    }
  }, []);

  const guarded = async (work: () => Promise<MatchView>) => {
    setBusy(true);
    setError(null);
    try {
      await enter(await work());
    } catch (e) {
      setError(errText(e));
    } finally {
      setBusy(false);
    }
  };

  const refresh = useCallback(async () => {
    if (!active) return;
    try {
      setActive(await matches.get(active.id));
    } catch {
      /* transient; the next poll retries */
    }
  }, [active]);

  // Async turns: poll while it is the opponent's move, or while a match waits
  // for somebody to join. Nothing to poll once the match is yours to act on.
  const pollRef = useRef(refresh);
  pollRef.current = refresh;
  const shouldPoll =
    phase === 'match' &&
    active !== null &&
    ((active.status === 'active' && !active.yourTurn) ||
      (active.status === 'waiting' && !active.opponent.present));
  useEffect(() => {
    if (!shouldPoll) return undefined;
    const timer = setInterval(() => void pollRef.current(), 5000);
    return () => clearInterval(timer);
  }, [shouldPoll]);

  const optionLabel = useMemo(() => {
    const map = new Map<string, string>();
    brief?.options.forEach((o) => map.set(o.id, o.label));
    return (id: string) => map.get(id) ?? id;
  }, [brief]);

  async function submitMove() {
    if (!active || !chosen || !justification.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const next = await matches.move(active.id, chosen, justification.trim());
      setActive(next);
      setChosen(null);
      setJustification('');
    } catch (e) {
      setError(errText(e));
    } finally {
      setBusy(false);
    }
  }

  async function forfeit() {
    if (!active) return;
    setBusy(true);
    try {
      setActive(await matches.abandon(active.id));
    } catch (e) {
      setError(errText(e));
    } finally {
      setBusy(false);
    }
  }

  const callSignOk = callSign.trim().length >= 3;

  // --- lobby -----------------------------------------------------------------
  if (phase === 'lobby') {
    return (
      <div className="warroom">
        <div className="shell">
          <div className="cmdbar">
            <div className="brand">
              <div className="glyph">R</div>
              <div>
                <h1>Ridgeline War Room</h1>
                <div className="sub">Turn-based red vs blue &middot; two players, one board</div>
              </div>
            </div>
            <div className="spacer" />
            <button className="wr-btn ghost" onClick={onExit}>
              Back to trainer
            </button>
          </div>

          {error && <div className="wr-error">{error}</div>}

          <div className="lobby">
            <div className="panel">
              <h2>New match</h2>
              <p className="muted">
                Open a match against another student. Closed hands you a code to send them; open drops
                you into the queue for whoever is next.
              </p>

              <div className="fieldrow">
                <label htmlFor="wr-cs">Call sign</label>
                <input
                  id="wr-cs"
                  value={callSign}
                  onChange={(e) => setCallSign(e.target.value)}
                  placeholder="How the other player sees you"
                  maxLength={14}
                />
              </div>

              <div className="fieldrow">
                <label htmlFor="wr-av">Avatar</label>
                <select id="wr-av" value={avatarId} onChange={(e) => setAvatarId(e.target.value as AvatarId)}>
                  {AVATARS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fieldrow">
                <label>Your side</label>
                <div className="seg">
                  {MATCH_SIDES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`${s}${side === s ? ' on' : ''}`}
                      onClick={() => setSide(s)}
                    >
                      {s === 'red' ? 'Red (attack)' : 'Blue (defend)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="fieldrow">
                <label htmlFor="wr-diff">Difficulty</label>
                <select
                  id="wr-diff"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as ScenarioDifficulty)}
                >
                  {SCENARIO_DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fieldrow">
                <label>Visibility</label>
                <div className="seg">
                  {ROOM_VISIBILITIES.map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={`neutral${visibility === v ? ' on' : ''}`}
                      onClick={() => setVisibility(v)}
                    >
                      {v === 'closed' ? 'Invite code' : 'Open queue'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="wr-btn"
                disabled={busy || !callSignOk}
                onClick={() =>
                  visibility === 'closed'
                    ? guarded(() =>
                        matches.open({
                          scenarioId: SCENARIO.id,
                          difficulty,
                          visibility,
                          side,
                          identity: identity(),
                        }),
                      )
                    : guarded(() =>
                        matches.queue({
                          scenarioId: SCENARIO.id,
                          difficulty,
                          side,
                          identity: identity(),
                        }),
                      )
                }
              >
                {visibility === 'closed' ? 'Open match' : 'Find a match'}
              </button>
              {!callSignOk && <p className="muted" style={{ marginTop: 8 }}>Pick a call sign of at least three characters first.</p>}
            </div>

            <div className="panel">
              <h2>Join by code</h2>
              <p className="muted">Got a code from someone? Set your call sign above, then drop it here.</p>
              <div className="fieldrow">
                <label htmlFor="wr-code">Join code</label>
                <input
                  id="wr-code"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  placeholder="6 characters"
                  maxLength={6}
                />
              </div>
              <button
                className="wr-btn"
                disabled={busy || !callSignOk || codeInput.trim().length < 4}
                onClick={() => guarded(() => matches.join({ code: codeInput.trim(), identity: identity() }))}
              >
                Join match
              </button>

              <h2 style={{ marginTop: 20 }}>Your matches</h2>
              {list === null && <p className="muted">Loading…</p>}
              {list !== null && list.length === 0 && <p className="muted">No matches yet. Open one above.</p>}
              <div className="match-list">
                {list?.map((m) => (
                  <button key={m.id} className="match-row" onClick={() => void enter(m)}>
                    <Avatar side={m.you} className="ava" />
                    <span className="grow">
                      <span className="mt">
                        You are {m.you} &middot; {SCENARIO.title}
                      </span>
                      <span className="ms">
                        {m.status} &middot; turn {m.turn}/{m.maxTurns}
                        {m.status === 'active' && (m.yourTurn ? ' &middot; your move' : ' · waiting on them')}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- board -----------------------------------------------------------------
  if (!active) return null;
  const v = active;
  const you = v.you;
  const oppSide: MatchSide = you === 'red' ? 'blue' : 'red';
  const finished = v.status === 'complete' || v.status === 'abandoned';

  const yourScore = v.yourMoves.reduce((sum, m) => sum + (m.score?.objectivePoints ?? 0), 0);
  const yourMax = v.yourMoves.reduce((sum, m) => sum + (m.score?.maxObjective ?? 0), 0);

  const yourConsole = (
    <div className={`card side-${you}`}>
      <div className="head">
        <div className="operative">
          <Avatar side={you} />
          <div>
            <div className="cs">
              {callSign || user.username} <span className="role">you &middot; {you} cell</span>
            </div>
          </div>
        </div>
        <span className="spacer" />
        <span className={`badge${v.yourTurn ? ' turn-red' : ''}`}>{v.yourTurn ? 'Your move' : 'Waiting'}</span>
      </div>
      <div className="body">
        {finished ? (
          <>
            <div className="decision-q">{v.status === 'complete' ? 'Match complete' : 'Match ended'}</div>
            <div className="decision-sub">
              Your objective score: {yourScore}/{yourMax || '—'} across {v.yourMoves.length} move(s).
            </div>
          </>
        ) : !v.opponent.present ? (
          <>
            <div className="decision-q">Waiting for an opponent</div>
            <div className="decision-sub">The match starts the moment someone takes the other chair.</div>
            {v.joinCode && (
              <>
                <div className="why-label">Share this code</div>
                <div className="codechip">{v.joinCode}</div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="decision-q">Your move &middot; turn {v.turn}</div>
            <div className="decision-sub">
              {brief ? brief.brief : 'Pick a move, then say why in a line. The reasoning is half of what is scored.'}
            </div>
            {v.terminal?.kind === 'defender' && <MatchTerminal matchId={v.id} initialCwd={v.terminal.cwd} />}
            {v.terminal?.kind === 'attacker' ? (
              <MatchAttackConsole view={v} onResult={setActive} />
            ) : (
              <>
                {(brief?.options ?? []).map((o) => (
                  <button
                    key={o.id}
                    className={`opt${chosen === o.id ? ' chosen' : ''}`}
                    disabled={!v.yourTurn || busy}
                    onClick={() => setChosen(o.id)}
                  >
                    <span className="label">{o.label}</span>
                    <span className="desc">{o.description}</span>
                  </button>
                ))}
                <div className="why-label">Why this move?</div>
                <textarea
                  className="why"
                  value={justification}
                  disabled={!v.yourTurn || busy}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder={v.yourTurn ? 'One line of reasoning…' : 'Wait for your turn.'}
                />
                <button
                  className="cta"
                  disabled={!v.yourTurn || busy || !chosen || !justification.trim()}
                  onClick={() => void submitMove()}
                >
                  {v.yourTurn ? 'Commit move → end turn' : 'Not your turn'}
                </button>
              </>
            )}
          </>
        )}

        {v.yourFindings.length > 0 && (
          <div className="findings">
            <div className="why-label">{you === 'red' ? 'What you have found' : 'Evidence pulled'}</div>
            {v.yourFindings.map((f) => (
              <div key={f.id} className={`finding sev-${f.severity ?? 'info'} kind-${f.kind}`}>
                <div className="ft">
                  {f.title}
                  {f.severity && f.severity !== 'info' && <span className="sev-chip">{f.severity}</span>}
                </div>
                <div className="fd">{f.detail}</div>
              </div>
            ))}
          </div>
        )}

        {v.yourMoves.length > 0 && (
          <div className="move-log" style={{ marginTop: 14 }}>
            {v.yourMoves.map((m) => (
              <div key={m.seq} className={`logrow${m.score && m.score.maxObjective > 0 ? ' scored' : ''}`}>
                <div className="t">
                  T{m.turn} {optionLabel(m.optionId)}
                  {m.score && m.score.maxObjective > 0 && (
                    <span className="pts"> &nbsp;{m.score.objectivePoints}/{m.score.maxObjective}</span>
                  )}
                  {m.score && m.score.maxJudge > 0 && m.score.judgePoints !== null && (
                    <span className="pts"> &nbsp;&middot; reasoning {m.score.judgePoints}/{m.score.maxJudge}</span>
                  )}
                </div>
                {m.score?.note && <div className="d">{m.score.note}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const opponentPanel = (
    <div className={`card side-${oppSide}`}>
      <div className="head">
        <div className="operative">
          <Avatar side={oppSide} />
          <div>
            <div className="cs">
              {v.opponent.identity ? v.opponent.identity.callSign : 'Open seat'}{' '}
              <span className="role">{oppSide} cell</span>
            </div>
            {v.opponent.present && (
              <div className="presence">
                <span className="live-dot" />
                <span>{v.status === 'active' && v.toMove === oppSide ? 'their move' : 'in the match'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="body">
        {v.opponentActivity.length === 0 ? (
          <div className="alert clear">
            <div className="t">Nothing from them yet</div>
            <div className="d">
              {oppSide === 'red'
                ? 'No probe has reached your queue. A careful attacker stays quiet.'
                : 'No response from the defender yet.'}
            </div>
          </div>
        ) : (
          v.opponentActivity.map((a) =>
            a.signal ? (
              <div key={a.seq} className="alert warn">
                <div className="t">
                  T{a.turn} &middot; {a.signal.label}
                </div>
                {a.signal.detail && <div className="d">{a.signal.detail}</div>}
              </div>
            ) : (
              <div key={a.seq} className="alert clear">
                <div className="t">T{a.turn} &middot; quiet turn</div>
                <div className="d">They moved, but nothing reached you.</div>
              </div>
            ),
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="warroom">
      <div className="shell">
        <div className="cmdbar">
          <div className="brand">
            <div className="glyph">R</div>
            <div>
              <h1>Ridgeline War Room</h1>
              <div className="sub">{SCENARIO.title}</div>
            </div>
          </div>
          <div className="spacer" />
          <div className="op-tag">
            <span className="k">{v.status}</span>
            <span className="small">
              turn {v.turn}/{v.maxTurns}
            </span>
          </div>
          {!finished && (
            <button className="wr-btn danger" disabled={busy} onClick={() => void forfeit()}>
              Forfeit
            </button>
          )}
          <button className="wr-btn ghost" onClick={() => setPhase('lobby')}>
            Lobby
          </button>
        </div>

        {error && <div className="wr-error">{error}</div>}

        <MatchScene
          red={{
            name: (you === 'red' ? v.youIdentity : v.opponent.identity)?.callSign ?? 'Open seat',
            role: 'Red · Attacker',
          }}
          blue={{
            name: (you === 'blue' ? v.youIdentity : v.opponent.identity)?.callSign ?? 'Open seat',
            role: 'Blue · Defender',
          }}
        />

        <div className="turnstrip">
          <span className={`whose ${v.toMove}`}>
            <span className={`dot${v.status === 'active' ? ' live' : ''}`} />
            {finished
              ? v.status === 'complete'
                ? 'Match complete'
                : 'Match ended'
              : v.status === 'waiting'
                ? 'Waiting to start'
                : `Turn ${v.turn} · ${v.yourTurn ? 'your move' : `${oppSide} to move`}`}
          </span>
        </div>

        <div className="field">
          <div className={`col${you !== 'red' ? ' dim' : ''}`}>{you === 'red' ? yourConsole : opponentPanel}</div>

          <div className="col">
            <div className="card">
              {brief ? (
                <>
                  <div className="dossier-hero">
                    <div className="eyebrow">Shared target dossier</div>
                    <div className="org" style={{ marginTop: 6 }}>
                      {brief.dossier.org}
                    </div>
                    <div className="meta">{brief.dossier.summary}</div>
                    <span className="simchip">&#9679; SIMULATED &mdash; no real host is ever reached</span>
                  </div>
                  <dl className="kv">
                    {brief.dossier.facts.map((f) => (
                      <div key={f.k} style={{ display: 'contents' }}>
                        <dt>{f.k}</dt>
                        <dd>{f.v}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              ) : (
                <div className="wr-note">No dossier for this scenario yet.</div>
              )}
            </div>
          </div>

          <div className={`col${you !== 'blue' ? ' dim' : ''}`}>{you === 'blue' ? yourConsole : opponentPanel}</div>
        </div>
      </div>
    </div>
  );
}
