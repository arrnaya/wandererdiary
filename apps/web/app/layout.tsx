import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, Dancing_Script } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const dancing = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1E3D34',
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SERVER_URL?.startsWith('http')
      ? process.env.NEXT_PUBLIC_SERVER_URL
      : 'https://wandererdiary.com'
  ),
  title: {
    default: 'WandererDiary — Travel Stories, Tips & Community',
    template: '%s | WandererDiary',
  },
  description:
    'WandererDiary is a global community where travelers share real experiences, inspiring stories, and practical tips from around the world. Explore destinations, read adventures, and share your journey.',
  keywords: [
    'travel blog',
    'travel stories',
    'wanderlust',
    'adventure travel',
    'travel community',
    'travel tips',
    'destination guides',
    'backpacking',
    'solo travel',
    'travel writing',
  ],
  authors: [{ name: 'WandererDiary' }],
  creator: 'WandererDiary',
  publisher: 'WandererDiary',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/favicon.ico',
    shortcut: '/images/favicon.ico',
    apple: '/images/icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'WandererDiary',
    title: 'WandererDiary — Every Journey Has a Story',
    description:
      'Join a global community of travelers sharing real experiences, inspiring stories, and practical tips from around the world.',
    images: [
      {
        url: '/images/landing-page-hero-bg.png',
        width: 1672,
        height: 941,
        alt: 'WandererDiary — Travel Stories & Community',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WandererDiary — Every Journey Has a Story',
    description:
      'Join a global community of travelers sharing real experiences, inspiring stories, and practical tips from around the world.',
    images: ['/images/landing-page-hero-bg.png'],
    creator: '@wandererdiary',
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${dancing.variable}`}>
      <body>{children}</body>
    </html>
  )
}
