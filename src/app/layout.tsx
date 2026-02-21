import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Teko, Playfair_Display, Merriweather, Raleway, Oswald, Lora } from 'next/font/google'
import ServiceWorkerRegistration from '@/components/shared/ServiceWorkerRegistration'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const teko = Teko({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

const merriweather = Merriweather({
  variable: '--font-merriweather',
  weight: ['300', '400', '700'],
  subsets: ['latin'],
})

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
})

const oswald = Oswald({
  variable: '--font-oswald',
  subsets: ['latin'],
})

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Hamza Sivrikaya | Kişisel Antrenör',
  description: 'Hamza Sivrikaya - Kişisel Antrenör | Üye takip sistemi',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Hamza Sivrikaya',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0A',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${teko.variable} ${playfair.variable} ${merriweather.variable} ${raleway.variable} ${oswald.variable} ${lora.variable} antialiased`}>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
