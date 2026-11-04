import Link from 'next/link'
import Image from 'next/image'
import {
  Activity,
  ArrowUpRight,
  Eye,
  Layers,
  Package,
  Plus,
  Settings,
  Sparkles,
  Star,
  Store,
} from 'lucide-react'
import PageHeader from '@/components/admin/PageHeader'
import StatCard from '@/components/admin/StatCard'
import { getDashboardData } from '@/lib/queries'
import { formatDate, formatPrice } from '@/lib/utils'

const activityStyles: Record<string, string> = {
  CREATE: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  UPDATE: 'border-sky-200 bg-sky-50 text-sky-700',
  DELETE: 'border-rose-200 bg-rose-50 text-rose-700',
  PUBLISH: 'border-[#e3d3b6] bg-[#faf3e4] text-[#8a6d36]',
  UNPUBLISH: 'border-line bg-[#faf7f1] text-taupe',
}

const quickActions = [
  { label: 'Manage products', href: '/admin/products', icon: Package },
  { label: 'Manage categories', href: '/admin/categories', icon: Layers },
  { label: 'Manage collections', href: '/admin/collections', icon: Sparkles },
  { label: 'View storefront', href: '/shop', icon: Store },
]

export default async function AdminDashboardPage() {
  const { stats, recentProducts, recentActivity } = await getDashboardData()
  const publishedRatio =
    stats.totalProducts > 0
      ? Math.round((stats.publishedProducts / stats.totalProducts) * 100)
      : 0

  return (
    <div>
      <PageHeader
        eyebrow="Overview"
        title="Your catalogue"
        description="Manage products, categories and curated collections, and see what is currently published to your storefront."
        actions={
          <>
            <Link
              href="/admin/settings"
              className="btn btn-secondary btn-sm hidden sm:inline-flex"
            >
              <Settings size={14} />
              Settings
            </Link>
            <Link href="/admin/products/new" className="btn btn-primary btn-sm">
              <Plus size={14} />
              New product
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <StatCard
          label="Products"
          value={stats.totalProducts}
          hint={`${stats.publishedProducts} published · ${stats.draftProducts} draft`}
          icon={<Package size={18} />}
          href="/admin/products"
        />
        <StatCard
          label="Live on store"
          value={stats.publishedProducts}
          hint="Visible to customers right now"
          icon={<Eye size={18} />}
          href="/admin/products?status=PUBLISHED"
        />
        <StatCard
          label="Categories"
          value={stats.totalCategories}
          hint={`${stats.visibleCategories} visible in the storefront`}
          icon={<Layers size={18} />}
          href="/admin/categories"
        />
        <StatCard
          label="Collections"
          value={stats.totalCollections}
          hint="Curated product groups"
          icon={<Sparkles size={18} />}
          href="/admin/collections"
        />
        <StatCard
          label="Featured"
          value={stats.featuredProducts}
          hint="Highlighted pieces on the catalogue"
          icon={<Star size={18} />}
          href="/admin/products"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <section className="surface overflow-hidden">
          <div className="surface-header">
            <div>
              <h2 className="font-heading text-xl text-espresso">Recently updated</h2>
              <p className="mt-0.5 text-[11px] text-taupe">
                The five most recent product changes.
              </p>
            </div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe transition-colors hover:text-[#a7823d]"
            >
              All products <ArrowUpRight size={12} />
            </Link>
          </div>

          {recentProducts.length === 0 ? (
            <div className="px-5 py-14 text-center text-sm text-taupe">
              No products yet.{' '}
              <Link
                href="/admin/products/new"
                className="font-medium text-[#a7823d] underline underline-offset-4"
              >
                Add your first piece
              </Link>
              .
            </div>
          ) : (
            <div className="divide-y divide-line">
              {recentProducts.map((product) => {
                const image = product.media[0]?.url
                return (
                  <Link
                    key={product.id}
                    href={`/admin/products/${product.id}`}
                    className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[#fbf9f5]"
                  >
                    <div className="h-14 w-12 shrink-0 overflow-hidden rounded-xl border border-line bg-[#f8f5ef]">
                      {image ? (
                        <Image
                          src={image}
                          alt={product.media[0]?.altText || product.name}
                          width={48}
                          height={56}
                          unoptimized
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#c5a46d]">
                          <Package size={16} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-espresso">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-taupe">
                        {product.category?.name || 'Uncategorised'} ·{' '}
                        {formatDate(product.updatedAt)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[13px] font-semibold text-espresso">
                        {formatPrice(product.regularPrice)}
                      </p>
                      <span
                        className={`status-pill mt-1 ${
                          product.status === 'PUBLISHED'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-line bg-[#faf7f1] text-taupe'
                        }`}
                      >
                        {product.status === 'PUBLISHED' ? 'Live' : 'Draft'}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        <div className="flex flex-col gap-5">
          <section className="relative overflow-hidden rounded-2xl bg-espresso p-5 text-ivory shadow-soft">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(197,164,109,0.28),transparent_70%)]"
            />
            <div className="relative">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gold">
                Catalogue health
              </p>
              <div className="mt-3 flex items-end justify-between gap-3">
                <p className="font-heading text-4xl leading-none">
                  {publishedRatio}%
                  <span className="ml-2 font-body text-[10px] uppercase tracking-[0.12em] text-ivory/50">
                    live
                  </span>
                </p>
                <p className="text-right text-[10px] leading-tight text-ivory/50">
                  {stats.draftProducts} draft
                  <br />
                  {stats.publishedProducts} published
                </p>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ivory/15">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#a7823d] to-[#e0c896] transition-all"
                  style={{ width: `${publishedRatio}%` }}
                />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      target={action.href === '/shop' ? '_blank' : undefined}
                      rel={action.href === '/shop' ? 'noopener noreferrer' : undefined}
                      className="group flex min-h-11 items-center gap-2 rounded-xl border border-ivory/12 bg-ivory/5 px-3 py-2.5 text-[11px] font-medium text-ivory/80 transition-all hover:border-gold/60 hover:text-gold"
                    >
                      <Icon size={14} className="text-gold" />
                      <span className="truncate">{action.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="surface overflow-hidden">
            <div className="surface-header">
              <div>
                <h2 className="font-heading text-xl text-espresso">Recent activity</h2>
                <p className="mt-0.5 text-[11px] text-taupe">Audit trail of admin changes.</p>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-[#faf7f1] text-[#a7823d]">
                <Activity size={14} />
              </span>
            </div>
            {recentActivity.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-taupe">
                No activity recorded yet.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="flex items-start gap-3 px-5 py-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-[#faf7f1] text-[#a7823d]">
                      <Activity size={11} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`status-pill ${
                            activityStyles[activity.action] ||
                            'border-line bg-[#faf7f1] text-taupe'
                          }`}
                        >
                          {activity.action}
                        </span>
                        <span className="text-[10px] text-taupe">
                          {formatDate(activity.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-[11.5px] leading-snug text-espresso">
                        {activity.description || `${activity.action} ${activity.entityType}`}
                      </p>
                      <p className="mt-0.5 text-[10px] text-taupe">{activity.admin.name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
