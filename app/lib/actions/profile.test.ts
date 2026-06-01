/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, mock, beforeEach, before } from "node:test";
import { expect } from "expect";

// 1. MOCK'LAR
const dbMock = {
  user: {
    findUnique: mock.fn(),
    update: mock.fn(),
  },
};

const authMiddlewareMock = {
  authenticatedAction: mock.fn((cb) => cb),
};

const nextCacheMock = {
  revalidatePath: mock.fn(),
};

const bcryptMock = {
  compare: mock.fn(),
  hash: mock.fn(),
};

mock.module("../db", { namedExports: { db: dbMock } });
mock.module("../auth-middleware", { namedExports: authMiddlewareMock });
mock.module("next/cache", { namedExports: nextCacheMock });
mock.module("bcryptjs", { defaultExport: bcryptMock });

// 2. TEST GRUPLARI
describe("Profile Actions", () => {
  let profileActions: any;

  before(async () => {
    profileActions = await import("./profile");
  });

  beforeEach(() => {
    dbMock.user.findUnique.mock.resetCalls();
    dbMock.user.update.mock.resetCalls();
    nextCacheMock.revalidatePath.mock.resetCalls();
    bcryptMock.compare.mock.resetCalls();
    bcryptMock.hash.mock.resetCalls();
  });

  describe("getMyProfile() metodu", () => {
    const mockUser = { id: "user-1" };

    it("should_ReturnProfile_WhenUserExists", async () => {
      // Arrange
      const expectedProfile = { id: "user-1", name: "John" };
      dbMock.user.findUnique.mock.mockImplementation(async () => expectedProfile);

      // Act
      const result = await profileActions.getMyProfile(mockUser);

      // Assert
      expect(result).toBe(expectedProfile);
      expect(dbMock.user.findUnique.mock.calls.length).toBe(1);
    });
  });

  describe("updateMyProfile() metodu", () => {
    const mockUser = { id: "user-1" };

    it("should_UpdateProfileAndRevalidatePath", async () => {
      // Arrange
      const updateData = { name: "Jane", surname: "Doe" };
      const expectedProfile = { id: "user-1", ...updateData };
      dbMock.user.update.mock.mockImplementation(async () => expectedProfile);

      // Act
      const result = await profileActions.updateMyProfile(mockUser, updateData);

      // Assert
      expect(result.user).toBe(expectedProfile);
      expect(dbMock.user.update.mock.calls.length).toBe(1);
      expect(nextCacheMock.revalidatePath.mock.calls.length).toBe(1);
    });
  });

  describe("changeMyPassword() metodu", () => {
    const mockUser = { id: "user-1" };

    it("should_ChangePassword_WhenCurrentPasswordIsCorrect", async () => {
      // Arrange
      dbMock.user.findUnique.mock.mockImplementation(async () => ({ password: "hashed_old" }));
      bcryptMock.compare.mock.mockImplementation(async () => true); // Password matches
      bcryptMock.hash.mock.mockImplementation(async () => "hashed_new");

      // Act
      const result = await profileActions.changeMyPassword(mockUser, { currentPassword: "old", newPassword: "new" });

      // Assert
      expect(result.success).toBe(true);
      expect(bcryptMock.compare.mock.calls.length).toBe(1);
      expect(bcryptMock.hash.mock.calls.length).toBe(1);
      expect(dbMock.user.update.mock.calls.length).toBe(1);
    });

    it("should_ReturnError_WhenCurrentPasswordIsIncorrect", async () => {
      // Arrange
      dbMock.user.findUnique.mock.mockImplementation(async () => ({ password: "hashed_old" }));
      bcryptMock.compare.mock.mockImplementation(async () => false); // Password mismatch

      // Act
      const result = await profileActions.changeMyPassword(mockUser, { currentPassword: "wrong", newPassword: "new" });

      // Assert
      expect(result.error).toBe("Current password is incorrect");
      expect(dbMock.user.update.mock.calls.length).toBe(0);
    });
  });
});
