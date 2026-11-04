'use client'

import { useMemo, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'

interface FilterOption {
  name: string
  slug: string
}

interface ActiveFiltersProps {
  categories: (FilterOption & { children: FilterOption[] })[]
  currencySymbol: string
}

const availabilityLabels: Record<string, string> = {
  AVAILABLE: 'In stock',
  MADE_TO_ORDER: 'Made to order',
  COMING_SOON: 'Coming soon',
}

export default function ActiveFilters({
  categories,
  currencySymbol,
}: ActiveFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const categoryName = useMemo(() => {
    const slug = searchParams.get('category')
    if (!slug) return null
    for (const category of categories) {
      if (category.slug === slug) return category.name
      const child = category.children.find((item) => item.slug === slug)
      if (child) return child.name
    }
    return slug
  }, [categories, searchParams])

  const q = searchParams.get('q')
  const availability = searchParams.get('availability')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')

  const priceLabel =
    minPrice && maxPrice
      ? `${currencySymbol}${minPrice} – ${currencySymbol}${maxPrice}`
      : minPrice
        ? `From ${currencySymbol}${minPrice}`
        : maxPrice
          ? `Up to ${currencySymbol}${maxPrice}`
          : null

  const chips = [
    q ? { key: 'q', label: `“${q}”` } : null,
    categoryName ? { key: 'category', label: categoryName } : null,
    availability
      ? { key: 'availability', label: availabilityLabels[availability] ?? availability }
      : null,
    priceLabel ? { key: 'price', label: priceLabel } : null,
  ].filter(Boolean) as { key: string; label: string }[]

  if (chips.length === 0) return null

  function remove(key: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (key === 'price') {
      params.delete('minPrice')
      params.delete('maxPrice')
    } else {
      params.delete(key)
    }
    params.delete('page')
    startTransition(() => {
      router.push(
        params.toString() ? `${pathname}?${params.toString()}` : pathname,
        { scroll: false }
      )
    })
  }

  function clearAll() {
    startTransition(() => router.push(pathname, { scroll: false }))
  }

  return (
    <div
      className={`mb-5 flex flex-wrap items-center gap-2 transition-opacity ${
        isPending ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-taupe">
        Active
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => remove(chip.key)}
          className="chip-remove"
          aria-label={`Remove ${chip.label} filter`}
        >
          {chip.label}
          <X size={11} strokeWidth={2.5} />
        </button>
      ))}
      <button
        type="button"
        onClick={clearAll}
        className="ml-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a7823d] underline-offset-4 transition-colors hover:text-espresso hover:underline"
      >
        Clear all
      </button>
    </div>
  )
}
