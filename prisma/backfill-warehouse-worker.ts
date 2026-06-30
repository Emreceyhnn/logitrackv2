/**
 * Non-destructive backfill for the Warehouse Worker panel.
 *
 * Populates the new tables (warehouse_zones, warehouse_tasks, worker_shifts)
 * for EXISTING warehouses and ensures every company has a warehouse-operator
 * user with an active shift — without wiping any existing data.
 *
 * Run with:  npx tsx prisma/backfill-warehouse-worker.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number) => Math.random() * (max - min) + min;
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

const TASK_TEMPLATES = [
  { kind: "PICK", name: "Order batch — express lane", priority: "HIGH", total: 20, done: 14 },
  { kind: "PACK", name: "Fragile — glassware consolidation", priority: "HIGH", total: 8, done: 3 },
  { kind: "PICK", name: "Replenish forward pick face", priority: "MEDIUM", total: 12, done: 0 },
  { kind: "PUT", name: "Inbound putaway — pallet", priority: "LOW", total: 6, done: 6 },
  { kind: "PICK", name: "Standard ground — mixed cart", priority: "MEDIUM", total: 16, done: 2 },
] as const;

async function main() {
  console.log("🏭 Warehouse Worker backfill starting...\n");

  const warehouses = await prisma.warehouse.findMany({
    select: { id: true, companyId: true, capacityPallets: true, code: true },
  });
  console.log(`Found ${warehouses.length} warehouses.`);

  let zonesCreated = 0;
  let tasksCreated = 0;
  let itemsZoned = 0;

  for (const wh of warehouses) {
    // Assign every un-zoned inventory item to a zone (round-robin) so warehouse
    // capacity/zone stats are derived from real item placement.
    const unzoned = await prisma.inventory.findMany({
      where: { warehouseId: wh.id, zone: null },
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });
    const zoneCodes = ["A", "B", "C", "D"];
    for (let i = 0; i < unzoned.length; i++) {
      await prisma.inventory.update({
        where: { id: unzoned[i].id },
        data: { zone: zoneCodes[i % zoneCodes.length] },
      });
      itemsZoned++;
    }

    const zoneCount = await prisma.warehouseZone.count({ where: { warehouseId: wh.id } });
    if (zoneCount === 0) {
      const zoneCapacity = Math.max(200, Math.round(wh.capacityPallets / 4));
      for (const code of ["A", "B", "C", "D"]) {
        await prisma.warehouseZone.create({
          data: {
            warehouseId: wh.id,
            companyId: wh.companyId,
            code,
            capacityPallets: zoneCapacity,
            usedPallets: Math.round(zoneCapacity * randFloat(0.4, 0.92)),
          },
        });
        zonesCreated++;
      }
    }

    const taskCount = await prisma.warehouseTask.count({ where: { warehouseId: wh.id } });
    if (taskCount === 0) {
      for (const t of TASK_TEMPLATES) {
        await prisma.warehouseTask.create({
          data: {
            warehouseId: wh.id,
            companyId: wh.companyId,
            kind: t.kind,
            name: t.name,
            orderRef: `#ORD-${rand(88000, 88999)}`,
            zone: pick(["A", "B", "C", "D"]),
            doneUnits: t.done,
            totalUnits: t.total,
            priority: t.priority,
            status: t.done >= t.total ? "COMPLETED" : t.done > 0 ? "IN_PROGRESS" : "OPEN",
          },
        });
        tasksCreated++;
      }
    }
  }

  // Ensure each company has a warehouse operator with an active shift.
  const warehouseRole = await prisma.role.findFirst({ where: { name: "Warehouse Operator" } });
  const companies = await prisma.company.findMany({ select: { id: true, name: true } });
  const hashedPassword = await bcrypt.hash("Passw0rd!", 10);
  let operatorsCreated = 0;
  let shiftsCreated = 0;

  for (const company of companies) {
    const firstWarehouse = await prisma.warehouse.findFirst({
      where: { companyId: company.id },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });

    let operator = warehouseRole
      ? await prisma.user.findFirst({ where: { companyId: company.id, roleId: warehouseRole.id } })
      : null;

    if (!operator && warehouseRole) {
      const slug = company.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const email = `warehouse-${slug}@logitrack.com`;
      const exists = await prisma.user.findUnique({ where: { email } });
      operator = exists
        ? exists
        : await prisma.user.create({
            data: {
              email,
              name: "Floor",
              surname: "Operator",
              password: hashedPassword,
              roleId: warehouseRole.id,
              companyId: company.id,
              timezone: "Europe/Istanbul",
            },
          });
      if (!exists) operatorsCreated++;
    }

    if (operator) {
      const openShift = await prisma.workerShift.findFirst({
        where: { userId: operator.id, status: { not: "ENDED" } },
      });
      if (!openShift) {
        await prisma.workerShift.create({
          data: {
            userId: operator.id,
            warehouseId: firstWarehouse?.id ?? null,
            companyId: company.id,
            status: "ACTIVE",
            shiftStartTime: new Date(Date.now() - rand(1, 5) * 3600 * 1000),
            picksLogged: rand(80, 200),
            packsLogged: rand(60, 160),
          },
        });
        shiftsCreated++;
      }
    }
  }

  console.log(
    `\n✅ Done. Zones: +${zonesCreated}, Tasks: +${tasksCreated}, Items zoned: +${itemsZoned}, Operators: +${operatorsCreated}, Shifts: +${shiftsCreated}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
