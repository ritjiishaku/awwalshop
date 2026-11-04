import Link from 'next/link'
import Image from 'next/image'
import { Filter, Package, Plus, Search, Star, X } from 'lucide-react'
import PageHeader from '@/components/admin/PageHeader'
import EmptyState from '@/components/admin/EmptyState'
import ProductRowActions from '@/components/admin/ProductRowActions'
import { getAdminCategories, getAdminProducts } from '@/lib/queries'
import { formatDate, formatPrice } from '@/lib/utils'

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string
    status?: string
    category?: string
    page?: string
  }>
}

const availabilityLabels: Record<string, string> = {
  AVAILABLE: 'Available',
  OUT_OF_STOCK: 'Out of stock',
  MADE_TO_ORDER: 'Made to order',
  COMING_SOON: 'Coming soon',
  DISCONTINUED: 'Discontinued',
}

const availabilityStyles: Record<string, string> = {
  AVAILABLE: 'text-emerald-700',
  MADE_TO_ORDER: 'text-[#a7823d]',
  COMING_SOON: 'text-sky-700',
  OUT_OF_STOCK: 'text-rose-600',
  DISCONTINUED: 'text-taupe',
}

const statusTabs = [
  { label: 'All', value: '' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Draft', value: 'DRAFT' },
]

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const page = Number(params.page || '1')

  const [{ products, total, pageCount }, categories] = await Promise.all([
    getAdminProducts({
      q: params.q,
      status: params.status,
      categoryId: params.category,
      page,
    }),
    getAdminCategories(),
  ])

  const topLevelCategories = categories.filter((category) => !category.parentId)

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const query = new URLSearchParams()
    const values = {
      q: params.q,
      status: params.status,
      category: params.category,
      page: String(page),
      ...overrides,
    }
    for (const [key, value] of Object.entries(values)) {
      if (value) query.set(key, value)
    }
    return `/admin/products?${query.toString()}`
  }

  const hasFilters = Boolean(params.q || params.status || params.category)

  return (
    <div>
      <PageHeader
        eyebrow="Inventory"
        title="Products"
        description="Manage every piece in the catalogue — pricing, media, variants, publishing and collections."
        actions={
          <Link href="/admin/products/new" className="btn btn-primary btn-sm">
            <Plus size={14} />
            New product
          </Link>
        }
      />

      <div className="surface mb-4 p-3">
        <form
          method="get"
          className="flex flex-col gap-2.5 lg:flex-row lg:items-center"
        >
          <div className="relative flex-1">
            <Search
              size={15}
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-taupe"
            />
            <label htmlFor="q" className="sr-only">
              Search products
            </label>
            <input
              id="q"
              name="q"
              defaultValue={params.q}
              placeholder="Search by name, SKU or description…"
              className="input h-10 pl-9"
            />
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <label htmlFor="status" className="sr-only">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={params.status || ''}
              className="input h-10 w-full sm:w-40"
            >
              <option value="">All statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>

            <label htmlFor="category" className="sr-only">
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={params.category || ''}
              className="input h-10 w-full sm:w-48"
            >
              <option value="">All categories</option>
              {topLevelCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <button type="submit" className="btn btn-dark btn-sm h-10">
              <Filter size={13} />
              Apply
            </button>
            {hasFilters && (
              <Link
                href="/admin/products"
                className="btn btn-ghost btn-sm h-10"
                aria-label="Clear filters"
              >
                <X size={14} />
                Clear
              </Link>
            )}
          </div>
        </form>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-1 rounded-full border border-line bg-white/70 p-1">
          {statusTabs.map((tab) => {
            const isActive = (params.status || '') === tab.value
            return (
              <Link
                key={tab.value || 'all'}
                href={buildHref({ status: tab.value || undefined, page: '1' })}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${
                  isActive
                    ? 'bg-espresso text-ivory shadow-soft'
                    : 'text-[#6f665f] hover:text-espresso'
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
        <p className="text-[11px] text-taupe">
          <span className="font-semibold text-espresso">{total}</span>{' '}
          {total === 1 ? 'product' : 'products'}
          {hasFilters ? ' matching filters' : ''} · Page{' '}
          {Math.min(page, pageCount)} of {pageCount}
        </p>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={<Package size={22} />}
          title={hasFilters ? 'No products match these filters' : 'No products yet'}
          description={
            hasFilters
              ? 'Try a different search term or clear the filters to see the full catalogue.'
              : 'Add your first piece to start building the storefront catalogue.'
          }
          action={
            hasFilters ? (
              <Link href="/admin/products" className="btn btn-secondary btn-sm">
                Clear filters
              </Link>
            ) : (
              <Link href="/admin/products/new" className="btn btn-primary btn-sm">
                <Plus size={14} />
                Add product
              </Link>
            )
          }
        />
      ) : (
        <div className="surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left">
              <thead>
                <tr className="border-b border-line bg-[#faf7f1] text-[9.5px] uppercase tracking-[0.14em] text-taupe">
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Availability</th>
                  <th className="px-4 py-3 font-semibold">Updated</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {products.map((product) => {
                  const image = product.media[0]?.url
                  return (
                    <tr
                      key={product.id}
                      className="group align-middle transition-colors hover:bg-[#fbf9f5]"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-11 shrink-0 overflow-hidden rounded-lg border border-line bg-[#f8f5ef]">
                            {image ? (
                              <Image
                                src={image}
                                alt={product.media[0]?.altText || product.name}
                                width={44}
                                height={56}
                                unoptimized
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#c5a46d]">
                                <Package size={15} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="line-clamp-1 text-[13px] font-semibold text-espresso transition-colors hover:text-[#a7823d]"
                            >
                              {product.name}
                            </Link>
                            <div className="mt-1 flex items-center gap-2">
                              {product.sku && (
                                <span className="font-mono text-[10px] text-taupe">
                                  {product.sku}
                                </span>
                              )}
                              {product.isFeatured && (
                                <Star
                                  size={10}
                                  className="text-[#c5a46d]"
                                  fill="currentColor"
                                />
                              )}
                              {product.isNewArrival && (
                                <span className="rounded-full bg-[#faf3e4] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-[#8a6d36]">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#8b8178]">
                        {product.category?.name || '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[13px] font-medium text-espresso">
                        {formatPrice(product.discountPrice ?? product.regularPrice)}
                        {product.discountPrice && (
                          <span className="block text-[10px] font-normal text-taupe line-through">
                            {formatPrice(product.regularPrice)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`status-pill ${
                            product.status === 'PUBLISHED'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border-line bg-[#faf7f1] text-taupe'
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {product.status === 'PUBLISHED' ? 'Live' : 'Draft'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`status-pill border-none bg-transparent px-0 ${
                            availabilityStyles[product.availability] || 'text-taupe'
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {availabilityLabels[product.availability] || product.availability}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-[#8b8178]">
                        {formatDate(product.updatedAt)}
                      </td>
                      <td className="px-5 py-3">
                        <ProductRowActions
                          product={{
                            id: product.id,
                            name: product.name,
                            status: product.status,
                            isFeatured: product.isFeatured,
                          }}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pageCount > 1 && (
        <div className="mt-5 flex items-center justify-between">
          <Link
            href={buildHref({ page: String(Math.max(1, page - 1)) })}
            aria-disabled={page <= 1}
            className={`btn btn-secondary btn-sm ${
              page <= 1 ? 'pointer-events-none opacity-40' : ''
            }`}
          >
            Previous
          </Link>
          <span className="text-[11px] text-taupe">
            {products.length} shown on this page
          </span>
          <Link
            href={buildHref({ page: String(Math.min(pageCount, page + 1)) })}
            aria-disabled={page >= pageCount}
            className={`btn btn-secondary btn-sm ${
              page >= pageCount ? 'pointer-events-none opacity-40' : ''
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  )
}
