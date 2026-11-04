'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, Store } from 'lucide-react'

interface AdminHeaderProps {
  onToggleSidebar?: () => void
  user?: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

const sectionLabels: { prefix: string; label: string }[] = [
  { prefix: '/admin/products', label: 'Products' },
  { prefix: '/admin/categories', label: 'Categories' },
  { prefix: '/admin/collections', label: 'Collections' },
  { prefix: '/admin/media', label: 'Media library' },
  { prefix: '/admin/settings', label: 'Business settings' },
]

export default function AdminHeader({ onToggleSidebar, user }: AdminHeaderProps) {
  const pathname = usePathname()
  const current =
    sectionLabels.find((section) => pathname.startsWith(section.prefix))?.label ??
    'Dashboard'

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-[#f6f2eb]/85 backdrop-blur-xl">
      <div className="flex h-[4.5rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="-ml-2 rounded-full p-2 text-espresso transition-colors hover:bg-white lg:hidden"
            aria-label="Open navigation sidebar"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#a7823d]">
              Awwalshop admin
            </p>
            <p className="truncate font-heading text-xl leading-tight text-espresso">
              {current}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <form
            action="/admin/products"
            method="get"
            className="relative hidden md:block"
          >
            <Search
              size={15}
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-taupe"
            />
            <input
              type="search"
              name="q"
              placeholder="Search products…"
              aria-label="Search products"
              className="input h-10 w-52 rounded-full border-line bg-white/80 pl-9 text-[12px] lg:w-64"
            />
          </form>

          <Link
            href="/shop"
            target="_blank"
            className="hidden items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-2 text-[11px] font-semibold text-[#6f665f] transition-all hover:border-gold hover:text-espresso sm:inline-flex"
          >
            <Store size={14} className="text-[#a7823d]" />
            Storefront
          </Link>

          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-espresso text-[11px] font-semibold uppercase text-gold"
            title={user?.name || 'Administrator'}
          >
            {(user?.name || 'AD').slice(0, 2)}
          </span>
        </div>
      </div>
    </header>
  )
}
