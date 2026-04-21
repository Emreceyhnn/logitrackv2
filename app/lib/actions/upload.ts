"use server";

import { supabase } from "../supabase";
import {
  authenticatedAction,
  maybeAuthenticatedAction,
} from "../auth-middleware";

type UploadBucket =
  | "vehicles"
  | "documents"
  | "avatars"
  | "inventory"
  | "general";

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

export const uploadImageAction = maybeAuthenticatedAction(
  async (
    _user,
    fileData: string,
    bucket: UploadBucket = "general",
    folder?: string
  ): Promise<UploadImageResult> => {
    validateBase64Image(fileData);

    const base64Part = fileData.split(",")[1];
    const mimeType = fileData.split(";")[0].split(":")[1];
    const buffer = Buffer.from(base64Part, "base64");

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const ext = mimeType.split("/")[1];
    const filePath = folder
      ? `${folder}/${fileName}.${ext}`
      : `${fileName}.${ext}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      console.error("[uploadImageAction] Supabase upload failed:", error);
      throw new Error(`Failed to upload to Supabase: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
      publicId: data.path,
    };
  }
);

export const getSignedUrlAction = authenticatedAction(
  async (
    _user,
    fileUrl: string,
    bucket: string = "documents"
  ): Promise<SignedUrlResult> => {
    validateFileUrl(fileUrl);

    const urlParts = fileUrl.split("/");
    const path = urlParts.slice(urlParts.indexOf(bucket) + 1).join("/");

    if (!path) {
      return { success: true, url: fileUrl, signed: false };
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600);

    if (error) {
      console.error(
        "[getSignedUrlAction] Failed to generate signed URL:",
        error
      );
      throw new Error("Failed to generate a secure viewing link.");
    }

    return { success: true, url: data.signedUrl, signed: true };
  }
);
