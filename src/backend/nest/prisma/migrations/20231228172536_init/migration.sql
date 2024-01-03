-- AlterTable
ALTER TABLE "Score" ALTER COLUMN "user1Id" SET DATA TYPE TEXT,
ALTER COLUMN "user2Id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "users"("pseudo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "users"("pseudo") ON DELETE RESTRICT ON UPDATE CASCADE;
