/**
 * The chat room review queue.
 *
 * Only staff ever see this tab, and the server refuses the routes behind it
 * regardless: the visibility here is convenience, not the control. See the
 * header of routes/lobby.ts for why the role is read from the database rather
 * than from the session token.
 *
 * WHY A REFUSAL NEEDS A NOTE
 *
 * A "no" with no reason is indistinguishable from being ignored, and somebody
 * who cannot tell the difference asks again next week with the same wording.
 * The note is what makes the queue self-limiting, so the form requires it and
 * so does the service.
 */

import { useCallback, useEffect, useState } from 'react';

import type { ChatRoom } from '@soc/shared';

import { ApiCallError, lobby } from '../lib/api';

export function RoomReview() {
  const [pending, setPending] = useState<ChatRoom[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const { pending: queue } = await lobby.reviewQueue();
      setPending(queue);
      setError(null);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not load the queue.');
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (!loaded) return <p className="seat-note">Loading the queue…</p>;

  return (
    <section className="review">
      <h2 className="lobby__h">Chat room requests</h2>
      <p className="lobby__hint">
        Approving a room makes it public and permanent: everybody signed in can read and post in it,
        and its id never changes because messages carry it. Refusing one is fine, and the reason you
        give is what the person who asked will see.
      </p>

      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      {pending.length === 0 ? (
        <p className="seat-note">Nothing waiting.</p>
      ) : (
        <ul className="reviewlist">
          {pending.map((room) => (
            <ReviewRow key={room.id} room={room} onDecided={() => void load()} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ReviewRow({ room, onDecided }: { room: ChatRoom; onDecided: () => void }) {
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(decision: 'approve' | 'reject') {
    setBusy(true);
    setError(null);
    try {
      await lobby.review(room.id, decision, note.trim() || null);
      onDecided();
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not save that.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="reviewrow">
      <div className="reviewrow__head">
        <strong>{room.title}</strong>
        <span className="reviewrow__id">would become /{room.id}</span>
      </div>

      <p className="reviewrow__topic">{room.topic}</p>

      <p className="reviewrow__by">
        Asked for by{' '}
        {room.requestedBy ? (
          <>
            <span
              className={`avatar avatar--${room.requestedBy.avatarId} reviewrow__face`}
              aria-hidden="true"
            />
            {room.requestedBy.callSign}
          </>
        ) : (
          'somebody'
        )}{' '}
        on {new Date(room.createdAt).toLocaleString()}
      </p>

      <label className="reviewrow__note">
        Note back to them (required to refuse)
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={400}
          placeholder="Approved, or why not"
        />
      </label>

      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      <div className="reviewrow__actions">
        <button type="button" className="primary" disabled={busy} onClick={() => void decide('approve')}>
          Approve
        </button>
        <button
          type="button"
          className="linkish"
          disabled={busy || note.trim() === ''}
          onClick={() => void decide('reject')}
        >
          Refuse
        </button>
      </div>
    </li>
  );
}
