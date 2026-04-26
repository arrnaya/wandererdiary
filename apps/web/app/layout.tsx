import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: {
    default: 'WandererDiary - Every journey has a story',
    template: '%s | WandererDiary',
  },
  description:
    'WandererDiary is a global community where travelers share real experiences, inspiring stories, and practical tips from around the world.',
  keywords: ['travel blog', 'travel stories', 'wanderlust', 'adventure', 'travel community'],
  icons: {
    icon: '/images/favicon.ico',
    shortcut: '/images/favicon.ico',
    apple: '/images/icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'WandererDiary',
  },
  twitter: {
    card: 'summary_large_image',
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
