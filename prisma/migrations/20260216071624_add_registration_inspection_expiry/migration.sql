/*
  Warnings:

  - Added the required column `status` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "avgFuelConsumption" DOUBLE PRECISION,
ADD COLUMN     "inspectionExpiry" TIMESTAMP(3),
ADD COLUMN     "nextServiceKm" INTEGER,
ADD COLUMN     "registrationExpiry" TIMESTAMP(3);
