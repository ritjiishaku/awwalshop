import Link from 'next/link'
import { Plus } from 'lucide-react'
import PageHeader from '@/components/admin/PageHeader'
import MediaLibrary from '@/components/admin/MediaLibrary'
import { getAdminMediaAssets } from '@/lib/queries'

export const metadata = {
  title: 'Media Library | AWWALSHOP CMS',
}

export default async function AdminMediaPage() {
  const assets = await getAdminMediaAssets()

  return (
    <div>
      <PageHeader
        eyebrow="Assets"
        title="Media Library"
        description="Every image and video attached to your catalogue. Upload new files from a product editor, then copy a URL wherever it is needed."
        actions={
          <Link href="/admin/products/new" className="btn btn-primary btn-sm">
            <Plus size={14} />
            New product
          </Link>
        }
      />

      <MediaLibrary
        assets={assets.map((asset) => ({
          id: asset.id,
          url: asset.url,
          thumbnailUrl: asset.thumbnailUrl,
          altText: asset.altText,
          caption: asset.caption,
          mediaType: asset.mediaType,
          sourceType: asset.sourceType,
          createdAt: asset.createdAt.toISOString(),
          product: asset.product,
        }))}
      />
    </div>
  )
}
