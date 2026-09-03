/**
 * The war room: the watch floor, the seat you are in, and the shift running on
 * it.
 *
 * WHAT THIS REPLACED
 *
 * A seating chart that ended where the exercise began. You could pick a
 * scenario, schedule a room, take a chair, and then nothing happened, because
 * no route existed to start one. This is the same room with the run loop
 * behind it, and the floor drawn instead of listed.
 *
 * THE FLOOR IS THE ROOM
 *
 * Not an illustration above a list of controls. The chairs on it are the
 * chairs you take, the desk you are sitting at is highlighted, and while the
 * shift runs the screen beside it is that seat's own board and nobody else's.
 * The projection happens on the server, so what arrives here is already only
 * what this seat can see.
 *
 * WHY IT POLLS
 *
 * Two different clocks: the seating chart, because somebody staring at it is
 * waiting for people to arrive, and the board, because events land on a fixed
 * schedule the server computes from elapsed time. Neither needs a socket, and
 * a scenario measured in minutes does not notice the difference.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import type { SocRoleId } from '@soc/shared';

import { ApiCallError, rooms } from '../lib/api';
import type { ClaimScoreView, RoomDetail, SeatBoard, SeatView } from '../lib/api';
import { WatchFloor } from './WatchFloor';

interface Props {
  roomId: string;
  joinCode?: string | null;
  onLeave?: () => void;
}

export function WatchRoom({ roomId, joinCode = null, onLeave }: Props) {
  const [detail, setDetail] = useState<RoomDetail | null>(null);
  const [board, setBoard] = useState<SeatBoard | null>(null);
  const [gates, setGates] = useState<{ canStart: boolean; canClose: boolean; why: string | null }>({
    canStart: false,
    canClose: false,
    why: null,
  });
  const [openEvent, setOpenEvent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const mine: SocRoleId | null = useMemo(
    () =>
      detail?.seating.find((s) => s.occupant?.userId === detail.identity?.userId)?.role ?? null,
    [detail],
  );
  const running = detail?.room.status === 'running';

  const loadChart = useCallback(async () => {
    try {
      setDetail(await rooms.get(roomId, joinCode));
      setError(null);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not load the room.');
    } finally {
      setLoading(false);
    }
  }, [roomId, joinCode]);

  const loadBoard = useCallback(async () => {
    try {
      const next = await rooms.board(roomId);
      setBoard(next.board);
      setGates({
        canStart: next.canStart.ok,
        canClose: next.canClose.ok,
        why: next.canStart.ok ? null : (next.canStart.reason ?? null),
      });
    } catch {
      // A board fetch fails for exactly one ordinary reason: this person is not
      // in a seat yet. That is not an error worth showing over the chart.
    }
  }, [roomId]);

  useEffect(() => {
    void loadChart();
    const timer = window.setInterval(() => void loadChart(), 5000);
    return () => window.clearInterval(timer);
  }, [loadChart]);

  useEffect(() => {
    if (!mine) return;
    void loadBoard();
    // Faster than the chart: once the shift is live this is the thing somebody
    // is actually watching, and an event that arrives five seconds late in a
    // sixty second window is a different exercise.
    const timer = window.setInterval(() => void loadBoard(), running ? 3000 : 8000);
    return () => window.clearInterval(timer);
  }, [mine, running, loadBoard]);

  async function pick(role: SocRoleId) {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const next = await rooms.takeSeat(roomId, role, joinCode);
      setDetail((prev) => (prev ? { ...prev, ...next } : prev));
      void loadBoard();
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not take that seat.');
    } finally {
      setBusy(false);
    }
  }

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const next = await rooms.start(roomId);
      setBoard(next.board);
      await loadChart();
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not start the shift.');
    } finally {
      setBusy(false);
    }
  }

  async function close() {
    setBusy(true);
    try {
      await rooms.close(roomId);
      await loadChart();
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not close the shift.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="seat-note">Loading the floor…</p>;
  if (!detail) return <p className="seat-note seat-note--bad">{error ?? 'Room unavailable.'}</p>;

  const { room, seating, readiness } = detail;
  const seat = seating.find((s) => s.role === mine) ?? null;

  return (
    <section className="watchroom">
      <header className="watchroom__head">
        <div>
          <h2>{room.scenarioTitle}</h2>
          <p className="watchroom__meta">
            {room.difficulty} · {new Date(room.startsAt).toLocaleString()} ·{' '}
            {room.visibility === 'closed' ? 'closed room' : 'open room'} ·{' '}
            {statusWord(room.status)}
          </p>
        </div>
        <div className="watchroom__clock">
          {running && board ? (
            <>
              <strong>{mmss(board.elapsedSeconds)}</strong>
              <span>on shift</span>
            </>
          ) : (
            <>
              <strong>
                {readiness.filled}/{readiness.total}
              </strong>
              <span>seats filled</span>
            </>
          )}
        </div>
      </header>

      {room.isHost && room.joinCode ? (
        <p className="seat-note">
          Join code <code>{room.joinCode}</code>. Anyone with it can take a seat.
        </p>
      ) : null}
      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      <div className="watchroom__split">
        <div className="watchroom__floor">
          <WatchFloor seating={seating} mine={mine} onPick={pick} />
          <p className="watchroom__scope">
            This incident runs {seating.length} seats. Roles it does not use are not on this floor.
          </p>
        </div>

        <aside className="watchroom__screen">
          {seat ? (
            <SeatScreen
              roomId={roomId}
              seat={seat}
              board={board}
              running={Boolean(running)}
              openEvent={openEvent}
              onOpen={setOpenEvent}
              onClaimed={(next) => setBoard(next)}
            />
          ) : (
            <div className="screen screen--empty">
              <h3>Pick a chair</h3>
              <p>
                Every seat sees a different part of this incident. Nobody sees all of it, which is
                why there is more than one of you.
              </p>
              {readiness.notes.map((note) => (
                <p key={note} className="seat-note">
                  {note}
                </p>
              ))}
            </div>
          )}

          <div className="watchroom__controls">
            {!running && gates.canStart ? (
              <button type="button" className="primary" onClick={() => void start()} disabled={busy}>
                Start the shift
              </button>
            ) : null}
            {!running && !gates.canStart && gates.why ? (
              <p className="seat-note">{gates.why}</p>
            ) : null}
            {running && gates.canClose ? (
              <button type="button" onClick={() => void close()} disabled={busy}>
                Close the shift and read out
              </button>
            ) : null}
            {onLeave ? (
              <button type="button" className="quiet" onClick={onLeave}>
                Back to the lobby
              </button>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}

/**
 * The screen at this desk.
 *
 * Before the shift it is the brief, which is readable while waiting. Once it
 * runs it is the events that have arrived on this seat's surfaces and nothing
 * else, because the server has already decided what that is.
 */
