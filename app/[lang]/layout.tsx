import type { Metadata } from "next";

export async function generateStaticParams() {
  return [{ lang: "tr" }, { lang: "en" }];
}

export const metadata: Metadata = {
  title: "LogiTrack – AI Lojistik Yönetim Platformu",
  description:
    "Teslimatlarınızı, filonuzu ve operasyonlarınızı tek akıllı panelden yönetin.",
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // params is async in Next.js 15
  await params; // ensure params are resolved (lang is used by root layout via html[lang])
  return <>{children}</>;
}
