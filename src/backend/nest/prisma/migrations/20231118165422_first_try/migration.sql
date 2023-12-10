-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "pseudo" TEXT NOT NULL,
    "imageURL" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_pseudo_key" ON "users"("pseudo");
