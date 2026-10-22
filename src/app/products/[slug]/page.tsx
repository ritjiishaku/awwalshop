import { notFound } from "next/navigation"
import Link from "next/link"
import { products } from "@/data/products"
import { siteConfig } from "@/data/site"
import { formatPrice, buildWhatsAppLink } from "@/lib/utils"
import { MediaGallery } from "@/components/site/media-gallery"
import { ProductCard } from "@/components/site/product-card"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) return { title: "Not Found" }
  return {
    title: `${product.name} — Awwalshop`,
    description: product.description ?? `Shop ${product.name} at Awwalshop. Chat on WhatsApp to order.`,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)
  if (!product) notFound()

  const related = products.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 3)

  const whatsappLink = buildWhatsAppLink({
    phone: siteConfig.whatsappNumber,
    productName: product.name,
    price: product.price,
    url: `https://awwalshop.com/products/${product.slug}`,
  })

  const whatsappEnquireLink = buildWhatsAppLink({
    phone: siteConfig.whatsappNumber,
    message: `Hi Awwal, I'd like to ask about the ${product.name}. Is it still available?`,
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-[var(--color-muted)]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[var(--color-ink)] transition-colors">
          Catalogue
        </Link>
        <span>/</span>
        <span className="text-[var(--color-ink)] font-medium">{product.name}</span>
      </nav>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <MediaGallery media={product.media} productName={product.name} />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          {/* Category */}
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-brass)]">
            {product.category}
          </span>

          {/* Name */}
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-[var(--color-ink)] sm:text-4xl">
            {product.name}
          </h1>

          {/* Price + stock */}
          <div className="flex items-center gap-4">
            <span className="font-display text-3xl font-semibold">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.inStock ? (
              <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                <span className="stock-dot" />
                In stock
              </span>
            ) : (
              <span className="rounded-full bg-[var(--color-sand)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]">
                Currently sold out
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="divider" />

          {/* Description */}
          {product.description && (
            <p className="text-base leading-relaxed text-[var(--color-muted)]">
              {product.description}
            </p>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* How to order info box */}
          <div className="rounded-xl border border-[var(--color-sand)] bg-[var(--color-sand)]/40 p-4 text-sm">
            <p className="mb-1 font-semibold text-[var(--color-ink)]">How to order</p>
            <p className="text-[var(--color-muted)] leading-relaxed">
              Tap the button below to open WhatsApp. Your message is pre-filled with this item's details — just send it and we'll confirm availability and arrange delivery.
            </p>
          </div>

          {/* CTAs */}
          {product.inStock ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2.5 rounded-full bg-[#25D366] py-4 text-base font-semibold text-white transition-all hover:bg-[#1ebe5d] hover:scale-[1.02] active:scale-95"
                id={`order-${product.slug}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order via WhatsApp
              </a>
              <a
                href={whatsappEnquireLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-[var(--color-sand)] bg-white px-6 py-4 text-base font-semibold text-[var(--color-ink)] transition-all hover:bg-[var(--color-sand)] hover:scale-[1.02] active:scale-95"
                id={`enquire-${product.slug}`}
              >
                Enquire
              </a>
            </div>
          ) : (
            <a
              href={whatsappEnquireLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-[var(--color-sand)] bg-white py-4 text-base font-semibold text-[var(--color-ink)] transition-all hover:bg-[var(--color-sand)]"
            >
              Ask about restock
            </a>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20">
          <div className="mb-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-brass)]">
              More jewellery
            </p>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              You might also like
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
