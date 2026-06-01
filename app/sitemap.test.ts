import { describe, it, before, mock } from "node:test";
import { expect } from "expect";

// Mock navigation
mock.module("@/app/lib/language/navigation", {
  namedExports: {
    getLocalizedPath: (route: string, lang: string) => `/${route}`
  }
});

describe("Sitemap Generate", () => {
  let sitemap: any;

  before(async () => {
    const mod = await import("./sitemap");
    sitemap = mod.default;
  });

  it("should_ReturnCorrectSitemapEntries", () => {
    const result = sitemap();
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0); // en, tr * routes
    
    const rootEntry = result.find((r: any) => r.priority === 1);
    expect(rootEntry).toBeTruthy();
    expect(rootEntry.alternates.languages.en).toBeDefined();
    expect(rootEntry.alternates.languages.tr).toBeDefined();
  });
});
