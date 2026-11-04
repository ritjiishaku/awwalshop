import { notFound } from 'next/navigation'
import PageHeader from '@/components/admin/PageHeader'
import CategoryForm from '@/components/admin/CategoryForm'
import CategoryRowActions from '@/components/admin/CategoryRowActions'
import { getAdminCategory, getCategoryParentOptions } from '@/lib/queries'
import type { CategoryInput } from '@/lib/validations'

interface EditCategoryPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params
  const [category, parents] = await Promise.all([
    getAdminCategory(id),
    getCategoryParentOptions(id),
  ])

  if (!category) notFound()

  const initialValues: CategoryInput = {
    name: category.name,
    slug: category.slug,
    description: category.description ?? '',
    imageUrl: category.imageUrl ?? '',
    parentId: category.parentId ?? '',
    sortOrder: category.sortOrder,
    isVisible: category.isVisible,
  }

  return (
    <div>
      <PageHeader
        eyebrow="Taxonomy"
        title={category.name}
        description={`${category._count.products} products · ${category._count.children} subcategories`}
        actions={
          <CategoryRowActions
            category={{ id: category.id, name: category.name, isVisible: category.isVisible }}
          />
        }
      />
      <CategoryForm mode="edit" categoryId={category.id} parents={parents} initialValues={initialValues} />
    </div>
  )
}
