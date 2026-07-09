import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://logitrack.emreceyhan.xyz");
  
  const baseUrl = envUrl.replace(/\/$/, "").replace(/\/sitemap\.xml$/, "");

  // Marketing/landing content is meant to be crawled and cited by both
  // traditional search engines and AI answer engines/agents (ChatGPT,
  // Perplexity, Claude, Google AI Overview). Only login-gated app surfaces
  // (dashboard/auth/api) are off-limits — same disallow list for every bot.
  const disallow = ["/dashboard", "/auth", "/api", "/_next", "/static"];
  const aiCrawlers = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "ClaudeBot",
    "anthropic-ai",
    "Claude-User",
    "Claude-SearchBot",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "CCBot",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow,
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
