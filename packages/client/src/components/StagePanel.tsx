/**
 * The Stage: browse upcoming talks, propose your own, and track what you asked for.
 *
 * Shaped after ChatRooms/RequestRoomForm/MyRequests in Lobby.tsx -- same
 * propose-then-wait flow, just always reviewed by a superadmin. See
 * @soc/shared/stage.ts for why that reviewer is fixed rather than any staff.
 */

import { useCallback, useEffect, useState } from 'react';

import {
  STAGE_DESCRIPTION_MAX,
  STAGE_DESCRIPTION_MIN,
  STAGE_DURATION_MAX_MINUTES,
  STAGE_DURATION_MIN_MINUTES,
  STAGE_TOPIC_MAX,
  checkStageTalkRequest,
} from '@soc/shared';
import type { StageTalk } from '@soc/shared';

import { ApiCallError, stage } from '../lib/api';

export function StagePanel() {
  const [talks, setTalks] = useState<StageTalk[]>([]);
  const [mine, setMine] = useState<StageTalk[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);

  const load = useCallback(async () => {
    try {
      const [upcoming, own] = await Promise.all([stage.list(), stage.mine()]);
      setTalks(upcoming.talks);
      setMine(own.talks);
      setError(null);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not load the stage.');
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (!loaded) return <p className="seat-note">Loading the stage…</p>;

  return (
    <section className="stage">
      <h2 className="lobby__h">The stage</h2>
      <p className="lobby__hint">
        Anybody signed in can propose a talk. A superadmin reviews it before it goes on this list,
        the same way a chat room does.
      </p>

      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      {talks.length === 0 ? (
        <p className="seat-note">Nothing scheduled yet.</p>
      ) : (
        <ul className="stage__list">
          {talks.map((talk) => (
            <TalkCard key={talk.id} talk={talk} />
          ))}
        </ul>
      )}

      {asking ? (
        <ProposeForm onDone={() => { setAsking(false); void load(); }} />
      ) : (
        <button type="button" className="linkish" onClick={() => setAsking(true)}>
          Propose a talk
        </button>
      )}

      <MyTalks talks={mine} onChanged={() => void load()} />
    </section>
  );
}

function TalkCard({ talk }: { talk: StageTalk }) {
  return (
    <li className="stage__card">
      <div className="stage__cardhead">
        <strong>{talk.title}</strong>
        <span className="stage__topic">{talk.topic}</span>
      </div>

      <p className="stage__desc">{talk.description}</p>

      <p className="stage__by">
        <span className={`avatar avatar--${talk.presenter.avatarId} stage__face`} aria-hidden="true" />
        {talk.presenter.callSign} · {new Date(talk.proposedStartsAt).toLocaleString()} ·{' '}
        {talk.durationMinutes} min
      </p>

      {talk.meetingLink ? (
        <a href={talk.meetingLink} target="_blank" rel="noopener noreferrer" className="stage__link">
          Join link
        </a>
      ) : (
        <span className="stage__nolink">link added by the presenter</span>
      )}
    </li>
  );
}

/**
 * Asking for a slot on the stage.
 *
 * The description is the important field, same reason the chat room request
 * form leans on the topic: it is the whole basis on which a superadmin decides.
 */
function ProposeForm({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(STAGE_DURATION_MIN_MINUTES);
  const [meetingLink, setMeetingLink] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  // datetime-local has no timezone of its own; Date parses it as local time
  // and toISOString gives the UTC string the server's z.string().datetime() wants.
  const proposedStartsAt = startsAt ? new Date(startsAt).toISOString() : '';

  const local = checkStageTalkRequest({ title, topic, description, proposedStartsAt, durationMinutes });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await stage.propose({
        title,
        topic,
        description,
        proposedStartsAt,
        durationMinutes,
        meetingLink: meetingLink.trim() || null,
      });
      setSent(true);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not send that.');
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <p className="seat-note">
        Proposal sent. A superadmin reviews it, and you will see the answer under &ldquo;your
        talks&rdquo; below.{' '}
        <button type="button" className="linkish" onClick={onDone}>
          Close
        </button>
      </p>
    );
  }

  return (
    <form className="stagerequest" onSubmit={(e) => void submit(e)}>
      <h3>Propose a talk</h3>

      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} required />
      </label>

      <label>
        Topic
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          maxLength={STAGE_TOPIC_MAX}
          required
        />
      </label>

      <label>
        What will you cover?
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={STAGE_DESCRIPTION_MAX}
          rows={4}
          required
        />
      </label>
      <p className="stagerequest__count">
        {description.trim().length} / {STAGE_DESCRIPTION_MIN} minimum
      </p>

      <div className="stagerequest__row">
        <label>
          Proposed start
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
          />
        </label>

        <label>
          Duration (minutes)
          <input
            type="number"
            value={durationMinutes}
            min={STAGE_DURATION_MIN_MINUTES}
            max={STAGE_DURATION_MAX_MINUTES}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            required
          />
        </label>
      </div>

      <label>
        Meeting link (optional, you can add it later)
        <input
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
          maxLength={500}
          placeholder="https://…"
        />
      </label>

      {(title.trim() || topic.trim() || description.trim() || startsAt) && !local.ok ? (
        <p className="seat-note seat-note--bad">{local.problem}</p>
      ) : null}
      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      <div className="stagerequest__actions">
        <button type="submit" className="primary" disabled={busy || !local.ok}>
          {busy ? 'Sending…' : 'Send proposal'}
        </button>
        <button type="button" className="linkish" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/** A decision that never reaches the person who asked is indistinguishable from being ignored. */
function MyTalks({ talks, onChanged }: { talks: StageTalk[]; onChanged: () => void }) {
  if (talks.length === 0) return null;

  return (
    <div className="mystagetalks">
      <h3>Your talks</h3>
      <ul>
        {talks.map((talk) => (
          <MyTalkRow key={talk.id} talk={talk} onChanged={onChanged} />
        ))}
      </ul>
    </div>
  );
}

function MyTalkRow({ talk, onChanged }: { talk: StageTalk; onChanged: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canCancel = talk.status !== 'rejected' && talk.status !== 'cancelled';

  async function cancel() {
    setBusy(true);
    setError(null);
    try {
      await stage.cancel(talk.id);
      onChanged();
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not cancel that.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <li>
      <strong>{talk.title}</strong>
      <span className={`reqstate reqstate--${talk.status}`}>{talk.status}</span>
      {talk.reviewNote ? <span className="myrequests__note">{talk.reviewNote}</span> : null}
      {canCancel ? (
        <button type="button" className="linkish" disabled={busy} onClick={() => void cancel()}>
          Cancel
        </button>
      ) : null}
      {error ? <span className="seat-note seat-note--bad">{error}</span> : null}
    </li>
  );
}
