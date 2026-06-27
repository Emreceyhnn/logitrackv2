import type { Metadata } from 'next';
import EngineeringClient from './EngineeringClient';

export const metadata: Metadata = {
  title: 'Engineering - LogiTrack v2',
  description: 'The technology behind the intelligence. Cloud-native architecture and real-time data processing at global scale.',
};

export default function EngineeringPage() {
  return <EngineeringClient />;
}
