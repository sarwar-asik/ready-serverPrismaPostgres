-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'super_admin');

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
    "name" TEXT,
    "first_nmae" TEXT,
    "last_name" TEXT,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" INTEGER,
    "role" "Role" NOT NULL DEFAULT 'user',
    "img" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
