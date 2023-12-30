/*
  Warnings:

  - Added the required column `user1Score` to the `Score` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user2Score` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "user1Score" INTEGER NOT NULL,
ADD COLUMN     "user2Score" INTEGER NOT NULL;
