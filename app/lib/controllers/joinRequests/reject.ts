"use server";

import { db } from "../../db";
import { checkPermission } from "../utils/checkPermission";
import { authenticatedAction } from "../../auth-middleware";
import { controllerGuard } from "../utils/controllerGuard";
import { ConflictError, NotFoundError } from "../../errors";

/** Reject a pending join request — admin/manager only, scoped to their own company. */
export const rejectJoinRequest = authenticatedAction(
  async (user, joinRequestId: string) => {
    const companyId = user?.companyId || "";
    return controllerGuard("rejectJoinRequest", async () => {
      await checkPermission(user, companyId, ["role_admin", "role_manager"]);

      const joinRequest = await db.joinRequest.findUnique({ where: { id: joinRequestId } });
      if (!joinRequest || joinRequest.companyId !== companyId) {
        throw new NotFoundError("Join request");
      }
      if (joinRequest.status !== "PENDING") {
        throw new ConflictError("This join request has already been decided");
      }

      return db.joinRequest.update({
        where: { id: joinRequestId },
        data: { status: "REJECTED", decidedAt: new Date(), decidedById: user.id },
      });
    });
  }
);

/** Cancel my own pending join request. */
export const cancelJoinRequest = authenticatedAction(
  async (user, joinRequestId: string) => {
    return controllerGuard("cancelJoinRequest", async () => {
      const joinRequest = await db.joinRequest.findUnique({ where: { id: joinRequestId } });
      if (!joinRequest || joinRequest.userId !== user.id) {
        throw new NotFoundError("Join request");
      }

      await db.joinRequest.delete({ where: { id: joinRequestId } });
      return { success: true };
    });
  }
);
