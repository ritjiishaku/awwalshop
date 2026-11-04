import PageHeader from '@/components/admin/PageHeader'
import CollectionForm from '@/components/admin/CollectionForm'

export default function NewCollectionPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Merchandising"
        title="New collection"
        description="Create a curated edit. Products can be added from the product editor."
      />
      <CollectionForm mode="create" />
    </div>
  )
}
