-- CreateTable
CREATE TABLE "earned_badges" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "chat_rooms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'community',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "requestedByUserId" TEXT,
    "requestedCallSign" TEXT,
    "requestedAvatarId" TEXT,
    "reviewedByUserId" TEXT,
    "reviewedAt" DATETIME,
    "reviewNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "callSign" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "eventId" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_messages_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chat_rooms" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lobby_presence" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "callSign" TEXT NOT NULL,
    "avatarId" TEXT NOT NULL,
    "headingFor" TEXT,
    "arrivedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "community_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "audience" TEXT NOT NULL DEFAULT 'all',
    "startsAt" DATETIME NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "hostUserId" TEXT NOT NULL,
    "hostCallSign" TEXT NOT NULL,
    "hostAvatarId" TEXT NOT NULL,
    "roomId" TEXT,
    "capacity" INTEGER,
    "cancelledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "event_rsvps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "event_rsvps_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "community_events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "earned_badges_userId_idx" ON "earned_badges"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "earned_badges_userId_badgeId_key" ON "earned_badges"("userId", "badgeId");

-- CreateIndex
CREATE INDEX "chat_rooms_status_idx" ON "chat_rooms"("status");

-- CreateIndex
CREATE INDEX "chat_messages_roomId_sentAt_idx" ON "chat_messages"("roomId", "sentAt");

-- CreateIndex
CREATE INDEX "lobby_presence_lastSeenAt_idx" ON "lobby_presence"("lastSeenAt");

-- CreateIndex
CREATE INDEX "community_events_startsAt_idx" ON "community_events"("startsAt");

-- CreateIndex
CREATE INDEX "event_rsvps_userId_idx" ON "event_rsvps"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "event_rsvps_eventId_userId_key" ON "event_rsvps"("eventId", "userId");
