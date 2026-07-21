// Shared constants and helpers for the driver-console submodules. Plain module
// (not a "use server" boundary) so it may export constants and sync/async helpers.

import { db } from "../../db";
import type { DocumentStatus } from "@prisma/client";

export const DC_ROLES = [
  "role_admin",
  "role_manager",
  "role_dispatcher",
  "role_driver",
];

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfToday(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

/** Resolve the Driver record for a logged-in User, if one exists. */
export async function getDriverForUser(userId: string, companyId: string) {
  return db.driver.findFirst({
    where: { userId, companyId },
    include: {
      user: { select: { name: true, surname: true } },
      currentVehicle: true,
      homeBaseWarehouse: {
        select: { id: true, name: true, code: true, city: true },
      },
    },
  });
}

/**
 * Live document-expiry status, extracted from the inline logic in
 * app/lib/controllers/documents.ts's createDocument so it can be reused for a
 * point-in-time read (e.g. the driver console) instead of only computed once
 * at creation time.
 */
export function computeDocumentStatus(
  expiryDate: Date | null
): DocumentStatus {
  const now = new Date();
  if (!expiryDate) return "MISSING";
  if (expiryDate < now) return "EXPIRED";
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(now.getMonth() + 1);
  if (expiryDate <= oneMonthLater) return "EXPIRING_SOON";
  return "ACTIVE";
}
