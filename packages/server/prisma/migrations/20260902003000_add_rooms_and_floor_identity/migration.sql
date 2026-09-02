-- Floor identity on the user. Nullable: a call sign is chosen when somebody
-- first takes a seat, not at signup, so existing accounts keep working.
ALTER TABLE "users" ADD COLUMN "callSign" TEXT;
ALTER TABLE "users" ADD COLUMN "avatarId" TEXT;

-- Unique as an index rather than inline, because SQLite will not accept a
-- UNIQUE constraint on ALTER TABLE ADD COLUMN. NULLs do not collide.
CREATE UNIQUE INDEX "users_callSign_key" ON "users"("callSign");

CREATE TABLE "room_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scenarioId" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "startsAt" DATETIME NOT NULL,
    "visibility" TEXT NOT NULL,
    "joinCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "hostUserId" TEXT NOT NULL,
    "seatsJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "room_sessions_hostUserId_fkey" FOREIGN KEY ("hostUserId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "room_sessions_status_startsAt_idx" ON "room_sessions"("status", "startsAt");
