/**
 * Calculates the period-over-period percentage change between two numeric values.
 *
 * @param current  - Value for the current period
 * @param previous - Value for the previous (reference) period
 * @returns An object with `value` (rounded integer %) and `isUp` (boolean direction)
 *          or `undefined` when there is no previous data to compare against.
 */
export function calcTrend(
  current: number,
  previous: number
): { value: number; isUp: boolean } | undefined {
  // No previous data → cannot calculate trend
  if (previous === 0 && current === 0) return undefined;

  // Previous was 0 but current is not → treat as 100% increase
  if (previous === 0) return { value: 100, isUp: true };

  const pct = Math.round(((current - previous) / previous) * 100);
  return { value: Math.abs(pct), isUp: pct >= 0 };
}

/**
 * Returns the start-of-day Date for N days ago.
 */
export function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}
