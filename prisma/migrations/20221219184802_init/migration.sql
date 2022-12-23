/*
  Warnings:

  - You are about to drop the column `tableID` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `tableID` on the `Table` table. All the data in the column will be lost.
  - Added the required column `tableId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tableName` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_tableID_fkey";

-- DropIndex
DROP INDEX "Table_tableID_key";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "tableID",
ADD COLUMN     "tableId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Table" DROP COLUMN "tableID",
ADD COLUMN     "tableName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
