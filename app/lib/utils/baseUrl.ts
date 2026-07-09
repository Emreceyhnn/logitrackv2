/** Resolves the public site origin, consistent across robots.ts, sitemap.ts, and layout metadata. */
export function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://logitrack.emreceyhan.xyz";

  return envUrl.replace(/\/$/, "");
}
