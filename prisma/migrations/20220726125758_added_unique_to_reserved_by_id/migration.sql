/*
  Warnings:

  - A unique constraint covering the columns `[reservedById]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reservation_reservedById_key" ON "Reservation"("reservedById");
