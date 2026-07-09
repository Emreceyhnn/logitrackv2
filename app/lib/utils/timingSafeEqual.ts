import crypto from "crypto";

/**
 * Constant-time string comparison for secrets (cron tokens, API keys, etc).
 * A plain `===` short-circuits on the first mismatched byte, which in theory
 * lets an attacker recover a secret one character at a time via response
 * timing. `crypto.timingSafeEqual` requires equal-length buffers, so unequal
 * lengths are treated as a mismatch without ever calling it.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
