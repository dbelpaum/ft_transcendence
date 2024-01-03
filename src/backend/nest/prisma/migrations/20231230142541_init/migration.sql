/*
  Warnings:

  - Changed the type of `user1Id` on the `Score` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user2Id` on the `Score` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_user2Id_fkey";

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "user1Id",
ADD COLUMN     "user1Id" INTEGER NOT NULL,
DROP COLUMN "user2Id",
ADD COLUMN     "user2Id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Score_user1Id_user2Id_key" ON "Score"("user1Id", "user2Id");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
