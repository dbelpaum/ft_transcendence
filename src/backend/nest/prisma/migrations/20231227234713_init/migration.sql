-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_user2Id_fkey";

-- AlterTable
ALTER TABLE "Score" ALTER COLUMN "user1Id" SET DATA TYPE TEXT,
ALTER COLUMN "user2Id" SET DATA TYPE TEXT;
