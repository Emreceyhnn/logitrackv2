import test from "node:test";
import assert from "node:assert";
import {
  getLocalizedPath,
  getCanonicalPath,
  buildLocalizedHref,
  isPathActive,
} from "../language/navigation.ts";

test("navigation utility functions", async (t) => {
  await t.test("getLocalizedPath translations", () => {
    // Standard translation
    assert.strictEqual(getLocalizedPath("/vehicle", "tr"), "/araclar");
    assert.strictEqual(getLocalizedPath("/vehicle", "en"), "/vehicle");
    
    // Multiple segments translation
    assert.strictEqual(getLocalizedPath("/auth/sign-in", "tr"), "/giris/oturuk-ac");
    assert.strictEqual(getLocalizedPath("/auth/sign-in", "en"), "/auth/sign-in");

    // Edge cases
    assert.strictEqual(getLocalizedPath("", "tr"), "/");
    assert.strictEqual(getLocalizedPath("/", "tr"), "/");
    assert.strictEqual(getLocalizedPath("/nonexistent-route", "tr"), "/nonexistent-route");
    assert.strictEqual(getLocalizedPath("/vehicle/extra/segments", "tr"), "/araclar/extra/segments");
  });

  await t.test("getCanonicalPath (reverse mapping)", () => {
    // Standard reverse translation
    assert.strictEqual(getCanonicalPath("/araclar", "tr"), "/vehicle");
    assert.strictEqual(getCanonicalPath("/vehicle", "en"), "/vehicle");

    // Multiple segments reverse translation
    assert.strictEqual(getCanonicalPath("/giris/oturuk-ac", "tr"), "/auth/sign-in");
    assert.strictEqual(getCanonicalPath("/auth/sign-in", "en"), "/auth/sign-in");

    // Edge cases
    assert.strictEqual(getCanonicalPath("", "tr"), "/");
    assert.strictEqual(getCanonicalPath("/", "tr"), "/");
    assert.strictEqual(getCanonicalPath("/nonexistent-slug", "tr"), "/nonexistent-slug");
    
    // Explicit regression check for vehicle singular resolution
    // Previously, /araclar would map back to /vehicles instead of /vehicle because of key ordering.
    assert.strictEqual(getCanonicalPath("/araclar", "tr"), "/vehicle");
  });

  await t.test("buildLocalizedHref", () => {
    assert.strictEqual(buildLocalizedHref("/vehicle", "tr"), "/tr/araclar");
    assert.strictEqual(buildLocalizedHref("/vehicle", "en"), "/en/vehicle");
    assert.strictEqual(buildLocalizedHref("/auth/sign-in", "tr"), "/tr/giris/oturuk-ac");
  });

  await t.test("isPathActive checks", () => {
    // Exact match
    assert.strictEqual(isPathActive("/tr/araclar", "/vehicle", "tr", true), true);
    assert.strictEqual(isPathActive("/tr/araclar/detail", "/vehicle", "tr", true), false);
    assert.strictEqual(isPathActive("/en/vehicle", "/vehicle", "en", true), true);

    // Prefix match (exact = false)
    assert.strictEqual(isPathActive("/tr/araclar", "/vehicle", "tr", false), true);
    assert.strictEqual(isPathActive("/tr/araclar/detail", "/vehicle", "tr", false), true);
    assert.strictEqual(isPathActive("/tr/other-route", "/vehicle", "tr", false), false);
  });
});
