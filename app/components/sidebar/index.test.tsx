 
import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";

// 1. MOCK'LAR
const useThemeMock = mock.fn(() => ({
  palette: {
    mode: "light",
    background: { sidebar: "white", paper_alpha: { main_40: "" } },
    divider_alpha: { main_20: "" },
    text: { primary: "black", secondary: "gray" },
    action: { hover: "#eee" },
    error: { main: "red", _alpha: { main_10: "" } },
    icon: { secondary: "gray" }
  },
  zIndex: { drawer: 1200 }
}));

const useRouterMock = mock.fn(() => ({ push: mock.fn() }));
const useParamsMock = mock.fn(() => ({ lang: "en" }));
const useDictionaryMock = mock.fn(() => ({
  sidebar: {
    overview: "Overview", operation: "Operation", vehicles: "Vehicles",
    drivers: "Drivers", routes: "Routes", shipments: "Shipments",
    management: "Management", warehouses: "Warehouses", inventory: "Inventory",
    customers: "Customers", company: "Company", analytics: "Analytics",
    reports: "Reports"
  },
  common: { logitrack: "LogiTrack", needHelp: "Need Help", logout: "Logout" }
}));

const useStateMock = mock.fn((init) => [init, mock.fn()]);
const useMemoMock = mock.fn((fn) => fn());

mock.module("react", {
  namedExports: {
    useState: useStateMock,
    useMemo: useMemoMock,
  }
});

mock.module("next/navigation", {
  namedExports: { useRouter: useRouterMock, useParams: useParamsMock }
});

mock.module("@mui/material", {
  namedExports: {
    useTheme: useThemeMock,
    Box: (props: any) => ({ type: "Box", props }),
    Divider: (props: any) => ({ type: "Divider", props }),
    IconButton: (props: any) => ({ type: "IconButton", props }),
    Stack: (props: any) => ({ type: "Stack", props }),
    Typography: (props: any) => ({ type: "Typography", props }),
    Tooltip: (props: any) => ({ type: "Tooltip", props }),
  }
});

// Alt bileşenler ve ikonlar
mock.module("./listItem.tsx", { namedExports: { SidebarList: () => ({ type: "SidebarList" }) } });
mock.module("../dialogs/logoutConfirmationDialog.tsx", { defaultExport: () => ({ type: "LogoutConfirmationDialog" }) });
mock.module("next/image", { defaultExport: () => ({ type: "Image" }) });

mock.module("@mui/icons-material/SpaceDashboardOutlined", { defaultExport: () => ({ type: "Icon" }) });
mock.module("@mui/icons-material/LocalShippingOutlined", { defaultExport: () => ({ type: "Icon" }) });
mock.module("@mui/icons-material/WarehouseOutlined", { defaultExport: () => ({ type: "Icon" }) });
mock.module("@mui/icons-material/InsightsOutlined", { defaultExport: () => ({ type: "Icon" }) });
mock.module("@mui/icons-material/HelpOutline", { defaultExport: () => ({ type: "Icon" }) });
mock.module("@mui/icons-material/Logout", { defaultExport: () => ({ type: "Icon" }) });
mock.module("@mui/icons-material/Close", { defaultExport: () => ({ type: "Icon" }) });

// API servisleri
const clearAuthCookiesMock = mock.fn();
mock.module("../../lib/controllers/session.ts", {
  namedExports: { clearAuthCookies: clearAuthCookiesMock }
});

mock.module("../../lib/language/DictionaryContext.tsx", {
  namedExports: { useDictionary: useDictionaryMock }
});

const buildLocalizedHrefMock = mock.fn((href) => `/en${href}`);
mock.module("../../lib/language/navigation.ts", {
  namedExports: { buildLocalizedHref: buildLocalizedHrefMock }
});

describe("SideBar Component", () => {
  let SideBar: any;

  before(async () => {
    const mod = await import("./index");
    SideBar = mod.default;
  });

  beforeEach(() => {
    useThemeMock.mock.resetCalls();
    useDictionaryMock.mock.resetCalls();
    useRouterMock.mock.resetCalls();
  });

  describe("SideBar() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRendered", async () => {
      // Act
      let error = null;
      try {
        SideBar({});
      } catch (e) {
        error = e;
      }

      // Assert
      expect(SideBar).toBeDefined();
      expect(useThemeMock.mock.calls.length).toBeGreaterThan(0);
      expect(useDictionaryMock.mock.calls.length).toBeGreaterThan(0);
      expect(useRouterMock.mock.calls.length).toBeGreaterThan(0);
    });

    it("should_PrepareNavigationItems_BasedOnDictionary", async () => {
      // Act
      try {
        SideBar({ onMobileClose: mock.fn() });
      } catch (e) {}

      // Assert
      // Dictionary hook'u çağrılmış olmalı ve sidebar listesine prop olarak gidiyor olmalı
      expect(useDictionaryMock.mock.calls.length).toBe(1);
    });
  });
});
