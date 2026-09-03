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
    "callSign" TEXT,
    "avatarId" TEXT
);
INSERT INTO "new_users" ("avatarId", "callSign", "createdAt", "email", "id", "lastLoginAt", "passwordHash", "role", "roomsBanned", "roomsSuspendedUntil", "tier", "username") SELECT "avatarId", "callSign", "createdAt", "email", "id", "lastLoginAt", "passwordHash", "role", "roomsBanned", "roomsSuspendedUntil", "tier", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_callSign_key" ON "users"("callSign");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

