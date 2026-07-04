import type { Metadata } from "next";
import HowItWorksClient from "./HowItWorksClient";
import { getDictionary } from "@/app/lib/language/language";

export async function generateMetadata(props: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const dict = await getDictionary(params.lang);
  const title = dict?.landing?.howItWorksPage?.hero?.title || "How It Works";
  const description =
    dict?.landing?.howItWorksPage?.hero?.subtitle ||
    "Learn how LogiTrack works.";

  return {
    title: `${title} - LogiTrack v2`,
    description,
  };
}

export default async function HowItWorksPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <HowItWorksClient dict={dict} />;
}
