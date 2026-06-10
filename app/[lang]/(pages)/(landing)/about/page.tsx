import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us - LogiTrack v2',
  description: 'Learn more about the mission and vision behind LogiTrack v2.',
};

export default function AboutPage() {
  return <AboutClient />;
}
