import { describe, it, mock, beforeEach, before } from "node:test";
import { expect } from "expect";

// 1. MOCK'LAR
const adminDbMock = {
  ref: mock.fn(() => ({
    push: mock.fn(() => ({
      key: "mock-key",
      set: mock.fn(async () => {}),
    })),
    update: mock.fn(async () => {}),
    remove: mock.fn(async () => {}),
  })),
};

const dbMock = {
  user: {
    findMany: mock.fn(),
  },
};

mock.module("@/app/lib/firebase-admin", { namedExports: { adminDb: adminDbMock } });
mock.module("../db", { namedExports: { db: dbMock } });

// 2. TEST GRUPLARI
describe("Notifications Actions", () => {
  let notificationsActions: unknown;

  before(async () => {
    notificationsActions = await import("./notifications");
  });

  beforeEach(() => {
    adminDbMock.ref.mock.resetCalls();
    dbMock.user.findMany.mock.resetCalls();
  });

  describe("sendNotificationAction() metodu", () => {
    it("should_SendTargetedBroadcast_WhenCompanyIdAndCategoryAreProvided", async () => {
      // Arrange
      const target = { companyId: "comp-1" };
      const notification = { title: "Update", message: "New update", type: "INFO", category: "SHIPMENT_UPDATE" };
      
      dbMock.user.findMany.mock.mockImplementation(async () => [
        { id: "u-1", notifEmailShipment: true }, // Should receive
        { id: "u-2", notifEmailShipment: false } // Should skip
      ]);

      // Act
      const result = await notificationsActions.sendNotificationAction(target, notification as unknown);

      // Assert
      expect(result.success).toBe(true);
      expect(dbMock.user.findMany.mock.calls.length).toBe(1);
      
      // ref("notifications/inbox/u-1") should be called
      expect(adminDbMock.ref.mock.calls.length).toBe(1);
      expect(adminDbMock.ref.mock.calls[0].arguments[0]).toBe("notifications/inbox/u-1");
    });

    it("should_SendGlobalNotification_WhenIsGlobalIsTrue", async () => {
      // Arrange
      const target = { isGlobal: true };
      const notification = { title: "Global", message: "Hello", type: "SYSTEM" };

      // Act
      const result = await notificationsActions.sendNotificationAction(target, notification as unknown);

      // Assert
      expect(result.success).toBe(true);
      expect(adminDbMock.ref.mock.calls.length).toBe(1);
      expect(adminDbMock.ref.mock.calls[0].arguments[0]).toBe("notifications/groups/everyone");
    });
  });

  describe("markAsReadAction() metodu", () => {
    it("should_MarkNotificationAsRead", async () => {
      const result = await notificationsActions.markAsReadAction("inbox/u-1", "notif-1");
      expect(result.success).toBe(true);
      expect(adminDbMock.ref.mock.calls[0].arguments[0]).toBe("inbox/u-1/notif-1");
    });
  });

  describe("deleteNotificationAction() metodu", () => {
    it("should_DeleteNotification", async () => {
      const result = await notificationsActions.deleteNotificationAction("inbox/u-1", "notif-1");
      expect(result.success).toBe(true);
      expect(adminDbMock.ref.mock.calls[0].arguments[0]).toBe("inbox/u-1/notif-1");
    });
  });
});
