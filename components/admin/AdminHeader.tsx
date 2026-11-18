'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  Sparkles,
  Store,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface AdminNavItem {
  label: string
  href: string
  icon: LucideIcon
}

const adminNavItems: AdminNavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Layers },
  { label: 'Collections', href: '/admin/collections', icon: Sparkles },
  { label: 'Media', href: '/admin/media', icon: ImageIcon },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

function isAdminNavActive(pathname: string, href: string) {
  return href === '/admin'
    ? pathname === '/admin'
    : pathname === href || pathname.startsWith(`${href}/`)
}

interface AdminHeaderProps {
  onToggleNav?: () => void
  user?: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

export default function AdminHeader({ onToggleNav, user }: AdminHeaderProps) {
  const pathname = usePathname()
  const current =
    adminNavItems.find((item) => isAdminNavActive(pathname, item.href))?.label ??
    'Dashboard'

  return (
    <header className="aw-admin-topbar">
      <div className="aw-admin-topbar-inner">
        <div className="aw-admin-brand">
          <button
            type="button"
            onClick={onToggleNav}
            className="aw-admin-menu-button"
            aria-label="Open admin navigation"
          >
            <Menu size={20} />
          </button>
          <Link href="/admin" className="aw-admin-wordmark">
            AWWALSHOP
            <span>Admin</span>
          </Link>
          <span className="aw-admin-section-label">{current}</span>
        </div>

        <div className="aw-admin-topbar-actions">
          <form action="/admin/products" method="get" className="aw-admin-search">
            <Search size={15} aria-hidden="true" />
            <input
              type="search"
              name="q"
              placeholder="Search products…"
              aria-label="Search products"
            />
          </form>

          <Link
            href="/shop"
            target="_blank"
            rel="noopener noreferrer"
            className="aw-admin-storefront-link"
          >
            <Store size={14} />
            <span>Storefront</span>
          </Link>

          <span
            className="aw-admin-avatar"
            title={user?.name || 'Administrator'}
          >
            {(user?.name || 'AD').slice(0, 2)}
          </span>

          <button
            type="button"
            onClick={() => signOut({ redirectTo: '/admin/login' })}
            className="aw-admin-signout"
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      <nav className="aw-admin-tabs" aria-label="Admin sections">
        {adminNavItems.map((item) => {
          const Icon = item.icon
          const isActive = isAdminNavActive(pathname, item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className="aw-admin-tab"
            >
              <Icon size={14} strokeWidth={1.9} />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
