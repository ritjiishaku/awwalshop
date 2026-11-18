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

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
  user?: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

export default function AdminSidebar({
  isOpen = false,
  onClose,
  user,
}: AdminSidebarProps) {
  const pathname = usePathname()

  if (!isOpen) return null

  return (
    <div className="aw-admin-drawer-root" role="dialog" aria-modal="true" aria-label="Admin navigation">
      <div className="aw-admin-drawer-overlay" onClick={onClose} />
      <aside className="aw-admin-drawer">
        <div className="aw-admin-drawer-head">
          <Link href="/admin" onClick={onClose} className="aw-admin-wordmark">
            AWWALSHOP
            <span>Admin</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="aw-admin-drawer-close"
            aria-label="Close admin navigation"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="aw-admin-drawer-nav" aria-label="Admin sections">
          {adminNavItems.map((item) => {
            const Icon = item.icon
            const isActive = isAdminNavActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className="aw-admin-drawer-link"
              >
                <Icon size={17} strokeWidth={1.8} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="aw-admin-drawer-foot">
          <div className="aw-admin-drawer-user">
            <span className="aw-admin-avatar">
              {(user?.name || 'AD').slice(0, 2)}
            </span>
            <span>
              <strong>{user?.name || 'Administrator'}</strong>
              <small>{user?.role || 'Admin'}</small>
            </span>
          </div>
          <Link
            href="/shop"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="aw-admin-drawer-link"
          >
            <ExternalLink size={16} />
            View storefront
          </Link>
          <button
            type="button"
            onClick={() => signOut({ redirectTo: '/admin/login' })}
            className="aw-admin-drawer-link aw-admin-drawer-signout"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
    </div>
  )
}
