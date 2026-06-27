import type { Metadata } from 'next';
import OurMissionClient from './OurMissionClient';

export const metadata: Metadata = {
  title: 'Our Mission - LogiTrack v2',
  description: 'Moving the world with intelligence. Learn about our mission to make logistics smarter and more sustainable.',
};

export default function OurMissionPage() {
  return <OurMissionClient />;
}
