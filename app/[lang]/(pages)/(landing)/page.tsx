"use client";

import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import HeroSection from "@/app/components/landing/HeroSection";

const SocialProof = dynamic(
  () => import("@/app/components/landing/SocialProof"),
  {
    ssr: false,
  }
);
const OperationsDashboard = dynamic(
  () => import("@/app/components/landing/OperationsDashboard"),
  {
    ssr: false,
  }
);
const FeaturesSection = dynamic(
  () => import("@/app/components/landing/FeaturesSection"),
  {
    ssr: false,
  }
);
const LandingFooter = dynamic(
  () => import("@/app/components/landing/LandingFooter"),
  {
    ssr: false,
  }
);

export default function LandingPage() {
  return (
    <Box component="main">
      <HeroSection />
      <SocialProof />
      <OperationsDashboard />
      <FeaturesSection />
      <LandingFooter />
    </Box>
  );
}
