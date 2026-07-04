import type { Metadata } from 'next';
import RouteIntelligenceClient from './RouteIntelligenceClient';
import { getDictionary } from '@/app/lib/language/language';

export const metadata: Metadata = {
  title: 'Route Intelligence - LogiTrack v2',
  description: 'AI-powered route optimization at scale. Reduce fuel costs and delivery times with ML-driven routing.',
};

export default async function RouteIntelligencePage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <RouteIntelligenceClient dict={dict} />;
}
