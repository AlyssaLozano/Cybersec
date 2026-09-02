/**
 * Choosing the name and face you are known by away from your account.
 *
 * Extracted from the war room board because the lobby needs the same gate: a
 * person walks into the lobby before they ever reach a seat chart, and two
 * copies of this form would drift into two sets of rules about what a call sign
 * may be.
 *
 * Asked here rather than at signup for the reason in @soc/shared/rooms.ts:
 * somebody registering for a training platform has not yet seen the thing a
 * call sign is for, and a required field they cannot evaluate is a field they
 * fill in badly and immediately want to change.
 */

import { useState } from 'react';

import { AVATARS, checkCallSign } from '@soc/shared';
import type { AvatarId, FloorIdentity } from '@soc/shared';

import { ApiCallError, rooms } from '../lib/api';

export function IdentityForm({ onChosen }: { onChosen: (identity: FloorIdentity) => void }) {
  const [callSign, setCallSign] = useState('');
  const [avatarId, setAvatar] = useState<AvatarId>(AVATARS[0]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Checked locally for immediate feedback and again on the server, which owns
  // uniqueness. Two people picking one name in the same second is exactly what
  // a client-side check cannot catch.
  const local = checkCallSign(callSign.trim());

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { identity } = await rooms.setIdentity(callSign.trim(), avatarId);
      onChosen(identity);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not save that.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="identityform" onSubmit={(e) => void submit(e)}>
      <h1>Pick a call sign</h1>
      <p>
        It is how the floor addresses you out loud. Short enough to say over a microphone, and not a
        word already used to address the room.
      </p>

      <label>
        Call sign
        <input
          value={callSign}
          onChange={(e) => setCallSign(e.target.value)}
          maxLength={14}
          autoFocus
          required
        />
      </label>
      {callSign.trim() && !local.ok ? (
        <p className="seat-note seat-note--bad">{local.problem}</p>
      ) : null}

      <fieldset className="avatarpick">
        <legend>Face</legend>
        {AVATARS.map((id) => (
          <label key={id} className={avatarId === id ? 'is-on' : ''}>
            <input
              type="radio"
              name="avatar"
              checked={avatarId === id}
              onChange={() => setAvatar(id)}
            />
            <span className={`avatar avatar--${id}`} aria-hidden="true" />
            <span className="avatarpick__name">{id}</span>
          </label>
        ))}
      </fieldset>

      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      <button type="submit" className="primary" disabled={busy || !local.ok}>
        {busy ? 'Saving…' : 'Use this'}
      </button>
    </form>
  );
}
