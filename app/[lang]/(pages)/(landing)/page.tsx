import { Box } from "@mui/material";
import HeroSection from "@/app/components/landing/HeroSection";
import SocialProof from "@/app/components/landing/SocialProof";
import OperationsDashboard from "@/app/components/landing/OperationsDashboard";
import FeaturesSection from "@/app/components/landing/FeaturesSection";
import LandingFooter from "@/app/components/landing/LandingFooter";

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
