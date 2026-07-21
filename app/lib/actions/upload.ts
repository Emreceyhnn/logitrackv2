"use server";

import { headers } from "next/headers";
import {
  cloudinary,
  ensureCloudinaryConfigured,
  BUCKET_DELIVERY_TYPE,
  resourceTypeForMime,
  type UploadBucket,
  type CloudinaryResourceType,
} from "../cloudinary";
import { logger } from "@/app/lib/logger";
import { db } from "../db";
import { rateLimit } from "../rate-limiter";
import {
  authenticatedAction,
  maybeAuthenticatedAction,
} from "../auth-middleware";

/**
 * Buckets an UNAUTHENTICATED caller may write to. Uploads happen during the
 * pre-account registration flow (profile avatar, company logo), so these two
 * must stay open; every other bucket — notably `documents`, which holds
 * sensitive files under authenticated delivery — requires an authenticated
 * session.
 */
const ANON_WRITABLE_BUCKETS: ReadonlySet<UploadBucket> = new Set([
  "avatars",
  "general",
]);

interface UploadImageResult {
  success: true;
  url: string;
  publicId: string;
}

interface SignedUrlResult {
  success: true;
  url: string;
  signed: boolean;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const SIGNED_URL_TTL_SECONDS = 3600;

const ALLOWED_MIME_PREFIXES = [
  "data:image/jpeg",
  "data:image/png",
  "data:image/webp",
  "data:image/gif",
  "data:image/jpg",
  "data:application/pdf",
] as const;

function validateBase64Image(fileData: string): void {
  if (!fileData?.trim()) {
    throw new Error("File data is required.");
  }

  const isAllowedType = ALLOWED_MIME_PREFIXES.some((prefix) =>
    fileData.startsWith(prefix)
  );
  if (!isAllowedType) {
    throw new Error(
      `Unsupported file type. Allowed formats: ${ALLOWED_MIME_PREFIXES.map(
        (p) => p.replace("data:", "").replace(";", "")
      ).join(", ")}.`
    );
  }

  const base64Part = fileData.split(",")[1] ?? "";
  const estimatedBytes = (base64Part.length * 3) / 4;
  if (estimatedBytes > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File size exceeds the ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB limit.`
    );
  }
}

function validateFileUrl(fileUrl: string): void {
  if (!fileUrl?.trim()) {
    throw new Error("File URL is required.");
  }
  try {
    new URL(fileUrl);
  } catch {
    throw new Error("Invalid file URL provided.");
  }
}

export const uploadImageAction = maybeAuthenticatedAction(
  async (
    _user,
    fileData: string,
    bucket: UploadBucket = "general",
    folder?: string
  ): Promise<UploadImageResult> => {
    if (!_user && !ANON_WRITABLE_BUCKETS.has(bucket)) {
      throw new Error("Authentication required to upload to this bucket.");
    }

    // Authenticated callers are already throttled per-session by
    // `authenticatedAction`; anonymous ones (pre-registration avatar/logo
    // uploads) have no other limiter — Server Action POSTs never pass the
    // /api middleware limiter — so cap them per IP to prevent storage abuse.
    if (!_user) {
      const headerStore = await headers();
      const ip =
        headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headerStore.get("x-real-ip") ||
        "127.0.0.1";
      const ipLimit = await rateLimit(ip, 10, 3600, "rate-limit:upload-anon:");
      if (!ipLimit.success) {
        throw new Error("Too many uploads. Please try again later.");
      }
    }

    validateBase64Image(fileData);

    // Cloudinary accepts the full data URI directly and derives the extension
    // from it, so no manual buffer handling is needed. We still parse the MIME
    // ourselves to pin resource_type (see resourceTypeForMime).
    const mimeType = fileData.split(";")[0]?.split(":")[1] ?? "";

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    // Cloudinary namespaces by folder, not bucket. Keeping the bucket as the
    // top-level folder preserves the old path layout: <bucket>/<folder?>/<name>
    const targetFolder = folder ? `${bucket}/${folder}` : bucket;

    const deliveryType = BUCKET_DELIVERY_TYPE[bucket];
    const resourceType = resourceTypeForMime(mimeType);

    ensureCloudinaryConfigured();

    try {
      const result = await cloudinary.uploader.upload(fileData, {
        folder: targetFolder,
        public_id: fileName,
        // Explicit, never "auto": getSignedUrlAction must be able to
        // reconstruct this exact value from the stored URL, or signatures for
        // private documents won't match and reads 404.
        resource_type: resourceType,
        // `authenticated` assets 404 on their bare delivery URL and require a
        // signed URL — this is the private-bucket equivalent for `documents`.
        type: deliveryType,
        overwrite: false,
      });

      // For `authenticated` assets Cloudinary returns a secure_url that already
      // carries a permanent signature token (".../s--AbC123--/v17.../id.png").
      // Persisting that would hand out non-expiring access to anyone who reads
      // the DB row or a log line, bypassing both the 1-hour expiry and the
      // ownership check in getSignedUrlAction. Strip it and store the bare
      // reference; reads are signed on demand.
      const url =
        deliveryType === "authenticated"
          ? result.secure_url.replace(/\/s--[^/]+--\//, "/")
          : result.secure_url;

      return {
        success: true,
        url,
        publicId: result.public_id,
      };
    } catch (error) {
      logger.error("[uploadImageAction] Cloudinary upload failed:", error);
      const message =
        error instanceof Error ? error.message : "Unknown upload error";
      throw new Error(`Failed to upload to Cloudinary: ${message}`);
    }
  }
);

interface ParsedAssetRef {
  publicId: string;
  resourceType: CloudinaryResourceType;
}

/**
 * Extracts the Cloudinary public_id and resource_type from a delivery URL.
 *
 * Cloudinary URLs look like:
 *   https://res.cloudinary.com/<cloud>/<resource_type>/<type>/v<version>/<public_id>.<ext>
 * optionally with transformation segments between <type> and the version. The
 * public_id is everything after the version segment, minus the extension.
 *
 * resource_type is read from the path rather than inferred from the file
 * extension: a signature is only valid for the resource_type the asset was
 * actually stored under, and the URL is the one authoritative record of that.
 */
function parseAssetRef(fileUrl: string): ParsedAssetRef | null {
  try {
    const { hostname, pathname } = new URL(fileUrl);

    // Legacy pre-migration URLs (e.g. Supabase) are not signable here, and
    // their paths can contain version-looking segments ("/storage/v1/object/")
    // that would otherwise parse into a bogus public_id and produce a broken
    // signed link. Only Cloudinary-hosted assets get signed.
    if (!/(^|\.)res\.cloudinary\.com$/.test(hostname)) {
      return null;
    }

    const segments = pathname.split("/").filter(Boolean);

    // Cloudinary version segments are "v" + a timestamp (10+ digits); the
    // narrower pattern avoids matching short API-version segments like "v1".
    const versionIndex = segments.findIndex((s) => /^v\d{10,}$/.test(s));
    if (versionIndex === -1 || versionIndex === segments.length - 1) {
      return null;
    }

    // Path shape is /<cloud>/<resource_type>/<type>/..., so resource_type sits
    // at index 1 — before any transformation segments.
    const resourceType: CloudinaryResourceType =
      segments[1] === "raw" ? "raw" : "image";

    // Everything after the version is the public_id. Any signature segment
    // ("s--AbC123--") sits *before* the version, so slicing here drops it —
    // which keeps rows written before signature-stripping parseable.
    const publicIdWithExt = segments.slice(versionIndex + 1).join("/");
    const publicId = publicIdWithExt.replace(/\.[^./]+$/, "");
    if (!publicId) return null;

    return { publicId, resourceType };
  } catch {
    return null;
  }
}

export const getSignedUrlAction = authenticatedAction(
  async (
    user,
    fileUrl: string,
    bucket: UploadBucket = "documents"
  ): Promise<SignedUrlResult> => {
    validateFileUrl(fileUrl);

    // A signed URL grants time-limited read access to the underlying file, so
    // the caller must own a Document row pointing at this exact URL within
    // their own tenant — otherwise any authenticated user could request a
    // signed URL for another company's document by guessing/observing its
    // storage path (IDOR).
    const companyId = user?.companyId || "";
    const ownedDocument = await db.document.findFirst({
      where: { url: fileUrl, companyId },
      select: { id: true },
    });
    if (!ownedDocument) {
      throw new Error("Document not found or unauthorized.");
    }

    const asset = parseAssetRef(fileUrl);
    if (!asset) {
      return { success: true, url: fileUrl, signed: false };
    }

    ensureCloudinaryConfigured();

    try {
      const signedUrl = cloudinary.url(asset.publicId, {
        type: BUCKET_DELIVERY_TYPE[bucket],
        resource_type: asset.resourceType,
        sign_url: true,
        secure: true,
        // Cloudinary signatures are permanent unless the URL also carries an
        // expiry, so set one to match the old 1-hour Supabase signed URLs.
        expires_at: Math.floor(Date.now() / 1000) + SIGNED_URL_TTL_SECONDS,
      });

      return { success: true, url: signedUrl, signed: true };
    } catch (error) {
      logger.error(
        "[getSignedUrlAction] Failed to generate signed URL:",
        error
      );
      throw new Error("Failed to generate a secure viewing link.");
    }
  }
);
