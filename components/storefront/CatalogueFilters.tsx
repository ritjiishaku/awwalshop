'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Check, ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import type { CategoryNavItem } from '@/lib/storefront-types'
import { useOverlay } from '@/lib/use-overlay'

interface CatalogueFiltersProps {
  categories: CategoryNavItem[]
  resultCount: number
  currencySymbol: string
  mode: 'desktop' | 'mobile'
}

const sortOptions = [
  { value: 'newest', label: 'Newest arrivals' },
  { value: 'featured', label: 'Featured first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

const availabilityOptions = [
  { value: '', label: 'All availability' },
  { value: 'AVAILABLE', label: 'In stock' },
  { value: 'MADE_TO_ORDER', label: 'Made to order' },
  { value: 'COMING_SOON', label: 'Coming soon' },
]

export default function CatalogueFilters({
  categories,
  resultCount,
  currencySymbol,
  mode,
}: CatalogueFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [mobileOpen, setMobileOpen] = useState(false)
  const drawerRef = useOverlay(mobileOpen, () => setMobileOpen(false))

  // Close the drawer if the viewport becomes desktop-sized.
  useEffect(() => {
    if (!mobileOpen) return

    const query = window.matchMedia('(min-width: 1024px)')
    const handleChange = () => {
      if (query.matches) setMobileOpen(false)
    }

    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [mobileOpen])

  const current = useMemo(
    () => ({
      q: searchParams.get('q') ?? '',
      category: searchParams.get('category') ?? '',
      availability: searchParams.get('availability') ?? '',
      minPrice: searchParams.get('minPrice') ?? '',
      maxPrice: searchParams.get('maxPrice') ?? '',
      sort: searchParams.get('sort') ?? 'newest',
    }),
    [searchParams]
  )

  const activeParentSlug = useMemo(() => {
    if (!current.category) return null
    return (
      categories.find(
        (category) =>
          category.slug === current.category ||
          category.children.some((child) => child.slug === current.category)
      )?.slug ?? null
    )
  }, [categories, current.category])

  // null = follow the active branch; '' = explicitly collapsed.
  const [openSlug, setOpenSlug] = useState<string | null>(activeParentSlug)

  const activeFilterCount = [
    current.q,
    current.category,
    current.availability,
    current.minPrice,
    current.maxPrice,
  ].filter(Boolean).length

  function navigate(patch: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(patch)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    params.delete('page')
    if ('category' in patch) setOpenSlug(null)
    startTransition(() => {
      router.push(
        params.toString() ? `${pathname}?${params.toString()}` : pathname,
        { scroll: false }
      )
    })
  }

  const filterBody = (
    <div
      className={`flex flex-col transition-opacity ${isPending ? 'opacity-60' : 'opacity-100'}`}
    >
      {/* Categories */}
      <div className="border-b border-line px-5 py-5">
        <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.18em] text-taupe">
          Category
        </span>
        <div className="flex flex-col gap-0.5">
          <CategoryRow
            label="All pieces"
            active={!current.category}
            onClick={() => navigate({ category: undefined })}
          />

          {categories.map((category) => {
            const isParentActive =
              current.category === category.slug ||
              category.children.some(
                (child) => child.slug === current.category
              )
            const isOpen =
              openSlug === category.slug ||
              (activeParentSlug === category.slug && openSlug === null)

            return (
              <div key={category.slug} className="flex flex-col">
                <div className="flex items-center gap-1">
                  <CategoryRow
                    label={category.name}
                    count={category.count}
                    active={isParentActive}
                    onClick={() =>
                      navigate({
                        category:
                          current.category === category.slug
                            ? undefined
                            : category.slug,
                      })
                    }
                  />
                  {category.children.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSlug(isOpen ? '' : category.slug)
                      }
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? 'Hide' : 'Show'} ${category.name} subcategories`}
                      className="flex size-11 shrink-0 items-center justify-center rounded-lg text-taupe transition-colors hover:bg-[#faf7f1] hover:text-espresso"
                    >
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                </div>

                {isOpen && category.children.length > 0 && (
                  <div className="mb-1 ml-[1.1rem] flex flex-col gap-0.5 border-l border-line pl-3">
                    {category.children.map((child) => (
                      <CategoryRow
                        key={child.slug}
                        label={child.name}
                        count={child.count}
                        small
                        active={current.category === child.slug}
                        onClick={() =>
                          navigate({
                            category:
                              current.category === child.slug
                                ? undefined
                                : child.slug,
                          })
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="border-b border-line px-5 py-5">
        <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.18em] text-taupe">
          Availability
        </span>
        <div className="flex flex-wrap gap-2">
          {availabilityOptions.map((option) => {
            const active = current.availability === option.value
            return (
              <button
                key={option.value || 'all'}
                type="button"
                onClick={() => navigate({ availability: option.value || undefined })}
                aria-pressed={active}
                className={`inline-flex min-h-11 items-center justify-center rounded-full border px-3 py-2 text-[11px] font-medium transition-all ${
                  active
                    ? 'border-espresso bg-espresso text-ivory'
                    : 'border-line-strong bg-white text-[#6f665f] hover:border-gold hover:text-espresso'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Price */}
      <PriceFilter
        key={`${current.minPrice}-${current.maxPrice}`}
        currencySymbol={currencySymbol}
        minPrice={current.minPrice}
        maxPrice={current.maxPrice}
        onApply={(min, max) =>
          navigate({ minPrice: min || undefined, maxPrice: max || undefined })
        }
      />
    </div>
  )

  return (
    <>
      {/* Mobile toolbar */}
      {mode === 'mobile' && (
        <div className="mb-4 flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls={mobileOpen ? 'catalogue-filters' : undefined}
            className="btn btn-secondary btn-sm flex-1 gap-2"
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-espresso px-1 text-[10px] text-ivory">
                {activeFilterCount}
              </span>
            )}
          </button>
          <label className="relative flex-1">
            <span className="sr-only">Sort products</span>
            <select
              aria-label="Sort products"
              value={current.sort}
              onChange={(event) => navigate({ sort: event.target.value })}
              className="input h-full pr-9"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* Desktop sidebar */}
      {mode === 'desktop' && (
        <aside className="hidden lg:block" aria-label="Catalogue filters">
          <div className="sticky top-24">
            <div className="surface overflow-hidden">
              <div className="flex items-center justify-between gap-2 border-b border-line px-5 py-4">
                <p className="font-heading text-xl leading-none text-espresso">
                  Refine
                </p>
                <span className="rounded-full border border-line bg-[#fbf9f5] p-2 text-[#a7823d]">
                  <SlidersHorizontal size={15} />
                </span>
              </div>
              {filterBody}
            </div>
          </div>
        </aside>
      )}

      {/* Mobile drawer */}
      {mode === 'mobile' && mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-espresso/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="catalogue-filters"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Catalogue filters"
            className="animate-slide-in absolute inset-y-0 left-0 flex w-[90%] max-w-sm flex-col bg-ivory pt-[env(safe-area-inset-top)] shadow-elevated"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <span className="font-heading text-2xl text-espresso">Refine</span>
                <p className="text-[10px] uppercase tracking-[0.14em] text-taupe">
                  {resultCount} {resultCount === 1 ? 'piece' : 'pieces'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close filters"
                className="inline-flex size-11 items-center justify-center rounded-full text-espresso transition-colors hover:bg-sand/60"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain">{filterBody}</div>
            <div className="border-t border-line bg-ivory p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="btn btn-primary w-full"
              >
                View {resultCount} {resultCount === 1 ? 'piece' : 'pieces'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function PriceFilter({
  currencySymbol,
  minPrice,
  maxPrice,
  onApply,
}: {
  currencySymbol: string
  minPrice: string
  maxPrice: string
  onApply: (minPrice: string, maxPrice: string) => void
}) {
  const [draft, setDraft] = useState({ minPrice, maxPrice })
  const presets = [
    { label: `Under ${currencySymbol}50k`, min: '', max: '50000' },
    { label: `${currencySymbol}50k–150k`, min: '50000', max: '150000' },
    { label: `${currencySymbol}150k+`, min: '150000', max: '' },
  ]

  return (
    <div className="px-5 py-5">
      <span className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.18em] text-taupe">
        Price range{' '}
        <span className="font-normal tracking-normal text-taupe/80">
          ({currencySymbol})
        </span>
      </span>

      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => {
          const active = minPrice === preset.min && maxPrice === preset.max
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                setDraft({ minPrice: preset.min, maxPrice: preset.max })
                onApply(preset.min, preset.max)
              }}
              aria-pressed={active}
              className={`inline-flex min-h-11 items-center justify-center rounded-full border px-3 py-2 text-[10px] font-medium transition-all ${
                active
                  ? 'border-espresso bg-espresso text-ivory'
                  : 'border-line-strong bg-white text-[#6f665f] hover:border-gold hover:text-espresso'
              }`}
            >
              {preset.label}
            </button>
          )
        })}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          onApply(draft.minPrice.trim(), draft.maxPrice.trim())
        }}
        className="mt-3"
      >
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Min"
            aria-label="Minimum price"
            value={draft.minPrice}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                minPrice: event.target.value,
              }))
            }
            className="input"
          />
          <span className="text-line-strong">—</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Max"
            aria-label="Maximum price"
            value={draft.maxPrice}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                maxPrice: event.target.value,
              }))
            }
            className="input"
          />
        </div>
        <button type="submit" className="btn btn-dark btn-sm mt-3 w-full">
          Apply range
        </button>
      </form>
    </div>
  )
}

