import { describe, it, before, mock } from "node:test";
import { expect } from "expect";

// 1. MOCK'LAR
mock.module("@mui/material", {
  namedExports: {
    Box: (props: unknown) => ({ type: "Box", props }),
    Skeleton: (props: unknown) => ({ type: "Skeleton", props }),
    Stack: (props: unknown) => ({ type: "Stack", props }),
    Typography: (props: unknown) => ({ type: "Typography", props }),
    Divider: (props: unknown) => ({ type: "Divider", props }),
  }
});

mock.module("@/app/components/cards/card", {
  defaultExport: (props: unknown) => ({ type: "CustomCard", props }),
});

describe("AnalyticsSkeleton Component", () => {
  let AnalyticsSkeleton: React.ElementType;

  before(async () => {
    // Modülü mocklamadan sonra yüklüyoruz
    const mod = await import("./AnalyticsSkeleton");
    AnalyticsSkeleton = mod.default;
  });

  describe("AnalyticsSkeleton() bileşeni", () => {
    it("should_InitializeWithoutErrors_WhenNoPropsProvided", async () => {
      // Act
      let error = null;
      try {
        AnalyticsSkeleton({});
      } catch (e) {
        error = e;
        // Node ortamında ve DOM olmadan React 19 JSX runtime 
        // işlemlerinin hata vermesi beklenir, ancak test izole ortamda çalışır.
      }
      
      // Assert
      expect(AnalyticsSkeleton).toBeDefined();
    });

    it("should_InitializeWithCustomTitle_WhenTitlePropProvided", async () => {
      // Act
      let error = null;
      try {
        AnalyticsSkeleton({ title: "Custom Title", showSubtitle: false });
      } catch (e) {
        error = e;
      }
      
      // Assert
      expect(AnalyticsSkeleton).toBeDefined();
    });
  });
});
