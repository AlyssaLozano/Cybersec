/**
 * The event centre: a month at a glance, and the things on it.
 *
 * WHY A CALENDAR AND NOT JUST A LIST
 *
 * A list answers "what is next". A month answers "when is this group actually
 * active", which is the question somebody deciding whether to keep coming back
 * is really asking, and it is the question that makes a person schedule the
 * empty Tuesday themselves.
 *
 * Both are on screen, because the list is what you use once you have decided.
 *
 * THE DAY KEYS ARE LOCAL
 *
 * An 8pm Thursday event is Friday in UTC. A calendar that puts it on Friday is
 * wrong for the person reading it, so grouping happens in the viewer's own zone
 * and the wire stays UTC throughout. See groupByLocalDay in @soc/shared.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  EVENT_DESCRIPTION_MAX,
  EVENT_KINDS,
  EVENT_KIND_LABELS,
  LOBBY_DOORS,
  checkEvent,
  groupByLocalDay,
} from '@soc/shared';
import type {
  ChatRoom,
  CommunityEvent,
  EventAudience,
  EventKind,
  FloorIdentity,
} from '@soc/shared';

import { ApiCallError, events as eventsApi, lobby } from '../lib/api';

interface EventCenterProps {
  identity: FloorIdentity;
  /** Chat rooms an event can be shared into. */
  rooms: ChatRoom[];
}

