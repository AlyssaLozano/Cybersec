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

import { SOC_ROLES } from '@soc/shared';
import type { SocRoleId } from '@soc/shared';

import { ApiCallError, rooms } from '../lib/api';
import type {
  AfterActionView,
  ClaimScoreView,
  RoomDetail,
  SeatBoard,
  SeatView,
} from '../lib/api';
import { WatchFloor } from './WatchFloor';
import { ReportPanel } from './ReportPanel';
import { DoorOutside, RoomDoor } from './RoomDoor';
import type { ReportablePerson } from './ReportPanel';
import type { DoorView } from '../lib/api';

interface Props {
  roomId: string;
  joinCode?: string | null;
  onLeave?: () => void;
}

/** The seat's proper title, so a picker says "Log Analyst" and not "log-analyst". */
function roleLabel(role: SocRoleId): string {
  return SOC_ROLES.find((r) => r.id === role)?.title ?? role;
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
  const [readingOut, setReadingOut] = useState(false);
  const [standIns, setStandIns] = useState<
    { eventId: string; role: SocRoleId; dueAtSeconds: number; text: string }[]
  >([]);
  const [reporting, setReporting] = useState(false);
  /*
   * The door, carried on the same fetch as the seat chart so a knock appears
   * on the floor without a second poll. Null until the first load.
   */
  const [door, setDoor] = useState<DoorView | null>(null);

  const mine: SocRoleId | null = useMemo(
    () =>
      detail?.seating.find((s) => s.occupant?.userId === detail.identity?.userId)?.role ?? null,
    [detail],
  );
  const running = detail?.room.status === 'running';

  /*
   * Everybody in a chair except the viewer.
   *
   * Built from the seating chart rather than from a roster, so it holds only
   * people who are actually here: reporting somebody who has already left is a
   * report about a room they are not in, and the server refuses it anyway.
   */
  const others: ReportablePerson[] = useMemo(
    () =>
      (detail?.seating ?? [])
        .filter((s) => s.occupant && s.occupant.userId !== detail?.identity?.userId)
        .map((s) => ({
          userId: s.occupant!.userId,
          callSign: s.occupant!.callSign,
          where: roleLabel(s.role),
        })),
    [detail],
  );

  const loadChart = useCallback(async () => {
    try {
      const next = await rooms.get(roomId, joinCode);
      setDetail(next);
      setDoor(next.door);
      setError(null);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not load the room.');
    } finally {
      setLoading(false);
    }
  }, [roomId, joinCode]);

  /** Leave, keeping the chair. The floor sees the seat as away, not open. */
  const stepOut = useCallback(async () => {
    setBusy(true);
    try {
      const next = await rooms.stepOut(roomId);
      setDoor(next.door);
      await loadChart();
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not step out.');
    } finally {
      setBusy(false);
    }
  }, [roomId, loadChart]);

  /** Come back. Refused while the shift runs until the room has admitted you. */
  const stepIn = useCallback(async () => {
    setBusy(true);
    try {
      const next = await rooms.stepIn(roomId);
      setDoor(next.door);
      await loadChart();
      setError(null);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not come back in.');
    } finally {
      setBusy(false);
    }
  }, [roomId, loadChart]);

  const loadBoard = useCallback(async () => {
    try {
      const next = await rooms.board(roomId);
      setBoard(next.board);
      setStandIns(next.standIns ?? []);
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

  async function close(readout: { findings: string[]; mitigations: string[] }) {
    setBusy(true);
    try {
      await rooms.close(roomId, readout);
      setReadingOut(false);
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

  if (readingOut) {
    return <ReadoutForm busy={busy} onCancel={() => setReadingOut(false)} onSubmit={close} />;
  }
  if (room.status === 'complete') {
    return <ReviewPane roomId={roomId} onLeave={onLeave} />;
  }

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
              standIns={standIns}
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
              <button type="button" onClick={() => setReadingOut(true)} disabled={busy}>
                Close the shift and read out
              </button>
            ) : null}
            {onLeave ? (
              <button type="button" className="quiet" onClick={onLeave}>
                Back to the rooms
              </button>
            ) : null}
            {/*
              Quiet, and last. Somebody who needs it will find it; a red flag
              on every chair invites pressing, and a report control that looks
              like a game mechanic gets used like one.
            */}
            <button type="button" className="quiet" onClick={() => setReporting(true)}>
              Report somebody
            </button>
            {/*
              Stepping out keeps the chair. Somebody who has to take a call in
              the middle of an incident should not have to choose between the
              call and their seat.
            */}
            {door?.mine.seated && !door.mine.steppedOut ? (
              <button
                type="button"
                className="quiet"
                disabled={busy}
                onClick={() => void stepOut()}
              >
                Step out
              </button>
            ) : null}
            {door?.mine.steppedOut ? (
              <button
                type="button"
                className="primary"
                disabled={busy}
                onClick={() => void stepIn()}
              >
                Come back in
              </button>
            ) : null}
          </div>

          {door ? (
            <>
              <RoomDoor roomId={roomId} door={door} onChanged={setDoor} />
              <DoorOutside roomId={roomId} door={door} onChanged={setDoor} />
            </>
          ) : null}

          {reporting ? (
            <ReportPanel
              space="soc-floor"
              roomId={roomId}
              people={others}
              onClose={() => setReporting(false)}
            />
          ) : null}
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
  standIns,
}: {
  roomId: string;
  seat: SeatView;
  board: SeatBoard | null;
  running: boolean;
  openEvent: string | null;
  onOpen: (id: string | null) => void;
  onClaimed: (board: SeatBoard) => void;
  standIns: { eventId: string; role: SocRoleId; dueAtSeconds: number; text: string }[];
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
        <>
          {/* The lead reads these out. It is what makes a short floor whole
              rather than diminished: the empty chair's finding still lands, on
              the schedule it would have landed. */}
          {standIns.length > 0 ? (
            <div className="standins">
              <h4>Read these out</h4>
              {standIns.map((s) => (
                <p key={s.eventId} className="standin">
                  <span className="standin__at">{mmss(s.dueAtSeconds)}</span>
                  <strong>{s.role}</strong> {s.text}
                </p>
              ))}
            </div>
          ) : null}
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
                    <ClaimForm
                      roomId={roomId}
                      eventId={event.id}
                      role={seat.role}
                      actions={board?.actions ?? []}
                      escalateTo={board?.escalateTo ?? []}
                      onClaimed={onClaimed}
                    />
                  )}
                </div>
              ) : null}
            </li>
          ))}
          {board && board.events.length === 0 ? (
            <li className="seat-note">Nothing on your surfaces yet. It will come.</li>
          ) : null}
        </ul>
        </>
      )}
    </div>
  );
}

