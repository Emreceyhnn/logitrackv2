import type { Metadata } from 'next';
import GlobalTrackingClient from './GlobalTrackingClient';

export const metadata: Metadata = {
  title: 'Global Tracking - LogiTrack v2',
  description: 'Real-time visibility across every continent. Monitor your fleet and shipments with sub-second precision.',
};

export default function GlobalTrackingPage() {
  return <GlobalTrackingClient />;
}
