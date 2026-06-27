import type { Metadata } from 'next';
import RouteIntelligenceClient from './RouteIntelligenceClient';

export const metadata: Metadata = {
  title: 'Route Intelligence - LogiTrack v2',
  description: 'AI-powered route optimization at scale. Reduce fuel costs and delivery times with ML-driven routing.',
};

export default function RouteIntelligencePage() {
  return <RouteIntelligenceClient />;
}
