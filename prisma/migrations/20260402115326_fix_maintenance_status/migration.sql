-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "maintenance_records" ADD COLUMN     "status" "MaintenanceStatus" NOT NULL DEFAULT 'COMPLETED';
