import type { Metadata } from 'next';
import CareersClient from './CareersClient';

export const metadata: Metadata = {
  title: 'Careers - LogiTrack v2',
  description: 'Build the future of logistics. Join our team of engineers, designers, and logistics experts.',
};

export default function CareersPage() {
  return <CareersClient />;
}
