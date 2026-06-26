import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import HeroSection from "@/app/components/landing/HeroSection";

const SocialProof = dynamic(
  () => import("@/app/components/landing/SocialProof"),
  {
    ssr: true,
  }
);
const OperationsDashboard = dynamic(
  () => import("@/app/components/landing/OperationsDashboard"),
  {
    ssr: true,
  }
);
const FeaturesSection = dynamic(
  () => import("@/app/components/landing/FeaturesSection"),
  {
    ssr: true,
  }
);
const LandingFooter = dynamic(
  () => import("@/app/components/landing/LandingFooter"),
  {
    ssr: true,
  }
);

export default function LandingPage() {
  return (
    <Box>
      <HeroSection />
      <SocialProof />
      <OperationsDashboard />
      <FeaturesSection />
      <LandingFooter />
    </Box>
  );
}
