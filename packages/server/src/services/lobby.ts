/**
 * The lobby: who is standing in it, what is being said, and which rooms exist.
 *
 * WHY EVERY RULE HERE IS SERVER-SIDE
 *
 * The same reason the terminal engine is. A client that decides its own rate
 * limit has no rate limit, a client that decides which rooms are approved can
 * post into a room nobody approved, and a client that reports its own presence
 * can fill the lobby with people who are not there. All of it is cheap to
 * enforce here and impossible to enforce there.
 *
 * WHY POLLING AND NOT SOCKETS
 *
 * A socket is the right answer eventually and the wrong answer now: it brings
 * connection state, reconnect handling, and a deployment shape this product
 * does not have. Presence is a heartbeat with an expiry, and chat is a cursor
 * over an append-only table. Both are correct under polling, both survive a
 * dropped network without any recovery code, and the seam is small enough that
 * swapping the transport later touches this file and nothing else.
 */

import type {
  ChatMessage,
  ChatRoom,
  FloorIdentity,
  LobbyDoor,
  LobbyDoorId,
  LobbyOccupant,
  LobbyView,
  UserRole,
} from '@soc/shared';
import {
  CORE_CHAT_ROOMS,
  LOBBY_DOORS,
  MESSAGES_PER_MINUTE,
  PRESENCE_STALE_SECONDS,
  checkChatRoomRequest,
  checkMessage,
  isAvatarId,
  isLobbyDoorId,
  slugifyRoomTitle,
} from '@soc/shared';

import { prisma } from '../db/client.js';
import { pinnedFor } from './badges.js';

/** Thrown for a rule a person could have broken. The message is shown to them. */
export class LobbyError extends Error {}

/**
 * Who may approve a chat room.
 *
 * Instructors as well as admins, because the person who notices that a cohort
 * wants a room for their study group is the person teaching them, and routing
 * every request through one account makes the queue somebody's second job.
 */
const REVIEWER_ROLES: readonly UserRole[] = ['instructor', 'admin'];

export function canReview(role: UserRole): boolean {
  return REVIEWER_ROLES.includes(role);
}

/* --- rooms ------------------------------------------------------------- */

/**
 * Make sure the seeded rooms exist.
 *
 * Runs on the way into the lobby rather than in the database seed, because the
 * list lives in code and grows: a room added to CORE_CHAT_ROOMS next month has
 * to appear on an existing deployment without anybody remembering to re-seed.
 * Title and topic are written every time on purpose -- for a core room, the
 * code is the source of truth.
 */
export async function ensureCoreRooms(): Promise<void> {
  for (const room of CORE_CHAT_ROOMS) {
    await prisma.chatRoom.upsert({
      where: { id: room.id },
      create: {
        id: room.id,
        title: room.title,
        topic: room.topic,
        kind: 'core',
        status: 'approved',
      },
      update: { title: room.title, topic: room.topic, kind: 'core', status: 'approved' },
    });
  }

  /*
   * A core room dropped from the list is CLOSED, never deleted.
   *
   * The list shrinks as well as grows, and a deployment that had six seeded
   * rooms must end up showing the two that are left. Closing takes them off the
   * list and stops new posts while keeping every message anybody wrote in them:
   * deleting would cascade the transcript, and a decision to simplify a room
   * list is not a decision to destroy conversations. A room that comes back
   * later reopens with its history intact, because the id is the same.
   */
  await prisma.chatRoom.updateMany({
    where: { kind: 'core', id: { notIn: CORE_CHAT_ROOMS.map((room) => room.id) } },
    data: { status: 'closed' },
  });
}

interface ChatRoomRow {
  id: string;
  title: string;
  topic: string;
  kind: string;
  status: string;
  requestedByUserId: string | null;
  requestedCallSign: string | null;
  requestedAvatarId: string | null;
  reviewedAt: Date | null;
  reviewNote: string | null;
  createdAt: Date;
}

function rowToRoom(row: ChatRoomRow, messageCount: number, lastMessageAt: Date | null): ChatRoom {
  return {
    id: row.id,
    title: row.title,
    topic: row.topic,
    kind: row.kind as ChatRoom['kind'],
    status: row.status as ChatRoom['status'],
    requestedBy:
      row.requestedByUserId && row.requestedCallSign && isAvatarId(row.requestedAvatarId ?? '')
        ? {
            userId: row.requestedByUserId,
            callSign: row.requestedCallSign,
            avatarId: row.requestedAvatarId as FloorIdentity['avatarId'],
          }
        : null,
    createdAt: row.createdAt.toISOString(),
    reviewedAt: row.reviewedAt?.toISOString() ?? null,
    reviewNote: row.reviewNote,
    messageCount,
    lastMessageAt: lastMessageAt?.toISOString() ?? null,
  };
}

