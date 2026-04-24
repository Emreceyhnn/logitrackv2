/**
 * Currency Utility Functions
 *
 * Use these helpers to format monetary values in the user's preferred currency.
 * All values in the DB are stored in USD.
 *
 * Usage:
 *   // Server-side (async):
 *   const formatted = await formatCurrencyAsync(1234.56, "TRY");
 *
 *   // Client-side (with pre-fetched rate):
 *   const formatted = formatCurrency(1234.56, "TRY", 38.5);
 */

import type { SupportedCurrency } from "@/app/lib/services/exchangeRate";

export type { SupportedCurrency };

/** Currency symbol map */
export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: "$",
  EUR: "€",
  TRY: "₺",
  GBP: "£",
};

/** Locale map for Intl.NumberFormat */
const CURRENCY_LOCALES: Record<SupportedCurrency, string> = {
  USD: "en-US",
  EUR: "de-DE",
  TRY: "tr-TR",
  GBP: "en-GB",
};

/**
 * Formats a monetary value using the user's currency settings.
 * Converts from USD using the provided exchange rate.
 *
 * @param usdAmount   - The amount in USD (as stored in the database)
 * @param currency    - Target currency code
 * @param rate        - Exchange rate (USD → currency), defaults to 1
 * @param decimals    - Number of decimal places (default: 0 for compact display)
 */
export function formatCurrency(
  amount: number,
  currency: SupportedCurrency = "USD",
  rate: number = 1,
  decimals: number = 0,
  isDirectAmount = false
): string {
  const converted = isDirectAmount ? amount : amount * rate;
  try {
    return new Intl.NumberFormat(CURRENCY_LOCALES[currency] || "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(converted);
  } catch {
    const symbol = CURRENCY_SYMBOLS[currency] ?? "$";
    return `${symbol}${converted.toFixed(decimals)}`;
  }
}

/**
 * Compact formatter for large numbers (e.g. $1.2k, ₺45k).
 * Useful for dashboard KPI cards.
 */
export function formatCurrencyCompact(
  usdAmount: number,
  currency: SupportedCurrency = "USD",
  rate: number = 1
): string {
  const converted = usdAmount * rate;
  const symbol = CURRENCY_SYMBOLS[currency] ?? "$";

  if (Math.abs(converted) >= 1_000_000) {
    return `${symbol}${(converted / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(converted) >= 1_000) {
    return `${symbol}${(converted / 1_000).toFixed(1)}k`;
  }
  return formatCurrency(usdAmount, currency, rate, 0);
}

/**
 * Returns a CurrencyFormatter object bound to a specific currency and rate.
 * Create once per component and reuse.
 */
export function createCurrencyFormatter(
  currency: SupportedCurrency = "USD",
  rate: number = 1
) {
  return {
    format: (usdAmount: number, decimals = 0) =>
      formatCurrency(usdAmount, currency, rate, decimals),
    formatDirect: (amount: number, decimals = 0) =>
      formatCurrency(amount, currency, 1, decimals, true),
    compact: (usdAmount: number) =>
      formatCurrencyCompact(usdAmount, currency, rate),
    symbol: CURRENCY_SYMBOLS[currency] ?? "$",
    currency,
    rate,
  };
}
