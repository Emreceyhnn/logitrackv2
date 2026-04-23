import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://logitrack.emreceyhan.xyz");
  
  const baseUrl = envUrl.replace(/\/$/, "").replace(/\/sitemap\.xml$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/api", "/_next", "/static"],
      },
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
