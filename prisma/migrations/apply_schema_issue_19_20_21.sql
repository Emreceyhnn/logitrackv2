-- ============================================================
-- Migration: schema-issue-19-20-21
-- Applied manually due to non-interactive environment
-- ============================================================

-- Issue 20: AuditLog.metadata String -> JSONB
ALTER TABLE "audit_logs" DROP COLUMN "metadata";
ALTER TABLE "audit_logs" ADD COLUMN "metadata" JSONB;

-- Issue 16: Inventory.createdAt (previously added)
ALTER TABLE "inventory" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Issue 17: InventoryMovement.updatedAt (safe backfill: add with default, then drop default)
ALTER TABLE "inventory_movements" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "inventory_movements" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- Issue 18: FuelLog.companyId NOT NULL -> nullable
ALTER TABLE "fuel_logs" DROP CONSTRAINT IF EXISTS "fuel_logs_companyId_fkey";
ALTER TABLE "fuel_logs" ALTER COLUMN "companyId" DROP NOT NULL;

-- Issue 19: ShipmentHistory.createdBy -> createdById (proper FK)
ALTER TABLE "shipment_history" DROP COLUMN IF EXISTS "createdBy";
ALTER TABLE "shipment_history" ADD COLUMN IF NOT EXISTS "createdById" TEXT;

-- Issue 21: Add all composite indexes
CREATE INDEX IF NOT EXISTS "drivers_companyId_status_idx" ON "drivers"("companyId", "status");
CREATE INDEX IF NOT EXISTS "fuel_logs_companyId_date_idx" ON "fuel_logs"("companyId", "date");
CREATE INDEX IF NOT EXISTS "inventory_movements_warehouseId_sku_date_idx" ON "inventory_movements"("warehouseId", "sku", "date");
CREATE INDEX IF NOT EXISTS "shipment_history_shipmentId_idx" ON "shipment_history"("shipmentId");
CREATE INDEX IF NOT EXISTS "shipment_history_createdById_idx" ON "shipment_history"("createdById");
CREATE INDEX IF NOT EXISTS "shipments_companyId_status_idx" ON "shipments"("companyId", "status");
CREATE INDEX IF NOT EXISTS "shipments_companyId_trackingId_idx" ON "shipments"("companyId", "trackingId");

-- Restore FK constraints
ALTER TABLE "fuel_logs" ADD CONSTRAINT "fuel_logs_companyId_fkey"
  FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "shipment_history" ADD CONSTRAINT "shipment_history_createdById_fkey"
  FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
