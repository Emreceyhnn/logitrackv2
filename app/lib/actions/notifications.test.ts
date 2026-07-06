 
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

mock.module("../firebase-admin.ts", { namedExports: { adminDb: adminDbMock } });
mock.module("../db.ts", { namedExports: { db: dbMock } });

// 2. TEST GRUPLARI
describe("Notifications Actions", () => {
  let notificationsActions: any;

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
      
      // Preference filtering happens in the DB query itself; findMany only
      // returns users who opted in to shipment emails.
      dbMock.user.findMany.mock.mockImplementation(async () => [
        { id: "u-1" },
        { id: "u-2" },
      ]);

      // Act
      const result = await notificationsActions.sendNotificationAction(target, notification as any);

      // Assert
      expect(result.success).toBe(true);
      expect(dbMock.user.findMany.mock.calls.length).toBe(1);
      // Opt-in filter must be part of the where clause for SHIPMENT_UPDATE
      const whereClause = dbMock.user.findMany.mock.calls[0].arguments[0].where;
      expect(whereClause.companyId).toBe("comp-1");
      expect(whereClause.notifEmailShipment).toBe(true);

      // One personal inbox write per opted-in user
      expect(adminDbMock.ref.mock.calls.length).toBe(2);
      expect(adminDbMock.ref.mock.calls[0].arguments[0]).toBe("notifications/inbox/u-1");
      expect(adminDbMock.ref.mock.calls[1].arguments[0]).toBe("notifications/inbox/u-2");
    });

    it("should_SendGlobalNotification_WhenIsGlobalIsTrue", async () => {
      // Arrange
      const target = { isGlobal: true };
      const notification = { title: "Global", message: "Hello", type: "SYSTEM" };

      // Act
      const result = await notificationsActions.sendNotificationAction(target, notification as any);

      // Assert
      expect(result.success).toBe(true);
      expect(adminDbMock.ref.mock.calls.length).toBe(1);
      expect(adminDbMock.ref.mock.calls[0].arguments[0]).toBe("notifications/broadcast");
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
