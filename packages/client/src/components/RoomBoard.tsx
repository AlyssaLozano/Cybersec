/**
 * Finding a war room, scheduling one, and picking up a call sign on the way in.
 *
 * WHY THE CALL SIGN IS ASKED FOR HERE AND NOT AT SIGNUP
 *
 * Somebody registering for a training platform has not yet seen a floor, does
 * not know what a call sign is for, and will either skip it or pick something
 * they immediately want to change. Asked at the door of the first room, with
 * the floor visible behind it, the question explains itself.
 *
 * WHY THE SCENARIO PICKER SHOWS SEAT COUNTS
 *
 * The number of chairs is the most useful thing about a scenario when you are
 * deciding whether to schedule it. Six seats and three friends is a session;
 * eleven seats and three friends is one person reading eight stand-ins aloud.
 * The count comes from the scenario's own role list, which is the same list the
 * room will be built from, so what somebody sees here is what they will get.
 */

import { useCallback, useEffect, useState } from 'react';

import { ApiCallError, rooms } from '../lib/api';
import type { ClientRoom, RoomScenarioSummary } from '../lib/api';
import { SCENARIO_DIFFICULTIES } from '@soc/shared';
import type { FloorIdentity, RoomVisibility, ScenarioDifficulty } from '@soc/shared';

import { IdentityForm } from './IdentityForm';
import { SeatPicker } from './SeatPicker';

type Pane = 'list' | 'create';

export function RoomBoard() {
  const [identity, setIdentity] = useState<FloorIdentity | null>(null);
  const [identityKnown, setIdentityKnown] = useState(false);
  const [list, setList] = useState<ClientRoom[]>([]);
  const [scenarios, setScenarios] = useState<RoomScenarioSummary[]>([]);
  const [pane, setPane] = useState<Pane>('list');
  const [openRoom, setOpenRoom] = useState<{ id: string; code: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [{ rooms: found }, scen] = await Promise.all([rooms.list(), rooms.scenarios()]);
      setList(found);
      setScenarios(scen);
      setError(null);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not load rooms.');
    }
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        setIdentity((await rooms.identity()).identity);
      } finally {
        setIdentityKnown(true);
      }
      await refresh();
    })();
  }, [refresh]);

  if (!identityKnown) return <p className="seat-note">Loading…</p>;

  // The gate is deliberate: nothing on a floor works without a name people can
  // say out loud, so the question is asked once and never again.
  if (!identity) return <IdentityForm onChosen={setIdentity} />;

  if (openRoom) {
    return (
      <div className="roomboard">
        <button type="button" className="linkish" onClick={() => setOpenRoom(null)}>
          ← All rooms
        </button>
        <SeatPicker roomId={openRoom.id} joinCode={openRoom.code} />
      </div>
    );
  }

  return (
    <div className="roomboard">
      <header className="roomboard__head">
        <div>
          <h1>War rooms</h1>
          <p className="roomboard__meta">
            On the floor as <strong>{identity.callSign}</strong>
          </p>
        </div>
        <div className="roomboard__tabs">
          <button
            type="button"
            className={pane === 'list' ? 'is-on' : ''}
            onClick={() => setPane('list')}
          >
            Join
          </button>
          <button
            type="button"
            className={pane === 'create' ? 'is-on' : ''}
            onClick={() => setPane('create')}
          >
            Schedule
          </button>
        </div>
      </header>

      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      {pane === 'create' ? (
        <CreateForm
          scenarios={scenarios}
          onCreated={async (room) => {
            await refresh();
            setPane('list');
            setOpenRoom({ id: room.id, code: room.joinCode });
          }}
        />
      ) : (
        <RoomList rooms={list} onOpen={(room) => setOpenRoom({ id: room.id, code: null })} />
      )}

      <JoinByCode onOpen={(id, code) => setOpenRoom({ id, code })} />
    </div>
  );
}

