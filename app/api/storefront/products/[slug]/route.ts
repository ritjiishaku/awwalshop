import { getProductBySlug } from '@/lib/storefront'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  if (!slug || slug.length > 200) {
    return Response.json({ error: 'Invalid product slug.' }, { status: 400 })
  }

  const product = await getProductBySlug(slug)
  if (!product) {
    return Response.json({ error: 'Product not found.' }, { status: 404 })
  }

  return Response.json({
    product: {
      id: product.id,
      slug: product.slug,
      name: product.name,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      regularPrice: product.regularPrice.toString(),
      discountPrice: product.discountPrice?.toString() ?? null,
      currency: product.currency,
      showPrice: product.showPrice,
      availability: product.availability,
      material: product.material,
      colour: product.colour,
      size: product.size,
      category: product.category ? { name: product.category.name } : null,
      media: product.media
        .filter((media) => media.mediaType === 'IMAGE')
        .map((media) => ({ url: media.url, altText: media.altText })),
      variants: product.variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        value: variant.value,
        priceModifier: variant.priceModifier.toString(),
        availability: variant.availability,
      })),
    },
  })
}
