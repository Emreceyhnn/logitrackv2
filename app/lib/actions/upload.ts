"use server";

import {
  uploadToCloudinary,
  getSignedUrl,
  extractPublicIdFromUrl,
} from "../cloudinary";
import { authenticatedAction } from "../auth-middleware";

type UploadFolder =
  | "general"
  | "avatars"
  | "products"
  | "documents"
  | (string & {});

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

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_PREFIXES = [
  "data:image/jpeg",
  "data:image/png",
  "data:image/webp",
  "data:image/gif",
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
      `Unsupported image type. Allowed formats: ${ALLOWED_MIME_PREFIXES.map(
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

export const uploadImageAction = authenticatedAction(
  async (
    _user,
    fileData: string,
    folder: UploadFolder = "general"
  ): Promise<UploadImageResult> => {
    validateBase64Image(fileData);

    const response = await uploadToCloudinary(fileData, {
      folder: `logitrack/${folder}`,
      resourceType: "image",
    }).catch((err: unknown) => {
      console.error("[uploadImageAction] Cloudinary upload failed:", err);
      throw new Error("Failed to upload image. Please try again.");
    });

    return {
      success: true,
      url: response.secure_url,
      publicId: response.public_id,
    };
  }
);

export const getSignedUrlAction = authenticatedAction(
  async (_user, fileUrl: string): Promise<SignedUrlResult> => {
    validateFileUrl(fileUrl);

    const publicId = extractPublicIdFromUrl(fileUrl);

    if (!publicId) {
      console.warn(
        "[getSignedUrlAction] Could not extract public ID from URL, returning original.",
        fileUrl
      );
      return { success: true, url: fileUrl, signed: false };
    }

    const signedUrl = await Promise.resolve(
      getSignedUrl(publicId, "raw")
    ).catch((err: unknown) => {
      console.error("[getSignedUrlAction] Failed to generate signed URL:", err);
      throw new Error(
        "Failed to generate a secure viewing link. Please try again."
      );
    });

    return { success: true, url: signedUrl, signed: true };
  }
);
