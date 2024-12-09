-- CreateEnum
CREATE TYPE "Role" AS ENUM ('super_admin', 'admin', 'user');

-- CreateEnum
CREATE TYPE "Pronoun" AS ENUM ('he', 'she', 'they');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'others');

-- CreateTable
CREATE TABLE "test" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user" INTEGER NOT NULL,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "full_name" TEXT,
    "user_name" TEXT,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "password" TEXT NOT NULL,
    "self_pronoun" "Pronoun",
    "profile_img" TEXT,
    "phone_number" TEXT,
    "verify_code" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verify_expiration" TIMESTAMP(3),
    "pass_changed_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "fcm_token" TEXT,
    "app_id" TEXT,
    "is_social" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT,
    "location" JSONB DEFAULT '{"long": "", "lat": "", "street": ""}',
    "date_of_birth" TEXT,
    "height" TEXT,
    "weight" TEXT,
    "gender" "Gender",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
