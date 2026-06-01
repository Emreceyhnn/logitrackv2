/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, mock, beforeEach, before } from "node:test";
import { expect } from "expect";

// 1. MOCK'LAR
const reactMock = {
  useMemo: mock.fn((cb) => cb()),
};

const useUserMock = {
  useUser: mock.fn(() => ({ user: { timezone: "Europe/Istanbul", dateFormat: "DD.MM.YYYY", timeFormat: "24h" } })),
};

mock.module("react", { namedExports: reactMock });
mock.module("./useUser.ts", { namedExports: useUserMock });

// 2. TEST GRUPLARI
describe("useDateSettings Hook", () => {
  let useDateSettingsMod: any;

  before(async () => {
    useDateSettingsMod = await import("./useDateSettings");
  });

  beforeEach(() => {
    reactMock.useMemo.mock.resetCalls();
    useUserMock.useUser.mock.resetCalls();
  });

  it("should_ReturnDateSettingsDerivedFromUserObject", () => {
    // Act
    const settings = useDateSettingsMod.useDateSettings();

    // Assert
    expect(settings.timezone).toBe("Europe/Istanbul");
    expect(settings.dateFormat).toBe("DD.MM.YYYY");
    expect(settings.timeFormat).toBe("24h");
    
    expect(useUserMock.useUser.mock.calls.length).toBe(1);
  });
});
