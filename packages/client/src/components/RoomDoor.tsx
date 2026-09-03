/**
 * The door of a running room.
 *
 * WHY THIS IS RENDERED FOR EVERYBODY AND NOT ONLY THE LEAD
 *
 * A knock only the lead can see is invisible while the lead is deep in a
 * readout, and the person outside cannot tell refusal from being forgotten.
 * Showing it to the whole floor also puts the decision in front of everybody,
 * which is the right shape for a decision about who is allowed in.
 *
 * The buttons appear only for whoever may actually answer, which is the lead,
 * or anybody seated once the lead has stepped out. Everybody else sees who is
 * waiting and nothing to press, so the room knows without the room deciding.
 */

import { useState } from 'react';

import type { DoorView } from '../lib/api';
import { ApiCallError, rooms } from '../lib/api';

interface Props {
  roomId: string;
  door: DoorView;
  onChanged: (door: DoorView) => void;
}

export function RoomDoor({ roomId, door, onChanged }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Nothing to draw before the shift starts: an open room has no door, and a
  // panel saying so is noise on a floor that is still filling.
  if (!door.shut) return null;
  if (door.waiting.length === 0) return null;

  async function answer(userId: string, decision: 'admitted' | 'declined') {
    setBusy(userId);
    setError(null);
    try {
      onChanged((await rooms.answerDoor(roomId, userId, decision)).door);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not answer the door.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="roomdoor">
      <h3>
        {door.waiting.length === 1 ? 'Somebody is at the door' : `${door.waiting.length} people are at the door`}
      </h3>

      <ul className="roomdoor__list">
        {door.waiting.map((knock) => (
          <li key={knock.who.userId}>
            <span className={`avatar avatar--${knock.who.avatarId}`} aria-hidden="true" />
            <span className="roomdoor__who">
              <strong>{knock.who.callSign}</strong>
              {/*
                Coming back and arriving are different questions, so the door
                says which one it is asking.
              */}
              <em>{knock.returning ? 'coming back to their seat' : 'not been in this room'}</em>
            </span>
            {door.canAdmit ? (
              <span className="roomdoor__buttons">
                <button
                  type="button"
                  className="primary"
                  disabled={busy !== null}
                  onClick={() => void answer(knock.who.userId, 'admitted')}
                >
                  Let in
                </button>
                <button
                  type="button"
                  className="quiet"
                  disabled={busy !== null}
                  onClick={() => void answer(knock.who.userId, 'declined')}
                >
                  Not now
                </button>
              </span>
            ) : null}
          </li>
        ))}
      </ul>

      {!door.canAdmit ? (
        <p className="seat-note">The lead answers the door. If they have stepped out, anybody seated can.</p>
      ) : null}
      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}
    </div>
  );
}

/**
 * What somebody outside a running room sees.
 *
 * Separate component because it is a different situation entirely: this person
 * is not in the room, cannot see the board, and needs one thing to press and an
 * honest account of what happens next.
 */
export function DoorOutside({
  roomId,
  door,
  onChanged,
}: {
  roomId: string;
  door: DoorView;
  onChanged: (door: DoorView) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!door.shut) return null;
  if (door.mine.admitted) return null;
  // Somebody sitting in the room, present, has no business with this panel.
  if (door.mine.seated && !door.mine.steppedOut) return null;

  async function press() {
    setBusy(true);
    setError(null);
    try {
      onChanged((await rooms.knock(roomId)).door);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not knock.');
    } finally {
      setBusy(false);
    }
  }

  if (door.mine.waiting) {
    return (
      <div className="roomdoor roomdoor--outside">
        <h3>Waiting at the door</h3>
        <p className="seat-note">
          Everybody in the room can see you are here. The lead will answer, or anybody seated if the
          lead has stepped out.
        </p>
      </div>
    );
  }

  return (
    <div className="roomdoor roomdoor--outside">
      <h3>The shift has started</h3>
      <p className="seat-note">
        {door.mine.steppedOut
          ? 'Your chair is still yours. Knock and somebody in the room will let you back in.'
          : 'This room is running an incident. Knock and the people in it will decide.'}
      </p>
      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}
      <button type="button" className="primary" disabled={busy} onClick={() => void press()}>
        {busy ? 'Knocking…' : 'Knock'}
      </button>
    </div>
  );
}
