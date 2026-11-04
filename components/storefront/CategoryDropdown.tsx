'use client'

import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

interface CategoryOption {
  name: string
  slug: string
}

interface CategoryDropdownProps {
  categories: CategoryOption[]
  selectedCategory?: string
}

export default function CategoryDropdown({
  categories,
  selectedCategory,
}: CategoryDropdownProps) {
  const router = useRouter()

  return (
    <div className="mt-4 sm:hidden">
      <label
        htmlFor="mobile-category"
        className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-taupe"
      >
        Browse categories
      </label>
      <div className="relative">
        <select
          id="mobile-category"
          value={selectedCategory ?? ''}
          onChange={(event) => {
            const category = event.currentTarget.value
            router.push(
              category ? `/shop?category=${encodeURIComponent(category)}` : '/shop',
              { scroll: false }
            )
          }}
          className="input min-h-12 appearance-none pr-11 font-medium text-espresso"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-taupe"
        />
      </div>
    </div>
  )
}
