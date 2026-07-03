import type { Metadata } from "next";
import HowItWorksClient from "./HowItWorksClient";
import { getServerDictionary } from "@/app/lib/language/i18n-server";

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const dict = getServerDictionary(params.lang);
  const title = dict?.landing?.howItWorksPage?.hero?.title || "How It Works";
  const description =
    dict?.landing?.howItWorksPage?.hero?.subtitle ||
    "Learn how LogiTrack works.";

  return {
    title: `${title} - LogiTrack v2`,
    description,
  };
}

export default function HowItWorksPage() {
  return <HowItWorksClient />;
}
