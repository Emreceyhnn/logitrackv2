import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { sendNotificationAction } from "@/app/lib/actions/notifications";

export async function GET() {
  // Security check: simple token check if needed
  // const authHeader = _req.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  try {
    const now = new Date();
    const fifteenDaysFromNow = new Date();
    fifteenDaysFromNow.setDate(now.getDate() + 15);

    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(now.getDate() + 5);

    console.log("Running expiration checks...");

    // 1. Check General Documents
    const expiringDocs = await db.document.findMany({
      where: {
        expiryDate: { lte: fifteenDaysFromNow },
        status: { not: "DELETED" }, // Assuming there might be a deleted status
      },
      include: {
        driver: { include: { user: { select: { name: true, surname: true } } } },
        vehicle: { select: { plate: true } },
      }
    });

    for (const doc of expiringDocs) {
      if (!doc.expiryDate || !doc.companyId) continue;

      const daysLeft = Math.ceil((doc.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const type: "ERROR" | "WARNING" = daysLeft <= 0 ? "ERROR" : "WARNING";
      const title = daysLeft <= 0 ? "Belge Süresi Doldu! 🚫" : "Belge Süresi Yaklaşıyor! ⏳";
      let message = "";

      const entityName = doc.driver 
        ? `${doc.driver.user.name} ${doc.driver.user.surname} (Sürücü)` 
        : doc.vehicle 
          ? `${doc.vehicle.plate} (Araç)` 
          : "Sistem";

      if (daysLeft <= 0) {
        message = `${entityName} için '${doc.name}' belgesinin süresi ${Math.abs(daysLeft)} gün önce doldu!`;
      } else {
        message = `${entityName} için '${doc.name}' belgesinin süresinin dolmasına ${daysLeft} gün kaldı.`;
      }

      await sendNotificationAction(
        { companyId: doc.companyId },
        { title, message, type, link: "/dashboard/documents" }
      );
    }

    // 2. Check Driver Licenses
    const expiringLicenses = await db.driver.findMany({
      where: {
        licenseExpiry: { lte: fifteenDaysFromNow },
      },
      include: { user: { select: { name: true, surname: true } } }
    });

    for (const driver of expiringLicenses) {
      if (!driver.licenseExpiry || !driver.companyId) continue;

      const daysLeft = Math.ceil((driver.licenseExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const type: "ERROR" | "WARNING" = daysLeft <= 0 ? "ERROR" : "WARNING";
      const title = daysLeft <= 0 ? "Ehliyet Süresi Doldu! 🪪" : "Ehliyet Süresi Yaklaşıyor! ⏳";
      const message = daysLeft <= 0 
        ? `${driver.user.name} ${driver.user.surname} isimli sürücünün ehliyet süresi dolmuş durumda!`
        : `${driver.user.name} ${driver.user.surname} isim bir sürücünün ehliyet süresinin dolmasına ${daysLeft} gün kaldı.`;

      await sendNotificationAction(
        { companyId: driver.companyId },
        { title, message, type, link: `/dashboard/drivers/${driver.id}` }
      );
    }

    // 3. Check Vehicle Registration & Inspection
    const expiringVehicles = await db.vehicle.findMany({
      where: {
        OR: [
          { registrationExpiry: { lte: fifteenDaysFromNow } },
          { inspectionExpiry: { lte: fifteenDaysFromNow } },
        ]
      }
    });

    for (const vehicle of expiringVehicles) {
      if (!vehicle.companyId) continue;

      // Registration
      if (vehicle.registrationExpiry) {
        const regDays = Math.ceil((vehicle.registrationExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (regDays <= 15) {
          await sendNotificationAction(
            { companyId: vehicle.companyId },
            {
              title: regDays <= 0 ? "Araç Ruhsat Süresi Doldu! 📄" : "Araç Ruhsat Süresi Yaklaşıyor! ⏳",
              message: `${vehicle.plate} plakalı aracın ruhsat süresi ${regDays <= 0 ? "doldu" : regDays + " gün kaldı"}.`,
              type: regDays <= 0 ? "ERROR" : "WARNING",
              link: `/dashboard/vehicles/${vehicle.id}`
            }
          );
        }
      }

      // Inspection
      if (vehicle.inspectionExpiry) {
        const inspDays = Math.ceil((vehicle.inspectionExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (inspDays <= 15) {
          await sendNotificationAction(
            { companyId: vehicle.companyId },
            {
              title: inspDays <= 0 ? "Araç Muayene Süresi Doldu! 🛠️" : "Araç Muayene Süresi Yaklaşıyor! ⏳",
              message: `${vehicle.plate} plakalı aracın muayene süresi ${inspDays <= 0 ? "doldu" : inspDays + " gün kaldı"}.`,
              type: inspDays <= 0 ? "ERROR" : "WARNING",
              link: `/dashboard/vehicles/${vehicle.id}`
            }
          );
        }
      }
    }

    // 4. Check Routes (Delayed and Upcoming)
    const routesToCheck = await db.route.findMany({
      where: {
        status: { in: ["PLANNED", "ACTIVE"] },
        companyId: { not: null }
      }
    });

    for (const route of routesToCheck) {
      if (!route.companyId) continue;

      // Delayed check: not completed and past endTime
      if (route.endTime && route.endTime < now && route.status !== "COMPLETED") {
        await sendNotificationAction(
          { companyId: route.companyId },
          {
            title: "Rota Gecikti! ⏰",
            message: `${route.name} numaralı rotanın bitiş saati geçti fakat henüz tamamlanmadı!`,
            type: "ERROR",
            link: `/dashboard/routes/${route.id}`
          }
        );
      }

      // Upcoming check: planned and starts within 1 hour
      if (route.status === "PLANNED" && route.startTime) {
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
        if (route.startTime > now && route.startTime <= oneHourFromNow) {
          const minutesLeft = Math.ceil((route.startTime.getTime() - now.getTime()) / (1000 * 60));
          await sendNotificationAction(
            { companyId: route.companyId },
            {
              title: "Rota Başlamak Üzere! 🚚",
              message: `${route.name} numaralı rotanın başlamasına yaklaşık ${minutesLeft} dakika kaldı.`,
              type: "INFO",
              link: `/dashboard/routes/${route.id}`
            }
          );
        }
      }
    }

    // 5. Check Shipments (SLA Deadline)
    const delayedShipments = await db.shipment.findMany({
      where: {
        slaDeadline: { lt: now },
        status: { notIn: ["DELIVERED", "CANCELLED"] },
        companyId: { not: null }
      }
    });

    for (const shipment of delayedShipments) {
      if (!shipment.companyId) continue;

      await sendNotificationAction(
        { companyId: shipment.companyId },
        {
          title: "SLA Süresi Doldu! ⚠️",
          message: `${shipment.trackingId} numaralı sevkiyatın SLA teslim süresi doldu!`,
          type: "ERROR",
          link: `/dashboard/shipments/${shipment.id}`
        }
      );
    }

    // 6. Check Warehouse Capacity
    const warehouses = await db.warehouse.findMany({
      where: { companyId: { not: null } },
      include: {
        inventory: {
          select: {
            palletCount: true,
            volumeM3: true,
            quantity: true
          }
        }
      }
    });

    for (const wh of warehouses) {
      if (!wh.companyId) continue;

      const currentPallets = wh.inventory.reduce((acc: number, item: { palletCount: number | null; quantity: number }) => acc + (item.palletCount || 0) * item.quantity, 0);
      const currentVolume = wh.inventory.reduce((acc: number, item: { volumeM3: number | null; quantity: number }) => acc + (item.volumeM3 || 0) * item.quantity, 0);

      const palletUsage = wh.capacityPallets ? (currentPallets / wh.capacityPallets) * 100 : 0;
      const volumeUsage = wh.capacityVolumeM3 ? (currentVolume / wh.capacityVolumeM3) * 100 : 0;

      if (palletUsage >= 90 || volumeUsage >= 90) {
        await sendNotificationAction(
          { companyId: wh.companyId },
          {
            title: "Depo Kapasitesi Dolmak Üzere! 🏗️",
            message: `${wh.name} deposunun kapasite kullanımı %${Math.max(palletUsage, volumeUsage).toFixed(1)} seviyesine ulaştı.`,
            type: "WARNING",
            link: `/dashboard/warehouses/${wh.id}`
          }
        );
      }
    }

    return NextResponse.json({ 
      success: true, 
      checked: expiringDocs.length + expiringLicenses.length + expiringVehicles.length + routesToCheck.length + delayedShipments.length + warehouses.length
    });
  } catch (error) {
    console.error("Cron check-expirations failed:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
