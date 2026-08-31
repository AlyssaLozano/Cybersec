-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" DATETIME
);

-- CreateTable
CREATE TABLE "exercise_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "completedAt" DATETIME,
    "lastAttemptedAt" DATETIME,
    CONSTRAINT "exercise_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "terminal_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "cwd" TEXT NOT NULL DEFAULT '/home/student',
    "overlayJson" TEXT NOT NULL DEFAULT '{}',
    "scrollbackJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "terminal_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "attempt_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "failedJson" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attempt_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "exercise_progress_userId_packageId_idx" ON "exercise_progress"("userId", "packageId");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_progress_userId_exerciseId_key" ON "exercise_progress"("userId", "exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "terminal_sessions_userId_exerciseId_key" ON "terminal_sessions"("userId", "exerciseId");

-- CreateIndex
CREATE INDEX "attempt_logs_userId_exerciseId_idx" ON "attempt_logs"("userId", "exerciseId");

-- CreateIndex
CREATE INDEX "attempt_logs_exerciseId_passed_idx" ON "attempt_logs"("exerciseId", "passed");
