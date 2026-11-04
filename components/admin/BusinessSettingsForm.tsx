'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Banknote,
  Clock,
  Loader2,
  MessageCircle,
  Save,
  Search,
  Share2,
  Store,
} from 'lucide-react'
import { updateBusinessSettings } from '@/lib/actions/content'
import type { BusinessSettingsInput } from '@/lib/validations'

interface BusinessSettingsFormProps {
  initialValues: BusinessSettingsInput
}

const CURRENCIES = [
  { code: 'NGN', label: 'Nigerian Naira (NGN)' },
  { code: 'USD', label: 'US Dollar (USD)' },
  { code: 'GBP', label: 'British Pound (GBP)' },
  { code: 'EUR', label: 'Euro (EUR)' },
] as const

export default function BusinessSettingsForm({
  initialValues,
}: BusinessSettingsFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<BusinessSettingsInput>({ defaultValues: initialValues })

  const seoTitle = watch('seoTitle') ?? ''
  const seoDescription = watch('seoDescription') ?? ''

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true)
    setError(null)

    const result = await updateBusinessSettings(values)

    if (!result.success) {
      setError(result.error)
      toast.error(result.error)
      setSaving(false)
      return
    }

    toast.success('Business settings updated.')
    setSaving(false)
    router.refresh()
  })

  return (
    <form onSubmit={onSubmit} className="max-w-4xl space-y-6">
      {error && (
        <div className="border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      <section className="surface">
        <div className="px-5 py-4 border-b border-line flex items-center gap-3">
          <span className="rounded-lg p-2 bg-[#faf7f1] border border-line text-gold">
            <Store size={16} />
          </span>
          <div>
            <h2 className="font-heading text-xl text-espresso">Business identity</h2>
            <p className="text-[11px] text-taupe mt-0.5">
              Used in the storefront footer, metadata and contact details.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="business-name">Business name *</label>
            <input
              id="business-name"
              className="input"
              {...register('businessName', {
                required: 'Business name is required',
              })}
            />
            {errors.businessName && (
              <p className="text-xs text-rose-700 mt-1">{errors.businessName.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="business-tagline">Tagline</label>
            <input
              id="business-tagline"
              className="input"
              placeholder="Elegance in Every Detail."
              {...register('tagline')}
            />
          </div>

          <div>
            <label className="label" htmlFor="business-email">Email address</label>
            <input
              id="business-email"
              type="email"
              className="input"
              placeholder="concierge@awwalshop.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-rose-700 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="business-phone">Contact phone</label>
            <input
              id="business-phone"
              className="input"
              placeholder="+234 800 000 0000"
              {...register('contactPhone')}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="business-address">Showroom address</label>
            <input
              id="business-address"
              className="input"
              placeholder="Victoria Island, Lagos, Nigeria"
              {...register('address')}
            />
          </div>
        </div>
      </section>

      <section className="surface">
        <div className="px-5 py-4 border-b border-line flex items-center gap-3">
          <span className="rounded-lg p-2 bg-[#faf7f1] border border-line text-gold">
            <MessageCircle size={16} />
          </span>
          <div>
            <h2 className="font-heading text-xl text-espresso">WhatsApp ordering</h2>
            <p className="text-[11px] text-taupe mt-0.5">
              Powers every order button, enquiry form and concierge link.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label" htmlFor="whatsapp-number">WhatsApp number *</label>
              <input
                id="whatsapp-number"
                className="input"
                placeholder="+234 800 000 0000"
                {...register('whatsappNumber', {
                  required: 'WhatsApp number is required',
                })}
              />
              {errors.whatsappNumber && (
                <p className="text-xs text-rose-700 mt-1">{errors.whatsappNumber.message}</p>
              )}
              <p className="text-[11px] text-taupe mt-1.5">
                Include the country code. Spaces and dashes are removed automatically.
              </p>
            </div>

            <div className="rounded-xl bg-[#faf7f1] border border-line p-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-taupe font-semibold">
                Available placeholders
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['{productName}', '{price}', '{variants}', '{quantity}', '{productUrl}'].map(
                  (token) => (
                    <code
                      key={token}
                      className="rounded-md border border-line bg-white px-1.5 py-0.5 font-mono text-[10px] text-espresso"
                    >
                      {token}
                    </code>
                  )
                )}
              </div>
              <p className="text-[11px] text-taupe mt-2 leading-relaxed">
                Keep these tokens in the template — they are replaced with live order details.
              </p>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="whatsapp-message">Default inquiry message *</label>
            <textarea
              id="whatsapp-message"
              rows={8}
              className="input textarea font-mono text-xs"
              {...register('whatsappMessage', {
                required: 'WhatsApp message template is required',
              })}
            />
            {errors.whatsappMessage && (
              <p className="text-xs text-rose-700 mt-1">{errors.whatsappMessage.message}</p>
            )}
          </div>
        </div>
      </section>

      <section className="surface">
        <div className="px-5 py-4 border-b border-line flex items-center gap-3">
          <span className="rounded-lg p-2 bg-[#faf7f1] border border-line text-gold">
            <Banknote size={16} />
          </span>
          <div>
            <h2 className="font-heading text-xl text-espresso">Pricing &amp; currency</h2>
            <p className="text-[11px] text-taupe mt-0.5">
              The symbol shown beside every product price.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="currency">Currency code</label>
            <select id="currency" className="input" {...register('currency')}>
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="currency-symbol">Currency symbol *</label>
            <input
              id="currency-symbol"
              className="input"
              placeholder="₦"
              {...register('currencySymbol', {
                required: 'Currency symbol is required',
              })}
            />
            {errors.currencySymbol && (
              <p className="text-xs text-rose-700 mt-1">{errors.currencySymbol.message}</p>
            )}
          </div>
        </div>
      </section>

      <section className="surface">
        <div className="px-5 py-4 border-b border-line flex items-center gap-3">
          <span className="rounded-lg p-2 bg-[#faf7f1] border border-line text-gold">
            <Clock size={16} />
          </span>
          <div>
            <h2 className="font-heading text-xl text-espresso">Service &amp; opening hours</h2>
            <p className="text-[11px] text-taupe mt-0.5">
              Delivery expectations and atelier hours shown on the contact page.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="delivery-info">Delivery information</label>
            <textarea
              id="delivery-info"
              rows={3}
              className="input textarea"
              {...register('deliveryInfo')}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label" htmlFor="processing-info">Processing information</label>
            <textarea
              id="processing-info"
              rows={3}
              className="input textarea"
              {...register('processingInfo')}
            />
          </div>

          <div>
            <label className="label" htmlFor="hours-weekdays">Weekdays</label>
            <input
              id="hours-weekdays"
              className="input"
              placeholder="9:00 AM – 6:00 PM"
              {...register('openingHours.weekdays')}
            />
          </div>

          <div>
            <label className="label" htmlFor="hours-saturday">Saturday</label>
            <input
              id="hours-saturday"
              className="input"
              placeholder="10:00 AM – 4:00 PM"
              {...register('openingHours.saturday')}
            />
          </div>

          <div>
            <label className="label" htmlFor="hours-sunday">Sunday</label>
            <input
              id="hours-sunday"
              className="input"
              placeholder="Closed"
              {...register('openingHours.sunday')}
            />
          </div>
        </div>
      </section>

      <section className="surface">
        <div className="px-5 py-4 border-b border-line flex items-center gap-3">
          <span className="rounded-lg p-2 bg-[#faf7f1] border border-line text-gold">
            <Search size={16} />
          </span>
          <div>
            <h2 className="font-heading text-xl text-espresso">Search appearance</h2>
            <p className="text-[11px] text-taupe mt-0.5">
              Default metadata used when the storefront is shared or indexed.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div>
            <label className="label" htmlFor="seo-title">Default SEO title</label>
            <input
              id="seo-title"
              className="input"
              placeholder="AWWALSHOP — Elegance in Every Detail"
              {...register('seoTitle')}
            />
            <p className="text-[11px] text-taupe mt-1">{seoTitle.length}/70 characters</p>
          </div>

          <div>
            <label className="label" htmlFor="seo-description">Default SEO description</label>
            <textarea
              id="seo-description"
              rows={3}
              className="input textarea"
              {...register('seoDescription')}
            />
            <p className="text-[11px] text-taupe mt-1">
              {seoDescription.length}/160 characters
            </p>
          </div>
        </div>
      </section>

      <section className="surface">
        <div className="px-5 py-4 border-b border-line flex items-center gap-3">
          <span className="rounded-lg p-2 bg-[#faf7f1] border border-line text-gold">
            <Share2 size={16} />
          </span>
          <div>
            <h2 className="font-heading text-xl text-espresso">Social profiles</h2>
            <p className="text-[11px] text-taupe mt-0.5">
              Linked from the footer. Leave any field blank to hide that icon.
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label" htmlFor="social-instagram">Instagram</label>
            <input
              id="social-instagram"
              className="input font-mono text-xs"
              placeholder="https://instagram.com/awwalshop"
              {...register('socialLinks.instagram')}
            />
            {errors.socialLinks?.instagram && (
              <p className="text-xs text-rose-700 mt-1">{errors.socialLinks.instagram.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="social-facebook">Facebook</label>
            <input
              id="social-facebook"
              className="input font-mono text-xs"
              placeholder="https://facebook.com/awwalshop"
              {...register('socialLinks.facebook')}
            />
            {errors.socialLinks?.facebook && (
              <p className="text-xs text-rose-700 mt-1">{errors.socialLinks.facebook.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="social-twitter">X (Twitter)</label>
            <input
              id="social-twitter"
              className="input font-mono text-xs"
              placeholder="https://x.com/awwalshop"
              {...register('socialLinks.twitter')}
            />
            {errors.socialLinks?.twitter && (
              <p className="text-xs text-rose-700 mt-1">{errors.socialLinks.twitter.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="social-tiktok">TikTok</label>
            <input
              id="social-tiktok"
              className="input font-mono text-xs"
              placeholder="https://tiktok.com/@awwalshop"
              {...register('socialLinks.tiktok')}
            />
            {errors.socialLinks?.tiktok && (
              <p className="text-xs text-rose-700 mt-1">{errors.socialLinks.tiktok.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="social-youtube">YouTube</label>
            <input
              id="social-youtube"
              className="input font-mono text-xs"
              placeholder="https://youtube.com/@awwalshop"
              {...register('socialLinks.youtube')}
            />
            {errors.socialLinks?.youtube && (
              <p className="text-xs text-rose-700 mt-1">{errors.socialLinks.youtube.message}</p>
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-line pt-5">
        <p className="text-[11px] text-taupe">
          {isDirty ? 'You have unsaved changes.' : 'All changes are saved.'}
        </p>
        <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </form>
  )
}
