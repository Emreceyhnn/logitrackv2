/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, before } from "node:test";
import { expect } from "expect";

describe("Robots Generate", () => {
  let robots: any;

  before(async () => {
    const mod = await import("./robots");
    robots = mod.default;
  });

  it("should_ReturnCorrectRobotsConfig", () => {
    const result = robots();
    
    expect(result.rules[0].userAgent).toBe("*");
    expect(result.rules[0].allow).toBe("/");
    expect(result.rules[1].userAgent).toBe("GPTBot");
    expect(result.rules[1].disallow).toContain("/");
    expect(result.sitemap).toContain("/sitemap.xml");
  });
});
