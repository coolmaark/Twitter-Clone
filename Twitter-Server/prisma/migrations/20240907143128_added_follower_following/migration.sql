-- CreateTable
CREATE TABLE "Follows" (
    "followerID" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("followerID","followingId")
);

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followerID_fkey" FOREIGN KEY ("followerID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
