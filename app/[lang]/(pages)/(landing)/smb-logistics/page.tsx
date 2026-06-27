import type { Metadata } from 'next';
import SmbLogisticsClient from './SmbLogisticsClient';

export const metadata: Metadata = {
  title: 'SMB Logistics - LogiTrack v2',
  description: 'Enterprise power with startup simplicity. AI-powered logistics for small and medium businesses.',
};

export default function SmbLogisticsPage() {
  return <SmbLogisticsClient />;
}
