-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_exercise_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "completedAt" DATETIME,
    "lastAttemptedAt" DATETIME,
    "hintsRevealed" INTEGER NOT NULL DEFAULT 0,
    "solutionRevealed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "exercise_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_exercise_progress" ("attempts", "completedAt", "exerciseId", "id", "lastAttemptedAt", "moduleId", "packageId", "status", "userId") SELECT "attempts", "completedAt", "exerciseId", "id", "lastAttemptedAt", "moduleId", "packageId", "status", "userId" FROM "exercise_progress";
DROP TABLE "exercise_progress";
ALTER TABLE "new_exercise_progress" RENAME TO "exercise_progress";
CREATE INDEX "exercise_progress_userId_packageId_idx" ON "exercise_progress"("userId", "packageId");
CREATE UNIQUE INDEX "exercise_progress_userId_exerciseId_key" ON "exercise_progress"("userId", "exerciseId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
