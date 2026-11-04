'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  ExternalLink,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Sparkles,
  X,
} from 'lucide-react'
import Logo from '@/components/brand/Logo'

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
  user?: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

const navGroups = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
  },
  {
    label: 'Catalogue',
    items: [
      { label: 'Products', href: '/admin/products', icon: Package },
      { label: 'Categories', href: '/admin/categories', icon: Layers },
      { label: 'Collections', href: '/admin/collections', icon: Sparkles },
    ],
  },
  {
    label: 'Storefront',
    items: [{ label: 'Media library', href: '/admin/media', icon: ImageIcon }],
  },
  {
    label: 'Configuration',
    items: [{ label: 'Business settings', href: '/admin/settings', icon: Settings }],
  },
]

export default function AdminSidebar({
  isOpen = false,
  onClose,
  user,
}: AdminSidebarProps) {
  const pathname = usePathname()

  const nav = (
    <nav aria-label="Admin navigation" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {navGroups.map((group) => (
        <div key={group.label}>
          <p className="admin-nav-group-label">{group.label}</p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? 'page' : undefined}
                  className="admin-nav-link"
                >
                  <Icon size={17} strokeWidth={1.8} className="shrink-0 text-[#a49a8f]" />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )

  const footer = (
    <div className="border-t border-line p-3">
      <div className="mb-2 flex items-center gap-3 rounded-xl bg-[#faf7f1] px-3 py-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-espresso text-[11px] font-semibold uppercase text-gold">
          {(user?.name || 'Admin').slice(0, 2)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-espresso">
            {user?.name || 'Administrator'}
          </p>
          <p className="truncate text-[10px] uppercase tracking-[0.1em] text-taupe">
            {user?.role || 'Admin'}
          </p>
        </div>
      </div>
      <Link
        href="/shop"
        target="_blank"
        onClick={onClose}
        className="admin-nav-link"
      >
        <ExternalLink size={16} strokeWidth={1.8} className="text-[#a49a8f]" />
        View storefront
      </Link>
      <button
        type="button"
        onClick={() => signOut({ redirectTo: '/admin/login' })}
        className="admin-nav-link w-full text-[#a05c50] hover:bg-[#fbf0ee] hover:text-[#8a4a3f]"
      >
        <LogOut size={16} strokeWidth={1.8} />
        Sign out
      </button>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[17rem] flex-col border-r border-line bg-white lg:flex">
        <div className="flex h-[4.5rem] items-center justify-between border-b border-line px-5">
          <Logo
            href="/admin"
            ariaLabel="AWWALSHOP catalogue admin"
            variant="dark"
            showTagline={false}
          />
          <span className="rounded-full border border-line bg-[#faf7f1] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#a7823d]">
            Admin
          </span>
        </div>
        {nav}
        {footer}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-espresso/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="animate-slide-in absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col bg-white shadow-elevated">
            <div className="flex h-[4.5rem] items-center justify-between border-b border-line px-5">
              <Logo href="/admin" variant="dark" showTagline={false} />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close admin menu"
                className="rounded-full p-2 text-[#6f665f] transition-colors hover:bg-[#f6f1e8]"
              >
                <X size={20} />
              </button>
            </div>
            {nav}
            {footer}
          </div>
        </div>
      )}
    </>
  )
}
