import Link from 'next/link'
import Image from 'next/image'
import { Plus, Sparkles } from 'lucide-react'
import PageHeader from '@/components/admin/PageHeader'
import EmptyState from '@/components/admin/EmptyState'
import CollectionRowActions from '@/components/admin/CollectionRowActions'
import { getAdminCollections } from '@/lib/queries'

export default async function AdminCollectionsPage() {
  const collections = await getAdminCollections()

  return (
    <div>
      <PageHeader
        eyebrow="Merchandising"
        title="Collections"
        description="Curated edits that group products across categories — new arrivals, signature pieces, seasonal stories."
        actions={
          <Link href="/admin/collections/new" className="btn btn-primary btn-sm">
            <Plus size={14} />
            New collection
          </Link>
        }
      />

      {collections.length === 0 ? (
        <EmptyState
          icon={<Sparkles size={22} />}
          title="No collections yet"
          description="Create a curated edit to group products for the storefront."
          action={
            <Link href="/admin/collections/new" className="btn btn-primary btn-sm">
              <Plus size={14} />
              Add collection
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => (
            <article
              key={collection.id}
              className="group surface flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="relative h-36 overflow-hidden border-b border-line bg-[#f8f5ef]">
                {collection.bannerUrl ? (
                  <Image
                    src={collection.bannerUrl}
                    alt={collection.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#c5a46d]">
                    <Sparkles size={26} />
                  </div>
                )}
                <span
                  className={`status-pill absolute left-3 top-3 backdrop-blur ${
                    collection.isVisible
                      ? 'border-emerald-200 bg-emerald-50/90 text-emerald-700'
                      : 'border-line bg-[#f8f5ef]/90 text-taupe'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {collection.isVisible ? 'Visible' : 'Hidden'}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/collections/${collection.id}`}
                      className="font-heading text-xl text-espresso transition-colors hover:text-[#a7823d]"
                    >
                      {collection.name}
                    </Link>
                    <p className="mt-0.5 truncate font-mono text-[10px] text-taupe">
                      /{collection.slug}
                    </p>
                  </div>
                  <span className="shrink-0 whitespace-nowrap rounded-full border border-line bg-[#faf7f1] px-2.5 py-1 text-[10px] font-semibold text-[#6f665f]">
                    {collection._count.products} pieces
                  </span>
                </div>

                <p className="mt-3 line-clamp-2 flex-1 text-xs leading-relaxed text-[#8b8178]">
                  {collection.description || 'No description yet.'}
                </p>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-taupe">
                    Sort {collection.sortOrder}
                  </span>
                  <CollectionRowActions
                    collection={{
                      id: collection.id,
                      name: collection.name,
                      isVisible: collection.isVisible,
                    }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
