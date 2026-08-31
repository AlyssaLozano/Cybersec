/**
 * Persistence for copilot consultations.
 *
 * SEPARATE FROM services/copilot.ts ON PURPOSE
 *
 * `content/index.ts` imports the copilot service so that the catalogue validator
 * can check, at boot, that no exercise demands a student disagree with advice
 * that is now sound. That import must not drag the database client into the
 * content module's graph: exercise content is version-controlled code and is
 * loaded by tools and tests that have no database and should need none.
 *
 * So the corpus and the scoring live in a module with no I/O, and the two
 * queries that need Prisma live here, where only the routes and the submission
 * grader reach them.
 */

import { prisma } from '../db/client.js';

/**
 * Record that a student opened the copilot on an alert.
 *
 * Called when the analysis is served, not when the client says so. Re-opening
 * the same analysis bumps a counter rather than adding a row: an instructor
 * wants to know that somebody read one suggestion five times, and a student
 * cannot inflate `copilot-consulted` by clicking the same alert repeatedly.
 */
export async function recordConsultation(
  userId: string,
  exerciseId: string,
  alertId: string,
): Promise<void> {
  await prisma.copilotConsult.upsert({
    where: { userId_exerciseId_alertId: { userId, exerciseId, alertId } },
    create: { userId, exerciseId, alertId },
    update: { views: { increment: 1 } },
  });
}

/** Alerts this student opened the copilot on while working this exercise. */
export async function consultedAlerts(userId: string, exerciseId: string): Promise<string[]> {
  const rows = await prisma.copilotConsult.findMany({
    where: { userId, exerciseId },
    select: { alertId: true },
  });
  return rows.map((row) => row.alertId);
}
