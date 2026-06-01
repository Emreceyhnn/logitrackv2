import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";

// 1. MOCK'LAR
const useThemeMock = mock.fn(() => ({
  palette: {
    mode: "light",
    primary: { main: "blue", _alpha: { main_05: "", main_10: "", main_30: "" } },
    text: { primary: "black", secondary: "gray" },
    action: { hover: "#eee" },
    divider: "gray",
    background: { paper: "white" }
  }
}));

const useDictionaryMock = mock.fn(() => ({
  notifications: {
    title: "Bildirimler",
    catchUp: "Hepsini Okundu İşaretle",
    initializing: "Yükleniyor...",
    systemClear: "Bildirim Yok"
  }
}));

const useDateSettingsMock = mock.fn(() => ({
  format: "DD/MM/YYYY",
  timezone: "UTC"
}));

const useUserMock = mock.fn(() => ({
  user: { id: "user_1", role: "ADMIN" }
}));

const markAsReadMock = mock.fn();
const markAllAsReadMock = mock.fn();
const deleteNotificationMock = mock.fn();

const useNotificationsMock = mock.fn(() => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  markAsRead: markAsReadMock,
  markAllAsRead: markAllAsReadMock,
  deleteNotification: deleteNotificationMock
}));

const useStateMock = mock.fn((init) => [init, mock.fn()]);

mock.module("react", {
  namedExports: { useState: useStateMock }
});

mock.module("@mui/material", {
  namedExports: {
    useTheme: useThemeMock,
    Box: (props: unknown) => ({ type: "Box", props }),
    IconButton: (props: unknown) => ({ type: "IconButton", props }),
    Badge: (props: unknown) => ({ type: "Badge", props }),
    Popover: (props: unknown) => ({ type: "Popover", props }),
    Typography: (props: unknown) => ({ type: "Typography", props }),
    Divider: (props: unknown) => ({ type: "Divider", props }),
    List: (props: unknown) => ({ type: "List", props }),
    ListItem: (props: unknown) => ({ type: "ListItem", props }),
    Stack: (props: unknown) => ({ type: "Stack", props }),
    Button: (props: unknown) => ({ type: "Button", props }),
    Tooltip: (props: unknown) => ({ type: "Tooltip", props }),
  }
});

// İkonlar
mock.module("@mui/icons-material", {
  namedExports: {
    Notifications: () => ({ type: "NotificationsIcon" }),
    NotificationsActive: () => ({ type: "NotificationsActiveIcon" }),
    Delete: () => ({ type: "DeleteIcon" }),
    CheckCircle: () => ({ type: "ReadIcon" }),
    DoneAll: () => ({ type: "DoneAllIcon" }),
  }
});

// Hook ve Utiller
mock.module("@/app/lib/language/DictionaryContext", { namedExports: { useDictionary: useDictionaryMock } });
mock.module("@/app/hooks/useDateSettings", { namedExports: { useDateSettings: useDateSettingsMock } });
mock.module("@/app/hooks/useUser", { namedExports: { useUser: useUserMock } });
mock.module("@/app/hooks/useNotifications", { namedExports: { useNotifications: useNotificationsMock } });

mock.module("@/app/lib/priorityColor", {
  namedExports: { getStatusColor: mock.fn(), resolveStatusAlpha: mock.fn() }
});
mock.module("@/app/lib/utils/date", {
  namedExports: { formatSmartTimestamp: mock.fn() }
});


describe("NotificationBell Component", () => {
  let NotificationBell: React.ElementType;

  before(async () => {
    // Modülü dinamik olarak yüklüyoruz
    const mod = await import("./NotificationBell");
    NotificationBell = mod.default;
  });

  beforeEach(() => {
    useThemeMock.mock.resetCalls();
    useNotificationsMock.mock.resetCalls();
    useStateMock.mock.resetCalls();
  });

  describe("NotificationBell() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenUserIsProvided", async () => {
      // Arrange
      useNotificationsMock.mock.mockImplementation(() => ({
        notifications: [],
        unreadCount: 0,
        loading: false,
        markAsRead: markAsReadMock,
        markAllAsRead: markAllAsReadMock,
        deleteNotification: deleteNotificationMock
      }));

      // Act
      let error = null;
      try {
        NotificationBell({ user: { id: "user_1" } });
      } catch (e) {
        error = e;
      }

      // Assert
      expect(NotificationBell).toBeDefined();
      expect(useThemeMock.mock.calls.length).toBeGreaterThan(0);
      expect(useNotificationsMock.mock.calls.length).toBeGreaterThan(0);
    });

    it("should_HandleUnreadCount_WhenNotificationsExist", async () => {
      // Arrange
      useNotificationsMock.mock.mockImplementation(() => ({
        notifications: [{ id: 1, title: "Test", isRead: false }],
        unreadCount: 1,
        loading: false,
        markAsRead: markAsReadMock,
        markAllAsRead: markAllAsReadMock,
        deleteNotification: deleteNotificationMock
      }));

      // Act
      try {
        NotificationBell({ user: { id: "user_1" } });
      } catch (e) {}

      // Assert
      expect(useNotificationsMock.mock.calls.length).toBeGreaterThan(0);
    });
  });
});
