"use client";

import { signInWithCustomToken } from "firebase/auth";
import { auth } from "./firebase";
import { getFirebaseCustomTokenAction } from "./actions/firebaseToken";

/**
 * Ensures the Firebase client SDK is signed in with a custom token carrying the
 * caller's `companyId` claim before any Realtime Database subscription runs.
 *
 * RTDB security rules deny all reads/writes to unauthenticated clients and scope
 * every tenant node by `auth.token.companyId`, so subscriptions MUST await this
 * first. The promise is memoised so concurrent subscribers share a single
 * sign-in round-trip; it is reset on failure so a later attempt can retry.
 */
let authPromise: Promise<void> | null = null;

export function ensureFirebaseAuth(): Promise<void> {
  if (auth.currentUser) return Promise.resolve();
  if (authPromise) return authPromise;

  authPromise = (async () => {
    const result = await getFirebaseCustomTokenAction();
    if ("error" in result) {
      throw new Error(`Firebase auth failed: ${result.error}`);
    }
    await signInWithCustomToken(auth, result.token);
  })().catch((err) => {
    // Allow a subsequent call to retry instead of caching the rejection.
    authPromise = null;
    throw err;
  });

  return authPromise;
}
