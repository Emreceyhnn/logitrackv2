import type { Metadata } from 'next';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
  title: 'Pricing - LogiTrack v2',
  description: 'Flexible enterprise logistics pricing plans for LogiTrack v2.',
};

export default function PricingPage() {
  return <PricingClient />;
}
