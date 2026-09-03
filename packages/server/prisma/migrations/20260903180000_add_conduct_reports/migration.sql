-- CreateTable
CREATE TABLE "conduct_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "space" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "reporterUserId" TEXT NOT NULL,
    "subjectUserId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "contextJson" TEXT NOT NULL,
    "outcome" TEXT NOT NULL DEFAULT 'open',
    "reviewedByUserId" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "room_ejections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "space" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "reporters" INTEGER NOT NULL,
    "reversed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "tier" TEXT NOT NULL DEFAULT 'free',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" DATETIME,
    "roomsSuspendedUntil" DATETIME,
    "roomsBanned" BOOLEAN NOT NULL DEFAULT false,
    "callSign" TEXT,
    "avatarId" TEXT
);
INSERT INTO "new_users" ("avatarId", "callSign", "createdAt", "email", "id", "lastLoginAt", "passwordHash", "role", "tier", "username") SELECT "avatarId", "callSign", "createdAt", "email", "id", "lastLoginAt", "passwordHash", "role", "tier", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_callSign_key" ON "users"("callSign");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "conduct_reports_subjectUserId_createdAt_idx" ON "conduct_reports"("subjectUserId", "createdAt");

-- CreateIndex
CREATE INDEX "conduct_reports_outcome_createdAt_idx" ON "conduct_reports"("outcome", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "conduct_reports_roomId_reporterUserId_subjectUserId_key" ON "conduct_reports"("roomId", "reporterUserId", "subjectUserId");

-- CreateIndex
CREATE INDEX "room_ejections_userId_createdAt_idx" ON "room_ejections"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "room_ejections_roomId_userId_key" ON "room_ejections"("roomId", "userId");

