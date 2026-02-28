"use server";

import {
  uploadToCloudinary,
  getSignedUrl,
  extractPublicIdFromUrl,
} from "../cloudinary";
import { authenticatedAction } from "../auth-middleware";

/**
 * Server action to upload an image to Cloudinary.
 * Expects a base64 string or similar that Cloudinary SDK can handle.
 */
export const uploadImageAction = authenticatedAction(
  async (user, fileData: string, folder: string = "general") => {
    try {
      const response = await uploadToCloudinary(
        fileData,
        `logitrack/${folder}`
      );
      return {
        success: true,
        url: response.secure_url,
        publicId: response.public_id,
      };
    } catch (error) {
      console.error("Upload action failed:", error);
      throw new Error("Failed to upload image");
    }
  }
);

/**
 * Server action to generate a signed URL for viewing private/authenticated assets.
 */
export const getSignedUrlAction = authenticatedAction(
  async (user, fileUrl: string) => {
    try {
      const publicId = extractPublicIdFromUrl(fileUrl);
      if (!publicId) {
        // If it's not a Cloudinary URL or publicId can't be found, return the original URL
        // It might be a fallback or external URL.
        return { success: true, url: fileUrl };
      }

      // Check if it's a PDF to determine resource type
      const isPdf = fileUrl.toLowerCase().includes(".pdf");
      const signedUrl = getSignedUrl(publicId, "raw");

      return {
        success: true,
        url: signedUrl,
      };
    } catch (error) {
      console.error("Failed to generate signed URL:", error);
      throw new Error("Failed to generate secure viewing link");
    }
  }
);
