-- AlterTable
ALTER TABLE "ClubBook" ADD COLUMN     "votes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ClubDiscussion" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubDiscussion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubDiscussionLike" (
    "id" TEXT NOT NULL,
    "discussionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClubDiscussionLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubInvite" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "invitedBy" TEXT NOT NULL,
    "invitedUser" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClubDiscussionLike_discussionId_userId_key" ON "ClubDiscussionLike"("discussionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClubInvite_clubId_invitedUser_key" ON "ClubInvite"("clubId", "invitedUser");

-- AddForeignKey
ALTER TABLE "ClubDiscussion" ADD CONSTRAINT "ClubDiscussion_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubDiscussion" ADD CONSTRAINT "ClubDiscussion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubDiscussion" ADD CONSTRAINT "ClubDiscussion_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ClubDiscussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubDiscussionLike" ADD CONSTRAINT "ClubDiscussionLike_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "ClubDiscussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubDiscussionLike" ADD CONSTRAINT "ClubDiscussionLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
