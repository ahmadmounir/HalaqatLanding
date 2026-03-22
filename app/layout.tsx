import type { Metadata } from 'next'
import { Geist, Geist_Mono, Noto_Sans_Arabic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _notoSansArabic = Noto_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: 'Hafiz - Modern Quranic Education Management SaaS',
  description: 'Hafiz is a professional, multilingual, and secure multi-tenant platform designed to streamline student tracking, grading, and motivation for Quranic memorization institutions.',
  keywords: ['Quran Management System', 'Islamic School SaaS', 'Quran Hifz Tracker', 'Quranic Education', 'Halaqat Management'],
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/hafiz.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/hafiz.png',
        media: '(prefers-color-scheme: dark)',
      }
    ],
    apple: '/hafiz.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className='scroll-smooth'>
      <body className="font-sans antialiased ">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