/**
 * Activity per room, in one query rather than one per room.
 *
 * The room list is rendered on every lobby poll, so an N+1 here is an N+1 on a
 * four-second timer for everybody in the building.
 */
async function activityByRoom(): Promise<Map<string, { count: number; last: Date | null }>> {
  const grouped = await prisma.chatMessage.groupBy({
    by: ['roomId'],
    where: { hidden: false },
    _count: { _all: true },
    _max: { sentAt: true },
  });
  return new Map(
    grouped.map((row) => [row.roomId, { count: row._count._all, last: row._max.sentAt ?? null }]),
  );
}

/**
 * The rooms somebody can walk into.
 *
 * Approved only. A pending room is a request, not a place, and listing it would
 * mean people arrive in a room that may never be approved and lose whatever
 * they said in it.
 */
export async function listRooms(): Promise<ChatRoom[]> {
  const [rows, activity] = await Promise.all([
    prisma.chatRoom.findMany({ where: { status: 'approved' }, orderBy: { createdAt: 'asc' } }),
    activityByRoom(),
  ]);

  const coreOrder = new Map(CORE_CHAT_ROOMS.map((room, index) => [room.id, index]));
  return rows
    .map((row) => {
      const stats = activity.get(row.id);
      return rowToRoom(row, stats?.count ?? 0, stats?.last ?? null);
    })
    .sort((a, b) => {
      // Core rooms in their declared order, then community rooms by how alive
      // they are. A newcomer should land on a list whose top is worth reading.
      const ai = coreOrder.get(a.id);
      const bi = coreOrder.get(b.id);
      if (ai !== undefined && bi !== undefined) return ai - bi;
      if (ai !== undefined) return -1;
      if (bi !== undefined) return 1;
      return (b.lastMessageAt ?? '').localeCompare(a.lastMessageAt ?? '');
    });
}

/** Requests waiting on a decision, oldest first: a queue, not a stack. */
export async function pendingRooms(): Promise<ChatRoom[]> {
  const rows = await prisma.chatRoom.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'asc' },
  });
  return rows.map((row) => rowToRoom(row, 0, null));
}

export async function pendingRoomCount(): Promise<number> {
  return prisma.chatRoom.count({ where: { status: 'pending' } });
}

/**
 * Ask for a room.
 *
 * The topic is the whole basis of the decision, which is why it is required and
 * why the minimum length is not three characters. A reviewer looking at "gaming"
 * cannot tell a study group from a place to post links.
 */
export async function requestRoom(
  identity: FloorIdentity,
  title: string,
  topic: string,
): Promise<ChatRoom> {
  const check = checkChatRoomRequest(title, topic);
  if (!check.ok) throw new LobbyError(check.problem ?? 'That request will not work.');

  // One open request at a time. Somebody who has asked for four rooms has not
  // been refused four times, they have been waiting once, and a queue of near
  // duplicates from one person is the thing review exists to prevent.
  const outstanding = await prisma.chatRoom.count({
    where: { requestedByUserId: identity.userId, status: 'pending' },
  });
  if (outstanding > 0) {
    throw new LobbyError('You already have a room request waiting. See how that one goes first.');
  }

  const base = slugifyRoomTitle(title) || 'room';
  // The id is permanent because messages carry it, so the collision is resolved
  // once, here, and never revisited.
  let id = base;
  for (let suffix = 2; await prisma.chatRoom.findUnique({ where: { id } }); suffix += 1) {
    id = `${base}-${suffix}`;
    if (suffix > 50) throw new LobbyError('Too many rooms with that name. Try another.');
  }

  const row = await prisma.chatRoom.create({
    data: {
      id,
      title: title.trim(),
      topic: topic.trim(),
      kind: 'community',
      status: 'pending',
      requestedByUserId: identity.userId,
      requestedCallSign: identity.callSign,
      requestedAvatarId: identity.avatarId,
    },
  });
  return rowToRoom(row, 0, null);
}

