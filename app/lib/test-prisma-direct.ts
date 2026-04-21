import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function test() {
  try {
    console.log("Testing direct DB queries...");
    
    console.log("1. Finding many warehouses...");
    const warehouses = await db.warehouse.findMany({
      include: {
        _count: true
      }
    });
    console.log("Found", warehouses.length, "warehouses.");

    console.log("2. Finding many inventory items...");
    const inventory = await db.inventory.findMany({
      take: 5
    });
    console.log("Found", inventory.length, "inventory items.");

    console.log("3. Testing unique constraint on inventory...");
    if (inventory.length > 0) {
      const item = inventory[0];
      const found = await db.inventory.findUnique({
        where: {
          warehouseId_sku: {
            warehouseId: item.warehouseId,
            sku: item.sku
          }
        }
      });
      console.log("Unique lookup success:", found?.name);
    }

    console.log("4. Testing Shipment relations...");
    const shipments = await db.shipment.findMany({
      take: 5,
      include: {
        originWarehouse: true,
        items: true
      }
    });
    console.log("Found", shipments.length, "shipments with relations.");

  } catch (error) {
    console.error("PRISMA ERROR REVEALED:", error);
  } finally {
    await db.$disconnect();
  }
}

test();
