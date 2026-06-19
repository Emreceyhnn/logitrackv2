/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, mock, beforeEach, before } from "node:test";
import { expect } from "expect";

// 1. MOCK'LAR
const supabaseStorageMock = {
  from: mock.fn(() => ({
    upload: mock.fn(),
    getPublicUrl: mock.fn(() => ({ data: { publicUrl: "http://public.url" } })),
    createSignedUrl: mock.fn(),
  })),
};

const supabaseMock = {
  storage: supabaseStorageMock,
};

const authMiddlewareMock = {
  authenticatedAction: mock.fn((cb) => cb),
  maybeAuthenticatedAction: mock.fn((cb) => cb),
};

mock.module("../supabase.ts", { namedExports: { supabase: supabaseMock } });
mock.module("../auth-middleware.ts", { namedExports: authMiddlewareMock });

// 2. TEST GRUPLARI
describe("Upload Actions", () => {
  let uploadActions: any;

  before(async () => {
    uploadActions = await import("./upload");
  });

  beforeEach(() => {
    supabaseStorageMock.from.mock.resetCalls();
  });

  describe("uploadImageAction() metodu", () => {
    const mockUser = { id: "user-1" };
    const mockBase64 =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

    it("should_UploadImageAndReturnPublicUrl_WhenValidBase64Provided", async () => {
      // Arrange
      const uploadMock = mock.fn(async () => ({
        data: { path: "test.png" },
        error: null,
      }));
      supabaseStorageMock.from.mock.mockImplementation(
        () =>
          ({
            upload: uploadMock,
            getPublicUrl: mock.fn(() => ({
              data: { publicUrl: "http://public.url/test.png" },
            })),
          }) as any
      );

      // Act
      const result = await uploadActions.uploadImageAction(
        mockUser,
        mockBase64,
        "general"
      );

      // Assert
      expect(result.success).toBe(true);
      expect(result.url).toBe("http://public.url/test.png");
      expect(uploadMock.mock.calls.length).toBe(1);
    });

    it("should_ThrowError_WhenFileTypeIsUnsupported", async () => {
      const invalidBase64 = "data:application/xml;base64,PHhtbD4...";
      await expect(
        uploadActions.uploadImageAction(mockUser, invalidBase64)
      ).rejects.toThrow("Unsupported file type");
    });
  });

  describe("getSignedUrlAction() metodu", () => {
    const mockUser = { id: "user-1" };

    it("should_GenerateSignedUrl_WhenValidUrlProvided", async () => {
      // Arrange
      const createSignedUrlMock = mock.fn(async () => ({
        data: { signedUrl: "http://signed.url" },
        error: null,
      }));
      supabaseStorageMock.from.mock.mockImplementation(
        () =>
          ({
            createSignedUrl: createSignedUrlMock,
          }) as any
      );

      // Act
      const result = await uploadActions.getSignedUrlAction(
        mockUser,
        "http://supabase.com/documents/test.pdf",
        "documents"
      );

      // Assert
      expect(result.success).toBe(true);
      expect(result.url).toBe("http://signed.url");
      expect(result.signed).toBe(true);
      expect(createSignedUrlMock.mock.calls.length).toBe(1);
    });

    it("should_ThrowError_WhenUrlIsInvalid", async () => {
      await expect(
        uploadActions.getSignedUrlAction(mockUser, "not-a-url")
      ).rejects.toThrow("Invalid file URL provided.");
    });
  });
});
