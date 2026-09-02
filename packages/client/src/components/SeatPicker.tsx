/**
 * Choosing a chair on a war room floor.
 *
 * THE RULE THIS COMPONENT EXISTS TO HOLD
 *
 * It renders `detail.seating` and nothing else. It never iterates the role
 * catalogue, never renders a chair for a role the scenario does not seat, and
 * never decides for itself whether a chair is available.
 *
 * That is not fussiness about layering. A scenario declares the seats its
 * incident actually generates evidence for, and a floor built from the full
 * catalogue would offer, say, a malware analyst chair on an incident that has
 * no malware in it. Somebody takes it, waits an hour for evidence that is never
 * going to arrive, and concludes they were bad at the job rather than that they
 * were sat at a desk the incident does not have.
 *
 * WHY EVERY REFUSAL SHOWS ITS REASON
 *
 * `blockedBecause` is written server-side to be read by a person. A chair that
 * is simply greyed out teaches nothing; "Taken by Kestrel" and "You are in the
 * forensics seat. Leave it first." are two completely different problems and the
 * person needs to know which one they have.
 */

import { useCallback, useEffect, useState } from 'react';

import { ApiCallError, rooms } from '../lib/api';
import type { RoomDetail, SeatView } from '../lib/api';
import type { AvatarId, SocRoleId } from '@soc/shared';

/** Plain-language remit, so somebody choosing a chair knows what the hour holds. */
const REMIT: Record<string, string> = {
  'soc-operator': 'Work the alert queue. Decide what is worth waking somebody for.',
  'log-analyst': 'Build the timeline out of raw logs and confirm it in a second source.',
  'network-analyst': 'Map connections against baseline. Establish what talked to what.',
  'malware-analyst': 'Take apart what was executed and say what it does.',
  forensics: 'Preserve evidence and establish what happened on the host, in order.',
  'threat-intel': 'Assess who this looks like, with a basis and a confidence level.',
  'cloud-security': 'Audit identities and cloud control planes. Who called what, from where.',
  'vulnerability-analyst': 'Establish exposure: what is reachable, by whom, and what it is worth.',
  'ai-security': 'Work incidents involving models, agents and the tools they hold.',
  'detection-engineer': 'Own what we see next time, and what it costs to see it.',
  'fusion-analyst': 'Hold three surfaces at once and notice two seats describing one event.',
  'mitigation-specialist': 'Own what changes, what it breaks, and who pays for it.',
  'ir-lead': 'Adjudicate, sequence the response, and cover the chairs nobody took.',
};

function seatLabel(role: string): string {
  return role
    .split('-')
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join(' ');
}

interface Props {
  roomId: string;
  /** Supplied when arriving through a closed room's code, so refreshes keep working. */
  joinCode?: string | null;
  onSeated?: (role: SocRoleId) => void;
}

export function SeatPicker({ roomId, joinCode = null, onSeated }: Props) {
  const [detail, setDetail] = useState<RoomDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setDetail(await rooms.get(roomId, joinCode));
      setError(null);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not load the room.');
    } finally {
      setLoading(false);
    }
  }, [roomId, joinCode]);

  useEffect(() => {
    void load();
    /*
     * Poll while the chart is on screen.
     *
     * Somebody staring at a seating chart is specifically waiting to see other
     * people arrive, and a chart that only updates when you click something
     * tells you a chair is free two seconds after somebody else took it.
     */
    const timer = window.setInterval(() => void load(), 5000);
    return () => window.clearInterval(timer);
  }, [load]);

  async function choose(seat: SeatView) {
    if (!seat.selectable || busy) return;
    setBusy(seat.role);
    setError(null);
    try {
      const next = await rooms.takeSeat(roomId, seat.role, joinCode);
      setDetail((prev) => (prev ? { ...prev, ...next } : prev));
      onSeated?.(seat.role);
    } catch (caught) {
      // A refusal here is almost always somebody else getting there first, so
      // reload rather than just reporting: the chart the person is looking at
      // is now known to be wrong.
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not take that seat.');
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function stand() {
    setBusy('leave');
    setError(null);
    try {
      const next = await rooms.leaveSeat(roomId);
      setDetail((prev) => (prev ? { ...prev, ...next } : prev));
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Could not leave the seat.');
    } finally {
      setBusy(null);
    }
  }

  if (loading) return <p className="seat-note">Loading the floor…</p>;
  if (!detail) return <p className="seat-note seat-note--bad">{error ?? 'Room unavailable.'}</p>;

  const { room, seating, readiness } = detail;
  const starts = new Date(room.startsAt);

  return (
    <section className="seatpicker">
      <header className="seatpicker__head">
        <div>
          <h2>{room.scenarioTitle}</h2>
          <p className="seatpicker__meta">
            {room.difficulty} · {starts.toLocaleString()} ·{' '}
            {room.visibility === 'closed' ? 'closed room' : 'open room'}
          </p>
        </div>
        <div className="seatpicker__count">
          <strong>
            {readiness.filled}/{readiness.total}
          </strong>
          <span>seats filled</span>
        </div>
      </header>

      {/* The host is the only person who can pass the code on, so only they see it. */}
      {room.isHost && room.joinCode ? (
        <p className="seat-note">
          Join code <code>{room.joinCode}</code>. Anyone with it can take a seat.
        </p>
      ) : null}

      <p className="seatpicker__scope">
        This incident runs {seating.length} seats. Roles it does not use are not on this floor.
      </p>

      <ul className="seatgrid">
        {seating.map((seat) => {
          const mine = room.mySeat === seat.role;
          const state = mine
            ? 'mine'
            : seat.occupant
              ? 'taken'
              : seat.selectable
                ? 'free'
                : 'shut';
          return (
            <li key={seat.role} className={`seat seat--${state}`}>
              <button
                type="button"
                className="seat__button"
                disabled={!seat.selectable || busy !== null}
                onClick={() => void choose(seat)}
                aria-label={`${seatLabel(seat.role)}: ${seat.blockedBecause ?? 'free'}`}
              >
                <span className="seat__role">{seatLabel(seat.role)}</span>
                <span className="seat__remit">{REMIT[seat.role] ?? ''}</span>
                <span className="seat__status">
                  {seat.occupant ? (
                    <>
                      <Avatar id={seat.occupant.avatarId} />
                      {seat.occupant.callSign}
                      {mine ? ' (you)' : ''}
                    </>
                  ) : (
                    (seat.blockedBecause ?? 'Open')
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {room.mySeat ? (
        <p className="seat-note">
          You have the {seatLabel(room.mySeat)} chair.{' '}
          {room.mySeat === 'ir-lead' ? (
            'The lead cannot simply stand up: hand it over first.'
          ) : (
            <button type="button" className="linkish" onClick={() => void stand()} disabled={!!busy}>
              Leave it
            </button>
          )}
        </p>
      ) : null}

      {/* Readiness is about the lead chair only. Every other empty seat is read
          out by the lead as a stand-in, which is a worse run and still a run. */}
      <p className={`seat-note ${readiness.canStart ? '' : 'seat-note--bad'}`}>
        {readiness.canStart ? 'Ready to run.' : readiness.blockers.join(' ')}
      </p>

      {readiness.notes.map((note) => (
        <p key={note} className="seat-note seat-note--warn">
          {note}
        </p>
      ))}

      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}
    </section>
  );
}

function Avatar({ id }: { id: AvatarId }) {
  return <span className={`avatar avatar--${id}`} aria-hidden="true" />;
}
