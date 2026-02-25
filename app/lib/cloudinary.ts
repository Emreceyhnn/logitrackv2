import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn(
    "Cloudinary environment variables are not set. Image uploads will fail."
  );
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dqzpxjzxp", // Fallback to a placeholder if not found
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
    const response = await cloudinary.uploader.upload(fileStr, {
      folder: folder,
      resource_type: "auto",
    });
    return response;
  } catch (error: unknown) {
    console.error("Cloudinary upload failed:", error);
    throw new Error(error instanceof Error ? error.message : "Upload failed");
  }
}
