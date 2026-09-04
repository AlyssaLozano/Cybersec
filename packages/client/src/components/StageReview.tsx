/**
 * The stage talk review queue.
 *
 * Near-identical to RoomReview.tsx: same queue-plus-required-note shape, just
 * against stage.review* and StageTalk instead of lobby.review* and ChatRoom.
 * See that file's header for why a refusal needs a note.
 */

import { useCallback, useEffect, useState } from 'react';

import type { StageTalk } from '@soc/shared';

import { ApiCallError, stage } from '../lib/api';

export function StageReview() {
  const [pending, setPending] = useState<StageTalk[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    try {
      const { pending: queue } = await stage.reviewQueue();
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
      <h2 className="lobby__h">Stage talk requests</h2>
      <p className="lobby__hint">
        Approving a talk puts it on the stage list for everybody. Refusing one is fine, and the
        reason you give is what the presenter will see.
      </p>

      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      {pending.length === 0 ? (
        <p className="seat-note">Nothing waiting.</p>
      ) : (
        <ul className="reviewlist">
          {pending.map((talk) => (
            <ReviewRow key={talk.id} talk={talk} onDecided={() => void load()} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ReviewRow({ talk, onDecided }: { talk: StageTalk; onDecided: () => void }) {
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(decision: 'approve' | 'reject') {
    setBusy(true);
    setError(null);
    try {
      await stage.review(talk.id, decision, note.trim() || null);
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
        <strong>{talk.title}</strong>
        <span className="reviewrow__id">{talk.topic}</span>
      </div>

      <p className="reviewrow__topic">{talk.description}</p>

      <p className="reviewrow__by">
        Proposed by{' '}
        <span
          className={`avatar avatar--${talk.presenter.avatarId} reviewrow__face`}
          aria-hidden="true"
        />
        {talk.presenter.callSign} for {new Date(talk.proposedStartsAt).toLocaleString()} ·{' '}
        {talk.durationMinutes} min
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
