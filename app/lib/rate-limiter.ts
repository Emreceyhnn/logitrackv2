import { redis } from "./redis";
import { logger } from "@/app/lib/logger";


interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// In-memory fallback store to prevent cascading failures if Redis goes down
const fallbackStore = new Map<string, { count: number; expiresAt: number }>();

/**
 * Basic fixed-window rate limiter using Upstash Redis.
 * Includes an in-memory fallback circuit breaker.
 * 
 * @param ip Client IP address
 * @param limit Maximum number of requests allowed in the window
 * @param windowSeconds Window duration in seconds
 * @param keyPrefix Redis key prefix for namespaces (e.g. "rate-limit:auth:")
 */
export async function rateLimit(
  ip: string,
  limit: number = 60,
  windowSeconds: number = 60,
  keyPrefix: string = "rate-limit:"
): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const currentWindow = Math.floor(now / windowSeconds);
  const key = `${keyPrefix}${ip}:${currentWindow}`;

  try {
    const p = redis.pipeline();
    p.incr(key);
    p.expire(key, windowSeconds);
    const results = await p.exec();

    const count = (results[0] as number) || 0;
    const remaining = Math.max(0, limit - count);
    const reset = (currentWindow + 1) * windowSeconds;

    return {
      success: count <= limit,
      limit,
      remaining,
      reset,
    };
  } catch (error) {
    logger.error("Rate limiting redis error, switching to in-memory fallback:", error);
    
    // In-memory Fallback Rate Limiting (Circuit Breaker equivalent)
    // Clean up expired keys occasionally (10% chance) to avoid memory leaks
    if (Math.random() < 0.1) {
      for (const [k, v] of fallbackStore.entries()) {
        if (v.expiresAt < now) {
          fallbackStore.delete(k);
        }
      }
    }

    const record = fallbackStore.get(key) || { count: 0, expiresAt: now + windowSeconds };
    record.count += 1;
    fallbackStore.set(key, record);

    const remaining = Math.max(0, limit - record.count);
    const reset = (currentWindow + 1) * windowSeconds;

    return {
      success: record.count <= limit,
      limit,
      remaining,
      reset,
    };
  }
}