/** Requests this person made, so a decision reaches them rather than vanishing. */
export async function myRoomRequests(userId: string): Promise<ChatRoom[]> {
  const rows = await prisma.chatRoom.findMany({
    where: { requestedByUserId: userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  return rows.map((row) => rowToRoom(row, 0, null));
}

export type RoomDecision = 'approve' | 'reject';

/**
 * Approve or refuse a request.
 *
 * A refusal carries a note. "No" with no reason is indistinguishable from being
 * ignored, and somebody who cannot tell the difference asks again next week.
 */
export async function reviewRoom(
  roomId: string,
  reviewerId: string,
  decision: RoomDecision,
  note: string | null,
): Promise<ChatRoom> {
  const row = await prisma.chatRoom.findUnique({ where: { id: roomId } });
  if (!row) throw new LobbyError('No such room request.');
  if (row.kind === 'core') throw new LobbyError('Core rooms are not reviewed.');
  if (row.status !== 'pending') throw new LobbyError('That request has already been decided.');
  if (decision === 'reject' && !note?.trim()) {
    throw new LobbyError('Say why, so the person who asked knows what to do differently.');
  }

  const updated = await prisma.chatRoom.update({
    where: { id: roomId },
    data: {
      status: decision === 'approve' ? 'approved' : 'rejected',
      reviewedByUserId: reviewerId,
      reviewedAt: new Date(),
      reviewNote: note?.trim() || null,
    },
  });
  return rowToRoom(updated, 0, null);
}

/**
 * Close an approved community room.
 *
 * Closed rather than deleted: the messages happened, and a room that vanishes
 * takes an argument's context with it. A closed room stops accepting posts and
 * drops off the list.
 */
export async function closeRoom(roomId: string, reviewerId: string, note: string): Promise<void> {
  const row = await prisma.chatRoom.findUnique({ where: { id: roomId } });
  if (!row) throw new LobbyError('No such room.');
  if (row.kind === 'core') throw new LobbyError('Core rooms cannot be closed.');
  await prisma.chatRoom.update({
    where: { id: roomId },
    data: { status: 'closed', reviewedByUserId: reviewerId, reviewNote: note.trim() || null },
  });
}

/* --- messages ---------------------------------------------------------- */

/** How many messages one read returns. Enough to fill a screen on arrival. */
const PAGE = 60;

function rowToMessage(row: {
  id: string;
  roomId: string;
  userId: string;
  callSign: string;
  avatarId: string;
  body: string;
  eventId: string | null;
  sentAt: Date;
}): ChatMessage {
  return {
    id: row.id,
    roomId: row.roomId,
    author: {
      userId: row.userId,
      callSign: row.callSign,
      // The avatar is denormalised, so a value that is no longer in the set
      // (renamed art, say) must not break a whole transcript. Fall back rather
      // than throw: a wrong picture beats an unreadable room.
      avatarId: isAvatarId(row.avatarId) ? row.avatarId : 'ash',
    },
    body: row.body,
    sentAt: row.sentAt.toISOString(),
    eventId: row.eventId,
  };
}

/**
 * Read a room.
 *
 * `afterId` is a cursor rather than a timestamp because two messages can share
 * a millisecond, and a timestamp cursor drops one of them silently. Without a
 * cursor this returns the tail, which is what somebody walking in wants.
 */
export async function readRoom(roomId: string, afterId: string | null): Promise<ChatMessage[]> {
  const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
  if (!room || room.status !== 'approved') throw new LobbyError('That room is not open.');

  if (afterId) {
    const rows = await prisma.chatMessage.findMany({
      where: { roomId, hidden: false },
      orderBy: [{ sentAt: 'asc' }, { id: 'asc' }],
      cursor: { id: afterId },
      skip: 1,
      take: PAGE,
    });
    return rows.map(rowToMessage);
  }

  const rows = await prisma.chatMessage.findMany({
    where: { roomId, hidden: false },
    orderBy: [{ sentAt: 'desc' }, { id: 'desc' }],
    take: PAGE,
  });
  return rows.reverse().map(rowToMessage);
}

/**
 * Say something.
 *
 * The rate limit is counted server-side over the last minute across every room,
 * not per room: somebody flooding six rooms at ten messages each is flooding.
 */
export async function postMessage(
  roomId: string,
  identity: FloorIdentity,
  body: string,
  eventId: string | null,
  now: Date,
): Promise<ChatMessage> {
  const check = checkMessage(body);
  if (!check.ok) throw new LobbyError(check.problem ?? 'That message will not send.');

  const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
  if (!room || room.status !== 'approved') throw new LobbyError('That room is not open.');

  const recent = await prisma.chatMessage.count({
    where: { userId: identity.userId, sentAt: { gt: new Date(now.getTime() - 60_000) } },
  });
  if (recent >= MESSAGES_PER_MINUTE) {
    throw new LobbyError('You are sending faster than the room can read. Give it a moment.');
  }

  const row = await prisma.chatMessage.create({
    data: {
      roomId,
      userId: identity.userId,
      callSign: identity.callSign,
      avatarId: identity.avatarId,
      body: body.trim(),
      eventId,
    },
  });
  return rowToMessage(row);
}

/**
 * Hide a message.
 *
 * Hidden rather than deleted, so a moderation call is auditable and reversible.
 * A hidden row never leaves the server.
 */
export async function hideMessage(messageId: string): Promise<void> {
  await prisma.chatMessage.update({ where: { id: messageId }, data: { hidden: true } });
}

/* --- presence ---------------------------------------------------------- */

/**
 * Walk in, or say you are still here.
 *
 * `arrivedAt` is only set on the way in. A heartbeat that reset it would
 * re-announce everybody in the room every twenty seconds, which is the one
 * thing an arrival animation must not do.
 */
export async function heartbeat(
  identity: FloorIdentity,
  headingFor: LobbyDoorId | null,
  now: Date,
): Promise<void> {
  const existing = await prisma.lobbyPresence.findUnique({ where: { userId: identity.userId } });
  const stillHere =
    existing !== null &&
    now.getTime() - existing.lastSeenAt.getTime() < PRESENCE_STALE_SECONDS * 1000;

  await prisma.lobbyPresence.upsert({
    where: { userId: identity.userId },
    create: {
      userId: identity.userId,
      callSign: identity.callSign,
      avatarId: identity.avatarId,
      headingFor,
      arrivedAt: now,
      lastSeenAt: now,
    },
    update: {
      callSign: identity.callSign,
      avatarId: identity.avatarId,
      headingFor,
      // Somebody who went stale and came back walked in again, and the room
      // should say so. Somebody mid-session did not.
      ...(stillHere ? {} : { arrivedAt: now }),
      lastSeenAt: now,
    },
  });
}

/** Leave deliberately, rather than fading out over seventy-five seconds. */
export async function leaveLobby(userId: string): Promise<void> {
  await prisma.lobbyPresence.deleteMany({ where: { userId } });
}

async function occupants(now: Date): Promise<LobbyOccupant[]> {
  const cutoff = new Date(now.getTime() - PRESENCE_STALE_SECONDS * 1000);
  const rows = await prisma.lobbyPresence.findMany({
    where: { lastSeenAt: { gte: cutoff } },
    orderBy: { arrivedAt: 'asc' },
    take: 200,
  });

  const badges = await pinnedFor(rows.map((row) => row.userId));

  return rows.map((row) => ({
    identity: {
      userId: row.userId,
      callSign: row.callSign,
      avatarId: isAvatarId(row.avatarId) ? row.avatarId : 'ash',
    },
    arrivedAt: row.arrivedAt.toISOString(),
    lastSeenAt: row.lastSeenAt.toISOString(),
    headingFor:
      row.headingFor && isLobbyDoorId(row.headingFor) ? (row.headingFor as LobbyDoorId) : null,
    badges: badges.get(row.userId) ?? [],
  }));
}

/**
 * Everything the lobby screen needs, in one response.
 *
 * One call rather than four, because they are polled together and four
 * round-trips on a timer is how a room of thirty people becomes a load problem.
 * It also means the occupant list and the door counts can never disagree.
 */
export async function lobbyView(
  identity: FloorIdentity,
  role: UserRole,
  now: Date,
): Promise<LobbyView> {
  await ensureCoreRooms();

  const [present, rooms, pending] = await Promise.all([
    occupants(now),
    listRooms(),
    canReview(role) ? pendingRoomCount() : Promise.resolve(0),
  ]);

  const doors: LobbyDoor[] = LOBBY_DOORS.map((door) => ({
    id: door.id,
    title: door.title,
    blurb: door.blurb,
    state: door.state,
    accent: door.accent,
    // The whole reason the lobby exists: seeing that two other people are
    // waiting on a SOC room is what turns three separate abandonments into one
    // session.
    heading: present.filter((occupant) => occupant.headingFor === door.id).length,
  }));

  const me =
    present.find((occupant) => occupant.identity.userId === identity.userId) ??
    // Defensive: a view asked for before the first heartbeat lands. Drawing the
    // viewer as absent from a room they are looking at would be nonsense.
    {
      identity,
      arrivedAt: now.toISOString(),
      lastSeenAt: now.toISOString(),
      headingFor: null,
      badges: [],
    };

  return { occupants: present, doors, rooms, me, pendingRoomCount: pending, canReview: canReview(role) };
}
