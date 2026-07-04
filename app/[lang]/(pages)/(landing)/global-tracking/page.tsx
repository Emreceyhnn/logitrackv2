import type { Metadata } from 'next';
import GlobalTrackingClient from './GlobalTrackingClient';
import { getDictionary } from '@/app/lib/language/language';

export const metadata: Metadata = {
  title: 'Global Tracking - LogiTrack v2',
  description: 'Real-time visibility across every continent. Monitor your fleet and shipments with sub-second precision.',
};

export default async function GlobalTrackingPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <GlobalTrackingClient dict={dict} />;
}
