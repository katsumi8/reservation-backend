/*
  Warnings:

  - A unique constraint covering the columns `[tableID]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reservation_tableID_key" ON "Reservation"("tableID");
