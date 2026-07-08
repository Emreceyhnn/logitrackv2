"use client";

import { getSignedUrlAction } from "@/app/lib/actions/upload";
import { logger } from "@/app/lib/logger";


/**
 * Resolves a short-lived signed URL for a document stored in the private
 * `documents` bucket and opens it in a new tab. Raw stored URLs can't be opened
 * directly (bucket is private → 403/400), so every "open document" affordance
 * must route through here.
 */
export async function openSignedDoc(url: string): Promise<void> {
  if (!url) return;
  try {
    const result = await getSignedUrlAction(url);
    if (result.success && result.url) {
      window.open(result.url, "_blank", "noopener,noreferrer");
    }
  } catch (error) {
    logger.error("[openSignedDoc] failed:", error);
  }
}
