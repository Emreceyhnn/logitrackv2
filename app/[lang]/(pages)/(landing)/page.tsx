import type { Metadata } from "next";
import { Box } from "@mui/material";
import HeroSection from "@/app/components/landing/HeroSection";
import DeferredSections from "@/app/components/landing/DeferredSections";

export const metadata: Metadata = {
  title: "LogiTrack v2 — Enterprise Logistics Platform",
  description:
    "Real-time fleet tracking, route intelligence, warehouse operations and shipment management in one platform.",
};

// Server Component: the hero streams as server-rendered HTML for fast LCP and
// SEO; the below-the-fold sections hydrate client-side via DeferredSections.
export default function LandingPage() {
  return (
    <Box>
      <HeroSection />
      <DeferredSections />
    </Box>
  );
}
