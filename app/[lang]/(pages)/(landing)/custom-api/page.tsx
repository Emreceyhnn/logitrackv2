import type { Metadata } from 'next';
import CustomApiClient from './CustomApiClient';

export const metadata: Metadata = {
  title: 'Custom API - LogiTrack v2',
  description: 'Robust, high-performance APIs for custom logistics integrations and advanced automation.',
};

export default function CustomApiPage() {
  return <CustomApiClient />;
}
