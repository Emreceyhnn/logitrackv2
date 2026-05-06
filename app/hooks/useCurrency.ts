"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "@/app/lib/context/UserContext";
import { getExchangeRatesAction } from "@/app/lib/controllers/exchangeRate";
import {
  createCurrencyFormatter,
  formatCurrency,
  formatCurrencyCompact,
  CURRENCY_SYMBOLS,
} from "@/app/lib/utils/currency";
import type { SupportedCurrency } from "@/app/lib/utils/currency";

/**
 * useCurrency hook
 *
 * Provides currency formatting utilities based on the user's settings.
 * Exchange rates are fetched once per day from the server (cached in Redis).
 *
 * @example
 * const { format, compact, symbol, isLoading } = useCurrency();
 * format(1234)     // "$1,234" or "₺47,230" depending on user settings
 * compact(1234000) // "$1.2M" or "₺46.3M"
 */
export function useCurrency() {
  const { user } = useUserContext();
  const currency = (user?.currency as SupportedCurrency) || "USD";

  const { data: ratesData, isLoading } = useQuery({
    queryKey: ["exchange-rates"],
    queryFn: async () => {
      const result = await getExchangeRatesAction();
      if ("error" in result) throw new Error(result.error as string);
      return result;
    },
    // Refresh once per day - the server caches in Redis for 24h
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 2,
  });

  const rate = currency === "USD" ? 1 : (ratesData?.rates?.[currency] ?? 1);

  return useMemo(() => {
    const formatter = createCurrencyFormatter(currency, rate);

    return {
      /** Format a USD amount in the user's currency (e.g. "$1,234" or "₺47k") */
      format: (usdAmount: number, decimals = 0) =>
        formatCurrency(usdAmount, currency, rate, decimals),

      /** Compact format for large numbers (e.g. "$1.2k", "₺45M") */
      compact: (usdAmount: number) =>
        formatCurrencyCompact(usdAmount, currency, rate),

      /** Currency symbol (e.g. "$", "₺", "€", "£") */
      symbol: CURRENCY_SYMBOLS[currency] ?? "$",

      /** Converts an amount from a given currency to the user's currency */
      convertFrom: (amount: number, fromCurrency: string) => {
        if (fromCurrency === currency) return amount;
        const rateFrom = ratesData?.rates?.[fromCurrency] ?? 1;
        const rateTo = ratesData?.rates?.[currency] ?? 1;
        return (amount / rateFrom) * rateTo;
      },

      /** Formats an amount from a given currency to the user's currency */
      formatFrom: (amount: number, fromCurrency: string, decimals = 0) => {
        if (fromCurrency === currency)
          return formatter.formatDirect(amount, decimals);
        const rateFrom = ratesData?.rates?.[fromCurrency] ?? 1;
        const rateTo = ratesData?.rates?.[currency] ?? 1;
        const targetAmount = (amount / rateFrom) * rateTo;
        return formatter.formatDirect(targetAmount, decimals);
      },

      /** The user's currency code */
      currency,

      /** The current exchange rate (USD → user currency) */
      rate,

      /** Full formatter object */
      formatter,

      /** True while exchange rates are loading */
      isLoading,
    };
  }, [currency, rate, ratesData, isLoading]);
}
