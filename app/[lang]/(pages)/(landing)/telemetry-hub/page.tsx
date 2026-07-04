import type { Metadata } from 'next';
import TelemetryHubClient from './TelemetryHubClient';
import { getDictionary } from '@/app/lib/language/language';

export const metadata: Metadata = {
  title: 'Telemetry Hub - LogiTrack v2',
  description: 'Every sensor, every signal, one dashboard. Aggregate IoT telemetry data in real-time.',
};

export default async function TelemetryHubPage(props: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await props.params;
  const dict = await getDictionary(lang);
  return <TelemetryHubClient dict={dict} />;
}
