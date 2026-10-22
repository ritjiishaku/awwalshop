import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types"
import { formatPrice, buildWhatsAppLink } from "@/lib/utils"
import { siteConfig } from "@/data/site"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.media.find((m) => m.type === "image")
  const whatsappLink = buildWhatsAppLink({
    phone: siteConfig.whatsappNumber,
    productName: product.name,
    price: product.price,
    url: `https://awwalshop.com/products/${product.slug}`,
  })

  return (
    <article className="group flex flex-col rounded-2xl overflow-hidden border border-[var(--color-sand)] bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden product-image-wrap bg-[var(--color-sand)]">
        {firstImage ? (
          <Image
            src={firstImage.src}
            alt={firstImage.alt ?? product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            priority={product.featured}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--color-muted)]">
            <span className="font-display text-4xl">A</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.featured && (
            <span className="rounded-full bg-[var(--color-brass)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
              Featured
            </span>
          )}
          {!product.inStock && (
            <span className="rounded-full bg-[var(--color-ink)]/80 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
              Sold out
            </span>
          )}
        </div>

        {/* Media count badge */}
        {product.media.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2 py-0.5 text-[11px] text-white backdrop-blur-sm">
            +{product.media.length - 1} photos
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <Link
            href={`/products/${product.slug}`}
            className="font-display text-lg leading-snug tracking-tight transition-colors hover:text-[var(--color-brass)]"
          >
            {product.name}
          </Link>
          {product.description && (
            <p className="text-sm leading-relaxed text-[var(--color-muted)] line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-[var(--color-sand)]">
          <div className="flex flex-col">
            <span className="font-display text-xl font-semibold text-[var(--color-ink)]">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.inStock ? (
              <span className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                <span className="stock-dot" />
                In stock
              </span>
            ) : (
              <span className="text-xs text-[var(--color-muted)]">Out of stock</span>
            )}
          </div>

          {product.inStock ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#1ebe5d] hover:scale-[1.03] active:scale-95"
              aria-label={`Order ${product.name} via WhatsApp`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order
            </a>
          ) : (
            <span className="rounded-full border border-[var(--color-sand)] px-4 py-2 text-xs font-medium text-[var(--color-muted)]">
              Notify me
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
