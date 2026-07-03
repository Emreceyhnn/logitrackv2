import {
  redis,
  EXCHANGE_RATE_CACHE_TTL,
  exchangeRateCacheKeys,
} from "@/app/lib/redis";
import { db } from "@/app/lib/db";

export type SupportedCurrency = "USD" | "EUR" | "TRY" | "GBP";

export interface ExchangeRates {
  base: "USD";
  rates: Record<string, number>;
  lastUpdated: string;
}

interface ExchangeRateApiResponse {
  result: string;
  conversion_rates: Record<string, number>;
  "error-type"?: string;
}

/** Builds the base URL at call-time so env vars set after module load are respected. */
function getBaseUrl(): string {
  const baseUrl = process.env.EXCHANGE_RATE_BASE_URL;
  if (baseUrl) return baseUrl;

  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (apiKey) return `https://v6.exchangerate-api.com/v6/${apiKey}`;

  return "";
}

export async function getExchangeRates(): Promise<ExchangeRates> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Try DB cache first (most reliable, persists across restarts)
  try {
    const cachedDb = await db.exchangeRate.findFirst({
      where: { date: { gte: today } },
      orderBy: { date: "desc" },
    });

    if (cachedDb) {
      return {
        base: "USD",
        rates: cachedDb.rates as Record<string, number>,
        lastUpdated: cachedDb.date.toISOString(),
      };
    }
  } catch (err) {
    console.warn("[exchangeRate] DB get failed:", err);
  }

  // 2. Fall through to Redis cache (fast, in-memory)
  try {
    const cached = await redis.get<ExchangeRates>(
      exchangeRateCacheKeys.exchangeRate()
    );
    if (cached) return cached;
  } catch (err) {
    console.warn("[exchangeRate] Redis get failed:", err);
  }

  // 3. Fetch from external API
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error(
      "[exchangeRate] EXCHANGE_RATE_API_KEY is not set in environment variables."
    );
  }

  const response = await fetch(`${baseUrl}/latest/USD`);

  if (!response.ok) {
    throw new Error(
      `ExchangeRate-API error: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as ExchangeRateApiResponse;

  if (data.result !== "success") {
    throw new Error(`ExchangeRate-API returned: ${data["error-type"]}`);
  }

  const rates: ExchangeRates = {
    base: "USD",
    rates: data.conversion_rates,
    lastUpdated: new Date().toISOString(),
  };

  // 4. Persist to DB (fire-and-forget, non-blocking)
  try {
    await db.exchangeRate.create({
      data: {
        base: "USD",
        rates: data.conversion_rates,
        date: new Date(),
      },
    });
  } catch (err) {
    console.warn("[exchangeRate] DB save failed:", err);
  }

  // 5. Persist to Redis (fire-and-forget, non-blocking)
  try {
    await redis.set(exchangeRateCacheKeys.exchangeRate(), rates, {
      ex: EXCHANGE_RATE_CACHE_TTL,
    });
  } catch (err) {
    console.warn("[exchangeRate] Redis set failed:", err);
  }

  return rates;
}

export async function getExchangeRate(
  currency: SupportedCurrency
): Promise<number> {
  // USD is always 1:1 — no network call needed
  if (currency === "USD") return 1;

  try {
    const rates = await getExchangeRates();
    return rates.rates[currency] ?? 1;
  } catch (err) {
    console.error("[exchangeRate] Failed to get exchange rate:", err);
    return 1; // Fail-open: default to 1 to avoid breaking the UI
  }
}

/**
 * Converts a USD amount to the target currency.
 */
export async function convertFromUSD(
  usdAmount: number,
  targetCurrency: SupportedCurrency
): Promise<number> {
  if (targetCurrency === "USD") return usdAmount;
  const rate = await getExchangeRate(targetCurrency);
  return usdAmount * rate;
}

/**
 * Converts an amount from any supported currency to any other supported currency.
 * Uses USD as the intermediate pivot currency.
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) return amount;

  const { rates } = await getExchangeRates();
  const rateFrom = rates[fromCurrency] ?? 1;
  const rateTo = rates[toCurrency] ?? 1;

  // Step 1: Convert source currency → USD
  // Step 2: Convert USD → target currency
  return (amount / rateFrom) * rateTo;
}

/**
 * Forces a refresh of the exchange rate cache.
 * Useful for a cron job or admin trigger.
 */
export async function refreshExchangeRates(): Promise<ExchangeRates> {
  try {
    await redis.del(exchangeRateCacheKeys.exchangeRate());
  } catch {
    // Ignore Redis errors — we still want to attempt a fresh fetch
  }
  return getExchangeRates();
}
