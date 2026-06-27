import type { Metadata } from 'next';
import SupplyChainClient from './SupplyChainClient';

export const metadata: Metadata = {
  title: 'Supply Chain - LogiTrack v2',
  description: 'End-to-end supply chain orchestration from raw materials to last-mile delivery.',
};

export default function SupplyChainPage() {
  return <SupplyChainClient />;
}
