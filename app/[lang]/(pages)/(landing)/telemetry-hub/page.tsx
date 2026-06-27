import type { Metadata } from 'next';
import TelemetryHubClient from './TelemetryHubClient';

export const metadata: Metadata = {
  title: 'Telemetry Hub - LogiTrack v2',
  description: 'Every sensor, every signal, one dashboard. Aggregate IoT telemetry data in real-time.',
};

export default function TelemetryHubPage() {
  return <TelemetryHubClient />;
}
