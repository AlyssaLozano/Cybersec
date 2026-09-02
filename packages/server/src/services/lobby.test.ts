import { describe, expect, it } from 'vitest';

import {
  CORE_CHAT_ROOMS,
  LOBBY_DOORS,
  MESSAGE_MAX,
  PRESENCE_STALE_SECONDS,
  arrivalsBetween,
  checkChatRoomRequest,
  checkMessage,
  isLobbyDoorId,
  isPresent,
  slugifyRoomTitle,
} from '@soc/shared';
import type { LobbyOccupant } from '@soc/shared';

import { canReview } from './lobby.js';

describe('who may approve a room', () => {
  /*
   * An approved room is one everybody on the platform can post in, so this is
   * the privilege check that matters most in the lobby.
   */
  it('is staff, and never a student', () => {
    expect(canReview('admin')).toBe(true);
    expect(canReview('instructor')).toBe(true);
    expect(canReview('student')).toBe(false);
  });
});

describe('what somebody may say', () => {
  it('accepts an ordinary sentence', () => {
    expect(checkMessage('anyone up for a SOC room tonight?').ok).toBe(true);
  });

  it('refuses an empty message', () => {
    expect(checkMessage('   ').ok).toBe(false);
  });

  it('refuses one past the cap and says how long it was', () => {
    const result = checkMessage('x'.repeat(MESSAGE_MAX + 1));
    expect(result.ok).toBe(false);
    expect(result.problem).toContain(String(MESSAGE_MAX + 1));
  });
});

describe('asking for a chat room', () => {
  it('accepts a name and a real reason', () => {
    const result = checkChatRoomRequest(
      'Security+ study',
      'A place to work through Security+ practice questions together before the exam.',
    );
    expect(result.ok).toBe(true);
  });

  /*
   * The topic is the whole basis on which somebody approves or refuses, and
   * "chat" is not a basis.
   */
  it('refuses a topic too thin to decide on', () => {
    expect(checkChatRoomRequest('Gaming', 'games').ok).toBe(false);
  });

  it('refuses a name that is not sayable as a room', () => {
    expect(checkChatRoomRequest('<script>', 'A perfectly reasonable topic, at length.').ok).toBe(
      false,
    );
    expect(checkChatRoomRequest('  ', 'A perfectly reasonable topic, at length.').ok).toBe(false);
  });

  it('turns a name into an id that will survive being permanent', () => {
    expect(slugifyRoomTitle('Security+ study')).toBe('security-study');
    expect(slugifyRoomTitle('  Blue / Red  ')).toBe('blue-red');
    expect(slugifyRoomTitle('!!!')).toBe('');
  });
});

const NOW = new Date('2026-09-02T18:00:00Z');

function occupant(userId: string, secondsAgo: number): LobbyOccupant {
  return {
    identity: { userId, callSign: `Call${userId}`, avatarId: 'ash' },
    arrivedAt: new Date(NOW.getTime() - secondsAgo * 1000).toISOString(),
    lastSeenAt: new Date(NOW.getTime() - secondsAgo * 1000).toISOString(),
    headingFor: null,
    badges: [],
  };
}

describe('presence', () => {
  it('counts somebody who beat recently as here', () => {
    expect(isPresent(occupant('u1', 10), NOW)).toBe(true);
  });

  it('counts somebody who stopped beating as gone', () => {
    expect(isPresent(occupant('u1', PRESENCE_STALE_SECONDS + 5), NOW)).toBe(false);
  });

  /*
   * Arrivals are computed from a diff rather than written to the transcript,
   * so the room can animate somebody walking in without leaving door noise in
   * the chat log forever.
   */
  it('reports only the people who were not there last time', () => {
    const before = [occupant('u1', 30)];
    const after = [occupant('u1', 10), occupant('u2', 2)];
    expect(arrivalsBetween(before, after).map((o) => o.identity.userId)).toEqual(['u2']);
  });

  it('reports nobody when the room has not changed', () => {
    const same = [occupant('u1', 30)];
    expect(arrivalsBetween(same, same)).toEqual([]);
  });
});

describe('the lobby furniture', () => {
  it('recognises its own doors and nothing else', () => {
    for (const door of LOBBY_DOORS) expect(isLobbyDoorId(door.id)).toBe(true);
    expect(isLobbyDoorId('kitchen')).toBe(false);
  });

  it('seeds core rooms with unique ids and a topic each', () => {
    const ids = CORE_CHAT_ROOMS.map((room) => room.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const room of CORE_CHAT_ROOMS) {
      // A bare name makes everybody guess, and the guess is what fills a lobby
      // with six rooms for one idea.
      expect(room.topic.length, room.id).toBeGreaterThan(20);
      expect(slugifyRoomTitle(room.id)).toBe(room.id);
    }
  });
});
