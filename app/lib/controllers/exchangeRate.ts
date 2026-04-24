"use server";

import { getExchangeRates } from "@/app/lib/services/exchangeRate";
import { authenticatedAction } from "@/app/lib/auth-middleware";

/**
 * Server action to fetch current exchange rates (cached in Redis).
 * Call this from server components or server actions.
 */
export const getExchangeRatesAction = authenticatedAction(async () => {
  const rates = await getExchangeRates();
  return rates;
});
