import type { NextConfig } from "next";
import createBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // output: "standalone",

  // ── Security & Transport ────────────────────────────────────────────────
  poweredByHeader: false, // Remove X-Powered-By header (security)
  compress: true, // Enable gzip/brotli compression for all responses

  // ── React ───────────────────────────────────────────────────────────────
  reactStrictMode: true, // Catches hydration bugs in development early

  // ── Bundle Optimisations ────────────────────────────────────────────────
  // Next.js will only import the specific modules used from these packages
  // instead of bundling the entire barrel export. Saves 200-400KB on MUI alone.
  experimental: {
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "@mui/x-charts",
      "@mui/x-date-pickers",
      "dayjs",
      "framer-motion",
    ],
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/:lang/login",
        destination: "/:lang/auth/sign-in",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/en/auth/sign-in",
        permanent: true,
      },
    ];
  },

};

export default withBundleAnalyzer(nextConfig);
