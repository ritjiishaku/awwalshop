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
      <section className="relative overflow-hidden border-b border-line bg-[linear-gradient(180deg,#faf8f5_0%,#fff_100%)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_82%_8%,rgba(197,164,109,0.22),transparent_52%),radial-gradient(ellipse_at_12%_82%,rgba(197,164,109,0.12),transparent_55%)]"
        />
        <div className="container-brand relative py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="eyebrow mx-auto">
              <span className="h-px w-6 bg-gold" />
              Modern African Luxury
            </p>
            <h1 className="mt-6 font-heading text-4xl leading-[1.02] text-espresso sm:text-6xl lg:text-7xl">
              Elegance in Every Detail
            </h1>
            <p className="mt-5 mx-auto max-w-2xl text-sm leading-relaxed text-taupe sm:text-base">
              Curated jewellery, fine timepieces and bespoke traditional attire — thoughtfully selected for gifts, celebrations and everyday elegance.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/shop" className="btn btn-primary">
                Explore the Catalogue
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

          {categories.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-2.5 sm:mt-12 sm:gap-4 lg:grid-cols-4">
              {categories.slice(0, 4).map((category, index) => (
                <Link
                  key={category.slug}
                  href={`/shop?category=${category.slug}`}
                  className="group overflow-hidden rounded-xl border border-line bg-white text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold/70 hover:shadow-card-hover"
                >
                  <div className="relative aspect-[1.35/1] overflow-hidden bg-sand/50">
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className={`flex h-full items-end p-3 ${
                          index % 4 === 0
                            ? 'bg-[linear-gradient(145deg,#ede5d8,#c5a36c)]'
                            : index % 4 === 1
                              ? 'bg-[linear-gradient(145deg,#5e665b,#b69a66)]'
                              : index % 4 === 2
                                ? 'bg-[linear-gradient(145deg,#303d39,#9c8055)]'
                                : 'bg-[linear-gradient(145deg,#d8c6a9,#a5795c)]'
                        }`}
                      >
                        <span className="font-heading text-4xl font-semibold text-white/75">
                          0{index + 1}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-espresso/45 to-transparent" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h2 className="font-heading text-base leading-tight text-espresso sm:text-xl">
                      {category.name}
                    </h2>
                    <div className="mt-2 flex items-center justify-between border-t border-gold/30 pt-2">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-taupe">
                        {category.count} {category.count === 1 ? 'piece' : 'pieces'}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#7a623a]">
                        View <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
