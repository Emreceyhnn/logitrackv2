import { v2 as cloudinary } from "cloudinary";

// ─── Configuration ────────────────────────────────────────────────────────────

const requiredEnvVars = {
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.warn(
    `[Cloudinary] Missing environment variables: ${missingVars.join(", ")}. ` +
      "Ensure they are set in your .env file."
  );
}

cloudinary.config({
  cloud_name: requiredEnvVars.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: requiredEnvVars.CLOUDINARY_API_KEY,
  api_secret: requiredEnvVars.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

// ─── Types ────────────────────────────────────────────────────────────────────

export type CloudinaryResourceType = "image" | "raw" | "video" | "auto";
export type CloudinaryDeliveryType = "upload" | "authenticated" | "private";

export interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  resource_type: string;
  type: string;
  [key: string]: unknown;
}

export interface UploadOptions {
  folder?: string;
  resourceType?: CloudinaryResourceType;
  deliveryType?: CloudinaryDeliveryType;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolves the delivery type based on folder name conventions.
 * Folders containing "docs" or "license" default to "authenticated".
 */
function resolveDeliveryType(
  folder: string,
  override?: CloudinaryDeliveryType
): CloudinaryDeliveryType {
  if (override) return override;
  return folder.includes("docs") || folder.includes("license")
    ? "authenticated"
    : "upload";
}

// ─── Upload ───────────────────────────────────────────────────────────────────

/**
 * Uploads a file to Cloudinary from a base64 data URI or a remote URL.
 *
 * @param fileStr      - Base64 data URI (e.g. "data:image/png;base64,...") or a remote URL.
 * @param options.folder        - Destination folder inside your Cloudinary account. Defaults to "logitrack".
 * @param options.resourceType  - Cloudinary resource type. Defaults to "image".
 * @param options.deliveryType  - Access type ("upload" | "authenticated" | "private").
 *                                Inferred from folder name if omitted.
 */
export async function uploadToCloudinary(
  fileStr: string,
  {
    folder = "logitrack",
    resourceType = "image",
    deliveryType,
  }: UploadOptions = {}
): Promise<CloudinaryResponse> {
  const type = resolveDeliveryType(folder, deliveryType);

  try {
    const response = await cloudinary.uploader.upload(fileStr, {
      folder,
      resource_type: resourceType,
      type,
    });

    return response as CloudinaryResponse;
  } catch (error: unknown) {
    console.error("[Cloudinary] Upload failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Cloudinary upload failed."
    );
  }
}

// ─── Public ID Extraction ─────────────────────────────────────────────────────

/**
 * Extracts the Cloudinary `public_id` from a Cloudinary URL.
 *
 * Supports both standard upload and authenticated/private URLs.
 * Returns `null` if the URL cannot be parsed.
 *
 * @example
 * extractPublicIdFromUrl(
 *   "https://res.cloudinary.com/demo/image/upload/v1234/folder/file.jpg"
 * )
 * // → "folder/file"
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const parts = url.split("/");

    const deliveryTypeIndex = parts.findIndex((p) =>
      ["upload", "authenticated", "private"].includes(p)
    );
    if (deliveryTypeIndex === -1) return null;

    // Skip the optional version segment (e.g. "v1234567890")
    let startIndex = deliveryTypeIndex + 1;
    const maybeVersion = parts[startIndex];
    if (
      maybeVersion?.startsWith("v") &&
      !isNaN(Number(maybeVersion.slice(1)))
    ) {
      startIndex++;
    }

    const fullPath = parts.slice(startIndex).join("/");
    if (!fullPath) return null;

    // Strip the file extension
    const lastDot = fullPath.lastIndexOf(".");
    return lastDot !== -1 ? fullPath.slice(0, lastDot) : fullPath;
  } catch {
    return null;
  }
}

// ─── Signed URLs ──────────────────────────────────────────────────────────────

/**
 * Generates a signed Cloudinary URL for authenticated access to a resource.
 *
 * @param publicId      - The Cloudinary public ID of the resource.
 * @param resourceType  - The resource type ("image" | "raw" | "video"). Defaults to "raw".
 */
export function getSignedUrl(
  publicId: string,
  resourceType: Exclude<CloudinaryResourceType, "auto"> = "raw"
): string {
  return cloudinary.url(publicId, {
    sign_url: true,
    resource_type: resourceType,
    type: "authenticated",
    secure: true,
  });
}

/**
 * Generates a time-limited signed download URL for a raw/PDF resource.
 *
 * @param publicId
 * @param expiresInSeconds
 * @param resourceType
 */
export function generateSignedDownloadUrl(
  publicId: string,
  expiresInSeconds: number = 3600,
  resourceType: Exclude<CloudinaryResourceType, "auto"> = "raw"
): string {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

  return cloudinary.utils.private_download_url(publicId, "pdf", {
    resource_type: resourceType,
    type: "authenticated",
    expires_at: expiresAt,
  });
}
