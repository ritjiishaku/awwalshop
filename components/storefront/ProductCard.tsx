import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { buildWhatsAppOrderUrl, formatPrice } from '@/lib/utils'
import type { StorefrontProduct } from '@/lib/storefront'
import ProductQuickView from '@/components/storefront/ProductQuickView'
import ProductCardImageCarousel from '@/components/storefront/ProductCardImageCarousel'
import TrackedWhatsAppLink from '@/components/storefront/TrackedWhatsAppLink'

interface ProductCardProps {
  product: StorefrontProduct
  currencySymbol?: string
  whatsappNumber: string
  whatsappMessage?: string
  priority?: boolean
}

const availabilityLabels: Record<string, string> = {
  OUT_OF_STOCK: 'Sold Out',
  COMING_SOON: 'Coming Soon',
  MADE_TO_ORDER: 'Made to Order',
  DISCONTINUED: 'Discontinued',
}

export default function ProductCard({
  product,
  currencySymbol = '₦',
  whatsappNumber,
  whatsappMessage,
  priority = false,
}: ProductCardProps) {
  const hasDiscount =
    product.discountPrice !== null &&
    Number(product.discountPrice) < Number(product.regularPrice)
  const displayPrice = hasDiscount ? product.discountPrice! : product.regularPrice
  const unavailable =
    product.availability === 'OUT_OF_STOCK' ||
    product.availability === 'DISCONTINUED'
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'http://localhost:3000'
  const productUrl = `${siteUrl}/products/${product.slug}`
  const orderUrl = buildWhatsAppOrderUrl({
    productName: product.name,
    price: product.showPrice
      ? formatPrice(displayPrice, { symbol: currencySymbol })
      : 'Price on request',
    quantity: 1,
    productUrl,
    whatsappNumber,
    messageTemplate: whatsappMessage,
  })

  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.regularPrice) - Number(displayPrice)) /
          Number(product.regularPrice)) *
          100
      )
    : 0

  return (
    <article className="group/card flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-all duration-300 motion-reduce:transition-none sm:hover:-translate-y-1 sm:hover:border-line-strong sm:hover:shadow-card-hover">
      <div className="group/image relative isolate">
        <ProductCardImageCarousel
          images={product.media}
          productName={product.name}
          productHref={`/products/${product.slug}`}
          unavailable={unavailable}
          priority={priority}
        />

        <div className="pointer-events-none absolute left-2.5 top-2.5 flex max-w-[calc(100%-1.25rem)] flex-wrap gap-1.5 sm:left-3 sm:top-3">
          {unavailable ? (
            <span className="max-w-full truncate rounded-full bg-espresso px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-ivory shadow-sm sm:text-[9px]">
              {availabilityLabels[product.availability] ?? 'Unavailable'}
            </span>
          ) : product.availability === 'COMING_SOON' ? (
            <span className="max-w-full truncate rounded-full border border-white/70 bg-white/95 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-espresso shadow-sm backdrop-blur sm:text-[9px]">
              {availabilityLabels.COMING_SOON}
            </span>
          ) : product.availability === 'MADE_TO_ORDER' ? (
            <span className="max-w-full truncate rounded-full border border-white/70 bg-white/95 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-espresso shadow-sm backdrop-blur sm:text-[9px]">
              {availabilityLabels.MADE_TO_ORDER}
            </span>
          ) : (
            <>
              {product.isNewArrival && (
                <span className="max-w-full truncate rounded-full border border-white/70 bg-white/95 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-espresso shadow-sm backdrop-blur sm:text-[9px]">
                  New
                </span>
              )}
              {hasDiscount && (
                <span className="max-w-full truncate rounded-full bg-gold px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-espresso shadow-sm sm:text-[9px]">
                  Save {discountPercent}%
                </span>
              )}
            </>
          )}
        </div>

        {unavailable && (
          <span className="pointer-events-none absolute inset-0 bg-espresso/10" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
        <div className="min-h-4">
          {product.category && (
            <span className="block truncate text-[8px] font-semibold uppercase tracking-[0.18em] text-taupe sm:text-[9px]">
              {product.category.name}
            </span>
          )}
        </div>
        <h3 className="mt-1 min-h-[2.5rem] font-heading text-[15px] leading-snug [overflow-wrap:anywhere] sm:min-h-[3rem] sm:text-lg">
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 min-h-11 text-espresso transition-colors hover:text-[#a7823d]"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-2 flex min-h-6 min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {product.showPrice ? (
            <>
              <span className="max-w-full text-[13px] font-semibold tracking-tight text-espresso [overflow-wrap:anywhere] sm:text-base">
                {formatPrice(displayPrice, { symbol: currencySymbol })}
              </span>
              {hasDiscount && (
                <span className="text-[10px] text-taupe line-through sm:text-xs">
                  {formatPrice(product.regularPrice, { symbol: currencySymbol })}
                </span>
              )}
            </>
          ) : (
            <span className="text-[11px] italic text-taupe sm:text-xs">
              Price on request
            </span>
          )}
        </div>

        <ProductQuickView
          slug={product.slug}
          productName={product.name}
          whatsappNumber={whatsappNumber}
          whatsappMessage={whatsappMessage}
          currencySymbol={currencySymbol}
          className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-white px-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-taupe transition-colors hover:border-line-strong hover:bg-ivory hover:text-espresso focus-visible:outline-offset-1"
        />

        {!unavailable ? (
          <TrackedWhatsAppLink
            href={orderUrl}
            productId={product.id}
            productName={product.name}
            category={product.category?.name}
            price={product.showPrice ? Number(displayPrice) : undefined}
            currency={product.currency}
            quantity={1}
            ariaLabel={`Enquire about ${product.name} on WhatsApp`}
            className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-espresso px-2.5 text-center text-[9px] font-semibold uppercase tracking-[0.06em] text-ivory transition-colors hover:bg-[#372c26] active:scale-[0.98] focus-visible:outline-offset-2 motion-reduce:transition-none sm:px-3 sm:text-[10px]"
          >
            <MessageCircle size={14} className="shrink-0 text-gold" />
            <span>Order via WhatsApp</span>
          </TrackedWhatsAppLink>
        ) : (
          <span className="mt-2 inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-full border border-line bg-ivory/70 px-2.5 text-center text-[9px] font-semibold uppercase tracking-[0.08em] text-taupe sm:px-3 sm:text-[10px]">
            Currently unavailable
          </span>
        )}
      </div>
    </article>
  )
}
