"use server";

import { getExchangeRates } from "@/app/lib/services/exchangeRate";
import { authenticatedAction } from "@/app/lib/auth-middleware";
import { controllerGuard } from "@/app/lib/controllers/utils/controllerGuard";

/**
 * Server action to fetch current exchange rates (cached in Redis).
 * Call this from server components or server actions.
 */
export const getExchangeRatesAction = authenticatedAction(async () => {
  return controllerGuard("getExchangeRatesAction", async () => {
    const rates = await getExchangeRates();
    return rates;
  });
});