function localDayKey(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

export function EventCenter({ identity, rooms }: EventCenterProps) {
  const [all, setAll] = useState<CommunityEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [kindFilter, setKindFilter] = useState<EventKind | ''>('');

  const load = useCallback(async () => {
    try {
      // The whole horizon in one read: two hundred events is small, and paging
      // a calendar by month means a month change is a network round trip.
      const { events } = await eventsApi.list();
      setAll(events);
      setError(null);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not load events.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => (kindFilter ? all.filter((event) => event.kind === kindFilter) : all),
    [all, kindFilter],
  );

  const byDay = useMemo(() => {
    const map = new Map<string, CommunityEvent[]>();
    for (const day of groupByLocalDay(filtered)) map.set(day.date, day.events);
    return map;
  }, [filtered]);

  const grid = useMemo(() => buildMonthGrid(month), [month]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    return filtered
      .filter((event) => new Date(event.startsAt).getTime() >= now - 60 * 60 * 1000)
      .slice(0, 12);
  }, [filtered]);

  const shown = selectedDay ? (byDay.get(selectedDay) ?? []) : upcoming;

  return (
    <section className="events">
      <header className="events__head">
        <h2 className="lobby__h">Event centre</h2>
        <div className="events__controls">
          <label className="events__filter">
            Kind
            <select
              value={kindFilter}
              onChange={(e) => setKindFilter(e.target.value as EventKind | '')}
            >
              <option value="">everything</option>
              {EVENT_KINDS.map((kind) => (
                <option key={kind} value={kind}>
                  {EVENT_KIND_LABELS[kind]}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="primary" onClick={() => setCreating((on) => !on)}>
            {creating ? 'Close' : 'Post an event'}
          </button>
        </div>
      </header>

      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      {creating ? (
        <CreateEventForm
          rooms={rooms}
          onPosted={async () => {
            setCreating(false);
            await load();
          }}
        />
      ) : null}

      <div className="events__split">
        <div className="calendar">
          <div className="calendar__nav">
            <button
              type="button"
              className="linkish"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            >
              &larr;
            </button>
            <strong>
              {month.toLocaleString([], { month: 'long', year: 'numeric' })}
            </strong>
            <button
              type="button"
              className="linkish"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            >
              &rarr;
            </button>
          </div>

          <div className="calendar__dow" aria-hidden="true">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="calendar__grid">
            {grid.map((cell) => {
              const key = localDayKey(cell.date);
              const dayEvents = byDay.get(key) ?? [];
              const today = key === localDayKey(new Date());
              return (
                <button
                  type="button"
                  key={key}
                  className={[
                    'calendar__cell',
                    cell.inMonth ? '' : 'calendar__cell--outside',
                    today ? 'calendar__cell--today' : '',
                    selectedDay === key ? 'calendar__cell--on' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setSelectedDay(selectedDay === key ? null : key)}
                  aria-label={`${cell.date.toDateString()}, ${dayEvents.length} event(s)`}
                >
                  <span className="calendar__num">{cell.date.getDate()}</span>
                  <span className="calendar__dots">
                    {dayEvents.slice(0, 4).map((event) => (
                      <span
                        key={event.id}
                        className={`calendar__dot calendar__dot--${event.kind}${
                          event.cancelledAt ? ' calendar__dot--off' : ''
                        }`}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="events__list">
          <h3>
            {selectedDay
              ? new Date(`${selectedDay}T12:00:00`).toLocaleDateString([], {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Coming up'}
            {selectedDay ? (
              <button type="button" className="linkish" onClick={() => setSelectedDay(null)}>
                show everything
              </button>
            ) : null}
          </h3>

          {shown.length === 0 ? (
            <p className="seat-note">
              {selectedDay
                ? 'Nothing on this day. It is yours if you want it.'
                : 'Nothing scheduled. Post the thing you wish somebody else had posted.'}
            </p>
          ) : null}

          <ul className="eventlist">
            {shown.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                identity={identity}
                rooms={rooms}
                onChanged={(updated) =>
                  setAll((current) =>
                    current.map((entry) => (entry.id === updated.id ? updated : entry)),
                  )
                }
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function EventCard({
  event,
  identity,
  rooms,
  onChanged,
}: {
  event: CommunityEvent;
  identity: FloorIdentity;
  rooms: ChatRoom[];
  onChanged: (event: CommunityEvent) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sharedTo, setSharedTo] = useState<string | null>(null);

  const cancelled = event.cancelledAt !== null;
  const full = event.capacity !== null && event.goingCount >= event.capacity;

  async function answer(status: 'going' | 'interested') {
    setBusy(true);
    setError(null);
    try {
      const result =
        event.myRsvp === status
          ? await eventsApi.withdraw(event.id)
          : await eventsApi.rsvp(event.id, status);
      onChanged(result.event);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not save that.');
    } finally {
      setBusy(false);
    }
  }

  async function share(roomId: string) {
    setBusy(true);
    try {
      await lobby.say(roomId, `Sharing this: ${event.title}`, event.id);
      setSharedTo(roomId);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not share that.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className={`eventcard eventcard--${event.kind}${cancelled ? ' eventcard--off' : ''}`}>
      <div className="eventcard__when">
        <span className="eventcard__date">
          {new Date(event.startsAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
        </span>
        <span className="eventcard__time">
          {new Date(event.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div className="eventcard__body">
        <h4>
          {event.title}
          <span className="eventcard__kind">{EVENT_KIND_LABELS[event.kind]}</span>
          {cancelled ? <span className="eventcard__cancelled">cancelled</span> : null}
        </h4>
        <p className="eventcard__desc">{event.description}</p>
        <p className="eventcard__meta">
          {event.durationMinutes} min &middot; hosted by {event.host.callSign} &middot;{' '}
          {event.goingCount} going
          {event.interestedCount > 0 ? `, ${event.interestedCount} interested` : ''}
          {event.capacity !== null ? ` of ${event.capacity}` : ''}
          {event.audience !== 'all'
            ? ` · ${LOBBY_DOORS.find((door) => door.id === event.audience)?.title ?? event.audience}`
            : ''}
        </p>

        {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

        {!cancelled ? (
          <div className="eventcard__actions">
            <button
              type="button"
              className={event.myRsvp === 'going' ? 'primary is-on' : 'primary'}
              disabled={busy || (full && event.myRsvp !== 'going')}
              onClick={() => void answer('going')}
            >
              {event.myRsvp === 'going' ? 'Going' : full ? 'Full' : 'I am going'}
            </button>
            <button
              type="button"
              className={event.myRsvp === 'interested' ? 'linkish is-on' : 'linkish'}
              disabled={busy}
              onClick={() => void answer('interested')}
            >
              {event.myRsvp === 'interested' ? 'Interested' : 'Maybe'}
            </button>

            {/* Sharing puts a card in a public room, so the room is chosen
                explicitly rather than defaulted to the main hall. */}
            {rooms.length > 0 ? (
              <label className="eventcard__share">
                Share to
                <select
                  value={sharedTo ?? ''}
                  disabled={busy}
                  onChange={(e) => e.target.value && void share(e.target.value)}
                >
                  <option value="">choose a room…</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.title}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            {event.host.userId === identity.userId ? (
              <button
                type="button"
                className="linkish"
                disabled={busy}
                onClick={() => {
                  setBusy(true);
                  void eventsApi
                    .cancel(event.id)
                    .then((result) => onChanged(result.event))
                    .catch(() => setError('Could not cancel that.'))
                    .finally(() => setBusy(false));
                }}
              >
                Cancel it
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
}

function CreateEventForm({
  rooms: _rooms,
  onPosted,
}: {
  rooms: ChatRoom[];
  onPosted: () => void | Promise<void>;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [kind, setKind] = useState<EventKind>('study-group');
  const [audience, setAudience] = useState<EventAudience>('all');
  const [startsAt, setStartsAt] = useState('');
  const [durationMinutes, setDuration] = useState(60);
  const [capacity, setCapacity] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Checked here for instant feedback and again on the server, which owns the
  // clock. The client's idea of "now" is not evidence of anything.
  const local = startsAt
    ? checkEvent(
        {
          title,
          description,
          startsAt: new Date(startsAt).toISOString(),
          durationMinutes,
          capacity: capacity ? Number(capacity) : null,
        },
        new Date(),
      )
    : { ok: false, problem: null };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await eventsApi.create({
        title,
        description,
        kind,
        audience,
        // The input is local time; the wire is always UTC.
        startsAt: new Date(startsAt).toISOString(),
        durationMinutes,
        roomId: null,
        capacity: capacity ? Number(capacity) : null,
      });
      await onPosted();
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not post that.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="eventform" onSubmit={(e) => void submit(e)}>
      <h3>Post an event</h3>
      <p className="lobby__hint">
        Anything you want other people at: a study hour, a walkthrough, mock interviews, or a war
        room you want filled. Say where to meet in the description. There is no link field, on
        purpose.
      </p>

      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={70} required />
      </label>

      <div className="eventform__row">
        <label>
          Kind
          <select value={kind} onChange={(e) => setKind(e.target.value as EventKind)}>
            {EVENT_KINDS.map((entry) => (
              <option key={entry} value={entry}>
                {EVENT_KIND_LABELS[entry]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Who for
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as EventAudience)}
          >
            <option value="all">everybody</option>
            {LOBBY_DOORS.map((door) => (
              <option key={door.id} value={door.id}>
                {door.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="eventform__row">
        <label>
          Starts
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
          />
        </label>

        <label>
          Minutes
          <input
            type="number"
            min={15}
            max={480}
            step={15}
            value={durationMinutes}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </label>

        <label>
          Cap (optional)
          <input
            type="number"
            min={2}
            max={200}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="no limit"
          />
        </label>
      </div>

      <label>
        What will happen, and where to meet
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={EVENT_DESCRIPTION_MAX}
          rows={4}
          required
        />
      </label>

      {startsAt && !local.ok && local.problem ? (
        <p className="seat-note seat-note--bad">{local.problem}</p>
      ) : null}
      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      <button type="submit" className="primary" disabled={busy || !local.ok}>
        {busy ? 'Posting…' : 'Put it on the calendar'}
      </button>
    </form>
  );
}

interface MonthCell {
  date: Date;
  inMonth: boolean;
}

/**
 * Six weeks starting on the Monday on or before the first of the month.
 *
 * Always six rows, so the grid does not change height as somebody pages through
 * months and the layout stops jumping under the cursor.
 */
function buildMonthGrid(month: Date): MonthCell[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  // getDay() is 0 for Sunday; the grid starts on Monday.
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(first.getFullYear(), first.getMonth(), 1 - offset);

  const cells: MonthCell[] = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    cells.push({ date, inMonth: date.getMonth() === month.getMonth() });
  }
  return cells;
}
