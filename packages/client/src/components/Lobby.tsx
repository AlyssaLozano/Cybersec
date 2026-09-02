/**
 * The lobby.
 *
 * One door on the landing map opens here, and every war room is a door off it.
 * The reason is in @soc/shared/lobby.ts: the rooms are the point of the product
 * and the loneliest part of it, because four people who would have made a
 * session each looked at an empty schedule ten minutes apart.
 *
 * WHY YOU WATCH YOURSELF WALK IN
 *
 * The first thing that happens is your own avatar and call sign crossing the
 * floor. It is thirty frames of animation and it does two things no amount of
 * copy does: it tells somebody they are visible to the other people here, which
 * changes how they behave, and it makes the room a place rather than a page.
 *
 * WHY THE FLOOR IS A CROWD AND NOT A LIST
 *
 * A sidebar of names reads as a user directory. People standing in a room read
 * as people standing in a room, and somebody scanning for a stranger to talk to
 * is doing the thing the lobby exists for. The badges under each name are what
 * make the scan worth anything: "SOC Analyst" is the fact you want about
 * somebody before you ask them a question.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  CHAT_ROOM_TOPIC_MAX,
  CHAT_ROOM_TOPIC_MIN,
  PRESENCE_HEARTBEAT_SECONDS,
  arrivalsBetween,
  checkChatRoomRequest,
} from '@soc/shared';
import type { ChatRoom, FloorIdentity, LobbyDoorId, LobbyOccupant, LobbyView } from '@soc/shared';

import { ApiCallError, lobby, rooms } from '../lib/api';

import { IdentityForm } from './IdentityForm';
import { LobbyChat } from './LobbyChat';
import { EventCenter } from './EventCenter';
import { RoomReview } from './RoomReview';
import { BadgePip } from './BadgeCase';

interface LobbyProps {
  /**
   * Which door this person clicked to get here, if any.
   *
   * Carried in rather than asked for, because somebody who pressed "SOC War
   * Room" on the landing map has already said what they came for, and making
   * them say it again in the lobby is asking a question they just answered.
   */
  initialHeading?: LobbyDoorId | null;
  /** Walk through to the SOC war room floor. */
  onSocFloor: () => void;
  /** Walk through to the red versus blue console. */
  onRedBlue: () => void;
  onExit: () => void;
}

type Pane = 'floor' | 'chat' | 'events' | 'review';

/** How often the floor is re-read. Matches the server's heartbeat expectation. */
const POLL_MS = PRESENCE_HEARTBEAT_SECONDS * 1000;

