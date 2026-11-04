import PageHeader from '@/components/admin/PageHeader'
import BusinessSettingsForm from '@/components/admin/BusinessSettingsForm'
import { getBusinessSettings } from '@/lib/queries'
import type { BusinessSettingsInput } from '@/lib/validations'

function asStringRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string'
    )
  )
}

const defaultWhatsAppMessage =
  'Hello Awwalshop,\n\nI am interested in ordering:\n\nProduct: {productName}\nPrice: {price}\n{variants}Quantity: {quantity}\nProduct link: {productUrl}\n\nPlease provide more information about availability and delivery.'

export default async function AdminSettingsPage() {
  const settings = await getBusinessSettings()
  const socialLinks = asStringRecord(settings?.socialLinks)
  const openingHours = asStringRecord(settings?.openingHours)

  const initialValues: BusinessSettingsInput = {
    businessName: settings?.businessName ?? 'AWWALSHOP',
    tagline: settings?.tagline ?? 'Elegance in Every Detail.',
    whatsappNumber: settings?.whatsappNumber ?? '+2348000000000',
    whatsappMessage: settings?.whatsappMessage ?? defaultWhatsAppMessage,
    contactPhone: settings?.contactPhone ?? '',
    email: settings?.email ?? '',
    address: settings?.address ?? '',
    currency:
      settings?.currency === 'USD' ||
      settings?.currency === 'GBP' ||
      settings?.currency === 'EUR'
        ? settings.currency
        : 'NGN',
    currencySymbol: settings?.currencySymbol ?? '₦',
    deliveryInfo: settings?.deliveryInfo ?? '',
    processingInfo: settings?.processingInfo ?? '',
    seoTitle: settings?.seoTitle ?? '',
    seoDescription: settings?.seoDescription ?? '',
    socialLinks: {
      instagram: socialLinks.instagram ?? '',
      facebook: socialLinks.facebook ?? '',
      twitter: socialLinks.twitter ?? '',
      tiktok: socialLinks.tiktok ?? '',
      youtube: socialLinks.youtube ?? '',
    },
    openingHours: {
      weekdays: openingHours.weekdays ?? '',
      saturday: openingHours.saturday ?? '',
      sunday: openingHours.sunday ?? '',
    },
  }

  return (
    <div>
      <PageHeader
        eyebrow="Configuration"
        title="Business Settings"
        description="Contact details, WhatsApp ordering, currency and service information used across the storefront."
      />

      <BusinessSettingsForm initialValues={initialValues} />
    </div>
  )
}
