import { redis } from "./redis";

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Basic fixed-window rate limiter using Upstash Redis.
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
    console.error("Rate limiting redis error:", error);
    // Fail-open: if Redis is down, allow request but log error
    return {
      success: true,
      limit,
      remaining: limit,
      reset: now + windowSeconds,
    };
  }
}
