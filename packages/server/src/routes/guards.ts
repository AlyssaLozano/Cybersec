/**
 * Guards every shared space applies before letting somebody in.
 *
 * WHY THIS IS A HELPER AND NOT A MIDDLEWARE
 *
 * A router-wide middleware would be shorter and would also refuse the reads a
 * suspended person is entitled to: their own past reviews, their own history,
 * the scenario catalogue. Somebody suspended from the rooms has not lost the
 * record of the rooms they already ran, and a blanket 403 on a router takes
 * that away by accident.
 *
 * So the guard is called at the specific points where somebody enters a space
 * or speaks in one. That list is short, and being explicit about it is what
 * lets the next person adding a room type see they have to call it too.
 */

import { API_ERROR_CODES } from '@soc/shared';

import { HttpError } from '../http.js';
import { ejectedFrom, roomAccess } from '../services/conduct.js';

/** Refuses a suspended or held account before it reaches any shared space. */
export async function requireRoomAccess(userId: string): Promise<void> {
  const access = await roomAccess(userId);
  if (!access.allowed) {
    throw new HttpError(403, API_ERROR_CODES.forbidden, access.problem ?? 'War rooms are not available.');
  }
}

/**
 * Refuses somebody the room they were removed from, without refusing them
 * every other room.
 *
 * The message says what happened, because a seat request that silently fails
 * is read as a bug and retried, and somebody retrying a seat they cannot have
 * is worse for everyone than being told.
 */
export async function requireNotEjected(roomId: string, userId: string): Promise<void> {
  if (await ejectedFrom(roomId, userId)) {
    throw new HttpError(
      403,
      API_ERROR_CODES.forbidden,
      'You were removed from this room after reports from several people in it. Other rooms are open.',
    );
  }
}

/** Both, which is what taking a seat needs. */
export async function requireCanEnter(roomId: string, userId: string): Promise<void> {
  await requireRoomAccess(userId);
  await requireNotEjected(roomId, userId);
}
