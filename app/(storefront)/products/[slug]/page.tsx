import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ChevronRight,
  Clock,
  MessageCircle,
  Package,
  Ruler,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import ProductGallery from '@/components/storefront/ProductGallery'
import ProductOrderPanel from '@/components/storefront/ProductOrderPanel'
import ProductCard from '@/components/storefront/ProductCard'
import ProductViewTracker from '@/components/storefront/ProductViewTracker'
import { getProductBySlug, getPublicSettings, getRelatedProducts } from '@/lib/storefront'
import { formatPrice } from '@/lib/utils'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000'

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: 'Piece Not Found' }
  }

  const primaryImage =
    product.seoImage ||
    product.media[0]?.url ||
    undefined

  const description =
    product.seoDescription ||
    product.shortDescription ||
    `Discover ${product.name} at AWWALSHOP.`

  return {
    title: { absolute: product.seoTitle || `${product.name} | AWWALSHOP` },
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: 'website',
      title: product.seoTitle || product.name,
      description,
      url: `${siteUrl}/products/${product.slug}`,
      images: primaryImage
        ? [{ url: primaryImage, alt: product.name }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.seoTitle || product.name,
      description,
      images: primaryImage ? [primaryImage] : undefined,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const [settings, related] = await Promise.all([
    getPublicSettings(),
    getRelatedProducts(product.id, product.categoryId),
  ])

  const currencySymbol = settings?.currencySymbol ?? '₦'
  const canonicalUrl = `${siteUrl}/products/${product.slug}`
  const hasDiscount =
    product.discountPrice !== null &&
    Number(product.discountPrice) < Number(product.regularPrice)
  const sellingPrice = hasDiscount ? Number(product.discountPrice) : Number(product.regularPrice)

  const attributes =
    product.customAttributes &&
    typeof product.customAttributes === 'object' &&
    !Array.isArray(product.customAttributes)
      ? Object.entries(product.customAttributes).filter(
          (entry): entry is [string, string] => typeof entry[1] === 'string'
        )
      : []

  const specifications: { label: string; value: string }[] = [
    ...(product.material ? [{ label: 'Material', value: product.material }] : []),
    ...(product.colour ? [{ label: 'Colour', value: product.colour }] : []),
    ...(product.size ? [{ label: 'Size', value: product.size }] : []),
    ...(product.weight ? [{ label: 'Weight', value: product.weight }] : []),
    ...attributes.map(([label, value]) => ({ label, value })),
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.fullDescription || undefined,
    sku: product.sku || undefined,
    image: product.media.filter((media) => media.mediaType === 'IMAGE').map((media) => media.url),
    brand: { '@type': 'Brand', name: settings?.businessName || 'AWWALSHOP' },
    url: canonicalUrl,
    ...(product.showPrice
      ? {
          offers: {
            '@type': 'Offer',
            price: sellingPrice,
            priceCurrency: product.currency || 'NGN',
            availability:
              product.availability === 'OUT_OF_STOCK'
                ? 'https://schema.org/OutOfStock'
                : 'https://schema.org/InStock',
            url: canonicalUrl,
          },
        }
      : {}),
  }

  const categoryHref = product.category
    ? `/shop?category=${product.category.slug}`
    : '/shop'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductViewTracker
        productId={product.id}
        productName={product.name}
        category={product.category?.name}
        price={product.showPrice ? sellingPrice : undefined}
        currency={product.currency}
      />

      <section className="container-brand py-8 lg:py-12">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-taupe mb-8"
        >
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-gold transition-colors">
            Catalogue
          </Link>
          {product.category && (
            <>
              <ChevronRight size={12} />
              <Link href={categoryHref} className="hover:text-gold transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-espresso normal-case tracking-normal">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery media={product.media} productName={product.name} />
          </div>

          {/* Purchase panel */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32 flex flex-col gap-6">
              <div>
                {product.category && (
                  <Link
                    href={categoryHref}
                    className="text-[11px] uppercase tracking-[0.2em] text-gold font-medium hover:text-espresso transition-colors"
                  >
                    {product.category.parent
                      ? `${product.category.parent.name} · ${product.category.name}`
                      : product.category.name}
                  </Link>
                )}
                <h1 className="mt-3 font-heading text-4xl sm:text-5xl leading-[1.06] text-espresso">
                  {product.name}
                </h1>
                {product.shortDescription && (
                  <p className="mt-4 text-sm text-taupe leading-relaxed">
                    {product.shortDescription}
                  </p>
                )}
              </div>

              {product.showPrice ? (
                <div className="flex items-baseline flex-wrap gap-3">
                  <span className="font-heading text-3xl text-espresso">
                    {formatPrice(sellingPrice, { symbol: currencySymbol })}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-taupe line-through">
                      {formatPrice(product.regularPrice, { symbol: currencySymbol })}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="badge badge-featured">
                      Save{' '}
                      {formatPrice(
                        Number(product.regularPrice) - sellingPrice,
                        { symbol: currencySymbol }
                      )}
                    </span>
                  )}
                </div>
              ) : (
                <p className="font-heading text-2xl text-espresso">Price on request</p>
              )}

              <div className="h-px bg-sand" />

              <ProductOrderPanel
                productId={product.id}
                productName={product.name}
                category={product.category?.name}
                productUrl={canonicalUrl}
                currencyCode={product.currency}
                regularPrice={Number(product.regularPrice)}
                discountPrice={
                  product.discountPrice !== null ? Number(product.discountPrice) : null
                }
                showPrice={product.showPrice}
                availability={product.availability}
                variants={product.variants.map((variant) => ({
                  id: variant.id,
                  name: variant.name,
                  value: variant.value,
                  priceModifier: Number(variant.priceModifier),
                  availability: variant.availability,
                }))}
                whatsappNumber={settings?.whatsappNumber ?? '+2348000000000'}
                whatsappMessage={settings?.whatsappMessage ?? undefined}
                currencySymbol={currencySymbol}
              />

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-5 border-t border-sand text-[11px] text-taupe">
                <li className="flex items-start gap-2">
                  <Truck size={14} className="text-gold shrink-0 mt-0.5" />
                  {product.deliveryInfo || settings?.deliveryInfo || 'Insured delivery available.'}
                </li>
                <li className="flex items-start gap-2">
                  <Clock size={14} className="text-gold shrink-0 mt-0.5" />
                  {product.processingTime || settings?.processingInfo || 'Confirmed by concierge.'}
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck size={14} className="text-gold shrink-0 mt-0.5" />
                  Authenticity guaranteed on every piece.
                </li>
                <li className="flex items-start gap-2">
                  <Ruler size={14} className="text-gold shrink-0 mt-0.5" />
                  Bespoke sizing available on request.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      {product.fullDescription && (
        <section className="bg-white border-y border-sand/70">
          <div className="container-brand py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <span className="text-[11px] uppercase tracking-[0.28em] text-gold font-medium">
                The Piece
              </span>
              <h2 className="mt-3 font-heading text-3xl sm:text-4xl text-espresso">
                Details &amp; Craft
              </h2>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <p className="text-sm text-charcoal/80 leading-loose whitespace-pre-line">
                  {product.fullDescription}
                </p>
              </div>

              <div>
                {specifications.length > 0 && (
                  <dl className="border-t border-sand">
                    {specifications.map((spec) => (
                      <div
                        key={`${spec.label}-${spec.value}`}
                        className="flex items-start justify-between gap-6 py-3 border-b border-sand"
                      >
                        <dt className="text-[11px] uppercase tracking-[0.14em] text-taupe">
                          {spec.label}
                        </dt>
                        <dd className="text-sm text-espresso text-right">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                    {product.sku && (
                      <div className="flex items-start justify-between gap-6 py-3 border-b border-sand">
                        <dt className="text-[11px] uppercase tracking-[0.14em] text-taupe">
                          Reference
                        </dt>
                        <dd className="text-sm text-espresso text-right">
                          {product.sku}
                        </dd>
                      </div>
                    )}
                  </dl>
                )}

                <div className="mt-6 flex flex-col gap-3">
                  <details className="border border-sand bg-ivory/60 p-4 group">
                    <summary className="cursor-pointer text-[11px] uppercase tracking-[0.16em] font-medium text-espresso flex items-center gap-2 list-none">
                      <Package size={14} className="text-gold" />
                      Packaging &amp; Presentation
                    </summary>
                    <p className="text-sm text-taupe leading-relaxed mt-3">
                      Each piece arrives in signature AWWALSHOP packaging with a
                      care card. Jewellery is presented in a keepsake box;
                      tailored pieces are folded in garment bags.
                    </p>
                  </details>

                  <details className="border border-sand bg-ivory/60 p-4 group">
                    <summary className="cursor-pointer text-[11px] uppercase tracking-[0.16em] font-medium text-espresso flex items-center gap-2 list-none">
                      <MessageCircle size={14} className="text-gold" />
                      Bespoke &amp; Sizing
                    </summary>
                    <p className="text-sm text-taupe leading-relaxed mt-3">
                      Bespoke alterations, ring sizing and custom stone selection
                      are available. Start a WhatsApp conversation with our
                      concierge to discuss your requirements.
                    </p>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="section">
          <div className="container-brand">
            <div className="flex items-end justify-between gap-6 mb-10">
              <div>
                <span className="text-[11px] uppercase tracking-[0.28em] text-gold font-medium">
                  Continue Exploring
                </span>
                <h2 className="mt-3 font-heading text-3xl sm:text-4xl text-espresso">
                  You May Also Admire
                </h2>
              </div>
              <Link
                href={categoryHref}
                className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] hover:text-gold transition-colors"
              >
                View category
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  currencySymbol={currencySymbol}
                  whatsappNumber={
                    settings?.whatsappNumber ??
                    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ??
                    '+2348000000000'
                  }
                  whatsappMessage={settings?.whatsappMessage ?? undefined}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
