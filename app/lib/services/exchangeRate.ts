import { redis, EXCHANGE_RATE_CACHE_TTL, exchangeRateCacheKeys } from "@/app/lib/redis";
import { db } from "@/app/lib/db";

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const EXCHANGE_RATE_BASE_URL = process.env.EXCHANGE_RATE_BASE_URL || (EXCHANGE_RATE_API_KEY ? `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}` : "");

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

export async function getExchangeRates(): Promise<ExchangeRates> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const cachedDb = await db.exchangeRate.findFirst({
      where: {
        date: {
          gte: today,
        },
      },
      orderBy: {
        date: "desc",
      },
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

  try {
    const cached = await redis.get<ExchangeRates>(exchangeRateCacheKeys.exchangeRate());
    if (cached) {
      return cached;
    }
  } catch (err) {
    console.warn("[exchangeRate] Redis get failed:", err);
  }

  if (!EXCHANGE_RATE_BASE_URL) {
    throw new Error(
      "[exchangeRate] EXCHANGE_RATE_API_KEY is not set in environment variables."
    );
  }

  const response = await fetch(`${EXCHANGE_RATE_BASE_URL}/latest/USD`, {
    next: { revalidate: 0 },
  });

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

  try {
    await db.exchangeRate.create({
      data: {
        base: "USD",
        rates:
          data.conversion_rates as unknown as import("@prisma/client").Prisma.InputJsonValue,
        date: new Date(),
      },
    });
  } catch (err) {
    console.warn("[exchangeRate] DB save failed:", err);
  }

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
  if (currency === "USD") return 1;

  try {
    const rates = await getExchangeRates();
    return rates.rates[currency] ?? 1;
  } catch (err) {
    console.error("[exchangeRate] Failed to get exchange rate:", err);
    return 1;
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
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) return amount;

  const rates = await getExchangeRates();
  const rateFrom = rates.rates[fromCurrency] ?? 1;
  const rateTo = rates.rates[toCurrency] ?? 1;

  // Convert from origin currency to USD, then from USD to target currency
  const usdAmount = amount / rateFrom;
  return usdAmount * rateTo;
}

/**
 * Forces a refresh of the exchange rate cache.
 * Useful for a cron job or admin trigger.
 */
export async function refreshExchangeRates(): Promise<ExchangeRates> {
  try {
    await redis.del(exchangeRateCacheKeys.exchangeRate());
  } catch {
    // Ignore Redis errors
  }
  return getExchangeRates();
}
