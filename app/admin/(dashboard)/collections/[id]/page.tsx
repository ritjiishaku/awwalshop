import { notFound } from 'next/navigation'
import PageHeader from '@/components/admin/PageHeader'
import CollectionForm from '@/components/admin/CollectionForm'
import CollectionRowActions from '@/components/admin/CollectionRowActions'
import { getAdminCollection } from '@/lib/queries'
import type { CollectionInput } from '@/lib/validations'

interface EditCollectionPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCollectionPage({ params }: EditCollectionPageProps) {
  const { id } = await params
  const collection = await getAdminCollection(id)

  if (!collection) notFound()

  const initialValues: CollectionInput = {
    name: collection.name,
    slug: collection.slug,
    description: collection.description ?? '',
    bannerUrl: collection.bannerUrl ?? '',
    isVisible: collection.isVisible,
    sortOrder: collection.sortOrder,
  }

  return (
    <div>
      <PageHeader
        eyebrow="Merchandising"
        title={collection.name}
        description={`${collection._count.products} products in this collection`}
        actions={
          <CollectionRowActions
            collection={{
              id: collection.id,
              name: collection.name,
              isVisible: collection.isVisible,
            }}
          />
        }
      />
      <CollectionForm mode="edit" collectionId={collection.id} initialValues={initialValues} />
    </div>
  )
}
