-- CreateTable
CREATE TABLE "stage_talks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "presenterUserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "proposedStartsAt" DATETIME NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "meetingLink" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewedByUserId" TEXT,
    "reviewedAt" DATETIME,
    "reviewNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "superadmin_actions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorUserId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetUserId" TEXT,
    "roomKind" TEXT,
    "roomId" TEXT,
    "reason" TEXT,
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
    "displayName" TEXT,
    "headline" TEXT,
    "about" TEXT,
    "location" TEXT,
    "githubHandle" TEXT,
    "linkedinHandle" TEXT,
    "openToWork" BOOLEAN NOT NULL DEFAULT false,
    "profileVisibility" TEXT NOT NULL DEFAULT 'private',
    "roomsSuspendedUntil" DATETIME,
    "roomsBanned" BOOLEAN NOT NULL DEFAULT false,
    "platformSuspendedUntil" DATETIME,
    "platformBanned" BOOLEAN NOT NULL DEFAULT false,
    "platformActionReason" TEXT,
    "platformActionAt" DATETIME,
    "platformActionByUserId" TEXT,
    "callSign" TEXT,
    "avatarId" TEXT
);
INSERT INTO "new_users" ("about", "avatarId", "callSign", "createdAt", "displayName", "email", "githubHandle", "headline", "id", "lastLoginAt", "linkedinHandle", "location", "openToWork", "passwordHash", "profileVisibility", "role", "roomsBanned", "roomsSuspendedUntil", "tier", "username") SELECT "about", "avatarId", "callSign", "createdAt", "displayName", "email", "githubHandle", "headline", "id", "lastLoginAt", "linkedinHandle", "location", "openToWork", "passwordHash", "profileVisibility", "role", "roomsBanned", "roomsSuspendedUntil", "tier", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_callSign_key" ON "users"("callSign");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "stage_talks_status_idx" ON "stage_talks"("status");

-- CreateIndex
CREATE INDEX "stage_talks_proposedStartsAt_idx" ON "stage_talks"("proposedStartsAt");

-- CreateIndex
CREATE INDEX "superadmin_actions_actorUserId_createdAt_idx" ON "superadmin_actions"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "superadmin_actions_targetUserId_createdAt_idx" ON "superadmin_actions"("targetUserId", "createdAt");