function RoomList({ rooms: found, onOpen }: { rooms: ClientRoom[]; onOpen: (r: ClientRoom) => void }) {
  if (found.length === 0) {
    return (
      <p className="seat-note">
        No rooms scheduled. Open one and it will show up here for everybody, or run it closed and
        hand the code to the people you want.
      </p>
    );
  }

  return (
    <ul className="roomlist">
      {found.map((room) => (
        <li key={room.id} className="roomcard">
          <button type="button" className="roomcard__button" onClick={() => onOpen(room)}>
            <span className="roomcard__title">{room.scenarioTitle}</span>
            <span className="roomcard__meta">
              {room.difficulty} · {new Date(room.startsAt).toLocaleString()}
              {room.visibility === 'closed' ? ' · closed' : ''}
            </span>
            <span className="roomcard__seats">
              {room.seatsFilled}/{room.seatsTotal} seats
              {room.mySeat ? ` · you are ${room.mySeat}` : ''}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function CreateForm({
  scenarios,
  onCreated,
}: {
  scenarios: RoomScenarioSummary[];
  onCreated: (room: ClientRoom) => void | Promise<void>;
}) {
  const [scenarioId, setScenarioId] = useState('');
  const [difficulty, setDifficulty] = useState<ScenarioDifficulty>('beginner');
  const [startsAt, setStartsAt] = useState('');
  const [visibility, setVisibility] = useState<RoomVisibility>('open');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const chosen = scenarios.find((s) => s.id === scenarioId) ?? null;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // The input is local time; the wire is always UTC.
      const { room } = await rooms.create({
        scenarioId,
        difficulty,
        startsAt: new Date(startsAt).toISOString(),
        visibility,
      });
      await onCreated(room);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not schedule it.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="roomform" onSubmit={(e) => void submit(e)}>
      <label>
        Incident
        <select
          value={scenarioId}
          onChange={(e) => {
            setScenarioId(e.target.value);
            const next = scenarios.find((s) => s.id === e.target.value);
            if (next) setDifficulty(next.defaultDifficulty);
          }}
          required
        >
          <option value="">Choose one…</option>
          {scenarios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} ({s.roles.length} seats)
            </option>
          ))}
        </select>
      </label>

      {chosen ? (
        <p className="roomform__brief">
          {chosen.situation}
          <br />
          <span className="roomform__seats">
            Seats: {chosen.roles.join(', ')}. Roles not listed do not appear on this floor.
          </span>
        </p>
      ) : null}

      <label>
        Tier
        {/* The tier is a property of the run, not the incident: the same
            scenario is worth playing more than once at different tiers. */}
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as ScenarioDifficulty)}
        >
          {SCENARIO_DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>

      <label>
        Starts
        <input
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          required
        />
      </label>

      <fieldset className="roomform__visibility">
        <legend>Who can take a seat</legend>
        <label>
          <input
            type="radio"
            checked={visibility === 'open'}
            onChange={() => setVisibility('open')}
          />
          Anybody. How a solo student gets a full floor.
        </label>
        <label>
          <input
            type="radio"
            checked={visibility === 'closed'}
            onChange={() => setVisibility('closed')}
          />
          Join code only. How a class or a team runs without a stranger taking the lead chair.
        </label>
      </fieldset>

      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      <button type="submit" className="primary" disabled={busy || !scenarioId || !startsAt}>
        {busy ? 'Scheduling…' : 'Schedule it'}
      </button>
      <p className="seat-note">
        You take the lead chair. A room without one cannot run, so it is filled rather than left
        open and forgotten.
      </p>
    </form>
  );
}

function JoinByCode({ onOpen }: { onOpen: (id: string, code: string) => void }) {
  const [code, setCode] = useState('');
  const [id, setId] = useState('');
  return (
    <details className="joincode">
      <summary>Have a join code?</summary>
      <div className="joincode__body">
        <input
          value={id}
          onChange={(e) => setId(e.target.value.trim())}
          placeholder="Room link or id"
          aria-label="Room id"
        />
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.trim().toUpperCase())}
          placeholder="Join code"
          aria-label="Join code"
        />
        <button type="button" disabled={!id || !code} onClick={() => onOpen(id, code)}>
          Open it
        </button>
      </div>
    </details>
  );
}

