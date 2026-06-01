import { describe, it, before, mock, beforeEach } from "node:test";
import { expect } from "expect";

// MOCKLAR
const useThemeMock = mock.fn(() => ({
  palette: {
    primary: { main: "blue", _alpha: { main_30: "", main_08: "", main_12: "", main_18: "" } },
    text: { secondary: "gray", darkBlue: { _alpha: { main_50: "" } } },
    divider_alpha: { main_10: "" }
  }
}));

mock.module("@mui/material", {
  namedExports: {
    useTheme: useThemeMock,
    TextField: (props: unknown) => ({ type: "TextField", props }),
    InputAdornment: (props: unknown) => ({ type: "InputAdornment", props })
  }
});

mock.module("@mui/icons-material/KeyboardArrowDown", { defaultExport: () => ({ type: "KeyboardArrowDownIcon" }) });

describe("CustomTextArea Component", () => {
  let CustomTextArea: React.ElementType;

  before(async () => {
    const mod = await import("./customTextArea");
    CustomTextArea = mod.default;
  });

  beforeEach(() => {
    useThemeMock.mock.resetCalls();
  });

  describe("CustomTextArea() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenRenderedAsTextField", async () => {
      // Arrange
      const onChangeMock = mock.fn();

      // Act
      let error = null;
      try {
        CustomTextArea({
          name: "testField",
          value: "testValue",
          onChange: onChangeMock,
          label: "Test Label"
        });
      } catch (e) {
        error = e;
      }

      // Assert
      expect(error).toBeNull();
      expect(CustomTextArea).toBeDefined();
      expect(useThemeMock.mock.calls.length).toBeGreaterThan(0);
    });

    it("should_InitializeWithoutErrors_WhenRenderedAsSelect", async () => {
      // Arrange
      const onChangeMock = mock.fn();

      // Act
      let error = null;
      try {
        CustomTextArea({
          name: "selectField",
          value: "1",
          onChange: onChangeMock,
          select: true
        });
      } catch (e) {
        error = e;
      }

      // Assert
      expect(error).toBeNull();
      expect(useThemeMock.mock.calls.length).toBeGreaterThan(0);
    });
  });
});
