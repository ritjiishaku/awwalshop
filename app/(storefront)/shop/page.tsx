import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ChevronRight, SearchX } from 'lucide-react'
import ProductCard from '@/components/storefront/ProductCard'
import { CatalogueSort } from '@/components/storefront/CatalogueFilters'
import CatalogueLayout from '@/components/storefront/CatalogueLayout'
import ActiveFilters from '@/components/storefront/ActiveFilters'
import Pagination from '@/components/storefront/Pagination'
import ProductListTracker from '@/components/storefront/ProductListTracker'
import CategoryDropdown from '@/components/storefront/CategoryDropdown'
import {
  getCatalogue,
  getPublicSettings,
  getVisibleCategories,
} from '@/lib/storefront'
import type { CatalogueSearchParams } from '@/lib/storefront'

export const metadata: Metadata = {
  title: 'Catalogue',
  description:
    'Browse, search and filter the AWWALSHOP product catalogue.',
  alternates: { canonical: '/shop' },
}

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolved = await searchParams

  const params: CatalogueSearchParams = {
    q: firstValue(resolved.q),
    category: firstValue(resolved.category),
    availability: firstValue(resolved.availability),
    minPrice: firstValue(resolved.minPrice),
    maxPrice: firstValue(resolved.maxPrice),
    sort: firstValue(resolved.sort),
    page: firstValue(resolved.page),
  }

  const [settings, categories, catalogue] = await Promise.all([
    getPublicSettings(),
    getVisibleCategories(),
    getCatalogue(params),
  ])

  const currencySymbol = settings?.currencySymbol ?? '₦'
  const whatsappNumber =
    settings?.whatsappNumber ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    '+2348000000000'
  const conciergeHref = `https://wa.me/${whatsappNumber.replace(
    /[^\d]/g,
    ''
  )}?text=${encodeURIComponent(
    'Hello Awwalshop, I would like help finding a piece in your catalogue.'
  )}`
  const topCategory = categories.find(
    (category) =>
      category.slug === params.category ||
      category.children.some((child) => child.slug === params.category)
  )
  const activeChild = topCategory?.children.find(
    (child) => child.slug === params.category
  )
  const heading = params.q
    ? `Results for “${params.q}”`
    : activeChild?.name || topCategory?.name || 'The Catalogue'

  const isFilteredView = Boolean(params.q || params.category)

  const hasFilters = Boolean(
    params.q ||
      params.category ||
      params.availability ||
      params.minPrice ||
      params.maxPrice
  )

  return (
    <>
      {/* Compact catalogue masthead */}
      <section className="relative overflow-hidden border-b border-line bg-[linear-gradient(180deg,#faf8f5_0%,#fff_100%)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(197,164,109,0.16),transparent_55%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-white/50 blur-3xl"
        />
        <div className="container-brand relative py-5 sm:py-8 lg:py-10">
          <nav
            aria-label="Breadcrumb"
            className={`items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-taupe ${
              isFilteredView ? 'flex' : 'hidden sm:flex'
            }`}
          >
            {isFilteredView ? (
              <>
                <Link
                  href="/shop"
                  className="transition-colors hover:text-espresso"
                >
                  Catalogue
                </Link>
                <ChevronRight size={11} className="text-line-strong" />
                <span className="truncate text-espresso">{heading}</span>
              </>
            ) : (
              <span className="text-espresso">Catalogue</span>
            )}
          </nav>

          <div className="mt-3 max-w-3xl sm:mt-6">
            <p className="eyebrow hidden sm:inline-flex">
              <span className="h-px w-6 bg-gold" />
              Modern African Luxury
            </p>
            <h1 className="font-heading text-[2.25rem] leading-[1.02] text-espresso sm:mt-4 sm:text-5xl lg:text-6xl">
              {heading === 'The Catalogue' ? 'Elegance in Every Detail' : heading}
            </h1>
            {!isFilteredView && (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-taupe sm:text-lg">
                Discover curated jewellery, fine timepieces and bespoke traditional attire — crafted with precision, heritage and quiet sophistication. Browse the collection and order directly via WhatsApp.
              </p>
            )}
            {!isFilteredView && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="#catalogue" className="btn btn-primary">
                  Explore the Collection
                </Link>
                <a
                  href={conciergeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn border border-line-strong text-espresso hover:border-gold hover:text-espresso"
                >
                  Talk to a Concierge
                </a>
              </div>
            )}
          </div>

          {categories.length > 0 && (
            <>
              {!isFilteredView && (
                <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
                  {categories.slice(0, 4).map((category, index) => (
                    <Link
                      key={category.slug}
                      href={`/shop?category=${category.slug}`}
                      className="group overflow-hidden rounded-xl border border-line bg-white text-left shadow-soft transition-all hover:-translate-y-1 hover:border-gold/70"
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
                            <span className="font-heading text-4xl text-white/75">
                              0{index + 1}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-espresso/45 to-transparent" />
                      </div>
                      <div className="p-3">
                        <h2 className="font-heading text-base leading-tight text-espresso sm:text-lg">
                          {category.name}
                        </h2>
                        <div className="mt-2 flex items-center justify-between border-t border-gold/30 pt-2">
                          <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-taupe">
                            {category.count} pieces
                          </span>
                          <ArrowRight size={12} className="text-[#7a623a]" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              <CategoryDropdown
                selectedCategory={params.category}
                categories={
                  topCategory?.children.length
                    ? [
                        {
                          name: `All ${topCategory.name}`,
                          slug: topCategory.slug,
                        },
                        ...topCategory.children,
                      ]
                    : categories
                }
              />
              <nav
                aria-label="Browse by category"
                className="no-scrollbar mt-4 hidden snap-x snap-proximity gap-2 overflow-x-auto overscroll-x-contain pb-2 sm:mt-6 sm:flex lg:hidden"
              >
              <Link
                href="/shop"
                aria-current={!params.category ? 'page' : undefined}
                className={`chip shrink-0 snap-start ${!params.category ? 'chip-active' : ''}`}
              >
                All
              </Link>
              {(topCategory?.children.length
                ? topCategory.children
                : categories
              ).map((category) => {
                const isActive = params.category === category.slug
                return (
                  <Link
                    key={category.slug}
                    href={`/shop?category=${category.slug}`}
                    aria-current={isActive ? 'page' : undefined}
                    className={`chip shrink-0 snap-start ${isActive ? 'chip-active' : ''}`}
                  >
                    {category.name}
                    <span
                      className={`text-[10px] tabular-nums ${
                        isActive ? 'text-ivory/60' : 'text-taupe'
                      }`}
                    >
                      {category.count}
                    </span>
                  </Link>
                )
              })}
              </nav>
            </>
          )}
        </div>
      </section>

      {/* Catalogue */}
      <section id="catalogue" className="container-brand py-5 sm:py-8 lg:py-10">
        <CatalogueLayout
          categories={categories}
          resultCount={catalogue.total}
          currencySymbol={currencySymbol}
        >
          <div>
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-line pb-3 lg:mb-5 lg:pb-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-taupe">
                Showing{' '}
                <span className="font-semibold text-espresso">
                  {catalogue.products.length}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-espresso">
                  {catalogue.total}
                </span>{' '}
                {catalogue.total === 1 ? 'piece' : 'pieces'}
              </p>
              <CatalogueSort className="hidden lg:flex" />
            </div>

            <ActiveFilters
              categories={categories}
              currencySymbol={currencySymbol}
            />

            {catalogue.products.length === 0 ? (
              <div className="surface flex flex-col items-center justify-center px-6 py-20 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f6efe2] text-[#a7823d]">
                  <SearchX size={28} strokeWidth={1.4} />
                </span>
                <h2 className="mt-5 font-heading text-3xl text-espresso">
                  No pieces found
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-taupe">
                  Try a different search, remove a filter, or browse the full
                  catalogue.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  {hasFilters && (
                    <Link href="/shop" className="btn btn-primary">
                      Clear all filters
                    </Link>
                  )}
                  <a
                    href={conciergeHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    Ask the concierge
                  </a>
                </div>
              </div>
            ) : (
              <>
                <ProductListTracker
                  listName={heading}
                  currency={catalogue.products[0]?.currency ?? 'NGN'}
                  items={catalogue.products.map((product, index) => ({
                    item_id: product.sku || product.id,
                    item_name: product.name,
                    item_category: product.category?.name,
                    price: Number(product.discountPrice ?? product.regularPrice),
                    currency: product.currency,
                    index: index + 1,
                  }))}
                />
                <div className="grid grid-cols-1 gap-y-7 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-11 md:grid-cols-3">
                  {catalogue.products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      currencySymbol={currencySymbol}
                      whatsappNumber={whatsappNumber}
                      whatsappMessage={settings?.whatsappMessage ?? undefined}
                      priority={index < 3}
                    />
                  ))}
                </div>

                <Pagination
                  basePath="/shop"
                  page={catalogue.page}
                  pageCount={catalogue.pageCount}
                  searchParams={resolved}
                />
              </>
            )}
          </div>
        </CatalogueLayout>
      </section>
    </>
  )
}
