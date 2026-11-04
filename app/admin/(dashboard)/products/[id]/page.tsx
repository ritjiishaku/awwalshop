import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import PageHeader from '@/components/admin/PageHeader'
import ProductForm from '@/components/admin/ProductForm'
import ProductRowActions from '@/components/admin/ProductRowActions'
import { getAdminProduct, getProductFormOptions } from '@/lib/queries'
import type { ProductInput } from '@/lib/validations'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const [product, { categories, collections }] = await Promise.all([
    getAdminProduct(id),
    getProductFormOptions(),
  ])

  if (!product) notFound()

  const initialValues: ProductInput = {
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription ?? '',
    fullDescription: product.fullDescription ?? '',
    sku: product.sku ?? '',
    categoryId: product.categoryId ?? '',
    regularPrice: product.regularPrice.toNumber(),
    discountPrice: product.discountPrice ? product.discountPrice.toNumber() : null,
    currency: product.currency,
    showPrice: product.showPrice,
    material: product.material ?? '',
    colour: product.colour ?? '',
    size: product.size ?? '',
    weight: product.weight ?? '',
    customAttributes:
      product.customAttributes &&
      typeof product.customAttributes === 'object' &&
      !Array.isArray(product.customAttributes)
        ? Object.entries(product.customAttributes)
            .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
            .map(([name, value]) => ({ name, value }))
        : [],
    processingTime: product.processingTime ?? '',
    deliveryInfo: product.deliveryInfo ?? '',
    status: product.status,
    availability: product.availability,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    seoTitle: product.seoTitle ?? '',
    seoDescription: product.seoDescription ?? '',
    seoImage: product.seoImage ?? '',
    collectionIds: product.collections.map((item) => item.collectionId),
    media: product.media.map((item) => ({
      mediaType: item.mediaType,
      sourceType: item.sourceType,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl ?? '',
      altText: item.altText ?? '',
      caption: item.caption ?? '',
      sortOrder: item.sortOrder,
      isPrimary: item.isPrimary,
      publicId: item.publicId ?? '',
    })),
    variants: product.variants.map((variant) => ({
      name: variant.name,
      value: variant.value,
      priceModifier: variant.priceModifier.toNumber(),
      availability: variant.availability,
      sortOrder: variant.sortOrder,
    })),
  }

  return (
    <div>
      <PageHeader
        eyebrow="Inventory"
        title={product.name}
        description={`Last updated ${product.updatedAt.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })}. Edit the product details, media, variants and publishing state.`}
        actions={
          <>
            {product.status === 'PUBLISHED' && (
              <Link
                href={`/products/${product.slug}`}
                target="_blank"
                className="btn btn-secondary btn-sm"
              >
                <ExternalLink size={14} />
                View live
              </Link>
            )}
            <ProductRowActions
              product={{
                id: product.id,
                name: product.name,
                status: product.status,
                isFeatured: product.isFeatured,
              }}
            />
          </>
        }
      />
      <ProductForm
        mode="edit"
        productId={product.id}
        categories={categories}
        collections={collections}
        initialValues={initialValues}
      />
    </div>
  )
}
