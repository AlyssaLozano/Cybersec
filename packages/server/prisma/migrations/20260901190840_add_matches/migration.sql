-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scenarioId" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "visibility" TEXT NOT NULL,
    "joinCode" TEXT,
    "hostUserId" TEXT NOT NULL,
    "redUserId" TEXT,
    "blueUserId" TEXT,
    "stateJson" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastMoveAt" DATETIME
);

-- CreateIndex
CREATE INDEX "matches_joinCode_idx" ON "matches"("joinCode");

-- CreateIndex
CREATE INDEX "matches_status_visibility_idx" ON "matches"("status", "visibility");

-- CreateIndex
CREATE INDEX "matches_redUserId_idx" ON "matches"("redUserId");

-- CreateIndex
CREATE INDEX "matches_blueUserId_idx" ON "matches"("blueUserId");
