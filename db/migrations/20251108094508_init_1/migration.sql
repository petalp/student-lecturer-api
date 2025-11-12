-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateEnum
CREATE TYPE "auth"."Role" AS ENUM ('ADMIN', 'STUDENT', 'LECTURER');

-- CreateTable
CREATE TABLE "auth"."users" (
    "user_id" SERIAL NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "middleName" VARCHAR(100),
    "lastName" VARCHAR(100) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(159) NOT NULL,
    "role" "auth"."Role" NOT NULL,
    "sex" VARCHAR(10) NOT NULL,
    "createAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "auth"."Tokens" (
    "token_id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" VARCHAR(300) NOT NULL,
    "ipAddress" INET NOT NULL,
    "location" VARCHAR(100) NOT NULL,
    "createAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("token_id")
);

-- CreateTable
CREATE TABLE "public"."students" (
    "student_id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "facultyName" VARCHAR(100) NOT NULL,
    "deptName" VARCHAR(100) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "public"."lecturers" (
    "lect_id" SERIAL NOT NULL,
    "lecturer_id" INTEGER NOT NULL,
    "facultyName" VARCHAR(100) NOT NULL,
    "deptName" VARCHAR(100) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "lecturers_pkey" PRIMARY KEY ("lect_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "auth"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "auth"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "auth"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_student_id_key" ON "public"."students"("student_id");

-- AddForeignKey
ALTER TABLE "auth"."Tokens" ADD CONSTRAINT "Tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lecturers" ADD CONSTRAINT "lecturers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
