-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "authentication";

-- CreateEnum
CREATE TYPE "authentication"."Role" AS ENUM ('ADMIN', 'STUDENT', 'LECTURER');

-- CreateTable
CREATE TABLE "authentication"."users" (
    "user_id" SERIAL NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "middleName" VARCHAR(100),
    "lastName" VARCHAR(100) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(159) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "role" "authentication"."Role" NOT NULL,
    "sex" VARCHAR(10) NOT NULL,
    "createAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "authentication"."user_profiles" (
    "user_profile_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "date_of_birth" DATE NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_profile_id")
);

-- CreateTable
CREATE TABLE "authentication"."tokens" (
    "token_id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" VARCHAR(1000) NOT NULL,
    "ipAddress" INET NOT NULL,
    "location" VARCHAR(100) NOT NULL,
    "createAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("token_id")
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
CREATE UNIQUE INDEX "users_username_key" ON "authentication"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "authentication"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "authentication"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "authentication"."user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_student_id_key" ON "public"."students"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "public"."students"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "lecturers_userId_key" ON "public"."lecturers"("userId");

-- AddForeignKey
ALTER TABLE "authentication"."user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "authentication"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authentication"."tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "authentication"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "authentication"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."lecturers" ADD CONSTRAINT "lecturers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "authentication"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
