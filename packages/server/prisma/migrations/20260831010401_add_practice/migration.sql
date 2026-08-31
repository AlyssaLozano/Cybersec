-- AlterTable
ALTER TABLE "attempt_logs" ADD COLUMN "practiceId" TEXT;

-- CreateTable
CREATE TABLE "practice_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "practiceId" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "completedAt" DATETIME,
    "lastAttemptedAt" DATETIME,
    CONSTRAINT "practice_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "practice_progress_userId_exerciseId_idx" ON "practice_progress"("userId", "exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "practice_progress_userId_practiceId_key" ON "practice_progress"("userId", "practiceId");
