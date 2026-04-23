import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LogiTrack AI Logistics',
    short_name: 'LogiTrack',
    description: 'AI-powered logistics and fleet management platform.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#38bdf8',
    icons: [
      {
        src: '/logo1.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
