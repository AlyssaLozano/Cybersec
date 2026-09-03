/**
 * Persistence for attempts: what somebody has run, at which tier.
 *
 * WHY THIS IS WRITTEN AT CLOSE AND NOT AT START
 *
 * A room somebody sat in for four minutes and left is not an attempt, and
 * recording it would put a letter against a scenario they have not seen. The
 * bar is committing at least one claim and being in a seat when the lead
 * closed it, which is `qualifiesAsAttempt` in attempts.ts.
 *
 * WHY ONE ROW PER SEAT AND NOT PER ROOM
 *
 * Five people in one room have five different experiences of it, because each
 * one only ever saw their own surfaces. The operator who worked the queue and
 * the forensics seat who imaged a host did not do the same exercise, and a
 * single row against the room would say they had.
 */

import type { ScenarioDifficulty, SocRoleId } from '@soc/shared';

import { prisma } from '../db/client.js';
import type { AttemptRecord } from './attempts.js';

export async function recordAttempt(input: {
  userId: string;
  scenarioId: string;
  difficulty: ScenarioDifficulty;
  role: SocRoleId;
  score: number;
  caughtCritical: boolean;
  roomId: string;
}): Promise<void> {
  await prisma.scenarioAttempt.create({
    data: {
      userId: input.userId,
      scenarioId: input.scenarioId,
      difficulty: input.difficulty,
      role: input.role,
      score: input.score,
      caughtCritical: input.caughtCritical,
      roomId: input.roomId,
    },
  });
}

/** Everything this person has run, newest first. */
export async function attemptsFor(userId: string): Promise<AttemptRecord[]> {
  const rows = await prisma.scenarioAttempt.findMany({
    where: { userId },
    orderBy: { completedAt: 'desc' },
  });
  return rows.map((r) => ({
    userId: r.userId,
    scenarioId: r.scenarioId,
    difficulty: r.difficulty as ScenarioDifficulty,
    role: r.role as SocRoleId,
    completedAt: r.completedAt,
    score: r.score,
    caughtCritical: r.caughtCritical,
  }));
}
