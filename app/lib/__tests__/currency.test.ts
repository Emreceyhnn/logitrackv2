import test from "node:test";
import assert from "node:assert";
import {
  formatCurrency,
  formatCurrencyCompact,
  createCurrencyFormatter,
} from "../utils/currency.ts";

const cleanWhitespace = (str: string) => str.replace(/[\u00a0\u202f\s]+/g, " ");

test("currency formatting utilities", async (t) => {
  await t.test("formatCurrency basic functionality", () => {
    // USD formatting with default decimals = 0
    const resUSD = cleanWhitespace(formatCurrency(100, "USD", 1, 0));
    assert.ok(resUSD.includes("$") && resUSD.includes("100"));

    // USD formatting with decimals = 2
    const resUSDDec = cleanWhitespace(formatCurrency(100.5, "USD", 1, 2));
    assert.ok(resUSDDec.includes("$") && resUSDDec.includes("100.50"));

    // TRY formatting with conversion rate
    const resTRY = cleanWhitespace(formatCurrency(100, "TRY", 30, 2));
    // amount = 100, rate = 30 -> converted = 3000
    assert.ok(resTRY.includes("3") && resTRY.includes("000") && resTRY.includes("₺"));

    // Direct amount flag (ignores rate)
    const resTRYDirect = cleanWhitespace(formatCurrency(100, "TRY", 30, 2, true));
    assert.ok(resTRYDirect.includes("100") && resTRYDirect.includes("₺"));
  });

  await t.test("formatCurrencyCompact abbreviations", () => {
    // Compact millions
    const resMillions = cleanWhitespace(formatCurrencyCompact(1000000, "USD", 1));
    assert.strictEqual(resMillions, "$1.0M");

    // Compact thousands
    const resThousands = cleanWhitespace(formatCurrencyCompact(2500, "USD", 1));
    assert.strictEqual(resThousands, "$2.5k");

    // Under threshold (uses normal formatCurrency)
    const resNormal = cleanWhitespace(formatCurrencyCompact(150, "USD", 1));
    assert.ok(resNormal.includes("$") && resNormal.includes("150"));
  });

  await t.test("createCurrencyFormatter wrapper factory", () => {
    const formatter = createCurrencyFormatter("EUR", 1.1);

    assert.strictEqual(formatter.currency, "EUR");
    assert.strictEqual(formatter.rate, 1.1);
    assert.strictEqual(formatter.symbol, "€");

    // format (with rate conversion)
    const resFormat = cleanWhitespace(formatter.format(100, 2));
    // 100 * 1.1 = 110
    assert.ok(resFormat.includes("€") && resFormat.includes("110") && resFormat.includes("00"));

    // formatDirect (no rate conversion)
    const resFormatDirect = cleanWhitespace(formatter.formatDirect(100, 2));
    assert.ok(resFormatDirect.includes("€") && resFormatDirect.includes("100") && resFormatDirect.includes("00"));

    // compact
    const resCompact = cleanWhitespace(formatter.compact(1000000));
    // 1000000 * 1.1 = 1100000 -> 1.1M
    assert.strictEqual(resCompact, "€1.1M");
  });
});
