import { v2 as cloudinary } from "cloudinary";

if (
  !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.warn(
    "Cloudinary environment variables are missing! Ensure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in .env"
  );
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

export interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  [key: string]: unknown;
}

/**
 * Uploads an image to Cloudinary from a base64 string or file path
 */
export async function uploadToCloudinary(
  fileStr: string,
  folder: string = "logitrack"
): Promise<CloudinaryResponse> {
  try {
    const isPdf =
      fileStr.includes("data:application/pdf") ||
      fileStr.toLowerCase().endsWith(".pdf");

    // Using individual properties to avoid 'any'
    const response = await cloudinary.uploader.upload(fileStr, {
      folder: folder,
      resource_type: "raw",
      type:
        folder.includes("docs") || folder.includes("license")
          ? "authenticated"
          : "upload",
    });
    return response;
  } catch (error: unknown) {
    console.error("Cloudinary upload failed:", error);
    throw new Error(error instanceof Error ? error.message : "Upload failed");
  }
}

/**
 * Extracts public_id from a Cloudinary URL
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Standard Cloudinary URL pattern: .../upload/v1234567/folder/public_id.ext
    // Secure Cloudinary URL pattern: .../authenticated/v1234567/folder/public_id.ext
    const parts = url.split("/");
    const uploadIndex = parts.findIndex(
      (p) => p === "upload" || p === "authenticated" || p === "private"
    );

    if (uploadIndex === -1) return null;

    // Public ID starts after the version (which starts with 'v' and is numeric-ish)
    // or directly after uploadIndex + 1 if no version
    let startIndex = uploadIndex + 1;
    if (
      parts[startIndex].startsWith("v") &&
      !isNaN(Number(parts[startIndex].substring(1)))
    ) {
      startIndex++;
    }

    // Join remaining parts and remove extension
    const fullPathWithExt = parts.slice(startIndex).join("/");
    const lastDotIndex = fullPathWithExt.lastIndexOf(".");
    return lastDotIndex !== -1
      ? fullPathWithExt.substring(0, lastDotIndex)
      : fullPathWithExt;
  } catch {
    return null;
  }
}

/**
 * Generates a signed URL for authenticated viewing
 */
export function getSignedUrl(publicId: string, resourceType: "raw"): string {
  return cloudinary.url(publicId, {
    sign_url: true,
    resource_type: resourceType,
    type: "authenticated",
    secure: true,
  });
}

/**
 * Generates a signed PDF download/view URL (requested by user)
 */
export function generateSignedPdfUrl(
  publicId: string,
  expiresInSeconds: number = 3600
): string {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

  // Most PDFs in this app are uploaded as 'image' resource type for browser rendering
  return cloudinary.utils.private_download_url(publicId, "pdf", {
    resource_type: "raw", // kept as image as per our upload logic
    type: "authenticated",
    expires_at: expiresAt,
  });
}
