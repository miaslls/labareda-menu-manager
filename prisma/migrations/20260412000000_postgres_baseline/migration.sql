-- CreateEnum
CREATE TYPE "MenuVersionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'REPLACED');

-- CreateTable
CREATE TABLE "MenuVersion" (
    "id" TEXT NOT NULL,
    "status" "MenuVersionStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuVersion_pkey" PRIMARY KEY ("id")
);
