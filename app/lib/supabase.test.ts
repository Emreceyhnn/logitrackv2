 
import { describe, it, mock } from "node:test";
import { expect } from "expect";
import "dotenv/config";

// Mock next/headers so that calling cookies() during tests doesn't log a request scope error
mock.module("next/headers", {
  namedExports: {
    cookies: mock.fn(() => ({
      get: mock.fn(() => null),
      set: mock.fn(),
    })),
    headers: mock.fn(() => ({
      get: mock.fn(() => null),
    })),
  },
});

describe("Testing Supabase Connection & Upload Actions", async () => {
  const { supabase } = await import("./supabase");
  const { uploadImageAction, getSignedUrlAction } = await import("./actions/upload");

  it("Should properly instantiate the Supabase client", () => {
    expect(supabase).toBeDefined();
    expect(supabase.storage).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  describe("uploadImageAction Validation", () => {
    it("Should reject empty file data", async () => {
      await expect(
        uploadImageAction("", "general", "test")
      ).rejects.toThrow("File data is required.");
    });

    it("Should reject unsupported image types", async () => {
      await expect(
        uploadImageAction("data:text/plain;base64,dGVzdA==", "general", "test")
      ).rejects.toThrow(/Unsupported image type/);
    });

    it("Should reject oversized images", async () => {
      const largeBase64 = "data:image/jpeg;base64," + "A".repeat(15000000);
      await expect(
        uploadImageAction(largeBase64, "general", "test")
      ).rejects.toThrow("File size exceeds the 10 MB limit.");
    });
  });

  describe("getSignedUrlAction Validation (Unauthenticated)", () => {
    it("Should redirect because user is unauthenticated", async () => {
      await expect(
        getSignedUrlAction("https://example.com/file", "documents")
      ).rejects.toThrow("NEXT_REDIRECT");
    });
  });
});

