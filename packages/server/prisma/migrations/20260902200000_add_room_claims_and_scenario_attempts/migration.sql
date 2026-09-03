-- CreateTable
CREATE TABLE "scenario_attempts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "caughtCritical" BOOLEAN NOT NULL DEFAULT false,
    "roomId" TEXT,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "scenario_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "room_claims" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "disposition" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "actionIdsJson" TEXT NOT NULL,
    "escalateTo" TEXT,
    "confidence" INTEGER NOT NULL,
    "atSeconds" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "scenario_attempts_userId_scenarioId_idx" ON "scenario_attempts"("userId", "scenarioId");

-- CreateIndex
CREATE INDEX "scenario_attempts_userId_completedAt_idx" ON "scenario_attempts"("userId", "completedAt");

-- CreateIndex
CREATE INDEX "room_claims_roomId_idx" ON "room_claims"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "room_claims_roomId_eventId_role_key" ON "room_claims"("roomId", "eventId", "role");

