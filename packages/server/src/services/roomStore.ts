/**
 * Persistence for war rooms, and the one place that decides what a room looks
 * like from the outside.
 *
 * WHY THE JOIN CODE PROJECTION LIVES HERE
 *
 * A closed room exists so that a class, a cohort or a team can run a session
 * without a stranger taking the lead chair ten seconds before it starts. That
 * protection is one string long. Send `joinCode` on a room listing and closed
 * rooms stop being closed, silently, for everybody at once, and nothing about
 * the interface would look wrong.
 *
 * So the room shape that leaves this module never carries the code except to
 * the host, in the same way `toStudentView()` is the single gate on exercise
 * answers. `toClientRoom` is that gate. Adding a route that returns a raw
 * `RoomSession` is the mistake this comment exists to prevent.
 *
 * WHY SEATS ARE A JSON BLOB
 *
 * Seats are read and written as one unit and are never queried across rooms.
 * A table would buy nothing and cost a join on every seat change, and the seat
 * chart is meaningless outside its room.
 */

import { AVATARS, checkCallSign, isAvatarId } from '@soc/shared';
import type {
  LeadReadout,
  AvatarId,
  FloorIdentity,
  RoomSession,
  RoomVisibility,
  ScenarioDifficulty,
  SeatAssignment,
} from '@soc/shared';

import { prisma } from '../db/client.js';
import { RoomError, scheduleRoom } from './rooms.js';

/** A room as the browser is allowed to see it. */
export interface ClientRoom extends Omit<RoomSession, 'joinCode'> {
  scenarioTitle: string;
  /** Present only for the host. Everybody else gets null, including occupants. */
  joinCode: string | null;
  seatsTotal: number;
  seatsFilled: number;
  isHost: boolean;
  /** The role this viewer holds in this room, or null. */
  mySeat: string | null;
}

interface RoomRow {
  id: string;
  scenarioId: string;
  difficulty: string;
  startsAt: Date;
  visibility: string;
  joinCode: string | null;
  status: string;
  hostUserId: string;
  seatsJson: string;
  readoutJson: string | null;
  closedAtSeconds: number | null;
}

function rowToRoom(row: RoomRow): RoomSession {
  return {
    id: row.id,
    scenarioId: row.scenarioId,
    difficulty: row.difficulty as ScenarioDifficulty,
    startsAt: row.startsAt.toISOString(),
    visibility: row.visibility as RoomVisibility,
    joinCode: row.joinCode,
    status: row.status as RoomSession['status'],
    hostUserId: row.hostUserId,
    seats: JSON.parse(row.seatsJson) as SeatAssignment[],
    readout: row.readoutJson ? (JSON.parse(row.readoutJson) as LeadReadout) : null,
    closedAtSeconds: row.closedAtSeconds,
  };
}

/**
 * Project a room for a viewer.
 *
 * The `viewerId` argument is not optional on purpose. An overload that omits it
 * would be used, and the omission would be the leak.
 */
export function toClientRoom(
  room: RoomSession,
  viewerId: string,
  scenarioTitle: string,
): ClientRoom {
  const isHost = room.hostUserId === viewerId;
  return {
    id: room.id,
    scenarioId: room.scenarioId,
    scenarioTitle,
    difficulty: room.difficulty,
    startsAt: room.startsAt,
    visibility: room.visibility,
    joinCode: isHost ? room.joinCode : null,
    status: room.status,
    hostUserId: room.hostUserId,
    seats: room.seats,
    seatsTotal: room.seats.length,
    seatsFilled: room.seats.filter((s) => s.occupant).length,
    isHost,
    mySeat: room.seats.find((s) => s.occupant?.userId === viewerId)?.role ?? null,
  };
}

export async function getRoom(id: string): Promise<RoomSession | null> {
  const row = await prisma.roomSession.findUnique({ where: { id } });
  return row ? rowToRoom(row) : null;
}

/**
 * Rooms worth showing somebody.
 *
 * Open rooms that have not finished, plus closed rooms this person hosts or
 * already holds a seat in. A closed room they have no connection to is not
 * listed at all: showing it and refusing entry tells a stranger that a private
 * session exists, which is most of what the code was protecting.
 */
export async function listVisibleRooms(userId: string, now: Date): Promise<RoomSession[]> {
  const rows = await prisma.roomSession.findMany({
    where: {
      status: { in: ['scheduled', 'running'] },
      startsAt: { gte: new Date(now.getTime() - 4 * 60 * 60 * 1000) },
    },
    orderBy: { startsAt: 'asc' },
    take: 100,
  });

  return rows
    .map(rowToRoom)
    .filter(
      (room) =>
        room.visibility === 'open' ||
        room.hostUserId === userId ||
        room.seats.some((s) => s.occupant?.userId === userId),
    );
}

export async function createRoom(input: {
  scenarioId: string;
  difficulty: ScenarioDifficulty;
  startsAt: string;
  visibility: RoomVisibility;
  host: FloorIdentity;
  now: Date;
}): Promise<RoomSession> {
  const room = scheduleRoom(input);
  await prisma.roomSession.create({
    data: {
      id: room.id,
      scenarioId: room.scenarioId,
      difficulty: room.difficulty,
      startsAt: new Date(room.startsAt),
      visibility: room.visibility,
      joinCode: room.joinCode,
      status: room.status,
      hostUserId: room.hostUserId,
      seatsJson: JSON.stringify(room.seats),
    },
  });
  return room;
}

/** Write a room back after a seating change. */
export async function persistRoom(room: RoomSession): Promise<RoomSession> {
  await prisma.roomSession.update({
    where: { id: room.id },
    data: {
      status: room.status,
      joinCode: room.joinCode,
      seatsJson: JSON.stringify(room.seats),
      /*
       * Written once and never rewritten. The readout is what the lead said
       * before seeing the answer key, so an update path that could overwrite it
       * would let a floor revise its own conclusions after reading the review.
       */
      ...(room.readout ? { readoutJson: JSON.stringify(room.readout) } : {}),
      ...(room.closedAtSeconds != null ? { closedAtSeconds: room.closedAtSeconds } : {}),
    },
  });
  return room;
}

/**
 * The name and face this person uses on a floor.
 *
 * Chosen on the way into a first room rather than at signup. Somebody
 * registering for a learning platform has not yet seen the thing a call sign is
 * for, and a required field they cannot evaluate is a field they fill in badly
 * and then want to change.
 */
export async function getIdentity(userId: string): Promise<FloorIdentity | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { callSign: true, avatarId: true },
  });
  if (!user?.callSign || !user.avatarId || !isAvatarId(user.avatarId)) return null;
  return { userId, callSign: user.callSign, avatarId: user.avatarId };
}

export async function setIdentity(
  userId: string,
  callSign: string,
  avatarId: string,
): Promise<FloorIdentity> {
  const value = callSign.trim();
  const check = checkCallSign(value);
  if (!check.ok) throw new RoomError(check.problem ?? 'That call sign will not work.');
  if (!isAvatarId(avatarId)) {
    throw new RoomError(`Pick one of: ${AVATARS.join(', ')}.`);
  }

  // Uniqueness is enforced by the database, because two people choosing the
  // same call sign in the same second is exactly the case a read-then-write
  // check misses, and on a floor two voices answering to one name is worse
  // than a rejected form.
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { callSign: value, avatarId },
    });
  } catch {
    throw new RoomError(`Somebody is already using "${value}". Pick another.`);
  }

  return { userId, callSign: value, avatarId: avatarId as AvatarId };
}
