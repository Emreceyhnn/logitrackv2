"use server";

import { adminAuth } from "@/app/lib/firebase-admin";
import { authenticatedAction } from "@/app/lib/auth-middleware";

/**
 * Mints a short-lived Firebase custom token for the currently authenticated
 * user, embedding their `companyId` as a custom claim. The client signs in to
 * Firebase Auth with this token so that Realtime Database security rules
 * (`database.rules.json`) can enforce tenant isolation via
 * `auth.token.companyId`.
 *
 * The token is only issued for a user who already passed our own session auth,
 * and the claim is derived from the server-side session — never from client
 * input — so it cannot be forged to impersonate another tenant.
 */
export const getFirebaseCustomTokenAction = authenticatedAction(
  async (user): Promise<{ token: string } | { error: string }> => {
    if (!adminAuth) {
      return { error: "Firebase Admin is not initialized" };
    }
    if (!user.companyId) {
      return { error: "User has no company assigned" };
    }

    try {
      // roleId is included only when present. RTDB rules key role-scoped
      // notification paths on `auth.token.roleId`; a user without a role simply
      // never matches a `role/{roleId}` node (but still reads company-wide and
      // personal notifications). Custom claims reject `undefined`, so omit it.
      const claims: { companyId: string; roleId?: string } = {
        companyId: user.companyId,
      };
      if (user.roleId) claims.roleId = user.roleId;

      const token = await adminAuth.createCustomToken(user.id, claims);
      return { token };
    } catch (error) {
      console.error("[getFirebaseCustomTokenAction] mint failed:", error);
      return { error: "Failed to mint Firebase token" };
    }
  }
);