/** Commit a claim. The score comes back with it, and not before. */
function ClaimForm({
  roomId,
  eventId,
  role,
  actions,
  escalateTo,
  onClaimed,
}: {
  roomId: string;
  eventId: string;
  role: SocRoleId;
  actions: { id: string; label: string; forRoles: SocRoleId[] }[];
  escalateTo: SocRoleId[];
  onClaimed: (board: SeatBoard) => void;
}) {
  const [disposition, setDisposition] = useState<'escalate' | 'investigate' | 'dismiss' | 'tune'>(
    'investigate',
  );
  const [reasoning, setReasoning] = useState('');
  const [confidence, setConfidence] = useState(60);
  const [chosen, setChosen] = useState<string[]>([]);
  const [handTo, setHandTo] = useState<string>('');
  const [aid, setAid] = useState<{ options: { command: string }[]; nudge: string | null } | null>(
    null,
  );
  const [score, setScore] = useState<ClaimScoreView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /*
   * The terminal aid, which is the whole of what makes one tier easier than
   * another. At beginner it is a list of commands to choose between; higher up
   * it thins to a nudge and then to nothing. Fetched per event because that is
   * the granularity the server decides it at.
   */
  useEffect(() => {
    let live = true;
    void rooms
      .aid(roomId, eventId)
      .then((r) => {
        if (live) setAid({ options: r.aid?.options ?? [], nudge: r.nudge ?? r.aid?.nudge ?? null });
      })
      .catch(() => {
        // No aid at this tier is the normal case, not a failure.
      });
    return () => {
      live = false;
    };
  }, [roomId, eventId]);

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
            actionIds: chosen,
            escalateTo: handTo || null,
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
      {aid && aid.options.length > 0 ? (
        <div className="claimform__aid">
          <span className="claimform__aidhead">How would you check this?</span>
          {/* More than one of these can be right. The scoring says so, and a
              menu that implies one answer teaches guessing the author's
              syntax rather than investigating. */}
          {aid.options.map((o) => (
            <code key={o.command}>{o.command}</code>
          ))}
        </div>
      ) : null}
      {aid?.nudge ? <p className="claimform__nudge">{aid.nudge}</p> : null}

      <textarea
        value={reasoning}
        onChange={(e) => setReasoning(e.target.value)}
        placeholder="Why. The review reads this back to you."
        rows={3}
      />

      <fieldset className="claimform__actions">
        <legend>What do you do about it?</legend>
        {actions.map((a) => {
          const inLane = a.forRoles.length === 0 || a.forRoles.includes(role);
          return (
            <label
              key={a.id}
              className={`chip${chosen.includes(a.id) ? ' chip--on' : ''}${inLane ? '' : ' chip--outlane'}`}
              title={inLane ? undefined : 'Out of lane for this seat. You can still take it.'}
            >
              <input
                type="checkbox"
                checked={chosen.includes(a.id)}
                onChange={() =>
                  setChosen((prev) =>
                    prev.includes(a.id) ? prev.filter((x) => x !== a.id) : [...prev, a.id],
                  )
                }
              />
              {a.label}
            </label>
          );
        })}
      </fieldset>

      <label className="claimform__hand">
        Hand it to
        <select value={handTo} onChange={(e) => setHandTo(e.target.value)}>
          {/* Stopping here is a real answer and is sometimes the right one, so
              it is the default rather than a thing you have to find. */}
          <option value="">Nobody. This stops with me.</option>
          {escalateTo.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
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

/**
 * The lead's readout.
 *
 * Taken before the review is shown, and that ordering is the whole point. What
 * the floor believed at the moment it stopped is the thing being reviewed, and
 * a readout written with the answer key open is a transcription of it. The form
 * says so, because somebody who does not know that will assume the delay is
 * bureaucracy.
 */
function ReadoutForm({
  busy,
  onCancel,
  onSubmit,
}: {
  busy: boolean;
  onCancel: () => void;
  onSubmit: (readout: { findings: string[]; mitigations: string[] }) => void;
}) {
  const [findings, setFindings] = useState('');
  const [mitigations, setMitigations] = useState('');

  return (
    <section className="readout">
      <h2>Read out the findings</h2>
      <p className="readout__why">
        Say what you found and what you would do about it, in your own words, before anything is
        marked. The review compares this against what actually happened, so it is only worth
        something if you write it first. Not settling something is a finding: say that too.
      </p>

      <label>
        What we found
        <textarea
          rows={6}
          value={findings}
          onChange={(e) => setFindings(e.target.value)}
          placeholder={'One per line.\nWhat happened, how far it got, and what you could not establish.'}
        />
      </label>

      <label>
        What we would do about it
        <textarea
          rows={4}
          value={mitigations}
          onChange={(e) => setMitigations(e.target.value)}
          placeholder={'One per line. What you would change, and what you are deliberately leaving undone.'}
        />
      </label>

      <div className="readout__actions">
        <button
          type="button"
          className="primary"
          disabled={busy || findings.trim().length === 0}
          onClick={() =>
            onSubmit({ findings: lines(findings), mitigations: lines(mitigations) })
          }
        >
          Close the shift
        </button>
        <button type="button" className="quiet" onClick={onCancel} disabled={busy}>
          Back to the floor
        </button>
      </div>
    </section>
  );
}

/**
 * The after action review.
 *
 * Ordered deliberately: what the floor said, then what actually happened, then
 * the critical findings, then how it should have gone. Putting the answer first
 * turns the readout into something to be embarrassed about rather than
 * something to compare against.
 */
function ReviewPane({ roomId, onLeave }: { roomId: string; onLeave?: () => void }) {
  const [review, setReview] = useState<AfterActionView | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void rooms
      .review(roomId)
      .then((r) => setReview(r.review))
      .catch((caught) =>
        setError(caught instanceof ApiCallError ? caught.error.message : 'Review unavailable.'),
      );
  }, [roomId]);

  if (error) return <p className="seat-note seat-note--bad">{error}</p>;
  if (!review) return <p className="seat-note">Building the review…</p>;

  return (
    <section className="review">
      <h2>After action review</h2>
      <p className="review__summary">{review.summary}</p>

      <div className="review__timings">
        {(
          [
            ['Detect', review.timings.detectSeconds],
            ['Analyse', review.timings.analyseSeconds],
            ['Correct', review.timings.correctSeconds],
          ] as const
        ).map(([label, value]) => (
          <div key={label}>
            <strong>{value == null ? '—' : mmss(value)}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* The critical findings are never averaged into the summary. Catching
          nine of ten events and missing the one that mattered is not ninety
          per cent of a response. */}
      {review.criticalFindings.length > 0 ? (
        <>
          <h3>The findings that decided it</h3>
          <ul className="review__critical">
            {review.criticalFindings.map((c) => (
              <li key={c.eventId} className={c.caught ? 'caught' : 'missed'}>
                <span>{c.caught ? 'caught' : 'missed'}</span> {c.what}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <h3>What you said</h3>
      <ul className="review__list">
        {review.readout.findings.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      {review.readout.missingReports.length > 0 ? (
        <p className="seat-note">
          Chairs nobody filled: {review.readout.missingReports.join(', ')}. The lead read those
          out.
        </p>
      ) : null}

      <h3>What actually happened</h3>
      <ul className="review__list">
        {review.whatHappened.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      {review.improvements.length > 0 ? (
        <>
          <h3>What to do differently</h3>
          <ul className="review__list">
            {review.improvements.map((i) => (
              <li key={i.observed}>
                <strong>{i.observed}</strong> {i.instead}
                {i.forRoles.length > 0 ? (
                  <span className="review__forroles"> ({i.forRoles.join(', ')})</span>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <h3>How it should have gone</h3>
      <ol className="review__ideal">
        {review.ideal.map((step) => (
          <li key={step.eventId} className={`ideal ideal--${step.actual}`}>
            <span className="review__at">{mmss(step.atSeconds)}</span>
            <strong>{step.owner}</strong>
            <span className={`ideal__got ideal__got--${step.actual}`}>
              {step.actual === 'late' && step.afterSeconds != null
                ? `late by ${mmss(step.afterSeconds - step.atSeconds)}`
                : step.actual}
            </span>
            {/* Plural on purpose. Several commands often reach one finding, and
                printing a single one as THE answer tells somebody who took
                another working route that they were wrong. */}
            <span className="review__move">
              {step.move}
              {step.alsoWorks ? ' (more than one route worked here)' : ''}
            </span>
            <p>{step.what}</p>
          </li>
        ))}
      </ol>

      {onLeave ? (
        <button type="button" className="quiet" onClick={onLeave}>
          Back to the rooms
        </button>
      ) : null}
    </section>
  );
}

/** Blank lines are not findings. */
function lines(raw: string): string[] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}
