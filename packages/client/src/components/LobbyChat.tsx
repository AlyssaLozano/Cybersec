/**
 * One chat room.
 *
 * WHY THE TRANSCRIPT IS APPENDED TO AND NEVER REFETCHED
 *
 * Polling that re-reads the whole room every four seconds throws away the
 * scroll position, the selection, and any message somebody was half way through
 * copying. The cursor is a message id rather than a timestamp because two
 * messages can share a millisecond, and a timestamp cursor drops one of them
 * silently: see readRoom in services/lobby.ts.
 *
 * WHY THE PUBLIC NOTICE SITS ABOVE THE COMPOSER
 *
 * Not in a policy page. The moment somebody is about to type is the only moment
 * the warning is worth anything, and a person who learns afterwards that staff
 * can read the room has been misled by omission.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { CHAT_ROOM_PUBLIC_NOTICE, MESSAGE_MAX, checkMessage } from '@soc/shared';
import type { ChatMessage, ChatRoom, CommunityEvent, FloorIdentity } from '@soc/shared';

import { ApiCallError, events as eventsApi, lobby } from '../lib/api';

/** Slower than presence: a chat room is read, and a rapid redraw is unreadable. */
const POLL_MS = 4000;

interface LobbyChatProps {
  room: ChatRoom;
  identity: FloorIdentity;
  /** Staff can hide a message. Everybody else never sees the control. */
  canReview: boolean;
  onBack: () => void;
}

