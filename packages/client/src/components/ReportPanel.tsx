/**
 * Reporting somebody you are in a room with.
 *
 * WHY THE BUTTON IS QUIET AND THE PANEL IS NOT
 *
 * The control sits with the other room controls, worded plainly and styled
 * like nothing in particular. A red flag icon on every seat invites pressing,
 * and a report button that looks like a game mechanic gets used like one.
 *
 * Once it is open the panel is direct, because somebody who opened it is
 * dealing with something. It names who they are reporting, says what happens
 * next in one sentence, and does not ask them to assemble any evidence: that
 * is the server's job, and a person being harassed is the last one who should
 * be collecting it.
 *
 * WHAT IT DELIBERATELY DOES NOT SHOW
 *
 * How many people have already reported somebody, and how many more it would
 * take. A countdown turns the panel into a tool, and it is the one number that
 * would make organising against a person straightforward.
 */

import { useEffect, useState } from 'react';

import { REPORT_NOTE_MAX } from '@soc/shared';
import type { ReportReasonDefinition, ReportSpace } from '@soc/shared';

import { ApiCallError, conduct } from '../lib/api';

export interface ReportablePerson {
  userId: string;
  callSign: string;
  /** Seat or side, shown so two people with similar call signs are told apart. */
  where: string | null;
}

interface Props {
  space: ReportSpace;
  roomId: string;
  /** Everybody in the room except the viewer. Filtered by the caller. */
  people: ReportablePerson[];
  onClose: () => void;
}

export function ReportPanel({ space, roomId, people, onClose }: Props) {
  const [reasons, setReasons] = useState<ReportReasonDefinition[]>([]);
  const [subject, setSubject] = useState<string>(people[0]?.userId ?? '');
  const [reason, setReason] = useState<string>('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  // Fetched rather than hardcoded, so a category added on the server reaches
  // every client without a release.
  useEffect(() => {
    void conduct
      .reasons()
      .then((result) => {
        setReasons(result.reasons);
        setReason((current) => current || (result.reasons[0]?.id ?? ''));
      })
      .catch(() => setError('Could not load the reasons. Try again in a moment.'));
  }, []);

  if (people.length === 0) {
    return (
      <div className="reportpanel">
        <h3>Report somebody</h3>
        <p className="seat-note">There is nobody else in this room yet.</p>
        <button type="button" className="quiet" onClick={onClose}>
          Close
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="reportpanel">
        <h3>Reported</h3>
        <p className="seat-note">{done}</p>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    );
  }

  const chosen = reasons.find((r) => r.id === reason) ?? null;
  const who = people.find((p) => p.userId === subject) ?? null;

  async function send() {
    setBusy(true);
    setError(null);
    try {
      const receipt = await conduct.report({ space, roomId, subjectUserId: subject, reason, note });
      setDone(receipt.message);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not send that report.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="reportpanel">
      <h3>Report somebody in this room</h3>
      <p className="seat-note">
        A person reads every report. If several people in the room report the same person, the room
        removes them automatically.
      </p>

      <label className="reportpanel__field">
        <span>Who</span>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          {people.map((person) => (
            <option key={person.userId} value={person.userId}>
              {person.callSign}
              {person.where ? ` (${person.where})` : ''}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="reportpanel__reasons">
        <legend>What happened</legend>
        {reasons.map((option) => (
          <label key={option.id} className="reportpanel__reason">
            <input
              type="radio"
              name="report-reason"
              value={option.id}
              checked={reason === option.id}
              onChange={() => setReason(option.id)}
            />
            <span>
              <strong>{option.label}</strong>
              <em>{option.detail}</em>
            </span>
          </label>
        ))}
      </fieldset>

      <label className="reportpanel__field">
        <span>
          In your own words
          {chosen?.id === 'other' ? '' : ' (optional)'}
        </span>
        <textarea
          value={note}
          maxLength={REPORT_NOTE_MAX}
          rows={4}
          placeholder="What happened, and roughly when. A person reads this."
          onChange={(e) => setNote(e.target.value)}
        />
      </label>

      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      <div className="reportpanel__controls">
        <button
          type="button"
          className="primary"
          disabled={busy || !subject || !reason || (chosen?.id === 'other' && note.trim().length === 0)}
          onClick={() => void send()}
        >
          Report {who ? who.callSign : 'them'}
        </button>
        <button type="button" className="quiet" onClick={onClose} disabled={busy}>
          Cancel
        </button>
      </div>
    </div>
  );
}
