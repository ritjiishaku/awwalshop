import PageHeader from '@/components/admin/PageHeader'
import CategoryForm from '@/components/admin/CategoryForm'
import { getCategoryParentOptions } from '@/lib/queries'

export default async function NewCategoryPage() {
  const parents = await getCategoryParentOptions()

  return (
    <div>
      <PageHeader
        eyebrow="Taxonomy"
        title="New category"
        description="Create a top-level category or nest it beneath an existing one."
      />
      <CategoryForm mode="create" parents={parents} />
    </div>
  )
}
