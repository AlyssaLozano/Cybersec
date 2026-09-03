/**
 * Persistence for claims committed during a live shift.
 *
 * WHY A CLAIM IS WRITE ONCE
 *
 * A claim is scored on what the seat said and how long they took, so a row
 * that could be rewritten would let a late or wrong claim be quietly corrected
 * after the fact. The unique constraint on (room, event, role) is the whole
 * guard: a second attempt from the same seat on the same event is refused by
 * the database rather than by a check somebody could forget to write.
 *
 * Two different seats may still claim one event two different ways, which is
 * not a conflict but the point. `contestedEvents` in services/scenarios.ts is
 * what that disagreement feeds, and a floor where two people read one moment
 * differently is the situation the whole projection model exists to create.
 */

import type { Claim, SocRoleId } from '@soc/shared';

import { prisma } from '../db/client.js';
import { RoomError } from './rooms.js';

export async function recordClaim(
  roomId: string,
  userId: string,
  claim: Claim,
): Promise<void> {
  try {
    await prisma.roomClaim.create({
      data: {
        roomId,
        eventId: claim.eventId,
        role: claim.role,
        userId,
        disposition: claim.disposition,
        reasoning: claim.reasoning,
        actionIdsJson: JSON.stringify(claim.actionIds),
        escalateTo: claim.escalateTo,
        confidence: claim.confidence,
        atSeconds: claim.atSeconds,
      },
    });
  } catch {
    // The unique constraint is the only realistic failure here, and it means
    // exactly one thing worth telling the seat.
    throw new RoomError('You have already claimed that event. A claim is final.');
  }
}

/** Event ids this seat has already committed on, so the board can mark them. */
export async function claimedEventIds(roomId: string, role: SocRoleId): Promise<string[]> {
  const rows = await prisma.roomClaim.findMany({
    where: { roomId, role },
    select: { eventId: true },
  });
  return rows.map((r) => r.eventId);
}

/** Every claim in the room, for the debrief and the after action review. */
export async function claimsForRoom(roomId: string): Promise<Claim[]> {
  const rows = await prisma.roomClaim.findMany({
    where: { roomId },
    orderBy: { atSeconds: 'asc' },
  });
  return rows.map((r) => ({
    eventId: r.eventId,
    role: r.role as SocRoleId,
    disposition: r.disposition as Claim['disposition'],
    reasoning: r.reasoning,
    actionIds: JSON.parse(r.actionIdsJson) as string[],
    escalateTo: (r.escalateTo as SocRoleId | null) ?? null,
    confidence: r.confidence,
    atSeconds: r.atSeconds,
  }));
}
