/**
 * Superadmin: platform-wide account actions, and read-only oversight of a
 * live room or match.
 *
 * WHY THIS NEVER IMPORTS WatchRoom OR MatchConsole
 *
 * Both are full participant UIs with seat-picking and move-making affordances.
 * Reusing either here risks accidentally wiring up an action that would seat
 * or move the superadmin, which is exactly what routes/superadmin.ts's own
 * header says observation must never do. Everything below only ever renders
 * what the server already computed; nothing here calls rooms.* or matches.*.
 *
 * The server is the actual gate on every route this panel calls -- see the
 * header comment in RoomReview.tsx for why hiding a control here is UX, not
 * security.
 */

import { useCallback, useEffect, useState } from 'react';

import { SOC_ROLES } from '@soc/shared';
import type { MatchSide, MatchView, SocRoleId } from '@soc/shared';

import { ApiCallError, superadmin } from '../lib/api';
import type {
  AccountSearchResult,
  ClientRoom,
  SeatBoard,
  SuperadminRoomObservation,
} from '../lib/api';
import { StageReview } from './StageReview';

/** The seat's proper title, so a chart says "Log Analyst" and not "log-analyst". */
function roleLabel(role: SocRoleId): string {
  return SOC_ROLES.find((r) => r.id === role)?.title ?? role;
}

type Section = 'accounts' | 'stage' | 'observe';

export function SuperadminPanel() {
  const [section, setSection] = useState<Section>('accounts');

  return (
    <section className="superadmin">
      <h2 className="lobby__h">Superadmin</h2>

      <nav className="superadmin__tabs">
        <button
          type="button"
          className={section === 'accounts' ? 'is-on' : ''}
          onClick={() => setSection('accounts')}
        >
          Accounts
        </button>
        <button
          type="button"
          className={section === 'stage' ? 'is-on' : ''}
          onClick={() => setSection('stage')}
        >
          Stage review
        </button>
        <button
          type="button"
          className={section === 'observe' ? 'is-on' : ''}
          onClick={() => setSection('observe')}
        >
          Observe
        </button>
      </nav>

      {section === 'accounts' ? (
        <AccountActions />
      ) : section === 'stage' ? (
        <StageReview />
      ) : (
        <ObserveSection />
      )}
    </section>
  );
}

/* --- accounts -------------------------------------------------------------- */