export function Lobby({ initialHeading = null, onSocFloor, onRedBlue, onExit }: LobbyProps) {
  const [identity, setIdentity] = useState<FloorIdentity | null>(null);
  const [identityKnown, setIdentityKnown] = useState(false);
  const [view, setView] = useState<LobbyView | null>(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pane, setPane] = useState<Pane>('floor');
  const [openRoomId, setOpenRoomId] = useState<string | null>(null);
  const [headingFor, setHeadingFor] = useState<LobbyDoorId | null>(initialHeading);

  /**
   * Who was on the floor last poll.
   *
   * A ref rather than state: it feeds the arrival diff and must not itself
   * cause a render, or every poll would re-run the effect that produced it.
   */
  const previous = useRef<LobbyOccupant[]>([]);
  /**
   * Whether a beat is already in the air.
   *
   * Two beats that overlap both diff against the same previous roster, so both
   * announce the same arrival. React's development double-mount does it every
   * time, and a slow network does it occasionally in production.
   */
  const beating = useRef(false);
  const [arrivals, setArrivals] = useState<LobbyOccupant[]>([]);
  /** True for the first few seconds, which is when you watch yourself walk in. */
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        setIdentity((await rooms.identity()).identity);
      } finally {
        setIdentityKnown(true);
      }
    })();
  }, []);

  const beat = useCallback(
    async (door: LobbyDoorId | null) => {
      if (beating.current) return;
      beating.current = true;
      try {
        const result = await lobby.presence(door);
        setNotice(result.notice);
        setError(null);

        // Arrivals are a client-side diff. Writing "Cinder walked in" to the
        // transcript would fill every room with door noise and leave it there
        // forever, so the room announces it and forgets it.
        const walkedIn = arrivalsBetween(previous.current, result.lobby.occupants).filter(
          (occupant) => occupant.identity.userId !== result.lobby.me.identity.userId,
        );
        if (walkedIn.length > 0) {
          setArrivals((current) => [...current, ...walkedIn].slice(-4));
        }
        previous.current = result.lobby.occupants;
        setView(result.lobby);
      } catch (caught) {
        if (caught instanceof ApiCallError && caught.status === 428) {
          // The call sign was cleared elsewhere. Fall back to the gate rather
          // than leaving somebody staring at a room they cannot be seen in.
          setIdentity(null);
          return;
        }
        setError(caught instanceof ApiCallError ? caught.error.message : 'Lost the lobby.');
      } finally {
        beating.current = false;
      }
    },
    [],
  );

  useEffect(() => {
    if (!identity) return undefined;
    void beat(headingFor);
    const timer = window.setInterval(() => void beat(headingFor), POLL_MS);
    return () => window.clearInterval(timer);
  }, [identity, headingFor, beat]);

  /* Leave on the way out, rather than fading from the room over 75 seconds. */
  useEffect(() => {
    return () => {
      void lobby.leave().catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    if (!entering) return undefined;
    const timer = window.setTimeout(() => setEntering(false), 2600);
    return () => window.clearTimeout(timer);
  }, [entering]);

  /* An arrival banner is news for a moment and clutter after that. */
  useEffect(() => {
    if (arrivals.length === 0) return undefined;
    const timer = window.setTimeout(() => setArrivals((current) => current.slice(1)), 5000);
    return () => window.clearTimeout(timer);
  }, [arrivals]);

  const openRoom = useMemo(
    () => view?.rooms.find((room) => room.id === openRoomId) ?? null,
    [view, openRoomId],
  );

  if (!identityKnown) return <p className="seat-note">Loading…</p>;

  // The same gate the war rooms use. Nothing in a shared room works without a
  // name people can say out loud.
  if (!identity) {
    return (
      <div className="lobby lobby--gate">
        <button type="button" className="linkish" onClick={onExit}>
          &larr; Back
        </button>
        <IdentityForm onChosen={setIdentity} />
      </div>
    );
  }

  /*
   * Anything that is not the corridor itself opens as a panel over it. The
   * corridor keeps running behind: dimmed, still moving, still showing who is
   * standing in it. Nobody has gone anywhere.
   */
  const overlay = openRoom ? (
    <LobbyChat
      room={openRoom}
      identity={identity}
      canReview={view?.canReview ?? false}
      onBack={() => setOpenRoomId(null)}
    />
  ) : pane === 'chat' ? (
    <ChatRooms rooms={view?.rooms ?? []} notice={notice} onOpen={(id) => setOpenRoomId(id)} />
  ) : pane === 'events' ? (
    <EventCenter identity={identity} rooms={view?.rooms ?? []} />
  ) : pane === 'review' && view?.canReview ? (
    <RoomReview />
  ) : null;

  const closeOverlay = () => {
    setOpenRoomId(null);
    setPane('floor');
  };

  return (
    /*
     * The lobby IS the corridor: full bleed, no card, no page chrome around it,
     * with the controls floating over the scene. It is never swapped out.
     */
    <div className="lobby lobby--hall">
      <header className="lobby__top">
        <button type="button" className="linkish" onClick={onExit}>
          &larr; Leave the lobby
        </button>
        <nav className="lobby__tabs">
          <button
            type="button"
            className={pane === 'floor' ? 'is-on' : ''}
            onClick={() => setPane('floor')}
          >
            The floor
          </button>
          <button
            type="button"
            className={pane === 'chat' ? 'is-on' : ''}
            onClick={() => setPane('chat')}
          >
            Chat rooms
          </button>
          <button
            type="button"
            className={pane === 'events' ? 'is-on' : ''}
            onClick={() => setPane('events')}
          >
            Events
          </button>
          {view?.canReview ? (
            <button
              type="button"
              className={pane === 'review' ? 'is-on' : ''}
              onClick={() => setPane('review')}
            >
              Review
              {view.pendingRoomCount > 0 ? (
                <span className="lobby__badgecount">{view.pendingRoomCount}</span>
              ) : null}
            </button>
          ) : null}
        </nav>
      </header>

      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      {/* You, crossing the floor. Only on the way in, and only once. */}
      {entering ? (
        <div className="arrival" role="status">
          <span className={`avatar avatar--${identity.avatarId} arrival__face`} aria-hidden="true" />
          <span className="arrival__text">
            <strong>{identity.callSign}</strong> walks into the lobby
          </span>
        </div>
      ) : null}

      <div className="arrivals" aria-live="polite">
        {arrivals.map((occupant) => (
          <div className="arrivals__line" key={`${occupant.identity.userId}-${occupant.arrivedAt}`}>
            <span
              className={`avatar avatar--${occupant.identity.avatarId} arrivals__face`}
              aria-hidden="true"
            />
            <span>
              <strong>{occupant.identity.callSign}</strong> walked in
            </span>
          </div>
        ))}
      </div>

      <Hall
        view={view}
        me={identity}
        headingFor={headingFor}
        onHeadFor={setHeadingFor}
        onSocFloor={onSocFloor}
        onRedBlue={onRedBlue}
        onOpenChat={() => setPane('chat')}
        onOpenEvents={() => setPane('events')}
      />

      {overlay ? (
        <div className="overlay">
          {/*
            Clicking the corridor behind the panel steps back out into it. The
            scrim is a button rather than a div with a handler so that it is
            reachable and announced, and Escape does the same thing.
          */}
          <button
            type="button"
            className="overlay__scrim"
            aria-label="Back to the corridor"
            onClick={closeOverlay}
          />
          <div
            className="overlay__panel"
            role="dialog"
            aria-modal="false"
            onKeyDown={(keyEvent) => {
              if (keyEvent.key === 'Escape') closeOverlay();
            }}
          >
            <button type="button" className="overlay__close" onClick={closeOverlay}>
              Back to the corridor
            </button>
            {overlay}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* --- the floor ---------------------------------------------------------- */

/**
 * The hall.
 *
 * A corridor in one-point perspective: lit walls running back to a gate at the
 * far end, with the war rooms set into alcoves down either side and everybody
 * currently here standing in front of the gate.
 *
 * WHY A ROOM AND NOT A PAGE
 *
 * The metaphor is doing real work rather than decoration. A list of four links
 * tells somebody the war rooms exist. A corridor they are standing in, with
 * three other people in it and a lit doorway with "2 heading here" under it,
 * tells them the war room is somewhere other people are going, and that is the
 * only fact that ever gets a six-seat session filled.
 *
 * WHY THE SEALED ROOMS ARE THE FURTHEST AWAY
 *
 * Depth carries the meaning. The two war rooms that are not built yet sit at
 * the far end of the corridor, small and unlit, which says "later" without a
 * label. They are drawn at all, rather than omitted, because somebody can still
 * mark that they want one and be counted.
 *
 * WHY NONE OF IT COSTS THE EXIT
 *
 * Every part of the scenery is aria-hidden and every portal is a real button
 * with a real label, so this is a corridor to somebody who can see it and a
 * list of six labelled buttons to somebody using a screen reader. Below 60rem
 * the perspective is dropped entirely and the same six portals stack. Theatre
 * must never be the only way through a door.
 */
function Hall({
  view,
  me,
  headingFor,
  onHeadFor,
  onSocFloor,
  onRedBlue,
  onOpenChat,
  onOpenEvents,
}: {
  view: LobbyView | null;
  me: FloorIdentity;
  headingFor: LobbyDoorId | null;
  onHeadFor: (door: LobbyDoorId | null) => void;
  onSocFloor: () => void;
  onRedBlue: () => void;
  onOpenChat: () => void;
  onOpenEvents: () => void;
}) {
  if (!view) return <p className="seat-note">Walking in…</p>;

  /**
   * Going through a portal tells the corridor first.
   *
   * The point of a shared hall is that somebody heading for a SOC room is
   * visible to the two other people who wanted one. Marking it on the way out
   * is what turns three separate abandonments into one session.
   */
  const walkThrough = (door: LobbyDoorId, go: () => void) => () => {
    onHeadFor(door);
    go();
  };

  /** One war room, in the alcove it stands in. */
  const warRoom = (id: LobbyDoorId, slot: BaySlot, go?: () => void) => {
    const door = view.doors.find((entry) => entry.id === id);
    if (!door) return null;
    const open = door.state === 'open' && go !== undefined;
    return (
      <Portal
        key={id}
        slot={slot}
        accent={door.accent}
        title={door.title}
        blurb={door.blurb}
        dormant={!open}
        footnote={door.heading === 0 ? 'nobody heading here' : `${door.heading} heading here`}
        onEnter={open ? walkThrough(id, go) : undefined}
        wanted={headingFor === id}
        onWant={() => onHeadFor(headingFor === id ? null : id)}
      />
    );
  };

  return (
    <section className="hall" aria-label="The lobby">
      <div className="hall__scene">
        {/* Scenery. Painted with gradients rather than shipped as art: an image
            is a download and a fixed resolution, and this recolours itself per
            portal and scales to any size. */}
        <span className="hall__ceiling" aria-hidden="true" />
        <span className="hall__wall hall__wall--l" aria-hidden="true" />
        <span className="hall__wall hall__wall--r" aria-hidden="true" />
        <span className="hall__floor" aria-hidden="true" />

        {/* The gate at the end of the corridor, and the people in front of it. */}
        <div className="gate">
          <span className="gate__halo" aria-hidden="true" />
          <span className="gate__ring" aria-hidden="true" />
          <span className="gate__field" aria-hidden="true" />
          <span className="gate__dais" aria-hidden="true" />
        </div>

        <div className="hall__bays">
          {/* Nearest the viewer, and the only two with a full plate: the war
              rooms that are open. They are what the corridor is for, and their
              blurb is the one somebody actually needs to read. */}
          {warRoom('soc', 'l1', onSocFloor)}
          {warRoom('redblue', 'r1', onRedBlue)}

          {/* Mid-corridor: the two places somebody uses every visit, and needs
              no explanation of. */}
          <Portal
            slot="l2"
            accent="cyan"
            title="Chat rooms"
            blurb="Step inside to see what each room is for, and say something."
            footnote={`${view.rooms.length} rooms open`}
            onEnter={onOpenChat}
          />
          <Portal
            slot="r2"
            accent="amber"
            title="Event centre"
            blurb="What is on this month, and the thing you wish somebody had scheduled."
            footnote="post and RSVP"
            onEnter={onOpenEvents}
          />

          {/* The far end: the two that are not built yet. Depth carries the
              meaning, so neither needs the word "later" on it. */}
          {warRoom('grc', 'l3')}
          {warRoom('ai', 'r3')}
        </div>

        <Drifters occupants={view.occupants} meId={me.userId} />

        <span className="hall__count">
          {view.occupants.length === 1
            ? 'you are the only one here'
            : `${view.occupants.length} in the hall`}
        </span>
      </div>

      {view.occupants.length === 1 ? (
        <p className="seat-note hall__alone">
          Nobody else is here yet. Leave something in a chat room or put an event on the calendar,
          and the next person through will find it waiting.
        </p>
      ) : null}
    </section>
  );
}

/**
 * Where a portal stands.
 *
 * `l`/`r` is the wall, `1` to `3` is how far down the corridor. Depth is the
 * only thing the number changes, and it changes it in CSS: the ring gets
 * smaller and dimmer, the plate does not, because a label somebody cannot read
 * is not a label.
 */
type BaySlot = 'l1' | 'l2' | 'l3' | 'r1' | 'r2' | 'r3';

/** One doorway in one alcove. */
function Portal({
  slot,
  accent,
  title,
  blurb,
  footnote,
  dormant = false,
  onEnter,
  wanted,
  onWant,
}: {
  slot: BaySlot;
  accent: string;
  title: string;
  blurb: string;
  footnote: string;
  dormant?: boolean;
  onEnter?: () => void;
  wanted?: boolean;
  onWant?: () => void;
}) {
  return (
    <div className={`bay bay--${slot} bay--${accent}${dormant ? ' bay--sealed' : ''}`}>
      <button
        type="button"
        className="bay__arch"
        onClick={onEnter}
        disabled={!onEnter}
        aria-label={dormant ? `${title}, not open yet` : `Enter ${title}`}
      >
        <span className="bay__mouth" aria-hidden="true" />
        <span className="bay__rim" aria-hidden="true" />
        <span className="bay__label">{dormant ? 'sealed' : 'enter'}</span>
      </button>

      <div className="bay__plate">
        <span className="bay__title">{title}</span>
        <span className="bay__blurb">{blurb}</span>
        <span className="bay__foot">{footnote}</span>
        {onWant ? (
          <button type="button" className={wanted ? 'linkish is-on' : 'linkish'} onClick={onWant}>
            {wanted ? 'Heading here' : 'I want this one'}
          </button>
        ) : null}
      </div>
    </div>
  );
}

/**
 * The people in the corridor.
 *
 * Position comes from a hash of the user id rather than from Math.random, so
 * nobody teleports across the floor every twenty seconds when the poll lands.
 * One id always stands in the same place, which is also what makes "the person
 * by the red portal" a thing somebody can say out loud.
 */
function Drifters({ occupants, meId }: { occupants: LobbyOccupant[]; meId: string }) {
  return (
    <div className="drifters">
      {occupants.map((occupant) => {
        const spot = placeOf(occupant.identity.userId);
        return (
          <div
            className={`drifter${occupant.identity.userId === meId ? ' drifter--me' : ''}`}
            key={occupant.identity.userId}
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              // Further back in the corridor means smaller, so a crowd reads as
              // a crowd standing in a space rather than as a row of stickers.
              '--scale': spot.scale,
              zIndex: Math.round(spot.scale * 100),
              animationDelay: `${spot.delay}s`,
              animationDuration: `${spot.duration}s`,
            } as React.CSSProperties}
          >
            <span
              className={`avatar avatar--${occupant.identity.avatarId} drifter__face`}
              aria-hidden="true"
            />
            <span className="drifter__name">{occupant.identity.callSign}</span>

            {/* Held badges, on hover. The corridor stays a place, and the fact
                somebody actually wants about a stranger is one gesture away. */}
            {occupant.badges.length > 0 ? (
              <span className="drifter__badges">
                {occupant.badges.map((badge) => (
                  <BadgePip key={badge.id} badge={badge} />
                ))}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

interface Spot {
  x: number;
  y: number;
  scale: number;
  delay: number;
  duration: number;
}

/** Stable pseudo-random placement, so nobody teleports between polls. */
function placeOf(userId: string): Spot {
  let hash = 2166136261;
  for (let i = 0; i < userId.length; i += 1) {
    hash ^= userId.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const a = (hash >>> 0) % 1000;
  const b = (hash >>> 10) % 1000;
  const c = (hash >>> 20) % 1000;
  const depth = b / 1000;
  return {
    // Kept off the edges so a call sign never runs under an alcove plate.
    x: 8 + (a / 1000) * 84,
    // Further up the corridor is further away, so y and scale move together.
    y: 6 + depth * 68,
    scale: 0.72 + (1 - depth) * 0.5,
    delay: -(c / 1000) * 9,
    duration: 7 + (a / 1000) * 6,
  };
}

/* --- the chat room list -------------------------------------------------- */

function ChatRooms({
  rooms: list,
  notice,
  onOpen,
}: {
  rooms: ChatRoom[];
  notice: string;
  onOpen: (roomId: string) => void;
}) {
  const [asking, setAsking] = useState(false);

  return (
    <section className="lobby__rooms">
      <h2 className="lobby__h">Chat rooms</h2>
      {/* Said before anybody types, not in a policy nobody opens. */}
      <p className="lobby__notice">{notice}</p>

      <ul className="roomsteps">
        {list.map((room) => (
          <li key={room.id}>
            <button type="button" className="roomstep" onClick={() => onOpen(room.id)}>
              <span className="roomstep__title">
                {room.title}
                {room.kind === 'community' ? <span className="roomstep__tag">community</span> : null}
              </span>
              <span className="roomstep__topic">{room.topic}</span>
              <span className="roomstep__meta">
                {room.messageCount === 0
                  ? 'no messages yet'
                  : `${room.messageCount} messages · last ${new Date(room.lastMessageAt!).toLocaleString()}`}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {asking ? (
        <RequestRoomForm onDone={() => setAsking(false)} />
      ) : (
        <button type="button" className="linkish" onClick={() => setAsking(true)}>
          Ask for a new room
        </button>
      )}

      <MyRequests />
    </section>
  );
}

/**
 * Asking for a room.
 *
 * The topic field is the important one and the form says so, because it is the
 * whole basis on which somebody approves or refuses. A reviewer looking at
 * "gaming" cannot tell a study group from a place to post links.
 */
function RequestRoomForm({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const local = checkChatRoomRequest(title, topic);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await lobby.requestRoom(title, topic);
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
        Request sent. Staff review it, and you will see the answer under &ldquo;your
        requests&rdquo; below.{' '}
        <button type="button" className="linkish" onClick={onDone}>
          Close
        </button>
      </p>
    );
  }

  return (
    <form className="roomrequest" onSubmit={(e) => void submit(e)}>
      <h3>Ask for a room</h3>
      <p className="lobby__hint">
        Every room here is public. Staff read the topic and decide, so write it as if you are
        explaining the room to somebody who has not thought about it.
      </p>

      <label>
        Room name
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={40} required />
      </label>

      <label>
        What do you want to discuss in it?
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          maxLength={CHAT_ROOM_TOPIC_MAX}
          rows={4}
          required
        />
      </label>
      <p className="roomrequest__count">
        {topic.trim().length} / {CHAT_ROOM_TOPIC_MIN} minimum
      </p>

      {title.trim() && topic.trim() && !local.ok ? (
        <p className="seat-note seat-note--bad">{local.problem}</p>
      ) : null}
      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      <div className="roomrequest__actions">
        <button type="submit" className="primary" disabled={busy || !local.ok}>
          {busy ? 'Sending…' : 'Send request'}
        </button>
        <button type="button" className="linkish" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/** A decision that never reaches the person who asked is indistinguishable from being ignored. */
function MyRequests() {
  const [list, setList] = useState<ChatRoom[]>([]);

  useEffect(() => {
    void lobby
      .myRequests()
      .then((result) => setList(result.requests))
      .catch(() => undefined);
  }, []);

  if (list.length === 0) return null;

  return (
    <div className="myrequests">
      <h3>Your requests</h3>
      <ul>
        {list.map((room) => (
          <li key={room.id}>
            <strong>{room.title}</strong>
            <span className={`reqstate reqstate--${room.status}`}>{room.status}</span>
            {room.reviewNote ? <span className="myrequests__note">{room.reviewNote}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
