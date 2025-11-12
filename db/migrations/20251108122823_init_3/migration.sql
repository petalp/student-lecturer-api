/*
  Warnings:

  - You are about to drop the `tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lecturers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `students` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "auth"."tokens" DROP CONSTRAINT "tokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "lecturers" DROP CONSTRAINT "lecturers_userId_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_userId_fkey";

-- DropTable
DROP TABLE "auth"."tokens";

-- DropTable
DROP TABLE "auth"."users";

-- DropTable
DROP TABLE "lecturers";

-- DropTable
DROP TABLE "students";

-- DropEnum
DROP TYPE "auth"."Role";
