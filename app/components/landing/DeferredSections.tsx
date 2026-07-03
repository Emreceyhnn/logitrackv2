"use client";

import dynamic from "next/dynamic";

/**
 * Below-the-fold landing sections, loaded client-side only (`ssr: false`)
 * to keep the initial HTML and bundle small. Lives in its own client
 * component so the landing page itself can stay a Server Component.
 */
const SocialProof = dynamic(
  () => import("@/app/components/landing/SocialProof"),
  { ssr: false }
);
const OperationsDashboard = dynamic(
  () => import("@/app/components/landing/OperationsDashboard"),
  { ssr: false }
);
const FeaturesSection = dynamic(
  () => import("@/app/components/landing/FeaturesSection"),
  { ssr: false }
);

export default function DeferredSections() {
  return (
    <>
      <SocialProof />
      <OperationsDashboard />
      <FeaturesSection />
    </>
  );
}
