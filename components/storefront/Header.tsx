'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/brand/Logo'
import { ArrowRight, ChevronDown, Menu, MessageCircle, Search, X } from 'lucide-react'
import type { CategoryNavItem } from '@/lib/storefront-types'
import { useOverlay } from '@/lib/use-overlay'

interface HeaderProps {
  whatsappNumber?: string
  categories?: CategoryNavItem[]
}

export default function Header({
  whatsappNumber = '+2348000000000',
  categories = [],
}: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const pathname = usePathname()
  const shopMenuRef = useRef<HTMLDivElement>(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const menuRef = useOverlay(menuOpen, closeMenu)

  const cleanWhatsAppNumber = whatsappNumber.replace(/[^\d]/g, '')
  const whatsappHref = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
    'Hello Awwalshop, I would like to inquire about your catalogue.'
  )}`
  const isShopActive =
    pathname.startsWith('/shop') || pathname.startsWith('/products')

  // Close the mobile menu when the viewport becomes desktop-sized.
  useEffect(() => {
    if (!menuOpen) return

    const query = window.matchMedia('(min-width: 768px)')
    const handleChange = () => {
      if (query.matches) setMenuOpen(false)
    }

    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [menuOpen])

  // Dismiss the desktop category menu on outside click or Escape.
  useEffect(() => {
    if (!shopOpen) return

    function handlePointerDown(event: PointerEvent) {
      if (!shopMenuRef.current?.contains(event.target as Node)) {
        setShopOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setShopOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [shopOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-[#eae1d4] bg-ivory/85 backdrop-blur-xl">
      <div className="container-brand flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSearchOpen(false)
              setMenuOpen(true)
            }}
            className="-ml-2 inline-flex size-11 items-center justify-center rounded-full text-espresso transition-colors hover:bg-sand/60 md:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? 'mobile-menu' : undefined}
          >
            <Menu size={20} />
          </button>
          <div className="sm:hidden">
            <Logo
              href="/shop"
              variant="dark"
              compact
              showTagline={false}
            />
          </div>
          <div className="hidden sm:block">
            <Logo href="/shop" variant="dark" showTagline={false} />
          </div>
        </div>

        <nav aria-label="Primary" className="hidden items-center md:flex">
          <div ref={shopMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setShopOpen((open) => !open)}
              aria-expanded={shopOpen}
              aria-controls="shop-menu"
              className={`relative inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                isShopActive ? 'text-espresso' : 'text-[#777068] hover:text-espresso'
              }`}
            >
              Shop
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  shopOpen ? 'rotate-180' : ''
                }`}
              />
              {isShopActive && (
                <span className="absolute inset-x-4 -bottom-[3px] h-[2px] rounded-full bg-gold" />
              )}
            </button>

            {shopOpen && (
              <div
                id="shop-menu"
                style={{
                  width: 'min(42rem, calc(100vw - 2rem))',
                  maxHeight: 'min(70vh, 38rem)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
                className="absolute top-full z-50 mt-3 overflow-y-auto rounded-2xl border border-[#e6dccd] bg-ivory p-4 shadow-elevated sm:p-5"
              >
                <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                  <p className="eyebrow">
                    <span className="h-px w-5 bg-gold" />
                    Browse by category
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setShopOpen(false)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#e6dccd] bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-espresso transition-colors hover:border-gold hover:bg-[#fbf8f2]"
                  >
                    All pieces
                    <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                </div>

                {categories.length > 0 ? (
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {categories.map((category) => (
                      <section
                        key={category.slug}
                        className="rounded-xl border border-[#eee5d9] bg-white/75 p-3.5 transition-colors hover:border-[#d8c6a8]"
                      >
                        <Link
                          href={`/shop?category=${category.slug}`}
                          onClick={() => setShopOpen(false)}
                          className="group flex items-center justify-between gap-3"
                        >
                          <span className="font-heading text-lg leading-tight text-espresso transition-colors group-hover:text-[#a7823d]">
                            {category.name}
                          </span>
                          <span className="shrink-0 rounded-full bg-[#f5efe5] px-2.5 py-1 text-[10px] font-medium tabular-nums text-[#80683f]">
                            {category.count}
                          </span>
                        </Link>
                        {category.children.length > 0 && (
                          <ul className="mt-2.5 grid gap-1 border-t border-[#f0e9df] pt-2">
                            {category.children.map((child) => (
                              <li key={child.slug}>
                                <Link
                                  href={`/shop?category=${child.slug}`}
                                  onClick={() => setShopOpen(false)}
                                  className="group flex min-h-8 items-center justify-between gap-3 rounded-lg px-2 text-xs text-[#70675e] transition-colors hover:bg-[#faf7f1] hover:text-espresso"
                                >
                                  <span>{child.name}</span>
                                  <span className="min-w-6 rounded-full bg-[#f7f4ef] px-1.5 py-0.5 text-center text-[10px] tabular-nums text-taupe transition-colors group-hover:bg-white">
                                    {child.count}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </section>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-[#777068]">
                    Categories will appear here once they’re added.
                  </p>
                )}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            className="inline-flex size-11 items-center justify-center rounded-full text-espresso transition-colors hover:bg-sand/60"
            aria-label={searchOpen ? 'Close catalogue search' : 'Search catalogue'}
            aria-expanded={searchOpen}
          >
            {searchOpen ? <X size={19} /> : <Search size={19} />}
          </button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-espresso px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory transition-all hover:bg-[#372c26] hover:shadow-lift sm:px-5 sm:text-[11px]"
          >
            <MessageCircle size={15} className="text-gold" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>

      {searchOpen && (
        <div className="animate-fade-in border-t border-[#eae1d4] bg-white/95">
          <form
            action="/shop"
            method="get"
            className="container-brand flex max-w-3xl items-center gap-2 py-3"
          >
            <div className="relative flex-1">
              <Search
                size={16}
                aria-hidden
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-taupe"
              />
              <input
                type="search"
                name="q"
                placeholder="Search rings, kaftans, watches…"
                aria-label="Search products"
                autoFocus
                className="input min-h-11 pl-11"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>
        </div>
      )}

      {menuOpen &&
        createPortal(
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-espresso/40 backdrop-blur-sm"
            aria-hidden="true"
            onClick={closeMenu}
          />
          <div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="animate-slide-in absolute inset-y-0 left-0 flex w-[88vw] max-w-sm flex-col bg-ivory p-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-elevated"
          >
            <div className="mb-5 flex items-center justify-between">
              <Logo href="/shop" variant="dark" showTagline={false} />
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-espresso transition-colors hover:bg-sand/60"
              >
                <X size={20} />
              </button>
            </div>

            <nav
              aria-label="Mobile navigation"
              className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
            >
              <Link
                href="/shop"
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl px-3 py-3 font-heading text-2xl text-espresso transition-colors hover:bg-sand/50"
              >
                All pieces
                <span className="text-gold">→</span>
              </Link>

              {categories.map((category) => (
                <div key={category.slug} className="border-t border-line/80">
                  <Link
                    href={`/shop?category=${category.slug}`}
                    onClick={closeMenu}
                    className="flex items-center justify-between gap-2 px-3 py-3 font-heading text-xl text-espresso transition-colors hover:bg-sand/50"
                  >
                    <span className="flex items-center gap-2">
                      {category.name}
                      <span className="rounded-full bg-[#f4ede1] px-2 py-0.5 font-body text-[10px] font-semibold text-[#a7823d]">
                        {category.count}
                      </span>
                    </span>
                    <span className="text-gold">→</span>
                  </Link>
                  {category.children.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5 px-3">
                      {category.children.map((child) => (
                        <Link
                          key={child.slug}
                          href={`/shop?category=${child.slug}`}
                          onClick={closeMenu}
                          className="chip inline-flex min-h-10 items-center text-[10px]"
                        >
                          {child.name}
                          <span className="text-taupe">{child.count}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-4 shrink-0 border-t border-line pt-4">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full"
              >
                <MessageCircle size={16} />
                Order on WhatsApp
              </a>
              <p className="mt-3 text-center text-[10px] uppercase tracking-[0.16em] text-taupe">
                Elegance in every detail
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  )
}