function AccountActions() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AccountSearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function search(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { accounts } = await superadmin.accounts(query);
      setResults(accounts);
      setSearched(true);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Search failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="superadmin__accounts">
      <p className="lobby__hint">
        Search by username or email. Every action here needs a reason: it is written to the record
        that survives it.
      </p>

      <form className="superadmin__search" onSubmit={(e) => void search(e)}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="username or email"
        />
        <button type="submit" className="primary" disabled={busy || query.trim() === ''}>
          {busy ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      {searched && results.length === 0 ? <p className="seat-note">No accounts matched.</p> : null}

      {results.length > 0 ? (
        <ul className="superadmin__accountlist">
          {results.map((account) => (
            <AccountRow
              key={account.id}
              account={account}
              onChanged={(updated) =>
                setResults((current) => current.map((a) => (a.id === updated.id ? updated : a)))
              }
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

type AccountAction = 'suspend' | 'ban' | 'reinstate' | null;

function standingOf(account: AccountSearchResult): string {
  if (account.platformBanned) return 'banned';
  if (account.platformSuspendedUntil && new Date(account.platformSuspendedUntil).getTime() > Date.now()) {
    return `suspended until ${new Date(account.platformSuspendedUntil).toLocaleString()}`;
  }
  return 'active';
}

function AccountRow({
  account,
  onChanged,
}: {
  account: AccountSearchResult;
  onChanged: (updated: AccountSearchResult) => void;
}) {
  const [action, setAction] = useState<AccountAction>(null);
  const [until, setUntil] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function closeForm() {
    setAction(null);
    setUntil('');
    setReason('');
    setError(null);
  }

  async function commit() {
    setBusy(true);
    setError(null);
    try {
      if (action === 'suspend') {
        await superadmin.suspend(account.id, new Date(until).toISOString(), reason);
        onChanged({
          ...account,
          platformSuspendedUntil: new Date(until).toISOString(),
          platformBanned: false,
        });
      } else if (action === 'ban') {
        await superadmin.ban(account.id, reason);
        onChanged({ ...account, platformBanned: true });
      } else if (action === 'reinstate') {
        await superadmin.reinstate(account.id, reason);
        onChanged({ ...account, platformBanned: false, platformSuspendedUntil: null });
      }
      closeForm();
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not save that.');
    } finally {
      setBusy(false);
    }
  }

  // Suspend needs both a future time and a reason; ban and reinstate need only a reason.
  const canCommit =
    reason.trim() !== '' && (action !== 'suspend' || (until !== '' && new Date(until).getTime() > Date.now()));

  return (
    <li className="superadmin__accountrow">
      <div className="superadmin__accounthead">
        <strong>{account.username}</strong>
        <span className="superadmin__email">{account.email}</span>
        <span className="superadmin__tag">{account.role}</span>
        <span className="superadmin__tag">{account.tier}</span>
        <span className="reqstate">{standingOf(account)}</span>
      </div>

      {action === null ? (
        <div className="superadmin__accountactions">
          <button type="button" className="linkish" onClick={() => setAction('suspend')}>
            Suspend
          </button>
          <button type="button" className="linkish" onClick={() => setAction('ban')}>
            Ban
          </button>
          <button type="button" className="linkish" onClick={() => setAction('reinstate')}>
            Reinstate
          </button>
        </div>
      ) : (
        <div className="superadmin__actionform">
          {action === 'suspend' ? (
            <label>
              Suspend until
              <input type="datetime-local" value={until} onChange={(e) => setUntil(e.target.value)} />
            </label>
          ) : null}
          <label>
            Reason (required)
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} />
          </label>
          {error ? <p className="seat-note seat-note--bad">{error}</p> : null}
          <div className="superadmin__actionbuttons">
            <button type="button" className="primary" disabled={busy || !canCommit} onClick={() => void commit()}>
              {busy ? 'Saving…' : `Confirm ${action}`}
            </button>
            <button type="button" className="linkish" onClick={closeForm}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

/* --- observing ------------------------------------------------------------- */

type Observing = { kind: 'room'; id: string } | { kind: 'match'; id: string } | null;

function ObserveSection() {
  const [rooms, setRooms] = useState<ClientRoom[]>([]);
  const [matches, setMatches] = useState<MatchView[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [observing, setObserving] = useState<Observing>(null);

  const load = useCallback(async () => {
    try {
      const [roomResult, matchResult] = await Promise.all([
        superadmin.roomsOpen(),
        superadmin.matchesOpen(),
      ]);
      setRooms(roomResult.rooms);
      setMatches(matchResult.matches);
      setError(null);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not load open sessions.');
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (observing?.kind === 'room') {
    return <RoomObserver roomId={observing.id} onBack={() => setObserving(null)} />;
  }
  if (observing?.kind === 'match') {
    return <MatchObserver matchId={observing.id} onBack={() => setObserving(null)} />;
  }

  if (!loaded) return <p className="seat-note">Loading…</p>;

  return (
    <div className="superadmin__observe">
      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      <h3>Open rooms</h3>
      {rooms.length === 0 ? (
        <p className="seat-note">Nothing open.</p>
      ) : (
        <ul className="superadmin__list">
          {rooms.map((room) => (
            <li key={room.id}>
              <button type="button" className="roomstep" onClick={() => setObserving({ kind: 'room', id: room.id })}>
                <span className="roomstep__title">{room.scenarioTitle}</span>
                <span className="roomstep__meta">
                  {room.status} · {room.seatsFilled}/{room.seatsTotal} seated · starts{' '}
                  {new Date(room.startsAt).toLocaleString()}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3>Active matches</h3>
      {matches.length === 0 ? (
        <p className="seat-note">Nothing active.</p>
      ) : (
        <ul className="superadmin__list">
          {matches.map((match) => (
            <li key={match.id}>
              <button
                type="button"
                className="roomstep"
                onClick={() => setObserving({ kind: 'match', id: match.id })}
              >
                <span className="roomstep__title">{match.scenarioId}</span>
                <span className="roomstep__meta">
                  {match.status} · turn {match.turn}/{match.maxTurns} · {match.mode}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RoomObserver({ roomId, onBack }: { roomId: string; onBack: () => void }) {
  const [data, setData] = useState<SuperadminRoomObservation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void superadmin
      .observeRoom(roomId)
      .then(setData)
      .catch((caught) =>
        setError(caught instanceof ApiCallError ? caught.error.message : 'Could not load that room.'),
      );
  }, [roomId]);

  return (
    <div className="superadmin__observer">
      <button type="button" className="linkish" onClick={onBack}>
        &larr; Back to the list
      </button>

      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}
      {!data ? (
        error ? null : <p className="seat-note">Loading…</p>
      ) : (
        <>
          <h3>{data.room.scenarioTitle}</h3>
          <p className="seat-note">
            {data.room.status} · {data.readiness.filled}/{data.readiness.total} seated
            {data.readiness.empty.length > 0
              ? ` · empty: ${data.readiness.empty.map(roleLabel).join(', ')}`
              : ''}
          </p>

          <h4>Seating</h4>
          <ul className="superadmin__seating">
            {data.seating.map((seat) => (
              <li key={seat.role}>
                <span className="superadmin__seatrole">{roleLabel(seat.role)}</span>
                <span>{seat.occupant ? seat.occupant.callSign : 'empty'}</span>
              </li>
            ))}
          </ul>

          <h4>Boards</h4>
          {data.boards.length === 0 ? (
            <p className="seat-note">Nobody is seated yet.</p>
          ) : (
            data.boards.map(({ role, board }) => <BoardView key={role} role={role} board={board} />)
          )}
        </>
      )}
    </div>
  );
}

function BoardView({ role, board }: { role: SocRoleId; board: SeatBoard }) {
  return (
    <div className="superadmin__board">
      <p className="superadmin__boardhead">
        {roleLabel(role)} · {board.elapsedSeconds}s elapsed · {board.claimed.length} claimed
      </p>
      {board.events.length === 0 ? (
        <p className="seat-note">No events yet.</p>
      ) : (
        <ul className="superadmin__events">
          {board.events.map((ev) => (
            <li key={ev.id}>
              <span className="superadmin__eventtime">{ev.atSeconds}s</span>
              <span>{ev.summary}</span>
              {ev.claimedSeverity ? (
                <span className="superadmin__tag">{ev.claimedSeverity}</span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MatchObserver({ matchId, onBack }: { matchId: string; onBack: () => void }) {
  const [data, setData] = useState<{ red: MatchView | null; blue: MatchView | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void superadmin
      .observeMatch(matchId)
      .then(setData)
      .catch((caught) =>
        setError(caught instanceof ApiCallError ? caught.error.message : 'Could not load that match.'),
      );
  }, [matchId]);

  return (
    <div className="superadmin__observer">
      <button type="button" className="linkish" onClick={onBack}>
        &larr; Back to the list
      </button>

      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}
      {!data ? (
        error ? null : <p className="seat-note">Loading…</p>
      ) : (
        <div className="superadmin__sides">
          <SideView side="red" view={data.red} />
          <SideView side="blue" view={data.blue} />
        </div>
      )}
    </div>
  );
}

/**
 * One side of a match, as that side's own `matchViewFor` sees it.
 *
 * Their own moves are whole; the opponent's activity is already reduced to
 * what leaked, same rules a real participant sees. Rendering both sides is
 * what gives full oversight without a third redaction shape to maintain.
 */
function SideView({ side, view }: { side: MatchSide; view: MatchView | null }) {
  if (!view) {
    return (
      <div className="superadmin__side">
        <h4>{side}</h4>
        <p className="seat-note">No seat filled.</p>
      </div>
    );
  }

  return (
    <div className="superadmin__side">
      <h4>
        {side} · {view.status} · turn {view.turn}/{view.maxTurns}
        {view.winner ? ` · ${view.winner} won` : ''}
      </h4>
      <p className="seat-note">
        {view.youIdentity ? view.youIdentity.callSign : 'unseated'} vs{' '}
        {view.opponent.present ? (view.opponent.identity?.callSign ?? 'opponent') : 'nobody yet'}
      </p>

      {view.board ? (
        <p className="seat-note">
          board: {view.board.phase} · coverage {view.board.coverageBudget} ·{' '}
          {view.board.targets.length} targets
          {view.board.winner ? ` · ${view.board.winner} won the board` : ''}
        </p>
      ) : null}

      <h5>{side}&rsquo;s moves</h5>
      {view.yourMoves.length === 0 ? (
        <p className="seat-note">No moves yet.</p>
      ) : (
        <ul className="superadmin__moves">
          {view.yourMoves.map((move) => (
            <li key={move.seq}>
              turn {move.turn} · {move.optionId}
              {move.score ? ` · ${move.score.objectivePoints}/${move.score.maxObjective}` : ''}
            </li>
          ))}
        </ul>
      )}

      <h5>Leaked to {side}</h5>
      {view.opponentActivity.length === 0 ? (
        <p className="seat-note">Nothing leaked.</p>
      ) : (
        <ul className="superadmin__moves">
          {view.opponentActivity.map((activity) => (
            <li key={activity.seq}>
              turn {activity.turn} · {activity.signal ? activity.signal.label : 'silent'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
