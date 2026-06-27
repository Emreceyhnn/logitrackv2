import type { Metadata } from 'next';
import SlaClient from './SlaClient';

export const metadata: Metadata = {
  title: 'SLA - LogiTrack v2',
  description: 'Our commitment to reliability with industry-leading uptime guarantees and transparent incident reporting.',
};

export default function SlaPage() {
  return <SlaClient />;
}
