/*
  Warnings:

  - You are about to drop the column `address` on the `customers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "fuel_logs" DROP CONSTRAINT "fuel_logs_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "maintenance_records" DROP CONSTRAINT "maintenance_records_vehicleId_fkey";

-- DropForeignKey
ALTER TABLE "shipments" DROP CONSTRAINT "shipments_customerId_fkey";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "address";

-- AlterTable
ALTER TABLE "drivers" ADD COLUMN     "hazmatCertified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "languages" TEXT[];

-- AlterTable
ALTER TABLE "inventory" ADD COLUMN     "cargoType" TEXT DEFAULT 'General Cargo',
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "palletCount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "unit" TEXT NOT NULL DEFAULT 'Each',
ADD COLUMN     "unitValue" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "volumeM3" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "weightKg" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "shipments" ADD COLUMN     "billingAccount" TEXT DEFAULT 'Standard Billing (Net 30)',
ADD COLUMN     "cargoType" TEXT DEFAULT 'General Cargo',
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "customerLocationId" TEXT,
ADD COLUMN     "destinationLat" DOUBLE PRECISION,
ADD COLUMN     "destinationLng" DOUBLE PRECISION,
ADD COLUMN     "originLat" DOUBLE PRECISION,
ADD COLUMN     "originLng" DOUBLE PRECISION,
ADD COLUMN     "palletCount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "priority" TEXT DEFAULT 'MEDIUM',
ADD COLUMN     "slaDeadline" TIMESTAMP(3),
ADD COLUMN     "type" TEXT DEFAULT 'Standard Freight',
ADD COLUMN     "volumeM3" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "weightKg" DOUBLE PRECISION DEFAULT 0,
ALTER COLUMN "customerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "enableAlerts" BOOLEAN DEFAULT true,
ADD COLUMN     "engineSize" TEXT,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "techNotes" TEXT,
ADD COLUMN     "transmission" TEXT;

-- AlterTable
ALTER TABLE "warehouses" ADD COLUMN     "specifications" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "customer_locations" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_locations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_locations" ADD CONSTRAINT "customer_locations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_customerLocationId_fkey" FOREIGN KEY ("customerLocationId") REFERENCES "customer_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fuel_logs" ADD CONSTRAINT "fuel_logs_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
