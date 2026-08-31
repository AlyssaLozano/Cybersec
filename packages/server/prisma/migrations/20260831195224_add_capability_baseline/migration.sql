-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_assessment_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "responsesJson" TEXT NOT NULL DEFAULT '{}',
    "profileJson" TEXT NOT NULL DEFAULT '{}',
    "reportJson" TEXT,
    "probeResponsesJson" TEXT NOT NULL DEFAULT '{}',
    "baselineLaneId" TEXT,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "assessment_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_assessment_sessions" ("completedAt", "createdAt", "id", "profileJson", "reportJson", "responsesJson", "updatedAt", "userId") SELECT "completedAt", "createdAt", "id", "profileJson", "reportJson", "responsesJson", "updatedAt", "userId" FROM "assessment_sessions";
DROP TABLE "assessment_sessions";
ALTER TABLE "new_assessment_sessions" RENAME TO "assessment_sessions";
CREATE UNIQUE INDEX "assessment_sessions_userId_key" ON "assessment_sessions"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
