import Link from 'next/link'
import Image from 'next/image'
import { Layers, Plus } from 'lucide-react'
import PageHeader from '@/components/admin/PageHeader'
import EmptyState from '@/components/admin/EmptyState'
import CategoryRowActions from '@/components/admin/CategoryRowActions'
import { getAdminCategories } from '@/lib/queries'

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories()

  const bySort = (
    a: (typeof categories)[number],
    b: (typeof categories)[number]
  ) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)

  const parents = categories.filter((category) => !category.parentId).sort(bySort)
  const ordered: { category: (typeof categories)[number]; depth: number }[] = []

  for (const parent of parents) {
    ordered.push({ category: parent, depth: 0 })
    for (const child of categories
      .filter((category) => category.parentId === parent.id)
      .sort(bySort)) {
      ordered.push({ category: child, depth: 1 })
    }
  }

  for (const category of categories) {
    if (!ordered.some((item) => item.category.id === category.id)) {
      ordered.push({ category, depth: 0 })
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Taxonomy"
        title="Categories"
        description="Organise the catalogue into a clear hierarchy. Categories power storefront navigation and filtering."
        actions={
          <Link href="/admin/categories/new" className="btn btn-primary btn-sm">
            <Plus size={14} />
            New category
          </Link>
        }
      />

      {ordered.length === 0 ? (
        <EmptyState
          icon={<Layers size={22} />}
          title="No categories yet"
          description="Create your first category to start organising products."
          action={
            <Link href="/admin/categories/new" className="btn btn-primary btn-sm">
              <Plus size={14} />
              Add category
            </Link>
          }
        />
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center gap-2 px-1 text-[11px] text-taupe">
            <span className="rounded-full border border-line bg-white/70 px-3 py-1">
              <span className="font-semibold text-espresso">{parents.length}</span>{' '}
              top-level
            </span>
            <span className="rounded-full border border-line bg-white/70 px-3 py-1">
              <span className="font-semibold text-espresso">
                {categories.length - parents.length}
              </span>{' '}
              subcategories
            </span>
            <span className="rounded-full border border-line bg-white/70 px-3 py-1">
              <span className="font-semibold text-espresso">
                {categories.filter((category) => category.isVisible).length}
              </span>{' '}
              visible
            </span>
          </div>

          <div className="surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left">
                <thead>
                  <tr className="border-b border-line bg-[#faf7f1] text-[9.5px] uppercase tracking-[0.14em] text-taupe">
                    <th className="px-5 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Parent</th>
                    <th className="px-4 py-3 font-semibold">Products</th>
                    <th className="px-4 py-3 font-semibold">Sort</th>
                    <th className="px-4 py-3 font-semibold">Visibility</th>
                    <th className="px-5 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {ordered.map(({ category, depth }) => (
                    <tr
                      key={category.id}
                      className="group transition-colors hover:bg-[#fbf9f5]"
                    >
                      <td className="px-5 py-3">
                        <div
                          className="flex items-center gap-3"
                          style={{ paddingLeft: depth * 22 }}
                        >
                          {depth > 0 && (
                            <span className="-ml-2 text-[#c5a46d]" aria-hidden>
                              <span className="block h-3 w-2 rounded-bl-md border-b border-l border-[#d9cdbb]" />
                            </span>
                          )}
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-line bg-[#f8f5ef]">
                            {category.imageUrl ? (
                              <Image
                                src={category.imageUrl}
                                alt={category.name}
                                width={40}
                                height={40}
                                unoptimized
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#c5a46d]">
                                <Layers size={15} />
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/admin/categories/${category.id}`}
                              className="text-[13px] font-semibold text-espresso transition-colors hover:text-[#a7823d]"
                            >
                              {category.name}
                            </Link>
                            <p className="mt-0.5 font-mono text-[10px] text-taupe">
                              /{category.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#8b8178]">
                        {category.parent?.name || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-espresso">
                        <span className="font-semibold">{category._count.products}</span>
                        {category._count.children > 0 && (
                          <span className="text-[#8b8178]">
                            {' '}
                            · {category._count.children} subcategories
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#8b8178]">
                        {category.sortOrder}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`status-pill ${
                            category.isVisible
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border-line bg-[#faf7f1] text-taupe'
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {category.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <CategoryRowActions
                          category={{
                            id: category.id,
                            name: category.name,
                            isVisible: category.isVisible,
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
