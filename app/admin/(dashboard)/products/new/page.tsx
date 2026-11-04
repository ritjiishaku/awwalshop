import PageHeader from '@/components/admin/PageHeader'
import ProductForm from '@/components/admin/ProductForm'
import { getProductFormOptions } from '@/lib/queries'

export default async function NewProductPage() {
  const { categories, collections } = await getProductFormOptions()

  return (
    <div>
      <PageHeader
        eyebrow="Inventory"
        title="New product"
        description="Create a new catalogue piece. Save as a draft first, then publish when the details and media are ready."
      />
      <ProductForm
        mode="create"
        categories={categories}
        collections={collections}
      />
    </div>
  )
}