export function LobbyChat({ room, identity, canReview, onBack }: LobbyChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  /** Events referenced by shared messages, fetched once each. */
  const [shared, setShared] = useState<Record<string, CommunityEvent>>({});

  const cursor = useRef<string | null>(null);
  /**
   * Whether a read is already in the air.
   *
   * Two reads that start before either finishes both carry the same cursor, so
   * both come back with the same batch and both append it. That is not a
   * hypothetical: a poll landing at the same moment as a room change does it,
   * and React's development double-mount does it every single time. The flag
   * stops the second read, and the id check below is the backstop for the case
   * where one slips through anyway.
   */
  const pulling = useRef(false);
  const bottom = useRef<HTMLDivElement | null>(null);
  /**
   * Whether the reader is at the bottom.
   *
   * Auto-scrolling somebody who has deliberately scrolled up to read something
   * is the single most annoying thing a chat window can do, so new messages
   * only pull the view when they were already following along.
   */
  const following = useRef(true);

  const pull = useCallback(async () => {
    if (pulling.current) return;
    pulling.current = true;
    try {
      const { messages: batch } = await lobby.messages(room.id, cursor.current);
      if (batch.length === 0) return;
      cursor.current = batch[batch.length - 1]!.id;
      setMessages((current) => {
        const seen = new Set(current.map((message) => message.id));
        const fresh = batch.filter((message) => !seen.has(message.id));
        return fresh.length === 0 ? current : [...current, ...fresh];
      });
      setError(null);
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'Lost the room.');
    } finally {
      pulling.current = false;
    }
  }, [room.id]);

  useEffect(() => {
    cursor.current = null;
    pulling.current = false;
    setMessages([]);
    void pull();
    const timer = window.setInterval(() => void pull(), POLL_MS);
    return () => window.clearInterval(timer);
  }, [pull]);

  /* Resolve any event a message shared, once per event. */
  useEffect(() => {
    const wanted = messages
      .map((message) => message.eventId)
      .filter((id): id is string => typeof id === 'string' && !(id in shared));
    if (wanted.length === 0) return;
    for (const id of new Set(wanted)) {
      void eventsApi
        .get(id)
        .then((result) => setShared((current) => ({ ...current, [id]: result.event })))
        .catch(() => undefined);
    }
  }, [messages, shared]);

  useEffect(() => {
    if (following.current) bottom.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  const local = checkMessage(draft);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!local.ok) return;
    setSending(true);
    setError(null);
    try {
      const { message } = await lobby.say(room.id, draft);
      // Appended straight away rather than waiting for the next poll: a
      // four-second gap between pressing send and seeing your own sentence
      // reads as a failure, and people send it twice. Guarded by id, because a
      // poll already in the air will return this same message.
      cursor.current = message.id;
      setMessages((current) =>
        current.some((entry) => entry.id === message.id) ? current : [...current, message],
      );
      setDraft('');
      following.current = true;
    } catch (caught) {
      setError(caught instanceof ApiCallError ? caught.error.message : 'That did not send.');
    } finally {
      setSending(false);
    }
  }

  async function hide(messageId: string) {
    try {
      await lobby.hideMessage(messageId);
      setMessages((current) => current.filter((message) => message.id !== messageId));
    } catch {
      setError('Could not hide that.');
    }
  }

  return (
    <div className="chatroom">
      <header className="chatroom__head">
        <button type="button" className="linkish" onClick={onBack}>
          &larr; Lobby
        </button>
        <div>
          <h2>{room.title}</h2>
          <p className="chatroom__topic">{room.topic}</p>
        </div>
      </header>

      <div
        className="chatroom__log"
        onScroll={(scrollEvent) => {
          const element = scrollEvent.currentTarget;
          following.current =
            element.scrollHeight - element.scrollTop - element.clientHeight < 60;
        }}
      >
        {messages.length === 0 ? (
          <p className="seat-note">
            Nothing here yet. Somebody has to go first, and the room reads better when they do.
          </p>
        ) : null}

        {messages.map((message, index) => {
          // Consecutive lines from one person lose the repeated name and face:
          // a transcript that restates the speaker every sentence reads as a
          // list of records rather than as somebody talking.
          const previous = messages[index - 1];
          const runOn =
            previous?.author.userId === message.author.userId &&
            new Date(message.sentAt).getTime() - new Date(previous.sentAt).getTime() < 4 * 60_000;
          const event = message.eventId ? shared[message.eventId] : undefined;

          return (
            <article
              className={`say${runOn ? ' say--runon' : ''}${
                message.author.userId === identity.userId ? ' say--mine' : ''
              }`}
              key={message.id}
            >
              {runOn ? (
                <span className="say__spacer" aria-hidden="true" />
              ) : (
                <span
                  className={`avatar avatar--${message.author.avatarId} say__face`}
                  aria-hidden="true"
                />
              )}
              <div className="say__body">
                {runOn ? null : (
                  <span className="say__who">
                    <strong>{message.author.callSign}</strong>
                    <time dateTime={message.sentAt}>
                      {new Date(message.sentAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </span>
                )}
                <p className="say__text">{message.body}</p>
                {event ? <SharedEvent event={event} /> : null}
              </div>
              {canReview ? (
                <button
                  type="button"
                  className="say__hide"
                  title="Hide this message"
                  onClick={() => void hide(message.id)}
                >
                  hide
                </button>
              ) : null}
            </article>
          );
        })}
        <div ref={bottom} />
      </div>

      {error ? <p className="seat-note seat-note--bad">{error}</p> : null}

      <form className="chatroom__compose" onSubmit={(e) => void send(e)}>
        <p className="chatroom__public">{CHAT_ROOM_PUBLIC_NOTICE}</p>
        <div className="chatroom__row">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={MESSAGE_MAX}
            placeholder={`Say something in ${room.title}`}
            aria-label={`Message ${room.title}`}
          />
          <button type="submit" className="primary" disabled={sending || !local.ok}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

/** An event somebody dropped into the room, drawn as the thing rather than a line of text. */
function SharedEvent({ event }: { event: CommunityEvent }) {
  return (
    <div className={`sharedevent${event.cancelledAt ? ' sharedevent--off' : ''}`}>
      <span className="sharedevent__when">
        {new Date(event.startsAt).toLocaleString([], {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
      <span className="sharedevent__title">{event.title}</span>
      <span className="sharedevent__meta">
        {event.cancelledAt ? 'cancelled' : `${event.goingCount} going`} &middot; hosted by{' '}
        {event.host.callSign}
      </span>
    </div>
  );
}
