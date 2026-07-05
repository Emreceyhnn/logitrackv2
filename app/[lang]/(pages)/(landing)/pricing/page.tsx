import type { Metadata } from 'next';
import PricingClient from './PricingClient';
import { getDictionary } from '@/app/lib/language/language';
import { buildSeoAlternates } from '@/app/lib/language/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: dict.landing.pageMeta.pricing.title,
    description: dict.landing.pageMeta.pricing.description,
    alternates: buildSeoAlternates('/pricing', lang),
  };
}

export default function PricingPage() {
  return <PricingClient />;
}
