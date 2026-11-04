import Header from '@/components/storefront/Header'
import Footer from '@/components/storefront/Footer'
import StorefrontAnalytics from '@/components/storefront/StorefrontAnalytics'
import {
  getPublicSettings,
  getVisibleCategories,
} from '@/lib/storefront'

const SOCIAL_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'X',
  tiktok: 'TikTok',
  youtube: 'YouTube',
}

function toSocialLinks(value: unknown) {
  let parsed = value
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value)
    } catch {
      return []
    }
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return []

  return Object.entries(parsed as Record<string, unknown>)
    .filter(
      (entry): entry is [string, string] =>
        typeof entry[1] === 'string' && entry[1].trim().length > 0
    )
    .map(([key, href]) => ({
      label: SOCIAL_LABELS[key.toLowerCase()] ?? key,
      href,
    }))
}

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [settings, categories] = await Promise.all([
    getPublicSettings(),
    getVisibleCategories(),
  ])

  const whatsappNumber =
    settings?.whatsappNumber ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    '+2348000000000'
  const businessName = settings?.businessName || 'AWWALSHOP'

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
      <StorefrontAnalytics
        gaMeasurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
        metaPixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID}
        tiktokPixelId={process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-espresso focus:px-4 focus:py-2 focus:text-sm focus:text-ivory"
      >
        Skip to content
      </a>
      <Header whatsappNumber={whatsappNumber} categories={categories} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer
        businessName={businessName}
        whatsappNumber={whatsappNumber}
        categories={categories}
        email={settings?.email}
        contactPhone={settings?.contactPhone}
        address={settings?.address}
        deliveryInfo={settings?.deliveryInfo}
        socialLinks={toSocialLinks(settings?.socialLinks)}
      />
    </div>
  )
}
