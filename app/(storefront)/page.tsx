import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPublicSettings, getVisibleCategories, getCatalogue } from '@/lib/storefront'

export const metadata = {
  title: 'AWWALSHOP — Elegance in Every Detail',
  description:
    'Discover premium jewellery, bespoke native attire, timepieces and lifestyle products at AWWALSHOP. Modern African Luxury.',
}

export default async function HomePage() {
  const [settings, categories, catalogue] = await Promise.all([
    getPublicSettings(),
    getVisibleCategories(),
    getCatalogue({}),
  ])

  const whatsappNumber =
    settings?.whatsappNumber ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    '+2348000000000'
  const conciergeHref = `https://wa.me/${whatsappNumber.replace(
    /[^\d]/g,
    ''
  )}?text=${encodeURIComponent(
    'Hello Awwalshop, I would like to inquire about your collection.'
  )}`

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(197,164,109,0.18),transparent_60%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-white/40 blur-3xl"
        />
        <div className="container-brand relative py-16 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <p className="eyebrow mx-auto">
              <span className="h-px w-6 bg-gold" />
              Modern African Luxury
            </p>
            <h1 className="mt-6 font-heading text-4xl leading-[1.02] text-espresso sm:text-6xl lg:text-7xl">
              Elegance in Every Detail
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-base leading-relaxed text-taupe sm:text-lg">
              Curated jewellery, fine timepieces and bespoke traditional attire — crafted for those who understand that true luxury lives in the details.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/shop" className="btn btn-primary">
                Explore the Collection
                <ArrowRight size={16} />
              </Link>
              <a
                href={conciergeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn border border-line-strong text-espresso hover:border-gold hover:text-espresso"
              >
                Speak to a Concierge
              </a>
            </div>
          </div>
        </div>
      </section>

      {catalogue.products.length > 0 && (
        <section className="container-brand pb-16 sm:pb-24">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">
                <span className="h-px w-6 bg-gold" />
                New Arrivals
              </p>
              <h2 className="mt-3 font-heading text-3xl text-espresso sm:text-4xl">
                Featured Pieces
              </h2>
            </div>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-sm text-taupe transition-colors hover:text-espresso"
            >
              View all pieces
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {catalogue.products.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group surface overflow-hidden transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="aspect-[4/5] w-full overflow-hidden bg-sand/40">
                  {product.media[0]?.url && (
                    <img
                      src={product.media[0].url}
                      alt={product.media[0].altText || product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">
                    {product.category?.name}
                  </p>
                  <h3 className="mt-2 font-heading text-lg text-espresso">
                    {product.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="container-brand pb-16 sm:pb-24">
          <div className="mb-8 text-center">
            <p className="eyebrow mx-auto">
              <span className="h-px w-6 bg-gold" />
              Browse by Category
            </p>
            <h2 className="mt-3 font-heading text-3xl text-espresso sm:text-4xl">
              Curated Collections
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="group relative overflow-hidden rounded-[1.25rem] border border-line"
              >
                <div className="aspect-[16/10] w-full bg-sand/40">
                  {category.imageUrl ? (
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-sand/60 to-ivory" />
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/90 via-espresso/50 to-transparent p-6">
                  <h3 className="font-heading text-xl text-ivory">{category.name}</h3>
                  <p className="mt-1 text-sm text-ivory/70">
                    {category.count} {category.count === 1 ? 'piece' : 'pieces'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
