/*
  Warnings:

  - You are about to drop the `PrismaSmokeTest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PrismaSmokeTest";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "MenuVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
