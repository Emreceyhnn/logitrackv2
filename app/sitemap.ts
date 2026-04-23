import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "")
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://logitrack.emreceyhan.xyz";
  const locales = ["en", "tr"];
  const publicRoutes = ["", "/features", "/pricing", "/about", "/how-it-works"];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((lang) => {
    publicRoutes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route}`,
            tr: `${baseUrl}/tr${route}`,
          },
        },
      });
    });
  });

  return sitemapEntries;
}
