import type { Metadata } from "next";
import HowItWorksClient from "./HowItWorksClient";
import { getServerDictionary } from "@/app/lib/language/i18n-server";
import type { Dictionary } from "@/app/lib/language/language";
import { getLocalizedPath } from "@/app/lib/language/navigation";
import JsonLd from "@/app/components/seo/JsonLd";

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang;
  const dict = getServerDictionary(lang) as Dictionary;
  const title = dict?.landing?.howItWorksPage?.hero?.title || "How It Works";
  const description = dict?.landing?.howItWorksPage?.hero?.subtitle || "Learn how LogiTrack works.";

  return {
    title: `${title} | LogiTrack`,
    description,
    alternates: {
      canonical: `/${lang}${getLocalizedPath("/how-it-works", lang)}`,
      languages: {
        en: `/en${getLocalizedPath("/how-it-works", "en")}`,
        tr: `/tr${getLocalizedPath("/how-it-works", "tr")}`,
      },
    },
  };
}

export default async function HowItWorksPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const lang = params.lang;
  const dict = getServerDictionary(lang) as Dictionary;
  const howItWorksDict = dict?.landing?.howItWorksPage;

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": howItWorksDict?.hero?.title || "How LogiTrack Works",
    "description": howItWorksDict?.hero?.subtitle || "A comprehensive, end-to-end logistics orchestration platform designed to scale with your business needs.",
    "step": [
      {
        "@type": "HowToStep",
        "name": dict?.landing?.workflow?.title1 || "Connect Your Fleet",
        "text": dict?.landing?.workflow?.desc1 || "Integrate telematics, TMS, and WMS data sources in minutes with prebuilt connectors.",
      },
      {
        "@type": "HowToStep",
        "name": dict?.landing?.workflow?.title2 || "Visualize Operations",
        "text": dict?.landing?.workflow?.desc2 || "Monitor every shipment and asset in real time with adaptive dashboards and heatmaps.",
      },
      {
        "@type": "HowToStep",
        "name": dict?.landing?.workflow?.title3 || "Automate Decisions",
        "text": dict?.landing?.workflow?.desc3 || "Trigger proactive workflows, alerts, and customer updates before issues escalate.",
      },
      {
        "@type": "HowToStep",
        "name": dict?.landing?.workflow?.title4 || "Optimize Routes",
        "text": dict?.landing?.workflow?.desc4 || "Leverage AI-driven route optimization to minimize fuel costs, idle time, and delays.",
      },
    ],
  };

  return (
    <>
      <JsonLd data={howToSchema} />
      <HowItWorksClient />
    </>
  );
}
