-- CreateTable
CREATE TABLE "assessment_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "responsesJson" TEXT NOT NULL DEFAULT '{}',
    "profileJson" TEXT NOT NULL DEFAULT '{}',
    "reportJson" TEXT,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "assessment_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "assessment_sessions_userId_key" ON "assessment_sessions"("userId");
