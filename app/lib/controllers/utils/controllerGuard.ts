/**
 * Controller Guard — eliminates the repetitive try-catch + log + rethrow
 * pattern that appears 60+ times across all controllers.
 *
 * Usage:
 *   return controllerGuard("createShipment", async () => { ... });
 */

import { ZodError } from "zod";
import { AppError, fromZodError } from "../../errors";

/**
 * Wraps a controller operation with:
 *  1. Structured error logging with operation name
 *  2. ZodError → ValidationError conversion
 *  3. Next.js DYNAMIC_SERVER_USAGE re-throw
 *  4. Unknown errors preserved (not swallowed)
 *
 * Graceful-degradation callers (dashboard widgets that should render empty
 * rather than crash the page) pass `{ fallback }`. When supplied, any error
 * other than the Next.js dynamic-usage digest is logged and the fallback value
 * is returned instead of propagating — mirroring the pre-guard
 * `catch { return X }` contract those read paths relied on.
 */
export async function controllerGuard<T>(
  operationName: string,
  fn: () => Promise<T>,
  options?: { fallback: T }
): Promise<T> {
  try {
    return await fn();
  } catch (error: unknown) {
    // Next.js internal digest — must be re-thrown untouched
    if (
      error instanceof Error &&
      "digest" in error &&
      (error as { digest?: string }).digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }

    // Graceful-degradation caller: log and return the fallback value.
    if (options) {
      console.error(`[${operationName}] Failed, returning fallback:`, error);
      return options.fallback;
    }

    // Zod validation failures → structured ValidationError
    if (error instanceof ZodError) {
      const issues = error.issues.map((i) => ({
        path: i.path.map((p) => String(p)),
        message: i.message,
      }));
      const validationError = fromZodError({ issues });
      console.error(`[${operationName}] Validation failed:`, validationError.message);
      throw validationError;
    }

    // Known application errors — log and re-throw as-is
    if (error instanceof AppError) {
      console.error(`[${operationName}] ${error.name}:`, error.message);
      throw error;
    }

    // Unknown errors — log full stack and re-throw
    console.error(`[${operationName}] Unexpected error:`, error);
    throw error;
  }
}
