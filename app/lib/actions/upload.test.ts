 
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

const headersMock = {
  headers: mock.fn(async () => ({
    get: mock.fn(() => "127.0.0.1"),
  })),
};

const rateLimiterMock = {
  rateLimit: mock.fn(async () => ({ success: true })),
};

const dbMock = {
  document: {
    findFirst: mock.fn(),
  },
};

mock.module("../supabase.ts", { namedExports: { supabase: supabaseMock } });
mock.module("../auth-middleware.ts", { namedExports: authMiddlewareMock });
mock.module("next/headers", { namedExports: headersMock });
mock.module("../rate-limiter.ts", { namedExports: rateLimiterMock });
mock.module("../db.ts", { namedExports: { db: dbMock } });

// 2. TEST GRUPLARI
describe("Upload Actions", () => {
  let uploadActions: unknown;

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
          }) as unknown
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

    it("should_RateLimitAnonymousUploads_WhenLimitExceeded", async () => {
      // Arrange — anonymous caller, per-IP limiter says no
      rateLimiterMock.rateLimit.mock.mockImplementationOnce(async () => ({
        success: false,
      }));

      // Act & Assert
      await expect(
        uploadActions.uploadImageAction(null, mockBase64, "avatars")
      ).rejects.toThrow("Too many uploads");
      expect(supabaseStorageMock.from.mock.calls.length).toBe(0);
    });

    it("should_NotRateLimit_AuthenticatedUploads", async () => {
      // Arrange
      rateLimiterMock.rateLimit.mock.resetCalls();
      supabaseStorageMock.from.mock.mockImplementation(
        () =>
          ({
            upload: mock.fn(async () => ({
              data: { path: "test.png" },
              error: null,
            })),
            getPublicUrl: mock.fn(() => ({
              data: { publicUrl: "http://public.url/test.png" },
            })),
          }) as unknown
      );

      // Act
      await uploadActions.uploadImageAction(mockUser, mockBase64, "general");

      // Assert — session-based throttling is authenticatedAction's job
      expect(rateLimiterMock.rateLimit.mock.calls.length).toBe(0);
    });
  });

  describe("getSignedUrlAction() metodu", () => {
    const mockUser = { id: "user-1", companyId: "company-1" };

    beforeEach(() => {
      dbMock.document.findFirst.mock.resetCalls();
    });

    it("should_GenerateSignedUrl_WhenValidUrlProvided", async () => {
      // Arrange — the caller's tenant owns a Document row for this URL
      dbMock.document.findFirst.mock.mockImplementation(async () => ({
        id: "doc-1",
      }));
      const createSignedUrlMock = mock.fn(async () => ({
        data: { signedUrl: "http://signed.url" },
        error: null,
      }));
      supabaseStorageMock.from.mock.mockImplementation(
        () =>
          ({
            createSignedUrl: createSignedUrlMock,
          }) as unknown
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
      // Ownership check is tenant-scoped
      expect(dbMock.document.findFirst.mock.calls[0].arguments[0].where).toEqual({
        url: "http://supabase.com/documents/test.pdf",
        companyId: "company-1",
      });
    });

    it("should_ThrowError_WhenDocumentIsNotOwnedByTenant", async () => {
      // Arrange — no Document row in the caller's tenant points at this URL
      dbMock.document.findFirst.mock.mockImplementation(async () => null);

      // Act & Assert — IDOR guard blocks signing foreign storage paths
      await expect(
        uploadActions.getSignedUrlAction(
          mockUser,
          "http://supabase.com/documents/other-company.pdf",
          "documents"
        )
      ).rejects.toThrow("Document not found or unauthorized.");
      expect(supabaseStorageMock.from.mock.calls.length).toBe(0);
    });

    it("should_ThrowError_WhenUrlIsInvalid", async () => {
      await expect(
        uploadActions.getSignedUrlAction(mockUser, "not-a-url")
      ).rejects.toThrow("Invalid file URL provided.");
    });
  });
});
