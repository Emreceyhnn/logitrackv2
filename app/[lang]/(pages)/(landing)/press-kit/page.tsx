import type { Metadata } from 'next';
import PressKitClient from './PressKitClient';

export const metadata: Metadata = {
  title: 'Press Kit - LogiTrack v2',
  description: 'Brand assets, press releases, and media resources for logistics technology coverage.',
};

export default function PressKitPage() {
  return <PressKitClient />;
}
