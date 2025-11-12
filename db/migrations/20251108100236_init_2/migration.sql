/*
  Warnings:

  - You are about to drop the `Tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "auth"."Tokens" DROP CONSTRAINT "Tokens_userId_fkey";

-- DropTable
DROP TABLE "auth"."Tokens";

-- CreateTable
CREATE TABLE "auth"."tokens" (
    "token_id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" VARCHAR(300) NOT NULL,
    "ipAddress" INET NOT NULL,
    "location" VARCHAR(100) NOT NULL,
    "createAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("token_id")
);

-- AddForeignKey
ALTER TABLE "auth"."tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
