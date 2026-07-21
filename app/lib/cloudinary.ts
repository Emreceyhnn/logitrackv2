import { v2 as cloudinary } from "cloudinary";

// Server-only client. This module is imported exclusively from "use server"
// code (see app/lib/actions/upload.ts) and MUST have the API secret. Signed
// uploads and signed delivery URLs are both derived from it, so a missing
// secret would degrade every private-document read into a broken link — we
// fail fast instead.
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error(
    "[Cloudinary] Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY or " +
      "CLOUDINARY_API_SECRET. The server Cloudinary client requires all " +
      "three; refusing to start with a degraded/unsigned fallback."
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export { cloudinary };

/**
 * Logical storage areas, carried over 1:1 from the previous Supabase buckets.
 * Cloudinary has no bucket concept, so each maps to a top-level folder plus a
 * delivery type.
 *
 * `documents` is `authenticated`: assets are NOT readable from their bare URL
 * and can only be fetched through a time-limited signed URL. This is what
 * preserves the private-bucket guarantee the Supabase setup relied on. The
 * rest are `upload` (publicly readable), matching the old public buckets.
 */
export type UploadBucket = "vehicles" | "documents" | "avatars" | "general";

export const BUCKET_DELIVERY_TYPE: Record<
  UploadBucket,
  "upload" | "authenticated"
> = {
  vehicles: "upload",
  documents: "authenticated",
  avatars: "upload",
  general: "upload",
};

export type CloudinaryResourceType = "image" | "raw";

/**
 * Resource type per MIME. This MUST be deterministic rather than Cloudinary's
 * `auto`: a signed delivery URL is only valid if it is generated for the same
 * resource_type the asset was stored under, and `auto` decides server-side
 * where we cannot observe it. Guessing wrong yields a 404 on every read of a
 * private document.
 *
 * PDFs go to `raw`, not `image`. Cloudinary can treat PDFs as multi-page image
 * assets, but delivery of PDFs under `image` is blocked by default account
 * security settings ("Allow delivery of PDF and ZIP files") and returns 401
 * even with a valid signature — verified live against this account. `raw`
 * stores and serves them verbatim, which is all the app needs since documents
 * are downloaded/opened rather than transformed.
 */
export function resourceTypeForMime(mimeType: string): CloudinaryResourceType {
  if (mimeType === "application/pdf") return "raw";
  if (mimeType.startsWith("image/")) return "image";
  return "raw";
}
