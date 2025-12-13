-- CreateTable
CREATE TABLE "auth"."user_profiles" (
    "user_profile_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "date_of_birth" DATE NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("user_profile_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "auth"."user_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "auth"."user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
