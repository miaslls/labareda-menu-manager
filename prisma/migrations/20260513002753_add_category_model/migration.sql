-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "menuVersionId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_position_menuVersionId_key" ON "Category"("position", "menuVersionId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_menuVersionId_fkey" FOREIGN KEY ("menuVersionId") REFERENCES "MenuVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
