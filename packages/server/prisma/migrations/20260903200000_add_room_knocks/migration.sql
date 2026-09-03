-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_room_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scenarioId" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "startsAt" DATETIME NOT NULL,
    "visibility" TEXT NOT NULL,
    "joinCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "hostUserId" TEXT NOT NULL,
    "seatsJson" TEXT NOT NULL,
    "knocksJson" TEXT NOT NULL DEFAULT '[]',
    "readoutJson" TEXT,
    "closedAtSeconds" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "room_sessions_hostUserId_fkey" FOREIGN KEY ("hostUserId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_room_sessions" ("closedAtSeconds", "createdAt", "difficulty", "hostUserId", "id", "joinCode", "readoutJson", "scenarioId", "seatsJson", "startsAt", "status", "updatedAt", "visibility") SELECT "closedAtSeconds", "createdAt", "difficulty", "hostUserId", "id", "joinCode", "readoutJson", "scenarioId", "seatsJson", "startsAt", "status", "updatedAt", "visibility" FROM "room_sessions";
DROP TABLE "room_sessions";
ALTER TABLE "new_room_sessions" RENAME TO "room_sessions";
CREATE INDEX "room_sessions_status_startsAt_idx" ON "room_sessions"("status", "startsAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

