import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { getPublicSettings } from '@/lib/storefront'

const headingFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-heading-family',
  display: 'swap',
})

const bodyFont = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body-family',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings().catch(() => null)

  const businessName = settings?.businessName || 'AWWALSHOP'
  const title = settings?.seoTitle || `${businessName} — Elegance in Every Detail`
  const description =
    settings?.seoDescription ||
    'Discover premium jewellery, bespoke native attire, timepieces and lifestyle products at AWWALSHOP. Modern African Luxury.'
  const ogImage = settings?.seoImage || '/opengraph-image'

  return {
    title: {
      default: title,
      template: `%s | ${businessName}`,
    },
    description,
    keywords: [
      'jewellery',
      'kaftan',
      'agbada',
      'watches',
      'luxury',
      'Nigeria',
      businessName,
    ],
    authors: [{ name: businessName }],
    creator: businessName,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    ),
    openGraph: {
      type: 'website',
      siteName: businessName,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable}`}
    >
      <body className="font-body bg-ivory text-charcoal antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
