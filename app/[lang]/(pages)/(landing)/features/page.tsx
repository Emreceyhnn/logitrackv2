import type { Metadata } from 'next';
import FeaturesClient from './FeaturesClient';

export const metadata: Metadata = {
  title: 'Features - LogiTrack v2',
  description: 'Explore the enterprise logistics features and capabilities of LogiTrack v2.',
};

export default function FeaturesPage() {
  return <FeaturesClient />;
}
