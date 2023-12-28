/*
  Warnings:

  - You are about to drop the column `twoFactorAuthId` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "twoFactorAuthId",
ADD COLUMN     "twoFactorSecret" INTEGER;
