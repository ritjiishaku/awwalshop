'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import CatalogueFilters from '@/components/storefront/CatalogueFilters'
import type { CategoryNavItem } from '@/lib/storefront-types'

interface CatalogueLayoutProps {
  categories: CategoryNavItem[]
  resultCount: number
  currencySymbol: string
  children: React.ReactNode
}

export default function CatalogueLayout({
  categories,
  resultCount,
  currencySymbol,
  children,
}: CatalogueLayoutProps) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="hidden items-center justify-between lg:flex">
        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-taupe transition-colors hover:text-espresso"
          aria-expanded={showFilters}
        >
          {showFilters ? (
            <>
              <X size={14} />
              Hide filters
            </>
          ) : (
            <>
              <SlidersHorizontal size={14} />
              Show filters
            </>
          )}
        </button>
        <div className="text-[11px] uppercase tracking-[0.14em] text-taupe">
          {resultCount} {resultCount === 1 ? 'piece' : 'pieces'}
        </div>
      </div>
      <div
        className={`grid grid-cols-1 gap-6 lg:gap-10 ${
          showFilters ? 'lg:grid-cols-[16.5rem_minmax(0,1fr)]' : 'lg:grid-cols-1'
        }`}
      >
        {showFilters && (
          <CatalogueFilters
            categories={categories}
            resultCount={resultCount}
            currencySymbol={currencySymbol}
            mode="desktop"
          />
        )}
        <div>
          <CatalogueFilters
            categories={categories}
            resultCount={resultCount}
            currencySymbol={currencySymbol}
            mode="mobile"
          />
          {children}
        </div>
      </div>
    </div>
  )
}
