import type { Metadata } from 'next';
import SecurityCenterClient from './SecurityCenterClient';

export const metadata: Metadata = {
  title: 'Security Center - LogiTrack v2',
  description: 'Zero-trust security for mission-critical logistics with enterprise-grade encryption and compliance.',
};

export default function SecurityCenterPage() {
  return <SecurityCenterClient />;
}
