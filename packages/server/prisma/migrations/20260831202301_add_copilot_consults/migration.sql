-- CreateTable
CREATE TABLE "copilot_consults" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastViewedAt" DATETIME NOT NULL,
    CONSTRAINT "copilot_consults_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "copilot_consults_userId_exerciseId_idx" ON "copilot_consults"("userId", "exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "copilot_consults_userId_exerciseId_alertId_key" ON "copilot_consults"("userId", "exerciseId", "alertId");
