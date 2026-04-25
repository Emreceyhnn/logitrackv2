import { MetadataRoute } from "next";
import { getLocalizedPath } from "@/app/lib/language/navigation";

export default function sitemap(): MetadataRoute.Sitemap {
  const envUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://logitrack.emreceyhan.xyz");

  const baseUrl = envUrl.replace(/\/$/, "").replace(/\/sitemap\.xml$/, "");

  const locales = ["en", "tr"] as const;
  const publicRoutes = ["", "features", "pricing", "about", "how-it-works"];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((lang) => {
    publicRoutes.forEach((route) => {
      const localizedPath = getLocalizedPath(route, lang);

      const cleanPath = localizedPath.startsWith("/")
        ? localizedPath
        : `/${localizedPath}`;

      const url = `${baseUrl}/${lang}${cleanPath === "/" ? "" : cleanPath}`;

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${getLocalizedPath(route, "en") === "/" ? "" : getLocalizedPath(route, "en")}`,
            tr: `${baseUrl}/tr${getLocalizedPath(route, "tr") === "/" ? "" : getLocalizedPath(route, "tr")}`,
          },
        },
      });
    });
  });

  return sitemapEntries;
}