function CategoryRow({
  label,
  count,
  active,
  small = false,
  onClick,
}: {
  label: string
  count?: number
  active: boolean
  small?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex min-h-11 flex-1 items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors ${
        active ? 'bg-[#f4ede1]' : 'hover:bg-[#faf7f1]'
      } ${count === 0 ? 'opacity-55' : ''}`}
    >
      <span
        className={`${small ? 'text-[12.5px]' : 'text-[13px]'} ${
          active
            ? 'font-semibold text-espresso'
            : 'text-[#6f665f] group-hover:text-espresso'
        }`}
      >
        {label}
      </span>
      {typeof count === 'number' && (
        <span className="ml-auto text-[10px] tabular-nums text-taupe">
          {count}
        </span>
      )}
      {active && small && count !== undefined && (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-espresso text-ivory">
          <Check size={10} strokeWidth={3} />
        </span>
      )}
    </button>
  )
}

export function CatalogueSort({ className = '' }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') ?? 'newest'

  return (
    <label
      className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-taupe ${className}`}
    >
      Sort
      <select
        aria-label="Sort products"
        value={currentSort}
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString())
          if (event.target.value === 'newest') params.delete('sort')
          else params.set('sort', event.target.value)
          params.delete('page')
          router.push(
            params.toString() ? `${pathname}?${params.toString()}` : pathname,
            { scroll: false }
          )
        }}
        className="input h-9 w-[11.5rem] py-1 text-[11px]"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
