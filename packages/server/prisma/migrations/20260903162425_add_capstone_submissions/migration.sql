-- CreateTable
CREATE TABLE "capstone_submissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'selected',
    "repoUrl" TEXT,
    "summary" TEXT,
    "selectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" DATETIME,
    CONSTRAINT "capstone_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "capstone_submissions_userId_idx" ON "capstone_submissions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "capstone_submissions_userId_trackId_key" ON "capstone_submissions"("userId", "trackId");
