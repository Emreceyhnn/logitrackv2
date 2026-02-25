"use server";

import { uploadToCloudinary } from "../cloudinary";
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
