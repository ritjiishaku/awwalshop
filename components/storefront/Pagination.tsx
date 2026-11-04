import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  basePath: string
  page: number
  pageCount: number
  searchParams: Record<string, string | string[] | undefined>
}

function buildHref(
  basePath: string,
  searchParams: PaginationProps['searchParams'],
  page: number
) {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === 'page' || value === undefined) continue
    if (Array.isArray(value)) value.forEach((item) => params.append(key, item))
    else params.set(key, value)
  }
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

export default function Pagination({
  basePath,
  page,
  pageCount,
  searchParams,
}: PaginationProps) {
  if (pageCount <= 1) return null

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (value) => value === 1 || value === pageCount || Math.abs(value - page) <= 1
  )

  const arrowClass =
    'flex size-11 items-center justify-center rounded-full border border-line-strong bg-white text-espresso transition-all hover:border-espresso hover:shadow-soft'
  const disabledClass =
    'flex size-11 items-center justify-center rounded-full border border-line text-taupe/40'

  return (
    <nav
      aria-label="Catalogue pagination"
      className="mt-14 flex flex-col items-center gap-4 border-t border-line pt-8 sm:flex-row sm:justify-between"
    >
      <p className="text-[11px] uppercase tracking-[0.14em] text-taupe">
        Page {page} of {pageCount}
      </p>

      <div className="flex items-center gap-1.5">
        {page > 1 ? (
          <Link
            href={buildHref(basePath, searchParams, page - 1)}
            aria-label="Previous page"
            className={arrowClass}
          >
            <ChevronLeft size={16} />
          </Link>
        ) : (
          <span aria-hidden className={disabledClass}>
            <ChevronLeft size={16} />
          </span>
        )}

        {pages.map((value, index) => {
          const previous = pages[index - 1]
          const showEllipsis = previous !== undefined && value - previous > 1
          return (
            <span key={value} className="flex items-center gap-1.5">
              {showEllipsis && <span className="px-1 text-taupe">…</span>}
              <Link
                href={buildHref(basePath, searchParams, value)}
                aria-current={value === page ? 'page' : undefined}
                className={`flex min-h-11 min-w-11 items-center justify-center rounded-full border px-3 text-[13px] font-medium transition-all ${
                  value === page
                    ? 'border-espresso bg-espresso text-ivory shadow-soft'
                    : 'border-line-strong bg-white text-[#6f665f] hover:border-espresso hover:text-espresso'
                }`}
              >
                {value}
              </Link>
            </span>
          )
        })}

        {page < pageCount ? (
          <Link
            href={buildHref(basePath, searchParams, page + 1)}
            aria-label="Next page"
            className={arrowClass}
          >
            <ChevronRight size={16} />
          </Link>
        ) : (
          <span aria-hidden className={disabledClass}>
            <ChevronRight size={16} />
          </span>
        )}
      </div>
    </nav>
  )
}