function SeatScreen({
  roomId,
  seat,
  board,
  running,
  openEvent,
  onOpen,
  onClaimed,
}: {
  roomId: string;
  seat: SeatView;
  board: SeatBoard | null;
  running: boolean;
  openEvent: string | null;
  onOpen: (id: string | null) => void;
  onClaimed: (board: SeatBoard) => void;
}) {
  const brief = board?.briefing;
  const claimed = new Set(board?.claimed ?? []);

  return (
    <div className="screen">
      <h3 className="screen__title">{brief?.title ?? seat.role}</h3>
      {brief ? <p className="screen__remit">{brief.remit}</p> : null}

      {!running ? (
        <>
          <h4>What you can see</h4>
          <ul className="screen__list">
            {(brief?.sees ?? []).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <h4>Watch for</h4>
          <ul className="screen__list">
            {(brief?.watchFor ?? []).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="seat-note">The board fills once the lead starts the shift.</p>
        </>
      ) : (
        <ul className="screen__events">
          {(board?.events ?? []).map((event) => (
            <li
              key={event.id}
              className={`ev${claimed.has(event.id) ? ' ev--claimed' : ''}${openEvent === event.id ? ' ev--open' : ''}`}
            >
              <button
                type="button"
                className="ev__head"
                onClick={() => onOpen(openEvent === event.id ? null : event.id)}
              >
                <span className="ev__time">{mmss(event.atSeconds)}</span>
                <span className="ev__surface">{event.surface}</span>
                <span className="ev__summary">{event.summary}</span>
                {claimed.has(event.id) ? <span className="ev__done">claimed</span> : null}
              </button>
              {openEvent === event.id ? (
                <div className="ev__body">
                  <p>{event.detail}</p>
                  {claimed.has(event.id) ? (
                    <p className="seat-note">You have claimed this. A claim is final.</p>
                  ) : (
                    <ClaimForm roomId={roomId} eventId={event.id} onClaimed={onClaimed} />
                  )}
                </div>
              ) : null}
            </li>
          ))}
          {board && board.events.length === 0 ? (
            <li className="seat-note">Nothing on your surfaces yet. It will come.</li>
          ) : null}
        </ul>
      )}
    </div>
  );
}

/** Commit a claim. The score comes back with it, and not before. */
function ClaimForm({
  roomId,
  eventId,
  onClaimed,
}: {
  roomId: string;
  eventId: string;
  onClaimed: (board: SeatBoard) => void;
}) {
  const [disposition, setDisposition] = useState<'escalate' | 'investigate' | 'dismiss' | 'tune'>(
    'investigate',
  );
  const [reasoning, setReasoning] = useState('');
  const [confidence, setConfidence] = useState(60);
  const [score, setScore] = useState<ClaimScoreView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (score) {
    return (
      <div className="claimscore">
        <p className="claimscore__total">
          {score.total} / {score.outOf}
        </p>
        {score.lines.map((line) => (
          <p key={line.label} className="claimscore__line">
            <strong>{line.label}</strong> {line.points}/{line.outOf}
            {line.notes.length ? ` — ${line.notes.join(' ')}` : ''}
          </p>
        ))}
        {score.laneViolation ? (
          <p className="seat-note seat-note--bad">
            That was the {score.laneViolation} seat's to take first.
          </p>
        ) : null}
        <p className="claimscore__why">{score.why}</p>
      </div>
    );
  }

  return (
    <form
      className="claimform"
      onSubmit={(e) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        setError(null);
        void rooms
          .claim(roomId, {
            eventId,
            disposition,
            reasoning,
            actionIds: [],
            escalateTo: null,
            confidence,
          })
          .then((res) => {
            setScore(res.score);
            onClaimed(res.board);
          })
          .catch((caught) =>
            setError(
              caught instanceof ApiCallError ? caught.error.message : 'Could not commit that.',
            ),
          )
          .finally(() => setBusy(false));
      }}
    >
      <div className="claimform__row">
        {(['escalate', 'investigate', 'dismiss', 'tune'] as const).map((d) => (
          <label key={d} className={disposition === d ? 'chip chip--on' : 'chip'}>
            <input
              type="radio"
              name={`disp-${eventId}`}
              checked={disposition === d}
              onChange={() => setDisposition(d)}
            />
            {d}
          </label>
        ))}
      </div>
      <textarea
        value={reasoning}
        onChange={(e) => setReasoning(e.target.value)}
        placeholder="Why. The review reads this back to you."
        rows={3}
      />
      <label className="claimform__conf">
        Confidence {confidence}%
        <input
          type="range"
          min={0}
          max={100}
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
        />
      </label>
      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}
      <button type="submit" className="primary" disabled={busy}>
        Commit claim
      </button>
    </form>
  );
}

function mmss(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function statusWord(status: string): string {
  if (status === 'running') return 'live';
  if (status === 'complete') return 'closed';
  if (status === 'cancelled') return 'cancelled';
  return 'not started';
}
